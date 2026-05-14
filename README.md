# 🛒 Blinkit Clone MERN Project

> A full-stack quick commerce web application inspired by Blinkit and Zepto, built using the MERN Stack with real-time order tracking, inventory management, multiple dashboards, and delivery workflow automation.

---

# 🚀 Project Overview

The **Blinkit Clone MERN Project** is a modern quick-commerce platform developed to simulate real-world grocery delivery applications like Blinkit and Zepto.

The system includes multiple dashboards for:

- 👤 Customers
- 🛠️ Admins
- 📦 Pickers
- 🚴 Delivery Partners

The application supports:

✅ Real-Time Order Tracking  
✅ COD & Online Payments  
✅ Inventory Management  
✅ Socket.IO Live Updates  
✅ Google Maps Integration  
✅ Role-Based Access  
✅ Live Delivery Workflow  

---

# 📸 Project Screenshots

## 🏠 Customer Dashboard

![Customer Dashboard](https://via.placeholder.com/1200x600.png?text=Customer+Dashboard)

---

## 🛠️ Admin Dashboard

![Admin Dashboard](https://via.placeholder.com/1200x600.png?text=Admin+Dashboard)

---

## 📦 Picker Dashboard

![Picker Dashboard](https://via.placeholder.com/1200x600.png?text=Picker+Dashboard)

---

## 🚴 Delivery Dashboard

![Delivery Dashboard](https://via.placeholder.com/1200x600.png?text=Delivery+Dashboard)

---

# ✨ Features

## 👤 Customer Panel

- User Registration & Login
- Product Browsing
- Cart Management
- Add To Cart / Remove From Cart
- Place Orders
- COD & Online Payments
- Real-Time Order Tracking
- Google Maps Integration
- Order History
- Responsive UI Design

---

## 🛠️ Admin Panel

- Dashboard Analytics
- Product Management
- Inventory Management
- Order Monitoring
- Picker Assignment
- Delivery Monitoring
- Staff Management
- COD Settlement Tracking
- Live Order Status Monitoring

---

## 📦 Picker Dashboard

- View Assigned Orders
- Update Picking Status
- Mark Orders Ready
- Real-Time Updates
- Workflow Management

---

## 🚴 Delivery Dashboard

- Accept Delivery Orders
- Mark Out For Delivery
- Live GPS Tracking
- COD Collection
- Mark Delivered
- Real-Time Status Updates

---

## ⚡ Real-Time Features

- Socket.IO Integration
- Live Order Updates
- Dynamic Status Changes
- Real-Time Delivery Tracking
- Live Dashboard Synchronization

---

# 🧠 Workflow Architecture

```text
Customer Places Order
        ↓
Admin Monitors Orders
        ↓
Picker Accepts Order
        ↓
Picker Marks READY
        ↓
Delivery Partner Accepts Order
        ↓
Live Tracking Starts
        ↓
Order Delivered
        ↓
COD Settlement (if applicable)
```

---

# 🛠️ Tech Stack

## 🎨 Frontend

- ⚛️ React.js
- 🎨 Tailwind CSS
- 🎬 Framer Motion
- 📡 Axios
- 🌍 Google Maps API
- 🔌 Socket.IO Client

---

## ⚙️ Backend

- 🟢 Node.js
- 🚂 Express.js
- 🔐 JWT Authentication
- 🔌 Socket.IO
- 💳 Razorpay Integration

---

## 🍃 Database

- MongoDB Atlas
- Mongoose ODM

---

## ☁️ Deployment

- ▲ Vercel (Frontend)
- 🚀 Render (Backend)
- ☁️ MongoDB Atlas (Database)

---

# 📂 Project Structure

```bash
Blinkit-Clone/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
├── frontend-admin/
│
├── frontend-customer/
│
├── frontend-picker/
│
├── frontend-delivery/
│
└── README.md
```

---

# ⚙️ How To Run Locally

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Hanumanth88600/Grocery-Store-Project.git
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
```

### Create `.env`

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

RAZORPAY_KEY_ID=YOUR_KEY

RAZORPAY_KEY_SECRET=YOUR_SECRET
```

### Run Backend

```bash
npm run dev
```

---

## 3️⃣ Frontend Setup

### 👤 Customer Panel

```bash
cd frontend-customer
npm install
npm start
```

---

### 🛠️ Admin Panel

```bash
cd frontend-admin
npm install
npm start
```

---

### 📦 Picker Panel

```bash
cd frontend-picker
npm install
npm start
```

---

### 🚴 Delivery Panel

```bash
cd frontend-delivery
npm install
npm start
```

---

# 🌐 Live Deployment Links

## 👤 Customer Panel

https://grocery-store-project-customer.vercel.app

---

## 🛠️ Admin Panel

https://grocery-store-project-admin.vercel.app

---

## 📦 Picker Panel

https://grocery-store-project-picker.vercel.app

---

## 🚴 Delivery Panel

https://grocery-store-project-delivery.vercel.app

---

# 📈 Results

✅ Successfully implemented scalable MERN architecture  

✅ Built real-time delivery workflow  

✅ Integrated Google Maps live tracking  

✅ Developed role-based dashboards  

✅ Implemented inventory and order management  

✅ Successfully deployed frontend and backend on cloud platforms  

---

# 🔮 Future Enhancements

- 🤖 AI Product Recommendations
- 📱 React Native Mobile App
- 🔔 Push Notifications
- 🧾 Invoice Generation
- 🧠 Route Optimization
- 💬 In-App Chat System
- 📊 Advanced Analytics Dashboard
- 🌍 Multi-Language Support

---

# ⚠️ Important Note

> This project was developed mainly for educational and portfolio purposes.

## 💳 Payment Integration Note

- Razorpay payment gateway is integrated for demonstration purposes.
- UPI / Online payments may not work fully in deployed environments without production-level Razorpay verification and configuration.

---

# 📜 License

MIT License © 2026 Hanumanthappa

---

# 👨‍💻 Author

## Harijana Hanumanthappa

### 🔗 Connect With Me

### GitHub

https://github.com/Hanumanth88600

---

### LinkedIn

https://www.linkedin.com/in/hanumanthappa-h-3759b4367/

---

### HackerRank

https://www.hackerrank.com/profile/hanumanthappah51

---

### Email

hanumanthappah5258@gmail.com

---

# ⭐ Support

If you like this project:

⭐ Star the repository  

🍴 Fork the repository  

🚀 Share with others  

💡 Contribute improvements  