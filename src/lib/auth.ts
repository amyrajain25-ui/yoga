/**
 * src/lib/auth.ts
 *
 * Implements the MantraCare authentication handshake protocol.
 * Stores user_id in sessionStorage for tab-isolation and purges on close.
 */

const SESSION_KEY = 'mc_user_id';

export const Auth = {
  getUserId(): string | null {
    return sessionStorage.getItem(SESSION_KEY);
  },

  setUserId(id: string): void {
    sessionStorage.setItem(SESSION_KEY, id);
  },

  clear(): void {
    sessionStorage.removeItem(SESSION_KEY);
  },

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(SESSION_KEY);
  },

  cleanUrl(): void {
    const url = new URL(window.location.href);
    if (url.searchParams.has('token')) {
      url.searchParams.delete('token');
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  },

  async performHandshake(): Promise<string> {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (token) {
      if (isLocalhost) {
        console.info('[auth] Localhost detected. Bypassing API handshake and using Mock User (10000001).');
        const mockUserId = '10000001';
        this.setUserId(mockUserId);
        this.cleanUrl();
        return mockUserId;
      }

      try {
        const res = await fetch('https://api.mantracare.com/user/user-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          throw new Error(`API error code: ${res.status}`);
        }

        const data = await res.json();
        const userId = data.user_id;
        if (!userId) {
          throw new Error('Response payload did not contain user_id');
        }

        const userIdStr = String(userId);
        this.setUserId(userIdStr);
        this.cleanUrl();
        return userIdStr;
      } catch (err) {
        console.error('[auth] MantraCare Token validation failed:', err);
        window.location.href = '/yoga/token';
        throw err;
      }
    } else {
      const existing = this.getUserId();
      if (existing) {
        return existing;
      }

      if (isLocalhost) {
        console.info('[auth] Localhost detected with no token. Auto-logging in Mock User (10000001) for dev testing.');
        const mockUserId = '10000001';
        this.setUserId(mockUserId);
        return mockUserId;
      }

      // If token is missing and there is no active session, execute hard redirect
      window.location.href = '/yoga/token';
      throw new Error('No active session or token found');
    }
  }
};
