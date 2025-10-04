# Retail Management Panel

A retail management dashboard built with **Next.js (App Router)**, TypeScript, and localstoreage-based authentication. Uses local storage auth for route protection, and client-side state handling for UI.

Live Demo / Deployment Link :- https://retail-panel.netlify.app/login  
[Repository](https://github.com/jainam7/retail-management-panel)

## Features

- Signup Page
- login/logout Page
- Dashboard Page
- Inventory Page
- Deliveries Page
- Orders Page
- Setting Page
- Sidebar navigation with links to dashboard, inventory, orders, deliveries, settings
- Responsive UI (desktop + mobile)
- TypeScript for type safety
- Clean architecture with modular components

## Tech Stack & Design Decisions

| Layer | Technology | Why / Notes |

| Framework | Next.js (App Router) | Leverages file-based routing, layouts, server + client components |
| Language | TypeScript | Static typing, better DX, fewer runtime errors |
| Styling | Tailwind CSS (via your setup) | Utility-first styling for responsiveness |
| State & Auth | Redux (for auth state) + localStorage | UI state managed client-side
| Directory organization | Modular, clean separation | Easier to maintain as app grows |

### Clone & Install

```bash
git clone https://github.com/jainam7/retail-management-panel.git
cd retail-management-panel
npm install
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
