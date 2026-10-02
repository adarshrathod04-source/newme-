import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Appointment } from '../types';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, ArrowRight, User as UserIcon, Sparkles } from 'lucide-react';

interface AccountPageProps {
  onNavigate: (path: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function loadBookings() {
      if (!user) return;
      try {
        const data = await api.getAppointments({ customerId: user.id });
        setAppointments(data);
      } catch (err) {
        console.error('Failed to load user appointments:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FBFBF9] py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white border border-[#E1ECE5] p-8 rounded-xl shadow-xs space-y-4">
          <UserIcon className="w-12 h-12 text-[#134E35] mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-[#111815]">Please Sign In</h2>
          <p className="text-xs text-[#52665A]">Sign in or create an account to view and manage your Phoenix Pune store visits.</p>
          <button
            onClick={() => onNavigate('/login')}
            className="w-full py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded cursor-pointer"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const upcoming = appointments.filter(
    (a) => a.date >= todayStr && a.status !== 'CANCELLED' && a.status !== 'NO-SHOW'
  );
  const past = appointments.filter(
    (a) => a.date < todayStr || a.status === 'CANCELLED' || a.status === 'NO-SHOW'
  );

  const handleCancelBooking = async () => {
    if (!cancelModalApt) return;
    setCancelling(true);
    try {
      await api.updateAppointment(cancelModalApt.id, { status: 'CANCELLED' });
      setAppointments((prev) =>
        prev.map((a) => (a.id === cancelModalApt.id ? { ...a, status: 'CANCELLED' } : a))
      );
      setCancelModalApt(null);
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#111815] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Profile Bar */}
        <div className="bg-white border border-[#E1ECE5] p-6 sm:p-8 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#134E35] text-white flex items-center justify-center font-serif text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#134E35]">
                NEWME Club Pune
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#111815]">{user.name}</h1>
              <p className="text-xs text-[#52665A]">{user.email} · {user.phone || 'Phone not set'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/book-visit')}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book New Visit</span>
            </button>
            <button
              onClick={logout}
              className="px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Upcoming Visits */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#111815]">
              Upcoming Store Appointments
            </h2>
            <span className="text-xs text-[#718579] font-medium">
              {upcoming.length} Active Reservation{upcoming.length === 1 ? '' : 's'}
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-[#52665A] animate-pulse">
              Loading your bookings...
            </div>
          ) : upcoming.length === 0 ? (
            <div className="bg-white border border-[#E1ECE5] p-8 rounded-xl text-center space-y-3">
              <Calendar className="w-10 h-10 text-[#718579] mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#111815]">No Upcoming Visits</h3>
              <p className="text-xs text-[#52665A] max-w-sm mx-auto">
                Ready to explore new fits or consult with a stylist at Phoenix Marketcity? Reserve a private suite anytime.
              </p>
              <button
                onClick={() => onNavigate('/book-visit')}
                className="mt-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded cursor-pointer"
              >
                Book a Visit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white border border-[#D5E5DB] rounded-xl p-6 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#134E35]">
                        {apt.bookingNumber}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {apt.status}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#111815]">
                      {apt.appointmentTypeName}
                    </h3>

                    <div className="text-xs text-[#4F6256] space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#134E35]" />
                        <span className="font-medium text-[#111815]">{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#134E35]" />
                        <span className="font-mono">{apt.startTime} – {apt.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#134E35]" />
                        <span>Lower Ground Floor Shop 10, Phoenix Marketcity</span>
                      </div>
                    </div>

                    {apt.specialRequest && (
                      <div className="p-2.5 bg-[#FBFBF9] rounded text-[11px] text-[#52665A]">
                        <strong>Note:</strong> {apt.specialRequest}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#E8EFEA] flex items-center justify-between text-xs">
                    <a
                      href="https://maps.google.com/?q=Phoenix+Marketcity+Pune+Viman+Nagar"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#134E35] font-bold hover:underline"
                    >
                      Get Directions
                    </a>

                    <button
                      onClick={() => setCancelModalApt(apt)}
                      className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                    >
                      Cancel Visit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Visits */}
        {past.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-[#E1ECE5]">
            <h2 className="font-serif text-2xl font-bold text-[#111815]">
              Past Visits & History
            </h2>
            <div className="divide-y divide-[#E8EFEA] bg-white border border-[#E1ECE5] rounded-xl overflow-hidden">
              {past.map((apt) => (
                <div key={apt.id} className="p-5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-[10px] text-[#718579]">{apt.bookingNumber}</span>
                    <h4 className="font-bold text-[#111815] text-sm">{apt.appointmentTypeName}</h4>
                    <span className="text-[#52665A]">{apt.date} at {apt.startTime}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      apt.status === 'COMPLETED'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModalApt && (
        <div
          onClick={() => setCancelModalApt(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl cursor-default space-y-4"
          >
            <h3 className="font-serif text-xl font-bold text-[#111815]">Cancel Reservation?</h3>
            <p className="text-xs text-[#52665A] leading-relaxed">
              Are you sure you want to cancel your appointment ({cancelModalApt.appointmentTypeName} on {cancelModalApt.date} at {cancelModalApt.startTime})?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalApt(null)}
                className="px-4 py-2 text-xs font-semibold text-[#52665A] hover:text-[#111815]"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancelBooking}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded cursor-pointer"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
