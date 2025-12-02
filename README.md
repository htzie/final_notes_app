# Final Notes App (Full-Stack)  
A secure, full-stack Notes Application with authentication, MySQL database, Docker Compose deployment, and automated CI/CD using Jenkins.

This project includes:

- **User registration & login (JWT authentication)**
- **User-specific notes (CRUD)**
- **MySQL database with automatic initialization**
- **Next.js 13 frontend**
- **Express.js API backend**
- **Docker Compose for production**
- **Jenkins pipeline for automated deployment**
- **phpMyAdmin for DB management**

---

## Tech Stack

### **Frontend**
- Next.js 13 (App Router)
- React (Client Components)
- Fetch API with JWT Authorization
- Dockerized build and runtime

### **Backend**
- Node.js + Express
- MySQL2 (connection pool)
- JWT authentication
- Bcrypt password hashing
- Modular routes + controllers

### **Infrastructure**
- Docker Compose (MySQL, phpMyAdmin, API, Frontend)
- Jenkins CI/CD Pipeline
- Automatic `.env` creation from Jenkins credentials

---

## 📁 Project Structure

- final_notes_app/
- │
- ├── 01_api/ # Backend (Express API)
- │ ├── controllers/
- │ ├── middleware/
- │ ├── routes/
- │ ├── db.js
- │ ├── index.js
- │ └── Dockerfile
- │
- ├── 02_frontend/ # Frontend (Next.js)
- │ ├── app/
- │ ├── public/
- │ ├── next.config.mjs
- │ └── Dockerfile
- │
- ├── init.sql # Auto database setup
- ├── docker-compose.yml # Full stack deployment
- ├── Jenkinsfile # Automated CI/CD pipeline
- └── .env.example
  
---

## Environment Variables

`.env.example` (Jenkins generates `.env` automatically):

- MYSQL_ROOT_PASSWORD=rootpassword
- MYSQL_DATABASE=notes_app
- MYSQL_USER=notes_user
- MYSQL_PASSWORD=notes_pass
- MYSQL_PORT=3306
- API_PORT=3001
- FRONTEND_PORT=3000
- PHPMYADMIN_PORT=8888
- DB_PORT=3306
- API_HOST=http://api:3001
- NODE_ENV=production

