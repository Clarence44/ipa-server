import React, { useEffect } from 'react';

function Key() {
  useEffect(() => {
    const arr = window.location.search.split('?key=');
    if (arr.length === 2 && arr[1]) {
      window.localStorage.setItem('ACCESS_KEY', arr[1]);
    }
    window.location.href = '/';
  }, []);

  return <div></div>;
}

export default Key;
