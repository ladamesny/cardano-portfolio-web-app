# Cardano Portfolio Web App

A full-stack web application for tracking Cardano cryptocurrency portfolios, built with Rust (Axum) backend and Next.js frontend.

## Prerequisites

- **Rust** (latest stable version)
- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **Blockfrost API key** (get one at [blockfrost.io](https://blockfrost.io))

## Project Structure

```
.
├── backend/          # Rust/Axum API server
├── frontend/         # Next.js React application
└── docker-compose.yml # PostgreSQL database configuration
```

## Setup

### 1. Start PostgreSQL Database

Use Docker Compose to run the PostgreSQL database:

```bash
docker-compose up -d
```

This will start a PostgreSQL instance with:
- **User:** `cardano_user`
- **Password:** `cardano_password`
- **Database:** `cardano_portfolio`
- **Port:** `5432`

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a `.env` file from the example:

```bash
cp env.example .env
```

Edit `.env` and add your Blockfrost API key:

```
DATABASE_URL=postgres://cardano_user:cardano_password@localhost:5432/cardano_portfolio
BLOCKFROST_API_KEY=your_actual_blockfrost_project_id
CARDANO_SERVICE_URL=https://cardano-preview.blockfrost.io/api/v0
```

Install dependencies:

```bash
cargo build
```

Run database migrations:

```bash
cd migration
cargo run
cd ..
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

## Running the Application

### Start the Backend

From the `backend/` directory:

```bash
cargo run
```

The API server will start on `http://localhost:8000`

### Start the Frontend

From the `frontend/` directory:

```bash
npm run dev
```

The Next.js application will start on `http://localhost:3000`

## Development Workflow

1. Ensure PostgreSQL is running: `docker-compose up -d`
2. Start the backend server: `cd backend && cargo run`
3. Start the frontend dev server: `cd frontend && npm run dev`
4. Access the application at `http://localhost:3000`

## Stopping the Application

- Stop frontend/backend: `Ctrl+C` in their respective terminals
- Stop PostgreSQL: `docker-compose down`
- Stop PostgreSQL and remove data: `docker-compose down -v`

## Additional Commands

### Backend

- Run migrations: `cd migration && cargo run`
- Build for production: `cargo build --release`
- Run tests: `cargo test`

### Frontend

- Build for production: `npm run build`
- Start production server: `npm start`
- Run linter: `npm run lint`

## Troubleshooting

- **Database connection errors:** Ensure PostgreSQL is running with `docker-compose ps`
- **Port conflicts:** Check that ports 5432, 8000, and 3000 are not in use
- **Migration issues:** Verify your `DATABASE_URL` in `backend/.env` matches the Docker Compose configuration
