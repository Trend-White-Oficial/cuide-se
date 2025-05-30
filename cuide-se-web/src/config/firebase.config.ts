// Importações necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Configuração do Firebase para o projeto Cuide-Se
 * Todas as credenciais são carregadas através de variáveis de ambiente
 * para garantir segurança e facilidade de deploy em diferentes ambientes
 */
export const firebaseConfig = {
  // Chave de API principal do projeto Firebase
  // Utilizada para autenticação e acesso aos serviços
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  
  // Domínio de autenticação
  // Usado para redirecionamento após login
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  
  // ID único do projeto Firebase
  // Utilizado para identificar o projeto nos serviços
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  
  // Bucket de armazenamento
  // Utilizado para armazenamento de arquivos (imagens, documentos, etc.)
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  
  // ID do remetente para mensagens
  // Utilizado para envio de notificações push
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  
  // ID da aplicação
  // Identificador único da aplicação no Firebase
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  
  // ID de medição para analytics
  // Utilizado para rastreamento de métricas e eventos
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Inicializa o Firebase com as configurações
// Esta inicialização é necessária para que todos os serviços funcionem
export const app = initializeApp(firebaseConfig);

// Inicializa o Analytics
// Permite o rastreamento de métricas e eventos do aplicativo
export const analytics = getAnalytics(app);

// Inicializa os serviços do Firebase
// Cada serviço é exportado separadamente para ser usado onde necessário
export const auth = getAuth(app);      // Serviço de autenticação
export const db = getFirestore(app);   // Serviço de banco de dados
export const storage = getStorage(app); // Serviço de armazenamento

/**
 * Função para verificar se o Firebase está inicializado corretamente
 * @returns {boolean} - true se o Firebase estiver inicializado
 */
export const isFirebaseInitialized = () => {
  return app && auth && db && storage;
};
