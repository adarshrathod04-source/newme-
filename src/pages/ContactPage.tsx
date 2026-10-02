import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Calendar, Navigation } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#111815] py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#134E35]">
            Get In Touch
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#111815]">
            CONTACT PHOENIX PUNE
          </h1>
          <p className="text-xs sm:text-sm text-[#4F6256] leading-relaxed">
            Have questions regarding fitting room availability, specific collection items, or private group styling sessions? Reach out to our Pune store team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Cards */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-[#E1ECE5] p-6 rounded-xl shadow-xs space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#111815]">Store Contact Details</h3>
              <div className="space-y-3 text-xs sm:text-sm text-[#4F6256]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#134E35] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#111815] block">Location:</strong>
                    <span>10, Lower Ground Floor, Phoenix Marketcity, GP 09, Clover Park, Viman Nagar, Pune, Maharashtra 411014</span>
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
                    <strong className="text-[#111815] inline mr-1">Direct Store Email:</strong>
                    <span>phoenix.pune@newme.asia</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#134E35] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#111815] block">Store Schedule:</strong>
                    <span>Monday – Thursday: 10:30 AM – 9:30 PM</span>
                    <span className="block">Friday – Sunday: 10:30 AM – 10:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <a
                  href="https://maps.google.com/?q=Phoenix+Marketcity+Pune+Viman+Nagar"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#134E35] hover:bg-[#0A2419] rounded transition-colors inline-flex items-center gap-2"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                </a>
                <button
                  onClick={() => onNavigate('/book-visit')}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#134E35] bg-[#EBF3EE] hover:bg-[#DDF0E4] rounded transition-colors cursor-pointer"
                >
                  Book Visit
                </button>
              </div>
            </div>

            {/* Mall Notice Card */}
            <div className="p-6 bg-[#0A2419] text-white rounded-xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#93C5AA]">Plan Your Arrival</span>
              <h4 className="font-serif text-xl font-bold">Phoenix Marketcity Parking</h4>
              <p className="text-xs text-[#CBDAD1] leading-relaxed">
                Enter via Nagar Road main gates and follow signage for Basement P2/P3 parking. The central atrium escalators and elevators lead directly to Lower Ground Floor Shop 10.
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-[#E1ECE5] p-6 sm:p-8 rounded-xl shadow-xs space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#111815]">Send a Direct Message</h3>
              <p className="text-xs text-[#52665A]">
                Our in-store concierge typically replies within 2–4 hours during store operating times.
              </p>

              {sent ? (
                <div className="py-12 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-[#134E35] mx-auto" />
                  <h4 className="font-serif text-xl font-bold text-[#111815]">Message Received</h4>
                  <p className="text-xs text-[#52665A]">Thank you. Our Pune styling desk will follow up shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Patel"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-sm text-[#111815] focus:outline-none focus:border-[#134E35]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="maya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-sm text-[#111815] focus:outline-none focus:border-[#134E35]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#38463F] mb-1">
                      Message / Request *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Ask about size availability, booking private styling, or directions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FBFBF9] border border-[#CBDAD1] rounded text-xs text-[#111815] focus:outline-none focus:border-[#134E35]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 text-xs font-bold uppercase tracking-widest text-white bg-[#134E35] hover:bg-[#0A2419] rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Pune Store</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
