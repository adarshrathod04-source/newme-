import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Plus, MessageSquareQuote, CheckCircle2, Calendar } from 'lucide-react';
import { ReviewItem } from '../types';
import { api } from '../lib/api';

interface ReviewsPageProps {
  onNavigate: (path: string) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onNavigate }) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New Review Form
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [visitType, setVisitType] = useState('Personal Styling');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await api.getReviews(true);
        setReviews(data);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !reviewText) return;

    setSubmitting(true);
    try {
      const created = await api.createReview({
        customerName: name,
        rating,
        reviewText,
        visitType,
      });
      setReviews([created, ...reviews]);
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setShowModal(false);
        setName('');
        setReviewText('');
        setRating(5);
      }, 1500);
    } catch (err) {
      console.error('Failed to post review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#111815] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-[#E1ECE5] pb-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#134E35]">
              Guest Reflections
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#111815]">
              STORE REVIEWS
            </h1>
            <p className="text-xs sm:text-sm text-[#4F6256] leading-relaxed">
              Read real impressions from shoppers and styling clients who visited NEWME at Phoenix Marketcity Pune.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white border border-[#E1ECE5] px-5 py-3 rounded-lg shadow-xs flex items-center gap-3">
              <div className="font-serif text-3xl font-bold text-[#134E35]">{avgRating}</div>
              <div className="text-xs">
                <div className="flex items-center text-[#134E35]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-[#718579]">{reviews.length} Verified Reviews</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-white bg-[#134E35] hover:bg-[#0A2419] rounded transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-[#52665A] animate-pulse">
            Loading customer reviews...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-[#E1ECE5] p-6 rounded-xl shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-[#134E35]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-[#718579]">{rev.reviewDate}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#38463F] leading-relaxed italic">
                    "{rev.reviewText}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E8EFEA] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#111815]">{rev.customerName}</h4>
                    <span className="text-[10px] text-[#52665A] block">{rev.visitType || 'Store Guest'}</span>
                  </div>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#134E35] bg-[#EBF3EE] px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Visit</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl cursor-default space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E1ECE5]">
              <h3 className="font-serif text-2xl font-bold text-[#111815]">Share Your Visit Experience</h3>
              <button onClick={() => setShowModal(false)} className="text-[#718579] hover:text-[#111815]">
                ✕
              </button>
            </div>

            {submittedSuccess ? (
              <div className="py-10 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[#134E35] mx-auto" />
                <h4 className="font-serif text-xl font-bold text-[#111815]">Thank You!</h4>
                <p className="text-xs text-[#52665A]">Your review for NEWME Phoenix Pune has been posted.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika Joshi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-sm text-[#111815] focus:outline-none focus:border-[#134E35]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                      Rating *
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-xs text-[#111815] focus:outline-none focus:border-[#134E35]"
                    >
                      <option value={5}>5 Stars - Outstanding</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Average</option>
                      <option value={2}>2 Stars - Below Expectations</option>
                      <option value={1}>1 Star - Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                      Experience Type
                    </label>
                    <select
                      value={visitType}
                      onChange={(e) => setVisitType(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-xs text-[#111815] focus:outline-none focus:border-[#134E35]"
                    >
                      <option value="Personal Styling">Personal Styling</option>
                      <option value="Outfit Consultation">Outfit Consultation</option>
                      <option value="Party Look Consultation">Party Look Consultation</option>
                      <option value="Shopping Assistance">Shopping Assistance</option>
                      <option value="Walk-in Store Visit">Walk-in Store Visit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about the customer service, store aesthetic, or fitting room experience..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-xs text-[#111815] focus:outline-none focus:border-[#134E35]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#52665A] hover:text-[#111815]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] disabled:opacity-50 rounded"
                  >
                    {submitting ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
