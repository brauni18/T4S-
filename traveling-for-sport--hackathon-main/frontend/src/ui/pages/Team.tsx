import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router';
import { isFlagCode, flagUrl } from '@/ui/components/TeamBadge';
import {
  ArrowLeft,
  Building2,
  MapPin,
  UtensilsCrossed,
  Bus,
  Train,
  Star,
  Quote,
  FileText,
  Shield,
  Thermometer,
  Beer,
  Ticket,
  Camera,
  Heart,
  Clock,
  Search,
  Sun,
  Moon,
  X,
  Users,
  Trophy,
  Calendar,
} from 'lucide-react';
import { SportsSidebar } from '@/ui/components/SportsSidebar';
import type { RootContext } from '@/ui/Root';

// ── Team data (mirrors Teams.tsx) ────────────────────────────

interface TeamInfo {
  name: string;
  badge: string;
  city: string;
  stadium: string;
  founded: number;
  category: string;
  sport: string;
  sportIcon: string;
  sportSlug: string;
}

const ALL_TEAMS: TeamInfo[] = [
  // Football
  { name: 'Real Madrid', badge: '⚪', city: 'Madrid, Spain', stadium: 'Santiago Bernabéu', founded: 1902, category: 'European Giants', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'Barcelona', badge: '🔵', city: 'Barcelona, Spain', stadium: 'Spotify Camp Nou', founded: 1899, category: 'European Giants', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'Manchester City', badge: '🔵', city: 'Manchester, England', stadium: 'Etihad Stadium', founded: 1880, category: 'Premier League Elite', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'Arsenal', badge: '🔴', city: 'London, England', stadium: 'Emirates Stadium', founded: 1886, category: 'Premier League Elite', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'Liverpool', badge: '🔴', city: 'Liverpool, England', stadium: 'Anfield', founded: 1892, category: 'Premier League Elite', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'Chelsea', badge: '🔵', city: 'London, England', stadium: 'Stamford Bridge', founded: 1905, category: 'Premier League Elite', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'Bayern Munich', badge: '🔴', city: 'Munich, Germany', stadium: 'Allianz Arena', founded: 1900, category: 'European Giants', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'PSG', badge: '🔵', city: 'Paris, France', stadium: 'Parc des Princes', founded: 1970, category: 'European Giants', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'Inter Miami', badge: '🩷', city: 'Fort Lauderdale, USA', stadium: 'Chase Stadium', founded: 2018, category: 'MLS Rising Stars', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'Juventus', badge: '⚪', city: 'Turin, Italy', stadium: 'Allianz Stadium', founded: 1897, category: 'Serie A Powerhouses', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'Inter Milan', badge: '🔵', city: 'Milan, Italy', stadium: 'San Siro', founded: 1908, category: 'Serie A Powerhouses', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'AC Milan', badge: '🔴', city: 'Milan, Italy', stadium: 'San Siro', founded: 1899, category: 'Serie A Powerhouses', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'Napoli', badge: '🔵', city: 'Naples, Italy', stadium: 'Stadio Diego Maradona', founded: 1926, category: 'Serie A Powerhouses', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'Borussia Dortmund', badge: '🟡', city: 'Dortmund, Germany', stadium: 'Signal Iduna Park', founded: 1909, category: 'Fan Favorites', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'Atlético Madrid', badge: '🔴', city: 'Madrid, Spain', stadium: 'Cívitas Metropolitano', founded: 1903, category: 'La Liga Contenders', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'Tottenham', badge: '⚪', city: 'London, England', stadium: 'Tottenham Hotspur Stadium', founded: 1882, category: 'Premier League Elite', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'LAFC', badge: '⚫', city: 'Los Angeles, USA', stadium: 'BMO Stadium', founded: 2014, category: 'MLS Rising Stars', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'Seattle Sounders', badge: '🟢', city: 'Seattle, USA', stadium: 'Lumen Field', founded: 2007, category: 'MLS Rising Stars', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'Bayer Leverkusen', badge: '🔴', city: 'Leverkusen, Germany', stadium: 'BayArena', founded: 1904, category: 'Fan Favorites', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  { name: 'Benfica', badge: '🔴', city: 'Lisbon, Portugal', stadium: 'Estádio da Luz', founded: 1904, category: 'Fan Favorites', sport: 'Football (Soccer)', sportIcon: '⚽', sportSlug: 'football' },
  // Basketball
  { name: 'Los Angeles Lakers', badge: '🟡', city: 'Los Angeles, CA', stadium: 'Crypto.com Arena', founded: 1947, category: 'Western Conference', sport: 'Basketball', sportIcon: '🏀', sportSlug: 'basketball' },
  { name: 'Boston Celtics', badge: '🟢', city: 'Boston, MA', stadium: 'TD Garden', founded: 1946, category: 'Eastern Conference', sport: 'Basketball', sportIcon: '🏀', sportSlug: 'basketball' },
  { name: 'Golden State Warriors', badge: '🔵', city: 'San Francisco, CA', stadium: 'Chase Center', founded: 1946, category: 'Western Conference', sport: 'Basketball', sportIcon: '🏀', sportSlug: 'basketball' },
  { name: 'Denver Nuggets', badge: '🔵', city: 'Denver, CO', stadium: 'Ball Arena', founded: 1967, category: 'Western Conference', sport: 'Basketball', sportIcon: '🏀', sportSlug: 'basketball' },
  { name: 'Milwaukee Bucks', badge: '🟢', city: 'Milwaukee, WI', stadium: 'Fiserv Forum', founded: 1968, category: 'Eastern Conference', sport: 'Basketball', sportIcon: '🏀', sportSlug: 'basketball' },
  { name: 'Miami Heat', badge: '🔴', city: 'Miami, FL', stadium: 'Kaseya Center', founded: 1988, category: 'Eastern Conference', sport: 'Basketball', sportIcon: '🏀', sportSlug: 'basketball' },
  { name: 'Philadelphia 76ers', badge: '🔵', city: 'Philadelphia, PA', stadium: 'Wells Fargo Center', founded: 1946, category: 'Eastern Conference', sport: 'Basketball', sportIcon: '🏀', sportSlug: 'basketball' },
  { name: 'Dallas Mavericks', badge: '🔵', city: 'Dallas, TX', stadium: 'American Airlines Center', founded: 1980, category: 'Western Conference', sport: 'Basketball', sportIcon: '🏀', sportSlug: 'basketball' },
  { name: 'New York Knicks', badge: '🔵', city: 'New York, NY', stadium: 'Madison Square Garden', founded: 1946, category: 'Historic Franchises', sport: 'Basketball', sportIcon: '🏀', sportSlug: 'basketball' },
  { name: 'Chicago Bulls', badge: '🔴', city: 'Chicago, IL', stadium: 'United Center', founded: 1966, category: 'Historic Franchises', sport: 'Basketball', sportIcon: '🏀', sportSlug: 'basketball' },
  { name: 'San Antonio Spurs', badge: '⚫', city: 'San Antonio, TX', stadium: 'Frost Bank Center', founded: 1967, category: 'Historic Franchises', sport: 'Basketball', sportIcon: '🏀', sportSlug: 'basketball' },
  { name: 'Phoenix Suns', badge: '🟠', city: 'Phoenix, AZ', stadium: 'Footprint Center', founded: 1968, category: 'Western Conference', sport: 'Basketball', sportIcon: '🏀', sportSlug: 'basketball' },
  // American Football
  { name: 'Kansas City Chiefs', badge: '🔴', city: 'Kansas City, MO', stadium: 'GEHA Field at Arrowhead', founded: 1960, category: 'AFC Contenders', sport: 'American Football', sportIcon: '🏈', sportSlug: 'american-football' },
  { name: 'Philadelphia Eagles', badge: '🟢', city: 'Philadelphia, PA', stadium: 'Lincoln Financial Field', founded: 1933, category: 'NFC Contenders', sport: 'American Football', sportIcon: '🏈', sportSlug: 'american-football' },
  { name: 'San Francisco 49ers', badge: '🔴', city: 'Santa Clara, CA', stadium: "Levi's Stadium", founded: 1946, category: 'NFC Contenders', sport: 'American Football', sportIcon: '🏈', sportSlug: 'american-football' },
  { name: 'Dallas Cowboys', badge: '🔵', city: 'Arlington, TX', stadium: 'AT&T Stadium', founded: 1960, category: 'NFC Contenders', sport: 'American Football', sportIcon: '🏈', sportSlug: 'american-football' },
  { name: 'Buffalo Bills', badge: '🔵', city: 'Orchard Park, NY', stadium: 'Highmark Stadium', founded: 1960, category: 'AFC Contenders', sport: 'American Football', sportIcon: '🏈', sportSlug: 'american-football' },
  { name: 'Baltimore Ravens', badge: '🟣', city: 'Baltimore, MD', stadium: 'M&T Bank Stadium', founded: 1996, category: 'AFC Contenders', sport: 'American Football', sportIcon: '🏈', sportSlug: 'american-football' },
  { name: 'Detroit Lions', badge: '🔵', city: 'Detroit, MI', stadium: 'Ford Field', founded: 1930, category: 'NFC Contenders', sport: 'American Football', sportIcon: '🏈', sportSlug: 'american-football' },
  { name: 'Green Bay Packers', badge: '🟢', city: 'Green Bay, WI', stadium: 'Lambeau Field', founded: 1919, category: 'Legacy Teams', sport: 'American Football', sportIcon: '🏈', sportSlug: 'american-football' },
  { name: 'New England Patriots', badge: '🔴', city: 'Foxborough, MA', stadium: 'Gillette Stadium', founded: 1959, category: 'Legacy Teams', sport: 'American Football', sportIcon: '🏈', sportSlug: 'american-football' },
  { name: 'Pittsburgh Steelers', badge: '🟡', city: 'Pittsburgh, PA', stadium: 'Acrisure Stadium', founded: 1933, category: 'Legacy Teams', sport: 'American Football', sportIcon: '🏈', sportSlug: 'american-football' },
  // Baseball
  { name: 'New York Yankees', badge: '🔵', city: 'Bronx, NY', stadium: 'Yankee Stadium', founded: 1901, category: 'AL Powerhouses', sport: 'Baseball', sportIcon: '⚾', sportSlug: 'baseball' },
  { name: 'Los Angeles Dodgers', badge: '🔵', city: 'Los Angeles, CA', stadium: 'Dodger Stadium', founded: 1883, category: 'NL Powerhouses', sport: 'Baseball', sportIcon: '⚾', sportSlug: 'baseball' },
  { name: 'Boston Red Sox', badge: '🔴', city: 'Boston, MA', stadium: 'Fenway Park', founded: 1901, category: 'AL Powerhouses', sport: 'Baseball', sportIcon: '⚾', sportSlug: 'baseball' },
  { name: 'Houston Astros', badge: '🟠', city: 'Houston, TX', stadium: 'Minute Maid Park', founded: 1962, category: 'AL Powerhouses', sport: 'Baseball', sportIcon: '⚾', sportSlug: 'baseball' },
  { name: 'Atlanta Braves', badge: '🔴', city: 'Atlanta, GA', stadium: 'Truist Park', founded: 1871, category: 'NL Powerhouses', sport: 'Baseball', sportIcon: '⚾', sportSlug: 'baseball' },
  { name: 'Chicago Cubs', badge: '🔵', city: 'Chicago, IL', stadium: 'Wrigley Field', founded: 1876, category: 'Classic Ballparks', sport: 'Baseball', sportIcon: '⚾', sportSlug: 'baseball' },
  { name: 'San Francisco Giants', badge: '🟠', city: 'San Francisco, CA', stadium: 'Oracle Park', founded: 1883, category: 'NL Powerhouses', sport: 'Baseball', sportIcon: '⚾', sportSlug: 'baseball' },
  { name: 'St. Louis Cardinals', badge: '🔴', city: 'St. Louis, MO', stadium: 'Busch Stadium', founded: 1882, category: 'Classic Ballparks', sport: 'Baseball', sportIcon: '⚾', sportSlug: 'baseball' },
  // Hockey
  { name: 'Florida Panthers', badge: '🔴', city: 'Sunrise, FL', stadium: 'Amerant Bank Arena', founded: 1993, category: 'Stanley Cup Contenders', sport: 'Hockey', sportIcon: '🏒', sportSlug: 'hockey' },
  { name: 'Edmonton Oilers', badge: '🔵', city: 'Edmonton, AB', stadium: 'Rogers Place', founded: 1972, category: 'Stanley Cup Contenders', sport: 'Hockey', sportIcon: '🏒', sportSlug: 'hockey' },
  { name: 'New York Rangers', badge: '🔵', city: 'New York, NY', stadium: 'Madison Square Garden', founded: 1926, category: 'Original Six', sport: 'Hockey', sportIcon: '🏒', sportSlug: 'hockey' },
  { name: 'Boston Bruins', badge: '🟡', city: 'Boston, MA', stadium: 'TD Garden', founded: 1924, category: 'Original Six', sport: 'Hockey', sportIcon: '🏒', sportSlug: 'hockey' },
  { name: 'Colorado Avalanche', badge: '🔴', city: 'Denver, CO', stadium: 'Ball Arena', founded: 1972, category: 'Stanley Cup Contenders', sport: 'Hockey', sportIcon: '🏒', sportSlug: 'hockey' },
  { name: 'Toronto Maple Leafs', badge: '🔵', city: 'Toronto, ON', stadium: 'Scotiabank Arena', founded: 1917, category: 'Original Six', sport: 'Hockey', sportIcon: '🏒', sportSlug: 'hockey' },
  { name: 'Montreal Canadiens', badge: '🔴', city: 'Montreal, QC', stadium: 'Bell Centre', founded: 1909, category: 'Original Six', sport: 'Hockey', sportIcon: '🏒', sportSlug: 'hockey' },
  { name: 'Vegas Golden Knights', badge: '🟡', city: 'Las Vegas, NV', stadium: 'T-Mobile Arena', founded: 2017, category: 'New Era', sport: 'Hockey', sportIcon: '🏒', sportSlug: 'hockey' },
  // Rugby
  { name: 'All Blacks', badge: 'nz', city: 'New Zealand', stadium: 'Eden Park', founded: 1884, category: 'Southern Hemisphere', sport: 'Rugby', sportIcon: '🏉', sportSlug: 'rugby' },
  { name: 'Springboks', badge: 'za', city: 'South Africa', stadium: 'Ellis Park', founded: 1891, category: 'Southern Hemisphere', sport: 'Rugby', sportIcon: '🏉', sportSlug: 'rugby' },
  { name: 'Ireland', badge: 'ie', city: 'Dublin', stadium: 'Aviva Stadium', founded: 1879, category: 'Six Nations', sport: 'Rugby', sportIcon: '🏉', sportSlug: 'rugby' },
  { name: 'France', badge: 'fr', city: 'Paris', stadium: 'Stade de France', founded: 1906, category: 'Six Nations', sport: 'Rugby', sportIcon: '🏉', sportSlug: 'rugby' },
  { name: 'England', badge: 'gb-eng', city: 'London', stadium: 'Twickenham', founded: 1871, category: 'Six Nations', sport: 'Rugby', sportIcon: '🏉', sportSlug: 'rugby' },
  { name: 'Wallabies', badge: 'au', city: 'Australia', stadium: 'Stadium Australia', founded: 1899, category: 'Southern Hemisphere', sport: 'Rugby', sportIcon: '🏉', sportSlug: 'rugby' },
  // Cricket
  { name: 'Mumbai Indians', badge: '🔵', city: 'Mumbai, India', stadium: 'Wankhede Stadium', founded: 2008, category: 'IPL Franchises', sport: 'Cricket', sportIcon: '🏏', sportSlug: 'cricket' },
  { name: 'Chennai Super Kings', badge: '🟡', city: 'Chennai, India', stadium: 'MA Chidambaram', founded: 2008, category: 'IPL Franchises', sport: 'Cricket', sportIcon: '🏏', sportSlug: 'cricket' },
  { name: 'Royal Challengers', badge: '🔴', city: 'Bangalore, India', stadium: 'M. Chinnaswamy', founded: 2008, category: 'IPL Franchises', sport: 'Cricket', sportIcon: '🏏', sportSlug: 'cricket' },
  { name: 'Kolkata Knight Riders', badge: '🟣', city: 'Kolkata, India', stadium: 'Eden Gardens', founded: 2008, category: 'IPL Franchises', sport: 'Cricket', sportIcon: '🏏', sportSlug: 'cricket' },
  { name: 'India', badge: 'in', city: 'India', stadium: 'Various', founded: 1932, category: 'National Teams', sport: 'Cricket', sportIcon: '🏏', sportSlug: 'cricket' },
  { name: 'Australia', badge: 'au', city: 'Australia', stadium: 'MCG', founded: 1877, category: 'National Teams', sport: 'Cricket', sportIcon: '🏏', sportSlug: 'cricket' },
  // Intentionally duplicated name "England" across rugby/cricket — slug differentiates
  { name: 'England (Cricket)', badge: 'gb-eng', city: 'England', stadium: "Lord's", founded: 1877, category: 'National Teams', sport: 'Cricket', sportIcon: '🏏', sportSlug: 'cricket' },
  { name: 'Pakistan', badge: 'pk', city: 'Pakistan', stadium: 'Various', founded: 1952, category: 'National Teams', sport: 'Cricket', sportIcon: '🏏', sportSlug: 'cricket' },
];

function teamToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function findTeam(sportSlug: string, teamSlug: string): TeamInfo | undefined {
  return ALL_TEAMS.find(
    (t) => t.sportSlug === sportSlug && teamToSlug(t.name) === teamSlug,
  );
}

// ── City Images ──────────────────────────────────────────────

const CITY_IMAGES: Record<string, string> = {
  'Madrid, Spain': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=350&fit=crop&q=80',
  'Barcelona, Spain': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=350&fit=crop&q=80',
  'Manchester, England': 'https://images.unsplash.com/photo-1515862089554-f0f42207efdc?w=800&h=350&fit=crop&q=80',
  'London, England': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=350&fit=crop&q=80',
  'Liverpool, England': 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&h=350&fit=crop&q=80',
  'Munich, Germany': 'https://images.unsplash.com/photo-1595867818082-083862f3d630?w=800&h=350&fit=crop&q=80',
  'Paris, France': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=350&fit=crop&q=80',
  'Fort Lauderdale, USA': 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800&h=350&fit=crop&q=80',
  'Turin, Italy': 'https://images.unsplash.com/photo-1567610464715-5d063f0dac21?w=800&h=350&fit=crop&q=80',
  'Milan, Italy': 'https://images.unsplash.com/photo-1520440229-6469a149ac59?w=800&h=350&fit=crop&q=80',
  'Naples, Italy': 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&h=350&fit=crop&q=80',
  'Dortmund, Germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=350&fit=crop&q=80',
  'Leverkusen, Germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=350&fit=crop&q=80',
  'Lisbon, Portugal': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=350&fit=crop&q=80',
  'Los Angeles, CA': 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&h=350&fit=crop&q=80',
  'Los Angeles, USA': 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&h=350&fit=crop&q=80',
  'Boston, MA': 'https://images.unsplash.com/photo-1501979376754-2ff867a4f659?w=800&h=350&fit=crop&q=80',
  'San Francisco, CA': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=350&fit=crop&q=80',
  'Denver, CO': 'https://images.unsplash.com/photo-1619856699906-09e1f4ef12d2?w=800&h=350&fit=crop&q=80',
  'Milwaukee, WI': 'https://images.unsplash.com/photo-1609175332673-a67f6cef7fce?w=800&h=350&fit=crop&q=80',
  'Miami, FL': 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800&h=350&fit=crop&q=80',
  'Philadelphia, PA': 'https://images.unsplash.com/photo-1569761316261-9a8696fa2ca3?w=800&h=350&fit=crop&q=80',
  'Dallas, TX': 'https://images.unsplash.com/photo-1570089858244-60b098be72b2?w=800&h=350&fit=crop&q=80',
  'Arlington, TX': 'https://images.unsplash.com/photo-1570089858244-60b098be72b2?w=800&h=350&fit=crop&q=80',
  'New York, NY': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=350&fit=crop&q=80',
  'Bronx, NY': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=350&fit=crop&q=80',
  'Chicago, IL': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=350&fit=crop&q=80',
  'Kansas City, MO': 'https://images.unsplash.com/photo-1571401835393-8c5f40381867?w=800&h=350&fit=crop&q=80',
  'Santa Clara, CA': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=350&fit=crop&q=80',
  'Seattle, USA': 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=800&h=350&fit=crop&q=80',
  'Houston, TX': 'https://images.unsplash.com/photo-1530089711124-9ca31fb9e863?w=800&h=350&fit=crop&q=80',
  'Atlanta, GA': 'https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?w=800&h=350&fit=crop&q=80',
  'St. Louis, MO': 'https://images.unsplash.com/photo-1603118588260-95a8a16cd03b?w=800&h=350&fit=crop&q=80',
  'Toronto, ON': 'https://images.unsplash.com/photo-1517090504611-1c0f3e8d3fca?w=800&h=350&fit=crop&q=80',
  'Montreal, QC': 'https://images.unsplash.com/photo-1559587336-e7d78c97bd0c?w=800&h=350&fit=crop&q=80',
  'Las Vegas, NV': 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=800&h=350&fit=crop&q=80',
  'Phoenix, AZ': 'https://images.unsplash.com/photo-1558645836-e44122a743ee?w=800&h=350&fit=crop&q=80',
  'San Antonio, TX': 'https://images.unsplash.com/photo-1581449184543-37b3c64d5a72?w=800&h=350&fit=crop&q=80',
  'Pittsburgh, PA': 'https://images.unsplash.com/photo-1577703424655-0ee1e23a0a02?w=800&h=350&fit=crop&q=80',
  'Baltimore, MD': 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&h=350&fit=crop&q=80',
  'Detroit, MI': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=350&fit=crop&q=80',
  'Green Bay, WI': 'https://images.unsplash.com/photo-1609175332673-a67f6cef7fce?w=800&h=350&fit=crop&q=80',
  'Foxborough, MA': 'https://images.unsplash.com/photo-1501979376754-2ff867a4f659?w=800&h=350&fit=crop&q=80',
  'Orchard Park, NY': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=350&fit=crop&q=80',
  'Sunrise, FL': 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800&h=350&fit=crop&q=80',
  'Edmonton, AB': 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&h=350&fit=crop&q=80',
  'Mumbai, India': 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&h=350&fit=crop&q=80',
  'Chennai, India': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=350&fit=crop&q=80',
  'Bangalore, India': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&h=350&fit=crop&q=80',
  'Kolkata, India': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&h=350&fit=crop&q=80',
  Dublin: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&h=350&fit=crop&q=80',
};

// ── Guide data per stadium ───────────────────────────────────

interface GuideEntry {
  icon: keyof typeof GUIDE_ICONS;
  title: string;
  content: string;
}

const GUIDE_ICONS = {
  food: UtensilsCrossed,
  bars: Beer,
  transport: Train,
  weather: Thermometer,
  safety: Shield,
  tickets: Ticket,
  photo: Camera,
  tips: FileText,
} as const;

function getStadiumGuides(team: TeamInfo): GuideEntry[] {
  const specific: Record<string, GuideEntry[]> = {
    'Santiago Bernabéu': [
      { icon: 'food', title: 'Where to Eat', content: 'Try "La Barraca" for paella near the stadium. The Mercado de Maravillas (10-min walk) has incredible tapas stalls. Post-match, grab churros con chocolate at Chocolatería San Ginés in the city center.' },
      { icon: 'bars', title: 'Best Bars & Pubs', content: 'Cervecería Santa Ana on Plaza de Santa Ana is a classic. For matchday vibes, fans pack the bars along Paseo de la Castellana hours before kickoff. "Toni2" on Calle de la Cruz is legendary for pre-game drinks.' },
      { icon: 'tips', title: 'Stadium Tips', content: 'Arrive 90 minutes early to explore the new retractable pitch and rooftop walkway. Seats in the Fondo Sur (south end) are where the Ultras Sur create the best atmosphere. The stadium tour is world-class.' },
      { icon: 'transport', title: 'Getting There', content: 'Metro Line 10 to Santiago Bernabéu station drops you right at the gates. Buses 14, 27, 40, and 147 also stop nearby. Avoid driving — parking is extremely limited on match days.' },
      { icon: 'weather', title: 'Weather & What to Wear', content: 'Madrid summers are hot (35°C+). Winters are mild but can be chilly at night (5–10°C). Wear layers for evening matches. Sunscreen is essential for daytime games.' },
    ],
    'Spotify Camp Nou': [
      { icon: 'food', title: 'Where to Eat', content: 'La Boqueria market on La Rambla is a must for foodies. Near the stadium, "La Pepita" serves amazing burgers and "Bar Tomás" in Sarrià has the best patatas bravas in Barcelona.' },
      { icon: 'bars', title: 'Best Bars & Pubs', content: 'The Born neighborhood has the best cocktail bars. For pre-game, fans gather at "Bar Camp Nou" right outside. "Espit Chupitos" is a fun shot bar on Passeig de Gràcia.' },
      { icon: 'tips', title: 'Stadium Tips', content: 'Camp Nou is undergoing major renovations — check capacity and seating maps before booking. The museum and megastore are open on matchdays. Gol Nord (north goal) has the most vocal fans.' },
      { icon: 'transport', title: 'Getting There', content: 'Metro L3 (Green) to Palau Reial or L5 (Blue) to Collblanc. Both are a short walk. The T1 tram also stops at Avinguda de Xile. Many fans walk from Les Corts neighborhood.' },
      { icon: 'weather', title: 'Weather & What to Wear', content: 'Barcelona has a Mediterranean climate — mild winters (10–15°C) and hot summers (30°C+). Sea breezes help in summer. Bring a light jacket for evening games from October to April.' },
    ],
    'Etihad Stadium': [
      { icon: 'food', title: 'Where to Eat', content: 'The Curry Mile on Wilmslow Road is world-famous for Indian cuisine. "Rudy\'s Pizza" in Ancoats is always packed. Near the stadium, "The Ashton Canal Kitchen" serves great pre-match meals.' },
      { icon: 'bars', title: 'Best Bars & Pubs', content: '"Mary & Archie" on Oxford Road is a classic matchday pub. The Northern Quarter has craft beer havens like "Cloudwater Tap Room". "The Waldorf" near Piccadilly is a pre-game favorite.' },
      { icon: 'tips', title: 'Stadium Tips', content: 'The south stand has the most passionate fans. Arrive early to visit the City Store and the interactive experience in the stadium concourse. The stadium is cashless — bring cards only.' },
      { icon: 'transport', title: 'Getting There', content: 'Take the Metrolink tram to Etihad Campus station. From Piccadilly station, it\'s a 20-minute walk. Shuttle buses run from the city center 2 hours before kickoff.' },
      { icon: 'weather', title: 'Weather & What to Wear', content: 'Manchester is rainy — always bring a waterproof jacket. Temperatures range from 2–8°C in winter to 15–22°C in summer. Layers are essential as weather changes fast.' },
    ],
    'Emirates Stadium': [
      { icon: 'food', title: 'Where to Eat', content: '"Piebury Corner" serves legendary pies near the ground. Holloway Road has great Turkish restaurants — try "Antepliler". The "The Tollington" pub does a solid pre-match burger.' },
      { icon: 'bars', title: 'Best Bars & Pubs', content: '"The Twelve Pins" on Seven Sisters Road is the go-to pre-match pub. "The Gunners" near Highbury is packed with Arsenal fans. Craft beer fans should try "The Victoria" in Holloway.' },
      { icon: 'tips', title: 'Stadium Tips', content: 'The Clock End has the most atmosphere. The Arsenal Museum (free on matchday) is excellent. Bring clear bags as security is tight. The stadium is fully cashless.' },
      { icon: 'transport', title: 'Getting There', content: 'Arsenal station (Piccadilly line) is literally next door. Holloway Road (Piccadilly) and Finsbury Park (Victoria/Piccadilly) also work. Buses 4, 19, 29, and 253 all stop within walking distance.' },
      { icon: 'weather', title: 'Weather & What to Wear', content: 'London weather is unpredictable — always pack a rain layer. Winter games (Nov–Feb) can be cold (2–7°C) with wind chill. Summer evenings are pleasant (15–22°C).' },
    ],
    'Anfield': [
      { icon: 'food', title: 'Where to Eat', content: '"The Twelfth Man" on Walton Breck Road is a matchday institution. Bold Street in the city center has amazing international food. "Homebaked" bakery near Anfield does incredible meat pies.' },
      { icon: 'bars', title: 'Best Bars & Pubs', content: '"The Sandon" on Oakfield Road is the pub where Liverpool FC was founded — a must-visit. "The Park" and "The Albert" near the ground are packed pre-match. The Baltic Triangle has great cocktail bars.' },
      { icon: 'tips', title: 'Stadium Tips', content: 'The Kop end is legendary — if you can get tickets there, do it. "You\'ll Never Walk Alone" before kickoff is an unforgettable experience. The Anfield stadium tour includes the dressing rooms and tunnel.' },
      { icon: 'transport', title: 'Getting There', content: 'Take the 917 Arriva bus from Liverpool ONE or the 26 bus from the city center. Kirkdale train station is a 15-min walk. Avoid driving — street parking fills up 3 hours before kickoff.' },
      { icon: 'weather', title: 'Weather & What to Wear', content: 'Liverpool is windy and wet. Bring waterproofs and warm layers, especially for winter evening games (2–6°C). The Kop end is covered, but other areas get rain. Dress warm!' },
    ],
    'Allianz Arena': [
      { icon: 'food', title: 'Where to Eat', content: 'Inside the stadium, try Bavarian classics — bratwurst with sauerkraut and pretzels. In the city, "Augustiner-Keller" near Hauptbahnhof has authentic beer garden cuisine. "Hofbräuhaus" is touristy but iconic.' },
      { icon: 'bars', title: 'Best Bars & Pubs', content: 'Munich\'s beer gardens are legendary — "Augustiner Keller" and "Hirschgarten" are fan favorites. Near Marienplatz, "Schneider Bräuhaus" has the best weissbier. Pre-match, the arena esplanade has beer stands.' },
      { icon: 'tips', title: 'Stadium Tips', content: 'The south curve (Südkurve) is where the ultras sit — incredible atmosphere. The stadium glows red for Bayern games. Tour the FC Bayern Museum next door. Arrive early — 70,000 fans take time to seat.' },
      { icon: 'transport', title: 'Getting There', content: 'U-Bahn U6 to Fröttmaning station — it\'s a 10-minute walk to the arena. Special matchday services increase frequency. Driving is possible but parking costs €15 and fills up fast.' },
      { icon: 'weather', title: 'Weather & What to Wear', content: 'Munich winters are cold (–5 to 3°C) — dress very warmly for evening games. Summers are pleasant (20–28°C). Alpine weather means sudden changes, so layers are key.' },
    ],
    'Madison Square Garden': [
      { icon: 'food', title: 'Where to Eat', content: 'K-Town (32nd St) is steps away with amazing Korean BBQ. "John\'s of Bleecker" has top NYC pizza. "Shake Shack" in Madison Square Park is a classic. Inside MSG, the food options are surprisingly solid.' },
      { icon: 'bars', title: 'Best Bars & Pubs', content: '"Stout NYC" across the street is the go-to pre-game bar. "The Pennsy" food hall on 33rd has rooftop drinks. "Blarney Stone" on 8th Ave is a classic sports bar.' },
      { icon: 'tips', title: 'Stadium Tips', content: 'MSG has a strict clear-bag policy. Seats in the 100 level at center court/ice are premium. The Chase Bridge suspended above the action is a unique experience. The venue is completely cashless.' },
      { icon: 'transport', title: 'Getting There', content: 'Penn Station is literally underneath MSG — take any subway line that stops at 34th St. The 1/2/3, A/C/E, B/D/F/M, and N/Q/R/W trains all connect. NJ Transit, LIRR, and Amtrak stop here too.' },
      { icon: 'weather', title: 'Weather & What to Wear', content: 'NYC has hot summers and cold winters. Winter games (Dec–Feb) — bundle up for the walk (–5 to 5°C). Summer heat can hit 35°C. MSG is well air-conditioned inside year-round.' },
    ],
    'Crypto.com Arena': [
      { icon: 'food', title: 'Where to Eat', content: 'L.A. Live next door has dozens of restaurants. "The Original Pantry Cafe" is a 24/7 downtown institution. "Grand Central Market" (10-min drive) has incredible food stalls. Inside the arena, try the "Street Tacos" stand.' },
      { icon: 'bars', title: 'Best Bars & Pubs', content: '"Tom\'s Watch Bar" at L.A. Live is the ultimate sports bar. "The Edison" downtown is a speakeasy-style cocktail bar. "Golden Gopher" on 8th St has great pre-game drink specials.' },
      { icon: 'tips', title: 'Stadium Tips', content: 'The arena is cashless. Premium seats in the 100 sections near the tunnels offer the best player access. The Star Plaza outside is perfect for pre-game photos. Lines can be long — arrive early for security.' },
      { icon: 'transport', title: 'Getting There', content: 'Metro Blue/Expo lines stop at Pico Station (5-min walk). Driving is common but parking runs $30–60 on event days. Rideshare drop-off on Chick Hearn Ct. Consider the DASH bus for cheap downtown transit.' },
      { icon: 'weather', title: 'Weather & What to Wear', content: 'LA is warm year-round (15–30°C). Even winter evenings are mild. Light layers work perfectly. It rarely rains but bring sunscreen for daytime outdoor events.' },
    ],
  };

  if (specific[team.stadium]) return specific[team.stadium];

  const cityName = team.city.split(',')[0].trim();
  return [
    { icon: 'food', title: 'Where to Eat', content: `${cityName} has a vibrant food scene near ${team.stadium}. Check out local favorites within walking distance — street food vendors outside the venue often serve great regional dishes. Ask locals for their hidden gems.` },
    { icon: 'bars', title: 'Best Bars & Pubs', content: `The streets around ${team.stadium} come alive on game day. Local sports bars fill up 2–3 hours before kickoff with ${team.name} fans. Check the area closest to the main entrance for the best atmosphere.` },
    { icon: 'tips', title: 'Stadium Tips', content: `${team.stadium} (est. ${team.founded}) is home to ${team.name}. Arrive early to soak in the pre-game atmosphere. The team shop and museum (if available) are worth a visit. Check the venue's bag policy before you go.` },
    { icon: 'transport', title: 'Getting There', content: `Public transit is usually the best way to reach ${team.stadium} on game day. Check local transit apps for real-time schedules. Rideshares surge after events, so plan ahead or walk to a nearby pickup point.` },
    { icon: 'weather', title: 'Weather & What to Wear', content: `Weather in ${cityName} varies by season. Check the forecast a day before and dress in layers. If the venue is open-air, bring sun protection or rain gear as needed. Indoor arenas are climate-controlled.` },
  ];
}

// ── Fan Reviews ──────────────────────────────────────────────

interface FanReview {
  author: string;
  location: string;
  rating: number;
  text: string;
  daysAgo: number;
}

function getTeamReviews(team: TeamInfo): FanReview[] {
  const specific: Record<string, FanReview[]> = {
    'Real Madrid': [
      { author: 'Marco P.', location: 'Rome, Italy', rating: 5, text: 'The renovated Bernabéu is absolutely breathtaking. The retractable pitch and 360° screen are next level. The atmosphere when Madrid scores is pure electricity. A bucket-list experience for any football fan.', daysAgo: 2 },
      { author: 'Sarah K.', location: 'Austin, TX', rating: 5, text: 'Traveled from Texas to watch my first match at the Bernabéu. The stadium tour before the game was amazing. The new rooftop walk gives you panoramic views of the whole city. Unforgettable.', daysAgo: 5 },
      { author: 'Yuki H.', location: 'Tokyo, Japan', rating: 4, text: 'Beautiful stadium but the food inside is expensive (€8 for a small beer). The area around Paseo de la Castellana has great restaurants for pre-match meals. Ultras Sur atmosphere was incredible.', daysAgo: 9 },
    ],
    'Barcelona': [
      { author: 'Julia M.', location: 'Buenos Aires, Argentina', rating: 5, text: 'Camp Nou under construction but still incredible. The temporary seating has great views. Barcelona fans are passionate and welcoming. The city itself is magical — La Rambla, Sagrada Familia, the beach. Perfect trip.', daysAgo: 3 },
      { author: 'Tom W.', location: 'London, UK', rating: 4, text: 'The atmosphere in Gol Nord was electric. Renovation means reduced capacity so book early. Les Corts neighborhood has great tapas bars for pre-match. The Camp Nou Experience tour is worth it even on non-match days.', daysAgo: 7 },
      { author: 'Leila B.', location: 'Casablanca, Morocco', rating: 5, text: 'As a lifelong Barça fan, seeing them play live was a dream come true. The "Cant del Barça" with 60,000 fans gave me chills. Barcelona as a city is incredible for food, culture, and beach.', daysAgo: 12 },
    ],
    'Manchester City': [
      { author: 'Dave S.', location: 'Manchester, UK', rating: 5, text: 'The Etihad has been my home for years and the atmosphere keeps getting better. The south stand is where the noise is. Try the matchday food in the Fan Zone — much better than it used to be.', daysAgo: 1 },
      { author: 'Kim J.', location: 'Seoul, South Korea', rating: 4, text: 'First Premier League match and it was everything I hoped for. The Etihad Campus is impressive. Manchester is a great city with amazing nightlife. Just be prepared for rain — it rained all day.', daysAgo: 4 },
      { author: 'Patrick O.', location: 'Dublin, Ireland', rating: 4, text: 'Easy trip from Dublin. The tram drops you right at the stadium. Atmosphere is good but not quite Anfield-level. The curry mile on Wilmslow Road after the match is a must — best Indian food in the UK.', daysAgo: 8 },
    ],
    'Los Angeles Lakers': [
      { author: 'Tony R.', location: 'Los Angeles, CA', rating: 5, text: 'Nothing beats a Lakers game at Crypto.com Arena. The celebrity sightings, the energy when LeBron dunks, the showtime atmosphere — it\'s Hollywood meets basketball. L.A. Live before the game is perfect.', daysAgo: 2 },
      { author: 'Nina T.', location: 'Phoenix, AZ', rating: 4, text: 'Drove from Phoenix for the game. The arena is amazing but parking is brutal ($50!). Take the Metro instead. Food inside is pricey but good. Section 100 seats are worth the splurge for the experience.', daysAgo: 6 },
      { author: 'Raj P.', location: 'Mumbai, India', rating: 5, text: 'Flew to LA just for a Lakers game and it was worth every penny. The in-game entertainment, the dancers, the production value — it\'s an NBA experience like no other. Grand Central Market for pre-game food!', daysAgo: 10 },
    ],
    'Kansas City Chiefs': [
      { author: 'Mike B.', location: 'Kansas City, MO', rating: 5, text: 'Arrowhead is the LOUDEST stadium in the world — literally holds the Guinness record. The tailgating culture is legendary — people set up hours before with BBQ smokers. Best game-day atmosphere in the NFL, period.', daysAgo: 3 },
      { author: 'Jen W.', location: 'Denver, CO', rating: 4, text: 'Came as a Broncos fan and even I was impressed. The Chiefs Kingdom tailgate is insane — strangers share BBQ and beers. Inside, the noise level is deafening. Eat at Joe\'s KC BBQ before the game!', daysAgo: 8 },
      { author: 'Carlos M.', location: 'Mexico City', rating: 5, text: 'Traveled from Mexico for my first NFL game. Arrowhead did not disappoint. The KC BBQ is the best I\'ve ever had. Fans are incredibly friendly. The Mahomes era makes every game electric.', daysAgo: 14 },
    ],
    'New York Yankees': [
      { author: 'Sam L.', location: 'Bronx, NY', rating: 5, text: 'Born and raised a Yankees fan. The new Yankee Stadium captures the grandeur of the original. Monument Park is a must-see for any baseball fan. Nothing beats a summer night game with the crowd roaring.', daysAgo: 2 },
      { author: 'Hiro T.', location: 'Osaka, Japan', rating: 5, text: 'Flew from Japan to see the Yankees play. The stadium is magnificent. The food court behind section 200 has incredible options — way beyond typical ballpark food. Subway 4 train takes you right there.', daysAgo: 5 },
      { author: 'Emma R.', location: 'London, UK', rating: 4, text: 'My first baseball game ever and the Yankees delivered. The atmosphere is electric, the hot dogs are classic, and the 7th inning stretch is charming. Get bleacher seats for the most energetic fans.', daysAgo: 11 },
    ],
  };

  if (specific[team.name]) return specific[team.name];

  const cityName = team.city.split(',')[0].trim();
  return [
    { author: 'Sports Fan', location: cityName, rating: 4, text: `Great experience at ${team.stadium}! ${team.name} fans bring incredible energy on game day. The venue is well-organized and the atmosphere is electric. Would highly recommend visiting.`, daysAgo: 3 },
    { author: 'Travel Reporter', location: 'International', rating: 4, text: `Traveled to ${cityName} specifically for a ${team.name} game. The city itself has so much to offer beyond the sport — great food, culture, and nightlife. ${team.stadium} is a modern venue with good facilities.`, daysAgo: 7 },
    { author: 'Local Guide', location: cityName, rating: 5, text: `As a local, watching ${team.name} at ${team.stadium} never gets old. The pre-game atmosphere in the surrounding area is fantastic. Public transit handles the crowds well. Don't miss the local food scene!`, daysAgo: 12 },
  ];
}

// ── Quick-info cards ─────────────────────────────────────────

const TRIP_OPTIONS = [
  { icon: Ticket, title: 'Tickets', description: 'Buy & compare', iconBg: 'bg-[#22c55e]' },
  { icon: Bus, title: 'Transport', description: 'Get there', iconBg: 'bg-[#3b82f6]' },
  { icon: UtensilsCrossed, title: 'Food', description: 'Where to eat', iconBg: 'bg-[#f97316]' },
  { icon: Beer, title: 'Bars', description: 'Pre-game drinks', iconBg: 'bg-[#a855f7]' },
  { icon: Camera, title: 'Photos', description: 'Fan gallery', iconBg: 'bg-[#ef4444]' },
];

// ── Page Component ───────────────────────────────────────────

export function Team() {
  const { sportSlug, teamSlug } = useParams<{ sportSlug: string; teamSlug: string }>();
  const outletContext = useOutletContext<RootContext | null>();
  const isDark = outletContext?.isDark ?? true;
  const setIsDark = outletContext?.setIsDark;

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

  const team = findTeam(sportSlug ?? '', teamSlug ?? '');

  if (!team) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
        <div className="text-center space-y-4">
          <p className="text-6xl">🤷</p>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Team not found</h2>
          <Link to="/home" className="inline-flex items-center gap-2 text-[#22c55e] hover:underline">
            <ArrowLeft className="size-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const cityImage = CITY_IMAGES[team.city];
  const guides = getStadiumGuides(team);
  const reviews = getTeamReviews(team);

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#1a1a1a] text-[#e0e0e0]' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-[1400px] mx-auto px-6 pb-16">

        {/* ── Top nav bar (same as Match.tsx / Root) ── */}
        <header
          className={`sticky top-0 z-10 border-b -mx-6 px-6 py-3 ${
            isDark ? 'bg-[#1a1a1a] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'
          }`}
          style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
        >
          <div className="flex items-center justify-between gap-4">
            <Link to="/home" className="flex items-center gap-2 min-h-[44px] min-w-[44px] shrink-0">
              <span className="text-xl">⚽</span>
              <span className="text-lg font-bold text-[#22c55e] hidden sm:inline">Traveling for Sports</span>
            </Link>

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
              <Search className={`size-4 ml-3 shrink-0 transition-colors ${searchFocused ? 'text-[#22c55e]' : isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search matches, teams, cities..."
                className={`w-full bg-transparent border-none outline-none px-3 py-2 text-sm placeholder:text-gray-500 ${isDark ? 'text-white' : 'text-gray-900'}`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
                  className={`mr-1 p-1 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                >
                  <X className="size-3.5" />
                </button>
              )}
              <kbd className={`hidden sm:flex items-center mr-3 px-1.5 py-0.5 text-[10px] font-medium rounded border shrink-0 ${isDark ? 'border-white/10 text-gray-500 bg-white/5' : 'border-gray-200 text-gray-400 bg-gray-100'}`}>
                Ctrl K
              </kbd>
            </form>

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

        {/* ── Grid: sidebar + content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 mt-4">
          <aside className="hidden lg:block">
            <div className="sticky top-16">
              <SportsSidebar isDark={isDark} />
            </div>
          </aside>

          <div className="min-w-0">
            {/* Back link */}
            <Link
              to={`/teams/${team.sportSlug}`}
              className={`inline-flex items-center gap-1.5 text-sm mb-4 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <ArrowLeft className="size-4" /> Back to {team.sport}
            </Link>

            {/* ── Team Hero Card ── */}
            <section className={`rounded-xl border p-4 ${isDark ? 'border-[#333] bg-[#282828]' : 'border-gray-200 bg-white shadow-sm'}`}>
              <div className="flex flex-col items-center gap-4">
                <div className="flex w-full items-center gap-5">
                  <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-4xl ${isDark ? 'bg-[#3a3a3a]' : 'bg-gray-100'}`}>
                    {isFlagCode(team.badge) ? (
                      <img src={flagUrl(team.badge, 80)} alt={team.name} className="w-12 h-auto rounded-sm object-cover" />
                    ) : (
                      team.badge
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{team.name}</h1>
                    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs ${isDark ? 'text-[#a0a0a0]' : 'text-gray-500'}`}>
                      <span className="flex items-center gap-1">
                        <MapPin className={`h-3.5 w-3.5 ${isDark ? 'text-white' : 'text-gray-700'}`} />
                        {team.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className={`h-3.5 w-3.5 ${isDark ? 'text-white' : 'text-gray-700'}`} />
                        {team.stadium}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className={`h-3.5 w-3.5 ${isDark ? 'text-white' : 'text-gray-700'}`} />
                        Est. {team.founded}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${isDark ? 'bg-[#22c55e]/15 text-[#22c55e]' : 'bg-green-100 text-green-700'}`}>
                        {team.sportIcon} {team.sport}
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        <Users className="size-3" /> {team.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`h-px w-full ${isDark ? 'bg-[#3a3a3a]' : 'bg-gray-200'}`} />

                {/* Quick stats */}
                <div className="flex w-full justify-around text-center">
                  <div>
                    <Trophy className="size-5 mx-auto text-[#22c55e] mb-1" />
                    <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{team.category}</p>
                    <p className={`text-[10px] ${isDark ? 'text-[#808080]' : 'text-gray-400'}`}>Division</p>
                  </div>
                  <div>
                    <Heart className="size-5 mx-auto text-[#ef4444] mb-1" />
                    <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{2026 - team.founded}+ years</p>
                    <p className={`text-[10px] ${isDark ? 'text-[#808080]' : 'text-gray-400'}`}>Legacy</p>
                  </div>
                  <div>
                    <Clock className="size-5 mx-auto text-[#3b82f6] mb-1" />
                    <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Since {team.founded}</p>
                    <p className={`text-[10px] ${isDark ? 'text-[#808080]' : 'text-gray-400'}`}>Founded</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Plan your trip ── */}
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

            {/* ── Stadium & City Guide ── */}
            <div className="mt-6 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#22c55e]" />
              <h2 className={`text-sm font-bold ${isDark ? 'text-[#e0e0e0]' : 'text-gray-900'}`}>Stadium & City Guide</h2>
            </div>

            {cityImage && (
              <div className="mt-2 overflow-hidden rounded-xl">
                <img src={cityImage} alt={team.city} className="w-full h-40 object-cover" />
              </div>
            )}

            <div className="mt-2 space-y-2">
              {guides.map((guide) => {
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

            {/* ── Fan Reviews ── */}
            <div className="mt-6 flex items-center gap-2">
              <Quote className="h-4 w-4 text-[#22c55e]" />
              <h2 className={`text-sm font-bold ${isDark ? 'text-[#e0e0e0]' : 'text-gray-900'}`}>Fan Reviews</h2>
              <span className={`ml-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${isDark ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-green-100 text-green-700'}`}>
                {reviews.length}
              </span>
            </div>
            <div className="mt-2 space-y-2">
              {reviews.map((review) => (
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
                  <p className={`text-xs leading-relaxed italic ${isDark ? 'text-[#c0c0c0]' : 'text-gray-600'}`}>"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
