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
