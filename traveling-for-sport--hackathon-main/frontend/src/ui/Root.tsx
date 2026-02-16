import { SocketProvider } from '@/sockets/SocketProvider';
import { useMemo, useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation} from 'react-router';
import { Sun, Moon, Search, X } from 'lucide-react';

export interface RootContext {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
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

  // const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const isWelcomePage = location.pathname === '/';
  const isSignupPage = location.pathname === '/signup';
  const isMatchPage = location.pathname.startsWith('/matches/');
  const isTeamPage = /^\/teams\/[^/]+\/[^/]+/.test(location.pathname);
  const hideNav = isWelcomePage || isSignupPage || isMatchPage || isTeamPage;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: navigate to search results page
      // navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      console.log('Search:', searchQuery.trim());
    }
  };

  // Keyboard shortcut: Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <Link to="/home" className="flex items-center gap-2 min-h-[44px] min-w-[44px] shrink-0">
                <span className="text-xl">⚽</span>
                <span className="text-lg font-bold text-[#22c55e] hidden sm:inline">
                  Traveling for Sports
                </span>
              </Link>

              {/* Search Bar */}
              <form
                onSubmit={handleSearch}
                className={`flex items-center flex-1 max-w-md mx-auto rounded-full border transition-all ${
                  searchFocused
                    ? isDark
                      ? 'border-[#22c55e]/60 bg-white/10 ring-1 ring-[#22c55e]/30'
                      : 'border-[#22c55e]/60 bg-white ring-1 ring-[#22c55e]/30'
                    : isDark
                      ? 'border-white/10 bg-white/5 hover:bg-white/10'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <Search
                  className={`size-4 ml-3 shrink-0 transition-colors ${
                    searchFocused
                      ? 'text-[#22c55e]'
                      : isDark
                        ? 'text-gray-500'
                        : 'text-gray-400'
                  }`}
                />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search matches, teams, cities..."
                  className={`w-full bg-transparent border-none outline-none px-3 py-2 text-sm placeholder:text-gray-500 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchRef.current?.focus();
                    }}
                    className={`mr-1 p-1 rounded-full transition-colors ${
                      isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                    }`}
                  >
                    <X className="size-3.5" />
                  </button>
                )}
                <kbd
                  className={`hidden sm:flex items-center mr-3 px-1.5 py-0.5 text-[10px] font-medium rounded border shrink-0 ${
                    isDark
                      ? 'border-white/10 text-gray-500 bg-white/5'
                      : 'border-gray-200 text-gray-400 bg-gray-100'
                  }`}
                >
                  Ctrl K
                </kbd>
              </form>

              {/* Theme toggle */}
              <button
                onClick={() => setIsDark((prev) => !prev)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
                  isDark
                    ? 'bg-white/10 text-gray-300 hover:bg-white/15 hover:text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-900 shadow-sm border border-gray-200'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </header>
        )}

        <main>
          <Outlet context={{ isDark, setIsDark } satisfies RootContext} />
        </main>
      </div>
    </SocketProvider>
  );
}
