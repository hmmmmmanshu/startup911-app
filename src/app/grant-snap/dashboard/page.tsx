'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

// Mock data for opportunities
const mockOpportunities = [
  {
    id: 1,
    title: "SBIR Phase I Grant",
    funder: "National Science Foundation",
    amount: "$225,000",
    deadline: "2024-03-15",
    status: "To Review",
    type: "Grant"
  },
  {
    id: 2,
    title: "Innovation Fund",
    funder: "TechStart Ventures",
    amount: "$500,000",
    deadline: "2024-04-01",
    status: "In Progress",
    type: "Investment"
  },
  {
    id: 3,
    title: "Small Business Grant",
    funder: "Department of Energy",
    amount: "$150,000",
    deadline: "2024-02-28",
    status: "Applied",
    type: "Grant"
  },
  {
    id: 4,
    title: "Seed Funding Round",
    funder: "Angel Investors Network",
    amount: "$1,000,000",
    deadline: "2024-05-15",
    status: "To Review",
    type: "Investment"
  }
];

export default function GrantSnapDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [typeFilter, setTypeFilter] = useState('All Opportunities');
  const [selectedOpportunity, setSelectedOpportunity] = useState<typeof mockOpportunities[0] | null>(null);

  const filteredOpportunities = mockOpportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.funder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || opp.status === statusFilter;
    const matchesType = typeFilter === 'All Opportunities' || 
                       (typeFilter === 'Grants Only' && opp.type === 'Grant') ||
                       (typeFilter === 'Investors Only' && opp.type === 'Investment');
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'In Progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Applied': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Grant Snap
              </h1>
              <span className="text-gray-400">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                Autofill Setup
              </Button>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h3 className="text-gray-400 text-sm">Total Opportunities</h3>
            <p className="text-2xl font-bold text-white">{mockOpportunities.length}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h3 className="text-gray-400 text-sm">In Progress</h3>
            <p className="text-2xl font-bold text-blue-400">
              {mockOpportunities.filter(opp => opp.status === 'In Progress').length}
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h3 className="text-gray-400 text-sm">Applied</h3>
            <p className="text-2xl font-bold text-green-400">
              {mockOpportunities.filter(opp => opp.status === 'Applied').length}
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h3 className="text-gray-400 text-sm">To Review</h3>
            <p className="text-2xl font-bold text-yellow-400">
              {mockOpportunities.filter(opp => opp.status === 'To Review').length}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
            
            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="All Opportunities">All Opportunities</SelectItem>
                <SelectItem value="Grants Only">Grants Only</SelectItem>
                <SelectItem value="Investors Only">Investors Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="All Statuses">All Statuses</SelectItem>
                <SelectItem value="To Review">To Review</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Opportunities Table */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Opportunity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Funder
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredOpportunities.map((opportunity) => (
                  <tr 
                    key={opportunity.id}
                    className="hover:bg-gray-800 cursor-pointer"
                    onClick={() => setSelectedOpportunity(opportunity)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{opportunity.title}</div>
                        <div className="text-sm text-gray-400">{opportunity.type}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {opportunity.funder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">
                      {opportunity.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(opportunity.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(opportunity.status)}`}>
                        {opportunity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Auto-fill application for:', opportunity.title);
                        }}
                      >
                        Auto-fill
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel Modal */}
        {selectedOpportunity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full border border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white">{selectedOpportunity.title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOpportunity(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Funder</h3>
                  <p className="text-white">{selectedOpportunity.funder}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Amount</h3>
                  <p className="text-green-400 font-medium">{selectedOpportunity.amount}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Deadline</h3>
                  <p className="text-white">{new Date(selectedOpportunity.deadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Status</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedOpportunity.status)}`}>
                    {selectedOpportunity.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Auto-fill Application
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Visit Original Page
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 