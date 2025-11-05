// js/config.js - Configuración general de la aplicación
const CONFIG = {
    API_URL: 'http://localhost:3000/api',
    
    // Endpoints de la API
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            PROFILE: '/auth/profile'
        },
        USERS: {
            LIST: '/users',
            CREATE: '/users/admin',
            UPDATE_ROLE: '/users/:id/role',
            DELETE: '/users/:id'
        },
        BOOKS: {
            LIST: '/books',
            CREATE: '/books',
            DELETE: '/books/:id'
        }
    },
    
    // Roles del sistema
    ROLES: {
        ADMIN: 'admin',
        VIP: 'vip',
        FREE: 'free'
    }
};

// Hacer disponible globalmente
window.CONFIG = CONFIG;