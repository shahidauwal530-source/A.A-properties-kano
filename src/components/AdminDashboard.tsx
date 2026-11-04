import React, { useState, useEffect } from 'react';
import { api } from '../api/client.ts';
import { Property, Inspection, DashboardStats, PropertyType, DealType, DocumentType } from '../types.ts';
import { KANO_AREAS } from '../translations.ts';
import {
  ShieldCheck,
  Building,
  Eye,
  MessageCircle,
  Users,
  Calendar,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
  X,
  Phone,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'inspections' | 'add'>('overview');
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackErr, setFeedbackErr] = useState('');

  // Add / Edit Property Form state
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PropertyType>('Gida');
  const [area, setArea] = useState('Sabon Gari');
  const [price, setPrice] = useState('');
  const [dealType, setDealType] = useState<DealType>('Haya - Per Year');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [size, setSize] = useState('50x80 ft');
  const [document, setDocument] = useState<DocumentType>('Tenancy Agreement');
  const [water, setWater] = useState('Borehole');
  const [power, setPower] = useState('NEPA / Solar');
  const [fence, setFence] = useState(true);
  const [parking, setParking] = useState(true);
  const [security, setSecurity] = useState(true);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/kano_duplex_residence_1793795042264.jpg');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, propsRes, inspRes] = await Promise.all([
        api.getAdminDashboard(),
        api.getProperties({ status: 'all' }),
        api.getAllInspections(),
      ]);

      if (dashRes.success) setStats(dashRes.stats);
      if (propsRes.success) setProperties(propsRes.properties || []);
      if (inspRes.success) setInspections(inspRes.inspections || []);
    } catch (e: any) {
      setFeedbackErr('Failed to load admin data: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await api.updatePropertyStatus(id, newStatus);
      if (res.success) {
        setFeedbackMsg(`An canza matsayin gidan zuwa ${newStatus}!`);
        loadDashboardData();
      }
    } catch (e: any) {
      setFeedbackErr(e.message);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!window.confirm('Kana da tabbacin kana son goge wannan gidan?')) return;
    try {
      const res = await api.deleteProperty(id);
      if (res.success) {
        setFeedbackMsg('An goge gidan cikin nasara!');
        loadDashboardData();
      }
    } catch (e: any) {
      setFeedbackErr(e.message);
    }
  };

  const handleInspectionStatus = async (id: string, status: string) => {
    try {
      const res = await api.updateInspectionStatus(id, status);
      if (res.success) {
        setFeedbackMsg(`An canza status na duban gida zuwa ${status}`);
        loadDashboardData();
      }
    } catch (e: any) {
      setFeedbackErr(e.message);
    }
  };

  const handleEditClick = (prop: Property) => {
    setEditingPropertyId(prop._id || prop.id || null);
    setTitle(prop.title);
    setType(prop.type);
    setArea(prop.area);
    setPrice(prop.price.toString());
    setDealType(prop.dealType);
    setBedrooms((prop.bedrooms || 0).toString());
    setBathrooms((prop.bathrooms || 0).toString());
    setSize(prop.size || '');
    setDocument(prop.document);
    setWater(prop.water || 'Borehole');
    setPower(prop.power || 'NEPA');
    setFence(prop.fence);
    setParking(prop.parking);
    setSecurity(prop.security);
    setDescription(prop.description);
    setImageUrl(prop.images?.[0] || '/src/assets/images/kano_duplex_residence_1793795042264.jpg');
    setActiveTab('add');
  };

  const handleResetForm = () => {
    setEditingPropertyId(null);
    setTitle('');
    setType('Gida');
    setArea('Sabon Gari');
    setPrice('');
    setDealType('Haya - Per Year');
    setBedrooms('3');
    setBathrooms('2');
    setSize('50x80 ft');
    setDocument('Tenancy Agreement');
    setWater('Borehole');
    setPower('NEPA / Solar');
    setFence(true);
    setParking(true);
    setSecurity(true);
    setDescription('');
    setImageUrl('/src/assets/images/kano_duplex_residence_1793795042264.jpg');
  };

  const handleSubmitProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg('');
    setFeedbackErr('');

    if (!title || !price || !description) {
      setFeedbackErr('Da fatan a cika dukkan mahimman bayanan');
      return;
    }

    const payload = {
      title,
      type,
      area,
      price: Number(price),
      dealType,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      size,
      document,
      water,
      power,
      fence,
      parking,
      security,
      description,
      images: [imageUrl],
    };

    try {
      if (editingPropertyId) {
        const res = await api.updateProperty(editingPropertyId, payload);
        if (res.success) {
          setFeedbackMsg('An sabunta gidan cikin nasara!');
          handleResetForm();
          setActiveTab('properties');
          loadDashboardData();
        }
      } else {
        const res = await api.createProperty(payload);
        if (res.success) {
          setFeedbackMsg('An dora sabon gida/fili cikin nasara a MongoDB!');
          handleResetForm();
          setActiveTab('properties');
          loadDashboardData();
        }
      }
    } catch (e: any) {
      setFeedbackErr(e.message || 'Kuskure ya faru');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Admin Title Header */}
      <div className="bg-[#0B3D2E] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg border border-emerald-900">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#07261C] border-2 border-[#C9A227] flex items-center justify-center text-[#C9A227] shadow-inner shrink-0">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-900 text-[#C9A227] text-xs font-bold uppercase tracking-wider mb-1">
              Admin Console · Adam Auwal Adam
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Poppins']">
              Babban Dashboard na Gudanarwa
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1">
              A.A Properties Kano · Murtala Mohammed Way, Kano · 09042782681
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-[#07261C] p-1.5 rounded-xl border border-emerald-900/60">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'overview'
                ? 'bg-[#C9A227] text-[#0B3D2E]'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            Alkaluma (Overview)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('properties')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'properties'
                ? 'bg-[#C9A227] text-[#0B3D2E]'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            Kayayyaki ({properties.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inspections')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'inspections'
                ? 'bg-[#C9A227] text-[#0B3D2E]'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            Duban Gida ({inspections.length})
          </button>
          <button
            type="button"
            onClick={() => {
              handleResetForm();
              setActiveTab('add');
            }}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === 'add'
                ? 'bg-[#C9A227] text-[#0B3D2E]'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Dora Kaya</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{feedbackMsg}</span>
          </div>
          <button type="button" onClick={() => setFeedbackMsg('')}>
            <X className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      )}

      {feedbackErr && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{feedbackErr}</span>
          </div>
          <button type="button" onClick={() => setFeedbackErr('')}>
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {/* Tab 1: Overview & Metrics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                <span>Dukkan Kaya (Total)</span>
                <Building className="w-4 h-4 text-[#0B3D2E]" />
              </div>
              <div className="text-2xl font-extrabold text-[#0B3D2E] font-['Poppins'] tabular-nums">
                {stats?.totalProperties ?? properties.length}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1 font-medium">
                {stats?.totalAvailable ?? properties.filter((p) => p.status === 'Available').length} Available a Kasuwa
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                <span>Wadanda aka Duba (Views)</span>
                <Eye className="w-4 h-4 text-[#C9A227]" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-['Poppins'] tabular-nums">
                {stats?.totalViews ?? properties.reduce((a, b) => a + (b.views || 0), 0)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Mutane da suka duba a Kano</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                <span>WhatsApp Clicks</span>
                <MessageCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-['Poppins'] tabular-nums">
                {stats?.totalWhatsAppClicks ?? properties.reduce((a, b) => a + (b.whatsappClicks || 0), 0)}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">Tattaunawa da Adam</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                <span>Duban Gida (Inspections)</span>
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-['Poppins'] tabular-nums">
                {stats?.totalInspections ?? inspections.length}
              </div>
              <div className="text-[11px] text-blue-700 mt-1">Free physical bookings</div>
            </div>
          </div>

          {/* Quick Recent Inspections Alert */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 font-['Poppins'] mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0B3D2E]" />
              <span>Kwanan nan: Bukatar Duban Gida (Recent Inspections)</span>
            </h3>

            {inspections.length === 0 ? (
              <p className="text-xs text-slate-500">Babu wata bukata a yanzu.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {inspections.slice(0, 5).map((insp) => (
                  <div key={insp._id || insp.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{insp.customerName} ({insp.customerPhone})</p>
                      <p className="text-[11px] text-slate-500">{insp.propertyTitle} · {new Date(insp.date).toLocaleDateString('en-GB')} da karfe {insp.time}</p>
                    </div>
                    <a
                      href={`https://wa.me/234${insp.customerPhone.replace(/^0/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Properties Management Table */}
      {activeTab === 'properties' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Poppins']">
                Dukkan Kayayyakin da ke Kan Shafin (MongoDB Properties)
              </h3>
              <p className="text-xs text-slate-500">
                Adam Auwal Adam ne kadai ke da ikon canza status ko goge kaya.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                handleResetForm();
                setActiveTab('add');
              }}
              className="px-4 py-2 bg-[#C9A227] hover:bg-[#B58F1D] text-[#0B3D2E] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Dora Sabo</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-4">Kaya</th>
                  <th className="p-4">Nau'i & Unguwa</th>
                  <th className="p-4">Farashi</th>
                  <th className="p-4">Takarda</th>
                  <th className="p-4">Matsayi (Status)</th>
                  <th className="p-4 text-right">Ayyuka</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((p) => (
                  <tr key={p._id || p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || '/src/assets/images/kano_duplex_residence_1793795042264.jpg'}
                          alt={p.title}
                          className="w-12 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="max-w-xs truncate">
                          <p className="font-bold text-slate-900 truncate">{p.title}</p>
                          <p className="text-[11px] text-slate-500">{p.dealType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-[#0B3D2E]">{p.type}</span>
                      <p className="text-slate-500">{p.area}, Kano</p>
                    </td>
                    <td className="p-4 font-bold font-mono tabular-nums text-slate-900">
                      ₦{p.price.toLocaleString('en-NG')}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {p.document}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p._id || p.id || '', e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none ${
                          p.status === 'Available'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : p.status === 'Sold'
                            ? 'bg-red-50 border-red-300 text-red-800'
                            : p.status === 'Rented'
                            ? 'bg-blue-50 border-blue-300 text-blue-800'
                            : 'bg-slate-100 border-slate-300 text-slate-700'
                        }`}
                      >
                        <option value="Available">Available</option>
                        <option value="Sold">Sold</option>
                        <option value="Rented">Rented</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEditClick(p)}
                          className="p-1.5 text-slate-600 hover:text-[#0B3D2E] hover:bg-slate-100 rounded-lg transition-colors"
                          title="Gyara bayani"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProperty(p._id || p.id || '')}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Goge kaya"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Inspections Management */}
      {activeTab === 'inspections' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 font-['Poppins']">
              Dukkan Bukatun Duban Gida (Physical Inspections)
            </h3>
            <p className="text-xs text-slate-500">
              Kira ko aika WhatsApp ga abokan ciniki domin tafiya duba kaya.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Kayan da za a Duba</th>
                  <th className="p-4">Rana da Lokaci</th>
                  <th className="p-4">Karin Bayani</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ayyuka</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inspections.map((insp) => (
                  <tr key={insp._id || insp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{insp.customerName}</p>
                      <p className="text-[11px] text-slate-500">{insp.customerPhone}</p>
                    </td>
                    <td className="p-4 font-medium text-slate-800 max-w-xs truncate">
                      {insp.propertyTitle}
                    </td>
                    <td className="p-4">
                      <p className="font-bold">{new Date(insp.date).toLocaleDateString('en-GB')}</p>
                      <p className="text-[11px] text-slate-500">{insp.time}</p>
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-600">
                      {insp.notes || '—'}
                    </td>
                    <td className="p-4">
                      <select
                        value={insp.status}
                        onChange={(e) => handleInspectionStatus(insp._id || insp.id || '', e.target.value)}
                        className="text-xs font-semibold rounded-lg px-2.5 py-1 border border-slate-300 focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Done">Done</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={`https://wa.me/234${insp.customerPhone.replace(/^0/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#0B3D2E] text-[#C9A227] hover:bg-[#07261C] rounded-lg text-xs font-bold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-[#C9A227] text-[#0B3D2E]" />
                        <span>Kira a WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Add / Edit Property Form */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
                {editingPropertyId ? 'Gyara Bayanan Gida / Fili' : 'Dora Sabon Gida, Fili ko Shago (Admin Only)'}
              </h3>
              <p className="text-xs text-slate-500">
                Za a ajiye wannan kai tsaye a cikin MongoDB database na A.A Properties.
              </p>
            </div>
            {editingPropertyId && (
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs text-red-600 hover:underline font-semibold"
              >
                Soke Gyara (Cancel Edit)
              </button>
            )}
          </div>

          <form onSubmit={handleSubmitProperty} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sunan Gidan ko Filin (Title) *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Misali: Gida 3-Bedroom Flat Mai Kyau - Sabon Gari"
                required
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nau'in Kaya (Type) *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as PropertyType)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                >
                  <option value="Gida">Gida</option>
                  <option value="Fili">Fili</option>
                  <option value="Shago">Shago</option>
                  <option value="Company">Company</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Hall">Hall</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Unguwa a Kano (Area) *
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                >
                  {KANO_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Farashi (Price ₦) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="600000"
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nau'in Ciniki (Deal Type) *
                </label>
                <select
                  value={dealType}
                  onChange={(e) => setDealType(e.target.value as DealType)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                >
                  <option value="Haya - Per Year">Haya - Per Year</option>
                  <option value="Haya - Per Day">Haya - Per Day</option>
                  <option value="Saya - Total">Saya - Total</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Takardar Halal (Document) *
                </label>
                <select
                  value={document}
                  onChange={(e) => setDocument(e.target.value as DocumentType)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                >
                  <option value="C of O">C of O</option>
                  <option value="R of O">R of O</option>
                  <option value="Tenancy Agreement">Tenancy Agreement</option>
                  <option value="None">None</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Girma (Size)
                </label>
                <input
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="50x100 ft"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dakuna (Bedrooms)
                </label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bandakuna (Baths)
                </label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ruwa (Water)
                </label>
                <input
                  type="text"
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                  placeholder="Borehole"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Wuta (Power)
                </label>
                <input
                  type="text"
                  value={power}
                  onChange={(e) => setPower(e.target.value)}
                  placeholder="NEPA 24hrs"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Checkboxes: Fence, Parking, Security */}
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={fence}
                  onChange={(e) => setFence(e.target.checked)}
                  className="h-4 w-4 text-[#0B3D2E] rounded border-slate-300"
                />
                Katanga Zagaye (Fenced)
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={parking}
                  onChange={(e) => setParking(e.target.checked)}
                  className="h-4 w-4 text-[#0B3D2E] rounded border-slate-300"
                />
                Fakin Mota (Parking)
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={security}
                  onChange={(e) => setSecurity(e.target.checked)}
                  className="h-4 w-4 text-[#0B3D2E] rounded border-slate-300"
                />
                Jami'an Tsaro (Security)
              </label>
            </div>

            {/* Photo Selection / Cloudinary URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hoto (Photo URL ko Cloudinary URL) *
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/src/assets/images/... ko https://res.cloudinary.com/..."
                required
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
              />
              <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                <span>Hotunan Gida da Aka Shirya:</span>
                <button
                  type="button"
                  onClick={() => setImageUrl('/src/assets/images/kano_duplex_residence_1793795042264.jpg')}
                  className="text-[#0B3D2E] underline font-medium"
                >
                  Duplex
                </button>
                <button
                  type="button"
                  onClick={() => setImageUrl('/src/assets/images/hero_kano_mansion_1793795009227.jpg')}
                  className="text-[#0B3D2E] underline font-medium"
                >
                  Mansion
                </button>
                <button
                  type="button"
                  onClick={() => setImageUrl('/src/assets/images/kano_commercial_shop_1793795056124.jpg')}
                  className="text-[#0B3D2E] underline font-medium"
                >
                  Shago
                </button>
                <button
                  type="button"
                  onClick={() => setImageUrl('/src/assets/images/kano_land_plot_1793795069623.jpg')}
                  className="text-[#0B3D2E] underline font-medium"
                >
                  Fili
                </button>
              </div>
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Karin Bayani (Hausa + English Description) *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Bayyana yanayin gidan, tsarin dakuna, hanyar zuwa, da sharuɗɗan haya ko sayarwa..."
                required
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#0B3D2E] hover:bg-[#07261C] text-[#C9A227] font-bold text-xs rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                {editingPropertyId ? 'SABUNTA BAYANAN GIDAN' : 'DORA WANNAN KAYA A SHAFIN A.A PROPERTIES'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
