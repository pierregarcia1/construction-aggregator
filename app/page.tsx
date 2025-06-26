'use client';

import { useState } from "react";
import { Search, MapPin, Calculator, Truck, Star, Phone, Mail, Loader2, AlertCircle, Store } from 'lucide-react';
import { Product } from '../lib/vendors';

// Sample data for demonstration
const materials = [
  {id :'concrete', name: 'concrete', unit: 'cubic yard', icon: '🏗️'},
  {id: 'steel', name: 'steel', unit: 'ton', icon: '🔩'},
  {id: 'cement', name: 'cement', unit: 'bag', icon: '🏭'},
  {id: 'wood', name: 'wood', unit: 'board foot', icon: '🪵'},
  {id: 'brick', name: 'brick', unit: 'piece', icon: '🧱'},
  {id: 'glass', name: 'glass', unit: 'square foot', icon: '🪟'},
];

// Available vendors
const availableVendors = [
  { id: 'home-depot', name: 'Home Depot', logo: '🏠', available: true },
  { id: 'lowes', name: 'Lowe\'s', logo: '🔨', available: false, comingSoon: true },
  { id: 'menards', name: 'Menards', logo: '🏪', available: false, comingSoon: true },
  { id: 'local', name: 'Local Suppliers', logo: '🏘️', available: false, comingSoon: true },
];

export default function Home() {
  const [selectedMaterial, setSelectedMaterial] = useState('concrete');
  const [quantity, setQuantity] = useState(5);
  const [quantityInput, setQuantityInput] = useState('5');
  const [location, setLocation] = useState('Dallas, TX');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'price_low_to_high' | 'price_high_to_low' | 'rating' | 'relevance'>('price_low_to_high');
  const [selectedVendors, setSelectedVendors] = useState<string[]>(['home-depot']);
  const [searchVendors, setSearchVendors] = useState<string[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowResults(false);

    console.log('Starting search with:', {
      selectedMaterial,
      quantity,
      location,
      sortBy,
      selectedVendors
    });

    try {
      const vendorParam = selectedVendors.join(',');
      const searchUrl = `/api/search?material=${selectedMaterial}&location=${encodeURIComponent(location)}&sortBy=${sortBy}&vendors=${vendorParam}`;
      
      console.log('Making request to:', searchUrl);
      
      const response = await fetch(searchUrl);
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('Response data:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }

      setProducts(data.products || []);
      setSearchVendors(data.vendors || []);
      setShowResults(true);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  const selectedMaterialData = materials.find(m => m.id === selectedMaterial);

  // Helper function to extract price as number
  const extractPrice = (priceString: string): number => {
    const match = priceString.match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
  };

  // Helper function to format price
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleVendorToggle = (vendorId: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow digits
    if (!/^\d*$/.test(value)) {
      return;
    }
    
    // Remove leading zeros
    const cleanValue = value.replace(/^0+/, '') || '0';
    
    setQuantityInput(cleanValue);
    setQuantity(parseInt(cleanValue) || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Construction Price Aggregator</h1>
                <p className="text-sm text-gray-600">Compare prices, save money</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Materials</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Suppliers</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find the Best Prices for Construction Materials
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare real-time prices from multiple suppliers in your area. 
            Save time and money on your construction projects.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Material Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {materials.map((material) => (
                    <button
                      key={material.id}
                      type="button"
                      onClick={() => setSelectedMaterial(material.id)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        selectedMaterial === material.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{material.icon}</div>
                      <div className="font-medium text-sm text-gray-900 capitalize">{material.name}</div>
                      <div className="text-xs text-gray-700">per {material.unit}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={quantityInput}
                    onChange={handleQuantityChange}
                    className="w-full px-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter quantity"
                    min="1"
                  />
                  <div className="absolute right-12 top-3 text-gray-500 text-sm">
                    {selectedMaterialData?.unit}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-600" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your location or ZIP code"
                  />
                </div>
              </div>
            </div>

            {/* Vendor Selection */}
            <div>
              <label className="block text-sm  font-medium text-gray-700 mb-2">
                Select Vendors
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableVendors.map((vendor) => (
                  <button
                    key={vendor.id}
                    type="button"
                    onClick={() => handleVendorToggle(vendor.id)}
                    disabled={!vendor.available}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      selectedVendors.includes(vendor.id)
                        ? 'border-blue-500 bg-blue-50'
                        : vendor.available
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-2xl mb-1">{vendor.logo}</div>
                    <div className="font-medium text-gray-800 texttext-sm">{vendor.name}</div>
                    {vendor.comingSoon && (
                      <div className="text-xs text-gray-500">Coming Soon</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 mb-2">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="price_low_to_high">Price: Low to High</option>
                <option value="price_high_to_low">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="relevance">Best Match</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || selectedVendors.length === 0}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Search Prices</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Results Section */}
        {showResults && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                Price Comparison Results
              </h3>
              <div className="text-sm text-gray-600">
                {products.length} products found from {searchVendors.join(', ')}
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found. Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {products.map((product, index) => {
                  const price = extractPrice(product.price);
                  const totalPrice = price * quantity;
                  
                  return (
                    <div key={product.id || index} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex items-center space-x-2">
                              <Store className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-600">{product.vendor}</span>
                            </div>
                            {product.rating && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium">{product.rating}</span>
                                {product.reviews && (
                                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <h4 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-2">
                            {product.title}
                          </h4>
                          
                          {product.brand && (
                            <div className="text-sm text-gray-600 mb-2">
                              Brand: {product.brand}
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            {product.deliveryOptions && product.deliveryOptions.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <Truck className="w-4 h-4" />
                                <span>{product.deliveryOptions[0]}</span>
                              </div>
                            )}
                            {product.storeAvailability && (
                              <span className="text-green-600">Available in store</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-blue-600">
                            {product.price}
                          </div>
                          {quantity > 1 && (
                            <div className="text-lg font-semibold text-gray-900">
                              {formatPrice(totalPrice)}
                            </div>
                          )}
                          <div className="text-sm text-gray-500">for {quantity} {selectedMaterialData?.unit}</div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {product.deliveryOptions?.map((option, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                              >
                                {option}
                              </span>
                            ))}
                            {product.storeAvailability && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                In-store pickup
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            {product.url && (
                              <a
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                View Product
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Features Section */}
        {!showResults && (
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Compare Prices</h3>
              <p className="text-gray-600">
                Get real-time price comparisons from multiple suppliers in your area.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delivery Options</h3>
              <p className="text-gray-600">
                See delivery times and options to fit your project schedule.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cost Calculator</h3>
              <p className="text-gray-600">
                Calculate total costs including delivery and taxes.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Construction Price Aggregator</h3>
              <p className="text-gray-400">
                Helping contractors and builders find the best prices for construction materials.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Materials</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Concrete</li>
                <li>Steel</li>
                <li>Cement</li>
                <li>Wood</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Vendors</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Home Depot</li>
                <li>Lowe's (Coming Soon)</li>
                <li>Menards (Coming Soon)</li>
                <li>Local Suppliers (Coming Soon)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">
                pierre.ggarcia01@gmail.com
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Construction Price Aggregator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// // Just add a new vendor class
// export class NewVendor implements Vendor {
//   name = 'New Vendor';
//   logo = '/vendors/new-vendor-logo.png';
//   // Implement searchProducts method
// }
