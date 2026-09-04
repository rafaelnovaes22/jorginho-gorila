import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { Script, runInNewContext } from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

function functionSource(name) {
  const start = html.indexOf("function " + name + "(");
  assert.ok(start >= 0, name);
  let candidate = "";
  for (const line of html.slice(start).split("\n")) {
    candidate += line + "\n";
    try {
      new Script("(" + candidate + ")");
      return candidate;
    } catch {}
  }
  throw new Error("Could not extract function: " + name);
}

test("inline scripts parse", () => {
  for (const [, source] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Script(source);
});

test("registration opens the official path and never pretends to receive a lead", () => {
  const section = html.match(/<div class="fm" id="registration">([\s\S]*?)<\/div>/)[1];
  assert.ok(section.includes('href="https://jlteam.my.canva.site/entrar-para-o-time"'));
  assert.ok(!html.includes("Inscrição recebida"));
  assert.ok(!html.includes('<form class="fm"'));
  assert.ok(!section.includes("<input"));
});
