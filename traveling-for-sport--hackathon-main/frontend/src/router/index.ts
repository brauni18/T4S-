
import { Home } from '@/ui/pages/Home';
import { Competition } from '@/ui/pages/Competition';
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
      { path: 'competition/:competitionSlug', Component: Competition },
      { path: 'signup', Component: Signup }
    ]
  },
  {
    path: '*',
    Component: NotFound
  }
]);
