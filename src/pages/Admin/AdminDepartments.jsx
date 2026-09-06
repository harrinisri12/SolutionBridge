import React, { useEffect, useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

const AdminDepartments = () => {
  const { addToast } = useApp();
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', contact_email: '' });
  const [editing, setEditing] = useState(null);
  const load = async () => { const response = await api.get('/departments'); setDepartments(response.data?.departments || []); };
  useEffect(() => { load(); }, []);
  const submit = async (event) => { event.preventDefault(); try { if (editing) await api.put(`/departments/${editing}`, form); else await api.post('/departments', form); addToast('Department saved', 'success'); setEditing(null); setForm({ name: '', description: '', contact_email: '' }); load(); } catch (error) { addToast(error.message || 'Unable to save department', 'error'); } };
  const FormIcon = editing ? Save : Plus;
  return <div className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-wider text-blue-700">Platform administration</p><h1 className="text-2xl font-bold text-slate-900 mt-1">Departments</h1><p className="text-sm text-slate-500 mt-1">Maintain the government department directory used by officer accounts.</p></div><div className="grid grid-cols-1 lg:grid-cols-3 gap-4"><form onSubmit={submit} className="gov-card p-5 space-y-3"><h2 className="font-semibold">{editing ? 'Edit department' : 'Add department'}</h2>{[['name', 'Name'], ['contact_email', 'Contact email'], ['description', 'Description']].map(([name, label]) => <label key={name} className="block text-sm font-medium text-slate-700">{label}<input required={name === 'name'} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" /></label>)}<button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white"><FormIcon className="w-4 h-4" />{editing ? 'Save changes' : 'Add department'}</button></form><div className="gov-card overflow-x-auto lg:col-span-2"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase text-slate-500"><tr><th className="px-4 py-3">Department</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{departments.map((department) => <tr key={department.id}><td className="px-4 py-3"><div className="font-semibold">{department.name}</div><div className="text-xs text-slate-500">{department.description || '-'}</div></td><td className="px-4 py-3">{department.contact_email || '-'}</td><td className="px-4 py-3"><button className="text-xs font-semibold text-blue-700" onClick={() => { setEditing(department.id); setForm({ name: department.name || '', description: department.description || '', contact_email: department.contact_email || '' }); }}><Save className="inline w-3 h-3 mr-1" />Edit</button></td></tr>)}</tbody></table></div></div></div>;
};
export default AdminDepartments;
