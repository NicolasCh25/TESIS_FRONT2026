import { useState } from 'react';

export const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDataBackend = async (url, body = null, method = 'GET', headers = {}) => {
    setLoading(true);
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      if (body && !(body instanceof FormData)) {
        options.body = JSON.stringify(body);
      } else if (body instanceof FormData) {
        delete options.headers['Content-Type'];
        options.body = body;
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        // 🚀 Ajustado para capturar 'msg' que es lo que envía tu backend
        const errorMsg = data.msg || data.message || 'Error en la petición';
        const errorObj = new Error(errorMsg);
        errorObj.response = { data }; // Simulamos la estructura de Axios para no romper tu Login
        throw errorObj; 
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err; // 🚀 IMPORTANTE: Lanzamos el error para que el Login lo atrape
    } finally {
      setLoading(false);
    }
  };

  return fetchDataBackend;
};