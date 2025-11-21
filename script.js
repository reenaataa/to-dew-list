const formEl = document.getElementById('tarefa-form');
const inputEl = document.getElementById('tarefa-input');
const addBtnEl = document.getElementById('btn-adicionar');
const modeBtn = document.getElementById('toggle-btn');

const listaContainer = document.getElementById('lista-container');
const ulEl = document.getElementById('tarefa-lista');

const btnSobe = document.querySelector('.seta.sobe');
const btnDesce = document.querySelector('.seta.desce');

const cancelSound = new Audio('./assets/audio/cancel.wav');
const btnsSound = new Audio('./assets/audio/smallSelect.wav');
const completedSound = new Audio('./assets/audio/objectiveComplete.wav');
const toggleSound = new Audio('./assets/audio/select.wav');

const step = 30; // quantos px rola por clique
let scrollPos = 0;

// funcão pra checar que lista ta vazia
function atualizarMensagemListaVazia() {
    const textoListaVazia = document.getElementById('lista-vazia-texto');

    if (ulEl.children.length !== 0) {
        textoListaVazia.style.display = 'none';
    } else {
        textoListaVazia.style.display = 'block';
    }
}

// função de tocar som
function play(som) {
    som.currentTime = 0;
    som.play();
}

// função pra salvar lista
function salvarLista() {
    const tarefas = [];

    Array.from(ulEl.children).forEach(li => {
        const texto = li.querySelector('.tarefa-texto').textContent;
        const completed = li.classList.contains('completed');

        tarefas.push({ texto, completed });
    });

    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function criarItem(texto, completed = false) {

    // li.tarefa-item
    const liEl = document.createElement('li');
    liEl.classList.add('tarefa-item');

    // div.tarefa-item-container
    const liDivEl = document.createElement('div');
    liDivEl.classList.add('item-container');

    // span.tarefa-texto
    const spanEl = document.createElement('span');
    spanEl.classList.add('tarefa-texto');
    spanEl.textContent = texto;

    // div.btns-container
    const tarefaBtns = document.createElement('div');
    tarefaBtns.classList.add('btns-container');

    // btn.concluir
    const btnConcluir = document.createElement('button');
    btnConcluir.classList.add('concluir');
    btnConcluir.innerHTML = `OK`;

    // btn.editar
    const btnEditar = document.createElement('button');
    btnEditar.classList.add('editar');
    btnEditar.innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xml:space="preserve"><polygon points="8,3 8,5 12,5 12,8 11,8 11,11 10,11 10,14 9,14 9,17 8,17 8,19 4,19 4,21 15,21 15,20 15,19 11,19 11,16 12,16 12,13 13,13 13,10 14,10 14,7 15,7 15,5 19,5 19,3 "/></svg>`;

    // btn.excluir
    const btnExcluir = document.createElement("button");
    btnExcluir.classList.add("excluir");
    btnExcluir.innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xml:space="preserve"><path d="M21,5V4h-1V3h-1V2H5v1H4v1H3v1H2v14h1v1h1v1h1v1h14v-1h1v-1h1v-1h1V5H21z M20,17h-3v-2h-2v-2h-2v-2h-2V9H9V7H7V4h10v1h1v1h1v1h1V17z M6,19v-1H5v-1H4V7h1v2h2v2h2v2h2v2h2v2h2v2h2v1H7v-1H6z"/></svg>`;

    // eventos de concluir, editar e excluir
    btnConcluir.addEventListener('click', () => {
        liEl.classList.toggle('completed');
        salvarLista();
        play(completedSound);
    });

    btnEditar.addEventListener('click', () => {
        const novoTexto = prompt('Editar tarefa:', spanEl.textContent);
        if (novoTexto !== null && novoTexto.trim() !== '') {
            spanEl.textContent = novoTexto.trim();
            salvarLista();
        }
    });

    btnExcluir.addEventListener('click', () => {
        liEl.remove();
        salvarLista();
        play(cancelSound);
        atualizarMensagemListaVazia();
    });

    // adiciona botões dentro da div de botões
    tarefaBtns.append(btnConcluir, btnEditar, btnExcluir);

    // adiciona texto e div dos botões do container
    liDivEl.append(spanEl, tarefaBtns);

    // adiciona o container dentro do li
    liEl.append(liDivEl);

    return liEl;
}

// função pra adicionar item
function adicionarItem(e) {
    e.preventDefault();
    const texto = inputEl.value.trim();

    // previne tarefa em branco
    if (texto == '') {
        alert('A tarefa não pode estar em branco!');
        return
    }

    const li = criarItem(texto);
    ulEl.append(li);

    salvarLista();
    atualizarMensagemListaVazia();

    inputEl.value = '';
}

// função pra carregar lista salva
function carregarLista() {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.forEach(item => {
        const li = criarItem(item.texto, item.completed);
        ulEl.append(li);
    });
    atualizarMensagemListaVazia();
}

// chamar quando carregar a página
carregarLista();

// evento de adicionar o item
formEl.addEventListener('submit', adicionarItem);

// evento das setas
btnSobe.addEventListener('click', function () {
    scrollPos = Math.max(scrollPos - step, 0);// posição atual - step sem passar de 0
    listaContainer.scrollTop = scrollPos; // aplica nova posição
    play(btnsSound);
});
btnDesce.addEventListener('click', function () {
    scrollPos = Math.min(scrollPos + step, listaContainer.scrollHeight - listaContainer.clientHeight); // posição atual + step sem passar do fim
    listaContainer.scrollTop = scrollPos;
    play(btnsSound);
});

// dark mode
modeBtn.addEventListener('click', function () {
    document.body.classList.toggle('joja-mode');
    play(toggleSound);

    const imgTitle = document.getElementById('title-img');
    const footerImg = document.getElementById('footer-img');
    const modeImg = document.getElementById('mode-img');

    if (document.body.classList.contains('joja-mode')) {
        imgTitle.src = './assets/imgs/joja-title.png';
        modeImg.src = './assets/imgs/Solar_Essence.png'
        footerImg.src = './assets/imgs/joja-cola.png';
    } else {
        imgTitle.src = './assets/imgs/title.png';
        modeImg.src = './assets/imgs/Void_Essence.png'
        footerImg.src = './assets/imgs/chicken.png';
    }
});