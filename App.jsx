import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AttendanceRegister from './pages/AttendanceRegister';
import MemberManagement from './pages/MemberManagement';
import Reports from './pages/Reports';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333',
          },
        }} />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout><Dashboard /></Layout>} path="/" />
            <Route element={<Layout><AttendanceRegister /></Layout>} path="/attendance" />
            <Route element={<Layout><MemberManagement /></Layout>} path="/members" />
            <Route element={<Layout><Reports /></Layout>} path="/reports" />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
