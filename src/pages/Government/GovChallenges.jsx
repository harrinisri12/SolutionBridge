import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { Plus, Search, Filter, Calendar, DollarSign, Users } from 'lucide-react';

const GovChallenges = () => {
  const { challenges, applications } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");

  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.id.toLowerCase().includes(search.toLowerCase());
    const matchesSector = sectorFilter === "All" || c.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const getApplicationCount = (challengeId) => {
    return applications.filter(a => a.challengeId === challengeId).length;
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-6 border border-slate-100 rounded-2xl">
        <div className="text-left">
          <h2 className="text-xl font-bold text-slate-800 tracking-wide">Government Challenges Directory</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Manage published problem statement frameworks, submission deadlines, and verify candidate metrics.</p>
        </div>
        <button
          onClick={() => navigate('/gov/create-challenge')}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 font-bold text-xs uppercase tracking-wider text-white rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Challenge
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        
        {/* Search */}
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-450">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search challenge ID or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold focus:outline-hidden"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-600 focus:outline-hidden"
          >
            <option value="All">All Sectors</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Water & Sanitation">Water & Sanitation</option>
            <option value="Transportation">Transportation</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Municipal / Smart Cities">Municipal / Smart Cities</option>
          </select>
        </div>

      </div>

      {/* Grid of Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {filteredChallenges.map((c) => {
          const appCount = getApplicationCount(c.id);
          return (
            <div key={c.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                
                {/* Header */}
                <div className="flex justify-between items-start gap-3">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                    {c.id}
                  </span>
                  <StatusBadge status={c.status} />
                </div>

                <h3 className="font-extrabold text-slate-800 text-sm mt-3 leading-snug">
                  {c.title}
                </h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
                  {c.department}
                </span>

                <p className="text-[11px] text-slate-500 mt-3 leading-relaxed line-clamp-3">
                  {c.problemDescription}
                </p>

                {/* Meta list */}
                <div className="mt-5 space-y-2 border-t border-slate-50 pt-3 text-[10px] font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Deadline: <strong className="text-slate-700">{c.submissionDeadline}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>Budget: <strong className="text-blue-600">${c.budget.toLocaleString()}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Submitted Proposals: <strong className="text-slate-800">{appCount} Startups</strong></span>
                  </div>
                </div>

              </div>

              {/* View / Manage Action */}
              <div className="mt-5 pt-3 border-t border-slate-50 flex justify-end">
                <button
                  onClick={() => navigate(`/gov/screening`)}
                  className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  Manage Submissions
                </button>
              </div>

            </div>
          );
        })}
        {filteredChallenges.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm">
            No matching challenges found.
          </div>
        )}
      </div>

    </div>
  );
};

export default GovChallenges;
