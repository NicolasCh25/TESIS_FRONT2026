import { create } from "zustand";
import axios from "axios";

const storeProfile = create((set) => ({
  user: null,

  clearUser: () => set({ user: null }),

  profile: async (token) => {
    try {
      // Ruta corregida según tu Postman
      const url = `${import.meta.env.VITE_BACKEND_URL}api/usuarios/perfil`;

      const respuesta = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ user: respuesta.data });
      return respuesta.data; // Retornamos los datos para poder usarlos en el refresh
    } catch (error) {
      console.log("Error al cargar perfil:", error);
    }
  },
}));

export default storeProfile;