import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-surface-container-lowest p-8 rounded-xl shadow-xl border border-outline-variant w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display-lg text-primary mb-2">Acceso a Personal</h1>
          <p className="text-secondary text-sm">Ingresa tus credenciales para ver los registros</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
