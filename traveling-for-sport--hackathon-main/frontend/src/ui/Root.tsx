import { SocketProvider } from '@/sockets/SocketProvider';
import { useMemo, useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { Sun, Moon } from 'lucide-react';

export interface RootContext {
  isDark: boolean;
}

export function Root() {
  const socketUrls = useMemo(() => [], []);
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored ? stored === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const isWelcomePage = location.pathname === '/';
  const isSignupPage = location.pathname === '/signup';
  const isMatchPage = location.pathname.startsWith('/matches/');
  const hideNav = isWelcomePage || isSignupPage || isMatchPage;

  return (
    <SocketProvider urls={socketUrls}>
      <div className={`min-h-screen ${isDark ? 'bg-[#0f0f0f]' : 'bg-gray-100'} app-shell`}>
        {!hideNav && (
          <header
            className={`sticky top-0 z-20 border-b px-4 py-3 safe-top ${
              isDark ? 'bg-[#0f0f0f] border-white/10' : 'bg-white border-gray-200'
            }`}
            style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
          >
            <div className="flex items-center justify-between">
              <Link to="/home" className="flex items-center gap-2 min-h-[44px] min-w-[44px]">
                <span className="text-xl">⚽</span>
                <span className="text-lg font-bold text-[#22c55e]">
                  Traveling for Sports
                </span>
              </Link>

              <button
                onClick={() => setIsDark((prev) => !prev)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  isDark
                    ? 'bg-white/10 text-gray-300 hover:bg-white/15 hover:text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-900 shadow-sm border border-gray-200'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                {isDark ? 'Light' : 'Dark'}
              </button>
            </div>
          </header>
        )}

        <main>
          <Outlet context={{ isDark } satisfies RootContext} />
        </main>
      </div>
    </SocketProvider>
  );
}
