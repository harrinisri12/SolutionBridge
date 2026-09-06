import React, { useEffect, useState } from 'react';
import { RefreshCw, ScrollText } from 'lucide-react';
import { api } from '../../services/api';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const load = async () => { const response = await api.get('/audit?limit=100'); setLogs(response.data?.logs || []); };
  useEffect(() => { load(); }, []);
  return <div className="space-y-5"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-600">Platform administration</p><h1 className="text-2xl font-bold text-slate-900 mt-1">Audit Logs</h1><p className="text-sm text-slate-500 mt-1">Administrative activity recorded by the platform.</p></div><button onClick={load} title="Refresh" className="p-2 border border-slate-300 rounded-md"><RefreshCw className="w-4 h-4" /></button></div><div className="gov-card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase text-slate-500"><tr><th className="px-4 py-3">Time</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Actor</th><th className="px-4 py-3">Entity</th></tr></thead><tbody className="divide-y divide-slate-100">{logs.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-slate-500"><ScrollText className="w-5 h-5 mx-auto mb-2" />No audit entries found.</td></tr> : logs.map((log) => <tr key={log.id}><td className="px-4 py-3 whitespace-nowrap">{log.created_at ? new Date(log.created_at).toLocaleString() : '-'}</td><td className="px-4 py-3 font-semibold">{log.action || '-'}</td><td className="px-4 py-3">{log.description || '-'}</td><td className="px-4 py-3">{log.profiles?.full_name || log.profiles?.email || '-'}</td><td className="px-4 py-3">{log.entity_type || '-'}</td></tr>)}</tbody></table></div></div>;
};
export default AdminAuditLogs;
