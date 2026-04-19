var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-sUqJr3/checked-fetch.js
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

// .wrangler/tmp/pages-QSFcIF/functionsWorker-0.6407530782391799.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var urls2 = /* @__PURE__ */ new Set();
function checkURL2(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls2.has(url.toString())) {
      urls2.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL2, "checkURL");
__name2(checkURL2, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL2(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});
var ADMIN_KEY = "_Yvu|jxY6_90";
var json = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized = /* @__PURE__ */ __name2(() => json({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestPut = /* @__PURE__ */ __name2(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY) return unauthorized();
  try {
    const b = await request.json();
    if (!b.title || !b.subtitle || !b.image || !b.buttonText || !b.bgColor) {
      return json({ error: "Missing required fields: title, subtitle, image, buttonText, bgColor" }, 400);
    }
    const result = await env.DB.prepare(
      'UPDATE feature_banners SET title=?, subtitle=?, description=?, image=?, buttonText=?, bgColor=?, "order"=?, isActive=? WHERE id=?'
    ).bind(b.title, b.subtitle, b.description || null, b.image, b.buttonText, b.bgColor, b.order ?? 0, b.isActive ? 1 : 0, params.id).run();
    if (result.meta.changes === 0) return json({ error: "Banner not found" }, 404);
    return json({ success: true });
  } catch (e) {
    return json({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPut");
var onRequestDelete = /* @__PURE__ */ __name2(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY) return unauthorized();
  try {
    const result = await env.DB.prepare("DELETE FROM feature_banners WHERE id = ?").bind(params.id).run();
    if (result.meta.changes === 0) return json({ error: "Banner not found" }, 404);
    return json({ success: true });
  } catch (e) {
    return json({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestDelete");
var ADMIN_KEY2 = "_Yvu|jxY6_90";
var json2 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized2 = /* @__PURE__ */ __name2(() => json2({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestPut2 = /* @__PURE__ */ __name2(async ({ env, request, params }) => {
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
var onRequestDelete2 = /* @__PURE__ */ __name2(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY2) return unauthorized2();
  try {
    const result = await env.DB.prepare("DELETE FROM brands WHERE id = ?").bind(params.id).run();
    if (result.meta.changes === 0) return json2({ error: "Brand not found" }, 404);
    return json2({ success: true });
  } catch (e) {
    return json2({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestDelete");
var ADMIN_KEY3 = "_Yvu|jxY6_90";
var json3 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized3 = /* @__PURE__ */ __name2(() => json3({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestPut3 = /* @__PURE__ */ __name2(async ({ env, request, params }) => {
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
var onRequestDelete3 = /* @__PURE__ */ __name2(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY3) return unauthorized3();
  try {
    const result = await env.DB.prepare("DELETE FROM categories WHERE id = ?").bind(params.id).run();
    if (result.meta.changes === 0) return json3({ error: "Category not found" }, 404);
    return json3({ success: true });
  } catch (e) {
    return json3({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestDelete");
var ADMIN_KEY4 = "_Yvu|jxY6_90";
var json4 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized4 = /* @__PURE__ */ __name2(() => json4({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestPut4 = /* @__PURE__ */ __name2(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY4) return unauthorized4();
  try {
    const b = await request.json();
    if (!b.campaignName || !b.category || !b.imageUrl) {
      return json4({ error: "Missing required fields: campaignName, category, imageUrl" }, 400);
    }
    const result = await env.DB.prepare(
      'UPDATE heroes SET campaignName=?, category=?, description=?, imageUrl=?, videoUrl=?, ctaText=?, isActive=?, "order"=? WHERE id=?'
    ).bind(b.campaignName, b.category, b.description || null, b.imageUrl, b.videoUrl || null, b.ctaText || "COMPRAR AHORA", b.isActive ? 1 : 0, b.order ?? 0, params.id).run();
    if (result.meta.changes === 0) return json4({ error: "Hero not found" }, 404);
    return json4({ success: true });
  } catch (e) {
    return json4({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPut");
var onRequestDelete4 = /* @__PURE__ */ __name2(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY4) return unauthorized4();
  try {
    const result = await env.DB.prepare("DELETE FROM heroes WHERE id = ?").bind(params.id).run();
    if (result.meta.changes === 0) return json4({ error: "Hero not found" }, 404);
    return json4({ success: true });
  } catch (e) {
    return json4({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestDelete");
var ADMIN_KEY5 = "_Yvu|jxY6_90";
var json5 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized5 = /* @__PURE__ */ __name2(() => json5({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestPut5 = /* @__PURE__ */ __name2(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY5) return unauthorized5();
  try {
    const b = await request.json();
    if (!b.name || !b.price) return json5({ error: "name y price son requeridos" }, 400);
    const result = await env.DB.prepare(
      `UPDATE products SET name=?, price=?, brand_id=?, category_id=?, sport_id=?, gender_id=?,
                           image=?, isBestSeller=?, isNew=?, description=?, sizes=?
       WHERE id=?`
    ).bind(
      b.name,
      b.price,
      b.brand_id || null,
      b.category_id || null,
      b.sport_id || null,
      b.gender_id || null,
      b.image || "",
      b.isBestSeller ? 1 : 0,
      b.isNew ? 1 : 0,
      b.description || null,
      b.sizes || null,
      params.id
    ).run();
    if (result.meta.changes === 0) return json5({ error: "Producto no encontrado" }, 404);
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
var onRequestDelete5 = /* @__PURE__ */ __name2(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY5) return unauthorized5();
  try {
    const result = await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(params.id).run();
    if (result.meta.changes === 0) return json5({ error: "Producto no encontrado" }, 404);
    return json5({ success: true });
  } catch (e) {
    return json5({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestDelete");
var ADMIN_KEY6 = "_Yvu|jxY6_90";
var json6 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized6 = /* @__PURE__ */ __name2(() => json6({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestPut6 = /* @__PURE__ */ __name2(async ({ env, request, params }) => {
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
var onRequestDelete6 = /* @__PURE__ */ __name2(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY6) return unauthorized6();
  try {
    const result = await env.DB.prepare("DELETE FROM sports WHERE id = ?").bind(params.id).run();
    if (result.meta.changes === 0) return json6({ error: "Sport not found" }, 404);
    return json6({ success: true });
  } catch (e) {
    return json6({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestDelete");
var ADMIN_KEY7 = "_Yvu|jxY6_90";
var json7 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized7 = /* @__PURE__ */ __name2(() => json7({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestPut7 = /* @__PURE__ */ __name2(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY7) return unauthorized7();
  try {
    const b = await request.json();
    if (!b.name || !b.country || !b.type) {
      return json7({ error: "Missing required fields: name, country, type" }, 400);
    }
    const result = await env.DB.prepare(
      "UPDATE teams SET name=?, country=?, type=?, logo=? WHERE id=?"
    ).bind(b.name, b.country, b.type, b.logo || null, params.id).run();
    if (result.meta.changes === 0) return json7({ error: "Team not found" }, 404);
    return json7({ success: true });
  } catch (e) {
    return json7({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPut");
var onRequestDelete7 = /* @__PURE__ */ __name2(async ({ env, request, params }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY7) return unauthorized7();
  try {
    const result = await env.DB.prepare("DELETE FROM teams WHERE id = ?").bind(params.id).run();
    if (result.meta.changes === 0) return json7({ error: "Team not found" }, 404);
    return json7({ success: true });
  } catch (e) {
    return json7({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestDelete");
var ADMIN_KEY8 = "_Yvu|jxY6_90";
var json8 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized8 = /* @__PURE__ */ __name2(() => json8({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestGet = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY8) return unauthorized8();
  const result = await env.DB.prepare('SELECT * FROM feature_banners ORDER BY "order" ASC').all();
  return json8(result.results);
}, "onRequestGet");
var onRequestPost = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY8) return unauthorized8();
  const b = await request.json();
  const result = await env.DB.prepare(
    'INSERT INTO feature_banners (title, subtitle, description, image, buttonText, bgColor, "order", isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(b.title, b.subtitle, b.description || null, b.image, b.buttonText, b.bgColor, b.order ?? 0, b.isActive ? 1 : 0).run();
  return json8({ id: result.meta.last_row_id }, 201);
}, "onRequestPost");
var ADMIN_KEY9 = "_Yvu|jxY6_90";
var json9 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized9 = /* @__PURE__ */ __name2(() => json9({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestGet2 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY9) return unauthorized9();
  try {
    const result = await env.DB.prepare('SELECT * FROM brands ORDER BY "order" ASC').all();
    return json9(result.results);
  } catch (e) {
    return json9({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestGet");
var onRequestPost2 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY9) return unauthorized9();
  try {
    const b = await request.json();
    if (!b.name) return json9({ error: "Missing required field: name" }, 400);
    const result = await env.DB.prepare(
      'INSERT INTO brands (name, logo, "order", isActive) VALUES (?, ?, ?, ?)'
    ).bind(b.name, b.logo || null, b.order ?? 0, b.isActive ? 1 : 0).run();
    return json9({ id: result.meta.last_row_id }, 201);
  } catch (e) {
    return json9({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPost");
var ADMIN_KEY10 = "_Yvu|jxY6_90";
var json10 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized10 = /* @__PURE__ */ __name2(() => json10({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestGet3 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY10) return unauthorized10();
  try {
    const result = await env.DB.prepare('SELECT * FROM categories ORDER BY "order" ASC').all();
    return json10(result.results);
  } catch (e) {
    return json10({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestGet");
var onRequestPost3 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY10) return unauthorized10();
  try {
    const b = await request.json();
    if (!b.name) return json10({ error: "Missing required field: name" }, 400);
    const result = await env.DB.prepare(
      'INSERT INTO categories (name, "order", isActive) VALUES (?, ?, ?)'
    ).bind(b.name, b.order ?? 0, b.isActive !== false ? 1 : 0).run();
    return json10({ id: result.meta.last_row_id }, 201);
  } catch (e) {
    return json10({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPost");
var ADMIN_KEY11 = "_Yvu|jxY6_90";
var json11 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized11 = /* @__PURE__ */ __name2(() => json11({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestGet4 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY11) return unauthorized11();
  try {
    const result = await env.DB.prepare('SELECT * FROM genders ORDER BY "order" ASC').all();
    return json11(result.results);
  } catch (e) {
    return json11({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestGet");
var ADMIN_KEY12 = "_Yvu|jxY6_90";
var json12 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized12 = /* @__PURE__ */ __name2(() => json12({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestGet5 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY12) return unauthorized12();
  try {
    const result = await env.DB.prepare('SELECT * FROM heroes ORDER BY "order" ASC').all();
    return json12(result.results);
  } catch (e) {
    return json12({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestGet");
var onRequestPost4 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY12) return unauthorized12();
  try {
    const b = await request.json();
    if (!b.campaignName || !b.category || !b.imageUrl) {
      return json12({ error: "Missing required fields: campaignName, category, imageUrl" }, 400);
    }
    const result = await env.DB.prepare(
      'INSERT INTO heroes (campaignName, category, description, imageUrl, videoUrl, ctaText, isActive, "order") VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(b.campaignName, b.category, b.description || null, b.imageUrl, b.videoUrl || null, b.ctaText || "COMPRAR AHORA", b.isActive ? 1 : 0, b.order ?? 0).run();
    return json12({ id: result.meta.last_row_id }, 201);
  } catch (e) {
    return json12({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPost");
var ADMIN_KEY13 = "_Yvu|jxY6_90";
var json13 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized13 = /* @__PURE__ */ __name2(() => json13({ error: "Unauthorized" }, 401), "unauthorized");
var ADMIN_QUERY = `
  SELECT p.*, b.name AS brand, c.name AS category, s.name AS sport, g.name AS gender,
         GROUP_CONCAT(pi.url ORDER BY pi.sort_order) AS gallery
  FROM products p
  LEFT JOIN brands      b  ON b.id  = p.brand_id
  LEFT JOIN categories  c  ON c.id  = p.category_id
  LEFT JOIN sports      s  ON s.id  = p.sport_id
  LEFT JOIN genders     g  ON g.id  = p.gender_id
  LEFT JOIN product_images pi ON pi.product_id = p.id
  GROUP BY p.id ORDER BY p.id ASC
`;
var onRequestGet6 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY13) return unauthorized13();
  try {
    const result = await env.DB.prepare(ADMIN_QUERY).all();
    return json13(result.results);
  } catch (e) {
    return json13({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestGet");
var onRequestPost5 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY13) return unauthorized13();
  try {
    const b = await request.json();
    if (!b.name || !b.price) return json13({ error: "name y price son requeridos" }, 400);
    const ins = await env.DB.prepare(
      `INSERT INTO products (name, price, brand_id, category_id, sport_id, gender_id,
                             image, isBestSeller, isNew, description, sizes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      b.name,
      b.price,
      b.brand_id || null,
      b.category_id || null,
      b.sport_id || null,
      b.gender_id || null,
      b.image || "",
      b.isBestSeller ? 1 : 0,
      b.isNew ? 1 : 0,
      b.description || null,
      b.sizes || null
    ).run();
    const productId = ins.meta.last_row_id;
    const gallery = Array.isArray(b.gallery) ? b.gallery : [];
    for (let i = 0; i < gallery.length; i++) {
      if (gallery[i]) {
        await env.DB.prepare(
          "INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)"
        ).bind(productId, gallery[i], i).run();
      }
    }
    return json13({ id: productId }, 201);
  } catch (e) {
    return json13({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPost");
var ADMIN_KEY14 = "_Yvu|jxY6_90";
var json14 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized14 = /* @__PURE__ */ __name2(() => json14({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestGet7 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY14) return unauthorized14();
  try {
    const result = await env.DB.prepare('SELECT * FROM sports ORDER BY "order" ASC').all();
    return json14(result.results);
  } catch (e) {
    return json14({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestGet");
var onRequestPost6 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY14) return unauthorized14();
  try {
    const b = await request.json();
    if (!b.name) {
      return json14({ error: "Missing required field: name" }, 400);
    }
    const result = await env.DB.prepare(
      'INSERT INTO sports (name, icon, "order", isActive) VALUES (?, ?, ?, ?)'
    ).bind(b.name, b.icon || null, b.order ?? 0, b.isActive ? 1 : 0).run();
    return json14({ id: result.meta.last_row_id }, 201);
  } catch (e) {
    return json14({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPost");
var ADMIN_KEY15 = "_Yvu|jxY6_90";
var json15 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized15 = /* @__PURE__ */ __name2(() => json15({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestGet8 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY15) return unauthorized15();
  try {
    const result = await env.DB.prepare("SELECT * FROM teams ORDER BY id ASC").all();
    return json15(result.results);
  } catch (e) {
    return json15({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestGet");
var onRequestPost7 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY15) return unauthorized15();
  try {
    const b = await request.json();
    if (!b.name || !b.country || !b.type) {
      return json15({ error: "Missing required fields: name, country, type" }, 400);
    }
    const result = await env.DB.prepare(
      "INSERT INTO teams (name, country, type, logo) VALUES (?, ?, ?, ?)"
    ).bind(b.name, b.country, b.type, b.logo || null).run();
    return json15({ id: result.meta.last_row_id }, 201);
  } catch (e) {
    return json15({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPost");
var ADMIN_KEY16 = "_Yvu|jxY6_90";
var json16 = /* @__PURE__ */ __name2((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }), "json");
var unauthorized16 = /* @__PURE__ */ __name2(() => json16({ error: "Unauthorized" }, 401), "unauthorized");
var onRequestPost8 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY16) return unauthorized16();
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) return json16({ error: "No file provided" }, 400);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const key = `images/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    await env.IMAGES.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type || `image/${ext}` }
    });
    return json16({ path: `/${key}`, key });
  } catch (e) {
    return json16({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestPost");
var onRequestGet9 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY16) return unauthorized16();
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
    return json16(items);
  } catch (e) {
    return json16({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestGet");
var onRequestDelete8 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  if (request.headers.get("x-admin-key") !== ADMIN_KEY16) return unauthorized16();
  try {
    const body = await request.json();
    if (!body.key) return json16({ error: "Missing required field: key" }, 400);
    await env.IMAGES.delete(body.key);
    return json16({ success: true });
  } catch (e) {
    return json16({ error: e.message ?? "Internal error" }, 500);
  }
}, "onRequestDelete");
var corsHeaders = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
var onRequestGet10 = /* @__PURE__ */ __name2(async ({ env }) => {
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
var corsHeaders2 = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
var onRequestGet11 = /* @__PURE__ */ __name2(async ({ env }) => {
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
var corsHeaders3 = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
var onRequestGet12 = /* @__PURE__ */ __name2(async ({ env }) => {
  try {
    const result = await env.DB.prepare(
      'SELECT * FROM categories WHERE isActive = 1 ORDER BY "order" ASC'
    ).all();
    return new Response(JSON.stringify(result.results), { headers: corsHeaders3 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: corsHeaders3 });
  }
}, "onRequestGet");
var corsHeaders4 = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
var onRequestGet13 = /* @__PURE__ */ __name2(async ({ env }) => {
  try {
    const result = await env.DB.prepare(
      'SELECT * FROM heroes WHERE isActive = 1 ORDER BY "order" ASC'
    ).all();
    return new Response(JSON.stringify(result.results), { headers: corsHeaders4 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders4
    });
  }
}, "onRequestGet");
var cors = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
var BASE_QUERY = `
  SELECT p.id, p.name, p.price,
         b.name  AS brand,   p.brand_id,
         c.name  AS category, p.category_id,
         s.name  AS sport,   p.sport_id,
         g.name  AS gender,  p.gender_id,
         p.image, p.isBestSeller, p.isNew, p.description, p.sizes, p.createdAt,
         GROUP_CONCAT(pi.url ORDER BY pi.sort_order) AS gallery
  FROM products p
  LEFT JOIN brands     b  ON b.id  = p.brand_id
  LEFT JOIN categories c  ON c.id  = p.category_id
  LEFT JOIN sports     s  ON s.id  = p.sport_id
  LEFT JOIN genders    g  ON g.id  = p.gender_id
  LEFT JOIN product_images pi ON pi.product_id = p.id
`;
var onRequestGet14 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  try {
    const url = new URL(request.url);
    const sport = url.searchParams.get("sport");
    const category = url.searchParams.get("category");
    const brand = url.searchParams.get("brand");
    const gender = url.searchParams.get("gender");
    const isNew = url.searchParams.get("isNew");
    const best = url.searchParams.get("bestSeller");
    let where = "WHERE 1=1";
    const params = [];
    if (sport) {
      where += " AND s.name = ?";
      params.push(sport);
    }
    if (category) {
      where += " AND c.name = ?";
      params.push(category);
    }
    if (brand) {
      where += " AND b.name = ?";
      params.push(brand);
    }
    if (gender) {
      where += " AND g.name = ?";
      params.push(gender);
    }
    if (isNew === "true") where += " AND p.isNew = 1";
    if (best === "true") where += " AND p.isBestSeller = 1";
    const query = `${BASE_QUERY} ${where} GROUP BY p.id ORDER BY p.id ASC`;
    const result = await env.DB.prepare(query).bind(...params).all();
    return new Response(JSON.stringify(result.results), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message ?? "Internal error" }), { status: 500, headers: cors });
  }
}, "onRequestGet");
var corsHeaders5 = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
var onRequestGet15 = /* @__PURE__ */ __name2(async ({ env }) => {
  try {
    const result = await env.DB.prepare(
      'SELECT * FROM sports WHERE isActive = 1 ORDER BY "order" ASC'
    ).all();
    return new Response(JSON.stringify(result.results), { headers: corsHeaders5 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders5
    });
  }
}, "onRequestGet");
var corsHeaders6 = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
var onRequestGet16 = /* @__PURE__ */ __name2(async ({ env, request }) => {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    let query = "SELECT * FROM teams";
    const params = [];
    if (type) {
      query += " WHERE type = ?";
      params.push(type);
    }
    query += " ORDER BY id ASC";
    const result = await env.DB.prepare(query).bind(...params).all();
    return new Response(JSON.stringify(result.results), { headers: corsHeaders6 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders6
    });
  }
}, "onRequestGet");
var onRequestGet17 = /* @__PURE__ */ __name2(async ({ env, params }) => {
  try {
    const pathParts = params.path;
    const key = "images/" + pathParts.join("/");
    const obj = await env.IMAGES.get(key);
    if (!obj) return new Response("Not found", { status: 404 });
    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return new Response(obj.body, { headers });
  } catch (e) {
    return new Response("Internal server error", { status: 500 });
  }
}, "onRequestGet");
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
    routePath: "/api/admin/teams/:id",
    mountPath: "/api/admin/teams",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete7]
  },
  {
    routePath: "/api/admin/teams/:id",
    mountPath: "/api/admin/teams",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut7]
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
    routePath: "/api/admin/teams",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet8]
  },
  {
    routePath: "/api/admin/teams",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost7]
  },
  {
    routePath: "/api/admin/upload",
    mountPath: "/api/admin",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete8]
  },
  {
    routePath: "/api/admin/upload",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet9]
  },
  {
    routePath: "/api/admin/upload",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost8]
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
    routePath: "/api/heroes",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet13]
  },
  {
    routePath: "/api/products",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet14]
  },
  {
    routePath: "/api/sports",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet15]
  },
  {
    routePath: "/api/teams",
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
__name2(lexer, "lexer");
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
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
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
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
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
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
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
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
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
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
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
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
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
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
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
          passThroughOnException: /* @__PURE__ */ __name2(() => {
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
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
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
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
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
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
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
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name2(this, "__Facade_ScheduledController__");
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
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
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
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
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
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
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
var middleware_ensure_req_body_drained_default2 = drainBody2;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-sUqJr3/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-sUqJr3/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
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
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
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
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
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
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.6407530782391799.js.map
