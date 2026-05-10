/**
 * Runtime smoke test using jsdom.
 * Loads the built bundle, creates components, exercises them, verifies behavior.
 */

const fs = require('fs');
const { JSDOM } = require('jsdom');

const code = fs.readFileSync(__dirname + '/tokamak.min.js', 'utf8');

const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`, {
  runScripts: 'outside-only',
  pretendToBeVisual: true,
});

// Polyfill: jsdom doesn't yet support ElementInternals fully, but it has the basics
const { window } = dom;
window.requestAnimationFrame = (cb) => setTimeout(cb, 16);
window.cancelAnimationFrame  = (id) => clearTimeout(id);

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else      { fail++; console.log('  ✗ ' + name); }
}

try {
  dom.window.eval(code);
} catch (e) {
  console.error('Bundle eval failed:', e.message);
  process.exit(1);
}

console.log('Bundle loaded.\n');

// ── Test 1: Buttons register and click ─────────────────────
console.log('Test: tok-button');
const btn = window.document.createElement('tok-button');
btn.textContent = 'Click';
window.document.body.appendChild(btn);
check('button has shadow root', btn.shadowRoot !== null);
check('button shadow has <button>', btn.shadowRoot.querySelector('button') !== null);

let clickFired = false;
btn.addEventListener('tok-click', () => { clickFired = true; });
btn.shadowRoot.querySelector('button').click();
check('tok-click fires on click', clickFired);

// Disabled blocks click
btn.setAttribute('disabled', '');
clickFired = false;
btn.shadowRoot.querySelector('button').click();
check('disabled blocks tok-click', !clickFired);
check('inner button.disabled mirrors', btn.shadowRoot.querySelector('button').disabled === true);
btn.removeAttribute('disabled');
check('removing disabled un-disables inner', btn.shadowRoot.querySelector('button').disabled === false);

// ── Test 2: Badge ───────────────────────────────────────────
console.log('\nTest: tok-badge');
const badge = window.document.createElement('tok-badge');
badge.textContent = 'Test';
window.document.body.appendChild(badge);
check('badge shadow has .badge', badge.shadowRoot.querySelector('.badge') !== null);
// Variant doesn't trigger errors
badge.setAttribute('variant', 'outline');
check('badge variant change does not error', true);

// ── Test 3: Input — listeners survive attribute changes ────
console.log('\nTest: tok-input listener persistence');
const inp = window.document.createElement('tok-input');
inp.setAttribute('placeholder', 'foo');
window.document.body.appendChild(inp);
let changes = 0;
inp.addEventListener('tok-input', () => changes++);
const innerInput = inp.shadowRoot.querySelector('input');
innerInput.value = 'hello';
innerInput.dispatchEvent(new window.Event('input', { bubbles: true }));
check('initial tok-input fires', changes === 1);

// Change placeholder via attribute — should NOT lose the listener
inp.setAttribute('placeholder', 'changed');
const sameInput = inp.shadowRoot.querySelector('input');
check('input element is the same after placeholder change', sameInput === innerInput);
sameInput.dispatchEvent(new window.Event('input', { bubbles: true }));
check('tok-input still fires after attr change', changes === 2);

// Disabled attr change preserves value
inp.value = 'preserved';
inp.setAttribute('disabled', '');
check('value preserved on disabled toggle', inp.value === 'preserved');
check('inner.disabled is true', inp.shadowRoot.querySelector('input').disabled === true);

// ── Test 4: Toggle state via CSS, listener kept ────────────
console.log('\nTest: tok-toggle');
const tog = window.document.createElement('tok-toggle');
tog.setAttribute('label', 'Test');
window.document.body.appendChild(tog);
let togChanges = 0;
tog.addEventListener('tok-change', e => { togChanges++; });

const track1 = tog.shadowRoot.querySelector('.track');
tog.click();
check('toggle click fires change', togChanges === 1);
check('toggle has checked attribute', tog.hasAttribute('checked'));
const track2 = tog.shadowRoot.querySelector('.track');
check('track element identity preserved (no re-render)', track1 === track2);

tog.click();
check('toggle click again fires', togChanges === 2);
check('toggle now unchecked', !tog.hasAttribute('checked'));

// ── Test 5: Checkbox same idea ─────────────────────────────
console.log('\nTest: tok-checkbox');
const cb = window.document.createElement('tok-checkbox');
cb.setAttribute('label', 'X');
window.document.body.appendChild(cb);
const box1 = cb.shadowRoot.querySelector('.box');
cb.click();
check('checkbox sets checked', cb.checked === true);
const box2 = cb.shadowRoot.querySelector('.box');
check('checkbox DOM preserved (no re-render)', box1 === box2);

// ── Test 6: Radio group exclusivity ────────────────────────
console.log('\nTest: tok-radio-group');
const grp = window.document.createElement('tok-radio-group');
grp.setAttribute('name', 'tier');
const r1 = window.document.createElement('tok-radio');
r1.setAttribute('value', 'free');
r1.setAttribute('label', 'Free');
const r2 = window.document.createElement('tok-radio');
r2.setAttribute('value', 'pro');
r2.setAttribute('label', 'Pro');
grp.appendChild(r1);
grp.appendChild(r2);
window.document.body.appendChild(grp);

let groupValue = null;
grp.addEventListener('tok-change', e => { groupValue = e.detail.value; });
r1.click();
check('clicking r1 makes r1 checked', r1.checked);
check('r2 remains unchecked', !r2.checked);
check('group emits with value=free', groupValue === 'free');
r2.click();
check('clicking r2 makes r2 checked', r2.checked);
check('r1 is now unchecked (exclusivity)', !r1.checked);
check('group value=pro', groupValue === 'pro');

// ── Test 7: Card ───────────────────────────────────────────
console.log('\nTest: tok-card');
const card = window.document.createElement('tok-card');
card.setAttribute('title', 'Title');
card.setAttribute('body', 'Body');
window.document.body.appendChild(card);
check('card has shell', card.shadowRoot.querySelector('.shell') !== null);
const titleEl = card.shadowRoot.querySelector('.title-fallback');
check('title rendered', titleEl?.textContent === 'Title');
card.setAttribute('title', 'New Title');
check('title patched, no re-render', card.shadowRoot.querySelector('.title-fallback') === titleEl);
check('title text updated', titleEl.textContent === 'New Title');

// ── Test 8: Tabs ───────────────────────────────────────────
console.log('\nTest: tok-tabs');
const tabs = window.document.createElement('tok-tabs');
tabs.setAttribute('tabs', 'A,B,C');
window.document.body.appendChild(tabs);
const tabBtns = tabs.shadowRoot.querySelectorAll('button');
check('tabs has 3 buttons', tabBtns.length === 3);
check('first tab is active', tabBtns[0].classList.contains('active'));
let tabChange = null;
tabs.addEventListener('tok-change', e => { tabChange = e.detail; });
tabBtns[1].click();
check('tab change fires', tabChange?.tab === 'B' && tabChange?.index === 1);
check('B is now active', tabBtns[1].classList.contains('active'));
check('A is no longer active', !tabBtns[0].classList.contains('active'));
// Programmatic change via attribute
tabs.setAttribute('active', 'C');
check('programmatic active sets visual state', tabBtns[2].classList.contains('active'));
check('B is no longer active after programmatic change', !tabBtns[1].classList.contains('active'));

// ── Test 9: Progress ───────────────────────────────────────
console.log('\nTest: tok-progress');
const pr = window.document.createElement('tok-progress');
pr.setAttribute('value', '40');
pr.setAttribute('label', 'X');
window.document.body.appendChild(pr);
const fill = pr.shadowRoot.querySelector('.fill');
check('progress fill width 40%', fill.style.width === '40%');
pr.value = 80;
check('value setter updates DOM width', fill.style.width === '80%');
check('fill element preserved', pr.shadowRoot.querySelector('.fill') === fill);
pr.value = 999;
check('value clamps to 100', pr.value === 100);
pr.value = -5;
check('value clamps to 0', pr.value === 0);

// ── Test 10: Panel ─────────────────────────────────────────
console.log('\nTest: tok-panel');
const panel = window.document.createElement('tok-panel');
const slotTitle = window.document.createElement('span');
slotTitle.slot = 'title'; slotTitle.textContent = 'X';
panel.appendChild(slotTitle);
window.document.body.appendChild(panel);
check('panel has role=dialog', panel.getAttribute('role') === 'dialog');
let opened = false, closed = false;
panel.addEventListener('tok-open',  () => opened = true);
panel.addEventListener('tok-close', () => closed = true);

panel.show();
check('panel.show() sets open attr', panel.hasAttribute('open'));
check('aria-hidden becomes false', panel.getAttribute('aria-hidden') === 'false');
check('body overflow locked', window.document.body.style.overflow === 'hidden');

panel.hide();
check('panel.hide() removes open attr', !panel.hasAttribute('open'));
check('body overflow released', window.document.body.style.overflow === '');

// Open panel A, open panel B, close A — body should still be locked
const panelB = window.document.createElement('tok-panel');
window.document.body.appendChild(panelB);
panel.show();
panelB.show();
check('both panels open: body locked', window.document.body.style.overflow === 'hidden');
panel.hide();
check('first closes, body still locked (scroll counter)', window.document.body.style.overflow === 'hidden');
panelB.hide();
check('both closed, body unlocked', window.document.body.style.overflow === '');

// ── Test 11: XSS / escape ──────────────────────────────────
console.log('\nTest: HTML escaping');
const evilBtn = window.document.createElement('tok-button');
evilBtn.textContent = '<script>alert(1)</script>';
window.document.body.appendChild(evilBtn);
const innerHTML = evilBtn.shadowRoot.querySelector('.inner').innerHTML;
check('button does not contain raw script', !innerHTML.includes('<script>'));

const evilField = window.document.createElement('tok-field');
evilField.setAttribute('label', '<img src=x onerror=alert(1)>');
window.document.body.appendChild(evilField);
check('field label HTML escaped', !evilField.shadowRoot.querySelector('.label').innerHTML.includes('<img'));

// ── Test 12: Theme switching ───────────────────────────────
console.log('\nTest: dark mode');
const themeBtn = window.document.createElement('tok-button');
window.document.body.appendChild(themeBtn);
check('button starts without tok-dark class', !themeBtn.classList.contains('tok-dark'));
window.document.documentElement.dataset.theme = 'dark';
// MutationObserver is async — wait briefly
setTimeout(() => {
  check('button gets tok-dark class after theme switch', themeBtn.classList.contains('tok-dark'));

  window.document.documentElement.dataset.theme = 'light';
  setTimeout(() => {
    check('button removes tok-dark on revert', !themeBtn.classList.contains('tok-dark'));

    // ── Summary ────────────────────────────────────────────
    console.log(`\n${pass + fail} tests · ${pass} passed · ${fail} failed`);
    process.exit(fail > 0 ? 1 : 0);
  }, 50);
}, 50);
