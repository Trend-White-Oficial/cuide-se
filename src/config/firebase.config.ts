// Configuração do Firebase para o projeto
// Todas as credenciais são carregadas através de variáveis de ambiente
// para garantir segurança e facilidade de deploy em diferentes ambientes

/**
 * Configuração do Firebase para o projeto
 * As credenciais são carregadas através de variáveis de ambiente
 * para garantir segurança e facilidade de deploy em diferentes ambientes
 */
export const firebaseConfig = {
  // Chave de API do projeto Firebase
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  
  // Domínio de autenticação
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  
  // ID do projeto
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  
  // Bucket de armazenamento
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  
  // ID do remetente para mensagens
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  
  // ID da aplicação
  appId: process.env.VITE_FIREBASE_APP_ID,
  
  // ID de medição para analytics
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};
