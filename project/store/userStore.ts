import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarColor: string;
  initials: string;
  travelStyle: string;
  favoriteDestinations: string[];
  foodPreference: string;
  typicalBudget: number;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

const defaultUser: User = {
  id: 'u1',
  name: 'Gungun',
  email: 'gungun@travelsphere.app',
  phone: '+91 98765 43210',
  avatarColor: 'bg-ocean text-white',
  initials: 'Gu',
  travelStyle: 'Nature & Beaches',
  favoriteDestinations: ['Kerala', 'Goa', 'Meghalaya'],
  foodPreference: 'Non-vegetarian · Local cuisine',
  typicalBudget: 12000,
};

export const useUserStore = create<UserState>((set) => ({
  user: defaultUser,
  isAuthenticated: false,
  login: (email) =>
    set({
      isAuthenticated: true,
      user: { ...defaultUser, email: email || defaultUser.email },
    }),
  signup: (name, email) =>
    set({
      isAuthenticated: true,
      user: {
        ...defaultUser,
        name: name || defaultUser.name,
        email: email || defaultUser.email,
        initials: (name || 'Gungun').slice(0, 2),
      },
    }),
  logout: () => set({ isAuthenticated: false }),
  updateUser: (patch) =>
    set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
}));
