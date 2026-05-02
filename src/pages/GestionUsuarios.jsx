import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import TablaUsuarios from "../components/users/TablaUsuarios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const GestionUsuarios = () => {
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  /* --- DESCOMENTAR PARA PRUEBAS SIN BACKEND --- */
  
  useEffect(() => {
    setUsuarios([
      { _id: "u1", nombre: "Paola Emilia Chiguano Meza", email: "paola.chiguano@epn.edu.ec", rol: "admin" },
      { _id: "u2", nombre: "Sergio Granizo", email: "sergio.granizo@epn.edu.ec", rol: "docente" }
    ]);
  }, []);
  
  
  const obtenerUsuarios = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios`;
    const response = await fetchDataBackend(url, null, "GET", {
      Authorization: `Bearer ${token}`
    });
    if (response) setUsuarios(response);
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Deseas eliminar permanentemente a este usuario?")) {
      const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/eliminar/${id}`;
      const response = await fetchDataBackend(url, null, "DELETE", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        toast.success("Usuario eliminado");
        obtenerUsuarios(); // Refresca la tabla automáticamente
      }
    }
  };

  const handleEditar = (id) => navigate(`/dashboard/usuarios/actualizar/${id}`);

  const filtrados = usuarios.filter(user => 
    user.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    user.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-black text-[#17243D]">GESTIÓN DE <span className="text-[#F5BD45]">USUARIOS</span></h1>
        <input type="text" placeholder="Buscar usuario..." className="px-4 py-2 w-full md:w-80 rounded-xl border focus:ring-2 focus:ring-[#F5BD45] outline-none" onChange={(e) => setBusqueda(e.target.value)} />
      </div>
      <TablaUsuarios usuarios={filtrados} handleEliminar={handleEliminar} handleEditar={handleEditar} />
    </div>
  );
};

export default GestionUsuarios;