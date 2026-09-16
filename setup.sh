#!/bin/bash

echo "===================================================="
echo "    🚀 Configurando o UniGalery..."
echo "===================================================="
echo ""

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "⚠️ O Node.js não foi encontrado no seu sistema."
    echo "📥 Tentando instalar automaticamente via gerenciador de pacotes..."
    
    # Tenta instalar no Ubuntu/Debian/Linux Mint
    if command -v apt &> /dev/null; then
        sudo apt update && sudo apt install -y nodejs npm
    # Tenta instalar no Fedora/RHEL
    elif command -v dnf &> /dev/null; then
        sudo dnf install -y nodejs npm
    # Tenta instalar no macOS via Homebrew
    elif command -v brew &> /dev/null; then
        brew install node
    else
        echo "❌ Não foi possível instalar automaticamente."
        echo "Por favor, baixe e instale rapidinho em: https://nodejs.org/"
        exit 1
    fi
fi

echo "✅ Node.js detectado/instalado com sucesso!"

# Instala as dependências do projeto
echo "📦 Baixando dependências visuais necessárias (sharp)..."
npm install

echo ""
echo "===================================================="
echo "    🎉 Tudo pronto! UniGalery configurado com sucesso."
echo "===================================================="
echo ""
echo "Dicas de uso:"
echo "  1. Rode 'node limpa-duplicatas.js' para faxinar cópias."
echo "  2. Rode 'node gera-lista.js' para atualizar a galeria."
echo "  3. Abra o arquivo 'index.html' no seu navegador."
echo ""