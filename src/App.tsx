import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Workbench } from './pages/Workbench';
import { Profile } from './pages/Profile';
import { QuestionBank } from './pages/QuestionBank';
import { WrongBook } from './pages/WrongBook';
import { Challenge } from './pages/Challenge';
import { ChallengeSetup } from './pages/ChallengeSetup';
import { Favorites } from './pages/Favorites';
import { CheckIn } from './pages/CheckIn';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { Stats } from './pages/Stats';
import { Community } from './pages/Community';
import { useStore } from './store/useStore';
import { trackPageView } from './utils/supabaseApi';

const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
};

function App() {
  const authUser = useStore((state) => state.authUser);

  const RequireAuth = ({ children, role }: { children: React.ReactNode; role?: 'admin' | 'user' }) => {
    const location = useLocation();
    if (!authUser) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    if (role && authUser.role !== role) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    return <>{children}</>;
  };

  return (
    <BrowserRouter basename="/interview-app">
      <PageViewTracker />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={(
            <RequireAuth>
              <Layout />
            </RequireAuth>
          )}
        >
          <Route path="/" element={<Home />} />
          <Route path="/question/:id" element={<Workbench />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/questions" element={<QuestionBank />} />
          <Route path="/wrong" element={<WrongBook />} />
          <Route path="/challenge" element={<ChallengeSetup />} />
          <Route path="/challenge/play" element={<Challenge />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/community" element={<Community />} />
          <Route
            path="/admin"
            element={(
              <RequireAuth role="admin">
                <AdminDashboard />
              </RequireAuth>
            )}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
