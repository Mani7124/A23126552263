// src/hooks/useNotifications.js
import { useState, useEffect } from 'react';
import { fetchAllNotifications, logEvent } from '../api/notifications';

export const useNotifications = (limit = 10, page = 1) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        logEvent("fetch", "info", `Fetching page ${page}`);
        const data = await fetchAllNotifications(limit, page);
        setNotifications(data.notifications || data);
      } catch (err) {
        logEvent("api", "error", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [limit, page]);

  return { notifications, loading, error };
};