"use client"; // This is a Client Component because it uses state and interactivity

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Define the structure for industry tags
type Tag = { id: number; name: string; type: string };

// Define the questions and the order they will appear in
const QUESTION_ORDER = ['INDUSTRY', 'EXPERTISE', 'LANGUAGE', 'BUDGET'];
const QUESTION_TITLES: Record<string, string> = {
  INDUSTRY: "Which industry sector do you need help with?",
  EXPERTISE: "What functional expertise are you looking for?",
  LANGUAGE: "Which languages should your mentor speak?",
  BUDGET: "What's your budget for mentorship?"
};

// Hard-coded language options
const LANGUAGE_OPTIONS = [
  'English', 'Hindi', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Gujarati', 'Urdu'
];

// Hard-coded budget options (matching database rate_tier values)
const BUDGET_OPTIONS = [
  'Free',
  '<₹1K',
  '₹1K-3K',
  '₹3K-5K',
  '₹5K+'
];

interface MentorQuestionnaireProps {
  groupedTags: Record<string, Tag[]>;
}

export default function MentorQuestionnaire({ groupedTags }: MentorQuestionnaireProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, (string | number)[]>>({
    INDUSTRY: [],
    EXPERTISE: [],
    LANGUAGE: [],
    BUDGET: []
  });

  const handleIndustrySelection = (tagId: number) => {
    setSelections(prev => {
      const currentSelections = prev.INDUSTRY || [];
      const newSelections = currentSelections.includes(tagId)
        ? currentSelections.filter(id => id !== tagId) // Deselect
        : [...currentSelections, tagId]; // Select
      return { ...prev, INDUSTRY: newSelections };
    });
  };

  const handleExpertiseSelection = (tagId: number) => {
    setSelections(prev => {
      const currentSelections = prev.EXPERTISE || [];
      const newSelections = currentSelections.includes(tagId)
        ? currentSelections.filter(id => id !== tagId) // Deselect
        : [...currentSelections, tagId]; // Select
      return { ...prev, EXPERTISE: newSelections };
    });
  };

  const handleLanguageSelection = (language: string) => {
    setSelections(prev => {
      const currentSelections = prev.LANGUAGE || [];
      const newSelections = currentSelections.includes(language)
        ? currentSelections.filter(lang => lang !== language) // Deselect
        : [...currentSelections, language]; // Select
      return { ...prev, LANGUAGE: newSelections };
    });
  };

  const handleBudgetSelection = (budget: string) => {
    // Budget is single selection - replace any existing selection
    setSelections(prev => ({
      ...prev,
      BUDGET: [budget]
    }));
  };

  const handleNext = () => {
    if (currentStep < QUESTION_ORDER.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step: Construct the query string and navigate
      const queryParts = [];
      
      // Add industry selections (tag IDs)
      if (selections.INDUSTRY.length > 0) {
        queryParts.push(`industry=${selections.INDUSTRY.join(',')}`);
      }
      
      // Add expertise selections (tag IDs) 
      if (selections.EXPERTISE.length > 0) {
        queryParts.push(`expertise=${selections.EXPERTISE.join(',')}`);
      }
      
      // Add language selections (names)
      if (selections.LANGUAGE.length > 0) {
        queryParts.push(`language=${selections.LANGUAGE.join(',')}`);
      }
      
      // Add budget selection (name)
      if (selections.BUDGET.length > 0) {
        queryParts.push(`budget=${encodeURIComponent(selections.BUDGET[0] as string)}`);
      }
      
      router.push(`/mentors/results?${queryParts.join('&')}`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentCategory = QUESTION_ORDER[currentStep];

  // Get options for current step
  const getCurrentOptions = () => {
    switch (currentCategory) {
      case 'INDUSTRY':
        return groupedTags.INDUSTRY || [];
      case 'EXPERTISE':
        return groupedTags.EXPERTISE || [];
      case 'LANGUAGE':
        return LANGUAGE_OPTIONS.map(lang => ({ id: lang, name: lang }));
      case 'BUDGET':
        return BUDGET_OPTIONS.map(budget => ({ id: budget, name: budget }));
      default:
        return [];
    }
  };

  const options = getCurrentOptions();

  // Check if an option is selected
  const isSelected = (optionId: string | number) => {
    const currentSelections = selections[currentCategory] || [];
    return currentSelections.includes(optionId);
  };

  // Handle selection based on current step
  const handleSelection = (optionId: string | number) => {
    switch (currentCategory) {
      case 'INDUSTRY':
        handleIndustrySelection(optionId as number);
        break;
      case 'EXPERTISE':
        handleExpertiseSelection(optionId as number);
        break;
      case 'LANGUAGE':
        handleLanguageSelection(optionId as string);
        break;
      case 'BUDGET':
        handleBudgetSelection(optionId as string);
        break;
    }
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen flex flex-col items-center justify-center p-4">
      {/* Progress Dots */}
      <div className="flex space-x-2 mb-8">
        {QUESTION_ORDER.map((_, index) => (
          <div
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
              index === currentStep ? 'bg-green-400' : 'bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Main Question Card */}
      <div className="bg-[#1C1C1E] rounded-2xl p-8 max-w-2xl w-full border border-gray-800">
        <h2 className="text-3xl font-bold text-center text-green-400">
          {QUESTION_TITLES[currentCategory]}
        </h2>
        <p className="text-center text-gray-400 mt-2">
          {currentCategory === 'BUDGET' ? 'Select one option' : 'Select all that apply'}
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map(option => {
            const optionId = (currentCategory === 'INDUSTRY' || currentCategory === 'EXPERTISE') ? (option as Tag).id : option.id;
            const selected = isSelected(optionId);
            
            return (
              <button
                key={optionId}
                onClick={() => handleSelection(optionId)}
                className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                  selected
                    ? 'bg-green-500/10 border-green-400'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                      selected ? 'border-green-400 bg-green-400' : 'border-gray-500'
                    }`}
                  >
                    {selected && (
                      <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium text-white">{option.name}</span>
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
          className="px-8 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-colors"
        >
          {currentStep === QUESTION_ORDER.length - 1 ? 'Find Mentors' : 'Next'} &rarr;
        </button>
      </div>
    </div>
  );
} 