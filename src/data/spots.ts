import type { ImageMetadata } from 'astro';
import fatehSagar from '../assets/fateh-sagar.webp';
import pichola from '../assets/pichola.webp';
import gulabBagh from '../assets/gulab-bagh.webp';
import menar from '../assets/menar.webp';
import udaanPark from '../assets/udaan-park.webp';
import jungleSafariPark from '../assets/jungle-safari-park.webp';
import nelaTalab from '../assets/nela-talab.webp';
import jogiTalab from '../assets/jogi-talab.webp';
import roopSagar from '../assets/roop-sagar.webp';
import coordinates from './spot-coordinates.json';

// Shared with the build-time iNaturalist query so map and radius centres agree.
const centers = coordinates as Record<keyof typeof coordinates, `${number},${number}`>;

export interface Source {
  label: string;
  url: string;
}

export interface PhotoCredit extends Source {
  author: string;
  license: string;
  licenseUrl: string;
}

export type Spot = {
  id: string;
  name: string;
  area: string;
  category: 'lake' | 'woodland';
  habitat: string;
  description: string;
  time: string;
  season: string;
  closure?: string;
  image?: ImageMetadata;
  imageAlt?: string;
  imagePosition?: string;
  photo?: PhotoCredit;
  photoNote?: string;
  mapLabel: string;
  access: string;
  birdNote: string;
  birds: string[];
  sources: Source[];
} & (
  | { mapCoordinates: `${number},${number}`; mapUrl?: never }
  | { mapUrl: string; mapCoordinates?: never }
);

export const heroPhoto: PhotoCredit = {
  label: 'Purple sunbird, Udaipur',
  author: 'Gannu03',
  url: 'https://www.inaturalist.org/observations/213746821',
  license: 'CC BY-SA 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
};

export const spots: Spot[] = [
  {
    id: 'roop-sagar',
    name: 'Roop Sagar',
    area: 'Udaipur · Roop Sagar',
    category: 'lake',
    habitat: 'Lakes & wetlands',
    description: 'A lakeside spot shared by the group. Take your binoculars and spend some time watching the water from the shore.',
    time: 'Daylight, after checking access',
    season: 'Check water & access conditions',
    image: roopSagar,
    imageAlt: 'Roop Sagar lake framed by a palm tree and a brick wall, with buildings and low hills across the water',
    photoNote: 'Photo shared for this guide. Original photographer and reuse licence were not specified.',
    mapUrl: 'https://maps.app.goo.gl/ZnQGr5wXia8hKuvT8',
    mapLabel: 'Roop Sagar',
    access: 'Stay back from wet or unstable banks and respect private land. Ask in the group if you need help with the approach.',
    birds: [],
    birdNote: 'Ask fellow members about recent sightings at Roop Sagar, and share what you spot after your visit.',
    sources: [{ label: 'Roop Sagar · location shared by members', url: 'https://maps.app.goo.gl/ZnQGr5wXia8hKuvT8' }],
  },
  {
    id: 'jungle-safari-park',
    name: 'Jungle Safari Park',
    area: 'Udaipur · Sisarma Road',
    category: 'woodland',
    habitat: 'Parks & wooded areas',
    description: 'A park on Sisarma Road for a morning of birdwatching. Keep to the paths and pause to listen among the trees.',
    time: 'Daylight, after checking access',
    season: 'Check local conditions',
    closure: 'Closed on Sundays',
    image: jungleSafariPark,
    imageAlt: 'A red-roofed open pavilion amid a green lawn and mature trees at Jungle Safari Park, Udaipur',
    imagePosition: '50% 45%',
    photoNote: 'Photo shared for this guide. Original photographer and reuse licence were not specified.',
    mapCoordinates: centers['jungle-safari-park'],
    mapLabel: 'Jungle Safari Park',
    access: 'Closed on Sundays. Keep to marked visitor paths and follow park rules. Ask the group about recent visits if you’re going for the first time.',
    birds: [],
    birdNote: 'Listen for calls before looking through the trees. Fellow members can help with recent sightings and bird identification.',
    sources: [{ label: 'Jungle Safari Park · location shared by members', url: 'https://maps.app.goo.gl/ryLLNqZyx9JKE9dT6' }],
  },
  {
    id: 'udaan-park',
    name: 'Udaan Park',
    area: 'Udaipur · Swaroop Sagar',
    category: 'woodland',
    habitat: 'Parks & wooded areas',
    description: 'A park by Swaroop Sagar for a birding break close to home. Take your time and listen as you walk.',
    time: 'Daylight, after gates open',
    season: 'Check local conditions',
    image: udaanPark,
    imageAlt: 'Colourful bird-shaped decorations suspended over a curved garden path and trees at Udaan Park',
    imagePosition: '50% 28%',
    photoNote: 'Photo shared for this guide. Original photographer and reuse licence were not specified.',
    mapCoordinates: centers['udaan-park'],
    mapLabel: 'Udaan Park',
    access: 'Keep to public visitor areas and give other park users space. Ask fellow members if you need help planning your first visit.',
    birds: [],
    birdNote: 'Watch for free-flying birds around the trees. Share a photo or description in the group if you need help with an identification.',
    sources: [{ label: 'Udaan Park · location shared by members', url: 'https://maps.app.goo.gl/w5t2abxSsSd8yxrR7' }],
  },
  {
    id: 'menar-wetland',
    name: 'Menar Wetland Complex',
    area: 'Menar · outside Udaipur city',
    category: 'lake',
    habitat: 'Lakes & wetlands',
    description: 'Heading farther out with the group? Menar’s wetlands are outside Udaipur, so leave time for the journey and a longer watch by the ponds.',
    time: 'Daylight, after checking access',
    season: 'Winter, sightings vary',
    image: menar,
    imageAlt: 'A Eurasian spoonbill standing in shallow water and wetland vegetation, recorded at Menar Lake by Mathieu Soetens',
    photo: {
      label: 'Eurasian spoonbill at Menar Lake',
      author: 'Mathieu Soetens',
      url: 'https://www.inaturalist.org/observations/262804805',
      license: 'CC BY 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    },
    mapCoordinates: centers['menar-wetland'],
    mapLabel: 'Menar Wetland Complex',
    access: 'Arrange transport and your return with the group before setting out. Respect village activity and keep well away from nesting and roosting birds.',
    birds: [],
    birdNote: 'Ask members who’ve visited recently about water levels and sightings. Scan from a distance without approaching birds on the banks.',
    sources: [
      { label: 'Menar Wetland Complex · location shared by members', url: 'https://maps.app.goo.gl/UU8dmGQy2oGkmSHP9' },
    ],
  },
  {
    id: 'nela-talab',
    name: 'Nela Talab',
    area: 'Nela · Sector 14',
    category: 'lake',
    habitat: 'Lakes & wetlands',
    description: 'A lakeside walk in Sector 14. Find a safe place on the shore to stop and scan the water with your binoculars.',
    time: 'Daylight, after checking access',
    season: 'Check water & access conditions',
    image: nelaTalab,
    imageAlt: 'A paved lakeside promenade with railings and streetlights beside Nela Talab, with hills and a cloudy sky beyond',
    imagePosition: '50% 65%',
    photoNote: 'Photo shared for this guide. Original photographer and reuse licence were not specified.',
    mapCoordinates: centers['nela-talab'],
    mapLabel: 'Nela Talab',
    access: 'Stay on the paths and back from wet or unstable banks. Avoid entering the water and respect private land along the shore.',
    birds: [],
    birdNote: 'Ask in the group about recent sightings around the lake. Share your own observations after a visit to help the next member heading out.',
    sources: [{ label: 'Nela Talab · location shared by members', url: 'https://maps.app.goo.gl/j4ZBKDtC3Ub2c8MB7' }],
  },
  {
    id: 'jogi-talab',
    name: 'Jogi Talab',
    area: 'Udaipur · Titrdi',
    category: 'lake',
    habitat: 'Lakes & wetlands',
    description: 'A lakeside spot in Titrdi, shared by members for a birding morning. Watch from the shore without disturbing the birds.',
    time: 'Daylight, after checking access',
    season: 'Check water & access conditions',
    image: jogiTalab,
    imageAlt: 'Palm trees and a low hillside reflected in the still blue water of Jogi Talab',
    imagePosition: '50% 45%',
    photoNote: 'Photo shared for this guide. Original photographer and reuse licence were not specified.',
    mapCoordinates: centers['jogi-talab'],
    mapLabel: 'Jogi Talab',
    access: 'Go in daylight and keep away from unstable banks. Ask fellow members for approach advice, and avoid crossing private land.',
    birds: [],
    birdNote: 'Take time to scan the water and shoreline from a distance. Ask the group what members have seen recently.',
    sources: [{ label: 'Jogi Talab · location shared by members', url: 'https://maps.app.goo.gl/mzVBwV5V2mmGAB3TA' }],
  },
  {
    id: 'fateh-sagar',
    name: 'Fateh Sagar',
    area: 'Udaipur · Rani Road',
    category: 'lake',
    habitat: 'Lakes & wetlands',
    description: 'A familiar lakeside walk along Rani Road. Bring your binoculars and pause to scan the water instead of walking straight past.',
    time: 'Early morning',
    season: 'Cooler months',
    image: fatehSagar,
    imageAlt: 'Blue water at Fateh Sagar Lake, with the lakeside railing and Aravalli hills beyond',
    photo: {
      label: 'Fateh Sagar Lake, Udaipur1.jpg',
      author: 'WikiAnchor10',
      url: 'https://commons.wikimedia.org/wiki/File:Fateh_Sagar_Lake,_Udaipur1.jpg',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
    mapCoordinates: centers['fateh-sagar'],
    mapLabel: 'Fateh Sagar Pal promenade',
    access: 'Stay on public lakeside paths and keep clear of traffic and wet lake edges. Ask the group where members have been watching recently.',
    birds: ['Grey heron', 'Little cormorant'],
    birdNote: 'Local observations around the lake include grey herons and little cormorants. Ask in the group for recent sightings.',
    sources: [
      { label: 'Grey heron · local observation', url: 'https://www.inaturalist.org/observations/411724835' },
      { label: 'Little cormorant · local observation', url: 'https://www.inaturalist.org/observations/411924277' },
    ],
  },
  {
    id: 'pichola',
    name: 'Lake Pichola',
    area: 'Udaipur · Gangaur Ghat',
    category: 'lake',
    habitat: 'Lakes & wetlands',
    description: 'Stop at Gangaur Ghat for a birdwatch by the water. A handy old-city spot when you have time for a shorter outing.',
    time: 'Early morning',
    season: 'Cooler months',
    image: pichola,
    imageAlt: 'Lake Pichola in Udaipur, with the Lake Palace and hills across the water',
    photo: {
      label: 'Udaipur Lake India.JPG',
      author: 'Uri Sittan / Tripo',
      url: 'https://commons.wikimedia.org/wiki/File:Udaipur_Lake_India.JPG',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    },
    mapCoordinates: centers.pichola,
    mapLabel: 'Gangaur Ghat public waterfront',
    access: 'Watch your footing on the ghat steps, especially when wet. Give worshippers and residents space, and stay out of private hotel grounds.',
    birds: ['Tufted duck', 'Eurasian coot', 'Bank myna'],
    birdNote: 'Local observations include tufted ducks and Eurasian coots on the lake, and bank mynas near the old-city shoreline. Sightings change with the season.',
    sources: [
      { label: 'Tufted duck · Pichola observation', url: 'https://www.inaturalist.org/observations/147609454' },
      { label: 'Eurasian coot · Pichola observation', url: 'https://www.inaturalist.org/observations/147682058' },
      { label: 'Bank myna · shoreline observation', url: 'https://www.inaturalist.org/observations/413920861' },
    ],
  },
  {
    id: 'gulab-bagh',
    name: 'Gulab Bagh',
    area: 'Udaipur · Udiapole',
    category: 'woodland',
    habitat: 'Parks & wooded areas',
    description: 'Walk the garden paths and pause beneath the old trees to listen. A change from the lakeside for your next birding morning.',
    time: 'Morning, after gates open',
    season: 'Cooler months',
    image: gulabBagh,
    imageAlt: 'A tiered fountain surrounded by mature trees in Gulab Bagh garden, Udaipur',
    imagePosition: '50% 52%',
    photo: {
      label: 'GulabBagh.jpg',
      author: 'Vishal0soni',
      url: 'https://commons.wikimedia.org/wiki/File:GulabBagh.jpg',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    },
    mapCoordinates: centers['gulab-bagh'],
    mapLabel: 'Gulab Bagh Main Road approach',
    access: 'Keep to the garden paths and watch for free-flying birds. The ticketed Bird Park is separate from birdwatching in the garden; there’s no need to approach enclosures.',
    birds: ['Rose-ringed parakeet'],
    birdNote: 'Rose-ringed parakeets have been recorded locally. Listen around the trees and ask fellow members about other recent sightings in the garden.',
    sources: [
      { label: 'Wild parakeet · community observation', url: 'https://www.inaturalist.org/observations/410933377' },
    ],
  },
];

export function googleMapsUrl(coordinates: NonNullable<Spot['mapCoordinates']>): string {
  const url = new URL('https://www.google.com/maps/search/');
  url.searchParams.set('api', '1');
  url.searchParams.set('query', coordinates);
  return url.href;
}
