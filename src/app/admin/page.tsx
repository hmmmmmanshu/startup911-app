"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { CheckCircle, XCircle, Clock, Eye, EyeOff, RefreshCw } from 'lucide-react';

interface Submission {
  id: string;
  submission_type: 'grant' | 'vc' | 'mentor' | 'incubation_centre' | 'post';
  submission_data: Record<string, any>;
  status: 'pending_review' | 'approved' | 'rejected' | 'needs_revision';
  notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

interface SubmissionState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({ status: 'idle' });
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('community_submissions')
        .select('*')
        .eq('status', 'pending_review')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setSubmissionState({
        status: 'error',
        message: 'Failed to fetch submissions'
      });
    } finally {
      setLoading(false);
    }
  };

  const moderateSubmission = async (submissionId: string, action: 'approve' | 'reject') => {
    try {
      setActionLoading(submissionId);
      setSubmissionState({ status: 'idle' });

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/moderate-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          submission_id: submissionId,
          action: action,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmissionState({
          status: 'success',
          message: result.message,
        });
        
        // Remove the submission from the list
        setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
        
        // Close expanded view if it was this submission
        if (expandedSubmission === submissionId) {
          setExpandedSubmission(null);
        }
      } else {
        setSubmissionState({
          status: 'error',
          message: result.error || 'Failed to moderate submission',
        });
      }
    } catch (error) {
      console.error('Error moderating submission:', error);
      setSubmissionState({
        status: 'error',
        message: 'Network error. Please try again.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const toggleExpanded = (submissionId: string) => {
    setExpandedSubmission(expandedSubmission === submissionId ? null : submissionId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSubmissionTypeIcon = (type: string) => {
    switch (type) {
      case 'grant':
        return '💰';
      case 'vc':
        return '🏢';
      case 'mentor':
        return '👨‍🏫';
      case 'incubation_centre':
        return '🏭';
      case 'post':
        return '📝';
      default:
        return '📄';
    }
  };

  const getSubmissionTypeColor = (type: string) => {
    switch (type) {
      case 'grant':
        return 'text-green-400';
      case 'vc':
        return 'text-blue-400';
      case 'mentor':
        return 'text-purple-400';
      case 'incubation_centre':
        return 'text-orange-400';
      case 'post':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-400">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Moderate community submissions</p>
          </div>
          <button
            onClick={fetchSubmissions}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Status Messages */}
        {submissionState.status === 'success' && (
          <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
              <p className="text-green-400">{submissionState.message}</p>
            </div>
          </div>
        )}

        {submissionState.status === 'error' && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-red-400">{submissionState.message}</p>
            </div>
          </div>
        )}

        {/* Submissions Queue */}
        <div className="bg-[#1C1C1E] rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-400" />
              Pending Review Queue ({submissions.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">All caught up!</h3>
              <p className="text-gray-400">No submissions pending review.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {submissions.map((submission) => (
                <div key={submission.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {getSubmissionTypeIcon(submission.submission_type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {submission.submission_data.name || 'Untitled Submission'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className={`font-medium ${getSubmissionTypeColor(submission.submission_type)}`}>
                            {submission.submission_type.toUpperCase()}
                          </span>
                          <span>•</span>
                          <span>{formatDate(submission.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleExpanded(submission.id)}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-colors"
                      >
                        {expandedSubmission === submission.id ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => moderateSubmission(submission.id, 'approve')}
                        disabled={actionLoading === submission.id}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => moderateSubmission(submission.id, 'reject')}
                        disabled={actionLoading === submission.id}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded View */}
                  {expandedSubmission === submission.id && (
                    <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                      <h4 className="text-sm font-semibold text-gray-300 mb-3">Submission Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {Object.entries(submission.submission_data).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <span className="text-gray-400 capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <div className="text-white">
                              {typeof value === 'boolean' ? (
                                <span className={`px-2 py-1 rounded text-xs ${
                                  value ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {value ? 'Yes' : 'No'}
                                </span>
                              ) : Array.isArray(value) ? (
                                <div className="flex flex-wrap gap-1">
                                  {value.map((item, index) => (
                                    <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span>{String(value) || 'Not provided'}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
