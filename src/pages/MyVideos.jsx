import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Play, Star, Calendar, Trash2 } from 'lucide-react';
import { useVideoStore } from '../store/videoStore';
import GlassCard from '../components/GlassCard';
import VideoPlayer from '../components/VideoPlayer';

export default function MyVideos() {
  const { videos, fetchHistory } = useVideoStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState('All');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('Newest');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Extract unique models for filter dropdown
  const uniqueModels = ['All', ...new Set(videos.map(v => v.model))];

  // Filtering logic
  const filteredVideos = videos
    .filter(v => v.status === 'COMPLETED')
    .filter(v => v.prompt.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(v => selectedModel === 'All' || v.model === selectedModel)
    .filter(v => !filterFavorites || v.is_favorite);

  // Sorting logic
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === 'Newest') {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (sortBy === 'Oldest') {
      return new Date(a.created_at) - new Date(b.created_at);
    }
    if (sortBy === 'Duration') {
      return b.duration - a.duration;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/40 p-4 border border-zinc-800/80 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search prompt keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 focus:border-brand-purple rounded-xl text-xs text-zinc-300 focus:outline-none transition-all placeholder:text-zinc-600"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Model Filter */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-zinc-950 border border-zinc-850 py-1.5 px-3 rounded-lg text-zinc-300 focus:outline-none"
            >
              {uniqueModels.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-950 border border-zinc-850 py-1.5 px-3 rounded-lg text-zinc-300 focus:outline-none"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Duration">Longest Duration</option>
            </select>
          </div>

          {/* Favorites Filter */}
          <button
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              filterFavorites
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Favorites Only
          </button>
        </div>
      </div>

      {/* Videos Grid */}
      {sortedVideos.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center text-center h-[350px] text-zinc-500 gap-3">
          <Calendar className="w-10 h-10 opacity-30 text-brand-purple" />
          <div className="space-y-1">
            <span className="text-xs font-semibold block text-zinc-400">No videos found</span>
            <span className="text-[10px] leading-relaxed max-w-[220px] block">
              Try adjusting your query searches, clearing filters, or rendering a new prompt.
            </span>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVideos.map((video) => (
            <GlassCard
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="p-3.5 cursor-pointer group flex flex-col justify-between h-[250px]"
            >
              <div className="aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 relative">
                <img
                  src={video.video_url}
                  alt={video.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-3 rounded-full bg-brand-purple text-white shadow-lg">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </div>

                {video.is_favorite && (
                  <span className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 border border-zinc-800 text-rose-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </span>
                )}
                
                <span className="absolute bottom-2 left-2 bg-black/70 border border-white/5 px-2 py-0.5 rounded text-[9px] font-mono text-brand-cyan uppercase">
                  {video.model}
                </span>
              </div>

              <div className="pt-3 text-left space-y-1">
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-semibold">
                  <span>Duration: {video.duration}s</span>
                  <span>{new Date(video.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-zinc-300 text-xs italic truncate font-medium">"{video.prompt}"</p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

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
