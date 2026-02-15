import { Button } from '@/shadcn/components/ui/button';
import { SocketProvider } from '@/sockets/SocketProvider';
import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router';

export function Root() {
  // insert urls to create a socket connection to here
  const socketUrls = useMemo(() => [], []);
  const user = useAppSelector((store) => store.user);
  const location = useLocation();
  
  const isWelcomePage = location.pathname === '/';
  const isSignupPage = location.pathname === '/signup';
  const hideNav = isWelcomePage || isSignupPage;

  return (
    <SocketProvider urls={socketUrls}>
      <div className="min-h-screen bg-[#0f0f0f]">
        {!hideNav && (
          <nav className="bg-[#0f0f0f] border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <Link to="/home" className="flex items-center space-x-2">
                  <span className="text-2xl">⚽</span>
                  <span className="text-xl font-bold text-[#22c55e]">Traveling for Sports</span>
                </Link>

                <div className="flex items-center space-x-4">
                  {user.name && (
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-gray-400">
                        Welcome, <span className="font-semibold text-white">{user.name}</span>
                      </div>
                      {user.favoriteTeams.length > 0 && (
                        <div className="text-xs text-gray-500">
                          🏆 {user.favoriteTeams.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                  <Link to="/signup">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        )}

        <Outlet />
      </div>
    </SocketProvider>
  );
}
