# HabitVault - Habit Tracking Application

A comprehensive full-stack application for tracking daily habits, visualizing progress, and building consistent routines. HabitVault helps users establish and maintain positive habits through intuitive tracking, insightful analytics, and motivational features.

![HabitVault](https://via.placeholder.com/800x400?text=HabitVault+Screenshot)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## 🔍 Overview

HabitVault is a modern habit tracking application designed to help users build and maintain positive habits. The application provides an intuitive interface for tracking daily habits, visualizing progress through analytics, and maintaining streaks for consistent behavior. With features like customizable habit targets, visual progress tracking, and motivational elements, HabitVault makes habit formation engaging and sustainable.

## ✨ Features

### Habit Management
HabitVault offers comprehensive habit management capabilities:

- **Create, Edit, and Delete Habits**
  - Define custom habits with detailed descriptions
  - Set start dates to begin tracking from a specific day
  - Organize habits with categories and tags for better organization
  - Flexible naming and customization options

- **Customizable Target Schedules**
  - **Daily**: Track habits that should be performed every day
  - **Weekdays**: Focus on habits for work days (Monday-Friday)
  - **Custom**: Select specific days of the week (e.g., Mon/Wed/Fri)
  - Set different target frequencies based on habit requirements

- **Streak Tracking**
  - Automatic calculation of current streak (consecutive days completed)
  - Record of longest streak achieved for each habit
  - Visual indicators showing streak progress
  - Streak protection for occasional missed days

### Daily Check-in System
The core functionality for maintaining habit consistency:

- **Multi-state Tracking**
  - Mark habits as "Completed" (successful)
  - Mark as "Missed" (unsuccessful attempt)
  - Mark as "Skipped" (exempt from streak calculations)
  - Toggle between states with visual feedback

- **Batch Updates**
  - Update multiple habits simultaneously for a specific date
  - Efficient interface for daily check-ins
  - Retroactive tracking for past dates
  - Mobile-friendly design for on-the-go updates

- **Real-time Feedback**
  - Immediate visual confirmation of check-in status
  - Streak counters update instantly
  - Color-coded status indicators
  - Completion animations for positive reinforcement

### Analytics Dashboard
Comprehensive insights into habit performance:

- **Performance Metrics**
  - Overall completion rate across all habits
  - Weekly and monthly progress visualization
  - Trend indicators showing improvement or decline
  - Comparative analysis between different habits

- **Streak Analytics**
  - Current streak for each habit
  - Longest streak records and history
  - Average streak length over time
  - Streak breakdown by day of week

- **Habit Distribution**
  - Analysis of habit types (daily/weekdays/custom)
  - Completion rates by category
  - Most and least consistent habits
  - Time-based performance patterns

### Calendar Visualization
Detailed historical view of habit performance:

- **Monthly Calendar View**
  - Full month visualization with day-by-day status
  - Color-coded indicators (green for completed, red for missed)
  - Interactive date selection
  - Month-to-month navigation

- **Historical Tracking**
  - Access to complete habit history
  - Ability to view and edit past check-ins
  - Pattern recognition across weeks and months
  - Long-term progress visualization

- **Multi-habit Overlay**
  - View multiple habits on the same calendar
  - Compare performance across different habits
  - Identify correlations between habits
  - Filter by habit type or category

### Heatmap Visualization
Advanced data visualization for habit patterns:

- **Color-intensity Heatmap**
  - Darker colors indicate higher completion rates
  - Visual pattern recognition across time periods
  - Quick identification of consistent days/periods
  - Year-at-a-glance visualization

- **Customizable Date Ranges**
  - Select specific periods for analysis (week, month, year)
  - Custom date range selection
  - Comparative views between different time periods
  - Seasonal pattern identification

- **Filtering Options**
  - Filter by habit, category, or status
  - Focus on specific days of the week
  - Isolate successful or challenging periods
  - Customizable view preferences

### User Profile & Settings
Personalized user experience:

- **Account Management**
  - User profile customization
  - Email and password management
  - Account preferences and settings
  - Data export capabilities

- **Theme Customization**
  - Toggle between light and dark themes
  - Accessibility options
  - Color scheme preferences
  - Font size adjustments

- **Notification Preferences**
  - Daily reminder settings
  - Streak milestone alerts
  - Custom notification scheduling
  - Email or push notification options

### Motivational Features
Elements designed to encourage consistent habit formation:

- **Daily Motivational Quotes**
  - Fresh inspirational quotes each day
  - Category-specific motivational content
  - Option to save favorite quotes
  - Share quotes on social media

- **Streak Celebrations**
  - Special animations for milestone streaks
  - Achievement badges for consistent performance
  - Encouraging messages for streak maintenance
  - Recovery suggestions after broken streaks

- **Progress Insights**
  - Personalized feedback on habit performance
  - Suggestions for improvement
  - Recognition of achievement patterns
  - Motivational statistics and comparisons

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - API requests
- **Context API** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animations
- **Recharts** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Development server

## 📁 Project Structure

```
/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   ├── src/                # Source files
│   │   ├── api/            # API configuration
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service modules
│   │   ├── styles/         # Global styles
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point
│   └── package.json        # Frontend dependencies
│
├── server/                 # Backend Node.js application
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── db/                 # Database migrations and seeds
│   ├── middlewares/        # Express middlewares
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── scripts/            # Utility scripts
│   ├── index.js            # Server entry point
│   └── package.json        # Backend dependencies
│
├── docs/                   # Documentation files
└── README.md               # Project documentation
```

## 💾 Database Design

HabitVault uses a MySQL database with a well-structured schema to support all application features. The database design follows relational database principles with appropriate foreign key constraints and indexes for optimal performance.

### Database Schema

#### Core Tables

1. **users** - Stores user account information
   ```sql
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(50) UNIQUE NOT NULL,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     role ENUM('user', 'admin') DEFAULT 'user',
     reset_token VARCHAR(255) DEFAULT NULL,
     reset_token_expires DATETIME DEFAULT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

2. **habits** - Stores habit definitions
   ```sql
   CREATE TABLE habits (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL,
     name VARCHAR(255) NOT NULL,
     target_type ENUM('daily', 'weekdays', 'custom') NOT NULL,
     start_date DATE NOT NULL,
     current_streak INT DEFAULT 0,
     longest_streak INT DEFAULT 0,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
     INDEX idx_user_id (user_id)
   );
   ```

3. **habit_target_days** - Stores custom target days for habits
   ```sql
   CREATE TABLE habit_target_days (
     habit_id INT NOT NULL,
     day ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun') NOT NULL,
     PRIMARY KEY (habit_id, day),
     FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
   );
   ```

4. **checkins** - Stores habit completion records
   ```sql
   CREATE TABLE checkins (
     id INT AUTO_INCREMENT PRIMARY KEY,
     habit_id INT NOT NULL,
     date DATE NOT NULL,
     status ENUM('completed', 'missed', 'skipped') NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
     UNIQUE KEY unique_habit_date (habit_id, date),
     INDEX idx_checkin_dates (date, status)
   );
   ```

#### Additional Feature Tables

5. **quotes** - Stores motivational quotes
   ```sql
   CREATE TABLE quotes (
     id INT AUTO_INCREMENT PRIMARY KEY,
     text VARCHAR(255) NOT NULL,
     author VARCHAR(100) NOT NULL,
     category VARCHAR(50) DEFAULT 'motivation',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

6. **categories** - Stores habit categories
   ```sql
   CREATE TABLE categories (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(50) NOT NULL,
     color VARCHAR(20) DEFAULT '#3498db',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

7. **habit_categories** - Many-to-many relationship between habits and categories
   ```sql
   CREATE TABLE habit_categories (
     habit_id INT NOT NULL,
     category_id INT NOT NULL,
     PRIMARY KEY (habit_id, category_id),
     FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
     FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
   );
   ```

8. **templates** - Stores habit templates
   ```sql
   CREATE TABLE templates (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     description TEXT,
     target_type ENUM('daily', 'weekdays', 'custom') NOT NULL,
     category_id INT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
   );
   ```

9. **template_target_days** - Stores custom target days for templates
   ```sql
   CREATE TABLE template_target_days (
     template_id INT NOT NULL,
     day ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun') NOT NULL,
     PRIMARY KEY (template_id, day),
     FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
   );
   ```

### Entity Relationship Diagram

```
users 1──────┐
             │
             │ n
             ▼
          habits 1────────┐
             │            │
             │            │ n
    ┌────────┴────────┐   │
    │                 │   │
    │ n               │ 1 ▼
    ▼                 │  checkins
habit_target_days     │
                      │ n
                      │
                      ▼
                 categories
                      ▲
                      │ n
                      │
                templates 1───────┐
                                  │
                                  │ n
                                  ▼
                          template_target_days
```

### Key Database Features

1. **Foreign Key Constraints**: Ensures referential integrity between related tables
2. **Indexes**: Optimizes query performance for frequently accessed columns
3. **Timestamps**: Automatic tracking of creation and update times
4. **Enumerations**: Restricts values to predefined sets for consistency
5. **Unique Constraints**: Prevents duplicate entries where appropriate

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14.0.0 or later)
- npm or yarn
- MySQL (v8.0 or later)

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=habitvault
   DB_PORT=3306
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
   CLIENT_URL=http://localhost:5173
   ```

4. Initialize the database:
   ```bash
   npm run init-db
   npm run migrate
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 📚 API Documentation

The HabitVault API follows RESTful principles and uses JSON for data exchange. All API endpoints (except authentication) require a valid JWT token in the Authorization header.

### Authentication Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/auth/register` | POST | Register a new user | `{username, name, email, password}` | User object with token |
| `/api/auth/login` | POST | Login user | `{email, password}` | User object with token |
| `/api/auth/logout` | POST | Logout user | None | Success message |
| `/api/auth/forgot-password` | POST | Request password reset | `{email}` | Success message |
| `/api/auth/reset-password` | POST | Reset password with token | `{token, newPassword}` | Success message |

#### Example Authentication Request
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Example Authentication Response
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Habits Endpoints

| Endpoint | Method | Description | Request Body / Query Params | Response |
|----------|--------|-------------|-------------|----------|
| `/api/habits` | GET | List all habits | Optional: `?sort=name&order=asc` | Array of habit objects |
| `/api/habits/{id}` | GET | Get a single habit | None | Detailed habit object with target days |
| `/api/habits` | POST | Create a new habit | `{name, target_type, target_days?, start_date}` | Created habit object |
| `/api/habits/{id}` | PUT | Update a habit | `{name?, target_type?, target_days?}` | Updated habit object |
| `/api/habits/{id}` | DELETE | Delete a habit | None | Success message |

#### Example Habit Creation Request
```http
POST /api/habits
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Drink Water",
  "target_type": "daily",
  "start_date": "2024-05-01"
}
```

#### Example Habit Response
```json
{
  "id": 10,
  "name": "Drink Water",
  "target_type": "daily",
  "start_date": "2024-05-01",
  "current_streak": 0,
  "longest_streak": 0,
  "created_at": "2024-05-01T12:00:00Z",
  "updated_at": "2024-05-01T12:00:00Z"
}
```

### Check-ins Endpoints

| Endpoint | Method | Description | Request Body / Query Params | Response |
|----------|--------|-------------|-------------|----------|
| `/api/habits/{id}/checkins` | POST | Log/update a check-in | `{date, status}` | Updated streak information |
| `/api/checkins/batch` | POST | Bulk update check-ins | `{date, updates: [{habit_id, status}]}` | Batch update results |
| `/api/habits/{id}/checkins` | GET | Get check-in history | Query: `?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` | Array of check-in objects |

#### Example Check-in Request
```http
POST /api/habits/10/checkins
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "date": "2024-05-15",
  "status": "completed"
}
```

#### Example Check-in Response
```json
{
  "current_streak": 1,
  "longest_streak": 1
}
```

### Analytics Endpoints

| Endpoint | Method | Description | Query Params | Response |
|----------|--------|-------------|-------------|----------|
| `/api/analytics/summary` | GET | Get aggregated stats | Optional: `?period=week&date=YYYY-MM-DD` | Summary statistics object |
| `/api/analytics/heatmap` | GET | Get heatmap data | `?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` | Heatmap data object |

#### Example Analytics Summary Response
```json
{
  "total_habits": 5,
  "completion_rate": 78,
  "habit_types": {
    "daily": 3,
    "weekdays": 1,
    "custom": 1
  },
  "top_streaks": [
    {
      "id": 10,
      "name": "Drink Water",
      "current_streak": 15,
      "longest_streak": 30
    }
  ],
  "longest_streak": 30
}
```

### User Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/users/me` | GET | Get user profile | None | User profile object |
| `/api/users/me` | PUT | Update user profile | `{name?, email?, password?}` | Updated user object |

#### Example User Profile Response
```json
{
  "id": 1,
  "username": "johndoe",
  "name": "John Doe",
  "email": "user@example.com",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Quotes Endpoints

| Endpoint | Method | Description | Query Params | Response |
|----------|--------|-------------|-------------|----------|
| `/api/quotes/daily` | GET | Get daily motivational quote | None | Quote object |
| `/api/quotes/random` | GET | Get random motivational quote | Optional: `?category=motivation` | Quote object |
| `/api/quotes/category/:category` | GET | Get quotes by category | None | Array of quote objects |

#### Example Quote Response
```json
{
  "id": 42,
  "text": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs",
  "category": "motivation"
}
```

### Categories and Templates Endpoints

| Endpoint | Method | Description | Request Body / Query Params | Response |
|----------|--------|-------------|-------------|----------|
| `/api/categories` | GET | Get all categories | None | Array of category objects |
| `/api/templates` | GET | Get all templates | None | Array of template objects |
| `/api/templates/{id}` | GET | Get a single template | None | Detailed template object |
| `/api/templates` | POST | Create a new template | Template data | Created template object |

### Error Responses

All API endpoints return appropriate HTTP status codes:

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error response body format:
```json
{
  "message": "Error description",
  "error": "Detailed error information (development mode only)"
}
```

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### Habits Page
![Habits](https://via.placeholder.com/800x400?text=Habits+Page+Screenshot)

### Analytics
![Analytics](https://via.placeholder.com/800x400?text=Analytics+Screenshot)

### Calendar View
![Calendar](https://via.placeholder.com/800x400?text=Calendar+Screenshot)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
