function adicionarProduto(nome, preco, imagem) {
  const carrinhoTexto = localStorage.getItem('carrinho')
  let carrinho = carrinhoTexto ? JSON.parse(carrinhoTexto) : [] //se 'carrinhoTexto' existir, converte o texto para array com JSON.parse, senão cria um array vazio.

  let produtoExistente = null //Null, pois começa sem um produto determinado

  //For...of percorre cada item dentro do carrinho
  for (const item of carrinho){
    if (item.nome === nome) {
      produtoExistente = item
      break
    }
  }

  if (produtoExistente){
    produtoExistente.quantidade++
  } else {
    carrinho.push({nome, preco, imagem, quantidade: 1})
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho)) //JSON.stringify converte array de volta para o formato de texto, que é como o localStorage armazena.
  

  alert(`"${nome}" foi adicionado ao seu pedido!`)
}

function alterarQuantidade(nome, mudanca){
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [] //Garante que se o carrinho não existir, use um array vazio para evitar erros
  let itemIndex = -1 ///Índice do item no array, começa com -1 pois não foi encontrado (para não interferir)

  for (let i = 0; i < carrinho.length; i++){
    if (carrinho[i].nome === nome) {
      itemIndex = i
      break
    }
  }

  if (itemIndex > -1){
    carrinho[itemIndex].quantidade += mudanca
    if (carrinho[itemIndex].quantidade <= 0) {
      carrinho.splice(itemIndex, 1) //.splice() remove itens do array
    }
  }
  
  localStorage.setItem('carrinho', JSON.stringify(carrinho)) //Salva o carrinho no localStorage
  carregarCarrinho() //Chama função carregarCarrinho para atualizar a tela com as informações atuais
}


function carregarCarrinho() {
  const itensContainer = document.getElementById('itens-do-carrinho')
  const total = document.getElementById('total-do-pedido')
  const btnConfirmar = document.querySelector('.confirmar')

  if (!itensContainer || !total) return

  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || []
  itensContainer.innerHTML = '' //Limpa conteúdo que já estivesse na área de itens

  //Se não tiver nenhum item no carrinho
  if (carrinho.length === 0) {
    itensContainer.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.</p>' //Mensagem: Carrinho vazio
    total.textContent = 'R$ 0.00' //Valor: R$0.00
    btnConfirmar.style.display = 'none' //Sem opção de confirmar compra
    return
  }

  btnConfirmar.style.display = 'block' //Garante que botão de confirmar esteja visível se houver itens
  let totalGeral = 0

  //Calcula os valores
  for (const item of carrinho) {
    const subtotal = item.preco * item.quantidade
    totalGeral += subtotal 

    const itemDiv = document.createElement('div') //Cria uma nova div no html
    itemDiv.classList.add('item-pedido') //Class da div novs

    itemDiv.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}">
      <div class="item-info">
        <h4>${item.nome}</h4>
        <p>Preço: R$ ${item.preco.toFixed(2)}</p>
        <div class="quantidade-controls">
          <button onclick="alterarQuantidade('${item.nome}', -1)">-</button>
          <span>${item.quantidade}</span>
          <button onclick="alterarQuantidade('${item.nome}', 1)">+</button>
        </div>
      </div>
      <strong>R$ ${subtotal.toFixed(2)}</strong>
    `;

    itensContainer.appendChild(itemDiv) //Adiciona a div como elemento filho do container de itens
  }

  total.textContent = `R$ ${totalGeral.toFixed(2)}` //Atualiza o valor total
}

function confirmarPedido() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || []
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.")
    return
  }

  const nome = prompt("Para finalizar, por favor, digite seu nome completo:")
  if (!nome) { //Verifica se o usuário clicou em cancelar ou deixou em branco
    alert("Operação cancelada.")
    return;
  }

  const endereco = prompt("Agora, por favor, digite seu endereço de entrega:")
  if (!endereco) {
    alert("Operação cancelada.")
    return
  }

  let itensResumo = ''
  let totalGeral = 0
  
  for (const item of carrinho) {
    const subtotal = item.preco * item.quantidade
    totalGeral += subtotal
    
    itensResumo += `- ${item.quantidade}x ${item.nome} (R$ ${subtotal.toFixed(2)})\n` //Faz a lista de itens, \n serve para quebrar linha ao final de cada item
  }
  
  //Mensagem final
  const resumoPedido = `
Pedido Confirmado!

Cliente: ${nome}
Endereço de Entrega: ${endereco}

Itens:
${itensResumo}
Total: R$ ${totalGeral.toFixed(2)}

Obrigado por comprar no Ifood ADEGA!
  `

  alert(resumoPedido.trim()) //.trim() remove espaços em branco extras do início e fim

  localStorage.removeItem('carrinho') //Limpa o carrinho do localStorage pois o pedido foi finalizado
  carregarCarrinho() //Atualiza tela para mostrar que o carrinho está vazio
}

//O evento DOMContentLoaded garante que todo o HTML seja analisado e esteja pronto antes de o JS tentar manipulá-lo, prevenindo erros
document.addEventListener('DOMContentLoaded', () => { 
    //Verifica se estamos na página de pedidos
  if (document.getElementById('itens-do-carrinho')) {
    carregarCarrinho() //Se sim carrega os itens do carrinho para mostrá-los na tela.
  }
});