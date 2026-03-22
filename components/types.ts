export type Role = 'buyer' | 'seller' | 'creator' | 'admin' | 'community_member';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: Role;
  balance: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  vendor: string;
  
  // Images
  primaryImage: string;
  otherImages: string[];

  // Trust Signals (Mappings from your Entity)
  averageRating: number;
  reviewCount: number;  
  isOrganic: boolean;
  isVerifiedVendor: boolean;
  location: string;

   category: {
    id: string;
    name: string;
  };
  categoryId: string;

   seller: {
    id: string;
    companyName: string; 
    businessName: string; 
  };
  sellerProfileId: string;

  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    reviewer: {
      id: string;
      name: string;
      avatar: string;
    };
  }>;


  attributes: Record<string, any>;
  // status: ProductStatus;
  createdAt: string | Date;
  updatedAt: string | Date;


  // Frontend local state only
  quantity?: number; // Used for Cart management
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}

export interface Course {
  id: string;
  title: string;
  creator: string;
  price: number;
  image: string;
  students: number;
  rating: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  type: 'free' | 'paid';
  image: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'Deposit' | 'Purchase' | 'Withdrawal' | 'Sale';
  amount: number;
  status: 'Completed' | 'Pending';
}

export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
  groupName?: string;
}

export interface PendingAction {
  type: 'cart' | 'join' | 'enroll';
  data: any;
}