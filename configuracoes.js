'use strict';

(() => {
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
    const escalasPermitidas = [0.9, 1, 1.15, 1.3];
    let preferencias = { ...PADRAO };

    const status = document.getElementById('mensagem-status');
    const escalaBotoes = [...document.querySelectorAll('[data-font-scale]')];
    const temaBotoes = [...document.querySelectorAll('[data-theme]')];
    const controles = [...document.querySelectorAll('[data-setting]')];
    const ouvirBotao = document.getElementById('ouvir-pagina');
    const pararBotao = document.getElementById('parar-leitura');
    const restaurarBotao = document.getElementById('restaurar-padrao');

    function informar(mensagem) {
        if (status) status.textContent = mensagem;
    }

    function carregarPreferencias() {
        try {
            const dados = localStorage.getItem(STORAGE_KEY);
            if (!dados) return { ...PADRAO };
            const salvas = JSON.parse(dados);
            if (!salvas || typeof salvas !== 'object') return { ...PADRAO };

            const resultado = { ...PADRAO };
            if (escalasPermitidas.includes(Number(salvas.fontScale))) {
                resultado.fontScale = Number(salvas.fontScale);
            }
            resultado.theme = salvas.theme === 'escuro' ? 'escuro' : 'claro';
            Object.keys(PADRAO).forEach((chave) => {
                if (typeof PADRAO[chave] === 'boolean' && typeof salvas[chave] === 'boolean') {
                    resultado[chave] = salvas[chave];
                }
            });
            return resultado;
        } catch (erro) {
            return { ...PADRAO };
        }
    }

    function salvarPreferencias(mostrarMensagem = true) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(preferencias));
            if (mostrarMensagem) informar('Preferências salvas com sucesso.');
        } catch (erro) {
            informar('Alterações aplicadas, mas o navegador impediu o salvamento local.');
        }
    }

    function aplicarPreferencias() {
        // Aplicação de classes globais no body
        document.body.classList.toggle('tema-escuro', preferencias.theme === 'escuro');
        document.body.classList.toggle('alto-contraste', preferencias.altoContraste);
        document.body.classList.toggle('destacar-interativos', preferencias.destacarInterativos);
        document.body.classList.toggle('reduzir-animacoes', preferencias.reduzirAnimacoes);
        document.documentElement.classList.toggle('reduzir-animacoes', preferencias.reduzirAnimacoes);
        
        // Aplicação da escala de fonte via atributo data-scale
        document.body.setAttribute('data-scale', preferencias.fontScale);

        if (window.FarmaSyncAcessibilidade && typeof window.FarmaSyncAcessibilidade.aplicar === 'function') {
            window.FarmaSyncAcessibilidade.aplicar(preferencias);
        }

        // Atualização visual dos botões de escala de fonte
        escalaBotoes.forEach((botao) => {
            const escala = Number(botao.dataset.fontScale);
            const ativo = escala === preferencias.fontScale;
            botao.classList.toggle('selecionado', ativo);
            botao.setAttribute('aria-pressed', String(ativo));
        });

        // Atualização visual dos botões de tema
        temaBotoes.forEach((botao) => {
            const selecionado = botao.dataset.theme === preferencias.theme;
            botao.classList.toggle('selecionado', selecionado);
            botao.setAttribute('aria-pressed', String(selecionado));
        });

        // Atualização dos inputs do tipo switch/checkbox
        controles.forEach((controle) => {
            const nome = controle.dataset.setting;
            if (nome && Object.prototype.hasOwnProperty.call(preferencias, nome)) {
                controle.checked = Boolean(preferencias[nome]);
                const wrapper = controle.closest('.controle-switch');
                const texto = wrapper?.querySelector('.texto-switch');
                if (texto) texto.textContent = controle.checked ? 'Ativado' : 'Desativado';
            }
        });

        if (ouvirBotao) ouvirBotao.disabled = !preferencias.leituraVoz;
        if (pararBotao) pararBotao.disabled = !preferencias.leituraVoz;
    }

    // Eventos de clique nos botões de escala
    escalaBotoes.forEach((botao) => {
        botao.addEventListener('click', () => {
            const escala = Number(botao.dataset.fontScale);
            if (!escalasPermitidas.includes(escala)) return;
            preferencias.fontScale = escala;
            aplicarPreferencias();
            salvarPreferencias();
        });
    });

    // Eventos de clique nos botões de tema (Claro / Escuro)
    temaBotoes.forEach((botao) => {
        botao.addEventListener('click', () => {
            const novoTema = botao.dataset.theme;
            preferencias.theme = novoTema === 'escuro' ? 'escuro' : 'claro';
            aplicarPreferencias();
            salvarPreferencias();
        });
    });

    // Eventos de mudança nos switches de configuração
    controles.forEach((controle) => {
        controle.addEventListener('change', () => {
            const nome = controle.dataset.setting;
            if (!Object.prototype.hasOwnProperty.call(PADRAO, nome)) return;
            preferencias[nome] = controle.checked;
            aplicarPreferencias();
            salvarPreferencias();
            if (nome === 'leituraVoz' && !controle.checked && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        });
    });

    // Leitura por voz (SpeechSynthesis)
    if (ouvirBotao) {
        ouvirBotao.addEventListener('click', () => {
            if (!preferencias.leituraVoz) {
                informar('Ative a leitura em voz alta nas opções de acessibilidade.');
                return;
            }
            if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') {
                informar('Seu navegador não suporta leitura em voz alta.');
                return;
            }

            const conteudo = document.querySelector('.conteudo-configuracoes') || document.body;
            const copia = conteudo.cloneNode(true);
            copia.querySelectorAll('button, input, script, style, .acoes-leitura, .controle-switch').forEach((no) => no.remove());
            const texto = (copia.innerText || copia.textContent || '').replace(/\s+/g, ' ').trim();
            
            window.speechSynthesis.cancel();
            const fala = new window.SpeechSynthesisUtterance(texto);
            fala.lang = 'pt-BR';
            fala.rate = 0.95;
            fala.onstart = () => informar('Lendo página em voz alta...');
            fala.onend = () => informar('Leitura finalizada.');
            fala.onerror = () => informar('Erro ao executar a leitura.');
            window.speechSynthesis.speak(fala);
        });
    }

    if (pararBotao) {
        pararBotao.addEventListener('click', () => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            informar('Leitura interrompida.');
        });
    }

    // Botão de restaurar padrões
    if (restaurarBotao) {
        restaurarBotao.addEventListener('click', () => {
            const confirmar = window.confirm('Deseja retornar todas as preferências para os valores originais?');
            if (!confirmar) return;
            preferencias = { ...PADRAO };
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            aplicarPreferencias();
            salvarPreferencias(false);
            informar('Configurações restauradas com sucesso.');
        });
    }

    // Inicialização automática ao carregar a página
    preferencias = carregarPreferencias();
    aplicarPreferencias();
})();