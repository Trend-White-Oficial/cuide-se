import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Páginas
import Dashboard from './pages/Dashboard';
import FinancialManagement from './pages/FinancialManagement';
import InventoryManagement from './pages/InventoryManagement';
import OrdersManagement from './pages/OrdersManagement';
import Reports from './pages/Reports';
import ServicePackages from './pages/ServicePackages';
import LoyaltyProgram from './pages/LoyaltyProgram';
import ProfessionalsManagement from './pages/ProfessionalsManagement';
import Settings from './pages/Settings';

// Contextos
import { AuthProvider } from './contexts/AuthContext';
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
                    <Route path="/" element={<AdminLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="financial" element={<FinancialManagement />} />
                      <Route path="inventory" element={<InventoryManagement />} />
                      <Route path="orders" element={<OrdersManagement />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="packages" element={<ServicePackages />} />
                      <Route path="loyalty" element={<LoyaltyProgram />} />
                      <Route path="professionals" element={<ProfessionalsManagement />} />
                      <Route path="settings" element={<Settings />} />
                    </Route>
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
