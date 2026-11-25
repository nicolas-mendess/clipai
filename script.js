// APENAS 2 IMAGENS: YOUTUBE SHORTS E APLICATIVOS DE VÍDEOS CURTOS
const slidesData = [
  {
    title: "YouTube Shorts",
    desc: "Formato de vídeo curto voltado para cortes rápidos e diretos.",
    img: "youtubeshortslogo.jpg",
    fallback: "youtubeshortslogo (1).jpg"
  },
  {
    title: "Aplicativos de Vídeos Curtos",
    desc: "Plataformas mobile que utilizam vídeos curtos no dia a dia.",
    img: "appsvideoscurtos.jpg",
    fallback: "appsvideoscurtos (1).jpg"
  }
];

// CARTÕES FILTRÁVEIS POR ABA E PESQUISA (FOCO APENAS EM CORTE)
const itemsData = [
  { id: 1, tab: "curto", title: "Corte de 15 Segundos", desc: "Recorte simples do início ao segundo 15 do vídeo." },
  { id: 2, tab: "curto", title: "Corte de 30 Segundos", desc: "Intervalo curto definido manualmente em segundos." },
  { id: 3, tab: "padrao", title: "Corte de 45 Segundos", desc: "Recorte direto entre dois tempos escolhidos." },
  { id: 4, tab: "padrao", title: "Corte de 60 Segundos", desc: "Intervalo de até um minuto cortado sem etapa automática." }
];

let currentSlide = 0;
let activeTab = "todos";
let searchTerm = "";

// MODO CLARO / ESCURO (ACESSIBILIDADE)
const btnTheme = document.getElementById("btnTheme");
btnTheme.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-mode");
  btnTheme.textContent = isLight ? "Modo Escuro" : "Modo Claro";
  btnTheme.setAttribute("aria-pressed", String(isLight));
});

// CORTE SIMPLES APENAS POR LINK
document.getElementById("clipGeneratorForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const link = document.getElementById("videoLinkInput").value.trim();
  const start = Number(document.getElementById("startSecInput").value);
  const end = Number(document.getElementById("endSecInput").value);
  const feedback = document.getElementById("generatorFeedback");

  if (!link) {
    feedback.textContent = "Informe o link do vídeo para cortar.";
    return;
  }

  if (end <= start) {
    feedback.textContent = "O segundo final deve ser maior que o segundo inicial.";
    return;
  }

  const duration = end - start;
  feedback.textContent = `Corte definido para "${link}" de ${start}s a ${end}s (${duration}s).`;
});

// CARROSSEL DE IMAGENS
const carouselImg = document.getElementById("carouselImg");
const carouselTitle = document.getElementById("carouselTitle");
const carouselDesc = document.getElementById("carouselDesc");
const carouselDots = document.getElementById("carouselDots");

carouselImg.addEventListener("error", () => {
  const fallback = slidesData[currentSlide]?.fallback;
  if (fallback && carouselImg.src !== fallback) {
    carouselImg.src = fallback;
  }
});

function renderCarousel() {
  const slide = slidesData[currentSlide];
  carouselImg.src = slide.img;
  carouselImg.alt = slide.title;
  carouselTitle.textContent = slide.title;
  carouselDesc.textContent = slide.desc;

  carouselDots.innerHTML = slidesData
    .map(
      (_, idx) =>
        `<button type="button" class="dot ${idx === currentSlide ? "active" : ""}" aria-label="Ir para slide ${idx + 1}" onclick="goToSlide(${idx})"></button>`
    )
    .join("");
}

function goToSlide(index) {
  currentSlide = (index + slidesData.length) % slidesData.length;
  renderCarousel();
}

document.getElementById("prevSlide").addEventListener("click", () => goToSlide(currentSlide - 1));
document.getElementById("nextSlide").addEventListener("click", () => goToSlide(currentSlide + 1));

// ABAS DE PESQUISA E CARTÕES
const cardsGrid = document.getElementById("cardsGrid");
const searchInput = document.getElementById("searchInput");

function renderCards() {
  const filtered = itemsData.filter((item) => {
    const matchTab = activeTab === "todos" || item.tab === activeTab;
    const matchSearch = `${item.title} ${item.desc}`.toLowerCase().includes(searchTerm);
    return matchTab && matchSearch;
  });

  if (!filtered.length) {
    cardsGrid.innerHTML = `<p>Nenhum cartão encontrado para esse filtro.</p>`;
    return;
  }

  cardsGrid.innerHTML = filtered
    .map(
      (item) => `
      <article class="card-box">
        <span class="card-tag">${item.tab}</span>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
      </article>
    `
    )
    .join("");
}

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeTab = btn.dataset.tab;
    renderCards();
  });
});

searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  renderCards();
});

// LOGIN E FORMULÁRIO DE CONTATO
const loginModal = document.getElementById("loginModal");
document.getElementById("btnOpenLogin").addEventListener("click", () => loginModal.classList.remove("hidden"));
document.getElementById("closeLoginModal").addEventListener("click", () => loginModal.classList.add("hidden"));

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("loginUser").value.trim();
  document.getElementById("loginStatus").textContent = `Conectado como ${user}.`;
  document.getElementById("btnOpenLogin").textContent = user.split("@")[0];
});

document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("contactName").value.trim();
  document.getElementById("contactStatus").textContent = `Obrigado, ${name}! Sua mensagem foi registrada.`;
  e.target.reset();
});

renderCarousel();
renderCards();
