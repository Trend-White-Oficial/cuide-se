import { supabase } from '../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('Supabase Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct configuration', () => {
    expect(supabase.supabaseUrl).toBe(process.env.SUPABASE_URL);
    expect(supabase.supabaseKey).toBe(process.env.SUPABASE_ANON_KEY);
  });

  it('should handle authentication state changes', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
    };

    const mockSession = {
      user: mockUser,
      access_token: 'mock-token',
    };

    // Simula mudança de estado de autenticação
    await supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        expect(session).toEqual(mockSession);
      }
    });

    // Simula login bem-sucedido
    await supabase.auth.signIn({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'supabase.auth.token',
      JSON.stringify(mockSession)
    );
  });

  it('should handle sign out', async () => {
    await supabase.auth.signOut();

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('supabase.auth.token');
  });

  it('should handle data operations', async () => {
    const mockData = {
      id: '1',
      name: 'Test Service',
    };

    // Testa operação de seleção
    const selectResult = await supabase
      .from('services')
      .select('*')
      .eq('id', '1')
      .single();

    expect(selectResult.data).toEqual(mockData);
    expect(selectResult.error).toBeNull();

    // Testa operação de inserção
    const insertResult = await supabase
      .from('services')
      .insert(mockData)
      .single();

    expect(insertResult.data).toEqual(mockData);
    expect(insertResult.error).toBeNull();

    // Testa operação de atualização
    const updateResult = await supabase
      .from('services')
      .update({ name: 'Updated Service' })
      .eq('id', '1')
      .single();

    expect(updateResult.data.name).toBe('Updated Service');
    expect(updateResult.error).toBeNull();

    // Testa operação de exclusão
    const deleteResult = await supabase
      .from('services')
      .delete()
      .eq('id', '1');

    expect(deleteResult.data).toBeNull();
    expect(deleteResult.error).toBeNull();
  });

  it('should handle realtime subscriptions', async () => {
    const mockCallback = jest.fn();
    const mockPayload = {
      new: { id: '1', name: 'New Service' },
      old: { id: '1', name: 'Old Service' },
    };

    // Simula inscrição em mudanças em tempo real
    const subscription = supabase
      .from('services')
      .on('UPDATE', mockCallback)
      .subscribe();

    // Simula recebimento de atualização
    await subscription.send('UPDATE', mockPayload);

    expect(mockCallback).toHaveBeenCalledWith(mockPayload);

    // Limpa a inscrição
    await subscription.unsubscribe();
  });

  it('should handle errors gracefully', async () => {
    const mockError = new Error('Database error');

    // Simula erro na operação
    const result = await supabase
      .from('services')
      .select('*')
      .throwOnError();

    expect(result.error).toBe(mockError);
    expect(result.data).toBeNull();
  });
}); 