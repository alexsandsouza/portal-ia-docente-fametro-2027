# Feature Specification: Portal da Formação Docente 2027

> Esta pasta não é a spec vigente. A spec ativa é `specs/001-portal-formacao-docente/`. Este texto foi arquivado em 2026-10-19 para não ser implementado no lugar dela.

**Feature Branch**: `001-faculty-training-portal`

**Created**: 2026-10-19

**Status**: Draft

**Input**: User description: "Portal web responsivo da Formação Docente 2027 do Centro Universitário CEUNI FAMETRO, com inscrição, confirmação, check-in por QR Code, biblioteca de materiais no Google Drive, laboratório de IA com cinco desafios, registro de participação, painel administrativo e certificado PDF com código único de autenticidade."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Inscrever-se na formação (Priority: P1)

A pessoa participante informa nome e e-mail, envia a inscrição na Formação Docente 2027 e vê na hora um comprovante de que o pedido foi registrado.

**Why this priority**: Sem inscrição não existe participante, presença nem certificado. Esta jornada já entrega valor sozinha.

**Independent Test**: Uma pessoa nova preenche o formulário e recebe um comprovante com o estado "recebida", sem depender de check-in, materiais ou certificado.

**Acceptance Scenarios**:

1. **Given** que não existe inscrição com aquele e-mail, **When** a pessoa envia nome e e-mail válidos, **Then** a inscrição fica registrada como recebida e o comprovante aparece na mesma tela.
2. **Given** que já existe inscrição com aquele e-mail, **When** a pessoa tenta inscrever-se de novo, **Then** o portal não cria outra inscrição e informa que aquele e-mail já possui inscrição.
3. **Given** que o nome está vazio ou o e-mail é inválido, **When** a pessoa tenta enviar, **Then** a inscrição não é criada e a mensagem indica o que corrigir.

---

### User Story 2 - Confirmar uma inscrição (Priority: P1)

Uma pessoa com papel de administração vê as inscrições recebidas e marca cada uma como confirmada ou recusada. A pessoa participante vê o estado atual da própria inscrição.

**Why this priority**: A confirmação separa quem apenas pediu vaga de quem pode seguir na formação. A administração permanece no controle enquanto a regra de elegibilidade institucional não chega.

**Independent Test**: Com uma inscrição já recebida, a administração confirma e a pessoa participante passa a ver o estado "confirmada", sem usar check-in nem certificado.

**Acceptance Scenarios**:

1. **Given** uma inscrição recebida, **When** a administração confirma, **Then** o estado passa a confirmada e a pessoa participante vê esse estado.
2. **Given** uma inscrição recebida, **When** a administração recusa, **Then** o estado passa a recusada e a pessoa participante vê esse estado.
3. **Given** uma pessoa participante usando o próprio vínculo de acesso, **When** ela tenta confirmar ou recusar qualquer inscrição, **Then** a ação é recusada.

---

### User Story 3 - Fazer check-in por código (Priority: P2)

No momento da formação, a pessoa participante apresenta um código individual, inclusive em QR Code. A leitura válida registra o check-in uma única vez. O código não mostra dados pessoais em texto claro. Quem não puder usar o QR Code informa o mesmo código em texto.

**Why this priority**: O check-in é a evidência de presença no encontro. Depende da inscrição, mas não depende do laboratório nem do certificado.

**Independent Test**: Uma inscrição confirmada gera um código; a primeira leitura válida grava o check-in e a segunda não cria outro registro.

**Acceptance Scenarios**:

1. **Given** uma inscrição confirmada sem check-in, **When** o código vigente é lido ou digitado, **Then** o check-in fica registrado com data e hora e a tela confirma o sucesso sem exibir dados além do necessário para reconhecer a pessoa na operação.
2. **Given** um check-in já registrado, **When** o mesmo código é apresentado de novo, **Then** o portal informa que o check-in já foi feito e não cria outro.
3. **Given** um código inexistente, substituído ou de inscrição não confirmada, **When** alguém o apresenta, **Then** o check-in não é registrado e a mensagem explica a recusa sem revelar dados de outra pessoa.
4. **Given** que a pessoa participante não usa o QR Code, **When** informa o código em texto, **Then** o resultado é o mesmo da leitura do QR Code.

---

### User Story 4 - Consultar os materiais (Priority: P2)

A pessoa com inscrição confirmada vê a lista de materiais publicados e segue para o arquivo correspondente no Google Drive. Os arquivos permanecem no Drive. A administração publica e retira materiais da lista.

**Why this priority**: A biblioteca entrega o conteúdo da formação a quem já foi confirmado. Funciona sem check-in e sem certificado.

**Independent Test**: A administração publica um material com título, descrição e destino; a pessoa confirmada vê o item e a pessoa sem confirmação não vê.

**Acceptance Scenarios**:

1. **Given** um material publicado, **When** uma pessoa com inscrição confirmada abre a biblioteca, **Then** vê título, descrição e o destino do arquivo.
2. **Given** um material publicado, **When** uma pessoa sem inscrição confirmada abre a biblioteca, **Then** não vê esse material.
3. **Given** um material retirado da publicação, **When** uma pessoa confirmada abre a biblioteca, **Then** o item não aparece na lista.
4. **Given** que o arquivo em si continua no Google Drive, **When** a pessoa segue o destino, **Then** o portal não copia o arquivo para dentro de si.

---

### User Story 5 - Percorrer os cinco desafios (Priority: P2)

O laboratório apresenta exatamente cinco desafios de IA. A pessoa com inscrição confirmada vê o enunciado de cada um e o portal guarda o andamento: não iniciado, em andamento ou concluído pela própria pessoa. O enunciado é conteúdo informado pela administração, não uma regra fixa desta especificação.

**Why this priority**: O laboratório é uma capacidade pedida da formação e pode ser demonstrado sem emissão de certificado.

**Independent Test**: Existem cinco desafios com enunciado; a pessoa confirmada muda o andamento de um deles e esse andamento permanece associado a ela.

**Acceptance Scenarios**:

1. **Given** a formação publicada, **When** qualquer pessoa autorizada abre o laboratório, **Then** vê exatamente cinco desafios, nem mais nem menos.
2. **Given** uma pessoa com inscrição confirmada, **When** marca um desafio como em andamento ou concluído, **Then** o portal guarda esse andamento e a data da última mudança.
3. **Given** uma pessoa sem inscrição confirmada, **When** tenta registrar andamento, **Then** o portal recusa a alteração.
4. **Given** que a administração atualiza o enunciado de um desafio, **When** a pessoa participante abre esse desafio, **Then** vê o enunciado atual sem perder o andamento já registrado.

---

### User Story 6 - Consultar o registro de participação (Priority: P2)

A pessoa participante vê a própria ficha: estado da inscrição, check-in e andamento dos cinco desafios, com data de cada evento existente. A administração vê a ficha de qualquer pessoa inscrita.

**Why this priority**: Reúne as evidências já produzidas pelas outras jornadas e permite acompanhamento sem decidir, por si, quem recebe certificado.

**Independent Test**: Depois de uma confirmação e de um check-in, a ficha mostra os dois eventos com data, mesmo que o laboratório ainda não tenha sido usado.

**Acceptance Scenarios**:

1. **Given** eventos já registrados para a pessoa, **When** ela abre a própria ficha, **Then** vê cada evento existente e a respectiva data.
2. **Given** uma pessoa inscrita, **When** a administração abre a ficha dela, **Then** vê os mesmos eventos.
3. **Given** uma pessoa participante, **When** tenta abrir a ficha de outra pessoa, **Then** o portal recusa.

---

### User Story 7 - Emitir e verificar o certificado (Priority: P2)

A administração emite um certificado em PDF com um código único de autenticidade. A pessoa participante baixa o próprio PDF depois da emissão. Qualquer pessoa consulta um código e recebe uma resposta clara, sem precisar entrar no portal. A condição que autoriza a emissão e o conjunto de dados pessoais exibidos na consulta pública dependem das respostas ainda abertas nesta spec.

**Why this priority**: O certificado é o fechamento do ciclo, mas só faz sentido depois que a inscrição existe. A emissão não deve inventar a regra acadêmica de quem tem direito.

**Independent Test**: Com a condição de emissão considerada atendida, a administração emite um PDF; a pessoa baixa o arquivo; um código desconhecido não é apresentado como válido.

**Acceptance Scenarios**:

1. **Given** que a condição de emissão está atendida, **When** a administração emite o certificado, **Then** existe um único código novo, o PDF fica disponível para a pessoa participante e uma segunda emissão para a mesma pessoa não gera outro certificado vigente.
2. **Given** um certificado vigente, **When** a pessoa participante pede o download, **Then** recebe o PDF com o nome dela, o nome da formação, o nome da instituição, a data de emissão e o código de autenticidade.
3. **Given** que a condição de emissão não está atendida, **When** alguém tenta emitir ou baixar, **Then** o certificado não é emitido.
4. **Given** um código que não corresponde a certificado vigente, **When** uma pessoa consulta esse código sem entrar no portal, **Then** a resposta informa que não há certificado válido para ele e não revela dados de participantes.
5. **Given** um certificado revogado pela administração, **When** o código é consultado, **Then** a resposta informa que o certificado não está válido.

---

### User Story 8 - Pedir acesso, correção ou exclusão (Priority: P3)

A pessoa participante pede para ver, corrigir ou excluir os dados dela no portal. O pedido fica registrado. A correção de nome é aplicada na própria ficha. A exclusão não é executada por conta própria enquanto a instituição não confirmar que não há obrigação de guarda.

**Why this priority**: Garante um caminho para os direitos da pessoa titular sem presumir prazo de retenção nem base legal.

**Independent Test**: A pessoa envia um pedido de acesso e encontra esse pedido registrado na própria ficha, com data.

**Acceptance Scenarios**:

1. **Given** uma pessoa inscrita, **When** pede acesso aos próprios dados, **Then** o portal mostra os dados que guarda sobre ela e registra o pedido com data.
2. **Given** uma pessoa inscrita, **When** corrige o próprio nome, **Then** a ficha passa a mostrar o nome novo e a correção fica registrada.
3. **Given** um pedido de exclusão, **When** a instituição ainda não autorizou a execução, **Then** o pedido permanece visível para a pessoa e para a administração, e os dados não somem em silêncio.

---

### Edge Cases

- E-mail com letras maiúsculas e minúsculas diferentes é tratado como o mesmo e-mail.
- Inscrição recusada não gera código de check-in, não vê materiais, não registra desafio e não recebe certificado.
- A administração substitui o código de check-in; o código anterior deixa de valer e o novo passa a ser o único vigente.
- Várias tentativas seguidas de consulta com códigos inválidos não revelam se um código quase igual existe e passam a ser recusadas por um período curto.
- A pessoa participante não acessa o painel administrativo por endereço direto.
- A lista de materiais vazia e o laboratório sem enunciado preenchido mostram uma orientação em português, sem tela em branco.
- O certificado revogado deixa de ser baixado como documento vigente.
- Nome muito longo e enunciado longo permanecem legíveis em tela estreita e no PDF, sem cortar o código de autenticidade.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O portal MUST permitir uma inscrição por e-mail, com nome e e-mail, e MUST mostrar um comprovante com o estado "recebida".
- **FR-002**: O portal MUST recusar inscrição duplicada e dados obrigatórios inválidos, com mensagem em português.
- **FR-003**: A elegibilidade de quem pode se inscrever MUST seguir [NEEDS CLARIFICATION: quem pode se inscrever e como a identidade é verificada — qualquer pessoa com nome e e-mail, somente um domínio institucional, ou uma lista prévia?].
- **FR-004**: A administração MUST poder confirmar ou recusar uma inscrição recebida. A pessoa participante MUST ver somente o estado da própria inscrição.
- **FR-005**: O portal MUST oferecer dois papéis distintos: participante e administração. Ação de administração MUST ser recusada para quem não tem esse papel.
- **FR-006**: Cada inscrição confirmada MUST ter um código individual opaco, utilizável por QR Code e por texto equivalente, sem dados pessoais em claro.
- **FR-007**: O check-in MUST ser registrado uma única vez por inscrição. Código inválido, substituído ou de inscrição não confirmada MUST ser recusado.
- **FR-008**: A administração MUST publicar e retirar materiais com título, descrição e destino. O arquivo MUST permanecer no Google Drive. Somente inscrição confirmada MUST ver a lista publicada.
- **FR-009**: O laboratório MUST ter exatamente cinco desafios. O enunciado de cada um MUST ser conteúdo informado pela administração. A pessoa com inscrição confirmada MUST poder registrar o andamento de cada desafio.
- **FR-010**: A ficha de participação MUST mostrar, para cada evento existente, o tipo e a data. A pessoa participante MUST ver só a própria ficha. A administração MUST ver a ficha de qualquer pessoa inscrita.
- **FR-011**: A emissão do certificado MUST ocorrer somente quando [NEEDS CLARIFICATION: qual condição autoriza o certificado — check-in, check-in mais conclusão dos cinco desafios, ou decisão manual da administração?].
- **FR-012**: O certificado emitido MUST ser um PDF com código único de autenticidade, nome da pessoa, nome da formação, nome da instituição e data de emissão. A pessoa participante MUST baixar apenas o próprio certificado vigente.
- **FR-013**: A consulta pública do código MUST funcionar sem entrada no portal e MUST informar quando não há certificado válido. Os dados pessoais exibidos quando o código é válido MUST seguir [NEEDS CLARIFICATION: a consulta pública mostra só válido ou inválido, ou também nome e formação?].
- **FR-014**: A administração MUST poder revogar um certificado vigente. Certificado revogado MUST deixar de ser apresentado como válido.
- **FR-015**: Cada ação administrativa de confirmação, recusa, substituição de código, publicação, emissão e revogação MUST ficar registrada com autor, ação e data.
- **FR-016**: A pessoa participante MUST poder pedir acesso e correção dos próprios dados e MUST poder registrar pedido de exclusão. O portal MUST NOT apagar os dados em silêncio antes de a instituição autorizar a execução da exclusão.
- **FR-017**: Os fluxos principais MUST ser utilizáveis em tela de celular e em tela de computador, em português brasileiro, com teclado, rótulos e foco visível.
- **FR-018**: O portal MUST coletar, na inscrição, somente nome e e-mail, até que a instituição peça expressamente outro dado.
- **FR-019**: Depois da inscrição, o portal MUST enviar ao e-mail informado um vínculo pessoal para a pessoa rever a própria ficha. Esse vínculo MUST abrir somente a ficha dela. Um novo vínculo MUST invalidar o anterior.

### Key Entities

- **Pessoa participante**: Nome e e-mail usados na formação. Relaciona-se a uma inscrição.
- **Inscrição**: Pedido de vaga com estado recebida, confirmada ou recusada, e a data de cada mudança.
- **Código de check-in**: Código vigente da inscrição confirmada. Pode ser substituído; o anterior deixa de valer.
- **Check-in**: Registro único de presença, com data e hora, ligado à inscrição.
- **Material**: Título, descrição, destino externo e situação publicado ou retirado.
- **Desafio**: Um dos cinco itens do laboratório, com enunciado informado pela administração.
- **Andamento do desafio**: Situação não iniciado, em andamento ou concluído pela pessoa, com data da última mudança.
- **Certificado**: PDF vigente ou revogado, com código único, ligado a uma pessoa inscrita.
- **Pedido da pessoa titular**: Pedido de acesso, correção ou exclusão, com data e situação.
- **Registro administrativo**: Autor, ação e data de uma operação restrita à administração.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Uma pessoa nova conclui a inscrição e vê o comprovante em menos de 3 minutos na primeira tentativa.
- **SC-002**: A administração encontra a inscrição nova na lista em até 1 minuto depois do envio.
- **SC-003**: A primeira apresentação de um código válido registra um check-in; a segunda apresentação do mesmo código não cria outro check-in.
- **SC-004**: Uma pessoa com inscrição confirmada localiza um material publicado e segue ao destino em menos de 1 minuto.
- **SC-005**: O laboratório exibe cinco desafios e conserva o andamento de cada um depois que a pessoa sai e volta.
- **SC-006**: A consulta de um código válido e a de um código desconhecido produzem respostas distintas em uma única etapa, sem exigir entrada no portal.
- **SC-007**: Inscrição, confirmação, check-in por texto, biblioteca, laboratório, download do certificado e consulta pública são concluíveis só com teclado e com rótulos em português.
- **SC-008**: Os mesmos fluxos de SC-007 são concluíveis em largura de celular e em largura de computador.

## Assumptions

- Há uma única formação neste escopo: Formação Docente 2027 do Centro Universitário CEUNI FAMETRO.
- O papel de administração reúne a equipe organizadora até que a instituição peça papéis internos separados. A lista de quem recebe esse papel é fornecida pela instituição e não é inventada aqui.
- A confirmação é uma ação humana da administração. O portal não confirma inscrição automaticamente.
- A pessoa participante volta à própria ficha por um vínculo enviado ao e-mail da inscrição. Esta spec não cria senha.
- O check-in exige conexão no momento da leitura. Operação sem conexão fica fora deste escopo.
- O portal não copia arquivos de material. A permissão de abertura dentro do Google Drive é definida no próprio destino, fora desta spec.
- O laboratório registra o andamento informado pela pessoa participante. Ele não atribui nota e não executa um produto de IA embutido. Concluir um desafio, por si só, não emite certificado.
- Carga horária, signatário, logotipo e manual de marca não entram no PDF enquanto a instituição não os entregar.
- Controlador, encarregado, base legal e prazo de retenção permanecem pendências nomeadas. Nenhum prazo foi estimado.
- Pagamento, lista de espera, várias turmas, fórum e emissão em massa fora do fluxo individual ficam fora deste escopo.
