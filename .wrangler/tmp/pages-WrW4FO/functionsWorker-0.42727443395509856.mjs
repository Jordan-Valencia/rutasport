var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../.wrangler/tmp/bundle-Vv1zru/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// api/admin/banners/[id].ts
var ADMIN_KEY = "_Yvu|jxY6_90";
var json = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized = /* @__PURE__ */ __name(() => json({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestPut = /* @__PURE__ */ __name(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY) return unauthorized();
  try {
    const existing = await env.DB.prepare("SELECT * FROM feature_banners WHERE id = ?").bind(params.id).first();
    if (!existing) return json({ error: "Banner not found" }, 404);
    const b = await request.json();
    const m = { ...existing, ...b };
    await env.DB.prepare(
      'UPDATE feature_banners SET title=?, subtitle=?, description=?, image=?, buttonText=?, bgColor=?, "order"=?, isActive=? WHERE id=?'
    ).bind(m.title || null, m.subtitle || null, m.description || null, m.image || null, m.buttonText || null, m.bgColor || null, m.order ?? 0, m.isActive ? 1 : 0, params.id).run();
    return json({ success: true });
  } catch (e) {
    return json({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPut");
var onRequestDelete = /* @__PURE__ */ __name(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY) return unauthorized();
  try {
    const result = await env.DB.prepare("DELETE FROM feature_banners WHERE id = ?").bind(params.id).run();
    if (result.meta.changes === 0) return json({ error: "Banner not found" }, 404);
    return json({ success: true });
  } catch (e) {
    return json({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestDelete");

// api/admin/brands/[id].ts
var ADMIN_KEY2 = "_Yvu|jxY6_90";
var json2 = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized2 = /* @__PURE__ */ __name(() => json2({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestPut2 = /* @__PURE__ */ __name(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY2) return unauthorized2();
  try {
    const b = await request.json();
    if (!b.name) return json2({ error: "Missing required field: name" }, 400);
    const result = await env.DB.prepare(
      'UPDATE brands SET name=?, logo=?, "order"=?, isActive=? WHERE id=?'
    ).bind(b.name, b.logo || null, b.order ?? 0, b.isActive ? 1 : 0, params.id).run();
    if (result.meta.changes === 0) return json2({ error: "Brand not found" }, 404);
    return json2({ success: true });
  } catch (e) {
    return json2({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPut");
var onRequestDelete2 = /* @__PURE__ */ __name(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY2) return unauthorized2();
  try {
    const result = await env.DB.prepare("DELETE FROM brands WHERE id = ?").bind(params.id).run();
    if (result.meta.changes === 0) return json2({ error: "Brand not found" }, 404);
    return json2({ success: true });
  } catch (e) {
    return json2({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestDelete");

// api/admin/categories/[id].ts
var ADMIN_KEY3 = "_Yvu|jxY6_90";
var json3 = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized3 = /* @__PURE__ */ __name(() => json3({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestPut3 = /* @__PURE__ */ __name(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY3) return unauthorized3();
  try {
    const b = await request.json();
    if (!b.name) return json3({ error: "Missing required field: name" }, 400);
    const result = await env.DB.prepare(
      'UPDATE categories SET name=?, "order"=?, isActive=? WHERE id=?'
    ).bind(b.name, b.order ?? 0, b.isActive ? 1 : 0, params.id).run();
    if (result.meta.changes === 0) return json3({ error: "Category not found" }, 404);
    return json3({ success: true });
  } catch (e) {
    return json3({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPut");
var onRequestDelete3 = /* @__PURE__ */ __name(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY3) return unauthorized3();
  try {
    await env.DB.prepare("DELETE FROM product_categories WHERE category_id = ?").bind(params.id).run();
    const result = await env.DB.prepare("DELETE FROM categories WHERE id = ?").bind(params.id).run();
    if (result.meta.changes === 0) return json3({ error: "Category not found" }, 404);
    return json3({ success: true });
  } catch (e) {
    return json3({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestDelete");

// api/admin/heroes/[id].ts
var ADMIN_KEY4 = "_Yvu|jxY6_90";
var json4 = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized4 = /* @__PURE__ */ __name(() => json4({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestPut4 = /* @__PURE__ */ __name(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY4) return unauthorized4();
  try {
    const existing = await env.DB.prepare("SELECT * FROM heroes WHERE id = ?").bind(params.id).first();
    if (!existing) return json4({ error: "Hero not found" }, 404);
    const b = await request.json();
    const merged = { ...existing, ...b };
    await env.DB.prepare(
      'UPDATE heroes SET campaignName=?, category=?, description=?, imageUrl=?, ctaText=?, isActive=?, "order"=? WHERE id=?'
    ).bind(merged.campaignName || null, merged.category || null, merged.description || null, merged.imageUrl || null, merged.ctaText || "COMPRAR AHORA", merged.isActive ? 1 : 0, merged.order ?? 0, params.id).run();
    return json4({ success: true });
  } catch (e) {
    return json4({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPut");
var onRequestDelete4 = /* @__PURE__ */ __name(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY4) return unauthorized4();
  try {
    const result = await env.DB.prepare("DELETE FROM heroes WHERE id = ?").bind(params.id).run();
    if (result.meta.changes === 0) return json4({ error: "Hero not found" }, 404);
    return json4({ success: true });
  } catch (e) {
    return json4({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestDelete");

// api/admin/products/[id].ts
var ADMIN_KEY5 = "_Yvu|jxY6_90";
var json5 = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized5 = /* @__PURE__ */ __name(() => json5({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestPut5 = /* @__PURE__ */ __name(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY5) return unauthorized5();
  try {
    const b = await request.json();
    if (!b.name?.trim() || !b.price?.trim()) return json5({ error: "name y price son requeridos" }, 400);
    const result = await env.DB.prepare(
      `UPDATE products SET name=?, model=?, price=?, brand_id=?, gender_id=?,
                           image=?, isBestSeller=?, isNew=?, description=?, sizes=?
       WHERE id=?`
    ).bind(
      b.name.trim(),
      b.model?.trim() || null,
      b.price.trim(),
      b.brand_id || null,
      b.gender_id || null,
      b.image || "",
      b.isBestSeller ? 1 : 0,
      b.isNew ? 1 : 0,
      b.description || null,
      b.sizes || null,
      params.id
    ).run();
    if (result.meta.changes === 0) return json5({ error: "Producto no encontrado" }, 404);
    await env.DB.prepare("DELETE FROM product_categories WHERE product_id = ?").bind(params.id).run();
    const categoryIds = Array.isArray(b.category_ids) ? b.category_ids : [];
    for (const cid of categoryIds) {
      if (cid) await env.DB.prepare(
        "INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)"
      ).bind(params.id, cid).run();
    }
    await env.DB.prepare("DELETE FROM product_sports WHERE product_id = ?").bind(params.id).run();
    const sportIds = Array.isArray(b.sport_ids) ? b.sport_ids : [];
    for (const sid of sportIds) {
      if (sid) await env.DB.prepare(
        "INSERT OR IGNORE INTO product_sports (product_id, sport_id) VALUES (?, ?)"
      ).bind(params.id, sid).run();
    }
    await env.DB.prepare("DELETE FROM product_images WHERE product_id = ?").bind(params.id).run();
    const gallery = Array.isArray(b.gallery) ? b.gallery : [];
    for (let i = 0; i < gallery.length; i++) {
      if (gallery[i]) {
        await env.DB.prepare(
          "INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)"
        ).bind(params.id, gallery[i], i).run();
      }
    }
    return json5({ success: true });
  } catch (e) {
    return json5({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPut");
var onRequestDelete5 = /* @__PURE__ */ __name(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY5) return unauthorized5();
  try {
    await env.DB.prepare("DELETE FROM product_categories WHERE product_id = ?").bind(params.id).run();
    await env.DB.prepare("DELETE FROM product_sports WHERE product_id = ?").bind(params.id).run();
    const result = await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(params.id).run();
    if (result.meta.changes === 0) return json5({ error: "Producto no encontrado" }, 404);
    return json5({ success: true });
  } catch (e) {
    return json5({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestDelete");

// api/admin/sports/[id].ts
var ADMIN_KEY6 = "_Yvu|jxY6_90";
var json6 = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized6 = /* @__PURE__ */ __name(() => json6({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestPut6 = /* @__PURE__ */ __name(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY6) return unauthorized6();
  try {
    const b = await request.json();
    if (!b.name) {
      return json6({ error: "Missing required field: name" }, 400);
    }
    const result = await env.DB.prepare(
      'UPDATE sports SET name=?, icon=?, "order"=?, isActive=? WHERE id=?'
    ).bind(b.name, b.icon || null, b.order ?? 0, b.isActive ? 1 : 0, params.id).run();
    if (result.meta.changes === 0) return json6({ error: "Sport not found" }, 404);
    return json6({ success: true });
  } catch (e) {
    return json6({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPut");
var onRequestDelete6 = /* @__PURE__ */ __name(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY6) return unauthorized6();
  try {
    await env.DB.prepare("DELETE FROM product_sports WHERE sport_id = ?").bind(params.id).run();
    const result = await env.DB.prepare("DELETE FROM sports WHERE id = ?").bind(params.id).run();
    if (result.meta.changes === 0) return json6({ error: "Sport not found" }, 404);
    return json6({ success: true });
  } catch (e) {
    return json6({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestDelete");

// api/admin/banners.ts
var ADMIN_KEY7 = "_Yvu|jxY6_90";
var json7 = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized7 = /* @__PURE__ */ __name(() => json7({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestGet = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY7) return unauthorized7();
  const result = await env.DB.prepare('SELECT * FROM feature_banners ORDER BY "order" ASC').all();
  return json7(result.results);
}, "onRequestGet");
var onRequestPost = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY7) return unauthorized7();
  try {
    const b = await request.json();
    const result = await env.DB.prepare(
      'INSERT INTO feature_banners (title, subtitle, description, image, buttonText, bgColor, "order", isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(b.title || null, b.subtitle || null, b.description || null, b.image || null, b.buttonText || null, b.bgColor || null, b.order ?? 0, b.isActive ? 1 : 0).run();
    return json7({ id: result.meta.last_row_id }, 201);
  } catch (e) {
    return json7({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPost");

// api/admin/brands.ts
var ADMIN_KEY8 = "_Yvu|jxY6_90";
var json8 = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized8 = /* @__PURE__ */ __name(() => json8({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestGet2 = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY8) return unauthorized8();
  try {
    const result = await env.DB.prepare('SELECT * FROM brands ORDER BY "order" ASC').all();
    return json8(result.results);
  } catch (e) {
    return json8({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestGet");
var onRequestPost2 = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY8) return unauthorized8();
  try {
    const b = await request.json();
    if (!b.name) return json8({ error: "Missing required field: name" }, 400);
    const result = await env.DB.prepare(
      'INSERT INTO brands (name, logo, "order", isActive) VALUES (?, ?, ?, ?)'
    ).bind(b.name, b.logo || null, b.order ?? 0, b.isActive ? 1 : 0).run();
    return json8({ id: result.meta.last_row_id }, 201);
  } catch (e) {
    return json8({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPost");

// api/admin/categories.ts
var ADMIN_KEY9 = "_Yvu|jxY6_90";
var json9 = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized9 = /* @__PURE__ */ __name(() => json9({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestGet3 = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY9) return unauthorized9();
  try {
    const result = await env.DB.prepare('SELECT * FROM categories ORDER BY "order" ASC').all();
    return json9(result.results);
  } catch (e) {
    return json9({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestGet");
var onRequestPost3 = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY9) return unauthorized9();
  try {
    const b = await request.json();
    if (!b.name) return json9({ error: "Missing required field: name" }, 400);
    const result = await env.DB.prepare(
      'INSERT INTO categories (name, "order", isActive) VALUES (?, ?, ?)'
    ).bind(b.name, b.order ?? 0, b.isActive !== false ? 1 : 0).run();
    return json9({ id: result.meta.last_row_id }, 201);
  } catch (e) {
    return json9({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPost");

// api/admin/genders.ts
var ADMIN_KEY10 = "_Yvu|jxY6_90";
var json10 = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized10 = /* @__PURE__ */ __name(() => json10({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestGet4 = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY10) return unauthorized10();
  try {
    const result = await env.DB.prepare('SELECT * FROM genders ORDER BY "order" ASC').all();
    return json10(result.results);
  } catch (e) {
    return json10({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestGet");

// api/admin/heroes.ts
var ADMIN_KEY11 = "_Yvu|jxY6_90";
var json11 = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized11 = /* @__PURE__ */ __name(() => json11({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestGet5 = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY11) return unauthorized11();
  try {
    const result = await env.DB.prepare('SELECT * FROM heroes ORDER BY "order" ASC').all();
    return json11(result.results);
  } catch (e) {
    return json11({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestGet");
var onRequestPost4 = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY11) return unauthorized11();
  try {
    const b = await request.json();
    const result = await env.DB.prepare(
      'INSERT INTO heroes (campaignName, category, description, imageUrl, ctaText, isActive, "order") VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(b.campaignName || null, b.category || null, b.description || null, b.imageUrl || null, b.ctaText || "COMPRAR AHORA", b.isActive ? 1 : 0, b.order ?? 0).run();
    return json11({ id: result.meta.last_row_id }, 201);
  } catch (e) {
    return json11({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPost");

// api/admin/products.ts
var ADMIN_KEY12 = "_Yvu|jxY6_90";
var json12 = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized12 = /* @__PURE__ */ __name(() => json12({ error: "Unauthorized" }, 401), "unauthorized");
var PRODUCT_SELECT = `
  SELECT
    p.id, p.name, p.model, p.price, p.image,
    p.brand_id, p.gender_id,
    p.isBestSeller, p.isNew, p.description, p.sizes, p.createdAt,
    b.name AS brand,
    g.name AS gender,
    (SELECT GROUP_CONCAT(c.name, ',')
     FROM product_categories pc JOIN categories c ON c.id = pc.category_id
     WHERE pc.product_id = p.id) AS categories,
    (SELECT GROUP_CONCAT(s.name, ',')
     FROM product_sports ps JOIN sports s ON s.id = ps.sport_id
     WHERE ps.product_id = p.id) AS sports,
    (SELECT GROUP_CONCAT(pc2.category_id, ',')
     FROM product_categories pc2 WHERE pc2.product_id = p.id) AS category_ids,
    (SELECT GROUP_CONCAT(ps2.sport_id, ',')
     FROM product_sports ps2 WHERE ps2.product_id = p.id) AS sport_ids,
    (SELECT GROUP_CONCAT(url, ',')
     FROM (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC)
    ) AS gallery
  FROM products p
  LEFT JOIN brands  b ON b.id = p.brand_id
  LEFT JOIN genders g ON g.id = p.gender_id
`;
var onRequestGet6 = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY12) return unauthorized12();
  try {
    const result = await env.DB.prepare(`${PRODUCT_SELECT} ORDER BY p.id ASC`).all();
    return json12(result.results);
  } catch (e) {
    return json12({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestGet");
var onRequestPost5 = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY12) return unauthorized12();
  try {
    const b = await request.json();
    if (!b.name?.trim() || !b.price?.trim()) return json12({ error: "name y price son requeridos" }, 400);
    const ins = await env.DB.prepare(
      `INSERT INTO products (name, model, price, brand_id, gender_id,
                             image, isBestSeller, isNew, description, sizes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      b.name.trim(),
      b.model?.trim() || null,
      b.price.trim(),
      b.brand_id || null,
      b.gender_id || null,
      b.image || "",
      b.isBestSeller ? 1 : 0,
      b.isNew ? 1 : 0,
      b.description || null,
      b.sizes || null
    ).run();
    const productId = ins.meta.last_row_id;
    const categoryIds = Array.isArray(b.category_ids) ? b.category_ids : [];
    for (const cid of categoryIds) {
      if (cid) await env.DB.prepare(
        "INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)"
      ).bind(productId, cid).run();
    }
    const sportIds = Array.isArray(b.sport_ids) ? b.sport_ids : [];
    for (const sid of sportIds) {
      if (sid) await env.DB.prepare(
        "INSERT OR IGNORE INTO product_sports (product_id, sport_id) VALUES (?, ?)"
      ).bind(productId, sid).run();
    }
    const gallery = Array.isArray(b.gallery) ? b.gallery : [];
    for (let i = 0; i < gallery.length; i++) {
      if (gallery[i]) {
        await env.DB.prepare(
          "INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)"
        ).bind(productId, gallery[i], i).run();
      }
    }
    return json12({ id: productId }, 201);
  } catch (e) {
    return json12({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPost");

// api/admin/sports.ts
var ADMIN_KEY13 = "_Yvu|jxY6_90";
var json13 = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized13 = /* @__PURE__ */ __name(() => json13({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestGet7 = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY13) return unauthorized13();
  try {
    const result = await env.DB.prepare('SELECT * FROM sports ORDER BY "order" ASC').all();
    return json13(result.results);
  } catch (e) {
    return json13({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestGet");
var onRequestPost6 = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY13) return unauthorized13();
  try {
    const b = await request.json();
    if (!b.name) {
      return json13({ error: "Missing required field: name" }, 400);
    }
    const result = await env.DB.prepare(
      'INSERT INTO sports (name, icon, "order", isActive) VALUES (?, ?, ?, ?)'
    ).bind(b.name, b.icon || null, b.order ?? 0, b.isActive ? 1 : 0).run();
    return json13({ id: result.meta.last_row_id }, 201);
  } catch (e) {
    return json13({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPost");

// api/admin/upload.ts
var ADMIN_KEY14 = "_Yvu|jxY6_90";
var json14 = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized14 = /* @__PURE__ */ __name(() => json14({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestPost7 = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY14) return unauthorized14();
  try {
    const formData = await request.formData();
    const entry = formData.get("file");
    if (!entry || typeof entry === "string") return json14({ error: "No file provided" }, 400);
    const file = entry;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `images/${Date.now()}-${safeName}`;
    const contentType = file.type || `image/${ext === "jpg" ? "jpeg" : ext}`;
    await env.IMAGES.put(key, file, { httpMetadata: { contentType } });
    return json14({ path: `/${key}`, key });
  } catch (e) {
    return json14({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPost");
var onRequestGet8 = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY14) return unauthorized14();
  try {
    const items = [];
    let cursor;
    do {
      const list = await env.IMAGES.list({ prefix: "images/", cursor });
      for (const o of list.objects) {
        items.push({ key: o.key, path: `/${o.key}`, size: o.size, uploaded: o.uploaded });
      }
      cursor = list.truncated ? list.cursor : void 0;
    } while (cursor);
    return json14(items);
  } catch (e) {
    return json14({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestGet");
var onRequestDelete7 = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY14) return unauthorized14();
  try {
    const body = await request.json();
    if (!body.key) return json14({ error: "Missing required field: key" }, 400);
    await env.IMAGES.delete(body.key);
    return json14({ success: true });
  } catch (e) {
    return json14({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestDelete");

// api/admin/upload-url.ts
var ADMIN_KEY15 = "_Yvu|jxY6_90";
var json15 = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized15 = /* @__PURE__ */ __name(() => json15({ error: "Unauthorized" }, 401), "unauthorized");
var EXT_TO_MIME = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  bmp: "image/bmp",
  svg: "image/svg+xml"
};
function resolveContentType(rawCT, pathname) {
  const base = rawCT?.split(";")[0].trim().toLowerCase() ?? "";
  if (base.startsWith("image/")) return base === "image/jpg" ? "image/jpeg" : base;
  if (!base || base === "application/octet-stream" || base === "binary/octet-stream") {
    const ext = pathname.split(".").pop()?.toLowerCase() ?? "";
    return EXT_TO_MIME[ext] ?? null;
  }
  return null;
}
__name(resolveContentType, "resolveContentType");
var onRequestPost8 = /* @__PURE__ */ __name(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY15) return unauthorized15();
  try {
    const body = await request.json();
    const rawUrl = body.url?.trim();
    if (!rawUrl) return json15({ error: "Se requiere el campo url" }, 400);
    let parsedUrl;
    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      return json15({ error: "URL inv\xE1lida" }, 400);
    }
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return json15({ error: "Solo se permiten URLs http/https" }, 400);
    }
    const imageRes = await fetch(rawUrl, {
      headers: { "User-Agent": "Mozilla/5.0 RutaSport-Admin/1.0", "Accept": "image/*,*/*" },
      redirect: "follow"
    });
    if (!imageRes.ok) {
      return json15({ error: `No se pudo descargar la imagen (HTTP ${imageRes.status})` }, 400);
    }
    const rawCT = imageRes.headers.get("content-type");
    const contentType = resolveContentType(rawCT, parsedUrl.pathname);
    if (!contentType) {
      return json15({ error: `No se pudo determinar el tipo de imagen. Content-Type recibido: "${rawCT ?? "ninguno"}"` }, 400);
    }
    const extMap = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/avif": "avif",
      "image/bmp": "bmp",
      "image/svg+xml": "svg"
    };
    const ext = extMap[contentType] ?? "jpg";
    const rawName = parsedUrl.pathname.split("/").pop() || `image.${ext}`;
    const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.[^.]+$/, "") || "image";
    const key = `images/${Date.now()}-${safeName}.${ext}`;
    const buffer = await imageRes.arrayBuffer();
    await env.IMAGES.put(key, buffer, { httpMetadata: { contentType } });
    return json15({ path: `/${key}`, key });
  } catch (e) {
    return json15({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPost");

// api/products/[id].ts
var cors = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
var QUERY = `
  SELECT p.id, p.name, p.model, p.price,
         b.name AS brand, p.brand_id,
         g.name AS gender, p.gender_id,
         p.image, p.isBestSeller, p.isNew, p.description, p.sizes, p.createdAt,
         (SELECT GROUP_CONCAT(c.name, ',')
          FROM product_categories pc JOIN categories c ON c.id = pc.category_id
          WHERE pc.product_id = p.id) AS categories,
         (SELECT GROUP_CONCAT(s.name, ',')
          FROM product_sports ps JOIN sports s ON s.id = ps.sport_id
          WHERE ps.product_id = p.id) AS sports,
         (SELECT GROUP_CONCAT(pc2.category_id, ',')
          FROM product_categories pc2 WHERE pc2.product_id = p.id) AS category_ids,
         (SELECT GROUP_CONCAT(ps2.sport_id, ',')
          FROM product_sports ps2 WHERE ps2.product_id = p.id) AS sport_ids,
         (SELECT GROUP_CONCAT(url, ',')
          FROM (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC)
         ) AS gallery
  FROM products p
  LEFT JOIN brands  b ON b.id = p.brand_id
  LEFT JOIN genders g ON g.id = p.gender_id
  WHERE p.id = ?
  GROUP BY p.id
`;
var onRequestGet9 = /* @__PURE__ */ __name(async ({ env, params }) => {
  try {
    const id = params.id;
    if (!id || isNaN(+id)) {
      return new Response(JSON.stringify({ error: "Invalid id" }), { status: 400, headers: cors });
    }
    const result = await env.DB.prepare(QUERY).bind(+id).first();
    if (!result) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: cors });
    }
    return new Response(JSON.stringify(result), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message ?? "Internal error" }), { status: 500, headers: cors });
  }
}, "onRequestGet");

// api/banners.ts
var corsHeaders = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
var onRequestGet10 = /* @__PURE__ */ __name(async ({ env }) => {
  try {
    const result = await env.DB.prepare(
      'SELECT * FROM feature_banners WHERE isActive = 1 ORDER BY "order" ASC'
    ).all();
    return new Response(JSON.stringify(result.results), { headers: corsHeaders });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders
    });
  }
}, "onRequestGet");

// api/brands.ts
var corsHeaders2 = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
var onRequestGet11 = /* @__PURE__ */ __name(async ({ env }) => {
  try {
    const result = await env.DB.prepare(
      'SELECT * FROM brands WHERE isActive = 1 ORDER BY "order" ASC'
    ).all();
    return new Response(JSON.stringify(result.results), { headers: corsHeaders2 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders2
    });
  }
}, "onRequestGet");

// api/categories.ts
var corsHeaders3 = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
var onRequestGet12 = /* @__PURE__ */ __name(async ({ env }) => {
  try {
    const result = await env.DB.prepare(
      'SELECT * FROM categories WHERE isActive = 1 ORDER BY "order" ASC'
    ).all();
    return new Response(JSON.stringify(result.results), { headers: corsHeaders3 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: corsHeaders3 });
  }
}, "onRequestGet");

// api/genders.ts
var corsHeaders4 = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
var onRequestGet13 = /* @__PURE__ */ __name(async ({ env }) => {
  try {
    const result = await env.DB.prepare(
      'SELECT * FROM genders ORDER BY "order" ASC'
    ).all();
    return new Response(JSON.stringify(result.results), { headers: corsHeaders4 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders4
    });
  }
}, "onRequestGet");

// api/heroes.ts
var corsHeaders5 = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
var onRequestGet14 = /* @__PURE__ */ __name(async ({ env }) => {
  try {
    const result = await env.DB.prepare(
      'SELECT * FROM heroes WHERE isActive = 1 ORDER BY "order" ASC'
    ).all();
    return new Response(JSON.stringify(result.results), { headers: corsHeaders5 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders5
    });
  }
}, "onRequestGet");

// api/products.ts
var headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};
var onRequestGet15 = /* @__PURE__ */ __name(async ({ env, request }) => {
  try {
    const url = new URL(request.url);
    const gender = url.searchParams.get("gender");
    const bestSeller = url.searchParams.get("bestSeller");
    const isNew = url.searchParams.get("isNew");
    let sql = `
      SELECT
        p.id,
        p.name,
        p.model,
        p.price,
        b.name AS brand,
        p.brand_id,
        g.name AS gender,
        p.gender_id,
        p.image,
        p.isBestSeller,
        p.isNew,
        p.description,
        p.sizes,
        p.createdAt,
        (
          SELECT GROUP_CONCAT(c.name, ',')
          FROM product_categories pc
          JOIN categories c ON c.id = pc.category_id
          WHERE pc.product_id = p.id
        ) AS categories,
        (
          SELECT GROUP_CONCAT(s.name, ',')
          FROM product_sports ps
          JOIN sports s ON s.id = ps.sport_id
          WHERE ps.product_id = p.id
        ) AS sports,
        (
          SELECT GROUP_CONCAT(pc2.category_id, ',')
          FROM product_categories pc2
          WHERE pc2.product_id = p.id
        ) AS category_ids,
        (
          SELECT GROUP_CONCAT(ps2.sport_id, ',')
          FROM product_sports ps2
          WHERE ps2.product_id = p.id
        ) AS sport_ids,
        (
          SELECT GROUP_CONCAT(url, ',')
          FROM (
            SELECT url
            FROM product_images
            WHERE product_id = p.id
            ORDER BY sort_order ASC
          )
        ) AS gallery
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN genders g ON g.id = p.gender_id
      WHERE 1 = 1
    `;
    const binds = [];
    if (gender) {
      sql += ` AND g.name = ?`;
      binds.push(gender);
    }
    if (bestSeller === "true") {
      sql += ` AND p.isBestSeller = 1`;
    }
    if (isNew === "true") {
      sql += ` AND p.isNew = 1`;
    }
    sql += ` ORDER BY p.createdAt DESC`;
    const result = await env.DB.prepare(sql).bind(...binds).all();
    return new Response(JSON.stringify(result.results), { headers });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message ?? "Internal error" }),
      { status: 500, headers }
    );
  }
}, "onRequestGet");

// api/sports.ts
var corsHeaders6 = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
var onRequestGet16 = /* @__PURE__ */ __name(async ({ env }) => {
  try {
    const result = await env.DB.prepare(
      'SELECT * FROM sports WHERE isActive = 1 ORDER BY "order" ASC'
    ).all();
    return new Response(JSON.stringify(result.results), { headers: corsHeaders6 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders6
    });
  }
}, "onRequestGet");

// images/[[path]].ts
var MIME_TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  avif: "image/avif"
};
var onRequestGet17 = /* @__PURE__ */ __name(async ({ env, params }) => {
  try {
    const pathParts = Array.isArray(params.path) ? params.path : [params.path];
    const key = "images/" + pathParts.join("/");
    const obj = await env.IMAGES.get(key);
    if (!obj) return new Response("Not found", { status: 404 });
    const headers2 = new Headers();
    obj.writeHttpMetadata(headers2);
    if (!headers2.get("content-type")) {
      const ext = key.split(".").pop()?.toLowerCase() ?? "";
      headers2.set("content-type", MIME_TYPES[ext] ?? "application/octet-stream");
    }
    headers2.set("cache-control", "public, max-age=31536000, immutable");
    return new Response(obj.body, { headers: headers2 });
  } catch (e) {
    return new Response("Internal server error", { status: 500 });
  }
}, "onRequestGet");

// ../.wrangler/tmp/pages-WrW4FO/functionsRoutes-0.375994035564451.mjs
var routes = [
  {
    routePath: "/api/admin/banners/:id",
    mountPath: "/api/admin/banners",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete]
  },
  {
    routePath: "/api/admin/banners/:id",
    mountPath: "/api/admin/banners",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut]
  },
  {
    routePath: "/api/admin/brands/:id",
    mountPath: "/api/admin/brands",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete2]
  },
  {
    routePath: "/api/admin/brands/:id",
    mountPath: "/api/admin/brands",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut2]
  },
  {
    routePath: "/api/admin/categories/:id",
    mountPath: "/api/admin/categories",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete3]
  },
  {
    routePath: "/api/admin/categories/:id",
    mountPath: "/api/admin/categories",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut3]
  },
  {
    routePath: "/api/admin/heroes/:id",
    mountPath: "/api/admin/heroes",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete4]
  },
  {
    routePath: "/api/admin/heroes/:id",
    mountPath: "/api/admin/heroes",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut4]
  },
  {
    routePath: "/api/admin/products/:id",
    mountPath: "/api/admin/products",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete5]
  },
  {
    routePath: "/api/admin/products/:id",
    mountPath: "/api/admin/products",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut5]
  },
  {
    routePath: "/api/admin/sports/:id",
    mountPath: "/api/admin/sports",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete6]
  },
  {
    routePath: "/api/admin/sports/:id",
    mountPath: "/api/admin/sports",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut6]
  },
  {
    routePath: "/api/admin/banners",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/admin/banners",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/admin/brands",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/admin/brands",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/admin/categories",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/admin/categories",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/admin/genders",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/admin/heroes",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet5]
  },
  {
    routePath: "/api/admin/heroes",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/admin/products",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet6]
  },
  {
    routePath: "/api/admin/products",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/admin/sports",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet7]
  },
  {
    routePath: "/api/admin/sports",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost6]
  },
  {
    routePath: "/api/admin/upload",
    mountPath: "/api/admin",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete7]
  },
  {
    routePath: "/api/admin/upload",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet8]
  },
  {
    routePath: "/api/admin/upload",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost7]
  },
  {
    routePath: "/api/admin/upload-url",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost8]
  },
  {
    routePath: "/api/products/:id",
    mountPath: "/api/products",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet9]
  },
  {
    routePath: "/api/banners",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet10]
  },
  {
    routePath: "/api/brands",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet11]
  },
  {
    routePath: "/api/categories",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet12]
  },
  {
    routePath: "/api/genders",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet13]
  },
  {
    routePath: "/api/heroes",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet14]
  },
  {
    routePath: "/api/products",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet15]
  },
  {
    routePath: "/api/sports",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet16]
  },
  {
    routePath: "/images/:path*",
    mountPath: "/images",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet17]
  }
];

// ../node_modules/wrangler/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-Vv1zru/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-Vv1zru/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.42727443395509856.mjs.map
