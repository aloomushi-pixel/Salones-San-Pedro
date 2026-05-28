'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const menuItems = [
    { name: 'Paquetes', href: '/#paquetes' },
    { name: 'Galería', href: '/#galeria' },
    { name: 'Gastronomía', href: '/#banquetes' },
    { name: 'Verificar espacio', href: '/#disponibilidad' },
    { name: 'Ubicación', href: '/#ubicacion' },
    { name: 'Testimonios', href: '/#testimonios' },
    { name: 'Blog', href: '/blog' },
  ];

  const isActive = (href: string) => {
    if (href === '/blog') {
      return pathname.startsWith('/blog');
    }
    // Anchor links on main page are only active if we are on root and the hash matches (approx)
    return false;
  };

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Announcement Bar */}
      <div className="w-full bg-error text-on-error py-3 px-4 text-center font-label-sm shadow-md">
        🚨 Fechas de temporada alta agotándose rápido. ¡Aparta tu fecha con precio especial este mes!
      </div>

      {/* Navigation Bar */}
      <nav className="w-full flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 bg-surface/90 dark:bg-surface/90 backdrop-blur-md shadow-sm border-b border-outline-variant/10">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <img
              alt="SALONES SAN PEDRO"
              className="h-12 w-auto cursor-pointer object-contain"
              src="/logo.svg"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-body-md text-body-md">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                className={`transition-colors duration-300 ${
                  active
                    ? 'text-primary font-bold border-b-2 border-primary pb-1'
                    : 'text-secondary hover:text-primary'
                }`}
                href={item.href}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <Link
            href="/#disponibilidad"
            className="bg-primary-container text-on-primary-container px-6 py-3 font-label-sm rounded-lg hover:opacity-80 transition-all scale-95 active:scale-90 uppercase tracking-wider text-center block text-sm"
          >
            COTIZAR EVENTO
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center p-2 text-secondary hover:text-primary focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined text-3.5xl">
            {isOpen ? 'close' : 'menu'}
          </span>
        </button>
      </nav>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-outline-variant/30 py-6 px-margin-mobile flex flex-col gap-5 shadow-2xl animate-fade-in z-50">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                className={`py-2 text-lg border-b border-outline-variant/10 transition-colors duration-300 ${
                  active ? 'text-primary font-bold' : 'text-secondary hover:text-primary'
                }`}
                href={item.href}
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            );
          })}
          <Link
            href="/#disponibilidad"
            onClick={closeMenu}
            className="bg-primary-container text-on-primary-container px-6 py-4 font-label-sm rounded-lg hover:opacity-80 transition-all text-center uppercase tracking-wider block mt-3 font-bold"
          >
            COTIZAR EVENTO
          </Link>
        </div>
      )}
    </header>
  );
}
