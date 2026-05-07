import { create } from 'zustand';

export const storeAuth = create((set) => ({
  token: localStorage.getItem('token') || null,
  rol: localStorage.getItem('rol') || null,
  nombre: localStorage.getItem('nombre') || null,
  apellido: localStorage.getItem('apellido') || null,

  setToken: (token, rol, nombre, apellido) => {
    // Solo guardamos en localStorage si el valor existe (no es null ni undefined)
    if (token !== undefined && token !== null) localStorage.setItem('token', token);
    if (rol !== undefined && rol !== null) localStorage.setItem('rol', rol);
    if (nombre !== undefined && nombre !== null) localStorage.setItem('nombre', nombre);
    if (apellido !== undefined && apellido !== null) localStorage.setItem('apellido', apellido);
    
    set((state) => ({
      token: token ?? state.token,
      rol: rol ?? state.rol,
      nombre: nombre ?? state.nombre,
      apellido: apellido ?? state.apellido
    }));
  },

  clearToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
    localStorage.removeItem('apellido');
    set({ token: null, rol: null, nombre: null, apellido: null });
  },
}));