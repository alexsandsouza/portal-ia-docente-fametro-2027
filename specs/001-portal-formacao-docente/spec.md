# Feature Specification: Portal da Formação Docente 2027

**Feature Branch**: `001-portal-formacao-docente`

**Created**: 2026-10-19

**Status**: Draft

**Input**: User description: "Portal web responsivo da Formação Docente 2027 do Centro Universitário CEUNI FAMETRO, com inscrição, confirmação, check-in por QR Code, biblioteca de materiais no Google Drive, laboratório de IA com cinco desafios, registro de participação, painel administrativo e certificado PDF com código único de autenticidade."

## Clarifications

### Session 2026-10-19

- Q: Quem pode enviar uma inscrição e como o portal reconhece essa pessoa? → A: Qualquer pessoa com nome completo e e-mail válidos pode se inscrever. A identidade é o e-mail. A equipe confirma manualmente. Não há domínio institucional nem lista prévia.
- Q: O que autoriza a emissão do certificado em PDF? → A: A equipe operacional autoriza a emissão manualmente, pessoa a pessoa. Check-in e desafios não liberam o PDF por conta própria.
- Q: O portal deve publicar agora o controlador, o encarregado, a base legal e o prazo de retenção? → A: Não. Esses quatro dados ficam de fora até a instituição entregá-los. Pedidos de acesso, correção e exclusão já existem, e a exclusão não apaga dados em silêncio.
- Q: Como a pessoa participante volta a ver a própria ficha depois de sair da tela do comprovante? → A: O portal envia ao e-mail da inscrição um vínculo pessoal, sem senha. Esse vínculo abre somente a ficha dela, e um novo vínculo invalida o anterior.
- Q: A tentativa com e-mail já inscrito mostra a ficha de outra pessoa? → A: Não. A resposta é apenas «este e-mail já possui inscrição». Nome, estado e identificador só aparecem para quem abre o vínculo vigente.
- Q: A consulta pública do certificado mostra o nome da instituição? → A: Sim. Mostra autenticidade, Formação Docente 2027, Centro Universitário CEUNI FAMETRO e a data de emissão. Não mostra e-mail nem documento.
- Q: Qual é o prazo do vínculo ainda não aberto? → A: Não há número fixo nesta versão. Um vínculo novo invalida o anterior na hora. O tempo de vida do vínculo não aberto segue a configuração do projeto Supabase.
- Q: Quantas tentativas disparam a recusa temporária? → A: 5 tentativas inválidas na mesma janela recusam a ação por 15 minutos, na inscrição, no check-in e na consulta de certificado, sem revelar se um código parecido existe.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Inscrever-se na formação (Priority: P1)

A pessoa participante informa os dados pedidos no formulário, envia a inscrição na Formação Docente 2027 e recebe um comprovante de que o registro foi criado. A inscrição nasce pendente de confirmação.

**Why this priority**: Sem inscrição não há participante, check-in, laboratório nem certificado.

**Independent Test**: Uma pessoa abre o formulário, envia dados válidos e vê o comprovante com o estado pendente. Um envio inválido mostra o erro e não cria registro.

**Acceptance Scenarios**:

1. **Given** que não existe inscrição ativa para aquele identificador, **When** a pessoa envia o formulário com os dados obrigatórios válidos, **Then** o portal cria uma inscrição pendente e mostra um comprovante com identificador e estado.
2. **Given** que a pessoa deixou de preencher um dado obrigatório ou informou um dado em formato inválido, **When** envia o formulário, **Then** o portal indica o campo com problema e não cria inscrição.
3. **Given** que já existe uma inscrição ativa para o mesmo identificador, **When** alguém tenta inscrever-se de novo sem o vínculo vigente, **Then** o portal não cria uma segunda inscrição ativa e responde apenas «este e-mail já possui inscrição», sem nome, estado nem identificador.
4. **Given** uma pessoa que não consta de lista prévia e cujo e-mail não pertence a um domínio específico, **When** envia nome completo e e-mail válidos, **Then** o portal cria a inscrição pendente e mostra o comprovante.
5. **Given** uma inscrição recém-criada, **When** o envio termina, **Then** o portal envia ao e-mail informado um vínculo pessoal, sem senha, que abre somente a ficha dessa inscrição.

---

### User Story 2 - Acompanhar a confirmação (Priority: P1)

A pessoa participante e a equipe autorizada enxergam se a inscrição está pendente ou confirmada. A confirmação é um ato distinto do registro inicial.

**Why this priority**: A confirmação separa quem apenas se inscreveu de quem está apto a seguir na formação.

**Independent Test**: Com uma inscrição pendente, a equipe autorizada confirma e a pessoa participante passa a ver o estado confirmado. Sem esse ato, o estado permanece pendente.

**Acceptance Scenarios**:

1. **Given** uma inscrição pendente, **When** uma pessoa com papel operacional confirma, **Then** o estado visível para a participante e para a equipe passa a ser confirmado e a data da confirmação fica registrada.
2. **Given** uma inscrição pendente, **When** a própria participante tenta confirmar a si mesma, **Then** o estado permanece pendente.
3. **Given** uma inscrição confirmada, **When** a participante consulta a própria inscrição, **Then** o portal mostra o estado confirmado em português.

---

### User Story 3 - Fazer check-in por QR Code (Priority: P2)

No momento da formação, a participação presencial é registrada pela leitura de um código individual. O código não exibe dados pessoais em claro. A participante também pode informar o mesmo código em texto.

**Why this priority**: O check-in é a evidência presencial prevista para a formação e precisa existir antes de qualquer regra de presença ser fechada.

**Independent Test**: Uma inscrição confirmada exibe um código. A leitura válida gera um único check-in. Código inválido ou segunda leitura não gera outro registro.

**Acceptance Scenarios**:

1. **Given** uma inscrição confirmada sem check-in, **When** a equipe lê o código válido, **Then** o portal registra um check-in com data e hora e o mostra na ficha da participante.
2. **Given** um código inválido ou de inscrição não confirmada, **When** a equipe tenta registrar o check-in, **Then** o portal recusa e não cria registro.
3. **Given** um check-in já registrado para aquela inscrição, **When** o mesmo código é lido outra vez, **Then** o portal mantém um único check-in.
4. **Given** que a pessoa não pode usar a câmera, **When** informa o código em texto, **Then** o resultado é o mesmo da leitura do código gráfico.

---

### User Story 4 - Consultar a biblioteca de materiais (Priority: P2)

A pessoa participante vê a lista de materiais publicados e segue para o arquivo correspondente no Google Drive. O arquivo permanece no Drive.

**Why this priority**: Os materiais são o conteúdo de estudo da formação e não dependem do check-in para serem especificados.

**Independent Test**: Com um material publicado, a participante vê título, descrição e consegue abrir o destino. Sem publicação, a lista não mostra esse item.

**Acceptance Scenarios**:

1. **Given** um material publicado para participantes, **When** a participante abre a biblioteca, **Then** vê título, descrição e um destino que abre o arquivo no Google Drive.
2. **Given** um material não publicado, **When** a participante abre a biblioteca, **Then** esse material não aparece.
3. **Given** uma pessoa sem inscrição, **When** tenta abrir a biblioteca da formação, **Then** o portal não mostra os materiais restritos.

---

### User Story 5 - Percorrer os cinco desafios (Priority: P2)

O portal apresenta exatamente cinco desafios de IA. Cada participante tem um andamento próprio em cada desafio: não iniciado ou concluído pela própria pessoa. O enunciado é publicado pela equipe; enquanto um desafio não tiver enunciado, ele aparece como aguardando conteúdo e não pode ser concluído.

**Why this priority**: O laboratório é uma capacidade prometida da formação. O conteúdo de cada desafio ainda depende da instituição, mas o percurso e o registro já podem ser especificados.

**Independent Test**: A participante vê cinco desafios, conclui os que têm enunciado e o andamento fica visível para ela e para a equipe.

**Acceptance Scenarios**:

1. **Given** a formação publicada, **When** a participante abre o laboratório, **Then** vê exatamente cinco desafios, cada um com o próprio andamento.
2. **Given** um desafio com enunciado e andamento não iniciado, **When** a participante marca conclusão, **Then** o andamento passa a concluído e a data fica registrada.
3. **Given** um desafio sem enunciado, **When** a participante tenta concluí-lo, **Then** o portal recusa e mantém o estado de aguardando conteúdo.

---

### User Story 6 - Consultar o registro de participação (Priority: P2)

A equipe autorizada abre a ficha da pessoa e vê, em ordem cronológica, a inscrição, a confirmação, o check-in e o andamento de cada desafio, com a data de cada evento que já ocorreu.

**Why this priority**: A ficha reúne as evidências já especificadas e evita que a equipe procure cada uma em uma tela isolada.

**Independent Test**: Depois de confirmar, fazer check-in e concluir um desafio, a ficha mostra esses três eventos com data. Eventos ainda não ocorridos não aparecem como se tivessem acontecido.

**Acceptance Scenarios**:

1. **Given** uma participante com inscrição, confirmação e check-in, **When** a equipe abre a ficha, **Then** vê cada evento ocorrido e a respectiva data.
2. **Given** uma participante sem check-in, **When** a equipe abre a ficha, **Then** o check-in não consta como realizado.
3. **Given** o vínculo vigente enviado ao e-mail da participante, **When** ela abre esse vínculo, **Then** vê os próprios eventos e não vê a ficha de outra pessoa.
4. **Given** um vínculo já substituído por outro mais novo, **When** a pessoa abre o vínculo anterior, **Then** o portal não mostra a ficha.

---

### User Story 7 - Operar o painel administrativo (Priority: P1)

A pessoa com papel operacional consulta e opera inscrições, confirmações, check-in, materiais, desafios e certificados. A pessoa participante não entra nesse painel.

**Why this priority**: A operação da formação depende de uma superfície separada, com ações rastreáveis.

**Independent Test**: Uma conta participante recebe recusa ao abrir o painel. Uma conta operacional confirma uma inscrição e essa ação aparece no histórico de operações.

**Acceptance Scenarios**:

1. **Given** uma conta de participante, **When** tenta abrir o painel, **Then** o portal recusa o acesso.
2. **Given** uma conta operacional, **When** confirma uma inscrição, publica um material ou registra um check-in, **Then** a ação fica registrada com autor e data.
3. **Given** uma conta sem papel concedido, **When** tenta executar ação operacional, **Then** o portal recusa e não altera o registro.

---

### User Story 8 - Obter e verificar o certificado (Priority: P3)

A equipe operacional autoriza a emissão para uma participante. Só depois dessa autorização a pessoa baixa um PDF com código único de autenticidade. Check-in e conclusão dos desafios não liberam o arquivo. Qualquer pessoa com o código consulta se ele corresponde a um certificado emitido, sem receber dados além dos necessários para essa confirmação.

**Why this priority**: O certificado é o fechamento da jornada. A emissão depende de um ato da equipe, não de uma regra acadêmica presumida.

**Independent Test**: Sem autorização da equipe, o PDF não existe. Depois da autorização, a participante baixa o PDF e a consulta do código retorna certificado autêntico. Um código inexistente retorna consulta sem correspondência e sem dados pessoais.

**Acceptance Scenarios**:

1. **Given** uma participante com check-in e com os cinco desafios concluídos, mas sem autorização da equipe, **When** ela pede o certificado, **Then** o portal não gera PDF e explica que a emissão ainda não foi autorizada.
2. **Given** uma autorização da equipe para aquela participante, **When** ela pede o certificado, **Then** recebe um PDF em português com o próprio nome, o nome da formação, o nome da instituição, a data de emissão e um código único.
3. **Given** um código de certificado emitido, **When** uma pessoa consulta esse código, **Then** o portal informa que o certificado é autêntico e mostra o nome da formação, o nome da instituição e a data de emissão, sem e-mail e sem documento de identificação.
4. **Given** um código inexistente, **When** uma pessoa o consulta, **Then** o portal informa que não há certificado correspondente e não revela dados de participantes.

---

### User Story 9 - Pedir acesso, correção ou exclusão (Priority: P3)

A pessoa participante pede para ver os próprios dados, corrigir o nome ou registrar um pedido de exclusão. O pedido fica visível para ela e para a equipe. O portal não mostra controlador, encarregado, base legal nem prazo de retenção enquanto a instituição não entregar esses dados. A exclusão não apaga o cadastro em silêncio.

**Why this priority**: O caminho para os direitos da pessoa titular precisa existir sem inventar os dados institucionais da LGPD.

**Independent Test**: A participante pede acesso e vê o pedido registrado com data. A tela não exibe controlador, encarregado, base legal nem prazo de retenção.

**Acceptance Scenarios**:

1. **Given** uma participante inscrita, **When** pede acesso aos próprios dados, **Then** o portal mostra nome e e-mail que guarda e registra o pedido com data.
2. **Given** uma participante inscrita, **When** corrige o próprio nome, **Then** a ficha passa a mostrar o nome novo e a correção fica registrada com data.
3. **Given** um pedido de exclusão, **When** a instituição ainda não autorizou a execução, **Then** o pedido permanece visível para a participante e para a equipe, e os dados continuam no portal.
4. **Given** que a instituição ainda não entregou controlador, encarregado, base legal e prazo de retenção, **When** a participante abre a área dos próprios dados, **Then** o portal não exibe esses quatro itens.

### Edge Cases

- Inscrição duplicada para o mesmo identificador mantém uma única inscrição ativa. Sem o vínculo vigente, a nova tentativa não revela nome, estado nem identificador.
- Check-in repetido mantém um único registro.
- Código de check-in de inscrição pendente é recusado.
- Material sem publicação não aparece para a participante.
- Desafio sem enunciado não pode ser concluído.
- Consulta de certificado inexistente não revela se algum outro código parecido existe.
- Pedido de certificado sem autorização da equipe não gera arquivo, mesmo com check-in e com os cinco desafios concluídos.
- Depois de 5 tentativas inválidas na mesma janela, inscrição, leitura de código e consulta de certificado ficam recusadas por 15 minutos, com mensagem compreensível e sem revelar se um código parecido existe.
- O mesmo fluxo principal permanece utilizável em viewport de celular e de computador, e por teclado.
- Pedido de exclusão não remove nome, e-mail, inscrição, check-in nem certificado enquanto a instituição não autorizar a execução.
- Vínculo anterior deixa de abrir a ficha assim que um novo vínculo é enviado. O vínculo não abre a ficha de outra pessoa.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O portal MUST permitir que uma pessoa envie uma inscrição na Formação Docente 2027 e MUST exibir comprovante quando o registro for criado.
- **FR-002**: O portal MUST exigir nome completo e e-mail válidos na inscrição e MUST recusar o envio quando esses dados faltarem ou o e-mail for inválido.
- **FR-003**: O portal MUST manter no máximo uma inscrição ativa por e-mail. Uma nova tentativa sem o vínculo vigente MUST responder apenas «este e-mail já possui inscrição» e MUST NOT revelar nome, estado nem identificador. Quem abre o vínculo vigente MUST ver a própria ficha.
- **FR-004**: O portal MUST aceitar a inscrição de qualquer pessoa que informe nome completo e e-mail válidos. O e-mail MUST ser o identificador da pessoa. O portal MUST NOT exigir domínio institucional nem lista prévia. A confirmação MUST continuar sendo uma ação manual da equipe operacional.
- **FR-005**: O portal MUST criar a inscrição no estado pendente e MUST mudar para confirmado somente por ação de pessoa com papel operacional.
- **FR-006**: A pessoa participante MUST conseguir ver se a própria inscrição está pendente ou confirmada ao abrir o vínculo vigente enviado ao e-mail dela.
- **FR-020**: Depois da inscrição, o portal MUST enviar ao e-mail informado um vínculo pessoal, sem senha. Esse vínculo MUST abrir somente a ficha daquela pessoa. Um novo vínculo MUST invalidar o anterior na hora. O tempo de vida do vínculo ainda não aberto segue a configuração do projeto Supabase e MUST NOT ser tratado como número fixo desta versão. O portal MUST NOT criar senha para a participante.
- **FR-007**: O portal MUST emitir, para cada inscrição confirmada, um código de check-in opaco, utilizável como gráfico e como texto, sem dados pessoais legíveis.
- **FR-008**: O portal MUST registrar um único check-in por inscrição confirmada e MUST recusar código inválido, inscrição não confirmada e leitura repetida.
- **FR-009**: A equipe MUST conseguir publicar material com título, descrição e destino no Google Drive. O arquivo MUST permanecer no Drive. A participante com inscrição MUST conseguir abrir os materiais publicados, e uma pessoa sem inscrição MUST NOT vê-los.
- **FR-010**: O portal MUST apresentar exatamente cinco desafios. Cada desafio publicado MUST ter enunciado. A participante MUST conseguir marcar como concluído apenas desafio que já tenha enunciado, e o portal MUST guardar o andamento individual.
- **FR-011**: A ficha da participante MUST listar, com data, a inscrição, a confirmação, o check-in e a conclusão de desafio que já tiverem ocorrido. A participante MUST ver somente a própria ficha. A equipe operacional MUST conseguir consultar a ficha de cada participante.
- **FR-012**: O portal MUST separar a superfície da participante da superfície operacional. Conta sem papel operacional MUST NOT executar confirmação, check-in, publicação, edição de desafio ou emissão.
- **FR-013**: Cada ação operacional MUST ficar registrada com autor e data, em consulta restrita à equipe operacional.
- **FR-014**: O portal MUST emitir o PDF somente depois que uma pessoa com papel operacional autorizar a emissão daquela participante. Check-in e conclusão de desafios MUST NOT autorizar a emissão por si sós. Sem essa autorização, o portal MUST NOT gerar o PDF.
- **FR-015**: O certificado emitido MUST ser um PDF em português, com nome da participante, nome da formação, nome da instituição, data de emissão e código único. Signatário, carga horária e identidade visual permanecem de fora até a instituição fornecê-los.
- **FR-016**: A consulta pública de um código vigente MUST informar autenticidade, o nome da formação Formação Docente 2027, o nome da instituição Centro Universitário CEUNI FAMETRO e a data de emissão. MUST NOT exibir e-mail nem documento de identificação. Código inexistente MUST receber resposta de ausência, sem outros dados pessoais e sem indicar se existe código parecido.
- **FR-017**: A pessoa participante MUST conseguir pedir acesso aos próprios dados, correção do nome e registro de exclusão. O portal MUST NOT apagar os dados em silêncio. O portal MUST NOT exibir controlador, encarregado, base legal nem prazo de retenção enquanto a instituição não entregar esses quatro dados.
- **FR-018**: O portal MUST operar os fluxos principais em viewport de celular e de computador, em português brasileiro, com uso por teclado, rótulos nos campos, foco visível e caminho em texto equivalente ao código gráfico e ao PDF.
- **FR-019**: O portal MUST recusar inscrição, validação de código de check-in e consulta de certificado por 15 minutos depois de 5 tentativas inválidas na mesma janela. A mensagem MUST ser clara e MUST NOT revelar se um código parecido existe.

### Key Entities

- **Participante**: Pessoa inscrita. Atributos mínimos conhecidos: nome completo e e-mail. Relação de um para um com a inscrição ativa.
- **Inscrição**: Pedido de participação na Formação Docente 2027. Possui identificador, estado pendente ou confirmado, data de criação e, quando houver, data de confirmação.
- **Código de check-in**: Valor opaco ligado a uma inscrição confirmada. Possui representação gráfica e textual equivalentes.
- **Check-in**: Registro único de presença presencial, com data e hora, ligado a uma inscrição.
- **Material**: Item da biblioteca, com título, descrição, destino no Google Drive e estado publicado ou não publicado.
- **Desafio**: Um dos cinco desafios do laboratório, com título, enunciado opcional enquanto o conteúdo não chega, e ordem de apresentação.
- **Andamento**: Situação de uma participante em um desafio: aguardando conteúdo, não iniciado ou concluído, com data de conclusão quando existir.
- **Certificado**: Documento emitido para uma participante, com data de emissão, código único e estado emitido. Anulação permanece pendente e não faz parte desta spec.
- **Papel operacional**: Autorização distinta da participante para operar o painel. A lista de pessoas que recebem esse papel é definida fora do formulário de inscrição.
- **Registro operacional**: Autor, data e ação executada no painel.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Uma pessoa com os dados em mãos conclui a inscrição válida e vê o comprovante em até 3 minutos na primeira tentativa.
- **SC-002**: Em um teste com 10 inscrições, 100% das pessoas distinguem o estado pendente do estado confirmado sem ajuda da equipe.
- **SC-003**: 100% das leituras válidas de check-in produzem um único registro, e 100% das leituras inválidas ou repetidas deixam de criar registro adicional.
- **SC-004**: A biblioteca e o laboratório mostram, respectivamente, somente materiais publicados e exatamente cinco desafios.
- **SC-005**: Depois que a equipe autoriza a emissão, a participante obtém o PDF em uma única ação, e uma terceira pessoa confirma a autenticidade do código em até 1 minuto.
- **SC-006**: Em 100% das consultas públicas, o resultado omite e-mail e documento de identificação.
- **SC-007**: Em um teste de acesso, 100% das contas de participante são recusadas no painel operacional, e 100% das ações operacionais testadas ficam com autor e data.
- **SC-008**: Os fluxos de inscrição, biblioteca, laboratório e consulta de certificado são concluídos por teclado e permanecem utilizáveis em viewport de celular e de computador.
- **SC-009**: 90% das pessoas participantes completam inscrição, consulta de materiais e marcação de um desafio com enunciado na primeira tentativa, sem suporte.

## Assumptions

- Qualquer pessoa com nome completo e e-mail válidos pode pedir a vaga. O e-mail identifica a pessoa. Não há domínio institucional nem lista prévia. A equipe confirma ou recusa depois, manualmente. O identificador de inscrição duplicada é o e-mail.
- A confirmação é manual, feita por quem tem papel operacional. O estado confirmado aparece na ficha e não depende de a pessoa ler uma mensagem. O retorno à ficha usa o vínculo pessoal enviado ao e-mail da inscrição, sem senha. Um novo vínculo invalida o anterior.
- O check-in ocorre com o portal acessível. Não há fila offline nesta versão. Não há data de expiração do código enquanto a instituição não definir a janela do evento. A segunda leitura não cria outro check-in.
- Quem lê o código é uma pessoa com papel operacional. A participante exibe o código.
- A equipe publica cada material com o destino já existente no Google Drive. Identificador de pasta, visibilidade da conta Google e credencial de acesso não fazem parte desta spec.
- O laboratório tem cinco posições fixas. O enunciado, a ordem pedagógica e o critério acadêmico de cada desafio serão fornecidos pela instituição. Até lá, a conclusão registrada é a declaração da participante sobre o desafio que já tem enunciado. Revisão de entrega pela equipe fica fora desta spec.
- A ficha mostra os eventos ocorridos. Ela não calcula percentual de presença nem decide sozinha o direito ao certificado. A emissão ocorre somente quando a equipe operacional autoriza aquela participante. Check-in e desafios concluídos não substituem essa autorização.
- Existe um papel operacional, distinto da participante. As pessoas que recebem esse papel são nomeadas pela instituição no momento da operação. Não há segundo papel interno nesta spec.
- O PDF usa apenas dados já confirmados no portal: nome, formação, instituição, data e código. Logotipo, signatário e carga horária entram somente quando a instituição os entregar.
- Anulação de certificado, prazo de disponibilidade do arquivo e modelo visual ficam fora até decisão própria.
- Controlador, encarregado, base legal e prazo de retenção não são estimados nem exibidos. O portal oferece acesso, correção de nome e registro de exclusão. A exclusão só é executada quando a instituição autorizar.
- O volume inicial cabe em uma formação presencial de um centro universitário: até 500 inscrições ativas e até 50 pessoas usando o portal ao mesmo tempo, sem degradação perceptível dos fluxos principais.
- Textos visíveis à pessoa usuária ficam em português brasileiro.
