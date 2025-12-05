'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'BUYER' | 'PROMOTER' | 'ADMIN'
  isVerified: boolean
  avatar?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)

// Property Filter State
interface PropertyFilters {
  pricePerSqftMin?: number
  pricePerSqftMax?: number
  type?: string
  city?: string
  budgetMin?: number
  budgetMax?: number
  areaSqftMin?: number
  areaSqftMax?: number
  bedrooms?: number
  isNegotiable?: boolean
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface FilterState {
  filters: PropertyFilters
  setFilters: (filters: Partial<PropertyFilters>) => void
  resetFilters: () => void
}

const defaultFilters: PropertyFilters = {
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: defaultFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}))

// Toast notifications
interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

// Combined store for components that need auth + toast together
interface CombinedState {
  user: User | null
  isLoading: boolean
  toasts: Toast[]
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void
  removeToast: (id: string) => void
}

export const useStore = create<CombinedState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      toasts: [],
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null }),
      addToast: (message, type = 'info') =>
        set((state) => ({
          toasts: [
            ...state.toasts,
            { message, type, id: Math.random().toString(36).substr(2, 9) },
          ],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
