import React, { useState } from 'react';
import {
  Property,
  PropertyType,
  PropertyStatus,
} from '../../types';
import { formatINR } from '../../utils/formatters';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Building2,
  Trash2,
  Edit,
  ExternalLink,
  MapPin,
  TrendingUp,
  Percent,
  X,
  AlertCircle,
} from 'lucide-react';

interface PropertiesViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onCreateProperty: (property: Omit<Property, 'id'>) => void;
  onUpdateProperty: (id: string, updates: Partial<Property>) => void;
  onDeleteProperty: (id: string) => void;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  properties,
  onSelectProperty,
  onCreateProperty,
  onUpdateProperty,
  onDeleteProperty,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'value' | 'income' | 'roi' | 'name'>('value');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  // Form state for creating a new property
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    city: '',
    address: '',
    type: 'Villa' as PropertyType,
    status: 'Owner Occupied' as PropertyStatus,
    purchasePrice: 10000000,
    purchaseDate: '2023-01-01',
    currentValue: 12500000,
    monthlyIncome: 120000,
    monthlyExpenses: 45000,
    occupancyRate: 100,
    roi: 10.5,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    notes: '',
  });

  // Filter and sort logic
  const filteredProperties = properties
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = selectedType === 'All' || p.type === selectedType;
      const matchStatus = selectedStatus === 'All' || p.status === selectedStatus;
      return matchSearch && matchType && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'value') return b.currentValue - a.currentValue;
      if (sortBy === 'income') return b.monthlyIncome - a.monthlyIncome;
      if (sortBy === 'roi') return b.roi - a.roi;
      return a.name.localeCompare(b.name);
    });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.city) return;

    onCreateProperty({
      ...formData,
      gallery: [formData.image],
      specs: {
        floors: 2,
        bedrooms: 4,
        bathrooms: 4,
        areaSqFt: 4500,
        parkingSpaces: 2,
        yearBuilt: 2023,
        energyRating: 'A Platinum',
        architecturalStyle: 'Contemporary Luxury',
      },
      coordinates: { lat: 12.9716, lng: 77.5946 },
      features: ['Automated Systems', 'High Security', 'Backup Genset'],
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-rose-400 font-semibold">
              REAL ESTATE HOLDINGS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Property Portfolio
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Manage your luxury villas, penthouses, commercial assets, and private estates.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/60 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative md:col-span-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or city..."
            className="w-full bg-zinc-950/80 border border-zinc-800 text-xs text-white pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Filter Type */}
        <div className="flex items-center gap-2 bg-zinc-950/80 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
          <span className="text-zinc-500">Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-transparent text-zinc-200 focus:outline-none w-full"
          >
            <option value="All">All Types</option>
            <option value="Villa">Villa</option>
            <option value="Apartment">Apartment</option>
            <option value="Commercial">Commercial</option>
            <option value="Farmhouse">Farmhouse</option>
            <option value="Vacation property">Vacation property</option>
          </select>
        </div>

        {/* Filter Status */}
        <div className="flex items-center gap-2 bg-zinc-950/80 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
          <span className="text-zinc-500">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-transparent text-zinc-200 focus:outline-none w-full"
          >
            <option value="All">All Statuses</option>
            <option value="Owner Occupied">Owner Occupied</option>
            <option value="Rented">Rented</option>
            <option value="Vacant">Vacant</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2 bg-zinc-950/80 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-zinc-200 focus:outline-none w-full"
          >
            <option value="value">Highest Valuation</option>
            <option value="income">Highest Monthly Income</option>
            <option value="roi">Highest ROI (%)</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800 text-zinc-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
          <h3 className="text-base font-semibold text-white">No Properties Found</h3>
          <p className="text-xs text-zinc-500 mt-1">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop)}
              className="group bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl overflow-hidden shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col"
            >
              {/* Image & Status Badge */}
              <div className="relative h-52 w-full overflow-hidden bg-zinc-950">
                <img
                  src={prop.image}
                  alt={prop.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-transparent to-black/40" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-md font-semibold tracking-wider ${
                      prop.status === 'Rented'
                        ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/60'
                        : prop.status === 'Owner Occupied'
                        ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-700/60'
                        : 'bg-rose-950/90 text-rose-300 border border-rose-700/60'
                    }`}
                  >
                    {prop.status}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-1 rounded-md bg-black/70 text-zinc-300 border border-zinc-700/60">
                    {prop.type}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {prop.city}
                  </span>
                  <span className="text-rose-400 font-bold">{prop.roi}% ROI</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-white group-hover:text-rose-400 transition-colors leading-snug">
                    {prop.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{prop.location}</p>
                </div>

                {/* Metrics Matrix */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-800/80 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Valuation</span>
                    <div className="font-mono font-bold text-white text-xs mt-0.5">
                      {formatINR(prop.currentValue)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Income</span>
                    <div className="font-mono font-bold text-emerald-400 text-xs mt-0.5">
                      {formatINR(prop.monthlyIncome)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Expenses</span>
                    <div className="font-mono font-bold text-zinc-300 text-xs mt-0.5">
                      {formatINR(prop.monthlyExpenses)}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-zinc-500 font-mono text-[11px]">
                    Occupancy: {prop.occupancyRate}%
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPropertyToDelete(prop);
                      }}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Delete Property"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-rose-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                      Inspect →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Property Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl bg-[#0b0e14] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Add New Property to Portfolio</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Property Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alibaug Seaside Manor"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">City / Region *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Alibaug, Maharashtra"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Full Physical Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value, location: e.target.value })}
                  placeholder="Plot number, locality, street..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Property Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Farmhouse">Farmhouse</option>
                    <option value="Vacation property">Vacation property</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Current Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Owner Occupied">Owner Occupied</option>
                    <option value="Rented">Rented</option>
                    <option value="Vacant">Vacant</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Purchase Price (₹)</label>
                  <input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Current Valuation (₹)</label>
                  <input
                    type="number"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({ ...formData, currentValue: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Monthly Income (₹)</label>
                  <input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Cover Photo URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="p-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-lg"
                >
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {propertyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setPropertyToDelete(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-[#0b0e14] border border-rose-900/60 rounded-2xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertCircle className="w-6 h-6" />
              <h4 className="text-base font-semibold text-white">Confirm Removal</h4>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you wish to delete <span className="font-bold text-white">{propertyToDelete.name}</span> from your portfolio? This will remove its associated telemetry and records.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setPropertyToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteProperty(propertyToDelete.id);
                  setPropertyToDelete(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Delete Estate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
