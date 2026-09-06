import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Clock3, Rocket, ShieldAlert, ShieldCheck, Users } from 'lucide-react';
import { api } from '../../services/api';
import { StatCard } from '../../components/Common/Card';

const AdminOverview = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ users: [], departments: [], logs: [] });

  useEffect(() => {
    Promise.allSettled([api.get('/users'), api.get('/departments'), api.get('/audit?limit=8')]).then(([users, departments, logs]) => setData({
      users: users.value?.data?.users || [], departments: departments.value?.data?.departments || [], logs: logs.value?.data?.logs || []
    }));
  }, []);

  const officers = data.users.filter((user) => user.role === 'government' && !user.is_admin);
  const experts = data.users.filter((user) => user.role === 'expert');
  const startups = data.users.filter((user) => user.role === 'startup');
  const active = data.users.filter((user) => user.is_active !== false).length;
  const inactive = data.users.length - active;

  return (
    <div className="space-y-6">
      <section className="bg-slate-900 text-white rounded-lg p-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300"><ShieldAlert className="w-4 h-4" /> Platform administration</div>
        <h1 className="text-2xl font-bold mt-2">Platform overview</h1>
        <p className="text-sm text-slate-300 mt-1">Account health, platform users, and administrative activity.</p>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Government Officers" value={officers.length} icon={Building2} color="blue" onClick={() => navigate('/admin/government-officers')} />
        <StatCard title="Experts" value={experts.length} icon={ShieldCheck} color="amber" onClick={() => navigate('/admin/experts')} />
        <StatCard title="Startups" value={startups.length} icon={Rocket} color="emerald" onClick={() => navigate('/admin/startups')} />
        <StatCard title="Departments" value={data.departments.length} icon={Users} color="purple" onClick={() => navigate('/admin/departments')} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="gov-card p-5 lg:col-span-2">
          <h2 className="font-semibold text-slate-900">Account distribution</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-center">
            <div className="bg-emerald-50 border border-emerald-100 rounded-md p-4"><div className="text-2xl font-bold text-emerald-700">{active}</div><div className="text-xs text-slate-600">Active accounts</div></div>
            <div className="bg-rose-50 border border-rose-100 rounded-md p-4"><div className="text-2xl font-bold text-rose-700">{inactive}</div><div className="text-xs text-slate-600">Inactive accounts</div></div>
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4"><div className="text-2xl font-bold text-slate-800">{data.users.length}</div><div className="text-xs text-slate-600">Total profiles</div></div>
          </div>
        </div>
        <div className="gov-card p-5">
          <div className="flex items-center gap-2"><Clock3 className="w-4 h-4 text-slate-500" /><h2 className="font-semibold text-slate-900">Recent activity</h2></div>
          <div className="mt-3 space-y-3">
            {data.logs.length === 0 ? <p className="text-sm text-slate-500">No administrative activity recorded.</p> : data.logs.slice(0, 5).map((log) => <div key={log.id} className="text-xs border-b border-slate-100 pb-2"><p className="font-medium text-slate-800">{log.description || log.action}</p><p className="text-slate-500 mt-1">{log.created_at ? new Date(log.created_at).toLocaleString() : ''}</p></div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
