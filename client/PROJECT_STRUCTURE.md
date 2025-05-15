# React Project Structure

This document outlines the folder structure and organization of our React project.

## Root Structure

```
client/
├── public/              # Static files
├── src/                 # Source files
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Source Folder Structure

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
│   ├── Dashboard/       # Dashboard page
│   │   ├── index.tsx    # Dashboard page component
│   │   └── Layout.tsx   # Dashboard page specific layout
│   └── ...              # Other pages
│
├── routes/              # Routing configuration
│   └── index.tsx        # Main routes configuration with protected routes
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
│
├── App.tsx              # Main App component
├── main.tsx             # Entry point
└── vite-env.d.ts        # Vite environment types
```

## Key Files Description

### API Configuration

- **axios.ts**: Sets up the Axios instance with base URL and default headers
- **interceptors.ts**: Implements request and response interceptors for handling authentication, errors, etc.
- **urls.ts**: Contains all API endpoint URLs used in the application

### Services

- **authService.ts**: Handles authentication API calls (login, register, logout)
- **userService.ts**: Handles user-related API calls (get profile, update profile)
- Other service modules for different API endpoints

### Components

Organized by feature or type, each component may include:
- Component file (TSX)
- Style file (CSS/SCSS)
- Test file (spec.tsx)

### Pages

Each page may include:
- Page component file (TSX)
- Page-specific layout components
- Style file (CSS/SCSS)
- Sub-components specific to that page

### Routes

- **index.tsx**: Centralizes all application routes with protected route wrappers for authenticated routes

### Hooks

Custom React hooks for reusable logic across components.

### Utils

Helper functions and utilities used throughout the application.

### Interfaces

TypeScript interfaces for type checking and code documentation.

## Best Practices

1. Keep components small and focused on a single responsibility
2. Use TypeScript interfaces for all data structures
3. Implement proper error handling in API calls
4. Use context for global state management
5. Organize imports consistently
6. Write unit tests for components and utilities
