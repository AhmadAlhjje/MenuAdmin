# Getting Started Guide

## ✅ Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env.local
```

Update the `.env.local` file with your API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Features Overview

### Dashboard (`/dashboard`)
- Main entry point with quick links to all admin features
- Navigation sidebar with all major sections

### Categories Management (`/admin/categories`)
- Create, read, update, and delete menu categories
- Support for both English and Arabic names
- Set category display order

### Menu Items Management (`/admin/items`)
- Manage all menu items
- Set prices, preparation times, and images
- Toggle item availability
- Organize items by category

### Tables Management (`/admin/tables`)
- Create and manage restaurant tables
- Set table capacity and location
- Auto-generated QR codes for each table

### Settings (`/settings`)
- Change password
- Toggle dark/light mode
- Switch between English and Arabic

## 🌍 Language & Theme

### Language Switching
The application supports both English and Arabic with automatic RTL support:
- Click the language button in the sidebar to switch
- Selection is saved to localStorage

### Dark Mode / Light Mode
- Toggle dark mode using the theme button in the sidebar
- Theme preference is saved automatically

## 📡 API Integration

The dashboard connects to the restaurant API. Ensure your API server is running before using the admin dashboard.

### Required API Endpoints:
- Authentication endpoints
- Menu categories endpoints
- Menu items endpoints
- Table management endpoints

Refer to the Postman collection provided for detailed endpoint documentation.

## 🛠️ Development

### Project Structure
- `src/app/` - Next.js pages and layouts
- `src/components/` - React components (Atomic Design)
- `src/api/` - API services and client configuration
- `src/hooks/` - Custom React hooks
- `src/store/` - Zustand state management
- `src/types/` - TypeScript type definitions
- `src/i18n/` - Internationalization configuration
- `src/utils/` - Utility functions

### Adding New Features

#### Add a New Admin Page
1. Create a folder in `src/app/admin/[feature]/`
2. Add a `page.tsx` file
3. Use existing components and patterns

#### Add a New Component
1. Create the component in the appropriate atoms/molecules/organisms folder
2. Export it from the index file
3. Use it in your pages

#### Add API Calls
1. Create a new service file in `src/api/services/`
2. Use the configured axios client
3. Define types in `src/types/index.ts`

Example:
```typescript
// src/api/services/exampleService.ts
export const exampleService = {
  getAll: async () => {
    const response = await apiClient.get('/api/endpoint');
    return response.data;
  },
};
```

#### Add Notifications
```typescript
import { useNotification } from '@/hooks/useNotification';

export function MyComponent() {
  const { notify } = useNotification();

  const handleAction = async () => {
    try {
      // Do something
      notify.success('Success message');
    } catch (error) {
      notify.error('Error message');
    }
  };

  return <button onClick={handleAction}>Click me</button>;
}
```

### Styling

The project uses Tailwind CSS with custom colors defined in `tailwind.config.ts`:
- Primary colors
- Secondary colors
- Success, danger, warning, info colors

Example:
```tsx
<div className="bg-primary-500 dark:bg-primary-900 text-white p-4 rounded-lg">
  Colored content
</div>
```

## 🐛 Troubleshooting

### Page not loading
- Check if the API server is running
- Verify the `NEXT_PUBLIC_API_URL` in `.env.local`

### Language not switching
- Clear browser cache
- Check localStorage settings

### Styles not applied
- Ensure Tailwind CSS is properly configured
- Run `npm run build` to verify

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [i18next Documentation](https://www.i18next.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🚀 Building for Production

```bash
npm run build
npm start
```

This will create an optimized production build.

## 📝 Notes

- All translations are stored in `src/i18n/locales/`
- API client automatically includes authentication tokens
- All API errors are handled with user-friendly notifications
- The application supports RTL languages with proper styling

---

For more information, see `README.md`
