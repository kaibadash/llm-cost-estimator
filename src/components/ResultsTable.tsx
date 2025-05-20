'use client';

import { useState } from 'react';
import { ModelCostEstimate, TranslationStrings } from '@/types';

interface ResultsTableProps {
  results: ModelCostEstimate[];
  translations: TranslationStrings;
}

type SortKey = 'provider' | 'model' | 'inputPrice' | 'outputPrice' | 'estimatedCost';
type SortDirection = 'asc' | 'desc';

export default function ResultsTable({ results, translations }: ResultsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('estimatedCost');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortKey) {
      case 'provider':
        aValue = a.provider;
        bValue = b.provider;
        break;
      case 'model':
        aValue = a.model;
        bValue = b.model;
        break;
      case 'inputPrice':
        aValue = a.input_price;
        bValue = b.input_price;
        break;
      case 'outputPrice':
        aValue = a.output_price;
        bValue = b.output_price;
        break;
      case 'estimatedCost':
        aValue = a.estimatedCost;
        bValue = b.estimatedCost;
        break;
      default:
        aValue = a.estimatedCost;
        bValue = b.estimatedCost;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{translations.resultsSection.title}</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('provider')}
              >
                {translations.resultsSection.provider}
                {sortKey === 'provider' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('model')}
              >
                {translations.resultsSection.model}
                {sortKey === 'model' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('inputPrice')}
              >
                {translations.resultsSection.inputPrice}
                {sortKey === 'inputPrice' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('outputPrice')}
              >
                {translations.resultsSection.outputPrice}
                {sortKey === 'outputPrice' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('estimatedCost')}
              >
                {translations.resultsSection.estimatedCost}
                {sortKey === 'estimatedCost' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {translations.resultsSection.pricingLink}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedResults.map((result, index) => (
              <tr key={`${result.provider}-${result.model}-${index}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.provider}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.model}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${result.input_price.toFixed(6)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${result.output_price.toFixed(6)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${result.estimatedCost.toFixed(4)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <a href={result.pricing_url} target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 