const modal = document.getElementById("modal-atualizar");
const caixa = document.getElementById("caixa-alerta");
const confirmBtn = document.getElementById("confirm");








let usuarioIdLogado = null;

let bairroAtual= "";
let nomeAtual ="";
let cpfAtual = "";
let generoAtual = "";
let emailAtual="";
let logradouroAtual="";
let cidadeAtual = "";

let estadoAtual="";
let telefoneAtual="";
// 1. Função chamada ao clicar no botão "Atualizar Informações"
function abrirModalConfirmacao(event) {



    event.preventDefault();

    caixa.style.background = "#fff";
    caixa.style.padding = "40px";
    caixa.style.borderRadius = "20px";
    caixa.style.textAlign = "center";
    caixa.style.maxWidth = "380px";
    caixa.style.width = "90%";
    caixa.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)";

    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.7)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "9999";
    modal.style.backdropFilter = "blur(5px)";      

    confirmBtn.innerHTML = `
        <h3 id="frase" style="color: black; font-weight: bold; margin-bottom: 15px;">Tem certeza que deseja alterar sua senha ?</h3>
        <button id="btn-confirmar-acao" type="button" style="background: blue; color: white; font-weight: bold; font-size: 16px; border-radius: 10px; cursor: pointer; padding: 10px 20px; border: none; margin-bottom: 10px; width: 100%;">Confirmar atualização</button><br>
        <button id="btn-cancelar-acao" type="button" style="background: #ccc; color: black; font-weight: bold; font-size: 16px; border-radius: 10px; cursor: pointer; padding: 10px 20px; border: none; width: 100%;">Cancelar</button>
    `;

    // Ativa os eventos dos botões criados dinamicamente no modal
    document.getElementById("btn-confirmar-acao").addEventListener("click", executarAtualizacaoNoBanco);
    document.getElementById("btn-cancelar-acao").addEventListener("click", fecharConfirmacao);
}

function fecharConfirmacao(event) {
    if(event) event.preventDefault();
    modal.style.display = "none";
}

// 2. Carregar dados iniciais no DOM
document.addEventListener('DOMContentLoaded', function() {
    const dados = localStorage.getItem('emailUsuario') || localStorage.getItem('cpf');

    fetch('http://localhost:8082/usuarios/')
    .then(response => response.json())
    .then(data => {
        const usuarioLogado = data.find(usuario => usuario.emailUsuario === dados || usuario.cpf === dados);


       

        if (usuarioLogado) {
            usuarioIdLogado = usuarioLogado.usuarioId; 
            generoAtual = usuarioLogado.genero;
            senhaAtual= usuarioLogado.senhaUsuario;


            document.getElementById('nome').value = usuarioLogado.nomeUsuario || '';
            document.getElementById('cpf').value = usuarioLogado.cpf || '';
            document.getElementById('genero').value = usuarioLogado.genero || '';
            document.getElementById('telefone').value = usuarioLogado.telefone || '';
            document.getElementById('email').value = usuarioLogado.emailUsuario || '';
            document.getElementById('logradouro').value = usuarioLogado.logradouro || '';
            document.getElementById('bairro').value = usuarioLogado.bairro || '';
            document.getElementById('cidade').value = usuarioLogado.cidade || '';
            document.getElementById('estado').value = usuarioLogado.estado || '';
            // document.getElementById('cep').value = usuarioLogado.cep || '';
            // document.getElementById("senha-atual").value=usuarioLogado.senhaUsuario || '';
        } else {
            const erro = document.getElementById("error");
   const modal = document.getElementById("cartao-informativo");
   const caixa = document.getElementById("sobreposicao-tela");

    erro.innerHTML=`<h3>Erro </h3><br><p>Usuário não encontrado.Por favor,faça login novamente :</p> <br> <button id="tentativa" onclick="window.location.href='index.html'">Cadastre</button>`;
    

const con = document.getElementById("tentativa");
 document.querySelector("h3").style.color="red";
 document.querySelector('p').style.color="black";

modal.style.background="#fff";
        modal.style.padding="40px";
        modal.style.borderRadius= "20px";
        modal.style.textAlign= "center";
        modal.style.maxWidth= "380px";
        modal.style.width= "90%";
        modal.style.boxShadow= "0 15px 30px rgba(0,0,0,0.3)";
        modal.style.animation= "entradaSuave 0.4s cubic-bezier(0.68,-0.55,0.265,1.55) forwards";
     
caixa.style.position="fixed";
caixa.style.top="0";
caixa.style.left="0";
caixa.style.width="100%";
caixa.style.height="100%";
caixa.style.background="rgba(0,0,0,0.7)";
caixa.style.display="flex";
caixa.style.justifyContent="center";
caixa.style.alignItems="center";
caixa.style.zIndex="9999";
caixa.style.backdropFilter="blur(5px)";        

con.style.background="blue";
con.style.color="white";
con.style.fontWeight="BOLD";
con.style.fontSize="18px";
con.style.borderRadius="10px";
con.style.cursor="pointer";
con.style.transition="background 0.3s ease, transform 0.3s ease";
con.style.padding="10px 20px";


        }
    })
    .catch(error => {
        console.error('Erro ao buscar os dados do usuário:', error);
    });
});


function executarAtualizacaoNoBanco() {
    if(modal) {
        modal.style.display = "none";
    }

    const usuarioId = usuarioIdLogado; 
    // const nome = document.getElementById('nome').value;
    // const cpf = document.getElementById('cpf').value;
    // const telefone = document.getElementById('telefone').value;
    // const email = document.getElementById('email').value;
    // const rua = document.getElementById('endereco').value;
    // const bairro = document.getElementById('bairro').value;
    // const cidade = document.getElementById('cidade').value;
    // const estado = document.getElementById('estado').value;
    // const cep = document.getElementById('cep').value;


    const senhaNovaInput = document.getElementById("senha-nova").value.trim();
    const confirmarSenhaInput = document.getElementById("confirmar-senha").value.trim();




        if (senhaNovaInput !== confirmarSenhaInput) {
         const erro = document.getElementById("error");
   const modal = document.getElementById("cartao-informativo");
   const caixa = document.getElementById("sobreposicao-tela");

    erro.innerHTML=`<h3>Erro </h3><br><p>Senhas Não correspondem, por favor digite novamente!</p> <br> <button id="tentativa" onclick="window.location.href='trocar_senha.html'">Ok</button>`;
    

const con = document.getElementById("tentativa");
 document.querySelector("h3").style.color="red";
 document.querySelector('p').style.color="black";

modal.style.background="#fff";
        modal.style.padding="40px";
        modal.style.borderRadius= "20px";
        modal.style.textAlign= "center";
        modal.style.maxWidth= "380px";
        modal.style.width= "90%";
        modal.style.boxShadow= "0 15px 30px rgba(0,0,0,0.3)";
        modal.style.animation= "entradaSuave 0.4s cubic-bezier(0.68,-0.55,0.265,1.55) forwards";
     
caixa.style.position="fixed";
caixa.style.top="0";
caixa.style.left="0";
caixa.style.width="100%";
caixa.style.height="100%";
caixa.style.background="rgba(0,0,0,0.7)";
caixa.style.display="flex";
caixa.style.justifyContent="center";
caixa.style.alignItems="center";
caixa.style.zIndex="9999";
caixa.style.backdropFilter="blur(5px)";        

con.style.background="blue";
con.style.color="white";
con.style.fontWeight="BOLD";
con.style.fontSize="18px";
con.style.borderRadius="10px";
con.style.cursor="pointer";
con.style.transition="background 0.3s ease, transform 0.3s ease";
con.style.padding="10px 20px";


        return; 
    }











const bairroInput = document.getElementById("bairro").value.trim();
const cidadeInput = document.getElementById("cidade").value.trim();
const generoInput = document.getElementById("genero").value.trim();
const estadoInput = document.getElementById("estado").value.trim();
const logradouroInput = document.getElementById("logradouro").value.trim();
const emailInput = document.getElementById("email").value.trim();
const telefoneInput = document.getElementById("telefone").value.trim();
const cpfInput = document.getElementById("cpf").value.trim();
const nomeInput = document.getElementById("nome").value.trim();


    const dadosAtualizados = {
         nomeUsuario: nomeInput !== "" ? nomeInput : nomeAtual,
         cpf: cpfInput !== "" ? cpfInput:cpfAtual,
         telefone: telefoneInput !== "" ? telefoneInput: telefoneAtual,
         emailUsuario: emailInput  !== "" ? emailInput:emailAtual,
         logradouro: logradouroInput !== ""? logradouroInput:logradouroAtual,
         bairro: bairroInput !==""? bairroInput : bairroAtual,
         cidade: cidadeInput !==""?cidadeInput:cidadeAtual,
         estado: estadoInput !== ""?estadoInput:estadoAtual,
         genero: generoInput !== "" ? generoInput:generoAtual,
        // cep: cep,
        senhaUsuario: senhaNovaInput !== "" ? senhaNovaInput : senhaAtual // se a senha input não estiver vazia ele coloca a senha que o usuario for digitar, senão ele mantém a senhaAtual que é a senha que ele fez no inicio que esta cadastrada no db dele.
    };

    fetch(`http://localhost:8082/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosAtualizados)
    })




    

    .then(response => {
        if (response.ok) {
        localStorage.setItem('senhaUsuario', dadosAtualizados.senhaUsuario);
       

        // Chama o modal de sucesso na tela e pausa o fluxo aguardando o clique do usuário
        mostrarModalSucesso();
    } else {
        return response.text().then(text => { throw new Error(text); });
    }
})
    .catch(error => {
        console.error('Erro ao atualizar os dados:', error);
        alert('Erro ao realizar a atualização. Por favor, tente novamente.');
    });
}
function mostrarModalSucesso() {
    caixa.style.background = "#fff";
    caixa.style.padding = "40px";
    caixa.style.borderRadius = "20px";
    caixa.style.textAlign = "center";
    caixa.style.maxWidth = "380px";
    caixa.style.width = "90%";
    caixa.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)";

    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.7)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "9999";
    modal.style.backdropFilter = "blur(5px)";      

    // Aqui o botão tem o onclick direto para a index.html, só disparando quando clicado
    confirmBtn.innerHTML = `
        <h3 id="frase" style="color: black; font-weight: bold; margin-bottom: 15px;">Senha Atualizada com sucesso!</h3>
        <button id="ok" type="button" onclick="window.location.href='index.html'" style="background: blue; color: white; font-weight: bold; font-size: 16px; border-radius: 10px; cursor: pointer; padding: 10px 20px; border: none; margin-bottom: 10px; width: 100%;">ok</button><br>
    `;
}