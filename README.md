# UniGalery 📸✨

> O **UniGalery** vai te salvar muito tempo e trabalho!

Se você é alguém como eu que se perde ao procurar fotos entre todas as fotos que já guardou na vida, essa solução vai te impressionar com certeza.

Certa vez uma cliente muito especial me trouxe um problema técnico comum, mas que a maioria ignora: milhares de fotos guardadas no Google Photos separadas parcialmente em pastas com nomes relativos aos eventos ou momentos. Muitas fotos desse backup eram repetidas, afinal, quando compartilhamos, criamos uma nova cópia.

Fazer o download de todas as pastas e criar uma página web para exibir fotos como numa galeria foi simples, mas o principal script aqui é o **`gera-lista.js`**: com ele é possível criar álbuns separados por pastas com qualquer imagem encontrada nas subpastas, sem complicação e sem frescura de padrão pré-definido.

Para eliminar as cópias, o **`limpa-duplicatas.js`** entra em cena: ele compara informações nos arquivos de imagem como se pudesse literalmente enxergar, encontra imagens duplicadas e te dá a opção de remover todas elas, deixando sempre uma cópia salva para contar a história.

---

## 🚀 Como Funciona a Estrutura

O repositório conta com automações inteligentes e uma interface web moderna baseada no ecossistema Apple-style:

1. **`gera-lista.js`**: Varre a raiz e todas as subpastas recursivamente, mapeando as imagens e gerando o banco de dados da galeria automaticamente.
2. **`limpa-duplicatas.js`**: Usa inteligência visual (através da biblioteca `sharp`) para caçar cópias exatas espalhadas em qualquer nível de pasta, exibindo um relatório claro e pedindo sua confirmação antes de apagar os excessos.
3. **`index.html` + `style.css` + `script.js`**: A interface gráfica moderna, fluida e responsiva para navegar pelos álbuns e visualizar as fotos em tela cheia.

---

## 📦 Instalação Automatizada (Para qualquer usuário)

Para que o projeto funcione, é necessário o motor **Node.js** e a biblioteca visual **`sharp`**. Criamos instaladores automáticos que verificam tudo e guiam o processo (ou tentam instalar sozinhos):

### 🐧 Para Linux / macOS
Abra o terminal na pasta do projeto e execute o script de configuração:

```bash
chmod +x setup.sh
./setup.sh
(Ele verifica o Node.js, tenta instalá-lo automaticamente se estiver faltando via gerenciador de pacotes do sistema e baixa as dependências do projeto).
```

🪟 Para Windows

Basta dar dois cliques no arquivo setup.bat (ou executá-lo pelo Prompt/PowerShell):
DOS

setup.bat

(Se o Node.js não estiver instalado na máquina do Windows, o script avisa de forma amigável, abre a página oficial de download para você e prepara o terreno em segundos).
🕹️ Como Usar no Dia a Dia

    Clone ou jogue os arquivos deste repositório na pasta raiz onde ficam todas as suas pastas de fotos.

    Dê dois cliques ou rode o instalador (setup.sh ou setup.bat) na primeira vez para preparar o ambiente.

    Se suspeitar que tem fotos repetidas espalhadas por aí, rode o faxineiro visual:
    Bash

    node limpa-duplicatas.js

    (Ele lista os duplicados, pergunta se deseja apagar e preserva uma cópia original).

    Atualize o índice da galeria rodando o gerador:
    Bash

    node gera-lista.js

    Dê um duplo clique no arquivo index.html e curta sua galeria organizada!

Feito com ☕ e código limpo por Mestre Pupo. Aproveite!
