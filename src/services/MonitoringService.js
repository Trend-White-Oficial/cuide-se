import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

class MonitoringService {
  constructor() {
    this.performance = getPerformance();
    this.analytics = getAnalytics();
    this.db = getFirestore();
  }

  // Métricas de Performance
  async trackPageLoad(pageName) {
    const trace = this.performance.trace(`page_load_${pageName}`);
    trace.start();
    
    window.addEventListener('load', () => {
      trace.stop();
      this.logMetric('page_load', {
        page: pageName,
        duration: trace.duration
      });
    });
  }

  async trackApiCall(endpoint, method, duration, status) {
    this.logMetric('api_call', {
      endpoint,
      method,
      duration,
      status
    });
  }

  // Métricas de Negócio
  async trackUserAction(action, data) {
    logEvent(this.analytics, action, data);
  }

  async trackError(error, context) {
    this.logMetric('error', {
      message: error.message,
      stack: error.stack,
      context
    });
  }

  // Logs
  async logMetric(type, data) {
    try {
      await addDoc(collection(this.db, 'metrics'), {
        type,
        data,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Erro ao registrar métrica:', error);
    }
  }

  async getMetrics(type, startDate, endDate) {
    try {
      const q = query(
        collection(this.db, 'metrics'),
        where('type', '==', type),
        where('timestamp', '>=', startDate),
        where('timestamp', '<=', endDate),
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      return [];
    }
  }

  // Alertas
  async checkThresholds(metric, value, threshold) {
    if (value > threshold) {
      await this.createAlert(metric, value, threshold);
    }
  }

  async createAlert(metric, value, threshold) {
    try {
      await addDoc(collection(this.db, 'alerts'), {
        metric,
        value,
        threshold,
        timestamp: new Date(),
        status: 'active'
      });
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
    }
  }

  async getActiveAlerts() {
    try {
      const q = query(
        collection(this.db, 'alerts'),
        where('status', '==', 'active'),
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      return [];
    }
  }
}

export default new MonitoringService(); 