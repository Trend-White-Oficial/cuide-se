// Configuração do Firebase para o projeto Cuide-Se
// Importa as funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Configuração do Firebase para o projeto
 * Todas as credenciais são carregadas através de variáveis de ambiente
 * para garantir segurança e facilidade de deploy em diferentes ambientes
 */
export const firebaseConfig = {
  // Chave de API do projeto Firebase
  apiKey: process.env.AIzaSyD1bhaSX9ubSJyWKALNqREuCyO7LFltl1g,
  
  // Domínio de autenticação
  authDomain: process.env.cuida-se.firebaseapp.com,
  
  // ID do projeto
  projectId: process.env.cuida-se,
  
  // Bucket de armazenamento
  storageBucket: process.env.cuida-se.firebasestorage.app,
  
  // ID do remetente para mensagens
  messagingSenderId: process.env.647513724546,
  
  // ID da aplicação
  appId: process.env.1:647513724546:web:fe6526976b5cc92c94469b,
  
  // ID de medição para analytics
  measurementId: process.env.G-53E49M4GQ3,
};

// Inicializa o Firebase com as configurações
export const app = initializeApp(firebaseConfig);

// Inicializa o Analytics
export const analytics = getAnalytics(app);

// Inicializa os serviços do Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * Função para verificar se o Firebase está inicializado corretamente
 * @returns {boolean} - true se o Firebase estiver inicializado
 */
export const isFirebaseInitialized = () => {
  try {
    return !!app.name;
  } catch (error) {
    console.error('Erro ao verificar inicialização do Firebase:', error);
    return false;
  }
};
