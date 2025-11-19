export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },
  MENU: {
    CATEGORIES: '/api/menu/categories',
    ITEMS: '/api/menu/items',
  },
  ADMIN: {
    TABLES: '/api/admin/tables',
    USERS: '/api/admin/users',
    REPORTS: '/api/admin/reports',
  },
};

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 50,
};

export const TOAST_DURATION = {
  SHORT: 3000,
  NORMAL: 4000,
  LONG: 5000,
};

export const ITEM_PREPARATION_TIME = {
  MIN: 5,
  MAX: 120,
  DEFAULT: 30,
};

export const TABLE_CAPACITY = {
  MIN: 1,
  MAX: 20,
  DEFAULT: 4,
};
