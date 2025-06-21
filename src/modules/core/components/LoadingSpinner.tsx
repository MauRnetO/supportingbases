import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center space-x-2">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="text-gray-600">Carregando...</span>
      </div>
    </div>
  );
}