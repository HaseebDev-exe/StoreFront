# Next.js StoreFront Template 🛒✨

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

A modern, high-performance, and fully-featured e-commerce storefront template built with the React App Router, Drizzle ORM, and Tailwind CSS. This project serves as a robust starting point for building scalable online stores.

---

## ✨ Features

- **Modern Framework:** Built on **Next.js 16** utilizing the App Router for server components and enhanced performance.
- **Robust Database & ORM:** Powered by **PostgreSQL** (optimized for Neon) and type-safe database interactions with **Drizzle ORM**.
- **Secure Authentication:** Integrated **NextAuth.js (Auth.js v5)** for secure session management and credential authentication.
- **Accessible UI:** Styled with **Tailwind CSS v4** and headless, accessible primitive components from **Radix UI**.
- **Seeded Data:** Comes with a built-in database seeder for testing with mock products and user roles.
- **Responsive Design:** Fully responsive, mobile-first design strategy.

---

## 🛠 Tech Stack

- **Core:** [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), `clsx`, `tailwind-merge`
- **UI Components:** [Radix UI](https://www.radix-ui.com/), Lucide Icons
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Database:** [PostgreSQL](https://www.postgresql.org/), [Neon](https://neon.tech/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [Auth.js (NextAuth v5)](https://authjs.dev/), `bcryptjs`

---

## 📁 Project Structure

```text
├── src/
│   ├── actions/       # Server actions for handling mutations (auth, orders, products)
│   ├── app/           # Next.js App Router (pages, layouts, api routes)
│   ├── components/    # Reusable UI components (buttons, dialogs, inputs)
│   ├── db/            # Database schema, Drizzle config, and seed script
│   └── lib/           # Utility functions and NextAuth configuration
├── public/            # Static assets (images, fonts, favicons)
├── .env               # Environment variables (ignored in git)
├── drizzle.config.ts  # Drizzle Kit configuration file
├── next.config.ts     # Next.js configuration
└── package.json       # Project dependencies and scripts
```

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### 1. Prerequisites

- **Node.js** (v18.17 or higher)
- **npm**, **yarn**, or **pnpm**
- A **PostgreSQL** database instance (e.g., local Postgres or a cloud provider like [Neon](https://neon.tech/))

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/storefront.git
cd storefront
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root of the project based on the `.env.example` (or copy the snippet below):

```env
# Your PostgreSQL connection string
# (If using Neon with SSL, make sure to add: ?sslmode=require&uselibpqcompat=true)
DATABASE_URL="postgresql://user:password@host:port/database"

# A secure random string for Auth.js cookie encryption
# Generate one using: `npx auth secret` or by running `openssl rand -hex 32`
AUTH_SECRET="your-secure-random-secret"
```

### 4. Database Setup & Migrations

Push the Drizzle schema to your connected PostgreSQL database to create the required tables:

```bash
npx drizzle-kit push
```

### 5. Seed the Database

Populate your database with mock products and default user accounts to test the application immediately:

```bash
npx tsx --env-file=.env src/db/seed.ts
```

> **Default Test Credentials:**
> - **Admin:** `admin@storefront.com` / `admin123`
> - **User:** `user@storefront.com` / `user123`

### 6. Start the Development Server

Finally, run the app locally:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to view the application!

---

## 📦 Available Scripts

In the project directory, you can run:

- `npm run dev` - Starts the Next.js development server.
- `npm run build` - Creates an optimized production build.
- `npm run start` - Starts the Next.js production server.
- `npm run lint` - Runs ESLint to identify code issues.
- `npm run typecheck` - Runs the TypeScript compiler to check for type errors.
- `npx drizzle-kit studio` - Opens the Drizzle Studio visual database browser.

---

## ☁️ Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Configure your Environment Variables (`DATABASE_URL`, `AUTH_SECRET`) in the Vercel dashboard.
4. Deploy!

*Note: For the database, we highly recommend using [Neon serverless Postgres](https://neon.tech/) which integrates seamlessly with Vercel.*

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
