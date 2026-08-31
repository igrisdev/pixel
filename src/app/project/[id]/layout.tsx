import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL, SITE_NAME, absoluteUrl } from "@/lib/site";

type Params = { params: Promise<{ id: string }> };

// La página del proyecto es un componente cliente, así que los metadatos se
// generan aquí, en el servidor: es lo que leen Google y las redes sociales.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isFinite(projectId)) {
    return { title: "Proyecto no encontrado", robots: { index: false, follow: false } };
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        title: true,
        objective: true,
        coverImageUrl: true,
        approvalStatus: true,
        updatedAt: true,
        products: { select: { technologies: true } },
      },
    });

    if (!project) {
      return { title: "Proyecto no encontrado", robots: { index: false, follow: false } };
    }

    // Un proyecto sin aprobar no debe indexarse: aún no es contenido público.
    const isPublic = project.approvalStatus === "ACTIVE";

    const description = (project.objective || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160);

    const technologies = project.products
      .flatMap((p) => (Array.isArray(p.technologies) ? (p.technologies as string[]) : []))
      .filter(Boolean);

    const url = absoluteUrl(`/project/${projectId}`);
    const image = project.coverImageUrl
      ? project.coverImageUrl.startsWith("http")
        ? project.coverImageUrl
        : absoluteUrl(project.coverImageUrl)
      : undefined;

    return {
      title: project.title,
      description,
      keywords: technologies.length > 0 ? technologies : undefined,
      alternates: { canonical: `/project/${projectId}` },
      robots: isPublic ? undefined : { index: false, follow: false },
      openGraph: {
        type: "article",
        title: project.title,
        description,
        url,
        siteName: SITE_NAME,
        locale: "es_CO",
        images: image ? [{ url: image, alt: project.title }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: project.title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: "Proyecto" };
  }
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = Number(id);

  let jsonLd: Record<string, unknown> | null = null;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        title: true,
        objective: true,
        coverImageUrl: true,
        startDate: true,
        updatedAt: true,
        approvalStatus: true,
        creator: { select: { fullName: true } },
      },
    });

    if (project && project.approvalStatus === "ACTIVE") {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.objective,
        url: absoluteUrl(`/project/${projectId}`),
        dateCreated: project.startDate?.toISOString(),
        dateModified: project.updatedAt?.toISOString(),
        image: project.coverImageUrl || undefined,
        author: { "@type": "Person", name: project.creator?.fullName },
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "es-CO",
      };
    }
  } catch {
    jsonLd = null;
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
