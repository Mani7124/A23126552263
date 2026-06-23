// src/pages/NotificationsPage.jsx
import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Chip, Pagination, CircularProgress, Alert } from '@mui/material';
import { useNotifications } from '../hooks/useNotifications';
import { fetchPriorityBatch, logEvent } from '../api/notifications';
import NotificationFilter from '../components/NotificationFilter';

export const NotificationCard = ({ notification, isViewed, onClick }) => {
  const getChipColor = (type) => {
    switch(type) {
      case 'Placement': return 'success';
      case 'Result': return 'warning';
      case 'Event': return 'info';
      default: return 'default';
    }
  };

  return (
    <Card 
      onClick={() => onClick(notification.ID)}
      sx={{ 
        mb: 2, cursor: 'pointer', transition: '0.3s',
        borderLeft: isViewed ? '4px solid #ccc' : '4px solid #1976d2',
        backgroundColor: isViewed ? '#f9f9f9' : '#ffffff',
        '&:hover': { boxShadow: 3 }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Chip label={notification.Type} color={getChipColor(notification.Type)} size="small" />
          {!isViewed && <Chip label="New" color="error" size="small" sx={{ height: 20, fontSize: '0.7rem' }} />}
        </Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: isViewed ? 'normal' : 'bold' }}>
          {notification.Message}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(notification.Timestamp).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const AllNotifications = ({ viewedSet, markAsViewed }) => {
  const [page, setPage] = useState(1);
  const { notifications, loading, error } = useNotifications(10, page);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>All Notifications</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
      ) : (
        <>
          {notifications.map(notif => (
            <NotificationCard key={notif.ID} notification={notif} isViewed={viewedSet.has(notif.ID)} onClick={markAsViewed} />
          ))}
          <Box display="flex" justifyContent="center" mt={3} mb={5}>
            <Pagination count={5} page={page} onChange={(e, val) => setPage(val)} color="primary" />
          </Box>
        </>
      )}
    </Box>
  );
};

export const PriorityInbox = ({ viewedSet, markAsViewed }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [topN, setTopN] = useState(10);
  const [filterType, setFilterType] = useState('All');
  const PRIORITY_WEIGHTS = { "Placement": 3, "Result": 2, "Event": 1 };

  useEffect(() => {
    const fetchAndSort = async () => {
      setLoading(true);
      setError(null);
      try {
        logEvent("priority_fetch", "info", `Fetching priority inbox. Limit: ${topN}`);
        const data = await fetchPriorityBatch();
        let rawNotifs = data.notifications || data;

        rawNotifs.sort((a, b) => {
          const weightA = PRIORITY_WEIGHTS[a.Type] || 0;
          const weightB = PRIORITY_WEIGHTS[b.Type] || 0;
          if (weightA !== weightB) return weightB - weightA;
          return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        });

        if (filterType !== 'All') {
          rawNotifs = rawNotifs.filter(n => n.Type === filterType);
        }
        setNotifications(rawNotifs.slice(0, topN));
      } catch (err) {
        logEvent("priority_api", "error", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAndSort();
  }, [topN, filterType]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Priority Inbox</Typography>
      <NotificationFilter topN={topN} setTopN={setTopN} filterType={filterType} setFilterType={setFilterType} />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
      ) : (
        notifications.map(notif => (
          <NotificationCard key={notif.ID} notification={notif} isViewed={viewedSet.has(notif.ID)} onClick={markAsViewed} />
        ))
      )}
    </Box>
  );
};
