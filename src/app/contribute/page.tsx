"use client";

import { useState } from 'react';
import { Briefcase, Brain, Handshake, CheckCircle, AlertCircle } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import { 
  INDUSTRY_OPTIONS, 
  STARTUP_STAGE_OPTIONS, 
  REGION_OPTIONS, 
  EXPERTISE_OPTIONS,
  LANGUAGE_OPTIONS,
  RATE_TIER_OPTIONS,
  CURRENCY_OPTIONS,
  VC_SECTOR_OPTIONS
} from '@/lib/constants/form-options';

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

  const handleSubmission = async (formData: Record<string, unknown>) => {
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
    } catch {
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
function GrantForm({ onSubmit }: { onSubmit: (data: Record<string, unknown>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    details: '',
    status: 'Active',
    amount_min: '',
    amount_max: '',
    amount_currency: 'INR',
    application_deadline: '',
    application_link: '',
    industry_sectors: [] as string[],
    startup_stages: [] as string[],
    geographical_focus: [] as string[],
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

  // Using unified constants for consistency

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: unknown) => {
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
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300">Grant Amount</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Currency *
            </label>
            <select
              value={formData.amount_currency}
              onChange={(e) => handleInputChange('amount_currency', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
              required
            >
              {CURRENCY_OPTIONS.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Minimum Amount
              </label>
              <input
                type="text"
                value={formData.amount_min}
                onChange={(e) => handleInputChange('amount_min', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                placeholder={`e.g., ${CURRENCY_OPTIONS.find(c => c.code === formData.amount_currency)?.symbol}1 Lakh`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maximum Amount
              </label>
              <input
                type="text"
                value={formData.amount_max}
                onChange={(e) => handleInputChange('amount_max', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                placeholder={`e.g., ${CURRENCY_OPTIONS.find(c => c.code === formData.amount_currency)?.symbol}50 Lakhs`}
              />
            </div>
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

        {/* Multi-Select Targeting */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-300">Grant Targeting & Focus</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Industry Sectors *
            </label>
            <MultiSelect
              options={[...INDUSTRY_OPTIONS]}
              value={formData.industry_sectors}
              onChange={(value) => handleInputChange('industry_sectors', value)}
              placeholder="Select industry sectors this grant targets..."
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">
              Select all industry sectors this grant is suitable for
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Startup Stages *
            </label>
            <MultiSelect
              options={[...STARTUP_STAGE_OPTIONS]}
              value={formData.startup_stages}
              onChange={(value) => handleInputChange('startup_stages', value)}
              placeholder="Select startup stages this grant targets..."
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">
              Select all startup stages this grant is suitable for
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Geographical Focus
            </label>
            <MultiSelect
              options={[...REGION_OPTIONS]}
              value={formData.geographical_focus}
              onChange={(value) => handleInputChange('geographical_focus', value)}
              placeholder="Select geographical regions this grant focuses on..."
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">
              Select regions where this grant is available or prioritized
            </p>
          </div>
        </div>

        {/* Requirements - Organized by Categories */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Grant Requirements & Criteria</h3>
          
          {/* Technical Requirements */}
          <div>
            <h4 className="text-md font-medium text-gray-400 mb-3">Technical Requirements</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'dpiit_required', label: 'DPIIT Registration Required' },
                { key: 'tech_focus_required', label: 'Tech Focus Required' },
                { key: 'patent_required', label: 'Patent/IP Required' },
                { key: 'prototype_required', label: 'Working Prototype Required' },
                { key: 'technical_cofounder_required', label: 'Technical Co-founder Required' },
                { key: 'full_time_commitment', label: 'Full-time Commitment Required' },
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

          {/* Special Focus Areas */}
          <div>
            <h4 className="text-md font-medium text-gray-400 mb-3">Special Focus Areas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'women_led_focus', label: 'Women-led Startup Focus' },
                { key: 'student_focus', label: 'Student Startup Focus' },
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

          {/* Support & Benefits */}
          <div>
            <h4 className="text-md font-medium text-gray-400 mb-3">Support & Benefits Included</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'mentorship_included', label: 'Mentorship Included' },
                { key: 'workspace_provided', label: 'Workspace Provided' },
                { key: 'network_access', label: 'Network Access Provided' },
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
function VCForm({ onSubmit }: { onSubmit: (data: Record<string, unknown>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    linkedin: '',
    country_based_of: '',
    about: '',
    key_person: '',
    sectors: [] as string[],
    area_info: '',
    stage_focus: [] as string[],
    region_focus: [] as string[],
  });

  // Using unified constants for consistency

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: unknown) => {
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

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Country/Region Based
          </label>
          <input
            type="text"
            value={formData.country_based_of}
            onChange={(e) => handleInputChange('country_based_of', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
            placeholder="e.g., India, Singapore, Global"
          />
        </div>

        {/* Multi-Select Investment Focus */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-300">Investment Focus</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sector Focus *
            </label>
            <MultiSelect
              options={[...VC_SECTOR_OPTIONS]}
              value={formData.sectors}
              onChange={(value) => handleInputChange('sectors', value)}
              placeholder="Select sectors you invest in..."
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">
              Select all sectors your VC firm invests in
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Investment Stages *
            </label>
            <MultiSelect
              options={[...STARTUP_STAGE_OPTIONS]}
              value={formData.stage_focus}
              onChange={(value) => handleInputChange('stage_focus', value)}
              placeholder="Select investment stages..."
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">
              Select all investment stages your firm focuses on
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Geographic Focus *
            </label>
            <MultiSelect
              options={[...REGION_OPTIONS]}
              value={formData.region_focus}
              onChange={(value) => handleInputChange('region_focus', value)}
              placeholder="Select geographic regions..."
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">
              Select all regions where your firm invests
            </p>
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
function MentorForm({ onSubmit }: { onSubmit: (data: Record<string, unknown>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    photo_url: '',
    sectors: [] as string[],
    functional_expertise: [] as string[],
    about: '',
    rate_tier: '',
    languages: [] as string[],
    linkedin_url: '',
    calendly_url: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Using unified constants for consistency

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: unknown) => {
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

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a JPG or PNG file.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload photo
    setUploadingPhoto(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('photo', file);

      const response = await fetch('/api/upload-photo', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormData(prev => ({ ...prev, photo_url: result.photo_url }));
      } else {
        alert(result.error || 'Failed to upload photo');
        setPhotoPreview('');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photo. Please try again.');
      setPhotoPreview('');
    } finally {
      setUploadingPhoto(false);
    }
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
              Profile Photo
            </label>
            
            {/* Photo Preview */}
            {(photoPreview || formData.photo_url) && (
              <div className="mb-4">
                <div className="relative w-24 h-24 mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview || formData.photo_url}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-green-500/30"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* File Upload */}
            <div className="space-y-3">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handlePhotoChange}
                disabled={uploadingPhoto}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 focus:border-green-500 focus:outline-none disabled:opacity-50"
              />
              
              {/* Fallback URL input */}
              <div className="text-center text-gray-400 text-sm">or</div>
              
              <input
                type="url"
                value={formData.photo_url}
                onChange={(e) => handleInputChange('photo_url', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            
            <p className="text-xs text-gray-400 mt-2">
              Upload a JPG or PNG file (max 5MB) or provide a URL
            </p>
          </div>
        </div>

        {/* Multi-Select Expertise */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-300">Your Expertise</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Industry Sectors *
            </label>
            <MultiSelect
              options={[...INDUSTRY_OPTIONS]}
              value={formData.sectors}
              onChange={(value) => handleInputChange('sectors', value)}
              placeholder="Select industry sectors you have experience in..."
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">
              Select all industry sectors where you can provide mentorship
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Functional Expertise *
            </label>
            <MultiSelect
              options={[...EXPERTISE_OPTIONS]}
              value={formData.functional_expertise}
              onChange={(value) => handleInputChange('functional_expertise', value)}
              placeholder="Select your functional expertise areas..."
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">
              Select all functional areas where you can provide guidance
            </p>
          </div>
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
            {RATE_TIER_OPTIONS.map(tier => (
              <option key={tier} value={tier}>{tier} per hour</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Languages You Speak
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {LANGUAGE_OPTIONS.map(language => (
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
