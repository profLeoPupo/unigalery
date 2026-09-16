const listaCompleta = window.mídiasRecuperadas || [];
const container = document.getElementById('appContainer');
const subtituloTopo = document.getElementById('subtituloTopo');
const buscaContainer = document.getElementById('buscaContainer');
const inputBusca = document.getElementById('inputBusca');

let estadoAtual = {
    pagina: 'home',
    albumSelecionado: null,
    termoBusca: '',
    indiceModalAtual: 0,
    listaModalAtual: []
};

function voltarParaHome() {
    estadoAtual.pagina = 'home';
    estadoAtual.albumSelecionado = null;
    subtituloTopo.textContent = 'Portfólio • Arquivo Geral';
    buscaContainer.style.display = 'none';
    inputBusca.value = '';
    renderizarHome();
}

function renderizarHome() {
    container.innerHTML = '';
    const albuns = [...new Set(listaCompleta.map(m => m.album))];

    if (albuns.length === 0) {
        container.innerHTML = '<p style="text-align:center; color: var(--text-secondary); grid-column: 1/-1; padding: 40px;">Nenhum álbum localizado. Execute o gera-lista.js</p>';
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'grid-albuns';

    albuns.forEach(album => {
        const midiasAlbum = listaCompleta.filter(m => m.album === album);
        const capa = midiasAlbum.find(m => m.ehThumb) || midiasAlbum[0] || { url: '' };
        const totalFotos = midiasAlbum.length;

        const card = document.createElement('div');
        card.className = 'album-card';
        card.onclick = () => abrirGradeAlbum(album);

        card.innerHTML = `
            <div class="midia-wrapper">
                <img src="${capa.url}" alt="${album}" loading="lazy">
            </div>
            <div class="album-card-info">
                <h3>${album}</h3>
                <span>${totalFotos} fotos</span>
            </div>
        `;
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function abrirGradeAlbum(album) {
    estadoAtual.pagina = 'grade';
    estadoAtual.albumSelecionado = album;
    subtituloTopo.textContent = `Álbum: ${album}`;
    buscaContainer.style.display = 'block';
    inputBusca.value = '';
    renderizarGradeAtual();
}

function renderizarGradeAtual() {
    const { albumSelecionado, termoBusca } = estadoAtual;
    let midiasFiltradas = listaCompleta.filter(m => m.album === albumSelecionado);

    if (termoBusca.trim() !== '') {
        const termo = termoBusca.toLowerCase();
        midiasFiltradas = midiasFiltradas.filter(m => m.titulo.toLowerCase().includes(termo));
    }

    estadoAtual.listaModalAtual = midiasFiltradas;

    let gradeEl = document.getElementById('gridMidias');
    if (!gradeEl) {
        container.innerHTML = `
            <div class="nav-topo-acao">
                <button class="btn-voltar" onclick="voltarParaHome()">← Voltar</button>
                <span id="contadorItens" class="contador-itens"></span>
            </div>
            <div class="grid-galeria" id="gridMidias"></div>
        `;
        gradeEl = document.getElementById('gridMidias');
    }

    document.getElementById('contadorItens').textContent = `${midiasFiltradas.length} itens`;
    gradeEl.innerHTML = '';

    if (midiasFiltradas.length === 0) {
        gradeEl.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: var(--text-secondary); padding: 40px;">Nenhum arquivo encontrado.</p>';
        return;
    }

    const fragmento = document.createDocumentFragment();
    midiasFiltradas.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'midia-card';
        
        card.onclick = () => abrirModalIndice(index);

        card.innerHTML = `
            <div class="midia-wrapper">
                <img src="${item.url}" alt="${item.titulo}" loading="lazy">
                <div class="badge-tipo">•</div>
            </div>
            <div class="midia-info">
                <strong>${item.titulo}</strong>
                <span>${item.album}</span>
            </div>
        `;
        fragmento.appendChild(card);
    });

    gradeEl.appendChild(fragmento);
}

function filtrarPorTexto(termo) {
    estadoAtual.termoBusca = termo;
    if (estadoAtual.pagina === 'grade') {
        renderizarGradeAtual();
    }
}

function abrirModalIndice(index) {
    estadoAtual.indiceModalAtual = index;
    atualizarModalConteudo();
    document.getElementById('modalVisualizacao').style.display = 'flex';
}

function atualizarModalConteudo() {
    const lista = estadoAtual.listaModalAtual;
    const index = estadoAtual.indiceModalAtual;
    const item = lista[index];
    if (!item) return;

    const containerModal = document.getElementById('modalMidiaContainer');
    const titulo = document.getElementById('modalTitulo');
    const meta = document.getElementById('modalMeta');

    containerModal.innerHTML = `<img src="${item.url}" alt="${item.titulo}">`;
    titulo.textContent = `${item.titulo} (${index + 1}/${lista.length})`;
    meta.textContent = `${item.album}`;
}

function navegarModal(direcao) {
    const lista = estadoAtual.listaModalAtual;
    estadoAtual.indiceModalAtual += direcao;

    if (estadoAtual.indiceModalAtual < 0) {
        estadoAtual.indiceModalAtual = lista.length - 1;
    } else if (estadoAtual.indiceModalAtual >= lista.length) {
        estadoAtual.indiceModalAtual = 0;
    }
    atualizarModalConteudo();
}

function fecharModal() {
    document.getElementById('modalVisualizacao').style.display = 'none';
    document.getElementById('modalMidiaContainer').innerHTML = '';
}

window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('modalVisualizacao');
    if (modal.style.display === 'flex') {
        if (e.key === 'Escape') fecharModal();
        if (e.key === 'ArrowLeft') navegarModal(-1);
        if (e.key === 'ArrowRight') navegarModal(1);
    }
});

renderizarHome();