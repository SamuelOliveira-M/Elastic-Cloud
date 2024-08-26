import express from 'express'
import { client } from './services/connectElastic.js';
import apm from 'elastic-apm-node';
import cors from 'cors';

apm.start({
    serviceName: 'my-service-name',
    secretToken: '63shgTdgar7UpMBOVP',
    serverUrl: 'https://37a2118835f74dfc918dc5c17c6379ee.apm.us-central1.gcp.cloud.es.io:443',
    environment: 'my-environment'
  })

const app = express();
app.use(cors());

app.options('*', cors());

const port = 3000;

app.use(express.json());

app.post('/create', async (req, res) => {
    const {
        id, 
        titulo,
        conteudo,
        media,
        cor,
        favorito,
     } = req.body;
    
    const sucess = await client.index({
        index: 'my-index',
        id:id,
        body: {
            title: titulo,
            body: conteudo,
            media: media,
            color: cor,
            favorite: favorito,
            timestamp: new Date()
        }
    });

    console.log(sucess)
    res.send('ok')
});


app.get('/documents/:titulo?', async (req, res) => {
    
    const {titulo} = req.params;
    console.log(titulo);
    
    try {
        if (titulo) {
            const result = await client.search({
                index: 'my-index',
                body: {
                    query: {
                        match: {
                            title: {
                                query: titulo,
                                fuzziness: "AUTO" // Permite buscas aproximadas
                            }
                        }
                    }
                },
                size: 1000 // Limite o número de documentos retornados (ajuste conforme necessário)
            });
        
            if (result.hits.hits.length > 0) {
                const documents = result.hits.hits.map(hit => ({
                    id: hit._id, // Inclui o ID do documento
                    ...hit._source // Inclui o conteúdo do documento
                }));
                res.json(documents); // Retorna os documentos encontrados como JSON
            } else {
                res.send('Nenhum documento encontrado');
            }
        } else {
            const result = await client.search({
                index: 'my-index',
                body: {
                    query: {
                        match_all: {} // Busca todos os documentos no índice
                    }
                },
                size: 1000 // Limite o número de documentos retornados (ajuste conforme necessário)
            });

            if (result.hits.hits.length > 0) {
                const documents = result.hits.hits.map(hit => ({
                    id: hit._id, // Inclui o ID do documento
                    ...hit._source // Inclui o conteúdo do documento
                }));
                res.json(documents); // Retorna os documentos encontrados como JSON
            } else {
                res.send('Nenhum documento encontrado');
            }
        }
    } catch (error) {
        console.error('Erro ao buscar os documentos:', error);
        res.status(500).send('Erro ao buscar os documentos');
    }
});


app.delete('/document/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const response = await client.delete({
        index: 'my-index', // Certifique-se de substituir pelo nome correto do índice
        id: id,
      });
  
      console.log('Documento deletado:', response);
      res.send('Documento deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar o documento:', error);
      res.status(500).send('Erro ao deletar o documento');
    }
});
  



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
