// ============================================
// FILTROS DO CARDÁPIO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const filtros = document.querySelectorAll('.filtro-btn');
  const categorias = document.querySelectorAll('.categoria-section');

  if (filtros.length > 0 && categorias.length > 0) {
    filtros.forEach(filtro => {
      filtro.addEventListener('click', function() {
        // Remove active de todos os filtros
        filtros.forEach(f => f.classList.remove('active'));

        // Adiciona active no filtro clicado
        this.classList.add('active');

        // Pega a categoria selecionada
        const categoriaSelecionada = this.getAttribute('data-categoria');

        // Mostra/esconde categorias
        categorias.forEach(categoria => {
          const categoriaAtual = categoria.getAttribute('data-categoria');

          if (categoriaSelecionada === 'todas' || categoriaAtual === categoriaSelecionada) {
            categoria.style.display = 'block';

            // Animação de entrada
            categoria.style.opacity = '0';
            categoria.style.transform = 'translateY(20px)';

            setTimeout(() => {
              categoria.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              categoria.style.opacity = '1';
              categoria.style.transform = 'translateY(0)';
            }, 100);
          } else {
            categoria.style.display = 'none';
          }
        });

        // Scroll suave para o início das categorias
        const cardapioSection = document.querySelector('.cardapio-section');
        if (cardapioSection) {
          const headerOffset = 100;
          const elementPosition = cardapioSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
});

// ============================================
// BUSCA NO CARDÁPIO (Funcionalidade Extra)
// ============================================
function buscarPrato() {
  const termoBusca = document.getElementById('buscaInput');
  if (!termoBusca) return;

  const termo = termoBusca.value.toLowerCase();
  const pratos = document.querySelectorAll('.prato-card');

  pratos.forEach(prato => {
    const nomePrato = prato.querySelector('h3').textContent.toLowerCase();
    const descricao = prato.querySelector('p').textContent.toLowerCase();

    if (nomePrato.includes(termo) || descricao.includes(termo)) {
      prato.style.display = 'block';
    } else {
      prato.style.display = 'none';
    }
  });
}

// ============================================
// ANIMAÇÃO AO ADICIONAR AO CARRINHO
// ============================================
function animarAdicaoCarrinho(botao) {
  // Animação do botão
  botao.style.transform = 'scale(0.9)';
  botao.textContent = 'Adicionado! ✓';
  botao.style.backgroundColor = '#388e3c';

  setTimeout(() => {
    botao.style.transform = 'scale(1)';
    botao.textContent = 'Adicionar';
    botao.style.backgroundColor = '';
  }, 1500);

  // Animação do contador do carrinho
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.style.transform = 'scale(1.5)';
    cartCount.style.transition = 'transform 0.3s ease';

    setTimeout(() => {
      cartCount.style.transform = 'scale(1)';
    }, 300);
  }
}

// ============================================
// DESTACAR OFERTAS DO DIA
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Esta função pode ser usada para destacar promoções
  // Por exemplo, adicionar um badge de "Promoção" em pratos específicos

  const pratosPromocao = [
    'Lasanha Bolonhesa',
    'Pizza Margherita'
  ];

  const pratos = document.querySelectorAll('.prato-card');

  pratos.forEach(prato => {
    const nomePrato = prato.querySelector('h3').textContent;

    if (pratosPromocao.includes(nomePrato)) {
      const badge = document.createElement('div');
      badge.style.cssText = `
                position: absolute;
                top: 10px;
                left: 10px;
                background-color: #ffa000;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-weight: bold;
                font-size: 0.85rem;
                z-index: 10;
            `;
      badge.textContent = '🔥 Promoção';

      const imagemContainer = prato.querySelector('.prato-imagem');
      if (imagemContainer) {
        imagemContainer.style.position = 'relative';
        imagemContainer.appendChild(badge);
      }
    }
  });
});
