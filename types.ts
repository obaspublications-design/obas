
export interface SiteConfig {
  siteName: string;
  heroHeadline: string;
  heroSubheadline: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  supportHours: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  serviceInterest: string;
  message: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  tags: string[];
}

export interface ServicePackage {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  institution: string;
  content: string;
}

export enum TitleImprovementStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

export interface SiteContextType {
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'date'>) => void;
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id' | 'date'>) => void;
  deleteBlogPost: (id: string) => void;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  openProfile: () => void;
  services: ServicePackage[];
  updateService: (id: string, updates: Partial<ServicePackage>) => void;
  testimonials: Testimonial[];
  notifications: Notification[];
  addNotification: (message: string, type: NotificationType) => void;
  removeNotification: (id: string) => void;
}