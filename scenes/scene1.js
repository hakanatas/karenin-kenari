/* SAHNE 1 — KARE (0–10 s)  Alan 25, kenar 5.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  /* ---- boxes and equal objects: cabinet projection, x right, y back, z up ---- */
  const Pj = (O, c, x, y, z) => [O[0] + x * c + y * c * 0.5, O[1] - z * c - y * c * 0.5];
  function poly(ctx, P, a, fill, seed, w = 3) {
    ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    fill.forEach((f) => { if (f) { ctx.fillStyle = f; ctx.fill(); } });
    Ink.path(ctx, P.concat([P[0]]), { w, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** a solid block x..x+dx, y..y+dy, z..z+dz */
  function block(ctx, O, c, x, y, z, dx, dy, dz, a, h, seed) {
    if (a <= 0) return;
    const P = (i, j, k) => Pj(O, c, x + i * dx, y + j * dy, z + k * dz), H = h > 0 ? amber(a * 0.6 * h) : null;
    poly(ctx, [P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)], a, [amber(a * 0.2), H], seed, 2.5);
    poly(ctx, [P(1, 0, 0), P(1, 1, 0), P(1, 1, 1), P(1, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.14})`, H], seed + 1, 2.5);
    poly(ctx, [P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.04})`, H], seed + 2, 2.5);
  }
  function ball(ctx, O, c, x, y, z, a, seed) {
    if (a <= 0) return; const C = Pj(O, c, x + 0.5, y + 0.5, z + 0.5), r = c * 0.47;
    ctx.beginPath(); ctx.arc(C[0], C[1], r, 0, 7);
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    const g = ctx.createRadialGradient(C[0] - r * 0.35, C[1] - r * 0.35, r * 0.1, C[0], C[1], r);
    g.addColorStop(0, amber(a * 0.12)); g.addColorStop(1, amber(a * 0.45)); ctx.fillStyle = g; ctx.fill();
    const P = []; for (let i = 0; i <= 28; i++) P.push([C[0] + r * Math.cos(i / 28 * 6.2832), C[1] + r * Math.sin(i / 28 * 6.2832)]);
    Ink.path(ctx, P, { w: 2.5, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** items [{x,y,z,dx,dy,dz}] in painter's order, each with a fill index i */
  function fillList(L, W, H, dx = 1) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x += dx) out.push({ x, y, z, dx, dy: 1, dz: 1 });
    out.forEach((q, i) => (q.i = i));
    return out.slice().sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  const shown = (t, t0, dt, n) => Math.max(0, Math.min(n, Math.floor((t - t0) / dt + 0.4)));
  /** an open glass box: back walls first, then the contents, then the front edges */
  function container(ctx, O, c, L, W, H, a, seed, draw) {
    if (a <= 0) return;
    const P = (x, y, z) => Pj(O, c, x, y, z), ink = `rgba(${LI.INK_RGB},${a * 0.05})`;
    poly(ctx, [P(0, W, 0), P(L, W, 0), P(L, W, H), P(0, W, H)], a * 0.8, [ink], seed, 2);
    poly(ctx, [P(0, 0, 0), P(0, W, 0), P(0, W, H), P(0, 0, H)], a * 0.8, [ink], seed + 1, 2);
    poly(ctx, [P(0, 0, 0), P(L, 0, 0), P(L, W, 0), P(0, W, 0)], a * 0.8, [ink], seed + 2, 2);
    if (draw) draw();
    [[[0, 0, 0], [L, 0, 0]], [[L, 0, 0], [L, 0, H]], [[L, 0, H], [0, 0, H]], [[0, 0, H], [0, 0, 0]], [[L, 0, 0], [L, W, 0]], [[L, W, 0], [L, W, H]], [[L, W, H], [L, 0, H]], [[0, W, H], [L, W, H]], [[0, 0, H], [0, W, H]]]
      .forEach(([p, q], i) => Ink.path(ctx, [P(...p), P(...q)], { w: 3, alpha: a * 0.85, seed: seed + 10 + i, taper: [0, 0] }));
  }
  function fillBox(ctx, O, c, L, W, H, t, t0, dt, a, seed, kind = 'cube', hot = 0) {
    const dx = kind === 'brick' ? 2 : 1, items = fillList(L, W, H, dx);
    container(ctx, O, c, L, W, H, a, seed, () => items.forEach((q) => {
      const k = seg(t, t0 + q.i * dt, t0 + q.i * dt + 0.35); if (k <= 0) return;
      const dz = (1 - inOut(k)) * (H + 1 - q.z);
      if (kind === 'ball') ball(ctx, O, c, q.x, q.y, q.z + dz, a * k, seed + 100 + q.i * 3);
      else block(ctx, O, c, q.x, q.y, q.z + dz, q.dx, 1, 1, a * k, hot, seed + 100 + q.i * 3);
    }));
    return items.length;
  }
  function tag(ctx, env, O, c, L, text, a, hot) {
    if (a <= 0) return; const s = KD.L(env).G.s;
    F().T(ctx, text, O[0] + L * c / 2, O[1] + s * 0.95, { size: s * 0.66, alpha: a, halo: true, color: hot ? A.amber : undefined });
  }
  /** cubes of an L × W × H prism; when(q) gives each cube's arrival time (Infinity = never) */
  function cubes(L, W, H) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x++) out.push({ x, y, z });
    return out.sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  function fillT(ctx, O, c, B, t, a, when, hot, seed) {
    let n = 0;
    container(ctx, O, c, B[0], B[1], B[2], a, seed, () => cubes(...B).forEach((q, i) => {
      const t0 = when(q); if (!(t >= t0)) return; n++;
      const k = seg(t, t0, t0 + 0.3);
      block(ctx, O, c, q.x, q.y, q.z + (1 - inOut(k)) * 1.2, 1, 1, 1, a * k, hot ? hot(q) : 0, seed + 100 + i * 3);
    }));
    return n;
  }
  function edges(ctx, env, O, c, B, a, labels) {
    if (a <= 0) return; const s = KD.L(env).G.s, o = { size: s * 0.7, alpha: a, halo: true, color: A.amber };
    const m = (p, q) => { const P = Pj(O, c, ...p), Q = Pj(O, c, ...q); return [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]; };
    const [L, W, H] = B;
    let q = m([0, 0, 0], [L, 0, 0]); F().T(ctx, labels[0], q[0], q[1] + 36, o);
    q = m([L, 0, 0], [L, W, 0]); F().T(ctx, labels[1], q[0] + 50, q[1] + 12, o);
    q = m([L, W, 0], [L, W, H]); F().T(ctx, labels[2], q[0] + 48, q[1], o);
  }
  function tally(ctx, env, t, rows) {
    const T = KD.L(env).TL;
    rows.forEach(([t0, t1, txt, hot], i) => { const al = win(t, t0, t1) * END(t); if (al > 0) F().T(ctx, txt, T.x, T.y[i], { size: T.s, alpha: al, halo: true, color: hot ? A.amber : undefined }); });
  }

  /** text with exponents written as ^{…}, centred at x */
  function pw(ctx, str, x, y, size, o = {}) {
    const a = o.alpha ?? 1; if (a <= 0) return;
    const parts = []; let rest = str;
    while (rest.length) { const i = rest.indexOf('^{'); if (i < 0) { parts.push([rest, false]); break; } if (i > 0) parts.push([rest.slice(0, i), false]); const j = rest.indexOf('}', i); parts.push([rest.slice(i + 2, j), true]); rest = rest.slice(j + 1); }
    const W = F().width, ws = parts.map(([s, sup]) => W(ctx, s, sup ? size * 0.6 : size)), tot = ws.reduce((p, q) => p + q, 0);
    let left = x - tot / 2;
    if (o.halo !== false) { ctx.fillStyle = `rgba(${LI.PAPER_RGB},${0.85 * a})`; ctx.fillRect(left - 14, y - size * 0.75, tot + 28, size * 1.35); }
    parts.forEach(([s, sup], i) => { A.text(ctx, s, left, sup ? y - size * 0.38 : y, { size: sup ? size * 0.6 : size, alpha: a, align: 'left', color: o.color }); left += ws[i]; });
  }
  function eqs(ctx, env, t, rows) {
    const E = KD.L(env).EQ;
    rows.forEach(([t0, t1, s, hot], i) => { const al = win(t, t0, t1) * END(t); if (al > 0) pw(ctx, s, E.x, E.y[i], E.s * (hot ? 1.05 : 0.9), { alpha: al, color: hot ? A.amber : undefined }); });
  }
  /** an N × N outline, a solid n × n square and k cells filled row by row */
  function grid(ctx, env, N, n, k, a, o = {}) {
    if (a <= 0) return; const Q = KD.L(env).SQ, u = Q.b / N, x0 = Q.x - Q.b / 2, y0 = Q.y;
    const cell = (i, j, fill) => { ctx.fillStyle = fill; ctx.fillRect(x0 + i * u + 1, y0 - (j + 1) * u + 1, u - 2, u - 2); ctx.strokeStyle = `rgba(${LI.INK_RGB},${a * 0.6})`; ctx.lineWidth = 1.2; ctx.strokeRect(x0 + i * u + 1, y0 - (j + 1) * u + 1, u - 2, u - 2); };
    let c = 0;
    for (let j = 0; j < N && c < k; j++) for (let i = 0; i < N && c < k; i++) {
      const inside = i < n && j < n; if (o.squareFirst && !inside) continue; cell(i, j, inside ? amber(a * 0.55) : `rgba(${LI.INK_RGB},${a * 0.25})`); c++;
    }
    if (o.squareFirst) for (let j = 0; j < N && c < k; j++) for (let i = 0; i < N && c < k; i++) { if (i < n && j < n) continue; cell(i, j, `rgba(${LI.INK_RGB},${a * 0.25})`); c++; }
    if (o.outline) { const P = [[x0, y0], [x0 + N * u, y0], [x0 + N * u, y0 - N * u], [x0, y0 - N * u], [x0, y0]]; for (let i = 0; i < 4; i++) { const p = P[i], q = P[i + 1]; for (let s = 0; s < 10; s += 2) Ink.path(ctx, [[lerp(p[0], q[0], s / 10), lerp(p[1], q[1], s / 10)], [lerp(p[0], q[0], (s + 1) / 10), lerp(p[1], q[1], (s + 1) / 10)]], { w: 2.5, alpha: a * 0.7, seed: 700 + i * 10 + s, taper: [0, 0] }); } }
    if (n > 0) { const P = [[x0, y0], [x0 + n * u, y0], [x0 + n * u, y0 - n * u], [x0, y0 - n * u], [x0, y0]]; Ink.path(ctx, P, { w: 4, alpha: a, seed: 790, taper: [0, 0] }); }
    const s = KD.L(env).G.s;
    if (o.side) { pw(ctx, o.side, x0 + n * u / 2, y0 + s * 0.8, s * 0.8, { alpha: a }); pw(ctx, o.side, x0 - s * 0.9, y0 - n * u / 2, s * 0.8, { alpha: a }); }
  }
  function nline(ctx, env, lo, hi, v, a, band) {
    if (a <= 0) return; const N = KD.L(env).NL, s = KD.L(env).G.s, X = (q) => lerp(N.x0, N.x1, (q - lo) / (hi - lo));
    Ink.path(ctx, [[N.x0 - 20, N.y], [N.x1 + 20, N.y]], { w: 3, alpha: a, seed: 800, taper: [0, 0] });
    for (let i = 0; i <= 10; i++) { const x = X(lo + (hi - lo) * i / 10); Ink.path(ctx, [[x, N.y - (i % 5 ? 7 : 12)], [x, N.y + (i % 5 ? 7 : 12)]], { w: 2, alpha: a, seed: 810 + i, taper: [0, 0] }); }
    [lo, hi].forEach((q) => F().T(ctx, String(q), X(q), N.y + s * 0.8, { size: s * 0.72, alpha: a, halo: true }));
    if (band) { const [b0, b1] = band; ctx.fillStyle = amber(a * 0.35); ctx.fillRect(X(b0), N.y - 10, X(b1) - X(b0), 20); F().T(ctx, String(b0).replace('.', ','), X(b0), N.y + s * 0.8, { size: s * 0.55, alpha: a, halo: true, color: A.amber }); F().T(ctx, String(b1).replace('.', ','), X(b1), N.y + s * 0.8, { size: s * 0.55, alpha: a, halo: true, color: A.amber }); }
    if (v != null) { const x = X(v.x); ctx.beginPath(); ctx.arc(x, N.y, 9, 0, 7); ctx.fillStyle = amber(a); ctx.fill(); pw(ctx, v.label, x, N.y - s * 0.9, s * 0.8, { alpha: a, color: A.amber }); }
  }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Alanı 25 birimkare olan bir kare'],
      [10.6, 27.8, 'Tam kareler ve karekökleri'],
      [28.4, 45.8, 'Alanı 20 birimkare olan kare'],
      [46.4, 63.8, '√20’ye yaklaşalım'],
      [64.4, 79.8, 'Bir örnek daha: √50'],
    ]);
  }

  function figure(ctx, env, t) {
    const a = END(t);
    // S1: 25 cells → a 5 × 5 square
    const a1 = a * win(t, 4.6, 10.2);
    grid(ctx, env, 5, t > 8.0 ? 5 : 0, Math.floor(seg(t, 5.0, 7.6) * 25), a1, { side: t > 8.0 ? '5' : null });
    // S2: squares from 1 to 6
    const a2 = a * win(t, 10.8, 27.8), n2 = Math.min(6, 1 + Math.floor(seg(t, 11.2, 20.2) * 6));
    grid(ctx, env, 6, n2, n2 * n2, a2, { side: String(n2) });
    eqs(ctx, env, t, [[12.6, 27.8, '3^{2} = 9 → √9 = 3'], [15.6, 27.8, '4^{2} = 16 → √16 = 4'], [17.2, 27.8, '5^{2} = 25 → √25 = 5'], [18.8, 27.8, '6^{2} = 36 → √36 = 6'], [21.4, 27.8, 'Tam kare: 1, 4, 9, 16, 25, 36 …', true]]);
    // S3: 20 cells
    const a3 = a * win(t, 28.8, 45.8);
    grid(ctx, env, 5, 4, Math.floor(seg(t, 29.2, 31.6) * 20), a * win(t, 28.8, 63.8), { outline: true, squareFirst: true });
    eqs(ctx, env, t, [[32.0, 45.8, '20 kare bir kare oluşturmuyor'], [34.0, 45.8, '4^{2} = 16 < 20 < 25 = 5^{2}'], [36.0, 45.8, '4 < √20 < 5', true]]);
    nline(ctx, env, 4, 5, t > 38.0 ? { x: 4.47, label: '√20' } : null, a3 * seg(t, 37.4, 37.8));
    // S4: narrow it down
    const a4 = a * win(t, 46.8, 63.8);
    eqs(ctx, env, t, [[47.4, 63.8, '4,4^{2} = 19,36'], [49.0, 63.8, '4,5^{2} = 20,25'], [50.6, 63.8, '19,36 < 20 < 20,25'], [52.6, 63.8, '4,4 < √20 < 4,5 · √20 ≈ 4,47', true]]);
    nline(ctx, env, 4, 5, t > 52.6 ? { x: 4.47, label: '√20 ≈ 4,47' } : null, a4, t > 50.6 ? [4.4, 4.5] : null);
    // S5: √50
    const a5 = a * win(t, 64.8, 79.8);
    grid(ctx, env, 8, 7, Math.floor(seg(t, 65.2, 67.4) * 50), a5, { outline: true, squareFirst: true });
    eqs(ctx, env, t, [[65.4, 79.8, '7^{2} = 49 < 50 < 64 = 8^{2}'], [67.4, 79.8, '7 < √50 < 8'], [69.4, 79.8, '7,1^{2} = 50,41 · 7,0^{2} = 49'], [71.4, 79.8, '√50 ≈ 7,07', true]]);
    nline(ctx, env, 7, 8, t > 71.4 ? { x: 7.07, label: '√50 ≈ 7,07' } : null, a5 * seg(t, 66.0, 66.4), t > 69.4 ? [7.0, 7.1] : null);
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[5.6, 10.2, '25 birimkareyi bir kareye dizelim'],
      [11.4, 27.8, 'Karenin alanı = kenar × kenar'],
      [29.4, 45.8, '20 birimkareyi kareye dizmeye çalışalım'],
      [47.4, 63.8, 'Ondalıklı sayıların karelerini deneyelim'],
      [65.4, 79.8, '50, 49 ile 64 arasında']]);
    exprs(ctx, t, at(W, 1), [[8.0, 10.2, 'Kenarı 5 birim: 5 × 5 = 25'], [21.4, 27.8, 'Tam kare sayının karekökü bir doğal sayı'],
      [38.0, 45.8, '√20 tam sayı değil: 4 ile 5 arasında'],
      [55.0, 63.8, '4,47 × 4,47 ≈ 19,98: çok yakın'],
      [74.0, 79.8, '√a: alanı a olan karenin kenar uzunluğu']]);
    exprs(ctx, t, at(W, 2), [[9.0, 10.2, 'Alan 25 ise kenar 5: √25 = 5', true], [24.0, 27.8, 'Karekök, alandan kenara gider', true],
      [41.0, 45.8, '20, 16 ile 25 arasında', true], [58.0, 63.8, 'Aralığı daralttık: √20 ≈ 4,47', true], [76.0, 79.8, 'Hangi iki doğal sayı arasında? Sonra yaklaş!', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Alan = kenar × kenar', 80.6], ['√a: alanı a olan karenin kenarı', 81.6], ['Tam kare değilse: iki doğal sayı arasında', 82.6], ['Önce aralığı bul, sonra yaklaş!', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'A square', nameTr: 'Kare', concept: 'Area 25, side 5', conceptTr: 'Alan 25, kenar 5', render });
})(window.LI = window.LI || {});
