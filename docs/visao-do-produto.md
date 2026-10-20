# Visão do produto — Portal IA Docente FAMETRO 2027

## Identificação

| Campo | Valor |
| --- | --- |
| Produto | Portal IA Docente FAMETRO 2027 |
| Instituição | Centro Universitário CEUNI FAMETRO |
| Contexto | Formação Docente 2027 |
| Natureza | Portal web responsivo |
| Estado | Visão preliminar, anterior à especificação formal |
| Idioma da experiência | Português brasileiro |

Este documento descreve o propósito do portal. Ele não substitui a especificação de cada funcionalidade, que será produzida no fluxo Specify do Spec Kit.

## Problema

A Formação Docente 2027 precisa de um canal único em que a pessoa participante se inscreva, confirme a participação, faça check-in, consulte materiais, percorra um laboratório de IA e receba um certificado verificável. A equipe organizadora precisa operar esses mesmos registros em um painel administrativo.

## Objetivo

Construir um portal web responsivo que cubra o ciclo da formação, da inscrição à emissão do certificado, com materiais hospedados no Google Drive e com prova de autenticidade do certificado.

## Pessoas envolvidas

- **Participante:** pessoa que se inscreve, acessa o portal, realiza o laboratório e pode receber certificado. O critério de elegibilidade ainda depende de confirmação institucional.
- **Equipe organizadora:** opera inscrições, check-in, registro de participação e certificados. A composição dessa equipe e os limites de cada permissão ainda dependem de confirmação institucional.
- **Administração do portal:** perfil com acesso ao painel. Quem recebe esse perfil ainda depende de confirmação institucional.

## Capacidades

1. Inscrição na Formação Docente 2027.
2. Confirmação da inscrição.
3. Check-in por QR Code.
4. Biblioteca de materiais armazenados no Google Drive.
5. Laboratório de IA com cinco desafios.
6. Registro de participação.
7. Painel administrativo.
8. Certificado em PDF com código único de autenticidade.

## Experiência esperada

O portal funciona em tela de celular e em tela de computador. A interface, as mensagens e os documentos de negócio ficam em português brasileiro. A meta de acessibilidade é WCAG 2.2 nível AA, incluindo um caminho em texto equivalente ao QR Code e ao certificado.

## Resultado esperado

Uma pessoa autorizada consegue concluir a inscrição, receber confirmação, fazer check-in, abrir os materiais, registrar o percurso no laboratório e obter um certificado cuja autenticidade possa ser conferida pelo código único. A equipe autorizada consegue acompanhar e operar esses registros no painel.

## Restrições já decididas

- Metodologia: Spec-Driven Development, no fluxo do GitHub Spec Kit.
- Aplicação: Next.js com App Router, TypeScript e Tailwind CSS.
- Dados e autenticação: Supabase.
- Publicação: Vercel.
- Arquivos de material: permanecem no Google Drive. O portal guarda metadados e links.
- Certificado: PDF com código único de autenticidade.

Endereço de produção, credenciais, logotipo, identidade visual institucional, carga horária, signatário do certificado e regras acadêmicas não estão definidos neste documento.

## Fora desta etapa

Esta visão não autoriza a criação do aplicativo, a instalação de dependências do Next.js, a configuração do Supabase ou da Vercel, nem o uso de segredos.

## Pendências institucionais

As decisões abaixo permanecem em aberto e não devem ser presumidas nas especificações:

- Quem pode se inscrever e como a identidade é verificada.
- Quem administra o portal e quais ações cada perfil pode executar.
- Conteúdo, ordem e critério de conclusão dos cinco desafios.
- Regra de presença e relação entre check-in, laboratório e certificado.
- Modelo, signatário e dados impressos no certificado.
- Pastas do Google Drive, visibilidade dos arquivos e forma de compartilhamento.
- Controlador, encarregado, base legal e prazo de retenção previstos na LGPD.
