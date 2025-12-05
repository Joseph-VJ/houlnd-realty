import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Demo Buyer
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: {
      email: 'buyer@example.com',
      phone: '9876543210',
      password: hashedPassword,
      name: 'Demo Buyer',
      role: 'BUYER',
      isEmailVerified: true,
    },
  })
  console.log('✅ Created demo buyer:', buyer.email)

  // Demo Promoter/Seller
  const promoter = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: {
      email: 'seller@example.com',
      phone: '9876543211',
      password: hashedPassword,
      name: 'Demo Seller',
      role: 'PROMOTER',
      isEmailVerified: true,
    },
  })
  console.log('✅ Created demo seller:', promoter.email)

  // Demo Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@houlnd.com' },
    update: {},
    create: {
      email: 'admin@houlnd.com',
      phone: '9876543212',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isEmailVerified: true,
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create sample properties
  const properties = [
    {
      title: '3 BHK Premium Apartment in Whitefield',
      description: 'Luxurious 3 BHK apartment with modern amenities, 24/7 security, covered parking, and stunning city views. Located in the heart of Whitefield IT hub.',
      propertyType: 'APARTMENT',
      listingType: 'SALE',
      address: '123, Brigade Gateway, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      totalPrice: 12500000, // 1.25 Cr
      areaSqft: 1850,
      pricePerSqft: 6756.76,
      bedrooms: 3,
      bathrooms: 3,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      ]),
      amenities: JSON.stringify(['Parking', 'Security', 'Gym', 'Swimming Pool', 'Power Backup']),
      status: 'ACTIVE',
      isVerified: true,
      verificationStatus: 'APPROVED',
      promoterId: promoter.id,
    },
    {
      title: 'Premium Plot in Electronic City',
      description: 'BMRDA approved residential plot in a gated community. Clear title, ready for construction. Excellent connectivity to IT parks.',
      propertyType: 'PLOT',
      listingType: 'SALE',
      address: '45, Green Valley Layout, Electronic City Phase 2',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560100',
      totalPrice: 4500000, // 45 Lakhs
      areaSqft: 2400,
      pricePerSqft: 1875,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      ]),
      amenities: JSON.stringify(['Gated Community', 'Water Supply 24x7']),
      status: 'ACTIVE',
      isVerified: true,
      verificationStatus: 'APPROVED',
      promoterId: promoter.id,
    },
    {
      title: 'Luxury Villa in HSR Layout',
      description: 'Beautifully designed 4 BHK independent villa with private garden, modular kitchen, and premium interiors. Perfect for families.',
      propertyType: 'VILLA',
      listingType: 'SALE',
      address: '78, Sector 3, HSR Layout',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560102',
      totalPrice: 25000000, // 2.5 Cr
      areaSqft: 3200,
      pricePerSqft: 7812.5,
      bedrooms: 4,
      bathrooms: 5,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      ]),
      amenities: JSON.stringify(['Garden', 'Parking', 'Security', 'Power Backup', 'Intercom']),
      status: 'ACTIVE',
      isVerified: true,
      verificationStatus: 'APPROVED',
      promoterId: promoter.id,
    },
    {
      title: 'Commercial Space in MG Road',
      description: 'Prime commercial space suitable for office, retail, or showroom. High footfall area with excellent visibility.',
      propertyType: 'COMMERCIAL',
      listingType: 'SALE',
      address: '12, MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      totalPrice: 35000000, // 3.5 Cr
      areaSqft: 2000,
      pricePerSqft: 17500,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      ]),
      amenities: JSON.stringify(['Lift', 'Parking', 'Security', 'Power Backup']),
      status: 'ACTIVE',
      isVerified: true,
      verificationStatus: 'APPROVED',
      promoterId: promoter.id,
    },
    {
      title: '2 BHK Affordable Apartment in Marathahalli',
      description: 'Well-maintained 2 BHK apartment in a prime location. Close to tech parks, schools, and hospitals.',
      propertyType: 'APARTMENT',
      listingType: 'SALE',
      address: '56, Rainbow Colony, Marathahalli',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560037',
      totalPrice: 6500000, // 65 Lakhs
      areaSqft: 1100,
      pricePerSqft: 5909.09,
      bedrooms: 2,
      bathrooms: 2,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      ]),
      amenities: JSON.stringify(['Parking', 'Security', 'Power Backup', 'Children Play Area']),
      status: 'ACTIVE',
      isVerified: true,
      verificationStatus: 'APPROVED',
      promoterId: promoter.id,
    },
    {
      title: '4 BHK Penthouse in Koramangala',
      description: 'Stunning duplex penthouse with terrace, panoramic views, and premium finishes. The epitome of luxury living.',
      propertyType: 'APARTMENT',
      listingType: 'SALE',
      address: '34, 5th Block, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560095',
      totalPrice: 45000000, // 4.5 Cr
      areaSqft: 4500,
      pricePerSqft: 10000,
      bedrooms: 4,
      bathrooms: 5,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      ]),
      amenities: JSON.stringify(['Terrace', 'Parking', 'Security', 'Gym', 'Swimming Pool', 'Club House']),
      status: 'ACTIVE',
      isVerified: true,
      verificationStatus: 'APPROVED',
      promoterId: promoter.id,
    },
  ]

  for (const property of properties) {
    await prisma.property.create({
      data: property,
    })
  }
  console.log(`✅ Created ${properties.length} sample properties`)

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
