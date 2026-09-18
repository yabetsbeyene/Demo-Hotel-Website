# Database Setup

Abebe Zeleke Hotel uses PostgreSQL for rooms, bookings, guests, and admin data.

## Quick setup

1. Create a database named `abebe_zeleke_hotel`.
2. Add your connection string to `.env.local`:

```env
DATABASE_URL=your_postgres_connection_string
```

3. Apply the schema:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

4. Create the first admin account:

```bash
npm run admin:create
```

Start the app with:

```bash
npm run dev
```
