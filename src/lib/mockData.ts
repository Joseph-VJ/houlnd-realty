// Mock data for the application - works without a database

export const mockUsers = [
  {
    id: 'user-1',
    email: 'buyer@example.com',
    phone: '9876543210',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G4jw4K1VxqKJPa', // password123
    name: 'Rahul Sharma',
    role: 'BUYER',
    isEmailVerified: true,
    isPhoneVerified: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'user-2',
    email: 'seller@example.com',
    phone: '9876543211',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G4jw4K1VxqKJPa', // password123
    name: 'Priya Developers',
    role: 'PROMOTER',
    isEmailVerified: true,
    isPhoneVerified: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'user-3',
    email: 'admin@houlnd.com',
    phone: '9876543212',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G4jw4K1VxqKJPa', // password123
    name: 'Admin User',
    role: 'ADMIN',
    isEmailVerified: true,
    isPhoneVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

export const mockProperties = [
  {
    id: 'prop-1',
    title: '3 BHK Premium Apartment in Whitefield',
    description: 'Luxurious 3 BHK apartment with modern amenities, 24/7 security, covered parking, and stunning city views. Located in the heart of Whitefield IT hub. Premium flooring, modular kitchen, and spacious balconies.',
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    address: '123, Brigade Gateway, Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    totalPrice: 12500000,
    areaSqft: 1850,
    pricePerSqft: 6756.76,
    bedrooms: 3,
    bathrooms: 3,
    floorNumber: 12,
    totalFloors: 24,
    parkingSpaces: 2,
    yearBuilt: 2022,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    ]),
    amenities: JSON.stringify(['Parking', 'Security', 'Gym', 'Swimming Pool', 'Power Backup', 'Lift', 'Club House']),
    status: 'ACTIVE',
    isVerified: true,
    verificationStatus: 'APPROVED',
    promoterId: 'user-2',
    promoter: { id: 'user-2', name: 'Priya Developers' },
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-15'),
  },
  {
    id: 'prop-2',
    title: 'Premium Plot in Electronic City',
    description: 'BMRDA approved residential plot in a gated community. Clear title, ready for construction. Excellent connectivity to IT parks and metro station.',
    propertyType: 'PLOT',
    listingType: 'SALE',
    address: '45, Green Valley Layout, Electronic City Phase 2',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560100',
    totalPrice: 4500000,
    areaSqft: 2400,
    pricePerSqft: 1875,
    bedrooms: null,
    bathrooms: null,
    floorNumber: null,
    totalFloors: null,
    parkingSpaces: null,
    yearBuilt: null,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800&h=600&fit=crop',
    ]),
    amenities: JSON.stringify(['Gated Community', 'Water Supply 24x7', 'Underground Electricity', 'Park']),
    status: 'ACTIVE',
    isVerified: true,
    verificationStatus: 'APPROVED',
    promoterId: 'user-2',
    promoter: { id: 'user-2', name: 'Priya Developers' },
    createdAt: new Date('2024-07-20'),
    updatedAt: new Date('2024-07-20'),
  },
  {
    id: 'prop-3',
    title: 'Luxury 4 BHK Villa in Sarjapur',
    description: 'Stunning independent villa with private garden, modern interiors, home automation, and premium finishes. Perfect for families looking for space and privacy.',
    propertyType: 'VILLA',
    listingType: 'SALE',
    address: '78, Prestige Lakeside Habitat, Sarjapur Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '562125',
    totalPrice: 35000000,
    areaSqft: 4200,
    pricePerSqft: 8333.33,
    bedrooms: 4,
    bathrooms: 5,
    floorNumber: null,
    totalFloors: 3,
    parkingSpaces: 3,
    yearBuilt: 2023,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    ]),
    amenities: JSON.stringify(['Private Garden', 'Home Automation', 'Security', 'Gym', 'Swimming Pool', 'Solar Panels']),
    status: 'ACTIVE',
    isVerified: true,
    verificationStatus: 'APPROVED',
    promoterId: 'user-2',
    promoter: { id: 'user-2', name: 'Priya Developers' },
    createdAt: new Date('2024-08-10'),
    updatedAt: new Date('2024-08-10'),
  },
  {
    id: 'prop-4',
    title: '2 BHK Affordable Apartment in HSR Layout',
    description: 'Well-maintained 2 BHK apartment in prime HSR Layout location. Close to restaurants, shopping malls, and IT companies. Ideal for young professionals.',
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    address: '234, Sector 2, HSR Layout',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560102',
    totalPrice: 7500000,
    areaSqft: 1100,
    pricePerSqft: 6818.18,
    bedrooms: 2,
    bathrooms: 2,
    floorNumber: 5,
    totalFloors: 12,
    parkingSpaces: 1,
    yearBuilt: 2019,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&h=600&fit=crop',
    ]),
    amenities: JSON.stringify(['Parking', 'Security', 'Gym', 'Power Backup', 'Lift']),
    status: 'ACTIVE',
    isVerified: true,
    verificationStatus: 'APPROVED',
    promoterId: 'user-2',
    promoter: { id: 'user-2', name: 'Priya Developers' },
    createdAt: new Date('2024-05-25'),
    updatedAt: new Date('2024-05-25'),
  },
  {
    id: 'prop-5',
    title: 'Commercial Office Space in MG Road',
    description: 'Prime commercial office space in the heart of Bangalore. High footfall area, suitable for retail, office, or showroom. Excellent visibility and connectivity.',
    propertyType: 'COMMERCIAL',
    listingType: 'SALE',
    address: '56, MG Road, Near Trinity Circle',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    totalPrice: 45000000,
    areaSqft: 3500,
    pricePerSqft: 12857.14,
    bedrooms: null,
    bathrooms: 2,
    floorNumber: 2,
    totalFloors: 8,
    parkingSpaces: 5,
    yearBuilt: 2020,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    ]),
    amenities: JSON.stringify(['Lift', 'Power Backup', 'Security', 'Parking', 'Fire Safety']),
    status: 'ACTIVE',
    isVerified: true,
    verificationStatus: 'APPROVED',
    promoterId: 'user-2',
    promoter: { id: 'user-2', name: 'Priya Developers' },
    createdAt: new Date('2024-09-05'),
    updatedAt: new Date('2024-09-05'),
  },
  {
    id: 'prop-6',
    title: '1 BHK Compact Apartment in Koramangala',
    description: 'Perfect starter home in trendy Koramangala. Walking distance to cafes, pubs, and startups. Modern design with efficient space utilization.',
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    address: '89, 5th Block, Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560095',
    totalPrice: 5500000,
    areaSqft: 650,
    pricePerSqft: 8461.54,
    bedrooms: 1,
    bathrooms: 1,
    floorNumber: 3,
    totalFloors: 6,
    parkingSpaces: 1,
    yearBuilt: 2021,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop',
    ]),
    amenities: JSON.stringify(['Parking', 'Security', 'Power Backup', 'Lift']),
    status: 'ACTIVE',
    isVerified: true,
    verificationStatus: 'APPROVED',
    promoterId: 'user-2',
    promoter: { id: 'user-2', name: 'Priya Developers' },
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-04-12'),
  },
  {
    id: 'prop-7',
    title: 'Farm Land with Mango Orchard in Devanahalli',
    description: '5 acres of fertile agricultural land with existing mango orchard. Near upcoming airport city. Great investment opportunity.',
    propertyType: 'PLOT',
    listingType: 'SALE',
    address: 'Survey No. 45, Devanahalli Taluk',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '562110',
    totalPrice: 25000000,
    areaSqft: 217800,
    pricePerSqft: 114.78,
    bedrooms: null,
    bathrooms: null,
    floorNumber: null,
    totalFloors: null,
    parkingSpaces: null,
    yearBuilt: null,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
    ]),
    amenities: JSON.stringify(['Bore Well', 'Fencing', 'Road Access', 'Electricity']),
    status: 'ACTIVE',
    isVerified: true,
    verificationStatus: 'APPROVED',
    promoterId: 'user-2',
    promoter: { id: 'user-2', name: 'Priya Developers' },
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-18'),
  },
  {
    id: 'prop-8',
    title: '3 BHK Apartment for Rent in Indiranagar',
    description: 'Fully furnished 3 BHK apartment available for rent in upscale Indiranagar. Premium location with easy access to 100 Feet Road and metro.',
    propertyType: 'APARTMENT',
    listingType: 'RENT',
    address: '12th Main, Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    totalPrice: 75000,
    areaSqft: 1600,
    pricePerSqft: 46.88,
    bedrooms: 3,
    bathrooms: 2,
    floorNumber: 4,
    totalFloors: 8,
    parkingSpaces: 1,
    yearBuilt: 2018,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    ]),
    amenities: JSON.stringify(['Furnished', 'Parking', 'Security', 'Gym', 'Power Backup']),
    status: 'ACTIVE',
    isVerified: true,
    verificationStatus: 'APPROVED',
    promoterId: 'user-2',
    promoter: { id: 'user-2', name: 'Priya Developers' },
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-10-01'),
  },
  {
    id: 'prop-9',
    title: 'Independent House in JP Nagar',
    description: 'Spacious 4 BHK independent house with terrace and garden. Quiet neighborhood, ideal for families. Well-maintained with modern interiors.',
    propertyType: 'VILLA',
    listingType: 'SALE',
    address: '34, 6th Phase, JP Nagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560078',
    totalPrice: 28000000,
    areaSqft: 3200,
    pricePerSqft: 8750,
    bedrooms: 4,
    bathrooms: 4,
    floorNumber: null,
    totalFloors: 2,
    parkingSpaces: 2,
    yearBuilt: 2015,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    ]),
    amenities: JSON.stringify(['Garden', 'Terrace', 'Parking', 'Power Backup', 'Bore Well']),
    status: 'ACTIVE',
    isVerified: true,
    verificationStatus: 'APPROVED',
    promoterId: 'user-2',
    promoter: { id: 'user-2', name: 'Priya Developers' },
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-02-28'),
  },
  {
    id: 'prop-10',
    title: 'Budget 2 BHK in Marathahalli',
    description: 'Affordable 2 BHK apartment near Marathahalli bridge. Good for investment or self-use. Close to ORR and IT corridor.',
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    address: '56, Marathahalli Colony',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560037',
    totalPrice: 4800000,
    areaSqft: 950,
    pricePerSqft: 5052.63,
    bedrooms: 2,
    bathrooms: 2,
    floorNumber: 2,
    totalFloors: 5,
    parkingSpaces: 1,
    yearBuilt: 2017,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    ]),
    amenities: JSON.stringify(['Parking', 'Security', 'Power Backup']),
    status: 'ACTIVE',
    isVerified: true,
    verificationStatus: 'APPROVED',
    promoterId: 'user-2',
    promoter: { id: 'user-2', name: 'Priya Developers' },
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2024-11-10'),
  },
  {
    id: 'prop-11',
    title: 'Sea View Apartment in Mumbai',
    description: 'Stunning sea-facing 3 BHK in Worli. Breathtaking views of Arabian Sea. Premium amenities and world-class infrastructure.',
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    address: 'Worli Sea Face, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400018',
    totalPrice: 85000000,
    areaSqft: 2200,
    pricePerSqft: 38636.36,
    bedrooms: 3,
    bathrooms: 3,
    floorNumber: 25,
    totalFloors: 40,
    parkingSpaces: 2,
    yearBuilt: 2023,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
    ]),
    amenities: JSON.stringify(['Sea View', 'Swimming Pool', 'Gym', 'Concierge', 'Valet Parking']),
    status: 'ACTIVE',
    isVerified: true,
    verificationStatus: 'APPROVED',
    promoterId: 'user-2',
    promoter: { id: 'user-2', name: 'Priya Developers' },
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-10-20'),
  },
  {
    id: 'prop-12',
    title: 'Affordable Plot in Hyderabad',
    description: 'HMDA approved plot in Shamshabad near airport. Growing area with excellent appreciation potential.',
    propertyType: 'PLOT',
    listingType: 'SALE',
    address: 'Shamshabad, Near Airport',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '501218',
    totalPrice: 3200000,
    areaSqft: 1800,
    pricePerSqft: 1777.78,
    bedrooms: null,
    bathrooms: null,
    floorNumber: null,
    totalFloors: null,
    parkingSpaces: null,
    yearBuilt: null,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
    ]),
    amenities: JSON.stringify(['Gated Community', 'Park', 'Road Access']),
    status: 'ACTIVE',
    isVerified: true,
    verificationStatus: 'APPROVED',
    promoterId: 'user-2',
    promoter: { id: 'user-2', name: 'Priya Developers' },
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-09-15'),
  },
]

export const mockShortlists: Array<{
  id: string
  userId: string
  propertyId: string
  createdAt: Date
}> = []

export const mockAppointments: Array<{
  id: string
  buyerId: string
  propertyId: string
  scheduledDate: Date
  scheduledTime: string
  status: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}> = []

// Helper functions
export function getPropertyById(id: string) {
  return mockProperties.find(p => p.id === id)
}

export function getUserByEmail(email: string) {
  return mockUsers.find(u => u.email === email)
}

export function getUserById(id: string) {
  return mockUsers.find(u => u.id === id)
}

export function filterProperties(filters: {
  minPricePerSqft?: number
  maxPricePerSqft?: number
  propertyType?: string
  city?: string
  bedrooms?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) {
  let filtered = [...mockProperties]

  if (filters.minPricePerSqft) {
    filtered = filtered.filter(p => p.pricePerSqft >= filters.minPricePerSqft!)
  }
  if (filters.maxPricePerSqft) {
    filtered = filtered.filter(p => p.pricePerSqft <= filters.maxPricePerSqft!)
  }
  if (filters.propertyType) {
    filtered = filtered.filter(p => p.propertyType === filters.propertyType)
  }
  if (filters.city) {
    filtered = filtered.filter(p => p.city.toLowerCase().includes(filters.city!.toLowerCase()))
  }
  if (filters.bedrooms) {
    filtered = filtered.filter(p => p.bedrooms === filters.bedrooms)
  }

  // Sort
  const sortBy = filters.sortBy || 'createdAt'
  const sortOrder = filters.sortOrder || 'desc'
  
  filtered.sort((a, b) => {
    const aVal = a[sortBy as keyof typeof a]
    const bVal = b[sortBy as keyof typeof b]
    
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1
    }
    return aVal < bVal ? 1 : -1
  })

  return filtered
}
