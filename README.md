# EventifyHub - Serverless Event Booking & Management System

EventifyHub is a modern, full-stack industry-ready serverless platform for managing and booking events. Built with **React 19**, **Firebase (Auth, Firestore, Storage, Functions)**, and **Tailwind CSS 4**.

## ✨ Key Features

### 👤 User Features
- **Modern Authentication**: Email/Password and Google OAuth integration.
- **Event Discovery**: Search and filter by category (Music, Tech, Arts, etc.).
- **Real-time Bookings**: Transaction-safe seat booking with live availability.
- **Digital Passes**: QR code generation for every ticket booked.
- **Premium UI**: Glassmorphism design with fluid animations (Framer Motion).

### 🛡️ Admin Features
- **Analytical Dashboard**: Overview of total revenue, bookings, and users.
- **Event Management**: Full CRUD (Create, Read, Update, Delete) capability.
- **Image Upload**: Automated poster uploading to Firebase Storage.
- **Role-Based Access**: Restricted admin routes and management interfaces.

## 🚀 Tech Stack
- **Frontend**: Vite + React 19 + Tailwind CSS 4
- **Backend**: Firebase (Fully Serverless)
- **Database**: Cloud Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Vercel (Frontend) / Firebase (Functions)
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- Firebase Account & Project

### 2. Environment Configuration
Create a `.env` file in the root directory and add your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Installation
```bash
npm install
```

### 4. Running Locally
```bash
npm run dev
```

### 5. Deployment
- **Frontend**: Push to GitHub and connect to **Vercel**.
- **Backend (Functions)**:
  ```bash
  cd functions
  firebase deploy --only functions
  ```

## 📂 Folder Structure
```text
/src
  /components    - Reusable UI elements (Navbar, Modals, Cards)
  /context       - State management (Auth, Events)
  /layout        - Main shell for consistent branding
  /pages         - View components (Events, Dashboard, History)
  /services      - SDK Initialization (Firebase, Functions)
  /hooks         - Custom logic (Auth, API)
/functions       - Serverless Cloud Functions (Notifications, Workers)
```

## 💳 Payment Integration
This project uses a **Simulated Payment Gateway** suitable for demonstrations and portfolio projects. To enable real Razorpay:
1. Replace `VITE_RAZORPAY_KEY_ID` in `.env`.
2. Load Razorpay script in `index.html`.
3. Update `handleBooking` in `EventDetail.jsx`.

---
Developed with ❤️ by Antigravity AI
