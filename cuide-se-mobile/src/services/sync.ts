import NetInfo from '@react-native-community/netinfo';
import { cacheService } from './cache';
import { supabase } from '../config/supabase';
import { getSupabaseError, handleSupabaseError } from '../config/supabase';

interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
}

interface SyncOptions {
  retryCount?: number;
  retryDelay?: number;
  batchSize?: number;
}

const defaultOptions: SyncOptions = {
  retryCount: 3,
  retryDelay: 5000, // 5 segundos
  batchSize: 10,
};

const SYNC_QUEUE_KEY = 'sync_queue';

export const syncService = {
  async addToQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp'>): Promise<void> {
    try {
      const queue = await this.getQueue();
      const newItem: SyncQueueItem = {
        ...item,
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
      };
      queue.push(newItem);
      await cacheService.set(SYNC_QUEUE_KEY, queue);
    } catch (error) {
      console.error('Erro ao adicionar à fila de sincronização:', error);
      throw error;
    }
  },

  async getQueue(): Promise<SyncQueueItem[]> {
    try {
      const queue = await cacheService.get<SyncQueueItem[]>(SYNC_QUEUE_KEY);
      return queue || [];
    } catch (error) {
      console.error('Erro ao obter fila de sincronização:', error);
      return [];
    }
  },

  async clearQueue(): Promise<void> {
    try {
      await cacheService.remove(SYNC_QUEUE_KEY);
    } catch (error) {
      console.error('Erro ao limpar fila de sincronização:', error);
      throw error;
    }
  },

  async processQueue(options: SyncOptions = {}): Promise<void> {
    try {
      const mergedOptions = { ...defaultOptions, ...options };
      const queue = await this.getQueue();
      if (queue.length === 0) return;

      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        console.log('Sem conexão com a internet. Aguardando...');
        return;
      }

      const batch = queue.slice(0, mergedOptions.batchSize);
      const remaining = queue.slice(mergedOptions.batchSize);

      for (const item of batch) {
        let retries = 0;
        let success = false;

        while (retries < mergedOptions.retryCount && !success) {
          try {
            await this.processItem(item);
            success = true;
          } catch (error) {
            retries++;
            if (retries === mergedOptions.retryCount) {
              console.error(`Falha ao processar item após ${retries} tentativas:`, error);
              throw error;
            }
            await new Promise(resolve => setTimeout(resolve, mergedOptions.retryDelay));
          }
        }
      }

      // Atualizar fila com itens restantes
      await cacheService.set(SYNC_QUEUE_KEY, remaining);
    } catch (error) {
      console.error('Erro ao processar fila de sincronização:', error);
      throw error;
    }
  },

  private async processItem(item: SyncQueueItem): Promise<void> {
    try {
      switch (item.action) {
        case 'create':
          await supabase.from(item.table).insert(item.data);
          break;
        case 'update':
          await supabase.from(item.table).update(item.data).eq('id', item.data.id);
          break;
        case 'delete':
          await supabase.from(item.table).delete().eq('id', item.data.id);
          break;
        default:
          throw new Error(`Ação inválida: ${item.action}`);
      }
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },

  async startAutoSync(options: SyncOptions = {}): Promise<() => void> {
    const mergedOptions = { ...defaultOptions, ...options };
    let isRunning = true;

    const syncLoop = async () => {
      while (isRunning) {
        try {
          await this.processQueue(mergedOptions);
        } catch (error) {
          console.error('Erro na sincronização automática:', error);
        }
        await new Promise(resolve => setTimeout(resolve, mergedOptions.retryDelay));
      }
    };

    syncLoop();

    // Retorna função para parar a sincronização
    return () => {
      isRunning = false;
    };
  },
}; 