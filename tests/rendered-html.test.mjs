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

test("server-renders the Helios observatory product shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="tr">/i);
  assert.match(html, /<title>Helios — Etkileşimli Güneş Gözlemevi<\/title>/i);
  assert.match(html, /Güneş Sistemimizin canlı ve sinematik bir modeli/i);
  assert.match(html, /Kamera görünümleri/i);
  assert.match(html, /Simülasyon zamanı/i);
  assert.match(html, /19 MAYIS 2081’E GİT/i);
  assert.doesNotMatch(html, /Your site is taking shape|Codex is working|codex-preview/i);
});

test("ships current planet facts and accessible control state", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /Jüpiter/i);
  assert.match(html, /Satürn/i);
  assert.match(html, /Uranüs/i);
  assert.match(html, /aria-pressed="true"/i);
  assert.match(html, /Yörünge süreleri, dışmerkezlik ve eğimler modellenmiştir/i);
});
