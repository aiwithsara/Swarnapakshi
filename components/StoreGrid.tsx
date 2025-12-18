
import React from 'react';
import { Product } from '../types';

interface StoreGridProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  onBuyNow: (p: Product) => void;
}

const StoreGrid: React.FC<StoreGridProps> = ({ products, onAddToCart, onBuyNow }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all flex flex-col">
          <div className="relative aspect-square bg-gray-50 overflow-hidden">
            <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={product.name} />
          </div>
          <div className="p-4 flex flex-col flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{product.subCategory || product.category}</p>
            <h3 className="font-bold text-gray-800 mb-1">{product.name}</h3>
            <p className="text-sm font-black text-[#1d4d2b] mb-4">Rs. {product.price.toFixed(2)} <span className="text-xs font-normal text-gray-400 ml-1">({product.weight})</span></p>
            
            <div className="mt-auto space-y-2">
              <button 
                onClick={() => onAddToCart(product)}
                className="w-full py-2 text-xs font-bold border border-gray-200 rounded text-gray-700 hover:bg-gray-50 uppercase tracking-wider transition-colors"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => onBuyNow(product)}
                className="w-full py-2 text-xs font-bold bg-[#1d4d2b] text-white rounded hover:bg-[#1d4d2b]/90 uppercase tracking-wider transition-colors shadow-sm"
              >
                Buy it now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreGrid;
