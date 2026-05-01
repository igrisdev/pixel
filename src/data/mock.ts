import { Member, Project, Competency } from "@/types";

// --- 1. MOCKS DE COMPETENCIAS ---
const MOCK_COMPETENCIES: Record<string, Competency> = {
  // --- Técnicas (TECHNICAL) ---
  GESTION: {
    id: 1,
    name: "Gestión de Proyectos",
    description: "Metodologías ágiles y tradicionales",
    type: "TECHNICAL",
  },
  ESTRATEGIA: {
    id: 2,
    name: "Estrategia Tecnológica",
    description: "Planificación y arquitectura a nivel macro",
    type: "TECHNICAL",
  },
  NODE: {
    id: 3,
    name: "Node.js",
    description: "Desarrollo backend asíncrono",
    type: "TECHNICAL",
  },
  DOCKER: {
    id: 4,
    name: "Docker",
    description: "Contenerización y despliegue",
    type: "TECHNICAL",
  },
  MYSQL: {
    id: 5,
    name: "MySQL",
    description: "Bases de datos relacionales",
    type: "TECHNICAL",
  },
  REACT: {
    id: 6,
    name: "React",
    description: "Desarrollo de interfaces declarativas",
    type: "TECHNICAL",
  },
  NEXT: {
    id: 7,
    name: "Next.js",
    description: "Framework de React para SSR/SSG",
    type: "TECHNICAL",
  },
  TAILWIND: {
    id: 8,
    name: "Tailwind CSS",
    description: "Estilos utilitarios para interfaces",
    type: "TECHNICAL",
  },
  PYTHON: {
    id: 9,
    name: "Python",
    description: "Scripting, backend y ciencia de datos",
    type: "TECHNICAL",
  },
  PANDAS: {
    id: 10,
    name: "Pandas",
    description: "Análisis y manipulación de datos",
    type: "TECHNICAL",
  },
  AWS: {
    id: 11,
    name: "AWS",
    description: "Servicios e infraestructura en la nube",
    type: "TECHNICAL",
  },
  FIGMA: {
    id: 12,
    name: "Figma",
    description: "Diseño de interfaces y prototipado",
    type: "TECHNICAL",
  },
  CSS: {
    id: 13,
    name: "CSS/SASS",
    description: "Hojas de estilo en cascada avanzadas",
    type: "TECHNICAL",
  },
  GSAP: {
    id: 14,
    name: "GSAP",
    description: "Animaciones web de alto rendimiento",
    type: "TECHNICAL",
  },
  FLUTTER: {
    id: 15,
    name: "Flutter",
    description: "Desarrollo móvil multiplataforma",
    type: "TECHNICAL",
  },
  DART: {
    id: 16,
    name: "Dart",
    description: "Lenguaje orientado a objetos para UI",
    type: "TECHNICAL",
  },
  FIREBASE: {
    id: 17,
    name: "Firebase",
    description: "Plataforma de desarrollo BaaS",
    type: "TECHNICAL",
  },
  SELENIUM: {
    id: 18,
    name: "Selenium",
    description: "Automatización de pruebas web",
    type: "TECHNICAL",
  },
  JEST: {
    id: 19,
    name: "Jest",
    description: "Testing unitario en JavaScript",
    type: "TECHNICAL",
  },
  CYPRESS: {
    id: 20,
    name: "Cypress",
    description: "Testing E2E para aplicaciones web",
    type: "TECHNICAL",
  },
  LINUX: {
    id: 21,
    name: "Linux",
    description: "Administración de servidores OS",
    type: "TECHNICAL",
  },
  JENKINS: {
    id: 22,
    name: "Jenkins",
    description: "Integración y entrega continua (CI/CD)",
    type: "TECHNICAL",
  },
  KUBERNETES: {
    id: 23,
    name: "Kubernetes",
    description: "Orquestación de contenedores",
    type: "TECHNICAL",
  },
  VUE: {
    id: 24,
    name: "Vue.js",
    description: "Framework progresivo de JavaScript",
    type: "TECHNICAL",
  },
  LARAVEL: {
    id: 25,
    name: "Laravel",
    description: "Framework MVC para PHP",
    type: "TECHNICAL",
  },
  PHP: {
    id: 26,
    name: "PHP",
    description: "Programación del lado del servidor",
    type: "TECHNICAL",
  },

  // --- Transversales (SOFT) ---
  LEADERSHIP: {
    id: 101,
    name: "Liderazgo",
    description: "Capacidad para guiar y motivar equipos",
    type: "SOFT",
  },
  COMMUNICATION: {
    id: 102,
    name: "Comunicación Asertiva",
    description: "Transmisión clara y efectiva de ideas",
    type: "SOFT",
  },
  TEAMWORK: {
    id: 103,
    name: "Trabajo en Equipo",
    description: "Colaboración armónica en proyectos",
    type: "SOFT",
  },
  PROBLEM_SOLVING: {
    id: 104,
    name: "Resolución de Problemas",
    description: "Análisis lógico ante desafíos",
    type: "SOFT",
  },
  ADAPTABILITY: {
    id: 105,
    name: "Adaptabilidad",
    description: "Rápida adopción de nuevas tecnologías",
    type: "SOFT",
  },
  TIME_MANAGEMENT: {
    id: 106,
    name: "Gestión del Tiempo",
    description: "Priorización de tareas y entregas",
    type: "SOFT",
  },
};

// Exportamos las competencias como un arreglo para usarlas globalmente si es necesario
export const INITIAL_COMPETENCIES: Competency[] =
  Object.values(MOCK_COMPETENCIES);

// --- 2. MOCKS DE MIEMBROS ---
export const INITIAL_MEMBERS: Member[] = [
  {
    id: 999,
    fullName: "Administrador Pixel",
    institutionalEmail: "admin@unimayor.edu.co",
    passwordHash: "admin123",
    professionalProfile:
      "Profesional enfocado en la dirección de proyectos tecnológicos y la innovación educativa. Con más de 5 años de experiencia liderando semilleros de investigación y articulando el talento universitario con las necesidades del sector productivo.",
    career: "Dirección de Proyectos",
    role: "Director de Innovación",
    systemRole: "ADMIN",
    academicStatus: "GRADUATE",
    competencies: [
      MOCK_COMPETENCIES.GESTION,
      MOCK_COMPETENCIES.ESTRATEGIA,
      MOCK_COMPETENCIES.LEADERSHIP,
      MOCK_COMPETENCIES.COMMUNICATION,
    ],
    photoUrl:
      "https://ui-avatars.com/api/?name=Admin+Pixel&background=F37021&color=fff&size=150",
    isBanned: false,
    personalEmail: "admin_personal@gmail.com",
    cvUrl: "",
    links: [],
  },
  {
    id: 1,
    fullName: "Johan Alvarez",
    institutionalEmail: "johan@unimayor.edu.co",
    passwordHash: "est123",
    professionalProfile:
      "Estudiante apasionado por la arquitectura de software y el despliegue de aplicaciones escalables. Disfruto construyendo soluciones robustas en el backend y optimizando procesos a través de la contenerización y el código limpio.",
    career: "Ingeniería Informática",
    role: "Arquitecto de Software",
    systemRole: "MEMBER",
    academicStatus: "STUDENT",
    competencies: [
      MOCK_COMPETENCIES.NODE,
      MOCK_COMPETENCIES.DOCKER,
      MOCK_COMPETENCIES.MYSQL,
      MOCK_COMPETENCIES.PROBLEM_SOLVING,
      MOCK_COMPETENCIES.TEAMWORK,
    ],
    photoUrl:
      "https://ui-avatars.com/api/?name=Johan+Alvarez&background=1E293B&color=fff&size=150",
    isBanned: false,
    personalEmail: "johan@gmail.com",
    cvUrl: "",
    links: [{ id: 1, platform: "GitHub", url: "https://github.com/johan" }],
  },
  {
    id: 2,
    fullName: "Isabella Velasco",
    institutionalEmail: "ivelasco@unimayor.edu.co",
    passwordHash: "est123",
    professionalProfile:
      "Desarrolladora Frontend con un fuerte enfoque en la experiencia de usuario (UX). Me especializo en crear interfaces accesibles, rápidas y visualmente atractivas utilizando el ecosistema de React y Next.js.",
    career: "Ingeniería Informática",
    role: "Frontend Developer",
    systemRole: "MEMBER",
    academicStatus: "STUDENT",
    competencies: [
      MOCK_COMPETENCIES.REACT,
      MOCK_COMPETENCIES.NEXT,
      MOCK_COMPETENCIES.TAILWIND,
      MOCK_COMPETENCIES.COMMUNICATION,
      MOCK_COMPETENCIES.ADAPTABILITY,
    ],
    photoUrl:
      "https://ui-avatars.com/api/?name=Isabella+Velasco&background=2D5A27&color=fff&size=150",
    isBanned: false,
    personalEmail: "isa@gmail.com",
    cvUrl: "",
    links: [],
  },
  {
    id: 3,
    fullName: "Carlos Ruiz",
    institutionalEmail: "cruiz@unimayor.edu.co",
    passwordHash: "est123",
    professionalProfile:
      "Egresado especializado en la ingeniería de datos y el análisis predictivo. Mi objetivo es transformar datos crudos en información valiosa para la toma de decisiones estratégicas, utilizando Python y plataformas Cloud.",
    career: "Tecnología en Desarrollo de Software",
    role: "Ingeniero de Datos",
    systemRole: "MEMBER",
    academicStatus: "GRADUATE",
    competencies: [
      MOCK_COMPETENCIES.PYTHON,
      MOCK_COMPETENCIES.PANDAS,
      MOCK_COMPETENCIES.AWS,
      MOCK_COMPETENCIES.PROBLEM_SOLVING,
    ],
    photoUrl:
      "https://ui-avatars.com/api/?name=Carlos+Ruiz&background=F37021&color=fff&size=150",
    isBanned: false,
    personalEmail: "",
    cvUrl: "",
    links: [],
  },
  {
    id: 4,
    fullName: "Ana Gómez",
    institutionalEmail: "agomez@unimayor.edu.co",
    passwordHash: "est123",
    professionalProfile:
      "Diseñadora de interfaces y experta en usabilidad. Me encanta combinar la psicología del color con estructuras de navegación intuitivas para lograr productos digitales accesibles y modernos. Destaco en la creación de sistemas de diseño.",
    career: "Diseño Visual",
    role: "Diseñadora UX/UI",
    systemRole: "MEMBER",
    academicStatus: "STUDENT",
    competencies: [
      MOCK_COMPETENCIES.FIGMA,
      MOCK_COMPETENCIES.CSS,
      MOCK_COMPETENCIES.GSAP,
      MOCK_COMPETENCIES.TEAMWORK,
    ],
    photoUrl:
      "https://ui-avatars.com/api/?name=Ana+Gomez&background=1E293B&color=fff&size=150",
    isBanned: false,
    personalEmail: "",
    cvUrl: "",
    links: [],
  },
  {
    id: 5,
    fullName: "David Luna",
    institutionalEmail: "dluna@unimayor.edu.co",
    passwordHash: "est123",
    professionalProfile:
      "Apasionado por el desarrollo de aplicaciones móviles fluidas y eficientes. Mi experiencia se centra en Flutter y Dart, integrando bases de datos en tiempo real para asegurar la mejor experiencia desde el dispositivo del usuario.",
    career: "Tecnología en Desarrollo de Software",
    role: "Desarrollador Mobile",
    systemRole: "MEMBER",
    academicStatus: "GRADUATE",
    competencies: [
      MOCK_COMPETENCIES.FLUTTER,
      MOCK_COMPETENCIES.DART,
      MOCK_COMPETENCIES.FIREBASE,
      MOCK_COMPETENCIES.TIME_MANAGEMENT,
    ],
    photoUrl:
      "https://ui-avatars.com/api/?name=David+Luna&background=2D5A27&color=fff&size=150",
    isBanned: false,
    personalEmail: "",
    cvUrl: "",
    links: [],
  },
  {
    id: 6,
    fullName: "Sofía Castro",
    institutionalEmail: "scastro@unimayor.edu.co",
    passwordHash: "est123",
    professionalProfile:
      "Analista de Aseguramiento de Calidad (QA) enfocada en automatización. Me encargo de que cada producto que lanzamos sea robusto y libre de errores críticos mediante la implementación de pruebas unitarias y End-to-End.",
    career: "Ingeniería Informática",
    role: "Analista QA",
    systemRole: "MEMBER",
    academicStatus: "STUDENT",
    competencies: [
      MOCK_COMPETENCIES.SELENIUM,
      MOCK_COMPETENCIES.JEST,
      MOCK_COMPETENCIES.CYPRESS,
      MOCK_COMPETENCIES.PROBLEM_SOLVING,
      MOCK_COMPETENCIES.COMMUNICATION,
    ],
    photoUrl:
      "https://ui-avatars.com/api/?name=Sofia+Castro&background=F37021&color=fff&size=150",
    isBanned: false,
    personalEmail: "",
    cvUrl: "",
    links: [],
  },
  {
    id: 7,
    fullName: "Miguel Rojas",
    institutionalEmail: "mrojas@unimayor.edu.co",
    passwordHash: "est123",
    professionalProfile:
      "Ingeniero DevOps dedicado a optimizar el ciclo de vida del desarrollo. Automatizo procesos de integración y entrega continua (CI/CD) garantizando infraestructuras escalables y tolerantes a fallos en entornos de producción.",
    career: "Ingeniería Informática",
    role: "DevOps Engineer",
    systemRole: "MEMBER",
    academicStatus: "GRADUATE",
    competencies: [
      MOCK_COMPETENCIES.LINUX,
      MOCK_COMPETENCIES.JENKINS,
      MOCK_COMPETENCIES.KUBERNETES,
      MOCK_COMPETENCIES.ADAPTABILITY,
    ],
    photoUrl:
      "https://ui-avatars.com/api/?name=Miguel+Rojas&background=1E293B&color=fff&size=150",
    isBanned: false,
    personalEmail: "",
    cvUrl: "",
    links: [],
  },
  {
    id: 8,
    fullName: "Laura Díaz",
    institutionalEmail: "ldiaz@unimayor.edu.co",
    passwordHash: "est123",
    professionalProfile:
      "Desarrolladora Fullstack con experiencia conectando arquitecturas backend tradicionales con modernas interfaces web. Mi versatilidad me permite adaptarme a cualquier fase del desarrollo de software.",
    career: "Tecnología en Desarrollo de Software",
    role: "Fullstack Developer",
    systemRole: "MEMBER",
    academicStatus: "STUDENT",
    competencies: [
      MOCK_COMPETENCIES.VUE,
      MOCK_COMPETENCIES.LARAVEL,
      MOCK_COMPETENCIES.PHP,
      MOCK_COMPETENCIES.TEAMWORK,
    ],
    photoUrl:
      "https://ui-avatars.com/api/?name=Laura+Diaz&background=2D5A27&color=fff&size=150",
    isBanned: false,
    personalEmail: "",
    cvUrl: "",
    links: [],
  },
];

// --- 3. MOCKS DE PROYECTOS ---
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 10,
    title: "Pixel Core Engine",
    objective:
      "Desarrollar una plataforma web centralizada para la gestión, estructuración y visibilización de competencias y proyectos del semillero.",
    awards:
      "Mención de honor en Encuentro Regional de Semilleros RedCOLSI 2024",
    startDate: "2024-03-01",
    endDate: "2024-11-30",
    createdBy: 1, // Johan
    coverImageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    approvalStatus: "PENDING",
    products: [
      {
        id: 101,
        projectId: 10,
        title: "Plataforma Web Core Engine",
        description:
          "Una arquitectura limpia basada en contenedores Docker y microservicios. Implementa JWT para autenticación, Next.js para el renderizado del lado del servidor y MySQL.",
        categoryType: "DEVELOPMENT",
        approvalStatus: "PENDING",
        technologies: ["Docker", "Express", "Next.js", "MySQL"],
        repositoryUrl: "https://github.com/pixel/core-engine",
        demoUrl: "https://pixel-demo.com",
        participations: [
          {
            id: 1001,
            memberId: 1,
            productId: 101,
            productRole: "Arquitecto de Software",
            startDate: "2024-03-01",
            endDate: "2024-11-30",
            memberName: "Johan Alvarez",
            memberPhotoUrl:
              "https://ui-avatars.com/api/?name=Johan+Alvarez&background=1E293B&color=fff&size=150",
          },
          {
            id: 1002,
            memberId: 2,
            productId: 101,
            productRole: "Frontend Developer",
            startDate: "2024-03-01",
            endDate: "2024-11-30",
            memberName: "Isabella Velasco",
            memberPhotoUrl:
              "https://ui-avatars.com/api/?name=Isabella+Velasco&background=2D5A27&color=fff&size=150",
          },
        ],
      },
    ],
  },
  {
    id: 11,
    title: "AgroTech Sensor AI",
    objective:
      "Implementar un sistema de monitoreo inteligente para predecir enfermedades en cultivos mediante sensores IoT y Machine Learning.",
    awards: "",
    startDate: "2023-08-01",
    endDate: "2024-05-30",
    createdBy: 3, // Carlos
    coverImageUrl:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    approvalStatus: "ACTIVE",
    products: [
      {
        id: 102,
        projectId: 11,
        title: "Sistema Predictivo IoT",
        description:
          "El sistema recopila datos de humedad y temperatura del suelo en tiempo real. Utiliza un modelo predictivo en Python (TensorFlow) para alertar a los agricultores.",
        categoryType: "DEVELOPMENT",
        approvalStatus: "ACTIVE",
        technologies: ["Python", "IoT", "React", "TensorFlow"],
        repositoryUrl: "https://github.com/pixel/agrotech",
        demoUrl: "",
        participations: [
          {
            id: 1003,
            memberId: 3,
            productId: 102,
            productRole: "Ingeniero de Datos",
            startDate: "2023-08-01",
            endDate: "2024-05-30",
            memberName: "Carlos Ruiz",
            memberPhotoUrl:
              "https://ui-avatars.com/api/?name=Carlos+Ruiz&background=F37021&color=fff&size=150",
          },
          {
            id: 1004,
            memberId: 8,
            productId: 102,
            productRole: "Fullstack Developer",
            startDate: "2023-10-01",
            endDate: "2024-05-30",
            memberName: "Laura Díaz",
            memberPhotoUrl:
              "https://ui-avatars.com/api/?name=Laura+Diaz&background=2D5A27&color=fff&size=150",
          },
        ],
      },
    ],
  },
];
