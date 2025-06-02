import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

class LogService {
  constructor() {
    this.db = getFirestore();
    this.logLevels = {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
      FATAL: 4
    };
  }

  // Logs de Aplicação
  async log(level, message, data = {}) {
    try {
      await addDoc(collection(this.db, 'logs'), {
        level,
        message,
        data,
        timestamp: new Date(),
        environment: process.env.NODE_ENV
      });
    } catch (error) {
      console.error('Erro ao registrar log:', error);
    }
  }

  async debug(message, data) {
    await this.log('DEBUG', message, data);
  }

  async info(message, data) {
    await this.log('INFO', message, data);
  }

  async warn(message, data) {
    await this.log('WARN', message, data);
  }

  async error(message, data) {
    await this.log('ERROR', message, data);
  }

  async fatal(message, data) {
    await this.log('FATAL', message, data);
  }

  // Logs de Usuário
  async logUserAction(userId, action, data = {}) {
    try {
      await addDoc(collection(this.db, 'user_logs'), {
        userId,
        action,
        data,
        timestamp: new Date(),
        environment: process.env.NODE_ENV
      });
    } catch (error) {
      console.error('Erro ao registrar log de usuário:', error);
    }
  }

  // Logs de Sistema
  async logSystemEvent(event, data = {}) {
    try {
      await addDoc(collection(this.db, 'system_logs'), {
        event,
        data,
        timestamp: new Date(),
        environment: process.env.NODE_ENV
      });
    } catch (error) {
      console.error('Erro ao registrar log de sistema:', error);
    }
  }

  // Logs de Segurança
  async logSecurityEvent(event, data = {}) {
    try {
      await addDoc(collection(this.db, 'security_logs'), {
        event,
        data,
        timestamp: new Date(),
        environment: process.env.NODE_ENV
      });
    } catch (error) {
      console.error('Erro ao registrar log de segurança:', error);
    }
  }

  // Consulta de Logs
  async getLogs(type, startDate, endDate, level = null) {
    try {
      let q = query(
        collection(this.db, `${type}_logs`),
        where('timestamp', '>=', startDate),
        where('timestamp', '<=', endDate),
        orderBy('timestamp', 'desc')
      );

      if (level) {
        q = query(q, where('level', '==', level));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      return [];
    }
  }

  // Análise de Logs
  async analyzeLogs(type, startDate, endDate) {
    try {
      const logs = await this.getLogs(type, startDate, endDate);
      
      const analysis = {
        total: logs.length,
        byLevel: {},
        byHour: {},
        errors: [],
        warnings: []
      };

      logs.forEach(log => {
        // Análise por nível
        if (!analysis.byLevel[log.level]) {
          analysis.byLevel[log.level] = 0;
        }
        analysis.byLevel[log.level]++;

        // Análise por hora
        const hour = new Date(log.timestamp).getHours();
        if (!analysis.byHour[hour]) {
          analysis.byHour[hour] = 0;
        }
        analysis.byHour[hour]++;

        // Coleta de erros e avisos
        if (log.level === 'ERROR') {
          analysis.errors.push(log);
        } else if (log.level === 'WARN') {
          analysis.warnings.push(log);
        }
      });

      return analysis;
    } catch (error) {
      console.error('Erro ao analisar logs:', error);
      return null;
    }
  }

  // Limpeza de Logs
  async cleanupLogs(type, daysToKeep) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const q = query(
        collection(this.db, `${type}_logs`),
        where('timestamp', '<', cutoffDate)
      );

      const snapshot = await getDocs(q);
      const batch = this.db.batch();

      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error('Erro ao limpar logs:', error);
    }
  }
}

export default new LogService(); 