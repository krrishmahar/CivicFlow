import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'COMPLAINANT' | 'VOLUNTEER' | 'ADMIN';
}

export interface User {
  id: string;
  fullName?: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface ErrorResponse {
  error: any;
}

// API Slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
    prepareHeaders: (headers, { getState }) => {
      // Get token from state if you're storing it in Redux
      const token = (getState() as any).auth?.token;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

// Export hooks for usage in components
export const { useLoginMutation, useSignupMutation } = authApi;