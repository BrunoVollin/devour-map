// Cria container principal
const container = document.createElement('div');
container.className = 'relative';

// Botão principal
const shareBtn = document.createElement('button');
shareBtn.innerHTML = 'Share room <i class="fas fa-share text-black cursor-pointer ml-2"></i>';
shareBtn.className = 'bg-white hover:shadow-lg hover:opacity-80 w-full';
container.appendChild(shareBtn);

// Função para criar e exibir o modal dinamicamente
function showShareModal() {
  // Captura o link atualizado
  const currentUrl = window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);
//   const shareText = encodeURIComponent('My devour room:');

  // Cria overlay do modal
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fadeIn';

  // Cria conteúdo do modal
  const modal = document.createElement('div');
  modal.className = 'bg-neutral-900 text-white rounded-lg p-6 w-80 shadow-lg relative animate-scaleIn';

  modal.innerHTML = `
    <button id="closeModalBtn" class="absolute top-2 right-3 text-gray-400 hover:text-white text-xl">&times;</button>
    <h2 class="text-lg font-semibold mb-4 text-center">Share this room</h2>
    <div class="bg-neutral-800 p-2 rounded text-sm break-all mb-3">${currentUrl}</div>
    <button id="copyLinkBtn" class="w-full bg-neutral-700 hover:bg-neutral-600 text-white py-2 rounded mb-4">Copy Link</button>
    <div id="shareOptions" class="flex flex-col space-y-2"></div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Cria opções de compartilhamento
  const shareOptions = modal.querySelector('#shareOptions');
  const links = [
    { name: 'Discord', url: 'https://discord.com/channels/@me', color: 'text-indigo-400', copyFirst: true },
    { name: 'WhatsApp', url: `https://api.whatsapp.com/send?text=${encodedUrl}`, color: 'text-green-400' },
    { name: 'Telegram', url: `https://t.me/share/url?url=${encodedUrl}`, color: 'text-sky-400' },
    { name: 'Twitter', url: `https://twitter.com/intent/tweet?${encodedUrl}`, color: 'text-blue-400' },
  ];

  links.forEach(link => {
    const a = document.createElement('button');
    a.textContent = link.name;
    a.className = `block text-center py-2 rounded hover:bg-neutral-700 ${link.color}`;
    a.addEventListener('click', async () => {
      if (link.copyFirst) await navigator.clipboard.writeText(currentUrl);
      window.open(link.url, '_blank');
    });
    shareOptions.appendChild(a);
  });

  // Botão copiar link
  const copyLinkBtn = modal.querySelector('#copyLinkBtn');
  copyLinkBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(currentUrl);
    copyLinkBtn.textContent = 'Copied!';
    setTimeout(() => (copyLinkBtn.textContent = 'Copy Link'), 1500);
  });

  // Fechar modal
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.remove();
  });
  modal.querySelector('#closeModalBtn').addEventListener('click', () => overlay.remove());
}

// Evento principal do botão
shareBtn.addEventListener('click', showShareModal);

// Inserção no container principal
const bt = document.getElementById('container');
if (bt) {
  const firstChild = bt.firstElementChild;
  bt.insertBefore(container, bt.firstChild);
  if (firstChild) firstChild.disabled = false;
}
