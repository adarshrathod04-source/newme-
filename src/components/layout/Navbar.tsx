import React, { useState } from 'react';
import { Menu, X, User as UserIcon, Calendar, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const { user, isStaff, logout } = useAuth();

  const navLinks = [
    { label: 'Store', path: '/store' },
    { label: 'Collections', path: '/collections' },
    { label: 'Book Visit', path: '/book-visit' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Slim Top Announcement Bar (Dismissible, <= 40px) */}
      {showAnnouncement && (
        <aside aria-label="Store Announcement" className="bg-[#134E35] text-white text-xs font-medium py-2 px-4 flex items-center justify-between tracking-wide transition-all duration-200">
          <div className="flex-1 text-center truncate">
            <span>THE PUNE EDIT</span>
            <span className="mx-2 opacity-60">·</span>
            <span>Visit NEWME at Phoenix Marketcity, Lower Ground Floor</span>
            <span className="mx-2 opacity-60">·</span>
            <button
              onClick={() => onNavigate('/book-visit')}
              className="underline font-semibold hover:text-[#A7F3D0] transition-colors ml-1 cursor-pointer"
            >
              Reserve a Styling Suite
            </button>
          </div>
          <button
            onClick={() => setShowAnnouncement(false)}
            aria-label="Dismiss banner"
            className="text-white/80 hover:text-white ml-2 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Top Bar: Strict 3-zone contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8EFEA] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Zone 1: Single-element Brand Wordmark in display face */}
          <button
            onClick={() => onNavigate('/')}
            className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#111815] hover:text-[#134E35] transition-colors flex items-center cursor-pointer"
          >
            NEWME
          </button>

          {/* Zone 2: 4-6 text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#3C4A42]">
            {navLinks.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`transition-colors py-1 cursor-pointer relative hover:text-[#134E35] ${
                    isActive ? 'text-[#134E35] font-bold' : ''
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#134E35] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3">
            {isStaff && (
              <button
                onClick={() => onNavigate('/admin')}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#134E35] bg-[#EBF3EE] hover:bg-[#DDF0E4] rounded-lg transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}

            {user ? (
              <div className="relative group">
                <button
                  onClick={() => onNavigate('/account')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#223028] hover:text-[#134E35] rounded-lg hover:bg-[#F2F6F3] transition-colors cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-[#134E35]" />
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('/login')}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-[#223028] hover:text-[#134E35] transition-colors cursor-pointer"
              >
                <span>Sign In</span>
              </button>
            )}

            {/* Primary CTA */}
            <button
              onClick={() => onNavigate('/book-visit')}
              className="px-4.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0D3826] active:scale-[0.98] rounded-md transition-all shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book a Visit</span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="lg:hidden p-2 text-[#223028] hover:text-[#134E35] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#E8EFEA] px-6 py-5 shadow-lg animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-4">
              {navLinks.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-sm font-semibold uppercase tracking-wider py-1 cursor-pointer ${
                    currentPath === item.path ? 'text-[#134E35] font-bold' : 'text-[#3C4A42]'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-4 border-t border-[#E8EFEA] flex flex-col gap-3">
                {isStaff && (
                  <button
                    onClick={() => {
                      onNavigate('/admin');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm font-semibold text-[#134E35]"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Store Admin Console</span>
                  </button>
                )}

                {user ? (
                  <>
                    <button
                      onClick={() => {
                        onNavigate('/account');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-between text-sm font-semibold text-[#111815]"
                    >
                      <span>My Account ({user.name})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-left text-xs text-red-600 font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      onNavigate('/login');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between text-sm font-semibold text-[#134E35]"
                  >
                    <span>Sign In / Register</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Sticky Mobile Bottom CTA Bar (respects < 15% viewport height cap) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8EFEA] p-2.5 px-4 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-[#111815] uppercase tracking-wider">NEWME Pune</span>
          <span className="text-[10px] text-[#4F6256] truncate">Phoenix Marketcity · Viman Nagar</span>
        </div>
        <button
          onClick={() => onNavigate('/book-visit')}
          className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0D3826] rounded-md transition-all shadow-sm cursor-pointer whitespace-nowrap flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book a Visit</span>
        </button>
      </div>
    </>
  );
};
