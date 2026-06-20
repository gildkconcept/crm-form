'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Clock,
  Award,
  User,
  Building2,
  MessageSquare,
  History,
  FileText
} from 'lucide-react';
import { partnerService } from '../../../lib/api';

export default function PartenaireDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [partenaire, setPartenaire] = useState(null);
  const [historique, setHistorique] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [newNote, setNewNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchPartenaire();
  }, [params.id]);

  const fetchPartenaire = async () => {
    setLoading(true);
    try {
      const [partenaireRes, historiqueRes, notesRes] = await Promise.all([
        partnerService.getById(params.id),
        partnerService.getHistorique(params.id),
        partnerService.getNotes(params.id)
      ]);

      const partenaireData = partenaireRes.data;
      const historiqueData = historiqueRes.data;
      const notesData = notesRes.data;

      if (partenaireData.success) setPartenaire(partenaireData.data);
      if (historiqueData.success) setHistorique(historiqueData.data || []);
      if (notesData.success) setNotes(notesData.data || []);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      const response = await partnerService.addNote(params.id, newNote);
      const data = response.data;
      if (data.success) {
        setNotes([data.data, ...notes]);
        setNewNote('');
      }
    } catch (error) {
      console.error('Erreur ajout note:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await partnerService.updateStatus(params.id, newStatus);
      const data = response.data;
      if (data.success) {
        setPartenaire(data.data);
        fetchPartenaire(); // Rafraîchir pour l'historique
      }
    } catch (error) {
      console.error('Erreur changement statut:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Voulez-vous vraiment supprimer ce partenaire ?')) return;
    
    try {
      const response = await partnerService.delete(params.id);
      const data = response.data;
      if (data.success) {
        router.push('/partenaires');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
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

  const statusOptions = ['Nouveau', 'Contacté', 'Actif', 'Partenaire stratégique', 'Suspendu', 'Archivé'];

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

  if (!partenaire) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '24px', color: '#1a1a2e' }}>Partenaire non trouvé</h2>
        <Link href="/partenaires" style={{ color: '#7B1D5A', textDecoration: 'none' }}>
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation */}
      <div style={{ marginBottom: '20px' }}>
        <Link
          href="/partenaires"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#7B1D5A'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
        >
          <ArrowLeft size={18} />
          Retour à la liste
        </Link>
      </div>

      {/* En-tête */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '0.5px solid #e8e5e0',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>
                {partenaire.nom} {partenaire.prenoms}
              </h1>
              <span style={{
                padding: '4px 12px',
                borderRadius: '99px',
                fontSize: '12px',
                fontWeight: '600',
                background: getStatusBadge(partenaire.statut).bg,
                color: getStatusBadge(partenaire.statut).color
              }}>
                {partenaire.statut}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                <span style={{ fontWeight: '500', color: '#1a1a2e' }}>Réf :</span> {partenaire.reference}
              </span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                <span style={{ fontWeight: '500', color: '#1a1a2e' }}>Formule :</span> {getFormuleIcon(partenaire.formule)} {partenaire.formule}
              </span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                <span style={{ fontWeight: '500', color: '#1a1a2e' }}>Type :</span> {partenaire.type_donateur}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Link
              href={`/partenaires/${partenaire.id}/modifier`}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: 'white',
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#7B1D5A';
                e.currentTarget.style.color = '#7B1D5A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              <Edit size={16} />
              Modifier
            </Link>
            <button
              onClick={handleDelete}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: 'white',
                color: '#ef4444',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <Trash2 size={16} />
              Supprimer
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        background: 'white',
        borderRadius: '12px',
        padding: '4px',
        border: '0.5px solid #e8e5e0',
        marginBottom: '20px'
      }}>
        {[
          { id: 'info', label: 'Informations', icon: User },
          { id: 'historique', label: 'Historique', icon: History },
          { id: 'notes', label: 'Notes', icon: MessageSquare },
        ].map((tab) => {
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
                transition: 'all 0.2s'
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenu des tabs */}
      {activeTab === 'info' && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '0.5px solid #e8e5e0'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <User size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Informations personnelles
              </h4>
              <div style={{ spaceY: '8px' }}>
                <p><span style={{ color: '#6b7280' }}>Nom :</span> {partenaire.nom}</p>
                <p><span style={{ color: '#6b7280' }}>Prénoms :</span> {partenaire.prenoms}</p>
                <p><span style={{ color: '#6b7280' }}>Genre :</span> {partenaire.genre || 'Non précisé'}</p>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <Phone size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Contact
              </h4>
              <div style={{ spaceY: '8px' }}>
                <p><span style={{ color: '#6b7280' }}>Téléphone :</span> {partenaire.telephone}</p>
                {partenaire.whatsapp && <p><span style={{ color: '#6b7280' }}>WhatsApp :</span> {partenaire.whatsapp}</p>}
                <p><span style={{ color: '#6b7280' }}>Email :</span> <a href={`mailto:${partenaire.email}`} style={{ color: '#7B1D5A', textDecoration: 'none' }}>{partenaire.email}</a></p>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <MapPin size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Localisation
              </h4>
              <div style={{ spaceY: '8px' }}>
                <p><span style={{ color: '#6b7280' }}>Pays :</span> {partenaire.pays}</p>
                <p><span style={{ color: '#6b7280' }}>Ville :</span> {partenaire.ville}</p>
                <p><span style={{ color: '#6b7280' }}>Adresse :</span> {partenaire.adresse}</p>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Informations d'inscription
              </h4>
              <div style={{ spaceY: '8px' }}>
                <p><span style={{ color: '#6b7280' }}>Date :</span> {new Date(partenaire.created_at).toLocaleDateString('fr-FR')}</p>
                <p><span style={{ color: '#6b7280' }}>Heure :</span> {new Date(partenaire.created_at).toLocaleTimeString('fr-FR')}</p>
                <p><span style={{ color: '#6b7280' }}>Dernière mise à jour :</span> {new Date(partenaire.updated_at).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </div>

          {/* Changement de statut */}
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Changer le statut</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={partenaire.statut === status}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '99px',
                    border: '1px solid',
                    borderColor: partenaire.statut === status ? '#7B1D5A' : '#e5e7eb',
                    background: partenaire.statut === status ? '#fdf5fb' : 'white',
                    color: partenaire.statut === status ? '#7B1D5A' : '#6b7280',
                    cursor: partenaire.statut === status ? 'default' : 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    opacity: partenaire.statut === status ? 0.7 : 1
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'historique' && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '0.5px solid #e8e5e0'
        }}>
          <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <Clock size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Historique des changements
          </h4>
          {historique.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af' }}>
              Aucun historique disponible
            </div>
          ) : (
            <div style={{ spaceY: '12px' }}>
              {historique.map((h) => (
                <div
                  key={h.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: '#f9fafb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: '500' }}>
                      {h.ancien_statut} → {h.nouveau_statut}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    par {h.admin_username || 'Admin'} • {new Date(h.created_at).toLocaleString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '0.5px solid #e8e5e0'
        }}>
          <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <MessageSquare size={16} style={{ display: 'inline', marginRight: '8px' }} />
            Notes
          </h4>

          {/* Ajouter une note */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Ajouter une note..."
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                outline: 'none',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#7B1D5A'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
            />
            <button
              onClick={handleAddNote}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#7B1D5A',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#5e1644'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#7B1D5A'}
            >
              Ajouter
            </button>
          </div>

          {/* Liste des notes */}
          {notes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af' }}>
              Aucune note disponible
            </div>
          ) : (
            <div style={{ spaceY: '12px' }}>
              {notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: '#f9fafb',
                    border: '0.5px solid #e5e7eb'
                  }}
                >
                  <p style={{ margin: '0 0 8px 0', color: '#1a1a2e' }}>{note.contenu}</p>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {note.admin_username || 'Admin'} • {new Date(note.created_at).toLocaleString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}