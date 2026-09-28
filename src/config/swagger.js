import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

// O arquivo yaml será lido
const swaggerDocument = YAML.load(path.resolve(__dirname, '..', 'docs', 'openapi.yaml'));

export { swaggerUi, swaggerDocument };
