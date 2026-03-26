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

/* Table row navigation via event delegation */
document.querySelector('.projects-table')?.addEventListener('click', function(e) {
  const row = e.target.closest('tr[data-href]');
  if (row) window.location.href = row.dataset.href;
});

/* Keyboard support for table rows */
document.querySelector('.projects-table')?.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    const row = e.target.closest('tr[data-href]');
    if (row) {
      e.preventDefault();
      window.location.href = row.dataset.href;
    }
  }
});
