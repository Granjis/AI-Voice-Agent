import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentEmbedding, GoogleGenAI } from '@google/genai';
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
  image: string | null;
  guidelines: string | null;
  features: any[];
  tags: any[];
  rating: number;
  in_stock: boolean;
  related_products: any[];
  interactions_count: number;
  created_at: string;
  updated_at: string;
  embedding?: number[]; // Optional field for embedding
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  

  

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;

      setProducts(data as Product[] || []);
  }
    catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  

  const incrementInteractions = async (productId: string) => {
    try {
      await supabase.rpc('increment_product_interactions', {
        product_uuid: productId
      });
      
      // Update local state
      setProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, interactions_count: product.interactions_count + 1 }
            : product
        )
      );
    } catch (err) {
      console.error('Error incrementing interactions:', err);
    }
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getProductDescriptionByName = (name: string) => {
    return products.find(product => product.name.toLowerCase() === name.toLowerCase());
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(product => product.category === categoryId);
  };

  const getRelatedProducts = (product: Product) => {
    if (!product.related_products?.length) return [];
    
    return product.related_products
      .map(id => products.find(p => p.id === id))
      .filter(Boolean) as Product[];
  };

  useEffect(() => {
    fetchProducts();


    // Espera 2 segundos antes de generar el embedding
 // espera a que termine
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    incrementInteractions,
    getProductById,
    getProductsByCategory,
    getRelatedProducts,
    getProductDescriptionByName,
  };
};