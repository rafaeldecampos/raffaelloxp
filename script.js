/* ==========================================================
   RaffaelloXp — catálogo e carrinho
   ========================================================== */

// Número do WhatsApp que recebe os pedidos (só dígitos, com 55 + DDD).
const WHATSAPP = "5541992248429";

/* ----------------------------------------------------------
   CATÁLOGO — edite aqui quadros, tamanhos e preços.
   - id: identificador único (sem espaços). Não mude depois de
     publicar, senão carrinhos salvos perdem o item.
   - imagem: arquivo dentro da pasta img/
   - preco: em reais, número simples (ex.: 189 ou 189.90)
   Custo de referência na gráfica (sem frete):
     A3 = R$ 53  |  A2 = R$ 128
   ---------------------------------------------------------- */
const QUADROS = [
  {
    id: "vocacao-sao-mateus",
    nome: "A vocação de São Mateus",
    artista: "Caravaggio",
    ano: "1599-1600",
    imagem: "img/vocacao-sao-mateus.jpg",
    tamanhos: [
      { id: "A3", rotulo: "A3 (29,7 x 42 cm)", preco: 89 }, // custo gráfica: R$ 53 (lucro R$ 36)
      { id: "A2", rotulo: "A2 (42 x 59,4 cm)", preco: 179 }  // custo gráfica: R$ 128 (lucro R$ 51)
    ]
  },
  {
    id: "dez-virgens",
    nome: "As dez virgens",
    artista: "William Blake",
    ano: "c. 1799-1800",
    imagem: "img/dez-virgens.jpg",
    tamanhos: [
      { id: "A3", rotulo: "A3 (29,7 x 42 cm)", preco: 89 }, // custo gráfica: R$ 53 (lucro R$ 36)
      { id: "A2", rotulo: "A2 (42 x 59,4 cm)", preco: 179 }  // custo gráfica: R$ 128 (lucro R$ 51)
    ]
  },
  {
    id: "purificacao-templo",
    nome: "A purificação do Templo",
    artista: "El Greco",
    ano: "c. 1600",
    imagem: "img/purificacao-templo.jpg",
    tamanhos: [
      { id: "A3", rotulo: "A3 (42 x 29,7 cm)", preco: 89 }, // custo gráfica: R$ 53 (lucro R$ 36)
      { id: "A2", rotulo: "A2 (59,4 x 42 cm)", preco: 179 }  // custo gráfica: R$ 128 (lucro R$ 51)
    ]
  }
];

const MATERIAL = "Moldura de madeira, acrílico cristal e papel fosco 230 g.";
const CHAVE_STORAGE = "raffaelloxp.carrinho.v1";

/* ---------- Utilidades ---------- */
const formatador = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2
});

// "R$ 1.234,00" — troca o espaço especial do Intl por um espaço comum.
function reais(valor) {
  return formatador.format(valor).replace(/\s/g, " ");
}

function esc(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function acharQuadro(id) {
  return QUADROS.find((q) => q.id === id);
}

function acharTamanho(quadro, tamanhoId) {
  return quadro ? quadro.tamanhos.find((t) => t.id === tamanhoId) : undefined;
}

/* ---------- Carrinho: estado e localStorage ---------- */
// Cada item: { quadro: "id-do-quadro", tamanho: "A3", qtd: 1 }
let carrinho = carregar();

function carregar() {
  try {
    const bruto = localStorage.getItem(CHAVE_STORAGE);
    if (!bruto) return [];
    const lista = JSON.parse(bruto);
    if (!Array.isArray(lista)) return [];
    // Descarta itens que não existem mais no catálogo.
    return lista.filter((i) =>
      i && acharTamanho(acharQuadro(i.quadro), i.tamanho) &&
      Number.isInteger(i.qtd) && i.qtd > 0
    );
  } catch (e) {
    return [];
  }
}

function salvar() {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(carrinho));
  } catch (e) {
    // Sem localStorage (aba anônima, bloqueio): o carrinho funciona, só não persiste.
  }
}

function adicionar(quadroId, tamanhoId) {
  const existente = carrinho.find((i) => i.quadro === quadroId && i.tamanho === tamanhoId);
  if (existente) existente.qtd += 1;
  else carrinho.push({ quadro: quadroId, tamanho: tamanhoId, qtd: 1 });
  atualizar();
}

function mudarQtd(indice, delta) {
  const item = carrinho[indice];
  if (!item) return;
  item.qtd += delta;
  if (item.qtd < 1) carrinho.splice(indice, 1);
  atualizar();
}

function remover(indice) {
  carrinho.splice(indice, 1);
  atualizar();
}

function linhas() {
  return carrinho.map((item) => {
    const quadro = acharQuadro(item.quadro);
    const tamanho = acharTamanho(quadro, item.tamanho);
    return { item, quadro, tamanho, subtotal: tamanho.preco * item.qtd };
  });
}

function totalQuadros() {
  return linhas().reduce((soma, l) => soma + l.subtotal, 0);
}

function totalItens() {
  return carrinho.reduce((soma, i) => soma + i.qtd, 0);
}

/* ---------- Mensagem do WhatsApp ---------- */
function linkWhatsApp() {
  const corpo = linhas().map((l) =>
    `- ${l.quadro.nome}, ${l.tamanho.rotulo}, ${l.item.qtd} un. - ${reais(l.subtotal)}`
  );
  const texto = [
    "Olá! Quero fazer este pedido:",
    ...corpo,
    `Total dos quadros: ${reais(totalQuadros())}`,
    "Nome:",
    "CEP:"
  ].join("\n");
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
}

/* ---------- Grade de quadros ---------- */
const grade = document.getElementById("grade");

function montarGrade() {
  grade.innerHTML = QUADROS.map((q) => {
    const opcoes = q.tamanhos.map((t) =>
      `<option value="${esc(t.id)}">${esc(t.rotulo)} — ${esc(reais(t.preco))}</option>`
    ).join("");
    return `
      <article class="obra" data-quadro="${esc(q.id)}">
        <figure class="obra-foto">
          <img src="${esc(q.imagem)}" alt="${esc(q.nome)}, de ${esc(q.artista)}" loading="lazy" decoding="async">
        </figure>
        <p class="obra-material">${esc(MATERIAL)}</p>
        <h2>${esc(q.nome)}</h2>
        <p class="obra-autor">${esc(q.artista)}, ${esc(q.ano)}</p>
        <div class="obra-compra">
          <label for="tam-${esc(q.id)}">Tamanho</label>
          <select id="tam-${esc(q.id)}">${opcoes}</select>
          <button class="botao-principal" type="button" data-acao="adicionar">Adicionar ao carrinho</button>
        </div>
      </article>`;
  }).join("");
}

// Se a foto não carregar (arquivo faltando em img/), mostra um aviso no lugar.
grade.addEventListener("error", (ev) => {
  const img = ev.target;
  if (img.tagName !== "IMG") return;
  const figura = img.closest(".obra-foto");
  figura.classList.add("sem-foto");
  figura.textContent = "Imagem em breve";
}, true);

grade.addEventListener("click", (ev) => {
  const botao = ev.target.closest('[data-acao="adicionar"]');
  if (!botao) return;
  const card = botao.closest(".obra");
  const tamanhoId = card.querySelector("select").value;
  adicionar(card.dataset.quadro, tamanhoId);

  // Confirmação discreta no próprio botão.
  botao.textContent = "Adicionado";
  botao.classList.add("adicionado");
  clearTimeout(botao._timer);
  botao._timer = setTimeout(() => {
    botao.textContent = "Adicionar ao carrinho";
    botao.classList.remove("adicionado");
  }, 1200);
});

/* ---------- Painel do carrinho ---------- */
const painel = document.getElementById("carrinho");
const fundo = document.getElementById("fundo");
const botaoAbrir = document.getElementById("abrirCarrinho");
const botaoFechar = document.getElementById("fecharCarrinho");
const listaItens = document.getElementById("itens");
const avisoVazio = document.getElementById("vazio");
const campoTotal = document.getElementById("total");
const contador = document.getElementById("contador");
const botaoFinalizar = document.getElementById("finalizar");

function montarCarrinho() {
  const ls = linhas();
  listaItens.innerHTML = ls.map((l, i) => `
    <li class="item">
      <img src="${esc(l.quadro.imagem)}" alt="">
      <div>
        <p class="item-nome">${esc(l.quadro.nome)}</p>
        <p class="item-tamanho">${esc(l.tamanho.rotulo)} · ${esc(reais(l.tamanho.preco))} cada</p>
        <div class="item-acoes">
          <div class="qtd">
            <button type="button" data-acao="menos" data-i="${i}" aria-label="Diminuir quantidade">−</button>
            <span aria-live="polite">${l.item.qtd}</span>
            <button type="button" data-acao="mais" data-i="${i}" aria-label="Aumentar quantidade">+</button>
          </div>
          <button class="remover" type="button" data-acao="remover" data-i="${i}">Remover</button>
          <span class="item-subtotal">${esc(reais(l.subtotal))}</span>
        </div>
      </div>
    </li>`).join("");

  const vazio = ls.length === 0;
  avisoVazio.hidden = !vazio;
  listaItens.hidden = vazio;
  campoTotal.textContent = reais(totalQuadros());
  botaoFinalizar.disabled = vazio;
}

function atualizar() {
  salvar();
  contador.textContent = totalItens();
  montarCarrinho();
}

// Miniatura do carrinho sem arquivo: esconde em vez de mostrar ícone quebrado.
listaItens.addEventListener("error", (ev) => {
  if (ev.target.tagName === "IMG") ev.target.style.visibility = "hidden";
}, true);

listaItens.addEventListener("click", (ev) => {
  const botao = ev.target.closest("button[data-acao]");
  if (!botao) return;
  const i = Number(botao.dataset.i);
  if (botao.dataset.acao === "mais") mudarQtd(i, 1);
  if (botao.dataset.acao === "menos") mudarQtd(i, -1);
  if (botao.dataset.acao === "remover") remover(i);
});

function abrir() {
  painel.classList.add("aberto");
  painel.setAttribute("aria-hidden", "false");
  botaoAbrir.setAttribute("aria-expanded", "true");
  fundo.hidden = false;
  document.body.classList.add("carrinho-aberto");
  botaoFechar.focus();
}

function fechar() {
  painel.classList.remove("aberto");
  painel.setAttribute("aria-hidden", "true");
  botaoAbrir.setAttribute("aria-expanded", "false");
  fundo.hidden = true;
  document.body.classList.remove("carrinho-aberto");
  botaoAbrir.focus();
}

botaoAbrir.addEventListener("click", abrir);
botaoFechar.addEventListener("click", fechar);
fundo.addEventListener("click", fechar);
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape" && painel.classList.contains("aberto")) fechar();
});

botaoFinalizar.addEventListener("click", () => {
  if (carrinho.length === 0) return;
  window.open(linkWhatsApp(), "_blank", "noopener");
});

/* ---------- Início ---------- */
montarGrade();
atualizar();
