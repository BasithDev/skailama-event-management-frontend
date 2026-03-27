# Event Management System - Frontend

This is the frontend application for the Event Management System, built with a modern React tech stack to provide a responsive and dynamic user experience.

## Tech Stack
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **HTTP Client:** Axios

## Features
- **User Management:** Create new users and switch between user profiles.
- **Event Management:** Create, update, view, and manage events.
- **Log Viewer:** View logs for specific events.
- **Timezone Support:** View event times converted to different timezones.
- **Responsive Design:** Fully responsive layout with seamless modal animations.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- `npm`, `yarn`, or `pnpm`

### Installation
1. Clone the repository and navigate to the frontend directory.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables by copying `.env.example` to `.env` (if applicable) and configuring your API base URL.

### Running the Application
To start the development server:
```sh
npm run dev
```

### Build for Production
```sh
npm run build
```

## Scripts
- `npm run dev` - Starts the Vite development server.
- `npm run build` - Builds the application for production.
- `npm run lint` - Runs ESLint to check for code quality.
- `npm run preview` - Previews the production build locally.
