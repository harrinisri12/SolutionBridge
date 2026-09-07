import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Award,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  Search,
  Check,
  ArrowRight
} from 'lucide-react';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import Badge from '../Common/Badge';
import { applicationService } from '../../services/applicationService';
import { useApp } from '../../context/AppContext';

/**
 * AssignExpertModal Component
 * Allows Government Officers to manually assign a verified domain expert to a startup application.
 */
const AssignExpertModal = ({ isOpen, onClose, application, onAssigned }) => {
  const { assignExpert, addToast } = useApp();

  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [step, setStep] = useState('select'); // 'select' | 'confirm'

  // Fetch real verified active experts from database via backend API
  useEffect(() => {
    if (!isOpen) {
      setSelectedExpert(null);
      setStep('select');
      setSearchTerm('');
      return;
    }

    let isMounted = true;
    const fetchExperts = async () => {
      try {
        setLoading(true);
        const verifiedExperts = await applicationService.getVerifiedExperts();
        if (isMounted) {
          setExperts(verifiedExperts);
        }
      } catch (err) {
        console.error('Error fetching verified experts:', err);
        if (isMounted) {
          addToast('Failed to load verified experts from database.', 'error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchExperts();

    return () => {
      isMounted = false;
    };
  }, [isOpen, addToast]);

  if (!application) return null;

  // Filtered experts based on search query
  const filteredExperts = experts.filter((u) => {
    const expert = Array.isArray(u.expert) ? u.expert[0] : u.expert;
    const name = (u.full_name || '').toLowerCase();
    const org = (expert?.organization || u.organization || '').toLowerCase();
    const expertise = (expert?.expertise || '').toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || org.includes(q) || expertise.includes(q);
  });

  const handleConfirmAssignment = async () => {
    if (!selectedExpert || !application?.id) return;

    try {
      setSubmitting(true);
      const expertRec = Array.isArray(selectedExpert.expert)
        ? selectedExpert.expert[0]
        : selectedExpert.expert;
      const targetExpertId = expertRec?.id || selectedExpert.id;

      await assignExpert(application.id, targetExpertId);

      if (onAssigned) {
        onAssigned({
          expertId: targetExpertId,
          expertName: selectedExpert.full_name,
          expertOrg: expertRec?.organization || selectedExpert.organization || 'Technical Expert'
        });
      }

      onClose();
    } catch (err) {
      console.error('Failed to confirm assignment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Domain Expert"
      subtitle="Select a verified domain evaluator to conduct a 5-factor scoring audit."
      maxWidth="max-w-3xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (step === 'confirm') {
                setStep('select');
              } else {
                onClose();
              }
            }}
            disabled={submitting}
          >
            {step === 'confirm' ? 'Back to Selection' : 'Cancel'}
          </Button>

          {step === 'select' ? (
            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              disabled={!selectedExpert || loading}
              onClick={() => setStep('confirm')}
            >
              Continue to Confirm
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon={UserCheck}
              disabled={submitting}
              onClick={handleConfirmAssignment}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {submitting ? 'Assigning Expert...' : 'Confirm Assignment'}
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Application Summary Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
              Target Application Dossier
            </span>
            <Badge status={application.statusDisplay || application.status || 'Under Review'} size="sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-slate-700">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Challenge</span>
              <span className="font-bold text-slate-900 line-clamp-1">
                {application.challengeTitle}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Startup Name</span>
              <span className="font-semibold text-slate-900">
                {application.startupName}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Application ID</span>
              <span className="font-mono text-slate-700">
                {application.id}
              </span>
            </div>
          </div>
        </div>

        {step === 'select' ? (
          <>
            {/* Search Input */}
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter verified experts by name, organization, or domain..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {filteredExperts.length} Verified {filteredExperts.length === 1 ? 'Expert' : 'Experts'} Available
              </span>
            </div>

            {/* Experts List from Database */}
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-xs">Loading verified experts from database...</span>
              </div>
            ) : filteredExperts.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">No Verified Experts Found</h4>
                <p className="text-slate-500 text-xs max-w-md mx-auto">
                  {searchTerm
                    ? 'No verified experts matched your search terms. Try clearing the filter.'
                    : 'There are currently no active verified expert profiles in the platform. Platform Admins can provision and verify experts in Admin Portal.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {filteredExperts.map((expertUser) => {
                  const expertRec = Array.isArray(expertUser.expert)
                    ? expertUser.expert[0]
                    : expertUser.expert;
                  const isSelected = selectedExpert?.id === expertUser.id;

                  return (
                    <div
                      key={expertUser.id}
                      onClick={() => setSelectedExpert(expertUser)}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">
                            {expertUser.full_name}
                          </h4>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Verified ✓
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{expertRec?.organization || expertUser.organization || 'Independent Evaluator'}</span>
                        </div>

                        {expertRec?.expertise && (
                          <div className="text-[11px] text-slate-600">
                            <strong className="text-slate-700">Expertise:</strong>{' '}
                            <span>{expertRec.expertise}</span>
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 flex sm:justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExpert(expertUser);
                          }}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Selected
                            </>
                          ) : (
                            'Select'
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* CONFIRMATION VIEW (STEP 4) */
          <div className="space-y-4 py-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <span>Confirm Expert Assignment</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                Please review and confirm the expert evaluation assignment. Upon confirmation, the assigned expert will receive an automated platform notification and immediate access to review this proposal dossier.
              </p>

              <div className="bg-white border border-blue-200 rounded-md p-3 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Application:</span>
                  <span className="font-bold text-slate-900 text-right">
                    {application.challengeTitle} ({application.startupName})
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Selected Expert:</span>
                  <span className="font-bold text-blue-900 text-right">
                    {selectedExpert?.full_name}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Organization:</span>
                  <span className="font-medium text-slate-800 text-right">
                    {selectedExpert?.expert?.organization || selectedExpert?.organization || 'Technical Evaluator'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Expertise Domain:</span>
                  <span className="font-medium text-slate-800 text-right">
                    {selectedExpert?.expert?.expertise || 'Innovation & Technology'}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Verification:</span>
                  <span className="font-bold text-emerald-700 text-right flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified by Platform Admin
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AssignExpertModal;
