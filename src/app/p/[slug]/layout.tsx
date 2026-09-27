import type { Metadata } from 'next';

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function PartyLayout({ children }: { children: React.ReactNode }) {
  return <div className="party">{children}</div>;
}
