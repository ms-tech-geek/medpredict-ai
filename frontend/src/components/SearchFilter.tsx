import { Search, Filter, X } from 'lucide-react';
import type { Category } from '../types';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: Category[];
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function SearchFilter({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
}: SearchFilterProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[250px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search medicines..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="relative min-w-[180px]">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.category} value={cat.category}>
              {cat.category} ({cat.medicine_count})
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div className="min-w-[160px]">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
        >
          <option value="name">Sort by Name</option>
          <option value="stock">Sort by Stock (Low)</option>
          <option value="consumption">Sort by Consumption</option>
          <option value="risk">Sort by Risk</option>
        </select>
      </div>
    </div>
  );
}

