import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Discover from './pages/Discover';
import AIMatch from './pages/AIMatch';
import Community from './pages/Community';
import Meetups from './pages/Meetups';
import WorkspaceDetail from './pages/WorkspaceDetail';

// Mock auth context — in production, replace with Firebase Auth
const AuthContext = React.createContext(null);
export const useAuth = () => React.useContext(AuthContext);

function App() {
  const [user, setUser] = useState({
    id: 'user_demo',
    displayName: 'You',
    skills: ['React', 'Node.js'],
    isCheckedIn: false,
    currentLocation: null,
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <div className="page-bg">
          {/* Ambient glow orbs */}
          <div className="glow-orb glow-orb-1" />
          <div className="glow-orb glow-orb-2" />
          <div className="glow-orb glow-orb-3" />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/match" element={<AIMatch />} />
              <Route path="/community" element={<Community />} />
              <Route path="/meetups" element={<Meetups />} />
              <Route path="/workspace/:id" element={<WorkspaceDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
