"use client"; // This is now a Client Component because it uses state and interactivity

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Define the structure for our tags and grouped tags
type Tag = { id: number; name: string; type: string };
type GroupedTags = { [key: string]: Tag[] };

// Define the questions and the order they will appear in
const QUESTION_ORDER = ['STAGE', 'INDUSTRY', 'DOCUMENTS_REQUIRED', 'PREFERENCES'];
const QUESTION_TITLES: { [key: string]: string } = {
  STAGE: "What's your startup stage?",
  INDUSTRY: "Which industry are you in?",
  DOCUMENTS_REQUIRED: "What Prerequisites do you have?",
  PREFERENCES: "Your Impact Area"
};

export default function GrantQuestionnaire({ groupedTags }: { groupedTags: GroupedTags }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, number[]>>({});

  const handleSelection = (category: string, tagId: number) => {
    setSelections(prev => {
      const currentCategorySelections = prev[category] || [];
      const newSelections = currentCategorySelections.includes(tagId)
        ? currentCategorySelections.filter(id => id !== tagId) // Deselect
        : [...currentCategorySelections, tagId]; // Select
      return { ...prev, [category]: newSelections };
    });
  };

  const handleNext = () => {
    if (currentStep < QUESTION_ORDER.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step: Construct the query string and navigate
      const queryParts = Object.entries(selections)
        .filter(([, ids]) => ids.length > 0)
        .map(([key, ids]) => `${key.toLowerCase()}=${ids.join(',')}`);
      
      router.push(`/grants/results?${queryParts.join('&')}`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentCategory = QUESTION_ORDER[currentStep];
  const categoryMappings: Record<string, string> = { DOCUMENTS_REQUIRED: 'REQUIREMENT', PREFERENCES: 'SOCIAL_IMPACT' };
  const effectiveCategory = categoryMappings[currentCategory] || currentCategory;
  const options = groupedTags[effectiveCategory] || [];

  return (
    <div className="bg-[#121212] text-white min-h-screen flex flex-col items-center justify-center p-4">
      {/* Progress Dots */}
      <div className="flex space-x-2 mb-8">
        {QUESTION_ORDER.map((_, index) => (
          <div
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
              index === currentStep ? 'bg-green-500' : 'bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Main Question Card */}
      <div className="bg-[#1C1C1E] rounded-2xl p-8 max-w-2xl w-full border border-gray-800">
        <h2 className="text-3xl font-bold text-center text-green-400">
          {QUESTION_TITLES[currentCategory]}
        </h2>
        <p className="text-center text-gray-400 mt-2">Select all that apply</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map(tag => {
            const isSelected = selections[currentCategory]?.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => handleSelection(currentCategory, tag.id)}
                className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                  isSelected
                    ? 'bg-green-500/10 border-green-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                      isSelected ? 'border-green-500 bg-green-500' : 'border-gray-500'
                    }`}
                  >
                    {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="font-medium text-white">{tag.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between max-w-2xl w-full mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
        >
          &larr; Previous
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          {currentStep === QUESTION_ORDER.length - 1 ? 'Find Grants' : 'Next'} &rarr;
        </button>
      </div>
    </div>
  );
} 