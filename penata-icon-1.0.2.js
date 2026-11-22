/*! KEKAL Studio - Penata Icon v1.0.2 | dimuat saat tombol Penata Icon diklik */
  /* ==========================================================================
   * PENATA IKON (KEKAL DESIGNER) — modal untuk Admin Control Panel
   * Pemakaian: KekalArranger.open({ id, folderUrl, count, title, designer, judul, keyword, adobeInfo, onAdobeUpload })
   * Membaca SVG dari folder Drive proyek lewat Apps Script (aksi "list_svg").
   * ========================================================================== */
  window.KekalArranger = (function () {
    'use strict';

    /* =====================================================================
     * 1. KONSTANTA
     * ===================================================================== */
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const XLINK_NS = 'http://www.w3.org/1999/xlink';
    const XML_NS = 'http://www.w3.org/XML/1998/namespace';

    const COUNT_OPTIONS = [
      { count: 3, grid: '1 baris' },
      { count: 6, grid: '2 baris' },
      { count: 9, grid: '3 baris' },
      { count: 12, grid: '3 × 4' }
    ];
    const SETTING_LIMITS = { width: [10, 5000], gap: [0, 5000], padding: [0, 5000] };
    const EXPORT_SCALES = [1, 2, 4, 5, 10];
    const STOCK_MP = { min: 4, target: 4.2, max: 25 }; // syarat artwork Shutterstock (megapiksel)
    const OPACITY_DECL = /(?:^|[\s;{])(?:fill-|stroke-)?opacity\s*:\s*([\d.]+%?)/gi;
    const WARN = {
      text: 'mengandung teks — ubah ke outline',
      image: 'mengandung gambar raster — tidak didukung EPS 10',
      gradient: 'memakai gradient — ganti dengan warna solid agar aman untuk EPS 10',
      opacity: 'memakai transparansi (opacity) — EPS 10 tidak mendukung transparansi',
      effect: 'memakai mask/filter — tidak didukung EPS 10'
    };
    const STRIP_TAGS = new Set(['script', 'foreignObject', 'metadata', 'title', 'desc']);
    const ROOT_ATTR_SKIP = new Set(['width', 'height', 'viewBox', 'x', 'y', 'id', 'version',
      'baseProfile', 'preserveAspectRatio', 'enable-background', 'overflow']);

    const ICONS = {
      squares: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
      upload: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5',
      download: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
      trash: 'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0',
      close: 'M6 18L18 6M6 6l12 12',
      refresh: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99',
      adjust: 'M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75',
      eye: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
      cursor: 'M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59',
      warning: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
      check: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      plus: 'M12 4.5v15m7.5-7.5h-15',
      lasso: 'M12 4.5c4.556 0 8.25 2.183 8.25 4.875S16.556 14.25 12 14.25c-1.27 0-2.473-.17-3.548-.473M7.5 13.6C5.25 12.75 3.75 11.15 3.75 9.375 3.75 6.683 7.444 4.5 12 4.5M7.5 13.6a1.5 1.5 0 10-.001 3 1.5 1.5 0 00.001-3zm0 3c0 1.8 1.05 3 3 3.9',
      shuffle: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5',
      folder: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z',
      search: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
      crop: 'M6.75 2.25v13.5a1.5 1.5 0 001.5 1.5h13.5M2.25 6.75h13.5a1.5 1.5 0 011.5 1.5v13.5',
      outline: 'M4.5 4.5h15v15h-15zM8 8h8v8H8z',
      anchors: 'M3.75 3.75h3v3h-3zM17.25 3.75h3v3h-3zM3.75 17.25h3v3h-3zM17.25 17.25h3v3h-3zM6.75 5.25h10.5M6.75 18.75h10.5M5.25 6.75v10.5M18.75 6.75v10.5',
      minus: 'M19.5 12h-15',
      eyedropper: 'M14.25 6.75l3 3M16.5 3.75a2.121 2.121 0 013 3l-2.25 2.25-3-3 2.25-2.25zM14.25 6.75l-8.5 8.5-.75 3.75 3.75-.75 8.5-8.5',
      chevronLeft: 'M15.75 19.5L8.25 12l7.5-7.5',
      chevronRight: 'M8.25 4.5l7.5 7.5-7.5 7.5',
      chevronDown: 'M19.5 8.25l-7.5 7.5-7.5-7.5',
      undo: 'M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3',
      shapes: 'M3.75 3.75h10.5v10.5H3.75zM9.75 9.75h10.5v10.5H9.75z',
      pen: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z',
      redo: 'M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3',
      swatch: 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z',
      external: 'M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
    };

    const STYLES = `
      #kd-modal .kd-canvas { display: block; width: 100%; height: auto; max-height: 60vh; touch-action: pan-y; user-select: none; overflow: visible; }
      #kd-modal .kd-item, #kd-modal .kd-rotate-handle, #kd-modal .kd-rotate-reset, #kd-modal .kd-flip-h, #kd-modal .kd-flip-v { touch-action: none; }
      @media (max-width: 639px) {
        #kd-modal .kd-canvas { max-height: 70vh; }
        #kd-modal input[type=text], #kd-modal input[type=number], #kd-modal select { font-size: 16px; } /* cegah zoom otomatis iOS */
      }
      #kd-modal .kd-rotate-handle { cursor: grab; }
      #kd-modal .kd-rotate-handle:active { cursor: grabbing; }
      #kd-modal .kd-rotate-reset { cursor: pointer; }
      #kd-modal .kd-flip-h, #kd-modal .kd-flip-v { cursor: pointer; }
      #kd-modal .kd-item.is-rotating { transition: none; }
      #kd-modal .kd-item { cursor: grab; transition: transform .28s cubic-bezier(.2, .8, .2, 1); }
      #kd-modal .kd-item:hover > rect:first-child { fill: rgba(37, 99, 235, 0.06); }
      #kd-modal svg [stroke="#2563EB"][stroke-dasharray], #kd-modal svg [stroke="#2563EB"][fill-opacity] { filter: drop-shadow(0 0 1px rgba(255, 255, 255, .95)); }
      #kd-modal .kd-item.is-dragging { cursor: grabbing; transition: none; filter: drop-shadow(0 6px 10px rgba(49, 53, 59, .25)); }
      #kd-modal .kd-static .kd-item { transition: none; }
      /* Mode outline (seperti Outline di Illustrator): hanya garis tipis, tanpa isi warna */
      #kd-modal .kd-outline .kd-item > g, #kd-modal .kd-outline .kd-item > g *,
      #kd-modal .kd-outline .kd-ins-art, #kd-modal .kd-outline .kd-ins-art * {
        fill: none !important; stroke: var(--kd-outline, #31353B) !important; stroke-width: 1px !important;
        stroke-dasharray: none !important; opacity: 1 !important; stroke-opacity: 1 !important;
        vector-effect: non-scaling-stroke !important; clip-path: none !important; mask: none !important; filter: none !important;
      }
      #kd-modal .kd-pal-picking [data-color-row] { cursor: copy; transition: box-shadow .15s; }
      #kd-modal .kd-pal-picking [data-color-row] * { pointer-events: none; }
      #kd-modal .kd-pal-picking [data-color-row] [data-action] { pointer-events: auto; }
      #kd-modal .kd-pal-picking [data-color-row]:hover { box-shadow: 0 0 0 2px #2563EB; }
      #kd-modal .kd-pipette .kd-item, #kd-modal .kd-pipette .kd-item * { cursor: crosshair !important; }
      #kd-modal #kd-ins-view { touch-action: none; cursor: grab; }
      #kd-modal #kd-ins-view.is-panning { cursor: grabbing; }
      #kd-modal #kd-ins-view.kd-ins-picking, #kd-modal #kd-ins-view.kd-ins-picking.is-panning { cursor: crosshair; }
      #kd-modal .kd-sb-region { fill: transparent; stroke: #2563EB; stroke-width: 1px; vector-effect: non-scaling-stroke; pointer-events: all; cursor: pointer; }
      #kd-modal .kd-sb-region:hover { fill: rgba(37, 99, 235, 0.22); stroke-width: 2px; }
      #kd-modal .kd-sb-region.kd-sb-on { fill: rgba(37, 99, 235, 0.4); stroke-width: 2px; }
      #kd-modal .kd-sb-del .kd-sb-region:hover { fill: rgba(239, 20, 74, 0.22); stroke: #EF144A; }
      #kd-modal .kd-sb-del .kd-sb-region.kd-sb-on { fill: rgba(239, 20, 74, 0.4); stroke: #EF144A; stroke-dasharray: 4 3; }
      #kd-modal #kd-ins-view svg { display: block; width: 100%; height: 100%; }
      #kd-modal .kd-checker {
        background-color: #fff;
        background-image: linear-gradient(45deg, #EEF0F2 25%, transparent 25%), linear-gradient(-45deg, #EEF0F2 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #EEF0F2 75%), linear-gradient(-45deg, transparent 75%, #EEF0F2 75%);
        background-size: 12px 12px;
        background-position: 0 0, 0 6px, 6px -6px, -6px 0;
      }
      #kd-modal input[type=number]::-webkit-outer-spin-button,
      #kd-modal input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      #kd-modal input[type=number] { -moz-appearance: textfield; }
      #kd-modal .kd-bar-indeterminate { position: relative; overflow: hidden; }
      #kd-modal .kd-bar-indeterminate::after {
        content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 40%; border-radius: inherit; background: #2563EB;
        animation: kd-slide 1.1s ease-in-out infinite;
      }
      @keyframes kd-slide { from { transform: translateX(-100%); } to { transform: translateX(250%); } }
      @media (prefers-reduced-motion: reduce) { #kd-modal .kd-bar-indeterminate::after { animation: none; } }
    `;

    const CLS = {
      card: 'bg-white rounded-2xl shadow-kd-card p-4 sm:p-5',
      cardTitle: 'flex items-center gap-2 text-[15px] font-bold text-kd-ink',
      step: 'w-6 h-6 shrink-0 rounded-full bg-kd-brand text-white text-xs font-bold grid place-items-center',
      btnPrimary: 'inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-kd-brand text-white font-bold text-sm hover:bg-kd-brand-dark disabled:bg-[#BFC9D9] disabled:cursor-not-allowed transition-colors',
      btnOutline: 'inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-kd-brand text-kd-brand font-bold text-sm hover:bg-kd-brand-light disabled:border-[#BFC9D9] disabled:text-[#BFC9D9] disabled:cursor-not-allowed transition-colors',
      input: 'w-full h-10 rounded-lg border border-kd-line pl-3 pr-9 text-sm font-semibold text-kd-ink outline-none focus:border-kd-brand focus:ring-2 focus:ring-kd-brand/20 transition',
      chip: 'inline-flex items-center gap-1 rounded-full bg-kd-surface px-2.5 py-1 text-xs font-semibold text-kd-muted'
    };

    /* =====================================================================
     * 2. STATE
     * ===================================================================== */
    const state = {
      count: 6,
      settings: { width: 100, gap: 50, padding: 50, trim: true, scale: 'auto' },
      items: [],       // aset SVG yang dimuat (urutan array = urutan slot)
      layout: null,    // hasil Layout.compute() untuk urutan saat ini
      project: null,   // { id, folderUrl, title, designer } dari baris tabel
      selectedId: null, // ikon yang sedang dipilih untuk dirotasi
      drive: { status: 'idle' },
      mode: 'admin',          // 'admin' = ekspor microstock, 'designer' = kirim ke Drive
      background: 'checker',  // warna latar pratinjau (hanya tampilan, tidak ikut file)
      dz: { namedOrder: null, sending: false, revising: null, progress: null, open: false }, // status kirim ke Drive (desainer; admin lewat kartu lipat)
      outline: false,         // mode outline di kanvas pratinjau (hanya tampilan)
      colors: {}              // warna yang diubah: { '#asli': '#baru' } — berlaku ke semua ikon
    };

    const activeItems = () => state.items.slice(0, state.count);
    const inactiveItems = () => state.items.slice(state.count);

    /* =====================================================================
     * 3. UTILITAS
     * ===================================================================== */
    const $ = (selector, ctx = document) => ctx.querySelector(selector);
    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
    const round = (n, digits = 3) => {
      const f = Math.pow(10, digits);
      return Math.round(n * f) / f;
    };
    const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
    const slug = (text) => String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'kekal-designer';
    const fileBase = () => `${slug(state.project && state.project.title)}-${state.count}-ikon`;
    const hasDriveFolder = (url) => /^https?:\/\//i.test(url || '') && /[-\w]{25,}/.test(url);

    /** Sudut dibulatkan ke derajat bulat dalam rentang -179..180. */
    const normalizeAngle = (angle) => {
      const a = Math.round((((angle % 360) + 540) % 360) - 180);
      return a === -180 ? 180 : a + 0;
    };
    /** Shift = kelipatan 15°; tanpa Shift menempel ke 0/90/180 bila selisihnya ≤ 3°. */
    const snapAngle = (angle, coarse) => {
      const a = normalizeAngle(angle);
      if (coarse) return normalizeAngle(Math.round(a / 15) * 15);
      const right = Math.round(a / 90) * 90;
      return Math.abs(a - right) <= 3 ? normalizeAngle(right) : a;
    };

    /** Dialog konfirmasi milik template (dinaikkan di atas modal), cadangan: window.confirm. */
    async function confirmDialog(title, message) {
      if (typeof showModalConfirm !== 'function') return window.confirm(`${title}\n\n${message}`);
      const dialog = document.getElementById('modal-custom-dialog');
      const previousZ = dialog ? dialog.style.zIndex : '';
      if (dialog) dialog.style.zIndex = '90';
      try {
        return await showModalConfirm(title, message);
      } finally {
        if (dialog) dialog.style.zIndex = previousZ;
      }
    }

    /** Jumlah paket dari kolom Nilai: pakai jika valid (3/6/9/12), jika tidak ambil opsi terdekat di bawahnya. */
    const pickCount = (target) => {
      const options = COUNT_OPTIONS.map((o) => o.count);
      if (options.includes(target)) return target;
      const below = options.filter((c) => c <= target);
      return below.length ? below[below.length - 1] : options[0];
    };

    /** Salinan array dengan elemen di `from` dipindah ke `to` (elemen lain bergeser). */
    const moveIndex = (arr, from, to) => {
      const copy = arr.slice();
      copy.splice(to, 0, copy.splice(from, 1)[0]);
      return copy;
    };
    /** Fisher–Yates: salinan array dengan urutan acak. */
    const shuffled = (arr) => {
      const copy = arr.slice();
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };
    const icon = (name, cls = 'w-5 h-5') =>
      `<svg class="${cls}" xmlns="${SVG_NS}" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="${ICONS[name]}"/></svg>`;

    /** Warna garis outline yang kontras dengan latar (putih di latar gelap). */
    function outlineInk(bg) {
      const m = /^#([0-9a-f]{6})$/i.exec(bg || '');
      if (!m) return '#31353B';
      const n = parseInt(m[1], 16);
      const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
      return lum < 110 ? '#FFFFFF' : '#31353B';
    }

    function svgEl(doc, tag, attrs = {}) {
      const el = doc.createElementNS(SVG_NS, tag);
      Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
      return el;
    }

    /* =====================================================================
     * 4. SVG ASSET — baca, bersihkan, dan isolasi file SVG
     * ===================================================================== */
    const SvgAsset = (() => {
      let sequence = 0;

      function parseViewBox(root) {
        const vb = (root.getAttribute('viewBox') || '').trim().split(/[\s,]+/).map(Number);
        if (vb.length === 4 && vb.every(Number.isFinite) && vb[2] > 0 && vb[3] > 0) {
          return { x: vb[0], y: vb[1], w: vb[2], h: vb[3] };
        }
        const w = parseFloat(root.getAttribute('width'));
        const h = parseFloat(root.getAttribute('height'));
        return { x: 0, y: 0, w: w > 0 ? w : 100, h: h > 0 ? h : 100 };
      }

      const toOpacity = (v) => (String(v).trim().endsWith('%') ? parseFloat(v) / 100 : parseFloat(v));

      /** Deteksi opacity < 1 pada atribut, style inline, maupun blok <style>. */
      function hasTransparency(el) {
        const below1 = (v) => Number.isFinite(toOpacity(v)) && toOpacity(v) < 1;
        if (['opacity', 'fill-opacity', 'stroke-opacity'].some((a) => el.hasAttribute(a) && below1(el.getAttribute(a)))) return true;
        const css = (el.getAttribute('style') || '') + (el.localName === 'style' ? el.textContent : '');
        return [...css.matchAll(OPACITY_DECL)].some((m) => below1(m[1]));
      }

      /** Buang elemen/atribut non-standar (Inkscape, Illustrator, script, event). */
      function sanitize(root) {
        const warnings = new Set();
        [root, ...root.querySelectorAll('*')].forEach((el) => {
          if (el !== root && (el.namespaceURI !== SVG_NS || STRIP_TAGS.has(el.localName))) {
            el.remove();
            return;
          }
          [...el.attributes].forEach((attr) => {
            const ns = attr.namespaceURI;
            const isForeign = ns && ns !== XLINK_NS && ns !== XML_NS;
            const isEvent = /^on/i.test(attr.localName);
            const isScriptLink = attr.localName === 'href' && /^\s*javascript:/i.test(attr.value);
            if (isForeign || isEvent || isScriptLink) el.removeAttributeNode(attr);
          });
          if (el.localName === 'text') warnings.add(WARN.text);
          if (el.localName === 'image') warnings.add(WARN.image);
          if (/Gradient$/.test(el.localName)) warnings.add(WARN.gradient);
          if (el.localName === 'mask' || el.localName === 'filter') warnings.add(WARN.effect);
          if (hasTransparency(el)) warnings.add(WARN.opacity);
        });
        return [...warnings];
      }

      /** Beri prefix unik pada id & class agar gradient/clipPath antar ikon tidak bentrok. */
      function scopeIdentifiers(root, prefix) {
        const all = [root, ...root.querySelectorAll('*')];
        const ids = new Map();
        const classes = new Set();

        all.forEach((el) => {
          const id = el.getAttribute('id');
          if (id) {
            ids.set(id, prefix + id);
            el.setAttribute('id', prefix + id);
          }
          const cls = el.getAttribute('class');
          if (cls) {
            const tokens = cls.split(/\s+/).filter(Boolean);
            tokens.forEach((t) => classes.add(t));
            el.setAttribute('class', tokens.map((t) => prefix + t).join(' '));
          }
        });

        const scopeUrl = (value) => value.replace(/url\(\s*(['"]?)#([^'")\s]+)\1\s*\)/g,
          (match, quote, id) => (ids.has(id) ? `url(#${ids.get(id)})` : match));
        const scopeCss = (css) => css.replace(/([#.])(-?[A-Za-z_][\w-]*)/g, (match, sym, name) => {
          if (sym === '#' && ids.has(name)) return '#' + ids.get(name);
          if (sym === '.' && classes.has(name)) return '.' + prefix + name;
          return match;
        });

        all.forEach((el) => {
          [...el.attributes].forEach((attr) => {
            let value = attr.value;
            if (attr.localName === 'href' && value.startsWith('#') && ids.has(value.slice(1))) {
              value = '#' + ids.get(value.slice(1));
            } else if (value.includes('url(')) {
              value = scopeUrl(value);
            }
            if (value !== attr.value) el.setAttributeNS(attr.namespaceURI, attr.name, value);
          });
          if (el.localName === 'style') el.textContent = scopeCss(el.textContent);
        });
      }

      /** Convex hull (monotone chain) — cukup titik terluar untuk menghitung bbox setelah rotasi. */
      function convexHull(points) {
        const pts = points.slice().sort((p, q) => p[0] - q[0] || p[1] - q[1]);
        if (pts.length < 3) return pts;
        const cross = (o, p, q) => (p[0] - o[0]) * (q[1] - o[1]) - (p[1] - o[1]) * (q[0] - o[0]);
        const half = (list) => {
          const out = [];
          list.forEach((pt) => {
            while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], pt) <= 0) out.pop();
            out.push(pt);
          });
          out.pop();
          return out;
        };
        return half(pts).concat(half(pts.reverse()));
      }

      /** Titik-titik sampel di sepanjang garis tepi semua bentuk (koordinat isi ikon). */
      function sampleOutline(root) {
        const points = [];
        const shapes = [...root.querySelectorAll('path, rect, circle, ellipse, line, polyline, polygon')]
          .filter((el) => !el.closest('defs, clipPath, mask, symbol, pattern, marker'));
        const steps = Math.max(16, Math.min(160, Math.floor(6000 / Math.max(1, shapes.length))));

        shapes.forEach((el) => {
          try {
            const length = el.getTotalLength();
            const m = el.getCTM();
            if (!m || !(length > 0)) return;
            for (let k = 0; k <= steps; k++) {
              const p = el.getPointAtLength((length * k) / steps).matrixTransform(m);
              points.push([p.x, p.y]);
            }
            // Titik sudut persis (ujung tiap segmen) agar sudut tajam tidak terlewat sampel
            (PathGeometry.fromElement(el) || []).forEach((seg) => {
              if (seg.length < 3) return;
              const p = new DOMPoint(seg[seg.length - 2], seg[seg.length - 1]).matrixTransform(m);
              points.push([p.x, p.y]);
            });
          } catch (err) { /* bentuk tanpa geometri: lewati */ }
        });

        // Elemen tanpa garis tepi (use/text/image): pakai sudut kotak batasnya
        root.querySelectorAll('use, text, image').forEach((el) => {
          try {
            const b = el.getBBox();
            const m = el.getCTM();
            [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].forEach(([x, y]) => {
              const p = new DOMPoint(x, y).matrixTransform(m);
              points.push([p.x, p.y]);
            });
          } catch (err) { /* lewati */ }
        });
        return points;
      }

      /** Ukur batas objek sebenarnya (tanpa ruang kosong viewBox) + hull untuk rotasi. */
      function measureGeometry(node) {
        const host = svgEl(document, 'svg', {
          style: 'position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden'
        });
        const clone = document.importNode(node, true);
        host.appendChild(clone);
        document.body.appendChild(host);
        try {
          const b = clone.getBBox();
          return {
            bbox: b.width > 0 && b.height > 0 ? { x: b.x, y: b.y, w: b.width, h: b.height } : null,
            hull: convexHull(sampleOutline(clone))
          };
        } catch (err) {
          return { bbox: null, hull: null };
        } finally {
          host.remove();
        }
      }

      async function fromFile(file) {
        return fromText(await file.text(), file.name);
      }

      function fromText(text, name) {
        const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
        const root = doc.documentElement;
        if (doc.getElementsByTagName('parsererror').length || root.localName !== 'svg') {
          throw new Error(`${name} bukan file SVG yang valid`);
        }

        const id = ++sequence;
        const warnings = sanitize(root);
        scopeIdentifiers(root, `kd${id}-`);
        const viewBox = parseViewBox(root);

        // Pindahkan isi <svg> ke <g>, sertakan atribut gaya milik root (fill, stroke, dll.)
        const node = doc.createElementNS(SVG_NS, 'g');
        [...root.attributes]
          .filter((attr) => !attr.namespaceURI && !ROOT_ATTR_SKIP.has(attr.localName))
          .forEach((attr) => node.setAttribute(attr.name, attr.value));
        while (root.firstChild) node.appendChild(root.firstChild);

        const { bbox, hull } = measureGeometry(node);
        return {
          id,
          name,
          thumb: URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' })),
          node,
          viewBox,
          bbox,
          hull,
          rotation: 0,
          flipX: false,
          flipY: false,
          warnings,
          text
        };
      }

      /** Ukur ulang batas objek setelah bentuk ikon diubah. */
      function remeasure(item) {
        const { bbox, hull } = measureGeometry(item.node);
        item.bbox = bbox;
        item.hull = hull;
      }

      return { fromFile, fromText, remeasure };
    })();

    /* =====================================================================
     * 5. LAYOUT — hitung ukuran frame & posisi rapi tiap ikon
     * ===================================================================== */
    const Layout = {
      gridFor(count) {
        const cols = count === 12 ? 4 : 3;
        return { cols, rows: count / cols };
      },

      boxOf(item, trim) {
        return trim && item.bbox ? item.bbox : item.viewBox;
      },

      /**
       * Ukuran ikon di frame. Ikon yang diputar diskalakan ulang agar LEBAR bentuk
       * miringnya tetap = width; tingginya mengikuti, sehingga aturan jarak tetap berlaku.
       * `rotate` berisi sudut + flip (sx/sy = -1 bila dibalik) terhadap titik tengah ikon.
       */
      sizeOf(item, width, trim) {
        const box = this.boxOf(item, trim);
        const angle = item.rotation || 0;
        const cx = box.x + box.w / 2;
        const cy = box.y + box.h / 2;
        const sx = item.flipX ? -1 : 1;
        const sy = item.flipY ? -1 : 1;
        const flipped = sx < 0 || sy < 0;
        if (!angle) {
          const scale = width / box.w;
          return { w: width, h: box.h * scale, scale, box, rotate: flipped ? { angle: 0, cx, cy, sx, sy } : null };
        }

        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad), sin = Math.sin(rad);
        const points = trim && item.hull && item.hull.length > 2 ? item.hull
          : [[box.x, box.y], [box.x + box.w, box.y], [box.x, box.y + box.h], [box.x + box.w, box.y + box.h]];

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        points.forEach(([px, py]) => {
          const x = cx + (px - cx) * sx; // flip dulu, baru diputar
          const y = cy + (py - cy) * sy;
          const rx = cx + (x - cx) * cos - (y - cy) * sin;
          const ry = cy + (x - cx) * sin + (y - cy) * cos;
          minX = Math.min(minX, rx); maxX = Math.max(maxX, rx);
          minY = Math.min(minY, ry); maxY = Math.max(maxY, ry);
        });
        const rotated = { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
        const scale = width / rotated.w;
        return { w: width, h: rotated.h * scale, scale, box: rotated, rotate: { angle, cx, cy, sx, sy } };
      },

      /**
       * Aturan:
       *  - semua ikon lebarnya sama (width), tinggi mengikuti proporsi
       *  - jarak horizontal antar ikon = gap, tepi kiri/kanan = padding
       *  - tinggi baris = ikon tertinggi di baris itu; jarak antar baris = gap
       *  - tepi atas/bawah = padding dari ikon tertinggi baris pertama/terakhir
       *  - ikon diratakan tengah secara vertikal di dalam barisnya
       */
      compute(items, count, { width, gap, padding, trim }) {
        const { cols, rows } = this.gridFor(count);

        const sizes = Array.from({ length: count }, (_, i) => {
          const item = items[i];
          if (!item) return { w: width, h: width, scale: 1, box: null, rotate: null };
          return this.sizeOf(item, width, trim);
        });

        const rowHeights = Array.from({ length: rows }, (_, r) =>
          Math.max(...sizes.slice(r * cols, (r + 1) * cols).map((s) => s.h)));

        const frameW = padding * 2 + cols * width + (cols - 1) * gap;
        const frameH = padding * 2 + rowHeights.reduce((sum, h) => sum + h, 0) + (rows - 1) * gap;

        const slots = [];
        let top = padding;
        rowHeights.forEach((rowH, r) => {
          for (let c = 0; c < cols; c++) {
            const size = sizes[r * cols + c];
            slots.push({ ...size, x: padding + c * (width + gap), y: top + (rowH - size.h) / 2 });
          }
          top += rowH + gap;
        });

        return { cols, rows, frameW, frameH, slots };
      }
    };

    /** Transform artwork: flip & putar di titik tengah ikon, geser ke pojok kiri-atas, lalu skalakan. */
    function artworkTransform(slot) {
      const base = `scale(${round(slot.scale, 6)}) translate(${round(-slot.box.x)} ${round(-slot.box.y)})`;
      const r = slot.rotate;
      if (!r) return base;
      const cx = round(r.cx), cy = round(r.cy);
      const rotation = r.angle ? ` rotate(${r.angle} ${cx} ${cy})` : '';
      const flip = r.sx < 0 || r.sy < 0 ? ` translate(${cx} ${cy}) scale(${r.sx || 1} ${r.sy || 1}) translate(${-cx} ${-cy})` : '';
      return `${base}${rotation}${flip}`;
    }

    /** Bangun grup artwork ikon (dipakai pratinjau & ekspor agar hasil identik). */
    function buildArtwork(doc, item, slot) {
      const g = svgEl(doc, 'g', { transform: artworkTransform(slot) });
      g.appendChild(doc.importNode(item.node, true));
      return g;
    }

    /* =====================================================================
     * 6. EKSPOR
     * ===================================================================== */

    /** Ukuran ekspor. Shutterstock: artwork (bukan artboard) minimal 4 MP, maksimal 25 MP. */
    const ExportSize = {
      artwork() {
        const { frameW, frameH } = state.layout;
        const p = state.settings.padding;
        return { w: frameW - p * 2, h: frameH - p * 2 };
      },

      scale() {
        if (state.settings.scale !== 'auto') return state.settings.scale;
        const { w, h } = this.artwork();
        const needed = Math.sqrt((STOCK_MP.target * 1e6) / (w * h));
        return Math.max(1, Math.ceil(needed * 100) / 100);
      },

      summary() {
        const scale = this.scale();
        const art = this.artwork();
        const artMp = (art.w * scale * art.h * scale) / 1e6;
        return {
          scale,
          frameW: round(state.layout.frameW * scale, 2),
          frameH: round(state.layout.frameH * scale, 2),
          artW: Math.round(art.w * scale),
          artH: Math.round(art.h * scale),
          artMp,
          status: artMp < STOCK_MP.min ? 'small' : artMp > STOCK_MP.max ? 'large' : 'ok'
        };
      }
    };

    function downloadFile(content, type, filename) {
      const url = URL.createObjectURL(new Blob([content], { type }));
      const link = Object.assign(document.createElement('a'), { href: url, download: filename });
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    /** SVG bersih, latar transparan, tanpa elemen bantu (Adobe Stock). */
    const SvgExporter = {
      /** Dokumen SVG hasil susunan; dipakai juga sebagai sumber konversi EPS. */
      buildDocument(scale) {
        const { frameW, frameH, slots } = state.layout;
        const doc = document.implementation.createDocument(SVG_NS, 'svg', null);
        const root = doc.documentElement;

        root.setAttribute('version', '1.1');
        root.setAttribute('width', round(frameW * scale));
        root.setAttribute('height', round(frameH * scale));
        root.setAttribute('viewBox', `0 0 ${round(frameW)} ${round(frameH)}`);

        activeItems().forEach((item, i) => {
          const g = svgEl(doc, 'g', {
            id: `icon-${i + 1}`,
            transform: `translate(${round(slots[i].x)} ${round(slots[i].y)})`
          });
          g.appendChild(buildArtwork(doc, item, slots[i]));
          root.appendChild(g);
        });
        // Penanda internal stiker tidak ikut file hasil
        root.querySelectorAll('[data-kd-sticker]').forEach((el) => { el.removeAttribute('data-kd-sticker'); el.removeAttribute('data-kd-vb'); });
        return doc;
      },

      download() {
        const doc = this.buildDocument(ExportSize.scale());
        const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(doc);
        downloadFile(xml, 'image/svg+xml', `${fileBase()}.svg`);
      }
    };

    /** Ubah data path SVG (semua perintah, termasuk relatif & arc) menjadi M/L/C/Z absolut. */
    const PathGeometry = (() => {
      const NUMBER = /[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/y;
      const KAPPA = 0.5522847498;

      function parse(d) {
        const out = [];
        let i = 0;
        let cmd = '';
        let x = 0, y = 0, startX = 0, startY = 0;
        let prevCubic = null, prevQuad = null;

        const skip = () => { while (i < d.length && /[\s,]/.test(d[i])) i++; };
        const hasNumber = () => { skip(); return i < d.length && /[-+.\d]/.test(d[i]); };
        const num = () => {
          skip();
          NUMBER.lastIndex = i;
          const m = NUMBER.exec(d);
          if (!m) throw new Error('Path tidak valid');
          i = NUMBER.lastIndex;
          return parseFloat(m[0]);
        };
        const flag = () => {
          skip();
          const c = d[i++];
          if (c !== '0' && c !== '1') throw new Error('Flag arc tidak valid');
          return c === '1';
        };

        while (true) {
          skip();
          if (i >= d.length) break;
          if (/[a-zA-Z]/.test(d[i])) cmd = d[i++];
          else if (!cmd) throw new Error('Path tidak valid');

          const rel = cmd !== cmd.toUpperCase();
          const C = cmd.toUpperCase();

          if (C === 'Z') {
            out.push(['Z']);
            x = startX; y = startY;
            prevCubic = prevQuad = null;
            continue;
          }

          do {
            const ox2 = rel ? x : 0;
            const oy2 = rel ? y : 0;
            let cubic = null, quad = null;

            if (C === 'M') {
              x = num() + ox2; y = num() + oy2;
              startX = x; startY = y;
              out.push(['M', x, y]);
              cmd = rel ? 'l' : 'L'; // pasangan berikutnya = lineto implisit
            } else if (C === 'L') {
              x = num() + ox2; y = num() + oy2;
              out.push(['L', x, y]);
            } else if (C === 'H') {
              x = num() + ox2;
              out.push(['L', x, y]);
            } else if (C === 'V') {
              y = num() + oy2;
              out.push(['L', x, y]);
            } else if (C === 'C' || C === 'S') {
              let x1, y1;
              if (C === 'C') { x1 = num() + ox2; y1 = num() + oy2; }
              else { x1 = prevCubic ? 2 * x - prevCubic[0] : x; y1 = prevCubic ? 2 * y - prevCubic[1] : y; }
              const x2 = num() + ox2, y2 = num() + oy2;
              const ex = num() + ox2, ey = num() + oy2;
              out.push(['C', x1, y1, x2, y2, ex, ey]);
              cubic = [x2, y2];
              x = ex; y = ey;
            } else if (C === 'Q' || C === 'T') {
              let qx, qy;
              if (C === 'Q') { qx = num() + ox2; qy = num() + oy2; }
              else { qx = prevQuad ? 2 * x - prevQuad[0] : x; qy = prevQuad ? 2 * y - prevQuad[1] : y; }
              const ex = num() + ox2, ey = num() + oy2;
              out.push(['C', x + (2 / 3) * (qx - x), y + (2 / 3) * (qy - y),
                ex + (2 / 3) * (qx - ex), ey + (2 / 3) * (qy - ey), ex, ey]);
              quad = [qx, qy];
              x = ex; y = ey;
            } else if (C === 'A') {
              const rx = num(), ry = num(), rot = num();
              const large = flag(), sweep = flag();
              const ex = num() + ox2, ey = num() + oy2;
              arcToCubics(x, y, rx, ry, rot, large, sweep, ex, ey).forEach((seg) => out.push(seg));
              x = ex; y = ey;
            } else {
              throw new Error(`Perintah path "${cmd}" tidak dikenal`);
            }
            prevCubic = cubic;
            prevQuad = quad;
          } while (hasNumber());
        }
        return out;
      }

      /** Konversi arc elips ke kurva Bézier (SVG 1.1, lampiran F.6). */
      function arcToCubics(x1, y1, rx, ry, angle, largeArc, sweep, x2, y2) {
        if (x1 === x2 && y1 === y2) return [];
        rx = Math.abs(rx); ry = Math.abs(ry);
        if (!rx || !ry) return [['L', x2, y2]];

        const phi = (angle * Math.PI) / 180;
        const cos = Math.cos(phi), sin = Math.sin(phi);
        const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
        const x1p = cos * dx + sin * dy;
        const y1p = -sin * dx + cos * dy;

        const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
        if (lambda > 1) { rx *= Math.sqrt(lambda); ry *= Math.sqrt(lambda); }

        const rx2 = rx * rx, ry2 = ry * ry;
        const num = Math.max(0, rx2 * ry2 - rx2 * y1p * y1p - ry2 * x1p * x1p);
        let coef = Math.sqrt(num / (rx2 * y1p * y1p + ry2 * x1p * x1p));
        if (largeArc === sweep) coef = -coef;
        const cxp = (coef * rx * y1p) / ry;
        const cyp = (-coef * ry * x1p) / rx;
        const cx = cos * cxp - sin * cyp + (x1 + x2) / 2;
        const cy = sin * cxp + cos * cyp + (y1 + y2) / 2;

        const angleBetween = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
        const ux = (x1p - cxp) / rx, uy = (y1p - cyp) / ry;
        const theta1 = angleBetween(1, 0, ux, uy);
        let delta = angleBetween(ux, uy, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
        if (!sweep && delta > 0) delta -= 2 * Math.PI;
        if (sweep && delta < 0) delta += 2 * Math.PI;

        const count = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2)));
        const step = delta / count;
        const t = (4 / 3) * Math.tan(step / 4);
        const map = (px, py) => [cx + rx * px * cos - ry * py * sin, cy + rx * px * sin + ry * py * cos];

        const segments = [];
        let th = theta1;
        for (let k = 0; k < count; k++) {
          const c1 = Math.cos(th), s1 = Math.sin(th);
          const c2 = Math.cos(th + step), s2 = Math.sin(th + step);
          segments.push(['C', ...map(c1 - t * s1, s1 + t * c1), ...map(c2 + t * s2, s2 - t * c2), ...map(c2, s2)]);
          th += step;
        }
        return segments;
      }

      function ellipse(cx, cy, rx, ry) {
        const kx = rx * KAPPA, ky = ry * KAPPA;
        return [
          ['M', cx + rx, cy],
          ['C', cx + rx, cy + ky, cx + kx, cy + ry, cx, cy + ry],
          ['C', cx - kx, cy + ry, cx - rx, cy + ky, cx - rx, cy],
          ['C', cx - rx, cy - ky, cx - kx, cy - ry, cx, cy - ry],
          ['C', cx + kx, cy - ry, cx + rx, cy - ky, cx + rx, cy],
          ['Z']
        ];
      }

      function rect(x, y, w, h, rx, ry) {
        if (w <= 0 || h <= 0) return null;
        if (!rx && !ry) return [['M', x, y], ['L', x + w, y], ['L', x + w, y + h], ['L', x, y + h], ['Z']];
        rx = Math.min(rx || ry, w / 2);
        ry = Math.min(ry || rx, h / 2);
        const kx = rx * KAPPA, ky = ry * KAPPA;
        return [
          ['M', x + rx, y], ['L', x + w - rx, y],
          ['C', x + w - rx + kx, y, x + w, y + ry - ky, x + w, y + ry], ['L', x + w, y + h - ry],
          ['C', x + w, y + h - ry + ky, x + w - rx + kx, y + h, x + w - rx, y + h], ['L', x + rx, y + h],
          ['C', x + rx - kx, y + h, x, y + h - ry + ky, x, y + h - ry], ['L', x, y + ry],
          ['C', x, y + ry - ky, x + rx - kx, y, x + rx, y], ['Z']
        ];
      }

      /** Geometri elemen bentuk dalam koordinat lokalnya (null jika bukan bentuk). */
      function fromElement(el) {
        const len = (name) => (el[name] && el[name].baseVal ? el[name].baseVal.value : 0);
        switch (el.localName) {
          case 'path': return parse(el.getAttribute('d') || '');
          case 'rect': return rect(len('x'), len('y'), len('width'), len('height'), len('rx'), len('ry'));
          case 'circle': return len('r') > 0 ? ellipse(len('cx'), len('cy'), len('r'), len('r')) : null;
          case 'ellipse': return len('rx') > 0 && len('ry') > 0 ? ellipse(len('cx'), len('cy'), len('rx'), len('ry')) : null;
          case 'line': return [['M', len('x1'), len('y1')], ['L', len('x2'), len('y2')]];
          case 'polyline':
          case 'polygon': {
            const pts = [...el.points].map((p, k) => [k ? 'L' : 'M', p.x, p.y]);
            if (pts.length && el.localName === 'polygon') pts.push(['Z']);
            return pts.length ? pts : null;
          }
          default: return null;
        }
      }

      return { fromElement };
    })();

    /**
     * EPS (PostScript Level 2, EPSF-3.0) untuk Shutterstock & microstock lain.
     * Semua bentuk menjadi path vektor yang bisa diedit di Illustrator.
     * Gradient diganti warna rata-rata, transparansi diabaikan — keduanya dilaporkan.
     */
    const EpsExporter = (() => {
      const SKIP = new Set(['defs', 'clipPath', 'mask', 'symbol', 'linearGradient', 'radialGradient',
        'pattern', 'marker', 'style', 'filter', 'title', 'desc', 'metadata']);
      const CONTAINERS = new Set(['svg', 'g', 'a', 'switch']);
      const CAPS = { butt: 0, round: 1, square: 2 };
      const JOINS = { miter: 0, round: 1, bevel: 2 };

      const n = (v) => {
        const r = Math.round(v * 1000) / 1000;
        return Object.is(r, -0) ? '0' : String(r);
      };

      function pathOps(segments, matrix) {
        const p = (x, y) => (matrix ? `${n(matrix.a * x + matrix.c * y + matrix.e)} ${n(matrix.b * x + matrix.d * y + matrix.f)}` : `${n(x)} ${n(y)}`);
        return segments.map((s) => {
          if (s[0] === 'M') return `${p(s[1], s[2])} m`;
          if (s[0] === 'L') return `${p(s[1], s[2])} l`;
          if (s[0] === 'C') return `${p(s[1], s[2])} ${p(s[3], s[4])} ${p(s[5], s[6])} c`;
          return 'h';
        }).join('\n');
      }

      function parseColor(value) {
        const m = /rgba?\(([^)]+)\)/.exec(value || '');
        if (!m) return null;
        const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
        return { r: r / 255, g: g / 255, b: b / 255, a };
      }

      /** Isolasi SVG ekspor di DOM tersembunyi agar style/CSS & transform bisa dibaca browser. */
      function mountHidden(doc) {
        const host = document.createElement('div');
        host.style.cssText = 'position:fixed;left:-100000px;top:0;opacity:0;pointer-events:none';
        const root = document.importNode(doc.documentElement, true);
        const vb = root.viewBox.baseVal;
        root.setAttribute('width', vb.width);
        root.setAttribute('height', vb.height);
        host.appendChild(root);
        document.body.appendChild(host);
        return { host, root };
      }

      /** Ganti <use> dengan salinan elemen yang dirujuk agar bisa dikonversi. */
      function expandUses(root) {
        for (let pass = 0; pass < 5; pass++) {
          const uses = [...root.querySelectorAll('use')];
          if (!uses.length) return;
          uses.forEach((use) => {
            const href = use.getAttribute('href') || use.getAttributeNS(XLINK_NS, 'href') || '';
            const ref = href.startsWith('#') ? root.querySelector(`[id="${CSS.escape(href.slice(1))}"]`) : null;
            const g = document.createElementNS(SVG_NS, 'g');
            [...use.attributes].forEach((a) => {
              if (!['href', 'x', 'y', 'width', 'height', 'transform'].includes(a.localName)) g.setAttribute(a.name, a.value);
            });
            const x = use.x.baseVal.value, y = use.y.baseVal.value;
            g.setAttribute('transform', `${use.getAttribute('transform') || ''} translate(${x} ${y})`);
            if (ref) {
              const clone = ref.cloneNode(true);
              clone.removeAttribute('id');
              if (clone.localName === 'symbol') {
                while (clone.firstChild) g.appendChild(clone.firstChild);
              } else {
                g.appendChild(clone);
              }
            }
            use.replaceWith(g);
          });
        }
      }

      function create(issues) {
        const summary = ExportSize.summary();
        const { scale } = summary;
        const { frameW, frameH } = state.layout;
        const doc = SvgExporter.buildDocument(1);
        const { host, root } = mountHidden(doc);
        const body = [];

        const byId = (id) => root.querySelector(`[id="${CSS.escape(id)}"]`);
        const refId = (value) => {
          const m = /url\(\s*["']?#([^"')]+)["']?\s*\)/.exec(value || '');
          return m ? m[1] : null;
        };

        /** Warna rata-rata stop gradient (mengikuti href antar gradient). */
        function gradientFallback(grad) {
          let stopsOwner = grad;
          for (let k = 0; k < 5 && stopsOwner && !stopsOwner.querySelector('stop'); k++) {
            const href = stopsOwner.getAttribute('href') || stopsOwner.getAttributeNS(XLINK_NS, 'href');
            stopsOwner = href ? byId(href.slice(1)) : null;
          }
          const colors = stopsOwner ? [...stopsOwner.querySelectorAll('stop')]
            .map((s) => parseColor(getComputedStyle(s).stopColor)).filter(Boolean) : [];
          if (!colors.length) return null;
          const avg = (k) => colors.reduce((sum, c) => sum + c[k], 0) / colors.length;
          return { r: avg('r'), g: avg('g'), b: avg('b'), a: 1 };
        }

        function paint(value, opacity, iconNo) {
          if (!value || value === 'none') return null;
          const id = refId(value);
          if (id) {
            const target = byId(id);
            if (target && /Gradient$/.test(target.localName)) {
              issues.add(`Ikon ${iconNo}: gradient diganti warna solid rata-rata`);
              return gradientFallback(target);
            }
            issues.add(`Ikon ${iconNo}: pola (pattern) tidak didukung EPS 10`);
            return null;
          }
          const color = parseColor(value);
          if (!color || color.a === 0 || opacity === 0) return null;
          if (color.a < 1 || opacity < 1) issues.add(`Ikon ${iconNo}: transparansi diabaikan (EPS 10 tidak mendukung)`);
          return color;
        }

        function clipOps(el, style, iconNo) {
          const id = refId(style.clipPath);
          const clip = id && byId(id);
          if (!clip || clip.localName !== 'clipPath') return '';
          if (clip.getAttribute('clipPathUnits') === 'objectBoundingBox') {
            issues.add(`Ikon ${iconNo}: clip path objectBoundingBox diabaikan`);
            return '';
          }
          const base = el.getCTM();
          const parts = [...clip.children].map((child) => {
            const segs = PathGeometry.fromElement(child);
            if (!segs) return '';
            const local = child.transform ? child.transform.baseVal.consolidate() : null;
            return pathOps(segs, local ? base.multiply(local.matrix) : base);
          }).filter(Boolean);
          if (!parts.length) return '';
          const rule = getComputedStyle(clip.firstElementChild || clip).clipRule === 'evenodd' ? 'W*' : 'W';
          return `n\n${parts.join('\n')}\n${rule} n`;
        }

        function walk(el, inheritedOpacity, iconNo) {
          if (SKIP.has(el.localName)) return;
          const style = getComputedStyle(el);
          if (style.display === 'none') return;
          const opacity = inheritedOpacity * parseFloat(style.opacity || '1');
          if (el.parentNode === root && el.id) iconNo = el.id.replace('icon-', '');

          if (style.mask && style.mask !== 'none') issues.add(`Ikon ${iconNo}: mask diabaikan`);
          if (style.filter && style.filter !== 'none') issues.add(`Ikon ${iconNo}: efek filter diabaikan`);
          const clip = clipOps(el, style, iconNo);
          if (clip) body.push('q', clip);

          if (CONTAINERS.has(el.localName)) {
            [...el.children].forEach((child) => walk(child, opacity, iconNo));
          } else if (el.localName === 'text') {
            issues.add(`Ikon ${iconNo}: teks dilewati — ubah ke outline`);
          } else if (el.localName === 'image') {
            issues.add(`Ikon ${iconNo}: gambar raster dilewati`);
          } else if (style.visibility !== 'hidden') {
            drawShape(el, style, opacity, iconNo);
          }

          if (clip) body.push('Q');
        }

        function drawShape(el, style, opacity, iconNo) {
          const segs = PathGeometry.fromElement(el);
          if (!segs || !segs.length) return;
          const fill = paint(style.fill, opacity * parseFloat(style.fillOpacity || '1'), iconNo);
          const strokeWidth = parseFloat(style.strokeWidth) || 0;
          const stroke = strokeWidth > 0 ? paint(style.stroke, opacity * parseFloat(style.strokeOpacity || '1'), iconNo) : null;
          if (!fill && !stroke) return;

          const m = el.getCTM();
          const path = pathOps(segs);
          body.push('q', `[${[m.a, m.b, m.c, m.d, m.e, m.f].map(n).join(' ')}] cm`);
          if (fill) {
            body.push(`${n(fill.r)} ${n(fill.g)} ${n(fill.b)} rg`, path, style.fillRule === 'evenodd' ? 'f*' : 'f');
          }
          if (stroke) {
            const dash = style.strokeDasharray && style.strokeDasharray !== 'none'
              ? style.strokeDasharray.split(/[\s,]+/).map(parseFloat).filter((v) => v >= 0) : [];
            body.push(
              `${n(stroke.r)} ${n(stroke.g)} ${n(stroke.b)} rg`,
              `${n(strokeWidth)} w ${CAPS[style.strokeLinecap] || 0} J ${JOINS[style.strokeLinejoin] || 0} j ${n(parseFloat(style.strokeMiterlimit) || 4)} M`,
              `[${dash.map(n).join(' ')}] ${n(parseFloat(style.strokeDashoffset) || 0)} d`,
              path,
              'S'
            );
          }
          body.push('Q');
        }

        try {
          expandUses(root);
          walk(root, 1, '?');
        } finally {
          host.remove();
        }

        const W = frameW * scale;
        const H = frameH * scale;
        return [
          '%!PS-Adobe-3.0 EPSF-3.0',
          '%%Creator: Kekal Designer',
          `%%Title: ${fileBase()}`,
          `%%CreationDate: ${new Date().toISOString()}`,
          `%%BoundingBox: 0 0 ${Math.ceil(W)} ${Math.ceil(H)}`,
          `%%HiResBoundingBox: 0 0 ${n(W)} ${n(H)}`,
          '%%LanguageLevel: 2',
          '%%DocumentData: Clean7Bit',
          '%%Pages: 1',
          '%%EndComments',
          '%%BeginProlog',
          '/KekalDict 40 dict def KekalDict begin',
          '/q {gsave} bind def /Q {grestore} bind def /cm {concat} bind def',
          '/m {moveto} bind def /l {lineto} bind def /c {curveto} bind def /h {closepath} bind def',
          '/n {newpath} bind def /rg {setrgbcolor} bind def',
          '/f {fill} bind def /f* {eofill} bind def /S {stroke} bind def',
          '/W {clip} bind def /W* {eoclip} bind def',
          '/w {setlinewidth} bind def /J {setlinecap} bind def /j {setlinejoin} bind def',
          '/M {setmiterlimit} bind def /d {setdash} bind def',
          'end',
          '%%EndProlog',
          '%%Page: 1 1',
          'KekalDict begin',
          'q',
          `[${n(scale)} 0 0 ${n(-scale)} 0 ${n(H)}] cm`,
          ...body,
          'Q',
          'end',
          'showpage',
          '%%EOF',
          ''
        ].join('\n');
      }

      async function download() {
        const issues = new Set();
        const eps = create(issues);
        if (issues.size) {
          const list = [...issues].map((t) => `• ${t}`).join('\n');
          const proceed = await confirmDialog('Ekspor EPS 10',
            `Beberapa bagian tidak didukung EPS 10:\n\n${list}\n\nSebaiknya perbaiki file SVG-nya dulu. Tetap ekspor EPS?`);
          if (!proceed) return false;
        }
        downloadFile(eps, 'application/postscript', `${fileBase()}.eps`);
        return true;
      }

      return { create, download };
    })();

    /* =====================================================================
     * 7. PRATINJAU — render frame & drag untuk menukar urutan ikon
     *    Ikon yang diseret menempati slot tujuan, ikon lain bergeser, dan
     *    tata letak dihitung ulang sehingga aturan jarak selalu terjaga.
     * ===================================================================== */
    const Preview = (() => {
      const BRAND = '#2563EB';
      const DRAG_THRESHOLD = 4; // px layar sebelum klik dianggap seret
      let stage = null;
      let svg = null;
      let layers = null;
      let signature = '';
      let drag = null;   // seret untuk menukar urutan
      let rotate = null; // seret bulatan untuk memutar
      const nodes = new Map(); // item.id -> { g, hit, art }

      function mount(el) {
        stage = el;
        stage.addEventListener('pointerdown', onPointerDown);
        stage.addEventListener('pointermove', onPointerMove);
        stage.addEventListener('pointerup', onPointerUp);
        stage.addEventListener('pointercancel', onPointerUp);
        stage.addEventListener('dblclick', (e) => {
          const node = e.target.closest && e.target.closest('.kd-item');
          if (node) Inspect.open(Number(node.getAttribute('data-id')));
        });
      }

      /** Bangun ulang hanya jika isi/ukuran ikon berubah; urutan & rotasi cukup diperbarui. */
      function sync() {
        const items = activeItems();
        const { count, settings } = state;
        const next = [count, settings.width, settings.trim, items.map((it) => it.id).sort((a, b) => a - b)].join('|');
        if (next !== signature || !svg) {
          signature = next;
          build(items);
        }
        applyLayout(state.layout, items);
        layers.background.setAttribute('fill', state.background === 'checker' ? 'url(#kd-checker)' : state.background);
        stage.classList.toggle('kd-outline', !!state.outline);
        stage.style.setProperty('--kd-outline', outlineInk(state.background));
      }

      function build(items) {
        svg = svgEl(document, 'svg', { class: 'kd-canvas kd-static', role: 'img', 'aria-label': 'Pratinjau frame ikon' });
        const pattern = svgEl(document, 'pattern', { id: 'kd-checker', patternUnits: 'userSpaceOnUse' });
        const defs = svgEl(document, 'defs');
        defs.appendChild(pattern);

        layers = {
          pattern,
          background: svgEl(document, 'rect', { fill: 'url(#kd-checker)' }),
          placeholders: svgEl(document, 'g', { 'pointer-events': 'none' }),
          target: svgEl(document, 'rect', {
            fill: BRAND, 'fill-opacity': 0.08, stroke: BRAND, 'stroke-width': 1.5,
            'stroke-dasharray': '5 4', 'vector-effect': 'non-scaling-stroke', 'pointer-events': 'none', display: 'none'
          }),
          items: svgEl(document, 'g'),
          frame: svgEl(document, 'rect', {
            fill: 'none', stroke: BRAND, 'stroke-width': 1.5, 'stroke-dasharray': '6 4',
            'vector-effect': 'non-scaling-stroke', 'pointer-events': 'none'
          }),
          selection: svgEl(document, 'g', { display: 'none' })
        };
        svg.append(defs, layers.background, layers.placeholders, layers.target, layers.items, layers.frame, layers.selection);

        nodes.clear();
        items.forEach((item, i) => {
          const slot = state.layout.slots[i];
          const g = svgEl(document, 'g', { class: 'kd-item', 'data-id': item.id });
          const hit = svgEl(document, 'rect', { width: slot.w, height: slot.h, fill: 'transparent' });
          const art = buildArtwork(document, item, slot);
          g.append(hit, art);
          layers.items.appendChild(g);
          nodes.set(item.id, { g, hit, art });
        });

        stage.replaceChildren(svg);
        // Posisi awal tanpa animasi, perubahan berikutnya baru dianimasikan
        requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.remove('kd-static')));
      }

      /** Terapkan tata letak ke kanvas. `skipId` = ikon yang sedang dipegang pointer. */
      function applyLayout(layout, items, skipId) {
        const { frameW, frameH, slots } = layout;
        const unit = Math.max(frameW, frameH) / 60;

        svg.setAttribute('viewBox', `0 0 ${frameW} ${frameH}`);
        [layers.background, layers.frame].forEach((r) => {
          r.setAttribute('width', frameW);
          r.setAttribute('height', frameH);
        });
        layers.pattern.setAttribute('width', unit * 2);
        layers.pattern.setAttribute('height', unit * 2);
        layers.pattern.replaceChildren(
          svgEl(document, 'rect', { width: unit * 2, height: unit * 2, fill: '#FFFFFF' }),
          svgEl(document, 'rect', { width: unit, height: unit, fill: '#EEF0F2' }),
          svgEl(document, 'rect', { x: unit, y: unit, width: unit, height: unit, fill: '#EEF0F2' })
        );

        items.forEach((item, i) => {
          const ref = nodes.get(item.id);
          if (!ref) return;
          const slot = slots[i];
          ref.hit.setAttribute('width', slot.w);
          ref.hit.setAttribute('height', slot.h);
          ref.art.setAttribute('transform', artworkTransform(slot));
          if (item.id !== skipId) place(ref.g, slot.x, slot.y);
        });
        layers.placeholders.replaceChildren(...slots.slice(items.length).map(placeholderNode));
        drawSelection(layout, items);
      }

      function place(node, x, y) {
        node.style.transform = `translate(${x}px, ${y}px)`;
      }

      function placeholderNode(slot) {
        const g = svgEl(document, 'g');
        g.append(
          svgEl(document, 'rect', {
            x: slot.x, y: slot.y, width: slot.w, height: slot.h, rx: slot.w * 0.08,
            fill: '#FFFFFF', 'fill-opacity': 0.7, stroke: '#BFC9D9', 'stroke-width': 1.5,
            'stroke-dasharray': '5 4', 'vector-effect': 'non-scaling-stroke'
          }),
          svgEl(document, 'path', {
            d: `M${slot.x + slot.w / 2} ${slot.y + slot.h * 0.38}v${slot.h * 0.24}M${slot.x + slot.w * 0.38} ${slot.y + slot.h / 2}h${slot.w * 0.24}`,
            stroke: '#BFC9D9', 'stroke-width': 2, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke'
          })
        );
        return g;
      }

      /** Bingkai ikon terpilih + bulatan rotasi + label derajat (tidak ikut diekspor). */
      function drawSelection(layout, items) {
        const sel = layers.selection;
        const index = items.findIndex((it) => it.id === state.selectedId);
        if (index < 0 || (drag && drag.moved)) {
          sel.setAttribute('display', 'none');
          return;
        }

        const slot = layout.slots[index];
        const unit = selectionUnit(layout);
        const pad = unit * 0.4;
        const x = slot.x - pad, y = slot.y - pad, w = slot.w + pad * 2, h = slot.h + pad * 2;
        const hx = x + w / 2, hy = y - unit * 2.4;
        const angle = items[index].rotation || 0;
        const label = `${angle}°`;
        const fontSize = unit * 0.95;
        const badgeW = fontSize * (0.62 * label.length + 1.1);
        const badgeH = fontSize * 1.7;
        const stroke = { stroke: BRAND, 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke' };
        // Tombol flip di kiri bulatan; pindah ke kanan label derajat bila tidak muat (ikon paling kiri)
        const flipLeft = hx - unit * 5.4 >= 0;
        const flipX1 = flipLeft ? hx - unit * 2.3 : hx + unit * 2.3 + badgeW;
        const flipX2 = flipLeft ? hx - unit * 4.4 : flipX1 + unit * 2.1;

        const badge = svgEl(document, 'g', { class: 'kd-rotate-reset' });
        badge.append(
          svgEl(document, 'rect', { x: hx + unit * 0.9, y: hy - badgeH / 2, width: badgeW, height: badgeH, rx: badgeH / 2, fill: angle ? BRAND : '#6D7588' }),
          Object.assign(svgEl(document, 'text', {
            x: hx + unit * 0.9 + badgeW / 2, y: hy, fill: '#FFFFFF', 'font-size': fontSize, 'font-weight': 700,
            'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-family': 'system-ui, sans-serif'
          }), { textContent: label })
        );
        const title = svgEl(document, 'title');
        title.textContent = angle ? 'Klik untuk kembali ke 0°' : 'Kemiringan ikon';
        badge.appendChild(title);

        sel.replaceChildren(
          svgEl(document, 'rect', { class: 'kd-sel-box', x, y, width: w, height: h, rx: pad, fill: 'none', 'stroke-dasharray': '4 3', 'pointer-events': 'none', ...stroke }),
          svgEl(document, 'line', { x1: hx, y1: y, x2: hx, y2: hy, 'pointer-events': 'none', ...stroke }),
          svgEl(document, 'circle', { class: 'kd-rotate-handle', cx: hx, cy: hy, r: unit * 0.75, fill: '#FFFFFF', ...stroke }),
          badge,
          flipButton('kd-flip-h', flipX1, hy, unit, items[index].flipX, 0, 'Balik horizontal (H)'),
          flipButton('kd-flip-v', flipX2, hy, unit, items[index].flipY, 90, 'Balik vertikal (V)')
        );
        sel.removeAttribute('display');
      }

      /** Ukuran kontrol seleksi: proporsional frame, tapi tidak lebih kecil dari batas nyaman disentuh di layar. */
      function selectionUnit(layout) {
        const base = Math.max(layout.frameW, layout.frameH) / 60;
        const shown = svg ? svg.getBoundingClientRect().width : 0;
        if (!shown) return base;
        const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
        return Math.max(base, ((coarse ? 16 : 10) * layout.frameW) / shown);
      }

      /** Tombol bulat flip: ikon dua segitiga cermin (diputar 90° untuk vertikal). Hijau penuh = aktif. */
      function flipButton(className, cx, cy, unit, active, turn, label) {
        const g = svgEl(document, 'g', { class: className });
        const glyph = svgEl(document, 'g', { transform: `translate(${cx} ${cy}) rotate(${turn}) scale(${unit / 12})`, 'pointer-events': 'none' });
        glyph.append(
          svgEl(document, 'path', { d: 'M0 -7V7', stroke: active ? '#FFFFFF' : BRAND, 'stroke-width': 1.6, 'stroke-dasharray': '2 2' }),
          svgEl(document, 'path', { d: 'M-2.5 -5L-8 5H-2.5Z', fill: active ? '#FFFFFF' : BRAND }),
          svgEl(document, 'path', { d: 'M2.5 -5L8 5H2.5Z', fill: 'none', stroke: active ? '#FFFFFF' : BRAND, 'stroke-width': 1.4, 'stroke-linejoin': 'round' })
        );
        const title = svgEl(document, 'title');
        title.textContent = label;
        g.append(
          svgEl(document, 'circle', {
            cx, cy, r: unit * 0.95, fill: active ? BRAND : '#FFFFFF',
            stroke: BRAND, 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke'
          }),
          glyph,
          title
        );
        return g;
      }

      function showTarget(slot) {
        const pad = Math.max(state.layout.frameW, state.layout.frameH) / 150;
        const t = layers.target;
        t.setAttribute('x', slot.x - pad);
        t.setAttribute('y', slot.y - pad);
        t.setAttribute('width', slot.w + pad * 2);
        t.setAttribute('height', slot.h + pad * 2);
        t.setAttribute('rx', pad * 2);
        t.removeAttribute('display');
      }

      function toFramePoint(e) {
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        return pt.matrixTransform(svg.getScreenCTM().inverse());
      }

      /** Indeks slot terisi yang pusatnya paling dekat dengan pointer. */
      function nearestSlot(slots, filled, p) {
        let best = 0;
        let bestDist = Infinity;
        for (let i = 0; i < filled; i++) {
          const s = slots[i];
          const d = Math.hypot(s.x + s.w / 2 - p.x, s.y + s.h / 2 - p.y);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        }
        return best;
      }

      const pointerAngle = (e, cx, cy) => (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;

      function onPointerDown(e) {
        if (!svg || !e.target.closest) return;

        if (Colors.pipetteActive()) {
          e.preventDefault();
          const hex = Colors.sampleCanvas(e.target);
          if (hex) Colors.pipetteApply(hex);
          else View.toast('Klik tepat pada bentuk ikon untuk mengambil warnanya.', 'error');
          return;
        }

        const flip = e.target.closest('.kd-flip-h, .kd-flip-v');
        if (flip) {
          e.preventDefault();
          App.flipItem(state.selectedId, flip.classList.contains('kd-flip-h') ? 'x' : 'y');
          return;
        }

        if (e.target.closest('.kd-rotate-reset')) {
          e.preventDefault();
          App.rotateItem(state.selectedId, 0);
          return;
        }

        if (e.target.closest('.kd-rotate-handle')) {
          e.preventDefault();
          const box = layers.selection.querySelector('.kd-sel-box').getBoundingClientRect();
          const cx = box.left + box.width / 2;
          const cy = box.top + box.height / 2;
          const item = activeItems().find((it) => it.id === state.selectedId);
          rotate = { id: state.selectedId, cx, cy, start: pointerAngle(e, cx, cy), base: item.rotation || 0 };
          const ref = nodes.get(rotate.id);
          if (ref) ref.g.classList.add('is-rotating');
          stage.setPointerCapture(e.pointerId);
          return;
        }

        const node = e.target.closest('.kd-item');
        if (!node) {
          App.select(null);
          return;
        }
        e.preventDefault();
        const id = Number(node.getAttribute('data-id'));
        const from = activeItems().findIndex((it) => it.id === id);
        const slot = state.layout.slots[from];
        const p = toFramePoint(e);
        drag = {
          id, node, from, to: from, layout: state.layout, moved: false,
          startX: e.clientX, startY: e.clientY, dx: p.x - slot.x, dy: p.y - slot.y
        };
        stage.setPointerCapture(e.pointerId);
      }

      function onPointerMove(e) {
        if (rotate) {
          const delta = pointerAngle(e, rotate.cx, rotate.cy) - rotate.start;
          App.rotateItem(rotate.id, snapAngle(rotate.base + delta, e.shiftKey), { live: true });
          return;
        }
        if (!drag) return;

        if (!drag.moved) {
          if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) < DRAG_THRESHOLD) return;
          drag.moved = true;
          drag.node.classList.add('is-dragging');
          layers.items.appendChild(drag.node); // tampil di atas ikon lain
          layers.selection.setAttribute('display', 'none');
          showTarget(drag.layout.slots[drag.from]);
        }

        const p = toFramePoint(e);
        place(drag.node, p.x - drag.dx, p.y - drag.dy);

        const items = activeItems();
        const to = nearestSlot(drag.layout.slots, items.length, p);
        if (to === drag.to) return;

        // Pratinjau urutan baru secara langsung: ikon lain bergeser, jarak dihitung ulang
        const order = moveIndex(items, drag.from, to);
        drag.to = to;
        drag.layout = Layout.compute(order, state.count, state.settings);
        applyLayout(drag.layout, order, drag.id);
        showTarget(drag.layout.slots[to]);
      }

      function onPointerUp() {
        if (rotate) {
          const ref = nodes.get(rotate.id);
          if (ref) ref.g.classList.remove('is-rotating');
          const item = activeItems().find((it) => it.id === rotate.id);
          rotate = null;
          App.rotateItem(item ? item.id : null, item ? item.rotation : 0);
          return;
        }
        if (!drag) return;
        const { id, node, from, to, moved } = drag;
        drag = null;
        if (!moved) {
          App.select(state.selectedId === id ? null : id); // klik sekali = pilih / batal pilih
          return;
        }
        node.classList.remove('is-dragging');
        layers.target.setAttribute('display', 'none');
        App.reorder(from, to);
      }

      /** Ganti isi artwork satu ikon (mis. setelah warna diubah) tanpa membangun ulang pratinjau. */
      function refreshArtwork(item) {
        const ref = nodes.get(item.id);
        if (ref) ref.art.replaceChildren(document.importNode(item.node, true));
      }

      return { mount, sync, refreshArtwork };
    })();

    /* =====================================================================
     * 8. SUMBER GOOGLE DRIVE — lewat Google Apps Script (aksi "list_svg")
     * ===================================================================== */
    const DriveSource = {
      endpoint() {
        if (window.KEKAL_ARRANGER_ENDPOINT) return window.KEKAL_ARRANGER_ENDPOINT;
        return typeof GOOGLE_APPS_SCRIPT_URL !== 'undefined' ? GOOGLE_APPS_SCRIPT_URL : '';
      },

      async list(folderUrl) {
        const endpoint = this.endpoint();
        if (!endpoint) throw new Error('URL Google Apps Script belum diatur.');

        let response;
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'list_svg', drive_folder_url: folderUrl })
          });
        } catch (err) {
          throw new Error('Gagal terhubung ke Google Apps Script.');
        }

        const data = await response.json().catch(() => null);
        if (!data) throw new Error('Respons Apps Script tidak valid.');
        if (data.status !== 'success') throw new Error(data.message || 'Gagal membaca folder Drive.');
        if (!Array.isArray(data.files)) throw new Error('Apps Script belum diperbarui: aksi list_svg belum di-deploy.');
        return data;
      },

      /** Kirim satu aksi ke Apps Script; error bila status bukan "success". */
      async post(body) {
        const endpoint = this.endpoint();
        if (!endpoint) throw new Error('URL Google Apps Script belum diatur.');

        let response;
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(body)
          });
        } catch (err) {
          throw new Error('Gagal terhubung ke Google Apps Script.');
        }

        const data = await response.json().catch(() => null);
        if (!data) throw new Error('Respons Apps Script tidak valid.');
        // Apps Script lama meneruskan aksi tak dikenal ke cabang laporan Telegram
        if (/Laporan berhasil dikirim/i.test(data.message || '')) throw new Error('Apps Script belum diperbarui: aksi mode desainer belum di-deploy.');
        if (data.status !== 'success') throw new Error(data.message || 'Permintaan ke Drive gagal.');
        return data;
      }
    };

    /* =====================================================================
     * 8b. ADOBE STOCK — kirim judul & keyword ke plugin "KEKAL Adobe Stock Helper"
     *     Data dikirim lewat URL, localStorage, dan postMessage (dibaca plugin).
     * ===================================================================== */
    const AdobeBridge = {
      UPLOAD_URL: 'https://contributor.stock.adobe.com/en/uploads',
      MESSAGE_TYPE: 'KEKAL_ADOBE_AUTOFILL',
      LIMITS: { title: 200, keywordsMin: 5, keywordsMax: 49 },

      /** Keyword unik (tanpa beda huruf besar/kecil), maksimal 49 sesuai aturan Adobe Stock. */
      keywords(raw) {
        const seen = new Set();
        return String(raw || '').split(',').map((k) => k.trim()).filter((k) => {
          const key = k.toLowerCase();
          if (!k || k === '-' || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      },

      payload(project) {
        const all = this.keywords(project.keyword);
        return {
          title: String(project.judul || '').trim().slice(0, this.LIMITS.title),
          keywords: all.slice(0, this.LIMITS.keywordsMax),
          droppedKeywords: Math.max(0, all.length - this.LIMITS.keywordsMax),
          project: project.title,
          savedAt: Date.now()
        };
      },

      open(payload) {
        try {
          localStorage.setItem('kekal_adobe_autofill', JSON.stringify(payload));
        } catch (err) { /* penyimpanan diblokir: URL & postMessage tetap jalan */ }
        window.postMessage({ type: this.MESSAGE_TYPE, payload }, window.location.origin);

        const params = new URLSearchParams({ kekal_title: payload.title, kekal_keyword: payload.keywords.join(', ') });
        return window.open(`${this.UPLOAD_URL}?${params}`, '_blank', 'noopener');
      }
    };

    /* =====================================================================
     * 8d. WARNA IKON — deteksi otomatis semua warna (seperti "Selection colors"
     *     di Figma) lalu ubah sekaligus di semua ikon. Warna dibaca dari gaya
     *     yang benar-benar tampil (atribut, style, class CSS, warisan, default hitam).
     * ===================================================================== */
    const Colors = (() => {
      const SHAPES = 'path, rect, circle, ellipse, line, polyline, polygon, text, tspan, use';
      const NO_PAINT = 'defs, clipPath, mask, symbol, pattern, marker';
      const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
      let frame = 0;
      let pending = null;

      /** "rgb(1, 2, 3)" / "rgba(...)" → "#010203"; selain itu null (none, url(), transparan penuh). */
      function toHex(value) {
        const m = String(value || '').match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/i);
        if (!m) return null;
        if (m[4] !== undefined && parseFloat(m[4]) === 0) return null;
        return '#' + [m[1], m[2], m[3]].map((v) => Math.round(Number(v)).toString(16).padStart(2, '0')).join('');
      }
      const normalize = (value) => {
        const m = String(value || '').trim().match(HEX);
        if (!m) return null;
        const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
        return '#' + h.toLowerCase();
      };
      const scope = () => (state.mode === 'designer' ? state.items : activeItems());
      /** Warna yang tampil: diatur khusus ikon ini > diubah untuk semua ikon > warna asli. */
      function effective(item, hex) {
        const own = item.colorOverrides && item.colorOverrides[hex];
        return own || state.colors[hex] || hex;
      }
      const elementsOf = (node) => [node, ...node.querySelectorAll('*')];

      /** Deklarasi di atribut style ditulis manual agar hasil ekspor tetap hex biasa (#ff6600). */
      const declsOf = (el) => (el.getAttribute('style') || '').split(';').map((d) => d.trim()).filter(Boolean);
      const declName = (d) => d.split(':')[0].trim().toLowerCase();
      function inlineValue(el, prop) {
        const decl = declsOf(el).find((d) => declName(d) === prop);
        return decl ? decl.slice(decl.indexOf(':') + 1).trim() : '';
      }
      function setInline(el, prop, value) {
        const decls = declsOf(el).filter((d) => declName(d) !== prop);
        if (value) decls.push(`${prop}:${value}`);
        if (decls.length) el.setAttribute('style', decls.join(';'));
        else el.removeAttribute('style');
      }

      /** Catat warna asli tiap elemen (sekali per ikon, sebelum ada perubahan warna). */
      function analyze(item) {
        if (item.paints) return;
        const host = svgEl(document, 'svg', { style: 'position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden' });
        const clone = document.importNode(item.node, true);
        host.appendChild(clone);
        document.body.appendChild(host);
        const paints = [];
        try {
          const original = elementsOf(item.node);
          elementsOf(clone).forEach((el, i) => {
            const props = el.localName === 'stop' ? ['stop-color']
              : el.matches(SHAPES) && !el.closest(NO_PAINT) ? ['fill', 'stroke'] : [];
            if (!props.length) return;
            const computed = getComputedStyle(el);
            props.forEach((prop) => {
              const hex = toHex(computed.getPropertyValue(prop));
              if (!hex || !original[i]) return;
              paints.push({ i, prop, hex, inline: inlineValue(original[i], prop) });
            });
          });
        } finally {
          host.remove();
        }
        item.paints = paints;
      }

      /** Terapkan peta warna (asli → baru) ke ikon; warna yang tidak diubah dikembalikan seperti semula. */
      function apply(item) {
        analyze(item);
        const els = elementsOf(item.node);
        item.paints.forEach((p) => {
          if (!els[p.i]) return;
          const to = effective(item, p.hex);
          setInline(els[p.i], p.prop, to !== p.hex ? to : p.inline);
        });
      }

      /** Ringkasan perubahan warna yang mengenai ikon ini ('' = warna asli). */
      function keyOf(item) {
        if (!item.paints) return '';
        const used = [...new Set(item.paints.map((p) => p.hex))].sort();
        return used.filter((hex) => effective(item, hex) !== hex)
          .map((hex) => `${hex}>${effective(item, hex)}`).join(',');
      }

      /** SVG mandiri dengan warna baru, ukuran & viewBox sama seperti file asli. */
      function serialize(item) {
        const vb = item.viewBox;
        const doc = document.implementation.createDocument(SVG_NS, 'svg', null);
        const root = doc.documentElement;
        root.setAttribute('version', '1.1');
        root.setAttribute('width', round(vb.w));
        root.setAttribute('height', round(vb.h));
        root.setAttribute('viewBox', `${round(vb.x)} ${round(vb.y)} ${round(vb.w)} ${round(vb.h)}`);
        root.appendChild(doc.importNode(item.node, true));
        return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(doc);
      }

      function refreshThumb(item) {
        const text = keyOf(item) ? serialize(item) : item.text;
        URL.revokeObjectURL(item.thumb);
        item.thumb = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }));
      }

      /** Ikon baru: catat warna aslinya lalu ikutkan perubahan warna yang sedang berlaku. */
      function sync() {
        state.items.forEach((item) => {
          if (item.paints) return;
          apply(item);
          if (keyOf(item)) refreshThumb(item);
        });
      }

      /**
       * Daftar warna dikelompokkan menurut warna yang SEDANG dipakai (seperti Figma):
       * dua warna asli yang disamakan menjadi satu baris. Urut dari yang paling banyak dipakai.
       */
      function palette() {
        const items = scope();
        const map = new Map();
        items.forEach((item) => {
          analyze(item);
          item.paints.forEach((p) => {
            const key = effective(item, p.hex);
            if (!map.has(key)) map.set(key, { key, origins: new Set(), items: new Set(), pins: new Set(), uses: 0 });
            const entry = map.get(key);
            entry.origins.add(p.hex);
            if (item.colorOverrides && item.colorOverrides[p.hex]) entry.pins.add(item.id);
            entry.items.add(item.id);
            entry.uses++;
          });
        });
        return { total: items.length, list: [...map.values()].sort((a, b) => b.items.size - a.items.size || b.uses - a.uses) };
      }

      /**
       * Semua yang saat ini tampil sebagai `key`: warna asli yang diubah bersama (origins)
       * dan warna yang diatur khusus per ikon (pins: [ikon, warna asli]).
       */
      function targetsOf(key) {
        const origins = new Set();
        const pins = [];
        state.items.forEach((item) => (item.paints || []).forEach((p) => {
          if (effective(item, p.hex) !== key) return;
          if (item.colorOverrides && item.colorOverrides[p.hex]) pins.push([item, p.hex]);
          else origins.add(p.hex);
        }));
        return { origins: [...origins], pins };
      }

      function assign(targets, hex) {
        targets.origins.forEach((origin) => {
          if (hex === origin) delete state.colors[origin];
          else state.colors[origin] = hex;
        });
        targets.pins.forEach(([item, origin]) => {
          if (hex === (state.colors[origin] || origin)) delete item.colorOverrides[origin];
          else item.colorOverrides[origin] = hex;
        });
      }

      const hasOwnColors = (item) => !!(item.colorOverrides && Object.keys(item.colorOverrides).length);

      function render() {
        const box = $('#kd-colors');
        if (!box) return;
        const { total, list } = palette();
        const changed = Object.keys(state.colors).some((hex) => state.colors[hex] !== hex) || state.items.some(hasOwnColors);
        const uniform = total > 1 && list.length > 0 && list.every((c) => c.items.size === total);

        $('#kd-colors-count').textContent = `${list.length} warna`;
        $('#kd-colors-reset').classList.toggle('hidden', !changed);
        const note = $('#kd-colors-note');
        note.className = `text-xs mb-3 ${!total || !list.length ? 'text-kd-muted' : uniform ? 'text-kd-brand-dark font-semibold' : 'text-[#AA5A00] font-semibold'}`;
        note.textContent = !total ? 'Muat ikon untuk melihat warnanya.'
          : !list.length ? 'Tidak ada warna solid yang terdeteksi.'
          : uniform ? `Semua ${total} ikon memakai warna yang seragam. Ubah satu warna, semua ikon ikut berubah.`
          : 'Warna belum seragam antar ikon. Ubah warna di bawah untuk menyamakan — berlaku ke semua ikon yang memakainya.';

        box.innerHTML = list.map((c) => {
          const key = c.key;
          const origins = [...c.origins].sort();
          const isChanged = origins.some((hex) => hex !== key);
          const originText = origins.map((hex) => hex.toUpperCase()).join(', ');
          return `
            <div class="flex items-center gap-2 rounded-xl border ${isChanged ? 'border-kd-brand bg-kd-brand-light/40' : 'border-kd-line'} px-2 py-1.5" data-color-row="${key}">
              <label class="relative w-8 h-8 shrink-0 rounded-lg border border-kd-line cursor-pointer overflow-hidden" style="background:${key}" title="Klik untuk mengubah warna">
                <input type="color" data-color-from="${key}" value="${key}" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Ubah warna ${key}">
              </label>
              <input type="text" data-color-hex="${key}" value="${key.toUpperCase()}" maxlength="7" spellcheck="false" aria-label="Kode warna"
                class="w-[92px] h-8 shrink-0 rounded-md border border-kd-line px-2 text-xs font-mono font-semibold text-kd-ink uppercase outline-none focus:border-kd-brand focus:ring-2 focus:ring-kd-brand/20">
              <span class="min-w-0 flex-1 text-[11px] leading-tight text-kd-muted">
                <span class="block ${c.items.size === total ? 'text-kd-brand-dark font-semibold' : ''}">${c.items.size}/${total} ikon</span>
                ${isChanged ? `<span class="block truncate" title="Warna asli: ${originText}">asli ${originText}</span>` : ''}
                ${c.pins.size ? `<span class="block truncate text-kd-brand-dark" title="Warna ini diatur khusus di ${c.pins.size} ikon">${c.pins.size} ikon diatur sendiri</span>` : ''}
              </span>
              ${isChanged ? `<button type="button" data-action="color-reset" data-hex="${key}" class="w-7 h-7 shrink-0 rounded-md grid place-items-center text-kd-muted hover:text-kd-brand hover:bg-white" title="${origins.length > 1 ? 'Pisahkan lagi ke warna asli masing-masing' : 'Kembalikan warna asli'}" aria-label="Kembalikan warna asli">${icon('refresh', 'w-4 h-4')}</button>` : ''}
            </div>`;
        }).join('');
        Palette.render();
        renderItem();
      }

      /**
       * Ubah satu baris warna (semua warna asli di dalamnya) di semua ikon.
       * `live` = sedang menggeser color picker: daftar tidak dirender ulang agar picker tetap terbuka,
       * dan kelompok warna asli dikunci selama sesi geser itu.
       */
      let session = null;
      function set(key, to, { live = false } = {}) {
        const hex = normalize(to);
        if (!hex) return View.toast('Kode warna tidak valid. Contoh: #9FD0EE', 'error');
        const targets = session && session.key === key ? session.targets : targetsOf(key);
        assign(targets, hex);

        if (live) {
          session = { key, targets };
          pending = { key, hex };
          if (!frame) {
            frame = requestAnimationFrame(() => {
              frame = 0;
              state.items.forEach((item) => {
                apply(item);
                Preview.refreshArtwork(item);
              });
              const row = document.querySelector(`[data-color-row="${pending.key}"]`);
              if (row) {
                row.querySelector('label').style.background = pending.hex;
                row.querySelector('[data-color-hex]').value = pending.hex.toUpperCase();
              }
            });
          }
          return;
        }
        session = null;
        commit();
      }

      /** Kembalikan satu baris (dipisah lagi ke warna asli masing-masing) atau semuanya. */
      function reset(key) {
        if (key) {
          const targets = targetsOf(key);
          targets.origins.forEach((origin) => delete state.colors[origin]);
          targets.pins.forEach(([item, origin]) => delete item.colorOverrides[origin]);
        } else {
          state.colors = {};
          state.items.forEach((item) => { item.colorOverrides = {}; });
        }
        session = null;
        commit();
      }

      /** Terapkan ke semua ikon, perbarui thumbnail, lalu render ulang semua bagian. */
      function commit() {
        History.colorsCommitted();
        state.items.forEach((item) => {
          apply(item);
          refreshThumb(item);
        });
        App.refresh();
        state.items.forEach((item) => Preview.refreshArtwork(item));
      }

      /** Kembalikan gaya asli ikon & lupakan catatan warnanya (dianalisis ulang nanti). */
      function forget(item) {
        if (!item.paints) return;
        const els = elementsOf(item.node);
        item.paints.forEach((p) => { if (els[p.i]) setInline(els[p.i], p.prop, p.inline); });
        item.paints = null;
      }

      /** Ganti beberapa baris sekaligus; kelompok warna asli dihitung dulu agar tidak saling tertukar. */
      function setMany(pairs) {
        pairs.map(([key, to]) => [targetsOf(key), normalize(to)])
          .filter(([, hex]) => hex)
          .forEach(([targets, hex]) => assign(targets, hex));
        session = null;
        commit();
      }

      const rows = () => palette().list;

      /* ---------- warna per ikon (ikon yang sedang dipilih) ---------- */

      let pipette = null;     // { id, key }: warna di ikon aktif yang menunggu warna dari pipet
      let itemSession = null; // kunci kelompok warna selama menggeser color picker
      const activeItem = () => activeItems().find((it) => it.id === state.selectedId) || null;
      const itemById = (id) => state.items.find((it) => it.id === Number(id));

      function itemRows(item) {
        analyze(item);
        const map = new Map();
        item.paints.forEach((p) => {
          const key = effective(item, p.hex);
          if (!map.has(key)) map.set(key, { key, origins: new Set(), own: false, uses: 0 });
          const entry = map.get(key);
          entry.origins.add(p.hex);
          entry.uses++;
          if (item.colorOverrides && item.colorOverrides[p.hex]) entry.own = true;
        });
        return [...map.values()].sort((a, b) => b.uses - a.uses);
      }

      /** Ubah satu warna HANYA di ikon `id`. */
      function setItem(id, key, to, { live = false } = {}) {
        const item = itemById(id);
        if (!item) return;
        const hex = normalize(to);
        if (!hex) return View.toast('Kode warna tidak valid. Contoh: #9FD0EE', 'error');
        analyze(item);
        const origins = itemSession && itemSession.id === item.id && itemSession.key === key
          ? itemSession.origins
          : [...new Set(item.paints.filter((p) => effective(item, p.hex) === key).map((p) => p.hex))];
        item.colorOverrides = item.colorOverrides || {};
        origins.forEach((origin) => {
          if (hex === (state.colors[origin] || origin)) delete item.colorOverrides[origin];
          else item.colorOverrides[origin] = hex;
        });
        if (live) {
          itemSession = { id: item.id, key, origins };
          apply(item);
          Preview.refreshArtwork(item);
          const row = document.querySelector(`[data-item-row="${key}"]`);
          if (row) {
            row.querySelector('label').style.background = hex;
            row.querySelector('[data-item-hex]').value = hex.toUpperCase();
          }
          return;
        }
        itemSession = null;
        commit();
      }

      function resetItem(id) {
        const item = itemById(id);
        if (!item) return;
        item.colorOverrides = {};
        pipette = null;
        commit();
      }

      function togglePipette(key) {
        const item = activeItem();
        if (!item) return;
        pipette = pipette && pipette.key === key ? null : { id: item.id, key };
        renderItem();
        Palette.render();
      }

      const pipetteActive = () => !!pipette;

      /** Pakai warna hasil pipet. false = pipet tidak aktif. */
      function pipetteApply(value) {
        if (!pipette) return false;
        const hex = normalize(value);
        if (!hex) return false;
        const { id, key } = pipette;
        pipette = null;
        setItem(id, key, hex);
        View.toast(key === hex ? 'Warnanya sudah sama.' : `Warna ${key.toUpperCase()} di ikon ini diganti ${hex.toUpperCase()}.`);
        return true;
      }

      function pipetteCancel() {
        if (!pipette) return false;
        pipette = null;
        renderItem();
        Palette.render();
        return true;
      }

      /** Warna dari bentuk yang diklik di kanvas (dibaca dari data warna, aman saat mode outline). */
      function sampleCanvas(target) {
        const node = target && target.closest && target.closest('.kd-item');
        if (!node) return null;
        const item = itemById(node.getAttribute('data-id'));
        const art = node.children[1];
        const root = art && art.firstElementChild;
        if (!item || !root) return null;
        const i = elementsOf(root).indexOf(target);
        if (i < 0) return null;
        analyze(item);
        const paints = item.paints.filter((p) => p.i === i);
        const paint = paints.find((p) => p.prop === 'fill') || paints[0];
        return paint ? effective(item, paint.hex) : null;
      }

      function renderItem() {
        const box = $('#kd-item-colors');
        if (!box) return;
        const item = activeItem();
        if (pipette && (!item || pipette.id !== item.id)) {
          pipette = null;
          Palette.render();
        }
        $('#kd-stage').classList.toggle('kd-pipette', !!pipette);
        box.classList.toggle('hidden', !item);
        if (!item) {
          box.innerHTML = '';
          return;
        }
        const index = activeItems().indexOf(item);
        const list = itemRows(item);
        box.innerHTML = `
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <b class="text-xs text-kd-ink">Warna ikon ${index + 1}</b>
            <span class="${CLS.chip} !py-0.5">${list.length} warna</span>
            ${hasOwnColors(item) ? `<button type="button" data-action="item-colors-reset" class="ml-auto inline-flex items-center gap-1 text-xs font-bold text-kd-brand hover:underline">${icon('refresh', 'w-4 h-4')}Kembalikan warna ikon ini</button>` : ''}
          </div>
          ${list.length ? `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">${list.map((r) => {
            const origins = [...r.origins].sort().map((hex) => hex.toUpperCase()).join(', ');
            const active = pipette && pipette.key === r.key;
            return `
              <div data-item-row="${r.key}" class="flex items-center gap-2 rounded-xl border ${active ? 'border-kd-brand ring-2 ring-kd-brand/30' : r.own ? 'border-kd-brand' : 'border-kd-line'} bg-white px-2 py-1.5">
                <label class="relative w-8 h-8 shrink-0 rounded-lg border border-kd-line cursor-pointer overflow-hidden" style="background:${r.key}" title="Ubah warna ini di ikon ${index + 1} saja">
                  <input type="color" data-item-color="${r.key}" value="${r.key}" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Ubah warna ${r.key} di ikon ini">
                </label>
                <input type="text" data-item-hex="${r.key}" value="${r.key.toUpperCase()}" maxlength="7" spellcheck="false" aria-label="Kode warna ikon ini"
                  class="w-[92px] h-8 shrink-0 rounded-md border border-kd-line px-2 text-xs font-mono font-semibold text-kd-ink uppercase outline-none focus:border-kd-brand focus:ring-2 focus:ring-kd-brand/20">
                <span class="min-w-0 flex-1 text-[11px] leading-tight text-kd-muted">
                  ${r.own ? `<span class="block font-semibold text-kd-brand-dark">diatur sendiri</span><span class="block truncate" title="Warna asli: ${origins}">asli ${origins}</span>` : `<span class="block truncate">${r.uses} bagian</span>`}
                </span>
                <button type="button" data-action="item-pipette" data-hex="${r.key}" aria-pressed="${!!active}"
                  class="w-8 h-8 shrink-0 rounded-lg border grid place-items-center ${active ? 'border-kd-brand bg-kd-brand text-white' : 'border-kd-line text-kd-muted hover:text-kd-brand hover:border-kd-brand'}"
                  title="Pipet: ambil warna dari ikon lain" aria-label="Pipet untuk warna ${r.key.toUpperCase()}">${icon('eyedropper', 'w-4 h-4')}</button>
              </div>`;
          }).join('')}</div>` : '<p class="text-xs text-kd-muted">Tidak ada warna solid yang terdeteksi di ikon ini.</p>'}
          <p class="mt-2 text-[11px] ${pipette ? 'text-kd-brand-dark font-semibold' : 'text-kd-muted'}">
            ${pipette
              ? `Pipet aktif untuk ${pipette.key.toUpperCase()} — klik bentuk pada ikon lain di kanvas, warna palet, atau baris di daftar Warna ikon. Esc untuk batal.`
              : 'Perubahan di sini hanya untuk ikon ini. Klik pipet lalu klik ikon lain di kanvas untuk menyamakan warnanya.'}
          </p>`;
      }

      return {
        sync, render, set, reset, keyOf, serialize, forget, setInline, setMany, rows, commit,
        renderItem, setItem, resetItem, togglePipette, pipetteActive, pipetteApply, pipetteCancel, sampleCanvas
      };
    })();

    /* =====================================================================
     * 8e. HILANGKAN TRANSPARANSI — bagian transparan (opacity, fill/stroke-opacity,
     *     rgba, #RRGGBBAA) diganti warna solid yang tampak sama di atas latar putih.
     *     Bagian yang transparan penuh dibuat "none". Atribut opacity lalu dihapus.
     * ===================================================================== */
    const Alpha = (() => {
      const SHAPES = 'path, rect, circle, ellipse, line, polyline, polygon, text, tspan, use';
      const OPACITY_ATTRS = ['opacity', 'fill-opacity', 'stroke-opacity', 'stop-opacity'];
      const OPACITY_CSS = /(^|[\s;{])(?:fill-|stroke-|stop-)?opacity\s*:[^;}]*;?/gi;
      const elementsOf = (node) => [node, ...node.querySelectorAll('*')];

      /** "rgb(1, 2, 3)" / "rgba(1, 2, 3, 0.5)" → {r, g, b, a}; selain itu null. */
      function parse(value) {
        const m = String(value || '').match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+)(%?))?\s*\)$/i);
        if (!m) return null;
        const a = m[4] === undefined ? 1 : parseFloat(m[4]) / (m[5] ? 100 : 1);
        return { r: +m[1], g: +m[2], b: +m[3], a };
      }
      const num = (v, fallback = 1) => (Number.isFinite(parseFloat(v)) ? parseFloat(v) : fallback);
      /** Warna yang tampak di atas putih dengan tingkat kepekatan `a`. */
      const blend = (c, a) => '#' + [c.r, c.g, c.b]
        .map((v) => Math.round(v * a + 255 * (1 - a)).toString(16).padStart(2, '0')).join('');

      /** Ikon ini memakai transparansi? (deteksi yang sama dengan peringatan). */
      const has = (item) => item.warnings.includes(WARN.opacity) || Designer.hasAlphaColor(item.text);

      function flatten(item) {
        Colors.forget(item); // kerjakan di warna asli; perubahan warna diterapkan lagi sesudahnya
        History.touch(item);
        const host = svgEl(document, 'svg', { style: 'position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden' });
        const clone = document.importNode(item.node, true);
        host.appendChild(clone);
        document.body.appendChild(host);
        const original = elementsOf(item.node);
        const updates = [];
        try {
          const groupAlpha = (el) => {
            let a = 1;
            for (let n = el; n && n !== host; n = n.parentNode) a *= num(getComputedStyle(n).opacity);
            return a;
          };
          elementsOf(clone).forEach((el, i) => {
            const cs = getComputedStyle(el);
            const paints = el.localName === 'stop' ? [['stop-color', num(cs.getPropertyValue('stop-opacity'))]]
              : el.matches(SHAPES) ? [['fill', num(cs.getPropertyValue('fill-opacity'))], ['stroke', num(cs.getPropertyValue('stroke-opacity'))]]
                .map(([prop, a]) => [prop, a * groupAlpha(el)]) : [];
            paints.forEach(([prop, extra]) => {
              const c = parse(cs.getPropertyValue(prop));
              if (!c) return; // none / url(gradient)
              const a = Math.max(0, Math.min(1, c.a * extra));
              if (a >= 0.999 && c.a >= 0.999) return;
              updates.push([original[i], prop, a <= 0.001 && prop !== 'stop-color' ? 'none' : blend(c, a)]);
            });
          });
        } finally {
          host.remove();
        }
        updates.forEach(([el, prop, value]) => {
          if (!el) return;
          el.removeAttribute(prop);
          Colors.setInline(el, prop, value);
        });
        original.forEach((el) => {
          OPACITY_ATTRS.forEach((attr) => {
            el.removeAttribute(attr);
            Colors.setInline(el, attr, '');
          });
          if (el.localName === 'style') el.textContent = el.textContent.replace(OPACITY_CSS, '$1');
        });

        // Jadikan versi tanpa transparansi sebagai "file asli" ikon ini (id kembali tanpa prefix kdN-).
        item.text = Colors.serialize(item).split(`kd${item.id}-`).join('');
        item.hash = null;
        item.split = undefined;
        item.alphaFixed = true;
        item.warnings = item.warnings.filter((w) => w !== WARN.opacity);
        URL.revokeObjectURL(item.thumb);
        item.thumb = URL.createObjectURL(new Blob([item.text], { type: 'image/svg+xml' }));
      }

      /** id = satu ikon; tanpa id = semua ikon yang memakai transparansi. */
      function fix(id) {
        const targets = state.items.filter((it) => (id ? String(it.id) === String(id) : has(it)));
        if (!targets.length) return;
        if (Designer.busy()) return View.toast('Tunggu pengiriman ke Drive selesai.', 'error');
        History.label('Hilangkan transparansi');
        targets.forEach(flatten);
        App.refresh(); // warna dianalisis ulang & perubahan warna yang berlaku diterapkan lagi
        targets.forEach((it) => Preview.refreshArtwork(it));
        View.toast(targets.length > 1
          ? `Transparansi dihilangkan dari ${targets.length} ikon.`
          : `Transparansi ikon ${state.items.indexOf(targets[0]) + 1} dihilangkan.`);
      }

      /** Tombol perbaikan untuk daftar peringatan (admin & desainer). */
      const button = (id, label = 'Hilangkan transparansi') => `<button type="button" data-action="alpha-fix" ${id ? `data-id="${id}"` : ''}
        class="shrink-0 ml-auto inline-flex items-center gap-1 h-6 px-2 rounded-md border border-[#FFB766] bg-white text-[11px] font-bold text-[#AA5A00] hover:bg-[#FFE7C7] whitespace-nowrap"
        title="Ganti bagian transparan dengan warna solid yang tampak sama di atas latar putih">${icon('check', 'w-3.5 h-3.5')}${label}</button>`;

      return { has, fix, button };
    })();

    /* =====================================================================
     * 8g. GENERATOR PALET WARNA — 5 warna per klik "Generate"; skema berganti
     *     bergiliran (Monochromatic → Analogous → Complementary → Triad →
     *     Split-Complementary → Tetradic). Dihitung di browser, tanpa AI/internet.
     * ===================================================================== */
    const Palette = (() => {
      // [geser hue (°), pengali saturasi, lightness] untuk tiap warna
      const SCHEMES = [
        { name: 'Monochromatic', rule: 'satu warna, 5 tingkat terang–gelap',
          tones: [[0, 1, 0.30], [0, 1, 0.42], [0, 1, 0.54], [0, 0.9, 0.68], [0, 0.8, 0.82]] },
        { name: 'Analogous', rule: '5 warna bersebelahan (jarak 30°)',
          tones: [[-60, 1, 0.50], [-30, 1, 0.56], [0, 1, 0.50], [30, 1, 0.56], [60, 1, 0.50]] },
        { name: 'Complementary', rule: 'warna dasar + seberangnya (180°)',
          tones: [[0, 1, 0.38], [0, 1, 0.56], [0, 0.7, 0.80], [180, 1, 0.46], [180, 0.9, 0.66]] },
        { name: 'Triad', rule: '3 warna berjarak 120°',
          tones: [[0, 1, 0.50], [120, 1, 0.50], [240, 1, 0.50], [0, 0.8, 0.76], [240, 1, 0.32]] },
        { name: 'Split-Complementary', rule: 'warna dasar + kiri & kanan seberangnya (150° & 210°)',
          tones: [[0, 1, 0.50], [150, 1, 0.50], [210, 1, 0.50], [0, 0.8, 0.76], [150, 1, 0.32]] },
        { name: 'Tetradic', rule: '4 warna membentuk persegi panjang (0°, 60°, 180°, 240°)',
          tones: [[0, 1, 0.50], [60, 1, 0.50], [180, 1, 0.50], [240, 1, 0.50], [0, 0.8, 0.78]] }
      ];
      const HISTORY_MAX = 30;
      let current = null; // { scheme, colors }
      let history = [];
      let picked = null;
      let bound = false;

      function hslToHex(h, s, l) {
        const f = (n) => {
          const k = (n + h / 30) % 12;
          const a = s * Math.min(l, 1 - l);
          const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
          return Math.round(c * 255).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
      }

      /** #rrggbb → { s, l } (0..1) untuk mengenali hitam/putih/abu-abu. */
      function satLight(hex) {
        const n = parseInt(hex.slice(1), 16);
        const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const l = (max + min) / 2;
        const s = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1));
        return { s, l };
      }
      const isNeutral = (hex) => {
        const { s, l } = satLight(hex);
        return s < 0.12 || l < 0.08 || l > 0.96;
      };

      function make(scheme) {
        const base = Math.random() * 360;
        const sat = 0.55 + Math.random() * 0.25;
        const shift = (Math.random() - 0.5) * 0.08; // variasi kecil terang-gelap
        const colors = SCHEMES[scheme].tones.map(([dh, ds, l]) =>
          hslToHex((base + dh + 360) % 360, clamp(sat * ds, 0, 1), clamp(l + shift, 0.12, 0.9)));
        return { scheme, colors };
      }

      function generate() {
        if (current) {
          history.push(current);
          if (history.length > HISTORY_MAX) history.shift();
        }
        current = make(current ? (current.scheme + 1) % SCHEMES.length : 0);
        picked = null;
        render();
      }

      function previous() {
        if (!history.length) return;
        current = history.pop();
        picked = null;
        render();
      }

      /** Balik urutan 5 warna palet (warna ke-1 jadi ke-5, dst.). */
      function flip() {
        if (!current) return;
        current = { ...current, colors: current.colors.slice().reverse() };
        render();
        View.toast('Urutan warna palet dibalik.');
      }

      function pick(hex) {
        if (Colors.pipetteApply(hex)) return; // pipet aktif: warna palet dipakai untuk ikon aktif
        picked = picked === hex ? null : hex;
        render();
      }

      /** Esc: batalkan pilihan warna palet. true = ada yang dibatalkan. */
      function cancel() {
        if (!picked) return false;
        picked = null;
        render();
        return true;
      }

      async function copy(hex) {
        const text = hex.toUpperCase();
        let ok = false;
        try {
          await navigator.clipboard.writeText(text);
          ok = true;
        } catch (err) {
          // Cadangan untuk browser yang menolak Clipboard API
          const area = document.createElement('textarea');
          area.value = text;
          area.setAttribute('readonly', '');
          area.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
          $('#kd-modal').appendChild(area);
          area.select();
          try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
          area.remove();
        }
        View.toast(ok ? `Kode ${text} disalin.` : `Tidak bisa menyalin otomatis. Kode: ${text}`, ok ? 'info' : 'error');
      }

      /** Klik baris "Warna ikon" saat warna palet dipilih → ganti dengan warna palet. */
      function onRowClick(e) {
        const pip = Colors.pipetteActive();
        if (!picked && !pip) return;
        const row = e.target.closest('[data-color-row]');
        if (!row || e.target.closest('[data-action]')) return;
        e.preventDefault();
        e.stopPropagation();
        if (pip) {
          Colors.pipetteApply(row.dataset.colorRow);
          return;
        }
        Colors.set(row.dataset.colorRow, picked);
        View.toast(`Warna diganti ke ${picked.toUpperCase()}. Klik baris lain atau Esc untuk selesai.`);
      }

      /** Warna ikon terbanyak → warna palet ke-1, dst. Hitam/putih/abu-abu dilewati. */
      function applyAll() {
        const rows = Colors.rows().filter((r) => !isNeutral(r.key));
        if (!rows.length) return View.toast('Tidak ada warna ikon (selain hitam/putih/abu-abu) untuk diganti.', 'error');
        const pairs = rows.map((r, i) => [r.key, current.colors[i % current.colors.length]]);
        picked = null;
        Colors.setMany(pairs);
        const skipped = Colors.rows().filter((r) => isNeutral(r.key)).length;
        View.toast(`Palet ${SCHEMES[current.scheme].name} diterapkan ke ${rows.length} warna${skipped ? ' — hitam/putih/abu-abu tidak diubah' : ''}.`);
      }

      function render() {
        const box = $('#kd-palette');
        if (!box) return;
        if (!bound) {
          $('#kd-colors').addEventListener('click', onRowClick, true);
          bound = true;
        }
        if (!current) current = make(0);
        const scheme = SCHEMES[current.scheme];
        const hasColors = Colors.rows().some((r) => !isNeutral(r.key));
        $('#kd-colors').classList.toggle('kd-pal-picking', !!picked || Colors.pipetteActive());

        box.innerHTML = `
          <div class="flex flex-wrap items-center gap-2 mb-2.5">
            <div class="min-w-0 basis-full sm:basis-0 sm:flex-1">
              <b class="text-xs text-kd-ink">Palet warna</b>
              <span class="ml-1 inline-flex items-center rounded-full bg-white border border-kd-line px-2 py-0.5 text-[11px] font-bold text-kd-brand-dark" title="${escapeHtml(scheme.rule)}">${scheme.name}</span>
              <span class="block text-[11px] text-kd-muted">${escapeHtml(scheme.rule)} · skema ${current.scheme + 1}/${SCHEMES.length}</span>
            </div>
            <button type="button" data-action="pal-prev" ${history.length ? '' : 'disabled'} class="max-sm:flex-1 h-8 px-2.5 rounded-lg border border-kd-line bg-white text-xs font-bold text-kd-ink hover:border-kd-brand disabled:opacity-40 disabled:cursor-not-allowed" title="Kembali ke palet sebelumnya">Sebelumnya</button>
            <button type="button" data-action="pal-flip" class="max-sm:flex-1 inline-flex items-center justify-center gap-1 h-8 px-2.5 rounded-lg border border-kd-line bg-white text-xs font-bold text-kd-ink hover:border-kd-brand hover:text-kd-brand" title="Balik urutan warna palet (ke-1 jadi ke-5)">${icon('shuffle', 'w-4 h-4')}Balik</button>
            <button type="button" data-action="pal-generate" class="max-sm:flex-1 inline-flex items-center justify-center gap-1 h-8 px-3 rounded-lg bg-kd-brand text-white text-xs font-bold hover:bg-kd-brand-dark" title="Palet baru dengan skema berikutnya">${icon('refresh', 'w-4 h-4')}Generate</button>
          </div>
          <div class="grid grid-cols-5 gap-1.5 sm:gap-2">
            ${current.colors.map((hex) => `
              <div class="min-w-0">
                <button type="button" data-action="pal-pick" data-hex="${hex}" aria-pressed="${picked === hex}"
                  class="block w-full h-10 sm:h-12 rounded-lg border border-black/10 transition-transform ${picked === hex ? 'ring-2 ring-offset-2 ring-kd-brand scale-[1.04]' : 'hover:scale-[1.03]'}"
                  style="background:${hex}" title="Pilih ${hex.toUpperCase()}, lalu klik warna ikon di bawah" aria-label="Pilih warna ${hex.toUpperCase()}"></button>
                <button type="button" data-action="pal-copy" data-hex="${hex}" class="block w-full mt-1 text-[10px] sm:text-[11px] font-mono font-semibold text-kd-muted hover:text-kd-brand truncate" title="Salin kode warna">${hex.toUpperCase()}</button>
              </div>`).join('')}
          </div>
          <div class="flex flex-wrap items-center gap-2 mt-2.5">
            <p class="min-w-0 flex-1 text-[11px] ${picked ? 'text-kd-brand-dark font-semibold' : 'text-kd-muted'}">
              ${picked
                ? `Warna ${picked.toUpperCase()} dipilih — klik baris warna ikon di bawah untuk menggantinya. Klik warna palet lagi atau Esc untuk batal.`
                : 'Klik warna palet lalu klik warna ikon untuk mengganti, atau terapkan sekaligus.'}
            </p>
            <button type="button" data-action="pal-apply" ${hasColors ? '' : 'disabled'} class="h-8 px-2.5 rounded-lg border border-kd-brand bg-white text-xs font-bold text-kd-brand hover:bg-kd-brand-light disabled:opacity-40 disabled:cursor-not-allowed"
              title="Warna ikon terbanyak mendapat warna palet ke-1, dst. Hitam, putih, dan abu-abu tidak diubah.">Terapkan otomatis</button>
          </div>`;
      }

      return { render, generate, previous, flip, pick, copy, applyAll, cancel };
    })();

    /* =====================================================================
     * 8f. PERIKSA DETAIL — zoom per ikon, mode outline & titik anchor.
     *     Hanya tampilan: tidak mengubah file, urutan, maupun hasil ekspor.
     * ===================================================================== */
    const Inspect = (() => {
      const LATAR = [
        { value: 'checker', label: 'Transparan' },
        { value: '#FFFFFF', label: 'Putih' },
        { value: '#000000', label: 'Hitam' },
        { value: '#FF00FF', label: 'Magenta' },
        { value: '#00FF00', label: 'Hijau' }
      ];
      const PAINTED = 'path, rect, circle, ellipse, line, polyline, polygon';
      const HIDDEN = 'defs, clipPath, mask, symbol, pattern, marker, [data-kd-backgroup]';
      const MAX_ANCHORS = 20000;
      const opts = { outline: false, anchors: false, bg: 'checker', pick: false, stk: false, multi: false, pcolor: false, edit: false, sb: false, tf: false };
      const selecting = () => opts.pick || opts.stk || opts.tf;
      let panelOpen = true;
      const picked = new Set(); // "index:sub" bagian yang dipilih untuk dihapus
      let hits = null;    // lapisan tak terlihat untuk klik per bagian
      let marks = null;   // sorotan pilihan + penanda titik liar
      let parts = [];
      let down = null;
      let el = null;
      let view = null;
      let svg = null;
      let dots = null;
      let v = null; // { id, w, h, s, cx, cy, fit, fitted, anchors, shapes }
      const pointers = new Map();
      let gesture = null;

      const isOpen = () => !!(el && !el.classList.contains('hidden'));
      const list = () => state.items;
      const btn = 'inline-flex items-center justify-center gap-1 h-8 min-w-[32px] px-2 rounded-lg border text-xs font-bold transition-colors';
      const off = 'border-kd-line text-kd-ink bg-white hover:border-kd-brand hover:text-kd-brand';
      const on = 'border-kd-brand text-kd-brand-dark bg-kd-brand-light';

      function mount() {
        if (el) return;
        el = document.createElement('div');
        el.id = 'kd-inspect';
        el.className = 'fixed inset-0 z-[75] hidden flex items-center justify-center bg-slate-900/70 p-0 sm:p-4';
        el.innerHTML = `
          <div class="bg-white w-full h-full sm:h-[92vh] sm:max-w-6xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden" role="dialog" aria-modal="true" aria-label="Periksa detail ikon">
            <div class="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-kd-line">
              <button type="button" data-ins="prev" class="${btn} ${off}" title="Ikon sebelumnya (←)" aria-label="Ikon sebelumnya">${icon('chevronLeft', 'w-4 h-4')}</button>
              <div class="min-w-0 flex-1 text-center">
                <b id="kd-ins-title" class="block text-sm text-kd-ink truncate"></b>
                <span id="kd-ins-sub" class="block text-[11px] text-kd-muted truncate"></span>
              </div>
              <button type="button" data-ins="next" class="${btn} ${off}" title="Ikon berikutnya (→)" aria-label="Ikon berikutnya">${icon('chevronRight', 'w-4 h-4')}</button>
              <button type="button" data-ins="close" class="w-9 h-9 shrink-0 rounded-lg grid place-items-center text-kd-muted hover:text-kd-ink hover:bg-kd-surface" title="Tutup (Esc)" aria-label="Tutup">${icon('close')}</button>
            </div>
            <div class="flex flex-nowrap items-center gap-1.5 px-3 sm:px-4 py-2 border-b border-kd-line overflow-x-auto [&>*]:shrink-0" style="scrollbar-width:thin">
              <div class="inline-flex items-center gap-1">
                <button type="button" data-ins="zoom-out" class="${btn} ${off}" title="Perkecil (−)" aria-label="Perkecil">${icon('minus', 'w-4 h-4')}</button>
                <span id="kd-ins-pct" class="w-14 text-center text-xs font-bold text-kd-ink tabular-nums"></span>
                <button type="button" data-ins="zoom-in" class="${btn} ${off}" title="Perbesar (+)" aria-label="Perbesar">${icon('plus', 'w-4 h-4')}</button>
                <button type="button" data-ins="fit" class="${btn} ${off}" title="Pas layar (0)">Pas</button>
                <button type="button" data-ins="actual" class="${btn} ${off}" title="Ukuran asli file (1)">100%</button>
                <button type="button" data-ins="undo" data-hist="undo" class="${btn} ${off}" aria-label="Urungkan">${icon('undo', 'w-4 h-4')}</button>
                <button type="button" data-ins="redo" data-hist="redo" class="${btn} ${off}" aria-label="Ulangi">${icon('redo', 'w-4 h-4')}</button>
              </div>
              <span class="w-px h-6 bg-kd-line mx-1 max-sm:hidden"></span>
              <button type="button" data-ins="outline" class="${btn} ${off}" title="Tampilkan garis bentuk saja (O)">${icon('outline', 'w-4 h-4')}Outline</button>
              <button type="button" data-ins="anchors" class="${btn} ${off}" title="Tampilkan titik anchor path (A)">${icon('anchors', 'w-4 h-4')}Titik anchor</button>
              <button type="button" data-ins="tf" class="${btn} ${off}" title="Transform: pindah, ubah ukuran, putar, flip, urutan layer, duplikat (V)">${icon('cursor', 'w-4 h-4')}Transform</button>
              <button type="button" data-ins="pick" class="${btn} ${off}" title="Pilih bagian ikon untuk dihapus, diganti warna, diberi garis, atau garis → fill (P)">${icon('cursor', 'w-4 h-4')}Pilih</button>
              <button type="button" data-ins="edit" class="${btn} ${off}" title="Edit titik anchor: pindah (menempel ke titik lain), tambah, hapus (E)">${icon('pen', 'w-4 h-4')}Edit titik</button>
              <button type="button" data-ins="sb" class="${btn} ${off}" title="Shape builder: klik / seret area untuk menggabung, tahan Alt / Option untuk menghapus (B)">${icon('shapes', 'w-4 h-4')}Shape builder</button>
              <button type="button" data-ins="stk" class="${btn} ${off}" title="Ubah tebal, warna, gaya, ujung &amp; sudut garis (G)">${icon('adjust', 'w-4 h-4')}Garis</button>
              <button type="button" data-ins="clean" class="hidden ${btn} border-[#FFB766] bg-[#FFF5E6] text-[#AA5A00] hover:bg-[#FFE7C7]" title="Buang titik anchor yang tidak terlihat"></button>
              <button type="button" data-ins="cleanl" class="hidden ${btn} border-[#FFB766] bg-[#FFF5E6] text-[#AA5A00] hover:bg-[#FFE7C7]" title="Buang garis terbuka tanpa garis tepi (ditandai merah putus-putus)"></button>
              <button type="button" data-ins="stroke" class="hidden ${btn} border-[#FFB766] bg-[#FFF5E6] text-[#AA5A00] hover:bg-[#FFE7C7]" title="Ubah garis (stroke) jadi bentuk berisi (fill); warna &amp; tebal tetap sama. Di mode Outline, garis ditandai oranye."></button>
              <button type="button" data-ins="flat" class="hidden ${btn} border-[#FFB766] bg-[#FFF5E6] text-[#AA5A00] hover:bg-[#FFE7C7]" title="Ubah mask / clip jadi bentuk biasa (seperti Flatten di Figma); tampilan tetap sama">${icon('shapes', 'w-4 h-4')}Flatten</button>
              <button type="button" data-ins="frame" class="hidden ${btn} border-[#FFB766] bg-[#FFF5E6] text-[#AA5A00] hover:bg-[#FFE7C7]" title="Frame (viewBox) jauh lebih besar dari gambar — pangkas ke batas gambar; bentuk tidak berubah">${icon('crop', 'w-4 h-4')}Pangkas frame</button>
              <span class="w-px h-6 bg-kd-line mx-1 max-sm:hidden"></span>
              <div id="kd-ins-bg" class="inline-flex items-center gap-1"></div>
            </div>
            <div class="flex-1 min-h-0 flex flex-col sm:flex-row">
            <div id="kd-ins-view" class="relative flex-1 min-h-0 overflow-hidden"></div>
            <aside id="kd-ins-panel" class="hidden shrink-0 flex flex-col bg-white border-t sm:border-t-0 sm:border-l border-kd-line sm:w-[300px] max-sm:max-h-[45vh]">
              <button type="button" data-ins="panel" class="sm:hidden flex items-center justify-center gap-1 py-1 text-[11px] font-semibold text-kd-muted border-b border-kd-line" aria-expanded="true">${icon('chevronDown', 'w-4 h-4')}<span>Sembunyikan panel</span></button>
              <div id="kd-ins-panelbody" class="min-h-0 flex-1 overflow-y-auto">
            <div id="kd-ins-tfbar" class="hidden px-3 py-2.5 border-b border-kd-line bg-blue-50/40"></div>
            <div id="kd-ins-selbar" class="hidden flex flex-wrap items-center gap-1.5 px-3 sm:px-4 py-2 border-b border-kd-line bg-rose-50/60">
              <button type="button" data-ins="multi" class="${btn} ${off}" title="Aktif: setiap ketukan menambah / mengurangi pilihan (sama seperti Shift+klik)">${icon('squares', 'w-4 h-4')}Pilih banyak</button>
              <button type="button" data-ins="all" class="${btn} ${off}" title="Pilih semua bagian ikon">Semua</button>
              <button type="button" data-ins="none" class="${btn} ${off}" title="Kosongkan pilihan (Esc)">Batal pilih</button>
              <span id="kd-ins-pickhint" class="min-w-0 basis-full text-[11px] text-kd-ink"></span>
            </div>
            <div id="kd-ins-pickbar" class="hidden px-3 sm:px-4 py-2 border-b border-kd-line bg-rose-50/30 space-y-2">
              <div class="flex flex-wrap items-center gap-1.5">
                <button type="button" data-ins="pcolor" class="${btn} ${off} disabled:opacity-40" title="Ganti warna bagian terpilih">${icon('swatch', 'w-4 h-4')}Warna</button>
                <button type="button" data-ins="pstroke" class="${btn} ${off} disabled:opacity-40" title="Tambah / ubah garis bagian terpilih">${icon('adjust', 'w-4 h-4')}Garis</button>
                <button type="button" data-ins="pfill" class="hidden ${btn} border-[#FFB766] bg-[#FFF5E6] text-[#AA5A00] hover:bg-[#FFE7C7] disabled:opacity-40" title="Ubah garis bagian terpilih jadi bentuk berisi (fill)">${icon('outline', 'w-4 h-4')}<span>Garis → fill</span></button>
                <button type="button" data-ins="delete" class="${btn} border-kd-danger bg-kd-danger text-white hover:bg-rose-600 disabled:opacity-40" title="Hapus bagian terpilih (Delete)">${icon('trash', 'w-4 h-4')}<span>Hapus</span></button>
              </div>
              <div id="kd-ins-pcolor" class="hidden"></div>
            </div>
            <div id="kd-ins-editbar" class="hidden px-3 py-2.5 border-b border-kd-line bg-blue-50/60 space-y-2.5">
              <div>
                <p class="text-[11px] font-bold text-kd-muted mb-1">Alat</p>
                <div class="grid grid-cols-3 gap-1.5">
                  <button type="button" data-ins="esnap" class="${btn} ${off}" title="Menempel ke titik anchor lain & garis sejajar (tahan Alt untuk lepas sementara)">${icon('anchors', 'w-4 h-4')}Snap</button>
                  <button type="button" data-ins="eadd" class="${btn} ${off}" title="Ketuk garis bentuk untuk menambah titik (atau klik dua kali di garis)">${icon('plus', 'w-4 h-4')}Titik</button>
                  <button type="button" data-ins="elasso" class="${btn} ${off}" title="Lasso (Q): gambar bebas mengelilingi titik untuk memilihnya · Shift = tambah, Alt / Option = kurangi">${icon('lasso', 'w-4 h-4')}Lasso</button>
                </div>
              </div>
              <div>
                <p class="text-[11px] font-bold text-kd-muted mb-1">Pilih titik</p>
                <div class="grid grid-cols-[1.5fr_1fr_1fr] gap-1.5">
                  <button type="button" data-ins="emulti" class="${btn} ${off}" title="Setiap ketukan menambah / mengurangi titik terpilih (sama seperti Shift+klik)">${icon('squares', 'w-4 h-4')}Pilih banyak</button>
                  <button type="button" data-ins="eall" class="${btn} ${off} disabled:opacity-40" title="Pilih semua titik bentuk ini (Ctrl/Cmd+A)">Semua</button>
                  <button type="button" data-ins="enone" class="${btn} ${off} disabled:opacity-40" title="Kosongkan pilihan titik (Esc)">Batal</button>
                </div>
                <button type="button" data-ins="edel" class="${btn} w-full mt-1.5 border-kd-danger bg-kd-danger text-white hover:bg-rose-600 disabled:opacity-40" title="Hapus titik terpilih (Delete)">${icon('trash', 'w-4 h-4')}<span>Hapus titik</span></button>
              </div>
              <p id="kd-ins-edithint" class="text-[11px] text-kd-ink"></p>
              <div id="kd-ins-editopts" class="hidden space-y-2.5 pt-2.5 border-t border-blue-100"></div>
            </div>
            <div id="kd-ins-offbar" class="hidden px-3 py-2.5 border-b border-kd-line bg-white"></div>
            <div id="kd-ins-sbbar" class="hidden flex flex-wrap items-center gap-1.5 px-3 sm:px-4 py-2 border-b border-kd-line bg-blue-50/60">
              <div class="inline-flex rounded-lg border border-kd-line bg-white p-0.5" role="group" aria-label="Mode Shape builder">
                <button type="button" data-ins="sbmerge" class="${btn} ${off}" title="Klik / seret area untuk menggabung jadi satu bentuk">${icon('plus', 'w-4 h-4')}Gabung</button>
                <button type="button" data-ins="sbdel" class="${btn} ${off}" title="Klik / seret area untuk menghapusnya (sama seperti menahan Alt / Option)">${icon('minus', 'w-4 h-4')}Hapus</button>
              </div>
              <span id="kd-ins-sbhint" class="min-w-0 basis-full text-[11px] text-kd-ink"></span>
              <button type="button" data-ins="sb" class="${btn} ${off}" title="Keluar dari Shape builder (Esc)">Selesai</button>
            </div>
            <div id="kd-ins-stkbar" class="hidden px-3 py-2.5 border-b border-kd-line bg-kd-surface/70"></div>
              </div>
            </aside>
            </div>
            <p class="max-sm:hidden px-3 sm:px-4 py-2 text-[11px] text-kd-muted border-t border-kd-line">
              Scroll / cubit untuk zoom · seret untuk menggeser · klik dua kali untuk memperbesar (Shift = perkecil) · ← → pindah ikon · Esc tutup
            </p>
          </div>`;
        $('#kd-modal').appendChild(el);
        view = $('#kd-ins-view', el);

        el.addEventListener('click', (e) => {
          if (e.target === el) return close();
          const b = e.target.closest('[data-ins]');
          if (!b) return;
          const act = b.dataset.ins;
          if (act === 'close') close();
          else if (act === 'prev') step(-1);
          else if (act === 'next') step(1);
          else if (act === 'zoom-in') zoomAt(2);
          else if (act === 'zoom-out') zoomAt(0.5);
          else if (act === 'fit') fit();
          else if (act === 'actual') setScale(1);
          else if (act === 'outline') toggle('outline');
          else if (act === 'anchors') toggle('anchors');
          else if (act === 'pick') togglePick();
          else if (act === 'stk') toggleStroke();
          else if (act === 'edit') toggleEdit();
          else if (act === 'sb') toggleSb();
          else if (act === 'tf') toggleTf();
          else if (act === 'tflock') { tf.lock = !tf.lock; paintTf(); }
          else if (act === 'tfflipx' || act === 'tfflipy') tfFlip(act === 'tfflipx');
          else if (act === 'tfdup') tfDuplicate();
          else if (act === 'tfalign') tfAlign(b.dataset.where);
          else if (act === 'tfdisth' || act === 'tfdistv') tfDistribute(act === 'tfdisth');
          else if (act === 'tftidy') tfTidy();
          else if (act === 'tftop' || act === 'tfup' || act === 'tfdown' || act === 'tfbottom') tfOrder(act.slice(2));
          else if (act === 'panel') {
            panelOpen = !panelOpen;
            $('#kd-ins-panelbody', el).classList.toggle('hidden', !panelOpen);
            b.setAttribute('aria-expanded', String(panelOpen));
            b.lastElementChild.textContent = panelOpen ? 'Sembunyikan panel' : 'Tampilkan panel';
            b.firstElementChild.classList.toggle('rotate-180', !panelOpen);
          }
          else if (act === 'sbmerge' || act === 'sbdel') { sb.mode = act === 'sbdel' ? 'delete' : 'merge'; paintSbbar(); sbRender(); }
          else if (act === 'esnap') { ed.snap = !ed.snap; paintEditbar(); }
          else if (act === 'eadd') { ed.add = !ed.add; paintEditbar(); }
          else if (act === 'emulti') { opts.multi = !opts.multi; paintEditbar(); paintPickbar(); }
          else if (act === 'edel') editDelete();
          else if (act === 'elasso') { ed.lasso = !ed.lasso; paintEditbar(); }
          else if (act === 'eall') editSelectAll();
          else if (act === 'enone') { endRadius(); ed.sel.clear(); drawEdit(); paintEditbar(); }
          else if (act === 'offtoggle') offToggle();
          else if (act === 'offjoin') { offv.join = b.dataset.value; paintOffbar(); }
          else if (act === 'offapply') offApply();
          else if (act === 'emirror') applyMirror(b.dataset.mode);
          else if (act === 'delete') deletePicked();
          else if (act === 'undo') History.undo();
          else if (act === 'redo') History.redo();
          else if (act === 'multi') { opts.multi = !opts.multi; paintChrome(); drawMarks(); }
          else if (act === 'all') { parts.forEach((part) => picked.add(part.key)); drawMarks(); }
          else if (act === 'none') { picked.clear(); opts.pcolor = false; drawMarks(); }
          else if (act === 'pcolor') { opts.pcolor = !opts.pcolor; drawMarks(); }
          else if (act === 'pstroke') { if (!opts.stk) toggleStroke(); }
          else if (act === 'pfill') fillPicked();
          else if (act === 'swatch') colorPicked(b.dataset.hex);
          else if (act === 'clean') Cleanup.fix(v && v.id);
          else if (act === 'cleanl') Cleanup.fixLines(v && v.id);
          else if (act === 'stroke') Outline.fix(v && v.id);
          else if (act === 'frame') Frame.fix(v && v.id);
          else if (act === 'flat') Flatten.fix(v && v.id);
          else if (act === 'bg') { opts.bg = b.dataset.bg; paintChrome(); }
        });

        el.addEventListener('change', (e) => {
          if (e.target.matches('[data-pcolor]') || e.target.matches('[data-phex]')) colorPicked(e.target.value);
          if (e.target.matches('[data-tf]')) tfSet(e.target.dataset.tf, e.target.value);
          if (e.target.matches('[data-tfguides]')) { tf.guides = e.target.checked; tf.sig = null; }
          if (e.target.matches('[data-erad], [data-erad-num]')) {
            if (!startRadius()) return;
            ed.radius.live = false;
            applyRadius(e.target.value);
            ed.sel.clear(); // urutan titik berubah; sesi radius tetap aktif sampai memilih titik / bentuk lain
            editSave('Corner radius');
          }
        });
        el.addEventListener('input', (e) => {
          if (!e.target.matches('[data-erad]') || !startRadius()) return;
          ed.radius.live = true;
          applyRadius(e.target.value);
          const num = $('[data-erad-num]', el);
          if (num) num.value = round(ed.radius.value, 2);
          editPreview();
        });

        el.addEventListener('input', (e) => {
          const key = e.target.dataset && e.target.dataset.off;
          if (key !== 'range' && key !== 'value') return;
          const other = $(`[data-off="${key === 'range' ? 'value' : 'range'}"]`, el);
          if (other) other.value = e.target.value;
          offSet(e.target.value);
        });
        el.addEventListener('change', (e) => {
          if (e.target.matches('[data-off="keep"]')) { offv.keep = e.target.checked; offv.sig = null; paintOffbar(); }
        });
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && e.target.matches('[data-off="value"]')) { e.preventDefault(); offSet(e.target.value); offApply(); }
        });

        view.addEventListener('wheel', (e) => {
          e.preventDefault();
          const k = e.ctrlKey ? 0.01 : 0.0015; // ctrl = pinch di trackpad
          zoomAt(Math.exp(-e.deltaY * k), e.clientX, e.clientY);
        }, { passive: false });
        view.addEventListener('dblclick', (e) => {
          if (opts.edit && ed.subs && editInsertAt(viewPoint(e))) return; // klik dua kali di garis = tambah titik
          zoomAt(e.shiftKey ? 0.5 : 2, e.clientX, e.clientY);
        });
        view.addEventListener('pointerdown', onDown);
        view.addEventListener('pointermove', onMove);
        view.addEventListener('pointerup', onUp);
        view.addEventListener('pointercancel', onUp);
        if (window.ResizeObserver) new ResizeObserver(() => { if (isOpen() && v) (v.fitted ? fit() : update()); }).observe(view);

        const altHint = (e) => {
          if (opts.sb && sb.layer && e.key === 'Alt') sb.layer.classList.toggle('kd-sb-del', e.type === 'keydown' || sb.mode === 'delete');
        };
        document.addEventListener('keyup', altHint);
        document.addEventListener('keydown', altHint);
        document.addEventListener('keydown', (e) => {
          if (!isOpen() || (e.target.closest && e.target.closest('input, textarea, select'))) return;
          if (History.key(e)) return;
          if (opts.tf && e.altKey && picked.size) {
            const ctrl = e.ctrlKey || e.metaKey;
            const alignKeys = { KeyA: 'left', KeyH: 'hcenter', KeyD: 'right', KeyW: 'top', KeyV: 'vcenter', KeyS: 'bottom' };
            const run = ctrl
              ? ({ KeyH: () => tfDistribute(true), KeyV: () => tfDistribute(false), KeyT: tfTidy })[e.code]
              : alignKeys[e.code] && (() => tfAlign(alignKeys[e.code]));
            if (run) { e.preventDefault(); e.stopPropagation(); return run(); }
          }
          if (opts.tf && (e.ctrlKey || e.metaKey) && !e.altKey && picked.size) {
            // Ctrl/Cmd+] [ = urutan layer (+Shift = paling depan / belakang); Ctrl/Cmd+D = duplikat
            const act = e.code === 'BracketRight' ? (e.shiftKey ? 'top' : 'up') : e.code === 'BracketLeft' ? (e.shiftKey ? 'bottom' : 'down') : e.code === 'KeyD' ? 'dup' : null;
            if (act) {
              e.preventDefault(); e.stopPropagation();
              return act === 'dup' ? tfDuplicate() : tfOrder(act);
            }
          }
          if (opts.edit && ed.subs && (e.ctrlKey || e.metaKey) && !e.altKey && e.code === 'KeyA') { e.preventDefault(); e.stopPropagation(); return editSelectAll(); }
          if (e.ctrlKey || e.metaKey || e.altKey) return;
          if (opts.edit && (e.key === 'q' || e.key === 'Q')) { e.preventDefault(); e.stopPropagation(); ed.lasso = !ed.lasso; return paintEditbar(); }
          if (opts.tf && picked.size) {
            const arrows = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
            if (arrows[e.key]) { e.preventDefault(); e.stopPropagation(); const k = e.shiftKey ? 10 : 1; return tfNudge(arrows[e.key][0] * k, arrows[e.key][1] * k); }
            if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); e.stopPropagation(); return deletePicked(); }
            if (e.shiftKey && (e.key === 'H' || e.key === 'V')) { e.preventDefault(); e.stopPropagation(); return tfFlip(e.key === 'H'); }
          }
          if (opts.sb && e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); return toggleSb(); }
          if (opts.edit) {
            const arrows = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
            if ((e.key === 'Delete' || e.key === 'Backspace') && ed.sel.size) { e.preventDefault(); e.stopPropagation(); return editDelete(); }
            if (arrows[e.key] && ed.sel.size) {
              e.preventDefault(); e.stopPropagation();
              const k = e.shiftKey ? 10 : 1;
              return editNudge(arrows[e.key][0] * k, arrows[e.key][1] * k);
            }
            if (e.key === 'Escape' && (ed.sel.size || ed.subs)) {
              e.preventDefault(); e.stopPropagation();
              endRadius();
              if (ed.sel.size) ed.sel.clear(); else { ed.index = null; ed.subs = null; }
              drawEdit(); return paintEditbar();
            }
          }
          if (opts.pick && (e.key === 'Delete' || e.key === 'Backspace')) {
            e.preventDefault();
            e.stopPropagation();
            return deletePicked();
          }
          if (e.key === 'Escape' && selecting() && picked.size) {
            e.preventDefault();
            e.stopPropagation();
            picked.clear();
            return drawMarks();
          }
          const keys = {
            Escape: close, ArrowLeft: () => step(-1), ArrowRight: () => step(1),
            '+': () => zoomAt(2), '=': () => zoomAt(2), '-': () => zoomAt(0.5), _: () => zoomAt(0.5),
            0: fit, 1: () => setScale(1), o: () => toggle('outline'), O: () => toggle('outline'),
            a: () => toggle('anchors'), A: () => toggle('anchors'), p: togglePick, P: togglePick, g: toggleStroke, G: toggleStroke, e: toggleEdit, E: toggleEdit, b: toggleSb, B: toggleSb, v: toggleTf
          };
          if (!keys[e.key]) return;
          e.preventDefault();
          e.stopPropagation();
          keys[e.key]();
        });
      }

      function open(id) {
        if (!list().length) return View.toast('Belum ada ikon untuk diperiksa.', 'error');
        mount();
        opts.outline = !!state.outline; // ikut mode outline kanvas saat dibuka
        opts.pick = false;
        opts.stk = false;
        opts.edit = false;
        opts.sb = false;
        opts.tf = false;
        sb.scope = null; sb.regions = [];
        ed.index = null; ed.subs = null; ed.sel.clear(); ed.add = false;
        picked.clear();
        el.classList.remove('hidden');
        show(list().some((it) => it.id === id) ? id : (state.selectedId || list()[0].id));
        requestAnimationFrame(() => { if (v && v.fitted) fit(); });
      }

      function close() {
        if (!el) return;
        StrokeEdit.commit();
        el.classList.add('hidden');
        pointers.clear();
        gesture = null;
        if (svg) svg.remove();
        svg = null;
        v = null;
      }

      function step(delta) {
        const items = list();
        if (!v || items.length < 2) return;
        const i = items.findIndex((it) => it.id === v.id);
        StrokeEdit.commit();
        picked.clear();
        ed.index = null; ed.subs = null; ed.sel.clear();
        sb.scope = null;
        show(items[(i + delta + items.length) % items.length].id);
      }

      /** Tampilkan ikon persis seperti hasil akhirnya (ikut rotasi, flip, dan warna). */
      function show(id) {
        const items = list();
        const index = items.findIndex((it) => it.id === id);
        const item = items[index];
        const trim = state.settings.trim;
        const width = 1 / Layout.sizeOf(item, 1, trim).scale; // ukuran asli file
        const slot = Layout.sizeOf(item, width, trim);

        svg = svgEl(document, 'svg', { 'aria-label': `Detail ${item.name}` });
        const border = svgEl(document, 'rect', {
          x: 0, y: 0, width: slot.w, height: slot.h, fill: 'none', stroke: '#2563EB', 'stroke-width': 1,
          'stroke-dasharray': '4 3', 'vector-effect': 'non-scaling-stroke', 'pointer-events': 'none', opacity: 0.6
        });
        const art = buildArtwork(document, item, slot);
        art.setAttribute('class', 'kd-ins-art');
        dots = svgEl(document, 'path', { fill: '#FFFFFF', stroke: '#2563EB', 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke', 'pointer-events': 'none' });
        hits = svgEl(document, 'g', { class: 'kd-ins-hits' });
        marks = svgEl(document, 'g', { 'pointer-events': 'none' });
        ed.layer = svgEl(document, 'g', { 'pointer-events': 'none' });
        sb.layer = svgEl(document, 'g', { class: 'kd-sb' });
        tf.layer = svgEl(document, 'g', { 'pointer-events': 'none' });
        offv.layer = svgEl(document, 'g', { 'pointer-events': 'none' });
        offv.sig = null;
        svg.append(border, art, hits, dots, marks, offv.layer, ed.layer, sb.layer, tf.layer);
        view.replaceChildren(svg);

        v = { id, w: slot.w, h: slot.h, s: 1, cx: slot.w / 2, cy: slot.h / 2, fit: 1, fitted: true, anchors: null, shapes: 0, strays: [], lines: new Set() };
        v.art = art;
        fit();
        collectAnchors(art);
        collectParts(art, item);
        if (opts.edit && ed.index !== null) editLoad(ed.index, true);
        else drawEdit();
        if (opts.sb && window.paper && !sb.busy) { sbCompute(); sbRender(); paintSbbar(); }
        $('#kd-ins-title', el).textContent = `Ikon ${index + 1} dari ${items.length}${index >= state.count ? ' (tidak dipakai)' : ''}`;
        $('#kd-ins-sub', el).textContent = `${item.name} · ${round(slot.w, 1)} × ${round(slot.h, 1)} · ${v.shapes} bentuk · ${v.anchors.length.toLocaleString('id-ID')} titik anchor${v.strays.length ? ` · ${v.strays.length} titik liar` : ''}${Cleanup.countLines(item) ? ` · ${Cleanup.countLines(item)} garis liar` : ''}${v.lines.size ? ` · ${v.lines.size} garis belum di-outline` : ''}`;
        paintChrome();
        if (state.selectedId !== null && state.selectedId !== id && index < state.count) App.select(id);
      }

      /* ---------- zoom & geser ---------- */

      function fit() {
        if (!v) return;
        const vw = view.clientWidth || 1, vh = view.clientHeight || 1;
        v.fit = Math.min(vw / v.w, vh / v.h) * 0.88;
        v.s = v.fit;
        v.cx = v.w / 2;
        v.cy = v.h / 2;
        v.fitted = true;
        update();
      }

      const limits = () => [v.fit / 4, Math.max(v.fit * 64, 64)];

      function setScale(s) {
        if (!v) return;
        const [min, max] = limits();
        v.s = clamp(s, min, max);
        v.fitted = false;
        update();
      }

      /** Zoom dengan titik di bawah kursor tetap di tempat. */
      function zoomAt(factor, clientX, clientY) {
        if (!v) return;
        const r = view.getBoundingClientRect();
        const x = clientX === undefined ? r.width / 2 : clientX - r.left;
        const y = clientY === undefined ? r.height / 2 : clientY - r.top;
        const px = v.cx + (x - r.width / 2) / v.s;
        const py = v.cy + (y - r.height / 2) / v.s;
        const [min, max] = limits();
        v.s = clamp(v.s * factor, min, max);
        v.cx = px - (x - r.width / 2) / v.s;
        v.cy = py - (y - r.height / 2) / v.s;
        v.fitted = false;
        update();
      }

      function update() {
        if (!v || !svg) return;
        const vw = view.clientWidth || 1, vh = view.clientHeight || 1;
        svg.setAttribute('viewBox', `${v.cx - vw / 2 / v.s} ${v.cy - vh / 2 / v.s} ${vw / v.s} ${vh / v.s}`);
        $('#kd-ins-pct', el).textContent = `${v.s * 100 >= 100 ? Math.round(v.s * 100) : round(v.s * 100, 1)}%`;
        drawAnchors();
        drawMarks();
        drawEdit();
        drawTf();
      }

      function onDown(e) {
        if (!v) return;
        if (opts.edit && editDown(e)) return; // menyeret titik anchor / handle
        if (opts.edit && lassoDown(e)) return; // lasso: gambar bebas untuk memilih titik
        if (opts.sb && sbDown(e)) return;    // klik / seret area shape builder
        if (opts.tf && tfDown(e)) return;    // pindah / ubah ukuran / putar bentuk
        view.setPointerCapture(e.pointerId);
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        down = pointers.size === 1 ? { x: e.clientX, y: e.clientY, shift: e.shiftKey || e.metaKey || e.ctrlKey } : null;
        gesture = null;
        view.classList.add('is-panning');
      }

      function onMove(e) {
        if (ed.drag) return editMove(e);
        if (ed.lassoDrag) return lassoMove(e);
        if (sb.drag) return sbMove(e);
        if (tf.drag) return tfMove(e);
        if (opts.tf && !pointers.size && e.pointerType === 'mouse') {
          const h = tfHit(e);
          view.style.cursor = !h ? '' : h.type === 'scale' ? h.cursor : h.type === 'rotate' ? 'alias' : 'move';
        }
        if (opts.edit && ed.subs && !pointers.size && !coarse()) {
          // Kursor dekat segmen → tampilkan titik tengah bayangan (seperti Figma)
          const p = viewPoint(e);
          let best = null, bd = 10 / v.s;
          segments().forEach((g) => {
            for (let st = 0; st <= 24; st++) {
              const q = toView(bezAt(g.a, g.b, st / 24));
              const d = Math.hypot(q.x - p.x, q.y - p.y);
              if (d < bd) { bd = d; best = { si: g.si, k: g.k }; }
            }
          });
          const changed = (best && (!ed.hover || ed.hover.si !== best.si || ed.hover.k !== best.k)) || (!best && ed.hover);
          ed.hover = best;
          if (changed) drawEdit();
        }
        if (!v || !pointers.has(e.pointerId)) return;
        const prev = [...pointers.values()];
        const before = pointers.get(e.pointerId);
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.size === 1) {
          v.cx -= (e.clientX - before.x) / v.s;
          v.cy -= (e.clientY - before.y) / v.s;
          v.fitted = false;
          update();
          return;
        }
        // Dua jari: cubit untuk zoom + geser
        const [a, b] = [...pointers.values()];
        const [a0, b0] = prev;
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const dist0 = Math.hypot(a0.x - b0.x, a0.y - b0.y) || dist;
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        v.cx -= (mx - (a0.x + b0.x) / 2) / v.s;
        v.cy -= (my - (a0.y + b0.y) / 2) / v.s;
        zoomAt(dist / dist0, mx, my);
      }

      function onUp(e) {
        if (ed.drag && editUp(e)) return;
        if (ed.lassoDrag && lassoUp(e)) return;
        if (sb.drag && sbUp(e)) return;
        if (tf.drag && tfUp(e)) return;
        // Mode pilih: klik tanpa menggeser = pilih bagian di bawah kursor
        if (selecting() && down && pointers.size === 1 && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 5) {
          pickAt(e.clientX, e.clientY, down.shift || opts.multi);
        } else if (opts.edit && down && pointers.size === 1 && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 5) {
          editClick(e);
        }
        down = null;
        pointers.delete(e.pointerId);
        if (!pointers.size) view.classList.remove('is-panning');
      }

      /* ---------- titik anchor ---------- */

      const ARGS = { M: 2, L: 2, T: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, A: 7 };
      const NUM = /[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/y;

      /** Titik ujung tiap segmen path (anchor), dalam koordinat lokal path. */
      function pathAnchors(d) {
        const src = String(d || '');
        const pts = [];
        let i = 0, x = 0, y = 0, sx = 0, sy = 0, cmd = '';
        const skip = () => { while (i < src.length && /[\s,]/.test(src[i])) i++; };
        const num = () => {
          skip();
          NUM.lastIndex = i;
          const m = NUM.exec(src);
          if (!m) return null;
          i = NUM.lastIndex;
          return Number(m[0]);
        };
        const flag = () => {
          skip();
          return src[i] === '0' || src[i] === '1' ? Number(src[i++]) : null;
        };
        while (i < src.length) {
          skip();
          if (i >= src.length) break;
          if (/[a-z]/i.test(src[i])) {
            cmd = src[i++];
            if (cmd === 'z' || cmd === 'Z') { x = sx; y = sy; continue; }
          } else if (!cmd || cmd === 'z' || cmd === 'Z') break;
          const C = cmd.toUpperCase();
          const rel = cmd !== C;
          const n = ARGS[C];
          if (!n) break;
          const val = [];
          for (let k = 0; k < n; k++) {
            const next = C === 'A' && (k === 3 || k === 4) ? flag() : num();
            if (next === null) return pts;
            val.push(next);
          }
          if (C === 'H') x = rel ? x + val[0] : val[0];
          else if (C === 'V') y = rel ? y + val[0] : val[0];
          else {
            x = rel ? x + val[n - 2] : val[n - 2];
            y = rel ? y + val[n - 1] : val[n - 1];
          }
          pts.push([x, y]);
          if (C === 'M') { sx = x; sy = y; cmd = rel ? 'l' : 'L'; }
        }
        return pts;
      }

      function shapeAnchors(node) {
        const len = (name) => (node[name] && node[name].baseVal ? node[name].baseVal.value : 0);
        switch (node.localName) {
          case 'path': return pathAnchors(node.getAttribute('d'));
          case 'rect': {
            const x = len('x'), y = len('y'), w = len('width'), h = len('height');
            return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
          }
          case 'circle': case 'ellipse': {
            const cx = len('cx'), cy = len('cy');
            const rx = node.localName === 'circle' ? len('r') : len('rx');
            const ry = node.localName === 'circle' ? len('r') : len('ry');
            return [[cx + rx, cy], [cx, cy + ry], [cx - rx, cy], [cx, cy - ry]];
          }
          case 'line': return [[len('x1'), len('y1')], [len('x2'), len('y2')]];
          default: return node.points ? [...node.points].map((p) => [p.x, p.y]) : [];
        }
      }

      /** Kumpulkan semua anchor dalam koordinat tampilan (sudah ikut rotasi/flip/skala). */
      function collectAnchors(art) {
        const all = [];
        let shapes = 0;
        const inv = svg.getScreenCTM() ? svg.getScreenCTM().inverse() : null;
        art.querySelectorAll(PAINTED).forEach((node) => {
          if (node.closest(HIDDEN)) return;
          shapes++;
          const ctm = node.getScreenCTM();
          if (!inv || !ctm) return;
          const m = inv.multiply(ctm);
          shapeAnchors(node).forEach(([x, y]) => all.push([m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]));
        });
        v.anchors = all;
        v.shapes = shapes;
        drawAnchors();
      }

      function drawAnchors() {
        if (!dots || !v || !v.anchors) return;
        if (!opts.anchors) return dots.setAttribute('d', '');
        const h = 2.5 / v.s; // kotak 5 px di layar
        const w = round(h * 2, 6);
        dots.setAttribute('d', v.anchors.slice(0, MAX_ANCHORS)
          .map(([x, y]) => `M${round(x - h, 4)} ${round(y - h, 4)}h${w}v${w}h${-w}z`).join(''));
      }

      /* ---------- pilih & hapus bagian ---------- */

      const GEOM = ['d', 'x', 'y', 'width', 'height', 'rx', 'ry', 'cx', 'cy', 'r', 'x1', 'y1', 'x2', 'y2', 'points'];
      const matrixOf = (m) => `matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.e} ${m.f})`;

      /** Satu bagian = satu subpath (path) atau satu bentuk; dipetakan ke urutan bentuk di file ikon. */
      function collectParts(art, item) {
        parts = [];
        hits.replaceChildren();
        const inner = art.firstElementChild;
        const inv = svg.getScreenCTM() ? svg.getScreenCTM().inverse() : null;
        if (!inner || !inv) return;
        Cleanup.shapesOf(inner).forEach((node, index) => {
          const ctm = node.getScreenCTM();
          if (!ctm) return;
          const m = inv.multiply(ctm);
          const map = (pts) => pts.map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
          const d = node.localName === 'path' ? node.getAttribute('d') : null;
          const subs = d ? Cleanup.subpaths(d) : [];
          const add = (sub, geom, pts) => {
            const key = `${index}:${sub === null ? '' : sub}`;
            const hit = svgEl(document, node.localName === 'path' || sub !== null ? 'path' : node.localName, {
              transform: matrixOf(m), fill: 'none', stroke: 'transparent', 'stroke-width': 12, 'stroke-linecap': 'round',
              'vector-effect': 'non-scaling-stroke', style: 'pointer-events:all', 'data-part': key
            });
            Object.entries(geom).forEach(([k, val]) => hit.setAttribute(k, val));
            hits.appendChild(hit);
            parts.push({ key, index, sub, hit, pts: map(pts) });
          };
          if (subs.length > 1) subs.forEach((sp, k) => add(k, { d: Cleanup.piece(d, sp) }, sp.pts));
          else {
            const geom = {};
            GEOM.forEach((a) => { if (node.hasAttribute(a)) geom[a] = node.getAttribute(a); });
            add(null, geom, subs.length ? subs[0].pts : shapeAnchors(node));
          }
        });
        // Titik liar: diberi lingkaran merah agar mudah dilihat
        const shapes = Cleanup.shapesOf(inner);
        v.strays = Cleanup.strays(item).map((r) => {
          const node = shapes[r.index];
          const ctm = node && node.getScreenCTM();
          if (!ctm) return null;
          const m = inv.multiply(ctm);
          return [m.a * r.at[0] + m.c * r.at[1] + m.e, m.b * r.at[0] + m.d * r.at[1] + m.f];
        }).filter(Boolean);
        // Bentuk yang masih bergaris (stroke): ditandai oranye di mode Outline
        v.lines = new Set(Outline.scan(item).map((x) => x.index));
        // Garis liar: ditandai merah putus-putus
        v.loose = new Set(Cleanup.slivers(item).map((r) => `${r.index}:${r.sub === null ? '' : r.sub}`));
        hits.style.display = selecting() || opts.edit ? '' : 'none';
        drawMarks();
      }

      /** Bagian di bawah kursor: titik kecil terdekat dulu, lalu bentuk teratas, lalu anchor terdekat. */
      function pickAt(clientX, clientY, additive) {
        if (!v || !svg) return;
        const p = new DOMPoint(clientX, clientY).matrixTransform(svg.getScreenCTM().inverse());
        const near = (limitPx, onlyTiny) => {
          let best = null, bestD = limitPx / v.s;
          parts.forEach((part) => {
            if (onlyTiny) {
              const xs = part.pts.map((q) => q[0]), ys = part.pts.map((q) => q[1]);
              if (!xs.length || Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) * v.s > 6) return;
            }
            part.pts.forEach(([x, y]) => {
              const dd = Math.hypot(x - p.x, y - p.y);
              if (dd < bestD) { bestD = dd; best = part.key; }
            });
          });
          return best;
        };
        let key = near(10, true);
        if (!key) {
          const part = partUnder(clientX, clientY);
          key = part ? part.key : near(10, false);
        }
        if (!key) {
          if (!additive) picked.clear();
        } else if (additive) {
          if (picked.has(key)) picked.delete(key);
          else picked.add(key);
        } else {
          picked.clear();
          picked.add(key);
        }
        drawMarks();
      }

      function drawMarks() {
        if (!marks || !v) return;
        const r = 7 / v.s;
        const ring = (x, y) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;
        const html = [];
        parts.filter((part) => picked.has(part.key)).forEach((part) => {
          const c = part.hit.cloneNode(false);
          c.removeAttribute('style');
          c.removeAttribute('data-part');
          c.setAttribute('fill', '#EF144A');
          c.setAttribute('fill-opacity', '0.18');
          c.setAttribute('stroke', '#EF144A');
          c.setAttribute('stroke-width', '2');
          html.push(c.outerHTML);
          const xs = part.pts.map((q) => q[0]), ys = part.pts.map((q) => q[1]);
          if (xs.length && Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) * v.s < 8) {
            html.push(`<path d="${ring(xs[0], ys[0])}" fill="#EF144A" fill-opacity="0.35" stroke="#EF144A" stroke-width="2" vector-effect="non-scaling-stroke"/>`);
          }
        });
        if (v.loose && v.loose.size) {
          parts.filter((part) => v.loose.has(part.key) || (part.sub !== null && v.loose.has(`${part.index}:`))).forEach((part) => {
            const c = part.hit.cloneNode(false);
            c.removeAttribute('style');
            c.removeAttribute('data-part');
            c.setAttribute('fill', 'none');
            c.setAttribute('stroke', '#EF144A');
            c.setAttribute('stroke-width', '2.5');
            c.setAttribute('stroke-dasharray', '5 3');
            html.push(c.outerHTML);
          });
        }
        const whole = new Set(parts.filter((part) => picked.has(part.key) && part.sub !== null).map((part) => part.index));
        parts.filter((part) => whole.has(part.index) && !picked.has(part.key)).forEach((part) => {
          const c = part.hit.cloneNode(false);
          c.removeAttribute('style');
          c.removeAttribute('data-part');
          c.setAttribute('fill', 'none');
          c.setAttribute('stroke', '#EF144A');
          c.setAttribute('stroke-width', '1.5');
          c.setAttribute('stroke-dasharray', '4 3');
          html.push(c.outerHTML);
        });
        if (v.strays.length) {
          html.push(`<path d="${v.strays.map(([x, y]) => ring(x, y)).join('')}" fill="none" stroke="#EF144A" stroke-width="2" stroke-dasharray="3 2" vector-effect="non-scaling-stroke"/>`);
        }
        if (opts.outline && v.lines.size) {
          parts.filter((part) => v.lines.has(part.index)).forEach((part) => {
            const c = part.hit.cloneNode(false);
            c.removeAttribute('style');
            c.removeAttribute('data-part');
            c.setAttribute('fill', 'none');
            c.setAttribute('stroke', '#F97316');
            c.setAttribute('stroke-width', '2.5');
            html.push(c.outerHTML);
          });
        }
        marks.innerHTML = html.join('');
        paintPickbar();
      }

      function togglePick() {
        opts.pick = !opts.pick;
        if (opts.pick) if (opts.tf) opts.tf = false;
        if (opts.pick) if (opts.sb) { opts.sb = false; sb.regions = []; sb.scope = null; sbRender(); paintSbbar(); }
        if (opts.pick && opts.edit) { opts.edit = false; ed.index = null; ed.subs = null; ed.sel.clear(); drawEdit(); paintEditbar(); }
        opts.pcolor = false;
        if (opts.pick && opts.stk) opts.stk = false;
        if (!selecting()) picked.clear();
        if (hits) hits.style.display = selecting() ? '' : 'none';
        paintChrome();
        drawMarks();
      }

      /** Panel Garis: klik bentuk untuk memilih garis yang diedit (tanpa pilihan = semua garis ikon). */
      function toggleStroke() {
        opts.stk = !opts.stk;
        if (opts.stk) if (opts.tf) opts.tf = false;
        if (opts.stk) if (opts.sb) { opts.sb = false; sb.regions = []; sb.scope = null; sbRender(); paintSbbar(); }
        if (opts.stk && opts.edit) { opts.edit = false; ed.index = null; ed.subs = null; ed.sel.clear(); drawEdit(); paintEditbar(); }
        if (opts.stk && opts.pick) opts.pick = false;
        if (!opts.stk) StrokeEdit.commit();
        if (!selecting()) picked.clear();
        if (hits) hits.style.display = selecting() ? '' : 'none';
        paintChrome();
        drawMarks();
      }

      const currentItem = () => (v ? list().find((it) => it.id === v.id) : null);

      /** Jarak (px layar) dari pointer ke garis bentuk sebuah bagian. */
      function edgeDistance(part, x, y) {
        const h = part.hit;
        if (!h.getTotalLength) return Infinity;
        const m = h.getScreenCTM();
        let L = 0;
        try { L = h.getTotalLength(); } catch (e) { return Infinity; }
        if (!m || !L) return Infinity;
        const n = Math.min(240, Math.max(24, Math.ceil(L * v.s / 5)));
        let best = Infinity;
        for (let i = 0; i <= n; i++) {
          const q = h.getPointAtLength(L * i / n);
          best = Math.min(best, Math.hypot(m.a * q.x + m.c * q.y + m.e - x, m.b * q.x + m.d * q.y + m.f - y));
        }
        return best;
      }

      /**
       * Bagian di bawah pointer. Garis yang dekat (≤ 10 px) menang atas isi bentuk besar yang menutupinya,
       * jadi garis tipis di dalam badan ikon bisa langsung dipilih. Jauh dari garis mana pun → bentuk teratas.
       */
      function partUnder(x, y) {
        const under = document.elementsFromPoint(x, y)
          .filter((n) => n.dataset && n.dataset.part && hits.contains(n))
          .map((n) => parts.find((part) => part.key === n.dataset.part))
          .filter(Boolean);
        // Kandidat: bagian yang kotak batasnya (diperluas 10 px) memuat pointer — cepat walau bagiannya banyak
        const near = parts.filter((part) => {
          const b = part.hit.getBoundingClientRect();
          return x >= b.left - 10 && x <= b.right + 10 && y >= b.top - 10 && y <= b.bottom + 10;
        });
        let best = null, bestD = 10;
        near.forEach((part) => {
          const d = edgeDistance(part, x, y);
          if (d < bestD) { bestD = d; best = part; }
        });
        return best || under[0] || null;
      }

      function deletePicked() {
        const item = currentItem();
        if ((!opts.pick && !opts.tf) || !item || !picked.size) return;
        if (Designer.busy()) return View.toast('Tunggu pengiriman ke Drive selesai.', 'error');
        const chosen = parts.filter((part) => picked.has(part.key)).map((part) => ({ index: part.index, sub: part.sub }));
        if (chosen.length >= parts.length) return View.toast('Tidak bisa menghapus semua bagian ikon.', 'error');
        const n = chosen.length;
        picked.clear();
        History.label(`Hapus ${n} bagian`);
        Cleanup.remove(item, chosen);
        Cleanup.commit([item]);
        refresh();
        View.toast(`${n} bagian dihapus. Ctrl+Z / tombol Urungkan untuk membatalkan.`);
      }

      /** Warna tampil (fill / garis) tiap bentuk ikon ini, dibaca di wadah tersembunyi. */
      function shapeColors(item) {
        const host = svgEl(document, 'svg', { style: 'position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden' });
        const clone = document.importNode(item.node, true);
        host.appendChild(clone);
        document.body.appendChild(host);
        try {
          return Cleanup.shapesOf(clone).map((node) => {
            const cs = getComputedStyle(node);
            const fill = Outline.paintOf(cs.fill);
            const stroke = Outline.paintOf(cs.stroke);
            return { fill: fill && /^#/.test(fill.paint) ? fill.paint : null, stroke: stroke && /^#/.test(stroke.paint) ? stroke.paint : null, hasFill: !!fill };
          });
        } finally {
          host.remove();
        }
      }

      const pickedIndices = () => [...new Set(parts.filter((part) => picked.has(part.key)).map((part) => part.index))];

      /** Ganti warna bagian terpilih: isi (fill); bentuk tanpa isi → warna garisnya. */
      function colorPicked(value) {
        const item = currentItem();
        const m = String(value || '').trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
        if (!item || !picked.size) return;
        if (!m) return View.toast('Kode warna tidak valid. Contoh: #F95858', 'error');
        if (Designer.busy() || Outline.busy()) return View.toast('Tunggu proses yang sedang berjalan selesai.', 'error');
        const hex = '#' + (m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1]).toLowerCase();
        const idx = pickedIndices();
        const info = shapeColors(item);
        History.label(`Ganti warna ${idx.length} bentuk → ${hex.toUpperCase()}`);
        Cleanup.edit(item, () => {
          const els = Cleanup.shapesOf(item.node);
          idx.forEach((i) => {
            const node = els[i];
            if (!node) return;
            node.style.setProperty(info[i] && !info[i].hasFill ? 'stroke' : 'fill', hex);
          });
        });
        Cleanup.commit([item]);
        refresh();
      }

      /** Garis → fill khusus bentuk terpilih. */
      function fillPicked() {
        const item = currentItem();
        if (!item || !picked.size) return;
        const idx = pickedIndices();
        picked.clear();
        Outline.fix(item.id, idx);
      }

      /** Gambar ulang ikon yang sedang dibuka, zoom & posisi dipertahankan. */
      function refresh() {
        if (!isOpen() || !v) return;
        const keep = { s: v.s, cx: v.cx, cy: v.cy, fitted: v.fitted };
        if (!list().some((it) => it.id === v.id)) return close();
        show(v.id);
        if (!keep.fitted) {
          Object.assign(v, keep);
          update();
        }
      }

      function paintPickbar() {
        if (!el) return;
        $('#kd-ins-selbar', el).classList.toggle('hidden', !selecting());
        $('#kd-ins-pickbar', el).classList.toggle('hidden', !opts.pick);
        const multi = $('[data-ins="multi"]', el);
        multi.className = `${btn} ${opts.multi ? on : off}`;
        multi.setAttribute('aria-pressed', String(opts.multi));
        const stkbar = $('#kd-ins-stkbar', el);
        stkbar.classList.toggle('hidden', !opts.stk);
        if (opts.stk) {
          const chosen = [...new Set(parts.filter((part) => picked.has(part.key)).map((part) => part.index))];
          StrokeEdit.renderInspect(stkbar, currentItem(), chosen);
        }
        const item = currentItem();
        const del = $('[data-ins="delete"]', el);
        del.disabled = !picked.size;
        del.lastElementChild.textContent = picked.size > 1 ? `Hapus ${picked.size}` : 'Hapus';
        $('[data-ins="pcolor"]', el).disabled = !picked.size;
        $('[data-ins="pstroke"]', el).disabled = !picked.size;
        const idx = pickedIndices();
        const strokeIdx = item ? new Set(Outline.scan(item).filter((x) => !x.marker).map((x) => x.index)) : new Set();
        const fillable = idx.filter((i) => strokeIdx.has(i)).length;
        const pfill = $('[data-ins="pfill"]', el);
        pfill.classList.toggle('hidden', !fillable);
        pfill.lastElementChild.textContent = `Garis → fill (${fillable})`;
        pfill.disabled = Outline.busy();
        // Panel warna bagian terpilih
        const pc = $('#kd-ins-pcolor', el);
        const showColor = opts.pick && opts.pcolor && picked.size && item;
        pc.classList.toggle('hidden', !showColor);
        setOnEl($('[data-ins="pcolor"]', el), !!showColor);
        if (showColor) {
          const info = shapeColors(item);
          const used = [...new Set(info.flatMap((x) => [x.fill, x.stroke]).filter(Boolean))];
          const cur = [...new Set(idx.map((i) => info[i] && (info[i].hasFill ? info[i].fill : info[i].stroke)).filter(Boolean))];
          const now = cur.length === 1 ? cur[0] : '#000000';
          pc.innerHTML = `
            <div class="flex flex-wrap items-center gap-1.5">
              <label class="relative w-8 h-8 shrink-0 rounded-lg border border-kd-line cursor-pointer overflow-hidden ${cur.length === 1 ? '' : 'kd-checker'}" style="${cur.length === 1 ? `background:${now}` : ''}" title="Pilih warna">
                <input type="color" data-pcolor value="${now}" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Warna bagian terpilih">
              </label>
              <input type="text" data-phex value="${cur.length === 1 ? now.toUpperCase() : ''}" placeholder="Campur" maxlength="7" spellcheck="false" aria-label="Kode warna" class="w-[92px] h-8 rounded-md border border-kd-line px-2 text-xs font-mono font-semibold uppercase outline-none focus:border-kd-brand focus:ring-2 focus:ring-kd-brand/20">
              <span class="text-[11px] text-kd-muted">Warna di ikon ini:</span>
              ${used.map((h) => `<button type="button" data-ins="swatch" data-hex="${h}" class="w-7 h-7 rounded-full border-2 ${cur.length === 1 && cur[0] === h ? 'border-kd-brand' : 'border-kd-line'}" style="background:${h}" title="${h.toUpperCase()}" aria-label="Pakai ${h.toUpperCase()}"></button>`).join('')}
            </div>
            <p class="mt-1 text-[11px] text-kd-muted">Warna berlaku ke seluruh bentuk (garis putus merah = bagian lain dari bentuk yang sama). Bentuk tanpa isi diganti warna garisnya.</p>`;
        }
        const tip = 'Ketuk bagian ikon untuk memilih. Aktifkan "Pilih banyak" untuk memilih beberapa (di laptop bisa Shift+klik).';
        $('#kd-ins-pickhint', el).textContent = picked.size
          ? `${picked.size} bagian dipilih (merah).${opts.multi ? ' Ketuk lagi untuk menambah / mengurangi.' : ' Aktifkan "Pilih banyak" untuk menambah.'}`
          : (opts.pick ? tip + ' Titik kecil bisa diketuk langsung.' : tip);
        const clean = $('[data-ins="clean"]', el);
        const n = item ? Cleanup.count(item) : 0;
        clean.classList.toggle('hidden', !n);
        clean.innerHTML = n ? `${icon('check', 'w-4 h-4')}Bersihkan ${n} titik liar` : '';
        const cleanl = $('[data-ins="cleanl"]', el);
        const nl = item ? Cleanup.countLines(item) : 0;
        cleanl.classList.toggle('hidden', !nl);
        cleanl.innerHTML = nl ? `${icon('check', 'w-4 h-4')}Bersihkan ${nl} garis liar` : '';
        const stroke = $('[data-ins="stroke"]', el);
        const lines = item ? Outline.count(item) : 0;
        stroke.classList.toggle('hidden', !lines);
        stroke.innerHTML = lines ? `${icon('outline', 'w-4 h-4')}Garis → fill (${lines})` : '';
        stroke.disabled = Outline.busy();
        stroke.classList.toggle('opacity-50', Outline.busy());
        $('[data-ins="frame"]', el).classList.toggle('hidden', !(item && Frame.oversized(item)));
        $('[data-ins="flat"]', el).classList.toggle('hidden', !(item && Flatten.needs(item)));
        paintTf();
        paintPanel();
      }

      /* ---------- edit titik anchor: pindah (dengan snapping), tambah, hapus ---------- */

      const EDIT_GEOM = ['x', 'y', 'width', 'height', 'rx', 'ry', 'cx', 'cy', 'r', 'x1', 'y1', 'x2', 'y2', 'points', 'pathLength'];
      const ed = {
        index: null,     // urutan bentuk yang diedit (Cleanup.shapesOf)
        subs: null,      // [{ nodes: [{ x, y, hi, ho }], closed }] koordinat lokal bentuk
        sel: new Set(),  // "sub:node" titik terpilih
        m: null,         // matriks lokal bentuk → koordinat tampilan
        inv: null,
        layer: null,
        snap: true,
        add: false,
        lasso: false,     // alat lasso aktif (Q)
        lassoDrag: null,  // { id, pts: [[x, y]], mode: new | add | sub } koordinat tampilan
        drag: null,
        guides: null,
        hover: null,      // segmen di bawah kursor (titik tengah bayangan)
        modes: new Map(), // mirroring yang dipilih per titik ("sub:node" → none | angle | full)
        radius: null      // sesi corner radius: { base, keys, value, max }
      };
      const coarse = () => !!(window.matchMedia && window.matchMedia('(hover: none)').matches);
      const bezAt = (a, b, t) => {
        const p0 = a, p1 = a.ho || a, p2 = b.hi || b, p3 = b, u = 1 - t;
        return { x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x, y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y };
      };
      /** Segmen bentuk yang diedit: [{ si, k, a, b }] (termasuk segmen penutup). */
      function segments() {
        const out = [];
        (ed.subs || []).forEach((sp, si) => {
          const n = sp.nodes;
          const count = sp.closed ? n.length : n.length - 1;
          for (let k = 0; k < count; k++) out.push({ si, k, a: n[k], b: n[(k + 1) % n.length] });
        });
        return out;
      }
      /** Belah segmen k di t tanpa mengubah bentuk; kembalikan urutan titik baru. */
      function splitSeg(si, k, t) {
        const n = ed.subs[si].nodes, a = n[k], b = n[(k + 1) % n.length];
        const lerp = (p, q) => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });
        let mid;
        if (a.ho || b.hi) {
          const p0 = a, p1 = a.ho || a, p2 = b.hi || b, p3 = b;
          const p01 = lerp(p0, p1), p12 = lerp(p1, p2), p23 = lerp(p2, p3), p012 = lerp(p01, p12), p123 = lerp(p12, p23), m = lerp(p012, p123);
          a.ho = p01; b.hi = p23;
          mid = { x: m.x, y: m.y, hi: p012, ho: p123 };
        } else {
          mid = { ...lerp(a, b), hi: null, ho: null };
        }
        n.splice(k + 1, 0, mid);
        return k + 1;
      }
      /** Titik tengah bayangan yang tampil: hover (laptop) atau semua segmen panjang (HP). */
      function ghosts() {
        if (!ed.subs || !v) return [];
        const list = coarse() ? segments() : (ed.hover ? segments().filter((g) => g.si === ed.hover.si && g.k === ed.hover.k) : []);
        return list.map((g) => {
          const m = toView(bezAt(g.a, g.b, 0.5));
          const pa = toView(g.a), pb = toView(g.b);
          return { ...g, m, len: Math.hypot(pa.x - pb.x, pa.y - pb.y) * v.s };
        }).filter((g) => g.len >= 24);
      }
      /** Mirroring titik: none (bebas) | angle (segaris) | full (segaris & sama panjang). */
      function mirrorOf(key) {
        if (ed.modes.has(key)) return ed.modes.get(key);
        const [si, ni] = key.split(':').map(Number);
        const n = ed.subs && ed.subs[si] && ed.subs[si].nodes[ni];
        if (!n || !n.hi || !n.ho) return 'none';
        const ax = n.hi.x - n.x, ay = n.hi.y - n.y, bx = n.ho.x - n.x, by = n.ho.y - n.y;
        const la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
        if (!la || !lb) return 'none';
        const cross = Math.abs(ax * by - ay * bx) / (la * lb), dot = (ax * bx + ay * by) / (la * lb);
        if (cross > 0.01 || dot > 0) return 'none';
        return Math.abs(la - lb) / Math.max(la, lb) < 0.01 ? 'full' : 'angle';
      }

      /** Path SVG → simpul anchor + handle (busur & kuadratik diubah jadi kubik yang setara). */
      function parsePath(d) {
        const src = String(d || '');
        const NUMRE = /[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/y;
        const ARGN = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
        const subs = [];
        let i = 0, x = 0, y = 0, sx = 0, sy = 0, cmd = '', cur = null, lastC = null, lastQ = null;
        const skip = () => { while (i < src.length && /[\s,]/.test(src[i])) i++; };
        const num = () => { skip(); NUMRE.lastIndex = i; const m = NUMRE.exec(src); if (!m) return null; i = NUMRE.lastIndex; return Number(m[0]); };
        const flag = () => { skip(); return src[i] === '0' || src[i] === '1' ? Number(src[i++]) : null; };
        const start = (px, py) => { cur = { nodes: [{ x: px, y: py, hi: null, ho: null }], closed: false }; subs.push(cur); };
        const ensure = () => { if (!cur || cur.closed) start(x, y); };
        const line = (px, py) => { ensure(); cur.nodes.push({ x: px, y: py, hi: null, ho: null }); };
        const cubic = (c1x, c1y, c2x, c2y, px, py) => {
          ensure();
          cur.nodes[cur.nodes.length - 1].ho = { x: c1x, y: c1y };
          cur.nodes.push({ x: px, y: py, hi: { x: c2x, y: c2y }, ho: null });
        };
        while (i < src.length) {
          skip();
          if (i >= src.length) break;
          let explicit = false;
          if (/[a-z]/i.test(src[i])) { cmd = src[i++]; explicit = true; } else if (!cmd) break;
          const C = cmd.toUpperCase(), rel = cmd !== C;
          if (C === 'Z') {
            if (!explicit) break;
            if (cur && !cur.closed) {
              const n = cur.nodes, a = n[n.length - 1], b = n[0];
              if (n.length > 1 && Math.hypot(a.x - b.x, a.y - b.y) < 1e-6) { b.hi = a.hi; n.pop(); }
              cur.closed = true;
            }
            x = sx; y = sy; lastC = lastQ = null;
            continue;
          }
          const n = ARGN[C];
          if (n === undefined) break;
          const val = [];
          for (let k = 0; k < n; k++) {
            const next = C === 'A' && (k === 3 || k === 4) ? flag() : num();
            if (next === null) break;
            val.push(next);
          }
          if (val.length < n) break;
          const ox = rel ? x : 0, oy = rel ? y : 0;
          if (C === 'M') {
            x = ox + val[0]; y = oy + val[1]; sx = x; sy = y;
            start(x, y);
            cmd = rel ? 'l' : 'L';
            lastC = lastQ = null;
            continue;
          }
          if (C === 'L' || C === 'H' || C === 'V') {
            if (C === 'L') { x = ox + val[0]; y = oy + val[1]; } else if (C === 'H') x = (rel ? x : 0) + val[0]; else y = (rel ? y : 0) + val[0];
            line(x, y);
            lastC = lastQ = null;
          } else if (C === 'C' || C === 'S') {
            let c1x, c1y;
            if (C === 'C') { c1x = ox + val[0]; c1y = oy + val[1]; } else { c1x = lastC ? 2 * x - lastC[0] : x; c1y = lastC ? 2 * y - lastC[1] : y; }
            const o = C === 'C' ? 2 : 0;
            const c2x = ox + val[o], c2y = oy + val[o + 1], px = ox + val[o + 2], py = oy + val[o + 3];
            cubic(c1x, c1y, c2x, c2y, px, py);
            lastC = [c2x, c2y]; lastQ = null; x = px; y = py;
          } else if (C === 'Q' || C === 'T') {
            let qx, qy;
            if (C === 'Q') { qx = ox + val[0]; qy = oy + val[1]; } else { qx = lastQ ? 2 * x - lastQ[0] : x; qy = lastQ ? 2 * y - lastQ[1] : y; }
            const o = C === 'Q' ? 2 : 0;
            const px = ox + val[o], py = oy + val[o + 1];
            cubic(x + 2 / 3 * (qx - x), y + 2 / 3 * (qy - y), px + 2 / 3 * (qx - px), py + 2 / 3 * (qy - py), px, py);
            lastQ = [qx, qy]; lastC = null; x = px; y = py;
          } else if (C === 'A') {
            const px = ox + val[5], py = oy + val[6];
            arcToCubic(x, y, val[0], val[1], val[2], val[3], val[4], px, py).forEach((c) => cubic(...c));
            if (!arcToCubic.used) line(px, py);
            x = px; y = py; lastC = lastQ = null;
          }
        }
        return subs;
      }

      /** Busur SVG → daftar kurva kubik [c1x, c1y, c2x, c2y, x, y] (rumus implementasi SVG F.6). */
      function arcToCubic(x1, y1, rx, ry, angle, large, sweep, x2, y2) {
        arcToCubic.used = false;
        rx = Math.abs(rx); ry = Math.abs(ry);
        if (!rx || !ry || (x1 === x2 && y1 === y2)) return [];
        arcToCubic.used = true;
        const phi = angle * Math.PI / 180, cos = Math.cos(phi), sin = Math.sin(phi);
        const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
        const x1p = cos * dx + sin * dy, y1p = -sin * dx + cos * dy;
        const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
        if (lambda > 1) { rx *= Math.sqrt(lambda); ry *= Math.sqrt(lambda); }
        const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
        const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
        let k = Math.sqrt(Math.max(0, num / den));
        if (large === sweep) k = -k;
        const cxp = k * rx * y1p / ry, cyp = -k * ry * x1p / rx;
        const cx = cos * cxp - sin * cyp + (x1 + x2) / 2, cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
        const ang = (ux, uy, vx, vy) => {
          const a = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
          return a;
        };
        const t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
        let dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
        if (!sweep && dt > 0) dt -= 2 * Math.PI;
        if (sweep && dt < 0) dt += 2 * Math.PI;
        const segs = Math.max(1, Math.ceil(Math.abs(dt) / (Math.PI / 2)));
        const step = dt / segs, kappa = 4 / 3 * Math.tan(step / 4);
        const pt = (t) => [cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin, cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos];
        const dv = (t) => [-rx * Math.sin(t) * cos - ry * Math.cos(t) * sin, -rx * Math.sin(t) * sin + ry * Math.cos(t) * cos];
        const out = [];
        for (let s = 0; s < segs; s++) {
          const a = t1 + s * step, b = a + step;
          const p0 = pt(a), p1 = s === segs - 1 ? [x2, y2] : pt(b), d0 = dv(a), d1 = dv(b);
          out.push([p0[0] + kappa * d0[0], p0[1] + kappa * d0[1], p1[0] - kappa * d1[0], p1[1] - kappa * d1[1], p1[0], p1[1]]);
        }
        return out;
      }

      /** Simpul → path SVG (absolut, garis lurus & kubik). */
      function pathOf(subs) {
        const f = (n) => round(n, 3);
        const pt = (p) => `${f(p.x)} ${f(p.y)}`;
        const seg = (a, b) => (a.ho || b.hi ? `C${pt(a.ho || a)} ${pt(b.hi || b)} ${pt(b)}` : `L${pt(b)}`);
        return subs.map((sp) => {
          const n = sp.nodes;
          let s = `M${pt(n[0])}`;
          for (let k = 1; k < n.length; k++) s += seg(n[k - 1], n[k]);
          if (sp.closed) {
            if (n.length > 1 && (n[n.length - 1].ho || n[0].hi)) s += seg(n[n.length - 1], n[0]);
            s += 'Z';
          }
          return s;
        }).join('');
      }

      const edKey = (si, ni) => `${si}:${ni}`;
      const toView = (p) => { const q = new DOMPoint(p.x, p.y).matrixTransform(ed.m); return { x: q.x, y: q.y }; };
      const toLocal = (p) => { const q = new DOMPoint(p.x, p.y).matrixTransform(ed.inv); return { x: q.x, y: q.y }; };
      const viewPoint = (e) => new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
      const sourceShape = () => { const item = currentItem(); return item && ed.index !== null ? Cleanup.shapesOf(item.node)[ed.index] : null; };
      const artShape = () => { const inner = v && v.art && v.art.firstElementChild; return inner && ed.index !== null ? Cleanup.shapesOf(inner)[ed.index] : null; };

      /** Mulai / muat ulang edit bentuk ke-index (setelah simpan, urungkan, atau pindah zoom). */
      function editLoad(index, keepSel) {
        const prevIndex = ed.index;
        ed.index = index;
        if (prevIndex !== index) { endRadius(); ed.modes.clear(); }
        const src = sourceShape();
        const node = artShape();
        if (!src || !node || !svg.getScreenCTM() || !node.getScreenCTM()) { ed.index = null; ed.subs = null; ed.sel.clear(); return drawEdit(); }
        const shape = (subs) => (subs ? subs.map((sp) => sp.nodes.length).join(',') : '');
        const before = keepSel && prevIndex === index ? shape(ed.subs) : null;
        ed.subs = parsePath(src.localName === 'path' ? src.getAttribute('d') : Outline.geometry(src));
        if (before !== null && before !== shape(ed.subs)) { keepSel = false; ed.modes.clear(); } // jumlah titik berubah (mis. diurungkan) → pilihan lama tidak berlaku
        ed.m = svg.getScreenCTM().inverse().multiply(node.getScreenCTM());
        ed.inv = ed.m.inverse();
        if (!keepSel) ed.sel.clear();
        [...ed.sel].forEach((k) => { const [si, ni] = k.split(':').map(Number); if (!ed.subs[si] || !ed.subs[si].nodes[ni]) ed.sel.delete(k); });
        drawEdit();
      }

      /** Gambar garis bentuk, titik anchor, handle kurva titik terpilih, tanda snap & garis bantu. */
      function drawEdit() {
        if (!ed.layer) return;
        if (!opts.edit || !ed.subs || !v) return ed.layer.replaceChildren();
        const r = 4.5 / v.s, hr = 3.5 / v.s;
        const out = [`<path d="${pathOf(ed.subs)}" transform="matrix(${ed.m.a} ${ed.m.b} ${ed.m.c} ${ed.m.d} ${ed.m.e} ${ed.m.f})" fill="none" stroke="#2563EB" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`];
        const handles = [];
        const boxes = [];
        const lz = ed.lassoDrag && ed.lassoDrag.moved ? ed.lassoDrag : null;
        const pending = lz ? new Set(lassoKeys(lz.pts)) : null;
        if (lz) out.push(`<path d="M${lz.pts.map((q) => `${q[0]} ${q[1]}`).join('L')}Z" fill="#2563EB" fill-opacity="0.08" stroke="#2563EB" stroke-width="1.25" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/>`);
        ed.subs.forEach((sp, si) => sp.nodes.forEach((n, ni) => {
          const p = toView(n);
          const key = edKey(si, ni);
          const on = !pending ? ed.sel.has(key)
            : lz.mode === 'sub' ? ed.sel.has(key) && !pending.has(key)
              : pending.has(key) || (lz.mode === 'add' && ed.sel.has(key));
          if (on) ['hi', 'ho'].forEach((h) => {
            if (!n[h]) return;
            const q = toView(n[h]);
            handles.push(`<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke="#2563EB" stroke-width="1" vector-effect="non-scaling-stroke"/><circle cx="${q.x}" cy="${q.y}" r="${hr}" fill="#FFFFFF" stroke="#2563EB" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`);
          });
          boxes.push(`<rect x="${p.x - r}" y="${p.y - r}" width="${2 * r}" height="${2 * r}" fill="${on ? '#2563EB' : '#FFFFFF'}" stroke="#2563EB" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`);
        }));
        ghosts().forEach((g) => {
          boxes.unshift(`<circle cx="${g.m.x}" cy="${g.m.y}" r="${3.5 / v.s}" fill="#FFFFFF" fill-opacity="0.85" stroke="#2563EB" stroke-width="1.25" stroke-dasharray="2 1.5" vector-effect="non-scaling-stroke"/>`);
        });
        if (ed.guides) {
          const big = 1e5;
          ed.guides.lines.forEach((g) => out.push(g.axis === 'x'
            ? `<line x1="${g.v}" y1="${-big}" x2="${g.v}" y2="${big}" stroke="#E11D84" stroke-width="1" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/>`
            : `<line x1="${-big}" y1="${g.v}" x2="${big}" y2="${g.v}" stroke="#E11D84" stroke-width="1" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/>`));
          if (ed.guides.point) out.push(`<circle cx="${ed.guides.point.x}" cy="${ed.guides.point.y}" r="${8 / v.s}" fill="none" stroke="#E11D84" stroke-width="2" vector-effect="non-scaling-stroke"/>`);
        }
        ed.layer.innerHTML = out.join('') + handles.join('') + boxes.join('');
      }

      /** Bagian ikon (lapisan klik) di bawah pointer. */
      function partAt(x, y) {
        return partUnder(x, y);
      }

      /** Titik anchor / handle terdekat dari pointer (dalam radius 12 px layar). */
      function editHit(p) {
        if (!ed.subs) return null;
        const lim = 12 / v.s;
        let best = null, bestD = lim;
        ed.subs.forEach((sp, si) => sp.nodes.forEach((n, ni) => {
          const key = edKey(si, ni);
          const test = (q, type) => { const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bestD) { bestD = d; best = { type, si, ni, key }; } };
          if (ed.sel.has(key)) ['hi', 'ho'].forEach((h) => { if (n[h]) test(toView(n[h]), h); });
          test(toView(n), 'anchor');
        }));
        if (!best) {
          let bd = 10 / v.s;
          ghosts().forEach((g) => { const d = Math.hypot(g.m.x - p.x, g.m.y - p.y); if (d < bd) { bd = d; best = { type: 'mid', si: g.si, k: g.k }; } });
        }
        return best;
      }

      /** Snap posisi tampilan: anchor lain (8 px) lalu garis sejajar (5 px). */
      function snapPoint(p, skip) {
        ed.guides = null;
        if (!ed.snap || (ed.drag && ed.drag.alt)) return p;
        const cand = ed.drag.cands;
        const lim = 8 / v.s;
        let best = null, bestD = lim;
        cand.forEach((q) => { const d = Math.hypot(q[0] - p.x, q[1] - p.y); if (d < bestD) { bestD = d; best = q; } });
        if (best) {
          ed.guides = { point: { x: best[0], y: best[1] }, lines: [] };
          return { x: best[0], y: best[1] };
        }
        const al = 5 / v.s;
        let gx = null, gy = null, dx = al, dy = al;
        cand.forEach((q) => {
          if (Math.abs(q[0] - p.x) < dx) { dx = Math.abs(q[0] - p.x); gx = q[0]; }
          if (Math.abs(q[1] - p.y) < dy) { dy = Math.abs(q[1] - p.y); gy = q[1]; }
        });
        const lines = [];
        const out = { x: p.x, y: p.y };
        if (gx !== null) { out.x = gx; lines.push({ axis: 'x', v: gx }); }
        if (gy !== null) { out.y = gy; lines.push({ axis: 'y', v: gy }); }
        if (lines.length) ed.guides = { point: null, lines };
        return out;
      }

      /** Perbarui gambar bentuk di kanvas Periksa detail selama menyeret (belum disimpan). */
      function editPreview() {
        let node = artShape();
        if (!node) return;
        if (node.localName !== 'path') {
          const p = node.ownerDocument.createElementNS(SVG_NS, 'path');
          [...node.attributes].forEach((a) => { if (!EDIT_GEOM.includes(a.name)) p.setAttribute(a.name, a.value); });
          node.replaceWith(p);
          node = p;
        }
        node.setAttribute('d', pathOf(ed.subs));
        drawEdit();
      }

      function editDown(e) {
        if (pointers.size || !ed.subs) return false;
        const p = viewPoint(e);
        let hit = editHit(p);
        if (!hit) return false;
        endRadius();
        let inserted = false;
        if (hit.type === 'mid') {
          const ni = splitSeg(hit.si, hit.k, 0.5);
          ed.sel.clear();
          hit = { type: 'anchor', si: hit.si, ni, key: edKey(hit.si, ni) };
          ed.sel.add(hit.key);
          ed.hover = null;
          inserted = true;
        }
        const additive = !inserted && (e.shiftKey || opts.multi);
        if (hit.type === 'anchor') {
          if (additive) { if (ed.sel.has(hit.key)) ed.sel.delete(hit.key); else ed.sel.add(hit.key); }
          else if (!ed.sel.has(hit.key)) { ed.sel.clear(); ed.sel.add(hit.key); }
        }
        const node = ed.subs[hit.si].nodes[hit.ni];
        const own = new Set();
        if (hit.type === 'anchor') ed.sel.forEach((k) => own.add(k));
        // Kandidat snap: semua anchor ikon (koordinat tampilan), kecuali titik yang sedang digeser
        const moving = [...own].map((k) => { const [si, ni] = k.split(':').map(Number); return toView(ed.subs[si].nodes[ni]); });
        const cands = (v.anchors || []).filter((q) => !moving.some((m) => Math.hypot(m.x - q[0], m.y - q[1]) < 1e-6));
        ed.subs.forEach((sp, si) => sp.nodes.forEach((n, ni) => { if (!own.has(edKey(si, ni))) { const q = toView(n); cands.push([q.x, q.y]); } }));
        const start = new Map();
        own.forEach((k) => { const [si, ni] = k.split(':').map(Number); const n = ed.subs[si].nodes[ni]; start.set(k, JSON.parse(JSON.stringify(n))); });
        const mode = mirrorOf(edKey(hit.si, hit.ni));
        const grab = hit.type === 'anchor' ? toView(node) : toView(node[hit.type]);
        ed.drag = { hit, start, cands, mode, inserted, grab, off: { x: grab.x - p.x, y: grab.y - p.y }, from: { x: e.clientX, y: e.clientY }, moved: false, alt: e.altKey, id: e.pointerId };
        view.setPointerCapture(e.pointerId);
        drawEdit();
        return true;
      }

      /* ---------- lasso: pilih titik anchor dengan menggambar bebas (Q) ---------- */

      /** Mulai lasso (tombol Lasso aktif, pointer tidak di titik / handle). Shift / Pilih banyak = tambah, Alt = kurangi. */
      function lassoDown(e) {
        if (!ed.lasso || !ed.subs || pointers.size || e.button > 0) return false;
        endRadius();
        const p = viewPoint(e);
        const mode = e.altKey ? 'sub' : (e.shiftKey || opts.multi) ? 'add' : 'new';
        ed.lassoDrag = { id: e.pointerId, pts: [[p.x, p.y]], from: { x: e.clientX, y: e.clientY }, moved: false, mode };
        try { view.setPointerCapture(e.pointerId); } catch (err) { /* pointer sudah dilepas */ }
        return true;
      }

      function lassoMove(e) {
        const dr = ed.lassoDrag;
        if (!dr || e.pointerId !== dr.id) return;
        if (!dr.moved && Math.hypot(e.clientX - dr.from.x, e.clientY - dr.from.y) < 4) return;
        dr.moved = true;
        const p = viewPoint(e);
        const last = dr.pts[dr.pts.length - 1];
        if (Math.hypot(p.x - last[0], p.y - last[1]) * v.s < 2) return; // cukup tiap 2 px layar
        dr.pts.push([p.x, p.y]);
        drawEdit();
      }

      /** Titik (koordinat tampilan) di dalam poligon lasso? (ray casting) */
      function inLasso(x, y, poly) {
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
          const [xi, yi] = poly[i], [xj, yj] = poly[j];
          if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
        }
        return inside;
      }

      /** Kunci titik di dalam lasso yang sedang digambar. */
      function lassoKeys(poly) {
        const out = [];
        ed.subs.forEach((sp, si) => sp.nodes.forEach((n, ni) => { const q = toView(n); if (inLasso(q.x, q.y, poly)) out.push(edKey(si, ni)); }));
        return out;
      }

      function lassoUp(e) {
        const dr = ed.lassoDrag;
        if (!dr || e.pointerId !== dr.id) return false;
        ed.lassoDrag = null;
        if (!dr.moved || dr.pts.length < 3) { editClick(e); return true; } // ketuk biasa = pilih bentuk / kosongkan
        if (dr.mode === 'new') ed.sel.clear();
        lassoKeys(dr.pts).forEach((k) => (dr.mode === 'sub' ? ed.sel.delete(k) : ed.sel.add(k)));
        drawEdit();
        paintEditbar();
        return true;
      }

      /** Pilih semua titik bentuk yang sedang diedit. */
      function editSelectAll() {
        if (!ed.subs) return;
        endRadius();
        ed.subs.forEach((sp, si) => sp.nodes.forEach((_, ni) => ed.sel.add(edKey(si, ni))));
        drawEdit();
        paintEditbar();
      }

      function editMove(e) {
        const dr = ed.drag;
        if (!dr || e.pointerId !== dr.id) return;
        if (!dr.moved && Math.hypot(e.clientX - dr.from.x, e.clientY - dr.from.y) < 3) return;
        dr.moved = true;
        dr.alt = e.altKey;
        const p = viewPoint(e);
        const target = snapPoint({ x: p.x + dr.off.x, y: p.y + dr.off.y });
        const { hit } = dr;
        const node = ed.subs[hit.si].nodes[hit.ni];
        if (hit.type === 'anchor') {
          const a = toLocal(dr.grab), b = toLocal(target);
          const dx = b.x - a.x, dy = b.y - a.y;
          dr.start.forEach((s, k) => {
            const [si, ni] = k.split(':').map(Number);
            const n = ed.subs[si].nodes[ni];
            n.x = s.x + dx; n.y = s.y + dy;
            n.hi = s.hi ? { x: s.hi.x + dx, y: s.hi.y + dy } : null;
            n.ho = s.ho ? { x: s.ho.x + dx, y: s.ho.y + dy } : null;
          });
        } else {
          const q = toLocal(target);
          node[hit.type] = q;
          const other = hit.type === 'hi' ? 'ho' : 'hi';
          // Mirroring: segaris (panjang sendiri) atau simetris penuh; Alt = lepas sementara
          if (dr.mode !== 'none' && !e.altKey) {
            const vx = node.x - q.x, vy = node.y - q.y, l = Math.hypot(vx, vy) || 1;
            const len = dr.mode === 'full' ? l : (node[other] ? Math.hypot(node[other].x - node.x, node[other].y - node.y) : l);
            node[other] = { x: node.x + vx / l * len, y: node.y + vy / l * len };
          }
        }
        editPreview();
      }

      function editUp(e) {
        const dr = ed.drag;
        if (!dr || e.pointerId !== dr.id) return false;
        ed.drag = null;
        ed.guides = null;
        if (dr.inserted) editSave('Tambah titik anchor');
        else if (dr.moved) editSave('Pindah titik anchor');
        else { drawEdit(); paintEditbar(); }
        return true;
      }

      /** Klik tanpa menyeret: pilih bentuk / tambah titik / kosongkan pilihan titik. */
      function editClick(e) {
        const p = viewPoint(e);
        endRadius();
        if (ed.subs && ed.add && editInsertAt(p)) return;
        const part = partAt(e.clientX, e.clientY);
        if (part && part.index !== ed.index) {
          editLoad(part.index);
          paintEditbar();
          return;
        }
        if (!part && !(e.shiftKey || opts.multi)) ed.sel.clear();
        drawEdit();
        paintEditbar();
      }

      /** Sisipkan titik di garis bentuk terdekat (kurva dibelah tanpa mengubah bentuk). */
      function editInsertAt(p) {
        if (!ed.subs) return false;
        let best = null, bestD = 12 / v.s;
        segments().forEach((g) => {
          for (let st = 1; st < 64; st++) {
            const t = st / 64;
            const q = toView(bezAt(g.a, g.b, t));
            const d = Math.hypot(q.x - p.x, q.y - p.y);
            if (d < bestD) { bestD = d; best = { si: g.si, k: g.k, t }; }
          }
        });
        if (!best) return false;
        endRadius();
        const ni = splitSeg(best.si, best.k, best.t);
        ed.sel.clear();
        ed.sel.add(edKey(best.si, ni));
        editSave('Tambah titik anchor');
        return true;
      }

      /* ---------- mirroring ---------- */

      function applyMirror(mode) {
        if (!ed.subs || !ed.sel.size) return;
        let changed = false;
        ed.sel.forEach((key) => {
          ed.modes.set(key, mode);
          if (mode === 'none') return;
          const [si, ni] = key.split(':').map(Number);
          const sp = ed.subs[si], n = sp.nodes, node = n[ni];
          const prev = ni > 0 ? n[ni - 1] : sp.closed ? n[n.length - 1] : null;
          const next = ni < n.length - 1 ? n[ni + 1] : sp.closed ? n[0] : null;
          if (!prev || !next || n.length < 3 && !sp.closed) return; // ujung path terbuka: tidak ada dua sisi
          let dx, dy, li, lo;
          if (node.hi && node.ho) {
            dx = node.ho.x - node.hi.x; dy = node.ho.y - node.hi.y;
            li = Math.hypot(node.hi.x - node.x, node.hi.y - node.y);
            lo = Math.hypot(node.ho.x - node.x, node.ho.y - node.y);
          } else {
            // Titik sudut → handle searah lengkungan alami (dari titik sebelum ke sesudahnya)
            dx = next.x - prev.x; dy = next.y - prev.y;
            li = Math.hypot(prev.x - node.x, prev.y - node.y) / 3;
            lo = Math.hypot(next.x - node.x, next.y - node.y) / 3;
          }
          const l = Math.hypot(dx, dy);
          if (!l) return;
          dx /= l; dy /= l;
          if (mode === 'full') li = lo = (li + lo) / 2;
          node.hi = { x: node.x - dx * li, y: node.y - dy * li };
          node.ho = { x: node.x + dx * lo, y: node.y + dy * lo };
          changed = true;
        });
        if (changed) editSave(mode === 'full' ? 'Mirror sudut & panjang' : 'Mirror sudut');
        else { drawEdit(); paintEditbar(); }
      }

      /* ---------- corner radius ---------- */

      /** Sudut yang bisa dibulatkan: titik dengan dua tetangga dan arah keluar-masuk tidak segaris. */
      function cornerInfo(subs, si, ni) {
        const sp = subs[si], n = sp.nodes, P = n[ni];
        const A = ni > 0 ? n[ni - 1] : sp.closed ? n[n.length - 1] : null;
        const B = ni < n.length - 1 ? n[ni + 1] : sp.closed ? n[0] : null;
        if (!A || !B) return null;
        // Arah keluar dari sudut: handle sendiri, lalu handle tetangga, lalu titik tetangga (yang tidak bertumpuk)
        const dirTo = (from, ...cands) => {
          for (const q of cands) {
            if (!q) continue;
            const x = q.x - from.x, y = q.y - from.y, l = Math.hypot(x, y);
            if (l > 1e-6) return { x: x / l, y: y / l };
          }
          return null;
        };
        const u1 = dirTo(P, P.hi, A.ho, A), u2 = dirTo(P, P.ho, B.hi, B);
        if (!u1 || !u2) return null;
        const cos = Math.max(-1, Math.min(1, u1.x * u2.x + u1.y * u2.y));
        const theta = Math.acos(cos);
        if (theta > Math.PI - 0.02 || theta < 0.02) return null;
        const len1 = Math.hypot(A.x - P.x, A.y - P.y), len2 = Math.hypot(B.x - P.x, B.y - P.y);
        return { A, B, P, u1, u2, theta, maxR: Math.min(len1, len2) / 2 * Math.tan(theta / 2) };
      }

      function startRadius() {
        if (ed.radius || !ed.subs) return ed.radius;
        const keys = [...ed.sel].filter((k) => { const [si, ni] = k.split(':').map(Number); return cornerInfo(ed.subs, si, ni); });
        if (!keys.length) return null;
        const max = Math.min(...keys.map((k) => { const [si, ni] = k.split(':').map(Number); return cornerInfo(ed.subs, si, ni).maxR; }));
        ed.radius = { base: JSON.parse(JSON.stringify(ed.subs)), keys, value: 0, max };
        return ed.radius;
      }

      function endRadius() { ed.radius = null; }

      /** Bulatkan sudut terpilih dengan radius r (dihitung ulang dari bentuk sebelum dibulatkan). */
      function applyRadius(r) {
        const R = ed.radius;
        if (!R) return;
        R.value = Math.max(0, Math.min(Number(r) || 0, R.max));
        const subs = JSON.parse(JSON.stringify(R.base));
        const bySub = new Map();
        R.keys.forEach((k) => { const [si, ni] = k.split(':').map(Number); if (!bySub.has(si)) bySub.set(si, []); bySub.get(si).push(ni); });
        if (R.value > 0) bySub.forEach((list, si) => {
          list.sort((a, b) => b - a).forEach((ni) => {
            const c = cornerInfo(subs, si, ni);
            if (!c) return;
            const d = R.value / Math.tan(c.theta / 2);
            const h = 4 / 3 * Math.tan((Math.PI - c.theta) / 4) * R.value;
            const n = subs[si].nodes;
            // Titik di garis masuk & keluar sejauh d dari sudut, lalu lengkungan (busur kubik) di antaranya
            const cut = (from, to, t) => ({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t });
            const len1 = Math.hypot(c.A.x - c.P.x, c.A.y - c.P.y), len2 = Math.hypot(c.B.x - c.P.x, c.B.y - c.P.y);
            const q1 = { ...cut(c.P, c.A, Math.min(1, d / len1)), hi: null, ho: null };
            const q2 = { ...cut(c.P, c.B, Math.min(1, d / len2)), hi: null, ho: null };
            if (c.P.hi) { const t = Math.min(1, d / len1); q1.hi = cut(q1, c.A.ho || c.A, t); }
            if (c.P.ho) { const t = Math.min(1, d / len2); q2.ho = cut(q2, c.B.hi || c.B, t); }
            q1.ho = { x: q1.x - c.u1.x * h, y: q1.y - c.u1.y * h };
            q2.hi = { x: q2.x - c.u2.x * h, y: q2.y - c.u2.y * h };
            n.splice(ni, 1, q1, q2);
          });
        });
        ed.subs = subs;
      }

      function editDelete() {
        if (!ed.subs || !ed.sel.size) return;
        endRadius();
        const bySub = new Map();
        ed.sel.forEach((k) => { const [si, ni] = k.split(':').map(Number); if (!bySub.has(si)) bySub.set(si, new Set()); bySub.get(si).add(ni); });
        // Subpath yang tersisa < 2 titik (mis. semua titiknya dipilih) dibuang utuh
        const drop = new Set();
        bySub.forEach((set, si) => { if (ed.subs[si].nodes.length - set.size < 2) drop.add(si); });
        const n = ed.sel.size;
        if (drop.size >= ed.subs.length) {
          // Semua titik bentuk ini terpilih → hapus bentuknya
          const item = currentItem();
          if (!item) return;
          if (Designer.busy() || Outline.busy()) return View.toast('Tunggu proses yang sedang berjalan selesai.', 'error');
          if (Cleanup.shapesOf(item.node).length <= 1) return View.toast('Tidak bisa menghapus satu-satunya bentuk di ikon ini.', 'error');
          const index = ed.index;
          ed.sel.clear();
          ed.index = null;
          ed.subs = null;
          History.label('Hapus bentuk');
          Cleanup.remove(item, [{ index, sub: null }]);
          Cleanup.commit([item]);
          refresh();
          drawEdit();
          paintEditbar();
          return View.toast('Semua titiknya terpilih, jadi bentuk ini dihapus. Ctrl+Z / Urungkan untuk membatalkan.');
        }
        ed.subs = ed.subs
          .map((sub, si) => (drop.has(si) ? null : bySub.has(si) ? { ...sub, nodes: sub.nodes.filter((_, ni) => !bySub.get(si).has(ni)) } : sub))
          .filter(Boolean);
        ed.sel.clear();
        editSave(drop.size ? `Hapus ${n} titik (${drop.size} bagian utuh)` : `Hapus ${n} titik anchor`);
      }

      /** Geser titik terpilih dengan tombol panah (1 satuan; Shift = 10). */
      function editNudge(dx, dy) {
        if (!ed.subs || !ed.sel.size) return;
        const a = toLocal({ x: 0, y: 0 }), b = toLocal({ x: dx, y: dy });
        const lx = b.x - a.x, ly = b.y - a.y;
        ed.sel.forEach((k) => {
          const [si, ni] = k.split(':').map(Number);
          const n = ed.subs[si].nodes[ni];
          n.x += lx; n.y += ly;
          if (n.hi) { n.hi.x += lx; n.hi.y += ly; }
          if (n.ho) { n.ho.x += lx; n.ho.y += ly; }
        });
        editSave('Geser titik anchor');
      }

      /** Simpan bentuk hasil edit ke file ikon (satu langkah urungkan). */
      function editSave(label) {
        const item = currentItem();
        if (!item || !ed.subs) return;
        if (Designer.busy() || Outline.busy()) { View.toast('Tunggu proses yang sedang berjalan selesai.', 'error'); return editLoad(ed.index, true); }
        const d = pathOf(ed.subs);
        const index = ed.index;
        History.label(label);
        Cleanup.edit(item, () => {
          let node = Cleanup.shapesOf(item.node)[index];
          if (!node) return;
          const asPath = (n) => {
            if (n.localName === 'path') return n;
            const p = n.ownerDocument.createElementNS(SVG_NS, 'path');
            [...n.attributes].forEach((a) => { if (!EDIT_GEOM.includes(a.name)) p.setAttribute(a.name, a.value); });
            n.replaceWith(p);
            return p;
          };
          const back = StrokeEdit.backOf(node);
          node = asPath(node);
          if (back) asPath(back);
          node.setAttribute('d', d);
        });
        Cleanup.commit([item]);
        refresh();
        editLoad(index, true);
        paintEditbar();
      }

      function toggleEdit() {
        opts.edit = !opts.edit;
        if (opts.edit) if (opts.tf) opts.tf = false;
        if (opts.edit) if (opts.sb) { opts.sb = false; sb.regions = []; sb.scope = null; sbRender(); paintSbbar(); }
        endRadius();
        ed.modes.clear();
        if (opts.edit) { opts.pick = false; opts.stk = false; picked.clear(); }
        ed.sel.clear();
        ed.add = false;
        ed.lasso = false;
        ed.lassoDrag = null;
        if (!opts.edit) { ed.index = null; ed.subs = null; view.style.cursor = ''; }
        if (hits) hits.style.display = selecting() || opts.edit ? '' : 'none';
        paintChrome();
        drawMarks();
        drawEdit();
        paintEditbar();
      }

      function paintEditbar() {
        if (!el) return;
        const bar = $('#kd-ins-editbar', el);
        bar.classList.toggle('hidden', !opts.edit);
        paintPanel();
        if (!opts.edit) return;
        const set = (sel, active) => { const b = $(sel, el); b.className = `${btn} ${active ? on : off} disabled:opacity-40`; b.setAttribute('aria-pressed', String(active)); };
        set('[data-ins="esnap"]', ed.snap);
        set('[data-ins="eadd"]', ed.add);
        set('[data-ins="emulti"]', opts.multi);
        set('[data-ins="elasso"]', ed.lasso);
        $('[data-ins="eall"]', el).disabled = !ed.subs;
        $('[data-ins="enone"]', el).disabled = !ed.sel.size;
        view.style.cursor = ed.lasso && ed.subs ? 'crosshair' : '';
        const del = $('[data-ins="edel"]', el);
        del.disabled = !ed.sel.size;
        del.className = `${btn} w-full mt-1.5 border-kd-danger bg-kd-danger text-white hover:bg-rose-600 disabled:opacity-40`;
        del.lastElementChild.textContent = ed.sel.size > 1 ? `Hapus ${ed.sel.size} titik` : 'Hapus titik';
        // Mirroring & corner radius untuk titik terpilih (tidak dirender ulang saat slider radius digeser)
        const optsBox = $('#kd-ins-editopts', el);
        const showOpts = !!ed.subs && (ed.sel.size > 0 || !!ed.radius);
        optsBox.classList.toggle('hidden', !showOpts);
        if (showOpts && !(ed.radius && ed.radius.live)) {
          const modes = [...new Set([...ed.sel].map(mirrorOf))];
          const cur = modes.length === 1 ? modes[0] : null;
          const R = ed.radius || (() => {
            const keys = [...ed.sel].filter((k) => { const [si, ni] = k.split(':').map(Number); return cornerInfo(ed.subs, si, ni); });
            return keys.length ? { value: 0, max: Math.min(...keys.map((k) => { const [si, ni] = k.split(':').map(Number); return cornerInfo(ed.subs, si, ni).maxR; })) } : null;
          })();
          const glyph = (d) => `<svg viewBox="0 0 28 16" class="w-6 h-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 14 C7 6 21 6 25 14" opacity=".45"/><path d="${d}"/><circle cx="14" cy="6" r="1.8" fill="currentColor"/></svg>`;
          const MIR = [
            ['none', 'Tanpa mirroring: handle bebas', 'M14 6 L5 4 M14 6 L22 9'],
            ['angle', 'Mirror sudut: handle segaris, panjang bisa beda', 'M14 6 L4 6 M14 6 L20 6'],
            ['full', 'Mirror sudut & panjang: simetris', 'M14 6 L5 6 M14 6 L23 6']
          ];
          const maxR = R ? Math.max(0.01, round(R.max, 2)) : 0;
          optsBox.innerHTML = `
            ${ed.sel.size ? `<div>
              <p class="text-[11px] font-bold text-kd-muted mb-1">Mirroring</p>
              <div class="flex w-full rounded-lg border border-kd-line bg-white p-0.5" role="group">
                ${MIR.map(([m, t, d]) => `<button type="button" data-ins="emirror" data-mode="${m}" title="${t}" aria-label="${t}" aria-pressed="${cur === m}" class="flex-1 inline-flex justify-center h-7 px-1.5 rounded-md ${cur === m ? 'bg-kd-brand-light text-kd-brand-dark' : 'text-kd-ink hover:text-kd-brand'}">${glyph(d)}</button>`).join('')}
              </div>
            </div>` : ''}
            <div class="${R ? '' : 'opacity-40'}" title="${R ? 'Bulatkan sudut titik terpilih' : 'Pilih titik sudut (bukan titik ujung / kurva halus)'}">
              <p class="text-[11px] font-bold text-kd-muted mb-1">Corner radius</p>
              <div class="flex items-center gap-2">
                <svg viewBox="0 0 16 16" class="w-4 h-4 shrink-0 text-kd-muted" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 14V8a5 5 0 015-5h6"/></svg>
                <input type="range" data-erad min="0" max="${maxR}" step="${round(maxR / 100, 4) || 0.01}" value="${R ? round(R.value, 3) : 0}" ${R ? '' : 'disabled'} class="min-w-0 flex-1 accent-[#2563EB]" aria-label="Corner radius">
                <input type="number" data-erad-num min="0" max="${maxR}" step="0.5" value="${R ? round(R.value, 2) : 0}" ${R ? '' : 'disabled'} class="w-16 shrink-0 h-8 rounded-md border border-kd-line px-2 text-xs font-semibold outline-none focus:border-kd-brand" aria-label="Corner radius (angka)">
              </div>
            </div>`;
        }
        $('#kd-ins-edithint', el).textContent = !ed.subs
          ? 'Ketuk bentuk yang ingin diedit titik anchor-nya.'
          : ed.add
            ? 'Ketuk garis bentuk (biru) untuk menambah titik di situ.'
            : ed.lasso && !ed.sel.size
              ? 'Lasso aktif: seret melingkari titik untuk memilihnya (Shift = tambah, Alt / Option = kurangi). Matikan Lasso untuk menggeser kanvas.'
            : ed.sel.size
              ? `${ed.sel.size} titik dipilih. Seret untuk memindah (menempel ke titik lain${ed.snap ? '' : ' — snap mati'}), panah untuk geser halus, Delete untuk hapus.`
              : 'Seret titik untuk memindah · klik dua kali di garis untuk menambah titik · ketuk bentuk lain untuk ganti bentuk.';
      }

      /* ---------- shape builder: gabung area (default) / hapus area (Alt / Option) ---------- */

      const SB_MAX_SHAPES = 16;
      const SB_MAX_REGIONS = 400;
      const sb = {
        shapes: [],        // [{ el, idx, path (Paper, koordinat ikon), m (lokal → ikon) }] urut z-order
        regions: [],       // [{ path, owners: [idx...] }]
        marked: new Set(), // urutan region yang ditandai selama klik / seret
        scope: null,       // elemen bentuk yang dipakai (null = semua bentuk berisi)
        layer: null,
        mode: 'merge',     // tombol Gabung / Hapus (untuk HP); Alt / Option = hapus sementara
        drag: null,
        busy: false,
        flat: false,       // area dihitung dengan versi aman (kurva dipecah) karena operasi kurva gagal
        tol: 0.1
      };

      /** Satu bentuk SVG → Paper path di koordinat ikon (ikut transform grup & bentuk). */
      function sbPathOf(node, cloneNode, inner) {
        const P = window.paper;
        const d = node.localName === 'path' ? node.getAttribute('d') : Outline.geometry(node);
        if (!d || !cloneNode.getCTM() || !inner.getCTM()) return null;
        const path = P.PathItem.create(d);
        if (path.remove) path.remove();
        const m = inner.getCTM().inverse().multiply(cloneNode.getCTM());
        path.transform(new P.Matrix(m.a, m.b, m.c, m.d, m.e, m.f));
        const evenodd = getComputedStyle(cloneNode).fillRule === 'evenodd';
        path.fillRule = evenodd ? 'evenodd' : 'nonzero';
        try {
          // Isi (fill) selalu digambar tertutup, jadi subpath tanpa Z ikut ditutup
          if (path.children) path.children.forEach((k) => { k.closed = true; });
          else path.closed = true;
          if (path.reorient) path.reorient(!evenodd, true);
        } catch (err) { /* biarkan apa adanya */ }
        return { path, m };
      }

      /** Pecah region gabungan jadi pulau-pulau terpisah (lubang ikut pulau yang memuatnya). */
      function sbIslands(path) {
        const kids = path.children ? path.children.filter((k) => k.segments && k.segments.length > 1) : [path];
        if (kids.length < 2) return [path];
        const outerSign = Math.sign(path.area) || 1;
        const outers = kids.filter((k) => Math.sign(k.area) === outerSign);
        const holes = kids.filter((k) => Math.sign(k.area) !== outerSign);
        if (outers.length < 2) return [path];
        const P = window.paper;
        return outers.map((o) => new P.CompoundPath({
          children: [o.clone({ insert: false }), ...holes.filter((h) => o.contains(h.interiorPoint)).map((h) => h.clone({ insert: false }))],
          fillRule: 'nonzero',
          insert: false
        }));
      }

      /** Hitung area: setiap bentuk memotong area yang sudah ada (irisan / sisa). */
      function sbCompute() {
        sb.shapes = [];
        sb.regions = [];
        sb.marked.clear();
        const item = currentItem();
        const inner = v && v.art && v.art.firstElementChild;
        if (!item || !inner || !window.paper) return;
        const srcEls = Cleanup.shapesOf(item.node);
        const cloneEls = Cleanup.shapesOf(inner);
        const filled = shapeColors(item);
        let idxs = srcEls.map((_, i) => i).filter((i) => filled[i] && filled[i].hasFill);
        if (sb.scope) {
          const chosen = sb.scope.map((n) => srcEls.indexOf(n)).filter((i) => i >= 0);
          if (chosen.length === sb.scope.length && chosen.length) idxs = chosen.sort((a, b) => a - b);
          else sb.scope = null; // bentuk lama sudah tidak ada (mis. diurungkan) → pakai semua bentuk berisi
        }
        if (idxs.length > SB_MAX_SHAPES) {
          View.toast(`Terlalu banyak bentuk (${idxs.length}). Pilih maks. ${SB_MAX_SHAPES} bentuk dulu lewat Pilih, lalu buka Shape builder.`, 'error');
          return;
        }
        window.paper.activate();
        idxs.forEach((idx) => {
          const got = sbPathOf(srcEls[idx], cloneEls[idx], inner);
          if (got && Math.abs(got.path.area) > 1e-6) sb.shapes.push({ el: srcEls[idx], idx, ...got });
        });
        const box = sb.shapes.reduce((b, s) => (b ? b.unite(s.path.bounds) : s.path.bounds), null);
        const eps = box ? box.width * box.height * 1e-6 : 0;
        const tol = box ? Math.max(box.width, box.height) / 2000 : 0.1;
        let flatMode = false;
        // Serpihan sangat tipis dari tepi yang berimpit (lebar < ±0,3% ukuran ikon) tidak dihitung sebagai area
        const solid = (p) => p && Math.abs(p.area) > eps && Math.abs(p.area) / Math.max(p.length, 1e-9) > tol * 3;
        const area = (p) => (p ? Math.abs(p.area) : 0);
        // Toleransi cek luas: 0,2% luas bentuk (+ eps untuk area kecil)
        const near = (a, b, ref) => Math.abs(a - b) <= Math.max(eps * 10, ref * 2e-3);
        /**
         * Susun area: tiap bentuk memotong area yang sudah ada. strict = cek luas tiap potongan
         * (irisan + sisa harus = asal); gagal → null, supaya dihitung ulang dengan versi aman.
         */
        const build = (strict) => {
          let regions = [];
          for (const s of sb.shapes) {
            const next = [];
            let rest = s.path.clone({ insert: false });
            let taken = 0;
            for (const r of regions) {
              const inter = r.path.intersect(s.path, { insert: false });
              const diff = r.path.subtract(s.path, { insert: false });
              if (strict && !near(area(inter) + area(diff), area(r.path), area(r.path))) return null;
              if (solid(inter)) next.push({ path: inter, owners: [...r.owners, s.idx] });
              if (solid(diff)) next.push({ path: diff, owners: r.owners });
              taken += area(inter);
              rest = rest.subtract(r.path, { insert: false });
            }
            if (strict && !near(area(rest), Math.max(0, area(s.path) - taken), area(s.path))) return null;
            if (solid(rest)) next.push({ path: rest, owners: [s.idx] });
            regions = next;
            if (regions.length > SB_MAX_REGIONS) return 'big';
          }
          return regions;
        };
        let regions = build(true);
        if (regions === null) {
          // Operasi kurva Paper.js kadang gagal diam-diam (area hilang). Versi aman: kurva dipecah jadi
          // garis pendek yang sangat rapat (tampilan sama), dipakai juga saat menerapkan hasil.
          flatMode = true;
          sb.shapes.forEach((sh) => { sh.path = sh.path.clone({ insert: false }); sh.path.flatten(tol); });
          regions = build(false);
        }
        if (regions === 'big') {
          View.toast('Bentuk terlalu rumit untuk Shape builder. Pilih lebih sedikit bentuk lewat Pilih.', 'error');
          sb.regions = [];
          return;
        }
        sb.flat = flatMode;
        sb.tol = tol;
        regions.forEach((r) => sbIslands(r.path).forEach((p) => { if (solid(p)) sb.regions.push({ path: p, owners: r.owners }); }));
      }

      /** Gambar area sebagai lapisan klik (hover = sorot; ditandai = biru gabung / merah hapus). */
      function sbRender() {
        if (!sb.layer) return;
        const inner = v && v.art && v.art.firstElementChild;
        if (!opts.sb || !inner || !sb.regions.length || !svg.getScreenCTM() || !inner.getScreenCTM()) return sb.layer.replaceChildren();
        const m = svg.getScreenCTM().inverse().multiply(inner.getScreenCTM());
        const del = sb.drag ? sb.drag.del : sb.mode === 'delete';
        sb.layer.setAttribute('class', `kd-sb ${del ? 'kd-sb-del' : ''}`);
        sb.layer.innerHTML = `<g transform="matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.e} ${m.f})">${sb.regions.map((r, i) =>
          `<path class="kd-sb-region${sb.marked.has(i) ? ' kd-sb-on' : ''}" data-sb="${i}" fill-rule="evenodd" d="${r.path.getPathData(null, 3)}"/>`).join('')}</g>`;
      }

      const sbRegionAt = (x, y) => {
        const hit = document.elementsFromPoint(x, y).find((n) => n.dataset && n.dataset.sb !== undefined && sb.layer.contains(n));
        return hit ? Number(hit.dataset.sb) : null;
      };

      function sbMark(i) {
        if (i === null || sb.marked.has(i)) return;
        sb.marked.add(i);
        const node = sb.layer.querySelector(`[data-sb="${i}"]`);
        if (node) node.classList.add('kd-sb-on');
      }

      function sbDown(e) {
        if (pointers.size || sb.busy) return false;
        const i = sbRegionAt(e.clientX, e.clientY);
        if (i === null) return false;
        sb.drag = { id: e.pointerId, del: e.altKey || sb.mode === 'delete' };
        sb.marked.clear();
        sbRender();
        sbMark(i);
        view.setPointerCapture(e.pointerId);
        return true;
      }

      function sbMove(e) {
        if (sb.drag && e.pointerId === sb.drag.id) sbMark(sbRegionAt(e.clientX, e.clientY));
      }

      function sbUp(e) {
        if (!sb.drag || e.pointerId !== sb.drag.id) return false;
        const del = sb.drag.del;
        sb.drag = null;
        sbApply(del);
        return true;
      }

      /** Bentuk SVG → path (rect, circle, dst. diubah dulu; tampilan sama). */
      function sbAsPath(n) {
        if (n.localName === 'path') return n;
        const p = n.ownerDocument.createElementNS(SVG_NS, 'path');
        [...n.attributes].forEach((a) => { if (!EDIT_GEOM.includes(a.name)) p.setAttribute(a.name, a.value); });
        n.replaceWith(p);
        return p;
      }

      /**
       * Garis-garis pendek (hasil versi aman) → kurva lagi, sudut tajam tetap tajam:
       * dipotong di setiap sudut (belokan > 28°), tiap ruas halus di-simplify sendiri, lalu disambung.
       */
      function sbSmooth(k, tol) {
        const P = window.paper;
        const pts = k.segments ? k.segments.map((sg) => sg.point) : [];
        const n = pts.length;
        if (n < 9 || !k.closed) return;
        const isCorner = (i) => {
          const a = pts[(i - 1 + n) % n], b = pts[i], c = pts[(i + 1) % n];
          const v1 = b.subtract(a), v2 = c.subtract(b);
          return v1.length > 0 && v2.length > 0 && Math.abs(v1.getDirectedAngle(v2)) > 28;
        };
        const corners = pts.map((_, i) => i).filter(isCorner);
        if (!corners.length) { k.simplify(tol); return; }
        const out = [];
        let carry = null; // handle masuk untuk sudut berikutnya (dari ujung ruas sebelumnya)
        corners.forEach((c0, j) => {
          const c1 = corners[(j + 1) % corners.length];
          const run = [pts[c0]];
          for (let i = (c0 + 1) % n; ; i = (i + 1) % n) { run.push(pts[i]); if (i === c1) break; }
          const part = new P.Path({ segments: run, insert: false });
          if (run.length > 3) part.simplify(tol);
          const list = part.segments;
          list.slice(0, -1).forEach((sg, idx) => out.push(new P.Segment(sg.point, idx ? sg.handleIn : carry, sg.handleOut)));
          carry = list[list.length - 1].handleIn;
        });
        if (out.length) out[0].handleIn = carry; // sudut pertama menerima handle dari ruas terakhir
        k.removeSegments();
        k.addSegments(out);
        k.closed = true;
      }

      /** Tulis geometri (koordinat ikon) ke bentuk dalam koordinat lokalnya. */
      function sbWrite(node, path, m) {
        const P = window.paper;
        const local = path.clone({ insert: false });
        // Hasil versi aman berupa garis-garis pendek → dijadikan kurva lagi agar titik anchor tidak membengkak
        if (sb.flat) (local.children || [local]).forEach((k) => sbSmooth(k, sb.tol));
        const inv = m.inverse();
        local.transform(new P.Matrix(inv.a, inv.b, inv.c, inv.d, inv.e, inv.f));
        const back = StrokeEdit.backOf(node);
        const el = sbAsPath(node);
        if (back) sbAsPath(back);
        el.setAttribute('d', local.getPathData(null, 3));
        return el;
      }

      /** Gabung: area ditandai jadi satu bentuk (warna area pertama). Hapus: area ditandai dibuang. */
      function sbApply(del) {
        const item = currentItem();
        const marked = [...sb.marked].map((i) => sb.regions[i]).filter(Boolean);
        if (!item || !marked.length) return sbRender();
        if (Designer.busy() || Outline.busy()) { View.toast('Tunggu proses yang sedang berjalan selesai.', 'error'); return sbRender(); }
        const eps = 1e-6 * Math.max(1, ...sb.shapes.map((x) => Math.abs(x.path.area)));
        if (!del && marked.length === 1 && marked[0].owners.length === 1) {
          const only = sb.shapes.find((x) => x.idx === marked[0].owners[0]);
          if (only && Math.abs(Math.abs(only.path.area) - Math.abs(marked[0].path.area)) < eps) {
            sb.marked.clear();
            return sbRender(); // satu bentuk utuh tanpa tumpang-tindih: tidak ada yang berubah
          }
        }
        let union = marked[0].path;
        for (let k = 1; k < marked.length; k++) union = union.unite(marked[k].path, { insert: false });
        const ownerIdx = Math.max(...marked[0].owners); // bentuk teratas di area pertama = warna hasil
        const owner = sb.shapes.find((s) => s.idx === ownerIdx);
        const keep = [];
        History.label(del ? 'Shape builder: hapus area' : 'Shape builder: gabung area');
        Cleanup.edit(item, () => {
          if (!del && owner) {
            const merged = owner.el.cloneNode(false);
            ['id', 'data-kd-back', 'data-kd-layer', 'data-kd-clip', 'data-kd-clip-prev', 'data-kd-pos'].forEach((a) => merged.removeAttribute(a));
            owner.el.parentNode.insertBefore(merged, owner.el.nextSibling);
            keep.push(sbWrite(merged, union, owner.m));
          }
          sb.shapes.forEach((sh) => {
            if (!sh.path.bounds.intersects(union.bounds)) return keep.push(sh.el);
            let rest = sh.path.subtract(union, { insert: false });
            // Cek luas: sisa + irisan harus = bentuk asal; bila tidak, hitung ulang versi garis (bentuk tidak ikut terhapus)
            const inter = sh.path.intersect(union, { insert: false });
            const full = Math.abs(sh.path.area);
            if (Math.abs(Math.abs(rest.area) + Math.abs(inter.area) - full) > Math.max(eps * 10, full * 2e-3)) {
              const tol = Math.max(sh.path.bounds.width, sh.path.bounds.height) / 2000;
              const a = sh.path.clone({ insert: false }); a.flatten(tol);
              const b = union.clone({ insert: false }); b.flatten(tol);
              rest = a.subtract(b, { insert: false });
            }
            if (Math.abs(Math.abs(rest.area) - Math.abs(sh.path.area)) < eps) return keep.push(sh.el); // tidak tersentuh
            if (Math.abs(rest.area) < eps) {
              const back = StrokeEdit.backOf(sh.el);
              if (back) back.remove();
              return sh.el.remove();
            }
            keep.push(sbWrite(sh.el, rest, sh.m));
          });
        });
        if (sb.scope) sb.scope = keep;
        sb.marked.clear();
        Cleanup.commit([item]);
        refresh(); // show() menghitung ulang area dari bentuk hasil
        View.toast(del ? `${marked.length} area dihapus.` : `${marked.length} area digabung jadi satu bentuk.`);
      }

      async function toggleSb() {
        if (sb.busy) return;
        if (opts.sb) {
          opts.sb = false;
          sb.regions = [];
          sb.scope = null;
          sbRender();
          paintChrome();
          return paintSbbar();
        }
        // Bentuk yang sedang dipilih (Pilih) dipakai bila ≥ 2; selain itu semua bentuk berisi
        const item = currentItem();
        const chosen = item ? [...new Set(parts.filter((part) => picked.has(part.key)).map((part) => part.index))] : [];
        const els = item ? Cleanup.shapesOf(item.node) : [];
        sb.scope = chosen.length >= 2 ? chosen.map((i) => els[i]).filter(Boolean) : null;
        opts.pick = false; opts.stk = false; opts.pcolor = false; opts.tf = false;
        if (opts.edit) { opts.edit = false; ed.index = null; ed.subs = null; ed.sel.clear(); drawEdit(); paintEditbar(); }
        picked.clear();
        opts.sb = true;
        sb.busy = true;
        paintChrome();
        paintSbbar('Menyiapkan Shape builder…');
        try {
          await Outline.ready();
        } catch (err) {
          sb.busy = false;
          opts.sb = false;
          paintChrome();
          paintSbbar();
          return View.toast('Alat Shape builder gagal dimuat. Periksa koneksi internet lalu coba lagi.', 'error');
        }
        sb.busy = false;
        if (!opts.sb) return;
        sbCompute();
        sbRender();
        drawMarks();
        paintSbbar();
      }

      function paintSbbar(note) {
        if (!el) return;
        const bar = $('#kd-ins-sbbar', el);
        bar.classList.toggle('hidden', !opts.sb);
        paintPanel();
        if (!opts.sb) return;
        const set = (sel, active) => { const b = $(sel, el); b.className = `${btn} ${active ? on : off}`; b.setAttribute('aria-pressed', String(active)); };
        set('[data-ins="sbmerge"]', sb.mode === 'merge');
        set('[data-ins="sbdel"]', sb.mode === 'delete');
        $('#kd-ins-sbhint', el).textContent = note || (!sb.regions.length
          ? 'Tidak ada bentuk berisi yang bisa diolah di ikon ini.'
          : `${sb.regions.length} area dari ${sb.shapes.length} bentuk${sb.scope ? ' terpilih' : ''}. Klik / seret melewati area untuk ${sb.mode === 'delete' ? 'menghapus' : 'menggabung'}${sb.mode === 'delete' ? '' : ' · tahan Alt / Option untuk menghapus'}.`);
      }

      /* ---------- transform: pindah, resize, putar, flip, urutan layer, duplikat ---------- */

      const tf = {
        layer: null,
        lock: false,  // kunci rasio (tombol gembok; Shift = kunci sementara)
        guides: true, // smart guide saat memindah (tahan Ctrl / Cmd untuk lepas sementara)
        drag: null,   // { type: 'move' | 'scale' | 'rotate', ... }
        hover: null
      };
      // SVGMatrix → DOMMatrix (SVGMatrix.multiply hanya menerima SVGMatrix)
      const dm = (m) => new DOMMatrix([m.a, m.b, m.c, m.d, m.e, m.f]);
      const TF_HANDLES = [
        ['nw', 0, 0, 'nwse-resize'], ['n', 0.5, 0, 'ns-resize'], ['ne', 1, 0, 'nesw-resize'], ['e', 1, 0.5, 'ew-resize'],
        ['se', 1, 1, 'nwse-resize'], ['s', 0.5, 1, 'ns-resize'], ['sw', 0, 1, 'nesw-resize'], ['w', 0, 0.5, 'ew-resize']
      ];

      /** Pilihan sekarang dikelompokkan per bentuk: [{ index, subs: Set | null (null = seluruh bentuk) }]. */
      function tfSelection() {
        const by = new Map();
        parts.filter((part) => picked.has(part.key)).forEach((part) => {
          if (!by.has(part.index)) by.set(part.index, new Set());
          by.get(part.index).add(part.sub);
        });
        return [...by.entries()].map(([index, set]) => {
          const all = parts.filter((part) => part.index === index);
          const whole = set.has(null) || all.every((part) => set.has(part.sub));
          return { index, subs: whole ? null : set };
        });
      }

      /** Geometri bentuk terpilih (koordinat lokal) + matriks lokal → koordinat ikon, dari kanvas Periksa detail. */
      function tfGeometry(sel) {
        const item = currentItem();
        const inner = v && v.art && v.art.firstElementChild;
        if (!item || !inner || !inner.getCTM()) return [];
        const src = Cleanup.shapesOf(item.node);
        const clones = Cleanup.shapesOf(inner);
        const toRoot = inner.getCTM().inverse();
        return (sel || tfSelection()).map(({ index, subs }) => {
          const node = src[index], clone = clones[index];
          if (!node || !clone || !clone.getCTM()) return null;
          const m = dm(toRoot.multiply(clone.getCTM()));
          const all = parsePath(node.localName === 'path' ? node.getAttribute('d') : Outline.geometry(node));
          return { index, subs, m, all, clone };
        }).filter(Boolean);
      }

      /** Kotak batas (koordinat ikon) dari geometri terpilih; kurva diambil sampelnya agar pas. */
      function tfBounds(geo) {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        geo.forEach((g) => g.all.forEach((sp, si) => {
          if (g.subs && !g.subs.has(si)) return; // potongan lain dari bentuk ini tidak ikut
          const n = sp.nodes;
          const add = (p) => {
            const q = new DOMPoint(p.x, p.y).matrixTransform(g.m);
            x0 = Math.min(x0, q.x); y0 = Math.min(y0, q.y); x1 = Math.max(x1, q.x); y1 = Math.max(y1, q.y);
          };
          n.forEach(add);
          const count = sp.closed ? n.length : n.length - 1;
          for (let k = 0; k < count; k++) {
            const a = n[k], b = n[(k + 1) % n.length];
            if (a.ho || b.hi) for (let t = 1; t < 12; t++) add(bezAt(a, b, t / 12));
          }
        }));
        return x0 === Infinity ? null : { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
      }

      /** Terapkan matriks T (koordinat ikon) ke simpul subpath terpilih; kembalikan subpath baru (lokal). */
      function tfTransformed(g, T) {
        const L = g.m.inverse().multiply(T).multiply(g.m);
        const map = (p) => (p ? (({ x, y }) => ({ x, y }))(new DOMPoint(p.x, p.y).matrixTransform(L)) : null);
        return g.all.map((sp, si) => (g.subs && !g.subs.has(si)
          ? sp
          : { closed: sp.closed, nodes: sp.nodes.map((n) => ({ ...map(n), hi: map(n.hi), ho: map(n.ho) })) }));
      }

      /** Pratinjau saat menyeret: hanya bentuk terpilih di kanvas Periksa detail yang digambar ulang. */
      function tfPreview(T) {
        tf.drag.geo.forEach((g) => {
          let node = g.clone;
          if (node.localName !== 'path') {
            const p = node.ownerDocument.createElementNS(SVG_NS, 'path');
            [...node.attributes].forEach((a) => { if (!EDIT_GEOM.includes(a.name)) p.setAttribute(a.name, a.value); });
            node.replaceWith(p);
            node = g.clone = p;
          }
          node.setAttribute('d', pathOf(tfTransformed(g, T)));
        });
        tf.drag.T = T;
        drawTf();
      }

      /** Simpan transform ke file ikon (satu langkah urungkan); geometri "dibakar" ke koordinat path. */
      function tfCommit(T, label, geo = tfGeometry()) {
        const item = currentItem();
        if (!item || !geo.length) return;
        if (Designer.busy() || Outline.busy()) return View.toast('Tunggu proses yang sedang berjalan selesai.', 'error');
        History.label(label);
        Cleanup.edit(item, () => {
          const els = Cleanup.shapesOf(item.node);
          geo.forEach((g) => {
            const node = els[g.index];
            if (!node) return;
            const back = StrokeEdit.backOf(node);
            const el = sbAsPath(node);
            if (back) sbAsPath(back);
            el.setAttribute('d', pathOf(tfTransformed(g, T)));
          });
        });
        Cleanup.commit([item]);
        refresh();
      }

      const tfAbout = (cx, cy, m) => new DOMMatrix().translate(cx, cy).multiply(m).translate(-cx, -cy);

      /** Kotak, 8 handle, handle putar (untuk layar sentuh) & label ukuran — koordinat tampilan. */
      function drawTf() {
        if (!tf.layer) return;
        if (!opts.tf || !picked.size || !v || !v.art) return tf.layer.replaceChildren();
        const inner = v.art.firstElementChild;
        if (!inner.getScreenCTM()) return;
        const V = dm(svg.getScreenCTM().inverse().multiply(inner.getScreenCTM()));
        const box = tf.drag ? tf.drag.box : tfBounds(tfGeometry());
        if (!box) return tf.layer.replaceChildren();
        const T = tf.drag && tf.drag.T ? tf.drag.T : new DOMMatrix();
        const M = V.multiply(T);
        const pt = (x, y) => new DOMPoint(x, y).matrixTransform(M);
        const c = [pt(box.x, box.y), pt(box.x + box.w, box.y), pt(box.x + box.w, box.y + box.h), pt(box.x, box.y + box.h)];
        const r = 4 / v.s;
        const out = [`<path d="M${c.map((q) => `${q.x} ${q.y}`).join('L')}Z" fill="none" stroke="#2563EB" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`];
        if (!tf.drag || tf.drag.type !== 'rotate') {
          const top = pt(box.x + box.w / 2, box.y);
          const up = new DOMPoint(box.x + box.w / 2, box.y).matrixTransform(V);
          out.push(`<line x1="${top.x}" y1="${top.y}" x2="${up.x}" y2="${up.y - 22 / v.s}" stroke="#2563EB" stroke-width="1" vector-effect="non-scaling-stroke"/>`
            + `<circle cx="${up.x}" cy="${up.y - 22 / v.s}" r="${5 / v.s}" fill="#FFFFFF" stroke="#2563EB" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`);
          TF_HANDLES.forEach(([, fx, fy]) => {
            const q = pt(box.x + box.w * fx, box.y + box.h * fy);
            out.push(`<rect x="${q.x - r}" y="${q.y - r}" width="${2 * r}" height="${2 * r}" fill="#FFFFFF" stroke="#2563EB" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`);
          });
        }
        if (tf.drag && tf.drag.guides) {
          const vb = currentItem().viewBox;
          const pad = Math.max(vb.w, vb.h);
          const vp = (x, y) => new DOMPoint(x, y).matrixTransform(V);
          const line = (a, b2) => `<line x1="${a.x}" y1="${a.y}" x2="${b2.x}" y2="${b2.y}" stroke="#E11D84" stroke-width="1" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/>`;
          if (tf.drag.guides.x !== null) out.push(line(vp(tf.drag.guides.x, vb.y - pad), vp(tf.drag.guides.x, vb.y + vb.h + pad)));
          if (tf.drag.guides.y !== null) out.push(line(vp(vb.x - pad, tf.drag.guides.y), vp(vb.x + vb.w + pad, tf.drag.guides.y)));
        }
        const bottom = pt(box.x + box.w / 2, box.y + box.h);
        const size = tf.drag && tf.drag.type === 'rotate' ? `${round(tf.drag.angle || 0, 1)}°`
          : (() => { const b2 = tf.drag && tf.drag.T ? tfBoundsAfter() : box; return `${round(b2.w, 2)} × ${round(b2.h, 2)}`; })();
        const fs = 11 / v.s;
        out.push(`<g transform="translate(${bottom.x} ${bottom.y + 10 / v.s})"><rect x="${-size.length * fs * 0.32 - 6 / v.s}" y="0" width="${size.length * fs * 0.64 + 12 / v.s}" height="${18 / v.s}" rx="${4 / v.s}" fill="#2563EB"/><text x="0" y="${13 / v.s}" text-anchor="middle" font-size="${fs}" font-family="system-ui, sans-serif" font-weight="700" fill="#FFFFFF">${size}</text></g>`);
        tf.layer.innerHTML = out.join('');
      }

      function tfBoundsAfter() {
        const geo = tf.drag.geo.map((g) => ({ ...g, all: tfTransformed(g, tf.drag.T), subs: g.subs }));
        return tfBounds(geo) || tf.drag.box;
      }

      /** Bagian kotak transform di bawah pointer: handle resize, zona / handle putar, atau isi kotak. */
      function tfHit(e) {
        if (!opts.tf || !picked.size || !v || !v.art) return null;
        const inner = v.art.firstElementChild;
        const box = tfBounds(tfGeometry());
        if (!box || !inner.getScreenCTM()) return null;
        const S = inner.getScreenCTM();
        const sp = (x, y) => new DOMPoint(x, y).matrixTransform(S);
        const p = { x: e.clientX, y: e.clientY };
        const top = sp(box.x + box.w / 2, box.y);
        if (Math.hypot(top.x - p.x, top.y - 22 - p.y) < 12) return { type: 'rotate', box };
        for (const [name, fx, fy, cursor] of TF_HANDLES) {
          const q = sp(box.x + box.w * fx, box.y + box.h * fy);
          if (Math.hypot(q.x - p.x, q.y - p.y) < 10) return { type: 'scale', handle: name, fx, fy, cursor, box };
        }
        const a = sp(box.x, box.y), b = sp(box.x + box.w, box.y + box.h);
        const inside = p.x >= Math.min(a.x, b.x) && p.x <= Math.max(a.x, b.x) && p.y >= Math.min(a.y, b.y) && p.y <= Math.max(a.y, b.y);
        if (inside) return { type: 'move', box };
        // Sedikit di luar sudut = putar (seperti Figma)
        for (const [name, fx, fy] of TF_HANDLES) {
          if (name.length !== 2) continue;
          const q = sp(box.x + box.w * fx, box.y + box.h * fy);
          const d = Math.hypot(q.x - p.x, q.y - p.y);
          if (d >= 10 && d < 26) return { type: 'rotate', box };
        }
        return null;
      }

      const rootPoint = (e) => new DOMPoint(e.clientX, e.clientY).matrixTransform(v.art.firstElementChild.getScreenCTM().inverse());

      function tfDown(e) {
        if (pointers.size) return false;
        let hit = tfHit(e);
        // Klik bentuk yang belum terpilih lalu langsung seret = pilih + pindah (seperti Figma)
        if (!hit) {
          const part = partUnder(e.clientX, e.clientY);
          if (!part) return false;
          if (!picked.has(part.key)) {
            if (!(e.shiftKey || opts.multi)) picked.clear();
            parts.filter((p2) => p2.index === part.index && (part.sub === null || p2.key === part.key)).forEach((p2) => picked.add(p2.key));
            drawMarks();
          }
          hit = { type: 'move', box: tfBounds(tfGeometry()) };
          if (!hit.box) return false;
        }
        if (hit.type === 'move' && e.altKey) {
          tfDuplicate(true);  // Alt / Option + seret = duplikat lalu pindahkan salinannya
          hit = { type: 'move', box: tfBounds(tfGeometry()) };
        }
        const start = rootPoint(e);
        const c = { x: hit.box.x + hit.box.w / 2, y: hit.box.y + hit.box.h / 2 };
        tf.drag = { ...hit, id: e.pointerId, start, c, geo: tfGeometry(), T: null, from: { x: e.clientX, y: e.clientY }, moved: false, angle: 0,
          targets: hit.type === 'move' && tf.guides ? tfGuideTargets(new Set(tfSelection().map((x) => x.index))) : null };
        view.setPointerCapture(e.pointerId);
        return true;
      }

      function tfMove(e) {
        const dr = tf.drag;
        if (!dr || e.pointerId !== dr.id) return;
        if (!dr.moved && Math.hypot(e.clientX - dr.from.x, e.clientY - dr.from.y) < 3) return;
        dr.moved = true;
        const p = rootPoint(e);
        const box = dr.box;
        let T;
        if (dr.type === 'move') {
          let dx = p.x - dr.start.x, dy = p.y - dr.start.y;
          if (e.shiftKey) { if (Math.abs(dx) > Math.abs(dy)) dy = 0; else dx = 0; }
          if (!(e.ctrlKey || e.metaKey)) [dx, dy] = tfSnapMove(dr, dx, dy);
          else dr.guides = null;
          T = new DOMMatrix().translate(dx, dy);
        } else if (dr.type === 'rotate') {
          let a = (Math.atan2(p.y - dr.c.y, p.x - dr.c.x) - Math.atan2(dr.start.y - dr.c.y, dr.start.x - dr.c.x)) * 180 / Math.PI;
          if (e.shiftKey) a = Math.round(a / 15) * 15;
          dr.angle = ((a + 540) % 360) - 180;
          T = tfAbout(dr.c.x, dr.c.y, new DOMMatrix().rotate(dr.angle));
        } else {
          // Titik tetap: sisi / sudut seberang, atau tengah bila Alt / Option
          const center = e.altKey;
          const ax = center ? dr.c.x : box.x + box.w * (1 - dr.fx), ay = center ? dr.c.y : box.y + box.h * (1 - dr.fy);
          const hx = box.x + box.w * dr.fx, hy = box.y + box.h * dr.fy;
          let sx = dr.fx === 0.5 ? 1 : (p.x - ax) / ((hx - ax) || 1e-9);
          let sy = dr.fy === 0.5 ? 1 : (p.y - ay) / ((hy - ay) || 1e-9);
          if (e.shiftKey || tf.lock) {
            const s = dr.fx === 0.5 ? sy : dr.fy === 0.5 ? sx : (Math.abs(sx) > Math.abs(sy) ? sx : sy);
            sx = Math.sign(sx || 1) * Math.abs(s);
            sy = Math.sign(sy || 1) * Math.abs(s);
            if (dr.fx === 0.5) sx = Math.abs(s);
            if (dr.fy === 0.5) sy = Math.abs(s);
          }
          const tiny = 1e-3;
          if (Math.abs(sx) < tiny) sx = tiny * Math.sign(sx || 1);
          if (Math.abs(sy) < tiny) sy = tiny * Math.sign(sy || 1);
          T = tfAbout(ax, ay, new DOMMatrix().scale(sx, sy));
        }
        tfPreview(T);
      }

      function tfUp(e) {
        const dr = tf.drag;
        if (!dr || e.pointerId !== dr.id) return false;
        tf.drag = null;
        if (dr.moved && dr.T) {
          const label = dr.type === 'move' ? 'Pindah bentuk' : dr.type === 'rotate' ? 'Putar bentuk' : 'Ubah ukuran bentuk';
          tfCommit(dr.T, label, dr.geo);
        } else drawTf();
        paintTf();
        return true;
      }

      function tfFlip(horizontal) {
        const box = tfBounds(tfGeometry());
        if (!box) return;
        tfCommit(tfAbout(box.x + box.w / 2, box.y + box.h / 2, new DOMMatrix().scale(horizontal ? -1 : 1, horizontal ? 1 : -1)), horizontal ? 'Flip horizontal' : 'Flip vertikal');
      }

      function tfNudge(dx, dy) {
        tfCommit(new DOMMatrix().translate(dx, dy), 'Geser bentuk');
      }

      /** Ubah lewat angka di panel: X / Y (posisi), W / H (ukuran, dari kiri-atas), sudut. */
      function tfSet(key, value) {
        const box = tfBounds(tfGeometry());
        const n = Number(value);
        if (!box || !Number.isFinite(n)) return;
        let T;
        if (key === 'x') T = new DOMMatrix().translate(n - box.x, 0);
        else if (key === 'y') T = new DOMMatrix().translate(0, n - box.y);
        else if (key === 'r') T = tfAbout(box.x + box.w / 2, box.y + box.h / 2, new DOMMatrix().rotate(n));
        else {
          if (n <= 0) return;
          let sx = key === 'w' ? n / (box.w || 1) : 1, sy = key === 'h' ? n / (box.h || 1) : 1;
          if (tf.lock) { if (key === 'w') sy = sx; else sx = sy; }
          T = tfAbout(box.x, box.y, new DOMMatrix().scale(sx, sy));
        }
        tfCommit(T, key === 'r' ? 'Putar bentuk' : key === 'x' || key === 'y' ? 'Pindah bentuk' : 'Ubah ukuran bentuk');
      }

      /** Pilih ulang bentuk setelah urutan / jumlah bentuk berubah. */
      function tfReselect(nodes) {
        const item = currentItem();
        if (!item) return;
        const els = Cleanup.shapesOf(item.node);
        const idx = new Set(nodes.map((n) => els.indexOf(n)).filter((i) => i >= 0));
        picked.clear();
        parts.filter((part) => idx.has(part.index)).forEach((part) => picked.add(part.key));
        drawMarks();
      }

      const isShapeEl = (n) => n && n.nodeType === 1 && n.localName !== 'defs' && !n.hasAttribute('data-kd-backgroup');

      /** Urutan layer: maju / mundur satu lapis, atau paling depan / belakang (di dalam grupnya). */
      function tfOrder(dir) {
        const item = currentItem();
        const sel = tfSelection();
        if (!item || !sel.length) return;
        const labels = { up: 'Maju satu lapis', down: 'Mundur satu lapis', top: 'Paling depan', bottom: 'Paling belakang' };
        let nodes = [];
        History.label(labels[dir]);
        Cleanup.edit(item, () => {
          const els = Cleanup.shapesOf(item.node);
          nodes = sel.map((s) => els[s.index]).filter(Boolean);
          // Bentuk yang sendirian di grupnya (1 layer = 1 bentuk): grupnya yang dipindah
          const layerOf = (n) => {
            let t = n;
            while (t.parentNode && t.parentNode !== item.node && [...t.parentNode.children].filter(isShapeEl).length === 1) t = t.parentNode;
            return t;
          };
          const movers = [...new Set(nodes.map(layerOf))];
          const list = dir === 'up' || dir === 'top' ? [...movers].reverse() : movers;
          list.forEach((n) => {
            const parent = n.parentNode;
            if (dir === 'up') {
              let next = n.nextElementSibling;
              while (next && (!isShapeEl(next) || movers.includes(next))) next = next.nextElementSibling;
              if (next) parent.insertBefore(n, next.nextSibling);
            } else if (dir === 'down') {
              let prev = n.previousElementSibling;
              while (prev && (!isShapeEl(prev) || movers.includes(prev))) prev = prev.previousElementSibling;
              if (prev) parent.insertBefore(n, prev);
            } else if (dir === 'top') {
              parent.appendChild(n);
            } else {
              let first = parent.firstElementChild;
              while (first && !isShapeEl(first)) first = first.nextElementSibling;
              if (first && first !== n) parent.insertBefore(n, first);
            }
          });
        });
        Cleanup.commit([item]);
        refresh();
        tfReselect(nodes);
      }

      /** Duplikat bentuk / potongan terpilih tepat di tempatnya; salinan langsung terpilih. */
      function tfDuplicate(silent) {
        const item = currentItem();
        const sel = tfSelection();
        if (!item || !sel.length) return;
        const copies = [];
        History.label('Duplikat bentuk');
        Cleanup.edit(item, () => {
          const els = Cleanup.shapesOf(item.node);
          sel.forEach(({ index, subs }) => {
            const node = els[index];
            if (!node) return;
            const copy = cloneShape(node, !subs);
            let out = copy;
            if (subs) {
              out = sbAsPath(copy);
              const all = parsePath(node.localName === 'path' ? node.getAttribute('d') : Outline.geometry(node));
              out.setAttribute('d', pathOf(all.filter((_, si) => subs.has(si))));
            }
            node.parentNode.insertBefore(out, node.nextSibling);
            copies.push(out);
          });
        });
        Cleanup.commit([item]);
        refresh();
        tfReselect(copies);
        if (!silent) View.toast(`${copies.length} bentuk diduplikat di tempat. Seret untuk memindahkan salinannya.`);
      }

      function toggleTf() {
        opts.tf = !opts.tf;
        if (opts.tf) {
          if (opts.edit) { opts.edit = false; ed.index = null; ed.subs = null; ed.sel.clear(); drawEdit(); paintEditbar(); }
          if (opts.sb) { opts.sb = false; sb.regions = []; sb.scope = null; sbRender(); paintSbbar(); }
          opts.pick = false; opts.stk = false; opts.pcolor = false;
        }
        if (!selecting()) picked.clear();
        if (hits) hits.style.display = selecting() || opts.edit ? '' : 'none';
        paintChrome();
        drawMarks();
      }

      /** Panel Transform: angka X / Y / W / H / sudut, kunci rasio, flip, urutan layer, duplikat. */
      function paintTf() {
        if (!el) return;
        const bar = $('#kd-ins-tfbar', el);
        bar.classList.toggle('hidden', !opts.tf);
        drawTf();
        if (!opts.tf || tf.drag) return;
        const box = picked.size ? tfBounds(tfGeometry()) : null;
        // Render ulang hanya bila isinya berubah (geser / zoom kanvas tidak mengganggu yang sedang diketik)
        const sig = [v && v.id, [...picked].sort().join(','), box ? [box.x, box.y, box.w, box.h].map((n) => round(n, 2)).join(',') : '', tf.lock].join('|');
        if (sig === tf.sig && bar.firstElementChild) return;
        if (bar.contains(document.activeElement) && document.activeElement.matches('input') && sig.split('|')[1] === String(tf.sig || '').split('|')[1]) return;
        tf.sig = sig;
        const f = 'w-full h-8 rounded-md border border-kd-line px-2 text-xs font-semibold text-kd-ink bg-white outline-none focus:border-kd-brand disabled:opacity-40';
        const num = (k, label, val) => `<label class="flex items-center gap-1 text-[11px] text-kd-muted"><span class="w-4 shrink-0 font-bold">${label}</span><input type="number" step="0.5" data-tf="${k}" value="${box ? round(val, 2) : ''}" ${box ? '' : 'disabled'} class="${f}"></label>`;
        const b = (act, ic, label, title) => `<button type="button" data-ins="${act}" class="${btn} ${off} disabled:opacity-40" title="${title}" ${box ? '' : 'disabled'}>${ic ? icon(ic, 'w-4 h-4') : ''}${label}</button>`;
        bar.innerHTML = `
          <p class="text-[11px] text-kd-ink mb-2">${box
            ? `${tfSelection().length} bentuk dipilih. Seret untuk pindah · handle untuk ubah ukuran (Shift = kunci rasio, Alt / Option = dari tengah) · di luar sudut / bulatan atas untuk putar (Shift = 15°).`
            : 'Ketuk bentuk untuk memilih (Pilih banyak / Shift untuk beberapa), lalu seret untuk memindah.'}</p>
          <div class="grid grid-cols-2 gap-1.5">
            ${num('x', 'X', box && box.x)}${num('y', 'Y', box && box.y)}
            ${num('w', 'W', box && box.w)}${num('h', 'H', box && box.h)}
            ${num('r', '°', 0)}
            <button type="button" data-ins="tflock" aria-pressed="${tf.lock}" class="${btn} ${tf.lock ? on : off}" title="Kunci rasio saat mengubah ukuran">${tf.lock ? '🔒' : '🔓'} Kunci rasio</button>
          </div>
          <div class="flex flex-wrap gap-1.5 mt-2">
            ${b('tfflipx', null, '⇋ Flip H', 'Balik horizontal (Shift+H)')}${b('tfflipy', null, '⇵ Flip V', 'Balik vertikal (Shift+V)')}
            ${b('tfdup', 'squares', 'Duplikat', 'Duplikat di tempat (Ctrl/Cmd+D) · Alt / Option + seret')}
          </div>
          <p class="text-[11px] font-bold text-kd-muted mt-3 mb-1">Ratakan ${tfSelection().length > 1 ? 'antarbentuk' : 'ke batas ikon'}</p>
          <div class="flex flex-wrap gap-1">
            ${[['left', 'Kiri (Alt+A)', 'M4 3v18M8 8h12M8 16h7'], ['hcenter', 'Tengah horizontal (Alt+H)', 'M12 3v18M5 8h14M8 16h8'], ['right', 'Kanan (Alt+D)', 'M20 3v18M4 8h12M9 16h7'],
               ['top', 'Atas (Alt+W)', 'M3 4h18M8 8v12M16 8v7'], ['vcenter', 'Tengah vertikal (Alt+V)', 'M3 12h18M8 5v14M16 8v8'], ['bottom', 'Bawah (Alt+S)', 'M3 20h18M8 4v12M16 9v7']]
              .map(([w, t, d]) => `<button type="button" data-ins="tfalign" data-where="${w}" class="${btn} ${off} disabled:opacity-40" title="Ratakan ${t}" aria-label="Ratakan ${t}" ${box ? '' : 'disabled'}><svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="${d}"/></svg></button>`).join('')}
          </div>
          <div class="flex flex-wrap gap-1.5 mt-1.5">
            ${b('tfdisth', null, '⇿ Jarak horizontal', 'Samakan jarak horizontal (Ctrl+Alt+H) — min. 3 bentuk')}${b('tfdistv', null, '↕ Jarak vertikal', 'Samakan jarak vertikal (Ctrl+Alt+V) — min. 3 bentuk')}
            ${b('tftidy', null, '▦ Tidy up', 'Susun rapi dengan jarak seragam (Ctrl+Alt+T)')}
          </div>
          <label class="flex items-center gap-2 mt-2 text-[11px] text-kd-ink cursor-pointer">
            <input type="checkbox" data-tfguides ${tf.guides ? 'checked' : ''} class="accent-[#2563EB]">Smart guide saat memindah (tahan Ctrl / Cmd untuk lepas)
          </label>
          <p class="text-[11px] font-bold text-kd-muted mt-3 mb-1">Urutan layer</p>
          <div class="flex flex-wrap gap-1.5">
            ${b('tftop', null, '⤒ Paling depan', 'Ctrl/Cmd+Shift+]')}${b('tfup', null, '↑ Maju', 'Ctrl/Cmd+]')}
            ${b('tfdown', null, '↓ Mundur', 'Ctrl/Cmd+[')}${b('tfbottom', null, '⤓ Paling belakang', 'Ctrl/Cmd+Shift+[')}
          </div>`;
      }

      /* ---------- offset vector (seperti Figma): garis bentuk dilebarkan keluar / disusutkan ke dalam ---------- */

      const offv = { open: false, value: 2, join: 'miter', keep: true, sig: null, layer: null, timer: 0 };
      const OFF_JOINS = [['miter', 'Runcing'], ['round', 'Bulat'], ['bevel', 'Potong']];

      /** Bentuk sasaran: Transform = bentuk terpilih; Edit titik = bentuk yang sedang diedit. */
      function offTargets() {
        if (opts.tf && picked.size) return tfGeometry();
        if (opts.edit && ed.subs && ed.index !== null) return tfGeometry([{ index: ed.index, subs: null }]);
        return [];
      }

      /** Offset satu bentuk (jarak dalam satuan ikon) → subpath di koordinat lokal bentuk, atau null bila habis. */
      function offsetSubs(g, dist, join) {
        const P = window.paper, PO = window.paperjsOffset;
        const subs = g.subs ? g.all.filter((_, si) => g.subs.has(si)) : g.all;
        if (!P || !PO || !subs.length) return null;
        const src = P.PathItem.create(pathOf(subs));
        if (src.remove) src.remove();
        src.transform(new P.Matrix(g.m.a, g.m.b, g.m.c, g.m.d, g.m.e, g.m.f));
        // Arah subpath diseragamkan dulu agar lubang ikut melebar / menyempit dengan benar
        if (subs.every((sp) => sp.closed) && src.reorient) src.reorient(getComputedStyle(g.clone).fillRule !== 'evenodd', true);
        let out = null;
        try { out = PO.offset(src, dist, { join, limit: 10, insert: false }); } catch (err) { out = null; }
        if (!out || !out.pathData) return null;
        const inv = g.m.inverse();
        out.transform(new P.Matrix(inv.a, inv.b, inv.c, inv.d, inv.e, inv.f));
        const res = parsePath(out.pathData).filter((sp) => sp.nodes.length > 1);
        if (out.remove) out.remove();
        return res.length ? res : null;
      }

      /** Pratinjau hasil offset di kanvas (magenta putus-putus), ditunda sedikit agar ringan saat slider digeser. */
      function offPreview() {
        clearTimeout(offv.timer);
        offv.timer = setTimeout(() => {
          if (!offv.layer || !v || !v.art) return;
          const geo = offv.open && Number(offv.value) ? offTargets() : [];
          const inner = v.art.firstElementChild;
          if (!geo.length || !window.paper || !inner.getScreenCTM()) return offv.layer.replaceChildren();
          const V = dm(svg.getScreenCTM().inverse().multiply(inner.getScreenCTM()));
          offv.layer.innerHTML = geo.map((g) => {
            const res = offsetSubs(g, Number(offv.value), offv.join);
            if (!res) return '';
            const M = V.multiply(g.m);
            return `<path d="${pathOf(res)}" transform="matrix(${M.a} ${M.b} ${M.c} ${M.d} ${M.e} ${M.f})" fill="#E11D84" fill-opacity="0.08" stroke="#E11D84" stroke-width="1.5" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/>`;
          }).join('');
        }, 50);
      }

      /** Buka / tutup bagian Offset vector (pustaka Paper.js dimuat saat pertama dibuka). */
      function offToggle() {
        offv.open = !offv.open;
        paintOffbar();
        if (offv.open) Outline.ready().then(offPreview).catch(() => View.toast('Gagal memuat pustaka offset. Periksa koneksi internet lalu coba lagi.', 'error'));
      }

      function offSet(value) {
        const n = parseFloat(value);
        offv.value = Number.isFinite(n) ? n : 0;
        offPreview();
      }

      /** Salinan bentuk tanpa atribut khusus lapisan / posisi garis (gaya garis "belakang" dibawa ke salinannya). */
      function cloneShape(node, deep) {
        const copy = node.cloneNode(deep);
        const back = StrokeEdit.backOf(node);
        ['id', 'data-kd-back', 'data-kd-layer', 'data-kd-clip', 'data-kd-clip-prev', 'data-kd-pos'].forEach((a) => copy.removeAttribute(a));
        if (back) ['stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray'].forEach((p) => {
          const val = back.style.getPropertyValue(p);
          if (val) copy.style.setProperty(p, val);
        });
        if (copy.hasAttribute('clip-path') && node.getAttribute('data-kd-clip')) copy.removeAttribute('clip-path');
        return copy;
      }

      /** Terapkan offset (satu langkah urungkan). Simpan bentuk asli = hasil jadi bentuk baru. */
      async function offApply() {
        const item = currentItem();
        const dist = Number(offv.value);
        if (!item || !offTargets().length) return;
        if (!dist) return View.toast('Isi jarak offset selain 0 (positif = keluar, negatif = ke dalam).', 'error');
        if (Designer.busy() || Outline.busy()) return View.toast('Tunggu proses yang sedang berjalan selesai.', 'error');
        try { await Outline.ready(); } catch (err) { return View.toast('Gagal memuat pustaka offset. Periksa koneksi internet lalu coba lagi.', 'error'); }
        const results = offTargets().map((g) => ({ g, subs: offsetSubs(g, dist, offv.join) })).filter((r) => r.subs);
        if (!results.length) return View.toast('Offset ke dalam terlalu besar — bentuknya habis. Kecilkan nilainya.', 'error');
        const made = [];
        History.label(`Offset vector ${dist > 0 ? '+' : ''}${round(dist, 2)}`);
        Cleanup.edit(item, () => {
          const els = Cleanup.shapesOf(item.node);
          results.forEach(({ g, subs }) => {
            const node = els[g.index];
            if (!node) return;
            if (offv.keep) {
              const out = sbAsPath(cloneShape(node, true));
              out.setAttribute('d', pathOf(subs));
              // Melebar → di belakang aslinya (seperti outline stiker); menyusut → di depan agar terlihat
              node.parentNode.insertBefore(out, dist > 0 ? node : node.nextSibling);
              made.push(out);
            } else {
              const back = StrokeEdit.backOf(node);
              const out = sbAsPath(node);
              if (back) sbAsPath(back);
              const rest = g.subs ? g.all.filter((_, si) => !g.subs.has(si)) : [];
              out.setAttribute('d', pathOf(rest.concat(subs)));
              made.push(out);
            }
          });
        });
        Cleanup.commit([item]);
        refresh();
        if (opts.tf) tfReselect(made);
        else if (opts.edit) {
          const idx = Cleanup.shapesOf(item.node).indexOf(made[0]);
          if (idx >= 0) editLoad(idx);
          paintEditbar();
        }
        offv.sig = null;
        paintOffbar();
        View.toast(`Offset ${dist > 0 ? '+' : ''}${round(dist, 2)} diterapkan ke ${made.length} bentuk${offv.keep ? ' (bentuk asli disimpan)' : ''}.`);
      }

      /** Bagian Offset vector di panel samping (tampil di mode Transform dengan pilihan, atau Edit titik dengan bentuk aktif). */
      function paintOffbar() {
        if (!el) return;
        const bar = $('#kd-ins-offbar', el);
        const geo = (opts.tf && picked.size) || (opts.edit && ed.subs);
        bar.classList.toggle('hidden', !geo);
        if (!geo) {
          offv.sig = null;
          clearTimeout(offv.timer);
          if (offv.layer) offv.layer.replaceChildren();
          return;
        }
        const item = currentItem();
        const target = opts.tf ? `t${[...picked].sort().join(',')}` : `e${ed.index}`;
        const sig = [offv.open, offv.join, offv.keep, target, item && item.text].join('|');
        if (sig === offv.sig && bar.firstElementChild) return;
        offv.sig = sig;
        const count = opts.tf ? tfSelection().length : 1;
        const vb = item ? item.viewBox : { w: 24, h: 24 };
        const maxV = Math.max(5, Math.ceil(Math.max(vb.w, vb.h) / 8));
        const val = Math.max(-maxV, Math.min(maxV, offv.value));
        const field = 'h-8 rounded-md border border-kd-line px-2 text-xs font-semibold text-kd-ink bg-white outline-none focus:border-kd-brand focus:ring-2 focus:ring-kd-brand/20';
        const head = (t) => `<p class="text-[11px] font-bold text-kd-muted mb-1">${t}</p>`;
        bar.innerHTML = `
          <button type="button" data-ins="offtoggle" aria-expanded="${offv.open}" class="w-full flex items-center gap-2 text-left">
            <svg viewBox="0 0 24 24" class="w-4 h-4 shrink-0 text-kd-brand" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M8 8h8v8H8z"/><path d="M4 4h16v16H4z" stroke-dasharray="3 2.5"/></svg>
            <span class="flex-1 text-[11px] font-bold text-kd-ink">Offset vector</span>
            <span class="text-[10px] text-kd-muted">${opts.tf ? `${count} bentuk` : 'bentuk aktif'}</span>
            ${icon('chevronDown', `w-4 h-4 text-kd-muted transition-transform ${offv.open ? 'rotate-180' : ''}`)}
          </button>
          ${offv.open ? `<div class="space-y-3 mt-2.5 text-xs">
            <p class="text-[11px] text-kd-muted">Positif = melebar keluar, negatif = menyusut ke dalam (satuan ikon). Pratinjau: garis magenta putus-putus.</p>
            <div>
              ${head('Jarak')}
              <div class="flex items-center gap-2">
                <input type="range" data-off="range" min="${-maxV}" max="${maxV}" step="0.5" value="${val}" aria-label="Jarak offset" class="min-w-0 flex-1 accent-[#2563EB]">
                <input type="number" data-off="value" step="0.5" value="${round(offv.value, 2)}" aria-label="Jarak offset (angka)" class="${field} w-16 shrink-0">
              </div>
            </div>
            <div>
              ${head('Sudut')}
              <div class="flex w-full rounded-lg border border-kd-line bg-white p-0.5" role="group" aria-label="Sudut offset">
                ${OFF_JOINS.map(([j, label]) => `<button type="button" data-ins="offjoin" data-value="${j}" aria-pressed="${offv.join === j}" class="inline-flex flex-1 min-w-0 items-center justify-center gap-1 h-7 px-2 rounded-md text-[11px] font-bold ${offv.join === j ? 'bg-kd-brand-light text-kd-brand-dark' : 'text-kd-ink hover:text-kd-brand'}"><svg viewBox="0 0 20 24" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="${j}"><path d="M4 18L12 6l8 12"/></svg><span class="truncate">${label}</span></button>`).join('')}
              </div>
            </div>
            <label class="flex items-start gap-2 text-[11px] text-kd-ink cursor-pointer">
              <input type="checkbox" data-off="keep" ${offv.keep ? 'checked' : ''} class="mt-0.5 accent-[#2563EB]">
              <span>Simpan bentuk asli — hasil offset jadi bentuk baru (melebar: di belakang, menyusut: di depan)</span>
            </label>
            <button type="button" data-ins="offapply" class="w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-kd-brand text-white text-xs font-bold hover:opacity-90">${icon('check', 'w-4 h-4')}Terapkan offset</button>
          </div>` : ''}`;
        offPreview();
      }

      /* ---------- alignment, distribute, tidy up, smart guide ---------- */

      /** Simpan geser berbeda per bentuk: [{ g, dx, dy }] (satu langkah urungkan). */
      function tfCommitEach(moves, label) {
        const item = currentItem();
        const list = moves.filter((mv) => Math.abs(mv.dx) > 1e-6 || Math.abs(mv.dy) > 1e-6);
        if (!item) return;
        if (!list.length) return View.toast('Sudah rata — tidak ada yang berubah.');
        if (Designer.busy() || Outline.busy()) return View.toast('Tunggu proses yang sedang berjalan selesai.', 'error');
        History.label(label);
        Cleanup.edit(item, () => {
          const els = Cleanup.shapesOf(item.node);
          list.forEach(({ g, dx, dy }) => {
            const node = els[g.index];
            if (!node) return;
            const back = StrokeEdit.backOf(node);
            const el = sbAsPath(node);
            if (back) sbAsPath(back);
            el.setAttribute('d', pathOf(tfTransformed(g, new DOMMatrix().translate(dx, dy))));
          });
        });
        Cleanup.commit([item]);
        refresh();
      }

      /** Bentuk terpilih + kotak batas masing-masing (koordinat ikon). */
      const tfBoxes = () => tfGeometry().map((g) => ({ g, b: tfBounds([g]) })).filter((x) => x.b);

      /** Ratakan: kiri / tengah / kanan / atas / tengah / bawah. 1 bentuk → acuan batas ikon. */
      function tfAlign(where) {
        const items = tfBoxes();
        if (!items.length) return;
        const item = currentItem();
        const R = items.length > 1 ? tfBounds(items.map((x) => x.g)) : item.viewBox;
        const moves = items.map(({ g, b }) => {
          let dx = 0, dy = 0;
          if (where === 'left') dx = R.x - b.x;
          else if (where === 'hcenter') dx = R.x + R.w / 2 - (b.x + b.w / 2);
          else if (where === 'right') dx = R.x + R.w - (b.x + b.w);
          else if (where === 'top') dy = R.y - b.y;
          else if (where === 'vcenter') dy = R.y + R.h / 2 - (b.y + b.h / 2);
          else if (where === 'bottom') dy = R.y + R.h - (b.y + b.h);
          return { g, dx, dy };
        });
        const names = { left: 'kiri', hcenter: 'tengah horizontal', right: 'kanan', top: 'atas', vcenter: 'tengah vertikal', bottom: 'bawah' };
        tfCommitEach(moves, `Ratakan ${names[where]}`);
      }

      /** Jarak antarbentuk dibuat sama (bentuk paling luar tetap di tempat). Minimal 3 bentuk. */
      function tfDistribute(horizontal) {
        const items = tfBoxes();
        if (items.length < 3) return View.toast('Pilih minimal 3 bentuk untuk meratakan jaraknya.', 'error');
        const pos = horizontal ? 'x' : 'y', size = horizontal ? 'w' : 'h';
        items.sort((a, b) => a.b[pos] + a.b[size] / 2 - (b.b[pos] + b.b[size] / 2));
        const first = items[0].b, last = items[items.length - 1].b;
        const total = last[pos] + last[size] - first[pos];
        const gap = (total - items.reduce((s, x) => s + x.b[size], 0)) / (items.length - 1);
        let cursor = first[pos];
        const moves = items.map(({ g, b }) => {
          const d = cursor - b[pos];
          cursor += b[size] + gap;
          return { g, dx: horizontal ? d : 0, dy: horizontal ? 0 : d };
        });
        tfCommitEach(moves, horizontal ? 'Ratakan jarak horizontal' : 'Ratakan jarak vertikal');
      }

      /** Tidy up: susun jadi baris rapi dengan jarak seragam (baris dikenali dari posisi tengah). */
      function tfTidy() {
        const items = tfBoxes();
        if (items.length < 2) return View.toast('Pilih minimal 2 bentuk untuk dirapikan.', 'error');
        const avgH = items.reduce((s, x) => s + x.b.h, 0) / items.length;
        const rows = [];
        [...items].sort((a, b) => a.b.y + a.b.h / 2 - (b.b.y + b.b.h / 2)).forEach((x) => {
          const cy = x.b.y + x.b.h / 2;
          const row = rows[rows.length - 1];
          if (row && cy - row.cy < avgH / 2) row.items.push(x);
          else rows.push({ cy, items: [x] });
        });
        rows.forEach((r) => r.items.sort((a, b) => a.b.x - b.b.x));
        const gapsX = [], gapsY = [];
        rows.forEach((r) => r.items.forEach((x, i) => { if (i) gapsX.push(x.b.x - (r.items[i - 1].b.x + r.items[i - 1].b.w)); }));
        rows.forEach((r, i) => {
          if (!i) return;
          const prevBottom = Math.max(...rows[i - 1].items.map((x) => x.b.y + x.b.h));
          gapsY.push(Math.min(...r.items.map((x) => x.b.y)) - prevBottom);
        });
        const avg = (list) => (list.length ? Math.max(0, list.reduce((s, n) => s + n, 0) / list.length) : 0);
        const gx = avg(gapsX), gy = avg(gapsY);
        const left = Math.min(...items.map((x) => x.b.x));
        let top = Math.min(...items.map((x) => x.b.y));
        const moves = [];
        rows.forEach((r) => {
          let cursor = left;
          const rowH = Math.max(...r.items.map((x) => x.b.h));
          r.items.forEach(({ g, b }) => {
            moves.push({ g, dx: cursor - b.x, dy: top - b.y });
            cursor += b.w + gx;
          });
          top += rowH + gy;
        });
        tfCommitEach(moves, 'Tidy up');
      }

      /** Kandidat smart guide (koordinat ikon): tepi & tengah bentuk lain + batas ikon. */
      function tfGuideTargets(skip) {
        const item = currentItem();
        const inner = v.art.firstElementChild;
        const toRoot = inner.getCTM().inverse();
        const xs = [], ys = [];
        const add = (b) => {
          xs.push(b.x, b.x + b.w / 2, b.x + b.w);
          ys.push(b.y, b.y + b.h / 2, b.y + b.h);
        };
        add(item.viewBox);
        Cleanup.shapesOf(inner).forEach((node, i) => {
          if (skip.has(i) || !node.getCTM()) return;
          let bb;
          try { bb = node.getBBox(); } catch (e) { return; }
          const m = toRoot.multiply(node.getCTM());
          const pts = [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]]
            .map(([x, y]) => new DOMPoint(x, y).matrixTransform(m));
          const x0 = Math.min(...pts.map((p) => p.x)), y0 = Math.min(...pts.map((p) => p.y));
          add({ x: x0, y: y0, w: Math.max(...pts.map((p) => p.x)) - x0, h: Math.max(...pts.map((p) => p.y)) - y0 });
        });
        return { xs, ys };
      }

      /** Geser (dx, dy) dikoreksi agar tepi / tengah kotak menempel ke kandidat terdekat (≤ 6 px layar). */
      function tfSnapMove(dr, dx, dy) {
        dr.guides = null;
        if (!tf.guides || !dr.targets) return [dx, dy];
        const S = v.art.firstElementChild.getScreenCTM();
        const th = 6 / (Math.hypot(S.a, S.b) || 1);
        const b = dr.box;
        const pick = (vals, cands) => {
          let best = null;
          vals.forEach((val) => cands.forEach((c) => {
            const d = c - val;
            if (Math.abs(d) <= th && (!best || Math.abs(d) < Math.abs(best.d))) best = { d, at: c };
          }));
          return best;
        };
        const sx = pick([b.x + dx, b.x + b.w / 2 + dx, b.x + b.w + dx], dr.targets.xs);
        const sy = pick([b.y + dy, b.y + b.h / 2 + dy, b.y + b.h + dy], dr.targets.ys);
        if (sx) dx += sx.d;
        if (sy) dy += sy.d;
        if (sx || sy) dr.guides = { x: sx ? sx.at : null, y: sy ? sy.at : null };
        return [dx, dy];
      }

      /** Panel samping / lembar bawah hanya tampil bila ada pengaturan mode yang aktif. */
      function paintPanel() {
        if (!el) return;
        paintOffbar();
        const ids = ['#kd-ins-tfbar', '#kd-ins-selbar', '#kd-ins-pickbar', '#kd-ins-editbar', '#kd-ins-offbar', '#kd-ins-sbbar', '#kd-ins-stkbar'];
        const any = ids.some((id) => !$(id, el).classList.contains('hidden'));
        $('#kd-ins-panel', el).classList.toggle('hidden', !any);
      }

      const setOnEl = (b, active) => {
        if (!b) return;
        b.className = `${btn} ${active ? on : off} disabled:opacity-40`;
        b.setAttribute('aria-pressed', String(active));
      };

      /* ---------- tombol ---------- */

      function toggle(key) {
        opts[key] = !opts[key];
        paintChrome();
        drawAnchors();
        drawMarks();
      }

      function paintChrome() {
        if (!el) return;
        const setOn = (b, active) => {
          b.className = `${btn} ${active ? on : off}`;
          b.setAttribute('aria-pressed', String(active));
        };
        setOn($('[data-ins="outline"]', el), opts.outline);
        setOn($('[data-ins="anchors"]', el), opts.anchors);
        setOn($('[data-ins="pick"]', el), opts.pick);
        setOn($('[data-ins="stk"]', el), opts.stk);
        setOn($('[data-ins="edit"]', el), opts.edit);
        setOn($('[data-ins="sb"]', el), opts.sb);
        setOn($('[data-ins="tf"]', el), opts.tf);
        History.render();
        view.classList.toggle('kd-ins-picking', selecting() || opts.edit || opts.sb);
        const card = el.firstElementChild;
        card.classList.toggle('kd-outline', opts.outline);
        card.style.setProperty('--kd-outline', outlineInk(opts.bg));
        view.classList.toggle('kd-checker', opts.bg === 'checker');
        view.style.background = opts.bg === 'checker' ? '' : opts.bg;
        $('#kd-ins-bg', el).innerHTML = LATAR.map((b) => `
          <button type="button" data-ins="bg" data-bg="${b.value}" title="Latar ${b.label}" aria-label="Latar ${b.label}" aria-pressed="${opts.bg === b.value}"
            class="w-7 h-7 rounded-full border-2 grid place-items-center ${opts.bg === b.value ? 'border-kd-brand' : 'border-transparent hover:border-kd-line'}">
            <span class="w-5 h-5 rounded-full border border-kd-line ${b.value === 'checker' ? 'kd-checker' : ''}" ${b.value === 'checker' ? '' : `style="background:${b.value}"`}></span>
          </button>`).join('');
        const many = list().length > 1;
        el.querySelectorAll('[data-ins="prev"], [data-ins="next"]').forEach((b) => { b.disabled = !many; b.classList.toggle('opacity-40', !many); });
      }

      return { open, close, isOpen, refresh };
    })();

    /* =====================================================================
     * 8h. PISAHKAN LAYER — 1 file SVG berisi beberapa ikon (mis. ekspor
     *     Infinite Design: 1 layer = 1 ikon) dipecah jadi beberapa ikon.
     *     Urutan cara: grup layer (<g>) → bila dilebur, bentuk dikelompokkan
     *     menurut jaraknya. Isi bentuk & warna tidak diubah, hanya dipotong.
     * ===================================================================== */
    const Split = (() => {
      const NON_GRAPHIC = new Set(['defs', 'style', 'title', 'desc', 'metadata', 'script', 'clipPath', 'mask',
        'symbol', 'pattern', 'marker', 'linearGradient', 'radialGradient', 'filter', 'font', 'font-face']);
      const WRAPPERS = new Set(['g', 'a', 'switch']);
      const SMALL = 0.3; // kelompok < 30% ukuran ikon terbesar dianggap bagian ikon lain
      const SHAPES = 'path, rect, circle, ellipse, line, polyline, polygon, text, use, image';
      const COLORS = ['#E11D48', '#2563EB', '#16A34A', '#D97706', '#7C3AED', '#0891B2', '#DB2777', '#4D7C0F', '#9333EA', '#EA580C', '#0D9488', '#4F46E5'];
      let el = null;
      let cur = null; // { item, info, gap, groups, manual, edit, undo, redo, lasso }
      const HIST_MAX = 50;

      const isOpen = () => !!(el && !el.classList.contains('hidden'));
      const graphic = (node) => node.nodeType === 1 && node.namespaceURI === SVG_NS && !NON_GRAPHIC.has(node.localName);

      /** Baca file: cari unit (layer / bentuk) dan ukur kotak batas tiap unit. Hasil disimpan di item. */
      function analyze(item) {
        if (item.split !== undefined) return item.split;
        item.split = null;
        let doc;
        try {
          doc = new DOMParser().parseFromString(String(item.text || ''), 'image/svg+xml');
        } catch (err) {
          return null;
        }
        const root = doc.documentElement;
        if (!root || root.localName !== 'svg' || doc.getElementsByTagName('parsererror').length) return null;
        root.querySelectorAll('script, foreignObject').forEach((n) => n.remove());
        [root, ...root.querySelectorAll('*')].forEach((n) => [...n.attributes].forEach((a) => {
          if (/^on/i.test(a.localName) || (a.localName === 'href' && /^\s*javascript:/i.test(a.value))) n.removeAttributeNode(a);
        }));

        // Turun melewati pembungkus tunggal (<g> berisi semua layer)
        let box = root;
        for (;;) {
          const kids = [...box.children].filter(graphic);
          if (kids.length === 1 && WRAPPERS.has(kids[0].localName)) box = kids[0];
          else break;
        }
        const units = [...box.children].filter(graphic);
        if (units.length < 2 || units.length > 3000) return null;
        units.forEach((u, i) => u.setAttribute('data-kd-unit', String(i)));

        const vb = (() => {
          const v = (root.getAttribute('viewBox') || '').trim().split(/[\s,]+/).map(Number);
          if (v.length === 4 && v.every(Number.isFinite) && v[2] > 0 && v[3] > 0) return { x: v[0], y: v[1], w: v[2], h: v[3] };
          const w = parseFloat(root.getAttribute('width'));
          const h = parseFloat(root.getAttribute('height'));
          return { x: 0, y: 0, w: w > 0 ? w : 100, h: h > 0 ? h : 100 };
        })();

        // Ukur di DOM tersembunyi (koordinat = ruang viewBox file asli)
        const host = document.createElement('div');
        host.style.cssText = 'position:absolute;left:-99999px;top:0;visibility:hidden;pointer-events:none';
        const live = document.importNode(root, true);
        live.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
        live.setAttribute('width', String(vb.w));
        live.setAttribute('height', String(vb.h));
        host.appendChild(live);
        document.body.appendChild(host);
        const boxes = [];
        try {
          const inv = live.getScreenCTM().inverse();
          live.querySelectorAll('[data-kd-unit]').forEach((u) => {
            const i = Number(u.getAttribute('data-kd-unit'));
            let b;
            try { b = u.getBBox(); } catch (err) { return; }
            if (!b || (b.width <= 0 && b.height <= 0)) return;
            const m = inv.multiply(u.getScreenCTM());
            const pts = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]]
              .map(([x, y]) => new DOMPoint(x, y).matrixTransform(m));
            // Tebal garis (stroke) tidak termasuk getBBox — tambahkan setengahnya
            let pad = 0;
            [u, ...u.querySelectorAll(SHAPES)].forEach((s) => {
              if (!s.matches || !s.matches(SHAPES)) return;
              const cs = getComputedStyle(s);
              if (!cs.stroke || cs.stroke === 'none') return;
              const sm = inv.multiply(s.getScreenCTM());
              pad = Math.max(pad, (parseFloat(cs.strokeWidth) || 0) * Math.max(Math.hypot(sm.a, sm.b), Math.hypot(sm.c, sm.d)) / 2);
            });
            const xs = pts.map((p) => p.x);
            const ys = pts.map((p) => p.y);
            boxes.push({ i, x1: Math.min(...xs) - pad, y1: Math.min(...ys) - pad, x2: Math.max(...xs) + pad, y2: Math.max(...ys) + pad });
          });
        } catch (err) {
          return null;
        } finally {
          host.remove();
        }
        if (boxes.length < 2) return null;

        const all = boxes.reduce((a, b) => ({ x1: Math.min(a.x1, b.x1), y1: Math.min(a.y1, b.y1), x2: Math.max(a.x2, b.x2), y2: Math.max(a.y2, b.y2) }));
        const size = Math.max(all.x2 - all.x1, all.y2 - all.y1) || 1;
        const layers = units.every((u) => WRAPPERS.has(u.localName));
        const info = { doc, vb, all, boxes, size, layers, units: units.length };
        // Layer terpisah: cukup gabungkan yang bertumpuk; bentuk lepas: gabung yang berjarak ≤ 5%
        info.defaultGap = layers ? 0 : 5;
        info.count = cluster(info, info.defaultGap).length;
        if (info.count < 2) return null;
        item.split = info;
        return info;
      }

      /** Kelompokkan unit: bertumpuk / berjarak ≤ gap% dari ukuran gambar → 1 ikon. Urut baris lalu kolom. */
      function cluster(info, gapPct) {
        const t = (info.size * gapPct) / 100;
        const b = info.boxes;
        const parent = b.map((_, i) => i);
        const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
        for (let i = 0; i < b.length; i++) {
          for (let j = i + 1; j < b.length; j++) {
            const dx = Math.max(0, b[j].x1 - b[i].x2, b[i].x1 - b[j].x2);
            const dy = Math.max(0, b[j].y1 - b[i].y2, b[i].y1 - b[j].y2);
            if (Math.max(dx, dy) <= t) parent[find(i)] = find(j);
          }
        }
        const map = new Map();
        b.forEach((box, i) => {
          const r = find(i);
          if (!map.has(r)) map.set(r, { units: [], x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity });
          const g = map.get(r);
          g.units.push(box.i);
          g.x1 = Math.min(g.x1, box.x1); g.y1 = Math.min(g.y1, box.y1);
          g.x2 = Math.max(g.x2, box.x2); g.y2 = Math.max(g.y2, box.y2);
        });
        let groups = [...map.values()];
        // Bagian kecil (titik, garis gerak, kilau) bukan ikon sendiri: tempel ke ikon terdekat
        const dim = (g) => Math.max(g.x2 - g.x1, g.y2 - g.y1);
        const biggest = Math.max(...groups.map(dim));
        const big = groups.filter((g) => dim(g) >= biggest * SMALL);
        groups.filter((g) => dim(g) < biggest * SMALL).forEach((g) => {
          const gap = (q) => Math.max(0, q.x1 - g.x2, g.x1 - q.x2) + Math.max(0, q.y1 - g.y2, g.y1 - q.y2);
          const near = big.reduce((a, q) => (gap(q) < gap(a) ? q : a));
          near.units.push(...g.units);
          near.x1 = Math.min(near.x1, g.x1); near.y1 = Math.min(near.y1, g.y1);
          near.x2 = Math.max(near.x2, g.x2); near.y2 = Math.max(near.y2, g.y2);
        });
        return order(big);
      }

      /** Urutan baca: baris (tengah vertikal berdekatan) lalu kiri → kanan. */
      function order(groups) {
        if (!groups.length) return groups;
        const hs = groups.map((g) => g.y2 - g.y1).sort((p, q) => p - q);
        const rowTol = (hs[Math.floor(hs.length / 2)] || 0) / 2;
        groups.sort((p, q) => ((p.y1 + p.y2) / 2 - (q.y1 + q.y2) / 2));
        let row = 0;
        let rowY = null;
        groups.forEach((g) => {
          const cy = (g.y1 + g.y2) / 2;
          if (rowY !== null && cy - rowY > rowTol) row++;
          if (rowY === null || cy - rowY > rowTol) rowY = cy;
          g.row = row;
        });
        return groups.sort((p, q) => p.row - q.row || p.x1 - q.x1);
      }

      /** Kelompok dari pembagian manual: [[unit, ...], ...] → kotak batas + urutan baca. */
      function groupsOf(info, parts) {
        const byUnit = new Map(info.boxes.map((b) => [b.i, b]));
        return order(parts.map((units) => units.reduce((g, i) => {
          const b = byUnit.get(i);
          if (!b) return g;
          g.units.push(i);
          g.x1 = Math.min(g.x1, b.x1); g.y1 = Math.min(g.y1, b.y1);
          g.x2 = Math.max(g.x2, b.x2); g.y2 = Math.max(g.y2, b.y2);
          return g;
        }, { units: [], x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity })).filter((g) => g.units.length));
      }

      /* ---------- atur manual: lasso, pecah kelompok, urungkan / ulangi ---------- */

      const partsOf = (groups) => groups.map((g) => g.units.slice());
      const copyParts = (parts) => (parts ? parts.map((u) => u.slice()) : null);

      /** Simpan keadaan sebelum diubah (satu langkah urungkan) lalu ganti pembagiannya. */
      function setManual(parts, label) {
        cur.undo.push({ manual: copyParts(cur.manual), label });
        if (cur.undo.length > HIST_MAX) cur.undo.shift();
        cur.redo = [];
        cur.manual = parts;
        draw();
      }

      function step(back) {
        if (!cur) return;
        const from = back ? cur.undo : cur.redo, to = back ? cur.redo : cur.undo;
        const s = from.pop();
        if (!s) return View.toast(back ? 'Tidak ada yang bisa diurungkan.' : 'Tidak ada yang bisa diulangi.', 'error');
        to.push({ manual: copyParts(cur.manual), label: s.label });
        cur.manual = s.manual;
        draw();
        View.toast(`${back ? 'Diurungkan' : 'Diulangi'}: ${s.label}`);
      }

      /** Titik layar → koordinat file asli. */
      const svgPoint = (e) => new DOMPoint(e.clientX, e.clientY).matrixTransform($('#kd-split-view').getScreenCTM().inverse());

      function inPoly(x, y, poly) {
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
          const [xi, yi] = poly[i], [xj, yj] = poly[j];
          if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
        }
        return inside;
      }

      /** Unit (layer) yang titik tengahnya di dalam lasso. */
      const unitsIn = (poly) => cur.info.boxes.filter((b) => inPoly((b.x1 + b.x2) / 2, (b.y1 + b.y2) / 2, poly)).map((b) => b.i);

      /** Nomor kelompok di bawah pointer (lingkaran nomor di pojok kiri atas kotak). */
      function badgeAt(p) {
        const r = (cur.info.size / 28) * 0.75 * 1.4;
        const k = cur.groups.findIndex((g) => Math.hypot(p.x - g.x1, p.y - g.y1) <= r);
        return k >= 0 ? k : null;
      }

      function drawLasso() {
        const layer = $('#kd-split-lasso');
        if (!layer) return;
        const lz = cur && cur.lasso;
        if (!lz || lz.pts.length < 2) { layer.innerHTML = ''; return; }
        const sw = cur.info.size / 300;
        const picked = new Set(unitsIn(lz.pts));
        layer.innerHTML = cur.info.boxes.filter((b) => picked.has(b.i)).map((b) =>
          `<rect x="${b.x1}" y="${b.y1}" width="${b.x2 - b.x1}" height="${b.y2 - b.y1}" fill="#2563EB" fill-opacity="0.12" stroke="#2563EB" stroke-width="${sw}"/>`).join('')
          + `<path d="M${lz.pts.map((q) => `${q[0]} ${q[1]}`).join('L')}Z" fill="#2563EB" fill-opacity="0.06" stroke="#2563EB" stroke-width="${sw * 1.5}" stroke-dasharray="${sw * 5} ${sw * 3}"/>`;
      }

      function lassoDown(e) {
        if (!cur || !cur.edit || e.button > 0) return;
        e.preventDefault();
        const p = svgPoint(e);
        cur.lasso = { id: e.pointerId, pts: [[p.x, p.y]], from: { x: e.clientX, y: e.clientY }, moved: false };
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* abaikan */ }
      }

      function lassoMove(e) {
        const lz = cur && cur.lasso;
        if (!lz || e.pointerId !== lz.id) return;
        if (!lz.moved && Math.hypot(e.clientX - lz.from.x, e.clientY - lz.from.y) < 4) return;
        lz.moved = true;
        const p = svgPoint(e);
        lz.pts.push([p.x, p.y]);
        drawLasso();
      }

      function lassoUp(e) {
        const lz = cur && cur.lasso;
        if (!lz || e.pointerId !== lz.id) return;
        cur.lasso = null;
        drawLasso();
        const parts = partsOf(cur.groups);
        if (!lz.moved || lz.pts.length < 3) {
          // Ketuk nomor kelompok = pecah jadi per layer
          const k = badgeAt(svgPoint(e));
          if (k === null) return;
          const g = cur.groups[k];
          if (g.units.length < 2) return View.toast('Kelompok ini hanya 1 layer — tidak bisa dipecah lagi.', 'error');
          parts.splice(k, 1, ...g.units.map((i) => [i])); // parts mengikuti urutan cur.groups
          return setManual(parts, `Pecah ikon ${k + 1}`);
        }
        const chosen = unitsIn(lz.pts);
        if (!chosen.length) return View.toast('Tidak ada layer di dalam lasso. Lingkari bagian tengah ikonnya.', 'error');
        const set = new Set(chosen);
        const rest = parts.map((u) => u.filter((i) => !set.has(i))).filter((u) => u.length);
        setManual([...rest, chosen], `Lasso ${chosen.length} layer jadi 1 ikon`);
      }

      function toggleEdit() {
        if (!cur) return;
        cur.edit = !cur.edit;
        cur.lasso = null;
        draw();
      }

      function resetAuto() {
        if (!cur || !cur.manual) return;
        setManual(null, 'Kembali ke deteksi otomatis');
      }

      /** Teks SVG untuk satu kelompok: salinan file asli, unit lain dibuang, viewBox dipotong. */
      function pieceText(info, group) {
        const keep = new Set(group.units.map(String));
        const root = info.doc.documentElement.cloneNode(true);
        root.querySelectorAll('[data-kd-unit]').forEach((u) => {
          if (keep.has(u.getAttribute('data-kd-unit'))) u.removeAttribute('data-kd-unit');
          else u.remove();
        });
        const w = Math.max(group.x2 - group.x1, 0.001);
        const h = Math.max(group.y2 - group.y1, 0.001);
        root.setAttribute('viewBox', `${round(group.x1)} ${round(group.y1)} ${round(w)} ${round(h)}`);
        root.setAttribute('width', String(round(w)));
        root.setAttribute('height', String(round(h)));
        root.removeAttribute('x');
        root.removeAttribute('y');
        root.removeAttribute('style');
        return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(root);
      }

      const findItem = (id) => state.items.find((it) => String(it.id) === String(id));

      /** Catatan di kartu "Ikon dari Google Drive": file yang berisi beberapa ikon. */
      function renderNote() {
        const box = $('#kd-split-note');
        if (!box) return;
        const found = state.items.map((item, i) => ({ item, i, info: analyze(item) })).filter((x) => x.info);
        box.classList.toggle('hidden', !found.length);
        box.innerHTML = found.map(({ item, i, info }) => `
          <div class="flex flex-wrap items-center gap-2 rounded-xl border border-[#F5C26B] bg-[#FFF5E6] px-3 py-2 text-xs">
            ${icon('squares', 'w-4 h-4 shrink-0 text-[#AA5A00]')}
            <span class="min-w-0 flex-1 text-[#AA5A00]"><b>Ikon ${i + 1}</b> (${escapeHtml(item.name)}) berisi <b>${info.count} ikon</b> dalam 1 file${info.layers ? ` (${info.units} layer)` : ''}.</span>
            <button type="button" data-action="split-open" data-id="${item.id}" class="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-[#AA5A00] text-white text-[11px] font-bold hover:bg-[#8A4800]">Pisahkan layer</button>
          </div>`).join('');
      }

      function mount() {
        if (el) return;
        el = document.createElement('div');
        el.id = 'kd-split';
        el.className = 'fixed inset-0 z-[75] hidden flex items-center justify-center bg-slate-900/70 p-0 sm:p-4';
        el.innerHTML = `
          <div class="bg-white w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-4xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="kd-split-title">
            <div class="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-kd-line">
              <span class="w-8 h-8 shrink-0 rounded-lg bg-kd-brand-light text-kd-brand grid place-items-center">${icon('squares', 'w-4 h-4')}</span>
              <div class="min-w-0 flex-1 leading-tight">
                <b id="kd-split-title" class="block text-sm text-kd-ink truncate">Pisahkan layer</b>
                <span id="kd-split-sub" class="block text-[11px] text-kd-muted truncate"></span>
              </div>
              <button type="button" data-split="close" class="w-9 h-9 shrink-0 rounded-lg grid place-items-center text-kd-muted hover:text-kd-ink hover:bg-kd-surface" title="Tutup (Esc)" aria-label="Tutup">${icon('close')}</button>
            </div>
            <div class="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3">
              <div class="rounded-xl kd-checker border border-kd-line p-2 sm:p-3">
                <svg id="kd-split-view" class="block w-full h-[38vh] sm:h-[44vh] select-none" xmlns="${SVG_NS}"></svg>
              </div>
              <div class="flex flex-wrap items-center gap-1.5">
                <button type="button" data-split="manual" class="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border text-xs font-bold transition-colors" title="Atur sendiri ikon mana yang jadi satu: lasso / ketuk nomor untuk memecah">${icon('lasso', 'w-4 h-4')}<span>Atur manual</span></button>
                <button type="button" data-split="undo" class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-kd-line text-kd-ink hover:border-kd-brand hover:text-kd-brand disabled:opacity-40" title="Urungkan (Ctrl/Cmd+Z)" aria-label="Urungkan">${icon('undo', 'w-4 h-4')}</button>
                <button type="button" data-split="redo" class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-kd-line text-kd-ink hover:border-kd-brand hover:text-kd-brand disabled:opacity-40" title="Ulangi (Ctrl/Cmd+Shift+Z)" aria-label="Ulangi">${icon('redo', 'w-4 h-4')}</button>
                <button type="button" data-split="reset" class="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-kd-line text-xs font-bold text-kd-ink hover:border-kd-brand hover:text-kd-brand disabled:opacity-40" title="Buang semua pengaturan manual">${icon('refresh', 'w-4 h-4')}Kembali ke deteksi otomatis</button>
                <p id="kd-split-mhint" class="basis-full text-[11px] text-kd-ink"></p>
              </div>
              <div class="rounded-xl bg-kd-surface p-3">
                <div class="flex items-center justify-between gap-2 text-xs">
                  <span class="font-bold text-kd-ink">Jarak gabung</span>
                  <b id="kd-split-gap-val" class="text-kd-ink tabular-nums"></b>
                </div>
                <input id="kd-split-gap" type="range" min="0" max="15" step="0.5" class="w-full mt-1 accent-[#2563EB]" aria-label="Jarak gabung">
                <p id="kd-split-help" class="text-[11px] text-kd-muted"></p>
              </div>
              <div>
                <span id="kd-split-count" class="block text-xs font-bold text-kd-ink mb-2"></span>
                <div id="kd-split-pieces" class="grid grid-cols-4 sm:grid-cols-6 gap-2"></div>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-3 border-t border-kd-line">
              <p class="min-w-0 flex-1 basis-full sm:basis-0 text-[11px] text-kd-muted">Setiap ikon jadi file tersendiri, ukurannya pas dengan bentuknya. Bentuk &amp; warna tidak diubah.</p>
              <button type="button" data-split="close" class="${CLS.btnOutline} max-sm:flex-1">Batal</button>
              <button type="button" id="kd-split-ok" data-split="ok" class="${CLS.btnPrimary} max-sm:flex-1">${icon('squares', 'w-4 h-4')}<span></span></button>
            </div>
          </div>`;
        $('#kd-modal').appendChild(el);
        el.addEventListener('click', (e) => {
          if (e.target === el) return close();
          const b = e.target.closest('[data-split]');
          if (!b) return;
          if (b.dataset.split === 'close') close();
          else if (b.dataset.split === 'ok') apply();
          else if (b.dataset.split === 'manual') toggleEdit();
          else if (b.dataset.split === 'undo') step(true);
          else if (b.dataset.split === 'redo') step(false);
          else if (b.dataset.split === 'reset') resetAuto();
        });
        $('#kd-split-gap', el).addEventListener('input', (e) => {
          if (!cur) return;
          if (cur.manual) {
            if (!window.confirm('Pengaturan manual akan diganti hasil deteksi otomatis. Lanjutkan?')) {
              e.target.value = String(cur.gap);
              return;
            }
            setManual(null, 'Kembali ke deteksi otomatis');
          }
          cur.gap = Number(e.target.value);
          draw();
        });
        const view = $('#kd-split-view', el);
        view.addEventListener('pointerdown', lassoDown);
        view.addEventListener('pointermove', lassoMove);
        view.addEventListener('pointerup', lassoUp);
        view.addEventListener('pointercancel', () => { if (cur) { cur.lasso = null; drawLasso(); } });
        document.addEventListener('keydown', (e) => {
          if (!isOpen()) return;
          if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            if (cur && cur.lasso) { cur.lasso = null; return drawLasso(); }
            close();
            return;
          }
          // Urungkan / ulangi di jendela ini saja (riwayat penata ikon tidak tersentuh)
          const ctrl = e.ctrlKey || e.metaKey;
          const k = e.key.toLowerCase();
          if (ctrl && !e.altKey && (k === 'z' || k === 'y') && !(e.target.closest && e.target.closest('input[type="text"], textarea'))) {
            e.preventDefault();
            e.stopPropagation();
            step(k === 'z' && !e.shiftKey);
          }
        }, true);
      }

      function open(id) {
        const item = findItem(id);
        const info = item && analyze(item);
        if (!info) return View.toast('File ini hanya berisi 1 ikon — tidak perlu dipisah.', 'error');
        if (Designer.busy()) return View.toast('Tunggu sampai pengiriman ke Drive selesai.', 'error');
        mount();
        cur = { item, info, gap: info.defaultGap, groups: [], urls: [], manual: null, edit: false, undo: [], redo: [], lasso: null };
        $('#kd-split-sub').textContent = `${item.name} · ${info.layers ? `${info.units} layer terdeteksi` : `${info.units} bentuk lepas, dikelompokkan menurut jarak`}`;
        $('#kd-split-gap').value = String(cur.gap);
        el.classList.remove('hidden');
        draw();
      }

      /** Lepas URL pratinjau lama sedikit terlambat, agar gambar yang masih dimuat tidak error. */
      function revoke() {
        if (!cur) return;
        const old = cur.urls;
        cur.urls = [];
        setTimeout(() => old.forEach((u) => URL.revokeObjectURL(u)), 3000);
      }

      function close() {
        if (!el) return;
        revoke();
        cur = null;
        el.classList.add('hidden');
      }

      /** Gambar file asli + kotak bernomor per ikon hasil, dan daftar hasilnya. */
      function draw() {
        const { item, info } = cur;
        revoke();
        cur.groups = cur.manual ? groupsOf(info, cur.manual) : cluster(info, cur.gap);
        const n = cur.groups.length;
        const pad = info.size * 0.04;
        const { vb, all } = info;
        const view = $('#kd-split-view');
        // Bingkai ke area ikon saja (kanvas Infinite Design sering jauh lebih besar dari ikonnya)
        view.setAttribute('viewBox', `${all.x1 - pad} ${all.y1 - pad} ${all.x2 - all.x1 + pad * 2} ${all.y2 - all.y1 + pad * 2}`);
        const sw = info.size / 300;
        const fs = info.size / 28;
        const source = URL.createObjectURL(new Blob([item.text], { type: 'image/svg+xml' }));
        cur.urls.push(source);
        view.style.touchAction = cur.edit ? 'none' : '';
        view.style.cursor = cur.edit ? 'crosshair' : '';
        view.innerHTML = `<image href="${source}" x="${vb.x}" y="${vb.y}" width="${vb.w}" height="${vb.h}" preserveAspectRatio="none"/>`
          + (cur.edit ? info.boxes.map((b) => `<rect x="${b.x1}" y="${b.y1}" width="${b.x2 - b.x1}" height="${b.y2 - b.y1}" fill="none" stroke="#64748B" stroke-opacity="0.45" stroke-width="${sw * 0.6}"/>`).join('') : '')
          + cur.groups.map((g, k) => {
            const c = COLORS[k % COLORS.length];
            const r = fs * 0.75;
            return `<rect x="${g.x1}" y="${g.y1}" width="${g.x2 - g.x1}" height="${g.y2 - g.y1}" fill="${c}" fill-opacity="0.06" stroke="${c}" stroke-width="${sw}" stroke-dasharray="${sw * 4} ${sw * 3}"/>`
              + `<circle cx="${g.x1}" cy="${g.y1}" r="${r}" fill="${c}"/>`
              + `<text x="${g.x1}" y="${g.y1}" dy="0.35em" text-anchor="middle" font-size="${fs}" font-weight="700" font-family="sans-serif" fill="#fff">${k + 1}</text>`;
          }).join('') + '<g id="kd-split-lasso" pointer-events="none"></g>';
        const mb = $('[data-split="manual"]', el);
        mb.className = `inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border text-xs font-bold transition-colors ${cur.edit ? 'border-kd-brand text-kd-brand-dark bg-kd-brand-light' : 'border-kd-line text-kd-ink bg-white hover:border-kd-brand hover:text-kd-brand'}`;
        mb.setAttribute('aria-pressed', String(cur.edit));
        $('[data-split="undo"]', el).disabled = !cur.undo.length;
        $('[data-split="redo"]', el).disabled = !cur.redo.length;
        $('[data-split="reset"]', el).disabled = !cur.manual;
        $('#kd-split-mhint', el).textContent = cur.edit
          ? 'Seret melingkari 1 ikon (lasso) — layer yang titik tengahnya di dalam lasso jadi 1 ikon. Ketuk nomor ikon untuk memecahnya per layer. Garis abu-abu = batas tiap layer.'
          : cur.manual ? 'Memakai pengaturan manual. Klik "Atur manual" untuk mengubah lagi.' : '';

        $('#kd-split-gap-val').textContent = cur.manual ? 'manual' : `${cur.gap}%`;
        $('#kd-split-help').textContent = cur.gap === 0
          ? 'Hanya bagian yang bertumpuk yang digabung jadi 1 ikon.'
          : `Bagian yang berjarak ≤ ${cur.gap}% dari lebar gambar digabung jadi 1 ikon. Geser ke kanan bila 1 ikon terpecah, ke kiri bila 2 ikon tergabung.`;
        $('#kd-split-count').textContent = `Hasil: ${n} ikon`;
        $('#kd-split-pieces').innerHTML = cur.groups.map((g, k) => {
          const url = URL.createObjectURL(new Blob([pieceText(info, g)], { type: 'image/svg+xml' }));
          cur.urls.push(url);
          return `
            <div class="relative aspect-square rounded-lg border-2 kd-checker overflow-hidden" style="border-color:${COLORS[k % COLORS.length]}">
              <img src="${url}" alt="" class="w-full h-full object-contain p-1.5" draggable="false">
              <span class="absolute left-0.5 top-0.5 min-w-[16px] h-4 px-1 rounded-full text-white text-[9px] font-bold grid place-items-center" style="background:${COLORS[k % COLORS.length]}">${k + 1}</span>
            </div>`;
        }).join('');
        const ok = $('#kd-split-ok');
        ok.disabled = n < 2;
        ok.lastElementChild.textContent = n < 2 ? 'Tidak ada yang dipisah' : `Pisahkan jadi ${n} ikon`;
      }

      /** Ganti ikon gabungan dengan ikon-ikon hasil pemisahan, di posisi yang sama. */
      function apply() {
        if (!cur || cur.groups.length < 2) return;
        const { item, info, groups } = cur;
        const index = state.items.indexOf(item);
        if (index < 0) return close();
        const base = String(item.name || 'ikon').replace(/\.svg$/i, '');
        const pieces = [];
        try {
          groups.forEach((g, k) => {
            const piece = SvgAsset.fromText(pieceText(info, g), `${base} ${k + 1}.svg`);
            piece.split = null; // hasil pisah tidak ditawari dipisah lagi
            pieces.push(piece);
          });
        } catch (err) {
          return View.toast(`Gagal memisahkan: ${err.message}`, 'error');
        }
        // Ke Drive: ikon pertama menimpa file gabungan, sisanya jadi file baru
        if (item.driveId) {
          pieces[0].driveId = item.driveId;
          pieces[0].driveName = item.driveName;
          pieces[0].syncedTransform = 'asli';
          pieces[0].syncedColors = '';
          pieces[0].splitPart = true;
        }
        URL.revokeObjectURL(item.thumb);
        state.items.splice(index, 1, ...pieces);
        if (state.selectedId === item.id) state.selectedId = null;
        // Admin: naikkan jumlah per paket bila sebelumnya muat semua
        if (state.mode !== 'designer' && state.items.length - pieces.length + 1 <= state.count && state.items.length > state.count) {
          const fit = COUNT_OPTIONS.map((o) => o.count).find((c) => c >= state.items.length);
          state.count = fit || COUNT_OPTIONS[COUNT_OPTIONS.length - 1].count;
        }
        close();
        App.refresh();
        View.toast(item.driveId
          ? `Dipisah jadi ${pieces.length} ikon. Klik "Ganti nama semua", lalu kirim ke Drive.`
          : `Dipisah jadi ${pieces.length} ikon.`);
      }

      return { renderNote, open, close, isOpen };
    })();

    /* =====================================================================
     * 8i0. URUNGKAN / ULANGI — satu riwayat bersama (maks. 50 langkah) untuk
     *      semua editing: warna (tab Warna ikon, palet, warna per ikon, warna
     *      per bentuk), garis, garis → fill, hapus bagian, titik liar,
     *      transparansi. Semua perubahan dalam satu klik = satu langkah.
     *      Bentuk disimpan tanpa perubahan warna; warna dicatat terpisah.
     * ===================================================================== */
    const History = (() => {
      const LIMIT = 50;
      let undoStack = [];
      let redoStack = [];
      let pending = null;   // langkah yang sedang dikumpulkan (ditutup di akhir tick)
      let colorBase = null; // keadaan warna terakhir yang sudah dicatat
      let restoring = false;

      /** JSON dengan urutan kunci tetap (untuk membandingkan keadaan warna). */
      const stable = (o) => JSON.stringify(o, (k, v) => (v && typeof v === 'object' && !Array.isArray(v)
        ? Object.keys(v).sort().reduce((r, key) => { r[key] = v[key]; return r; }, {}) : v));

      function colorState() {
        const overrides = {};
        state.items.forEach((it) => {
          if (it.colorOverrides && Object.keys(it.colorOverrides).length) overrides[it.id] = { ...it.colorOverrides };
        });
        return { colors: { ...state.colors }, overrides };
      }

      function snapItem(item) {
        Colors.forget(item); // simpan bentuk tanpa perubahan warna (diterapkan lagi saat render)
        return {
          node: item.node.cloneNode(true), text: item.text, bbox: item.bbox, hull: item.hull, viewBox: { ...item.viewBox },
          geomEdited: !!item.geomEdited, alphaFixed: !!item.alphaFixed, warnings: (item.warnings || []).slice()
        };
      }

      function restoreItem(item, s) {
        Colors.forget(item);
        item.node = s.node.cloneNode(true);
        item.text = s.text;
        item.viewBox = { ...s.viewBox };
        item.bbox = s.bbox;
        item.hull = s.hull;
        item.geomEdited = s.geomEdited;
        item.alphaFixed = s.alphaFixed;
        item.warnings = s.warnings.slice();
        item.paints = null;
        item.hash = null;
        item.split = undefined;
        item.strays = undefined;
        item.strokes = undefined;
        Cleanup.newThumb(item);
      }

      function applyColors(c) {
        state.colors = { ...c.colors };
        state.items.forEach((it) => { it.colorOverrides = { ...(c.overrides[it.id] || {}) }; });
      }

      function open(label) {
        if (!pending) {
          pending = { label: label || 'Edit ikon', named: !!label, items: new Map(), colors: null };
          Promise.resolve().then(close);
        } else if (label && !pending.named) {
          pending.label = label;
          pending.named = true;
        }
        return pending;
      }

      function close() {
        if (!pending) return;
        const step = pending;
        pending = null;
        if (!step.items.size && !step.colors) return;
        undoStack.push(step);
        if (undoStack.length > LIMIT) undoStack.shift();
        redoStack = [];
        render();
      }

      /** Nama langkah berikutnya (dipanggil sebelum mengubah). */
      function label(text) {
        if (!restoring) open(text);
      }

      /** Catat keadaan ikon sebelum diubah (sekali per langkah). */
      function touch(item) {
        if (restoring || !item) return;
        const step = open();
        if (!step.items.has(item)) step.items.set(item, snapItem(item));
      }

      /** Dipanggil setiap kali perubahan warna diterapkan (Colors.commit). */
      function colorsCommitted() {
        const now = colorState();
        if (!restoring && colorBase && stable(colorBase) !== stable(now)) {
          const step = open('Ubah warna');
          if (!step.colors) step.colors = colorBase;
        }
        colorBase = now;
      }

      function move(from, to, verb) {
        StrokeEdit.commit();
        close();
        const step = from.pop();
        if (!step) return View.toast(verb === 'Diurungkan' ? 'Tidak ada yang bisa diurungkan.' : 'Tidak ada yang bisa diulangi.', 'error');
        if (Designer.busy() || Outline.busy()) {
          from.push(step);
          return View.toast('Tunggu proses yang sedang berjalan selesai.', 'error');
        }
        restoring = true;
        try {
          const items = [...step.items.keys()].filter((it) => state.items.includes(it));
          const back = { label: step.label, named: true, items: new Map(), colors: step.colors ? colorState() : null };
          items.forEach((it) => back.items.set(it, snapItem(it)));
          items.forEach((it) => restoreItem(it, step.items.get(it)));
          to.push(back);
          if (step.colors) {
            applyColors(step.colors);
            Colors.commit(); // terapkan ulang semua warna + thumbnail + render
          } else {
            Cleanup.commit(items);
          }
        } finally {
          restoring = false;
          colorBase = colorState();
        }
        Inspect.refresh();
        render();
        View.toast(`${verb}: ${step.label}`);
      }

      const undo = () => move(undoStack, redoStack, 'Diurungkan');
      const redo = () => move(redoStack, undoStack, 'Diulangi');

      /** Data penata ikon baru dimuat: riwayat dikosongkan. */
      function reset() {
        undoStack = [];
        redoStack = [];
        pending = null;
        colorBase = { colors: {}, overrides: {} };
        render();
      }

      /** Perbarui semua tombol Urungkan / Ulangi (kartu tab & Periksa detail). */
      function render() {
        document.querySelectorAll('[data-hist]').forEach((b) => {
          const isUndo = b.dataset.hist === 'undo';
          const stack = isUndo ? undoStack : redoStack;
          const last = stack[stack.length - 1];
          b.disabled = !last;
          b.classList.toggle('opacity-40', !last);
          b.title = last ? `${isUndo ? 'Urungkan' : 'Ulangi'}: ${last.label} (${isUndo ? 'Ctrl+Z' : 'Ctrl+Shift+Z'})` : (isUndo ? 'Tidak ada yang bisa diurungkan' : 'Tidak ada yang bisa diulangi');
        });
      }

      /** Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z, Ctrl+Y. true bila tombolnya dipakai. */
      function key(e) {
        if (!(e.ctrlKey || e.metaKey) || e.altKey) return false;
        const k = e.key.toLowerCase();
        if (k === 'z' && !e.shiftKey) undo();
        else if ((k === 'z' && e.shiftKey) || (k === 'y' && !e.shiftKey)) redo();
        else return false;
        e.preventDefault();
        e.stopPropagation();
        return true;
      }

      return { label, touch, colorsCommitted, undo, redo, reset, render, key, canUndo: () => undoStack.length > 0 };
    })();

    /* =====================================================================
     * 8i. BERSIHKAN & HAPUS BAGIAN — titik anchor liar (subpath tanpa panjang/
     *     luas, bentuk berukuran nol) dibuang otomatis; bagian lain bisa dipilih
     *     & dihapus manual di "Periksa detail". Satu bagian = satu subpath,
     *     jadi lengkungan bentuk lain tidak berubah. Ada urungkan per ikon.
     * ===================================================================== */
    const Cleanup = (() => {
      const PAINTED = 'path, rect, circle, ellipse, line, polyline, polygon';
      const HIDDEN = 'defs, clipPath, mask, symbol, pattern, marker, [data-kd-backgroup]';
      const ARGS = { M: 2, L: 2, T: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, A: 7, Z: 0 };
      const NUM = /[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/y;
      const LEAD_M = /^\s*m\s*([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)[\s,]*([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)\s*,?\s*/;

      const revokeLater = (url) => { if (url) setTimeout(() => URL.revokeObjectURL(url), 3000); };
      const shapesOf = (node) => [...node.querySelectorAll(PAINTED)].filter((el) => !el.closest(HIDDEN));

      /** Pecah atribut d per subpath: posisi teks, titik awal absolut, & semua titik (termasuk titik kendali). */
      function subpaths(d) {
        const src = String(d || '');
        const list = [];
        let i = 0, x = 0, y = 0, sx = 0, sy = 0, cmd = '', cur = null;
        const skip = () => { while (i < src.length && /[\s,]/.test(src[i])) i++; };
        const num = () => {
          skip();
          NUM.lastIndex = i;
          const m = NUM.exec(src);
          if (!m) return null;
          i = NUM.lastIndex;
          return Number(m[0]);
        };
        const flag = () => {
          skip();
          return src[i] === '0' || src[i] === '1' ? Number(src[i++]) : null;
        };
        while (i < src.length) {
          skip();
          if (i >= src.length) break;
          const at = i;
          let explicit = false;
          if (/[a-z]/i.test(src[i])) {
            cmd = src[i++];
            explicit = true;
          } else if (!cmd) break;
          const C = cmd.toUpperCase();
          const rel = cmd !== C;
          if (C === 'Z') {
            if (!explicit) break;
            x = sx; y = sy;
            continue;
          }
          const n = ARGS[C];
          if (n === undefined) break;
          if (C === 'M' && explicit) {
            if (cur) cur.end = at;
            cur = { start: at, end: src.length, pts: [], rel };
            list.push(cur);
          } else if (!cur) break; // path tidak diawali M: tidak valid
          const val = [];
          for (let k = 0; k < n; k++) {
            const next = C === 'A' && (k === 3 || k === 4) ? flag() : num();
            if (next === null) break;
            val.push(next);
          }
          if (val.length < n) break;
          const px = x, py = y;
          const pt = (ax, ay) => (rel ? [px + ax, py + ay] : [ax, ay]);
          if (C === 'H') x = rel ? x + val[0] : val[0];
          else if (C === 'V') y = rel ? y + val[0] : val[0];
          else {
            if (C === 'C') cur.pts.push(pt(val[0], val[1]), pt(val[2], val[3]));
            if (C === 'S' || C === 'Q') cur.pts.push(pt(val[0], val[1]));
            [x, y] = pt(val[n - 2], val[n - 1]);
          }
          cur.pts.push([x, y]);
          if (C === 'M') {
            cur.abs = [x, y];
            sx = x; sy = y;
            cmd = rel ? 'l' : 'L';
          }
        }
        return list;
      }

      /** Teks satu subpath; "m" relatif di awal dijadikan "M" absolut agar tetap benar walau subpath lain dibuang. */
      function piece(d, sp) {
        let text = String(d).slice(sp.start, sp.end).trim();
        if (sp.rel && sp.abs) {
          const m = text.match(LEAD_M);
          if (m) {
            const rest = text.slice(m[0].length);
            text = `M${round(sp.abs[0], 6)} ${round(sp.abs[1], 6)}${rest && !/^[a-z]/i.test(rest) ? ' l' : ''} ${rest}`.trim();
          }
        }
        return text;
      }

      const extent = (pts) => {
        if (!pts.length) return 0;
        const xs = pts.map((p) => p[0]);
        const ys = pts.map((p) => p[1]);
        return Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
      };

      /** Daftar titik liar ikon: [{ index, sub, at }] (sub null = seluruh bentuk). Disimpan di item. */
      function strays(item) {
        if (item.strays) return item.strays;
        const eps = Math.max(1e-4, Math.max(item.viewBox.w, item.viewBox.h) * 0.001);
        const host = svgEl(document, 'svg', { style: 'position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden' });
        const clone = document.importNode(item.node, true);
        host.appendChild(clone);
        document.body.appendChild(host);
        const found = [];
        try {
          const live = shapesOf(clone);
          shapesOf(item.node).forEach((el, index) => {
            const cs = live[index] ? getComputedStyle(live[index]) : null;
            // Garis berujung bulat/kotak tetap tampak sebagai titik — bukan titik liar
            const dot = cs && cs.stroke !== 'none' && cs.strokeLinecap !== 'butt' && parseFloat(cs.strokeWidth) > 0;
            const len = (name) => (el[name] && el[name].baseVal ? el[name].baseVal.value : 0);
            switch (el.localName) {
              case 'path': {
                const subs = subpaths(el.getAttribute('d'));
                if (dot || !subs.length) break;
                const bad = subs.map((sp, k) => (extent(sp.pts) <= eps ? k : -1)).filter((k) => k >= 0);
                if (bad.length === subs.length) subs.forEach((sp, k) => found.push({ index, sub: null, at: sp.pts[0] || [0, 0], n: k ? 0 : subs.length, extra: k > 0 }));
                else bad.forEach((k) => found.push({ index, sub: k, at: subs[k].pts[0] || [0, 0] }));
                break;
              }
              case 'rect':
                if (len('width') <= eps || len('height') <= eps) found.push({ index, sub: null, at: [len('x'), len('y')] });
                break;
              case 'circle':
                if (len('r') <= eps) found.push({ index, sub: null, at: [len('cx'), len('cy')] });
                break;
              case 'ellipse':
                if (len('rx') <= eps || len('ry') <= eps) found.push({ index, sub: null, at: [len('cx'), len('cy')] });
                break;
              case 'line':
                if (!dot && Math.hypot(len('x2') - len('x1'), len('y2') - len('y1')) <= eps) found.push({ index, sub: null, at: [len('x1'), len('y1')] });
                break;
              default: {
                const pts = el.points ? [...el.points].map((p) => [p.x, p.y]) : [];
                if (!dot && pts.length && extent(pts) <= eps) found.push({ index, sub: null, at: pts[0] });
              }
            }
          });
        } finally {
          host.remove();
        }
        item.strays = found;
        return found;
      }

      /** Jumlah titik liar (path yang seluruhnya titik liar dihitung per titiknya). */
      const count = (item) => strays(item).filter((r) => !r.extra).reduce((sum, r) => sum + (r.n || 1), 0);

      /**
       * Garis liar: subpath terbuka (tanpa Z) tanpa garis tepi yang nyaris tanpa luas — sisa coretan / garis
       * bantu yang ikut terekspor. Bentuk tanpa isi & tanpa garis (tak terlihat sama sekali) juga dihitung.
       * Hasil: [{ index, sub, pts }] (sub null = seluruh bentuk). Disimpan per isi file ikon.
       */
      function slivers(item) {
        if (item.slivers && item.sliversFor === item.text) return item.slivers;
        const eps = Math.max(1e-4, Math.max(item.viewBox.w, item.viewBox.h) * 0.001);
        const host = svgEl(document, 'svg', { style: 'position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden' });
        const clone = document.importNode(item.node, true);
        host.appendChild(clone);
        document.body.appendChild(host);
        const found = [];
        try {
          const live = shapesOf(clone);
          shapesOf(item.node).forEach((el, index) => {
            if (el.localName !== 'path' || el.hasAttribute('data-kd-back') || !live[index]) return;
            const cs = getComputedStyle(live[index]);
            const visible = (paint, width, alpha) => paint && paint !== 'none' && !/rgba\([^)]*,\s*0\)$/.test(paint) && width > 0 && alpha > 0;
            if (visible(cs.stroke, parseFloat(cs.strokeWidth), parseFloat(cs.strokeOpacity || 1))) return; // garis tepi terlihat = garis sengaja
            const filled = visible(cs.fill, 1, parseFloat(cs.fillOpacity || 1));
            const d = el.getAttribute('d') || '';
            const subs = subpaths(d);
            // Tertutup = ada Z, atau titik akhir kembali ke titik awal (banyak aplikasi menutup bentuk tanpa Z)
            const isClosed = (sp) => {
              if (/z/i.test(d.slice(sp.start, sp.end))) return true;
              const a = sp.pts[0], b = sp.pts[sp.pts.length - 1];
              return !!(a && b && sp.pts.length > 2 && Math.hypot(a[0] - b[0], a[1] - b[1]) <= eps * 2);
            };
            const closedAny = subs.some(isClosed);
            const bad = [];
            subs.forEach((sp, k) => {
              if (extent(sp.pts) <= eps) return; // titik liar ditangani terpisah
              if (filled && isClosed(sp)) return;
              let len = 0, area = 0;
              sp.pts.forEach((q, i) => {
                const r = sp.pts[(i + 1) % sp.pts.length];
                if (i < sp.pts.length - 1) len += Math.hypot(r[0] - q[0], r[1] - q[1]);
                area += q[0] * r[1] - r[0] * q[1];
              });
              const ratio = len ? Math.abs(area) / 2 / (len * len) : 0;
              if (!filled || ratio < (closedAny ? 0.25 : 0.12)) bad.push(k);
            });
            const whole = bad.length === subs.length;
            bad.forEach((k) => found.push({ index, sub: whole || subs.length < 2 ? null : k, pts: subs[k].pts, extra: whole && k !== bad[0] }));
          });
        } finally {
          host.remove();
        }
        item.slivers = found;
        item.sliversFor = item.text;
        return found;
      }

      const countLines = (item) => slivers(item).length;

      /** id = satu ikon; tanpa id = semua ikon yang punya garis liar. */
      function fixLines(id) {
        const targets = state.items.filter((it) => (id ? String(it.id) === String(id) : countLines(it) > 0));
        if (!targets.length) return;
        if (Designer.busy()) return View.toast('Tunggu pengiriman ke Drive selesai.', 'error');
        History.label('Bersihkan garis liar');
        let total = 0;
        targets.forEach((it) => {
          const list = slivers(it);
          if (!list.length) return;
          total += list.length;
          remove(it, list.filter((r) => !r.extra).map((r) => ({ index: r.index, sub: r.sub })));
        });
        commit(targets);
        Inspect.refresh();
        View.toast(targets.length > 1
          ? `${total} garis liar dibersihkan dari ${targets.length} ikon. Ctrl+Z untuk membatalkan.`
          : `${total} garis liar di ikon ${state.items.indexOf(targets[0]) + 1} dibersihkan. Ctrl+Z untuk membatalkan.`);
      }

      const lineButton = (id, label = 'Bersihkan') => `<button type="button" data-action="lines-fix" ${id ? `data-id="${id}"` : ''}
        class="shrink-0 ml-auto inline-flex items-center gap-1 h-6 px-2 rounded-md border border-[#FFB766] bg-white text-[11px] font-bold text-[#AA5A00] hover:bg-[#FFE7C7] whitespace-nowrap"
        title="Buang garis terbuka tanpa garis tepi yang tidak perlu; bentuk lain tidak berubah">${icon('check', 'w-3.5 h-3.5')}${label}</button>`;

      const noteLines = (n) => `punya ${n} garis liar — garis terbuka tanpa garis tepi (sisa coretan) yang mengganggu`;


      /** Jadikan isi baru sebagai "file asli" ikon; ukur ulang batas objek. */
      function finish(item, edited) {
        item.text = Colors.serialize(item).split(`kd${item.id}-`).join('');
        item.hash = null;
        item.split = undefined;
        item.strays = undefined;
        item.strokes = undefined;
        item.geomEdited = edited;
        SvgAsset.remeasure(item);
        revokeLater(item.thumb); // <img> lama masih bisa memuatnya sebentar
        item.thumb = URL.createObjectURL(new Blob([item.text], { type: 'image/svg+xml' }));
      }

      /** Buang bagian ikon: [{ index, sub }] — index = urutan bentuk, sub = urutan subpath (null = seluruh bentuk). */
      function remove(item, parts) {
        if (!item || !parts.length) return false;
        Colors.forget(item); // kerjakan di warna asli; perubahan warna diterapkan lagi sesudahnya
        History.touch(item);

        const shapes = shapesOf(item.node);
        const byShape = new Map();
        parts.forEach((p) => {
          if (!byShape.has(p.index)) byShape.set(p.index, new Set());
          byShape.get(p.index).add(p.sub);
        });
        byShape.forEach((subs, index) => {
          const el = shapes[index];
          if (!el) return;
          if (subs.has(null) || el.localName !== 'path') return el.remove();
          const d = el.getAttribute('d');
          const kept = subpaths(d).filter((_, k) => !subs.has(k));
          if (!kept.length) return el.remove();
          el.setAttribute('d', kept.map((sp) => piece(d, sp)).join(' '));
        });
        // Grup yang jadi kosong ikut dibuang
        [...item.node.querySelectorAll('g, a')].reverse().forEach((g) => { if (!g.firstElementChild) g.remove(); });
        finish(item, true);
        return true;
      }

      /** Ubah bentuk ikon lewat fn() dengan riwayat urungkan yang sama seperti hapus bagian. */
      function edit(item, fn) {
        begin(item);
        fn();
        end(item);
      }

      /** Simpan keadaan sebelum diubah (warna asli) ke riwayat urungkan. */
      function begin(item) {
        Colors.forget(item);
        History.touch(item);
      }

      /** Rapikan grup kosong lalu jadikan isi baru sebagai file ikon. */
      function end(item) {
        StrokeEdit.syncBack(item.node);
        [...item.node.querySelectorAll('g, a')].reverse().forEach((g) => { if (!g.firstElementChild) g.remove(); });
        finish(item, true);
      }

      /** Thumbnail baru dari isi file ikon. */
      function newThumb(item) {
        revokeLater(item.thumb); // <img> lama masih bisa memuatnya sebentar
        item.thumb = URL.createObjectURL(new Blob([item.text], { type: 'image/svg+xml' }));
      }

      /** Render ulang setelah bentuk ikon berubah. */
      function commit(items) {
        App.refresh();
        items.forEach((it) => Preview.refreshArtwork(it));
      }

      /** id = satu ikon; tanpa id = semua ikon yang punya titik liar. */
      function fix(id) {
        const targets = state.items.filter((it) => (id ? String(it.id) === String(id) : count(it) > 0));
        if (!targets.length) return;
        if (Designer.busy()) return View.toast('Tunggu pengiriman ke Drive selesai.', 'error');
        History.label('Bersihkan titik liar');
        let total = 0;
        targets.forEach((it) => {
          const list = strays(it);
          total += list.length;
          remove(it, list);
        });
        commit(targets);
        Inspect.refresh();
        View.toast(targets.length > 1
          ? `${total} titik anchor liar dibersihkan dari ${targets.length} ikon.`
          : `${total} titik anchor liar di ikon ${state.items.indexOf(targets[0]) + 1} dibersihkan.`);
      }

      const button = (id, label = 'Bersihkan') => `<button type="button" data-action="clean-fix" ${id ? `data-id="${id}"` : ''}
        class="shrink-0 ml-auto inline-flex items-center gap-1 h-6 px-2 rounded-md border border-[#FFB766] bg-white text-[11px] font-bold text-[#AA5A00] hover:bg-[#FFE7C7] whitespace-nowrap"
        title="Buang titik anchor yang tidak terlihat; bentuk lain tidak berubah">${icon('check', 'w-3.5 h-3.5')}${label}</button>`;

      const note = (n) => `punya ${n} titik anchor liar — tidak terlihat, tapi membuat batas ikon melebar`;

      return { shapesOf, subpaths, piece, strays, count, remove, edit, begin, end, newThumb, commit, fix, button, note, slivers, countLines, fixLines, lineButton, noteLines };
    })();

    /* =====================================================================
     * 8i3. FRAME TERLALU LEBAR — viewBox lebih besar dari gambarnya.
     *      Pangkas = frame dibuat PERSIS seukuran gambar yang tampil: batas
     *      geometri tiap bentuk (kurva dihitung titik ekstremnya), garis
     *      dihitung lengkap dengan tebal, ujung & sudutnya (Paper.js), area
     *      clip ikut membatasi. Tanpa margin, tanpa perkiraan piksel.
     *      Hanya viewBox + width/height yang berubah; bentuk tidak digeser.
     * ===================================================================== */
    const Frame = (() => {
      const PAINTED = 'path, rect, circle, ellipse, line, polyline, polygon';
      const BOXED = 'use, text, image';
      const HIDDEN = 'defs, clipPath, mask, symbol, pattern, marker';
      const TOL = 0.002;   // celah < 0,2% sisi frame dianggap pas (pembulatan angka file)
      let working = false;

      const num = (v, d = 0) => { const n = parseFloat(v); return Number.isFinite(n) ? n : d; };
      const union = (a, b) => (!a ? b : !b ? a : (() => {
        const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
        return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y };
      })());
      const intersect = (a, b) => {
        const x0 = Math.max(a.x, b.x), y0 = Math.max(a.y, b.y);
        const x1 = Math.min(a.x + a.w, b.x + b.w), y1 = Math.min(a.y + a.h, b.y + b.h);
        return x1 > x0 && y1 > y0 ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : null;
      };
      /** Kotak lokal (x, y, w, h) → kotak koordinat ikon lewat matriks m. */
      const mapBox = (b, m) => {
        const pts = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]]
          .map(([x, y]) => new DOMPoint(x, y).matrixTransform(m));
        const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
        return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
      };

      /** Jalankan fn(clone) pada salinan ikon di wadah tersembunyi (gaya & matriks bisa dibaca). */
      function withClone(item, fn) {
        const host = svgEl(document, 'svg', { style: 'position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden' });
        const clone = document.importNode(item.node, true);
        host.appendChild(clone);
        document.body.appendChild(host);
        try { return fn(clone); } finally { host.remove(); }
      }

      /** Elemen benar-benar tidak tampil? (wadah sengaja disembunyikan, jadi dicek atributnya) */
      function invisible(el, root) {
        for (let n = el; n && n !== root.parentNode; n = n.parentNode) {
          if (n.nodeType !== 1) continue;
          const cs = getComputedStyle(n);
          if (cs.display === 'none' || n.getAttribute('visibility') === 'hidden' || num(cs.opacity, 1) <= 0) return true;
        }
        return false;
      }

      /** Batas area clip yang mengenai elemen (koordinat ikon), atau null bila tidak di-clip. */
      function clipBox(el, root, toRoot) {
        let box = null;
        for (let n = el; n && n !== root.parentNode; n = n.parentNode) {
          if (n.nodeType !== 1) continue;
          const ref = n.getAttribute('clip-path') || n.style.clipPath || '';
          const id = (ref.match(/url\(\s*["']?#([^"')\s]+)/) || [])[1];
          if (!id) continue;
          const cp = [...root.querySelectorAll('clipPath')].find((c) => c.id === id);
          if (!cp || cp.getAttribute('clipPathUnits') === 'objectBoundingBox' || !n.getCTM()) continue;
          const base = toRoot.multiply(n.getCTM());
          let area = null;
          cp.querySelectorAll(`${PAINTED}, ${BOXED}`).forEach((c) => {
            try {
              const t = c.transform && c.transform.baseVal.consolidate();
              area = union(area, mapBox(c.getBBox(), t ? base.multiply(DOMMatrix.fromMatrix(t.matrix)) : base));
            } catch (err) { /* lewati */ }
          });
          if (area) box = box ? intersect(box, area) : area;
        }
        return box;
      }

      /**
       * Batas gambar yang tampil (koordinat ikon). exact = garis dihitung Paper.js
       * (tebal, ujung, sudut runcing); tanpa exact = garis diperkirakan sedikit lebih lebar.
       */
      function drawnBox(item, exact) {
        const P = exact ? window.paper : null;
        return withClone(item, (root) => {
          const rootM = root.getCTM();
          if (!rootM) return null;
          const toRoot = DOMMatrix.fromMatrix(rootM).inverse();
          let box = null;
          root.querySelectorAll(`${PAINTED}, ${BOXED}`).forEach((el) => {
            if (el.closest(HIDDEN) || invisible(el, root) || !el.getCTM()) return;
            const m = toRoot.multiply(el.getCTM());
            const cs = getComputedStyle(el);
            let b = null;
            try {
              if (el.matches(BOXED)) {
                b = mapBox(el.getBBox(), m);
              } else {
                const fill = !!Outline.paintOf(cs.fill) && num(cs.fillOpacity, 1) > 0 && el.localName !== 'line';
                const sw = num(cs.strokeWidth);
                const stroke = !!Outline.paintOf(cs.stroke) && sw > 0 && num(cs.strokeOpacity, 1) > 0;
                if (!fill && !stroke) return;
                const k = cs.vectorEffect === 'non-scaling-stroke' ? 1 / (Math.sqrt(Math.abs(rootM.a * rootM.d - rootM.b * rootM.c)) || 1)
                  : Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));
                if (P) {
                  const d = el.localName === 'path' ? el.getAttribute('d') : Outline.geometry(el);
                  if (!d) return;
                  const path = P.PathItem.create(d);
                  if (path.remove) path.remove();
                  path.transform(new P.Matrix(m.a, m.b, m.c, m.d, m.e, m.f));
                  if (stroke) {
                    path.strokeColor = 'black';
                    path.strokeWidth = sw * k;
                    path.strokeCap = cs.strokeLinecap || 'butt';
                    path.strokeJoin = cs.strokeLinejoin || 'miter';
                    path.miterLimit = num(cs.strokeMiterlimit, 4);
                  }
                  const pb = stroke ? path.strokeBounds : path.bounds;
                  b = { x: pb.x, y: pb.y, w: pb.width, h: pb.height };
                } else {
                  b = mapBox(el.getBBox(), m);
                  if (stroke) {
                    const ext = (sw * k) / 2 * (cs.strokeLinejoin === 'miter' || cs.strokeLinecap === 'square' ? 1.42 : 1);
                    b = { x: b.x - ext, y: b.y - ext, w: b.w + 2 * ext, h: b.h + 2 * ext };
                  }
                }
              }
            } catch (err) { return; }
            const clip = clipBox(el, root, toRoot);
            if (clip) b = intersect(b, clip);
            if (b && b.w >= 0 && b.h >= 0) box = union(box, b);
          });
          return box;
        });
      }

      /** Batas gambar cepat untuk deteksi (disimpan per isi file). */
      function quickBox(item) {
        if (item.frameQuick && item.frameQuick.text === item.text) return item.frameQuick.box;
        let box = null;
        try { box = drawnBox(item, false); } catch (err) { box = null; }
        item.frameQuick = { text: item.text, box };
        return box;
      }

      /** Ruang kosong frame di tiap sisi (satuan ikon), atau null bila frame sudah pas dengan gambar. */
      function oversized(item) {
        const vb = item.viewBox;
        if (!vb || item.frameFit === item.text) return null;
        const q = quickBox(item);
        const b = q ? intersect(q, vb) : null;
        if (!b) return null;
        const gap = { top: b.y - vb.y, bottom: vb.y + vb.h - b.y - b.h, left: b.x - vb.x, right: vb.x + vb.w - b.x - b.w };
        const tol = Math.max(vb.w, vb.h) * TOL;
        return Object.values(gap).some((g) => g > tol) ? { gap, box: b, tol } : null;
      }

      /** Frame baru = batas gambar persis (dibulatkan keluar ke 3 desimal agar tepi tidak terpotong). */
      async function frameFor(item) {
        let exact = true;
        try { await Outline.ready(); } catch (err) { exact = false; }
        const box = drawnBox(item, exact);
        const b = box ? intersect(box, item.viewBox) : null;
        if (!b) return null;
        const x = Math.floor(b.x * 1000) / 1000, y = Math.floor(b.y * 1000) / 1000;
        return { x, y, w: Math.ceil((b.x + b.w - x) * 1000) / 1000, h: Math.ceil((b.y + b.h - y) * 1000) / 1000 };
      }

      const same = (a, b) => ['x', 'y', 'w', 'h'].every((k) => Math.abs(a[k] - b[k]) < 2e-3);

      /** id = satu ikon; tanpa id = semua ikon yang frame-nya lebih besar dari gambar. */
      async function fix(id) {
        if (working) return;
        const targets = state.items.filter((it) => (id ? String(it.id) === String(id) : oversized(it)));
        if (!targets.length) return;
        if (Designer.busy() || Outline.busy()) return View.toast('Tunggu proses yang sedang berjalan selesai.', 'error');
        working = true;
        try {
          const boxes = [];
          for (const it of targets) boxes.push(await frameFor(it));
          const changes = [];
          targets.forEach((it, i) => {
            const box = boxes[i];
            if (box && !same(box, it.viewBox)) changes.push({ it, box });
            else it.frameFit = it.text; // sudah pas (perkiraan deteksi sedikit berbeda): jangan ditandai lagi
          });
          if (!changes.length) {
            App.refresh();
            Inspect.refresh();
            return View.toast('Frame sudah pas dengan gambar.');
          }
          History.label('Pangkas frame');
          changes.forEach(({ it, box }) => Cleanup.edit(it, () => { it.viewBox = box; }));
          changes.forEach(({ it }) => { it.frameFit = it.text; });
          Cleanup.commit(changes.map((c) => c.it));
          Inspect.refresh();
          const one = changes[0];
          View.toast(changes.length > 1
            ? `Frame ${changes.length} ikon dipangkas persis ke batas gambar.`
            : `Frame ikon ${state.items.indexOf(one.it) + 1} dipangkas persis: ${round(one.box.w, 2)} × ${round(one.box.h, 2)}.`);
        } finally {
          working = false;
        }
      }

      const count = (items) => items.filter((it) => oversized(it)).length;

      const SIDES = { top: 'atas', bottom: 'bawah', left: 'kiri', right: 'kanan' };
      const note = (item) => {
        const o = oversized(item);
        if (!o) return '';
        const vb = item.viewBox;
        const where = Object.keys(SIDES).filter((k) => o.gap[k] > o.tol).map((k) => `${SIDES[k]} ${round(o.gap[k], 2)}`);
        return `frame ${round(vb.w, 2)} × ${round(vb.h, 2)} lebih besar dari gambarnya (±${round(o.box.w, 2)} × ${round(o.box.h, 2)}) — ruang kosong di ${where.join(', ')}`;
      };

      const button = (id, label = 'Pangkas frame') => `<button type="button" data-action="frame-fix" ${id ? `data-id="${id}"` : ''}
        class="shrink-0 ml-auto inline-flex items-center gap-1 h-6 px-2 rounded-md border border-[#FFB766] bg-white text-[11px] font-bold text-[#AA5A00] hover:bg-[#FFE7C7] whitespace-nowrap"
        title="Jadikan frame (viewBox) persis seukuran gambar; bentuk tidak berubah">${icon('crop', 'w-3.5 h-3.5')}${label}</button>`;

      return { oversized, fix, count, note, button, busy: () => working };
    })();

    /* =====================================================================
     * 8i4. FLATTEN — mask & clip-path diubah jadi bentuk biasa (seperti
     *      Flatten di Figma): bentuk yang di-mask dipotong sungguhan ke area
     *      mask, lalu mask / clip dibuang. Hanya mask putih / hitam polos
     *      yang bisa (tampilan tetap sama); hasil dibandingkan piksel demi
     *      piksel dengan aslinya sebelum diterapkan. Filter (bayangan, blur)
     *      tidak bisa jadi vektor: boleh dihapus setelah konfirmasi.
     * ===================================================================== */
    /* =====================================================================
     * 8i4. STIKER — seluruh ikon (isi + garis lengkap dengan tebalnya) digabung
     *      jadi satu siluet, dilebarkan keluar dengan sudut membulat, SEMUA
     *      rongga diisi, opsional pinggiran (mis. putih seperti stiker cetak).
     *      Disimpan sebagai <g data-kd-sticker> paling belakang; frame ikon
     *      ikut melebar sehingga ikon otomatis diperkecil di sel paket.
     * ===================================================================== */
    const Sticker = (() => {
      const SEL = '[data-kd-sticker]';
      const SWATCH = ['#E8392A', '#F59E0B', '#16A34A', '#2563EB', '#7C3AED', '#EC4899', '#111827'];
      const EDGE_SWATCH = ['#FFFFFF', '#111827', '#E5E7EB', '#FDE68A'];
      const opt = { color: '#E8392A', size: 4, edge: false, edgeColor: '#FFFFFF', edgeSize: 2, scope: 'all' };
      try { Object.assign(opt, JSON.parse(localStorage.getItem('kd-sticker-opt')) || {}); } catch (e) {}
      let box = null;
      let working = false;
      let progress = '';

      const num = (v, d = 0) => { const n = parseFloat(v); return Number.isFinite(n) ? n : d; };
      const hex = (v) => (/^#[0-9a-f]{6}$/i.test(String(v || '')) ? String(v).toUpperCase() : null);
      const save = () => { try { localStorage.setItem('kd-sticker-opt', JSON.stringify(opt)); } catch (e) {} };
      const has = (item) => !!(item && item.node && item.node.querySelector(SEL));
      const tick = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));

      /** Lepas stiker: buang lapisannya & kembalikan frame sebelum stiker dibuat. */
      function strip(item) {
        const g = item.node.querySelector(SEL);
        if (!g) return false;
        const vb = String(g.getAttribute('data-kd-vb') || '').split(' ').map(Number);
        g.remove();
        if (vb.length === 4 && vb.every(Number.isFinite) && vb[2] > 0 && vb[3] > 0) item.viewBox = { x: vb[0], y: vb[1], w: vb[2], h: vb[3] };
        return true;
      }

      /** Daftar bentuk terlihat (geometri + cat) dalam koordinat lokal node, plus batas kasarnya. */
      function shapes(item) {
        const host = svgEl(document, 'svg', { style: 'position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden' });
        const clone = document.importNode(item.node, true);
        const old = clone.querySelector(SEL);
        if (old) old.remove();
        host.appendChild(clone);
        document.body.appendChild(host);
        try {
          const nodeCTM = clone.getCTM();
          if (!nodeCTM) return null;
          const toNode = DOMMatrix.fromMatrix(nodeCTM).inverse();
          const tr = clone.transform && clone.transform.baseVal && clone.transform.baseVal.consolidate();
          const nodeM = tr ? DOMMatrix.fromMatrix(tr.matrix) : new DOMMatrix();
          const list = [];
          let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
          Cleanup.shapesOf(clone).forEach((el) => {
            const ctm = el.getCTM();
            if (!ctm) return;
            const cs = getComputedStyle(el);
            // Wadah ukur sengaja disembunyikan (visibility:hidden) → cek atribut/style milik ikon sendiri
            for (let n = el; n && n !== host; n = n.parentNode) {
              if (!n.getAttribute) continue;
              const st = (n.getAttribute('style') || '').replace(/\s+/g, '');
              if (n.getAttribute('display') === 'none' || n.getAttribute('visibility') === 'hidden' || /display:none|visibility:hidden/i.test(st)) return;
            }
            if (num(cs.opacity, 1) <= 0) return;
            const d = Outline.geometry(el);
            if (!d) return;
            const m = toNode.multiply(ctm);
            const fill = !!Outline.paintOf(cs.fill) && num(cs.fillOpacity, 1) > 0 && el.localName !== 'line';
            const sw = num(cs.strokeWidth);
            const stroke = !!Outline.paintOf(cs.stroke) && sw > 0 && num(cs.strokeOpacity, 1) > 0;
            if (!fill && !stroke) return;
            const join = cs.strokeLinejoin === 'round' ? 'round' : cs.strokeLinejoin === 'bevel' ? 'bevel' : 'miter';
            const limit = num(cs.strokeMiterlimit, 4);
            let bb = null;
            try { bb = el.getBBox(); } catch (err) { bb = null; }
            if (!bb) return;
            const k = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)) || 1;
            const e = stroke ? (sw * k / 2) * (join === 'miter' ? Math.min(4, Math.max(1.5, limit)) : 1.5) : 0;
            [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]].forEach(([x, y]) => {
              const p = new DOMPoint(x, y).matrixTransform(m);
              x0 = Math.min(x0, p.x - e); y0 = Math.min(y0, p.y - e);
              x1 = Math.max(x1, p.x + e); y1 = Math.max(y1, p.y + e);
            });
            list.push({
              d, m: [m.a, m.b, m.c, m.d, m.e, m.f], fill, rule: cs.fillRule === 'evenodd' ? 'evenodd' : 'nonzero',
              sw: stroke ? sw : 0, join, limit,
              cap: cs.strokeLinecap === 'round' ? 'round' : cs.strokeLinecap === 'square' ? 'square' : 'butt'
            });
          });
          if (!list.length || !(x1 > x0) || !(y1 > y0)) return null;
          return { list, nodeM, box: { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } };
        } finally {
          host.remove();
        }
      }

      /* ---- Peta jarak (piksel) — tahan banting untuk ikon serumit apa pun ---- */
      const BIG = 1e20;
      function dt1(f, d, v, z, n) {
        let k = 0;
        v[0] = 0; z[0] = -BIG; z[1] = BIG;
        for (let q = 1; q < n; q++) {
          let s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
          while (s <= z[k]) { k--; s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]); }
          k++; v[k] = q; z[k] = s; z[k + 1] = BIG;
        }
        k = 0;
        for (let q = 0; q < n; q++) {
          while (z[k + 1] < q) k++;
          const dq = q - v[k];
          d[q] = dq * dq + f[v[k]];
        }
      }
      /** Jarak Euklides tiap piksel ke piksel "fitur" terdekat. */
      function edt(feat, W, H) {
        const n = Math.max(W, H);
        const f = new Float64Array(n), d = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1);
        const out = new Float64Array(W * H);
        for (let i = 0; i < W * H; i++) out[i] = feat[i] ? 0 : BIG;
        for (let x = 0; x < W; x++) {
          for (let y = 0; y < H; y++) f[y] = out[y * W + x];
          dt1(f, d, v, z, H);
          for (let y = 0; y < H; y++) out[y * W + x] = d[y];
        }
        for (let y = 0; y < H; y++) {
          const o = y * W;
          for (let x = 0; x < W; x++) f[x] = out[o + x];
          dt1(f, d, v, z, W);
          for (let x = 0; x < W; x++) out[o + x] = Math.sqrt(d[x]);
        }
        return out;
      }
      /** Piksel di luar bentuk yang tersambung ke tepi kanvas (rongga tertutup = bukan luar). */
      function outside(inside, W, H) {
        const out = new Uint8Array(W * H);
        const st = new Int32Array(W * H);
        let sp = 0;
        const push = (i) => { if (!inside[i] && !out[i]) { out[i] = 1; st[sp++] = i; } };
        for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
        for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
        while (sp) {
          const i = st[--sp], x = i % W;
          if (x > 0) push(i - 1);
          if (x < W - 1) push(i + 1);
          if (i >= W) push(i - W);
          if (i < W * (H - 1)) push(i + W);
        }
        return out;
      }
      /** Garis kontur (marching squares) di nilai `lv` → daftar loop titik piksel. */
      function contours(g, W, H, lv) {
        const pts = new Map();
        const segs = [];
        const at = (key) => {
          let p = pts.get(key);
          if (p) return key;
          const cell = key >> 1, i = cell % W, j = (cell - i) / W;
          const a = g[cell], b = (key & 1) ? g[cell + W] : g[cell + 1];
          const t = Math.min(1, Math.max(0, (lv - a) / (b - a || 1e-12)));
          pts.set(key, (key & 1) ? [i + 0.5, j + 0.5 + t] : [i + 0.5 + t, j + 0.5]);
          return key;
        };
        for (let j = 0; j < H - 1; j++) {
          for (let i = 0; i < W - 1; i++) {
            const c0 = j * W + i;
            const va = g[c0], vb = g[c0 + 1], vc = g[c0 + W + 1], vd = g[c0 + W];
            const idx = (va > lv ? 8 : 0) | (vb > lv ? 4 : 0) | (vc > lv ? 2 : 0) | (vd > lv ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const T = c0 * 2, R = (c0 + 1) * 2 + 1, B = (c0 + W) * 2, L = c0 * 2 + 1;
            const add = (p, q) => segs.push([at(p), at(q)]);
            const mid = (va + vb + vc + vd) / 4 > lv;
            switch (idx) {
              case 1: case 14: add(L, B); break;
              case 2: case 13: add(B, R); break;
              case 3: case 12: add(L, R); break;
              case 4: case 11: add(T, R); break;
              case 6: case 9: add(T, B); break;
              case 7: case 8: add(T, L); break;
              case 5: if (mid) { add(T, L); add(B, R); } else { add(T, R); add(L, B); } break;
              case 10: if (mid) { add(T, R); add(L, B); } else { add(T, L); add(B, R); } break;
            }
          }
        }
        const by = new Map();
        segs.forEach((s, n) => s.forEach((k) => { const l = by.get(k); if (l) l.push(n); else by.set(k, [n]); }));
        const used = new Uint8Array(segs.length);
        const loops = [];
        for (let n = 0; n < segs.length; n++) {
          if (used[n]) continue;
          used[n] = 1;
          const start = segs[n][0];
          let cur = segs[n][1];
          const loop = [pts.get(start)];
          for (let guard = 0; guard < segs.length && cur !== start; guard++) {
            loop.push(pts.get(cur));
            const nx = (by.get(cur) || []).find((m) => !used[m]);
            if (nx === undefined) break;
            used[nx] = 1;
            cur = segs[nx][0] === cur ? segs[nx][1] : segs[nx][0];
          }
          if (loop.length >= 4) loops.push(loop);
        }
        return loops;
      }
      const areaOf = (pl) => { let a = 0; for (let i = 0, j = pl.length - 1; i < pl.length; j = i++) a += (pl[j][0] + pl[i][0]) * (pl[j][1] - pl[i][1]); return a / 2; };
      const insidePoly = (pt, pl) => {
        let c = false;
        for (let i = 0, j = pl.length - 1; i < pl.length; j = i++) {
          const [xi, yi] = pl[i], [xj, yj] = pl[j];
          if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c;
        }
        return c;
      };

      /** Siluet ikon → kanvas → bentuk stiker (vektor halus, rongga selalu penuh). */
      function stickerPaths(item) {
        const P = window.paper;
        const sh = shapes(item);
        if (!sh) return null;
        const G = sh.box;
        const unitG = Math.max(G.w, G.h) / 100;
        const padU = (1.6 * (opt.size + (opt.edge ? opt.edgeSize : 0)) + 2) * unitG;
        const N = 1300;
        const s = N / (Math.max(G.w, G.h) + 2 * padU);
        const W = Math.ceil((G.w + 2 * padU) * s) + 4, H = Math.ceil((G.h + 2 * padU) * s) + 4;
        const ox = G.x - padU - 2 / s, oy = G.y - padU - 2 / s; // titik node di piksel (0,0)
        const cv = document.createElement('canvas');
        cv.width = W; cv.height = H;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        ctx.fillStyle = '#000';
        ctx.strokeStyle = '#000';
        sh.list.forEach((x) => {
          ctx.setTransform(s, 0, 0, s, -ox * s, -oy * s);
          ctx.transform(...x.m);
          let p2;
          try { p2 = new Path2D(x.d); } catch (err) { return; }
          if (x.fill) ctx.fill(p2, x.rule);
          if (x.sw > 0) {
            ctx.lineWidth = x.sw; ctx.lineJoin = x.join; ctx.lineCap = x.cap; ctx.miterLimit = x.limit;
            ctx.stroke(p2);
          }
        });
        const px = ctx.getImageData(0, 0, W, H).data;
        const base = new Uint8Array(W * H);
        let bx0 = W, by0 = H, bx1 = -1, by1 = -1;
        for (let i = 0; i < W * H; i++) {
          if (px[i * 4 + 3] >= 100) {
            base[i] = 1;
            const x = i % W, y = (i - x) / W;
            if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y;
          }
        }
        if (bx1 < 0) return null;
        const unit = (Math.max(bx1 - bx0, by1 - by0) + 1) / s / 100;
        const d1 = edt(base, W, H);

        const make = (T) => {
          const R = 0.6 * T;
          const grown = new Uint8Array(W * H);
          const lim = (T + R) * s + 0.5;
          for (let i = 0; i < W * H; i++) grown[i] = d1[i] <= lim ? 1 : 0;
          const out = outside(grown, W, H);       // rongga tertutup ikut terisi
          const d2 = edt(out, W, H);              // jarak ke luar → susutkan R (lekukan dalam membulat)
          const loops = contours(d2, W, H, R * s + 0.5)
            .map((l) => ({ l, a: Math.abs(areaOf(l)) }))
            .filter((o) => o.a > 6)
            .sort((p, q) => q.a - p.a);
          const keep = [];
          loops.forEach((o) => { if (!keep.some((k) => insidePoly(o.l[0], k.l))) keep.push(o); });
          if (!keep.length) return null;
          const kids = keep.map((o) => {
            const path = new P.Path({ segments: o.l.map(([x, y]) => [ox + x / s, oy + y / s]), closed: true, insert: false });
            path.simplify(0.4 / s);
            if (!path.clockwise) path.reverse();
            return path;
          });
          return kids.length === 1 ? kids[0] : new P.CompoundPath({ children: kids, insert: false });
        };
        const t = Math.max(0.01, opt.size * unit);
        const main = make(t);
        if (!main) return null;
        const edge = opt.edge ? make(t + Math.max(0.01, opt.edgeSize * unit)) : null;
        return { main, edge, nodeM: sh.nodeM };
      }

      /** Buat stiker untuk satu ikon (dipanggil di dalam Cleanup.edit). */
      function build(item) {
        strip(item);
        const res = stickerPaths(item);
        if (!res) return false;
        const { main, edge } = res;
        const sil = { nodeM: res.nodeM };

        const vb = item.viewBox;
        const doc = item.node.ownerDocument;
        const g = doc.createElementNS(SVG_NS, 'g');
        g.setAttribute('data-kd-sticker', '1');
        g.setAttribute('data-kd-vb', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
        const piece = (d, fill) => {
          const p = doc.createElementNS(SVG_NS, 'path');
          p.setAttribute('d', d);
          p.setAttribute('fill', fill);
          p.setAttribute('stroke', 'none');
          p.setAttribute('fill-rule', 'nonzero');
          return p;
        };
        if (edge) g.appendChild(piece(edge.pathData, opt.edgeColor));
        g.appendChild(piece(main.pathData, opt.color));
        item.node.insertBefore(g, item.node.firstChild);

        // Frame ikut melebar mengikuti stiker (dalam koordinat ikon)
        const b = (edge || main).bounds;
        const pts = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]]
          .map(([x, y]) => new DOMPoint(x, y).matrixTransform(sil.nodeM));
        const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
        const x0 = Math.min(vb.x, ...xs), y0 = Math.min(vb.y, ...ys);
        const x1 = Math.max(vb.x + vb.w, ...xs), y1 = Math.max(vb.y + vb.h, ...ys);
        const fx = Math.floor(x0 * 1000) / 1000, fy = Math.floor(y0 * 1000) / 1000;
        item.viewBox = { x: fx, y: fy, w: Math.ceil((x1 - fx) * 1000) / 1000, h: Math.ceil((y1 - fy) * 1000) / 1000 };
        return true;
      }

      function targets() {
        const items = activeItems();
        if (opt.scope === 'one') {
          const sel = items.find((it) => it.id === state.selectedId);
          return sel ? [sel] : [];
        }
        return items;
      }

      async function apply() {
        if (working) return;
        const list = targets();
        if (!list.length) {
          return View.toast(opt.scope === 'one' ? 'Klik satu ikon di pratinjau dulu, atau pilih "Semua ikon".' : 'Belum ada ikon di paket.', 'error');
        }
        if (Designer.busy() || Outline.busy() || Frame.busy()) return View.toast('Tunggu proses yang sedang berjalan selesai.', 'error');
        working = true;
        progress = 'Memuat pustaka…';
        render();
        try {
          try { await Outline.ready(); } catch (err) { return View.toast('Gagal memuat pustaka vektor. Periksa koneksi internet lalu coba lagi.', 'error'); }
          History.label(list.length > 1 ? `Stiker ${list.length} ikon` : 'Stiker ikon');
          const done = [], failed = [];
          for (let i = 0; i < list.length; i++) {
            progress = `Membuat stiker ${i + 1}/${list.length}…`;
            render();
            await tick();
            const it = list[i];
            let ok = false;
            Cleanup.edit(it, () => {
              try { ok = build(it); } catch (err) { console.error('Stiker gagal:', err); ok = false; }
            });
            (ok ? done : failed).push(it);
          }
          Cleanup.commit(list);
          Inspect.refresh();
          if (done.length) View.toast(`Stiker dibuat untuk ${done.length} ikon${failed.length ? ` · ${failed.length} gagal` : ''}. Ctrl+Z untuk membatalkan.`);
          else View.toast('Stiker gagal dibuat — bentuk ikon tidak terbaca.', 'error');
        } finally {
          working = false;
          progress = '';
          render();
        }
      }

      function removeAll() {
        if (working) return;
        const list = targets().filter(has);
        if (!list.length) return View.toast('Tidak ada stiker untuk dilepas.', 'error');
        History.label('Lepas stiker');
        list.forEach((it) => Cleanup.edit(it, () => { strip(it); }));
        Cleanup.commit(list);
        Inspect.refresh();
        View.toast(`Stiker dilepas dari ${list.length} ikon.`);
      }

      const swatches = (list, current, key) => list.map((c) => `
        <button type="button" data-st="swatch" data-key="${key}" data-color="${c}" title="${c}" aria-label="Warna ${c}"
          class="w-6 h-6 rounded-full border ${current === c ? 'ring-2 ring-offset-1 ring-kd-brand border-white' : 'border-black/15'}" style="background:${c}"></button>`).join('');

      function render() {
        if (!box) return;
        const items = activeItems();
        const sel = items.find((it) => it.id === state.selectedId);
        const nWith = targets().filter(has).length;
        const tab = (val, label) => `<button type="button" data-st="scope" data-val="${val}" aria-pressed="${opt.scope === val}"
          class="h-8 rounded-lg text-xs font-bold transition ${opt.scope === val ? 'bg-white text-kd-brand shadow-sm' : 'text-kd-muted hover:text-kd-ink'}">${label}</button>`;
        const sw = (on, act) => `<button type="button" data-st="${act}" role="switch" aria-checked="${on}" class="relative shrink-0 w-11 h-6 min-h-0 p-0 rounded-full transition-colors ${on ? 'bg-kd-brand' : 'bg-[#BFC9D9]'}" style="min-height:24px;height:24px;width:44px;">
            <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" style="transform:translateX(${on ? 20 : 0}px)"></span></button>`;
        box.innerHTML = `
          <p class="text-xs text-kd-muted mb-3">Latar warna di belakang ikon: sudut membulat, semua rongga terisi. Ikon diperkecil otomatis agar ukuran sel paket tetap.</p>
          <div class="grid grid-cols-2 gap-1 p-1 rounded-xl bg-kd-surface mb-3">
            ${tab('all', `Semua ikon (${items.length})`)}${tab('one', sel ? `Ikon terpilih (${state.items.indexOf(sel) + 1})` : 'Ikon terpilih')}
          </div>
          ${opt.scope === 'one' && !sel ? '<p class="text-[11px] text-[#AA5A00] bg-[#FFF4E5] rounded-lg px-2.5 py-1.5 mb-3">Klik satu ikon di pratinjau untuk memilihnya.</p>' : ''}
          <div class="space-y-3">
            <div>
              <div class="flex items-center justify-between mb-1.5"><span class="text-xs font-bold text-kd-ink">Warna stiker</span>
                <label class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-kd-muted cursor-pointer">${escapeHtml(opt.color)}
                  <input type="color" data-st-in="color" value="${opt.color}" class="w-7 h-7 p-0 border border-kd-line rounded cursor-pointer bg-white"></label></div>
              <div class="flex flex-wrap gap-1.5">${swatches(SWATCH, opt.color, 'color')}</div>
            </div>
            <label class="block">
              <span class="flex items-center justify-between text-xs font-bold text-kd-ink mb-1">Ketebalan stiker <b data-st-val="size" class="text-kd-brand">${opt.size}%</b></span>
              <input type="range" data-st-in="size" min="1" max="12" step="0.5" value="${opt.size}" class="w-full accent-[#2563EB]">
            </label>
            <div class="flex items-start justify-between gap-3 p-3 rounded-xl bg-kd-surface">
              <span><span class="block text-sm font-bold text-kd-ink">Pinggiran tambahan</span>
                <span class="block text-xs text-kd-muted">Garis tepi di luar warna stiker, mis. putih seperti stiker cetak.</span></span>
              ${sw(!!opt.edge, 'edge')}
            </div>
            ${opt.edge ? `
            <div class="pl-3 border-l-2 border-kd-line space-y-3">
              <div>
                <div class="flex items-center justify-between mb-1.5"><span class="text-xs font-bold text-kd-ink">Warna pinggiran</span>
                  <label class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-kd-muted cursor-pointer">${escapeHtml(opt.edgeColor)}
                    <input type="color" data-st-in="edgeColor" value="${opt.edgeColor}" class="w-7 h-7 p-0 border border-kd-line rounded cursor-pointer bg-white"></label></div>
                <div class="flex flex-wrap gap-1.5">${swatches(EDGE_SWATCH, opt.edgeColor, 'edgeColor')}</div>
              </div>
              <label class="block">
                <span class="flex items-center justify-between text-xs font-bold text-kd-ink mb-1">Ketebalan pinggiran <b data-st-val="edgeSize" class="text-kd-brand">${opt.edgeSize}%</b></span>
                <input type="range" data-st-in="edgeSize" min="0.5" max="8" step="0.5" value="${opt.edgeSize}" class="w-full accent-[#2563EB]">
              </label>
            </div>` : ''}
          </div>
          <div class="grid grid-cols-1 gap-2 mt-4">
            <button type="button" data-st="apply" class="${CLS.btnPrimary} w-full" ${working ? 'disabled' : ''}>
              ${working ? `<span class="inline-block w-4 h-4 rounded-full border-2 border-white/50 border-t-white animate-spin"></span>${escapeHtml(progress)}` : `${icon('shapes', 'w-4 h-4')}${nWith ? 'Perbarui stiker' : 'Buat stiker'}`}
            </button>
            ${nWith ? `<button type="button" data-st="remove" class="${CLS.btnOutline} w-full" ${working ? 'disabled' : ''}>Lepas stiker (${nWith} ikon)</button>` : ''}
          </div>`;
      }

      function mount(el) {
        box = el;
        if (!box || box.dataset.bound) return render();
        box.dataset.bound = '1';
        box.addEventListener('click', (e) => {
          const b = e.target.closest('[data-st]');
          if (!b || !box.contains(b)) return;
          const act = b.dataset.st;
          if (act === 'scope') { opt.scope = b.dataset.val === 'one' ? 'one' : 'all'; save(); render(); }
          else if (act === 'edge') { opt.edge = !opt.edge; save(); render(); }
          else if (act === 'swatch') { const c = hex(b.dataset.color); if (c) { opt[b.dataset.key === 'edgeColor' ? 'edgeColor' : 'color'] = c; save(); render(); } }
          else if (act === 'apply') apply();
          else if (act === 'remove') removeAll();
        });
        box.addEventListener('input', (e) => {
          const inp = e.target.closest('[data-st-in]');
          if (!inp) return;
          const key = inp.dataset.stIn;
          if (key === 'color' || key === 'edgeColor') { const c = hex(inp.value); if (c) opt[key] = c; }
          else {
            opt[key] = num(inp.value, opt[key]);
            const lab = box.querySelector(`[data-st-val="${key}"]`);
            if (lab) lab.textContent = `${opt[key]}%`;
          }
          save();
        });
        box.addEventListener('change', (e) => { if (e.target.closest('[data-st-in="color"], [data-st-in="edgeColor"]')) render(); });
        render();
      }

      return { mount, render, apply, removeAll, has, busy: () => working };
    })();

    const Flatten = (() => {
      const PAINTED = 'path, rect, circle, ellipse, line, polyline, polygon';
      const UNSUPPORTED = 'use, text, image, foreignObject';
      const REF = /url\(\s*["']?#([^"')\s]+)["']?\s*\)/;
      const CHECK = 256;          // resolusi pembanding piksel
      const MAX_DIFF = 0.004;     // maks. 0,4% piksel boleh beda (anti-alias tepi)
      let working = false;

      const num = (v, d = 0) => { const n = parseFloat(v); return Number.isFinite(n) ? n : d; };
      const refOf = (el, prop) => {
        const v = el.getAttribute(prop) || (el.style && el.style.getPropertyValue(prop)) || '';
        const m = v.match(REF);
        return m ? m[1] : null;
      };
      const dropRef = (el, prop) => { el.removeAttribute(prop); if (el.style) el.style.removeProperty(prop); };
      const inDefs = (el) => !!el.parentElement && !!el.parentElement.closest('defs, mask, clipPath, symbol, pattern, marker');
      const byId = (root, id) => [...root.querySelectorAll('[id]')].find((n) => n.id === id) || null;

      /** Ikon memakai mask / clip-path / filter? */
      function uses(node) {
        return [...node.querySelectorAll('*')].some((el) => !inDefs(el) && (refOf(el, 'mask') || refOf(el, 'clip-path') || refOf(el, 'filter')))
          || !!node.querySelector('mask, filter');
      }
      const needs = (item) => item.warnings.includes(WARN.effect);

      const paperPath = (P, d, m, rule) => {
        const p = P.PathItem.create(d);
        if (p.remove) p.remove();
        p.transform(new P.Matrix(m.a, m.b, m.c, m.d, m.e, m.f));
        p.fillRule = rule === 'evenodd' ? 'evenodd' : 'nonzero';
        if (p.reorient) p.reorient(rule !== 'evenodd', true);
        return p;
      };
      const matOf = (el) => { const t = el.transform && el.transform.baseVal.consolidate(); return t ? DOMMatrix.fromMatrix(t.matrix) : new DOMMatrix(); };

      /** Luminans warna isi mask: 1 = putih, 0 = hitam, null = abu-abu / gradient (tidak bisa). */
      function lum(cs) {
        const p = Outline.paintOf(cs.fill);
        if (!p) return 0; // tanpa isi = tidak menambah area
        if (!/^#/.test(p.paint) || p.alpha < 0.999 || num(cs.fillOpacity, 1) < 0.999 || num(cs.opacity, 1) < 0.999) return null;
        const v = [1, 3, 5].map((i) => parseInt(p.paint.slice(i, i + 2), 16));
        if (v.every((x) => x >= 250)) return 1;
        if (v.every((x) => x <= 5)) return 0;
        return null;
      }

      /** Area clip-path / mask (Paper, koordinat ikon) untuk elemen `owner`. Error berisi alasan bila tidak bisa. */
      function regionOf(P, root, toRoot, owner, kind, id) {
        const def = byId(root, id);
        if (!def) return null; // rujukan rusak: tidak berefek, cukup dibuang
        let base = toRoot.multiply(owner.getCTM());
        const unitsAttr = kind === 'clip' ? 'clipPathUnits' : 'maskContentUnits';
        if (def.getAttribute(unitsAttr) === 'objectBoundingBox') {
          const bb = owner.getBBox();
          base = base.translate(bb.x, bb.y).scale(bb.width, bb.height);
        }
        if (kind === 'mask' && (def.querySelector('linearGradient, radialGradient, filter, mask')
          || [...def.querySelectorAll('*')].some((n) => refOf(n, 'mask') || refOf(n, 'filter')))) {
          throw new Error('mask bergradasi / berefek');
        }
        if (def.querySelector(UNSUPPORTED)) throw new Error(`${kind === 'mask' ? 'mask' : 'clip'} berisi teks / gambar`);
        let area = null;
        def.querySelectorAll(PAINTED).forEach((sh) => {
          const d = Outline.geometry(sh);
          if (!d) return;
          const cs = getComputedStyle(sh);
          // Matriks: dasar × transform tiap leluhur di dalam definisi
          let m = base;
          const chain = [];
          for (let n = sh; n && n !== def; n = n.parentElement) chain.unshift(n);
          chain.forEach((n) => { m = m.multiply(matOf(n)); });
          if (kind === 'clip') {
            const p = paperPath(P, d, m, cs.clipRule);
            area = area ? area.unite(p, { insert: false }) : p;
            return;
          }
          if (Outline.paintOf(cs.stroke) && num(cs.strokeWidth) > 0) throw new Error('mask memakai garis');
          const v = lum(cs);
          if (v === null) throw new Error('mask bergradasi / abu-abu');
          const p = paperPath(P, d, m, cs.fillRule);
          if (v === 1) area = area ? area.unite(p, { insert: false }) : p;
          else if (area && Outline.paintOf(cs.fill)) area = area.subtract(p, { insert: false });
        });
        if (kind === 'mask' && def.getAttribute('maskUnits') === 'userSpaceOnUse' && def.hasAttribute('width') && def.hasAttribute('height')) {
          const r = new P.Path.Rectangle({ point: [num(def.getAttribute('x')), num(def.getAttribute('y'))], size: [num(def.getAttribute('width')), num(def.getAttribute('height'))], insert: false });
          const bm = toRoot.multiply(owner.getCTM());
          r.transform(new P.Matrix(bm.a, bm.b, bm.c, bm.d, bm.e, bm.f));
          area = area ? area.intersect(r, { insert: false }) : null;
        }
        return area || new P.Path({ insert: false }); // kosong = semua tersembunyi
      }

      /** Potong satu bentuk ke area: isi diganti hasil irisan; garis jadi bentuk isi terpisah lalu dipotong. */
      function cutShape(P, root, toRoot, sh, area) {
        const d = Outline.geometry(sh);
        const cs = getComputedStyle(sh);
        const m = toRoot.multiply(sh.getCTM());
        const inv = m.inverse();
        const toLocal = (p) => { p.transform(new P.Matrix(inv.a, inv.b, inv.c, inv.d, inv.e, inv.f)); return p.pathData; };
        const doc = sh.ownerDocument;
        const fill = Outline.paintOf(cs.fill);
        const stroke = Outline.paintOf(cs.stroke) && num(cs.strokeWidth) > 0 ? Outline.paintOf(cs.stroke) : null;
        if (!d) { sh.remove(); return; }
        const out = [];
        if (stroke) {
          if (cs.strokeDasharray && cs.strokeDasharray !== 'none') throw new Error('garis putus-putus di dalam mask — ubah garis ke fill dulu');
          const line = paperPath(P, d, m, 'nonzero');
          const k = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)) || 1;
          const ring = window.paperjsOffset.offsetStroke(line, num(cs.strokeWidth) * k / 2, {
            join: cs.strokeLinejoin === 'round' ? 'round' : cs.strokeLinejoin === 'bevel' ? 'bevel' : 'miter',
            cap: cs.strokeLinecap === 'round' ? 'round' : 'butt', limit: num(cs.strokeMiterlimit, 4), insert: false
          });
          const cut = ring ? ring.intersect(area, { insert: false }) : null;
          if (cut && Math.abs(cut.area) > 1e-9) {
            const el = doc.createElementNS(SVG_NS, 'path');
            [...sh.attributes].forEach((a) => { if (!/^(d|x|y|width|height|rx|ry|cx|cy|r|x1|y1|x2|y2|points|id|style|mask|clip-path)$/.test(a.name)) el.setAttribute(a.name, a.value); });
            el.setAttribute('d', toLocal(cut));
            el.setAttribute('fill', stroke.paint);
            el.setAttribute('fill-opacity', String(stroke.alpha * num(cs.strokeOpacity, 1)));
            el.setAttribute('stroke', 'none');
            if (num(cs.opacity, 1) < 1) el.setAttribute('opacity', cs.opacity);
            out.push(el);
          }
        }
        let keep = null;
        if (fill && sh.localName !== 'line') {
          const body = paperPath(P, d, m, cs.fillRule);
          const cut = body.intersect(area, { insert: false });
          if (Math.abs(cut.area) > 1e-9) keep = toLocal(cut);
        }
        out.forEach((el) => sh.parentNode.insertBefore(el, sh.nextSibling));
        if (!keep) { sh.remove(); return; }
        const p = sh.localName === 'path' ? sh : (() => {
          const n = doc.createElementNS(SVG_NS, 'path');
          [...sh.attributes].forEach((a) => { if (!/^(x|y|width|height|rx|ry|cx|cy|r|x1|y1|x2|y2|points)$/.test(a.name)) n.setAttribute(a.name, a.value); });
          sh.replaceWith(n);
          return n;
        })();
        p.setAttribute('d', keep);
        if (stroke) { p.style.setProperty('stroke', 'none'); p.setAttribute('stroke', 'none'); }
        if (cs.fillRule === 'evenodd') p.setAttribute('fill-rule', 'nonzero'); // hasil irisan sudah berarah benar
      }

      /** Flatten di salinan hidup. Hasil: { root, filters } atau Error berisi alasan. */
      function flattenClone(item) {
        const P = window.paper;
        const host = svgEl(document, 'svg', { style: 'position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden' });
        const root = document.importNode(item.node, true);
        host.appendChild(root);
        document.body.appendChild(host);
        try {
          const toRoot = DOMMatrix.fromMatrix(root.getCTM()).inverse(); // DOMMatrix: bisa dikalikan dengan matriks apa pun
          // Dari yang paling dalam dulu, supaya area luar memotong hasil yang sudah bersih
          const owners = [...root.querySelectorAll('*')].filter((el) => !inDefs(el) && el.localName !== 'mask' && el.localName !== 'clipPath'
            && (refOf(el, 'mask') || refOf(el, 'clip-path'))).reverse();
          if (refOf(root, 'mask') || refOf(root, 'clip-path')) owners.push(root);
          owners.forEach((owner) => {
            if (!owner.isConnected) return;
            ['clip-path', 'mask'].forEach((prop) => {
              const id = refOf(owner, prop);
              if (!id || !owner.getCTM()) return;
              const area = regionOf(P, root, toRoot, owner, prop === 'mask' ? 'mask' : 'clip', id);
              if (area) {
                if (owner.matches(UNSUPPORTED) || owner.querySelector(UNSUPPORTED)) throw new Error('bagian yang di-mask berisi teks / gambar');
                const shapes = owner.matches(PAINTED) ? [owner] : [...owner.querySelectorAll(PAINTED)].filter((s) => !inDefs(s));
                shapes.forEach((sh) => { if (sh.getCTM()) cutShape(P, root, toRoot, sh, area); });
              }
              dropRef(owner, prop);
            });
          });
          // Definisi mask / clip yang tidak dipakai lagi dibuang
          root.querySelectorAll('mask, clipPath').forEach((def) => {
            const used = [...root.querySelectorAll('*')].some((el) => refOf(el, 'mask') === def.id || refOf(el, 'clip-path') === def.id);
            if (!used) def.remove();
          });
          const filters = [...root.querySelectorAll('*')].filter((el) => !inDefs(el) && refOf(el, 'filter'));
          root.remove();
          return { root, filters: filters.length };
        } catch (err) {
          root.remove();
          return err instanceof Error ? err : new Error(String(err));
        } finally {
          host.remove();
        }
      }

      /** Gambar node ikon (dengan viewBox ikon) ke piksel untuk dibandingkan. */
      function pixels(node, vb) {
        const k = CHECK / Math.max(vb.w, vb.h);
        const w = Math.max(1, Math.round(vb.w * k)), h = Math.max(1, Math.round(vb.h * k));
        const doc = document.implementation.createDocument(SVG_NS, 'svg', null);
        const r = doc.documentElement;
        r.setAttribute('width', w); r.setAttribute('height', h);
        r.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
        r.appendChild(doc.importNode(node, true));
        const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(doc)], { type: 'image/svg+xml' }));
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            try {
              const c = document.createElement('canvas');
              c.width = w; c.height = h;
              const ctx = c.getContext('2d', { willReadFrequently: true });
              ctx.drawImage(img, 0, 0, w, h);
              resolve(ctx.getImageData(0, 0, w, h).data);
            } catch (err) { resolve(null); } finally { URL.revokeObjectURL(url); }
          };
          img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
          img.src = url;
        });
      }

      /** Bagian piksel yang berbeda jelas (0..1); null = tidak bisa dibandingkan. */
      async function difference(a, b, vb) {
        const [pa, pb] = await Promise.all([pixels(a, vb), pixels(b, vb)]);
        if (!pa || !pb || pa.length !== pb.length) return null;
        let diff = 0, ink = 0;
        for (let i = 0; i < pa.length; i += 4) {
          const on = pa[i + 3] > 8 || pb[i + 3] > 8;
          if (!on) continue;
          ink++;
          const da = Math.abs(pa[i + 3] - pb[i + 3]);
          const dc = Math.max(Math.abs(pa[i] - pb[i]), Math.abs(pa[i + 1] - pb[i + 1]), Math.abs(pa[i + 2] - pb[i + 2]));
          if (da > 96 || (pa[i + 3] > 200 && pb[i + 3] > 200 && dc > 96)) diff++;
        }
        return ink ? diff / ink : 0;
      }

      /** Buang semua efek filter (bayangan, blur, dll.). */
      function dropFilters(root) {
        root.querySelectorAll('*').forEach((el) => { if (refOf(el, 'filter')) dropRef(el, 'filter'); });
        if (refOf(root, 'filter')) dropRef(root, 'filter');
        root.querySelectorAll('filter').forEach((f) => f.remove());
      }

      /** id = satu ikon; tanpa id = semua ikon yang memakai mask / filter. */
      async function fix(id) {
        if (working) return;
        const targets = state.items.filter((it) => (id ? String(it.id) === String(id) : needs(it)));
        if (!targets.length) return;
        if (Designer.busy() || Outline.busy()) return View.toast('Tunggu proses yang sedang berjalan selesai.', 'error');
        working = true;
        try {
          try { await Outline.ready(); } catch (err) { return View.toast('Alat Flatten gagal dimuat. Periksa koneksi internet lalu coba lagi.', 'error'); }
          const done = [], failed = [];
          let filterItems = [];
          for (const it of targets) {
            Colors.forget(it); // bandingkan & kerjakan di warna asli
            const res = flattenClone(it);
            if (res instanceof Error) { failed.push({ it, why: res.message }); continue; }
            const diff = await difference(it.node, res.root, it.viewBox);
            if (diff === null || diff > MAX_DIFF) {
              failed.push({ it, why: diff === null ? 'hasil tidak bisa diperiksa' : `hasil berbeda ${Math.round(diff * 1000) / 10}% dari aslinya` });
              continue;
            }
            done.push({ it, root: res.root });
            if (res.filters) filterItems.push(state.items.indexOf(it) + 1);
          }
          if (filterItems.length && !window.confirm(`Ikon ${filterItems.join(', ')} memakai efek filter (bayangan / blur) yang tidak bisa dijadikan vektor.\nHapus efeknya? Tampilan ikon akan berubah (bayangan / blur hilang).`)) filterItems = [];
          if (done.length) {
            History.label('Flatten mask');
            done.forEach(({ it, root }) => {
              if (filterItems.includes(state.items.indexOf(it) + 1)) dropFilters(root);
              Cleanup.edit(it, () => {
                const node = it.node.ownerDocument.importNode(root, true);
                [...it.node.attributes].forEach((a) => it.node.removeAttribute(a.name));
                [...node.attributes].forEach((a) => it.node.setAttribute(a.name, a.value));
                it.node.replaceChildren(...node.childNodes);
                if (!uses(it.node)) it.warnings = it.warnings.filter((w) => w !== WARN.effect);
              });
            });
            Cleanup.commit(done.map((x) => x.it));
            Inspect.refresh();
          } else {
            App.refresh();
          }
          const left = done.filter(({ it }) => needs(it)).length;
          const msg = [];
          if (done.length) msg.push(`${done.length} ikon di-flatten${left ? ` (${left} masih punya efek filter)` : ''}.`);
          if (failed.length) msg.push(failed.map(({ it, why }) => `Ikon ${state.items.indexOf(it) + 1}: ${why}`).join(' · '));
          View.toast(msg.join(' '), failed.length && !done.length ? 'error' : undefined);
        } finally {
          working = false;
        }
      }

      const button = (id, label = 'Flatten') => `<button type="button" data-action="flat-fix" ${id ? `data-id="${id}"` : ''}
        class="shrink-0 ml-auto inline-flex items-center gap-1 h-6 px-2 rounded-md border border-[#FFB766] bg-white text-[11px] font-bold text-[#AA5A00] hover:bg-[#FFE7C7] whitespace-nowrap"
        title="Ubah mask / clip jadi bentuk biasa (seperti Flatten di Figma); tampilan tetap sama">${icon('shapes', 'w-3.5 h-3.5')}${label}</button>`;

      return { fix, needs, button, busy: () => working };
    })();

    /* =====================================================================
     * 8j. GARIS → FILL — bentuk yang masih memakai stroke (garis belum di-
     *     "outline") dideteksi otomatis, lalu diubah jadi bentuk berisi
     *     (seperti "Outline Stroke" di Illustrator). Warna, tebal, ujung &
     *     sudut garis dipertahankan. Pustaka Paper.js + paperjs-offset baru
     *     dimuat saat tombol pertama kali diklik. Bisa diurungkan (Ctrl+Z).
     * ===================================================================== */
    const Outline = (() => {
      const LIBS = [
        ['paper', 'https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.18/paper-core.min.js'],
        ['paperjsOffset', 'https://cdn.jsdelivr.net/npm/paperjs-offset@2.2.2/dist/index.umd.min.js']
      ];
      const COPY = ['transform', 'opacity', 'clip-path', 'mask', 'filter', 'visibility', 'display', 'shape-rendering', 'id'];
      let loading = null;
      let scope = null;
      let working = false;

      function loadScript(src) {
        return new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = src;
          s.async = true;
          s.onload = resolve;
          s.onerror = () => reject(new Error(`Gagal memuat ${src}`));
          document.head.appendChild(s);
        });
      }

      /** Muat Paper.js + paperjs-offset sekali saja (berurutan: offset butuh paper). */
      function ready() {
        if (scope) return Promise.resolve();
        if (!loading) {
          loading = LIBS.reduce((p, [name, src]) => p.then(() => (window[name] ? null : loadScript(src))), Promise.resolve())
            .then(() => {
              if (!window.paper || !window.paperjsOffset || !window.paperjsOffset.offsetStroke) throw new Error('Pustaka konversi tidak lengkap');
              scope = window.paper;
              if (!scope.project) scope.setup(new scope.Size(1, 1));
            })
            .catch((err) => { loading = null; throw err; });
        }
        return loading;
      }

      /** "rgb(1,2,3)" / "rgba(1,2,3,.5)" → { hex, alpha }; url(#id) dipertahankan; selain itu null. */
      function paintOf(value) {
        const v = String(value || '').trim();
        if (!v || v === 'none') return null;
        if (/^url\(/i.test(v)) {
          const id = v.match(/#([^"')\s]+)/);
          return id ? { paint: `url(#${id[1]})`, alpha: 1 } : null;
        }
        const m = v.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+)(%?))?\s*\)$/i);
        if (!m) return null;
        const alpha = m[4] === undefined ? 1 : parseFloat(m[4]) / (m[5] ? 100 : 1);
        if (!(alpha > 0)) return null;
        return { paint: '#' + [m[1], m[2], m[3]].map((x) => Math.round(Number(x)).toString(16).padStart(2, '0')).join(''), alpha };
      }

      const num = (s) => { const n = parseFloat(s); return Number.isFinite(n) ? n : 0; };

      /**
       * Daftar bentuk yang masih bergaris: [{ index, width, cap, join, limit, paint, alpha, dash, dashOffset,
       * fill, strokeFirst, opacity, marker }]. index = urutan bentuk (sama dengan Cleanup.shapesOf).
       */
      function scan(item) {
        if (item.strokes && item.strokesFor === item.text) return item.strokes;
        const host = svgEl(document, 'svg', { style: 'position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden' });
        const clone = document.importNode(item.node, true);
        host.appendChild(clone);
        document.body.appendChild(host);
        const found = [];
        try {
          Cleanup.shapesOf(clone).forEach((el, index) => {
            const cs = getComputedStyle(el);
            // (wadah pengukur sengaja disembunyikan, jadi yang dicek hanya atribut bentuk itu sendiri)
            if (cs.display === 'none' || el.getAttribute('visibility') === 'hidden') return;
            // Lapisan "di belakang": garisnya digambar oleh salinan di lapisan paling bawah
            const token = el.getAttribute('data-kd-back');
            const backEl = token ? clone.querySelector(`[data-kd-backof="${token}"]`) : null;
            const ss = backEl ? getComputedStyle(backEl) : cs;
            const stroke = paintOf(ss.stroke);
            let width = num(ss.strokeWidth);
            const alpha = stroke ? stroke.alpha * (ss.strokeOpacity === '' ? 1 : num(ss.strokeOpacity)) : 0;
            if (!stroke || !(width > 0) || !(alpha > 0)) return;
            if (ss.vectorEffect === 'non-scaling-stroke') {
              const m = (backEl || el).getCTM();
              const k = m ? Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)) : 1;
              if (k > 0) width /= k;
            }
            const fill = paintOf(cs.fill);
            const pos = el.getAttribute('data-kd-pos') || 'center';
            let area = el.localName !== 'line';
            if (area) { try { const b = el.getBBox(); area = b.width > 0 && b.height > 0; } catch (e) { area = true; } }
            const po = String(cs.paintOrder || 'normal');
            const si = po.indexOf('stroke');
            const fi = po.indexOf('fill');
            const dash = ss.strokeDasharray && ss.strokeDasharray !== 'none'
              ? ss.strokeDasharray.split(/[\s,]+/).map(num).filter((x) => x >= 0) : [];
            found.push({
              index,
              width,                                   // tebal yang digambar
              shown: pos === 'center' ? width : width / 2, // tebal seperti di Figma (posisi dalam/luar = 2× lalu dipotong)
              pos,
              layer: backEl ? 'back' : 'front',
              fillRule: cs.fillRule === 'evenodd' ? 'evenodd' : 'nonzero',
              cap: ss.strokeLinecap || 'butt',
              join: ss.strokeLinejoin || 'miter',
              limit: num(ss.strokeMiterlimit) || 4,
              paint: stroke.paint,
              alpha,
              dash: dash.reduce((a, b) => a + b, 0) > 0 ? dash : null,
              dashOffset: num(ss.strokeDashoffset),
              // Isi dianggap ada hanya jika bentuknya punya luas (garis lurus / titik tidak punya isi)
              fill: !!(area && fill && num(cs.fillOpacity === '' ? 1 : cs.fillOpacity) > 0),
              strokeFirst: po !== 'normal' && si >= 0 && (fi < 0 || si < fi),
              opacity: cs.opacity === '' ? 1 : num(cs.opacity),
              marker: [cs.markerStart, cs.markerMid, cs.markerEnd].some((m) => m && m !== 'none')
            });
          });
        } finally {
          host.remove();
        }
        item.strokes = found;
        item.strokesFor = item.text;
        return found;
      }

      /** Jumlah bentuk bergaris yang bisa diubah (yang memakai marker/panah dihitung terpisah). */
      const count = (item) => scan(item).filter((s) => !s.marker).length;
      const markers = (item) => scan(item).filter((s) => s.marker).length;

      /** Geometri bentuk dasar → data path (koordinat lokal bentuk). */
      function geometry(el) {
        const len = (name) => (el[name] && el[name].baseVal ? el[name].baseVal.value : 0);
        const has = (name) => el.hasAttribute(name);
        const f = (n) => round(n, 6);
        switch (el.localName) {
          case 'path': return el.getAttribute('d') || '';
          case 'rect': {
            const x = len('x'), y = len('y'), w = len('width'), h = len('height');
            if (!(w > 0) || !(h > 0)) return '';
            let rx = has('rx') ? len('rx') : has('ry') ? len('ry') : 0;
            let ry = has('ry') ? len('ry') : has('rx') ? len('rx') : 0;
            rx = Math.min(Math.max(rx, 0), w / 2);
            ry = Math.min(Math.max(ry, 0), h / 2);
            if (!(rx > 0) || !(ry > 0)) return `M${f(x)} ${f(y)}H${f(x + w)}V${f(y + h)}H${f(x)}Z`;
            return `M${f(x + rx)} ${f(y)}H${f(x + w - rx)}A${f(rx)} ${f(ry)} 0 0 1 ${f(x + w)} ${f(y + ry)}V${f(y + h - ry)}`
              + `A${f(rx)} ${f(ry)} 0 0 1 ${f(x + w - rx)} ${f(y + h)}H${f(x + rx)}A${f(rx)} ${f(ry)} 0 0 1 ${f(x)} ${f(y + h - ry)}`
              + `V${f(y + ry)}A${f(rx)} ${f(ry)} 0 0 1 ${f(x + rx)} ${f(y)}Z`;
          }
          case 'circle': case 'ellipse': {
            const cx = len('cx'), cy = len('cy');
            const rx = el.localName === 'circle' ? len('r') : len('rx');
            const ry = el.localName === 'circle' ? len('r') : len('ry');
            if (!(rx > 0) || !(ry > 0)) return '';
            return `M${f(cx + rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx)} ${f(cy + ry)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(cy)}`
              + `A${f(rx)} ${f(ry)} 0 0 1 ${f(cx)} ${f(cy - ry)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx + rx)} ${f(cy)}Z`;
          }
          case 'line': return `M${f(len('x1'))} ${f(len('y1'))}L${f(len('x2'))} ${f(len('y2'))}`;
          default: {
            const pts = el.points ? [...el.points] : [];
            if (!pts.length) return '';
            return pts.map((p, i) => `${i ? 'L' : 'M'}${f(p.x)} ${f(p.y)}`).join('') + (el.localName === 'polygon' ? 'Z' : '');
          }
        }
      }

      /** Path tertutup dibuka di titik awalnya (bentuknya tetap sama) supaya bisa dipotong per garis putus. */
      function opened(path) {
        const P = scope;
        const c = path.clone({ insert: false });
        if (!c.closed) return c;
        const first = c.firstSegment;
        c.closed = false;
        c.add(new P.Segment(first.point.clone(), first.handleIn.clone(), new P.Point(0, 0)));
        first.handleIn = new P.Point(0, 0);
        return c;
      }

      /** Potong path jadi potongan garis putus-putus; titik nol-panjang dikembalikan terpisah. */
      function dashed(path, dash, offset, dots) {
        const list = dash.length % 2 ? dash.concat(dash) : dash;
        const total = list.reduce((a, b) => a + b, 0);
        const base = opened(path);
        const L = base.length;
        const out = [];
        let pos = -(((offset % total) + total) % total);
        let i = 0;
        while (pos < L && out.length + dots.length < 4000) {
          const len = list[i % list.length];
          if (i % 2 === 0 && pos + len >= 0) {
            const a = Math.max(0, pos), b = Math.min(L, pos + len);
            if (b - a > 1e-6) {
              let piece = base.clone({ insert: false });
              if (b < L - 1e-6) piece.splitAt(b);
              if (a > 1e-6) piece = piece.splitAt(a) || piece;
              out.push(piece);
            } else if (b >= a) {
              const loc = base.getLocationAt(a);
              if (loc) dots.push({ point: loc.point, tangent: base.getTangentAt(a) });
            }
          }
          pos += len;
          i++;
        }
        return out;
      }

      /** Ujung kotak (square) = garis diperpanjang setengah tebal lalu dipotong rata. */
      function extend(path, half) {
        const P = scope;
        if (path.closed || path.segments.length < 2 || !(path.length > 0)) return;
        const t0 = path.getTangentAt(0), t1 = path.getTangentAt(path.length);
        if (!t0 || !t1) return;
        path.firstSegment.handleIn = new P.Point(0, 0);
        path.lastSegment.handleOut = new P.Point(0, 0);
        path.insert(0, new P.Segment(path.firstSegment.point.subtract(t0.normalize(half))));
        path.add(new P.Segment(path.lastSegment.point.add(t1.normalize(half))));
      }

      /** Titik (subpath tanpa panjang) dengan ujung bulat/kotak tetap tampil sebagai titik. */
      function dotShape(dot, s) {
        const P = scope;
        const half = s.width / 2;
        if (s.cap === 'round') return new P.Path.Circle({ center: dot.point, radius: half, insert: false });
        if (s.cap !== 'square') return null;
        const sq = new P.Path.Rectangle({ point: dot.point.subtract(half), size: [s.width, s.width], insert: false });
        if (dot.tangent && dot.tangent.length) sq.rotate(dot.tangent.angle, dot.point);
        return sq;
      }

      /** Data path garis → data path bentuk berisi (koordinat lokal yang sama). */
      function outlineD(d, s) {
        const P = scope;
        P.activate();
        const src = P.PathItem.create(d);
        if (src.remove) src.remove();
        const kids = (src.children ? src.children.slice() : [src]).filter((p) => p.segments && p.segments.length);
        const half = s.width / 2;
        const lines = [];
        const dots = [];
        kids.forEach((p) => {
          if (!(p.length > 1e-6)) {
            if (p.segments.length) dots.push({ point: p.firstSegment.point, tangent: null });
            return;
          }
          (s.dash ? dashed(p, s.dash, s.dashOffset, dots) : [p.clone({ insert: false })]).forEach((piece) => lines.push(piece));
        });
        // Handle di luar ujung path terbuka tidak tampil di SVG, tapi mengacaukan offset — dinolkan
        lines.forEach((p) => {
          if (p.closed) return;
          p.firstSegment.handleIn = new P.Point(0, 0);
          p.lastSegment.handleOut = new P.Point(0, 0);
        });
        if (s.cap === 'square') lines.forEach((p) => extend(p, half));
        const shapes = [];
        if (lines.length) {
          const group = lines.length === 1 ? lines[0] : new P.CompoundPath({ children: lines, insert: false });
          const join = s.join === 'round' ? 'round' : s.join === 'bevel' ? 'bevel' : 'miter';
          const res = window.paperjsOffset.offsetStroke(group, half, {
            join, cap: s.cap === 'round' ? 'round' : 'butt', limit: s.limit, insert: false
          });
          if (res) shapes.push(res);
        }
        dots.forEach((dot) => { const sh = dotShape(dot, s); if (sh) shapes.push(sh); });
        if (!shapes.length) return '';
        let out = shapes[0];
        for (let i = 1; i < shapes.length; i++) out = out.unite(shapes[i], { insert: false });
        // Posisi dalam = garis ∩ bentuk; luar = garis − bentuk (hanya bentuk yang punya isi)
        if (s.fill && (s.pos === 'inside' || s.pos === 'outside')) {
          const body = P.PathItem.create(d);
          if (body.remove) body.remove();
          body.fillRule = s.fillRule;
          out = s.pos === 'inside' ? out.intersect(body, { insert: false }) : out.subtract(body, { insert: false });
        }
        // Buang serpihan sangat kecil hasil perhitungan offset (bisa jadi titik anchor liar)
        const eps = Math.max(1e-3, s.width * 0.05);
        (out.children ? out.children.slice() : [out]).forEach((k) => {
          const b = k.bounds;
          if ((b.width < eps && b.height < eps) || Math.abs(k.area) < eps * eps) {
            if (k === out) out = null;
            else k.remove();
          }
        });
        if (!out) return '';
        const data = out.getPathData(null, 4);
        return /[0-9]/.test(data) ? data : '';
      }

      /** Ganti satu bentuk bergaris: garis jadi path berisi; isi asli (jika ada) tetap, garisnya dimatikan. */
      function convertEl(el, s) {
        const d = outlineD(geometry(el), s);
        if (!d) return false;
        const shape = el.ownerDocument.createElementNS(SVG_NS, 'path');
        const ownClip = el.getAttribute('data-kd-clip');
        COPY.forEach((a) => { if (el.hasAttribute(a) && !(a === 'id' && s.fill) && !(a === 'clip-path' && ownClip)) shape.setAttribute(a, el.getAttribute(a)); });
        if (ownClip && el.getAttribute('data-kd-clip-prev')) shape.setAttribute('clip-path', el.getAttribute('data-kd-clip-prev'));
        shape.setAttribute('d', d);
        // Style inline (tanpa !important) mengalahkan aturan class di file, tapi mode Outline tetap bisa menimpanya
        shape.style.setProperty('fill', s.paint);
        if (s.alpha < 1) shape.style.setProperty('fill-opacity', String(round(s.alpha, 4)));
        shape.style.setProperty('fill-rule', 'nonzero');
        shape.style.setProperty('stroke', 'none');
        if (!el.hasAttribute('opacity') && s.opacity < 1) shape.style.setProperty('opacity', String(round(s.opacity, 4)));
        const back = StrokeEdit.backOf(el);
        StrokeEdit.clearPos(null, el); // posisi dalam/luar sudah jadi bentuk; buang clip-path & paint-order bantu
        if (back) {
          // Lapisan belakang: bentuk garis menggantikan salinannya (di bawah semua isi)
          const t = back.getAttribute('transform');
          if (t) shape.setAttribute('transform', t);
          else shape.removeAttribute('transform');
          shape.removeAttribute('id');
          const group = back.parentNode;
          group.parentNode.insertBefore(shape, group);
          back.remove();
          if (!group.firstElementChild) group.remove();
          el.removeAttribute('data-kd-back');
          el.removeAttribute('data-kd-layer');
          el.style.setProperty('stroke', 'none');
          return true;
        }
        if (s.fill) {
          el.style.setProperty('stroke', 'none');
          el.parentNode.insertBefore(shape, s.strokeFirst ? el : el.nextSibling);
        } else {
          el.replaceWith(shape);
        }
        return true;
      }

      /** id = satu ikon; tanpa id = semua ikon yang masih bergaris. */
      async function fix(id, only) {
        const pick = (s) => !s.marker && (!only || only.includes(s.index));
        const targets = state.items.filter((it) => (id ? String(it.id) === String(id) : count(it) > 0));
        if (!targets.length || working) return;
        if (Designer.busy()) return View.toast('Tunggu pengiriman ke Drive selesai.', 'error');
        working = true;
        render();
        try {
          if (!scope) View.toast('Menyiapkan alat konversi garis…');
          await ready();
        } catch (err) {
          working = false;
          render();
          return View.toast('Alat konversi garis gagal dimuat. Periksa koneksi internet lalu coba lagi.', 'error');
        }
        let done = 0, failed = 0;
        const changed = [];
        History.label(only ? 'Garis → fill (bagian terpilih)' : 'Garis → fill');
        targets.forEach((it) => {
          if (!scan(it).some(pick)) return;
          Cleanup.edit(it, () => {
            // Dihitung ulang di warna asli (perubahan warna diterapkan lagi sesudahnya)
            it.strokes = undefined;
            const list = scan(it).filter(pick);
            const els = Cleanup.shapesOf(it.node);
            list.forEach((s) => {
              try {
                if (els[s.index] && convertEl(els[s.index], s)) done++;
                else failed++;
              } catch (err) {
                failed++;
                console.warn('Garis → fill gagal:', err);
              }
            });
          });
          changed.push(it);
        });
        working = false;
        if (!changed.length) return render();
        Cleanup.commit(changed);
        Inspect.refresh();
        const where = changed.length > 1 ? `di ${changed.length} ikon` : `di ikon ${state.items.indexOf(changed[0]) + 1}`;
        View.toast(failed
          ? `${done} garis diubah jadi fill ${where}; ${failed} bentuk gagal — periksa di Periksa detail.`
          : `${done} garis diubah jadi fill ${where}. Ctrl+Z / tombol Urungkan untuk membatalkan.`, failed ? 'error' : undefined);
      }

      const busy = () => working;

      /** Tombol diperbarui saat konversi berjalan (cegah klik ganda). */
      function render() {
        document.querySelectorAll('[data-action="stroke-fix"], [data-ins="stroke"]').forEach((b) => {
          b.disabled = working;
          b.classList.toggle('opacity-50', working);
        });
      }

      const button = (id, label = 'Ubah ke fill') => `<button type="button" data-action="stroke-fix" ${id ? `data-id="${id}"` : ''} ${working ? 'disabled' : ''}
        class="shrink-0 ml-auto inline-flex items-center gap-1 h-6 px-2 rounded-md border border-[#FFB766] bg-white text-[11px] font-bold text-[#AA5A00] hover:bg-[#FFE7C7] whitespace-nowrap ${working ? 'opacity-50' : ''}"
        title="Ubah garis (stroke) jadi bentuk berisi (fill); warna & tebal tetap sama">${icon('outline', 'w-3.5 h-3.5')}${label}</button>`;

      const note = (n, m = 0) => [
        n ? `masih memakai garis (stroke) di ${n} bentuk — belum di-outline ke fill` : '',
        m ? `${n ? '' : 'punya '}${m} garis berpanah (marker) yang tidak bisa diubah otomatis — ubah ke fill di aplikasi desain` : ''
      ].filter(Boolean).join('; ');

      return { scan, count, markers, fix, busy, button, note, render, paintOf, geometry, ready };
    })();

    /* =====================================================================
     * 8k. EDIT GARIS — ubah tebal, warna, posisi (tengah/dalam/luar), gaya
     *     (solid/putus-putus/titik), ujung & sudut garis seperti panel Stroke
     *     di Figma. Massal (tab "Garis (stroke)" di samping tab Warna ikon)
     *     atau hanya garis yang diklik (panel "Garis" di Periksa detail).
     *     Posisi dalam = garis 2× tebal dipotong bentuknya sendiri (clip-path);
     *     luar = garis 2× tebal digambar di belakang isi (paint-order).
     *     Hanya untuk bentuk yang punya isi (fill) + garis. Bisa diurungkan.
     * ===================================================================== */
    const StrokeEdit = (() => {
      const session = new Map(); // item -> Map(el -> Map(key -> op)) selama slider/warna digeser
      let open = false;
      let frame = 0;
      const scopeItems = () => (state.mode === 'designer' ? state.items : activeItems());
      const STYLE = [['solid', 'Solid'], ['dash', 'Putus-putus'], ['dot', 'Titik']];
      const CAPS = [['butt', 'Rata', 'M3 12h14'], ['round', 'Bulat', 'M3 12h14'], ['square', 'Kotak', 'M3 12h14']];
      const POS = [['center', 'Tengah', 'Center: separuh garis di luar, separuh di dalam bentuk'], ['inside', 'Dalam', 'Inside: seluruh garis di dalam bentuk'], ['outside', 'Luar', 'Outside: seluruh garis di luar bentuk']];
      const GEOM = ['d', 'x', 'y', 'width', 'height', 'rx', 'ry', 'cx', 'cy', 'r', 'x1', 'y1', 'x2', 'y2', 'points'];
      const LAYER = [['back', 'Belakang', 'Di belakang semua isi: garis tidak menimpa bentuk lain (seperti outline stiker)'], ['front', 'Depan', 'Di depan: garis digambar bersama bentuknya, bisa menimpa bentuk di bawahnya']];
      const STROKE_PROPS = ['stroke', 'stroke-width', 'stroke-opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset', 'vector-effect'];
      const factor = (pos) => (pos === 'inside' || pos === 'outside' ? 2 : 1);
      const posOf = (el) => el.getAttribute('data-kd-pos') || 'center';

      function rootOf(el) {
        let r = el;
        while (r.parentNode && r.parentNode.nodeType === 1) r = r.parentNode;
        return r;
      }

      /** Posisi dalam: potong garis dengan bentuknya sendiri (clipPath di <defs> ikon). */
      function setClip(item, el, on) {
        const root = rootOf(el);
        const old = el.getAttribute('data-kd-clip');
        if (!on) {
          if (old) {
            const cp = root.querySelector(`[id="${old}"]`);
            if (cp) cp.remove();
            el.removeAttribute('data-kd-clip');
            const prev = el.getAttribute('data-kd-clip-prev');
            if (prev) el.setAttribute('clip-path', prev);
            else el.removeAttribute('clip-path');
            el.removeAttribute('data-kd-clip-prev');
          }
          return;
        }
        if (old && root.querySelector(`[id="${old}"]`)) return;
        let defs = [...root.children].find((c) => c.localName === 'defs');
        if (!defs) {
          defs = el.ownerDocument.createElementNS(SVG_NS, 'defs');
          root.insertBefore(defs, root.firstChild);
        }
        let n = 1;
        const base = `kd${item.id}-kdpos`;
        while (root.querySelector(`[id="${base}${n}"]`)) n++;
        const cp = el.ownerDocument.createElementNS(SVG_NS, 'clipPath');
        cp.setAttribute('id', `${base}${n}`);
        cp.setAttribute('clipPathUnits', 'userSpaceOnUse');
        const geo = el.ownerDocument.createElementNS(SVG_NS, el.localName);
        GEOM.forEach((a) => { if (el.hasAttribute(a)) geo.setAttribute(a, el.getAttribute(a)); });
        const rule = el.getAttribute('fill-rule') || el.style.getPropertyValue('fill-rule');
        if (rule) geo.setAttribute('clip-rule', rule);
        cp.appendChild(geo);
        defs.appendChild(cp);
        if (el.hasAttribute('clip-path')) el.setAttribute('data-kd-clip-prev', el.getAttribute('clip-path'));
        el.setAttribute('clip-path', `url(#${base}${n})`);
        el.setAttribute('data-kd-clip', `${base}${n}`);
      }

      /* ---------- lapisan garis: di belakang semua isi ---------- */

      /** Salinan garis milik bentuk ini (lapisan belakang), atau null. */
      function backOf(el) {
        const token = el && el.getAttribute && el.getAttribute('data-kd-back');
        return token ? rootOf(el).querySelector(`[data-kd-backof="${token}"]`) : null;
      }

      /** Gabungan transform dari grup induk sampai bentuk (agar salinan di lapisan bawah tetap di posisi sama). */
      function chain(el, root) {
        const list = [];
        for (let n = el; n && n !== root; n = n.parentNode) {
          const t = n.getAttribute && n.getAttribute('transform');
          if (t) list.unshift(t);
        }
        return list.join(' ');
      }

      const backGroup = (root) => [...root.children].find((c) => c.hasAttribute('data-kd-backgroup')) || null;

      /** Setelah bentuk berubah: salinan ikut geometri & urutan bentuk aslinya; yatim dibuang. */
      function syncBack(root) {
        const group = backGroup(root);
        const originals = [...root.querySelectorAll('[data-kd-back]')];
        if (!group) {
          originals.forEach((el) => { el.removeAttribute('data-kd-back'); el.removeAttribute('data-kd-layer'); });
          return;
        }
        const byToken = new Map(originals.map((el) => [el.getAttribute('data-kd-back'), el]));
        [...group.children].forEach((c) => {
          const el = byToken.get(c.getAttribute('data-kd-backof'));
          if (!el) return c.remove();
          GEOM.forEach((a) => { if (el.hasAttribute(a)) c.setAttribute(a, el.getAttribute(a)); else c.removeAttribute(a); });
          const t = chain(el, root);
          if (t) c.setAttribute('transform', t);
          else c.removeAttribute('transform');
        });
        originals.forEach((el) => {
          const c = group.querySelector(`[data-kd-backof="${el.getAttribute('data-kd-back')}"]`);
          if (c) group.appendChild(c);
        });
        if (!group.firstElementChild) group.remove();
        if (root.contains(group) && group !== root.firstElementChild) {
          const defs = [...root.children].find((c) => c.localName === 'defs');
          root.insertBefore(group, defs ? defs.nextSibling : root.firstChild);
        }
      }

      /** Gaya garis yang benar-benar tampil, per urutan bentuk (dibaca di wadah tersembunyi). */
      function computedStrokes(item) {
        const host = svgEl(document, 'svg', { style: 'position:absolute;left:-9999px;top:0;width:10px;height:10px;visibility:hidden' });
        const clone = document.importNode(item.node, true);
        host.appendChild(clone);
        document.body.appendChild(host);
        try {
          return Cleanup.shapesOf(clone).map((el) => {
            const cs = getComputedStyle(el);
            const out = {};
            STROKE_PROPS.forEach((p) => { out[p] = cs.getPropertyValue(p); });
            return out;
          });
        } finally {
          host.remove();
        }
      }

      function toBack(item, el, cs) {
        const root = item.node;
        let group = backGroup(root);
        if (!group) {
          group = el.ownerDocument.createElementNS(SVG_NS, 'g');
          group.setAttribute('data-kd-backgroup', '1');
          const defs = [...root.children].find((c) => c.localName === 'defs');
          root.insertBefore(group, defs ? defs.nextSibling : root.firstChild);
        }
        let n = 1;
        while (root.querySelector(`[data-kd-back="b${n}"]`)) n++;
        const token = `b${n}`;
        const c = el.ownerDocument.createElementNS(SVG_NS, el.localName);
        GEOM.forEach((a) => { if (el.hasAttribute(a)) c.setAttribute(a, el.getAttribute(a)); });
        const t = chain(el, root);
        if (t) c.setAttribute('transform', t);
        c.setAttribute('data-kd-backof', token);
        c.style.setProperty('fill', 'none');
        const paint = Outline.paintOf(cs.stroke);
        if (paint) c.style.setProperty('stroke', paint.paint);
        const so = (paint ? paint.alpha : 1) * (cs['stroke-opacity'] === '' ? 1 : parseFloat(cs['stroke-opacity']));
        if (so < 1) c.style.setProperty('stroke-opacity', String(round(so, 4)));
        c.style.setProperty('stroke-width', String(parseFloat(cs['stroke-width']) || 1));
        ['stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-dashoffset'].forEach((p) => { if (cs[p]) c.style.setProperty(p, cs[p]); });
        if (cs['stroke-dasharray'] && cs['stroke-dasharray'] !== 'none') c.style.setProperty('stroke-dasharray', cs['stroke-dasharray']);
        if (cs['vector-effect'] === 'non-scaling-stroke') c.style.setProperty('vector-effect', 'non-scaling-stroke');
        group.appendChild(c);
        el.setAttribute('data-kd-layer', 'back');
        el.setAttribute('data-kd-back', token);
        el.style.setProperty('stroke', 'none');
        el.style.removeProperty('paint-order');
      }

      function toFront(el) {
        const c = backOf(el);
        if (c) {
          STROKE_PROPS.forEach((p) => {
            const v = c.style.getPropertyValue(p);
            if (v) el.style.setProperty(p, v);
            else if (p !== 'stroke') el.style.removeProperty(p);
          });
          const group = c.parentNode;
          c.remove();
          if (group && !group.firstElementChild) group.remove();
        }
        el.removeAttribute('data-kd-back');
        el.removeAttribute('data-kd-layer');
        if (posOf(el) === 'outside') el.style.setProperty('paint-order', 'stroke fill markers');
      }

      /** Pindahkan garis bentuk ber-isi ke lapisan belakang / depan (satu langkah urungkan per ikon). */
      function setLayer(targets, layer) {
        commit();
        if (Designer.busy() || Outline.busy()) return View.toast('Tunggu proses yang sedang berjalan selesai.', 'error');
        const items = [];
        targets.forEach(({ item, indices }) => {
          const info = new Map(Outline.scan(item).map((x) => [x.index, x]));
          const want = indices.filter((i) => {
            const x = info.get(i);
            return x && x.fill && x.pos !== 'inside' && x.layer !== layer;
          });
          if (!want.length) return;
          History.label(layer === 'back' ? 'Garis ke belakang' : 'Garis ke depan');
          Cleanup.edit(item, () => {
            const css = layer === 'back' ? computedStrokes(item) : [];
            const els = Cleanup.shapesOf(item.node);
            want.forEach((i) => {
              if (!els[i]) return;
              if (layer === 'back') toBack(item, els[i], css[i]);
              else toFront(els[i]);
            });
          });
          items.push(item);
        });
        if (!items.length) return;
        Cleanup.commit(items);
        Inspect.refresh();
      }

      /** Buang semua jejak posisi (dipakai saat garis diubah jadi fill). */
      function clearPos(item, el) {
        setClip(item, el, false);
        el.removeAttribute('data-kd-pos');
        el.style.removeProperty('paint-order');
      }

      const JOINS = [['miter', 'Runcing', 'M4 18L12 6l8 12'], ['round', 'Bulat', 'M4 18L12 6l8 12'], ['bevel', 'Potong', 'M4 18L12 6l8 12']];

      /** Target: [{ item, indices }] — indices = urutan bentuk (Cleanup.shapesOf). */
      function allTargets(items) {
        return items.map((item) => ({ item, indices: Outline.scan(item).map((s) => s.index) })).filter((t) => t.indices.length);
      }

      /** Ringkasan nilai garis target (null = campuran). */
      function summary(targets) {
        const list = [];
        targets.forEach(({ item, indices }) => {
          const by = new Map(Outline.scan(item).map((s) => [s.index, s]));
          indices.forEach((i) => { if (by.has(i)) list.push(by.get(i)); });
        });
        const same = (fn) => {
          const vals = [...new Set(list.map(fn))];
          return vals.length === 1 ? vals[0] : null;
        };
        const styleOf = (s) => (!s.dash ? 'solid' : s.dash[0] === 0 ? 'dot' : 'dash');
        const dashed = list.find((s) => s.dash);
        return {
          count: list.length,
          shapes: targets.reduce((n, t) => n + t.indices.length, 0),
          width: list.length ? same((s) => round(s.shown, 2)) : 1,
          pos: (() => { const v = [...new Set(list.filter((s) => s.fill).map((s) => s.pos))]; return v.length === 1 ? v[0] : null; })(),
          canPos: list.some((s) => s.fill),
          layer: (() => { const v = [...new Set(list.filter((s) => s.fill && s.pos !== 'inside').map((s) => s.layer))]; return v.length === 1 ? v[0] : null; })(),
          canLayer: list.some((s) => s.fill && s.pos !== 'inside'),
          color: list.length ? same((s) => (/^#/.test(s.paint) ? s.paint : '')) : '#000000',
          style: list.length ? same(styleOf) : 'solid',
          dash: dashed ? round(dashed.dash[0] || 4, 2) : 4,
          gap: dashed ? round(dashed.dash[1] === undefined ? dashed.dash[0] : dashed.dash[1], 2) : 3,
          cap: list.length ? same((s) => s.cap) : 'butt',
          join: list.length ? same((s) => s.join) : 'miter'
        };
      }

      /**
       * Perubahan → operasi per elemen: { k: 'style' | 'attr' | 'clip', n, v }.
       * ctx = { has (sudah bergaris), fill (punya isi), pos (posisi sekarang), width (tebal tampil sekarang) }.
       */
      function opsFor(change, ctx, sum) {
        const out = [];
        const st = (n, v) => out.push({ k: 'style', n, v });
        const f = factor(ctx.pos);
        if ('width' in change) {
          const w = Math.max(0, Number(change.width) || 0);
          if (w === 0) st('stroke', 'none');
          else if (!ctx.has) st('stroke', sum.color || '#000000');
          st('stroke-width', String(round(w * f, 4)));
        }
        if ('color' in change) {
          st('stroke', change.color);
          if (!ctx.has) st('stroke-width', String(round((sum.width || 1) * f, 4)));
        }
        if ('pos' in change && ctx.fill && ctx.has) {
          const pos = change.pos;
          st('stroke-width', String(round(ctx.width * factor(pos), 4)));
          out.push({ k: 'attr', n: 'data-kd-pos', v: pos === 'center' ? null : pos });
          st('paint-order', pos === 'outside' ? 'stroke fill markers' : null);
          out.push({ k: 'clip', n: 'clip', v: pos === 'inside' });
        }
        if ('style' in change) {
          const d = Math.max(0, Number(change.dash) || 0), g = Math.max(0, Number(change.gap) || 0);
          if (change.style === 'solid') st('stroke-dasharray', 'none');
          else if (change.style === 'dot') {
            st('stroke-dasharray', `0 ${g || 3}`);
            st('stroke-linecap', 'round');
          } else st('stroke-dasharray', `${d || 4} ${g || 3}`);
        }
        if ('cap' in change) st('stroke-linecap', change.cap);
        if ('join' in change) st('stroke-linejoin', change.join);
        return out;
      }

      function runOp(item, el, op, live) {
        const back = backOf(el);
        if (op.k === 'style') {
          if (back && op.n === 'paint-order') return; // lapisan belakang: isi semua bentuk sudah di atas garis
          const tgt = back && /^stroke/.test(op.n) ? back : el;
          if (op.v === null || op.v === '') tgt.style.removeProperty(op.n);
          else tgt.style.setProperty(op.n, op.v, live && op.n === 'stroke' ? 'important' : '');
        } else if (op.k === 'attr') {
          if (op.v === null) el.removeAttribute(op.n);
          else el.setAttribute(op.n, op.v);
        } else if (op.k === 'clip' && !back) setClip(item, el, op.v);
      }

      /** Terapkan perubahan. live = sedang menggeser (simpan riwayat sekali, tulis file saat commit). */
      function apply(targets, change, live) {
        if (!targets.length) return;
        if (Designer.busy() || Outline.busy()) return View.toast('Tunggu proses yang sedang berjalan selesai.', 'error');
        if (change.pos === 'inside') setLayer(targets, 'front'); // garis dalam tidak keluar dari bentuknya
        if (change.pos === 'outside') {
          applyNow(targets, change, false);
          return setLayer(targets, 'back'); // luar: otomatis di belakang semua isi
        }
        applyNow(targets, change, live);
      }

      function applyNow(targets, change, live) {
        const sum = summary(targets);
        targets.forEach(({ item, indices }) => {
          if (!session.has(item)) {
            History.label('Ubah garis');
            Cleanup.begin(item);
            Colors.sync(); // warna yang sedang diubah tetap tampil selama mengedit
            session.set(item, new Map());
          }
          const edits = session.get(item);
          const info = new Map(Outline.scan(item).map((x) => [x.index, x]));
          const els = Cleanup.shapesOf(item.node);
          indices.forEach((i) => {
            const el = els[i];
            if (!el) return;
            const s0 = info.get(i);
            const pos = posOf(el);
            const src = backOf(el) || el;
            const drawn = parseFloat(src.style.getPropertyValue('stroke-width'));
            const ctx = {
              has: !!s0 || (src.style.getPropertyValue('stroke') && src.style.getPropertyValue('stroke') !== 'none'),
              fill: s0 ? s0.fill : false,
              pos,
              width: (Number.isFinite(drawn) ? drawn : s0 ? s0.width : 1) / factor(pos)
            };
            if (!edits.has(el)) edits.set(el, new Map());
            opsFor(change, ctx, sum).forEach((op) => {
              edits.get(el).set(`${op.k}:${op.n}`, op);
              runOp(item, el, op, true);
            });
          });
        });
        if (live) {
          if (!frame) {
            frame = requestAnimationFrame(() => {
              frame = 0;
              session.forEach((_, item) => Preview.refreshArtwork(item));
              Inspect.refresh();
            });
          }
          return;
        }
        commit();
      }

      /** Tulis perubahan ke file ikon (bisa diurungkan) lalu render ulang. */
      function commit() {
        if (!session.size) return;
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        const items = [...session.keys()];
        session.forEach((edits, item) => {
          Colors.forget(item);
          edits.forEach((ops, el) => ops.forEach((op) => runOp(item, el, op, false)));
          Cleanup.end(item);
        });
        session.clear();
        Cleanup.commit(items);
        Inspect.refresh();
      }

      const live = () => session.size > 0;

      /* ---------- tampilan kontrol (dipakai kartu utama & Periksa detail) ---------- */

      const seg = (key, list, active, glyph, full) => `<div class="${full ? 'flex w-full' : 'inline-flex'} rounded-lg border border-kd-line bg-white p-0.5" role="group">${list.map(([v, label, d]) => `
        <button type="button" data-stk="${key}" data-value="${v}" aria-pressed="${active === v}" title="${glyph ? label : d || label}"
          class="inline-flex items-center ${full ? 'flex-1 min-w-0 justify-center' : ''} gap-1 h-7 px-2 rounded-md text-[11px] font-bold ${active === v ? 'bg-kd-brand-light text-kd-brand-dark' : 'text-kd-ink hover:text-kd-brand'}">${glyph ? `<svg viewBox="0 0 20 24" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="${key === 'cap' ? v : 'butt'}" stroke-linejoin="${key === 'join' ? v : 'miter'}"><path d="${d}"/></svg>` : ''}<span class="${glyph && !full ? 'max-sm:hidden' : 'truncate'}">${label}</span></button>`).join('')}</div>`;

      const field = 'h-8 rounded-md border border-kd-line px-2 text-xs font-semibold text-kd-ink bg-white outline-none focus:border-kd-brand focus:ring-2 focus:ring-kd-brand/20';

      /** Varian panel samping Periksa detail (lebar 300px): satu kolom, label di atas, kontrol selebar panel. */
      function controlsCompact(sum) {
        const color = sum.color || '#000000';
        const maxW = Math.max(20, Math.ceil((sum.width || 1) * 2));
        const head = (text, note) => `<div class="flex items-baseline justify-between gap-2 mb-1"><span class="text-[11px] font-bold text-kd-muted">${text}</span>${note ? `<span class="text-[10px] text-kd-muted truncate">${note}</span>` : ''}</div>`;
        return `
          <div class="space-y-3 text-xs">
            <div>
              ${head('Warna')}
              <div class="flex items-center gap-2">
                <label class="relative w-8 h-8 shrink-0 rounded-lg border border-kd-line cursor-pointer overflow-hidden ${sum.color === null ? 'kd-checker' : ''}" style="${sum.color === null ? '' : `background:${color}`}" title="Klik untuk mengubah warna garis">
                  <input type="color" data-stk="color" value="${color}" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Warna garis">
                </label>
                <input type="text" data-stk="hex" value="${sum.color === null ? '' : color.toUpperCase()}" placeholder="Campur" title="Campuran: tiap garis beda warna" maxlength="7" spellcheck="false" aria-label="Kode warna garis" class="${field} min-w-0 flex-1 font-mono uppercase">
              </div>
            </div>
            <div>
              ${head('Tebal')}
              <div class="flex items-center gap-2">
                <input type="range" data-stk="width-range" min="0" max="${maxW}" step="0.5" value="${sum.width === null ? 1 : sum.width}" aria-label="Tebal garis" class="min-w-0 flex-1 accent-[#2563EB]">
                <input type="number" data-stk="width" min="0" step="0.5" value="${sum.width === null ? '' : sum.width}" placeholder="Campur" title="Campuran: tiap garis beda tebal" aria-label="Tebal garis (angka)" class="${field} w-16 shrink-0">
              </div>
            </div>
            ${sum.canPos ? `<div title="Untuk bentuk yang punya isi (fill) + garis">${head('Posisi', 'bentuk ber-fill')}${seg('pos', POS, sum.pos, false, true)}</div>` : ''}
            ${sum.canLayer ? `<div title="Belakang = garis di bawah semua isi, tidak menimpa bentuk lain">${head('Lapisan', 'Belakang = tidak menimpa isi')}${seg('layer', LAYER, sum.layer, false, true)}</div>` : ''}
            <div>
              ${head('Gaya')}
              ${seg('style', STYLE, sum.style, false, true)}
              ${sum.style === 'dash' || sum.style === 'dot' ? `<div class="grid grid-cols-2 gap-2 mt-2">
                ${sum.style === 'dash' ? `<label class="flex items-center gap-1.5 text-kd-muted">Garis <input type="number" data-stk="dash" min="0" step="0.5" value="${sum.dash}" class="${field} min-w-0 flex-1"></label>` : '<span></span>'}
                <label class="flex items-center gap-1.5 text-kd-muted">Jarak <input type="number" data-stk="gap" min="0" step="0.5" value="${sum.gap}" class="${field} min-w-0 flex-1"></label>
              </div>` : ''}
            </div>
            <div>${head('Ujung')}${seg('cap', CAPS, sum.cap, true, true)}</div>
            <div>${head('Sudut')}${seg('join', JOINS, sum.join, true, true)}</div>
          </div>`;
      }

      function controls(sum) {
        const color = sum.color || '#000000';
        const maxW = Math.max(20, Math.ceil((sum.width || 1) * 2));
        return `
          <div class="grid sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
            <div class="flex items-center gap-2">
              <span class="w-14 shrink-0 text-kd-muted">Warna</span>
              <label class="relative w-8 h-8 shrink-0 rounded-lg border border-kd-line cursor-pointer overflow-hidden ${sum.color === null ? 'kd-checker' : ''}" style="${sum.color === null ? '' : `background:${color}`}" title="Klik untuk mengubah warna garis">
                <input type="color" data-stk="color" value="${color}" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Warna garis">
              </label>
              <input type="text" data-stk="hex" value="${sum.color === null ? '' : color.toUpperCase()}" placeholder="Campur" title="Campuran: tiap garis beda warna" maxlength="7" spellcheck="false" aria-label="Kode warna garis" class="${field} w-[92px] font-mono uppercase">
            </div>
            <div class="flex items-center gap-2">
              <span class="w-14 shrink-0 text-kd-muted">Tebal</span>
              <input type="range" data-stk="width-range" min="0" max="${maxW}" step="0.5" value="${sum.width === null ? 1 : sum.width}" aria-label="Tebal garis" class="min-w-0 flex-1 accent-[#2563EB]">
              <input type="number" data-stk="width" min="0" step="0.5" value="${sum.width === null ? '' : sum.width}" placeholder="Campur" title="Campuran: tiap garis beda tebal" aria-label="Tebal garis (angka)" class="${field} w-20">
            </div>
            ${sum.canPos ? `<div class="flex flex-wrap items-center gap-2 sm:col-span-2">
              <span class="w-14 shrink-0 text-kd-muted">Posisi</span>
              ${seg('pos', POS, sum.pos)}
              <span class="text-[11px] text-kd-muted">untuk bentuk yang punya isi (fill) + garis</span>
            </div>` : ''}
            ${sum.canLayer ? `<div class="flex flex-wrap items-center gap-2 sm:col-span-2">
              <span class="w-14 shrink-0 text-kd-muted">Lapisan</span>
              ${seg('layer', LAYER, sum.layer)}
              <span class="text-[11px] text-kd-muted">Belakang = garis di bawah semua isi, tidak menimpa bentuk lain</span>
            </div>` : ''}
            <div class="flex flex-wrap items-center gap-2 sm:col-span-2">
              <span class="w-14 shrink-0 text-kd-muted">Gaya</span>
              ${seg('style', STYLE, sum.style)}
              ${sum.style === 'dash' || sum.style === 'dot' ? `
                ${sum.style === 'dash' ? `<label class="inline-flex items-center gap-1 text-kd-muted">Garis <input type="number" data-stk="dash" min="0" step="0.5" value="${sum.dash}" class="${field} w-16"></label>` : ''}
                <label class="inline-flex items-center gap-1 text-kd-muted">Jarak <input type="number" data-stk="gap" min="0" step="0.5" value="${sum.gap}" class="${field} w-16"></label>` : ''}
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="w-14 shrink-0 text-kd-muted">Ujung</span>
              ${seg('cap', CAPS, sum.cap, true)}
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="w-14 shrink-0 text-kd-muted">Sudut</span>
              ${seg('join', JOINS, sum.join, true)}
            </div>
          </div>`;
      }

      /** Hubungkan kontrol di dalam `box` ke daftar target (dibaca ulang tiap perubahan). */
      function wire(box, getTargets) {
        if (box.dataset.stkWired) return;
        box.dataset.stkWired = '1';
        const read = (key) => { const el = box.querySelector(`[data-stk="${key}"]`); return el ? el.value : ''; };
        const run = (change, isLive) => apply(getTargets(), change, isLive);
        box.addEventListener('click', (e) => {
          const b = e.target.closest('[data-stk][data-value]');
          if (!b) return;
          const key = b.dataset.stk, value = b.dataset.value;
          if (key === 'layer') return setLayer(getTargets(), value);
          if (key === 'style') run({ style: value, dash: read('dash') || 4, gap: read('gap') || 3 });
          else run({ [key]: value });
        });
        box.addEventListener('input', (e) => {
          const key = e.target.dataset.stk;
          if (key === 'width-range') {
            const num = box.querySelector('[data-stk="width"]');
            if (num) num.value = e.target.value;
            run({ width: e.target.value }, true);
          } else if (key === 'color') {
            const label = e.target.closest('label');
            label.style.background = e.target.value;
            label.classList.remove('kd-checker');
            box.querySelector('[data-stk="hex"]').value = e.target.value.toUpperCase();
            run({ color: e.target.value }, true);
          }
        });
        box.addEventListener('change', (e) => {
          const key = e.target.dataset.stk;
          if (key === 'width-range' || key === 'color') return commit();
          if (key === 'width') {
            if (e.target.value === '') return;
            run({ width: e.target.value });
          } else if (key === 'hex') {
            const m = String(e.target.value).trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
            if (!m) return View.toast('Kode warna tidak valid. Contoh: #31353B', 'error');
            const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
            run({ color: `#${h.toLowerCase()}` });
          } else if (key === 'dash' || key === 'gap') {
            const style = box.querySelector('[data-stk="style"][aria-pressed="true"]');
            run({ style: style ? style.dataset.value : 'dash', dash: read('dash'), gap: read('gap') });
          }
        });
      }

      /* ---------- kartu utama (massal) ---------- */

      /** Tab Warna ikon / Garis (stroke). force: true = tab Garis, false = tab Warna. */
      function toggle(force) {
        if (live()) commit();
        open = typeof force === 'boolean' ? force : !open;
        render();
      }

      function render() {
        const panel = $('#kd-tabpanel-stroke');
        if (!panel || live()) return;
        const items = scopeItems();
        const targets = allTargets(items);
        const sum = summary(targets);
        const count = $('#kd-stk-count');
        count.textContent = targets.length ? `${sum.count}` : '0';
        count.className = `${CLS.chip} !py-0.5 ${targets.length ? '!bg-[#FFF5E6] !text-[#AA5A00]' : ''}`;
        count.title = targets.length ? `${sum.count} garis (stroke) di ${targets.length} ikon` : 'Tidak ada garis';
        [['colors', !open], ['stroke', open]].forEach(([key, on]) => {
          const tab = $(`#kd-tab-${key}`);
          tab.setAttribute('aria-selected', String(on));
          tab.tabIndex = on ? 0 : -1;
          tab.className = `inline-flex items-center gap-2 min-w-0 -mb-px px-2.5 sm:px-3 py-2.5 border-b-2 text-sm sm:text-[15px] font-bold transition-colors ${on ? 'border-kd-brand text-kd-ink' : 'border-transparent text-kd-muted hover:text-kd-ink'}`;
          $(`#kd-tabpanel-${key}`).classList.toggle('hidden', !on);
        });
        if (!open) return;
        panel.innerHTML = !targets.length
          ? `<p class="text-xs text-kd-muted">Tidak ada garis (stroke) di ikon — semua bentuk sudah berupa fill. Untuk menambah garis di bentuk tertentu, buka <b>Periksa detail</b> → <b>Garis</b>.</p>`
          : `<p class="text-xs text-kd-muted mb-3">Berlaku ke <b class="text-kd-ink">${sum.count} garis di ${targets.length} ikon</b>. Untuk garis tertentu saja, buka <b>Periksa detail</b> → <b>Garis</b> lalu klik garisnya.</p>
            <div id="kd-stk-controls">${controls(sum)}</div>
            <div class="flex flex-wrap items-center gap-2 mt-3">
              <span class="flex-1"></span>
              ${Outline.button(null, 'Ubah semua garis ke fill')}
            </div>`;
        const ctl = $('#kd-stk-controls');
        if (ctl) wire(ctl, () => allTargets(scopeItems()));
      }

      /* ---------- panel di Periksa detail ---------- */

      /** item = ikon yang dibuka; picked = urutan bentuk yang dipilih (kosong = semua garis ikon ini). */
      function renderInspect(box, item, picked) {
        if (!box || live()) return;
        const targets = !item ? [] : picked.length ? [{ item, indices: picked }] : allTargets([item]);
        const sum = summary(targets);
        const noStroke = picked.length && !sum.count;
        const hint = !item ? '' : picked.length
          ? (noStroke ? `${picked.length} bentuk dipilih — belum bergaris. Atur tebal / warna untuk menambahkan garis.` : `${picked.length} bentuk dipilih (merah). Aktifkan "Pilih banyak" (atau Shift+klik) untuk menambah; "Batal pilih" untuk kembali ke semua garis.`)
          : targets.length ? `Berlaku ke semua ${sum.count} garis di ikon ini. Klik garis tertentu untuk mengedit itu saja.` : 'Ikon ini tidak punya garis. Klik bentuk untuk menambahkan garis.';
        box.innerHTML = `<p class="text-[11px] font-bold text-kd-ink mb-1">Garis (stroke)</p><p class="text-[11px] text-kd-muted mb-3">${hint}</p>${targets.length || picked.length ? `<div data-stk-box>${controlsCompact(sum)}</div>` : ''}`;
        const ctl = box.querySelector('[data-stk-box]');
        if (ctl) wire(ctl, () => (picked.length ? [{ item, indices: picked }] : allTargets([item])));
      }

      return { toggle, render, renderInspect, commit, live, clearPos, backOf, syncBack, isOpen: () => open };
    })();

    /* =====================================================================
     * 8c. MODE DESAINER — ganti nama, cek error, kirim & revisi file di Drive
     *     Semua aksi tulis lewat Apps Script; server memeriksa sesi login
     *     Supabase + ID proyek, jadi hanya folder milik proyek ini yang bisa diubah.
     * ===================================================================== */
    const Designer = (() => {
      const REVISI = ' (revisi)';
      const BACKGROUNDS = [
        { value: 'checker', label: 'Transparan' },
        { value: '#FFFFFF', label: 'Putih' },
        { value: '#000000', label: 'Hitam' },
        { value: '#FF00FF', label: 'Magenta' },
        { value: '#00FF00', label: 'Hijau' }
      ];
      const TONES = {
        ok: 'text-kd-brand-dark',
        ready: 'text-kd-ink',
        queued: 'text-kd-muted',
        sending: 'text-kd-brand',
        warn: 'text-[#AA5A00]',
        error: 'text-kd-danger'
      };
      let customColor = '#3B82F6';

      const dz = () => state.dz;
      const isDesigner = () => state.mode === 'designer';
      const byId = (id) => state.items.find((it) => String(it.id) === String(id));

      /** Huruf kecil, tanpa karakter terlarang nama file, spasi dirapikan. */
      const cleanPart = (s) => String(s || '').toLowerCase()
        .replace(/[\\/:*?"<>|#%{}~&]+/g, ' ').replace(/\s+/g, ' ').trim();
      const stem = (name) => String(name || '').replace(/\.svg$/i, '');
      const baseOf = (name) => stem(name).replace(/\s*\(revisi\)\s*$/i, '').trim();

      /** Nama tema & style; "Search Bar (glyph)" → tema "search bar", style "glyph". */
      function parts() {
        const p = state.project || {};
        let theme = String(p.title || '');
        let style = String(p.style || '');
        const m = theme.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
        if (m) {
          theme = m[1];
          if (!style) style = m[2];
        }
        return { theme: cleanPart(theme), style: cleanPart(style), designer: cleanPart(p.designer) };
      }

      /** {nomor urut} {nama tema} {style} {nama desainer} [+ " (revisi)"] — tanpa .svg */
      function formatName(index, item) {
        const { theme, style, designer } = parts();
        const base = [String(index + 1), theme, style, designer].filter(Boolean).join(' ');
        return item && item.replaceOf ? base + REVISI : base;
      }

      const orderKey = () => state.items.map((it) => it.id).join(',');
      /** Rotasi/flip ikut tersimpan ke file; tanpa transform, file asli dikirim apa adanya. */
      const transformKey = (item) => (item.rotation || item.flipX || item.flipY
        ? `${item.rotation || 0}|${item.flipX}|${item.flipY}|${state.settings.trim}`
        : 'asli');

      /** Sidik isi file (FNV-1a) untuk mendeteksi file duplikat. */
      function hashOf(item) {
        if (!item.hash) {
          const s = String(item.text || '').replace(/\s+/g, ' ').trim();
          let h = 0x811c9dc5;
          for (let i = 0; i < s.length; i++) {
            h ^= s.charCodeAt(i);
            h = Math.imul(h, 0x01000193);
          }
          item.hash = `${(h >>> 0).toString(16)}:${s.length}`;
        }
        return item.hash;
      }

      /** Warna dengan alpha (rgba/hsla, #RRGGBBAA) atau "transparent" pada fill/stroke. */
      function hasAlphaColor(text) {
        const src = String(text || '');
        for (const m of src.matchAll(/(?:rgba|hsla)\(([^)]*)\)/gi)) {
          const a = m[1].split(/[\s,/]+/).filter(Boolean)[3];
          if (a !== undefined && (a.endsWith('%') ? parseFloat(a) / 100 : parseFloat(a)) < 1) return true;
        }
        for (const m of src.matchAll(/(?:fill|stroke|stop-color|color)\s*[:=]\s*["']?\s*#([0-9a-f]{8}|[0-9a-f]{4})\b/gi)) {
          const alpha = m[1].length === 8 ? m[1].slice(6) : m[1].slice(3);
          if (!/^f+$/i.test(alpha)) return true;
        }
        return /(?:fill|stroke|stop-color)\s*[:=]\s*["']?\s*transparent/i.test(src);
      }

      const needsSync = (item) => !item.driveId || !!item.replaceOf
        || item.fileName !== item.driveName || transformKey(item) !== item.syncedTransform
        || Colors.keyOf(item) !== (item.syncedColors || '') || !!item.alphaFixed || !!item.splitPart || !!item.geomEdited;

      /** Wajib "Ganti nama semua" setelah urutan / daftar ikon berubah. */
      const named = () => !!state.items.length && dz().namedOrder === orderKey()
        && state.items.every((it) => it.fileName);

      function issues() {
        const items = state.items;
        const list = [];
        const total = Number(state.project && state.project.total) || 0;
        if (total && items.length && items.length !== total) {
          list.push({ level: 'warn', text: `Proyek ini ${total} ikon, yang dimuat ${items.length} ikon.` });
        }

        const groups = (keyOf) => {
          const map = new Map();
          items.forEach((it, i) => {
            const key = keyOf(it);
            if (!key) return;
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(i + 1);
          });
          return [...map.entries()].filter(([, nums]) => nums.length > 1);
        };
        groups(hashOf).forEach(([, nums]) => list.push({ level: 'error', text: `File duplikat: ikon ${nums.join(' & ')} isinya sama persis.` }));
        groups((it) => it.fileName && it.fileName.toLowerCase()).forEach(([name, nums]) =>
          list.push({ level: 'error', text: `Nama "${name}.svg" dipakai ikon ${nums.join(' & ')}.` }));

        items.forEach((it, i) => {
          const notes = it.warnings.slice();
          if (!notes.includes(WARN.opacity) && hasAlphaColor(it.text)) notes.push('memakai warna transparan (rgba / alpha)');
          notes.forEach((w) => list.push({ level: 'warn', text: `Ikon ${i + 1} ${w}.`,
            fix: w === WARN.opacity || !it.warnings.includes(w) ? it.id : null, flat: w === WARN.effect ? it.id : null }));
          const strays = Cleanup.count(it);
          if (strays) list.push({ level: 'warn', text: `Ikon ${i + 1} ${Cleanup.note(strays)}.`, clean: it.id });
          const loose = Cleanup.countLines(it);
          if (loose) list.push({ level: 'warn', text: `Ikon ${i + 1} ${Cleanup.noteLines(loose)}.`, lines: it.id });
          const lines = Outline.count(it), marked = Outline.markers(it);
          if (lines || marked) list.push({ level: 'warn', text: `Ikon ${i + 1} ${Outline.note(lines, marked)}.`, stroke: lines ? it.id : null });
          if (Frame.oversized(it)) list.push({ level: 'warn', text: `Ikon ${i + 1} ${Frame.note(it)}.`, frame: it.id });
        });
        return list;
      }

      function statusOf(item) {
        const u = item.upload || {};
        if (u.status === 'sending') return { tone: 'sending', text: 'Mengirim…' };
        if (u.status === 'queued') return { tone: 'queued', text: 'Menunggu antrean' };
        if (!item.fileName) return { tone: 'warn', text: 'Belum diberi nama' };
        if (!needsSync(item)) return { tone: 'ok', text: u.status === 'done' ? 'Terkirim ke Drive' : 'Sudah ada di Drive' };
        if (u.status === 'error') return { tone: 'error', text: `Gagal: ${u.message}` };
        if (item.replaceOf) return { tone: 'ready', text: `Revisi — menggantikan ${item.replaceOf.name}.svg` };
        if (item.splitPart) return { tone: 'ready', text: `Hasil pisah layer — menimpa ${item.driveName}.svg` };
        return { tone: 'ready', text: item.driveId ? 'Ada perubahan — siap dikirim' : 'Siap dikirim' };
      }

      /* ---------- render ---------- */

      function renderBackground() {
        const current = state.background;
        const swatch = (b) => {
          const active = current === b.value;
          return `
            <button type="button" data-action="dz-bg" data-bg="${b.value}" aria-pressed="${active}" title="${b.label}" aria-label="Latar ${b.label}"
              class="inline-flex items-center gap-1.5 h-8 px-2 sm:px-2.5 rounded-full border text-xs font-semibold transition-colors ${active ? 'border-kd-brand bg-kd-brand-light text-kd-brand-dark' : 'border-kd-line text-kd-ink hover:border-kd-brand'}">
              <span class="w-4 h-4 rounded-full border border-kd-line ${b.value === 'checker' ? 'kd-checker' : ''}" ${b.value === 'checker' ? '' : `style="background:${b.value}"`}></span><span class="${active ? '' : 'hidden sm:inline'}">${b.label}</span>
            </button>`;
        };
        const customActive = !BACKGROUNDS.some((b) => b.value === current);
        $('#kd-bg').innerHTML = `
          <span class="text-xs font-bold text-kd-ink mr-1">Latar cek:</span>
          ${BACKGROUNDS.map(swatch).join('')}
          <label title="Warna lain" class="inline-flex items-center gap-1.5 h-8 px-2 sm:px-2.5 rounded-full border text-xs font-semibold cursor-pointer ${customActive ? 'border-kd-brand bg-kd-brand-light text-kd-brand-dark' : 'border-kd-line text-kd-ink hover:border-kd-brand'}">
            <input type="color" id="kd-bg-custom" value="${customColor}" class="w-4 h-4 p-0 border-0 rounded-full bg-transparent cursor-pointer"><span class="${customActive ? '' : 'hidden sm:inline'}">Lainnya</span>
          </label>`;
      }

      function row(item, i) {
        const d = dz();
        const st = statusOf(item);
        const sending = st.tone === 'sending';
        const icons = { ok: 'check', error: 'warning', warn: 'warning' };
        const renamedOnDrive = item.driveId && item.driveName && item.fileName !== item.driveName && !item.replaceOf;
        const actions = item.driveId && !item.replaceOf ? `
            <button type="button" data-action="dz-revise" data-id="${item.id}" ${d.sending ? 'disabled' : ''}
              class="inline-flex items-center gap-1 h-8 sm:h-7 px-2 rounded-md border border-kd-brand text-kd-brand text-[11px] font-bold hover:bg-kd-brand-light disabled:opacity-40">${icon('refresh', 'w-3.5 h-3.5')}Revisi</button>
            <button type="button" data-action="dz-trash" data-id="${item.id}" ${d.sending ? 'disabled' : ''}
              class="inline-flex items-center gap-1 h-8 sm:h-7 px-2 rounded-md border border-kd-line text-kd-danger text-[11px] font-bold hover:bg-rose-50 disabled:opacity-40">${icon('trash', 'w-3.5 h-3.5')}Hapus</button>` : '';
        return `
          <div class="flex flex-wrap sm:flex-nowrap items-center gap-x-3 gap-y-2 py-2.5">
            <span class="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-lg border border-kd-line kd-checker overflow-hidden">
              <img src="${item.thumb}" alt="" class="w-full h-full object-contain p-1.5" draggable="false">
              <span class="absolute left-0.5 top-0.5 min-w-[16px] h-4 px-1 rounded-full bg-kd-brand text-white text-[9px] font-bold grid place-items-center">${i + 1}</span>
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1">
                <input type="text" data-dz-name="${item.id}" value="${escapeHtml(item.fileName || '')}" placeholder="Belum diberi nama" spellcheck="false" ${d.sending ? 'disabled' : ''}
                  class="min-w-0 flex-1 h-9 sm:h-8 rounded-md border border-kd-line px-2 text-xs max-sm:font-medium sm:font-semibold text-kd-ink outline-none focus:border-kd-brand focus:ring-2 focus:ring-kd-brand/20 disabled:bg-kd-surface" aria-label="Nama file ikon ${i + 1}">
                <span class="hidden sm:inline text-xs text-kd-muted">.svg</span>
              </div>
              <div class="mt-1 flex items-center gap-1 text-[11px] font-semibold ${TONES[st.tone]}">
                ${icons[st.tone] ? icon(icons[st.tone], 'w-3.5 h-3.5 shrink-0') : ''}<span class="truncate" title="${escapeHtml(st.text)}">${escapeHtml(st.text)}</span>
              </div>
              ${renamedOnDrive ? `<div class="text-[10px] text-kd-muted truncate">Di Drive: ${escapeHtml(item.driveName)}.svg</div>` : ''}
              ${sending ? '<div class="kd-bar-indeterminate mt-1 h-1 rounded-full bg-kd-surface"></div>' : ''}
            </div>
            ${actions ? `<div class="flex sm:flex-col gap-1.5 sm:gap-1 shrink-0 w-full sm:w-auto pl-[52px] sm:pl-0 [&>button]:flex-1 sm:[&>button]:flex-none [&>button]:justify-center">${actions}</div>` : ''}
          </div>`;
      }

      function render() {
        if (!$('#kd-dz-list')) return;
        const d = dz();
        const items = state.items;
        const ready = named();
        const list = issues();
        const errors = list.filter((x) => x.level === 'error');
        const pending = items.filter(needsSync);
        const driveReady = state.drive.status === 'success';
        const { theme, style, designer } = parts();

        renderBackground();

        $('#kd-dz-format').innerHTML = `
          <span class="block text-kd-muted">Format nama file (nomor mengikuti urutan pratinjau)</span>
          <b class="block text-kd-ink break-all">{nomor} ${escapeHtml(theme || '{tema}')} ${escapeHtml(style || '{style}')} ${escapeHtml(designer || '{desainer}')}.svg</b>
          <span class="block text-kd-muted mt-1">Contoh: <b class="text-kd-ink">${escapeHtml(formatName(0, null))}.svg</b> · revisi: <b class="text-kd-ink">${escapeHtml(formatName(0, { replaceOf: true }))}.svg</b></span>
          ${style ? '' : `<span class="flex items-center gap-1 mt-1 text-[#AA5A00] font-semibold">${icon('warning', 'w-4 h-4 shrink-0')}Style proyek tidak ditemukan — nama file tanpa style.</span>`}
          ${items.length ? `<span class="flex items-center gap-1 mt-1 font-semibold ${ready ? 'text-kd-brand-dark' : 'text-[#AA5A00]'}">${icon(ready ? 'check' : 'warning', 'w-4 h-4 shrink-0')}${ready ? 'Nama file sudah diperbarui sesuai urutan.' : 'Urutan / daftar ikon berubah — klik "Ganti nama semua" (wajib).'}</span>` : ''}`;

        $('#kd-dz-issues').innerHTML = !items.length ? '' : list.length
          ? (() => {
            const alphaAll = list.filter((x) => x.fix).length > 1 && !d.sending;
            const cleanAll = list.filter((x) => x.clean).length > 1 && !d.sending;
            const strokeAll = list.filter((x) => x.stroke).length > 1 && !d.sending;
            const linesAll = list.filter((x) => x.lines).length > 1 && !d.sending;
            const frameAll = list.filter((x) => x.frame).length > 1 && !d.sending;
            const flatAll = list.filter((x) => x.flat).length > 1 && !d.sending;
            return alphaAll || cleanAll || strokeAll || linesAll || frameAll || flatAll ? `<li class="flex flex-wrap justify-end gap-1.5">${flatAll ? Flatten.button(null, `Flatten semua (${list.filter((x) => x.flat).length})`) : ''}${alphaAll ? Alpha.button(null, 'Hilangkan semua transparansi') : ''}${cleanAll ? Cleanup.button(null, 'Bersihkan semua titik liar') : ''}${linesAll ? Cleanup.lineButton(null, 'Bersihkan semua garis liar') : ''}${strokeAll ? Outline.button(null, 'Ubah semua garis ke fill') : ''}${frameAll ? Frame.button(null, `Pangkas semua frame (${list.filter((x) => x.frame).length})`) : ''}</li>` : '';
          })()
            + list.map((x) => `<li class="flex flex-wrap items-start gap-1.5 text-xs rounded-lg px-2.5 py-1.5 ${x.level === 'error' ? 'text-kd-danger bg-rose-50 font-semibold' : 'text-[#AA5A00] bg-[#FFF5E6]'}">${icon('warning', 'w-4 h-4 shrink-0')}<span class="min-w-0 flex-1">${escapeHtml(x.text)}</span>${x.fix && !d.sending ? Alpha.button(x.fix, 'Hilangkan') : ''}${x.clean && !d.sending ? Cleanup.button(x.clean, 'Bersihkan') : ''}${x.stroke && !d.sending ? Outline.button(x.stroke, 'Ubah ke fill') : ''}${x.lines && !d.sending ? Cleanup.lineButton(x.lines, 'Bersihkan') : ''}${x.frame && !d.sending ? Frame.button(x.frame) : ''}${x.flat && !d.sending ? Flatten.button(x.flat) : ''}</li>`).join('')
          : `<li class="flex items-center gap-1.5 text-xs font-semibold text-kd-brand-dark bg-kd-brand-light rounded-lg px-2.5 py-1.5">${icon('check', 'w-4 h-4 shrink-0')}Tidak ada error: bebas transparansi, gradient, dan duplikat.</li>`;

        $('#kd-dz-list').innerHTML = items.length
          ? items.map(row).join('')
          : '<p class="py-6 text-center text-xs text-kd-muted">Belum ada ikon. Muat dari Drive atau tambah SVG manual.</p>';
        const count = $('#kd-dz-count');
        // Admin: kartu terlipat — chip oranye bila ada file yang belum sama dengan Drive
        const alert = !isDesigner() && items.length > 0 && pending.length > 0;
        count.textContent = alert ? `${pending.length} belum dikirim` : `${items.length - pending.length}/${items.length} di Drive`;
        count.classList.toggle('!bg-[#FFF5E6]', alert);
        count.classList.toggle('!text-[#AA5A00]', alert);
        renderToggle();

        const p = d.progress;
        $('#kd-dz-progress').classList.toggle('hidden', !p);
        if (p) {
          const pct = Math.round((p.done / p.total) * 100);
          $('#kd-dz-progress-text').textContent = d.sending
            ? `Mengirim ${Math.min(p.done + 1, p.total)} dari ${p.total} file…`
            : `Selesai: ${p.ok} terkirim${p.fail ? `, ${p.fail} gagal` : ''}`;
          $('#kd-dz-progress-pct').textContent = `${pct}%`;
          const bar = $('#kd-dz-bar');
          bar.style.width = `${pct}%`;
          bar.classList.toggle('bg-kd-danger', !d.sending && p.fail > 0);
          bar.classList.toggle('bg-kd-brand', d.sending || !p.fail);
        }

        const send = $('#kd-dz-send');
        // Semua file sudah di Drive → tombol berubah jadi "Selesai" (aktif, menutup modal)
        const done = items.length > 0 && !pending.length && !d.sending;
        send.dataset.action = done ? 'dz-done' : 'dz-send';
        send.innerHTML = `${icon(done ? 'check' : 'upload', 'w-4 h-4')}<span></span>`;
        send.disabled = !done && (d.sending || !items.length || !ready || errors.length > 0 || !pending.length || !driveReady);
        send.lastElementChild.textContent = done ? 'Selesai' : d.sending ? 'Mengirim…' : pending.length ? `Kirim ${pending.length} file ke Drive` : 'Kirim ke Drive';
        $('#kd-dz-rename').disabled = d.sending || !items.length;
        const failed = items.some((it) => it.upload && it.upload.status === 'error' && needsSync(it));
        $('#kd-dz-retry').classList.toggle('hidden', d.sending || !failed);

        const hint = $('#kd-dz-hint');
        const [tone, text] = !items.length ? ['muted', '']
          : !driveReady ? ['warn', 'Folder Drive belum terbaca — klik Muat ulang di bagian 1 sebelum mengirim.']
          : !ready ? ['warn', 'Klik "Ganti nama semua" dulu (wajib) sebelum mengirim.']
          : errors.length ? ['error', 'Perbaiki error di atas dulu (ganti / hapus file duplikat, nama kembar).']
          : !pending.length ? ['ok', isDesigner() ? 'Semua file sudah ada di Drive. Jika sudah lengkap, tutup lalu klik "Sudah Upload".' : 'Semua file sudah ada di Drive.']
          : ['ok', `${pending.length} file siap dikirim. Revisi: file lama dipindah ke Sampah Drive.`];
        hint.className = `mt-2 text-xs ${{ muted: 'text-kd-muted', warn: 'text-[#AA5A00] font-semibold', error: 'text-kd-danger font-semibold', ok: 'text-kd-brand-dark font-semibold' }[tone]}`;
        hint.textContent = text;
      }

      /** Admin: judul kartu jadi tombol buka/tutup; desainer: kartu selalu terbuka. */
      function renderToggle() {
        const head = $('#kd-dz-head');
        if (!head) return;
        const admin = !isDesigner();
        const open = !admin || dz().open;
        $('#kd-dz-body').classList.toggle('hidden', !open);
        head.classList.toggle('cursor-pointer', admin);
        head.classList.toggle('mb-3', open);
        if (admin) {
          head.dataset.action = 'dz-toggle';
          head.setAttribute('role', 'button');
          head.setAttribute('tabindex', '0');
          head.setAttribute('aria-expanded', String(open));
          head.title = open ? 'Tutup' : 'Buka untuk ganti nama & kirim ke Drive';
        } else {
          delete head.dataset.action;
          ['role', 'tabindex', 'aria-expanded', 'title'].forEach((a) => head.removeAttribute(a));
        }
        const chev = $('#kd-dz-chevron');
        chev.classList.toggle('hidden', !admin);
        chev.classList.toggle('rotate-180', open);
      }

      function toggle(force) {
        if (isDesigner()) return;
        dz().open = typeof force === 'boolean' ? force : !dz().open;
        renderToggle();
      }

      /* ---------- API ---------- */

      async function api(action, extra = {}) {
        let token = '';
        try {
          if (typeof supabaseClient !== 'undefined') {
            const { data } = await supabaseClient.auth.getSession();
            token = (data && data.session && data.session.access_token) || '';
          }
        } catch (err) { /* ditangani di bawah */ }
        if (!token) throw new Error('Sesi login tidak ditemukan. Silakan login ulang.');
        return DriveSource.post({ action, project_id: state.project.id, access_token: token, ...extra });
      }

      async function list() {
        const data = await api('designer_list_svg');
        if (!Array.isArray(data.files)) throw new Error('Apps Script belum diperbarui: aksi mode desainer belum di-deploy.');
        return data;
      }

      /** Tandai aset hasil muat dari Drive (nama & isi sama dengan file di Drive). */
      function adopt(asset, file) {
        asset.driveId = file.id;
        asset.driveName = stem(file.name);
        asset.fileName = asset.driveName;
        asset.syncedTransform = 'asli';
        asset.syncedColors = '';
      }

      /** Setelah memuat Drive: nama yang ada dianggap sudah sesuai urutan. */
      function loaded() {
        dz().namedOrder = orderKey();
        dz().progress = null;
      }

      /** Isi file yang dikirim: asli, atau SVG baru bila ikon diputar / dibalik. */
      function contentOf(item) {
        if (transformKey(item) === 'asli') return Colors.keyOf(item) ? Colors.serialize(item) : item.text;
        const trim = state.settings.trim;
        const width = 1 / Layout.sizeOf(item, 1, trim).scale; // lebar asli bentuk setelah diputar
        const slot = Layout.sizeOf(item, width, trim);
        const doc = document.implementation.createDocument(SVG_NS, 'svg', null);
        const root = doc.documentElement;
        root.setAttribute('version', '1.1');
        root.setAttribute('width', round(slot.w));
        root.setAttribute('height', round(slot.h));
        root.setAttribute('viewBox', `0 0 ${round(slot.w)} ${round(slot.h)}`);
        root.appendChild(buildArtwork(doc, item, slot));
        return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(doc);
      }

      /* ---------- aksi ---------- */

      function renameAll() {
        if (!state.items.length) return View.toast('Belum ada ikon untuk diganti nama.', 'error');
        const { theme, designer } = parts();
        if (!theme || !designer) return View.toast('Nama tema atau nama desainer kosong.', 'error');
        state.items.forEach((it, i) => { it.fileName = formatName(i, it); });
        dz().namedOrder = orderKey();
        render();
        View.toast(`${state.items.length} file diganti nama sesuai urutan.`);
      }

      function renameOne(id, value) {
        const item = byId(id);
        if (!item) return;
        const name = cleanPart(stem(value));
        if (name) item.fileName = name;
        else View.toast('Nama file tidak boleh kosong.', 'error');
        render();
      }

      function startRevision(id) {
        if (dz().sending) return;
        dz().revising = id;
        $('#kd-dz-revise-file').click();
      }

      async function applyRevision(file) {
        const id = dz().revising;
        dz().revising = null;
        const old = byId(id);
        if (!file || !old) return;
        if (!/\.svg$/i.test(file.name) && file.type !== 'image/svg+xml') return View.toast('Hanya file .svg yang didukung.', 'error');

        let asset;
        try {
          asset = await SvgAsset.fromFile(file);
        } catch (err) {
          return View.toast(err.message, 'error');
        }
        const index = state.items.indexOf(old);
        if (index < 0) return;
        const wasNamed = named();
        asset.replaceOf = { id: old.driveId, name: old.driveName };
        asset.fileName = `${baseOf(old.fileName || old.driveName)}${REVISI}`;
        URL.revokeObjectURL(old.thumb);
        state.items[index] = asset;
        if (state.selectedId === old.id) state.selectedId = null;
        if (wasNamed) dz().namedOrder = orderKey();
        App.refresh();
        View.toast(`Siap direvisi: ${asset.fileName}.svg — klik Kirim ke Drive.`);
      }

      async function trash(id) {
        const item = byId(id);
        if (!item || !item.driveId || dz().sending) return;
        const ok = await confirmDialog('Hapus dari Drive',
          `Pindahkan "${item.driveName}.svg" ke Sampah Google Drive?\n\nFile masih bisa dipulihkan dari Sampah Drive selama 30 hari.`);
        if (!ok) return;

        item.upload = { status: 'sending' };
        render();
        try {
          await api('designer_trash_svg', { file_id: item.driveId });
          const index = state.items.indexOf(item);
          if (index >= 0) App.removeItem(index);
          View.toast(`${item.driveName}.svg dipindah ke Sampah Drive.`);
        } catch (err) {
          item.upload = { status: 'error', message: err.message };
          render();
          View.toast(err.message, 'error');
        }
      }

      async function send(onlyFailed = false) {
        const d = dz();
        if (d.sending) return;
        if (state.drive.status !== 'success') return View.toast('Folder Drive belum terbaca. Klik Muat ulang dulu.', 'error');
        if (!named()) return View.toast('Klik "Ganti nama semua" dulu (wajib).', 'error');
        const found = issues();
        const errors = found.filter((x) => x.level === 'error');
        if (errors.length) return View.toast(errors[0].text, 'error');

        const targets = state.items.filter((it) => needsSync(it) && (!onlyFailed || (it.upload && it.upload.status === 'error')));
        if (!targets.length) return View.toast('Semua file sudah ada di Drive.');

        const warns = found.filter((x) => x.level === 'warn');
        if (warns.length) {
          const shown = warns.slice(0, 6).map((w) => `• ${w.text}`).join('\n');
          const ok = await confirmDialog('Ada peringatan',
            `${warns.length} peringatan terdeteksi:\n\n${shown}${warns.length > 6 ? '\n…' : ''}\n\nTetap kirim ke Drive?`);
          if (!ok) return;
        }

        d.sending = true;
        d.progress = { done: 0, ok: 0, fail: 0, total: targets.length };
        targets.forEach((it) => { it.upload = { status: 'queued' }; });
        render();

        for (const item of targets) {
          if (state.items.includes(item)) {
            item.upload = { status: 'sending' };
            render();
            try {
              const res = await api('designer_save_svg', {
                file_name: `${item.fileName}.svg`,
                content: contentOf(item),
                file_id: item.replaceOf ? '' : (item.driveId || ''),
                replace_file_id: item.replaceOf ? item.replaceOf.id : ''
              });
              item.driveId = res.file.id;
              item.driveName = stem(res.file.name);
              item.fileName = item.driveName;
              item.replaceOf = null;
              item.syncedTransform = transformKey(item);
              item.syncedColors = Colors.keyOf(item);
              item.alphaFixed = false;
              item.splitPart = false;
              item.geomEdited = false;
              item.upload = { status: 'done' };
              d.progress.ok++;
            } catch (err) {
              item.upload = { status: 'error', message: err.message };
              d.progress.fail++;
            }
          }
          d.progress.done++;
          render();
        }

        d.sending = false;
        render();
        const { ok, fail } = d.progress;
        View.toast(fail ? `${ok} terkirim, ${fail} gagal — klik "Kirim ulang yang gagal".` : `${ok} file terkirim ke Drive.`, fail ? 'error' : 'info');
      }

      /** Muat ulang membuang perubahan yang belum dikirim — tanyakan dulu. */
      async function confirmReload() {
        if (!isDesigner()) return true;
        if (dz().sending) {
          View.toast('Tunggu sampai pengiriman ke Drive selesai.', 'error');
          return false;
        }
        const unsent = state.items.filter(needsSync).length;
        return !unsent || confirmDialog('Muat ulang dari Drive',
          `${unsent} perubahan belum dikirim ke Drive dan akan hilang. Lanjutkan muat ulang?`);
      }

      function setBackground(value) {
        if (!value) return;
        if (value !== 'checker' && !BACKGROUNDS.some((b) => b.value === value)) customColor = value;
        state.background = value;
        Preview.sync();
        renderBackground();
      }

      function reset() {
        state.background = 'checker';
        state.dz = { namedOrder: null, sending: false, revising: null, progress: null, open: false };
      }

      return {
        render, list, adopt, loaded, reset, renameAll, renameOne, startRevision, applyRevision,
        trash, send, confirmReload, setBackground, hasAlphaColor, toggle,
        busy: () => dz().sending
      };
    })();

    /* =====================================================================
     * 9. TAMPILAN (VIEW)
     * ===================================================================== */
    const View = {
      shell() {
        return `
        <div class="bg-kd-surface w-full max-w-7xl h-full sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="kd-title">
          <header class="bg-white px-3 sm:px-5 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 border-b border-kd-line">
            <span class="hidden sm:grid w-9 h-9 shrink-0 rounded-xl bg-kd-brand text-white grid place-items-center">${icon('squares')}</span>
            <div class="min-w-0 flex-1 leading-tight">
              <h2 id="kd-title" class="font-extrabold text-base sm:text-lg text-kd-ink truncate">Penata Ikon</h2>
              <p id="kd-subtitle" class="text-xs text-kd-muted truncate">Kekal Designer</p>
            </div>
            <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button type="button" data-action="export-eps" data-export data-admin-only class="${CLS.btnOutline} max-sm:h-9 max-sm:px-2.5" title="EPS 10 untuk Shutterstock, Freepik, dll.">
                ${icon('download', 'w-4 h-4')}<span>EPS</span>
              </button>
              <button type="button" data-action="export-svg" data-export data-admin-only class="${CLS.btnPrimary} max-sm:h-9 max-sm:px-2.5" title="SVG untuk Adobe Stock">
                ${icon('download', 'w-4 h-4')}<span>SVG</span>
              </button>
              <button type="button" data-action="close" class="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg grid place-items-center text-kd-muted hover:bg-kd-surface hover:text-kd-ink transition-colors" aria-label="Tutup penata ikon">
                ${icon('close')}
              </button>
            </div>
          </header>

          <div class="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-2.5 sm:p-5">
            <div class="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[360px_minmax(0,1fr)] items-start">
              <aside class="space-y-3 sm:space-y-4 min-w-0">
                <section class="${CLS.card}">
                  <div class="flex items-center justify-between gap-2 mb-3">
                    <h3 class="${CLS.cardTitle} min-w-0"><span class="${CLS.step}">1</span>Ikon dari Google Drive</h3>
                    <a id="kd-drive-link" target="_blank" rel="noopener" class="hidden inline-flex shrink-0 items-center gap-1 text-xs font-bold text-kd-brand hover:underline">
                      ${icon('external', 'w-4 h-4')}Buka folder
                    </a>
                  </div>
                  <div id="kd-drive-status" class="rounded-xl bg-kd-surface p-3 text-xs"></div>
                  <div id="kd-split-note" class="hidden mt-3 space-y-2"></div>
                  <div class="flex items-center justify-between mt-4 mb-2">
                    <span class="text-sm font-bold text-kd-ink">Ikon dimuat <span id="kd-upload-count" class="ml-1 ${CLS.chip}"></span></span>
                    <button type="button" data-action="clear" class="inline-flex items-center gap-1 text-xs font-bold text-kd-danger hover:underline">${icon('trash', 'w-4 h-4')}Hapus semua</button>
                  </div>
                  <div id="kd-slots" class="grid gap-2"></div>
                  <label id="kd-drop" class="mt-3 flex items-center gap-3 rounded-xl border-2 border-dashed border-kd-brand/40 bg-kd-brand-light/40 px-3 py-2.5 cursor-pointer hover:bg-kd-brand-light transition-colors">
                    <span class="w-9 h-9 shrink-0 rounded-full bg-white text-kd-brand grid place-items-center shadow-kd-card">${icon('upload', 'w-4 h-4')}</span>
                    <span class="min-w-0">
                      <span class="block text-xs font-bold text-kd-ink">Tambah SVG manual</span>
                      <span id="kd-upload-hint" class="block text-[11px] text-kd-muted"></span>
                    </span>
                    <input id="kd-file" type="file" accept=".svg,image/svg+xml" multiple class="sr-only">
                  </label>
                </section>

                <section class="${CLS.card}">
                  <h3 class="${CLS.cardTitle} mb-4"><span class="${CLS.step}">2</span>Jumlah ikon per paket</h3>
                  <div id="kd-counts" class="grid grid-cols-4 gap-2"></div>
                </section>

                <section class="${CLS.card}">
                  <h3 class="${CLS.cardTitle} mb-4"><span class="${CLS.step}">3</span>Atur jarak &amp; ukuran</h3>
                  <div class="grid grid-cols-3 gap-3">
                    ${this.settingField('width', 'Lebar ikon')}
                    ${this.settingField('gap', 'Jarak antar')}
                    ${this.settingField('padding', 'Tepi frame')}
                  </div>
                  <div class="flex items-start justify-between gap-3 mt-4 p-3 rounded-xl bg-kd-surface">
                    <span>
                      <span class="block text-sm font-bold text-kd-ink">Pangkas ke batas objek</span>
                      <span class="block text-xs text-kd-muted">Ruang kosong di dalam viewBox diabaikan, jadi jarak diukur dari tepi gambar.</span>
                    </span>
                    <button type="button" id="kd-trim" role="switch" data-action="trim" class="relative shrink-0 self-center w-11 h-6 min-h-0 p-0 rounded-full transition-colors" style="min-height:24px;height:24px;width:44px;">
                      <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"></span>
                    </button>
                  </div>
                </section>

                <section class="${CLS.card}">
                  <h3 class="${CLS.cardTitle} mb-3">${icon('shapes', 'w-5 h-5 text-kd-brand')}Stiker</h3>
                  <div id="kd-sticker"></div>
                </section>
              </aside>

              <div class="space-y-3 sm:space-y-4 min-w-0">
                <section class="${CLS.card}">
                  <div class="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
                    <h3 class="${CLS.cardTitle}">${icon('eye', 'w-5 h-5 text-kd-brand')}Pratinjau</h3>
                    <div class="flex flex-wrap gap-2">
                      <span class="${CLS.chip}">Frame <b id="kd-frame-size" class="text-kd-ink"></b></span>
                      <span id="kd-grid-info" class="${CLS.chip}"></span>
                      <span class="${CLS.chip}"><span class="kd-checker w-3 h-3 rounded-sm border border-kd-line"></span>Latar transparan</span>
                      <button type="button" id="kd-outline-btn" data-action="outline" aria-pressed="false" title="Tampilkan garis bentuk saja untuk semua ikon" class="${CLS.chip} hover:text-kd-brand">${icon('outline', 'w-3.5 h-3.5')}Outline</button>
                      <button type="button" data-action="inspect" title="Zoom & periksa detail tiap ikon (atau klik dua kali ikon)" class="${CLS.chip} hover:text-kd-brand">${icon('search', 'w-3.5 h-3.5')}Periksa detail</button>
                    </div>
                  </div>
                  <div id="kd-bg" data-designer-only class="hidden flex flex-wrap items-center gap-1.5 mb-3"></div>
                  <div id="kd-stage" class="rounded-xl bg-kd-surface px-1.5 py-8 sm:p-6 flex items-center justify-center min-h-[220px] sm:min-h-[300px]"></div>
                  <div class="flex flex-wrap items-center justify-between gap-3 mt-3 sm:mt-4">
                    <p class="flex items-start gap-1.5 text-xs text-kd-muted max-w-md">
                      ${icon('cursor', 'w-4 h-4 shrink-0 text-kd-brand')}
                      <span id="kd-preview-hint"></span>
                    </p>
                    <div class="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
                      <button type="button" data-action="reset-order" class="${CLS.btnOutline} max-sm:px-2">${icon('refresh', 'w-4 h-4')}Urutan awal</button>
                      <button type="button" data-action="shuffle" class="${CLS.btnOutline} max-sm:px-2 bg-kd-brand-light">${icon('shuffle', 'w-4 h-4')}Acak urutan</button>
                    </div>
                  </div>
                  <div id="kd-item-colors" class="hidden mt-3 rounded-xl border border-kd-line bg-kd-surface/60 p-2.5 sm:p-3"></div>
                </section>

                <section class="${CLS.card}">
                  <div class="flex items-end gap-1 border-b border-kd-line mb-3 -mt-1" role="tablist" aria-label="Warna & garis ikon">
                    <button type="button" id="kd-tab-colors" data-action="kd-tab" data-tab="colors" role="tab" aria-controls="kd-tabpanel-colors" aria-selected="true"
                      class="inline-flex items-center gap-2 min-w-0 -mb-px px-2.5 sm:px-3 py-2.5 border-b-2 border-kd-brand text-sm sm:text-[15px] font-bold text-kd-ink">
                      ${icon('swatch', 'w-5 h-5 text-kd-brand shrink-0')}<span class="truncate">Warna ikon</span><span id="kd-colors-count" class="${CLS.chip} !py-0.5 max-sm:hidden"></span>
                    </button>
                    <button type="button" id="kd-tab-stroke" data-action="kd-tab" data-tab="stroke" role="tab" aria-controls="kd-tabpanel-stroke" aria-selected="false" tabindex="-1"
                      class="inline-flex items-center gap-2 min-w-0 -mb-px px-2.5 sm:px-3 py-2.5 border-b-2 border-transparent text-sm sm:text-[15px] font-bold text-kd-muted hover:text-kd-ink">
                      ${icon('adjust', 'w-5 h-5 text-kd-brand shrink-0')}<span class="truncate">Garis<span class="max-sm:hidden"> (stroke)</span></span><span id="kd-stk-count" class="${CLS.chip} !py-0.5"></span>
                    </button>
                    <span class="ml-auto inline-flex items-center gap-1 pb-1.5 shrink-0">
                      <button type="button" data-action="hist-undo" data-hist="undo" disabled class="w-8 h-8 rounded-lg border border-kd-line bg-white grid place-items-center text-kd-ink hover:border-kd-brand hover:text-kd-brand opacity-40" aria-label="Urungkan">${icon('undo', 'w-4 h-4')}</button>
                      <button type="button" data-action="hist-redo" data-hist="redo" disabled class="w-8 h-8 rounded-lg border border-kd-line bg-white grid place-items-center text-kd-ink hover:border-kd-brand hover:text-kd-brand opacity-40" aria-label="Ulangi">${icon('redo', 'w-4 h-4')}</button>
                    </span>
                  </div>
                  <div id="kd-tabpanel-colors" role="tabpanel" aria-labelledby="kd-tab-colors">
                    <div class="flex justify-end -mt-1 mb-2 empty:hidden"><button type="button" id="kd-colors-reset" data-action="colors-reset" class="hidden inline-flex items-center gap-1 text-xs font-bold text-kd-brand hover:underline">${icon('refresh', 'w-4 h-4')}Kembalikan semua warna</button></div>
                    <div id="kd-palette" class="mb-3 rounded-xl border border-kd-line bg-kd-surface/60 p-2.5 sm:p-3"></div>
                    <p id="kd-colors-note" class="text-xs text-kd-muted mb-3"></p>
                    <div id="kd-colors" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2"></div>
                  </div>
                  <div id="kd-tabpanel-stroke" role="tabpanel" aria-labelledby="kd-tab-stroke" class="hidden"></div>
                </section>

                <section id="kd-dz-card" class="${CLS.card}">
                  <div id="kd-dz-head" class="flex flex-wrap items-center justify-between gap-2 mb-3 select-none outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-kd-brand/30">
                    <h3 class="${CLS.cardTitle}"><span class="${CLS.step}" data-designer-only>4</span><span class="hidden ${CLS.step}" data-admin-only>${icon('folder', 'w-4 h-4')}</span>Nama file &amp; kirim ke Drive</h3>
                    <span class="flex items-center gap-1.5">
                      <span id="kd-dz-count" class="${CLS.chip}"></span>
                      <span id="kd-dz-chevron" class="hidden w-7 h-7 rounded-md grid place-items-center text-kd-muted transition-transform">${icon('chevronDown', 'w-4 h-4')}</span>
                    </span>
                  </div>
                  <div id="kd-dz-body">
                  <div id="kd-dz-format" class="rounded-xl bg-kd-surface p-3 text-xs"></div>
                  <button type="button" id="kd-dz-rename" data-action="dz-rename-all" class="${CLS.btnOutline} w-full mt-3 bg-kd-brand-light">
                    ${icon('adjust', 'w-4 h-4')}Ganti nama semua<span class="text-[10px] font-extrabold uppercase bg-kd-brand text-white rounded px-1.5 py-0.5">wajib</span>
                  </button>
                  <ul id="kd-dz-issues" class="mt-3 space-y-1"></ul>
                  <div id="kd-dz-list" class="mt-2 divide-y divide-kd-line"></div>
                  <div id="kd-dz-progress" class="hidden mt-4">
                    <div class="flex justify-between gap-2 text-xs font-semibold text-kd-muted mb-1"><span id="kd-dz-progress-text"></span><span id="kd-dz-progress-pct"></span></div>
                    <div class="h-2 rounded-full bg-kd-surface overflow-hidden"><div id="kd-dz-bar" class="h-full rounded-full bg-kd-brand transition-all duration-300" style="width:0%"></div></div>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 mt-4">
                    <button type="button" id="kd-dz-send" data-action="dz-send" class="${CLS.btnPrimary} flex-1 max-sm:basis-full">${icon('upload', 'w-4 h-4')}<span>Kirim ke Drive</span></button>
                    <button type="button" id="kd-dz-retry" data-action="dz-retry" class="hidden ${CLS.btnOutline} max-sm:w-full">${icon('refresh', 'w-4 h-4')}Kirim ulang yang gagal</button>
                  </div>
                  <p id="kd-dz-hint" class="mt-2 text-xs"></p>
                  <input id="kd-dz-revise-file" type="file" accept=".svg,image/svg+xml" class="sr-only">
                  </div>
                </section>

                <section class="${CLS.card}" data-admin-only>
                  <h3 class="${CLS.cardTitle} mb-4"><span class="${CLS.step}">4</span>Ekspor untuk microstock</h3>
                  <div class="grid sm:grid-cols-[200px_1fr] gap-3 items-start">
                    <label class="block">
                      <span class="block text-xs text-kd-muted mb-1">Ukuran ekspor</span>
                      <select id="kd-scale" class="w-full h-10 rounded-lg border border-kd-line px-3 text-sm font-semibold text-kd-ink bg-white outline-none focus:border-kd-brand focus:ring-2 focus:ring-kd-brand/20">
                        <option value="auto">Otomatis (min. ${STOCK_MP.min} MP)</option>
                        ${EXPORT_SCALES.map((s) => `<option value="${s}">Skala ${s}×</option>`).join('')}
                      </select>
                    </label>
                    <div class="rounded-xl bg-kd-surface px-3 py-2 text-xs text-kd-muted space-y-1">
                      <div class="flex justify-between gap-2"><span>Artboard</span><b id="kd-output-size" class="text-kd-ink"></b></div>
                      <div class="flex justify-between gap-2"><span>Artwork</span><b id="kd-artwork-size" class="text-kd-ink"></b></div>
                      <div id="kd-mp-status" class="flex items-center gap-1 font-semibold"></div>
                    </div>
                  </div>
                  <div class="grid sm:grid-cols-2 gap-3 mt-4">
                    <button type="button" data-action="export-svg" data-export class="flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-lg bg-kd-brand text-white font-bold text-sm hover:bg-kd-brand-dark disabled:bg-[#BFC9D9] disabled:cursor-not-allowed transition-colors">
                      <span class="inline-flex items-center gap-2">${icon('download')}Ekspor SVG</span>
                      <span class="text-[11px] font-semibold opacity-90">Adobe Stock</span>
                    </button>
                    <button type="button" data-action="export-eps" data-export class="flex flex-col items-center justify-center gap-0.5 py-2.5 rounded-lg border border-kd-brand text-kd-brand font-bold text-sm hover:bg-kd-brand-light disabled:border-[#BFC9D9] disabled:text-[#BFC9D9] disabled:bg-white disabled:cursor-not-allowed transition-colors">
                      <span class="inline-flex items-center gap-2">${icon('download')}Ekspor EPS 10</span>
                      <span class="text-[11px] font-semibold opacity-90">Shutterstock, Freepik, dll.</span>
                    </button>
                  </div>
                  <p id="kd-export-hint" class="flex items-center gap-1.5 mt-3 text-xs"></p>
                  <ul id="kd-warnings" class="mt-2 space-y-1"></ul>
                  <div id="kd-adobe" class="mt-4 rounded-xl border border-rose-200 bg-rose-50/60 p-3"></div>
                </section>

              </div>
            </div>
          </div>
        </div>

        <div id="kd-toast" role="status" aria-live="polite" class="fixed left-1/2 bottom-6 z-[80] -translate-x-1/2 translate-y-4 opacity-0 pointer-events-none px-4 py-2.5 rounded-lg text-white text-sm font-semibold shadow-lg transition-all"></div>`;
      },

      previewHint() {
        const items = activeItems();
        const index = items.findIndex((it) => it.id === state.selectedId);
        $('#kd-preview-hint').innerHTML = index < 0
          ? 'Klik ikon untuk memutar. Seret ikon ke posisi ikon lain untuk menukar urutan — jarak tetap sesuai aturan. Klik dua kali ikon untuk zoom &amp; periksa detail.'
          : `<b class="text-kd-ink">Ikon ${index + 1} · ${items[index].rotation || 0}°${items[index].flipX ? ' · dibalik horizontal' : ''}${items[index].flipY ? ' · dibalik vertikal' : ''}</b> — seret bulatan untuk memutar (Shift = kelipatan 15°, tombol [ ] = 1°). Tombol flip atau H / V untuk membalik. Klik label derajat untuk kembali ke 0°, Esc untuk selesai.`;
      },

      adobe() {
        const project = state.project || {};
        const payload = AdobeBridge.payload(project);
        const { keywordsMin, keywordsMax } = AdobeBridge.LIMITS;
        const count = payload.keywords.length;
        const notes = [
          !payload.title ? 'Judul tema belum diisi di Kelola Stok Tema.' : '',
          count < keywordsMin ? `Keyword baru ${count}, Adobe Stock minta minimal ${keywordsMin}.` : '',
          payload.droppedKeywords ? `${payload.droppedKeywords} keyword terakhir dibuang (maks. ${keywordsMax}).` : ''
        ].filter(Boolean);

        $('#kd-adobe').innerHTML = `
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0 flex-1 text-xs">
              <span class="block font-bold text-ink">Upload ke Adobe Stock</span>
              <span class="block text-muted truncate">Judul: <b class="text-ink">${escapeHtml(payload.title || '-')}</b></span>
              <span class="block text-muted">Keyword: <b class="text-ink">${count}</b> / ${keywordsMax}</span>
            </div>
            <button type="button" data-action="upload-adobe" class="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 disabled:bg-[#BFC9D9] disabled:cursor-not-allowed transition-colors" ${payload.title ? '' : 'disabled'}>
              ${icon('external', 'w-4 h-4')}${project.adobeInfo ? 'Buka Adobe lagi' : 'Upload Adobe'}
            </button>
          </div>
          ${notes.map((t) => `<p class="flex items-start gap-1.5 mt-2 text-xs text-[#AA5A00]">${icon('warning', 'w-4 h-4 shrink-0')}${escapeHtml(t)}</p>`).join('')}
          ${project.adobeInfo
            ? `<p class="flex items-start gap-1.5 mt-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">${icon('check', 'w-4 h-4 shrink-0 text-rose-600')}${escapeHtml(project.adobeInfo)}</p>`
            : `<p class="mt-2 text-[11px] text-muted">Ekspor SVG dulu → unggah file di Adobe Stock → klik <b>Isi Metadata</b> pada panel KEKAL Adobe Helper.</p>`}`;
      },

      drive() {
        const { status, message, folderName, total, skipped = [], invalid = 0 } = state.drive;
        const url = state.project && state.project.folderUrl;
        const link = $('#kd-drive-link');
        link.classList.toggle('hidden', !hasDriveFolder(url));
        if (hasDriveFolder(url)) link.href = url;
        // Mode desainer: tautan cadangan — lebih kecil, abu-abu, dengan keterangan saat disorot
        const designer = state.mode === 'designer';
        [['text-kd-brand', !designer], ['font-bold', !designer], ['text-xs', !designer],
          ['text-kd-muted', designer], ['hover:text-kd-ink', designer], ['font-semibold', designer], ['text-[11px]', designer]]
          .forEach(([cls, on]) => link.classList.toggle(cls, on));
        link.firstElementChild.setAttribute('class', designer ? 'w-3.5 h-3.5' : 'w-4 h-4');
        link.title = designer ? 'Untuk cek manual, hapus file non-SVG, atau pulihkan dari Sampah' : '';

        const reload = `<button type="button" data-action="drive-reload" class="shrink-0 inline-flex items-center gap-1 font-bold text-kd-brand hover:underline">${icon('refresh', 'w-4 h-4')}Muat ulang</button>`;
        const notes = [
          total > 12 ? `${total} file SVG ditemukan, 12 pertama dimuat` : '',
          skipped.length ? `${skipped.length} file bukan SVG dilewati` : '',
          invalid ? `${invalid} file SVG rusak/tidak valid` : ''
        ].filter(Boolean).map((t) => `<span class="block text-[#AA5A00] mt-0.5">${escapeHtml(t)}</span>`).join('');

        const views = {
          idle: `<span class="text-kd-muted">Baris ini belum punya folder Drive. Tambahkan file SVG secara manual.</span>`,
          loading: `<span class="flex items-center gap-2 text-kd-muted"><span class="w-4 h-4 rounded-full border-2 border-kd-brand border-t-transparent animate-spin"></span>Membaca file SVG dari Google Drive…</span>`,
          success: `
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <span class="flex items-center gap-1.5 font-bold text-kd-ink">${icon('folder', 'w-4 h-4 shrink-0 text-kd-brand')}<span class="truncate">${escapeHtml(folderName || 'Folder Drive')}</span></span>
                <span class="block text-kd-muted mt-0.5">${total} file SVG di folder</span>${notes}
              </div>${reload}
            </div>`,
          error: `<div class="flex items-start justify-between gap-2"><span class="text-kd-danger font-semibold">${escapeHtml(message || 'Gagal membaca Drive.')}</span>${reload}</div>`
        };
        $('#kd-drive-status').innerHTML = views[status] || views.idle;
      },

      settingField(key, label) {
        const [min, max] = SETTING_LIMITS[key];
        return `
          <label class="block">
            <span class="block text-xs text-kd-muted mb-1">${label}</span>
            <span class="relative block">
              <input data-setting="${key}" type="number" inputmode="numeric" min="${min}" max="${max}" value="${state.settings[key]}" class="${CLS.input}">
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-kd-muted pointer-events-none">px</span>
            </span>
          </label>`;
      },

      counts() {
        $('#kd-counts').innerHTML = COUNT_OPTIONS.map(({ count, grid }) => {
          const active = count === state.count;
          const tone = active
            ? 'border-kd-brand bg-kd-brand-light text-kd-brand-dark'
            : 'border-kd-line text-kd-ink hover:border-kd-brand';
          return `
            <button type="button" data-action="count" data-count="${count}" aria-pressed="${active}"
              class="rounded-xl border py-2.5 text-center transition-colors ${tone}">
              <span class="block text-lg font-extrabold leading-none">${count}</span>
              <span class="block text-[11px] mt-1 ${active ? '' : 'text-kd-muted'}">${grid}</span>
            </button>`;
        }).join('');
      },

      slots() {
        const { cols } = Layout.gridFor(state.count);
        const total = Math.max(state.count, state.items.length);
        const box = $('#kd-slots');
        box.className = `grid gap-2 ${cols === 4 ? 'grid-cols-4' : 'grid-cols-3'}`;

        box.innerHTML = Array.from({ length: total }, (_, i) => {
          const item = state.items[i];
          if (!item) {
            return `
              <button type="button" data-action="pick" class="aspect-square rounded-lg border border-dashed border-[#BFC9D9] text-[#BFC9D9] grid place-items-center hover:border-kd-brand hover:text-kd-brand transition-colors" aria-label="Tambah ikon ${i + 1}">
                ${icon('plus')}
              </button>`;
          }
          const unused = i >= state.count;
          return `
            <div class="relative aspect-square rounded-lg border ${unused ? 'border-dashed border-kd-line opacity-50' : 'border-kd-line'} kd-checker overflow-hidden group" title="${escapeHtml(item.name)}">
              <img src="${item.thumb}" alt="${escapeHtml(item.name)}" class="w-full h-full object-contain p-2" draggable="false">
              <span class="absolute left-1 top-1 min-w-[18px] h-[18px] px-1 rounded-full ${unused ? 'bg-kd-muted' : 'bg-kd-brand'} text-white text-[10px] font-bold grid place-items-center">${unused ? '–' : i + 1}</span>
              ${item.warnings.length || Frame.oversized(item) ? `<span class="absolute left-1 bottom-1 flex items-center gap-0.5">
                ${item.warnings.length ? `<span class="text-[#FF7A00]" title="${escapeHtml(item.warnings.join(', '))}">${icon('warning', 'w-4 h-4')}</span>` : ''}
                ${Frame.oversized(item) ? `<button type="button" data-action="frame-fix" data-id="${item.id}" class="w-5 h-5 rounded-full bg-[#FFF5E6] border border-[#FFB766] text-[#AA5A00] hover:bg-[#FFE7C7] grid place-items-center shadow-kd-card" title="Frame terlalu lebar — klik untuk memangkas ke batas gambar" aria-label="Pangkas frame ikon ${i + 1}">${icon('crop', 'w-3 h-3')}</button>` : ''}
              </span>` : ''}
              <button type="button" data-action="inspect" data-id="${item.id}" class="absolute right-1 bottom-1 w-5 h-5 rounded-full bg-white/90 text-kd-muted hover:text-kd-brand grid place-items-center shadow-kd-card" title="Periksa detail (zoom &amp; outline)" aria-label="Periksa detail ${escapeHtml(item.name)}">
                ${icon('search', 'w-3.5 h-3.5')}
              </button>
              <button type="button" data-action="remove" data-index="${i}" class="absolute right-1 top-1 w-5 h-5 rounded-full bg-white/90 text-kd-muted hover:text-kd-danger grid place-items-center shadow-kd-card" aria-label="Hapus ${escapeHtml(item.name)}">
                ${icon('close', 'w-3.5 h-3.5')}
              </button>
            </div>`;
        }).join('');

        const used = activeItems().length;
        const extra = state.items.length - used;
        $('#kd-upload-count').textContent = `${used}/${state.count}`;
        $('#kd-upload-hint').textContent = extra > 0
          ? `${extra} ikon di luar jumlah terpilih tidak masuk frame`
          : `Butuh ${state.count} ikon · bisa pilih beberapa sekaligus`;
      },

      trim() {
        const on = state.settings.trim;
        const btn = $('#kd-trim');
        btn.setAttribute('aria-checked', String(on));
        btn.classList.toggle('bg-kd-brand', on);
        btn.classList.toggle('bg-[#BFC9D9]', !on);
        btn.firstElementChild.style.transform = on ? 'translateX(20px)' : 'translateX(0)';
      },

      stats() {
        const { frameW, frameH, cols, rows } = state.layout;
        const size = ExportSize.summary();
        const missing = state.count - activeItems().length;

        $('#kd-frame-size').textContent = `${round(frameW, 2)} × ${round(frameH, 2)}`;
        $('#kd-grid-info').textContent = `${rows} baris × ${cols} kolom`;
        $('#kd-output-size').textContent = `${size.frameW} × ${size.frameH} px`;
        $('#kd-artwork-size').textContent = `${size.artW} × ${size.artH} px · ${size.artMp.toFixed(2)} MP`;
        const mp = $('#kd-mp-status');
        const okMp = size.status === 'ok';
        mp.className = `flex items-center gap-1 font-semibold ${okMp ? 'text-kd-brand-dark' : 'text-[#AA5A00]'}`;
        mp.innerHTML = okMp
          ? `${icon('check', 'w-4 h-4')}Memenuhi syarat Shutterstock (${STOCK_MP.min}–${STOCK_MP.max} MP)`
          : `${icon('warning', 'w-4 h-4')}${size.status === 'small' ? `Artwork di bawah ${STOCK_MP.min} MP — naikkan skala` : `Artwork di atas ${STOCK_MP.max} MP — turunkan skala`}`;
        document.querySelectorAll('[data-export]').forEach((btn) => { btn.disabled = missing > 0; });

        const hint = $('#kd-export-hint');
        hint.className = `flex items-center gap-1.5 mt-3 text-xs ${missing > 0 ? 'text-kd-muted' : 'text-kd-brand-dark font-semibold'}`;
        hint.innerHTML = missing > 0
          ? `${icon('warning', 'w-4 h-4')}Unggah ${missing} ikon lagi untuk mengaktifkan ekspor.`
          : `${icon('check', 'w-4 h-4')}Siap diekspor: latar transparan, tanpa elemen bantu.`;

        const alphaCount = activeItems().filter((item) => item.warnings.includes(WARN.opacity)).length;
        const strayItems = activeItems().map((item, i) => ({ item, i, n: Cleanup.count(item) })).filter((x) => x.n);
        const lineItems = activeItems().map((item, i) => ({ item, i, n: Cleanup.countLines(item) })).filter((x) => x.n);
        const strokeItems = activeItems().map((item, i) => ({ item, i, n: Outline.count(item), m: Outline.markers(item) })).filter((x) => x.n || x.m);
        const strokeFixable = strokeItems.filter((x) => x.n).length;
        const frameItems = activeItems().map((item, i) => ({ item, i })).filter((x) => Frame.oversized(x.item));
        const flatCount = activeItems().filter((item) => Flatten.needs(item)).length;
        $('#kd-warnings').innerHTML = (alphaCount > 1 || strayItems.length > 1 || strokeFixable > 1 || lineItems.length > 1 || frameItems.length > 1 || flatCount > 1
          ? `<li class="flex flex-wrap justify-end gap-1.5">${flatCount > 1 ? Flatten.button(null, `Flatten semua (${flatCount})`) : ''}${alphaCount > 1 ? Alpha.button(null, 'Hilangkan semua transparansi') : ''}${strayItems.length > 1 ? Cleanup.button(null, 'Bersihkan semua titik liar') : ''}${lineItems.length > 1 ? Cleanup.lineButton(null, 'Bersihkan semua garis liar') : ''}${strokeFixable > 1 ? Outline.button(null, 'Ubah semua garis ke fill') : ''}${frameItems.length > 1 ? Frame.button(null, `Pangkas semua frame (${frameItems.length})`) : ''}</li>` : '')
          + frameItems.map(({ item, i }) =>
            `<li class="flex flex-wrap items-start gap-1.5 text-xs text-[#AA5A00] bg-[#FFF5E6] rounded-lg px-2.5 py-1.5">${icon('warning', 'w-4 h-4 shrink-0')}<span class="min-w-0 flex-1"><b>Ikon ${i + 1}</b> (${escapeHtml(item.name)}) ${escapeHtml(Frame.note(item))}.</span>${Frame.button(item.id)}</li>`).join('')
          + strokeItems.map(({ item, i, n, m }) =>
            `<li class="flex flex-wrap items-start gap-1.5 text-xs text-[#AA5A00] bg-[#FFF5E6] rounded-lg px-2.5 py-1.5">${icon('warning', 'w-4 h-4 shrink-0')}<span class="min-w-0 flex-1"><b>Ikon ${i + 1}</b> (${escapeHtml(item.name)}) ${escapeHtml(Outline.note(n, m))}.</span>${n ? Outline.button(item.id, 'Ubah ke fill') : ''}</li>`).join('')
          + lineItems.map(({ item, i, n }) =>
            `<li class="flex flex-wrap items-start gap-1.5 text-xs text-[#AA5A00] bg-[#FFF5E6] rounded-lg px-2.5 py-1.5">${icon('warning', 'w-4 h-4 shrink-0')}<span class="min-w-0 flex-1"><b>Ikon ${i + 1}</b> (${escapeHtml(item.name)}) ${escapeHtml(Cleanup.noteLines(n))}.</span>${Cleanup.lineButton(item.id, 'Bersihkan')}</li>`).join('')
          + strayItems.map(({ item, i, n }) =>
            `<li class="flex flex-wrap items-start gap-1.5 text-xs text-[#AA5A00] bg-[#FFF5E6] rounded-lg px-2.5 py-1.5">${icon('warning', 'w-4 h-4 shrink-0')}<span class="min-w-0 flex-1"><b>Ikon ${i + 1}</b> (${escapeHtml(item.name)}) ${escapeHtml(Cleanup.note(n))}.</span>${Cleanup.button(item.id, 'Bersihkan')}</li>`).join('')
          + activeItems()
          .map((item, i) => item.warnings.map((w) =>
            `<li class="flex flex-wrap items-start gap-1.5 text-xs text-[#AA5A00] bg-[#FFF5E6] rounded-lg px-2.5 py-1.5">${icon('warning', 'w-4 h-4 shrink-0')}<span class="min-w-0 flex-1"><b>Ikon ${i + 1}</b> (${escapeHtml(item.name)}) ${escapeHtml(w)}.</span>${w === WARN.opacity ? Alpha.button(item.id, 'Hilangkan') : ''}${w === WARN.effect ? Flatten.button(item.id) : ''}</li>`
          ).join('')).join('');
      },

      toast: (() => {
        let timer = null;
        return (message, type = 'info') => {
          const el = $('#kd-toast');
          el.textContent = message;
          el.classList.toggle('bg-kd-danger', type === 'error');
          el.classList.toggle('bg-kd-ink', type !== 'error');
          el.classList.remove('opacity-0', 'translate-y-4');
          clearTimeout(timer);
          timer = setTimeout(() => el.classList.add('opacity-0', 'translate-y-4'), 2800);
        };
      })()
    };

    /* =====================================================================
     * 10. CONTROLLER (APP)
     * ===================================================================== */
    const App = {
      modal: null,
      requestSeq: 0,
      previousOverflow: '',

      /** Bangun modal sekali saja, saat pertama kali dibuka. */
      mount() {
        if (this.modal) return;
        const style = document.createElement('style');
        style.id = 'kd-styles';
        style.textContent = STYLES;
        document.head.appendChild(style);

        this.modal = document.createElement('div');
        this.modal.id = 'kd-modal';
        this.modal.className = 'fixed inset-0 z-[70] hidden flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4';
        this.modal.innerHTML = View.shell();
        document.body.appendChild(this.modal);

        $('#kd-scale').value = String(state.settings.scale);
        Preview.mount($('#kd-stage'));
        this.bindEvents(this.modal);
        View.trim();
        Sticker.mount($('#kd-sticker'));
      },

      /** Buka modal untuk satu baris laporan dan muat ikon dari folder Drive-nya. */
      open(project = {}) {
        this.mount();
        state.project = {
          id: String(project.id || ''),
          folderUrl: String(project.folderUrl || ''),
          title: String(project.title || ''),
          designer: String(project.designer || ''),
          judul: String(project.judul || ''),
          keyword: String(project.keyword || ''),
          adobeInfo: String(project.adobeInfo || ''),
          onAdobeUpload: typeof project.onAdobeUpload === 'function' ? project.onAdobeUpload : null,
          style: String(project.style || ''),
          total: Number(project.count) || 0
        };
        // Mode desainer: tanpa ekspor microstock, dengan ganti nama & kirim ke Drive
        state.mode = project.mode === 'designer' ? 'designer' : 'admin';
        state.colors = {};
        Designer.reset();
        this.modal.querySelectorAll('[data-admin-only]').forEach((el) => el.classList.toggle('hidden', state.mode !== 'admin'));
        this.modal.querySelectorAll('[data-designer-only]').forEach((el) => el.classList.toggle('hidden', state.mode !== 'designer'));
        state.count = pickCount(Number(project.count) || 0);
        this.resetItems();

        $('#kd-title').textContent = state.project.title ? `Penata Ikon · ${state.project.title}` : 'Penata Ikon';
        $('#kd-subtitle').textContent = [state.project.designer, `Nilai ${Number(project.count) || 0} ikon`].filter(Boolean).join(' · ');

        this.previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        this.modal.classList.remove('hidden');
        this.modal.querySelector('.overflow-y-auto').scrollTop = 0;
        this.refresh();
        View.adobe();

        if (hasDriveFolder(state.project.folderUrl)) {
          this.loadFromDrive();
        } else {
          state.drive = { status: 'idle' };
          View.drive();
        }
      },

      close() {
        if (!this.modal || this.modal.classList.contains('hidden')) return;
        if (Designer.busy()) return View.toast('Tunggu sampai pengiriman ke Drive selesai.', 'error');
        this.requestSeq++; // batalkan pemuatan Drive yang masih berjalan
        Inspect.close();
        Split.close();
        this.modal.classList.add('hidden');
        document.body.style.overflow = this.previousOverflow;
      },

      /** Buka halaman upload Adobe Stock + kirim metadata; catat status sekali saja. */
      async uploadAdobe() {
        const project = state.project;
        const payload = AdobeBridge.payload(project);
        if (!payload.title) return View.toast('Judul tema belum diisi.', 'error');

        const firstUpload = !project.adobeInfo;
        if (firstUpload) {
          const ok = await confirmDialog('Konfirmasi Upload Adobe',
            `Buka Adobe Stock untuk "${project.title || payload.title}" dan tandai sebagai sudah diupload?\n\nWaktu upload akan dicatat.`);
          if (!ok) return;
        }

        AdobeBridge.open(payload);
        if (!firstUpload || !project.onAdobeUpload) return;

        try {
          const info = await project.onAdobeUpload(project.id, payload);
          if (info) project.adobeInfo = info;
          View.adobe();
          View.toast('Status upload Adobe dicatat.');
        } catch (err) {
          View.toast(`Gagal mencatat status Adobe: ${err.message}`, 'error');
        }
      },

      async loadFromDrive() {
        const request = ++this.requestSeq;
        state.drive = { status: 'loading' };
        View.drive();

        try {
          const designer = state.mode === 'designer';
          const data = designer ? await Designer.list() : await DriveSource.list(state.project.folderUrl);
          if (request !== this.requestSeq) return;

          this.resetItems();
          state.colors = {};
          let invalid = 0;
          data.files.forEach((file) => {
            try {
              const asset = SvgAsset.fromText(file.content, file.name);
              if (file.id) Designer.adopt(asset, file);
              state.items.push(asset);
            } catch (err) {
              invalid++;
            }
          });
          Designer.loaded();

          state.drive = { status: 'success', folderName: data.folder_name, total: data.total_svg, skipped: data.skipped || [], invalid };
          this.refresh();
          View.drive();
          View.toast(state.items.length ? `${state.items.length} ikon dimuat dari Drive.` : 'Tidak ada file SVG di folder ini.', state.items.length ? 'info' : 'error');
        } catch (err) {
          if (request !== this.requestSeq) return;
          state.drive = { status: 'error', message: err.message };
          View.drive();
        }
      },

      /** Hitung ulang tata letak rapi untuk urutan saat ini lalu render semua bagian. */
      refresh() {
        Colors.sync();
        state.layout = Layout.compute(activeItems(), state.count, state.settings);
        View.counts();
        View.slots();
        View.stats();
        Preview.sync();
        View.previewHint();
        Colors.render();
        StrokeEdit.render();
        History.render();
        Designer.render();
        Split.renderNote();
        Sticker.render();
      },

      /** Pilih ikon untuk dirotasi (null = batal pilih). */
      select(id) {
        state.selectedId = id;
        Preview.sync();
        View.previewHint();
        Colors.renderItem();
        Sticker.render();
      },

      /** Putar ikon; tata letak & jarak dihitung ulang langsung. `live` = sedang diseret. */
      rotateItem(id, angle, { live = false } = {}) {
        const item = activeItems().find((it) => it.id === id);
        if (!item) return;
        item.rotation = normalizeAngle(angle);
        state.layout = Layout.compute(activeItems(), state.count, state.settings);
        Preview.sync();
        View.previewHint();
        if (!live) {
          View.stats();
          Designer.render();
        }
      },

      /**
       * Balik ikon seperti cermin di layar. Karena flip diterapkan sebelum rotasi,
       * sudut ikut dibalik tandanya agar hasilnya sama persis dengan yang terlihat.
       */
      flipItem(id, axis) {
        const item = activeItems().find((it) => it.id === id);
        if (!item) return;
        if (axis === 'x') item.flipX = !item.flipX;
        else item.flipY = !item.flipY;
        this.rotateItem(id, -(item.rotation || 0));
      },

      /** Ganti urutan ikon aktif; ikon di luar jumlah terpilih tetap di belakang. */
      setOrder(active) {
        state.items = active.concat(inactiveItems());
        this.refresh();
      },

      /** Pindahkan ikon dari slot `from` ke slot `to`; ikon lain bergeser. */
      reorder(from, to) {
        if (from === to) return this.refresh();
        this.setOrder(moveIndex(activeItems(), from, to));
      },

      shuffle() {
        const active = activeItems();
        if (active.length < 2) return View.toast('Unggah minimal 2 ikon untuk mengacak urutan.', 'error');
        const current = active.map((it) => it.id).join();
        let next = shuffled(active);
        for (let tries = 0; tries < 10 && next.map((it) => it.id).join() === current; tries++) next = shuffled(active);
        this.setOrder(next);
        View.toast('Urutan ikon diacak.');
      },

      resetOrder() {
        this.setOrder(activeItems().slice().sort((a, b) => a.id - b.id));
        View.toast('Urutan dikembalikan sesuai urutan unggah.');
      },

      async addFiles(fileList) {
        const files = [...fileList].filter((f) => /\.svg$/i.test(f.name) || f.type === 'image/svg+xml');
        if (!files.length) return View.toast('Hanya file .svg yang didukung.', 'error');

        // Mode desainer: semua ikon proyek dikirim, walau melebihi jumlah per paket
        const capacity = state.mode === 'designer' ? Math.max(state.count, state.project.total || 0) : state.count;
        const free = capacity - state.items.length;
        if (free <= 0) return View.toast(`Slot penuh (${capacity} ikon). Hapus ikon atau pilih jumlah lebih besar.`, 'error');

        const results = await Promise.allSettled(files.slice(0, free).map((f) => SvgAsset.fromFile(f)));
        const errors = [];
        results.forEach((r) => (r.status === 'fulfilled' ? state.items.push(r.value) : errors.push(r.reason.message)));
        this.refresh();

        if (errors.length) View.toast(errors[0], 'error');
        else if (files.length > free) View.toast(`${files.length - free} file diabaikan karena slot sudah penuh.`, 'error');
        else View.toast(`${results.length} ikon ditambahkan.`);
      },

      removeItem(index) {
        const [item] = state.items.splice(index, 1);
        if (item) URL.revokeObjectURL(item.thumb);
        this.refresh();
      },

      /** Kosongkan daftar ikon tanpa render ulang. */
      resetItems() {
        History.reset();
        state.items.forEach((item) => URL.revokeObjectURL(item.thumb));
        state.items = [];
        state.selectedId = null;
      },

      clearItems() {
        if (!state.items.length) return;
        this.resetItems();
        this.refresh();
      },

      updateSetting(input, commit) {
        const key = input.dataset.setting;
        const [min, max] = SETTING_LIMITS[key];
        const value = Number(input.value);
        const valid = input.value !== '' && Number.isFinite(value) && value >= min && value <= max;
        input.classList.toggle('border-kd-danger', !valid);

        if (!valid && !commit) return;
        const next = valid ? value : clamp(Number.isFinite(value) ? value : state.settings[key], min, max);
        input.value = next;
        input.classList.remove('border-kd-danger');
        if (next === state.settings[key]) return;
        state.settings[key] = next;
        this.refresh();
      },

      async exportAs(format) {
        const missing = state.count - activeItems().length;
        if (missing > 0) return View.toast(`Unggah ${missing} ikon lagi sebelum mengekspor.`, 'error');
        const exporter = format === 'eps' ? EpsExporter : SvgExporter;
        try {
          if ((await exporter.download()) !== false) View.toast(`${format.toUpperCase()} berhasil diekspor.`);
        } catch (err) {
          View.toast(`Gagal mengekspor: ${err.message}`, 'error');
        }
      },

      bindEvents(root) {
        const fileInput = $('#kd-file');
        const dropzone = $('#kd-drop');

        root.addEventListener('click', (e) => {
          const target = e.target.closest('[data-action]');
          if (!target) return;
          const action = target.dataset.action;
          const actions = {
            count: () => {
              state.count = Number(target.dataset.count);
              this.refresh();
            },
            pick: () => fileInput.click(),
            remove: () => this.removeItem(Number(target.dataset.index)),
            clear: () => this.clearItems(),
            trim: () => {
              state.settings.trim = !state.settings.trim;
              View.trim();
              this.refresh();
            },
            shuffle: () => this.shuffle(),
            'reset-order': () => this.resetOrder(),
            'export-svg': () => this.exportAs('svg'),
            'export-eps': () => this.exportAs('eps'),
            'drive-reload': async () => {
              if (await Designer.confirmReload()) this.loadFromDrive();
            },
            'dz-rename-all': () => Designer.renameAll(),
            'dz-send': () => Designer.send(false),
            'dz-retry': () => Designer.send(true),
            'dz-done': () => (state.mode === 'designer' ? this.close() : Designer.toggle(false)),
            'dz-toggle': () => Designer.toggle(),
            'split-open': () => Split.open(target.dataset.id),
            'color-reset': () => Colors.reset(target.dataset.hex),
            'colors-reset': () => Colors.reset(),
            'alpha-fix': () => Alpha.fix(target.dataset.id),
            'clean-fix': () => Cleanup.fix(target.dataset.id),
            'lines-fix': () => Cleanup.fixLines(target.dataset.id),
            'frame-fix': () => Frame.fix(target.dataset.id),
            'flat-fix': () => Flatten.fix(target.dataset.id),
            'stroke-fix': () => Outline.fix(target.dataset.id),
            'kd-tab': () => StrokeEdit.toggle(target.dataset.tab === 'stroke'),
            'hist-undo': () => History.undo(),
            'hist-redo': () => History.redo(),
            'pal-generate': () => Palette.generate(),
            'pal-prev': () => Palette.previous(),
            'item-pipette': () => Colors.togglePipette(target.dataset.hex),
            'item-colors-reset': () => Colors.resetItem(state.selectedId),
            'pal-flip': () => Palette.flip(),
            'pal-pick': () => Palette.pick(target.dataset.hex),
            'pal-copy': () => Palette.copy(target.dataset.hex),
            'pal-apply': () => Palette.applyAll(),
            inspect: () => Inspect.open(target.dataset.id ? Number(target.dataset.id) : state.selectedId),
            outline: () => {
              state.outline = !state.outline;
              target.setAttribute('aria-pressed', String(state.outline));
              target.classList.toggle('!bg-kd-brand-light', state.outline);
              target.classList.toggle('!text-kd-brand-dark', state.outline);
              Preview.sync();
            },
            'dz-revise': () => Designer.startRevision(target.dataset.id),
            'dz-trash': () => Designer.trash(target.dataset.id),
            'dz-bg': () => Designer.setBackground(target.dataset.bg),
            'upload-adobe': () => this.uploadAdobe(),
            close: () => this.close()
          };
          if (actions[action]) actions[action]();
        });

        fileInput.addEventListener('change', () => {
          this.addFiles(fileInput.files);
          fileInput.value = '';
        });

        root.addEventListener('input', (e) => {
          if (e.target.matches('[data-setting]')) this.updateSetting(e.target, false);
          if (e.target.id === 'kd-bg-custom') Designer.setBackground(e.target.value);
          if (e.target.matches('[data-color-from]')) Colors.set(e.target.dataset.colorFrom, e.target.value, { live: true });
          if (e.target.matches('[data-item-color]')) Colors.setItem(state.selectedId, e.target.dataset.itemColor, e.target.value, { live: true });
        });
        root.addEventListener('change', (e) => {
          if (e.target.matches('[data-setting]')) this.updateSetting(e.target, true);
          if (e.target.matches('[data-dz-name]')) Designer.renameOne(e.target.dataset.dzName, e.target.value);
          if (e.target.matches('[data-color-from]')) Colors.set(e.target.dataset.colorFrom, e.target.value);
          if (e.target.matches('[data-color-hex]')) Colors.set(e.target.dataset.colorHex, e.target.value);
          if (e.target.matches('[data-item-color]')) Colors.setItem(state.selectedId, e.target.dataset.itemColor, e.target.value);
          if (e.target.matches('[data-item-hex]')) Colors.setItem(state.selectedId, e.target.dataset.itemHex, e.target.value);
          if (e.target.id === 'kd-dz-revise-file') {
            Designer.applyRevision(e.target.files[0]);
            e.target.value = '';
          }
          if (e.target.id === 'kd-scale') {
            state.settings.scale = e.target.value === 'auto' ? 'auto' : Number(e.target.value);
            View.stats();
          }
        });

        // Seret & lepas file SVG di mana saja di dalam modal
        const hasFiles = (e) => [...(e.dataTransfer ? e.dataTransfer.types : [])].includes('Files');
        const highlight = (on) => {
          dropzone.classList.toggle('ring-2', on);
          dropzone.classList.toggle('ring-kd-brand', on);
        };
        root.addEventListener('dragover', (e) => {
          if (!hasFiles(e)) return;
          e.preventDefault();
          highlight(true);
        });
        root.addEventListener('dragleave', (e) => {
          if (!root.contains(e.relatedTarget)) highlight(false);
        });
        root.addEventListener('drop', (e) => {
          if (!hasFiles(e)) return;
          e.preventDefault();
          highlight(false);
          this.addFiles(e.dataTransfer.files);
        });

        // Tutup dengan klik latar gelap atau tombol Escape
        root.addEventListener('click', (e) => {
          if (e.target === root) this.close();
        });
        document.addEventListener('keydown', (e) => {
          if (!this.modal || this.modal.classList.contains('hidden') || Inspect.isOpen() || Split.isOpen()) return;
          if (!(e.target.closest && e.target.closest('input, textarea, select')) && History.key(e)) return;
          if (e.target.id === 'kd-dz-head' && (e.key === 'Enter' || e.key === ' ') && e.target.dataset.action) {
            e.preventDefault();
            return Designer.toggle();
          }
          if ((e.target.id === 'kd-tab-colors' || e.target.id === 'kd-tab-stroke') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            e.preventDefault();
            StrokeEdit.toggle(e.target.id === 'kd-tab-colors');
            return $(StrokeEdit.isOpen() ? '#kd-tab-stroke' : '#kd-tab-colors').focus();
          }
          const selected = activeItems().find((it) => it.id === state.selectedId);
          if (e.key === 'Escape') {
            if (Colors.pipetteCancel()) return;
            if (Palette.cancel()) return;
            if (selected) this.select(null);
            else this.close();
          } else if (selected && (e.key === '[' || e.key === ']') && !(e.target.closest && e.target.closest('input, textarea, select'))) {
            e.preventDefault();
            const step = e.shiftKey ? 15 : 1;
            this.rotateItem(selected.id, (selected.rotation || 0) + (e.key === ']' ? step : -step));
          } else if (selected && /^[hv]$/i.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey
            && !(e.target.closest && e.target.closest('input, textarea, select'))) {
            e.preventDefault();
            this.flipItem(selected.id, e.key.toLowerCase() === 'h' ? 'x' : 'y');
          }
        });
      }
    };

    return {
      open: (project) => App.open(project),
      close: () => App.close()
    };
  })();
window.KL_PENATA_VERSION = '1.0.2';
