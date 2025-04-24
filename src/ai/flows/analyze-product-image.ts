'use server';

/**
 * @fileOverview Analyzes a product image to extract a list of product names, taxes and their suggested prices using structured output.
 *
 * - analyzeProductImage - A function that handles the product image analysis process.
 * - AnalyzeProductImageInput - The input type for the analyzeProductImage function.
 * - AnalyzeProductImageOutput - The return type for the analyzeProductImage function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzeProductImageInputSchema = z.object({
  photoUrl: z.string().describe('The URL of the product photo containing multiple products.'),
});
export type AnalyzeProductImageInput = z.infer<typeof AnalyzeProductImageInputSchema>;

const TagSchema = z.object({
  name: z.string().describe('The name of the tag.'),
});

const VariationSchema = z.object({
  name: z.string().describe('The name of the variation.'),
  price: z.number().describe('The price of the variation.'),
});

const ProductInfoSchema = z.object({
  name: z.string().describe('The name of the product.'),
  defaultPrice: z.number().describe('The default price of the product.'),
  description: z.string().describe('A detailed description of the product.'),
  reference: z.string().describe('The product reference code or ID.'),
  ncm: z.string().describe('The NCM (Mercosur Common Nomenclature) code for the product.'),
  tags: z.array(TagSchema).describe('An array of suggested tags for the product.'),
  variation: z.array(VariationSchema).describe('An array of suggested variations for the product.'),
  unit: z.string().describe('The unit of measurement for the product.'),
  aliquotaIcms: z.number().describe('ICMS (Tax on Circulation of Goods and Services) tax rate.'),
  cstIcms: z.string().describe('ICMS Tax Situation Code.'),
  aliquotaPis: z.number().describe('PIS (Social Integration Program) tax rate.'),
  cstPis: z.string().describe('PIS Tax Situation Code.'),
  aliquotaCofins: z.number().describe('COFINS (Contribution to Social Security Financing) tax rate.'),
  cstCofins: z.string().describe('COFINS Tax Situation Code.'),
  aliquotaIpi: z.number().describe('IPI (Tax on Industrialized Products) tax rate.'),
  csosn: z.string().describe('Tax Situation Code for Simples Nacional.'),
  origem: z.string().describe('Origin.'),
  idxReducaoBaseCalculo: z.number().describe('Reduction Base Calculation Index.'),
  codBeneficioFiscal: z.string().describe('Tax Benefit Code.'),
  codEspecificadorSubstTribCest: z.string().describe('CEST Code (Tax Substitution Specification Code).'),
  cfop: z.string().describe('Fiscal Operations Code.'),
  margemValorAgregado: z.number().describe('Added Value Margin.'),
});

const AnalyzeProductImageOutputSchema = z.object({
  products: z.array(ProductInfoSchema)
    .describe('A list of products identified in the image, with their names, taxes and suggested prices.'),
});
export type AnalyzeProductImageOutput = z.infer<typeof AnalyzeProductImageOutputSchema>;

const extractProductInfo = ai.defineTool(
  {
    name: 'extractProductInfo',
    description: 'Extracts the product name, taxes and suggested price from the product image.',
    inputSchema: z.object({
      photoUrl: z.string().describe('The URL of the product photo.'),
    }),
    outputSchema: z.array(ProductInfoSchema),
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async input => {
    // This tool's implementation is now handled by the prompt.
    return [];
  }
);

export async function analyzeProductImage(input: AnalyzeProductImageInput): Promise<AnalyzeProductImageOutput> {
  return analyzeProductImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeProductImagePrompt',
  tools: [extractProductInfo],
  input: {
    schema: z.object({
      photoUrl: z.string().describe('The URL of the product photo.'),
    }),
  },
  output: {
    schema: z.object({
      products: z.array(ProductInfoSchema)
        .describe('A list of products identified in the image, with their names, taxes and suggested prices.'),
    }),
  },
  prompt: `
  Execute cada um dos passos separadamente:
  1. Analisar imagem enviada pelo usuario:
  2. Contabilizar total de produtos na imagem:
  3. Para cada produto, sugerir as seguintes informações:
  - Nome de produto.
  - Descricão resumida das caracteriscas do produto.
  - Preço.
  - Identificador numerico para referência  sistema de vendas.
  - Nomenclatura Comum do Mercosul (NCM) para o produto.
  - 3 tags referentes a caracteristicas do produto.
  - 3 variações para o produto.
  - Unidade de medida para fins de tributação. Exemplo: UN, KG, LT.
  4. Baseado nas descrições do produto, sugira informações tributarias que remetem ao produto, caso contrario, usar valor 0:
  - Aliquotas em porcentagem dos impostos ICMS, PIS, COFINS e IPI para venda no modelo Simples Nacional.
  - Código de Situação Tributaria (CST) ICSM, PIS, e COFINS.
  - Código Especificador da Substituição Tributária (CEST).
  - Código Fiscal de Operações e Prestações (CFOP).
  - código de origem usado para indicar onde um produto foi comprado.
  - percentual da redução da base de cálculo do ICMS.
  - Margem de Valor Agregado (MVA).

  Observe que, a lingua usada deve ser PT-BR ;

  Photo: {{media url=photoUrl}}
  `,
});

const analyzeProductImageFlow = ai.defineFlow<
  typeof AnalyzeProductImageInputSchema,
  typeof AnalyzeProductImageOutputSchema
>({
  name: 'analyzeProductImageFlow',
  inputSchema: AnalyzeProductImageInputSchema,
  outputSchema: AnalyzeProductImageOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
