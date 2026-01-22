# GoDraw

GoDraw is a modern, scalable collaborative drawing application built using a monorepo architecture. It is designed for real-time sketching, diagramming, and whiteboarding with a strong emphasis on performance, maintainability, and developer experience.

The project leverages Next.js, TypeScript, Turborepo, and pnpm workspaces, making it suitable for large-scale frontend systems and collaborative platforms.

# 🚀 Features

- Interactive canvas for drawing and diagramming
- Modular monorepo architecture
- Shared UI components and configurations
- Type-safe codebase using TypeScript
- Optimized builds with Turborepo
- Scalable project structure for future real-time collaboration
- ESLint and Prettier configured for consistent code quality

# 🧱 Monorepo Architecture

The project is organized as a pnpm + Turborepo monorepo, enabling shared packages and faster builds.

# High-Level Structure

```
GoDraw-main/
├── apps/
│ └── frontend/ # Next.js frontend application
│
├── packages/
│ ├── ui/ # Shared UI components
│ ├── db/ # Prisma database layer
│ ├── eslint-config/ # Shared ESLint configurations
│ └── typescript-config/ # Shared TypeScript configs
│
├── turbo.json # Turborepo pipeline configuration
├── pnpm-workspace.yaml # pnpm workspace definition
├── package.json # Root configuration
└── README.md
```

# 🛠 Tech Stack

- Frontend: Next.js, React, TypeScript
- Monorepo Tooling: Turborepo, pnpm
- Styling: Modern CSS / component-based styling
- Linting & Formatting: ESLint, Prettier
- Database (Planned / Integrated): Prisma

# ⚙️ Prerequisites

Ensure the following are installed on your system:

- Node.js >= 18
- pnpm >= 9

# 📦 Installation

Clone the repository:
```
git clone https://github.com/your-username/GoDraw.git

```

Navigate into the project directory:
```
cd GoDraw-main
```

Install dependencies:
```
pnpm install
```

# ▶️ Running the Project

# Development Mode
```
pnpm dev
```

# Build
```
pnpm build
```

# Linting
```
pnpm lint
```

# Type Checking
```
pnpm check-types
```

# 🎯 Design Philosophy

- Scalability First: Designed to grow with additional apps and services
- Code Reuse: Shared UI, configs, and tooling across applications
- Performance: Incremental builds and caching via Turborepo
- Maintainability: Strict typing and consistent linting

# 🔮 Future Enhancements

- Real-time collaboration using WebSockets or WebRTC
- Authentication and user sessions
- Cloud persistence for drawings
- Multiplayer cursors and presence indicators
- Export to SVG / PNG / PDF

# 👨‍💻 Author

Prithvi Reddy

# 📄 License

This project is currently intended for educational and experimental purposes. Licensing can be added as the project evolves.
