# 🎓 Al-Hamzeh LMS Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**A modern, full-featured Learning Management System built with cutting-edge technologies**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [License](#-license)

</div>

---

## 📖 Overview

Al-Hamzeh LMS is a production-ready, enterprise-grade Learning Management System designed to deliver exceptional online learning experiences. Built with Next.js 15 and React 19, it offers a seamless, responsive interface for both students and instructors.

### ✨ Why Al-Hamzeh LMS?

- 🚀 **Blazing Fast** - Powered by Next.js 15 App Router with React Server Components
- 🔒 **Secure by Design** - Protected PDF viewing, enrollment verification, and role-based access
- 📱 **Mobile First** - Fully responsive with optimized mobile experiences
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS v4 and shadcn/ui components
- 📊 **Progress Tracking** - Comprehensive student progress monitoring
- 💳 **Payment Integration** - Stripe integration for course purchases
- 🎥 **Rich Media** - Support for video lessons and protected PDF materials

---

## 🎯 Features

### 👨‍🎓 For Students

- **📚 Course Catalog** - Browse and enroll in courses with detailed previews
- **🎥 Video Lessons** - High-quality video playback with progress tracking
- **📄 Protected Materials** - Secure PDF viewer with no download/copy/print
- **📈 Progress Dashboard** - Track your learning journey with visual progress indicators
- **📱 Mobile Learning** - Optimized experience on all devices
- **🏆 Completion Certificates** - Earn certificates upon course completion
- **💰 Secure Payments** - Easy course purchase with Stripe

### 👨‍🏫 For Instructors/Admins

- **📝 Course Management** - Create and manage courses, chapters, and lessons
- **📊 Analytics Dashboard** - Track student progress and engagement
- **📁 Material Upload** - Upload and manage course materials (PDFs, videos)
- **👥 Student Management** - Monitor enrollments and completions
- **💵 Revenue Tracking** - View sales and earnings analytics
- **🎨 Rich Text Editor** - Create engaging lesson descriptions
- **🔐 Access Control** - Manage visibility and permissions

### 🔒 Security Features

- **PDF Protection** - Custom PDF.js viewer preventing downloads and screenshots
- **Enrollment Verification** - Course content gated by enrollment status
- **Secure Storage** - AWS S3 integration with presigned URLs
- **Authentication** - Clerk-based user authentication and management
- **Role-Based Access** - Separate admin and student interfaces
- **Payment Security** - PCI-compliant payment processing via Stripe

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) - React framework with App Router
- **UI Library**: [React 19](https://react.dev/) - Latest React with Server Components
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- **Components**: [shadcn/ui](https://ui.shadcn.com/) - Re-usable component library
- **Icons**: [Lucide React](https://lucide.dev/) & [Tabler Icons](https://tabler-icons.io/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Production-ready animations
- **Forms**: [React Hook Form](https://react-hook-form.com/) - Performant form validation
- **PDF Rendering**: [PDF.js](https://mozilla.github.io/pdf.js/) - Custom secure PDF viewer

### Backend
- **Database ORM**: [Prisma](https://www.prisma.io/) - Next-generation ORM
- **Database**: PostgreSQL - Reliable relational database
- **Authentication**: [Clerk](https://clerk.com/) - Complete user management
- **File Storage**: AWS S3 - Scalable object storage
- **Payments**: [Stripe](https://stripe.com/) - Complete payment infrastructure

### Developer Experience
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- **Package Manager**: pnpm - Fast, disk space efficient
- **Code Quality**: ESLint + Prettier - Consistent code style
- **Version Control**: Git - Industry-standard VCS

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.17 or later
- **pnpm** (recommended) or npm
- **PostgreSQL** database
- **AWS S3** bucket for file storage
- **Clerk** account for authentication
- **Stripe** account for payments

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zaiddweiri/lms-al-hamzeh.git
   cd lms-al-hamzeh
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/lms"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # AWS S3
   NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES=your-bucket-name
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your-region

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
lms-al-hamzeh/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes
│   │   └── courses/              # Course catalog and details
│   ├── dashboard/                # Student dashboard
│   │   └── [slug]/               # Course viewer with lessons
│   ├── admin/                    # Admin dashboard
│   │   ├── courses/              # Course management
│   │   └── materials/            # Material management
│   ├── api/                      # API routes
│   │   ├── materials/            # Material endpoints
│   │   ├── courses/              # Course endpoints
│   │   └── webhooks/             # Stripe webhooks
│   └── data/                     # Server-side data fetching
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   │   └── SecurePDFViewer.tsx   # Custom PDF viewer
│   ├── sidebar/                  # Navigation components
│   └── rich-text-editor/         # Content editor
├── lib/                          # Utility libraries
│   ├── db.ts                     # Prisma client
│   ├── S3Client.ts               # AWS S3 configuration
│   └── stripe.ts                 # Stripe configuration
├── prisma/                       # Database schema
│   └── schema.prisma             # Prisma schema
├── public/                       # Static assets
├── hooks/                        # Custom React hooks
└── types/                        # TypeScript type definitions
```

---

## 💾 Database Schema

### Key Models

```prisma
model Course {
  id          String     @id @default(uuid())
  title       String
  description String?
  price       Float
  materials   Material[]
  chapters    Chapter[]
  enrollments Enrollment[]
}

model Material {
  id        String   @id @default(uuid())
  title     String
  fileKey   String
  isVisible Boolean  @default(true)
  course    Course   @relation(fields: [courseId], references: [id])
  courseId  String
}

model Enrollment {
  id       String   @id @default(uuid())
  userId   String
  course   Course   @relation(fields: [courseId], references: [id])
  courseId String
}
```

[View Full Schema](prisma/schema.prisma)

---

## 🎨 Key Features Breakdown

### 🔐 Secure PDF Viewer

Our custom PDF viewer built with PDF.js provides enterprise-grade document security:

- **Canvas Rendering** - PDFs rendered on HTML5 canvas, not native browser viewer
- **Disabled Actions** - Right-click, copy, print, and download completely disabled
- **Keyboard Protection** - Ctrl+S, Ctrl+P, Ctrl+C, F12, and DevTools blocked
- **Presigned URLs** - Temporary access links that expire after 1 hour
- **Custom Controls** - Zoom, rotate, and navigation without browser PDF toolbar

```typescript
// Example: Protected PDF viewer with full security
<SecurePDFViewer 
  pdfUrl={presignedUrl} 
  title="Course Material"
/>
```

### 📱 Mobile-First Design

Optimized for all devices with responsive layouts:

- **Breakpoints**: Mobile (< 640px), Tablet (≥ 640px), Desktop (≥ 1024px)
- **Touch Optimized** - Large touch targets and gesture support
- **Drawer Navigation** - Slide-out menu on mobile devices
- **Responsive Typography** - Scales appropriately across devices
- **Adaptive Components** - UI elements adjust to screen size

### 🎯 Progress Tracking

Comprehensive learning analytics:

- **Lesson Completion** - Track individual lesson progress
- **Course Progress** - Overall course completion percentage
- **Visual Indicators** - Progress bars and completion badges
- **Confetti Celebrations** - Reward students on completion
- **Persistent State** - Progress saved in real-time

---

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server

# Database
pnpm prisma:generate  # Generate Prisma Client
pnpm prisma:push      # Push schema to database
pnpm prisma:studio    # Open Prisma Studio
pnpm prisma:migrate   # Run migrations

# Code Quality
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm type-check   # Run TypeScript compiler
```

### Environment Setup

Create a `.env` file with all required variables. See `.env.example` for reference.

### Database Migrations

```bash
# Create a new migration
pnpm prisma migrate dev --name your_migration_name

# Apply migrations in production
pnpm prisma migrate deploy
```

---

## 🌐 Deployment

### Recommended Platform: Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables
   - Deploy!

3. **Configure Webhooks**
   - Add Stripe webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Update `STRIPE_WEBHOOK_SECRET` in environment variables

### Other Platforms

- **AWS Amplify** - Full-featured hosting
- **Netlify** - Easy deployment with forms
- **Railway** - Deploy with database included
- **DigitalOcean** - Full control with droplets

---

## 🎓 Documentation

### User Guides

- [Student Guide](docs/student-guide.md) - How to use the platform as a student
- [Instructor Guide](docs/instructor-guide.md) - Creating and managing courses
- [Admin Guide](docs/admin-guide.md) - Platform administration

### Developer Guides

- [API Reference](docs/api-reference.md) - Complete API documentation
- [Component Library](docs/components.md) - UI component usage
- [Database Schema](docs/database.md) - Database structure and relationships
- [Security Best Practices](docs/security.md) - Security guidelines

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Zaid Dweiri**

- GitHub: [@zaiddweiri](https://github.com/zaiddweiri)
- Email: zaid@example.com
- LinkedIn: [Zaid Dweiri](https://linkedin.com/in/zaiddweiri)

---

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) - Amazing React framework
- [Vercel](https://vercel.com/) - Hosting and deployment platform
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Prisma](https://www.prisma.io/) - Excellent database toolkit
- [Clerk](https://clerk.com/) - Authentication made simple

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/zaiddweiri/lms-al-hamzeh?style=social)
![GitHub forks](https://img.shields.io/github/forks/zaiddweiri/lms-al-hamzeh?style=social)
![GitHub issues](https://img.shields.io/github/issues/zaiddweiri/lms-al-hamzeh)
![GitHub pull requests](https://img.shields.io/github/issues-pr/zaiddweiri/lms-al-hamzeh)

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ by Zaid Dweiri**

[Report Bug](https://github.com/zaiddweiri/lms-al-hamzeh/issues) • [Request Feature](https://github.com/zaiddweiri/lms-al-hamzeh/issues)

</div>