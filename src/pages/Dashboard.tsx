import { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, SortDesc, Flag, ToggleLeft, ToggleRight, RefreshCw, Settings, Home, Eye, EyeOff } from 'lucide-react';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';
import type { FeatureFlag } from '../contexts/FeatureFlagContext';

export default function FeatureFlagDashboard() {
  const { flags, toggleFlag, resetToDefaults, loading, error } = useFeatureFlags();

  const [filteredFlags, setFilteredFlags] = useState<FeatureFlag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [sortKey, setSortKey] = useState<'name' | 'status'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    applyFilters();
  }, [flags, searchQuery, filterStatus, sortKey, sortDirection]);

  const applyFilters = () => {
    let temp = [...flags];

    if (searchQuery.trim()) {
      temp = temp.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus === 'enabled') {
      temp = temp.filter(f => f.enabled);
    } else if (filterStatus === 'disabled') {
      temp = temp.filter(f => !f.enabled);
    }

    if (sortKey === 'name') {
      temp.sort((a, b) => {
        const result = a.name.localeCompare(b.name);
        return sortDirection === 'asc' ? result : -result;
      });
    } else {
      temp.sort((a, b) => {
        const result = Number(b.enabled) - Number(a.enabled);
        return sortDirection === 'asc' ? -result : result;
      });
    }

    setFilteredFlags(temp);
  };

  const toggleSort = (key: 'name' | 'status') => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (enabled: boolean) => {
    return enabled 
      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
      : 'bg-gradient-to-r from-slate-500 to-gray-500 text-white';
  };

  const enabledCount = flags.filter(f => f.enabled).length;
  const disabledCount = flags.filter(f => !f.enabled).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p>Error: {error}</p>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              HomePage Feature Controls
            </h1>
          </div>
          <p className="text-gray-600 text-lg mb-4">Manage feature flags for the main homepage</p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {enabledCount} Active
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              {disabledCount} Inactive
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              {flags.length} Total
            </span>
          </div>

          <div className="flex justify-center gap-4">
            <button 
              onClick={() => window.open('/', '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
            >
              <Home className="w-4 h-4" />
              View Homepage
            </button>
            <button 
              onClick={resetToDefaults}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search feature flags or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-white/80"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                showFilters 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                  : 'bg-white/80 text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-gray-200 bg-white/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              >
                <option value="all">All Status</option>
                <option value="enabled">Enabled Only</option>
                <option value="disabled">Disabled Only</option>
              </select>

              <button
                onClick={() => toggleSort('name')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white/80 hover:bg-gray-50 transition-colors"
              >
                Name
                {sortKey === 'name' && (sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />)}
              </button>

              <button
                onClick={() => toggleSort('status')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white/80 hover:bg-gray-50 transition-colors"
              >
                Status
                {sortKey === 'status' && (sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />)}
              </button>
            </div>
          )}
        </div>

        {/* Flags Grid */}
        {filteredFlags.length === 0 ? (
          <div className="text-center py-12">
            <Flag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-500 mb-2">No feature flags found</p>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredFlags.map((flag, index) => (
              <div
                key={flag.id}
                className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {flag.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(flag.enabled)}`}>
                        {flag.enabled ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {flag.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {flag.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>Flag Name: {flag.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-6">
                    {/* Toggle Switch */}
                    <button
                      onClick={() => toggleFlag(flag.name)}
                      disabled={loading}
                      className="group/toggle relative inline-flex items-center transform hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                      title={flag.enabled ? 'Disable flag' : 'Enable flag'}
                    >
                      {flag.enabled ? (
                        <ToggleRight className="w-10 h-10 text-green-500 hover:text-green-600 transition-colors drop-shadow-lg" />
                      ) : (
                        <ToggleLeft className="w-10 h-10 text-gray-400 hover:text-gray-500 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Visual Impact Indicator */}
                <div className={`mt-4 p-3 rounded-lg border-l-4 ${
                  flag.enabled 
                    ? 'bg-green-50 border-green-400 text-green-700' 
                    : 'bg-gray-50 border-gray-300 text-gray-600'
                }`}>
                  <p className="text-xs font-medium">
                    {flag.enabled ? '✓ Feature is currently visible to users' : '✗ Feature is hidden from users'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={async () => {
                for (const flag of flags) {
                  if (!flag.enabled) {
                    await toggleFlag(flag.name);
                  }
                }
              }}
              disabled={loading}
              className="p-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enable All
            </button>
            <button 
              onClick={async () => {
                for (const flag of flags) {
                  if (flag.enabled) {
                    await toggleFlag(flag.name);
                  }
                }
              }}
              disabled={loading}
              className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Disable All
            </button>
            <button 
              onClick={async () => {
                const coreFlags = ['showWelcomeCard', 'showNotifications', 'showFooter'];
                for (const flagName of coreFlags) {
                  const flag = flags.find(f => f.name === flagName);
                  if (flag && !flag.enabled) {
                    await toggleFlag(flagName);
                  }
                }
              }}
              disabled={loading}
              className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enable Core UI
            </button>
            <button 
              onClick={async () => {
                const enhancedFlags = ['enableAnimations', 'showPromoBanner', 'enableNewButton'];
                for (const flagName of enhancedFlags) {
                  const flag = flags.find(f => f.name === flagName);
                  if (flag) {
                    await toggleFlag(flagName);
                  }
                }
              }}
              disabled={loading}
              className="p-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Toggle Enhanced
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}