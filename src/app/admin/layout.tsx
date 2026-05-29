import { logout } from './actions';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      {user && (
        <nav className="bg-primary text-on-primary px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display-lg text-xl tracking-wider hover:opacity-90 transition-opacity">
              SALONES SAN PEDRO
            </Link>
            <div className="hidden sm:flex items-center gap-4 border-l border-on-primary/30 pl-6 font-body-sm">
              <Link href="/admin" className="hover:opacity-80 transition-opacity font-semibold">
                Prospectos
              </Link>
              <Link href="/admin/correo" className="hover:opacity-80 transition-opacity font-semibold">
                Bandeja de Correo
              </Link>
            </div>
          </div>
          {/* Mobile Navigation */}
          <div className="flex sm:hidden gap-6 font-body-sm">
            <Link href="/admin" className="hover:opacity-80 transition-opacity font-semibold">
              Prospectos
            </Link>
            <Link href="/admin/correo" className="hover:opacity-80 transition-opacity font-semibold">
              Bandeja de Correo
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-body-sm opacity-80">{user.email}</span>
            <form action={logout}>
              <button className="bg-primary-container text-on-primary-container px-4 py-2 rounded text-sm font-bold hover:opacity-90">
                Salir
              </button>
            </form>
          </div>
        </nav>
      )}
      <main className="p-6">{children}</main>
    </div>
  );
}
