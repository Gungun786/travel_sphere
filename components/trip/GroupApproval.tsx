'use client';

import { useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  MessageSquare,
  Send,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useTripStore } from '@/store/tripStore';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';
import type { ItineraryVote, VoteStatus, Trip } from '@/types';

export function GroupApproval({ trip }: { trip: Trip }) {
  const votes = useTripStore((s) => s.votes);
  const castVote = useTripStore((s) => s.castVote);
  const resetVotes = useTripStore((s) => s.resetVotes);
  const user = useUserStore((s) => s.user);

  const [votingMemberId, setVotingMemberId] = useState<string | null>(null);
  const [pendingVote, setPendingVote] = useState<VoteStatus>('approve');
  const [reviewText, setReviewText] = useState('');
  const [regenerating, setRegenerating] = useState(false);
  const [planLocked, setPlanLocked] = useState(false);

  const approved = votes.filter((v) => v.vote === 'approve').length;
  const rejected = votes.filter((v) => v.vote === 'reject').length;
  const pending = votes.filter((v) => v.vote === 'pending').length;
  const total = votes.length;
  const approvalPct = total > 0 ? Math.round((approved / total) * 100) : 0;
  const allApproved = approved === total && pending === 0;
  const hasRejections = rejected > 0;
  const rejectionReviews = votes.filter((v) => v.vote === 'reject' && v.review);

  const startVoting = (member: ItineraryVote, choice: VoteStatus) => {
    setVotingMemberId(member.memberId);
    setPendingVote(choice);
    setReviewText(member.review);
  };

  const submitVote = () => {
    if (!votingMemberId) return;
    castVote(votingMemberId, pendingVote, reviewText.trim());
    toast.success(
      pendingVote === 'approve' ? 'Vote submitted: Approved' : 'Vote submitted: Rejected'
    );
    setVotingMemberId(null);
    setReviewText('');
  };

  const cancelVoting = () => {
    setVotingMemberId(null);
    setReviewText('');
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    const feedback = rejectionReviews.map((v) => v.review).filter(Boolean);
    setTimeout(() => {
      resetVotes();
      setRegenerating(false);
      toast.success(
        feedback.length > 0
          ? `Itinerary regenerated using ${feedback.length} feedback note${feedback.length > 1 ? 's' : ''}.`
          : 'Itinerary regenerated.'
      );
    }, 1600);
  };

  const handleLockPlan = () => {
    setPlanLocked(true);
    toast.success('Itinerary locked. Ready for booking!');
  };

  return (
    <div className="mt-8 space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean/10 text-ocean">
          <CheckCircle2 className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight">Group Approval</h2>
          <p className="text-sm text-muted-foreground">
            Every member can review the itinerary and vote before it's locked.
          </p>
        </div>
      </div>

      {/* Summary card */}
      <Card className="overflow-hidden p-0">
        <div className="grid gap-4 p-5 sm:grid-cols-4">
          <StatChip icon={ThumbsUp} label="Approved" value={approved} tint="bg-success/15 text-success" />
          <StatChip icon={ThumbsDown} label="Rejected" value={rejected} tint="bg-destructive/15 text-destructive" />
          <StatChip icon={Clock} label="Pending" value={pending} tint="bg-sunset/15 text-sunset" />
          <div className="flex flex-col justify-center">
            <p className="text-xs text-muted-foreground">Approval Rate</p>
            <p className="font-display text-2xl font-bold">{approvalPct}%</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="border-t border-border px-5 py-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Group consensus</span>
            <span className="font-semibold">{approved}/{total} approved</span>
          </div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-success transition-all duration-700 ease-out"
              style={{ width: `${approvalPct}%` }}
            />
          </div>
        </div>

        {/* Decision banner */}
        <div className="border-t border-border p-5">
          {allApproved && (
            <div className="flex flex-col gap-4 rounded-xl border border-success/30 bg-success/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                <div>
                  <p className="font-semibold text-success">All group members approved the itinerary.</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    You can now lock this plan and continue to booking.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 sm:flex-shrink-0">
                <Button
                  variant="outline"
                  className="gap-1.5"
                  disabled={planLocked}
                  onClick={handleLockPlan}
                >
                  <Lock className="h-3.5 w-3.5" /> {planLocked ? 'Plan Locked' : 'Lock Plan'}
                </Button>
                <Button className="gap-1.5">
                  Continue Booking <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {hasRejections && !allApproved && (
            <div className="space-y-4 rounded-xl border border-sunset/30 bg-sunset/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-sunset" />
                <div className="flex-1">
                  <p className="font-semibold text-sunset">
                    Some members are not satisfied with the itinerary.
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Review the feedback below and regenerate to address their concerns.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="gap-1.5 border-sunset/40 text-sunset hover:bg-sunset/10"
                  disabled={regenerating}
                  onClick={handleRegenerate}
                >
                  {regenerating ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Regenerating…
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5" /> Regenerate Itinerary
                    </>
                  )}
                </Button>
              </div>

              {/* Rejection reasons */}
              {rejectionReviews.length > 0 && (
                <div className="space-y-2 pl-8">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Feedback collected for regeneration:
                  </p>
                  {rejectionReviews.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-start gap-2 rounded-lg border border-border bg-background/60 p-3"
                    >
                      <XCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-destructive" />
                      <div>
                        <p className="text-xs font-medium">{v.memberName}</p>
                        <p className="text-sm text-muted-foreground">{v.review}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!allApproved && !hasRejections && pending === total && (
            <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
              <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
              <div>
                <p className="font-semibold">Waiting for group votes.</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Ask each member to review and submit their vote below.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Member vote cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {votes.map((v) => {
          const isVoting = votingMemberId === v.memberId;
          const isYou = v.memberName === user?.name;

          return (
            <Card
              key={v.id}
              className={`animate-fade-up p-5 transition-all ${
                v.vote === 'approve'
                  ? 'border-success/30'
                  : v.vote === 'reject'
                  ? 'border-destructive/30'
                  : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback className={v.avatarColor}>{v.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {v.memberName}
                      {isYou && (
                        <span className="ml-2 rounded-full bg-ocean/10 px-2 py-0.5 text-[10px] font-medium text-ocean">
                          You
                        </span>
                      )}
                    </p>
                    {v.timestamp && (
                      <p className="text-xs text-muted-foreground">{v.timestamp}</p>
                    )}
                  </div>
                </div>
                <VoteBadge vote={v.vote} />
              </div>

              {/* Review text */}
              {v.review && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-muted/40 p-3">
                  <MessageSquare className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                  <p className="text-sm text-foreground/90">{v.review}</p>
                </div>
              )}

              {/* Voting interface */}
              {isVoting ? (
                <div className="mt-4 space-y-3">
                  <Textarea
                    placeholder="Add a comment (optional)…"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={cancelVoting}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="ml-auto gap-1.5"
                      onClick={submitVote}
                    >
                      <Send className="h-3.5 w-3.5" /> Submit Vote
                    </Button>
                  </div>
                </div>
              ) : v.vote === 'pending' ? (
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 border-success/40 text-success hover:bg-success/10"
                    onClick={() => startVoting(v, 'approve')}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
                    onClick={() => startVoting(v, 'reject')}
                  >
                    <ThumbsDown className="h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => startVoting(v, v.vote)}
                  className="mt-3 text-xs font-medium text-ocean hover:underline"
                >
                  Change vote
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  tint: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-display text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function VoteBadge({ vote }: { vote: VoteStatus }) {
  if (vote === 'approve') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
        <ThumbsUp className="h-3 w-3" /> Approved
      </span>
    );
  }
  if (vote === 'reject') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2.5 py-1 text-xs font-semibold text-destructive">
        <ThumbsDown className="h-3 w-3" /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
      <Clock className="h-3 w-3" /> Pending
    </span>
  );
}
