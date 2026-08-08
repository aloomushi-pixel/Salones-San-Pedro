'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { blogPosts } from '@/utils/blogData';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [blogMenuOpen, setBlogMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => {
    setIsOpen(false);
    setBlogMenuOpen(false);
  };

  const isBlogActive = pathname.startsWith('/blog');

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Navigation Bar */}
      <nav className="w-full flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 bg-surface/90 dark:bg-surface/90 backdrop-blur-md shadow-sm border-b border-outline-variant/10">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              alt="SALONES SAN PEDRO"
              className="h-12 w-auto cursor-pointer object-contain"
              src="/logo.svg"
              width={150}
              height={48}
              priority
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-body-md text-body-md">
          <div className="relative group">
            <button
              onClick={() => setBlogMenuOpen(!blogMenuOpen)}
              className={`flex items-center gap-1 transition-colors duration-300 ${
                isBlogActive
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Blog
              <span className="material-symbols-outlined text-xl">
                {blogMenuOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            
            {/* Desktop Dropdown */}
            {blogMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-surface shadow-lg border border-outline-variant/30 rounded-md overflow-hidden z-50 flex flex-col max-h-[400px]">
                <Link
                  href="/blog"
                  onClick={closeMenu}
                  className="px-4 py-3 border-b border-outline-variant/30 text-primary font-bold hover:bg-surface-container-lowest transition-colors"
                >
                  Ver todos los artículos
                </Link>
                <div className="overflow-y-auto overflow-x-hidden flex-1 py-2 custom-scrollbar">
                  {blogPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      onClick={closeMenu}
                      className="block px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-surface-container-lowest transition-colors truncate"
                      title={post.title}
                    >
                      {post.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <Link
            href="https://wa.me/526633670431?text=%C2%A1Hola!%20Visit%C3%A9%20su%20sitio%20web%20y%20me%20interesa%20agendar%20mi%20evento.%20%C2%BFMe%20podr%C3%ADan%20dar%20m%C3%A1s%20detalles%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-container text-on-primary-container px-6 py-3 font-label-sm rounded-lg hover:opacity-80 transition-all scale-95 active:scale-90 uppercase tracking-wider text-center block text-sm"
          >
            COTIZAR
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
        <div className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-outline-variant/30 py-6 px-margin-mobile flex flex-col gap-5 shadow-2xl animate-fade-in z-50 max-h-[80vh] overflow-y-auto">
          
          <button
            onClick={() => setBlogMenuOpen(!blogMenuOpen)}
            className="flex items-center justify-between py-2 text-lg border-b border-outline-variant/10 transition-colors duration-300 text-secondary hover:text-primary"
          >
            <span className={isBlogActive ? 'text-primary font-bold' : ''}>Blog</span>
            <span className="material-symbols-outlined">
              {blogMenuOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          
          {/* Mobile Accordion */}
          {blogMenuOpen && (
            <div className="flex flex-col gap-2 pl-4 border-l-2 border-outline-variant/20 -mt-2">
              <Link
                href="/blog"
                onClick={closeMenu}
                className="py-2 text-primary font-bold"
              >
                Ver todos los artículos
              </Link>
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  onClick={closeMenu}
                  className="py-2 text-sm text-secondary hover:text-primary truncate"
                >
                  {post.title}
                </Link>
              ))}
            </div>
          )}

          <Link
            href="https://wa.me/526633670431?text=%C2%A1Hola!%20Visit%C3%A9%20su%20sitio%20web%20y%20me%20interesa%20agendar%20mi%20evento.%20%C2%BFMe%20podr%C3%ADan%20dar%20m%C3%A1s%20detalles%3F"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="bg-primary-container text-on-primary-container px-6 py-4 font-label-sm rounded-lg hover:opacity-80 transition-all text-center uppercase tracking-wider block mt-3 font-bold"
          >
            COTIZAR
          </Link>
        </div>
      )}
    </header>
  );
}
