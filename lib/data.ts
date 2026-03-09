export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  availableInStore: boolean;
  limitedOffer?: {
    endDate: Date;
  };
  rating?: number;
  bestseller?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export const categories: Category[] = [
  { id: '1', name: 'Fiction', icon: 'BookOpen', count: 245 },
  { id: '2', name: 'Non-Fiction', icon: 'Book', count: 189 },
  { id: '3', name: 'Academic', icon: 'GraduationCap', count: 356 },
  { id: '4', name: 'Children', icon: 'Baby', count: 127 },
  { id: '5', name: 'Poetry', icon: 'Feather', count: 89 },
  { id: '6', name: 'Islamic', icon: 'Moon', count: 198 },
  { id: '7', name: 'Biography', icon: 'User', count: 76 },
  { id: '8', name: 'Science', icon: 'Atom', count: 143 },
  { id: '9', name: 'Medical', icon: 'HeartPulse', count: 210 },
  { id: '10', name: 'IELTS', icon: 'BookOpenCheck', count: 185 },
  { id: '11', name: 'Engineering', icon: 'Wrench', count: 320 },
  { id: '12', name: 'Knowledge', icon: 'Brain', count: 156 },
];

export const books: Book[] = [
  {
    id: '1',
    title: 'Pather Panchali',
    author: 'Bibhutibhushan Bandyopadhyay',
    price: 450,
    originalPrice: 600,
    discount: 25,
    image: '/images/books/book1.jpg',
    category: 'Fiction',
    availableInStore: true,
    limitedOffer: {
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
    rating: 4.8,
    bestseller: true,
  },
  {
    id: '2',
    title: 'Aparajito',
    author: 'Bibhutibhushan Bandyopadhyay',
    price: 380,
    originalPrice: 500,
    discount: 24,
    image: '/images/books/book2.jpg',
    category: 'Fiction',
    availableInStore: true,
    rating: 4.7,
    bestseller: true,
  },
  {
    id: '3',
    title: 'Srikanta',
    author: 'Sarat Chandra Chattopadhyay',
    price: 420,
    originalPrice: 550,
    discount: 24,
    image: '/images/books/book3.jpg',
    category: 'Fiction',
    availableInStore: true,
    rating: 4.6,
    bestseller: true,
  },
  {
    id: '4',
    title: 'Devdas',
    author: 'Sarat Chandra Chattopadhyay',
    price: 350,
    image: '/images/books/book4.jpg',
    category: 'Fiction',
    availableInStore: true,
    rating: 4.5,
  },
  {
    id: '5',
    title: 'Chokher Bali',
    author: 'Rabindranath Tagore',
    price: 480,
    originalPrice: 650,
    discount: 26,
    image: '/images/books/book5.jpg',
    category: 'Fiction',
    availableInStore: true,
    rating: 4.9,
    bestseller: true,
  },
  {
    id: '6',
    title: 'Gora',
    author: 'Rabindranath Tagore',
    price: 550,
    originalPrice: 750,
    discount: 27,
    image: '/images/books/book6.jpg',
    category: 'Fiction',
    availableInStore: true,
    rating: 4.8,
  },
  {
    id: '7',
    title: 'Agni Veena',
    author: 'Kazi Nazrul Islam',
    price: 280,
    image: '/images/books/book7.jpg',
    category: 'Poetry',
    availableInStore: true,
    rating: 4.7,
  },
  {
    id: '8',
    title: 'The Rebel',
    author: 'Kazi Nazrul Islam',
    price: 220,
    image: '/images/books/book8.jpg',
    category: 'Poetry',
    availableInStore: true,
    rating: 4.6,
  },
  {
    id: '9',
    title: 'Aranyak',
    author: 'Bibhutibhushan Bandyopadhyay',
    price: 390,
    originalPrice: 520,
    discount: 25,
    image: '/images/books/book9.jpg',
    category: 'Fiction',
    availableInStore: true,
    limitedOffer: {
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    rating: 4.5,
  },
  {
    id: '10',
    title: 'The Slaying of Meghanada',
    author: 'Michael Madhusudan Dutt',
    price: 320,
    image: '/images/books/book10.jpg',
    category: 'Poetry',
    availableInStore: true,
    rating: 4.4,
  },
  {
    id: '11',
    title: 'The Grave',
    author: 'Munir Chowdhury',
    price: 180,
    image: '/images/books/book11.jpg',
    category: 'Fiction',
    availableInStore: true,
    rating: 4.6,
  },
  {
    id: '12',
    title: 'The Bloody Field',
    author: 'Humayun Ahmed',
    price: 340,
    image: '/images/books/book12.jpg',
    category: 'Fiction',
    availableInStore: true,
    rating: 4.7,
  },
  {
    id: '13',
    title: 'Harrison\'s Principles of Internal Medicine',
    author: 'J. Larry Jameson',
    price: 3500,
    originalPrice: 4200,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80',
    category: 'Medical',
    availableInStore: true,
    rating: 4.9,
    bestseller: true,
  },
  {
    id: '14',
    title: 'Cambridge IELTS 18 Academic',
    author: 'Cambridge University Press',
    price: 450,
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&q=80',
    category: 'IELTS',
    availableInStore: true,
    rating: 4.8,
    bestseller: true,
  },
  {
    id: '15',
    title: 'Higher Engineering Mathematics',
    author: 'B.S. Grewal',
    price: 550,
    originalPrice: 650,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&q=80',
    category: 'Engineering',
    availableInStore: true,
    rating: 4.6,
  },
  {
    id: '16',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    price: 400,
    originalPrice: 500,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&q=80',
    category: 'Knowledge',
    availableInStore: true,
    rating: 4.9,
    bestseller: true,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Abdullah Al Mamun',
    location: 'Dhaka',
    rating: 5,
    comment: 'Very satisfied buying books from BookBuyBD. Prices are reasonable and the service is excellent.',
    date: '2024-01-15',
  },
  {
    id: '2',
    name: 'Fatima Khatun',
    location: 'Chittagong',
    rating: 5,
    comment: 'Fast delivery and amazing book quality. Will definitely order again.',
    date: '2024-01-20',
  },
  {
    id: '3',
    name: 'Mohammad Kamal',
    location: 'Sylhet',
    rating: 4,
    comment: 'Great to get books directly from Nilkhet. Prices are much lower than elsewhere.',
    date: '2024-02-05',
  },
  {
    id: '4',
    name: 'Sadia Islam',
    location: 'Rajshahi',
    rating: 5,
    comment: 'Custom printing service is amazing! Got my thesis printed beautifully.',
    date: '2024-02-12',
  },
  {
    id: '5',
    name: 'Rafi Hossein',
    location: 'Khulna',
    rating: 5,
    comment: 'Never seen such a beautiful online bookstore before. Thank you BookBuyBD.',
    date: '2024-02-18',
  },
  {
    id: '6',
    name: 'Nazma Akhtar',
    location: 'Barisal',
    rating: 4,
    comment: 'Book prices are affordable and the collection is huge. Wonderful experience.',
    date: '2024-02-25',
  },
];

export const heroSlides = [
  {
    id: '1',
    image: '/images/hero/slide1.jpg',
    title: 'Buy Books at Special Discounts',
    subtitle: 'Up to 30% discount on all books',
  },
  {
    id: '2',
    image: '/images/hero/slide2.jpg',
    title: 'New Collection Has Arrived',
    subtitle: 'Recently published books now available',
  },
  {
    id: '3',
    image: '/images/hero/slide3.jpg',
    title: 'Custom Printing Services',
    subtitle: 'Thesis, ID cards, and much more',
  },
];

export const printingServices = [
  {
    id: '1',
    title: 'Thesis Printing',
    description: 'Professional thesis printing with binding',
    icon: 'FileText',
    price: 'From 800 TK',
  },
  {
    id: '2',
    title: 'ID Card Printing',
    description: 'High-quality PVC ID cards',
    icon: 'CreditCard',
    price: 'From 50 TK',
  },
  {
    id: '3',
    title: 'Visiting Cards',
    description: 'Premium business cards',
    icon: 'Contact',
    price: 'From 300 TK',
  },
  {
    id: '4',
    title: 'Custom Mugs',
    description: 'Personalized photo mugs',
    icon: 'Coffee',
    price: 'From 400 TK',
  },
  {
    id: '5',
    title: 'Trophies',
    description: 'Custom awards and trophies',
    icon: 'Trophy',
    price: 'From 1200 TK',
  },
  {
    id: '6',
    title: 'Banners & Posters',
    description: 'Large format printing',
    icon: 'Image',
    price: 'From 500 TK',
  },
];
