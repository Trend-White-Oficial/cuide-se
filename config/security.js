export const securityConfig = {
    // Authentication
    auth: {
        password: {
            minLength: 8,
            maxLength: 128,
            requirements: {
                uppercase: true,
                lowercase: true,
                numbers: true,
                specialChars: true
            }
        },
        session: {
            timeout: 30 * 60 * 1000, // 30 minutes
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            secure: import.meta.env.MODE === 'production',
            httpOnly: true,
            sameSite: 'strict'
        },
        twoFactor: {
            enabled: true,
            providers: ['email', 'sms', 'authenticator'],
            backupCodes: {
                count: 10,
                length: 16
            }
        }
    },

    // Rate Limiting
    rateLimit: {
        api: {
            maxRequests: 100,
            windowMs: 60 * 60 * 1000, // 1 hour
            message: 'Muitas requisições. Tente novamente mais tarde.'
        },
        login: {
            maxAttempts: 5,
            lockoutDuration: 30 * 60 * 1000, // 30 minutes
            message: 'Muitas tentativas de login. Sua conta está temporariamente bloqueada.'
        },
        passwordReset: {
            maxAttempts: 3,
            cooldown: 15 * 60 * 1000, // 15 minutes
            message: 'Muitas tentativas de reset de senha. Tente novamente mais tarde.'
        }
    },

    // CORS
    cors: {
        enabled: true,
        origins: import.meta.env.MODE === 'production' 
            ? ['https://cuide-se.com']
            : ['http://localhost:3000', 'http://localhost:8000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        headers: ['Content-Type', 'Authorization'],
        credentials: true
    },

    // XSS Protection
    xss: {
        enabled: true,
        mode: 'block',
        whiteList: ['script-src', 'style-src'],
        reportUri: import.meta.env.MODE === 'production' 
            ? 'https://cuide-se.com/report/xss'
            : null
    },

    // CSRF Protection
    csrf: {
        enabled: true,
        cookie: {
            name: 'csrfToken',
            httpOnly: true,
            secure: import.meta.env.MODE === 'production',
            sameSite: 'strict'
        },
        headerName: 'X-CSRF-Token'
    },

    // Content Security Policy
    csp: {
        directives: {
            defaultSrc: ['self'],
            scriptSrc: ['self', 'unsafe-inline', 'unsafe-eval'],
            styleSrc: ['self', 'unsafe-inline'],
            imgSrc: ['self', 'data:', 'blob:'],
            connectSrc: ['self', 'https:'],
            fontSrc: ['self', 'data:'],
            objectSrc: ['none'],
            mediaSrc: ['self', 'data:', 'blob:'],
            frameSrc: ['none'],
            childSrc: ['none'],
            formAction: ['self'],
            baseUri: ['self'],
            reportUri: import.meta.env.MODE === 'production' 
                ? 'https://cuide-se.com/report/csp'
                : null
        }
    },

    // Security Headers
    headers: {
        xssProtection: '1; mode=block',
        xFrameOptions: 'DENY',
        xContentTypeOptions: 'nosniff',
        strictTransportSecurity: import.meta.env.MODE === 'production' 
            ? 'max-age=31536000; includeSubDomains; preload'
            : 'max-age=0',
        referrerPolicy: 'strict-origin-when-cross-origin',
        permissionsPolicy: 'camera=(), microphone=(), geolocation=()',
        expectCt: 'max-age=0',
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ['self'],
                scriptSrc: ['self', 'unsafe-inline', 'unsafe-eval'],
                styleSrc: ['self', 'unsafe-inline'],
                imgSrc: ['self', 'data:', 'blob:'],
                connectSrc: ['self', 'https:'],
                fontSrc: ['self', 'data:'],
                objectSrc: ['none'],
                mediaSrc: ['self', 'data:', 'blob:'],
                frameSrc: ['none'],
                childSrc: ['none'],
                formAction: ['self'],
                baseUri: ['self'],
                reportUri: import.meta.env.MODE === 'production' 
                    ? 'https://cuide-se.com/report/csp'
                    : null
            }
        }
    },

    // JWT Configuration
    jwt: {
        secret: import.meta.env.VITE_JWT_SECRET || 'your-secret-key',
        expiresIn: '24h',
        refreshExpiresIn: '7d',
        algorithms: ['HS256']
    },

    // Database Security
    database: {
        maxConnections: 10,
        minConnections: 2,
        connectionTimeout: 5000,
        idleTimeout: 30000,
        queryTimeout: 10000,
        statementTimeout: 30000,
        lockTimeout: 10000
    },

    // File Upload Security
    fileUpload: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        maxFiles: 5,
        tempDir: './uploads/temp',
        permanentDir: './uploads/permanent'
    },

    // API Security
    api: {
        versioning: {
            enabled: true,
            defaultVersion: 'v1',
            allowedVersions: ['v1', 'v2']
        },
        rateLimit: {
            maxRequests: 100,
            windowMs: 60 * 60 * 1000, // 1 hour
            message: 'Muitas requisições. Tente novamente mais tarde.'
        },
        validation: {
            enabled: true,
            strict: true,
            allowUnknown: false,
            stripUnknown: true
        }
    }
};
