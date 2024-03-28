import { Activity, CircleUser, Home, ImagePlus, Search } from 'lucide-react';

export const sidebarLinks = [
  {
    label: 'Home',
    href: '/home',
    active: true,
    icon: <Home size='28' strokeWidth='1.5' />,
    activeIcon: <Home size='28' strokeWidth='2' />,
  },
  {
    label: 'Search',
    href: '/search',
    icon: <Search size='28' strokeWidth='1.5' />,
    activeIcon: <Search size='28' strokeWidth='2' />,
  },
  {
    label: 'Activity',
    href: '/activity',
    icon: <Activity size='28' strokeWidth='1.5' />,
    activeIcon: <Activity size='28' strokeWidth='2' />,
  },
  {
    label: 'Post',
    href: '/post',
    icon: <ImagePlus size='28' strokeWidth='1.5' />,
    activeIcon: <ImagePlus size='28' strokeWidth='2' />,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: <CircleUser size='28' strokeWidth='1.5' />,
    activeIcon: <CircleUser size='28' strokeWidth='2' />,
  },
];
