import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, HelpCircle, AlertCircle, Play, Layers, CreditCard, KeyRound, Clock, Plus, Star } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useVideoStore } from '../store/videoStore';
import GlassCard from '../components/GlassCard';
import VideoPlayer from '../components/VideoPlayer';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { videos, activeJobs, fetchHistory } = useVideoStore();
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const completedVideos = videos.filter(v => v.status === 'COMPLETED').slice(0, 4);

  return (
    <div className="space-y-6 relative">
      {/* Background radial overlays specific to dashboard */}
      <div className="absolute top-0 left-0 w-80 h-80 radial-glow-blue opacity-30 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 radial-glow-purple opacity-20 pointer-events-none" />

      {/* Welcome Cockpit Banner */}
      <div className="bg-gradient-to-r from-[#0d0b18]/90 via-[#0d0b18]/70 to-cyber-purple/10 border border-cyber-purple/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden group shadow-lg neon-border-purple">
        <div className="absolute top-0 right-0 w-64 h-64 radial-glow-purple opacity-30 pointer-events-none group-hover:opacity-45 transition-opacity" />
        <div className="relative z-10 space-y-2 text-left">
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white flex items-center gap-2">
            <span>Welcome, {user?.name || 'Creator'}</span>
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
          </h2>
          <p className="text-zinc-400 text-sm max-w-lg leading-relaxed">
            Welcome back to your video generation hub. Start rendering scenes or review your active worker queues.
          </p>
        </div>
        <button
          onClick={() => navigate('/generate')}
          className="px-5 py-3 bg-cyber-purple hover:bg-cyber-purple/90 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyber-purple/10 hover:shadow-cyber-purple/20 transition-transform hover:-translate-y-0.5 relative z-10 cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>New Video</span>
        </button>
      </div>

      {/* Futuristic Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard hoverGlow={true} className="p-5 flex items-center gap-4 border-cyber-purple/15 hover:border-cyber-purple/40 neon-border-purple">
          <div className="p-3.5 bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple rounded-xl">
            <Video className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">Total Generations</span>
            <span className="text-2xl font-bold font-heading text-zinc-100">{videos.length}</span>
          </div>
        </GlassCard>

        <GlassCard hoverGlow={true} className="p-5 flex items-center gap-4 border-cyber-pink/15 hover:border-cyber-pink/40 neon-border-blue">
          <div className="p-3.5 bg-cyber-pink/10 border border-cyber-pink/20 text-cyber-pink rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">Remaining Credits</span>
            <span className="text-2xl font-bold font-heading text-zinc-100">{user?.credits ?? 0}</span>
          </div>
        </GlassCard>

        <GlassCard hoverGlow={true} className="p-5 flex items-center gap-4 border-cyber-cyan/15 hover:border-cyber-cyan/40 neon-border-cyan">
          <div className="p-3.5 bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan rounded-xl">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">Running Jobs</span>
            <span className="text-2xl font-bold font-heading text-zinc-100">{activeJobs.length}</span>
          </div>
        </GlassCard>

        <GlassCard hoverGlow={true} className="p-5 flex items-center gap-4 border-zinc-800 hover:border-zinc-700">
          <div className="p-3.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-xl">
            <KeyRound className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">Developer API Keys</span>
            <span className="text-2xl font-bold font-heading text-zinc-100">2</span>
          </div>
        </GlassCard>
      </div>

      {/* Grid Layout for Queue and Recent Videos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Render Queue (Active Jobs) - Takes 1 col */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-heading">Render Queue</h3>
            <span className="text-[10px] text-cyber-cyan font-mono">Celery Broker: Online</span>
          </div>

          <GlassCard className="space-y-4 min-h-[320px] border-cyber-purple/10">
            {activeJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-[280px] text-zinc-500 gap-3">
                <Clock className="w-8 h-8 opacity-40 text-cyber-purple animate-pulse" />
                <div className="space-y-1">
                  <span className="text-xs font-semibold block text-zinc-400">Queue is Empty</span>
                  <span className="text-[10px] leading-relaxed block max-w-[200px]">Start a generation to populate active worker jobs.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4.5">
                {activeJobs.map((job) => (
                  <div key={job.id} className="bg-zinc-950/60 p-4 rounded-xl border border-cyber-purple/20 space-y-3.5 text-left">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-zinc-400 font-semibold">{job.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                        job.status === 'QUEUED' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' : 'bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple'
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    <p className="text-zinc-300 text-xs italic truncate font-medium">"{job.prompt}"</p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                        <span>Progress</span>
                        <span>{job.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyber-purple transition-all duration-500 rounded-full"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-semibold">
                      <span>Model: {job.model}</span>
                      <span>ETA: {job.eta}s</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Recent Videos - Takes 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-heading">Recent Generations</h3>
            <button
              onClick={() => navigate('/videos')}
              className="text-xs text-cyber-purple hover:text-cyber-purple/80 font-semibold transition-colors cursor-pointer"
            >
              View All History
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {completedVideos.length === 0 ? (
              <GlassCard className="col-span-2 flex flex-col items-center justify-center text-center h-[320px] text-zinc-500 gap-3 border-cyber-purple/10">
                <Video className="w-8 h-8 opacity-40 text-cyber-purple" />
                <div className="space-y-1">
                  <span className="text-xs font-semibold block text-zinc-400">No videos found</span>
                  <button
                    onClick={() => navigate('/generate')}
                    className="text-cyber-purple hover:underline text-xs block"
                  >
                    Start your first render now
                  </button>
                </div>
              </GlassCard>
            ) : (
              completedVideos.map((video) => (
                <GlassCard
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="p-3 cursor-pointer group flex flex-col justify-between h-[230px] border-cyber-purple/10 hover:border-cyber-cyan/40"
                >
                  <div className="aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 relative">
                    <img
                      src={video.video_url}
                      alt={video.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-3 rounded-full bg-cyber-purple text-white shadow-lg">
                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                      </div>
                    </div>
                    {video.is_favorite && (
                      <span className="absolute top-2 right-2 p-1 rounded-full bg-black/60 border border-zinc-800 text-rose-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </span>
                    )}
                  </div>
                  <div className="pt-2 text-left space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span>{video.model}</span>
                      <span>{new Date(video.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-zinc-300 text-xs italic truncate font-medium">"{video.prompt}"</p>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Video Detail Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 font-semibold cursor-pointer"
            >
              Close
            </button>
            <VideoPlayer video={selectedVideo} onDeleteSuccess={() => setSelectedVideo(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
