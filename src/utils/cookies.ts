import { cookies } from 'next/headers';

const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const cookieUtils = {
  // Server-side: Set token
  async setToken(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_KEY, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
  },

  // Server-side: Set refresh token
  async setRefreshToken(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(REFRESH_TOKEN_KEY, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
  },

  // Server-side: Get token
  async getToken() {
    const cookieStore = await cookies();
    return cookieStore.get(TOKEN_KEY)?.value;
  },

  // Server-side: Get refresh token
  async getRefreshToken() {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_TOKEN_KEY)?.value;
  },

  // Server-side: Clear tokens
  async clearTokens() {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_KEY);
    cookieStore.delete(REFRESH_TOKEN_KEY);
  },

  // Client-side: Get token from document.cookie
  getTokenClient() {
    if (typeof document === 'undefined') return null;
    const name = TOKEN_KEY + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length);
      }
    }
    return null;
  },

  // Client-side: Check if token exists
  hasToken() {
    return this.getTokenClient() !== null;
  },
};
