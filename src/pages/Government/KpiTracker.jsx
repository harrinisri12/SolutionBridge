import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, Plus, Edit3, Save, AlertTriangle } from 'lucide-react';

const KpiTracker = () => {
  const { pilots, updateKPIValues, addToast } = useApp();

  const [selectedPilotId, setSelectedPilotId] = useState(pilots[0]?.id || "");
  const [editingKpis, setEditingKpis] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const activePilot = pilots.find(p => p.id === selectedPilotId) || pilots[0];

  const handleEditClick = () => {
    if (!activePilot) return;
    setEditingKpis(activePilot.kpis.map(k => ({ ...k })));
    setIsEditing(true);
  };

  const handleInputChange = (index, value) => {
    const updated = editingKpis.map((kpi, idx) => {
      if (idx === index) {
        return { ...kpi, actual: value ? parseFloat(value) : "" };
      }
      return kpi;
    });
    setEditingKpis(updated);
  };

  const handleSave = () => {
    if (!activePilot) return;
    // Basic verification
    const hasEmptyActuals = editingKpis.some(k => k.actual === "" || isNaN(k.actual));
    if (hasEmptyActuals) {
      addToast("Please input numerical values for all active actual columns.", "warning");
      return;
    }
    
    updateKPIValues(activePilot.id, editingKpis);
    setIsEditing(false);
    addToast("Pilot KPI performance metrics successfully logged.", "success");
  };

  // Helper calculations for visual logs
  const getKpiStats = (kpi) => {
    const baseline = parseFloat(kpi.baseline) || 0;
    const target = parseFloat(kpi.target) || 0;
    const actual = parseFloat(kpi.actual);
    
    if (isNaN(actual)) return { improvement: "-", achievement: "-", status: "PENDING" };

    const isIncreasingBetter = target > baseline;
    
    // Improvement percentage
    let improvementVal = 0;
    if (isIncreasingBetter) {
      improvementVal = ((actual - baseline) / baseline) * 100;
    } else {
      improvementVal = ((baseline - actual) / baseline) * 100;
    }

    // Achievement percentage
    let achievementVal = 0;
    const targetDelta = Math.abs(target - baseline);
    const actualDelta = isIncreasingBetter ? (actual - baseline) : (baseline - actual);
    
    if (targetDelta !== 0) {
      achievementVal = (actualDelta / targetDelta) * 100;
    } else {
      achievementVal = 100;
    }

    // Pass / Fail status
    const isPass = isIncreasingBetter ? (actual >= target) : (actual <= target);

    return {
      improvement: `${improvementVal.toFixed(1)}%`,
      achievement: `${Math.round(achievementVal)}%`,
      status: isPass ? "PASSED" : "FAILED"
    };
  };

  // Recharts Data Mapping
  const chartData = activePilot?.kpis.map(k => ({
    name: k.name.slice(0, 15) + "...",
    Baseline: parseFloat(k.baseline),
    Target: parseFloat(k.target),
    Actual: k.actual !== "" && !isNaN(k.actual) ? parseFloat(k.actual) : 0
  })) || [];

  return (
    <div className="p-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col text-left">
        <h2 className="text-xl font-bold text-slate-800 tracking-wide">KPI Performance Measurement</h2>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Monitor real-time sandbox outcomes. Compare pilot baselines, targets, and recorded actual logs to determine pass/fail criteria.</p>
      </div>

      {pilots.length === 0 ? (
        <div className="bg-white border border-slate-100 p-8 rounded-2xl text-center text-slate-400 text-sm text-left">
          No active pilots available for KPI measurement. Create a pilot first.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left">
          
          {/* Pilots Sidebar Selector */}
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Sandboxes</h3>
            <div className="space-y-1.5">
              {pilots.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPilotId(p.id);
                    setIsEditing(false);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all hover:bg-slate-50/50 ${
                    selectedPilotId === p.id 
                      ? "border-blue-600 bg-blue-50/20" 
                      : "border-slate-200"
                  }`}
                >
                  <span className="font-bold text-xs text-slate-800 block truncate">{p.challengeTitle}</span>
                  <span className="text-[10px] text-slate-400 font-semibold truncate block mt-0.5">{p.startupName}</span>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Status:</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-50 text-blue-700">
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main KPI Screen */}
          {activePilot && (
            <div className="lg:col-span-3 space-y-6">
              
              {/* Stats & Controls Panel */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                    Partner: {activePilot.startupName}
                  </span>
                  <h3 className="font-bold text-slate-800 text-base">{activePilot.challengeTitle}</h3>
                  <p className="text-xs text-slate-400 font-semibold">Location: {activePilot.location} | Timeline: {activePilot.startDate} to {activePilot.endDate}</p>
                </div>
                <div>
                  {isEditing ? (
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs uppercase tracking-wider text-white rounded-xl shadow-md cursor-pointer transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Metrics
                    </button>
                  ) : (
                    <button
                      onClick={handleEditClick}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 font-bold text-xs uppercase tracking-wider text-white rounded-xl shadow-md cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Log Actuals
                    </button>
                  )}
                </div>
              </div>

              {/* KPI Chart Visualizer */}
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                <h3 className="text-sm font-bold text-slate-800 mb-4">KPI Performance Comparison (Baseline vs Target vs Actual)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Target" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* KPI Details Grid Table */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-slate-650">
                    <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Metric Title</th>
                        <th className="px-6 py-4 text-center">Baseline</th>
                        <th className="px-6 py-4 text-center">Target</th>
                        <th className="px-6 py-4 text-center w-36">Actual Value</th>
                        <th className="px-6 py-4 text-center">Improvement %</th>
                        <th className="px-6 py-4 text-center">Achievement Rate</th>
                        <th className="px-6 py-4 text-right">Verdict</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                      {(isEditing ? editingKpis : activePilot.kpis).map((kpi, idx) => {
                        const calculated = getKpiStats(kpi);
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            
                            {/* KPI Title */}
                            <td className="px-6 py-4 font-bold text-slate-800">
                              {kpi.name}
                            </td>

                            {/* Baseline */}
                            <td className="px-6 py-4 text-center text-slate-400">
                              {kpi.baseline} {kpi.unit}
                            </td>

                            {/* Target */}
                            <td className="px-6 py-4 text-center text-blue-600 font-bold">
                              {kpi.target} {kpi.unit}
                            </td>

                            {/* Actual Input Column */}
                            <td className="px-6 py-4 text-center">
                              {isEditing ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    required
                                    value={kpi.actual}
                                    onChange={(e) => handleInputChange(idx, e.target.value)}
                                    className="w-20 px-2 py-1 border border-slate-200 bg-white rounded text-xs font-bold text-slate-800 text-center focus:outline-hidden focus:border-blue-500"
                                  />
                                  <span className="text-[10px] text-slate-400 font-normal">{kpi.unit}</span>
                                </div>
                              ) : (
                                <span className={kpi.actual !== "" ? "font-extrabold text-slate-800" : "text-slate-400 italic font-normal"}>
                                  {kpi.actual !== "" ? `${kpi.actual} ${kpi.unit}` : "Awaiting entry"}
                                </span>
                              )}
                            </td>

                            {/* Improvement */}
                            <td className="px-6 py-4 text-center text-slate-700">
                              {calculated.improvement}
                            </td>

                            {/* Achievement */}
                            <td className="px-6 py-4 text-center text-slate-700">
                              {calculated.achievement}
                            </td>

                            {/* Verdict Status */}
                            <td className="px-6 py-4 text-right">
                              <StatusBadge status={calculated.status} />
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default KpiTracker;
