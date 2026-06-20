'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Users,
  TrendingUp,
  Award,
  MapPin,
  Calendar,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react';
import { statsService } from '../../lib/api';

export default function StatistiquesPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    dashboard: null,
    formules: [],
    types: [],
    pays: [],
    statuts: [],
    evolution: []
  });
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [dashboardRes, formulesRes, typesRes, paysRes, statutsRes, evolutionRes] = await Promise.all([
        statsService.getDashboard(),
        statsService.getFormules(),
        statsService.getTypes(),
        statsService.getPays(),
        statsService.getStatuts(),
        statsService.getEvolution()
      ]);

      const dashboardData = dashboardRes.data;
      const formulesData = formulesRes.data;
      const typesData = typesRes.data;
      const paysData = paysRes.data;
      const statutsData = statutsRes.data;
      const evolutionData = evolutionRes.data;

      setStats({
        dashboard: dashboardData.success ? dashboardData.data : null,
        formules: formulesData.success ? formulesData.data : [],
        types: typesData.success ? typesData.data : [],
        pays: paysData.success ? paysData.data : [],
        statuts: statutsData.success ? statutsData.data : [],
        evolution: evolutionData.success ? evolutionData.data : []
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#7B1D5A', '#C41E3A', '#F5A623', '#378ADD', '#3B6D11', '#D85A30'];
  const CHART_COLORS = ['#7B1D5A', '#C41E3A', '#F5A623', '#378ADD'];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
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

  const { dashboard, formules, types, pays, statuts, evolution } = stats;

  // Données simulées pour l'évolution si l'API ne renvoie rien
  const evolutionData = evolution.length > 0 ? evolution : [
    { mois: 'Jan', count: 12 },
    { mois: 'Fév', count: 15 },
    { mois: 'Mar', count: 18 },
    { mois: 'Avr', count: 22 },
    { mois: 'Mai', count: 25 },
    { mois: 'Juin', count: 30 },
  ];

  const statCards = [
    { 
      title: 'Total Partenaires', 
      value: dashboard?.total_partenaires || 0, 
      icon: Users, 
      color: '#7B1D5A',
      bg: '#fdf5fb'
    },
    { 
      title: 'Nouveaux (30j)', 
      value: dashboard?.nouveaux_30j || 0, 
      icon: TrendingUp, 
      color: '#3B6D11',
      bg: '#EAF3DE'
    },
    { 
      title: 'Actifs', 
      value: dashboard?.statut_actif || 0, 
      icon: Award, 
      color: '#185FA5',
      bg: '#e8f4fd'
    },
    { 
      title: 'Pays représentés', 
      value: pays.length || 0, 
      icon: MapPin, 
      color: '#D85A30',
      bg: '#faece7'
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e' }}>Statistiques</h1>
            <p style={{ color: '#888', marginTop: '4px' }}>
              Analyse des données de vos partenaires
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                outline: 'none',
                fontSize: '14px',
                background: 'white'
              }}
            >
              <option value="7">7 jours</option>
              <option value="30">30 jours</option>
              <option value="90">90 jours</option>
              <option value="365">1 an</option>
            </select>
            <button
              onClick={fetchStats}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#6b7280',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <RefreshCw size={16} />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                border: '0.5px solid #e8e5e0',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
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
                  justifyContent: 'center'
                }}>
                  <Icon size={22} color={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphiques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Évolution */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '0.5px solid #e8e5e0'
        }}>
          <h3 style={{ fontWeight: '600', color: '#1a1a2e', marginBottom: '16px' }}>
            <TrendingUp size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Évolution des partenaires
          </h3>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolutionData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B1D5A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7B1D5A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#7B1D5A"
                  strokeWidth={2}
                  fill="url(#colorCount)"
                  dot={{ fill: '#7B1D5A', r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition par formule */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '0.5px solid #e8e5e0'
        }}>
          <h3 style={{ fontWeight: '600', color: '#1a1a2e', marginBottom: '16px' }}>
            <Award size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Répartition par formule
          </h3>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formules.length > 0 ? formules : [
                    { formule: 'Diamant', count: 5 },
                    { formule: 'Or', count: 12 },
                    { formule: 'Argent', count: 8 },
                    { formule: 'Bronze', count: 5 }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="formule"
                >
                  {(formules.length > 0 ? formules : [
                    { formule: 'Diamant', count: 5 },
                    { formule: 'Or', count: 12 },
                    { formule: 'Argent', count: 8 },
                    { formule: 'Bronze', count: 5 }
                  ]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
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

      {/* Deuxième ligne de graphiques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Répartition par type */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '0.5px solid #e8e5e0'
        }}>
          <h3 style={{ fontWeight: '600', color: '#1a1a2e', marginBottom: '16px' }}>
            <Users size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Types de donateurs
          </h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={types.length > 0 ? types : [
                { type_donateur: 'Particulier', count: 15 },
                { type_donateur: 'Église/Communaute', count: 8 },
                { type_donateur: 'Entreprise/Organisme', count: 7 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
                <XAxis dataKey="type_donateur" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: '0.5px solid #e8e5e0',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                />
                <Bar dataKey="count" fill="#7B1D5A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition par statut */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '0.5px solid #e8e5e0'
        }}>
          <h3 style={{ fontWeight: '600', color: '#1a1a2e', marginBottom: '16px' }}>
            <Filter size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Statuts des partenaires
          </h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statuts.length > 0 ? statuts : [
                { statut: 'Nouveau', count: 5 },
                { statut: 'Contacté', count: 3 },
                { statut: 'Actif', count: 12 },
                { statut: 'Partenaire stratégique', count: 4 },
                { statut: 'Suspendu', count: 2 },
                { statut: 'Archivé', count: 4 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
                <XAxis dataKey="statut" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: '0.5px solid #e8e5e0',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                />
                <Bar dataKey="count" fill="#378ADD" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top pays */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        border: '0.5px solid #e8e5e0'
      }}>
        <h3 style={{ fontWeight: '600', color: '#1a1a2e', marginBottom: '16px' }}>
          <MapPin size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Répartition géographique
        </h3>
        <div style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pays.length > 0 ? pays.slice(0, 10) : [
                { pays: 'Côte d\'Ivoire', count: 20 },
                { pays: 'France', count: 8 },
                { pays: 'Canada', count: 4 }
              ]}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis type="number" stroke="#888" fontSize={12} />
              <YAxis dataKey="pays" type="category" stroke="#888" fontSize={12} width={80} />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: '0.5px solid #e8e5e0',
                  borderRadius: '8px',
                  fontSize: '13px'
                }}
              />
              <Bar dataKey="count" fill="#F5A623" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}