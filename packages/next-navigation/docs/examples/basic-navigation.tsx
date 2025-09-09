// Basic Navigation Example
'use client';

import { useNavigation } from '@vooteam/next-navigation';

export default function BasicNavigation() {
  const navigation = useNavigation();

  const handleNavigation = async (route: string) => {
    try {
      await navigation.push(route);
      console.log(`Successfully navigated to ${route}`);
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  return (
    <nav className="flex gap-4 p-4">
      <button 
        onClick={() => handleNavigation('/about')}
        disabled={navigation.isPending}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {navigation.isPending ? 'Loading...' : 'About'}
      </button>
      
      <button 
        onClick={() => handleNavigation('/products')}
        disabled={navigation.isPending}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        Products
      </button>
      
      <button 
        onClick={() => navigation.back()}
        disabled={navigation.isPending}
        className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
      >
        ← Back
      </button>
    </nav>
  );
}
