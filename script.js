let carrinho = {};
let subtotal = 0;
let descontoCupom = 0;

// MOSTRAR/ESCONDER ESPECIFICAÇÕES
function toggleInfo(botao) {
    const detalhes = botao.nextElementSibling;
    if (detalhes.style.display === "block") {
        detalhes.style.display = "none";
        botao.textContent = "Informaçoes sobre o produto";
    } else {
        detalhes.style.display = "block";
        botao.textContent = "Minimizar";
    }
}

// ADICIONAR AO CARRINHO (AGRUPANDO)
function adicionarPedido(nome, preco) {
    if (carrinho[nome]) {
        carrinho[nome].qtd += 1;
    } else {
        carrinho[nome] = { preco: preco, qtd: 1 };
    }
    subtotal += preco;
    renderizarCarrinho();
}

// REMOVER DO CARRINHO
function removerItem(nome) {
    // Encontra o elemento visualmente para dar um feedback antes de remover
    const itens = document.querySelectorAll('.item-carrinho');
    itens.forEach(div => {
        if (div.innerText.includes(nome)) {
            div.style.opacity = '0';
            div.style.transform = 'translateX(20px)';
            div.style.transition = '0.3s';
        }
    });

    // Pequeno delay para a animação acontecer antes de atualizar a lista
    setTimeout(() => {
        subtotal -= carrinho[nome].preco;
        carrinho[nome].qtd -= 1;
        if (carrinho[nome].qtd <= 0) delete carrinho[nome];
        renderizarCarrinho();
    }, 200);
}

// ATUALIZAR LISTA VISUAL
function renderizarCarrinho() {
    const lista = document.getElementById("listaPedido");
    lista.innerHTML = "";
    
    for (let nome in carrinho) {
        const item = carrinho[nome];
        const itemDiv = document.createElement("div");
        itemDiv.className = "item-carrinho";
        itemDiv.innerHTML = `
            <span>${nome} <strong>${item.qtd}x</strong> - R$ ${(item.preco * item.qtd).toFixed(2)}</span>
            <button class="btn-remover" onclick="removerItem('${nome}')">X</button>
        `;
        lista.appendChild(itemDiv);
    }
    document.getElementById("subtotal-carrinho").textContent = subtotal.toFixed(2);
}

// FLUXO DE TELAS
function irParaCheckout() {
    if (subtotal <= 0) {
        alert("Carrinho vazio!");
        return;
    }
    document.getElementById("etapa-compra").style.display = "none";
    document.getElementById("etapa-checkout").style.display = "block";
    calcularTotalFinal();
}

function voltarParaCompra() {
    document.getElementById("etapa-compra").style.display = "block";
    document.getElementById("etapa-checkout").style.display = "none";
}

// CÁLCULOS FINAIS
function aplicarCupom() {
    const cupom = document.getElementById("inputCupom").value.toUpperCase();
    if (cupom === "NOTA100") {
        descontoCupom = 0.10;
        alert("Desconto de 10% aplicado!");
    } else {
        descontoCupom = 0;
        alert("Cupom inválido!");
    }
    calcularTotalFinal();
}

function calcularTotalFinal() {
    const formaPagamento = document.getElementById("formaPagamento").value;
    let descontoPix = (formaPagamento === "pix") ? 0.10 : 0;
    
    let valorDesconto = subtotal * (descontoPix + descontoCupom);
    let totalFinal = subtotal - valorDesconto;

    document.getElementById("resumo-subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("totalFinal").textContent = totalFinal.toFixed(2);
    
    const txtDesc = document.getElementById("txtDesconto");
    if (valorDesconto > 0) {
        txtDesc.style.display = "block";
        document.getElementById("valorDesconto").textContent = valorDesconto.toFixed(2);
    } else {
        txtDesc.style.display = "none";
    }
}

function confirmarPedido() {
    const endereco = document.getElementById("endereco").value;
    if (!endereco.trim()) {
        alert("Informe o endereço!");
        return;
    }
    alert("Pedido enviado com sucesso!");
    location.reload();
}
function limparCarrinho() {
    if (Object.keys(carrinho).length === 0) return; // Se já estiver vazio, não faz nada

    if (confirm("Deseja realmente remover todos os itens do carrinho?")) {
        carrinho = {};
        subtotal = 0;
        renderizarCarrinho();
    }
}