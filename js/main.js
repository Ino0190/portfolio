/**
 * main.js — entry point for index.html
 * Initialises all interactive modules.
 *
 * Each module is loaded via separate <script> tags before this file.
 */
initCursor();
initNav();
initReveal();
initPostit();

/* Table row navigation via event delegation.
   data-new-tab の行（外部サイト。例: 平安京の入口ページ）は別タブで開く */
function openRow(row) {
  if (row.hasAttribute('data-new-tab')) window.open(row.dataset.href, '_blank', 'noopener');
  else window.location.href = row.dataset.href;
}
document.querySelector('.projects-table')?.addEventListener('click', function(e) {
  const row = e.target.closest('tr[data-href]');
  if (row) openRow(row);
});

/* Keyboard support for table rows */
document.querySelector('.projects-table')?.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    const row = e.target.closest('tr[data-href]');
    if (row) {
      e.preventDefault();
      openRow(row);
    }
  }
});
