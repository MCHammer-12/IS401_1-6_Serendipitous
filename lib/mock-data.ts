export interface UserProfile {
  id: string;
  name: string;
  age: number;
  school: string;
  major: string;
  hometown: string;
  joinDate: string;
  connectionCount: number;
  interests: string[];
  quote: string;
  avatarUrl: string;
  latitude: number;
  longitude: number;
}

export interface Friend {
  id: string;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  online: boolean;
}

export const currentUser: UserProfile = {
  id: 'me',
  name: 'Alex Chen',
  age: 21,
  school: 'UCLA',
  major: 'Computer Science',
  hometown: 'San Francisco, CA',
  joinDate: 'Sep. 12, 2025',
  connectionCount: 13,
  interests: [
    'Rock climbing',
    'Make playlists',
    'Play volleyball',
    'Cook ramen',
    'Watch Succession',
    'Thrift shopping',
    'Sunset hikes',
  ],
  quote: 'Chaos is a ladder',
  avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
  latitude: 34.0689,
  longitude: -118.4452,
};

export const nearbyPeople: UserProfile[] = [
  {
    id: '1',
    name: 'Maya',
    age: 20,
    school: 'USC',
    major: 'Film Production',
    hometown: 'Austin, TX',
    joinDate: 'Jan. 5, 2026',
    connectionCount: 8,
    interests: ['Photography', 'Skateboarding', 'Cook ramen', 'Vinyl records', 'Film festivals'],
    quote: 'Life is what happens when you stop scrolling',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    latitude: 34.0695,
    longitude: -118.4430,
  },
  {
    id: '2',
    name: 'Jordan',
    age: 22,
    school: 'UCLA',
    major: 'Psychology',
    hometown: 'Portland, OR',
    joinDate: 'Nov. 20, 2025',
    connectionCount: 15,
    interests: ['Rock climbing', 'Play guitar', 'Sunset hikes', 'Coffee tasting', 'Board games'],
    quote: 'The best view comes after the hardest climb',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    latitude: 34.0675,
    longitude: -118.4470,
  },
  {
    id: '3',
    name: 'Priya',
    age: 21,
    school: 'CalTech',
    major: 'Bioengineering',
    hometown: 'Chicago, IL',
    joinDate: 'Feb. 1, 2026',
    connectionCount: 5,
    interests: ['Make playlists', 'Dance', 'Thrift shopping', 'Yoga', 'Podcasts'],
    quote: 'Dancing through the chaos',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    latitude: 34.0710,
    longitude: -118.4420,
  },
  {
    id: '4',
    name: 'Kai',
    age: 23,
    school: 'UCLA',
    major: 'Music',
    hometown: 'Honolulu, HI',
    joinDate: 'Aug. 15, 2025',
    connectionCount: 22,
    interests: ['Surf', 'Play volleyball', 'Cook', 'Photography', 'Sunset hikes'],
    quote: 'Catch waves, not feelings',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face',
    latitude: 34.0660,
    longitude: -118.4490,
  },
];

export const friends: Friend[] = [
  { id: '10', name: 'Sophia R.', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', lastMessage: 'omg that party was crazy', online: true },
  { id: '11', name: 'Marcus T.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', lastMessage: 'wanna grab boba later?', online: true },
  { id: '12', name: 'Lily K.', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', lastMessage: 'that playlist slaps', online: false },
  { id: '13', name: 'Dev P.', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', lastMessage: 'see you at the gym!', online: true },
  { id: '14', name: 'Zara M.', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face', lastMessage: 'thanks for the notes', online: false },
  { id: '15', name: 'Noah W.', avatarUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face', lastMessage: 'that concert was fire', online: false },
  { id: '16', name: 'Ava L.', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face', lastMessage: 'study sesh tomorrow?', online: true },
];

export function getCommonInterests(userId: string): string[] {
  const person = nearbyPeople.find(p => p.id === userId);
  if (!person) return [];
  return currentUser.interests.filter(i => person.interests.includes(i));
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  tags: string[];
  attendeeCount: number;
  friendsGoing: string[];
  isOpen: boolean;
}

export const events: Event[] = [
  {
    id: 'e1',
    title: 'Sunset Hike at Griffith Park',
    description: 'Join us for a chill sunset hike with great views of the city. All fitness levels welcome!',
    date: 'Feb 15, 2026',
    time: '5:00 PM',
    location: 'Griffith Observatory Trail',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=200&fit=crop',
    tags: ['Sunset hikes', 'Hiking', 'Photography'],
    attendeeCount: 24,
    friendsGoing: ['10', '13'],
    isOpen: true,
  },
  {
    id: 'e2',
    title: 'Vinyl & Chill Night',
    description: 'Bring your favorite records and discover new music with fellow vinyl lovers.',
    date: 'Feb 18, 2026',
    time: '7:30 PM',
    location: 'The Record Parlour, Hollywood',
    imageUrl: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=400&h=200&fit=crop',
    tags: ['Vinyl records', 'Make playlists', 'Music production'],
    attendeeCount: 16,
    friendsGoing: ['11', '12', '16'],
    isOpen: true,
  },
  {
    id: 'e3',
    title: 'Beach Volleyball Tournament',
    description: 'Casual 4v4 tournament at Santa Monica. Teams formed on site!',
    date: 'Feb 20, 2026',
    time: '10:00 AM',
    location: 'Santa Monica Beach Courts',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=200&fit=crop',
    tags: ['Play volleyball', 'Surf', 'Gym'],
    attendeeCount: 32,
    friendsGoing: ['13', '15'],
    isOpen: true,
  },
  {
    id: 'e4',
    title: 'Ramen Making Workshop',
    description: 'Learn to make authentic tonkotsu ramen from scratch. Ingredients provided!',
    date: 'Feb 22, 2026',
    time: '6:00 PM',
    location: 'UCLA Cooking Lab',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=200&fit=crop',
    tags: ['Cook ramen', 'Cook'],
    attendeeCount: 12,
    friendsGoing: ['10'],
    isOpen: true,
  },
  {
    id: 'e5',
    title: 'Indie Film Screening + Discussion',
    description: 'Watch an award-winning short film followed by a Q&A with the director.',
    date: 'Feb 25, 2026',
    time: '8:00 PM',
    location: 'Laemmle NoHo 7',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=200&fit=crop',
    tags: ['Film festivals', 'Photography', 'Podcasts'],
    attendeeCount: 45,
    friendsGoing: [],
    isOpen: true,
  },
  {
    id: 'e6',
    title: 'Morning Yoga in the Park',
    description: 'Start your day right with a free yoga session. Bring your own mat!',
    date: 'Feb 16, 2026',
    time: '7:00 AM',
    location: 'Westwood Park',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop',
    tags: ['Yoga', 'Meditation', 'Running'],
    attendeeCount: 18,
    friendsGoing: [],
    isOpen: true,
  },
  {
    id: 'e7',
    title: 'Board Game & Boba Night',
    description: 'Competitive and cooperative board games with unlimited boba refills.',
    date: 'Feb 19, 2026',
    time: '6:30 PM',
    location: 'GameHaus Cafe, Glendale',
    imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=200&fit=crop',
    tags: ['Board games', 'Gaming', 'Coffee tasting'],
    attendeeCount: 20,
    friendsGoing: ['11', '14'],
    isOpen: true,
  },
  {
    id: 'e8',
    title: 'Thrift Shopping Crawl',
    description: 'Hit 5 of LA\'s best thrift stores in one afternoon. Find hidden gems!',
    date: 'Feb 23, 2026',
    time: '1:00 PM',
    location: 'Meet at Goodwill on Fairfax',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=200&fit=crop',
    tags: ['Thrift shopping', 'Skateboarding'],
    attendeeCount: 15,
    friendsGoing: ['12', '16'],
    isOpen: true,
  },
];
