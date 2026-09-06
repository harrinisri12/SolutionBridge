import React, { useEffect, useState } from 'react';
import { UserPlus, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Common/Modal';
import Button from '../../components/Common/Button';

const initialForms = { government: { full_name: '', email: '', phone: '', organization: '', department_id: '', temporary_password: '' }, expert: { full_name: '', email: '', phone: '', organization: '', specialization: '', temporary_password: '' } };
const formatDate = (value) => value ? new Date(value).toLocaleDateString() : '-';

const AdminUsers = ({ type }) => {
  const { addToast } = useApp();
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(initialForms[type]);
  const [loading, setLoading] = useState(true);
  const isGovernment = type === 'government';

  const load = async () => {
    setLoading(true);
    const [usersResponse, departmentsResponse] = await Promise.allSettled([api.get(`/users?role=${type}`), api.get('/departments')]);
    setUsers(usersResponse.value?.data?.users || []);
    setDepartments(departmentsResponse.value?.data?.departments || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [type]);

  const toggleStatus = async (user) => {
    try { await api.patch(`/users/${user.id}/status`, { is_active: user.is_active === false }); addToast('Account status updated', 'success'); load(); }
    catch (error) { addToast(error.message || 'Unable to update account status', 'error'); }
  };
  const toggleVerification = async (user) => {
    const expert = Array.isArray(user.expert) ? user.expert[0] : user.expert;
    try { await api.patch(`/users/${user.id}/expert-verification`, { verified: !expert?.verified }); addToast('Expert verification updated', 'success'); load(); }
    catch (error) { addToast(error.message || 'Unable to update verification', 'error'); }
  };
  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post(`/users/${type}`, { ...form, temporary_password: form.temporary_password || undefined });
      addToast(`${isGovernment ? 'Government officer' : 'Expert'} added`, 'success'); setIsOpen(false); setForm(initialForms[type]); load();
    } catch (error) { addToast(error.message || 'Unable to create account', 'error'); }
  };
  const setField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  return <div className="space-y-5">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-blue-700">Platform administration</p><h1 className="text-2xl font-bold text-slate-900 mt-1">{isGovernment ? 'Government Officers' : 'Experts'}</h1><p className="text-sm text-slate-500 mt-1">{isGovernment ? 'Manage official accounts and department assignments.' : 'Manage expert accounts, verification, and access.'}</p></div><div className="flex gap-2"><button onClick={load} title="Refresh" className="p-2 border border-slate-300 rounded-md text-slate-600"><RefreshCw className="w-4 h-4" /></button><Button icon={UserPlus} onClick={() => setIsOpen(true)}>Add {isGovernment ? 'Government Officer' : 'Expert'}</Button></div></div>
    <div className="gov-card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase text-slate-500"><tr>{(isGovernment ? ['Officer name', 'Official email', 'Department', 'Organization'] : ['Expert name', 'Email', 'Expertise', 'Organization', 'Verification']).map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}<th className="px-4 py-3">Status</th><th className="px-4 py-3">Date added</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{loading ? <tr><td colSpan={8} className="p-8 text-center text-slate-500">Loading accounts...</td></tr> : users.length === 0 ? <tr><td colSpan={8} className="p-8 text-center text-slate-500">No accounts found.</td></tr> : users.map((user) => { const expert = Array.isArray(user.expert) ? user.expert[0] : user.expert; return <tr key={user.id}><td className="px-4 py-3 font-semibold text-slate-900">{user.full_name || '-'}</td><td className="px-4 py-3 text-slate-600">{user.email}</td>{isGovernment ? <><td className="px-4 py-3">{user.department?.name || '-'}</td><td className="px-4 py-3">{user.organization || '-'}</td></> : <><td className="px-4 py-3">{expert?.expertise || '-'}</td><td className="px-4 py-3">{expert?.organization || user.organization || '-'}</td><td className="px-4 py-3"><button onClick={() => toggleVerification(user)} className="text-xs font-semibold text-blue-700">{expert?.verified ? 'Verified' : 'Verify'}</button></td></>}<td className="px-4 py-3">{user.is_active === false ? 'Inactive' : 'Active'}</td><td className="px-4 py-3">{formatDate(user.created_at)}</td><td className="px-4 py-3"><button onClick={() => toggleStatus(user)} className="text-xs font-semibold text-blue-700">{user.is_active === false ? 'Activate' : 'Deactivate'}</button></td></tr>; })}</tbody></table></div>
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Add ${isGovernment ? 'Government Officer' : 'Expert'}`}><form onSubmit={submit} className="space-y-3">{[['full_name', 'Full name', 'text'], ['email', 'Official email', 'email'], ['phone', 'Phone', 'text'], ['organization', 'Organization', 'text'], ...(isGovernment ? [] : [['specialization', 'Expertise', 'text']]), ['temporary_password', 'Password', 'password']].map(([name, label, inputType]) => <label key={name} className="block text-sm font-medium text-slate-700">{label}<input required={['full_name', 'email'].includes(name)} type={inputType} value={form[name]} onChange={(event) => setField(name, event.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" /></label>)}{isGovernment && <label className="block text-sm font-medium text-slate-700">Department<select value={form.department_id} onChange={(event) => setField('department_id', event.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"><option value="">Select department</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></label>}<div className="flex justify-end gap-2 pt-3"><Button variant="outline" type="button" onClick={() => setIsOpen(false)}>Cancel</Button><Button type="submit">Add account</Button></div></form></Modal>
  </div>;
};
export default AdminUsers;
