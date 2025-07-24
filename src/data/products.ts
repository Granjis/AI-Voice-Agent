import { Product } from '@/types/product';

export const products: Product[] = [
  // Home Electronics
  {
    id: '1',
    name: 'HoloDisplay Pro 8K',
    category: 'home-electronics',
    price: 3499,
    description: 'Ultra-thin holographic display for immersive home entertainment',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop',
    guidelines: 'Requires 5G connection for optimal performance. Wall mounting recommended.',
    features: [
      '8K holographic projection',
      'Gesture control',
      'Voice activation',
      'Wireless streaming'
    ],
    tags: ['display', 'entertainment', 'holographic', 'premium'],
    rating: 4.9,
    inStock: true,
    relatedProducts: ['2', '3']
  },
  {
    id: '2',
    name: 'Quantum Sound System',
    category: 'home-electronics',
    price: 1299,
    description: 'Spatial audio system with quantum acoustic processing',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=600&fit=crop',
    guidelines: 'Optimal performance in rooms 200-500 sq ft. Calibration required.',
    features: [
      '360-degree spatial audio',
      'Quantum processing',
      'Adaptive acoustics',
      'Multi-room sync'
    ],
    tags: ['audio', 'quantum', 'spatial', 'premium'],
    rating: 4.7,
    inStock: true,
    relatedProducts: ['1', '4']
  },
  {
    id: '3',
    name: 'ClimateSync Controller',
    category: 'home-electronics',
    price: 899,
    description: 'AI-powered climate control system with predictive optimization',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    guidelines: 'Compatible with most HVAC systems. Professional installation recommended.',
    features: [
      'Predictive climate control',
      'Energy optimization',
      'Air quality monitoring',
      'Smart scheduling'
    ],
    tags: ['climate', 'ai', 'energy', 'smart'],
    rating: 4.6,
    inStock: true,
    relatedProducts: ['1', '2']
  },

  // Office Tech
  {
    id: '4',
    name: 'MindDesk Interface',
    category: 'office-tech',
    price: 2799,
    description: 'Neural-responsive desk with adaptive workspace optimization',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    guidelines: 'Requires initial neural calibration. Software updates included.',
    features: [
      'Neural responsiveness',
      'Adaptive height',
      'Wireless charging surface',
      'Biometric security'
    ],
    tags: ['desk', 'neural', 'workspace', 'premium'],
    rating: 4.8,
    inStock: true,
    relatedProducts: ['5', '6']
  },
  {
    id: '5',
    name: 'AirProject Pro',
    category: 'office-tech',
    price: 1899,
    description: 'Holographic projection system for immersive presentations',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    guidelines: 'Requires clear 10ft projection space. Remote collaboration ready.',
    features: [
      'Holographic projection',
      'Multi-user interaction',
      'Cloud integration',
      'Real-time collaboration'
    ],
    tags: ['projection', 'holographic', 'collaboration', 'enterprise'],
    rating: 4.5,
    inStock: true,
    relatedProducts: ['4', '7']
  },
  {
    id: '6',
    name: 'ErgoChair Quantum',
    category: 'office-tech',
    price: 1299,
    description: 'Self-adjusting ergonomic chair with posture optimization',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    guidelines: 'Automatic posture adjustment. Health monitoring included.',
    features: [
      'Posture optimization',
      'Health monitoring',
      'Adaptive comfort',
      'Stress detection'
    ],
    tags: ['ergonomic', 'health', 'adaptive', 'premium'],
    rating: 4.7,
    inStock: false,
    relatedProducts: ['4', '5']
  },

  // Outdoor Living
  {
    id: '7',
    name: 'SolarShade Pavilion',
    category: 'outdoor-living',
    price: 4999,
    description: 'Smart solar pavilion with climate control and energy generation',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    guidelines: 'Weather-resistant design. Installation requires 15x15ft space.',
    features: [
      'Solar energy generation',
      'Climate control',
      'Weather adaptation',
      'Wireless connectivity'
    ],
    tags: ['solar', 'pavilion', 'outdoor', 'sustainable'],
    rating: 4.9,
    inStock: true,
    relatedProducts: ['8', '9']
  },
  {
    id: '8',
    name: 'AquaGrow System',
    category: 'outdoor-living',
    price: 2199,
    description: 'Automated hydroponic garden with AI plant optimization',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
    guidelines: 'Requires water and power connection. Includes starter plants.',
    features: [
      'AI plant optimization',
      'Automated watering',
      'Nutrient management',
      'Harvest prediction'
    ],
    tags: ['hydroponic', 'ai', 'gardening', 'sustainable'],
    rating: 4.6,
    inStock: true,
    relatedProducts: ['7', '10']
  },
  {
    id: '9',
    name: 'WeatherShield Dome',
    category: 'outdoor-living',
    price: 3299,
    description: 'Transparent weather protection dome for outdoor spaces',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    guidelines: 'UV protection included. Wind resistance up to 80mph.',
    features: [
      'Weather protection',
      'UV filtering',
      'Temperature regulation',
      'Retractable design'
    ],
    tags: ['weather', 'protection', 'outdoor', 'premium'],
    rating: 4.4,
    inStock: true,
    relatedProducts: ['7', '8']
  },

  // Smart Furniture
  {
    id: '10',
    name: 'AdaptTable Surface',
    category: 'smart-furniture',
    price: 1799,
    description: 'Morphing table surface that adapts to any activity',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    guidelines: 'Shape-memory material. Requires initial setup calibration.',
    features: [
      'Morphing surface',
      'Activity detection',
      'Wireless charging',
      'Touch interface'
    ],
    tags: ['adaptive', 'surface', 'smart', 'premium'],
    rating: 4.8,
    inStock: true,
    relatedProducts: ['11', '12']
  },
  {
    id: '11',
    name: 'LevitaBed Zero-G',
    category: 'smart-furniture',
    price: 5999,
    description: 'Magnetic levitation bed with zero-gravity sleep experience',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
    guidelines: 'Requires specialized installation. Sleep quality monitoring included.',
    features: [
      'Magnetic levitation',
      'Zero-gravity positioning',
      'Sleep optimization',
      'Health monitoring'
    ],
    tags: ['bed', 'levitation', 'sleep', 'premium'],
    rating: 4.9,
    inStock: false,
    relatedProducts: ['10', '13']
  },
  {
    id: '12',
    name: 'IntelliStorage Unit',
    category: 'smart-furniture',
    price: 999,
    description: 'AI-organized storage system with predictive item placement',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    guidelines: 'Item tagging system included. Learns usage patterns over time.',
    features: [
      'AI organization',
      'Predictive placement',
      'Inventory tracking',
      'Access optimization'
    ],
    tags: ['storage', 'ai', 'organization', 'smart'],
    rating: 4.5,
    inStock: true,
    relatedProducts: ['10', '11']
  }
];

export const categories = [
  { id: 'home-electronics', name: 'Home Electronics', count: 3 },
  { id: 'office-tech', name: 'Office Tech', count: 3 },
  { id: 'outdoor-living', name: 'Outdoor Living', count: 3 },
  { id: 'smart-furniture', name: 'Smart Furniture', count: 3 }
];

// Helper function to get products by category
export const getProductsByCategory = (categoryId: string) => {
  return products.filter(product => product.category === categoryId);
};