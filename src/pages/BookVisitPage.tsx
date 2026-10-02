import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CalendarCheck,
  Share2,
} from 'lucide-react';
import { AppointmentType, TimeSlot, Appointment } from '../types';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface BookVisitPageProps {
  onNavigate: (path: string) => void;
  preselectedTypeId?: string;
}

export const BookVisitPage: React.FC<BookVisitPageProps> = ({ onNavigate, preselectedTypeId }) => {
  const { user } = useAuth();

  // Steps: 1 = Type, 2 = Date & Time, 3 = Details, 4 = Review, 5 = Confirmed
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [selectedType, setSelectedType] = useState<AppointmentType | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  // Customer Details Form
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [stylePreference, setStylePreference] = useState('Chic & Contemporary');
  const [occasion, setOccasion] = useState('Weekend Outing');
  const [preferredSize, setPreferredSize] = useState('M');
  const [specialRequest, setSpecialRequest] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [preferredContact, setPreferredContact] = useState<'WHATSAPP' | 'SMS' | 'EMAIL' | 'PHONE'>('WHATSAPP');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Load appointment types
  useEffect(() => {
    async function loadTypes() {
      try {
        const types = await api.getAppointmentTypes(true);
        setAppointmentTypes(types);
        if (preselectedTypeId) {
          const match = types.find((t) => t.id === preselectedTypeId);
          if (match) setSelectedType(match);
        } else if (types.length > 0) {
          setSelectedType(types[0]);
        }
      } catch (err) {
        console.error('Failed to load appointment types:', err);
      }
    }
    loadTypes();
  }, [preselectedTypeId]);

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setSelectedDate(dateStr);
  }, []);

  // Fetch slots whenever date or appointment type changes
  useEffect(() => {
    if (!selectedDate || !selectedType) return;

    let isMounted = true;
    async function fetchAvailability() {
      setLoadingSlots(true);
      setSlotError(null);
      setSelectedSlot(null);
      try {
        const data = await api.getAvailability(selectedDate, selectedType!.id);
        if (!isMounted) return;
        if (!data.isOpen) {
          setSlotError(data.reason || 'Store is closed on this date.');
          setAvailableSlots([]);
        } else {
          setAvailableSlots(data.slots);
          if (data.slots.length === 0) {
            setSlotError('No time slots available for this date. Please pick another date.');
          }
        }
      } catch (err: any) {
        if (!isMounted) return;
        setSlotError(err.message || 'Failed to check slot availability.');
        setAvailableSlots([]);
      } finally {
        if (isMounted) setLoadingSlots(false);
      }
    }

    fetchAvailability();
    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedType]);

  // Form submission with backend availability re-check
  const handleConfirmBooking = async () => {
    if (!selectedType || !selectedDate || !selectedSlot) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload: Partial<Appointment> = {
        customerName,
        customerEmail,
        customerPhone,
        appointmentTypeId: selectedType.id,
        appointmentTypeName: selectedType.name,
        date: selectedDate,
        startTime: selectedSlot.time,
        guestCount,
        stylePreference,
        occasion,
        preferredSize,
        specialRequest,
        instagramHandle,
        preferredContactMethod: preferredContact,
        customerId: user?.id,
      };

      const result = await api.createAppointment(payload);
      setConfirmedBooking(result);
      setCurrentStep(5); // Show confirmation view
    } catch (err: any) {
      setSubmitError(err.message || 'Unable to book visit. The slot may have just been reserved.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Service' },
    { num: 2, label: 'Date & Time' },
    { num: 3, label: 'Your Details' },
    { num: 4, label: 'Review' },
  ];

  // Helper date minimum: today
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#FBFBF9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#134E35]">
            Store Visit Booking Engine
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#111815]">
            RESERVE YOUR VISIT
          </h1>
          <p className="text-xs sm:text-sm text-[#4F6256] max-w-lg mx-auto leading-relaxed">
            NEWME Phoenix Marketcity Pune · Lower Ground Floor, Shop 10
          </p>
        </div>

        {/* Step Progress Bar (Clean editorial style, zero-pill) */}
        {currentStep < 5 && (
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              {stepsList.map((s, idx) => {
                const isActive = currentStep === s.num;
                const isPassed = currentStep > s.num;
                return (
                  <React.Fragment key={s.num}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isActive
                            ? 'bg-[#134E35] text-white shadow-xs'
                            : isPassed
                            ? 'bg-[#E1ECE5] text-[#134E35]'
                            : 'bg-white border border-[#D5E5DB] text-[#718579]'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                      </div>
                      <span
                        className={`text-[11px] uppercase tracking-wider mt-1.5 font-medium ${
                          isActive ? 'text-[#134E35] font-bold' : 'text-[#718579]'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < stepsList.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 transition-colors ${
                          currentStep > idx + 1 ? 'bg-[#134E35]' : 'bg-[#E1ECE5]'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 1: SELECT APPOINTMENT TYPE
            ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="bg-white border border-[#E1ECE5] p-6 sm:p-8 rounded-xl shadow-xs">
              <h2 className="font-serif text-2xl font-bold text-[#111815] mb-2">
                01. Select Your Experience
              </h2>
              <p className="text-xs text-[#52665A] mb-6">
                Choose the dedicated service tailored to your styling goals.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointmentTypes.map((type) => {
                  const isSelected = selectedType?.id === type.id;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type)}
                      className={`p-5 rounded-lg border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#134E35] bg-[#F2F7F4] ring-1 ring-[#134E35]'
                          : 'border-[#E1ECE5] bg-white hover:border-[#134E35]/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#134E35] bg-[#E1ECE5] px-2 py-0.5 rounded">
                            {type.tag}
                          </span>
                          <span className="text-xs text-[#52665A] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#134E35]" />
                            <span>{type.duration} mins</span>
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-[#111815]">
                          {type.name}
                        </h3>
                        <p className="text-xs text-[#4F6256] mt-1.5 leading-relaxed">
                          {type.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#E1ECE5] flex items-center justify-between text-xs text-[#52665A]">
                        <span>Capacity: Up to {type.capacity} guest{type.capacity > 1 ? 's' : ''}</span>
                        <span className={`font-semibold text-xs ${isSelected ? 'text-[#134E35]' : 'text-slate-400'}`}>
                          {isSelected ? 'Selected' : 'Select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  disabled={!selectedType}
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white bg-[#134E35] hover:bg-[#0A2419] disabled:opacity-50 rounded transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Continue to Date & Time</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 2: SELECT DATE & REAL-TIME AVAILABLE SLOTS
            ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="bg-white border border-[#E1ECE5] p-6 sm:p-8 rounded-xl shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#111815]">
                    02. Select Date & Time Slot
                  </h2>
                  <p className="text-xs text-[#52665A] mt-1">
                    Service: <strong className="text-[#134E35]">{selectedType?.name}</strong> ({selectedType?.duration} mins)
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-[#134E35] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Change Service</span>
                </button>
              </div>

              {/* Date Input */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-2">
                  Select Preferred Date
                </label>
                <div className="relative max-w-sm">
                  <input
                    type="date"
                    min={todayStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded-md text-sm text-[#111815] focus:outline-none focus:border-[#134E35] focus:ring-1 focus:ring-[#134E35]"
                  />
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F]">
                    Available Times for {selectedDate}
                  </label>
                  <span className="text-[11px] text-[#718579]">
                    Store Hours: 10:30 AM – 9:30 PM
                  </span>
                </div>

                {loadingSlots ? (
                  <div className="py-12 text-center text-xs text-[#52665A] animate-pulse">
                    Checking real-time slot availability at Phoenix Marketcity Pune...
                  </div>
                ) : slotError ? (
                  <div className="p-4 bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-md flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{slotError}</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#718579] bg-[#FBFBF9] border border-[#E1ECE5] rounded-md">
                    No open appointment slots remaining on this day. Please select a different date.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot?.time === slot.time;
                      const isUnavailable = !slot.available;

                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={isUnavailable}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#134E35] text-white border-[#134E35] shadow-xs'
                              : isUnavailable
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                              : 'bg-white border-[#CBDAD1] hover:border-[#134E35] text-[#111815]'
                          }`}
                        >
                          <span className="block font-semibold text-sm tabular-nums">
                            {slot.time}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 block ${
                              isSelected
                                ? 'text-[#A7F3D0]'
                                : slot.status === 'LIMITED'
                                ? 'text-amber-600'
                                : isUnavailable
                                ? 'text-slate-400'
                                : 'text-[#134E35]'
                            }`}
                          >
                            {slot.status === 'LIMITED' ? '1 slot left' : slot.status}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="mt-8 pt-4 border-t border-[#E1ECE5] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#52665A] hover:text-[#111815] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white bg-[#134E35] hover:bg-[#0A2419] disabled:opacity-50 rounded transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Enter Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: CUSTOMER DETAILS & STYLING PREFERENCES
            ======================================================== */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="bg-white border border-[#E1ECE5] p-6 sm:p-8 rounded-xl shadow-xs">
              <h2 className="font-serif text-2xl font-bold text-[#111815] mb-1">
                03. Guest Details & Preferences
              </h2>
              <p className="text-xs text-[#52665A] mb-6">
                Tell our Pune styling team about your preferences so we can pre-select fitting room rails before you arrive.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setCurrentStep(4);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-sm text-[#111815] focus:outline-none focus:border-[#134E35]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                      Mobile Number (For WhatsApp / SMS Confirmation) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-sm text-[#111815] focus:outline-none focus:border-[#134E35]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="priya@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-sm text-[#111815] focus:outline-none focus:border-[#134E35]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                      Number of Guests (Max 3)
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-sm text-[#111815] focus:outline-none focus:border-[#134E35]"
                    >
                      <option value={1}>1 Guest (Just Me)</option>
                      <option value={2}>2 Guests (Bringing a friend)</option>
                      <option value={3}>3 Guests</option>
                    </select>
                  </div>
                </div>

                {/* Fashion & Sizing Preferences */}
                <div className="pt-4 border-t border-[#E1ECE5] grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                      Preferred Size
                    </label>
                    <select
                      value={preferredSize}
                      onChange={(e) => setPreferredSize(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-xs text-[#111815] focus:outline-none focus:border-[#134E35]"
                    >
                      <option value="XS">XS (UK 6)</option>
                      <option value="S">S (UK 8)</option>
                      <option value="M">M (UK 10)</option>
                      <option value="L">L (UK 12)</option>
                      <option value="XL">XL (UK 14)</option>
                      <option value="XXL">XXL (UK 16)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                      Occasion / Goal
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Birthday, Concert, Daily"
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-xs text-[#111815] focus:outline-none focus:border-[#134E35]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                      Instagram Handle (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="@handle"
                      value={instagramHandle}
                      onChange={(e) => setInstagramHandle(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-xs text-[#111815] focus:outline-none focus:border-[#134E35]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                    Style Aesthetic or Specific Outfits You Love
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sage green co-ords, cargo trousers, satin dresses"
                    value={stylePreference}
                    onChange={(e) => setStylePreference(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-xs text-[#111815] focus:outline-none focus:border-[#134E35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                    Special Fitting Suite Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Any specific requests or requirements for your stylist..."
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-xs text-[#111815] focus:outline-none focus:border-[#134E35]"
                  />
                </div>

                <div className="mt-8 pt-4 border-t border-[#E1ECE5] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2.5 text-xs font-semibold text-[#52665A] hover:text-[#111815] cursor-pointer"
                  >
                    Back to Date
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white bg-[#134E35] hover:bg-[#0A2419] rounded transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Review Booking</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 4: REVIEW & CONFIRM (Strict double-booking prevention)
            ======================================================== */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="bg-white border border-[#E1ECE5] p-6 sm:p-8 rounded-xl shadow-xs">
              <h2 className="font-serif text-2xl font-bold text-[#111815] mb-2">
                04. Review Your Booking Summary
              </h2>
              <p className="text-xs text-[#52665A] mb-6">
                Please verify your appointment specifications before confirming.
              </p>

              {submitError && (
                <div className="mb-6 p-4 bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="bg-[#FBFBF9] border border-[#E1ECE5] rounded-lg p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#718579] block">
                      Service
                    </span>
                    <span className="font-serif text-lg font-bold text-[#111815]">
                      {selectedType?.name}
                    </span>
                    <span className="text-[#52665A] block mt-0.5">
                      Duration: {selectedType?.duration} minutes
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#718579] block">
                      Date & Arrival Time
                    </span>
                    <span className="font-serif text-lg font-bold text-[#134E35]">
                      {selectedDate} at {selectedSlot?.time}
                    </span>
                    <span className="text-[#52665A] block mt-0.5">
                      Ends approx: {selectedSlot?.endTime}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#718579] block">
                      Guest & Contact
                    </span>
                    <span className="font-semibold text-[#111815] block">{customerName}</span>
                    <span className="text-[#52665A] block">{customerPhone}</span>
                    {customerEmail && <span className="text-[#52665A] block">{customerEmail}</span>}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#718579] block">
                      Store Destination
                    </span>
                    <span className="font-semibold text-[#111815] block">
                      NEWME Phoenix Marketcity Pune
                    </span>
                    <span className="text-[#52665A] block">
                      Lower Ground Floor, Shop 10, Viman Nagar
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E1ECE5] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-[#718579] block">Party Size:</span>
                    <span className="font-semibold text-[#111815]">{guestCount} Guest{guestCount > 1 ? 's' : ''}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#718579] block">Preferred Size:</span>
                    <span className="font-semibold text-[#111815]">{preferredSize}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#718579] block">Occasion:</span>
                    <span className="font-semibold text-[#111815] truncate block">{occasion}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#718579] block">Fee:</span>
                    <span className="font-semibold text-[#134E35]">Complimentary</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E1ECE5] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#52665A] hover:text-[#111815] cursor-pointer"
                >
                  Edit Information
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmBooking}
                  className="px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white bg-[#134E35] hover:bg-[#0A2419] disabled:opacity-50 rounded shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  {submitting ? (
                    <span>Verifying Slot & Reserving...</span>
                  ) : (
                    <>
                      <CalendarCheck className="w-4 h-4" />
                      <span>Confirm & Book Store Visit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 5: CONFIRMATION SCREEN (YOUR VISIT IS BOOKED)
            ======================================================== */}
        {currentStep === 5 && confirmedBooking && (
          <div className="animate-in fade-in-50 duration-500 max-w-2xl mx-auto">
            <div className="bg-white border border-[#D1E5DA] p-8 sm:p-10 rounded-xl shadow-md text-center space-y-6">
              <div className="w-16 h-16 bg-[#EBF3EE] text-[#134E35] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#134E35]">
                  Reservation Confirmed
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111815] mt-1">
                  YOUR VISIT IS BOOKED
                </h2>
                <p className="text-xs sm:text-sm text-[#4F6256] mt-2">
                  We look forward to hosting you at NEWME Phoenix Marketcity Pune.
                </p>
              </div>

              {/* Booking Voucher Card */}
              <div className="bg-[#FBFBF9] border border-[#E1ECE5] rounded-lg p-6 text-left space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E1ECE5]">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#718579]">
                      Booking Reference
                    </span>
                    <span className="font-mono text-base font-bold text-[#134E35] block">
                      {confirmedBooking.bookingNumber}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                    {confirmedBooking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-[#718579] block">Guest Name</span>
                    <strong className="text-[#111815]">{confirmedBooking.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#718579] block">Experience</span>
                    <strong className="text-[#111815]">{confirmedBooking.appointmentTypeName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#718579] block">Date</span>
                    <strong className="text-[#111815]">{confirmedBooking.date}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#718579] block">Time Slot</span>
                    <strong className="text-[#134E35]">{confirmedBooking.startTime} – {confirmedBooking.endTime}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E1ECE5] text-xs space-y-1">
                  <span className="text-[10px] uppercase text-[#718579] block">Store Address</span>
                  <p className="text-[#111815] font-medium">
                    NEWME · 10, Lower Ground Floor, Phoenix Marketcity, GP 09, Clover Park, Viman Nagar, Pune
                  </p>
                  <p className="text-[#52665A] text-[11px]">
                    Bring your booking ID or show this confirmation on your phone at reception.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://maps.google.com/?q=Phoenix+Marketcity+Pune+Viman+Nagar"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#134E35] bg-[#EBF3EE] hover:bg-[#DDF0E4] rounded transition-colors inline-flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>

                <button
                  onClick={() => onNavigate('/account')}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded transition-colors cursor-pointer"
                >
                  View in My Account
                </button>

                <button
                  onClick={() => onNavigate('/')}
                  className="px-5 py-2.5 text-xs font-semibold text-[#52665A] hover:text-[#111815] cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
