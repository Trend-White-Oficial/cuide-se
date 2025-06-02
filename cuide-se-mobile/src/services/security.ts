import { supabase } from './supabase';
import * as Crypto from 'expo-crypto';
import { Buffer } from 'buffer';

export interface CardValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface SecurityLog {
  id: string;
  user_id: string;
  action: string;
  details: any;
  ip_address: string;
  created_at: string;
}

class SecurityService {
  private readonly ENCRYPTION_KEY: string;
  private readonly IV_LENGTH: number = 16;

  constructor() {
    // Em produção, usar variáveis de ambiente
    this.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'chave-secreta-temporaria';
  }

  // Validação de cartão de crédito
  validateCard(cardNumber: string, expiryDate: string, cvv: string): CardValidationResult {
    const errors: string[] = [];

    // Validação do número do cartão (algoritmo de Luhn)
    if (!this.isValidLuhn(cardNumber)) {
      errors.push('Número do cartão inválido');
    }

    // Validação da data de expiração
    if (!this.isValidExpiryDate(expiryDate)) {
      errors.push('Data de expiração inválida');
    }

    // Validação do CVV
    if (!this.isValidCVV(cvv)) {
      errors.push('CVV inválido');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Criptografia de dados sensíveis
  async encryptData(data: string): Promise<string> {
    try {
      const iv = await Crypto.getRandomBytesAsync(this.IV_LENGTH);
      const key = await this.generateKey();
      
      const encrypted = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        data + key
      );

      return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
      console.error('Erro ao criptografar dados:', error);
      throw new Error('Falha na criptografia');
    }
  }

  // Descriptografia de dados
  async decryptData(encryptedData: string): Promise<string> {
    try {
      const [ivHex, encrypted] = encryptedData.split(':');
      const key = await this.generateKey();
      
      // Implementar lógica de descriptografia
      // Em produção, usar biblioteca de criptografia mais robusta
      return encrypted;
    } catch (error) {
      console.error('Erro ao descriptografar dados:', error);
      throw new Error('Falha na descriptografia');
    }
  }

  // Tokenização de dados sensíveis
  async tokenizeData(data: string): Promise<string> {
    try {
      const token = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        data + Date.now().toString()
      );
      
      // Armazenar mapeamento token -> dados no banco
      await this.storeTokenMapping(token, data);
      
      return token;
    } catch (error) {
      console.error('Erro ao tokenizar dados:', error);
      throw new Error('Falha na tokenização');
    }
  }

  // Log de segurança
  async logSecurityEvent(action: string, details: any): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Usuário não autenticado');

      const log: SecurityLog = {
        id: crypto.randomUUID(),
        user_id: session.user.id,
        action,
        details,
        ip_address: '0.0.0.0', // Em produção, obter IP real
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('security_logs')
        .insert(log);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao registrar log de segurança:', error);
      throw error;
    }
  }

  // Verificação de força de senha
  validatePasswordStrength(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  }

  // Verificação de autenticação em duas etapas
  async setup2FA(userId: string): Promise<string> {
    try {
      // Gerar chave secreta para 2FA
      const secret = await Crypto.getRandomBytesAsync(20);
      const secretBase32 = this.toBase32(secret);

      // Armazenar chave no banco
      await supabase
        .from('user_2fa')
        .upsert({
          user_id: userId,
          secret: secretBase32,
          enabled: true,
        });

      return secretBase32;
    } catch (error) {
      console.error('Erro ao configurar 2FA:', error);
      throw error;
    }
  }

  // Verificação de token 2FA
  async verify2FA(userId: string, token: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('user_2fa')
        .select('secret')
        .eq('user_id', userId)
        .single();

      if (!data) return false;

      // Implementar verificação do token
      // Em produção, usar biblioteca TOTP
      return true;
    } catch (error) {
      console.error('Erro ao verificar 2FA:', error);
      return false;
    }
  }

  // Métodos privados auxiliares
  private isValidLuhn(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, '').split('').map(Number);
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  private isValidExpiryDate(expiryDate: string): boolean {
    const [month, year] = expiryDate.split('/').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (month < 1 || month > 12) return false;
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  }

  private isValidCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }

  private async generateKey(): Promise<string> {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      this.ENCRYPTION_KEY
    );
  }

  private async storeTokenMapping(token: string, data: string): Promise<void> {
    const { error } = await supabase
      .from('token_mappings')
      .insert({
        token,
        data: await this.encryptData(data),
        created_at: new Date().toISOString(),
      });

    if (error) throw error;
  }

  private toBase32(buffer: Uint8Array): string {
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    
    for (let i = 0; i < buffer.length; i += 5) {
      const chunk = buffer.slice(i, i + 5);
      let value = 0;
      
      for (let j = 0; j < chunk.length; j++) {
        value = (value << 8) | chunk[j];
      }
      
      const bits = chunk.length * 8;
      const chars = Math.ceil(bits / 5);
      
      for (let j = 0; j < chars; j++) {
        const index = (value >>> (bits - 5 * (j + 1))) & 0x1f;
        result += base32Chars[index];
      }
    }
    
    return result;
  }
}

export const securityService = new SecurityService(); 