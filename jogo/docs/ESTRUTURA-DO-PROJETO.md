# Estrutura do projeto — v1.30.15

## Arquivos usados pelo site

- `index.html`: entrada principal servida pelo Netlify.
- `css/album.css`: estilos carregados pelo HTML principal.
- `js/album.js`: lógica principal do álbum.
- `memes/`: imagens e GIFs das figurinhas. Manter os nomes e caminhos existentes até atualizar e testar todas as referências.

## Pasta `jogo/`

Esta pasta reúne materiais de desenvolvimento e não substitui a entrada do site na raiz.

- `README.md`: visão geral da área de desenvolvimento.
- `docs/`: arquitetura, decisões e documentação.
- `tests/`: roteiros e testes do projeto.
- `netlify/functions/`: espaço reservado para funções de servidor do Netlify.
- `frontend/`: espaço reservado para uma futura separação do frontend, caso seja feita com atualização dos caminhos e testes.
- `legacy/`: versões antigas do HTML que não são a entrada atual do site.

## Regras de manutenção

1. O `index.html` da raiz é a entrada atual do site nesta versão.
2. Não mover CSS, JavaScript ou imagens sem atualizar as referências e testar a página.
3. Não editar a cópia em `jogo/legacy/` como se fosse o arquivo principal.
4. Antes de publicar mudanças, verificar login Google, carregamento das figurinhas e leitura/gravação do progresso.
5. A presença de uma pasta de testes ou de funções de servidor não significa que os testes foram executados nem que as operações estejam seguras.
6. Esta organização não altera os dados dos jogadores nem configura serviços de backend.
