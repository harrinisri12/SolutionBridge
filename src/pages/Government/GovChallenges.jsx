import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Building2,
  FileCheck2,
  Eye,
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

const GovChallenges = () => {
  const { challenges, DEPARTMENTS, CATEGORIES, publishChallenge } = useApp();

  const [viewMode, setViewMode] = useState('grid'); // grid, table
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    department: DEPARTMENTS[0] || 'Water Resources Department',
    category: CATEGORIES[0] || 'Water',
    budget: '₹ 75,00,000',
    deadline: '2026-11-30',
    pilotDuration: '6 Months',
    location: 'District Pilot Zone',
    problemDescription: '',
    expectedSolution: '',
    eligibilityCriteria: '',
    requiredTechnology: '',
    pilotRequirements: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      department: DEPARTMENTS[0],
      category: CATEGORIES[0],
      budget: '₹ 75,00,000',
      deadline: '2026-11-30',
      pilotDuration: '6 Months',
      location: 'District Pilot Zone',
      problemDescription: '',
      expectedSolution: '',
      eligibilityCriteria: '',
      requiredTechnology: '',
      pilotRequirements: ''
    });
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
          + Create Challenge
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
          {filteredChallenges.map((ch) => (
            <div
              key={ch.id}
              className="gov-card gov-card-hover flex flex-col justify-between p-5 transition-all"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-500 font-mono">
                    {ch.id}
                  </span>
                  <Badge status={ch.status} size="sm" />
                </div>

                <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                  {ch.title}
                </h3>

                <p className="text-xs text-blue-700 font-medium mt-1">
                  {ch.department}
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
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {ch.deadline}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">
                      Pilot Budget
                    </span>
                    <span className="font-semibold text-emerald-800">
                      {ch.budget}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold"
                  icon={Eye}
                  onClick={() => setSelectedChallenge(ch)}
                >
                  View Details & Requirements
                </Button>
              </div>
            </div>
          ))}
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
                  <th>Category</th>
                  <th>Deadline</th>
                  <th>Applications</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredChallenges.map((ch) => (
                  <tr key={ch.id}>
                    <td>
                      <div className="font-semibold text-slate-900 text-sm">
                        {ch.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {ch.id}
                      </div>
                    </td>
                    <td>
                      <span className="text-xs text-slate-700 font-medium">
                        {ch.department}
                      </span>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedChallenge(ch)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
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
        subtitle="Specify problem definition, eligibility criteria, and pilot deployment requirements."
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

      {/* CHALLENGE DETAILS MODAL */}
      {selectedChallenge && (
        <Modal
          isOpen={!!selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          title={selectedChallenge.title}
          subtitle={`${selectedChallenge.id} • ${selectedChallenge.department}`}
          maxWidth="max-w-3xl"
          footer={
            <Button
              variant="outline"
              onClick={() => setSelectedChallenge(null)}
            >
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Category
                </span>
                <span className="font-semibold text-slate-800 text-sm">
                  {selectedChallenge.category}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Status
                </span>
                <Badge status={selectedChallenge.status} size="sm" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Application Deadline
                </span>
                <span className="font-semibold text-slate-800 text-sm">
                  {selectedChallenge.deadline}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Pilot Budget
                </span>
                <span className="font-semibold text-emerald-800 text-sm">
                  {selectedChallenge.budget}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                Problem Statement & Operational Context
              </h4>
              <p className="text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-200">
                {selectedChallenge.problemDescription}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                Expected Solution
              </h4>
              <p className="text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-200">
                {selectedChallenge.expectedSolution || 'Automated high-reliability system matching government operational benchmarks.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Eligibility Criteria
                </h4>
                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-700">
                  {selectedChallenge.eligibilityCriteria || 'DPIIT recognized startups with proven prototypes.'}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Required Technology
                </h4>
                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-700">
                  {selectedChallenge.requiredTechnology || 'IoT, Edge Computing, Telemetry'}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                Pilot Deployment Requirements
              </h4>
              <div className="bg-blue-50/60 p-3 rounded border border-blue-200 text-blue-900 leading-relaxed">
                {selectedChallenge.pilotRequirements || `Duration: ${selectedChallenge.pilotDuration}. Location: ${selectedChallenge.location}.`}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GovChallenges;
