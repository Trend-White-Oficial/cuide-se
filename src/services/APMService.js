import { initializeApp } from 'firebase/app';
import { getPerformance, trace } from 'firebase/performance';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

class APMService {
  constructor() {
    this.performance = getPerformance();
    this.analytics = getAnalytics();
    this.db = getFirestore();
  }

  // Métricas de Performance
  async trackPageLoad(pageName) {
    const pageLoadTrace = trace(this.performance, `page_load_${pageName}`);
    pageLoadTrace.start();

    window.addEventListener('load', () => {
      pageLoadTrace.stop();
      this.logMetric('page_load', {
        page: pageName,
        duration: pageLoadTrace.duration,
        timestamp: new Date()
      });
    });
  }

  async trackApiPerformance(endpoint, method, duration, status) {
    const apiTrace = trace(this.performance, `api_${method}_${endpoint}`);
    apiTrace.start();

    try {
      // Simula a chamada da API
      await new Promise(resolve => setTimeout(resolve, duration));
      
      apiTrace.stop();
      this.logMetric('api_performance', {
        endpoint,
        method,
        duration: apiTrace.duration,
        status,
        timestamp: new Date()
      });
    } catch (error) {
      apiTrace.stop();
      this.logMetric('api_error', {
        endpoint,
        method,
        error: error.message,
        duration: apiTrace.duration,
        timestamp: new Date()
      });
    }
  }

  async trackUserInteraction(action, data) {
    const interactionTrace = trace(this.performance, `user_interaction_${action}`);
    interactionTrace.start();

    try {
      // Simula a interação do usuário
      await new Promise(resolve => setTimeout(resolve, 100));
      
      interactionTrace.stop();
      logEvent(this.analytics, action, {
        ...data,
        duration: interactionTrace.duration
      });
    } catch (error) {
      interactionTrace.stop();
      this.logMetric('interaction_error', {
        action,
        error: error.message,
        duration: interactionTrace.duration,
        timestamp: new Date()
      });
    }
  }

  // Métricas de Recursos
  async trackResourceUsage() {
    if (window.performance && window.performance.memory) {
      const memory = window.performance.memory;
      this.logMetric('memory_usage', {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        timestamp: new Date()
      });
    }

    if (window.performance && window.performance.getEntriesByType) {
      const resources = window.performance.getEntriesByType('resource');
      resources.forEach(resource => {
        this.logMetric('resource_load', {
          name: resource.name,
          duration: resource.duration,
          size: resource.transferSize,
          type: resource.initiatorType,
          timestamp: new Date()
        });
      });
    }
  }

  // Métricas de Erro
  async trackError(error, context) {
    this.logMetric('error', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date()
    });
  }

  // Métricas de Negócio
  async trackBusinessMetric(name, value, tags = {}) {
    this.logMetric('business', {
      name,
      value,
      tags,
      timestamp: new Date()
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

export default new APMService(); 