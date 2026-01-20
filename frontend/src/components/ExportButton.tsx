import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader } from 'lucide-react';

interface ExportButtonProps {
  data: any[];
  filename: string;
  title?: string;
}

export function ExportButton({ data, filename, title = 'Export' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      if (!data || data.length === 0) {
        alert('No data to export');
        return;
      }

      // Get headers from first object
      const headers = Object.keys(data[0]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Handle special characters and commas
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value ?? '';
          }).join(',')
        )
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
      setShowMenu(false);
    }
  };

  const exportToJSON = () => {
    setIsExporting(true);
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        disabled={isExporting}
      >
        {isExporting ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {title}
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowMenu(false)} 
          />
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden">
            <button
              onClick={exportToCSV}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="font-medium">Export as CSV</p>
                <p className="text-xs text-slate-500">Spreadsheet format</p>
              </div>
            </button>
            <button
              onClick={exportToJSON}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-t border-slate-700"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <div>
                <p className="font-medium">Export as JSON</p>
                <p className="text-xs text-slate-500">Raw data format</p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

