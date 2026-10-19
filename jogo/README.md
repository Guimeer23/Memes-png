# Álbum de Figurinhas — área do jogo

Esta pasta é a área de trabalho organizada para a versão do jogo.

## Estado atual
- O HTML original deve ser colocado aqui como arquivo principal quando a versão correta for copiada para o repositório.
- As imagens existentes continuam em `/memes` na raiz do repositório; não mover nem renomear sem atualizar os caminhos usados pelo HTML.
- A pasta `/memes` é o catálogo de imagens, não o código do site.

## Estrutura planejada
- `frontend/`: futura separação de CSS e JavaScript do navegador, se o HTML único for dividido.
- `docs/`: documentação de sistemas, dados e decisões.
- `netlify/functions/`: funções de servidor para operações que precisem de validação confiável.
- `tests/`: testes para vendas, trocas, inventário e permissões.

## Segurança — importante
Esta estrutura, por si só, não torna o jogo seguro. Não marcar a segurança como concluída até revisar a autenticação, as regras do banco de dados e as operações de venda/troca. O cliente nunca deve ser a autoridade final sobre inventário, raridade, saldo ou conclusão de uma troca.

## Publicação
O Netlify só deve ser conectado a este repositório para produção depois que o HTML de entrada e os caminhos de imagens forem verificados. Não substituir a publicação atual antes de confirmar que a nova versão mantém o login Google e os dados existentes.
