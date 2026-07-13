import React, { useState } from 'react';
import { Play, Pause, Download, Share2, Copy, Trash2, Heart, Info, RotateCcw, Volume2, Maximize } from 'lucide-react';
import { useVideoStore } from '../store/videoStore';

export default function VideoPlayer({ video, onDeleteSuccess }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const toggleFavorite = useVideoStore(state => state.toggleFavorite);
  const deleteVideo = useVideoStore(state => state.deleteVideo);

  if (!video) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + video.video_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Seedance AI Video',
        text: video.prompt,
        url: window.location.origin + video.video_url,
      });
    } else {
      handleCopyLink();
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this generation?')) {
      deleteVideo(video.id);
      if (onDeleteSuccess) onDeleteSuccess();
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Player Container */}
      <div className="relative rounded-2xl overflow-hidden aspect-video bg-zinc-950 border border-zinc-800 group shadow-2xl">
        {/* Mock Video/Image */}
        <img
          src={video.video_url}
          alt={video.prompt}
          className={`w-full h-full object-cover select-none transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
        />

        {/* Overlay Play State */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <button
              onClick={() => setIsPlaying(true)}
              className="p-5 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white shadow-lg transition-transform hover:scale-110 cursor-pointer"
            >
              <Play className="w-8 h-8 fill-current translate-x-0.5" />
            </button>
          </div>
        )}

        {/* Video HUD controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between text-zinc-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 hover:text-white cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
            <button
              onClick={() => setIsPlaying(false)}
              className="p-1.5 hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-medium">
              {isPlaying ? '0:03' : '0:00'} / 0:0{video.duration}
            </span>
          </div>

          {/* Simple progress bar */}
          <div className="flex-1 mx-4 h-1 bg-zinc-700/60 rounded-full overflow-hidden relative cursor-pointer">
            <div
              className={`absolute top-0 left-0 bottom-0 bg-brand-purple rounded-full ${isPlaying ? 'w-[60%] transition-all duration-[3000ms] ease-linear' : 'w-0'}`}
            />
          </div>

          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 hover:text-white cursor-pointer" />
            <Maximize className="w-5 h-5 hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Floating Tag */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-brand-cyan border border-brand-cyan/20">
          {video.model}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-xl gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(video.id)}
            className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
              video.is_favorite
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20'
                : 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Favorite"
          >
            <Heart className={`w-5 h-5 ${video.is_favorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleCopyLink}
            className={`p-2.5 rounded-lg border transition-colors flex items-center gap-2 cursor-pointer ${
              copied
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                : 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Copy className="w-5 h-5" />
            <span className="text-xs font-medium hidden sm:inline">{copied ? 'Copied' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-lg border bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs font-medium hidden sm:inline">Share</span>
          </button>

          <a
            href={video.video_url}
            download={`seedance-${video.id}.jpg`}
            className="p-2.5 rounded-lg border bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span className="text-xs font-medium hidden sm:inline">Download</span>
          </a>
        </div>

        <button
          onClick={handleDelete}
          className="p-2.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Prompt and Metadata Section */}
      <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-xl flex flex-col gap-4">
        <div>
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Prompt</div>
          <p className="text-zinc-200 leading-relaxed text-sm bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/50 select-text">
            {video.prompt}
          </p>
        </div>

        {video.negative_prompt && (
          <div>
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Negative Prompt</div>
            <p className="text-zinc-400 text-sm bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/50 select-text">
              {video.negative_prompt}
            </p>
          </div>
        )}

        <div className="border-t border-zinc-800 pt-4 mt-1">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-xs font-medium text-brand-purple hover:text-brand-purple/90 transition-colors cursor-pointer"
          >
            <Info className="w-4 h-4" />
            {showDetails ? 'Hide Generation Settings' : 'Show Generation Settings'}
          </button>

          {showDetails && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
              <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/40">
                <span className="text-zinc-500 block mb-1">Resolution</span>
                <span className="text-zinc-300 font-mono font-medium">{video.resolution}</span>
              </div>
              <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/40">
                <span className="text-zinc-500 block mb-1">Aspect Ratio</span>
                <span className="text-zinc-300 font-mono font-medium">{video.aspect_ratio}</span>
              </div>
              <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/40">
                <span className="text-zinc-500 block mb-1">Duration</span>
                <span className="text-zinc-300 font-mono font-medium">{video.duration} seconds</span>
              </div>
              <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/40">
                <span className="text-zinc-500 block mb-1">Camera Motion</span>
                <span className="text-zinc-300 font-medium">{video.camera_motion}</span>
              </div>
              <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/40">
                <span className="text-zinc-500 block mb-1">Style Preset</span>
                <span className="text-zinc-300 font-medium">{video.style_preset}</span>
              </div>
              <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/40">
                <span className="text-zinc-500 block mb-1">Seed</span>
                <span className="text-zinc-300 font-mono font-medium">{video.seed}</span>
              </div>
              <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/40">
                <span className="text-zinc-500 block mb-1">FPS</span>
                <span className="text-zinc-300 font-mono font-medium">{video.fps}</span>
              </div>
              <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/40">
                <span className="text-zinc-500 block mb-1">Credits Spent</span>
                <span className="text-zinc-300 font-mono font-medium text-brand-magenta">{video.credits_used} credits</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
