import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { BookVisitPage } from './pages/BookVisitPage';
import { GalleryPage } from './pages/GalleryPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuthPages } from './pages/AuthPages';
import { AccountPage } from './pages/AccountPage';
import { AdminPortal } from './pages/admin/AdminPortal';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  // Render appropriate view based on path
  const renderContent = () => {
    if (isAdminRoute) {
      return <AdminPortal onNavigate={navigate} />;
    }

    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/store':
        return <StorePage onNavigate={navigate} />;
      case '/collections':
        return <CollectionsPage onNavigate={navigate} />;
      case '/book-visit':
        return <BookVisitPage onNavigate={navigate} />;
      case '/gallery':
        return <GalleryPage onNavigate={navigate} />;
      case '/reviews':
        return <ReviewsPage onNavigate={navigate} />;
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/contact':
        return <ContactPage onNavigate={navigate} />;
      case '/login':
        return <AuthPages initialMode="login" onNavigate={navigate} />;
      case '/register':
        return <AuthPages initialMode="register" onNavigate={navigate} />;
      case '/forgot-password':
        return <AuthPages initialMode="forgot" onNavigate={navigate} />;
      case '/reset-password':
        return <AuthPages initialMode="reset" onNavigate={navigate} />;
      case '/account':
        return <AccountPage onNavigate={navigate} />;
      default:
        // Handle 404
        return (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
            <span className="text-xs uppercase font-bold tracking-widest text-[#134E35]">Error 404</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#111815] mt-2 mb-4">
              PAGE NOT FOUND
            </h1>
            <p className="text-xs sm:text-sm text-[#4F6256] max-w-md mb-6">
              The page you are looking for doesn't exist or has moved. Explore the Phoenix Marketcity Pune store guide or book a visit.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded cursor-pointer"
              >
                Go to Homepage
              </button>
              <button
                onClick={() => navigate('/book-visit')}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#134E35] bg-[#EBF3EE] hover:bg-[#DDF0E4] rounded cursor-pointer"
              >
                Book a Visit
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#111815] selection:bg-[#134E35] selection:text-white">
        {!isAdminRoute && <Navbar currentPath={currentPath} onNavigate={navigate} />}
        <main className="flex-1">{renderContent()}</main>
        {!isAdminRoute && <Footer onNavigate={navigate} />}
      </div>
    </AuthProvider>
  );
}
