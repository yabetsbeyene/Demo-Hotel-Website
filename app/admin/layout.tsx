import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/sign-in');
  return children;
}
