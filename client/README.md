# React Frontend Project

A modern React application with TypeScript, designed to connect with backend APIs.

## Project Overview

This project is a React frontend application built with TypeScript and Vite. It follows a structured folder organization to maintain clean code architecture and separation of concerns.

## Tech Stack

- **React**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **React Router**: Routing
- **Axios**: API requests
- **Context API**: State management
- **Tailwind CSS**: Utility-first CSS framework

## Project Structure

```
src/
├── api/                 # API configuration
│   ├── axios.ts         # Axios instance setup
│   ├── interceptors.ts  # Request/response interceptors
│   └── urls.ts          # API endpoint URLs
│
├── services/            # Service modules for API calls
│   ├── authService.ts   # Authentication related API calls
│   ├── userService.ts   # User related API calls
│   └── ...              # Other service modules
│
├── components/          # Reusable UI components
│   ├── common/          # Common components (Button, Input, etc.)
│   ├── layout/          # Layout components (Header, Footer, etc.)
│   └── ...              # Feature-specific components
│
├── pages/               # Page components
│   ├── Home/            # Home page
│   │   ├── index.tsx    # Home page component
│   │   └── Layout.tsx   # Home page specific layout
│   ├── Login/           # Login page
│   │   ├── index.tsx    # Login page component
│   │   └── Layout.tsx   # Login page specific layout
│   └── ...              # Other pages
│
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   ├── useFetch.ts      # Data fetching hook
│   └── ...              # Other custom hooks
│
├── utils/               # Utility functions
│   ├── formatters.ts    # Data formatting utilities
│   ├── validators.ts    # Form validation utilities
│   └── ...              # Other utility functions
│
├── interfaces/          # TypeScript interfaces
│   ├── user.interface.ts # User-related interfaces
│   ├── api.interface.ts  # API-related interfaces
│   └── ...               # Other interfaces
│
├── assets/              # Static assets
│   ├── images/          # Image files
│   ├── icons/           # Icon files
│   └── ...              # Other assets
│
├── context/             # React context providers
│   ├── AuthContext.tsx  # Authentication context
│   ├── ThemeContext.tsx # Theme context
│   └── ...              # Other contexts
│
├── styles/              # Global styles
│   ├── global.css       # Global CSS
│   ├── variables.css    # CSS variables
│   └── ...              # Other style files
│
├── constants/           # Constant values
│   ├── routes.ts        # Route constants
│   └── ...              # Other constants
```

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd project-react/client
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues

## Connecting to Backend APIs

The application is designed to connect to backend APIs. The API configuration is located in the `src/api` directory:

- `axios.ts` - Sets up the Axios instance with base URL and default headers
- `interceptors.ts` - Implements request and response interceptors for handling authentication, errors, etc.
- `urls.ts` - Contains all API endpoint URLs used in the application

Services in the `src/services` directory use this configuration to make API calls.

## Authentication

The application includes a complete authentication system:

- Login/Register functionality
- Token-based authentication
- Protected routes
- Auth context for global state management

## Folder Organization Best Practices

1. **Components**: Keep components small and focused on a single responsibility
2. **Pages**: Each page has its own directory with its components and styles
3. **Layouts**: Common layouts are in `components/layout`, page-specific layouts are in their respective page folders
4. **API Endpoints**: All API endpoint URLs are defined in `api/urls.ts`
5. **Services**: Each service module handles a specific domain of API calls
6. **Interfaces**: Use TypeScript interfaces for all data structures

## Styling Guidelines

1. **Tailwind CSS Only**: This project strictly uses Tailwind CSS for styling. Do not use custom CSS files or inline styles unless absolutely necessary.
2. **Component Organization**: Keep component-specific styles with their respective components using Tailwind utility classes.
3. **Responsive Design**: Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:) for responsive designs.
4. **Dark Mode**: Use Tailwind's dark: variant for dark mode styling.
5. **Custom Extensions**: If you need custom styles, extend the Tailwind configuration in `tailwind.config.js` rather than writing custom CSS.
6. **Reusable Components**: Create reusable UI components with consistent Tailwind classes.
7. **Class Organization**: For readability, organize Tailwind classes in this order: layout, sizing, spacing, typography, colors, effects.
