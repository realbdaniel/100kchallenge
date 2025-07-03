# 🍄 100K Challenge - Break Free from 9-5!

A gamified public profile platform for builders and creators tracking their journey to their first $100k online. Built with Mario-style aesthetics and game mechanics to make building in public fun and engaging!

## ✨ Features

- 🔥 **Deep Work Streaks**: GitHub-style heatmap tracking daily 2+ hour deep work sessions
- 🐦 **X Integration**: Connect your X account, display your feed, and track daily posts
- 💰 **Revenue Battery**: Stripe integration showing progress to $100k with Mario-style power meter
- 🏰 **Project Castle**: Showcase your projects with screenshots and descriptions
- 🎮 **Gamification**: Level up system with XP, achievements, and Mario-themed rewards
- 👥 **Public Profiles**: Custom username URLs to share your builder journey
- ⚡ **Real-time Updates**: Live progress tracking and social features

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with Mario-themed custom components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Payments**: Stripe integration for revenue tracking
- **Social**: X (Twitter) API integration
- **Animations**: Framer Motion for Mario-style interactions
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth app credentials
- X (Twitter) API credentials (optional)
- Stripe account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/100k-challenge.git
   cd 100k-challenge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your credentials in `.env.local`

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/100k_challenge"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Twitter API v2 (Optional)
TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"
TWITTER_BEARER_TOKEN="your-twitter-bearer-token"

# Stripe (Optional)
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

## 🎮 How It Works

1. **Sign Up**: Create your account and choose a unique builder username
2. **Connect**: Link your X account (optional) and Stripe for revenue tracking
3. **Track**: Log your daily deep work sessions (aim for 2+ hours)
4. **Build**: Add and showcase your projects with descriptions and screenshots
5. **Share**: Get your public profile at `yoursite.com/u/yourusername`
6. **Level Up**: Earn XP and achievements as you progress toward $100k

## 🏗️ Project Structure

```
100k-challenge/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── u/                 # Public user profiles
│   ├── globals.css        # Global styles with Mario theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── features/         # Feature-specific components
├── lib/                  # Utility functions
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🎨 Mario Theme

The app uses a vibrant Mario-inspired design system:

- **Colors**: Classic Mario palette (red, blue, yellow, green, orange)
- **Typography**: Pixel-style fonts for headings
- **Animations**: Coin flips, power-ups, floating elements
- **Components**: Custom buttons, cards, and progress bars
- **Gamification**: XP points, level badges, achievement unlocks

## 🔧 Development

### Database Commands

```bash
# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Generate Prisma client
npm run db:generate
```

### Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

## 🎯 Roadmap

- [ ] **Mobile App**: React Native companion app
- [ ] **Team Challenges**: Group competitions and leaderboards
- [ ] **Mentor System**: Connect with experienced builders
- [ ] **Achievement System**: Unlock special rewards and badges
- [ ] **Analytics Dashboard**: Detailed insights and progress reports
- [ ] **API Access**: Public API for integrations
- [ ] **White Label**: Custom branding for organizations

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎊 Acknowledgments

- Inspired by the indie maker and builder community
- Mario franchise for the amazing game design inspiration
- All the developers building in public and sharing their journeys

---

**Ready to break free from the 9-5? Let's-a-go! 🍄** 