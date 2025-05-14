
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import NotFound from './pages/NotFound';

// Componente principal da aplicação
function App() {
  return (
    <Router>
      <Routes>
        {/* Rota principal */}
        <Route path="/" element={<HomeScreen />} />
        {/* Rota para página não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
