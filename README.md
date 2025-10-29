# Use the Private Network

A live demo comparing the latency of connecting colocated services on Railway with private networking versus the public internet.

🌐 **Live Demo:** [use-the-private-network.up.railway.app](https://use-the-private-network.up.railway.app)

## Overview

This project demonstrates the performance benefits of using Railway's private networking feature. When you colocate services on Railway, you can connect them using private networking, which is:

- **Faster** - Lower latency by avoiding the public internet
- **More Secure** - Services communicate over an isolated private network
- **Cost-Effective** - No egress fees for data transfer between services

## How It Works

This is a full-stack [TanStack Start](https://tanstack.com/start/latest) application that:

1. Runs a series of database queries (10 iterations) using both private and public network connections
2. Measures latency metrics for each connection type:
   - Server ↔ Database query latency
   - Total round-trip time
3. Calculates and displays statistical comparisons:
   - Average latency
   - Median latency
   - 95th percentile (p95) latency
4. Visualizes the results with interactive bar charts

Both the application and PostgreSQL database run in the same US-East (Virginia, USA) region on Railway.

## Architecture

### Technology Stack

- **Framework:** [TanStack Start](https://tanstack.com/start/latest) - Full-stack React framework
- **Runtime:** Bun
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **Charts:** Recharts
- **State Management:** TanStack Query

### Project Structure

```
src/
├── routes/
│   ├── index.tsx                    # Main landing page with test UI
│   └── api/
│       ├── compare-latency.tsx      # Private network endpoint
│       └── compare-latency-public.tsx # Public network endpoint
├── lib/
│   └── db/
│       └── index.ts                 # Database connection configs
└── components/                      # UI components
```

### Database Connections

The app uses two separate database connections:

- **Private Network:** `DATABASE_URL` - Uses Railway's private networking (internal connection)
- **Public Network:** `DATABASE_PUBLIC_URL` - Uses the public internet connection

Both connections query the same PostgreSQL database but take different network paths.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- A Railway account (sign up at [railway.com](https://railway.com))
- A PostgreSQL database on Railway

### Local Development

1. Clone the repository:

```bash
git clone <repository-url>
cd use-the-private-network
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

```bash
# Create a .env file with:
DATABASE_URL=postgresql://...              # Private network connection string. As a workaround, you can use the public connection string here for testing purposes.
DATABASE_PUBLIC_URL=postgresql://...       # Public connection string
```

4. Run the development server:

```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Understanding the Results

When you run the latency test, you'll see:

### Metrics Explained

- **Server ↔ Database:** The time it takes for a query to execute on the database
- **Round-Trip Time:** The total time including network overhead and API processing
- **Average:** Mean latency across all queries
- **Median:** Middle value when all latencies are sorted
- **p95:** 95th percentile - 95% of queries are faster than this value

### Expected Results

Typically, the private network connection will show:

- ✅ Lower latency (often 30-50% faster)
- ✅ More consistent performance (lower variance)
- ✅ Better p95 values

The public network connection may be affected by:

- Internet routing delays
- Geographic distance (even within the same region)
- Network congestion
- Additional security layers

## Related Links

- [Railway Private Networking Documentation](https://docs.railway.com/reference/private-networking)
- [TanStack Start Documentation](https://tanstack.com/start/latest)
- [Railway Platform](https://railway.com)

---

Deployed on [Railway](https://railway.com?referralCode=thisismahmoud) 🚄
