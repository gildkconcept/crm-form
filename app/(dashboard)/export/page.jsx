'use client';

import { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  FileDown, 
  Download,
  Filter,
  Calendar,
  Check,
  Loader2
} from 'lucide-react';
import api from '../../lib/api';

export default function ExportPage() {
  const [exportType, setExportType] = useState('csv');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateDebut: '',
    dateFin: '',
    type_donateur: '',
    formule: '',
    statut: ''
  });

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/export/${exportType}`, {
        params: filters,
        responseType: 'blob'
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `partenaires_${new Date().toISOString().slice(0,10)}.${exportType === 'csv' ? 'csv' : exportType === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur export:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e' }}>Exports</h1>
        <p style={{ color: '#888', marginTop: '4px' }}>
          Exportez vos données de partenaires
        </p>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '0.5px solid #e8e5e0',
        maxWidth: '600px'
      }}>
        {/* Type d'export */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Format d'export
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {[
              { id: 'csv', label: 'CSV', icon: FileSpreadsheet, color: '#3B6D11' },
              { id: 'excel', label: 'Excel', icon: FileSpreadsheet, color: '#185FA5' },
              { id: 'pdf', label: 'PDF', icon: FileText, color: '#dc2626' },
            ].map((format) => {
              const Icon = format.icon;
              return (
                <button
                  key={format.id}
                  onClick={() => setExportType(format.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: exportType === format.id ? '2px solid #7B1D5A' : '1px solid #e5e7eb',
                    background: exportType === format.id ? '#fdf5fb' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={24} style={{ color: format.color }} />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a2e' }}>
                    {format.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtres */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
            <Filter size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Filtres
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Date début
              </label>
              <input
                type="date"
                value={filters.dateDebut}
                onChange={(e) => setFilters({ ...filters, dateDebut: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                Date fin
              </label>
              <input
                type="date"
                value={filters.dateFin}
                onChange={(e) => setFilters({ ...filters, dateFin: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Bouton d'export */}
        <button
          onClick={handleExport}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            background: '#7B1D5A',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#5e1644'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#7B1D5A'}
        >
          {loading ? (
            <>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              Export en cours...
            </>
          ) : (
            <>
              <Download size={20} />
              Exporter les données
            </>
          )}
        </button>
      </div>
    </div>
  );
}