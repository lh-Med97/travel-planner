# Travel Planner Application

A modern travel planning application built with Next.js, featuring destination discovery, trip planning, and user authentication.

## Features

- User authentication
- Destination discovery and search
- Trip planning and management
- Modern, responsive UI
- Backend API integration

## Tech Stack

- **Frontend:**
  - Next.js 14
  - React
  - Tailwind CSS
  - TypeScript

- **Backend:**
  - Node.js
  - Express
  - Prisma
  - MySQL

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd travel-planner
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add:
```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3001"
```

4. Start the development servers:

For the frontend (runs on port 3001):
```bash
npm run dev
```

For the backend:
```bash
npm run server
```

## Project Structure

```
travel-planner/
├── src/                    # Frontend source code
│   ├── app/               # Next.js app directory
│   │   ├── api/          # API routes
│   │   ├── destinations/ # Destination pages
│   │   └── trips/        # Trip management pages
├── backend/               # Backend source code
│   ├── models/           # Database models
│   └── server.js         # Express server
├── prisma/               # Prisma schema and migrations
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
