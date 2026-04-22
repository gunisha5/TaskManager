/**
 * authService.js
 *
 * Business logic layer between pages and the raw API calls.
 * Handles response unwrapping, token storage, and error normalization.
 * TODO: Implement as Login/Signup UI is built.
 */

import { login as loginApi, signup as signupApi } from '../api/authApi';

export const authService = {
  /**
   * Login a user and persist token + user info.
   * @param {{ email: string, password: string }} credentials
   * @returns {{ user, token }}
   */
  login: async (credentials) => {
    const res = await loginApi(credentials);
    const { data } = res.data; // { success, data: { user, token } }
    return data;
  },

  /**
   * Register a new user.
   * @param {{ name: string, email: string, password: string }} userData
   * @returns {{ user, token }}
   */
  signup: async (userData) => {
    const res = await signupApi(userData);
    const { data } = res.data;
    return data;
  },
};
