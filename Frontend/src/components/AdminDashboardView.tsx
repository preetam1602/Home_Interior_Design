import { useState, useEffect } from 'react';
import { findProduct } from '../data';
import { 
  Users, 
  Clock, 
  CalendarCheck, 
  Palette, 
  CheckCircle2, 
  Search, 
  Phone, 
  Mail, 
  Home, 
  Sparkles, 
  Trash2, 
  Heart
} from 'lucide-react';

export interface ConsultationRequestData {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  propertyType: string;
  roomType: string;
  budgetRange: string;
  preferredStyle: string;
  projectDescription: string;
  preferredConsultation: string;
  status: 'Pending' | 'Contacted' | 'Meeting Scheduled' | 'Designing' | 'Completed';
  selectedDesigns: number[];
  createdAt: string;
}

interface AdminDashboardViewProps {
  onNavigate: (view: 'home' | 'material' | 'furniture' | 'selected-designs' | 'admin') => void;
  adminToken: string | null;
  onLogout: () => void;
}

export function AdminDashboardView({ onNavigate, adminToken, onLogout }: AdminDashboardViewProps) {
  const [consultations, setConsultations] = useState<ConsultationRequestData[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<ConsultationRequestData | null>(null);

  // Load consultations from localStorage and API fallback
  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = () => {
    fetch('http://localhost:8000/consult/', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    })
      .then(res => {
        if (res.status === 401) {
          onLogout();
          return [];
        }
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) return;
        const mappedData: ConsultationRequestData[] = data.map((item: any) => ({
          id: String(item.id),
          fullName: item.customer_name,
          phone: item.customer_contact,
          email: item.email || '',
          propertyType: item.property_type || '',
          roomType: item.room_type || '',
          budgetRange: item.budget_range || '',
          preferredStyle: item.preferred_style || '',
          projectDescription: item.project_description || '',
          preferredConsultation: item.preferred_consultation || '',
          status: item.status,
          selectedDesigns: item.items?.map((i: any) => i.product_id) || [],
          createdAt: item.created_at
        }));
        setConsultations(mappedData);
      })
      .catch(err => {
        console.error('Failed to load consultations from backend:', err);
      });
  };

  const handleStatusChange = (id: string, newStatus: ConsultationRequestData['status']) => {
    fetch(`http://localhost:8000/consult/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: newStatus })
    }).then(res => {
      if (res.status === 401) { onLogout(); return; }
      if (newStatus === 'Completed') {
        // Show completed status briefly, then auto-delete
        const updated = consultations.map(item =>
          item.id === id ? { ...item, status: newStatus } : item
        );
        setConsultations(updated);
        setTimeout(() => {
          fetch(`http://localhost:8000/consult/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` },
          }).then(() => {
            setConsultations(prev => prev.filter(item => item.id !== id));
            if (selectedRecord?.id === id) setSelectedRecord(null);
          });
        }, 1500);
      } else {
        const updated = consultations.map(item => 
          item.id === id ? { ...item, status: newStatus } : item
        );
        setConsultations(updated);
      }
    }).catch(err => {
      console.error('Failed to update status', err);
    });
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Are you sure you want to remove this consultation request?')) {
      fetch(`http://localhost:8000/consult/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      }).then(res => {
        if (res.status === 401) { onLogout(); return; }
        const updated = consultations.filter(item => item.id !== id);
        setConsultations(updated);
        if (selectedRecord?.id === id) {
          setSelectedRecord(null);
        }
      }).catch(err => {
        console.error('Failed to delete', err);
      });
    }
  };

  // Filtered list
  const filteredConsultations = consultations.filter(item => {
    const matchesTab = activeTab === 'All' || item.status === activeTab;
    const matchesSearch = 
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // KPI counters
  const totalCount = consultations.length;
  const pendingCount = consultations.filter(c => c.status === 'Pending').length;
  const meetingCount = consultations.filter(c => c.status === 'Meeting Scheduled').length;
  const designingCount = consultations.filter(c => c.status === 'Designing').length;
  const completedCount = consultations.filter(c => c.status === 'Completed').length;

  const getStatusBadgeClass = (status: ConsultationRequestData['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Contacted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Meeting Scheduled':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Designing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="w-full min-h-screen bg-[var(--theme-bg)] pb-24">
      {/* Top Header Banner */}
      <div className="bg-slate-900 text-white py-12 px-6 shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[var(--theme-accent)] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                Designer Portal
              </span>
              <span className="text-slate-400 text-xs font-mono">v2.4 Production</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide">
              Consultation Operations Hub
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-light">
              Manage client inquiries, review attached design concepts, and track project execution stages.
            </p>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-all flex items-center gap-2"
          >
            <Home className="w-4 h-4 text-[var(--theme-contrast)]" /> Return to Website
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {/* KPI Analytics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-md border border-[var(--theme-border)] p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Total Requests</span>
              <Users className="w-4 h-4 text-slate-500" />
            </div>
            <span className="text-3xl font-serif font-bold text-[var(--theme-text)]">{totalCount}</span>
          </div>

          <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase font-bold text-amber-700 tracking-wider">Pending</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-3xl font-serif font-bold text-amber-900">{pendingCount}</span>
          </div>

          <div className="bg-indigo-50/80 border border-indigo-200 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase font-bold text-indigo-700 tracking-wider">Meetings</span>
              <CalendarCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-3xl font-serif font-bold text-indigo-900">{meetingCount}</span>
          </div>

          <div className="bg-purple-50/80 border border-purple-200 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase font-bold text-purple-700 tracking-wider">Designing</span>
              <Palette className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-3xl font-serif font-bold text-purple-900">{designingCount}</span>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-3xl font-serif font-bold text-emerald-900">{completedCount}</span>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-[var(--theme-border)] shadow-sm">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
            {['All', 'Pending', 'Contacted', 'Meeting Scheduled', 'Designing', 'Completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by client name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-800 bg-white"
            />
          </div>
        </div>

        {/* Requests List Grid */}
        <div className="space-y-6">
          {filteredConsultations.length === 0 ? (
            <div className="bg-white/80 p-12 rounded-3xl text-center border border-[var(--theme-border)] shadow-sm">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-serif font-bold text-slate-700 mb-1">No Consultations Found</h3>
              <p className="text-slate-400 text-xs font-light">There are no client inquiries matching the selected filters.</p>
            </div>
          ) : (
            filteredConsultations.map(record => (
              <div 
                key={record.id}
                className="bg-white/90 backdrop-blur-md rounded-3xl border border-[var(--theme-border)] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono font-bold text-slate-400">ID: {record.id}</span>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full border ${getStatusBadgeClass(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-slate-800">
                      {record.fullName}
                    </h2>
                    <span className="text-xs text-slate-400">
                      Submitted on {new Date(record.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Status Dropdown Controller */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">Update Stage:</span>
                    <select
                      value={record.status}
                      onChange={(e) => handleStatusChange(record.id, e.target.value as ConsultationRequestData['status'])}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm transition-all"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Meeting Scheduled">Meeting Scheduled</option>
                      <option value="Designing">Designing</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      onClick={() => handleDeleteRecord(record.id)}
                      className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Client & Project Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-b border-slate-100">
                  {/* Contact Info */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-2">Contact Details</span>
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <a href={`tel:${record.phone}`} className="flex items-center gap-2 hover:text-blue-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> +91 {record.phone}
                      </a>
                      <a href={`mailto:${record.email}`} className="flex items-center gap-2 hover:text-blue-600 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {record.email}
                      </a>
                    </div>
                  </div>

                  {/* Scope */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-2">Property Scope</span>
                    <div className="space-y-1 text-xs">
                      <span className="inline-block bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium mr-1">
                        {record.propertyType}
                      </span>
                      <span className="inline-block bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium">
                        {record.roomType}
                      </span>
                    </div>
                  </div>

                  {/* Budget & Style */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-2">Budget & Aesthetics</span>
                    <div className="space-y-1 text-xs">
                      <span className="block font-bold text-[var(--theme-accent)]">
                        {record.budgetRange}
                      </span>
                      <span className="text-slate-600 block">
                        Style: <strong className="text-slate-800">{record.preferredStyle}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Consultation Mode */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-2">Consultation Mode</span>
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-semibold">
                      <Sparkles className="w-3 h-3" /> {record.preferredConsultation}
                    </span>
                  </div>
                </div>

                {/* Project Description */}
                {record.projectDescription && (
                  <div className="py-4 border-b border-slate-100">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Project Brief</span>
                    <p className="text-xs text-slate-600 leading-relaxed font-light italic">
                      "{record.projectDescription}"
                    </p>
                  </div>
                )}

                {/* Attached Selected Designs */}
                <div className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <h4 className="font-serif font-bold text-slate-800 text-sm">
                      Attached Selected Designs ({record.selectedDesigns.length})
                    </h4>
                  </div>

                  {record.selectedDesigns.length === 0 ? (
                    <p className="text-slate-400 text-xs italic">No specific designs saved by customer prior to booking.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {record.selectedDesigns.map(designId => {
                        const product = findProduct(designId);
                        if (!product) return null;
                        const displayRoom = product.room
                          ? product.room.charAt(0).toUpperCase() + product.room.slice(1) + ' Room'
                          : product.category.charAt(0).toUpperCase() + product.category.slice(1);

                        return (
                          <div 
                            key={designId}
                            className="group border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 hover:bg-white transition-all shadow-2xs"
                          >
                            <div className="aspect-square relative overflow-hidden bg-slate-100">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="p-2.5">
                              <h5 className="text-xs font-semibold text-slate-800 truncate mb-0.5">{product.name}</h5>
                              <span className="text-[9px] uppercase tracking-wider text-[var(--theme-accent)] font-semibold block">
                                {displayRoom}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
