/*! KEKAL Studio Icon v1.0.0 | editor icon SVG ala Figma, dimuat saat Studio Icon dibuka */
(function () {
  'use strict';
  if (window.KekalStudio && !window.KekalStudio._stub) return;

  const VERSI = '1.0.0';
  const LIBS = [
    ['paper', ['https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.18/paper-core.min.js', 'https://cdn.jsdelivr.net/npm/paper@0.12.18/dist/paper-core.min.js']],
    ['paperjsOffset', ['https://cdn.jsdelivr.net/npm/paperjs-offset@2.2.2/dist/index.umd.min.js', 'https://unpkg.com/paperjs-offset@2.2.2/dist/index.umd.min.js']]
  ];
  const NS = 'http://www.w3.org/2000/svg';

  /* ===================== ATURAN BAWAAN (bisa diubah admin) ===================== */
  const ATURAN_BAWAAN = {
    line:  { ukuran: 24, stroke: 1.5, snap: 0.25, padding: 2, warna: ['#0F172A'] },
    glyph: { ukuran: 24, stroke: 1.5, snap: 0.25, padding: 2, warna: ['#0F172A'] },
    flat:  { ukuran: 64, stroke: 2, snap: 0.5, padding: 4, warna: ['#2563EB', '#60A5FA', '#F59E0B', '#FCD34D', '#10B981', '#F43F5E', '#0F172A', '#FFFFFF'] },
    kunciStroke: true,
    outline: false
  };
  const NAMA_GAYA = { line: 'Line', glyph: 'Glyph', flat: 'Flat' };

  function gabungAturan(a) {
    const out = JSON.parse(JSON.stringify(ATURAN_BAWAAN));
    if (!a || typeof a !== 'object') return out;
    ['line', 'glyph', 'flat'].forEach((g) => {
      const s = a[g];
      if (!s || typeof s !== 'object') return;
      ['ukuran', 'stroke', 'snap', 'padding'].forEach((k) => { const v = Number(s[k]); if (isFinite(v) && v > 0) out[g][k] = v; });
      if (Array.isArray(s.warna) && s.warna.length) out[g].warna = s.warna.filter((w) => /^#[0-9a-f]{6}$/i.test(w)).map((w) => w.toUpperCase());
      if (!out[g].warna.length) out[g].warna = ATURAN_BAWAAN[g].warna.slice();
    });
    if (typeof a.kunciStroke === 'boolean') out.kunciStroke = a.kunciStroke;
    if (typeof a.outline === 'boolean') out.outline = a.outline;
    return out;
  }

  /* ===================== UTILITAS ===================== */
  const r4 = (v) => Math.round(v * 10000) / 10000;
  const r3 = (v) => Math.round(v * 1000) / 1000;
  const fmt = (v) => { const x = r3(v); return Object.is(x, -0) ? '0' : String(x); };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const uid = () => 'o' + Math.random().toString(36).slice(2, 9);
  const salin = (x) => JSON.parse(JSON.stringify(x));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const snapV = (v, step) => (step > 0 ? Math.round(v / step) * step : v);
  const dekat = (a, b, t) => Math.abs(a - b) <= (t == null ? 1e-3 : t);
  const hexOk = (h) => /^#[0-9a-f]{6}$/i.test(h || '');

  function muatScript(urls) {
    return new Promise((ok, gagal) => {
      (function coba(i) {
        if (i >= urls.length) return gagal(new Error('Gagal memuat pustaka gambar. Periksa koneksi internet.'));
        const s = document.createElement('script');
        s.src = urls[i]; s.async = true;
        s.onload = () => ok();
        s.onerror = () => { s.remove(); coba(i + 1); };
        document.head.appendChild(s);
      })(0);
    });
  }
  let siapLib = null;
  function pustakaSiap() {
    if (!siapLib) {
      const ganti = window.KL_STUDIO_LIB || {};
      siapLib = LIBS.reduce((p, [nama, urls]) => p.then(() => (window[nama] ? null : muatScript(ganti[nama] ? [ganti[nama]] : urls))), Promise.resolve())
        .then(() => {
          if (!window.paper) throw new Error('Pustaka Paper.js tidak tersedia.');
          if (!window.paper.project) window.paper.setup(new window.paper.Size(1, 1));
        })
        .catch((e) => { siapLib = null; throw e; });
    }
    return siapLib;
  }

  /** Jalankan operasi Paper.js tanpa memasukkan item ke kanvas Paper (tidak mengganggu Penata Icon). */
  function P(fn) {
    const pp = window.paper;
    const lama = pp.settings.insertItems;
    pp.settings.insertItems = false;
    try { return fn(pp); } finally { pp.settings.insertItems = lama; }
  }

  /* ===================== MODEL OBJEK =====================
     tipe: rect | ellipse | polygon | star  → kotak (x,y,w,h) + rot (derajat)
           path → sub: [{ tutup, segs: [{x,y,hi,ho}] }]  (hi/ho relatif terhadap titik, null = sudut)
     gaya: fill (#hex | null), stroke (#hex | null), sw (tebal garis)
  ========================================================================== */
  function objekBaru(tipe, props, gaya, aturan) {
    const a = aturan[gaya];
    const warna = a.warna[0] || '#0F172A';
    const o = { id: uid(), tipe, nama: '', hidden: false, locked: false, rot: 0, fill: null, stroke: null, sw: a.stroke };
    if (gaya === 'line' || (tipe === 'path' && props && props.terbuka)) { o.stroke = warna; }
    else { o.fill = warna; }
    Object.assign(o, props || {});
    delete o.terbuka;
    if (tipe === 'rect' && o.r == null) o.r = 0;
    if (tipe === 'polygon' && !o.sisi) o.sisi = 3;
    if (tipe === 'star') { if (!o.sisi) o.sisi = 5; if (!o.rasio) o.rasio = 0.45; }
    return o;
  }
  const NAMA_TIPE = { rect: 'Persegi', ellipse: 'Elips', polygon: 'Poligon', star: 'Bintang', path: 'Vektor', line: 'Garis' };
  function namaObjek(o) {
    if (o.nama) return o.nama;
    if (o.tipe === 'path' && o.sub && o.sub.length === 1 && !o.sub[0].tutup && o.sub[0].segs.length === 2 && !o.sub[0].segs.some((s) => s.hi || s.ho)) return 'Garis';
    return NAMA_TIPE[o.tipe] || 'Objek';
  }
  const parametrik = (o) => o.tipe !== 'path';

  /* ===================== GEOMETRI (Paper.js) ===================== */
  function titikPoligon(o, bintang) {
    const cx = o.x + o.w / 2, cy = o.y + o.h / 2, n = Math.max(3, Math.round(o.sisi || (bintang ? 5 : 3)));
    const pts = [];
    const jumlah = bintang ? n * 2 : n;
    for (let i = 0; i < jumlah; i++) {
      const sudut = -Math.PI / 2 + i * (2 * Math.PI / jumlah);
      const k = bintang && i % 2 ? (o.rasio || 0.45) : 1;
      pts.push([cx + Math.cos(sudut) * o.w / 2 * k, cy + Math.sin(sudut) * o.h / 2 * k]);
    }
    return pts;
  }

  function itemDari(o) {
    return P((pp) => {
      let it;
      if (o.tipe === 'rect') {
        const rad = Math.max(0, Math.min(o.r || 0, Math.abs(o.w) / 2, Math.abs(o.h) / 2));
        it = rad > 0 ? new pp.Path.Rectangle({ rectangle: new pp.Rectangle(o.x, o.y, o.w, o.h), radius: rad }) : new pp.Path.Rectangle(new pp.Rectangle(o.x, o.y, o.w, o.h));
      } else if (o.tipe === 'ellipse') {
        it = new pp.Path.Ellipse(new pp.Rectangle(o.x, o.y, o.w, o.h));
      } else if (o.tipe === 'polygon' || o.tipe === 'star') {
        it = new pp.Path({ segments: titikPoligon(o, o.tipe === 'star'), closed: true });
      } else {
        const anak = (o.sub || []).map((s) => new pp.Path({
          segments: s.segs.map((g) => new pp.Segment(new pp.Point(g.x, g.y), g.hi ? new pp.Point(g.hi.x, g.hi.y) : null, g.ho ? new pp.Point(g.ho.x, g.ho.y) : null)),
          closed: !!s.tutup
        }));
        it = anak.length === 1 ? anak[0] : new pp.CompoundPath({ children: anak });
        if (o.fillRule === 'evenodd') it.fillRule = 'evenodd';
      }
      if (o.rot && parametrik(o)) it.rotate(o.rot, new pp.Point(o.x + o.w / 2, o.y + o.h / 2));
      return it;
    });
  }

  function dDari(o) {
    if (o.tipe === 'path') return dSub(o.sub);
    const it = itemDari(o);
    return it.getPathData(null, 4);
  }
  /** d langsung dari sub (lebih cepat, dipakai saat menggambar ulang). */
  function dSub(sub) {
    let d = '';
    (sub || []).forEach((s) => {
      const g = s.segs;
      if (!g.length) return;
      d += `M${fmt(g[0].x)} ${fmt(g[0].y)}`;
      const n = g.length;
      const akhir = s.tutup ? n : n - 1;
      for (let i = 0; i < akhir; i++) {
        const a = g[i], b = g[(i + 1) % n];
        if (a.ho || b.hi) {
          const c1 = a.ho ? [a.x + a.ho.x, a.y + a.ho.y] : [a.x, a.y];
          const c2 = b.hi ? [b.x + b.hi.x, b.y + b.hi.y] : [b.x, b.y];
          d += `C${fmt(c1[0])} ${fmt(c1[1])} ${fmt(c2[0])} ${fmt(c2[1])} ${fmt(b.x)} ${fmt(b.y)}`;
        } else if (!(s.tutup && i === n - 1)) {
          d += `L${fmt(b.x)} ${fmt(b.y)}`;
        }
      }
      if (s.tutup) d += 'Z';
    });
    return d;
  }

  /** Sub (format model) dari item Paper. */
  function subDariItem(it) {
    const paths = it.children ? it.children.filter((c) => c.segments) : [it];
    return paths.filter((p) => p.segments && p.segments.length).map((p) => ({
      tutup: !!p.closed,
      segs: p.segments.map((s) => ({
        x: r4(s.point.x), y: r4(s.point.y),
        hi: s.handleIn.isZero() ? null : { x: r4(s.handleIn.x), y: r4(s.handleIn.y) },
        ho: s.handleOut.isZero() ? null : { x: r4(s.handleOut.x), y: r4(s.handleOut.y) }
      }))
    }));
  }

  /** Ubah objek parametrik menjadi path (vektor), tampilan tetap sama. */
  function keVektor(o) {
    if (o.tipe === 'path') return o;
    const it = itemDari(o);
    const baru = Object.assign({}, o, { tipe: 'path', sub: subDariItem(it) });
    ['x', 'y', 'w', 'h', 'r', 'sisi', 'rasio'].forEach((k) => delete baru[k]);
    baru.rot = 0;
    return baru;
  }

  /** Batas geometri (tanpa tebal garis) dalam koordinat dokumen. */
  function batas(o) {
    if (o.tipe === 'path') {
      const it = itemDari(o);
      const b = it.bounds;
      return { x: b.x, y: b.y, w: b.width, h: b.height };
    }
    if (!o.rot) return { x: Math.min(o.x, o.x + o.w), y: Math.min(o.y, o.y + o.h), w: Math.abs(o.w), h: Math.abs(o.h) };
    const b = itemDari(o).bounds;
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  }
  function batasGaris(o) {
    const b = batas(o);
    const t = o.stroke && o.sw > 0 ? o.sw / 2 : 0;
    return { x: b.x - t, y: b.y - t, w: b.w + 2 * t, h: b.h + 2 * t };
  }
  function batasGabung(list) {
    if (!list.length) return null;
    let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
    list.forEach((o) => { const b = batas(o); x1 = Math.min(x1, b.x); y1 = Math.min(y1, b.y); x2 = Math.max(x2, b.x + b.w); y2 = Math.max(y2, b.y + b.h); });
    return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
  }

  /* ===================== TRANSFORMASI ===================== */
  function geser(o, dx, dy) {
    if (o.tipe === 'path') o.sub.forEach((s) => s.segs.forEach((g) => { g.x = r4(g.x + dx); g.y = r4(g.y + dy); }));
    else { o.x = r4(o.x + dx); o.y = r4(o.y + dy); }
  }
  /** Skala terhadap titik (ox, oy). Objek parametrik berputar diperlakukan lewat pusatnya. */
  function skala(o, ox, oy, sx, sy) {
    if (o.tipe === 'path') {
      o.sub.forEach((s) => s.segs.forEach((g) => {
        g.x = r4(ox + (g.x - ox) * sx); g.y = r4(oy + (g.y - oy) * sy);
        if (g.hi) { g.hi.x = r4(g.hi.x * sx); g.hi.y = r4(g.hi.y * sy); }
        if (g.ho) { g.ho.x = r4(g.ho.x * sx); g.ho.y = r4(g.ho.y * sy); }
      }));
      return;
    }
    if (o.rot) {
      const cx = o.x + o.w / 2, cy = o.y + o.h / 2;
      const ncx = ox + (cx - ox) * sx, ncy = oy + (cy - oy) * sy;
      o.w = r4(Math.abs(o.w * sx)); o.h = r4(Math.abs(o.h * sy));
      o.x = r4(ncx - o.w / 2); o.y = r4(ncy - o.h / 2);
      return;
    }
    let x1 = ox + (o.x - ox) * sx, x2 = ox + (o.x + o.w - ox) * sx;
    let y1 = oy + (o.y - oy) * sy, y2 = oy + (o.y + o.h - oy) * sy;
    o.x = r4(Math.min(x1, x2)); o.w = r4(Math.abs(x2 - x1));
    o.y = r4(Math.min(y1, y2)); o.h = r4(Math.abs(y2 - y1));
  }
  function putarTitik(x, y, cx, cy, rad) {
    const c = Math.cos(rad), s = Math.sin(rad);
    return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
  }
  function putar(o, deg, cx, cy) {
    const rad = deg * Math.PI / 180;
    if (o.tipe === 'path') {
      o.sub.forEach((s) => s.segs.forEach((g) => {
        const p = putarTitik(g.x, g.y, cx, cy, rad); g.x = r4(p[0]); g.y = r4(p[1]);
        if (g.hi) { const h = putarTitik(g.hi.x, g.hi.y, 0, 0, rad); g.hi = { x: r4(h[0]), y: r4(h[1]) }; }
        if (g.ho) { const h = putarTitik(g.ho.x, g.ho.y, 0, 0, rad); g.ho = { x: r4(h[0]), y: r4(h[1]) }; }
      }));
      return;
    }
    const ocx = o.x + o.w / 2, ocy = o.y + o.h / 2;
    const p = putarTitik(ocx, ocy, cx, cy, rad);
    o.x = r4(p[0] - o.w / 2); o.y = r4(p[1] - o.h / 2);
    let r = ((o.rot || 0) + deg) % 360;
    if (r > 180) r -= 360; if (r <= -180) r += 360;
    o.rot = r4(r);
  }
  /** Cermin horizontal (h) atau vertikal (v) terhadap garis pusat (c). */
  function cermin(o, arah, c) {
    if (o.tipe !== 'path' && (o.tipe === 'rect' || o.tipe === 'ellipse')) {
      if (arah === 'h') o.x = r4(2 * c - (o.x + o.w)); else o.y = r4(2 * c - (o.y + o.h));
      o.rot = r4(-(o.rot || 0));
      return o;
    }
    const v = o.tipe === 'path' ? o : keVektor(o);
    v.sub.forEach((s) => s.segs.forEach((g) => {
      if (arah === 'h') { g.x = r4(2 * c - g.x); if (g.hi) g.hi.x = -g.hi.x; if (g.ho) g.ho.x = -g.ho.x; }
      else { g.y = r4(2 * c - g.y); if (g.hi) g.hi.y = -g.hi.y; if (g.ho) g.ho.y = -g.ho.y; }
    }));
    return v;
  }

  /* ===================== OPERASI BOOLEAN & OUTLINE ===================== */
  function boolean(objs, op) {
    const items = objs.map((o) => itemDari(o));
    let hasil = items[0];
    for (let i = 1; i < items.length; i++) {
      hasil = P(() => (op === 'gabung' ? hasil.unite(items[i]) : op === 'kurangi' ? hasil.subtract(items[i]) : op === 'potong' ? hasil.intersect(items[i]) : hasil.exclude(items[i])));
    }
    const dasar = objs[0];
    return {
      id: uid(), tipe: 'path', nama: '', hidden: false, locked: false, rot: 0,
      fill: dasar.fill || dasar.stroke || '#0F172A', stroke: null, sw: dasar.sw,
      sub: subDariItem(hasil), fillRule: 'nonzero'
    };
  }
  /** Garis → bentuk berisi (seperti Outline Stroke di Figma). Isi (fill) dipertahankan sebagai objek terpisah. */
  function outlineGaris(o) {
    if (!o.stroke || !(o.sw > 0)) return [o];
    const PO = window.paperjsOffset;
    if (!PO || !PO.offsetStroke) throw new Error('Pustaka konversi garis belum termuat.');
    const it = itemDari(o);
    const cincin = P(() => PO.offsetStroke(it, o.sw / 2, { join: 'round', cap: 'round', insert: false }));
    const bentuk = { id: uid(), tipe: 'path', nama: o.nama ? o.nama + ' (garis)' : '', hidden: o.hidden, locked: false, rot: 0, fill: o.stroke, stroke: null, sw: o.sw, sub: subDariItem(cincin), fillRule: 'nonzero' };
    if (o.fill) {
      const isi = keVektor(salin(o)); isi.id = uid(); isi.stroke = null;
      return [isi, bentuk];
    }
    return [bentuk];
  }

  /* ===================== EKSPOR SVG ===================== */
  function eksporSvg(dok, aturan, opsi) {
    opsi = opsi || {};
    const S = dok.ukuran;
    const bagian = [];
    dok.objek.forEach((o) => {
      if (o.hidden) return;
      const keOutline = (opsi.outline != null ? opsi.outline : aturan.outline) && o.stroke && o.sw > 0 && window.paperjsOffset;
      const list = keOutline ? outlineGaris(o) : [o];
      list.forEach((x) => {
        const d = x.tipe === 'path' ? dSub(x.sub) : itemDari(x).getPathData(null, 3);
        if (!d) return;
        let a = `<path d="${d}"`;
        a += x.fill ? ` fill="${x.fill}"` : ' fill="none"';
        if (x.fillRule === 'evenodd') a += ' fill-rule="evenodd" clip-rule="evenodd"';
        if (x.stroke && x.sw > 0) a += ` stroke="${x.stroke}" stroke-width="${fmt(x.sw)}" stroke-linecap="round" stroke-linejoin="round"`;
        bagian.push(a + '/>');
      });
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none">\n${bagian.join('\n')}\n</svg>\n`;
  }

  /** Impor SVG (teks) → daftar objek path, dipaskan ke area aman artboard. */
  function imporSvg(teks, gaya, aturan) {
    const a = aturan[gaya];
    const S = a.ukuran, pad = a.padding;
    const objek = [];
    P((pp) => {
      const root = pp.project.importSVG(teks, { insert: false, expandShapes: true, applyMatrix: true });
      if (!root) throw new Error('File SVG tidak bisa dibaca.');
      const daun = [];
      (function jelajah(it) {
        if (!it || it.visible === false) return;
        if ((it.className === 'Path' || it.className === 'CompoundPath')) { daun.push(it); return; }
        if (it.children) it.children.slice().forEach(jelajah);
      })(root);
      const datar = daun.map((it) => {
        const k = it.clone({ insert: false });
        k.transform(it.parent ? it.parent.globalMatrix : new pp.Matrix());
        const warna = (c) => (c && c.alpha > 0 ? c.toCSS(true).toUpperCase() : null);
        const skalaGaris = Math.sqrt(Math.abs((it.parent ? it.parent.globalMatrix : new pp.Matrix()).determinant || 1)) || 1;
        return { k, fill: warna(it.fillColor), stroke: it.strokeWidth > 0 ? warna(it.strokeColor) : null, sw: (it.strokeWidth || 0) * skalaGaris, rule: it.fillRule };
      }).filter((x) => x.fill || x.stroke);
      if (!datar.length) throw new Error('Tidak ada bentuk yang bisa diimpor dari file ini.');
      let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
      datar.forEach((x) => { const b = x.k.bounds; const t = x.stroke ? x.sw / 2 : 0; x1 = Math.min(x1, b.x - t); y1 = Math.min(y1, b.y - t); x2 = Math.max(x2, b.right + t); y2 = Math.max(y2, b.bottom + t); });
      const ruang = S - 2 * pad;
      const k = Math.min(ruang / Math.max(1e-6, x2 - x1), ruang / Math.max(1e-6, y2 - y1));
      const ox = pad + (ruang - (x2 - x1) * k) / 2 - x1 * k, oy = pad + (ruang - (y2 - y1) * k) / 2 - y1 * k;
      datar.forEach((x) => {
        x.k.transform(new pp.Matrix(k, 0, 0, k, ox, oy));
        objek.push({ id: uid(), tipe: 'path', nama: '', hidden: false, locked: false, rot: 0, fill: x.fill, stroke: x.stroke, sw: r4(x.sw * k), sub: subDariItem(x.k), fillRule: x.rule === 'evenodd' ? 'evenodd' : 'nonzero' });
      });
    });
    return objek;
  }

  /* ===================== PEMERIKSA KUALITAS =====================
     level 'error' = wajib diperbaiki sebelum disimpan; 'warn' = peringatan.
     perbaiki() (jika ada) = perbaikan otomatis satu klik.
  ================================================================ */
  function titikBermasalah(sub) {
    const masalah = { dobel: 0, duri: 0 };
    sub.forEach((s) => {
      const g = s.segs, n = g.length;
      for (let i = 0; i < n; i++) {
        if (!s.tutup && i === n - 1) break;
        const a = g[i], b = g[(i + 1) % n];
        if (dekat(a.x, b.x, 1e-3) && dekat(a.y, b.y, 1e-3) && !a.ho && !b.hi && n > 1) masalah.dobel++;
      }
      for (let i = 0; i < n; i++) {
        if (!s.tutup && (i === 0 || i === n - 1)) continue;
        const a = g[(i - 1 + n) % n], b = g[i], c = g[(i + 1) % n];
        if (a.ho || b.hi || b.ho || c.hi) continue;
        const v1x = b.x - a.x, v1y = b.y - a.y, v2x = c.x - b.x, v2y = c.y - b.y;
        const l1 = Math.hypot(v1x, v1y), l2 = Math.hypot(v2x, v2y);
        if (l1 < 1e-3 || l2 < 1e-3) continue;
        if ((v1x * v2x + v1y * v2y) / (l1 * l2) < -0.9995) masalah.duri++;
      }
    });
    return masalah;
  }
  function bersihkanTitik(o) {
    o.sub.forEach((s) => {
      let ubah = true, putaran = 0;
      while (ubah && putaran++ < 50) {
        ubah = false;
        const g = s.segs, n = g.length;
        for (let i = 0; i < n && n > 2; i++) {
          const a = g[i], b = g[(i + 1) % n];
          if ((!s.tutup && i === n - 1)) break;
          if (dekat(a.x, b.x, 1e-3) && dekat(a.y, b.y, 1e-3) && !a.ho && !b.hi) { a.ho = b.ho; g.splice((i + 1) % n, 1); ubah = true; break; }
        }
        if (ubah) continue;
        for (let i = 0; i < g.length && g.length > 2; i++) {
          const n2 = g.length;
          if (!s.tutup && (i === 0 || i === n2 - 1)) continue;
          const a = g[(i - 1 + n2) % n2], b = g[i], c = g[(i + 1) % n2];
          if (a.ho || b.hi || b.ho || c.hi) continue;
          const v1x = b.x - a.x, v1y = b.y - a.y, v2x = c.x - b.x, v2y = c.y - b.y;
          const l1 = Math.hypot(v1x, v1y), l2 = Math.hypot(v2x, v2y);
          if (l1 < 1e-3 || l2 < 1e-3) continue;
          if ((v1x * v2x + v1y * v2y) / (l1 * l2) < -0.9995) { g.splice(i, 1); ubah = true; break; }
        }
      }
    });
    o.sub = o.sub.filter((s) => s.segs.length >= 2);
  }
  function diGrid(v, step) { return step > 0 ? Math.abs(v / step - Math.round(v / step)) < 1e-3 : true; }
  function jumlahTitik(o) { return o.tipe === 'path' ? o.sub.reduce((t, s) => t + s.segs.length, 0) : 4; }

  function periksa(dok, aturan, ctx) {
    const a = aturan[dok.gaya];
    const S = dok.ukuran, pad = a.padding, step = a.snap;
    const hasil = [];
    const tambah = (level, kode, teks, ids, perbaiki) => hasil.push({ level, kode, teks, ids: ids || [], perbaiki: perbaiki || null });
    const tampil = dok.objek.filter((o) => !o.hidden);

    const nama = String((ctx && ctx.namaFile) || '').trim();
    if (ctx && !nama) tambah('error', 'nama', 'Nama file icon belum diisi.');
    if (ctx && nama && ctx.namaKembar) tambah('error', 'nama-kembar', 'Nama file sama dengan icon lain di proyek ini. Ganti agar tidak dianggap duplikat.');
    if (!tampil.length) tambah('error', 'kosong', 'Artboard masih kosong. Gambar minimal satu bentuk.');

    const warnaDipakai = new Set();
    tampil.forEach((o) => {
      const nm = namaObjek(o);
      const bg = batasGaris(o), b = batas(o);
      if (o.fill) warnaDipakai.add(o.fill.toUpperCase());
      if (o.stroke && o.sw > 0) warnaDipakai.add(o.stroke.toUpperCase());

      if (!o.fill && !(o.stroke && o.sw > 0)) tambah('error', 'tak-terlihat', `"${nm}" tidak punya isi maupun garis (tidak terlihat).`, [o.id], (d) => { d.objek = d.objek.filter((x) => x.id !== o.id); });
      if (bg.x < -1e-3 || bg.y < -1e-3 || bg.x + bg.w > S + 1e-3 || bg.y + bg.h > S + 1e-3) {
        tambah('error', 'keluar', `"${nm}" keluar dari batas artboard ${S}×${S}.`, [o.id]);
      } else if (bg.x < pad - 1e-3 || bg.y < pad - 1e-3 || bg.x + bg.w > S - pad + 1e-3 || bg.y + bg.h > S - pad + 1e-3) {
        tambah('warn', 'padding', `"${nm}" melewati area aman (jarak tepi ${pad}px).`, [o.id]);
      }
      if (b.w < step && b.h < step) tambah('warn', 'kecil', `"${nm}" terlalu kecil (hampir tidak terlihat).`, [o.id], (d) => { d.objek = d.objek.filter((x) => x.id !== o.id); });

      if (o.stroke && o.sw > 0) {
        if (dok.gaya === 'line' && aturan.kunciStroke && !dekat(o.sw, a.stroke, 1e-3)) {
          tambah('error', 'stroke', `Tebal garis "${nm}" ${fmt(o.sw)}px, aturan gaya Line ${fmt(a.stroke)}px.`, [o.id], (d) => { const x = d.objek.find((y) => y.id === o.id); if (x) x.sw = a.stroke; });
        }
        if (dok.gaya === 'glyph') tambah('warn', 'glyph-garis', `"${nm}" memakai garis. Gaya Glyph sebaiknya bentuk berisi.`, [o.id], (d) => {
          const i = d.objek.findIndex((y) => y.id === o.id); if (i >= 0) d.objek.splice(i, 1, ...outlineGaris(d.objek[i]));
        });
      }
      if (dok.gaya === 'line' && o.fill && o.tipe === 'path' && jumlahTitik(o) > 8) tambah('warn', 'line-isi', `"${nm}" berisi warna penuh. Gaya Line umumnya hanya garis.`, [o.id]);

      if (o.tipe === 'path') {
        const m = titikBermasalah(o.sub);
        if (m.dobel || m.duri) tambah('error', 'titik', `"${nm}" punya ${m.dobel + m.duri} titik rusak (titik dobel / duri).`, [o.id], (d) => { const x = d.objek.find((y) => y.id === o.id); if (x) bersihkanTitik(x); });
        if (o.fill && o.sub.some((s) => !s.tutup && s.segs.length > 2) && !o.stroke) tambah('warn', 'terbuka', `"${nm}" berupa lintasan terbuka tetapi diberi isi.`, [o.id], (d) => { const x = d.objek.find((y) => y.id === o.id); if (x) x.sub.forEach((s) => { s.tutup = true; }); });
        if (jumlahTitik(o) > 300) tambah('warn', 'titik-banyak', `"${nm}" punya ${jumlahTitik(o)} titik. Sederhanakan agar file ringan.`, [o.id]);
      }

      let luarGrid = false;
      if (o.tipe === 'path') luarGrid = o.sub.some((s) => s.segs.some((g) => !diGrid(g.x, step) || !diGrid(g.y, step)));
      else if (!o.rot) luarGrid = ![o.x, o.y, o.w, o.h].every((v) => diGrid(v, step));
      if (luarGrid) tambah('warn', 'grid', `"${nm}" tidak pas di grid ${fmt(step)}px (bisa buram di ukuran kecil).`, [o.id], (d) => {
        const x = d.objek.find((y) => y.id === o.id); if (!x) return;
        if (x.tipe === 'path') x.sub.forEach((s) => s.segs.forEach((g) => { g.x = r4(snapV(g.x, step)); g.y = r4(snapV(g.y, step)); }));
        else ['x', 'y', 'w', 'h'].forEach((k) => { x[k] = r4(snapV(x[k], step)); });
      });
    });

    const palet = new Set(a.warna.map((w) => w.toUpperCase()));
    const luarPalet = [...warnaDipakai].filter((w) => !palet.has(w));
    if (luarPalet.length) tambah('warn', 'palet', `Warna di luar palet ${NAMA_GAYA[dok.gaya]}: ${luarPalet.join(', ')}.`, tampil.filter((o) => luarPalet.includes((o.fill || '').toUpperCase()) || luarPalet.includes((o.stroke || '').toUpperCase())).map((o) => o.id));
    if (dok.gaya !== 'flat' && warnaDipakai.size > 1) tambah('warn', 'warna', `Gaya ${NAMA_GAYA[dok.gaya]} sebaiknya satu warna (terpakai ${warnaDipakai.size}).`);
    const tersembunyi = dok.objek.filter((o) => o.hidden).length;
    if (tersembunyi) tambah('info', 'tersembunyi', `${tersembunyi} layer tersembunyi tidak ikut disimpan ke SVG.`);
    return hasil;
  }

  /* ===================== IKON ANTARMUKA ===================== */
  const IK = (d, extra) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ${extra || ''}>${d}</svg>`;
  const IKON = {
    pilih: IK('<path d="M6 3.5l12 7.2-5.4 1.3-2.6 5.5z" fill="currentColor" stroke-width="1.2"/>'),
    tangan: IK('<path d="M8.5 12.5V6a1.5 1.5 0 013 0v5M11.5 5a1.5 1.5 0 013 0v6M14.5 6.5a1.5 1.5 0 013 0V13c0 4.2-2.6 7-6.4 7-2.9 0-4.4-1.4-5.9-3.9l-1.6-2.8a1.4 1.4 0 012.3-1.6l2.1 2.3"/>'),
    rect: IK('<rect x="4.5" y="4.5" width="15" height="15" rx="1.5"/>'),
    ellipse: IK('<circle cx="12" cy="12" r="7.5"/>'),
    line: IK('<path d="M5 19L19 5"/>'),
    polygon: IK('<path d="M12 4.5l8 14.5H4z"/>'),
    star: IK('<path d="M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z"/>'),
    pena: IK('<path d="M12 21l-6.5-6.5L8 7.5 12 3l4 4.5 2.5 7z"/><circle cx="12" cy="13" r="1.6"/><path d="M12 3v8.4"/>'),
    gabung: IK('<path d="M4 4h10v6h6v10H10v-6H4z" fill="currentColor" fill-opacity=".25"/>'),
    kurangi: IK('<path d="M4 4h10v6h-4v4H4z" fill="currentColor" fill-opacity=".25"/><rect x="10" y="10" width="10" height="10" stroke-dasharray="2 2"/>'),
    potong: IK('<rect x="4" y="4" width="10" height="10"/><rect x="10" y="10" width="10" height="10"/><rect x="10" y="10" width="4" height="4" fill="currentColor"/>'),
    sisakan: IK('<path d="M4 4h10v6h-4v4H4zM14 10h6v10H10v-6h4z" fill="currentColor" fill-opacity=".25"/>'),
    undo: IK('<path d="M9 7L5 11l4 4"/><path d="M5 11h9a5 5 0 010 10h-2"/>'),
    redo: IK('<path d="M15 7l4 4-4 4"/><path d="M19 11h-9a5 5 0 000 10h2"/>'),
    grid: IK('<path d="M4 9h16M4 15h16M9 4v16M15 4v16"/><rect x="4" y="4" width="16" height="16" rx="1"/>'),
    keyline: IK('<rect x="4" y="4" width="16" height="16" rx="1"/><circle cx="12" cy="12" r="6"/><path d="M4 4l16 16M20 4L4 20" stroke-opacity=".5"/>'),
    magnet: IK('<path d="M6 4v7a6 6 0 0012 0V4h-4v7a2 2 0 01-4 0V4z"/><path d="M6 8h4M14 8h4"/>'),
    mata: IK('<path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="2.5"/>'),
    mataTutup: IK('<path d="M3 3l18 18M10.6 6.1A9.8 9.8 0 0112 6c6 0 9.5 6 9.5 6a16 16 0 01-2.6 3.2M6.2 7.6C3.9 9.2 2.5 12 2.5 12s3.5 6 9.5 6c1.5 0 2.8-.4 4-1"/>'),
    kunci: IK('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>'),
    buka: IK('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 017.7-1.5"/>'),
    tambah: IK('<path d="M12 5v14M5 12h14"/>'),
    hapus: IK('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3"/>'),
    cerminH: IK('<path d="M12 3v18" stroke-dasharray="2 2"/><path d="M9 6L3 18h6zM15 6l6 12h-6z"/>'),
    cerminV: IK('<path d="M3 12h18" stroke-dasharray="2 2"/><path d="M6 9L18 3v6zM6 15l12 6v-6z"/>'),
    putar: IK('<path d="M20 11a8 8 0 10-2.3 5.7"/><path d="M20 5v6h-6"/>'),
    rataKiri: IK('<path d="M4 3v18"/><rect x="7" y="6" width="12" height="4" rx="1"/><rect x="7" y="14" width="7" height="4" rx="1"/>'),
    rataTengahH: IK('<path d="M12 3v18"/><rect x="5" y="6" width="14" height="4" rx="1"/><rect x="8" y="14" width="8" height="4" rx="1"/>'),
    rataKanan: IK('<path d="M20 3v18"/><rect x="5" y="6" width="12" height="4" rx="1"/><rect x="10" y="14" width="7" height="4" rx="1"/>'),
    rataAtas: IK('<path d="M3 4h18"/><rect x="6" y="7" width="4" height="12" rx="1"/><rect x="14" y="7" width="4" height="7" rx="1"/>'),
    rataTengahV: IK('<path d="M3 12h18"/><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="8" width="4" height="8" rx="1"/>'),
    rataBawah: IK('<path d="M3 20h18"/><rect x="6" y="5" width="4" height="12" rx="1"/><rect x="14" y="10" width="4" height="7" rx="1"/>'),
    sebarH: IK('<path d="M4 3v18M20 3v18"/><rect x="9.5" y="7" width="5" height="10" rx="1"/>'),
    sebarV: IK('<path d="M3 4h18M3 20h18"/><rect x="7" y="9.5" width="10" height="5" rx="1"/>'),
    tutup: IK('<path d="M6 6l12 12M18 6L6 18"/>'),
    bawah: IK('<path d="M7 10l5 5 5-5"/>'),
    impor: IK('<path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4"/>'),
    unduh: IK('<path d="M12 4v11M8 11l4 4 4-4"/><path d="M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4"/>'),
    awan: IK('<path d="M7 18a4.5 4.5 0 01-.6-9A6 6 0 0118 9.5a4 4 0 01-.5 8.5H7z"/><path d="M12 15v-5M9.5 12.5L12 10l2.5 2.5"/>'),
    cek: IK('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    awas: IK('<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.01"/>'),
    info: IK('<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.01"/>'),
    vektor: IK('<path d="M5 19C8 9 16 15 19 5"/><rect x="3" y="17" width="4" height="4" rx=".5"/><rect x="17" y="3" width="4" height="4" rx=".5"/>'),
    outline: IK('<path d="M5 19L19 5" stroke-width="5" stroke-opacity=".25"/><path d="M4 16.5L16.5 4 20 7.5 7.5 20z"/>'),
    sudut: IK('<path d="M5 19V11a6 6 0 016-6h8"/>'),
    duplikat: IK('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>'),
    papan: IK('<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/>'),
    keyboard: IK('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10"/>')
  };

  /* ===================== CSS ===================== */
  const CSS = `
  .ks-root{--ks-bg:#fff;--ks-line:#e6e6e6;--ks-text:#1e1e1e;--ks-mute:#7a7a7a;--ks-acc:#0d99ff;--ks-acc-soft:#e5f4ff;--ks-can:#f2f2f2;--ks-red:#f24822;--ks-hover:#f5f5f5;
    position:fixed;inset:0;z-index:10050;display:grid;grid-template-columns:240px minmax(0,1fr) 260px;background:var(--ks-can);color:var(--ks-text);
    font:11px/1.45 Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased;user-select:none}
  .ks-root *{box-sizing:border-box}
  .ks-root button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0}
  .ks-root input,.ks-root select{font:inherit;color:inherit}
  .ks-panel{background:var(--ks-bg);display:flex;flex-direction:column;min-height:0;overflow:hidden}
  .ks-left{border-right:1px solid var(--ks-line)} .ks-right{border-left:1px solid var(--ks-line)}
  .ks-head{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--ks-line);min-height:48px}
  .ks-logo{width:26px;height:26px;border-radius:7px;background:linear-gradient(135deg,#0d99ff,#7b61ff);display:grid;place-items:center;color:#fff;flex:none}
  .ks-logo svg{width:16px;height:16px}
  .ks-title{font-weight:600;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ks-sub{color:var(--ks-mute);font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ks-chip{display:inline-flex;align-items:center;gap:4px;padding:1px 6px;border-radius:999px;background:#f0f0f0;font-size:10px;font-weight:600;color:#555}
  .ks-chip.acc{background:var(--ks-acc-soft);color:#0a6dc2} .ks-chip.ok{background:#e3f7ea;color:#14833b} .ks-chip.warn{background:#fff3d6;color:#9a6300} .ks-chip.err{background:#ffe5e0;color:#c62d0f}
  .ks-iconbtn{width:28px;height:28px;border-radius:6px;display:grid;place-items:center;color:#444}
  .ks-iconbtn:hover{background:var(--ks-hover)} .ks-iconbtn.on{background:var(--ks-acc-soft);color:var(--ks-acc)}
  .ks-iconbtn:disabled{opacity:.35;cursor:default;background:none}
  .ks-sec{border-bottom:1px solid var(--ks-line);padding:10px 12px}
  .ks-sec-h{display:flex;align-items:center;justify-content:space-between;font-weight:600;font-size:11px;margin-bottom:6px;min-height:22px}
  .ks-scroll{overflow:auto;min-height:0}
  .ks-icons{max-height:38vh;overflow:auto;margin:0 -6px}
  .ks-icon-it{display:flex;align-items:center;gap:8px;padding:5px 6px;border-radius:6px;cursor:pointer}
  .ks-icon-it:hover{background:var(--ks-hover)} .ks-icon-it.on{background:var(--ks-acc-soft)}
  .ks-thumb{width:30px;height:30px;border-radius:5px;background:#fff;border:1px solid var(--ks-line);display:grid;place-items:center;flex:none;overflow:hidden}
  .ks-thumb img{width:24px;height:24px}
  .ks-icon-nm{flex:1;min-width:0}
  .ks-dot{width:7px;height:7px;border-radius:50%;background:#f5a524;flex:none}
  .ks-layers{flex:1;margin:0 -6px}
  .ks-layer{display:flex;align-items:center;gap:6px;height:30px;padding:0 6px 0 8px;border-radius:6px;cursor:default}
  .ks-layer:hover{background:var(--ks-hover)} .ks-layer.on{background:var(--ks-acc-soft)}
  .ks-layer.drop-up{box-shadow:inset 0 2px 0 var(--ks-acc)} .ks-layer.drop-down{box-shadow:inset 0 -2px 0 var(--ks-acc)}
  .ks-layer .ks-ly-ic{color:#888;display:grid;place-items:center} .ks-layer .ks-ly-ic svg{width:14px;height:14px}
  .ks-layer .ks-ly-nm{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ks-layer .ks-ly-act{opacity:0;display:flex;gap:2px} .ks-layer:hover .ks-ly-act,.ks-layer .ks-ly-act.tetap{opacity:1}
  .ks-layer .ks-ly-act button{width:22px;height:22px;border-radius:4px;display:grid;place-items:center;color:#777}
  .ks-layer .ks-ly-act button:hover{background:#e9e9e9} .ks-layer .ks-ly-act svg{width:14px;height:14px}
  .ks-layer.mati .ks-ly-nm{color:#aaa}
  .ks-layer input{width:100%;border:1px solid var(--ks-acc);border-radius:3px;padding:1px 4px;outline:none}
  .ks-empty{color:var(--ks-mute);padding:6px;text-align:center}
  .ks-stage{position:relative;min-width:0;min-height:0;overflow:hidden}
  .ks-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  .ks-toolbar{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);display:flex;align-items:center;gap:2px;padding:4px;background:#fff;border-radius:12px;
    box-shadow:0 0 0 1px rgba(0,0,0,.06),0 6px 20px -6px rgba(0,0,0,.22);z-index:3}
  .ks-tool{height:32px;min-width:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;gap:1px;color:#333;position:relative}
  .ks-tool:hover{background:var(--ks-hover)} .ks-tool.on{background:var(--ks-acc);color:#fff}
  .ks-tool .ks-caret{width:12px;display:grid;place-items:center} .ks-tool .ks-caret svg{width:12px;height:12px}
  .ks-tool:disabled{opacity:.35;cursor:default}
  .ks-sep{width:1px;height:20px;background:var(--ks-line);margin:0 4px}
  .ks-menu{position:absolute;min-width:200px;background:#1e1e1e;color:#fff;border-radius:8px;padding:6px;box-shadow:0 10px 30px -8px rgba(0,0,0,.45);z-index:20}
  .ks-menu button{display:flex;align-items:center;gap:10px;width:100%;padding:6px 8px;border-radius:5px;color:#fff;text-align:left}
  .ks-menu button:hover{background:var(--ks-acc)} .ks-menu button:disabled{opacity:.4;background:none}
  .ks-menu .ks-kbd{margin-left:auto;color:#aaa;font-size:10.5px}
  .ks-menu svg{width:16px;height:16px}
  .ks-tip{position:absolute;pointer-events:none;background:#1e1e1e;color:#fff;font-size:10.5px;padding:4px 7px;border-radius:5px;white-space:nowrap;z-index:30}
  .ks-tip b{color:#aaa;font-weight:500;margin-left:6px}
  .ks-zoombox{display:flex;align-items:center;gap:2px;margin-left:auto}
  .ks-zoom{min-width:54px;height:28px;border-radius:6px;padding:0 6px;font-weight:500}
  .ks-zoom:hover{background:var(--ks-hover)}
  .ks-btn{height:30px;padding:0 12px;border-radius:7px;font-weight:600;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
  .ks-btn svg{width:16px;height:16px}
  .ks-btn.pri{background:var(--ks-acc);color:#fff} .ks-btn.pri:hover{background:#0b87e0}
  .ks-btn.sek{background:#f0f0f0} .ks-btn.sek:hover{background:#e6e6e6}
  .ks-btn.bhy{background:#ffe5e0;color:#c62d0f}
  .ks-btn:disabled{opacity:.5;cursor:default}
  .ks-tabs{display:flex;gap:2px;padding:6px 8px;border-bottom:1px solid var(--ks-line)}
  .ks-tab{padding:5px 8px;border-radius:6px;font-weight:600;color:var(--ks-mute)}
  .ks-tab:hover{color:var(--ks-text)} .ks-tab.on{color:var(--ks-text);background:#f0f0f0}
  .ks-tab .ks-chip{margin-left:4px}
  .ks-row{display:flex;gap:6px;align-items:center}
  .ks-row+.ks-row{margin-top:6px}
  .ks-field{flex:1;min-width:0;display:flex;align-items:center;height:28px;border-radius:5px;border:1px solid transparent;background:#f5f5f5}
  .ks-field:hover{border-color:#e0e0e0} .ks-field:focus-within{border-color:var(--ks-acc);background:#fff}
  .ks-field .ks-lbl{width:24px;flex:none;text-align:center;color:var(--ks-mute);cursor:ew-resize;display:grid;place-items:center;height:100%}
  .ks-field .ks-lbl svg{width:13px;height:13px}
  .ks-field input{flex:1;min-width:0;border:0;background:transparent;outline:none;height:100%;padding:0 6px 0 0}
  .ks-field input[type=text].ks-full{padding-left:8px}
  .ks-field.kunci{background:#fafafa;color:#888}
  .ks-alignbar{display:flex;justify-content:space-between;margin:-2px -4px 0}
  .ks-swatch{width:18px;height:18px;border-radius:4px;border:1px solid rgba(0,0,0,.12);flex:none;position:relative;overflow:hidden;cursor:pointer;margin-left:5px}
  .ks-swatch input{position:absolute;inset:-6px;width:40px;height:40px;opacity:0;cursor:pointer}
  .ks-palet{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}
  .ks-palet button{width:18px;height:18px;border-radius:4px;border:1px solid rgba(0,0,0,.14)}
  .ks-palet button.on{box-shadow:0 0 0 2px #fff,0 0 0 3.5px var(--ks-acc)}
  .ks-note{color:var(--ks-mute);font-size:10.5px;line-height:1.5}
  .ks-rule{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px dashed #eee}
  .ks-rule:last-child{border:0} .ks-rule b{font-weight:600}
  .ks-prev{display:grid;grid-template-columns:1fr;gap:6px}
  .ks-prev>div{border-radius:8px;padding:10px 8px;display:flex;align-items:flex-end;justify-content:space-around;min-height:70px;border:1px solid var(--ks-line)}
  .ks-prev .gelap{background:#1e1e1e;border-color:#1e1e1e}
  .ks-prev figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:4px;color:var(--ks-mute);font-size:9.5px}
  .ks-prev .gelap figure{color:#999}
  .ks-prev .gelap.balik img{filter:invert(1) hue-rotate(180deg)}
  .ks-issue{display:flex;gap:8px;padding:8px;border-radius:7px;align-items:flex-start;cursor:pointer}
  .ks-issue:hover{background:var(--ks-hover)}
  .ks-issue .ks-ic{flex:none;margin-top:1px} .ks-issue .ks-ic svg{width:15px;height:15px}
  .ks-issue.error .ks-ic{color:#e5341b} .ks-issue.warn .ks-ic{color:#d88a00} .ks-issue.info .ks-ic{color:#7a7a7a}
  .ks-issue .ks-fix{margin-top:4px;color:var(--ks-acc);font-weight:600}
  .ks-ok{display:flex;flex-direction:column;align-items:center;gap:6px;padding:24px 8px;color:#14833b;text-align:center}
  .ks-ok svg{width:30px;height:30px}
  .ks-toast{position:absolute;left:50%;top:14px;transform:translateX(-50%);background:#1e1e1e;color:#fff;padding:8px 14px;border-radius:8px;font-weight:500;z-index:40;box-shadow:0 8px 24px -8px rgba(0,0,0,.4);max-width:80%}
  .ks-toast.err{background:#c62d0f}
  .ks-dlg-bg{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:10070;display:grid;place-items:center;padding:16px}
  .ks-dlg{background:#fff;border-radius:12px;width:min(420px,100%);box-shadow:0 24px 60px -12px rgba(0,0,0,.45);padding:18px;font:12px/1.5 Inter,ui-sans-serif,system-ui,sans-serif;color:#1e1e1e}
  .ks-dlg h3{margin:0 0 6px;font-size:14px} .ks-dlg p{margin:0 0 14px;white-space:pre-line;color:#444}
  .ks-dlg .ks-act{display:flex;justify-content:flex-end;gap:8px}
  .ks-dlg button{font:inherit;border:0;cursor:pointer}
  .ks-gaya{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px}
  .ks-gaya button{border:1.5px solid var(--ks-line,#e6e6e6);border-radius:10px;padding:12px 6px;background:#fff;display:flex;flex-direction:column;align-items:center;gap:6px;font-weight:600}
  .ks-gaya button:hover{border-color:#0d99ff;background:#f3faff}
  .ks-gaya svg{width:28px;height:28px}
  .ks-kbdlist{display:grid;grid-template-columns:1fr auto;gap:4px 16px;max-height:60vh;overflow:auto;margin-bottom:12px}
  .ks-kbdlist kbd{font:600 10.5px ui-monospace,monospace;background:#f0f0f0;border-radius:4px;padding:2px 6px;justify-self:end}
  .ks-banner{position:absolute;left:12px;right:12px;top:12px;background:#fff8e6;border:1px solid #f5d48a;color:#7a5200;border-radius:8px;padding:8px 10px;z-index:4;display:flex;gap:8px;align-items:flex-start}
  .ks-banner svg{width:16px;height:16px;flex:none;margin-top:1px}
  .ks-banner button{margin-left:auto;font-weight:600;color:#7a5200}
  .ks-sempit{position:absolute;inset:0;background:rgba(255,255,255,.96);z-index:60;display:none;align-items:center;justify-content:center;text-align:center;padding:24px;flex-direction:column;gap:12px;font-size:13px}
  @media (max-width:900px){.ks-root{grid-template-columns:0 minmax(0,1fr) 0}.ks-root .ks-panel{display:none}.ks-sempit{display:flex}.ks-root.ks-paksa{grid-template-columns:200px minmax(0,1fr) 220px}.ks-root.ks-paksa .ks-panel{display:flex}.ks-root.ks-paksa .ks-sempit{display:none}}
  `;

  function pasangCss() {
    if (document.getElementById('ks-css')) return;
    const s = document.createElement('style');
    s.id = 'ks-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ===================== DIALOG & TOAST ===================== */
  function dialog(judul, pesan, tombol) {
    return new Promise((ok) => {
      const bg = document.createElement('div');
      bg.className = 'ks-dlg-bg';
      bg.innerHTML = `<div class="ks-dlg" role="dialog" aria-modal="true"><h3>${esc(judul)}</h3><p>${esc(pesan)}</p><div class="ks-act">${(tombol || [{ t: 'OK', v: true, pri: true }]).map((b, i) => `<button data-i="${i}" class="ks-btn ${b.pri ? 'pri' : b.bahaya ? 'bhy' : 'sek'}">${esc(b.t)}</button>`).join('')}</div></div>`;
      const tutup = (v) => { bg.remove(); document.removeEventListener('keydown', kunci, true); ok(v); };
      const kunci = (e) => { if (e.key === 'Escape') { e.stopPropagation(); tutup(null); } };
      bg.addEventListener('click', (e) => { const b = e.target.closest('button[data-i]'); if (b) tutup((tombol || [{ v: true }])[+b.dataset.i].v); else if (e.target === bg) tutup(null); });
      document.addEventListener('keydown', kunci, true);
      document.body.appendChild(bg);
      const pri = bg.querySelector('.ks-btn.pri'); if (pri) pri.focus();
    });
  }
  const konfirmasi = (judul, pesan, ya, bahaya) => dialog(judul, pesan, [{ t: 'Batal', v: false }, { t: ya || 'Lanjutkan', v: true, pri: !bahaya, bahaya: !!bahaya }]);
  function toast(teks, salah) {
    if (!st) return;
    const stage = st.el.stage;
    let t = stage.querySelector('.ks-toast');
    if (!t) { t = document.createElement('div'); stage.appendChild(t); }
    t.className = 'ks-toast' + (salah ? ' err' : '');
    t.textContent = teks;
    clearTimeout(t._h);
    t._h = setTimeout(() => t.remove(), salah ? 5000 : 2600);
  }

  /* ===================== STATUS EDITOR ===================== */
  let st = null;
  const ic = () => (st && st.icons[st.aktif]) || null;
  const dok = () => (ic() ? ic().dok : null);
  const atr = () => st.aturan[dok() ? dok().gaya : st.gaya];
  const objById = (id) => (dok() ? dok().objek.find((o) => o.id === id) : null);
  const terpilih = () => st.sel.map(objById).filter(Boolean);
  const kunciSimpan = (it) => JSON.stringify({ n: it.namaFile, d: it.dok });
  const kotor = (it) => !!it.dok && kunciSimpan(it) !== it.simpan;

  function dokBaru(gaya) {
    return { v: 1, gaya, ukuran: st.aturan[gaya].ukuran, objek: [] };
  }

  /* --- riwayat (urungkan / ulangi) per icon --- */
  function catatUndo() {
    const it = ic(); if (!it) return;
    it.undo.push(JSON.stringify(it.dok));
    if (it.undo.length > 150) it.undo.shift();
    it.redo.length = 0;
  }
  /** Jalankan perubahan dokumen + simpan riwayat + gambar ulang. */
  function ubah(fn, opsi) {
    if (!dok()) return;
    if (!(opsi && opsi.tanpaUndo)) catatUndo();
    fn(dok());
    setelahUbah(opsi);
  }
  function setelahUbah(opsi) {
    const ada = new Set(dok().objek.map((o) => o.id));
    st.sel = st.sel.filter((id) => ada.has(id));
    if (st.edit && !ada.has(st.edit.id)) st.edit = null;
    renderSemua(opsi && opsi.tanpaKanan ? { kanan: false } : null);
    jadwalDraf();
  }
  function urungkan() {
    const it = ic(); if (!it || !it.undo.length) return;
    it.redo.push(JSON.stringify(it.dok));
    it.dok = JSON.parse(it.undo.pop());
    st.edit = null; st.pena = null;
    setelahUbah();
  }
  function ulangi() {
    const it = ic(); if (!it || !it.redo.length) return;
    it.undo.push(JSON.stringify(it.dok));
    it.dok = JSON.parse(it.redo.pop());
    st.edit = null; st.pena = null;
    setelahUbah();
  }

  /* --- koordinat layar ↔ dokumen --- */
  const keDok = (sx, sy) => [(sx - st.tx) / st.z, (sy - st.ty) / st.z];
  const keLayar = (x, y) => [x * st.z + st.tx, y * st.z + st.ty];
  function posKanvas(e) {
    const r = st.el.svg.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }
  function pasKanvas() {
    const d = dok(); if (!d) return;
    const r = st.el.svg.getBoundingClientRect();
    if (!r.width) return;
    const S = d.ukuran;
    st.z = clamp(Math.min((r.width - 80) / S, (r.height - 140) / S), 1, 256);
    st.tx = (r.width - S * st.z) / 2;
    st.ty = (r.height - S * st.z) / 2 - 20;
  }
  function aturZoom(zBaru, sx, sy) {
    const r = st.el.svg.getBoundingClientRect();
    if (sx == null) { sx = r.width / 2; sy = r.height / 2; }
    const [dx, dy] = keDok(sx, sy);
    st.z = clamp(zBaru, 1, 400);
    st.tx = sx - dx * st.z; st.ty = sy - dy * st.z;
    renderKanvas(); renderZoom();
  }

  /* ===================== MENGGAMBAR KANVAS ===================== */
  function attrGaya(o) {
    let a = o.fill ? `fill="${o.fill}"` : 'fill="none"';
    if (o.fillRule === 'evenodd') a += ' fill-rule="evenodd"';
    if (o.stroke && o.sw > 0) a += ` stroke="${o.stroke}" stroke-width="${o.sw}" stroke-linecap="round" stroke-linejoin="round"`;
    return a;
  }
  function renderKanvas() {
    if (!st) return;
    const d = dok();
    const W = st.el.world, O = st.el.over;
    if (!d) { W.innerHTML = ''; O.innerHTML = ''; return; }
    const S = d.ukuran, a = atr(), z = st.z;
    W.setAttribute('transform', `translate(${st.tx} ${st.ty}) scale(${z})`);
    const nss = 'vector-effect="non-scaling-stroke"';
    let h = `<rect x="0" y="0" width="${S}" height="${S}" fill="#fff" stroke="rgba(0,0,0,.08)" stroke-width="1" ${nss}/>`;
    if (st.grid && z >= 6) {
      const besar = S <= 32 ? 4 : 8;
      let tipis = '', tebal = '';
      for (let i = 1; i < S; i++) {
        const seg = `M${i} 0V${S}M0 ${i}H${S}`;
        if (i % besar === 0) tebal += seg; else tipis += seg;
      }
      h += `<path d="${tipis}" stroke="rgba(0,0,0,.07)" stroke-width="1" ${nss}/><path d="${tebal}" stroke="rgba(0,0,0,.14)" stroke-width="1" ${nss}/>`;
    }
    if (st.keyline) {
      const s = S / 24, p = a.padding;
      const kl = 'fill="none" stroke="rgba(255,62,165,.45)" stroke-width="1" ' + nss;
      h += `<circle cx="${S / 2}" cy="${S / 2}" r="${10 * s}" ${kl}/>`;
      h += `<rect x="${3 * s}" y="${3 * s}" width="${18 * s}" height="${18 * s}" rx="${s}" ${kl}/>`;
      h += `<rect x="${4 * s}" y="${2 * s}" width="${16 * s}" height="${20 * s}" rx="${s}" ${kl}/>`;
      h += `<rect x="${2 * s}" y="${4 * s}" width="${20 * s}" height="${16 * s}" rx="${s}" ${kl}/>`;
      h += `<path d="M0 0L${S} ${S}M${S} 0L0 ${S}M${S / 2} 0V${S}M0 ${S / 2}H${S}" ${kl} stroke-opacity=".5"/>`;
      h += `<rect x="${p}" y="${p}" width="${S - 2 * p}" height="${S - 2 * p}" fill="none" stroke="rgba(13,153,255,.55)" stroke-width="1" stroke-dasharray="4 3" ${nss}/>`;
    }
    const hitW = Math.max(8 / z, 0.5);
    d.objek.forEach((o) => {
      if (o.hidden) return;
      const dd = dDari(o);
      const pe = o.locked ? ' pointer-events="none"' : '';
      h += `<g data-id="${o.id}"${pe}><path d="${dd}" ${attrGaya(o)} pointer-events="none"/>` +
        `<path d="${dd}" fill="${o.fill ? 'transparent' : 'none'}" stroke="transparent" stroke-width="${Math.max(hitW, (o.stroke ? o.sw : 0))}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    });
    // garis luar objek terpilih / di-hover
    const garisLuar = (o, w) => `<path d="${dDari(o)}" fill="none" stroke="#0d99ff" stroke-width="${w}" ${nss} pointer-events="none"/>`;
    if (st.hover && !st.sel.includes(st.hover) && !st.drag) { const o = objById(st.hover); if (o && !o.hidden) h += garisLuar(o, 2); }
    terpilih().forEach((o) => { if (!o.hidden) h += garisLuar(o, 1); });
    W.innerHTML = h;
    renderOverlay();
  }

  /** Kotak seleksi + gagang (koordinat layar). Untuk 1 objek berputar: kotak ikut berputar. */
  function kotakSeleksi() {
    const list = terpilih().filter((o) => !o.hidden);
    if (!list.length) return null;
    if (list.length === 1 && parametrik(list[0]) && list[0].rot) {
      const o = list[0];
      const cx = o.x + o.w / 2, cy = o.y + o.h / 2, rad = o.rot * Math.PI / 180;
      const sudut = [[o.x, o.y], [o.x + o.w, o.y], [o.x + o.w, o.y + o.h], [o.x, o.y + o.h]].map(([x, y]) => putarTitik(x, y, cx, cy, rad));
      return { pts: sudut, rot: o.rot, lokal: { x: o.x, y: o.y, w: o.w, h: o.h }, cx, cy };
    }
    const b = batasGabung(list);
    return { pts: [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.h], [b.x, b.y + b.h]], rot: 0, lokal: b, cx: b.x + b.w / 2, cy: b.y + b.h / 2 };
  }
  const GAGANG = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  function posGagang(k) {
    const [a, b, c, d] = k.pts;
    const tengah = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    return { nw: a, n: tengah(a, b), ne: b, e: tengah(b, c), se: c, s: tengah(c, d), sw: d, w: tengah(d, a) };
  }

  function renderOverlay() {
    const O = st.el.over, d = dok();
    let h = '';
    if (!d) { O.innerHTML = ''; return; }
    const it = ic();
    const [lx, ly] = keLayar(0, 0);
    h += `<text x="${lx}" y="${ly - 8}" font-size="11" fill="#8a8a8a" font-family="Inter,system-ui,sans-serif">${esc(it.namaFile || 'Icon tanpa nama')} · ${d.ukuran}×${d.ukuran}</text>`;

    if (st.edit) {
      h += overlayEditTitik();
    } else if (!st.pena) {
      const k = kotakSeleksi();
      if (k) {
        const L = k.pts.map(([x, y]) => keLayar(x, y));
        h += `<polygon points="${L.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#0d99ff" stroke-width="1" pointer-events="none"/>`;
        const kecil = Math.hypot(L[1][0] - L[0][0], L[1][1] - L[0][1]) < 24 && Math.hypot(L[3][0] - L[0][0], L[3][1] - L[0][1]) < 24;
        const pg = posGagang(k);
        GAGANG.forEach((g) => {
          if (kecil && g.length === 1) return;
          const [sx, sy] = keLayar(pg[g][0], pg[g][1]);
          h += `<rect data-h="${g}" x="${sx - 4}" y="${sy - 4}" width="8" height="8" fill="#fff" stroke="#0d99ff" stroke-width="1" style="cursor:${kursorGagang(g, k.rot)}"/>`;
        });
        // zona putar di luar sudut
        ['nw', 'ne', 'se', 'sw'].forEach((g) => {
          const [sx, sy] = keLayar(pg[g][0], pg[g][1]);
          const [cx, cy] = keLayar(k.cx, k.cy);
          const l = Math.hypot(sx - cx, sy - cy) || 1;
          const ox = sx + (sx - cx) / l * 12, oy = sy + (sy - cy) / l * 12;
          h += `<circle data-h="rot-${g}" cx="${ox}" cy="${oy}" r="9" fill="transparent" style="cursor:alias"/>`;
        });
        const b = batasGabung(terpilih());
        const [bx, by] = keLayar(b.x + b.w / 2, b.y + b.h);
        const ukur = `${fmt(k.rot ? k.lokal.w : b.w)} × ${fmt(k.rot ? k.lokal.h : b.h)}`;
        const lebar = ukur.length * 6.2 + 12;
        h += `<g pointer-events="none"><rect x="${bx - lebar / 2}" y="${by + 8}" width="${lebar}" height="17" rx="3" fill="#0d99ff"/><text x="${bx}" y="${by + 20}" text-anchor="middle" font-size="10.5" fill="#fff" font-family="Inter,system-ui,sans-serif">${ukur}</text></g>`;
      }
    }
    if (st.pena) h += overlayPena();
    if (st.drag && st.drag.marquee) {
      const m = st.drag.marquee;
      h += `<rect x="${Math.min(m.x1, m.x2)}" y="${Math.min(m.y1, m.y2)}" width="${Math.abs(m.x2 - m.x1)}" height="${Math.abs(m.y2 - m.y1)}" fill="rgba(13,153,255,.08)" stroke="#0d99ff" stroke-width="1" pointer-events="none"/>`;
    }
    if (st.panduan && st.panduan.length) {
      st.panduan.forEach((p) => {
        if (p.x != null) { const [sx] = keLayar(p.x, 0); const [, s1] = keLayar(0, p.y1); const [, s2] = keLayar(0, p.y2); h += `<path d="M${sx} ${s1}V${s2}" stroke="#f24822" stroke-width="1" pointer-events="none"/>`; }
        else { const [, sy] = keLayar(0, p.y); const [s1] = keLayar(p.x1, 0); const [s2] = keLayar(p.x2, 0); h += `<path d="M${s1} ${sy}H${s2}" stroke="#f24822" stroke-width="1" pointer-events="none"/>`; }
      });
    }
    O.innerHTML = h;
  }
  function kursorGagang(g, rot) {
    const urut = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
    const kursor = ['ns-resize', 'nesw-resize', 'ew-resize', 'nwse-resize'];
    const i = (urut.indexOf(g) + Math.round(((rot || 0) % 360 + 360) % 360 / 45)) % 8;
    return kursor[i % 4];
  }

  function overlayEditTitik() {
    const o = objById(st.edit.id);
    if (!o || o.tipe !== 'path') return '';
    let h = '';
    o.sub.forEach((s, si) => s.segs.forEach((g, gi) => {
      const [ax, ay] = keLayar(g.x, g.y);
      const pilih = st.edit.titik.has(si + ':' + gi);
      if (pilih || st.edit.titik.size === 0) {
        [['hi', g.hi], ['ho', g.ho]].forEach(([k, v]) => {
          if (!v) return;
          const [hx, hy] = keLayar(g.x + v.x, g.y + v.y);
          h += `<path d="M${ax} ${ay}L${hx} ${hy}" stroke="#0d99ff" stroke-width="1" pointer-events="none"/><circle data-hd="${si}:${gi}:${k}" cx="${hx}" cy="${hy}" r="3.5" fill="#fff" stroke="#0d99ff" stroke-width="1" style="cursor:move"/>`;
        });
      }
    }));
    o.sub.forEach((s, si) => s.segs.forEach((g, gi) => {
      const [ax, ay] = keLayar(g.x, g.y);
      const pilih = st.edit.titik.has(si + ':' + gi);
      h += `<rect data-tt="${si}:${gi}" x="${ax - 3.5}" y="${ay - 3.5}" width="7" height="7" fill="${pilih ? '#0d99ff' : '#fff'}" stroke="#0d99ff" stroke-width="1" style="cursor:move"/>`;
    }));
    return h;
  }
  function overlayPena() {
    const p = st.pena;
    const o = objById(p.id);
    let h = '';
    if (o) {
      const s = o.sub[p.si];
      s.segs.forEach((g, gi) => {
        const [ax, ay] = keLayar(g.x, g.y);
        [g.hi, g.ho].forEach((v) => { if (!v) return; const [hx, hy] = keLayar(g.x + v.x, g.y + v.y); h += `<path d="M${ax} ${ay}L${hx} ${hy}" stroke="#0d99ff" stroke-width="1"/><circle cx="${hx}" cy="${hy}" r="3" fill="#fff" stroke="#0d99ff"/>`; });
        h += `<rect x="${ax - 3.5}" y="${ay - 3.5}" width="7" height="7" fill="${gi === s.segs.length - 1 ? '#0d99ff' : '#fff'}" stroke="#0d99ff" stroke-width="1" ${gi === 0 ? 'data-pena-awal="1"' : ''}/>`;
      });
      if (p.kursor && !p.tarik) {
        const akhir = s.segs[s.segs.length - 1];
        const [ax, ay] = keLayar(akhir.x, akhir.y);
        const c1 = akhir.ho ? keLayar(akhir.x + akhir.ho.x, akhir.y + akhir.ho.y) : [ax, ay];
        const [kx, ky] = keLayar(p.kursor[0], p.kursor[1]);
        h += `<path d="M${ax} ${ay}C${c1[0]} ${c1[1]} ${kx} ${ky} ${kx} ${ky}" fill="none" stroke="#0d99ff" stroke-width="1" stroke-dasharray="3 3" pointer-events="none"/>`;
        if (p.dekatAwal) { const [fx, fy] = keLayar(s.segs[0].x, s.segs[0].y); h += `<circle cx="${fx}" cy="${fy}" r="7" fill="none" stroke="#0d99ff" stroke-width="1.5" pointer-events="none"/>`; }
      }
    } else if (p.kursor) {
      const [kx, ky] = keLayar(p.kursor[0], p.kursor[1]);
      h += `<rect x="${kx - 3.5}" y="${ky - 3.5}" width="7" height="7" fill="#fff" stroke="#0d99ff" pointer-events="none"/>`;
    }
    return h;
  }

  /* ===================== PANEL KIRI: ICON & LAYER ===================== */
  function urlSvg(svg) { return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); }
  function renderIcons() {
    const el = st.el.icons;
    st.el.jmlicon.textContent = st.icons.length ? `(${st.icons.length})` : '';
    if (!st.icons.length) { el.innerHTML = `<div class="ks-empty">Belum ada icon. Klik + untuk membuat.</div>`; return; }
    el.innerHTML = st.icons.map((it, i) => {
      let svg = '';
      try { svg = it.dok ? eksporSvg(it.dok, st.aturan, { outline: false }) : (it.mentah || ''); } catch (e) { svg = ''; }
      const label = it.asal === 'luar' ? '<span class="ks-chip warn">Luar Studio</span>' : it.file_id ? '<span class="ks-chip ok">Drive</span>' : '<span class="ks-chip">Baru</span>';
      return `<div class="ks-icon-it${i === st.aktif ? ' on' : ''}" data-icon="${i}" title="${esc(it.namaFile)}">
        <div class="ks-thumb">${svg ? `<img alt="" src="${urlSvg(svg)}">` : ''}</div>
        <div class="ks-icon-nm"><div class="ks-title" style="font-weight:500;font-size:11px">${esc(it.namaFile || 'Icon tanpa nama')}</div><div class="ks-sub">${label}</div></div>
        ${kotor(it) ? '<span class="ks-dot" title="Belum disimpan"></span>' : ''}
      </div>`;
    }).join('');
  }
  function ikonLayer(o) {
    if (o.tipe === 'rect') return IKON.rect; if (o.tipe === 'ellipse') return IKON.ellipse;
    if (o.tipe === 'polygon') return IKON.polygon; if (o.tipe === 'star') return IKON.star;
    return namaObjek(o) === 'Garis' ? IKON.line : IKON.vektor;
  }
  function renderLayers() {
    const d = dok(), el = st.el.layers;
    if (!d || !d.objek.length) { el.innerHTML = `<div class="ks-empty">Belum ada layer.<br>Pilih alat bentuk di bawah lalu gambar di artboard.</div>`; return; }
    el.innerHTML = d.objek.slice().reverse().map((o) => `
      <div class="ks-layer${st.sel.includes(o.id) ? ' on' : ''}${o.hidden ? ' mati' : ''}" data-layer="${o.id}" draggable="true">
        <span class="ks-ly-ic">${ikonLayer(o)}</span>
        <span class="ks-ly-nm">${esc(namaObjek(o))}</span>
        <span class="ks-ly-act${o.hidden || o.locked ? ' tetap' : ''}">
          <button data-ly-kunci="${o.id}" title="${o.locked ? 'Buka kunci' : 'Kunci'}">${o.locked ? IKON.kunci : IKON.buka}</button>
          <button data-ly-mata="${o.id}" title="${o.hidden ? 'Tampilkan' : 'Sembunyikan'}">${o.hidden ? IKON.mataTutup : IKON.mata}</button>
        </span>
      </div>`).join('');
  }

  /* ===================== TOOLBAR BAWAH ===================== */
  const BENTUK = [
    ['rect', 'Persegi', 'R'], ['line', 'Garis', 'L'], ['ellipse', 'Elips', 'O'], ['polygon', 'Poligon', 'Y'], ['star', 'Bintang', 'S']
  ];
  function bisaBoolean() { return terpilih().filter((o) => !o.hidden).length >= 2; }
  function renderToolbar() {
    const t = st.tool;
    const ikonBentuk = IKON[st.alatBentuk];
    st.el.toolbar.innerHTML = `
      <button class="ks-tool${t === 'pilih' ? ' on' : ''}" data-tool="pilih" data-tip="Pilih|V">${IKON.pilih}</button>
      <button class="ks-tool${t === 'tangan' ? ' on' : ''}" data-tool="tangan" data-tip="Tangan (geser kanvas)|H">${IKON.tangan}</button>
      <button class="ks-tool${BENTUK.some((b) => b[0] === t) ? ' on' : ''}" data-tool="${st.alatBentuk}" data-tip="Alat bentuk|${(BENTUK.find((b) => b[0] === st.alatBentuk) || [])[2] || ''}" style="padding-left:6px">${ikonBentuk}<span class="ks-caret" data-a="menuBentuk">${IKON.bawah}</span></button>
      <button class="ks-tool${t === 'pena' ? ' on' : ''}" data-tool="pena" data-tip="Pena (kurva)|P">${IKON.pena}</button>
      <span class="ks-sep"></span>
      <button class="ks-tool" data-a="menuBoolean" data-tip="Gabungkan bentuk (pilih ≥ 2)|" ${bisaBoolean() ? '' : 'disabled'} style="padding:0 4px 0 6px">${IKON.gabung}<span class="ks-caret">${IKON.bawah}</span></button>
      <span class="ks-sep"></span>
      <button class="ks-tool${st.grid ? '' : ''}" data-a="grid" data-tip="${st.grid ? 'Sembunyikan' : 'Tampilkan'} grid piksel|Ctrl+'" style="${st.grid ? 'color:#0d99ff' : ''}">${IKON.grid}</button>
      <button class="ks-tool" data-a="keyline" data-tip="${st.keyline ? 'Sembunyikan' : 'Tampilkan'} keyline template|K" style="${st.keyline ? 'color:#0d99ff' : ''}">${IKON.keyline}</button>
      <button class="ks-tool" data-a="snap" data-tip="Magnet ke grid & objek: ${st.snap ? 'aktif' : 'mati'}|" style="${st.snap ? 'color:#0d99ff' : ''}">${IKON.magnet}</button>
      <span class="ks-sep"></span>
      <button class="ks-tool" data-a="undo" data-tip="Urungkan|Ctrl+Z" ${ic() && ic().undo.length ? '' : 'disabled'}>${IKON.undo}</button>
      <button class="ks-tool" data-a="redo" data-tip="Ulangi|Ctrl+Shift+Z" ${ic() && ic().redo.length ? '' : 'disabled'}>${IKON.redo}</button>
      <button class="ks-tool" data-a="pintasan" data-tip="Pintasan keyboard|?">${IKON.keyboard}</button>`;
  }
  function renderZoom() { if (st) st.el.zoom.textContent = Math.round(st.z * 100) + '%'; }

  function menu(anchor, items, atas) {
    tutupMenu();
    const m = document.createElement('div');
    m.className = 'ks-menu';
    m.innerHTML = items.map((x, i) => x === '-' ? '<div style="height:1px;background:#3a3a3a;margin:4px 2px"></div>' : `<button data-mi="${i}" ${x.mati ? 'disabled' : ''}>${x.ikon || ''}<span>${esc(x.t)}</span>${x.k ? `<span class="ks-kbd">${esc(x.k)}</span>` : ''}</button>`).join('');
    st.el.root.appendChild(m);
    const r = anchor.getBoundingClientRect(), rr = st.el.root.getBoundingClientRect();
    const mw = m.offsetWidth, mh = m.offsetHeight;
    let left = r.left - rr.left, top = atas ? r.top - rr.top - mh - 8 : r.bottom - rr.top + 6;
    left = clamp(left, 8, rr.width - mw - 8);
    m.style.left = left + 'px'; m.style.top = top + 'px';
    m.addEventListener('click', (e) => { const b = e.target.closest('button[data-mi]'); if (!b) return; const x = items[+b.dataset.mi]; tutupMenu(); x.fn(); });
    st.menu = m;
  }
  function tutupMenu() { if (st && st.menu) { st.menu.remove(); st.menu = null; } }

  function renderSemua(opsi) {
    renderKanvas();
    renderIcons();
    renderLayers();
    renderToolbar();
    if (!opsi || opsi.kanan !== false) renderKanan();
    renderZoom();
    renderSubjudul();
  }
  function renderSubjudul() {
    const d = dok();
    const g = d ? d.gaya : st.gaya;
    st.el.sub.innerHTML = `${st.opts.proyek ? esc(st.opts.proyek.kategori || 'Proyek') : 'Mode bebas'} · <b>${NAMA_GAYA[g]}</b> ${d ? d.ukuran + '×' + d.ukuran : ''}`;
    const tombol = st.el.btnSimpan;
    if (st.opts.proyek) tombol.innerHTML = `${IKON.awan}<span>Simpan ke Drive</span>`;
    else tombol.innerHTML = `${IKON.unduh}<span>Unduh SVG</span>`;
    tombol.disabled = !d || !!st.menyimpan;
  }

  /* ===================== PANEL KANAN ===================== */
  function hasilPeriksa() {
    const it = ic(); if (!it) return [];
    const nama = String(it.namaFile || '').trim().toLowerCase();
    const kembar = !!nama && st.icons.some((x) => x !== it && String(x.namaFile || '').trim().toLowerCase() === nama);
    return periksa(it.dok, st.aturan, { namaFile: it.namaFile, namaKembar: kembar });
  }
  function renderTabs(hasil) {
    const err = hasil.filter((x) => x.level === 'error').length, warn = hasil.filter((x) => x.level === 'warn').length;
    const badge = err ? `<span class="ks-chip err">${err}</span>` : warn ? `<span class="ks-chip warn">${warn}</span>` : `<span class="ks-chip ok">✓</span>`;
    st.el.tabs.innerHTML = `<button class="ks-tab${st.tabKanan === 'desain' ? ' on' : ''}" data-tab="desain">Desain</button>
      <button class="ks-tab${st.tabKanan === 'periksa' ? ' on' : ''}" data-tab="periksa">Periksa${dok() ? badge : ''}</button>`;
  }
  function nilaiBersama(list, fn) {
    const v = list.map(fn);
    return v.every((x) => x === v[0]) ? v[0] : undefined;
  }
  function field(lbl, key, nilai, opsi) {
    opsi = opsi || {};
    const kosong = nilai === undefined;
    return `<label class="ks-field${opsi.kunci ? ' kunci' : ''}" title="${esc(opsi.tip || '')}"><span class="ks-lbl" ${opsi.kunci ? '' : `data-scrub="${key}"`}>${lbl}</span><input data-f="${key}" value="${kosong ? '' : esc(opsi.teks ? nilai : fmt(nilai))}" placeholder="${kosong ? 'Campuran' : ''}" ${opsi.kunci ? 'readonly' : ''} spellcheck="false"></label>`;
  }
  function baris(...isi) { return `<div class="ks-row">${isi.join('')}</div>`; }

  function renderKanan() {
    if (!st) return;
    const el = st.el.kanan;
    const hasil = dok() ? hasilPeriksa() : [];
    renderTabs(hasil);
    if (!dok()) { el.innerHTML = `<div class="ks-sec ks-note">Buat icon baru atau pilih icon di panel kiri.</div>`; return; }
    if (st.tabKanan === 'periksa') { el.innerHTML = htmlPeriksa(hasil) + htmlPratinjau(); return; }
    const list = terpilih();
    el.innerHTML = (list.length ? htmlObjek(list) : htmlIcon()) + htmlPratinjau();
  }

  function htmlIcon() {
    const it = ic(), d = it.dok, a = atr();
    const palet = a.warna.map((w) => `<span style="width:14px;height:14px;border-radius:3px;background:${w};border:1px solid rgba(0,0,0,.14);display:inline-block"></span>`).join('');
    return `
      <div class="ks-sec">
        <div class="ks-sec-h"><span>Icon</span><span class="ks-chip acc">${NAMA_GAYA[d.gaya]} · ${d.ukuran}×${d.ukuran}</span></div>
        <div class="ks-row"><label class="ks-field"><input class="ks-full" type="text" data-f="namaFile" value="${esc(it.namaFile)}" placeholder="Nama file icon" spellcheck="false" style="padding-left:8px"></label><span class="ks-note">.svg</span></div>
        ${st.opts.proyek ? `<div class="ks-note" style="margin-top:6px">Format: nomor · nama icon · gaya · nama desainer. Tersimpan ke folder Drive proyek.</div>` : ''}
        ${it.asal === 'luar' ? `<div class="ks-note" style="margin-top:6px;color:#9a6300">Icon ini dibuat di luar Studio dan sudah diubah jadi vektor yang bisa diedit. Menyimpan akan menimpa file aslinya di Drive.</div>` : ''}
      </div>
      <div class="ks-sec">
        <div class="ks-sec-h"><span>Aturan ${NAMA_GAYA[d.gaya]}</span>${st.opts.wajib ? '<span class="ks-chip err">Wajib Studio</span>' : ''}</div>
        <div class="ks-rule"><span>Artboard</span><b>${d.ukuran} × ${d.ukuran} px</b></div>
        <div class="ks-rule"><span>Tebal garis</span><b>${fmt(a.stroke)} px${st.aturan.kunciStroke && d.gaya === 'line' ? ' 🔒' : ''}</b></div>
        <div class="ks-rule"><span>Ujung & sudut garis</span><b>Bulat</b></div>
        <div class="ks-rule"><span>Magnet grid</span><b>${fmt(a.snap)} px</b></div>
        <div class="ks-rule"><span>Area aman (tepi)</span><b>${fmt(a.padding)} px</b></div>
        <div class="ks-rule"><span>Palet</span><span style="display:flex;gap:3px;flex-wrap:wrap;justify-content:flex-end;max-width:60%">${palet}</span></div>
        <div class="ks-note" style="margin-top:6px">Garis biru putus-putus = area aman. Garis merah muda = keyline (lingkaran, persegi, persegi panjang) supaya ukuran visual tiap icon seimbang.</div>
      </div>
      <div class="ks-sec">
        <div class="ks-sec-h"><span>Ekspor</span></div>
        <div class="ks-row"><button class="ks-btn sek" data-a="unduhSvg" style="flex:1">${IKON.unduh}Unduh SVG</button><button class="ks-btn sek" data-a="salinSvg" style="flex:1">${IKON.papan}Salin kode</button></div>
      </div>`;
  }

  function htmlObjek(list) {
    const a = atr(), d = dok();
    const satu = list.length === 1 ? list[0] : null;
    const b = batasGabung(list);
    const lokal = satu && parametrik(satu) && satu.rot;
    const X = lokal ? satu.x : b.x, Y = lokal ? satu.y : b.y, W = lokal ? satu.w : b.w, H = lokal ? satu.h : b.h;
    const rot = satu ? (parametrik(satu) ? satu.rot || 0 : 0) : undefined;
    const fill = nilaiBersama(list, (o) => o.fill || null);
    const stroke = nilaiBersama(list, (o) => o.stroke || null);
    const sw = nilaiBersama(list, (o) => (o.stroke ? o.sw : null));
    const kunciSw = d.gaya === 'line' && st.aturan.kunciStroke;
    let h = `<div class="ks-sec"><div class="ks-alignbar">
      <button class="ks-iconbtn" data-rata="kiri" title="Rata kiri (Alt+A)">${IKON.rataKiri}</button>
      <button class="ks-iconbtn" data-rata="tengahH" title="Rata tengah horizontal (Alt+H)">${IKON.rataTengahH}</button>
      <button class="ks-iconbtn" data-rata="kanan" title="Rata kanan (Alt+D)">${IKON.rataKanan}</button>
      <button class="ks-iconbtn" data-rata="atas" title="Rata atas (Alt+W)">${IKON.rataAtas}</button>
      <button class="ks-iconbtn" data-rata="tengahV" title="Rata tengah vertikal (Alt+V)">${IKON.rataTengahV}</button>
      <button class="ks-iconbtn" data-rata="bawah" title="Rata bawah (Alt+S)">${IKON.rataBawah}</button>
      <button class="ks-iconbtn" data-rata="sebarH" title="Sebar horizontal (pilih ≥ 3)" ${list.length >= 3 ? '' : 'disabled'}>${IKON.sebarH}</button>
      <button class="ks-iconbtn" data-rata="sebarV" title="Sebar vertikal (pilih ≥ 3)" ${list.length >= 3 ? '' : 'disabled'}>${IKON.sebarV}</button>
    </div>${list.length === 1 ? '<div class="ks-note" style="margin-top:4px">1 objek dirapikan terhadap artboard.</div>' : ''}</div>`;

    h += `<div class="ks-sec"><div class="ks-sec-h"><span>${satu ? esc(namaObjek(satu)) : list.length + ' objek'}</span>
        <span class="ks-row"><button class="ks-iconbtn" data-a="putar90" title="Putar 90°">${IKON.putar}</button><button class="ks-iconbtn" data-a="cerminH" title="Cermin horizontal (Shift+H)">${IKON.cerminH}</button><button class="ks-iconbtn" data-a="cerminV" title="Cermin vertikal (Shift+V)">${IKON.cerminV}</button></span></div>
      ${baris(field('X', 'x', X), field('Y', 'y', Y))}
      ${baris(field('W', 'w', W), field('H', 'h', H), `<button class="ks-iconbtn${st.kunciRasio ? ' on' : ''}" data-a="kunciRasio" title="Kunci perbandingan W/H">${st.kunciRasio ? IKON.kunci : IKON.buka}</button>`)}
      ${baris(field(IKON.putar, 'rot', rot, { tip: 'Putar (derajat)' }), satu && satu.tipe === 'rect' ? field(IKON.sudut, 'r', satu.r || 0, { tip: 'Radius sudut' }) : satu && (satu.tipe === 'polygon' || satu.tipe === 'star') ? field('#', 'sisi', satu.sisi, { tip: satu.tipe === 'star' ? 'Jumlah sudut bintang' : 'Jumlah sisi' }) : '<span style="flex:1"></span>')}
      ${satu && satu.tipe === 'star' ? baris(field('%', 'rasio', Math.round((satu.rasio || 0.45) * 100), { tip: 'Rasio sudut dalam bintang' }), '<span style="flex:1"></span>') : ''}
    </div>`;

    const chipPalet = (target, aktif) => `<div class="ks-palet">${a.warna.map((w) => `<button data-palet="${target}" data-w="${w}" style="background:${w}" class="${aktif && aktif.toUpperCase() === w ? 'on' : ''}" title="${w}"></button>`).join('')}</div>`;
    h += `<div class="ks-sec"><div class="ks-sec-h"><span>Isi (fill)</span>${fill === null ? `<button class="ks-iconbtn" data-a="tambahFill" title="Tambah isi">${IKON.tambah}</button>` : `<button class="ks-iconbtn" data-a="hapusFill" title="Hapus isi">${IKON.hapus}</button>`}</div>
      ${fill === null ? '<div class="ks-note">Tanpa isi.</div>' : `<div class="ks-row"><label class="ks-field"><span class="ks-swatch" style="background:${fill || '#fff'}"><input type="color" data-warna="fill" value="${hexOk(fill) ? fill : '#000000'}"></span><input data-f="fill" value="${fill ? fill.replace('#', '').toUpperCase() : ''}" placeholder="Campuran" spellcheck="false" style="padding-left:8px"></label></div>${chipPalet('fill', fill)}`}
    </div>`;
    h += `<div class="ks-sec"><div class="ks-sec-h"><span>Garis (stroke)</span>${stroke === null ? `<button class="ks-iconbtn" data-a="tambahStroke" title="Tambah garis">${IKON.tambah}</button>` : `<button class="ks-iconbtn" data-a="hapusStroke" title="Hapus garis">${IKON.hapus}</button>`}</div>
      ${stroke === null ? '<div class="ks-note">Tanpa garis.</div>' : `<div class="ks-row"><label class="ks-field"><span class="ks-swatch" style="background:${stroke || '#fff'}"><input type="color" data-warna="stroke" value="${hexOk(stroke) ? stroke : '#000000'}"></span><input data-f="stroke" value="${stroke ? stroke.replace('#', '').toUpperCase() : ''}" placeholder="Campuran" spellcheck="false" style="padding-left:8px"></label>${field('≡', 'sw', sw, { kunci: kunciSw, tip: kunciSw ? 'Dikunci sesuai aturan gaya Line' : 'Tebal garis' })}</div>${chipPalet('stroke', stroke)}
      <div class="ks-note" style="margin-top:6px">Ujung & sudut garis selalu bulat.${kunciSw ? ` Tebal dikunci ${fmt(a.stroke)}px.` : ''}</div>`}
    </div>`;

    h += `<div class="ks-sec"><div class="ks-sec-h"><span>Aksi</span></div>
      ${list.length >= 2 ? `<div class="ks-row" style="margin-bottom:6px">
        <button class="ks-iconbtn" data-bool="gabung" title="Gabung (Ctrl+Alt+U)">${IKON.gabung}</button>
        <button class="ks-iconbtn" data-bool="kurangi" title="Kurangi: bawah dikurangi atas (Ctrl+Alt+S)">${IKON.kurangi}</button>
        <button class="ks-iconbtn" data-bool="potong" title="Irisan (Ctrl+Alt+I)">${IKON.potong}</button>
        <button class="ks-iconbtn" data-bool="sisakan" title="Sisakan beda (Ctrl+Alt+X)">${IKON.sisakan}</button>
        <span class="ks-note">Penggabungan bentuk</span></div>` : ''}
      <div class="ks-row" style="flex-wrap:wrap">
        <button class="ks-btn sek" data-a="outline" title="Ctrl+Shift+O" ${list.some((o) => o.stroke) ? '' : 'disabled'}>${IKON.outline}Garis → bentuk</button>
        <button class="ks-btn sek" data-a="keVektor" title="Ubah ke vektor agar titiknya bisa diedit (Enter)" ${list.some(parametrik) ? '' : 'disabled'}>${IKON.vektor}Ke vektor</button>
      </div>
      <div class="ks-row"><button class="ks-btn sek" data-a="duplikat" title="Ctrl+D">${IKON.duplikat}Duplikat</button><button class="ks-btn bhy" data-a="hapus" title="Delete">${IKON.hapus}Hapus</button></div>
      ${satu && satu.tipe === 'path' ? '<div class="ks-note" style="margin-top:6px">Klik dua kali objek (atau Enter) untuk mengedit titik.</div>' : ''}
    </div>`;
    return h;
  }

  function htmlPeriksa(hasil) {
    if (!hasil.filter((x) => x.level !== 'info').length) {
      return `<div class="ks-sec"><div class="ks-ok">${IKON.cek}<b>Icon lolos pemeriksaan</b><span class="ks-note">Siap disimpan.</span></div>${hasil.map((x) => `<div class="ks-note" style="text-align:center">${esc(x.teks)}</div>`).join('')}</div>`;
    }
    const bisa = hasil.filter((x) => x.perbaiki).length;
    return `<div class="ks-sec"><div class="ks-sec-h"><span>${hasil.filter((x) => x.level === 'error').length} masalah · ${hasil.filter((x) => x.level === 'warn').length} peringatan</span>${bisa ? `<button class="ks-btn pri" data-a="perbaikiSemua" style="height:24px;padding:0 8px">Perbaiki semua (${bisa})</button>` : ''}</div>
      ${hasil.map((x, i) => `<div class="ks-issue ${x.level}" data-issue="${i}"><span class="ks-ic">${x.level === 'error' ? IKON.awas : x.level === 'warn' ? IKON.awas : IKON.info}</span><div><div>${esc(x.teks)}</div>${x.perbaiki ? `<button class="ks-fix" data-fix="${i}">Perbaiki otomatis</button>` : ''}</div></div>`).join('')}
      <div class="ks-note" style="margin-top:6px">Merah = wajib diperbaiki sebelum disimpan. Kuning = sebaiknya diperbaiki.</div></div>`;
  }

  let cachePrev = { kunci: '', html: '' };
  function htmlPratinjau() {
    const d = dok(); if (!d) return '';
    let svg = '';
    try { svg = eksporSvg(d, st.aturan, { outline: false }); } catch (e) { svg = ''; }
    if (cachePrev.kunci === svg) return cachePrev.html;
    const u = urlSvg(svg);
    const fig = (n) => `<figure><img alt="" src="${u}" width="${n}" height="${n}"><span>${n}</span></figure>`;
    const html = `<div class="ks-sec" style="border:0"><div class="ks-sec-h"><span>Pratinjau</span></div><div class="ks-prev"><div>${fig(16)}${fig(24)}${fig(32)}${fig(48)}</div><div class="gelap${d.gaya === 'flat' ? '' : ' balik'}">${fig(16)}${fig(24)}${fig(32)}${fig(48)}</div></div></div>`;
    cachePrev = { kunci: svg, html };
    return html;
  }

  /** Perbarui angka X/Y/W/H di panel tanpa membangun ulang panel (dipakai saat menyeret). */
  function segarkanAngka() {
    const list = terpilih(); if (!list.length || st.tabKanan !== 'desain') return;
    const satu = list.length === 1 ? list[0] : null;
    const b = batasGabung(list);
    const lokal = satu && parametrik(satu) && satu.rot;
    const nilai = { x: lokal ? satu.x : b.x, y: lokal ? satu.y : b.y, w: lokal ? satu.w : b.w, h: lokal ? satu.h : b.h, rot: satu && parametrik(satu) ? satu.rot || 0 : undefined };
    Object.keys(nilai).forEach((k) => { const inp = st.el.kanan.querySelector(`input[data-f="${k}"]`); if (inp && document.activeElement !== inp && nilai[k] !== undefined) inp.value = fmt(nilai[k]); });
  }

  /* --- menerapkan nilai dari kolom angka --- */
  function terapkanField(key, raw, tanpaUndo) {
    const list = terpilih();
    const a = atr();
    if (key === 'namaFile') {
      const it = ic();
      const bersih = String(raw).replace(/\.svg$/i, '').replace(/[\\/:*?"<>|#%{}~&]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150);
      if (bersih === it.namaFile) return;
      it.namaFile = bersih;
      renderIcons(); renderOverlay(); renderTabs(hasilPeriksa()); jadwalDraf();
      return;
    }
    if (!list.length) return;
    if (key === 'fill' || key === 'stroke') {
      let v = String(raw).trim().replace(/^#/, '');
      if (/^[0-9a-f]{3}$/i.test(v)) v = v.split('').map((c) => c + c).join('');
      if (!/^[0-9a-f]{6}$/i.test(v)) { renderKanan(); return; }
      ubah(() => list.forEach((o) => { o[key] = '#' + v.toUpperCase(); }), { tanpaUndo });
      return;
    }
    const v = parseFloat(String(raw).replace(',', '.'));
    if (!isFinite(v)) { renderKanan(); return; }
    ubah(() => {
      const b = batasGabung(list);
      const satu = list.length === 1 ? list[0] : null;
      if (key === 'x' || key === 'y') {
        if (satu && parametrik(satu) && satu.rot) { satu[key] = r4(v); return; }
        const dx = key === 'x' ? v - b.x : 0, dy = key === 'y' ? v - b.y : 0;
        list.forEach((o) => geser(o, dx, dy));
      } else if (key === 'w' || key === 'h') {
        const nv = Math.max(0.01, v);
        if (satu && parametrik(satu) && satu.rot) {
          const cx = satu.x + satu.w / 2, cy = satu.y + satu.h / 2;
          if (key === 'w') { if (st.kunciRasio) satu.h = r4(satu.h * nv / satu.w); satu.w = r4(nv); } else { if (st.kunciRasio) satu.w = r4(satu.w * nv / satu.h); satu.h = r4(nv); }
          satu.x = r4(cx - satu.w / 2); satu.y = r4(cy - satu.h / 2);
          return;
        }
        const lama = key === 'w' ? b.w : b.h;
        if (lama < 1e-6) return;
        const k = nv / lama;
        const sx = key === 'w' ? k : st.kunciRasio ? k : 1, sy = key === 'h' ? k : st.kunciRasio ? k : 1;
        list.forEach((o) => skala(o, b.x, b.y, sx, sy));
      } else if (key === 'rot') {
        if (satu && parametrik(satu)) { const cx = satu.x + satu.w / 2, cy = satu.y + satu.h / 2; putar(satu, v - (satu.rot || 0), cx, cy); }
        else { const cx = b.x + b.w / 2, cy = b.y + b.h / 2; list.forEach((o) => putar(o, v, cx, cy)); }
      } else if (key === 'r') {
        list.forEach((o) => { if (o.tipe === 'rect') o.r = r4(clamp(v, 0, Math.min(o.w, o.h) / 2)); });
      } else if (key === 'sisi') {
        list.forEach((o) => { if (o.tipe === 'polygon' || o.tipe === 'star') o.sisi = clamp(Math.round(v), 3, 24); });
      } else if (key === 'rasio') {
        list.forEach((o) => { if (o.tipe === 'star') o.rasio = clamp(v / 100, 0.1, 0.95); });
      } else if (key === 'sw') {
        if (dok().gaya === 'line' && st.aturan.kunciStroke) return;
        list.forEach((o) => { if (o.stroke) o.sw = r4(clamp(v, 0.1, 20)); });
      }
    }, { tanpaUndo });
  }

  /* --- rata & sebar --- */
  function rata(jenis) {
    const list = terpilih(); if (!list.length) return;
    const S = dok().ukuran;
    ubah(() => {
      const ref = list.length === 1 ? { x: 0, y: 0, w: S, h: S } : batasGabung(list);
      if (jenis === 'sebarH' || jenis === 'sebarV') {
        const h = jenis === 'sebarH';
        const urut = list.map((o) => ({ o, b: batas(o) })).sort((p, q) => (h ? p.b.x - q.b.x : p.b.y - q.b.y));
        const total = urut.reduce((t, x) => t + (h ? x.b.w : x.b.h), 0);
        const ruang = (h ? ref.w : ref.h) - total;
        const jarak = ruang / (urut.length - 1);
        let pos = h ? ref.x : ref.y;
        urut.forEach((x) => { if (h) geser(x.o, pos - x.b.x, 0); else geser(x.o, 0, pos - x.b.y); pos += (h ? x.b.w : x.b.h) + jarak; });
        return;
      }
      list.forEach((o) => {
        const b = batas(o);
        if (jenis === 'kiri') geser(o, ref.x - b.x, 0);
        if (jenis === 'kanan') geser(o, ref.x + ref.w - (b.x + b.w), 0);
        if (jenis === 'tengahH') geser(o, ref.x + ref.w / 2 - (b.x + b.w / 2), 0);
        if (jenis === 'atas') geser(o, 0, ref.y - b.y);
        if (jenis === 'bawah') geser(o, 0, ref.y + ref.h - (b.y + b.h));
        if (jenis === 'tengahV') geser(o, 0, ref.y + ref.h / 2 - (b.y + b.h / 2));
      });
    });
  }

  /* ===================== INTERAKSI KANVAS ===================== */
  const langkah = () => (st.snap ? atr().snap : 0);
  const snapTitik = (x, y) => (st.snap ? [r4(snapV(x, atr().snap)), r4(snapV(y, atr().snap))] : [r4(x), r4(y)]);

  function gantiAlat(t) {
    if (st.pena) selesaiPena();
    if (t !== 'pilih' && st.edit) st.edit = null;
    st.tool = t;
    if (BENTUK.some((b) => b[0] === t)) st.alatBentuk = t;
    st.el.svg.style.cursor = t === 'tangan' ? 'grab' : t === 'pilih' ? 'default' : 'crosshair';
    tutupMenu();
    renderToolbar(); renderKanvas();
  }

  /** Ambil salinan objek terpilih (untuk operasi seret yang selalu dihitung dari keadaan awal). */
  function potret(ids) { const m = {}; ids.forEach((id) => { const o = objById(id); if (o) m[id] = salin(o); }); return m; }
  function pulihkan(map) {
    const d = dok();
    Object.keys(map).forEach((id) => { const i = d.objek.findIndex((o) => o.id === id); if (i >= 0) d.objek[i] = salin(map[id]); });
  }

  /** Magnet geser: tepi/tengah objek lain & artboard (garis bantu merah), selain itu grid. */
  function magnetGeser(b0, dx, dy, kecuali) {
    const d = dok(), S = d.ukuran, tol = 5 / st.z;
    st.panduan = [];
    if (!st.snap) return [dx, dy];
    const lain = d.objek.filter((o) => !o.hidden && !kecuali.includes(o.id)).map(batas);
    const kx = [0, S / 2, S], ky = [0, S / 2, S];
    lain.forEach((b) => { kx.push(b.x, b.x + b.w / 2, b.x + b.w); ky.push(b.y, b.y + b.h / 2, b.y + b.h); });
    const cari = (tepi, kandidat) => {
      let best = null;
      tepi.forEach((e) => kandidat.forEach((c) => { const j = Math.abs(e - c); if (j <= tol && (!best || j < best.j)) best = { j, geser: c - e, garis: c }; }));
      return best;
    };
    const ex = [b0.x + dx, b0.x + b0.w / 2 + dx, b0.x + b0.w + dx];
    const ey = [b0.y + dy, b0.y + b0.h / 2 + dy, b0.y + b0.h + dy];
    const bx = cari(ex, kx), by = cari(ey, ky);
    const step = atr().snap;
    if (bx) dx += bx.geser; else dx = r4(snapV(b0.x + dx, step) - b0.x);
    if (by) dy += by.geser; else dy = r4(snapV(b0.y + dy, step) - b0.y);
    const nb = { x: b0.x + dx, y: b0.y + dy, w: b0.w, h: b0.h };
    if (bx) { const y1 = Math.min(0, nb.y), y2 = Math.max(S, nb.y + nb.h); st.panduan.push({ x: bx.garis, y1, y2 }); }
    if (by) { const x1 = Math.min(0, nb.x), x2 = Math.max(S, nb.x + nb.w); st.panduan.push({ y: by.garis, x1, x2 }); }
    return [dx, dy];
  }

  function onPointerDown(e) {
    if (!dok()) return;
    tutupMenu();
    if (document.activeElement && document.activeElement.blur && st.el.root.contains(document.activeElement)) document.activeElement.blur();
    const [sx, sy] = posKanvas(e);
    const [x, y] = keDok(sx, sy);
    // klik dua kali dideteksi sendiri (event dblclick tidak muncul karena kanvas digambar ulang tiap klik)
    const kini = performance.now(), lalu = st.klikTerakhir;
    const dobel = e.button === 0 && lalu && kini - lalu.t < 400 && Math.hypot(sx - lalu.x, sy - lalu.y) < 6;
    st.klikTerakhir = dobel ? null : { t: kini, x: sx, y: sy };
    if (dobel && st.tool === 'pilih' && !st.spasi) { onDblClick(e); return; }
    st.el.svg.setPointerCapture(e.pointerId);
    const geserKanvas = st.tool === 'tangan' || st.spasi || e.button === 1;
    if (geserKanvas) { st.drag = { jenis: 'pan', sx, sy, tx: st.tx, ty: st.ty }; st.el.svg.style.cursor = 'grabbing'; return; }
    if (e.button !== 0) return;
    const t = e.target;

    // --- mode edit titik ---
    if (st.edit) {
      const o = objById(st.edit.id);
      const tt = t.closest && t.closest('[data-tt]'), hd = t.closest && t.closest('[data-hd]');
      if (hd) {
        const [si, gi, k] = hd.dataset.hd.split(':');
        const g = o.sub[+si].segs[+gi];
        const lain = k === 'hi' ? g.ho : g.hi;
        const segaris = lain && g[k] && Math.abs(g[k].x * lain.y - g[k].y * lain.x) < 1e-3 * Math.hypot(g[k].x, g[k].y) * Math.hypot(lain.x, lain.y) + 1e-6;
        catatUndo();
        st.drag = { jenis: 'gagangTitik', si: +si, gi: +gi, k, cermin: !!segaris && !e.altKey };
        return;
      }
      if (tt) {
        const kunci = tt.dataset.tt;
        if (e.shiftKey) { if (st.edit.titik.has(kunci)) st.edit.titik.delete(kunci); else st.edit.titik.add(kunci); }
        else if (!st.edit.titik.has(kunci)) st.edit.titik = new Set([kunci]);
        catatUndo();
        st.drag = { jenis: 'titik', awal: [x, y], kunci, sub: salin(o.sub) };
        renderKanvas();
        return;
      }
      const kena = t.closest && t.closest('[data-id]');
      if (kena && kena.dataset.id === st.edit.id) { tambahTitikDi(o, x, y); return; }
      if (!e.shiftKey) st.edit.titik = new Set();
      st.drag = { jenis: 'marquee', marquee: { x1: sx, y1: sy, x2: sx, y2: sy }, keluarEdit: !kena };
      renderKanvas();
      return;
    }

    // --- pena ---
    if (st.tool === 'pena') { penaTekan(x, y, sx, sy); return; }

    // --- alat bentuk ---
    if (BENTUK.some((b) => b[0] === st.tool)) {
      const [px, py] = snapTitik(x, y);
      catatUndo();
      const gaya = dok().gaya;
      let o;
      if (st.tool === 'line') o = objekBaru('path', { terbuka: true, sub: [{ tutup: false, segs: [{ x: px, y: py, hi: null, ho: null }, { x: px, y: py, hi: null, ho: null }] }] }, gaya, st.aturan);
      else o = objekBaru(st.tool, { x: px, y: py, w: 0, h: 0 }, gaya, st.aturan);
      dok().objek.push(o);
      st.sel = [o.id];
      st.drag = { jenis: 'gambar', id: o.id, p0: [px, py], tipe: st.tool };
      renderKanvas();
      return;
    }

    // --- alat pilih ---
    const h = t.closest && t.closest('[data-h]');
    if (h) {
      const k = kotakSeleksi();
      const g = h.dataset.h;
      catatUndo();
      if (g.startsWith('rot-')) {
        st.drag = { jenis: 'putar', c: [k.cx, k.cy], a0: Math.atan2(y - k.cy, x - k.cx), snap: potret(st.sel), rot0: k.rot };
      } else {
        st.drag = { jenis: 'ukuran', g, k, snap: potret(st.sel) };
      }
      return;
    }
    const kena = t.closest && t.closest('[data-id]');
    if (kena) {
      const id = kena.dataset.id;
      if (e.shiftKey) { st.sel = st.sel.includes(id) ? st.sel.filter((s) => s !== id) : st.sel.concat(id); renderSemua(); return; }
      if (!st.sel.includes(id)) st.sel = [id];
      catatUndo();
      if (e.altKey) {
        const salinan = terpilih().map((o) => Object.assign(salin(o), { id: uid() }));
        dok().objek.push(...salinan);
        st.sel = salinan.map((o) => o.id);
      }
      st.drag = { jenis: 'geser', awal: [x, y], snap: potret(st.sel), b0: batasGabung(terpilih()), bergerak: false };
      renderSemua();
      return;
    }
    if (!e.shiftKey) st.sel = [];
    st.drag = { jenis: 'marquee', marquee: { x1: sx, y1: sy, x2: sx, y2: sy }, dasar: e.shiftKey ? st.sel.slice() : [] };
    renderSemua();
  }

  function onPointerMove(e) {
    if (!st || !dok()) return;
    const [sx, sy] = posKanvas(e);
    let [x, y] = keDok(sx, sy);
    const dr = st.drag;
    if (!dr) {
      if (st.tool === 'pena') {
        const p = st.pena;
        if (p) {
          p.kursor = snapTitik(x, y);
          const o = objById(p.id);
          if (o) { const f = o.sub[p.si].segs[0]; const [fx, fy] = keLayar(f.x, f.y); p.dekatAwal = o.sub[p.si].segs.length >= 2 && Math.hypot(fx - sx, fy - sy) < 8; }
          renderOverlay();
        }
        return;
      }
      const kena = e.target.closest && e.target.closest('[data-id]');
      const id = kena ? kena.dataset.id : null;
      if (id !== st.hover) { st.hover = id; renderKanvas(); }
      return;
    }
    if (dr.jenis === 'pan') { st.tx = dr.tx + sx - dr.sx; st.ty = dr.ty + sy - dr.sy; renderKanvas(); return; }
    if (dr.jenis === 'marquee') { dr.marquee.x2 = sx; dr.marquee.y2 = sy; renderOverlay(); return; }
    if (dr.jenis === 'geser') {
      let dx = x - dr.awal[0], dy = y - dr.awal[1];
      if (!dr.bergerak && Math.hypot(dx * st.z, dy * st.z) < 3) return;
      dr.bergerak = true;
      if (e.shiftKey) { if (Math.abs(dx) > Math.abs(dy)) dy = 0; else dx = 0; }
      [dx, dy] = magnetGeser(dr.b0, dx, dy, Object.keys(dr.snap));
      pulihkan(dr.snap);
      terpilih().forEach((o) => geser(o, dx, dy));
      renderKanvas(); segarkanAngka();
      return;
    }
    if (dr.jenis === 'gambar') {
      const o = objById(dr.id);
      let [px, py] = snapTitik(x, y);
      const [x0, y0] = dr.p0;
      if (dr.tipe === 'line') {
        if (e.shiftKey) {
          const ang = Math.round(Math.atan2(py - y0, px - x0) / (Math.PI / 4)) * (Math.PI / 4);
          const l = Math.hypot(px - x0, py - y0);
          [px, py] = snapTitik(x0 + Math.cos(ang) * l, y0 + Math.sin(ang) * l);
          if (Math.abs(Math.cos(ang)) > 0.01 && Math.abs(Math.sin(ang)) > 0.01) { const m = Math.max(Math.abs(px - x0), Math.abs(py - y0)); px = x0 + Math.sign(px - x0) * m; py = y0 + Math.sign(py - y0) * m; }
        }
        const s = o.sub[0].segs;
        if (e.altKey) { s[0].x = r4(2 * x0 - px); s[0].y = r4(2 * y0 - py); } else { s[0].x = x0; s[0].y = y0; }
        s[1].x = px; s[1].y = py;
      } else {
        let w = px - x0, h = py - y0;
        if (e.shiftKey) { const m = Math.max(Math.abs(w), Math.abs(h)); w = Math.sign(w || 1) * m; h = Math.sign(h || 1) * m; }
        if (e.altKey) { o.x = r4(x0 - Math.abs(w)); o.y = r4(y0 - Math.abs(h)); o.w = r4(Math.abs(w) * 2); o.h = r4(Math.abs(h) * 2); }
        else { o.x = r4(Math.min(x0, x0 + w)); o.y = r4(Math.min(y0, y0 + h)); o.w = r4(Math.abs(w)); o.h = r4(Math.abs(h)); }
      }
      renderKanvas(); segarkanAngka();
      return;
    }
    if (dr.jenis === 'ukuran') { dr.bergerak = true; seretUkuran(dr, x, y, e); renderKanvas(); segarkanAngka(); return; }
    if (dr.jenis === 'putar') {
      dr.bergerak = true;
      let delta = (Math.atan2(y - dr.c[1], x - dr.c[0]) - dr.a0) * 180 / Math.PI;
      if (e.shiftKey) { const target = Math.round((dr.rot0 + delta) / 15) * 15; delta = target - dr.rot0; }
      pulihkan(dr.snap);
      terpilih().forEach((o) => putar(o, delta, dr.c[0], dr.c[1]));
      renderKanvas(); segarkanAngka();
      return;
    }
    if (dr.jenis === 'titik') {
      dr.bergerak = true;
      const o = objById(st.edit.id);
      const [si, gi] = dr.kunci.split(':').map(Number);
      const asal = dr.sub[si].segs[gi];
      let dx = x - dr.awal[0], dy = y - dr.awal[1];
      if (e.shiftKey) { if (Math.abs(dx) > Math.abs(dy)) dy = 0; else dx = 0; }
      const [tx, ty] = snapTitik(asal.x + dx, asal.y + dy);
      dx = tx - asal.x; dy = ty - asal.y;
      o.sub = salin(dr.sub);
      st.edit.titik.forEach((k) => { const [a, b] = k.split(':').map(Number); const g = o.sub[a] && o.sub[a].segs[b]; if (g) { g.x = r4(g.x + dx); g.y = r4(g.y + dy); } });
      renderKanvas();
      return;
    }
    if (dr.jenis === 'gagangTitik') {
      dr.bergerak = true;
      const o = objById(st.edit.id);
      const g = o.sub[dr.si].segs[dr.gi];
      const [hx, hy] = snapTitik(x, y);
      const v = { x: r4(hx - g.x), y: r4(hy - g.y) };
      g[dr.k] = Math.hypot(v.x, v.y) < 1e-3 ? null : v;
      const lawan = dr.k === 'hi' ? 'ho' : 'hi';
      if (dr.cermin && g[lawan] && g[dr.k]) {
        const l = Math.hypot(g[lawan].x, g[lawan].y), m = Math.hypot(v.x, v.y);
        g[lawan] = { x: r4(-v.x / m * l), y: r4(-v.y / m * l) };
      }
      renderKanvas();
      return;
    }
    if (dr.jenis === 'pena') {
      const o = objById(st.pena.id);
      const g = o.sub[st.pena.si].segs[dr.gi];
      const [hx, hy] = snapTitik(x, y);
      const v = { x: r4(hx - g.x), y: r4(hy - g.y) };
      if (Math.hypot(v.x, v.y) * st.z < 3) { g.ho = null; g.hi = dr.awalTutup ? g.hi : null; }
      else if (dr.awalTutup) { g.hi = { x: -v.x, y: -v.y }; }
      else { g.ho = v; g.hi = { x: -v.x, y: -v.y }; }
      st.pena.tarik = true;
      renderKanvas();
    }
  }

  function seretUkuran(dr, x, y, e) {
    const k = dr.k, g = dr.g;
    const hx = g.includes('e') ? 1 : g.includes('w') ? -1 : 0;
    const hy = g.includes('s') ? 1 : g.includes('n') ? -1 : 0;
    pulihkan(dr.snap);
    const list = terpilih();
    if (k.rot && list.length === 1) {
      const o = list[0], L = k.lokal, rad = -k.rot * Math.PI / 180;
      let [px, py] = putarTitik(x, y, k.cx, k.cy, rad);
      let x1 = L.x, x2 = L.x + L.w, y1 = L.y, y2 = L.y + L.h;
      if (e.altKey) {
        if (hx) { const dx = Math.abs(px - k.cx); x1 = k.cx - dx; x2 = k.cx + dx; }
        if (hy) { const dy = Math.abs(py - k.cy); y1 = k.cy - dy; y2 = k.cy + dy; }
      } else {
        if (hx === 1) x2 = px; if (hx === -1) x1 = px;
        if (hy === 1) y2 = py; if (hy === -1) y1 = py;
      }
      let w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
      if (e.shiftKey && L.w && L.h) { const s = Math.max(w / L.w, h / L.h); w = L.w * s; h = L.h * s; if (!hx) { x1 = k.cx - w / 2; x2 = k.cx + w / 2; } if (!hy) { y1 = k.cy - h / 2; y2 = k.cy + h / 2; } }
      const lcx = (x1 + x2) / 2, lcy = (y1 + y2) / 2;
      const [wcx, wcy] = putarTitik(lcx, lcy, k.cx, k.cy, -rad);
      o.w = r4(Math.max(0.01, w)); o.h = r4(Math.max(0.01, h));
      o.x = r4(wcx - o.w / 2); o.y = r4(wcy - o.h / 2);
      return;
    }
    const b = k.lokal;
    [x, y] = snapTitik(x, y);
    let ax = hx === 1 ? b.x : b.x + b.w, ay = hy === 1 ? b.y : b.y + b.h;
    const gx = hx === 1 ? b.x + b.w : b.x, gy = hy === 1 ? b.y + b.h : b.y;
    if (e.altKey) { ax = b.x + b.w / 2; ay = b.y + b.h / 2; }
    let sx = hx ? (x - ax) / ((e.altKey ? gx - ax : gx - ax) || 1e-6) : 1;
    let sy = hy ? (y - ay) / ((gy - ay) || 1e-6) : 1;
    if (e.shiftKey || st.kunciRasio) {
      if (hx && hy) { const s = Math.max(Math.abs(sx), Math.abs(sy)); sx = Math.sign(sx || 1) * s; sy = Math.sign(sy || 1) * s; }
      else if (hx) { sy = Math.abs(sx); ay = b.y + b.h / 2; }
      else if (hy) { sx = Math.abs(sy); ax = b.x + b.w / 2; }
    }
    if (Math.abs(sx) < 1e-3) sx = 1e-3 * Math.sign(sx || 1);
    if (Math.abs(sy) < 1e-3) sy = 1e-3 * Math.sign(sy || 1);
    list.forEach((o) => skala(o, ax, ay, sx, sy));
  }

  function onPointerUp(e) {
    if (!st) return;
    const dr = st.drag;
    st.drag = null;
    st.panduan = [];
    if (!dr) return;
    if (dr.jenis === 'pan') { st.el.svg.style.cursor = st.tool === 'tangan' ? 'grab' : st.tool === 'pilih' ? 'default' : 'crosshair'; return; }
    if (dr.jenis === 'marquee') {
      const m = dr.marquee;
      const [x1, y1] = keDok(Math.min(m.x1, m.x2), Math.min(m.y1, m.y2));
      const [x2, y2] = keDok(Math.max(m.x1, m.x2), Math.max(m.y1, m.y2));
      const kecil = Math.abs(m.x2 - m.x1) < 3 && Math.abs(m.y2 - m.y1) < 3;
      if (st.edit) {
        if (kecil && dr.keluarEdit) { st.edit = null; }
        else if (!kecil) {
          const o = objById(st.edit.id);
          o.sub.forEach((s, si) => s.segs.forEach((g, gi) => { if (g.x >= x1 && g.x <= x2 && g.y >= y1 && g.y <= y2) st.edit.titik.add(si + ':' + gi); }));
        }
        renderSemua();
        return;
      }
      if (!kecil) {
        const kena = dok().objek.filter((o) => !o.hidden && !o.locked).filter((o) => { const b = batas(o); return b.x <= x2 && b.x + b.w >= x1 && b.y <= y2 && b.y + b.h >= y1; }).map((o) => o.id);
        st.sel = Array.from(new Set((dr.dasar || []).concat(kena)));
      }
      renderSemua();
      return;
    }
    if (dr.jenis === 'gambar') {
      const o = objById(dr.id);
      const S = dok().ukuran, def = r4(snapV(S / 3, atr().snap) || S / 3);
      if (dr.tipe === 'line') {
        const s = o.sub[0].segs;
        if (Math.hypot(s[1].x - s[0].x, s[1].y - s[0].y) < atr().snap) { s[1].x = r4(s[0].x + def); s[1].y = s[0].y; }
      } else if (o.w < atr().snap && o.h < atr().snap) { o.w = def; o.h = def; }
      else { o.w = Math.max(o.w, atr().snap); o.h = Math.max(o.h, atr().snap); }
      gantiAlat('pilih');
      st.sel = [o.id];
      setelahUbah();
      return;
    }
    if (['titik', 'gagangTitik', 'ukuran', 'putar'].includes(dr.jenis) && !dr.bergerak) { ic().undo.pop(); renderSemua(); return; }
    if (dr.jenis === 'geser' && !dr.bergerak) {
      const it = ic(); it.undo.pop();
      renderSemua();
      return;
    }
    if (dr.jenis === 'pena') { st.pena.tarik = false; if (dr.tutup) selesaiPena(); renderSemua(); return; }
    setelahUbah();
  }

  function onDblClick(e) {
    if (!dok() || st.tool !== 'pilih') return;
    const el = document.elementFromPoint(e.clientX, e.clientY) || e.target;
    const tt = el.closest && el.closest('[data-tt]');
    if (st.edit && tt) {
      const [si, gi] = tt.dataset.tt.split(':').map(Number);
      ubah(() => {
        const o = objById(st.edit.id), s = o.sub[si], g = s.segs[gi], n = s.segs.length;
        if (g.hi || g.ho) { g.hi = null; g.ho = null; return; }
        const prev = s.segs[(gi - 1 + n) % n], next = s.segs[(gi + 1) % n];
        if (!s.tutup && (gi === 0 || gi === n - 1)) return;
        const dx = next.x - prev.x, dy = next.y - prev.y, l = Math.hypot(dx, dy) || 1;
        const k1 = Math.hypot(g.x - prev.x, g.y - prev.y) / 3, k2 = Math.hypot(next.x - g.x, next.y - g.y) / 3;
        g.hi = { x: r4(-dx / l * k1), y: r4(-dy / l * k1) }; g.ho = { x: r4(dx / l * k2), y: r4(dy / l * k2) };
      });
      return;
    }
    const kena = el.closest && el.closest('[data-id]');
    if (kena) masukEdit(kena.dataset.id);
  }
  function masukEdit(id) {
    const o = objById(id); if (!o || o.locked) return;
    if (parametrik(o)) {
      ubah((d) => { const i = d.objek.findIndex((x) => x.id === id); d.objek[i] = keVektor(o); });
    }
    st.sel = [id];
    st.edit = { id, titik: new Set() };
    renderSemua();
  }
  function tambahTitikDi(o, x, y) {
    const it = itemDari(o);
    const loc = it.getNearestLocation(new window.paper.Point(x, y));
    if (!loc || loc.distance * st.z > 8) return;
    catatUndo();
    P(() => {
      const path = loc.path || loc.curve.path;
      if (path.divideAt) path.divideAt(loc); else loc.curve.divideAtTime(loc.time);
    });
    o.sub = subDariItem(it);
    setelahUbah();
  }

  /* --- pena --- */
  function penaTekan(x, y, sx, sy) {
    const [px, py] = snapTitik(x, y);
    const d = dok();
    if (!st.pena || !objById(st.pena.id)) {
      catatUndo();
      const line = d.gaya === 'line';
      const o = objekBaru('path', { terbuka: line, sub: [{ tutup: false, segs: [{ x: px, y: py, hi: null, ho: null }] }] }, d.gaya, st.aturan);
      if (!line) { o.fill = st.aturan[d.gaya].warna[0]; o.stroke = null; }
      d.objek.push(o);
      st.sel = [o.id];
      st.pena = { id: o.id, si: 0, kursor: [px, py] };
      st.drag = { jenis: 'pena', gi: 0 };
      renderSemua({ kanan: false });
      return;
    }
    const o = objById(st.pena.id), s = o.sub[st.pena.si];
    const [fx, fy] = keLayar(s.segs[0].x, s.segs[0].y);
    catatUndo();
    if (s.segs.length >= 2 && Math.hypot(fx - sx, fy - sy) < 8) {
      s.tutup = true;
      st.drag = { jenis: 'pena', gi: 0, awalTutup: true, tutup: true };
      renderKanvas();
      return;
    }
    s.segs.push({ x: px, y: py, hi: null, ho: null });
    st.drag = { jenis: 'pena', gi: s.segs.length - 1 };
    renderKanvas();
  }
  function selesaiPena() {
    const p = st.pena; st.pena = null;
    if (!p) return;
    const o = objById(p.id);
    if (o) {
      const s = o.sub[p.si];
      if (s.segs.length < 2) dok().objek = dok().objek.filter((x) => x.id !== o.id);
      else if (!s.tutup && o.fill && !o.stroke) { o.stroke = o.fill; o.fill = null; o.sw = atr().stroke; }
    }
    st.tool = 'pilih';
    st.el.svg.style.cursor = 'default';
    setelahUbah();
  }

  function onWheel(e) {
    if (!dok()) return;
    e.preventDefault();
    const [sx, sy] = posKanvas(e);
    if (e.ctrlKey || e.metaKey) aturZoom(st.z * Math.exp(-e.deltaY * 0.01), sx, sy);
    else { st.tx -= e.deltaX; st.ty -= e.deltaY; renderKanvas(); }
  }

  /* ===================== PERINTAH ===================== */
  function hapusSel() {
    if (st.edit && st.edit.titik.size) {
      ubah(() => {
        const o = objById(st.edit.id);
        const buang = {}; st.edit.titik.forEach((k) => { const [a, b] = k.split(':').map(Number); (buang[a] = buang[a] || []).push(b); });
        o.sub.forEach((s, si) => { if (buang[si]) s.segs = s.segs.filter((_, gi) => !buang[si].includes(gi)); });
        o.sub = o.sub.filter((s) => s.segs.length >= 2);
        st.edit.titik = new Set();
        if (!o.sub.length) { dok().objek = dok().objek.filter((x) => x.id !== o.id); st.edit = null; }
      });
      return;
    }
    if (!st.sel.length) return;
    ubah((d) => { d.objek = d.objek.filter((o) => !st.sel.includes(o.id)); });
    st.sel = []; renderSemua();
  }
  function duplikatSel(jarak) {
    const list = terpilih(); if (!list.length) return;
    const off = jarak == null ? atr().snap * 4 : jarak;
    ubah((d) => {
      const baru = list.map((o) => { const c = Object.assign(salin(o), { id: uid() }); geser(c, off, off); return c; });
      const atas = Math.max(...list.map((o) => d.objek.indexOf(o)));
      d.objek.splice(atas + 1, 0, ...baru);
      st.sel = baru.map((o) => o.id);
    });
  }
  function salinSel(potong) {
    const list = terpilih(); if (!list.length) return;
    st.clip = salin(list);
    try { window.__klStudioClip = st.clip; } catch (e) {}
    if (potong) hapusSel();
    toast(potong ? 'Dipotong' : 'Disalin');
  }
  function tempel() {
    const clip = st.clip || window.__klStudioClip;
    if (!clip || !clip.length) return;
    ubah((d) => {
      const baru = clip.map((o) => Object.assign(salin(o), { id: uid() }));
      d.objek.push(...baru);
      st.sel = baru.map((o) => o.id);
    });
  }
  function susun(arah) {
    if (!st.sel.length) return;
    ubah((d) => {
      const pilih = d.objek.filter((o) => st.sel.includes(o.id));
      const sisa = d.objek.filter((o) => !st.sel.includes(o.id));
      if (arah === 'depan') { d.objek = sisa.concat(pilih); return; }
      if (arah === 'belakang') { d.objek = pilih.concat(sisa); return; }
      const arr = d.objek;
      if (arah === 'naik') { for (let i = arr.length - 2; i >= 0; i--) if (st.sel.includes(arr[i].id) && !st.sel.includes(arr[i + 1].id)) { [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; } }
      if (arah === 'turun') { for (let i = 1; i < arr.length; i++) if (st.sel.includes(arr[i].id) && !st.sel.includes(arr[i - 1].id)) { [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]]; } }
    });
  }
  function cerminSel(arah) {
    const list = terpilih(); if (!list.length) return;
    const b = batasGabung(list), c = arah === 'h' ? b.x + b.w / 2 : b.y + b.h / 2;
    ubah((d) => { list.forEach((o) => { const i = d.objek.indexOf(o); d.objek[i] = cermin(o, arah, c); }); });
  }
  function putar90() {
    const list = terpilih(); if (!list.length) return;
    const b = batasGabung(list);
    ubah(() => list.forEach((o) => putar(o, 90, b.x + b.w / 2, b.y + b.h / 2)));
  }
  function nudge(dx, dy) {
    if (st.edit && st.edit.titik.size) {
      ubah(() => { const o = objById(st.edit.id); st.edit.titik.forEach((k) => { const [a, b] = k.split(':').map(Number); const g = o.sub[a].segs[b]; g.x = r4(g.x + dx); g.y = r4(g.y + dy); }); }, { tanpaKanan: true });
      return;
    }
    if (!st.sel.length) return;
    ubah(() => terpilih().forEach((o) => geser(o, dx, dy)), { tanpaKanan: true });
    segarkanAngka();
  }
  function booleanSel(op) {
    const list = terpilih().filter((o) => !o.hidden);
    if (list.length < 2) { toast('Pilih minimal 2 bentuk untuk digabungkan.', true); return; }
    try {
      ubah((d) => {
        const urut = d.objek.filter((o) => list.includes(o));
        const hasil = boolean(urut, op);
        const pos = d.objek.indexOf(urut[urut.length - 1]);
        d.objek.splice(pos + 1, 0, hasil);
        d.objek = d.objek.filter((o) => !list.includes(o));
        st.sel = [hasil.id];
      });
    } catch (e) { toast('Gagal menggabungkan bentuk: ' + e.message, true); }
  }
  function outlineSel() {
    const list = terpilih().filter((o) => o.stroke && o.sw > 0);
    if (!list.length) { toast('Pilih objek yang memakai garis (stroke).', true); return; }
    try {
      ubah((d) => {
        const ids = [];
        list.forEach((o) => { const i = d.objek.indexOf(o); const hasil = outlineGaris(o); d.objek.splice(i, 1, ...hasil); ids.push(...hasil.map((x) => x.id)); });
        st.sel = ids;
      });
      toast('Garis diubah menjadi bentuk.');
    } catch (e) { toast(e.message, true); }
  }
  function keVektorSel() {
    const list = terpilih().filter(parametrik);
    if (!list.length) return;
    ubah((d) => list.forEach((o) => { const i = d.objek.indexOf(o); d.objek[i] = keVektor(o); }));
  }
  function toggleSel(k) {
    const list = terpilih(); if (!list.length) return;
    const nilai = !list.every((o) => o[k]);
    ubah(() => list.forEach((o) => { o[k] = nilai; }));
    if (nilai) { st.sel = []; renderSemua(); }
  }

  /* ===================== KEYBOARD ===================== */
  function onKeyDown(e) {
    if (!st || document.querySelector('.ks-dlg-bg')) return;
    const tag = (e.target && e.target.tagName) || '';
    const mengetik = /INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable);
    const mod = e.ctrlKey || e.metaKey;
    const k = e.key;
    if (mengetik) {
      if (k === 'Escape') e.target.blur();
      return;
    }
    if (!st.el.root.isConnected) return;
    let ditangani = true;
    if (k === ' ') { if (!st.spasi) { st.spasi = true; st.el.svg.style.cursor = 'grab'; } }
    else if (mod && (k === 'z' || k === 'Z')) { if (e.shiftKey) ulangi(); else urungkan(); }
    else if (mod && (k === 'y' || k === 'Y')) ulangi();
    else if (mod && e.altKey && /^Key[USIX]$/.test(e.code || '')) booleanSel({ KeyU: 'gabung', KeyS: 'kurangi', KeyI: 'potong', KeyX: 'sisakan' }[e.code]);
    else if (mod && !e.altKey && e.code === 'KeyS') aksi('simpan');
    else if (mod && e.shiftKey && (e.code === 'KeyO')) outlineSel();
    else if (mod && e.shiftKey && (e.code === 'KeyH')) toggleSel('hidden');
    else if (mod && e.shiftKey && (e.code === 'KeyL')) toggleSel('locked');
    else if (mod && (k === 'd' || k === 'D')) duplikatSel();
    else if (mod && (k === 'c' || k === 'C')) salinSel(false);
    else if (mod && (k === 'x' || k === 'X')) salinSel(true);
    else if (mod && (k === 'v' || k === 'V')) { ditangani = false; st.tempelInternal = true; setTimeout(() => { if (st && st.tempelInternal) { st.tempelInternal = false; tempel(); } }, 60); }
    else if (mod && (k === 'a' || k === 'A')) {
      if (st.edit) { const o = objById(st.edit.id); st.edit.titik = new Set(); o.sub.forEach((s, si) => s.segs.forEach((g, gi) => st.edit.titik.add(si + ':' + gi))); }
      else st.sel = dok() ? dok().objek.filter((o) => !o.hidden && !o.locked).map((o) => o.id) : [];
      renderSemua();
    }
    else if (mod && e.code === 'BracketRight') susun(e.shiftKey ? 'depan' : 'naik');
    else if (mod && e.code === 'BracketLeft') susun(e.shiftKey ? 'belakang' : 'turun');
    else if (mod && (k === '=' || k === '+')) aturZoom(st.z * 1.25);
    else if (mod && k === '-') aturZoom(st.z / 1.25);
    else if (mod && k === "'") aksi('grid');
    else if (mod) ditangani = false;
    else if (e.altKey && /^Key[AHDWVS]$/.test(e.code)) rata({ KeyA: 'kiri', KeyH: 'tengahH', KeyD: 'kanan', KeyW: 'atas', KeyV: 'tengahV', KeyS: 'bawah' }[e.code]);
    else if (e.shiftKey && e.code === 'KeyH') cerminSel('h');
    else if (e.shiftKey && e.code === 'KeyV') cerminSel('v');
    else if (e.shiftKey && e.code === 'Digit0') aturZoom(1);
    else if (e.shiftKey && e.code === 'Digit1') { pasKanvas(); renderKanvas(); renderZoom(); }
    else if (e.shiftKey && e.code === 'Digit2') zoomKeSeleksi();
    else if (k === '?' ) aksi('pintasan');
    else if (k === 'Delete' || k === 'Backspace') hapusSel();
    else if (k === 'Escape') {
      if (st.menu) tutupMenu();
      else if (st.pena) selesaiPena();
      else if (st.edit) { st.edit = null; renderSemua(); }
      else if (st.tool !== 'pilih') gantiAlat('pilih');
      else if (st.sel.length) { st.sel = []; renderSemua(); }
    }
    else if (k === 'Enter') {
      if (st.pena) selesaiPena();
      else if (st.edit) { st.edit = null; renderSemua(); }
      else if (st.sel.length === 1) masukEdit(st.sel[0]);
    }
    else if (k.startsWith('Arrow')) {
      const s = atr().snap * (e.shiftKey ? 4 : 1);
      nudge(k === 'ArrowLeft' ? -s : k === 'ArrowRight' ? s : 0, k === 'ArrowUp' ? -s : k === 'ArrowDown' ? s : 0);
    }
    else if (k === 'v' || k === 'V') gantiAlat('pilih');
    else if (k === 'h' || k === 'H') gantiAlat('tangan');
    else if (k === 'r' || k === 'R') gantiAlat('rect');
    else if (k === 'o' || k === 'O') gantiAlat('ellipse');
    else if (k === 'l' || k === 'L') gantiAlat('line');
    else if (k === 'y' || k === 'Y') gantiAlat('polygon');
    else if (k === 's' || k === 'S') gantiAlat('star');
    else if (k === 'p' || k === 'P') gantiAlat('pena');
    else if (k === 'k' || k === 'K') aksi('keyline');
    else ditangani = false;
    if (ditangani) e.preventDefault();
  }
  function onKeyUp(e) {
    if (!st) return;
    if (e.key === ' ') { st.spasi = false; st.el.svg.style.cursor = st.tool === 'tangan' ? 'grab' : st.tool === 'pilih' ? 'default' : 'crosshair'; }
  }
  function onPaste(e) {
    if (!st || !dok()) return;
    const tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA/.test(tag)) return;
    const teks = e.clipboardData && e.clipboardData.getData('text/plain');
    if (teks && /<svg[\s>]/i.test(teks)) {
      e.preventDefault();
      st.tempelInternal = false;
      try {
        const objek = imporSvg(teks, dok().gaya, st.aturan);
        ubah((d) => { d.objek.push(...objek); st.sel = objek.map((o) => o.id); });
        toast(`${objek.length} bentuk ditempel dari SVG.`);
      } catch (err) { toast(err.message, true); }
    }
  }
  function zoomKeSeleksi() {
    const list = terpilih(); if (!list.length) return;
    const b = batasGabung(list), r = st.el.svg.getBoundingClientRect();
    st.z = clamp(Math.min((r.width - 160) / Math.max(b.w, 0.5), (r.height - 200) / Math.max(b.h, 0.5)), 1, 400);
    st.tx = r.width / 2 - (b.x + b.w / 2) * st.z; st.ty = r.height / 2 - (b.y + b.h / 2) * st.z;
    renderKanvas(); renderZoom();
  }

  /* ===================== DAFTAR ICON, DRAF & SIMPAN ===================== */
  const stem = (n) => String(n || '').replace(/\.svg$/i, '');
  function gayaDariKategori(k) {
    const m = /\((line|glyph|flat)\)/i.exec(k || '');
    return m ? m[1].toLowerCase() : null;
  }
  function entriIcon(p) {
    return Object.assign({ key: uid(), file_id: '', namaFile: '', dok: null, mentah: '', simpan: '', asal: 'baru', undo: [], redo: [] }, p);
  }
  function usulNama() {
    const pr = st.opts.proyek;
    const nomor = st.icons.reduce((m, it) => { const n = parseInt(String(it.namaFile).trim(), 10); return isFinite(n) ? Math.max(m, n) : m; }, 0) + 1;
    if (!pr) return `icon ${nomor}`;
    const dasar = String(pr.kategori || 'icon').replace(/[​-‍﻿]/g, '').replace(/\([^)]*\)/g, '').trim().toLowerCase();
    return [nomor, dasar, st.gaya, String(pr.desainer || '').trim().toLowerCase()].filter(Boolean).join(' ').replace(/\s+/g, ' ');
  }
  function kunciDraf() { return st.opts.proyek ? 'kl_studio_draf_' + st.opts.proyek.id : 'kl_studio_bebas'; }
  let drafTimer = null;
  function jadwalDraf() { clearTimeout(drafTimer); drafTimer = setTimeout(simpanDraf, 700); }
  function simpanDraf() {
    if (!st) return;
    try {
      const isi = st.opts.proyek
        ? st.icons.filter((it) => it.dok && kotor(it)).map((it) => ({ file_id: it.file_id, namaFile: it.namaFile, dok: it.dok }))
        : st.icons.filter((it) => it.dok).map((it) => ({ namaFile: it.namaFile, dok: it.dok }));
      if (isi.length) localStorage.setItem(kunciDraf(), JSON.stringify(isi)); else localStorage.removeItem(kunciDraf());
    } catch (e) { /* penyimpanan perangkat penuh / diblokir */ }
  }
  function bacaDraf() { try { const v = JSON.parse(localStorage.getItem(kunciDraf())); return Array.isArray(v) ? v : []; } catch (e) { return []; } }

  function siapkanDok(it) {
    if (it.dok || !it.mentah) return;
    try {
      const objek = imporSvg(it.mentah, st.gaya, st.aturan);
      it.dok = { v: 1, gaya: st.gaya, ukuran: st.aturan[st.gaya].ukuran, objek };
    } catch (e) {
      it.dok = { v: 1, gaya: st.gaya, ukuran: st.aturan[st.gaya].ukuran, objek: [] };
      toast('File ini tidak bisa diubah jadi vektor: ' + e.message, true);
    }
    it.simpan = kunciSimpan(it);
  }
  function pilihIcon(i) {
    if (st.pena) selesaiPena();
    st.edit = null; st.sel = []; st.hover = null;
    st.aktif = i;
    const it = ic();
    if (it) siapkanDok(it);
    const r = st.el.svg.getBoundingClientRect();
    if (r.width) { pasKanvas(); st.perluPas = false; } else st.perluPas = true;
    renderSemua();
  }
  function iconBaru(gaya) {
    const g = gaya || st.gaya;
    const it = entriIcon({ namaFile: '', dok: null });
    st.icons.push(it);
    it.dok = { v: 1, gaya: g, ukuran: st.aturan[g].ukuran, objek: [] };
    it.namaFile = usulNama();
    it.simpan = '';
    pilihIcon(st.icons.length - 1);
    jadwalDraf();
  }
  async function imporFile(files) {
    let n = 0;
    for (const f of files) {
      try {
        const teks = await f.text();
        const objek = imporSvg(teks, st.gaya, st.aturan);
        const it = entriIcon({ namaFile: st.opts.proyek ? usulNama() : stem(f.name), dok: { v: 1, gaya: st.gaya, ukuran: st.aturan[st.gaya].ukuran, objek } });
        st.icons.push(it); n++;
      } catch (e) { toast(`${f.name}: ${e.message}`, true); }
    }
    if (n) { pilihIcon(st.icons.length - 1); jadwalDraf(); toast(`${n} file SVG diimpor. Periksa hasilnya sebelum disimpan.`); }
  }

  async function simpan() {
    const it = ic(); if (!it || st.menyimpan) return;
    const hasil = hasilPeriksa();
    const err = hasil.filter((x) => x.level === 'error'), warn = hasil.filter((x) => x.level === 'warn');
    if (err.length) { st.tabKanan = 'periksa'; renderKanan(); toast(`Perbaiki dulu ${err.length} masalah (lihat tab Periksa).`, true); return; }
    if (warn.length) {
      const ok = await konfirmasi('Ada peringatan', `${warn.length} peringatan:\n\n${warn.slice(0, 5).map((w) => '• ' + w.teks).join('\n')}${warn.length > 5 ? '\n…' : ''}\n\nTetap ${st.opts.proyek ? 'simpan ke Drive' : 'unduh'}?`, st.opts.proyek ? 'Simpan' : 'Unduh');
      if (!ok) { st.tabKanan = 'periksa'; renderKanan(); return; }
    }
    let svg;
    try { svg = eksporSvg(it.dok, st.aturan); } catch (e) { toast('Gagal membuat SVG: ' + e.message, true); return; }
    if (!st.opts.proyek) { unduh(it.namaFile, svg); return; }
    st.menyimpan = true; renderSubjudul();
    st.el.btnSimpan.innerHTML = `${IKON.awan}<span>Menyimpan…</span>`;
    try {
      const res = await st.opts.api('studio_simpan', { file_name: it.namaFile + '.svg', svg, sumber: JSON.stringify(it.dok), file_id: it.file_id || '' });
      if (!res || res.status !== 'success' || !res.file) throw new Error((res && res.message) || 'Gagal menyimpan ke Drive.');
      it.file_id = res.file.id;
      it.namaFile = stem(res.file.name);
      it.asal = 'studio';
      it.simpan = kunciSimpan(it);
      simpanDraf();
      toast('Tersimpan ke folder Drive proyek ✓');
      if (st.opts.onSimpan) try { st.opts.onSimpan(res.file); } catch (e) {}
    } catch (e) {
      toast(e.message || 'Gagal menyimpan ke Drive.', true);
    } finally {
      if (st) { st.menyimpan = false; renderSemua(); }
    }
  }
  function unduh(nama, svg) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    a.download = (nama || 'icon') + '.svg';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast('SVG diunduh.');
  }

  function pilihGaya(judul) {
    return new Promise((ok) => {
      const bg = document.createElement('div');
      bg.className = 'ks-dlg-bg';
      const contoh = { line: '<path d="M8 10a4 4 0 018 0v4l2 2H6l2-2z" stroke="#1e1e1e" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 19h3" stroke="#1e1e1e" stroke-width="1.5" stroke-linecap="round"/>', glyph: '<path d="M8 10a4 4 0 018 0v4l2 2H6l2-2z" fill="#1e1e1e"/><circle cx="12" cy="19" r="1.6" fill="#1e1e1e"/>', flat: '<path d="M8 10a4 4 0 018 0v4l2 2H6l2-2z" fill="#F59E0B"/><path d="M6 16h12" stroke="#B45309" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="19" r="1.6" fill="#2563EB"/>' };
      bg.innerHTML = `<div class="ks-dlg"><h3>${esc(judul || 'Pilih gaya icon')}</h3><p>Aturan (ukuran artboard, tebal garis, palet) mengikuti gaya yang dipilih.</p>
        <div class="ks-gaya">${['line', 'glyph', 'flat'].map((g) => `<button data-g="${g}"><svg viewBox="0 0 24 24">${contoh[g]}</svg>${NAMA_GAYA[g]}<span class="ks-note">${st.aturan[g].ukuran}×${st.aturan[g].ukuran}</span></button>`).join('')}</div>
        <div class="ks-act"><button class="ks-btn sek" data-g="">Batal</button></div></div>`;
      bg.addEventListener('click', (e) => { const b = e.target.closest('[data-g]'); if (!b && e.target !== bg) return; bg.remove(); ok(b ? b.dataset.g || null : null); });
      document.body.appendChild(bg);
    });
  }

  function dialogPintasan() {
    const daftar = [
      ['Pilih / Tangan', 'V / H'], ['Persegi / Elips / Garis', 'R / O / L'], ['Poligon / Bintang / Pena', 'Y / S / P'],
      ['Geser kanvas', 'Spasi + seret'], ['Zoom', 'Ctrl + scroll · Ctrl + / −'], ['Pas layar / 100% / ke seleksi', 'Shift+1 / Shift+0 / Shift+2'],
      ['Urungkan / Ulangi', 'Ctrl+Z / Ctrl+Shift+Z'], ['Duplikat', 'Ctrl+D (Alt + seret)'], ['Salin / Potong / Tempel', 'Ctrl+C / X / V'],
      ['Hapus', 'Delete'], ['Geser halus', 'Panah (Shift = 4×)'], ['Edit titik', 'Enter / klik dua kali'],
      ['Sudut ↔ kurva (edit titik)', 'Klik dua kali titik'], ['Tambah titik', 'Klik pada garis saat edit titik'],
      ['Gambar persegi / dari tengah', 'Shift / Alt saat menyeret'], ['Putar per 15°', 'Shift saat memutar'],
      ['Gabung / Kurangi / Irisan / Beda', 'Ctrl+Alt+U / S / I / X'], ['Garis → bentuk', 'Ctrl+Shift+O'],
      ['Cermin H / V', 'Shift+H / Shift+V'], ['Rata kiri/tengah/kanan', 'Alt+A / H / D'], ['Rata atas/tengah/bawah', 'Alt+W / V / S'],
      ['Naik / turun layer', 'Ctrl+] / Ctrl+['], ['Paling depan / belakang', 'Ctrl+Shift+] / ['], ['Sembunyikan / kunci', 'Ctrl+Shift+H / L'],
      ['Keyline / grid', 'K / Ctrl+\''], ['Simpan', 'Ctrl+S'], ['Tempel kode SVG', 'Ctrl+V (teks <svg>)']
    ];
    const bg = document.createElement('div');
    bg.className = 'ks-dlg-bg';
    bg.innerHTML = `<div class="ks-dlg" style="width:min(520px,100%)"><h3>Pintasan keyboard</h3><div class="ks-kbdlist">${daftar.map(([a, b]) => `<span>${esc(a)}</span><kbd>${esc(b)}</kbd>`).join('')}</div><div class="ks-act"><button class="ks-btn pri">Tutup</button></div></div>`;
    bg.addEventListener('click', (e) => { if (e.target === bg || e.target.closest('button')) bg.remove(); });
    document.body.appendChild(bg);
  }

  /* ===================== AKSI TOMBOL ===================== */
  async function aksi(nama, el) {
    const it = ic();
    switch (nama) {
      case 'tutup': return tutup();
      case 'paksa': st.el.root.classList.add('ks-paksa'); setTimeout(() => { pasKanvas(); renderKanvas(); }, 50); return;
      case 'impor': st.el.file.value = ''; st.el.file.click(); return;
      case 'iconBaru': {
        if (st.opts.proyek) return iconBaru();
        const g = await pilihGaya(); if (g) { st.gaya = g; iconBaru(g); } return;
      }
      case 'simpan': return simpan();
      case 'menuZoom': return menu(el, [
        { t: 'Perbesar', k: 'Ctrl +', fn: () => aturZoom(st.z * 1.25) }, { t: 'Perkecil', k: 'Ctrl −', fn: () => aturZoom(st.z / 1.25) },
        { t: 'Pas ke layar', k: 'Shift+1', fn: () => { pasKanvas(); renderKanvas(); renderZoom(); } }, { t: 'Zoom ke seleksi', k: 'Shift+2', fn: zoomKeSeleksi, mati: !st.sel.length },
        '-', { t: '100%', k: 'Shift+0', fn: () => aturZoom(1) }, { t: '800%', fn: () => aturZoom(8) }, { t: '1600%', fn: () => aturZoom(16) }, { t: '3200%', fn: () => aturZoom(32) }
      ]);
      case 'menuBentuk': return menu(el, BENTUK.map(([t, n, k]) => ({ t: n, k, ikon: IKON[t], fn: () => gantiAlat(t) })), true);
      case 'menuBoolean': return menu(el, [
        { t: 'Gabung', k: 'Ctrl+Alt+U', ikon: IKON.gabung, fn: () => booleanSel('gabung') }, { t: 'Kurangi (bawah − atas)', k: 'Ctrl+Alt+S', ikon: IKON.kurangi, fn: () => booleanSel('kurangi') },
        { t: 'Irisan', k: 'Ctrl+Alt+I', ikon: IKON.potong, fn: () => booleanSel('potong') }, { t: 'Sisakan beda', k: 'Ctrl+Alt+X', ikon: IKON.sisakan, fn: () => booleanSel('sisakan') }
      ], true);
      case 'grid': st.grid = !st.grid; renderKanvas(); renderToolbar(); return;
      case 'keyline': st.keyline = !st.keyline; renderKanvas(); renderToolbar(); return;
      case 'snap': st.snap = !st.snap; renderToolbar(); toast(st.snap ? 'Magnet aktif' : 'Magnet dimatikan'); return;
      case 'undo': return urungkan();
      case 'redo': return ulangi();
      case 'pintasan': return dialogPintasan();
      case 'unduhSvg': if (it) { try { unduh(it.namaFile, eksporSvg(it.dok, st.aturan)); } catch (e) { toast(e.message, true); } } return;
      case 'salinSvg': if (it) { try { await navigator.clipboard.writeText(eksporSvg(it.dok, st.aturan)); toast('Kode SVG disalin.'); } catch (e) { toast('Gagal menyalin: ' + e.message, true); } } return;
      case 'kunciRasio': st.kunciRasio = !st.kunciRasio; renderKanan(); return;
      case 'putar90': return putar90();
      case 'cerminH': return cerminSel('h');
      case 'cerminV': return cerminSel('v');
      case 'tambahFill': return ubah(() => terpilih().forEach((o) => { o.fill = atr().warna[0]; }));
      case 'hapusFill': return ubah(() => terpilih().forEach((o) => { o.fill = null; if (!o.stroke) { o.stroke = atr().warna[0]; o.sw = atr().stroke; } }));
      case 'tambahStroke': return ubah(() => terpilih().forEach((o) => { o.stroke = atr().warna[0]; o.sw = atr().stroke; }));
      case 'hapusStroke': return ubah(() => terpilih().forEach((o) => { o.stroke = null; if (!o.fill) o.fill = atr().warna[0]; }));
      case 'outline': return outlineSel();
      case 'keVektor': return keVektorSel();
      case 'duplikat': return duplikatSel();
      case 'hapus': return hapusSel();
      case 'perbaikiSemua': {
        const daftar = hasilPeriksa().filter((x) => x.perbaiki);
        if (!daftar.length) return;
        try { ubah((d) => { daftar.forEach((x) => x.perbaiki(d)); }); toast(`${daftar.length} masalah diperbaiki otomatis.`); } catch (e) { toast(e.message, true); }
        return;
      }
      default: return;
    }
  }

  /* ===================== PASANG EVENT ===================== */
  function pasangEvent() {
    const E = st.el;
    E.svg.addEventListener('pointerdown', onPointerDown);
    E.svg.addEventListener('pointermove', onPointerMove);
    E.svg.addEventListener('pointerup', onPointerUp);
    E.svg.addEventListener('pointercancel', onPointerUp);
    E.svg.addEventListener('wheel', onWheel, { passive: false });
    E.svg.addEventListener('pointerleave', () => { if (st.hover && !st.drag) { st.hover = null; renderKanvas(); } });
    st.onKey = onKeyDown; st.onKeyUp = onKeyUp; st.onPaste = onPaste;
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('paste', onPaste);
    st.ro = new ResizeObserver(() => { if (!st) return; if (st.perluPas && dok()) { const r = st.el.svg.getBoundingClientRect(); if (r.width) { pasKanvas(); st.perluPas = false; } } renderKanvas(); renderZoom(); });
    st.ro.observe(E.stage);
    st.onBeforeUnload = (e) => { if (st && st.opts.proyek && st.icons.some((it) => it.dok && kotor(it))) { simpanDraf(); e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', st.onBeforeUnload);

    E.root.addEventListener('click', (e) => {
      if (st.menu && !e.target.closest('.ks-menu') && !e.target.closest('[data-a="menuBentuk"],[data-a="menuBoolean"],[data-a="menuZoom"]')) tutupMenu();
      const a = e.target.closest('[data-a]');
      if (a && !a.disabled && E.root.contains(a)) { e.stopPropagation(); aksi(a.dataset.a, a); return; }
      const tool = e.target.closest('[data-tool]');
      if (tool) { gantiAlat(tool.dataset.tool); return; }
      const ico = e.target.closest('[data-icon]');
      if (ico) { pilihIcon(+ico.dataset.icon); return; }
      const tab = e.target.closest('[data-tab]');
      if (tab) { st.tabKanan = tab.dataset.tab; renderKanan(); return; }
      const r = e.target.closest('[data-rata]');
      if (r && !r.disabled) { rata(r.dataset.rata); return; }
      const bo = e.target.closest('[data-bool]');
      if (bo) { booleanSel(bo.dataset.bool); return; }
      const pal = e.target.closest('[data-palet]');
      if (pal) { const k = pal.dataset.palet, w = pal.dataset.w; ubah(() => terpilih().forEach((o) => { o[k] = w; })); return; }
      const fx = e.target.closest('[data-fix]');
      if (fx) { const x = hasilPeriksa()[+fx.dataset.fix]; if (x && x.perbaiki) { try { ubah((d) => x.perbaiki(d)); } catch (err) { toast(err.message, true); } } return; }
      const isu = e.target.closest('[data-issue]');
      if (isu) { const x = hasilPeriksa()[+isu.dataset.issue]; if (x && x.ids.length) { st.sel = x.ids.slice(); renderKanvas(); renderLayers(); } return; }
      const mata = e.target.closest('[data-ly-mata]');
      if (mata) { const o = objById(mata.dataset.lyMata); ubah(() => { o.hidden = !o.hidden; }); if (o.hidden) { st.sel = st.sel.filter((x) => x !== o.id); renderSemua(); } return; }
      const kun = e.target.closest('[data-ly-kunci]');
      if (kun) { const o = objById(kun.dataset.lyKunci); ubah(() => { o.locked = !o.locked; }); return; }
      const ly = e.target.closest('[data-layer]');
      if (ly) {
        const id = ly.dataset.layer, o = objById(id);
        if (st.pena) selesaiPena();
        if (st.edit && st.edit.id !== id) st.edit = null;
        if (e.shiftKey || e.metaKey || e.ctrlKey) st.sel = st.sel.includes(id) ? st.sel.filter((x) => x !== id) : st.sel.concat(id);
        else st.sel = o && !o.hidden ? [id] : [];
        renderSemua();
      }
    });
    E.layers.addEventListener('dblclick', (e) => {
      const nm = e.target.closest('.ks-ly-nm'); if (!nm) return;
      const id = nm.closest('[data-layer]').dataset.layer, o = objById(id);
      nm.innerHTML = `<input value="${esc(namaObjek(o))}">`;
      const inp = nm.querySelector('input'); inp.focus(); inp.select();
      const selesai = (simpanNama) => { if (simpanNama) { const v = inp.value.trim(); ubah(() => { o.nama = v; }); } else renderLayers(); };
      inp.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') inp.blur(); if (ev.key === 'Escape') { inp.dataset.batal = '1'; inp.blur(); } });
      inp.addEventListener('blur', () => selesai(!inp.dataset.batal));
    });
    // urutan layer: seret & lepas
    E.layers.addEventListener('dragstart', (e) => { const ly = e.target.closest('[data-layer]'); if (!ly) return; st.seretLayer = ly.dataset.layer; e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', st.seretLayer); } catch (x) {} });
    E.layers.addEventListener('dragover', (e) => {
      const ly = e.target.closest('[data-layer]'); if (!ly || !st.seretLayer) return;
      e.preventDefault();
      E.layers.querySelectorAll('.drop-up,.drop-down').forEach((x) => x.classList.remove('drop-up', 'drop-down'));
      const r = ly.getBoundingClientRect();
      ly.classList.add(e.clientY < r.top + r.height / 2 ? 'drop-up' : 'drop-down');
    });
    E.layers.addEventListener('drop', (e) => {
      const ly = e.target.closest('[data-layer]'); const id = st.seretLayer; st.seretLayer = null;
      if (!ly || !id || ly.dataset.layer === id) { renderLayers(); return; }
      e.preventDefault();
      const atasnya = ly.classList.contains('drop-up');
      ubah((d) => {
        const o = d.objek.find((x) => x.id === id);
        d.objek = d.objek.filter((x) => x.id !== id);
        const ti = d.objek.findIndex((x) => x.id === ly.dataset.layer);
        d.objek.splice(atasnya ? ti + 1 : ti, 0, o);
      });
    });
    E.layers.addEventListener('dragend', () => { st.seretLayer = null; renderLayers(); });

    // panel kanan: kolom isian
    E.kanan.addEventListener('change', (e) => {
      const f = e.target.closest('input[data-f]');
      if (f && f.dataset.f !== 'namaFile') terapkanField(f.dataset.f, f.value);
      const w = e.target.closest('input[data-warna]');
      if (w) { st.warnaAktif = false; renderKanan(); }
    });
    E.kanan.addEventListener('input', (e) => {
      const f = e.target.closest('input[data-f="namaFile"]');
      if (f) { terapkanField('namaFile', f.value); return; }
      const w = e.target.closest('input[data-warna]');
      if (w) {
        const k = w.dataset.warna, v = w.value.toUpperCase();
        ubah(() => terpilih().forEach((o) => { o[k] = v; }), { tanpaUndo: !!st.warnaAktif, tanpaKanan: true });
        st.warnaAktif = true;
        const sw = w.closest('.ks-swatch'); if (sw) sw.style.background = v;
        const teks = w.closest('.ks-field').querySelector(`input[data-f="${k}"]`); if (teks) teks.value = v.slice(1);
      }
    });
    E.kanan.addEventListener('keydown', (e) => {
      const f = e.target.closest('input[data-f]');
      if (!f) return;
      if (e.key === 'Enter') { f.blur(); }
      if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !['namaFile', 'fill', 'stroke'].includes(f.dataset.f)) {
        e.preventDefault();
        const step = f.dataset.f === 'rot' ? (e.shiftKey ? 15 : 1) : f.dataset.f === 'sisi' || f.dataset.f === 'rasio' ? 1 : atr().snap * (e.shiftKey ? 4 : 1);
        const v = (parseFloat(f.value) || 0) + (e.key === 'ArrowUp' ? step : -step);
        terapkanField(f.dataset.f, String(v));
        const baru = E.kanan.querySelector(`input[data-f="${f.dataset.f}"]`); if (baru) baru.focus();
      }
    });
    // seret label angka (scrub) seperti Figma
    E.kanan.addEventListener('pointerdown', (e) => {
      const l = e.target.closest('[data-scrub]'); if (!l) return;
      e.preventDefault();
      const key = l.dataset.scrub;
      const inp = l.parentElement.querySelector('input');
      const awal = parseFloat(inp.value);
      if (!isFinite(awal)) return;
      const x0 = e.clientX;
      const step = key === 'rot' ? 1 : key === 'sisi' ? 0.1 : key === 'rasio' ? 0.5 : atr().snap;
      let pertama = true;
      const gerak = (ev) => {
        const v = awal + Math.round((ev.clientX - x0) / 2) * step;
        terapkanFieldSeret(key, v, pertama); pertama = false;
        inp.value = fmt(key === 'sisi' ? Math.round(v) : v);
      };
      const lepas = () => { window.removeEventListener('pointermove', gerak); window.removeEventListener('pointerup', lepas); renderKanan(); };
      window.addEventListener('pointermove', gerak);
      window.addEventListener('pointerup', lepas);
    });
    E.file.addEventListener('change', () => { if (E.file.files.length) imporFile([...E.file.files]); });
    // tooltip toolbar
    E.toolbar.addEventListener('pointerover', (e) => {
      const b = e.target.closest('[data-tip]'); const lama = E.stage.querySelector('.ks-tip'); if (lama) lama.remove();
      if (!b) return;
      const [t, k] = b.dataset.tip.split('|');
      const tip = document.createElement('div'); tip.className = 'ks-tip'; tip.innerHTML = esc(t) + (k ? `<b>${esc(k)}</b>` : '');
      E.stage.appendChild(tip);
      const r = b.getBoundingClientRect(), rs = E.stage.getBoundingClientRect();
      tip.style.left = clamp(r.left - rs.left + r.width / 2 - tip.offsetWidth / 2, 4, rs.width - tip.offsetWidth - 4) + 'px';
      tip.style.top = (r.top - rs.top - tip.offsetHeight - 8) + 'px';
    });
    E.toolbar.addEventListener('pointerleave', () => { const t = E.stage.querySelector('.ks-tip'); if (t) t.remove(); });
  }
  function terapkanFieldSeret(key, v, pertama) {
    const list = terpilih(); if (!list.length) return;
    if (pertama) catatUndo();
    terapkanFieldTanpaUndo(key, v);
  }
  function terapkanFieldTanpaUndo(key, v) {
    const it = ic(); const simpanUndo = it.undo.length;
    terapkanField(key, String(v), true);
    it.undo.length = simpanUndo;
  }

  /* ===================== BUKA & TUTUP ===================== */
  function bangunDom() {
    const root = document.createElement('div');
    root.className = 'ks-root';
    root.innerHTML = `
      <aside class="ks-panel ks-left">
        <div class="ks-head"><div class="ks-logo">${IKON.pena}</div><div style="min-width:0;flex:1"><div class="ks-title">Studio Icon</div><div class="ks-sub" data-r="sub"></div></div><button class="ks-iconbtn" data-a="tutup" title="Tutup Studio">${IKON.tutup}</button></div>
        <div class="ks-sec"><div class="ks-sec-h"><span>Icon <span data-r="jmlicon" class="ks-sub"></span></span><span class="ks-row" style="gap:2px"><button class="ks-iconbtn" data-a="impor" title="Impor file SVG dari komputer">${IKON.impor}</button><button class="ks-iconbtn" data-a="iconBaru" title="Icon baru">${IKON.tambah}</button></span></div><div class="ks-icons" data-r="icons"></div></div>
        <div class="ks-sec ks-scroll" style="flex:1;border:0;display:flex;flex-direction:column"><div class="ks-sec-h"><span>Layer</span></div><div class="ks-layers" data-r="layers"></div></div>
        <input type="file" hidden accept=".svg,image/svg+xml" multiple data-r="file">
      </aside>
      <main class="ks-stage" data-r="stage">
        <svg class="ks-canvas" data-r="svg" xmlns="${NS}"><g data-r="world"></g><g data-r="over"></g></svg>
        <div class="ks-toolbar" data-r="toolbar"></div>
        <div class="ks-sempit"><b>Studio Icon paling nyaman di laptop / PC</b><span class="ks-note">Layar ini terlalu sempit untuk panel layer & properti.</span><div class="ks-row"><button class="ks-btn pri" data-a="paksa">Tetap buka</button><button class="ks-btn sek" data-a="tutup">Tutup</button></div></div>
      </main>
      <aside class="ks-panel ks-right">
        <div class="ks-head" style="justify-content:space-between"><button class="ks-zoom" data-a="menuZoom" data-r="zoom" title="Zoom">100%</button><button class="ks-btn pri" data-a="simpan" data-r="btnSimpan"></button></div>
        <div class="ks-tabs" data-r="tabs"></div>
        <div class="ks-scroll" style="flex:1" data-r="kanan"></div>
      </aside>`;
    const el = { root };
    root.querySelectorAll('[data-r]').forEach((x) => { el[x.dataset.r] = x; });
    return el;
  }

  async function buka(opts) {
    opts = opts || {};
    if (st) await tutup(true);
    pasangCss();
    const memuat = document.createElement('div');
    memuat.className = 'ks-dlg-bg';
    memuat.innerHTML = '<div class="ks-dlg" style="width:auto;text-align:center"><b>Menyiapkan Studio Icon…</b></div>';
    document.body.appendChild(memuat);
    try { await pustakaSiap(); } catch (e) { memuat.remove(); alert(e.message); return; }
    const aturan = gabungAturan(opts.aturan);
    st = {
      opts, aturan, gaya: gayaDariKategori(opts.proyek && opts.proyek.kategori) || null,
      icons: [], aktif: -1, sel: [], hover: null, tool: 'pilih', alatBentuk: 'rect',
      z: 20, tx: 0, ty: 0, grid: true, keyline: true, snap: true, kunciRasio: false,
      edit: null, pena: null, drag: null, panduan: [], tabKanan: 'desain', clip: null, menu: null, el: null
    };
    st.el = bangunDom();
    document.body.appendChild(st.el.root);
    document.documentElement.style.overflow = 'hidden';
    pasangEvent();
    renderSemua();
    memuat.remove();

    if (opts.proyek) {
      if (!st.gaya) { const g = await pilihGaya('Gaya tema ini belum terdeteksi. Pilih gaya icon:'); if (!st) return; st.gaya = g || 'line'; }
      st.el.icons.innerHTML = '<div class="ks-empty">Memuat icon dari folder Drive…</div>';
      try {
        const res = await opts.api('studio_muat', {});
        if (!st) return;
        if (!res || res.status !== 'success') throw new Error((res && res.message) || 'Gagal membaca folder Drive.');
        (res.files || []).forEach((f) => {
          let dokFile = null;
          if (f.studio && f.cocok && f.dok) { try { dokFile = typeof f.dok === 'string' ? JSON.parse(f.dok) : f.dok; } catch (e) { dokFile = null; } }
          const it = entriIcon({ file_id: f.id, namaFile: stem(f.name), dok: dokFile && dokFile.objek ? dokFile : null, mentah: f.content || '', asal: dokFile ? 'studio' : 'luar' });
          if (it.dok) it.simpan = kunciSimpan(it);
          st.icons.push(it);
        });
      } catch (e) {
        if (!st) return;
        toast(e.message || 'Gagal memuat folder Drive.', true);
      }
      const draf = bacaDraf();
      let pulih = 0;
      draf.forEach((d) => {
        if (!d || !d.dok) return;
        const ada = d.file_id && st.icons.find((it) => it.file_id === d.file_id);
        if (ada) { if (!ada.dok) siapkanDok(ada); ada.dok = d.dok; ada.namaFile = d.namaFile || ada.namaFile; pulih++; }
        else { st.icons.push(entriIcon({ namaFile: d.namaFile, dok: d.dok, simpan: '' })); pulih++; }
      });
      if (!st.icons.length) iconBaru();
      else pilihIcon(Math.max(0, st.icons.findIndex((it) => it.dok && kotor(it))));
      if (pulih) toast(`${pulih} draf yang belum tersimpan dipulihkan dari perangkat ini.`);
    } else {
      const draf = bacaDraf();
      draf.forEach((d) => { if (d && d.dok) { const it = entriIcon({ namaFile: d.namaFile, dok: d.dok }); it.simpan = kunciSimpan(it); st.icons.push(it); } });
      if (st.icons.length) { st.gaya = st.icons[st.icons.length - 1].dok.gaya; pilihIcon(st.icons.length - 1); }
      else {
        const g = await pilihGaya('Mulai icon baru — pilih gaya');
        if (!st) return;
        st.gaya = g || 'line';
        iconBaru(st.gaya);
      }
    }
  }

  async function tutup(paksa) {
    if (!st) return;
    if (!paksa && st.opts.proyek) {
      const belum = st.icons.filter((it) => it.dok && kotor(it)).length;
      if (belum) {
        const ok = await konfirmasi('Tutup Studio Icon?', `${belum} icon belum disimpan ke Drive.\nDrafnya tetap tersimpan di perangkat ini dan akan dipulihkan saat Studio dibuka lagi.`, 'Tutup');
        if (!ok) return;
      }
    }
    simpanDraf();
    window.removeEventListener('keydown', st.onKey);
    window.removeEventListener('keyup', st.onKeyUp);
    window.removeEventListener('paste', st.onPaste);
    window.removeEventListener('beforeunload', st.onBeforeUnload);
    if (st.ro) st.ro.disconnect();
    st.el.root.remove();
    document.documentElement.style.overflow = '';
    const cb = st.opts.onTutup;
    st = null;
    if (cb) try { cb(); } catch (e) {}
  }

  window.KekalStudio = {
    versi: VERSI,
    open: buka,
    close: () => tutup(false),
    aturanBawaan: () => salin(ATURAN_BAWAAN),
    gabungAturan: (a) => gabungAturan(a),
    // untuk pengujian
    _uji: { eksporSvg, periksa, imporSvg, gabungAturan, keadaan: () => st, aksi: (n) => aksi(n) }
  };
})();
