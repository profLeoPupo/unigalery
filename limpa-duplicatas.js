const fs = require('fs');
const path = require('path');
const readline = require('readline');
const sharp = require('sharp');

const pastaRaiz = __dirname;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Gera um hash visual robusto (8x8 pixels em escala de cinza) para encontrar imagens idênticas
async function calcularHashVisual(caminhoArquivo) {
    try {
        const buffer = await sharp(caminhoArquivo)
            .resize(8, 8, { fit: 'fill' })
            .grayscale()
            .raw()
            .toBuffer();
        
        let soma = 0;
        for (let i = 0; i < buffer.length; i++) soma += buffer[i];
        const media = soma / buffer.length;

        let hashBinario = '';
        for (let i = 0; i < buffer.length; i++) {
            hashBinario += buffer[i] >= media ? '1' : '0';
        }
        return hashBinario;
    } catch (e) {
        throw new Error('Falha ao processar imagem');
    }
}

// Função recursiva para varrer a raiz e TODAS as subpastas em qualquer nível em busca de fotos
function listarImagensRecursivo(diretorio, listaAcumulada = []) {
    const extensoesValidas = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
    const itens = fs.readdirSync(diretorio, { withFileTypes: true });

    for (const item of itens) {
        const caminhoCompleto = path.join(diretorio, item.name);

        if (item.isDirectory()) {
            // Ignora pastas de sistema ou ocultas
            if (['node_modules', '.git', '.obsidian', '.vscode'].includes(item.name) || item.name.startsWith('.')) {
                continue;
            }
            listarImagensRecursivo(caminhoCompleto, listaAcumulada);
        } else if (item.isFile()) {
            const ext = path.extname(item.name).toLowerCase();
            if (extensoesValidas.includes(ext)) {
                listaAcumulada.push({
                    nome: item.name,
                    caminho: caminhoCompleto,
                    pastaRelativa: path.relative(pastaRaiz, diretorio) || '.'
                });
            }
        }
    }
    return listaAcumulada;
}

async function limparDuplicatasUniversal() {
    console.log(`\n🔍 Varrendo a raiz e todas as subpastas em busca de duplicatas visuais...`);

    const todasImagens = listarImagensRecursivo(pastaRaiz);

    if (todasImagens.length === 0) {
        console.log(`⚠️ Nenhuma imagem válida encontrada nas pastas.`);
        rl.close();
        return;
    }

    console.log(`📸 Total de imagens coletadas: ${todasImagens.length}. Calculando hashes visuais...`);

    let mapaImagensProcessadas = [];

    for (const img of todasImagens) {
        try {
            const hash = await calcularHashVisual(img.caminho);
            mapaImagensProcessadas.push({ ...img, hash });
        } catch (e) {
            // Ignora arquivos corrompidos ou que falharam no sharp
        }
    }

    let processados = new Set();
    let gruposDeDuplicatas = [];

    // Agrupa imagens com hash idêntico (Distância 0 = cópia exata)
    for (let i = 0; i < mapaImagensProcessadas.length; i++) {
        if (processados.has(mapaImagensProcessadas[i].caminho)) continue;

        let grupo = [mapaImagensProcessadas[i]];

        for (let j = i + 1; j < mapaImagensProcessadas.length; j++) {
            if (processados.has(mapaImagensProcessadas[j].caminho)) continue;

            let distancia = 0;
            const h1 = mapaImagensProcessadas[i].hash;
            const h2 = mapaImagensProcessadas[j].hash;

            for (let c = 0; c < h1.length; c++) {
                if (h1[c] !== h2[c]) distancia++;
            }

            if (distancia === 0) {
                grupo.push(mapaImagensProcessadas[j]);
                processados.add(mapaImagensProcessadas[j].caminho);
            }
        }

        if (grupo.length > 1) {
            // Prioriza manter o arquivo com o nome mais curto ou direto
            grupo.sort((a, b) => a.nome.length - b.nome.length);

            const sobrevivente = grupo[0];
            const duplicadas = grupo.slice(1);

            gruposDeDuplicatas.push({ sobrevivente, duplicadas });
        }
        processados.add(mapaImagensProcessadas[i].caminho);
    }

    let listaGlobalParaDeletar = [];

    if (gruposDeDuplicatas.length > 0) {
        console.log(`\n==================================================`);
        console.log(`🚨 DUPLICATAS ENCONTRADAS NAS SUBPASTAS:`);
        console.log(`==================================================`);

        gruposDeDuplicatas.forEach((grupo, idx) => {
            console.log(`\n📦 Grupo #${idx + 1}:`);
            console.log(`   ✔️  [MANTIDO] ${grupo.sobrevivente.nome} (${grupo.sobrevivente.pastaRelativa})`);
            
            grupo.duplicadas.forEach(dup => {
                console.log(`   ❌ [REMOVER] ${dup.nome} (${dup.pastaRelativa})`);
                listaGlobalParaDeletar.push(dup.caminho);
            });
        });
    }

    console.log(`\n==================================================`);
    if (listaGlobalParaDeletar.length === 0) {
        console.log(`✅ Nenhuma duplicata encontrada! Tudo limpo.`);
        rl.close();
        return;
    }

    console.log(`📊 Total de arquivos duplicados marcados para remoção: ${listaGlobalParaDeletar.length}`);
    console.log(`==================================================\n`);

    rl.question(`Deseja apagar permanentemente esses ${listaGlobalParaDeletar.length} arquivos duplicados? (s/N): `, (resposta) => {
        const opcao = resposta.trim().toLowerCase();
        
        if (opcao === 's' || opcao === 'sim' || opcao === 'y' || opcao === 'yes') {
            console.log(`\n🧹 Removendo duplicatas...`);
            let removidosCount = 0;
            
            listaGlobalParaDeletar.forEach(caminho => {
                try {
                    fs.unlinkSync(caminho);
                    removidosCount++;
                } catch (err) {
                    console.log(`[ERRO] Não foi possível apagar: ${caminho}`);
                }
            });

            console.log(`\n[SUCESSO] ${removidosCount} arquivos duplicados eliminados!`);
            console.log(`💡 Dica: Rode o 'node gera-lista.js' novamente para atualizar a galeria web.`);
        } else {
            console.log(`\n❌ Operação cancelada. Nenhum arquivo foi apagado.`);
        }

        rl.close();
    });
}

limparDuplicatasUniversal();