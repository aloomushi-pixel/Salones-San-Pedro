'use client';

import { useActionState } from 'react';
import { login } from '../actions';

const initialState = {
  error: '',
};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const result = await login(formData);
    if (result?.error) {
      return { error: result.error };
    }
    return { error: '' };
  }, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="bg-error/20 border border-error text-error p-3 rounded text-sm">
          {state.error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-secondary mb-1">Correo Electrónico</label>
        <input 
          required 
          name="email" 
          type="email" 
          className="w-full bg-surface border border-outline-variant rounded p-3 text-on-surface focus:outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-secondary mb-1">Contraseña</label>
        <input 
          required 
          name="password" 
          type="password" 
          className="w-full bg-surface border border-outline-variant rounded p-3 text-on-surface focus:outline-none focus:border-primary"
        />
      </div>
      <button 
        disabled={isPending}
        className="w-full bg-primary text-on-primary py-3 rounded font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
      >
        {isPending ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  );
}
