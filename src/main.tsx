import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

try {
  root.render(<App />);
} catch (error) {
  console.error('Error rendering app:', error);
  root.render(
    <div style={{ padding: '20px', color: 'red' }}>
      <h1>Erro ao carregar a aplicação</h1>
      <pre>{error instanceof Error ? error.message : String(error)}</pre>
    </div>
  );
}
