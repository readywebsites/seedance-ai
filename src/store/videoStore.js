import { create } from 'zustand';
import { api, useAuthStore } from './authStore';

export const useVideoStore = create((set, get) => ({
  videos: [],
  activeJobs: [],
  isLoading: false,
  error: null,

  fetchHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/video/history/');
      set({ videos: response.data, isLoading: false });
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to fetch video history.';
      set({ isLoading: false, error: errMsg });
    }
  },

  generateVideo: async (options) => {
    const deductCredits = useAuthStore.getState().deductCredits;
    const user = useAuthStore.getState().user;
    
    const creditsCost = (options.duration || 5) * 3 * (options.numVideos || 1);
    
    if (user && user.credits < creditsCost) {
      throw new Error(`Insufficient credits. Required: ${creditsCost}, Available: ${user.credits}`);
    }

    set({ error: null });

    try {
      // POST to Django REST API
      const response = await api.post('/video/generate/', options);
      const { job_id, status: jobStatus, eta } = response.data;
      
      const newJob = {
        id: job_id,
        prompt: options.prompt,
        negative_prompt: options.negativePrompt || '',
        model: options.model || 'seedance-v2',
        resolution: options.resolution || '1080p',
        aspect_ratio: options.aspectRatio || '16:9',
        duration: options.duration || 5,
        camera_motion: options.cameraMotion || 'None',
        style_preset: options.stylePreset || 'None',
        seed: options.seed || null,
        status: jobStatus,
        progress: 0,
        eta: eta,
        created_at: new Date().toISOString(),
        credits_used: creditsCost,
      };

      // Deduct local credits to keep state instant, then append active queue
      deductCredits(creditsCost);
      set(state => ({ activeJobs: [newJob, ...state.activeJobs] }));
      
      // Start polling status
      get().startPolling(job_id);
      
      return job_id;
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.detail || 'API dispatch failed. Backend is offline.';
      set({ error: errMsg });
      throw new Error(errMsg);
    }
  },

  startPolling: (jobId) => {
    // Avoid double polling registrations
    const activeJobs = get().activeJobs;
    const targetJob = activeJobs.find(j => j.id === jobId);
    if (!targetJob || targetJob.pollIntervalId) return;

    const intervalId = setInterval(async () => {
      try {
        const response = await api.get(`/video/status/${jobId}/`);
        const { status, progress, eta, video_url } = response.data;

        // If completed
        if (status === 'COMPLETED') {
          clearInterval(intervalId);
          
          set(state => {
            const job = state.activeJobs.find(j => j.id === jobId) || {};
            const completedVideo = {
              ...job,
              id: jobId,
              status: 'COMPLETED',
              video_url: video_url || '/cyberpunk.jpg',
              progress: 100,
              eta: 0,
            };

            return {
              videos: [completedVideo, ...state.videos],
              activeJobs: state.activeJobs.filter(j => j.id !== jobId),
            };
          });

          // Refresh user profile balance
          useAuthStore.getState().fetchProfile();

          if (Notification.permission === 'granted') {
            new Notification('AI Generation Complete!', {
              body: 'Your custom video output is ready for download.',
              icon: video_url || '/cyberpunk.jpg'
            });
          }
        } 
        // If failed or cancelled
        else if (status === 'FAILED' || status === 'CANCELLED') {
          clearInterval(intervalId);
          set(state => ({
            activeJobs: state.activeJobs.filter(j => j.id !== jobId),
            error: `Rendering job ${jobId} failed on provider side. Credits refunded.`,
          }));

          useAuthStore.getState().fetchProfile();

          if (Notification.permission === 'granted') {
            new Notification('AI Generation Failed', {
              body: `Generation job ${jobId} did not complete successfully.`,
            });
          }
        } 
        // If still queued/processing
        else {
          set(state => ({
            activeJobs: state.activeJobs.map(j => 
              j.id === jobId ? { ...j, status, progress, eta } : j
            )
          }));
        }
      } catch (err) {
        console.error(`Status polling failed for Job ${jobId}. Retrying...`, err);
      }
    }, 3000);

    // Save interval ID to avoid leaks
    set(state => ({
      activeJobs: state.activeJobs.map(j => 
        j.id === jobId ? { ...j, pollIntervalId: intervalId } : j
      )
    }));
  },

  deleteVideo: async (id) => {
    try {
      await api.delete(`/video/delete/${id}/`);
      set(state => ({
        videos: state.videos.filter(v => v.id !== id)
      }));
    } catch (err) {
      console.error('Failed to delete video item.', err);
    }
  },

  toggleFavorite: (id) => {
    // Local visual toggle representation
    set(state => ({
      videos: state.videos.map(v => 
        v.id === id ? { ...v, is_favorite: !v.is_favorite } : v
      )
    }));
  }
}));
