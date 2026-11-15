import type { ImageMetadata } from 'astro';
import fatehSagar from '../assets/fateh-sagar.webp';
import pichola from '../assets/pichola.webp';
import gulabBagh from '../assets/gulab-bagh.webp';
import menar from '../assets/menar.webp';
import udaanPark from '../assets/udaan-park.webp';
import jungleSafariPark from '../assets/jungle-safari-park.webp';
import nelaTalab from '../assets/nela-talab.webp';
import jogiTalab from '../assets/jogi-talab.webp';

export const checkedOn = '2026-11-15';
export const checkedLabel = '15 November 2026';

export interface Source {
  label: string;
  url: string;
}

export interface PhotoCredit extends Source {
  author: string;
  license: string;
  licenseUrl: string;
}

export interface Spot {
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
  mapCoordinates: `${number},${number}`;
  mapLabel: string;
  access: string;
  birdNote: string;
  birds: string[];
  sources: Source[];
}

export const heroPhoto: PhotoCredit = {
  label: 'Purple sunbird, Udaipur',
  author: 'Gannu03',
  url: 'https://www.inaturalist.org/observations/213746821',
  license: 'CC BY-SA 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
};

const tourism = 'https://www.tourism.rajasthan.gov.in/udaipur.html';

export const spots: Spot[] = [
  {
    id: 'jungle-safari-park',
    name: 'Jungle Safari Park',
    area: 'Udaipur · Sisarma Road',
    category: 'woodland',
    habitat: 'Parks & wooded areas',
    description: 'A park location to add to your Udaipur birding plans. Open the shared map pin and check visitor access before setting out.',
    time: 'Daylight, after checking access',
    season: 'Check local conditions',
    closure: 'Closed on Sundays',
    image: jungleSafariPark,
    imageAlt: 'A red-roofed open pavilion amid a green lawn and mature trees at Jungle Safari Park, Udaipur',
    imagePosition: '50% 45%',
    photoNote: 'Image supplied by the site owner. Original photographer and reuse licence were not specified.',
    mapCoordinates: '24.5626744,73.6653277',
    mapLabel: 'Jungle Safari Park Udaipur · user-shared place pin',
    access: 'Closed on Sundays, as confirmed by the guide’s owner. This is the place pin shared for the guide, not a field-checked entrance. Confirm visitor access, opening hours on other days, any fees, and permitted walking routes locally. Do not enter restricted land or leave marked visitor paths.',
    birds: [],
    birdNote: 'Suggested by the guide’s owner. A wild-bird species list has not yet been verified for this location; no particular sighting is promised.',
    sources: [{ label: 'Shared Google Maps location · Jungle Safari Park', url: 'https://maps.app.goo.gl/ryLLNqZyx9JKE9dT6' }],
  },
  {
    id: 'udaan-park',
    name: 'Udaan Park',
    area: 'Udaipur · Swaroop Sagar',
    category: 'woodland',
    habitat: 'Parks & wooded areas',
    description: 'A city-park option for your next birdwatching outing. Take a quiet pause, listen first, and keep to the public visitor areas.',
    time: 'Daylight, after gates open',
    season: 'Check local conditions',
    image: udaanPark,
    imageAlt: 'Colourful bird-shaped decorations suspended over a curved garden path and trees at Udaan Park',
    imagePosition: '50% 28%',
    photoNote: 'Image supplied by the site owner. Original photographer and reuse licence were not specified.',
    mapCoordinates: '24.5901086,73.6836062',
    mapLabel: 'Udaan Park · user-shared place pin',
    access: 'The map pin identifies Udaan Park. Opening hours, fees, and the currently usable entrance have not been independently checked. Follow local signs, respect other park users, and confirm access before an early visit.',
    birds: [],
    birdNote: 'Suggested by the guide’s owner. Wild-bird records are still to be checked for this park, so no species checklist is published yet.',
    sources: [{ label: 'Shared Google Maps location · Udaan Park', url: 'https://maps.app.goo.gl/w5t2abxSsSd8yxrR7' }],
  },
  {
    id: 'menar-wetland',
    name: 'Menar Wetland Complex',
    area: 'Menar · outside Udaipur city',
    category: 'lake',
    habitat: 'Lakes & wetlands',
    description: 'Make time for a separate trip to Menar’s wetlands. This village outside Udaipur is known for winter birdwatching around its ponds.',
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
    mapCoordinates: '24.5931707,74.113049',
    mapLabel: 'Menar Wetland Complex · user-shared place pin',
    access: 'Menar is outside Udaipur city: plan transport and your return trip separately. The shared pin marks the wetland complex, not a verified entrance or a route across the ponds. Ask locally where visitors may stand, respect village activity, and keep away from nesting and roosting birds.',
    birds: [],
    birdNote: 'Rajasthan Tourism describes Menar’s ponds as a winter destination for migratory birds. A species list specific to this map pin has not yet been checked; water levels and sightings vary.',
    sources: [
      { label: 'Shared Google Maps location · Menar Wetland Complex', url: 'https://maps.app.goo.gl/UU8dmGQy2oGkmSHP9' },
      { label: 'Rajasthan Tourism · Menar birdwatching', url: `${tourism}#menar` },
    ],
  },
  {
    id: 'nela-talab',
    name: 'Nela Talab',
    area: 'Nela · Sector 14',
    category: 'lake',
    habitat: 'Lakes & wetlands',
    description: 'A lake location on the southern side of Udaipur. Use the shared pin to plan a visit, and watch from a safe, permitted spot on shore.',
    time: 'Daylight, after checking access',
    season: 'Check water & access conditions',
    image: nelaTalab,
    imageAlt: 'A paved lakeside promenade with railings and streetlights beside Nela Talab, with hills and a cloudy sky beyond',
    imagePosition: '50% 65%',
    photoNote: 'Image supplied by the site owner. Original photographer and reuse licence were not specified.',
    mapCoordinates: '24.5361875,73.6995469',
    mapLabel: 'Nela Talab · user-shared place pin',
    access: 'The shared pin identifies Nela Talab, not an inspected public entrance. Check access locally and do not assume the entire shoreline is walkable. Stay back from wet or unstable banks, avoid entering the water, and respect private land.',
    birds: [],
    birdNote: 'Suggested by the guide’s owner. No location-specific wild-bird checklist has been verified yet. Treat this as a place to investigate, not a promise of waterbird sightings.',
    sources: [{ label: 'Shared Google Maps location · Nela Talab', url: 'https://maps.app.goo.gl/j4ZBKDtC3Ub2c8MB7' }],
  },
  {
    id: 'jogi-talab',
    name: 'Jogi Talab',
    area: 'Udaipur · Titrdi',
    category: 'lake',
    habitat: 'Lakes & wetlands',
    description: 'A lakeside stop for a birding outing on Udaipur’s southern outskirts. Check the approach before you go and watch without disturbing the shore.',
    time: 'Daylight, after checking access',
    season: 'Check water & access conditions',
    image: jogiTalab,
    imageAlt: 'Palm trees and a low hillside reflected in the still blue water of Jogi Talab',
    imagePosition: '50% 45%',
    photoNote: 'Image supplied by the site owner. Original photographer and reuse licence were not specified.',
    mapCoordinates: '24.5076586,73.6969969',
    mapLabel: 'Jogi Talab · user-shared place pin',
    access: 'This is the shared viewpoint pin. Road conditions, parking, terrain, and public access have not been field-checked. Plan a daylight visit, confirm a safe approach locally, and do not cross private land or climb down unstable banks.',
    birds: [],
    birdNote: 'Suggested by the guide’s owner. Wild-bird records at the viewpoint have not yet been checked, so no species or seasonal sightings are claimed.',
    sources: [{ label: 'Shared Google Maps location · Jogi Talab', url: 'https://maps.app.goo.gl/mzVBwV5V2mmGAB3TA' }],
  },
  {
    id: 'fateh-sagar',
    name: 'Fateh Sagar',
    area: 'Udaipur · Rani Road',
    category: 'lake',
    habitat: 'Lakes & wetlands',
    description: 'An open lakeside walk, Aravalli views, and plenty of water to scan. A lovely place to slow down with your binoculars.',
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
    mapCoordinates: '24.6012962,73.6796795',
    mapLabel: 'Fateh Sagar Pal promenade',
    access: 'The map pin is the Pal promenade, not an island or a point in the lake. Stay on public lakeside paths and follow local signs. Check access before an early visit; opening information online varies. Keep clear of roads and wet lake edges.',
    birds: ['Grey heron', 'Little cormorant'],
    birdNote: 'Recent community records from the lake and its eastern shore include these birds. The records cover the wider lake, not a guaranteed sighting at the map pin.',
    sources: [
      { label: 'Rajasthan Tourism · lake information', url: `${tourism}#fateh-sagar-lake` },
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
    description: 'Look beyond the palaces to the water and the birds above it. Start at Gangaur Ghat for a short watch in the old city.',
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
    mapCoordinates: '24.5799237,73.6819255',
    mapLabel: 'Gangaur Ghat public waterfront',
    access: 'The map opens Gangaur Ghat, a public waterfront, rather than the middle of Pichola. Expect steps and uneven or slippery stone. Respect worshippers and residents, and do not enter private hotel grounds or approach bird islands.',
    birds: ['Tufted duck', 'Eurasian coot', 'Bank myna'],
    birdNote: 'Community records document ducks and coots on Pichola and bank mynas near the old-city shoreline. Some records are seasonal or historical; the ghat is a viewing starting point, not the observation location for every species.',
    sources: [
      { label: 'Rajasthan Tourism · lake information', url: `${tourism}#lake-pichola` },
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
    description: 'Trade the lakeside for leafy garden paths. Pause beneath the old trees and listen before looking for your next bird.',
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
    // Replace with an entrance pin only after the specific gate has been checked.
    mapCoordinates: '24.5702922,73.6902424',
    mapLabel: 'Gulab Bagh Main Road approach',
    access: 'The map opens Gulab Bagh Main Road, the garden approach; it is not a verified gate pin. Follow signs to an open public garden gate. Confirm current garden access locally. The ticketed Bird Park is a separate captive-bird attraction; this guide is for watching free-living birds in the garden.',
    birds: ['Rose-ringed parakeet'],
    birdNote: 'A community observation in the Gulab Bagh / Bird Park area is marked as a wild rose-ringed parakeet. This is not a checklist of the park’s captive birds; look for free-flying birds without entering enclosures.',
    sources: [
      { label: 'Rajasthan Tourism · garden and Bird Park', url: `${tourism}#gulab-bagh-and-zoo` },
      { label: 'Garden layout and public access', url: 'https://en.wikipedia.org/wiki/Gulab_Bagh_and_Zoo' },
      { label: 'Wild parakeet · community observation', url: 'https://www.inaturalist.org/observations/410933377' },
    ],
  },
];

export function googleMapsUrl(coordinates: Spot['mapCoordinates']): string {
  const url = new URL('https://www.google.com/maps/search/');
  url.searchParams.set('api', '1');
  url.searchParams.set('query', coordinates);
  return url.href;
}
