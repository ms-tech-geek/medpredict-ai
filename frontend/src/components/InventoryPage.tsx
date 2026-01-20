import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, AlertTriangle, Calendar, IndianRupee, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchMedicines, fetchCategories } from '../services/api';
import { SearchFilter } from './SearchFilter';
import type { Medicine } from '../types';

interface InventoryPageProps {
  onMedicineClick: (medicineId: number) => void;
}

const riskColors = {
  CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
  HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  LOW: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export function InventoryPage({ onMedicineClick }: InventoryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: medicines = [], isLoading } = useQuery({
    queryKey: ['medicines', searchTerm, selectedCategory, sortBy],
    queryFn: () => fetchMedicines({
      search: searchTerm || undefined,
      category: selectedCategory || undefined,
      sortBy: sortBy as 'name' | 'stock' | 'consumption' | 'risk',
    }),
  });

  const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toFixed(0)}`;
  };

  const totalValue = medicines.reduce((sum, m) => sum + (m.stock_value || 0), 0);
  const totalStock = medicines.reduce((sum, m) => sum + m.quantity, 0);
  const criticalCount = medicines.filter(m => m.risk_level === 'CRITICAL').length;
  const highCount = medicines.filter(m => m.risk_level === 'HIGH').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Medicines</p>
              <p className="text-xl font-bold text-white">{medicines.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Value</p>
              <p className="text-xl font-bold text-white">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Critical</p>
              <p className="text-xl font-bold text-red-400">{criticalCount}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">High Risk</p>
              <p className="text-xl font-bold text-orange-400">{highCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Medicine List */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Medicine</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Category</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Stock</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Value</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Daily Use</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Days Left</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-slate-400">Risk</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr
                key={medicine.medicine_id}
                className="border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer transition-colors"
                onClick={() => onMedicineClick(medicine.medicine_id)}
              >
                <td className="py-3 px-4">
                  <span className="text-white font-medium">{medicine.medicine_name}</span>
                </td>
                <td className="py-3 px-4 text-slate-400">{medicine.category}</td>
                <td className="py-3 px-4 text-right text-white">{medicine.quantity.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-white">{formatCurrency(medicine.stock_value || 0)}</td>
                <td className="py-3 px-4 text-right text-slate-300">{medicine.avg_daily?.toFixed(1) || '-'}</td>
                <td className="py-3 px-4 text-right">
                  <span className={`${
                    (medicine.days_of_stock || 0) <= 7 ? 'text-red-400' :
                    (medicine.days_of_stock || 0) <= 14 ? 'text-orange-400' :
                    'text-slate-300'
                  }`}>
                    {medicine.days_of_stock === 999 ? '∞' : medicine.days_of_stock?.toFixed(0) || '-'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${
                    riskColors[medicine.risk_level as keyof typeof riskColors] || riskColors.LOW
                  }`}>
                    {medicine.risk_level || 'LOW'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {medicines.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No medicines found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

