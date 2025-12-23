# SparkDrive Backend Server

A production-ready backend server for a cloud file storage platform (SparkDrive), built as part of a Backend Developer Assessment.  
This project follows a clean modular architecture with authentication, file & folder management, OTP verification, statistics tracking, and integrations with third-party services.

---

## 🚀 Live Project Type

Backend REST API (Node.js + TypeScript)

---

## 🧠 Key Features

- JWT-based Authentication (Access & Refresh Tokens)
- Role-based Authorization (User / Super Admin)
- Passport JS OAuth Authentication
- Passport JS For Local Login
- File Upload & Management (Cloudinary & Multer)
- Folder Management with Protected Access
- OTP-based Email Verification & Password Reset
- Redis OTP Catching
- Email Service using SMTP
- Global Error Handling & Validation
- Modular & Scalable Architecture

---

## 🛠️ Tech Stack

- **Runtime:** Bun
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, Passport (Google OAuth)
- **Caching:** Redis
- **File Storage:** Cloudinary
- **Email:** SMTP (EJS Templates)
- **Validation:** Zod
- **Deployment Ready:** Vercel

---

## 📂 Project Folder Structure

```
├── 📁 src
│   ├── 📁 app
│   │   ├── 📁 config
│   │   │   ├── 📄 cloudinary.config.ts
│   │   │   ├── 📄 env.ts
│   │   │   ├── 📄 multer.config.ts
│   │   │   ├── 📄 passport.ts
│   │   │   └── 📄 redis.config.ts
│   │   ├── 📁 errorHelpers
│   │   │   └── 📄 AppError.ts
│   │   ├── 📁 helpers
│   │   │   ├── 📄 handleCastError.ts
│   │   │   ├── 📄 handleDuplicateError.ts
│   │   │   ├── 📄 handleValidationError.ts
│   │   │   └── 📄 handleZodError.ts
│   │   ├── 📁 interfaces
│   │   │   ├── 📄 error.type.ts
│   │   │   └── 📄 index.d.ts
│   │   ├── 📁 middlewares
│   │   │   ├── 📄 checkAuth.ts
│   │   │   ├── 📄 globalErrorHandler.ts
│   │   │   ├── 📄 notFound.ts
│   │   │   └── 📄 validateRequest.ts
│   │   ├── 📁 modules
│   │   │   ├── 📁 auth
│   │   │   │   ├── 📄 auth.controller.ts
│   │   │   │   ├── 📄 auth.route.ts
│   │   │   │   └── 📄 auth.service.ts
│   │   │   ├── 📁 file
│   │   │   │   ├── 📄 file.controller.ts
│   │   │   │   ├── 📄 file.interface.ts
│   │   │   │   ├── 📄 file.model.ts
│   │   │   │   ├── 📄 file.route.ts
│   │   │   │   ├── 📄 file.service.ts
│   │   │   │   └── 📄 file.validation.ts
│   │   │   ├── 📁 folder
│   │   │   │   ├── 📄 folder.controller.ts
│   │   │   │   ├── 📄 folder.interface.ts
│   │   │   │   ├── 📄 folder.model.ts
│   │   │   │   ├── 📄 folder.route.ts
│   │   │   │   ├── 📄 folder.service.ts
│   │   │   │   └── 📄 folder.validation.ts
│   │   │   ├── 📁 otp
│   │   │   │   ├── 📄 otp.controller.ts
│   │   │   │   ├── 📄 otp.route.ts
│   │   │   │   └── 📄 otp.service.ts
│   │   │   ├── 📁 stats
│   │   │   │   ├── 📄 stats.controller.ts
│   │   │   │   ├── 📄 stats.interface.ts
│   │   │   │   ├── 📄 stats.model.ts
│   │   │   │   ├── 📄 stats.route.ts
│   │   │   │   └── 📄 stats.service.ts
│   │   │   └── 📁 user
│   │   │       ├── 📄 user.constant.ts
│   │   │       ├── 📄 user.controller.ts
│   │   │       ├── 📄 user.interface.ts
│   │   │       ├── 📄 user.model.ts
│   │   │       ├── 📄 user.route.ts
│   │   │       ├── 📄 user.service.ts
│   │   │       └── 📄 user.validation.ts
│   │   ├── 📁 routes
│   │   │   └── 📄 index.ts
│   │   ├── 📁 utils
│   │   │   ├── 📁 emailTemplates
│   │   │   │   ├── 📄 forgotPassword.ejs
│   │   │   │   ├── 📄 forgotProtectedFolderPIN.ejs
│   │   │   │   └── 📄 otp.ejs
│   │   │   ├── 📄 QueryBuilder.ts
│   │   │   ├── 📄 catchAsync.ts
│   │   │   ├── 📄 clearCookie.ts
│   │   │   ├── 📄 jwt.ts
│   │   │   ├── 📄 seedSuperAdmin.ts
│   │   │   ├── 📄 sendEmail.ts
│   │   │   ├── 📄 sendResponse.ts
│   │   │   ├── 📄 setCookie.ts
│   │   │   └── 📄 userTokes.ts
│   │   └── 📄 constants.ts
│   ├── 📄 app.ts
│   └── 📄 server.ts
├── ⚙️ .gitignore
├── 📝 README.md
├── 📄 bun.lock
├── 📄 eslint.config.mjs
├── ⚙️ package.json
├── ⚙️ tsconfig.json
└── ⚙️ vercel.json
```

## Environments Variables
```bash
PORT=
DB_URL=
NODE_ENV=

BCRYPT_SALT_ROUND=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES=

SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PASSWORD=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

EXPRESS_SESSION_SECRET=

FRONTEND_URL=

# SSLCommerz

SSL_STORE_ID=
SSL_STORE_PASS=
SSL_PAYMENT_API=
SSL_VALIDATION_API=
SSL_IPN_URL=
SSL_SUCCESS_BACKEND_URL=
SSL_FAIL_BACKEND_URL=
SSL_CANCEL_BACKEND_URL=
SSL_SUCCESS_FRONTEND_URL=
SSL_FAIL_FRONTEND_URL=
SSL_CANCEL_FRONTEND_URL=

# Cloudinary

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_URL=

# SMTP Email

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# Redis

REDIS_HOST=
REDIS_PORT=
REDIS_USERNAME=
REDIS_PASSWORD=

## 🧑‍💻 Getting Started (Local Setup)

```bash
# clone
git clone https://github.com/Jaber-Riyan/SparkDrive_Server.git
cd SparkDrive_Server

# Install Dependencies
bun install

# Run in Development Mode
bun dev

# Build for Production
bun run build

```
```

🔐 Authentication Flow

- Login → Access Token + Refresh Token

- Tokens handled via secure HTTP-only cookies

- Role-based route protection middleware

- Google OAuth supported

## 👤 Author

```bash
Jaber Ahmed Riyan
Backend Developer
📍 Bangladesh
```
