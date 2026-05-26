# Aurora Editorial

Aurora Editorial e o primeiro pacote de design do catalogo. Ele fica separado do painel dev para virar a referencia dos proximos modelos.

Contrato do renderer:

- renderizar capa, sumario, pagina inicial da colecao e paginas de produtos;
- usar a logomarca da empresa no badge da capa;
- receber o tipo de capa escolhido pela empresa, como `Nova Colecao`, `Novidades` ou `Descontos`;
- respeitar os toggles de campos visiveis do catalogo;
- renderizar SKU no canto da imagem do produto;
- renderizar cores do produto quando `colors` existir e `showVariations` estiver ativo;
- levar o clique do sumario para a primeira pagina da colecao;
- levar o clique no badge da colecao de volta para o sumario.

Arquivos:

- `AuroraRenderer.tsx`: componentes e regras visuais do modelo.
- `assets.ts`: imagens fixas do pacote de design.
- `tokens.ts`: cores e deteccao do template Aurora.
- `types.ts`: contrato publico usado pelo painel dev e pela pagina de renderizacao.

Os proximos designs devem seguir o mesmo contrato, mas podem ter seus proprios assets, tokens e componentes visuais.
