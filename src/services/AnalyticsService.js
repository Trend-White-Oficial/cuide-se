import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

class AnalyticsService {
  constructor() {
    this.metrics = {
      appointments: {
        total: 0,
        completed: 0,
        cancelled: 0,
        noShow: 0
      },
      revenue: {
        total: 0,
        byService: {},
        byPeriod: {}
      },
      customers: {
        total: 0,
        new: 0,
        returning: 0,
        byLoyaltyLevel: {}
      },
      services: {
        mostPopular: [],
        averageRating: 0,
        byCategory: {}
      }
    };
  }

  // Métricas de Agendamentos
  async getAppointmentMetrics(startDate, endDate) {
    try {
      // Implementar busca no banco de dados
      const appointments = await this.fetchAppointments(startDate, endDate);
      
      const metrics = {
        total: appointments.length,
        completed: appointments.filter(a => a.status === 'completed').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
        noShow: appointments.filter(a => a.status === 'no_show').length,
        byDay: this.groupByDay(appointments),
        byService: this.groupByService(appointments)
      };

      return metrics;
    } catch (error) {
      console.error('Erro ao buscar métricas de agendamentos:', error);
      throw error;
    }
  }

  // Métricas de Receita
  async getRevenueMetrics(startDate, endDate) {
    try {
      // Implementar busca no banco de dados
      const transactions = await this.fetchTransactions(startDate, endDate);
      
      const metrics = {
        total: this.calculateTotalRevenue(transactions),
        byService: this.groupRevenueByService(transactions),
        byPeriod: this.groupRevenueByPeriod(transactions),
        trends: this.calculateRevenueTrends(transactions)
      };

      return metrics;
    } catch (error) {
      console.error('Erro ao buscar métricas de receita:', error);
      throw error;
    }
  }

  // Métricas de Clientes
  async getCustomerMetrics(startDate, endDate) {
    try {
      // Implementar busca no banco de dados
      const customers = await this.fetchCustomers(startDate, endDate);
      
      const metrics = {
        total: customers.length,
        new: customers.filter(c => this.isNewCustomer(c, startDate)).length,
        returning: customers.filter(c => !this.isNewCustomer(c, startDate)).length,
        byLoyaltyLevel: this.groupByLoyaltyLevel(customers),
        retention: this.calculateRetentionRate(customers)
      };

      return metrics;
    } catch (error) {
      console.error('Erro ao buscar métricas de clientes:', error);
      throw error;
    }
  }

  // Métricas de Serviços
  async getServiceMetrics(startDate, endDate) {
    try {
      // Implementar busca no banco de dados
      const services = await this.fetchServices(startDate, endDate);
      
      const metrics = {
        mostPopular: this.getMostPopularServices(services),
        averageRating: this.calculateAverageRating(services),
        byCategory: this.groupByCategory(services),
        trends: this.calculateServiceTrends(services)
      };

      return metrics;
    } catch (error) {
      console.error('Erro ao buscar métricas de serviços:', error);
      throw error;
    }
  }

  // Métodos auxiliares
  groupByDay(data) {
    return data.reduce((acc, item) => {
      const day = format(new Date(item.date), 'dd/MM/yyyy', { locale: ptBR });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
  }

  groupByService(data) {
    return data.reduce((acc, item) => {
      acc[item.serviceId] = (acc[item.serviceId] || 0) + 1;
      return acc;
    }, {});
  }

  calculateTotalRevenue(transactions) {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  }

  groupRevenueByService(transactions) {
    return transactions.reduce((acc, transaction) => {
      acc[transaction.serviceId] = (acc[transaction.serviceId] || 0) + transaction.amount;
      return acc;
    }, {});
  }

  groupRevenueByPeriod(transactions) {
    return transactions.reduce((acc, transaction) => {
      const period = format(new Date(transaction.date), 'MM/yyyy', { locale: ptBR });
      acc[period] = (acc[period] || 0) + transaction.amount;
      return acc;
    }, {});
  }

  calculateRevenueTrends(transactions) {
    // Implementar cálculo de tendências
    return {
      growth: 0,
      forecast: 0
    };
  }

  isNewCustomer(customer, startDate) {
    return new Date(customer.createdAt) >= new Date(startDate);
  }

  groupByLoyaltyLevel(customers) {
    return customers.reduce((acc, customer) => {
      acc[customer.loyaltyLevel] = (acc[customer.loyaltyLevel] || 0) + 1;
      return acc;
    }, {});
  }

  calculateRetentionRate(customers) {
    // Implementar cálculo de taxa de retenção
    return 0;
  }

  getMostPopularServices(services) {
    return services
      .sort((a, b) => b.appointments - a.appointments)
      .slice(0, 5);
  }

  calculateAverageRating(services) {
    const total = services.reduce((sum, service) => sum + service.rating, 0);
    return total / services.length;
  }

  groupByCategory(services) {
    return services.reduce((acc, service) => {
      acc[service.category] = (acc[service.category] || 0) + 1;
      return acc;
    }, {});
  }

  calculateServiceTrends(services) {
    // Implementar cálculo de tendências
    return {
      growth: 0,
      forecast: 0
    };
  }

  // Métodos de busca no banco de dados (simulados)
  async fetchAppointments(startDate, endDate) {
    // Implementar busca real no banco de dados
    return [];
  }

  async fetchTransactions(startDate, endDate) {
    // Implementar busca real no banco de dados
    return [];
  }

  async fetchCustomers(startDate, endDate) {
    // Implementar busca real no banco de dados
    return [];
  }

  async fetchServices(startDate, endDate) {
    // Implementar busca real no banco de dados
    return [];
  }
}

export default new AnalyticsService(); 