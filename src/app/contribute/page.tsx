"use client";

import { useState } from 'react';
import { Briefcase, Brain, Handshake, CheckCircle, AlertCircle } from 'lucide-react';

// Submission type definition
type SubmissionType = 'grant' | 'vc' | 'mentor';

// Success/Error state
interface SubmissionState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
  submissionId?: string;
}

// Main Contribution Page Component
export default function ContributePage() {
  const [selectedType, setSelectedType] = useState<SubmissionType>('grant');
  const [submissionState, setSubmissionState] = useState<SubmissionState>({ status: 'idle' });

  const handleSubmission = async (formData: Record<string, any>) => {
    setSubmissionState({ status: 'submitting' });

    try {
      const response = await fetch('/api/submit-contribution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submission_type: selectedType,
          submission_data: formData,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmissionState({
          status: 'success',
          message: result.message,
          submissionId: result.submission_id,
        });
      } else {
        setSubmissionState({
          status: 'error',
          message: result.error || 'Failed to submit contribution',
        });
      }
    } catch (error) {
      setSubmissionState({
        status: 'error',
        message: 'Network error. Please try again.',
      });
    }
  };

  const resetSubmission = () => {
    setSubmissionState({ status: 'idle' });
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contribute to <span className="text-green-400">Startup911</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Help us build the most comprehensive startup ecosystem database. Share grants, VCs, mentors, and more.
          </p>
        </div>

        {/* Success/Error Messages */}
        {submissionState.status === 'success' && (
          <div className="bg-green-500/10 border border-green-500 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
              <h3 className="text-xl font-semibold text-green-400">Submission Successful!</h3>
            </div>
            <p className="text-gray-300 mb-4">{submissionState.message}</p>
            <p className="text-sm text-gray-400">
              Submission ID: {submissionState.submissionId}
            </p>
            <button
              onClick={resetSubmission}
              className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Submit Another
            </button>
          </div>
        )}

        {submissionState.status === 'error' && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-400 mr-3" />
              <h3 className="text-xl font-semibold text-red-400">Submission Failed</h3>
            </div>
            <p className="text-gray-300 mb-4">{submissionState.message}</p>
            <button
              onClick={resetSubmission}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Submission Type Toggle */}
        {submissionState.status === 'idle' && (
          <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-gray-800 mb-8">
            <h2 className="text-2xl font-bold text-center mb-8">What would you like to contribute?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedType('grant')}
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  selectedType === 'grant'
                    ? 'bg-green-500/10 border-green-500 text-green-400'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-500 text-gray-300'
                }`}
              >
                <div className="text-center">
                  <Briefcase className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Grant Program</h3>
                  <p className="text-sm opacity-80">Share funding opportunities</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedType('vc')}
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  selectedType === 'vc'
                    ? 'bg-green-500/10 border-green-500 text-green-400'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-500 text-gray-300'
                }`}
              >
                <div className="text-center">
                  <Brain className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Venture Capital</h3>
                  <p className="text-sm opacity-80">Add investor information</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedType('mentor')}
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  selectedType === 'mentor'
                    ? 'bg-green-500/10 border-green-500 text-green-400'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-500 text-gray-300'
                }`}
              >
                <div className="text-center">
                  <Handshake className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Mentor Profile</h3>
                  <p className="text-sm opacity-80">Share your expertise</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Form Rendering */}
        {submissionState.status === 'idle' && (
          <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-gray-800">
            {selectedType === 'grant' && <GrantForm onSubmit={handleSubmission} />}
            {selectedType === 'vc' && <VCForm onSubmit={handleSubmission} />}
            {selectedType === 'mentor' && <MentorForm onSubmit={handleSubmission} />}
          </div>
        )}

        {/* Loading State */}
        {submissionState.status === 'submitting' && (
          <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-gray-800 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-300">Submitting your contribution...</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Grant Form Component
function GrantForm({ onSubmit }: { onSubmit: (data: Record<string, any>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    details: '',
    status: 'Active',
    amount_max: '',
    application_deadline: '',
    application_link: '',
    dpiit_required: false,
    tech_focus_required: false,
    patent_required: false,
    prototype_required: false,
    technical_cofounder_required: false,
    full_time_commitment: false,
    women_led_focus: false,
    student_focus: false,
    mentorship_included: false,
    workspace_provided: false,
    network_access: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-green-400">Grant Program Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Grant Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="e.g., Startup India Seed Fund"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Organization *
            </label>
            <input
              type="text"
              required
              value={formData.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="e.g., Government of India"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Grant Details *
          </label>
          <textarea
            required
            rows={4}
            value={formData.details}
            onChange={(e) => handleInputChange('details', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
            placeholder="Describe the grant program, its objectives, and key benefits..."
          />
        </div>

        {/* Financial Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Maximum Amount
            </label>
            <input
              type="text"
              value={formData.amount_max}
              onChange={(e) => handleInputChange('amount_max', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="e.g., Up to ₹50 Lakhs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Application Deadline
            </label>
            <input
              type="date"
              value={formData.application_deadline}
              onChange={(e) => handleInputChange('application_deadline', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Application Link
          </label>
          <input
            type="url"
            value={formData.application_link}
            onChange={(e) => handleInputChange('application_link', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
            placeholder="https://example.com/apply"
          />
        </div>

        {/* Requirements */}
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Requirements & Focus Areas</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'dpiit_required', label: 'DPIIT Registration Required' },
              { key: 'tech_focus_required', label: 'Tech Focus Required' },
              { key: 'patent_required', label: 'Patent/IP Required' },
              { key: 'prototype_required', label: 'Working Prototype Required' },
              { key: 'technical_cofounder_required', label: 'Technical Co-founder Required' },
              { key: 'full_time_commitment', label: 'Full-time Commitment' },
              { key: 'women_led_focus', label: 'Women-led Focus' },
              { key: 'student_focus', label: 'Student Focus' },
              { key: 'mentorship_included', label: 'Mentorship Included' },
              { key: 'workspace_provided', label: 'Workspace Provided' },
              { key: 'network_access', label: 'Network Access' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData[key as keyof typeof formData] as boolean}
                  onChange={(e) => handleInputChange(key, e.target.checked)}
                  className="w-4 h-4 text-green-600 bg-gray-800 border-gray-700 rounded focus:ring-green-500 focus:ring-2"
                />
                <span className="text-sm text-gray-300">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
        >
          Submit Grant Information
        </button>
      </form>
    </div>
  );
}

// VC Form Component
function VCForm({ onSubmit }: { onSubmit: (data: Record<string, any>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    linkedin: '',
    country_based_of: '',
    about: '',
    key_person: '',
    sector: '',
    area_info: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-green-400">Venture Capital Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            VC Firm Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
            placeholder="e.g., Sequoia Capital India"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              LinkedIn
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="https://linkedin.com/company/example"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Country/Region
            </label>
            <input
              type="text"
              value={formData.country_based_of}
              onChange={(e) => handleInputChange('country_based_of', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="e.g., India, Singapore, Global"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sector Focus
            </label>
            <select
              value={formData.sector}
              onChange={(e) => handleInputChange('sector', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
            >
              <option value="">Select a sector</option>
              <option value="Technology & Software">Technology & Software</option>
              <option value="Finance & Fintech">Finance & Fintech</option>
              <option value="Healthcare & Biotech">Healthcare & Biotech</option>
              <option value="E-commerce & Retail">E-commerce & Retail</option>
              <option value="Education & EdTech">Education & EdTech</option>
              <option value="Energy & Sustainability">Energy & Sustainability</option>
              <option value="Agriculture & Food">Agriculture & Food</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Sector Agnostic">Sector Agnostic</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            About the Firm
          </label>
          <textarea
            rows={4}
            value={formData.about}
            onChange={(e) => handleInputChange('about', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
            placeholder="Describe the VC firm, their investment focus, portfolio, and key information..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Key Person/Contact
            </label>
            <input
              type="text"
              value={formData.key_person}
              onChange={(e) => handleInputChange('key_person', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="e.g., John Doe, Managing Partner"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Area Information
            </label>
            <input
              type="text"
              value={formData.area_info}
              onChange={(e) => handleInputChange('area_info', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="e.g., Investment stage, ticket size, geographic focus"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
        >
          Submit VC Information
        </button>
      </form>
    </div>
  );
}

// Mentor Form Component
function MentorForm({ onSubmit }: { onSubmit: (data: Record<string, any>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    photo_url: '',
    superpower: '',
    about: '',
    rate_tier: '',
    languages: [] as string[],
    linkedin_url: '',
    calendly_url: '',
  });

  const availableLanguages = [
    'English', 'Hindi', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 
    'Gujarati', 'Urdu', 'Kannada', 'Malayalam', 'Punjabi'
  ];

  const rateTiers = ['Free', '<₹1K', '₹1K-3K', '₹3K-5K', '₹5K+'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-green-400">Mentor Profile Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="e.g., Dr. Sarah Johnson"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Photo URL
            </label>
            <input
              type="url"
              value={formData.photo_url}
              onChange={(e) => handleInputChange('photo_url', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Superpower/Expertise
          </label>
          <input
            type="text"
            value={formData.superpower}
            onChange={(e) => handleInputChange('superpower', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
            placeholder="e.g., Fintech Innovation, Product Strategy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            About You *
          </label>
          <textarea
            required
            rows={4}
            value={formData.about}
            onChange={(e) => handleInputChange('about', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
            placeholder="Tell us about your background, experience, and what makes you a great mentor..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Rate Tier
          </label>
          <select
            value={formData.rate_tier}
            onChange={(e) => handleInputChange('rate_tier', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
          >
            <option value="">Select rate tier</option>
            {rateTiers.map(tier => (
              <option key={tier} value={tier}>{tier} per hour</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Languages You Speak
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableLanguages.map(language => (
              <label key={language} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.languages.includes(language)}
                  onChange={() => handleLanguageToggle(language)}
                  className="w-4 h-4 text-green-600 bg-gray-800 border-gray-700 rounded focus:ring-green-500 focus:ring-2"
                />
                <span className="text-sm text-gray-300">{language}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              LinkedIn Profile
            </label>
            <input
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Calendly Booking Link
            </label>
            <input
              type="url"
              value={formData.calendly_url}
              onChange={(e) => handleInputChange('calendly_url', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="https://calendly.com/yourname"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
        >
          Submit Mentor Profile
        </button>
      </form>
    </div>
  );
}
