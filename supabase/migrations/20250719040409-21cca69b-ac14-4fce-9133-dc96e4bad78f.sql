
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'buyer');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'buyer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create products table with interaction tracking
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image TEXT,
  guidelines TEXT,
  features JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  rating DECIMAL(3,2) DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  related_products JSONB DEFAULT '[]',
  interactions_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table for persistent cart
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for cart_items
CREATE POLICY "Users can manage own cart items" ON public.cart_items
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all cart items" ON public.cart_items
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  -- Assign buyer role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'buyer');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert existing products into database
INSERT INTO public.products (name, category, price, description, image, guidelines, features, tags, rating, in_stock, related_products) VALUES
('HoloDisplay Pro 8K', 'home-electronics', 3499.00, 'Ultra-thin holographic display for immersive home entertainment', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop', 'Requires 5G connection for optimal performance. Wall mounting recommended.', '["8K holographic projection", "Gesture control", "Voice activation", "Wireless streaming"]', '["display", "entertainment", "holographic", "premium"]', 4.9, true, '["2", "3"]'),

('Quantum Sound System', 'home-electronics', 1299.00, 'Spatial audio system with quantum acoustic processing', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=600&fit=crop', 'Optimal performance in rooms 200-500 sq ft. Calibration required.', '["360-degree spatial audio", "Quantum processing", "Adaptive acoustics", "Multi-room sync"]', '["audio", "quantum", "spatial", "premium"]', 4.7, true, '["1", "4"]'),

('ClimateSync Controller', 'home-electronics', 899.00, 'AI-powered climate control system with predictive optimization', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop', 'Compatible with most HVAC systems. Professional installation recommended.', '["Predictive climate control", "Energy optimization", "Air quality monitoring", "Smart scheduling"]', '["climate", "ai", "energy", "smart"]', 4.6, true, '["1", "2"]'),

('MindDesk Interface', 'office-tech', 2799.00, 'Neural-responsive desk with adaptive workspace optimization', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', 'Requires initial neural calibration. Software updates included.', '["Neural responsiveness", "Adaptive height", "Wireless charging surface", "Biometric security"]', '["desk", "neural", "workspace", "premium"]', 4.8, true, '["5", "6"]'),

('AirProject Pro', 'office-tech', 1899.00, 'Holographic projection system for immersive presentations', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop', 'Requires clear 10ft projection space. Remote collaboration ready.', '["Holographic projection", "Multi-user interaction", "Cloud integration", "Real-time collaboration"]', '["projection", "holographic", "collaboration", "enterprise"]', 4.5, true, '["4", "7"]'),

('ErgoChair Quantum', 'office-tech', 1299.00, 'Self-adjusting ergonomic chair with posture optimization', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', 'Automatic posture adjustment. Health monitoring included.', '["Posture optimization", "Health monitoring", "Adaptive comfort", "Stress detection"]', '["ergonomic", "health", "adaptive", "premium"]', 4.7, false, '["4", "5"]'),

('SolarShade Pavilion', 'outdoor-living', 4999.00, 'Smart solar pavilion with climate control and energy generation', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop', 'Weather-resistant design. Installation requires 15x15ft space.', '["Solar energy generation", "Climate control", "Weather adaptation", "Wireless connectivity"]', '["solar", "pavilion", "outdoor", "sustainable"]', 4.9, true, '["8", "9"]'),

('AquaGrow System', 'outdoor-living', 2199.00, 'Automated hydroponic garden with AI plant optimization', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop', 'Requires water and power connection. Includes starter plants.', '["AI plant optimization", "Automated watering", "Nutrient management", "Harvest prediction"]', '["hydroponic", "ai", "gardening", "sustainable"]', 4.6, true, '["7", "10"]'),

('WeatherShield Dome', 'outdoor-living', 3299.00, 'Transparent weather protection dome for outdoor spaces', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop', 'UV protection included. Wind resistance up to 80mph.', '["Weather protection", "UV filtering", "Temperature regulation", "Retractable design"]', '["weather", "protection", "outdoor", "premium"]', 4.4, true, '["7", "8"]'),

('AdaptTable Surface', 'smart-furniture', 1799.00, 'Morphing table surface that adapts to any activity', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', 'Shape-memory material. Requires initial setup calibration.', '["Morphing surface", "Activity detection", "Wireless charging", "Touch interface"]', '["adaptive", "surface", "smart", "premium"]', 4.8, true, '["11", "12"]'),

('LevitaBed Zero-G', 'smart-furniture', 5999.00, 'Magnetic levitation bed with zero-gravity sleep experience', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop', 'Requires specialized installation. Sleep quality monitoring included.', '["Magnetic levitation", "Zero-gravity positioning", "Sleep optimization", "Health monitoring"]', '["bed", "levitation", "sleep", "premium"]', 4.9, false, '["10", "13"]'),

('IntelliStorage Unit', 'smart-furniture', 999.00, 'AI-organized storage system with predictive item placement', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', 'Item tagging system included. Learns usage patterns over time.', '["AI organization", "Predictive placement", "Inventory tracking", "Access optimization"]', '["storage", "ai", "organization", "smart"]', 4.5, true, '["10", "11"]');

-- Function to increment product interactions
CREATE OR REPLACE FUNCTION public.increment_product_interactions(product_uuid UUID)
RETURNS VOID
LANGUAGE SQL
AS $$
  UPDATE public.products 
  SET interactions_count = interactions_count + 1,
      updated_at = now()
  WHERE id = product_uuid;
$$;
