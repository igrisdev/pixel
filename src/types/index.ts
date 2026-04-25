// ----------------------------------------------------
// 1. USUARIOS Y ENLACES
// ----------------------------------------------------

export interface EnlaceProfesional {
  id: number;
  plataforma: string;
  url: string;
}

export interface Student {
  id: number;
  name: string;
  email_institucional: string;
  password_hash?: string;
  carrera: string;
  status: "ESTUDIANTE" | "EGRESADO";
  vetado: boolean;

  // Campos que el integrante actualiza en su perfil:
  img: string; // url_foto en BD
  email_personal?: string;
  url_cv?: string;
  role?: string;
  tech: string[];
  enlaces?: EnlaceProfesional[];
}

export interface CurrentUser {
  id: number;
  name: string;
  role: "ADMIN" | "INTEGRANTE";
  email?: string;
}

// ----------------------------------------------------
// 2. CATÁLOGO GLOBAL
// ----------------------------------------------------

export interface Competency {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: "TECNICA" | "TRANSVERSAL";
}

// ----------------------------------------------------
// 3. ESTRUCTURA DE PROYECTOS Y PRODUCTOS (SEGÚN ER)
// ----------------------------------------------------

// La tabla principal del Macro-Proyecto
export interface Proyecto {
  id: number;
  titulo: string;
  objetivo: string;
  premios_distinciones: string | null;
  fecha_inicio: string; // Tipo Date/String
  fecha_fin: string | null;
  creado_por: number; // FK a id_integrante
  img: string; // Para la UI (portada del proyecto)

  // Relación 1:N con Productos
  productos?: ProductoAcademico[];
}

// Tipo enum para Categorías
export type TipoCategoria = "DESARROLLO" | "EVENTO" | "ESCRITO";

// La tabla que unifica Desarrollo, Evento y Escrito
export interface ProductoAcademico {
  id: number;
  id_proyecto: number; // FK al Proyecto padre
  titulo: string;
  descripcion: string;
  tipo_categoria: TipoCategoria;

  // --- Campos específicos de DESARROLLO (1:1) ---
  subtipo_desarrollo?: string;
  descripcion_tecnica?: string;
  tecnologias?: string[]; // Simula el JSON en BD
  imagenes?: string[]; // Simula el JSON en BD
  url_repositorio?: string;
  url_demo?: string;
  fecha_inicio?: string;
  fecha_fin?: string;

  // --- Campos específicos de EVENTO (1:1) ---
  localidad?: string;
  // fecha_inicio y fecha_fin reutilizan los de arriba

  // --- Campos específicos de ESCRITO (1:1) ---
  subtipo_escrito?: string;
  url_documento?: string;
  fuente_publicacion?: string;
  fecha_publicacion?: string;

  // Relación 1:N con Participaciones (El equipo)
  participaciones?: Participacion[];
}

// La tabla puente entre Integrantes y Productos
export interface Participacion {
  id: number;
  id_integrante: number; // FK a Student
  id_producto: number; // FK a ProductoAcademico
  rol_en_producto: string;
  fecha_inicio_rol: string;
  fecha_fin_rol: string | null;

  // Datos combinados para la UI (No van directo a la tabla, se unen con JOINs)
  integrante_nombre?: string;
  integrante_img?: string;

  // Tabla Puente: Participacion_Competencia (Competencias demostradas aquí)
  competencias_aplicadas?: Competency[];
}
