-- Release 4 Slice 4: keep reviewed product freshness dates visually aligned
-- with the May 26, 2026 source review date in local US timezones.

update shopping_products
set
  source_captured_at = '2026-05-26T12:00:00Z',
  updated_at = now()
where id in (
  '4f37f4fa-ec28-4390-a48a-7bd9ee4b6e01',
  '4f37f4fa-ec28-4390-a48a-7bd9ee4b6e02',
  '4f37f4fa-ec28-4390-a48a-7bd9ee4b6e03',
  '4f37f4fa-ec28-4390-a48a-7bd9ee4b6e04',
  '4f37f4fa-ec28-4390-a48a-7bd9ee4b6e05',
  '4f37f4fa-ec28-4390-a48a-7bd9ee4b6e06',
  '4f37f4fa-ec28-4390-a48a-7bd9ee4b6e07',
  '4f37f4fa-ec28-4390-a48a-7bd9ee4b6e08'
);

update shopping_places_to_buy
set
  source_captured_at = '2026-05-26T12:00:00Z',
  last_checked_at = '2026-05-26T12:00:00Z',
  updated_at = now()
where id in (
  '850a1090-c20b-4c25-89db-5cb570139001',
  '850a1090-c20b-4c25-89db-5cb570139002',
  '850a1090-c20b-4c25-89db-5cb570139003',
  '850a1090-c20b-4c25-89db-5cb570139004',
  '850a1090-c20b-4c25-89db-5cb570139005',
  '850a1090-c20b-4c25-89db-5cb570139006',
  '850a1090-c20b-4c25-89db-5cb570139007',
  '850a1090-c20b-4c25-89db-5cb570139008'
);
