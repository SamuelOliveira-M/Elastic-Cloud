# Elastic-Cloud - Serviço HTTP de busca de notas

Serviço Node.js/Express que conecta a aplicação de notas ao Elasticsearch. É complementar ao FrontNotas/CollabPad, desenvolvido em equipe. A contribuição individual informada por Samuel Oliveira é a implementação da busca com Elasticsearch; o histórico também contém contribuição de Ruan Lauro.

## Estrutura e tecnologias

- `src/index.js`: endpoints Express, CORS e APM opcional.
- `src/services/connectElastic.js`: cliente `@elastic/elasticsearch`.
- Índice atual: `my-index`; a criação e o mapping do índice não estão versionados.

## Endpoints existentes

| Método | Caminho | Comportamento |
| --- | --- | --- |
| POST | `/create` | Indexa nota por ID |
| GET | `/documents/:titulo?` | Busca aproximada no título ou lista documentos |
| DELETE | `/document/:id` | Remove documento |
| PUT | `/update/:id` | Atualiza campos do documento |

Os campos recebidos em criação/alteração são `id`, `titulo`, `conteudo`, `media`, `cor` e `favorito`; o índice usa `title`, `body`, `media`, `color`, `favorite` e `timestamp`. Não há validação formal de contrato nem autorização por usuário implementada.

## Execução local

Requer Node.js, npm e Elasticsearch isolado de desenvolvimento. Nunca usar chaves antigas publicadas no histórico.

```bash
npm ci
# Exporte as variáveis de .env.example no processo; o app não carrega .env sozinho.
npm start
```

O servidor usa porta fixa 3000 no código atual. A dependência é o cliente Elasticsearch 8.x; validar compatibilidade do cluster na instalação. Não foram executadas chamadas a um cluster nesta auditoria.

## Configuração e segurança

`ELASTICSEARCH_URL` e `ELASTICSEARCH_API_KEY` são obrigatórias no servidor. APM é opcional e usa `ELASTIC_APM_SERVER_URL`, `ELASTIC_APM_SECRET_TOKEN` e `ELASTIC_APM_SERVICE_NAME`.

Credenciais embutidas foram retiradas na proposta, mas permanecem no histórico Git. **Revogar/substituir as chaves Elasticsearch e APM na origem é a primeira ação necessária.** A auditoria não verificou se ainda estão válidas e não as utilizou.

Antes de uso público: autenticação e autorização de leitura/escrita, restrição de CORS, validação de IDs e corpos, limites/paginação, erro consistente e timeout. O POST de criação não possui tratamento de erro local e o PUT pode não responder quando a atualização é no-op. Não há testes automatizados ou CI próprios no snapshot original.

Não há benchmarks; não atribuir redução de latência ao projeto sem medição reproduzível.
