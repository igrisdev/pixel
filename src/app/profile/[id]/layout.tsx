import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL, SITE_NAME, absoluteUrl } from "@/lib/site";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const memberId = Number(id);

  if (!Number.isFinite(memberId)) {
    return { title: "Perfil no encontrado", robots: { index: false, follow: false } };
  }

  try {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: {
        fullName: true,
        role: true,
        career: true,
        professionalProfile: true,
        photoUrl: true,
        isBanned: true,
        competencies: { select: { name: true } },
      },
    });

    if (!member) {
      return { title: "Perfil no encontrado", robots: { index: false, follow: false } };
    }

    const title = member.role
      ? `${member.fullName} — ${member.role}`
      : member.fullName;

    const description = (
      member.professionalProfile ||
      `${member.fullName}, integrante del Semillero Pixel de UNIMAYOR. ${member.career || ""}`
    )
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160);

    const image = member.photoUrl
      ? member.photoUrl.startsWith("http")
        ? member.photoUrl
        : absoluteUrl(member.photoUrl)
      : undefined;

    return {
      title,
      description,
      keywords: member.competencies.map((c) => c.name),
      alternates: { canonical: `/profile/${memberId}` },
      // Un integrante vetado deja de ser contenido público.
      robots: member.isBanned ? { index: false, follow: false } : undefined,
      openGraph: {
        type: "profile",
        title,
        description,
        url: absoluteUrl(`/profile/${memberId}`),
        siteName: SITE_NAME,
        locale: "es_CO",
        images: image ? [{ url: image, alt: member.fullName }] : undefined,
      },
      twitter: {
        card: "summary",
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: "Perfil" };
  }
}

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memberId = Number(id);

  let jsonLd: Record<string, unknown> | null = null;

  try {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: {
        fullName: true,
        role: true,
        career: true,
        professionalProfile: true,
        photoUrl: true,
        isBanned: true,
        links: { select: { url: true } },
        competencies: { select: { name: true } },
      },
    });

    if (member && !member.isBanned) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: member.fullName,
        jobTitle: member.role || undefined,
        description: member.professionalProfile || undefined,
        image: member.photoUrl || undefined,
        url: absoluteUrl(`/profile/${memberId}`),
        sameAs: member.links.map((l) => l.url).filter(Boolean),
        knowsAbout: member.competencies.map((c) => c.name),
        affiliation: { "@id": `${SITE_URL}/#organization` },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Institución Universitaria Colegio Mayor del Cauca",
        },
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
