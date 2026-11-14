(function () {
  const MINIMO_DE_LETRAS = 2;
  const MAXIMO_DE_SUGESTOES = 6;
  const ESPERA_EM_MS = 150;

  function normalizar(texto) {
    return String(texto == null ? '' : texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function formatarPreco(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function irParaProdutos(texto) {
    const termoLimpo = String(texto || '').trim();
    const endereco = 'produtos.html' + (termoLimpo ? '?busca=' + encodeURIComponent(termoLimpo) : '');
    window.location.href = endereco;
  }

  function injetarEstilos() {
    if (document.getElementById('farmabusca-css')) return;
    const estilo = document.createElement('style');
    estilo.id = 'farmabusca-css';
    estilo.textContent = `
      .fb-lista { position: absolute; z-index: 10000; background: #fff; color: #222; border: 1px solid #d9d9d9;
        border-radius: 12px; box-shadow: 0 12px 28px rgba(0,0,0,.18); overflow-x: hidden; overflow-y: auto;
        max-height: 70vh; font-family: inherit; text-align: left; }
      .fb-aviso { padding: 10px 14px; font-size: 13px; color: #666; background: #fafafa; border-bottom: 1px solid #eee; }
      .fb-vazio { padding: 16px 14px; font-size: 14px; color: #555; }
      .fb-item { display: flex; align-items: center; gap: 12px; padding: 9px 14px; cursor: pointer; }
      .fb-item[aria-selected="true"], .fb-item:hover { background: #e8f6ef; }
      .fb-img { width: 42px; height: 42px; object-fit: contain; flex: none; border-radius: 6px; background: #f5f5f5; }
      .fb-nome { flex: 1; min-width: 0; font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .fb-preco { flex: none; font-size: 14px; font-weight: 700; color: #1f8f5f; }
      .fb-rodape { padding: 11px 14px; font-size: 14px; font-weight: 600; color: #1f8f5f; border-top: 1px solid #eee; cursor: pointer; }
      .fb-rodape[aria-selected="true"], .fb-rodape:hover { background: #e8f6ef; }
    `;
    document.head.appendChild(estilo);
  }

  function iniciar(opcoes) {
    const campo = opcoes.campo;
    if (!campo) return;
    injetarEstilos();

    const aoEscolher = opcoes.aoEscolher || function (produto) { irParaProdutos(String(produto.nome).trim()); };
    const aoPesquisar = opcoes.aoPesquisar || irParaProdutos;

    const lista = document.createElement('div');
    lista.className = 'fb-lista';
    lista.setAttribute('role', 'listbox');
    lista.style.display = 'none';
    document.body.appendChild(lista);

    campo.setAttribute('autocomplete', 'off');
    campo.setAttribute('aria-autocomplete', 'list');

    let opcoesDaLista = [];  
    let acoes = [];          
    let ativo = -1;           
    let temporizador = null;

    function posicionar() {
      const r = campo.getBoundingClientRect();
      lista.style.left = r.left + window.scrollX + 'px';
      lista.style.top = (r.bottom + 6 + window.scrollY) + 'px';
      lista.style.width = Math.max(r.width, 280) + 'px';
    }

    function abrir() { posicionar(); lista.style.display = 'block'; }
    function fechar() { lista.style.display = 'none'; ativo = -1; }
    function estaAberta() { return lista.style.display !== 'none'; }

    function destacar(indice) {
      opcoesDaLista.forEach((el, i) => el.setAttribute('aria-selected', i === indice ? 'true' : 'false'));
      ativo = indice;
      if (indice >= 0 && opcoesDaLista[indice].scrollIntoView) opcoesDaLista[indice].scrollIntoView({ block: 'nearest' });
    }

    function mensagem(texto, classe) {
      lista.innerHTML = '';
      opcoesDaLista = []; acoes = []; ativo = -1;
      const div = document.createElement('div');
      div.className = classe || 'fb-vazio';
      div.textContent = texto;
      lista.appendChild(div);
      abrir();
    }

    function escolher(indice) {
      if (indice < 0 || !acoes[indice]) return;
      fechar();
      acoes[indice]();
    }

    function buscarEFiltrar(termo) {
      // Usa diretamente o array produtosDoBanco da página index.html
      if (typeof produtosDoBanco === 'undefined') {
        mensagem('Nenhum produto cadastrado.');
        return;
      }

      const t = normalizar(termo);
      
      // Filtra os produtos que contêm o termo
      const filtrados = produtosDoBanco.filter(p => normalizar(p.nome).includes(t));

      if (filtrados.length === 0) {
        mensagem('Nenhum produto encontrado para “' + termo + '”.');
        return;
      }

      // Ordenação rigorosa:
      // 1. O nome começa exatamente com o termo digitado (Prioridade Máxima)
      // 2. Ordem alfabética ou índice de aparição
      filtrados.sort((a, b) => {
        const nomeA = normalizar(a.nome);
        const nomeB = normalizar(b.nome);

        const começaA = nomeA.startsWith(t) ? 0 : 1;
        const começaB = nomeB.startsWith(t) ? 0 : 1;
        if (começaA !== começaB) return começaA - começaB;

        return nomeA.indexOf(t) - nomeB.indexOf(t);
      });

      mostrar(termo, filtrados);
    }

    function mostrar(termo, produtos) {
      lista.innerHTML = '';
      opcoesDaLista = []; acoes = []; ativo = -1;

      produtos.slice(0, MAXIMO_DE_SUGESTOES).forEach(produto => {
        const item = document.createElement('div');
        item.className = 'fb-item';
        item.setAttribute('role', 'option');

        const img = document.createElement('img');
        img.className = 'fb-img';
        img.alt = '';
        
        let imagemNome = produto.imagem ? produto.imagem.trim() : 'default.png';
        img.src = 'produtos/' + imagemNome;
        
        img.onerror = function () { 
          this.onerror = null; 
          img.src = 'img/logo.png'; 
        };

        const nome = document.createElement('span');
        nome.className = 'fb-nome';
        nome.textContent = String(produto.nome).trim();

        const preco = document.createElement('span');
        preco.className = 'fb-preco';
        preco.textContent = formatarPreco(produto.preco);

        item.append(img, nome, preco);
        lista.appendChild(item);
        opcoesDaLista.push(item);
        acoes.push(function () { campo.value = String(produto.nome).trim(); aoEscolher(produto); });
      });

      const rodape = document.createElement('div');
      rodape.className = 'fb-rodape';
      rodape.setAttribute('role', 'option');
      rodape.textContent = produtos.length === 1
        ? 'Ver resultado para “' + termo + '”'
        : 'Ver todos os ' + produtos.length + ' resultados para “' + termo + '”';
      lista.appendChild(rodape);
      opcoesDaLista.push(rodape);
      acoes.push(function () { aoPesquisar(termo); });

      opcoesDaLista.forEach((el, i) => {
        el.addEventListener('mousedown', e => e.preventDefault());
        el.addEventListener('click', () => escolher(i));
        el.addEventListener('mousemove', () => { if (ativo !== i) destacar(i); });
      });
      abrir();
    }

    campo.addEventListener('input', function () {
      const termo = campo.value.trim();
      clearTimeout(temporizador);
      if (termo.length < MINIMO_DE_LETRAS) { fechar(); return; }
      temporizador = setTimeout(() => buscarEFiltrar(termo), ESPERA_EM_MS);
    });

    campo.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!estaAberta() || opcoesDaLista.length === 0) return;
        e.preventDefault();
        const total = opcoesDaLista.length;
        const proximo = e.key === 'ArrowDown' ? (ativo + 1) % total : (ativo <= 0 ? total - 1 : ativo - 1);
        destacar(proximo);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (estaAberta() && ativo >= 0) { escolher(ativo); return; }
        clearTimeout(temporizador);
        fechar();
        aoPesquisar(campo.value.trim());
      } else if (e.key === 'Escape' || e.key === 'Tab') {
        fechar();
      }
    });

    if (opcoes.lupa) {
      opcoes.lupa.style.cursor = 'pointer';
      const elementoLupa = opcoes.lupa.closest('.botao-busca') || opcoes.lupa;
      elementoLupa.addEventListener('click', function () {
        clearTimeout(temporizador);
        fechar();
        aoPesquisar(campo.value.trim());
      });
    }

    document.addEventListener('mousedown', function (e) {
      if (!lista.contains(e.target) && e.target !== campo) fechar();
    });
    window.addEventListener('resize', function () { if (estaAberta()) posicionar(); });
    window.addEventListener('scroll', function () { if (estaAberta()) posicionar(); }, true);
  }

  window.FarmaBusca = { iniciar: iniciar };
})();