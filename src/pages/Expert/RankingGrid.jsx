import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Zap, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RankingGrid = () => {
  const { applications, evaluations, challenges, createPilot, addToast } = useApp();
  const navigate = useNavigate();

  // Aggregate evaluations to calculate scores
  const getStartupRankings = () => {
    // Group evaluations by application ID
    const appEvaluationsMap = evaluations.reduce((acc, evalObj) => {
      if (!acc[evalObj.applicationId]) {
        acc[evalObj.applicationId] = [];
      }
      acc[evalObj.applicationId].push(evalObj);
      return acc;
    }, {});

    // Map each application to its startup name, challenge title, and calculate weighted average score
    const rankings = applications.map(app => {
      const appEvals = appEvaluationsMap[app.id] || [];
      
      // Look up startup details dynamically
      const startupName = app.startupName || (app.startups && app.startups.name) || "Startup Proposer";

      const challenge = challenges.find(c => c.id === app.challengeId) || { title: "Challenge", evaluationCriteria: [] };

      let overallScore = 0;
      let gradingComments = [];

      if (appEvals.length > 0) {
        // Average the scores across all expert reviews
        const totalEvaluatedScore = appEvals.reduce((sum, currentEval) => {
          const s = currentEval.scores;
          if (!s) return sum + (currentEval.weighted_score ? currentEval.weighted_score * 10 : 0);
          // Calculate weighted score for this evaluation
          const weightedScore = 
            ((s.problemUnderstanding || 0) * 0.15) +
            ((s.technicalFeasibility || 0) * 0.20) +
            ((s.innovation || 0) * 0.15) +
            ((s.scalability || 0) * 0.15) +
            ((s.costEffectiveness || 0) * 0.15) +
            ((s.teamCapability || 0) * 0.10) +
            ((s.security || 0) * 0.10);
          
          if (currentEval.comments) gradingComments.push(currentEval.comments);
          return sum + weightedScore;
        }, 0);
        
        overallScore = Math.round(totalEvaluatedScore / appEvals.length);
      } else if (app.scores?.overallScore) {
        overallScore = Math.round(app.scores.overallScore * 10);
      } else {
        overallScore = 0;
      }

      // Determine recommendation flag
      let recommendation = "Review";
      if (overallScore >= 85) recommendation = "Pilot";
      else if (overallScore < 60) recommendation = "Reject";

      return {
        ...app,
        startupName,
        challengeTitle: challenge.title,
        budget: challenge.budget,
        location: challenge.location,
        score: overallScore,
        recommendation,
        comments: gradingComments
      };
    });

    // Sort descending by score
    return rankings.sort((a, b) => b.score - a.score);
  };

  const rankings = getStartupRankings();

  const handleLaunchPilot = (rank) => {
    // Direct link to create pilot configuration page with pre-filled fields
    navigate(`/gov/pilots`, { state: { prefilledApp: rank } });
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col text-left">
        <h2 className="text-xl font-bold text-slate-800 tracking-wide">Startup Rankings & Recommendations</h2>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Aggregated scoring summaries derived from expert reviews. Shortlisted leaders can be directly selected for sandbox pilot launch.</p>
      </div>

      {/* Rankings List */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto text-left">
          <table className="w-full text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 w-16 text-center">Rank</th>
                <th className="px-6 py-4">Startup User</th>
                <th className="px-6 py-4">Challenge Focus</th>
                <th className="px-6 py-4 text-center">Efficacy Score</th>
                <th className="px-6 py-4">Score Indicator</th>
                <th className="px-6 py-4">Recommendation</th>
                <th className="px-6 py-4 text-right">Pilot Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {rankings.map((rank, idx) => {
                const getScoreColor = (score) => {
                  if (score >= 85) return "text-emerald-600 bg-emerald-50 border-emerald-100";
                  if (score >= 70) return "text-amber-600 bg-amber-50 border-amber-100";
                  return "text-rose-600 bg-rose-50 border-rose-100";
                };

                const getProgressBarColor = (score) => {
                  if (score >= 85) return "bg-emerald-500";
                  if (score >= 70) return "bg-amber-500";
                  return "bg-rose-500";
                };

                return (
                  <tr key={rank.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Rank */}
                    <td className="px-6 py-4 text-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        idx === 0 
                          ? "bg-amber-100 text-amber-800 border border-amber-200" 
                          : idx === 1 
                            ? "bg-slate-100 text-slate-700 border border-slate-200" 
                            : "bg-slate-50 text-slate-500 border border-slate-100"
                      }`}>
                        {idx + 1}
                      </span>
                    </td>

                    {/* Startup */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-800 text-sm">{rank.startupName}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{rank.id.toUpperCase()}</span>
                      </div>
                    </td>

                    {/* Challenge */}
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-600">{rank.challengeTitle}</span>
                    </td>

                    {/* Score */}
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg border font-bold text-xs ${getScoreColor(rank.score)}`}>
                        {rank.score} / 100
                      </span>
                    </td>

                    {/* Progress Bar Indicator */}
                    <td className="px-6 py-4 w-44">
                      <div className="flex flex-col gap-1">
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${getProgressBarColor(rank.score)}`} style={{ width: `${rank.score}%` }}></div>
                        </div>
                      </div>
                    </td>

                    {/* Recommendation status */}
                    <td className="px-6 py-4">
                      {rank.recommendation === "Pilot" ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                          <Zap className="w-3.5 h-3.5 fill-emerald-500" />
                          Launch Pilot
                        </span>
                      ) : rank.recommendation === "Review" ? (
                        <span className="inline-flex items-center gap-1.5 text-amber-700 font-bold bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full">
                          <AlertCircle className="w-3.5 h-3.5 fill-amber-500" />
                          Under Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-rose-700 font-bold bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Not Recommended
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {rank.status !== "Pilot Selected" && rank.status !== "Rejected" ? (
                        <button
                          onClick={() => handleLaunchPilot(rank)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 font-bold text-[10px] uppercase tracking-wider text-white rounded-lg shadow-sm transition-all cursor-pointer"
                        >
                          Launch Pilot
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase italic">
                          {rank.status === "Pilot Selected" ? "Pilot Active" : "Rejected"}
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })}
              {rankings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No graded candidates available yet.
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

export default RankingGrid;
