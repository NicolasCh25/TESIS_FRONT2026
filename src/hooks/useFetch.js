// src/hooks/useFetch.js
import { useState } from 'react';

export const useFetch = () => { // <--- DEBE TENER 'export const'
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
        // Si es FormData (como para subir el archivo PIC), no ponemos Content-Type manual
        delete options.headers['Content-Type'];
        options.body = body;
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Error en la petición');

      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return fetchDataBackend;
};