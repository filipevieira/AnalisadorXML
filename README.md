# Analisador de XML NFe ✨

Este projeto é uma ferramenta web simples e intuitiva para analisar arquivos XML de Notas Fiscais Eletrônicas (NFe). 🧾  
Ele permite que os usuários carreguem um arquivo XML de NFe, visualizem seu conteúdo e, de forma interativa, decomponham a chave de acesso da NFe, relacionando seus segmentos aos dados correspondentes dentro do XML.

---

## Funcionalidades Principais 🚀

- **Upload de Arquivo XML:** Carregue facilmente seu arquivo XML da NFe através de um input de arquivo. 📁
- **Visualização do Conteúdo XML:** O XML completo é exibido na interface para sua referência. 👀
- **Análise da Chave de Acesso:**  
  A chave de acesso da NFe é extraída e dividida em seus componentes (código da UF, ano/mês de emissão, CNPJ do emitente, modelo, série, número da NF, código numérico e dígito verificador).  
  Cada segmento é visualmente destacado com cores 🌈 para facilitar a identificação.
- **Mapeamento de Dados XML:**  
  As partes da chave de acesso são relacionadas aos valores correspondentes encontrados nas tags XML da NFe.  
  O destaque de cor é replicado 🎨 para garantir consistência e facilitar a associação visual entre o segmento da chave e seu dado no XML.
- **Alternância de Tema (Dark/Light Mode):**  
  Inclui um botão com ícone (☀️/🌙) para alternar entre o tema claro e escuro, melhorando a experiência do usuário em diferentes condições de iluminação.  
  A preferência de tema é persistida localmente.
- **Design Responsivo:**  
  A interface é adaptada para funcionar bem em dispositivos de diferentes tamanhos (desktop, tablet, mobile). 📱💻

---

## Como o Analisador Funciona 🧠

Ao carregar um arquivo XML:

1. **Leitura e Parsing:**  
   O arquivo XML é lido como texto e então parseado usando `DOMParser` para criar um objeto `XMLDocument`. 📄➡️🌳

2. **Extração da Chave de Acesso:**  
   A aplicação busca o atributo `Id` dentro da tag `<infNFe>`.  
   A chave de acesso é extraída e validada para garantir que possui 44 dígitos numéricos. 🔑✅

3. **Decomposição Visual da Chave:**  
   A chave de 44 dígitos é quebrada em segmentos predefinidos (UF, AAMM, CNPJ, etc.).  
   Cada segmento é exibido em um `<span>` com uma classe de cor específica (`color-0` a `color-7`) para um destaque visual claro.

4. **Mapeamento e Associação:**  
   Para cada segmento da chave, a aplicação tenta localizar a tag XML correspondente (ex: CNPJ para o segmento do CNPJ do emitente).  
   O valor encontrado na tag XML é exibido ao lado do segmento da chave.  
   Para o segmento AAMM (Ano/Mês), a data é extraída das tags `<dhEmi>` ou `<dhSaiEnt>` e formatada para corresponder ao padrão AAMM da chave.  
   A cor do segmento da chave é aplicada ao título do item de mapeamento (`<strong>`) para criar uma conexão visual direta entre a chave e os dados do XML. 🔗

---

## Como Usar 🛠️

1. **Acesse a Aplicação:**  
   Abra o arquivo `index.html` em seu navegador web.

2. **Selecione o XML:**  
   Clique no botão "Selecione o arquivo XML da NFe" e escolha o arquivo XML da sua Nota Fiscal Eletrônica. 📂

3. **Analisar:**  
   Clique no botão "Analisar XML" para processar o arquivo. 🔍

4. **Visualizar Resultados:**  
   A chave de acesso será decomposta e o mapeamento detalhado com os dados do XML será exibido.

5. **Alternar Tema:**  
   Use o botão de ícone (☀️/🌙) para mudar entre o tema claro e escuro.

---

## Tecnologias Utilizadas ⚙️

- **HTML5:** Estrutura básica da página web.
- **Tailwind CSS:** Framework CSS para estilização rápida e responsiva.
- **JavaScript (ES6+):** Lógica principal da aplicação, incluindo leitura de arquivos, parsing de XML e manipulação do DOM.
- **Firebase SDK (Auth):** Incluído para compatibilidade com o ambiente de execução Canvas, mas a autenticação (anônima ou com token personalizado) não afeta as funcionalidades centrais de análise de XML.

---

## Contribuição 🤝

Contribuições são bem-vindas!  
Sinta-se à vontade para abrir issues ou pull requests.

---

## Licença 📜

Este projeto está sob a