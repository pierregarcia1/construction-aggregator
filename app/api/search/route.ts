import { NextRequest, NextResponse } from 'next/server';
import { VendorManager, getSearchQuery } from '../../../lib/vendors';

export async function GET(request: NextRequest) {
  console.log('=== SEARCH API ROUTE CALLED ===');
  
  try {
    const { searchParams } = new URL(request.url);
    
    const materialType = searchParams.get('material');
    const location = searchParams.get('location');
    const sortBy = searchParams.get('sortBy') as 'price_low_to_high' | 'price_high_to_low' | 'rating' | 'relevance' || 'price_low_to_high';
    const vendors = searchParams.get('vendors')?.split(',') || ['home-depot'];

    console.log('Search request:', { materialType, location, sortBy, vendors });

    if (!materialType) {
      console.log('No material type provided');
      return NextResponse.json(
        { error: 'Material type is required' },
        { status: 400 }
      );
    }

    // Extract ZIP code from location if provided
    let zipCode: string | undefined;
    if (location) {
      const zipMatch = location.match(/\b\d{5}\b/);
      zipCode = zipMatch ? zipMatch[0] : undefined;
    }

    console.log('Extracted ZIP code:', zipCode);

    // Test if we can create the vendor manager
    console.log('Creating VendorManager...');
    const vendorManager = new VendorManager();
    console.log('VendorManager created successfully');
    
    // Get search query for the material type
    const searchQuery = getSearchQuery(materialType, vendors[0]);
    console.log('Search query:', searchQuery);
    
    // Search specific vendors
    const vendorSearchParams = {
      query: searchQuery,
      location,
      zipCode,
      sortBy,
    };

    console.log('Vendor search params:', vendorSearchParams);

    console.log('Calling searchSpecificVendors...');
    const results = await vendorManager.searchSpecificVendors(vendors, vendorSearchParams);
    console.log('Search results received:', results);
    
    // Combine all results
    const allProducts = results.flatMap(result => result.products);
    const errors = results.filter(result => result.error).map(result => result.error);
    
    console.log('All products:', allProducts.length);
    console.log('Errors:', errors);
    
    // Sort combined results by price if requested
    if (sortBy === 'price_low_to_high') {
      allProducts.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'price_high_to_low') {
      allProducts.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
        return priceB - priceA;
      });
    } else if (sortBy === 'rating') {
      allProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const response = {
      products: allProducts,
      totalResults: allProducts.length,
      vendors: results.map(r => r.vendor),
      errors: errors.length > 0 ? errors : undefined,
    };

    console.log('Sending response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 