# Organização do frontend — v1.30.16

## Abas HTML
Cada aba principal tem um arquivo HTML próprio, carregado por `js/load-tabs.js`:
- `tabs/album.html` — álbum e coleção.
- `tabs/loja.html` — loja e pacotes.
- `tabs/trocas.html` — mercado, vendas e mesas de troca.
- `tabs/perfil.html` — perfil e conquistas.
- `tabs/amigos.html` — amizades.
- `tabs/ranking.html` — classificação e busca de jogadores.

## JavaScript
`js/album.js` é o orquestrador e carrega os módulos abaixo em ordem. Não reordenar sem testar dependências.

- `js/modules/00-core-and-album-state.js` — estado compartilhado, catálogo e funções-base.
- `js/modules/01-navigation-and-radial-tabs.js` — navegação e menu circular.
- `js/modules/02-album-actions.js` — ações da coleção e colagem.
- `js/modules/03-visual-effects.js` — efeitos visuais e animações.
- `js/modules/04-missions-and-daily-bonus.js` — missões e bônus diário.
- `js/modules/05-pricing.js` — preços de referência.
- `js/modules/06-card-view-and-animations.js` — visualização e animações de cartas.
- `js/modules/07-packs-and-opening.js` — pacotes e abertura.
- `js/modules/08-coin-shop.js` — loja de moedas simulada.
- `js/modules/09-pack-effects.js` — efeitos da abertura de pacotes.
- `js/modules/10-auth-and-cloud-save.js` — Firebase, login e sincronização.
- `js/modules/11-trades-and-market.js` — vendas, mercado e trocas.
- `js/modules/12-secrets-and-profile.js` — cartas secretas e perfil.
- `js/modules/13-friends-and-ranking.js` — amigos, busca e ranking.
- `js/modules/14-settings-and-navigation-ui.js` — configurações e interface.

## CSS
Por enquanto, `css/album.css` permanece compartilhado. Dividi-lo por aba exige mapear os seletores comuns para evitar regressões.

## Cuidados
A ordem do JavaScript foi preservada mecanicamente para manter as dependências. A versão é de desenvolvimento: antes de publicar, testar login Google, imagens, navegação, virada de páginas, pacotes, loja, mercado, perfil, amigos e ranking.
