'use client';

import { useActionState } from 'react';
import { login } from '../actions';

const initialState = {
  error: '',
};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: typeof initialState, formData: FormData) => {
      const result = await login(formData);
      if (result?.error) {
        return { error: result.error };
      }
      return { error: '' };
    },
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-medium">
          {state.error}
        </div>
      )}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Correo Electrónico
        </label>
        <input
          required
          name="email"
          type="email"
          placeholder="correo@ejemplo.com"
          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-slate-900 text-sm focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Contraseña
        </label>
        <input
          required
          name="password"
          type="password"
          placeholder="••••••••"
          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-slate-900 text-sm focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20"
        />
      </div>
      <button
        disabled={isPending}
        className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50 cursor-pointer"
      >
        {isPending ? 'Ingresando...' : 'Ingresar al Monitor'}
      </button>
    </form>
  );
}
