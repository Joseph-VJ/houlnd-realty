-- Supabase Complete Seed Data: 80+ Chennai Properties
-- Run this in Supabase SQL Editor AFTER running supabase_init.sql
-- Part 1: Users

-- =========================================
-- USERS (15 Users: 1 Admin, 8 Promoters, 6 Buyers)
-- =========================================
-- Password for all: "Password123!" 

INSERT INTO users (id, email, phone, password_hash, full_name, role, email_verified, company_name, rera_number) VALUES

-- Admin
('a0000000-0000-0000-0000-000000000001', 'admin@houlndrealty.com', '+919876543210', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Houlnd Admin', 'ADMIN', true, 'Houlnd Realty Pvt Ltd', NULL),

-- Promoters/Builders (8)
('a0000000-0000-0000-0000-000000000002', 'kumar.builders@gmail.com', '+919876543211', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Rajesh Kumar', 'PROMOTER', true, 'Kumar Builders', 'TN/REA/2023/001234'),
('a0000000-0000-0000-0000-000000000003', 'prestige.homes@gmail.com', '+919876543212', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Anand Sharma', 'PROMOTER', true, 'Prestige Homes Chennai', 'TN/REA/2022/005678'),
('a0000000-0000-0000-0000-000000000004', 'chennai.prime@gmail.com', '+919876543213', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Priya Venkatesh', 'PROMOTER', true, 'Chennai Prime Properties', 'TN/REA/2024/002345'),
('a0000000-0000-0000-0000-000000000005', 'omr.developers@gmail.com', '+919876543214', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Suresh Rajan', 'PROMOTER', true, 'OMR Developers', 'TN/REA/2023/003456'),
('a0000000-0000-0000-0000-000000000006', 'coastal.builders@gmail.com', '+919876543215', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Karthik Subramanian', 'PROMOTER', true, 'Coastal Builders', 'TN/REA/2023/004567'),
('a0000000-0000-0000-0000-000000000007', 'sri.constructions@gmail.com', '+919876543216', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Lakshmi Naidu', 'PROMOTER', true, 'Sri Lakshmi Constructions', 'TN/REA/2022/006789'),
('a0000000-0000-0000-0000-000000000008', 'elite.homes@gmail.com', '+919876543217', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Vijay Krishnamurthy', 'PROMOTER', true, 'Elite Homes India', 'TN/REA/2024/007890'),
('a0000000-0000-0000-0000-000000000009', 'green.valley@gmail.com', '+919876543218', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Meena Raghavan', 'PROMOTER', true, 'Green Valley Developers', 'TN/REA/2023/008901'),

-- Buyers/Customers (6)
('a0000000-0000-0000-0000-000000000010', 'arun.buyer@gmail.com', '+919876543219', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Arun Krishnan', 'CUSTOMER', true, NULL, NULL),
('a0000000-0000-0000-0000-000000000011', 'lakshmi.buyer@gmail.com', '+919876543220', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Lakshmi Narayanan', 'CUSTOMER', true, NULL, NULL),
('a0000000-0000-0000-0000-000000000012', 'deepak.buyer@gmail.com', '+919876543221', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Deepak Sundaram', 'CUSTOMER', true, NULL, NULL),
('a0000000-0000-0000-0000-000000000013', 'ramya.buyer@gmail.com', '+919876543222', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Ramya Srinivasan', 'CUSTOMER', true, NULL, NULL),
('a0000000-0000-0000-0000-000000000014', 'ganesh.buyer@gmail.com', '+919876543223', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Ganesh Iyer', 'CUSTOMER', true, NULL, NULL),
('a0000000-0000-0000-0000-000000000015', 'divya.buyer@gmail.com', '+919876543224', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.AOEZwE/4KPK5Xm.', 'Divya Menon', 'CUSTOMER', true, NULL, NULL);

-- =========================================
-- PART 2: OMR PROPERTIES (1-15) - ₹6,000-8,000/sqft
-- =========================================

INSERT INTO properties (id, owner_id, title, description, property_type, listing_type, price, area_sqft, bedrooms, bathrooms, parking_spots, floor_number, total_floors, facing, furnishing, possession_status, address_line1, address_line2, city, state, pincode, latitude, longitude, amenities, is_featured, is_verified, status) VALUES

-- OMR Sale Properties
('p0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'Modern 2BHK in Sholinganallur IT Hub', 'Spacious 2BHK apartment near TCS and Infosys. Gated community with 24/7 security. Walking distance to tech parks.', 'APARTMENT', 'SALE', 5700000, 950, 2, 2, 1, 5, 12, 'East', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Lakshmi Gardens, Sholinganallur', 'Near TCS Gate 2', 'Chennai', 'Tamil Nadu', '600119', 12.9010, 80.2279, '["Gym", "Swimming Pool", "24/7 Security", "Power Backup", "Lift", "Children Play Area"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', 'Premium 3BHK with Sea Breeze - Thoraipakkam', 'Luxurious 3BHK with premium finishes. Large balconies with partial sea view. Prime IT corridor location.', 'APARTMENT', 'SALE', 11200000, 1400, 3, 3, 2, 8, 15, 'North-East', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Oceanic Heights, Thoraipakkam', 'OMR Main Road', 'Chennai', 'Tamil Nadu', '600097', 12.9387, 80.2333, '["Gym", "Swimming Pool", "Tennis Court", "Jogging Track", "Clubhouse", "Party Hall", "EV Charging"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000005', 'Affordable 1BHK Near SIPCOT', 'Compact 1BHK perfect for IT professionals. Close to SIPCOT IT Park. Low maintenance.', 'APARTMENT', 'SALE', 3300000, 550, 1, 1, 1, 3, 8, 'West', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Tech Park Residency, Siruseri', 'Near SIPCOT Gate', 'Chennai', 'Tamil Nadu', '603103', 12.8252, 80.2196, '["24/7 Security", "Power Backup", "Lift", "Covered Parking"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'Brand New 2BHK - Navalur', 'Newly constructed 2BHK in rapidly developing Navalur. Near upcoming metro. Great investment.', 'APARTMENT', 'SALE', 4800000, 800, 2, 2, 1, 4, 10, 'South', 'UNFURNISHED', 'READY_TO_MOVE', 'Metro View Apartments, Navalur', 'Near Navalur Junction', 'Chennai', 'Tamil Nadu', '600130', 12.8456, 80.2267, '["24/7 Security", "Power Backup", "Lift", "Garden"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006', 'Executive 3BHK - Perungudi', 'Elegant 3BHK in prime Perungudi. Walking distance to Accenture and Cognizant campuses.', 'APARTMENT', 'SALE', 9600000, 1200, 3, 2, 2, 6, 14, 'East', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Corporate Towers, Perungudi', 'Near Perungudi Signal', 'Chennai', 'Tamil Nadu', '600096', 12.9623, 80.2398, '["Gym", "Swimming Pool", "Clubhouse", "24/7 Security", "Power Backup"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000005', 'Compact 1BHK Investment - Karapakkam', 'Ideal 1BHK for investment or bachelors. High rental demand area near tech parks.', 'APARTMENT', 'SALE', 2900000, 480, 1, 1, 0, 2, 6, 'North', 'UNFURNISHED', 'READY_TO_MOVE', 'Sunrise Apartments, Karapakkam', 'Near Karapakkam Bridge', 'Chennai', 'Tamil Nadu', '600097', 12.9234, 80.2234, '["24/7 Security", "Power Backup", "Lift"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000002', 'Luxury 4BHK Penthouse - OMR', 'Stunning duplex penthouse with private terrace. 360-degree city views. Ultra-premium finishes.', 'APARTMENT', 'SALE', 28000000, 3500, 4, 4, 3, 14, 15, 'All Sides', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Sky Villas, Sholinganallur', 'OMR Junction', 'Chennai', 'Tamil Nadu', '600119', 12.9056, 80.2312, '["Private Terrace", "Home Theatre", "Modular Kitchen", "Smart Home", "Gym", "Swimming Pool"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000006', 'Under Construction 2BHK - Padur', 'New launch 2BHK at pre-launch prices. Delivery Dec 2025. RERA approved.', 'APARTMENT', 'SALE', 4200000, 750, 2, 2, 1, 7, 16, 'East', 'UNFURNISHED', 'UNDER_CONSTRUCTION', 'Sunrise Enclave, Padur', 'Near Padur Signal', 'Chennai', 'Tamil Nadu', '603103', 12.8123, 80.2156, '["Gym", "Swimming Pool", "24/7 Security", "Power Backup", "Clubhouse"]', false, true, 'ACTIVE'),

-- OMR Rental Properties
('p0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000002', '2BHK for Rent - Near TCS', 'Fully furnished 2BHK ideal for IT couples. Walking distance to TCS. High-speed internet.', 'APARTMENT', 'RENT', 25000, 950, 2, 2, 1, 7, 12, 'East', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Tech Towers, Sholinganallur', 'Near TCS Campus', 'Chennai', 'Tamil Nadu', '600119', 12.9045, 80.2312, '["Gym", "Swimming Pool", "24/7 Security", "High-Speed Internet", "Furnished"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000005', 'Bachelor Friendly 1BHK - Thoraipakkam', 'Well-maintained 1BHK for bachelors or couples. Near restaurants and shopping. No brokers.', 'APARTMENT', 'RENT', 14000, 550, 1, 1, 0, 4, 8, 'West', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Sunrise Apartments, Thoraipakkam', 'Near OMR Signal', 'Chennai', 'Tamil Nadu', '600097', 12.9423, 80.2287, '["Bachelor Friendly", "24/7 Security", "Power Backup"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000006', 'Premium 3BHK for Expats - Perungudi', 'High-end 3BHK with western toilets and modular kitchen. Ideal for expats and senior managers.', 'APARTMENT', 'RENT', 45000, 1400, 3, 3, 2, 9, 14, 'North-East', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Expat Towers, Perungudi', 'Near US Consulate Area', 'Chennai', 'Tamil Nadu', '600096', 12.9567, 80.2445, '["Expat Friendly", "Gym", "Swimming Pool", "Modular Kitchen", "24/7 Security"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000002', 'Budget 2BHK Near Cognizant - Siruseri', 'Affordable 2BHK for IT professionals. 5 mins to Cognizant. Bus connectivity.', 'APARTMENT', 'RENT', 18000, 800, 2, 2, 1, 3, 8, 'South', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'IT Park View, Siruseri', 'Near SIPCOT', 'Chennai', 'Tamil Nadu', '603103', 12.8278, 80.2212, '["24/7 Security", "Power Backup", "Bus Connectivity"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000005', 'Studio Apartment - Navalur', 'Cozy studio for singles. Fully equipped kitchen. Gym access included.', 'APARTMENT', 'RENT', 12000, 380, 1, 1, 0, 5, 10, 'East', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Single Living, Navalur', 'Near Navalur Bus Stop', 'Chennai', 'Tamil Nadu', '600130', 12.8489, 80.2256, '["Studio", "Gym Access", "24/7 Security", "Fully Furnished"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000006', 'Family 3BHK - Karapakkam', 'Spacious 3BHK for families. Near international schools. Quiet neighborhood.', 'APARTMENT', 'RENT', 35000, 1300, 3, 2, 1, 4, 8, 'West', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Family Homes, Karapakkam', 'Near Global School', 'Chennai', 'Tamil Nadu', '600097', 12.9256, 80.2278, '["Family Friendly", "School Nearby", "24/7 Security", "Children Play Area"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000002', 'Luxury 2BHK - Sholinganallur Main Road', 'Premium 2BHK on main road. Metro nearby. All amenities included.', 'APARTMENT', 'RENT', 32000, 1100, 2, 2, 1, 10, 16, 'North', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'OMR Heights, Sholinganallur', 'Main Road', 'Chennai', 'Tamil Nadu', '600119', 12.9034, 80.2298, '["Metro Nearby", "Gym", "Swimming Pool", "Clubhouse", "24/7 Security"]', true, true, 'ACTIVE');

-- =========================================
-- PART 3: VELACHERY PROPERTIES (16-22) - ₹8,000-10,000/sqft
-- =========================================

INSERT INTO properties (id, owner_id, title, description, property_type, listing_type, price, area_sqft, bedrooms, bathrooms, parking_spots, floor_number, total_floors, facing, furnishing, possession_status, address_line1, address_line2, city, state, pincode, latitude, longitude, amenities, is_featured, is_verified, status) VALUES

('p0000000-0000-0000-0000-000000000016', 'a0000000-0000-0000-0000-000000000003', 'Spacious 3BHK Near Phoenix Mall', 'Well-maintained 3BHK in prime location. 5 mins walk to Metro and Phoenix Mall. Excellent schools nearby.', 'APARTMENT', 'SALE', 12500000, 1350, 3, 2, 2, 6, 10, 'South', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Grand Residency, Velachery Main Road', 'Opp Phoenix Mall', 'Chennai', 'Tamil Nadu', '600042', 12.9815, 80.2180, '["Gym", "Swimming Pool", "Metro Connectivity", "24/7 Security", "Children Play Area"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000017', 'a0000000-0000-0000-0000-000000000003', 'Budget 2BHK with Metro Access', 'Value for money 2BHK. Just 200m from Velachery Metro. Perfect for connectivity.', 'APARTMENT', 'SALE', 7200000, 850, 2, 2, 1, 4, 7, 'East', 'UNFURNISHED', 'READY_TO_MOVE', 'Metro View Apartments, Velachery', 'Near Metro Station', 'Chennai', 'Tamil Nadu', '600042', 12.9785, 80.2210, '["Metro Connectivity", "24/7 Security", "Lift", "Power Backup"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000018', 'a0000000-0000-0000-0000-000000000007', 'Premium 2BHK - Taramani Link Road', 'Modern 2BHK with premium fittings. Near IIT Madras Research Park. Quiet locality.', 'APARTMENT', 'SALE', 8500000, 950, 2, 2, 1, 5, 9, 'North-East', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Research Park Residency, Taramani', 'Near IIT Research Park', 'Chennai', 'Tamil Nadu', '600113', 12.9867, 80.2345, '["Gym", "24/7 Security", "Power Backup", "Garden"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000019', 'a0000000-0000-0000-0000-000000000003', 'Compact 1BHK Near MRTS', 'Affordable 1BHK near Velachery MRTS. High rental potential. Good for investment.', 'APARTMENT', 'SALE', 4200000, 480, 1, 1, 1, 3, 6, 'West', 'UNFURNISHED', 'READY_TO_MOVE', 'MRTS View, Velachery', 'Near MRTS Station', 'Chennai', 'Tamil Nadu', '600042', 12.9756, 80.2156, '["MRTS Nearby", "24/7 Security", "Power Backup"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000007', 'Family 3BHK Near Velachery Bypass', 'Large 3BHK ideal for families. Near good schools. Peaceful environment.', 'APARTMENT', 'SALE', 11000000, 1250, 3, 3, 2, 7, 12, 'East', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Family Paradise, Velachery Bypass', 'Near DAV School', 'Chennai', 'Tamil Nadu', '600042', 12.9723, 80.2234, '["School Nearby", "Gym", "Swimming Pool", "24/7 Security", "Children Play Area"]', true, true, 'ACTIVE'),

-- Velachery Rentals
('p0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000003', 'Family 3BHK Near Metro - Velachery', 'Spacious 3BHK for families. Metro at doorstep. Good school zone. Vegetarian preferred.', 'APARTMENT', 'RENT', 38000, 1250, 3, 2, 1, 5, 8, 'North', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Metro View Residency, Velachery', '100m from Metro', 'Chennai', 'Tamil Nadu', '600042', 12.9798, 80.2187, '["Metro Connectivity", "24/7 Security", "Children Play Area", "Vegetarian Preferred"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000007', '2BHK Near Phoenix Mall - Rent', 'Modern 2BHK near shopping hub. Ideal for young couples. All amenities.', 'APARTMENT', 'RENT', 28000, 900, 2, 2, 1, 4, 10, 'South', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Mall View Apartments, Velachery', 'Near Phoenix Mall', 'Chennai', 'Tamil Nadu', '600042', 12.9823, 80.2198, '["Mall Nearby", "Gym", "24/7 Security", "Fully Furnished"]', false, true, 'ACTIVE');

-- =========================================
-- PART 3B: ADYAR PROPERTIES (23-30) - ₹12,000-18,000/sqft (Premium)
-- =========================================

INSERT INTO properties (id, owner_id, title, description, property_type, listing_type, price, area_sqft, bedrooms, bathrooms, parking_spots, floor_number, total_floors, facing, furnishing, possession_status, address_line1, address_line2, city, state, pincode, latitude, longitude, amenities, is_featured, is_verified, status) VALUES

('p0000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000003', 'Luxury 3BHK in Prime Adyar', 'Premium 3BHK in most sought-after locality. Near IIT Madras. Tree-lined street.', 'APARTMENT', 'SALE', 24000000, 1600, 3, 3, 2, 4, 6, 'East', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Adyar Heritage Apartments, Gandhi Nagar', 'Near IIT Back Gate', 'Chennai', 'Tamil Nadu', '600020', 13.0067, 80.2354, '["Gym", "Terrace Garden", "24/7 Security", "Power Backup", "Premium Interiors"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000008', 'Classic 2BHK Near Besant Nagar Beach', 'Charming 2BHK in quiet area. 10 mins walk to beach. Well-ventilated with cross breeze.', 'APARTMENT', 'SALE', 15600000, 1100, 2, 2, 1, 2, 4, 'North', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Beach View Residency, Besant Nagar', 'Near Theosophical Society', 'Chennai', 'Tamil Nadu', '600090', 13.0005, 80.2665, '["Beach Proximity", "24/7 Security", "Power Backup", "Open Terrace"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000025', 'a0000000-0000-0000-0000-000000000003', 'Exclusive 4BHK - Adyar Main Road', 'Rare find - Spacious 4BHK in the heart of Adyar. Excellent connectivity.', 'APARTMENT', 'SALE', 36000000, 2200, 4, 4, 2, 3, 5, 'South', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Adyar Grand, LB Road', 'Near Adyar Signal', 'Chennai', 'Tamil Nadu', '600020', 13.0045, 80.2398, '["Premium Location", "Gym", "24/7 Security", "Premium Finishes", "Visitor Parking"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000026', 'a0000000-0000-0000-0000-000000000008', 'Modern 2BHK - Kasturba Nagar', 'Contemporary 2BHK with modern amenities. Near Cancer Institute. Family locality.', 'APARTMENT', 'SALE', 16800000, 1150, 2, 2, 1, 5, 7, 'East', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Kasturba Residency, Adyar', 'Near Cancer Institute', 'Chennai', 'Tamil Nadu', '600020', 13.0078, 80.2412, '["Hospital Nearby", "24/7 Security", "Power Backup", "Garden"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000027', 'a0000000-0000-0000-0000-000000000003', 'Independent House - Adyar', 'Beautiful 3BHK independent house with garden. Private parking. Quiet street.', 'VILLA', 'SALE', 45000000, 2800, 3, 3, 2, NULL, 2, 'North-East', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'First Cross Street, Adyar', 'Near Adyar Club', 'Chennai', 'Tamil Nadu', '600020', 13.0034, 80.2389, '["Independent House", "Private Garden", "Parking", "Terrace"]', true, true, 'ACTIVE'),

-- Adyar Rentals
('p0000000-0000-0000-0000-000000000028', 'a0000000-0000-0000-0000-000000000003', 'Luxury 2BHK in Heart of Adyar', 'Premium 2BHK with modern amenities. Near Cancer Institute. Family only.', 'APARTMENT', 'RENT', 45000, 1100, 2, 2, 1, 3, 5, 'East', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Adyar Grand, Kasturba Nagar', 'Near Cancer Institute', 'Chennai', 'Tamil Nadu', '600020', 13.0045, 80.2398, '["Premium Location", "24/7 Security", "Fully Furnished", "Family Only"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000029', 'a0000000-0000-0000-0000-000000000008', '3BHK Near Besant Nagar - Rent', 'Spacious 3BHK near beach. Perfect for families. Long term preferred.', 'APARTMENT', 'RENT', 55000, 1400, 3, 2, 1, 2, 4, 'North', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Beach Side Residency, Besant Nagar', 'Near Elliot Beach', 'Chennai', 'Tamil Nadu', '600090', 13.0012, 80.2678, '["Beach Nearby", "24/7 Security", "Family Preferred"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000030', 'a0000000-0000-0000-0000-000000000003', 'Budget 1BHK - Shastri Nagar', 'Compact 1BHK in prime Adyar locality. Good for working professionals.', 'APARTMENT', 'RENT', 22000, 550, 1, 1, 0, 2, 4, 'West', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Shastri Nagar Apartments, Adyar', 'Near Adyar Bus Depot', 'Chennai', 'Tamil Nadu', '600020', 13.0023, 80.2367, '["Prime Location", "24/7 Security", "Power Backup"]', false, true, 'ACTIVE');

-- =========================================
-- PART 4: ANNA NAGAR PROPERTIES (31-40) - ₹10,000-15,000/sqft
-- =========================================

INSERT INTO properties (id, owner_id, title, description, property_type, listing_type, price, area_sqft, bedrooms, bathrooms, parking_spots, floor_number, total_floors, facing, furnishing, possession_status, address_line1, address_line2, city, state, pincode, latitude, longitude, amenities, is_featured, is_verified, status) VALUES

('p0000000-0000-0000-0000-000000000031', 'a0000000-0000-0000-0000-000000000004', 'Premium 3BHK in Anna Nagar West', 'Elegant 3BHK in heart of Anna Nagar. Near Tower Park and Shanti Colony. Reputed schools within 2km.', 'APARTMENT', 'SALE', 18000000, 1450, 3, 3, 2, 7, 12, 'North-East', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Tower View Apartments, Anna Nagar West', 'Near Tower Park', 'Chennai', 'Tamil Nadu', '600040', 13.0878, 80.2089, '["Gym", "Swimming Pool", "Clubhouse", "24/7 Security", "Indoor Games", "Party Hall"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000032', 'a0000000-0000-0000-0000-000000000004', 'Cozy 2BHK in Anna Nagar East', 'Well-designed 2BHK in family-friendly complex. Near Chinthamani Market. Good transport.', 'APARTMENT', 'SALE', 11000000, 1000, 2, 2, 1, 3, 8, 'East', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Family Heights, Anna Nagar East', 'Near Chinthamani Market', 'Chennai', 'Tamil Nadu', '600102', 13.0912, 80.2235, '["24/7 Security", "Power Backup", "Lift", "Children Play Area", "Garden"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000033', 'a0000000-0000-0000-0000-000000000009', 'Spacious 4BHK - Shanti Colony', 'Rare 4BHK in premium Shanti Colony. Large living spaces. Premium locality.', 'APARTMENT', 'SALE', 28000000, 2100, 4, 4, 2, 5, 7, 'South', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Shanti Residency, Anna Nagar', 'Shanti Colony Main Road', 'Chennai', 'Tamil Nadu', '600040', 13.0867, 80.2067, '["Premium Location", "Gym", "Swimming Pool", "24/7 Security", "Terrace Garden"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000034', 'a0000000-0000-0000-0000-000000000004', 'Modern 2BHK - Second Avenue', 'Contemporary 2BHK on Second Avenue. Walking distance to Anna Nagar Metro.', 'APARTMENT', 'SALE', 12500000, 1100, 2, 2, 1, 8, 14, 'North', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Metro Heights, Anna Nagar', 'Second Avenue', 'Chennai', 'Tamil Nadu', '600040', 13.0889, 80.2123, '["Metro Nearby", "Gym", "24/7 Security", "Power Backup"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000035', 'a0000000-0000-0000-0000-000000000009', 'Investment 1BHK - Anna Nagar', 'Compact 1BHK ideal for investment. High rental demand. Near office hub.', 'APARTMENT', 'SALE', 6500000, 580, 1, 1, 1, 4, 10, 'West', 'UNFURNISHED', 'READY_TO_MOVE', 'Business Park View, Anna Nagar', 'Near Roundtana', 'Chennai', 'Tamil Nadu', '600040', 13.0845, 80.2098, '["Office Area", "24/7 Security", "Power Backup", "Lift"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000036', 'a0000000-0000-0000-0000-000000000004', 'Independent House - Anna Nagar West', 'Beautiful independent house with garden. Duplex structure. Car parking for 3.', 'VILLA', 'SALE', 55000000, 3200, 4, 4, 3, NULL, 2, 'East', 'SEMI_FURNISHED', 'READY_TO_MOVE', '12th Main Road, Anna Nagar West', 'Near SBOA School', 'Chennai', 'Tamil Nadu', '600040', 13.0856, 80.2045, '["Independent House", "Garden", "Terrace", "Car Parking", "Modular Kitchen"]', true, true, 'ACTIVE'),

-- Anna Nagar Rentals
('p0000000-0000-0000-0000-000000000037', 'a0000000-0000-0000-0000-000000000004', 'Executive 3BHK Near Tower Park', 'High-end 3BHK for working professionals. All amenities. 6 months advance.', 'APARTMENT', 'RENT', 55000, 1400, 3, 3, 2, 8, 12, 'North-East', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Tower View Apartments, Anna Nagar', 'Near 2nd Avenue', 'Chennai', 'Tamil Nadu', '600040', 13.0889, 80.2112, '["Gym", "Swimming Pool", "Clubhouse", "24/7 Security", "Premium Furnished"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000038', 'a0000000-0000-0000-0000-000000000009', 'Family 2BHK - Anna Nagar East', 'Comfortable 2BHK for small families. Near market and schools.', 'APARTMENT', 'RENT', 30000, 950, 2, 2, 1, 3, 8, 'South', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Family Nest, Anna Nagar East', 'Near Market', 'Chennai', 'Tamil Nadu', '600102', 13.0923, 80.2256, '["Family Friendly", "24/7 Security", "School Nearby"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000039', 'a0000000-0000-0000-0000-000000000004', 'Bachelor 1BHK - Thirumangalam', 'Modern 1BHK for bachelors. Near Metro station. Fully furnished.', 'APARTMENT', 'RENT', 18000, 500, 1, 1, 0, 6, 10, 'East', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Metro View, Thirumangalam', 'Near Metro', 'Chennai', 'Tamil Nadu', '600040', 13.0789, 80.2234, '["Bachelor Friendly", "Metro Nearby", "Fully Furnished"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000040', 'a0000000-0000-0000-0000-000000000009', 'Luxury 3BHK - Shanti Colony Rent', 'Premium 3BHK in best locality. Long term only. Family preferred.', 'APARTMENT', 'RENT', 70000, 1600, 3, 3, 2, 4, 6, 'North', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Shanti Heights, Anna Nagar', 'Shanti Colony', 'Chennai', 'Tamil Nadu', '600040', 13.0878, 80.2078, '["Premium Location", "Gym", "Swimming Pool", "Long Term Only"]', true, true, 'ACTIVE');

-- =========================================
-- PART 4B: T NAGAR PROPERTIES (41-47) - ₹12,000-18,000/sqft
-- =========================================

INSERT INTO properties (id, owner_id, title, description, property_type, listing_type, price, area_sqft, bedrooms, bathrooms, parking_spots, floor_number, total_floors, facing, furnishing, possession_status, address_line1, address_line2, city, state, pincode, latitude, longitude, amenities, is_featured, is_verified, status) VALUES

('p0000000-0000-0000-0000-000000000041', 'a0000000-0000-0000-0000-000000000008', 'Exclusive 3BHK Near Pondy Bazaar', 'Rare find - Spacious 3BHK in heart of T Nagar shopping district. Walking distance to Saravana Stores.', 'APARTMENT', 'SALE', 25200000, 1550, 3, 3, 2, 5, 7, 'South', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Heritage Plaza, T Nagar', 'Near Pondy Bazaar', 'Chennai', 'Tamil Nadu', '600017', 13.0418, 80.2341, '["Shopping District", "24/7 Security", "Premium Finishes", "Visitor Parking"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000042', 'a0000000-0000-0000-0000-000000000007', 'Commercial Space - T Nagar Main Road', 'Prime commercial space for showroom or office. High footfall area.', 'COMMERCIAL', 'SALE', 35000000, 1800, NULL, 2, 4, 0, 4, 'South', 'UNFURNISHED', 'READY_TO_MOVE', 'Business Hub, T Nagar', 'Main Road', 'Chennai', 'Tamil Nadu', '600017', 13.0412, 80.2356, '["Prime Location", "High Footfall", "Power Backup", "Street Facing"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000043', 'a0000000-0000-0000-0000-000000000008', 'Classic 2BHK - GN Chetty Road', 'Elegant 2BHK in premium T Nagar locality. Near temples and shopping.', 'APARTMENT', 'SALE', 18000000, 1200, 2, 2, 1, 3, 5, 'East', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'GN Chetty Residency, T Nagar', 'GN Chetty Road', 'Chennai', 'Tamil Nadu', '600017', 13.0434, 80.2378, '["Premium Location", "Temple Nearby", "24/7 Security"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000044', 'a0000000-0000-0000-0000-000000000007', 'Modern 3BHK - Thyagaraya Nagar', 'Contemporary 3BHK with modern amenities. Central T Nagar location.', 'APARTMENT', 'SALE', 22000000, 1400, 3, 2, 2, 6, 8, 'North', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Thyagaraya Heights, T Nagar', 'Near Mambalam MRTS', 'Chennai', 'Tamil Nadu', '600017', 13.0398, 80.2312, '["Central Location", "Gym", "24/7 Security", "MRTS Nearby"]', true, true, 'ACTIVE'),

-- T Nagar Rentals
('p0000000-0000-0000-0000-000000000045', 'a0000000-0000-0000-0000-000000000008', '2BHK Near Mambalam Station', 'Convenient 2BHK near train station. Shopping hub nearby. Small families.', 'APARTMENT', 'RENT', 32000, 900, 2, 2, 1, 2, 5, 'South', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Railway Residency, West Mambalam', 'Near MRTS Station', 'Chennai', 'Tamil Nadu', '600033', 13.0378, 80.2287, '["Railway Connectivity", "24/7 Security", "Shopping Nearby"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000046', 'a0000000-0000-0000-0000-000000000007', 'Premium 3BHK - Pondy Bazaar Rent', 'Luxury 3BHK in shopping paradise. Premium finishes. Long term only.', 'APARTMENT', 'RENT', 60000, 1400, 3, 3, 1, 4, 7, 'East', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Pondy Heights, T Nagar', 'Near Pondy Bazaar', 'Chennai', 'Tamil Nadu', '600017', 13.0423, 80.2345, '["Shopping Paradise", "Premium Furnished", "24/7 Security"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000047', 'a0000000-0000-0000-0000-000000000008', 'Budget 1BHK - West Mambalam', 'Affordable 1BHK for singles. Good transport connectivity. Vegetarian only.', 'APARTMENT', 'RENT', 15000, 480, 1, 1, 0, 3, 5, 'West', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Mambalam View, West Mambalam', 'Near Bus Stand', 'Chennai', 'Tamil Nadu', '600033', 13.0356, 80.2267, '["Budget Friendly", "Transport Nearby", "Vegetarian Only"]', false, true, 'ACTIVE');

-- =========================================
-- PART 5: PORUR PROPERTIES (48-53) - ₹6,000-8,500/sqft (Affordable)
-- =========================================

INSERT INTO properties (id, owner_id, title, description, property_type, listing_type, price, area_sqft, bedrooms, bathrooms, parking_spots, floor_number, total_floors, facing, furnishing, possession_status, address_line1, address_line2, city, state, pincode, latitude, longitude, amenities, is_featured, is_verified, status) VALUES

('p0000000-0000-0000-0000-000000000048', 'a0000000-0000-0000-0000-000000000002', 'New 2BHK Near Porur Junction', 'Brand new 2BHK in upcoming hub. Good connectivity to Mount-Poonamallee Road. Value investment.', 'APARTMENT', 'SALE', 5100000, 750, 2, 2, 1, 4, 10, 'West', 'UNFURNISHED', 'READY_TO_MOVE', 'Lake View Residency, Porur', 'Near Porur Lake', 'Chennai', 'Tamil Nadu', '600116', 13.0356, 80.1567, '["Lake View", "24/7 Security", "Power Backup", "Lift"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000049', 'a0000000-0000-0000-0000-000000000005', 'Spacious 3BHK for Families - Porur', 'Large 3BHK with ample storage. Gated community. Schools nearby.', 'APARTMENT', 'SALE', 8925000, 1050, 3, 2, 1, 2, 8, 'East', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Green Valley Apartments, Porur', 'Near SBOA School', 'Chennai', 'Tamil Nadu', '600116', 13.0312, 80.1623, '["Gym", "Swimming Pool", "Children Play Area", "24/7 Security", "Garden"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000050', 'a0000000-0000-0000-0000-000000000009', 'Affordable 1BHK - Porur', 'Budget 1BHK for first-time buyers. Near hospital and schools.', 'APARTMENT', 'SALE', 3200000, 500, 1, 1, 0, 3, 6, 'North', 'UNFURNISHED', 'READY_TO_MOVE', 'Budget Homes, Porur', 'Near Porur Hospital', 'Chennai', 'Tamil Nadu', '600116', 13.0378, 80.1545, '["Hospital Nearby", "24/7 Security", "Power Backup"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000051', 'a0000000-0000-0000-0000-000000000002', 'Under Construction 2BHK - Porur', 'New project at pre-launch price. Delivery 2026. Great appreciation potential.', 'APARTMENT', 'SALE', 4500000, 780, 2, 2, 1, 8, 14, 'South', 'UNFURNISHED', 'UNDER_CONSTRUCTION', 'Sunrise Enclave, Porur', 'Mount Road', 'Chennai', 'Tamil Nadu', '600116', 13.0334, 80.1589, '["Gym", "Swimming Pool", "24/7 Security", "Clubhouse"]', false, true, 'ACTIVE'),

-- Porur Rentals
('p0000000-0000-0000-0000-000000000052', 'a0000000-0000-0000-0000-000000000002', 'Budget 2BHK for Small Families', 'Affordable 2BHK in quiet locality. Near schools. Low deposit.', 'APARTMENT', 'RENT', 18000, 800, 2, 1, 1, 3, 6, 'West', 'UNFURNISHED', 'READY_TO_MOVE', 'Family Nest, Porur', 'Near Porur Signal', 'Chennai', 'Tamil Nadu', '600116', 13.0378, 80.1589, '["Affordable", "24/7 Security", "School Nearby"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000053', 'a0000000-0000-0000-0000-000000000009', '3BHK with Lake View - Rent', 'Scenic 3BHK overlooking Porur lake. Family preferred.', 'APARTMENT', 'RENT', 28000, 1100, 3, 2, 1, 5, 8, 'North', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Lake View Apartments, Porur', 'Near Lake', 'Chennai', 'Tamil Nadu', '600116', 13.0345, 80.1556, '["Lake View", "24/7 Security", "Family Preferred"]', true, true, 'ACTIVE');

-- =========================================
-- PART 5B: TAMBARAM PROPERTIES (54-60) - ₹5,000-7,000/sqft (Most Affordable)
-- =========================================

INSERT INTO properties (id, owner_id, title, description, property_type, listing_type, price, area_sqft, bedrooms, bathrooms, parking_spots, floor_number, total_floors, facing, furnishing, possession_status, address_line1, address_line2, city, state, pincode, latitude, longitude, amenities, is_featured, is_verified, status) VALUES

('p0000000-0000-0000-0000-000000000054', 'a0000000-0000-0000-0000-000000000002', 'Budget 1BHK Near Tambaram Station', 'Affordable 1BHK. 5 mins walk to Railway Station. High rental potential.', 'APARTMENT', 'SALE', 2750000, 500, 1, 1, 0, 2, 5, 'North', 'UNFURNISHED', 'READY_TO_MOVE', 'Railway View Apartments, Tambaram', 'Near Railway Station', 'Chennai', 'Tamil Nadu', '600045', 12.9249, 80.1278, '["Railway Connectivity", "24/7 Security", "Power Backup"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000055', 'a0000000-0000-0000-0000-000000000004', 'Value 2BHK in Chromepet', 'Well-priced 2BHK in established locality. Near bus terminus.', 'APARTMENT', 'SALE', 4200000, 700, 2, 1, 1, 3, 6, 'East', 'UNFURNISHED', 'READY_TO_MOVE', 'Sunrise Apartments, Chromepet', 'Near Bus Terminus', 'Chennai', 'Tamil Nadu', '600044', 12.9516, 80.1413, '["Bus Connectivity", "24/7 Security", "Lift"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000056', 'a0000000-0000-0000-0000-000000000006', 'Spacious 3BHK - Tambaram West', 'Large 3BHK for growing families. Near GST Road. Good appreciation.', 'APARTMENT', 'SALE', 5600000, 950, 3, 2, 1, 4, 8, 'South', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'GST View Apartments, Tambaram', 'Near GST Road', 'Chennai', 'Tamil Nadu', '600045', 12.9267, 80.1234, '["GST Road Access", "24/7 Security", "Children Play Area"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000057', 'a0000000-0000-0000-0000-000000000002', 'DTCP Approved Plot - Tambaram', 'Clear title DTCP approved plot. Ready for construction. All utilities.', 'PLOT', 'SALE', 3600000, 1200, NULL, NULL, NULL, NULL, NULL, 'East', NULL, NULL, 'Golden Gardens Layout, Tambaram West', 'Near GST Road', 'Chennai', 'Tamil Nadu', '600045', 12.9178, 80.1189, '["DTCP Approved", "Clear Title", "Electricity", "Water Connection"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000058', 'a0000000-0000-0000-0000-000000000006', 'New 2BHK - Selaiyur', 'Modern 2BHK in rapidly developing Selaiyur. Near colleges.', 'APARTMENT', 'SALE', 3800000, 680, 2, 2, 1, 5, 10, 'West', 'UNFURNISHED', 'READY_TO_MOVE', 'College View, Selaiyur', 'Near Engineering College', 'Chennai', 'Tamil Nadu', '600073', 12.9123, 80.1356, '["College Nearby", "24/7 Security", "Power Backup"]', false, true, 'ACTIVE'),

-- Tambaram Rentals
('p0000000-0000-0000-0000-000000000059', 'a0000000-0000-0000-0000-000000000004', 'Value 1BHK Near GST Road', 'Simple 1BHK for singles or couples. Good transport. All bills excluded.', 'APARTMENT', 'RENT', 10000, 450, 1, 1, 0, 1, 4, 'East', 'UNFURNISHED', 'READY_TO_MOVE', 'Budget Homes, Tambaram East', 'Near GST Road', 'Chennai', 'Tamil Nadu', '600059', 12.9267, 80.1334, '["Budget Friendly", "Transport Nearby"]', false, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000060', 'a0000000-0000-0000-0000-000000000006', 'Family 2BHK - Chromepet Rent', 'Comfortable 2BHK for families. Near hospital and schools.', 'APARTMENT', 'RENT', 14000, 750, 2, 2, 1, 2, 5, 'North', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Family Residency, Chromepet', 'Near Chromepet Hospital', 'Chennai', 'Tamil Nadu', '600044', 12.9534, 80.1423, '["Hospital Nearby", "24/7 Security", "Family Preferred"]', false, true, 'ACTIVE');

-- =========================================
-- PART 5C: GUINDY PROPERTIES (61-65) - ₹8,000-12,000/sqft
-- =========================================

INSERT INTO properties (id, owner_id, title, description, property_type, listing_type, price, area_sqft, bedrooms, bathrooms, parking_spots, floor_number, total_floors, facing, furnishing, possession_status, address_line1, address_line2, city, state, pincode, latitude, longitude, amenities, is_featured, is_verified, status) VALUES

('p0000000-0000-0000-0000-000000000061', 'a0000000-0000-0000-0000-000000000003', 'Corporate 2BHK Near Industrial Estate', 'Modern 2BHK ideal for professionals. Walking distance to Guindy Metro and MRTS.', 'APARTMENT', 'SALE', 8800000, 950, 2, 2, 1, 6, 10, 'North-East', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Metro Heights, Guindy', 'Near Guindy Metro', 'Chennai', 'Tamil Nadu', '600032', 13.0067, 80.2121, '["Metro Connectivity", "Gym", "24/7 Security", "Cafeteria"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000062', 'a0000000-0000-0000-0000-000000000007', 'Premium 3BHK - Guindy', 'Elegant 3BHK near Kathipara Junction. Excellent connectivity.', 'APARTMENT', 'SALE', 14400000, 1350, 3, 3, 2, 8, 12, 'East', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Kathipara Towers, Guindy', 'Near Kathipara', 'Chennai', 'Tamil Nadu', '600032', 13.0089, 80.2098, '["Junction Access", "Gym", "Swimming Pool", "24/7 Security"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000063', 'a0000000-0000-0000-0000-000000000003', 'Commercial Office Space - Guindy', 'Prime office space in business district. Near Metro and MRTS.', 'COMMERCIAL', 'SALE', 18000000, 1500, NULL, 2, 5, 2, 6, 'South', 'UNFURNISHED', 'READY_TO_MOVE', 'Business Park, Guindy', 'Near Olympia Tech Park', 'Chennai', 'Tamil Nadu', '600032', 13.0078, 80.2134, '["Business District", "Metro Nearby", "24/7 Security", "Parking"]', true, true, 'ACTIVE'),

-- Guindy Rentals
('p0000000-0000-0000-0000-000000000064', 'a0000000-0000-0000-0000-000000000003', 'Corporate Housing 2BHK - Guindy', 'Perfect for corporate employees. Near Kathipara. Metro accessible.', 'APARTMENT', 'RENT', 28000, 900, 2, 2, 1, 5, 8, 'North', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Corporate Suites, Guindy', 'Near Kathipara', 'Chennai', 'Tamil Nadu', '600032', 13.0089, 80.2098, '["Corporate Housing", "Gym", "Metro Nearby", "Fully Furnished"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000065', 'a0000000-0000-0000-0000-000000000007', '1BHK Near DLF - Rent', 'Compact 1BHK near DLF IT Park. Ideal for IT professionals.', 'APARTMENT', 'RENT', 18000, 550, 1, 1, 0, 4, 10, 'East', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'IT Park View, Guindy', 'Near DLF', 'Chennai', 'Tamil Nadu', '600032', 13.0056, 80.2145, '["IT Park Nearby", "24/7 Security", "Power Backup"]', false, true, 'ACTIVE');

-- =========================================
-- PART 6: ECR PROPERTIES (66-72) - ₹7,500-10,000+/sqft (Beach Side)
-- =========================================

INSERT INTO properties (id, owner_id, title, description, property_type, listing_type, price, area_sqft, bedrooms, bathrooms, parking_spots, floor_number, total_floors, facing, furnishing, possession_status, address_line1, address_line2, city, state, pincode, latitude, longitude, amenities, is_featured, is_verified, status) VALUES

('p0000000-0000-0000-0000-000000000066', 'a0000000-0000-0000-0000-000000000004', 'Beach-Side Villa in ECR', 'Stunning 4BHK villa on ECR. Private garden, terrace with sea view. Perfect weekend home.', 'VILLA', 'SALE', 35000000, 3500, 4, 4, 3, NULL, 2, 'East', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Serenity Villas, Injambakkam', 'ECR Main Road', 'Chennai', 'Tamil Nadu', '600041', 12.9167, 80.2525, '["Private Garden", "Sea View", "Swimming Pool", "Home Theatre", "Smart Home"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000067', 'a0000000-0000-0000-0000-000000000005', 'Gated Community Villa - Palavakkam', '3BHK villa in premium gated community. Landscaped gardens and clubhouse access.', 'VILLA', 'SALE', 22000000, 2400, 3, 3, 2, NULL, 2, 'North-East', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Palm Grove Villas, Palavakkam', 'Off ECR', 'Chennai', 'Tamil Nadu', '600041', 12.9523, 80.2586, '["Gated Community", "Clubhouse", "Swimming Pool", "Gym", "Landscaped Gardens"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000068', 'a0000000-0000-0000-0000-000000000006', 'Modern 3BHK - ECR Junction', 'Contemporary 3BHK with beach proximity. Ideal for beach lovers.', 'APARTMENT', 'SALE', 12000000, 1300, 3, 2, 2, 4, 6, 'East', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Beach View Apartments, Neelankarai', 'Near Beach', 'Chennai', 'Tamil Nadu', '600041', 12.9456, 80.2567, '["Beach Proximity", "24/7 Security", "Power Backup", "Sea Breeze"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000069', 'a0000000-0000-0000-0000-000000000004', 'Luxury Duplex - ECR', '5BHK duplex with private pool. Ultimate luxury living on ECR.', 'VILLA', 'SALE', 65000000, 5500, 5, 5, 4, NULL, 3, 'All Sides', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Ocean Pearl Villas, Uthandi', 'ECR Main Road', 'Chennai', 'Tamil Nadu', '600119', 12.8789, 80.2489, '["Private Pool", "Home Theatre", "Gym", "Smart Home", "Landscaped Garden", "Staff Quarters"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000070', 'a0000000-0000-0000-0000-000000000006', 'Beach Plot - ECR', 'Premium plot just 500m from beach. DTCP approved. Great investment.', 'PLOT', 'SALE', 15000000, 2400, NULL, NULL, NULL, NULL, NULL, 'East', NULL, NULL, 'Coastal Layout, Akkarai', 'Near Beach', 'Chennai', 'Tamil Nadu', '600115', 12.8923, 80.2512, '["DTCP Approved", "Beach Proximity", "Clear Title", "Tar Road"]', true, true, 'ACTIVE'),

-- ECR Rentals
('p0000000-0000-0000-0000-000000000071', 'a0000000-0000-0000-0000-000000000004', 'Weekend Villa with Pool - ECR', 'Beautiful villa for long-term rent. Private pool and garden. Expat friendly.', 'VILLA', 'RENT', 125000, 3000, 4, 4, 2, NULL, 2, 'East', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Beach Haven Villas, Akkarai', 'ECR Road', 'Chennai', 'Tamil Nadu', '600115', 12.8978, 80.2534, '["Private Pool", "Garden", "Sea View", "Expat Friendly", "24/7 Security"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000072', 'a0000000-0000-0000-0000-000000000005', '3BHK Beach Apartment - Rent', 'Spacious 3BHK with beach view. Ideal for families seeking beach lifestyle.', 'APARTMENT', 'RENT', 55000, 1400, 3, 3, 1, 5, 7, 'East', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Sea Breeze Apartments, Palavakkam', 'Near Beach', 'Chennai', 'Tamil Nadu', '600041', 12.9534, 80.2578, '["Beach View", "24/7 Security", "Fully Furnished", "Family Friendly"]', true, true, 'ACTIVE');

-- =========================================
-- PART 6B: NUNGAMBAKKAM PROPERTIES (73-77) - ₹12,000-18,000+/sqft (Premium Central)
-- =========================================

INSERT INTO properties (id, owner_id, title, description, property_type, listing_type, price, area_sqft, bedrooms, bathrooms, parking_spots, floor_number, total_floors, facing, furnishing, possession_status, address_line1, address_line2, city, state, pincode, latitude, longitude, amenities, is_featured, is_verified, status) VALUES

('p0000000-0000-0000-0000-000000000073', 'a0000000-0000-0000-0000-000000000003', 'Commercial Space in Nungambakkam', 'Prime commercial space on ground floor. High footfall. Ideal for showroom.', 'COMMERCIAL', 'SALE', 45000000, 2500, NULL, 2, 5, 0, 4, 'South', 'UNFURNISHED', 'READY_TO_MOVE', 'Business Hub, Nungambakkam High Road', 'Near Khader Nawaz Khan Road', 'Chennai', 'Tamil Nadu', '600034', 13.0569, 80.2428, '["Prime Location", "High Footfall", "Power Backup", "Street Facing"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000074', 'a0000000-0000-0000-0000-000000000008', 'Luxury 3BHK - Khader Nawaz Khan Road', 'Ultra-premium 3BHK in most exclusive address. Celebrity neighborhood.', 'APARTMENT', 'SALE', 42000000, 2400, 3, 3, 2, 6, 8, 'North', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'KNK Residency, Nungambakkam', 'Khader Nawaz Khan Road', 'Chennai', 'Tamil Nadu', '600034', 13.0556, 80.2445, '["Premium Address", "Gym", "Swimming Pool", "24/7 Security", "Smart Home"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000075', 'a0000000-0000-0000-0000-000000000003', 'Modern 2BHK - Nungambakkam High Road', 'Contemporary 2BHK in central Chennai. Walking distance to Express Avenue.', 'APARTMENT', 'SALE', 21000000, 1350, 2, 2, 1, 8, 12, 'East', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'High Road Residency, Nungambakkam', 'Near Express Avenue', 'Chennai', 'Tamil Nadu', '600034', 13.0578, 80.2467, '["Central Location", "Mall Nearby", "24/7 Security", "Power Backup"]', true, true, 'ACTIVE'),

-- Nungambakkam Rentals
('p0000000-0000-0000-0000-000000000076', 'a0000000-0000-0000-0000-000000000008', 'Premium 3BHK - Nungambakkam Rent', 'Luxury 3BHK for expats and senior executives. All premium amenities.', 'APARTMENT', 'RENT', 95000, 1800, 3, 3, 2, 7, 10, 'North', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Executive Towers, Nungambakkam', 'Near US Consulate', 'Chennai', 'Tamil Nadu', '600034', 13.0545, 80.2456, '["Expat Friendly", "Gym", "Swimming Pool", "Premium Furnished", "24/7 Security"]', true, true, 'ACTIVE'),

('p0000000-0000-0000-0000-000000000077', 'a0000000-0000-0000-0000-000000000003', '2BHK Near Express Avenue - Rent', 'Modern 2BHK near shopping and entertainment. Young professionals preferred.', 'APARTMENT', 'RENT', 50000, 1100, 2, 2, 1, 5, 8, 'South', 'FULLY_FURNISHED', 'READY_TO_MOVE', 'Mall View Apartments, Nungambakkam', 'Near Express Avenue', 'Chennai', 'Tamil Nadu', '600034', 13.0589, 80.2478, '["Mall Nearby", "24/7 Security", "Fully Furnished"]', false, true, 'ACTIVE');

-- =========================================
-- PART 6C: OTHER AREAS (78-85) - Mixed
-- =========================================

INSERT INTO properties (id, owner_id, title, description, property_type, listing_type, price, area_sqft, bedrooms, bathrooms, parking_spots, floor_number, total_floors, facing, furnishing, possession_status, address_line1, address_line2, city, state, pincode, latitude, longitude, amenities, is_featured, is_verified, status) VALUES

-- Mylapore
('p0000000-0000-0000-0000-000000000078', 'a0000000-0000-0000-0000-000000000007', 'Heritage 3BHK - Mylapore', 'Classic 3BHK in cultural heart of Chennai. Near Kapaleeshwarar Temple.', 'APARTMENT', 'SALE', 19500000, 1400, 3, 2, 1, 2, 4, 'East', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Temple View Residency, Mylapore', 'Near Kapaleeshwarar Temple', 'Chennai', 'Tamil Nadu', '600004', 13.0339, 80.2676, '["Temple Nearby", "Cultural Hub", "24/7 Security", "Power Backup"]', true, true, 'ACTIVE'),

-- Kilpauk
('p0000000-0000-0000-0000-000000000079', 'a0000000-0000-0000-0000-000000000009', 'Modern 2BHK - Kilpauk', 'Contemporary 2BHK in established locality. Near medical college.', 'APARTMENT', 'SALE', 11500000, 1050, 2, 2, 1, 4, 7, 'North', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Medical View, Kilpauk', 'Near Kilpauk Medical College', 'Chennai', 'Tamil Nadu', '600010', 13.0789, 80.2345, '["Hospital Nearby", "24/7 Security", "Power Backup"]', false, true, 'ACTIVE'),

-- Egmore
('p0000000-0000-0000-0000-000000000080', 'a0000000-0000-0000-0000-000000000007', 'Central 2BHK - Egmore', 'Well-connected 2BHK near Egmore Station and Museum.', 'APARTMENT', 'SALE', 12000000, 1000, 2, 2, 1, 3, 6, 'South', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'Station View, Egmore', 'Near Egmore Station', 'Chennai', 'Tamil Nadu', '600008', 13.0734, 80.2589, '["Railway Station", "Museum Nearby", "24/7 Security"]', false, true, 'ACTIVE'),

-- Medavakkam
('p0000000-0000-0000-0000-000000000081', 'a0000000-0000-0000-0000-000000000004', 'Premium Corner Plot - Medavakkam', 'Prime corner plot in developing area. Near OMR junction. Good appreciation.', 'PLOT', 'SALE', 6500000, 1000, NULL, NULL, NULL, NULL, NULL, 'North-East', NULL, NULL, 'Sunshine Layout, Medavakkam', 'Near OMR Junction', 'Chennai', 'Tamil Nadu', '600100', 12.9187, 80.1923, '["Corner Plot", "CMDA Approved", "Near Main Road", "Street Lights"]', true, true, 'ACTIVE'),

-- Pallikaranai
('p0000000-0000-0000-0000-000000000082', 'a0000000-0000-0000-0000-000000000006', 'Affordable 2BHK - Pallikaranai', 'Budget-friendly 2BHK in growing locality. Near IT parks.', 'APARTMENT', 'SALE', 4500000, 780, 2, 2, 1, 5, 10, 'East', 'UNFURNISHED', 'READY_TO_MOVE', 'IT Park View, Pallikaranai', 'Near Pallikaranai Marsh', 'Chennai', 'Tamil Nadu', '600100', 12.9345, 80.2012, '["IT Park Nearby", "24/7 Security", "Power Backup"]', false, true, 'ACTIVE'),

-- Kelambakkam
('p0000000-0000-0000-0000-000000000083', 'a0000000-0000-0000-0000-000000000005', 'New Launch 2BHK - Kelambakkam', 'Under construction 2BHK near VIT. Student rental potential.', 'APARTMENT', 'SALE', 3500000, 720, 2, 2, 1, 6, 12, 'West', 'UNFURNISHED', 'UNDER_CONSTRUCTION', 'VIT View Apartments, Kelambakkam', 'Near VIT University', 'Chennai', 'Tamil Nadu', '603103', 12.7867, 80.2234, '["College Nearby", "24/7 Security", "Swimming Pool", "Gym"]', false, true, 'ACTIVE'),

-- Perambur
('p0000000-0000-0000-0000-000000000084', 'a0000000-0000-0000-0000-000000000009', 'Value 3BHK - Perambur', 'Spacious 3BHK in North Chennai. Near ICF. Good for families.', 'APARTMENT', 'SALE', 7200000, 1200, 3, 2, 1, 3, 6, 'North', 'SEMI_FURNISHED', 'READY_TO_MOVE', 'ICF View, Perambur', 'Near ICF Colony', 'Chennai', 'Tamil Nadu', '600011', 13.1123, 80.2345, '["ICF Nearby", "24/7 Security", "Children Play Area"]', false, true, 'ACTIVE'),

-- Ambattur
('p0000000-0000-0000-0000-000000000085', 'a0000000-0000-0000-0000-000000000002', 'Industrial Area 2BHK - Ambattur', 'Affordable 2BHK near Industrial Estate. Good for factory workers.', 'APARTMENT', 'RENT', 12000, 700, 2, 1, 0, 2, 5, 'East', 'UNFURNISHED', 'READY_TO_MOVE', 'Industrial View, Ambattur', 'Near Industrial Estate', 'Chennai', 'Tamil Nadu', '600053', 13.1145, 80.1567, '["Industrial Area", "24/7 Security", "Bus Connectivity"]', false, true, 'ACTIVE');

-- =========================================
-- PART 7: PROPERTY IMAGES
-- =========================================

INSERT INTO property_images (property_id, url, caption, is_primary, sort_order) VALUES
-- OMR Properties
('p0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'Modern Living Room', true, 1),
('p0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'Spacious Bedroom', false, 2),
('p0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', 'Modular Kitchen', false, 3),

('p0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'Premium Exterior', true, 1),
('p0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'Elegant Living Area', false, 2),
('p0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'Master Bedroom', false, 3),

('p0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'Building View', true, 1),
('p0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800', 'Bedroom', false, 2),

('p0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'Penthouse View', true, 1),
('p0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', 'Luxury Interior', false, 2),

-- Velachery
('p0000000-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'Apartment Exterior', true, 1),
('p0000000-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800', 'Living Room', false, 2),

-- Adyar
('p0000000-0000-0000-0000-000000000023', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'Premium Interior', true, 1),
('p0000000-0000-0000-0000-000000000023', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', 'Dining Area', false, 2),

('p0000000-0000-0000-0000-000000000024', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', 'Beach View Apartment', true, 1),

('p0000000-0000-0000-0000-000000000027', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'Independent House', true, 1),
('p0000000-0000-0000-0000-000000000027', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800', 'Garden View', false, 2),

-- Anna Nagar
('p0000000-0000-0000-0000-000000000031', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'Tower View', true, 1),
('p0000000-0000-0000-0000-000000000031', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', 'Premium Living', false, 2),

('p0000000-0000-0000-0000-000000000036', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', 'Independent Villa', true, 1),
('p0000000-0000-0000-0000-000000000036', 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800', 'Garden', false, 2),

-- T Nagar
('p0000000-0000-0000-0000-000000000041', 'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=800', 'Central Location', true, 1),

-- ECR Villas
('p0000000-0000-0000-0000-000000000066', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'Beach Villa Front', true, 1),
('p0000000-0000-0000-0000-000000000066', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', 'Swimming Pool', false, 2),
('p0000000-0000-0000-0000-000000000066', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800', 'Garden View', false, 3),
('p0000000-0000-0000-0000-000000000066', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', 'Sea View Terrace', false, 4),

('p0000000-0000-0000-0000-000000000067', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', 'Gated Villa', true, 1),
('p0000000-0000-0000-0000-000000000067', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'Villa Exterior', false, 2),

('p0000000-0000-0000-0000-000000000069', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800', 'Luxury Duplex', true, 1),
('p0000000-0000-0000-0000-000000000069', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'Interior', false, 2),

('p0000000-0000-0000-0000-000000000071', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'Weekend Villa', true, 1),
('p0000000-0000-0000-0000-000000000071', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', 'Pool Area', false, 2),

-- Nungambakkam
('p0000000-0000-0000-0000-000000000074', 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800', 'Luxury Apartment', true, 1),
('p0000000-0000-0000-0000-000000000074', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', 'Premium Living Room', false, 2),

-- Mylapore
('p0000000-0000-0000-0000-000000000078', 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800', 'Heritage Building', true, 1);

-- =========================================
-- PART 8: SAMPLE SHORTLISTS
-- =========================================

INSERT INTO shortlist (user_id, property_id, notes) VALUES
('a0000000-0000-0000-0000-000000000010', 'p0000000-0000-0000-0000-000000000001', 'Good location near office, need to visit'),
('a0000000-0000-0000-0000-000000000010', 'p0000000-0000-0000-0000-000000000016', 'Wife liked Velachery area'),
('a0000000-0000-0000-0000-000000000010', 'p0000000-0000-0000-0000-000000000031', 'Anna Nagar is preferred'),
('a0000000-0000-0000-0000-000000000011', 'p0000000-0000-0000-0000-000000000002', 'Premium property, check financing'),
('a0000000-0000-0000-0000-000000000011', 'p0000000-0000-0000-0000-000000000023', 'Adyar is our dream location'),
('a0000000-0000-0000-0000-000000000011', 'p0000000-0000-0000-0000-000000000066', 'ECR villa for retirement'),
('a0000000-0000-0000-0000-000000000012', 'p0000000-0000-0000-0000-000000000009', 'Perfect for office commute'),
('a0000000-0000-0000-0000-000000000012', 'p0000000-0000-0000-0000-000000000011', 'Expat friendly, good amenities'),
('a0000000-0000-0000-0000-000000000013', 'p0000000-0000-0000-0000-000000000054', 'Budget option near station'),
('a0000000-0000-0000-0000-000000000013', 'p0000000-0000-0000-0000-000000000048', 'Porur is developing fast'),
('a0000000-0000-0000-0000-000000000014', 'p0000000-0000-0000-0000-000000000041', 'T Nagar for parents'),
('a0000000-0000-0000-0000-000000000014', 'p0000000-0000-0000-0000-000000000078', 'Mylapore heritage feel'),
('a0000000-0000-0000-0000-000000000015', 'p0000000-0000-0000-0000-000000000067', 'Villa for weekend getaway'),
('a0000000-0000-0000-0000-000000000015', 'p0000000-0000-0000-0000-000000000074', 'Nungambakkam for work');

-- =========================================
-- PART 9: SAMPLE INQUIRIES
-- =========================================

INSERT INTO inquiries (property_id, buyer_id, seller_id, message, status) VALUES
('p0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000002', 'Hi, I am interested in this property. Is the price negotiable? I work at TCS nearby.', 'PENDING'),
('p0000000-0000-0000-0000-000000000016', 'a0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000003', 'Can we schedule a site visit this Saturday? Looking for a family home.', 'RESPONDED'),
('p0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000005', 'Looking for home loan assistance. Do you have bank tie-ups?', 'PENDING'),
('p0000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000003', 'Adyar is our dream location. Can we negotiate on price?', 'PENDING'),
('p0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000002', 'Is this available from next month? I work at Cognizant.', 'PENDING'),
('p0000000-0000-0000-0000-000000000066', 'a0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000004', 'Beautiful villa! Is the sea view unobstructed? Planning for retirement.', 'PENDING'),
('p0000000-0000-0000-0000-000000000031', 'a0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000004', 'Anna Nagar is perfect for us. What is the maintenance charge?', 'RESPONDED'),
('p0000000-0000-0000-0000-000000000054', 'a0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000002', 'Budget fits. Can I get it for 25 lakhs?', 'PENDING'),
('p0000000-0000-0000-0000-000000000071', 'a0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000004', 'Looking for long term rental. We are an expat family from UK.', 'RESPONDED'),
('p0000000-0000-0000-0000-000000000074', 'a0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000008', 'Premium property! Is parking available for 2 cars?', 'PENDING'),
('p0000000-0000-0000-0000-000000000041', 'a0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000008', 'T Nagar location is perfect for my parents. Temples nearby?', 'PENDING'),
('p0000000-0000-0000-0000-000000000078', 'a0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000007', 'Mylapore heritage is what we are looking for. Original photos please.', 'PENDING');

-- =========================================
-- VERIFICATION QUERIES (Run after insert)
-- =========================================
-- SELECT 'Users' as table_name, COUNT(*) as count FROM users
-- UNION ALL SELECT 'Properties', COUNT(*) FROM properties
-- UNION ALL SELECT 'Property Images', COUNT(*) FROM property_images
-- UNION ALL SELECT 'Shortlists', COUNT(*) FROM shortlist
-- UNION ALL SELECT 'Inquiries', COUNT(*) FROM inquiries;
