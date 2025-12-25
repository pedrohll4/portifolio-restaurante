// ============================================
// SISTEMA DE CARRINHO - ARMAZENAMENTO
// ============================================

// Classe para gerenciar o carrinho
class Carrinho {
  constructor() {
    this.itens = this.carregarCarrinho();
    this.taxaEntrega = 10.00;
    this.desconto = 0;
  }

  carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  }

  salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(this.itens));
    this.atualizarContador();
  }

  adicionar(nome, preco, imagem) {
    const itemExistente = this.itens.find(item => item.nome === nome);

    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      this.itens.push({
        nome: nome,
        preco: parseFloat(preco),
        imagem: imagem,
        quantidade: 1
      });
    }

    this.salvarCarrinho();
    return true;
  }

  remover(nome) {
    this.itens = this.itens.filter(item => item.nome !== nome);
    this.salvarCarrinho();
  }

  atualizarQuantidade(nome, quantidade) {
    const item = this.itens.find(item => item.nome === nome);
    if (item) {
      item.quantidade = Math.max(1, quantidade);
      this.salvarCarrinho();
    }
  }

  calcularSubtotal() {
    return this.itens.reduce((total, item) => {
      return total + (item.preco * item.quantidade);
    }, 0);
  }

  calcularTotal() {
    const subtotal = this.calcularSubtotal();
    return subtotal + this.taxaEntrega - this.desconto;
  }

  obterQuantidadeTotal() {
    return this.itens.reduce((total, item) => total + item.quantidade, 0);
  }

  limpar() {
    this.itens = [];
    this.salvarCarrinho();
  }

  atualizarContador() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      const quantidade = this.obterQuantidadeTotal();
      cartCount.textContent = quantidade;

      // Adiciona classe para animação
      cartCount.classList.add('pulse');
      setTimeout(() => cartCount.classList.remove('pulse'), 300);
    }
  }
}

// Instância global do carrinho
const carrinho = new Carrinho();

// ============================================
// FUNÇÃO PARA ADICIONAR AO CARRINHO
// ============================================
function adicionarAoCarrinho(nome, preco, imagem) {
  const sucesso = carrinho.adicionar(nome, preco, imagem);

  if (sucesso) {
    mostrarToast(`${nome} adicionado ao carrinho!`, 'sucesso');

    // Animação do botão se existir
    const botoes = document.querySelectorAll('.btn-add-cart, .btn-add');
    botoes.forEach(botao => {
      if (botao.textContent.includes('Adicionar')) {
        const card = botao.closest('.destaque-card, .prato-card');
        if (card) {
          const nomeCard = card.querySelector('h3').textContent;
          if (nomeCard === nome) {
            animarAdicaoCarrinho(botao);
          }
        }
      }
    });
  }
}

// ============================================
// ATUALIZAR PÁGINA DO CARRINHO
// ============================================
function atualizarPaginaCarrinho() {
  const carrinhoVazio = document.getElementById('carrinhoVazio');
  const carrinhoLista = document.getElementById('carrinhoLista');
  const carrinhoResumo = document.getElementById('carrinhoResumo');

  if (!carrinhoLista) return;

  if (carrinho.itens.length === 0) {
    if (carrinhoVazio) carrinhoVazio.style.display = 'block';
    if (carrinhoLista) carrinhoLista.style.display = 'none';
    if (carrinhoResumo) carrinhoResumo.style.display = 'none';
  } else {
    if (carrinhoVazio) carrinhoVazio.style.display = 'none';
    if (carrinhoLista) carrinhoLista.style.display = 'flex';
    if (carrinhoResumo) carrinhoResumo.style.display = 'block';

    // Renderizar itens
    carrinhoLista.innerHTML = '';

    carrinho.itens.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'carrinho-item';
      itemDiv.innerHTML = `
                <div class="item-imagem">
                    <img src="${item.imagem}" alt="${item.nome}">
                </div>
                <div class="item-info">
                    <h3>${item.nome}</h3>
                    <div class="item-preco">R$ ${item.preco.toFixed(2)}</div>
                    <div class="item-quantidade">
                        <button class="btn-qtd" onclick="alterarQuantidade('${item.nome}', -1)">-</button>
                        <span>${item.quantidade}</span>
                        <button class="btn-qtd" onclick="alterarQuantidade('${item.nome}', 1)">+</button>
                    </div>
                </div>
                <div class="item-acoes">
                    <div class="item-total">R$ ${(item.preco * item.quantidade).toFixed(2)}</div>
                    <button class="btn-remover" onclick="removerDoCarrinho('${item.nome}')" title="Remover">🗑️</button>
                </div>
            `;
      carrinhoLista.appendChild(itemDiv);
    });

    // Atualizar valores
    atualizarValoresCarrinho();
  }
}

// ============================================
// ALTERAR QUANTIDADE
// ============================================
function alterarQuantidade(nome, delta) {
  const item = carrinho.itens.find(i => i.nome === nome);
  if (item) {
    const novaQuantidade = item.quantidade + delta;
    if (novaQuantidade > 0) {
      carrinho.atualizarQuantidade(nome, novaQuantidade);
      atualizarPaginaCarrinho();
    } else {
      removerDoCarrinho(nome);
    }
  }
}

// ============================================
// REMOVER DO CARRINHO
// ============================================
function removerDoCarrinho(nome) {
  if (confirm(`Deseja remover "${nome}" do carrinho?`)) {
    carrinho.remover(nome);
    atualizarPaginaCarrinho();
    mostrarToast('Item removido do carrinho', 'info');
  }
}

// ============================================
// ATUALIZAR VALORES DO CARRINHO
// ============================================
function atualizarValoresCarrinho() {
  const subtotal = carrinho.calcularSubtotal();
  const total = carrinho.calcularTotal();

  const subtotalEl = document.getElementById('subtotal');
  const taxaEl = document.getElementById('taxaEntrega');
  const totalEl = document.getElementById('total');

  if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
  if (taxaEl) taxaEl.textContent = `R$ ${carrinho.taxaEntrega.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2)}`;
}

// ============================================
// APLICAR CUPOM
// ============================================
function aplicarCupom() {
  const cupomInput = document.getElementById('cupomInput');
  const cupomMensagem = document.getElementById('cupomMensagem');

  if (!cupomInput || !cupomMensagem) return;

  const codigo = cupomInput.value.toUpperCase().trim();

  // Cupons válidos (simulação)
  const cuponsValidos = {
    'DESCONTO10': { tipo: 'percentual', valor: 10 },
    'PRIMEIRACOMPRA': { tipo: 'percentual', valor: 15 },
    'FRETE GRATIS': { tipo: 'frete', valor: 0 }
  };

  if (cuponsValidos[codigo]) {
    const cupom = cuponsValidos[codigo];

    if (cupom.tipo === 'percentual') {
      carrinho.desconto = carrinho.calcularSubtotal() * (cupom.valor / 100);
      cupomMensagem.textContent = `Cupom aplicado! ${cupom.valor}% de desconto`;
      cupomMensagem.className = 'cupom-mensagem sucesso';
    } else if (cupom.tipo === 'frete') {
      carrinho.taxaEntrega = 0;
      cupomMensagem.textContent = 'Cupom aplicado! Frete grátis';
      cupomMensagem.className = 'cupom-mensagem sucesso';
    }

    atualizarValoresCarrinho();
    cupomInput.value = '';
  } else {
    cupomMensagem.textContent = 'Cupom inválido';
    cupomMensagem.className = 'cupom-mensagem erro';
  }

  // Limpar mensagem após 3 segundos
  setTimeout(() => {
    cupomMensagem.textContent = '';
    cupomMensagem.className = 'cupom-mensagem';
  }, 3000);
}

// ============================================
// IR PARA CHECKOUT
// ============================================
function irParaCheckout() {
  if (carrinho.itens.length === 0) {
    mostrarToast('Adicione itens ao carrinho primeiro', 'aviso');
    return;
  }
  window.location.href = 'checkout.html';
}

// ============================================
// CHECKOUT - NAVEGAÇÃO ENTRE ETAPAS
// ============================================
function proximaEtapa(numeroEtapa) {
  // Validar etapa atual antes de avançar
  const etapaAtual = numeroEtapa - 1;

  if (etapaAtual === 1 && !validarEtapa1()) {
    return;
  }

  if (etapaAtual === 2 && !validarEtapa2()) {
    return;
  }

  // Esconder todas as etapas
  document.querySelectorAll('.form-step').forEach(step => {
    step.classList.remove('active');
  });

  // Mostrar etapa selecionada
  const etapa = document.getElementById(`formStep${numeroEtapa}`);
  if (etapa) {
    etapa.classList.add('active');
  }

  // Atualizar indicadores
  document.querySelectorAll('.step').forEach((step, index) => {
    if (index < numeroEtapa) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });

  // Scroll para o topo
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function voltarEtapa(numeroEtapa) {
  proximaEtapa(numeroEtapa);
}

// ============================================
// VALIDAÇÕES DAS ETAPAS
// ============================================
function validarEtapa1() {
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();

  if (!nome) {
    mostrarToast('Preencha seu nome', 'erro');
    return false;
  }

  if (!email || !validarEmail(email)) {
    mostrarToast('Email inválido', 'erro');
    return false;
  }

  if (!telefone) {
    mostrarToast('Preencha seu telefone', 'erro');
    return false;
  }

  return true;
}

function validarEtapa2() {
  const tipoEntrega = document.querySelector('input[name="tipoEntrega"]:checked').value;

  if (tipoEntrega === 'delivery') {
    const cep = document.getElementById('cep').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const numero = document.getElementById('numero').value.trim();
    const bairro = document.getElementById('bairro').value.trim();
    const cidade = document.getElementById('cidade').value.trim();

    if (!cep || !endereco || !numero || !bairro || !cidade) {
      mostrarToast('Preencha todos os campos do endereço', 'erro');
      return false;
    }
  }

  return true;
}

// ============================================
// TOGGLE ENDEREÇO DE ENTREGA
// ============================================
function toggleEnderecoEntrega() {
  const tipoEntrega = document.querySelector('input[name="tipoEntrega"]:checked').value;
  const enderecoForm = document.getElementById('enderecoForm');
  const taxaEl = document.getElementById('checkoutTaxa');

  if (tipoEntrega === 'retirada') {
    if (enderecoForm) enderecoForm.style.display = 'none';
    carrinho.taxaEntrega = 0;
    if (taxaEl) taxaEl.textContent = 'R$ 0,00';
  } else {
    if (enderecoForm) enderecoForm.style.display = 'block';
    carrinho.taxaEntrega = 10.00;
    if (taxaEl) taxaEl.textContent = 'R$ 10,00';
  }

  atualizarResumoCheckout();
}

// ============================================
// TOGGLE FORM DE PAGAMENTO
// ============================================
function togglePagamentoForm() {
  const tipoPagamento = document.querySelector('input[name="pagamento"]:checked').value;

  document.getElementById('cartaoForm').style.display = 'none';
  document.getElementById('pixForm').style.display = 'none';
  document.getElementById('dinheiroForm').style.display = 'none';

  if (tipoPagamento === 'cartao') {
    document.getElementById('cartaoForm').style.display = 'block';
  } else if (tipoPagamento === 'pix') {
    document.getElementById('pixForm').style.display = 'block';
  } else if (tipoPagamento === 'dinheiro') {
    document.getElementById('dinheiroForm').style.display = 'block';
  }
}

// ============================================
// CARREGAR RESUMO DO CHECKOUT
// ============================================
function carregarResumoCheckout() {
  const resumoItens = document.getElementById('resumoItens');

  if (!resumoItens) return;

  if (carrinho.itens.length === 0) {
    window.location.href = 'carrinho.html';
    return;
  }

  resumoItens.innerHTML = '';

  carrinho.itens.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'resumo-item';
    itemDiv.innerHTML = `
            <div class="resumo-item-info">
                <div class="resumo-item-nome">${item.nome}</div>
                <div class="resumo-item-qtd">${item.quantidade}x</div>
            </div>
            <div class="resumo-item-preco">R$ ${(item.preco * item.quantidade).toFixed(2)}</div>
        `;
    resumoItens.appendChild(itemDiv);
  });

  atualizarResumoCheckout();
  carrinho.atualizarContador();
}

function atualizarResumoCheckout() {
  const subtotal = carrinho.calcularSubtotal();
  const total = carrinho.calcularTotal();

  const subtotalEl = document.getElementById('checkoutSubtotal');
  const taxaEl = document.getElementById('checkoutTaxa');
  const totalEl = document.getElementById('checkoutTotal');

  if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
  if (taxaEl) taxaEl.textContent = `R$ ${carrinho.taxaEntrega.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2)}`;
}

// ============================================
// FINALIZAR PEDIDO
// ============================================
function finalizarPedido() {
  // Validar pagamento
  const tipoPagamento = document.querySelector('input[name="pagamento"]:checked').value;

  if (tipoPagamento === 'cartao') {
    const numeroCartao = document.getElementById('numeroCartao').value.trim();
    const nomeCartao = document.getElementById('nomeCartao').value.trim();
    const validade = document.getElementById('validade').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    if (!numeroCartao || !nomeCartao || !validade || !cvv) {
      mostrarToast('Preencha todos os dados do cartão', 'erro');
      return;
    }
  }

  // Mostrar loading
  mostrarLoading();

  // Simular processamento
  setTimeout(() => {
    esconderLoading();

    // Gerar número do pedido
    const numeroPedido = 'SA' + Date.now().toString().slice(-6);
    document.getElementById('numeroPedido').textContent = numeroPedido;

    // Mostrar modal
    const modal = document.getElementById('modalConfirmacao');
    if (modal) {
      modal.classList.add('show');
    }

    // Limpar carrinho
    carrinho.limpar();
  }, 2000);
}

// ============================================
// VOLTAR AO INÍCIO
// ============================================
function voltarInicio() {
  const modal = document.getElementById('modalConfirmacao');
  if (modal) {
    modal.classList.remove('show');
  }
  window.location.href = 'index.html';
}

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Atualizar contador em todas as páginas
  carrinho.atualizarContador();
});
