import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useStore } from './store/useStore';
import { trackPageView } from './utils/supabaseApi';

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const Workbench = lazy(() => import('./pages/Workbench').then((module) => ({ default: module.Workbench })));
const Profile = lazy(() => import('./pages/Profile').then((module) => ({ default: module.Profile })));
const QuestionBank = lazy(() => import('./pages/QuestionBank').then((module) => ({ default: module.QuestionBank })));
const WrongBook = lazy(() => import('./pages/WrongBook').then((module) => ({ default: module.WrongBook })));
const Challenge = lazy(() => import('./pages/Challenge').then((module) => ({ default: module.Challenge })));
const ChallengeSetup = lazy(() => import('./pages/ChallengeSetup').then((module) => ({ default: module.ChallengeSetup })));
const Favorites = lazy(() => import('./pages/Favorites').then((module) => ({ default: module.Favorites })));
const CheckIn = lazy(() => import('./pages/CheckIn').then((module) => ({ default: module.CheckIn })));
const Login = lazy(() => import('./pages/Login').then((module) => ({ default: module.Login })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
const Stats = lazy(() => import('./pages/Stats').then((module) => ({ default: module.Stats })));
const Community = lazy(() => import('./pages/Community').then((module) => ({ default: module.Community })));
const AlgoHot100 = lazy(() => import('./pages/AlgoHot100').then((module) => ({ default: module.AlgoHot100 })));
const HotwordHub = lazy(() => import('./pages/HotwordHub').then((module) => ({ default: module.HotwordHub })));
const BehaviorTreeExplainer = lazy(() => import('./pages/hotwords/BehaviorTreeExplainer').then((module) => ({ default: module.BehaviorTreeExplainer })));
const ECSExplainer = lazy(() => import('./pages/hotwords/ECSExplainer').then((module) => ({ default: module.ECSExplainer })));
const FSMExplainer = lazy(() => import('./pages/hotwords/FSMExplainer').then((module) => ({ default: module.FSMExplainer })));
const ObserverExplainer = lazy(() => import('./pages/hotwords/ObserverExplainer').then((module) => ({ default: module.ObserverExplainer })));
const SingletonExplainer = lazy(() => import('./pages/hotwords/SingletonExplainer').then((module) => ({ default: module.SingletonExplainer })));
const ObjectPoolExplainer = lazy(() => import('./pages/hotwords/ObjectPoolExplainer').then((module) => ({ default: module.ObjectPoolExplainer })));
const VectorMathExplainer = lazy(() => import('./pages/hotwords/VectorMathExplainer').then((module) => ({ default: module.VectorMathExplainer })));
const RenderingPipelineExplainer = lazy(() => import('./pages/hotwords/RenderingPipelineExplainer').then((module) => ({ default: module.RenderingPipelineExplainer })));
const AABBExplainer = lazy(() => import('./pages/hotwords/AABBExplainer'));
const FactoryExplainer = lazy(() => import('./pages/hotwords/FactoryExplainer'));
const GCExplainer = lazy(() => import('./pages/hotwords/GCExplainer'));
const HeapStackExplainer = lazy(() => import('./pages/hotwords/HeapStackExplainer'));
const LODExplainer = lazy(() => import('./pages/hotwords/LODExplainer'));
const QuaternionExplainer = lazy(() => import('./pages/hotwords/QuaternionExplainer'));
const CoroutineExplainer = lazy(() => import('./pages/hotwords/CoroutineExplainer'));
const ReflectionExplainer = lazy(() => import('./pages/hotwords/ReflectionExplainer'));
const VTableExplainer = lazy(() => import('./pages/hotwords/VTableExplainer'));
const ShaderExplainer = lazy(() => import('./pages/hotwords/ShaderExplainer'));

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
      <Suspense
        fallback={(
          <div className="min-h-[50vh] flex items-center justify-center text-[var(--color-text-secondary)]">
            页面加载中...
          </div>
        )}
      >
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
            <Route path="/challenge/hot100" element={<AlgoHot100 />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/community" element={<Community />} />
            <Route path="/hotwords" element={<HotwordHub />} />
            <Route path="/hotwords/behavior-tree" element={<BehaviorTreeExplainer />} />
            <Route path="/hotwords/ecs" element={<ECSExplainer />} />
            <Route path="/hotwords/fsm" element={<FSMExplainer />} />
            <Route path="/hotwords/observer" element={<ObserverExplainer />} />
            <Route path="/hotwords/singleton" element={<SingletonExplainer />} />
            <Route path="/hotwords/object-pool" element={<ObjectPoolExplainer />} />
            <Route path="/hotwords/vector-math" element={<VectorMathExplainer />} />
            <Route path="/hotwords/rendering-pipeline" element={<RenderingPipelineExplainer />} />
            <Route path="/hotwords/factory" element={<FactoryExplainer />} />
            <Route path="/hotwords/gc" element={<GCExplainer />} />
            <Route path="/hotwords/heap-stack" element={<HeapStackExplainer />} />
            <Route path="/hotwords/aabb" element={<AABBExplainer />} />
            <Route path="/hotwords/lod" element={<LODExplainer />} />
            <Route path="/hotwords/quaternion" element={<QuaternionExplainer />} />
            <Route path="/hotwords/coroutine" element={<CoroutineExplainer />} />
            <Route path="/hotwords/reflection" element={<ReflectionExplainer />} />
            <Route path="/hotwords/vtable" element={<VTableExplainer />} />
            <Route path="/hotwords/shader" element={<ShaderExplainer />} />
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
