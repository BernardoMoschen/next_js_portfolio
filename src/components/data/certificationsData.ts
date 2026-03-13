export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuerLogo?: string;
  date: string; // 'YYYY-MM'
  category: 'cloud' | 'devops' | 'language' | 'platform' | 'degree' | 'course';
  credentialUrl?: string;
  fileUrl?: string;
  badgeUrl?: string;
  featured?: boolean;
}

// Add your certifications here.
// - credentialUrl: link to online verification page (Credly, GitHub, etc.)
// - fileUrl: path under /public/ for PDFs or images, e.g. '/certifications/cert.pdf'
// - badgeUrl: badge image URL if available
export const certifications: Certification[] = [
  // ── Example entries — replace with your real credentials ──────────────────

  // {
  //   id: 'aws-saa',
  //   title: 'AWS Solutions Architect – Associate',
  //   issuer: 'Amazon Web Services',
  //   date: '2024-06',
  //   category: 'cloud',
  //   credentialUrl: 'https://www.credly.com/badges/...',
  //   badgeUrl: 'https://images.credly.com/size/340x340/images/...',
  //   featured: true,
  // },
  // {
  //   id: 'postgrad-software',
  //   title: 'Postgraduate Degree in Software Engineering',
  //   issuer: 'Universidade XYZ',
  //   date: '2023-12',
  //   category: 'degree',
  //   fileUrl: '/certifications/postgrad-software-engineering.pdf',
  // },
  // {
  //   id: 'github-foundations',
  //   title: 'GitHub Foundations',
  //   issuer: 'GitHub',
  //   date: '2024-09',
  //   category: 'platform',
  //   credentialUrl: 'https://www.credly.com/badges/...',
  // },
  // {
  //   id: 'node-course',
  //   title: 'Node.js: The Complete Guide',
  //   issuer: 'Udemy',
  //   date: '2022-03',
  //   category: 'course',
  //   credentialUrl: 'https://www.udemy.com/certificate/...',
  // },
];
