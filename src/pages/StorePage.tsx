import React from 'react';
import { MapPin, Clock, Phone, Mail, Navigation, Car, Train, Calendar, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

interface StorePageProps {
  onNavigate: (path: string) => void;
}

export const StorePage: React.FC<StorePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#111815]">
      {/* Editorial Header */}
      <section className="bg-[#0A2419] text-white py-16 sm:py-24 border-b border-[#134E35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#93C5AA]">
              Store Flagship Guide
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              NEWME PHOENIX MARKETCITY PUNE
            </h1>
            <p className="text-sm sm:text-base text-[#CBDAD1] leading-relaxed max-w-2xl font-light">
              Experience fashion offline. Located on the Lower Ground Floor of Pune’s premier lifestyle destination, our Phoenix Marketcity store features weekly collection drops, dedicated personal styling lounges, and express fitting suites.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Details + Store Gallery */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Essential Store Specs */}
          <div className="lg:col-span-7 space-y-8">
            {/* Location & Directions */}
            <div className="bg-white border border-[#E1ECE5] p-6 sm:p-8 rounded-xl shadow-xs space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#111815]">
                Store Location & Access
              </h2>
              <div className="text-xs sm:text-sm text-[#4F6256] space-y-3 leading-relaxed">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#134E35] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#111815] block">Address:</strong>
                    <span>10, Lower Ground Floor, Phoenix Marketcity, GP 09, Clover Park, Viman Nagar, Pune, Maharashtra 411014, India</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#134E35] shrink-0" />
                  <div>
                    <strong className="text-[#111815] inline mr-1">Phone:</strong>
                    <span>+91 20 6689 0088</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#134E35] shrink-0" />
                  <div>
                    <strong className="text-[#111815] inline mr-1">Email:</strong>
                    <span>phoenix.pune@newme.asia</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="https://maps.google.com/?q=Phoenix+Marketcity+Pune+Viman+Nagar"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded transition-colors inline-flex items-center gap-2"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate with Google Maps</span>
                </a>
                <button
                  onClick={() => onNavigate('/book-visit')}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#134E35] bg-[#EBF3EE] hover:bg-[#DDF0E4] rounded transition-colors cursor-pointer"
                >
                  Book In-Store Styling
                </button>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white border border-[#E1ECE5] p-6 sm:p-8 rounded-xl shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-[#111815]">
                  Operating Hours
                </h2>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                  Open Today
                </span>
              </div>

              <div className="divide-y divide-[#E8EFEA] text-xs">
                {[
                  { day: 'Monday', hours: '10:30 AM – 09:30 PM' },
                  { day: 'Tuesday', hours: '10:30 AM – 09:30 PM' },
                  { day: 'Wednesday', hours: '10:30 AM – 09:30 PM' },
                  { day: 'Thursday', hours: '10:30 AM – 09:30 PM' },
                  { day: 'Friday', hours: '10:30 AM – 10:00 PM' },
                  { day: 'Saturday', hours: '10:30 AM – 10:00 PM' },
                  { day: 'Sunday', hours: '10:30 AM – 10:00 PM' },
                ].map((item) => (
                  <div key={item.day} className="py-2.5 flex items-center justify-between">
                    <span className="font-medium text-[#111815]">{item.day}</span>
                    <span className="font-mono text-[#52665A]">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* In-Store Services & Amenities */}
            <div className="bg-white border border-[#E1ECE5] p-6 sm:p-8 rounded-xl shadow-xs space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#111815]">
                In-Store Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[#FBFBF9] border border-[#E1ECE5] rounded">
                  <strong className="text-[#134E35] block mb-1">Personal Styling Suites</strong>
                  <span className="text-[#52665A]">Reserved private fitting rooms with pre-curated wardrobe racks.</span>
                </div>
                <div className="p-3.5 bg-[#FBFBF9] border border-[#E1ECE5] rounded">
                  <strong className="text-[#134E35] block mb-1">Weekly Offline Drops</strong>
                  <span className="text-[#52665A]">New arrivals stocked weekly ahead of national online launches.</span>
                </div>
                <div className="p-3.5 bg-[#FBFBF9] border border-[#E1ECE5] rounded">
                  <strong className="text-[#134E35] block mb-1">Size & Fit Assistance</strong>
                  <span className="text-[#52665A]">Dedicated fashion advisors to assist with tailored fit comparisons.</span>
                </div>
                <div className="p-3.5 bg-[#FBFBF9] border border-[#E1ECE5] rounded">
                  <strong className="text-[#134E35] block mb-1">Digital Omnichannel Pickups</strong>
                  <span className="text-[#52665A]">Seamless connection to NEWME national online inventory.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Imagery & Transit Guide */}
          <div className="lg:col-span-5 space-y-6">
            <div className="overflow-hidden rounded-xl border border-[#E1ECE5] shadow-xs">
              <img
                src="/src/assets/images/newme_store_interior_1790918295601.jpg"
                alt="NEWME Pune Store Interior"
                className="w-full h-80 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 bg-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#134E35]">Phoenix Marketcity Pune</span>
                <p className="text-xs text-[#52665A] mt-1">Lower Ground Floor modern boutique concept.</p>
              </div>
            </div>

            <div className="bg-[#F2F7F4] border border-[#D5E5DB] p-6 rounded-xl space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#111815]">
                How to Reach Us
              </h3>
              <div className="space-y-3 text-xs text-[#4A5D52]">
                <div className="flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-[#134E35] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#111815] block">By Car / Cab:</strong>
                    <span>Use Phoenix Marketcity Basement Parking (Entry from Pune-Nagar Road). Take LG floor elevators near Central Atrium.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Train className="w-4 h-4 text-[#134E35] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#111815] block">Metro & Public Transit:</strong>
                    <span>Closest station is Viman Nagar / Ramwadi Metro Station (Pune Metro Line 2). Quick 5-minute auto or walk to the mall.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#0A2419] text-white rounded-xl space-y-3">
              <h4 className="font-serif text-xl font-bold">Visiting this Weekend?</h4>
              <p className="text-xs text-[#CBDAD1] leading-relaxed">
                Weekend dressing rooms at Phoenix Marketcity fill up fast. Reserve a complimentary 45-minute styling suite to skip queues.
              </p>
              <button
                onClick={() => onNavigate('/book-visit')}
                className="w-full mt-2 py-3 text-xs font-bold uppercase tracking-wider text-[#0A2419] bg-white hover:bg-[#EBF3EE] rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-[#134E35]" />
                <span>Book Store Visit</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
