import * as matter from 'matter-js';

export interface skillsInfo {
  logo: string;
  color: string;
}

export interface skillsShow extends skillsInfo {
  show: boolean;
}
export interface skillBody extends skillsInfo {
  body: matter.Body;
}

export const skillLogos: skillsInfo[] = [
  { logo: 'angular.svg', color: '#F20000' },
  { logo: 'css.svg', color: '#1572B6' },
  { logo: 'figma.svg', color: '#F24E1E' },
  { logo: 'git.svg', color: '#F05032' },
  { logo: 'gitHub.svg', color: '#181717' },
  { logo: 'godot.svg', color: '#478CBF' },
  { logo: 'html.svg', color: '#E34F26' },
  { logo: 'javascript.svg', color: '#F7DF1E' },
  { logo: 'mysql.svg', color: '#4479A1' },
  { logo: 'postgresql.svg', color: '#4169E1' },
  { logo: 'python.svg', color: '#3776AB' },
  { logo: 'selenium.svg', color: '#43B02A' },
  { logo: 'springboot.svg', color: '#6DB33F' },
  { logo: 'tailwind.svg', color: '#06B6D4' },
  { logo: 'typescript.svg', color: '#3178C6' },
  { logo: 'ionic.svg', color: '#3880FF' },
];
