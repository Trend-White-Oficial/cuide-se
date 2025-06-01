import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  chatId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  senderId: string;
  createdAt: string;
  read: boolean;
}

export interface Chat {
  id: string;
  userId: string;
  professionalId: string;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageData {
  chatId: string;
  content: string;
  type: 'text' | 'image' | 'file';
}

class ChatService {
  async createChat(professionalId: string): Promise<Chat> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('chats')
      .insert({
        user_id: user.id,
        professional_id: professionalId,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapChat(data);
  }

  async getChats(): Promise<Chat[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        messages:messages(
          id,
          content,
          type,
          sender_id,
          created_at,
          read
        )
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapChat);
  }

  async getChatById(id: string): Promise<Chat> {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        messages:messages(
          id,
          content,
          type,
          sender_id,
          created_at,
          read
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return this.mapChat(data);
  }

  async getMessages(chatId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data.map(this.mapMessage);
  }

  async sendMessage(data: CreateMessageData): Promise<Message> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        chat_id: data.chatId,
        content: data.content,
        type: data.type,
        sender_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Atualiza a data de atualização do chat
    await supabase
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', data.chatId);

    return this.mapMessage(message);
  }

  async markMessagesAsRead(chatId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('chat_id', chatId)
      .neq('sender_id', user.id)
      .eq('read', false);

    if (error) throw error;
  }

  async deleteChat(id: string): Promise<void> {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private mapMessage(data: any): Message {
    return {
      id: data.id,
      chatId: data.chat_id,
      content: data.content,
      type: data.type,
      senderId: data.sender_id,
      createdAt: data.created_at,
      read: data.read,
    };
  }

  private mapChat(data: any): Chat {
    const messages = data.messages || [];
    const lastMessage = messages.length > 0
      ? this.mapMessage(messages[messages.length - 1])
      : undefined;

    return {
      id: data.id,
      userId: data.user_id,
      professionalId: data.professional_id,
      lastMessage,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export const chatService = new ChatService(); 