// Home Depot API service for construction materials

export interface HomeDepotProduct {
  title: string;
  price: string;
  product_id: string;
  rating?: number;
  reviews?: number;
  brand?: string;
  delivery_options?: string[];
  store_availability?: boolean;
  image?: string;
  url?: string;
}

export interface HomeDepotSearchParams {
  q: string;
  country?: 'us' | 'ca';
  hd_sort?: 'price_low_to_high' | 'price_high_to_low' | 'top_rated' | 'best_match';
  delivery_zip?: string;
  lowerbound?: number;
  upperbound?: number;
  page?: number;
  ps?: number;
}

export interface HomeDepotSearchResponse {
  products: HomeDepotProduct[];
  total_results?: number;
  error?: string;
}

// Map our material types to Home Depot search terms
export const materialSearchTerms = {
  concrete: 'concrete mix',
  steel: 'steel rebar',
  cement: 'cement',
  wood: 'lumber wood',
  brick: 'brick masonry',
  glass: 'glass window',
};

export async function searchHomeDepotProducts(
  params: HomeDepotSearchParams
): Promise<HomeDepotSearchResponse> {
  try {
    // You'll need to add your API key to environment variables
    const apiKey = process.env.NEXT_PUBLIC_SERPAPI_KEY || process.env.SERPAPI_KEY;
    
    if (!apiKey) {
      throw new Error('SerpAPI key not found. Please add NEXT_PUBLIC_SERPAPI_KEY to your environment variables.');
    }

    const searchParams = new URLSearchParams({
      engine: 'home_depot',
      api_key: apiKey,
      q: params.q,
      country: params.country || 'us',
      output: 'json',
      ...(params.hd_sort && { hd_sort: params.hd_sort }),
      ...(params.delivery_zip && { delivery_zip: params.delivery_zip }),
      ...(params.lowerbound && { lowerbound: params.lowerbound.toString() }),
      ...(params.upperbound && { upperbound: params.upperbound.toString() }),
      ...(params.page && { page: params.page.toString() }),
      ...(params.ps && { ps: params.ps.toString() }),
    });

    const response = await fetch(`https://serpapi.com/search?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract products from the response
    const products: HomeDepotProduct[] = data.products?.map((product: any) => ({
      title: product.title || '',
      price: product.price || '',
      product_id: product.product_id || '',
      rating: product.rating,
      reviews: product.reviews,
      brand: product.brand,
      delivery_options: product.delivery_options,
      store_availability: product.store_availability,
      image: product.thumbnail,
      url: product.link,
    })) || [];

    return {
      products,
      total_results: data.search_information?.total_results,
    };
  } catch (error) {
    console.error('Error fetching Home Depot products:', error);
    return {
      products: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Helper function to search for specific material types
export async function searchConstructionMaterial(
  materialType: string,
  location?: string,
  sortBy: 'price_low_to_high' | 'price_high_to_low' | 'top_rated' = 'price_low_to_high'
): Promise<HomeDepotSearchResponse> {
  const searchTerm = materialSearchTerms[materialType as keyof typeof materialSearchTerms] || materialType;
  
  return searchHomeDepotProducts({
    q: searchTerm,
    hd_sort: sortBy,
    delivery_zip: location,
    ps: 24, // Get maximum results per page
  });
} 