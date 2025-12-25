// ============================================
// MENU MOBILE TOGGLE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');

      // Animação do botão hambúrguer
      this.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        if (menuToggle) {
          menuToggle.classList.remove('active');
        }
      });
    });
  }
});

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Ignora se for apenas # ou vazio
    if (href === '#' || !href) return;

    e.preventDefault();
    const target = document.querySelector(href);

    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// HEADER SCROLL EFFECT
// ============================================
window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  if (header) {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    } else {
      header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
  }
});

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================
function revealOnScroll() {
  const reveals = document.querySelectorAll('.destaque-card, .prato-card, .valor-card, .diferencial-item');

  reveals.forEach(element => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
}

// Inicializa elementos para animação
document.addEventListener('DOMContentLoaded', function() {
  const animatedElements = document.querySelectorAll('.destaque-card, .prato-card, .valor-card, .diferencial-item');
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  revealOnScroll();
});

window.addEventListener('scroll', revealOnScroll);

// ============================================
// FORMATAÇÃO DE TELEFONE
// ============================================
function formatarTelefone(input) {
  let valor = input.value.replace(/\D/g, '');

  if (valor.length <= 10) {
    valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else {
    valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }

  input.value = valor;
}

// Aplica formatação se o campo existir
document.addEventListener('DOMContentLoaded', function() {
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function() {
      formatarTelefone(this);
    });
  }
});

// ============================================
// FORMATAÇÃO DE CEP
// ============================================
function formatarCEP(input) {
  let valor = input.value.replace(/\D/g, '');
  valor = valor.replace(/(\d{5})(\d{0,3})/, '$1-$2');
  input.value = valor;
}

document.addEventListener('DOMContentLoaded', function() {
  const cepInput = document.getElementById('cep');
  if (cepInput) {
    cepInput.addEventListener('input', function() {
      formatarCEP(this);
    });
  }
});

// ============================================
// BUSCAR CEP (SIMULAÇÃO)
// ============================================
function buscarCEP() {
  const cepInput = document.getElementById('cep');
  const cep = cepInput.value.replace(/\D/g, '');

  if (cep.length !== 8) {
    alert('CEP inválido! Digite um CEP válido.');
    return;
  }

  // Simulação de busca de CEP
  // Em produção, integraria com API ViaCEP
  document.getElementById('endereco').value = 'Rua Exemplo';
  document.getElementById('bairro').value = 'Centro';
  document.getElementById('cidade').value = 'São Paulo';

  alert('CEP encontrado! Verifique os dados preenchidos automaticamente.');
}

// ============================================
// FORMATAÇÃO DE CARTÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const numeroCartaoInput = document.getElementById('numeroCartao');
  if (numeroCartaoInput) {
    numeroCartaoInput.addEventListener('input', function() {
      let valor = this.value.replace(/\D/g, '');
      valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
      this.value = valor;
    });
  }

  const validadeInput = document.getElementById('validade');
  if (validadeInput) {
    validadeInput.addEventListener('input', function() {
      let valor = this.value.replace(/\D/g, '');
      if (valor.length >= 2) {
        valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
      }
      this.value = valor;
    });
  }

  const cvvInput = document.getElementById('cvv');
  if (cvvInput) {
    cvvInput.addEventListener('input', function() {
      this.value = this.value.replace(/\D/g, '').substring(0, 3);
    });
  }
});

// ============================================
// VALIDAÇÃO DE EMAIL
// ============================================
function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ============================================
// LOADING SPINNER (Utilitário)
// ============================================
function mostrarLoading() {
  const loading = document.createElement('div');
  loading.id = 'loading';
  loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
  loading.innerHTML = '<div style="color: white; font-size: 2rem;">Processando...</div>';
  document.body.appendChild(loading);
}

function esconderLoading() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.remove();
  }
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Criar botão de voltar ao topo
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.innerHTML = '↑';
  scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        display: none;
        z-index: 999;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
  scrollTopBtn.id = 'scrollTopBtn';
  document.body.appendChild(scrollTopBtn);

  // Mostrar/esconder botão baseado no scroll
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollTopBtn.style.display = 'block';
    } else {
      scrollTopBtn.style.display = 'none';
    }
  });

  // Voltar ao topo ao clicar
  scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Efeito hover
  scrollTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
  });

  scrollTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
});

// ============================================
// NOTIFICAÇÕES TOAST
// ============================================
function mostrarToast(mensagem, tipo = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast';

  const cores = {
    sucesso: '#388e3c',
    erro: '#d32f2f',
    info: '#1976d2',
    aviso: '#ffa000'
  };

  toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${cores[tipo] || cores.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;

  toast.textContent = mensagem;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Adicionar estilos de animação para toast
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyles);
