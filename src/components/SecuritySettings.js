import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import SecurityService from '../services/SecurityService';
import AccessibleButton from './AccessibleButton';
import { accessibilityConfig } from '../config/accessibility';

const SecuritySettings = ({ userId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    check2FAStatus();
  }, [userId]);

  const check2FAStatus = async () => {
    try {
      setLoading(true);
      const secret = await SecurityService.get2FASecret(userId);
      setTwoFactorEnabled(!!secret);
    } catch (error) {
      setError(t('Erro ao verificar status do 2FA.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSetup2FA = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { secret, otpauth } = await SecurityService.setup2FA(userId);
      setTwoFactorSecret(secret);
      setShowQRCode(true);
    } catch (error) {
      setError(t('Erro ao configurar 2FA. Por favor, tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const isValid = await SecurityService.verify2FA(userId, verificationCode);
      
      if (isValid) {
        setSuccess(t('2FA configurado com sucesso!'));
        setTwoFactorEnabled(true);
        setShowQRCode(false);
        setVerificationCode('');
      } else {
        setError(t('Código inválido. Por favor, tente novamente.'));
      }
    } catch (error) {
      setError(t('Erro ao verificar código. Por favor, tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await SecurityService.disable2FA(userId);
      setTwoFactorEnabled(false);
      setSuccess(t('2FA desativado com sucesso!'));
    } catch (error) {
      setError(t('Erro ao desativar 2FA. Por favor, tente novamente.'));
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
        {t('Configurações de Segurança')}
      </h2>

      {error && (
        <div
          style={{
            padding: accessibilityConfig.spacing.small,
            marginBottom: accessibilityConfig.spacing.medium,
            backgroundColor: accessibilityConfig.colors.error,
            color: '#fff',
            borderRadius: '4px'
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: accessibilityConfig.spacing.small,
            marginBottom: accessibilityConfig.spacing.medium,
            backgroundColor: accessibilityConfig.colors.success,
            color: '#fff',
            borderRadius: '4px'
          }}
        >
          {success}
        </div>
      )}

      <div style={{ marginBottom: accessibilityConfig.spacing.medium }}>
        <h3 style={{ fontSize: accessibilityConfig.typography.medium }}>
          {t('Autenticação de Dois Fatores (2FA)')}
        </h3>
        
        {!twoFactorEnabled && !showQRCode && (
          <AccessibleButton
            onClick={handleSetup2FA}
            disabled={loading}
            ariaLabel={t('Configurar 2FA')}
          >
            {t('Configurar 2FA')}
          </AccessibleButton>
        )}

        {showQRCode && twoFactorSecret && (
          <div style={{ marginTop: accessibilityConfig.spacing.medium }}>
            <p>{t('Escaneie o QR Code com seu aplicativo autenticador:')}</p>
            <div style={{ margin: accessibilityConfig.spacing.medium }}>
              <QRCode value={twoFactorSecret} size={200} />
            </div>
            <div style={{ marginTop: accessibilityConfig.spacing.medium }}>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder={t('Digite o código de verificação')}
                style={{
                  padding: accessibilityConfig.spacing.small,
                  marginRight: accessibilityConfig.spacing.small,
                  borderRadius: '4px',
                  border: `1px solid ${accessibilityConfig.colors.border}`
                }}
              />
              <AccessibleButton
                onClick={handleVerify2FA}
                disabled={loading || !verificationCode}
                ariaLabel={t('Verificar código')}
              >
                {t('Verificar')}
              </AccessibleButton>
            </div>
          </div>
        )}

        {twoFactorEnabled && !showQRCode && (
          <div>
            <p>{t('2FA está ativado para sua conta.')}</p>
            <AccessibleButton
              onClick={handleDisable2FA}
              disabled={loading}
              ariaLabel={t('Desativar 2FA')}
              style={{
                backgroundColor: accessibilityConfig.colors.error,
                marginTop: accessibilityConfig.spacing.small
              }}
            >
              {t('Desativar 2FA')}
            </AccessibleButton>
          </div>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: accessibilityConfig.typography.medium }}>
          {t('Sessões Ativas')}
        </h3>
        <p>{t('Gerencie suas sessões ativas e dispositivos conectados.')}</p>
        <AccessibleButton
          onClick={() => {/* Implementar visualização de sessões */}}
          disabled={loading}
          ariaLabel={t('Ver sessões ativas')}
        >
          {t('Ver Sessões Ativas')}
        </AccessibleButton>
      </div>
    </div>
  );
};

export default SecuritySettings; 