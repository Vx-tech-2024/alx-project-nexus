import React from 'react';
import { useState } from 'react';
import { Check, AlertCircle, Clock, Users, TrendingUp, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from './subcomponents/button';
import { Card } from './subcomponents/card';
import { Badge } from './subcomponents/badge';
import { useApp } from '../context/AppContext';
import { Toaster } from './subcomponents/sonner';
import { toast } from "sonner";
import { Poll, PollOption } from '../types/index';
import { Page } from '../types/index';
interface PollVotingPageProps {
  pollId: string;
  onNavigate: (page: Page, pollId?: string) => void;

}

export const PollVotingPage: React.FC<PollVotingPageProps> = ({ pollId, onNavigate }) => {
  const { user, polls, vote, hasVoted } = useApp();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const poll = polls.find(p => p.id === pollId);
  const alreadyVoted = hasVoted(pollId);

  if (!poll) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Poll Not Found</h2>
          <p className="text-gray-600 mb-6">
            This poll doesn't exist or has been removed.
          </p>
          <Button onClick={() => onNavigate('home')}>
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  const formatTimeRemaining = () => {
    if (!poll.expiresAt) return null;
    const now = new Date();
    const diff = poll.expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (diff < 0) return 'Expired';
    if (days > 0) return `${days}d ${hours % 24}h remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Ending soon';
  };

  const handleVote = async () => {
    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in to vote on this poll.',
        icon: <Lock className="w-4 h-4" />,
      });
      onNavigate('login');
      return;
    }

    if (!selectedOption) {
      toast.error('No option selected', {
        description: 'Please select an option before voting.',
        icon: <AlertCircle className="w-4 h-4" />,
      });
      return;
    }

    setIsVoting(true);
    try {
      await vote(pollId, selectedOption);
      setVoteSubmitted(true);
      toast.success('Vote submitted!', {
        description: 'Thank you for voting. View live results below.',
        icon: <CheckCircle2 className="w-4 h-4" />,
      });

      // Navigate to results after a short delay
      setTimeout(() => {
        onNavigate('results', pollId);
      }, 1500);
    } catch (error: any) {
      toast.error('Vote failed', {
        description: error.message || 'Please try again.',
        icon: <AlertCircle className="w-4 h-4" />,
      });
    } finally {
      setIsVoting(false);
    }
  };
  
  //handling the people who have voted to avoid duplicate voting
  if (alreadyVoted || voteSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vote Recorded!</h2>
          <p className="text-gray-600 mb-6">
            Your vote has been successfully submitted. View the live results to see how others voted.
          </p>
          <Button 
            onClick={() => onNavigate('results', pollId)}
            className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-500"
          >
            View Results
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Poll Header */}
        <Card className="p-8 md:p-10 mb-6 shadow-xl border-0">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
              Live Poll
            </Badge>
            {poll.expiresAt && (
              <Badge variant="outline" className="gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeRemaining()}
              </Badge>
            )}
            {poll.oneVotePerUser && (
              <Badge variant="outline" className="gap-1">
                <Check className="w-3 h-3" />
                One vote only
              </Badge>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {poll.title}
          </h1>
          <p className="text-gray-600 mb-6">{poll.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{poll.totalVotes.toLocaleString()} votes</span>
            </div>
            <div>•</div>
            <div>
              By <span className="font-medium text-gray-700">{poll.creatorName}</span>
            </div>
          </div>
        </Card>

        {/* Voting Options */}
        <Card className="p-8 md:p-10 mb-6 shadow-xl border-0">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Select your answer:
          </h2>

          <div className="space-y-3 mb-6">
            {poll.options.map((option, idx) => (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                disabled={isVoting}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedOption === option.id
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-colors ${
                      selectedOption === option.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {selectedOption === option.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </div>
                  <span className={`flex-1 ${selectedOption === option.id ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={handleVote}
            disabled={!selectedOption || isVoting}
            className="w-full gap-2 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 font-semibold"
            size="lg"
          >
            {isVoting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting Vote...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Submit Vote
              </>
            )}
          </Button>
        </Card>

        {/* Info Card */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">After you vote</p>
              <p className="text-blue-800">
                You'll be able to see live results and how your choice compares with others. 
                {poll.oneVotePerUser && ' You can only vote once on this poll.'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
