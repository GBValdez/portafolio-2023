import { projectsInterface } from './projects.interface';

export const LIST_PROJECTS: projectsInterface[] = [
  {
    title: 'BookMaster',
    description:
      'Sistema de libros con autenticación y roles de usuario, con la posibilidad de agregar, editar y eliminar libros, autores y categorías.',
    img: 'bookFront.webp',
    url: 'https://book-masters.vercel.app',
    technologies: ['cSharp', 'asp', 'postgresql', 'angular', 'tailwind'],
  },
  {
    title: 'Portafolio',
    description:
      'Portafolio personal para demostrar mis habilidades y proyectos realizados. También cuenta con sección de contacto y sobre mi.',
    img: 'portafolio.webp',
    url: 'https://gabriel-portfolio-site.vercel.app/home',
    technologies: ['angular', 'tailwind'],
  },
];
