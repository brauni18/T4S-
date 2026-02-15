import { Button } from '@/shadcn/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/user.slice';
import { User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

export function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const userId = crypto.randomUUID();
    const displayName = email.split('@')[0];

    dispatch(
      setUser({
        id: userId,
        name: displayName,
        favoriteTeams: [],
        location: ''
      })
    );

    navigate('/home');
  };

  const canSubmit = email && password;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link to="/" className="text-xl font-bold text-[#22c55e] tracking-tight">
          Traveling for Sports
        </Link>
        <span className="p-2 rounded-full bg-white/5">
          <User className="size-5 text-gray-400" />
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Sign up</h2>
            <p className="text-gray-400 text-sm">
              Create an account to connect with sports fans
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-white/15 rounded-xl text-white
                  focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent
                  placeholder:text-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-white/15 rounded-xl text-white
                  focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent
                  placeholder:text-gray-500"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-3.5 text-lg font-semibold bg-[#22c55e] hover:bg-[#1ea34e] text-black rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign up
            </Button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/" className="text-[#22c55e] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
