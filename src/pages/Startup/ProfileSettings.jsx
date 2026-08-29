import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Building, ShieldCheck, Mail, Globe, UploadCloud, FileText, Trash2, Save } from 'lucide-react';

const ProfileSettings = () => {
  const { addToast } = useApp();

  // Mock Startup Profile details
  const [profile, setProfile] = useState({
    name: "HealthTech Solutions",
    registration: "REG-987654-A (Incorporated 2021)",
    recognition: "DPIIT Recognized (DPIIT-837482)",
    sector: "Healthcare",
    technologies: "AI/ML, IoT Sensors, Telemedicine, Cloud Infrastructure",
    certifications: "ISO 27001, HIPAA Compliant, CE Certified, GDPR Compliant",
    email: "info@healthtech.com",
    website: "https://www.healthtechsolutions.io",
    teamSize: "14 Employees"
  });

  const [documents, setDocuments] = useState([
    { id: "doc-1", name: "DPIIT_Recognition_Certificate.pdf", size: "1.2 MB", date: "2026-08-10" },
    { id: "doc-2", name: "ISO27001_Compliance_Audit.pdf", size: "3.4 MB", date: "2026-08-11" },
    { id: "doc-3", name: "Clinical_Trial_Efficacy_Report.pdf", size: "4.8 MB", date: "2026-08-12" }
  ]);

  const [newDocName, setNewDocName] = useState("");

  const handleProfileSave = (e) => {
    e.preventDefault();
    addToast("Startup verification profile settings successfully saved.", "success");
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newDocName.trim()) {
      addToast("Please input a mock document filename.", "warning");
      return;
    }
    const nameWithExt = newDocName.endsWith(".pdf") ? newDocName : `${newDocName}.pdf`;
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: nameWithExt,
      size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
      date: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [...prev, newDoc]);
    setNewDocName("");
    addToast(`Successfully uploaded document: ${nameWithExt}`, "success");
  };

  const handleDeleteDoc = (id, name) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    addToast(`Archived document: ${name}`, "warning");
  };

  return (
    <div className="p-6 space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 tracking-wide">Startup Registration & Document Vault</h2>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Manage institutional metadata, verify DPIIT recognition state, and host certification certificates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Settings Form */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-850 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            Verification Profile Settings
          </h3>

          <form onSubmit={handleProfileSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Company Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Registration Reference</label>
              <input
                type="text"
                value={profile.registration}
                onChange={(e) => setProfile(prev => ({ ...prev, registration: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">DPIIT Recognition Number</label>
              <input
                type="text"
                value={profile.recognition}
                onChange={(e) => setProfile(prev => ({ ...prev, recognition: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Corporate Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Website URL</label>
              <input
                type="text"
                value={profile.website}
                onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Active Sector</label>
              <input
                type="text"
                value={profile.sector}
                readOnly
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Core Technology Specialties</label>
              <input
                type="text"
                value={profile.technologies}
                onChange={(e) => setProfile(prev => ({ ...prev, technologies: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Compliance Certifications</label>
              <input
                type="text"
                value={profile.certifications}
                onChange={(e) => setProfile(prev => ({ ...prev, certifications: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2 border-t border-slate-105 pt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 font-bold text-xs uppercase tracking-wider text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Profile
              </button>
            </div>
          </form>
        </div>

        {/* Documents Vault (Uploader & Table) */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-6">
          
          {/* Uploader Form */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-850 border-b border-slate-100 pb-2 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-blue-600" />
              Upload Audit Documentation
            </h3>
            
            <form onSubmit={handleUpload} className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Document Title</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. ISO_Renewal_2026"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-blue-650 hover:bg-blue-700 font-bold text-xs uppercase tracking-wider text-white rounded-lg cursor-pointer"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>

          {/* Document list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Vault Certificates</h4>
            <div className="divide-y divide-slate-150">
              {documents.map(d => (
                <div key={d.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-blue-600" />
                    <div>
                      <span className="font-bold text-slate-800 block truncate max-w-[150px]">{d.name}</span>
                      <span className="text-[9px] text-slate-400">{d.size} | Uploaded: {d.date}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteDoc(d.id, d.name)}
                    className="p-1 rounded hover:bg-rose-50 text-rose-500 hover:border-rose-100 border border-transparent transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfileSettings;
