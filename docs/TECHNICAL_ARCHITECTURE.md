# Houlnd Realty - Technical Architecture

> **System Design and Technology Recommendations**

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       HOULND REALTY ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────────────────────────────────────────────────────────┐     │
│   │                         CLIENT LAYER                             │     │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │     │
│   │  │   Web App   │  │  iOS App    │  │ Android App │              │     │
│   │  │  (React/    │  │  (Phase 4)  │  │  (Phase 4)  │              │     │
│   │  │   Next.js)  │  │             │  │             │              │     │
│   │  └─────────────┘  └─────────────┘  └─────────────┘              │     │
│   └──────────────────────────────────────────────────────────────────┘     │
│                                    │                                        │
│                                    ▼                                        │
│   ┌──────────────────────────────────────────────────────────────────┐     │
│   │                        API GATEWAY                               │     │
│   │              (Kong / AWS API Gateway / Nginx)                    │     │
│   └──────────────────────────────────────────────────────────────────┘     │
│                                    │                                        │
│                                    ▼                                        │
│   ┌──────────────────────────────────────────────────────────────────┐     │
│   │                      MICROSERVICES LAYER                         │     │
│   │                                                                  │     │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │     │
│   │  │  Auth   │ │Property │ │ Payment │ │ Search  │ │ Notifi- │   │     │
│   │  │ Service │ │ Service │ │ Service │ │ Service │ │ cation  │   │     │
│   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │     │
│   │                                                                  │     │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │     │
│   │  │ Booking │ │ Media   │ │ Admin   │ │ Analytics│              │     │
│   │  │ Service │ │ Service │ │ Service │ │ Service │               │     │
│   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │     │
│   └──────────────────────────────────────────────────────────────────┘     │
│                                    │                                        │
│                                    ▼                                        │
│   ┌──────────────────────────────────────────────────────────────────┐     │
│   │                         DATA LAYER                               │     │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │     │
│   │  │ PostgreSQL  │  │   Redis     │  │Elasticsearch│              │     │
│   │  │ (Primary DB)│  │  (Cache)    │  │  (Search)   │              │     │
│   │  └─────────────┘  └─────────────┘  └─────────────┘              │     │
│   │                                                                  │     │
│   │  ┌─────────────┐  ┌─────────────┐                               │     │
│   │  │    S3/      │  │  MongoDB    │                               │     │
│   │  │ CloudStorage│  │ (Analytics) │                               │     │
│   │  └─────────────┘  └─────────────┘                               │     │
│   └──────────────────────────────────────────────────────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack Recommendations

### Frontend

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Web Framework** | Next.js (React) | SSR, SEO, Performance |
| **State Management** | Redux Toolkit / Zustand | Scalable state management |
| **UI Components** | Tailwind CSS + Shadcn/UI | Rapid development, consistency |
| **Maps** | Google Maps API / Mapbox | Property location visualization |
| **Forms** | React Hook Form + Zod | Type-safe form handling |

### Backend

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **API Framework** | Node.js (NestJS) / Python (FastAPI) | Scalable, well-documented |
| **Authentication** | JWT + OAuth 2.0 | Industry standard |
| **ORM** | Prisma / SQLAlchemy | Type-safe database access |
| **Queue System** | Redis + Bull / RabbitMQ | Background job processing |
| **API Documentation** | OpenAPI / Swagger | Developer experience |

### Database

| Type | Technology | Use Case |
|------|------------|----------|
| **Primary DB** | PostgreSQL | Transactional data, users, properties |
| **Cache** | Redis | Session, frequently accessed data |
| **Search** | Elasticsearch | Property search, filters |
| **Document Store** | MongoDB | Analytics, logs |
| **File Storage** | AWS S3 / GCP Cloud Storage | Images, videos, documents |

### Infrastructure

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Cloud Provider** | AWS / GCP / Azure | Hosting, services |
| **Container** | Docker + Kubernetes | Deployment, scaling |
| **CI/CD** | GitHub Actions / GitLab CI | Automation |
| **Monitoring** | Prometheus + Grafana | System health |
| **Logging** | ELK Stack | Centralized logging |

---

## Database Schema (Core Entities)

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CORE DATABASE SCHEMA                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐           ┌──────────────┐           ┌──────────────┐   │
│   │    USERS     │           │  PROPERTIES  │           │   PAYMENTS   │   │
│   ├──────────────┤           ├──────────────┤           ├──────────────┤   │
│   │ id           │──────────▶│ id           │◀──────────│ id           │   │
│   │ email        │  owns     │ title        │  unlocks  │ user_id      │   │
│   │ phone        │           │ type         │           │ property_id  │   │
│   │ role         │           │ owner_id     │           │ amount       │   │
│   │ verified     │           │ location     │           │ status       │   │
│   │ created_at   │           │ price        │           │ created_at   │   │
│   └──────────────┘           │ area_sqft    │           └──────────────┘   │
│          │                   │ price_sqft   │                  │            │
│          │                   │ is_verified  │                  │            │
│          │                   │ status       │                  │            │
│          │                   └──────────────┘                  │            │
│          │                          │                          │            │
│          │                          │                          │            │
│          ▼                          ▼                          │            │
│   ┌──────────────┐           ┌──────────────┐                  │            │
│   │  SHORTLISTS  │           │  AMENITIES   │                  │            │
│   ├──────────────┤           ├──────────────┤                  │            │
│   │ id           │           │ id           │                  │            │
│   │ user_id      │           │ property_id  │                  │            │
│   │ property_id  │           │ name         │                  │            │
│   │ is_unlocked  │◀──────────│ price        │                  │            │
│   │ created_at   │           └──────────────┘                  │            │
│   └──────────────┘                                             │            │
│          │                                                     │            │
│          │                   ┌──────────────┐                  │            │
│          │                   │ APPOINTMENTS │                  │            │
│          │                   ├──────────────┤                  │            │
│          └──────────────────▶│ id           │◀─────────────────┘            │
│                              │ user_id      │                               │
│                              │ property_id  │                               │
│                              │ scheduled_at │                               │
│                              │ status       │                               │
│                              │ notes        │                               │
│                              └──────────────┘                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Tables

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('buyer', 'promoter', 'admin') NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Properties Table
```sql
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('plot', 'apartment', 'villa', 'commercial') NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    total_price DECIMAL(15, 2) NOT NULL,
    area_sqft DECIMAL(10, 2) NOT NULL,
    price_per_sqft DECIMAL(10, 2) GENERATED ALWAYS AS (total_price / area_sqft) STORED,
    is_negotiable BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    status ENUM('active', 'inactive', 'sold') DEFAULT 'active',
    commission_agreed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Payments Table
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    property_id UUID REFERENCES properties(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_type ENUM('contact_unlock', 'subscription', 'commission') NOT NULL,
    gateway_transaction_id VARCHAR(255),
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Design

### RESTful Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | User registration |
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/verify-otp` | OTP verification |
| POST | `/api/v1/auth/forgot-password` | Password reset request |
| POST | `/api/v1/auth/reset-password` | Password reset |

#### Properties
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/properties` | List properties (with filters) |
| GET | `/api/v1/properties/:id` | Get property details |
| POST | `/api/v1/properties` | Create property (promoter) |
| PUT | `/api/v1/properties/:id` | Update property |
| DELETE | `/api/v1/properties/:id` | Delete property |
| GET | `/api/v1/properties/:id/contact` | Get seller contact (requires payment) |

#### Shortlists
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/shortlists` | Get user's shortlist |
| POST | `/api/v1/shortlists` | Add to shortlist |
| DELETE | `/api/v1/shortlists/:id` | Remove from shortlist |

#### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/appointments` | Get user's appointments |
| POST | `/api/v1/appointments` | Schedule appointment |
| PUT | `/api/v1/appointments/:id` | Update appointment |
| DELETE | `/api/v1/appointments/:id` | Cancel appointment |

#### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/payments/create-order` | Create payment order |
| POST | `/api/v1/payments/verify` | Verify payment |
| GET | `/api/v1/payments/history` | Payment history |

### Filter Query Parameters

```
GET /api/v1/properties?
    price_sqft_min=999&
    price_sqft_max=19999&
    type=apartment&
    city=bangalore&
    budget_min=5000000&
    budget_max=10000000&
    is_verified=true&
    page=1&
    limit=20&
    sort=price_sqft_asc
```

---

## Security Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────┐    │
│   │Client│───▶│API Gateway│───▶│Auth Service│───▶│ JWT Token │───▶│ API  │    │
│   └──────┘    └──────────┘    └──────────┘    └──────────┘    └──────┘    │
│       │                             │                                       │
│       │                             ▼                                       │
│       │                       ┌──────────┐                                  │
│       │                       │  Redis   │                                  │
│       │                       │(Sessions)│                                  │
│       │                       └──────────┘                                  │
│       │                                                                     │
│       └────────────── OTP via SMS/Email ───────────────────────────────────│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Security Measures

| Layer | Measure | Implementation |
|-------|---------|----------------|
| **Transport** | HTTPS/TLS | SSL certificates |
| **Authentication** | JWT + Refresh Tokens | Token rotation |
| **Authorization** | RBAC | Role-based access |
| **Data** | Encryption at rest | AES-256 |
| **API** | Rate limiting | 100 req/min |
| **Input** | Validation & Sanitization | Zod/Joi |
| **Payments** | PCI DSS Compliance | Payment gateway |

---

## Scalability Considerations

### Horizontal Scaling

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SCALING ARCHITECTURE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                          ┌─────────────────┐                                │
│                          │  Load Balancer  │                                │
│                          │   (AWS ALB)     │                                │
│                          └────────┬────────┘                                │
│                                   │                                         │
│              ┌────────────────────┼────────────────────┐                   │
│              │                    │                    │                   │
│              ▼                    ▼                    ▼                   │
│       ┌───────────┐        ┌───────────┐        ┌───────────┐             │
│       │  API Pod  │        │  API Pod  │        │  API Pod  │             │
│       │    #1     │        │    #2     │        │    #3     │             │
│       └───────────┘        └───────────┘        └───────────┘             │
│              │                    │                    │                   │
│              └────────────────────┼────────────────────┘                   │
│                                   │                                         │
│                                   ▼                                         │
│                    ┌──────────────────────────┐                            │
│                    │    Database Cluster      │                            │
│                    │  (Primary + Replicas)    │                            │
│                    └──────────────────────────┘                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| Page Load | < 3 seconds | CDN, caching |
| API Response | < 200ms | Query optimization |
| Search | < 500ms | Elasticsearch |
| Uptime | 99.5% | Multi-AZ deployment |
| Concurrent Users | 10,000+ | Auto-scaling |

---

## Deployment Strategy

### Environment Pipeline

```
Development → Staging → Production
     │            │           │
     ▼            ▼           ▼
  Feature      Integration   Live
  Testing      Testing       Release
```

### CI/CD Pipeline

| Stage | Tool | Action |
|-------|------|--------|
| Code | GitHub | Version control |
| Build | GitHub Actions | Docker build |
| Test | Jest/PyTest | Unit & Integration |
| Scan | SonarQube | Code quality |
| Deploy | ArgoCD/Kubernetes | Container orchestration |
| Monitor | Datadog/Prometheus | Observability |

---

## Third-Party Integrations

| Service | Provider | Purpose |
|---------|----------|---------|
| **Maps** | Google Maps API | Location services |
| **Payment** | Razorpay / Stripe | Payment processing |
| **SMS** | Twilio / MSG91 | OTP, notifications |
| **Email** | SendGrid / AWS SES | Transactional emails |
| **Storage** | AWS S3 / Cloudinary | Media storage |
| **Analytics** | Mixpanel / Amplitude | User analytics |
| **Error Tracking** | Sentry | Error monitoring |

---

*Document Version: 1.0 | Last Updated: December 2025*
