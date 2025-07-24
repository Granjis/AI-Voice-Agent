import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, ShoppingCart, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/hooks/useProducts';

const AdminDashboard = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const { products, loading: productsLoading } = useProducts();

  // Redirect if not authenticated or not an admin
  if (!user || userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  
  if (!authLoading && (!user || false)) {
    return <Navigate to="/" replace />;
  }

  if (authLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  // Calculate analytics
  const totalProducts = products.length;
  const totalInteractions = products.reduce((sum, product) => sum + product.interactions_count, 0);
  const averageInteractions = totalProducts > 0 ? Math.round(totalInteractions / totalProducts) : 0;
  const outOfStockProducts = products.filter(product => !product.in_stock).length;

  // Get most visited products
  const mostVisitedProducts = [...products]
    .sort((a, b) => b.interactions_count - a.interactions_count)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of product analytics and performance</p>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {outOfStockProducts} out of stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInteractions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageInteractions}</div>
              <p className="text-xs text-muted-foreground">
                Per product
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(products.map(p => p.category)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Product categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Most Visited Products */}
        <Card>
          <CardHeader>
            <CardTitle>Most Visited Products</CardTitle>
            <p className="text-sm text-muted-foreground">
              Products ranked by number of views and interactions
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mostVisitedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>

                  {/* Product Image */}
                  <div className="w-16 h-16 bg-card rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {product.category.replace('-', ' ')}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Interactions */}
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {product.interactions_count}
                    </div>
                    <div className="text-sm text-muted-foreground">views</div>
                  </div>

                  {/* Stock Status */}
                  <div className="flex-shrink-0">
                    <Badge variant={product.in_stock ? "default" : "destructive"}>
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;