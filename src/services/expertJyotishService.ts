/**
 * Expert Jyotish Service
 * Manages astrology experts directory and consultations
 */

import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { getFirestoreDB } from './firebase';
import { isFirebaseConfigured } from '../utils/firebaseHelper';

export interface ExpertJyotish {
  id: string;
  name: string;
  specialization: string[];
  experience: number; // years
  rating: number; // 1-5
  languages: string[];
  consultationFee: number;
  availability: 'online' | 'offline' | 'both';
  bio: string;
  imageUrl?: string;
  location?: string;
  contactMethods: {
    phone?: string;
    email?: string;
    whatsapp?: string;
    website?: string;
  };
}

/**
 * Get all available experts
 */
export const getAllExperts = async (): Promise<ExpertJyotish[]> => {
  // Try to fetch from Firestore first if Firebase is configured
  if (isFirebaseConfigured()) {
    try {
      const db = getFirestoreDB();
      const expertsRef = collection(db, 'experts');
      const snapshot = await getDocs(expertsRef);
      
      if (!snapshot.empty) {
        const experts: ExpertJyotish[] = [];
        snapshot.forEach((doc) => {
          experts.push({
            id: doc.id,
            ...doc.data(),
          } as ExpertJyotish);
        });
        
        if (experts.length > 0) {
          return experts;
        }
      }
    } catch (error) {
      console.error('Error fetching experts from Firestore:', error);
      // Fall back to mock data
    }
  }
  
  // Fall back to mock data if Firestore is not configured or empty
  return getMockExperts();
};

/**
 * Get expert by ID
 */
export const getExpertById = async (id: string): Promise<ExpertJyotish | null> => {
  const experts = await getAllExperts();
  return experts.find((expert) => expert.id === id) || null;
};

/**
 * Search experts by specialization
 */
export const searchExperts = async (query: string): Promise<ExpertJyotish[]> => {
  const experts = await getAllExperts();
  const lowerQuery = query.toLowerCase();

  return experts.filter(
    (expert) =>
      expert.name.toLowerCase().includes(lowerQuery) ||
      expert.specialization.some((spec) => spec.toLowerCase().includes(lowerQuery)) ||
      expert.bio.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get experts by specialization
 */
export const getExpertsBySpecialization = async (
  specialization: string
): Promise<ExpertJyotish[]> => {
  const experts = await getAllExperts();
  return experts.filter((expert) =>
    expert.specialization.some((spec) => spec.toLowerCase() === specialization.toLowerCase())
  );
};

/**
 * Mock experts data
 */
const getMockExperts = (): ExpertJyotish[] => {
  return [
    {
      id: '1',
      name: 'Pandit Ramesh Shastri',
      specialization: ['Vedic Astrology', 'Kundali Matching', 'Muhurat'],
      experience: 25,
      rating: 4.8,
      languages: ['Hindi', 'English'],
      consultationFee: 500,
      availability: 'both',
      bio: 'Renowned Vedic astrologer with 25+ years of experience. Expert in Kundali matching, Muhurat selection, and Vedic remedies.',
      location: 'Varanasi, UP',
      contactMethods: {
        phone: '+91-9876543210',
        whatsapp: '+91-9876543210',
        email: 'ramesh.shastri@example.com',
      },
    },
    {
      id: '2',
      name: 'Acharya Priya Sharma',
      specialization: ['Career Guidance', 'Remedies', 'Gemstone Consultation'],
      experience: 15,
      rating: 4.6,
      languages: ['Hindi', 'English', 'Punjabi'],
      consultationFee: 750,
      availability: 'online',
      bio: 'Specialized in career astrology and gemstone remedies. Helps individuals align their professional lives with planetary influences.',
      location: 'Delhi',
      contactMethods: {
        phone: '+91-9876543211',
        whatsapp: '+91-9876543211',
        email: 'priya.sharma@example.com',
        website: 'https://priyasharma-astrology.com',
      },
    },
    {
      id: '3',
      name: 'Dr. Anand Joshi',
      specialization: ['Medical Astrology', 'Health Remedies', 'Dasha Analysis'],
      experience: 20,
      rating: 4.9,
      languages: ['Hindi', 'English', 'Marathi'],
      consultationFee: 1000,
      availability: 'both',
      bio: 'Medical astrologer combining traditional Vedic knowledge with modern understanding. Expert in health-related astrological remedies.',
      location: 'Mumbai, Maharashtra',
      contactMethods: {
        phone: '+91-9876543212',
        email: 'anand.joshi@example.com',
        website: 'https://anandjoshi-astrology.com',
      },
    },
    {
      id: '4',
      name: 'Pandita Laxmi Devi',
      specialization: ['Marriage Astrology', 'Love Compatibility', 'Relationship Remedies'],
      experience: 18,
      rating: 4.7,
      languages: ['Hindi', 'Telugu', 'English'],
      consultationFee: 600,
      availability: 'online',
      bio: 'Specialized in relationship and marriage astrology. Expert in love compatibility analysis and relationship harmony remedies.',
      location: 'Hyderabad, Telangana',
      contactMethods: {
        phone: '+91-9876543213',
        whatsapp: '+91-9876543213',
        email: 'laxmi.devi@example.com',
      },
    },
    {
      id: '5',
      name: 'Acharya Vikram Singh',
      specialization: ['Business Astrology', 'Financial Remedies', 'Vastu Consultation'],
      experience: 22,
      rating: 4.8,
      languages: ['Hindi', 'English'],
      consultationFee: 800,
      availability: 'both',
      bio: 'Business astrologer helping entrepreneurs and professionals align their financial goals with planetary positions.',
      location: 'Bangalore, Karnataka',
      contactMethods: {
        phone: '+91-9876543214',
        email: 'vikram.singh@example.com',
        website: 'https://vikramsingh-astrology.com',
      },
    },
  ];
};

