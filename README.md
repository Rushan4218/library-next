# 📚 Rulib - Library Management System

**Rulib** is a modern, high-performance web application built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Shadcn UI** primitives. Designed as a seamless frontend for the **FastAPI Library Management Backend**, Rulib provides an intuitive experience for public users and library administrators.

---

## 🌟 Key Features

### 📖 1. Public Book Catalog & Search (`/books`)
- **Real-Time Search & Filters**: Search catalog by book title, author, or ISBN.
- **Category & Status Pills**: Filter by categories (`Technology`, `Computer Science`, `Sci-Fi & Fantasy`, `Psychology`, `Self-Help`) and availability status (`AVAILABLE`, `BORROWED`, `MAINTENANCE`, `RESERVED`).
- **Detailed Book Pages (`/books/[id]`)**: Full book metadata, category tags, availability status, and synopsis.

### 🎟️ 2. Online Borrowing & Physical Pick-up Token (`BorrowModal` & `/borrow/success`)
- **Online Reserve Request**: Users submit contact information (`name`, `email`, `phone`, `address`).
- **Token Receipt & QR Code**: Instantly generates a unique physical pickup token (e.g. `LIB-9X82-K4M1`) with a QR visual, physical desk instructions, and printable receipt.

### 🔍 3. Pick-up Token Verification Tool (`/verify`)
- Public & Staff lookup tool for verifying token validity, borrower info, book details, and lifecycle audit timeline (`Reserved` → `Fulfilled` → `Returned`).

### 🔐 4. Admin Authentication (`/admin/login`)
- **Environment-Based JWT Auth**: Form authenticating against `POST /api/v1/auth/login/json`. Default admin credentials:
  - **Username**: `admin`
  - **Password**: `adminsecret`
- Persistent auth state managed via React Context.

### 📚 5. Admin Catalog Management (`/admin/books`)
- Complete CRUD operations: Add new books, edit existing details, delete books with confirmation dialogs.
- Quick status overrides (`AVAILABLE`, `BORROWED`, `MAINTENANCE`, `RESERVED`).

### 📋 6. Admin Borrowing History & Returns (`/admin/history`)
- Full audit log with filters for status and search by token or borrower email.
- **Fulfill Pickup** (`PATCH /admin/borrowing-history/{id}/fulfill`): Marks physical pickup as completed (`FULFILLED`).
- **Process Return** (`PATCH /admin/borrowing-history/{id}/return`): Sets borrow record to `RETURNED` and automatically resets book availability back to `AVAILABLE`.

---

## 🎨 Design & UI Architecture

Rulib uses a custom **Shadcn UI** component design system with no default browser elements:
- `Button`: Multiple variants (`default`, `outline`, `ghost`, `destructive`, `gradient`) with loading spinners.
- `Input`: Unstyled native override with focus rings and leading icons.
- `Textarea`: Smooth textarea with uniform border styling.
- `Select`: Custom animated popover dropdown replacing native browser `<select>` elements.
- `Toast`: Custom floating toast notification system replacing browser `alert()` popups.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **Backend API** | FastAPI (`http://localhost:8000/api/v1`) |
| **Resiliency** | Automatic client-side fallback store when API server is offline |

---

## 🚀 Quickstart & Setup Guide

### 1. Installation
Install dependencies using `pnpm` (or `npm` / `yarn`):

```bash
pnpm install
```

### 2. Environment Configuration
Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` (defaults to `http://localhost:8000/api/v1`):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

### 3. Run Development Server
Start the Next.js dev server:

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser.

---

## 📜 Available Scripts

- `pnpm dev`: Starts dev server with Turbopack auto-reload.
- `pnpm build`: Compiles TypeScript and builds production bundle.
- `pnpm start`: Runs production build server.
- `pnpm lint`: Runs ESLint code quality checks.

---

## 📄 License
MIT License. Built for the Rulib Library Management System.
