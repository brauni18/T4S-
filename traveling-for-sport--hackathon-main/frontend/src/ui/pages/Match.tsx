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
  FileText,
  Quote,
  X,
  ImageIcon,
  Star,
  Thermometer,
  Train,
  Shield,
  Search,
  Sun,
  Moon,
  Send,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { MapHeatmap } from '@/ui/components/MapHeatmap';
import { SportsSidebar } from '@/ui/components/SportsSidebar';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useParams, Link, useOutletContext } from 'react-router';
import { Circle, MapContainer, TileLayer } from 'react-leaflet';
import type { RootContext } from '@/ui/Root';

const CITY_IMAGES: Record<string, string> = {
  Dallas: 'https://images.unsplash.com/photo-1570089858244-60b098be72b2?w=800&h=350&fit=crop&q=80',
  'New York': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=350&fit=crop&q=80',
  'East Rutherford, NJ': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=350&fit=crop&q=80',
  'Los Angeles': 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&h=350&fit=crop&q=80',
  Miami: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800&h=350&fit=crop&q=80',
  Philadelphia: 'https://images.unsplash.com/photo-1569761316261-9a8696fa2ca3?w=800&h=350&fit=crop&q=80',
  Toronto: 'https://images.unsplash.com/photo-1517090504611-1c0f3e8d3fca?w=800&h=350&fit=crop&q=80',
  'Mexico City': 'https://images.unsplash.com/photo-1518659526054-190340b32735?w=800&h=350&fit=crop&q=80',
  Seattle: 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=800&h=350&fit=crop&q=80',
  Chicago: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=350&fit=crop&q=80',
};

/** Known venue coordinates for World Cup 2026 and demo venues */
const VENUE_COORDS: Record<string, { lat: number; lng: number }> = {
  'AT&T Stadium': { lat: 32.7473, lng: -97.0945 },
  'MetLife Stadium': { lat: 40.8128, lng: -74.0742 },
  'SoFi Stadium': { lat: 33.9535, lng: -118.3392 },
  'Hard Rock Stadium': { lat: 25.958, lng: -80.2389 },
  'Lincoln Financial Field': { lat: 39.9008, lng: -75.1675 },
  'BMO Field': { lat: 43.6332, lng: -79.4186 },
  'Estadio Azteca': { lat: 19.3029, lng: -99.1505 },
  'Lumen Field': { lat: 47.5952, lng: -122.3316 },
  'Soldier Field': { lat: 41.8624, lng: -87.6167 },
  'Gillette Stadium': { lat: 42.0909, lng: -71.2643 },
  'NRG Stadium': { lat: 29.6847, lng: -95.4107 },
  'Mercedes-Benz Stadium': { lat: 33.7554, lng: -84.4010 },
  'Emirates Stadium': { lat: 51.5550, lng: -0.1084 },
};

/** Fallback for unknown venues */
const DEFAULT_VENUE = { lat: 40.8128, lng: -74.0742 }; // MetLife

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

/** Simple seeded pseudo-random number generator (mulberry32) */
function seededRandom(seed: number) {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** Place N points scattered randomly within a radius (in meters) around a venue. */
function pointsAroundVenue(
  venue: { lat: number; lng: number },
  count: number,
  radiusMeters = 500
): Array<{ lat: number; lng: number }> {
  const out: Array<{ lat: number; lng: number }> = [];
  for (let i = 0; i < count; i++) {
    const angle = seededRandom(i * 7 + 13) * 2 * Math.PI;
    const r = 30 + seededRandom(i * 31 + 97) * (radiusMeters - 30);
    const mN = r * Math.cos(angle);
    const mE = r * Math.sin(angle);
    out.push(offsetByMetersForLat(venue.lat, venue.lng, mN, mE));
  }
  return out;
}

/** Sample text posts that fans might write at a stadium */
const FAN_TEXT_POSTS = [
  'Amazing atmosphere here! The crowd is electric!',
  'Just arrived at the stadium, can\'t wait for kickoff!',
  'The food stalls near gate 3 are incredible',
  'What a view from the upper deck! Worth the climb',
  'Pre-game warmups happening now, both teams look sharp',
  'Security lines moving fast, got in within 10 mins',
  'Found the perfect spot near the away fans section',
  'This stadium is absolutely massive in person',
  'Half-time thoughts: what a game so far!',
  'The singing hasn\'t stopped since the first whistle',
  'Local tip: the street food outside gate A is way better than inside',
  'First time at this ground - the atmosphere is unreal',
  'Just scored!! The noise level is off the charts!',
  'Post-match: incredible experience, already planning the next trip',
  'The sunset over the stadium right now is stunning 🌅',
];

function buildInitialFanPosts(venue: { lat: number; lng: number }): FanPost[] {
  let id = 0;

  const allImageUrls = [
    ...Object.values(emiratesGlob).map((m) =>
      typeof m === 'string' ? m : (m as { default: string }).default
    ),
    ...Object.values(soldierFieldGlob).map((m) =>
      typeof m === 'string' ? m : (m as { default: string }).default
    ),
  ];

  const totalCount = allImageUrls.length + FAN_TEXT_POSTS.length;
  const allPoints = pointsAroundVenue(venue, totalCount);

  const imagePosts: FanPost[] = allImageUrls.map((url, i) => ({
    id: `demo-img-${id++}`,
    ...allPoints[i],
    imageUrl: url
  }));

  const textPosts: FanPost[] = FAN_TEXT_POSTS.map((text, i) => ({
    id: `demo-txt-${id++}`,
    ...allPoints[allImageUrls.length + i],
    text
  }));

  const merged: FanPost[] = [];
  let imgIdx = 0;
  let txtIdx = 0;
  while (imgIdx < imagePosts.length || txtIdx < textPosts.length) {
    if (imgIdx < imagePosts.length) merged.push(imagePosts[imgIdx++]);
    if (imgIdx < imagePosts.length) merged.push(imagePosts[imgIdx++]);
    if (txtIdx < textPosts.length) merged.push(textPosts[txtIdx++]);
  }

  return merged;
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
  imageUrl?: string;
  text?: string;
}

function getTeamAbbr(teamName: string): string {
  const words = teamName.trim().split(/\s+/);
  if (words.length >= 2 && words[0].length <= 2) return words[0].toUpperCase();
  const first = words[0] ?? teamName;
  return first.slice(0, 3).toUpperCase();
}

const TEAM_FLAGS: Record<string, string> = {
  'Mexico': '🇲🇽',
  'Germany': '🇩🇪',
  'USA': '🇺🇸',
  'United States': '🇺🇸',
  'Brazil': '🇧🇷',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Japan': '🇯🇵',
  'France': '🇫🇷',
  'Argentina': '🇦🇷',
  'Spain': '🇪🇸',
  'Netherlands': '🇳🇱',
  'Canada': '🇨🇦',
  'Morocco': '🇲🇦',
  'Portugal': '🇵🇹',
  'South Korea': '🇰🇷',
  'Belgium': '🇧🇪',
  'Nigeria': '🇳🇬',
  'Italy': '🇮🇹',
  'Croatia': '🇭🇷',
  'Uruguay': '🇺🇾',
  'Colombia': '🇨🇴',
  'Senegal': '🇸🇳',
  'Australia': '🇦🇺',
  'Switzerland': '🇨🇭',
  'Denmark': '🇩🇰',
  'Poland': '🇵🇱',
  'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Serbia': '🇷🇸',
  'Ghana': '🇬🇭',
  'Cameroon': '🇨🇲',
  'Ecuador': '🇪🇨',
  'Saudi Arabia': '🇸🇦',
  'Iran': '🇮🇷',
  'Tunisia': '🇹🇳',
  'Costa Rica': '🇨🇷',
  'Qatar': '🇶🇦',
  'Chile': '🇨🇱',
  'Paraguay': '🇵🇾',
  'Peru': '🇵🇪',
  'Sweden': '🇸🇪',
  'Austria': '🇦🇹',
  'Czech Republic': '🇨🇿',
  'Turkey': '🇹🇷',
  'Norway': '🇳🇴',
  'Ireland': '🇮🇪',
  'Egypt': '🇪🇬',
  'Algeria': '🇩🇿',
  'China': '🇨🇳',
  'India': '🇮🇳',
  'Honduras': '🇭🇳',
  'Jamaica': '🇯🇲',
  'Panama': '🇵🇦',
  'El Salvador': '🇸🇻',
  'New Zealand': '🇳🇿',
};

function getTeamFlag(teamName: string): string | null {
  return TEAM_FLAGS[teamName] ?? null;
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

/** Cache of fan posts keyed by venue name, so we don't regenerate on every render */
const fanPostsCache = new Map<string, FanPost[]>();
function getFanPostsForVenue(venueName: string): FanPost[] {
  const cached = fanPostsCache.get(venueName);
  if (cached) return cached;
  const coords = VENUE_COORDS[venueName] ?? DEFAULT_VENUE;
  const posts = buildInitialFanPosts(coords);
  fanPostsCache.set(venueName, posts);
  return posts;
}

/* ─── City Guides & Tips ─── */
interface CityGuide {
  icon: 'weather' | 'transport' | 'food' | 'safety';
  title: string;
  content: string;
}

const CITY_GUIDES: Record<string, CityGuide[]> = {
  Dallas: [
    { icon: 'weather', title: 'Beat the Texas Heat', content: 'June temperatures in Dallas regularly hit 95-100 °F (35-38 °C). Bring sunscreen, a hat, and a refillable water bottle. AT&T Stadium is fully air-conditioned, but the walk from parking can be brutal.' },
    { icon: 'transport', title: 'Getting to AT&T Stadium', content: 'The TRE (Trinity Railway Express) runs between Dallas and Fort Worth with a stop near the stadium. Ride-share drop-off zones are on Randol Mill Road. If driving, expect $40-60 parking and heavy traffic on I-30.' },
    { icon: 'food', title: 'Where to Eat', content: 'Don\'t miss Dallas BBQ — Pecan Lodge and Terry Black\'s are local legends. For Tex-Mex, head to the Bishop Arts District. Near the stadium, the Arlington entertainment district has dozens of restaurants within walking distance.' },
    { icon: 'safety', title: 'Stay Safe', content: 'Heat-related illness is the #1 concern. Drink water constantly and seek shade. The stadium has a clear bag policy — only bags 12" × 6" × 12" or smaller are allowed. Arrive early to avoid security line waits.' },
  ],
  'New York': [
    { icon: 'weather', title: 'NYC in June', content: 'Expect warm, pleasant weather around 75-85 °F (24-29 °C). Occasional afternoon thunderstorms are possible, so pack a light rain jacket. Evenings are perfect for exploring the city on foot.' },
    { icon: 'transport', title: 'Getting to MetLife Stadium', content: 'NJ Transit runs special event trains from Penn Station (30 min, ~$10). Shuttle buses depart from Port Authority. Avoid driving — parking is $40+ and traffic on the NJ Turnpike is brutal on game days.' },
    { icon: 'food', title: 'Where to Eat', content: 'Manhattan has everything: dollar pizza slices, Michelin-starred restaurants, and iconic delis like Katz\'s. In East Rutherford near the stadium, try the American Dream mall food hall. Don\'t skip a classic NYC bagel for breakfast.' },
    { icon: 'safety', title: 'City Tips', content: 'MetLife has a clear bag policy. Keep valuables secure in crowded transit. Times Square is fun but overpriced — locals eat in Hell\'s Kitchen, the West Village, or Koreatown instead. Download the MTA app for real-time subway info.' },
  ],
  'East Rutherford, NJ': [
    { icon: 'weather', title: 'NYC-Area Weather', content: 'Expect warm, pleasant weather around 75-85 °F (24-29 °C). Occasional afternoon thunderstorms are possible, so pack a light rain jacket. Evenings are perfect for exploring nearby NYC.' },
    { icon: 'transport', title: 'Getting to MetLife Stadium', content: 'NJ Transit runs special event trains from Penn Station (30 min, ~$10). Shuttle buses depart from Port Authority. Avoid driving — parking is $40+ and traffic on the NJ Turnpike is brutal on game days.' },
    { icon: 'food', title: 'Where to Eat', content: 'Head to Manhattan for world-class dining: dollar pizza slices, iconic delis like Katz\'s, and diverse cuisines from every corner of the globe. Near the stadium, the American Dream mall food hall has plenty of options.' },
    { icon: 'safety', title: 'Stadium Tips', content: 'MetLife has a clear bag policy. Keep valuables secure in crowded transit. Download the NJ Transit app for real-time train info. The stadium area can be chilly at night even in summer — bring a light layer.' },
  ],
  'Los Angeles': [
    { icon: 'weather', title: 'SoCal Sunshine', content: 'June in LA is warm and sunny, 70-80 °F (21-27 °C). Mornings can be overcast ("June Gloom") but it burns off by noon. Sunscreen is essential — UV levels are intense even when it feels mild.' },
    { icon: 'transport', title: 'Getting to SoFi Stadium', content: 'Take the Metro C Line to Downtown Inglewood station, then walk or shuttle. Ride-share has a dedicated lot on Prairie Ave. If driving, pre-purchase parking ($60-80) through the SoFi app — no cash lots.' },
    { icon: 'food', title: 'Where to Eat', content: 'LA is a taco paradise — try street tacos in East LA or Grand Central Market downtown. Near SoFi, the Hollywood Park area has upscale dining. For classic LA, visit In-N-Out, Pink\'s Hot Dogs, or the food scene on Sawtelle Blvd.' },
    { icon: 'safety', title: 'Getting Around', content: 'LA traffic is legendary — leave 2 hours early for any game. The clear bag policy applies at SoFi. Uber/Lyft surge pricing spikes post-match, so consider the Metro. Stay hydrated — the walk from parking can be long.' },
  ],
  Miami: [
    { icon: 'weather', title: 'Tropical Heat & Storms', content: 'June in Miami is HOT and humid: 85-95 °F (29-35 °C) with daily afternoon thunderstorms. Games may have rain delays. Bring a poncho (no umbrellas in the stadium) and stay hydrated — the humidity makes it feel over 100 °F.' },
    { icon: 'transport', title: 'Getting to Hard Rock Stadium', content: 'The stadium is in Miami Gardens, 30 min north of South Beach. Ride-share is the easiest option ($25-40 from downtown). Limited public transit — the 297 bus runs from Government Center. Pre-paid parking is $40-60.' },
    { icon: 'food', title: 'Where to Eat', content: 'Miami\'s food scene is world-class: Cuban sandwiches and cafecito in Little Havana (Versailles is iconic), fresh ceviche in Wynwood, stone crab at Joe\'s. Near the stadium, options are limited — eat in the city before heading out.' },
    { icon: 'safety', title: 'Local Tips', content: 'Sunburn happens fast — even cloudy days have intense UV. Hard Rock Stadium has a clear bag policy. After the match, avoid South Beach traffic by heading to Wynwood or Brickell instead. Keep an eye on the weather radar for storms.' },
  ],
  Philadelphia: [
    { icon: 'weather', title: 'Philly in June', content: 'Warm and sometimes humid, 75-85 °F (24-29 °C). Comfortable for outdoor events but occasional afternoon thunderstorms pop up. The stadium has limited covered seating, so check the forecast.' },
    { icon: 'transport', title: 'Getting to Lincoln Financial Field', content: 'SEPTA\'s Broad Street Line goes directly to NRG Station at the Sports Complex. It\'s the easiest and cheapest option ($2.50). From Center City it\'s a 15-minute ride. Parking is $25-40 at the stadium lots.' },
    { icon: 'food', title: 'Where to Eat', content: 'Get a cheesesteak at Pat\'s or Geno\'s (locals prefer John\'s Roast Pork or Jim\'s on South St). Reading Terminal Market is a must for breakfast. In the stadium area, Xfinity Live! has restaurants and bars right outside.' },
    { icon: 'safety', title: 'Fan Tips', content: 'Philly fans are passionate — join the tailgate culture in the stadium parking lots! The clear bag policy applies. Center City is very walkable. Don\'t skip the Rocky Steps at the Art Museum — it\'s a 5-minute detour.' },
  ],
  Toronto: [
    { icon: 'weather', title: 'Toronto in June', content: 'Pleasant and mild, 65-75 °F (18-24 °C). Perfect weather for walking the city. Evenings can be cool, so bring a light jacket. Rain is possible but rarely heavy.' },
    { icon: 'transport', title: 'Getting to BMO Field', content: 'BMO Field is at Exhibition Place, right on the waterfront. Take the 509 or 510 streetcar from Union Station (5 min). It\'s also walkable from downtown along the lakeshore trail. Parking is limited — transit is strongly recommended.' },
    { icon: 'food', title: 'Where to Eat', content: 'Toronto is one of the world\'s most diverse food cities. Try poutine at Smoke\'s Poutinerie, dim sum in Chinatown, or jerk chicken on Eglinton West. St. Lawrence Market is perfect for pre-match bites. Kensington Market has amazing street food.' },
    { icon: 'safety', title: 'Visitor Tips', content: 'Toronto is consistently rated one of the safest major cities in North America. TTC day passes ($13.50 CAD) are great value. Note: USD goes far here. Don\'t miss the CN Tower view — book SkyPod tickets in advance to skip lines.' },
  ],
  'Mexico City': [
    { icon: 'weather', title: 'Rainy Season Alert', content: 'June is rainy season in Mexico City: 65-75 °F (18-24 °C) with daily afternoon downpours. Mornings are usually sunny. Pack a rain jacket and waterproof shoes. The altitude (7,350 ft) means UV is intense — wear sunscreen.' },
    { icon: 'transport', title: 'Getting to Estadio Azteca', content: 'Metro Line 2 (Taxqueña direction) to Estadio Azteca station drops you right at the gates. It\'s cheap (5 pesos) and efficient. Uber/DiDi is also easy and affordable ($5-10 from Centro). Avoid driving — traffic and parking are chaotic on match days.' },
    { icon: 'food', title: 'Where to Eat', content: 'Mexico City is a food paradise: tacos al pastor at El Huequito, churros at El Moro, or mole at a Oaxacan restaurant in Roma Norte. Street food is safe and incredible — look for busy stands. Near the stadium, vendors sell elotes, esquites, and tortas.' },
    { icon: 'safety', title: 'Altitude & Safety', content: 'The 7,350 ft altitude can cause headaches and shortness of breath — take it easy the first day, drink lots of water, and avoid alcohol. Use registered taxis or ride-share apps. The tourist areas (Roma, Condesa, Centro) are very safe. Learn a few Spanish phrases — locals appreciate the effort.' },
  ],
  Seattle: [
    { icon: 'weather', title: 'Pacific Northwest Summer', content: 'June in Seattle is one of the best months: 60-72 °F (16-22 °C) with long sunny days (sunset after 9 PM!). Rain is actually rare in June despite Seattle\'s reputation. Pack layers — mornings can be cool.' },
    { icon: 'transport', title: 'Getting to Lumen Field', content: 'Lumen Field is right downtown, next to Pioneer Square. Take the Link Light Rail to Stadium station — it\'s a 2-minute walk. The Seattle Streetcar and buses also stop nearby. Walking from most downtown hotels takes 10-20 minutes.' },
    { icon: 'food', title: 'Where to Eat', content: 'Pike Place Market is a must — try Beecher\'s mac & cheese, fresh Dungeness crab, and the original Starbucks. For pre-game, Pioneer Square has great gastropubs. Seattle\'s Asian food scene (International District) is exceptional.' },
    { icon: 'safety', title: 'Local Tips', content: 'Pioneer Square can be rough at night — stick to well-lit areas. Lumen Field has a clear bag policy. The waterfront and Pike Place are walkable from the stadium. Consider a harbor cruise for incredible city and mountain views.' },
  ],
  Chicago: [
    { icon: 'weather', title: 'Chicago Summer', content: 'June in Chicago is warm and beautiful, 70-85 °F (21-29 °C). Lake Michigan keeps things breezy near the waterfront. Soldier Field is lakeside, so it can feel cooler — bring a light layer for evening matches.' },
    { icon: 'transport', title: 'Getting to Soldier Field', content: 'Take the CTA bus #146 from downtown or the Metra Electric line to Museum Campus/11th St station. The #130 express bus runs on game days. Parking is extremely limited — public transit or ride-share is essential.' },
    { icon: 'food', title: 'Where to Eat', content: 'Chicago is a food city: deep-dish pizza at Lou Malnati\'s or Pequod\'s, Italian beef at Al\'s #1, and hot dogs at Portillo\'s (no ketchup!). The South Loop near Soldier Field has great brunch spots and breweries.' },
    { icon: 'safety', title: 'Game Day Tips', content: 'Soldier Field tailgating is legendary — arrive early for the parking lot atmosphere. The clear bag policy applies. The Museum Campus area (Field Museum, Shedd Aquarium) is great for pre-game exploring. Download the Ventra app for easy CTA transit.' },
  ],
};

/* ─── Fan Reviews ─── */
interface FanReview {
  author: string;
  location: string;
  rating: number;
  text: string;
  daysAgo: number;
}

function generateFanReviews(city: string, venue: string, homeTeam: string, awayTeam: string): FanReview[] {
  const venueReviews: Record<string, FanReview[]> = {
    'AT&T Stadium': [
      { author: 'Mike T.', location: 'Houston, TX', rating: 5, text: `AT&T Stadium is absolutely massive — the retractable roof is a lifesaver in Dallas heat. The giant video board is unlike anything else in sports. ${homeTeam} fans were incredible, non-stop chanting!`, daysAgo: 3 },
      { author: 'Rosa M.', location: 'Monterrey, Mexico', rating: 4, text: `Traveled from Mexico for the ${homeTeam} vs ${awayTeam} match. The stadium is stunning but food prices are steep ($15 for a beer!). The atmosphere was electric — fans from both sides were passionate and friendly.`, daysAgo: 7 },
      { author: 'James K.', location: 'Dallas, TX', rating: 4, text: 'Local tip: take the TRE train and avoid the parking nightmare. The stadium itself is world-class. Seats in the upper deck still have great views thanks to the massive screen. AC inside is a blessing.', daysAgo: 12 },
    ],
    'MetLife Stadium': [
      { author: 'Sarah W.', location: 'Brooklyn, NY', rating: 4, text: `MetLife is huge and modern with great sightlines. Getting there from Manhattan via NJ Transit was smooth. The ${homeTeam} supporters section was rocking — you could feel the energy throughout the entire stadium!`, daysAgo: 2 },
      { author: 'Paulo R.', location: 'São Paulo, Brazil', rating: 5, text: `Flew in for ${homeTeam} vs ${awayTeam} and it was worth every penny. The stadium handled the World Cup crowd perfectly. NYC itself is an incredible host city — so much to do before and after the match.`, daysAgo: 5 },
      { author: 'Hannah L.', location: 'London, UK', rating: 3, text: 'The stadium is fine but the location in New Jersey feels disconnected from NYC. Plan your transport carefully — surge pricing after the match was insane. Inside, the facilities are clean and the views are solid from every level.', daysAgo: 9 },
    ],
    'SoFi Stadium': [
      { author: 'Carlos D.', location: 'Los Angeles, CA', rating: 5, text: `SoFi is the most futuristic stadium I\'ve ever been to. The Infinity Screen is jaw-dropping. ${homeTeam} vs ${awayTeam} had an incredible atmosphere — LA showed up! Just leave early for traffic.`, daysAgo: 1 },
      { author: 'Yuki S.', location: 'Tokyo, Japan', rating: 5, text: `Traveled from Japan for the World Cup and SoFi exceeded every expectation. The stadium design is breathtaking. LA weather was perfect. The ${awayTeam} fan section was amazing — we sang for 90 minutes straight!`, daysAgo: 4 },
      { author: 'David P.', location: 'Inglewood, CA', rating: 4, text: 'Great stadium but parking is expensive ($80!) and the exit traffic took 2 hours. Take the Metro C Line instead. Inside, the food options are much better than most stadiums — try the local food vendors on the concourse.', daysAgo: 8 },
    ],
    'Hard Rock Stadium': [
      { author: 'Ana G.', location: 'Miami, FL', rating: 4, text: `The canopy structure keeps sun off most seats which is crucial in Miami heat. ${homeTeam} fans traveled well and created an amazing atmosphere. The stadium renovation looks great — much improved from the old days.`, daysAgo: 2 },
      { author: 'Pierre L.', location: 'Paris, France', rating: 5, text: `Came from France for ${homeTeam} vs ${awayTeam}. Miami is an incredible host city — South Beach, Little Havana, amazing nightlife. The stadium atmosphere was World Cup level. Just prepare for the humidity!`, daysAgo: 6 },
      { author: 'Diego C.', location: 'Buenos Aires, Argentina', rating: 4, text: `Hard Rock Stadium is solid but getting there is tough — Uber took forever after the match. The ${awayTeam} supporters were passionate and loud. Miami\'s Cuban food alone is worth the trip.`, daysAgo: 10 },
    ],
    'Lincoln Financial Field': [
      { author: 'Tom B.', location: 'Philadelphia, PA', rating: 5, text: `The Linc is an incredible venue for football. Philly fans bring unmatched energy — the tailgate before ${homeTeam} vs ${awayTeam} was legendary. SEPTA gets you right to the door. Don\'t skip the cheesesteaks!`, daysAgo: 3 },
      { author: 'Katrin M.', location: 'Berlin, Germany', rating: 4, text: `Really enjoyed the Philadelphia atmosphere — the city has great history and food. The stadium is well-designed with good views from every seat. ${awayTeam} fans were well-represented in our section.`, daysAgo: 7 },
      { author: 'Chris R.', location: 'Camden, NJ', rating: 4, text: 'Philly fans are intense in the best way — the energy was incredible. Xfinity Live! next to the stadium is perfect for pre-game drinks. The stadium food has improved a lot — try the Chickie\'s & Pete\'s crab fries.', daysAgo: 14 },
    ],
    'BMO Field': [
      { author: 'Amir H.', location: 'Toronto, ON', rating: 5, text: `BMO Field on the waterfront is beautiful — you can see the CN Tower from the stands. The ${homeTeam} supporters were incredible. Toronto is so easy to get around, and the streetcar drops you at the gate.`, daysAgo: 2 },
      { author: 'Fatima Z.', location: 'Casablanca, Morocco', rating: 5, text: `Traveled from Morocco and Toronto exceeded all expectations. The city is safe, diverse, and welcoming. BMO Field had amazing atmosphere for ${homeTeam} vs ${awayTeam}. The Moroccan fan community in Toronto made us feel at home.`, daysAgo: 5 },
      { author: 'Ryan O.', location: 'Vancouver, BC', rating: 4, text: 'Great intimate venue — compact enough that every seat feels close to the action. The area around Exhibition Place has improved a lot. Toronto\'s food scene alone is worth the trip — try Kensington Market.', daysAgo: 11 },
    ],
    'Estadio Azteca': [
      { author: 'Roberto V.', location: 'Mexico City', rating: 5, text: `The Azteca is a cathedral of football — the history, the atmosphere, the passion. 80,000+ fans singing together for ${homeTeam} gave me chills. Nothing compares to this stadium on match day.`, daysAgo: 1 },
      { author: 'Jin W.', location: 'Seoul, South Korea', rating: 4, text: `The atmosphere at Estadio Azteca is unreal — the most passionate fans I\'ve experienced anywhere. ${awayTeam} supporters held their own in the away section. The altitude took some getting used to. Mexico City\'s food is incredible.`, daysAgo: 4 },
      { author: 'Lisa M.', location: 'Austin, TX', rating: 4, text: 'The Metro gets you right to the stadium — so easy and cheap. The Azteca is showing its age in some areas but the renovations look good. Street food vendors outside the stadium are amazing — try the tlacoyos and esquites.', daysAgo: 8 },
    ],
    'Lumen Field': [
      { author: 'Alex K.', location: 'Seattle, WA', rating: 5, text: `Lumen Field\'s location is unbeatable — right downtown with mountain views. The ${homeTeam} supporters section (ECS-style) was thunderous. Seattle in June is gorgeous. Best stadium experience in the US, hands down.`, daysAgo: 2 },
      { author: 'Emeka O.', location: 'Lagos, Nigeria', rating: 5, text: `Traveled from Nigeria for ${homeTeam} vs ${awayTeam}. Seattle surprised me — beautiful city, great food, friendly people. The stadium atmosphere was electric. ${awayTeam} fans showed up strong!`, daysAgo: 6 },
      { author: 'Jen C.', location: 'Portland, OR', rating: 4, text: 'Easy light rail ride from the airport. The stadium is compact and LOUD — the roof traps the sound. Pike Place Market before the game is a must. Post-match, walk to Pioneer Square for great bars.', daysAgo: 13 },
    ],
  };

  const reviews = venueReviews[venue];
  if (reviews) return reviews;

  return [
    { author: 'Fan Reporter', location: city, rating: 4, text: `Great atmosphere for ${homeTeam} vs ${awayTeam} at ${venue}. The fans from both sides created an amazing environment. ${city} is a wonderful host city with plenty to see and do around match day.`, daysAgo: 3 },
    { author: 'Sports Traveler', location: 'International', rating: 4, text: `${venue} in ${city} delivered a world-class experience. Good facilities, decent food options, and the crowd energy was fantastic. Would definitely recommend planning extra days to explore the city.`, daysAgo: 7 },
    { author: 'Local Guide', location: city, rating: 5, text: `As a local, it was amazing to see ${city} host the World Cup. The city really came alive for ${homeTeam} vs ${awayTeam}. Public transport handled the crowds well. Don't miss the local restaurants near the stadium!`, daysAgo: 10 },
  ];
}

function getCityGuides(city: string, venue: string): CityGuide[] {
  const guides = CITY_GUIDES[city];
  if (guides) return guides;

  return [
    { icon: 'weather', title: `Weather in ${city}`, content: `Check the local forecast before traveling. June weather varies by region — pack layers and rain gear to be safe. Sunscreen is always a good idea for outdoor stadium events.` },
    { icon: 'transport', title: `Getting to ${venue}`, content: `Check the stadium website for official transport recommendations. Ride-share apps and public transit are usually the easiest options on match days. Pre-purchase parking if driving.` },
    { icon: 'food', title: 'Local Food & Drink', content: `Explore ${city}'s local food scene! Ask hotel staff or locals for restaurant recommendations. Stadium food tends to be pricey — consider eating before you arrive.` },
    { icon: 'safety', title: 'Travel Tips', content: `Most World Cup venues have a clear bag policy — check the rules before you go. Arrive at least 90 minutes early for security screening. Keep valuables secure and stay aware of your surroundings.` },
  ];
}

const GUIDE_ICONS = {
  weather: Thermometer,
  transport: Train,
  food: UtensilsCrossed,
  safety: Shield,
} as const;

export function Match() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetMatchByIdQuery(id!);
  const outletContext = useOutletContext<RootContext | null>();
  const isDark = outletContext?.isDark ?? true;
  const setIsDark = outletContext?.setIsDark;
  const [showFanChat, setShowFanChat] = useState(false);
  const [fanChatTab, setFanChatTab] = useState<'home' | 'away'>('home');

  const venueName = data?.match?.venue ?? '';
  const venueCoords = VENUE_COORDS[venueName] ?? DEFAULT_VENUE;
  const mapCenter = useMemo<[number, number]>(() => [venueCoords.lat, venueCoords.lng], [venueCoords.lat, venueCoords.lng]);

  const initialPosts = useMemo(() => getFanPostsForVenue(venueName), [venueName]);
  const [fanPosts, setFanPosts] = useState<FanPost[]>([]);
  const prevVenueRef = useRef('');
  useEffect(() => {
    if (venueName && venueName !== prevVenueRef.current) {
      prevVenueRef.current = venueName;
      setFanPosts(initialPosts);
    }
  }, [venueName, initialPosts]);

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [showSpotPhotosModal, setShowSpotPhotosModal] = useState(false);
  const [spotCenter, setSpotCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [spotRadiusDeg, setSpotRadiusDeg] = useState<number>(0.003);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [textPostInput, setTextPostInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingPositionRef = useRef<{ lat: number; lng: number } | null>(null);

  // Nav bar state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Search:', searchQuery.trim());
    }
  };

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

  const mapPoints = fanPosts.map((p) => ({ lat: p.lat, lng: p.lng, weight: 1 }));

  if (isLoading)
    return (
      <div className={`flex min-h-screen items-center justify-center ${isDark ? 'bg-[#1a1a1a] text-[#a0a0a0]' : 'bg-gray-50 text-gray-500'}`}>
        Loading match details...
      </div>
    );
  if (error || !data)
    return (
      <div className={`flex min-h-screen items-center justify-center ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50'} text-red-500`}>
        Error loading match
      </div>
    );

  const { match, forumPosts } = data;
  const homeAbbr = getTeamAbbr(match.homeTeam);
  const awayAbbr = getTeamAbbr(match.awayTeam);
  const homeFlag = getTeamFlag(match.homeTeam);
  const awayFlag = getTeamFlag(match.awayTeam);
  const matchDate = new Date(match.date);
  const timeStr = matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = matchDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const cityGuides = getCityGuides(match.city, match.venue);
  const fanReviews = generateFanReviews(match.city, match.venue, match.homeTeam, match.awayTeam);
  const cityImage = CITY_IMAGES[match.city];

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#1a1a1a] text-[#e0e0e0]' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-[1400px] mx-auto px-6 pb-16">
        {/* Top nav — matches the global header from Root */}
        <header
          className={`sticky top-0 z-10 border-b -mx-6 px-6 py-3 ${
            isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'
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
              onClick={() => setIsDark?.((prev) => !prev)}
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

        {/* Grid: sidebar + content */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 mt-4">
          {/* Left sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-16">
              <SportsSidebar isDark={isDark} />
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0">
            {/* Scorecard */}
            <section className={`rounded-xl border p-4 ${isDark ? 'border-[#333] bg-[#282828]' : 'border-gray-200 bg-white shadow-sm'}`}>
              <div className="flex flex-col items-center gap-4">
                <div className="flex w-full items-center justify-between gap-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full text-base font-bold ${isDark ? 'bg-[#3a3a3a] text-white' : 'bg-gray-100 text-gray-900'}`}>
                      {homeFlag ? <span className="text-3xl leading-none">{homeFlag}</span> : homeAbbr}
                    </div>
                    <span className={`text-center text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{match.homeTeam}</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-3xl font-bold text-[#22c55e]">vs</span>
                    <span className="rounded-lg bg-[#b33c3c] px-2.5 py-0.5 text-xs font-semibold text-white">
                      {dateStr} · {timeStr}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full text-base font-bold ${isDark ? 'bg-[#3a3a3a] text-white' : 'bg-gray-100 text-gray-900'}`}>
                      {awayFlag ? <span className="text-3xl leading-none">{awayFlag}</span> : awayAbbr}
                    </div>
                    <span className={`text-center text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{match.awayTeam}</span>
                  </div>
                </div>

                <div className={`h-px w-full ${isDark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`} />
                <div className={`flex flex-wrap items-center justify-center gap-4 text-xs ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>
                  <span className="flex items-center gap-1">
                    <Building2 className={`h-3.5 w-3.5 ${isDark ? 'text-white' : 'text-gray-700'}`} />
                    {match.venue}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className={`h-3.5 w-3.5 ${isDark ? 'text-white' : 'text-gray-700'}`} />
                    {match.city}
                  </span>
                </div>
              </div>
            </section>

            {/* Plan your trip */}
            <h2 className={`mt-6 text-sm font-bold tracking-wide uppercase ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Plan your trip
            </h2>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {TRIP_OPTIONS.map((opt) => (
                <div
                  key={opt.title}
                  className={`flex flex-col items-center rounded-xl p-3 text-center transition-opacity hover:opacity-90 ${isDark ? 'bg-[#2b2b2b]' : 'bg-white border border-gray-200 shadow-sm'}`}
                >
                  <div className={`mb-1.5 flex h-9 w-9 items-center justify-center rounded-full ${opt.iconBg} text-white`}>
                    <opt.icon className="h-4 w-4" />
                  </div>
                  <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{opt.title}</span>
                  <span className={`text-[10px] ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>{opt.description}</span>
                </div>
              ))}
            </div>

            {/* What People Are Saying */}
            <button
              type="button"
              onClick={() => setShowFanChat(true)}
              className={`mt-6 flex w-full items-center gap-3 rounded-xl p-3 text-left transition-opacity hover:opacity-90 ${isDark ? 'bg-[#2d2d2d]' : 'bg-white border border-gray-200 shadow-sm'}`}
            >
              <MessageCircle className="h-8 w-8 shrink-0 text-[#22c55e]" strokeWidth={2} />
              <div className="min-w-0 flex-1">
                <p className={`font-semibold text-sm ${isDark ? 'text-[#e0e0e0]' : 'text-gray-900'}`}>What People Are Saying</p>
                <p className={`text-xs ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>
                  Join the {match.homeTeam} or {match.awayTeam} fan chat
                </p>
              </div>
              <span className={isDark ? 'text-[#e0e0e0]' : 'text-gray-400'}>→</span>
            </button>

            {/* City Guides & Tips */}
            <div className="mt-6 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#22c55e]" />
              <h2 className={`text-sm font-bold ${isDark ? 'text-[#e0e0e0]' : 'text-gray-900'}`}>City Guides & Tips</h2>
            </div>

            {/* City hero image */}
            {cityImage && (
              <div className="mt-2 overflow-hidden rounded-xl">
                <img src={cityImage} alt={match.city} className="w-full h-40 object-cover" />
              </div>
            )}

            <div className="mt-2 space-y-2">
              {cityGuides.map((guide) => {
                const GuideIcon = GUIDE_ICONS[guide.icon];
                return (
                  <div
                    key={guide.title}
                    className={`rounded-xl p-3.5 ${isDark ? 'bg-[#2d2d2d]' : 'bg-white border border-gray-200 shadow-sm'}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#22c55e]/15">
                        <GuideIcon className="h-3.5 w-3.5 text-[#22c55e]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className={`font-semibold text-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>{guide.title}</h3>
                        <p className={`mt-1 text-xs leading-relaxed ${isDark ? 'text-[#a0a0a0]' : 'text-gray-600'}`}>{guide.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Where fans are posting */}
            <div className="mt-6 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#22c55e]" />
              <h2 className={`text-sm font-bold ${isDark ? 'text-[#e0e0e0]' : 'text-gray-900'}`}>Where fans are posting</h2>
            </div>
            <div className={`mt-2 flex flex-col overflow-hidden rounded-xl ${isDark ? 'bg-[#2d2d2d]' : 'bg-white border border-gray-200 shadow-sm'}`}>
              {!showSpotPhotosModal ? (
                <MapHeatmap
                  center={mapCenter}
                  zoom={15}
                  points={mapPoints}
                  className="h-[400px] w-full"
                  isDark={isDark}
                  onMapClick={(lat, lng, zoom) => {
                    setSpotCenter({ lat, lng });
                    setSpotRadiusDeg(getSpotRadiusDeg(zoom));
                    setShowSpotPhotosModal(true);
                  }}
                />
              ) : (
                <div className={`h-[400px] w-full ${isDark ? 'bg-[#252525]' : 'bg-gray-100'}`} aria-hidden />
              )}
              {/* <p className={`px-3 py-2 text-center text-xs ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>
                Warmer areas = more fan activity. Tap to see posts & photos.
              </p> */}
              <div className={`border-t px-3 pt-2 pb-3 ${isDark ? 'border-[#3a3a3a]' : 'border-gray-200'}`}>
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
                  className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition-opacity hover:opacity-90 ${isDark ? 'bg-[#3a3a3a] text-white' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  Take a photo to upload
                </button>
                {locationError && (
                  <p className="mt-1.5 text-center text-[10px] text-[#ef4444]">{locationError}</p>
                )}
                <div className="mt-2">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (textPostInput.trim()) {
                        setTextPostInput('');
                      }
                    }}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                      isDark
                        ? 'bg-[#252525] border-[#3a3a3a] focus-within:border-[#22c55e]/50'
                        : 'bg-white border-gray-200 focus-within:border-[#22c55e]/50'
                    }`}
                  >
                    <MessageCircle className={`h-3.5 w-3.5 shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      value={textPostInput}
                      onChange={(e) => setTextPostInput(e.target.value)}
                      placeholder="Share what's happening here..."
                      className={`flex-1 bg-transparent outline-none text-xs placeholder:text-gray-500 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={!textPostInput.trim()}
                      className={`shrink-0 rounded-full p-1.5 transition-colors ${
                        textPostInput.trim()
                          ? 'bg-[#22c55e] text-white hover:bg-[#1ea750]'
                          : isDark
                            ? 'bg-[#3a3a3a] text-gray-600'
                            : 'bg-gray-100 text-gray-300'
                      }`}
                    >
                      <Send className="h-3 w-3" />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Fan Reviews */}
            <div className="mt-6 flex items-center gap-2">
              <Quote className="h-4 w-4 text-[#22c55e]" />
              <h2 className={`text-sm font-bold ${isDark ? 'text-[#e0e0e0]' : 'text-gray-900'}`}>Fan Reviews</h2>
              <span className={`ml-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${isDark ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-green-100 text-green-700'}`}>
                {fanReviews.length}
              </span>
            </div>
            <div className="mt-2 space-y-2">
              {fanReviews.map((review) => (
                <div
                  key={review.author}
                  className={`rounded-xl p-3.5 ${isDark ? 'bg-[#2d2d2d]' : 'bg-white border border-gray-200 shadow-sm'}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${isDark ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-green-100 text-green-700'}`}>
                        {review.author.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{review.author}</p>
                        <p className={`text-[10px] ${isDark ? 'text-[#808080]' : 'text-gray-400'}`}>{review.location}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] ${isDark ? 'text-[#808080]' : 'text-gray-400'}`}>{review.daysAgo}d ago</span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : isDark ? 'text-[#3a3a3a]' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-[#a0a0a0]' : 'text-gray-600'}`}>"{review.text}"</p>
                </div>
              ))}
            </div>

            {/* Forum posts count */}
            {forumPosts.length > 0 && (
              <div className={`mt-4 rounded-xl p-3 ${isDark ? 'bg-[#2d2d2d]' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <p className={`text-xs ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>
                  {forumPosts.length} discussion{forumPosts.length !== 1 ? 's' : ''} in fan chat
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo preview modal */}
      {showPreviewModal && previewPhotoUrl && previewPosition && (
        <div className={`fixed inset-0 z-50 flex flex-col ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
          <header className={`flex items-center justify-between border-b px-4 py-3 ${isDark ? 'border-[#2d2d2d] bg-[#202324]' : 'border-gray-200 bg-white'}`}>
            <button
              type="button"
              onClick={() => {
                URL.revokeObjectURL(previewPhotoUrl);
                setPreviewPhotoUrl(null);
                setPreviewPosition(null);
                setShowPreviewModal(false);
              }}
              className={isDark ? 'text-white' : 'text-gray-700'}
              aria-label="Cancel"
            >
              <X className="h-5 w-5" />
            </button>
            <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Post to map</span>
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
              className="font-semibold text-sm text-[#22c55e]"
            >
              Post
            </button>
          </header>
          <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
            <img src={previewPhotoUrl} alt="Preview" className="max-h-full w-full object-contain" />
          </div>
        </div>
      )}

      {/* Spot photos modal */}
      {showSpotPhotosModal && spotCenter && (
        <div className={`fixed inset-0 z-50 flex flex-col ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
          <header className={`flex shrink-0 items-center justify-between border-b px-4 py-3 ${isDark ? 'border-[#2d2d2d] bg-[#202324]' : 'border-gray-200 bg-white'}`}>
            <button
              type="button"
              onClick={() => {
                setShowSpotPhotosModal(false);
                setSpotCenter(null);
              }}
              className={isDark ? 'text-white' : 'text-gray-700'}
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Posts in this area</h1>
            <div className="w-5" />
          </header>
          <div className="flex-1 overflow-auto">
            <div className={`h-48 w-full shrink-0 overflow-hidden border-b ${isDark ? 'border-[#2d2d2d]' : 'border-gray-200'}`}>
              <MapContainer
                center={[spotCenter.lat, spotCenter.lng]}
                zoom={18}
                scrollWheelZoom={false}
                className="h-full w-full"
                style={{ background: isDark ? '#1a1a1a' : '#f3f4f6' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url={isDark
                    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                  }
                />
                <Circle
                  center={[spotCenter.lat, spotCenter.lng]}
                  radius={spotRadiusDeg * METERS_PER_DEG}
                  pathOptions={{
                    color: '#22c55e',
                    fillColor: '#22c55e',
                    fillOpacity: 0.25,
                    weight: 2
                  }}
                />
              </MapContainer>
            </div>
            <div className="p-4">
              {(() => {
                const inArea = fanPosts.filter(
                  (p) => distanceDeg(p.lat, p.lng, spotCenter.lat, spotCenter.lng) <= spotRadiusDeg
                );
                if (inArea.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <ImageIcon className={`mb-3 h-12 w-12 opacity-60 ${isDark ? 'text-[#606060]' : 'text-gray-300'}`} />
                      <p className={isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}>No posts in this spot yet.</p>
                    </div>
                  );
                }
                const imageUrls = inArea.filter((p) => p.imageUrl).map((p) => p.imageUrl!);
                return (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                    {inArea.map((post) =>
                      post.imageUrl ? (
                        <button
                          key={post.id}
                          type="button"
                          onClick={() => {
                            const idx = imageUrls.indexOf(post.imageUrl!);
                            setLightboxImages(imageUrls);
                            setLightboxIndex(idx >= 0 ? idx : 0);
                          }}
                          className={`aspect-square overflow-hidden rounded-lg cursor-pointer transition-all hover:opacity-80 hover:ring-2 hover:ring-[#22c55e]/50 ${isDark ? 'bg-[#2d2d2d]' : 'bg-gray-100'}`}
                        >
                          <img
                            src={post.imageUrl}
                            alt="Fan post"
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ) : (
                        <div
                          key={post.id}
                          className={`aspect-square overflow-hidden rounded-lg relative ${isDark ? 'bg-gradient-to-br from-[#1e3a2f] to-[#2d2d2d]' : 'bg-gradient-to-br from-green-50 to-white border border-gray-200 shadow-sm'}`}
                        >
                          <div className="flex h-full w-full flex-col items-start justify-between p-2.5">
                            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${isDark ? 'bg-[#22c55e]/20' : 'bg-green-100'}`}>
                              <MessageCircle className={`h-3 w-3 ${isDark ? 'text-[#22c55e]' : 'text-green-600'}`} />
                            </div>
                            <p className={`text-[10px] leading-snug line-clamp-4 italic ${isDark ? 'text-[#d0d0d0]' : 'text-gray-700'}`}>
                              &ldquo;{post.text}&rdquo;
                            </p>
                            <div className={`self-end text-[8px] font-medium ${isDark ? 'text-[#22c55e]/60' : 'text-green-500/70'}`}>Fan post</div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Photo lightbox */}
      {lightboxImages.length > 0 && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={() => setLightboxImages([])}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxImages([])}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <X className="h-7 w-7" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
            {lightboxIndex + 1} / {lightboxImages.length}
          </div>

          {/* Previous button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-colors z-10"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Image */}
          <img
            src={lightboxImages[lightboxIndex]}
            alt="Full-size fan post"
            className="max-h-[85vh] max-w-[80vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-colors z-10"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Fan Chat overlay */}
      {showFanChat && (
        <div className={`fixed inset-0 z-50 flex flex-col ${isDark ? 'bg-[#181a1b]' : 'bg-gray-50'}`}>
          <header className={`flex items-center justify-between border-b px-4 py-3 ${isDark ? 'border-[#2d2d2d] bg-[#202324]' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFanChat(false)}
                className={isDark ? 'text-white' : 'text-gray-700'}
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Fan Chat</h1>
                <p className={`text-xs ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>
                  {match.homeTeam} vs {match.awayTeam}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowFanChat(false)}
              className={isDark ? 'text-white' : 'text-gray-700'}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className={`border-b ${isDark ? 'border-[#2d2d2d] bg-[#202324]' : 'border-gray-200 bg-white'}`}>
            <div className="flex">
              <button
                type="button"
                onClick={() => setFanChatTab('home')}
                className={`flex-1 py-2.5 text-center text-sm font-medium ${
                  fanChatTab === 'home' ? 'text-[#22c55e]' : isDark ? 'text-[#a0a0a0]' : 'text-gray-500'
                }`}
              >
                {match.homeTeam} Fans
              </button>
              <button
                type="button"
                onClick={() => setFanChatTab('away')}
                className={`flex-1 py-2.5 text-center text-sm font-medium ${
                  fanChatTab === 'away' ? 'text-[#22c55e]' : isDark ? 'text-[#a0a0a0]' : 'text-gray-500'
                }`}
              >
                {match.awayTeam} Fans
              </button>
            </div>
            <div className="flex">
              <div
                className={`h-0.5 flex-1 bg-[#22c55e] transition-opacity ${fanChatTab === 'home' ? 'opacity-100' : 'opacity-0'}`}
              />
              <div
                className={`h-0.5 flex-1 bg-[#22c55e] transition-opacity ${fanChatTab === 'away' ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <MessageCircle className={`mb-4 h-14 w-14 ${isDark ? 'text-[#606060]' : 'text-gray-300'}`} />
            <p className={isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}>No messages yet.</p>
            <p className={`mt-1 text-sm ${isDark ? 'text-[#808080]' : 'text-gray-400'}`}>Be the first to start the conversation!</p>
          </div>

          <div className={`border-t py-3 text-center ${isDark ? 'border-[#2d2d2d] bg-[#282b2d]' : 'border-gray-200 bg-gray-100'}`}>
            <p className={`text-sm ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>Sign in to join the conversation</p>
          </div>
        </div>
      )}
    </div>
  );
}
