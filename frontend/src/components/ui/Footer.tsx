import React from 'react';
import { Github, Linkedin, Mail, Globe } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-800/80 bg-gray-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Logo className="w-6 h-6" />
              <span className="text-sm font-semibold text-gray-200">Notes App</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Organiza tus ideas con un flujo rápido, limpio y elegante.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">Inicio</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">Dashboard</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">Notas</a>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://github.com/SantiCabrera19/notes-app" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-200 transition-colors">Repositorio</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">Changelog</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">Soporte</a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Redes</h4>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/SantiCabrera19"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-md bg-gray-900/60 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/santiago-emanuel-cabrera-0a1120238/"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-md bg-gray-900/60 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:"
                className="p-2 rounded-md bg-gray-900/60 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://notes-app-flax-eight.vercel.app/"
                className="p-2 rounded-md bg-gray-900/60 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                aria-label="Portfolio"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <span>© {new Date().getFullYear()} Notes App</span>
          <span className="mt-2 sm:mt-0">Hecho con ❤️ y TypeScript</span>
        </div>
      </div>
    </footer>
  );
};
