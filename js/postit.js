/**
 * Post-it notes — toggle visibility, drag (edit mode), date display
 *
 * Edit mode is activated by adding ?edit to the URL.
 * In edit mode, post-its are draggable and positions are saved to localStorage.
 * Visitors always see post-its in their default positions.
 */
function initPostit() {
  const isEditMode = location.search.includes('edit');
  const postits    = document.querySelectorAll('.postit-wrap');
  const toggleBtn  = document.getElementById('postit-toggle');

  if (!postits.length) return;

  initToggle(isEditMode, postits, toggleBtn);
  initDrag(isEditMode, postits);
  initDate();
  initExportPanel(isEditMode, postits);
}

/* ── Toggle visibility (edit mode only) ── */
function initToggle(isEditMode, postits, toggleBtn) {
  if (!toggleBtn) return;

  if (!isEditMode) {
    toggleBtn.style.display = 'none';
    postits.forEach((el) => el.classList.remove('hidden'));
    return;
  }

  toggleBtn.style.display = '';
  let visible = localStorage.getItem('postit-visible') !== 'false';

  function apply() {
    postits.forEach((el) => el.classList.toggle('hidden', !visible));
    toggleBtn.textContent = visible ? 'Post-it ✕' : 'Post-it ＋';
  }
  apply();

  toggleBtn.addEventListener('click', () => {
    visible = !visible;
    localStorage.setItem('postit-visible', visible);
    apply();
  });
}

/* ── Drag (edit mode only) ── */
function initDrag(isEditMode, postits) {
  postits.forEach((el) => {
    const id = el.id;

    // Restore saved position in edit mode
    if (isEditMode) {
      const saved = id && localStorage.getItem('postit-pos-' + id);
      if (saved) {
        const pos = JSON.parse(saved);
        el.style.right = pos.right + 'px';
        el.style.left  = 'auto';
        el.style.top   = pos.top + 'px';
      }
    }

    if (!isEditMode) return;

    el.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const parentRect = el.parentElement.getBoundingClientRect();
      const elRect     = el.getBoundingClientRect();
      const offsetX    = elRect.right - e.clientX;
      const offsetY    = e.clientY - elRect.top;

      function onMove(e2) {
        const right = parentRect.right - e2.clientX - offsetX;
        const top   = e2.clientY - parentRect.top - offsetY;
        el.style.right = right + 'px';
        el.style.left  = 'auto';
        el.style.top   = top + 'px';
      }

      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        if (id) {
          localStorage.setItem('postit-pos-' + id, JSON.stringify({
            right: parseInt(el.style.right),
            top:   parseInt(el.style.top),
          }));
        }
      }

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  });
}

/* ── Date post-it ── */
function initDate() {
  const dateEl = document.getElementById('postit-date');
  if (!dateEl) return;

  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const now  = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const w = days[now.getDay()];
  dateEl.textContent = `${y}.${m}.${d}（${w}）`;
}

/* ── Export panel (edit mode only) ── */
function initExportPanel(isEditMode, postits) {
  if (!isEditMode) return;

  const panel = document.createElement('div');
  panel.style.cssText = `
    position:fixed; bottom:20px; right:20px; z-index:9999;
    background:#18140C; color:#F2EDE3;
    font-family:monospace; font-size:12px;
    padding:16px 20px; border-radius:4px;
    box-shadow:0 4px 20px rgba(0,0,0,.4);
    min-width:260px;
  `;
  panel.innerHTML = `
    <div style="font-size:10px;letter-spacing:.1em;text-transform:uppercase;opacity:.5;margin-bottom:8px;">Edit Mode</div>
    <button id="export-btn" style="
      background:#C94B1E;color:#fff;border:none;border-radius:2px;
      padding:6px 14px;font-size:12px;cursor:pointer;width:100%;
    ">現在の位置をコピー</button>
    <pre id="export-out" style="margin-top:10px;opacity:.8;white-space:pre-wrap;display:none;"></pre>
  `;
  document.body.appendChild(panel);

  document.getElementById('export-btn').addEventListener('click', () => {
    const lines = [];
    postits.forEach((el) => {
      const top   = parseInt(el.style.top) || 0;
      const right = parseInt(el.style.right) || 0;
      lines.push(`${el.id}:\n  style="top: ${top}px; right: ${right}px;"`);
    });
    const out = lines.join('\n\n');
    const pre = document.getElementById('export-out');
    pre.textContent = out;
    pre.style.display = 'block';
    navigator.clipboard.writeText(out).catch(() => {});
  });
}
