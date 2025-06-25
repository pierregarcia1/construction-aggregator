'use client';

import { useState } from "react";
import { Search, MapPin, Calculator, Truck, Star, Phone, Mail } from 'lucide-react';


// sampe data for demonstration
const materials = [
  {id :'concrete', name: 'concrete', unit: 'cubic yard', icon: '🏗️'},
  {id: 'steel', name: 'steel', unit: 'ton', icon: '🔩'},
  {id: 'cement', name: 'cement', unit: 'bag', icon: '🏭'},
  {id: 'wood', name: 'wood', unit: 'board foot', icon: '🪵'},
  {id: 'brick', name: 'brick', unit: 'piece', icon: '🧱'},
  {id: 'glass', name: 'glass', unit: 'square foot', icon: '🪟'},
];


const sampleSuppliers = [
  {
    id: 1,
    name: 'ABC Concrete Co.',
    rating: 4.8,
    reviews: 127,
    price: 135,
    delivery: 'Same day',
    phone: '(555) 123-4567',
    email: 'info@abcconcrete.com',
    distance: '2.3 miles',
    features: ['Same day delivery', 'Bulk discounts', 'Quality guarantee']
  },
  {
    id: 2,
    name: 'ReadyMix Solutions',
    rating: 4.6,
    reviews: 89,
    price: 140,
    delivery: 'Next day',
    phone: '(555) 234-5678',
    email: 'sales@readymix.com',
    distance: '4.1 miles',
    features: ['Next day delivery', 'Professional consultation', 'Installation available']
  },
  {
    id: 3,
    name: 'Local Supplier X',
    rating: 4.4,
    reviews: 56,
    price: 150,
    delivery: '2-3 days',
    phone: '(555) 345-6789',
    email: 'contact@localsupplier.com',
    distance: '6.7 miles',
    features: ['Competitive pricing', 'Local business', 'Flexible scheduling']
  }
];

export default function Home() {
  const [selectedMaterial, setSelectedMaterial] = useState('concrete');
  const [quantity, setQuantity] = useState(5);
  const [location, setLocation] = useState('Dallas, TX');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const selectedMaterialData = materials.find(m => m.id === selectedMaterial);

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
                      <div className="font-medium text-sm">{material.name}</div>
                      <div className="text-xs text-gray-500">per {material.unit}</div>
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
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter quantity"
                    min="1"
                  />
                  <div className="absolute right-3 top-3 text-gray-500 text-sm">
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
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your location"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Search Prices</span>
            </button>
          </form>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                Price Comparison Results
              </h3>
              <div className="text-sm text-gray-600">
                {quantity} {selectedMaterialData?.unit} of {selectedMaterialData?.name} in {location}
              </div>
            </div>

            <div className="grid gap-6">
              {sampleSuppliers.map((supplier, index) => (
                <div key={supplier.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-xl font-semibold text-gray-900">{supplier.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{supplier.rating}</span>
                          <span className="text-sm text-gray-500">({supplier.reviews} reviews)</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{supplier.distance}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Truck className="w-4 h-4" />
                          <span>{supplier.delivery}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        ${supplier.price}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        ${(supplier.price * quantity).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per {selectedMaterialData?.unit}</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {supplier.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                          <Phone className="w-4 h-4" />
                          <span>Call</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                          <Mail className="w-4 h-4" />
                          <span>Email</span>
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Get Quote
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
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
