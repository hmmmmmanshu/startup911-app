"use client";

import { useState, useEffect } from 'react'
import { IncubationCentre } from './page'

// Client component for filtering functionality
export default function IncubationCentresClient({ centres }: { centres: IncubationCentre[] }) {
  const [selectedState, setSelectedState] = useState<string>('all')
  const [filteredCentres, setFilteredCentres] = useState<IncubationCentre[]>(centres)

  // Get unique states from the data, sorted alphabetically
  const availableStates = Array.from(new Set(centres.map(centre => centre.state).filter(Boolean) as string[]))
    .sort()

  // Filter centres based on selected state
  useEffect(() => {
    if (selectedState === 'all') {
      setFilteredCentres(centres)
    } else {
      setFilteredCentres(centres.filter(centre => centre.state === selectedState))
    }
  }, [selectedState, centres])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Incubation Centres in India
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover leading incubation centres across India that can help accelerate your startup journey with mentorship, funding, and resources.
          </p>
        </div>

        {/* State Filter */}
        <div className="max-w-md mx-auto mb-8">
          <label htmlFor="state-filter" className="block text-sm font-medium text-gray-300 mb-2">
            Filter by State:
          </label>
          <select
            id="state-filter"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          >
            <option value="all">All States ({centres.length} centres)</option>
            {availableStates.map((state) => {
              const count = centres.filter(centre => centre.state === state).length
              return (
                <option key={state} value={state}>
                  {state} ({count} centre{count !== 1 ? 's' : ''})
                </option>
              )
            })}
          </select>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-gray-400">
            {selectedState === 'all' 
              ? `Showing all ${filteredCentres.length} incubation centres`
              : `Showing ${filteredCentres.length} incubation centre${filteredCentres.length !== 1 ? 's' : ''} in ${selectedState}`
            }
          </p>
        </div>

        {/* Conditional Rendering */}
        {filteredCentres.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <div className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-12 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-gray-200">No centres found</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                {selectedState === 'all' 
                  ? 'Our comprehensive list of incubation centres is being compiled. Please check back soon!'
                  : `No incubation centres found in ${selectedState}. Try selecting a different state.`
                }
              </p>
              {selectedState !== 'all' && (
                <button
                  onClick={() => setSelectedState('all')}
                  className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Show All States
                </button>
              )}
            </div>
          </div>
        ) : (
          // Data Display
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCentres.map((centre: IncubationCentre) => (
              <div
                key={centre.id}
                className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
              >
                {/* Centre Name */}
                <h3 className="text-xl font-bold mb-3 text-white">
                  {centre.name}
                </h3>

                {/* State Location */}
                {centre.state && (
                  <div className="mb-4">
                    <p className="text-gray-300 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {centre.state}
                    </p>
                  </div>
                )}

                {/* Email Contact */}
                {centre.email && (
                  <div className="mt-auto pt-4">
                    <a
                      href={`mailto:${centre.email}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact via Email
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 