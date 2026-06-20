'use client';

import { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Bell,
  Globe,
  Database,
  Shield,
  Save,
  RefreshCw,
  Check,
  AlertCircle
} from 'lucide-react';
import { adminService, authService } from '../../lib/api';

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState('profil');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Profil
  const [profile, setProfile] = useState({
    nom: '',
    email: '',
    username: ''
  });

  // Mot de passe
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Préférences
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    language: 'fr'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await adminService.getProfile();
      const data = response.data;
      if (data.success) {
        setProfile({
          nom: data.data.nom || '',
          email: data.data.email || '',
          username: data.data.username || ''
        });
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const response = await adminService.update('profile', { nom: profile.nom, email: profile.email });
      const data = response.data;
      if (data.success) {
        setSuccess('Profil mis à jour avec succès !');
        // Mettre à jour le localStorage
        const admin = JSON.parse(localStorage.getItem('admin') || '{}');
        admin.nom = profile.nom;
        admin.email = profile.email;
        localStorage.setItem('admin', JSON.stringify(admin));
      } else {
        setError(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.changePassword
        ? authService.changePassword(passwordData.currentPassword, passwordData.newPassword)
        : null;
      const data = response.data;
      if (data.success) {
        setSuccess('Mot de passe changé avec succès !');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(data.message || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profil', label: 'Profil', icon: User },
    { id: 'securite', label: 'Sécurité', icon: Lock },
    { id: 'preferences', label: 'Préférences', icon: Bell },
    { id: 'systeme', label: 'Système', icon: Database },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e' }}>Paramètres</h1>
        <p style={{ color: '#888', marginTop: '4px' }}>
          Gérez vos préférences et configurations
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        background: 'white',
        borderRadius: '12px',
        padding: '4px',
        border: '0.5px solid #e8e5e0',
        marginBottom: '24px',
        overflowX: 'auto'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? '#fdf5fb' : 'transparent',
                color: activeTab === tab.id ? '#7B1D5A' : '#6b7280',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '500' : '400',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenu */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '0.5px solid #e8e5e0'
      }}>
        {/* Messages */}
        {success && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: '#EAF3DE',
            color: '#3B6D11',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Check size={18} />
            {success}
          </div>
        )}
        {error && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: '#fef2f2',
            color: '#dc2626',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Onglet Profil */}
        {activeTab === 'profil' && (
          <form onSubmit={handleProfileUpdate}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', marginBottom: '20px' }}>
              <User size={18} style={{ display: 'inline', marginRight: '8px' }} />
              Informations personnelles
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={profile.username}
                disabled
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  background: '#f3f4f6',
                  fontSize: '14px',
                  color: '#6b7280'
                }}
              />
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Le nom d'utilisateur ne peut pas être modifié
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Nom complet *
              </label>
              <input
                type="text"
                value={profile.nom}
                onChange={(e) => setProfile({ ...profile, nom: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#7B1D5A'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Email *
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#7B1D5A'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                background: '#7B1D5A',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#5e1644'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#7B1D5A'}
            >
              <Save size={18} />
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        )}

        {/* Onglet Sécurité */}
        {activeTab === 'securite' && (
          <form onSubmit={handlePasswordChange}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', marginBottom: '20px' }}>
              <Lock size={18} style={{ display: 'inline', marginRight: '8px' }} />
              Changer le mot de passe
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Mot de passe actuel *
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#7B1D5A'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Nouveau mot de passe *
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#7B1D5A'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                minLength={6}
                required
              />
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Minimum 6 caractères
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#7B1D5A'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                background: '#7B1D5A',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#5e1644'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#7B1D5A'}
            >
              <Shield size={18} />
              {loading ? 'Changement...' : 'Changer le mot de passe'}
            </button>
          </form>
        )}

        {/* Onglet Préférences */}
        {activeTab === 'preferences' && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', marginBottom: '20px' }}>
              <Bell size={18} style={{ display: 'inline', marginRight: '8px' }} />
              Préférences
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={preferences.notifications}
                  onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#7B1D5A',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '14px', color: '#1a1a2e' }}>
                  Activer les notifications
                </span>
              </label>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={preferences.emailUpdates}
                  onChange={(e) => setPreferences({ ...preferences, emailUpdates: e.target.checked })}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#7B1D5A',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '14px', color: '#1a1a2e' }}>
                  Recevoir les mises à jour par email
                </span>
              </label>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={preferences.darkMode}
                  onChange={(e) => setPreferences({ ...preferences, darkMode: e.target.checked })}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#7B1D5A',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '14px', color: '#1a1a2e' }}>
                  Mode sombre (expérimental)
                </span>
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Langue
              </label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '14px',
                  background: 'white',
                  width: '100%',
                  maxWidth: '300px'
                }}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSuccess('Préférences sauvegardées !');
                setTimeout(() => setSuccess(''), 3000);
              }}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                background: '#7B1D5A',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#5e1644'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#7B1D5A'}
            >
              <Save size={18} />
              Sauvegarder les préférences
            </button>
          </div>
        )}

        {/* Onglet Système */}
        {activeTab === 'systeme' && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', marginBottom: '20px' }}>
              <Database size={18} style={{ display: 'inline', marginRight: '8px' }} />
              Informations système
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                background: '#f9fafb',
                border: '0.5px solid #e5e7eb'
              }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Version</p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e' }}>1.0.0</p>
              </div>
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                background: '#f9fafb',
                border: '0.5px solid #e5e7eb'
              }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Backend</p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e' }}>Node.js + Express</p>
              </div>
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                background: '#f9fafb',
                border: '0.5px solid #e5e7eb'
              }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Base de données</p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e' }}>PostgreSQL</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  if (confirm('Voulez-vous vraiment vider le cache ?')) {
                    setSuccess('Cache vidé avec succès !');
                    setTimeout(() => setSuccess(''), 3000);
                  }
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  background: 'white',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <RefreshCw size={16} />
                Vider le cache
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}