// ============================================================
// WestSystem - script
// 1. WhatsApp   2. Ano do rodapé   3. Barra de progresso da página
// 4. Aparecer ao rolar   5. Painel de exemplo (barras e registro)
// ============================================================

// ---------- 1. WhatsApp ----------
// >>> Para trocar o número do WhatsApp, mude só aqui <<<
// Formato: 55 + DDD + número, sem espaços, traços ou parênteses.
const WHATSAPP_NUMERO = "5541996877013";

// Mensagem que já aparece escrita quando a pessoa abre a conversa.
const WHATSAPP_MENSAGEM = "Olá! Vim pelo site da WestSystem e gostaria de conversar sobre um projeto.";

// Monta o link (o texto precisa ser "codificado" para caber em um endereço).
const linkWhatsapp =
  "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(WHATSAPP_MENSAGEM);

// Todo botão com a classe "js-whatsapp" passa a abrir a conversa.
document.querySelectorAll(".js-whatsapp").forEach(function (botao) {
  botao.href = linkWhatsapp;
  botao.target = "_blank";
  botao.rel = "noopener";
});

// ---------- Formulário de feedback ----------
// Monta a mensagem e abre o WhatsApp com tudo preenchido.
const formFeedback = document.getElementById("form-feedback");
const erroFeedback = document.getElementById("fb-erro");

formFeedback.addEventListener("submit", function (evento) {
  evento.preventDefault(); // não deixa a página recarregar

  const notaMarcada = formFeedback.querySelector('input[name="nota"]:checked');
  const nome = formFeedback.nome.value.trim();
  const mensagem = formFeedback.mensagem.value.trim();

  if (!notaMarcada || mensagem === "") {
    erroFeedback.textContent = "Escolha uma nota e escreva o seu feedback antes de enviar.";
    erroFeedback.hidden = false;
    return;
  }
  erroFeedback.hidden = true;

  const texto =
    "Olá! Quero deixar um feedback sobre a WestSystem.\n" +
    (nome ? "Nome: " + nome + "\n" : "") +
    "Nota: " + notaMarcada.value + " de 5\n" +
    "Feedback: " + mensagem;

  const link = "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(texto);
  window.open(link, "_blank", "noopener");
});

// ---------- Carrossel de serviços ----------
const faixa = document.getElementById("faixa");
const setaAnterior = document.getElementById("seta-anterior");
const setaProximo = document.getElementById("seta-proximo");
const pontos = document.getElementById("pontos");
const cartoesCarrossel = faixa.children;

// distância de um cartão até o próximo (largura + espaço entre eles)
function passoDoCarrossel() {
  return cartoesCarrossel[1].offsetLeft - cartoesCarrossel[0].offsetLeft;
}

// quantos "pontinhos" existem (quantas posições diferentes dá para parar)
function totalDePosicoes() {
  const aparecem = Math.max(1, Math.floor((faixa.clientWidth + 1) / passoDoCarrossel()));
  return Math.max(1, cartoesCarrossel.length - aparecem + 1);
}

function posicaoAtual() {
  const indice = Math.round(faixa.scrollLeft / passoDoCarrossel());
  return Math.min(indice, totalDePosicoes() - 1);
}

function irPara(indice) {
  faixa.scrollTo({ left: indice * passoDoCarrossel(), behavior: menosMovimento ? "auto" : "smooth" });
}

// cria os pontinhos de novo (o número muda conforme o tamanho da tela)
function montarPontos() {
  pontos.innerHTML = "";
  const total = totalDePosicoes();
  for (let i = 0; i < total; i++) {
    const ponto = document.createElement("button");
    ponto.type = "button";
    ponto.className = "carrossel__ponto";
    ponto.setAttribute("aria-label", "Ir para o serviço " + (i + 1));
    ponto.addEventListener("click", function () { irPara(i); });
    pontos.appendChild(ponto);
  }
  atualizarCarrossel();
}

// marca o ponto ativo e liga/desliga as setas nas pontas
function atualizarCarrossel() {
  const atual = posicaoAtual();
  const total = totalDePosicoes();
  Array.prototype.forEach.call(pontos.children, function (ponto, i) {
    ponto.setAttribute("aria-current", i === atual ? "true" : "false");
  });
  setaAnterior.disabled = atual <= 0;
  setaProximo.disabled = atual >= total - 1;
}

setaAnterior.addEventListener("click", function () { irPara(posicaoAtual() - 1); });
setaProximo.addEventListener("click", function () { irPara(posicaoAtual() + 1); });
faixa.addEventListener("scroll", atualizarCarrossel, { passive: true });
window.addEventListener("resize", montarPontos);
montarPontos();

// ---------- 2. Ano do rodapé ----------
document.getElementById("ano").textContent = new Date().getFullYear();

// Pessoas que pediram "menos movimento" no celular/computador
const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Menu do celular (botão de 3 riscos) ----------
const botaoMenu = document.getElementById("menu-botao");
const menu = document.getElementById("menu");

function fecharMenu() {
  menu.classList.remove("aberto");
  botaoMenu.setAttribute("aria-expanded", "false");
  botaoMenu.setAttribute("aria-label", "Abrir menu");
}

botaoMenu.addEventListener("click", function () {
  const abriu = menu.classList.toggle("aberto");
  botaoMenu.setAttribute("aria-expanded", String(abriu));
  botaoMenu.setAttribute("aria-label", abriu ? "Fechar menu" : "Abrir menu");
});

// Fecha o menu ao escolher um item, ao apertar Esc ou ao voltar para tela grande.
menu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", fecharMenu);
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") { fecharMenu(); }
});
window.addEventListener("resize", function () {
  if (window.innerWidth > 720) { fecharMenu(); }
});

// ---------- 3. Barra de progresso da página ----------
const barraProgresso = document.getElementById("progresso");

function atualizarProgresso() {
  const rolado = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const porcento = total > 0 ? (rolado / total) * 100 : 0;
  barraProgresso.style.width = porcento + "%";
}
// ---------- Botão de voltar ao topo ----------
const botaoTopo = document.getElementById("voltar-topo");

function atualizarBotaoTopo() {
  // aparece depois de rolar 500px
  botaoTopo.classList.toggle("mostrar", window.scrollY > 500);
}

botaoTopo.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: menosMovimento ? "auto" : "smooth" });
});

window.addEventListener("scroll", function () {
  atualizarProgresso();
  atualizarBotaoTopo();
}, { passive: true });
atualizarProgresso();
atualizarBotaoTopo();

// ---------- 4. Aparecer ao rolar ----------
// Cada elemento com a classe "aparece" ganha "visivel" quando entra na tela.
const elementos = document.querySelectorAll(".aparece");

if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          observador.unobserve(entrada.target); // só precisa aparecer uma vez
        }
      });
    },
    { threshold: 0.15 }
  );
  elementos.forEach(function (el) { observador.observe(el); });
} else {
  // Navegador muito antigo: mostra tudo de uma vez.
  elementos.forEach(function (el) { el.classList.add("visivel"); });
}

// ---------- 5. Painel de exemplo ----------
// As três barras mudam de valor de tempos em tempos.
function sortear(minimo, maximo) {
  return Math.round(minimo + Math.random() * (maximo - minimo));
}

function mexerBarras() {
  [1, 2, 3].forEach(function (n) {
    const valor = sortear(45, 98);
    document.getElementById("barra-" + n).style.width = valor + "%";
    document.getElementById("valor-" + n).textContent = valor + "%";
  });
}

// O registro mostra frases de exemplo, uma nova a cada pouco tempo.
const frasesDoLog = [
  "novo pedido recebido",
  "cliente avisado no WhatsApp",
  "planilha atualizada",
  "formulário do site enviado",
  "lembrete de consulta enviado",
  "relatório do dia gerado",
  "nova mensagem respondida pelo bot",
  "backup concluído"
];

const lista = document.getElementById("log");
let proximaFrase = 0;

function horaAgora() {
  const d = new Date();
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

function adicionarLinhaNoLog() {
  const item = document.createElement("li");
  item.innerHTML =
    '<span class="hora">' + horaAgora() + '</span><span class="ok">✓</span>' +
    frasesDoLog[proximaFrase % frasesDoLog.length];
  lista.appendChild(item);
  proximaFrase++;

  // Mantém só as 5 últimas linhas visíveis.
  while (lista.children.length > 5) {
    lista.removeChild(lista.firstChild);
  }
}

// Já começa com algumas linhas para o painel não nascer vazio.
for (let i = 0; i < 4; i++) { adicionarLinhaNoLog(); }

if (!menosMovimento) {
  setInterval(adicionarLinhaNoLog, 2200);
  setInterval(mexerBarras, 2600);
  mexerBarras();
}
