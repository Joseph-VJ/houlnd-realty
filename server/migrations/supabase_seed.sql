-- Supabase Seed Data: Real Chennai Properties
-- Run this in Supabase SQL Editor AFTER running supabase_init.sql

-- =========================================
-- SAMPLE USERS (Buyers, Sellers, Admin)
-- =========================================
-- Password for all users: "Password123!" (bcrypt hash below)
-- $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4AQJXQJQJQJQJQJQ

INSERT INTO users (id, email, phone, password_hash, full_name, role, email_verified, company_name, rera_number) VALUES
-- Admin
('a0000000-0000-0000-0000-000000000001', 'admin@houlndrealty.com', '+919876543210', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Houlnd Admin', 'ADMIN', true, 'Houlnd Realty', NULL),

-- Promoters/Sellers
('a0000000-0000-0000-0000-000000000002', 'kumar.builders@gmail.com', '+919876543211', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Rajesh Kumar', 'PROMOTER', true, 'Kumar Builders', 'TN/REA/2023/001234'),
('a0000000-0000-0000-0000-000000000003', 'prestige.homes@gmail.com', '+919876543212', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Anand Sharma', 'PROMOTER', true, 'Prestige Homes Chennai', 'TN/REA/2022/005678'),
('a0000000-0000-0000-0000-000000000004', 'chennai.properties@gmail.com', '+919876543213', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Priya Venkatesh', 'PROMOTER', true, 'Chennai Prime Properties', 'TN/REA/2024/002345'),
('a0000000-0000-0000-0000-000000000005', 'omr.developers@gmail.com', '+919876543214', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Suresh Rajan', 'PROMOTER', true, 'OMR Developers', 'TN/REA/2023/003456'),

-- Buyers/Customers
('a0000000-0000-0000-0000-000000000006', 'buyer1@gmail.com', '+919876543215', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Arun Krishnan', 'CUSTOMER', true, NULL, NULL),
('a0000000-0000-0000-0000-000000000007', 'buyer2@gmail.com', '+919876543216', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Lakshmi Narayanan', 'CUSTOMER', true, NULL, NULL),
('a0000000-0000-0000-0000-000000000008', 'buyer3@gmail.com', '+919876543217', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Deepak Sundaram', 'CUSTOMER', true, NULL, NULL);

-- =========================================
-- CHENNAI PROPERTIES - FOR SALE (Real Market Data 2024-2025)
-- =========================================

INSERT INTO properties (
  id, owner_id, title, description, property_type, listing_type, 
  price, area_sqft, bedrooms, bathrooms, parking_spots, 
  floor_number, total_floors, facing, furnishing, possession_status,
  address_line1, address_line2, city, state, pincode, 
  latitude, longitude, amenities, is_featured, is_verified, status
) VALUES

-- OMR Properties (₹6,000-8,000/sqft)
('p0000000-0000-0000-0000-000000000001', 
 'a0000000-0000-0000-0000-000000000002',
 'Modern 2BHK Apartment in Sholinganallur',
 'Spacious 2BHK apartment in a gated community near IT parks. Walking distance to TCS and Infosys. Well-maintained complex with 24/7 security, power backup, and modern amenities.',
 'APARTMENT', 'SALE', 
 5600000, 950, 2, 2, 1,
 5, 12, 'East', 'SEMI_FURNISHED', 'READY_TO_MOVE',
 'Lakshmi Gardens, Sholinganallur', 'Near TCS Gate 2', 'Chennai', 'Tamil Nadu', '600119',
 12.9010, 80.2279,
 '["Gym", "Swimming Pool", "24/7 Security", "Power Backup", "Lift", "Children Play Area", "Clubhouse"]',
 true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000002',
 'a0000000-0000-0000-0000-000000000005',
 'Premium 3BHK with Sea Breeze View - OMR',
 'Luxurious 3BHK apartment with premium finishes. Large balconies with partial sea view. Located in the tech corridor with excellent connectivity.',
 'APARTMENT', 'SALE',
 11200000, 1400, 3, 3, 2,
 8, 15, 'North-East', 'FULLY_FURNISHED', 'READY_TO_MOVE',
 'Oceanic Heights, Thoraipakkam', 'OMR Main Road', 'Chennai', 'Tamil Nadu', '600097',
 12.9387, 80.2333,
 '["Gym", "Swimming Pool", "Tennis Court", "Jogging Track", "Clubhouse", "Party Hall", "24/7 Security", "EV Charging"]',
 true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000003',
 'a0000000-0000-0000-0000-000000000005',
 'Affordable 1BHK for IT Professionals - Siruseri',
 'Compact and well-designed 1BHK perfect for young professionals. Close to SIPCOT IT Park. Low maintenance charges.',
 'APARTMENT', 'SALE',
 3300000, 550, 1, 1, 1,
 3, 8, 'West', 'SEMI_FURNISHED', 'READY_TO_MOVE',
 'Tech Park Residency, Siruseri', 'Near SIPCOT Gate', 'Chennai', 'Tamil Nadu', '603103',
 12.8252, 80.2196,
 '["24/7 Security", "Power Backup", "Lift", "Covered Parking"]',
 false, true, 'ACTIVE'),

-- Velachery Properties (₹8,000-10,000/sqft)
('p0000000-0000-0000-0000-000000000004',
 'a0000000-0000-0000-0000-000000000002',
 'Spacious 3BHK Near Phoenix Mall - Velachery',
 'Well-maintained 3BHK in prime Velachery location. 5 mins walk to Metro station and Phoenix Mall. Excellent schools and hospitals nearby.',
 'APARTMENT', 'SALE',
 12500000, 1350, 3, 2, 2,
 6, 10, 'South', 'SEMI_FURNISHED', 'READY_TO_MOVE',
 'Grand Residency, Velachery Main Road', 'Opp Phoenix Mall', 'Chennai', 'Tamil Nadu', '600042',
 12.9815, 80.2180,
 '["Gym", "Swimming Pool", "Metro Connectivity", "24/7 Security", "Power Backup", "Children Play Area"]',
 true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000005',
 'a0000000-0000-0000-0000-000000000003',
 'Budget 2BHK with Metro Access - Velachery',
 'Value for money 2BHK apartment. Just 200m from Velachery Metro. Perfect for families looking for connectivity.',
 'APARTMENT', 'SALE',
 7200000, 850, 2, 2, 1,
 4, 7, 'East', 'UNFURNISHED', 'READY_TO_MOVE',
 'Metro View Apartments, Velachery', 'Near Metro Station', 'Chennai', 'Tamil Nadu', '600042',
 12.9785, 80.2210,
 '["Metro Connectivity", "24/7 Security", "Lift", "Power Backup"]',
 false, true, 'ACTIVE'),

-- Adyar Properties (₹12,000-18,000/sqft) - Premium
('p0000000-0000-0000-0000-000000000006',
 'a0000000-0000-0000-0000-000000000003',
 'Luxury 3BHK in Prime Adyar',
 'Premium 3BHK in one of Chennai most sought-after localities. Walking distance to Adyar Ananda Bhavan and IIT Madras. Quiet, tree-lined street.',
 'APARTMENT', 'SALE',
 24000000, 1600, 3, 3, 2,
 4, 6, 'East', 'FULLY_FURNISHED', 'READY_TO_MOVE',
 'Adyar Heritage Apartments, Gandhi Nagar', 'Near IIT Madras Back Gate', 'Chennai', 'Tamil Nadu', '600020',
 13.0067, 80.2354,
 '["Gym", "Terrace Garden", "24/7 Security", "Power Backup", "Premium Interiors", "Visitor Parking"]',
 true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000007',
 'a0000000-0000-0000-0000-000000000003',
 'Classic 2BHK Near Besant Nagar Beach',
 'Charming 2BHK in a quiet residential area. 10 mins walk to Besant Nagar Beach. Well-ventilated with cross breeze.',
 'APARTMENT', 'SALE',
 15600000, 1100, 2, 2, 1,
 2, 4, 'North', 'SEMI_FURNISHED', 'READY_TO_MOVE',
 'Beach View Residency, Besant Nagar', 'Near Theosophical Society', 'Chennai', 'Tamil Nadu', '600090',
 13.0005, 80.2665,
 '["Beach Proximity", "24/7 Security", "Power Backup", "Open Terrace"]',
 true, true, 'ACTIVE'),

-- Anna Nagar Properties (₹10,000-15,000/sqft)
('p0000000-0000-0000-0000-000000000008',
 'a0000000-0000-0000-0000-000000000004',
 'Premium 3BHK in Anna Nagar West',
 'Elegant 3BHK in the heart of Anna Nagar. Near Tower Park and Shanti Colony. Reputed schools and hospitals within 2km.',
 'APARTMENT', 'SALE',
 18000000, 1450, 3, 3, 2,
 7, 12, 'North-East', 'FULLY_FURNISHED', 'READY_TO_MOVE',
 'Tower View Apartments, Anna Nagar West', 'Near Tower Park', 'Chennai', 'Tamil Nadu', '600040',
 13.0878, 80.2089,
 '["Gym", "Swimming Pool", "Clubhouse", "24/7 Security", "Power Backup", "Indoor Games", "Party Hall"]',
 true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000009',
 'a0000000-0000-0000-0000-000000000004',
 'Cozy 2BHK in Anna Nagar East',
 'Well-designed 2BHK in a family-friendly complex. Walking distance to Chinthamani Market. Good public transport connectivity.',
 'APARTMENT', 'SALE',
 11000000, 1000, 2, 2, 1,
 3, 8, 'East', 'SEMI_FURNISHED', 'READY_TO_MOVE',
 'Family Heights, Anna Nagar East', 'Near Chinthamani Market', 'Chennai', 'Tamil Nadu', '600102',
 13.0912, 80.2235,
 '["24/7 Security", "Power Backup", "Lift", "Children Play Area", "Garden"]',
 false, true, 'ACTIVE'),

-- T Nagar Properties (₹12,000-18,000/sqft) - Premium Central
('p0000000-0000-0000-0000-000000000010',
 'a0000000-0000-0000-0000-000000000003',
 'Exclusive 3BHK Near Pondy Bazaar',
 'Rare find - Spacious 3BHK in the heart of T Nagar shopping district. Walking distance to Saravana Stores and Pondy Bazaar.',
 'APARTMENT', 'SALE',
 25200000, 1550, 3, 3, 2,
 5, 7, 'South', 'FULLY_FURNISHED', 'READY_TO_MOVE',
 'Heritage Plaza, T Nagar', 'Near Pondy Bazaar', 'Chennai', 'Tamil Nadu', '600017',
 13.0418, 80.2341,
 '["Shopping District", "24/7 Security", "Power Backup", "Premium Finishes", "Visitor Parking"]',
 true, true, 'ACTIVE'),

-- Porur Properties (₹6,000-8,500/sqft) - Affordable
('p0000000-0000-0000-0000-000000000011',
 'a0000000-0000-0000-0000-000000000002',
 'New 2BHK Near Porur Junction',
 'Brand new 2BHK in upcoming residential hub. Good connectivity to Mount-Poonamallee Road. Value for money investment.',
 'APARTMENT', 'SALE',
 5100000, 750, 2, 2, 1,
 4, 10, 'West', 'UNFURNISHED', 'READY_TO_MOVE',
 'Lake View Residency, Porur', 'Near Porur Lake', 'Chennai', 'Tamil Nadu', '600116',
 13.0356, 80.1567,
 '["Lake View", "24/7 Security", "Power Backup", "Lift", "Covered Parking"]',
 false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000012',
 'a0000000-0000-0000-0000-000000000005',
 'Spacious 3BHK for Growing Families - Porur',
 'Large 3BHK with ample storage. Gated community with excellent amenities. Schools and supermarkets within walking distance.',
 'APARTMENT', 'SALE',
 8925000, 1050, 3, 2, 1,
 2, 8, 'East', 'SEMI_FURNISHED', 'READY_TO_MOVE',
 'Green Valley Apartments, Porur', 'Near SBOA School', 'Chennai', 'Tamil Nadu', '600116',
 13.0312, 80.1623,
 '["Gym", "Swimming Pool", "Children Play Area", "24/7 Security", "Power Backup", "Garden"]',
 true, true, 'ACTIVE'),

-- Tambaram Properties (₹5,000-7,000/sqft) - Most Affordable
('p0000000-0000-0000-0000-000000000013',
 'a0000000-0000-0000-0000-000000000002',
 'Budget 1BHK Near Tambaram Station',
 'Affordable 1BHK perfect for first-time buyers. 5 mins walk to Tambaram Railway Station. Good rental potential.',
 'APARTMENT', 'SALE',
 2750000, 500, 1, 1, 0,
 2, 5, 'North', 'UNFURNISHED', 'READY_TO_MOVE',
 'Railway View Apartments, Tambaram', 'Near Railway Station', 'Chennai', 'Tamil Nadu', '600045',
 12.9249, 80.1278,
 '["Railway Connectivity", "24/7 Security", "Power Backup"]',
 false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000014',
 'a0000000-0000-0000-0000-000000000004',
 'Value 2BHK in Chromepet',
 'Well-priced 2BHK in established locality. Near MTC bus terminus. Schools, hospitals, and markets nearby.',
 'APARTMENT', 'SALE',
 4200000, 700, 2, 1, 1,
 3, 6, 'East', 'UNFURNISHED', 'READY_TO_MOVE',
 'Sunrise Apartments, Chromepet', 'Near Bus Terminus', 'Chennai', 'Tamil Nadu', '600044',
 12.9516, 80.1413,
 '["Bus Connectivity", "24/7 Security", "Power Backup", "Lift"]',
 false, true, 'ACTIVE'),

-- Guindy Properties (₹8,000-12,000/sqft)
('p0000000-0000-0000-0000-000000000015',
 'a0000000-0000-0000-0000-000000000003',
 'Corporate 2BHK Near Guindy Industrial Estate',
 'Modern 2BHK ideal for working professionals. Walking distance to Guindy Metro and MRTS. Close to IT companies.',
 'APARTMENT', 'SALE',
 8800000, 950, 2, 2, 1,
 6, 10, 'North-East', 'SEMI_FURNISHED', 'READY_TO_MOVE',
 'Metro Heights, Guindy', 'Near Guindy Metro', 'Chennai', 'Tamil Nadu', '600032',
 13.0067, 80.2121,
 '["Metro Connectivity", "Gym", "24/7 Security", "Power Backup", "Lift", "Cafeteria"]',
 true, true, 'ACTIVE'),

-- ECR Villas (₹7,500-10,000+/sqft)
('p0000000-0000-0000-0000-000000000016',
 'a0000000-0000-0000-0000-000000000004',
 'Beach-Side Villa in ECR',
 'Stunning 4BHK independent villa on ECR. Private garden, terrace with sea view. Perfect weekend home or permanent residence.',
 'VILLA', 'SALE',
 35000000, 3500, 4, 4, 3,
 NULL, 2, 'East', 'FULLY_FURNISHED', 'READY_TO_MOVE',
 'Serenity Villas, Injambakkam', 'ECR Main Road', 'Chennai', 'Tamil Nadu', '600041',
 12.9167, 80.2525,
 '["Private Garden", "Sea View", "Swimming Pool", "Home Theatre", "Modular Kitchen", "24/7 Security", "Power Backup"]',
 true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000017',
 'a0000000-0000-0000-0000-000000000005',
 'Gated Community Villa - Palavakkam',
 '3BHK villa in premium gated community. Landscaped gardens, clubhouse access, and beach proximity.',
 'VILLA', 'SALE',
 22000000, 2400, 3, 3, 2,
 NULL, 2, 'North-East', 'SEMI_FURNISHED', 'READY_TO_MOVE',
 'Palm Grove Villas, Palavakkam', 'Off ECR', 'Chennai', 'Tamil Nadu', '600041',
 12.9523, 80.2586,
 '["Gated Community", "Clubhouse", "Swimming Pool", "Gym", "Children Play Area", "24/7 Security", "Landscaped Gardens"]',
 true, true, 'ACTIVE'),

-- Plots for Sale
('p0000000-0000-0000-0000-000000000018',
 'a0000000-0000-0000-0000-000000000002',
 'DTCP Approved Plot - Tambaram',
 'Clear title DTCP approved residential plot. Ready for construction. All utilities available.',
 'PLOT', 'SALE',
 3600000, 1200, NULL, NULL, NULL,
 NULL, NULL, 'East', NULL, NULL,
 'Golden Gardens Layout, Tambaram West', 'Near GST Road', 'Chennai', 'Tamil Nadu', '600045',
 12.9178, 80.1189,
 '["DTCP Approved", "Clear Title", "Electricity Available", "Water Connection", "Tar Road"]',
 false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000019',
 'a0000000-0000-0000-0000-000000000004',
 'Premium Corner Plot - Medavakkam',
 'Prime corner plot in developing area. Good appreciation potential. Near OMR junction.',
 'PLOT', 'SALE',
 6500000, 1000, NULL, NULL, NULL,
 NULL, NULL, 'North-East', NULL, NULL,
 'Sunshine Layout, Medavakkam', 'Near OMR Junction', 'Chennai', 'Tamil Nadu', '600100',
 12.9187, 80.1923,
 '["Corner Plot", "CMDA Approved", "Near Main Road", "Electricity Available", "Street Lights"]',
 true, true, 'ACTIVE'),

-- Commercial Property
('p0000000-0000-0000-0000-000000000020',
 'a0000000-0000-0000-0000-000000000003',
 'Commercial Space in Nungambakkam',
 'Prime commercial space on ground floor. High footfall area. Ideal for showroom, restaurant, or office.',
 'COMMERCIAL', 'SALE',
 45000000, 2500, NULL, 2, 5,
 0, 4, 'South', 'UNFURNISHED', 'READY_TO_MOVE',
 'Business Hub, Nungambakkam High Road', 'Near Khader Nawaz Khan Road', 'Chennai', 'Tamil Nadu', '600034',
 13.0569, 80.2428,
 '["Prime Location", "High Footfall", "Power Backup", "Parking", "Street Facing"]',
 true, true, 'ACTIVE');

-- =========================================
-- CHENNAI PROPERTIES - FOR RENT (Real Market Data 2024-2025)
-- =========================================

INSERT INTO properties (
  id, owner_id, title, description, property_type, listing_type, 
  price, area_sqft, bedrooms, bathrooms, parking_spots, 
  floor_number, total_floors, facing, furnishing, possession_status,
  address_line1, address_line2, city, state, pincode, 
  latitude, longitude, amenities, is_featured, is_verified, status
) VALUES

-- OMR Rentals
('p0000000-0000-0000-0000-000000000021',
 'a0000000-0000-0000-0000-000000000002',
 '2BHK for Rent - Near Tech Parks OMR',
 'Fully furnished 2BHK ideal for IT professionals. Walking distance to major tech parks. High-speed internet ready.',
 'APARTMENT', 'RENT',
 25000, 950, 2, 2, 1,
 7, 12, 'East', 'FULLY_FURNISHED', 'READY_TO_MOVE',
 'Tech Towers, Sholinganallur', 'Near Cognizant Campus', 'Chennai', 'Tamil Nadu', '600119',
 12.9045, 80.2312,
 '["Gym", "Swimming Pool", "24/7 Security", "Power Backup", "High-Speed Internet", "Furnished"]',
 true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000022',
 'a0000000-0000-0000-0000-000000000005',
 'Bachelor Friendly 1BHK - Thoraipakkam',
 'Well-maintained 1BHK available for bachelors. Close to restaurants and shopping. No brokers.',
 'APARTMENT', 'RENT',
 14000, 550, 1, 1, 0,
 4, 8, 'West', 'SEMI_FURNISHED', 'READY_TO_MOVE',
 'Sunrise Apartments, Thoraipakkam', 'Near Signal', 'Chennai', 'Tamil Nadu', '600097',
 12.9423, 80.2287,
 '["Bachelor Friendly", "24/7 Security", "Power Backup", "Lift"]',
 false, true, 'ACTIVE'),

-- Velachery Rentals
('p0000000-0000-0000-0000-000000000023',
 'a0000000-0000-0000-0000-000000000003',
 'Family 3BHK Near Metro - Velachery',
 'Spacious 3BHK for families. Metro station at doorstep. Good school zone. Vegetarian preferred.',
 'APARTMENT', 'RENT',
 38000, 1250, 3, 2, 1,
 5, 8, 'North', 'SEMI_FURNISHED', 'READY_TO_MOVE',
 'Metro View Residency, Velachery', '100m from Metro Station', 'Chennai', 'Tamil Nadu', '600042',
 12.9798, 80.2187,
 '["Metro Connectivity", "24/7 Security", "Power Backup", "Children Play Area", "Vegetarian Preferred"]',
 true, true, 'ACTIVE'),

-- Adyar Rentals (Premium)
('p0000000-0000-0000-0000-000000000024',
 'a0000000-0000-0000-0000-000000000003',
 'Luxury 2BHK in Heart of Adyar',
 'Premium 2BHK with modern amenities. Walking distance to Adyar Cancer Institute. Family only.',
 'APARTMENT', 'RENT',
 45000, 1100, 2, 2, 1,
 3, 5, 'East', 'FULLY_FURNISHED', 'READY_TO_MOVE',
 'Adyar Grand, Kasturba Nagar', 'Near Cancer Institute', 'Chennai', 'Tamil Nadu', '600020',
 13.0045, 80.2398,
 '["Premium Location", "24/7 Security", "Power Backup", "Fully Furnished", "Family Only"]',
 true, true, 'ACTIVE'),

-- Anna Nagar Rentals
('p0000000-0000-0000-0000-000000000025',
 'a0000000-0000-0000-0000-000000000004',
 'Executive 3BHK Near Tower Park',
 'High-end 3BHK for working professionals. All amenities. 6 months advance required.',
 'APARTMENT', 'RENT',
 55000, 1400, 3, 3, 2,
 8, 12, 'North-East', 'FULLY_FURNISHED', 'READY_TO_MOVE',
 'Tower View Apartments, Anna Nagar', 'Near 2nd Avenue', 'Chennai', 'Tamil Nadu', '600040',
 13.0889, 80.2112,
 '["Gym", "Swimming Pool", "Clubhouse", "24/7 Security", "Power Backup", "Premium Furnished"]',
 true, true, 'ACTIVE'),

-- T Nagar Rentals
('p0000000-0000-0000-0000-000000000026',
 'a0000000-0000-0000-0000-000000000003',
 '2BHK Near Mambalam Station',
 'Convenient 2BHK near train station. Shopping hub nearby. Ideal for small families.',
 'APARTMENT', 'RENT',
 32000, 900, 2, 2, 1,
 2, 5, 'South', 'SEMI_FURNISHED', 'READY_TO_MOVE',
 'Railway Residency, West Mambalam', 'Near MRTS Station', 'Chennai', 'Tamil Nadu', '600033',
 13.0378, 80.2287,
 '["Railway Connectivity", "24/7 Security", "Power Backup", "Shopping Nearby"]',
 false, true, 'ACTIVE'),

-- Porur Rentals (Affordable)
('p0000000-0000-0000-0000-000000000027',
 'a0000000-0000-0000-0000-000000000002',
 'Budget 2BHK for Small Families - Porur',
 'Affordable 2BHK in quiet locality. Near good schools. Low deposit accepted.',
 'APARTMENT', 'RENT',
 18000, 800, 2, 1, 1,
 3, 6, 'West', 'UNFURNISHED', 'READY_TO_MOVE',
 'Family Nest Apartments, Porur', 'Near Porur Signal', 'Chennai', 'Tamil Nadu', '600116',
 13.0378, 80.1589,
 '["Affordable", "24/7 Security", "Power Backup", "School Nearby"]',
 false, true, 'ACTIVE'),

-- Tambaram Rentals (Budget)
('p0000000-0000-0000-0000-000000000028',
 'a0000000-0000-0000-0000-000000000004',
 'Value 1BHK Near GST Road',
 'Simple 1BHK for working singles or couples. Good transport connectivity. All bills excluded.',
 'APARTMENT', 'RENT',
 10000, 450, 1, 1, 0,
 1, 4, 'East', 'UNFURNISHED', 'READY_TO_MOVE',
 'Budget Homes, Tambaram East', 'Near GST Road', 'Chennai', 'Tamil Nadu', '600059',
 12.9267, 80.1334,
 '["Budget Friendly", "24/7 Security", "Transport Nearby"]',
 false, true, 'ACTIVE'),

-- Guindy Rentals
('p0000000-0000-0000-0000-000000000029',
 'a0000000-0000-0000-0000-000000000003',
 'Corporate Housing 2BHK - Guindy',
 'Perfect for corporate employees. Near Kathipara Junction. Metro and MRTS accessible.',
 'APARTMENT', 'RENT',
 28000, 900, 2, 2, 1,
 5, 8, 'North', 'FULLY_FURNISHED', 'READY_TO_MOVE',
 'Corporate Suites, Guindy', 'Near Kathipara', 'Chennai', 'Tamil Nadu', '600032',
 13.0089, 80.2098,
 '["Corporate Housing", "Gym", "24/7 Security", "Metro Nearby", "Fully Furnished"]',
 true, true, 'ACTIVE'),

-- ECR Villa Rental
('p0000000-0000-0000-0000-000000000030',
 'a0000000-0000-0000-0000-000000000004',
 'Weekend Villa with Pool - ECR',
 'Beautiful villa available for long-term rent. Private pool, garden, and sea breeze. Perfect for expats.',
 'VILLA', 'RENT',
 125000, 3000, 4, 4, 2,
 NULL, 2, 'East', 'FULLY_FURNISHED', 'READY_TO_MOVE',
 'Beach Haven Villas, Akkarai', 'ECR Road', 'Chennai', 'Tamil Nadu', '600115',
 12.8978, 80.2534,
 '["Private Pool", "Garden", "Sea View", "Fully Furnished", "24/7 Security", "Expat Friendly"]',
 true, true, 'ACTIVE');

-- =========================================
-- PROPERTY IMAGES (Sample Images)
-- =========================================

INSERT INTO property_images (property_id, url, caption, is_primary, sort_order) VALUES
-- Property 1 Images (OMR 2BHK)
('p0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'Living Room', true, 1),
('p0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'Bedroom', false, 2),
('p0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', 'Kitchen', false, 3),

-- Property 2 Images (OMR 3BHK Premium)
('p0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'Exterior View', true, 1),
('p0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'Living Area', false, 2),

-- Property 4 Images (Velachery 3BHK)
('p0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'Building Exterior', true, 1),
('p0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800', 'Master Bedroom', false, 2),

-- Property 6 Images (Adyar Luxury)
('p0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'Premium Interior', true, 1),
('p0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', 'Dining Area', false, 2),

-- Property 16 Images (ECR Villa)
('p0000000-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'Villa Front View', true, 1),
('p0000000-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', 'Swimming Pool', false, 2),
('p0000000-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800', 'Garden', false, 3),

-- Property 30 Images (ECR Rental Villa)
('p0000000-0000-0000-0000-000000000030', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', 'Beach Villa', true, 1),
('p0000000-0000-0000-0000-000000000030', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', 'Pool Area', false, 2);

-- =========================================
-- SAMPLE SHORTLISTS
-- =========================================

INSERT INTO shortlist (user_id, property_id, notes) VALUES
('a0000000-0000-0000-0000-000000000006', 'p0000000-0000-0000-0000-000000000001', 'Good location, need to visit'),
('a0000000-0000-0000-0000-000000000006', 'p0000000-0000-0000-0000-000000000004', 'Wife liked this one'),
('a0000000-0000-0000-0000-000000000007', 'p0000000-0000-0000-0000-000000000002', 'Within budget, check financing'),
('a0000000-0000-0000-0000-000000000008', 'p0000000-0000-0000-0000-000000000021', 'Perfect for my office commute');

-- =========================================
-- SAMPLE INQUIRIES
-- =========================================

INSERT INTO inquiries (property_id, buyer_id, seller_id, message, status) VALUES
('p0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'Hi, I am interested in this property. Is the price negotiable?', 'PENDING'),
('p0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'Can we schedule a site visit this weekend?', 'RESPONDED'),
('p0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000005', 'Looking for home loan assistance. Do you have any tie-ups with banks?', 'PENDING'),
('p0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000002', 'Is this available from next month? I work at TCS nearby.', 'PENDING');

-- =========================================
-- VERIFY DATA
-- =========================================
-- SELECT COUNT(*) as users FROM users;
-- SELECT COUNT(*) as properties FROM properties;
-- SELECT COUNT(*) as images FROM property_images;
-- SELECT COUNT(*) as shortlists FROM shortlist;
-- SELECT COUNT(*) as inquiries FROM inquiries;
