import React from 'react';
import { Calendar, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#111815]">
      {/* Editorial Hero */}
      <section className="bg-[#0A2419] text-white py-20 sm:py-28 border-b border-[#134E35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#93C5AA]">
              About NEWME · Pune
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              FASHION DESIGNED FOR HOW GEN-Z LIVES.
            </h1>
            <p className="text-sm sm:text-base text-[#CBDAD1] leading-relaxed max-w-2xl font-light">
              NEWME is an agile fashion-tech brand redefining contemporary women's apparel. Our Phoenix Marketcity Pune store translates digital speed into a tangible, high-touch boutique experience.
            </p>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#134E35]">
              The Retail Vision
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#111815] leading-tight">
              FROM SCREEN TO RUNWAY TO YOUR WARDROBE.
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5D52] leading-relaxed">
              We started with a simple belief: fashion shouldn't take six months to journey from an inspired moodboard to a boutique rack. Today's consumer trends shift rapidly, influenced by music, underground culture, and global streetwear.
            </p>
            <p className="text-xs sm:text-sm text-[#4A5D52] leading-relaxed">
              Our Phoenix Marketcity store in Viman Nagar, Pune serves as a creative hub. Rather than passive browsing, we've designed an interactive store format where customers can touch tactile fabrics, test fits with dedicated stylists, and receive bespoke outfit coordination.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/book-visit')}
                className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white bg-[#134E35] hover:bg-[#0A2419] rounded transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve a Styling Session</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-xl border border-[#E1ECE5]">
              <img
                src="/src/assets/images/newme_fashion_collection_1790918312190.jpg"
                alt="Editorial Design Philosophy"
                className="w-full h-80 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="overflow-hidden rounded-xl border border-[#E1ECE5] pt-8">
              <img
                src="/src/assets/images/newme_styling_lounge_1790918325187.jpg"
                alt="Styling Lounge Ambience"
                className="w-full h-80 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="py-16 bg-[#F2F7F4] border-y border-[#D5E5DB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#134E35]">Core Values</span>
            <h3 className="font-serif text-3xl font-bold text-[#111815] mt-1">THE FOUR PILLARS</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Trend Agility',
                desc: 'Weekly small-batch drops that keep collections fresh and responsive to customer desires.',
              },
              {
                title: 'Bespoke In-Store Care',
                desc: 'One-on-one appointments ensuring every shopper discovers silhouettes that flatter their unique form.',
              },
              {
                title: 'High-Impact Styling',
                desc: 'Statement co-ords, nocturnal party edits, and modern minimalist daywear engineered for confidence.',
              },
              {
                title: 'Mindful Production',
                desc: 'Disciplined inventory management and demand-led batching to minimize textile waste.',
              },
            ].map((p, i) => (
              <div key={i} className="bg-white border border-[#E1ECE5] p-6 rounded-lg shadow-xs">
                <span className="font-serif text-2xl font-bold text-[#134E35]">0{i + 1}.</span>
                <h4 className="font-serif text-xl font-bold text-[#111815] mt-2">{p.title}</h4>
                <p className="text-xs text-[#52665A] mt-2 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
