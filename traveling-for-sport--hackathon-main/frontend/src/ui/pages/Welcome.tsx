import { Button } from '@/shadcn/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLocation, setFavoriteTeams, setIsAdult21Plus } from '@/store/slices/user.slice';
import { Globe, User } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';

const COUNTRY_FLAG_CODES: Record<string, string> = {
  Israel: 'il',
  'United States': 'us',
  Mexico: 'mx',
  Canada: 'ca',
  Argentina: 'ar',
  Brazil: 'br',
  Chile: 'cl',
  Colombia: 'co',
  Uruguay: 'uy',
  England: 'gb-eng',
  Germany: 'de',
  France: 'fr',
  Spain: 'es',
  Italy: 'it',
  Netherlands: 'nl',
  Portugal: 'pt',
  Belgium: 'be',
  Croatia: 'hr',
  Poland: 'pl',
  Denmark: 'dk',
  Switzerland: 'ch',
  Austria: 'at',
  'Czech Republic': 'cz',
  Morocco: 'ma',
  Egypt: 'eg',
  Nigeria: 'ng',
  Ghana: 'gh',
  Senegal: 'sn',
  Japan: 'jp',
  'South Korea': 'kr',
  Iran: 'ir',
  'Saudi Arabia': 'sa',
  Qatar: 'qa',
  Australia: 'au',
  Russia: 'ru',
  Ukraine: 'ua',
  Turkey: 'tr',
  Greece: 'gr',
  Ireland: 'ie',
  Scotland: 'gb-sct',
  Wales: 'gb-wls',
  Sweden: 'se',
  Norway: 'no',
  Finland: 'fi',
  Iceland: 'is',
  Other: '',
};

const flagUrl = (code: string, w = 40) =>
  `https://flagcdn.com/w${w}/${code}.png`;

const COUNTRIES = Object.keys(COUNTRY_FLAG_CODES);

const WORLD_CUP_TEAMS = [
  'USA', 'Mexico', 'Canada', 'Argentina', 'Brazil', 'Chile', 'Colombia', 'Uruguay',
  'England', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Portugal', 'Belgium',
  'Croatia', 'Poland', 'Denmark', 'Switzerland', 'Austria', 'Czech Republic',
  'Morocco', 'Nigeria', 'Ghana', 'Senegal', 'Japan', 'South Korea', 'Iran', 'Saudi Arabia',
  'Qatar', 'Australia'
];

export function Welcome() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const savedTeams = useAppSelector((s) => s.user.favoriteTeams);
  const [country, setCountry] = useState('');
  const [favoriteTeams, setFavoriteTeamsState] = useState<string[]>([]);
  const [isAdult21Plus, setIsAdult21PlusLocal] = useState<boolean | null>(null);

  if (savedTeams.length > 0) {
    return <Navigate to="/home" replace />;
  }

  const handleTeamToggle = (team: string) => {
    setFavoriteTeamsState((prev) =>
      prev.includes(team)
        ? prev.filter((t) => t !== team)
        : prev.length < 5
          ? [...prev, team]
          : prev
    );
  };

  const handleContinue = () => {
    if (!country || favoriteTeams.length === 0 || isAdult21Plus === null) return;
    dispatch(setLocation(country));
    dispatch(setFavoriteTeams(favoriteTeams));
    dispatch(setIsAdult21Plus(isAdult21Plus));
    navigate('/home');
  };

  const canContinue = country && favoriteTeams.length > 0 && isAdult21Plus !== null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      {/* Top Bar */}
      <header className="relative flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h1 className="text-xl font-bold text-[#22c55e] tracking-tight">
          Traveling for Sports
        </h1>
        <img
          src="/logo.png"
          alt="Traveling for Sports"
          className="absolute left-1/2 -translate-x-1/2 h-12 w-auto object-contain max-h-12"
        />
        <Link
          to="/signup"
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Profile"
        >
          <User className="size-5 text-gray-400" />
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              World Cup 2026
            </h2>
            <p className="text-gray-400 text-base">
              Traveling for Sports — connect with fans around the world
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-10">
            {/* Question 1: Country with flags */}
            <div>
              <label className="block text-white font-semibold text-lg mb-4">
                1. Where are you from?
              </label>
              {country && COUNTRY_FLAG_CODES[country] && (
                <div className="flex items-center gap-2 mb-3 px-1">
                  <img
                    src={flagUrl(COUNTRY_FLAG_CODES[country])}
                    alt={country}
                    className="w-6 h-auto rounded-sm"
                  />
                  <span className="text-white text-sm font-medium">{country}</span>
                </div>
              )}
              <div
                role="listbox"
                aria-label="Select your country"
                tabIndex={0}
                className="max-h-56 overflow-y-auto bg-[#1a1a1a] border-2 border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e]"
              >
                {COUNTRIES.map((c) => {
                  const isSelected = country === c;
                  const code = COUNTRY_FLAG_CODES[c];
                  return (
                    <div
                      key={c}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={0}
                      onClick={() => setCountry(c)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          setCountry(c);
                        }
                      }}
                      className={`
                        px-4 py-3 cursor-pointer select-none transition-colors
                        flex items-center gap-3 border-b border-white/5 last:border-b-0
                        ${
                          isSelected
                            ? 'bg-[#22c55e]/30 text-[#22c55e]'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }
                      `}
                    >
                      {code ? (
                        <img
                          src={flagUrl(code)}
                          alt={c}
                          className="w-6 h-auto rounded-sm shrink-0"
                        />
                      ) : (
                        <Globe className="size-5 text-gray-500 shrink-0" />
                      )}
                      {c}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question 2: Teams - Multi-select Listbox */}
            <div>
              <label
                id="teams-label"
                className="block text-white font-semibold text-lg mb-4"
              >
                2. Which teams interest you?
              </label>
              <p className="text-gray-500 text-sm mb-2">
                Select multiple teams (up to 5)
              </p>
              <div
                role="listbox"
                aria-labelledby="teams-label"
                aria-multiselectable="true"
                tabIndex={0}
                className="max-h-56 overflow-y-auto bg-[#1a1a1a] border-2 border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e]"
              >
                {WORLD_CUP_TEAMS.map((team) => {
                  const isSelected = favoriteTeams.includes(team);
                  return (
                    <div
                      key={team}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={0}
                      onClick={() => handleTeamToggle(team)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          handleTeamToggle(team);
                        }
                      }}
                      className={`
                        px-4 py-3 cursor-pointer select-none transition-colors
                        flex items-center gap-3 border-b border-white/5 last:border-b-0
                        ${
                          isSelected
                            ? 'bg-[#22c55e]/30 text-[#22c55e]'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }
                        ${!isSelected && favoriteTeams.length >= 5 ? 'opacity-50 pointer-events-none' : ''}
                      `}
                    >
                      <span
                        className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center text-xs font-bold
                          ${isSelected ? 'bg-[#22c55e] border-[#22c55e] text-black' : 'border-gray-500'}
                        `}
                      >
                        {isSelected ? '✓' : ''}
                      </span>
                      {team}
                    </div>
                  );
                })}
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Selected: {favoriteTeams.length}/5
              </p>
            </div>

            {/* Question 3: Age - Two selection buttons */}
            <div>
              <label className="block text-white font-semibold text-lg mb-4">
                3. Are you 21 or older?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsAdult21PlusLocal(false)}
                  className={`
                    flex-1 py-3.5 px-4 rounded-xl font-medium transition-all
                    ${isAdult21Plus === false ? 'bg-[#22c55e] text-black' : 'bg-[#1a1a1a] text-gray-400 border border-white/15 hover:border-[#22c55e]/50'}
                  `}
                >
                  21-
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdult21PlusLocal(true)}
                  className={`
                    flex-1 py-3.5 px-4 rounded-xl font-medium transition-all
                    ${isAdult21Plus === true ? 'bg-[#22c55e] text-black' : 'bg-[#1a1a1a] text-gray-400 border border-white/15 hover:border-[#22c55e]/50'}
                  `}
                >
                  21+
                </button>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              className="w-full py-3.5 text-lg font-semibold bg-[#22c55e] hover:bg-[#1ea34e] text-black rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
          </form>
        </div>
      </main>

      {/* Bottom nav hint */}
      <footer className="px-6 py-4 border-t border-white/10">
        <div className="flex justify-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Globe className="size-3.5" />
            Traveling for Sports
          </span>
        </div>
      </footer>
    </div>
  );
}
