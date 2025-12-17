import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Statements from './pages/Statements';
import Transfer from './pages/Transfer';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAccounts from './pages/AdminAccounts';
import AdminTransactions from './pages/AdminTransactions';
import Support from './pages/Support';
import AdminSupport from './pages/AdminSupport';

const LayoutRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  ) : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/dashboard" element={
              <LayoutRoute>
                <Dashboard />
              </LayoutRoute>
            } />

            <Route path="/transfer" element={
              <LayoutRoute>
                <Transfer />
              </LayoutRoute>
            } />

            <Route path="/transactions/:accountNumber" element={
              <LayoutRoute>
                <Transactions />
              </LayoutRoute>
            } />
            <Route path="/transactions" element={
              <LayoutRoute>
                <Transactions />
              </LayoutRoute>
            } />

            {/* Placeholder routes for sidebar links */}
            <Route path="/accounts" element={
              <LayoutRoute>
                <Accounts />
              </LayoutRoute>
            } />
            <Route path="/statements" element={
              <LayoutRoute>
                <Statements />
              </LayoutRoute>
            } />
            <Route path="/transactions/:accountNumber" element={
              <LayoutRoute>
                <Transactions />
              </LayoutRoute>
            } />
            <Route path="/cards" element={
              <LayoutRoute>
                <Dashboard />
              </LayoutRoute>
            } />
            <Route path="/settings" element={
              <LayoutRoute>
                <Dashboard />
              </LayoutRoute>
            } />
            <Route path="/profile" element={
              <LayoutRoute>
                <Profile />
              </LayoutRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <LayoutRoute>
                <AdminDashboard />
              </LayoutRoute>
            } />
            <Route path="/admin/users" element={
              <LayoutRoute>
                <AdminUsers />
              </LayoutRoute>
            } />
            <Route path="/admin/accounts" element={
              <LayoutRoute>
                <AdminAccounts />
              </LayoutRoute>
            } />
            <Route path="/admin/transactions" element={
              <LayoutRoute>
                <AdminTransactions />
              </LayoutRoute>
            } />
            <Route path="/admin/support" element={
              <LayoutRoute>
                <AdminSupport />
              </LayoutRoute>
            } />

            {/* Common Routes */}
            <Route path="/support" element={
              <LayoutRoute>
                <Support />
              </LayoutRoute>
            } />

            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
