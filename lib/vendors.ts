// Vendor abstraction layer for multiple construction material suppliers

export interface Product {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  brand?: string;
  rating?: number;
  reviews?: number;
  image?: string;
  url?: string;
  vendor: string;
  vendorLogo?: string;
  deliveryOptions?: string[];
  storeAvailability?: boolean;
  storeLocation?: string;
  inStock?: boolean;
  unit?: string;
  weight?: string;
  dimensions?: string;
}

export interface SearchParams {
  query: string;
  location?: string;
  zipCode?: string;
  sortBy?: 'price_low_to_high' | 'price_high_to_low' | 'rating' | 'relevance';
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: Product[];
  totalResults?: number;
  vendor: string;
  error?: string;
}

// Base vendor interface
export interface Vendor {
  name: string;
  logo: string;
  baseUrl: string;
  searchProducts(params: SearchParams): Promise<SearchResult>;
  getProductDetails(productId: string): Promise<Product | null>;
  isAvailable(): boolean;
}

// Home Depot implementation
export class HomeDepotVendor implements Vendor {
  name = 'Home Depot';
  logo = '/vendors/home-depot-logo.png';
  baseUrl = 'https://www.homedepot.com';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchProducts(params: SearchParams): Promise<SearchResult> {
    try {
      // You'll need to add your API key to environment variables
      const apiKey = process.env.NEXT_PUBLIC_SERPAPI_KEY || process.env.SERPAPI_KEY;
      
      console.log('Home Depot API Key available:', !!apiKey);
      
      if (!apiKey) {
        throw new Error('SerpAPI key not found. Please add NEXT_PUBLIC_SERPAPI_KEY to your environment variables.');
      }

      const searchParams = new URLSearchParams({
        engine: 'home_depot',
        api_key: apiKey,
        q: params.query,
        country: 'us',
        output: 'json',
        ...(params.sortBy && { hd_sort: this.mapSortBy(params.sortBy) }),
        ...(params.zipCode && { delivery_zip: params.zipCode }),
        ...(params.minPrice && { lowerbound: params.minPrice.toString() }),
        ...(params.maxPrice && { upperbound: params.maxPrice.toString() }),
        ...(params.page && { page: params.page.toString() }),
        ps: '24',
      });

      console.log('Home Depot API URL:', `https://serpapi.com/search?${searchParams.toString().replace(apiKey, '***')}`);

      const response = await fetch(`https://serpapi.com/search?${searchParams.toString()}`);
      
      console.log('Home Depot API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Home Depot API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('Home Depot API response data:', {
        productsCount: data.products?.length || 0,
        totalResults: data.search_information?.total_results,
        error: data.error
      });
      
      // Extract products from the response
      const products: Product[] = (data.products || []).map((product: any) => ({
        id: product.product_id || '',
        title: product.title || '',
        price: product.price || '',
        brand: product.brand,
        rating: product.rating,
        reviews: product.reviews,
        image: product.thumbnail,
        url: product.link,
        vendor: this.name,
        vendorLogo: this.logo,
        deliveryOptions: product.delivery_options,
        storeAvailability: product.store_availability,
        inStock: true,
      }));

      return {
        products,
        totalResults: data.search_information?.total_results,
        vendor: this.name,
      };
    } catch (error) {
      console.error('Home Depot search error:', error);
      return {
        products: [],
        vendor: this.name,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getProductDetails(productId: string): Promise<Product | null> {
    // Implementation for getting detailed product info
    return null;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  private mapSortBy(sortBy: string): string {
    switch (sortBy) {
      case 'price_low_to_high': return 'price_low_to_high';
      case 'price_high_to_low': return 'price_high_to_low';
      case 'rating': return 'top_rated';
      default: return 'best_match';
    }
  }
}

// Lowe's implementation (placeholder for future integration)
export class LowesVendor implements Vendor {
  name = 'Lowe\'s';
  logo = '/vendors/lowes-logo.png';
  baseUrl = 'https://www.lowes.com';
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async searchProducts(params: SearchParams): Promise<SearchResult> {
    // TODO: Implement Lowe's API integration
    // This would use Lowe's API or web scraping
    return {
      products: [],
      vendor: this.name,
      error: 'Lowe\'s integration coming soon',
    };
  }

  async getProductDetails(productId: string): Promise<Product | null> {
    return null;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }
}

// Menards implementation (placeholder for future integration)
export class MenardsVendor implements Vendor {
  name = 'Menards';
  logo = '/vendors/menards-logo.png';
  baseUrl = 'https://www.menards.com';
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async searchProducts(params: SearchParams): Promise<SearchResult> {
    // TODO: Implement Menards API integration
    return {
      products: [],
      vendor: this.name,
      error: 'Menards integration coming soon',
    };
  }

  async getProductDetails(productId: string): Promise<Product | null> {
    return null;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }
}

// Local supplier implementation (placeholder for future integration)
export class LocalSupplierVendor implements Vendor {
  name = 'Local Suppliers';
  logo = '/vendors/local-supplier-logo.png';
  baseUrl = '';
  private suppliers: any[];

  constructor(suppliers: any[] = []) {
    this.suppliers = suppliers;
  }

  async searchProducts(params: SearchParams): Promise<SearchResult> {
    // TODO: Implement local supplier integration
    // This could connect to local supplier databases or APIs
    return {
      products: [],
      vendor: this.name,
      error: 'Local supplier integration coming soon',
    };
  }

  async getProductDetails(productId: string): Promise<Product | null> {
    return null;
  }

  isAvailable(): boolean {
    return this.suppliers.length > 0;
  }
}

// Vendor manager to handle multiple vendors
export class VendorManager {
  private vendors: Map<string, Vendor> = new Map();

  constructor() {
    console.log('Initializing VendorManager...');
    
    // Initialize with available vendors
    const homeDepotKey = process.env.NEXT_PUBLIC_SERPAPI_KEY;
    console.log('Home Depot API Key found:', !!homeDepotKey);
    
    if (homeDepotKey) {
      this.addVendor('home-depot', new HomeDepotVendor(homeDepotKey));
      console.log('Home Depot vendor added');
    } else {
      console.log('No Home Depot API key found');
    }

    console.log('Available vendors:', Array.from(this.vendors.keys()));

    // Add other vendors as they become available
    // this.addVendor('lowes', new LowesVendor(process.env.LOWES_API_KEY));
    // this.addVendor('menards', new MenardsVendor(process.env.MENARDS_API_KEY));
    // this.addVendor('local', new LocalSupplierVendor());
  }

  addVendor(id: string, vendor: Vendor): void {
    this.vendors.set(id, vendor);
  }

  getVendor(id: string): Vendor | undefined {
    return this.vendors.get(id);
  }

  getAvailableVendors(): Vendor[] {
    return Array.from(this.vendors.values()).filter(vendor => vendor.isAvailable());
  }

  async searchAllVendors(params: SearchParams): Promise<SearchResult[]> {
    const results: Promise<SearchResult>[] = [];
    
    for (const vendor of this.getAvailableVendors()) {
      results.push(vendor.searchProducts(params));
    }

    return Promise.all(results);
  }

  async searchSpecificVendors(vendorIds: string[], params: SearchParams): Promise<SearchResult[]> {
    console.log('Searching specific vendors:', vendorIds);
    console.log('Search params:', params);
    
    const results: Promise<SearchResult>[] = [];
    
    for (const id of vendorIds) {
      const vendor = this.getVendor(id);
      console.log(`Vendor ${id} found:`, !!vendor);
      if (vendor && vendor.isAvailable()) {
        console.log(`Vendor ${id} is available, searching...`);
        results.push(vendor.searchProducts(params));
      } else {
        console.log(`Vendor ${id} not available`);
      }
    }

    console.log('Number of vendor searches to perform:', results.length);
    const searchResults = await Promise.all(results);
    console.log('Search results received:', searchResults);
    
    return searchResults;
  }
}

// Material search mappings for different vendors
export const materialSearchMappings = {
  concrete: {
    'home-depot': 'concrete mix',
    'lowes': 'concrete mix',
    'menards': 'concrete mix',
    'local': 'concrete',
  },
  steel: {
    'home-depot': 'steel rebar',
    'lowes': 'steel rebar',
    'menards': 'steel rebar',
    'local': 'steel',
  },
  cement: {
    'home-depot': 'cement',
    'lowes': 'cement',
    'menards': 'cement',
    'local': 'cement',
  },
  wood: {
    'home-depot': 'lumber wood',
    'lowes': 'lumber wood',
    'menards': 'lumber wood',
    'local': 'lumber',
  },
  brick: {
    'home-depot': 'brick masonry',
    'lowes': 'brick masonry',
    'menards': 'brick masonry',
    'local': 'brick',
  },
  glass: {
    'home-depot': 'glass window',
    'lowes': 'glass window',
    'menards': 'glass window',
    'local': 'glass',
  },
};

// Helper function to get search query for a specific vendor and material
export function getSearchQuery(materialType: string, vendorId: string): string {
  const mappings = materialSearchMappings[materialType as keyof typeof materialSearchMappings];
  return mappings?.[vendorId as keyof typeof mappings] || materialType;
} 