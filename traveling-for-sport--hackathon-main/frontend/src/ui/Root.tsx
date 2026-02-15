import { SocketProvider } from '@/sockets/SocketProvider';
import { useMemo } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { MapPin, Home, Map, User } from 'lucide-react';

export function Root() {
  const socketUrls = useMemo(() => [], []);
  const location = useLocation();

  const isWelcomePage = location.pathname === '/';
  const isSignupPage = location.pathname === '/signup';
  const isMatchPage = location.pathname.startsWith('/matches/');
  const hideNav = isWelcomePage || isSignupPage || isMatchPage;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-1 py-2 min-h-[44px] min-w-[44px] px-3 text-xs transition-colors ${
      isActive ? 'text-[#22c55e]' : 'text-gray-500'
    }`;

  return (
    <SocketProvider urls={socketUrls}>
      <div className="min-h-screen bg-[#0f0f0f] app-shell">
        {!hideNav && (
          <header
            className="sticky top-0 z-20 bg-[#0f0f0f] border-b border-white/10 px-4 py-3 safe-top"
            style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
          >
            <div className="flex items-center justify-between">
              <Link to="/map" className="flex items-center gap-2 min-h-[44px] min-w-[44px]">
                <span className="text-xl">⚽</span>
                <span className="text-lg font-bold text-[#22c55e] truncate max-w-[180px]">
                  Traveling for Sports
                </span>
              </Link>
            </div>
          </header>
        )}

        <main className="bottom-nav-spacer">
          <Outlet />
        </main>

        {!hideNav && (
          <nav
            className="fixed bottom-0 left-0 right-0 z-30 bg-[#0f0f0f] border-t border-white/10 flex items-center justify-around safe-bottom max-w-[430px] mx-auto"
            style={{
              paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
              paddingLeft: 'max(0.5rem, env(safe-area-inset-left))',
              paddingRight: 'max(0.5rem, env(safe-area-inset-right))',
            }}
          >
            <NavLink to="/map" className={navLinkClass}>
              <MapPin className="size-5" />
              <span>Map</span>
            </NavLink>
            <NavLink to="/signup" className={navLinkClass}>
              <User className="size-5" />
              <span>Profile</span>
            </NavLink>
          </nav>
        )}
      </div>
    </SocketProvider>
  );
}
