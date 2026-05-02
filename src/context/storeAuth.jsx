import { create } from 'zustand';

// Definimos el store de forma nombrada (export const)
export const storeAuth = create((set) => ({
  // Intentamos recuperar datos previos del localStorage si existen
  token: localStorage.getItem('token') || null,
  rol: localStorage.getItem('rol') || null,

  // Función para guardar los datos al hacer Login
  setToken: (token, rol) => {
    localStorage.setItem('token', token);
    localStorage.setItem('rol', rol);
    set({ token, rol });
  },

  // Función para limpiar los datos al hacer Logout
  clearToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    set({ token: null, rol: null });
  },
}));