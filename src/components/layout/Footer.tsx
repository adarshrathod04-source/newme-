import React from 'react';
import { ArrowUpRight, MapPin, Phone, Mail, Instagram, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0A2419] text-[#F3F7F4] pt-16 pb-20 border-t border-[#134E35]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1A4232]">
          {/* Brand & Editorial Voice */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif text-3xl font-bold tracking-tight text-white">NEWME</h3>
            <p className="text-xs uppercase tracking-widest text-[#93C5AA] font-semibold">
              Phoenix Marketcity Pune · Lower Ground Floor
            </p>
            <p className="text-sm text-[#CBDAD1] max-w-sm leading-relaxed">
              Curating high-energy, trend-led fashion for Pune’s Gen-Z and contemporary trendsetters. Experience personalized styling, seamless fitting suites, and fresh weekly drops in Viman Nagar.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com/newme.asia"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#134E35] hover:bg-[#1A6343] flex items-center justify-center text-white transition-colors"
                aria-label="Instagram @newme.asia"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://newme.asia/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#134E35] hover:bg-[#1A6343] flex items-center justify-center text-white transition-colors"
                aria-label="Official Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Pune Store Details */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#93C5AA] font-bold">Store Visit</h4>
            <div className="text-xs text-[#CBDAD1] space-y-2 leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#93C5AA] shrink-0 mt-0.5" />
                <span>Shop 10, Lower Ground Floor, Phoenix Marketcity, Viman Nagar, Pune 411014</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#93C5AA] shrink-0" />
                <span>+91 20 6689 0088</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#93C5AA] shrink-0" />
                <span>phoenix.pune@newme.asia</span>
              </div>
            </div>
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-white/70 block">Store Hours</span>
              <span className="text-xs text-[#E1ECE5] font-medium">Mon – Thu: 10:30 AM – 9:30 PM</span>
              <span className="text-xs text-[#E1ECE5] font-medium block">Fri – Sun: 10:30 AM – 10:00 PM</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#93C5AA] font-bold">Navigation</h4>
            <ul className="text-xs space-y-2 text-[#CBDAD1]">
              <li>
                <button onClick={() => onNavigate('/store')} className="hover:text-white transition-colors">
                  Store Guide & Directions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/collections')} className="hover:text-white transition-colors">
                  Browse Collections
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/book-visit')} className="hover:text-white transition-colors font-medium text-[#A7F3D0]">
                  Book Personal Styling
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/gallery')} className="hover:text-white transition-colors">
                  Store & Looks Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/reviews')} className="hover:text-white transition-colors">
                  Customer Reviews
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">
                  The NEWME Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">
                  Contact Pune Store
                </button>
              </li>
            </ul>
          </div>

          {/* Official Brand Portals */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#93C5AA] font-bold">Official Portals</h4>
            <p className="text-xs text-[#CBDAD1] leading-relaxed">
              Explore national drops and pan-India shipping on NEWME’s official digital storefront.
            </p>
            <div className="space-y-2 pt-1">
              <a
                href="https://newme.asia/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#134E35] hover:bg-[#1C6947] px-3.5 py-2 rounded transition-colors"
              >
                <span>Shop NEWME Online</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://newme.asia/stores/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#CBDAD1] hover:text-white transition-colors block pt-1"
              >
                <span>National Store Locator</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7E9689] gap-4">
          <div>
            © {new Date().getFullYear()} NEWME — Phoenix Marketcity Pune. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#CBDAD1] cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-[#CBDAD1] cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-[#CBDAD1] cursor-pointer">Accessibility</span>
            <span>·</span>
            <button onClick={() => onNavigate('/admin')} className="text-[#93C5AA] hover:text-white font-medium cursor-pointer">
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
