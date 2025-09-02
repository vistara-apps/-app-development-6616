import React, { useState } from 'react';
import { Vote, Plus, Clock, Users, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

const DAOTools = () => {
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: 'Increase Marketing Budget',
      description: 'Proposal to allocate additional funds for Q2 marketing initiatives to expand our user base.',
      creator: '0x1234...abcd',
      createdAt: '2024-01-15',
      endDate: '2024-01-22',
      status: 'active',
      votesFor: 2847,
      votesAgainst: 1243,
      totalVotes: 4090,
      quorum: 5000,
      userVoted: null
    },
    {
      id: 2,
      title: 'New Feature Development',
      description: 'Should we prioritize building a mobile app or focus on improving the current web platform?',
      creator: '0x5678...efgh',
      createdAt: '2024-01-10',
      endDate: '2024-01-20',
      status: 'ended',
      votesFor: 3521,
      votesAgainst: 1842,
      totalVotes: 5363,
      quorum: 5000,
      userVoted: 'for'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    duration: '7',
    quorum: '5000'
  });

  const createProposal = () => {
    const newId = proposals.length + 1;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(newProposal.duration));
    
    const proposal = {
      id: newId,
      ...newProposal,
      creator: '0xYour...Address',
      createdAt: new Date().toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: 'active',
      votesFor: 0,
      votesAgainst: 0,
      totalVotes: 0,
      quorum: parseInt(newProposal.quorum),
      userVoted: null
    };
    
    setProposals(prev => [proposal, ...prev]);
    setNewProposal({
      title: '',
      description: '',
      duration: '7',
      quorum: '5000'
    });
    setShowCreateForm(false);
  };

  const vote = (proposalId, choice) => {
    setProposals(prev => prev.map(proposal => {
      if (proposal.id === proposalId && proposal.status === 'active') {
        const votes = choice === 'for' ? 1250 : 850; // Simulated user voting power
        return {
          ...proposal,
          votesFor: proposal.votesFor + (choice === 'for' ? votes : 0),
          votesAgainst: proposal.votesAgainst + (choice === 'against' ? votes : 0),
          totalVotes: proposal.totalVotes + votes,
          userVoted: choice
        };
      }
      return proposal;
    }));
  };

  const getProposalStatus = (proposal) => {
    if (proposal.status === 'ended') {
      if (proposal.totalVotes >= proposal.quorum) {
        return proposal.votesFor > proposal.votesAgainst ? 'passed' : 'rejected';
      }
      return 'failed-quorum';
    }
    return 'active';
  };

  const getProgressPercentage = (votes, total) => {
    return total > 0 ? (votes / total) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">DAO Tools</h2>
          <p className="text-text-secondary mt-1">Create and vote on community proposals</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Proposal</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Proposals</p>
              <p className="text-2xl font-semibold text-text-primary">{proposals.length}</p>
            </div>
            <Vote className="w-8 h-8 text-purple-medium" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Active Proposals</p>
              <p className="text-2xl font-semibold text-text-primary">
                {proposals.filter(p => p.status === 'active').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-accent" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Voters</p>
              <p className="text-2xl font-semibold text-text-primary">1,247</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Participation Rate</p>
              <p className="text-2xl font-semibold text-text-primary">82%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-light" />
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {proposals.map((proposal) => {
          const status = getProposalStatus(proposal);
          const forPercentage = getProgressPercentage(proposal.votesFor, proposal.totalVotes);
          const againstPercentage = getProgressPercentage(proposal.votesAgainst, proposal.totalVotes);
          
          return (
            <div key={proposal.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-text-primary">{proposal.title}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      status === 'active' ? 'bg-blue-400/20 text-blue-400' :
                      status === 'passed' ? 'bg-green-400/20 text-green-400' :
                      status === 'rejected' ? 'bg-red-400/20 text-red-400' :
                      'bg-yellow-400/20 text-yellow-400'
                    }`}>
                      {status === 'failed-quorum' ? 'Quorum Not Met' : status}
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">{proposal.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-text-secondary">
                    <span>By {proposal.creator}</span>
                    <span>Created {proposal.createdAt}</span>
                    <span>Ends {proposal.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Voting Stats */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Progress: {proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()} required</span>
                  <span className="text-text-secondary">
                    {((proposal.totalVotes / proposal.quorum) * 100).toFixed(1)}% quorum
                  </span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((proposal.totalVotes / proposal.quorum) * 100, 100)}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-green-400">For</span>
                      <span className="text-text-primary">{proposal.votesFor.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${forPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-red-400">Against</span>
                      <span className="text-text-primary">{proposal.votesAgainst.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${againstPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voting Buttons */}
              {proposal.status === 'active' && (
                <div className="mt-6 flex space-x-3">
                  {proposal.userVoted ? (
                    <div className="flex items-center space-x-2 text-accent">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        You voted {proposal.userVoted}
                      </span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => vote(proposal.id, 'for')}
                        className="btn-primary flex-1 flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Vote For</span>
                      </button>
                      <button
                        onClick={() => vote(proposal.id, 'against')}
                        className="btn-secondary flex-1 flex items-center justify-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Vote Against</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Proposal Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-primary">Create Proposal</h3>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Proposal Title *
                </label>
                <input
                  type="text"
                  placeholder="What would you like to propose?"
                  className="input-field w-full"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Provide details about your proposal..."
                  className="input-field w-full h-32 resize-none"
                  value={newProposal.description}
                  onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Voting Duration (days)
                  </label>
                  <select
                    className="input-field w-full"
                    value={newProposal.duration}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, duration: e.target.value }))}
                  >
                    <option value="3">3 days</option>
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Minimum Quorum
                  </label>
                  <input
                    type="number"
                    placeholder="5000"
                    className="input-field w-full"
                    value={newProposal.quorum}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, quorum: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={createProposal}
                  disabled={!newProposal.title || !newProposal.description}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DAOTools;