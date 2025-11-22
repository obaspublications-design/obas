
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteConfig, Lead, BlogPost, ServicePackage, Testimonial, Notification, NotificationType, SiteContextType } from '../types';

// Declare Netlify Identity on window
declare global {
  interface Window {
    netlifyIdentity: any;
  }
}

// --- Default Data (Fallbacks) ---
const defaultServices: ServicePackage[] = [
  {
    id: '1',
    title: 'Essential Editing',
    description: 'Grammar, syntax, and flow correction for clear communication.',
    price: '₦150,000',
    features: ['Grammar & Spelling', 'Sentence Structure', 'Flow & Clarity', '3-Day Turnaround'],
  },
  {
    id: '2',
    title: 'Publication-Ready',
    description: 'Comprehensive editing ensuring adherence to journal guidelines.',
    price: '₦350,000',
    features: ['Deep Editing', 'Journal Formatting', 'Reference Check', 'Cover Letter Creation', 'Unlimited Revisions'],
    isPopular: true,
  },
  {
    id: '3',
    title: 'Scientific Review',
    description: 'Technical review by subject matter experts in your field.',
    price: '₦600,000',
    features: ['Technical Accuracy Check', 'Methodology Review', 'Statistical Analysis Check', 'Detailed Report'],
  },
];

const defaultTestimonials: Testimonial[] = [
  { id: '1', name: 'Dr. Adewale Johnson', role: 'Senior Lecturer', institution: 'University of Lagos', content: 'Obas Publications transformed my rejected manuscript into a paper accepted by a Q1 Elsevier journal. Highly recommended!' },
  { id: '2', name: 'Prof. Chioma Okeke', role: 'Researcher', institution: 'Covenant University', content: 'The turnaround time was incredible. The "Publication-Ready" package saved me weeks of formatting headaches.' },
  { id: '3', name: 'Dr. Musa Ibrahim', role: 'Ph.D. Candidate', institution: 'Ahmadu Bello University', content: 'Professional, affordable, and strictly confidential. Their title optimizer tool is a game changer.' },
];

const defaultConfig: SiteConfig = {
  siteName: 'Obas Publications',
  heroHeadline: 'Elevate Your Academic Research',
  heroSubheadline: 'Professional editing and publication support for scholars aiming for high-impact international journals.',
  primaryColor: '#1e3a8a',
  secondaryColor: '#ca8a04',
  contactEmail: 'support@obaspublications.com',
  contactPhone: '+234 800 123 4567',
  contactAddress: 'Opposite Zenith Bank, Beside FUNAAB Gate, Alabata Road, Camp, Abeokuta, Ogun State',
  supportHours: 'Mon - Sat: 9:00 AM - 5:00 PM (WAT)'
};

const defaultBlogs: BlogPost[] = [
  { id: '1', title: 'How to Select the Right Journal for Your Research', excerpt: 'Avoid predatory journals and find the perfect home for your manuscript with these 5 tips.', author: 'Dr. Obas', date: '2023-10-15', tags: ['Publishing', 'Tips'] },
  { id: '2', title: 'Understanding Impact Factors and CiteScore', excerpt: 'Demystifying the metrics that matter in academic publishing.', author: 'Edit Team', date: '2023-11-02', tags: ['Metrics', 'Academic'] },
];

const STORAGE_KEYS = {
  CONFIG: 'obas_config',
  LEADS: 'obas_leads',
  BLOGS: 'obas_blogs',
  SERVICES: 'obas_services',
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider = ({ children }: { children?: ReactNode }) => {
  // --- State ---
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(defaultBlogs);
  const [services, setServices] = useState<ServicePackage[]>(defaultServices);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // --- Initialization (Load from LocalStorage & Netlify Identity) ---
  useEffect(() => {
    const loadData = () => {
      const savedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (savedConfig) setConfig(JSON.parse(savedConfig));

      const savedLeads = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (savedLeads) setLeads(JSON.parse(savedLeads));

      const savedBlogs = localStorage.getItem(STORAGE_KEYS.BLOGS);
      if (savedBlogs) setBlogPosts(JSON.parse(savedBlogs));

      const savedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (savedServices) setServices(JSON.parse(savedServices));
    };
    loadData();

    // Netlify Identity Setup
    if (window.netlifyIdentity) {
      window.netlifyIdentity.init();

      // Check current user
      const user = window.netlifyIdentity.currentUser();
      setIsAdmin(!!user);

      // Listeners
      window.netlifyIdentity.on('login', (user: any) => {
        setIsAdmin(true);
        addNotification(`Welcome back, ${user.user_metadata.full_name || 'Admin'}`, 'success');
        window.netlifyIdentity.close();
      });

      window.netlifyIdentity.on('logout', () => {
        setIsAdmin(false);
        addNotification('Logged out successfully', 'info');
      });

      window.netlifyIdentity.on('error', (err: any) => {
         console.error("Netlify Auth Error", err);
         addNotification('Authentication error occurred', 'error');
      });
    }
  }, []);

  // --- CSS Variable Updates ---
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', config.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', config.secondaryColor);
  }, [config]);

  // --- Notifications Helper ---
  const addNotification = (message: string, type: NotificationType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 5000); // Auto dismiss
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- Actions ---

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
    addNotification('Site settings updated successfully', 'success');
  };

  const updateService = (id: string, updates: Partial<ServicePackage>) => {
    const updatedServices = services.map(s => s.id === id ? { ...s, ...updates } : s);
    setServices(updatedServices);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updatedServices));
    addNotification('Service package updated', 'success');
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'date'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
    };
    const updatedLeads = [newLead, ...leads];
    setLeads(updatedLeads);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updatedLeads));
  };

  const addBlogPost = (postData: Omit<BlogPost, 'id' | 'date'>) => {
    const newPost: BlogPost = {
        ...postData,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
    };
    const updatedBlogs = [newPost, ...blogPosts];
    setBlogPosts(updatedBlogs);
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(updatedBlogs));
    addNotification('Blog post created successfully', 'success');
  };

  const deleteBlogPost = (id: string) => {
    const updatedBlogs = blogPosts.filter((post) => post.id !== id);
    setBlogPosts(updatedBlogs);
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(updatedBlogs));
    addNotification('Blog post deleted', 'info');
  };

  // Auth Actions Wrapper
  const login = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.open('login');
    } else {
      console.error('Netlify Identity script not loaded');
      addNotification('Authentication service unavailable', 'error');
    }
  };

  const logout = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.logout();
    }
  };

  const openProfile = () => {
    if (window.netlifyIdentity) {
        // Opening with 'login' tab when already logged in typically shows profile/user menu in default widget
        // or we can just open() and the widget detects the session
        window.netlifyIdentity.open(); 
    }
  }

  return (
    <SiteContext.Provider
      value={{
        config,
        updateConfig,
        leads,
        addLead,
        blogPosts,
        addBlogPost,
        deleteBlogPost,
        isAdmin,
        login,
        logout,
        openProfile,
        services,
        updateService,
        testimonials: defaultTestimonials,
        notifications,
        addNotification,
        removeNotification
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};