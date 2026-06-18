'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Tableau de bord', icon: '📊' },
    { href: '/partenaires', label: 'Partenaires', icon: '👥' },
    { href: '/administrateurs', label: 'Administrateurs', icon: '👤' },
    { href: '/statistiques', label: 'Statistiques', icon: '📈' },
    { href: '/parametres', label: 'Paramètres', icon: '⚙️' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    window.location.href = '/login';
  };

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      {/* Logo */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: '#7B1D5A',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            CDG
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '14px' }}>
              Club de la Grâce
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af' }}>
              CRM Administratif
            </div>
          </div>
        </div>
        {/* Bouton fermer - mobile */}
        <button
          onClick={onClose}
          style={{
            display: 'none',
            padding: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
            borderRadius: '8px'
          }}
          className="close-sidebar"
        >
          <X size={24} />
        </button>
      </div>

      {/* Menu */}
      <nav style={{
        flex: 1,
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto'
      }}>
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: active ? '#7B1D5A' : '#6b7280',
                background: active ? '#fdf5fb' : 'transparent',
                fontSize: '14px',
                fontWeight: active ? '600' : '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Déconnexion */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid #e5e7eb',
        flexShrink: 0
      }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            width: '100%',
            borderRadius: '8px',
            border: 'none',
            background: 'transparent',
            color: '#6b7280',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fef2f2';
            e.currentTarget.style.color = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          <span style={{ fontSize: '20px' }}>🚪</span>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;