
(function () {
  const API_URL = 'http://localhost:8082';
  const MINIMO_DE_LETRAS = 2;
  const MAXIMO_DE_SUGESTOES = 6;
  const ESPERA_EM_MS = 250;

 
  function normalizar(texto) {
    return String(texto == null ? '' : texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function formatarPreco(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function irParaProdutos(texto) {
    const endereco = 'produtos.html' + (texto ? '?busca=' + encodeURIComponent(texto) : '');
    
    if (window.FarmaBusca && typeof window.FarmaBusca.navegar === 'function') window.FarmaBusca.navegar(endereco);
    else window.location.href = endereco;
  }

  function injetarEstilos() {
    if (document.getElementById('farmabusca-css')) return;
    const estilo = document.createElement('style');
    estilo.id = 'farmabusca-css';
    estilo.textContent = `
      .fb-lista { position: fixed; z-index: 10000; background: #fff; color: #222; border: 1px solid #d9d9d9;
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
    let numeroDaRequisicao = 0;
    const guardados = new Map(); 

    function posicionar() {
      const r = campo.getBoundingClientRect();
      lista.style.left = r.left + 'px';
      lista.style.top = (r.bottom + 6) + 'px';
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

    function mostrar(termo, produtos) {
      if (produtos.length === 0) {
        mensagem('Nenhum produto encontrado para “' + termo + '”.');
        return;
      }
      lista.innerHTML = '';
      opcoesDaLista = []; acoes = []; ativo = -1;

      // Se nenhum nome/descrição contém o que foi digitado, o back-end achou por semelhança
      const t = normalizar(termo);
      const achouIgual = produtos.some(p => normalizar(p.nome).includes(t) || normalizar(p.descricao).includes(t));
      if (!achouIgual) {
        const aviso = document.createElement('div');
        aviso.className = 'fb-aviso';
        aviso.textContent = 'Resultados parecidos com “' + termo + '”:';
        lista.appendChild(aviso);
      }

      produtos.slice(0, MAXIMO_DE_SUGESTOES).forEach(produto => {
        const item = document.createElement('div');
        item.className = 'fb-item';
        item.setAttribute('role', 'option');

        const img = document.createElement('img');
        img.className = 'fb-img';
        img.alt = '';
        img.onerror = function () { this.onerror = null; this.src = 'img/logo.png'; };
        img.src = produto.imagem ? 'produtos/' + produto.imagem : 'img/logo.png';

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
        el.addEventListener('mousedown', e => e.preventDefault()); // mantém o foco no campo
        el.addEventListener('click', () => escolher(i));
        el.addEventListener('mousemove', () => { if (ativo !== i) destacar(i); });
      });
      abrir();
    }

    async function buscar(termo) {
      const chave = normalizar(termo);
      if (guardados.has(chave)) { mostrar(termo, guardados.get(chave)); return; }

      const minhaRequisicao = ++numeroDaRequisicao;
      try {
        const resposta = await fetch(API_URL + '/produtos?busca=' + encodeURIComponent(termo));
        if (!resposta.ok) throw new Error('Status ' + resposta.status);
        const dados = await resposta.json();
        guardados.set(chave, dados);
        if (minhaRequisicao !== numeroDaRequisicao) return;   
        if (campo.value.trim() !== termo) return;             
        mostrar(termo, dados);
      } catch (erro) {
        if (minhaRequisicao !== numeroDaRequisicao) return;
        console.error('Erro ao buscar sugestões:', erro);
        mensagem('Não foi possível buscar agora. Confira se o servidor está ligado (' + API_URL + ').', 'fb-vazio');
      }
    }

    campo.addEventListener('input', function () {
      const termo = campo.value.trim();
      clearTimeout(temporizador);
      numeroDaRequisicao++;                 
      if (termo.length < MINIMO_DE_LETRAS) { fechar(); return; }
      temporizador = setTimeout(() => buscar(termo), ESPERA_EM_MS);
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

    campo.addEventListener('focus', function () {
      const termo = campo.value.trim();
      if (termo.length >= MINIMO_DE_LETRAS && guardados.has(normalizar(termo))) mostrar(termo, guardados.get(normalizar(termo)));
    });

    if (opcoes.lupa) {
      opcoes.lupa.style.cursor = 'pointer';
      opcoes.lupa.addEventListener('click', function () {
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
