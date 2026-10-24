document.addEventListener('DOMContentLoaded',function(){
 const dados = localStorage.getItem('emailUsuario') || localStorage.getItem('cpf');

fetch('http://localhost:8082/usuarios/')
 .then(response => response.json())
 .then(data=>{
    const usuarioLogado = data.find(usuario => usuario.emailUsuario === dados || usuario.cpf === dados);

 if(usuarioLogado){
     let usuarioIdLogado = usuarioLogado.usuarioId;
    let nomeUsuario = usuarioLogado.nomeUsuario;

     // Se precisar add mais algum dado da api para ver se o usuario esta logado pode vir aqui
}else{
const  result = document.getElementById("result");
const modal = document.getElementById("cartao-informativo");
   const caixa = document.getElementById("sobreposicao-tela");
result.innerHTML=`<h3>Erro </h3><br><p>Usuário não encontrado.Por favor,crie uma conta ou faça login</p> <br> <button id="tentativa" onclick="window.location.href='cadastro.html'">Cadastre</button>`;
    

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
.catch(error =>{
    console.error('Erro ao buscar os dados da api(provavelmente desligada) ',error);
});

});



function carregarResumo(){

let lista = document.querySelector('.bloco-produtos');
const dadosSalvos = localStorage.getItem('carrinho');

let carrinho= null;
try{
    carrinho = dadosSalvos ? JSON.parse(dadosSalvos):null;
}catch(e){
    carrinho = null;
}
if(!carrinho || carrinho.length=== 0 ){
    document.body.innerHTML=`    <div class="carrinho-vazio-container">
      <div class="carrinho-vazio-conteudo">
        <div class="icone-wrapper">
          <img class="carrinho-vazio-img" src="img/carrinho.png" alt="Carrinho Vazio">
        </div>
        <h2 class="titulo-carrinho-vazio">Seu carrinho está vazio</h2>
        <p class="subtitulo-carrinho-vazio">Parece que você ainda não adicionou nenhum produto ao seu carrinho.<br>Que tal dar uma olhada no nosso catálogo?</p>
        <a href="index.html" class="btn-voltar-link">
          Voltar ao catálogo
        </a>
      </div>
    </div>
`;
return; 
}

let subtotal = 0;
let qtdTotal = 0;
lista.innerHTML = "";

carrinho.forEach((item,i)=>{
const qtd = item.Quantidade ?? item.quantidade ?? item.qtd ?? 1;
const preco = parseFloat(item.preco);

let precoBase = parseFloat(item.precoBase|| item.preco);
let totalItem = precoBase * qtd;
 const nomeImagem = item.imagem ? item.imagem : 'default.png';
 const caminhoImg = `produtos/${nomeImagem}`; 

 subtotal += totalItem;
qtdTotal += parseInt(qtd);
carrinho[i].precoBase=precoBase;

lista.innerHTML +=`<div class="cartao-produto">
<div class="produto-detalhes">
<img src="${caminhoImg}" class="produto-img" onerror="this.src='img/logo.png'">
<p class="produto-titulo">${item.nome}</p>
<span class="produto-preco">R$ ${(precoBase * qtd).toFixed(2)}</span></div>
<div class="produto-acoes"><label>Quantidades</label><input type="number" class="select-qtd" data-index="${i}" min="1" value="${qtd}">
<button class="btn-remover" data-index="${i}"><img src="img/lixoicon.png"></button></div></div>`;
});

console.log('Subtotal: ',subtotal);

document.querySelector("#precoProduto    span:first-child").textContent=`subtotal (${qtdTotal})`;
document.querySelector("#precoProduto span:last-child").textContent = `R$ ${subtotal.toFixed(2)}`;
document.querySelector("#precoTotal    span:last-child").textContent=`R$ ${subtotal.toFixed(2)}`;


document.querySelectorAll(".select-qtd").forEach(input =>{
    input.addEventListener('input',(e)=>{
        let i = e.target.dataset.index;
        let novaQtd = parseInt(e.target.value)||1;
        
       
        if(!carrinho[i]) return;
        
        carrinho[i].Quantidade=novaQtd;
        if(!carrinho[i].precoBase) carrinho[i].precoBase=carrinho[i].preco;
        localStorage.setItem('carrinho',JSON.stringify(carrinho));

       
        let precoBaseAtual = parseFloat(carrinho[i].precoBase);
        let card = e.target.closest('.cartao-produto');
        card.querySelector('.produto-preco').textContent = `R$ ${(precoBaseAtual * novaQtd).toFixed(2)}`;

        
        let novoSubtotal = 0;
        let novoQtdTotal = 0;
        carrinho.forEach(p => {
            novoSubtotal += parseFloat(p.precoBase) * parseInt(p.Quantidade);
            novoQtdTotal += parseInt(p.Quantidade);
        });
        document.querySelector("#precoProduto span:first-child").textContent=`subtotal (${novoQtdTotal})`;
        document.querySelector("#precoProduto span:last-child").textContent = `R$ ${novoSubtotal.toFixed(2)}`;
        document.querySelector("#precoTotal span:last-child").textContent=`R$ ${novoSubtotal.toFixed(2)}`;

  })
})

}


      document.addEventListener('click',(e) =>{
    let botao = e.target.closest(".btn-remover");
    if(botao){
        let index = botao.dataset.index // tem que ser botao, não e.target

        // 1. Cria o fundo escuro
        let caixa = document.createElement("div");
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

        // 2. Cria o modal branco
        let modal = document.createElement("div");
        modal.style.background="#fff";
        modal.style.padding="40px";
        modal.style.borderRadius="20px";
        modal.style.textAlign="center";
        modal.style.maxWidth="380px";
        modal.style.width="90%";
        modal.style.boxShadow="0 15px 30px rgba(0,0,0,0.3)";
        modal.style.animation="entradaSuave 0.4s cubic-bezier(0.68,-0.55,0.265,1.55) forwards";

        modal.innerHTML = `
            <h3 style="color:red; margin-bottom:10px;">Remover produto?</h3>
            <p style="color:black; margin-bottom:20px;">Tem certeza que quer remover esse item do carrinho?</p>
            <div style="display:flex; gap:10px; justify-content:center;">
                <button id="btn-cancelar" style="background:#ccc; color:black; font-weight:bold; font-size:16px; border-radius:10px; cursor:pointer; padding:10px 20px; border:none;">Cancelar</button>
                <button id="btn-confirmar" style="background:blue; color:white; font-weight:bold; font-size:18px; border-radius:10px; cursor:pointer; padding:10px 20px; border:none;">Remover</button>
            </div>
        `;

        caixa.appendChild(modal);
        document.body.appendChild(caixa);

        // 3. Se clicar em Cancelar, só fecha
        modal.querySelector("#btn-cancelar").addEventListener('click', () => {
            caixa.remove();
        });

        // 4. Se clicar em Remover, aí sim apaga
        modal.querySelector("#btn-confirmar").addEventListener('click', () => {
            let carrinhoAtual = JSON.parse(localStorage.getItem("carrinho")) || [];
            carrinhoAtual.splice(index, 1);
            localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));
            location.reload();
        });

        // Clicou fora do modal, fecha também
        caixa.addEventListener('click', (event) => {
            if(event.target === caixa){
                caixa.remove();
            }
        });
    }
})
  

document.addEventListener('DOMContentLoaded',carregarResumo);


function toggleDropdown(event) {
    if (event) event.stopPropagation();
    const menuTodos = document.querySelector('.menu-todos');
    menuTodos.classList.toggle('ativo');
}

document.addEventListener('click', function(event) {
    const menuTodos = document.querySelector('.menu-todos');
    if (menuTodos && !menuTodos.contains(event.target)) {
        menuTodos.classList.remove('ativo');
    }
});




