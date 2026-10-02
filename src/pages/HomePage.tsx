import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, MapPin, Sparkles, Clock, CheckCircle2, ChevronRight, Star, ExternalLink, ShieldCheck } from 'lucide-react';
import { CollectionItem, AppointmentType, ReviewItem, GalleryItem } from '../types';
import { api } from '../lib/api';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectCollection?: (slug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectCollection }) => {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [services, setServices] = useState<AppointmentType[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [colsData, servsData, revsData, galData] = await Promise.all([
          api.getCollections(true),
          api.getAppointmentTypes(true),
          api.getReviews(true),
          api.getGallery(),
        ]);
        setCollections(colsData);
        setServices(servsData);
        setReviews(revsData);
        setGallery(galData.slice(0, 4));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#111815]">
      {/* ========================================================
          1. HERO SECTION (High-fashion editorial green & white)
          ======================================================== */}
      <section className="relative overflow-hidden bg-[#0A2419] text-white">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="/src/assets/images/newme_pune_hero_1790918151414.jpg"
            alt="NEWME Pune Fashion Editorial"
            className="w-full h-full object-cover object-center filter brightness-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2419] via-[#0A2419]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2419] via-transparent to-black/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-36">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#93C5AA] bg-[#134E35]/70 border border-[#2D7353]/50 px-3 py-1 rounded">
              <span>Phoenix Marketcity Pune · Lower Ground Floor</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] text-balance">
              YOUR NEXT LOOK STARTS HERE.
            </h1>

            <p className="text-base sm:text-lg text-[#CBDAD1] font-light max-w-xl leading-relaxed">
              Discover NEWME at Phoenix Marketcity Pune — fresh fits, trend-led fashion and a store experience made for your personal style.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/book-visit')}
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-[#0A2419] bg-white hover:bg-[#EBF3EE] rounded transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#134E35]" />
                <span>Book a Visit</span>
              </button>

              <button
                onClick={() => onNavigate('/collections')}
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white bg-[#134E35] hover:bg-[#1A6343] border border-[#2D7353] rounded transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://maps.google.com/?q=Phoenix+Marketcity+Pune+Viman+Nagar"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3.5 text-xs font-semibold text-[#CBDAD1] hover:text-white transition-colors flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4 text-[#93C5AA]" />
                <span>Get Directions</span>
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-[#1A4232] text-xs text-[#93C5AA]">
              <div>
                <span className="block font-serif text-2xl font-bold text-white">500+</span>
                <span className="text-[11px] text-[#A2BDB0] uppercase tracking-wider">Weekly In-Store Drops</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-white">1-on-1</span>
                <span className="text-[11px] text-[#A2BDB0] uppercase tracking-wider">Styling Suites</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-white">LG Floor</span>
                <span className="text-[11px] text-[#A2BDB0] uppercase tracking-wider">Phoenix Marketcity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. THE NEWME EXPERIENCE / MEET NEWME IN PUNE
          ======================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#134E35]">
              Editorial Focus · The Pune Edit
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#111815] leading-tight text-balance">
              MEET NEWME IN PUNE.
            </h2>
            <p className="text-sm sm:text-base text-[#4A5D52] leading-relaxed">
              Located on the Lower Ground Floor of Phoenix Marketcity, GP 09 Clover Park, Viman Nagar, NEWME brings viral Gen-Z silhouettes and modern tailoring into a tactile, high-energy retail space.
            </p>
            <p className="text-sm sm:text-base text-[#4A5D52] leading-relaxed">
              Skip standard retail queues and step into our dedicated personal styling lounge, where dedicated fashion advisors pull curated looks tailored for your upcoming occasions, weekend getaways, and daily rotations.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#F2F7F4] border border-[#D5E5DB] rounded-lg">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#134E35]">Trend-Led Fashion</h4>
                <p className="text-xs text-[#4F6256] mt-1">Real-time drops reflecting global runways and contemporary street culture.</p>
              </div>
              <div className="p-4 bg-[#F2F7F4] border border-[#D5E5DB] rounded-lg">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#134E35]">Private Styling Suites</h4>
                <p className="text-xs text-[#4F6256] mt-1">Dedicated fitting suites reserved in advance with zero waiting time.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/store')}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#134E35] hover:text-[#0D3826] transition-colors cursor-pointer group"
              >
                <span>Read Full Store Guide & Amenities</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg shadow-sm border border-[#E1ECE5]">
                <img
                  src="/src/assets/images/newme_store_interior_1790918295601.jpg"
                  alt="NEWME Phoenix Marketcity Store Interior"
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 bg-white border border-[#E1ECE5] rounded-lg shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#134E35]">Flagship Experience</span>
                <h5 className="font-serif text-lg font-bold text-[#111815] mt-1">Lower Ground, Shop 10</h5>
                <p className="text-xs text-[#4F6256] mt-1">Adjacent to central atrium elevators in Phoenix Marketcity.</p>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="p-4 bg-[#134E35] text-white rounded-lg shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#93C5AA]">Hours Today</span>
                <h5 className="font-serif text-lg font-bold mt-1">10:30 AM – 9:30 PM</h5>
                <p className="text-xs text-[#CBDAD1] mt-1">Open 7 days a week for styling & browsing.</p>
              </div>
              <div className="overflow-hidden rounded-lg shadow-sm border border-[#E1ECE5]">
                <img
                  src="/src/assets/images/newme_styling_lounge_1790918325187.jpg"
                  alt="NEWME Styling Suite Lounge"
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. FEATURED COLLECTIONS
          ======================================================== */}
      <section className="py-20 bg-white border-y border-[#E8EFEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#134E35]">
                Curated Lookbook
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#111815] mt-1">
                FEATURED COLLECTIONS
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/collections')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#134E35] hover:text-[#0A2419] cursor-pointer"
            >
              <span>View All Collections</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.slice(0, 4).map((col) => (
              <div
                key={col.id}
                className="group flex flex-col bg-[#FBFBF9] border border-[#E8EFEA] rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#EBF3EE]">
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#0A2419]/80 backdrop-blur-xs text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded">
                    {col.itemCountLabel || 'In-Store'}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#111815] group-hover:text-[#134E35] transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-xs text-[#4F6256] mt-2 line-clamp-2 leading-relaxed">
                      {col.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#E8EFEA] flex items-center justify-between text-xs">
                    <button
                      onClick={() => onNavigate('/book-visit')}
                      className="text-[#134E35] font-bold hover:underline cursor-pointer"
                    >
                      Try In Store
                    </button>
                    <a
                      href={col.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#687C71] hover:text-[#111815] flex items-center gap-1"
                    >
                      <span>Shop Online</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. STORE VISIT & PERSONAL STYLING SERVICES (Core Feature)
          ======================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#134E35]">
            Complimentary Retail Services
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#111815]">
            TAILORED STORE VISITS
          </h2>
          <p className="text-sm text-[#4F6256] leading-relaxed text-balance">
            Select a specialized styling experience designed around your schedule, occasion, and wardrobe goals at Phoenix Marketcity Pune.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service) => (
            <div
              key={service.id}
              className="bg-white border border-[#E1ECE5] hover:border-[#134E35] rounded-lg p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#134E35] bg-[#EBF3EE] px-2.5 py-1 rounded">
                    {service.tag}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#52665A]">
                    <Clock className="w-3.5 h-3.5 text-[#134E35]" />
                    <span>{service.duration} mins</span>
                  </div>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#111815] mb-2">
                  {service.name}
                </h3>
                <p className="text-xs text-[#4F6256] leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8EFEA] flex items-center justify-between">
                <span className="text-xs text-[#52665A]">Capacity: {service.capacity} Guest{service.capacity > 1 ? 's' : ''}</span>
                <button
                  onClick={() => onNavigate('/book-visit')}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded transition-colors cursor-pointer"
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('/book-visit')}
            className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white bg-[#134E35] hover:bg-[#0A2419] rounded-md shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Open Booking Engine & Check Live Times</span>
          </button>
        </div>
      </section>

      {/* ========================================================
          5. GALLERY & LOOKS SPOTLIGHT
          ======================================================== */}
      <section className="py-20 bg-[#F4F8F5] border-t border-[#E1ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#134E35]">Visual Stories</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#111815] mt-1">
                INSIDE THE PUNE STORE
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/gallery')}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#134E35] hover:text-[#0A2419] cursor-pointer"
            >
              <span>Explore Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedGalleryImg(img)}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-[#E1ECE5] cursor-pointer shadow-xs"
              >
                <img
                  src={img.imageUrl}
                  alt={img.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#93C5AA]">{img.category}</span>
                  <p className="text-xs font-medium text-white line-clamp-1">{img.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedGalleryImg && (
        <div
          onClick={() => setSelectedGalleryImg(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl cursor-default"
          >
            <div className="relative aspect-[4/3] bg-black">
              <img
                src={selectedGalleryImg.imageUrl}
                alt={selectedGalleryImg.altText}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#134E35] font-bold">{selectedGalleryImg.category}</span>
                <h4 className="font-serif text-xl font-bold text-[#111815]">{selectedGalleryImg.title}</h4>
              </div>
              <button
                onClick={() => setSelectedGalleryImg(null)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#111815] bg-[#F2F7F4] hover:bg-[#E1ECE5] rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. REVIEWS & TESTIMONIALS
          ======================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#134E35]">Customer Impressions</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#111815] mt-1">
              COMMUNITY EXPERIENCES
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/reviews')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#134E35] hover:text-[#0A2419] cursor-pointer"
          >
            <span>Read All Reviews</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#E1ECE5] p-6 rounded-lg shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-[#134E35]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#718579]">{rev.reviewDate}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#38463F] leading-relaxed italic">
                  "{rev.reviewText}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8EFEA] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#111815]">{rev.customerName}</h4>
                  <span className="text-[10px] text-[#607468] block">{rev.visitType || 'Store Guest'}</span>
                </div>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#134E35] bg-[#EBF3EE] px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          7. STORE LOCATION & DIRECTIONS
          ======================================================== */}
      <section className="py-16 bg-white border-t border-[#E1ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0A2419] text-white rounded-xl overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#93C5AA]">
                Visit Us in Viman Nagar
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                NEWME PHOENIX MARKETCITY PUNE
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-[#CBDAD1] leading-relaxed">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#93C5AA] shrink-0 mt-1" />
                  <span>10, Lower Ground Floor, Phoenix Marketcity, GP 09, Clover Park, Viman Nagar, Pune, Maharashtra 411014</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#93C5AA] shrink-0" />
                  <span>Monday – Thursday: 10:30 AM – 9:30 PM · Friday – Sunday: 10:30 AM – 10:00 PM</span>
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="https://maps.google.com/?q=Phoenix+Marketcity+Pune+Viman+Nagar"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#0A2419] bg-white hover:bg-[#EBF3EE] rounded transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#134E35]" />
                  <span>Open in Google Maps</span>
                </a>

                <button
                  onClick={() => onNavigate('/book-visit')}
                  className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-white bg-[#134E35] hover:bg-[#1A6343] border border-[#2D7353] rounded transition-colors cursor-pointer"
                >
                  Book Store Appointment
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative bg-[#134E35]/40 flex flex-col justify-center p-8 border-t lg:border-t-0 lg:border-l border-[#1A4232]">
              <h4 className="text-xs uppercase font-bold tracking-widest text-[#93C5AA] mb-3">Mall Transit & Parking</h4>
              <ul className="text-xs text-[#CBDAD1] space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#93C5AA] shrink-0 mt-0.5" />
                  <span>Basement Multi-Level Parking available with direct elevator access to LG floor.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#93C5AA] shrink-0 mt-0.5" />
                  <span>Located 10 mins from Pune International Airport (PNQ).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#93C5AA] shrink-0 mt-0.5" />
                  <span>Metro connectivity via Viman Nagar Metro Station (Line 2).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
