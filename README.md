📚 E-Commerce Book Store — Full Stack Application

A feature-rich full-stack MERN (MongoDB, Express, React, Node.js) application for an online Book Store.
Built to showcase complete e-commerce functionality — from signup and login to checkout, order tracking, and reviews.

This project is designed for learners and book lovers, combining technical depth with a friendly user experience.

🧠 Ideal for showcasing full-stack development, authentication, state management, and REST API integration skills.

🧭 Table of Contents

✨ Overview
🧠 Features
🧩 Tech Stack
📡 API Endpoints
🧱 Folder Structure
⚙️ How to Run the Project
🧪 Usage Flow

✨ Overview

"Hello, welcome to your learning journey! New everyday!!!"
👉 Discover something new every day with our curated collection of books and courses.
📚 Expand Your Knowledge: Explore classic and modern books across various genres.
💡 Learn at Your Pace: Access engaging courses tailored to all levels.
🎯 Stay Inspired: Immerse yourself in knowledge and creativity.
📖 Start learning today!

This Book Store project simulates a full e-commerce workflow:
* User signup and login
* Browsing and adding books to cart
* Checkout with address & payment selection
* Order management, tracking, and reviews

🧠 Features
👤 Authentication
* Signup & login system
* JWT/session-based authentication
* Profile page with user details and order history

🏠 Home Page
* Motivational greeting message
* Placeholder view when no books are available
* Easy navigation to all key sections

📚 Books
* Browse all available books
* Add books to cart
* Adjust quantity directly in cart

🛒 Cart Management
* Add/remove books
* Update quantity
* View total dynamically

💳 Checkout & Payment
Step-by-step checkout:
 1.Order summary
 2.Add/change address
 3.Confirm order
 4.Choose payment method (COD / UPI Scanner)

📦 Orders & Reviews
* View order history
* Track, cancel, or reorder
* Write text reviews and rate delivered books

🧩 Tech Stack
| Layer              | Technology                 |
| ------------------ | -------------------------- |
| **Frontend**       | React, Axios, CSS/Tailwind |
| **Backend**        | Node.js, Express           |
| **Database**       | MongoDB                    |
| **Authentication** | JWT / Express Sessions     |
| **API Type**       | RESTful JSON APIs          |

📡 API Endpoints
🔐 Authentication
| Method   | Endpoint      | Description             |
| -------- | ------------- | ----------------------- |
| **POST** | `/api/signup` | Register a new user     |
| **POST** | `/api/login`  | Login and receive token |

📚 Books
| Method  | Endpoint         | Description                      |
| ------- | ---------------- | -------------------------------- |
| **GET** | `/api/books`     | Fetch all available books        |
| **GET** | `/api/books/:id` | Fetch details of a specific book |

🛒 Cart
| Method     | Endpoint        | Description           |
| ---------- | --------------- | --------------------- |
| **POST**   | `/api/cart`     | Add book to cart      |
| **GET**    | `/api/cart`     | View current cart     |
| **PATCH**  | `/api/cart/:id` | Update quantity       |
| **DELETE** | `/api/cart/:id` | Remove book from cart |

💳 Orders
| Method    | Endpoint          | Description                           |
| --------- | ----------------- | ------------------------------------- |
| **POST**  | `/api/checkout`   | Place a new order                     |
| **GET**   | `/api/orders`     | Get user’s order history              |
| **PATCH** | `/api/orders/:id` | Update order (cancel/track/delivered) |
| **POST**  | `/api/review`     | Submit review and rating              |

🧱 Folder Structure
E-Commerce/
│
├── backend/
│   ├── index.js              # Express server entry
│   ├── routes/               # API routes
│   ├── controllers/          # Business logic
│   ├── models/               # Mongoose schemas
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Home, Books, Cart, Profile, Checkout
│   │   ├── context/          # Auth & Cart context
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md

⚙️ How to Run the Project
1️⃣ Clone the Repository
git clone https://github.com/NandithaBM/E-Commerce.git
cd E-Commerce

2️⃣ Run the Backend
cd backend
npm install
node index.js

Server runs on: http://localhost:5000

3️⃣ Run the Frontend
cd ../frontend
npm install
npm start

Frontend runs on: http://localhost:3000

🧪 Usage Flow
1.Sign up or log in
2.Explore books on the home/books page
3.Add books to your cart
4.Proceed to checkout
5.Add or change address
6.Select payment mode (COD / UPI)
7.Confirm and place order
8.Track, cancel, reorder, or review from your profile
