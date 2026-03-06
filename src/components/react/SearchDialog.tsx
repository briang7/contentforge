import { useEffect, useRef, useState, useCallback } from 'react';

export default function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handler);

    // Listen for search trigger button clicks
    const trigger = document.getElementById('search-trigger');
    if (trigger) {
      trigger.addEventListener('click', open);
    }

    return () => {
      document.removeEventListener('keydown', handler);
      if (trigger) {
        trigger.removeEventListener('click', open);
      }
    };
  }, [open]);

  // Initialize Pagefind when dialog opens
  useEffect(() => {
    if (!isOpen || !containerRef.current || initialized.current) return;

    const loadPagefind = async () => {
      try {
        // Load pagefind CSS
        if (!document.querySelector('link[href*="pagefind-ui.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = '/pagefind/pagefind-ui.css';
          document.head.appendChild(link);
        }

        // Load pagefind JS at runtime via script tag (avoids Vite/bundler issues)
        await new Promise<void>((resolve, reject) => {
          // Check if PagefindUI is already globally available
          if ((window as any).PagefindUI) {
            resolve();
            return;
          }
          const script = document.createElement('script');
          script.src = '/pagefind/pagefind-ui.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load pagefind'));
          document.head.appendChild(script);
        });

        const PagefindUI = (window as any).PagefindUI;
        if (PagefindUI && containerRef.current) {
          new PagefindUI({
            element: containerRef.current,
            showSubResults: true,
            showImages: false,
            autofocus: true,
          });
          initialized.current = true;
        } else {
          throw new Error('PagefindUI not found');
        }
      } catch {
        // Pagefind not available (dev mode or build issue)
        if (containerRef.current) {
          containerRef.current.innerHTML =
            '<p class="text-sm text-slate-400 p-4 text-center">Search is available after building the site<br/><code class="text-xs">npm run build && npm run preview</code></p>';
        }
      }
    };

    loadPagefind();
  }, [isOpen]);

  // Focus trap & body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) close();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="w-full max-w-2xl mx-4 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <span className="text-sm font-medium text-slate-300">
            Search documentation & blog
          </span>
          <button
            onClick={close}
            className="p-1 rounded text-slate-400 hover:text-slate-300 transition-colors"
            aria-label="Close search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div ref={containerRef} className="max-h-[60vh] overflow-y-auto p-4" />
        <div className="px-4 py-2 border-t border-slate-700 flex items-center justify-end gap-4 text-xs text-slate-400">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-700 font-mono">Esc</kbd> to close
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-700 font-mono">Ctrl K</kbd> to toggle
          </span>
        </div>
      </div>
    </div>
  );
}
