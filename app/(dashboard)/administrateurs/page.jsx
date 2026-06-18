'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  UserCog,
  Shield,
  ShieldCheck,
  ShieldAlert,
  X,
  Check,
  UserPlus
} from 'lucide-react';

export default function AdministrateursPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    nom: '',
    email: '',
    password: '',
    role: 'Gestionnaire'
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAdmins(data.data || []);
      }
    } catch (error) {
      console.error('Erreur chargement admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      const token = localStorage.getItem('token');
      const url = editingAdmin 
        ? `http://localhost:5000/api/admin/${editingAdmin.id}`
        : 'http://localhost:5000/api/auth/admins';
      const method = editingAdmin ? 'PUT' : 'POST';

      const payload = { ...formData };
      if (!editingAdmin) {
        delete payload.confirmPassword;
      } else if (!payload.password) {
        delete payload.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        setEditingAdmin(null);
        setFormData({ username: '', nom: '', email: '', password: '', role: 'Gestionnaire' });
        fetchAdmins();
      } else {
        setFormError(data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      setFormError('Erreur de connexion au serveur');
    }
  };

  const handleToggleAdmin = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchAdmins();
      }
    } catch (error) {
      console.error('Erreur toggle admin:', error);
    }
  };

  const handleDeleteAdmin = async (id, nom) => {
    if (!confirm(`Voulez-vous vraiment supprimer l'administrateur ${nom} ?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchAdmins();
      }
    } catch (error) {
      console.error('Erreur suppression admin:', error);
    }
  };

  const openCreateModal = () => {
    setEditingAdmin(null);
    setFormData({ username: '', nom: '', email: '', password: '', role: 'Gestionnaire' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      nom: admin.nom,
      email: admin.email,
      password: '',
      role: admin.role
    });
    setFormError('');
    setShowModal(true);
  };

  const getRoleIcon = (role) => {
    if (role === 'Super Administrateur') return <ShieldAlert size={18} style={{ color: '#dc2626' }} />;
    if (role === 'Administrateur') return <ShieldCheck size={18} style={{ color: '#7B1D5A' }} />;
    return <Shield size={18} style={{ color: '#6b7280' }} />;
  };

  const getRoleColor = (role) => {
    if (role === 'Super Administrateur') return '#fef2f2';
    if (role === 'Administrateur') return '#fdf5fb';
    return '#f3f4f6';
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e' }}>Administrateurs</h1>
            <p style={{ color: '#888', marginTop: '4px' }}>
              {admins.length} administrateur{admins.length > 1 ? 's' : ''} enregistré{admins.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={openCreateModal}
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
            <UserPlus size={18} />
            Nouvel administrateur
          </button>
        </div>
      </div>

      {/* Liste des administrateurs */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '0.5px solid #e8e5e0',
        overflow: 'hidden'
      }}>
        {admins.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
            <h3 style={{ fontSize: '18px', color: '#1a1a2e', marginBottom: '8px' }}>Aucun administrateur</h3>
            <p style={{ color: '#888' }}>Commencez par créer votre premier administrateur</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f5f2' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Utilisateur</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nom</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rôle</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Statut</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dernière connexion</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    style={{ borderBottom: '1px solid #f0ede8' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fdf5fb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '500', color: '#1a1a2e' }}>
                      @{admin.username}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px' }}>{admin.nom}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                      <a href={`mailto:${admin.email}`} style={{ color: '#7B1D5A', textDecoration: 'none' }}>
                        {admin.email}
                      </a>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '99px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: getRoleColor(admin.role),
                        color: admin.role === 'Super Administrateur' ? '#dc2626' : '#7B1D5A'
                      }}>
                        {getRoleIcon(admin.role)}
                        {admin.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '99px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background: admin.actif ? '#EAF3DE' : '#faece7',
                        color: admin.actif ? '#3B6D11' : '#993C1D'
                      }}>
                        {admin.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#888' }}>
                      {admin.last_login ? new Date(admin.last_login).toLocaleDateString('fr-FR') : 'Jamais'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleToggleAdmin(admin.id, admin.actif)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            background: 'transparent',
                            color: admin.actif ? '#ef4444' : '#3B6D11',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title={admin.actif ? 'Désactiver' : 'Activer'}
                        >
                          {admin.actif ? <X size={18} /> : <Check size={18} />}
                        </button>
                        <button
                          onClick={() => openEditModal(admin)}
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
                          onMouseEnter={(e) => e.currentTarget.style.background = '#faeeda'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin.id, admin.nom)}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de création/édition */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e' }}>
                {editingAdmin ? 'Modifier l\'administrateur' : 'Nouvel administrateur'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  borderRadius: '8px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <X size={24} />
              </button>
            </div>

            {formError && (
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                background: '#fef2f2',
                color: '#dc2626',
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Nom d'utilisateur *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
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
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

              {!editingAdmin && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Mot de passe *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              )}

              {editingAdmin && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                    placeholder="Laisser vide pour ne pas changer"
                  />
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  Rôle *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    outline: 'none',
                    fontSize: '14px',
                    background: 'white',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#7B1D5A'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  <option value="Gestionnaire">Gestionnaire</option>
                  <option value="Administrateur">Administrateur</option>
                  <option value="Super Administrateur">Super Administrateur</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: 'white',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#7B1D5A',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#5e1644'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#7B1D5A'}
                >
                  {editingAdmin ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}