const fs = require('fs');
const path = require('path');

const pastaRaiz = __dirname;
const arquivoSaida = path.join(pastaRaiz, 'banco-midias.js');
const extensoesValidas = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

// Função recursiva para encontrar todas as imagens dentro de uma pasta e suas subpastas
function varrerDiretorioRecursivo(diretorioAtual, listaAcumulada = []) {
    if (!fs.existsSync(diretorioAtual)) return listaAcumulada;

    const itens = fs.readdirSync(diretorioAtual, { withFileTypes: true });

    for (const item of itens) {
        const caminhoCompleto = path.join(diretorioAtual, item.name);

        if (item.isDirectory()) {
            // Continua descendo nas subpastas
            varrerDiretorioRecursivo(caminhoCompleto, listaAcumulada);
        } else if (item.isFile()) {
            const ext = path.extname(item.name).toLowerCase();
            if (extensoesValidas.includes(ext)) {
                listaAcumulada.push({
                    nomeArquivo: item.name,
                    caminhoAbsoluto: caminhoCompleto
                });
            }
        }
    }
    return listaAcumulada;
}

function gerarBancoMidias() {
    console.log(`\n🔍 Varrendo pastas e subpastas recursivamente...`);

    if (!fs.existsSync(pastaRaiz)) {
        console.error(`[ERRO] Diretório raiz não encontrado.`);
        return;
    }

    const itensRaiz = fs.readdirSync(pastaRaiz, { withFileTypes: true });
    let listaMidias = [];

    for (const item of itensRaiz) {
        if (!item.isDirectory()) continue;
        const nomeAlbum = item.name;

        // Ignora pastas de sistema ou ocultas comuns
        if (['node_modules', '.git', '.obsidian', '.vscode'].includes(nomeAlbum) || nomeAlbum.startsWith('.')) {
            continue;
        }

        const caminhoAlbum = path.join(pastaRaiz, nomeAlbum);
        
        // Coleta todas as imagens de qualquer subnível dentro desta pasta de álbum
        const arquivosEncontrados = varrerDiretorioRecursivo(caminhoAlbum);

        if (arquivosEncontrados.length === 0) continue;

        arquivosEncontrados.forEach((arq, index) => {
            // Calcula o caminho relativo limpo compatível com a web (substituindo barras invertidas do Windows)
            const caminhoRelativo = path.relative(pastaRaiz, arq.caminhoAbsoluto).replace(/\\/g, '/');
            
            listaMidias.push({
                album: nomeAlbum.replace(/[-_]/g, ' ').toUpperCase(),
                titulo: path.parse(arq.nomeArquivo).name.replace(/[-_]/g, ' '),
                tipo: 'img',
                url: caminhoRelativo,
                ehThumb: index === 0 // A primeira foto encontrada na árvore da pasta vira a capa oficial
            });
        });
    }

    const conteudoJs = `// Gerado automaticamente pelo gera-lista.js
window.mídiasRecuperadas = ${JSON.stringify(listaMidias, null, 2)};
`;

    fs.writeFileSync(arquivoSaida, conteudoJs, 'utf-8');
    console.log(`\n[SUCESSO] 'banco-midias.js' gerado com ${listaMidias.length} fotos mapeadas de todas as subpastas!`);
}

gerarBancoMidias();