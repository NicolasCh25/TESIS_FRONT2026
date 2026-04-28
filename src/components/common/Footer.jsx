export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-20 py-8 text-center text-gray-600">
      <p className="font-semibold text-blue-950">Escuela de Formación de Tecnólogos - ESFOT</p>
      <p className="text-sm">Escuela Politécnica Nacional | Quito - Ecuador</p>
      <p className="text-xs mt-2">&copy; {new Date().getFullYear()} Portal PIC. Todos los derechos reservados.</p>
    </footer>
  );
}