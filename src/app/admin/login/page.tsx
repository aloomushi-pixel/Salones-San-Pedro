import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            Panel de Administración
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
            Salones San Pedro Plus
          </h1>
          <p className="text-slate-500 text-sm">
            Ingresa tus credenciales para acceder al Monitor UX/SEO y Prospectos
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
