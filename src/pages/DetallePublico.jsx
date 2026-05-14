import { useParams, Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const DetallePublico = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-[#17243D] font-black hover:text-[#F5BD45] transition mb-8 uppercase text-sm">
          <MdArrowBack size={20} /> Volver
        </Link>
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          <h1 className="text-3xl font-black text-[#17243D] uppercase">Detalle del Proyecto</h1>
          <p className="text-gray-500 mt-4 font-medium italic">Próximamente: Información detallada del proyecto {id}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DetallePublico;