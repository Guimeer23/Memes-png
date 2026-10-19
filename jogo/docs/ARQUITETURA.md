# Arquitetura do álbum

## Componentes
1. Interface do navegador: exibe o álbum e envia solicitações.
2. Autenticação: login Google existente; deve ser mantido e verificado após mudanças.
3. Banco de dados: revisar regras e estrutura atuais antes de alterar qualquer dado.
4. Operações confiáveis: vendas, trocas e alterações de inventário devem ser validadas por código de servidor com autenticação e autorização.

## Regras de segurança necessárias
- Nunca confiar em raridade, quantidade, saldo ou propriedade informados pelo navegador.
- Validar no servidor a identidade do usuário e a propriedade de cada figurinha.
- Usar transações atômicas para vendas e trocas, impedindo duplicação e uso duplo.
- Aplicar regras de acesso mínimas no banco de dados.
- Não colocar chaves privadas, segredos ou credenciais administrativas no HTML/JavaScript público.
- Registrar erros úteis sem expor dados sensíveis.
- Testar com duas contas e casos de falha antes de publicar.

## Status
Planejado, ainda não auditado. Não declarar “segurança total”; segurança precisa ser verificada por camadas e pode ser melhorada, não garantida absolutamente.
