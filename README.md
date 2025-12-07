# 🚗 Vehicle Rental System

🌐 Live URL: [https://vehicle-rental-system-arsaad.vercel.app/](https://vehicle-rental-system-arsaad.vercel.app/)

## 🎯 Overview

The Vehicle Rental System is created to handle the rental process of various types of vehicles including cars, bikes, SUVs and vans. The users can browse available vehicles and make bookings. The admin has full access to the entire system.

## 🛠️ Technology Stack

Node.js, TypeScript, Express.js, JWT Authentication, NeonDB (PostgreSQL), Bcrypt

## ✨ Features

- User Registration, User login and Authentication using JWT
- Authorization based on user roles (Admin, Customer)
- Admin Panel:
  - Manage vehicle inventory (Add, View, Update, Delete vehicles)
  - Manage bookings (Add, View, Update bookings)
  - Manage users (View, Update, Delete users)
- Customer Panel:
  - Manage own personal profile (View, Update profile)
  - View all and specific vehicles
  - Manage own bookings (Add, View, Update bookings)
- Auto Runner: Update bookings status based on booking end date, runs every day at midnight

## 🚀 Setup & Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/ar-saad/vehicle-rental-system.git
   cd vehicle-rental-system
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The server will be running at `http://localhost:5000`. Use this URL to access the application.

⚠️ Note: You would need the environment variables configured in a `.env` file for the application to work correctly. You can contact me or create a .env file with JWT_SECRET, and DATABASE_URL from NeonDB.
