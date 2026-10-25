/* Preferências globais do FarmaSync.
   As escolhas são guardadas em localStorage e aplicadas em todas as páginas
   que carregam este arquivo. */
(() => {
  'use strict';

  const STORAGE_KEY = 'farmasync-preferencias-v1';
  const PADRAO = {
    fontScale: 1,
    theme: 'claro',
    altoContraste: false,
    destacarInterativos: false,
    reduzirAnimacoes: false,
    leituraVoz: false,
    notificacoesPedidos: true,
    notificacoesPromocoes: false,
    lembretesMedicamentos: false
  };
  const ESCALAS = [0.9, 1, 1.15, 1.3];
  const SELETOR_TEXTO = [
    'h1','h2','h3','h4','h5','h6','p','a','button','input','textarea','select','option',
    'label','li','summary','span','strong','b','em','small','td','th','legend','figcaption',
    'dt','dd','blockquote','output','caption'
  ].join(',');
  const NAO_ESCALAR = new Set(['SCRIPT','STYLE','NOSCRIPT','SVG','PATH','CANVAS','IFRAME','VIDEO','AUDIO']);
  let preferenciasAtuais = { ...PADRAO };
  let botaoLeitura = null;

  function normalizarPreferencias(dados) {
    const resultado = { ...PADRAO };
    if (!dados || typeof dados !== 'object') return resultado;
    const escala = Number(dados.fontScale);
    if (ESCALAS.includes(escala)) resultado.fontScale = escala;
    resultado.theme = dados.theme === 'escuro' ? 'escuro' : 'claro';
    for (const chave of Object.keys(PADRAO)) {
      if (typeof PADRAO[chave] === 'boolean' && typeof dados[chave] === 'boolean') {
        resultado[chave] = dados[chave];
      }
    }
    return resultado;
  }

  function carregarPreferencias() {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      return salvo ? normalizarPreferencias(JSON.parse(salvo)) : { ...PADRAO };
    } catch (erro) {
      return { ...PADRAO };
    }
  }

  function lerFontesDaPagina() {
    const elementos = new Set(document.querySelectorAll(SELETOR_TEXTO));
    document.querySelectorAll('body *').forEach((elemento) => {
      if (NAO_ESCALAR.has(elemento.tagName)) return;
      const temTextoDireto = [...elemento.childNodes].some((no) =>
        no.nodeType === Node.TEXT_NODE && no.nodeValue.trim().length > 0
      );
      if (temTextoDireto) elementos.add(elemento);
    });
    return [...elementos].filter((elemento) => !NAO_ESCALAR.has(elemento.tagName));
  }

  function guardarFonteBase(elemento) {
    if (elemento.dataset.farmasyncBaseFontSize) return;
    const computed = Number.parseFloat(getComputedStyle(elemento).fontSize);
    elemento.dataset.farmasyncBaseFontSize = String(Number.isFinite(computed) ? computed : 16);
    elemento.dataset.farmasyncOriginalInlineFont = elemento.style.getPropertyValue('font-size');
    elemento.dataset.farmasyncOriginalInlinePriority = elemento.style.getPropertyPriority('font-size');
  }

  function restaurarFonteOriginal(elemento) {
    const original = elemento.dataset.farmasyncOriginalInlineFont || '';
    const prioridade = elemento.dataset.farmasyncOriginalInlinePriority || '';
    if (original) elemento.style.setProperty('font-size', original, prioridade);
    else elemento.style.removeProperty('font-size');
  }

  function aplicarEscalaFonte(escala) {
    const elementos = lerFontesDaPagina();
    elementos.forEach((elemento) => {
      guardarFonteBase(elemento);
      if (escala === 1) {
        restaurarFonteOriginal(elemento);
        return;
      }
      const base = Number.parseFloat(elemento.dataset.farmasyncBaseFontSize) || 16;
      elemento.style.setProperty('font-size', `${(base * escala).toFixed(2)}px`, 'important');
    });
  }

  function textoParaLeitura() {
    const principal = document.querySelector('main') || document.body;
    const copia = principal.cloneNode(true);
    copia.querySelectorAll('button, input, textarea, select, script, style, .farmasync-leitura-global, .acoes-leitura, .controle-switch').forEach((no) => no.remove());
    return (copia.innerText || copia.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function pararLeitura() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (botaoLeitura) {
      botaoLeitura.textContent = '🔊 Ler esta página';
      botaoLeitura.setAttribute('aria-label', 'Ler esta página em voz alta');
      botaoLeitura.setAttribute('aria-pressed', 'false');
    }
  }

  function alternarLeitura() {
    if (!preferenciasAtuais.leituraVoz) return;
    if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') {
      if (botaoLeitura) botaoLeitura.textContent = 'Leitura indisponível';
      return;
    }
    if (window.speechSynthesis.speaking) {
      pararLeitura();
      return;
    }
    const texto = textoParaLeitura();
    if (!texto) return;
    const fala = new window.SpeechSynthesisUtterance(texto);
    fala.lang = 'pt-BR';
    fala.rate = 0.92;
    fala.onend = pararLeitura;
    fala.onerror = pararLeitura;
    if (botaoLeitura) {
      botaoLeitura.textContent = '■ Parar leitura';
      botaoLeitura.setAttribute('aria-label', 'Parar leitura em voz alta');
      botaoLeitura.setAttribute('aria-pressed', 'true');
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(fala);
  }

  function atualizarBotaoLeitura() {
    const paginaConfiguracoes = Boolean(document.querySelector('.conteudo-configuracoes'));
    if (!preferenciasAtuais.leituraVoz || paginaConfiguracoes) {
      if (botaoLeitura) botaoLeitura.remove();
      botaoLeitura = null;
      return;
    }
    if (botaoLeitura && botaoLeitura.isConnected) return;
    botaoLeitura = document.createElement('button');
    botaoLeitura.type = 'button';
    botaoLeitura.className = 'farmasync-leitura-global';
    botaoLeitura.textContent = '🔊 Ler esta página';
    botaoLeitura.setAttribute('aria-label', 'Ler esta página em voz alta');
    botaoLeitura.setAttribute('aria-pressed', 'false');
    botaoLeitura.addEventListener('click', alternarLeitura);
    document.body.appendChild(botaoLeitura);
    // O botão também respeita o tamanho de fonte escolhido.
    guardarFonteBase(botaoLeitura);
    if (preferenciasAtuais.fontScale !== 1) {
      const base = Number.parseFloat(botaoLeitura.dataset.farmasyncBaseFontSize) || 16;
      botaoLeitura.style.setProperty('font-size', `${(base * preferenciasAtuais.fontScale).toFixed(2)}px`, 'important');
    }
  }

  function aplicar(preferencias) {
    preferenciasAtuais = normalizarPreferencias(preferencias);
    if (!document.body) return;

    document.body.classList.toggle('tema-escuro', preferenciasAtuais.theme === 'escuro');
    document.body.classList.toggle('alto-contraste', preferenciasAtuais.altoContraste);
    document.body.classList.toggle('destacar-interativos', preferenciasAtuais.destacarInterativos);
    document.body.classList.toggle('reduzir-animacoes', preferenciasAtuais.reduzirAnimacoes);
    document.documentElement.classList.toggle('reduzir-animacoes', preferenciasAtuais.reduzirAnimacoes);
    document.documentElement.dataset.farmasyncTheme = preferenciasAtuais.theme;
    document.documentElement.style.setProperty('--farmasync-font-scale', String(preferenciasAtuais.fontScale));

    aplicarEscalaFonte(preferenciasAtuais.fontScale);
    atualizarBotaoLeitura();
    document.dispatchEvent(new CustomEvent('farmasync:preferencias-aplicadas', {
      detail: { ...preferenciasAtuais }
    }));
  }

  function salvar(preferencias) {
    preferenciasAtuais = normalizarPreferencias(preferencias);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferenciasAtuais));
    } catch (erro) {
      // A preferência segue aplicada nesta página mesmo quando o navegador bloqueia storage.
    }
    aplicar(preferenciasAtuais);
    return { ...preferenciasAtuais };
  }

  window.FarmaSyncAcessibilidade = {
    aplicar,
    salvar,
    obter: () => ({ ...preferenciasAtuais }),
    lerPagina: alternarLeitura,
    pararLeitura
  };

  preferenciasAtuais = carregarPreferencias();
  aplicar(preferenciasAtuais);

  window.addEventListener('storage', (evento) => {
    if (evento.key !== STORAGE_KEY) return;
    preferenciasAtuais = carregarPreferencias();
    if (!preferenciasAtuais.leituraVoz) pararLeitura();
    aplicar(preferenciasAtuais);
  });

  // Se o usuário redimensionar a janela, recapturamos as medidas base para manter
  // o tamanho de texto proporcional ao layout responsivo da página.
  let temporizadorRedimensionamento;
  window.addEventListener('resize', () => {
    window.clearTimeout(temporizadorRedimensionamento);
    temporizadorRedimensionamento = window.setTimeout(() => {
      if (preferenciasAtuais.fontScale === 1) return;
      document.querySelectorAll('[data-farmasync-base-font-size]').forEach((elemento) => {
        restaurarFonteOriginal(elemento);
        const computed = Number.parseFloat(getComputedStyle(elemento).fontSize);
        elemento.dataset.farmasyncBaseFontSize = String(Number.isFinite(computed) ? computed : 16);
      });
      aplicarEscalaFonte(preferenciasAtuais.fontScale);
    }, 120);
  });
})();
