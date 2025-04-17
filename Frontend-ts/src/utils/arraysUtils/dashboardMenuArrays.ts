type LinkObj = {
    path: string,
    label: string;
    icon: string;
    dot?: boolean;
};

export const linkElements: LinkObj[] = [
    { path: '/', label: 'Home page', icon: 'solar:home-linear' },
    { path: '/dashboard', label: 'Dashboard', icon: 'carbon:dashboard-reference' },
    { path: 'myprofile', label: 'My profile', icon: 'healthicons:ui-user-profile' },
    { path: 'myhouse', label: 'My house', icon: 'uil:house-user' },
    { path: 'messages', label: 'Messages', icon: 'flowbite:messages-solid', dot: true, },
    { path: 'housemates', label: 'Housemates', icon: 'la:user-friends' },
    { path: 'transactions', label: 'Transactions', icon: 'tdesign:undertake-transaction' },
    { path: 'calendar', label: 'Calendar', icon: 'famicons:calendar-outline' },
];

export const adminLinksElements: LinkObj[] = [
    { path: 'adminpanel', label: 'AdminPanel', icon: 'clarity:administrator-solid' },
    { path: 'stats', label: 'Page stats', icon: 'uil:statistics' },
];