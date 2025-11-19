export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateNumber = (value: string | number, min?: number, max?: number): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

export const validateString = (
  value: string,
  minLength?: number,
  maxLength?: number
): boolean => {
  if (minLength !== undefined && value.length < minLength) return false;
  if (maxLength !== undefined && value.length > maxLength) return false;
  return true;
};

export const trimString = (value: string | undefined): string => {
  return value?.trim() || '';
};

export const validateCategoryForm = (data: {
  name: string;
  nameAr: string;
  description: string;
}): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!trimString(data.name)) {
    errors.name = 'Category name is required';
  }

  if (!trimString(data.nameAr)) {
    errors.nameAr = 'Arabic category name is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateMenuItemForm = (data: {
  name: string;
  nameAr: string;
  description: string;
  categoryId: number;
  price: number;
}): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!trimString(data.name)) {
    errors.name = 'Item name is required';
  }

  if (!trimString(data.nameAr)) {
    errors.nameAr = 'Arabic item name is required';
  }

  if (!data.categoryId) {
    errors.categoryId = 'Category is required';
  }

  if (!validateNumber(data.price, 0.01)) {
    errors.price = 'Valid price is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
