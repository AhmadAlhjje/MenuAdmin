# Restaurant Admin Dashboard

A comprehensive admin dashboard for managing restaurant menus, categories, items, and tables. Built with Next.js 14, TypeScript, Tailwind CSS, and i18n support.

## Features

- **Menu Management**
  - Create, read, update, and delete categories
  - Manage menu items with pricing and preparation times
  - Toggle item availability
  - Support for both English and Arabic names

- **Table Management**
  - Create and manage restaurant tables
  - Auto-generated QR codes for each table
  - Track table capacity and location

- **Responsive Design**
  - Mobile-friendly interface
  - Works on all screen sizes

- **Theme Support**
  - Dark mode / Light mode toggle
  - Persistent theme preference

- **Internationalization**
  - Full support for English and Arabic
  - RTL (Right-to-Left) support for Arabic
  - Easy language switching

- **Modern Architecture**
  - Atomic Design pattern for components
  - Organized API services
  - Zustand for state management
  - React hooks for async operations and notifications

## Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── dashboard/               # Main dashboard layout
│   ├── admin/                   # Admin pages
│   │   ├── categories/         # Categories management
│   │   ├── items/              # Menu items management
│   │   └── tables/             # Tables management
│   ├── settings/               # Settings page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   └── providers.tsx           # App providers (i18n, theme, etc.)
│
├── components/
│   ├── atoms/                  # Basic components (Button, Input, Card)
│   ├── molecules/              # Composite components (Modal, NotificationContainer)
│   └── organisms/              # Complex components (Sidebar, Header, Forms)
│
├── api/
│   ├── client.ts               # Axios client with interceptors
│   └── services/               # API service modules
│       ├── authService.ts
│       ├── categoryService.ts
│       ├── itemService.ts
│       └── tableService.ts
│
├── hooks/                      # Custom React hooks
│   ├── useNotification.ts
│   └── useAsync.ts
│
├── store/                      # Zustand stores
│   ├── notificationStore.ts
│   └── themeStore.ts
│
├── types/                      # TypeScript types and interfaces
│   └── index.ts
│
├── i18n/                       # Internationalization
│   ├── config.ts               # i18next configuration
│   └── locales/
│       ├── en.json             # English translations
│       └── ar.json             # Arabic translations
│
└── utils/                      # Utility functions
```

## Installation

1. Clone the repository:
```bash
cd MenuAdmin
npm install
```

2. Set up environment variables:
```bash
# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Key Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **i18next** - Internationalization (i18n)
- **Zustand** - State management
- **Axios** - HTTP client
- **React i18next** - React bindings for i18next
- **Lucide React** - Icon library

## API Integration

The dashboard connects to a Restaurant API with the following endpoints:

### Categories
- `GET /api/menu/categories` - Get all categories
- `POST /api/menu/categories` - Create category
- `PUT /api/menu/categories/:id` - Update category
- `DELETE /api/menu/categories/:id` - Delete category

### Menu Items
- `GET /api/menu/items` - Get all items
- `POST /api/menu/items` - Create item
- `PUT /api/menu/items/:id` - Update item
- `DELETE /api/menu/items/:id` - Delete item
- `PATCH /api/menu/items/:id/availability` - Toggle availability

### Tables
- `GET /api/admin/tables` - Get all tables
- `POST /api/admin/tables` - Create table
- `PUT /api/admin/tables/:id` - Update table
- `DELETE /api/admin/tables/:id` - Delete table

## Customization

### Adding New Pages

1. Create a new folder in `src/app/[section]/`
2. Add a `page.tsx` file
3. Use the provided layout and components

### Adding New API Calls

1. Create a new service file in `src/api/services/`
2. Use the `apiClient` from `src/api/client.ts`
3. Define TypeScript types in `src/types/index.ts`

### Adding New Components

1. Follow Atomic Design principles:
   - **Atoms**: Basic, reusable components
   - **Molecules**: Combination of atoms
   - **Organisms**: Complex components (pages, forms, sections)

## Dark Mode & Language

The application automatically saves user preferences:
- Theme preference is saved to `localStorage` with key `theme`
- Language preference is saved to `localStorage` with key `language`

Users can toggle:
- Dark/Light mode via the theme toggle button in the sidebar
- Language between English and Arabic

## Notifications

The app includes a notification system:
```typescript
const { notify } = useNotification();

notify.success('Operation successful');
notify.error('An error occurred');
notify.warning('Warning message');
notify.info('Info message');
```

## Form Handling

Use the `useAsync` hook for async operations:
```typescript
const { status, data, error, execute } = useAsync(
  () => apiCall(),
  false // immediate: execute on mount
);
```

## License

This project is part of a restaurant management system and is for authorized use only.
