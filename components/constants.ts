import { Product, Order, Course, Group, Transaction, Post } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Organic Fertilizer 50kg',
    price: 45.00,
    image: 'https://picsum.photos/400/300?random=1',
    category: 'Feed & Supplies',
    vendor: 'GreenEarth Co.',
    location: 'Iowa, USA',
    rating: 4.8,
    reviews: 124,
    stock: 50,
    description: 'High quality organic fertilizer suitable for all crop types. Enriched with natural minerals.'
  },
  {
    id: '2',
    title: 'Holstein Dairy Cow',
    price: 1200.00,
    image: 'https://picsum.photos/400/300?random=2',
    category: 'Livestock',
    vendor: 'Happy Farms',
    location: 'Wisconsin, USA',
    rating: 4.9,
    reviews: 56,
    stock: 2,
    description: 'Healthy, vaccinated Holstein heifer ready for dairy production.'
  },
  {
    id: '3',
    title: 'Heavy Duty Tractor',
    price: 25000.00,
    image: 'https://picsum.photos/400/300?random=3',
    category: 'Equipment',
    vendor: 'AgriMachinery Ltd.',
    location: 'Texas, USA',
    rating: 4.5,
    reviews: 12,
    stock: 1,
    description: 'Refurbished 2018 model with low hours. Excellent condition.'
  },
  {
    id: '4',
    title: 'Corn Seeds - Drought Resistant',
    price: 85.00,
    image: 'https://picsum.photos/400/300?random=4',
    category: 'Seeds',
    vendor: 'SeedGen',
    location: 'Nebraska, USA',
    rating: 4.7,
    reviews: 89,
    stock: 200,
    description: 'Genetically optimized corn seeds for arid climates.'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2023-001',
    date: '2023-10-15',
    status: 'Delivered',
    total: 135.00,
    items: [{ name: 'Corn Seeds', quantity: 1, price: 85.00 }, { name: 'Fertilizer', quantity: 1, price: 50.00 }]
  },
  {
    id: 'ORD-2023-002',
    date: '2023-10-18',
    status: 'Processing',
    total: 45.00,
    items: [{ name: 'Organic Fertilizer', quantity: 1, price: 45.00 }]
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Sustainable Farming 101',
    creator: 'Dr. Sarah Green',
    price: 49.99,
    image: 'https://picsum.photos/400/300?random=5',
    students: 1200,
    rating: 4.8
  },
  {
    id: '2',
    title: 'Advanced Hydroponics',
    creator: 'TechAgri Institute',
    price: 129.00,
    image: 'https://picsum.photos/400/300?random=6',
    students: 450,
    rating: 4.6
  }
];

export const MOCK_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Organic Growers Network',
    description: 'A community for organic farming enthusiasts to share tips and tricks.',
    members: 5420,
    type: 'free',
    image: 'https://picsum.photos/400/300?random=7'
  },
  {
    id: '2',
    name: 'Commercial Livestock Traders',
    description: 'Professional trading discussions for livestock market trends.',
    members: 1200,
    type: 'paid',
    image: 'https://picsum.photos/400/300?random=8'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TRX-1', date: 'Oct 20, 2023', type: 'Deposit', amount: 500.00, status: 'Completed' },
  { id: 'TRX-2', date: 'Oct 18, 2023', type: 'Purchase', amount: -45.00, status: 'Completed' },
  { id: 'TRX-3', date: 'Oct 15, 2023', type: 'Purchase', amount: -135.00, status: 'Completed' },
];

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: { name: 'John Farmer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', role: 'Seller' },
    content: 'Just harvested my first batch of organic corn for the season! The yield looks promising despite the dry weather earlier this month. Check out the golden kernels! 🌽 #harvest2023 #organicfarming',
    image: 'https://picsum.photos/600/400?random=10',
    likes: 45,
    comments: 12,
    time: '2 hours ago',
    groupName: 'Organic Growers Network'
  },
  {
    id: '2',
    author: { name: 'Sarah Jenkins', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', role: 'Buyer' },
    content: 'Does anyone have recommendations for a good irrigation system for a small 2-acre plot? I am looking for something water-efficient for my vegetable garden.',
    likes: 18,
    comments: 24,
    time: '5 hours ago',
    groupName: 'Sustainable Farming 101'
  },
  {
    id: '3',
    author: { name: 'AgriTech Solutions', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agri', role: 'Creator' },
    content: 'We just published a new guide on Hydroponics setup for beginners. It covers everything from pH balance to nutrient solutions. Link in bio! 💧🌱',
    likes: 124,
    comments: 8,
    time: '1 day ago'
  }
];

export const CATEGORIES = [
  { name: 'Livestock', icon: '🐮' },
  { name: 'Feed', icon: '🌾' },
  { name: 'Seeds', icon: '🌱' },
  { name: 'Equipment', icon: '🚜' },
  { name: 'Tools', icon: '🛠️' },
  { name: 'Land', icon: '🏞️' },
  { name: 'Services', icon: '🤝' },
  { name: 'Storage', icon: '🏭' },
];