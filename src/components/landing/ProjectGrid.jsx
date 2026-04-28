import ProjectCard from './ProjectCard';

const projectsData = [
  { id: 1, title: 'DESARROLLO DE SOFTWARE', image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 2, title: 'REDES Y TELECOMUNICACIONES', image: 'https://images.pexels.com/photos/73871/rocket-launch-rocket-take-off-nasa-73871.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 3, title: 'ELECTROMECÁNICA', image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 4, title: 'AGUA Y SANEAMIENTO AMBIENTAL', image: 'https://images.pexels.com/photos/1000624/pexels-photo-1000624.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 5, title: 'PROCESAMIENTO INDUSTRIAL DE LA MADERA', image: 'https://images.pexels.com/photos/172289/pexels-photo-172289.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 6, title: 'PROCESAMIENTO DE ALIMENTOS', image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

export default function ProjectGrid() {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {projectsData.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}