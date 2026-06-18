'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, Menu } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  return (
    <header style={{
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'white',
      minHeight: '60px',
      gap: '12px'
    }}>
      {/* Menu button - mobile */}
      <button
        onClick={onMenuClick}
        style={{
          display: 'block',
          padding: '8px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#1a1a2e',
          borderRadius: '8px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <Menu size={24} />
      </button>

      {/* Recherche */}
      <div style={{
        position: 'relative',
        flex: 1,
        maxWidth: '400px',
        display: 'none'
      }} className="search-container">
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
          placeholder="Rechercher..."
          style={{
            width: '100%',
            padding: '8px 12px 8px 40px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            outline: 'none',
            fontSize: '14px',
            background: '#f9fafb',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#7B1D5A';
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(123, 29, 90, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.background = '#f9fafb';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Profil */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
        <button style={{
          padding: '8px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#9ca3af',
          position: 'relative',
          borderRadius: '50%',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Bell size={20} />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            background: '#ef4444',
            borderRadius: '50%'
          }}></span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 8px 4px 4px',
          borderRadius: '8px',
          background: '#f9fafb',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: '#7B1D5A',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {admin?.nom?.charAt(0) || 'A'}
          </div>
          <div style={{ lineHeight: 1.3, display: 'none' }} className="admin-info">
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e' }}>
              {admin?.nom || 'Administrateur'}
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af' }}>
              {admin?.role || 'Administrateur'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;