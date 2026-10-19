let usuarioIdLogado = null;
function apagar(event) {

  if(event) event.preventDefault(); // Evita o comportamento padrão do botão


  //novo nome para armazenar o ID do usuário logado:
        const id =  localStorage.getItem('usuarioId'); // Obtém o ID do usuário logado do localStorage

        

const result = document.getElementById("result");
const cartaoinformativo = document.getElementById("cartao-informativo");
const sobreposicaotela=document.getElementById("sobreposicao-tela");

   if(!id) {
        // alert('Não foi possível identificar o usuário logado.');
        // return;
        result.innerHTML = `<span id = "error"> &#1006;   </span><br> <p>Não foi possível identificar o usuário logado.</p> `;

result.querySelector('p').style.color = "red";
        

cartaoinformativo.style.background = "#fff";
cartaoinformativo.style.padding = "40px";
cartaoinformativo.style.borderRadius = "20px";
cartaoinformativo.style.textAlign = "center";
cartaoinformativo.style.maxWidth = "380px";
cartaoinformativo.style.width = "90%";
cartaoinformativo.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)";
cartaoinformativo.style.animation = "entradaSuave 0.4s cubic-bezier(0.68,-0.55,0.265,1.55) forwards";

sobreposicaotela.style.position = "fixed";
sobreposicaotela.style.top = "0";
sobreposicaotela.style.left = "0";
sobreposicaotela.style.width = "100%";
sobreposicaotela.style.height = "100%";
sobreposicaotela.style.background = "rgba(0,0,0,0.7)";
sobreposicaotela.style.display = "flex";
sobreposicaotela.style.justifyContent = "center";
sobreposicaotela.style.alignItems = "center";
sobreposicaotela.style.zIndex = "9999";
sobreposicaotela.style.backdropFilter = "blur(5px)";   
    }

  cartaoinformativo.style.background = "#fff";
cartaoinformativo.style.padding = "40px";
cartaoinformativo.style.borderRadius = "20px";
cartaoinformativo.style.textAlign = "center";
cartaoinformativo.style.maxWidth = "380px";
cartaoinformativo.style.width = "90%";
cartaoinformativo.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)";
cartaoinformativo.style.animation = "entradaSuave 0.4s cubic-bezier(0.68,-0.55,0.265,1.55) forwards";

sobreposicaotela.style.position = "fixed";
sobreposicaotela.style.top = "0";
sobreposicaotela.style.left = "0";
sobreposicaotela.style.width = "100%";
sobreposicaotela.style.height = "100%";
sobreposicaotela.style.background = "rgba(0,0,0,0.7)";
sobreposicaotela.style.display = "flex";
sobreposicaotela.style.justifyContent = "center";
sobreposicaotela.style.alignItems = "center";
sobreposicaotela.style.zIndex = "9999";
sobreposicaotela.style.backdropFilter = "blur(5px)";

result.innerHTML = `
    <h3 id="frase" style="color: black; font-weight: bold; margin-bottom: 15px;">
        Tem certeza que deseja apagar seus dados? Essa ação não poderá ser desfeita!
    </h3>
    <button id="confirmar" type="submit" onclick="confirmarExclusao(event)" 
        style="background: blue; color: white; font-weight: bold; font-size: 16px; border-radius: 10px; cursor: pointer; padding: 10px 20px; border: none; margin-bottom: 10px; width: 100%;">
        Confirmar Exclusão de conta
    </button>
    <br>
    <button id="cancelar" onclick="fecharConfirmacao(event)" 
        style="background: #ccc; color: black; font-weight: bold; font-size: 16px; border-radius: 10px; cursor: pointer; padding: 10px 20px; border: none; width: 100%;">
        Cancelar
    </button>
`;   
    }

function fecharConfirmacao(event){




  if  (event)event.preventDefault();

const modal = document.getElementById("modal-apagar");
const sobreposicaotela = document.getElementById("sobreposicao-tela");
if(modal && sobreposicaotela){
    modal.style.display="none";
    sobreposicaotela.style.display="none";
}



}
function confirmarExclusao(){
    
const id = usuarioIdLogado || localStorage.getItem('usuarioId'); // Obtém o ID do usuário logado do localStorage(só um pequeno parêntese : o seu id ele estava antes armazenanando o usuarioLogado que recebia true ou false, então ele nunca ia achar o id do usuário, agora ele vai achar porque eu mudei para pegar o id do localStorage que é armazenado quando o usuário loga no sistema)
const cartaoinformativo = document.getElementById("cartao-informativo");

    console.log("usuario deletou a conta dele");
  const modal = document.getElementById("modal-apagar");
const sobreposicaotela = document.getElementById("sobreposicao-tela");
if(modal && sobreposicaotela){
    modal.style.display="none";
    sobreposicaotela.style.display="none";
}

        fetch(`http://localhost:8082/usuarios/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                
                
                // alert('Conta apagada com sucesso!');
                localStorage.clear();
                 

                const result = document.getElementById("result");
                result.innerHTML = `<h3 id="frase">Conta apagada com sucesso!</h3><br><button id="confirmar" type="submit" onclick="window.location.href='index.html'"">Sair</button>`;
                
                document.getElementById("frase").style.color="black";
                document.getElementById("frase").style.fontWeight="bold";

              result.innerHTML = `
    <h3 id="frase" style="color: black; font-weight: bold; margin-bottom: 15px;">
        Conta apagada com sucesso!
    </h3>
    <button id="confirmar" type="button" onclick="window.location.href='index.html'"
        style="background: blue; color: white; font-weight: bold; font-size: 16px; border-radius: 10px; cursor: pointer; padding: 10px 20px; border: none; width: 100%;">
        Sair
    </button>
`;

cartaoinformativo.style.background = "#fff";
cartaoinformativo.style.padding = "40px";
cartaoinformativo.style.borderRadius = "20px";
cartaoinformativo.style.textAlign = "center";
cartaoinformativo.style.maxWidth = "380px";
cartaoinformativo.style.width = "90%";
cartaoinformativo.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)";
cartaoinformativo.style.animation = "entradaSuave 0.4s cubic-bezier(0.68,-0.55,0.265,1.55) forwards";

sobreposicaotela.style.position = "fixed";
sobreposicaotela.style.top = "0";
sobreposicaotela.style.left = "0";
sobreposicaotela.style.width = "100%";
sobreposicaotela.style.height = "100%";
sobreposicaotela.style.background = "rgba(0,0,0,0.7)";
sobreposicaotela.style.display = "flex";
sobreposicaotela.style.justifyContent = "center";
sobreposicaotela.style.alignItems = "center";
sobreposicaotela.style.zIndex = "9999";
sobreposicaotela.style.backdropFilter = "blur(5px)";

          } else {
    result.innerHTML = `
        <h3 id="frase" style="color: black; font-weight: bold; margin-bottom: 15px;">
            Erro ao apagar a conta.
        </h3>
        <button id="confirmar" type="button" onclick="fecharConfirmacao(event)"
            style="background: blue; color: white; font-weight: bold; font-size: 16px; border-radius: 10px; cursor: pointer; padding: 10px 20px; border: none; width: 100%;">
            Fechar
        </button>
    `;

    cartaoinformativo.style.background = "#fff";
    cartaoinformativo.style.padding = "40px";
    cartaoinformativo.style.borderRadius = "20px";
    cartaoinformativo.style.textAlign = "center";
    cartaoinformativo.style.maxWidth = "380px";
    cartaoinformativo.style.width = "90%";
    cartaoinformativo.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)";
    cartaoinformativo.style.animation = "entradaSuave 0.4s cubic-bezier(0.68,-0.55,0.265,1.55) forwards";

    sobreposicaotela.style.position = "fixed";
    sobreposicaotela.style.top = "0";
    sobreposicaotela.style.left = "0";
    sobreposicaotela.style.width = "100%";
    sobreposicaotela.style.height = "100%";
    sobreposicaotela.style.background = "rgba(0,0,0,0.7)";
    sobreposicaotela.style.display = "flex";
    sobreposicaotela.style.justifyContent = "center";
    sobreposicaotela.style.alignItems = "center";
    sobreposicaotela.style.zIndex = "9999";
    sobreposicaotela.style.backdropFilter = "blur(5px)";
}
})
.catch(error => {
    console.error('Erro ao apagar a conta:', error);

    result.innerHTML = `
        <h3 id="frase" style="color: black; font-weight: bold; margin-bottom: 15px;">
            Erro ao apagar a conta.
        </h3>
        <button id="confirmar" type="button" onclick="fecharConfirmacao(event)"
            style="background: blue; color: white; font-weight: bold; font-size: 16px; border-radius: 10px; cursor: pointer; padding: 10px 20px; border: none; width: 100%;">
            Fechar
        </button>
    `;

    cartaoinformativo.style.background = "#fff";
    cartaoinformativo.style.padding = "40px";
    cartaoinformativo.style.borderRadius = "20px";
    cartaoinformativo.style.textAlign = "center";
    cartaoinformativo.style.maxWidth = "380px";
    cartaoinformativo.style.width = "90%";
    cartaoinformativo.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)";
    cartaoinformativo.style.animation = "entradaSuave 0.4s cubic-bezier(0.68,-0.55,0.265,1.55) forwards";

    sobreposicaotela.style.position = "fixed";
    sobreposicaotela.style.top = "0";
    sobreposicaotela.style.left = "0";
    sobreposicaotela.style.width = "100%";
    sobreposicaotela.style.height = "100%";
    sobreposicaotela.style.background = "rgba(0,0,0,0.7)";
    sobreposicaotela.style.display = "flex";
    sobreposicaotela.style.justifyContent = "center";
    sobreposicaotela.style.alignItems = "center";
    sobreposicaotela.style.zIndex = "9999";
    sobreposicaotela.style.backdropFilter = "blur(5px)";
});

}




   

