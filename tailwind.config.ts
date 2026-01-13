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
          dark: '#1A202C',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#2D3748',
        },

        // الألوان الرئيسية - البرتقالي
        primary: {
          50: '#FFF4F0',
          100: '#FFE8DD',
          200: '#FFD1BB',
          300: '#FFBA99',
          400: '#FF8C61',
          500: '#FF6B35',
          600: '#E85A2A',
          700: '#CC4E24',
          800: '#B0431F',
          900: '#943819',
          DEFAULT: '#FF6B35',
        },

        // اللون المميز - الأحمر
        accent: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#FF6E6E',
          500: '#FF5252',
          600: '#F44336',
          700: '#E63946',
          800: '#D32F2F',
          900: '#B71C1C',
          DEFAULT: '#FF5252',
        },

        // النجاح - الأخضر
        success: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
          DEFAULT: '#4CAF50',
        },

        // الخطأ
        error: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          500: '#FF5252',
          600: '#F44336',
          700: '#E63946',
          DEFAULT: '#FF5252',
        },

        // التحذير
        warning: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          500: '#FFA726',
          600: '#FB8C00',
          700: '#F57C00',
          DEFAULT: '#FFA726',
        },

        // النصوص
        text: {
          primary: {
            light: '#2C3E50',
            dark: '#F7FAFC',
          },
          secondary: {
            light: '#5D6D7E',
            dark: '#CBD5E0',
          },
          muted: {
            light: '#95A5A6',
            dark: '#A0AEC0',
          },
        },

        // الحدود
        border: {
          light: '#F0E6DC',
          DEFAULT: '#E2E8F0',
          dark: '#4A5568',
        },
      },
    },
  },
  plugins: [],
};

export default config;
