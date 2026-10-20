# Contract: consulta pública do certificado

## `GET /certificados/{code}`

Não exige sessão.

Código vigente:

- informa que o certificado é autêntico;
- mostra o nome da formação, Formação Docente 2027;
- mostra o nome da instituição, Centro Universitário CEUNI FAMETRO;
- mostra a data de emissão;
- não mostra e-mail, documento de identificação nem outros participantes.

Código inexistente:

- informa que não há certificado correspondente;
- não revela se existe código parecido;
- não mostra dados de participantes.

Depois de 5 códigos inválidos na mesma janela, a consulta fica recusada por 15 minutos, com a mesma discrição.

O código na rota é o código de autenticidade do PDF, não o código de check-in.
