'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  // Fermer la sidebar sur les écrans mobiles quand on clique sur le contenu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f0eb'
      }}>
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f0eb' }}>
      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 49,
            display: 'block'
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '260px',
        height: '100vh',
        zIndex: 50,
        background: 'white',
        borderRight: '1px solid #e5e7eb',
        overflowY: 'auto',
        overflowX: 'hidden',
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        boxShadow: isSidebarOpen ? '0 0 20px rgba(0,0,0,0.1)' : 'none'
      }}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Contenu principal */}
      <div style={{
        flex: 1,
        marginLeft: 0,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%'
      }}>
        {/* Header avec bouton menu mobile */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'white',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Contenu */}
        <main style={{
          flex: 1,
          padding: '16px',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}