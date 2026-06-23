// src/App.jsx
import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Box, Tabs, Tab } from '@mui/material';
import { logEvent } from './api/notifications';
import { AllNotifications, PriorityInbox } from './pages/NotificationsPage';

const Layout = () => {
  const location = useLocation();
  const [viewedSet, setViewedSet] = useState(new Set());

  const markAsViewed = useCallback((id) => {
    setViewedSet(prev => {
      const newSet = new Set(prev);
      if (!newSet.has(id)) {
        newSet.add(id);
        logEvent("ui_interaction", "info", `User viewed notification: ${id}`);
      }
      return newSet;
    });
  }, []);

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Campus Connect
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={location.pathname === '/' ? 0 : 1}>
            <Tab label="All Notifications" component={Link} to="/" />
            <Tab label="Priority Inbox" component={Link} to="/priority" />
          </Tabs>
        </Box>

        <Routes>
          <Route path="/" element={<AllNotifications viewedSet={viewedSet} markAsViewed={markAsViewed} />} />
          <Route path="/priority" element={<PriorityInbox viewedSet={viewedSet} markAsViewed={markAsViewed} />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
