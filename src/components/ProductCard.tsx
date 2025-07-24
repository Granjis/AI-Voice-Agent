
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { incrementInteractions } = useProducts();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      addToCart(product.id, 1);
    }
  };

  const handleCardClick = () => {
    // Increment interactions when the card is clicked
    incrementInteractions(product.id);
  };

  return (
    <Link to={`/product/${product.id}`} onClick={handleCardClick}>
      <Card className="group h-full flex flex-col overflow-hidden border border-border bg-card/60 backdrop-blur-sm hover:bg-card/70 hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer">
        <CardHeader className="p-0">
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-6 flex-1">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </div>
              <Badge variant={product.in_stock ? "default" : "destructive"} className="flex-shrink-0">
                {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
            
            <p className="text-muted-foreground text-sm line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {product.category.replace('-', ' ')}
                </Badge>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  ${product.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4 mt-auto">
          {user ? (
            <Button 
              onClick={handleAddToCart}
              className="w-full group-hover:bg-primary/90 transition-colors"
              disabled={!product.in_stock}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          ) : (
            <Button variant="outline" className="w-full">
              Sign in to purchase
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};
