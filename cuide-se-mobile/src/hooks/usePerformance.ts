import { useCallback } from 'react';
import perf from '@react-native-firebase/perf';
import { useDevice } from './useDevice';
import { useNetwork } from './useNetwork';

interface TraceOptions {
  attributes?: { [key: string]: string };
  metrics?: { [key: string]: number };
}

interface HttpMetricOptions {
  method: string;
  url: string;
  attributes?: { [key: string]: string };
  metrics?: { [key: string]: number };
}

export const usePerformance = () => {
  const { deviceState } = useDevice();
  const { networkState } = useNetwork();

  // Inicia um trace
  const startTrace = useCallback(
    async (traceName: string, options?: TraceOptions): Promise<any> => {
      try {
        const trace = await perf().startTrace(traceName);

        // Adiciona atributos do dispositivo
        await trace.putAttribute('device_brand', deviceState.brand);
        await trace.putAttribute('device_model', deviceState.model);
        await trace.putAttribute('os_version', deviceState.systemVersion);
        await trace.putAttribute('app_version', deviceState.appVersion);
        await trace.putAttribute('is_tablet', deviceState.isTablet.toString());
        await trace.putAttribute('is_emulator', deviceState.isEmulator.toString());
        await trace.putAttribute('has_notch', deviceState.hasNotch.toString());
        await trace.putAttribute('battery_level', deviceState.batteryLevel.toString());
        await trace.putAttribute('is_charging', deviceState.isCharging.toString());
        await trace.putAttribute('is_power_save_mode', deviceState.isPowerSaveMode.toString());

        // Adiciona atributos da rede
        await trace.putAttribute('network_type', networkState.type);
        await trace.putAttribute('is_connected', networkState.isConnected.toString());
        await trace.putAttribute('is_internet_reachable', networkState.isInternetReachable.toString());

        // Adiciona atributos personalizados
        if (options?.attributes) {
          await Promise.all(
            Object.entries(options.attributes).map(([key, value]) =>
              trace.putAttribute(key, value)
            )
          );
        }

        // Adiciona métricas personalizadas
        if (options?.metrics) {
          await Promise.all(
            Object.entries(options.metrics).map(([key, value]) =>
              trace.putMetric(key, value)
            )
          );
        }

        return trace;
      } catch (error) {
        console.error('Erro ao iniciar trace:', error);
        return null;
      }
    },
    [deviceState, networkState]
  );

  // Finaliza um trace
  const stopTrace = useCallback(async (trace: any): Promise<void> => {
    try {
      await trace.stop();
    } catch (error) {
      console.error('Erro ao finalizar trace:', error);
    }
  }, []);

  // Inicia uma métrica HTTP
  const startHttpMetric = useCallback(
    async (options: HttpMetricOptions): Promise<any> => {
      try {
        const metric = await perf().newHttpMetric(options.url, options.method);

        // Adiciona atributos do dispositivo
        await metric.putAttribute('device_brand', deviceState.brand);
        await metric.putAttribute('device_model', deviceState.model);
        await metric.putAttribute('os_version', deviceState.systemVersion);
        await metric.putAttribute('app_version', deviceState.appVersion);
        await metric.putAttribute('is_tablet', deviceState.isTablet.toString());
        await metric.putAttribute('is_emulator', deviceState.isEmulator.toString());
        await metric.putAttribute('has_notch', deviceState.hasNotch.toString());
        await metric.putAttribute('battery_level', deviceState.batteryLevel.toString());
        await metric.putAttribute('is_charging', deviceState.isCharging.toString());
        await metric.putAttribute('is_power_save_mode', deviceState.isPowerSaveMode.toString());

        // Adiciona atributos da rede
        await metric.putAttribute('network_type', networkState.type);
        await metric.putAttribute('is_connected', networkState.isConnected.toString());
        await metric.putAttribute('is_internet_reachable', networkState.isInternetReachable.toString());

        // Adiciona atributos personalizados
        if (options.attributes) {
          await Promise.all(
            Object.entries(options.attributes).map(([key, value]) =>
              metric.putAttribute(key, value)
            )
          );
        }

        // Adiciona métricas personalizadas
        if (options.metrics) {
          await Promise.all(
            Object.entries(options.metrics).map(([key, value]) =>
              metric.putMetric(key, value)
            )
          );
        }

        await metric.start();
        return metric;
      } catch (error) {
        console.error('Erro ao iniciar métrica HTTP:', error);
        return null;
      }
    },
    [deviceState, networkState]
  );

  // Finaliza uma métrica HTTP
  const stopHttpMetric = useCallback(
    async (metric: any, responseCode: number, responseSize: number): Promise<void> => {
      try {
        await metric.setHttpResponseCode(responseCode);
        await metric.setResponseContentType('application/json');
        await metric.setResponsePayloadSize(responseSize);
        await metric.stop();
      } catch (error) {
        console.error('Erro ao finalizar métrica HTTP:', error);
      }
    },
    []
  );

  // Mede o tempo de execução de uma função
  const measureExecutionTime = useCallback(
    async <T>(
      name: string,
      fn: () => Promise<T>,
      options?: TraceOptions
    ): Promise<T> => {
      const trace = await startTrace(name, options);
      try {
        const startTime = Date.now();
        const result = await fn();
        const endTime = Date.now();
        await trace.putMetric('execution_time', endTime - startTime);
        return result;
      } finally {
        await stopTrace(trace);
      }
    },
    [startTrace, stopTrace]
  );

  // Mede o tempo de carregamento de uma tela
  const measureScreenLoad = useCallback(
    async (screenName: string, options?: TraceOptions): Promise<any> => {
      const trace = await startTrace(`screen_load_${screenName}`, options);
      return {
        trace,
        stop: () => stopTrace(trace),
      };
    },
    [startTrace, stopTrace]
  );

  // Mede o tempo de renderização de um componente
  const measureComponentRender = useCallback(
    async (componentName: string, options?: TraceOptions): Promise<any> => {
      const trace = await startTrace(`component_render_${componentName}`, options);
      return {
        trace,
        stop: () => stopTrace(trace),
      };
    },
    [startTrace, stopTrace]
  );

  // Mede o tempo de uma operação de rede
  const measureNetworkOperation = useCallback(
    async <T>(
      options: HttpMetricOptions,
      operation: () => Promise<T>
    ): Promise<T> => {
      const metric = await startHttpMetric(options);
      try {
        const startTime = Date.now();
        const result = await operation();
        const endTime = Date.now();
        await metric.putMetric('operation_time', endTime - startTime);
        return result;
      } finally {
        await metric.stop();
      }
    },
    [startHttpMetric]
  );

  return {
    startTrace,
    stopTrace,
    startHttpMetric,
    stopHttpMetric,
    measureExecutionTime,
    measureScreenLoad,
    measureComponentRender,
    measureNetworkOperation,
  };
}; 