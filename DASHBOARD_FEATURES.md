# Dashboard Features Documentation

## Overview
This document describes the new features added to the MenuAdmin dashboard.

## New Features

### 1. Kitchen Management
**Path:** `/admin/users`

**Features:**
- Create new kitchen accounts
- Edit existing kitchen accounts
- Delete kitchen accounts
- Toggle kitchen active/inactive status
- Search kitchens by username or email
- Bilingual support (Arabic/English)

**API Endpoint:**
```
POST   /api/admin/users              - Create kitchen account
GET    /api/admin/users              - Get all users
GET    /api/admin/users/:id          - Get user by ID
PUT    /api/admin/users/:id          - Update user (including status toggle)
DELETE /api/admin/users/:id          - Delete user
```

**Request Example:**
```json
{
  "username": "kitchen2",
  "email": "kitchen2@restaurant.com",
  "password": "kitchen123",
  "role": "kitchen"
}
```

**Note:** Only kitchen role is supported in this interface.

**Update Status Example:**
```json
PUT /api/admin/users/6
{
  "isActive": "true"
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "تم إنشاء المستخدم بنجاح",
  "data": {
    "isActive": true,
    "id": 5,
    "restaurantId": 4,
    "username": "kitchen2",
    "email": "kitchen2@restaurant.com",
    "role": "kitchen",
    "updatedAt": "2025-11-22T13:01:40.979Z",
    "createdAt": "2025-11-22T13:01:40.979Z"
  }
}
```

---

### 2. Popular Items Report
**Path:** `/admin/reports/popular-items`

**Features:**
- View top-selling items
- Display total orders and revenue per item
- Visual ranking with medals for top 3 items
- Category badges
- Item images display
- Statistics overview:
  - Total items
  - Total orders
  - Total revenue

**API Endpoint:**
```
GET /api/admin/reports/popular-items
```

**Query Parameters:**
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date
- `limit` (optional): Limit results

**Response Example:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "item": {
        "id": 11,
        "name": "safsd",
        "nameAr": "سيبسي",
        "price": "2.89",
        "images": "[...]",
        "category": {
          "id": 5,
          "name": "sdfs",
          "nameAr": "سيبسسيبسي"
        }
      },
      "totalOrdered": 15,
      "totalRevenue": "43.35",
      "ordersCount": 1
    }
  ]
}
```

---

### 3. Sales Report
**Path:** `/admin/reports/sales`

**Features:**
- View sales data grouped by day, week, or month
- Display total sales, sessions, and orders
- Calculate average session value
- Growth indicators (percentage change)
- Detailed statistics table
- Interactive grouping filters

**API Endpoint:**
```
GET /api/admin/reports/sales
```

**Query Parameters:**
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date
- `groupBy` (optional): 'day', 'week', or 'month'

**Response Example:**
```json
{
  "success": true,
  "data": {
    "salesData": [],
    "totals": {
      "totalSales": "0.00",
      "totalSessions": 0,
      "avgSessionValue": "NaN"
    }
  }
}
```

---

### 4. Dashboard Statistics
**Path:** `/dashboard`

**Features:**
- Real-time dashboard statistics
- Active sessions counter
- Today's sales total
- Active orders count
- Average session value
- Table occupancy rate with visual progress bar
- Quick access links to all admin sections
- Direct links to reports

**API Endpoint:**
```
GET /api/admin/dashboard
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "activeSessions": 1,
    "todaySales": "0.00",
    "activeOrders": 0,
    "totalTables": 3,
    "occupiedTables": 1,
    "occupancyRate": 33.3,
    "avgSessionValue": "0.00"
  }
}
```

---

## Navigation Updates

The sidebar has been updated to include:

1. **Users** section - Direct link to user management
2. **Reports** section with submenu:
   - Popular Items
   - Sales Report

## Files Created/Modified

### New API Services:
- `src/api/services/userService.ts` - User management API client
- `src/api/services/reportService.ts` - Reports API client

### New Pages:
- `src/app/admin/users/page.tsx` - User management page
- `src/app/admin/reports/popular-items/page.tsx` - Popular items report
- `src/app/admin/reports/sales/page.tsx` - Sales report

### Modified Files:
- `src/app/dashboard/page.tsx` - Enhanced with real-time statistics
- `src/components/organisms/Sidebar.tsx` - Added new navigation links

## Features Highlights

### 🎨 UI/UX
- Fully responsive design
- Dark mode support
- RTL (Arabic) and LTR (English) support
- Beautiful cards with icons
- Color-coded badges for status and roles
- Loading states and empty states
- Smooth animations and transitions

### 🔐 Kitchen Management
- Kitchen account creation and management
- Password management (optional update)
- Active/Inactive status toggle
- Search capabilities

### 📊 Reports
- Visual data representation
- Medal badges for top performers
- Revenue calculations
- Growth indicators
- Flexible date filtering
- Multiple grouping options

### 📈 Dashboard
- Real-time statistics
- Visual progress bars
- Quick access shortcuts
- Report previews
- Occupancy tracking

## Usage

1. **Managing Kitchens:**
   - Navigate to Kitchens from sidebar
   - Click "Add Kitchen" to create new kitchen accounts
   - Use search to find specific kitchens
   - Toggle status or edit/delete as needed

2. **Viewing Popular Items:**
   - Navigate to Reports > Popular Items
   - View ranked items with medals
   - See total revenue and orders
   - Filter by date range (if needed)

3. **Analyzing Sales:**
   - Navigate to Reports > Sales Report
   - Select grouping (Daily/Weekly/Monthly)
   - Review sales trends
   - Check average session values

4. **Monitoring Dashboard:**
   - Go to Dashboard
   - View real-time statistics
   - Check table occupancy
   - Quick access to all sections

## API Endpoints Summary

### Kitchen Management
```
POST   /api/admin/users              - إنشاء مطبخ
GET    /api/admin/users              - قائمة المستخدمين
PUT    /api/admin/users/:id          - تحديث مستخدم (بما في ذلك الحالة)
DELETE /api/admin/users/:id          - حذف مستخدم
```

### Reports
```
GET    /api/admin/reports/popular-items  - الأصناف الأكثر طلباً
GET    /api/admin/reports/sales          - تقارير المبيعات
GET    /api/admin/dashboard              - إحصائيات Dashboard
```

## API Integration Notes

All endpoints expect:
- Authentication token in headers
- JSON content-type
- Proper error handling

**Status Toggle:** Use PUT `/api/admin/users/:id` with `{ "isActive": "true" }` or `{ "isActive": "false" }`

The services automatically handle:
- Token management
- Request/response formatting
- Error responses
- Loading states
