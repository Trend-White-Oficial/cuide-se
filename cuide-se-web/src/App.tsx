import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FinancialManagement from './pages/FinancialManagement';
import InventoryManagement from './pages/InventoryManagement';
import OrdersManagement from './pages/OrdersManagement';
import Reports from './pages/Reports';
import ServicePackages from './pages/ServicePackages';
import LoyaltyProgram from './pages/LoyaltyProgram';
import ProfessionalsManagement from './pages/ProfessionalsManagement';
import Settings from './pages/Settings';
import ClientsManagement from './pages/ClientsManagement';
import ServicesManagement from './pages/ServicesManagement';
import UsersManagement from './pages/UsersManagement';

// Contextos
import { FinancialProvider } from './contexts/FinancialContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { OrdersProvider } from './contexts/OrdersContext';
import { SettingsProvider } from './contexts/SettingsContext';

// Componente principal da aplicação
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <FinancialProvider>
          <InventoryProvider>
            <OrdersProvider>
              <SettingsProvider>
                <Router>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <AdminLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Dashboard />} />
                      <Route path="financial" element={<FinancialManagement />} />
                      <Route path="inventory" element={<InventoryManagement />} />
                      <Route path="orders" element={<OrdersManagement />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="service-packages" element={<ServicePackages />} />
                      <Route path="loyalty-program" element={<LoyaltyProgram />} />
                      <Route path="professionals" element={<ProfessionalsManagement />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="clients" element={<ClientsManagement />} />
                      <Route path="services" element={<ServicesManagement />} />
                      <Route path="users" element={<UsersManagement />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Router>
              </SettingsProvider>
            </OrdersProvider>
          </InventoryProvider>
        </FinancialProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
