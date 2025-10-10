# 🎓 Al-Hamzeh LMS Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.8-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**A modern, enterprise-grade Learning Management System with advanced content protection and optimized video streaming**

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

[![GitHub Repo](https://img.shields.io/badge/GitHub-Dweirii/LMS--Al--Hamzeh-blue?style=for-the-badge&logo=github)](https://github.com/Dweirii/LMS-Al-Hamzeh)

</div>

---

## 📖 Overview

Al-Hamzeh LMS is a **production-ready, enterprise-grade Learning Management System** designed to deliver exceptional online learning experiences with military-grade content protection. Built with Next.js 15 and React 19, it offers a seamless, high-performance interface for students, instructors, and administrators.

### 🌟 What Makes Al-Hamzeh LMS Special?

- 🚀 **Blazing Fast Performance** - Powered by Next.js 15 App Router with React Server Components & Turbopack
- 🎥 **Optimized Video Streaming** - HTTP 206 Range Requests with instant metadata loading and smooth playback
- 🔒 **Military-Grade Content Protection** - Advanced DevTools detection, DRM-like features, and legal warnings
- 📱 **Mobile First & Responsive** - Flawless experience across all devices with touch-optimized UI
- 🎨 **Modern Beautiful UI** - Sleek design with Tailwind CSS v4 and shadcn/ui components
- 📊 **Real-Time Progress Tracking** - Comprehensive analytics and student progress monitoring
- 💳 **Secure Payment Integration** - Stripe-powered payments with webhook automation
- 🔐 **Zero-Trust Security** - Protected PDFs, encrypted storage, role-based access control
- ⚡ **Production Optimized** - Rate limiting, caching, and security hardening with Arcjet

---

## 🎯 Features

### 🎥 Advanced Video Player (Production-Ready)

Our custom-built video player is optimized for speed, security, and user experience:

#### ⚡ Performance Optimizations
- **Instant Load** - `preload="metadata"` loads only video metadata (~few KB instead of full video)
- **HTTP 206 Range Requests** - Partial content streaming for efficient bandwidth usage and instant seeking
- **Lazy Loading** - Videos load on-demand, not on page load
- **Smooth Playback** - Minimal buffering with adaptive streaming
- **Mobile Optimized** - `playsInline` for seamless iOS/Android experience

#### 🔒 Content Protection Features
- **Download Prevention** - Hidden download button with `controlsList="nodownload"`
- **Right-Click Disabled** - Context menu completely blocked on videos
- **DevTools Detection** - Real-time monitoring and warnings when users try to inspect
- **Keyboard Shortcuts Blocked** - F12, Ctrl+Shift+I/J/C, Cmd+Option+I/J/C all prevented
- **Legal Warning Toasts** - Automatic warnings about copyright and legal consequences
- **Smart Cooldown System** - Non-intrusive 10-second cooldown between warnings
- **Presigned URLs** - Temporary access with auto-expiring links from Tigris.dev S3

#### 📺 UX Features
- **Picture-in-Picture Support** - Enhanced multitasking capability
- **Responsive Design** - Works perfectly on any screen size
- **Custom Poster Images** - Beautiful thumbnails before playback
- **Playback Speed Control** - Allow users to speed up/slow down content
- **Clean Interface** - Professional video player with shadow effects

### 👨‍🎓 For Students

- **📚 Course Catalog** - Browse courses with rich previews, ratings, and detailed descriptions
- **🎥 HD Video Lessons** - Smooth, protected video playback with instant load and no buffering
- **📄 Secure PDF Materials** - Custom PDF.js viewer with zero-download protection
- **📈 Progress Dashboard** - Visual progress tracking with percentage indicators and charts
- **📱 Mobile Learning** - Native app-like experience on all mobile devices
- **🏆 Completion Certificates** - Earn certificates with confetti celebrations
- **💰 One-Click Checkout** - Stripe-powered secure payment with saved cards
- **🔔 Real-Time Notifications** - Toast notifications for important updates
- **🎯 Personalized Feed** - AI-powered course recommendations (coming soon)

### 👨‍🏫 For Instructors/Admins

#### Course Management
- **📝 Full CRUD Operations** - Create, edit, reorder, and delete courses/chapters/lessons
- **🖼️ Media Upload** - Drag-and-drop video and image uploads to Tigris S3
- **📊 Rich Analytics Dashboard** - Track enrollments, completions, and revenue
- **📁 Material Library** - Organize PDFs, videos, and documents per course
- **👥 Student Management** - View enrollments, track progress, manage access
- **🎨 Rich Text Editor** - TipTap-powered WYSIWYG editor with text alignment
- **🔄 Drag-and-Drop Reordering** - @dnd-kit integration for easy content organization
- **👁️ Visibility Controls** - Show/hide materials and lessons individually
- **💵 Revenue Analytics** - Real-time sales tracking and financial reports

#### Admin Features
- **🔐 Role-Based Access Control** - Separate admin and student interfaces with permissions
- **🎓 University Management** - Multi-tenant support for educational institutions
- **👤 User Management** - Comprehensive user administration and access control
- **📊 Dashboard Statistics** - Real-time stats on courses, students, and revenue
- **🔍 Advanced Filtering** - Search and filter courses, students, and materials
- **📈 Enrollment Statistics** - Track enrollments over time with interactive charts
- **⚙️ System Configuration** - Platform settings and customization options

### 🔒 Enterprise Security Features

#### Video Protection
- **DevTools Detection** - Monitors window size changes to detect inspector opening
- **Keyboard Blocking** - Prevents all common DevTools shortcuts (F12, Ctrl+Shift+I, etc.)
- **Right-Click Prevention** - Blocks context menu on video elements
- **Legal Warnings** - Automatic toast notifications about copyright violations
- **Download Button Hidden** - Native browser download option removed from controls
- **Presigned URL Expiry** - Video URLs expire automatically for time-limited access
- **No Screen Recording Hints** - Discourages unauthorized recording attempts

#### PDF Protection
- **Canvas-Based Rendering** - PDFs rendered on HTML5 canvas, not native viewer
- **Zero Download/Print/Copy** - All native browser actions completely disabled
- **Custom Controls** - Zoom, rotate, pagination without exposing file
- **Keyboard Protection** - Ctrl+S, Ctrl+P, Ctrl+C, F12 completely blocked
- **Presigned URLs** - Temporary 1-hour access links that auto-expire
- **Sandboxed Iframe** - Additional layer of protection for PDF display

#### Platform Security
- **Rate Limiting** - Arcjet-powered API rate limiting to prevent abuse
- **CSRF Protection** - Built-in Next.js CSRF token validation
- **SQL Injection Prevention** - Prisma ORM parameterized queries
- **XSS Protection** - React's built-in XSS prevention + CSP headers
- **Authentication** - Better-auth secure authentication with session management
- **Payment Security** - PCI-compliant Stripe integration with webhook verification
- **S3 Presigned URLs** - Secure temporary access to protected files
- **Environment Validation** - Zod-powered environment variable validation

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 15.3](https://nextjs.org/) - React framework with App Router & Turbopack
- **UI Library**: [React 19](https://react.dev/) - Latest React with Server Components & Actions
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS with PostCSS
- **Components**: [shadcn/ui](https://ui.shadcn.com/) - Accessible, customizable component library
- **Icons**: [Lucide React](https://lucide.dev/) + [Tabler Icons](https://tabler-icons.io/)
- **Animations**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) - Celebration effects
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Type-safe form validation
- **PDF Rendering**: [PDF.js](https://mozilla.github.io/pdf.js/) - Custom secure PDF viewer with canvas
- **Rich Text**: [TipTap](https://tiptap.dev/) - Headless WYSIWYG editor
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/) - Modern drag-and-drop toolkit
- **Toast Notifications**: [Sonner](https://sonner.emilkowal.ski/) - Beautiful toast notifications
- **File Upload**: [React Dropzone](https://react-dropzone.js.org/) - Drag-and-drop file uploads

### Backend
- **Database ORM**: [Prisma 6.8](https://www.prisma.io/) - Next-generation TypeScript ORM
- **Database**: PostgreSQL - Reliable, scalable relational database
- **Authentication**: [Better Auth 1.2](https://www.better-auth.com/) - Modern authentication for Next.js
- **File Storage**: [Tigris.dev S3](https://www.tigrisdata.com/) - S3-compatible object storage with global CDN
- **Payments**: [Stripe](https://stripe.com/) - Complete payment infrastructure with webhooks
- **Email**: [Resend](https://resend.com/) - Modern email API for transactional emails
- **Rate Limiting**: [Arcjet](https://arcjet.com/) - Security as code with rate limiting & bot detection
- **API Routes**: Next.js API Routes - Serverless API endpoints

### Developer Experience
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) - Type-safe development
- **Package Manager**: [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- **Code Quality**: ESLint - Consistent code style and best practices
- **Build Tool**: [Turbopack](https://turbo.build/pack) - Ultra-fast incremental bundler
- **Environment Validation**: [@t3-oss/env-nextjs](https://env.t3.gg/) - Type-safe environment variables
- **Version Control**: Git - Industry-standard VCS
- **Deployment**: Optimized for [Vercel](https://vercel.com/) - Instant global deployment

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

| Requirement | Version | Purpose |
|------------|---------|---------|
| **Node.js** | ≥ 18.17 | Runtime environment |
| **pnpm** | Latest | Package manager (recommended) |
| **PostgreSQL** | ≥ 14 | Database |
| **Tigris.dev Account** | - | S3-compatible file storage |
| **Better Auth Setup** | - | User authentication |
| **Stripe Account** | - | Payment processing |
| **Resend Account** | - | Email service |

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Dweirii/LMS-Al-Hamzeh.git
cd LMS-Al-Hamzeh
```

#### 2️⃣ Install Dependencies

```bash
pnpm install
```

#### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
# ================================
# DATABASE
# ================================
DATABASE_URL="postgresql://user:password@localhost:5432/lms_alhamzeh"

# ================================
# BETTER AUTH
# ================================
BETTER_AUTH_SECRET="your-secret-key-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"

# ================================
# TIGRIS S3 (File Storage)
# ================================
NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES="your-bucket-name"
AWS_ACCESS_KEY_ID="your-tigris-access-key"
AWS_SECRET_ACCESS_KEY="your-tigris-secret-key"
AWS_ENDPOINT_URL_S3="https://fly.storage.tigris.dev"

# ================================
# STRIPE (Payments)
# ================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"
STRIPE_SECRET_KEY="sk_test_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"

# ================================
# RESEND (Email Service)
# ================================
RESEND_API_KEY="re_xxxxx"

# ================================
# ARCJET (Security & Rate Limiting)
# ================================
ARCJET_KEY="your-arcjet-key"

# ================================
# APP CONFIGURATION
# ================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

#### 4️⃣ Set Up Database

```bash
# Generate Prisma Client
pnpm prisma generate

# Push schema to database (for development)
pnpm prisma db push

# OR run migrations (for production)
pnpm prisma migrate deploy

# (Optional) Open Prisma Studio to view your data
pnpm prisma studio
```

#### 5️⃣ Seed Database (Optional)

```bash
# Create sample data for testing
pnpm tsx scripts/seed.ts
```

#### 6️⃣ Run Development Server

```bash
pnpm dev
```

#### 7️⃣ Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

### 🎉 You're Ready!

Your LMS is now running locally. You can:
- Create an admin account
- Add courses and lessons
- Upload videos and PDFs
- Test the payment flow
- Explore the admin dashboard

---

## 📂 Project Structure

```
lms-al-hamzeh/
├── app/                              # Next.js App Router (Routes & Pages)
│   ├── (auth)/                       # Authentication routes
│   │   ├── login/                    # Login page with Better Auth
│   │   └── verify-request/           # Email verification page
│   ├── (public)/                     # Public-facing routes
│   │   ├── courses/                  # Course catalog and details
│   │   │   ├── [slug]/               # Individual course page
│   │   │   └── page.tsx              # Course listing
│   │   └── layout.tsx                # Public layout with navbar
│   ├── dashboard/                    # Student dashboard
│   │   ├── [slug]/                   # Course viewer
│   │   │   ├── [lessonId]/           # Individual lesson with video
│   │   │   │   └── _components/
│   │   │   │       └── CourseContent.tsx  # Optimized video player
│   │   │   ├── materials/            # Course materials (PDFs)
│   │   │   └── layout.tsx            # Course sidebar layout
│   │   ├── page.tsx                  # Dashboard home
│   │   └── _components/              # Dashboard components
│   ├── admin/                        # Admin dashboard
│   │   ├── courses/                  # Course management
│   │   │   ├── [courseId]/           # Edit course
│   │   │   │   ├── [chapterId]/      # Edit chapter
│   │   │   │   ├── edit/             # Course editor
│   │   │   │   └── delete/           # Delete course
│   │   │   ├── create/               # Create new course
│   │   │   └── page.tsx              # Course list
│   │   ├── instructors/              # Instructor management
│   │   ├── materials/                # Material library
│   │   ├── students/                 # Student management
│   │   ├── universities/             # University management
│   │   ├── user-management/          # User administration
│   │   ├── page.tsx                  # Admin dashboard home
│   │   └── layout.tsx                # Admin layout with sidebar
│   ├── api/                          # API Routes
│   │   ├── auth/[...all]/            # Better Auth API routes
│   │   ├── courses/[courseId]/       # Course API endpoints
│   │   ├── materials/                # Material CRUD operations
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts          # GET/PATCH/DELETE material
│   │   │   │   ├── view/route.ts     # Generate presigned view URL
│   │   │   │   └── visibility/route.ts # Toggle visibility
│   │   │   ├── route.ts              # POST new material
│   │   │   └── upload/route.ts       # File upload handler
│   │   ├── s3/                       # S3 file operations
│   │   │   ├── upload/route.ts       # Generate presigned upload URL
│   │   │   └── delete/route.ts       # Delete from S3
│   │   └── webhook/stripe/route.ts   # Stripe webhook handler
│   ├── data/                         # Server-side data fetching
│   │   ├── admin/                    # Admin data queries
│   │   │   ├── admin-get-courses.ts  # Fetch all courses (admin)
│   │   │   ├── admin-get-dashboard-stats.ts
│   │   │   └── require-admin.ts      # Admin authorization
│   │   ├── course/                   # Course data queries
│   │   │   ├── get-all-courses.ts    # Public course listing
│   │   │   ├── get-course.ts         # Single course details
│   │   │   ├── get-lesson-content.ts # Lesson with video/content
│   │   │   └── get-course-sidebar-data.ts
│   │   └── user/                     # User data queries
│   │       ├── get-enrolled-courses.ts
│   │       ├── require-user.ts       # User authorization
│   │       └── user-is-enrolled.ts   # Check enrollment
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Global styles
│   └── not-admin/page.tsx            # Access denied page
│
├── components/                       # Reusable React components
│   ├── ui/                           # shadcn/ui components
│   │   ├── SecurePDFViewer.tsx       # Protected PDF viewer
│   │   ├── button.tsx                # Button component
│   │   ├── card.tsx                  # Card component
│   │   ├── form.tsx                  # Form components
│   │   ├── table.tsx                 # Table component
│   │   └── ...                       # 30+ UI components
│   ├── sidebar/                      # Navigation components
│   │   ├── app-sidebar.tsx           # Main sidebar
│   │   ├── nav-main.tsx              # Main navigation
│   │   └── ...
│   ├── rich-text-editor/             # TipTap editor
│   │   ├── Editor.tsx                # WYSIWYG editor
│   │   ├── Menubar.tsx               # Editor toolbar
│   │   └── RenderDescription.tsx     # Render HTML content
│   ├── file-uploader/                # File upload components
│   │   ├── Uploader.tsx              # Drag-and-drop uploader
│   │   └── RenderState.tsx           # Upload states
│   └── general/
│       └── EmptyState.tsx            # Empty state component
│
├── lib/                              # Utility libraries & configurations
│   ├── db.ts                         # Prisma client instance
│   ├── auth.ts                       # Better Auth configuration
│   ├── auth-client.ts                # Better Auth client
│   ├── S3Client.ts                   # Tigris S3 client setup
│   ├── stripe.ts                     # Stripe client configuration
│   ├── resend.ts                     # Resend email client
│   ├── arcjet.ts                     # Arcjet rate limiting setup
│   ├── env.ts                        # Environment variable validation
│   ├── utils.ts                      # Utility functions (cn, etc.)
│   ├── types.ts                      # Shared TypeScript types
│   ├── zodSchemas.ts                 # Zod validation schemas
│   └── generated/prisma/             # Generated Prisma types
│
├── hooks/                            # Custom React hooks
│   ├── use-construct-url.ts          # Build Tigris S3 URLs
│   ├── use-confetti.ts               # Confetti animation hook
│   ├── use-course-progress.ts        # Track course completion
│   ├── use-mobile.ts                 # Detect mobile devices
│   ├── try-catch.ts                  # Error handling wrapper
│   └── use-singout.ts                # Sign out functionality
│
├── prisma/                           # Database schema & migrations
│   └── schema.prisma                 # Prisma schema definition
│
├── scripts/                          # Utility scripts
│   ├── cleanup-enrollments.ts        # Clean orphaned enrollments
│   └── cleanup-orphans.ts            # Database cleanup
│
├── public/                           # Static assets
│   ├── logo.png                      # Platform logo
│   ├── logo1.png                     # Alternative logo
│   └── pdf.worker.min.js             # PDF.js worker
│
├── .env                              # Environment variables (gitignored)
├── .env.example                      # Environment template
├── components.json                   # shadcn/ui configuration
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies & scripts
├── pnpm-lock.yaml                    # Lock file
└── README.md                         # This file
```

---

## 💾 Database Schema

### Core Models Overview

Our database is designed for scalability, performance, and data integrity:

```prisma
// Course hierarchy
model Course {
  id          String      @id @default(uuid())
  title       String
  slug        String      @unique
  description String?     @db.Text
  price       Float       @default(0)
  imageKey    String?
  published   Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  chapters    Chapter[]
  materials   Material[]
  enrollments Enrollment[]
  instructor  Instructor? @relation(fields: [instructorId], references: [id])
  instructorId String?
}

model Chapter {
  id          String   @id @default(uuid())
  title       String
  position    Int
  published   Boolean  @default(false)
  
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  courseId    String
  lessons     Lesson[]
}

model Lesson {
  id          String   @id @default(uuid())
  title       String
  description String?  @db.Text
  videoKey    String?
  thumbnailKey String?
  position    Int
  published   Boolean  @default(false)
  
  chapter     Chapter  @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  chapterId   String
  progress    LessonProgress[]
}

// User progress tracking
model LessonProgress {
  id          String   @id @default(uuid())
  userId      String
  completed   Boolean  @default(false)
  completedAt DateTime?
  
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  lessonId    String
  
  @@unique([userId, lessonId])
}

// Enrollment & Materials
model Enrollment {
  id        String   @id @default(uuid())
  userId    String
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  courseId  String
  createdAt DateTime @default(now())
  
  @@unique([userId, courseId])
}

model Material {
  id        String   @id @default(uuid())
  title     String
  fileKey   String
  isVisible Boolean  @default(true)
  createdAt DateTime @default(now())
  
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  courseId  String
}
```

### Key Relationships

- **Course** → has many → **Chapters** → has many → **Lessons**
- **User** → has many → **Enrollments** → references → **Course**
- **User** → has many → **LessonProgress** → tracks → **Lesson** completion
- **Course** → has many → **Materials** (PDFs, documents)
- **Course** → belongs to → **Instructor** (admin user)

### Database Features

- ✅ Cascading deletes for data integrity
- ✅ Unique constraints to prevent duplicates
- ✅ Indexes for optimized queries
- ✅ Timestamps for audit trails
- ✅ UUID primary keys for security
- ✅ Relation mode for MySQL/PostgreSQL compatibility

[📖 View Full Schema](prisma/schema.prisma)

---

## 🎨 Key Features Breakdown

### 🎥 Production-Ready Video Player

Our video player is built for **speed, security, and user experience**:

```tsx
// Optimized video player with all protections
<video
  preload="metadata"                  // 🚀 Instant load
  controlsList="nodownload"           // 🔒 Hide download button
  onContextMenu={(e) => e.preventDefault()}  // 🔒 Block right-click
  playsInline                         // 📱 Mobile-friendly
  poster={thumbnailUrl}               // 🎨 Beautiful thumbnail
/>
```

**Technical Highlights:**
- **HTTP 206 Range Requests** supported by Tigris S3 for partial streaming
- **Metadata-only preload** loads ~10KB instead of full video
- **DevTools detection** with size change monitoring every 1 second
- **Keyboard shortcut prevention** for F12, Ctrl+Shift+I/J/C, Cmd+Option+I/J/C
- **Smart warning system** with 10-second cooldown to prevent spam
- **Legal toast notifications** warning about copyright violations

### 🔐 Secure PDF Viewer

Enterprise-grade document security with our custom PDF.js implementation:

```tsx
<SecurePDFViewer 
  pdfUrl={presignedUrl} 
  title="Course Material"
/>
```

**Protection Features:**
- **Canvas-based rendering** - No native browser PDF viewer
- **Disabled right-click, copy, print, download** - All blocked
- **Keyboard protection** - Ctrl+S, Ctrl+P, Ctrl+C, F12 prevented
- **Presigned URLs** - Expire after 1 hour automatically
- **Custom zoom & rotate** - Full control without browser toolbar
- **Sandboxed iframe** - Additional security layer
- **No DevTools access** - Video-like protection warnings

### 📱 Mobile-First Responsive Design

Perfect experience across all devices:

| Device Type | Breakpoint | Features |
|------------|-----------|----------|
| **Mobile** | < 640px | Touch-optimized, drawer navigation, stacked layout |
| **Tablet** | 640px - 1024px | Adaptive sidebars, optimized spacing |
| **Desktop** | ≥ 1024px | Full sidebars, multi-column layouts |
| **4K/Large** | ≥ 1536px | Enhanced spacing, larger content areas |

**Features:**
- Touch-optimized button sizes (min 44x44px)
- Swipe gestures for navigation
- Responsive typography (clamp scaling)
- Mobile-first CSS architecture
- Drawer menus on small screens
- Collapsible sidebars on tablets

### 📊 Progress Tracking & Analytics

Comprehensive learning analytics for students and admins:

**For Students:**
- Per-lesson completion tracking
- Course progress percentage
- Visual progress bars and badges
- Confetti celebration on completion
- Persistent state across devices

**For Admins:**
- Real-time enrollment statistics
- Course completion rates
- Revenue analytics with charts
- Student engagement metrics
- Time-series data with Recharts

### 💳 Stripe Payment Integration

Secure, PCI-compliant payment processing:

```typescript
// Automatic enrollment on successful payment
stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: { name: course.title },
      unit_amount: course.price * 100,
    },
    quantity: 1,
  }],
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
})
```

**Features:**
- One-click checkout with saved cards
- Webhook automation for enrollment
- Secure webhook signature verification
- Automatic invoice generation
- Refund support
- Multiple currency support (configurable)

---

## 🔧 Development

### Available Scripts

```bash
# 🚀 Development
pnpm dev              # Start dev server with Turbopack (ultra-fast)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint for code quality

# 💾 Database
pnpm prisma:generate  # Generate Prisma Client types
pnpm prisma:push      # Push schema to database (dev)
pnpm prisma:studio    # Open Prisma Studio (database GUI)
pnpm prisma:migrate   # Create and run migrations (prod)

# 🧹 Maintenance
pnpm tsx scripts/cleanup-enrollments.ts  # Clean orphaned enrollments
pnpm tsx scripts/cleanup-orphans.ts      # Clean orphaned records
```

### Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in all required environment variables
3. Ensure database is running
4. Run `pnpm prisma:push` to sync schema

### Database Migrations

```bash
# Development: Push schema changes directly
pnpm prisma db push

# Production: Create and apply migrations
pnpm prisma migrate dev --name describe_your_change
pnpm prisma migrate deploy
```

### Adding New Features

1. **Create database model** in `prisma/schema.prisma`
2. **Generate Prisma Client**: `pnpm prisma:generate`
3. **Create API route** in `app/api/`
4. **Add server action** or data fetch function in `app/data/`
5. **Build UI components** in `components/`
6. **Create page** in `app/`

---

## 🌐 Deployment

### Recommended: Vercel (Zero-Config)

Vercel is the optimal deployment platform for Next.js applications:

#### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dweirii/LMS-Al-Hamzeh)

#### Manual Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env` file
   - Separate environments for Production, Preview, Development

4. **Configure Build Settings**
   ```
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   Node Version: 18.x or higher
   ```

5. **Set Up Webhooks**
   - Copy your Vercel production URL
   - Add Stripe webhook: `https://your-domain.vercel.app/api/webhook/stripe`
   - Update `STRIPE_WEBHOOK_SECRET` in environment variables

6. **Deploy!**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your LMS is live in ~2 minutes 🚀

#### Post-Deployment Checklist

- [ ] Verify database connection works
- [ ] Test file uploads to Tigris S3
- [ ] Confirm authentication flow
- [ ] Test Stripe payment (use test mode)
- [ ] Verify webhook receives events
- [ ] Check video playback works
- [ ] Test PDF viewer security
- [ ] Verify email sending (Resend)
- [ ] Test admin access control
- [ ] Check mobile responsiveness

### Alternative Platforms

#### **Railway** (Database + Hosting)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Pros:** Includes PostgreSQL, easy environment management
**Best for:** All-in-one hosting with database

#### **AWS Amplify** (Full-Stack)

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize and deploy
amplify init
amplify add hosting
amplify publish
```

**Pros:** AWS ecosystem integration, CDN included
**Best for:** AWS-native deployments

#### **DigitalOcean App Platform**

1. Connect GitHub repository
2. Auto-detect Next.js
3. Add PostgreSQL database
4. Deploy

**Pros:** Simple pricing, managed PostgreSQL
**Best for:** Full control with simplicity

#### **Self-Hosted (Docker)**

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Best for:** Complete control, on-premise deployments

---

## 📚 Documentation

### 📖 User Guides

- [**Student Guide**](docs/student-guide.md) - How to enroll, watch lessons, track progress
- [**Instructor Guide**](docs/instructor-guide.md) - Creating courses, uploading materials
- [**Admin Guide**](docs/admin-guide.md) - Platform administration, user management

### 💻 Developer Guides

- [**API Reference**](docs/api-reference.md) - Complete API documentation
- [**Component Library**](docs/components.md) - UI component usage and props
- [**Database Schema**](docs/database.md) - Models, relationships, queries
- [**Security Best Practices**](docs/security.md) - Security guidelines and checklist
- [**Deployment Guide**](docs/deployment.md) - Production deployment steps
- [**Environment Variables**](docs/environment.md) - Complete env var reference

### 🎯 Feature Guides

- [**Video Player Setup**](docs/video-player.md) - Configure and optimize video streaming
- [**PDF Protection**](docs/pdf-protection.md) - Implement secure document viewing
- [**Stripe Integration**](docs/stripe-integration.md) - Payment setup and webhooks
- [**S3 File Upload**](docs/file-upload.md) - Tigris S3 upload configuration

---

## 🤝 Contributing

We welcome contributions from the community! Here's how to get involved:

### How to Contribute

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   git clone https://github.com/YOUR-USERNAME/LMS-Al-Hamzeh.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Commit your changes**
   ```bash
   git commit -m 'feat: Add amazing feature'
   ```
   
   **Commit Message Format:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/AmazingFeature
   ```

6. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Describe your changes in detail

### Code Style Guidelines

- **TypeScript**: Use strict typing, avoid `any`
- **React**: Functional components with hooks
- **Naming**: 
  - Components: PascalCase (`UserProfile.tsx`)
  - Utilities: camelCase (`formatDate.ts`)
  - Constants: UPPER_SNAKE_CASE
- **Formatting**: Let ESLint handle formatting
- **Comments**: Document complex logic and functions

### What to Contribute

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ♿ Accessibility improvements
- 🌐 Translations/i18n
- ⚡ Performance optimizations
- 🧪 Tests

---

## 🐛 Bug Reports & Feature Requests

### Reporting Bugs

Found a bug? Help us improve by reporting it:

**[Create Bug Report](https://github.com/Dweirii/LMS-Al-Hamzeh/issues/new?labels=bug)**

Include:
- ✅ Clear description of the problem
- ✅ Steps to reproduce
- ✅ Expected vs actual behavior
- ✅ Screenshots or videos (if applicable)
- ✅ Environment details:
  - OS (Windows, macOS, Linux)
  - Browser (Chrome, Firefox, Safari)
  - Node.js version (`node -v`)
  - Package manager version (`pnpm -v`)

### Requesting Features

Have an idea? We'd love to hear it:

**[Request Feature](https://github.com/Dweirii/LMS-Al-Hamzeh/issues/new?labels=enhancement)**

Include:
- 🎯 What problem does it solve?
- 💡 Describe your proposed solution
- 🔄 Alternative solutions considered
- 📸 Mockups or examples (optional)

---

## 📊 Project Stats

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/Dweirii/LMS-Al-Hamzeh?style=social)
![GitHub forks](https://img.shields.io/github/forks/Dweirii/LMS-Al-Hamzeh?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/Dweirii/LMS-Al-Hamzeh?style=social)

![GitHub issues](https://img.shields.io/github/issues/Dweirii/LMS-Al-Hamzeh)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Dweirii/LMS-Al-Hamzeh)
![GitHub license](https://img.shields.io/github/license/Dweirii/LMS-Al-Hamzeh)
![GitHub last commit](https://img.shields.io/github/last-commit/Dweirii/LMS-Al-Hamzeh)

</div>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Zaid Dweiri

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Author

<div align="center">

**Zaid Dweiri**

Full-Stack Developer | LMS Architect | Open Source Enthusiast

[![GitHub](https://img.shields.io/badge/GitHub-Dweirii-181717?style=for-the-badge&logo=github)](https://github.com/Dweirii)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/zaiddweiri)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-FF5722?style=for-the-badge&logo=google-chrome)](https://zaiddweiri.com)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail)](mailto:zaid@example.com)

</div>

---

## 🙏 Acknowledgments

Special thanks to the amazing open-source community and these incredible projects:

### Core Technologies
- **[Next.js](https://nextjs.org/)** - The React framework that makes this possible
- **[Vercel](https://vercel.com/)** - Best-in-class hosting and deployment
- **[Prisma](https://www.prisma.io/)** - Modern database toolkit

### UI/UX
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible components
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide Icons](https://lucide.dev/)** - Consistent, beautiful icons
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives

### Backend Services
- **[Better Auth](https://www.better-auth.com/)** - Modern authentication
- **[Tigris](https://www.tigrisdata.com/)** - S3-compatible object storage
- **[Stripe](https://stripe.com/)** - Payment infrastructure
- **[Resend](https://resend.com/)** - Email API
- **[Arcjet](https://arcjet.com/)** - Security and rate limiting

### Developer Tools
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[pnpm](https://pnpm.io/)** - Fast package manager
- **[ESLint](https://eslint.org/)** - Code quality

### Content Security
- **[PDF.js](https://mozilla.github.io/pdf.js/)** - PDF rendering
- **[TipTap](https://tiptap.dev/)** - Rich text editor

### Community
- All contributors who have helped improve this project
- The Next.js community for excellent discussions and solutions
- Stack Overflow community for problem-solving assistance

---

## 🌟 Show Your Support

If you find this project helpful, please consider:

- ⭐ **Star this repository** - It helps others discover the project
- 🐦 **Share on Twitter** - Spread the word
- 📝 **Write a blog post** - Share your experience
- 💬 **Join discussions** - Help others in Issues/Discussions
- 🤝 **Contribute** - Submit PRs and improvements
- ☕ **Buy me a coffee** - Support development (link in profile)

---

## 🗺️ Roadmap

### 🚀 Coming Soon (Q1 2025)

- [ ] **AI-Powered Course Recommendations** - Personalized learning paths
- [ ] **Live Class Integration** - Zoom/Meet integration for live sessions
- [ ] **Mobile Apps** - React Native iOS/Android apps
- [ ] **Gamification** - Badges, leaderboards, achievements
- [ ] **Discussion Forums** - Student-to-student communication
- [ ] **Quiz Builder** - Create and grade assessments
- [ ] **Certificate Generator** - Automated certificate creation
- [ ] **Multi-Language Support** - i18n for global reach

### 🔮 Future Plans (Q2-Q3 2025)

- [ ] **White-Label Solution** - Customizable branding
- [ ] **Learning Analytics Dashboard** - Advanced reporting
- [ ] **Assignment Submission** - File upload and grading
- [ ] **Video Conferencing** - Built-in video calls
- [ ] **Offline Mode** - Progressive Web App (PWA)
- [ ] **API Documentation** - Swagger/OpenAPI
- [ ] **Integrations** - Canvas, Moodle, Google Classroom
- [ ] **Advanced DRM** - Enhanced video protection

**Have a feature request?** [Open an issue](https://github.com/Dweirii/LMS-Al-Hamzeh/issues)!

---

## 📞 Support

Need help? We're here for you:

### 💬 Community Support

- **GitHub Discussions** - Ask questions, share ideas
- **GitHub Issues** - Report bugs, request features
- **Discord Community** - Real-time chat (coming soon)

### 📧 Direct Support

For urgent issues or enterprise inquiries:
- **Email**: [support@alhamzeh-lms.com](mailto:support@alhamzeh-lms.com)
- **Response Time**: 24-48 hours

### 📚 Documentation

- Comprehensive docs available in `/docs` folder
- Video tutorials (coming soon)
- Blog posts and guides (coming soon)

---

<div align="center">

## 🎉 Thank You for Using Al-Hamzeh LMS!

### ⭐ Star this repository if you find it helpful!

**Built with ❤️ by [Zaid Dweiri](https://github.com/Dweirii)**

[🐛 Report Bug](https://github.com/Dweirii/LMS-Al-Hamzeh/issues) • 
[✨ Request Feature](https://github.com/Dweirii/LMS-Al-Hamzeh/issues) • 
[📖 Documentation](https://github.com/Dweirii/LMS-Al-Hamzeh/wiki) • 
[💬 Discussions](https://github.com/Dweirii/LMS-Al-Hamzeh/discussions)

---

**© 2025 Al-Hamzeh LMS. All rights reserved.**

</div>
