"use client";

import { useState } from 'react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function TestAPIPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testVCSubmission = async () => {
    setLoading(true);
    setResult('Testing...');

    try {
      const response = await fetch('/api/submit-contribution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submission_type: 'vc',
          submission_data: {
            name: 'Test VC Firm',
            website: 'https://testvc.com',
            about: 'This is a test VC firm',
            sector: 'Technology & Software',
            stage_focus: 'Seed',
            region_focus: 'India'
          },
        }),
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <button
          onClick={testVCSubmission}
          disabled={loading}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors mb-6"
        >
          {loading ? 'Testing...' : 'Test VC Submission'}
        </button>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Result:</h2>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      </div>
    </div>
  );
}
