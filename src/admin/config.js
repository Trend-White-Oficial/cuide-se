// Configurações do painel administrativo
export const ADMIN_CONFIG = {
    // Configurações básicas
    title: 'Painel Administrativo',
    version: '1.0.0',
    logo: {
        src: '/images/logo.png',
        alt: 'Logo do Sistema',
        width: 150,
        height: 50
    },
    theme: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        light: '#f8f9fa',
        dark: '#343a40'
    },

    // Configurações de segurança
    security: {
        passwordRequirements: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSymbols: true
        },
        sessionTimeout: 30, // minutos
        maxFailedAttempts: 5,
        lockoutDuration: 30 // minutos
    },

    // Configurações de autenticação
    auth: {
        providers: ['email', 'google', 'facebook'],
        rememberMe: true,
        sessionDuration: '24h'
    },

    // Configurações de interface
    ui: {
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        dateFormat: 'dd/MM/yyyy',
        timeFormat: 'HH:mm:ss',
        currency: {
            symbol: 'R$',
            decimal: ',',
            thousand: '.',
            precision: 2
        }
    },

    // Configurações de auditoria
    audit: {
        enabled: true,
        logRetention: 30, // dias
        maxFileSize: 100, // MB
        backupFrequency: 'daily'
    },

    // Configurações de backup
    backup: {
        enabled: true,
        frequency: 'daily',
        retention: 30, // dias
        compression: 'gzip',
        encryption: true
    },

    // Configurações de monitoramento
    monitoring: {
        enabled: true,
        interval: 5, // minutos
        thresholds: {
            memory: 80, // %
            cpu: 90, // %
            disk: 90 // %
        },
        alertThresholds: {
            memory: 90, // %
            cpu: 95, // %
            disk: 95 // %
        }
    },

    // Configurações de notificações
    notifications: {
        enabled: true,
        methods: ['email', 'sms', 'push'],
        retention: 30, // dias
        maxPerDay: 50
    },

    // Configurações de logs
    logs: {
        enabled: true,
        level: 'info',
        retention: 30, // dias
        maxFileSize: 100, // MB
        format: 'json'
    },

    // Configurações de cache
    cache: {
        enabled: true,
        provider: 'redis',
        ttl: 3600, // segundos
        maxItems: 1000
    },

    // Configurações de API
    api: {
        baseUrl: process.env.API_URL || 'http://localhost:3000',
        timeout: 30000, // ms
        retries: 3,
        retryDelay: 1000 // ms
    },

    // Configurações de banco de dados
    database: {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        name: process.env.DB_NAME || 'cuide_se',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres'
    },

    // Configurações de armazenamento
    storage: {
        provider: 'supabase',
        bucket: 'cuide-se',
        maxFileSize: 50, // MB
        allowedTypes: ['image/*', 'application/pdf']
    },

    // Configurações de segurança adicional
    security: {
        csrfProtection: true,
        rateLimiting: true,
        xssProtection: true,
        helmet: {
            contentSecurityPolicy: true,
            xssFilter: true,
            noSniff: true,
            frameguard: true,
            hidePoweredBy: true
        }
    },

    // Configurações de email
    email: {
        provider: 'sendgrid',
        from: 'no-reply@cuide-se.com',
        templatePath: '/templates/email',
        maxPerHour: 100
    },

    // Configurações de SMS
    sms: {
        provider: 'twilio',
        maxPerDay: 500,
        templatePath: '/templates/sms'
    },

    // Configurações de push notifications
    push: {
        provider: 'fcm',
        maxPerDay: 1000,
        templatePath: '/templates/push'
    },

    // Configurações de cache
    cache: {
        provider: 'redis',
        ttl: 3600, // segundos
        maxItems: 1000,
        compression: true
    },

    // Configurações de monitoramento de performance
    performance: {
        enabled: true,
        metrics: ['responseTime', 'cpuUsage', 'memoryUsage'],
        thresholds: {
            responseTime: 2000, // ms
            cpuUsage: 80, // %
            memoryUsage: 80 // %
        }
    },

    // Configurações de API Gateway
    apiGateway: {
        enabled: true,
        rateLimit: 1000, // requests per minute
        timeout: 30000, // ms
        retries: 3,
        circuitBreaker: {
            enabled: true,
            threshold: 5,
            resetTimeout: 30000 // ms
        }
    },

    // Configurações de CDN
    cdn: {
        provider: 'cloudflare',
        enabled: true,
        cacheTtl: 3600, // segundos
        compression: true,
        minify: true
    },

    // Configurações de SEO
    seo: {
        enabled: true,
        defaultTitle: 'Cuide-se - Plataforma de Profissionais',
        defaultDescription: 'Encontre os melhores profissionais de cuidados pessoais',
        defaultKeywords: 'cuidados pessoais, profissionais, agendamento',
        robots: 'index, follow'
    },

    // Configurações de analytics
    analytics: {
        enabled: true,
        provider: 'google',
        trackingId: process.env.ANALYTICS_TRACKING_ID,
        events: true,
        ecommerce: true
    },

    // Configurações de A/B Testing
    abTesting: {
        enabled: true,
        experiments: {
            'new-layout': {
                variants: {
                    A: 50,
                    B: 50
                },
                goals: ['conversion', 'engagement']
            }
        }
    },

    // Configurações de IA
    ai: {
        enabled: true,
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2000
    },

    // Configurações de chat
    chat: {
        enabled: true,
        provider: 'socket.io',
        maxHistory: 100,
        messageRetention: 30, // dias
        typingIndicator: true
    }
};
