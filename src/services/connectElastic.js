import { Client } from '@elastic/elasticsearch';


export const client = new Client({
  node: 'https://7393c51721ad49bb86a80f9e8fb2f9e3.us-central1.gcp.cloud.es.io:443',
  auth: {
    apiKey:
      {
        "id": "q_wWcZEBTm6HSBj70yEq",
        "name": "connect",
        "api_key": "_xx5l4fzTPC-29ULd-hkUQ",
        "encoded": "cV93V2NaRUJUbTZIU0JqNzB5RXE6X3h4NWw0ZnpUUEMtMjlVTGQtaGtVUQ==",
        "beats_logstash_format": "q_wWcZEBTm6HSBj70yEq:_xx5l4fzTPC-29ULd-hkUQ"
      }
  }
});
