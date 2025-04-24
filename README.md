# PriceWise AI

Sistema de análise automatizada de produtos através de processamento de imagens utilizando Inteligência Artificial.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Google AI](https://img.shields.io/badge/Google%20AI-Gemini%202.0-green)](https://ai.google.dev/)

## Visão Geral

O PriceWise AI é uma solução empresarial que utiliza a API Google Gemini para realizar análise automática de imagens de produtos, extraindo informações essenciais para gestão comercial e fiscal, incluindo:

- Identificação e descrição do produto
- Precificação e variações
- Códigos e classificações fiscais (NCM, CFOP, CST)
- Alíquotas tributárias (ICMS, PIS, COFINS, IPI)
- Categorização e etiquetagem

## Requisitos do Sistema

### Requisitos Técnicos
- Node.js (versão 18 ou superior)
- NPM (Node Package Manager) ou Yarn
- Credenciais da API Google AI

### Configuração do Ambiente

1. Clonagem do repositório:
```bash
git clone https://github.com/sua-organizacao/price-wise-ai.git
cd price-wise-ai
```

2. Instalação de dependências:
```bash
npm install
```

3. Configuração das variáveis de ambiente:
```bash
cp .env.example .env
```

4. Configuração da chave API:
```env
GOOGLE_GENAI_API_KEY=sua_chave_api
```

5. Inicialização do servidor:
```bash
npm run dev
```

## Especificação Técnica

### Estrutura de Dados de Retorno

```typescript
interface ProductAnalysis {
  name: string;                // Denominação do produto
  defaultPrice: number;        // Valor base
  description: string;         // Descrição técnica
  reference: string;          // Código de referência
  ncm: string;               // Nomenclatura Comum do Mercosul
  tags: Array<{
    name: string;            // Classificação do produto
  }>;
  variations: Array<{
    name: string;            // Identificação da variação
    price: number;           // Valor específico
  }>;
  aliquotaIcms: number;      // Percentual ICMS
  cstIcms: string;          // Código Situação Tributária ICMS
}
```

## Arquitetura Tecnológica

- **Frontend**: Next.js 14 com TypeScript
- **Processamento de IA**: Google Gemini 2.0
- **Validação de Dados**: Zod
- **Utilitários**: Genkit

## Licenciamento

Este software está licenciado sob MIT License. Consulte o arquivo [LICENSE](LICENSE) para informações detalhadas.

## Contribuições

Para contribuir com o desenvolvimento:

1. Realize um fork do repositório
2. Crie uma branch para sua implementação (`git checkout -b feature/implementacao`)
3. Realize o commit das alterações (`git commit -m 'Implementação: descrição'`)
4. Envie para o repositório (`git push origin feature/implementacao`)
5. Submeta um Pull Request

## Suporte

Para reportar problemas ou sugerir melhorias, utilize o sistema de [issues](https://github.com/sua-organizacao/price-wise-ai/issues).

---

Desenvolvido e mantido com tecnologia [Google Gemini AI](https://ai.google.dev/)