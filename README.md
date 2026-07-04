# 📝 Notes App

A modern, AI-powered notes application built with Next.js that combines note management with intelligent chat and summarization features. Create, share, and interact with your notes using cutting-edge AI capabilities.

## ✨ Features

- **📌 Note Management**: Create, read, update, and delete notes with ease
- **🤖 AI Chat**: Chat with your notes using Google Gemini AI for intelligent conversations
- **✍️ Note Summarization**: Automatically summarize your notes using AI
- **📤 Share Notes**: Generate shareable links for your notes with unique identifiers
- **🎭 Mood Detection**: Automatically detect the mood/sentiment of your notes
- **🔍 Vector Search**: Powered by pgvector for semantic search capabilities
- **👤 User Authentication**: Secure authentication using Clerk
- **📱 Responsive Design**: Beautiful, mobile-friendly UI built with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Next.js 16** - React framework for production
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Icons** - Additional icon set

### Backend & Database
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - ORM for database management
- **PostgreSQL** - Primary database
- **pgvector** - Vector extension for embeddings

### Authentication & Services
- **Clerk** - User authentication and management
- **Google Generative AI** - Gemini API for AI features

### Form & Validation
- **React Hook Form** - Efficient form management
- **Yup** - Schema validation
- **@hookform/resolvers** - Integration with Yup

### Utilities
- **nanoid** - Unique ID generation
- **react-toastify** - Toast notifications

## 📋 Prerequisites

Before you begin, ensure you have the following:

- **Node.js** (v18 or higher) and npm/yarn installed
- **PostgreSQL** database with pgvector extension enabled
- **Clerk** account for authentication ([https://clerk.com](https://clerk.com))
- **Google Generative AI API key** ([https://ai.google.dev](https://ai.google.dev))

## 🚀 Getting Started

### 1. Clone the Repository

`ash
git clone <repository-url>
cd notes-app
``

### 2. Install Dependencies

`ash
npm install
# or
yarn install
`

### 3. Set Up Environment Variables

Create a .env.local file in the root directory with the following variables:

`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/notes_db"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Google Generative AI
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key
`

### 4. Set Up the Database

`ash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) View database GUI
npx prisma studio
`

### 5. Run Development Server

`ash
npm run dev
# or
yarn dev
`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

`
notes-app/
├── app/
│   ├── api/                      # API routes
│   │   ├── chatWithNotes/       # Chat endpoint
│   │   ├── createNotes/         # Create notes
│   │   ├── deleteNotes/         # Delete notes
│   │   ├── getNotes/            # Fetch notes
│   │   ├── shareNote/           # Share note functionality
│   │   ├── summarizeNotes/      # Summarization endpoint
│   │   └── updateNotes/         # Update notes
│   ├── components/               # React components
│   │   ├── Chat/                # Chat component
│   │   ├── Modal/               # Modal component
│   │   └── Pagination/          # Pagination component
│   ├── generated/               # Auto-generated files (Prisma Client)
│   ├── lib/                     # Utility functions
│   │   ├── detectMood.ts        # Mood detection logic
│   │   ├── generateEmbedding.ts # Vector embedding generation
│   │   └── prisma.ts            # Prisma client instance
│   ├── models/                  # TypeScript models
│   ├── services/                # External service integrations
│   │   └── gemini.ts            # Gemini AI service
│   ├── share/                   # Shared note page
│   │   └── [link]/              # Dynamic shared note route
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
├── public/                      # Static assets
├── .env.local                   # Environment variables (not committed)
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
`

## 📚 API Endpoints

### Notes Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/createNotes | Create a new note |
| GET | /api/getNotes | Retrieve user's notes |
| PUT | /api/updateNotes | Update an existing note |
| DELETE | /api/deleteNotes | Delete a note |

### AI Features

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/chatWithNotes | Chat with your notes |
| POST | /api/summarizeNotes | Summarize note content |

### Sharing

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/shareNote | Generate shareable link |
| GET | /share/[link] | View shared note |

## 🔐 Database Schema

### Note Model

`prisma
model Note {
  id        Int                    @id @default(autoincrement())
  title     String
  content   String
  userId    String?
  mood      String?
  link      String?                @unique
  createdAt DateTime               @default(now())
  updatedAt DateTime               @default(now()) @updatedAt
  embedding Unsupported("vector")?
}
`

## 🎨 Styling

This project uses **Tailwind CSS 4** for styling. Global styles are defined in app/globals.css.

## 🔒 Authentication

User authentication is managed through **Clerk**. The app automatically:
- Protects routes that require authentication
- Associates notes with authenticated users
- Manages user sessions

## 🧠 AI Features

### Mood Detection
Analyzes note content to detect emotional tone/sentiment

### Vector Embeddings
Uses pgvector to store semantic embeddings of notes for intelligent search

### Chat with Notes
Powered by Google Generative AI (Gemini), allowing natural language interaction with your notes

### Note Summarization
Generates concise summaries of your note content

## 📦 Available Scripts

`ash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint

# Database
npx prisma migrate dev    # Create and run migrations
npx prisma studio        # Open Prisma Studio GUI
npx prisma generate      # Generate Prisma Client
`

## 🚢 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

`ash
vercel
`

### Environment Variables for Production

Make sure to set all required environment variables in your production environment:
- DATABASE_URL
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- NEXT_PUBLIC_GOOGLE_API_KEY

## 📝 Notes

- The app uses PostgreSQL with pgvector extension for vector operations
- Ensure your PostgreSQL database has the vector extension installed
- Clerk provides free tier suitable for development and small-scale deployments
- Google Generative AI has usage limits on the free tier

## 🐛 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check pgvector extension is installed: CREATE EXTENSION IF NOT EXISTS vector;

### Authentication Issues
- Verify Clerk keys are correctly set
- Check Clerk dashboard for application configuration

### AI Features Not Working
- Verify Google API key is valid
- Check API quota in Google Cloud Console

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Clerk](https://clerk.com/)
- [Google Generative AI](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For questions or issues, please open an issue in the repository or contact me directly.

---

**Happy Note Taking! 📝✨**
