import { SocialEvent, EventCategory } from '../types/event';

export const COMMUNITY_IMAGES = {
  heroWinterDrive: '/src/assets/images/winter-drive.jpg',
  treePlantation: '/src/assets/images/tree-plantation.jpg',
  lakeCleanup: '/src/assets/images/lake-cleanup.jpg',
  medicalCamp: '/src/assets/images/medical-camp.jpg',
  foodRelief: '/src/assets/images/food-relief.jpg',
};

export const PRESET_THUMBNAILS: {
  label: string;
  url: string;
  category: EventCategory;
}[] = [
  {
    label: 'Winter Clothes',
    url: COMMUNITY_IMAGES.heroWinterDrive,
    category: 'Winter Relief',
  },
  {
    label: 'Blanket Relief',
    url: COMMUNITY_IMAGES.foodRelief,
    category: 'Donation',
  },
  {
    label: 'Cleanup',
    url: COMMUNITY_IMAGES.lakeCleanup,
    category: 'Cleanup',
  },
  {
    label: 'Tree Plantation',
    url: COMMUNITY_IMAGES.treePlantation,
    category: 'Plantation',
  },
  {
    label: 'Health Camp',
    url: COMMUNITY_IMAGES.medicalCamp,
    category: 'Health Camp',
  },
];

export const GALLERY_ITEMS = [
  {
    id: 'gal-1',
    tag: 'WARMTH FOR UNDERPRIVILEGED FAMILIES',
    impact: 'WARMTH FOR UNDERPRIVILEGED FAMILIES',
    title: 'Winter Clothes Drive',
    location: 'Mirpur 10, Dhaka',
    image: COMMUNITY_IMAGES.heroWinterDrive,
  },
  {
    id: 'gal-2',
    tag: 'HOMELESS ELDERLY CARE SUPPORT',
    impact: 'HOMELESS ELDERLY CARE SUPPORT',
    title: 'Night Blanket Relief',
    location: 'Mohammadpur, Dhaka',
    image: COMMUNITY_IMAGES.foodRelief,
  },
  {
    id: 'gal-3',
    tag: 'PLASTIC-FREE WATERBODY INITIATIVE',
    impact: 'PLASTIC-FREE WATERBODY INITIATIVE',
    title: 'Dhanmondi Lake Clean-up',
    location: 'Dhanmondi, Dhaka',
    image: COMMUNITY_IMAGES.lakeCleanup,
  },
  {
    id: 'gal-4',
    tag: '500+ SAPLINGS FOR GREENER DHAKA',
    impact: '500+ SAPLINGS FOR GREENER DHAKA',
    title: 'Urban Tree Plantation',
    location: 'Uttara, Dhaka',
    image: COMMUNITY_IMAGES.treePlantation,
  },
  {
    id: 'gal-5',
    tag: 'FRESH MEALS FOR DAILY EARNERS',
    impact: 'FRESH MEALS FOR DAILY EARNERS',
    title: 'Community Food Relief',
    location: 'Old Dhaka',
    image: COMMUNITY_IMAGES.foodRelief,
  },
  {
    id: 'gal-6',
    tag: 'COMMUNITY HEALTHCARE FOR FAMILIES',
    impact: 'COMMUNITY HEALTHCARE FOR FAMILIES',
    title: 'Free Health & Eye Camp',
    location: 'Banani, Dhaka',
    image: COMMUNITY_IMAGES.medicalCamp,
  },
];

function futureDateISO(daysAhead: number, hour = 10): string {
  const date = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
}

export function createInitialSeedEvents(): SocialEvent[] {
  return [
    {
      _id: 'evt-101',
      title: 'Winter Clothes Distribution – Mirpur 10, Dhaka',
      description:
        'Collecting and distributing warm clothes, jackets, sweaters, and shawls to underprivileged families, rickshaw pullers, and elderly residents across Mirpur 10 before the peak winter cold wave arrives.',
      eventType: 'Donation',
      thumbnailUrl: COMMUNITY_IMAGES.heroWinterDrive,
      location: 'Mirpur 10, Dhaka',
      eventDate: futureDateISO(8, 9),
      creatorEmail: 'amina.rahman@alaminfoundation.org',
      creatorName: 'Mirpur Youth Volunteers',
      creatorPhoto: 'https://api.dicebear.com/9.x/notionists/svg?seed=MirpurYouth&backgroundColor=d1fae5',
      participants: [
        {
          userEmail: 'tanvir.ahmed@alaminfoundation.org',
          userName: 'Tanvir Ahmed',
          userPhoto: 'https://api.dicebear.com/9.x/notionists/svg?seed=TanvirAhmed&backgroundColor=e0e7ff',
          joinedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      _id: 'evt-102',
      title: 'Blanket Distribution for the Needy – Mohammadpur, Dhaka',
      description:
        'Night-time thermal blanket distribution drive across pavement dwellers, orphanages, and senior citizens across Mohammadpur Town Hall and adjacent areas.',
      eventType: 'Winter Relief',
      thumbnailUrl: COMMUNITY_IMAGES.foodRelief,
      location: 'Mohammadpur, Dhaka',
      eventDate: futureDateISO(13, 15),
      creatorEmail: 'amina.rahman@alaminfoundation.org',
      creatorName: 'Mohammadpur Care Circle',
      creatorPhoto: 'https://api.dicebear.com/9.x/notionists/svg?seed=MohammadpurCare&backgroundColor=d1fae5',
      participants: [],
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      _id: 'evt-103',
      title: 'Dhanmondi Lake Clean-Up Campaign',
      description:
        'Join us this Saturday morning with gloves, biodegradable jute bags, and tools to clear plastic waste from walkways and lake borders around Rabindra Sarobar.',
      eventType: 'Cleanup',
      thumbnailUrl: COMMUNITY_IMAGES.lakeCleanup,
      location: 'Dhanmondi Lake, Dhaka',
      eventDate: futureDateISO(18, 8),
      creatorEmail: 'tanvir.ahmed@alaminfoundation.org',
      creatorName: 'Green Dhaka Youth',
      creatorPhoto: 'https://api.dicebear.com/9.x/notionists/svg?seed=GreenDhaka&backgroundColor=e0e7ff',
      participants: [],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      _id: 'evt-104',
      title: 'Urban Tree Plantation Drive',
      description:
        'Planting 500 fruit and shade saplings along school compounds and roadside pathways for a cooler, greener Uttara neighborhood.',
      eventType: 'Plantation',
      thumbnailUrl: COMMUNITY_IMAGES.treePlantation,
      location: 'Sector 7, Uttara, Dhaka',
      eventDate: futureDateISO(24, 9),
      creatorEmail: 'tanvir.ahmed@alaminfoundation.org',
      creatorName: 'Uttara Eco Club',
      creatorPhoto: 'https://api.dicebear.com/9.x/notionists/svg?seed=UttaraEco&backgroundColor=e0e7ff',
      participants: [],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      _id: 'evt-105',
      title: 'Community Free Health & Eye Camp',
      description:
        'Providing free health checkups, blood sugar screenings, and eyeglasses to underprivileged residents with certified volunteer doctors.',
      eventType: 'Health Camp',
      thumbnailUrl: COMMUNITY_IMAGES.medicalCamp,
      location: 'Korail Basti, Banani, Dhaka',
      eventDate: futureDateISO(30, 10),
      creatorEmail: 'nusrat.jahan@alaminfoundation.org',
      creatorName: 'Community Medical Aid',
      creatorPhoto: 'https://api.dicebear.com/9.x/notionists/svg?seed=NusratJahan&backgroundColor=fef3c7',
      participants: [],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      _id: 'evt-106',
      title: 'Old Town Food Relief & Meal Sharing',
      description:
        'Cooking and sharing 600 freshly prepared hot meals for homeless individuals and day laborers in Old Dhaka.',
      eventType: 'Food Drive',
      thumbnailUrl: COMMUNITY_IMAGES.foodRelief,
      location: 'Lalbagh, Old Dhaka',
      eventDate: futureDateISO(37, 11),
      creatorEmail: 'tanvir.ahmed@alaminfoundation.org',
      creatorName: 'Old Dhaka Welfare',
      creatorPhoto: 'https://api.dicebear.com/9.x/notionists/svg?seed=OldDhaka&backgroundColor=e0e7ff',
      participants: [],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      _id: 'evt-107',
      title: 'Slum Children Book & Stationery Drive',
      description:
        'Distributing storybooks, notebooks, pencils, school bags, and conducting interactive reading sessions for children in Rayerbazar.',
      eventType: 'Education',
      thumbnailUrl: COMMUNITY_IMAGES.heroWinterDrive,
      location: 'Rayerbazar, Dhaka',
      eventDate: futureDateISO(43, 9),
      creatorEmail: 'nusrat.jahan@alaminfoundation.org',
      creatorName: 'Light of Education BD',
      creatorPhoto: 'https://api.dicebear.com/9.x/notionists/svg?seed=LightEdu&backgroundColor=fef3c7',
      participants: [],
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      _id: 'evt-past-01',
      title: 'Monsoon Drainage Unblocking Drive – Old Dhaka (Completed)',
      description:
        'Historical completed event stored in the database to verify that past events are automatically filtered out from the Upcoming Events listings.',
      eventType: 'Cleanup',
      thumbnailUrl: COMMUNITY_IMAGES.lakeCleanup,
      location: 'Lalbagh, Dhaka',
      eventDate: new Date(Date.now() - 15 * 86400000).toISOString(),
      creatorEmail: 'tanvir.ahmed@alaminfoundation.org',
      creatorName: 'Old Dhaka Welfare',
      creatorPhoto: 'https://api.dicebear.com/9.x/notionists/svg?seed=OldDhaka&backgroundColor=e0e7ff',
      participants: [],
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
  ];
}
