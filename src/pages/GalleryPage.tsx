import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../types';
import { api } from '../lib/api';
import { X, Calendar, Filter } from 'lucide-react';

interface GalleryPageProps {
  onNavigate: (path: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await api.getGallery();
        setItems(data);
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const categories = ['ALL', 'STORE', 'FASHION', 'LOOKS', 'NEW DROPS', 'EVENTS'];

  const filtered = selectedCategory === 'ALL'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#111815] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#134E35]">
            Visual Lookbook & Store Atmosphere
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#111815]">
            GALLERY
          </h1>
          <p className="text-xs sm:text-sm text-[#4F6256] leading-relaxed">
            A visual documentation of the NEWME Phoenix Marketcity Pune experience — architectural store features, styled mannequin rotations, and Pune community style moments.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-[#E1ECE5] pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#134E35] text-white shadow-xs'
                  : 'text-[#4A5D52] hover:bg-[#EBF3EE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-[#52665A] animate-pulse">
            Loading visual archive...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveImage(item)}
                className="group relative aspect-[3/4] bg-[#E1ECE5] rounded-lg overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all duration-300"
              >
                <img
                  src={item.imageUrl}
                  alt={item.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-5 flex flex-col justify-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#93C5AA]">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mt-0.5 line-clamp-1">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-16 p-8 bg-[#F2F7F4] border border-[#D5E5DB] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#111815]">Want to experience this live?</h3>
            <p className="text-xs text-[#4F6256] mt-1">Visit our store in Phoenix Marketcity Viman Nagar or reserve a fitting suite.</p>
          </div>
          <button
            onClick={() => onNavigate('/book-visit')}
            className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white bg-[#134E35] hover:bg-[#0A2419] rounded transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            <span>Book a Visit</span>
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl cursor-default relative"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative aspect-[4/3] bg-black">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.altText}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#134E35]">
                  {activeImage.category}
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#111815] mt-1">
                  {activeImage.title}
                </h4>
              </div>
              <button
                onClick={() => {
                  setActiveImage(null);
                  onNavigate('/book-visit');
                }}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded cursor-pointer"
              >
                Book Styling Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
