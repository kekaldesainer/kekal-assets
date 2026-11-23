/*! KEKAL Studio - Dashboard v1.0.6 | dimuat oleh template Blogger */
/* 1) Dimuat setelah halaman siap: jalankan handler DOMContentLoaded langsung. */
(function () {
  var d = document, orig = d.addEventListener;
  if (d.readyState === 'loading') return;
  d.addEventListener = function (type, fn, opt) {
    if (type === 'DOMContentLoaded') { setTimeout(function () { fn.call(d, new Event('DOMContentLoaded')); }, 0); return; }
    return orig.call(this, type, fn, opt);
  };
  setTimeout(function () { d.addEventListener = orig; }, 0);
})();
/* 2) Pasang tampilan dashboard (header, panel, jendela-jendela) di tempatnya. */
(function () {
  var html = "\n  <header class='tokopedia-header sticky top-0 z-40 px-3 sm:px-4 py-2.5 sm:py-3 mb-4 sm:mb-6 shadow-sm'>\n    <div class='max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4'>\n      <div class='flex items-center space-x-2 sm:space-x-3 shrink-0'>\n        <div class='w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shrink-0'>\n          <i class='fa-solid fa-shapes text-sm sm:text-lg'></i>\n        </div>\n       <div>\n          <h1 class='text-xs sm:text-base font-bold text-slate-800 leading-tight truncate max-w-[120px] sm:max-w-none'><span class='kl-blog-title'></span></h1>\n          <div class='flex items-center gap-1.5'>\n            <p class='text-[9px] sm:text-[11px] text-blue-600 font-semibold truncate'>Kelas Kaligrafi Digital</p>\n            <div class='hidden inline-flex items-center gap-1.5 flex-wrap' id='header-designer-level-badge'></div>\n          </div>\n        </div>\n      </div>\n      <div class='flex items-center space-x-1.5 sm:space-x-3' id='auth-section'>\n        <button class='btn-tokopedia-blue text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition flex items-center gap-1.5 shadow-sm' id='btn-open-login'>\n          <i class='fa-solid fa-right-to-bracket'></i> <span>Masuk</span>\n        </button>\n      </div>\n    </div>\n  </header>\n  <div class='max-w-7xl mx-auto px-2.5 sm:px-4 space-y-4 sm:space-y-6' id='app'>\n    <div class='space-y-4 sm:space-y-6' id='main-panel'>\n      <div class='bg-white rounded-xl p-1.5 border border-slate-200 shadow-sm flex items-center space-x-1.5 sm:space-x-2 text-xs font-bold text-slate-600 overflow-x-auto whitespace-nowrap scrollbar-none'>\n        <button class='bg-blue-50 text-blue-600 border border-blue-200 shadow-xs px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 shrink-0' id='btn-tab-claim'>\n          <i class='fa-solid fa-boxes-stacked' id='icon-tab-claim'></i> <span id='txt-tab-claim'>Klaim &amp; Stock Tema</span>\n        </button>\n        <button class='hover:bg-purple-50 text-purple-700 px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 shrink-0' id='btn-tab-video-tutorials'>\n          <i class='fa-solid fa-circle-play text-purple-600'></i> <span>Video Tutorial Wajib</span>\n          <span class='bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-purple-200 ml-1' id='badge-video-status'>0/0</span>\n        </button>\n        <button class='hover:bg-slate-50 px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 shrink-0' id='btn-tab-dashboard'>\n          <i class='fa-solid fa-chart-line' id='icon-tab-dashboard'></i> <span id='txt-tab-dashboard'>Dashboard Saya</span>\n        </button>\n        <button class='hover:bg-indigo-50 text-indigo-600 px-3 sm:px-4 py-2 rounded-lg transition hidden flex items-center gap-1.5 shrink-0' id='btn-tab-designer-analytics'>\n          <i class='fa-solid fa-ranking-star'></i> Kinerja Desainer\n        </button>\n        <button class='hover:bg-teal-50 text-teal-700 px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 shrink-0' id='btn-tab-activity-history'>\n          <i class='fa-solid fa-clock-rotate-left text-teal-600'></i> <span>Riwayat Aktivitas</span>\n        </button>\n        <button class='hover:bg-amber-50 text-amber-600 px-3 sm:px-4 py-2 rounded-lg transition hidden flex items-center gap-1.5 ml-auto shrink-0' id='btn-tab-admin'>\n          <i class='fa-solid fa-user-shield'></i> Admin Control Panel\n        </button>\n      </div>\n<div class='hidden bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-2.5 sm:p-3 shadow-sm flex items-center gap-2 sm:gap-3 overflow-hidden w-full' id='announcement-banner'>\n  <div class='bg-amber-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg flex items-center gap-1 shrink-0 z-10 shadow-xs'>\n    <i class='fa-solid fa-bullhorn animate-bounce'></i> INFO\n  </div>\n  <div class='relative flex overflow-hidden w-full'>\n    <div class='flex whitespace-nowrap animate-seamless-marquee hover:[animation-play-state:paused]' id='marquee-track-container' style='width: max-content;'>\n      <div class='font-semibold text-xs text-amber-800 pr-12' id='running-text-content'>\n        Memuat pengumuman...\n      </div>\n      <div class='font-semibold text-xs text-amber-800 pr-12' id='running-text-duplicate'>\n        Memuat pengumuman...\n      </div>\n    </div>\n  </div>\n</div>\n  <div class='fixed bg-slate-900/70 backdrop-blur-md z-[9999] flex items-center justify-center hidden opacity-0 transition-opacity duration-300 ease-in-out p-3 sm:p-4' id='modal-flash-banner' style='top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; margin: 0 !important;'>\n    <div class='bg-white text-slate-900 w-full max-w-lg rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 relative transform scale-95 transition-transform duration-300 ease-in-out modal-body-mobile max-h-[85vh] flex flex-col justify-between' id='modal-flash-banner-card'>\n      <button class='absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition flex items-center justify-center text-sm font-bold z-10' id='btn-close-flash-temp' title='Tutup sementara'>\n        <i class='fa-solid fa-xmark'></i>\n      </button>\n      <div class='space-y-3 overflow-y-auto pr-1 scrollbar-thin mt-1'>\n        <div class='flex items-center gap-2.5 border-b pb-3 text-amber-600 pr-6'>\n          <div class='w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg font-black shrink-0'>\n            <i class='fa-solid fa-bullhorn animate-bounce'></i>\n          </div>\n          <div>\n            <h3 class='text-sm sm:text-base font-extrabold text-slate-800 leading-tight'>Pengumuman Penting</h3>\n            <p class='text-[10px] sm:text-[11px] text-slate-500'>Harap baca informasi berikut hingga selesai.</p>\n          </div>\n        </div>\n        <div class='text-xs sm:text-sm text-slate-700 leading-snug py-1' id='flash-banner-content'>\n          Memuat informasi...\n        </div>\n      </div>\n      <div class='pt-3 border-t border-slate-100'>\n        <button class='w-full btn-tokopedia-blue text-xs sm:text-sm font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed' disabled='disabled' id='btn-understand-flash'>\n          <i class='fa-solid fa-clock'></i> <span id='btn-understand-text'>Mengerti (5s)</span>\n        </button>\n      </div>\n    </div>\n  </div>\n      <div class='space-y-4 sm:space-y-6 hidden' id='view-video-tutorials'>\n        <div class='bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4 sm:p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-purple-700'>\n          <div class='space-y-1'>\n            <h2 class='text-sm sm:text-base font-black flex items-center gap-2 text-purple-200'>\n              <i class='fa-solid fa-graduation-cap text-purple-300 text-lg'></i> Pembekalan Standardisasi Kualitas Desain Icon\n            </h2>\n            <p class='text-[11px] text-purple-100 leading-relaxed max-w-2xl'>\n              Setiap video wajib ditonton dari awal hingga akhir <b>tanpa skip (tanpa dipercepat)</b>. Tonton secara berurutan sesuai alur modul untuk memenuhi syarat pengambilan tema baru.\n            </p>\n          </div>\n          <div class='bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-right shrink-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end'>\n            <span class='text-[10px] text-purple-200 font-semibold block'>Status Kelengkapan:</span>\n            <span class='text-xs sm:text-sm font-black text-amber-300' id='txt-video-completion-summary'>0 dari 0 Video Selesai</span>\n          </div>\n        </div>\n        <div class='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>\n          <div class='lg:col-span-2 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-3.5'>\n            <div class='flex items-center justify-between border-b pb-3'>\n              <div class='flex items-center gap-2'>\n                <span class='w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center' id='txt-playing-number'>1</span>\n                <h3 class='text-xs sm:text-sm font-extrabold text-slate-800' id='txt-playing-title'>Pilih Video Tutorial</h3>\n              </div>\n              <span class='text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200' id='badge-playing-status'>\n                <i class='fa-solid fa-lock text-slate-400 mr-1'></i> Terkunci\n              </span>\n            </div>\n            <div class='relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-slate-800'>\n              <div id='yt-tutorial-player'></div>\n              <div class='absolute inset-0 bg-slate-900/90 text-white flex flex-col items-center justify-center text-center p-6 space-y-3 z-10 hidden' id='player-lock-overlay'>\n                <div class='w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center text-xl'>\n                  <i class='fa-solid fa-lock'></i>\n                </div>\n                <div>\n                  <h4 class='text-xs sm:text-sm font-bold text-white'>Video Masih Terkunci!</h4>\n                  <p class='text-[11px] text-slate-300 mt-1 max-w-sm'>Anda harus tuntas menonton seluruh video sebelumnya terlebih dahulu secara berurutan.</p>\n                </div>\n              </div>\n            </div>\n            <div class='p-3 bg-purple-50/60 border border-purple-200 rounded-xl flex items-center justify-between text-xs font-semibold text-purple-900'>\n              <div class='flex items-center gap-2'>\n                <i class='fa-solid fa-circle-info text-purple-600 text-sm'></i>\n                <span>Kemajuan Tontonan: <b class='text-purple-800 font-extrabold' id='txt-watch-progress-percent'>0%</b></span>\n              </div>\n              <span class='text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded border border-purple-200 font-bold' id='txt-watch-timer'>00:00 / 00:00</span>\n            </div>\n          </div>\n          <div class='bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 h-fit lg:sticky lg:top-20'>\n            <div class='flex items-center justify-between border-b pb-3'>\n              <h3 class='text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2'>\n                <i class='fa-solid fa-list-ol text-purple-600'></i> Modul Playlist Video\n              </h3>\n              <span class='text-[10px] text-slate-400 font-semibold' id='txt-total-playlist-count'>0 Video</span>\n            </div>\n            <div class='space-y-2.5 max-h-[480px] overflow-y-auto scrollbar-thin pr-1' id='video-playlist-container'>\n              <div class='p-4 text-center text-xs text-slate-400'>Memuat daftar video tutorial wajib...</div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6' id='view-claim-designer'>\n        <div class='lg:col-span-2 space-y-4'>\n          <div class='bg-purple-900 text-white p-4 rounded-xl shadow-md border border-purple-700 hidden flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3' id='video-requirement-alert-banner'>\n            <div class='flex items-center gap-3'>\n              <div class='w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center text-lg font-black shrink-0 shadow-sm animate-bounce'>\n                <i class='fa-solid fa-lock'></i>\n              </div>\n              <div>\n                <h4 class='text-xs sm:text-sm font-extrabold text-amber-300'>Syarat Klaim Tema Belum Terpenuhi!</h4>\n                <p class='text-[11px] text-purple-100 mt-0.5'>\n                  Anda wajib menonton 1 video tutorial dari awal sampai akhir tanpa skip jika stok video masih tersedia sebelum mengambil tema baru.\n                </p>\n              </div>\n            </div>\n            <button class='bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-lg transition shadow-sm flex items-center gap-1.5 shrink-0 justify-center' onclick='switchTab(&quot;video-tutorials&quot;)'>\n              <i class='fa-solid fa-circle-play'></i> Tonton Video Sekarang\n            </button>\n          </div>\n          <div class='flex items-center justify-between bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-sm'>\n            <h2 class='text-xs font-bold text-slate-800 flex items-center gap-2'>\n              <i class='fa-solid fa-store text-blue-600'></i> Pilih Tema Icon Canva\n            </h2>\n            <span class='text-[10px] sm:text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 sm:px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5'>\n              <span class='w-2 h-2 rounded-full bg-emerald-500 animate-ping'></span> Sync Realtime\n            </span>\n          </div>\n          <div class='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5' id='theme-grid'>\n            <div class='col-span-1 sm:col-span-2 bg-white p-6 rounded-xl border border-slate-200 text-center text-xs text-slate-400'>\n              Memuat data tema dari database...\n            </div>\n          </div>\n          <div class='text-center pt-2 hidden' id='theme-load-more-container'>\n            <button class='bg-slate-100 hover:bg-blue-50 text-blue-600 border border-slate-300 font-bold text-xs px-5 py-2.5 rounded-lg transition shadow-xs inline-flex items-center gap-1.5' id='btn-theme-load-more'>\n              <i class='fa-solid fa-angles-down'></i> Tampilkan Lebih Banyak Tema\n            </button>\n          </div>\n        </div>\n        <div class='bg-white p-4 sm:p-5 rounded-xl space-y-4 h-fit border border-slate-200 shadow-sm lg:sticky lg:top-20' id='form-claim-container'>\n          <h3 class='text-xs font-extrabold text-blue-600 uppercase tracking-wider border-b pb-2.5 flex items-center gap-2'>\n            <i class='fa-solid fa-clipboard-list'></i> Form Klaim Pengerjaan\n          </h3>\n          <div class='p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-200' id='selected-theme-info'>\n            <p class='text-slate-500'>Silakan pilih salah satu tema di sebelah kiri terlebih dahulu.</p>\n          </div>\n          <form class='space-y-3.5 hidden' id='form-claim'>\n            <div>\n              <label class='block text-[11px] font-bold text-slate-700 mb-1'>Jumlah Icon (Nilai)</label>\n              <select class='w-full bg-slate-50 border border-slate-300 text-xs text-slate-800 rounded-lg p-2.5 outline-none focus:border-blue-600 font-semibold' id='input-jumlah'>\n                <option value='3'>3 Icon</option>\n                <option value='6'>6 Icon</option>\n                <option value='9'>9 Icon</option>\n                <option value='12'>12 Icon</option>\n              </select>\n            </div>\n            <div>\n              <label class='block text-[11px] font-bold text-indigo-700 mb-1 flex items-center gap-1'>\n                <i class='fa-solid fa-pen-ruler'></i> Tool Desain Yang Digunakan\n              </label>\n              <select class='w-full bg-indigo-50/50 border border-indigo-200 text-xs text-indigo-900 font-bold rounded-lg p-2.5 outline-none focus:border-indigo-600' id='input-tool-desain'>\n                <option value='Figma'>1. Figma</option>\n                <option value='Infinite Design'>2. Infinite Design</option>\n                <option value='Inkscape'>3. Inkscape</option>\n                <option value='Affinity Designer'>4. Affinity Designer</option>\n                <option value='Bebas (Wajib Rapi)'>5. Bebas (wajib rapi)</option>\n              </select>\n            </div>\n            <div>\n              <label class='block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1'>\n                <i class='fa-solid fa-icons text-blue-600'></i> Jenis Icon\n              </label>\n              <select class='w-full bg-slate-50 border border-slate-300 text-xs text-slate-800 rounded-lg p-2.5 outline-none focus:border-blue-600 font-semibold' id='input-jenis-icon' onchange='toggleIconTypeColorLogic()'>\n                <option value='flat'>1. Flat (Gunakan Warna Pastel)</option>\n                <option value='line'>2. Line (Gunakan Hitam 100%)</option>\n                <option value='glyph'>3. Glyph (Gunakan Hitam 100%)</option>\n              </select>\n            </div>\n            <div class='p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2.5' id='ai-color-container'>\n              <div class='flex items-center justify-between'>\n                <span class='text-[11px] font-extrabold text-purple-900 flex items-center gap-1.5'>\n                  <i class='fa-solid fa-wand-magic-sparkles text-purple-600 animate-pulse'></i> Rekomendasi 5 Warna Pastel\n                </span>\n                <button class='text-[10px] bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold px-2 py-1 rounded border border-purple-300 transition flex items-center gap-1 shadow-2xs' id='btn-regenerate-color' onclick='regeneratePaletteColors()' type='button'>\n                  <i class='fa-solid fa-rotate text-purple-600'></i> Regenerate\n                </button>\n              </div>\n              <div class='grid grid-cols-5 gap-1.5 h-10 rounded-lg overflow-hidden border border-slate-300 p-1 bg-white shadow-inner' id='palette-bars-box'>\n                <div class='h-full rounded text-[9px] font-bold text-slate-400 flex items-center justify-center bg-slate-100 border border-dashed border-slate-300'>-</div>\n                <div class='h-full rounded text-[9px] font-bold text-slate-400 flex items-center justify-center bg-slate-100 border border-dashed border-slate-300'>-</div>\n                <div class='h-full rounded text-[9px] font-bold text-slate-400 flex items-center justify-center bg-slate-100 border border-dashed border-slate-300'>-</div>\n                <div class='h-full rounded text-[9px] font-bold text-slate-400 flex items-center justify-center bg-slate-100 border border-dashed border-slate-300'>-</div>\n                <div class='h-full rounded text-[9px] font-bold text-slate-400 flex items-center justify-center bg-slate-100 border border-dashed border-slate-300'>-</div>\n              </div>\n              <div class='flex items-center justify-between pt-1 gap-2'>\n                <span class='text-[10px] text-purple-700 font-medium truncate' id='txt-palette-status'>Pilih tema flat untuk generate warna.</span>\n                <button class='bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1 shrink-0' id='btn-download-palette' onclick='downloadPaletteAsPNG()' type='button'>\n                  <i class='fa-solid fa-download'></i> Download PNG Panduan Warna\n                </button>\n              </div>\n            </div>\n            <div>\n              <label class='block text-[11px] font-bold text-slate-700 mb-1'>Pengunggahan Canva</label>\n              <select class='w-full bg-slate-50 border border-slate-300 text-xs text-slate-800 rounded-lg p-2.5 outline-none focus:border-blue-600 font-semibold' id='input-upload-type'>\n                <option value='sendiri'>Upload Sendiri (Mandiri)</option>\n                <option value='bantuan'>Dibantu Desainer Lain</option>\n              </select>\n            </div>\n            <div class='hidden' id='uploader-select-box'>\n              <label class='block text-[11px] font-bold text-amber-600 mb-1' id='uploader-select-label'>Pilih Desainer Pembantu</label>\n              <select class='w-full bg-amber-50 border border-amber-300 text-xs text-slate-800 rounded-lg p-2.5 outline-none focus:border-amber-600 font-semibold' id='input-uploader-id'>\n              </select>\n            </div>\n            <div>\n              <label class='block text-[11px] font-bold text-blue-700 mb-1 flex items-center gap-1'>\n                <i class='fa-solid fa-graduation-cap'></i> Target Belajar Hari Ini\n              </label>\n              <input class='w-full bg-blue-50/50 border border-blue-200 text-xs text-slate-800 rounded-lg p-2.5 outline-none focus:border-blue-600 font-semibold' id='input-target-belajar' placeholder='Contoh: Kitab Al-Kabair (BAB 3) halaman 234' required='required' type='text'/>\n            </div>\n            <div class='p-3 bg-blue-50/60 border border-blue-200 rounded-lg space-y-2' id='copy-assets-box'>\n              <div>\n                <span class='text-[10px] text-slate-500 font-semibold block mb-0.5'>Judul Icon:</span>\n                <div class='flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200'>\n                  <span class='text-[11px] text-blue-700 font-bold truncate' id='txt-judul'>-</span>\n                  <button class='text-[10px] text-blue-600 hover:text-blue-800 font-bold ml-2' id='btn-copy-judul' type='button'><i class='fa-regular fa-copy'></i></button>\n                </div>\n              </div>\n              <div>\n                <span class='text-[10px] text-slate-500 font-semibold block mb-0.5'>Keyword Icon (Pisah Koma):</span>\n                <div class='flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200'>\n                  <span class='text-[11px] text-blue-700 font-bold truncate' id='txt-keyword'>-</span>\n                  <button class='text-[10px] text-blue-600 hover:text-blue-800 font-bold ml-2' id='btn-copy-keyword' type='button'><i class='fa-regular fa-copy'></i></button>\n                </div>\n              </div>\n            </div>\n            <div class='space-y-2 pt-1 pb-1 border-t border-slate-200'>\n              <div class='flex items-start gap-2'>\n                <input class='mt-0.5 h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer shrink-0' id='check-confirm-claim' type='checkbox'/>\n                <label class='text-[11px] font-medium text-slate-600 leading-tight cursor-pointer' for='check-confirm-claim'>\n                  Saya menyetujui pengerjaan selesai sebelum 23:59.\n                </label>\n              </div>\n              <div class='flex items-start gap-2'>\n                <input class='mt-0.5 h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer shrink-0' id='check-confirm-quality' type='checkbox'/>\n                <label class='text-[11px] font-bold text-indigo-900 leading-tight cursor-pointer' for='check-confirm-quality'>\n                  Saya berjanji akan membuat desain icon dengan kualitas tinggi, sangat rapi dan siap menerima konsekuensi yaitu <span class='bg-amber-300 text-rose-700 px-1.5 py-0.5 rounded font-extrabold border border-amber-400 animate-pulse inline-block'>turun level atau diberhentikan</span> apabila tidak sesuai kesepakatan.\n                </label>\n              </div>\n            </div>\n            <button class='w-full btn-tokopedia-blue text-xs font-bold py-3 rounded-lg transition shadow-md flex items-center justify-center gap-2' disabled='disabled' id='btn-submit-claim' type='submit'>\n              <i class='fa-solid fa-cloud-arrow-up'></i> Konfirmasi &amp; Buka Drive\n            </button>\n          </form>\n        </div>\n      </div>\n      <div class='space-y-4 sm:space-y-6 hidden' id='view-claim-admin'>\n        <div class='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3'>\n          <div class='flex items-center gap-2 text-xs font-bold text-slate-800'>\n            <i class='fa-solid fa-calendar-days text-blue-600 text-base'></i>\n            <span>Filter Periode:</span>\n          </div>\n          <div class='flex flex-wrap items-center gap-2 text-xs'>\n            <div class='flex items-center gap-1.5 w-full sm:w-auto'>\n              <label class='text-slate-500 font-semibold text-[11px]'>Dari:</label>\n              <input class='border border-slate-300 rounded-lg p-1.5 font-bold text-slate-700 outline-none focus:border-blue-600 w-full sm:w-auto' id='overview-start-date' type='date'/>\n            </div>\n            <div class='flex items-center gap-1.5 w-full sm:w-auto'>\n              <label class='text-slate-500 font-semibold text-[11px]'>Sampai:</label>\n              <input class='border border-slate-300 rounded-lg p-1.5 font-bold text-slate-700 outline-none focus:border-blue-600 w-full sm:w-auto' id='overview-end-date' type='date'/>\n            </div>\n            <div class='flex gap-2 w-full sm:w-auto mt-1 sm:mt-0'>\n              <button class='bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-lg transition shadow-sm flex-1 sm:flex-none' id='btn-filter-overview'>\n                <i class='fa-solid fa-filter'></i> Terapkan\n              </button>\n              <button class='bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-2 rounded-lg transition flex-1 sm:flex-none' id='btn-reset-overview'>\n                Reset\n              </button>\n            </div>\n          </div>\n        </div>\n        <div class='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4'>\n          <div class='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm'>\n            <div class='flex justify-between items-center text-slate-500 text-[10px] sm:text-[11px] font-semibold'>\n              <span>Approved</span>\n              <i class='fa-solid fa-circle-check text-emerald-500 text-xs sm:text-sm'></i>\n            </div>\n            <h3 class='text-xl sm:text-2xl font-black text-emerald-600 mt-1' id='ov-approved'>0 <span class='text-[10px] text-slate-400 font-normal'>icon</span></h3>\n          </div>\n          <div class='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm'>\n            <div class='flex justify-between items-center text-slate-500 text-[10px] sm:text-[11px] font-semibold'>\n              <span>Rejected</span>\n              <i class='fa-solid fa-circle-xmark text-rose-500 text-xs sm:text-sm'></i>\n            </div>\n            <h3 class='text-xl sm:text-2xl font-black text-rose-600 mt-1' id='ov-rejected'>0 <span class='text-[10px] text-slate-400 font-normal'>icon</span></h3>\n          </div>\n          <div class='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm'>\n            <div class='flex justify-between items-center text-slate-500 text-[10px] sm:text-[11px] font-semibold'>\n              <span>In Review</span>\n              <i class='fa-solid fa-clock text-amber-500 text-xs sm:text-sm'></i>\n            </div>\n            <h3 class='text-xl sm:text-2xl font-black text-amber-500 mt-1' id='ov-review'>0 <span class='text-[10px] text-slate-400 font-normal'>icon</span></h3>\n          </div>\n          <div class='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm'>\n            <div class='flex justify-between items-center text-slate-500 text-[10px] sm:text-[11px] font-semibold'>\n              <span>Desainer</span>\n              <i class='fa-solid fa-users text-blue-500 text-xs sm:text-sm'></i>\n            </div>\n            <h3 class='text-xl sm:text-2xl font-black text-slate-800 mt-1' id='ov-desainer'>0 <span class='text-[10px] text-slate-400 font-normal'>orang</span></h3>\n          </div>\n          <div class='col-span-2 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm' id='ov-aktif-card'>\n            <div class='flex justify-between items-center gap-2 text-slate-500 text-[10px] sm:text-[11px] font-semibold'>\n              <span class='flex items-center gap-1.5'><i class='fa-solid fa-circle-play text-emerald-500 text-xs sm:text-sm'></i> Tema Aktif (bisa diklaim)</span>\n              <span class='rounded-full px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-500' id='ov-aktif-badge'>-</span>\n            </div>\n            <div class='flex items-end justify-between gap-3 mt-1'>\n              <h3 class='text-xl sm:text-2xl font-black text-emerald-600' id='ov-aktif'>0 <span class='text-[10px] text-slate-400 font-normal'>/ 0 tema</span></h3>\n              <button class='text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0' id='btn-ov-aktif-lihat' type='button'>Lihat stok tema <i class='fa-solid fa-arrow-right'></i></button>\n            </div>\n            <div class='h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden'><div class='h-full rounded-full transition-all duration-500' id='ov-aktif-bar' style='width:0%;background:#10b981'></div></div>\n            <p class='text-[10px] text-slate-500 mt-1.5' id='ov-aktif-note'>Memuat...</p>\n          </div>\n          <div class='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm'>\n            <div class='flex justify-between items-center text-slate-500 text-[10px] sm:text-[11px] font-semibold'>\n              <span>Total Tema</span>\n              <i class='fa-solid fa-layer-group text-indigo-500 text-xs sm:text-sm'></i>\n            </div>\n            <h3 class='text-xl sm:text-2xl font-black text-indigo-600 mt-1' id='ov-tema'>0 <span class='text-[10px] text-slate-400 font-normal'>tema</span></h3>\n          </div>\n          <div class='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm'>\n            <div class='flex justify-between items-center text-slate-500 text-[10px] sm:text-[11px] font-semibold'>\n              <span>Sisa Stok</span>\n              <i class='fa-solid fa-cubes text-teal-500 text-xs sm:text-sm'></i>\n            </div>\n            <h3 class='text-xl sm:text-2xl font-black text-teal-600 mt-1' id='ov-sisa-tema'>0 <span class='text-[10px] text-slate-400 font-normal'>icon</span></h3>\n          </div>\n          <div class='col-span-2 md:col-span-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 rounded-xl shadow-md'>\n            <div class='flex justify-between items-center text-blue-200 text-[11px] font-semibold'>\n              <span>Total Pengeluaran Gaji</span>\n              <i class='fa-solid fa-wallet text-amber-300 text-base'></i>\n            </div>\n            <h3 class='text-2xl sm:text-3xl font-black mt-1' id='ov-total-pengeluaran'>Rp 0</h3>\n            <p class='text-[9px] text-blue-200 mt-0.5'>*Akumulasi Gaji Desainer (Lvl 2: 750/450, Lvl 3: 2500/1500) + Reward Upload + Bonus Tiering</p>\n          </div>\n        </div>\n        <div class='bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4'>\n          <div class='flex items-center justify-between border-b pb-3'>\n            <h3 class='text-xs font-bold text-slate-800 flex items-center gap-2'>\n              <i class='fa-solid fa-users-gear text-blue-600'></i> Daftar Kelola Desainer System\n            </h3>\n            <button class='bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1 shadow-sm' id='btn-add-designer-overview'>\n              <i class='fa-solid fa-user-plus'></i> Tambah\n            </button>\n          </div>\n          <div class='overflow-x-auto scrollbar-thin'>\n            <table class='w-full text-left border-collapse text-xs min-w-[500px]'>\n              <thead>\n                <tr class='border-b border-slate-200 text-slate-500 bg-slate-50 font-bold'>\n                  <th class='p-3 sortable-header' onclick='sortOverviewDesigners(&apos;full_name&apos;)'>\n                    Nama <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-overview-full_name'></i>\n                  </th>\n                  <th class='p-3 sortable-header' onclick='sortOverviewDesigners(&apos;email&apos;)'>\n                    Email <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-overview-email'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortOverviewDesigners(&apos;level&apos;)'>\n                    Level <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-overview-level'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortOverviewDesigners(&apos;role&apos;)'>\n                    Role <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-overview-role'></i>\n                  </th>\n                  <th class='p-3 text-center'>Aksi</th>\n                </tr>\n              </thead>\n              <tbody class='divide-y divide-slate-100' id='overview-designers-body'>\n                <tr><td class='p-4 text-center text-slate-400' colspan='5'>Memuat data desainer...</td></tr>\n              </tbody>\n            </table>\n          </div>\n          <div class='text-center pt-2 hidden' id='overview-designers-load-more-container'>\n            <button class='bg-slate-100 hover:bg-blue-50 text-blue-600 border border-slate-300 font-bold text-xs px-5 py-2.5 rounded-lg transition shadow-xs inline-flex items-center gap-1.5' id='btn-overview-designers-load-more'>\n              <i class='fa-solid fa-angles-down'></i> Tampilkan Lebih Banyak\n            </button>\n          </div>\n        </div>\n      </div>\n      <div class='space-y-4 sm:space-y-6 hidden' id='view-designer-analytics'>\n        <div class='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3'>\n          <div class='flex items-center gap-2 text-xs font-bold text-slate-800'>\n            <i class='fa-solid fa-user-check text-indigo-600 text-base'></i>\n            <span>Filter Kinerja Desainer:</span>\n          </div>\n          <div class='flex flex-wrap items-center gap-2 text-xs'>\n            <div class='flex items-center gap-1.5 w-full sm:w-auto'>\n              <label class='text-slate-500 font-semibold text-[11px]'>Desainer:</label>\n              <select class='border border-slate-300 rounded-lg p-1.5 font-bold text-slate-800 outline-none focus:border-indigo-600 w-full sm:w-auto bg-slate-50' id='analytics-select-designer' onchange='loadDesignerAnalyticsData()'>\n              </select>\n            </div>\n            <div class='flex items-center gap-1.5 w-full sm:w-auto'>\n              <label class='text-slate-500 font-semibold text-[11px]'>Dari:</label>\n              <input class='border border-slate-300 rounded-lg p-1.5 font-bold text-slate-700 outline-none focus:border-indigo-600 w-full sm:w-auto' id='analytics-start-date' type='date'/>\n            </div>\n            <div class='flex items-center gap-1.5 w-full sm:w-auto'>\n              <label class='text-slate-500 font-semibold text-[11px]'>Sampai:</label>\n              <input class='border border-slate-300 rounded-lg p-1.5 font-bold text-slate-700 outline-none focus:border-indigo-600 w-full sm:w-auto' id='analytics-end-date' type='date'/>\n            </div>\n            <div class='flex gap-2 w-full sm:w-auto mt-1 sm:mt-0'>\n              <button class='bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-2 rounded-lg transition shadow-sm flex-1 sm:flex-none' id='btn-filter-analytics'>\n                <i class='fa-solid fa-filter'></i> Terapkan\n              </button>\n            </div>\n          </div>\n        </div>\n        <div class='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl'>\n          <div class='bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3'>\n            <div class='flex justify-between items-center'>\n              <span class='text-xs font-bold text-slate-700 flex items-center gap-1.5'>\n                <i class='fa-solid fa-database text-emerald-500'></i> Kapasitas Supabase Free\n              </span>\n              <span class='text-[10px] font-bold text-slate-500' id='db-usage-text'>Loading...</span>\n            </div>\n            <div class='w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200'>\n              <div class='bg-emerald-500 h-2 rounded-full transition-all duration-500' id='db-progress-bar' style='width: 0%'></div>\n            </div>\n            <div class='flex justify-between items-center text-[10px] text-slate-400'>\n              <span>Limit: 500 MB</span>\n              <span class='font-bold text-emerald-600' id='db-percentage'>0%</span>\n            </div>\n          </div>\n          <div class='bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3'>\n            <div class='flex justify-between items-center'>\n              <span class='text-xs font-bold text-slate-700 flex items-center gap-1.5'>\n                <i class='fa-solid fa-circle-play text-purple-600'></i> Video Tutorial Wajib\n              </span>\n              <span class='text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200' id='an-video-usage-text'>0 / 0 Video</span>\n            </div>\n            <div class='w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200'>\n              <div class='bg-purple-600 h-2 rounded-full transition-all duration-500' id='an-video-progress-bar' style='width: 0%'></div>\n            </div>\n            <div class='flex justify-between items-center text-[10px] text-slate-400'>\n              <span id='an-video-status-label'>Belum ada data</span>\n              <span class='font-bold text-purple-600' id='an-video-percentage'>0%</span>\n            </div>\n          </div>\n        </div>\n        <div class='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4'>\n          <div class='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm'>\n            <p class='text-[10px] sm:text-[11px] text-slate-500 font-semibold'>Total Tema Diambil</p>\n            <h3 class='text-xl sm:text-2xl font-extrabold text-indigo-600 mt-1' id='an-total-tema'>0 <span class='text-[10px] text-slate-400 font-normal'>tema</span></h3>\n          </div>\n          <div class='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm'>\n            <p class='text-[10px] sm:text-[11px] text-slate-500 font-semibold'>Total Icon Dibuat</p>\n            <h3 class='text-xl sm:text-2xl font-extrabold text-blue-600 mt-1' id='an-total-icon'>0 <span class='text-[10px] text-slate-400 font-normal'>icon</span></h3>\n          </div>\n          <div class='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm'>\n            <p class='text-[10px] sm:text-[11px] text-slate-500 font-semibold'>Status Icon (App / Rej / Rev)</p>\n            <h3 class='text-base sm:text-lg font-black mt-1'>\n              <span class='text-emerald-600' id='an-approved'>0</span> / \n              <span class='text-rose-600' id='an-rejected'>0</span> / \n              <span class='text-amber-500' id='an-review'>0</span>\n            </h3>\n          </div>\n          <div class='bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-3.5 sm:p-4 rounded-xl shadow-md'>\n            <p class='text-[10px] sm:text-[11px] text-emerald-100 font-semibold'>Total Pendapatan</p>\n            <h3 class='text-xl sm:text-2xl font-extrabold mt-1' id='an-total-pendapatan'>Rp 0</h3>\n            <p class='text-[8px] sm:text-[9px] text-emerald-200 mt-0.5' id='an-breakdown-pendapatan'>*Breakdown Gaji</p>\n          </div>\n        </div>\n        <div class='bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-3'>\n          <div class='flex items-center justify-between border-b pb-3'>\n            <h3 class='text-xs font-bold text-slate-800 flex items-center gap-2'>\n              <i class='fa-solid fa-chart-column text-indigo-600'></i> Realtime Kenaikan / Penurunan Kinerja Pekanan\n            </h3>\n            <span class='text-[10px] text-slate-400 font-medium'>Distribusi Mingguan</span>\n          </div>\n          <div class='relative h-64 sm:h-72 w-full'>\n            <canvas id='chartKinerejaPekanan'></canvas>\n          </div>\n        </div>\n        <div class='bg-slate-900 text-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 border border-indigo-500/30' id='checked-summary-card'>\n          <div class='flex items-center gap-2.5'>\n            <div class='w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0'>\n              <i class='fa-solid fa-square-check'></i>\n            </div>\n            <div>\n              <h4 class='text-xs font-extrabold text-indigo-300 uppercase tracking-wider'>Ringkasan Baris Diceklist</h4>\n              <p class='text-[10px] text-slate-400'><span id='cnt-checked-rows'>0</span> baris terpilih dari tabel di bawah</p>\n            </div>\n          </div>\n          <div class='flex items-center gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end'>\n            <div class='bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-center'>\n              <span class='block text-[9px] text-slate-400 font-semibold'>Total Icon</span>\n              <span class='font-black text-indigo-400 text-sm' id='cnt-total-icon'>0</span>\n            </div>\n            <div class='bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-center'>\n              <span class='block text-[9px] text-emerald-400 font-semibold'>Approved</span>\n              <span class='font-black text-emerald-400 text-sm' id='cnt-approved'>0</span>\n            </div>\n            <div class='bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-center'>\n              <span class='block text-[9px] text-rose-400 font-semibold'>Rejected</span>\n              <span class='font-black text-rose-400 text-sm' id='cnt-rejected'>0</span>\n            </div>\n            <div class='bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-center'>\n              <span class='block text-[9px] text-amber-400 font-semibold'>In Review</span>\n              <span class='font-black text-amber-400 text-sm' id='cnt-review'>0</span>\n            </div>\n          </div>\n        </div>\n        <div class='bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4'>\n          <div class='flex items-center justify-between border-b pb-3'>\n            <h3 class='text-xs font-bold text-slate-800 flex items-center gap-2'>\n              <i class='fa-solid fa-list-check text-indigo-600'></i> Rincian Tema Yang Dikerjakan\n            </h3>\n            <span class='text-[10px] text-slate-400 font-semibold'>*Klik header tabel untuk mengurutkan (A-Z / 0-9)</span>\n          </div>\n          <div class='overflow-x-auto scrollbar-thin'>\n            <table class='w-full text-left border-collapse text-xs min-w-[650px]'>\n              <thead>\n                <tr class='border-b border-slate-200 text-slate-500 bg-slate-50 font-bold'>\n                  <th class='p-3 text-center w-10'>\n                    <input class='w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer' id='check-all-analytics' onclick='toggleSelectAllAnalytics(this)' type='checkbox'/>\n                  </th>\n                  <th class='p-3 sortable-header' onclick='sortAnalyticsTable(&apos;created_at&apos;)'>\n                    Tanggal Klaim <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-an-created_at'></i>\n                  </th>\n                  <th class='p-3 sortable-header' onclick='sortAnalyticsTable(&apos;kategori&apos;)'>\n                    Tema / Kategori <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-an-kategori'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortAnalyticsTable(&apos;jumlah_icon&apos;)'>\n                    Total Icon <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-an-jumlah_icon'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortAnalyticsTable(&apos;approved_calc&apos;)'>\n                    Approved <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-an-approved_calc'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortAnalyticsTable(&apos;rejected_count&apos;)'>\n                    Rejected <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-an-rejected_count'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortAnalyticsTable(&apos;in_review_count&apos;)'>\n                    In Review <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-an-in_review_count'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortAnalyticsTable(&apos;status_admin&apos;)'>\n                    Status Admin <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-an-status_admin'></i>\n                  </th>\n                </tr>\n              </thead>\n              <tbody class='divide-y divide-slate-100' id='analytics-table-body'>\n                <tr><td class='p-4 text-center text-slate-400' colspan='8'>Silakan pilih desainer dan klik terapkan filter.</td></tr>\n              </tbody>\n            </table>\n          </div>\n        </div>\n      </div>\n      <div class='space-y-4 sm:space-y-6 hidden' id='view-my-dashboard'>\n        <div class='hidden' id='designer-status-banner'></div>\n        <div class='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3'>\n          <div class='flex items-center gap-2 text-xs font-bold text-slate-800'>\n            <i class='fa-solid fa-calendar-days text-blue-600 text-base'></i>\n            <span>Filter Laporan:</span>\n          </div>\n          <div class='flex flex-wrap items-center gap-2 text-xs'>\n            <div class='flex items-center gap-1.5 w-full sm:w-auto'>\n              <label class='text-slate-500 font-semibold text-[11px]'>Dari:</label>\n              <input class='border border-slate-300 rounded-lg p-1.5 font-bold text-slate-700 outline-none focus:border-blue-600 w-full sm:w-auto' id='user-start-date' type='date'/>\n            </div>\n            <div class='flex items-center gap-1.5 w-full sm:w-auto'>\n              <label class='text-slate-500 font-semibold text-[11px]'>Sampai:</label>\n              <input class='border border-slate-300 rounded-lg p-1.5 font-bold text-slate-700 outline-none focus:border-blue-600 w-full sm:w-auto' id='user-end-date' type='date'/>\n            </div>\n            <div class='flex gap-2 w-full sm:w-auto mt-1 sm:mt-0'>\n              <button class='bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-lg transition shadow-sm flex-1 sm:flex-none' id='btn-filter-user'>\n                <i class='fa-solid fa-filter'></i> Terapkan\n              </button>\n              <button class='bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-2 rounded-lg transition flex-1 sm:flex-none' id='btn-reset-user'>\n                Reset\n              </button>\n            </div>\n          </div>\n        </div>\n        <div class='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4'>\n          <div class='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm'>\n            <p class='text-[10px] sm:text-[11px] text-slate-500 font-semibold'>Total Approved</p>\n            <h3 class='text-xl sm:text-2xl font-extrabold text-slate-800 mt-1' id='stat-approved'>0 <span class='text-[10px] text-slate-400 font-normal'>icon</span></h3>\n          </div>\n          <div class='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm'>\n            <p class='text-[10px] sm:text-[11px] text-slate-500 font-semibold'>Upload ke Canva (R1)</p>\n            <h3 class='text-xl sm:text-2xl font-extrabold text-blue-600 mt-1' id='stat-reward1'>Rp 0</h3>\n          </div>\n          <div class='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm'>\n            <p class='text-[10px] sm:text-[11px] text-slate-500 font-semibold'>Bonus Tier (R2)</p>\n            <h3 class='text-xl sm:text-2xl font-extrabold text-amber-500 mt-1' id='stat-reward2-tier'>Rp 0</h3>\n          </div>\n          <div class='bg-blue-600 text-white p-3.5 sm:p-4 rounded-xl shadow-md'>\n            <p class='text-[10px] sm:text-[11px] text-blue-100 font-semibold'>Estimasi Gaji (<span id='stat-user-level-badge'>Level 2</span>)</p>\n            <h3 class='text-xl sm:text-2xl font-extrabold mt-1' id='stat-total-salary'>Rp 0</h3>\n            <p class='text-[8px] sm:text-[9px] text-blue-200 mt-0.5'>*Privat (Anda &amp; Admin)</p>\n          </div>\n        </div>\n        <div class='bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4'>\n          <h3 class='text-xs font-bold text-slate-800 flex items-center gap-2'>\n            <i class='fa-solid fa-list-check text-blue-600'></i> Status Laporan &amp; Upload Canva\n          </h3>\n          <div class='overflow-x-auto scrollbar-thin'>\n            <table class='w-full text-left border-collapse text-xs min-w-[650px]'>\n              <thead>\n                <tr class='border-b border-slate-200 text-slate-500 bg-slate-50 font-bold'>\n                  <th class='p-3 sortable-header' onclick='sortUserProjects(&apos;created_at&apos;)'>\n                    Tanggal <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-user-created_at'></i>\n                  </th>\n                  <th class='p-3 sortable-header' onclick='sortUserProjects(&apos;kategori&apos;)'>\n                    Tema <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-user-kategori'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortUserProjects(&apos;jumlah_icon&apos;)'>\n                    Nilai <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-user-jumlah_icon'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortUserProjects(&apos;in_review_count&apos;)'>\n                    Review <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-user-in_review_count'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortUserProjects(&apos;rejected_count&apos;)'>\n                    Reject <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-user-rejected_count'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortUserProjects(&apos;approved_calc&apos;)'>\n                    Approve <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-user-approved_calc'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortUserProjects(&apos;status_admin&apos;)'>\n                    Status <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-user-status_admin'></i>\n                  </th>\n                  <th class='p-3 text-center'>Aksi Pengerjaan</th>\n                </tr>\n              </thead>\n              <tbody class='divide-y divide-slate-100' id='user-projects-body'>\n                <tr><td class='p-4 text-center text-slate-400' colspan='8'>Memuat data pengerjaan...</td></tr>\n              </tbody>\n            </table>\n          </div>\n          <div class='text-center pt-2 hidden' id='user-load-more-container'>\n            <button class='bg-slate-100 hover:bg-blue-50 text-blue-600 border border-slate-300 font-bold text-xs px-5 py-2.5 rounded-lg transition shadow-xs inline-flex items-center gap-1.5' id='btn-user-load-more'>\n              <i class='fa-solid fa-angles-down'></i> Tampilkan Lebih Banyak\n            </button>\n          </div>\n        </div>\n      </div>\n      <audio id='notif-sound' playsinline='playsinline' preload='none'>\n        <source src='https://dn711003.ca.archive.org/0/items/coins-497/coins-497.mp3' type='audio/mpeg'/>\n      </audio>\n      <div class='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 hidden' id='view-admin-themes'>\n        <div class='bg-white p-4 sm:p-5 rounded-xl space-y-4 border border-slate-200 shadow-sm h-fit lg:sticky lg:top-20'>\n          <h3 class='text-xs font-extrabold text-blue-700 uppercase tracking-wider border-b pb-2.5 flex items-center gap-2' id='form-theme-title'>\n            <i class='fa-solid fa-plus-circle'></i> Tambah Tema Baru\n          </h3>\n          <form class='space-y-3' id='form-manage-theme'>\n            <input id='theme-old-kategori' type='hidden'/>\n            <div>\n              <label class='block text-[11px] font-bold text-slate-700 mb-1'>Nama Tema / Kategori</label>\n              <input class='w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold outline-none focus:border-blue-600' id='theme-kategori' placeholder='Contoh: Kitab Aqidah' required='required' type='text'/>\n            </div>\n            <div>\n              <label class='block text-[11px] font-bold text-indigo-700 mb-1 flex items-center gap-1'>\n                <i class='fa-solid fa-screwdriver-wrench'></i> Ketentuan Tool Desain (Wajib)\n              </label>\n              <select class='w-full border border-indigo-200 bg-indigo-50/40 rounded-lg p-2.5 text-xs font-bold text-indigo-900 outline-none focus:border-indigo-600' id='theme-tool-desain' required='required'>\n                <option value='Figma'>1. Figma</option>\n                <option value='Infinite Design'>2. Infinite Design</option>\n                <option value='Inkscape'>3. Inkscape</option>\n                <option value='Affinity Designer'>4. Affinity Designer</option>\n                <option value='Bebas (Wajib Rapi)'>5. Bebas (wajib rapi)</option>\n              </select>\n            </div>\n            <div>\n              <label class='block text-[11px] font-bold text-slate-700 mb-1'>Sisa Kuota Icon</label>\n              <input class='w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold outline-none focus:border-blue-600' id='theme-kuota' min='0' placeholder='100' required='required' type='number'/>\n            </div>\n            <div>\n              <label class='block text-[11px] font-bold text-slate-700 mb-1'>Judul Icon</label>\n              <input class='w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600' id='theme-judul' placeholder='Contoh: 3D Icon Kitab' required='required' type='text'/>\n            </div>\n            <div class='space-y-1.5'>\n        <div class='flex items-center justify-between'>\n          <label class='block text-[11px] font-bold text-slate-700 mb-1'>Keyword (Pisah koma)</label>\n          <span class='text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200' id='keyword-counter-badge'>\n            0 Kata\n          </span>\n        </div>\n        <textarea class='w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 h-20 font-sans leading-relaxed' id='theme-keyword' oninput='handleKeywordLiveAnalysis()' placeholder='toaster, bread, toast, breakfast...' required='required'></textarea>\n        <div class='p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed hidden' id='keyword-highlight-preview'>\n          <div class='text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1'>Preview &amp; Deteksi Duplikat:</div>\n          <div class='flex flex-wrap gap-1' id='keyword-highlight-words'></div>\n        </div>\n      </div>\n            <div>\n              <label class='block text-[11px] font-bold text-blue-600 mb-1 flex items-center gap-1'>\n                <i class='fa-solid fa-link'></i> Link Sample (URL)\n              </label>\n              <input class='w-full border border-blue-200 bg-blue-50/30 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 font-semibold' id='theme-sample-url' placeholder='https://drive.google.com/...' type='url'/>\n            </div>\n            <div class='flex gap-2 pt-1'>\n              <button class='w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-lg transition shadow-sm' id='btn-save-theme' type='submit'>\n                <i class='fa-solid fa-floppy-disk'></i> Simpan Tema\n              </button>\n              <button class='bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-3 rounded-lg transition hidden' id='btn-cancel-theme' type='button'>\n                Batal\n              </button>\n            </div>\n          </form>\n        </div>\n        <div class='lg:col-span-2 min-w-0 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4'>\n          <div class='flex flex-col xl:flex-row items-start xl:items-center justify-between border-b pb-3 gap-2.5'>\n            <h3 class='text-xs font-bold text-slate-800 flex items-center gap-2 shrink-0'>\n              <i class='fa-solid fa-list-check text-blue-600'></i> <span id='admin-themes-title'>Daftar Stok Tema</span>\n            </h3>\n            <div class='flex flex-col sm:flex-row sm:items-center gap-2 w-full xl:w-auto'>\n              <div class='flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 shrink-0' id='theme-status-filter' role='group' aria-label='Filter status tema'>\n                <button class='tsf-btn flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition' data-f='all' onclick='setThemeStatusFilter(&apos;all&apos;)' type='button'>Semua <span class='tsf-n text-[10px] font-semibold opacity-70' id='tsf-n-all'>0</span></button>\n                <button class='tsf-btn flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition' data-f='active' onclick='setThemeStatusFilter(&apos;active&apos;)' type='button'><span class='w-1.5 h-1.5 rounded-full bg-emerald-500'></span>Aktif <span class='tsf-n text-[10px] font-semibold opacity-70' id='tsf-n-active'>0</span></button>\n                <button class='tsf-btn flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition' data-f='inactive' onclick='setThemeStatusFilter(&apos;inactive&apos;)' type='button'><span class='w-1.5 h-1.5 rounded-full bg-slate-400'></span>Nonaktif <span class='tsf-n text-[10px] font-semibold opacity-70' id='tsf-n-inactive'>0</span></button>\n              </div>\n              <div class='flex items-center gap-2 w-full sm:w-auto sm:flex-1 xl:flex-none'>\n              <div class='relative w-full xl:w-56'>\n                <i class='fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs'></i>\n                <input class='w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 font-semibold outline-none focus:border-blue-600 focus:bg-white transition' id='input-search-admin-themes' oninput='filterAdminThemesTable()' placeholder='Cari tema, judul, keyword...' type='text'/>\n              </div>\n              <span class='text-[10px] text-slate-500 font-semibold shrink-0' id='total-theme-count'>0 Tema</span>\n              </div>\n            </div>\n          </div>\n          <div class='overflow-x-auto scrollbar-thin'>\n            <table class='w-full text-left border-collapse text-xs min-w-[600px]'>\n              <thead>\n                <tr class='border-b border-slate-200 text-slate-500 bg-slate-50 font-bold'>\n                  <th class='p-3 sortable-header' onclick='sortAdminThemes(&apos;kategori&apos;)'>\n                    Tema <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-themes-kategori'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortAdminThemes(&apos;sisa_kuota&apos;)'>\n                    Stok <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-themes-sisa_kuota'></i>\n                  </th>\n                  <th class='p-3 sortable-header' onclick='sortAdminThemes(&apos;judul&apos;)'>\n                    Judul <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-themes-judul'></i>\n                  </th>\n                  <th class='p-3 sortable-header' onclick='sortAdminThemes(&apos;keyword&apos;)'>\n                    Keyword <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-themes-keyword'></i>\n                  </th>\n                 <th class='p-3 text-center'>Sample</th>\n                  <th class='p-3 text-center'>Status</th>\n                  <th class='p-3 text-center'>Aksi</th>\n                </tr>\n              </thead>\n              <tbody class='divide-y divide-slate-100' id='admin-themes-body'>\n                <tr><td class='p-4 text-center text-slate-400' colspan='7'>Memuat stok tema...</td></tr>\n              </tbody>\n            </table>\n          </div>\n          <div class='text-center pt-2 hidden' id='themes-load-more-container'>\n            <button class='bg-slate-100 hover:bg-blue-50 text-blue-600 border border-slate-300 font-bold text-xs px-5 py-2.5 rounded-lg transition shadow-xs inline-flex items-center gap-1.5' id='btn-themes-load-more'>\n              <i class='fa-solid fa-angles-down'></i> Tampilkan Lebih Banyak\n            </button>\n          </div>\n        </div>\n      </div>\n      <div class='space-y-4 sm:space-y-6 hidden' id='view-admin'>\n        <div class='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 text-white p-4 sm:p-5 rounded-xl shadow-md'>\n          <div>\n            <h2 class='text-sm font-bold flex items-center gap-2 text-amber-400'>\n              <i class='fa-solid fa-user-shield'></i> Control Panel Manager\n            </h2>\n            <p class='text-[10px] sm:text-[11px] text-slate-400'>Moderasi Pendapatan &amp; Cetak Slip Gaji PDF</p>\n          </div>\n          <div class='flex gap-2 flex-wrap w-full sm:w-auto'>\n            <button class='bg-purple-600 hover:bg-purple-500 text-white text-[11px] sm:text-xs px-3 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shadow-sm flex-1 sm:flex-none justify-center' id='btn-open-manage-videos'>\n              <i class='fa-solid fa-video'></i> Kelola Video Tutorial\n            </button>\n            <button class='bg-amber-500 hover:bg-amber-600 text-white text-[11px] sm:text-xs px-3 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shadow-sm flex-1 sm:flex-none justify-center' id='btn-open-announcement-modal'>\n              <i class='fa-solid fa-bullhorn'></i> Running Text\n            </button>\n            <button class='bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] sm:text-xs px-3 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shadow-sm flex-1 sm:flex-none justify-center' id='btn-open-flash-announcement-modal'>\n              <i class='fa-solid fa-window-restore'></i> Pop-up Informasi Login\n            </button>\n            <button class='bg-blue-600 hover:bg-blue-500 text-white text-[11px] sm:text-xs px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow-sm flex-1 sm:flex-none justify-center' id='btn-export-excel'>\n              <i class='fa-solid fa-file-excel'></i> Export\n            </button>\n            <button class='bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] sm:text-xs px-3 py-2 rounded-lg transition flex items-center gap-1 shadow w-full sm:w-auto justify-center' id='btn-open-slip-gaji'>\n              <i class='fa-solid fa-print'></i> Cetak Slip Gaji\n            </button>\n          </div>\n        </div>\n        <div class='bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4'>\n          <div class='flex flex-col sm:flex-row items-center justify-between gap-3 border-b pb-3'>\n            <h3 class='text-xs font-bold text-slate-800 flex items-center gap-2'>\n              <i class='fa-solid fa-list-check text-blue-600'></i> Daftar Laporan Pengerjaan Desainer\n            </h3>\n            <div class='relative w-full sm:w-72'>\n              <i class='fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs'></i>\n              <input class='w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 font-semibold outline-none focus:border-blue-600 focus:bg-white transition' id='input-search-admin-projects' oninput='filterAdminProjectsTable()' placeholder='Cari desainer, tema, status...' type='text'/>\n            </div>\n          </div>\n          <div class='overflow-x-auto scrollbar-thin'>\n            <table class='w-full text-left border-collapse text-xs min-w-[750px]'>\n              <thead>\n                <tr class='border-b border-slate-200 text-slate-500 bg-slate-50 font-bold'>\n                  <th class='p-3 sortable-header' onclick='sortAdminProjects(&apos;created_at&apos;)'>\n                    Tanggal <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-admin-created_at'></i>\n                  </th>\n                  <th class='p-3 sortable-header' onclick='sortAdminProjects(&apos;designer_name&apos;)'>\n                    Desainer <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-admin-designer_name'></i>\n                  </th>\n                  <th class='p-3 sortable-header' onclick='sortAdminProjects(&apos;kategori&apos;)'>\n                    Tema <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-admin-kategori'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortAdminProjects(&apos;jumlah_icon&apos;)'>\n                    Nilai <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-admin-jumlah_icon'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortAdminProjects(&apos;in_review_count&apos;)'>\n                    Review <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-admin-in_review_count'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortAdminProjects(&apos;rejected_count&apos;)'>\n                    Reject <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-admin-rejected_count'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortAdminProjects(&apos;approved_calc&apos;)'>\n                    Approve <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-admin-approved_calc'></i>\n                  </th>\n                  <th class='p-3 text-center sortable-header' onclick='sortAdminProjects(&apos;status_admin&apos;)'>\n                    Status <i class='fa-solid fa-sort text-slate-300 ml-1' id='sort-icon-admin-status_admin'></i>\n                  </th>\n                  <th class='p-3 text-center'>Aksi Kendali</th>\n                </tr>\n              </thead>\n              <tbody class='divide-y divide-slate-100' id='admin-table-body'>\n                <tr><td class='p-4 text-center text-slate-400' colspan='9'>Memuat data laporan desainer...</td></tr>\n              </tbody>\n            </table>\n          </div>\n          <div class='text-center pt-2 hidden' id='admin-load-more-container'>\n            <button class='bg-slate-100 hover:bg-blue-50 text-blue-600 border border-slate-300 font-bold text-xs px-5 py-2.5 rounded-lg transition shadow-xs inline-flex items-center gap-1.5' id='btn-admin-load-more'>\n              <i class='fa-solid fa-angles-down'></i> Tampilkan Lebih Banyak\n            </button>\n          </div>\n        </div>\n      </div>\n      <div class='space-y-4 sm:space-y-6 hidden' id='view-activity-history'>\n        <div class='bg-amber-50 border border-amber-300 text-amber-900 rounded-xl p-3 sm:p-3.5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 no-print' id='activity-retention-banner'>\n          <div class='flex items-center gap-2.5'>\n            <div class='w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center text-sm shrink-0 shadow-2xs'>\n              <i class='fa-solid fa-hourglass-half animate-pulse'></i>\n            </div>\n            <div>\n              <h4 class='text-xs font-extrabold text-amber-950'>Peringatan Pembersihan Log Otomatis</h4>\n              <p class='text-[11px] text-amber-800 leading-snug'>\n                Data riwayat aktivitas ini akan terhapus otomatis sesuai jadwal retensi sistem (<b id='txt-retention-days-label'>30 Hari</b>). Silakan export CSV atau PDF sebelum waktu habis.\n              </p>\n            </div>\n          </div>\n          <div class='bg-white border border-amber-300 px-3 py-1.5 rounded-lg text-center shrink-0 self-end sm:self-center shadow-2xs'>\n            <span class='block text-[9px] font-bold text-slate-400 uppercase tracking-wider'>Sisa Waktu Sebelum Terhapus</span>\n            <span class='text-xs sm:text-sm font-black text-rose-600 font-mono' id='activity-retention-countdown'>Memuat timer...</span>\n          </div>\n        </div>\n        <div class='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3'>\n          <div class='flex items-center gap-2 text-xs font-bold text-slate-800'>\n            <i class='fa-solid fa-clock-rotate-left text-teal-600 text-base'></i>\n            <span>Log Riwayat Aktivitas Sistem</span>\n          </div>\n          <div class='flex flex-wrap items-center gap-2 text-xs no-print'>\n            <div class='hidden flex items-center gap-1.5 w-full sm:w-auto' id='activity-admin-filter-box'>\n              <label class='text-slate-500 font-semibold text-[11px]'>Desainer:</label>\n              <select class='border border-slate-300 rounded-lg p-1.5 font-bold text-slate-800 outline-none focus:border-teal-600 bg-slate-50' id='activity-filter-user' onchange='loadActivityHistory(true)'>\n                <option value='ALL'>Semua Desainer</option>\n              </select>\n            </div>\n            <select class='border border-slate-300 rounded-lg p-1.5 font-bold text-slate-700 outline-none focus:border-teal-600 bg-slate-50 w-full sm:w-auto' id='activity-filter-type' onchange='loadActivityHistory(true)'>\n              <option value='ALL'>Semua Aktivitas</option>\n              <option value='KLAIM'>Klaim Tema</option>\n              <option value='UPLOAD_DRIVE'>Upload Drive</option>\n              <option value='LAPORAN'>Kirim Laporan</option>\n              <option value='UPLOAD_CANVA'>Upload Canva</option>\n              <option value='UPLOAD_ADOBE'>Upload Adobe</option>\n              <option value='MODERASI'>Approve / Reject Admin</option>\n              <option value='AUTH'>Login Akun</option>\n            </select>\n            <button class='bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-sm flex items-center gap-1.5 justify-center' onclick='exportActivityHistoryCSV()' type='button'>\n              <i class='fa-solid fa-file-csv'></i> Export CSV\n            </button>\n            <button class='bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-sm flex items-center gap-1.5 justify-center' onclick='exportActivityHistoryPDF()' type='button'>\n              <i class='fa-solid fa-file-pdf'></i> Export PDF\n            </button>\n            <button class='bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-sm flex items-center gap-1.5 justify-center' onclick='loadActivityHistory(true)' type='button'>\n              <i class='fa-solid fa-rotate'></i> Refresh\n            </button>\n          </div>\n        </div>\n        <div class='bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4'>\n          <div class='overflow-x-auto scrollbar-thin'>\n            <table class='w-full text-left border-collapse text-xs min-w-[600px]'>\n              <thead>\n                <tr class='border-b border-slate-200 text-slate-500 bg-slate-50 font-bold'>\n                  <th class='p-3 w-40'>Waktu</th>\n                  <th class='p-3 w-44'>Pengguna</th>\n                  <th class='p-3 text-center w-32'>Kategori</th>\n                  <th class='p-3'>Detail Aktivitas</th>\n                </tr>\n              </thead>\n              <tbody class='divide-y divide-slate-100' id='activity-history-body'>\n                <tr><td class='p-4 text-center text-slate-400' colspan='4'>Memuat riwayat aktivitas...</td></tr>\n              </tbody>\n            </table>\n          </div>\n          <div class='text-center pt-2 hidden' id='activity-load-more-container'>\n            <button class='bg-slate-100 hover:bg-teal-50 text-teal-700 border border-slate-300 font-bold text-xs px-5 py-2.5 rounded-lg transition shadow-xs inline-flex items-center gap-1.5' id='btn-activity-load-more'>\n              <i class='fa-solid fa-angles-down'></i> Tampilkan Lebih Banyak\n            </button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center hidden p-3 sm:p-4' id='modal-manage-videos'>\n    <div class='bg-white text-slate-900 w-full max-w-2xl rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 relative modal-body-mobile max-h-[90vh] overflow-y-auto scrollbar-thin'>\n      <button class='absolute top-3 right-3 text-slate-400 hover:text-slate-700' id='btn-close-manage-videos'>\n        <i class='fa-solid fa-xmark text-lg'></i>\n      </button>\n      <div class='border-b pb-3 flex items-center justify-between'>\n        <div>\n          <h3 class='text-base font-extrabold text-slate-800 flex items-center gap-2'>\n            <i class='fa-solid fa-video text-purple-600'></i> Pengaturan Video Tutorial Wajib\n          </h3>\n          <p class='text-xs text-slate-500 mt-0.5'>Video baru yang ditambahkan otomatis menjadi syarat wajib tonton desainer.</p>\n        </div>\n      </div>\n      <form class='bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3' id='form-video-item'>\n        <input id='video-edit-id' type='hidden'/>\n        <div class='grid grid-cols-1 sm:grid-cols-3 gap-3'>\n          <div class='sm:col-span-2'>\n            <label class='block text-[11px] font-bold text-slate-700 mb-1'>Judul Video Tutorial</label>\n            <input class='w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold outline-none focus:border-purple-600 bg-white' id='input-video-title' placeholder='Contoh: Modul 1 - Standar Kerapian Path Icon' required='required' type='text'/>\n          </div>\n          <div>\n            <label class='block text-[11px] font-bold text-slate-700 mb-1'>Urutan Modul</label>\n            <input class='w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold outline-none focus:border-purple-600 bg-white' id='input-video-sort' min='1' placeholder='1' required='required' type='number'/>\n          </div>\n        </div>\n        <div>\n          <label class='block text-[11px] font-bold text-slate-700 mb-1'>Link / Video ID YouTube</label>\n          <input class='w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold outline-none focus:border-purple-600 bg-white' id='input-video-yt-id' placeholder='https://www.youtube.com/watch?v=dQw4w9WgXcQ atau dQw4w9WgXcQ' required='required' type='text'/>\n          <span class='text-[10px] text-slate-400 mt-1 block'>*Sistem otomatis mengekstrak Video ID unik dari URL YouTube yang dimasukkan.</span>\n        </div>\n        <div class='flex gap-2 pt-1'>\n          <button class='w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 rounded-lg transition shadow-sm flex items-center justify-center gap-1.5' id='btn-save-video-item' type='submit'>\n            <i class='fa-solid fa-floppy-disk'></i> Simpan Video\n          </button>\n          <button class='bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 rounded-lg transition hidden' id='btn-cancel-video-edit' type='button'>\n            Batal\n          </button>\n        </div>\n      </form>\n      <div class='space-y-2'>\n        <h4 class='text-xs font-bold text-slate-700 flex items-center gap-1.5'>\n          <i class='fa-solid fa-list-check text-purple-600'></i> Daftar Modul Aktif dalam System\n        </h4>\n        <div class='overflow-x-auto scrollbar-thin border border-slate-200 rounded-xl'>\n          <table class='w-full text-left border-collapse text-xs table-fixed'>\n            <thead>\n              <tr class='border-b border-slate-200 text-slate-500 bg-slate-50 font-bold'>\n                <th class='p-2.5 text-center w-12'>No</th>\n                <th class='p-2.5'>Judul</th>\n                <th class='p-2.5 text-center w-32'>ID</th>\n                <th class='p-2.5 text-center w-24'>Aksi</th>\n              </tr>\n            </thead>\n            <tbody class='divide-y divide-slate-100' id='admin-video-list-body'>\n              <tr><td class='p-4 text-center text-slate-400' colspan='4'>Memuat daftar video...</td></tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center hidden p-3 sm:p-4' id='modal-announcement'>\n    <div class='bg-white text-slate-900 w-full max-w-md rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 relative modal-body-mobile max-h-[90vh] overflow-y-auto scrollbar-thin'>\n      <button class='absolute top-3 right-3 text-slate-400 hover:text-slate-700' id='btn-close-announcement'>\n        <i class='fa-solid fa-xmark text-lg'></i>\n      </button>\n      <div class='border-b pb-3'>\n        <h3 class='text-base font-extrabold text-slate-800 flex items-center gap-2'>\n          <i class='fa-solid fa-bullhorn text-amber-500'></i> Kelola Info Running Text\n        </h3>\n        <p class='text-xs text-slate-500 mt-0.5'>Tampil secara realtime di layar desainer.</p>\n      </div>\n      <form class='space-y-3' id='form-announcement'>\n        <div>\n          <label class='block text-[11px] font-bold text-slate-700 mb-1'>Pesan Pengumuman</label>\n          <textarea class='w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold outline-none focus:border-amber-500 h-24' id='input-announcement-msg' placeholder='Ketik info di sini...' required='required'></textarea>\n        </div>\n        <div class='flex items-center gap-2'>\n          <input checked='checked' class='h-4 w-4 text-amber-600 rounded border-slate-300 cursor-pointer' id='check-announcement-active' type='checkbox'/>\n          <label class='text-xs font-bold text-slate-700 cursor-pointer' for='check-announcement-active'>Tampilkan ke Desainer</label>\n        </div>\n        <div class='flex gap-2 pt-2'>\n          <button class='w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 rounded-lg transition shadow-sm' type='submit'>\n            <i class='fa-solid fa-floppy-disk'></i> Simpan &amp; Publish\n          </button>\n          <button class='bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-xs font-bold px-3 py-2.5 rounded-lg transition' id='btn-delete-announcement' type='button'>\n            Hapus\n          </button>\n        </div>\n      </form>\n    </div>\n  </div>\n  <div class='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center hidden p-3 sm:p-4' id='modal-manage-flash-banner'>\n    <div class='bg-white text-slate-900 w-full max-w-2xl rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 relative modal-body-mobile max-h-[90vh] overflow-y-auto scrollbar-thin'>\n      <button class='absolute top-3 right-3 text-slate-400 hover:text-slate-700' id='btn-close-manage-flash'>\n        <i class='fa-solid fa-xmark text-lg'></i>\n      </button>\n      <div class='border-b pb-3'>\n        <h3 class='text-base font-extrabold text-slate-800 flex items-center gap-2'>\n          <i class='fa-solid fa-window-restore text-indigo-600'></i> Kelola Pop-up Informasi Login\n        </h3>\n        <p class='text-xs text-slate-500 mt-0.5'>Kelola daftar pengumuman pop-up berdasarkan target penerima desainer.</p>\n      </div>\n      <form class='bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3' id='form-flash-announcement'>\n        <input id='flash-edit-id' type='hidden'/>\n        <div class='grid grid-cols-1 sm:grid-cols-2 gap-3'>\n          <div>\n            <label class='block text-[11px] font-bold text-slate-700 mb-1'>Target Penerima Informasi</label>\n            <select class='w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold outline-none focus:border-indigo-600 bg-white' id='flash-target-type' onchange='handleFlashTargetTypeChange()'>\n              <option value='all'>Semua Desainer</option>\n              <option value='level'>Berdasarkan Level Desainer</option>\n              <option value='designer'>Desainer Spesifik</option>\n            </select>\n          </div>\n          <div class='hidden' id='flash-target-level-box'>\n            <label class='block text-[11px] font-bold text-slate-700 mb-1'>Pilih Level Desainer</label>\n            <select class='w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold outline-none focus:border-indigo-600 bg-white' id='flash-target-level-val'>\n              <option value='2'>Level 2</option>\n              <option value='3'>Level 3</option>\n            </select>\n          </div>\n          <div class='hidden' id='flash-target-designer-box'>\n            <label class='block text-[11px] font-bold text-slate-700 mb-1'>Pilih Desainer Spesifik</label>\n            <select class='w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold outline-none focus:border-indigo-600 bg-white' id='flash-target-designer-val'>\n            </select>\n          </div>\n        </div>\n        <div>\n          <div class='flex items-center justify-between mb-1'>\n            <label class='block text-[11px] font-bold text-slate-700'>Isi Informasi</label>\n            <span class='text-[10px] text-slate-400'>Format Obsidian aktif (tag HTML tidak dirender, kecuali garis bawah)</span>\n          </div>\n          <div class='flex flex-wrap items-center gap-1 bg-slate-100 p-1.5 rounded-t-lg border border-b-0 border-slate-300' id='flash-editor-toolbar'>\n            <button class='px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded text-[11px] font-black border border-slate-300 transition shadow-sm' onclick='applyMarkdownStyle(&quot;# &quot;, &quot;&quot;, &quot;Judul Utama&quot;, true);' title='Heading 1 (Ctrl+1)' type='button'>\n              H1\n            </button>\n            <button class='px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold border border-slate-300 transition shadow-sm' onclick='applyMarkdownStyle(&quot;## &quot;, &quot;&quot;, &quot;Sub Judul&quot;, true);' title='Heading 2 (Ctrl+2)' type='button'>\n              H2\n            </button>\n            <button class='px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold border border-slate-300 transition shadow-sm' onclick='applyMarkdownStyle(&quot;### &quot;, &quot;&quot;, &quot;Sub Heading&quot;, true);' title='Heading 3 (Ctrl+3)' type='button'>\n              H3\n            </button>\n            <span class='h-4 w-[1px] bg-slate-300 mx-0.5'></span>\n            <button class='px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold border border-slate-300 transition shadow-sm' onclick='applyMarkdownStyle(&quot;**&quot;, &quot;**&quot;, &quot;teks tebal&quot;);' title='Tebal (Ctrl+B)' type='button'>\n              <i class='fa-solid fa-bold'></i>\n            </button>\n            <button class='px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded text-[11px] font-italic border border-slate-300 transition shadow-sm' onclick='applyMarkdownStyle(&quot;*&quot;, &quot;*&quot;, &quot;teks miring&quot;);' title='Miring (Ctrl+I)' type='button'>\n              <i class='fa-solid fa-italic'></i>\n            </button>\n           <button class='px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded text-[11px] underline border border-slate-300 transition shadow-sm' onclick='applyMarkdownStyle(&quot;u&quot;, &quot;u&quot;, &quot;teks garis bawah&quot;);' title='Garis Bawah (Ctrl+U)' type='button'>\n  <i class='fa-solid fa-underline'></i>\n</button>\n            <button class='px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded text-[11px] line-through border border-slate-300 transition shadow-sm' onclick='applyMarkdownStyle(&quot;~~&quot;, &quot;~~&quot;, &quot;teks dicoret&quot;);' title='Coret' type='button'>\n              <i class='fa-solid fa-strikethrough'></i>\n            </button>\n            <button class='px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded text-[11px] font-bold border border-amber-300 transition shadow-sm' onclick='applyMarkdownStyle(&quot;==&quot;, &quot;==&quot;, &quot;teks highlight&quot;);' title='Highlight Teks' type='button'>\n              <i class='fa-solid fa-highlighter'></i>\n            </button>\n            <span class='h-4 w-[1px] bg-slate-300 mx-0.5'></span>\n            <button class='px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded text-[11px] border border-slate-300 transition shadow-sm' onclick='applyMarkdownStyle(&quot;- &quot;, &quot;&quot;, &quot;Item daftar&quot;, true);' title='Bullet List (Daftar Poin)' type='button'>\n              <i class='fa-solid fa-list-ul'></i>\n            </button>\n            <button class='px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded text-[11px] border border-slate-300 transition shadow-sm' onclick='applyMarkdownStyle(&quot;1. &quot;, &quot;&quot;, &quot;Item urutan&quot;, true);' title='Numbered List (Daftar Angka)' type='button'>\n              <i class='fa-solid fa-list-ol'></i>\n            </button>\n            <span class='h-4 w-[1px] bg-slate-300 mx-0.5'></span>\n            <button class='px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded text-[11px] border border-slate-300 transition shadow-sm' onclick='applyMarkdownStyle(&quot;[&quot;, &quot;](https://link.com)&quot;, &quot;Teks Link&quot;);' title='Sisipkan Link (Ctrl+K)' type='button'>\n              <i class='fa-solid fa-link'></i>\n            </button>\n            <button class='px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded text-[11px] border border-slate-300 transition shadow-sm' onclick='applyMarkdownStyle(&quot;&gt; &quot;, &quot;&quot;, &quot;Teks kutipan&quot;, true);' title='Kutipan (Quote Block)' type='button'>\n              <i class='fa-solid fa-quote-left'></i>\n            </button>\n          </div>\n          <textarea class='w-full border border-slate-300 rounded-b-lg p-2.5 text-xs font-sans outline-none focus:border-indigo-600 h-28 leading-relaxed bg-white' id='flash-message-content' placeholder='Tuliskan informasi di sini (contoh: # Judul, **teks tebal**, - poin 1, 1. nomor 1, dll)...' required='required'></textarea>\n        </div>\n        <div class='flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200'>\n          <input checked='checked' class='h-4 w-4 text-indigo-600 rounded border-slate-300 cursor-pointer' id='flash-is-active' type='checkbox'/>\n          <label class='text-xs font-bold text-slate-700 cursor-pointer' for='flash-is-active'>Aktifkan Pop-up Informasi Ini</label>\n        </div>\n        <div class='flex gap-2 pt-1'>\n          <button class='w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg transition shadow-sm flex items-center justify-center gap-1.5' id='btn-save-flash-item' type='submit'>\n            <i class='fa-solid fa-floppy-disk'></i> Simpan &amp; Publish Realtime\n          </button>\n          <button class='bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 rounded-lg transition hidden' id='btn-cancel-flash-edit' onclick='resetFlashBannerForm()' type='button'>\n            Batal\n          </button>\n        </div>\n      </form>\n      <div class='space-y-2'>\n        <h4 class='text-xs font-bold text-slate-700 flex items-center gap-1.5'>\n          <i class='fa-solid fa-list-check text-indigo-600'></i> Daftar Pop-up Informasi Aktif\n        </h4>\n        <div class='overflow-x-auto scrollbar-thin border border-slate-200 rounded-xl'>\n          <table class='w-full text-left border-collapse text-xs min-w-[500px]'>\n            <thead>\n              <tr class='border-b border-slate-200 text-slate-500 bg-slate-50 font-bold'>\n                <th class='p-2.5 text-center w-12'>No</th>\n                <th class='p-2.5'>Target Penerima</th>\n                <th class='p-2.5'>Isi Informasi</th>\n                <th class='p-2.5 text-center'>Status</th>\n                <th class='p-2.5 text-center'>Aksi</th>\n              </tr>\n            </thead>\n            <tbody class='divide-y divide-slate-100' id='admin-flash-list-body'>\n              <tr><td class='p-4 text-center text-slate-400' colspan='5'>Memuat daftar informasi...</td></tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center hidden p-3 sm:p-4' id='modal-login'>\n    <div class='bg-white text-slate-900 w-full max-w-sm rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 relative modal-body-mobile max-h-[90vh] overflow-y-auto scrollbar-thin'>\n      <button class='absolute top-3 right-3 text-slate-400 hover:text-slate-700' id='btn-close-login'>\n        <i class='fa-solid fa-xmark text-lg'></i>\n      </button>\n      <div class='text-center'>\n        <h3 class='text-base font-extrabold text-slate-800'>Masuk Akun Desainer</h3>\n        <p class='text-xs text-slate-500 mt-1'>Masukkan Email &amp; Password dari Admin</p>\n      </div>\n      <form class='space-y-3' id='form-login'>\n        <div>\n          <label class='block text-[11px] font-bold text-slate-700 mb-1'>Email</label>\n          <input class='w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 font-semibold' id='login-email' placeholder='desainer@domain.com' required='required' type='email'/>\n        </div>\n        <div>\n          <label class='block text-[11px] font-bold text-slate-700 mb-1'>Password</label>\n          <input class='w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 font-semibold' id='login-password' placeholder='••••••••' required='required' type='password'/>\n        </div>\n        <button class='w-full btn-tokopedia-blue text-xs font-bold py-3 rounded-lg transition shadow-sm' type='submit'>Masuk Sekarang</button>\n      </form>\n    </div>\n  </div>\n  <div class='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center hidden p-3 sm:p-4' id='modal-add-user'>\n    <div class='bg-white text-slate-900 w-full max-w-md rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 relative modal-body-mobile max-h-[90vh] overflow-y-auto scrollbar-thin'>\n      <button class='absolute top-3 right-3 text-slate-400 hover:text-slate-700' id='btn-close-add-user'>\n        <i class='fa-solid fa-xmark text-lg'></i>\n      </button>\n      <div class='text-center border-b pb-3'>\n        <h3 class='text-base font-extrabold text-blue-900'>Daftarkan Desainer Baru</h3>\n      </div>\n      <form class='space-y-3' id='form-reg-user'>\n        <div>\n          <label class='block text-[11px] font-bold text-slate-700 mb-1'>Nama Lengkap Desainer</label>\n          <input class='w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 font-bold' id='reg-fullname' placeholder='Contoh: Husnul Aqidah' required='required' type='text'/>\n        </div>\n        <div>\n          <label class='block text-[11px] font-bold text-slate-700 mb-1'>Email Desainer</label>\n          <input class='w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600' id='reg-email' placeholder='husnulaqidah@gmail.com' required='required' type='email'/>\n        </div>\n        <div>\n          <label class='block text-[11px] font-bold text-slate-700 mb-1'>Password Awal</label>\n          <input class='w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600' id='reg-password' placeholder='Minimal 6 karakter' required='required' type='password'/>\n        </div>\n        <div class='grid grid-cols-1 sm:grid-cols-2 gap-2'>\n          <div>\n            <label class='block text-[11px] font-bold text-slate-700 mb-1'>Level Desainer</label>\n            <select class='w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 font-semibold' id='reg-level'>\n              <option value='2'>Level 2 (Rp 750 / Rp 450)</option>\n              <option value='3'>Level 3 (Rp 2.500 / Rp 1.500)</option>\n            </select>\n          </div>\n          <div>\n            <label class='block text-[11px] font-bold text-slate-700 mb-1'>Role System</label>\n            <select class='w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 font-semibold' id='reg-role'>\n              <option value='designer'>Desainer / Uploader</option>\n              <option value='admin'>Admin / Manager</option>\n            </select>\n          </div>\n        </div>\n        <button class='w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 rounded-lg transition shadow-sm' id='btn-submit-reg-user' type='submit'>Simpan &amp; Buat Akun</button>\n      </form>\n    </div>\n  </div>\n  <div class='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center hidden p-3 sm:p-4' id='modal-edit-user'>\n    <div class='bg-white text-slate-900 w-full max-w-md rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 relative modal-body-mobile max-h-[90vh] overflow-y-auto scrollbar-thin'>\n      <button class='absolute top-3 right-3 text-slate-400 hover:text-slate-700' id='btn-close-edit-user'>\n        <i class='fa-solid fa-xmark text-lg'></i>\n      </button>\n      <div class='text-center border-b pb-3'>\n        <h3 class='text-base font-extrabold text-blue-900'>Edit Profil Desainer</h3>\n      </div>\n      <form class='space-y-3' id='form-edit-user'>\n        <input id='edit-user-id' type='hidden'/>\n        <div>\n          <label class='block text-[11px] font-bold text-slate-700 mb-1'>Nama Lengkap Desainer</label>\n          <input class='w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 font-bold' id='edit-fullname' required='required' type='text'/>\n        </div>\n        <div>\n          <label class='block text-[11px] font-bold text-slate-700 mb-1'>Email (Readonly)</label>\n          <input class='w-full border border-slate-200 bg-slate-100 rounded-lg p-2.5 text-xs text-slate-500 font-semibold outline-none cursor-not-allowed' id='edit-email' readonly='readonly' type='email'/>\n        </div>\n        <div class='grid grid-cols-1 sm:grid-cols-2 gap-2'>\n          <div>\n            <label class='block text-[11px] font-bold text-blue-600 mb-1'>Level Desainer</label>\n            <select class='w-full border border-blue-300 bg-blue-50/40 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 font-bold' id='edit-level'>\n              <option value='2'>Level 2 (Rp 750 / Rp 450)</option>\n              <option value='3'>Level 3 (Rp 2.500 / Rp 1.500)</option>\n            </select>\n          </div>\n          <div>\n            <label class='block text-[11px] font-bold text-slate-700 mb-1'>Role / Jabatan</label>\n            <select class='w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 font-semibold' id='edit-role'>\n              <option value='designer'>Desainer / Uploader</option>\n              <option value='admin'>Admin / Manager</option>\n            </select>\n          </div>\n        </div>\n        <div class='pt-2 border-t border-slate-100'>\n          <label class='block text-[11px] font-bold text-rose-600 mb-1 flex items-center gap-1'>\n            <i class='fa-solid fa-key'></i> Reset Password (Opsional)\n          </label>\n          <input class='w-full border border-rose-200 bg-rose-50/30 rounded-lg p-2.5 text-xs outline-none focus:border-rose-600' id='edit-password' placeholder='Biarkan kosong jika tidak diubah' type='password'/>\n        </div>\n        <button class='w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-lg transition shadow-sm' id='btn-submit-edit-user' type='submit'>Simpan Perubahan</button>\n      </form>\n    </div>\n  </div>\n  <div class='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center hidden p-3 sm:p-4' id='modal-edit-project'>\n    <div class='bg-white text-slate-900 w-full max-w-md rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 relative modal-body-mobile max-h-[90vh] overflow-y-auto scrollbar-thin'>\n      <button class='absolute top-3 right-3 text-slate-400 hover:text-slate-700 p-1' id='btn-close-edit-project' onclick='closeEditProjectModal()' type='button'>\n        <i class='fa-solid fa-xmark text-lg'></i>\n      </button>\n      <div class='text-center border-b pb-3'>\n        <h3 class='text-base font-extrabold text-blue-900'>Edit Detail Laporan Desainer</h3>\n      </div>\n      <form class='space-y-3' id='form-edit-project'>\n        <input id='edit-proj-id' type='hidden'/>\n        <div>\n          <label class='block text-[11px] font-bold text-slate-700 mb-1'>Target Belajar</label>\n          <input class='w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 font-semibold' id='edit-proj-target' required='required' type='text'/>\n        </div>\n        <div>\n          <label class='block text-[11px] font-bold text-slate-700 mb-1'>Tool Desain</label>\n          <select class='w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 font-semibold' id='edit-proj-tool'>\n            <option value='Figma'>1. Figma</option>\n            <option value='Infinite Design'>2. Infinite Design</option>\n            <option value='Inkscape'>3. Inkscape</option>\n            <option value='Affinity Designer'>4. Affinity Designer</option>\n            <option value='Bebas (Wajib Rapi)'>5. Bebas (wajib rapi)</option>\n          </select>\n        </div>\n        <div>\n          <label class='block text-[11px] font-bold text-slate-700 mb-1'>Nilai / Total Icon</label>\n          <input class='w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 font-bold' id='edit-proj-jumlah' min='1' required='required' type='number'/>\n        </div>\n        <div>\n          <label class='block text-[11px] font-bold text-amber-700 mb-1 flex items-center gap-1'>\n            <i class='fa-solid fa-hand-holding-hand'></i> Desainer Pembantu (Uploader)\n          </label>\n          <select class='w-full border border-amber-300 bg-amber-50/40 rounded-lg p-2.5 text-xs outline-none focus:border-amber-600 font-bold text-slate-800' id='edit-proj-uploader-id'>\n          </select>\n        </div>\n        <button class='w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-lg transition shadow-sm' id='btn-submit-edit-proj' type='submit'>Simpan Perubahan</button>\n      </form>\n    </div>\n  </div>\n  <div class='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center hidden p-3 sm:p-4' id='modal-slip-gaji'>\n    <div class='bg-white text-slate-900 w-full max-w-lg rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl relative border border-slate-200 modal-body-mobile max-h-[90vh] overflow-y-auto scrollbar-thin'>\n      <button class='absolute top-3 right-3 text-slate-400 hover:text-slate-700 no-print' id='btn-close-slip-gaji'>\n        <i class='fa-solid fa-xmark text-lg'></i>\n      </button>\n      <div class='text-center border-b pb-3'>\n        <h2 class='text-sm sm:text-base font-extrabold uppercase tracking-wide text-blue-900'>SALARY JASA DESAIN ELEMEN CANVA</h2>\n        <p class='text-xs font-bold text-slate-600 mt-0.5' id='slip-periode'>Periode: -</p>\n      </div>\n      <div class='bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 no-print'>\n        <div class='text-[11px] font-bold text-slate-700 flex items-center gap-1.5'>\n          <i class='fa-solid fa-calendar-days text-blue-600'></i> Filter Periode Slip Gaji:\n        </div>\n        <div class='grid grid-cols-2 gap-2 text-xs'>\n          <div>\n            <label class='block text-[10px] text-slate-500 font-semibold mb-0.5'>Dari Tanggal:</label>\n            <input class='w-full border border-slate-300 rounded-lg p-1.5 font-bold text-slate-700 outline-none focus:border-blue-600 bg-white' id='slip-start-date' type='date'/>\n          </div>\n          <div>\n            <label class='block text-[10px] text-slate-500 font-semibold mb-0.5'>Sampai Tanggal:</label>\n            <input class='w-full border border-slate-300 rounded-lg p-1.5 font-bold text-slate-700 outline-none focus:border-blue-600 bg-white' id='slip-end-date' type='date'/>\n          </div>\n        </div>\n      </div>\n      <div class='text-xs space-y-2 border-b pb-3'>\n        <div class='flex justify-between items-center no-print'>\n          <span class='font-bold text-slate-600'>Pilih Desainer:</span>\n          <select class='border rounded px-2 py-1 text-xs outline-none bg-slate-50 font-bold text-blue-800 max-w-[180px] sm:max-w-none' id='select-slip-user'>\n          </select>\n        </div>\n        <div class='flex justify-between items-center'>\n          <span class='text-slate-500'>Nama Desainer</span>\n          <span class='font-bold text-blue-900' id='slip-nama'>-</span>\n        </div>\n        <div class='flex justify-between items-center'>\n          <span class='text-slate-500'>Level Desainer</span>\n          <span class='font-bold px-2 py-0.5 rounded text-[10px]' id='slip-level-badge'>Level 2</span>\n        </div>\n        <div class='flex justify-between'>\n          <span class='text-slate-500'>Total Desain</span>\n          <span class='font-bold'><span id='slip-total-desain'>0</span> desain</span>\n        </div>\n        <div class='flex justify-between'>\n          <span class='text-slate-500'>Total Desain Ditolak</span>\n          <span class='font-bold text-rose-600'><span id='slip-ditolak'>0</span> kali</span>\n        </div>\n        <div class='flex justify-between'>\n          <span class='text-slate-500'>Total Desain Diterima</span>\n          <span class='font-bold text-emerald-600'><span id='slip-diterima'>0</span> kali</span>\n        </div>\n      </div>\n      <div class='text-xs space-y-2 border-b pb-3'>\n        <div class='flex justify-between'>\n          <span class='text-slate-500'>Hasil Desain (<span id='slip-tarif-label'>Rp 750 / Rp 450</span>)</span>\n          <span class='font-bold'>Rp <span id='slip-hasil-desain'>0</span> ,-</span>\n        </div>\n        <div class='flex justify-between'>\n          <span class='text-slate-500'>Reward 1 (Upload ke Canva)</span>\n          <span class='font-bold'>Rp <span id='slip-reward-1'>0</span> ,-</span>\n        </div>\n        <div class='flex justify-between'>\n          <span class='text-slate-500'>Reward 2 (Bonus Tiering)</span>\n          <span class='font-bold'>Rp <span id='slip-reward-2'>0</span> ,-</span>\n        </div>\n      </div>\n      <div class='flex justify-between items-center text-sm font-extrabold pt-1'>\n        <span class='text-slate-800'>Total Pendapatan</span>\n        <span class='text-blue-700 text-base font-black'>Rp <span id='slip-total-pendapatan'>0</span> ,-</span>\n      </div>\n      <div class='pt-2 no-print flex justify-end gap-2'>\n        <button class='bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-4 py-2 rounded-lg font-bold transition' id='btn-close-slip-gaji-2'>Tutup</button>\n        <button class='btn-tokopedia-blue text-xs px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5' id='btn-print-slip'>\n          <i class='fa-solid fa-print'></i> Cetak PDF\n        </button>\n      </div>\n    </div>\n  </div>\n  <div class='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center hidden p-3 sm:p-4' id='modal-custom-dialog'>\n    <div class='bg-white text-slate-900 w-full max-w-sm rounded-2xl p-5 space-y-4 shadow-2xl border border-slate-200 relative text-center modal-body-mobile max-h-[90vh] overflow-y-auto scrollbar-thin'>\n      <div class='w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl' id='dialog-icon-bg'>\n        <i class='fa-solid' id='dialog-icon'></i>\n      </div>\n      <div>\n        <h3 class='text-sm font-bold text-slate-800' id='dialog-title'>Notifikasi</h3>\n        <p class='text-xs text-slate-500 mt-1 whitespace-pre-line leading-relaxed' id='dialog-message'>Pesan sistem...</p>\n      </div>\n      <div class='hidden space-y-2' id='dialog-prompt-container'>\n        <textarea class='w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 h-20 font-semibold' id='dialog-prompt-input' placeholder='Masukkan alasan/catatan...'></textarea>\n      </div>\n      <div class='flex justify-center gap-2 pt-1' id='dialog-actions'>\n        <button class='bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg transition hidden' id='dialog-btn-cancel'>Batal</button>\n        <button class='btn-tokopedia-blue text-xs font-bold px-5 py-2 rounded-lg transition shadow-sm' id='dialog-btn-ok'>OK</button>\n      </div>\n    </div>\n  </div>";
  var mount = document.getElementById('kl-dash-mount');
  if (mount) { mount.insertAdjacentHTML('beforebegin', html); mount.parentNode.removeChild(mount); }
  else document.body.insertAdjacentHTML('beforeend', html);
  var t = document.title;
  document.querySelectorAll('.kl-blog-title').forEach(function (el) { el.textContent = t; });
})();
/* 3) Logika dashboard (tidak diubah). */
    const SUPABASE_URL = "https://btsqpddnilujfxnarvwn.supabase.co";
    const SUPABASE_ANON_KEY = "sb_publishable_YwWHi5DOT1ZEbeeWiQfJxA_Cs1rEdHn";
    const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw43dWEgVDODKcgRHOQ81KJPSPE8gkZee__sBJW36s6erB9mC91d4AdPnMU0rSkWOhb/exec";
    const CANVA_UPLOAD_URL = "https://www.canva.com/creators/element/upload";

    // ==========================================
    // HELPER KEAMANAN TAMPILAN (ANTI-XSS)
    // esc()     -> untuk teks dari database yang dimasukkan ke innerHTML
    // jsArg()   -> untuk argumen string di dalam onclick="..."
    // safeUrl() -> hanya izinkan link http/https/mailto
    // ==========================================
    function esc(value) {
      return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[ch]));
    }

    function jsArg(value) {
      return esc(JSON.stringify(String(value ?? '')));
    }

    function safeUrl(url, fallback = '#') {
      const str = String(url || '').trim();
      return /^(https?:\/\/|mailto:)/i.test(str) ? esc(str) : fallback;
    }

    let notifOutsideClickBound = false;
    let adminPresenceTimer = null;
    let pendingYouTubeVideoId = null;

    let supabaseClient = null;
    let supabaseAdminNoSession = null;
    let currentUser = null;
    let selectedThemeData = null;
    let themesStockMap = {}; 
    let userProfilesMap = {}; 
    let userLevelsMap = {};
    let userEmailsMap = {}; 
    let userLastSeenMap = {}; 
    let debounceTimer = null;
    let countdownInterval = null;
    let isEditingAdminTable = false;
    let isAdminUser = false;
    let isUsersLoaded = false;
    let realtimeSyncTimer = null;
    let lastAdminTableHash = "";
    let lastUserTableHash = "";
    let lastThemesTableHash = "";
    let heartbeatInterval = null;
    let kinerjaChartInstance = null;
    
    // State Fitur Video Tutorial
    let ytPlayer = null;
    let ytApiReady = false;
    let currentVideoList = [];
    let userCompletedVideoIds = new Set();
    let activeVideoIndex = 0;
    let watchProgressInterval = null;
    let maxWatchedTime = 0;
    let isVideoRequirementMet = false;

    // State Fitur AI Color Palette
    let currentGeneratedColors = [];

    const processedExpiredProjects = new Set();

    let adminTableLimit = 10;
    let userTableLimit = 10;
    let themeGridLimit = 10;
    let themesTableLimit = 10;
    let overviewDesignersTableLimit = 10;

    let overviewSortCol = 'full_name';
    let overviewSortDir = 'asc';

    let userSortCol = 'created_at';
    let userSortDir = 'desc';

    let themesSortCol = 'kategori';
    let themesSortDir = 'asc';

    let adminSortCol = 'created_at';
    let adminSortDir = 'desc';

    let analyticsSortCol = 'created_at';
    let analyticsSortDir = 'desc';
    let analyticsProjectsData = [];

    let allAdminThemesData = []; 
    let allAdminProjectsData = [];

    let isAudioUnlocked = false;

    function unlockAudio() {
      if (isAudioUnlocked) return;
      const audio = document.getElementById('notif-sound');
      if (audio) {
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
          isAudioUnlocked = true;
          document.removeEventListener('click', unlockAudio);
        }).catch(() => {});
      }
    }

    document.addEventListener('click', unlockAudio);

    function playNotifSound() {
      const audio = document.getElementById('notif-sound');
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn("Autoplay audio terhalang browser atau gagal dimuat:", err);
          });
        }
      }
    }

    // Helper Ekstraksi YouTube Video ID
    function extractYouTubeId(urlOrId) {
      if (!urlOrId) return '';
      const str = urlOrId.trim();
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = str.match(regExp);
      return (match && match[2].length === 11) ? match[2] : str;
    }

    function formatFullDateTime(dateString) {
      if (!dateString) return '-';
      const d = new Date(dateString);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    function formatNotifUploadTime(dateString) {
      if (!dateString) return '-';
      const d = new Date(dateString);
      const namaHariList = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
      const namaHari = namaHariList[d.getDay()];
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${namaHari}, ${day}-${month}-${year} | ${hours}:${minutes}:${seconds}`;
    }

    function formatTimeAgo(dateString) {
      if (!dateString) return 'Belum pernah online';
      const d = new Date(dateString);
      const now = new Date();
      const diffSecs = Math.floor((now - d) / 1000);

      if (diffSecs < 120) return 'Online';
      if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)} menit lalu`;
      if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)} jam lalu`;
      if (diffSecs < 172800) return `Kemarin ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    async function sendUserHeartbeat() {
      if (!currentUser) return;
      const nowIso = new Date().toISOString();
      await supabaseClient.from('profiles').update({ last_seen: nowIso }).eq('id', currentUser.id);
    }

    function startHeartbeatLoop() {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      sendUserHeartbeat();
      heartbeatInterval = setInterval(sendUserHeartbeat, 30000);
    }

    function showModalAlert(title, message, type = 'info') {
      return new Promise((resolve) => {
        const dialog = document.getElementById('modal-custom-dialog');
        const iconBg = document.getElementById('dialog-icon-bg');
        const icon = document.getElementById('dialog-icon');
        const titleEl = document.getElementById('dialog-title');
        const msgEl = document.getElementById('dialog-message');
        const promptBox = document.getElementById('dialog-prompt-container');
        const btnCancel = document.getElementById('dialog-btn-cancel');
        const btnOk = document.getElementById('dialog-btn-ok');

        promptBox.classList.add('hidden');
        btnCancel.classList.add('hidden');
        btnOk.innerText = "OK";
        btnOk.className = "btn-tokopedia-blue text-xs font-bold px-5 py-2 rounded-lg transition shadow-sm";

        titleEl.innerText = title;
        msgEl.innerText = message;

        if (type === 'error') {
          iconBg.className = "w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl bg-rose-50 text-rose-600 border border-rose-200";
          icon.className = "fa-solid fa-circle-xmark";
        } else if (type === 'success') {
          iconBg.className = "w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl bg-emerald-50 text-emerald-600 border border-emerald-200";
          icon.className = "fa-solid fa-circle-check";
        } else if (type === 'warning') {
          iconBg.className = "w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl bg-amber-50 text-amber-600 border border-amber-200";
          icon.className = "fa-solid fa-triangle-exclamation";
        } else {
          iconBg.className = "w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl bg-blue-50 text-blue-600 border border-blue-200";
          icon.className = "fa-solid fa-circle-info";
        }

        dialog.classList.remove('hidden');
        btnOk.onclick = () => { dialog.classList.add('hidden'); resolve(true); };
      });
    }

    function showModalConfirm(title, message) {
      return new Promise((resolve) => {
        const dialog = document.getElementById('modal-custom-dialog');
        const iconBg = document.getElementById('dialog-icon-bg');
        const icon = document.getElementById('dialog-icon');
        const titleEl = document.getElementById('dialog-title');
        const msgEl = document.getElementById('dialog-message');
        const promptBox = document.getElementById('dialog-prompt-container');
        const btnCancel = document.getElementById('dialog-btn-cancel');
        const btnOk = document.getElementById('dialog-btn-ok');

        promptBox.classList.add('hidden');
        btnCancel.classList.remove('hidden');
        btnOk.innerText = "Ya, Lanjutkan";
        btnOk.className = "bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-sm";

        titleEl.innerText = title;
        msgEl.innerText = message;
        iconBg.className = "w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl bg-rose-50 text-rose-600 border border-rose-200";
        icon.className = "fa-solid fa-triangle-exclamation";

        dialog.classList.remove('hidden');
        btnOk.onclick = () => { dialog.classList.add('hidden'); resolve(true); };
        btnCancel.onclick = () => { dialog.classList.add('hidden'); resolve(false); };
      });
    }

    function showModalPrompt(title, message) {
      return new Promise((resolve) => {
        const dialog = document.getElementById('modal-custom-dialog');
        const iconBg = document.getElementById('dialog-icon-bg');
        const icon = document.getElementById('dialog-icon');
        const titleEl = document.getElementById('dialog-title');
        const msgEl = document.getElementById('dialog-message');
        const promptBox = document.getElementById('dialog-prompt-container');
        const promptInput = document.getElementById('dialog-prompt-input');
        const btnCancel = document.getElementById('dialog-btn-cancel');
        const btnOk = document.getElementById('dialog-btn-ok');

        promptInput.value = '';
        promptBox.classList.remove('hidden');
        btnCancel.classList.remove('hidden');
        btnOk.innerText = "Kirim Catatan";
        btnOk.className = "bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-sm";

        titleEl.innerText = title;
        msgEl.innerText = message;
        iconBg.className = "w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl bg-amber-50 text-amber-600 border border-amber-200";
        icon.className = "fa-solid fa-comment-dots";

        dialog.classList.remove('hidden');
        btnOk.onclick = () => { const val = promptInput.value.trim(); dialog.classList.add('hidden'); resolve(val); };
        btnCancel.onclick = () => { dialog.classList.add('hidden'); resolve(null); };
      });
    }

    // ==========================================
    // LOGIKA FITUR BARU 1: TOGGLE JENIS ICON
    // ==========================================
    function toggleIconTypeColorLogic() {
      const jenisIcon = document.getElementById('input-jenis-icon').value;
      const aiContainer = document.getElementById('ai-color-container');
      const statusTxt = document.getElementById('txt-palette-status');

      if (jenisIcon === 'flat') {
        aiContainer.classList.remove('opacity-50', 'pointer-events-none');
        if (selectedThemeData && selectedThemeData.kategori) {
          generateGeminiPastelColors(selectedThemeData.kategori);
        } else {
          statusTxt.innerText = "Pilih tema untuk memuat warna pastel AI.";
        }
      } else {
        aiContainer.classList.add('opacity-50', 'pointer-events-none');
        statusTxt.innerText = `Jenis Icon "${jenisIcon.toUpperCase()}" tidak membutuhkan warna pastel AI.`;
        resetPaletteUIBoxes();
      }
    }

    function resetPaletteUIBoxes() {
      const barsBox = document.getElementById('palette-bars-box');
      if (barsBox) {
        barsBox.innerHTML = `
          <div class="h-full rounded text-[9px] font-bold text-slate-400 flex items-center justify-center bg-slate-100 border border-dashed border-slate-300">-</div>
          <div class="h-full rounded text-[9px] font-bold text-slate-400 flex items-center justify-center bg-slate-100 border border-dashed border-slate-300">-</div>
          <div class="h-full rounded text-[9px] font-bold text-slate-400 flex items-center justify-center bg-slate-100 border border-dashed border-slate-300">-</div>
          <div class="h-full rounded text-[9px] font-bold text-slate-400 flex items-center justify-center bg-slate-100 border border-dashed border-slate-300">-</div>
          <div class="h-full rounded text-[9px] font-bold text-slate-400 flex items-center justify-center bg-slate-100 border border-dashed border-slate-300">-</div>
        `;
      }
      currentGeneratedColors = [];
    }

    // ==========================================
    // LOGIKA FITUR BARU 2: GEMINI AI COLOR GENERATOR
    // ==========================================
    function generatePastelColorFromSeed(seedStr, offset = 0) {
      let hash = 0;
      for (let i = 0; i < seedStr.length; i++) {
        hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = Math.abs((hash + offset * 73) % 360);
      const saturation = 55 + (Math.abs(hash * (offset + 1)) % 25); // 55% - 80%
      const lightness = 75 + (Math.abs(hash * (offset + 3)) % 15);  // 75% - 90% (Soft Pastel)
      
      return hslToHex(hue, saturation, lightness);
    }

    function hslToHex(h, s, l) {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
    }

    function generateGeminiPastelColors(kategoriName) {
      const jenisIcon = document.getElementById('input-jenis-icon').value;
      if (jenisIcon !== 'flat') return;

      const randomSalt = Math.floor(Math.random() * 1000);
      const seedBase = kategoriName + "_" + randomSalt;

      const colors = [];
      for (let i = 0; i < 5; i++) {
        colors.push(generatePastelColorFromSeed(seedBase, i * 17));
      }

      currentGeneratedColors = colors;
      renderPaletteUI(colors, kategoriName);
    }

    function regeneratePaletteColors() {
      if (!selectedThemeData || !selectedThemeData.kategori) {
        showModalAlert("Pilih Tema", "Pilih salah satu tema icon flat terlebih dahulu!", "warning");
        return;
      }
      generateGeminiPastelColors(selectedThemeData.kategori);
    }

    function renderPaletteUI(colors, kategoriName) {
      const barsBox = document.getElementById('palette-bars-box');
      const statusTxt = document.getElementById('txt-palette-status');
      if (!barsBox) return;

      barsBox.innerHTML = colors.map(hex => `
        <div onclick="copyToClipboard('${hex}')" style="background-color: ${hex};" class="h-full rounded flex items-center justify-center font-bold text-[9px] text-slate-800/80 shadow-xs cursor-pointer hover:scale-105 transition border border-black/10" title="Klik untuk Copy Hex">
          ${hex}
        </div>
      `).join('');

      if (statusTxt) {
        statusTxt.innerText = `Gunakan warna ini untuk "${kategoriName}"`;
      }
    }

    // ==========================================
    // LOGIKA FITUR BARU 3: DOWNLOAD PALETTE PNG (CANVAS)
    // ==========================================
    function downloadPaletteAsPNG() {
      if (!currentGeneratedColors || currentGeneratedColors.length < 5) {
        showModalAlert("Palet Kosong", "Generate palet warna pastel terlebih dahulu!", "warning");
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 450;
      const ctx = canvas.getContext('2d');

      // 1. Background Kartu
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Header
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Panduan Palet Warna Pastel', 40, 50);

      ctx.fillStyle = '#2563EB';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      const themeTitle = selectedThemeData ? selectedThemeData.kategori : 'Koleksi Icon Flat';
      ctx.fillText(`Tema Icon: ${themeTitle}`, 40, 80);

      // 3. Render 5 Swatch Warna
      const startX = 40;
      const startY = 110;
      const swatchWidth = 130;
      const swatchHeight = 220;
      const gap = 16;

      currentGeneratedColors.forEach((hex, idx) => {
        const x = startX + idx * (swatchWidth + gap);

        // Box Warna
        ctx.fillStyle = hex;
        ctx.beginPath();
        ctx.roundRect(x, startY, swatchWidth, swatchHeight, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.08)';
        ctx.stroke();

        // Label Kode HEX
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 14px monospace';
        ctx.fillText(hex, x + 25, startY + swatchHeight + 30);
      });

      // 4. Footer Brand Info
      ctx.fillStyle = '#94A3B8';
      ctx.font = '12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Palet warna ini dibuat oleh Kelas Kaligrafi Digital (KEKAL)', 40, 420);

      // Download Trigger
      const imageURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Palet_Warna_Pastel_${themeTitle.replace(/\s+/g, '_')}.png`;
      link.href = imageURL;
      link.click();
    }

    window.onYouTubeIframeAPIReady = function() {
      ytApiReady = true;
      if (pendingYouTubeVideoId) {
        const vid = pendingYouTubeVideoId;
        pendingYouTubeVideoId = null;
        initOrLoadYouTubePlayer(vid);
      }
    };

    document.addEventListener("DOMContentLoaded", function() {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      supabaseAdminNoSession = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
      });

      initDefaultDates();
      initEventListeners();
      loadThemes();
      checkActiveUser();
      listenRealtimeThemes();
      loadAnnouncement();
      loadFlashBannerAnnouncement();
     listenRealtimePopupNotice();
      listenRealtimeAnnouncement();
    });

    function initDefaultDates() {
      const now = new Date();
      let startYear = now.getFullYear();
      let startMonth = now.getMonth();
      if (now.getDate() < 29) {
        startMonth -= 1;
        if (startMonth < 0) { startMonth = 11; startYear -= 1; }
      }
      const startDateObj = new Date(startYear, startMonth, 29);
      const yearStr = startDateObj.getFullYear();
      const monthStr = String(startDateObj.getMonth() + 1).padStart(2, '0');
      const startDayFormatted = `${yearStr}-${monthStr}-29`;

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const todayFormatted = `${year}-${month}-${day}`;

      document.getElementById('overview-start-date').value = startDayFormatted;
      document.getElementById('overview-end-date').value = todayFormatted;

      document.getElementById('user-start-date').value = startDayFormatted;
      document.getElementById('user-end-date').value = todayFormatted;

      document.getElementById('slip-start-date').value = startDayFormatted;
      document.getElementById('slip-end-date').value = todayFormatted;

      document.getElementById('analytics-start-date').value = startDayFormatted;
      document.getElementById('analytics-end-date').value = todayFormatted;
    }

    function initEventListeners() {
      document.getElementById('btn-open-login').addEventListener('click', () => document.getElementById('modal-login').classList.remove('hidden'));
      document.getElementById('btn-close-login').addEventListener('click', () => document.getElementById('modal-login').classList.add('hidden'));

      document.getElementById('form-login').addEventListener('submit', handleEmailLogin);

      document.getElementById('btn-tab-claim').addEventListener('click', () => switchTab('claim'));
      document.getElementById('btn-tab-video-tutorials').addEventListener('click', () => switchTab('video-tutorials'));
      document.getElementById('btn-tab-dashboard').addEventListener('click', () => switchTab('my-dashboard'));
      document.getElementById('btn-tab-designer-analytics').addEventListener('click', () => switchTab('designer-analytics'));
      document.getElementById('btn-tab-admin').addEventListener('click', () => switchTab('admin'));

      document.getElementById('btn-tab-activity-history').addEventListener('click', () => switchTab('activity-history'));
      const btnActLoadMore = document.getElementById('btn-activity-load-more');
      if (btnActLoadMore) {
        btnActLoadMore.addEventListener('click', () => { activityHistoryLimit += 15; loadActivityHistory(false); });
      }

      document.getElementById('btn-copy-judul').addEventListener('click', () => copyText('txt-judul'));
      document.getElementById('btn-copy-keyword').addEventListener('click', () => copyText('txt-keyword'));

      document.getElementById('input-upload-type').addEventListener('change', toggleUploaderSelect);
      document.getElementById('form-claim').addEventListener('submit', handleClaimSubmit);
      let allPopupNoticesList = []; // State array penampung data dari Supabase

    // 1. Event listener tombol Buka Modal Admin
    const btnOpenFlash = document.getElementById('btn-open-flash-announcement-modal');
    if (btnOpenFlash) {
      btnOpenFlash.addEventListener('click', async () => {
        // Isi dropdown desainer
        const selectDes = document.getElementById('flash-target-designer-val');
        if (selectDes && typeof userProfilesMap !== 'undefined') {
          selectDes.innerHTML = Object.keys(userProfilesMap).map(id => `<option value="${esc(id)}">${esc(userProfilesMap[id])}</option>`).join('');
        }
        
        resetFlashBannerForm();
        await loadAdminPopupNoticesList();
        document.getElementById('modal-manage-flash-banner').classList.remove('hidden');
      });
    }

    // 2. Event listener Tutup Modal Admin
    const btnCloseFlash = document.getElementById('btn-close-manage-flash');
    if (btnCloseFlash) {
      btnCloseFlash.addEventListener('click', () => {
        document.getElementById('modal-manage-flash-banner').classList.add('hidden');
      });
    }

    // 3. Helper mendapatkan String Label Target (untuk pengecekan duplikat UI)
    function getTargetLabelString(targetType, targetValue) {
      if (targetType === 'all') return 'Semua Desainer';
      if (targetType === 'level') return `Level ${targetValue}`;
      if (targetType === 'designer') return userProfilesMap[targetValue] || targetValue;
      return targetType;
    }

  // 4. Load Tabel Daftar Informasi di Modal Admin
    async function loadAdminPopupNoticesList() {
      const tbody = document.getElementById('admin-flash-list-body');
      if (!tbody) return;

      tbody.innerHTML = `<tr><td class="p-4 text-center text-slate-400" colspan="5">Memuat data...</td></tr>`;

      const { data, error } = await supabaseClient
        .from('popup_notices')
        .select('*');

      if (error) {
        console.error("Error fetching popup notices:", error);
        tbody.innerHTML = `<tr><td class="p-4 text-center text-rose-500 font-bold" colspan="5">Gagal mengambil data: ${esc(error.message)}</td></tr>`;
        return;
      }

      if (!data || data.length === 0) {
        allPopupNoticesList = [];
        tbody.innerHTML = `<tr><td class="p-4 text-center text-slate-400" colspan="5">Belum ada daftar informasi.</td></tr>`;
        return;
      }

      allPopupNoticesList = data.sort((a, b) => new Date(b.created_at || b.updated_at || 0) - new Date(a.created_at || a.updated_at || 0));

      tbody.innerHTML = allPopupNoticesList.map((item, index) => {
        const targetType = item.target_type || item.type || 'all';
        const targetVal = item.target_value || item.value || '';
        const messageText = item.message || item.content || '';
        const isActive = item.is_active !== undefined ? item.is_active : true;

        const targetLabel = getTargetLabelString(targetType, targetVal);
        const readByList = Array.isArray(item.read_by) ? item.read_by : [];
        const isRead = readByList.length > 0;

        let statusBadge = `<span class="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-200">Nonaktif</span>`;
       if (isRead) {
          const readerNames = readByList.map(uid => userProfilesMap[uid] || 'Desainer').join(', ');
          statusBadge = `<span title="Dibaca oleh: ${esc(readerNames)}" class="inline-flex items-center justify-center whitespace-nowrap text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200 cursor-help"><i class="fa-solid fa-check-double mr-1"></i>Dibaca (${readByList.length})</span>`;
        } else if (isActive) {
          statusBadge = `<span class="inline-flex items-center justify-center whitespace-nowrap text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">Aktif</span>`;
        } else {
          statusBadge = `<span class="inline-flex items-center justify-center whitespace-nowrap text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-200">Nonaktif</span>`;
        }

        const cleanPreview = String(messageText).replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
        const shortPreview = cleanPreview.length > 20 ? cleanPreview.slice(0, 20) + '...' : (cleanPreview || '-');

        return `
          <tr class="hover:bg-slate-50 transition">
            <td class="p-2 text-center font-bold text-slate-700">${index + 1}</td>
            <td class="p-2 font-bold text-indigo-900 truncate" title="${esc(targetLabel)}">${esc(targetLabel)}</td>
            <td class="p-2 text-slate-600 text-[11px] max-w-[140px] sm:max-w-[200px] truncate" title="${esc(cleanPreview)}">
              ${esc(shortPreview)}
            </td>
            <td class="p-2 text-center whitespace-nowrap">${statusBadge}</td>
            <td class="p-2 text-center whitespace-nowrap space-x-1">
              <button type="button" onclick="window.editFlashNoticeItem(${jsArg(item.id)})" class="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1.5 rounded text-[11px] font-bold shadow-sm transition active:scale-95" title="Edit">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" onclick="window.deleteFlashNoticeItem(${jsArg(item.id)})" class="bg-rose-600 hover:bg-rose-700 text-white px-2 py-1.5 rounded text-[11px] font-bold shadow-sm transition active:scale-95" title="Hapus">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

  // 5. Submit Form Tambah / Edit Informasi (Dengan Proteksi Target Duplikat + Baris ke-{x})
    const formFlash = document.getElementById('form-flash-announcement');
    if (formFlash) {
      formFlash.addEventListener('submit', async (e) => {
        e.preventDefault();

        const editId = document.getElementById('flash-edit-id').value;
        const type = document.getElementById('flash-target-type').value;
        let val = '';
        if (type === 'level') val = document.getElementById('flash-target-level-val').value;
        if (type === 'designer') val = document.getElementById('flash-target-designer-val').value;

        const msg = document.getElementById('flash-message-content').value.trim();
        const active = document.getElementById('flash-is-active').checked;

        // --- PENGECEKAN DUPLIKAT TARGET ---
        const currentTargetKey = `${type}_${val}`;
        
        for (let i = 0; i < allPopupNoticesList.length; i++) {
          const item = allPopupNoticesList[i];
          const itemKey = `${item.target_type}_${item.target_value}`;

          // Jika sedang edit, abaikan baris yang sedang diedit itu sendiri
          if (editId && item.id === editId) continue;

          if (itemKey === currentTargetKey) {
            const rowNumber = i + 1; // Nomor baris urutan ke-{x}
            const targetName = getTargetLabelString(type, val);
            
            await showModalAlert(
              "Target Duplikat!",
              `Target "${targetName}" sudah ada di daftar tabel informasi pada baris urutan ke-${rowNumber}.\n\nSilakan pilih target lain atau edit baris urutan ke-${rowNumber} tersebut.`,
              "warning"
            );
            return; // Hentikan proses simpan
          }
        }

        const btnSave = document.getElementById('btn-save-flash-item');
        btnSave.disabled = true;

       const payload = {
          target_type: type,
          target_value: val,
          message: msg,
          is_active: active,
          read_by: [],
          updated_at: new Date().toISOString()
        };

        let err = null;
        if (editId) {
          // MODE EDIT: Update berdasarkan ID yang ada
          const { error } = await supabaseClient
            .from('popup_notices')
            .update(payload)
            .eq('id', editId);
          err = error;
        } else {
          // MODE TAMBAH BARU: Generasi ID unik acak agar tidak konflik Primary Key
          payload.id = 'notice_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
          
          const { error } = await supabaseClient
            .from('popup_notices')
            .insert([payload]);
          err = error;
        }

        btnSave.disabled = false;

       if (!err) {
          await showModalAlert("Berhasil", "Pop-up Informasi Login berhasil disimpan!", "success");
          resetFlashBannerForm();
          await loadAdminPopupNoticesList(); // <--- Panggil refresh tabel di sini
        } else {
          await showModalAlert("Gagal Simpan", err.message, "error");
        }
      });
    }

   // 6. Mode Edit Item Informasi (Daftarkan ke window global)
    window.editFlashNoticeItem = function(id) {
      const item = allPopupNoticesList.find(x => String(x.id) === String(id));
      if (!item) return;

      const editIdEl = document.getElementById('flash-edit-id');
      const targetTypeEl = document.getElementById('flash-target-type');
      const msgEl = document.getElementById('flash-message-content');
      const activeEl = document.getElementById('flash-is-active');

      if (editIdEl) editIdEl.value = item.id;
      if (targetTypeEl) {
        targetTypeEl.value = item.target_type || item.type || 'all';
        handleFlashTargetTypeChange();
      }

      const targetVal = item.target_value || item.value || '';
      if (item.target_type === 'level') {
        const lvlEl = document.getElementById('flash-target-level-val');
        if (lvlEl) lvlEl.value = targetVal;
      }
      if (item.target_type === 'designer') {
        const desEl = document.getElementById('flash-target-designer-val');
        if (desEl) desEl.value = targetVal;
      }

      if (msgEl) msgEl.value = item.message || item.content || '';
      if (activeEl) activeEl.checked = item.is_active !== undefined ? item.is_active : true;

      const btnCancel = document.getElementById('btn-cancel-flash-edit');
      const btnSave = document.getElementById('btn-save-flash-item');

      if (btnCancel) btnCancel.classList.remove('hidden');
      if (btnSave) btnSave.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Update Informasi`;
    };

    // 7. Reset Form Admin
    function resetFlashBannerForm() {
      document.getElementById('form-flash-announcement').reset();
      document.getElementById('flash-edit-id').value = '';
      document.getElementById('flash-target-type').value = 'all';
      handleFlashTargetTypeChange();
      document.getElementById('btn-cancel-flash-edit').classList.add('hidden');
      document.getElementById('btn-save-flash-item').innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Simpan & Publish Realtime`;
    }

   // 8. Hapus Item Informasi (Daftarkan ke window global)
    window.deleteFlashNoticeItem = async function(id) {
      const item = allPopupNoticesList.find(x => String(x.id) === String(id));
      const targetType = item ? (item.target_type || item.type || 'all') : 'all';
      const targetVal = item ? (item.target_value || item.value || '') : '';
      const targetLabel = getTargetLabelString(targetType, targetVal);

      const confirmed = await showModalConfirm("Konfirmasi Hapus", `Apakah Anda yakin ingin menghapus informasi untuk target "${targetLabel}"?`);
      if (confirmed) {
        const { error } = await supabaseClient.from('popup_notices').delete().eq('id', id);
        if (error) {
          await showModalAlert("Gagal Hapus", error.message, "error");
        } else {
          await showModalAlert("Terhapus", "Informasi berhasil dihapus!", "success");
          await loadAdminPopupNoticesList();
        }
      }
    };

      const checkConfirm = document.getElementById('check-confirm-claim');
      const checkQuality = document.getElementById('check-confirm-quality');
      
      function validateClaimFormSubmitBtn() {
        const c1 = checkConfirm ? checkConfirm.checked : false;
        const c2 = checkQuality ? checkQuality.checked : false;
        document.getElementById('btn-submit-claim').disabled = !(c1 && c2) || !isVideoRequirementMet;
      }

      if (checkConfirm) checkConfirm.addEventListener('change', validateClaimFormSubmitBtn);
      if (checkQuality) checkQuality.addEventListener('change', validateClaimFormSubmitBtn);

      document.getElementById('btn-export-excel').addEventListener('click', exportToSpreadsheet);

      document.getElementById('btn-add-designer-overview').addEventListener('click', () => document.getElementById('modal-add-user').classList.remove('hidden'));
      document.getElementById('btn-close-add-user').addEventListener('click', () => document.getElementById('modal-add-user').classList.add('hidden'));
      document.getElementById('form-reg-user').addEventListener('submit', handleRegisterUser);

      document.getElementById('btn-close-edit-user').addEventListener('click', () => document.getElementById('modal-edit-user').classList.add('hidden'));
      document.getElementById('form-edit-user').addEventListener('submit', handleUpdateUserProfile);

      document.getElementById('btn-filter-overview').addEventListener('click', loadAdminOverviewData);
      document.getElementById('btn-reset-overview').addEventListener('click', () => { initDefaultDates(); loadAdminOverviewData(); });

      document.getElementById('btn-filter-user').addEventListener('click', loadUserDashboardData);
      document.getElementById('btn-reset-user').addEventListener('click', () => { initDefaultDates(); loadUserDashboardData(); });

      document.getElementById('btn-filter-analytics').addEventListener('click', loadDesignerAnalyticsData);

      document.getElementById('form-manage-theme').addEventListener('submit', handleSaveTheme);
      document.getElementById('btn-cancel-theme').addEventListener('click', resetThemeForm);

      document.getElementById('slip-start-date').addEventListener('change', calculateSalaryForSelectedUser);
      document.getElementById('slip-end-date').addEventListener('change', calculateSalaryForSelectedUser);
      document.getElementById('select-slip-user').addEventListener('change', calculateSalaryForSelectedUser);

      document.getElementById('btn-open-slip-gaji').addEventListener('click', async () => {
        document.getElementById('modal-slip-gaji').classList.remove('hidden');
        await loadUsersList();
        calculateSalaryForSelectedUser();
      });

      document.getElementById('btn-close-slip-gaji').addEventListener('click', () => document.getElementById('modal-slip-gaji').classList.add('hidden'));
      document.getElementById('btn-close-slip-gaji-2').addEventListener('click', () => document.getElementById('modal-slip-gaji').classList.add('hidden'));
      document.getElementById('btn-print-slip').addEventListener('click', () => window.print());

      document.getElementById('btn-open-manage-videos').addEventListener('click', () => {
        document.getElementById('modal-manage-videos').classList.remove('hidden');
        loadAdminVideoList();
      });
      document.getElementById('btn-close-manage-videos').addEventListener('click', () => document.getElementById('modal-manage-videos').classList.add('hidden'));
      document.getElementById('form-video-item').addEventListener('submit', handleSaveVideoItem);
      document.getElementById('btn-cancel-video-edit').addEventListener('click', resetVideoForm);

      document.getElementById('btn-admin-load-more').addEventListener('click', () => { adminTableLimit += 10; renderAdminProjectsTable(); });
      document.getElementById('btn-user-load-more').addEventListener('click', () => { userTableLimit += 10; loadUserDashboardData(); });

      const btnThemeLoad = document.getElementById('btn-theme-load-more');
      if (btnThemeLoad) btnThemeLoad.addEventListener('click', () => { themeGridLimit += 10; loadThemes(); });

      const btnThemesTableLoad = document.getElementById('btn-themes-load-more');
      if (btnThemesTableLoad) btnThemesTableLoad.addEventListener('click', () => { themesTableLimit += 10; renderAdminThemesTable(); });

      const btnOverviewLoad = document.getElementById('btn-overview-designers-load-more');
      if (btnOverviewLoad) btnOverviewLoad.addEventListener('click', () => { overviewDesignersTableLimit += 10; renderOverviewDesignersTable(); });

      const btnOpenAnn = document.getElementById('btn-open-announcement-modal');
      if (btnOpenAnn) {
        btnOpenAnn.addEventListener('click', async () => {
          const { data } = await supabaseClient.from('announcements').select('*').eq('id', 'GLOBAL').maybeSingle();
          if (data) {
            document.getElementById('input-announcement-msg').value = data.message || '';
            document.getElementById('check-announcement-active').checked = data.is_active;
          }
          document.getElementById('modal-announcement').classList.remove('hidden');
        });
      }

      document.getElementById('btn-close-announcement').addEventListener('click', () => document.getElementById('modal-announcement').classList.add('hidden'));
      document.getElementById('form-announcement').addEventListener('submit', handleSaveAnnouncement);
      document.getElementById('btn-delete-announcement').addEventListener('click', handleDeleteAnnouncement);

      initNotifDropdownListeners();

  // Auto-check pengumuman saat tab kembali aktif/fokus
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && currentUser) {
      loadFlashBannerAnnouncement();
    }
  });
}
    

    async function loadVideoTutorialsSection() {
      try {
        const { data: videos, error: vErr } = await supabaseClient
          .from('tutorial_videos')
          .select('*')
          .order('sort_order', { ascending: true });

        if (vErr || !videos) {
          console.warn("Gagal memuat video tutorial:", vErr?.message);
          return;
        }

        currentVideoList = videos;

        if (currentUser) {
          const { data: userProgress } = await supabaseClient
            .from('user_video_progress')
            .select('video_id, is_completed')
            .eq('user_id', currentUser.id)
            .eq('is_completed', true);

          userCompletedVideoIds = new Set(userProgress ? userProgress.map(p => p.video_id) : []);
        } else {
          userCompletedVideoIds = new Set();
        }

        if (currentVideoList.length === 0) {
          isVideoRequirementMet = true;
        } else {
          const completedCount = currentVideoList.filter(v => userCompletedVideoIds.has(v.id)).length;
          if (completedCount >= currentVideoList.length) {
            isVideoRequirementMet = true;
          } else {
            isVideoRequirementMet = false;
          }
        }

        updateVideoRequirementUI();
        renderVideoPlaylist();

        if (currentVideoList.length > 0) {
          let firstUncompletedIdx = currentVideoList.findIndex(v => !userCompletedVideoIds.has(v.id));
          if (firstUncompletedIdx === -1) firstUncompletedIdx = 0;
          selectVideoToPlay(firstUncompletedIdx);
        }
      } catch (err) {
        console.error("Error loadVideoTutorialsSection:", err);
      }
    }

    function updateVideoRequirementUI() {
      const alertBanner = document.getElementById('video-requirement-alert-banner');
      const badgeStatus = document.getElementById('badge-video-status');
      const summaryTxt = document.getElementById('txt-video-completion-summary');

      const total = currentVideoList.length;
      const completedCount = currentVideoList.filter(v => userCompletedVideoIds.has(v.id)).length;

      if (badgeStatus) badgeStatus.innerText = `${completedCount}/${total}`;
      if (summaryTxt) summaryTxt.innerText = `${completedCount} dari ${total} Video Selesai`;

      if (alertBanner) {
        if (!isVideoRequirementMet && total > 0) {
          alertBanner.classList.remove('hidden');
        } else {
          alertBanner.classList.add('hidden');
        }
      }
    }

    function renderVideoPlaylist() {
      const container = document.getElementById('video-playlist-container');
      const countEl = document.getElementById('txt-total-playlist-count');
      if (!container) return;

      countEl.innerText = `${currentVideoList.length} Video`;

      if (currentVideoList.length === 0) {
        container.innerHTML = `<div class="p-4 text-center text-xs text-slate-400">Belum ada video tutorial wajib yang diunggah Admin.</div>`;
        return;
      }

      container.innerHTML = currentVideoList.map((v, index) => {
        const isCompleted = userCompletedVideoIds.has(v.id);
        
        let isUnlocked = false;
        if (index === 0) {
          isUnlocked = true;
        } else {
          const prevVideo = currentVideoList[index - 1];
          if (userCompletedVideoIds.has(prevVideo.id)) {
            isUnlocked = true;
          }
        }

        const isActive = (index === activeVideoIndex);

        let iconBadge = `<i class="fa-solid fa-lock text-slate-400"></i>`;
        let cardBg = `bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed`;
        let statusTag = `<span class="text-[9px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Terkunci</span>`;

        if (isCompleted) {
          iconBadge = `<i class="fa-solid fa-circle-check text-emerald-500 text-sm"></i>`;
          statusTag = `<span class="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Selesai</span>`;
          cardBg = isActive ? `bg-purple-50/90 border-purple-400 shadow-sm` : `bg-white border-slate-200 hover:border-purple-300 cursor-pointer`;
        } else if (isUnlocked) {
          iconBadge = `<i class="fa-solid fa-circle-play text-purple-600 text-sm"></i>`;
          statusTag = `<span class="text-[9px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">Wajib Ditonton</span>`;
          cardBg = isActive ? `bg-purple-50/90 border-purple-400 shadow-sm` : `bg-white border-slate-200 hover:border-purple-300 cursor-pointer`;
        }

        return `
          <div onclick="${isUnlocked ? `selectVideoToPlay(${index})` : ''}" class="p-3 rounded-xl border transition flex items-start gap-2.5 ${cardBg}">
            <span class="w-6 h-6 rounded-lg bg-slate-100 font-extrabold text-[11px] text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 mt-0.5">${esc(v.sort_order || (index + 1))}</span>
            <div class="flex-1 space-y-1">
              <h5 class="text-xs font-bold text-slate-800 leading-snug line-clamp-2">${esc(v.title)}</h5>
              <div class="flex items-center justify-between">
                ${statusTag}
                <span>${iconBadge}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function selectVideoToPlay(index) {
      if (index < 0 || index >= currentVideoList.length) return;

      activeVideoIndex = index;
      renderVideoPlaylist();

      const video = currentVideoList[index];
      const ytId = extractYouTubeId(video.youtube_video_id);

      document.getElementById('txt-playing-number').innerText = video.sort_order || (index + 1);
      document.getElementById('txt-playing-title').innerText = video.title;

      const isCompleted = userCompletedVideoIds.has(video.id);
      const badgePlaying = document.getElementById('badge-playing-status');

      if (isCompleted) {
        badgePlaying.className = "text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200";
        badgePlaying.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-500 mr-1"></i> Selesai (Bisa Diputar Ulang)`;
      } else {
        badgePlaying.className = "text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200";
        badgePlaying.innerHTML = `<i class="fa-solid fa-play text-purple-600 mr-1"></i> Sedang Menonton (Tanpa Skip)`;
      }

      maxWatchedTime = 0;
      document.getElementById('txt-watch-progress-percent').innerText = '0%';
      document.getElementById('txt-watch-timer').innerText = '00:00 / 00:00';

      initOrLoadYouTubePlayer(ytId);
    }

    function initOrLoadYouTubePlayer(videoId) {
      // API YouTube dimuat async: simpan dulu ID video, putar setelah API siap
      if (!window.YT || typeof YT.Player !== 'function') {
        pendingYouTubeVideoId = videoId;
        return;
      }
      if (!ytPlayer) {
        ytPlayer = new YT.Player('yt-tutorial-player', {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            'playsinline': 1,
            'rel': 0,
            'modestbranding': 1,
            'controls': 1
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      } else {
        ytPlayer.loadVideoById(videoId);
      }
    }

    function onPlayerReady(event) {}

    function onPlayerStateChange(event) {
      if (watchProgressInterval) clearInterval(watchProgressInterval);

      if (event.data === YT.PlayerState.PLAYING) {
        watchProgressInterval = setInterval(trackWatchProgress, 500);
      } else if (event.data === YT.PlayerState.ENDED) {
        handleVideoEnded();
      }
    }

    function trackWatchProgress() {
      if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;

      const currentVid = currentVideoList[activeVideoIndex];
      const isCompleted = userCompletedVideoIds.has(currentVid.id);

      const currentTime = ytPlayer.getCurrentTime();
      const duration = ytPlayer.getDuration();

      if (!duration || duration === 0) return;

      if (!isCompleted) {
        if (currentTime > maxWatchedTime + 2) {
          ytPlayer.seekTo(maxWatchedTime, true);
          showModalAlert("Dilarang Skip", "Video tutorial wajib ditonton secara penuh dari awal sampai akhir tanpa dipercepat/dilewati.", "warning");
          return;
        } else {
          if (currentTime > maxWatchedTime) {
            maxWatchedTime = currentTime;
          }
        }
      }

      const percent = Math.min(100, Math.floor((currentTime / duration) * 100));
      document.getElementById('txt-watch-progress-percent').innerText = `${percent}%`;

      const curM = String(Math.floor(currentTime / 60)).padStart(2, '0');
      const curS = String(Math.floor(currentTime % 60)).padStart(2, '0');
      const durM = String(Math.floor(duration / 60)).padStart(2, '0');
      const durS = String(Math.floor(duration % 60)).padStart(2, '0');

      document.getElementById('txt-watch-timer').innerText = `${curM}:${curS} / ${durM}:${durS}`;
    }

    async function handleVideoEnded() {
      if (watchProgressInterval) clearInterval(watchProgressInterval);

      const video = currentVideoList[activeVideoIndex];
      if (!video) return;

      if (!userCompletedVideoIds.has(video.id) && currentUser) {
        userCompletedVideoIds.add(video.id);

        try {
          await supabaseClient
            .from('user_video_progress')
            .upsert([{
              user_id: currentUser.id,
              video_id: video.id,
              is_completed: true,
              completed_at: new Date().toISOString()
            }], { onConflict: 'user_id,video_id' });

          await showModalAlert("Selamat! 🎉", `Anda telah menyelesaikan video "${video.title}". Syarat tontonan diperbarui!`, "success");

          const completedCount = currentVideoList.filter(v => userCompletedVideoIds.has(v.id)).length;
          if (completedCount >= 1 || completedCount >= currentVideoList.length) {
            isVideoRequirementMet = true;
          }

          updateVideoRequirementUI();
          renderVideoPlaylist();

          switchTab('claim');

          if (selectedThemeData && selectedThemeData.kategori) {
            selectTheme(selectedThemeData.kategori);
          }

          return;
        } catch (err) {
          console.error("Gagal simpan progress video:", err);
        }
      }

      const completedCount = currentVideoList.filter(v => userCompletedVideoIds.has(v.id)).length;
      if (completedCount >= 1 || completedCount >= currentVideoList.length) {
        isVideoRequirementMet = true;
      }

      updateVideoRequirementUI();
      renderVideoPlaylist();
    }

    async function loadAdminVideoList() {
      const tbody = document.getElementById('admin-video-list-body');
      if (!tbody) return;

      tbody.innerHTML = `<tr><td class="p-4 text-center text-slate-400" colspan="4">Memuat data video...</td></tr>`;

      const { data: videos, error } = await supabaseClient
        .from('tutorial_videos')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error || !videos || videos.length === 0) {
        tbody.innerHTML = `<tr><td class="p-4 text-center text-slate-400" colspan="4">Belum ada video tutorial wajib dalam database.</td></tr>`;
        return;
      }

      tbody.innerHTML = videos.map(v => `
        <tr class="hover:bg-slate-50 transition">
          <td class="p-2.5 text-center font-bold text-slate-800">${esc(v.sort_order)}</td>
          <td class="p-2.5 font-bold text-purple-900 break-words">${esc(v.title)}</td>
          <td class="p-2.5 text-center text-slate-500 font-mono text-[11px] truncate">${esc(v.youtube_video_id)}</td>
          <td class="p-2.5 text-center space-x-1">
            <button onclick="editAdminVideoItem(${jsArg(v.id)}, ${jsArg(v.title)}, ${jsArg(v.youtube_video_id)}, ${Number(v.sort_order) || 1})" class="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded text-[10px] font-bold shadow-sm" title="Edit">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deleteAdminVideoItem(${jsArg(v.id)}, ${jsArg(v.title)})" class="bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded text-[10px] font-bold shadow-sm" title="Hapus">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `).join('');
    }

    async function handleSaveVideoItem(e) {
      e.preventDefault();
      const editId = document.getElementById('video-edit-id').value;
      const title = document.getElementById('input-video-title').value.trim();
      const rawYtId = document.getElementById('input-video-yt-id').value.trim();
      const sortOrder = parseInt(document.getElementById('input-video-sort').value) || 1;

      const ytId = extractYouTubeId(rawYtId);
      if (!ytId) return await showModalAlert("Validasi Gagal", "Masukkan Video ID / URL YouTube yang valid!", "warning");

      const btnSave = document.getElementById('btn-save-video-item');
      btnSave.disabled = true;
      btnSave.innerText = "Menyimpan...";

      if (editId) {
        const { error } = await supabaseClient.from('tutorial_videos').update({
          title: title,
          youtube_video_id: ytId,
          sort_order: sortOrder
        }).eq('id', editId);

        if (error) await showModalAlert("Gagal Update", error.message, "error");
        else await showModalAlert("Berhasil", "Video tutorial diperbarui!", "success");
      } else {
        const { error } = await supabaseClient.from('tutorial_videos').insert([{
          title: title,
          youtube_video_id: ytId,
          sort_order: sortOrder
        }]);

        if (error) await showModalAlert("Gagal Tambah", error.message, "error");
        else await showModalAlert("Berhasil", "Video tutorial baru otomatis masuk ke daftar syarat tonton desainer!", "success");
      }

      btnSave.disabled = false;
      btnSave.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Simpan Video`;
      resetVideoForm();
      loadAdminVideoList();
      loadVideoTutorialsSection();
    }

    function editAdminVideoItem(id, title, ytId, sortOrder) {
      document.getElementById('video-edit-id').value = id;
      document.getElementById('input-video-title').value = title;
      document.getElementById('input-video-yt-id').value = ytId;
      document.getElementById('input-video-sort').value = sortOrder;
      document.getElementById('btn-cancel-video-edit').classList.remove('hidden');
    }

    function resetVideoForm() {
      document.getElementById('form-video-item').reset();
      document.getElementById('video-edit-id').value = '';
      document.getElementById('btn-cancel-video-edit').classList.add('hidden');
    }

    async function deleteAdminVideoItem(id, title) {
      const confirmed = await showModalConfirm("Konfirmasi Hapus", `Yakin ingin menghapus video tutorial "${title}"?`);
      if (confirmed) {
        const { error } = await supabaseClient.from('tutorial_videos').delete().eq('id', id);
        if (error) await showModalAlert("Gagal Hapus", error.message, "error");
        else {
          await showModalAlert("Terhapus", "Video tutorial berhasil dihapus!", "success");
          loadAdminVideoList();
          loadVideoTutorialsSection();
        }
      }
    }

    async function loadAnnouncement() {
      try {
        const { data } = await supabaseClient
          .from('announcements')
          .select('*')
          .eq('id', 'GLOBAL')
          .maybeSingle();

        updateRunningTextUI(data);
      } catch (err) {
        console.warn("Announcement error:", err.message);
      }
    }

   function updateRunningTextUI(data) {
  const banner = document.getElementById('announcement-banner');
  const content = document.getElementById('running-text-content');
  const duplicate = document.getElementById('running-text-duplicate');
  const track = document.getElementById('marquee-track-container');

  if (data && data.is_active && data.message && data.message.trim() !== '') {
    const textMsg = data.message.trim();
    
    if (content) content.innerText = textMsg;
    if (duplicate) duplicate.innerText = textMsg;

    if (track) {
      // Kecepatan adaptif menyesuaikan panjang kalimat
      const calculatedDuration = Math.max(12, Math.round(textMsg.length * 0.25));
      track.style.animationDuration = `${calculatedDuration}s`;
    }

    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
    if (content) content.innerText = '';
    if (duplicate) duplicate.innerText = '';
  }
}
    function listenRealtimeAnnouncement() {
      supabaseClient
        .channel('public:announcements')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, (payload) => {
          if (payload.new) updateRunningTextUI(payload.new);
        })
        .subscribe();
    }

function listenRealtimePopupNotice() {
  supabaseClient
    .channel('public:popup_notices')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'popup_notices' }, (payload) => {
      const row = payload.new && payload.new.id ? payload.new : null;
      if (payload.eventType === 'DELETE' || (row && !row.is_active)) {
        const id = row ? row.id : (payload.old && payload.old.id);
        if (id) dropFlashNotice(id);
      } else if (row) {
        // Abaikan update yang hanya mengubah read_by (desainer lain klik "Saya Mengerti")
        if (flashSeenSig[row.id] !== flashNoticeSig(row)) showSmoothFlashModal(row, true);
      }
      const modalManage = document.getElementById('modal-manage-flash-banner');
      if (modalManage && !modalManage.classList.contains('hidden')) {
        loadAdminPopupNoticesList();
      }
    })
    .subscribe();
}
    async function handleSaveAnnouncement(e) {
      e.preventDefault();
      const message = document.getElementById('input-announcement-msg').value.trim();
      const isActive = document.getElementById('check-announcement-active').checked;

      const { error } = await supabaseClient
        .from('announcements')
        .upsert({
          id: 'GLOBAL',
          message: message,
          is_active: isActive,
          updated_at: new Date().toISOString()
        });

      if (!error) {
        await showModalAlert("Berhasil", "Running text berhasil diperbarui!", "success");
        document.getElementById('modal-announcement').classList.add('hidden');
      } else {
        await showModalAlert("Gagal Update", error.message, "error");
      }
    }

    async function handleDeleteAnnouncement() {
      const confirmed = await showModalConfirm("Konfirmasi Hapus", "Yakin ingin mengosongkan pengumuman running text?");
      if (!confirmed) return;

      const { error } = await supabaseClient
        .from('announcements')
        .update({ message: '', is_active: false })
        .eq('id', 'GLOBAL');

      if (!error) {
        document.getElementById('input-announcement-msg').value = '';
        document.getElementById('check-announcement-active').checked = false;
        await showModalAlert("Berhasil", "Pengumuman dikosongkan!", "success");
        document.getElementById('modal-announcement').classList.add('hidden');
      } else {
        await showModalAlert("Gagal Hapus", error.message, "error");
      }
    }

    function sortArrayData(array, col, dir) {
      if (!array || array.length === 0) return array;
      return array.sort((a, b) => {
        let valA = a[col] ?? '';
        let valB = b[col] ?? '';

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return dir === 'asc' ? -1 : 1;
        if (valA > valB) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    function updateSortHeaderIcons(prefix, activeCol, dir, columns) {
      columns.forEach(c => {
        const icon = document.getElementById(`${prefix}-${c}`);
        if (icon) {
          if (c === activeCol) {
            icon.className = dir === 'asc' 
              ? 'fa-solid fa-sort-up text-indigo-600 ml-1' 
              : 'fa-solid fa-sort-down text-indigo-600 ml-1';
          } else {
            icon.className = 'fa-solid fa-sort text-slate-300 ml-1';
          }
        }
      });
    }

    function sortOverviewDesigners(col) {
      if (overviewSortCol === col) { overviewSortDir = overviewSortDir === 'asc' ? 'desc' : 'asc'; }
      else { overviewSortCol = col; overviewSortDir = 'asc'; }
      renderOverviewDesignersTable();
    }

    function sortUserProjects(col) {
      if (userSortCol === col) { userSortDir = userSortDir === 'asc' ? 'desc' : 'asc'; }
      else { userSortCol = col; userSortDir = 'asc'; }
      loadUserDashboardData();
    }

    function sortAdminThemes(col) {
      if (themesSortCol === col) { themesSortDir = themesSortDir === 'asc' ? 'desc' : 'asc'; }
      else { themesSortCol = col; themesSortDir = 'asc'; }
      loadAdminThemesTable();
    }

    function sortAdminProjects(col) {
      if (adminSortCol === col) { adminSortDir = adminSortDir === 'asc' ? 'desc' : 'asc'; }
      else { adminSortCol = col; adminSortDir = 'asc'; }
      loadAdminProjects();
    }

    function sortAnalyticsTable(col) {
      if (analyticsSortCol === col) { analyticsSortDir = analyticsSortDir === 'asc' ? 'desc' : 'asc'; }
      else { analyticsSortCol = col; analyticsSortDir = 'asc'; }
      renderAnalyticsTable();
    }

    async function exportToSpreadsheet() {
      const btnExport = document.getElementById('btn-export-excel');
      btnExport.disabled = true;
      btnExport.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Memproses...`;

      try {
        const { data: projects, error } = await supabaseClient
          .from('icon_projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error || !projects || projects.length === 0) {
          await showModalAlert("Peringatan", "Tidak ada data laporan untuk diexport.", "warning");
          return;
        }

        let csvContent = "Tanggal,Nama Desainer,Level,Target Belajar,Tool Desain,Tema / Kategori,Jumlah Icon,In Review,Rejected,Approved,Status Admin,URL Drive\n";

        projects.forEach(p => {
          const dateStr = formatFullDateTime(p.created_at);
          const desainerName = (userProfilesMap[p.designer_id] || 'Desainer').replace(/"/g, '""');
          const desainerLevel = userLevelsMap[p.designer_id] || 2;
          const targetBelajar = (p.target_belajar || '-').replace(/"/g, '""');
          const toolDesain = (p.tool_desain || 'Bebas').replace(/"/g, '""');
          const kategori = (p.kategori || '-').replace(/"/g, '""');
          const totalNilai = p.jumlah_icon || 0;
          const inReview = Number(p.in_review_count) || 0;
          const rejected = Number(p.rejected_count) || 0;
          const approved = Math.max(0, totalNilai - (rejected + inReview));
          const statusAdmin = p.status_admin || 'Pending';
          const driveUrl = p.drive_folder_url || '-';

          csvContent += `"${dateStr}","${desainerName}",Level ${desainerLevel},"${targetBelajar}","${toolDesain}","${kategori}",${totalNilai},${inReview},${rejected},${approved},"${statusAdmin}","${driveUrl}"\n`;
        });

        const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Laporan_Desainer_Icon_Canva_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        await showModalAlert("Berhasil Export", "Laporan berhasil diunduh ke Spreadsheet / CSV!", "success");
      } catch (err) {
        await showModalAlert("Gagal Export", err.message, "error");
      } finally {
        btnExport.disabled = false;
        btnExport.innerHTML = `<i class="fa-solid fa-file-excel"></i> Export Spreadsheet`;
      }
    }


    async function checkActiveUser() {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (window.klSetGuestMode) window.klSetGuestMode(!user); // tamu → landing page, login → dashboard
      if (user) {
        currentUser = user;
        userEmailsMap[user.id] = user.email;
        startHeartbeatLoop();
        await showMainPanel();
        loadFlashBannerAnnouncement();
      }
    }

    async function handleEmailLogin(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        await showModalAlert("Gagal Login", error.message, "error");
      } else {
        currentUser = data.user;
        userEmailsMap[currentUser.id] = currentUser.email;
        document.getElementById('modal-login').classList.add('hidden');
        if (window.klSetGuestMode) window.klSetGuestMode(false); // langsung ke dashboard
        startHeartbeatLoop();
        await showMainPanel();
        await logUserActivity('AUTH', 'Berhasil masuk (login) ke dalam sistem.');
        loadFlashBannerAnnouncement();
      }
    }

    async function handleRegisterUser(e) {
      e.preventDefault();
      const fullName = document.getElementById('reg-fullname').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const role = document.getElementById('reg-role').value;
      const level = parseInt(document.getElementById('reg-level').value) || 2;

      const btnSub = document.getElementById('btn-submit-reg-user');
      btnSub.disabled = true;
      btnSub.innerText = "Memproses...";

      try {
        const { data, error } = await supabaseAdminNoSession.auth.signUp({
          email: email,
          password: password,
          options: { data: { full_name: fullName } }
        });

        if (error) throw error;

        if (data.user) {
          const { error: upsertErr } = await supabaseClient
            .from('profiles')
            .upsert([{ 
              id: data.user.id, 
              full_name: fullName, 
              role: role, 
              level: level,
              email: email 
            }], { onConflict: 'id' });

          if (upsertErr) console.warn("Upsert profiles err:", upsertErr.message);

          userProfilesMap[data.user.id] = fullName;
          userLevelsMap[data.user.id] = level;
          userEmailsMap[data.user.id] = email;

          await showModalAlert("Pendaftaran Sukses", `Akun desainer (${fullName} - Level ${level}) berhasil dibuat.`, "success");
          document.getElementById('modal-add-user').classList.add('hidden');
          document.getElementById('form-reg-user').reset();

          await loadUsersList();
          await renderOverviewDesignersTable();
          if (isAdminUser) loadAdminOverviewData();
          await loadAdminProjects();
        }
      } catch (err) {
        await showModalAlert("Gagal Pendaftaran", err.message, "error");
      } finally {
        btnSub.disabled = false;
        btnSub.innerText = "Simpan & Buat Akun";
      }
    }

    async function showMainPanel() {
      document.getElementById('auth-section').innerHTML = `
        <div class="relative inline-block" id="notif-wrapper">
          <button id="btn-notif-bell" class="relative p-1.5 sm:p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition focus:outline-none">
            <i class="fa-solid fa-bell text-base sm:text-lg"></i>
            <span id="notif-badge-count" class="hidden absolute -top-1 -right-1.5 bg-rose-600 text-white text-[9px] font-black min-w-[18px] h-[18px] px-1.5 py-0.5 rounded-md flex items-center justify-center leading-none border-2 border-white shadow-xs animate-pulse">0</span>
          </button>

          <div id="notif-dropdown-menu" class="hidden absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100">
            <div class="p-3 bg-slate-50 flex items-center justify-between border-b border-slate-200">
              <span class="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <i class="fa-solid fa-bell text-blue-600"></i> Pemberitahuan
              </span>
              <button id="btn-mark-all-read" class="text-[10px] font-bold text-blue-600 hover:underline">Tandai Dibaca</button>
            </div>
            
            <div class="max-h-72 overflow-y-auto divide-y divide-slate-100 scrollbar-thin" id="notif-items-container">
              <div class="p-4 text-center text-xs text-slate-400">Tidak ada pemberitahuan baru.</div>
            </div>
          </div>
        </div>

        <span class="hidden sm:inline-block text-xs text-slate-700 font-bold bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 truncate max-w-[120px]">${currentUser.email}</span>
        
        <button id="btn-logout" class="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs px-2.5 py-1.5 rounded-lg transition border border-rose-200 shrink-0 flex items-center gap-1">
          <i class="fa-solid fa-right-from-bracket sm:hidden"></i>
          <span class="hidden sm:inline">Logout</span>
        </button>
      `;

      document.getElementById('btn-logout').addEventListener('click', logout);
      initNotifDropdownListeners();

      await loadUsersList();
      await loadVideoTutorialsSection();
      
if (currentUser) {
  evaluateAndUpdateDesignerLevel(currentUser.id);
}
      const { data: profile } = await supabaseClient.from('profiles').select('role, level').eq('id', currentUser.id).single();
      
      if ((profile && profile.role === 'admin') || currentUser.email === 'meongtivi.official@gmail.com') {
        isAdminUser = true;
        document.getElementById('btn-tab-admin').classList.remove('hidden');
        document.getElementById('btn-tab-designer-analytics').classList.remove('hidden');
        
        document.getElementById('txt-tab-claim').innerText = "Ikhtisar";
        document.getElementById('icon-tab-claim').className = "fa-solid fa-chart-pie";

        document.getElementById('txt-tab-dashboard').innerText = "Kelola Stok Tema";
        document.getElementById('icon-tab-dashboard').className = "fa-solid fa-list-check";

        switchTab('claim'); 
        checkSupabaseUsage();
        await loadAdminOverviewData();
        await loadAdminThemesTable();
        await loadAdminProjects();
        fetchDesignerNotifications();
      } else {
        isAdminUser = false;
        document.getElementById('btn-tab-admin').classList.add('hidden');
        document.getElementById('btn-tab-designer-analytics').classList.add('hidden');

        document.getElementById('txt-tab-claim').innerText = "Klaim & Stock Tema";
        document.getElementById('icon-tab-claim').className = "fa-solid fa-boxes-stacked";

        document.getElementById('txt-tab-dashboard').innerText = "Dashboard Saya";
        document.getElementById('icon-tab-dashboard').className = "fa-solid fa-chart-line";

        switchTab('claim');
        loadUserDashboardData();
        fetchDesignerNotifications();
      }
    }

    async function logout() {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (watchProgressInterval) clearInterval(watchProgressInterval);
      await supabaseClient.auth.signOut();
      window.location.reload();
    }

    function listenRealtimeThemes() {
      supabaseClient
        .channel('public:themes_stock')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'themes_stock' }, () => {
          loadThemes();
          if (isAdminUser) {
            loadAdminOverviewData();
            loadAdminThemesTable();
          }
        })
        .subscribe();

      supabaseClient
        .channel('public:notifications')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
          if (payload.new && currentUser && payload.new.user_id === currentUser.id) {
            playNotifSound();
            fetchDesignerNotifications();
          }
        })
        .subscribe();

      supabaseClient
        .channel('public:tutorial_videos')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tutorial_videos' }, () => {
          loadVideoTutorialsSection();
        })
        .subscribe();

      supabaseClient
        .channel('public:profiles')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, async (payload) => {
          if (payload.new) {
            userLastSeenMap[payload.new.id] = payload.new.last_seen;
            if (currentUser && payload.new.id === currentUser.id && Array.isArray(payload.new.read_notifs)) {
              localStorage.setItem(`read_notifs_${currentUser.id}`, JSON.stringify(payload.new.read_notifs));
              fetchDesignerNotifications();
            }
          }
          scheduleAdminPresenceRefresh();
        })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, async () => {
          await loadUsersList();
          if (isAdminUser) await renderOverviewDesignersTable();
        })
        .subscribe();

      

    supabaseClient
        .channel('realtime-icon-projects-main')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'icon_projects' }, (payload) => {
          // 1. Bunyikan notifikasi untuk Desainer jika proyek miliknya di-Approve / Reject oleh Admin
          if (payload.eventType === 'UPDATE' && currentUser && !isAdminUser && payload.new.designer_id === currentUser.id) {
            if (payload.new.status_admin === 'Approved' || payload.new.status_admin === 'Rejected') {
              playNotifSound();
            }
          }

          // 2. Bunyikan notifikasi untuk Admin jika ada klaim baru (INSERT) atau desainer upload/kirim laporan (UPDATE)
          if (currentUser && isAdminUser) {
            if (payload.eventType === 'INSERT') {
              playNotifSound();
            } else if (payload.eventType === 'UPDATE' && ['Uploaded', 'Submitted', 'Revised'].includes(payload.new.status_admin)) {
              playNotifSound();
            }
          }

          // 3. Debounce update UI (menahan rentetan event agar hanya render 1x dengan mulus)
          clearTimeout(realtimeSyncTimer);
          realtimeSyncTimer = setTimeout(() => {
            if (isAdminUser) {
              if (!isEditingAdminTable && !document.activeElement?.closest('#admin-table-body')) {
                loadAdminProjects(true);
              }
              const overviewView = document.getElementById('view-claim-admin');
              if (overviewView && !overviewView.classList.contains('hidden')) {
                loadAdminOverviewData();
              }
              const analyticsView = document.getElementById('view-designer-analytics');
              if (analyticsView && !analyticsView.classList.contains('hidden')) {
                loadDesignerAnalyticsData();
              }
            } else {
              loadThemes();
              loadUserDashboardData(true);
            }

            fetchDesignerNotifications();

            if (!document.getElementById('modal-slip-gaji').classList.contains('hidden')) {
              calculateSalaryForSelectedUser();
            }
          }, 400);
        })
        .subscribe();
    }

    // Gabungkan rentetan event heartbeat (tiap user tiap 30 detik) menjadi 1x render per 3 detik
    function scheduleAdminPresenceRefresh() {
      if (!isAdminUser) return;
      if (adminPresenceTimer) return;
      adminPresenceTimer = setTimeout(() => {
        adminPresenceTimer = null;
        if (document.hidden) return;
        const overviewView = document.getElementById('view-claim-admin');
        if (overviewView && !overviewView.classList.contains('hidden')) renderOverviewDesignersTable();
        const adminView = document.getElementById('view-admin');
        if (adminView && !adminView.classList.contains('hidden')) renderAdminProjectsTable();
      }, 3000);
    }

    // Sinkronisasi ringan hanya saat tab browser kembali dibuka setelah ditinggal
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && currentUser && !isEditingAdminTable) {
        if (isAdminUser) {
          loadAdminProjects(true);
        } else {
          loadThemes();
          loadUserDashboardData(true);
        }
      }
    });

    let prevUnreadCount = 0;

    async function fetchDesignerNotifications() {
      if (!currentUser) return;

      const storageKey = `read_notifs_${currentUser.id}`;
      let localReadIds = JSON.parse(localStorage.getItem(storageKey) || '[]').map(id => String(id));

      // Ambil daftar notifikasi yang sudah dibuka dari device mana pun (Supabase)
      let dbReadIds = [];
      try {
        const { data: profData } = await supabaseClient
          .from('profiles')
          .select('read_notifs')
          .eq('id', currentUser.id)
          .maybeSingle();
        if (profData && Array.isArray(profData.read_notifs)) {
          dbReadIds = profData.read_notifs.map(id => String(id));
        }
      } catch (e) {
        console.warn("Gagal sinkronisasi read_notifs:", e.message);
      }

      const readSet = new Set([...localReadIds, ...dbReadIds]);
      localStorage.setItem(storageKey, JSON.stringify([...readSet]));

      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      let unreadEvents = [];

      try {
        const { data: dbNotifs } = await supabaseClient
          .from('notifications')
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('is_read', false)
          .order('created_at', { ascending: false });

        if (dbNotifs && dbNotifs.length > 0) {
          dbNotifs.forEach(n => {
            const key = `db_notif_${n.id}`;
            if (!readSet.has(key)) {
              const notifTime = n.created_at || new Date().toISOString();
              const formattedCanvaTs = formatNotifUploadTime(notifTime);
              unreadEvents.push({
                eventKey: key,
                dbId: n.id,
                projectId: n.project_id || '',
                title: n.title || 'Pemberitahuan Baru',
                sub: n.message || '',
                time: notifTime,
                customTime: formattedCanvaTs,
                iconClass: 'fa-bell text-blue-600'
              });
            }
          });
        }
      } catch (err) {
        console.error("Gagal mengambil notifikasi database:", err.message);
      }

      if (isAdminUser) {
        const { data: projects } = await supabaseClient
          .from('icon_projects')
          .select('*')
          .or(`created_at.gte.${twentyFourHoursAgo},updated_at.gte.${twentyFourHoursAgo}`)
          .order('updated_at', { ascending: false });

        if (projects) {
          projects.forEach(p => {
            // 1. Notifikasi Desainer Klaim Tema Baru
            if (p.created_at && new Date(p.created_at) >= new Date(twentyFourHoursAgo)) {
              const key = `claim_${p.id}`;
              if (!readSet.has(key)) {
                unreadEvents.push({
                  eventKey: key,
                  projectId: p.id,
                  title: `${userProfilesMap[p.designer_id] || 'Desainer'} baru saja mengklaim ${p.jumlah_icon} Icon ${p.kategori}`,
                  sub: '',
                  time: p.created_at,
                  customTime: formatNotifUploadTime(p.created_at),
                  iconClass: 'fa-circle-plus text-blue-600 bg-blue-50'
                });
              }
            }

            // 2. Notifikasi Desainer Klik "Sudah Upload" & Berhasil Verifikasi Drive
            if (p.canva_submitted_at && new Date(p.canva_submitted_at) >= new Date(twentyFourHoursAgo)) {
              const keyDrive = `drive_upload_${p.id}_${new Date(p.canva_submitted_at).getTime()}`;
              const namaDesainer = userProfilesMap[p.designer_id] || 'Desainer';
              const isRevisi = (Number(p.rejected_count) > 0 || (p.catatan_admin && p.catatan_admin.trim() !== ''));
              if (!readSet.has(keyDrive)) {
                unreadEvents.push({
                  eventKey: keyDrive,
                  projectId: p.id,
                  title: isRevisi
                    ? `${namaDesainer} berhasil merevisi ${p.jumlah_icon} ${p.kategori}`
                    : `${namaDesainer} berhasil mengupload ${p.jumlah_icon} ${p.kategori}`,
                  sub: isRevisi
                    ? 'Status: File Revisi Terverifikasi di Google Drive'
                    : 'Status: Berhasil Verifikasi Google Drive',
                  time: p.canva_submitted_at,
                  customTime: formatNotifUploadTime(p.canva_submitted_at),
                  iconClass: 'fa-check-double text-teal-600 bg-teal-50'
                });
              }
            }

            // 3. Notifikasi Desainer Klik "Kirim Laporan" ke Grup Telegram
            if (p.status_admin === 'Submitted' && p.updated_at && new Date(p.updated_at) >= new Date(twentyFourHoursAgo)) {
              const keyReport = `telegram_report_${p.id}`;
              const namaDesainer = userProfilesMap[p.designer_id] || 'Desainer';
              if (!readSet.has(keyReport)) {
                unreadEvents.push({
                  eventKey: keyReport,
                  projectId: p.id,
                  title: `${namaDesainer} telah mengirim laporan ${p.jumlah_icon} ${p.kategori} ke Grup Telegram KEKAL Studio`,
                  sub: 'Status: Laporan Terkirim',
                  time: p.updated_at,
                  customTime: formatNotifUploadTime(p.updated_at),
                  iconClass: 'fa-paper-plane text-indigo-600 bg-indigo-50'
                });
              }
            }

            // 4. Notifikasi Desainer Klik Upload Canva
            if (p.canva_uploaded_info && p.updated_at && new Date(p.updated_at) >= new Date(twentyFourHoursAgo)) {
              const uploadTime = p.updated_at;
              const keyCanva = `canva_upload_${p.id}`;
              const parsedUploader = p.canva_uploaded_info.includes(' oleh ')
                ? p.canva_uploaded_info.split(' oleh ')[1].trim()
                : (userProfilesMap[p.uploader_id || p.designer_id] || 'Desainer');

              if (!readSet.has(keyCanva)) {
                unreadEvents.push({
                  eventKey: keyCanva,
                  projectId: p.id,
                  title: `(${p.jumlah_icon}) Icon ${p.kategori} berhasil diupload oleh ${parsedUploader}`,
                  sub: `Status: Selesai Upload Canva`,
                  time: uploadTime,
                  customTime: formatNotifUploadTime(uploadTime),
                  iconClass: 'fa-cloud-arrow-up text-emerald-600 bg-emerald-50'
                });
              }
            }
          });
        }

        const now = new Date();
        if (projects) {
          projects.forEach(p => {
            let isExp = false;
            if (p.deadline_drive && new Date(p.deadline_drive) < now) isExp = true;
            
            if (isExp && !p.canva_submitted_at && p.status_admin !== 'Approved') {
              const dName = userProfilesMap[p.designer_id] || 'Desainer';
              const keyExp = `expired_${p.id}`;
              if (!readSet.has(keyExp)) {
                unreadEvents.push({
                  eventKey: keyExp,
                  projectId: p.id,
                  title: `⚠️ Klaim Expired: ${dName}`,
                  sub: `Tema "${p.kategori}" (${p.jumlah_icon} Icon) telah habis waktu pengerjaannya.`,
                  time: p.deadline_drive || p.created_at,
                  iconClass: 'fa-triangle-exclamation text-rose-500 bg-rose-50'
                });
              }
            }
          });
        }
      } else {
        const { data: projects } = await supabaseClient
          .from('icon_projects')
          .select('*')
          .eq('designer_id', currentUser.id)
          .in('status_admin', ['Approved', 'Rejected'])
          .gte('updated_at', twentyFourHoursAgo)
          .order('updated_at', { ascending: false });

        if (projects) {
          projects.forEach(p => {
            const isApproved = p.status_admin === 'Approved';
            const eventTime = p.updated_at || p.created_at;
            // Gunakan key stabil tanpa timestamp agar tidak muncul ulang saat updated_at berubah
            const key = isApproved
              ? `status_${p.id}_Approved`
              : `status_${p.id}_Rejected_${new Date(eventTime).getTime()}`;

            if (!readSet.has(key)) {
              unreadEvents.push({
                eventKey: key,
                projectId: p.id,
                title: isApproved 
                  ? `Tema "${p.kategori}" sebanyak ${p.jumlah_icon} icon telah disetujui! 🎉` 
                  : `Tema "${p.kategori}" sebanyak ${p.jumlah_icon} icon membutuhkan perbaikan`,
                sub: isApproved 
                  ? `Selamat! Desain Anda telah disetujui Admin. Silakan segera upload ke Canva.` 
                  : `Catatan Admin: ${p.catatan_admin || 'Mohon cek dan perbaiki file di Drive.'}`,
                time: eventTime,
                customTime: formatNotifUploadTime(eventTime),
                iconClass: isApproved ? 'fa-circle-check text-emerald-500' : 'fa-circle-xmark text-rose-500'  
              });
            }
          });
        }
      }

		unreadEvents.sort((a, b) => new Date(b.time) - new Date(a.time));

      const badgeEl = document.getElementById('notif-badge-count');
      const container = document.getElementById('notif-items-container');
      const unreadCount = unreadEvents.length;

      if (unreadCount > prevUnreadCount) {
        playNotifSound();
      }
      prevUnreadCount = unreadCount;

      if (badgeEl) {
        if (unreadCount > 0) {
          badgeEl.innerText = unreadCount >= 100 ? '99+' : unreadCount;
          badgeEl.classList.remove('hidden');
        } else {
          badgeEl.classList.add('hidden');
        }
      }

      if (container) {
        if (unreadCount === 0) {
          container.innerHTML = `<div class="p-4 text-center text-xs text-slate-400">Tidak ada pemberitahuan baru (24 Jam Terakhir).</div>`;
          return;
        }

        container.innerHTML = unreadEvents.map(item => `
          <div id="notif-item-${esc(item.eventKey)}" onclick="clickNotifEvent(${jsArg(item.eventKey)}, ${jsArg(item.projectId || '')}, ${jsArg(item.dbId || '')})" class="p-3 bg-blue-50/40 hover:bg-blue-50 transition cursor-pointer flex items-start gap-2.5 border-b border-slate-100 last:border-none">
            <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm bg-slate-100">
              <i class="fa-solid ${item.iconClass}"></i>
            </div>
            <div class="flex-1 space-y-0.5">
              <h5 class="text-[11px] font-bold text-slate-800 leading-tight">${esc(item.title)}</h5>
              <p class="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">${esc(item.sub)}</p>
              <span class="text-[9px] text-slate-400 font-semibold block pt-0.5">
                <i class="fa-regular fa-clock text-[8px] mr-1"></i>${item.customTime || formatFullDateTime(item.time)}
              </span>
            </div>
            <span class="w-2 h-2 rounded-full bg-rose-600 shrink-0 mt-1"></span>
          </div>
        `).join('');
      }
    }

    function initNotifDropdownListeners() {
      const btnBell = document.getElementById('btn-notif-bell');
      const dropdown = document.getElementById('notif-dropdown-menu');
      const btnMarkRead = document.getElementById('btn-mark-all-read');

      if (btnBell && dropdown) {
        btnBell.onclick = (e) => {
          e.stopPropagation();
          dropdown.classList.toggle('hidden');
        };
        // Pasang listener klik-di-luar cukup sekali (sebelumnya terpasang ganda)
        if (!notifOutsideClickBound) {
          notifOutsideClickBound = true;
          document.addEventListener('click', (e) => {
            const dd = document.getElementById('notif-dropdown-menu');
            const bell = document.getElementById('btn-notif-bell');
            if (dd && bell && !dd.contains(e.target) && !bell.contains(e.target)) {
              dd.classList.add('hidden');
            }
          });
        }
      }

      if (btnMarkRead) {
        btnMarkRead.onclick = () => { markAllNotifsAsRead(); };
      }
    }

    async function clickNotifEvent(eventKey, projId, dbId) {
      const dropdown = document.getElementById('notif-dropdown-menu');
      if (dropdown) dropdown.classList.add('hidden');

      await markSingleNotifAsRead(eventKey);

      if (dbId) {
        await supabaseClient.from('notifications').update({ is_read: true }).eq('id', dbId);
      }

      if (!isAdminUser) {
        switchTab('my-dashboard');
        await loadUserDashboardData();
        if (projId) scrollToProjectRow(projId);
      } else {
        switchTab('admin');
        await loadAdminProjects();
      }
    }

    function scrollToProjectRow(projId) {
      setTimeout(() => {
        const targetRow = document.getElementById(`user-row-${projId}`);
        if (targetRow) {
          targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetRow.classList.add('animate-highlight-target');
          setTimeout(() => { targetRow.classList.remove('animate-highlight-target'); }, 2500);
        }
      }, 300);
    }

    async function saveReadNotifsToSupabase(readIdsArray) {
      if (!currentUser) return;
      const trimmedIds = readIdsArray.slice(-250);
      localStorage.setItem(`read_notifs_${currentUser.id}`, JSON.stringify(trimmedIds));
      try {
        await supabaseClient
          .from('profiles')
          .update({ read_notifs: trimmedIds })
          .eq('id', currentUser.id);
      } catch (err) {
        console.warn("Gagal menyimpan read_notifs ke Supabase:", err.message);
      }
    }

    async function markSingleNotifAsRead(eventKey) {
      if (!currentUser) return;
      const storageKey = `read_notifs_${currentUser.id}`;
      let readIds = JSON.parse(localStorage.getItem(storageKey) || '[]').map(id => String(id));
      const strKey = String(eventKey);

      // Simpan langsung ke localStorage & hapus item dari UI seketika (Optimistic UI)
      if (!readIds.includes(strKey)) {
        readIds.push(strKey);
        localStorage.setItem(storageKey, JSON.stringify(readIds.slice(-250)));
      }

      const itemEl = document.getElementById(`notif-item-${strKey}`);
      if (itemEl) itemEl.remove();

      const remainingItems = document.querySelectorAll('#notif-items-container [id^="notif-item-"]').length;
      const badgeEl = document.getElementById('notif-badge-count');
      if (badgeEl) {
        if (remainingItems > 0) {
          badgeEl.innerText = remainingItems >= 100 ? '99+' : remainingItems;
        } else {
          badgeEl.classList.add('hidden');
          const container = document.getElementById('notif-items-container');
          if (container) {
            container.innerHTML = `<div class="p-4 text-center text-xs text-slate-400">Tidak ada pemberitahuan baru (24 Jam Terakhir).</div>`;
          }
        }
      }
      prevUnreadCount = remainingItems;

      await saveReadNotifsToSupabase(readIds);
      await fetchDesignerNotifications();
    }

    async function markAllNotifsAsRead() {
      if (!currentUser) return;
      const storageKey = `read_notifs_${currentUser.id}`;
      let readIds = JSON.parse(localStorage.getItem(storageKey) || '[]').map(id => String(id));
      
      const notifItems = document.querySelectorAll('#notif-items-container [id^="notif-item-"]');
      notifItems.forEach(item => {
        const key = item.id.replace('notif-item-', '');
        if (!readIds.includes(key)) readIds.push(key);
      });

      // Kosongkan badge & daftar notifikasi seketika
      localStorage.setItem(storageKey, JSON.stringify(readIds.slice(-250)));
      const badgeEl = document.getElementById('notif-badge-count');
      if (badgeEl) badgeEl.classList.add('hidden');
      const container = document.getElementById('notif-items-container');
      if (container) {
        container.innerHTML = `<div class="p-4 text-center text-xs text-slate-400">Tidak ada pemberitahuan baru (24 Jam Terakhir).</div>`;
      }
      prevUnreadCount = 0;

      await saveReadNotifsToSupabase(readIds);
      await fetchDesignerNotifications();
    }
    /* ---------- Jeda klaim ulang tema yang sama ---------- */
    // Desainer yang baru menyelesaikan (Approved) sebuah tema tidak boleh mengklaim tema yang sama
    // sebelum diselingi desainer lain, atau sebelum lewat CLAIM_COOLDOWN_MS sejak di-Approve.
    const CLAIM_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;
    const CLAIM_DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    let claimCooldownMap = {};
    let claimCooldownTimer = null;
    let claimCooldownReloading = false;

    /** { kategori: Date kapan boleh klaim lagi } untuk desainer yang sedang login. */
    async function getClaimCooldowns() {
      const out = {};
      if (!currentUser) return out;
      try {
        const { data: mine, error } = await supabaseClient
          .from('icon_projects')
          .select('*')
          .eq('designer_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(300);
        if (error || !mine) return out;

        // Klaim terakhir saya per tema, yang sudah Approved dan masih dalam masa jeda
        const now = Date.now();
        const latest = {};
        mine.forEach(p => { if (p.kategori && !latest[p.kategori]) latest[p.kategori] = p; });
        const locked = {};
        Object.values(latest).forEach(p => {
          if (p.status_admin !== 'Approved') return;
          const approvedAt = new Date(p.approved_at || p.updated_at || p.created_at).getTime();
          if (!isFinite(approvedAt)) return;
          const unlock = approvedAt + CLAIM_COOLDOWN_MS;
          if (unlock > now) locked[p.kategori] = { since: p.created_at, unlock };
        });
        const names = Object.keys(locked);
        if (!names.length) return out;

        // Sudah diselingi desainer lain setelah klaim saya? → kunci dibuka
        const oldest = names.map(k => locked[k].since).filter(Boolean).sort()[0];
        let others = [];
        if (oldest) {
          const { data: rows } = await supabaseClient
            .from('icon_projects')
            .select('kategori, designer_id, created_at')
            .in('kategori', names)
            .neq('designer_id', currentUser.id)
            .gt('created_at', oldest);
          others = rows || [];
        }
        names.forEach(k => {
          const since = new Date(locked[k].since).getTime();
          const interleaved = others.some(r => r.kategori === k && new Date(r.created_at).getTime() > since);
          if (!interleaved) out[k] = new Date(locked[k].unlock);
        });
      } catch (e) {
        console.error('Gagal memeriksa jeda klaim:', e);
      }
      return out;
    }

    /** "Senin, 23-11-2026 pukul 14:05:10" */
    function formatClaimUnlock(d) {
      const pad = (n) => String(n).padStart(2, '0');
      return `${CLAIM_DAY_NAMES[d.getDay()]}, ${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} pukul ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    /** "2h 03j 12m 05d" (hari, jam, menit, detik) */
    function formatClaimCountdown(ms) {
      const t = Math.max(0, Math.ceil(ms / 1000));
      const d = Math.floor(t / 86400), h = Math.floor(t % 86400 / 3600), m = Math.floor(t % 3600 / 60), s = t % 60;
      const pad = (n) => String(n).padStart(2, '0');
      return `${d ? d + 'h ' : ''}${pad(h)}j ${pad(m)}m ${pad(s)}d`;
    }

    /** Pesan jeda + hitung mundur yang berjalan selama dialog terbuka. */
    function showClaimCooldownAlert(kategori, unlock) {
      const title = 'Tema Sedang Jeda';
      const text = () => {
        const ms = unlock.getTime() - Date.now();
        return `Anda baru saja menyelesaikan tema "${kategori}". Agar tema ini bergiliran dengan desainer lain, Anda boleh mengklaim tema ${kategori} pada hari ${formatClaimUnlock(unlock)}, atau lebih cepat jika desainer lain mengklaim tema ini lebih dulu.\n\nSisa waktu: ${ms > 0 ? formatClaimCountdown(ms) : 'sudah bisa diklaim, silakan pilih tema ini lagi.'}`;
      };
      const done = showModalAlert(title, text(), 'warning');
      const dialog = document.getElementById('modal-custom-dialog');
      const titleEl = document.getElementById('dialog-title');
      const msgEl = document.getElementById('dialog-message');
      const timer = setInterval(() => {
        if (dialog.classList.contains('hidden') || titleEl.innerText !== title) return clearInterval(timer);
        msgEl.innerText = text();
      }, 1000);
      return done.then((r) => { clearInterval(timer); return r; });
    }

    /** Hitung mundur di kartu tema; saat habis, daftar tema dimuat ulang. */
    function startClaimCooldownTicker() {
      if (claimCooldownTimer) return;
      claimCooldownTimer = setInterval(() => {
        let expired = false;
        document.querySelectorAll('[data-claim-unlock]').forEach(el => {
          const ms = Number(el.dataset.claimUnlock) - Date.now();
          if (ms <= 0) { expired = true; return; }
          const txt = el.querySelector('.claim-cd-text');
          if (txt) txt.textContent = formatClaimCountdown(ms);
        });
        if (expired && !claimCooldownReloading) {
          claimCooldownReloading = true;
          Promise.resolve(loadThemes()).finally(() => { claimCooldownReloading = false; });
        }
      }, 1000);
    }

   async function loadThemes() {
      try {
        const { data: themes, error } = await supabaseClient.from('themes_stock').select('*');
        const grid = document.getElementById('theme-grid');
        const loadMoreContainer = document.getElementById('theme-load-more-container');

        if (error || !themes || themes.length === 0) {
          grid.innerHTML = `<div class="col-span-1 sm:col-span-2 bg-white p-6 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            Belum ada data stok tema di Supabase.
          </div>`;
          if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
          return;
        }

        themesStockMap = {};
        themes.forEach(t => { themesStockMap[t.kategori] = t; });

        // Check apakah desainer login punya tugas aktif yang belum diklik "Sudah Upload"
       // Check apakah desainer login punya tugas aktif yang belum selesai (Belum disetujui / belum dikonfirmasi upload)
// Cek apakah desainer login masih memiliki desain yang statusnya BELUM "Approved"
let hasActiveUnfinished = false;
if (currentUser) {
  const { data: activeUnfinishedList } = await supabaseClient
    .from('icon_projects')
    .select('id, status_admin')
    .eq('designer_id', currentUser.id)
    .neq('status_admin', 'Approved')
    .limit(1);

  hasActiveUnfinished = activeUnfinishedList && activeUnfinishedList.length > 0;
}
claimCooldownMap = currentUser ? await getClaimCooldowns() : {};
if (Object.keys(claimCooldownMap).length) startClaimCooldownTicker();

        // --- TAMBAHAN KODE BARU MULAI DI SINI ---
        const activeThemesOnly = themes.filter(t => t.is_active !== false);
        if (activeThemesOnly.length === 0) {
          grid.innerHTML = `<div class="col-span-1 sm:col-span-2 bg-white p-6 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            Saat ini belum ada tema aktif yang tersedia.
          </div>`;
          if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
          return;
        }
        // --- TAMBAHAN KODE BARU SELESAI ---

        let sortedThemes = activeThemesOnly.sort((a, b) => {
          const kuotaA = Number(a.sisa_kuota) || 0;
          const kuotaB = Number(b.sisa_kuota) || 0;

          if (kuotaA === 0 && kuotaB > 0) return 1;
          if (kuotaA > 0 && kuotaB === 0) return -1;
          if (kuotaB !== kuotaA) return kuotaB - kuotaA;
          return (b.id || 0) - (a.id || 0);
        });

        const visibleThemes = sortedThemes.slice(0, themeGridLimit);
        if (loadMoreContainer) {
          if (sortedThemes.length > themeGridLimit) {
            loadMoreContainer.classList.remove('hidden');
          } else {
            loadMoreContainer.classList.add('hidden');
          }
        }

        grid.innerHTML = visibleThemes.map(t => {
          let badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
          let statusTxt = t.status_stok;

          if (t.sisa_kuota <= 0 || t.status_stok === 'Habis') {
            badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
            statusTxt = "Habis";
          }

          const targetUrl = t.sample_url && t.sample_url.trim() !== '' 
            ? t.sample_url 
            : generateFlaticonSearchUrl(t.kategori);

          const sampleBtn = `
            <a href="${safeUrl(targetUrl, 'https://www.flaticon.com')}" target="_blank" rel="noopener" onclick="event.stopPropagation();" class="text-[10px] text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
              <i class="fa-solid fa-up-right-from-square"></i> Sample
            </a>
          `;

          const toolTag = t.tool_desain ? `
            <span class="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-1">
              <i class="fa-solid fa-pen-ruler text-indigo-500"></i> ${esc(t.tool_desain)}
            </span>
          ` : '';

          // Logika Tombol Klaim Berdasarkan Status Desainer & Stok
          let claimActionBtn = '';
          if (hasActiveUnfinished) {
            claimActionBtn = `
              <span class="text-slate-400 font-bold flex items-center gap-1 cursor-not-allowed text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200" title="Selesaikan tugas sebelumnya terlebih dahulu">
                <i class="fa-solid fa-lock text-slate-400"></i> Selesaikan Tugas Aktif
              </span>`;
          } else if (t.sisa_kuota <= 0 || t.status_stok === 'Habis') {
            claimActionBtn = `
              <span class="text-rose-500 font-bold flex items-center gap-1 cursor-not-allowed text-[10px]">
                Stok Habis
              </span>`;
          } else if (claimCooldownMap[t.kategori]) {
            const unlockAt = claimCooldownMap[t.kategori];
            claimActionBtn = `
              <span data-claim-unlock="${unlockAt.getTime()}" class="text-amber-700 font-bold flex items-center gap-1 cursor-not-allowed text-[10px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200 whitespace-nowrap" title="${esc('Boleh diklaim lagi: ' + formatClaimUnlock(unlockAt) + ' (atau lebih cepat jika desainer lain mengklaim tema ini)')}">
                <i class="fa-solid fa-hourglass-half"></i> Jeda <span class="claim-cd-text">${formatClaimCountdown(unlockAt.getTime() - Date.now())}</span>
              </span>`;
          } else {
            claimActionBtn = `
              <span class="text-blue-600 font-bold hover:underline flex items-center gap-1">
                Klaim Tema <i class="fa-solid fa-chevron-right text-[9px]"></i>
              </span>`;
          }

          return `
            <div onclick="selectTheme(${jsArg(t.kategori)})" class="tokopedia-card p-3.5 sm:p-4 hover:border-blue-500 cursor-pointer transition space-y-2.5">
              <div class="flex items-center justify-between gap-2">
                <h4 class="text-xs font-bold text-slate-800 min-w-0 break-words">${esc(t.kategori)}</h4>
                <span class="border px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${badgeColor}">${esc(statusTxt)} (${esc(t.sisa_kuota)} icon)</span>
              </div>
              <p class="text-[11px] text-slate-500 line-clamp-2">${esc(t.judul || 'Tidak ada judul')}</p>
              
              <div class="pt-1 flex items-center justify-between text-[11px]">
                <div class="flex items-center gap-1">
                  ${toolTag}
                  ${sampleBtn}
                </div>
                ${claimActionBtn}
              </div>
            </div>
          `;
        }).join('');
      } catch (err) {
        console.error("Error loadThemes:", err);
      }
    }

 async function selectTheme(kategori) {
      if (!currentUser) {
        await showModalAlert("Akses Ditolak", "Silakan login terlebih dahulu untuk mengklaim tema.", "warning");
        document.getElementById('modal-login').classList.remove('hidden');
        return;
      }

      // 1. Validasi Syarat Menonton Video Tutorial Wajib
      if (!isVideoRequirementMet && currentVideoList.length > 0) {
        await showModalAlert(
          "Syarat Klaim Belum Terpenuhi!", 
          "Anda wajib menonton 1 video tutorial dari awal sampai akhir tanpa skip sebelum mengambil tema baru.", 
          "warning"
        );
        switchTab('video-tutorials');
        return;
      }

     // 2. Validasi Tugas Aktif yang Statusnya Belum Approved
      const { data: activeUnfinished } = await supabaseClient
        .from('icon_projects')
        .select('id, status_admin')
        .eq('designer_id', currentUser.id)
        .neq('status_admin', 'Approved')
        .limit(1);

      if (activeUnfinished && activeUnfinished.length > 0) {
        await showModalAlert(
          "Pekerjaan Belum Selesai!",
          "Anda masih memiliki desain yang berstatus Pending Review / dalam proses pengerjaan. Tunggu hingga status menjadi 'Approved' sebelum mengklaim tema baru.",
          "warning"
        );
        return;
      }

      // 2b. Jeda klaim ulang tema yang sama (belum diselingi desainer lain & belum lewat 3 hari)
      const cooldownNow = await getClaimCooldowns();
      if (cooldownNow[kategori]) {
        await showClaimCooldownAlert(kategori, cooldownNow[kategori]);
        return;
      }

      // 3. Ambil Data Tema dari Supabase
      const { data: theme } = await supabaseClient.from('themes_stock').select('*').eq('kategori', kategori).single();
      if (!theme) return;
		if (theme.is_active === false) {
        await showModalAlert("Tema Nonaktif", "Tema ini sedang dinonaktifkan oleh Admin.", "warning");
        return;
      }
      if (theme.sisa_kuota <= 0) {
        await showModalAlert("Stok Habis", "Stok tema ini sudah tidak tersedia.", "warning");
        return;
      }

      selectedThemeData = theme;
      
      const targetSampleUrl = (theme.sample_url && theme.sample_url.trim() !== '') 
        ? theme.sample_url 
        : generateFlaticonSearchUrl(theme.kategori);

      const sampleLinkInfo = `
        <div class="pt-1">
          <a href="${safeUrl(targetSampleUrl, 'https://www.flaticon.com')}" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            <i class="fa-solid fa-up-right-from-square"></i> Lihat Sample Desain Icon
          </a>
        </div>
      `;

      const toolRequired = theme.tool_desain || 'Bebas (Wajib Rapi)';

      document.getElementById('selected-theme-info').innerHTML = `
        <div class="space-y-1.5">
          <div class="flex justify-between items-center">
            <span class="font-bold text-slate-800 text-xs">${esc(theme.kategori)}</span>
            <span class="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">Sisa ${esc(theme.sisa_kuota)} Icon</span>
          </div>
          <div class="text-[11px] bg-indigo-50 border border-indigo-200 text-indigo-900 p-2 rounded-lg font-bold flex items-center gap-1.5">
            <i class="fa-solid fa-screwdriver-wrench text-indigo-600"></i> Tool Ketentuan Admin: <span class="text-indigo-700 underline">${esc(toolRequired)}</span>
          </div>
          ${sampleLinkInfo}
        </div>
      `;

      // Set Tool Desain
      const toolSelectEl = document.getElementById('input-tool-desain');
      if (toolSelectEl) {
        toolSelectEl.value = theme.tool_desain || 'Bebas (Wajib Rapi)';
      }

      // Deteksi & Kunci Jenis Icon Automatis
      const jenisIconSelect = document.getElementById('input-jenis-icon');
      const katLower = theme.kategori.toLowerCase();

      if (katLower.includes('flat')) {
        jenisIconSelect.value = 'flat';
        jenisIconSelect.disabled = true;
      } else if (katLower.includes('line')) {
        jenisIconSelect.value = 'line';
        jenisIconSelect.disabled = true;
      } else if (katLower.includes('glyph')) {
        jenisIconSelect.value = 'glyph';
        jenisIconSelect.disabled = true;
      } else {
        jenisIconSelect.disabled = false;
      }

    
     // Set Judul
document.getElementById('txt-judul').innerText = theme.judul || '-';

// Mengacak (Shuffle) Urutan Keyword setiap kali tema diklaim/dipilih
let originalKeywordStr = theme.keyword || '-';
if (originalKeywordStr !== '-') {
  // Pisahkan string berdasarkan koma, hilangkan spasi berlebih di tiap kata kunci
  let keywordArr = originalKeywordStr.split(',').map(k => k.trim()).filter(k => k !== '');
  
  // Acak urutannya
  let shuffledArr = shuffleArray(keywordArr);
  
  // Gabungkan kembali dengan pemisah koma dan spasi ", "
  document.getElementById('txt-keyword').innerText = shuffledArr.join(', ');
} else {
  document.getElementById('txt-keyword').innerText = '-';
}
      
      const checkConfirm = document.getElementById('check-confirm-claim');
      const checkQuality = document.getElementById('check-confirm-quality');
      
      if (checkConfirm) checkConfirm.checked = false;
      if (checkQuality) checkQuality.checked = false;
      
      document.getElementById('btn-submit-claim').disabled = true;
      document.getElementById('form-claim').classList.remove('hidden');
      applyUploadTypeRule();

      toggleIconTypeColorLogic();

      const formContainer = document.getElementById('form-claim-container');
      if (formContainer) {
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    /* ---------- Aturan jasa desain & reward upload ke Canva ---------- */
    // Berlaku untuk proyek yang DIKLAIM mulai tanggal ini (setelah gajian tanggal 28 November 2026).
    // Sebelumnya: dibantu upload → jasa dipotong Rp250/icon; mandiri tanpa reward.
    // Mulai tanggal ini: jasa penuh (Lvl 2: 750/450, Lvl 3: 2500/1500) + reward Rp250/icon
    // untuk yang meng-upload ke Canva (pembantu, atau desainer sendiri jika mandiri).
    const FEE_NEW_RULE_FROM = new Date('2026-11-29T00:00:00+07:00').getTime();
    // Level 2 wajib dibantu upload desainer lain (false = upload mandiri dibuka lagi).
    const LEVEL2_MUST_BE_HELPED = true;
    const UPLOAD_REWARD_PER_ICON = 250;

    function isNewFeeRule(p) {
      const t = new Date(p && p.created_at).getTime();
      return isFinite(t) && t >= FEE_NEW_RULE_FROM;
    }

    /** Tarif jasa desain per icon { app, rej } untuk proyek p. */
    function designFeeRates(level, p) {
      let app = (Number(level) === 3) ? 2500 : 750;
      let rej = (Number(level) === 3) ? 1500 : 450;
      const helped = p.uploader_id && p.uploader_id !== p.designer_id;
      if (helped && !isNewFeeRule(p)) { app -= 250; rej -= 250; } // aturan lama
      return { app, rej };
    }

    /** Siapa yang mendapat reward upload proyek p (id desainer) atau null. */
    function uploadRewardOwner(p) {
      if (p.uploader_id) return p.uploader_id;
      return isNewFeeRule(p) ? p.designer_id : null;
    }

    /** Nilai reward upload proyek p (icon diterima + ditolak × Rp250). */
    function uploadRewardOf(p) {
      const total = Number(p.jumlah_icon) || 0;
      const rej = Number(p.rejected_count) || 0;
      const rev = Number(p.in_review_count) || 0;
      const app = Math.max(0, total - (rej + rev));
      return (app + rej) * UPLOAD_REWARD_PER_ICON;
    }

    function level2MustBeHelped(level) {
      return LEVEL2_MUST_BE_HELPED && Number(level) === 2; // berlaku segera (pengumuman); tarif ikut FEE_NEW_RULE_FROM
    }

    async function getMyDesignerLevel() {
      if (!currentUser) return 2;
      try {
        const { data } = await supabaseClient.from('profiles').select('level').eq('id', currentUser.id).maybeSingle();
        if (data && data.level) { userLevelsMap[currentUser.id] = data.level; return Number(data.level); }
      } catch (e) {}
      return Number(userLevelsMap[currentUser.id] || 2);
    }

    /** Form klaim: Level 2 wajib "Dibantu Desainer Lain"; label pembantu sesuai aturan yang berlaku. */
    async function applyUploadTypeRule() {
      const sel = document.getElementById('input-upload-type');
      if (!sel || !currentUser) return;
      const label = document.getElementById('uploader-select-label');
      if (label) label.textContent = 'Pilih Desainer Pembantu';
      const must = level2MustBeHelped(await getMyDesignerLevel());
      const opt = sel.querySelector('option[value="sendiri"]');
      if (opt) {
        opt.disabled = must;
        opt.textContent = must ? 'Upload Sendiri (Mandiri) — tidak tersedia untuk Level 2' : 'Upload Sendiri (Mandiri)';
      }
      if (must) sel.value = 'bantuan';
      let note = document.getElementById('upload-type-rule-note');
      if (!note) {
        note = document.createElement('p');
        note.id = 'upload-type-rule-note';
        note.className = 'text-[10px] text-amber-700 font-semibold mt-1';
        note.textContent = 'Desainer Level 2 wajib dibantu upload ke Canva oleh desainer lain.';
        sel.insertAdjacentElement('afterend', note);
      }
      note.classList.toggle('hidden', !must);
      toggleUploaderSelect();
    }

    /* ---------- Kartu "Tema Aktif" di Overview admin ---------- */
    const TEMA_AKTIF_MENIPIS = 10;     // ≤ angka ini → peringatan "Menipis"
    const KUOTA_HAMPIR_HABIS = 12;     // sisa kuota ≤ angka ini (± 1 paket) → dihitung "hampir habis"

    function isThemeActive(t) {
      return (Number(t.sisa_kuota) || 0) > 0 && t.status_stok !== 'Habis' && t.is_active !== false;
    }

    function renderActiveThemesCard(themes) {
      const total = themes.length;
      const aktif = themes.filter(isThemeActive);
      const n = aktif.length;
      const hampir = aktif.filter(t => (Number(t.sisa_kuota) || 0) <= KUOTA_HAMPIR_HABIS).length;
      const lvl = n === 0 ? 'habis' : (n <= TEMA_AKTIF_MENIPIS ? 'menipis' : 'aman');
      const look = {
        aman: { color: '#059669', bar: '#10b981', badgeBg: '#ecfdf5', badgeTx: '#047857', label: 'Aman', border: '#e2e8f0' },
        menipis: { color: '#d97706', bar: '#f59e0b', badgeBg: '#fffbeb', badgeTx: '#b45309', label: 'Menipis – segera tambah tema', border: '#fcd34d' },
        habis: { color: '#e11d48', bar: '#f43f5e', badgeBg: '#fff1f2', badgeTx: '#be123c', label: 'Habis – tambah tema baru', border: '#fda4af' }
      }[lvl];
      const card = document.getElementById('ov-aktif-card');
      if (!card) return;
      card.style.borderColor = look.border;
      const val = document.getElementById('ov-aktif');
      val.style.color = look.color;
      val.innerHTML = `${n} <span class="text-[10px] text-slate-400 font-normal">/ ${total} tema</span>`;
      const badge = document.getElementById('ov-aktif-badge');
      badge.textContent = look.label;
      badge.style.background = look.badgeBg;
      badge.style.color = look.badgeTx;
      const bar = document.getElementById('ov-aktif-bar');
      bar.style.width = (total ? Math.round(n / total * 100) : 0) + '%';
      bar.style.background = look.bar;
      document.getElementById('ov-aktif-note').innerHTML = hampir
        ? `<i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b"></i> <b>${hampir}</b> tema aktif hampir habis (sisa ≤ ${KUOTA_HAMPIR_HABIS} icon). ${total - n} tema sudah habis.`
        : `${total - n} tema sudah habis. Tidak ada tema aktif yang hampir habis.`;
      const btn = document.getElementById('btn-ov-aktif-lihat');
      if (btn && !btn.dataset.bound) {
        btn.dataset.bound = '1';
        btn.addEventListener('click', () => {
          switchTab('my-dashboard');
          setTimeout(() => {
            const tb = document.getElementById('admin-themes-body');
            if (tb) tb.closest('table')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        });
      }
    }

    async function loadAdminOverviewData() {
      try {
        const startDate = document.getElementById('overview-start-date').value;
        const endDate = document.getElementById('overview-end-date').value;

        if (!startDate || !endDate) return;

        const startISO = new Date(startDate + "T00:00:00").toISOString();
        const endISO = new Date(endDate + "T23:59:59").toISOString();

        const { data: projects } = await supabaseClient
          .from('icon_projects')
          .select('*')
          .gte('created_at', startISO)
          .lte('created_at', endISO);

        const { data: themes } = await supabaseClient.from('themes_stock').select('*');

        let totalApproved = 0;
        let totalRejected = 0;
        let totalInReview = 0;
        let totalPengeluaran = 0;
        let designerStats = {};

        if (projects) {
          projects.forEach(p => {
            const total = Number(p.jumlah_icon) || 0;
            const rej = Number(p.rejected_count) || 0;
            const rev = Number(p.in_review_count) || 0;
            const app = Math.max(0, total - (rej + rev));

            totalApproved += app;
            totalRejected += rej;
            totalInReview += rev;

            if (p.status_admin === 'Approved') {
              const desainerLevel = userLevelsMap[p.designer_id] || 2;
              
              const { app: tarifApp, rej: tarifRej } = designFeeRates(desainerLevel, p);

              const salaryThisProj = (app * tarifApp) + (rej * tarifRej);
              totalPengeluaran += salaryThisProj;

              if (!designerStats[p.designer_id]) designerStats[p.designer_id] = 0;
              designerStats[p.designer_id] += app;
            }

            if (p.status_admin === 'Approved' && uploadRewardOwner(p)) {
              totalPengeluaran += uploadRewardOf(p);
            }
          });

          Object.keys(designerStats).forEach(dId => {
            const count = designerStats[dId];
            if (count >= 100 && count <= 199) totalPengeluaran += 50000;
            else if (count >= 200 && count <= 299) totalPengeluaran += 120000;
            else if (count >= 300) totalPengeluaran += 200000;
          });
        }

        let totalSisaStok = 0;
        if (themes) {
          themes.forEach(t => totalSisaStok += (Number(t.sisa_kuota) || 0));
        }

        const totalDesainerAktif = Object.keys(userProfilesMap).length;

        document.getElementById('ov-approved').innerHTML = `${totalApproved} <span class="text-[10px] text-slate-400 font-normal">icon</span>`;
        document.getElementById('ov-rejected').innerHTML = `${totalRejected} <span class="text-[10px] text-slate-400 font-normal">icon</span>`;
        document.getElementById('ov-review').innerHTML = `${totalInReview} <span class="text-[10px] text-slate-400 font-normal">icon</span>`;
        document.getElementById('ov-desainer').innerHTML = `${totalDesainerAktif} <span class="text-[10px] text-slate-400 font-normal">orang</span>`;
        document.getElementById('ov-tema').innerHTML = `${themes ? themes.length : 0} <span class="text-[10px] text-slate-400 font-normal">tema</span>`;
        document.getElementById('ov-sisa-tema').innerHTML = `${totalSisaStok} <span class="text-[10px] text-slate-400 font-normal">icon</span>`;
        renderActiveThemesCard(themes || []);
        document.getElementById('ov-total-pengeluaran').innerText = `Rp ${totalPengeluaran.toLocaleString('id-ID')}`;

        renderOverviewDesignersTable();
      } catch (err) {
        console.error("Error loadAdminOverviewData:", err);
      }
    }

    async function loadDesignerAnalyticsData() {
      const selectedDesignerId = document.getElementById('analytics-select-designer').value;
      const startDate = document.getElementById('analytics-start-date').value;
      const endDate = document.getElementById('analytics-end-date').value;

      if (!selectedDesignerId) {
        await showModalAlert("Peringatan", "Silakan pilih desainer terlebih dahulu.", "warning");
        return;
      }
		await loadDesignerVideoProgressAnalytics(selectedDesignerId);
      const startISO = new Date(startDate + "T00:00:00").toISOString();
      const endISO = new Date(endDate + "T23:59:59").toISOString();

      const { data: projects, error } = await supabaseClient
        .from('icon_projects')
        .select('*')
        .eq('designer_id', selectedDesignerId)
        .gte('created_at', startISO)
        .lte('created_at', endISO);

      const tbody = document.getElementById('analytics-table-body');

      if (error || !projects || projects.length === 0) {
        tbody.innerHTML = `<tr><td class="p-4 text-center text-slate-400" colspan="8">Tidak ada data pengerjaan untuk desainer ini pada rentang tanggal tersebut.</td></tr>`;
        document.getElementById('an-total-tema').innerHTML = `0 <span class="text-[10px] text-slate-400 font-normal">tema</span>`;
        document.getElementById('an-total-icon').innerHTML = `0 <span class="text-[10px] text-slate-400 font-normal">icon</span>`;
        document.getElementById('an-approved').innerText = `0`;
        document.getElementById('an-rejected').innerText = `0`;
        document.getElementById('an-review').innerText = `0`;
        document.getElementById('an-total-pendapatan').innerText = `Rp 0`;
        document.getElementById('an-breakdown-pendapatan').innerText = `*Gaji + R1 + R2`;

        analyticsProjectsData = [];
        updateCheckedSummaryCards();
        renderKinerjaChart([], []);
        return;
      }

      const uniqueThemes = new Set(projects.map(p => p.kategori));
      let totalTema = uniqueThemes.size;

      let totalIcon = 0;
      let totalApp = 0;
      let totalRej = 0;
      let totalRev = 0;
      let hasilDesainRp = 0;

      const designerLevel = userLevelsMap[selectedDesignerId] || 2;
      let weeklyDataMap = {};

      analyticsProjectsData = projects.map(p => {
        const total = Number(p.jumlah_icon) || 0;
        const rej = Number(p.rejected_count) || 0;
        const rev = Number(p.in_review_count) || 0;
        const app = Math.max(0, total - (rej + rev));

        totalIcon += total;
        totalApp += app;
        totalRej += rej;
        totalRev += rev;

        if (p.status_admin === 'Approved') {
          const { app: tarifApp, rej: tarifRej } = designFeeRates(designerLevel, p);

          hasilDesainRp += (app * tarifApp) + (rej * tarifRej);
        }

        const d = new Date(p.created_at);
        const day = d.getDay();
        const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
        const mondayObj = new Date(d.setDate(diffToMonday));
        
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const weekLabel = `${monthNames[mondayObj.getMonth()]} ${mondayObj.getDate()}`;

        if (!weeklyDataMap[weekLabel]) {
          weeklyDataMap[weekLabel] = { totalIcon: 0, approvedIcon: 0 };
        }
        weeklyDataMap[weekLabel].totalIcon += total;
        weeklyDataMap[weekLabel].approvedIcon += app;

        return {
          ...p,
          approved_calc: app,
          in_review_count: rev,
          rejected_count: rej
        };
      });

      let reward1 = 0;
      const { data: helpUploads } = await supabaseClient
        .from('icon_projects')
        .select('*')
        .or(`uploader_id.eq.${selectedDesignerId},designer_id.eq.${selectedDesignerId}`)
        .eq('status_admin', 'Approved')
        .gte('created_at', startISO)
        .lte('created_at', endISO);

      if (helpUploads) {
        helpUploads.forEach(h => {
          if (uploadRewardOwner(h) === selectedDesignerId) reward1 += uploadRewardOf(h);
        });
      }

      let reward2 = 0;
      if (totalApp >= 100 && totalApp <= 199) reward2 = 50000;
      else if (totalApp >= 200 && totalApp <= 299) reward2 = 120000;
      else if (totalApp >= 300) reward2 = 200000;

      const totalPendapatan = hasilDesainRp + reward1 + reward2;

      document.getElementById('an-total-tema').innerHTML = `${totalTema} <span class="text-[10px] text-slate-400 font-normal">tema</span>`;
      document.getElementById('an-total-icon').innerHTML = `${totalIcon} <span class="text-[10px] text-slate-400 font-normal">icon</span>`;
      document.getElementById('an-approved').innerText = totalApp;
      document.getElementById('an-rejected').innerText = totalRej;
      document.getElementById('an-review').innerText = totalRev;
      document.getElementById('an-total-pendapatan').innerText = `Rp ${totalPendapatan.toLocaleString('id-ID')}`;
      document.getElementById('an-breakdown-pendapatan').innerText = `*Gaji: Rp ${hasilDesainRp.toLocaleString('id-ID')} | R1: Rp ${reward1.toLocaleString('id-ID')} | R2: Rp ${reward2.toLocaleString('id-ID')}`;

      renderAnalyticsTable();

      const chartLabels = Object.keys(weeklyDataMap);
      const chartTotalData = chartLabels.map(lbl => weeklyDataMap[lbl].totalIcon);
      const chartApprovedData = chartLabels.map(lbl => weeklyDataMap[lbl].approvedIcon);

      renderKinerjaChart(chartLabels, chartTotalData, chartApprovedData);
    }

async function loadDesignerVideoProgressAnalytics(designerId) {
      const usageTxt = document.getElementById('an-video-usage-text');
      const progressBar = document.getElementById('an-video-progress-bar');
      const percentTxt = document.getElementById('an-video-percentage');
      const statusLabel = document.getElementById('an-video-status-label');

      if (!usageTxt || !progressBar || !percentTxt || !statusLabel) return;

      // Reset tampilan ke state memuat setiap kali filter diterapkan
      usageTxt.innerText = 'Memuat...';
      progressBar.style.width = '0%';
      percentTxt.innerText = '0%';
      statusLabel.innerText = 'Memeriksa progress...';

      try {
        const cleanDesignerId = String(designerId || '').trim();
        const [
          { data: videos, error: videoErr },
          { data: progress, error: progErr }
        ] = await Promise.all([
          supabaseClient.from('tutorial_videos').select('id'),
          supabaseClient
            .from('user_video_progress')
            .select('video_id, is_completed')
            .eq('user_id', cleanDesignerId)
            .eq('is_completed', true)
        ]);

        if (videoErr) throw videoErr;
        if (progErr) console.warn('Warning baca user_video_progress:', progErr.message);

        const totalVideos = videos ? videos.length : 0;
        const validVideoIds = new Set(videos ? videos.map(v => String(v.id)) : []);
        const completedCount = progress
          ? new Set(
              progress
                .filter(p => validVideoIds.has(String(p.video_id)))
                .map(p => String(p.video_id))
            ).size
          : 0;

        const percent = totalVideos > 0 ? Math.min(100, Math.round((completedCount / totalVideos) * 100)) : 0;

        usageTxt.innerText = `${completedCount} / ${totalVideos} Video`;
        progressBar.style.width = `${percent}%`;
        percentTxt.innerText = `${percent}%`;

        if (totalVideos === 0) {
          statusLabel.innerText = 'Belum ada modul video';
          progressBar.className = 'bg-slate-400 h-2 rounded-full transition-all duration-500';
          percentTxt.className = 'font-bold text-slate-500';
        } else if (completedCount >= totalVideos) {
          statusLabel.innerText = 'Tuntas Semua Video';
          progressBar.className = 'bg-emerald-500 h-2 rounded-full transition-all duration-500';
          percentTxt.className = 'font-bold text-emerald-600';
        } else {
          statusLabel.innerText = `Sisa ${totalVideos - completedCount} video lagi`;
          progressBar.className = 'bg-purple-600 h-2 rounded-full transition-all duration-500';
          percentTxt.className = 'font-bold text-purple-600';
        }
      } catch (err) {
        console.error('Gagal memuat progress video desainer:', err);
        usageTxt.innerText = 'Error';
        statusLabel.innerText = 'Gagal memuat data';
      }
    }

    function renderAnalyticsTable() {
      const tbody = document.getElementById('analytics-table-body');
      if (!tbody) return;

      if (!analyticsProjectsData || analyticsProjectsData.length === 0) {
        tbody.innerHTML = `<tr><td class="p-4 text-center text-slate-400" colspan="8">Tidak ada data pengerjaan.</td></tr>`;
        updateCheckedSummaryCards();
        return;
      }

      let sortedData = sortArrayData([...analyticsProjectsData], analyticsSortCol, analyticsSortDir);
      updateSortHeaderIcons('sort-icon-an', analyticsSortCol, analyticsSortDir, ['created_at', 'kategori', 'jumlah_icon', 'approved_calc', 'rejected_count', 'in_review_count', 'status_admin']);

      const checkAllHeader = document.getElementById('check-all-analytics');
      if (checkAllHeader) checkAllHeader.checked = false;

      tbody.innerHTML = sortedData.map(p => {
        const dateStr = formatFullDateTime(p.created_at);
        const total = Number(p.jumlah_icon) || 0;
        const app = Number(p.approved_calc) || 0;
        const rej = Number(p.rejected_count) || 0;
        const rev = Number(p.in_review_count) || 0;

        let statusBadge = `<span class="bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-bold">Pending</span>`;
        if (p.status_admin === 'Approved') {
          statusBadge = `<span class="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">Approved</span>`;
        } else if (p.status_admin === 'Rejected') {
          statusBadge = `<span class="bg-rose-50 text-rose-600 px-2 py-0.5 rounded font-bold">Rejected</span>`;
        }

        const toolBadge = p.tool_desain ? `<div class="text-[9px] text-indigo-600 font-semibold mt-0.5"><i class="fa-solid fa-pen-ruler"></i> ${esc(p.tool_desain)}</div>` : '';

        return `
          <tr class="hover:bg-indigo-50/30 transition">
            <td class="p-3 text-center">
              <input type="checkbox" class="an-row-checkbox w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer" 
                data-total="${total}" data-approved="${app}" data-rejected="${rej}" data-review="${rev}" onclick="updateCheckedSummaryCards()"/>
            </td>
            <td class="p-3 text-slate-500 font-medium">${dateStr}</td>
            <td class="p-3 font-bold text-indigo-700">
              ${esc(p.kategori)}
              ${toolBadge}
            </td>
            <td class="p-3 text-center font-bold">${total}</td>
            <td class="p-3 text-center font-bold text-emerald-600">${app}</td>
            <td class="p-3 text-center font-bold text-rose-600">${rej}</td>
            <td class="p-3 text-center font-bold text-amber-500">${rev}</td>
            <td class="p-3 text-center">${statusBadge}</td>
          </tr>
        `;
      }).join('');

      updateCheckedSummaryCards();
    }

    function toggleSelectAllAnalytics(masterCheck) {
      const checkboxes = document.querySelectorAll('.an-row-checkbox');
      checkboxes.forEach(cb => cb.checked = masterCheck.checked);
      updateCheckedSummaryCards();
    }

    function updateCheckedSummaryCards() {
      const checkedBoxes = document.querySelectorAll('.an-row-checkbox:checked');
      
      let sumTotal = 0;
      let sumApproved = 0;
      let sumRejected = 0;
      let sumReview = 0;

      checkedBoxes.forEach(cb => {
        sumTotal += parseInt(cb.getAttribute('data-total')) || 0;
        sumApproved += parseInt(cb.getAttribute('data-approved')) || 0;
        sumRejected += parseInt(cb.getAttribute('data-rejected')) || 0;
        sumReview += parseInt(cb.getAttribute('data-review')) || 0;
      });

      document.getElementById('cnt-checked-rows').innerText = checkedBoxes.length;
      document.getElementById('cnt-total-icon').innerText = sumTotal;
      document.getElementById('cnt-approved').innerText = sumApproved;
      document.getElementById('cnt-rejected').innerText = sumRejected;
      document.getElementById('cnt-review').innerText = sumReview;
    }

    function renderKinerjaChart(labels, totalData, approvedData) {
      const ctx = document.getElementById('chartKinerejaPekanan').getContext('2d');

      if (kinerjaChartInstance) {
        kinerjaChartInstance.destroy();
      }

      kinerjaChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              type: 'line',
              label: 'Approved Icon',
              data: approvedData,
              borderColor: '#ff3b30',
              borderWidth: 2,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#ff3b30',
              pointRadius: 4,
              tension: 0.2,
              yAxisID: 'y'
            },
            {
              type: 'bar',
              label: 'Total Icon Dibuat',
              data: totalData,
              backgroundColor: '#2563eb',
              borderRadius: 4,
              barPercentage: 0.5,
              yAxisID: 'y'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'top' }
          },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: '#f1f5f9' } }
          }
        }
      });
    }

    async function renderOverviewDesignersTable() {
      try {
        const { data: profiles } = await supabaseClient.from('profiles').select('*');
        const tbody = document.getElementById('overview-designers-body');
        const loadMoreContainer = document.getElementById('overview-designers-load-more-container');

        if (!profiles || profiles.length === 0) {
          tbody.innerHTML = `<tr><td class="p-4 text-center text-slate-400" colspan="5">Belum ada desainer terdaftar.</td></tr>`;
          if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
          return;
        }

        let formattedProfiles = profiles.map(u => ({
          ...u,
          level: u.level || 2,
          last_seen: u.last_seen || null,
          email: u.email || userEmailsMap[u.id] || `${u.full_name.toLowerCase().replace(/\s+/g, '')}@gmail.com`
        }));

        formattedProfiles = sortArrayData(formattedProfiles, overviewSortCol, overviewSortDir);
        updateSortHeaderIcons('sort-icon-overview', overviewSortCol, overviewSortDir, ['full_name', 'email', 'level', 'role']);

        const visibleProfiles = formattedProfiles.slice(0, overviewDesignersTableLimit);
        if (loadMoreContainer) {
          if (formattedProfiles.length > overviewDesignersTableLimit) {
            loadMoreContainer.classList.remove('hidden');
          } else {
            loadMoreContainer.classList.add('hidden');
          }
        }

        tbody.innerHTML = visibleProfiles.map(u => {
          let roleBadge = `<span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold text-[10px]">Desainer</span>`;
          if (u.role === 'admin') {
            roleBadge = `<span class="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold text-[10px]">Manager</span>`;
          }

          let levelBadge = u.level === 3 
            ? `<span class="inline-block whitespace-nowrap bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">Lvl 3</span>`
            : `<span class="inline-block whitespace-nowrap bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">Lvl 2</span>`;

          const nowSecs = Math.floor(Date.now() / 1000);
          const lastSeenSecs = u.last_seen ? Math.floor(new Date(u.last_seen).getTime() / 1000) : 0;
          const isOnline = u.last_seen && (nowSecs - lastSeenSecs) < 120;

          const onlineStatusBadge = isOnline 
            ? `<span class="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
               </span>`
            : `<span class="inline-flex items-center gap-1 text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> ${formatTimeAgo(u.last_seen)}
               </span>`;

          return `
            <tr class="hover:bg-slate-50 transition">
              <td class="p-3 font-bold text-slate-800">
                <div class="flex items-center gap-2">
                  <span>${esc(u.full_name)}</span>
                  ${onlineStatusBadge}
                </div>
              </td>
              <td class="p-3 text-blue-600 text-[11px] font-semibold break-all">${esc(u.email)}</td>
              <td class="p-3 text-center">${levelBadge}</td>
              <td class="p-3 text-center">${roleBadge}</td>
              <td class="p-3 text-center whitespace-nowrap">
                <div class="flex items-center justify-center gap-1.5">
                  <button onclick="toggleCanHelpUpload(${jsArg(u.id)}, ${u.can_help_upload ? 'true' : 'false'})" class="${u.can_help_upload ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-500'} p-2 rounded text-[10px] font-bold shadow-sm flex items-center justify-center" title="${u.can_help_upload ? 'Boleh bantu upload (aktif) · klik untuk menonaktifkan' : 'Belum boleh bantu upload · klik untuk mengaktifkan'}">
                    <i class="fa-solid fa-handshake-angle"></i>
                  </button>
                  <button onclick="openEditUserModal(${jsArg(u.id)}, ${jsArg(u.full_name)}, ${jsArg(u.email)}, ${jsArg(u.role || 'designer')}, ${Number(u.level) || 2})" class="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded text-[10px] font-bold shadow-sm flex items-center justify-center" title="Edit Profil">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button onclick="deleteUserProfile(${jsArg(u.id)}, ${jsArg(u.full_name)})" class="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded text-[10px] font-bold shadow-sm flex items-center justify-center" title="Hapus">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      } catch (err) {
        console.error("Error renderOverviewDesignersTable:", err);
      }
    }

    function openEditUserModal(id, fullName, email, role, level = 2) {
      document.getElementById('edit-user-id').value = id;
      document.getElementById('edit-fullname').value = fullName;
      document.getElementById('edit-email').value = email;
      document.getElementById('edit-role').value = role;
      document.getElementById('edit-level').value = level;
      document.getElementById('edit-password').value = '';

      document.getElementById('modal-edit-user').classList.remove('hidden');
    }

    function openEditProjectModal(id, targetBelajar, toolDesain, jumlahIcon, uploaderId, designerId) {
      document.getElementById('edit-proj-id').value = id;
      document.getElementById('edit-proj-target').value = targetBelajar;
      document.getElementById('edit-proj-tool').value = toolDesain || 'Figma';
      document.getElementById('edit-proj-jumlah').value = jumlahIcon;

      const selectUploader = document.getElementById('edit-proj-uploader-id');
      if (selectUploader) {
        let options = `<option value="">Upload Sendiri (Mandiri - Tidak Ada Pembantu)</option>`;
        
        Object.keys(userProfilesMap).forEach(dId => {
          if (dId !== designerId) {
            options += `<option value="${esc(dId)}">${esc(userProfilesMap[dId])}</option>`;
          }
        });

        selectUploader.innerHTML = options;
        selectUploader.value = uploaderId || '';
      }

      document.getElementById('modal-edit-project').classList.remove('hidden');
    }

    function closeEditProjectModal() {
      const modal = document.getElementById('modal-edit-project');
      if (modal) {
        modal.classList.add('hidden');
      }
    }

    document.getElementById('form-edit-project').addEventListener('submit', async function(e) {
      e.preventDefault();
      const id = document.getElementById('edit-proj-id').value;
      const targetBelajar = document.getElementById('edit-proj-target').value.trim();
      const toolDesain = document.getElementById('edit-proj-tool').value;
      const jumlahIcon = parseInt(document.getElementById('edit-proj-jumlah').value) || 0;
      const uploaderId = document.getElementById('edit-proj-uploader-id').value || null;

      const isUploadSendiri = !uploaderId;

      const btnSub = document.getElementById('btn-submit-edit-proj');
      btnSub.disabled = true;
      btnSub.innerText = "Menyimpan...";

      try {
        const { error } = await supabaseClient.from('icon_projects').update({
          target_belajar: targetBelajar,
          tool_desain: toolDesain,
          jumlah_icon: jumlahIcon,
          in_review_count: jumlahIcon,
          uploader_id: uploaderId,
          is_upload_sendiri: isUploadSendiri,
          updated_at: new Date().toISOString()
        }).eq('id', id);

        if (error) throw error;

        await showModalAlert("Berhasil", "Detail laporan dan info uploader berhasil diperbarui!", "success");
        document.getElementById('modal-edit-project').classList.add('hidden');
        
        loadAdminProjects();
        if (isAdminUser) loadAdminOverviewData();
      } catch (err) {
        await showModalAlert("Gagal Update", err.message, "error");
      } finally {
        btnSub.disabled = false;
        btnSub.innerText = "Simpan Perubahan";
      }
    });

    async function handleUpdateUserProfile(e) {
      e.preventDefault();
      const id = document.getElementById('edit-user-id').value;
      const fullName = document.getElementById('edit-fullname').value.trim();
      const role = document.getElementById('edit-role').value;
      const level = parseInt(document.getElementById('edit-level').value) || 2;
      const password = document.getElementById('edit-password').value;

      const btnSub = document.getElementById('btn-submit-edit-user');
      btnSub.disabled = true;
      btnSub.innerText = "Menyimpan...";

      try {
        const { error: errProfile } = await supabaseClient.from('profiles').update({
          full_name: fullName,
          role: role,
          level: level
        }).eq('id', id);

        if (errProfile) throw errProfile;

        if (password) {
          if (password.length < 6) {
            await showModalAlert("Validasi Gagal", "Password minimal 6 karakter!", "warning");
            btnSub.disabled = false;
            btnSub.innerText = "Simpan Perubahan";
            return;
          }
          await supabaseAdminNoSession.auth.admin.updateUserById(id, { password: password });
        }

        userLevelsMap[id] = level;

        await showModalAlert("Disimpan", "Profil desainer berhasil diperbarui!", "success");
        document.getElementById('modal-edit-user').classList.add('hidden');

        await loadUsersList();
        await renderOverviewDesignersTable();
        await loadAdminProjects();
        if (isAdminUser) loadAdminOverviewData();
      } catch (err) {
        await showModalAlert("Gagal Update", err.message, "error");
      } finally {
        btnSub.disabled = false;
        btnSub.innerText = "Simpan Perubahan";
      }
    }

    async function deleteUserProfile(id, name) {
      const confirmed = await showModalConfirm(
        "Konfirmasi Hapus", 
        `Yakin ingin menghapus desainer "${name}"?`
      );

      if (confirmed) {
        try {
          await supabaseClient.from('icon_projects').delete().or(`designer_id.eq.${id},uploader_id.eq.${id}`);
          
          const { error: errProfile } = await supabaseClient.from('profiles').delete().eq('id', id);
          if (errProfile) throw errProfile;

          try {
            await supabaseAdminNoSession.auth.admin.deleteUser(id);
          } catch(e) {}

          delete userProfilesMap[id];
          delete userLevelsMap[id];
          delete userEmailsMap[id];
          delete userLastSeenMap[id];

          await showModalAlert("Terhapus", `Desainer "${name}" dihapus!`, "success");
          await loadUsersList();
          await renderOverviewDesignersTable();
          await loadAdminProjects();
          if (isAdminUser) loadAdminOverviewData();
        } catch(err) {
          await showModalAlert("Gagal Hapus", err.message, "error");
        }
      }
    }

   async function loadAdminThemesTable(silent = false) {
      const tbody = document.getElementById('admin-themes-body');
      if (!tbody) return;

      if (!silent && allAdminThemesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="p-4 text-center text-slate-400">Memuat stok tema...</td></tr>';
      }

      try {
        const { data: themes, error } = await supabaseClient.from('themes_stock').select('*');
        if (error) throw error;

        if (!themes || themes.length === 0) {
          allAdminThemesData = [];
          tbody.innerHTML = `<tr><td class="p-4 text-center text-slate-400" colspan="7">Belum ada stok tema.</td></tr>`;
          document.getElementById('total-theme-count').innerText = "0 Tema";
          const loadMoreContainer = document.getElementById('themes-load-more-container');
          if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
          return;
        }

        allAdminThemesData = themes;
        renderAdminThemesTable();
      } catch (err) {
        console.error("Error loadAdminThemesTable:", err);
        tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-rose-500 font-bold">Gagal memuat data: ${esc(err.message)}</td></tr>`;
      }
    }

    function filterAdminThemesTable() {
      themesTableLimit = 10;
      renderAdminThemesTable();
    }

    let themeStatusFilter = 'all';
    try { const f = localStorage.getItem('kd-theme-status-filter'); if (f === 'active' || f === 'inactive') themeStatusFilter = f; } catch (e) {}
    function setThemeStatusFilter(f) {
      themeStatusFilter = (f === 'active' || f === 'inactive') ? f : 'all';
      try { localStorage.setItem('kd-theme-status-filter', themeStatusFilter); } catch (e) {}
      filterAdminThemesTable();
    }
    function updateThemeStatusFilterUI(counts) {
      document.querySelectorAll('#theme-status-filter .tsf-btn').forEach(b => {
        const on = b.dataset.f === themeStatusFilter;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.classList.toggle('bg-white', on);
        b.classList.toggle('text-blue-700', on);
        b.classList.toggle('shadow-sm', on);
        b.classList.toggle('text-slate-500', !on);
        b.classList.toggle('hover:text-slate-800', !on);
      });
      ['all', 'active', 'inactive'].forEach(k => { const el = document.getElementById('tsf-n-' + k); if (el) el.textContent = counts[k]; });
      const title = document.getElementById('admin-themes-title');
      if (title) title.textContent = themeStatusFilter === 'active' ? 'Daftar Tema Aktif' : themeStatusFilter === 'inactive' ? 'Daftar Tema Nonaktif' : 'Daftar Stok Tema';
    }

    function renderAdminThemesTable() {
      const tbody = document.getElementById('admin-themes-body');
      const loadMoreContainer = document.getElementById('themes-load-more-container');
      if (!tbody) return;

      const searchInput = document.getElementById('input-search-admin-themes');
      const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

      let filteredThemes = allAdminThemesData.filter(t => {
        const kategori = (t.kategori || '').toLowerCase();
        const judul = (t.judul || '').toLowerCase();
        const keyword = (t.keyword || '').toLowerCase();
        const tool = (t.tool_desain || '').toLowerCase();

        return kategori.includes(query) || judul.includes(query) || keyword.includes(query) || tool.includes(query);
      });

      const nActiveThemes = filteredThemes.filter(t => t.is_active !== false).length;
      updateThemeStatusFilterUI({ all: filteredThemes.length, active: nActiveThemes, inactive: filteredThemes.length - nActiveThemes });
      if (themeStatusFilter !== 'all') {
        const wantActive = themeStatusFilter === 'active';
        filteredThemes = filteredThemes.filter(t => (t.is_active !== false) === wantActive);
      }

      const totalCountEl = document.getElementById('total-theme-count');
      if (totalCountEl) {
        totalCountEl.innerText = `${filteredThemes.length} Tema`;
      }

      if (filteredThemes.length === 0) {
        tbody.innerHTML = `<tr><td class="p-4 text-center text-slate-400" colspan="7">${themeStatusFilter === 'inactive' && !query ? 'Tidak ada tema nonaktif.' : themeStatusFilter === 'active' && !query ? 'Tidak ada tema aktif.' : 'Tema tidak ditemukan.'}</td></tr>`;
        if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
        lastThemesTableHash = '';
        return;
      }

      let sortedThemes = sortArrayData([...filteredThemes], themesSortCol, themesSortDir);
      updateSortHeaderIcons('sort-icon-themes', themesSortCol, themesSortDir, ['kategori', 'sisa_kuota', 'judul', 'keyword']);

     const visibleThemes = sortedThemes.slice(0, themesTableLimit);
      if (loadMoreContainer) {
        if (sortedThemes.length > themesTableLimit) {
          loadMoreContainer.classList.remove('hidden');
        } else {
          loadMoreContainer.classList.add('hidden');
        }
      }

      const currentHash = JSON.stringify(visibleThemes);
      if (currentHash === lastThemesTableHash) return;
      lastThemesTableHash = currentHash;

      tbody.innerHTML = visibleThemes.map(t => {
        const targetAdminUrl = (t.sample_url && t.sample_url.trim() !== '') 
  ? t.sample_url 
  : generateFlaticonSearchUrl(t.kategori);

const sampleBtn = `
  <a href="${safeUrl(targetAdminUrl, 'https://www.flaticon.com')}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded text-[10px] font-bold shadow-xs">
    <i class="fa-solid fa-up-right-from-square"></i> Lihat
  </a>
`;

        const toolTxt = t.tool_desain || 'Bebas (Wajib Rapi)';

       const isActive = t.is_active !== false;
        const toggleBtnHtml = `
          <button type="button" onclick="toggleThemeActiveStatus(${jsArg(t.kategori)}, ${!isActive})" 
            class="inline-flex items-center justify-center gap-1.5 min-w-[84px] px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer shadow-2xs ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'}"
            title="Klik untuk ${isActive ? 'menonaktifkan' : 'mengaktifkan'} tema di halaman desainer">
            <span class="w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}"></span>
            ${isActive ? 'Aktif' : 'Nonaktif'}
          </button>
        `;

        return `
          <tr class="hover:bg-slate-50 transition ${!isActive ? 'opacity-60 bg-slate-50/70' : ''}">
            <td class="p-3 font-bold text-slate-800">
              ${esc(t.kategori)}
              <div class="text-[10px] font-semibold text-indigo-600 mt-0.5"><i class="fa-solid fa-pen-ruler"></i> Tool: ${esc(toolTxt)}</div>
            </td>
            <td class="p-3 text-center font-bold text-blue-600">${esc(t.sisa_kuota)}</td>
            <td class="p-3 text-slate-700">${esc(t.judul || '-')}</td>
            <td class="p-3 text-slate-500 text-[11px]" title="${esc(t.keyword || '')}"><div class="w-[120px] xl:w-[170px] line-clamp-2 break-words">${esc(t.keyword || '-')}</div></td>
            <td class="p-3 text-center">${sampleBtn}</td>
            <td class="p-3 text-center whitespace-nowrap">${toggleBtnHtml}</td>
            <td class="p-3 text-center whitespace-nowrap">
              <div class="flex items-center justify-center gap-1">
                <button onclick="editTheme(${jsArg(t.kategori)}, ${Number(t.sisa_kuota) || 0}, ${jsArg(t.judul || '')}, ${jsArg(t.keyword || '')}, ${jsArg(t.sample_url || '')}, ${jsArg(t.tool_desain || 'Figma')})" class="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1.5 rounded text-[10px] font-bold shadow-sm" title="Edit">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="deleteTheme(${jsArg(t.kategori)})" class="bg-rose-600 hover:bg-rose-700 text-white px-2 py-1.5 rounded text-[10px] font-bold shadow-sm" title="Hapus">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    async function handleSaveTheme(e) {
      e.preventDefault();
      const oldKategori = document.getElementById('theme-old-kategori').value;
      const kategori = document.getElementById('theme-kategori').value.trim();
      const kuota = parseInt(document.getElementById('theme-kuota').value);
      const judul = document.getElementById('theme-judul').value.trim();
      const keyword = document.getElementById('theme-keyword').value.trim();
      const sampleUrl = document.getElementById('theme-sample-url').value.trim();
      const toolDesain = document.getElementById('theme-tool-desain').value;

      const btnSave = document.getElementById('btn-save-theme');
      btnSave.disabled = true;

      const statusStok = kuota > 0 ? 'Tersedia' : 'Habis';

      if (oldKategori) {
        const { error } = await supabaseClient.from('themes_stock').update({
          kategori: kategori,
          sisa_kuota: kuota,
          judul: judul,
          keyword: keyword,
          sample_url: sampleUrl,
          tool_desain: toolDesain,
          status_stok: statusStok
        }).eq('kategori', oldKategori);

        if (error) await showModalAlert("Gagal Update", error.message, "error");
        else await showModalAlert("Berhasil", "Tema diperbarui!", "success");
      } else {
        const { error } = await supabaseClient.from('themes_stock').insert([{
          kategori: kategori,
          sisa_kuota: kuota,
          judul: judul,
          keyword: keyword,
          sample_url: sampleUrl,
          tool_desain: toolDesain,
		is_active: true,
          status_stok: statusStok
        }]);

        if (error) await showModalAlert("Gagal Tambah", error.message, "error");
        else await showModalAlert("Berhasil", "Tema baru ditambahkan!", "success");
      }

      btnSave.disabled = false;
      resetThemeForm();
      loadAdminThemesTable();
      loadThemes();
    }

    function editTheme(kategori, kuota, judul, keyword, sampleUrl, toolDesain) {
      document.getElementById('theme-old-kategori').value = kategori;
      document.getElementById('theme-kategori').value = kategori;
      document.getElementById('theme-kuota').value = kuota;
      document.getElementById('theme-judul').value = judul;
      document.getElementById('theme-keyword').value = keyword;
      document.getElementById('theme-sample-url').value = sampleUrl || '';
      document.getElementById('theme-tool-desain').value = toolDesain || 'Figma';

      document.getElementById('form-theme-title').innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Tema`;
      document.getElementById('btn-cancel-theme').classList.remove('hidden');
    }

    function resetThemeForm() {
      document.getElementById('form-manage-theme').reset();
      document.getElementById('theme-old-kategori').value = '';
      document.getElementById('theme-sample-url').value = '';
      document.getElementById('theme-tool-desain').value = 'Figma';
      document.getElementById('form-theme-title').innerHTML = `<i class="fa-solid fa-plus-circle"></i> Tambah Tema Baru`;
      document.getElementById('btn-cancel-theme').classList.add('hidden');
    }

    async function deleteTheme(kategori) {
      const confirmed = await showModalConfirm("Konfirmasi Hapus", `Yakin menghapus tema "${kategori}"?`);
      if (confirmed) {
        const { error } = await supabaseClient.from('themes_stock').delete().eq('kategori', kategori);
        if (error) await showModalAlert("Gagal Hapus", error.message, "error");
        else {
          await showModalAlert("Terhapus", "Tema berhasil dihapus!", "success");
          loadAdminThemesTable();
          loadThemes();
        }
      }
    }

async function toggleThemeActiveStatus(kategori, newStatus) {
      try {
        const { error } = await supabaseClient
          .from('themes_stock')
          .update({ is_active: newStatus })
          .eq('kategori', kategori);

        if (error) throw error;

        // Perbarui tampilan tabel admin & grid desainer secara langsung
        await loadAdminThemesTable(true);
        await loadThemes();
      } catch (err) {
        await showModalAlert("Gagal Mengubah Status", err.message, "error");
      }
    }

    // Desainer yang diizinkan admin menjadi pembantu upload (toggle di Daftar Kelola Desainer)
    let userCanHelpMap = {};

    /** Cek langsung ke database apakah desainer boleh membantu upload. */
    async function canHelpUpload(userId) {
      if (!userId) return false;
      try {
        const { data } = await supabaseClient.from('profiles').select('can_help_upload').eq('id', userId).single();
        return !!(data && data.can_help_upload);
      } catch (err) { return false; }
    }

    /** Admin: aktif/nonaktifkan desainer sebagai pembantu upload. */
    async function toggleCanHelpUpload(userId, current) {
      const { data, error } = await supabaseClient.from('profiles')
        .update({ can_help_upload: !current }).eq('id', userId).select('id, can_help_upload');
      if (error || !data || !data.length) {
        return await showModalAlert("Gagal Mengubah", error ? error.message : "Perubahan tidak tersimpan (cek izin akses).", "error");
      }
      await renderOverviewDesignersTable();
      await loadUsersList();
    }

    async function loadUsersList() {
      userCanHelpMap = {};
      userProfilesMap = {};
      userLevelsMap = {};
      userEmailsMap = {};
      userLastSeenMap = {};

      try {
        const { data: profiles } = await supabaseClient
          .from('profiles')
          .select('id, full_name, email, level, last_seen, can_help_upload')
          .order('full_name', { ascending: true });

        if (profiles && profiles.length > 0) {
          profiles.forEach(u => { 
            if (u.id && u.full_name) {
              userProfilesMap[u.id] = u.full_name;
              userLevelsMap[u.id] = u.level || 2; 
              userCanHelpMap[u.id] = !!u.can_help_upload;
              userLastSeenMap[u.id] = u.last_seen || null;
              if (u.email) userEmailsMap[u.id] = u.email;
            }
          });
        }
      } catch (err) {
        console.error("Error loadUsersList:", err);
      }

      const usersList = Object.keys(userProfilesMap).map(id => ({
        id: id,
        full_name: userProfilesMap[id]
      }));

      const select = document.getElementById('input-uploader-id');
      if (select) {
        const helpers = usersList
          .filter(u => u.id !== (currentUser ? currentUser.id : '') && userCanHelpMap[u.id]);
        select.innerHTML = helpers.length
          ? helpers.map(u => `<option value="${esc(u.id)}">${esc(u.full_name)}</option>`).join('')
          : `<option value="">Belum ada desainer pembantu yang aktif</option>`;
      }

      const selectSlip = document.getElementById('select-slip-user');
      if (selectSlip) {
        selectSlip.innerHTML = usersList.length > 0 
          ? usersList.map(u => `<option value="${esc(u.id)}">${esc(u.full_name)} (Level ${userLevelsMap[u.id] || 2})</option>`).join('')
          : '<option value="">Belum ada desainer</option>';
      }

      const selectAnalytics = document.getElementById('analytics-select-designer');
      if (selectAnalytics) {
        selectAnalytics.innerHTML = usersList.length > 0
          ? usersList.map(u => `<option value="${esc(u.id)}">${esc(u.full_name)}</option>`).join('')
          : '<option value="">Belum ada desainer</option>';
      }
    }

    async function handleExpiredProjectCleanup(project) {
      if (!project || !project.id || processedExpiredProjects.has(project.id)) return;
      processedExpiredProjects.add(project.id);

      try {
        const desainerName = userProfilesMap[project.designer_id] || 'Desainer';

        const { data: deletedData, error: deleteErr } = await supabaseClient
          .from('icon_projects')
          .delete()
          .eq('id', project.id)
          .select();

        if (deleteErr) throw deleteErr;

        if (!deletedData || deletedData.length === 0) {
          console.warn(`Proyek ${project.id} sudah dibersihkan oleh proses lain.`);
          return;
        }

        const { data: theme } = await supabaseClient
          .from('themes_stock')
          .select('sisa_kuota')
          .eq('kategori', project.kategori)
          .single();

        if (theme) {
          const currentKuota = Number(theme.sisa_kuota) || 0;
          const amountToRestore = Number(project.jumlah_icon) || 0;
          const restoredKuota = currentKuota + amountToRestore;

          await supabaseClient.from('themes_stock').update({
            sisa_kuota: restoredKuota,
            status_stok: restoredKuota > 0 ? 'Tersedia' : 'Habis'
          }).eq('kategori', project.kategori);
        }

        if (isAdminUser) {
          await showModalAlert(
            "Klaim Expired (Admin Info) ⚠️", 
            `Pengerjaan tema "${project.kategori}" (${project.jumlah_icon} Icon) oleh desainer ${desainerName} telah EXPIRED.\n\nSistem telah menghapus klaim tersebut dan mengembalikan stok kuota secara otomatis.`, 
            "warning"
          );
        } else if (currentUser && currentUser.id === project.designer_id) {
          await showModalAlert(
            "Waktu Habis (EXPIRED) ⚠️", 
            `Waktu pengerjaan untuk tema "${project.kategori}" telah habis.\n\nKlaim Anda telah dibatalkan otomatis dan stok kuota sebanyak ${project.jumlah_icon} icon telah dikembalikan!`, 
            "warning"
          );
        }

        loadUserDashboardData();
        loadThemes();
        if (isAdminUser) {
          loadAdminOverviewData();
          loadAdminThemesTable();
          loadAdminProjects();
        }
      } catch (err) {
        console.error("Gagal menghapus klaim expired:", err.message);
      } finally {
        setTimeout(() => { processedExpiredProjects.delete(project.id); }, 5000);
      }
    }

    async function checkExpiredClaims(activeProjects) {
      if (!activeProjects || activeProjects.length === 0) return [];

      const now = new Date();
      let remainingProjects = [];

      for (let p of activeProjects) {
        let isExpired = false;
        
        if (p.deadline_drive) {
          const deadlineDate = new Date(p.deadline_drive);
          if (now > deadlineDate) isExpired = true;
        } else {
          const createdDate = new Date(p.created_at);
          const endOfDay = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate(), 23, 59, 59, 999);
          if (now > endOfDay) isExpired = true;
        }

        if (isExpired && !p.canva_submitted_at && p.status_admin !== 'Approved') {
          await handleExpiredProjectCleanup(p);
        } else {
          remainingProjects.push(p);
        }
      }
      return remainingProjects;
    }

    async function loadUserDashboardData(silent = false) {
      if (!currentUser) return;

      try {
        let myLevel = 2;
        const { data: userProfile } = await supabaseClient
          .from('profiles')
          .select('level')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (userProfile && userProfile.level) {
          myLevel = userProfile.level;
          userLevelsMap[currentUser.id] = myLevel;
        } else {
          myLevel = userLevelsMap[currentUser.id] || 2;
        }

        const levelBadgeEl = document.getElementById('stat-user-level-badge');
        if (levelBadgeEl) levelBadgeEl.innerText = `Lvl ${myLevel}`;

        const startDate = document.getElementById('user-start-date').value;
        const endDate = document.getElementById('user-end-date').value;

        let query = supabaseClient
          .from('icon_projects')
          .select('*')
          .or(`designer_id.eq.${currentUser.id},uploader_id.eq.${currentUser.id}`);

        if (startDate && endDate) {
          const startISO = new Date(startDate + "T00:00:00").toISOString();
          const endISO = new Date(endDate + "T23:59:59").toISOString();
          query = query.gte('created_at', startISO).lte('created_at', endISO);
        }

        let { data: projects } = await query;

        const tbody = document.getElementById('user-projects-body');
        if (!projects || projects.length === 0) {
          tbody.innerHTML = `<tr><td class="p-4 text-center text-slate-400" colspan="8">Belum ada aktivitas pengerjaan.</td></tr>`;
          document.getElementById('stat-approved').innerHTML = `0 <span class="text-[10px] text-slate-400 font-normal">icon</span>`;
          document.getElementById('stat-reward1').innerText = `Rp 0`;
          document.getElementById('stat-reward2-tier').innerText = `Rp 0`;
          document.getElementById('stat-total-salary').innerText = `Rp 0`;
          document.getElementById('user-load-more-container').classList.add('hidden');
          renderDesignerStatusBanner(null);
          return;
        }

        let uncompletedList = projects.filter(p => p.designer_id === currentUser.id && p.status_admin !== 'Approved');
        let validProjects = await checkExpiredClaims(uncompletedList);

        if (uncompletedList.length !== validProjects.length) {
          let reFetch = await supabaseClient
            .from('icon_projects')
            .select('*')
            .or(`designer_id.eq.${currentUser.id},uploader_id.eq.${currentUser.id}`);
          projects = reFetch.data || [];
        }

        if (projects.length === 0) {
          tbody.innerHTML = `<tr><td class="p-4 text-center text-slate-400" colspan="8">Belum ada aktivitas pengerjaan.</td></tr>`;
          renderDesignerStatusBanner(null);
          return;
        }

       let activeUserProject = projects.find(p => p.designer_id === currentUser.id && p.status_admin !== 'Approved');
        renderDesignerStatusBanner(activeUserProject);

        const now = new Date();
        let totalApprovedCount = 0;
        let hasilDesainRp = 0;

        let formattedProjects = projects.map(p => {
          const total = Number(p.jumlah_icon) || 0;
          let inReview = (p.in_review_count !== undefined && p.in_review_count !== null) ? Number(p.in_review_count) : total;
          let rejected = Number(p.rejected_count) || 0;

          if (p.canva_submitted_at && inReview > 0) {
            const submittedAt = new Date(p.canva_submitted_at);
            const diffHours = (now - submittedAt) / (1000 * 60 * 60);
            if (diffHours >= 24) {
              rejected += inReview;
              inReview = 0;
              supabaseClient.from('icon_projects').update({
                in_review_count: 0,
                rejected_count: rejected
              }).eq('id', p.id);
            }
          }

          const approved = Math.max(0, total - (rejected + inReview));

          if (p.status_admin === 'Approved' && p.designer_id === currentUser.id) {
            totalApprovedCount += approved;
            const { app: tarifApp, rej: tarifRej } = designFeeRates(myLevel, p);

            hasilDesainRp += (approved * tarifApp) + (rejected * tarifRej);
          }

          return { ...p, approved_calc: approved };
        });

        formattedProjects = sortArrayData(formattedProjects, userSortCol, userSortDir);
        updateSortHeaderIcons('sort-icon-user', userSortCol, userSortDir, ['created_at', 'kategori', 'jumlah_icon', 'in_review_count', 'rejected_count', 'approved_calc', 'status_admin']);

        const visibleProjects = formattedProjects.slice(0, userTableLimit);
        const loadMoreContainer = document.getElementById('user-load-more-container');
        if (formattedProjects.length > userTableLimit) {
          loadMoreContainer.classList.remove('hidden');
        } else {
          loadMoreContainer.classList.add('hidden');
        }

        const userHash = JSON.stringify(visibleProjects.map(p => ({
          id: p.id, status: p.status_admin, rev: p.in_review_count, rej: p.rejected_count,
          app: p.approved_calc, cat: p.catatan_admin, canva: p.canva_uploaded_info, sub: p.canva_submitted_at, rdl: !!p.revision_download_enabled
        })));
        const shouldRenderTable = (userHash !== lastUserTableHash);
        lastUserTableHash = userHash;

        if (shouldRenderTable) {
          tbody.innerHTML = visibleProjects.map(p => {
          const dateStr = formatFullDateTime(p.created_at);
          const total = Number(p.jumlah_icon) || 0;
          let inReview = (p.in_review_count !== undefined && p.in_review_count !== null) ? Number(p.in_review_count) : total;
          let rejected = Number(p.rejected_count) || 0;
          const approved = p.approved_calc;

          let statusAdminBadge = `<span class="bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-bold">Pending Review</span>`;
          if (p.status_admin === 'Approved') {
            statusAdminBadge = p.canva_uploaded_info
              ? `<span class="bg-emerald-600 text-white px-2 py-0.5 rounded font-bold whitespace-nowrap"><i class="fa-solid fa-circle-check"></i> Approved · Sudah di Canva</span>`
              : `<span class="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold"><i class="fa-solid fa-circle-check"></i> Approved</span>`;
          } else if (p.status_admin === 'Rejected') {
            statusAdminBadge = `<span class="bg-rose-50 text-rose-600 px-2 py-0.5 rounded font-bold"><i class="fa-solid fa-circle-xmark"></i> Rejected</span>`;
          }

          const msgBox = p.catatan_admin ? `<div class="mt-1 p-2 bg-rose-50 border border-rose-200 rounded text-[10px] text-rose-700 font-semibold break-words"><i class="fa-solid fa-comment-dots"></i> <b>Catatan:</b> ${esc(p.catatan_admin)}</div>` : '';

          let rowBlinkClass = "";
          if (p.status_admin === 'Approved' && !p.canva_submitted_at) {
            rowBlinkClass = "animate-blink-designer";
          }

          let actionBtn = `
            <button onclick="openDesignerDrive({ id: ${jsArg(p.id)}, folderUrl: ${jsArg(p.drive_folder_url || '')}, status: ${jsArg(p.status_admin)}, count: ${Number(p.jumlah_icon) || 0}, kategori: ${jsArg(p.kategori || '')}, style: ${jsArg(p.style || p.style_desain || p.style_icon || '')}, designerId: ${jsArg(p.designer_id || '')} })" class="bg-blue-600 hover:bg-blue-700 text-white text-[10px] px-2.5 py-1.5 rounded font-bold shadow-sm flex items-center justify-center gap-1 mx-auto">
              <i class="fa-solid fa-folder-open"></i> Drive
            </button>
          `;

          if (p.status_admin === 'Approved') {
            const tData = themesStockMap[p.kategori] || {};
            const judulText = tData.judul || '-';
            const keywordText = tData.keyword || '-';

            actionBtn = `
              <div class="space-y-2">
                <div class="p-2 bg-slate-50 border border-slate-200 rounded-lg text-left text-[10px] space-y-1 max-w-xs mx-auto">
                  <div class="flex items-center justify-between gap-1">
                    <span class="text-slate-500 font-semibold truncate">Judul: <b class="text-slate-800">${esc(judulText)}</b></span>
                    <button onclick="copyToClipboard(${jsArg(judulText)})" class="text-blue-600 hover:text-blue-800 font-bold px-1.5 py-0.5 bg-white border border-slate-200 rounded shadow-xs" title="Copy Judul">
                      <i class="fa-regular fa-copy"></i>
                    </button>
                  </div>
                  <div class="flex items-center justify-between gap-1">
                    <span class="text-slate-500 font-semibold truncate">Keyword: <b class="text-slate-800">${esc(keywordText)}</b></span>
                    <button onclick="copyToClipboard(${jsArg(keywordText)})" class="text-blue-600 hover:text-blue-800 font-bold px-1.5 py-0.5 bg-white border border-slate-200 rounded shadow-xs" title="Copy Keyword">
                      <i class="fa-regular fa-copy"></i>
                    </button>
                  </div>
                </div>

               ${(() => {
                  // Sudah tercatat di server → hapus cadangan; belum tercatat tapi ada cadangan di perangkat → tetap tampil + simpan ulang
                  if (p.canva_uploaded_info) { canvaPendingClear(p.id); return canvaBannerHtml(p.id, p.canva_uploaded_info, false); }
                  const pend = canvaPendingGet(p.id);
                  if (pend) {
                    if (!canvaAutoTried.has(String(p.id))) { canvaAutoTried.add(String(p.id)); setTimeout(() => saveCanvaUploadInfo(p.id), 800); }
                    return canvaBannerHtml(p.id, pend.info, true);
                  }
                  return '';
                })() || (!p.revision_download_enabled ? `<div class="grid grid-cols-1 gap-1.5 mx-auto w-full">
                       <button onclick="uploadCanvaExtOnly(this, ${jsArg(p.id)})" class="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold shadow-sm flex items-center justify-center gap-1.5 w-full">
                         <i class="fa-solid fa-arrow-up-right-from-square"></i> Upload Canva
                       </button>
                     </div>` : '') || (() => {
                      const unlocked = isRevisionDownloaded(p.id);
                      const title = jsArg(p.kategori || 'File revisi');
                      return `<div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mx-auto w-full">
                       <button onclick="openRevisionDownload(${jsArg(p.id)}, ${title})" class="bg-white hover:bg-blue-50 text-blue-700 border border-blue-600 text-[10px] px-3 py-1.5 rounded-lg font-bold shadow-sm flex items-center justify-center gap-1.5 w-full" title="Download SVG terbaru dari folder Drive proyek">
                         <i class="fa-solid fa-file-arrow-down"></i> Download File Revisi
                       </button>
                       <button data-rev-lock="${esc(p.id)}" onclick="openRevisionDownload(${jsArg(p.id)}, ${title}, true)" class="${unlocked ? 'hidden ' : ''}bg-slate-200 hover:bg-slate-300 text-slate-500 border border-slate-300 text-[10px] px-3 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 w-full" title="Download file revisi dulu untuk membuka Upload Canva">
                         <i class="fa-solid fa-lock"></i> Download file revisi dulu
                       </button>
                       <button data-rev-canva="${esc(p.id)}" onclick="uploadCanvaGuarded(this, ${jsArg(p.id)}, ${title})" class="${unlocked ? '' : 'hidden '}bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold shadow-sm flex items-center justify-center gap-1.5 w-full disabled:opacity-70">
                         <i class="fa-solid fa-arrow-up-right-from-square"></i> Upload Canva
                       </button>
                     </div>`;
                    })()
                }
              </div>
            `;
          }

          const toolBadge = p.tool_desain ? `<div class="text-[10px] text-indigo-600 font-semibold mt-0.5"><i class="fa-solid fa-pen-ruler"></i> ${esc(p.tool_desain)}</div>` : '';

          let ownershipTag = '';
          if (p.uploader_id && p.uploader_id !== p.designer_id) {
            if (p.uploader_id === currentUser.id) {
              const ownerName = userProfilesMap[p.designer_id] || 'Desainer Lain';
              ownershipTag = `<div class="text-[10px] text-amber-700 font-bold mt-0.5 bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-200 inline-block"><i class="fa-solid fa-hand-holding-hand"></i> Milik: ${esc(ownerName)} (Dibantu Upload)</div>`;
            } else if (p.designer_id === currentUser.id) {
              const uploaderName = userProfilesMap[p.uploader_id] || 'Desainer Lain';
              ownershipTag = `<div class="text-[10px] text-indigo-700 font-bold mt-0.5 bg-indigo-100/80 px-1.5 py-0.5 rounded border border-indigo-200 inline-block"><i class="fa-solid fa-cloud-arrow-up"></i> Dibantu Upload: ${esc(uploaderName)}${(isNewFeeRule(p) || Number(myLevel) === 2) ? '' : ' (-Rp 250/icon)'}</div>`;
            }
          }

          return `
            <tr id="user-row-${esc(p.id)}" class="transition ${rowBlinkClass}">
              <td class="p-3 text-slate-500 font-medium whitespace-nowrap">${dateStr}</td>
              <td class="p-3 font-bold text-blue-600">
                ${esc(p.kategori)}
                ${toolBadge}
                ${ownershipTag}
                ${msgBox}
              </td>
              <td class="p-3 text-center font-bold">${total}</td>
              <td class="p-3 text-center font-bold text-amber-600">${inReview}</td>
              <td class="p-3 text-center font-bold text-rose-600">${rejected}</td>
              <td class="p-3 text-center font-bold text-emerald-600">${approved}</td>
              <td class="p-3 text-center">${statusAdminBadge}</td>
              <td class="p-3 text-center">${actionBtn}</td>
            </tr>
          `;
        }).join('');
        }

        let reward1 = 0;
        let helpQuery = supabaseClient
          .from('icon_projects')
          .select('*')
          .or(`uploader_id.eq.${currentUser.id},designer_id.eq.${currentUser.id}`)
          .eq('status_admin', 'Approved');

        if (startDate && endDate) {
          const startISO = new Date(startDate + "T00:00:00").toISOString();
          const endISO = new Date(endDate + "T23:59:59").toISOString();
          helpQuery = helpQuery.gte('created_at', startISO).lte('created_at', endISO);
        }

        const { data: helpUploads } = await helpQuery;

        if (helpUploads) {
          helpUploads.forEach(h => {
            if (uploadRewardOwner(h) === currentUser.id) reward1 += uploadRewardOf(h);
          });
        }

        let reward2 = 0;
        if (totalApprovedCount >= 100 && totalApprovedCount <= 199) reward2 = 50000;
        else if (totalApprovedCount >= 200 && totalApprovedCount <= 299) reward2 = 120000;
        else if (totalApprovedCount >= 300) reward2 = 200000;

        const totalSalary = hasilDesainRp + reward1 + reward2;

        document.getElementById('stat-approved').innerHTML = `${totalApprovedCount} <span class="text-[10px] text-slate-400 font-normal">icon</span>`;
        document.getElementById('stat-reward1').innerText = `Rp ${reward1.toLocaleString('id-ID')}`;
        document.getElementById('stat-reward2-tier').innerText = `Rp ${reward2.toLocaleString('id-ID')}`;
        document.getElementById('stat-total-salary').innerText = `Rp ${totalSalary.toLocaleString('id-ID')}`;
      } catch (err) {
        console.error("Error loadUserDashboardData:", err);
      }
    }

  function renderDesignerStatusBanner(activeProject) {
  const bannerContainer = document.getElementById('designer-status-banner');
  if (countdownInterval) clearInterval(countdownInterval);

  // Jika tidak ada proyek aktif atau statusnya sudah Approved / Revised, sembunyikan banner
  if (!activeProject || activeProject.status_admin === 'Approved' || activeProject.status_admin === 'Revised') {
    bannerContainer.classList.add('hidden');
    bannerContainer.innerHTML = '';
    return;
  }

  bannerContainer.classList.remove('hidden');

  // Variabel penentu status
  const isRejected = activeProject.status_admin === 'Rejected';
  const isPending = activeProject.status_admin === 'Pending' || activeProject.status_admin === 'Pending Review';
  const isUploaded = activeProject.canva_submitted_at || activeProject.status_admin === 'Uploaded';

 // HANYA tampilkan Banner Hijau (Kirim Laporan) jika SUDAH upload DAN BUKAN Rejected / Pending / Revised
  if (isUploaded && !isRejected && !isPending) {
    const isSubmitted = activeProject.status_admin === 'Submitted';
    const targetBelajarVal = activeProject.target_belajar || activeProject.target || '';
    const projectStyle = activeProject.style || activeProject.style_desain || activeProject.style_icon || '';

    // Kalkulasi durasi minimal pengerjaan: {x} icon * 5 menit sejak waktu awal klaim
    const claimStartTime = new Date(activeProject.created_at).getTime();
    const minDurationMs = (Number(activeProject.jumlah_icon) || 1) * 5 * 60 * 1000;
    const unlockTime = claimStartTime + minDurationMs;
    const isLockedByTime = !isSubmitted && (Date.now() < unlockTime);

    const btnHtml = isSubmitted
      ? `<button id="btn-trigger-telegram" disabled="disabled"
                class="bg-emerald-900/40 text-emerald-100 border border-emerald-400/30 font-extrabold text-xs px-4 py-2 rounded-lg whitespace-nowrap flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-center cursor-not-allowed opacity-90 z-20">
          <i class="fa-solid fa-check-double"></i> Laporan Terkirim
        </button>`
      : `<button id="btn-trigger-telegram" 
                ${isLockedByTime ? 'disabled="disabled"' : ''}
                data-project-id="${activeProject.id}" 
                data-kategori="${activeProject.kategori.replace(/"/g, '&quot;')}" 
                data-jumlah="${activeProject.jumlah_icon}" 
                data-drive="${esc(activeProject.drive_folder_url || '')}" 
                data-target="${targetBelajarVal.replace(/"/g, '&quot;')}" 
                data-style="${projectStyle.replace(/"/g, '&quot;')}" 
                class="${isLockedByTime 
                  ? 'bg-emerald-950/50 text-emerald-200 border border-emerald-400/30 cursor-not-allowed opacity-90 font-mono' 
                  : 'bg-white text-emerald-800 hover:bg-emerald-50 cursor-pointer'} font-extrabold text-xs px-4 py-2 rounded-lg transition shadow-sm whitespace-nowrap flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-center z-20">
          ${isLockedByTime 
            ? '<i class="fa-solid fa-hourglass-half animate-pulse"></i> <span id="btn-report-countdown">00:00:00</span>' 
            : '<i class="fa-solid fa-paper-plane"></i> Kirim Laporan'}
        </button>`;

    bannerContainer.innerHTML = `
      <div class="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-3.5 sm:p-4.5 rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border border-emerald-500">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg text-white font-black shrink-0 shadow-inner">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <h4 class="text-xs sm:text-sm font-extrabold text-white">
              Selamat! Desain Tema "${esc(activeProject.kategori)}" Berhasil Diupload! 🎉
            </h4>
            <p class="text-[11px] text-emerald-100 mt-0.5" id="txt-banner-report-desc">
              ${isSubmitted 
                ? 'Laporan telah dikirim ke Admin. Mohon tunggu proses peninjauan.' 
                : (isLockedByTime 
                    ? `Menunggu durasi minimal pengerjaan (${activeProject.jumlah_icon} icon × 5 menit) sebelum laporan dapat dikirim.` 
                    : 'Silakan klik <b>Kirim Laporan</b> jika sudah yakin desain Anda bebas revisi.')}
            </p>
          </div>
        </div>
        ${btnHtml}
      </div>
    `;

    if (!isSubmitted) {
      const bindSendReportEvent = (btnEl) => {
        btnEl.onclick = function() {
          sendTelegramReport(
            this.getAttribute('data-project-id'),
            this.getAttribute('data-kategori'),
            this.getAttribute('data-jumlah'),
            this.getAttribute('data-drive'),
            this.getAttribute('data-target'),
            this.getAttribute('data-style')
          );
        };
      };

      setTimeout(() => {
        const btnTelegram = document.getElementById('btn-trigger-telegram');
        if (!btnTelegram) return;

        if (isLockedByTime) {
          const updateReportCountdown = () => {
            const diff = unlockTime - Date.now();
            if (diff <= 0) {
              clearInterval(countdownInterval);
              btnTelegram.disabled = false;
              btnTelegram.className = 'bg-white text-emerald-800 hover:bg-emerald-50 cursor-pointer font-extrabold text-xs px-4 py-2 rounded-lg transition shadow-sm whitespace-nowrap flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-center z-20';
              btnTelegram.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Laporan';

              const descEl = document.getElementById('txt-banner-report-desc');
              if (descEl) descEl.innerHTML = 'Silakan klik <b>Kirim Laporan</b> jika sudah yakin desain Anda bebas revisi.';

              bindSendReportEvent(btnTelegram);
              return;
            }

            const hrs = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
            const mins = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
            const secs = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

            const cdSpan = document.getElementById('btn-report-countdown');
            if (cdSpan) cdSpan.innerText = `${hrs}:${mins}:${secs}`;
          };

          updateReportCountdown();
          countdownInterval = setInterval(updateReportCountdown, 1000);
        } else {
          bindSendReportEvent(btnTelegram);
        }
      }, 100);
    }

    return;
  }

  // Tampilkan Banner Kuning (Deadline Upload) untuk proyek aktif berikutnya (misal: Search Bar (glyph))
  let targetDeadline = activeProject.deadline_drive ? new Date(activeProject.deadline_drive) : new Date();
  if (!activeProject.deadline_drive) {
    targetDeadline.setHours(23, 59, 59, 999);
  }

  bannerContainer.innerHTML = `
    <div class="bg-amber-50 border border-amber-300 p-3.5 sm:p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center text-base font-black shrink-0 shadow-xs">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h4 class="text-xs font-extrabold text-slate-800">Deadline Upload: <span class="text-blue-700 font-black">${esc(activeProject.kategori)}</span></h4>
            <span class="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">${activeProject.jumlah_icon} Icon</span>
          </div>
          <p class="text-[11px] text-slate-600 mt-0.5">
            Segera upload file ke Drive sebelum waktu habis. Jika selesai, klik <b>Saya Sudah Upload</b>.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
        <div class="bg-white border border-amber-300 px-2.5 py-1 rounded-xl shadow-xs text-center mr-1">
          <span class="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Sisa Waktu</span>
          <span class="text-xs sm:text-sm font-black text-rose-600 font-mono tracking-wider" id="txt-countdown-timer">00:00:00</span>
        </div>
        <button onclick="openDesignerDrive({ id: ${jsArg(activeProject.id)}, folderUrl: ${jsArg(activeProject.drive_folder_url || '')}, status: ${jsArg(activeProject.status_admin)}, count: ${Number(activeProject.jumlah_icon) || 0}, kategori: ${jsArg(activeProject.kategori || '')}, style: ${jsArg(activeProject.style || activeProject.style_desain || activeProject.style_icon || '')}, designerId: ${jsArg(activeProject.designer_id || '')} })" class="btn-tokopedia-blue text-xs font-bold px-3 py-2 rounded-lg transition shadow-sm flex items-center gap-1">
          <i class="fa-solid fa-cloud-arrow-up"></i> Drive
        </button>
        <button onclick="confirmDriveUpload(${jsArg(activeProject.id)}, ${Number(activeProject.jumlah_icon) || 0}, ${jsArg(activeProject.created_at)})" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition shadow-sm flex items-center gap-1">
          <i class="fa-solid fa-check-circle"></i> Sudah Upload
        </button>
      </div>
    </div>
  `;

  function updateTimer() {
    const now = new Date();
    const diff = targetDeadline - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      const timerEl = document.getElementById('txt-countdown-timer');
      if (timerEl) timerEl.innerText = "EXPIRED";
      
      handleExpiredProjectCleanup(activeProject);
      return;
    }

    const hrs = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
    const mins = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
    const secs = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

    const timerEl = document.getElementById('txt-countdown-timer');
    if (timerEl) timerEl.innerText = `${hrs}:${mins}:${secs}`;
  }

  updateTimer();
  countdownInterval = setInterval(updateTimer, 1000);
}

 async function confirmDriveUpload(projectId, jumlahIcon, checkTimestamp) {
  // 1. Tampilkan Konfirmasi Awal
  const confirm = await showModalConfirm(
    "Konfirmasi Upload",
    `Apakah Anda yakin sudah selesai mengunggah file ke Google Drive?`
  );

  if (!confirm) return;

  // 2. Tampilkan Modal Loading Pengecekan dengan Progress Bar & Animasi
  const dialog = document.getElementById('modal-custom-dialog');
  const iconBg = document.getElementById('dialog-icon-bg');
  const icon = document.getElementById('dialog-icon');
  const titleEl = document.getElementById('dialog-title');
  const msgEl = document.getElementById('dialog-message');
  const promptBox = document.getElementById('dialog-prompt-container');
  const btnCancel = document.getElementById('dialog-btn-cancel');
  const btnOk = document.getElementById('dialog-btn-ok');

  promptBox.classList.add('hidden');
  btnCancel.classList.add('hidden');
  btnOk.classList.add('hidden'); // Sembunyikan tombol saat loading

  iconBg.className = "w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl bg-blue-50 text-blue-600 border border-blue-200 animate-spin";
  icon.className = "fa-solid fa-spinner";
  titleEl.innerText = "Memeriksa Google Drive...";

  // Render HTML Progress Bar
  msgEl.innerHTML = `
    <div class="space-y-3 py-2">
      <p class="text-xs text-slate-600 font-semibold">Mohon tunggu, sistem sedang memeriksa keberadaan & tanggal pembaruan file di Drive...</p>
      
      <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 shadow-inner">
        <div id="drive-check-progress-bar" class="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out" style="width: 5%"></div>
      </div>
      
      <div class="flex justify-between items-center text-[10px] font-bold text-slate-400">
        <span id="drive-check-time-text">Estimasi: 3 detik</span>
        <span id="drive-check-percent-text" class="text-blue-600 font-extrabold">5%</span>
      </div>
    </div>
  `;

  dialog.classList.remove('hidden');

  // Animasi Progress Bar
  let currentProgress = 5;
  let secondsElapsed = 0;
  
  const progressInterval = setInterval(() => {
    secondsElapsed += 0.2;
    if (currentProgress < 90) {
      currentProgress += Math.floor(Math.random() * 8) + 4;
      if (currentProgress > 90) currentProgress = 90;
    }

    const progressBar = document.getElementById('drive-check-progress-bar');
    const percentTxt = document.getElementById('drive-check-percent-text');
    const timeTxt = document.getElementById('drive-check-time-text');

    if (progressBar) progressBar.style.width = `${currentProgress}%`;
    if (percentTxt) percentTxt.innerText = `${currentProgress}%`;
    if (timeTxt) timeTxt.innerText = `Memeriksa: ${secondsElapsed.toFixed(1)}d`;
  }, 200);

  try {
    // 3. Ambil data proyek dari Supabase untuk patokan waktu revisi
    const { data: project } = await supabaseClient
      .from('icon_projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (!project || !project.drive_folder_url) {
      clearInterval(progressInterval);
      dialog.classList.add('hidden');
      await showModalAlert("Error", "URL Folder Drive tidak ditemukan pada proyek ini.", "error");
      return;
    }

  // Patokan waktu revisi: jika status Rejected, gunakan waktu admin melakukan Reject (updated_at)
    const isRevision = (project.status_admin === 'Rejected' || project.status_admin === 'Revised');
    const revisionReferenceTime = isRevision
      ? (project.updated_at || project.canva_submitted_at || checkTimestamp)
      : (project.canva_submitted_at || project.updated_at || checkTimestamp);

    // Request Pengecekan ke Google Apps Script (deteksi perubahan waktu minimal 1, beberapa, atau semua file)
    const checkResponse = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'check_revision',
        drive_folder_url: project.drive_folder_url,
        status_admin: project.status_admin || '',
        rejected_at: revisionReferenceTime,
        last_submitted_at: project.canva_submitted_at || checkTimestamp,
        target_jumlah_icon: jumlahIcon,
        check_mode: 'any_file_timestamp_changed'
      })
    });

    const checkResult = await checkResponse.json();
    clearInterval(progressInterval);

    // Set Progress Bar ke 100%
    const progressBar = document.getElementById('drive-check-progress-bar');
    const percentTxt = document.getElementById('drive-check-percent-text');
    if (progressBar) progressBar.style.width = `100%`;
    if (percentTxt) percentTxt.innerText = `100%`;

    await new Promise(r => setTimeout(r, 300));
    dialog.classList.add('hidden');

    // --- EVALUASI RESPON AKURAT ---

    // 1. Folder Drive Kosong
    if (checkResult.status === 'empty') {
      await showModalAlert(
        "Folder Drive Kosong! ⚠️",
        "Pengecekan selesai. Folder Google Drive Anda masih kosong! Silakan unggah file terlebih dahulu.",
        "warning"
      );
      return;
    }

    // 2. Terdeteksi File Duplikat (Nama / Ukuran Persis Sama) -> BERLAKU SEMUA KONDISI
    if (checkResult.status === 'duplicate_file') {
      await showModalAlert(
        "Terdeteksi File Duplikat! ⚠️",
        checkResult.message || "Terdapat file dengan nama atau ukuran (bytes) yang persis sama di dalam folder Drive Anda. Silakan periksa dan perbaiki file tersebut!",
        "warning"
      );
      return;
    }

    // 3. Jumlah File Kurang dari Target Icon Diklaim -> BERLAKU SEMUA KONDISI
    if (checkResult.status === 'incomplete') {
      await showModalAlert(
        "Jumlah File Belum Lengkap! ⚠️",
        `Jumlah file di Drive saat ini baru ${checkResult.totalFiles} file, sedangkan target klaim adalah ${checkResult.targetIcon} icon. Harap lengkapi file terlebih dahulu!`,
        "warning"
      );
      return;
    }

    // 4. Khusus Status Rejected: Belum Ada File yang Diperbarui
    if (checkResult.status === 'no_new_file') {
      await showModalAlert(
        "File Belum Diperbarui! ⚠️",
        "Sistem tidak mendeteksi adanya file baru yang diunggah/diperbarui setelah revisi diberikan. Pastikan Anda telah mengunggah file revisi terbaru!",
        "warning"
      );
      return;
    }

    // 5. Error Server
    if (checkResult.status !== 'success') {
      await showModalAlert(
        "Pengecekan Gagal ⚠️",
        checkResult.message || "Terjadi kesalahan saat memeriksa Google Drive.",
        "error"
      );
      return;
    }

    // 6. JIKA SEMUA VALIDASI LOLOS (File Terbukti Ada & Terbaru)
   const nowIso = new Date().toISOString();
    const updatedStatus = 'Uploaded';

    const updatePayload = {
      canva_submitted_at: nowIso,
      status_admin: updatedStatus,
      updated_at: nowIso
    };

    // Jika ini adalah upload hasil revisi, kembalikan hitungan ke antrean In Review
    if (isRevision || Number(project.rejected_count) > 0) {
      updatePayload.in_review_count = Number(jumlahIcon) || Number(project.jumlah_icon) || 0;
      updatePayload.rejected_count = 0;
    }

    const { data: updatedRows, error: updateErr } = await supabaseClient
      .from('icon_projects')
      .update(updatePayload)
      .eq('id', projectId)
      .select();

    if (updateErr) throw updateErr;
    if (!updatedRows || updatedRows.length === 0) {
      throw new Error("Status gagal diperbarui ke 'Uploaded' di database. Periksa izin RLS atau constraint kolom status_admin di Supabase.");
    }
    const namaDesainer = (typeof userProfilesMap !== 'undefined' && userProfilesMap[currentUser.id]) || currentUser.email || 'Desainer';
    const waktuVerifikasi = formatNotifUploadTime(nowIso);
    const aksiUploadText = isRevision ? 'merevisi' : 'mengupload';

    // Mencatat history untuk Desainer bersangkutan & Admin
    await logUserActivity(
      'UPLOAD_DRIVE',
      `${namaDesainer} berhasil ${aksiUploadText} ${jumlahIcon} ${project.kategori} (${waktuVerifikasi})`
    );

    // Tampilkan Popup Sukses & Banner Hijau Langsung Aktif
   const infoRevisiTxt = isRevision && checkResult.newerFiles
      ? `Terdeteksi ${checkResult.newerFiles} dari ${checkResult.totalFiles} file telah diperbarui/diupload ulang.`
      : `File di Drive terdeteksi lengkap (${checkResult.totalFiles} file) dan terbaru.`;

    await showModalAlert(
      "Berhasil Verifikasi! 🎉",
      `${infoRevisiTxt} Silakan klik tombol 'Kirim Laporan' yang muncul di atas.`,
      "success"
    );

    if (typeof loadUserDashboardData === 'function') {
      await loadUserDashboardData();
    }

  } catch (err) {
    clearInterval(progressInterval);
    dialog.classList.add('hidden');
    console.error("Error confirmDriveUpload:", err);
    await showModalAlert("Terjadi Kesalahan", err.message, "error");
  }
}
    async function openDriveAndReReview(projectId, driveUrl, currentStatus) {
  const nowIso = new Date().toISOString();

  // Hanya update jam buka Drive, JANGAN timpa updated_at agar patokan waktu revisi tidak bergeser
  await supabaseClient.from('icon_projects').update({
    drive_opened_at: nowIso
  }).eq('id', projectId);

  window.open(driveUrl, '_blank');
}

    /** Tombol "Drive" desainer: catat jam buka Drive lalu buka penata ikon mode desainer. */
    function openDesignerDrive(project) {
      if (!window.KekalArranger) {
        return openDriveAndReReview(project.id, project.folderUrl || 'https://drive.google.com', project.status);
      }
      const meta = (currentUser && currentUser.user_metadata) || {};
      const designerName = userProfilesMap[project.designerId]
        || (currentUser && (userProfilesMap[currentUser.id] || meta.full_name || String(currentUser.email || '').split('@')[0]))
        || '';

      // Sama seperti sebelumnya: catat jam buka Drive tanpa mengubah updated_at
      supabaseClient.from('icon_projects').update({ drive_opened_at: new Date().toISOString() })
        .eq('id', project.id).then(() => {}, () => {});

      KekalArranger.open({
        mode: 'designer',
        id: project.id,
        folderUrl: project.folderUrl,
        count: project.count,
        title: project.kategori,
        style: project.style,
        designer: designerName
      });
    }

    async function loadAdminProjects(silent = false) {
      const tbody = document.getElementById('admin-table-body');
      const loadMoreContainer = document.getElementById('admin-load-more-container');
      if (!tbody) return;

      if (!silent && allAdminProjectsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="p-4 text-center text-slate-400">Memuat data laporan desainer...</td></tr>';
      }

      try {
        if (!isUsersLoaded || Object.keys(userProfilesMap).length === 0) {
          await loadUsersList();
          isUsersLoaded = true;
        }

        const { data: projects, error } = await supabaseClient
          .from('icon_projects')
          .select('*');

        if (error) throw error;

        if (!projects || projects.length === 0) {
          allAdminProjectsData = [];
          tbody.innerHTML = `<tr><td class="p-4 text-center text-slate-400" colspan="9">Belum ada laporan pengerjaan desainer.</td></tr>`;
          if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
          return;
        }

        allAdminProjectsData = projects.map(p => {
          const desainerName = userProfilesMap[p.designer_id] || 'Desainer';
          const totalNilai = p.jumlah_icon || 0;
          const inReviewVal = (p.in_review_count !== undefined && p.in_review_count !== null) ? Number(p.in_review_count) : totalNilai;
          const rejectedVal = Number(p.rejected_count) || 0;
          const approvedVal = Math.max(0, totalNilai - (rejectedVal + inReviewVal));

          return {
            ...p,
            designer_name: desainerName,
            in_review_count: inReviewVal,
            approved_calc: approvedVal
          };
        });

        renderAdminProjectsTable();
      } catch (err) {
        console.error("Error loadAdminProjects:", err);
        tbody.innerHTML = `<tr><td colspan="9" class="p-4 text-center text-rose-500 font-bold">Gagal memuat data: ${esc(err.message)}</td></tr>`;
      }
    }

    function filterAdminProjectsTable() {
      adminTableLimit = 10;
      renderAdminProjectsTable();
    }

    function renderAdminProjectsTable() {
      const tbody = document.getElementById('admin-table-body');
      const loadMoreContainer = document.getElementById('admin-load-more-container');
      if (!tbody) return;

      const searchInput = document.getElementById('input-search-admin-projects');
      const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

      let filteredProjects = allAdminProjectsData.filter(p => {
        const desainer = (p.designer_name || '').toLowerCase();
        const kategori = (p.kategori || '').toLowerCase();
        const statusAdmin = (p.status_admin || '').toLowerCase();
        const tool = (p.tool_desain || '').toLowerCase();

        return desainer.includes(query) || kategori.includes(query) || statusAdmin.includes(query) || tool.includes(query);
      });

      if (filteredProjects.length === 0) {
        tbody.innerHTML = `<tr><td class="p-4 text-center text-slate-400" colspan="9">Laporan tidak ditemukan.</td></tr>`;
        if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
        return;
      }

      let formattedAdminProjects = sortArrayData([...filteredProjects], adminSortCol, adminSortDir);
      updateSortHeaderIcons('sort-icon-admin', adminSortCol, adminSortDir, ['created_at', 'designer_name', 'kategori', 'jumlah_icon', 'in_review_count', 'rejected_count', 'approved_calc', 'status_admin']);

     const visibleProjects = formattedAdminProjects.slice(0, adminTableLimit);
      if (loadMoreContainer) {
        if (formattedAdminProjects.length > adminTableLimit) {
          loadMoreContainer.classList.remove('hidden');
        } else {
          loadMoreContainer.classList.add('hidden');
        }
      }

      // Jangan timpa tabel jika admin sedang mengetik di salah satu input angka
      if (isEditingAdminTable || document.activeElement?.closest('#admin-table-body')) {
        return;
      }

      // Lewati render DOM ulang jika isi data baris tidak mengalami perubahan
      const adminHash = JSON.stringify(visibleProjects.map(p => ({
        id: p.id, status: p.status_admin, rev: p.in_review_count, rej: p.rejected_count,
        app: p.approved_calc, jml: p.jumlah_icon, dl: p.deadline_drive, tgt: p.target_belajar, tool: p.tool_desain, upl: p.uploader_id,
        adb: p.adobe_uploaded_info, apAt: p.approved_at, rdl: !!p.revision_download_enabled, cv: !!p.canva_uploaded_info,
        on: !!(userLastSeenMap[p.designer_id] && (Date.now() - new Date(userLastSeenMap[p.designer_id]).getTime()) < 120000)
      })));
      if (adminHash === lastAdminTableHash) return;
      lastAdminTableHash = adminHash;

      tbody.innerHTML = visibleProjects.map(p => {
        const dateStr = formatFullDateTime(p.created_at);
        const desainerName = p.designer_name;
        const totalNilai = p.jumlah_icon || 0;
        const inReviewVal = Number(p.in_review_count);
        const rejectedVal = Number(p.rejected_count) || 0;
        const approvedVal = p.approved_calc;

        const statusNormalized = (p.status_admin || 'Pending').trim().toLowerCase();
        let statusBadge = `<span class="bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-bold">Pending</span>`;
        if (statusNormalized === 'approved') {
          statusBadge = p.canva_uploaded_info
            ? `<span class="bg-emerald-600 text-white px-2 py-0.5 rounded font-bold whitespace-nowrap" title="${esc(p.canva_uploaded_info)}">Approved · Sudah di Canva</span>`
            : `<span class="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">Approved</span>`;
        } else if (['uploaded', 'submitted', 'revised'].includes(statusNormalized)) {
          statusBadge = `<span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">Uploaded</span>`;
        } else if (statusNormalized === 'rejected') {
          statusBadge = `<span class="bg-rose-50 text-rose-600 px-2 py-0.5 rounded font-bold">Rejected</span>`;
        }

        const targetBelajarTxt = p.target_belajar ? `<div class="text-[10px] text-slate-500 font-normal italic mt-0.5"><i class="fa-solid fa-graduation-cap text-blue-500"></i> ${esc(p.target_belajar)}</div>` : '';
        const toolDesainTxt = p.tool_desain ? `<div class="text-[10px] text-indigo-600 font-bold mt-0.5"><i class="fa-solid fa-pen-ruler"></i> ${esc(p.tool_desain)}</div>` : '';

        let adminRowBlink = "";
        if (statusNormalized === 'pending') {
          adminRowBlink = "animate-blink-admin";
        } else if (['uploaded', 'submitted', 'revised'].includes(statusNormalized)) {
          adminRowBlink = "animate-blink-uploaded";
        }

        let uploaderInfoAdmin = '';
        if (p.uploader_id && p.uploader_id !== p.designer_id) {
          const uploaderName = userProfilesMap[p.uploader_id] || 'Desainer Lain';
          uploaderInfoAdmin = `<div class="text-[10px] text-indigo-600 font-bold mt-0.5"><i class="fa-solid fa-cloud-arrow-up"></i> Upload: ${esc(uploaderName)}</div>`;
        }
       const nowSecs = Math.floor(Date.now() / 1000);
        const lastSeenVal = userLastSeenMap[p.designer_id];
        const lastSeenSecs = lastSeenVal ? Math.floor(new Date(lastSeenVal).getTime() / 1000) : 0;
        const isDesignerOnline = lastSeenVal && (nowSecs - lastSeenSecs) < 120;

        const statusDotHtml = isDesignerOnline
          ? `<span class="relative flex h-2.5 w-2.5 shrink-0" title="Online (Sedang membuka web)"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span></span>`
          : `<span class="inline-block w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" title="Offline"></span>`;

        return `
          <tr class="transition ${adminRowBlink}">
            <td class="p-3 text-slate-500 font-medium">${dateStr}</td>
            <td class="p-3 font-bold text-slate-800">
              <div class="flex items-center gap-1.5">
                <span>${esc(desainerName)}</span>
                ${statusDotHtml}
              </div>
              ${uploaderInfoAdmin}
              ${targetBelajarTxt}
            </td>
            <td class="p-3 font-semibold text-blue-600">
              ${esc(p.kategori)}
              ${toolDesainTxt}
              ${p.adobe_uploaded_info
                ? `<div class="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded" title="${esc(p.adobe_uploaded_info)}"><i class="fa-solid fa-circle-check"></i> Sudah di Adobe</div>`
                : `<div class="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded"><i class="fa-regular fa-circle"></i> Belum di Adobe</div>`}
            </td>
            <td class="p-3 text-center font-bold" id="total-${p.id}">${totalNilai}</td>
            
            <td class="p-3 text-center">
              <input type="number" id="rev-${p.id}" value="${inReviewVal}" min="0" max="${totalNilai}" onfocus="isEditingAdminTable=true" onblur="isEditingAdminTable=false" oninput="handleRealtimeAdminInput('${p.id}')" class="w-12 border border-amber-300 rounded text-center py-1 font-bold text-amber-600 outline-none"/>
            </td>
            <td class="p-3 text-center">
              <input type="number" id="rej-${p.id}" value="${rejectedVal}" min="0" max="${totalNilai}" onfocus="isEditingAdminTable=true" onblur="isEditingAdminTable=false" oninput="handleRealtimeAdminInput('${p.id}')" class="w-12 border border-rose-300 rounded text-center py-1 font-bold text-rose-600 outline-none"/>
            </td>
            <td class="p-3 text-center">
              <input type="number" id="app-${p.id}" value="${approvedVal}" readonly class="w-12 bg-slate-100 border border-slate-300 rounded text-center py-1 font-bold text-emerald-700 outline-none cursor-not-allowed"/>
            </td>

            <td class="p-3 text-center">${statusBadge}${reportGateHtml(p)}</td>
            <td class="p-3 text-center whitespace-nowrap">
              <div class="flex items-center justify-center gap-1.5">
                <button onclick="openEditProjectModal(${jsArg(p.id)}, ${jsArg(p.target_belajar || '')}, ${jsArg(p.tool_desain || 'Figma')}, ${Number(p.jumlah_icon) || 0}, ${jsArg(p.uploader_id || '')}, ${jsArg(p.designer_id)})" class="bg-amber-500 text-white p-2 rounded text-[10px] font-bold hover:bg-amber-600 shadow-sm flex items-center justify-center" title="Edit Detail Laporan">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                ${p.status_admin === 'Approved'
                  ? `<button onclick="updateProjectStatus('${p.id}', 'Approved')" class="bg-slate-400 text-white p-2 rounded text-[10px] font-bold hover:bg-slate-500 shadow-sm flex items-center justify-center" title="${esc(p.approved_at ? 'Sudah di-approve pada ' + formatFullDateTime(p.approved_at) : 'Sudah di-approve')} · klik untuk koreksi angka saja">
                  <i class="fa-solid fa-check"></i>
                </button>`
                  : `<button onclick="updateProjectStatus('${p.id}', 'Approved')" class="bg-emerald-600 text-white p-2 rounded text-[10px] font-bold hover:bg-emerald-700 shadow-sm flex items-center justify-center" title="Approve">
                  <i class="fa-solid fa-check"></i>
                </button>`}
                <button onclick="handleRejectWithNote('${p.id}')" class="bg-rose-600 text-white p-2 rounded text-[10px] font-bold hover:bg-rose-700 shadow-sm flex items-center justify-center" title="Reject">
                  <i class="fa-solid fa-xmark"></i>
                </button>
                <button onclick="KekalArranger.open({ id: ${jsArg(p.id)}, folderUrl: ${jsArg(p.drive_folder_url || '')}, count: ${Number(p.jumlah_icon) || 0}, title: ${jsArg(p.kategori || '')}, designer: ${jsArg(desainerName || '')}, judul: ${jsArg((themesStockMap[p.kategori] || {}).judul || '')}, keyword: ${jsArg((themesStockMap[p.kategori] || {}).keyword || '')}, adobeInfo: ${jsArg(p.adobe_uploaded_info || '')}, onAdobeUpload: recordAdobeUpload })" class="bg-violet-600 text-white p-2 rounded text-[10px] font-bold hover:bg-violet-700 shadow-sm flex items-center justify-center" title="Penata Ikon">
                  <i class="fa-solid fa-table-cells"></i>
                </button>
                <button onclick="toggleRevisionDownload(${jsArg(p.id)}, ${p.revision_download_enabled ? 'true' : 'false'})" class="${p.revision_download_enabled ? 'bg-sky-600 hover:bg-sky-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-500'} p-2 rounded text-[10px] font-bold shadow-sm flex items-center justify-center" title="${p.revision_download_enabled ? 'Download file revisi diizinkan · klik untuk menutup' : 'Download file revisi tertutup · klik untuk mengizinkan'}">
                  <i class="fa-solid fa-file-arrow-down"></i>
                </button>
                <a href="${safeUrl(p.drive_folder_url, 'https://drive.google.com')}" target="_blank" rel="noopener" class="bg-blue-600 text-white p-2 rounded text-[10px] font-bold hover:bg-blue-700 shadow-sm flex items-center justify-center" title="Buka Drive">
                  <i class="fa-solid fa-folder-open"></i>
                </a>
                <button onclick="deleteProjectRecord(${jsArg(p.id)}, ${jsArg(p.kategori)})" class="bg-slate-700 text-white p-2 rounded text-[10px] font-bold hover:bg-rose-800 shadow-sm flex items-center justify-center" title="Hapus">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    /** Admin: izinkan / tutup tombol Download File Revisi untuk desainer pada laporan ini. */
    async function toggleRevisionDownload(id, current) {
      const { data, error } = await supabaseClient.from('icon_projects')
        .update({ revision_download_enabled: !current }).eq('id', id).select('id, revision_download_enabled');
      if (error || !data || !data.length) {
        return await showModalAlert("Gagal Mengubah", error ? error.message : "Perubahan tidak tersimpan (cek izin akses).", "error");
      }
      const row = allAdminProjectsData.find(x => String(x.id) === String(id));
      if (row) row.revision_download_enabled = !current;
      renderAdminProjectsTable();
    }

    async function deleteProjectRecord(id, kategori) {
      const { data: projectData, error: fetchErr } = await supabaseClient
        .from('icon_projects')
        .select('jumlah_icon, kategori')
        .eq('id', id)
        .single();

      if (fetchErr || !projectData) {
        await showModalAlert("Gagal", "Data laporan tidak ditemukan.", "error");
        return;
      }

      const jumlahDiklaim = Number(projectData.jumlah_icon) || 0;
      const namaKategori = projectData.kategori || kategori;

      const confirmed = await showModalConfirm(
        "Hapus Laporan", 
        `Yakin ingin menghapus laporan tema "${namaKategori}" ini?\n\nStok sebanyak ${jumlahDiklaim} icon akan dikembalikan secara otomatis ke tema terkait.`
      );

      if (confirmed) {
        try {
          const { error: deleteErr } = await supabaseClient
            .from('icon_projects')
            .delete()
            .eq('id', id);

          if (deleteErr) throw deleteErr;

          const { data: themeData } = await supabaseClient
            .from('themes_stock')
            .select('sisa_kuota')
            .eq('kategori', namaKategori)
            .single();

          if (themeData) {
            const stokSekarang = Number(themeData.sisa_kuota) || 0;
            const stokBaru = stokSekarang + jumlahDiklaim;

            await supabaseClient.from('themes_stock').update({
              sisa_kuota: stokBaru,
              status_stok: stokBaru > 0 ? 'Tersedia' : 'Habis'
            }).eq('kategori', namaKategori);
          }

          await showModalAlert(
            "Terhapus & Stok Dikembalikan", 
            `Laporan berhasil dihapus dan stok tema "${namaKategori}" telah ditambah kembali sebesar +${jumlahDiklaim} icon!`, 
            "success"
          );

          loadAdminProjects();
          if (isAdminUser) loadAdminOverviewData();
          loadThemes();
          loadAdminThemesTable();
        } catch (err) {
          await showModalAlert("Gagal Hapus", err.message, "error");
        }
      }
    }

    function handleRealtimeAdminInput(id) {
      const totalNilai = parseInt(document.getElementById(`total-${id}`).innerText) || 0;
      let revVal = parseInt(document.getElementById(`rev-${id}`).value) || 0;
      let rejVal = parseInt(document.getElementById(`rej-${id}`).value) || 0;

      if (revVal < 0) revVal = 0;
      if (rejVal < 0) rejVal = 0;

      if (revVal > totalNilai) {
        revVal = totalNilai;
        document.getElementById(`rev-${id}`).value = revVal;
      }

      if (revVal + rejVal > totalNilai) {
        rejVal = totalNilai - revVal;
        document.getElementById(`rej-${id}`).value = rejVal;
      }

      const approvedVal = Math.max(0, totalNilai - (rejVal + revVal));
      document.getElementById(`app-${id}`).value = approvedVal;

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        supabaseClient.from('icon_projects').update({
          in_review_count: revVal,
          rejected_count: rejVal,
          approved_count: approvedVal
        }).eq('id', id).then(() => {
          if (isAdminUser) loadAdminOverviewData();
          if (!document.getElementById('modal-slip-gaji').classList.contains('hidden')) {
            calculateSalaryForSelectedUser();
          }
        });
      }, 500);
    }

   async function handleRejectWithNote(id) {
      const note = await showModalPrompt("Penolakan & Catatan", "Masukkan catatan/alasan perbaikan untuk desainer:");
      if (note === null) return;

      const appInput = document.getElementById(`app-${id}`);
      const rejInput = document.getElementById(`rej-${id}`);
      const revInput = document.getElementById(`rev-${id}`);

      const approvedCount = appInput ? parseInt(appInput.value) || 0 : 0;
      const rejectedCount = rejInput ? parseInt(rejInput.value) || 0 : 0;
      const inReviewCount = revInput ? parseInt(revInput.value) || 0 : 0;
      const nowIso = new Date().toISOString();

      // Ambil detail proyek agar nama tema, jumlah icon, dan ID desainer akurat
      const proj = allAdminProjectsData.find(x => String(x.id) === String(id)) || {};
      const namaTema = proj.kategori || 'Icon';
      const jumlahIcon = proj.jumlah_icon || 0;
      const designerId = proj.designer_id || null;
      const namaDesainer = userProfilesMap[designerId] || 'Desainer';
      const waktuStamp = formatNotifUploadTime(nowIso);

      const { error } = await supabaseClient.from('icon_projects').update({
        status_admin: 'Rejected',
        catatan_admin: note,
        approved_count: approvedCount,
        rejected_count: rejectedCount,
        in_review_count: inReviewCount,
        updated_at: nowIso
      }).eq('id', id);

      if (!error) {
        const logDetail = `Tema "${namaTema}" sebanyak ${jumlahIcon} icon milik ${namaDesainer} membutuhkan perbaikan (Rejected). Catatan: "${note || '-'}" (${waktuStamp})`;
        
        // 1. Catat riwayat aktivitas untuk Admin
        await logUserActivity('MODERASI', logDetail);
        
        // 2. Catat riwayat aktivitas khusus untuk Desainer bersangkutan (jika tabel mendukung target_user_id / user_id)
        if (designerId) {
          await supabaseClient.from('activity_logs').insert([{
            user_id: designerId,
            user_name: namaDesainer,
            user_role: 'designer',
            action_type: 'MODERASI',
            description: `Tema "${namaTema}" sebanyak ${jumlahIcon} icon membutuhkan perbaikan. Catatan Admin: "${note || '-'}" (${waktuStamp})`,
            created_at: nowIso
          }]).then(() => {}).catch(() => {});
        }

        await showModalAlert("Status Ditolak", "Catatan perbaikan & notifikasi dikirim ke desainer!", "success");
        loadAdminProjects();
        if (isAdminUser) loadAdminOverviewData();
      } else {
        await showModalAlert("Gagal Update", error.message, "error");
      }
    }

    async function updateProjectStatus(id, newStatus) {
      const appInput = document.getElementById(`app-${id}`);
      const rejInput = document.getElementById(`rej-${id}`);
      const revInput = document.getElementById(`rev-${id}`);

      const approvedCount = appInput ? parseInt(appInput.value) || 0 : 0;
      const rejectedCount = rejInput ? parseInt(rejInput.value) || 0 : 0;
      const inReviewCount = revInput ? parseInt(revInput.value) || 0 : 0;
      const nowIso = new Date().toISOString();

      // Ambil detail proyek
      const proj = allAdminProjectsData.find(x => String(x.id) === String(id)) || {};
      const namaTema = proj.kategori || 'Icon';
      const jumlahIcon = proj.jumlah_icon || 0;
      const designerId = proj.designer_id || null;
      const namaDesainer = userProfilesMap[designerId] || 'Desainer';
      const waktuStamp = formatNotifUploadTime(nowIso);

      // Sudah pernah di-approve: jangan dianggap Approve baru (tanpa notifikasi ulang, approved_at tetap)
      if (newStatus === 'Approved' && proj.status_admin === 'Approved') {
        return reapproveCountsOnly(id, proj, approvedCount, rejectedCount, inReviewCount);
      }

      // Desainer belum mengirim laporan (masih dalam jeda / belum lapor): minta konfirmasi dulu
      if (newStatus === 'Approved' && reportGate(proj)) {
        const lanjut = await confirmApproveBeforeReport(proj, namaDesainer);
        if (!lanjut) return;
      }

      const { error } = await supabaseClient.from('icon_projects').update({
        status_admin: newStatus,
        catatan_admin: '',
        approved_count: approvedCount,
        rejected_count: rejectedCount,
        in_review_count: inReviewCount,
        updated_at: nowIso
      }).eq('id', id);

      if (!error && newStatus === 'Approved') {
        // Waktu Approve untuk jeda klaim ulang (kolom approved_at; diabaikan jika belum dibuat)
        try {
          const { error: apErr } = await supabaseClient.from('icon_projects').update({ approved_at: nowIso }).eq('id', id);
          if (apErr) console.warn('approved_at belum tersedia:', apErr.message);
        } catch (e) {}
      }

      if (!error) {
        const logDetail = `Tema "${namaTema}" sebanyak ${jumlahIcon} icon milik ${namaDesainer} telah disetujui (${newStatus}) — Approve: ${approvedCount}, Reject: ${rejectedCount} (${waktuStamp})`;

        // 1. Catat riwayat aktivitas untuk Admin
        await logUserActivity('MODERASI', logDetail);

        // 2. Catat riwayat aktivitas khusus untuk Desainer bersangkutan
        if (designerId) {
          await supabaseClient.from('activity_logs').insert([{
            user_id: designerId,
            user_name: namaDesainer,
            user_role: 'designer',
            action_type: 'MODERASI',
            description: `Tema "${namaTema}" sebanyak ${jumlahIcon} icon telah disetujui (Approved). Segera upload ke Canva! (${waktuStamp})`,
            created_at: nowIso
          }]).then(() => {}).catch(() => {});
        }

        await showModalAlert("Berhasil Approve", "Status laporan disetujui & notifikasi dikirim ke desainer!", "success");
        loadAdminProjects();
        if (isAdminUser) loadAdminOverviewData();
        await loadThemes(); 
        if (!document.getElementById('modal-slip-gaji').classList.contains('hidden')) {
          calculateSalaryForSelectedUser();
        }
      } else {
        await showModalAlert("Gagal Update", error.message, "error");
      }
    }

    /* ===== Timer desainer yang sedang berjalan (sama persis dengan halaman desainer) =====
     * Pending  → batas upload ke Drive (deadline_drive; bila kosong: hari ini 23:59:59)
     * Uploaded → jeda kirim laporan: jam klaim + {jumlah icon} × 5 menit */
    /** null bila laporan sudah dikirim / tidak relevan; selain itu { kind, unlock, totalMs }. */
    function reportGate(p) {
      const st = String((p && p.status_admin) || 'Pending').trim().toLowerCase();
      if (st === 'pending') {
        const dl = p.deadline_drive ? new Date(p.deadline_drive) : new Date();
        if (!p.deadline_drive) dl.setHours(23, 59, 59, 999);
        const t = dl.getTime();
        return Number.isFinite(t) ? { kind: 'upload', unlock: t, totalMs: 0 } : null;
      }
      if (st !== 'uploaded') return null;
      const start = new Date(p.created_at).getTime();
      if (!Number.isFinite(start)) return null;
      const totalMs = (Number(p.jumlah_icon) || 1) * 5 * 60 * 1000;
      return { kind: 'report', unlock: start + totalMs, totalMs };
    }
    function fmtHms(ms) {
      const t = Math.max(0, Math.floor(ms / 1000));
      const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), d = t % 60;
      return [h, m, d].map(v => String(v).padStart(2, '0')).join(':');
    }
    function reportGateLabel(unlock, kind) {
      const sisa = unlock - Date.now();
      if (kind === 'upload') {
        return sisa > 0
          ? { cls: 'text-amber-600', html: `<i class="fa-solid fa-hourglass-half"></i> Upload ${fmtHms(sisa)}`, title: 'Sisa batas upload ke Drive (sama dengan timer di halaman desainer)' }
          : { cls: 'text-rose-600', html: `<i class="fa-solid fa-triangle-exclamation"></i> Lewat batas upload`, title: 'Batas upload ke Drive sudah lewat' };
      }
      return sisa > 0
        ? { cls: 'text-amber-600', html: `<i class="fa-solid fa-hourglass-half"></i> Lapor ${fmtHms(sisa)}`, title: 'Sisa waktu sampai desainer boleh mengirim laporan (sama dengan timer tombol Kirim Laporan)' }
        : { cls: 'text-rose-600', html: `<i class="fa-solid fa-triangle-exclamation"></i> Belum lapor`, title: 'Waktu pengerjaan selesai, tetapi desainer belum mengirim laporan' };
    }
    function reportGateHtml(p) {
      const g = reportGate(p);
      if (!g) return '';
      const l = reportGateLabel(g.unlock, g.kind);
      return `<div class="kd-rep-gate mt-1 text-[10px] font-bold font-mono whitespace-nowrap ${l.cls}" data-unlock="${g.unlock}" data-kind="${g.kind}" title="${l.title}">${l.html}</div>`;
    }
    // Hitung mundur di tabel berjalan tanpa merender ulang tabel
    setInterval(() => {
      document.querySelectorAll('.kd-rep-gate[data-unlock]').forEach(el => {
        const l = reportGateLabel(Number(el.dataset.unlock), el.dataset.kind);
        if (el.innerHTML !== l.html) el.innerHTML = l.html;
        el.className = `kd-rep-gate mt-1 text-[10px] font-bold font-mono whitespace-nowrap ${l.cls}`;
        el.title = l.title;
      });
    }, 1000);

    /** Konfirmasi Approve saat desainer belum mengirim laporan. Batal = pilihan aman. */
    function confirmApproveBeforeReport(proj, namaDesainer) {
      return new Promise((resolve) => {
        const g = reportGate(proj);
        const dialog = document.getElementById('modal-custom-dialog');
        const iconBg = document.getElementById('dialog-icon-bg');
        const icon = document.getElementById('dialog-icon');
        const titleEl = document.getElementById('dialog-title');
        const msgEl = document.getElementById('dialog-message');
        const promptBox = document.getElementById('dialog-prompt-container');
        const btnCancel = document.getElementById('dialog-btn-cancel');
        const btnOk = document.getElementById('dialog-btn-ok');
        const jml = Number(proj.jumlah_icon) || 1;
        const nama = namaDesainer || 'Desainer';
        const tema = proj.kategori || 'tema ini';

        const paint = () => {
          const sisa = g.unlock - Date.now();
          if (g.kind === 'upload') {
            titleEl.innerText = 'Desainer belum upload ke Drive';
            msgEl.innerText = sisa > 0
              ? `${nama} belum upload "${tema}" ke Drive dan belum mengirim laporan.\n\nBatas upload: sisa ${fmtHms(sisa)}\n\nApakah Anda yakin ingin menyetujuinya sekarang?`
              : `${nama} belum upload "${tema}" ke Drive dan batas upload sudah lewat.\n\nApakah Anda yakin ingin menyetujuinya?`;
            iconBg.className = "w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl bg-rose-50 text-rose-600 border border-rose-200";
            icon.className = "fa-solid fa-cloud-arrow-up";
          } else if (sisa > 0) {
            titleEl.innerText = 'Desainer masih dalam waktu pengerjaan';
            msgEl.innerText = `${nama} masih diberi waktu ${jml} icon × 5 menit = ${fmtHms(g.totalMs)} untuk "${tema}" dan belum mengirim laporan.\n\nSisa waktu: ${fmtHms(sisa)}\n\nApakah Anda yakin ingin menyetujuinya sekarang?`;
            iconBg.className = "w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl bg-amber-50 text-amber-600 border border-amber-200";
            icon.className = "fa-solid fa-hourglass-half";
          } else {
            titleEl.innerText = 'Desainer belum mengirim laporan';
            msgEl.innerText = `Waktu pengerjaan ${nama} untuk "${tema}" sudah selesai, tetapi laporan belum dikirim.\n\nApakah Anda yakin ingin menyetujuinya?`;
            iconBg.className = "w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl bg-rose-50 text-rose-600 border border-rose-200";
            icon.className = "fa-solid fa-triangle-exclamation";
          }
        };

        promptBox.classList.add('hidden');
        btnCancel.classList.remove('hidden');
        btnOk.innerText = "Tetap Setujui";
        btnOk.className = "bg-white hover:bg-amber-50 text-amber-700 border border-amber-300 text-xs font-bold px-4 py-2 rounded-lg transition";
        const cancelCls = btnCancel.className;
        btnCancel.className = "btn-tokopedia-blue text-xs font-bold px-5 py-2 rounded-lg transition shadow-sm";
        paint();
        const timer = setInterval(paint, 1000);
        dialog.classList.remove('hidden');
        setTimeout(() => { try { btnCancel.focus(); } catch (e) {} }, 30);

        const done = (val) => {
          clearInterval(timer);
          dialog.classList.add('hidden');
          btnCancel.className = cancelCls;
          resolve(val);
        };
        btnOk.onclick = () => done(true);
        btnCancel.onclick = () => done(false);
      });
    }

    /** Tombol ✓ pada proyek yang sudah Approved: hanya simpan koreksi angka. */
    async function reapproveCountsOnly(id, proj, app, rej, rev) {
      const kapan = proj.approved_at ? formatFullDateTime(proj.approved_at) : '';
      const sudah = kapan ? `Tema ini sudah di-approve pada ${kapan}.` : 'Tema ini sudah di-approve.';
      const sama = Number(proj.approved_count) === app && Number(proj.rejected_count) === rej && Number(proj.in_review_count) === rev;
      if (sama) {
        await showModalAlert("Sudah Di-approve", `${sudah}\n\nTidak ada perubahan angka yang perlu disimpan.`, "info");
        return;
      }
      const ok = await showModalConfirm(
        "Sudah Di-approve",
        `${sudah}\n\nSimpan perubahan angka saja?\nApprove: ${app} · Reject: ${rej} · In Review: ${rev}\n\nDesainer tidak akan menerima notifikasi ulang.`
      );
      if (!ok) return;
      const { error } = await supabaseClient.from('icon_projects').update({
        approved_count: app,
        rejected_count: rej,
        in_review_count: rev
      }).eq('id', id);
      if (error) {
        await showModalAlert("Gagal Update", error.message, "error");
        return;
      }
      const namaDesainer = userProfilesMap[proj.designer_id] || 'Desainer';
      await logUserActivity('MODERASI', `Koreksi angka tema "${proj.kategori || 'Icon'}" milik ${namaDesainer} (sudah Approved) — Approve: ${app}, Reject: ${rej}, In Review: ${rev}`);
      await showModalAlert("Tersimpan", "Perubahan angka disimpan. Status & waktu Approve tidak berubah.", "success");
      loadAdminProjects();
      if (isAdminUser) loadAdminOverviewData();
      if (!document.getElementById('modal-slip-gaji').classList.contains('hidden')) {
        calculateSalaryForSelectedUser();
      }
    }

    async function calculateSalaryForSelectedUser() {
      const userId = document.getElementById('select-slip-user').value;
      const startDate = document.getElementById('slip-start-date').value;
      const endDate = document.getElementById('slip-end-date').value;

      if (startDate && endDate) {
        const startFormatted = new Date(startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        const endFormatted = new Date(endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        document.getElementById('slip-periode').innerText = `Periode: ${startFormatted} - ${endFormatted}`;
      } else {
        document.getElementById('slip-periode').innerText = `Periode: -`;
      }

      if (!userId || !startDate || !endDate) {
        document.getElementById('slip-nama').innerText = '-';
        document.getElementById('slip-level-badge').innerText = 'Level 2';
        document.getElementById('slip-level-badge').className = 'font-bold px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700';
        document.getElementById('slip-tarif-label').innerText = 'Rp 750 / Rp 450';
        document.getElementById('slip-total-desain').innerText = '0';
        document.getElementById('slip-ditolak').innerText = '0';
        document.getElementById('slip-diterima').innerText = '0';
        document.getElementById('slip-hasil-desain').innerText = '0';
        document.getElementById('slip-reward-1').innerText = '0';
        document.getElementById('slip-reward-2').innerText = '0';
        document.getElementById('slip-total-pendapatan').innerText = '0';
        return;
      }

      const desainerLevel = userLevelsMap[userId] || 2;
      document.getElementById('slip-nama').innerText = userProfilesMap[userId] || 'Desainer';
      
      const levelBadge = document.getElementById('slip-level-badge');
      const tarifLabel = document.getElementById('slip-tarif-label');

      if (desainerLevel === 3) {
        levelBadge.innerText = 'Level 3 (Rp 2.500 / Rp 1.500)';
        levelBadge.className = 'font-bold px-2 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200';
        tarifLabel.innerText = 'Rp 2.500 / Rp 1.500';
      } else {
        levelBadge.innerText = 'Level 2 (Rp 750 / Rp 450)';
        levelBadge.className = 'font-bold px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200';
        tarifLabel.innerText = 'Rp 750 / Rp 450';
      }

      const startISO = new Date(startDate + "T00:00:00").toISOString();
      const endISO = new Date(endDate + "T23:59:59").toISOString();

      const { data: projects } = await supabaseClient
        .from('icon_projects')
        .select('*')
        .eq('designer_id', userId)
        .gte('created_at', startISO)
        .lte('created_at', endISO);

      let totalDesain = 0;
      let totalDitolak = 0;
      let totalDiterima = 0;
      let hasilDesainRp = 0;

      if (projects) {
        projects.forEach(p => {
          const total = Number(p.jumlah_icon) || 0;
          totalDesain += total;

          if (p.status_admin === 'Approved') {
            const rej = Number(p.rejected_count) || 0;
            const rev = Number(p.in_review_count) || 0;
            const app = Math.max(0, total - (rej + rev));

            totalDitolak += rej;
            totalDiterima += app;

            const { app: tarifApp, rej: tarifRej } = designFeeRates(desainerLevel, p);

            hasilDesainRp += (app * tarifApp) + (rej * tarifRej);
          }
        });
      }

      let reward1 = 0;
      const { data: helpUploads } = await supabaseClient
        .from('icon_projects')
        .select('*')
        .or(`uploader_id.eq.${userId},designer_id.eq.${userId}`)
        .eq('status_admin', 'Approved')
        .gte('created_at', startISO)
        .lte('created_at', endISO);

      if (helpUploads) {
        helpUploads.forEach(h => {
          if (uploadRewardOwner(h) === userId) reward1 += uploadRewardOf(h);
        });
      }

      let reward2 = 0;
      if (totalDiterima >= 100 && totalDiterima <= 199) reward2 = 50000;
      else if (totalDiterima >= 200 && totalDiterima <= 299) reward2 = 120000;
      else if (totalDiterima >= 300) reward2 = 200000;

      const totalPendapatan = hasilDesainRp + reward1 + reward2;

      document.getElementById('slip-total-desain').innerText = totalDesain;
      document.getElementById('slip-ditolak').innerText = totalDitolak;
      document.getElementById('slip-diterima').innerText = totalDiterima;

      document.getElementById('slip-hasil-desain').innerText = hasilDesainRp.toLocaleString('id-ID');
      document.getElementById('slip-reward-1').innerText = reward1.toLocaleString('id-ID');
      document.getElementById('slip-reward-2').innerText = reward2.toLocaleString('id-ID');
      document.getElementById('slip-total-pendapatan').innerText = totalPendapatan.toLocaleString('id-ID');
    }

    function toggleUploaderSelect() {
      const type = document.getElementById('input-upload-type').value;
      document.getElementById('uploader-select-box').classList.toggle('hidden', type !== 'bantuan');
    }

    // Kunci tombol klaim sejak tekanan pertama agar klik/tap beruntun tidak membuat klaim ganda.
    let claimSubmitBusy = false;
    let claimSubmitReachedMain = false;
    async function handleClaimSubmit(e) {
      e.preventDefault();
      if (claimSubmitBusy) return;
      claimSubmitBusy = true;
      claimSubmitReachedMain = false;
      const lockBtn = document.getElementById('btn-submit-claim');
      const lockWasDisabled = lockBtn ? lockBtn.disabled : false;
      if (lockBtn) lockBtn.disabled = true;
      try {
        await handleClaimSubmitMain(e);
      } finally {
        // Ditolak sebelum proses klaim dimulai (validasi/jeda/sesi/level): kembalikan tombol seperti semula.
        if (!claimSubmitReachedMain && lockBtn) lockBtn.disabled = lockWasDisabled;
        claimSubmitBusy = false;
      }
    }

    async function handleClaimSubmitMain(e) {
      if (!selectedThemeData) return await showModalAlert("Peringatan", "Pilih tema terlebih dahulu!", "warning");

      if (!isVideoRequirementMet && currentVideoList.length > 0) {
        await showModalAlert(
          "Syarat Menonton Belum Terpenuhi!", 
          "Setiap desainer wajib menonton 1 video tutorial dari awal sampai akhir tanpa skip ketika list video masih tersedia sebelum mengambil tema.", 
          "warning"
        );
        switchTab('video-tutorials');
        return;
      }

      const targetBelajar = document.getElementById('input-target-belajar').value.trim();
      if (!targetBelajar) {
        return await showModalAlert("Validasi Form", "Harap isi Target Belajar Anda!", "warning");
      }

      const toolDesain = document.getElementById('input-tool-desain').value;
      const jenisIcon = document.getElementById('input-jenis-icon').value;
      const checkConfirm = document.getElementById('check-confirm-claim');
      const checkQuality = document.getElementById('check-confirm-quality');

      if ((checkConfirm && !checkConfirm.checked) || (checkQuality && !checkQuality.checked)) {
        return await showModalAlert("Validasi Form", "Anda wajib menyetujui tenggat pengerjaan dan janji kualitas desain!", "warning");
      }

      const cooldownSubmit = await getClaimCooldowns();
      if (cooldownSubmit[selectedThemeData.kategori]) {
        return await showClaimCooldownAlert(selectedThemeData.kategori, cooldownSubmit[selectedThemeData.kategori]);
      }

      // Pastikan sesi login di browser masih akun yang sama (RLS: designer_id harus = auth.uid()).
      // Jika di tab lain login dengan akun berbeda / sesi kedaluwarsa, klaim akan ditolak Supabase.
      const { data: sessUser } = await supabaseClient.auth.getUser();
      const sessId = sessUser && sessUser.user ? sessUser.user.id : null;
      if (!sessId || sessId !== currentUser.id) {
        await showModalAlert(
          "Sesi Login Berubah",
          !sessId
            ? "Sesi login Anda sudah berakhir. Halaman akan dimuat ulang, silakan login kembali lalu klaim tema lagi."
            : "Browser ini sekarang login dengan akun lain (kemungkinan dari tab lain). Halaman akan dimuat ulang agar akun yang aktif sesuai, lalu silakan klaim tema lagi.",
          "warning"
        );
        location.reload();
        return;
      }

      // Level 2 wajib dibantu upload oleh desainer lain
      if (document.getElementById('input-upload-type').value === 'sendiri' && level2MustBeHelped(await getMyDesignerLevel())) {
        await applyUploadTypeRule();
        return await showModalAlert(
          "Wajib Dibantu Upload",
          "Desainer Level 2 wajib dibantu upload ke Canva oleh desainer lain. Pilih \"Dibantu Desainer Lain\" lalu pilih desainer pembantunya.",
          "warning"
        );
      }

      // Desainer pembantu wajib yang sudah diaktifkan admin
      if (document.getElementById('input-upload-type').value === 'bantuan') {
        const helperSel = document.getElementById('input-uploader-id');
        const helperId = helperSel ? helperSel.value : '';
        if (!helperId || !(await canHelpUpload(helperId))) {
          return await showModalAlert(
            "Desainer Pembantu Tidak Tersedia",
            "Desainer yang dipilih belum diaktifkan admin sebagai pembantu upload. Pilih desainer pembantu lain atau hubungi admin.",
            "warning"
          );
        }
      }

      const btnSubmit = document.getElementById('btn-submit-claim');
      claimSubmitReachedMain = true;
      btnSubmit.disabled = true;
      btnSubmit.innerText = "Memproses Klaim...";

      try {
        const jumlah = parseInt(document.getElementById('input-jumlah').value);
        if (jumlah > selectedThemeData.sisa_kuota) {
          await showModalAlert("Kuota Tidak Cukup", "Jumlah klaim melebihi sisa kuota!", "warning");
          btnSubmit.disabled = false;
          btnSubmit.innerText = "Konfirmasi & Buka Drive";
          return;
        }

        const uploadType = document.getElementById('input-upload-type').value;
        const uploaderSelect = document.getElementById('input-uploader-id');
        const uploaderId = (uploadType === 'bantuan' && uploaderSelect) ? uploaderSelect.value : null;

        let driveFolderUrl = "https://drive.google.com";
   try {
  const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ 
      action: "create_folder",
      desainer_name: currentUser.email, 
      kategori: selectedThemeData.kategori, 
      jumlah_icon: jumlah,
      target_belajar: targetBelajar,
      tool_desain: toolDesain,
      jenis_icon: jenisIcon,
      colors_palette: currentGeneratedColors
    })
  });
  const resData = await response.json();
  if (resData && resData.folder_url) driveFolderUrl = resData.folder_url;
} catch (e) {
  console.error("Gagal membuat folder via Apps Script:", e);
}

        const deadline = new Date();
        deadline.setHours(23, 59, 59, 999);
        const nowIso = new Date().toISOString();

      const payload = {
  designer_id: currentUser.id,
  kategori: selectedThemeData.kategori,
  judul: document.getElementById('txt-judul')?.innerText || selectedThemeData.judul,
  keyword: document.getElementById('txt-keyword')?.innerText || selectedThemeData.keyword,
  jumlah_icon: jumlah,
  in_review_count: jumlah,
  rejected_count: 0,
  approved_count: 0,
  is_upload_sendiri: (uploadType === 'sendiri'),
  uploader_id: uploaderId,
  target_belajar: targetBelajar,
  tool_desain: toolDesain,
  jenis_icon: jenisIcon,
  color_palette: currentGeneratedColors.length > 0 ? currentGeneratedColors.join(', ') : null,
  drive_folder_url: driveFolderUrl,
  deadline_drive: deadline.toISOString(),
  drive_opened_at: nowIso,
  updated_at: nowIso
};

const { data: newProj, error: insertErr } = await supabaseClient
  .from('icon_projects')
  .insert([payload])
  .select()
  .single();

        if (insertErr) throw insertErr;

        if (uploadType === 'bantuan' && uploaderId && uploaderId !== currentUser.id) {
          const senderName = userProfilesMap[currentUser.id] || currentUser.email || 'Seorang Desainer';
          await supabaseClient.from('notifications').insert([{
            user_id: uploaderId,
            project_id: newProj.id,
            title: '🤝 Request Bantu Upload Canva',
            message: `${senderName} meminta bantuan Anda untuk meng-upload tema: "${selectedThemeData.kategori}" (${jumlah} Icon).`,
            type: 'upload_request',
            is_read: false,
            created_at: new Date().toISOString()
          }]);
        }

        const newSisa = selectedThemeData.sisa_kuota - jumlah;
        await supabaseClient.from('themes_stock')
          .update({ sisa_kuota: newSisa, status_stok: newSisa === 0 ? 'Habis' : 'Tersedia' })
          .eq('kategori', selectedThemeData.kategori);

        window.open(driveFolderUrl, '_blank');
        await logUserActivity('KLAIM', `Mengklaim tema "${selectedThemeData.kategori}" sebanyak ${jumlah} icon (Tool: ${toolDesain}).`);
        await showModalAlert("Klaim Sukses", "Tema diklaim! Portal Drive telah dibuka.", "success");

        document.getElementById('form-claim').reset();
        document.getElementById('form-claim').classList.add('hidden');
        document.getElementById('selected-theme-info').innerHTML = `<p class="text-slate-500">Silakan pilih salah satu tema di sebelah kiri terlebih dahulu.</p>`;
        selectedThemeData = null;
        resetPaletteUIBoxes();

        btnSubmit.disabled = true;
        btnSubmit.innerText = "Konfirmasi & Buka Drive";

        const totalVideos = currentVideoList.length;
        const completedCount = currentVideoList.filter(v => userCompletedVideoIds.has(v.id)).length;

        if (totalVideos > 0 && completedCount < totalVideos) {
          isVideoRequirementMet = false;
        } else {
          isVideoRequirementMet = true;
        }

        updateVideoRequirementUI();
        switchTab('my-dashboard');
        loadUserDashboardData();

      } catch (err) {
        await showModalAlert("Gagal Klaim", err.message, "error");
        btnSubmit.disabled = false;
        btnSubmit.innerText = "Konfirmasi & Buka Drive";
      }
    }

    async function copyToClipboard(text) {
      if (!text || text === '-') return;
      navigator.clipboard.writeText(text);
      await showModalAlert("Tersalin", `Teks berhasil disalin:\n"${text}"`, "success");
    }

    function copyText(elementId) {
      const text = document.getElementById(elementId).innerText;
      copyToClipboard(text);
    }

    function switchTab(tabName) {
      if (isAdminUser) {
        document.getElementById('view-claim-designer').classList.add('hidden');
        document.getElementById('view-my-dashboard').classList.add('hidden');

        document.getElementById('view-claim-admin').classList.toggle('hidden', tabName !== 'claim');
        document.getElementById('view-admin-themes').classList.toggle('hidden', tabName !== 'my-dashboard');
        document.getElementById('view-designer-analytics').classList.toggle('hidden', tabName !== 'designer-analytics');

        if (tabName === 'designer-analytics') { loadDesignerAnalyticsData(); }
      } else {
        document.getElementById('view-claim-admin').classList.add('hidden');
        document.getElementById('view-admin-themes').classList.add('hidden');
        document.getElementById('view-designer-analytics').classList.add('hidden');

        document.getElementById('view-claim-designer').classList.toggle('hidden', tabName !== 'claim');
        document.getElementById('view-my-dashboard').classList.toggle('hidden', tabName !== 'my-dashboard');
      }

      document.getElementById('view-video-tutorials').classList.toggle('hidden', tabName !== 'video-tutorials');
      document.getElementById('view-activity-history').classList.toggle('hidden', tabName !== 'activity-history');
      if (tabName !== 'activity-history' && activityRetentionInterval) {
        clearInterval(activityRetentionInterval);
        activityRetentionInterval = null;
      }
      document.getElementById('view-admin').classList.toggle('hidden', tabName !== 'admin');

      const btnClaim = document.getElementById('btn-tab-claim');
      const btnVideos = document.getElementById('btn-tab-video-tutorials');
      const btnDashboard = document.getElementById('btn-tab-dashboard');
      const btnAnalytics = document.getElementById('btn-tab-designer-analytics');
      const btnActivity = document.getElementById('btn-tab-activity-history');
      const btnAdmin = document.getElementById('btn-tab-admin');

      btnClaim.className = "hover:bg-slate-50 px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 text-slate-600 font-bold shrink-0";
      btnVideos.className = "hover:bg-purple-50 text-purple-700 px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 font-bold shrink-0";
      btnDashboard.className = "hover:bg-slate-50 px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 text-slate-600 font-bold shrink-0";
      btnAnalytics.className = "hover:bg-indigo-50 text-indigo-600 px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 font-bold shrink-0" + (isAdminUser ? "" : " hidden");
      btnActivity.className = "hover:bg-teal-50 text-teal-700 px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 font-bold shrink-0";
      btnAdmin.className = "hover:bg-amber-50 text-amber-600 px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 ml-auto font-bold shrink-0" + (isAdminUser ? "" : " hidden");

      if (tabName === 'claim') {
        btnClaim.className = "bg-blue-50 text-blue-600 border border-blue-200 shadow-xs px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 font-bold shrink-0";
      } else if (tabName === 'video-tutorials') {
        btnVideos.className = "bg-purple-100 text-purple-900 border border-purple-300 shadow-xs px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 font-bold shrink-0";
        if (currentVideoList.length === 0) loadVideoTutorialsSection();
      } else if (tabName === 'my-dashboard') {
        btnDashboard.className = "bg-blue-50 text-blue-600 border border-blue-200 shadow-xs px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 font-bold shrink-0";
      } else if (tabName === 'designer-analytics' && isAdminUser) {
        btnAnalytics.className = "bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-xs px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 font-bold shrink-0";
      } else if (tabName === 'activity-history') {
        btnActivity.className = "bg-teal-50 text-teal-700 border border-teal-300 shadow-xs px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 font-bold shrink-0";
        loadActivityHistory(true);
        startActivityRetentionTimer();
      } else if (tabName === 'admin' && isAdminUser) {
        btnAdmin.className = "bg-amber-50 text-amber-600 border border-amber-300 shadow-xs px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 ml-auto font-bold shrink-0";
      }
    }
// Helper otomatis membuat URL pencarian Flaticon sesuai logika kondisi jenis/style tema
function generateFlaticonSearchUrl(kategori) {
  if (!kategori) return 'https://www.flaticon.com';

  // 1. Bersihkan ZWSP / karakter tersembunyi
  let str = kategori.replace(/[\u200B-\u200D\uFEFF]/g, '');

  // 2. Deteksi jenis style dari teks di dalam kurung (case-insensitive)
  let colorParam = 'color';
  let shapeParam = 'fill';

  if (/\(line\)/i.test(str)) {
    colorParam = 'black';
    shapeParam = 'outline';
  } else if (/\(glyph\)/i.test(str)) {
    colorParam = 'black';
    shapeParam = 'fill';
  } else if (/\(flat\)/i.test(str)) {
    colorParam = 'color';
    shapeParam = 'fill';
  }

  // 3. Bersihkan nama kata kunci (menghapus tanda kurung dan isinya, lalu encode URL)
  let cleanWord = str.replace(/\s*\([^)]*\)/gi, '').trim();
  let encodedWord = encodeURIComponent(cleanWord.toLowerCase());

  // 4. Return URL lengkap sesuai parameter Flaticon
  return `https://www.flaticon.com/search?word=${encodedWord}&color=${colorParam}&shape=${shapeParam}`;
}

function handleKeywordLiveAnalysis() {
  const textarea = document.getElementById('theme-keyword');
  const badge = document.getElementById('keyword-counter-badge');
  const previewBox = document.getElementById('keyword-highlight-preview');
  const wordsContainer = document.getElementById('keyword-highlight-words');

  if (!textarea || !badge) return;

  const rawText = textarea.value;
  if (!rawText.trim()) {
    badge.innerText = '0 Kata';
    badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200';
    if (previewBox) previewBox.classList.add('hidden');
    return;
  }

  // 1. Split keyword berdasarkan koma & bersihkan spasi berlebih
  const rawArray = rawText.split(',').map(item => item.trim()).filter(item => item.length > 0);
  const totalCount = rawArray.length;

  // 2. Hitung frekuensi kata (Case-insensitive & pembersihan ZWSP)
  const countMap = {};
  rawArray.forEach(w => {
    const cleanWord = w.toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '');
    countMap[cleanWord] = (countMap[cleanWord] || 0) + 1;
  });

  // 3. Cek apakah ada kata yang duplikat
  let hasDuplicate = false;
  Object.values(countMap).forEach(cnt => {
    if (cnt > 1) hasDuplicate = true;
  });

  // 4. Update Badge Jumlah Kata & Warning
  if (hasDuplicate) {
    badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-1"></i> ${totalCount} Kata (Ada Duplikat!)`;
    badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300 animate-pulse';
  } else {
    badge.innerText = `${totalCount} Kata`;
    badge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200';
  }

  // 5. Render Preview Kata (Tanpa koma & dengan tombol hapus "x")
  if (previewBox && wordsContainer) {
    previewBox.classList.remove('hidden');

    wordsContainer.innerHTML = rawArray.map((w, index) => {
      const cleanWord = w.toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '');
      const isDup = countMap[cleanWord] > 1;

      if (isDup) {
        return `
          <span onclick="removeKeywordByIndex(${index})" 
                class="inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold px-2 py-1 rounded-md text-[11px] shadow-xs cursor-pointer transition group" 
                title="Klik untuk menghapus kata duplikat ini">
            ${esc(w)}
            <i class="fa-solid fa-xmark text-[10px] opacity-80 group-hover:opacity-100"></i>
          </span>`;
      } else {
        return `
          <span onclick="removeKeywordByIndex(${index})" 
                class="inline-flex items-center gap-1.5 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 text-slate-700 font-medium px-2 py-1 rounded-md text-[11px] border border-slate-200 shadow-2xs cursor-pointer transition group" 
                title="Klik untuk menghapus kata ini">
            ${esc(w)}
            <i class="fa-solid fa-xmark text-[10px] text-slate-400 group-hover:text-rose-600"></i>
          </span>`;
      }
    }).join('');
  }
}

// Fungsi Baru: Menghapus Kata Berdasarkan Indeks Posisi
function removeKeywordByIndex(indexToRemove) {
  const textarea = document.getElementById('theme-keyword');
  if (!textarea) return;

  // Split daftar kata berdasarkan koma
  let rawArray = textarea.value.split(',').map(item => item.trim()).filter(item => item.length > 0);

  // Hapus item pada indeks yang diklik
  if (indexToRemove >= 0 && indexToRemove < rawArray.length) {
    rawArray.splice(indexToRemove, 1);
  }

  // Gabungkan kembali dengan koma dan spasi
  textarea.value = rawArray.join(', ');

  // Jalankan ulang analisis live
  handleKeywordLiveAnalysis();
}

async function checkSupabaseUsage() {
  try {
    // Panggil RPC SQL yang dibuat sebelumnya
    const { data: sizeInMB, error } = await supabaseClient.rpc('get_db_size_mb');
    
    if (error) throw error;

    const limitMB = 500; // Limit Free Plan Supabase (500 MB)
    const usedMB = parseFloat(sizeInMB).toFixed(2);
    const percent = Math.min(100, ((usedMB / limitMB) * 100)).toFixed(1);

    const progressBar = document.getElementById('db-progress-bar');
    const usageText = document.getElementById('db-usage-text');
    const percentText = document.getElementById('db-percentage');

    if (usageText) usageText.innerText = `${usedMB} MB / ${limitMB} MB`;
    if (percentText) percentText.innerText = `${percent}%`;

    if (progressBar) {
      progressBar.style.width = `${percent}%`;

      // Perubahan Warna Indikator Sesuai Penggunaan
      if (percent > 85) {
        progressBar.className = 'bg-rose-500 h-2 rounded-full transition-all duration-500';
        percentText.className = 'font-bold text-rose-600 animate-pulse';
      } else if (percent > 65) {
        progressBar.className = 'bg-amber-500 h-2 rounded-full transition-all duration-500';
        percentText.className = 'font-bold text-amber-600';
      } else {
        progressBar.className = 'bg-emerald-500 h-2 rounded-full transition-all duration-500';
        percentText.className = 'font-bold text-emerald-600';
      }
    }
  } catch (err) {
    console.error('Gagal mengambil data kuota Supabase:', err);
  }
}

// Jalankan fungsi saat halaman admin dimuat
// checkSupabaseUsage() kini hanya dipanggil saat admin login (lihat showMainPanel)

// Helper untuk mengacak urutan elemen array (Fisher-Yates Shuffle)
function shuffleArray(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fungsi untuk mengirim metadata ke Extension & membuka Canva Element Creator
// =====================================================================
// DOWNLOAD FILE REVISI — ambil SVG terbaru langsung dari folder Drive proyek
// (lewat Apps Script "designer_list_svg": hanya pemilik / pembantu upload / admin),
// lalu unduh semua sebagai .zip atau per file. Zip dibuat di browser (tanpa kompresi).
// Upload Canva baru aktif setelah file revisi diunduh (zip, atau semua file satu per
// satu) di perangkat ini; status disimpan per akun + proyek + sidik isi folder Drive.
// =====================================================================
const revisionDownload = { files: [], title: '', request: 0, memory: {} };

const REV_CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function revCrc32(bytes) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) c = REV_CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

/** files: [{ name, text }] → Blob .zip (metode "store", nama file UTF-8). */
function revMakeZip(files) {
  const enc = new TextEncoder();
  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (Math.floor(now.getSeconds() / 2));
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const locals = [];
  const centrals = [];
  let offset = 0;
  files.forEach((f) => {
    const name = enc.encode(f.name);
    const data = enc.encode(f.text);
    const crc = revCrc32(data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true); // nama file UTF-8
    local.setUint16(8, 0, true);      // tanpa kompresi
    local.setUint16(10, dosTime, true);
    local.setUint16(12, dosDate, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, name.length, true);
    local.setUint16(28, 0, true);
    locals.push(local, name, data);
    const central = new DataView(new ArrayBuffer(46));
    central.setUint32(0, 0x02014b50, true);
    central.setUint16(4, 20, true);
    central.setUint16(6, 20, true);
    central.setUint16(8, 0x0800, true);
    central.setUint16(10, 0, true);
    central.setUint16(12, dosTime, true);
    central.setUint16(14, dosDate, true);
    central.setUint32(16, crc, true);
    central.setUint32(20, data.length, true);
    central.setUint32(24, data.length, true);
    central.setUint16(28, name.length, true);
    central.setUint32(42, offset, true);
    centrals.push(central, name);
    offset += 30 + name.length + data.length;
  });
  const centralSize = centrals.reduce((s, part) => s + part.byteLength, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, offset, true);
  return new Blob([...locals, ...centrals, end], { type: 'application/zip' });
}

function revSaveBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}

const revSafeName = (s) => String(s || '').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim() || 'file-revisi';

/* ---------- status "sudah download" (per akun, proyek, isi folder) ---------- */

function revSig(files) {
  const text = files.map((f) => f.name + '\u0000' + f.content).join('\u0001');
  let h1 = 5381, h2 = 52711;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    h1 = ((h1 * 33) ^ c) >>> 0;
    h2 = ((h2 * 31) + c) >>> 0;
  }
  return `${files.length}-${h1.toString(36)}-${h2.toString(36)}`;
}

const revKey = (pid) => `rev_dl_${(typeof currentUser !== 'undefined' && currentUser && currentUser.id) || 'guest'}_${pid}`;

function revState(pid) {
  try { return JSON.parse(localStorage.getItem(revKey(pid)) || 'null'); } catch (e) { return null; }
}

function revSave(pid, st) {
  try { localStorage.setItem(revKey(pid), JSON.stringify(st)); } catch (e) { /* mode privat: tetap jalan di sesi ini */ }
  revisionDownload.memory[pid] = st;
}

const revGet = (pid) => revState(pid) || revisionDownload.memory[pid] || null;
// Extension "KEKAL Canva Creator Helper" (v2.3+) terpasang → file diambil langsung dari Drive, tidak perlu download dulu
const canvaHelperVersion = () => document.documentElement.getAttribute('data-kekal-canva-helper') || '';
const isRevisionDownloaded = (pid) => !!canvaHelperVersion() || !!(revGet(pid) && revGet(pid).complete);

/** Tukar tombol terkunci ↔ Upload Canva di baris proyek tanpa muat ulang tabel. */
function revSetLocked(pid, locked) {
  if (locked && canvaHelperVersion()) locked = false;
  document.querySelectorAll('[data-rev-lock]').forEach((b) => { if (b.dataset.revLock === String(pid)) b.classList.toggle('hidden', !locked); });
  document.querySelectorAll('[data-rev-canva]').forEach((b) => { if (b.dataset.revCanva === String(pid)) b.classList.toggle('hidden', locked); });
}

/** Catat file yang diunduh; zip = semua file. */
function revMarkDownloaded(names) {
  const pid = revisionDownload.projectId;
  const files = revisionDownload.files;
  const sig = revSig(files);
  const prev = revGet(pid);
  const done = new Set(prev && prev.sig === sig ? prev.done || [] : []);
  names.forEach((n) => done.add(n));
  const complete = files.every((f) => done.has(f.name));
  revSave(pid, { sig, done: [...done], complete, at: Date.now() });
  if (complete) revSetLocked(pid, false);
  revRenderList();
}

async function revFetchFiles(projectId) {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const token = sessionData && sessionData.session && sessionData.session.access_token;
  if (!token) throw new Error('Sesi login tidak ditemukan. Silakan login ulang.');
  let data;
  try {
    const res = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'designer_list_svg', project_id: projectId, access_token: token })
    });
    data = await res.json();
  } catch (err) {
    throw new Error('Gagal terhubung ke Google Drive. Periksa koneksi internet lalu coba lagi.');
  }
  if (!data || data.status === 'forbidden' || data.status === 'error') throw new Error((data && data.message) || 'Gagal membaca folder Drive.');
  if (!Array.isArray(data.files)) throw new Error('Apps Script belum diperbarui: aksi mode desainer belum di-deploy.');
  return data.files.filter((f) => f && f.name && typeof f.content === 'string');
}

/* ---------- jendela download ---------- */

function revModal() {
  let modal = document.getElementById('modal-download-revisi');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.id = 'modal-download-revisi';
  modal.className = 'fixed inset-0 z-[9998] hidden flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-4';
  modal.innerHTML = `
    <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[88vh]" role="dialog" aria-modal="true" aria-labelledby="dlrev-title">
      <div class="flex items-start gap-3 p-4 sm:p-5 border-b border-slate-100">
        <div class="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><i class="fa-solid fa-file-arrow-down"></i></div>
        <div class="min-w-0 flex-1">
          <h3 id="dlrev-title" class="text-sm sm:text-base font-extrabold text-slate-800 leading-tight">Download File Revisi</h3>
          <p id="dlrev-sub" class="text-[11px] text-slate-500 truncate"></p>
        </div>
        <button type="button" data-dlrev="close" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0" title="Tutup" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div id="dlrev-body" class="p-4 sm:p-5 overflow-y-auto space-y-3"></div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) return closeRevisionDownload();
    const b = e.target.closest('[data-dlrev]');
    if (!b) return;
    const act = b.dataset.dlrev;
    if (act === 'close') closeRevisionDownload();
    else if (act === 'zip') {
      const files = revisionDownload.files;
      if (!files.length) return;
      revSaveBlob(revMakeZip(files.map((f) => ({ name: f.name, text: f.content }))), `${revSafeName(revisionDownload.title)}.zip`);
      revMarkDownloaded(files.map((f) => f.name));
    } else if (act === 'one') {
      const f = revisionDownload.files[Number(b.dataset.index)];
      if (!f) return;
      revSaveBlob(new Blob([f.content], { type: 'image/svg+xml' }), f.name);
      revMarkDownloaded([f.name]);
    } else if (act === 'retry') {
      openRevisionDownload(revisionDownload.projectId, revisionDownload.title, revisionDownload.fromLock);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeRevisionDownload();
  });
  return modal;
}

function closeRevisionDownload() {
  const modal = document.getElementById('modal-download-revisi');
  if (modal) modal.classList.add('hidden');
  revisionDownload.request++;
}

/** Isi jendela: status kunci, tombol zip, daftar file dengan tanda ✓ yang sudah diunduh. */
function revRenderList() {
  const body = document.getElementById('dlrev-body');
  const files = revisionDownload.files;
  if (!body || !files.length) return;
  const st = revGet(revisionDownload.projectId);
  const sig = revSig(files);
  const done = new Set(st && st.sig === sig ? st.done || [] : []);
  const complete = files.every((f) => done.has(f.name));
  const count = files.filter((f) => done.has(f.name)).length;
  body.innerHTML = `
    ${revisionDownload.fromLock && !complete ? `<div class="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-800 font-semibold leading-snug"><i class="fa-solid fa-lock mr-1"></i>Download file revisi terbaru dulu. Setelah semua file terunduh, tombol <b>Upload Canva</b> aktif.</div>` : ''}
    ${complete
      ? `<div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-bold leading-snug"><i class="fa-solid fa-circle-check mr-1"></i>Semua file sudah diunduh di perangkat ini. Tombol Upload Canva sudah aktif.</div>`
      : `<div class="flex items-center gap-2 text-xs">
          <span class="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 font-bold px-2 py-1 rounded-lg"><i class="fa-solid fa-file-image"></i> ${files.length} file SVG</span>
          <span class="text-slate-500">versi terbaru di Drive${count ? ` · <b class="text-blue-700">${count}/${files.length} file terunduh</b>` : ''}</span>
        </div>`}
    <button type="button" data-dlrev="zip" class="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2">
      <i class="fa-solid fa-file-zipper"></i> Download semua (.zip)
    </button>
    <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-snug">
      <i class="fa-solid fa-triangle-exclamation mr-1"></i>Upload file dari download ini ke Canva, <b>bukan file lama</b> di perangkat Anda. Canva tidak menerima .zip — ekstrak dulu, atau download per file di bawah.
    </div>
    <ul class="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
      ${files.map((f, i) => {
        const ok = done.has(f.name);
        return `
        <li class="flex items-center gap-2 px-3 py-2 text-xs ${ok ? 'bg-emerald-50/50' : ''}">
          <i class="${ok ? 'fa-solid fa-circle-check text-emerald-600' : 'fa-regular fa-file-image text-slate-400'} shrink-0"></i>
          <span class="min-w-0 flex-1 truncate font-semibold text-slate-700" title="${esc(f.name)}">${esc(f.name)}</span>
          <button type="button" data-dlrev="one" data-index="${i}" class="shrink-0 ${ok ? 'text-emerald-700 border-emerald-200' : 'text-blue-600 border-slate-200 hover:border-blue-400'} hover:text-blue-800 bg-white border rounded-lg px-2 py-1 font-bold" title="Download ${esc(f.name)}" aria-label="Download ${esc(f.name)}">
            <i class="fa-solid fa-download"></i>
          </button>
        </li>`;
      }).join('')}
    </ul>`;
}

async function openRevisionDownload(projectId, title, fromLock) {
  const modal = revModal();
  const body = document.getElementById('dlrev-body');
  const request = ++revisionDownload.request;
  revisionDownload.projectId = projectId;
  revisionDownload.title = title || 'File revisi';
  revisionDownload.fromLock = !!fromLock;
  revisionDownload.files = [];
  document.getElementById('dlrev-sub').textContent = revisionDownload.title;
  body.innerHTML = `<div class="flex items-center gap-2 text-xs text-slate-500 py-6 justify-center"><i class="fa-solid fa-spinner animate-spin"></i> Memuat file terbaru dari Google Drive...</div>`;
  modal.classList.remove('hidden');

  try {
    const files = await revFetchFiles(projectId);
    if (request !== revisionDownload.request) return;
    if (!files.length) throw new Error('Belum ada file SVG di folder Drive proyek ini.');
    revisionDownload.files = files;
    // Isi folder berubah sejak download terakhir → wajib download ulang
    const st = revGet(projectId);
    if (st && st.sig !== revSig(files)) {
      revSave(projectId, { sig: revSig(files), done: [], complete: false, at: Date.now() });
      revSetLocked(projectId, true);
    }
    revRenderList();
  } catch (err) {
    if (request !== revisionDownload.request) return;
    body.innerHTML = `
      <div class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold"><i class="fa-solid fa-circle-exclamation mr-1"></i>${esc(err.message)}</div>
      <button type="button" data-dlrev="retry" class="w-full bg-white border border-slate-300 hover:border-blue-500 text-slate-700 text-xs font-bold py-2.5 rounded-xl"><i class="fa-solid fa-rotate-right mr-1"></i> Coba lagi</button>`;
  }
}

/** Upload Canva tanpa izin download revisi: wajib lewat extension KEKAL Canva. */
async function uploadCanvaExtOnly(btn, projectId) {
  if (canvaHelperVersion()) return uploadCanvaDirect(btn, projectId);
  return showModalAlert(
    'Extension Wajib Dipasang',
    'Upload Canva wajib memakai extension KEKAL Canva. Pasang extension tersebut di Chrome (minta file dan panduannya ke admin), lalu muat ulang halaman ini dan klik Upload Canva lagi.',
    'warning'
  );
}

/** Upload Canva: wajib sudah download file revisi terbaru (dicek ulang ke Drive). */
async function uploadCanvaGuarded(btn, projectId, title) {
  if (canvaHelperVersion()) return uploadCanvaDirect(btn, projectId);
  if (!isRevisionDownloaded(projectId)) return openRevisionDownload(projectId, title, true);
  if (btn.dataset.checking) return;
  btn.dataset.checking = '1';
  const html = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Memeriksa file revisi...';
  let files = null, error = '';
  try { files = await revFetchFiles(projectId); } catch (err) { error = err.message; }
  btn.disabled = false;
  btn.innerHTML = html;
  delete btn.dataset.checking;
  if (error) return showModalAlert('Gagal Memeriksa File', error, 'error');
  const st = revGet(projectId);
  if (!st || st.sig !== revSig(files)) {
    revSave(projectId, { sig: revSig(files), done: [], complete: false, at: Date.now() });
    revSetLocked(projectId, true);
    await showModalAlert('File Revisi Berubah', 'Isi folder Drive sudah berubah sejak Anda download. Download ulang file terbaru dulu, lalu klik Upload Canva lagi.', 'warning');
    return openRevisionDownload(projectId, title, true);
  }
  return openCanvaFromUI(btn, projectId);
}

/** Upload Canva lewat extension: SVG terbaru diambil dari Drive lalu dititipkan ke extension (tanpa download). */
async function uploadCanvaDirect(btn, projectId) {
  if (btn.dataset.checking) return;
  btn.dataset.checking = '1';
  const html = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Mengambil file dari Drive...';
  let files = null, error = '';
  try { files = await revFetchFiles(projectId); } catch (err) { error = err.message; }
  btn.disabled = false;
  btn.innerHTML = html;
  delete btn.dataset.checking;
  if (error) return showModalAlert('Gagal Mengambil File', error, 'error');
  if (!files.length) return showModalAlert('Belum Ada File', 'Belum ada file SVG di folder Drive proyek ini.', 'warning');
  return openCanvaFromUI(btn, projectId, files);
}

/* ===== Timestamp Upload Canva: wajib tersimpan di database ===== */
const CANVA_PENDING_KEY = 'kekal_canva_pending';
function canvaPendingAll() { try { return JSON.parse(localStorage.getItem(CANVA_PENDING_KEY)) || {}; } catch (e) { return {}; } }
function canvaPendingGet(pid) { return canvaPendingAll()[String(pid)] || null; }
function canvaPendingSet(pid, info, at) { try { const all = canvaPendingAll(); all[String(pid)] = { info, at }; localStorage.setItem(CANVA_PENDING_KEY, JSON.stringify(all)); } catch (e) {} }
function canvaPendingClear(pid) { try { const all = canvaPendingAll(); if (all[String(pid)]) { delete all[String(pid)]; localStorage.setItem(CANVA_PENDING_KEY, JSON.stringify(all)); } } catch (e) {} }
const canvaSaving = new Set();
const canvaAutoTried = new Set();

function canvaBannerHtml(pid, info, pending) {
  return `<div data-canva-banner="${esc(pid)}" class="bg-slate-200 text-slate-700 border border-slate-300 text-[10px] px-3 py-2 rounded-lg font-semibold leading-snug text-center mx-auto w-full">
    <i class="fa-solid fa-circle-check text-slate-500 mr-1"></i> ${esc(info)}
    ${pending ? canvaWarnHtml(pid) : ''}
  </div>`;
}
function canvaWarnHtml(pid) {
  return `<div data-canva-warn class="mt-1.5 pt-1.5 border-t border-slate-300 text-rose-600 font-bold">
    <i class="fa-solid fa-triangle-exclamation"></i> Waktu upload belum tersimpan ke server.
    <button type="button" onclick="retryCanvaSave(${jsArg(pid)}, this)" class="ml-1 underline text-blue-700 hover:text-blue-900">Simpan ulang</button>
  </div>`;
}

/** Simpan canva_uploaded_info dari cadangan perangkat; cek baris benar-benar berubah, coba ulang 3x. */
async function saveCanvaUploadInfo(pid, bannerEl) {
  const pend = canvaPendingGet(pid);
  if (!pend || canvaSaving.has(String(pid))) return false;
  canvaSaving.add(String(pid));
  let lastErr = '';
  try {
    for (let i = 0; i < 3; i++) {
      try {
        const { data, error } = await supabaseClient
          .from('icon_projects')
          .update({ canva_uploaded_info: pend.info, updated_at: pend.at || new Date().toISOString() })
          .eq('id', pid)
          .select('id, canva_uploaded_info');
        if (!error && data && data.length && data[0].canva_uploaded_info) {
          canvaPendingClear(pid);
          document.querySelectorAll(`[data-canva-banner="${CSS.escape(String(pid))}"] [data-canva-warn]`).forEach((w) => w.remove());
          if (bannerEl) { const w = bannerEl.querySelector('[data-canva-warn]'); if (w) w.remove(); }
          return true;
        }
        lastErr = error ? error.message : 'Data tidak tersimpan (akses ditolak database).';
      } catch (e) { lastErr = e.message || String(e); }
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
    console.error('Gagal menyimpan status upload Canva:', lastErr);
    const banners = bannerEl ? [bannerEl] : [...document.querySelectorAll(`[data-canva-banner="${CSS.escape(String(pid))}"]`)];
    banners.forEach((b) => { if (b && b.isConnected && !b.querySelector('[data-canva-warn]')) b.insertAdjacentHTML('beforeend', canvaWarnHtml(pid)); });
    return false;
  } finally {
    canvaSaving.delete(String(pid));
  }
}

async function retryCanvaSave(pid, btn) {
  const banner = btn && btn.closest('[data-canva-banner]');
  if (btn) { btn.disabled = true; btn.textContent = 'Menyimpan...'; }
  const ok = await saveCanvaUploadInfo(pid, banner);
  if (ok) showModalAlert('Tersimpan', 'Waktu upload Canva sudah tersimpan.', 'success');
  else if (btn && btn.isConnected) { btn.disabled = false; btn.textContent = 'Simpan ulang'; }
  if (!ok) showModalAlert('Belum Tersimpan', 'Waktu upload Canva masih gagal disimpan. Periksa koneksi internet lalu klik "Simpan ulang" lagi. Jika terus gagal, hubungi admin.', 'error');
}

async function openCanvaFromUI(btnElement, projectId, driveFiles) {
  // 1. Cari kontainer baris/kartu utama tempat tombol berada
  const parentContainer = btnElement.closest('tr') || btnElement.closest('li') || btnElement.closest('.border') || btnElement.parentElement.parentElement;
  
  let judulIcon = '';
  let keywordStr = '';

  if (parentContainer) {
    // 2. Ekstrak teks langsung dari elemen UI (Kotak Judul & Keyword di kanan)
    const containerText = parentContainer.innerText || parentContainer.textContent || '';
    
    // Mengambil teks persis setelah kata "Judul:" sampai akhir baris
    const matchJudul = containerText.match(/Judul:\s*([^\n\r]+)/i);
    // Mengambil teks persis setelah kata "Keyword:" sampai akhir baris
    const matchKeyword = containerText.match(/Keyword:\s*([^\n\r]+)/i);

    if (matchJudul && matchJudul[1]) {
      judulIcon = matchJudul[1].replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    }
    
    if (matchKeyword && matchKeyword[1]) {
      keywordStr = matchKeyword[1].replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    }
  }

// Fallback jika ekstrak UI tidak menemukan hasil

  // --- TAMBAHAN BARU: POP-UP KONFIRMASI UPLOAD CANVA ---
  const isConfirmed = await showModalConfirm(
    "Konfirmasi Upload Canva",
    `Apakah Anda yakin ingin mengupload desain "${judulIcon || 'ini'}" ke Canva sekarang?\n\n${driveFiles && driveFiles.length ? `${driveFiles.length} file SVG dari Drive akan otomatis dimasukkan ke Canva oleh extension, lalu judul, seniman & keyword diisi.\n\n` : ''}Setelah dikonfirmasi, waktu upload (timestamp) akan langsung dicatat dan tidak dapat dibatalkan.`
  );
  if (!isConfirmed) return;
  // -----------------------------------------------------

  const designerName = (typeof currentUser !== 'undefined' && currentUser && typeof userProfilesMap !== 'undefined' && userProfilesMap[currentUser.id]) 
                    || (typeof currentUser !== 'undefined' && currentUser && currentUser.email) 
                    || 'KEKAL Studio';

  // 3. Format waktu & hari saat ini: hari {x}, dd-mm-yyyy pukul hh:mm:ss oleh {uploader/designer}
  const now = new Date();
  const namaHariList = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
  const namaHari = namaHariList[now.getDay()];
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  const infoUploadText = `Tema ini telah diupload pada hari ${namaHari}, ${dd}-${mm}-${yyyy} pukul ${hh}:${min}:${ss} oleh ${designerName}`;

  // 4. Ubah tombol menjadi banner abu-abu secara langsung di UI
  const bannerDiv = document.createElement('div');
  bannerDiv.className = "bg-slate-200 text-slate-700 border border-slate-300 text-[10px] px-3 py-2 rounded-lg font-semibold leading-snug text-center mx-auto w-full";
  bannerDiv.innerHTML = `<i class="fa-solid fa-circle-check text-slate-500 mr-1"></i> ${esc(infoUploadText)}`;
  if (projectId) bannerDiv.setAttribute('data-canva-banner', String(projectId));
  btnElement.replaceWith(bannerDiv);

  // 5. Simpan keterangan upload Canva ke Supabase (dicek & dicoba ulang; cadangan di perangkat)
  if (projectId && typeof supabaseClient !== 'undefined') {
    canvaPendingSet(projectId, infoUploadText, now.toISOString());
    saveCanvaUploadInfo(projectId, bannerDiv);
  }

  const payloadData = {
    judul: judulIcon || 'USB flash drive icon',
    keyword: keywordStr || '',
    seniman: designerName,
    timestamp: now.getTime()
  };

  try {
    localStorage.setItem("kekal_autofill_data", JSON.stringify(payloadData));
  } catch (e) {}

  // 6. Encode data ke parameter URL Canva & buka halaman upload
  const encodedJudul = encodeURIComponent(payloadData.judul);
  const encodedKeyword = encodeURIComponent(payloadData.keyword);
  const encodedSeniman = encodeURIComponent(payloadData.seniman);

  // File SVG dari Drive → dititipkan ke extension (disimpan sementara di perangkat ini)
  let batchParam = '';
  if (driveFiles && driveFiles.length) {
    const batchId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    window.postMessage({
      type: 'KEKAL_CANVA_FILES',
      payload: {
        id: batchId,
        projectId: String(projectId || ''),
        meta: payloadData,
        files: driveFiles.map((f) => ({ name: f.name, content: f.content }))
      }
    }, window.location.origin);
    batchParam = `&kekal_batch=${batchId}`;
  }

  const canvaUrl = `https://www.canva.com/creators/element/upload?kekal_title=${encodedJudul}&kekal_keyword=${encodedKeyword}&kekal_artist=${encodedSeniman}${batchParam}`;

  window.open(canvaUrl, "_blank");
  logUserActivity('UPLOAD_CANVA', `Mengunggah desain "${judulIcon || 'Icon'}" ke Canva Creator.`);
}

    // ==========================================
    // PENATA IKON: CATAT STATUS "SUDAH DIUPLOAD KE ADOBE STOCK"
    // Dipanggil modal Penata Ikon setelah tombol "Upload Adobe" (perlu kolom adobe_uploaded_info)
    // ==========================================
    async function recordAdobeUpload(projectId) {
      const actorName = (currentUser && (userProfilesMap[currentUser.id] || currentUser.email)) || 'KEKAL Studio';
      const now = new Date();
      const namaHari = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'][now.getDay()];
      const pad = (n) => String(n).padStart(2, '0');
      const tanggal = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
      const jam = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const info = `Diupload ke Adobe Stock pada hari ${namaHari}, ${tanggal} pukul ${jam} oleh ${actorName}`;

      const { error } = await supabaseClient
        .from('icon_projects')
        .update({ adobe_uploaded_info: info })
        .eq('id', projectId);
      if (error) throw new Error(error.message);

      const row = allAdminProjectsData.find((p) => String(p.id) === String(projectId));
      if (row) row.adobe_uploaded_info = info;
      lastAdminTableHash = '';
      renderAdminProjectsTable();
      logUserActivity('UPLOAD_ADOBE', `Mengunggah "${row ? row.kategori : 'icon set'}" ke Adobe Stock.`);
      return info;
    }

// ==========================================
    // LOGIKA FITUR LEVEL DESAINER (TERBARU)
    // ==========================================

    async function evaluateAndUpdateDesignerLevel(userId) {
      if (!userId) return;

      try {
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('id, level, role')
          .eq('id', userId)
          .single();

        if (!profile) return;

        const currentLevel = profile.level || 2;
        const now = new Date();

        const { data: projects } = await supabaseClient
          .from('icon_projects')
          .select('created_at, jumlah_icon, approved_count, status_admin')
          .eq('designer_id', userId)
          .order('created_at', { ascending: false });

        let lastClaimDate = null;
        if (projects && projects.length > 0) {
          lastClaimDate = new Date(projects[0].created_at);
        }

        let newLevel = currentLevel;

        if (currentLevel === 3) {
          // Logika Level 3: Jika 30 hari penuh tidak klaim -> Turun ke Level 2
          if (lastClaimDate) {
            const diffInMs = now - lastClaimDate;
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
            if (diffInDays >= 30) {
              newLevel = 2;
            }
          } else {
            newLevel = 2;
          }
        } else {
          // Logika Level 2: Aktif klaim 30 hari unik & total approved_count (status_admin = Approved) >= 1000 -> Naik ke Level 3
          const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
          
          if (projects && projects.length > 0) {
            const recentProjects = projects.filter(p => new Date(p.created_at) >= thirtyDaysAgo);
            
            const uniqueClaimDays = new Set(
              recentProjects.map(p => new Date(p.created_at).toISOString().split('T')[0])
            );

            let totalApprovedCount = 0;
            recentProjects.forEach(p => {
              if (p.status_admin === 'Approved') {
                totalApprovedCount += (Number(p.approved_count) || (Number(p.jumlah_icon) - (Number(p.rejected_count) || 0)));
              }
            });

            if (uniqueClaimDays.size >= 30 && totalApprovedCount >= 1000) {
              newLevel = 3;
            }
          }
        }

        // Update database Supabase jika level berubah
        if (newLevel !== currentLevel) {
          await supabaseClient
            .from('profiles')
            .update({ level: newLevel })
            .eq('id', userId);
          
          userLevelsMap[userId] = newLevel;
        }

        renderLevelBadgeUI(userId, newLevel, lastClaimDate);

      } catch (err) {
        console.error("Error evaluateAndUpdateDesignerLevel:", err);
      }
    }

    function renderLevelBadgeUI(userId, level, lastClaimDate) {
      const badgeContainer = document.getElementById('header-designer-level-badge');
      if (!badgeContainer) return;

      if (!currentUser || currentUser.id !== userId) {
        badgeContainer.classList.add('hidden');
        return;
      }

      badgeContainer.classList.remove('hidden');

      if (level === 3) {
        const now = new Date();
        const diffInMs = lastClaimDate ? (now - lastClaimDate) : (25 * 60 * 60 * 1000);
        const twentyFourHoursMs = 24 * 60 * 60 * 1000;

        if (diffInMs <= twentyFourHoursMs) {
          // Minimal 1 klaim dalam 24 jam -> Animasi Hijau Aktif
          badgeContainer.innerHTML = `
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs animate-pulse">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Level 3 Aktif
            </span>
          `;
        } else {
          // Tidak aktif > 24 jam -> Countdown 30 hari (Hari, Jam, Menit, Detik)
          const expirationTime = new Date(lastClaimDate.getTime() + (30 * 24 * 60 * 60 * 1000));
          
          function updateLevel3Countdown() {
            const currentTime = new Date();
            const distance = expirationTime - currentTime;

            if (distance <= 0) {
              clearInterval(window.levelCountdownInterval);
              evaluateAndUpdateDesignerLevel(userId);
              return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            badgeContainer.innerHTML = `
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                <i class="fa-solid fa-clock text-amber-600"></i> Level 3 Expire: ${days}h ${hours}j ${minutes}m ${seconds}d
              </span>
            `;
          }

          if (window.levelCountdownInterval) clearInterval(window.levelCountdownInterval);
          updateLevel3Countdown();
          window.levelCountdownInterval = setInterval(updateLevel3Countdown, 1000);
        }
      } else {
        badgeContainer.innerHTML = `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <i class="fa-solid fa-user text-slate-500"></i> Level 2
          </span>
        `;
      }
    }

  let flashCountdownInterval = null;

    function handleFlashTargetTypeChange() {
      const type = document.getElementById('flash-target-type').value;
      document.getElementById('flash-target-level-box').classList.toggle('hidden', type !== 'level');
      document.getElementById('flash-target-designer-box').classList.toggle('hidden', type !== 'designer');
    }

    function checkUserTargetMatch(targetType, targetValue) {
      if (!currentUser) return false;
      if (targetType === 'all') return true;
      if (targetType === 'level') {
        const myLevel = String(userLevelsMap[currentUser.id] || 2);
        return myLevel === String(targetValue);
      }
      if (targetType === 'designer') {
        return currentUser.id === targetValue || currentUser.email === targetValue;
      }
      return false;
    }

    function hideSmoothFlashModal() {
      const modal = document.getElementById('modal-flash-banner');
      const card = document.getElementById('modal-flash-banner-card');
      if (!modal || !card) return;

      modal.classList.add('opacity-0');
      card.classList.remove('scale-100');
      card.classList.add('scale-95');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    }

   // --- Pop-up informasi: antrean & penanda "sudah dibaca" ---
    // Penanda baca memakai id + updated_at + sidik isi pesan, jadi setiap kali admin
    // mengedit teks, pop-up pasti muncul lagi walau updated_at tidak berubah.
    let flashQueue = [];          // pop-up berikutnya yang menunggu giliran
    let flashCurrent = null;      // pop-up yang sedang tampil
    const flashSeenSig = {};      // id -> versi terakhir yang sudah diproses (cegah tampil ulang karena update read_by)

    function flashNoticeSig(data) {
      const text = String(data.message || '');
      let h = 5381;
      for (let i = 0; i < text.length; i++) h = ((h * 33) ^ text.charCodeAt(i)) >>> 0;
      return `${new Date(data.updated_at || 0).getTime() || 0}_${h.toString(36)}`;
    }

    function flashNoticeKey(data) {
      const userId = currentUser ? currentUser.id : 'guest';
      return `read_notice_${userId}_${data.id}_${flashNoticeSig(data)}`;
    }

    function isFlashNoticeRead(data) {
      try { return localStorage.getItem(flashNoticeKey(data)) === 'true'; } catch (e) { return false; }
    }

    function isFlashModalOpen() {
      const modal = document.getElementById('modal-flash-banner');
      return !!(modal && !modal.classList.contains('hidden') && flashCurrent);
    }

    function isFlashNoticeEligible(data) {
      return !!(data && data.id && data.is_active && data.message && checkUserTargetMatch(data.target_type, data.target_value) && !isFlashNoticeRead(data));
    }

    function showNextFlashNotice() {
      flashQueue = flashQueue.filter(isFlashNoticeEligible);
      const next = flashQueue.shift();
      if (next) showSmoothFlashModal(next);
    }

    /** Admin menonaktifkan / menghapus pop-up: buang dari antrean, tutup jika sedang tampil. */
    function dropFlashNotice(id) {
      flashQueue = flashQueue.filter(n => String(n.id) !== String(id));
      if (flashCurrent && String(flashCurrent.id) === String(id)) {
        if (flashCountdownInterval) clearInterval(flashCountdownInterval);
        flashCurrent = null;
        hideSmoothFlashModal();
        setTimeout(showNextFlashNotice, 350);
      }
    }

   function showSmoothFlashModal(data, isRealtimeUpdate = false) {
      const modal = document.getElementById('modal-flash-banner');
      const card = document.getElementById('modal-flash-banner-card');
      const content = document.getElementById('flash-banner-content');
      const btn = document.getElementById('btn-understand-flash');
      const btnText = document.getElementById('btn-understand-text');
      const btnCloseTemp = document.getElementById('btn-close-flash-temp');

      if (!modal || !data || !data.is_active || !data.message) return;

      // Cek apakah desainer saat ini termasuk target sasaran
      if (!checkUserTargetMatch(data.target_type, data.target_value)) return;

      // Sudah klik "Saya Mengerti" untuk versi isi ini -> jangan munculkan
      if (isFlashNoticeRead(data)) return;

      const sig = flashNoticeSig(data);
      flashSeenSig[data.id] = sig;

      if (isFlashModalOpen()) {
        if (String(flashCurrent.id) === String(data.id)) {
          // Pop-up yang sama sedang tampil: perbarui isinya jika diedit admin, tanpa mengulang hitungan
          if (flashNoticeSig(flashCurrent) !== sig) content.innerHTML = window.parseObsidianFormat(data.message);
          flashCurrent = data;
          return;
        }
        // Pop-up lain sedang tampil: masukkan ke antrean (ganti versi lama jika ada)
        flashQueue = flashQueue.filter(n => String(n.id) !== String(data.id));
        flashQueue.push(data);
        return;
      }

      flashCurrent = data;
      flashQueue = flashQueue.filter(n => String(n.id) !== String(data.id));
      const noticeKey = flashNoticeKey(data);

      content.innerHTML = window.parseObsidianFormat(data.message);
      content.scrollTop = 0;
      btn.disabled = true;

      // Tampilkan Modal Efek Smooth
      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.remove('opacity-0');
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
      }, 50);

      // Hitungan Mundur 5 Detik
      let timeLeft = 5;
      btnText.innerText = `Mengerti (${timeLeft}s)`;

      if (flashCountdownInterval) clearInterval(flashCountdownInterval);

      flashCountdownInterval = setInterval(() => {
        timeLeft -= 1;
        if (timeLeft <= 0) {
          clearInterval(flashCountdownInterval);
          btn.disabled = false;
          btnText.innerText = "Saya Mengerti";
        } else {
          btnText.innerText = `Mengerti (${timeLeft}s)`;
        }
      }, 1000);

      // Tombol Saya Mengerti -> Simpan ke LocalStorage agar tidak muncul lagi pada refresh berikutnya
    btn.onclick = async () => {
        const shown = flashCurrent || data;
        try { localStorage.setItem(flashNoticeKey(shown), 'true'); } catch (e) {}
        flashCurrent = null;
        hideSmoothFlashModal();
        // Pop-up berikutnya (jika ada) muncul setelah animasi tutup selesai
        setTimeout(showNextFlashNotice, 350);

        if (currentUser && shown.id) {
          const existingReaders = Array.isArray(shown.read_by) ? shown.read_by : [];
          if (!existingReaders.includes(currentUser.id)) {
            const updatedReaders = [...existingReaders, currentUser.id];
            await supabaseClient
              .from('popup_notices')
              .update({ read_by: updatedReaders })
              .eq('id', shown.id);
          }
        }
      };

      // Tombol [X] -> Tutup sementara (Akan tetap muncul jika di-refresh / auto refresh idle)
      if (btnCloseTemp) {
        btnCloseTemp.onclick = () => {
          if (flashCountdownInterval) clearInterval(flashCountdownInterval);
          flashCurrent = null;
          flashQueue = [];
          hideSmoothFlashModal();
        };
      }
    }

    // Mengambil data dari tabel popup_notices saat login / refresh
    async function loadFlashBannerAnnouncement() {
      try {
        if (!currentUser) return;
        const { data } = await supabaseClient
          .from('popup_notices')
          .select('*')
          .eq('is_active', true)
          .order('updated_at', { ascending: false });

        if (!data || data.length === 0) return;

        // Tampilkan SEMUA pop-up yang sesuai target & belum dibaca, berurutan dari yang terbaru
        data.filter(isFlashNoticeEligible).forEach(n => showSmoothFlashModal(n));
      } catch (err) {
        console.warn("Popup notice error:", err.message);
      }
    }

    // 1. Helper fungsi apply formatting (Obsidian style)
    window.applyMarkdownStyle = function(prefix, suffix, defaultText, isLinePrefix) {
      if (suffix === undefined) suffix = '';
      if (defaultText === undefined) defaultText = 'teks';
      if (isLinePrefix === undefined) isLinePrefix = false;

      // Handle khusus untuk tag underline tanpa menggunakan karakter < > di inline HTML onclick
      if (prefix === 'u' && suffix === 'u') {
        prefix = '<u>';
        suffix = '</u>';
      }

      const textarea = document.getElementById('flash-message-content');
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const textToUse = selectedText || defaultText;

      let replacement = '';
      if (isLinePrefix) {
        replacement = `${prefix}${textToUse}`;
      } else {
        replacement = `${prefix}${textToUse}${suffix}`;
      }

      textarea.focus();
      textarea.setRangeText(replacement, start, end, 'select');
    };

    // 2. Keyboard Shortcuts (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+K, Ctrl+1, Ctrl+2, Ctrl+3)
    document.addEventListener('keydown', (e) => {
      const flashTextarea = document.getElementById('flash-message-content');
      if (!flashTextarea || document.activeElement !== flashTextarea) return;

      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === 'b') {
          e.preventDefault();
          window.applyMarkdownStyle('**', '**', 'teks tebal');
        } else if (key === 'i') {
          e.preventDefault();
          window.applyMarkdownStyle('*', '*', 'teks miring');
        } else if (key === 'u') {
          e.preventDefault();
          window.applyMarkdownStyle('u', 'u', 'teks garis bawah');
        } else if (key === 'k') {
          e.preventDefault();
          window.applyMarkdownStyle('[', '](https://)', 'Teks Link');
        } else if (key === '1') {
          e.preventDefault();
          window.applyMarkdownStyle('# ', '', 'Judul Utama', true);
        } else if (key === '2') {
          e.preventDefault();
          window.applyMarkdownStyle('## ', '', 'Sub Judul', true);
        } else if (key === '3') {
          e.preventDefault();
          window.applyMarkdownStyle('### ', '', 'Sub Heading', true);
        }
      }
    });

    // 3. Utility Parser Obsidian Markdown ke HTML
    window.parseObsidianFormat = (function() {
  // Semua teks di-escape dulu (anti-XSS); hanya tag <u> dari toolbar yang diizinkan kembali.
  const CALLOUTS = {
    note:      { label: 'Catatan',    icon: 'fa-circle-info',          cls: 'border-sky-500 bg-sky-50 text-sky-900' },
    info:      { label: 'Info',       icon: 'fa-circle-info',          cls: 'border-sky-500 bg-sky-50 text-sky-900' },
    abstract:  { label: 'Ringkasan',  icon: 'fa-clipboard-list',       cls: 'border-cyan-500 bg-cyan-50 text-cyan-900' },
    summary:   { label: 'Ringkasan',  icon: 'fa-clipboard-list',       cls: 'border-cyan-500 bg-cyan-50 text-cyan-900' },
    todo:      { label: 'To-do',      icon: 'fa-list-check',           cls: 'border-sky-500 bg-sky-50 text-sky-900' },
    tip:       { label: 'Tips',       icon: 'fa-lightbulb',            cls: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
    hint:      { label: 'Tips',       icon: 'fa-lightbulb',            cls: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
    success:   { label: 'Berhasil',   icon: 'fa-circle-check',         cls: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
    check:     { label: 'Berhasil',   icon: 'fa-circle-check',         cls: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
    done:      { label: 'Selesai',    icon: 'fa-circle-check',         cls: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
    important: { label: 'Penting',    icon: 'fa-circle-exclamation',   cls: 'border-indigo-500 bg-indigo-50 text-indigo-900' },
    warning:   { label: 'Peringatan', icon: 'fa-triangle-exclamation', cls: 'border-amber-500 bg-amber-50 text-amber-900' },
    caution:   { label: 'Perhatian',  icon: 'fa-triangle-exclamation', cls: 'border-amber-500 bg-amber-50 text-amber-900' },
    attention: { label: 'Perhatian',  icon: 'fa-triangle-exclamation', cls: 'border-amber-500 bg-amber-50 text-amber-900' },
    danger:    { label: 'Bahaya',     icon: 'fa-bolt',                 cls: 'border-rose-500 bg-rose-50 text-rose-900' },
    error:     { label: 'Error',      icon: 'fa-circle-xmark',         cls: 'border-rose-500 bg-rose-50 text-rose-900' },
    failure:   { label: 'Gagal',      icon: 'fa-circle-xmark',         cls: 'border-rose-500 bg-rose-50 text-rose-900' },
    bug:       { label: 'Bug',        icon: 'fa-bug',                  cls: 'border-rose-500 bg-rose-50 text-rose-900' },
    question:  { label: 'Pertanyaan', icon: 'fa-circle-question',      cls: 'border-violet-500 bg-violet-50 text-violet-900' },
    faq:       { label: 'FAQ',        icon: 'fa-circle-question',      cls: 'border-violet-500 bg-violet-50 text-violet-900' },
    help:      { label: 'Bantuan',    icon: 'fa-circle-question',      cls: 'border-violet-500 bg-violet-50 text-violet-900' },
    example:   { label: 'Contoh',     icon: 'fa-list',                 cls: 'border-purple-500 bg-purple-50 text-purple-900' },
    quote:     { label: 'Kutipan',    icon: 'fa-quote-left',           cls: 'border-slate-400 bg-slate-50 text-slate-700' },
    cite:      { label: 'Kutipan',    icon: 'fa-quote-left',           cls: 'border-slate-400 bg-slate-50 text-slate-700' }
  };
  const SAFE_URL = /^(https?:\/\/|mailto:)/i;
  const FENCE = /^\s*(`{3,}|~{3,})\s*([^`\s]*)\s*$/;
  const HR = /^\s*([-*_])(?:\s*\1){2,}\s*$/;
  const HEADING = /^(#{1,6})\s*(.+?)\s*#*\s*$/;
  const LIST = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
  const TABLE_SEP = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
  const HEAD_CLS = [
    'text-lg font-black text-indigo-900',
    'text-base font-extrabold text-slate-900',
    'text-sm font-extrabold text-slate-800',
    'text-sm font-bold text-slate-800',
    'text-xs font-bold text-slate-800',
    'text-xs font-bold text-slate-500 uppercase tracking-wide'
  ];

  /** Format di dalam satu baris: kode, link, wikilink, tebal, miring, coret, highlight. */
  function inline(raw) {
    const tokens = [];
    const put = (html) => '\u0000' + (tokens.push(html) - 1) + '\u0000';
    let s = esc(raw);

    s = s.replace(/(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/g, (m, ticks, code) =>
      put(`<code class="font-mono text-[0.85em] bg-slate-100 text-rose-700 border border-slate-200 rounded px-1 py-px">${code.trim() || code}</code>`));
    s = s.replace(/&lt;u&gt;/gi, '<u>').replace(/&lt;\/u&gt;/gi, '</u>');

    // Gambar ![alt](url) & embed ![[...]]
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, url) => SAFE_URL.test(url)
      ? put(`<img src="${url}" alt="${alt}" class="max-w-full h-auto rounded-lg border border-slate-200 my-1" loading="lazy">`)
      : alt);
    // Wikilink [[Catatan]] / [[Catatan|Alias]] / [[Catatan#Bagian]] -> teks tersorot (tidak ada catatan tujuan di pop-up)
    s = s.replace(/!?\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g, (m, target, alias) =>
      put(`<span class="font-bold text-indigo-700 bg-indigo-50 rounded px-1">${emphasis(alias || target.replace(/#\^?/, ' › '))}</span>`));
    // Link [teks](url) — hanya http/https/mailto
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, (m, text, url) => SAFE_URL.test(url)
      ? put(`<a href="${url}" target="_blank" rel="noopener" class="text-indigo-600 underline font-bold hover:text-indigo-800">${emphasis(text)}</a>`)
      : emphasis(text));
    // Link mentah https://...
    s = s.replace(/(^|[\s(])(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, (m, pre, url) =>
      pre + put(`<a href="${url}" target="_blank" rel="noopener" class="text-indigo-600 underline font-bold hover:text-indigo-800 break-all">${url}</a>`));

    s = emphasis(s);
    for (let i = 0; i < 3 && s.indexOf('\u0000') !== -1; i++) {
      s = s.replace(/\u0000(\d+)\u0000/g, (m, n) => tokens[n]);
    }
    return s;
  }

  function emphasis(s) {
    return s
      .replace(/(\*\*|__)(?=\S)([\s\S]*?\S)\1/g, '<strong>$2</strong>')
      .replace(/(^|[^\w*])\*(?=[^\s*])([^*]*?[^\s*]|[^\s*])\*(?![\w*])/g, '$1<em>$2</em>')
      .replace(/(^|[^\w])_(?=[^\s_])([^_]*?[^\s_]|[^\s_])_(?!\w)/g, '$1<em>$2</em>')
      .replace(/~~(?=\S)([\s\S]*?\S)~~/g, '<del>$1</del>')
      .replace(/==(?=\S)([\s\S]*?\S)==/g, '<mark class="bg-amber-200 text-amber-950 px-1 rounded font-semibold">$1</mark>');
  }

  const splitRow = (line) => {
    let t = line.trim().replace(/\\\|/g, '\u0001');
    if (t.startsWith('|')) t = t.slice(1);
    if (t.endsWith('|')) t = t.slice(0, -1);
    return t.split('|').map(c => c.trim().replace(/\u0001/g, '|'));
  };

  function renderList(items) {
    // items: [{indent, ordered, num, text}] -> daftar bertingkat sesuai indentasi
    let html = '';
    let i = 0;
    while (i < items.length) {
      const base = items[i].indent;
      const ordered = items[i].ordered;
      const tag = ordered ? 'ol' : 'ul';
      const start = ordered && items[i].num !== 1 ? ` start="${items[i].num}"` : '';
      html += `<${tag}${start} class="${ordered ? 'list-decimal' : 'list-disc'} pl-5 my-0.5 space-y-0.5 text-slate-700">`;
      while (i < items.length && items[i].indent === base && items[i].ordered === ordered) {
        const it = items[i++];
        const children = [];
        while (i < items.length && items[i].indent > base) children.push(items[i++]);
        const task = it.text.match(/^\[([ xX\/-])\]\s+(.*)$/);
        const sub = children.length ? renderList(children) : '';
        if (task) {
          const done = task[1] !== ' ';
          html += `<li class="list-none -ml-5"><span class="flex items-start gap-1.5"><i class="${done ? 'fa-solid fa-square-check text-emerald-600' : 'fa-regular fa-square text-slate-400'} mt-[3px] shrink-0"></i><span class="${done ? 'line-through text-slate-400' : ''}">${inline(task[2])}</span></span>${sub}</li>`;
        } else {
          html += `<li class="m-0 p-0">${inline(it.text)}${sub}</li>`;
        }
      }
      html += `</${tag}>`;
    }
    return html;
  }

  function blocks(lines) {
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      // Blok kode ```bahasa ... ```
      const fence = line.match(FENCE);
      if (fence) {
        const mark = fence[1];
        const lang = fence[2];
        const body = [];
        i++;
        const isClose = (l) => { const t = l.trim(); return t.length >= mark.length && t === mark[0].repeat(t.length); };
        while (i < lines.length && !isClose(lines[i])) body.push(lines[i++]);
        i++;
        out.push(`<div class="my-1.5 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">${lang ? `<div class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 bg-slate-100 border-b border-slate-200">${esc(lang)}</div>` : ''}<pre class="m-0 px-2.5 py-2 text-[11px] sm:text-xs leading-relaxed font-mono text-slate-800 whitespace-pre-wrap break-words overflow-x-auto"><code>${esc(body.join('\n'))}</code></pre></div>`);
        continue;
      }

      if (!line.trim()) { out.push('<div class="h-2"></div>'); i++; continue; }

      if (HR.test(line)) { out.push('<hr class="my-2 border-slate-200">'); i++; continue; }

      const head = line.match(HEADING);
      if (head && !/^#+$/.test(head[2])) {
        const lvl = head[1].length;
        out.push(`<h${lvl} class="${HEAD_CLS[lvl - 1]} mt-2 mb-1">${inline(head[2])}</h${lvl}>`);
        i++;
        continue;
      }

      // Kutipan & callout Obsidian  > [!note] Judul
      if (/^\s*>/.test(line)) {
        const body = [];
        while (i < lines.length && /^\s*>/.test(lines[i])) body.push(lines[i++].replace(/^\s*>\s?/, ''));
        const call = body[0].match(/^\[!(\w+)\]([+-]?)\s*(.*)$/);
        if (call) {
          const type = call[1].toLowerCase();
          const c = CALLOUTS[type] || CALLOUTS.note;
          const title = call[3] ? inline(call[3]) : esc(CALLOUTS[type] ? c.label : call[1]);
          const rest = body.slice(1);
          out.push(`<div class="my-1.5 rounded-lg border-l-4 ${c.cls} px-3 py-2"><div class="flex items-center gap-1.5 font-extrabold"><i class="fa-solid ${c.icon}"></i><span>${title}</span></div>${rest.some(l => l.trim()) ? `<div class="mt-1 text-slate-700">${blocks(rest)}</div>` : ''}</div>`);
        } else {
          out.push(`<blockquote class="border-l-4 border-indigo-500 pl-2.5 py-0.5 text-slate-600 italic bg-slate-50 my-1 rounded-r">${blocks(body)}</blockquote>`);
        }
        continue;
      }

      // Tabel  | a | b |  +  |---|---|
      if (line.includes('|') && i + 1 < lines.length && lines[i + 1].includes('-') && TABLE_SEP.test(lines[i + 1])) {
        const aligns = splitRow(lines[i + 1]).map(c => /^:-+:$/.test(c) ? 'center' : /-+:$/.test(c) ? 'right' : 'left');
        const header = splitRow(line);
        const rows = [];
        i += 2;
        while (i < lines.length && lines[i].includes('|') && lines[i].trim()) rows.push(splitRow(lines[i++]));
        const cell = (tag, txt, k) => `<${tag} class="border border-slate-200 px-2 py-1 align-top" style="text-align:${aligns[k] || 'left'}">${inline(txt || '')}</${tag}>`;
        out.push(`<div class="my-1.5 overflow-x-auto"><table class="w-full border-collapse text-[11px] sm:text-xs"><thead class="bg-slate-100 font-bold text-slate-800"><tr>${header.map((h, k) => cell('th', h, k)).join('')}</tr></thead><tbody>${rows.map(r => `<tr class="even:bg-slate-50">${header.map((h, k) => cell('td', r[k], k)).join('')}</tr>`).join('')}</tbody></table></div>`);
        continue;
      }

      // Daftar (bertingkat), termasuk checkbox - [ ] / - [x]
      if (LIST.test(line)) {
        const items = [];
        while (i < lines.length) {
          const m = lines[i].match(LIST);
          if (!m) break;
          items.push({ indent: m[1].replace(/\t/g, '    ').length, ordered: /\d/.test(m[2]), num: parseInt(m[2], 10) || 1, text: m[3] });
          i++;
        }
        // Normalisasi: indentasi item pertama = 0
        const min = Math.min(...items.map(it => it.indent));
        items.forEach(it => { it.indent -= min; });
        out.push(renderList(items));
        continue;
      }

      out.push(`<div>${inline(line)}</div>`);
      i++;
    }
    return out.join('');
  }

  return function(str) {
    if (!str) return '';
    return blocks(String(str).replace(/\r\n?/g, '\n').split('\n'));
  };
})();


async function sendTelegramReport(projectId, kategori, jumlahIcon, driveUrl, targetBelajar, rawStyle) {
  if (!currentUser) {
    await showModalAlert("Akses Ditolak", "Silakan login terlebih dahulu.", "warning");
    return;
  }

  const confirmSend = await showModalConfirm(
    "Konfirmasi Laporan",
    `Apakah Anda yakin ingin mengirimkan laporan pengerjaan tema "${kategori}" (${jumlahIcon} Icon) ke grup Telegram Admin?`
  );

  if (!confirmSend) return;

  // Kunci tombol seketika agar mencegah double-click saat proses kirim berjalan
  const btnTrigger = document.getElementById('btn-trigger-telegram');
  if (btnTrigger) {
    if (btnTrigger.disabled) return;
    btnTrigger.disabled = true;
    btnTrigger.className = "bg-emerald-900/40 text-emerald-100 border border-emerald-400/30 font-extrabold text-xs px-4 py-2 rounded-lg whitespace-nowrap flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-center cursor-not-allowed opacity-90 z-20";
    btnTrigger.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Mengirim Laporan...`;
  }

  const desainerName = (typeof userProfilesMap !== 'undefined' && userProfilesMap[currentUser.id]) 
    || (currentUser.user_metadata && currentUser.user_metadata.full_name)
    || currentUser.email 
    || "Desainer";

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  let extractedStyle = rawStyle || '';
  if (!extractedStyle && kategori) {
    const match = kategori.match(/\(([^)]+)\)/);
    if (match) extractedStyle = match[1];
  }

  const payloadData = {
    nama: desainerName,
    tanggal: todayFormatted,
    tema: kategori,
    jumlah: `${jumlahIcon} Icon`,
    style: extractedStyle || '-',
    target_belajar: targetBelajar || '-'
  };

  try {
    const { data: currentProj } = await supabaseClient
      .from('icon_projects')
      .select('status_admin')
      .eq('id', projectId)
      .single();

    let targetStatus = 'Submitted';
    if (currentProj && currentProj.status_admin === 'Rejected') {
      targetStatus = 'Submitted'; // Diubah jadi 'Submitted' agar lolos constraint database
    }

    const { error: dbErr } = await supabaseClient
      .from('icon_projects')
      .update({
        status_admin: targetStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId);

    if (dbErr) throw dbErr;
    const waktuLaporan = formatNotifUploadTime(new Date().toISOString());
    await logUserActivity(
      'LAPORAN',
      `${desainerName} telah mengirim laporan ${jumlahIcon} ${kategori} ke Grup Telegram KEKAL Studio (${waktuLaporan})`
    );
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payloadData)
    });

    const resJson = await response.json();

    // Ubah tampilan tombol menjadi "Laporan Terkirim" dan tetap disabled
    if (btnTrigger) {
      btnTrigger.innerHTML = `<i class="fa-solid fa-check-double"></i> Laporan Terkirim`;
    }

    if (resJson.status === 'success') {
      await showModalAlert("Laporan Terkirim! 🎉", `Laporan pengerjaan Anda berhasil dikirimkan ke Admin Telegram.`, "success");
    } else {
      await showModalAlert("Peringatan", `Laporan tersimpan di database, tetapi notifikasi Telegram gagal: ${resJson.message}`, "warning");
    }

    if (typeof loadUserDashboardData === 'function') await loadUserDashboardData();
    if (typeof loadThemes === 'function') await loadThemes();

  } catch (err) {
    console.error("Error sendTelegramReport:", err);
    // Buka kembali tombol jika proses gagal total agar desainer bisa mencoba ulang
    if (btnTrigger) {
      btnTrigger.disabled = false;
      btnTrigger.className = "bg-white text-emerald-800 hover:bg-emerald-50 font-extrabold text-xs px-4 py-2 rounded-lg transition shadow-sm whitespace-nowrap flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-center cursor-pointer z-20";
      btnTrigger.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Kirim Laporan`;
    }
    await showModalAlert("Gagal Kirim Laporan", err.message || "Terjadi kesalahan sistem.", "error");
  }
}

// ==========================================
    // FITUR RIWAYAT AKTIVITAS (DESAINER & ADMIN)
    // ==========================================
    let activityHistoryLimit = 15;

    async function logUserActivity(actionType, description) {
      if (!currentUser || !supabaseClient) return;
      try {
        const actorName = userProfilesMap[currentUser.id] || currentUser.email || 'Pengguna';
        const actorRole = isAdminUser ? 'admin' : 'designer';

        await supabaseClient.from('activity_logs').insert([{
          user_id: currentUser.id,
          user_name: actorName,
          user_role: actorRole,
          action_type: actionType,
          description: description
        }]);
      } catch (err) {
        console.warn("Gagal mencatat log aktivitas:", err.message);
      }
    }

    async function loadActivityHistory(resetLimit = false) {
      const tbody = document.getElementById('activity-history-body');
      const loadMoreBox = document.getElementById('activity-load-more-container');
      const adminFilterBox = document.getElementById('activity-admin-filter-box');
      const selectUser = document.getElementById('activity-filter-user');

      if (!tbody) return;
      if (!currentUser) {
        tbody.innerHTML = `<tr><td class="p-4 text-center text-slate-400" colspan="4">Silakan login untuk melihat riwayat aktivitas.</td></tr>`;
        return;
      }

      if (resetLimit) activityHistoryLimit = 15;

      // Tampilkan dropdown filter desainer jika yang login adalah Admin
      if (isAdminUser && adminFilterBox && selectUser) {
        adminFilterBox.classList.remove('hidden');
        if (selectUser.options.length <= 1 && Object.keys(userProfilesMap).length > 0) {
          const opts = Object.keys(userProfilesMap)
            .map(id => `<option value="${esc(id)}">${esc(userProfilesMap[id])}</option>`)
            .join('');
          selectUser.innerHTML = `<option value="ALL">Semua Desainer & Admin</option>` + opts;
        }
      } else if (adminFilterBox) {
        adminFilterBox.classList.add('hidden');
      }

      const filterType = document.getElementById('activity-filter-type')?.value || 'ALL';
      const filterUser = isAdminUser ? (selectUser?.value || 'ALL') : currentUser.id;

      let query = supabaseClient
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(activityHistoryLimit + 1);

      // Desainer hanya bisa melihat log miliknya sendiri; Admin bisa melihat semua / per-filter
      if (!isAdminUser) {
        query = query.eq('user_id', currentUser.id);
      } else if (filterUser !== 'ALL') {
        query = query.eq('user_id', filterUser);
      }

      if (filterType !== 'ALL') {
        query = query.eq('action_type', filterType);
      }

      const { data: logs, error } = await query;

      if (error || !logs || logs.length === 0) {
        tbody.innerHTML = `<tr><td class="p-4 text-center text-slate-400" colspan="4">Belum ada catatan riwayat aktivitas.</td></tr>`;
        if (loadMoreBox) loadMoreBox.classList.add('hidden');
        return;
      }

      const hasMore = logs.length > activityHistoryLimit;
      const visibleLogs = logs.slice(0, activityHistoryLimit);

      if (loadMoreBox) {
        loadMoreBox.classList.toggle('hidden', !hasMore);
      }

      const badgeStyles = {
        'KLAIM': 'bg-blue-50 text-blue-700 border-blue-200',
        'UPLOAD_DRIVE': 'bg-amber-50 text-amber-700 border-amber-200',
        'LAPORAN': 'bg-indigo-50 text-indigo-700 border-indigo-200',
        'UPLOAD_CANVA': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'MODERASI': 'bg-purple-50 text-purple-700 border-purple-200',
        'AUTH': 'bg-slate-100 text-slate-700 border-slate-300'
      };

      tbody.innerHTML = visibleLogs.map(log => {
        const badgeClass = badgeStyles[log.action_type] || 'bg-slate-100 text-slate-600 border-slate-200';
        const roleTag = log.user_role === 'admin'
          ? `<span class="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-extrabold ml-1">Admin</span>`
          : '';

        return `
          <tr class="hover:bg-slate-50 transition">
            <td class="p-3 text-slate-500 font-medium whitespace-nowrap">${formatFullDateTime(log.created_at)}</td>
            <td class="p-3 font-bold text-slate-800">${esc(log.user_name || 'Pengguna')}${roleTag}</td>
            <td class="p-3 text-center">
              <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${badgeClass}">
                ${esc(log.action_type)}
              </span>
            </td>
            <td class="p-3 text-slate-700 leading-relaxed break-words">${esc(log.description)}</td>
          </tr>
        `;
      }).join('');
    }

// =========================================================================
    // FITUR EXPORT CSV, EXPORT PDF & TIMER HITUNG MUNDUR RIWAYAT AKTIVITAS
    // =========================================================================
    const LOG_RETENTION_DAYS = 30; // <-- Sesuaikan jumlah hari retensi log di sini
    let activityRetentionInterval = null;

    // 1. Jalankan Timer Hitung Mundur Otomatis Saat Tab Riwayat Aktivitas Dibuka
    async function startActivityRetentionTimer() {
      const countdownEl = document.getElementById('activity-retention-countdown');
      const labelDaysEl = document.getElementById('txt-retention-days-label');
      if (!countdownEl) return;

      if (labelDaysEl) labelDaysEl.innerText = `${LOG_RETENTION_DAYS} Hari`;
      if (activityRetentionInterval) clearInterval(activityRetentionInterval);

      let targetDeleteTime = null;

      try {
        // Ambil timestamp log tertua milik user (atau global jika admin)
        let query = supabaseClient
          .from('activity_logs')
          .select('created_at')
          .order('created_at', { ascending: true })
          .limit(1);

        if (!isAdminUser && currentUser) {
          query = query.eq('user_id', currentUser.id);
        }

        const { data } = await query;
        if (data && data.length > 0 && data[0].created_at) {
          const oldestLogDate = new Date(data[0].created_at);
          targetDeleteTime = new Date(oldestLogDate.getTime() + LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000);
        } else {
          // Fallback jika log kosong: hitung dari hari ini + LOG_RETENTION_DAYS
          targetDeleteTime = new Date(Date.now() + LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000);
        }
      } catch (err) {
        targetDeleteTime = new Date(Date.now() + LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000);
      }

      const updateRetentionClock = () => {
        const now = new Date();
        const diff = targetDeleteTime - now;

        if (diff <= 0) {
          countdownEl.innerText = "00 Hari 00:00:00 (Segera Terhapus)";
          clearInterval(activityRetentionInterval);
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hrs = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
        const mins = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
        const secs = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

        countdownEl.innerText = `${days} Hari ${hrs}:${mins}:${secs}`;
      };

      updateRetentionClock();
      activityRetentionInterval = setInterval(updateRetentionClock, 1000);
    }

    // 2. Fungsi Export CSV (Mengambil semua data terfilter langsung dari Supabase)
    async function exportActivityHistoryCSV() {
      if (!currentUser) return;

      const filterUser = document.getElementById('activity-filter-user')?.value || 'ALL';
      const filterType = document.getElementById('activity-filter-type')?.value || 'ALL';

      try {
        let query = supabaseClient
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (!isAdminUser) {
          query = query.eq('user_id', currentUser.id);
        } else if (filterUser !== 'ALL') {
          query = query.eq('user_id', filterUser);
        }

        if (filterType !== 'ALL') {
          query = query.eq('action_type', filterType);
        }

        const { data: logs, error } = await query;
        if (error) throw error;

        if (!logs || logs.length === 0) {
          await showModalAlert("Data Kosong", "Tidak ada data riwayat aktivitas untuk di-export.", "warning");
          return;
        }

        let csvContent = "Waktu,Pengguna,Kategori,Detail Aktivitas\n";
        logs.forEach(item => {
          const waktu = formatFullDateTime(item.created_at).replace(/"/g, '""');
          const pengguna = String(item.user_name || userProfilesMap[item.user_id] || 'Pengguna').replace(/"/g, '""');
          const kategori = String(item.action_type || '-').replace(/"/g, '""');
          const detail = (item.description || '-').replace(/"/g, '""');
          csvContent += `"${waktu}","${pengguna}","${kategori}","${detail}"\n`;
        });

        const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const roleLabel = isAdminUser ? "Admin" : (userProfilesMap[currentUser.id] || "Desainer").replace(/\s+/g, '_');
        link.setAttribute("href", url);
        link.setAttribute("download", `Riwayat_Aktivitas_${roleLabel}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        await showModalAlert("Berhasil Export CSV", "File CSV riwayat aktivitas berhasil diunduh!", "success");
      } catch (err) {
        await showModalAlert("Gagal Export CSV", err.message, "error");
      }
    }

    // 3. Fungsi Export PDF (Menggunakan Native Print PDF agar bersih tanpa library tambahan)
    function exportActivityHistoryPDF() {
      const tbody = document.getElementById('activity-history-body');
      if (!tbody || tbody.innerText.includes('Belum ada') || tbody.innerText.includes('Memuat')) {
        showModalAlert("Data Kosong", "Tidak ada data riwayat aktivitas untuk dicetak ke PDF.", "warning");
        return;
      }

      document.body.classList.add('printing-activity');
      window.print();
      setTimeout(() => {
        document.body.classList.remove('printing-activity');
      }, 500);
    }

/* 4) Penyesuaian karena dimuat belakangan. */
if (window.YT && window.YT.Player && !ytApiReady && typeof window.onYouTubeIframeAPIReady === 'function') window.onYouTubeIframeAPIReady();
window.KL_DASH_VERSION = '1.0.6';
document.documentElement.classList.add('kl-dash-ready');
if (window.klWantLogin) {
  window.klWantLogin = false;
  var _m = document.getElementById('modal-login'); if (_m) _m.classList.remove('hidden');
  var _e = document.getElementById('login-email'); if (_e) setTimeout(function () { _e.focus(); }, 60);
}
