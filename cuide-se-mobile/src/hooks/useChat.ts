import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useAnalytics } from './useAnalytics';
import { useCrashlytics } from './useCrashlytics';
import { chatService, Chat, Message, CreateMessageData } from '../services/chat';

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { user } = useAuth();
  const { showToast } = useToast();
  const { logEvent } = useAnalytics();
  const { recordError } = useCrashlytics();

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await chatService.getChats();
      setChats(data);
      logEvent('load_chats');
    } catch (err) {
      const error = err as Error;
      setError(error);
      recordError(error);
      showToast({
        type: 'error',
        message: 'Erro ao carregar conversas',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await chatService.getMessages(chatId);
      setMessages(data);
      logEvent('load_messages', { chatId });
    } catch (err) {
      const error = err as Error;
      setError(error);
      recordError(error);
      showToast({
        type: 'error',
        message: 'Erro ao carregar mensagens',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createChat = async (professionalId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const chat = await chatService.createChat(professionalId);
      setChats(prev => [chat, ...prev]);
      logEvent('create_chat', { professionalId });
      return chat;
    } catch (err) {
      const error = err as Error;
      setError(error);
      recordError(error);
      showToast({
        type: 'error',
        message: 'Erro ao criar conversa',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (data: CreateMessageData) => {
    try {
      setError(null);
      const message = await chatService.sendMessage(data);
      setMessages(prev => [...prev, message]);
      logEvent('send_message', { chatId: data.chatId, type: data.type });
      return message;
    } catch (err) {
      const error = err as Error;
      setError(error);
      recordError(error);
      showToast({
        type: 'error',
        message: 'Erro ao enviar mensagem',
      });
      throw error;
    }
  };

  const markMessagesAsRead = async (chatId: string) => {
    try {
      setError(null);
      await chatService.markMessagesAsRead(chatId);
      setMessages(prev =>
        prev.map(msg =>
          msg.chatId === chatId && !msg.read
            ? { ...msg, read: true }
            : msg
        )
      );
      logEvent('mark_messages_read', { chatId });
    } catch (err) {
      const error = err as Error;
      setError(error);
      recordError(error);
      showToast({
        type: 'error',
        message: 'Erro ao marcar mensagens como lidas',
      });
    }
  };

  const deleteChat = async (id: string) => {
    try {
      setError(null);
      await chatService.deleteChat(id);
      setChats(prev => prev.filter(chat => chat.id !== id));
      logEvent('delete_chat', { chatId: id });
    } catch (err) {
      const error = err as Error;
      setError(error);
      recordError(error);
      showToast({
        type: 'error',
        message: 'Erro ao excluir conversa',
      });
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  return {
    chats,
    messages,
    isLoading,
    error,
    fetchChats,
    fetchMessages,
    createChat,
    sendMessage,
    markMessagesAsRead,
    deleteChat,
  };
}; 