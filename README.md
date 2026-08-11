<div align="center">
<img width="1774" height="692" alt="updated" src="https://github.com/user-attachments/assets/3038edbc-399c-44e4-98ee-2c466805744b" />



# FinBoard

A personal finance dashboard for budgeting, transaction tracking, and financial insights. Track your spending, your way - free to start, with more unlocked once you create an account :)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-4CAF50?style=flat-square)](https://finnboard0.netlify.app/)
[![Stars](https://img.shields.io/github/stars/khanirfan18/finBoard?style=flat-square)](https://github.com/khanirfan18/finBoard/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](https://github.com/khanirfan18/finBoard/blob/main/LICENSE)

</div>

---

## Features

- **Interactive Dashboard** — real-time visualizations of your financial health
- **Budget Management** — set limits and track expenses per category
- **Transaction History** — search, filter, and categorize with full visibility
- **Smart Insights** — spending patterns and trends via [Recharts](https://recharts.org/)
- **CSV Import** — drag-and-drop transaction import
- **Multi-currency support**

## Privacy

FinBoard is a client-side experience with minimal external dependencies. Data is stored securely via [Supabase](https://supabase.com/), with optional social auth ([setup guide](https://github.com/khanirfan18/finBoard/blob/main/SOCIAL_AUTH_SETUP.md)).

## Getting Started

Requires [Node.js](https://nodejs.org/). You'll also need a [Supabase](https://supabase.com/) project — copy `.env.example` to `.env` and fill in your credentials ([setup guide](https://github.com/khanirfan18/finBoard/blob/main/SUPABASE_SETUP.md)).

```bash
git clone https://github.com/khanirfan18/finBoard.git
cd finBoard
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> **Docker:** a `docker-compose.yml` and Dockerfiles exist in the repo but aren't wired up properly yet — stick to Node.js for now.

## Tech Stack

React 19 · Vite · Tailwind CSS · daisyUI · Supabase · Recharts · PapaParse

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](https://github.com/khanirfan18/finBoard/blob/main/CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](https://github.com/khanirfan18/finBoard/blob/main/CODE_OF_CONDUCT.md).

Found a bug or have an idea? [Open an issue.](https://github.com/khanirfan18/finBoard/issues)

## License

[MIT](https://github.com/khanirfan18/finBoard/blob/main/LICENSE)
