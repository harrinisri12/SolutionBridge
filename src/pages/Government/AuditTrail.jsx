import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, History, RefreshCw } from 'lucide-react';

const AuditTrail = () => {
  const { auditLogs } = useApp();

  const [searchUser, setSearchUser] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredLogs = auditLogs.filter(log => {
    const matchesUser = log.user.toLowerCase().includes(searchUser.toLowerCase()) ||
                        log.action.toLowerCase().includes(searchUser.toLowerCase());
    const matchesModule = moduleFilter === "All" || log.module === moduleFilter;
    const matchesStatus = statusFilter === "All" || log.status === statusFilter;
    return matchesUser && matchesModule && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 tracking-wide">Platform Audit Trail Logs</h2>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Verify auditable platform events, contract signatures, evaluations, and mock banking payouts in an immutable system ledger.</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          
          {/* Search */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search user or action description..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-205 bg-white rounded-xl text-xs font-semibold focus:outline-hidden"
            />
          </div>

          {/* Module Select */}
          <div className="flex gap-2">
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="px-3 py-2 border border-slate-205 bg-white rounded-xl text-xs font-semibold text-slate-650 focus:outline-hidden"
            >
              <option value="All">All Modules</option>
              <option value="Challenges">Challenges</option>
              <option value="Applications">Applications</option>
              <option value="Screening">Screening</option>
              <option value="Evaluations">Evaluations</option>
              <option value="Contracts">Contracts</option>
              <option value="Pilot Management">Pilot Management</option>
              <option value="KPIs">KPIs</option>
              <option value="Validation">Validation</option>
              <option value="Payments">Payments</option>
              <option value="Scale-Up">Scale-Up</option>
              <option value="Session Control">Session Control</option>
            </select>

            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-205 bg-white rounded-xl text-xs font-semibold text-slate-650 focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 w-12 text-center">Log ID</th>
                <th className="px-6 py-4">Session User</th>
                <th className="px-6 py-4">Action Descriptor</th>
                <th className="px-6 py-4">Module Focus</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">System Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-500">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-center font-semibold text-slate-400">
                    {log.id.split('-')[1]?.slice(-4) || "0000"}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {log.action}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-150 font-bold text-[9px] uppercase tracking-wide">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === "Success" 
                        ? "bg-emerald-50 text-emerald-800" 
                        : "bg-rose-50 text-rose-800"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400">
                    {log.date}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No matching audit records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AuditTrail;
