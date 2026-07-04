import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Sparkles, Sliders, Image, Video, Wand2, Compass, Play, Loader2, ArrowRight } from 'lucide-react';
import { useVideoStore } from '../store/videoStore';
import { useAuthStore } from '../store/authStore';
import GlassCard from '../components/GlassCard';

export default function GenerateVideo() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      prompt: '',
      negativePrompt: '',
      model: 'seedance-v2',
      resolution: '1080p',
      aspectRatio: '16:9',
      duration: 5,
      cameraMotion: 'None',
      stylePreset: 'None',
      seed: '',
      creativityLevel: 5,
      fps: 24,
      numVideos: 1
    }
  });

  const { user } = useAuthStore();
  const { generateVideo, activeJobs, error: generateError } = useVideoStore();
  const [isLoading, setIsLoading] = useState(false);
  const [successJob, setSuccessJob] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [formErr, setFormErr] = useState('');

  const duration = watch('duration');
  const numVideos = watch('numVideos');
  const creditCost = duration * 3 * numVideos;

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSuccessJob('');
    setFormErr('');

    if (user && user.credits < creditCost) {
      setFormErr(`Insufficient credits. You need ${creditCost} credits, but only have ${user.credits}.`);
      setIsLoading(false);
      return;
    }

    try {
      const options = {
        ...data,
        seed: data.seed ? parseInt(data.seed) : Math.floor(Math.random() * 1000000),
        imageFile: imageFile ? imageFile.name : null,
        videoFile: videoFile ? videoFile.name : null
      };

      const jobId = await generateVideo(options);
      setSuccessJob(jobId);
      setValue('prompt', '');
      setImageFile(null);
      setVideoFile(null);
    } catch (err) {
      setFormErr(err.message || 'Video job dispatch failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
      <div className="absolute top-0 left-0 w-80 h-80 radial-glow-cyan opacity-25 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 radial-glow-purple opacity-20 pointer-events-none" />

      {/* Generate Form - Takes 2 cols */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-heading">Render Settings</h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyber-purple">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>Seedance Engine: Online</span>
          </div>
        </div>

        <GlassCard className="bg-[#0d0b18]/40 p-6 md:p-8 border-cyber-purple/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {(formErr || generateError) && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-medium text-left">
                {formErr || generateError}
              </div>
            )}

            {/* Prompt Input */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center justify-between">
                <span>Prompt Input</span>
                <span className="text-[10px] text-zinc-500 font-mono">English only</span>
              </label>
              <textarea
                {...register("prompt", { required: "Prompt is required" })}
                rows="3"
                className={`w-full p-4 bg-zinc-950 border rounded-xl text-sm text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-600 focus:border-cyber-purple ${
                  errors.prompt ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800'
                }`}
                placeholder="Enter prompt: e.g., 'A hyper-realistic close up shot of a cybernetic warrior in red neon rain, cinematic light, 8k resolution...'"
              />
              {errors.prompt && (
                <span className="text-[10px] text-red-400 font-medium">{errors.prompt.message}</span>
              )}
            </div>

            {/* Negative Prompt */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Negative Prompt (Optional)</label>
              <input
                type="text"
                {...register("negativePrompt")}
                className="w-full px-4 py-3.5 bg-zinc-950 border border-zinc-800 focus:border-cyber-purple rounded-xl text-sm text-zinc-200 focus:outline-none transition-all placeholder:text-zinc-700"
                placeholder="blurry, low resolution, bad hands, deformed faces, watermark..."
              />
            </div>

            {/* Reference Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image Input */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Image Reference (Optional)</label>
                <div className="relative border border-dashed border-zinc-800 hover:border-cyber-purple/40 rounded-xl bg-zinc-950/40 p-4 transition-colors flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                    <Image className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-zinc-300 font-semibold block truncate max-w-[180px]">
                      {imageFile ? imageFile.name : 'Upload reference image'}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">PNG, JPG up to 10MB</span>
                  </div>
                </div>
              </div>

              {/* Video Input */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Video Reference (Optional)</label>
                <div className="relative border border-dashed border-zinc-800 hover:border-cyber-purple/40 rounded-xl bg-zinc-950/40 p-4 transition-colors flex items-center gap-3">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-zinc-300 font-semibold block truncate max-w-[180px]">
                      {videoFile ? videoFile.name : 'Upload motion guide'}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">MP4, MOV up to 50MB</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-zinc-850" />

            {/* Model and Settings Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              
              {/* AI Model */}
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">AI Model</label>
                <select
                  {...register("model")}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyber-purple rounded-xl text-xs text-zinc-300 focus:outline-none transition-all"
                >
                  <option value="seedance-v2">Seedance v2 (Native)</option>
                  <option value="runway-gen3">Runway Gen-3</option>
                  <option value="kling-1.5">Kling 1.5 Pro</option>
                  <option value="veo">Google Veo 8K</option>
                  <option value="pika-2.0">Pika 2.0</option>
                </select>
              </div>

              {/* Resolution */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Resolution</label>
                <select
                  {...register("resolution")}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyber-purple rounded-xl text-xs text-zinc-300 focus:outline-none transition-all"
                >
                  <option value="1080p">1080p Full HD</option>
                  <option value="720p">720p HD</option>
                  <option value="4k">4K Cinematic</option>
                </select>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Aspect Ratio</label>
                <select
                  {...register("aspectRatio")}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyber-purple rounded-xl text-xs text-zinc-300 focus:outline-none transition-all"
                >
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Portrait</option>
                  <option value="1:1">1:1 Square</option>
                  <option value="2.35:1">2.35:1 Anamorphic</option>
                </select>
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Duration (Sec)</label>
                <select
                  {...register("duration")}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyber-purple rounded-xl text-xs text-zinc-300 focus:outline-none transition-all"
                >
                  <option value="5">5 Seconds</option>
                  <option value="10">10 Seconds</option>
                  <option value="15">15 Seconds</option>
                </select>
              </div>

              {/* Camera Motion */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Camera Motion</label>
                <select
                  {...register("cameraMotion")}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyber-purple rounded-xl text-xs text-zinc-300 focus:outline-none transition-all"
                >
                  <option value="None">None</option>
                  <option value="Zoom In">Zoom In</option>
                  <option value="Zoom Out">Zoom Out</option>
                  <option value="Pan Left">Pan Left</option>
                  <option value="Pan Right">Pan Right</option>
                  <option value="Orbit Left">Orbit Left</option>
                </select>
              </div>

              {/* Style Preset */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Style Preset</label>
                <select
                  {...register("stylePreset")}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyber-purple rounded-xl text-xs text-zinc-300 focus:outline-none transition-all"
                >
                  <option value="None">Realistic</option>
                  <option value="Cyberpunk">Cyberpunk</option>
                  <option value="Steampunk">Steampunk</option>
                  <option value="Cinematic Space">Cinematic Space</option>
                  <option value="3D Anime">3D Anime</option>
                </select>
              </div>

              {/* Seed Value */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Seed (Optional)</label>
                <input
                  type="number"
                  {...register("seed")}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyber-purple rounded-xl text-xs text-zinc-300 focus:outline-none transition-all placeholder:text-zinc-700"
                  placeholder="Random"
                />
              </div>

              {/* FPS */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">FPS</label>
                <select
                  {...register("fps")}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyber-purple rounded-xl text-xs text-zinc-300 focus:outline-none transition-all"
                >
                  <option value="24">24 FPS (Film)</option>
                  <option value="30">30 FPS (Standard)</option>
                  <option value="60">60 FPS (Fluid)</option>
                </select>
              </div>

              {/* Creativity Level */}
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Creativity Level (Guidance Scale)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    {...register("creativityLevel")}
                    className="flex-1 accent-cyber-purple"
                  />
                  <span className="w-8 text-center text-xs text-zinc-300 font-mono font-bold bg-zinc-950 px-2 py-1 border border-zinc-850 rounded">
                    {watch('creativityLevel')}
                  </span>
                </div>
              </div>

              {/* Number of videos */}
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Batch Quantity (Videos)</label>
                <select
                  {...register("numVideos")}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyber-purple rounded-xl text-xs text-zinc-300 focus:outline-none transition-all"
                >
                  <option value="1">1 Video</option>
                  <option value="2">2 Videos</option>
                  <option value="4">4 Videos</option>
                </select>
              </div>

            </div>

            {/* Submit Block */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-850">
              <div className="flex items-center gap-3 text-left">
                <div className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">Credit Cost</span>
                  <span className="text-base font-extrabold font-heading text-cyber-pink font-mono">{creditCost} credits</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">Credits Available</span>
                  <span className="text-xs text-zinc-300 font-semibold">{user?.credits ?? 0} cr</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3.5 bg-cyber-purple hover:bg-cyber-purple/90 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyber-purple/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>Queuing Job...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4.5 h-4.5 fill-current" />
                    <span>Generate Video</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </GlassCard>
      </div>

      {/* Render Queue Progress Monitoring - Takes 1 col */}
      <div className="lg:col-span-1 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-heading">Render Queue</h2>
          <span className="text-xs text-zinc-500 font-mono">Jobs: {activeJobs.length} active</span>
        </div>

        <GlassCard className="min-h-[480px] border-cyber-purple/10">
          {activeJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-[420px] text-zinc-500 gap-3">
              <Loader2 className="w-10 h-10 opacity-30 text-cyber-purple" />
              <div className="space-y-1.5">
                <span className="text-xs font-semibold block text-zinc-400">Queue is empty</span>
                <p className="text-[10px] leading-relaxed max-w-[200px] block mx-auto">
                  Configure settings and launch a new job to track processing progress.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="bg-zinc-950/60 p-4 border border-cyber-purple/20 rounded-xl text-left space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-zinc-400 font-medium">{job.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                      job.status === 'QUEUED' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <p className="text-zinc-300 text-xs italic truncate font-medium">"{job.prompt}"</p>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-cyber-purple transition-all duration-350" style={{ width: `${job.progress}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-medium">
                    <span>ETA: {job.eta}s</span>
                    <span>Cost: {job.credits_used} credits</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

    </div>
  );
}
