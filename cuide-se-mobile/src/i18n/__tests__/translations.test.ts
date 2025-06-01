import ptBR from '../locales/pt-BR.json';
import enUS from '../locales/en-US.json';
import esES from '../locales/es-ES.json';

describe('Translation Files', () => {
  const requiredNamespaces = ['common', 'auth', 'appointments', 'profile', 'settings'];
  const requiredKeys = {
    common: ['loading', 'error', 'success', 'cancel', 'confirm', 'save', 'edit', 'delete', 'back', 'next', 'finish'],
    auth: ['login', 'register', 'email', 'password', 'forgotPassword', 'resetPassword', 'name', 'phone'],
    appointments: ['title', 'new', 'date', 'time', 'service', 'professional', 'status', 'actions'],
    profile: ['title', 'personalInfo', 'preferences', 'notifications', 'language', 'theme', 'logout'],
    settings: ['title', 'notifications', 'privacy'],
  };

  const translations = {
    'pt-BR': ptBR,
    'en-US': enUS,
    'es-ES': esES,
  };

  it('should have all required namespaces in each language file', () => {
    Object.entries(translations).forEach(([language, translation]) => {
      requiredNamespaces.forEach(namespace => {
        expect(translation).toHaveProperty(namespace);
      });
    });
  });

  it('should have all required keys in each namespace', () => {
    Object.entries(translations).forEach(([language, translation]) => {
      Object.entries(requiredKeys).forEach(([namespace, keys]) => {
        keys.forEach(key => {
          expect(translation[namespace]).toHaveProperty(key);
        });
      });
    });
  });

  it('should have consistent structure across all languages', () => {
    const languages = Object.keys(translations);
    
    for (let i = 0; i < languages.length; i++) {
      for (let j = i + 1; j < languages.length; j++) {
        const lang1 = languages[i];
        const lang2 = languages[j];
        
        expect(Object.keys(translations[lang1])).toEqual(Object.keys(translations[lang2]));
        
        Object.keys(translations[lang1]).forEach(namespace => {
          expect(Object.keys(translations[lang1][namespace])).toEqual(
            Object.keys(translations[lang2][namespace])
          );
        });
      }
    }
  });

  it('should have non-empty values for all keys', () => {
    Object.entries(translations).forEach(([language, translation]) => {
      const checkEmptyValues = (obj: any, path: string = '') => {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          
          if (typeof value === 'object' && value !== null) {
            checkEmptyValues(value, currentPath);
          } else {
            expect(value).toBeTruthy();
            expect(typeof value).toBe('string');
            expect(value.trim()).not.toBe('');
          }
        });
      };

      checkEmptyValues(translation);
    });
  });

  it('should have consistent status values in appointments', () => {
    const statusKeys = ['pending', 'confirmed', 'completed', 'cancelled'];
    
    Object.entries(translations).forEach(([language, translation]) => {
      statusKeys.forEach(status => {
        expect(translation.appointments.status).toHaveProperty(status);
      });
    });
  });

  it('should have consistent action values in appointments', () => {
    const actionKeys = ['cancel', 'confirm', 'complete'];
    
    Object.entries(translations).forEach(([language, translation]) => {
      actionKeys.forEach(action => {
        expect(translation.appointments.actions).toHaveProperty(action);
      });
    });
  });

  it('should have consistent notification settings', () => {
    const notificationKeys = ['title', 'appointments', 'promotions', 'news'];
    
    Object.entries(translations).forEach(([language, translation]) => {
      notificationKeys.forEach(key => {
        expect(translation.settings.notifications).toHaveProperty(key);
      });
    });
  });

  it('should have consistent privacy settings', () => {
    const privacyKeys = ['title', 'dataUsage', 'location'];
    
    Object.entries(translations).forEach(([language, translation]) => {
      privacyKeys.forEach(key => {
        expect(translation.settings.privacy).toHaveProperty(key);
      });
    });
  });
}); 