'use client';

import {useState, useEffect} from 'react';
import {analyzeProductImage} from '@/ai/flows/analyze-product-image';
import { ProductInfoSchema } from '@/types/types';
import Image from 'next/image';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [products, setProducts] = useState<Array<ProductInfoSchema> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requestTime, setRequestTime] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      // Create preview URL for thumbnail
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Add cleanup function for preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const analyzeImage = async () => {
    if (!image) {
      alert('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setProducts(null);
    setRequestTime(null);

    try {
      const startTime = performance.now();
      const base64 = await convertImageToBase64(image);
      console.log('Base64:', base64);
      const result = await analyzeProductImage({photoUrl: base64});
      const endTime = performance.now();
      
      setRequestTime(endTime - startTime);
      setProducts(result.products);
      console.log('Products:', result.products);
      console.log(`Request took ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <div className='min-w-1/2 min-h-1/2 bg-violet-800 rounded-lg shadow-md p-4'>
        <h1 className='font-bold text-2xl'>Analisar produto</h1>
        
        <div className="flex flex-col items-center gap-4">
          {previewUrl && (
            <div className="w-48 h-48 relative mb-4 ">
              <Image 
                src={previewUrl}
                alt="Preview"
                width={0}
                height={0}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          )}
          
          <input 
            className='bg-[#f5f5f5] rounded-xl p-2 w-full overflow-x-hidden text-gray-600' 
            type="file" 
            accept='image/*' 
            onChange={handleImageUpload} 
          />
          
          <button 
            className='bg-green-600 p-2 rounded-xl font-bold w-full'
            onClick={analyzeImage}
            disabled={!image}
          >
            Analisar
          </button>
        </div>

        {requestTime && (
          <div className='text-sm text-gray-200 mt-2 flex justify-between w-full'>
            <p className="">
              Tempo de análise: {(requestTime / 1000).toFixed(2)} segundos
            </p>
            <p className="">
              Quantidade de produtos: {products ? products.length : 0}
            </p>
          </div>
        )}
      </div>
      {products && products.length > 0 && (
            <div className='w-full rounded-xl p-4 flex flex-col gap-2'>
              <h2 className="text-xl font-semibold">Produtos:</h2>
              {products.map((product, index) => (
                <div key={index} className="text-center border w-full rounded-xl text-white">
                  {/* {product.imageUrl && (
                    <div className="w-full h-48 relative mb-4">
                      <Image 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="object-contain w-full h-full rounded-t-xl"
                      />
                    </div>
                  )} */}
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p>Descrição: {product.description}</p>
                  <p>{formatBRL(product.defaultPrice)}</p>
                  <p>Referência: {product.reference}</p>
                  <p>NCM: {product.reference}</p>
                  <p>Tags:</p>
                  <div className='bg-gray-600 flex flex-col gap-1'>
                    {product.tags.map((tag, index) => (
                      <span key={index}>{tag.name.toUpperCase()}</span>
                    ))}
                  </div>
                  <p>Variações:</p>
                  <div className='bg-gray-600 flex flex-col gap-2'>
                    {product.variation.map((variation, index) => (
                      <span key={index}>{variation.name.toUpperCase()} - {formatBRL(variation.price)}</span>
                    ))}
                  </div>
                  <p>Unidade: {product.unit.toUpperCase()== 'UNIDADE' ? 'UN' : product.unit}</p>
                  <p>Aliquota ICMS: {product.aliquotaIcms}</p>
                  <p>CST ICMS: {product.cstIcms}</p>
                  <p>Aliquota PIS: {product.aliquotaPis}</p>
                  <p>CST PIS: {product.cstPis}</p>
                  <p>Aliquota COFINS: {product.aliquotaCofins}</p>
                  <p>CST COFINS: {product.cstCofins}</p>
                  <p>Aliquota IPI: {product.aliquotaIpi}</p>
                  <p>CSOSN: {product.csosn}</p>
                  <p>Origem: {product.origem}</p>
                  <p>Índice de Redução da Base de Cálculo: {product.idxReducaoBaseCalculo}</p>
                  <p>Código de Benefício Fiscal: {product.codBeneficioFiscal}</p>
                  <p>Código Especificador de Substituição Tributária (CEST): {product.codEspecificadorSubstTribCest}</p>
                  <p>CFOP: {product.cfop}</p>
                  <p>Margem de Valor Agregado: {product.margemValorAgregado}</p>
                </div>
              ))}
            </div>
      )}
      {isLoading ? (
        <div className="flex items-center justify-center">
          <p className="mr-2 h-4 w-4">
            Analyzing...
          </p>
        </div>
        ) : null
      }
    </div>
  );
}
