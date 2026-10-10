/**
 * Arquivo: lib/api/index.ts
 * Responsabilidade: exportação do cliente de API selecionando modo Mock ou Real via variável de ambiente.
 * Dados: VITE_USE_MOCK em .env
 * Como editar: configure VITE_USE_MOCK="false" no .env para apontar ao backend FastAPI local ou de produção.
 */

import { ApiClientInterface } from './types';
import { mockClient } from './mockClient';
import { realClient } from './client';

export { generateContactBriefing } from './client';

// Por padrão no preview de frontend, utiliza o mock para independência total
const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

export const api: ApiClientInterface = useMock ? mockClient : realClient;

export * from './types';
