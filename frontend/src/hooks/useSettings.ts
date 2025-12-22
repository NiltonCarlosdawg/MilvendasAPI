import { useState, useEffect } from 'react';

export const useSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data); // O backend já retorna no formato { key: value }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { settings, loading };
};