import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the voice blackjack invite", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Phoker Voice Blackjack<\/title>/i);
  assert.match(html, /Mina is calling/);
  assert.match(html, /Voice blackjack/);
  assert.match(html, /Answer/);
  assert.match(html, /Opened securely from your iMessage/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps game actions voice-only", async () => {
  const page = await import("node:fs/promises").then(({ readFile }) =>
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  );

  assert.match(page, /Say hit, stand, or double/);
  assert.match(page, /@vapi-ai\/web/);
  assert.doesNotMatch(page, />\s*(HIT|STAND|DOUBLE)\s*</);
});

test("keeps Mina visible and animated after the call is answered", async () => {
  const { readFile } = await import("node:fs/promises");
  const [page, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /dealer-mina-blink\.png/);
  assert.match(page, /dealer-stage mode-\$\{voiceMode\}/);
  assert.match(page, /experience-shell.*scrollTo\(0, 0\)/s);
  assert.match(styles, /\.game-header\s*\{[^}]*grid-row:\s*2;/s);
  assert.match(styles, /\.dealer-stage\s*\{[^}]*grid-row:\s*3;/s);
  assert.match(styles, /\.felt-table\s*\{[^}]*grid-row:\s*4;/s);
  assert.match(styles, /\.voice-tray\s*\{[^}]*grid-row:\s*5;/s);
  assert.match(styles, /@keyframes mina-blink/);
});
