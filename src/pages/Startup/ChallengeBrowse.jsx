import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Modal from '../../components/Common/Modal';
import { Search, Filter, Calendar, DollarSign, Clock, MapPin, ExternalLink, Zap } from 'lucide-react';

const ChallengeBrowse = () => {
  const { challenges } = useApp();
  const navigate = useNavigate();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [department, setDepartment] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [budgetLimit, setBudgetLimit] = useState("");

  // Inspect detail modal state
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filters logic
  const filteredList = challenges.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.id.toLowerCase().includes(search.toLowerCase()) ||
                          c.requiredTechnology.toLowerCase().includes(search.toLowerCase());
    const matchesSector = sector === "All" || c.sector === sector;
    const matchesDept = department === "All" || c.department === department;
    const matchesLoc = locationFilter === "All" || c.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesBudget = !budgetLimit || c.budget >= parseFloat(budgetLimit);
    
    return matchesSearch && matchesSector && matchesDept && matchesLoc && matchesBudget;
  });

  const openDetails = (c) => {
    setSelectedChallenge(c);
    setIsDetailOpen(true);
  };

  const handleApply = (challengeId) => {
    navigate(`/startup/apply/${challengeId}`);
  };

  return (
    <div className="p-6 space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Government Innovation Marketplace</h2>
          <p className="text-xs text-slate-400 mt-1">Discover active public sector challenges, inspect operational specifications, and submit sandboxed proposals.</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Search Input */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search challenges, keywords, required technologies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden"
            />
          </div>

          {/* Budget filter */}
          <div className="w-full md:w-48 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <DollarSign className="w-4 h-4" />
            </span>
            <input
              type="number"
              placeholder="Min budget ($)..."
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden"
            />
          </div>

        </div>

        {/* Sector and Department selects */}
        <div className="flex flex-wrap gap-3 pt-2 text-xs font-bold text-slate-500 uppercase">
          
          {/* Sector filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-slate-400 tracking-wider">Sector</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="px-3 py-1.5 border border-slate-205 bg-white rounded-lg focus:outline-hidden text-slate-700 font-semibold"
            >
              <option value="All">All Sectors</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Water & Sanitation">Water & Sanitation</option>
              <option value="Transportation">Transportation</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Municipal / Smart Cities">Municipal / Smart Cities</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-slate-400 tracking-wider">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-3 py-1.5 border border-slate-205 bg-white rounded-lg focus:outline-hidden text-slate-700 font-semibold"
            >
              <option value="All">All Departments</option>
              <option value="Health Department">Health Department</option>
              <option value="Rural Development">Rural Development</option>
              <option value="Municipal Administration">Municipal Administration</option>
              <option value="Agriculture Department">Agriculture Department</option>
              <option value="Transport Department">Transport Department</option>
            </select>
          </div>

          {/* Location filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-slate-400 tracking-wider">Target Districts</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-205 bg-white rounded-lg focus:outline-hidden text-slate-700 font-semibold"
            >
              <option value="All">All Regions</option>
              <option value="Karnataka">Karnataka State</option>
              <option value="Mumbai">Mumbai Metro</option>
              <option value="Rajasthan">Rajasthan State</option>
              <option value="Bengaluru">Bengaluru Core</option>
              <option value="Chennai">Chennai City</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid of Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((c) => (
          <div key={c.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              
              {/* Header */}
              <div className="flex justify-between items-start gap-3">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50/50 text-blue-700 border border-blue-200 uppercase">
                  {c.id}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{c.sector}</span>
              </div>

              <h3 className="font-extrabold text-slate-800 text-sm mt-3 leading-snug">
                {c.title}
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 uppercase tracking-wide">
                {c.department}
              </span>

              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed line-clamp-3">
                {c.problemDescription}
              </p>

              {/* Meta list */}
              <div className="mt-5 space-y-2 border-t border-slate-50 pt-3 text-[10px] font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-450" />
                  <span>District: <strong className="text-slate-700">{c.location}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-450" />
                  <span>Duration: <strong className="text-slate-700">{c.pilotDuration}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-slate-450" />
                  <span>Pilot Budget: <strong className="text-blue-650 font-extrabold">${c.budget.toLocaleString()}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-450" />
                  <span>Deadline: <strong className="text-slate-700">{c.submissionDeadline}</strong></span>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between gap-2">
              <button
                onClick={() => openDetails(c)}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-slate-850 px-2 py-1 rounded-md transition-colors cursor-pointer"
              >
                View Details <ExternalLink className="w-3 h-3" />
              </button>
              {c.status === "Open" ? (
                <button
                  onClick={() => handleApply(c.id)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 font-bold text-[10px] uppercase tracking-wider text-white rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Apply Now
                </button>
              ) : (
                <span className="text-[10px] text-slate-400 font-bold uppercase italic px-3 py-1.5">
                  Applications Closed
                </span>
              )}
            </div>

          </div>
        ))}
        {filteredList.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm">
            No matching challenges found on the marketplace.
          </div>
        )}
      </div>

      {/* Inspect Challenge Details Modal */}
      {selectedChallenge && (
        <Modal
          isOpen={isDetailOpen}
          title={`Challenge ID: ${selectedChallenge.id}`}
          onClose={() => setIsDetailOpen(false)}
          confirmText="Apply for Challenge"
          onConfirm={selectedChallenge.status === "Open" ? () => {
            setIsDetailOpen(false);
            handleApply(selectedChallenge.id);
          } : null}
          confirmColor="blue"
        >
          <div className="space-y-5 text-left text-slate-650 leading-relaxed text-xs">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
              {selectedChallenge.sector} Sector
            </span>
            <h3 className="text-lg font-black text-slate-900 leading-snug mt-2">{selectedChallenge.title}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Department: {selectedChallenge.department} | Target: {selectedChallenge.location}</p>

            <div className="space-y-3 mt-4">
              <div>
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wide">Problem Scope</h4>
                <p className="text-slate-500 mt-1 leading-relaxed">{selectedChallenge.problemDescription}</p>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wide">Expected Efficacy Outcomes</h4>
                <p className="text-slate-500 mt-1 leading-relaxed">{selectedChallenge.expectedOutcome}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-100 rounded-xl font-semibold text-slate-600">
                <div><span className="text-slate-400 text-[9px] uppercase font-bold block">Sandbox Budget</span><span className="text-blue-600 font-extrabold text-sm">${selectedChallenge.budget.toLocaleString()}</span></div>
                <div><span className="text-slate-400 text-[9px] uppercase font-bold block">Pilot Duration</span><span>{selectedChallenge.pilotDuration}</span></div>
                <div><span className="text-slate-400 text-[9px] uppercase font-bold block">Required Tech</span><span className="text-slate-800">{selectedChallenge.requiredTechnology}</span></div>
                <div><span className="text-slate-400 text-[9px] uppercase font-bold block">Deadline</span><span className="text-slate-850">{selectedChallenge.submissionDeadline}</span></div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wide">Target KPIs</h4>
                <div className="mt-2 space-y-1.5">
                  {selectedChallenge.kpis.map((kpi, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px] border-b border-slate-50 pb-1">
                      <span className="font-bold text-slate-700">{kpi.name}</span>
                      <span>Target: <strong className="text-slate-900">{kpi.target} {kpi.unit}</strong> (Baseline: {kpi.baseline})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wide">Startup Eligibility Parameters</h4>
                <p className="text-slate-550 mt-1">{selectedChallenge.eligibilityRequirements}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wide">Evaluation Weight Metrics</h4>
                <div className="grid grid-cols-2 gap-2 mt-2 font-bold text-slate-500 text-[10px]">
                  {selectedChallenge.evaluationCriteria.map((crit, idx) => (
                    <div key={idx} className="flex justify-between border-b border-slate-50 pb-1">
                      <span>{crit.criterion}</span>
                      <span className="text-slate-800">{(crit.weight * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default ChallengeBrowse;
