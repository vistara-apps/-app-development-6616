import React, { useState } from 'react';
import { Clock, Users, Calendar, Plus, Trash2, Edit } from 'lucide-react';

const VestingScheduler = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      name: 'Team Vesting',
      token: 'MYTOKEN',
      recipients: 5,
      totalAmount: '100,000',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      cliffPeriod: '3 months',
      status: 'active'
    },
    {
      id: 2,
      name: 'Advisor Vesting',
      token: 'MYTOKEN',
      recipients: 3,
      totalAmount: '50,000',
      startDate: '2024-02-01',
      endDate: '2025-02-01',
      cliffPeriod: '6 months',
      status: 'pending'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    token: '',
    recipients: [{ address: '', amount: '' }],
    startDate: '',
    endDate: '',
    cliffPeriod: '0',
    vestingFrequency: 'monthly'
  });

  const addRecipient = () => {
    setNewSchedule(prev => ({
      ...prev,
      recipients: [...prev.recipients, { address: '', amount: '' }]
    }));
  };

  const removeRecipient = (index) => {
    setNewSchedule(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }));
  };

  const updateRecipient = (index, field, value) => {
    setNewSchedule(prev => ({
      ...prev,
      recipients: prev.recipients.map((recipient, i) => 
        i === index ? { ...recipient, [field]: value } : recipient
      )
    }));
  };

  const createSchedule = () => {
    const newId = schedules.length + 1;
    const schedule = {
      id: newId,
      ...newSchedule,
      recipients: newSchedule.recipients.length,
      totalAmount: newSchedule.recipients.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0).toLocaleString(),
      status: 'pending'
    };
    
    setSchedules(prev => [...prev, schedule]);
    setNewSchedule({
      name: '',
      token: '',
      recipients: [{ address: '', amount: '' }],
      startDate: '',
      endDate: '',
      cliffPeriod: '0',
      vestingFrequency: 'monthly'
    });
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Vesting Scheduler</h2>
          <p className="text-text-secondary mt-1">Manage token vesting schedules for your team and investors</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Schedule</span>
        </button>
      </div>

      {/* Existing Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-text-primary">{schedule.name}</h3>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                schedule.status === 'active' ? 'bg-green-400/20 text-green-400' :
                schedule.status === 'pending' ? 'bg-yellow-400/20 text-yellow-400' :
                'bg-red-400/20 text-red-400'
              }`}>
                {schedule.status}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-secondary">Token:</span>
                <span className="text-text-primary font-medium">{schedule.token}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Recipients:</span>
                <span className="text-text-primary">{schedule.recipients}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Amount:</span>
                <span className="text-text-primary">{schedule.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Duration:</span>
                <span className="text-text-primary">{schedule.startDate} - {schedule.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Cliff Period:</span>
                <span className="text-text-primary">{schedule.cliffPeriod}</span>
              </div>
            </div>

            <div className="mt-6 flex space-x-2">
              <button className="btn-secondary flex-1 flex items-center justify-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="btn-secondary px-3">
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Schedule Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-primary">Create Vesting Schedule</h3>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Schedule Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Team Vesting Q1"
                    className="input-field w-full"
                    value={newSchedule.name}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Token Symbol *
                  </label>
                  <input
                    type="text"
                    placeholder="MYTOKEN"
                    className="input-field w-full"
                    value={newSchedule.token}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, token: e.target.value }))}
                  />
                </div>
              </div>

              {/* Time Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    className="input-field w-full"
                    value={newSchedule.startDate}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    className="input-field w-full"
                    value={newSchedule.endDate}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Cliff Period (months)
                  </label>
                  <select
                    className="input-field w-full"
                    value={newSchedule.cliffPeriod}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, cliffPeriod: e.target.value }))}
                  >
                    <option value="0">No Cliff</option>
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                  </select>
                </div>
              </div>

              {/* Vesting Frequency */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Vesting Frequency
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['daily', 'weekly', 'monthly', 'quarterly'].map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setNewSchedule(prev => ({ ...prev, vestingFrequency: freq }))}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        newSchedule.vestingFrequency === freq
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-gray-600 text-text-secondary hover:border-gray-500'
                      }`}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipients */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-text-secondary">
                    Recipients *
                  </label>
                  <button
                    onClick={addRecipient}
                    className="btn-secondary text-sm flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Recipient</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {newSchedule.recipients.map((recipient, index) => (
                    <div key={index} className="flex space-x-3">
                      <input
                        type="text"
                        placeholder="0x1234...abcd"
                        className="input-field flex-1"
                        value={recipient.address}
                        onChange={(e) => updateRecipient(index, 'address', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        className="input-field w-32"
                        value={recipient.amount}
                        onChange={(e) => updateRecipient(index, 'amount', e.target.value)}
                      />
                      {newSchedule.recipients.length > 1 && (
                        <button
                          onClick={() => removeRecipient(index)}
                          className="btn-secondary px-3"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={createSchedule}
                  disabled={!newSchedule.name || !newSchedule.token || !newSchedule.startDate || !newSchedule.endDate}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VestingScheduler;