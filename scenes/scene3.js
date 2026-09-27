/* SAHNE 3 — ALAN 20 (28–46 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 3, start: 28, end: 46, name: "Area 20", nameTr: "Alan 20", concept: "Between 4 and 5", conceptTr: "4 ile 5 arasında", render });
})(window.LI = window.LI || {});
