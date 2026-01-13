import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // الخلفيات
        background: {
          DEFAULT: '#FFFFFF',
          light: '#FFF8F5',
          dark: '#0A0E14',
          'dark-elevated': '#151922',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#FAFBFC',
          dark: '#1A1F2E',
          'dark-hover': '#222936',
        },

        // الألوان الرئيسية - البرتقالي
        primary: {
          50: '#FFF5F0',
          100: '#FFE8DD',
          200: '#FFD1BB',
          300: '#FFBA99',
          400: '#FF8C61',
          500: '#FF6B35',
          600: '#E85A2A',
          700: '#CC4E24',
          800: '#B0431F',
          900: '#943819',
          950: '#7A2F15',
          DEFAULT: '#FF6B35',
        },

        // اللون المميز - الأحمر
        accent: {
          50: '#FFF1F0',
          100: '#FFDDDB',
          200: '#FFBBB8',
          300: '#FF9994',
          400: '#FF7770',
          500: '#FF5252',
          600: '#F44336',
          700: '#E63946',
          800: '#D32F2F',
          900: '#B71C1C',
          950: '#8B1414',
          DEFAULT: '#FF5252',
        },

        // النجاح - الأخضر
        success: {
          50: '#F0F9F4',
          100: '#E1F3E9',
          200: '#C3E7D3',
          300: '#9DD9B8',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
          950: '#154518',
          DEFAULT: '#4CAF50',
        },

        // الخطأ
        error: {
          50: '#FFF1F0',
          100: '#FFDDDB',
          200: '#FFBBB8',
          300: '#FF9994',
          400: '#FF7770',
          500: '#FF5252',
          600: '#F44336',
          700: '#E63946',
          800: '#D32F2F',
          900: '#B71C1C',
          DEFAULT: '#FF5252',
        },

        // التحذير
        warning: {
          50: '#FFF8F0',
          100: '#FFEEDD',
          200: '#FFDBB0',
          300: '#FFC883',
          400: '#FFB556',
          500: '#FFA726',
          600: '#FB8C00',
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
          DEFAULT: '#FFA726',
        },

        // النصوص
        text: {
          primary: {
            light: '#1A202C',
            dark: '#F7FAFC',
          },
          secondary: {
            light: '#4A5568',
            dark: '#E2E8F0',
          },
          muted: {
            light: '#718096',
            dark: '#CBD5E0',
          },
        },

        // الحدود
        border: {
          light: '#E2E8F0',
          DEFAULT: '#CBD5E0',
          dark: '#2D3748',
        },

        // ألوان إضافية للتنوع
        info: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3',
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
          DEFAULT: '#2196F3',
        },
      },
      boxShadow: {
        'glow-primary': '0 0 25px rgba(255, 107, 53, 0.4), 0 0 50px rgba(255, 107, 53, 0.1)',
        'glow-success': '0 0 25px rgba(76, 175, 80, 0.4), 0 0 50px rgba(76, 175, 80, 0.1)',
        'glow-accent': '0 0 25px rgba(255, 82, 82, 0.4), 0 0 50px rgba(255, 82, 82, 0.1)',
        'glow-info': '0 0 25px rgba(33, 150, 243, 0.4), 0 0 50px rgba(33, 150, 243, 0.1)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'soft-xl': '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)',
        'dark': '0 4px 20px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 8px 32px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.4)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
        'inner-dark': 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
