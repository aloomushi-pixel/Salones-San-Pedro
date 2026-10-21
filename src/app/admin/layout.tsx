import { logout } from './actions';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {user && (
        <nav className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-50 shadow-xs">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="font-display-lg text-lg font-extrabold text-slate-900 tracking-wide hover:text-amber-700 transition-colors"
            >
              SALONES SAN PEDRO • ADMIN
            </Link>
            <div className="hidden sm:flex items-center gap-5 border-l border-slate-200 pl-6 text-sm">
              <Link
                href="/admin"
                className="text-slate-700 hover:text-amber-700 transition-colors font-semibold"
              >
                Monitor UX / SEO &amp; Prospectos
              </Link>
              <Link
                href="/admin/correo"
                className="text-slate-600 hover:text-amber-700 transition-colors font-medium"
              >
                Bandeja de Correo
              </Link>
              <Link
                href="/"
                target="_blank"
                className="text-slate-600 hover:text-amber-700 transition-colors font-medium"
              >
                Ver Sitio Web ↗
              </Link>
            </div>
          </div>
          {/* Mobile Navigation */}
          <div className="flex sm:hidden gap-4 text-xs font-semibold">
            <Link href="/admin" className="text-slate-800 hover:text-amber-700">
              Monitor UX/SEO
            </Link>
            <Link href="/admin/correo" className="text-slate-600 hover:text-amber-700">
              Correo
            </Link>
            <Link href="/" target="_blank" className="text-slate-600 hover:text-amber-700">
              Sitio Web ↗
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              {user.email}
            </span>
            <form action={logout}>
              <button className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer">
                Cerrar Sesión
              </button>
            </form>
          </div>
        </nav>
      )}
      <main>{children}</main>
    </div>
  );
}
