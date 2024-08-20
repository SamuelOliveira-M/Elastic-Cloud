import express from 'express'
import { client } from './services/connectElastic.js';
import apm from 'elastic-apm-node';


apm.start({
    serviceName: 'my-service-name',
    secretToken: '63shgTdgar7UpMBOVP',
    serverUrl: 'https://37a2118835f74dfc918dc5c17c6379ee.apm.us-central1.gcp.cloud.es.io:443',
    environment: 'my-environment'
  })

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    await client.index({
        index: 'my-index',
        document: {
            title: 'My Document',
            body: 'This is the content of the document',
            timestamp: new Date()
        }
    });
    res.send('Holla');
});


app.get('/test', async (req, res) => {
    try {
        const result = await client.search({
            index: 'my-index',
            body: { // O corpo da requisição vai aqui
                query: {
                    match: { hello: 'world' }
                }
            }
        });
        res.send(result.hits.hits);
    } catch (error) {
        console.error('Erro ao buscar no Elasticsearch:', error);
        res.status(500).send('Erro ao buscar no Elasticsearch');
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
