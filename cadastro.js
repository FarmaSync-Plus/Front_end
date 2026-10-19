let usuarioLogado = null;



const sobreposicaotela = document.getElementById("sobreposicao-tela");
const cartaoinformativo=document.getElementById("cartao-informativo"); 
const resposta = document.getElementById("result");

const btn = document.getElementById("cadastrar");
const form = document.getElementById("cadastro-form");


const url="http://localhost:8082/usuarios/save";

form.addEventListener("submit",async function(event) {
 event.preventDefault();
const senha = document.getElementById("senha").value.trim();
const Confirmarsenha = document.getElementById("Confirmar-senha").value.trim();
     console.log("Senha digitada:", senha);
    console.log("Confirmação digitada:", Confirmarsenha);

    if(senha !== Confirmarsenha){
document.getElementById("senha").style.border = "2px solid red";
    document.getElementById("Confirmar-senha").style.border = "2px solid red";

        resposta.innerHTML=`<h3>Erro </h3> <p> As senhas informadas não Batem</p><br><button id="confirmar" onclick = "fecharModal()"  style="background: blue; color: white; font-weight: bold; font-size: 16px; border-radius: 10px; cursor: pointer; padding: 10px 20px; border: none; width: 100%;">Corrigir Senha</button>`;

        const ok = document.getElementById("confirmar");
          document.querySelector("h3").style.color="red";
          document.querySelector('p').style.color="black";


cartaoinformativo.style.background="#fff";
        cartaoinformativo.style.padding="40px";
        cartaoinformativo.style.borderRadius= "20px";
        cartaoinformativo.style.textAlign= "center";
        cartaoinformativo.style.maxWidth= "380px";
        cartaoinformativo.style.width= "90%";
        cartaoinformativo.style.boxShadow= "0 15px 30px rgba(0,0,0,0.3)";
        cartaoinformativo.style.animation= "entradaSuave 0.4s cubic-bezier(0.68,-0.55,0.265,1.55) forwards";
     
         sobreposicaotela.style.position="fixed";
         sobreposicaotela.style.top="0";
         sobreposicaotela.style.left="0";
         sobreposicaotela.style.width="100%";
         sobreposicaotela.style.height="100%";
         sobreposicaotela.style.background="rgba(0,0,0,0.7)";
         sobreposicaotela.style.display="flex";
         sobreposicaotela.style.justifyContent="center";
         sobreposicaotela.style.alignItems="center";
         sobreposicaotela.style.zIndex="9999";
         sobreposicaotela.style.backdropFilter="blur(5px)";                                                     
         
         ok.style.background="blue";
         ok.style.color="white";
         ok.style.fontWeight="BOLD";
         ok.style.fontSize="18px";
         ok.style.borderRadius="10px";
         ok.style.cursor="pointer";
         ok.style.transition="background 0.3s ease, transform 0.3s ease";
         ok.style.padding="10px 20px";
return
    } // verificar isso amanhã



   
    const formData = new FormData(form)
    console.log(formData);

    const response = await fetch(url,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(Object.fromEntries(formData))
    });
    if(response.ok){





        const usuario = await response.json();
 
        const nomeDoNovoUsuario = usuario.nomeUsuario
        const usuarioId = usuario.usuarioId;


        localStorage.setItem('usuarioLogado',true);
        localStorage.setItem('emailUsuario',usuario.emailUsuario);
        localStorage.setItem('nomedoUsuario',nomeDoNovoUsuario);
        localStorage.setItem('usuarioId',usuarioId);



        resposta.innerHTML=`Cadastro Realizado com sucesso! Bem vindo <b>${limparInput(nomeDoNovoUsuario)}!</b> Seu acesso a FarmaSync foi configurado com sucesso !<br><button id="confirmar" onclick = "window.location.href = 'index.html'">Aceitar</button>`;

        const ok = document.getElementById("confirmar");
          document.querySelector("h3").style.color="red";
          document.querySelector('p').style.color="black";


cartaoinformativo.style.background="#fff";
        cartaoinformativo.style.padding="40px";
        cartaoinformativo.style.borderRadius= "20px";
        cartaoinformativo.style.textAlign= "center";
        cartaoinformativo.style.maxWidth= "380px";
        cartaoinformativo.style.width= "90%";
        cartaoinformativo.style.boxShadow= "0 15px 30px rgba(0,0,0,0.3)";
        cartaoinformativo.style.animation= "entradaSuave 0.4s cubic-bezier(0.68,-0.55,0.265,1.55) forwards";
     
         sobreposicaotela.style.position="fixed";
         sobreposicaotela.style.top="0";
         sobreposicaotela.style.left="0";
         sobreposicaotela.style.width="100%";
         sobreposicaotela.style.height="100%";
         sobreposicaotela.style.background="rgba(0,0,0,0.7)";
         sobreposicaotela.style.display="flex";
         sobreposicaotela.style.justifyContent="center";
         sobreposicaotela.style.alignItems="center";
         sobreposicaotela.style.zIndex="9999";
         sobreposicaotela.style.backdropFilter="blur(5px)";                                                     
         
         ok.style.background="blue";
         ok.style.color="white";
         ok.style.fontWeight="BOLD";
         ok.style.fontSize="18px";
         ok.style.borderRadius="10px";
         ok.style.cursor="pointer";
         ok.style.transition="background 0.3s ease, transform 0.3s ease";
         ok.style.padding="10px 20px";

    }else{
         resposta.innerHTML=`Houve um erro inesperado no sistema ! <br><button id="confirmar" onclick = "window.location.href = 'cadastro.html'">Ok</button>`;

        const ok = document.getElementById("confirmar");
          document.querySelector("h3").style.color="red";
          document.querySelector('p').style.color="black";


cartaoinformativo.style.background="#fff";
        cartaoinformativo.style.padding="40px";
        cartaoinformativo.style.borderRadius= "20px";
        cartaoinformativo.style.textAlign= "center";
        cartaoinformativo.style.maxWidth= "380px";
        cartaoinformativo.style.width= "90%";
        cartaoinformativo.style.boxShadow= "0 15px 30px rgba(0,0,0,0.3)";
        cartaoinformativo.style.animation= "entradaSuave 0.4s cubic-bezier(0.68,-0.55,0.265,1.55) forwards";
     
         sobreposicaotela.style.position="fixed";
         sobreposicaotela.style.top="0";
         sobreposicaotela.style.left="0";
         sobreposicaotela.style.width="100%";
         sobreposicaotela.style.height="100%";
         sobreposicaotela.style.background="rgba(0,0,0,0.7)";
         sobreposicaotela.style.display="flex";
         sobreposicaotela.style.justifyContent="center";
         sobreposicaotela.style.alignItems="center";
         sobreposicaotela.style.zIndex="9999";
         sobreposicaotela.style.backdropFilter="blur(5px)";                                                     
         
         ok.style.background="blue";
         ok.style.color="white";
         ok.style.fontWeight="BOLD";
         ok.style.fontSize="18px";
         ok.style.borderRadius="10px";
         ok.style.cursor="pointer";
         ok.style.transition="background 0.3s ease, transform 0.3s ease";
         ok.style.padding="10px 20px";

    }
function limparInput(texto){
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
} 


if(senha.value != Confirmarsenha.value){
    resposta.innerHTML=`As senhas não correspondem, verifique as senhas novamente<br> !<button id="confirmar" onclick = "window.location.href = 'cadastro.html'">Ok</button>`;

        const ok = document.getElementById("confirmar");
          document.querySelector("h3").style.color="red";
          document.querySelector('p').style.color="black";


cartaoinformativo.style.background="#fff";
        cartaoinformativo.style.padding="40px";
        cartaoinformativo.style.borderRadius= "20px";
        cartaoinformativo.style.textAlign= "center";
        cartaoinformativo.style.maxWidth= "380px";
        cartaoinformativo.style.width= "90%";
        cartaoinformativo.style.boxShadow= "0 15px 30px rgba(0,0,0,0.3)";
        cartaoinformativo.style.animation= "entradaSuave 0.4s cubic-bezier(0.68,-0.55,0.265,1.55) forwards";
     
         sobreposicaotela.style.position="fixed";
         sobreposicaotela.style.top="0";
         sobreposicaotela.style.left="0";
         sobreposicaotela.style.width="100%";
         sobreposicaotela.style.height="100%";
         sobreposicaotela.style.background="rgba(0,0,0,0.7)";
         sobreposicaotela.style.display="flex";
         sobreposicaotela.style.justifyContent="center";
         sobreposicaotela.style.alignItems="center";
         sobreposicaotela.style.zIndex="9999";
         sobreposicaotela.style.backdropFilter="blur(5px)";                                                     
         
         ok.style.background="blue";
         ok.style.color="white";
         ok.style.fontWeight="BOLD";
         ok.style.fontSize="18px";
         ok.style.borderRadius="10px";
         ok.style.cursor="pointer";
         ok.style.transition="background 0.3s ease, transform 0.3s ease";
         ok.style.padding="10px 20px";
}

    
})
function fecharModal() {
    const sobreposicaotela = document.getElementById("sobreposicao-tela");
    sobreposicaotela.style.display = "none";
}