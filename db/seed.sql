-- Starter inventory used by the public booking form and admin console.
INSERT INTO room_types (slug, name, description, bed_type, max_guests, total_rooms, base_price, currency, amenities)
VALUES
  ('classic-twin', 'Classic Twin', 'A calm, beautifully proportioned room for easy city stays and restful nights.', 'Twin beds', 2, 20, 4200, 'ETB', '["Twin beds", "Rain shower", "Breakfast for two"]'),
  ('executive-king', 'Executive King', 'A generous king room with a considered workspace and wide views over Addis.', 'King bed', 2, 12, 5800, 'ETB', '["King bed", "City view", "Espresso station"]'),
  ('deluxe-suite', 'Deluxe Suite', 'A separate lounge and bedroom made for longer stays, celebrations, and slow mornings.', 'King bed', 3, 18, 6500, 'ETB', '["Separate lounge", "Soaking tub", "Airport transfer"]'),
  ('garden-terrace', 'Garden Terrace', 'Open the doors to your own terrace and let the morning light set the pace.', 'King bed', 2, 8, 7200, 'ETB', '["Private terrace", "King bed", "Garden access"]'),
  ('az-residence', 'AZ Residence', 'A private two-bedroom residence with space to settle in, work, and gather together.', 'Two bedrooms', 5, 4, 11800, 'ETB', '["Two bedrooms", "Kitchenette", "Living room"]'),
  ('presidential-suite', 'Presidential Suite', 'Our most expansive suite, with panoramic city views and room for every special detail.', 'King bed', 4, 2, 16500, 'ETB', '["Panoramic view", "Dining area", "Private host"]')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, base_price = EXCLUDED.base_price, total_rooms = EXCLUDED.total_rooms, max_guests = EXCLUDED.max_guests, amenities = EXCLUDED.amenities;
