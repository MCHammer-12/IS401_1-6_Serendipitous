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
