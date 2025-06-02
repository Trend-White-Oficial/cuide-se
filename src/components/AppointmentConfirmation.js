import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import NotificationService from '../services/NotificationService';
import AccessibleButton from './AccessibleButton';
import { accessibilityConfig } from '../config/accessibility';

const AppointmentConfirmation = ({ appointment, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedChannels, setSelectedChannels] = useState({
    email: true,
    sms: true,
    push: true
  });

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      const channels = Object.entries(selectedChannels)
        .filter(([_, selected]) => selected)
        .map(([channel]) => channel);

      const results = await NotificationService.sendConfirmation(appointment, channels);
      
      const allSuccessful = Object.values(results).every(result => result);
      
      if (allSuccessful) {
        onConfirm(appointment);
      } else {
        setError(t('Algumas notificações não puderam ser enviadas. Por favor, tente novamente.'));
      }
    } catch (error) {
      setError(t('Erro ao enviar confirmações. Por favor, tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

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
        {t('Confirmar Agendamento')}
      </h2>

      <div style={{ marginBottom: accessibilityConfig.spacing.medium }}>
        <h3 style={{ fontSize: accessibilityConfig.typography.medium }}>
          {t('Detalhes do Agendamento')}
        </h3>
        <p>{t('Serviço')}: {appointment.service.name}</p>
        <p>{t('Profissional')}: {appointment.professional.name}</p>
        <p>{t('Data')}: {new Date(appointment.date).toLocaleDateString('pt-BR')}</p>
        <p>{t('Horário')}: {new Date(appointment.date).toLocaleTimeString('pt-BR')}</p>
      </div>

      <div style={{ marginBottom: accessibilityConfig.spacing.medium }}>
        <h3 style={{ fontSize: accessibilityConfig.typography.medium }}>
          {t('Canais de Notificação')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: accessibilityConfig.spacing.small }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: accessibilityConfig.spacing.small }}>
            <input
              type="checkbox"
              checked={selectedChannels.email}
              onChange={(e) => setSelectedChannels(prev => ({ ...prev, email: e.target.checked }))}
              aria-label={t('Notificação por email')}
            />
            {t('Email')}
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: accessibilityConfig.spacing.small }}>
            <input
              type="checkbox"
              checked={selectedChannels.sms}
              onChange={(e) => setSelectedChannels(prev => ({ ...prev, sms: e.target.checked }))}
              aria-label={t('Notificação por SMS')}
            />
            {t('SMS')}
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: accessibilityConfig.spacing.small }}>
            <input
              type="checkbox"
              checked={selectedChannels.push}
              onChange={(e) => setSelectedChannels(prev => ({ ...prev, push: e.target.checked }))}
              aria-label={t('Notificação push')}
            />
            {t('Push')}
          </label>
        </div>
      </div>

      {error && (
        <div
          style={{
            color: accessibilityConfig.colors.error,
            marginBottom: accessibilityConfig.spacing.medium
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: accessibilityConfig.spacing.medium }}>
        <AccessibleButton
          onClick={handleConfirm}
          disabled={loading}
          ariaLabel={t('Confirmar agendamento')}
        >
          {loading ? t('Enviando...') : t('Confirmar')}
        </AccessibleButton>
        <AccessibleButton
          onClick={onCancel}
          variant="secondary"
          disabled={loading}
          ariaLabel={t('Cancelar agendamento')}
        >
          {t('Cancelar')}
        </AccessibleButton>
      </div>
    </div>
  );
};

export default AppointmentConfirmation; 