import React from 'react';
import { useState, useEffect } from 'react';
import { TrendingUp, Users, Clock, Share2, BarChart3, PieChart, Download, RefreshCw, Crown, CheckCircle2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useApp } from './context/AppContext';
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ResultsPageProps {
  pollId: string;
  onNavigate: (page: string, pollId?: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ pollId, onNavigate }) => {
  const { polls, user, hasVoted } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  const poll = polls.find(p => p.id === pollId);
  const userVoted = hasVoted(pollId);
  const isCreator = poll?.creatorId === user?.id;

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 500);
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (!poll) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Poll not found</div>;
  }

  const totalVotes = poll.totalVotes || poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const leadingOption = poll.options.reduce((max, opt) => opt.votes > max.votes ? opt : max);

  // Prepare chart data
  const chartData = poll.options.map((option, idx) => ({
    name: option.text,
    votes: option.votes,
    percentage: totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0,
    color: CHART_COLORS[idx % CHART_COLORS.length],
  }));

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-500 text-white">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                Live Results
              </Badge>
              {userVoted && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  You voted
                </Badge>
              )}
              {isCreator && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Crown className="w-3 h-3 mr-1" />
                  Your Poll
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsRefreshing(true);
                  setTimeout(() => setIsRefreshing(false), 500);
                }}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('share', pollId)}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>

          <Card className="p-8 shadow-xl border-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              {poll.title}
            </h1>
            <p className="text-gray-600 mb-4">{poll.description}</p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="font-semibold text-gray-900">
                  {totalVotes.toLocaleString()}
                </span>
                <span>total votes</span>
              </div>
              {poll.expiresAt && (
                <>
                  <div className="text-gray-400">•</div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimeRemaining()}</span>
                  </div>
                </>
              )}
              <div className="text-gray-400">•</div>
              <div className="text-gray-600">
                By <span className="font-medium text-gray-900">{poll.creatorName}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <Card className="p-8 shadow-xl border-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Vote Distribution
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant={chartType === 'bar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                    className="gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Bar
                  </Button>
                  <Button
                    variant={chartType === 'pie' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('pie')}
                    className="gap-2"
                  >
                    <PieChart className="w-4 h-4" />
                    Pie
                  </Button>
                </div>
              </div>

              {totalVotes === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No votes yet. Be the first to vote!</p>
                </div>
              ) : (
                <>
                  {chartType === 'bar' ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '12px'
                          }}
                        />
                        <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={chartData}
                          dataKey="votes"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={(entry) => `${entry.percentage}%`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '12px'
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  )}
                </>
              )}
            </Card>

            {/* Detailed Results */}
            <Card className="p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Detailed Results
              </h2>
              <div className="space-y-4">
                {poll.options
                  .sort((a, b) => b.votes - a.votes)
                  .map((option, idx) => {
                    const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                    const isLeading = option.id === leadingOption.id && totalVotes > 0;

                    return (
                      <div key={option.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isLeading && (
                              <Crown className="w-4 h-4 text-yellow-600" />
                            )}
                            <span className="font-medium text-gray-900">
                              {option.text}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">
                              {option.votes.toLocaleString()} votes
                            </span>
                            <span className="font-semibold text-gray-900 min-w-[3rem] text-right">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isLeading 
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                                : 'bg-gradient-to-r from-blue-600 to-cyan-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Total Votes</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {totalVotes.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Leading Option</span>
                  </div>
                </div>
                {totalVotes > 0 && (
                  <div className="pl-3 pr-3 pb-3">
                    <p className="font-medium text-gray-900 text-sm mb-1">
                      {leadingOption.text}
                    </p>
                    <p className="text-xs text-gray-600">
                      {leadingOption.votes} votes ({((leadingOption.votes / totalVotes) * 100).toFixed(1)}%)
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700">Options</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {poll.options.length}
                  </span>
                </div>
              </div>
            </Card>

            {!userVoted && (
              <Card className="p-6 bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
                <h3 className="font-semibold mb-2">Haven't voted yet?</h3>
                <p className="text-sm text-blue-50 mb-4">
                  Cast your vote to join the conversation
                </p>
                <Button
                  onClick={() => onNavigate('vote', pollId)}
                  variant="secondary"
                  className="w-full"
                >
                  Vote Now
                </Button>
              </Card>
            )}

            {isCreator && (
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Creator Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => onNavigate('share', pollId)}
                  >
                    <Share2 className="w-4 h-4" />
                    Share Poll
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => onNavigate('dashboard')}
                  >
                    <BarChart3 className="w-4 h-4" />
                    View Dashboard
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CHART_COLORS = [
  '#3b82f6', // blue-500
  '#06b6d4', // cyan-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#6366f1', // indigo-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
];
