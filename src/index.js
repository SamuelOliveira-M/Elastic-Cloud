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
        titulo,
        conteudo,
        media,
        cor,
        favorito,
     } = req.body;
    console.log('oi')
    const sucess = await client.index({
        index: 'my-index',
        
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


app.get('/documents/:titulo', async (req, res) => {
    
    const titulo = req.params

    if(query){
        try {
            const result = await client.search({
                index: 'my-index',
                body: {
                    query: {
                        match: {
                            title: {
                                query: titulo, // Substitua pelo termo de pesquisa desejado
                                fuzziness: "AUTO" // Permite buscas aproximadas
                            }
                        }
                    }
                },
                size: 1000 // Limite o número de documentos retornados (ajuste conforme necessário)
            });
        
            if (result.hits.hits.length > 0) {
                const documents = result.hits.hits.map(hit => hit._source); // Extrai o conteúdo dos documentos
                res.json(documents); // Retorna os documentos encontrados como JSON
            } else {
                res.send('Nenhum documento encontrado');
            }
        } catch (error) {
            console.error('Erro ao buscar os documentos:', error);
            res.status(500).send('Erro ao buscar os documentos');
        }
    }
    try {
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
            const documents = result.hits.hits.map(hit => hit._source); // Extrai o conteúdo dos documentos
            res.json(documents); // Retorna os documentos encontrados como JSON
        } else {
            res.send('Nenhum documento encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar os documentos:', error);
        res.status(500).send('Erro ao buscar os documentos');
    }
});

app.delete('/document/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await client.delete({
            index: 'my-index',
            id: id
        });

        if (result.result === 'deleted') {
            res.send(`Documento com ID ${id} foi deletado com sucesso`);
        } else {
            res.status(404).send(`Documento com ID ${id} não encontrado`);
        }
    } catch (error) {
        console.error('Erro ao deletar o documento:', error);
        res.status(500).send('Erro ao deletar o documento');
    }
});




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
