# Requisitos preliminares — Portal IA Docente FAMETRO 2027

## Estado deste documento

Estes requisitos são preliminares. Eles registram o que já foi pedido e separam o que ainda depende de decisão institucional. A especificação formal de cada capacidade será produzida no fluxo Specify e Clarify do Spec Kit.

Nenhum endereço de produção, credencial, logotipo, carga horária, signatário ou regra acadêmica é definido aqui.

## Atores

| Ator | O que se sabe | O que permanece pendente |
| --- | --- | --- |
| Participante | Usa inscrição, confirmação, check-in, materiais, laboratório e certificado | Critério de elegibilidade e forma de identificação |
| Equipe organizadora | Opera os registros da formação | Composição da equipe e limites de cada ação |
| Administração | Acessa o painel administrativo | Quem recebe o perfil e qual é o escopo exato |

## Requisitos funcionais

### RF-01 — Inscrição

A pessoa participante informa os dados necessários para se inscrever na Formação Docente 2027 e recebe um comprovante de que a inscrição foi registrada.

- Resultado observável: existe um registro de inscrição associado à pessoa e um retorno claro de sucesso ou de falha.
- Pendências: campos obrigatórios, elegibilidade, prazo de inscrição e tratamento de inscrição duplicada.

### RF-02 — Confirmação

A inscrição passa a um estado confirmado quando a regra institucional de confirmação é atendida. A pessoa participante consegue perceber se a inscrição está pendente ou confirmada.

- Resultado observável: a inscrição tem um estado de confirmação visível para a pessoa participante e para a equipe autorizada.
- Pendências: quem confirma, se a confirmação é automática ou manual, e quais mensagens são enviadas.

### RF-03 — Check-in por QR Code

No momento da formação, a participação presencial é registrada pela leitura de um QR Code individual. O código não expõe dados pessoais em claro.

- Resultado observável: a leitura válida de um QR Code registra o check-in uma vez e recusa código inválido, expirado ou já utilizado quando a regra assim o exigir.
- Pendências: quem realiza a leitura, se o check-in pode ocorrer fora de linha, a janela de validade e a política de nova emissão do código.

### RF-04 — Biblioteca de materiais

O portal lista os materiais da formação e conduz a pessoa participante aos arquivos correspondentes no Google Drive. Os arquivos permanecem no Drive.

- Resultado observável: cada material publicado aparece com título, descrição e destino no Drive, e só é acessível a quem a regra de acesso permitir.
- Pendências: identificadores das pastas, visibilidade dos arquivos, responsável pela publicação e se o acesso exige conta Google.

### RF-05 — Laboratório de IA

O portal apresenta cinco desafios de IA. A pessoa participante percorre os desafios e o portal registra o andamento de cada um.

- Resultado observável: existem exatamente cinco desafios, cada um com enunciado e um registro de andamento por participante.
- Pendências: enunciado, ordem, materiais de apoio, critério de conclusão e se a equipe pode revisar a entrega.

### RF-06 — Registro de participação

O portal reúne os eventos que comprovam a participação, incluindo confirmação, check-in e andamento do laboratório, de forma que a equipe autorizada consulte o histórico de cada pessoa.

- Resultado observável: a ficha da pessoa participante mostra os registros existentes e a data de cada um.
- Pendências: quais eventos contam como participação e se algum deles é condição para o certificado.

### RF-07 — Painel administrativo

A pessoa com perfil administrativo consulta e opera inscrições, confirmações, check-in, materiais, desafios, participação e certificados. A pessoa participante não acessa esse painel.

- Resultado observável: cada ação administrativa fica restrita ao perfil autorizado e produz um registro consultável.
- Pendências: lista fechada de ações, necessidade de mais de um perfil interno e trilha de auditoria exigida pela instituição.

### RF-08 — Certificado em PDF

Ao cumprir a regra institucional ainda não definida, a pessoa participante obtém um certificado em PDF com um código único de autenticidade. Uma consulta posterior confirma se aquele código corresponde a um certificado emitido, sem expor dados além dos necessários para a verificação.

- Resultado observável: cada certificado emitido tem um código único, o PDF pode ser baixado por quem tem direito, e a consulta pública informa apenas a validade e os dados mínimos autorizados.
- Pendências: condição de emissão, dados impressos, signatário, modelo visual, prazo de disponibilidade e procedimento de anulação.

## Requisitos não funcionais

### RNF-01 — Responsividade

O portal é utilizável em viewport de celular e de computador, com os mesmos fluxos principais disponíveis nos dois contextos.

### RNF-02 — Acessibilidade

A meta é WCAG 2.2 nível AA. Todo fluxo operado por QR Code ou por PDF também oferece um caminho em texto.

### RNF-03 — LGPD

O portal coleta somente dados necessários à Formação Docente 2027. Controlador, encarregado, base legal e prazo de retenção serão inseridos na especificação depois da confirmação institucional. A pessoa titular terá caminho para acesso, correção e exclusão, no desenho que a spec fechar.

### RNF-04 — Segurança

Autorização é verificada no servidor. Dados no Supabase ficam sob Row Level Security. Segredos não entram no repositório. Inscrição, leitura de QR Code e consulta de certificado resistem a tentativa automatizada de varredura.

### RNF-05 — Idioma

Interface, mensagens de erro, certificado e documentos de negócio ficam em português brasileiro.

### RNF-06 — Rastreabilidade

Cada requisito funcional desta lista será rastreado até uma spec, um plano e um conjunto de tarefas antes da implementação.

## Critérios de aceite desta etapa documental

- A visão, estes requisitos e a constituição existem no repositório documental.
- Nenhuma pendência institucional foi preenchida por suposição.
- Nenhuma funcionalidade do portal foi implementada nesta etapa.
