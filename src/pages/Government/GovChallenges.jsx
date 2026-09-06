import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Building2,
  FileCheck2,
  Eye,
  Edit3,
  Trash2,
  Lock,
  ShieldCheck,
  SlidersHorizontal,
  LayoutGrid,
  List,
  CheckCircle2,
  Clock,
  ChevronRight,
  Layers
} from 'lucide-react';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import Modal from '../../components/Common/Modal';
import EmptyState from '../../components/Common/EmptyState';
import GovChallengeDetail from './GovChallengeDetail';

const GovChallenges = () => {
  const {
    challenges,
    DEPARTMENTS,
    CATEGORIES,
    publishChallenge,
    updateChallenge,
    deleteChallenge,
    canManageChallenge,
    currentUser
  } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('grid'); // grid, table
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Modal & View States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Auto-open modal if navigated from overview with openCreateModal flag
  useEffect(() => {
    if (location.state?.openCreateModal) {
      setIsCreateOpen(true);
      // Clean up the location state so it doesn't reopen unexpectedly
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Form State for Create
  const [formData, setFormData] = useState({
    title: '',
    department: currentUser?.department || DEPARTMENTS[0] || 'Ministry of Road Transport and Highways',
    category: CATEGORIES[0] || 'Transport',
    budget: '₹ 75,00,000',
    deadline: '2026-11-30',
    pilotDuration: '6 Months',
    location: 'Designated Pilot Zone',
    problemDescription: '',
    expectedSolution: '',
    eligibilityCriteria: '',
    requiredTechnology: '',
    pilotRequirements: ''
  });

  // Form State for Edit
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: '',
    problemDescription: '',
    technicalRequirements: '',
    eligibilityCriteria: '',
    pilotGuidelines: '',
    status: 'Published'
  });

  // Keep create form department in sync with logged-in user department
  useEffect(() => {
    if (currentUser?.department) {
      setFormData(prev => ({ ...prev, department: currentUser.department }));
    }
  }, [currentUser?.department]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = (isDraft) => {
    if (!formData.title || !formData.problemDescription) {
      alert('Please fill out the Problem Title and Problem Description.');
      return;
    }
    publishChallenge(formData, isDraft);
    setIsCreateOpen(false);
    // Reset form
    setFormData({
      title: '',
      department: currentUser?.department || DEPARTMENTS[0],
      category: CATEGORIES[0],
      budget: '₹ 75,00,000',
      deadline: '2026-11-30',
      pilotDuration: '6 Months',
      location: 'Designated Pilot Zone',
      problemDescription: '',
      expectedSolution: '',
      eligibilityCriteria: '',
      requiredTechnology: '',
      pilotRequirements: ''
    });
  };

  const handleOpenEdit = (ch, e) => {
    e?.stopPropagation();
    if (!canManageChallenge(ch, currentUser)) {
      alert(`Permission Denied: You can only edit challenges belonging to your assigned department (${currentUser?.department || 'Your Department'}).`);
      return;
    }
    setEditingChallenge(ch);
    setEditFormData({
      title: ch.title || '',
      category: ch.category || 'General',
      problemDescription: ch.problemDescription || ch.problemStatement || '',
      technicalRequirements: ch.technicalRequirements || '',
      eligibilityCriteria: ch.eligibilityCriteria || '',
      pilotGuidelines: ch.pilotGuidelines || ch.pilotRequirements || '',
      status: ch.status || 'Published'
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingChallenge) return;
    if (!editFormData.title || !editFormData.problemDescription) {
      alert('Problem Title and Description are required.');
      return;
    }
    await updateChallenge(editingChallenge.id, editFormData);
    setIsEditOpen(false);
    setEditingChallenge(null);
  };

  const handleDeleteChallenge = async (ch, e) => {
    e?.stopPropagation();
    if (!canManageChallenge(ch, currentUser)) {
      alert(`Permission Denied: You can only remove challenges belonging to your assigned department (${currentUser?.department || 'Your Department'}).`);
      return;
    }
    if (window.confirm(`Are you sure you want to delete and remove challenge '${ch.title}'?`)) {
      await deleteChallenge(ch.id);
    }
  };

  // Filtering
  const filteredChallenges = challenges.filter((ch) => {
    const matchesSearch =
      ch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.problemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || ch.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All' || ch.status === selectedStatus;
    const matchesDepartment =
      selectedDepartment === 'All' || ch.department === selectedDepartment;

    return matchesSearch && matchesCategory && matchesStatus && matchesDepartment;
  });

  if (selectedChallenge) {
    return (
      <GovChallengeDetail
        challenge={selectedChallenge}
        onBack={() => setSelectedChallenge(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Procurement Challenges Management</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Government Challenges
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, publish, and manage problem statements for startup innovation procurement.
          </p>
        </div>
        <Button
          variant="secondary"
          icon={Plus}
          onClick={() => setIsCreateOpen(true)}
        >
          Create Challenge
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search input */}
          <div className="relative lg:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search challenges by keyword, ID, or description..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Categories ({CATEGORIES.length})</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs border border-slate-300 rounded-md bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Bottom Filter Info & View Mode Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Showing <strong>{filteredChallenges.length}</strong> of{' '}
            <strong>{challenges.length}</strong> Government Challenges
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-slate-200 text-slate-900 font-bold'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-slate-200 text-slate-900 font-bold'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Challenges List / Grid View */}
      {filteredChallenges.length === 0 ? (
        <EmptyState
          title="No challenges matched your search"
          description="Try clearing some filter criteria or create a new government challenge."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('All');
            setSelectedStatus('All');
            setSelectedDepartment('All');
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChallenges.map((ch) => {
            const canManage = canManageChallenge(ch, currentUser);
            return (
              <div
                key={ch.id}
                className={`gov-card gov-card-hover flex flex-col justify-between p-5 transition-all ${
                  canManage ? 'border-slate-300 bg-white' : 'border-slate-200 bg-slate-50/40'
                }`}
              >
                <div>
                  {/* Header info & Department Authority Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="text-[11px] font-bold text-slate-500 font-mono tracking-wide"
                        title={ch.id}
                      >
                        {ch.id.length > 12 ? `#${ch.id.slice(0, 8).toUpperCase()}` : ch.id}
                      </span>
                      {canManage ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Your Department</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>Read-Only</span>
                        </span>
                      )}
                    </div>
                    <Badge status={ch.status} size="sm" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                    {ch.title}
                  </h3>

                  <p className="text-xs text-blue-700 font-semibold mt-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{ch.department}</span>
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-3 mt-2.5 leading-relaxed">
                    {ch.problemDescription}
                  </p>
                </div>

                {/* Meta stats */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">
                        Category
                      </span>
                      <span className="font-semibold text-slate-800">
                        {ch.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">
                        Applications
                      </span>
                      <span className="font-semibold text-blue-700">
                        {ch.applicationsCount || 0} Submissions
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">
                        Deadline
                      </span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        {ch.deadline || '2026-11-30'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">
                        Pilot Budget
                      </span>
                      <span className="font-semibold text-emerald-800">
                        {ch.budget || '₹ 75,00,000'}
                      </span>
                    </div>
                  </div>

                  {/* Actions based on Department Authorization */}
                  <div className="pt-2 border-t border-slate-100/80 flex items-center gap-2">
                    <Button
                      variant={canManage ? 'outline' : 'outline'}
                      size="sm"
                      className="flex-1 text-xs font-semibold"
                      icon={Eye}
                      onClick={() => setSelectedChallenge(ch)}
                    >
                      {canManage ? 'View Details' : 'View Details & Requirements'}
                    </Button>

                    {canManage && (
                      <>
                        <button
                          onClick={(e) => handleOpenEdit(ch, e)}
                          className="h-8 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Edit Problem Statement"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={(e) => handleDeleteChallenge(ch, e)}
                          className="h-8 px-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove Challenge"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="gov-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse gov-table">
              <thead>
                <tr>
                  <th>Challenge Title</th>
                  <th>Department</th>
                  <th>Authority</th>
                  <th>Category</th>
                  <th>Deadline</th>
                  <th>Applications</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChallenges.map((ch) => {
                  const canManage = canManageChallenge(ch, currentUser);
                  return (
                    <tr key={ch.id} className={canManage ? 'bg-blue-50/20' : ''}>
                      <td>
                        <div className="font-semibold text-slate-900 text-sm">
                          {ch.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {ch.id}
                        </div>
                      </td>
                      <td>
                        <span className="text-xs text-slate-800 font-medium">
                          {ch.department}
                        </span>
                      </td>
                      <td>
                        {canManage ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Your Dept</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>Read-Only</span>
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 border border-slate-200">
                          {ch.category}
                        </span>
                      </td>
                      <td>
                        <div className="text-xs text-slate-700 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {ch.deadline}
                        </div>
                      </td>
                      <td>
                        <span className="font-bold text-blue-700 text-xs">
                          {ch.applicationsCount || 0}
                        </span>
                      </td>
                      <td>
                        <Badge status={ch.status} size="sm" />
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedChallenge(ch)}
                          >
                            View
                          </Button>
                          {canManage && (
                            <>
                              <button
                                onClick={(e) => handleOpenEdit(ch, e)}
                                className="h-7 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Edit Problem Statement"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={(e) => handleDeleteChallenge(ch, e)}
                                className="h-7 px-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                                title="Remove Challenge"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE CHALLENGE FORM MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Government Challenge"
        subtitle={`Problem statements are published under your designated department: ${currentUser?.department || 'Government Department'}`}
        maxWidth="max-w-3xl"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => handleCreateSubmit(true)}
            >
              Save Draft
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleCreateSubmit(false)}
            >
              Publish Challenge
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          {/* Department Locking Notice */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md flex items-center justify-between text-blue-900">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                Publishing Authority: <strong>{currentUser?.department || 'Government Department'}</strong>
              </span>
            </div>
            <span className="text-[10px] font-bold bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded font-mono">
              OFFICER CREDENTIAL VERIFIED
            </span>
          </div>

          {/* Row 1 */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Problem Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Real-time Potable Water Quality Monitoring in Municipal Reservoirs"
              className="w-full border border-slate-300 rounded-md p-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Row 2: Department & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Government Department *
              </label>
              {currentUser?.isAdmin ? (
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-md p-2 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full border border-slate-300 bg-slate-100 rounded-md p-2 text-xs text-slate-800 font-semibold flex items-center justify-between">
                  <span>{currentUser?.department || 'Ministry of Road Transport and Highways'}</span>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </div>
              )}
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Sector / Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-md p-2 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Problem Description */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Problem Description & Pain Points *
            </label>
            <textarea
              name="problemDescription"
              rows={3}
              value={formData.problemDescription}
              onChange={handleInputChange}
              placeholder="Describe the operational challenge, current manual bottlenecks, and public impact..."
              className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Row 4: Expected Solution */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Expected Innovative Solution & Deliverables
            </label>
            <textarea
              name="expectedSolution"
              rows={2}
              value={formData.expectedSolution}
              onChange={handleInputChange}
              placeholder="What hardware/software system or capabilities are expected from startups?"
              className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Row 5: Eligibility & Tech */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Eligibility Criteria (DPIIT / TRL / Certs)
              </label>
              <textarea
                name="eligibilityCriteria"
                rows={2}
                value={formData.eligibilityCriteria}
                onChange={handleInputChange}
                placeholder="e.g., DPIIT recognized, TRL-7+, ISO 9001 compliance"
                className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Required Technology / Capabilities
              </label>
              <textarea
                name="requiredTechnology"
                rows={2}
                value={formData.requiredTechnology}
                onChange={handleInputChange}
                placeholder="e.g., IoT Spectrophotometry, Edge AI, LoRaWAN telemetry"
                className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 6: Deadline, Pilot Duration & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Pilot Duration
              </label>
              <input
                type="text"
                name="pilotDuration"
                value={formData.pilotDuration}
                onChange={handleInputChange}
                placeholder="e.g., 6 Months"
                className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Estimated Pilot Budget
              </label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="e.g., ₹ 85,00,000"
                className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 7: Pilot Requirements */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Pilot Scope & Target Requirements
            </label>
            <textarea
              name="pilotRequirements"
              rows={2}
              value={formData.pilotRequirements}
              onChange={handleInputChange}
              placeholder="e.g., Deploy 25 inline nodes in Varanasi for 6 months. Maintain 99.5% uptime and detect spikes in <15 minutes."
              className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </Modal>

      {/* EDIT PROBLEM STATEMENT MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Problem Statement"
        subtitle={`Editing statement for: ${editingChallenge?.department || currentUser?.department}`}
        maxWidth="max-w-3xl"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEditSubmit}
            >
              Save Statement Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
          {/* Department Identification */}
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-md flex items-center justify-between text-emerald-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Assigned Department: <strong>{editingChallenge?.department || currentUser?.department}</strong>
              </span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded font-mono">
              DEPARTMENT MODIFICATION AUTHORIZED
            </span>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Problem Title *
            </label>
            <input
              type="text"
              name="title"
              value={editFormData.title}
              onChange={handleEditInputChange}
              className="w-full border border-slate-300 rounded-md p-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Sector & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Sector / Category
              </label>
              <select
                name="category"
                value={editFormData.category}
                onChange={handleEditInputChange}
                className="w-full border border-slate-300 rounded-md p-2 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Challenge Status
              </label>
              <select
                name="status"
                value={editFormData.status}
                onChange={handleEditInputChange}
                className="w-full border border-slate-300 rounded-md p-2 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Published">Published (Open for Startup Proposals)</option>
                <option value="Draft">Draft (Internal Working Copy)</option>
                <option value="Closed">Closed (Submissions Concluded)</option>
              </select>
            </div>
          </div>

          {/* Problem Statement */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Problem Statement & Operational Challenge *
            </label>
            <textarea
              name="problemDescription"
              rows={4}
              value={editFormData.problemDescription}
              onChange={handleEditInputChange}
              className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Technical Specifications */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Technical Requirements & Specifications
            </label>
            <textarea
              name="technicalRequirements"
              rows={3}
              value={editFormData.technicalRequirements}
              onChange={handleEditInputChange}
              placeholder="e.g., IoT Telemetry, AI Edge Detection, GIS Integration, REST APIs..."
              className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Eligibility Criteria */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Startup Eligibility Criteria
            </label>
            <textarea
              name="eligibilityCriteria"
              rows={2}
              value={editFormData.eligibilityCriteria}
              onChange={handleEditInputChange}
              placeholder="e.g., DPIIT Recognized, TRL-7+, ISO 9001, CERT-In compliance..."
              className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Pilot Guidelines */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Pilot Sandbox Guidelines & Target Deployments
            </label>
            <textarea
              name="pilotGuidelines"
              rows={2}
              value={editFormData.pilotGuidelines}
              onChange={handleEditInputChange}
              placeholder="e.g., Field testing deployment specs, target SLAs, milestone acceptance benchmarks..."
              className="w-full border border-slate-300 rounded-md p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GovChallenges;
