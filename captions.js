/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 8. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Alan 25, kenar 5', en: 'Area 25, side 5',
      note: '25 birimkareyi bir kareye dizelim: kenarı 5 birim olan bir kare. Alan 25 ise kenar 5: karekök 25, 5.' },
    { scene: 2, start: 10.8, end: 20.8, tr: 'Tam kareler', en: 'Perfect squares',
      note: 'Kenar 1, 2, 3 diye büyüdükçe alan 1, 4, 9, 16, 25, 36 oluyor. 4’ün karesi 16, öyleyse karekök 16, 4.' },
    { scene: 2, start: 21.0, end: 27.8, tr: 'Karekök: alandan kenara', en: 'Square root: from area to side',
      note: 'Bunlar tam kare sayılar; karekökleri birer doğal sayı. Karekök, alandan kenara gider.' },
    { scene: 3, start: 28.8, end: 37.8, tr: '20 bir kare yapmaz', en: '20 does not make a square',
      note: 'Şimdi 20 birimkareyi kareye dizmeye çalışalım. 4’e 4’lük kare 16, 5’e 5’lik kare 25. 20 bu ikisinin arasında.' },
    { scene: 3, start: 38.0, end: 45.8, tr: '4 < √20 < 5', en: '4 < √20 < 5',
      note: 'Karekök 20 bir tam sayı değil: 4 ile 5 arasında bir sayı.' },
    { scene: 4, start: 46.8, end: 54.8, tr: 'Aralığı daralt', en: 'Narrow it down',
      note: 'Ondalıklı sayıların karelerini deneyelim: 4,4’ün karesi 19,36; 4,5’in karesi 20,25. 20 bu ikisinin arasında.' },
    { scene: 4, start: 55.0, end: 63.8, tr: '√20 ≈ 4,47', en: '√20 ≈ 4.47',
      note: 'Karekök 20, 4,4 ile 4,5 arasında; yaklaşık 4,47. 4,47 çarpı 4,47 yaklaşık 19,98: çok yakın.' },
    { scene: 5, start: 64.8, end: 73.8, tr: '√50: 7 ile 8 arasında', en: '√50: between 7 and 8',
      note: '50, 49 ile 64 arasında; öyleyse karekök 50, 7 ile 8 arasında. 7,1’in karesi 50,41: karekök 50 yaklaşık 7,07.' },
    { scene: 5, start: 74.0, end: 79.8, tr: 'Kendi sözlerinle', en: 'In your own words',
      note: 'Karekök a: alanı a olan karenin kenar uzunluğu.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Alandan kenara', en: 'From area to side',
      note: 'Aklında kalsın: karekök, alanı bilinen karenin kenarını verir.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Önce aralık, sonra yaklaş!', en: 'First the interval, then get closer!',
      note: 'Tam kare değilse önce hangi iki doğal sayı arasında olduğunu bul, sonra yaklaş!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
