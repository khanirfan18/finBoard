<div align="left">

# FINBOARD

A retro-styled, interactive personal finance dashboard to manage budgets, visualize transactions, and keep track of your spending securely in your browser.

</div>

<p align="center">
  <img width="1740" height="1011" alt="FinBoard Preview" src="https://github.com/user-attachments/assets/52fd99d8-7df9-41b0-bc31-65bb7fe09edd" />
</p>

---

## ✨ Features

<table>
<tr>

<td width="60%">

📊 **Interactive Dashboard**  
Visualize income and expenses using dynamic Recharts.

💰 **Budget Management**  
Set spending limits and monitor progress.

📜 **Transaction History**  
View, filter, and categorize transactions.

📁 **Secure Local Data**  
No backend needed — your financial data stays in your browser.

💻 **Retro UI Design**  
Dark grid terminal aesthetic with a nostalgic modern feel.

</td>

<td width="40%" align="center">

<img src="src/assets/finb.gif" alt="FinBoard Demo" width="260"/>

</td>

</tr>
</table>

---

## 🚀 Tech Stack

| Category | Tech |
|-----------|-------|
| Frontend | React, React Router |
| Build Tool | Vite |
| Styling | Tailwind CSS, DaisyUI |
| Charts | Recharts |
| Icons | Lucide Icons, Custom SVG |

---

## 🛠️ Getting Started

### Prerequisites

Choose your preferred setup:

- **Node.js** → https://nodejs.org/
- **Docker + Docker Compose** → https://docs.docker.com/get-docker/

---

### Option 1 — Node.js (Classic)

1. Clone repository

```bash
git clone https://github.com/khanirfan18/finBoard.git
cd finBoard
```

2. Install packages

```bash
npm install
```

3. Start development server

```bash
npm run dev
```

Open http://localhost:5173

---

### Option 2 — Docker (Recommended for Contributors)

1. Clone repository

```bash
git clone https://github.com/khanirfan18/finBoard.git
cd finBoard
```

2. Start development server

```bash
docker compose up dev --build
```

Open http://localhost:5173

> Code changes reflect instantly via Vite HMR — no restart needed after the first run.

#### Production build

```bash
docker compose up prod --build
```

Open http://localhost:80

---

## 🤝 Contributing

Planning to contribute?

Your contributions are appreciated. Please read `CONTRIBUTING.md` before opening issues or submitting pull requests.

It covers:

- Valid issue creation
- Task claiming workflow
- Pull request guidelines

Happy building 🚀