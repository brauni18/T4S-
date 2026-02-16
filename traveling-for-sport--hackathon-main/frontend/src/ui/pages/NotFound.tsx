import { Link } from 'react-router';

export function NotFound() {
  // const { sockets, getSocket } = useSockets();
  // const {statuses} = useSocketStatuses()

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#0f0f0f] text-white">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-gray-400 mb-4">Page Not Found</p>
      <Link to="/home" className="text-[#22c55e] hover:underline">Go to Home</Link>
    </div>
  );
}
