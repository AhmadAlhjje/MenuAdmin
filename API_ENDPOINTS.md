# API Endpoints Documentation

## Summary
هذا الملف يوضح جميع API endpoints المستخدمة في المشروع.

---

## Authentication APIs

### Login
**Request:**
```
POST {base_url}/api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

### Logout
**Request:**
```
POST {base_url}/api/auth/logout
```

### Get Current User
**Request:**
```
GET {base_url}/api/auth/me
Headers: Authorization: Bearer {token}
```

### Change Password
**Request:**
```
PUT {base_url}/api/auth/change-password
{
  "oldPassword": "current_password",
  "newPassword": "new_password"
}
```

---

## Categories APIs

### Get All Categories
**Request:**
```
GET {base_url}/api/menu/categories?limit=50&page=1
```

### Get Single Category
**Request:**
```
GET {base_url}/api/menu/categories/{id}
```

### Create Category
**Request:**
```
POST {base_url}/api/menu/categories
{
  "name": "Category Name",
  "nameAr": "اسم الفئة",
  "description": "Description",
  "displayOrder": 1
}
```

### Update Category
**Request:**
```
PUT {base_url}/api/menu/categories/{id}
{
  "name": "Updated Name",
  "nameAr": "الاسم المحدث",
  "description": "Updated Description",
  "displayOrder": 2
}
```

### Delete Category
**Request:**
```
DELETE {base_url}/api/menu/categories/{id}
```

---

## Menu Items APIs

### Get All Items
**Request:**
```
GET {base_url}/api/menu/items?limit=50&page=1
```

### Get Single Item
**Request:**
```
GET {base_url}/api/menu/items/{id}
```

### Create Item
**Request:**
```
POST {base_url}/api/menu/items
{
  "categoryId": 1,
  "name": "Item Name",
  "nameAr": "اسم الصنف",
  "description": "Description",
  "price": 9.99,
  "image": "https://example.com/image.jpg",
  "preparationTime": 30,
  "displayOrder": 1,
  "isAvailable": true
}
```

### Update Item
**Request:**
```
PUT {base_url}/api/menu/items/{id}
{
  "categoryId": 1,
  "name": "Updated Item Name",
  "nameAr": "اسم محدث",
  "description": "Updated Description",
  "price": 12.99,
  "image": "https://example.com/new-image.jpg",
  "preparationTime": 25,
  "displayOrder": 2,
  "isAvailable": true
}
```

### Delete Item
**Request:**
```
DELETE {base_url}/api/menu/items/{id}
```

### Toggle Item Availability
**Request:**
```
PATCH {base_url}/api/menu/items/{id}/availability
{
  "isAvailable": false
}
```

---

## Tables APIs

### Get All Tables
**Request:**
```
GET {base_url}/api/restaurant/tables?limit=50&page=1
```

### Get Single Table
**Request:**
```
GET {base_url}/api/restaurant/tables/{id}
```

### Create Table
**Request:**
```
POST {base_url}/api/restaurant/tables
{
  "tableNumber": "1",
  "capacity": 4,
  "location": "Main Hall"
}
```

### Update Table
**Request:**
```
PUT {base_url}/api/restaurant/tables/{id}
{
  "tableNumber": "1",
  "capacity": 6,
  "location": "Main Hall"
}
```

### Delete Table
**Request:**
```
DELETE {base_url}/api/restaurant/tables/{id}
```

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details"
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

---

## Notes

1. **Base URL**: Set via environment variable `NEXT_PUBLIC_API_URL` (default: `http://localhost:5000`)
2. **Authentication**: All protected endpoints require Authorization header with Bearer token
3. **Content-Type**: All requests use `application/json`
4. **Pagination**: List endpoints support `limit` and `page` query parameters
5. **CORS**: Ensure backend allows CORS from frontend URL
6. **Cookies**: Tokens are stored in HTTP-only cookies for security

---

**Last Updated**: November 19, 2024
