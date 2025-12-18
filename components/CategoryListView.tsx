
import React from 'react';

interface CategoryListViewProps {
  onSelect: (category: string) => void;
}

const CATEGORIES = [
  { name: 'Sweets', icon: '🍬', desc: 'Traditional, Ghee, Kaju, Bengali' },
  { name: 'Savouries', icon: '🍘', desc: 'Sevs, Mixtures, Murukkus' },
  { name: 'Snacks', icon: '🍿', desc: 'Pakodas, Thukkada' },
  { name: 'Pickles', icon: '🍋', desc: 'Garlic, Mango, Nartangai' },
  { name: 'Vadaam', icon: '🍪', desc: 'Traditional Vadaams' },
  { name: 'Podies', icon: '🥣', desc: 'Idly & Sambar Powders' },
  { name: 'Makhana', icon: '🍿', desc: 'Crispy Flavored Makhanas' },
  { name: 'Cookies', icon: '🍪', desc: 'Cashew & Ghee Cookies' },
  { name: 'Vathal', icon: '🥗', desc: 'Sun-dried favorites' },
  { name: 'Chocolates', icon: '🍫', desc: 'Artisanal chocolates' }
];

const CategoryListView: React.FC<CategoryListViewProps> = ({ onSelect }) => {
  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-[#1d4d2b] mb-4 uppercase tracking-tighter">Our Kitchen Collections</h2>
        <p className="text-gray-400 max-w-xl mx-auto font-medium">Explore the diverse heritage of Indian flavors through our curated categories.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onSelect(cat.name)}
            className="bg-white border border-gray-100 rounded-2xl p-8 flex items-center gap-6 hover:shadow-2xl hover:border-[#fdbd10] transition-all group text-left"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:bg-[#fdbd10]/10 transition-all">
              {cat.icon}
            </div>
            <div>
              <span className="text-xl font-black text-gray-800 block mb-1">{cat.name}</span>
              <p className="text-xs text-gray-400 font-medium">{cat.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryListView;
