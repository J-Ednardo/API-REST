import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import fs from 'fs';

const defaultYamlPath = path.resolve(__dirname, '..', 'docs', 'openapi.yaml');
const fallbackYamlPath = path.resolve(__dirname, '..', '..', 'src', 'docs', 'openapi.yaml');
const yamlPath = fs.existsSync(defaultYamlPath) ? defaultYamlPath : fallbackYamlPath;

// O arquivo yaml será lido
const swaggerDocument = YAML.load(yamlPath);

export { swaggerUi, swaggerDocument };
