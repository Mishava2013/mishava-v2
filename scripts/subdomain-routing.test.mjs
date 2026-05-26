import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("subdomain routing maps requested Mishava hosts to existing surfaces", () => {
  const routing = read("src/lib/subdomain-routing.ts");
  const middleware = read("middleware.ts");

  for (const [host, target] of [
    ["root: \"/shopping\"", "/shopping"],
    ["shopping: \"/shopping\"", "/shopping"],
    ["ngo: \"/ngo\"", "/ngo"],
    ["business: \"/business\"", "/business"],
    ["corporate: \"/corporate\"", "/corporate"],
    ["app: \"/app\"", "/app"],
    ["support: \"/support\"", "/support"],
    ["trust: \"/methodology\"", "/methodology"],
    ["admin: \"/admin\"", "/admin"],
    ["api: \"/api\"", "/api"],
    ["gov: \"/gov\"", "/gov"],
    ["research: \"/research\"", "/research"],
    ["media: \"/research\"", "/research"],
  ]) {
    assert.match(routing, new RegExp(host.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(routing, new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(routing, /mishava\.org/);
  assert.match(middleware, /resolveMishavaSubdomainRoute/);
  assert.match(middleware, /NextResponse\.rewrite/);
});

test("reserved subdomain pages avoid premature readiness claims", () => {
  const corporate = read("src/app/corporate/page.tsx");
  const gov = read("src/app/gov/page.tsx");
  const research = read("src/app/research/page.tsx");
  const api = read("src/app/api/page.tsx");

  assert.match(corporate, /Payment can unlock tools and capacity/);
  assert.match(gov, /not live for government use yet/);
  assert.match(research, /reserved for future evidence/);
  assert.match(api, /Public API access is not live yet/);

  for (const page of [corporate, gov, research, api]) {
    assert.doesNotMatch(page, /SOC 2 certified|FedRAMP authorized|VPAT complete|public API is live/i);
  }
});

test("subdomain routing result documents DNS work and scope boundaries", () => {
  const result = read("docs/mishava-subdomain-routing-result.md");

  assert.match(result, /DNS and hosting\/platform configuration/);
  assert.match(result, /No new product workflows/);
  assert.match(result, /media\.mishava\.org/);
  assert.match(result, /trust\.mishava\.org/);
});
