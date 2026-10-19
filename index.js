let usuarioIdLogado = null;


const sobreposicaotela = document.getElementById("sobreposicao-tela");
const cartaoinformativo=document.getElementById("cartao-informativo"); 
const resposta = document.getElementById("result");



const nomeUsuario = localStorage.getItem('nomedoUsuario');
const usuarioLogado = localStorage.getItem('usuarioLogado'); //esse aqui armazena a string "true" ou "false" dependendo se o usuário está logado ou não




if(nomeUsuario){
   const elemento= document.getElementById('topi');
   const link= document.getElementById("Link-perfil")
   elemento.textContent = nomeUsuario;
    elemento.style.fontSize = '24px';

    link.href="Conta_Do_Usuario.html";
}






