import { BRAND } from '@/lib/brand';
import { Uploader } from './Uploader';

export const metadata = { title: `Upload your photos and videos — ${BRAND.name}`, robots: { index: false } };

export default async function UploadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <Uploader slug={slug} />;
}
