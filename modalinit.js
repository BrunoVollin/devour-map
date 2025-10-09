// // Exibe o modal apenas se o usuário ainda não o viu
// if (!localStorage.getItem("modalSeen2")) {
//   // Cria o elemento do modal
//   const modalEl = document.createElement("div");
//   modalEl.id = "customModal";
//   modalEl.className = "fixed inset-0 flex items-center justify-center z-50 opacity-0 transition-opacity duration-300";

//   // Insere o HTML do modal via innerHTML
//   modalEl.innerHTML = `
// <div class="absolute inset-0 bg-black bg-opacity-70"></div>
// <div class="bg-neutral-900 text-neutral-100 rounded-lg p-6 w-80 shadow-2xl relative z-10 transform transition-all duration-300 scale-95 border border-neutral-700">
//   <button id="closeModalBtn" class="absolute top-2 right-3 text-neutral-400 hover:text-white text-xl">&times;</button>
//   <h2 class="text-xl font-semibold mb-2 text-white">Bem-vindo!</h2>
//   <p class="text-neutral-300">Este é um aviso importante que aparece apenas uma vez.</p>
// </div>

//   `;

//   // Adiciona o modal ao body
//   document.body.appendChild(modalEl);

//   // Força o fade-in
//   setTimeout(() => {
//     modalEl.classList.remove("opacity-0");
//     modalEl.classList.add("opacity-100");
//     const modalContent = modalEl.querySelector(".transform");
//     modalContent.classList.remove("scale-95");
//     modalContent.classList.add("scale-100");
//   }, 50);

//   // Função para fechar o modal com fade-out
//   function closeModal() {
//     modalEl.classList.remove("opacity-100");
//     modalEl.classList.add("opacity-0");
//     const modalContent = modalEl.querySelector(".transform");
//     modalContent.classList.remove("scale-100");
//     modalContent.classList.add("scale-95");

//     // Após a transição, remove o modal e salva flag
//     setTimeout(() => {
//       modalEl.remove();
//       localStorage.setItem("modalSeen", "true");
//     }, 300);
//   }

//   // Listener para o botão "X"
//   modalEl.querySelector("#closeModalBtn").addEventListener("click", closeModal);

//   // (Opcional) Fecha ao clicar no fundo escuro
//   modalEl.querySelector(".bg-black").addEventListener("click", (e) => {
//     if (e.target.classList.contains("bg-black")) closeModal();
//   });
// }
