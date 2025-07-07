# QuirkyRoomie - Flatmate Complaint Management Platform

A full-stack web application that helps flatmates resolve everyday conflicts through complaint logging, voting, and resolution system with gamification elements.

## Features

- **User Authentication**: Register/login with flat codes to join your flatmate group
- **Complaint Management**: File complaints with categories (Noise, Cleanliness, Bills, Pets, Other) and severity levels
- **Voting System**: Upvote/downvote complaints to prioritize issues
- **Gamification**: Karma points system and monthly "Best Flatmate" recognition
- **Problem of the Week**: Most upvoted complaint becomes the weekly focus
- **Automated Punishments**: Fun punishment suggestions for highly upvoted complaints
- **Leaderboard**: Track karma rankings among flatmates
- **Statistics**: Visual insights into complaint patterns and resolution trends

## Tech Stack

- **Frontend**: React 18 + TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js + Express.js REST API
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query + React Context
- **Routing**: Wouter
- **Build Tool**: Vite

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or use Neon Database)

### Installation

1. Clone the repository:
```bash
git clone
cd quirky-roomie
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Deployment

### Free Hosting Options

#### Frontend (Vercel - Recommended)
1. Push code to GitHub
2. Connect Vercel to your GitHub repository
3. Deploy automatically with zero configuration

#### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set `DATABASE_URL` environment variable
3. Deploy with automatic builds

#### Database
- **Neon Database**: Free PostgreSQL with generous limits
- **Supabase**: PostgreSQL with additional features
- **Railway/Render**: Bundled database options

### Environment Variables
```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

## Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── lib/         # Utilities and API clients
│   │   └── hooks/       # Custom React hooks
├── server/          # Express backend
│   ├── routes.ts    # API route definitions
│   ├── storage.ts   # Data access layer
│   └── index.ts     # Server entry point
├── shared/          # Shared types and schemas
└── package.json     # Dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new flatmate
- `POST /api/auth/login` - Login and receive user data

### Complaints
- `GET /api/complaints` - List all complaints for flat
- `POST /api/complaints` - File new complaint
- `PUT /api/complaints/:id/resolve` - Mark complaint as resolved

### Voting
- `POST /api/complaints/:id/vote` - Upvote/downvote complaint

### Statistics
- `GET /api/leaderboard` - Get karma leaderboard
- `GET /api/stats` - Get complaint statistics

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT License - feel free to use this project for your own flatmate management needs!

## Demo

Try the live demo: [Coming Soon]

---

Built with ❤️ for better flatmate relationships
