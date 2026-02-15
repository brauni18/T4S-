import { useGetMatchByIdQuery } from '@/store/apis/matches.api';
import {
  ArrowLeft,
  Building2,
  MessageCircle,
  MapPin,
  Plane,
  UtensilsCrossed,
  Bus,
  Landmark,
  Hotel,
  ExternalLink,
  FileText,
  Quote,
  X,
  ImageIcon
} from 'lucide-react';
import { MapHeatmap } from '@/ui/components/MapHeatmap';
import { useRef, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Circle, MapContainer, TileLayer } from 'react-leaflet';

/** Demo venue coordinates. Images in each folder are placed within 200m of these points. */
const VENUES = {
  SoldierField: { lat: 41.8624515, lng: -87.6167151 },
  EmiratesStadium: { lat: 51.5550404, lng: -0.1083997 }
} as const;

// Eager glob: any image in these folders becomes a demo point within 200m of the venue
const emiratesGlob = import.meta.glob<{ default: string }>('@/assets/EmiratesStadium/*', {
  eager: true,
  query: '?url'
});
const soldierFieldGlob = import.meta.glob<{ default: string }>('@/assets/SoldierField/*', {
  eager: true,
  query: '?url'
});

/** Meters to lat/lng offset; lng scaled by cos(lat). */
function offsetByMetersForLat(lat: number, lng: number, metersNorth: number, metersEast: number) {
  const degPerMLat = 1 / 111320;
  const degPerMLng = 1 / (111320 * Math.cos((lat * Math.PI) / 180));
  return {
    lat: lat + metersNorth * degPerMLat,
    lng: lng + metersEast * degPerMLng
  };
}

/** Place N points within 200m radius (demo). */
function pointsWithin200m(
  venue: { lat: number; lng: number },
  count: number
): Array<{ lat: number; lng: number }> {
  const out: Array<{ lat: number; lng: number }> = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI;
    const r = 50 + (i * 37) % 151;
    const mN = r * Math.cos(angle);
    const mE = r * Math.sin(angle);
    out.push(offsetByMetersForLat(venue.lat, venue.lng, mN, mE));
  }
  return out;
}

function buildInitialFanPosts(): FanPost[] {
  const posts: FanPost[] = [];
  let id = 0;
  const emiratesUrls = Object.values(emiratesGlob).map((m) => (typeof m === 'string' ? m : (m as { default: string }).default));
  const emiratesPoints = pointsWithin200m(VENUES.EmiratesStadium, emiratesUrls.length);
  emiratesUrls.forEach((url, i) => {
    posts.push({
      id: `demo-emirates-${id++}`,
      ...emiratesPoints[i],
      imageUrl: url
    });
  });
  const soldierUrls = Object.values(soldierFieldGlob).map((m) => (typeof m === 'string' ? m : (m as { default: string }).default));
  const soldierPoints = pointsWithin200m(VENUES.SoldierField, soldierUrls.length);
  soldierUrls.forEach((url, i) => {
    posts.push({
      id: `demo-soldier-${id++}`,
      ...soldierPoints[i],
      imageUrl: url
    });
  });
  return posts;
}

/** Zoom 17 = small radius (tight spot), zoom 12 = large radius (whole area). */
function getSpotRadiusDeg(zoom: number): number {
  const min = 0.0008;
  const max = 0.012;
  const z = Math.max(10, Math.min(18, zoom));
  return max - ((z - 10) / 8) * (max - min);
}

/** Approx meters per degree at mid-latitudes. */
const METERS_PER_DEG = 111320;

function distanceDeg(lat1: number, lng1: number, lat2: number, lng2: number): number {
  return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
}

interface FanPost {
  id: string;
  lat: number;
  lng: number;
  imageUrl: string;
}

function getTeamAbbr(teamName: string): string {
  const words = teamName.trim().split(/\s+/);
  if (words.length >= 2 && words[0].length <= 2) return words[0].toUpperCase();
  const first = words[0] ?? teamName;
  return first.slice(0, 3).toUpperCase();
}

const TRIP_OPTIONS = [
  {
    title: 'Hotels',
    description: `Stay near the venue`,
    icon: Hotel,
    iconBg: 'bg-[#4285f4]'
  },
  {
    title: 'Flights',
    description: 'Fly to the host city',
    icon: Plane,
    iconBg: 'bg-[#34a8eb]'
  },
  {
    title: 'Attractions',
    description: 'Things to see & do',
    icon: Landmark,
    iconBg: 'bg-[#9966ff]'
  },
  {
    title: 'Restaurants',
    description: 'Eat & drink nearby',
    icon: UtensilsCrossed,
    iconBg: 'bg-[#ff9933]'
  },
  {
    title: 'Transport',
    description: 'Getting around',
    icon: Bus,
    iconBg: 'bg-[#009900]'
  }
];

/** Default map center (Emirates). Map shows all demo points; user can pan to Soldier Field. */
const DEFAULT_MAP_CENTER: [number, number] = [VENUES.EmiratesStadium.lat, VENUES.EmiratesStadium.lng];

const INITIAL_FAN_POSTS: FanPost[] = buildInitialFanPosts();

export function Match() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetMatchByIdQuery(id!);
  const [showFanChat, setShowFanChat] = useState(false);
  const [fanChatTab, setFanChatTab] = useState<'home' | 'away'>('home');

  const [fanPosts, setFanPosts] = useState<FanPost[]>(INITIAL_FAN_POSTS);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [showSpotPhotosModal, setShowSpotPhotosModal] = useState(false);
  const [spotCenter, setSpotCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [spotRadiusDeg, setSpotRadiusDeg] = useState<number>(0.005);
  const [locationError, setLocationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingPositionRef = useRef<{ lat: number; lng: number } | null>(null);

  const mapPoints = fanPosts.map((p) => ({ lat: p.lat, lng: p.lng, weight: 1 }));

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a] text-[#a0a0a0]">
        Loading match details...
      </div>
    );
  if (error || !data)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a] text-red-500">
        Error loading match
      </div>
    );

  const { match, forumPosts } = data;
  const homeAbbr = getTeamAbbr(match.homeTeam);
  const awayAbbr = getTeamAbbr(match.awayTeam);
  const matchDate = new Date(match.date);
  const timeStr = matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = matchDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e0e0e0]">
      <div className="mx-auto max-w-2xl px-4 pb-24">
        {/* Top nav */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#2d2d2d] bg-[#1a1a1a] py-4">
          <Link to="/" className="flex items-center gap-2 text-white">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">World Cup</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
            <span className="text-xs font-bold uppercase tracking-wide text-white">LIVE</span>
          </div>
        </header>

        {/* Scorecard */}
        <section className="mt-6 rounded-2xl border border-[#333] bg-[#282828] p-6">
          <div className="flex flex-col items-center gap-6">
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3a3a3a] text-lg font-bold text-white">
                  {homeAbbr}
                </div>
                <span className="text-center text-sm font-medium text-white">{match.homeTeam}</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center leading-none">
                  <span className="text-4xl font-bold text-[#66ff00]">vs</span>
                </div>
                <span className="rounded-lg bg-[#b33c3c] px-3 py-1 text-sm font-semibold text-white">
                  {dateStr} · {timeStr}
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3a3a3a] text-lg font-bold text-white">
                  {awayAbbr}
                </div>
                <span className="text-center text-sm font-medium text-white">{match.awayTeam}</span>
              </div>
            </div>

            <div className="h-px w-full bg-[#3a3a3a]" />
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#a0a0a0]">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-white" />
                {match.venue}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-white" />
                {match.city}
              </span>
            </div>
          </div>
        </section>

        {/* Plan your trip */}
        <h2 className="mt-10 text-lg font-bold uppercase tracking-wide text-white">
          Plan your trip
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {TRIP_OPTIONS.map((opt) => (
            <div
              key={opt.title}
              className="flex rounded-xl bg-[#2b2b2b] p-4 text-left transition-opacity hover:opacity-90"
            >
              <div className="flex flex-1 flex-col gap-1">
                <div
                  className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${opt.iconBg} text-white`}
                >
                  <opt.icon className="h-5 w-5" />
                </div>
                <span className="font-semibold text-white">{opt.title}</span>
                <span className="text-xs text-[#a0a0a0]">{opt.description}</span>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-[#606060]" />
            </div>
          ))}
        </div>

        {/* What People Are Saying */}
        <button
          type="button"
          onClick={() => setShowFanChat(true)}
          className="mt-10 flex w-full items-center gap-4 rounded-2xl bg-[#2d2d2d] p-4 text-left shadow-lg transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-10 w-10 shrink-0 text-[#8bc34a]" strokeWidth={2} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[#e0e0e0]">What People Are Saying</p>
            <p className="text-sm text-[#a0a0a0]">
              Join the {match.homeTeam} or {match.awayTeam} fan chat
            </p>
          </div>
          <span className="text-[#e0e0e0]">→</span>
        </button>

        {/* City Guides & Tips */}
        <div className="mt-8 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#8bc34a]" />
          <h2 className="text-lg font-semibold text-[#e0e0e0]">City Guides & Tips</h2>
        </div>
        <div className="mt-3 flex flex-col items-center justify-center rounded-2xl bg-[#2d2d2d] py-12 px-4">
          <FileText className="mb-3 h-14 w-14 text-[#606060] opacity-40" />
          <p className="text-[#a0a0a0]">No guides yet for this game.</p>
          <p className="mt-1 text-sm text-[#808080]">Check back closer to matchday!</p>
        </div>

        {/* Fan Reviews */}
        <div className="mt-8 flex items-center gap-2">
          <Quote className="h-5 w-5 text-[#8bc34a]" />
          <h2 className="text-lg font-semibold text-[#e0e0e0]">Fan Reviews</h2>
        </div>
        <div className="mt-3 flex flex-col items-center justify-center rounded-2xl bg-[#2d2d2d] py-12 px-4">
          <Quote className="mb-3 h-14 w-14 text-[#606060] opacity-40" />
          <p className="text-[#a0a0a0]">No reviews yet for this game.</p>
        </div>

        {/* Where fans are posting — real map heatmap (warmer = more posts from that area) */}
        <div className="mt-8 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[#8bc34a]" />
          <h2 className="text-lg font-semibold text-[#e0e0e0]">Where fans are posting</h2>
        </div>
        <div className="mt-3 flex flex-col rounded-2xl overflow-hidden bg-[#2d2d2d]">
          {!showSpotPhotosModal ? (
            <MapHeatmap
              center={DEFAULT_MAP_CENTER}
              zoom={17}
              points={mapPoints}
              className="h-[320px] w-full"
              onMapClick={(lat, lng, zoom) => {
                setSpotCenter({ lat, lng });
                setSpotRadiusDeg(getSpotRadiusDeg(zoom));
                setShowSpotPhotosModal(true);
              }}
            />
          ) : (
            <div className="h-[320px] w-full bg-[#252525]" aria-hidden />
          )}
          <p className="py-3 px-4 text-center text-sm text-[#a0a0a0]">
            Warmer areas = more photos & videos from fans. Tap a spot to see photos from that area.
          </p>
          <div className="border-t border-[#3a3a3a] px-4 pb-4 pt-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                const pos = pendingPositionRef.current;
                if (!file || !pos) return;
                const url = URL.createObjectURL(file);
                setPreviewPhotoUrl(url);
                setPreviewPosition(pos);
                setShowPreviewModal(true);
                pendingPositionRef.current = null;
                e.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => {
                setLocationError(null);
                if (!navigator.geolocation) {
                  setLocationError('Location is not supported by your browser.');
                  return;
                }
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    pendingPositionRef.current = coords;
                    setPreviewPosition(coords);
                    fileInputRef.current?.click();
                  },
                  (err) => {
                    const msg =
                      err.code === 1
                        ? 'Location access is required to post a photo to the map.'
                        : 'Could not get your location. Please try again.';
                    setLocationError(msg);
                  },
                  { enableHighAccuracy: true }
                );
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3a3a3a] py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <ImageIcon className="h-4 w-4" />
              Take a photo to upload to the map
            </button>
            {locationError && (
              <p className="mt-2 text-center text-xs text-[#ef4444]">{locationError}</p>
            )}
          </div>
        </div>

        {/* Forum posts count - optional subtle link to scroll or keep legacy behavior */}
        {forumPosts.length > 0 && (
          <div className="mt-8 rounded-2xl bg-[#2d2d2d] p-4">
            <p className="text-sm text-[#a0a0a0]">
              {forumPosts.length} discussion{forumPosts.length !== 1 ? 's' : ''} in fan chat
            </p>
          </div>
        )}
      </div>

      {/* Photo preview modal — after taking photo, show image and Post */}
      {showPreviewModal && previewPhotoUrl && previewPosition && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#1a1a1a]">
          <header className="flex items-center justify-between border-b border-[#2d2d2d] bg-[#202324] px-4 py-4">
            <button
              type="button"
              onClick={() => {
                URL.revokeObjectURL(previewPhotoUrl);
                setPreviewPhotoUrl(null);
                setPreviewPosition(null);
                setShowPreviewModal(false);
              }}
              className="text-white"
              aria-label="Cancel"
            >
              <X className="h-5 w-5" />
            </button>
            <span className="font-semibold text-white">Post to map</span>
            <button
              type="button"
              onClick={() => {
                setFanPosts((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    lat: previewPosition.lat,
                    lng: previewPosition.lng,
                    imageUrl: previewPhotoUrl
                  }
                ]);
                setPreviewPhotoUrl(null);
                setPreviewPosition(null);
                setShowPreviewModal(false);
              }}
              className="text-[#60f031] font-semibold"
            >
              Post
            </button>
          </header>
          <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
            <img
              src={previewPhotoUrl}
              alt="Preview"
              className="max-h-full w-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Spot photos modal — map at top, then photos in the clicked area */}
      {showSpotPhotosModal && spotCenter && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#1a1a1a]">
          <header className="flex shrink-0 items-center justify-between border-b border-[#2d2d2d] bg-[#202324] px-4 py-4">
            <button
              type="button"
              onClick={() => {
                setShowSpotPhotosModal(false);
                setSpotCenter(null);
              }}
              className="text-white"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-white">Photos in this area</h1>
            <div className="w-5" />
          </header>
          <div className="flex-1 overflow-auto">
            <div className="h-48 w-full shrink-0 overflow-hidden border-b border-[#2d2d2d]">
              <MapContainer
                center={[spotCenter.lat, spotCenter.lng]}
                zoom={18}
                scrollWheelZoom={false}
                className="h-full w-full"
                style={{ background: '#1a1a1a' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <Circle
                  center={[spotCenter.lat, spotCenter.lng]}
                  radius={spotRadiusDeg * METERS_PER_DEG}
                  pathOptions={{ color: '#8bc34a', fillColor: '#8bc34a', fillOpacity: 0.25, weight: 2 }}
                />
              </MapContainer>
            </div>
            <div className="p-4">
              {(() => {
                const inArea = fanPosts.filter(
                  (p) =>
                    distanceDeg(p.lat, p.lng, spotCenter.lat, spotCenter.lng) <= spotRadiusDeg
                );
                if (inArea.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <ImageIcon className="mb-3 h-14 w-14 text-[#606060] opacity-60" />
                      <p className="text-[#a0a0a0]">No photos posted in this spot yet.</p>
                    </div>
                  );
                }
                return (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {inArea.map((post) => (
                      <div key={post.id} className="aspect-square overflow-hidden rounded-lg bg-[#2d2d2d]">
                        <img
                          src={post.imageUrl}
                          alt="Fan post"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Fan Chat overlay */}
      {showFanChat && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#181a1b]">
          <header className="flex items-center justify-between border-b border-[#2d2d2d] bg-[#202324] px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFanChat(false)}
                className="text-white"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-white">Fan Chat</h1>
                <p className="text-sm text-[#a0a0a0]">
                  {match.homeTeam} vs {match.awayTeam}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowFanChat(false)}
              className="text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="border-b border-[#2d2d2d] bg-[#202324]">
            <div className="flex">
              <button
                type="button"
                onClick={() => setFanChatTab('home')}
                className={`flex-1 py-3 text-center text-sm font-medium ${
                  fanChatTab === 'home' ? 'text-[#60f031]' : 'text-[#a0a0a0]'
                }`}
              >
                {match.homeTeam} Fans
              </button>
              <button
                type="button"
                onClick={() => setFanChatTab('away')}
                className={`flex-1 py-3 text-center text-sm font-medium ${
                  fanChatTab === 'away' ? 'text-[#60f031]' : 'text-[#a0a0a0]'
                }`}
              >
                {match.awayTeam} Fans
              </button>
            </div>
            <div className="flex">
              <div
                className={`h-0.5 flex-1 bg-[#60f031] transition-opacity ${fanChatTab === 'home' ? 'opacity-100' : 'opacity-0'}`}
              />
              <div
                className={`h-0.5 flex-1 bg-[#60f031] transition-opacity ${fanChatTab === 'away' ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <MessageCircle className="mb-4 h-16 w-16 text-[#606060]" />
            <p className="text-[#a0a0a0]">No messages yet.</p>
            <p className="mt-1 text-sm text-[#808080]">Be the first to start the conversation!</p>
          </div>

          <div className="border-t border-[#2d2d2d] bg-[#282b2d] py-4 text-center">
            <p className="text-sm text-[#a0a0a0]">Sign in to join the conversation</p>
          </div>
        </div>
      )}
    </div>
  );
}
