/*! KEKAL Buku v1.0.3 | pembaca buku dari postingan Blogger (format Obsidian), dimuat saat tab Buku dibuka */
(function () {
  'use strict';
  if (window.KekalBuku && window.KekalBuku.versi) return;
  const VERSI = '1.0.3';
  const KATA_PER_HALAMAN = 300;

  /* ===================== UTILITAS ===================== */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const RE_AR = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
  const RE_AR_RUN = /([؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿][؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿ً-ٰٟ\s،؛؟.!:()«»"'\-]*[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿ً-ٰٟ])/g;
  const hitungKata = (t) => (String(t || '').match(/[\p{L}\p{N}][\p{L}\p{N}\p{M}'’\-]*/gu) || []).length;
  const angka = (n) => Math.max(0, Math.round(Number(n) || 0)).toLocaleString('id-ID');
  function dekode(t) {
    const d = document.createElement('textarea');
    d.innerHTML = t;
    return d.value;
  }
  function amanUrl(u) {
    const s = String(u || '').trim();
    return /^(https?:|mailto:|#)/i.test(s) ? s : '#';
  }
  /** HTML dari postingan (mis. kode gambar Blogger): buang script, event & javascript:. */
  function bersihkanHtml(html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    tpl.content.querySelectorAll('script,style,iframe,object,embed,form,input,button,link,meta').forEach((n) => n.remove());
    tpl.content.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((a) => {
        const n = a.name.toLowerCase();
        if (n.startsWith('on') || n === 'style' && /expression|url\s*\(/i.test(a.value)) el.removeAttribute(a.name);
        if ((n === 'href' || n === 'src') && !/^(https?:|mailto:|#|data:image\/)/i.test(a.value.trim())) el.removeAttribute(a.name);
      });
      if (el.tagName === 'A') { el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener'); }
      if (el.tagName === 'IMG') { el.setAttribute('loading', 'lazy'); el.removeAttribute('width'); el.removeAttribute('height'); }
    });
    return tpl.innerHTML;
  }

  /* ===================== INLINE MARKDOWN ===================== */
  function inline(teks, ctx) {
    let s = esc(teks);
    const simpan = [];
    const taruh = (h) => { simpan.push(h); return '\u0000' + (simpan.length - 1) + '\u0000'; };
    s = s.replace(/`([^`]+)`/g, (_, k) => taruh(`<code>${k}</code>`));
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, (_, alt, url) => taruh(`<img src="${esc(amanUrl(dekode(url)))}" alt="${alt}" loading="lazy">`));
    s = s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, judul, alias) => {
      const target = dekode(judul).trim();
      return taruh(`<a href="#" class="kb-wiki" data-wiki="${esc(target)}">${alias || judul}</a>`);
    });
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, url) => taruh(`<a href="${esc(amanUrl(dekode(url)))}" target="_blank" rel="noopener">${t}</a>`));
    s = s.replace(/\[\^([^\]]+)\]/g, (_, id) => {
      if (!ctx.catatan.has(id)) ctx.urutCatatan.push(id);
      ctx.catatan.add(id);
      const no = ctx.urutCatatan.indexOf(id) + 1;
      return taruh(`<sup class="kb-fn" data-fn="${esc(id)}">${no}</sup>`);
    });
    s = s.replace(/==([^=]+)==/g, '<mark>$1</mark>');
    // tebal boleh berisi miring utuh, mis. **kotoran *syahwat*** atau **(*HR. Muslim*)**
    s = s.replace(/\*\*((?:[^*]|\*[^*]+\*)+?)\*\*(?!\*)|__((?:[^_]|_[^_]+_)+?)__(?!_)/g, (_, a, b) => `<strong>${a || b}</strong>`);
    s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
    s = s.replace(/(^|[^_\w])_([^_\s][^_]*?)_(?!_)/g, '$1<em>$2</em>');
    s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    s = s.replace(/(^|\s)#([\p{L}][\p{L}\p{N}_\-/]*)/gu, '$1<span class="kb-tag">#$2</span>');
    s = s.replace(RE_AR_RUN, '<span class="kb-ar" dir="rtl" lang="ar">$1</span>');
    s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => simpan[+i]);
    return s;
  }
  /** Teks polos (untuk hitung kata & dibacakan suara). */
  function polos(teks) {
    return String(teks)
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, a, b) => b || a)
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/\[\^[^\]]+\]/g, '')
      .replace(/[*_~=`>#|]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }

  /* ===================== BLOK MARKDOWN (OBSIDIAN) ===================== */
  const CALLOUT = {
    note: ['Catatan', 'fa-pen', '#2563eb'], info: ['Info', 'fa-circle-info', '#2563eb'], tip: ['Tips', 'fa-lightbulb', '#0d9488'], hint: ['Tips', 'fa-lightbulb', '#0d9488'],
    important: ['Penting', 'fa-star', '#0d9488'], success: ['Berhasil', 'fa-check', '#16a34a'], check: ['Berhasil', 'fa-check', '#16a34a'], done: ['Selesai', 'fa-check', '#16a34a'],
    question: ['Pertanyaan', 'fa-circle-question', '#d97706'], help: ['Pertanyaan', 'fa-circle-question', '#d97706'], faq: ['FAQ', 'fa-circle-question', '#d97706'],
    warning: ['Perhatian', 'fa-triangle-exclamation', '#ea580c'], caution: ['Perhatian', 'fa-triangle-exclamation', '#ea580c'], attention: ['Perhatian', 'fa-triangle-exclamation', '#ea580c'],
    failure: ['Gagal', 'fa-xmark', '#dc2626'], danger: ['Bahaya', 'fa-bolt', '#dc2626'], error: ['Kesalahan', 'fa-bolt', '#dc2626'], bug: ['Bug', 'fa-bug', '#dc2626'],
    example: ['Contoh', 'fa-list', '#7c3aed'], quote: ['Kutipan', 'fa-quote-left', '#64748b'], cite: ['Kutipan', 'fa-quote-left', '#64748b'],
    abstract: ['Ringkasan', 'fa-clipboard-list', '#0891b2'], summary: ['Ringkasan', 'fa-clipboard-list', '#0891b2'], tldr: ['Ringkasan', 'fa-clipboard-list', '#0891b2'], todo: ['Tugas', 'fa-circle-check', '#2563eb']
  };

  /** Isi postingan Blogger → teks Markdown (mode HTML: apa adanya; mode tulis: <br>/<div> jadi baris). */
  function keMarkdown(isi) {
    let t = String(isi || '').replace(/\r\n?/g, '\n');
    const adaBaris = (t.match(/\n/g) || []).length;
    const blokHtml = (t.match(/<(div|p|br)\b/gi) || []).length;
    if (adaBaris < 3 && blokHtml > 3) {   // ditulis di mode "Tampilan Menulis"
      t = t.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(div|p|h[1-6]|li)>/gi, '\n').replace(/<(div|p)\b[^>]*>/gi, '');
      t = t.replace(/<(?!img\b|a\b|\/a\b)[^>]+>/gi, '');
    }
    return t;
  }

  /** Baris blok [!kuis] → soal pilihan ganda. Format:
   *  1. Pertanyaan            - [ ] pilihan salah      - [x] pilihan benar      ? Penjelasan: … (opsional) */
  function bacaKuis(baris, daftar) {
    let q = daftar[daftar.length - 1] || null;
    baris.forEach((x) => {
      const t = x.trim();
      if (!t) return;
      let m;
      if ((m = /^\d+[.)]\s+(.*)$/.exec(t))) { q = { soal: m[1], opsi: [], benar: -1, jelas: '' }; daftar.push(q); return; }
      if (!q) { q = { soal: '', opsi: [], benar: -1, jelas: '' }; daftar.push(q); }
      if ((m = /^[-*+]\s+\[([ xX])\]\s*(.*)$/.exec(t))) { if (m[1].trim() && q.benar < 0) q.benar = q.opsi.length; q.opsi.push(m[2]); return; }
      if ((m = /^[-*+]\s+(.*)$/.exec(t))) { q.opsi.push(m[1]); return; }
      if ((m = /^\?\s*(.*)$/.exec(t))) { q.jelas += (q.jelas ? ' ' : '') + m[1].replace(/^penjelasan\s*:\s*/i, ''); return; }
      if (!q.opsi.length) q.soal += (q.soal ? ' ' : '') + t;
    });
  }

  function parse(isi) {
    const lines = keMarkdown(isi).split('\n');
    const ctx = { catatan: new Set(), urutCatatan: [], isiCatatan: {}, kuis: [] };
    const blok = [];
    let gambarPertama = null;
    let i = 0;
    const push = (b) => { b.kata = hitungKata(b.teks || ''); blok.push(b); };
    // frontmatter (boleh didahului kode gambar Blogger)
    let j = 0;
    while (j < lines.length && (!lines[j].trim() || /^\s*</.test(lines[j]))) j++;
    let lewati = null;
    if (j < lines.length && /^---\s*$/.test(lines[j])) {
      const k = lines.findIndex((l, x) => x > j && /^---\s*$/.test(l));
      if (k > j) lewati = [j, k];
    }
    // catatan kaki
    lines.forEach((l) => { const m = /^\[\^([^\]]+)\]:\s*(.*)$/.exec(l); if (m) ctx.isiCatatan[m[1]] = m[2]; });

    while (i < lines.length) {
      if (lewati && i >= lewati[0] && i <= lewati[1]) { i = lewati[1] + 1; continue; }
      const l = lines[i];
      if (!l.trim()) { i++; continue; }
      if (/^\[\^([^\]]+)\]:/.test(l)) { i++; continue; }
      // HTML mentah (kode gambar Blogger, dll.)
      if (/^\s*</.test(l)) {
        const kumpul = [];
        while (i < lines.length && /^\s*</.test(lines[i]) && !(lewati && i >= lewati[0] && i <= lewati[1])) { kumpul.push(lines[i]); i++; }
        const html = bersihkanHtml(kumpul.join('\n'));
        const m = /<img[^>]+src="([^"]+)"/i.exec(html);
        if (m && !gambarPertama) gambarPertama = m[1];
        const tpl = document.createElement('template'); tpl.innerHTML = html;
        push({ tipe: 'html', html, teks: tpl.content.textContent || '' });
        continue;
      }
      let m;
      if ((m = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(l))) {
        push({ tipe: 'judul', level: m[1].length, html: inline(m[2], ctx), teks: polos(m[2]), judul: polos(m[2]) });
        i++; continue;
      }
      if (/^\]\]/.test(l)) {
        const baris = [];
        while (i < lines.length && /^\]\]/.test(lines[i])) { baris.push(lines[i].replace(/^\]\]\s?/, '')); i++; }
        push({ tipe: 'arab', html: baris.map((b) => esc(b)).join('<br>'), teks: baris.join(' '), arab: true });
        continue;
      }
      if (/^```/.test(l)) {
        const kode = []; i++;
        while (i < lines.length && !/^```/.test(lines[i])) { kode.push(lines[i]); i++; }
        i++;
        push({ tipe: 'kode', html: `<pre><code>${esc(kode.join('\n'))}</code></pre>`, teks: kode.join(' ') });
        continue;
      }
      if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(l)) { push({ tipe: 'garis', html: '<hr>', teks: '' }); i++; continue; }
      if (/^\s*>/.test(l)) {
        const baris = [];
        while (i < lines.length && /^\s*>/.test(lines[i])) { baris.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
        const c = /^\[!(\w+)\]([+-]?)\s*(.*)$/.exec(baris[0] || '');
        if (c && /^(kuis|quiz)$/i.test(c[1])) {
          // kuis akhir buku: tidak ditampilkan di halaman baca & tidak dihitung sebagai bacaan
          bacaKuis(baris.slice(1), ctx.kuis);
          for (;;) {   // soal berikutnya boleh berupa blok > terpisah (dipisah baris kosong)
            let j2 = i; while (j2 < lines.length && !lines[j2].trim()) j2++;
            if (j2 >= lines.length || !/^\s*>\s*(\d+[.)]\s+|[-*+]\s+\[[ xX]\]|\?)/.test(lines[j2])) break;
            const lanjut = []; i = j2;
            while (i < lines.length && /^\s*>/.test(lines[i])) { lanjut.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
            bacaKuis(lanjut, ctx.kuis);
          }
          continue;
        }
        if (c) {
          const jenis = c[1].toLowerCase(), info = CALLOUT[jenis] || CALLOUT.note;
          const judul = c[3] || info[0];
          const isiC = baris.slice(1).join('\n');
          const htmlIsi = isiC.split(/\n{2,}/).map((p) => `<p>${p.split('\n').map((x) => inline(x, ctx)).join('<br>')}</p>`).join('');
          const lipat = c[2] === '-';
          push({ tipe: 'callout', html: `<details class="kb-callout" style="--kb-c:${info[2]}" ${lipat ? '' : 'open'}><summary><i class="fa-solid ${info[1]}"></i> ${inline(judul, ctx)}</summary><div class="kb-callout-isi">${htmlIsi}</div></details>`, teks: polos(judul + ' ' + isiC) });
        } else {
          push({ tipe: 'kutipan', html: `<blockquote>${baris.map((x) => inline(x, ctx)).join('<br>')}</blockquote>`, teks: polos(baris.join(' ')) });
        }
        continue;
      }
      if (/\|/.test(l) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(lines[i + 1])) {
        const sel = (x) => x.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c2) => c2.trim());
        const kepala = sel(l); i += 2;
        const isiT = [];
        while (i < lines.length && /\|/.test(lines[i]) && lines[i].trim()) { isiT.push(sel(lines[i])); i++; }
        const html = `<div class="kb-tabel"><table><thead><tr>${kepala.map((h) => `<th>${inline(h, ctx)}</th>`).join('')}</tr></thead><tbody>${isiT.map((r) => `<tr>${r.map((c2) => `<td>${inline(c2, ctx)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
        push({ tipe: 'tabel', html, teks: polos([kepala.join(' '), ...isiT.map((r) => r.join(' '))].join(' ')) });
        continue;
      }
      if (/^\s*([-*+]|\d+[.)])\s+/.test(l)) {
        const item = [];
        while (i < lines.length && (/^\s*([-*+]|\d+[.)])\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && item.length))) {
          const mm = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(lines[i]);
          if (mm) item.push({ indent: mm[1].replace(/\t/g, '    ').length, urut: /\d/.test(mm[2]), isi: mm[3] });
          else item[item.length - 1].isi += ' ' + lines[i].trim();
          i++;
        }
        const render = (daftar, mulai, indent) => {
          let html = '', k = mulai;
          const urut = daftar[mulai].urut;
          html += urut ? '<ol>' : '<ul>';
          while (k < daftar.length && daftar[k].indent >= indent) {
            if (daftar[k].indent > indent) { const r = render(daftar, k, daftar[k].indent); html = html.replace(/<\/li>$/, r.html + '</li>'); k = r.k; continue; }
            let isiI = daftar[k].isi, kelas = '';
            const t = /^\[([ xX])\]\s+(.*)$/.exec(isiI);
            if (t) { kelas = ' class="kb-tugas"'; isiI = `<input type="checkbox" disabled ${t[1].trim() ? 'checked' : ''}> ` + inline(t[2], ctx); }
            else isiI = inline(isiI, ctx);
            html += `<li${kelas}>${isiI}</li>`;
            k++;
          }
          html += urut ? '</ol>' : '</ul>';
          return { html, k };
        };
        push({ tipe: 'daftar', html: render(item, 0, item[0].indent).html, teks: polos(item.map((x) => x.isi.replace(/^\[[ xX]\]\s+/, '')).join(' ')) });
        continue;
      }
      // paragraf
      const baris = [];
      while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|>|\]\]|```|\s*([-*+]|\d+[.)])\s+|\[\^[^\]]+\]:)/.test(lines[i]) && !/^\s*</.test(lines[i])
             && !(/\|/.test(lines[i]) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1]))) {
        if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])) break;
        baris.push(lines[i]); i++;
      }
      const teks = baris.join(' ');
      const arabPenuh = RE_AR.test(teks) && !/[a-zA-Z]{3,}/.test(teks);
      push({ tipe: 'paragraf', html: `<p${arabPenuh ? ' dir="rtl" class="kb-ar-p"' : ''}>${baris.map((x) => inline(x, ctx)).join('<br>')}</p>`, teks: polos(teks), arab: arabPenuh });
    }

    // catatan kaki di akhir buku
    if (ctx.urutCatatan.length) {
      const isiFn = ctx.urutCatatan.map((id, n) => `<li id="kb-fn-${esc(id)}"><b>${n + 1}.</b> ${ctx.isiCatatan[id] != null ? inline(ctx.isiCatatan[id], ctx) : '<i>(catatan kaki belum diisi)</i>'}</li>`).join('');
      push({ tipe: 'catatan', html: `<div class="kb-catatan"><div class="kb-catatan-h">Catatan kaki</div><ol>${isiFn}</ol></div>`, teks: polos(ctx.urutCatatan.map((id) => ctx.isiCatatan[id] || '').join(' ')) });
    }

    // bab: judul level 1 (jika tidak ada, level 2); halaman ±300 kata, selalu mulai baru di awal bab
    const levelBab = blok.some((b) => b.tipe === 'judul' && b.level === 1) ? 1 : blok.some((b) => b.tipe === 'judul' && b.level === 2) ? 2 : 0;
    const bab = [];
    let babNow = { no: 0, judul: 'Pembuka', mulai: 0 };
    let kata = 0, hal = 1, kataHal = 0;
    blok.forEach((b, idx) => {
      if (levelBab && b.tipe === 'judul' && b.level === levelBab) {
        if (idx > 0 && (babNow.no > 0 || kata > 0)) bab.push(babNow);
        babNow = { no: (babNow.no || 0) + 1, judul: b.judul, mulai: kata, blok: idx };
        if (kataHal > 0) { hal++; kataHal = 0; b.halBaru = true; }
      } else if (kataHal >= KATA_PER_HALAMAN) { hal++; kataHal = 0; b.halBaru = true; }
      b.bab = babNow.no || 0;
      b.hal = hal;
      b.kataAwal = kata;
      kata += b.kata;
      kataHal += b.kata;
    });
    bab.push(babNow);
    const daftarBab = bab.filter((b) => b.no > 0 || blok.some((x) => x.bab === 0 && x.kata > 0));
    const kuis = ctx.kuis.filter((q) => q.soal && q.opsi.length >= 2 && q.benar >= 0)
      .map((q) => ({ soal: inline(q.soal, ctx), opsi: q.opsi.map((o) => inline(o, ctx)), benar: q.benar, jelas: q.jelas ? inline(q.jelas, ctx) : '' }));
    return { blok, bab: daftarBab, totalKata: kata, totalHal: hal, gambar: gambarPertama, kuis };
  }

  /* ===================== CSS ===================== */
  const GAYA_CSS = `
  .kb-wrap{font-family:inherit}
  .kb-cover{aspect-ratio:3/4;border-radius:12px;overflow:hidden;position:relative;background:linear-gradient(135deg,var(--kb-c1,#2563eb),var(--kb-c2,#7c3aed));box-shadow:0 6px 18px -8px rgba(15,23,42,.35)}
  .kb-cover img{width:100%;height:100%;object-fit:cover;display:block}
  .kb-cover .kb-cover-t{position:absolute;inset:auto 0 0 0;padding:10px;color:#fff;font-weight:800;font-size:13px;line-height:1.25;background:linear-gradient(transparent,rgba(0,0,0,.65))}
  .kb-reader{position:fixed;inset:0;z-index:10040;display:flex;flex-direction:column;background:var(--kb-bg);color:var(--kb-fg)}
  .kb-reader[data-tema="terang"]{--kb-bg:#ffffff;--kb-fg:#1e293b;--kb-mute:#64748b;--kb-line:#e2e8f0;--kb-soft:#f8fafc;--kb-acc:#2563eb}
  .kb-reader[data-tema="sepia"]{--kb-bg:#f6efe1;--kb-fg:#433422;--kb-mute:#7c6a52;--kb-line:#e4d6bd;--kb-soft:#efe5d2;--kb-acc:#9a5b13}
  .kb-reader[data-tema="gelap"]{--kb-bg:#0f172a;--kb-fg:#e2e8f0;--kb-mute:#94a3b8;--kb-line:#1e293b;--kb-soft:#111c33;--kb-acc:#60a5fa}
  .kb-bar{display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid var(--kb-line);background:var(--kb-bg);flex-wrap:wrap}
  .kb-bar.bawah{border-top:1px solid var(--kb-line);border-bottom:0}
  .kb-btn{height:34px;min-width:34px;padding:0 10px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;gap:6px;font-weight:700;font-size:12px;color:var(--kb-fg);background:transparent;border:1px solid transparent;cursor:pointer}
  .kb-btn:hover{background:var(--kb-soft);border-color:var(--kb-line)}
  .kb-btn.on{background:var(--kb-acc);color:#fff}
  .kb-btn:disabled{opacity:.4;cursor:default}
  .kb-judul{flex:1;min-width:0}
  .kb-judul b{display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .kb-judul span{font-size:11px;color:var(--kb-mute)}
  .kb-sesi{padding:6px 14px 8px;border-bottom:1px solid var(--kb-line);font-size:11px;color:var(--kb-mute)}
  .kb-sesi .kb-pg{height:5px;border-radius:9px;background:var(--kb-line);overflow:hidden;margin-top:4px}
  .kb-sesi .kb-pg > div{height:100%;background:var(--kb-acc);transition:width .6s}
  .kb-sesi.ok{color:#16a34a}.kb-sesi.ok .kb-pg > div{background:#16a34a}
  .kb-isi{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;scroll-behavior:auto}
  .kb-teks{max-width:720px;margin:0 auto;padding:28px 20px 45vh;font-size:var(--kb-fs,17px);line-height:var(--kb-lh,1.75)}
  .kb-teks h1,.kb-teks h2,.kb-teks h3,.kb-teks h4{font-weight:800;line-height:1.3;margin:1.6em 0 .6em}
  .kb-teks h1{font-size:1.55em}.kb-teks h2{font-size:1.3em}.kb-teks h3{font-size:1.12em}.kb-teks h4{font-size:1em}
  .kb-teks p{margin:0 0 1em}
  .kb-teks ul,.kb-teks ol{margin:0 0 1em 1.4em;padding:0}
  .kb-teks ul{list-style:disc}.kb-teks ol{list-style:decimal}
  .kb-teks li{margin:.2em 0}
  .kb-teks li.kb-tugas{list-style:none;margin-left:-1.3em}
  .kb-teks mark{background:#fde68a;color:inherit;padding:0 .15em;border-radius:3px}
  .kb-reader[data-tema="gelap"] .kb-teks mark{background:#854d0e;color:#fef3c7}
  .kb-teks blockquote{margin:0 0 1em;padding:.6em 1em;border-left:4px solid var(--kb-line);color:var(--kb-mute);background:var(--kb-soft);border-radius:0 10px 10px 0}
  .kb-teks img{max-width:100%;height:auto;border-radius:10px;display:block;margin:0 auto}
  .kb-teks a{color:var(--kb-acc);text-decoration:underline}
  .kb-teks code{font-family:ui-monospace,monospace;font-size:.88em;background:var(--kb-soft);padding:.1em .35em;border-radius:5px}
  .kb-teks pre{background:var(--kb-soft);padding:12px;border-radius:10px;overflow-x:auto;margin:0 0 1em}
  .kb-teks hr{border:0;border-top:1px solid var(--kb-line);margin:1.6em 0}
  .kb-tabel{overflow-x:auto;margin:0 0 1em}
  .kb-teks table{border-collapse:collapse;width:100%;font-size:.92em}
  .kb-teks th,.kb-teks td{border:1px solid var(--kb-line);padding:.45em .7em;text-align:left}
  .kb-teks th{background:var(--kb-soft);font-weight:800}
  .kb-ar,.kb-ar-p,.kb-arab{font-family:'Amiri','Traditional Arabic',serif}
  .kb-ar{font-size:1.22em}
  .kb-arab{direction:rtl;text-align:right;font-size:1.55em;line-height:2.1;margin:0 0 .7em;padding:.7em 1em;border-right:4px solid var(--kb-acc);background:var(--kb-soft);border-radius:10px 0 0 10px}
  .kb-ar-p{text-align:right;font-size:1.3em;line-height:2}
  .kb-callout{margin:0 0 1em;border-radius:10px;border:1px solid color-mix(in srgb,var(--kb-c) 35%,transparent);background:color-mix(in srgb,var(--kb-c) 9%,transparent)}
  .kb-callout summary{cursor:pointer;padding:.55em .9em;font-weight:800;color:var(--kb-c);list-style:none}
  .kb-callout summary::-webkit-details-marker{display:none}
  .kb-callout-isi{padding:0 .9em .4em}
  .kb-fn{color:var(--kb-acc);font-weight:800;cursor:pointer;padding:0 .1em}
  .kb-catatan{border-top:1px solid var(--kb-line);margin-top:2em;padding-top:1em;font-size:.9em;color:var(--kb-mute)}
  .kb-catatan-h{font-weight:800;margin-bottom:.4em}
  .kb-catatan ol{list-style:none;margin:0}
  .kb-tag{display:inline-block;font-size:.78em;font-weight:700;color:var(--kb-acc);background:var(--kb-soft);border-radius:999px;padding:0 .5em}
  .kb-hal{display:flex;align-items:center;gap:10px;color:var(--kb-mute);font-size:11px;font-weight:700;margin:1.4em 0;letter-spacing:.04em}
  .kb-hal::before,.kb-hal::after{content:'';flex:1;border-top:1px dashed var(--kb-line)}
  .kb-blok-aktif{background:color-mix(in srgb,var(--kb-acc) 12%,transparent);border-radius:8px;box-shadow:0 0 0 6px color-mix(in srgb,var(--kb-acc) 12%,transparent)}
  .kb-toast{position:fixed;left:50%;top:70px;transform:translateX(-50%);z-index:10050;background:#1e293b;color:#fff;padding:9px 16px;border-radius:999px;font-weight:700;font-size:13px;box-shadow:0 10px 30px -10px rgba(0,0,0,.5);max-width:90vw;text-align:center}
  .kb-toast.peringatan{background:#d97706}.kb-toast.ok{background:#16a34a}
  .kb-pop{position:absolute;right:10px;top:52px;z-index:5;width:min(330px,92vw);background:var(--kb-bg);color:var(--kb-fg);border:1px solid var(--kb-line);border-radius:12px;box-shadow:0 18px 40px -12px rgba(0,0,0,.35);padding:12px;font-size:12px;max-height:70vh;overflow:auto}
  .kb-pop h4{font-weight:800;font-size:12px;margin:0 0 8px}
  .kb-opsi{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
  .kb-opsi button{flex:1;min-width:60px;padding:7px;border-radius:8px;border:1px solid var(--kb-line);background:var(--kb-soft);color:var(--kb-fg);font-weight:700;cursor:pointer}
  .kb-opsi button.on{border-color:var(--kb-acc);box-shadow:0 0 0 2px var(--kb-acc) inset}
  .kb-kec{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--kb-mute)}
  .kb-kec input{width:110px}
  .kb-pos{margin-left:auto;font-size:11px;color:var(--kb-mute);font-weight:700;white-space:nowrap}
  @media (max-width:640px){.kb-teks{padding:20px 16px 45vh}.kb-sembunyi-hp{display:none!important}.kb-kec input{width:80px}}
  `;
  function pasangGaya() {
    if (!document.getElementById('kb-css')) {
      const s = document.createElement('style'); s.id = 'kb-css'; s.textContent = GAYA_CSS; document.head.appendChild(s);
    }
    if (!document.getElementById('kb-amiri')) {
      const l = document.createElement('link'); l.id = 'kb-amiri'; l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap';
      document.head.appendChild(l);
    }
  }
  function toast(teks, jenis, ms) {
    let t = document.getElementById('kb-toast');
    if (!t) { t = document.createElement('div'); t.id = 'kb-toast'; document.body.appendChild(t); }
    t.className = 'kb-toast' + (jenis ? ' ' + jenis : '');
    t.textContent = teks;
    clearTimeout(t._h);
    t._h = setTimeout(() => t.remove(), ms || 3200);
  }

  /* ===================== DATA: FEED BLOGGER ===================== */
  const PALET = [['#2563eb', '#7c3aed'], ['#0d9488', '#2563eb'], ['#ea580c', '#db2777'], ['#16a34a', '#0d9488'], ['#7c3aed', '#db2777'], ['#0891b2', '#4f46e5']];
  function kategoriDari(labels) {
    const l = (labels || []).find((x) => /^kekal\s+/i.test(x));
    return l ? l.replace(/^kekal\s+/i, '').trim() : 'Umum';
  }
  function idPost(e) { return String((e.id && e.id.$t) || '').split('post-').pop(); }
  function sampul(url, ukuran) { return url ? url.replace(/\/s\d+(-c)?\//, `/s${ukuran || 600}/`).replace(/=s\d+(-c)?$/, `=s${ukuran || 600}`) : null; }
  async function ambilDaftar(base) {
    const out = [];
    for (let mulai = 1, n = 0; n < 20; n++) {
      const r = await fetch(`${base}/feeds/posts/summary?alt=json&max-results=150&start-index=${mulai}&_=${Date.now()}`, { cache: 'no-store' });
      if (!r.ok) throw new Error('Daftar buku gagal dimuat dari Blogger (' + r.status + ').');
      const j = await r.json();
      const e = (j.feed && j.feed.entry) || [];
      e.forEach((x) => {
        const labels = (x.category || []).map((c) => c.term);
        out.push({ id: idPost(x), judul: (x.title && x.title.$t) || '(Tanpa judul)', label: labels, kategori: kategoriDari(labels),
          terbit: (x.published && x.published.$t) || '', sampul: sampul(x.media$thumbnail && x.media$thumbnail.url, 600) });
      });
      if (e.length < 150) break;
      mulai += 150;
    }
    out.sort((a, b) => (a.kategori === b.kategori ? String(a.terbit).localeCompare(String(b.terbit)) : a.kategori === 'Umum' ? 1 : b.kategori === 'Umum' ? -1 : a.kategori.localeCompare(b.kategori)));
    return out;
  }
  async function ambilIsi(base, id) {
    const r = await fetch(`${base}/feeds/posts/default/${encodeURIComponent(id)}?alt=json&_=${Date.now()}`, { cache: 'no-store' });
    if (!r.ok) throw new Error('Isi buku gagal dimuat dari Blogger (' + r.status + ').');
    const j = await r.json();
    const e = j.entry || {};
    return { judul: (e.title && e.title.$t) || '', isi: (e.content && e.content.$t) || (e.summary && e.summary.$t) || '', label: (e.category || []).map((c) => c.term) };
  }

  /* ===================== STATUS & PERPUSTAKAAN ===================== */
  let O = null;            // opsi dari dashboard
  let S = { daftar: [], posisi: {}, status: null, wadah: null };
  let R = null;            // keadaan pembaca yang sedang terbuka

  async function rpc(nama, args) {
    const { data, error } = await O.sb.rpc(nama, args || {});
    if (error) throw error;
    return data;
  }
  async function muatStatus() {
    try { S.status = await rpc('kl_baca_status'); } catch (e) { S.status = null; }
    if (O.onStatus) try { O.onStatus(S.status); } catch (e) {}
    return S.status;
  }
  async function muatPosisi() {
    S.posisi = {};
    try {
      const { data } = await O.sb.from('baca_posisi').select('*').eq('user_id', O.userId);
      (data || []).forEach((p) => { S.posisi[p.buku_id] = p; });
    } catch (e) { /* tabel belum dibuat */ }
  }

  function htmlStatus() {
    const st = S.status;
    if (!st) return `<div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-semibold"><i class="fa-solid fa-circle-info"></i> Pencatatan baca belum aktif di database. ${O.isAdmin ? 'Jalankan <b>sql-buku-kekal.sql</b> di Supabase.' : 'Hubungi admin.'}</div>`;
    if (O.isAdmin) return '';
    if (!st.aktif) return `<div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600"><i class="fa-solid fa-book-open text-blue-600"></i> Selamat membaca. Posisi baca Anda tersimpan otomatis.</div>`;
    if (st.hsi) return `<div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold"><i class="fa-solid fa-graduation-cap"></i> NIP Santri HSI terverifikasi untuk klaim berikutnya · ${esc(st.hsi.target)}</div>`;
    const s = st.sesi;
    if (s && s.status === 'kuis') return `<div class="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900"><div class="flex items-center justify-between gap-3 flex-wrap"><div class="min-w-0"><div class="text-sm font-extrabold"><i class="fa-solid fa-clipboard-question"></i> Target baca terpenuhi · tinggal kuis</div><div class="text-[11px] mt-1">Kerjakan kuis buku <b>${esc(s.buku_judul || '')}</b> untuk membuka klaim tema (minimal ${st.kuis_min_persen || 60}% benar).</div></div><button type="button" data-kb-kuis="${esc(s.buku_id || '')}" class="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0"><i class="fa-solid fa-play"></i> Kerjakan kuis</button></div></div>`;
    if (s && s.status === 'selesai') return `<div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900"><div class="text-sm font-extrabold"><i class="fa-solid fa-circle-check"></i> Syarat baca terpenuhi. Silakan klaim tema.</div><div class="text-[11px] mt-1">${esc(s.ringkasan || '')}${s.kuis_status === 'lulus' ? ` · Kuis ${s.kuis_benar}/${s.kuis_jumlah}` : ''}</div></div>`;
    const sah = s ? s.kata_sah : 0, tgt = (s && s.target_kata) || st.target_kata || 1260;
    const persen = Math.min(100, Math.round(sah * 100 / tgt));
    return `<div class="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
      <div class="flex items-center justify-between gap-2"><div class="text-sm font-extrabold"><i class="fa-solid fa-book-open-reader"></i> Wajib baca sebelum klaim tema berikutnya</div><div class="text-xs font-bold tabular-nums">${angka(sah)} / ${angka(tgt)} kata</div></div>
      <div class="h-2 rounded-full bg-blue-100 overflow-hidden mt-2"><div class="h-full bg-blue-600" style="width:${persen}%"></div></div>
      <div class="text-[11px] mt-1.5">Baca dengan tenang (±${Math.ceil(tgt / (st.normal_wpm || 180))} menit). Jika buku lebih pendek, cukup sampai akhir buku. Santri HSI aktif bisa verifikasi NIP di form klaim sebagai gantinya.</div>
      ${st.gagal_kuis ? `<div class="text-[11px] mt-1.5 font-semibold text-amber-700"><i class="fa-solid fa-rotate-left"></i> Kesempatan kuis buku "${esc(st.gagal_kuis.buku_judul || '')}" sudah habis. Silakan baca ulang sampai target, lalu kerjakan kuisnya lagi.</div>` : ''}
    </div>`;
  }

  function kartuBuku(b, i) {
    const p = S.posisi[b.id];
    const persen = p ? Math.round(Number(p.persen) || 0) : 0;
    const [c1, c2] = PALET[i % PALET.length];
    return `<button type="button" data-kb-buka="${esc(b.id)}" class="text-left group">
      <div class="kb-cover" style="--kb-c1:${c1};--kb-c2:${c2}">${b.sampul ? `<img src="${esc(b.sampul)}" alt="" loading="lazy">` : ''}<div class="kb-cover-t">${esc(b.judul)}</div></div>
      <div class="mt-2 text-xs font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-700">${esc(b.judul)}</div>
      <div class="mt-1 h-1.5 rounded-full bg-slate-200 overflow-hidden"><div class="h-full ${persen >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}" style="width:${persen}%"></div></div>
      <div class="text-[10px] text-slate-400 mt-0.5">${p ? (persen >= 100 ? 'Selesai dibaca' : `${persen}% · Bab ${p.bab || 1} hal. ${p.halaman || 1}`) : 'Belum dibaca'}</div>
    </button>`;
  }

  async function renderPerpustakaan() {
    const w = S.wadah;
    w.innerHTML = `<div class="kb-wrap space-y-4"><div id="kb-status">${htmlStatus()}</div><div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-sm text-slate-400"><i class="fa-solid fa-spinner fa-spin"></i> Memuat buku dari blog…</div></div>`;
    try {
      [S.daftar] = await Promise.all([ambilDaftar(O.feedBase), muatPosisi()]);
    } catch (e) {
      w.querySelector('.kb-wrap').lastElementChild.innerHTML = `<span class="text-rose-600 font-semibold">${esc(e.message)}</span>`;
      return;
    }
    const kat = {};
    S.daftar.forEach((b) => { (kat[b.kategori] = kat[b.kategori] || []).push(b); });
    const terakhir = Object.values(S.posisi).filter((p) => Number(p.persen) < 100 && S.daftar.some((b) => b.id === p.buku_id))
      .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))[0];
    let n = 0;
    w.innerHTML = `<div class="kb-wrap space-y-4">
      <div id="kb-status">${htmlStatus()}</div>
      ${terakhir ? `<div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0"><i class="fa-solid fa-bookmark"></i></div><div class="flex-1 min-w-0"><div class="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Lanjutkan membaca</div><div class="text-sm font-extrabold text-slate-800 truncate">${esc(terakhir.judul || '')}</div><div class="text-[11px] text-slate-500">${esc(terakhir.kategori || '')} · Bab ${terakhir.bab || 1} hal. ${terakhir.halaman || 1} · ${Math.round(Number(terakhir.persen) || 0)}%</div></div><button type="button" data-kb-buka="${esc(terakhir.buku_id)}" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0">Lanjutkan</button></div>` : ''}
      ${S.daftar.length ? Object.keys(kat).map((k) => `<div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
          <div class="flex items-center justify-between mb-3"><h3 class="font-extrabold text-slate-800"><i class="fa-solid fa-book text-blue-600"></i> ${k === 'Umum' ? 'Umum' : 'KEKAL ' + esc(k)}</h3><span class="text-[11px] text-slate-400 font-semibold">${kat[k].length} buku</span></div>
          <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">${kat[k].map((b) => kartuBuku(b, n++)).join('')}</div>
        </div>`).join('') : '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-sm text-slate-500">Belum ada buku. Admin dapat memposting buku di Blogger dengan label <b>KEKAL …</b> (mis. KEKAL Aqidah).</div>'}
      ${O.isAdmin ? '<div id="kb-admin"></div>' : ''}
    </div>`;
    w.querySelectorAll('[data-kb-buka]').forEach((b) => b.addEventListener('click', () => bukaBuku(b.dataset.kbBuka)));
    w.querySelector('#kb-status').addEventListener('click', (e) => {   // tombol "Kerjakan kuis" (kartu status digambar ulang)
      const b = e.target.closest('[data-kb-kuis]');
      if (b && b.dataset.kbKuis) bukaBuku(b.dataset.kbKuis).then(() => bukaKuis());
    });
    if (O.isAdmin) renderAdmin();
  }
  function segarkanStatusKartu() {
    const el = S.wadah && S.wadah.querySelector('#kb-status');
    if (el) el.innerHTML = htmlStatus();
  }

  /* ===================== PEMBACA ===================== */
  const PREF_KEY = 'kl_buku_tampilan';
  function pref() { try { return Object.assign({ tema: 'terang', fs: 17, lh: 1.75, wpm: 0, suara: false }, JSON.parse(localStorage.getItem(PREF_KEY)) || {}); } catch (e) { return { tema: 'terang', fs: 17, lh: 1.75, wpm: 0, suara: false }; } }
  function simpanPref() { try { localStorage.setItem(PREF_KEY, JSON.stringify(R.pref)); } catch (e) {} }

  async function bukaBuku(id) {
    const info = S.daftar.find((b) => b.id === id) || { id, judul: '', kategori: 'Umum' };
    toast('Membuka buku…', '', 1500);
    let data;
    try { data = await ambilIsi(O.feedBase, id); } catch (e) { toast(e.message, 'peringatan', 5000); return; }
    const hasil = parse(data.isi);
    tutupPembaca(true);
    R = {
      id, judul: data.judul || info.judul, kategori: kategoriDari(data.label.length ? data.label : info.label), buku: hasil,
      pref: pref(), elBlok: [], posKirim: null, jeda: true, interaksi: Date.now(), auto: false, raf: 0, tts: null,
      kecepatanCepat: [], sesi: null, timer: 0, ttsPos: null
    };
    if (!R.pref.wpm) R.pref.wpm = (S.status && S.status.normal_wpm) || 180;
    bangunPembaca();
    const p = S.posisi[id];
    if (p && p.kata_posisi > 0 && Number(p.persen) < 100) lompatKe(p.kata_posisi, false); else R.isi.scrollTop = 0;
    R.posKirim = posisiSekarang();
    perbaruiPosisi();
    R.timer = setInterval(detak, 5000);
    R.onVis = () => { if (document.visibilityState !== 'visible') jedaBaca(); };
    R.onBlur = () => jedaBaca();
    document.addEventListener('visibilitychange', R.onVis);
    window.addEventListener('blur', R.onBlur);
    if (S.status && S.status.aktif && !O.isAdmin) catat(0);   // mulai / lanjutkan sesi
  }

  function bangunPembaca() {
    const el = document.createElement('div');
    el.className = 'kb-reader';
    el.dataset.tema = R.pref.tema;
    const b = R.buku;
    let isiHtml = '';
    b.blok.forEach((x, i) => {
      if (x.halBaru) isiHtml += `<div class="kb-hal" data-kb-hal="${x.hal}">Halaman ${x.hal}</div>`;
      const kelas = x.tipe === 'arab' ? 'kb-arab' : '';
      const tag = x.tipe === 'judul' ? 'h' + Math.min(4, x.level) : 'div';
      isiHtml += `<${tag} class="kb-blok ${kelas}" data-kb-i="${i}"${x.tipe === 'arab' ? ' dir="rtl" lang="ar"' : ''}>${x.html}</${tag}>`;
    });
    if (b.kuis && b.kuis.length) {
      gayaKuis();
      const jk = b.kuis.length;   // muncul (dengan animasi) setelah digulir sampai ujung buku
      isiHtml += `<div class="kb-kuis-akhir" data-kb-akhir><div class="kq-ak-emoji">📝</div><h4>Kuis Buku Ini</h4><p>${jk} soal pilihan ganda${kuisWajib() ? ` · minimal ${minBenar(jk)} benar untuk membuka klaim tema` : ''}</p><button type="button" class="kq-ak-btn" data-kb="kuis"><i class="fa-solid fa-rocket"></i> Kerjakan Kuis Sekarang</button></div>`;
    }
    el.innerHTML = `
      <div class="kb-bar">
        <button class="kb-btn" data-kb="tutup" title="Kembali ke daftar buku"><i class="fa-solid fa-arrow-left"></i></button>
        <div class="kb-judul"><b>${esc(R.judul)}</b><span>${R.kategori === 'Umum' ? 'Umum' : 'KEKAL ' + esc(R.kategori)} · ${angka(b.totalKata)} kata · ${b.totalHal} halaman</span></div>
        <select class="kb-btn kb-sembunyi-hp" data-kb="bab" style="max-width:190px;border-color:var(--kb-line)">${b.bab.map((x) => `<option value="${x.mulai}">${x.no && !/^bab\s*\d/i.test(x.judul) ? 'Bab ' + x.no + ' – ' : ''}${esc(x.judul)}</option>`).join('')}</select>
        <button class="kb-btn" data-kb="penanda" title="Penanda baca"><i class="fa-solid fa-bookmark"></i></button>
        <button class="kb-btn" data-kb="tampilan" title="Mode baca"><span style="font-weight:800">Aa</span></button>
        <button class="kb-btn kb-sembunyi-hp" data-kb="penuh" title="Layar penuh"><i class="fa-solid fa-expand"></i></button>
      </div>
      <div class="kb-sesi" data-kb="sesi" style="${S.status && S.status.aktif && !O.isAdmin ? '' : 'display:none'}"></div>
      <div class="kb-isi" data-kb="isi"><article class="kb-teks" style="--kb-fs:${R.pref.fs}px;--kb-lh:${R.pref.lh}">${b.gambar && !b.blok.some((x) => x.tipe === 'html') ? `<img src="${esc(b.gambar)}" alt="">` : ''}${isiHtml}</article></div>
      <div class="kb-bar bawah">
        <button class="kb-btn" data-kb="play" title="Gulir otomatis"><i class="fa-solid fa-play"></i> <span class="kb-sembunyi-hp">Play</span></button>
        <button class="kb-btn ${R.pref.suara ? 'on' : ''}" data-kb="suara" title="Dibacakan suara (kecepatan normal)"><i class="fa-solid fa-volume-high"></i></button>
        <label class="kb-kec" title="Kecepatan gulir otomatis"><i class="fa-solid fa-gauge"></i><input type="range" min="120" max="250" step="10" value="${R.pref.wpm}" data-kb="wpm"><span data-kb="wpm-t">${R.pref.wpm}</span><span class="kb-sembunyi-hp">kata/menit</span></label>
        <span class="kb-pos" data-kb="pos"></span>
      </div>`;
    document.body.appendChild(el);
    document.documentElement.style.overflow = 'hidden';
    R.el = el;
    R.isi = el.querySelector('[data-kb="isi"]');
    R.elBlok = [...el.querySelectorAll('[data-kb-i]')].map((n) => ({ el: n, b: b.blok[+n.dataset.kbI] }));
    renderSesi();

    const tandaiInteraksi = () => { R.interaksi = Date.now(); };
    const hentikanAuto = () => { tandaiInteraksi(); if (R.auto) setAuto(false); };   // menggulir sendiri = ambil alih dari play otomatis / suara
    R.isi.addEventListener('scroll', () => { tandaiInteraksi(); perbaruiPosisi(); cekUjungKuis(); }, { passive: true });
    requestAnimationFrame(cekUjungKuis);   // buku pendek yang muat satu layar
    R.isi.addEventListener('wheel', hentikanAuto, { passive: true });
    R.isi.addEventListener('touchstart', hentikanAuto, { passive: true });
    R.isi.addEventListener('pointerdown', tandaiInteraksi);
    el.addEventListener('keydown', tandaiInteraksi);
    el.addEventListener('click', onKlik);
    el.querySelector('[data-kb="bab"]').addEventListener('change', (e) => { lompatKe(+e.target.value, true); });
    el.querySelector('[data-kb="wpm"]').addEventListener('input', (e) => { R.pref.wpm = +e.target.value; el.querySelector('[data-kb="wpm-t"]').textContent = R.pref.wpm; simpanPref(); });
  }

  function onKlik(e) {
    const a = e.target.closest('[data-kb]');
    const wiki = e.target.closest('[data-wiki]');
    const fn = e.target.closest('[data-fn]');
    if (wiki) {
      e.preventDefault();
      const t = S.daftar.find((b) => b.judul.trim().toLowerCase() === wiki.dataset.wiki.toLowerCase());
      if (t) bukaBuku(t.id); else toast('Buku "' + wiki.dataset.wiki + '" belum tersedia.', '', 2500);
      return;
    }
    if (fn) { const t = R.el.querySelector('#kb-fn-' + CSS.escape(fn.dataset.fn)); if (t) { t.scrollIntoView({ block: 'center', behavior: 'smooth' }); t.style.background = 'var(--kb-soft)'; setTimeout(() => { t.style.background = ''; }, 1800); } return; }
    const AKSI = ['tutup', 'play', 'suara', 'penuh', 'tampilan', 'penanda', 'kuis'];
    if (!a || !AKSI.includes(a.dataset.kb)) { if (!e.target.closest('.kb-pop')) tutupPop(); return; }
    const k = a.dataset.kb;
    if (k === 'tutup') return mintaTutup();
    if (k === 'play') return setAuto(!R.auto);
    if (k === 'suara') { R.pref.suara = !R.pref.suara; simpanPref(); a.classList.toggle('on', R.pref.suara); if (R.auto) { setAuto(false); setAuto(true); } return; }
    if (k === 'penuh') { if (document.fullscreenElement) document.exitFullscreen(); else if (R.el.requestFullscreen) R.el.requestFullscreen().catch(() => {}); return; }
    if (k === 'tampilan') return popTampilan();
    if (k === 'penanda') return popPenanda();
    if (k === 'kuis') return kuisDariTombol();
  }
  function tutupPop() { if (R && R.pop) { R.pop.remove(); R.pop = null; } }

  function popTampilan() {
    tutupPop();
    const p = document.createElement('div');
    p.className = 'kb-pop';
    const render = () => {
      p.innerHTML = `<h4>Mode baca</h4>
        <div class="kb-opsi">${[['terang', 'Terang'], ['sepia', 'Sepia'], ['gelap', 'Gelap']].map(([v, t]) => `<button data-t="${v}" class="${R.pref.tema === v ? 'on' : ''}">${t}</button>`).join('')}</div>
        <h4>Ukuran huruf</h4>
        <div class="kb-opsi">${[[15, 'A-'], [17, 'A'], [19, 'A+'], [22, 'A++']].map(([v, t]) => `<button data-f="${v}" class="${R.pref.fs === v ? 'on' : ''}">${t}</button>`).join('')}</div>
        <h4>Jarak baris</h4>
        <div class="kb-opsi">${[[1.55, 'Rapat'], [1.75, 'Normal'], [2.05, 'Lega']].map(([v, t]) => `<button data-l="${v}" class="${R.pref.lh === v ? 'on' : ''}">${t}</button>`).join('')}</div>`;
    };
    render();
    p.addEventListener('click', (e) => {
      e.stopPropagation();   // isi popup digambar ulang; jangan sampai dianggap klik di luar popup
      const b = e.target.closest('button'); if (!b) return;
      const pos = posisiSekarang();
      if (b.dataset.t) { R.pref.tema = b.dataset.t; R.el.dataset.tema = R.pref.tema; }
      if (b.dataset.f) R.pref.fs = +b.dataset.f;
      if (b.dataset.l) R.pref.lh = +b.dataset.l;
      const art = R.el.querySelector('.kb-teks'); art.style.setProperty('--kb-fs', R.pref.fs + 'px'); art.style.setProperty('--kb-lh', R.pref.lh);
      lompatKe(pos, false);
      R.posKirim = posisiSekarang();
      simpanPref(); render();
    });
    R.el.appendChild(p); R.pop = p;
  }

  async function popPenanda() {
    tutupPop();
    const p = document.createElement('div');
    p.className = 'kb-pop';
    R.el.appendChild(p); R.pop = p;
    const render = async () => {
      let daftar = [];
      try { const { data } = await O.sb.from('baca_penanda').select('*').eq('buku_id', R.id).order('kata_posisi', { ascending: true }); daftar = data || []; } catch (e) {}
      if (!R || R.pop !== p) return;
      p.innerHTML = `<h4>Penanda baca</h4>
        <div style="display:flex;gap:6px;margin-bottom:10px"><input data-cat placeholder="Catatan (opsional)" style="flex:1;min-width:0;padding:7px 9px;border-radius:8px;border:1px solid var(--kb-line);background:var(--kb-soft);color:var(--kb-fg)"><button class="kb-btn on" data-tambah><i class="fa-solid fa-plus"></i></button></div>
        ${daftar.length ? daftar.map((x) => `<div style="display:flex;align-items:center;gap:6px;padding:6px 0;border-top:1px solid var(--kb-line)"><button data-loncat="${x.kata_posisi}" style="flex:1;text-align:left;background:none;border:0;color:var(--kb-fg);cursor:pointer"><b>Bab ${x.bab || 1} · hal. ${x.halaman || 1}</b><div style="color:var(--kb-mute)">${esc(x.catatan || '')}</div></button><button data-hapus="${x.id}" class="kb-btn" title="Hapus"><i class="fa-solid fa-trash"></i></button></div>`).join('') : '<div style="color:var(--kb-mute)">Belum ada penanda di buku ini.</div>'}`;
    };
    p.addEventListener('click', async (e) => {
      e.stopPropagation();
      const t = e.target.closest('[data-tambah]'), l = e.target.closest('[data-loncat]'), h = e.target.closest('[data-hapus]');
      if (t) {
        const pos = posisiSekarang(), bh = babHal(pos);
        const { error } = await O.sb.from('baca_penanda').insert([{ user_id: O.userId, buku_id: R.id, kata_posisi: pos, bab: bh.bab, halaman: bh.hal, catatan: p.querySelector('[data-cat]').value.trim() || null }]);
        if (error) toast('Penanda gagal disimpan: ' + error.message, 'peringatan', 4000); else { toast('Penanda disimpan', 'ok'); render(); }
      }
      if (l) { lompatKe(+l.dataset.loncat, true); tutupPop(); }
      if (h) { await O.sb.from('baca_penanda').delete().eq('id', h.dataset.hapus); render(); }
    });
    render();
  }

  /* --- posisi baca (berdasarkan garis baca 35% dari atas layar) --- */
  function posisiSekarang() {
    if (!R) return 0;
    if (R.tts && R.ttsPos != null) return Math.round(R.ttsPos);
    const isi = R.isi, total = R.buku.totalKata;
    if (isi.scrollTop + isi.clientHeight >= isi.scrollHeight - 4) return total;
    const garis = isi.scrollTop + isi.clientHeight * 0.35;
    let pos = 0;
    for (const { el, b } of R.elBlok) {
      const atas = el.offsetTop, tinggi = el.offsetHeight || 1;
      if (garis < atas) break;
      pos = b.kataAwal + b.kata * Math.min(1, (garis - atas) / tinggi);
    }
    return Math.max(0, Math.min(total, Math.round(pos)));
  }
  function babHal(pos) {
    let bab = 1, hal = 1;
    for (const x of R.buku.blok) { if (x.kataAwal > pos) break; bab = x.bab || 1; hal = x.hal; }
    return { bab, hal };
  }
  function lompatKe(pos, halus) {
    const t = R.elBlok.find(({ b }) => b.kataAwal + b.kata > pos) || R.elBlok[R.elBlok.length - 1];
    if (!t) return;
    const frac = t.b.kata ? (pos - t.b.kataAwal) / t.b.kata : 0;
    const y = t.el.offsetTop + t.el.offsetHeight * Math.max(0, frac) - R.isi.clientHeight * 0.35;
    R.isi.scrollTo({ top: Math.max(0, y), behavior: halus ? 'smooth' : 'auto' });
    if (halus) R.posKirim = null;   // lompat bab/penanda tidak dihitung sebagai bacaan
  }
  function perbaruiPosisi() {
    if (!R) return;
    const pos = posisiSekarang(), bh = babHal(pos), persen = R.buku.totalKata ? Math.round(pos * 100 / R.buku.totalKata) : 0;
    const el = R.el.querySelector('[data-kb="pos"]');
    if (el) el.textContent = `Bab ${bh.bab} · hal. ${bh.hal}/${R.buku.totalHal} · ${persen}%`;
    const sel = R.el.querySelector('[data-kb="bab"]');
    if (sel && document.activeElement !== sel) { const opt = [...sel.options].filter((o) => +o.value <= pos).pop(); if (opt) sel.value = opt.value; }
  }
  /* ===================== KUIS AKHIR BUKU ===================== */
  // Soal ditulis di postingan (blok > [!kuis]). Database hanya menyimpan skor (sql-kuis-buku.sql).
  const KUIS_CSS = `
  .kq-latar{position:absolute;inset:0;z-index:20;background:rgba(15,23,42,.55);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:16px;animation:kq-fade .25s ease}
  .kq-kartu{position:relative;width:min(460px,100%);max-height:calc(100% - 16px);overflow:auto;background:#fff;color:#1e293b;border-radius:22px;padding:22px 20px 18px;box-shadow:0 30px 60px -20px rgba(0,0,0,.5);animation:kq-naik .45s cubic-bezier(.2,1.4,.4,1)}
  .kb-reader[data-tema="gelap"] .kq-kartu{background:#1e293b;color:#e2e8f0}
  .kq-x{position:absolute;right:10px;top:8px;width:32px;height:32px;border-radius:50%;border:0;background:transparent;color:#94a3b8;font-size:22px;line-height:1;cursor:pointer;z-index:3}
  .kq-hero{text-align:center}
  .kq-emoji{font-size:56px;line-height:1;margin:4px 0 10px}
  .kq-pop{animation:kq-pop .7s cubic-bezier(.2,1.6,.4,1) both}
  .kq-hero h3{font-size:22px;font-weight:900;margin:0}
  .kq-hero p{margin:6px 0 0;color:#64748b;font-size:14px;line-height:1.5}
  .kq-ringkas{margin-top:12px;font-size:11px;color:#64748b;background:rgba(100,116,139,.1);border-radius:10px;padding:8px 10px;line-height:1.5}
  .kq-teks{text-align:center;font-size:14px;line-height:1.5;margin:14px 0 0}
  .kq-aksi{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap}
  .kq-tombol{flex:1;min-width:140px;height:46px;border-radius:14px;border:1.5px solid rgba(100,116,139,.3);background:transparent;color:inherit;font-weight:800;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .15s,opacity .2s}
  .kq-tombol:active:not(:disabled){transform:scale(.96)}
  .kq-tombol.utama{background:linear-gradient(135deg,#2563eb,#7c3aed);border-color:transparent;color:#fff;box-shadow:0 10px 20px -10px #4f46e5}
  .kq-tombol:disabled{opacity:.35;cursor:default}
  .kq-link{display:block;margin:12px auto 0;background:none;border:0;color:#94a3b8;font-weight:700;font-size:12px;cursor:pointer;text-decoration:underline}
  .kq-kepala{display:flex;align-items:center;gap:10px;margin:0 34px 14px 0}
  .kq-label{font-size:11px;font-weight:800;color:#7c3aed;text-transform:uppercase;letter-spacing:.06em;flex:1}
  .kq-titik{display:flex;gap:6px}
  .kq-titik i{width:9px;height:9px;border-radius:50%;background:rgba(100,116,139,.25);transition:all .3s}
  .kq-titik i.n{background:#7c3aed;transform:scale(1.3)}.kq-titik i.b{background:#22c55e}.kq-titik i.s{background:#ef4444}
  .kq-info{font-size:11px;background:#fef3c7;color:#92400e;border-radius:10px;padding:7px 10px;margin-bottom:12px}
  .kq-soal{font-size:17px;font-weight:800;line-height:1.45;margin-bottom:14px}
  .kq-masuk{animation:kq-geser .4s ease both}
  .kq-daftar{display:flex;flex-direction:column;gap:9px}
  .kq-o{position:relative;overflow:hidden;display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:12px 12px 12px 12px;border-radius:14px;border:1.5px solid rgba(100,116,139,.25);background:rgba(100,116,139,.06);color:inherit;font:inherit;font-size:14px;font-weight:600;line-height:1.4;cursor:pointer;animation:kq-muncul .45s cubic-bezier(.2,1.4,.4,1) both;transition:transform .15s,border-color .2s,opacity .35s}
  .kq-o:hover:not(:disabled){border-color:#a78bfa;transform:translateY(-1px)}
  .kq-o:active:not(:disabled){transform:scale(.98)}
  .kq-o:disabled{cursor:default}
  .kq-isi{position:absolute;left:0;top:0;bottom:0;width:0;background:rgba(124,58,237,.12);transition:width .75s cubic-bezier(.2,1,.3,1)}
  .kq-o > span:not(.kq-isi){position:relative}
  .kq-huruf{width:26px;height:26px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;border:1.5px solid rgba(100,116,139,.35);color:#64748b;transition:all .3s}
  .kq-t{flex:1}
  .kq-ikon{flex:none;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;transform:scale(0)}
  .kq-o.dipilih .kq-isi{width:100%}
  .kq-o.benar{border-color:#22c55e}.kq-o.benar .kq-isi{background:rgba(34,197,94,.2)}
  .kq-o.benar .kq-huruf{background:#22c55e;border-color:#22c55e;color:#fff}
  .kq-o.benar .kq-ikon{background:#22c55e;animation:kq-pop .5s .3s cubic-bezier(.2,1.8,.4,1) forwards}
  .kq-o.salah{border-color:#ef4444}.kq-o.salah .kq-isi{background:rgba(239,68,68,.18)}
  .kq-o.salah .kq-huruf{background:#ef4444;border-color:#ef4444;color:#fff}
  .kq-o.salah .kq-ikon{background:#ef4444;animation:kq-pop .5s .3s cubic-bezier(.2,1.8,.4,1) forwards}
  .kq-o.goyang{animation:kq-goyang .55s cubic-bezier(.36,.07,.19,.97) both}
  .kq-o.kunci{border-color:#22c55e;border-style:dashed;opacity:1}
  .kq-o.redup{opacity:.45}
  .kq-jelas{margin-top:12px;font-size:13px;line-height:1.55;padding:10px 12px;border-radius:12px;background:rgba(34,197,94,.12);color:#15803d;animation:kq-geser .35s ease both}
  .kq-jelas.salah{background:rgba(239,68,68,.1);color:#dc2626}
  .kq-skor{font-size:48px;font-weight:900;line-height:1.1;margin:6px 0 0;background:linear-gradient(135deg,#2563eb,#7c3aed);-webkit-background-clip:text;background-clip:text;color:transparent}
  .kq-gagal .kq-skor{background:linear-gradient(135deg,#f97316,#ef4444);-webkit-background-clip:text;background-clip:text}
  .kq-konfeti{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:4}
  .kb-kuis-akhir{margin:2.5em 0 1em;padding:24px 18px 26px;border-radius:22px;text-align:center;background:linear-gradient(135deg,rgba(37,99,235,.1),rgba(124,58,237,.15));border:1.5px solid rgba(124,58,237,.35);opacity:0;visibility:hidden;transform:translateY(26px) scale(.95);transition:opacity .5s,transform .65s cubic-bezier(.2,1.4,.4,1),visibility 0s .65s}
  .kb-kuis-akhir.muncul{opacity:1;visibility:visible;transform:none;transition:opacity .5s,transform .65s cubic-bezier(.2,1.4,.4,1)}
  .kb-kuis-akhir .kq-ak-emoji{font-size:46px;line-height:1}
  .kb-kuis-akhir.muncul .kq-ak-emoji{animation:kq-pop .7s .2s cubic-bezier(.2,1.6,.4,1) both}
  .kb-kuis-akhir h4{margin:10px 0 4px;font-size:1.2em;font-weight:900;line-height:1.3}
  .kb-kuis-akhir p{margin:0 0 18px;color:var(--kb-mute);font-size:.82em;line-height:1.5}
  .kq-ak-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;width:min(100%,380px);height:64px;border:0;border-radius:20px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-family:inherit;font-size:19px;font-weight:900;cursor:pointer;box-shadow:0 14px 28px -12px #4f46e5;transition:filter .2s}
  .kq-ak-btn:hover{filter:brightness(1.1)}
  .kb-kuis-akhir.muncul .kq-ak-btn{animation:kq-denyut 1.8s ease-out .9s infinite}
  .kb-sesi.kuis{color:#b45309}
  .kb-sesi .kb-kuis-btn{height:26px;margin-left:6px;padding:0 10px;font-size:11px}
  @keyframes kq-fade{from{opacity:0}}
  @keyframes kq-denyut{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(124,58,237,.55),0 14px 28px -12px #4f46e5}45%{transform:scale(1.045)}70%{box-shadow:0 0 0 20px rgba(124,58,237,0),0 14px 28px -12px #4f46e5}100%{transform:scale(1);box-shadow:0 0 0 0 rgba(124,58,237,0),0 14px 28px -12px #4f46e5}}
  @keyframes kq-naik{from{opacity:0;transform:translateY(30px) scale(.94)}}
  @keyframes kq-pop{0%{transform:scale(0) rotate(-20deg)}100%{transform:scale(1) rotate(0)}}
  @keyframes kq-muncul{from{opacity:0;transform:translateY(12px) scale(.96)}}
  @keyframes kq-geser{from{opacity:0;transform:translateX(18px)}}
  @keyframes kq-goyang{10%,90%{transform:translateX(-2px)}20%,80%{transform:translateX(4px)}30%,50%,70%{transform:translateX(-8px)}40%,60%{transform:translateX(8px)}}
  @media (prefers-reduced-motion:reduce){.kb-kuis-akhir,.kb-kuis-akhir *,.kq-latar,.kq-latar *{animation-duration:.01ms!important;transition-duration:.01ms!important}}
  `;
  let K = null;   // kuis yang sedang terbuka

  function gayaKuis() {
    if (document.getElementById('kb-kuis-css')) return;
    const s = document.createElement('style'); s.id = 'kb-kuis-css'; s.textContent = KUIS_CSS; document.head.appendChild(s);
  }
  const kuisWajib = () => !!(S.status && S.status.kuis_wajib) && wajib();
  const minBenar = (jml) => Math.max(1, Math.ceil(jml * ((S.status && S.status.kuis_min_persen) || 60) / 100));
  function acak(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  /** resmi = skor dicatat untuk klaim · latihan / pratinjau = tidak dicatat · tolak = belum boleh. */
  function modeKuis() {
    if (O.isAdmin) return { mode: 'pratinjau' };
    if (!wajib()) return { mode: 'latihan' };
    const s = S.status && S.status.sesi;
    const siap = s && (s.status === 'selesai' || s.status === 'kuis');
    if (!siap) return kuisWajib() ? { tolak: 'Kuis terbuka setelah target baca terpenuhi. Lanjutkan membaca dulu ya 📖' } : { mode: 'latihan', info: 'Latihan: skor belum dicatat karena target baca belum terpenuhi.' };
    if (s.kuis_status) return { mode: 'latihan', info: 'Kuis untuk klaim berikutnya sudah ' + (s.kuis_status === 'lulus' ? 'lulus' : 'selesai') + '. Ini hanya latihan.' };
    if (s.buku_id !== R.id) {
      const pesan = `Kuis yang dihitung adalah kuis buku "${s.buku_judul || '-'}" (buku terakhir yang Anda baca saat target terpenuhi).`;
      return kuisWajib() ? { tolak: pesan } : { mode: 'latihan', info: pesan + ' Ini hanya latihan.' };
    }
    return { mode: 'resmi' };
  }

  function overlayKuis() {
    gayaKuis();
    tutupKuis();
    if (R.auto) setAuto(false);
    const el = document.createElement('div');
    el.className = 'kq-latar';
    el.innerHTML = '<div class="kq-kartu" role="dialog" aria-modal="true"></div><canvas class="kq-konfeti"></canvas>';
    el.addEventListener('click', (e) => e.stopPropagation());   // jangan diteruskan ke tombol-tombol pembaca
    R.el.appendChild(el);
    K = { el, kartu: el.querySelector('.kq-kartu'), cv: el.querySelector('canvas'), partikel: [] };
    K.kartu.addEventListener('click', (e) => {
      const b = e.target.closest('[data-q]');
      if (!b || b.disabled || !K) return;
      const q = b.dataset.q;
      if (q === 'tutup') tutupKuis();
      else if (q === 'mulai') mulaiKuis();
      else if (q === 'ulang') ulangiPelajaran();
      else if (q === 'opsi') jawabKuis(+b.dataset.o);
      else if (q === 'lanjut') lanjutKuis();
      else if (q === 'kirim') kirimSkor();
      else if (q === 'keluar') tutupPembaca();
      else if (q === 'ulangbaca') ulangiBacaCepat();
    });
    return K;
  }
  function isiKartu(html, kelas) {
    if (!K) return;
    K.kartu.className = 'kq-kartu' + (kelas ? ' ' + kelas : '');
    K.kartu.innerHTML = '<button type="button" class="kq-x" data-q="tutup" title="Tutup" aria-label="Tutup">×</button>' + html;
    K.kartu.scrollTop = 0;
  }
  function tutupKuis() {
    if (!K) return;
    cancelAnimationFrame(K.rafK);
    K.el.remove();
    K = null;
  }

  /** Dipanggil sekali saat target baca baru saja terpenuhi (buku sedang terbuka). */
  async function setelahTargetTercapai() {
    if (!R || O.isAdmin) return;
    const adaKuis = R.buku.kuis && R.buku.kuis.length;
    const s = S.status && S.status.sesi;
    if (!adaKuis && s && s.status === 'kuis' && s.buku_id === R.id) {   // buku tanpa kuis: langsung lolos
      try { await rpc('kl_kuis_kirim', { p_buku_id: R.id, p_jumlah: 0, p_benar: 0 }); await muatStatus(); segarkanStatusKartu(); renderSesi(); } catch (e) {}
    }
    layarSelamat(!!adaKuis);
  }

  function layarSelamat(adaKuis) {
    const k = overlayKuis();
    const s = (S.status && S.status.sesi) || {};
    const jml = adaKuis ? R.buku.kuis.length : 0, wjb = kuisWajib();
    isiKartu(`
      <div class="kq-hero"><div class="kq-emoji kq-pop">🎉</div><h3>Selamat!</h3><p>Anda telah menyelesaikan target baca.</p>
        ${s.ringkasan ? `<div class="kq-ringkas">${esc(s.ringkasan)}</div>` : ''}</div>
      ${adaKuis
        ? `<p class="kq-teks">${wjb ? `Kerjakan kuis singkat <b>${jml} soal</b> untuk membuka klaim tema.<br>Minimal <b>${minBenar(jml)} jawaban benar</b>.` : `Uji pemahaman Anda dengan kuis singkat <b>${jml} soal</b>.`}</p>
           <div class="kq-aksi"><button type="button" class="kq-tombol" data-q="ulang"><i class="fa-solid fa-rotate-left"></i> Ulangi Pelajaran</button><button type="button" class="kq-tombol utama" data-q="mulai"><i class="fa-solid fa-play"></i> Kerjakan Kuis</button></div>
           ${wjb ? '' : '<button type="button" class="kq-link" data-q="tutup">Nanti saja</button>'}`
        : `<p class="kq-teks">Klaim tema sudah terbuka. Semoga ilmunya berkah 🤲</p>
           <div class="kq-aksi"><button type="button" class="kq-tombol utama" data-q="tutup">Tutup</button></div>`}`);
    konfeti(80);
    return k;
  }

  /** Tombol "Kerjakan kuis" (di akhir buku, bilah sesi, atau daftar buku). */
  async function bukaKuis() {
    if (!R) return;
    if (!O.isAdmin && wajib()) await muatStatus();
    if (!R) return;
    const md = modeKuis();
    if (md.tolak) { toast(md.tolak, 'peringatan', 5000); return; }
    if (!R.buku.kuis || !R.buku.kuis.length) {
      if (md.mode === 'resmi') { await setelahTargetTercapai(); return; }
      toast('Buku ini tidak memiliki kuis.', '', 3000);
      return;
    }
    overlayKuis();
    mulaiKuis();
  }
  function kuisDariTombol() {
    const s = S.status && S.status.sesi;
    if (!O.isAdmin && wajib() && s && s.status === 'kuis' && s.buku_id && s.buku_id !== R.id) { bukaBuku(s.buku_id).then(() => bukaKuis()); return; }
    bukaKuis();
  }

  async function mulaiKuis() {
    if (!R) return;
    const md = modeKuis();
    if (md.tolak) { tutupKuis(); toast(md.tolak, 'peringatan', 5000); return; }
    if (!K) overlayKuis();
    K.mode = md.mode; K.info = md.info || '';
    K.sisa = null;
    if (md.mode === 'resmi') {   // setiap mulai = 1 kesempatan (dicatat database)
      isiKartu('<div class="kq-hero"><div class="kq-emoji kq-pop">📝</div><p>Menyiapkan kuis…</p></div>');
      try {
        const r = await rpc('kl_kuis_mulai', { p_buku_id: R.id });
        if (!K) return;
        if (!r || r.ok === false) throw new Error((r && r.pesan) || 'Kuis gagal dimulai.');
        if (r.ulang_baca) { await muatStatus(); R.sesi = null; segarkanStatusKartu(); renderSesi(); return tampilHasil({ lulus: false, ulang_baca: true, kata_awal: r.kata_awal, tanpaSkor: true }); }
        if (r.sudah) { await muatStatus(); K.mode = 'latihan'; K.info = 'Kuis untuk klaim berikutnya sudah lulus. Ini hanya latihan.'; }
        K.sisa = r.sisa_coba;
      } catch (e) {
        if (!K) return;
        isiKartu(`<div class="kq-hero"><div class="kq-emoji">⚠️</div><h3>Kuis belum bisa dimulai</h3><p>${esc(e.message || String(e))}</p></div><div class="kq-aksi"><button type="button" class="kq-tombol utama" data-q="mulai">Coba lagi</button></div>`);
        return;
      }
    }
    K.soal = R.buku.kuis.map((q) => {
      const urut = acak(q.opsi.map((_, i) => i));   // urutan pilihan diacak setiap percobaan
      return { soal: q.soal, opsi: urut.map((i) => q.opsi[i]), benar: urut.indexOf(q.benar), jelas: q.jelas };
    });
    K.idx = 0; K.skor = 0; K.hasil = [];
    if (K.mode === 'resmi' && K.sisa != null) K.info = K.sisa > 0 ? `Sisa kesempatan setelah ini: ${K.sisa}x. Menutup kuis di tengah jalan tetap terhitung.` : 'Ini kesempatan terakhir Anda. Menutup kuis di tengah jalan tetap terhitung.';
    tampilSoal();
  }

  function tampilSoal() {
    const q = K.soal[K.idx], n = K.soal.length;
    K.terjawab = false;
    const label = K.mode === 'resmi' ? 'Kuis' : K.mode === 'pratinjau' ? 'Pratinjau kuis' : 'Latihan kuis';
    isiKartu(`
      <div class="kq-kepala"><span class="kq-label">${label} · Soal ${K.idx + 1}/${n}</span>
        <div class="kq-titik">${K.soal.map((_, i) => `<i class="${i < K.idx ? (K.hasil[i] ? 'b' : 's') : i === K.idx ? 'n' : ''}"></i>`).join('')}</div></div>
      ${K.info && K.idx === 0 ? `<div class="kq-info">${esc(K.info)}</div>` : ''}
      <div class="kq-soal kq-masuk">${q.soal}</div>
      <div class="kq-daftar">${q.opsi.map((o, i) => `<button type="button" class="kq-o" data-q="opsi" data-o="${i}" style="animation-delay:${90 + i * 70}ms"><span class="kq-isi"></span><span class="kq-huruf">${'ABCDEFGHIJ'[i] || i + 1}</span><span class="kq-t">${o}</span><span class="kq-ikon"></span></button>`).join('')}</div>
      <div class="kq-jelas" hidden></div>
      <div class="kq-aksi"><button type="button" class="kq-tombol utama" data-q="lanjut" disabled>${K.idx + 1 < n ? 'Lanjut <i class="fa-solid fa-arrow-right"></i>' : 'Lihat hasil <i class="fa-solid fa-flag-checkered"></i>'}</button></div>`);
  }

  function jawabKuis(i) {
    if (!K || K.terjawab) return;
    K.terjawab = true;
    const q = K.soal[K.idx], benar = i === q.benar;
    K.hasil[K.idx] = benar;
    if (benar) K.skor++;
    const tombol = [...K.kartu.querySelectorAll('.kq-o')];
    tombol.forEach((b, j) => {
      b.disabled = true;
      b.style.animationDelay = '0ms';
      if (j === i) b.classList.add('dipilih', benar ? 'benar' : 'salah');
      else if (K.mode === 'pratinjau' && !benar && j === q.benar) b.classList.add('kunci');
      else b.classList.add('redup');
    });
    const b = tombol[i];
    b.querySelector('.kq-ikon').innerHTML = `<i class="fa-solid ${benar ? 'fa-check' : 'fa-xmark'}"></i>`;
    const titik = K.kartu.querySelectorAll('.kq-titik i')[K.idx];
    if (titik) titik.className = benar ? 'b' : 's';
    if (benar) {
      setTimeout(() => konfeti(70, b), 250);
    } else {
      b.classList.remove('goyang'); void b.offsetWidth; b.classList.add('goyang');
      try { if (navigator.vibrate) navigator.vibrate([90, 50, 90]); } catch (e) {}
    }
    const j = K.kartu.querySelector('.kq-jelas');
    if (benar) {
      if (q.jelas) { j.hidden = false; j.innerHTML = '<b>💡 Benar!</b> ' + q.jelas; }
      else { j.hidden = false; j.innerHTML = '<b>✨ Benar!</b> Masya Allah, mantap.'; }
    } else {
      j.hidden = false; j.className = 'kq-jelas salah';
      j.innerHTML = K.mode === 'pratinjau' ? '<b>Belum tepat.</b> Jawaban benar ditandai garis hijau.' + (q.jelas ? ' ' + q.jelas : '') : '<b>Belum tepat.</b> Tetap semangat! 💪';
    }
    K.kartu.querySelector('[data-q="lanjut"]').disabled = false;
  }

  function lanjutKuis() {
    if (!K) return;
    K.idx++;
    if (K.idx < K.soal.length) tampilSoal(); else kirimSkor();
  }

  async function kirimSkor() {
    if (!K) return;
    const n = K.soal.length, skor = K.skor;
    let h = { lulus: skor >= minBenar(n), benar: skor, jumlah: n, min_benar: minBenar(n) };
    if (K.mode === 'resmi') {
      isiKartu('<div class="kq-hero"><div class="kq-emoji kq-pop">⏳</div><p>Menyimpan skor…</p></div>');
      try {
        const r = await rpc('kl_kuis_kirim', { p_buku_id: R.id, p_jumlah: n, p_benar: skor });
        if (!K) return;
        if (!r || r.ok === false) throw new Error((r && r.pesan) || 'Skor gagal disimpan.');
        h = Object.assign(h, r);
      } catch (e) {
        if (!K) return;
        isiKartu(`<div class="kq-hero"><div class="kq-emoji">⚠️</div><h3>Skor belum tersimpan</h3><p>${esc(e.message || String(e))}</p></div><div class="kq-aksi"><button type="button" class="kq-tombol utama" data-q="kirim">Kirim ulang skor</button></div>`);
        return;
      }
      await muatStatus();
      if (h.ulang_baca) R.sesi = null;
      segarkanStatusKartu(); renderSesi();
      if (!K) return;
    }
    tampilHasil(h);
  }

  function tampilHasil(h) {
    if (!K) return;
    const resmi = K.mode === 'resmi', wjb = kuisWajib();
    const skor = h.tanpaSkor ? '' : `<div class="kq-skor">${h.benar}/${h.jumlah}</div>`;
    if (h.lulus) {
      const pesan = resmi ? (wjb ? 'Klaim tema sudah terbuka. Barakallahu fiikum!' : 'Skor tersimpan. Barakallahu fiikum!') : K.mode === 'pratinjau' ? 'Pratinjau selesai (tidak disimpan).' : 'Latihan selesai (tidak dicatat).';
      isiKartu(`<div class="kq-hero"><div class="kq-emoji kq-pop">${h.benar === h.jumlah ? '🏆' : '🎉'}</div><h3>${h.benar === h.jumlah ? 'Sempurna!' : 'Lulus!'}</h3>${skor}<p>${pesan}</p></div>
        <div class="kq-aksi"><button type="button" class="kq-tombol utama" data-q="tutup">Selesai</button></div>`);
      konfeti(170);
      return;
    }
    K.kataAwal = h.kata_awal;
    if (h.ulang_baca) {
      isiKartu(`<div class="kq-hero"><div class="kq-emoji kq-pop">📖</div><h3>Kesempatan kuis habis</h3>${skor}
          <p>${h.tanpaSkor ? '' : `Minimal ${h.min_benar} benar. `}Silakan baca ulang bagian ini sampai target terpenuhi, lalu kerjakan kuisnya lagi. Semangat! 💪</p></div>
        <div class="kq-aksi"><button type="button" class="kq-tombol utama" data-q="ulang"><i class="fa-solid fa-rotate-left"></i> Ulangi Pelajaran</button></div>`, 'kq-gagal');
      return;
    }
    const sisa = h.sisa_coba != null ? `<br>Sisa kesempatan: <b>${h.sisa_coba}x</b>` : '';
    isiKartu(`<div class="kq-hero"><div class="kq-emoji kq-pop">💪</div><h3>Belum lulus</h3>${skor}
        <p>${resmi || K.mode !== 'pratinjau' ? `Minimal <b>${h.min_benar} benar</b>.` : ''}${resmi ? sisa : ''}<br>Coba ulangi pelajarannya agar lebih paham, atau coba lagi.</p></div>
      <div class="kq-aksi"><button type="button" class="kq-tombol" data-q="ulang"><i class="fa-solid fa-rotate-left"></i> Ulangi Pelajaran</button><button type="button" class="kq-tombol utama" data-q="mulai"><i class="fa-solid fa-rotate-right"></i> Coba Lagi</button></div>`, 'kq-gagal');
  }

  function ulangiPelajaran() {
    if (!R) return;
    const s = S.status && S.status.sesi, g = S.status && S.status.gagal_kuis;
    let pos = K && K.kataAwal != null ? K.kataAwal
      : s && s.buku_id === R.id && s.buku_kata_awal != null ? s.buku_kata_awal
      : g && g.buku_id === R.id ? g.kata_awal : 0;
    tutupKuis();
    lompatKe(Math.max(0, pos || 0), true);
    toast('Silakan baca ulang dengan tenang 📖', '', 3000);
  }

  /* ---------- kartu kuis di ujung buku ---------- */
  function cekUjungKuis() {
    if (!R || R.kuisMuncul) return;
    const box = R.el.querySelector('[data-kb-akhir]'), isi = R.isi;
    if (!box || isi.scrollTop + isi.clientHeight < isi.scrollHeight - 40) return;
    R.kuisMuncul = true;
    box.classList.add('muncul');
  }

  /* ---------- konfirmasi saat menekan tombol kembali ---------- */
  function tandaiCepat(pos) {
    if (!R) return;
    R.cepat = true;
    pos = Math.max(0, pos || 0);
    if (R.titikCepat == null || pos < R.titikCepat) R.titikCepat = pos;
  }
  /** null = boleh langsung keluar · 'kuis' = target terpenuhi tapi kuis belum · 'cepat' = ada bacaan terlalu cepat / sampai ujung tapi target belum */
  function alasanBelumTuntas() {
    if (!R || O.isAdmin || !wajib() || (S.status && S.status.hsi)) return null;
    const s = S.status && S.status.sesi, adaKuis = R.buku.kuis && R.buku.kuis.length;
    if (s && s.status === 'kuis') return adaKuis && s.buku_id === R.id ? 'kuis' : null;
    if ((s && s.status === 'selesai') || (R.sesi && R.sesi.status === 'selesai')) return null;
    return R.cepat || R.akhirTercapai ? 'cepat' : null;
  }
  function mintaTutup() {
    const alasan = alasanBelumTuntas();
    if (!alasan) return tutupPembaca();
    overlayKuis();
    const kw = kuisWajib() && R.buku.kuis && R.buku.kuis.length;
    if (alasan === 'kuis') {
      isiKartu(`<div class="kq-hero"><div class="kq-emoji kq-pop">📝</div><h3>Yakin keluar dari buku ini?</h3>
          <p>Target bacaan Anda sudah terpenuhi, tetapi <b>kuisnya belum dikerjakan</b>. Klaim tema baru terbuka setelah lulus kuis (minimal ${minBenar(R.buku.kuis.length)} benar).</p></div>
        <div class="kq-aksi"><button type="button" class="kq-tombol" data-q="keluar"><i class="fa-solid fa-arrow-right-from-bracket"></i> Keluar saja</button><button type="button" class="kq-tombol utama" data-q="mulai"><i class="fa-solid fa-play"></i> Siap, kerjakan kuis</button></div>`);
      return;
    }
    const s = R.sesi || (S.status && S.status.sesi) || {};
    const tgt = s.target_kata || (S.status && S.status.target_kata) || 1260;
    isiKartu(`<div class="kq-hero"><div class="kq-emoji kq-pop">⚠️</div><h3>Yakin keluar dari buku ini?</h3>
        <p>Anda <b>belum menyelesaikan target bacaan</b> buku ini karena ada bagian yang dibaca <b>terlalu cepat</b> sehingga tidak dihitung${kw ? ', dan <b>kuisnya belum dikerjakan</b>' : ''}.</p>
        <div class="kq-ringkas">Bacaan sah: <b>${angka(s.kata_sah || 0)} / ${angka(tgt)} kata</b></div></div>
      <div class="kq-aksi"><button type="button" class="kq-tombol" data-q="keluar"><i class="fa-solid fa-arrow-right-from-bracket"></i> Keluar saja</button><button type="button" class="kq-tombol utama" data-q="ulangbaca"><i class="fa-solid fa-rotate-left"></i> Siap, saya ulangi lagi</button></div>`, 'kq-gagal');
  }
  function ulangiBacaCepat() {
    if (!R) return;
    const pos = R.titikCepat != null ? R.titikCepat : 0;
    tutupKuis();
    lompatKe(pos, true);
    toast('Silakan baca ulang dengan tenang dari bagian yang terlewat 📖', '', 3500);
  }

  /* konfeti ringan (canvas, tanpa pustaka luar) */
  function konfeti(jumlah, dari) {
    if (!K || !K.cv) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = K.cv, w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    const c = cv.getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    let ox = w / 2, oy = h * 0.42;
    if (dari) { const a = dari.getBoundingClientRect(), b = cv.getBoundingClientRect(); ox = a.left - b.left + a.width / 2; oy = a.top - b.top + a.height / 2; }
    const warna = ['#f43f5e', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6', '#facc15'];
    for (let n = 0; n < jumlah; n++) {
      const sudut = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.15, v = 5 + Math.random() * (dari ? 7 : 11);
      K.partikel.push({ x: ox, y: oy, vx: Math.cos(sudut) * v, vy: Math.sin(sudut) * v, r: 5 + Math.random() * 5, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
        w: warna[(Math.random() * warna.length) | 0], kotak: Math.random() < 0.6, umur: 0 });
    }
    if (K.rafK) return;
    const P = K.partikel, kk = K;
    const langkah = () => {
      if (K !== kk) return;
      c.clearRect(0, 0, w, h);
      for (const p of P) {
        p.umur++; p.vy += 0.3; p.vx *= 0.985; p.vy *= 0.985; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        c.save(); c.globalAlpha = Math.max(0, 1 - p.umur / 140); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = p.w;
        if (p.kotak) c.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); else { c.beginPath(); c.arc(0, 0, p.r / 2.4, 0, 7); c.fill(); }
        c.restore();
      }
      for (let i = P.length - 1; i >= 0; i--) if (P[i].umur > 140 || P[i].y > h + 30) P.splice(i, 1);
      if (P.length) kk.rafK = requestAnimationFrame(langkah); else { kk.rafK = 0; c.clearRect(0, 0, w, h); }
    };
    K.rafK = requestAnimationFrame(langkah);
  }


  /* ===================== PENCATATAN BACA ===================== */
  const wajib = () => !!(S.status && S.status.aktif && !O.isAdmin);
  const fokus = () => document.visibilityState === 'visible' && document.hasFocus();

  function jedaBaca(alasan) {
    if (!R || R.jeda) return;
    R.jeda = true;
    if (R.auto && alasan !== 'diam') setAuto(false);
    if (wajib()) toast(alasan === 'diam' ? 'Bacaan dijeda karena tidak ada aktivitas. Gulir lagi untuk melanjutkan.' : 'Bacaan dijeda karena Anda meninggalkan halaman. Waktu tidak fokus tidak dihitung.', 'peringatan', 4000);
  }
  async function detak() {
    if (!R) return;
    const diam = Date.now() - R.interaksi > 60000 && !R.auto;
    if (!fokus() || diam) { jedaBaca(diam ? 'diam' : 'fokus'); return; }
    if (R.jeda) { R.jeda = false; R.posKirim = posisiSekarang(); if (!O.isAdmin) catat(-1); return; }
    const pos = posisiSekarang();
    if (R.posKirim == null) { R.posKirim = pos; return; }
    const delta = Math.max(0, pos - R.posKirim);
    R.posKirim = pos;
    const batas = ((S.status && S.status.maks_wpm) || 300) / 12 + 15;
    if (delta > batas && wajib()) tandaiCepat(pos - delta);
    if (delta > batas && wajib()) toast('Mohon baca perlahan 🙏 Bagian yang dilewati terlalu cepat tidak dihitung.', 'peringatan', 3500);
    if (delta > 0 || R.akhirBelumTerkirim) catat(delta, pos);
  }
  async function catat(delta, pos) {
    if (!R || O.isAdmin) return;
    pos = pos == null ? posisiSekarang() : pos;
    const bh = babHal(pos), total = R.buku.totalKata, id = R.id;
    const kategori = R.kategori === 'Umum' ? 'Umum' : 'KEKAL ' + R.kategori;
    const akhir = pos >= total - 3;
    try {
      const r = await rpc('kl_baca_catat', { p_buku_id: id, p_judul: R.judul, p_kategori: kategori, p_total_kata: total, p_kata_baru: delta, p_posisi: pos, p_bab: bh.bab, p_halaman: bh.hal, p_akhir_buku: akhir });
      if (!R || R.id !== id) return;
      R.akhirBelumTerkirim = false;
      const sebelum = R.sesi && R.sesi.status;
      R.sesi = r;
      const lama = S.posisi[id] || {};
      S.posisi[id] = Object.assign(lama, { buku_id: id, judul: R.judul, kategori, bab: bh.bab, halaman: bh.hal, kata_posisi: pos,
        persen: Math.max(Number(lama.persen) || 0, total ? Math.round(pos * 100 / total) : 0), updated_at: new Date().toISOString() });
      if (akhir) R.akhirTercapai = true;
      if (r && r.terlalu_cepat && wajib()) tandaiCepat(pos - delta);
      if (r && r.terlalu_cepat && wajib()) toast('Mohon baca perlahan 🙏 Bagian yang dilewati terlalu cepat tidak dihitung.', 'peringatan', 3500);
      if (r && r.status === 'selesai' && sebelum && sebelum !== 'selesai' && wajib()) {
        // modal "Selamat" + arahan kuis / ulangi pelajaran (menggantikan notifikasi singkat)
        muatStatus().then(() => { segarkanStatusKartu(); renderSesi(); if (R && R.id === id) setelahTargetTercapai(); });
      }
      renderSesi();
    } catch (e) {
      if (akhir) R.akhirBelumTerkirim = true;   // coba lagi di detak berikutnya
    }
  }
  function renderSesi() {
    if (!R) return;
    const el = R.el.querySelector('[data-kb="sesi"]');
    if (!el) return;
    if (!wajib()) { el.style.display = 'none'; return; }
    el.style.display = '';
    const st = S.status;
    if (st && st.hsi) { el.className = 'kb-sesi ok'; el.innerHTML = '<b>✓ NIP Santri HSI terverifikasi</b> untuk klaim berikutnya. Silakan tetap membaca.'; return; }
    const s = R.sesi || (st && st.sesi) || { kata_sah: 0, target_kata: (st && st.target_kata) || 1260, detik: 0 };
    const ss = st && st.sesi;
    if (ss && ss.status === 'kuis' && (!R.sesi || R.sesi.status === 'selesai')) {
      el.className = 'kb-sesi kuis';
      el.innerHTML = `<b>✓ Target baca terpenuhi</b> · kerjakan kuis${ss.buku_id === R.id ? '' : ' buku "' + esc(ss.buku_judul || '') + '"'} untuk membuka klaim<button class="kb-btn on kb-kuis-btn" data-kb="kuis"><i class="fa-solid fa-play"></i> Kerjakan kuis</button>`;
      return;
    }
    if (s.status === 'selesai') { el.className = 'kb-sesi ok'; el.innerHTML = `<b>✓ Syarat baca terpenuhi</b> · klaim tema sudah terbuka<div class="kb-pg"><div style="width:100%"></div></div>`; return; }
    const tgt = s.target_kata || 1260, persen = Math.min(100, Math.round((s.kata_sah || 0) * 100 / tgt));
    const sisaBuku = s.sisa_buku != null && s.sisa_buku < tgt - (s.kata_sah || 0) ? ` · atau selesaikan buku ini (±${angka(s.sisa_buku)} kata lagi)` : '';
    el.className = 'kb-sesi';
    el.innerHTML = `Syarat baca untuk klaim: <b>${angka(s.kata_sah || 0)} / ${angka(tgt)} kata</b> · ${Math.floor((s.detik || 0) / 60)} mnt ${(s.detik || 0) % 60} dtk${sisaBuku}<div class="kb-pg"><div style="width:${persen}%"></div></div>`;
  }

  /* ===================== PLAY OTOMATIS & SUARA ===================== */
  function setAuto(on) {
    if (!R) return;
    R.auto = on;
    const btn = R.el.querySelector('[data-kb="play"]');
    if (btn) { btn.classList.toggle('on', on); btn.innerHTML = `<i class="fa-solid ${on ? 'fa-pause' : 'fa-play'}"></i> <span class="kb-sembunyi-hp">${on ? 'Jeda' : 'Play'}</span>`; }
    cancelAnimationFrame(R.raf);
    hentikanSuara();
    if (!on) return;
    R.interaksi = Date.now();
    if (R.jeda && fokus()) { R.jeda = false; R.posKirim = posisiSekarang(); catat(-1); }
    if (R.pref.suara && 'speechSynthesis' in window) { mulaiSuara(); return; }
    let t0 = performance.now(), sisaPx = 0;
    const langkah = (t) => {
      if (!R || !R.auto) return;
      const dt = Math.min(0.1, (t - t0) / 1000); t0 = t;
      if (!R.jeda) {
        const garis = R.isi.scrollTop + R.isi.clientHeight * 0.35;
        const blk = R.elBlok.find(({ el }) => el.offsetTop + el.offsetHeight > garis);
        const pxPerKata = blk && blk.b.kata > 3 ? blk.el.offsetHeight / blk.b.kata : 6;
        sisaPx += (R.pref.wpm / 60) * pxPerKata * dt;
        if (sisaPx >= 1) { const n = Math.floor(sisaPx); R.isi.scrollTop += n; sisaPx -= n; }
        if (R.isi.scrollTop + R.isi.clientHeight >= R.isi.scrollHeight - 2) { setAuto(false); toast('Sudah sampai akhir buku.', 'ok'); return; }
        R.interaksi = Date.now();
      }
      R.raf = requestAnimationFrame(langkah);
    };
    R.raf = requestAnimationFrame(langkah);
  }
  function hentikanSuara() {
    if (!R || !R.tts) return;
    R.tts = null;
    R.ttsPos = null;
    try { window.speechSynthesis.cancel(); } catch (e) {}
    R.elBlok.forEach((x) => x.el.classList.remove('kb-blok-aktif'));
  }
  function mulaiSuara() {
    const synth = window.speechSynthesis;
    synth.cancel();
    const pilihSuara = () => synth.getVoices().find((v) => /^id([-_]|$)/i.test(v.lang)) || null;
    let idx = R.elBlok.findIndex(({ b }) => b.kataAwal + b.kata > posisiSekarang());
    if (idx < 0) idx = 0;
    const sesiTts = { idx };
    R.tts = sesiTts;
    const bacakanBlok = () => {
      if (!R || R.tts !== sesiTts) return;
      while (sesiTts.idx < R.elBlok.length) {
        const b = R.elBlok[sesiTts.idx].b;
        if (b.arab || !b.kata || b.tipe === 'garis' || b.tipe === 'html') sesiTts.idx++;
        else break;
      }
      if (sesiTts.idx >= R.elBlok.length) { setAuto(false); toast('Selesai dibacakan.', 'ok'); return; }
      const { el, b } = R.elBlok[sesiTts.idx];
      R.elBlok.forEach((x) => x.el.classList.remove('kb-blok-aktif'));
      el.classList.add('kb-blok-aktif');
      R.ttsPos = b.kataAwal;
      R.isi.scrollTo({ top: Math.max(0, el.offsetTop - R.isi.clientHeight * 0.3), behavior: 'smooth' });
      // per kalimat, agar suara tidak terpotong pada teks panjang
      const kalimat = b.teks.match(/[^.!?…]+[.!?…]*\s*/g) || [b.teks];
      let k = 0, kataSebelum = 0;
      const suara = pilihSuara();
      if (!suara && !R.peringatanSuara) { R.peringatanSuara = true; toast('Suara bahasa Indonesia tidak ditemukan di perangkat ini, memakai suara bawaan.', '', 4000); }
      const ucap = () => {
        if (!R || R.tts !== sesiTts) return;
        if (k >= kalimat.length) { R.ttsPos = b.kataAwal + b.kata; sesiTts.idx++; bacakanBlok(); return; }
        const teks = kalimat[k];
        const u = new SpeechSynthesisUtterance(teks);
        u.lang = 'id-ID'; if (suara) u.voice = suara; u.rate = 1;
        const mulai = performance.now(), nKata = hitungKata(teks);
        let adaBatas = false;
        u.onboundary = (ev) => { adaBatas = true; R.ttsPos = b.kataAwal + Math.min(b.kata, kataSebelum + hitungKata(teks.slice(0, ev.charIndex))); R.interaksi = Date.now(); };
        const cadangan = setInterval(() => {
          if (!R || R.tts !== sesiTts) return clearInterval(cadangan);
          R.interaksi = Date.now();
          if (!adaBatas) R.ttsPos = b.kataAwal + Math.min(b.kata, kataSebelum + Math.min(nKata, Math.floor((performance.now() - mulai) / 1000 * 2.6)));
        }, 1000);
        u.onend = () => { clearInterval(cadangan); kataSebelum += nKata; k++; ucap(); };
        u.onerror = (ev) => {
          clearInterval(cadangan);
          if (!R || R.tts !== sesiTts || ev.error === 'interrupted' || ev.error === 'canceled') return;
          // suara ditolak / tidak tersedia: hentikan dengan rapi, lanjut gulir otomatis tanpa suara
          hentikanSuara();
          R.pref.suara = false; simpanPref();
          const bs = R.el.querySelector('[data-kb="suara"]'); if (bs) bs.classList.remove('on');
          toast('Suara tidak bisa diputar di perangkat ini. Dilanjutkan dengan gulir otomatis tanpa suara.', 'peringatan', 4500);
          setAuto(true);
        };
        synth.speak(u);
      };
      ucap();
    };
    bacakanBlok();
  }

  function tutupPembaca(diam) {
    if (!R) return;
    tutupKuis();
    const r = R;
    if (!r.jeda && fokus() && r.posKirim != null && !O.isAdmin) {
      const pos = posisiSekarang(), delta = Math.max(0, pos - r.posKirim);
      if (delta > 0) catat(delta, pos);
    }
    setAuto(false);
    clearInterval(r.timer);
    document.removeEventListener('visibilitychange', r.onVis);
    window.removeEventListener('blur', r.onBlur);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    r.el.remove();
    document.documentElement.style.overflow = '';
    R = null;
    if (!diam && S.wadah && S.wadah.isConnected) { muatStatus().then(() => renderPerpustakaan()); }
  }

  /* ===================== ADMIN ===================== */
  async function renderAdmin() {
    const box = S.wadah.querySelector('#kb-admin');
    if (!box) return;
    box.innerHTML = '<div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-sm text-slate-400">Memuat pengaturan & rekap baca…</div>';
    let cfg = null, sesi = [], posisi = [], hsi = [];
    try {
      const a = await O.sb.from('baca_pengaturan').select('*').eq('id', 1).limit(1);
      if (a.error) throw a.error;
      cfg = a.data && a.data[0];
      const [b, c, d] = await Promise.all([
        O.sb.from('baca_sesi').select('*').order('id', { ascending: false }).limit(60),
        O.sb.from('baca_posisi').select('*').order('updated_at', { ascending: false }).limit(100),
        O.sb.from('hsi_lolos').select('*').order('id', { ascending: false }).limit(30)
      ]);
      sesi = b.data || []; posisi = c.data || []; hsi = d.data || [];
    } catch (e) {
      box.innerHTML = `<div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-semibold">Fitur Buku belum aktif di database. Jalankan <b>sql-buku-kekal.sql</b> di Supabase › SQL Editor. <span class="font-normal">${esc(e.message || '')}</span></div>`;
      return;
    }
    if (!cfg) { box.innerHTML = '<div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-semibold">Baris pengaturan belum ada. Jalankan ulang sql-buku-kekal.sql.</div>'; return; }
    const nama = (id) => esc((O.nama && O.nama(id)) || String(id).slice(0, 8));
    const waktu = (t) => t ? new Date(t).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }) : '-';
    const lbl = { aktif: ['Sedang membaca', 'bg-blue-50 text-blue-700'], selesai: ['Siap klaim', 'bg-emerald-50 text-emerald-700'], terpakai: ['Dipakai klaim', 'bg-slate-100 text-slate-600'], gagal_kuis: ['Kesempatan kuis habis', 'bg-rose-50 text-rose-700'], kuis: ['Menunggu kuis', 'bg-amber-50 text-amber-700'] };
    const adaKuis = 'kuis_wajib' in cfg;
    const statusSesi = (s) => (s.status === 'selesai' && cfg.kuis_wajib && !s.kuis_status ? 'kuis' : s.status);
    const infoKuis = (s) => {
      if (!adaKuis) return '';
      if (s.kuis_status === 'lulus') return `<div class="mt-0.5 text-emerald-700 font-bold">Kuis ${s.kuis_benar}/${s.kuis_jumlah}${s.kuis_coba > 1 ? ` · ${s.kuis_coba}x coba` : ''}</div>`;
      if (s.kuis_status === 'tanpa_kuis') return '<div class="mt-0.5 text-slate-400">Buku tanpa kuis</div>';
      if (s.kuis_coba) return `<div class="mt-0.5 text-amber-700 font-bold">Kuis ${s.kuis_benar != null ? s.kuis_benar + '/' + s.kuis_jumlah + ' · ' : ''}${s.kuis_coba}x coba</div>`;
      return '';
    };
    box.innerHTML = `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
        <h3 class="font-extrabold text-slate-800"><i class="fa-solid fa-sliders text-blue-600"></i> Pengaturan wajib baca</h3>
        <label class="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer"><input type="checkbox" data-kba="aktif" ${cfg.aktif ? 'checked' : ''} class="w-4 h-4 accent-blue-600"> Wajib baca buku sebelum setiap klaim tema (santri HSI aktif boleh verifikasi NIP sebagai gantinya)</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <label class="block"><span class="font-bold text-slate-500">Target per klaim (kata)</span><input type="number" min="50" step="10" data-kba="target_kata" value="${cfg.target_kata}" class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm font-bold"><span class="text-[10px] text-slate-400">±${Math.round(cfg.target_kata / cfg.normal_wpm)} menit pada kecepatan normal. Buku lebih pendek cukup dibaca sampai akhir.</span></label>
          <label class="block"><span class="font-bold text-slate-500">Batas kecepatan (kata/menit)</span><input type="number" min="100" step="10" data-kba="maks_wpm" value="${cfg.maks_wpm}" class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm font-bold"><span class="text-[10px] text-slate-400">Lebih cepat dari ini = "Mohon baca perlahan" dan tidak dihitung.</span></label>
          <label class="block"><span class="font-bold text-slate-500">Kecepatan play otomatis (kata/menit)</span><input type="number" min="60" step="10" data-kba="normal_wpm" value="${cfg.normal_wpm}" class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm font-bold"></label>
        </div>
        ${adaKuis ? `<div class="border-t border-slate-100 pt-3 space-y-2">
          <div class="text-xs font-extrabold text-slate-700"><i class="fa-solid fa-clipboard-question text-amber-500"></i> Kuis akhir buku <span class="font-normal text-slate-400">(soal ditulis di postingan dengan blok <code>&gt; [!kuis]</code>)</span></div>
          <label class="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer"><input type="checkbox" data-kba="kuis_wajib" ${cfg.kuis_wajib ? 'checked' : ''} class="w-4 h-4 accent-amber-500"> Wajib lulus kuis sebelum klaim tema (buku tanpa kuis tidak terpengaruh)</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label class="block"><span class="font-bold text-slate-500">Skor minimal (%)</span><input type="number" min="1" max="100" step="1" data-kba="kuis_min_persen" value="${cfg.kuis_min_persen}" class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm font-bold"><span class="text-[10px] text-slate-400">3 soal → minimal ${Math.max(1, Math.ceil(3 * cfg.kuis_min_persen / 100))} benar.</span></label>
            <label class="block"><span class="font-bold text-slate-500">Kesempatan mengerjakan kuis</span><input type="number" min="0" max="20" step="1" data-kba="kuis_maks_coba" value="${cfg.kuis_maks_coba}" class="mt-1 w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm font-bold"><span class="text-[10px] text-slate-400">Habis tanpa lulus = wajib baca ulang. 0 = tanpa batas.</span></label>
          </div></div>` : '<div class="text-[11px] text-amber-700 font-semibold border-t border-slate-100 pt-3"><i class="fa-solid fa-circle-info"></i> Kuis akhir buku belum aktif di database. Jalankan <b>sql-kuis-buku.sql</b> di Supabase › SQL Editor.</div>'}
        <div class="flex items-center gap-2"><button type="button" data-kba-simpan class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg"><i class="fa-solid fa-floppy-disk"></i> Simpan pengaturan</button><span class="text-[11px] text-slate-400">NIP HSI diatur per desainer di Daftar Kelola Desainer › Edit Profil.</span></div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <h3 class="font-extrabold text-slate-800 mb-2"><i class="fa-solid fa-list-check text-blue-600"></i> Rekap sesi baca (60 terakhir)</h3>
        <div class="overflow-x-auto"><table class="w-full text-[11px]"><thead><tr class="text-left text-[10px] uppercase tracking-wide text-slate-400 border-b"><th class="py-1.5 pr-2">Desainer</th><th class="py-1.5 px-2">Status</th><th class="py-1.5 px-2">Bacaan</th><th class="py-1.5 px-2 text-right">Kata</th><th class="py-1.5 px-2 text-right">Durasi</th><th class="py-1.5 pl-2">Waktu</th></tr></thead>
        <tbody class="divide-y divide-slate-100">${sesi.length ? sesi.map((s) => `<tr><td class="py-1.5 pr-2 font-bold text-slate-800 whitespace-nowrap">${nama(s.user_id)}</td><td class="py-1.5 px-2"><span class="px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${(lbl[statusSesi(s)] || lbl.aktif)[1]}">${(lbl[statusSesi(s)] || lbl.aktif)[0]}</span>${s.project_id ? ` <span class="text-slate-400">#${s.project_id}</span>` : ''}${infoKuis(s)}</td><td class="py-1.5 px-2 text-slate-600">${esc(s.ringkasan || `${s.buku_kategori || ''} – ${s.buku_judul || '-'} (Bab ${s.bab_akhir || 1} hal. ${s.hal_akhir || 1})`)}</td><td class="py-1.5 px-2 text-right tabular-nums">${angka(s.kata_sah)} / ${angka(s.target_kata)}${s.kata_cepat ? `<div class="text-amber-600">${angka(s.kata_cepat)} terlalu cepat</div>` : ''}</td><td class="py-1.5 px-2 text-right tabular-nums whitespace-nowrap">${Math.floor(s.detik / 60)}m ${s.detik % 60}d</td><td class="py-1.5 pl-2 whitespace-nowrap text-slate-500">${waktu(s.terakhir_at)}</td></tr>`).join('') : '<tr><td colspan="6" class="py-3 text-slate-400">Belum ada sesi baca.</td></tr>'}</tbody></table></div>
      </div>
      <div class="grid lg:grid-cols-2 gap-4">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5"><h3 class="font-extrabold text-slate-800 mb-2"><i class="fa-solid fa-location-dot text-blue-600"></i> Posisi baca desainer</h3>
          <div class="overflow-x-auto"><table class="w-full text-[11px]"><tbody class="divide-y divide-slate-100">${posisi.length ? posisi.map((p) => `<tr><td class="py-1.5 pr-2 font-bold text-slate-800 whitespace-nowrap">${nama(p.user_id)}</td><td class="py-1.5 px-2 text-slate-600">${esc(p.kategori || '')} – ${esc(p.judul || '')}</td><td class="py-1.5 px-2 whitespace-nowrap">Bab ${p.bab || 1} · hal. ${p.halaman || 1}</td><td class="py-1.5 pl-2 text-right font-bold">${Math.round(Number(p.persen) || 0)}%</td></tr>`).join('') : '<tr><td class="py-3 text-slate-400">Belum ada.</td></tr>'}</tbody></table></div></div>
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5"><h3 class="font-extrabold text-slate-800 mb-2"><i class="fa-solid fa-graduation-cap text-emerald-600"></i> Verifikasi Santri HSI (30 terakhir)</h3>
          <div class="overflow-x-auto"><table class="w-full text-[11px]"><tbody class="divide-y divide-slate-100">${hsi.length ? hsi.map((h) => `<tr><td class="py-1.5 pr-2 font-bold text-slate-800 whitespace-nowrap">${nama(h.user_id)}</td><td class="py-1.5 px-2 text-slate-600">${esc(h.target)}</td><td class="py-1.5 pl-2 whitespace-nowrap text-slate-500">${h.project_id ? 'Klaim #' + h.project_id : h.terpakai_at ? 'Diganti' : 'Belum dipakai'} · ${waktu(h.created_at)}</td></tr>`).join('') : '<tr><td class="py-3 text-slate-400">Belum ada.</td></tr>'}</tbody></table></div></div>
      </div>`;
    box.querySelector('[data-kba-simpan]').addEventListener('click', async (e) => {
      const btn = e.currentTarget; btn.disabled = true;
      const v = (k) => box.querySelector(`[data-kba="${k}"]`);
      const data = { aktif: v('aktif').checked, target_kata: Math.round(+v('target_kata').value), maks_wpm: Math.round(+v('maks_wpm').value), normal_wpm: Math.round(+v('normal_wpm').value), updated_at: new Date().toISOString(), updated_by: (O.nama && O.nama(O.userId)) || 'Admin' };
      try {
        if (!(data.target_kata >= 50 && data.maks_wpm >= 100 && data.normal_wpm >= 60 && data.normal_wpm < data.maks_wpm)) throw new Error('Periksa angka: target ≥ 50 kata, batas kecepatan ≥ 100, dan kecepatan play otomatis harus di bawah batas kecepatan.');
        if (adaKuis) {
          Object.assign(data, { kuis_wajib: v('kuis_wajib').checked, kuis_min_persen: Math.round(+v('kuis_min_persen').value), kuis_maks_coba: Math.round(+v('kuis_maks_coba').value) });
          if (!(data.kuis_min_persen >= 1 && data.kuis_min_persen <= 100 && data.kuis_maks_coba >= 0 && data.kuis_maks_coba <= 20)) throw new Error('Periksa angka kuis: skor minimal 1–100%, kesempatan 0–20 kali.');
        }
        const { data: hasil, error } = await O.sb.from('baca_pengaturan').update(data).eq('id', 1).select('id');
        if (error) throw error;
        if (!hasil || !hasil.length) throw new Error('Perubahan tidak tersimpan (cek izin admin).');
        if (O.log) O.log('BUKU_SETELAN', `Mengubah pengaturan wajib baca (${data.aktif ? 'aktif' : 'mati'}, ${data.target_kata} kata${adaKuis ? `, kuis ${data.kuis_wajib ? 'wajib ' + data.kuis_min_persen + '% / ' + data.kuis_maks_coba + 'x' : 'tidak wajib'}` : ''}).`);
        await O.alert('Tersimpan', `Pengaturan wajib baca tersimpan (${data.aktif ? 'aktif' : 'mati'}).`, 'success');
        await muatStatus();
        renderAdmin();
      } catch (err) { await O.alert('Gagal Menyimpan', err.message || String(err), 'error'); }
      finally { btn.disabled = false; }
    });
  }

  /* ===================== API ===================== */
  window.KekalBuku = {
    versi: VERSI,
    parse,
    async buka(wadah, opsi) {
      pasangGaya();
      O = Object.assign({ feedBase: '' }, opsi || {});
      S.wadah = wadah;
      await muatStatus();
      await renderPerpustakaan();
    },
    status: muatStatus,
    tutup: () => tutupPembaca(true),
    sedangMembaca: () => !!R
  };
})();
