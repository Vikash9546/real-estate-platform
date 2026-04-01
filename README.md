# Real Estate Platform

A feature-rich, full-stack real estate platform designed to streamline the process of buying, selling, and renting properties. This platform provides a seamless experience for property owners to list their assets and for users to discover and inquire about dream homes or commercial spaces.

---

## Architecture

The application follows a modern decoupled architecture with a React frontend and a Node.js/Express backend, utilizing MongoDB for data storage and Socket.io for real-time communication.

```mermaid
graph TD
    subgraph "Client Side (Frontend)"
        A[React SPA] --> B[Vite]
        A --> C[Tailwind CSS]
        A --> D[Axios]
        A --> E[Socket.io-client]
    end

    subgraph "Server Side (Backend)"
        F[Node.js / Express] --> G[Prisma ORM]
        F --> H[Socket.io Server]
        F --> I[JWT Auth]
        F --> J[Multer Storage]
    <ctrl95>

    subgraph "Database & Storage"
        K[(MongoDB)]
        L[Cloudinary / Local FS]
    end

    A <==>|REST API / WebSockets| F
    G <==> K
    J <==> L
```

---

## Project Structure

### Backend (`/backend`)
Contains the server-side logic, API endpoints, and database management.

- **`src/server.js`**: Entry point of the application.
- **`routes/`**: Express routes defining API endpoints (Auth, Property, Inquiries, etc.).
- **`controllers/`**: Business logic for each route.
- **`middlewares/`**: Authentication, authorization, and error handling.
- **`prisma/`**: Database schema and migrations using Prisma.
- **`config/`**: Environment and DB configurations.
- **`utils/`**: Helper functions and services (Nodemailer, Token helpers).
- **`scripts/`**: Automation scripts for seeding or testing.

### Frontend (`/frontend`)
The user interface built with React and styled with Tailwind CSS.

- **`src/pages/`**: Main page components (Home, Dashboard, PropertyDetails, etc.).
- **`src/components/`**: Reusable UI components (Navbar, Footer, PropertyCard).
- **`src/context/`**: State management for user authentication and global data.
- **`src/services/`**: API service calls using Axios.
- **`src/assets/`**: Static assets like images and global CSS.
- **`tailwind.config.js`**: Design system configuration.

---

## Key Features & Functionality

### Authentication & Authorization
- **Multi-Role System**: Support for `USER`, `OWNER`, and `ADMIN`.
- **Secure Auth**: JWT-based authentication with password hashing using `bcrypt`.
- **Profile Management**: Users can update their profiles and manage account settings.

### Property Management
- **Listings**: Owners can add, edit, and delete property listings with detailed info (price, area, city, amenities).
- **Media Upload**: Support for uploading multiple property images using `multer`.
- **Status Workflow**: Admin approval system for new listings to ensure quality.

### Search & Discovery
- **Advanced Filtering**: Filter properties by type (Residential/Commercial), price range, city, and amenities.
- **Wishlist**: Users can save properties to their personal wishlist for later viewing.

### Communication System
- **Inquiry Handling**: Direct inquiry forms on property details pages.
- **Real-time Chat**: Integrated messaging system powered by `Socket.io` for instant communication between buyers and owners.
- **Notifications**: Email notifications for inquiries via `nodemailer`.

### Admin Dashboard
- **Analytics**: Overview of total properties, users, and active inquiries.
- **Moderation**: Approve or reject property listings and manage user accounts.

---

## Tech Stack

**Frontend:**
- React 19 (Vite)
- Tailwind CSS
- Axios (HTTP Client)
- Socket.io-client
- Recharts (Analytics)

**Backend:**
- Node.js & Express
- Prisma (ORM)
- MongoDB
- Socket.io (Real-time)
- JWT (Security)
- Nodemailer

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance

### Installation
1. Clone the repository
2. Install dependencies for both folders:
   ```bash
   # Backend
   cd backend && npm install
   # Frontend
   cd ../frontend && npm install
   ```
3. Set up `.env` files in both directories based on the provided configuration templates.
4. Run the development servers:
   ```bash
   # Backend
   npm run dev
   # Frontend
   npm run dev
   ```
