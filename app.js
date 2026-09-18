const sidebar = document.querySelector('#sidebar');
const promptInput = document.querySelector('#promptInput');
const sendButton = document.querySelector('#sendButton');
const response = document.querySelector('#assistantResponse');
const toast = document.querySelector('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function syncComposer() {
  sendButton.disabled = !promptInput.value.trim();
}

document.querySelector('#collapseButton').addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

document.querySelector('#mobileMenu').addEventListener('click', () => {
  sidebar.classList.toggle('mobile-open');
});

document.querySelector('#newChatButton').addEventListener('click', () => {
  promptInput.value = '';
  response.hidden = true;
  document.querySelector('#fileStatus').textContent = '';
  syncComposer();
  promptInput.focus();
  showToast('New conversation started');
});

document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((nav) => nav.classList.remove('active'));
    item.classList.add('active');
    showToast(`${item.dataset.view} view selected`);
  });
});

document.querySelectorAll('.suggestion-card').forEach((card) => {
  card.addEventListener('click', () => {
    promptInput.value = card.dataset.prompt;
    syncComposer();
    promptInput.focus();
  });
});

document.querySelectorAll('.metric').forEach((card) => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.metric').forEach((metric) => metric.classList.remove('active'));
    card.classList.add('active');
    showToast(`${card.dataset.view} selected`);
  });
});

promptInput.addEventListener('input', syncComposer);
promptInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    if (!sendButton.disabled) document.querySelector('#composer').requestSubmit();
  }
});

document.querySelector('#composer').addEventListener('submit', (event) => {
  event.preventDefault();
  const question = promptInput.value.trim();
  if (!question) return;
  response.hidden = false;
  response.innerHTML = `<strong>AI proposal</strong><br>I’ll review “${question.replace(/[<>]/g, '')}”, identify the responsible roles and risks, then present recommendations for your approval. No contract change will be made without a human decision.`;
  response.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  showToast('Request sent to the contract assistant');
});

document.querySelector('#attachButton').addEventListener('click', () => document.querySelector('#fileInput').click());
document.querySelector('#fileInput').addEventListener('change', (event) => {
  const count = event.target.files.length;
  document.querySelector('#fileStatus').textContent = count ? `${count} document${count > 1 ? 's' : ''} attached` : '';
  if (count) showToast('Documents attached');
});

document.querySelector('#recentsToggle').addEventListener('click', (event) => {
  const expanded = event.currentTarget.getAttribute('aria-expanded') === 'true';
  event.currentTarget.setAttribute('aria-expanded', String(!expanded));
  document.querySelector('#recentList').hidden = expanded;
});

document.querySelector('#searchButton').addEventListener('click', () => {
  const box = document.querySelector('#searchBox');
  box.hidden = !box.hidden;
  if (!box.hidden) document.querySelector('#recentSearch').focus();
});

document.querySelector('#recentSearch').addEventListener('input', (event) => {
  const value = event.target.value.toLowerCase();
  document.querySelectorAll('.recent-item').forEach((item) => {
    item.hidden = !item.dataset.title.toLowerCase().includes(value);
  });
});

document.querySelectorAll('.recent-item').forEach((item) => {
  item.addEventListener('click', () => {
    promptInput.value = `Show me the latest status for ${item.dataset.title}`;
    syncComposer();
    promptInput.focus();
    if (window.innerWidth <= 760) sidebar.classList.remove('mobile-open');
  });
});

document.addEventListener('click', (event) => {
  if (window.innerWidth <= 760 && sidebar.classList.contains('mobile-open') && !sidebar.contains(event.target) && !event.target.closest('#mobileMenu')) {
    sidebar.classList.remove('mobile-open');
  }
});
