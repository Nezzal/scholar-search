'use client';

import React, { useState } from 'react';
import { Search, Loader, Book, Calendar, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SearchResult {
 id: number;
 title: string;
 authors: string;
 year: number;
 citationCount: number;
 abstract: string;
 publication: string;
 url?: string;
}

export default function SearchApp() {
 const [query, setQuery] = useState('');
 const [results, setResults] = useState<SearchResult[]>([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const handleSearch = async () => {
   if (!query.trim()) return;
   
   setLoading(true);
   setError(null);
   
   try {
     const apiKey = process.env.NEXT_PUBLIC_SERPAPI_KEY;
     const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
     const targetUrl = `https://serpapi.com/search.json?engine=google_scholar&q=${encodeURIComponent(query)}&api_key=${apiKey}`;
     
     const response = await fetch(proxyUrl + targetUrl, {
       method: 'GET',
       headers: {
         'Origin': 'http://localhost:3001',
       }
     });

     if (!response.ok) {
       throw new Error('Search failed');
     }

     const data = await response.json();
     
     const formatted = data.organic_results?.map((result: any) => ({
       id: result.position || Math.random(),
       title: result.title || '',
       authors: result.authors || 'Unknown',
       year: parseInt(result.year) || new Date().getFullYear(),
       citationCount: result.inline_links?.cited_by?.total || 0,
       abstract: result.snippet || '',
       publication: result.publication_info?.summary || '',
       url: result.link
     })) || [];

     setResults(formatted);
   } catch (error) {
     console.error('Search error:', error);
     setError('Search failed. Please try again.');
   } finally {
     setLoading(false);
   }
 };

 return (
   <div className="max-w-4xl mx-auto p-6">
     <h1 className="text-3xl font-bold mb-8 text-center">Academic Search</h1>
     
     <div className="flex gap-2 mb-8">
       <Input
         value={query}
         onChange={(e) => setQuery(e.target.value)}
         placeholder="Search for articles..."
         className="flex-1"
         onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
       />
       <Button onClick={handleSearch} disabled={loading}>
         {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
         Search
       </Button>
     </div>

     {error && (
       <Alert variant="destructive" className="mb-4">
         <AlertDescription>{error}</AlertDescription>
       </Alert>
     )}

     <div className="space-y-4">
       {results.map((result) => (
         <Card key={result.id}>
           <CardContent className="p-4">
             <h2 className="text-xl font-semibold mb-2">
               {result.url ? (
                 <a href={result.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                   {result.title}
                 </a>
               ) : result.title}
             </h2>
             <div className="flex gap-4 text-sm text-gray-600 mb-2">
               <span><User className="inline w-4 h-4 mr-1" />{result.authors}</span>
               <span><Calendar className="inline w-4 h-4 mr-1" />{result.year}</span>
               <span><Book className="inline w-4 h-4 mr-1" />Citations: {result.citationCount}</span>
             </div>
             <p className="text-gray-700">{result.abstract}</p>
             <p className="text-sm text-gray-600 mt-2">{result.publication}</p>
           </CardContent>
         </Card>
       ))}
     </div>
   </div>
 );
}