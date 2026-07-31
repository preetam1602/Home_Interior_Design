import { useState } from 'react';
import { findProduct } from '../data';
import { Calendar, Mail, Phone, MapPin, Star, Send, HeartHandshake, Heart, Armchair, Sparkles } from 'lucide-react';
import { HeroBadge } from './HeroBadge';
import { BottomLeftCard } from './BottomLeftCard';
import { BottomRightCorner } from './BottomRightCorner';

interface HomeViewProps {
  selectedDesigns: number[];
  onNavigate: (view: 'home' | 'material' | 'furniture' | 'selected-designs') => void;
  onClearDesigns: () => void;
}

export function HomeView({ selectedDesigns, onNavigate, onClearDesigns }: HomeViewProps) {
  // Consultation Form State
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [roomType, setRoomType] = useState('Full Home');
  const [budgetRange, setBudgetRange] = useState('₹5L - ₹10L');
  const [preferredStyle, setPreferredStyle] = useState('Modern');
  const [preferredConsultation, setPreferredConsultation] = useState('Site Visit');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingMsg, setBookingMsg] = useState({ text: '', type: '' });

  // Feedback Form State
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackPhone, setFeedbackPhone] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState({ text: '', type: '' });

  // Handle Booking
  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingMsg({ text: '', type: '' });

    if (!bookingName.trim() || !bookingPhone.trim() || !bookingEmail.trim()) {
      setBookingMsg({ text: 'Please fill out your Name, Phone Number, and Email.', type: 'error' });
      return;
    }

    if (!bookingEmail.includes('@') || !bookingEmail.includes('.')) {
      setBookingMsg({ text: 'Enter a valid email address.', type: 'error' });
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(bookingPhone)) {
      setBookingMsg({ text: 'Enter a valid 10-digit phone number starting with 6-9.', type: 'error' });
      return;
    }

    const newRecord = {
      id: `CONS-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: bookingName.trim(),
      phone: bookingPhone.trim(),
      email: bookingEmail.trim(),
      propertyType,
      roomType,
      budgetRange,
      preferredStyle,
      projectDescription: bookingMessage.trim(),
      preferredConsultation,
      status: 'Pending' as const,
      selectedDesigns: [...selectedDesigns],
      createdAt: new Date().toISOString()
    };

    // Save locally for instant designer dashboard view
    const existingStr = localStorage.getItem('interior_consultations');
    const existingArr = existingStr ? JSON.parse(existingStr) : [];
    existingArr.unshift(newRecord);
    localStorage.setItem('interior_consultations', JSON.stringify(existingArr));

    // Try background POST to backend
    fetch('http://localhost:8000/consult/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: bookingName.trim(),
        customer_contact: bookingPhone.trim(),
        email: bookingEmail.trim(),
        property_type: propertyType,
        room_type: roomType,
        budget_range: budgetRange,
        preferred_style: preferredStyle,
        project_description: bookingMessage.trim(),
        preferred_consultation: preferredConsultation,
        items: selectedDesigns.map(id => ({ product_id: id, quantity: 1 }))
      })
    }).catch(() => {
      // Backend optional fallback
    });

    setBookingMsg({ text: 'Consultation request submitted! A senior interior designer has been assigned to review your choices.', type: 'success' });
    alert(`Consultation Request Submitted Successfully! \n\nRequest Reference: ${newRecord.id}\nAttached Designs: ${selectedDesigns.length} items\nOur design consultant will contact you via ${bookingPhone.trim()} shortly.`);

    // Clear forms and designs
    setBookingName('');
    setBookingPhone('');
    setBookingEmail('');
    setBookingMessage('');
    onClearDesigns();
  };

  // Handle Feedback
  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg({ text: '', type: '' });

    if (!feedbackName.trim()) {
      setFeedbackMsg({ text: 'Please enter your name.', type: 'error' });
      return;
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(feedbackName)) {
      setFeedbackMsg({ text: 'Name should contain only letters and spaces.', type: 'error' });
      return;
    }

    if (!feedbackPhone.trim()) {
      setFeedbackMsg({ text: 'Please enter your phone number.', type: 'error' });
      return;
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(feedbackPhone)) {
      setFeedbackMsg({ text: 'Enter a valid 10-digit phone number starting with 6-9.', type: 'error' });
      return;
    }

    if (!feedbackEmail.trim()) {
      setFeedbackMsg({ text: 'Please enter your email.', type: 'error' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(feedbackEmail)) {
      setFeedbackMsg({ text: 'Enter a valid email address.', type: 'error' });
      return;
    }

    if (!feedbackMessage.trim()) {
      setFeedbackMsg({ text: 'Please enter your feedback message.', type: 'error' });
      return;
    }

    fetch('http://localhost:8000/feed/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: feedbackName.trim(),
        phone: feedbackPhone.trim(),
        email: feedbackEmail.trim(),
        message: feedbackMessage.trim(),
      })
    }).catch(() => {});

    setFeedbackMsg({ text: 'Thank You!! For your valuable feedback.', type: 'success' });
    alert('Thank You!! For your valuable feedback.');

    // Reset feedback form
    setFeedbackName('');
    setFeedbackPhone('');
    setFeedbackEmail('');
    setFeedbackMessage('');
  };

  // Scroll Helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[var(--theme-bg)]">
      {/* 1. Hero Section - Combined RIVR Video Background */}
      <section
        id="home"
        className="relative w-full h-[calc(100vh-5rem)] flex items-center justify-center p-3 md:p-5 bg-[var(--theme-bg)] overflow-hidden"
      >
        <div className="relative w-full h-full rounded-[1.5rem] md:rounded-[3rem] overflow-hidden flex flex-col items-center justify-center group shadow-2xl">
          {/* The Video Background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-[65%] lg:object-center z-0"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4"
              type="video/mp4"
            />
          </video>

          {/* Overlays */}
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px] z-10" />

          {/* The Content Layer */}
          <div className="relative z-20 text-center max-w-4xl px-6 flex flex-col items-center">
            <HeroBadge />

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[75px] font-serif font-bold text-white mb-4 tracking-tight leading-[1.05] drop-shadow-[0_2px_10px_rgba(37,99,235,0.4)]">
              Fluid Interior Styling
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/90 opacity-90 leading-relaxed max-w-xl font-light mb-8">
              Access smart paint swatches, curating custom structural furniture, and transforming everyday holdings into beautiful architectural living spaces instantly.
            </p>

            <button
              onClick={() => scrollToSection('design')}
              className="px-8 py-3.5 bg-white/12 hover:bg-white text-white hover:text-[var(--theme-text)] border border-white/20 hover:border-white rounded-xl font-semibold shadow-xl transition-all duration-300 transform active:scale-95 text-base backdrop-blur-md"
            >
              Get Started
            </button>
          </div>

          {/* Bottom Left Card */}
          <BottomLeftCard />

          {/* Bottom Right Corner */}
          <BottomRightCorner />
        </div>
      </section>

      {/* 2. About us Section */}
      <section id="about" className="scroll-mt-20 py-24 px-6 max-w-5xl mx-auto text-center border-b border-[var(--theme-border)]">
        <span className="text-xs uppercase tracking-widest font-bold text-[var(--theme-accent)] block mb-2">Our Philosophy</span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[var(--theme-text)] font-bold mb-4">About Us</h2>
        <div className="w-16 h-1 bg-[var(--theme-accent-soft)] mx-auto rounded-full mb-8"></div>
        <p className="text-lg md:text-xl text-[var(--theme-muted)] leading-relaxed font-serif max-w-4xl mx-auto italic mb-6">
          “Design is not just what it looks like and feels like. Design is how it works.”
        </p>
        <p className="text-base sm:text-lg text-[var(--theme-muted)] leading-loose text-justify max-w-3xl mx-auto font-sans font-light">
          We are a passionate team of interior designers dedicated to transforming everyday spaces into elegant, functional, and deeply comfortable environments. Our approach seamlessly blends artistic creativity with practical utility, ensuring every custom design represents your personal lifestyle while enhancing how you live. From the initial conceptual drawing to full completion, we prioritize meticulous detail, premium material curation, and timeless styling to cultivate spaces that truly feel like home.
        </p>
      </section>

      {/* 3. How We Design Spaces (Design) */}
      <section id="design" className="scroll-mt-20 py-24 bg-white/35 border-b border-[var(--theme-border)]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-xs uppercase tracking-widest font-bold text-[var(--theme-accent)] block mb-2">Curated Services</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[var(--theme-text)] font-bold mb-4">How We Design Spaces</h2>
          <div className="w-16 h-1 bg-[var(--theme-accent-soft)] mx-auto rounded-full mb-8"></div>
          <p className="text-base sm:text-lg text-[var(--theme-muted)] max-w-2xl mx-auto mb-16 font-light">
            We focus on creating architectural spaces that are structurally functional, visually stunning, and uniquely representative of your taste.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Design Card 1 */}
            <div
              onClick={() => onNavigate('material')}
              className="group relative h-[380px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl cursor-pointer transform hover:-translate-y-2 transition-all duration-500"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80')`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-900/35 to-blue-500/10" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-left z-10">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3 group-hover:text-[var(--theme-contrast)] transition-colors">
                  Color & Material Selection
                </h3>
                <p className="text-white/90 text-sm sm:text-base font-light leading-relaxed">
                  “Choosing the right tones, organic textures, and premium finishes to enhance your visual environment.”
                </p>
                <span className="text-xs font-semibold text-[var(--theme-contrast)] uppercase tracking-wider mt-4 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                  Explore Palette Collection &rarr;
                </span>
              </div>
            </div>

            {/* Design Card 2 */}
            <div
              onClick={() => onNavigate('furniture')}
              className="group relative h-[380px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl cursor-pointer transform hover:-translate-y-2 transition-all duration-500"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80')`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-900/35 to-blue-500/10" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-left z-10">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3 group-hover:text-[var(--theme-contrast)] transition-colors">
                  Furniture & Décor Styling
                </h3>
                <p className="text-white/90 text-sm sm:text-base font-light leading-relaxed">
                  “Curating tailored bespoke furniture, custom artwork, and decor accents that enrich your spatial theme.”
                </p>
                <span className="text-xs font-semibold text-[var(--theme-contrast)] uppercase tracking-wider mt-4 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                  Explore Furniture Catalog &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Portfolio Section */}
      <section id="portfolio" className="scroll-mt-20 py-24 max-w-7xl mx-auto px-6 border-b border-[var(--theme-border)]">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-[var(--theme-accent)] block mb-2">Our Masterpieces</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[var(--theme-text)] font-bold mb-4">Our Featured Projects</h2>
          <div className="w-16 h-1 bg-[var(--theme-accent-soft)] mx-auto rounded-full mb-6"></div>
          <p className="text-base sm:text-lg text-[var(--theme-muted)] max-w-2xl mx-auto font-light italic">
            “A glimpse into the stunning spaces we’ve transformed with thoughtful design and premium detailing.”
          </p>
        </div>

        <div className="space-y-16 max-w-5xl mx-auto">
          {/* Project 1 */}
          <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full md:w-1/2 aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-[var(--theme-border)]">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
                alt="Living Room Transformation"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-750"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center bg-white/55 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-[var(--theme-border)]">
              <div className="flex text-blue-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-slate-700 font-serif text-lg leading-relaxed mb-6 italic">
                “Absolutely love the transformation! The space feels brighter, more open, and perfectly balanced. The blend of clean lines and warm tones is just stunning.”
              </p>
              <h4 className="text-slate-900 font-semibold font-sans tracking-wide text-base">— Ananya R. <span className="text-slate-400 font-normal text-xs ml-2">Verified Owner</span></h4>
            </div>
          </div>

          {/* Project 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 lg:gap-12">
            <div className="w-full md:w-1/2 aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-[var(--theme-border)]">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
                alt="Contemporary Room Design"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-750"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center bg-white/55 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-[var(--theme-border)]">
              <div className="flex text-blue-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-slate-700 font-serif text-lg leading-relaxed mb-6 italic">
                “The design completely transformed my space—minimal, bright, and so functional. The natural light and clean layout make the entire room feel twice as large.”
              </p>
              <h4 className="text-slate-900 font-semibold font-sans tracking-wide text-base">— Aarav M. <span className="text-slate-400 font-normal text-xs ml-2">Verified Owner</span></h4>
            </div>
          </div>

          {/* Project 3 */}
          <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full md:w-1/2 aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-[var(--theme-border)]">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80"
                alt="Modern Kitchen Surface"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-750"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center bg-white/55 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-[var(--theme-border)]">
              <div className="flex text-blue-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-slate-700 font-serif text-lg leading-relaxed mb-6 italic">
                “The kitchen design is both elegant and highly functional. The island is perfect for cooking and socializing, and the lighting fixtures add a refined touch. I couldn't be happier!”
              </p>
              <h4 className="text-slate-900 font-semibold font-sans tracking-wide text-base">— Nisha K. <span className="text-slate-400 font-normal text-xs ml-2">Verified Owner</span></h4>
            </div>
          </div>

          {/* Project 4 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 lg:gap-12">
            <div className="w-full md:w-1/2 aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-[var(--theme-border)]">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80"
                alt="Cozy Earthy Bedroom"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-750"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center bg-white/55 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-[var(--theme-border)]">
              <div className="flex text-blue-500 mb-4">
                {[...Array(4)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                <Star className="w-5 h-5 text-slate-300" />
              </div>
              <p className="text-slate-700 font-serif text-lg leading-relaxed mb-6 italic">
                “The warm earthy tones make this room feel so cozy! The stone feature wall completely enhances the entire ambiance.”
              </p>
              <h4 className="text-slate-900 font-semibold font-sans tracking-wide text-base">— Sahana D. <span className="text-slate-400 font-normal text-xs ml-2">Verified Owner</span></h4>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact & Consultation Booking Form */}
      <section id="contact" className="scroll-mt-20 py-24 bg-white/35">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-[var(--theme-accent)] block mb-2">Get In Touch</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[var(--theme-text)] font-bold mb-4">Contact & Booking</h2>
            <div className="w-16 h-1 bg-[var(--theme-accent-soft)] mx-auto rounded-full mb-6"></div>
            <p className="text-base sm:text-lg text-[var(--theme-muted)] max-w-2xl mx-auto font-light">
              “Have a design idea or structural project in mind? Reach out — I’d love to help you shape your dream space.”
            </p>
          </div>

          <div className="max-w-6xl mx-auto mb-12 rounded-[2rem] border border-[var(--theme-border)] bg-[var(--theme-surface)]/90 backdrop-blur-md shadow-sm p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-[var(--theme-accent)] block mb-2">Consultation Journey</span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--theme-text)]">A clearer path from inspiration to site visit</h3>
              </div>
              <p className="text-sm sm:text-base text-[var(--theme-muted)] max-w-2xl md:text-right">
                Keep the full journey in view while you book, so clients understand exactly what happens next.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
              {[
                { step: '01', title: 'Browse Designs', description: 'Explore curated swatches, finishes, and room ideas.', icon: Sparkles },
                { step: '02', title: 'Save Favorites', description: 'Build a moodboard with the designs you love most.', icon: Heart },
                { step: '03', title: 'Share Details', description: 'Submit contact details and project requirements.', icon: Mail },
                { step: '04', title: 'Meet Designer', description: 'Discuss your goals with our consulting team.', icon: Calendar },
                { step: '05', title: 'Receive Plan', description: 'Get a layout, material guidance, and styling direction.', icon: Armchair },
              ].map(({ step, title, description, icon: Icon }) => (
                <div key={step} className="group rounded-3xl border border-[var(--theme-border)] bg-white/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[var(--theme-accent)]/35">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <span className="font-serif text-3xl font-extrabold text-[var(--theme-accent-soft)]/60 group-hover:text-[var(--theme-accent)]/60 transition-colors">{step}</span>
                    <div className="p-3 rounded-2xl bg-[var(--theme-accent-soft)]/12 text-[var(--theme-accent)] border border-[var(--theme-border)]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[var(--theme-text)] mb-2">{title}</h4>
                  <p className="text-sm text-[var(--theme-muted)] leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-stretch">
            {/* Contact Details & Cart Summary Card */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-white/70 border border-[var(--theme-border)] p-8 rounded-3xl shadow-md">
              <div>
                <h3 className="text-2xl font-serif text-[var(--theme-text)] font-bold mb-6 pb-2 border-b border-[var(--theme-border)]">Contact Details</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[var(--theme-accent-soft)]/12 rounded-xl text-[var(--theme-accent)]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Email Us</span>
                      <a href="mailto:designstudio@gmail.com" className="text-slate-700 font-medium hover:text-[var(--theme-accent)]">designstudio@gmail.com</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[var(--theme-accent-soft)]/12 rounded-xl text-[var(--theme-accent)]">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Call Us</span>
                      <a href="tel:+919876543210" className="text-slate-700 font-medium hover:text-[var(--theme-accent)]">+91 98765 43210</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[var(--theme-accent-soft)]/12 rounded-xl text-[var(--theme-accent)]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Our Studio</span>
                      <span className="text-slate-700 font-medium">Bangalore, Karnataka, India</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* In-form Selected Designs Summary */}
              <div className="mt-8 pt-8 border-t border-[var(--theme-border)]">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-[var(--theme-accent)] fill-[var(--theme-accent)]" />
                  <h4 className="font-serif font-bold text-[var(--theme-text)] text-lg">Selected Designs</h4>
                </div>
                {selectedDesigns.length === 0 ? (
                  <p className="text-slate-400 text-sm italic font-light leading-relaxed">
                    No designs selected. Save designs from our catalog to attach them to your consultation request.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {selectedDesigns.map(id => {
                        const product = findProduct(id);
                        if (!product) return null;
                        const displayRoom = product.room
                          ? product.room.charAt(0).toUpperCase() + product.room.slice(1) + ' Room'
                          : product.category.charAt(0).toUpperCase() + product.category.slice(1);
                        return (
                          <div key={id} className="flex justify-between items-center text-sm text-slate-600">
                            <span>{product.name}</span>
                            <span className="text-[9px] uppercase tracking-wider font-semibold text-[var(--theme-accent)] bg-[var(--theme-accent-soft)]/10 px-2 py-0.5 rounded">
                              {displayRoom}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-between font-semibold text-[var(--theme-text)]">
                      <span>Total Selected Designs:</span>
                      <span className="text-[var(--theme-accent)] text-lg">{selectedDesigns.length} Items</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-7 bg-white/70 border border-[var(--theme-border)] p-8 rounded-3xl shadow-md">
              <h3 className="text-2xl font-serif text-[var(--theme-text)] font-bold mb-6 pb-2 border-b border-[var(--theme-border)] inline-flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--theme-accent)]" /> Book Architectural Consultation
              </h3>

              <form onSubmit={handleBooking} className="space-y-5" noValidate>
                {/* 1. Contact Basics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-800 text-sm transition-all placeholder:text-slate-300"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit phone number"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-800 text-sm transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Email Address *</label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={bookingEmail}
                    onChange={(e) => setBookingEmail(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-800 text-sm transition-all placeholder:text-slate-300"
                  />
                </div>

                {/* 2. Property & Scope Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Property Type</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-800 text-sm transition-all bg-white cursor-pointer"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Office">Office</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Room Scope</label>
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-800 text-sm transition-all bg-white cursor-pointer"
                    >
                      <option value="Full Home">Full Home</option>
                      <option value="Living Room">Living Room</option>
                      <option value="Bedroom">Bedroom</option>
                      <option value="Kitchen">Kitchen</option>
                      <option value="Office">Office</option>
                    </select>
                  </div>
                </div>

                {/* 3. Budget & Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Budget Range</label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-800 text-sm transition-all bg-white cursor-pointer"
                    >
                      <option value="Under ₹2L">Under ₹2 Lakhs</option>
                      <option value="₹2L - ₹5L">₹2 Lakhs - ₹5 Lakhs</option>
                      <option value="₹5L - ₹10L">₹5 Lakhs - ₹10 Lakhs</option>
                      <option value="₹10L - ₹20L">₹10 Lakhs - ₹20 Lakhs</option>
                      <option value="₹20L+">₹20+ Lakhs</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Preferred Style</label>
                    <select
                      value={preferredStyle}
                      onChange={(e) => setPreferredStyle(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-800 text-sm transition-all bg-white cursor-pointer"
                    >
                      <option value="Modern">Modern</option>
                      <option value="Minimalist">Minimalist</option>
                      <option value="Scandinavian">Scandinavian</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Contemporary">Contemporary</option>
                      <option value="Traditional">Traditional</option>
                    </select>
                  </div>
                </div>

                {/* 4. Preferred Consultation Mode */}
                <div className="flex flex-col">
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Preferred Consultation Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Site Visit', 'Showroom Visit', 'Online'].map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPreferredConsultation(mode)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          preferredConsultation === mode
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Project Description */}
                <div className="flex flex-col">
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Project Description</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your space layout, floorplan preferences, timeline, or special requirements..."
                    value={bookingMessage}
                    onChange={(e) => setBookingMessage(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-800 text-sm transition-all placeholder:text-slate-300 resize-none"
                  />
                </div>

                {bookingMsg.text && (
                  <div
                    className={`p-4 rounded-xl text-sm font-medium ${
                      bookingMsg.type === 'success'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {bookingMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-strong)] text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" /> Submit Design Consultation Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Feedback Section */}
      <section className="py-24 bg-white/35 border-t border-b border-[var(--theme-border)]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-[var(--theme-accent)] block mb-2">We Value You</span>
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--theme-text)] font-bold mb-4">Customer Feedback</h2>
            <div className="w-16 h-1 bg-[var(--theme-accent-soft)] mx-auto rounded-full mb-6"></div>
            <p className="text-slate-500 text-sm sm:text-base font-light">
              “Please share your thoughts or experiences with our services. We continually strive to refine our craftsmanship.”
            </p>
          </div>

          <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] p-8 sm:p-10 rounded-3xl shadow-sm">
            <form onSubmit={handleFeedback} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 text-slate-800 transition-all placeholder:text-slate-300"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={feedbackPhone}
                    onChange={(e) => setFeedbackPhone(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 text-slate-800 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 text-slate-800 transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Message</label>
                <textarea
                  rows={4}
                  placeholder="Enter your feedback or comments..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 text-slate-800 transition-all placeholder:text-slate-300 resize-none"
                />
              </div>

              {feedbackMsg.text && (
                <div
                  className={`p-4 rounded-xl text-sm font-medium ${
                    feedbackMsg.type === 'success'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}
                >
                  {feedbackMsg.text}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[var(--theme-text)] hover:bg-[var(--theme-accent-strong)] text-white font-semibold rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" /> Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
