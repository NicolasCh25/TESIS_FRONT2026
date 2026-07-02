import { useRef } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/landing/HeroSection';
import ProjectGrid from '../components/landing/ProjectGrid';

export default function Home() {
  const gridRef = useRef(null);

  const handleScrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-12 space-y-12 md:space-y-16">
        
        {/* Título de la sección principal */}
        <div className="text-center pt-4 md:pt-8">
          <div className="inline-flex flex-col items-center gap-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-950">
              P<span className="text-blue-950">roye</span>ctos <span className="text-yellow-400">ESFOT</span>
            </h1>
            
            <div className="h-1.5 w-16 sm:w-20 bg-yellow-400 rounded-full"></div>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-blue-900 mt-2 font-semibold">
              de Integración Curricular
            </p>
          </div>
        </div>

        <HeroSection onScrollToGrid={handleScrollToGrid} />
        
        <div ref={gridRef} className="scroll-mt-12">
          <ProjectGrid />
        </div>

      </main>
      
      <Footer />
    </div>
  );
}