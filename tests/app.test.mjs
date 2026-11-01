import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('installable PWA has standalone launch, scope, and PNG icons', () => {
  const manifest = JSON.parse(read('public/manifest.webmanifest'));
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, '/');
  assert.equal(manifest.scope, '/');
  assert.ok(manifest.icons.some((icon) => icon.sizes === '192x192'));
  assert.ok(manifest.icons.some((icon) => icon.sizes === '512x512'));
  assert.ok(existsSync(new URL('../public/icons/icon-192.png', import.meta.url)));
  assert.ok(existsSync(new URL('../public/icons/icon-512.png', import.meta.url)));
});

test('app shell is fixed, touch-first, and keeps existing projects separate', () => {
  const css = read('src/styles.css');
  const app = read('src/App.tsx');
  assert.match(css, /overflow:\s*hidden/);
  assert.match(css, /100dvh/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(app, /Photo Library/);
  assert.match(app, /808 Studio/);
  assert.doesNotMatch(app, /<iframe/i);
});

test('offline worker only intercepts same-origin static requests', () => {
  const worker = read('public/sw.js');
  assert.match(worker, /url.origin !== self.location.origin/);
  assert.match(worker, /startsWith\('\/assets\/'\)/);
});
