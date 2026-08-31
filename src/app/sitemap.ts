import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

// Se regenera cada hora: así los proyectos y perfiles nuevos entran al sitemap
// sin necesidad de volver a desplegar.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    // Solo contenido público: proyectos aprobados e integrantes activos.
    const [projects, members] = await Promise.all([
      prisma.project.findMany({
        where: { approvalStatus: "ACTIVE" },
        select: { id: true, updatedAt: true },
      }),
      prisma.member.findMany({
        where: { isBanned: false, systemRole: "MEMBER" },
        select: { id: true, updatedAt: true },
      }),
    ]);

    return [
      ...staticRoutes,
      ...projects.map((p) => ({
        url: `${SITE_URL}/project/${p.id}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.9,
      })),
      ...members.map((m) => ({
        url: `${SITE_URL}/profile/${m.id}`,
        lastModified: m.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    // Si la base de datos no está disponible (por ejemplo durante el build),
    // devolvemos al menos las rutas estáticas en vez de romper el despliegue.
    return staticRoutes;
  }
}
