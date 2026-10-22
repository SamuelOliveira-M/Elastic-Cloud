import express from 'express'
import { client } from './services/connectElastic.js';
import apm from 'elastic-apm-node';
import cors from 'cors';

if (process.env.ELASTIC_APM_SERVER_URL && process.env.ELASTIC_APM_SECRET_TOKEN) {
  apm.start({
    serviceName: process.env.ELASTIC_APM_SERVICE_NAME || 'notes-search',
    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    environment: process.env.NODE_ENV || 'development'
  });
}

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
                size: 1000 // Limite o nÃƒÂºmero de documentos retornados (ajuste conforme necessÃƒÂ¡rio)
            });
        
            if (result.hits.hits.length > 0) {
                const documents = result.hits.hits.map(hit => ({
                    id: hit._id, // Inclui o ID do documento
                    ...hit._source // Inclui o conteÃƒÂºdo do documento
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
                        match_all: {} // Busca todos os documentos no ÃƒÂ­ndice
                    }
                },
                size: 1000 // Limite o nÃƒÂºmero de documentos retornados (ajuste conforme necessÃƒÂ¡rio)
            });

            if (result.hits.hits.length > 0) {
                const documents = result.hits.hits.map(hit => ({
                    id: hit._id, // Inclui o ID do documento
                    ...hit._source // Inclui o conteÃƒÂºdo do documento
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
        index: 'my-index', // Certifique-se de substituir pelo nome correto do ÃƒÂ­ndice
        id: id,
      });
      
      console.log('Documento deletado:', response);
      res.send('Documento deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar o documento:', error);
      res.status(500).send('Erro ao deletar o documento');
    }
});
  
app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const {
      titulo,
      conteudo,
      media,
      cor,
      favorito,
    } = req.body;
  
    try {
      const { _source: existingDocument } = await client.get({
        index: 'my-index',
        id: id
      });
  
      const updatedFields = {
        title: titulo || existingDocument.title,
        body: conteudo || existingDocument.body,
        media: media || existingDocument.media,
        color: cor || existingDocument.color,
        favorite: favorito !== undefined ? favorito : existingDocument.favorite,
        timestamp: existingDocument.timestamp 
      };
  
      const response = await client.update({
        index: 'my-index',
        id: id,
        body: {
          doc: updatedFields
        }
      });
     
      if(response.result === "updated"){
        res.send('Documento atualizado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao atualizar o documento:', error);
      res.status(500).send('Erro ao atualizar o documento');
    }
  });
  


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
