-- ── Migración 007: agregar columna model a products ──────────────────
-- 1. Agrega la columna
ALTER TABLE products ADD COLUMN model TEXT;

-- 2. Copia la referencia actual (name) al nuevo campo model
UPDATE products SET model = name;

-- 3. Actualiza name con el nombre real del modelo Oakley
UPDATE products SET name = 'Halftrack Mid II'        WHERE model LIKE 'FOF100334%';
UPDATE products SET name = 'Flak III'                WHERE model LIKE 'FOF100575%';
UPDATE products SET name = 'Bridge'                  WHERE model LIKE 'FOF100631%';
UPDATE products SET name = 'Anorak Low'              WHERE model LIKE 'FOF100614%';
UPDATE products SET name = 'Halftrack III Mid'       WHERE model LIKE 'FOF100670%';
UPDATE products SET name = 'Halftrack Low II'        WHERE model LIKE 'FOF100335%';
UPDATE products SET name = 'Halftrack III Low'       WHERE model LIKE 'FOF100669%';
UPDATE products SET name = 'Teeth Noise'             WHERE model LIKE 'FOF100546%';
UPDATE products SET name = 'Teeth Bomb'              WHERE model LIKE 'FOF100547%';
UPDATE products SET name = 'Teeth 1'                 WHERE model LIKE 'FOF100545%';
UPDATE products SET name = 'Flak 365 II Lite'        WHERE model LIKE 'FOF100634%';
UPDATE products SET name = 'Halftrack Low II Premium' WHERE model LIKE 'FOF100522%';
UPDATE products SET name = 'Granadier'               WHERE model LIKE 'FOF100576%';
UPDATE products SET name = 'Halftrack Low II'        WHERE model LIKE 'FOF100469%';

-- 4. Actualiza name con el nombre real del modelo Adidas
UPDATE products SET name = 'Response Runner'       WHERE model = 'JQ2540';
UPDATE products SET name = 'Galaxy 7'              WHERE model = 'ID8764';
UPDATE products SET name = 'Duramo SL 2'           WHERE model = 'IH8225';
UPDATE products SET name = 'Questar 3'             WHERE model = 'ID8742';
UPDATE products SET name = 'Duramo RC2'            WHERE model = 'JR7151';
UPDATE products SET name = 'Terrex Tracefinder 2'  WHERE model = 'JR9142';
UPDATE products SET name = 'Response Runner 2'     WHERE model = 'KJ1735';
UPDATE products SET name = 'Runfalcon 5 TR'        WHERE model = 'JQ6958';
UPDATE products SET name = 'Duramo RC2'            WHERE model = 'JS4435';
UPDATE products SET name = 'Response Runner 2'     WHERE model = 'KJ1738';
UPDATE products SET name = 'Runfalcon 5 TR'        WHERE model = 'JP5911';
UPDATE products SET name = 'Switch Move'           WHERE model = 'ID8329';
UPDATE products SET name = 'Runvista'              WHERE model = 'HQ2329';
UPDATE products SET name = 'Galaxy 7'              WHERE model = 'JQ2610';
UPDATE products SET name = 'Questar 3'             WHERE model = 'JP6604';
