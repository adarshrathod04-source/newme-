import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import {
  DashboardData,
  Appointment,
  AppointmentType,
  BusinessDayHours,
  BlockedDate,
  CollectionItem,
  GalleryItem,
  ReviewItem,
  PromotionItem,
  CustomerSummary,
  StoreInfo,
  StoreSettings,
} from '../../types';
import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  Users,
  Sparkles,
  Clock,
  Ban,
  Layers,
  Image,
  Star,
  Tag,
  Settings,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface AdminPortalProps {
  onNavigate: (path: string) => void;
}

type AdminTab =
  | 'dashboard'
  | 'bookings'
  | 'calendar'
  | 'customers'
  | 'appointment-types'
  | 'business-hours'
  | 'blocked-dates'
  | 'collections'
  | 'gallery'
  | 'reviews'
  | 'promotions'
  | 'settings';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onNavigate }) => {
  const { user, isStaff, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');

  // Shared Data States
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessDayHours[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filters for bookings
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('ALL');
  const [bookingSearch, setBookingSearch] = useState<string>('');

  // Selected Booking Modal
  const [viewingBooking, setViewingBooking] = useState<Appointment | null>(null);

  // Forms / Modals
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [showBlockDateModal, setShowBlockDateModal] = useState(false);
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [showNewGalleryModal, setShowNewGalleryModal] = useState(false);

  // Load Admin Data
  const reloadData = async () => {
    try {
      const [
        dash,
        apts,
        types,
        hours,
        blocked,
        cols,
        gals,
        revs,
        promos,
        custs,
        storeMeta,
      ] = await Promise.all([
        api.getDashboardData(),
        api.getAppointments(),
        api.getAppointmentTypes(),
        api.getBusinessHours(),
        api.getBlockedDates(),
        api.getCollections(),
        api.getGallery(),
        api.getReviews(false), // get all reviews including unapproved
        api.getPromotions(false),
        api.getAdminCustomers(),
        api.getStore(),
      ]);

      setDashboardData(dash);
      setAppointments(apts);
      setAppointmentTypes(types);
      setBusinessHours(hours);
      setBlockedDates(blocked);
      setCollections(cols);
      setGallery(gals);
      setReviews(revs);
      setPromotions(promos);
      setCustomers(custs);
      setStoreInfo(storeMeta.store);
      setStoreSettings(storeMeta.settings);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const triggerToast = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Status Updater
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.updateAppointment(id, { status: status as any });
      triggerToast(`Appointment status changed to ${status}`);
      reloadData();
      if (viewingBooking?.id === id) {
        setViewingBooking((prev) => (prev ? { ...prev, status: status as any } : null));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Guard: Must be staff or admin
  if (!isStaff) {
    return (
      <div className="min-h-screen bg-[#FBFBF9] py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-[#E1ECE5] p-8 rounded-xl text-center space-y-4 shadow-sm">
          <Shield className="w-12 h-12 text-[#134E35] mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-[#111815]">Admin Access Required</h2>
          <p className="text-xs text-[#52665A]">
            You must be logged in as an authorized store administrator or stylist staff member.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/login')}
              className="w-full py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded cursor-pointer"
            >
              Sign In with Staff Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar navigation items
  const sidebarItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: <CalendarDays className="w-4 h-4" />,
      badge: appointments.filter((a) => a.status === 'PENDING').length || undefined,
    },
    { id: 'calendar', label: 'Calendar View', icon: <Calendar className="w-4 h-4" /> },
    { id: 'customers', label: 'Customer Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'appointment-types', label: 'Appointment Types', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'business-hours', label: 'Business Hours', icon: <Clock className="w-4 h-4" /> },
    { id: 'blocked-dates', label: 'Blocked Dates & Events', icon: <Ban className="w-4 h-4" /> },
    { id: 'collections', label: 'Collections', icon: <Layers className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery Media', icon: <Image className="w-4 h-4" /> },
    { id: 'reviews', label: 'Customer Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'promotions', label: 'Promotions', icon: <Tag className="w-4 h-4" /> },
    { id: 'settings', label: 'Store Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const filteredAppointments = appointments.filter((a) => {
    if (bookingFilterStatus !== 'ALL' && a.status !== bookingFilterStatus) return false;
    if (bookingSearch) {
      const q = bookingSearch.toLowerCase();
      return (
        a.bookingNumber.toLowerCase().includes(q) ||
        a.customerName.toLowerCase().includes(q) ||
        a.customerPhone.toLowerCase().includes(q) ||
        a.appointmentTypeName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F6F8F6] text-[#111815] flex flex-col">
      {/* Top Navbar for Admin */}
      <header className="bg-[#0A2419] text-white h-16 border-b border-[#134E35] px-4 sm:px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="font-serif text-2xl font-bold tracking-tight text-white hover:text-[#93C5AA]"
          >
            NEWME
          </button>
          <span className="text-white/40">/</span>
          <span className="text-xs uppercase font-bold tracking-widest text-[#93C5AA]">
            Phoenix Marketcity Pune · Admin
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => onNavigate('/')}
            className="text-[#CBDAD1] hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Customer Storefront</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <span className="text-white/40">|</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{user?.name}</span>
            <span className="bg-[#134E35] text-[#A7F3D0] text-[10px] font-bold uppercase px-2 py-0.5 rounded">
              {user?.role}
            </span>
          </div>
          <button
            onClick={logout}
            className="ml-2 text-xs text-red-300 hover:text-red-100 font-medium cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-[#E1ECE5] flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-[#E1ECE5]">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#718579]">
              Store Operations
            </span>
          </div>

          <nav className="p-2 space-y-1 flex-1">
            {sidebarItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded transition-colors text-left cursor-pointer ${
                    active
                      ? 'bg-[#134E35] text-white shadow-xs'
                      : 'text-[#4A5D52] hover:bg-[#F2F7F4] hover:text-[#111815]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[#E1ECE5] text-[11px] text-[#718579] space-y-1">
            <span className="block font-semibold text-[#111815]">Phoenix Marketcity Pune</span>
            <span>Lower Ground Floor, Shop 10</span>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          {actionSuccess && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-md flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* ========================================================
              TAB: DASHBOARD
              ======================================================== */}
          {currentTab === 'dashboard' && dashboardData && (
            <div className="space-y-8 animate-in fade-in-50 duration-300">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#111815]">Store Overview</h1>
                <p className="text-xs text-[#52665A]">
                  Real database analytics and today's appointment schedule at Phoenix Marketcity Pune.
                </p>
              </div>

              {/* Metric Cards (Real Data) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white border border-[#E1ECE5] p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#718579] block">
                    Total Bookings
                  </span>
                  <span className="font-serif text-3xl font-bold text-[#111815] mt-1 block">
                    {dashboardData.metrics.totalBookings}
                  </span>
                </div>

                <div className="bg-white border border-[#E1ECE5] p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#134E35] block">
                    Today's Visits
                  </span>
                  <span className="font-serif text-3xl font-bold text-[#134E35] mt-1 block">
                    {dashboardData.metrics.todayCount}
                  </span>
                </div>

                <div className="bg-white border border-[#E1ECE5] p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#718579] block">
                    Upcoming
                  </span>
                  <span className="font-serif text-3xl font-bold text-[#111815] mt-1 block">
                    {dashboardData.metrics.upcomingCount}
                  </span>
                </div>

                <div className="bg-white border border-[#E1ECE5] p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 block">
                    Pending
                  </span>
                  <span className="font-serif text-3xl font-bold text-amber-600 mt-1 block">
                    {dashboardData.metrics.pendingCount}
                  </span>
                </div>

                <div className="bg-white border border-[#E1ECE5] p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block">
                    Completed
                  </span>
                  <span className="font-serif text-3xl font-bold text-emerald-700 mt-1 block">
                    {dashboardData.metrics.completedCount}
                  </span>
                </div>

                <div className="bg-white border border-[#E1ECE5] p-4 rounded-xl shadow-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                    Cancelled
                  </span>
                  <span className="font-serif text-3xl font-bold text-slate-500 mt-1 block">
                    {dashboardData.metrics.cancelledCount}
                  </span>
                </div>
              </div>

              {/* Today's Schedule Live List */}
              <div className="bg-white border border-[#E1ECE5] rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-[#111815]">Today's Appointment Schedule</h2>
                  <span className="text-xs text-[#718579]">
                    {dashboardData.todaySchedule.length} session{dashboardData.todaySchedule.length === 1 ? '' : 's'} scheduled today
                  </span>
                </div>

                {dashboardData.todaySchedule.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#718579]">
                    No appointments scheduled for today yet.
                  </div>
                ) : (
                  <div className="divide-y divide-[#E8EFEA]">
                    {dashboardData.todaySchedule.map((apt) => (
                      <div key={apt.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs font-bold text-[#134E35]">
                            {apt.startTime}
                          </span>
                          <div>
                            <strong className="text-[#111815] block">{apt.customerName}</strong>
                            <span className="text-[#52665A]">{apt.appointmentTypeName} ({apt.customerPhone})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                              apt.status === 'CONFIRMED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : apt.status === 'CHECKED-IN'
                                ? 'bg-blue-100 text-blue-800'
                                : apt.status === 'COMPLETED'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {apt.status}
                          </span>

                          {apt.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'CHECKED-IN')}
                              className="px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded"
                            >
                              Check-In
                            </button>
                          )}
                          {apt.status === 'CHECKED-IN' && (
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                              className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Distribution & Peak Times breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-[#E1ECE5] p-6 rounded-xl shadow-xs space-y-3">
                  <h3 className="font-serif text-lg font-bold text-[#111815]">
                    Appointments by Service
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(dashboardData.typeDistribution).map(([name, count]) => (
                      <div key={name} className="flex items-center justify-between text-xs">
                        <span className="text-[#4A5D52]">{name}</span>
                        <span className="font-mono font-bold text-[#111815]">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-[#E1ECE5] p-6 rounded-xl shadow-xs space-y-3">
                  <h3 className="font-serif text-lg font-bold text-[#111815]">
                    Popular Booking Hours
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(dashboardData.hourCounts).map(([hour, count]) => (
                      <div key={hour} className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[#4A5D52]">{hour}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-[#E1ECE5] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#134E35] h-full"
                              style={{ width: `${Math.min(100, count * 25)}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-[#111815]">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: BOOKINGS MANAGEMENT
              ======================================================== */}
          {currentTab === 'bookings' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-[#111815]">Bookings Management</h1>
                  <p className="text-xs text-[#52665A]">
                    Review, confirm, reschedule, or cancel customer store appointments.
                  </p>
                </div>

                <button
                  onClick={() => setShowNewBookingModal(true)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Manual Booking</span>
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white border border-[#E1ECE5] p-4 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-[#718579] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by ID, name, phone, or service..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-xs text-[#111815] focus:outline-none focus:border-[#134E35]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#52665A] font-semibold">Status:</span>
                  <select
                    value={bookingFilterStatus}
                    onChange={(e) => setBookingFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-xs text-[#111815] focus:outline-none focus:border-[#134E35]"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CHECKED-IN">CHECKED-IN</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="NO-SHOW">NO-SHOW</option>
                  </select>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="bg-white border border-[#E1ECE5] rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#F6F8F6] border-b border-[#E1ECE5] text-[#52665A] font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3.5">Booking Ref</th>
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Service</th>
                        <th className="p-3.5">Date & Time</th>
                        <th className="p-3.5">Guests</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8EFEA]">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-[#718579]">
                            No matching appointments found.
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((apt) => (
                          <tr key={apt.id} className="hover:bg-[#FBFBF9] transition-colors">
                            <td className="p-3.5 font-mono font-bold text-[#134E35]">
                              {apt.bookingNumber}
                            </td>
                            <td className="p-3.5">
                              <strong className="text-[#111815] block">{apt.customerName}</strong>
                              <span className="text-[#718579]">{apt.customerPhone}</span>
                            </td>
                            <td className="p-3.5 text-[#111815] font-medium">
                              {apt.appointmentTypeName}
                            </td>
                            <td className="p-3.5">
                              <span className="text-[#111815] block font-medium">{apt.date}</span>
                              <span className="font-mono text-[#52665A]">{apt.startTime} – {apt.endTime}</span>
                            </td>
                            <td className="p-3.5 text-[#52665A]">{apt.guestCount}</td>
                            <td className="p-3.5">
                              <span
                                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                  apt.status === 'CONFIRMED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : apt.status === 'CHECKED-IN'
                                    ? 'bg-blue-100 text-blue-800'
                                    : apt.status === 'COMPLETED'
                                    ? 'bg-slate-100 text-slate-700'
                                    : apt.status === 'CANCELLED'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => setViewingBooking(apt)}
                                className="px-2 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 rounded text-slate-800 font-medium"
                              >
                                View
                              </button>
                              {apt.status === 'PENDING' && (
                                <button
                                  onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                                  className="px-2 py-1 text-[11px] bg-emerald-600 hover:bg-emerald-700 rounded text-white font-medium"
                                >
                                  Confirm
                                </button>
                              )}
                              {apt.status === 'CONFIRMED' && (
                                <button
                                  onClick={() => handleUpdateStatus(apt.id, 'CHECKED-IN')}
                                  className="px-2 py-1 text-[11px] bg-blue-600 hover:bg-blue-700 rounded text-white font-medium"
                                >
                                  Check In
                                </button>
                              )}
                              {apt.status === 'CHECKED-IN' && (
                                <button
                                  onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                                  className="px-2 py-1 text-[11px] bg-emerald-600 hover:bg-emerald-700 rounded text-white font-medium"
                                >
                                  Complete
                                </button>
                              )}
                              {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                                <button
                                  onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')}
                                  className="px-2 py-1 text-[11px] text-red-600 hover:bg-red-50 rounded font-medium"
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: VISUAL CALENDAR
              ======================================================== */}
          {currentTab === 'calendar' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-[#111815]">Appointment Calendar</h1>
                  <p className="text-xs text-[#52665A]">
                    Interactive schedule view for NEWME Phoenix Marketcity styling suites.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBlockDateModal(true)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-black rounded cursor-pointer flex items-center gap-1.5"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Block Date / Hours</span>
                  </button>
                </div>
              </div>

              {/* Calendar Grid Representation (Next 14 Days) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(14)].map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() + i);
                  const dStr = d.toISOString().split('T')[0];
                  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                  const monthName = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                  const dayApts = appointments.filter((a) => a.date === dStr && a.status !== 'CANCELLED');
                  const isBlocked = blockedDates.some((b) => b.date === dStr);

                  return (
                    <div
                      key={dStr}
                      className={`bg-white border rounded-xl p-4 shadow-xs flex flex-col justify-between min-h-[160px] ${
                        i === 0
                          ? 'border-[#134E35] ring-1 ring-[#134E35]'
                          : isBlocked
                          ? 'border-amber-300 bg-amber-50/30'
                          : 'border-[#E1ECE5]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between pb-2 border-b border-[#E8EFEA]">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#718579]">
                              {dayName}
                            </span>
                            <h4 className="font-serif text-base font-bold text-[#111815]">{monthName}</h4>
                          </div>
                          {isBlocked && (
                            <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                              Blocked
                            </span>
                          )}
                        </div>

                        <div className="mt-3 space-y-1.5">
                          {dayApts.length === 0 ? (
                            <span className="text-[11px] text-[#718579] italic block">No bookings</span>
                          ) : (
                            dayApts.map((a) => (
                              <div
                                key={a.id}
                                onClick={() => setViewingBooking(a)}
                                className="p-1.5 bg-[#F2F7F4] hover:bg-[#E1ECE5] border border-[#CBDAD1] rounded text-[11px] cursor-pointer"
                              >
                                <span className="font-mono font-bold text-[#134E35] mr-1">{a.startTime}</span>
                                <span className="font-semibold text-[#111815] truncate">{a.customerName}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-2 border-t border-[#E8EFEA] text-[10px] text-[#718579] flex justify-between">
                        <span>{dayApts.length} reserved</span>
                        <button
                          onClick={() => {
                            setShowNewBookingModal(true);
                          }}
                          className="text-[#134E35] font-bold hover:underline cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: CUSTOMER DIRECTORY
              ======================================================== */}
          {currentTab === 'customers' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#111815]">Customer Directory</h1>
                <p className="text-xs text-[#52665A]">
                  Aggregated styling profiles, visit frequency, and contact records.
                </p>
              </div>

              <div className="bg-white border border-[#E1ECE5] rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#F6F8F6] border-b border-[#E1ECE5] text-[#52665A] font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3.5">Customer Name</th>
                        <th className="p-3.5">Contact</th>
                        <th className="p-3.5">Total Visits</th>
                        <th className="p-3.5">Last Visit</th>
                        <th className="p-3.5">Preferred Size</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8EFEA]">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-[#FBFBF9]">
                          <td className="p-3.5 font-bold text-[#111815]">{c.name}</td>
                          <td className="p-3.5 text-[#52665A]">
                            <div>{c.email}</div>
                            <div className="font-mono text-[#718579]">{c.phone}</div>
                          </td>
                          <td className="p-3.5 font-mono font-bold text-[#134E35]">{c.totalBookings}</td>
                          <td className="p-3.5 text-[#52665A]">{c.lastVisit}</td>
                          <td className="p-3.5">{c.preferredSize}</td>
                          <td className="p-3.5">
                            <span className="text-[10px] font-bold uppercase bg-[#EBF3EE] text-[#134E35] px-2 py-0.5 rounded">
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: APPOINTMENT TYPES
              ======================================================== */}
          {currentTab === 'appointment-types' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-[#111815]">Appointment Types</h1>
                  <p className="text-xs text-[#52665A]">
                    Configure durations, capacities, and descriptions for store visits.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewServiceModal(true)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointmentTypes.map((type) => (
                  <div key={type.id} className="bg-white border border-[#E1ECE5] p-5 rounded-xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#134E35] bg-[#EBF3EE] px-2 py-0.5 rounded">
                        {type.tag}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${type.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                        {type.active ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#111815]">{type.name}</h3>
                      <p className="text-xs text-[#4F6256] mt-1.5 leading-relaxed">{type.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#E8EFEA] flex items-center justify-between text-xs text-[#52665A]">
                      <span>Duration: {type.duration}m</span>
                      <span>Capacity: {type.capacity}</span>
                      <button
                        onClick={async () => {
                          await api.updateAppointmentType(type.id, { active: !type.active });
                          triggerToast(`Updated ${type.name} status`);
                          reloadData();
                        }}
                        className="text-[#134E35] font-bold hover:underline cursor-pointer"
                      >
                        {type.active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: BUSINESS HOURS
              ======================================================== */}
          {currentTab === 'business-hours' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#111815]">Business Operating Hours</h1>
                <p className="text-xs text-[#52665A]">
                  Manage Monday through Sunday opening and closing hours for Phoenix Marketcity Pune.
                </p>
              </div>

              <div className="bg-white border border-[#E1ECE5] rounded-xl p-6 shadow-xs max-w-2xl space-y-4">
                <div className="divide-y divide-[#E8EFEA]">
                  {businessHours.map((bh, idx) => (
                    <div key={bh.id} className="py-3 flex items-center justify-between text-xs">
                      <span className="font-bold text-sm text-[#111815] w-28">{bh.dayOfWeek}</span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-[#4A5D52]">
                          <input
                            type="checkbox"
                            checked={bh.isOpen}
                            onChange={(e) => {
                              const updated = [...businessHours];
                              updated[idx].isOpen = e.target.checked;
                              setBusinessHours(updated);
                            }}
                          />
                          <span>Open</span>
                        </label>

                        {bh.isOpen && (
                          <div className="flex items-center gap-1">
                            <input
                              type="time"
                              value={bh.openTime}
                              onChange={(e) => {
                                const updated = [...businessHours];
                                updated[idx].openTime = e.target.value;
                                setBusinessHours(updated);
                              }}
                              className="px-2 py-1 border border-[#CBDAD1] rounded text-xs"
                            />
                            <span>to</span>
                            <input
                              type="time"
                              value={bh.closeTime}
                              onChange={(e) => {
                                const updated = [...businessHours];
                                updated[idx].closeTime = e.target.value;
                                setBusinessHours(updated);
                              }}
                              className="px-2 py-1 border border-[#CBDAD1] rounded text-xs"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={async () => {
                      await api.updateBusinessHours(businessHours);
                      triggerToast('Store operating hours successfully saved');
                      reloadData();
                    }}
                    className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: BLOCKED DATES & EVENTS
              ======================================================== */}
          {currentTab === 'blocked-dates' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-[#111815]">Blocked Dates & Event Closures</h1>
                  <p className="text-xs text-[#52665A]">
                    Block styling availability for private previews, mall events, inventory audits, or holidays.
                  </p>
                </div>
                <button
                  onClick={() => setShowBlockDateModal(true)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Block New Date</span>
                </button>
              </div>

              <div className="bg-white border border-[#E1ECE5] rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F6F8F6] border-b border-[#E1ECE5] text-[#52665A] font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Scope</th>
                      <th className="p-3.5">Reason</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8EFEA]">
                    {blockedDates.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-[#718579]">
                          No blocked dates currently active.
                        </td>
                      </tr>
                    ) : (
                      blockedDates.map((b) => (
                        <tr key={b.id} className="hover:bg-[#FBFBF9]">
                          <td className="p-3.5 font-bold font-mono text-[#111815]">{b.date}</td>
                          <td className="p-3.5">
                            {b.isFullDay ? (
                              <span className="text-[10px] font-bold uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded">
                                Full Day Closed
                              </span>
                            ) : (
                              <span className="font-mono text-[#134E35]">
                                {b.startTime} – {b.endTime}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-[#4F6256]">{b.reason}</td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={async () => {
                                await api.deleteBlockedDate(b.id);
                                triggerToast('Blocked date removed');
                                reloadData();
                              }}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: COLLECTIONS
              ======================================================== */}
          {currentTab === 'collections' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-[#111815]">Collections & Lookbooks</h1>
                  <p className="text-xs text-[#52665A]">
                    Manage categories displayed across the website and link to official e-commerce drops.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewCollectionModal(true)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Collection</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {collections.map((col) => (
                  <div key={col.id} className="bg-white border border-[#E1ECE5] rounded-xl overflow-hidden shadow-xs">
                    <div className="aspect-[3/4] relative bg-slate-100">
                      <img src={col.image} alt={col.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {col.featured && (
                          <span className="bg-[#134E35] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${col.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                          {col.active ? 'Active' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-serif text-lg font-bold text-[#111815]">{col.name}</h4>
                      <p className="text-xs text-[#52665A] line-clamp-2">{col.description}</p>
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <button
                          onClick={async () => {
                            await api.updateCollection(col.id, { active: !col.active });
                            reloadData();
                          }}
                          className="text-[#134E35] font-bold hover:underline"
                        >
                          {col.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={async () => {
                            await api.deleteCollection(col.id);
                            reloadData();
                          }}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: GALLERY
              ======================================================== */}
          {currentTab === 'gallery' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-[#111815]">Gallery Media</h1>
                  <p className="text-xs text-[#52665A]">
                    Upload and categorize store visuals, runway looks, and Pune retail photos.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewGalleryModal(true)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map((g) => (
                  <div key={g.id} className="bg-white border border-[#E1ECE5] rounded-lg overflow-hidden shadow-xs">
                    <div className="aspect-[3/4] relative">
                      <img src={g.imageUrl} alt={g.altText} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 text-[9px] font-bold uppercase bg-black/70 text-white px-2 py-0.5 rounded">
                        {g.category}
                      </span>
                    </div>
                    <div className="p-3 flex items-center justify-between text-xs">
                      <span className="font-medium text-[#111815] truncate mr-2">{g.title}</span>
                      <button
                        onClick={async () => {
                          await api.deleteGalleryItem(g.id);
                          reloadData();
                        }}
                        className="text-red-600 hover:underline shrink-0"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: REVIEWS
              ======================================================== */}
          {currentTab === 'reviews' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#111815]">Customer Reviews Moderation</h1>
                <p className="text-xs text-[#52665A]">
                  Review, approve, or feature testimonials submitted by customers.
                </p>
              </div>

              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="bg-white border border-[#E1ECE5] p-5 rounded-xl shadow-xs flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-[#111815]">{r.customerName}</strong>
                        <div className="flex text-[#134E35]">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-[10px] text-[#718579] font-mono">{r.reviewDate}</span>
                      </div>
                      <p className="text-xs text-[#4F6256] italic">"{r.reviewText}"</p>
                      <span className="text-[10px] text-[#718579] block">Visit: {r.visitType}</span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={async () => {
                          await api.updateReview(r.id, { approved: !r.approved });
                          reloadData();
                        }}
                        className={`px-3 py-1 text-xs font-semibold rounded ${
                          r.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {r.approved ? 'Approved' : 'Approve'}
                      </button>
                      <button
                        onClick={async () => {
                          await api.deleteReview(r.id);
                          reloadData();
                        }}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: PROMOTIONS
              ======================================================== */}
          {currentTab === 'promotions' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#111815]">Promotions & In-Store Drops</h1>
                <p className="text-xs text-[#52665A]">
                  Active promotional announcements configured for the Phoenix Marketcity boutique.
                </p>
              </div>

              <div className="space-y-4">
                {promotions.map((p) => (
                  <div key={p.id} className="bg-white border border-[#E1ECE5] p-5 rounded-xl shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#134E35] bg-[#EBF3EE] px-2 py-0.5 rounded">
                        Active In-Store Banner
                      </span>
                      <h4 className="font-serif text-xl font-bold text-[#111815] mt-1">{p.title}</h4>
                      <p className="text-xs text-[#52665A]">{p.subtitle}</p>
                    </div>
                    <span className="text-xs font-mono text-[#718579]">{p.startDate} to {p.endDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: STORE SETTINGS
              ======================================================== */}
          {currentTab === 'settings' && storeInfo && storeSettings && (
            <div className="space-y-6 animate-in fade-in-50 duration-300 max-w-3xl">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#111815]">Store Configuration & Settings</h1>
                <p className="text-xs text-[#52665A]">
                  Operational parameters, store contact points, and booking engine constraints.
                </p>
              </div>

              <div className="bg-white border border-[#E1ECE5] rounded-xl p-6 shadow-xs space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#111815]">Store Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#38463F] mb-1">Store Name</label>
                    <input
                      type="text"
                      value={storeInfo.name}
                      onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                      className="w-full px-3 py-2 border border-[#CBDAD1] rounded bg-[#FBFBF9]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#38463F] mb-1">Store Phone</label>
                    <input
                      type="text"
                      value={storeInfo.phone}
                      onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-[#CBDAD1] rounded bg-[#FBFBF9]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-[#38463F] mb-1">Address</label>
                    <input
                      type="text"
                      value={storeInfo.address}
                      onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
                      className="w-full px-3 py-2 border border-[#CBDAD1] rounded bg-[#FBFBF9]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#38463F] mb-1">Store Email</label>
                    <input
                      type="email"
                      value={storeInfo.email}
                      onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                      className="w-full px-3 py-2 border border-[#CBDAD1] rounded bg-[#FBFBF9]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#38463F] mb-1">Google Maps URL</label>
                    <input
                      type="text"
                      value={storeInfo.googleMapsUrl}
                      onChange={(e) => setStoreInfo({ ...storeInfo, googleMapsUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-[#CBDAD1] rounded bg-[#FBFBF9]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8EFEA]">
                  <h3 className="font-serif text-xl font-bold text-[#111815] mb-4">Booking Engine Controls</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#38463F] mb-1">Slot Interval (mins)</label>
                      <input
                        type="number"
                        value={storeSettings.bookingIntervalMin}
                        onChange={(e) => setStoreSettings({ ...storeSettings, bookingIntervalMin: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-[#CBDAD1] rounded bg-[#FBFBF9]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#38463F] mb-1">Max Simultaneous Bookings</label>
                      <input
                        type="number"
                        value={storeSettings.maxSimultaneousBookings}
                        onChange={(e) => setStoreSettings({ ...storeSettings, maxSimultaneousBookings: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-[#CBDAD1] rounded bg-[#FBFBF9]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#38463F] mb-1">Min Notice (hours)</label>
                      <input
                        type="number"
                        value={storeSettings.minNoticeHours}
                        onChange={(e) => setStoreSettings({ ...storeSettings, minNoticeHours: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-[#CBDAD1] rounded bg-[#FBFBF9]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={async () => {
                      await Promise.all([
                        api.updateStore(storeInfo),
                        api.updateSettings(storeSettings),
                      ]);
                      triggerToast('Store operational settings updated');
                      reloadData();
                    }}
                    className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded cursor-pointer"
                  >
                    Save Store Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Booking View Modal */}
      {viewingBooking && (
        <div
          onClick={() => setViewingBooking(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl cursor-default space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E1ECE5]">
              <div>
                <span className="font-mono text-xs text-[#134E35] font-bold block">{viewingBooking.bookingNumber}</span>
                <h3 className="font-serif text-2xl font-bold text-[#111815]">{viewingBooking.appointmentTypeName}</h3>
              </div>
              <span className="text-[10px] uppercase font-bold bg-[#EBF3EE] text-[#134E35] px-2.5 py-1 rounded">
                {viewingBooking.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase text-[#718579] block">Customer</span>
                <strong className="text-[#111815]">{viewingBooking.customerName}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#718579] block">Phone</span>
                <strong className="text-[#111815]">{viewingBooking.customerPhone}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#718579] block">Date</span>
                <strong className="text-[#111815]">{viewingBooking.date}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#718579] block">Time Slot</span>
                <strong className="text-[#134E35]">{viewingBooking.startTime} – {viewingBooking.endTime}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#718579] block">Guests</span>
                <span>{viewingBooking.guestCount} Guest(s)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#718579] block">Preferred Size</span>
                <span>{viewingBooking.preferredSize}</span>
              </div>
            </div>

            {viewingBooking.stylePreference && (
              <div className="p-3 bg-[#FBFBF9] rounded text-xs">
                <strong>Style Preference:</strong> {viewingBooking.stylePreference}
              </div>
            )}

            {viewingBooking.specialRequest && (
              <div className="p-3 bg-[#FBFBF9] rounded text-xs">
                <strong>Special Request:</strong> {viewingBooking.specialRequest}
              </div>
            )}

            <div className="pt-3 border-t border-[#E1ECE5] flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleUpdateStatus(viewingBooking.id, 'CONFIRMED')}
                  className="px-2.5 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleUpdateStatus(viewingBooking.id, 'CHECKED-IN')}
                  className="px-2.5 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium rounded"
                >
                  Check In
                </button>
                <button
                  onClick={() => handleUpdateStatus(viewingBooking.id, 'COMPLETED')}
                  className="px-2.5 py-1.5 text-xs bg-slate-700 hover:bg-slate-800 text-white font-medium rounded"
                >
                  Complete
                </button>
                <button
                  onClick={() => handleUpdateStatus(viewingBooking.id, 'NO-SHOW')}
                  className="px-2.5 py-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium rounded"
                >
                  No-Show
                </button>
              </div>
              <button
                onClick={() => setViewingBooking(null)}
                className="px-4 py-1.5 text-xs font-semibold text-[#52665A] hover:text-[#111815]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Date Modal */}
      {showBlockDateModal && (
        <div
          onClick={() => setShowBlockDateModal(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl cursor-default space-y-4"
          >
            <h3 className="font-serif text-xl font-bold text-[#111815]">Block Store Date / Hours</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const date = (form.elements.namedItem('date') as HTMLInputElement).value;
                const reason = (form.elements.namedItem('reason') as HTMLInputElement).value;
                const isFullDay = (form.elements.namedItem('isFullDay') as HTMLInputElement).checked;
                const startTime = (form.elements.namedItem('startTime') as HTMLInputElement)?.value;
                const endTime = (form.elements.namedItem('endTime') as HTMLInputElement)?.value;

                await api.createBlockedDate({
                  date,
                  reason,
                  isFullDay,
                  startTime: isFullDay ? null : startTime,
                  endTime: isFullDay ? null : endTime,
                });
                setShowBlockDateModal(false);
                triggerToast('Blocked date saved successfully');
                reloadData();
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-[#38463F] mb-1">Target Date *</label>
                <input type="date" name="date" required className="w-full px-3 py-2 border border-[#CBDAD1] rounded" />
              </div>

              <div>
                <label className="block font-bold text-[#38463F] mb-1">Reason for Block *</label>
                <input type="text" name="reason" placeholder="e.g. VIP Styling Event, Inventory Audit" required className="w-full px-3 py-2 border border-[#CBDAD1] rounded" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="fullDayCheck" name="isFullDay" defaultChecked />
                <label htmlFor="fullDayCheck" className="font-semibold text-[#111815]">Full Day Closed</label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBlockDateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#52665A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded"
                >
                  Save Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
