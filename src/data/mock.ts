import { Member, Project, Competency } from "@/types";

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 999,
    fullName: "Administrador Pixel",
    institutionalEmail: "admin@unimayor.edu.co",
    passwordHash: "admin123",
    career: "Dirección de Proyectos",
    role: "Director de Innovación",
    systemRole: "ADMIN",
    academicStatus: "GRADUATE",
    tech: ["Gestión", "Estrategia"],
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
    career: "Ingeniería Informática",
    role: "Arquitecto de Software",
    systemRole: "ADMIN",
    academicStatus: "STUDENT",
    tech: ["Node.js", "Docker", "MySQL"],
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
    career: "Ingeniería Informática",
    role: "Frontend Developer",
    systemRole: "MEMBER",
    academicStatus: "STUDENT",
    tech: ["React", "Next.js", "Tailwind"],
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
    career: "Tecnología en Desarrollo de Software",
    role: "Ingeniero de Datos",
    systemRole: "MEMBER",
    academicStatus: "GRADUATE",
    tech: ["Python", "Pandas", "AWS"],
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
    career: "Diseño Visual",
    role: "Diseñadora UX/UI",
    systemRole: "MEMBER",
    academicStatus: "STUDENT",
    tech: ["Figma", "CSS", "GSAP"],
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
    career: "Tecnología en Desarrollo de Software",
    role: "Desarrollador Mobile",
    systemRole: "MEMBER",
    academicStatus: "GRADUATE",
    tech: ["Flutter", "Dart", "Firebase"],
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
    career: "Ingeniería Informática",
    role: "Analista QA",
    systemRole: "MEMBER",
    academicStatus: "STUDENT",
    tech: ["Selenium", "Jest", "Cypress"],
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
    career: "Ingeniería Informática",
    role: "DevOps Engineer",
    systemRole: "MEMBER",
    academicStatus: "GRADUATE",
    tech: ["Linux", "Jenkins", "Kubernetes"],
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
    career: "Tecnología en Desarrollo de Software",
    role: "Fullstack Developer",
    systemRole: "MEMBER",
    academicStatus: "STUDENT",
    tech: ["Vue.js", "Laravel", "PHP"],
    photoUrl:
      "https://ui-avatars.com/api/?name=Laura+Diaz&background=2D5A27&color=fff&size=150",
    isBanned: false,
    personalEmail: "",
    cvUrl: "",
    links: [],
  },
];

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

export const INITIAL_COMPETENCIES: Competency[] = [
  {
    id: 1,
    name: "Desarrollo Frontend",
    description: "Creación de interfaces web con React y Tailwind.",
    type: "TECHNICAL", // Reemplaza "TECNICA"
  },
  {
    id: 2,
    name: "Liderazgo de Equipos",
    description: "Capacidad para guiar equipos bajo metodologías ágiles.",
    type: "SOFT", // Reemplaza "TRANSVERSAL"
  },
  {
    id: 3,
    name: "Arquitectura Cloud",
    description: "Despliegue de servicios en AWS y Docker.",
    type: "TECHNICAL",
  },
];
