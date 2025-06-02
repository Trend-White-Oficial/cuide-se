import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReminderService from '../services/ReminderService';
import AccessibleButton from './AccessibleButton';
import { accessibilityConfig } from '../config/accessibility';

const ReminderSettings = ({ appointment, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    channels: ['email', 'sms', 'push'],
    intervals: ReminderService.defaultReminderSettings.intervals
  });

  const handleChannelToggle = (channel) => {
    setSettings(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const handleIntervalToggle = (interval) => {
    setSettings(prev => ({
      ...prev,
      intervals: prev.intervals.some(i => i.value === interval.value && i.unit === interval.unit)
        ? prev.intervals.filter(i => !(i.value === interval.value && i.unit === interval.unit))
        : [...prev.intervals, interval]
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      await ReminderService.updateReminderSettings(appointment.id, settings);
      onSave(settings);
    } catch (error) {
      setError(t('Erro ao salvar configurações de lembrete. Por favor, tente novamente.'));
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
        {t('Configurações de Lembrete')}
      </h2>

      <div style={{ marginBottom: accessibilityConfig.spacing.medium }}>
        <h3 style={{ fontSize: accessibilityConfig.typography.medium }}>
          {t('Canais de Notificação')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: accessibilityConfig.spacing.small }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: accessibilityConfig.spacing.small }}>
            <input
              type="checkbox"
              checked={settings.channels.includes('email')}
              onChange={() => handleChannelToggle('email')}
              aria-label={t('Notificação por email')}
            />
            {t('Email')}
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: accessibilityConfig.spacing.small }}>
            <input
              type="checkbox"
              checked={settings.channels.includes('sms')}
              onChange={() => handleChannelToggle('sms')}
              aria-label={t('Notificação por SMS')}
            />
            {t('SMS')}
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: accessibilityConfig.spacing.small }}>
            <input
              type="checkbox"
              checked={settings.channels.includes('push')}
              onChange={() => handleChannelToggle('push')}
              aria-label={t('Notificação push')}
            />
            {t('Push')}
          </label>
        </div>
      </div>

      <div style={{ marginBottom: accessibilityConfig.spacing.medium }}>
        <h3 style={{ fontSize: accessibilityConfig.typography.medium }}>
          {t('Intervalos de Lembrete')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: accessibilityConfig.spacing.small }}>
          {ReminderService.defaultReminderSettings.intervals.map(interval => (
            <label
              key={`${interval.value}-${interval.unit}`}
              style={{ display: 'flex', alignItems: 'center', gap: accessibilityConfig.spacing.small }}
            >
              <input
                type="checkbox"
                checked={settings.intervals.some(i => i.value === interval.value && i.unit === interval.unit)}
                onChange={() => handleIntervalToggle(interval)}
                aria-label={t(`Lembrete ${interval.label}`)}
              />
              {t(interval.label)}
            </label>
          ))}
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
          onClick={handleSave}
          disabled={loading}
          ariaLabel={t('Salvar configurações de lembrete')}
        >
          {loading ? t('Salvando...') : t('Salvar')}
        </AccessibleButton>
        <AccessibleButton
          onClick={onCancel}
          variant="secondary"
          disabled={loading}
          ariaLabel={t('Cancelar configurações de lembrete')}
        >
          {t('Cancelar')}
        </AccessibleButton>
      </div>
    </div>
  );
};

export default ReminderSettings; 