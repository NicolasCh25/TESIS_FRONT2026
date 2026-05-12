import { create } from 'zustand';

export const storeAuth = create((set) => ({
  // ✅ Cambiado a sessionStorage: Se limpia al cerrar la pestaña
  token: sessionStorage.getItem('token') || null,
  rol: sessionStorage.getItem('rol') || null,
  nombre: sessionStorage.getItem('nombre') || null,
  apellido: sessionStorage.getItem('apellido') || null,

  setToken: (token, rol, nombre, apellido) => {
    // Solo guardamos en sessionStorage si el valor existe
    if (token !== undefined && token !== null) sessionStorage.setItem('token', token);
    if (rol !== undefined && rol !== null) sessionStorage.setItem('rol', rol);
    if (nombre !== undefined && nombre !== null) sessionStorage.setItem('nombre', nombre);
    if (apellido !== undefined && apellido !== null) sessionStorage.setItem('apellido', apellido);
    
    set((state) => ({
      token: token ?? state.token,
      rol: rol ?? state.rol,
      nombre: nombre ?? state.nombre,
      apellido: apellido ?? state.apellido
    }));
  },

  clearToken: () => {
    // ✅ Limpieza de sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('rol');
    sessionStorage.removeItem('nombre');
    sessionStorage.removeItem('apellido');
    set({ token: null, rol: null, nombre: null, apellido: null });
  },
}));