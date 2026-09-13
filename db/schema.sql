-- Abebe Zeleke International Hotel
-- PostgreSQL v1 foundation schema

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Keep all timestamps in UTC. The application should convert them for display.
SET TIME ZONE 'UTC';

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(320) NOT NULL,
  password_hash text NOT NULL,
  full_name varchar(160) NOT NULL,
  role varchar(32) NOT NULL DEFAULT 'staff',
  is_active boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT admin_users_role_chk
    CHECK (role IN ('admin', 'staff')),
  CONSTRAINT admin_users_email_chk
    CHECK (length(trim(email)) > 3)
);

CREATE UNIQUE INDEX admin_users_email_lower_uidx
  ON admin_users (lower(email));

CREATE TRIGGER admin_users_set_updated_at
BEFORE UPDATE ON admin_users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash varchar(128) NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  ip_address inet,
  user_agent text
);

CREATE INDEX admin_sessions_user_idx ON admin_sessions (admin_user_id);
CREATE INDEX admin_sessions_expiry_idx ON admin_sessions (expires_at);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  action varchar(80) NOT NULL,
  entity_type varchar(50),
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address inet,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_logs_created_at_idx ON audit_logs (created_at DESC);
CREATE INDEX audit_logs_admin_user_idx ON audit_logs (admin_user_id);

CREATE TABLE room_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(120) NOT NULL UNIQUE,
  name varchar(160) NOT NULL,
  description text,
  bed_type varchar(120),
  size_sqm numeric(7,2),
  max_guests smallint NOT NULL DEFAULT 1,
  total_rooms integer NOT NULL DEFAULT 1,
  base_price numeric(12,2) NOT NULL,
  currency char(3) NOT NULL DEFAULT 'ETB',
  amenities jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT room_types_name_chk
    CHECK (length(trim(name)) > 0),
  CONSTRAINT room_types_size_chk
    CHECK (size_sqm IS NULL OR size_sqm > 0),
  CONSTRAINT room_types_max_guests_chk
    CHECK (max_guests > 0),
  CONSTRAINT room_types_total_rooms_chk
    CHECK (total_rooms > 0),
  CONSTRAINT room_types_base_price_chk
    CHECK (base_price >= 0),
  CONSTRAINT room_types_currency_chk
    CHECK (currency ~ '^[A-Z]{3}$'),
  CONSTRAINT room_types_amenities_array_chk
    CHECK (jsonb_typeof(amenities) = 'array')
);

CREATE INDEX room_types_active_idx
  ON room_types (is_active);

CREATE TRIGGER room_types_set_updated_at
BEFORE UPDATE ON room_types
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  confirmation_code varchar(32) NOT NULL UNIQUE,
  room_type_id uuid NOT NULL REFERENCES room_types(id) ON DELETE RESTRICT,

  guest_full_name varchar(160) NOT NULL,
  guest_email varchar(320) NOT NULL,
  guest_phone varchar(40),
  guest_country varchar(100),

  check_in date NOT NULL,
  check_out date NOT NULL,
  rooms_requested integer NOT NULL DEFAULT 1,
  guests_count smallint NOT NULL DEFAULT 1,

  status varchar(24) NOT NULL DEFAULT 'pending',
  special_requests text,
  total_amount numeric(12,2),
  currency char(3) NOT NULL DEFAULT 'ETB',
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT bookings_dates_chk
    CHECK (check_out > check_in),
  CONSTRAINT bookings_rooms_requested_chk
    CHECK (rooms_requested > 0),
  CONSTRAINT bookings_guests_count_chk
    CHECK (guests_count > 0),
  CONSTRAINT bookings_status_chk
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  CONSTRAINT bookings_total_amount_chk
    CHECK (total_amount IS NULL OR total_amount >= 0),
  CONSTRAINT bookings_currency_chk
    CHECK (currency ~ '^[A-Z]{3}$'),
  CONSTRAINT bookings_guest_name_chk
    CHECK (length(trim(guest_full_name)) > 0),
  CONSTRAINT bookings_guest_email_chk
    CHECK (length(trim(guest_email)) > 3)
);

CREATE INDEX bookings_room_type_dates_idx
  ON bookings (room_type_id, check_in, check_out);

CREATE INDEX bookings_status_idx
  ON bookings (status);

CREATE INDEX bookings_guest_email_idx
  ON bookings (lower(guest_email));

CREATE INDEX bookings_created_at_idx
  ON bookings (created_at DESC);

CREATE TRIGGER bookings_set_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE meeting_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_name varchar(160) NOT NULL,
  email varchar(320) NOT NULL,
  phone varchar(40),
  company_name varchar(160),
  event_type varchar(120),
  event_date date,
  guest_count integer,
  message text,
  status varchar(24) NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT meeting_inquiries_name_chk
    CHECK (length(trim(contact_name)) > 0),
  CONSTRAINT meeting_inquiries_email_chk
    CHECK (length(trim(email)) > 3),
  CONSTRAINT meeting_inquiries_guest_count_chk
    CHECK (guest_count IS NULL OR guest_count > 0),
  CONSTRAINT meeting_inquiries_status_chk
    CHECK (status IN ('pending', 'contacted', 'quoted', 'confirmed', 'declined', 'completed'))
);

CREATE INDEX meeting_inquiries_status_idx
  ON meeting_inquiries (status);

CREATE INDEX meeting_inquiries_event_date_idx
  ON meeting_inquiries (event_date);

CREATE INDEX meeting_inquiries_created_at_idx
  ON meeting_inquiries (created_at DESC);

CREATE TRIGGER meeting_inquiries_set_updated_at
BEFORE UPDATE ON meeting_inquiries
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type_id uuid REFERENCES room_types(id) ON DELETE SET NULL,
  category varchar(32) NOT NULL,
  title varchar(160),
  alt_text varchar(255) NOT NULL,
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT gallery_images_category_chk
    CHECK (category IN ('rooms', 'restaurant', 'gym_spa', 'meeting_hall', 'exterior', 'other')),
  CONSTRAINT gallery_images_alt_text_chk
    CHECK (length(trim(alt_text)) > 0),
  CONSTRAINT gallery_images_url_chk
    CHECK (length(trim(image_url)) > 0)
);

CREATE INDEX gallery_images_category_order_idx
  ON gallery_images (category, sort_order, created_at);

CREATE INDEX gallery_images_room_type_idx
  ON gallery_images (room_type_id);

CREATE TRIGGER gallery_images_set_updated_at
BEFORE UPDATE ON gallery_images
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Availability counts only inventory-holding reservations. Cancelled, completed,
-- and no-show reservations do not consume future inventory.
CREATE OR REPLACE FUNCTION room_type_available_rooms(
  requested_room_type_id uuid,
  requested_check_in date,
  requested_check_out date
)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT GREATEST(
    rt.total_rooms - COALESCE(SUM(b.rooms_requested), 0)::integer,
    0
  )::integer
  FROM room_types rt
  LEFT JOIN bookings b
    ON b.room_type_id = rt.id
   AND b.status IN ('pending', 'confirmed')
   AND b.check_in < requested_check_out
   AND b.check_out > requested_check_in
  WHERE rt.id = requested_room_type_id
  GROUP BY rt.total_rooms;
$$;

-- Useful for room listing pages. Exact date availability should use the function
-- above with the guest-selected dates.
CREATE OR REPLACE VIEW active_room_types AS
SELECT id, slug, name, description, bed_type, size_sqm, max_guests,
       total_rooms, base_price, currency, amenities, is_active,
       created_at, updated_at
FROM room_types
WHERE is_active = true;

COMMIT;
