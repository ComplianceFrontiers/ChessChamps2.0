'use client'; // ✅ Required for using hooks in the App Router

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Correct hook for App Router

const Logout = () => {
  const [showPopup, setShowPopup] = useState(true);
  const router = useRouter();

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleOk = () => {
    // Optionally clear auth/session data
    // localStorage.removeItem('token');
    router.push('/dashboard'); // ✅ Redirect to dashboard
  };

  return (
    <div style={{ backgroundColor: 'white', color: 'black', minHeight: '100vh', padding: '2rem' }}>
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            textAlign: 'center',
            minWidth: '300px'
          }}>
            <h2>Are you sure you want to logout?</h2>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-around' }}>
              <button onClick={handleCancel} style={{ padding: '0.5rem 1.2rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleOk} style={{ padding: '0.5rem 1.2rem', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>OK</button>
            </div>
          </div>
        </div>
      )}
      <h1>Logout Page</h1>
      <p>You can trigger logout confirmation here.</p>
    </div>
  );
};

export default Logout;
