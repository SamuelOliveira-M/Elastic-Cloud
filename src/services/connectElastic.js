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


//  const client = new Client({
//   cloud: {
//     id: 'f20b625e7e6142fdab5b08af2c59cd91:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJDczOTNjNTE3MjFhZDQ5YmI4NmE4MGY5ZThmYjJmOWUzJDNkNDg2NmMxMDc2NzRkZjVhODJkMzRhYTZlZTdmZGVm'
//   },
//   auth: {
//     username: 'elastic',
//     password: 'Som@201309'
//   }
// })


// const { Client } = require('@elastic/elasticsearch')
// const client = new Client({
//   cloud: { id: '<cloud-id>' },
//   auth: { apiKey: 'base64EncodedKey' }
// })

// {
//   "id": "3fwtbJEBTm6HSBj7SiCa",
//   "name": "connect",
//   "api_key": "WaI6pVjQRAyydKXBAeP9Ig",
//   "encoded": "M2Z3dGJKRUJUbTZIU0JqN1NpQ2E6V2FJNnBWalFSQXl5ZEtYQkFlUDlJZw==",
//   "beats_logstash_format": "3fwtbJEBTm6HSBj7SiCa:WaI6pVjQRAyydKXBAeP9Ig"
// }