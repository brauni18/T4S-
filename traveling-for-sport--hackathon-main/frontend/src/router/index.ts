
import { Home } from '@/ui/pages/Home';
import { Blog } from '@/ui/pages/Blog';
import { Competitions } from '@/ui/pages/Competitions';
import { Competition } from '@/ui/pages/Competition';
import { AllTeams } from '@/ui/pages/AllTeams';
import { Teams } from '@/ui/pages/Teams';
import { Team } from '@/ui/pages/Team';
import { Match } from '@/ui/pages/Match';
import { Signup } from '@/ui/pages/Signup';
import { Welcome } from '@/ui/pages/Welcome';
import { NotFound } from '@/ui/pages/NotFound';
import { Root } from '@/ui/Root';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Welcome },
      { path: 'home', Component: Home },
      { path: 'blog', Component: Blog },
      { path: 'competitions', Component: Competitions },
      { path: 'competition/:competitionSlug', Component: Competition },
      { path: 'teams', Component: AllTeams },
      { path: 'teams/:sportSlug', Component: Teams },
      { path: 'teams/:sportSlug/:teamSlug', Component: Team },
      { path: 'matches/:id', Component: Match },
      { path: 'signup', Component: Signup }
    ]
  },
  {
    path: '*',
    Component: NotFound
  }
]);
