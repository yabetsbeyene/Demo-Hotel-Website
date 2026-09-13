# PostgreSQL database foundation

This directory contains the v1 schema for Abebe Zeleke International Hotel.

## Create the database

```sql
CREATE DATABASE abebe_zeleke_hotel;
```

Apply the schema from `psql`:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

The schema now also creates `admin_sessions` and `audit_logs`. Re-run the full
schema against a fresh database, or apply the new table definitions as a
migration if the database already contains the earlier version.

The schema enables `pgcrypto` for UUID generation and creates:

- `room_types` — bookable categories such as Deluxe Suite; `total_rooms` stores inventory.
- `bookings` — one flat reservation request with guest details, dates, status, and requested room count.
- `meeting_inquiries` — separate corporate and event requests.
- `gallery_images` — hotel imagery, optionally linked to a room type.
- `admin_users` — minimal staff dashboard login records.
- `admin_sessions` — hashed, expiring httpOnly-cookie sessions.
- `audit_logs` — staff actions for operational traceability.

## Availability

Availability is calculated per room type and date range:

```sql
SELECT room_type_available_rooms(
  '<room-type-uuid>',
  DATE '2026-10-10',
  DATE '2026-10-14'
);
```

Bookings with `pending` and `confirmed` status hold inventory. Cancelled, completed, and no-show bookings do not.

When creating a booking, the application should check availability and insert the booking in the same transaction. Use a transaction-level advisory lock per room type/date range if multiple users may book concurrently; the function alone is read-only and cannot prevent a race between two simultaneous inserts.

## Admin setup

Copy `.env.example` to `.env.local`, set `DATABASE_URL`, and apply the schema.
Then create the first staff account:

```bash
npm run admin:create
```

The password is hashed with Node's scrypt implementation. The dashboard is
protected by an expiring, hashed session token; staff can manage bookings and
meeting inquiries, while only `admin` users can edit room types or upload/delete
gallery images.

For production, put images behind object storage/CDN and replace the local
`public/uploads` adapter in `app/api/admin/gallery/route.ts`.

## Important implementation notes

- Store password hashes only; never store plaintext admin passwords.
- Generate `confirmation_code` in the application and make it human-readable.
- Store uploaded image files in object storage and save only their URL in `gallery_images.image_url`.
- Keep all database timestamps in UTC and format them for the guest's locale in the application.
- `pending` reservation expiry is an application concern for v1. A later migration can add `hold_expires_at` if pending bookings should release inventory automatically.
