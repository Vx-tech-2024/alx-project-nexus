import React from 'react';
import  { useState } from 'react';
import { BarChart3, Clock, Users, Zap, TrendingUp, Shield, Search } from 'lucide-react';
import { Button } from './subcomponents/button';
import { Card } from './subcomponents/card';
import { Input } from './subcomponents/input';
import { Badge } from './subcomponents/badge';
import { useApp } from '../context/AppContext';
import { Poll } from '../types/index';
import { Page } from '../types/index';
interface LandingPageProps {
  onNavigate: (page: Page, pollId?: string) => void

}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { user, polls } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const activePolls = polls.filter(poll => poll.status === 'active');
  
  const filteredPolls = activePolls.filter(poll =>
    poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    poll.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimeRemaining = (expiresAt? : Date) => {
    if (!expiresAt) return 'No expiry';
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d remaining`;
    if (days > 0) return `${hours}h remaining`;
    return 'Ending soon';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
        {/*Hero Section*/}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-32">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">Real-time Polling Platform </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                    Create & Share Polls
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                        Get Instant Results
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Build them engaging polls in second, share with the circle of your choice and watch real time results come to life. Perfect for teams, educators, content creators, friends, the list is endless guys.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                     size="lg"
                     onClick={() => onNavigate(user ? 'create' : 'signup')}
                     className="gap-2 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 text-lg px-10 py-7 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 font-semibold"
                    >
                        <BarChart3 className="w-5 h-5" />
                        Create Your First Poll
                    </Button>
                    {!user && (
                        <Button 
                           size="lg"
                           variant="outline"
                           onClick={() => onNavigate('login')}
                        >
                            Join a Poll
                        </Button>
                    )}
                </div>

                {/*Features Grid*/}
                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50/30">
                       <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-500/40">
                          <Clock className="w-7 h-7 text-white" />
                       </div>
                       <h3 className="font-bold text-gray-900 mb-3 text-lg">Real-Time Updates</h3>
                       <p className="text-sm text-gray-600 leading-relaxed">
                         See results update instantly as people's votes come in. No page refresh is needed for the updates to display.
                       </p>
                    </Card>

                    <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-cyan-50/30">
                       <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-cyan-500/40">
                         <Users className="w-7 h-7 text-white" />
                       </div>
                       <h3 className="font-bold text-gray-900 mb-3 text-lg">easy Sharing</h3>
                       <p className="text-sm text-gray-600 leading-relaxed">
                         Share Polls via link, QR Code or social media on a click.
                       </p>
                    </Card>

                    <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-green-50/30">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-green-500/40">
                        <Shield className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-3 text-lg">Vote Protection</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                         One vote per user to prevent voters from voting multiple times
                      </p>
                    </Card>
                </div>
            </div>
        </section>

        {/*The Active Poll Section*/}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Active Votes</h2>
                        <p className="text-gray-600">Join The Conversation and share your honest opinion</p>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                           type="text"
                           placeholder="Search Polls..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="pl-10"
                        />
                    </div>
                </div>

                {filteredPolls.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div  className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BarChart3 className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {searchQuery ? 'No polls found' : 'No active polls yet'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery ? 'Try a different search term' : 'Be the first to create a poll and start gathering insights on this topic'}
                        </p>
                        {!searchQuery && (
                            <Button 
                              onClick={() => onNavigate(user ? 'create' : 'signup')}
                              className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-500"
                            >
                                <BarChart3 className="w-4 h-4" />
                                Create first Poll
                            </Button>
                        )}
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPolls.map((poll) => (
                            <PollCard
                              key={poll.id}
                              poll={poll}
                              onClick={() => onNavigate('vote', poll.id)}
                              formatTimeRemaining={formatTimeRemaining}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    </div>
  );
};

interface PollCardProps {
  poll: Poll;
  onClick: () => void;
  formatTimeRemaining: (expiresAt?: Date) => string;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onClick, formatTimeRemaining }) => {
  return (
    <Card
      className="p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-md hover:-translate-y-1 bg-white"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live
          </div>
        </Badge>
        {poll.expiresAt && (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTimeRemaining(poll.expiresAt)}
          </span>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{poll.title}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{poll.description}</p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{poll.totalVotes.toLocaleString()} votes</span>
        </div>
        <div className="flex items-center gap-1 text-blue-600">
          <TrendingUp className="w-4 h-4" />
          <span>{poll.options.length} options</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          By <span className="font-medium text-gray-700">{poll.creatorName}</span>
        </p>
      </div>
    </Card>
  );
};
