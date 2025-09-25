# Beerhood: AI-Enhanced Craft Beer E-Commerce Platform

[![Beerhood](https://img.shields.io/badge/Beerhood-AI--Enhanced%20Craft%20Beer-f39c12)](https://github.com/Beerhood)
[![Version](https://img.shields.io/badge/version-0.1.0-blue)](https://github.com/Beerhood/beer-shop-ai)
[![License](https://img.shields.io/badge/license-Apache--2.0-amber)](https://github.com/Beerhood/beer-shop-ai/blob/main/LICENSE)

## 🍺 Project Overview

Beerhood is a next-generation e-commerce platform designed for craft beer enthusiasts, offering a comprehensive selection of beers, ciders, soft drinks, and complementary snacks. What sets Beerhood apart is its integrated AI assistant that provides personalized recommendations and expert guidance on craft beer selections.

## 📋 Core Features

### Product Catalog & Discovery

-   **Comprehensive Inventory Management**: Browse through a diverse range of beverages and complementary products
-   **Advanced Search & Filtering**: Find products by origin country, style, ABV percentage, IBU rating, density, brand, and more
-   **Detailed Product Pages**: High-resolution imagery, comprehensive descriptions, specifications, and pricing information

### User Authentication & Management

-   **Multi-platform Authentication**: Sign in using OAuth providers (Google, Facebook) or traditional email/password
-   **Account Security**: Robust password recovery and reset functionality with multi-factor authentication
-   **User Profile**: Comprehensive profile management including contact details, date of birth verification, and delivery addresses

### Shopping Experience

-   **Interactive Cart Management**: Add, remove, and adjust quantities with real-time total calculation
-   **Streamlined Checkout Process**: Optimized flow for shipping information, payment options, and order confirmation

### AI-Powered Beer Assistant

-   **Personalized Recommendations**: Uses AI assistant to suggest products based on user preferences and past purchases
-   **Interactive Consultation**: Conversational interface for helping users discover new beers matching their taste profiles
-   **Knowledge Base**: Comprehensive information about beer styles, brewing techniques, and food pairings

### Engagement & Communication

-   **Product Reviews & Ratings**: User-generated content to help inform purchasing decisions
-   **Transactional Email Notifications**: Order confirmations and shipping updates

## 🛠️ Technology Stack

-   **Frontend**: Angular + Angular material / PrimeNG
-   **Backend**: Node.js, Nest.js, RabbitMQ, RESTful API
-   **Database**: PostgreSQL (with Prisma)
-   **AI Integration**: [Groq](https://console.groq.com/home) API for the beer assistant
-   **Authentication**: JWT, OAuth 2.0
-   **Tooling**: Docker; CI/CD with GitHub Actions; Pre-commit checks with Husky
-   **Cloud Infrastructure**: Google Cloud deployment

## 🚀 Installation & Setup

Clone the repository

```bash
git clone https://github.com/Beerhood/beer-shop-ai.git
```

Navigate to the project directory

```bash
cd beer-shop-ai
```

Install dependencies

```bash
npm install
```

Configure environment variables and edit with your configuration

```bash
cp .env.example .env
```

Start development server

```bash
npm run dev
```

## 📬 Contact

-   **Project Lead**: [Zhukov Vladyslav](mailto:zhukov.vladyslav.vitaliyovych@gmail.com)
-   **Full Stack**: [Buryachok Oleh](https://t.me/kowaaalskii)
-   **Full Stack**: [Kurenkov Maksym](https://t.me/Pelmen_3000)

---

© 2025 Beerhood. All Rights Reserved.
