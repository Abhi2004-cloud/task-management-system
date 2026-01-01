import React, { useEffect } from 'react';

export default function DebugAuth() {
  useEffect(() => {
    console.log('=== AUTH DEBUG INFO ===');
    console.log('Token in localStorage:', localStorage.getItem('token'));
    console.log('User in localStorage:', localStorage.getItem('user'));
  }, []);

  return null;
}

