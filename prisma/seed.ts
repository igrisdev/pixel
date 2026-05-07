import { PrismaClient, SystemRole, AcademicStatus, ApprovalStatus, CategoryType, CompetencyType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:123@localhost:5432/pixel_db";

const adapter = new PrismaPg({ connectionString: databaseUrl });

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...\n");

  // 1. Create Competencies
  console.log("Creating competencies...");
  const competenciesData = [
    { name: "Gestión de Proyectos", description: "Metodologías ágiles y tradicionales", type: "TECHNICAL" as CompetencyType },
    { name: "Estrategia Tecnológica", description: "Planificación y arquitectura a nivel macro", type: "TECHNICAL" as CompetencyType },
    { name: "Node.js", description: "Desarrollo backend asíncrono", type: "TECHNICAL" as CompetencyType },
    { name: "Docker", description: "Contenerización y despliegue", type: "TECHNICAL" as CompetencyType },
    { name: "MySQL", description: "Bases de datos relacionales", type: "TECHNICAL" as CompetencyType },
    { name: "React", description: "Desarrollo de interfaces declarativas", type: "TECHNICAL" as CompetencyType },
    { name: "Next.js", description: "Framework de React para SSR/SSG", type: "TECHNICAL" as CompetencyType },
    { name: "Tailwind CSS", description: "Estilos utilitarios para interfaces", type: "TECHNICAL" as CompetencyType },
    { name: "Python", description: "Scripting, backend y ciencia de datos", type: "TECHNICAL" as CompetencyType },
    { name: "Pandas", description: "Análisis y manipulación de datos", type: "TECHNICAL" as CompetencyType },
    { name: "AWS", description: "Servicios e infraestructura en la nube", type: "TECHNICAL" as CompetencyType },
    { name: "Figma", description: "Diseño de interfaces y prototipado", type: "TECHNICAL" as CompetencyType },
    { name: "CSS/SASS", description: "Hojas de estilo en cascada avanzadas", type: "TECHNICAL" as CompetencyType },
    { name: "GSAP", description: "Animaciones web de alto rendimiento", type: "TECHNICAL" as CompetencyType },
    { name: "Flutter", description: "Desarrollo móvil multiplataforma", type: "TECHNICAL" as CompetencyType },
    { name: "Dart", description: "Lenguaje orientado a objetos para UI", type: "TECHNICAL" as CompetencyType },
    { name: "Firebase", description: "Plataforma de desarrollo BaaS", type: "TECHNICAL" as CompetencyType },
    { name: "Selenium", description: "Automatización de pruebas web", type: "TECHNICAL" as CompetencyType },
    { name: "Jest", description: "Testing unitario en JavaScript", type: "TECHNICAL" as CompetencyType },
    { name: "Cypress", description: "Testing E2E para aplicaciones web", type: "TECHNICAL" as CompetencyType },
    { name: "Linux", description: "Administración de servidores OS", type: "TECHNICAL" as CompetencyType },
    { name: "Jenkins", description: "Integración y entrega continua (CI/CD)", type: "TECHNICAL" as CompetencyType },
    { name: "Kubernetes", description: "Orquestación de contenedores", type: "TECHNICAL" as CompetencyType },
    { name: "Vue.js", description: "Framework progresivo de JavaScript", type: "TECHNICAL" as CompetencyType },
    { name: "Laravel", description: "Framework MVC para PHP", type: "TECHNICAL" as CompetencyType },
    { name: "PHP", description: "Programación del lado del servidor", type: "TECHNICAL" as CompetencyType },
    { name: "Liderazgo", description: "Capacidad para guiar y motivar equipos", type: "SOFT" as CompetencyType },
    { name: "Comunicación Asertiva", description: "Transmisión clara y efectiva de ideas", type: "SOFT" as CompetencyType },
    { name: "Trabajo en Equipo", description: "Colaboración armónica en proyectos", type: "SOFT" as CompetencyType },
    { name: "Resolución de Problemas", description: "Análisis lógico ante desafíos", type: "SOFT" as CompetencyType },
    { name: "Adaptabilidad", description: "Rápida adopción de nuevas tecnologías", type: "SOFT" as CompetencyType },
    { name: "Gestión del Tiempo", description: "Priorización de tareas y entregas", type: "SOFT" as CompetencyType },
  ];

  const competencies = await Promise.all(
    competenciesData.map((c) => prisma.competency.create({ data: c }))
  );
  console.log(`✅ Created ${competencies.length} competencies\n`);

  // 2. Create Members
  console.log("Creating members...");
  const membersData = [
    {
      fullName: "Administrador Pixel",
      institutionalEmail: "admin@unimayor.edu.co",
      personalEmail: "admin_personal@gmail.com",
      passwordHash: "admin123",
      professionalProfile: "Profesional enfocado en la dirección de proyectos tecnológicos y la innovación educativa. Con más de 5 años de experiencia liderando semilleros de investigación y articulando el talento universitario con las necesidades del sector productivo.",
      career: "Dirección de Proyectos",
      role: "Director de Innovación",
      systemRole: "ADMIN" as SystemRole,
      academicStatus: "GRADUATE" as AcademicStatus,
      photoUrl: "https://ui-avatars.com/api/?name=Admin+Pixel&background=F37021&color=fff&size=150",
      isBanned: false,
      cvUrl: "",
    },
    {
      fullName: "Johan Alvarez",
      institutionalEmail: "johan@unimayor.edu.co",
      personalEmail: "johan@gmail.com",
      passwordHash: "est123",
      professionalProfile: "Estudiante apasionado por la arquitectura de software y el despliegue de aplicaciones escalables. Disfruto construyendo soluciones robustas en el backend y optimizando procesos a través de la contenerización y el código limpio.",
      career: "Ingeniería Informática",
      role: "Arquitecto de Software",
      systemRole: "MEMBER" as SystemRole,
      academicStatus: "STUDENT" as AcademicStatus,
      photoUrl: "https://ui-avatars.com/api/?name=Johan+Alvarez&background=1E293B&color=fff&size=150",
      isBanned: false,
      cvUrl: "",
    },
    {
      fullName: "Isabella Velasco",
      institutionalEmail: "ivelasco@unimayor.edu.co",
      personalEmail: "isa@gmail.com",
      passwordHash: "est123",
      professionalProfile: "Desarrolladora Frontend con un fuerte enfoque en la experiencia de usuario (UX). Me especializo en crear interfaces accesibles, rápidas y visualmente atractivas utilizando el ecosistema de React y Next.js.",
      career: "Ingeniería Informática",
      role: "Frontend Developer",
      systemRole: "MEMBER" as SystemRole,
      academicStatus: "STUDENT" as AcademicStatus,
      photoUrl: "https://ui-avatars.com/api/?name=Isabella+Velasco&background=2D5A27&color=fff&size=150",
      isBanned: false,
      cvUrl: "",
    },
    {
      fullName: "Carlos Ruiz",
      institutionalEmail: "cruiz@unimayor.edu.co",
      personalEmail: "",
      passwordHash: "est123",
      professionalProfile: "Egresado especializado en la ingeniería de datos y el análisis predictivo. Mi objetivo es transformar datos crudos en información valiosa para la toma de decisiones estratégicas, utilizando Python y plataformas Cloud.",
      career: "Tecnología en Desarrollo de Software",
      role: "Ingeniero de Datos",
      systemRole: "MEMBER" as SystemRole,
      academicStatus: "GRADUATE" as AcademicStatus,
      photoUrl: "https://ui-avatars.com/api/?name=Carlos+Ruiz&background=F37021&color=fff&size=150",
      isBanned: false,
      cvUrl: "",
    },
    {
      fullName: "Ana Gómez",
      institutionalEmail: "agomez@unimayor.edu.co",
      personalEmail: "",
      passwordHash: "est123",
      professionalProfile: "Diseñadora de interfaces y experta en usabilidad. Me encanta combinar la psicología del color con estructuras de navegación intuitivas para lograr productos digitales accesibles y modernos. Destaco en la creación de sistemas de diseño.",
      career: "Diseño Visual",
      role: "Diseñadora UX/UI",
      systemRole: "MEMBER" as SystemRole,
      academicStatus: "STUDENT" as AcademicStatus,
      photoUrl: "https://ui-avatars.com/api/?name=Ana+Gomez&background=1E293B&color=fff&size=150",
      isBanned: false,
      cvUrl: "",
    },
    {
      fullName: "David Luna",
      institutionalEmail: "dluna@unimayor.edu.co",
      personalEmail: "",
      passwordHash: "est123",
      professionalProfile: "Apasionado por el desarrollo de aplicaciones móviles fluidas y eficientes. Mi experiencia se centra en Flutter y Dart, integrando bases de datos en tiempo real para asegurar la mejor experiencia desde el dispositivo del usuario.",
      career: "Tecnología en Desarrollo de Software",
      role: "Desarrollador Mobile",
      systemRole: "MEMBER" as SystemRole,
      academicStatus: "GRADUATE" as AcademicStatus,
      photoUrl: "https://ui-avatars.com/api/?name=David+Luna&background=2D5A27&color=fff&size=150",
      isBanned: false,
      cvUrl: "",
    },
    {
      fullName: "Sofía Castro",
      institutionalEmail: "scastro@unimayor.edu.co",
      personalEmail: "",
      passwordHash: "est123",
      professionalProfile: "Analista de Aseguramiento de Calidad (QA) enfocada en automatización. Me encargo de que cada producto que lanzamos sea robusto y libre de errores críticos mediante la implementación de pruebas unitarias y End-to-End.",
      career: "Ingeniería Informática",
      role: "Analista QA",
      systemRole: "MEMBER" as SystemRole,
      academicStatus: "STUDENT" as AcademicStatus,
      photoUrl: "https://ui-avatars.com/api/?name=Sofia+Castro&background=F37021&color=fff&size=150",
      isBanned: false,
      cvUrl: "",
    },
    {
      fullName: "Miguel Rojas",
      institutionalEmail: "mrojas@unimayor.edu.co",
      personalEmail: "",
      passwordHash: "est123",
      professionalProfile: "Ingeniero DevOps dedicado a optimizar el ciclo de vida del desarrollo. Automatizo procesos de integración y entrega continua (CI/CD) garantizando infraestructuras escalables y tolerantes a fallos en entornos de producción.",
      career: "Ingeniería Informática",
      role: "DevOps Engineer",
      systemRole: "MEMBER" as SystemRole,
      academicStatus: "GRADUATE" as AcademicStatus,
      photoUrl: "https://ui-avatars.com/api/?name=Miguel+Rojas&background=1E293B&color=fff&size=150",
      isBanned: false,
      cvUrl: "",
    },
    {
      fullName: "Laura Díaz",
      institutionalEmail: "ldiaz@unimayor.edu.co",
      personalEmail: "",
      passwordHash: "est123",
      professionalProfile: "Desarrolladora Fullstack con experiencia conectando arquitecturas backend tradicionales con modernas interfaces web. Mi versatilidad me permite adaptarme a cualquier fase del desarrollo de software.",
      career: "Tecnología en Desarrollo de Software",
      role: "Fullstack Developer",
      systemRole: "MEMBER" as SystemRole,
      academicStatus: "STUDENT" as AcademicStatus,
      photoUrl: "https://ui-avatars.com/api/?name=Laura+Diaz&background=2D5A27&color=fff&size=150",
      isBanned: false,
      cvUrl: "",
    },
  ];

  const members = await Promise.all(
    membersData.map((m) => prisma.member.create({ data: m }))
  );
  console.log(`✅ Created ${members.length} members\n`);

  // 3. Create Member-Competency relationships (implicit many-to-many)
  console.log("Creating member-competency relationships...");
  const memberCompetencies = [
    { memberId: members[0].id, competencyId: competencies[0].id }, // Admin: Gestión
    { memberId: members[0].id, competencyId: competencies[1].id }, // Admin: Estrategia
    { memberId: members[0].id, competencyId: competencies[25].id }, // Admin: Liderazgo
    { memberId: members[0].id, competencyId: competencies[26].id }, // Admin: Comunicación
    { memberId: members[1].id, competencyId: competencies[2].id }, // Johan: Node.js
    { memberId: members[1].id, competencyId: competencies[3].id }, // Johan: Docker
    { memberId: members[1].id, competencyId: competencies[4].id }, // Johan: MySQL
    { memberId: members[1].id, competencyId: competencies[29].id }, // Johan: Resolución de Problemas
    { memberId: members[1].id, competencyId: competencies[28].id }, // Johan: Trabajo en Equipo
    { memberId: members[2].id, competencyId: competencies[5].id }, // Isabella: React
    { memberId: members[2].id, competencyId: competencies[6].id }, // Isabella: Next.js
    { memberId: members[2].id, competencyId: competencies[7].id }, // Isabella: Tailwind
    { memberId: members[2].id, competencyId: competencies[26].id }, // Isabella: Comunicación
    { memberId: members[2].id, competencyId: competencies[30].id }, // Isabella: Adaptabilidad
    { memberId: members[3].id, competencyId: competencies[8].id }, // Carlos: Python
    { memberId: members[3].id, competencyId: competencies[9].id }, // Carlos: Pandas
    { memberId: members[3].id, competencyId: competencies[10].id }, // Carlos: AWS
    { memberId: members[3].id, competencyId: competencies[29].id }, // Carlos: Resolución de Problemas
    { memberId: members[4].id, competencyId: competencies[11].id }, // Ana: Figma
    { memberId: members[4].id, competencyId: competencies[12].id }, // Ana: CSS/SASS
    { memberId: members[4].id, competencyId: competencies[13].id }, // Ana: GSAP
    { memberId: members[4].id, competencyId: competencies[28].id }, // Ana: Trabajo en Equipo
    { memberId: members[5].id, competencyId: competencies[14].id }, // David: Flutter
    { memberId: members[5].id, competencyId: competencies[15].id }, // David: Dart
    { memberId: members[5].id, competencyId: competencies[16].id }, // David: Firebase
    { memberId: members[5].id, competencyId: competencies[31].id }, // David: Gestión del Tiempo
    { memberId: members[6].id, competencyId: competencies[17].id }, // Sofía: Selenium
    { memberId: members[6].id, competencyId: competencies[18].id }, // Sofía: Jest
    { memberId: members[6].id, competencyId: competencies[19].id }, // Sofía: Cypress
    { memberId: members[6].id, competencyId: competencies[29].id }, // Sofía: Resolución de Problemas
    { memberId: members[6].id, competencyId: competencies[26].id }, // Sofía: Comunicación
    { memberId: members[7].id, competencyId: competencies[20].id }, // Miguel: Linux
    { memberId: members[7].id, competencyId: competencies[21].id }, // Miguel: Jenkins
    { memberId: members[7].id, competencyId: competencies[22].id }, // Miguel: Kubernetes
    { memberId: members[7].id, competencyId: competencies[30].id }, // Miguel: Adaptabilidad
    { memberId: members[8].id, competencyId: competencies[23].id }, // Laura: Vue.js
    { memberId: members[8].id, competencyId: competencies[24].id }, // Laura: Laravel
    { memberId: members[8].id, competencyId: competencies[25].id }, // Laura: PHP
    { memberId: members[8].id, competencyId: competencies[28].id }, // Laura: Trabajo en Equipo
  ];

  // Connect competencies to members through the implicit many-to-many
  for (const mc of memberCompetencies) {
    await prisma.member.update({
      where: { id: mc.memberId },
      data: {
        competencies: {
          connect: { id: mc.competencyId },
        },
      },
    });
  }
  console.log(`✅ Created ${memberCompetencies.length} member-competency relationships\n`);

  // 4. Create ProfessionalLinks
  console.log("Creating professional links...");
  const linksData = [
    { memberId: members[1].id, platform: "GitHub", url: "https://github.com/johan" },
  ];

  for (const link of linksData) {
    await prisma.professionalLink.create({ data: link });
  }
  console.log(`✅ Created ${linksData.length} professional links\n`);

  // 5. Create Projects
  console.log("Creating projects...");
  const projectsData = [
    {
      title: "Pixel Core Engine",
      objective: "Desarrollar una plataforma web centralizada para la gestión, estructuración y visibilización de competencias y proyectos del semillero.",
      awards: "Mención de honor en Encuentro Regional de Semilleros RedCOLSI 2024",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-11-30"),
      createdBy: members[1].id, // Johan
      coverImageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      approvalStatus: "PENDING" as ApprovalStatus,
    },
    {
      title: "AgroTech Sensor AI",
      objective: "Implementar un sistema de monitoreo inteligente para predecir enfermedades en cultivos mediante sensores IoT y Machine Learning.",
      awards: "",
      startDate: new Date("2023-08-01"),
      endDate: new Date("2024-05-30"),
      createdBy: members[3].id, // Carlos
      coverImageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      approvalStatus: "ACTIVE" as ApprovalStatus,
    },
  ];

  const projects = await Promise.all(
    projectsData.map((p) => prisma.project.create({ data: p }))
  );
  console.log(`✅ Created ${projects.length} projects\n`);

  // 6. Create AcademicProducts
  console.log("Creating academic products...");
  const productsData = [
    {
      projectId: projects[0].id,
      title: "Plataforma Web Core Engine",
      description: "Una arquitectura limpia basada en contenedores Docker y microservicios. Implementa JWT para autenticación, Next.js para el renderizado del lado del servidor y MySQL.",
      categoryType: "DEVELOPMENT" as CategoryType,
      approvalStatus: "PENDING" as ApprovalStatus,
      technologies: ["Docker", "Express", "Next.js", "MySQL"],
      repositoryUrl: "https://github.com/pixel/core-engine",
      demoUrl: "https://pixel-demo.com",
    },
    {
      projectId: projects[1].id,
      title: "Sistema Predictivo IoT",
      description: "El sistema recopila datos de humedad y temperatura del suelo en tiempo real. Utiliza un modelo predictivo en Python (TensorFlow) para alertar a los agricultores.",
      categoryType: "DEVELOPMENT" as CategoryType,
      approvalStatus: "ACTIVE" as ApprovalStatus,
      technologies: ["Python", "IoT", "React", "TensorFlow"],
      repositoryUrl: "https://github.com/pixel/agrotech",
      demoUrl: "",
    },
  ];

  const products = await Promise.all(
    productsData.map((p) => prisma.academicProduct.create({ data: p }))
  );
  console.log(`✅ Created ${products.length} academic products\n`);

  // 7. Create Participations
  console.log("Creating participations...");
  const participationsData = [
    {
      memberId: members[1].id,
      productId: products[0].id,
      productRole: "Arquitecto de Software",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-11-30"),
    },
    {
      memberId: members[2].id,
      productId: products[0].id,
      productRole: "Frontend Developer",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-11-30"),
    },
    {
      memberId: members[3].id,
      productId: products[1].id,
      productRole: "Ingeniero de Datos",
      startDate: new Date("2023-08-01"),
      endDate: new Date("2024-05-30"),
    },
    {
      memberId: members[8].id,
      productId: products[1].id,
      productRole: "Fullstack Developer",
      startDate: new Date("2023-10-01"),
      endDate: new Date("2024-05-30"),
    },
  ];

  await Promise.all(
    participationsData.map((p) => prisma.participation.create({ data: p }))
  );
  console.log(`✅ Created ${participationsData.length} participations\n`);

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });