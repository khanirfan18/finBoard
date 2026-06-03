<div align="center">
   <p><strong>
    FinBoard helps users manage budgets, monitor transactions, and analyze spending trends through interactive visualizations while keeping financial data organized and accessible.
  </strong></p>
  <p>
    <a href="https://finnboard0.netlify.app/">
      <img src="https://img.shields.io/badge/Visit%20Now-4CAF50?style=for-the-badge">
    </a>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  </p>
   <img width="1536" height="899" alt="FinBoard Dashboard Preview" src="https://github.com/user-attachments/assets/71259266-b4ac-4777-a412-f9823a7a8977" />
</div>

---

## <p align="center"><strong>A retro-themed personal finance dashboard for budgeting, transaction tracking, and financial insights.</strong></p>

## ✨ Features
<table>
  <tr>
    <td align="center" width="50%">
      <img src="src/assets/picture2.png" alt="Budget Management" width="100%"><br>
      <b>📊 Interactive Dashboard</b><br>
      <sub>Monitor your financial health at a glance with powerful real-time visualizations.</sub>
    </td>
    <td align="center" width="50%">
      <img src="src/assets/picture3.png" alt="Transaction History" width="100%"><br>
      <b>💰 Budget Management</b><br>
      <sub>Set limits, track expenses per category, and work toward financial goals.</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="src/assets/picture4.png" alt="Financial Insights" width="100%"><br>
      <b>📜 Transaction History</b><br>
      <sub>Search, filter, and categorize transactions with complete visibility.</sub>
    </td>
    <td align="center" width="50%">
      <img src="src/assets/picture5.png" alt="Secure Local Data" width="100%"><br>
      <b>🧠 Smart Insights</b><br>
      <sub>Identify spending patterns, income trends, and top categories over time.</sub>
    </td>
  </tr>
</table>

---

## 🔒 Privacy First

Your financial data remains under your control.

* **Client-side experience** with minimal external dependencies
* **CSV Import** for transaction analysis and management
* **Multi-currency Support** for flexible financial tracking
* **Secure storage options** through the application's supported integrations

---

## 🚀 Getting Started

### Prerequisites

* Node.js v18 or higher
* npm (included with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/khanirfan18/finBoard.git

# Navigate into the project
cd finBoard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open:

```text
http://localhost:5173
```
## 🔧 Local Development Setup

FinBoard uses Supabase for authentication and data storage.

Before running the application locally, configure your Supabase project and environment variables by following the setup guide:

* [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

If you encounter:

```text
Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY
```

make sure you have completed the Supabase setup steps and created the required `.env` file.


## 🛠 Tech Stack

| Layer              | Technologies              |
| ------------------ | ------------------------- |
| Frontend           | React, React Router       |
| Build Tool         | Vite                      |
| Styling            | Tailwind CSS, DaisyUI     |
| Charts             | Recharts                  |
| Icons              | Lucide Icons, Custom SVGs |
| Backend / Database | Supabase                  |

---

## 🤝 Contributing

Contributions are welcome.

Before opening an issue or submitting a pull request, please review:

* [CONTRIBUTING.md](./CONTRIBUTING.md)
* [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

### Guidelines

* Follow the issue creation process outlined in the contribution guide
* Claim tasks before beginning work
* Align contributions with the project's scope and roadmap
* Write clear and meaningful commit messages and pull request descriptions
* Maintain respectful and constructive communication

> Docker support is part of the long-term roadmap and is currently reserved for maintainer use. Docker-related contributions are out of scope unless explicitly requested by a maintainer.

---

## 📄 License

This project is licensed under the terms specified in the [LICENSE](./LICENSE) file.
