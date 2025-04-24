export type ProductInfoSchema = {
  name: string;
  defaultPrice: number;
  description: string;
  reference: string;
  ncm: string;
  tags: TagSchema[];
  variation: VariationSchema[];
  unit: string;
  aliquotaIcms: number;
  cstIcms: string;
  aliquotaPis: number;
  cstPis: string;
  aliquotaCofins: number;
  cstCofins: string;
  aliquotaIpi: number;
  csosn: string;
  origem: string;
  idxReducaoBaseCalculo: number;
  codBeneficioFiscal: string;
  codEspecificadorSubstTribCest: string;
  cfop: string;
  margemValorAgregado: number;
};

type TagSchema = {
  name: string;
};

type VariationSchema = {
  name: string;
  price: number
};