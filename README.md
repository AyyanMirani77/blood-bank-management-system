# 🩸 BloodCare — Blood Bank Management System

<div align="center">

![BloodCare Banner](https://img.shields.io/badge/BloodCare-Blood%20Bank%20System-dc2626?style=for-the-badge&logo=heart&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**A full-stack Blood Bank Management System that streamlines donor management, blood inventory tracking, hospital coordination, and emergency blood requests.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation--setup) • [Screenshots](#-project-structure) • [License](#-license)

</div>

---

## 📌 Overview

**BloodCare** is a comprehensive Blood Bank Management System designed for hospitals, blood banks, and healthcare organizations. It provides a centralized platform to manage blood donors, track inventory across all 8 blood types, handle emergency requests, and coordinate blood distribution to partner hospitals — all through a modern, professional web interface.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 📊 **Dashboard** | Live overview of all stats — donors, stock, requests, donations |
| 👤 **Donor Management** | Register, edit, delete donors with full medical profiles |
| 🩸 **Blood Stock** | Track blood units by type, collection date, expiry & location |
| 💉 **Donations** | Record donation events with health check results |
| 📋 **Blood Requests** | Manage hospital blood requests with priority levels |
| 🚚 **Distribution** | Track blood units distributed to hospitals |
| 🏥 **Hospitals** | Manage partner hospital profiles and contacts |
| ⚠️ **Expiry Log** | Log and track expired blood units with action records |

---

## 🛠️ Tech Stack

### Backend
- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **MySQL2** — Database driver
- **JWT** — Authentication tokens
- **bcrypt** — Password hashing
- **CORS** — Cross-origin support

### Frontend
- **HTML5** — Structure
- **CSS3** — Custom premium design system (glassmorphism + dark theme)
- **Vanilla JavaScript** — Dynamic UI, API calls
- **Google Fonts** — Syne + Plus Jakarta Sans typography

### Database
- **MySQL** — Relational database

---

## 📁 Project Structure

```
blood-bank-management-system/
│
├── 📂 routes/                    # Express API routes
│   ├── auth.js                   # Login & authentication
│   ├── donors.js                 # Donor CRUD operations
│   ├── bloodStock.js             # Blood stock management
│   ├── hospitals.js              # Hospital management
│   ├── donations.js              # Donation records
│   ├── bloodRequests.js          # Blood request handling
│   ├── distribution.js           # Distribution tracking
│   └── expiryLog.js              # Expiry log management
│
├── 📂 frontend/                  # Frontend HTML pages
│   ├── index.html                # Login page
│   ├── dashboard.html            # Main dashboard
│   ├── donors.html               # Donor management
│   ├── blood-stock.html          # Blood inventory
│   ├── donations.html            # Donation records
│   ├── requests.html             # Blood requests
│   ├── distribution.html         # Distribution logs
│   ├── hospitals.html            # Hospital directory
│   ├── expiry-log.html           # Expiry tracking
│   │
│   ├── 📂 css/
│   │   └── style.css             # Premium design system
│   │
│   └── 📂 js/
│       └── sidebar.js            # Sidebar renderer + toast
│
├── db.js                         # MySQL database connection
├── server.js                     # Express app entry point
├── package.json                  # Dependencies
└── README.md                     # Project documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/) or [XAMPP](https://www.apachefriends.org/)
- [Git](https://git-scm.com/)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AyyanMirani77/blood-bank-management-system.git
cd blood-bank-management-system
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Set Up the Database

Open **MySQL Workbench** or **phpMyAdmin** and run:

```sql
CREATE DATABASE blood_bank_db;
USE blood_bank_db;

-- Admins table
CREATE TABLE admins (
  admin_id   INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donors table
CREATE TABLE donors (
  donor_id           INT AUTO_INCREMENT PRIMARY KEY,
  name               VARCHAR(100) NOT NULL,
  blood_group        VARCHAR(5)  NOT NULL,
  date_of_birth      DATE,
  gender             VARCHAR(10),
  phone              VARCHAR(20),
  address            TEXT,
  health_status      VARCHAR(20),
  last_donation_date DATE,
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blood stock table
CREATE TABLE blood_stock (
  stock_id          INT AUTO_INCREMENT PRIMARY KEY,
  blood_group       VARCHAR(5)  NOT NULL,
  units_available   INT         NOT NULL DEFAULT 0,
  collection_date   DATE,
  expiry_date       DATE,
  storage_location  VARCHAR(100),
  status            VARCHAR(20) DEFAULT 'Available',
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hospitals table
CREATE TABLE hospitals (
  hospital_id    INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(150) NOT NULL,
  address        TEXT,
  contact_person VARCHAR(100),
  phone          VARCHAR(20),
  email          VARCHAR(100),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donations table
CREATE TABLE donations (
  donation_id         INT AUTO_INCREMENT PRIMARY KEY,
  donor_id            INT,
  stock_id            INT,
  admin_id            INT,
  units_donated       INT NOT NULL,
  donation_date       DATE,
  health_check_result VARCHAR(20),
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES donors(donor_id),
  FOREIGN KEY (stock_id) REFERENCES blood_stock(stock_id)
);

-- Blood requests table
CREATE TABLE blood_requests (
  request_id      INT AUTO_INCREMENT PRIMARY KEY,
  hospital_id     INT,
  admin_id        INT,
  blood_group     VARCHAR(5),
  units_requested INT,
  request_date    DATE,
  priority        VARCHAR(20) DEFAULT 'Normal',
  status          VARCHAR(20) DEFAULT 'Pending',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id)
);

-- Distribution table
CREATE TABLE distribution (
  distribution_id   INT AUTO_INCREMENT PRIMARY KEY,
  request_id        INT,
  stock_id          INT,
  admin_id          INT,
  units_distributed INT,
  distribution_date DATE,
  notes             TEXT,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES blood_requests(request_id),
  FOREIGN KEY (stock_id)   REFERENCES blood_stock(stock_id)
);

-- Expiry log table
CREATE TABLE expiry_log (
  log_id        INT AUTO_INCREMENT PRIMARY KEY,
  stock_id      INT,
  admin_id      INT,
  units_expired INT,
  expiry_date   DATE,
  action_taken  TEXT,
  logged_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (stock_id) REFERENCES blood_stock(stock_id)
);

-- Insert default admin (password: admin123)
INSERT INTO admins (name, email, password)
VALUES ('Admin', 'admin@bloodcare.io', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.');
```

---

### 4️⃣ Configure Database Connection

Open `db.js` and update your credentials:

```js
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',           // your MySQL password
  database : 'blood_bank_db'
});
```

---

### 5️⃣ Start the Server

```bash
node server.js
```

You should see:
```
Server is running at http://localhost:3000
Connected to MySQL database!
```

---

### 6️⃣ Open the Frontend

Open `frontend/index.html` in your browser  
**or** use **Live Server** extension in VS Code.

---

## 🔐 Default Login Credentials

```
Email    :  admin@bloodcare.io
Password :  admin123
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/donors` | Get all donors |
| POST | `/api/donors` | Add new donor |
| PUT | `/api/donors/:id` | Update donor |
| DELETE | `/api/donors/:id` | Delete donor |
| GET | `/api/stock` | Get blood stock |
| POST | `/api/stock` | Add stock entry |
| PUT | `/api/stock/:id` | Update stock |
| DELETE | `/api/stock/:id` | Delete stock |
| GET | `/api/hospitals` | Get hospitals |
| POST | `/api/hospitals` | Add hospital |
| PUT | `/api/hospitals/:id` | Update hospital |
| DELETE | `/api/hospitals/:id` | Delete hospital |
| GET | `/api/donations` | Get donations |
| POST | `/api/donations` | Record donation |
| DELETE | `/api/donations/:id` | Delete donation |
| GET | `/api/requests` | Get requests |
| POST | `/api/requests` | New request |
| PUT | `/api/requests/:id` | Update request |
| DELETE | `/api/requests/:id` | Delete request |
| GET | `/api/distribution` | Get distributions |
| POST | `/api/distribution` | Record distribution |
| DELETE | `/api/distribution/:id` | Delete distribution |
| GET | `/api/expiry` | Get expiry logs |
| POST | `/api/expiry` | Log expiry |
| DELETE | `/api/expiry/:id` | Delete log |

---

## 👨‍💻 Developer

**Ayyan Mirani**  
GitHub: [@AyyanMirani77](https://github.com/AyyanMirani77)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

<div align="center">
  Made with ❤️ and ☕ by Ayyan Mirani
  <br><br>
  ⭐ Star this repo if you found it helpful!
</div>
