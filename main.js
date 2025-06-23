<script type="module">
        // Variáveis globais para Firebase (serão preenchidas pelo ambiente Canvas, se disponíveis)
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

        // Importações do Firebase SDK - necessárias para autenticação no ambiente Canvas
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        // O Firestore não é diretamente usado nesta aplicação, mas a importação pode ser mantida para futura expansão
        // import { getFirestore, doc, getDoc, setDoc, collection } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        let app;
        let auth;
        let userId = null; // Armazena o ID do usuário autenticado (para fins de exemplo/futuro uso)

        /**
         * Exibe uma mensagem na interface do usuário.
         * @param {string} message - A mensagem a ser exibida.
         * @param {'info' | 'success' | 'error'} type - O tipo da mensagem (controla a cor e estilo).
         */
        function showMessage(message, type = 'info') {
            const messageBox = document.getElementById('messageBox');
            messageBox.textContent = message;
            // Reseta as classes e adiciona as necessárias para exibir e estilizar a mensagem
            messageBox.className = 'message-box show';
            if (type === 'error') {
                messageBox.classList.add('error');
            } else if (type === 'success') {
                messageBox.classList.add('success');
            } else {
                messageBox.classList.add('info');
            }
            // Oculta a mensagem automaticamente após 5 segundos
            setTimeout(() => {
                messageBox.classList.remove('show');
            }, 5000);
        }

        /**
         * Inicializa o Firebase e tenta autenticar o usuário.
         * Tenta autenticar com um token personalizado se disponível, caso contrário, autentica anonimamente.
         */
        async function initializeFirebaseAndAuth() {
            try {
                // Verifica se a configuração do Firebase foi fornecida
                if (Object.keys(firebaseConfig).length > 0) {
                    app = initializeApp(firebaseConfig);
                    auth = getAuth(app);

                    // Tenta autenticar com o token personalizado do ambiente Canvas
                    if (initialAuthToken) {
                        await signInWithCustomToken(auth, initialAuthToken);
                        console.log("Autenticado com token personalizado.");
                    } else {
                        // Se não houver token personalizado, autentica anonimamente
                        await signInAnonymously(auth);
                        console.log("Autenticado anonimamente.");
                    }

                    // Listener para mudanças no estado de autenticação
                    onAuthStateChanged(auth, (user) => {
                        if (user) {
                            userId = user.uid; // Armazena o UID do usuário
                            console.log("User ID:", userId);
                        } else {
                            userId = null;
                            console.log("Nenhum usuário logado.");
                        }
                    });
                } else {
                    console.warn("Firebase config não fornecida. A aplicação funcionará sem autenticação/Firestore.");
                }
            } catch (error) {
                console.error("Erro ao inicializar Firebase ou autenticar:", error);
                showMessage(`Erro ao inicializar o sistema de autenticação: ${error.message}`, 'error');
            }
        }

        // --- Lógica do Tema Claro/Escuro ---
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        const sunIcon = document.getElementById('sunIcon');
        const moonIcon = document.getElementById('moonIcon');

        /**
         * Atualiza a visibilidade dos ícones de sol/lua com base no tema atual.
         */
        function updateThemeIcons() {
            if (document.documentElement.classList.contains('dark')) {
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            } else {
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            }
        }

        // Adiciona o evento de clique ao botão de alternância de tema
        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark'); // Alterna a classe 'dark' no elemento html
            // Salva a preferência do usuário no localStorage
            if (document.documentElement.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            updateThemeIcons(); // Atualiza os ícones imediatamente após a alternância
        });

        // Carrega a preferência de tema do usuário ao carregar a página
        document.addEventListener('DOMContentLoaded', () => {
            // Verifica a preferência do localStorage ou do sistema operacional
            if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            updateThemeIcons(); // Define o estado inicial dos ícones com base no tema carregado
        });

        // --- Lógica de Análise do XML ---
        // Adiciona um listener ao botão de análise
        document.getElementById('analyzeBtn').addEventListener('click', analyzeXml);
        // Adiciona um listener para quando um novo arquivo XML é selecionado, limpando os resultados anteriores
        document.getElementById('xmlFileInput').addEventListener('change', function() {
            document.getElementById('xmlContentDisplay').textContent = '';
            document.getElementById('keyBreakdownDisplay').innerHTML = '';
            document.getElementById('xmlElementMapping').innerHTML = '';
            document.getElementById('xmlMapping').classList.add('hidden');
            document.getElementById('messageBox').classList.remove('show', 'error', 'success', 'info'); // Limpa mensagens
        });

        /**
         * Função principal para analisar o arquivo XML da NFe.
         */
        async function analyzeXml() {
            const fileInput = document.getElementById('xmlFileInput');
            const xmlContentDisplay = document.getElementById('xmlContentDisplay');
            const keyBreakdownDisplay = document.getElementById('keyBreakdownDisplay');
            const xmlElementMapping = document.getElementById('xmlElementMapping');
            const xmlMappingSection = document.getElementById('xmlMapping');

            // Limpa resultados anteriores na interface
            keyBreakdownDisplay.innerHTML = '';
            xmlElementMapping.innerHTML = '';
            xmlMappingSection.classList.add('hidden'); // Esconde a seção de mapeamento por padrão

            // Verifica se um arquivo foi selecionado
            if (fileInput.files.length === 0) {
                showMessage('Por favor, selecione um arquivo XML primeiro.', 'error');
                return;
            }

            const file = fileInput.files[0];
            const reader = new FileReader(); // Cria um leitor de arquivos

            reader.onload = function(e) {
                const xmlString = e.target.result; // Obtém o conteúdo do arquivo como string
                xmlContentDisplay.textContent = xmlString; // Exibe o XML completo na área de visualização

                try {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlString, "application/xml"); // Faz o parsing do XML

                    // Verifica se houve erro de parsing (por exemplo, XML malformado)
                    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                        console.error("Erro ao analisar o XML:", xmlDoc.getElementsByTagName("parsererror")[0].textContent);
                        showMessage('Erro ao analisar o arquivo XML. Verifique se o XML está bem formado.', 'error');
                        return;
                    }

                    // Tenta encontrar a chave de acesso no atributo "Id" da tag <infNFe>
                    const infNFeElement = xmlDoc.querySelector('infNFe');
                    let chaveNFe = '';
                    if (infNFeElement && infNFeElement.getAttribute('Id')) {
                        // A chave está no atributo Id e geralmente começa com "NFe", então removemos "NFe"
                        chaveNFe = infNFeElement.getAttribute('Id').replace('NFe', '');
                    }

                    // Validação básica da chave de acesso
                    if (!chaveNFe || chaveNFe.length !== 44 || !/^\d{44}$/.test(chaveNFe)) {
                        showMessage('Chave de Acesso (ID da NFe) não encontrada ou em formato inválido (esperado 44 dígitos numéricos).', 'error');
                        return;
                    }

                    showMessage('XML analisado com sucesso!', 'success');
                    xmlMappingSection.classList.remove('hidden'); // Mostra a seção de mapeamento

                    // Mapeamento das partes da chave de acesso e seus respectivos comprimentos e tags XML
                    const chaveParts = [
                        { name: 'cUF', length: 2, colorIndex: 0, tag: 'cUF' },
                        { name: 'AAMM', length: 4, colorIndex: 1, tag: 'dhEmi, dhSaiEnt' }, // Mês e ano da emissão (derivado de dhEmi/dhSaiEnt)
                        { name: 'CNPJ Emitente', length: 14, colorIndex: 2, tag: 'CNPJ' },
                        { name: 'Mod. (Modelo)', length: 2, colorIndex: 3, tag: 'mod' },
                        { name: 'Série', length: 3, colorIndex: 4, tag: 'serie' },
                        { name: 'Núm. NF', length: 9, colorIndex: 5, tag: 'nNF' },
                        { name: 'Cód. Numérico', length: 8, colorIndex: 6, tag: 'cNF' },
                        { name: 'Dígito Verif.', length: 1, colorIndex: 7, tag: 'cDV' }
                    ];

                    let currentIndex = 0;
                    let extractedValues = {}; // Armazena os valores extraídos para exibição

                    // Exibe a chave de acesso dividida em segmentos coloridos
                    chaveParts.forEach((part, index) => {
                        const segment = chaveNFe.substring(currentIndex, currentIndex + part.length);
                        extractedValues[part.name] = segment; // Guarda o segmento

                        const span = document.createElement('span');
                        span.textContent = segment;
                        span.title = `${part.name}: ${segment}`; // Adiciona um tooltip
                        // Adiciona classes de estilo e cor
                        span.classList.add('highlight-box', `color-${part.colorIndex}`, 'chave-segment');
                        keyBreakdownDisplay.appendChild(span);
                        currentIndex += part.length;
                    });

                    // Exibe o mapeamento detalhado com os valores extraídos do XML
                    chaveParts.forEach(part => {
                        const itemDiv = document.createElement('div');
                        itemDiv.classList.add('mapping-item');

                        const tagName = part.tag.split(',')[0]; // Pega a primeira tag para tentar buscar o valor no XML
                        const xmlValue = getXmlValue(xmlDoc, tagName); // Obtém o valor da tag XML

                        let displayValue = xmlValue;
                        // Lógica especial para AAMM (Ano/Mês da emissão)
                        if (part.name === 'AAMM') {
                            const dhEmi = xmlDoc.querySelector('dhEmi')?.textContent || '';
                            const dhSaiEnt = xmlDoc.querySelector('dhSaiEnt')?.textContent || '';
                            let dateString = dhEmi || dhSaiEnt;
                            if (dateString) {
                                // Assume formato YYYY-MM-DDTHH:MM:SS-HH:MM e extrai AAMM
                                const year = dateString.substring(0, 4);
                                const month = dateString.substring(5, 7);
                                displayValue = `${year}${month}`;
                            } else {
                                displayValue = 'Não encontrado';
                            }
                        } else if (!xmlValue) {
                            displayValue = 'Não encontrado';
                        }

                        // Constrói o HTML para cada item de mapeamento
                        itemDiv.innerHTML = `
                            <strong class="text-center ${`color-${part.colorIndex}`}"">${part.name}</strong>
                            <span class="mapping-value">${displayValue}</span>
                            <span class="mt-2 text-xs text-gray-500 dark:text-gray-400">Chave: ${extractedValues[part.name]}</span>
                            <span class="mt-1 text-xs text-gray-500 dark:text-gray-400">XML Tag: &lt;${part.tag}&gt;</span>
                        `;
                        xmlElementMapping.appendChild(itemDiv);
                    });

                } catch (error) {
                    // Captura e exibe erros inesperados durante a análise
                    console.error("Erro inesperado durante a análise:", error);
                    showMessage(`Ocorreu um erro inesperado: ${error.message}`, 'error');
                }
            };

            // Lida com erros na leitura do arquivo
            reader.onerror = function() {
                showMessage('Erro ao ler o arquivo.', 'error');
            };

            // Inicia a leitura do arquivo como texto
            reader.readAsText(file);
        }

        /**
         * Função auxiliar para obter o valor de um elemento XML.
         * @param {Document} xmlDoc - O documento XML.
         * @param {string} tagName - O nome da tag XML a ser buscada.
         * @returns {string | null} O conteúdo de texto da tag ou null se não encontrada.
         */
        function getXmlValue(xmlDoc, tagName) {
            const element = xmlDoc.querySelector(tagName);
            return element ? element.textContent.trim() : null;
        }

        // Inicializa o Firebase e a autenticação quando o DOM estiver completamente carregado
        document.addEventListener('DOMContentLoaded', initializeFirebaseAndAuth);

    </script>