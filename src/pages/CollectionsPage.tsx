import React, { useState, useEffect } from 'react';
import { ArrowRight, ExternalLink, Calendar, Filter, Sparkles } from 'lucide-react';
import { CollectionItem } from '../types';
import { api } from '../lib/api';

interface CollectionsPageProps {
  onNavigate: (path: string) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ onNavigate }) => {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'FEATURED'>('ALL');
  const [selectedCollection, setSelectedCollection] = useState<CollectionItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCollections() {
      try {
        const data = await api.getCollections(true);
        setCollections(data);
      } catch (err) {
        console.error('Failed to load collections:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCollections();
  }, []);

  const filtered = activeFilter === 'FEATURED' ? collections.filter((c) => c.featured) : collections;

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#111815] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#134E35]">
            Curated In-Store Wardrobe
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#111815]">
            COLLECTIONS
          </h1>
          <p className="text-xs sm:text-sm text-[#4F6256] leading-relaxed">
            Discover the latest trends currently available in our Phoenix Marketcity Pune boutique. Browse looks and reserve a fitting suite to try them on in-store, or shop online directly on NEWME.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 mb-8 border-b border-[#E1ECE5] pb-4">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-[#134E35] text-white shadow-xs'
                : 'text-[#4A5D52] hover:bg-[#EBF3EE]'
            }`}
          >
            All Collections ({collections.length})
          </button>
          <button
            onClick={() => setActiveFilter('FEATURED')}
            className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeFilter === 'FEATURED'
                ? 'bg-[#134E35] text-white shadow-xs'
                : 'text-[#4A5D52] hover:bg-[#EBF3EE]'
            }`}
          >
            Featured Edits
          </button>
        </div>

        {/* Collections Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-[#52665A] animate-pulse">
            Loading Pune collection lookbooks...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col bg-white border border-[#E1ECE5] rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div
                  onClick={() => setSelectedCollection(item)}
                  className="relative aspect-[3/4] bg-[#EBF3EE] overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#0A2419]/80 backdrop-blur-xs text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded">
                    {item.itemCountLabel || 'In-Store'}
                  </div>
                  {item.featured && (
                    <div className="absolute top-3 right-3 bg-[#134E35] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => setSelectedCollection(item)}
                      className="font-serif text-xl font-bold text-[#111815] group-hover:text-[#134E35] cursor-pointer transition-colors"
                    >
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#4F6256] mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8EFEA] flex items-center justify-between text-xs">
                    <button
                      onClick={() => onNavigate('/book-visit')}
                      className="text-[#134E35] font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Try in Store</span>
                    </button>
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#607468] hover:text-[#111815] flex items-center gap-1 font-medium"
                    >
                      <span>Shop Online</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collection Detail Modal */}
      {selectedCollection && (
        <div
          onClick={() => setSelectedCollection(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl max-w-xl w-full overflow-hidden shadow-2xl cursor-default"
          >
            <div className="relative aspect-[16/10] bg-black">
              <img
                src={selectedCollection.image}
                alt={selectedCollection.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#93C5AA]">
                  {selectedCollection.itemCountLabel || 'Pune In-Store Drop'}
                </span>
                <h3 className="font-serif text-3xl font-bold text-white mt-1">
                  {selectedCollection.name}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-[#4A5D52] leading-relaxed">
                {selectedCollection.description}
              </p>

              <div className="p-3 bg-[#F2F7F4] border border-[#D5E5DB] rounded text-xs text-[#2A4335] space-y-1">
                <span className="font-bold block">In-Store Styling Tip:</span>
                <span>Our stylists can pull coordinating accessories, footwear pairings, and tailored layering pieces for this collection.</span>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <a
                  href={selectedCollection.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 text-xs font-semibold text-[#38463F] hover:text-[#111815] bg-[#F2F7F4] hover:bg-[#E1ECE5] rounded transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Browse Online Catalog</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => {
                    setSelectedCollection(null);
                    onNavigate('/book-visit');
                  }}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded transition-colors cursor-pointer"
                >
                  Book Fitting Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
