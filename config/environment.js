export const environment = {
    // API Configuration
    api: {
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
        timeout: 30000
    },

    // Supabase Configuration
    supabase: {
        url: import.meta.env.EXPO_PUBLIC_SUPABASE_URL,
        anonKey: import.meta.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    },

    // Firebase Configuration
    firebase: {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    },

    // App Configuration
    app: {
        name: import.meta.env.VITE_APP_NAME || 'Cuide-Se',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        debug: import.meta.env.MODE === 'development'
    },

    // Security Configuration
    security: {
        passwordMinLength: 8,
        passwordRequirements: [
            'Mínimo 8 caracteres',
            'Pelo menos uma letra maiúscula',
            'Pelo menos uma letra minúscula',
            'Pelo menos um número',
            'Pelo menos um caractere especial'
        ],
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        twoFactorAuth: true
    },

    // Cache Configuration
    cache: {
        enabled: true,
        maxAge: 60 * 60 * 1000, // 1 hour
        storage: 'localStorage'
    },

    // Analytics Configuration
    analytics: {
        enabled: import.meta.env.MODE === 'production',
        provider: 'google',
        trackingId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID
    },

    // Notification Configuration
    notifications: {
        push: {
            enabled: true,
            provider: 'firebase',
            maxDaily: 10
        },
        email: {
            enabled: true,
            provider: 'sendgrid',
            maxDaily: 5
        }
    },

    // Storage Configuration
    storage: {
        defaultProvider: 'supabase',
        providers: {
            supabase: {
                bucket: 'public'
            },
            firebase: {
                path: 'uploads'
            }
        }
    },

    // Rate Limiting Configuration
    rateLimit: {
        api: {
            maxRequests: 100,
            windowMs: 60 * 60 * 1000 // 1 hour
        },
        login: {
            maxAttempts: 5,
            lockoutDuration: 30 * 60 * 1000 // 30 minutes
        }
    },

    // Logging Configuration
    logging: {
        level: import.meta.env.MODE === 'development' ? 'debug' : 'info',
        providers: ['console', 'file'],
        maxFileSize: 10 * 1024 * 1024 // 10MB
    }
};
