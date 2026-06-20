'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { statsService, partnerService } from '../../lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentPartners, setRecentPartners] = useState([]);
  const [evolutionData, setEvolutionData] = useState([]);
  const [formuleData, setFormuleData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les stats
        const statsResponse = await statsService.getDashboard();
        const statsData = statsResponse.data;
        if (statsData.success) {
          setStats(statsData.data);
        }

        // Récupérer les derniers partenaires
        const partnersResponse = await partnerService.getAll({ limit: 5 });
        const partnersData = partnersResponse.data;
        if (partnersData.success) {
          setRecentPartners(partnersData.data || []);
        }

        // Récupérer l'évolution (simulée pour l'instant)
        const evolution = [
          { mois: 'Jan', count: 12 },
          { mois: 'Fév', count: 15 },
          { mois: 'Mar', count: 18 },
          { mois: 'Avr', count: 22 },
          { mois: 'Mai', count: 25 },
          { mois: 'Juin', count: 30 },
        ];
        setEvolutionData(evolution);

        // Récupérer les formules (simulé)
        const formules = [
          { name: 'Diamant', value: 5, color: '#378ADD' },
          { name: 'Or', value: 12, color: '#EF9F27' },
          { name: 'Argent', value: 8, color: '#B4B2A9' },
          { name: 'Bronze', value: 5, color: '#D85A30' },
        ];
        setFormuleData(formules);

      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
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
    );
  }

  const statCards = [
    { title: 'Total Partenaires', value: stats?.total_partenaires || 0, icon: '👥', color: '#185FA5', bg: '#e8f4fd' },
    { title: 'Nouveaux (30j)', value: stats?.nouveaux_30j || 0, icon: '📈', color: '#3B6D11', bg: '#EAF3DE' },
    { title: 'Actifs', value: stats?.statut_actif || 0, icon: '🏢', color: '#7B1D5A', bg: '#fdf5fb' },
    { title: 'Taux engagement', value: stats?.taux_engagement || '0%', icon: '🎁', color: '#854F0B', bg: '#faeeda' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Nouveau': { bg: '#e8f4fd', color: '#185FA5' },
      'Contacté': { bg: '#faeeda', color: '#854F0B' },
      'Actif': { bg: '#EAF3DE', color: '#3B6D11' },
      'Partenaire stratégique': { bg: '#fdf5fb', color: '#7B1D5A' },
      'Suspendu': { bg: '#faece7', color: '#993C1D' },
      'Archivé': { bg: '#f1efe8', color: '#5F5E5A' },
    };
    return colors[status] || { bg: '#f1efe8', color: '#5F5E5A' };
  };

  const COLORS = ['#378ADD', '#EF9F27', '#B4B2A9', '#D85A30'];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e' }}>Tableau de bord</h1>
        <p style={{ color: '#888', marginTop: '4px' }}>Vue d'ensemble de vos partenaires</p>
      </div>

      {/* Stat Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '24px'
      }}>
        {statCards.map((stat, index) => (
          <div 
            key={index}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              border: '0.5px solid #e8e5e0',
              transition: 'all 0.3s',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>{stat.title}</p>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginTop: '4px' }}>{stat.value}</p>
              </div>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px'
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Évolution - Line Chart */}
        <div style={{ 
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          border: '0.5px solid #e8e5e0'
        }}>
          <h3 style={{ fontWeight: '600', color: '#1a1a2e', marginBottom: '16px' }}>Évolution des partenaires</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
                <XAxis dataKey="mois" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '0.5px solid #e8e5e0',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#7B1D5A" 
                  strokeWidth={2}
                  dot={{ fill: '#7B1D5A', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Formules - Pie Chart */}
        <div style={{ 
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          border: '0.5px solid #e8e5e0'
        }}>
          <h3 style={{ fontWeight: '600', color: '#1a1a2e', marginBottom: '16px' }}>Répartition par formule</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formuleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {formuleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '0.5px solid #e8e5e0',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span style={{ fontSize: '12px', color: '#1a1a2e' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Partners */}
      <div style={{ 
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        border: '0.5px solid #e8e5e0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontWeight: '600', color: '#1a1a2e' }}>Derniers partenaires</h3>
          <button style={{
            background: '#e8e5e0',
            color: '#1a1a2e',
            padding: '6px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#ddd9d3'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#e8e5e0'}
          >
            Voir tous
          </button>
        </div>
        
        {recentPartners.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#aaa' }}>
            Aucun partenaire enregistré
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: '12px', border: '0.5px solid #e8e5e0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f5f2' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888' }}>Référence</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888' }}>Nom</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888' }}>Formule</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888' }}>Statut</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPartners.map((partner) => {
                  const statusStyle = getStatusColor(partner.statut);
                  return (
                    <tr 
                      key={partner.id}
                      style={{ borderBottom: '1px solid #f0ede8' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fdf5fb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#1a1a2e' }}>{partner.reference}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1a1a2e' }}>{partner.nom} {partner.prenoms}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1a1a2e' }}>{partner.formule}</td>
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
                          {partner.statut}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#888' }}>
                        {new Date(partner.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}