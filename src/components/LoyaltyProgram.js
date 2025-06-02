import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LoyaltyService from '../services/LoyaltyService';
import AccessibleButton from './AccessibleButton';
import { accessibilityConfig } from '../config/accessibility';

const LoyaltyProgram = ({ userId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [availableRewards, setAvailableRewards] = useState([]);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const user = await LoyaltyService.getUser(userId);
      const rewards = await LoyaltyService.getAvailableRewards(userId);
      
      setUserData(user);
      setAvailableRewards(rewards);
    } catch (error) {
      setError(t('Erro ao carregar dados do programa de fidelidade.'));
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async (rewardId) => {
    try {
      setLoading(true);
      const result = await LoyaltyService.redeemReward(userId, rewardId);
      
      if (result.success) {
        // Recarrega dados do usuário
        await loadUserData();
      }
    } catch (error) {
      setError(t('Erro ao resgatar recompensa. Por favor, tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: accessibilityConfig.spacing.medium }}>
        {t('Carregando...')}
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: accessibilityConfig.spacing.medium,
          color: accessibilityConfig.colors.error
        }}
      >
        {error}
      </div>
    );
  }

  const currentLevel = LoyaltyService.levels[userData.level];
  const nextLevel = Object.entries(LoyaltyService.levels)
    .find(([level, data]) => data.requiredPoints > userData.points);

  return (
    <div
      style={{
        padding: accessibilityConfig.spacing.medium,
        backgroundColor: accessibilityConfig.colors.background,
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <h2 style={{ fontSize: accessibilityConfig.typography.large }}>
        {t('Programa de Fidelidade')}
      </h2>

      <div style={{ marginBottom: accessibilityConfig.spacing.medium }}>
        <h3 style={{ fontSize: accessibilityConfig.typography.medium }}>
          {t('Seu Status')}
        </h3>
        <p>{t('Nível Atual')}: {t(currentLevel.name)}</p>
        <p>{t('Pontos')}: {userData.points}</p>
        
        {nextLevel && (
          <p>
            {t('Próximo Nível')}: {t(nextLevel[1].name)} - {t('Faltam')} {nextLevel[1].requiredPoints - userData.points} {t('pontos')}
          </p>
        )}
      </div>

      <div style={{ marginBottom: accessibilityConfig.spacing.medium }}>
        <h3 style={{ fontSize: accessibilityConfig.typography.medium }}>
          {t('Benefícios Disponíveis')}
        </h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {currentLevel.benefits.map((benefit, index) => (
            <li
              key={index}
              style={{
                padding: accessibilityConfig.spacing.small,
                marginBottom: accessibilityConfig.spacing.small,
                backgroundColor: accessibilityConfig.colors.background,
                borderRadius: '4px',
                border: `1px solid ${accessibilityConfig.colors.primary}`
              }}
            >
              {t(benefit)}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 style={{ fontSize: accessibilityConfig.typography.medium }}>
          {t('Recompensas Disponíveis')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: accessibilityConfig.spacing.small }}>
          {availableRewards.map((reward, index) => (
            <div
              key={index}
              style={{
                padding: accessibilityConfig.spacing.medium,
                backgroundColor: accessibilityConfig.colors.background,
                borderRadius: '4px',
                border: `1px solid ${accessibilityConfig.colors.secondary}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <p style={{ margin: 0 }}>{t(reward.name)}</p>
                <p style={{ margin: 0, fontSize: accessibilityConfig.typography.small }}>
                  {t('Custo')}: {reward.requiredPoints} {t('pontos')}
                </p>
              </div>
              <AccessibleButton
                onClick={() => handleRedeemReward(reward.id)}
                disabled={loading || userData.points < reward.requiredPoints}
                ariaLabel={t('Resgatar recompensa')}
              >
                {t('Resgatar')}
              </AccessibleButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgram; 