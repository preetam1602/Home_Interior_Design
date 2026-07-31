import { useState, useEffect } from 'react';
import { HomeView } from './components/HomeView';
import { MaterialView } from './components/MaterialView';
import { FurnitureView } from './components/FurnitureView';
import { SelectedDesignsView } from './components/SelectedDesignsView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { LoginView } from './components/LoginView';
import { Heart, ChevronRight, Menu, X, ArrowUp, ShieldCheck, LogOut } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'material' | 'furniture' | 'selected-designs' | 'admin' | 'login'>('home');
  const [savedDesigns, setSavedDesigns] = useState<number[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));

  // Load saved designs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedDesigns');
    if (saved) {
      try {
        setSavedDesigns(JSON.parse(saved));
      } catch (e) {
        setSavedDesigns([]);
      }
    }
  }, []);

  // Sync scroll indicator
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Save designs helper
  const saveDesigns = (newDesigns: number[]) => {
    setSavedDesigns(newDesigns);
    localStorage.setItem('savedDesigns', JSON.stringify(newDesigns));
  };

  const toggleSaveDesign = (id: number) => {
    if (savedDesigns.includes(id)) {
      saveDesigns(savedDesigns.filter(dId => dId !== id));
    } else {
      saveDesigns([...savedDesigns, id]);
    }
  };

  const removeDesign = (id: number) => {
    saveDesigns(savedDesigns.filter(dId => dId !== id));
  };

  const clearAllDesigns = () => {
    saveDesigns([]);
  };

  const switchView = (view: 'home' | 'material' | 'furniture' | 'selected-designs' | 'admin' | 'login') => {
    if (view === 'admin' && !adminToken) {
      setCurrentView('login');
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('adminToken', token);
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
    setCurrentView('home');
  };

  const goHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'auto' });
    setMobileMenuOpen(false);
  };

  // Nav Helper
  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    
    if (currentView !== 'home') {
      setCurrentView('home');
      // Wait for re-render then scroll
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const designsCount = savedDesigns.length;

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] font-sans antialiased text-[var(--theme-text)] flex flex-col justify-between selection:bg-[var(--theme-accent-soft)]/30 selection:text-[var(--theme-text)]">
      {/* Global Header / Navigation Bar */}
      <header className="fixed top-0 left-0 w-full h-20 bg-[var(--theme-surface)] backdrop-blur-xl border-b border-[var(--theme-border)] flex items-center justify-between px-6 md:px-12 z-50 shadow-sm shadow-[rgba(58,50,41,0.04)]">
        {/* Logo */}
        <div 
          onClick={goHome}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="text-xl md:text-2xl font-serif font-bold tracking-tight text-[var(--theme-text)] group-hover:text-[var(--theme-accent)] transition-colors">
            Interior Design
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)] group-hover:scale-125 transition-transform"></span>
        </div>

        {/* Desktop Navbar */}
        <nav className="hidden lg:flex items-center gap-8">
          <button onClick={goHome} className="text-sm font-semibold tracking-wide hover:text-[var(--theme-accent)] transition-colors">Home</button>
          <button onClick={() => handleNavClick('about')} className="text-sm font-semibold tracking-wide hover:text-[var(--theme-accent)] transition-colors">About</button>
          <button onClick={() => handleNavClick('design')} className="text-sm font-semibold tracking-wide hover:text-[var(--theme-accent)] transition-colors">Design</button>
          <button onClick={() => handleNavClick('portfolio')} className="text-sm font-semibold tracking-wide hover:text-[var(--theme-accent)] transition-colors">Portfolio</button>
          <button onClick={() => handleNavClick('contact')} className="text-sm font-semibold tracking-wide hover:text-[var(--theme-accent)] transition-colors">Contact</button>
        </nav>

        {/* Catalog Subpage Toggles & Cart */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => switchView('material')}
            className={`hidden md:inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
              currentView === 'material'
                ? 'bg-[var(--theme-text)] text-white border-[var(--theme-text)]'
                : 'bg-transparent text-[var(--theme-text)] border-[var(--theme-border)] hover:border-[var(--theme-accent)]'
            }`}
          >
            Colors & Materials
          </button>
          <button
            onClick={() => switchView('furniture')}
            className={`hidden md:inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
              currentView === 'furniture'
                ? 'bg-[var(--theme-text)] text-white border-[var(--theme-text)]'
                : 'bg-transparent text-[var(--theme-text)] border-[var(--theme-border)] hover:border-[var(--theme-accent)]'
            }`}
          >
            Furniture & Decor
          </button>

          {/* Admin Dashboard Trigger */}
          {adminToken ? (
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          ) : (
            <button
              onClick={() => switchView('admin')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                currentView === 'admin' || currentView === 'login'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-900 hover:text-white'
              }`}
              title="Designer Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Portal
            </button>
          )}

          {/* Selected Designs Icon Toggle */}
          <button
            onClick={() => switchView('selected-designs')}
            className={`relative p-2.5 transition-all rounded-xl cursor-pointer group active:scale-95 border ${
              currentView === 'selected-designs'
                ? 'bg-[var(--theme-accent)] text-white border-[var(--theme-accent)]'
                : 'bg-[var(--theme-accent-soft)]/18 text-[var(--theme-accent)] border-transparent hover:bg-[var(--theme-accent-soft)]/32'
            }`}
            title="View Selected Designs"
          >
            <Heart className={`w-5 h-5 group-hover:scale-105 transition-transform ${currentView === 'selected-designs' ? 'fill-white' : 'fill-none'}`} />
            {designsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-600 border border-white text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {designsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[var(--theme-muted)] hover:text-[var(--theme-text)] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[var(--theme-text)]/38 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute top-20 left-0 w-full bg-[var(--theme-bg)] border-b border-[var(--theme-border)] shadow-xl flex flex-col p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={goHome} className="text-left font-semibold text-[var(--theme-text)] py-2 border-b border-[var(--theme-border)]">Home</button>
            <button onClick={() => handleNavClick('about')} className="text-left font-semibold text-[var(--theme-text)] py-2 border-b border-[var(--theme-border)]">About Us</button>
            <button onClick={() => handleNavClick('design')} className="text-left font-semibold text-[var(--theme-text)] py-2 border-b border-[var(--theme-border)]">Our Services</button>
            <button onClick={() => handleNavClick('portfolio')} className="text-left font-semibold text-[var(--theme-text)] py-2 border-b border-[var(--theme-border)]">Portfolio</button>
            <button onClick={() => handleNavClick('contact')} className="text-left font-semibold text-[var(--theme-text)] py-2 border-b border-[var(--theme-border)]">Contact</button>
            <button onClick={() => { switchView('admin'); setMobileMenuOpen(false); }} className="text-left font-bold text-blue-700 py-2 border-b border-[var(--theme-border)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Admin Operations Portal
            </button>
            {adminToken && (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left font-bold text-red-600 py-2 border-b border-[var(--theme-border)] flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            )}
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={() => { switchView('material'); setMobileMenuOpen(false); }}
                className="w-full text-center py-3 border border-[var(--theme-border)] rounded-xl text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] hover:bg-white/40"
              >
                Colors & Materials
              </button>
              <button
                onClick={() => { switchView('furniture'); setMobileMenuOpen(false); }}
                className="w-full text-center py-3 border border-[var(--theme-border)] rounded-xl text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] hover:bg-white/40"
              >
                Furniture & Decor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Render */}
      <main className="pt-20 flex-grow">
        {currentView === 'home' && (
          <HomeView
            selectedDesigns={savedDesigns}
            onNavigate={switchView}
            onClearDesigns={clearAllDesigns}
          />
        )}
        {currentView === 'material' && (
          <MaterialView
            selectedDesigns={savedDesigns}
            onToggleSave={toggleSaveDesign}
          />
        )}
        {currentView === 'furniture' && (
          <FurnitureView
            selectedDesigns={savedDesigns}
            onToggleSave={toggleSaveDesign}
          />
        )}
        {currentView === 'selected-designs' && (
          <SelectedDesignsView
            selectedDesigns={savedDesigns}
            onRemove={removeDesign}
            onClearAll={clearAllDesigns}
            onProceedToConsultation={() => {
              setCurrentView('home');
              // Wait for re-render then scroll to contact section
              setTimeout(() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
        )}
        {currentView === 'login' && (
          <LoginView onLoginSuccess={handleLoginSuccess} />
        )}
        {currentView === 'admin' && (
          <AdminDashboardView onNavigate={switchView} adminToken={adminToken} onLogout={handleLogout} />
        )}
      </main>

      {/* Global Footer */}
      <footer className="bg-[var(--theme-text)] text-[var(--theme-bg)] border-t border-[var(--theme-border)] pt-16 pb-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="text-2xl font-serif font-bold text-[var(--theme-contrast)] tracking-tight">Interior Design Studio</h3>
            <p className="text-white/70 font-light text-sm max-w-sm leading-relaxed">
              We specialize in creating structurally functional, visually beautiful, and timeless environments that truly feel like home.
            </p>
            <div className="flex gap-4 pt-2">
              <span className="text-[var(--theme-accent-soft)] text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded">Bangalore</span>
              <span className="text-[var(--theme-accent-soft)] text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded">Est. 2024</span>
            </div>
          </div>

          {/* Quick Menu */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif font-semibold text-[var(--theme-contrast)] uppercase tracking-wider text-xs">Our Curated Services</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <button onClick={() => setCurrentView('material')} className="hover:text-[var(--theme-accent-soft)] hover:underline text-left transition-all flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[var(--theme-accent-soft)]" /> Paint Swatch & Material Curation
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('furniture')} className="hover:text-[var(--theme-accent-soft)] hover:underline text-left transition-all flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-[var(--theme-accent-soft)]" /> Luxury Furniture & Decor Styling
                </button>
              </li>
            </ul>
          </div>

          {/* Bookings / Contact */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-serif font-semibold text-[var(--theme-contrast)] uppercase tracking-wider text-xs">Book Your Consultation</h4>
            <p className="text-white/70 font-light text-sm">
              Ready to transform your home into a premium, harmonious living environment?
            </p>
            <div className="pt-2 text-sm space-y-1">
              <p className="text-white/70"><strong>Email:</strong> designstudio@gmail.com</p>
              <p className="text-white/70"><strong>Phone:</strong> +91 98765 43210</p>
            </div>
            <button
              onClick={() => handleNavClick('contact')}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--theme-accent-soft)] hover:text-[var(--theme-contrast)] underline underline-offset-4"
            >
              Book Now &rarr;
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-white/45 gap-4">
          <p>&copy; {new Date().getFullYear()} Interior Design Studio. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Floating Scroll Top button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 bg-[var(--theme-text)] hover:bg-[var(--theme-accent)] text-white rounded-xl shadow-lg border border-[var(--theme-border)] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all z-40 cursor-pointer"
          title="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
