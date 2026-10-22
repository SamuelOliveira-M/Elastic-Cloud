import { Client } from '@elastic/elasticsearch';

const node = process.env.ELASTICSEARCH_URL;
const apiKey = process.env.ELASTICSEARCH_API_KEY;
if (!node || !apiKey) {
  throw new Error('Configure ELASTICSEARCH_URL e ELASTICSEARCH_API_KEY no ambiente do servidor');
}
export const client = new Client({ node, auth: { apiKey } });
