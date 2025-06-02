import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MonitoringService from '../services/MonitoringService';
import AccessibleButton from './AccessibleButton';
import { accessibilityConfig } from '../config/accessibility';

const MonitoringDashboard = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    pageLoad: [],
    apiCalls: [],
    errors: []
  });
  const [alerts, setAlerts] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 7),
    end: new Date()
  });

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [pageLoadMetrics, apiCallMetrics, errorMetrics, activeAlerts] = await Promise.all([
        MonitoringService.getMetrics('page_load', dateRange.start, dateRange.end),
        MonitoringService.getMetrics('api_call', dateRange.start, dateRange.end),
        MonitoringService.getMetrics('error', dateRange.start, dateRange.end),
        MonitoringService.getActiveAlerts()
      ]);

      setMetrics({
        pageLoad: pageLoadMetrics,
        apiCalls: apiCallMetrics,
        errors: errorMetrics
      });
      setAlerts(activeAlerts);
    } catch (err) {
      setError(t('monitoring.error.loading'));
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="monitoring-dashboard" {...accessibilityConfig}>
      <h1>{t('monitoring.title')}</h1>

      <section className="date-range">
        <h2>{t('monitoring.dateRange')}</h2>
        <div className="date-inputs">
          <input
            type="date"
            value={format(dateRange.start, 'yyyy-MM-dd')}
            onChange={(e) => handleDateRangeChange({
              ...dateRange,
              start: new Date(e.target.value)
            })}
            aria-label={t('monitoring.startDate')}
          />
          <input
            type="date"
            value={format(dateRange.end, 'yyyy-MM-dd')}
            onChange={(e) => handleDateRangeChange({
              ...dateRange,
              end: new Date(e.target.value)
            })}
            aria-label={t('monitoring.endDate')}
          />
        </div>
      </section>

      <section className="metrics">
        <h2>{t('monitoring.pageLoad')}</h2>
        <LineChart width={800} height={300} data={metrics.pageLoad}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(date) => format(new Date(date), 'dd/MM', { locale: ptBR })}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
          />
          <Legend />
          <Line type="monotone" dataKey="data.duration" name={t('monitoring.duration')} stroke="#8884d8" />
        </LineChart>

        <h2>{t('monitoring.apiCalls')}</h2>
        <LineChart width={800} height={300} data={metrics.apiCalls}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(date) => format(new Date(date), 'dd/MM', { locale: ptBR })}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
          />
          <Legend />
          <Line type="monotone" dataKey="data.duration" name={t('monitoring.duration')} stroke="#82ca9d" />
        </LineChart>
      </section>

      <section className="alerts">
        <h2>{t('monitoring.alerts')}</h2>
        {alerts.length > 0 ? (
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div key={alert.id} className="alert-item">
                <h3>{alert.metric}</h3>
                <p>{t('monitoring.value')}: {alert.value}</p>
                <p>{t('monitoring.threshold')}: {alert.threshold}</p>
                <p>{t('monitoring.timestamp')}: {format(new Date(alert.timestamp), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>{t('monitoring.noAlerts')}</p>
        )}
      </section>

      <section className="actions">
        <AccessibleButton
          onClick={loadData}
          aria-label={t('monitoring.refresh')}
        >
          {t('monitoring.refresh')}
        </AccessibleButton>
      </section>
    </div>
  );
};

export default MonitoringDashboard; 