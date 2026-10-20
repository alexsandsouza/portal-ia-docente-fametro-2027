<!--
Sync Impact Report
- Version change: (nenhuma) → 1.0.0
- Princípios: ratificação inicial (I a X)
- Seções adicionadas: Core Principles, Restrições de plataforma, Qualidade e conformidade, Governance
- Seções removidas: nenhuma
- TODOs adiados: controlador e encarregado da LGPD, base legal, prazo de retenção, elegibilidade, perfis administrativos, conteúdo dos cinco desafios, regra de presença, modelo e signatário do certificado, pastas do Google Drive
- Este comentário é registro da ratificação inicial e pode ser removido antes do primeiro commit.
-->

# Constituição do Portal IA Docente FAMETRO 2027

## Core Principles

### I. Especificação antes do código

Nenhuma funcionalidade entra em implementação sem spec, esclarecimento das ambiguidades relevantes, plano e tarefas, nessa ordem. O comportamento observável permanece na spec. A escolha de biblioteca, estrutura interna e detalhe de implantação permanece no plano. Implementação fora desse fluxo é incompatível com esta constituição.

### II. Idioma

Documentos de negócio, interface, mensagens ao usuário e texto do certificado são escritos em português brasileiro. Identificadores de código, nomes de arquivos técnicos, mensagens de commit e termos de framework permanecem em inglês.

### III. Plataforma decidida

O portal usa Next.js com App Router, TypeScript, Tailwind CSS, Supabase e Vercel. Os arquivos de material permanecem no Google Drive; o portal guarda metadados e links. O certificado é um PDF com código único de autenticidade. O check-in usa QR Code opaco. Troca de qualquer um desses elementos exige emenda desta constituição.

### IV. Código verificável

O TypeScript opera em modo estrito. Entrada de usuário é validada no servidor antes de alterar estado. Server Components são o padrão; Client Components existem somente onde há interação no navegador. Segredos, chaves e URLs com credencial ficam fora do repositório e fora dos documentos de spec.

### V. Acessibilidade

A meta de conformidade é WCAG 2.2 nível AA. Os fluxos principais são operáveis por teclado, com rótulos, contraste e foco visível. QR Code e certificado oferecem caminho equivalente em texto. Correção de barreira que impeça a conclusão de inscrição, check-in ou obtenção do certificado tem prioridade sobre ampliação funcional.

### VI. LGPD por minimização

O portal trata somente dados necessários à Formação Docente 2027. Controlador, encarregado, base legal e prazo de retenção só entram na spec depois de confirmação institucional explícita. Até lá, a spec marca esses itens como pendentes e não os preenche por inferência. A pessoa titular tem caminho de acesso, correção e exclusão no desenho fechado pela spec. Dado sensível só é coletado quando a instituição registrar a necessidade e a base correspondente. Supabase, Vercel e Google são suboperadores previstos; a existência de contrato ou DPA não é presumida.

### VII. Segurança por padrão

Participante e administração são papéis distintos. Toda ação administrativa é autorizada no servidor. Tabelas no Supabase usam Row Level Security. O QR Code não contém dado pessoal em claro. O código de autenticidade do certificado tem entropia suficiente para não ser adivinhado por enumeração. A consulta pública de autenticidade devolve apenas o mínimo necessário para confirmar a validade. Inscrição, check-in e consulta de certificado limitam tentativas automatizadas.

### VIII. Testes nos fluxos críticos

Cada história cuja falha impeça inscrição, confirmação, check-in, emissão ou verificação de certificado, ou uma ação administrativa, nasce com teste automatizado na fase de tarefas. O teste descreve o comportamento da spec. Ausência de teste nesses fluxos impede considerar a história concluída.

### IX. Versionamento rastreável

O histórico do projeto usa Git, com branch principal protegida e Conventional Commits. Cada incremento funcional ocupa uma pasta de feature do Spec Kit. Reescrita de histórico publicado e force push na branch principal são incompatíveis com esta constituição. Enquanto o Git não estiver instalado no ambiente, nenhuma release é declarada.

### X. Documentação viva

Esta constituição é a referência estável. A visão do produto e os requisitos preliminares alimentam o Specify e não substituem a spec. Decisão irreversível de arquitetura, dado pessoal ou emissão de certificado gera um ADR. README técnico só descreve código que já existe no repositório.

## Restrições de plataforma

- A aplicação web é responsiva e atende viewport de celular e de computador.
- Materiais didáticos não são copiados para o repositório nem para o armazenamento primário do portal.
- O painel administrativo é uma superfície separada da superfície do participante.
- Endereço de produção, projeto Supabase, projeto Vercel, logotipo e manual de marca não são inventados. Entram na spec somente quando a instituição ou o responsável técnico os fornecer.
- Credenciais não aparecem em documento, código de exemplo commitado ou fixture.

## Qualidade e conformidade

- O fluxo de produção de cada capacidade segue Constitution, Specify, Clarify, Plan, Checklist, Tasks, Analyze, Implement e Converge.
- Clarify é obrigatório quando a spec ainda contiver pendência que altere regra de participação, dado pessoal ou emissão de certificado.
- Analyze é obrigatório antes de Implement. Conflito entre spec, plano e tarefas é corrigido na origem.
- A interface em português brasileiro é critério de aceite funcional, não um ajuste posterior.
- Pendência institucional permanece nomeada. Preencher pendência com regra plausível é defeito de especificação.

## Governance

Esta constituição prevalece sobre conveniência de implementação, modelo de agente e atalho de prazo. Spec, plano, tarefas e código são revisados contra estes princípios antes de serem considerados prontos.

Emendas seguem versionamento semântico:

- MAJOR: remoção ou redefinição incompatível de um princípio.
- MINOR: novo princípio ou expansão material de uma seção.
- PATCH: esclarecimento, correção de redação ou ajuste sem mudança de regra.

Toda emenda registra a data em `Last Amended`, preserva `Ratified` como a data da adoção inicial e descreve o motivo no histórico de commit. A ratificação ou a emenda exige aprovação explícita de quem responde pelo produto. Data institucional desconhecida permanece como pendência e não é estimada.

Compliance esperada em cada revisão:

- A mudança aponta para a spec que a autoriza.
- Dado pessoal novo tem finalidade e pendência de base legal visíveis.
- Fluxo crítico alterado tem teste correspondente previsto ou implementado.
- Nenhum segredo foi introduzido.

**Version**: 1.0.0 | **Ratified**: 2026-10-19 | **Last Amended**: 2026-10-19
