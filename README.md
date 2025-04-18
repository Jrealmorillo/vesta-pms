# 🏨 Vesta PMS - Hassle-free Hotel Management System

**Vesta PMS** is a powerful and intuitive Property Management System designed to streamline hotel operations, including **reservations, client management, and billing**. Built with **Node.js, Express, MySQL, React, and Bootstrap**, Vesta PMS ensures an efficient and user-friendly experience for hotel staff and administrators.

## 🚀 Technologies Used

- **Backend:** Node.js, Express, MySQL, Sequelize
- **Frontend:** React, Bootstrap
- **Authentication:** JWT, bcryptjs
- **Version Control:** Git & GitHub

## ✨ Features

✔ **Hotel Reservation Management** – Easily handle room bookings.  
✔ **Client & Company Database** – Store customer and corporate client data.  
✔ **Billing & Invoicing System** – Generate and manage invoices.  
✔ **User Authentication & Roles** – Secure login with role-based permissions.  
✔ **Dynamic Pricing System** – Manage rates based on demand and events.  
✔ **Fully Responsive Interface** – Built with Bootstrap for a modern UI.  

---

## 🔧 Prerequisites

Before installing Vesta PMS, ensure you have the following installed:

- **Node.js v20.17.0** 
- **npm v10.8.2** 
- **MySQL 8.0** (Ensure MySQL server is running)
- **Git** (For cloning the repository)

---

## 👜 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Jrealmorillo/vesta-pms.git
cd vesta-pms
```

### 2️⃣ Backend Setup
```sh
cd backend
npm install
```

#### 2.1 Configure the Environment Variables
Create a `.env` file inside the `backend` directory and configure the database connection:
```sh
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=vesta_pms
JWT_SECRET=your_secret_key
```

#### 2.2 Setup MySQL Database
1. Open MySQL and create the database manually:
   ```sql
   CREATE DATABASE vesta_pms;
   ```
2. Alternatively, execute the provided SQL script to create the database schema:
   ```sh
   mysql -u root -p vesta_pms < Vesta.sql
   ```
3. Run Sequelize migrations (if applicable):
   ```sh
   npx sequelize-cli db:migrate
   ```

#### 2.3 Start the Backend Server
- Run the backend in development mode:
   ```sh
   npm run dev  # (Requires nodemon)
   ```
- If `npm run dev` fails, try:
   ```sh
   node server.js
   ```

---

### 3️⃣ Frontend Setup
```sh
cd ../frontend
npm install
npm run dev
```
- The frontend will be available at:  
  🔗 [http://localhost:5173](http://localhost:5173)

---

## 🛠️ API Endpoints

### **User Management**
- `POST /usuarios/registro` → Register a new user  
- `GET /usuarios` → Retrieve all users  
- `GET /usuarios/:id` → Retrieve a specific user  
- `PUT /usuarios/:id` → Update user data  
- `PUT /usuarios/:id/cambiar-password` → Change user password  
- `DELETE /usuarios/:id` → Deactivate a user  

### **Reservations & Billing**
- `POST /reservas` → Create a new reservation  
- `GET /reservas/:id` → Retrieve reservation details  
- `POST /facturas` → Generate an invoice  

---

## 🛡️ API Authentication
Some API endpoints require authentication. To access them, send a valid JWT token in the request headers:
```sh
Authorization: Bearer <your_token_here>
```

---

## 🛠️ Troubleshooting

**1. Port already in use?**  
If you get an error like `EADDRINUSE: address already in use`, stop any process using port 5000 and restart the server:
```sh
npx kill-port 5000
npm run dev
```

**2. Database connection error?**  
If MySQL doesn't connect, ensure the server is running and the `.env` file has correct credentials:
```sh
mysql -u root -p
```
Then check if the database `vesta_pms` exists:
```sql
SHOW DATABASES;
```

---

## 📃 License

© José Manuel Real Morillo, 2025. All rights reserved.

This software is the exclusive property of José Manuel Real Morillo and may not be copied, modified, distributed, or used without explicit written permission from the owner.

For inquiries about collaborations or commercial licenses, please contact jrealmorillo@gmail.com.

---

## 🤝 Contributing

Contributions are welcome! If you’d like to improve Vesta PMS, fork the repository and submit a pull request.

---

## 📩 Contact

For questions or collaborations, feel free to reach out at:  
📧 **jrealmorillo@gmail.com**  
<!-- 🌐 [YourWebsite.com](https://yourwebsite.com)  -->


<!-- 🌐 https://jreal.es  --> 

---

