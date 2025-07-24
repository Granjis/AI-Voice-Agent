
import { useState, useRef, useEffect} from 'react';
import { Search, ShoppingCart, LogIn, LogOut, User, Bot, BotOff } from 'lucide-react';
import logo from '@/assets/logo.png';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/hooks/useCart';
import { useProducts, Product } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { GdmLiveAudio} from '@/hooks/useVoiceAgent';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { getCartItemsCount } = useCart();
  const { products, loading } = useProducts();
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  const asistenteVoz = useRef<GdmLiveAudio | null>(null);
    useEffect(() => {
      asistenteVoz.current = new GdmLiveAudio(); // se crea solo una vez
    }, []);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewDetails = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const categories = [
    { id: 'smartphones', name: 'Smartphones' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'audio', name: 'Audio' },
    { id: 'laptops', name: 'Laptops' }
  ];

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(product => product.category === categoryId);
  };

  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
        asistenteVoz.current.live();
    
      toast.success("AI assistant activated");
    } else {
      setIsListening(false);
      asistenteVoz.current.stopRecording();
      toast.info("AI assistant deactivated");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="FutureMarket" className="w-8 h-8" />
              <h1 className="text-2xl font-bold text-foreground">FutureMarket</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products or say 'Hey AI'..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="pl-10 neon-card" 
                />
              </div>
              
              {user && (
                <>
                  <Badge variant={userRole === 'admin' ? 'default' : 'secondary'} className="capitalize">
                    {userRole || 'buyer'}
                  </Badge>
                  
                  <Button 
                    variant="outline" 
                    className="neon-card relative" 
                    onClick={() => navigate('/cart')}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                    {getCartItemsCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getCartItemsCount()}
                      </span>
                    )}
                  </Button>
                </>
              )}

              {user ? (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/dashboard')} 
                    className="text-sm"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={signOut} 
                    className="text-sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="default" 
                  onClick={() => navigate('/auth')} 
                  className="text-sm"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-3xl font-bold text-foreground">Try our AI Assistant</h2>
            <Button
              onClick={toggleListening}
              size="lg"
              className={`rounded-full w-12 h-12 shadow-lg transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isListening ? (
                <BotOff className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : searchQuery ? (
          // Search Results
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Search Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your search.</p>
              </div>
            )}
          </div>
        ) : (
          // Category Rows
          <div className="space-y-12">
            {categories.map(category => {
              const categoryProducts = getProductsByCategory(category.id);
              if (categoryProducts.length === 0) return null;
              
              return (
                <div key={category.id} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-foreground">{category.name}</h3>
                    <span className="text-sm text-muted-foreground">{categoryProducts.length} products</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
