'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const views = {
  dashboard: 'Visão geral',
  'new-project': 'Novo projeto',
  library: 'Meus cortes',
  contact: 'Contato'
};

function showToast(message, type = 'success') {
  const region = $('#toast-region');
  if (!region) return;
  const toast = document.createElement('div');
  toast.className = `toast${type === 'warning' ? ' warning' : ''}`;
  toast.textContent = message;
  region.append(toast);
  window.setTimeout(() => toast.remove(), 3800);
}

function navigate(viewName) {
  if (!views[viewName]) return;
  $$('.view').forEach(view => view.classList.toggle('active', view.id === `view-${viewName}`));
  $$('.nav-item[data-view]').forEach(item => item.classList.toggle('active', item.dataset.view === viewName));
  $('#breadcrumb-current').textContent = views[viewName];
  document.title = `${views[viewName]} — ClipAI`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  $('#sidebar')?.classList.remove('open');
  $('#mobile-menu')?.setAttribute('aria-expanded', 'false');
}

document.addEventListener('click', event => {
  const nav = event.target.closest('[data-view]');
  const link = event.target.closest('[data-view-link]');
  if (nav) navigate(nav.dataset.view);
  if (link) {
    event.preventDefault();
    navigate(link.dataset.viewLink);
  }
});

// Theme preference
const themeToggle = $('#theme-toggle');
const savedTheme = localStorage.getItem('clipai-theme');
if (savedTheme === 'light') document.body.classList.add('light-theme');
function updateThemeButton() {
  const isLight = document.body.classList.contains('light-theme');
  if (!themeToggle) return;
  themeToggle.textContent = isLight ? '☾' : '☼';
  themeToggle.setAttribute('aria-label', isLight ? 'Ativar modo escuro' : 'Ativar modo claro');
  themeToggle.title = isLight ? 'Ativar modo escuro' : 'Ativar modo claro';
}
updateThemeButton();
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  localStorage.setItem('clipai-theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
  updateThemeButton();
});

// Accessibility drawer
const drawer = $('#accessibility-drawer');
const backdrop = $('#drawer-backdrop');
function openAccessibility() {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  backdrop.hidden = false;
  $('#close-accessibility').focus();
}
function closeAccessibility() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  backdrop.hidden = true;
  $('#open-accessibility')?.focus();
}
$('#open-accessibility')?.addEventListener('click', openAccessibility);
$('#footer-accessibility')?.addEventListener('click', openAccessibility);
$('#close-accessibility')?.addEventListener('click', closeAccessibility);
backdrop?.addEventListener('click', closeAccessibility);
document.addEventListener('keydown', event => { if (event.key === 'Escape' && drawer?.classList.contains('open')) closeAccessibility(); });

$$('[data-font]').forEach(button => button.addEventListener('click', () => {
  const root = document.documentElement;
  const current = Number(root.dataset.fontScale || 1);
  const next = button.dataset.font === 'increase' ? Math.min(1.2, current + .05) : button.dataset.font === 'decrease' ? Math.max(.9, current - .05) : 1;
  root.dataset.fontScale = String(next);
  root.style.setProperty('--font-scale', next);
}));
$('#high-contrast')?.addEventListener('change', event => document.body.classList.toggle('high-contrast', event.target.checked));
$('#reduce-motion')?.addEventListener('change', event => document.body.classList.toggle('reduce-motion', event.target.checked));

// Mobile navigation
$('#mobile-menu')?.addEventListener('click', event => {
  const isOpen = $('#sidebar').classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(isOpen));
});

// Dashboard carousel
const carousel = $('#tip-carousel');
$('.carousel-next')?.addEventListener('click', () => carousel?.scrollBy({ left: 230, behavior: 'smooth' }));
$('.carousel-prev')?.addEventListener('click', () => carousel?.scrollBy({ left: -230, behavior: 'smooth' }));

// Project search across cards
function applyGlobalSearch(query) {
  const normalized = query.trim().toLocaleLowerCase('pt-BR');
  const cards = $$('.searchable-card');
  cards.forEach(card => {
    const match = !normalized || (card.dataset.search || card.textContent).toLocaleLowerCase('pt-BR').includes(normalized);
    card.hidden = !match;
  });
}
$('#global-search')?.addEventListener('input', event => {
  const query = event.target.value;
  applyGlobalSearch(query);
  if (query.trim()) {
    navigate('library');
    const localSearch = $('#library-search');
    if (localSearch) localSearch.value = query;
    filterLibrary();
  } else {
    $$('.searchable-card').forEach(card => card.hidden = false);
  }
});
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    $('#global-search')?.focus();
  }
});

// Library filters and search
let activeFilter = 'all';
function filterLibrary() {
  const query = ($('#library-search')?.value || '').trim().toLocaleLowerCase('pt-BR');
  let visible = 0;
  $$('#library-grid .clip-card').forEach(card => {
    const matchesFilter = activeFilter === 'all' || card.dataset.status === activeFilter;
    const matchesQuery = !query || card.dataset.search.toLocaleLowerCase('pt-BR').includes(query) || card.textContent.toLocaleLowerCase('pt-BR').includes(query);
    card.hidden = !(matchesFilter && matchesQuery);
    if (!card.hidden) visible++;
  });
  $('#empty-library').hidden = visible > 0;
}
$$('.library-tab').forEach(tab => tab.addEventListener('click', () => {
  activeFilter = tab.dataset.filter;
  $$('.library-tab').forEach(item => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
  });
  filterLibrary();
}));
$('#library-search')?.addEventListener('input', filterLibrary);

// Upload handling
const fileInput = $('#video-file');
const uploadZone = $('#upload-zone');
let selectedVideoUrl = null;
function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function acceptFile(file) {
  if (!file) return;
  if (!file.type.startsWith('video/')) {
    showToast('Selecione um arquivo de vídeo válido.', 'warning');
    return;
  }
  if (file.size > 500 * 1024 * 1024) {
    showToast('O arquivo excede o limite demonstrativo de 500 MB.', 'warning');
    return;
  }
  if (selectedVideoUrl) URL.revokeObjectURL(selectedVideoUrl);
  selectedVideoUrl = URL.createObjectURL(file);
  $('#file-name').textContent = file.name;
  $('#file-size').textContent = formatFileSize(file.size);
  $('#selected-file').hidden = false;
  uploadZone.classList.add('has-file');
  showToast('Vídeo adicionado à prévia do projeto.');
}
fileInput?.addEventListener('change', event => acceptFile(event.target.files[0]));
['dragenter', 'dragover'].forEach(name => uploadZone?.addEventListener(name, event => {
  event.preventDefault(); uploadZone.classList.add('dragover');
}));
['dragleave', 'drop'].forEach(name => uploadZone?.addEventListener(name, event => {
  event.preventDefault(); uploadZone.classList.remove('dragover');
}));
uploadZone?.addEventListener('drop', event => acceptFile(event.dataTransfer.files[0]));
$('#remove-file')?.addEventListener('click', () => {
  if (selectedVideoUrl) URL.revokeObjectURL(selectedVideoUrl);
  selectedVideoUrl = null;
  fileInput.value = '';
  $('#selected-file').hidden = true;
  uploadZone.classList.remove('has-file');
});

// Prompt suggestions and character counter
const instructions = $('#instructions');
function updateCharCount() {
  if (!instructions) return;
  if (instructions.value.length > 500) instructions.value = instructions.value.slice(0, 500);
  $('#char-count').textContent = `${instructions.value.length} / 500`;
}
instructions?.addEventListener('input', updateCharCount);
updateCharCount();
$$('.prompt-chip').forEach(chip => chip.addEventListener('click', () => {
  const existing = instructions.value.trim();
  instructions.value = existing ? `${existing} ${chip.dataset.prompt}` : chip.dataset.prompt;
  updateCharCount();
  instructions.focus();
}));
$$('.format-option').forEach(option => option.addEventListener('click', () => {
  $$('.format-option').forEach(item => item.classList.remove('selected'));
  option.classList.add('selected');
  $('input[type="radio"]', option).checked = true;
}));

// Build a demonstration result, not real AI-generated clips.
$('#project-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const file = fileInput.files[0];
  const url = $('#video-url').value.trim();
  if (!file && !url) {
    showToast('Adicione um vídeo ou informe um link para continuar.', 'warning');
    uploadZone.focus();
    return;
  }
  if (!instructions.value.trim()) {
    showToast('Escreva uma instrução para orientar os cortes.', 'warning');
    instructions.focus();
    return;
  }
  const button = $('#generate-button');
  const original = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '◌ Preparando demonstração...';
  window.setTimeout(() => {
    const quantity = Number($('#clip-quantity').value);
    const format = $('input[name="format"]:checked').value;
    const duration = $('#clip-duration').value;
    const examples = [
      ['A ideia que merece ser compartilhada', 'MOMENTO DE DESTAQUE'],
      ['Uma reflexão para levar com você', 'IDEIA PRINCIPAL'],
      ['O trecho que muda a conversa', 'FRASE MARCANTE'],
      ['Dica prática em poucos segundos', 'DICA IMPORTANTE'],
      ['O melhor momento da conversa', 'MELHOR MOMENTO'],
      ['Uma história que conecta', 'STORYTELLING'],
      ['Uma pergunta que provoca', 'PERGUNTA'],
      ['O resumo em uma frase', 'RESUMO'],
      ['Um insight para lembrar', 'INSIGHT'],
      ['Fechamento com chave de ouro', 'ENCERRAMENTO']
    ];
    const grid = $('#library-grid');
    for (let index = 0; index < quantity; index++) {
      const [title, category] = examples[index % examples.length];
      const card = document.createElement('article');
      card.className = 'clip-card searchable-card';
      card.dataset.search = `${title} ${category} novo projeto`;
      card.dataset.status = 'done';
      card.innerHTML = `<div class="clip-preview clip-preview-${['one','two','three','four'][index % 4]}"><span class="clip-play">▶</span><span class="clip-badge">${format}</span><span class="clip-subtitle">${category}<br><b>CLIPAI DEMO</b></span><span class="clip-time">00:${String(20 + index * 4).padStart(2,'0')}</span></div><div class="clip-card-content"><div><span class="clip-category">NOVO PROJETO · ATUALIZADO AGORA</span><h3>${title}</h3></div><button class="more-button" type="button" aria-label="Mais opções">···</button><div class="clip-card-footer"><span class="status status-done"><i></i> Prévia pronta</span><button class="download-link" type="button" data-download>↓ Baixar prévia</button></div></div>`;
      grid.prepend(card);
    }
    $('#nav-clip-count').textContent = String(Number($('#nav-clip-count').textContent || 0) + quantity).padStart(2, '0');
    $('#stat-clips').textContent = String(24 + quantity).padStart(2, '0');
    button.disabled = false;
    button.innerHTML = original;
    navigate('library');
    filterLibrary();
    showToast(`${quantity} cortes demonstrativos foram adicionados à sua biblioteca. Duração máxima: ${duration}s.`);
  }, 900);
});

// Demonstrative download action
// It deliberately exports a text note instead of pretending to render a video.
document.addEventListener('click', event => {
  const downloadButton = event.target.closest('[data-download]');
  if (!downloadButton) return;
  const card = downloadButton.closest('.clip-card');
  const title = $('h3', card)?.textContent || 'Corte ClipAI';
  const note = `ClipAI — Prévia demonstrativa\n\nTítulo: ${title}\n\nEste arquivo representa um resultado visual do protótipo acadêmico. O processamento e a exportação reais de vídeo não estão implementados nesta versão.`;
  const blob = new Blob([note], { type: 'text/plain;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-clipai-demo.txt`;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
  showToast('Arquivo de prévia demonstrativa baixado.');
});

// Contact form demo
$('#contact-form')?.addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  event.currentTarget.reset();
  showToast('Mensagem registrada nesta demonstração. Nenhum e-mail foi enviado.');
});
