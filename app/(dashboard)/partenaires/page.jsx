'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { partnerService, statsService } from '../../lib/api';

export default function PartenairesPage() {
  const router = useRouter();
  const [partenaires, setPartenaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type_donateur: '',
    formule: '',
    statut: '',
    pays: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Statistiques des filtres
  const [filterStats, setFilterStats] = useState({
    types: [],
    formules: [],
    statuts: [],
    pays: []
  });

  useEffect(() => {
    fetchFilterStats();
    fetchPartenaires();
  }, [pagination.page, filters, searchTerm]);

  const fetchFilterStats = async () => {
    try {
      const [typesRes, formulesRes, statutsRes, paysRes] = await Promise.all([
        statsService.getTypes(),
        statsService.getFormules(),
        statsService.getStatuts(),
        statsService.getPays()
      ]);

      const typesData = typesRes.data;
      const formulesData = formulesRes.data;
      const statutsData = statutsRes.data;
      const paysData = paysRes.data;

      setFilterStats({
        types: typesData.success ? typesData.data : [],
        formules: formulesData.success ? formulesData.data : [],
        statuts: statutsData.success ? statutsData.data : [],
        pays: paysData.success ? paysData.data : []
      });
    } catch (error) {
      console.error('Erreur chargement filtres:', error);
    }
  };

  const fetchPartenaires = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters
      };

      const response = await partnerService.getAll(params);
      const data = response.data;
      
      if (data.success) {
        setPartenaires(data.data || []);
        setPagination(prev => ({
          ...prev,
          total: data.total || data.data?.length || 0,
          totalPages: Math.ceil((data.total || data.data?.length || 0) / prev.limit)
        }));
      }
    } catch (error) {
      console.error('Erreur chargement partenaires:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Nouveau': { bg: '#e8f4fd', color: '#185FA5' },
      'Contacté': { bg: '#faeeda', color: '#854F0B' },
      'Actif': { bg: '#EAF3DE', color: '#3B6D11' },
      'Partenaire stratégique': { bg: '#fdf5fb', color: '#7B1D5A' },
      'Suspendu': { bg: '#faece7', color: '#993C1D' },
      'Archivé': { bg: '#f1efe8', color: '#5F5E5A' },
    };
    return styles[status] || { bg: '#f1efe8', color: '#5F5E5A' };
  };

  const getFormuleIcon = (formule) => {
    const icons = {
      'Diamant': '💎',
      'Or': '🥇',
      'Argent': '🥈',
      'Bronze': '🥉'
    };
    return icons[formule] || '⭐';
  };

  const handleDelete = async (id, nom) => {
    if (!confirm(`Voulez-vous vraiment supprimer le partenaire ${nom} ?`)) return;
    
    try {
      const response = await partnerService.delete(id);
      const data = response.data;
      if (data.success) {
        fetchPartenaires();
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ type_donateur: '', formule: '', statut: '', pays: '' });
    setSearchTerm('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = Object.values(filters).some(v => v) || searchTerm;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e' }}>Partenaires</h1>
            <p style={{ color: '#888', marginTop: '4px' }}>
              {pagination.total} partenaire{pagination.total > 1 ? 's' : ''} enregistré{pagination.total > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => router.push('/partenaires/nouveau')}
            style={{
              background: '#7B1D5A',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#5e1644'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#7B1D5A'}
          >
            <Plus size={18} />
            Nouveau partenaire
          </button>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        border: '0.5px solid #e8e5e0'
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              width: '18px',
              height: '18px'
            }} />
            <input
              type="text"
              placeholder="Rechercher par nom, référence, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#7B1D5A'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: showFilters ? '#fdf5fb' : 'white',
              color: showFilters ? '#7B1D5A' : '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            <Filter size={18} />
            Filtres
            {hasActiveFilters && (
              <span style={{
                background: '#7B1D5A',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {Object.values(filters).filter(v => v).length + (searchTerm ? 1 : 0)}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: 'white',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              <X size={18} />
              Effacer
            </button>
          )}

          <button
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: 'white',
              color: '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
          >
            <Download size={18} />
            Exporter
          </button>
        </div>

        {/* Filtres dépliés */}
        {showFilters && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Type</label>
              <select
                value={filters.type_donateur}
                onChange={(e) => handleFilterChange('type_donateur', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '14px',
                  background: 'white'
                }}
              >
                <option value="">Tous</option>
                {filterStats.types.map(t => (
                  <option key={t.type_donateur} value={t.type_donateur}>
                    {t.type_donateur} ({t.count})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Formule</label>
              <select
                value={filters.formule}
                onChange={(e) => handleFilterChange('formule', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '14px',
                  background: 'white'
                }}
              >
                <option value="">Toutes</option>
                {filterStats.formules.map(f => (
                  <option key={f.formule} value={f.formule}>
                    {f.formule} ({f.count})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Statut</label>
              <select
                value={filters.statut}
                onChange={(e) => handleFilterChange('statut', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '14px',
                  background: 'white'
                }}
              >
                <option value="">Tous</option>
                {filterStats.statuts.map(s => (
                  <option key={s.statut} value={s.statut}>
                    {s.statut} ({s.count})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Pays</label>
              <select
                value={filters.pays}
                onChange={(e) => handleFilterChange('pays', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '14px',
                  background: 'white'
                }}
              >
                <option value="">Tous</option>
                {filterStats.pays.map(p => (
                  <option key={p.pays} value={p.pays}>
                    {p.pays} ({p.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Tableau des partenaires */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #7B1D5A',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : partenaires.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '60px 20px',
          textAlign: 'center',
          border: '0.5px solid #e8e5e0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
          <h3 style={{ fontSize: '18px', color: '#1a1a2e', marginBottom: '8px' }}>Aucun partenaire trouvé</h3>
          <p style={{ color: '#888' }}>
            {hasActiveFilters ? 'Essayez de modifier vos filtres de recherche' : 'Commencez par ajouter votre premier partenaire'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                marginTop: '16px',
                padding: '8px 20px',
                background: '#7B1D5A',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Effacer les filtres
            </button>
          )}
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '0.5px solid #e8e5e0',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f5f2' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Référence</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nom</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Formule</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Statut</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {partenaires.map((p) => {
                  const statusStyle = getStatusBadge(p.statut);
                  return (
                    <tr
                      key={p.id}
                      style={{ borderBottom: '1px solid #f0ede8' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fdf5fb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#1a1a2e' }}>
                        {p.reference}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                        {p.nom} {p.prenoms}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{getFormuleIcon(p.formule)}</span>
                          {p.formule}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>
                        {p.type_donateur}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '99px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: statusStyle.bg,
                          color: statusStyle.color
                        }}>
                          {p.statut}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#888' }}>
                        {new Date(p.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <Link
                            href={`/partenaires/${p.id}`}
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              background: 'transparent',
                              color: '#6b7280',
                              transition: 'all 0.2s',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#e8f4fd'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            href={`/partenaires/${p.id}/modifier`}
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              background: 'transparent',
                              color: '#6b7280',
                              transition: 'all 0.2s',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#faeeda'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.nom)}
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              background: 'transparent',
                              color: '#6b7280',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#faece7'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '20px'
        }}>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: 'white',
              color: pagination.page === 1 ? '#d1d5db' : '#6b7280',
              cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ChevronLeft size={18} />
            Précédent
          </button>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            Page {pagination.page} sur {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page === pagination.totalPages}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: 'white',
              color: pagination.page === pagination.totalPages ? '#d1d5db' : '#6b7280',
              cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Suivant
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}