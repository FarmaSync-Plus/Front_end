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
            if (mostrarMensagem) informar('Preferências salvas neste navegador.');
        } catch (erro) {
            informar('As alterações estão aplicadas, mas o navegador não permitiu salvá-las.');
        }
    }

    function aplicarPreferencias() {
        document.body.classList.toggle('tema-escuro', preferencias.theme === 'escuro');
        document.body.classList.toggle('alto-contraste', preferencias.altoContraste);
        document.body.classList.toggle('destacar-interativos', preferencias.destacarInterativos);
        document.body.classList.toggle('reduzir-animacoes', preferencias.reduzirAnimacoes);
        document.documentElement.classList.toggle('reduzir-animacoes', preferencias.reduzirAnimacoes);
        if (window.FarmaSyncAcessibilidade) window.FarmaSyncAcessibilidade.aplicar(preferencias);

        escalaBotoes.forEach((botao) => {
            const escala = Number(botao.dataset.fontScale);
            botao.setAttribute('aria-pressed', String(escala === preferencias.fontScale));
        });

        temaBotoes.forEach((botao) => {
            const selecionado = botao.dataset.theme === preferencias.theme;
            botao.classList.toggle('selecionado', selecionado);
            botao.setAttribute('aria-pressed', String(selecionado));
        });

        controles.forEach((controle) => {
            const nome = controle.dataset.setting;
            controle.checked = Boolean(preferencias[nome]);
            const texto = controle.closest('.controle-switch')?.querySelector('.texto-switch');
            if (texto) texto.textContent = controle.checked ? 'Ativado' : 'Desativado';
        });

        if (ouvirBotao) ouvirBotao.disabled = !preferencias.leituraVoz;
        if (pararBotao) pararBotao.disabled = !preferencias.leituraVoz;
    }

    escalaBotoes.forEach((botao) => {
        botao.addEventListener('click', () => {
            const escala = Number(botao.dataset.fontScale);
            if (!escalasPermitidas.includes(escala)) return;
            preferencias.fontScale = escala;
            aplicarPreferencias();
            salvarPreferencias();
        });
    });

    temaBotoes.forEach((botao) => {
        botao.addEventListener('click', () => {
            preferencias.theme = botao.dataset.theme === 'escuro' ? 'escuro' : 'claro';
            aplicarPreferencias();
            salvarPreferencias();
        });
    });

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

    if (ouvirBotao) {
        ouvirBotao.addEventListener('click', () => {
            if (!preferencias.leituraVoz) {
                informar('Ative a leitura em voz alta antes de ouvir as orientações.');
                return;
            }
            if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') {
                informar('A leitura em voz alta não está disponível neste navegador.');
                return;
            }

            const conteudo = document.querySelector('.conteudo-configuracoes');
            const copia = conteudo ? conteudo.cloneNode(true) : document.body.cloneNode(true);
            copia.querySelectorAll('button, input, script, style, .acoes-leitura, .controle-switch').forEach((no) => no.remove());
            const texto = (copia.innerText || copia.textContent || '').replace(/\s+/g, ' ').trim();
            window.speechSynthesis.cancel();
            const fala = new window.SpeechSynthesisUtterance(texto);
            fala.lang = 'pt-BR';
            fala.rate = 0.9;
            fala.onstart = () => informar('Lendo as orientações em voz alta…');
            fala.onend = () => informar('Leitura concluída.');
            fala.onerror = () => informar('Não foi possível concluir a leitura neste momento.');
            window.speechSynthesis.speak(fala);
        });
    }

    if (pararBotao) {
        pararBotao.addEventListener('click', () => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            informar('Leitura interrompida.');
        });
    }

    if (restaurarBotao) {
        restaurarBotao.addEventListener('click', () => {
            const confirmar = window.confirm('Deseja restaurar todas as configurações para os valores padrão?');
            if (!confirmar) return;
            preferencias = { ...PADRAO };
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            aplicarPreferencias();
            salvarPreferencias(false);
            informar('Configurações padrão restauradas.');
        });
    }

    preferencias = carregarPreferencias();
    aplicarPreferencias();
    informar('Suas preferências ficam salvas neste navegador.');
})();
