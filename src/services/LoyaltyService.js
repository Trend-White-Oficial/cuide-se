class LoyaltyService {
  constructor() {
    this.pointsPerService = 10; // Pontos base por serviço
    this.pointsMultiplier = {
      bronze: 1,
      silver: 1.5,
      gold: 2,
      platinum: 2.5
    };
  }

  // Níveis e requisitos
  static levels = {
    bronze: {
      name: 'Bronze',
      requiredPoints: 0,
      benefits: ['Desconto de 5% em serviços selecionados']
    },
    silver: {
      name: 'Prata',
      requiredPoints: 100,
      benefits: ['Desconto de 10% em todos os serviços', '1 serviço grátis a cada 5 agendamentos']
    },
    gold: {
      name: 'Ouro',
      requiredPoints: 500,
      benefits: ['Desconto de 15% em todos os serviços', '2 serviços grátis a cada 5 agendamentos', 'Acesso a serviços exclusivos']
    },
    platinum: {
      name: 'Platina',
      requiredPoints: 1000,
      benefits: ['Desconto de 20% em todos os serviços', '3 serviços grátis a cada 5 agendamentos', 'Acesso a serviços exclusivos', 'Agendamento prioritário']
    }
  };

  // Calcula pontos para um serviço
  calculatePoints(service, userLevel) {
    const basePoints = this.pointsPerService;
    const multiplier = this.pointsMultiplier[userLevel] || 1;
    return Math.floor(basePoints * multiplier);
  }

  // Atualiza pontos do usuário
  async addPoints(userId, points) {
    try {
      // Busca usuário atual
      const user = await this.getUser(userId);
      
      // Calcula novos pontos
      const newPoints = user.points + points;
      
      // Atualiza nível se necessário
      const newLevel = this.calculateLevel(newPoints);
      
      // Atualiza usuário
      await this.updateUser(userId, {
        points: newPoints,
        level: newLevel
      });

      return {
        points: newPoints,
        level: newLevel,
        pointsAdded: points
      };
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error);
      throw error;
    }
  }

  // Calcula nível baseado nos pontos
  calculateLevel(points) {
    const levels = Object.entries(LoyaltyService.levels)
      .sort((a, b) => b[1].requiredPoints - a[1].requiredPoints);

    for (const [level, data] of levels) {
      if (points >= data.requiredPoints) {
        return level;
      }
    }

    return 'bronze';
  }

  // Busca recompensas disponíveis
  async getAvailableRewards(userId) {
    try {
      const user = await this.getUser(userId);
      const level = user.level;
      
      return LoyaltyService.levels[level].benefits;
    } catch (error) {
      console.error('Erro ao buscar recompensas:', error);
      throw error;
    }
  }

  // Resgata uma recompensa
  async redeemReward(userId, rewardId) {
    try {
      const user = await this.getUser(userId);
      const reward = await this.getReward(rewardId);

      if (!this.canRedeemReward(user, reward)) {
        throw new Error('Recompensa não disponível para resgate');
      }

      // Processa o resgate
      await this.processRewardRedemption(userId, rewardId);

      return {
        success: true,
        reward
      };
    } catch (error) {
      console.error('Erro ao resgatar recompensa:', error);
      throw error;
    }
  }

  // Verifica se usuário pode resgatar recompensa
  canRedeemReward(user, reward) {
    return user.points >= reward.requiredPoints;
  }

  // Busca usuário (simulado - deve ser implementado com sua lógica de banco de dados)
  async getUser(userId) {
    // Implementar busca no banco de dados
    return {
      id: userId,
      points: 0,
      level: 'bronze'
    };
  }

  // Atualiza usuário (simulado - deve ser implementado com sua lógica de banco de dados)
  async updateUser(userId, data) {
    // Implementar atualização no banco de dados
    return {
      id: userId,
      ...data
    };
  }

  // Busca recompensa (simulado - deve ser implementado com sua lógica de banco de dados)
  async getReward(rewardId) {
    // Implementar busca no banco de dados
    return {
      id: rewardId,
      name: 'Serviço Grátis',
      requiredPoints: 100
    };
  }

  // Processa resgate de recompensa (simulado - deve ser implementado com sua lógica de banco de dados)
  async processRewardRedemption(userId, rewardId) {
    // Implementar processamento no banco de dados
    return true;
  }
}

export default new LoyaltyService(); 