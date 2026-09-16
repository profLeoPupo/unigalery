@echo off
TITLE Configurando o UniGalery...
color 0b

echo ====================================================
echo    🚀 Configurando o UniGalery para Windows...
echo ====================================================
echo.

:: Verifica se o Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ALERTA] O motor do sistema (Node.js) nao foi encontrado!
    echo Nao se preocupe: vamos abrir a pagina de instalacao para voce.
    echo.
    echo 1. Baixe e instale a versao recomendada (LTS).
    echo 2. IMPORTANTE: Durante a instalacao, deixe tudo marcado como padrao ^(Next, Next, Next^).
    echo 3. Apos instalar, feche esta janela, volte aqui e dê dois cliques no 'setup.bat' de novo!
    echo.
    pause
    start https://nodejs.org/
    exit /b
)

echo [OK] Motor Node.js detectado com sucesso!
echo.

:: Instala as dependências necessárias
echo [INFO] Configurando pacotes visuais do sistema (sharp)...
call npm install

echo.
echo ====================================================
echo    🎉 PRONTO! O UniGalery esta configurado.
echo ====================================================
echo.
echo O que voce deseja fazer agora?
echo  - Limpar duplicatas: node limpa-duplicatas.js
echo  - Gerar a galeria:    node gera-lista.js
echo.
echo Dica: Depois de gerar, basta abrir o arquivo 'index.html' no navegador!
echo.
pause