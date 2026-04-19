export interface EnlaceProfesional {
  id: number;
  plataforma: string;
  url: string;
}

export interface Student {
  id: number;
  name: string;
  role: string;
  status: 'ESTUDIANTE' | 'EGRESADO';
  tech: string[];
  img: string;
  vetado: boolean;
  email_personal?: string;
  url_cv?: string;
  enlaces?: EnlaceProfesional[];
}

export interface TeamMember {
  studentId: number;
  name: string;
  role: string;
  img: string;
}

export interface Project {
  id: number;
  title: string;
  type: string;
  tech: string[];
  img: string;
  date: string;
  objective: string;
  description: string;
  awards: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  team: TeamMember[];
}

export interface Competency {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: 'TECNICA' | 'TRANSVERSAL';
}

export interface User {
  id: number;
  name: string;
  role: 'ADMIN' | 'INTEGRANTE';
}