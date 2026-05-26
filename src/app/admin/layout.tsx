import { logout } from './actions';
import { createClient } from '@/utils/supabase/server';

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
        <nav className="bg-primary text-on-primary px-6 py-4 flex justify-between items-center shadow-md">
          <div className="font-display-lg text-xl tracking-wider">SALONES SAN PEDRO | DASHBOARD</div>
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
