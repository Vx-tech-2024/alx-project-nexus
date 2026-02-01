import { useState } from 'react';
import React from 'react';
import { BarChart3, Plus, Trash2, Share2, Eye, Clock, Users, TrendingUp, Edit, MoreVertical, AlertCircle, CheckCircle} from 'lucide-react';
import { Button } from './subcomponents/button';
import { Card } from './subcomponents/card';
import { Badge } from './subcomponents/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from './subcomponents/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from './subcomponents/alert_dialog';
import { useApp } from '../context/AppContext';
import { Toaster } from './subcomponents/sonner';
import { toast } from "sonner";
import { Poll } from '../types/index';
import { Page } from '../types/index';

interface DashboardProps {
    onNavigate: (page: Page, pollId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const { user, getUserPolls, deletePoll, updatePoll } = useApp();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [pollToDelete, setPollToDelete] = useState<string | null>(null);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="p-8 text-center max-w-md">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
                    <p className="text-gray-600 mb-6">
                        Please log in to access your dashboard
                    </p>
                    <Button onClick={() => onNavigate('login')}>
                        Login
                    </Button>
                </Card>
            </div>
        );
    }

    const userPolls = getUserPolls();
    const activePolls = userPolls.filter(p => p.status === 'active');
    const closedPolls = userPolls.filter(p => p.status === 'closed');
    const totalVotes = userPolls.reduce((sum, p) => sum + p.totalVotes, 0);

    const handleDeleteConfirm = () => {
        if (pollToDelete) {
            deletePoll(pollToDelete);
            toast.success('Poll deleted', {
                description: 'Your poll has been permanently deleted.',
                icon: <CheckCircle className="w-4 h-4" />
            });
            setPollToDelete(null);
            setDeleteDialogOpen(false);
        }
    };

    const handleClosedPoll = (pollId: string) => {
        updatePoll(pollId, { status: 'closed' });
        toast.success('Poll Closed', {
            description: 'This poll is now closed for voting.',
            icon: <CheckCircle className="w-4 h-4" />
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                                Creater Dasboard
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Welcome back, <span className="font-semibold text-gray-900">{user.name}</span>
                            </p>
                        </div>
                        <Button
                          onClick={() => onNavigate('create')}
                          className="gap-2 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 font-semibold"
                        >
                            <Plus className="w-4 h-4" />
                            Create New Poll
                        </Button>
                    </div>

                    {/*Stats Place*/}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/30 hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">
                                {userPolls.length}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">Total Polls</p>
                        </Card>

                        <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-white to-green-50/30 hover:shadow-2xl transition-all duration-300">
                          <div className="flex items-center justify-between mb-3">
                            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-2xl shadow-lg shadow-green-500/30">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <p className="text-3xl font-bold text-gray-900 mb-1">
                            {activePolls.length}
                          </p>
                          <p className="text-sm text-gray-600 font-medium">Active Polls</p>
                        </Card>

                        <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-white to-purple-50/30 hover:shadow-2xl transition-all duration-300">
                           <div className="flex items-center justify-between mb-3">
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-2xl shadow-lg shadow-purple-500/30">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                           </div>
                           <p className="text-3xl font-bold text-gray-900 mb-1">
                            {totalVotes.toLocaleString()}
                           </p>
                           <p className="text-sm text-gray-600 font-medium">Total Votes</p>
                        </Card>

                        <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-white to-orange-50/30 hover:shadow-2xl transition-all duration-300">
                          <div className="flex items-center justify-between mb-3">
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-2xl shadow-lg shadow-orange-500/30">
                              <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <p className="text-3xl font-bold text-gray-900 mb-1">
                            {userPolls.length > 0 ? Math.round(totalVotes / userPolls.length ) : 0}
                          </p>
                          <p className="text-sm text-gray-600 font-medium">Avg Votes/Poll</p>
                        </Card>
                    </div>
                </div>

                {/* Polls' List*/}
                {userPolls.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BarChart3 className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Polls yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Create your first poll to start gathering insights from your audience
                        </p>
                        <Button 
                          onClick={() => onNavigate('create')}
                          className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-500"
                        >
                            <Plus className="w-4 h-4" />
                            Create Your First Poll
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {activePolls.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Active Polls ({activePolls.length})
                                </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {activePolls.map(poll => (
                                        <PollDashboardCard
                                          key={poll.id}
                                          poll={poll}
                                          onNavigate={onNavigate}
                                          onDelete={(id) => {
                                            setPollToDelete(id);
                                            setDeleteDialogOpen(true);
                                          }}
                                          onClose={handleClosedPoll}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {closedPolls.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Closed Polls ({closedPolls.length})
                                </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {closedPolls.map(poll => (
                                        <PollDashboardCard 
                                           key={poll.id}
                                           poll={poll}
                                           onNavigate={onNavigate}
                                           onDelete={(id) => {
                                            setPollToDelete(id);
                                            setDeleteDialogOpen(true);
                                           }}
                                           onClose={handleClosedPoll}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* The delete confirmation dialog*/}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            The action you are about to do cannot be undone.this will permanently delete your poll and all votes. 
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                           onClick={handleDeleteConfirm}
                           className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

interface PollDashboardCardProps {
    poll: Poll;
    onNavigate: (page: string, pollId?: string) => void;
    onDelete: (pollId: string) => void;
    onClose: (pollId: string) => void;
}

const PollDashboardCard: React.FC<PollDashboardCardProps> = ({
    poll,
    onNavigate,
    onDelete,
    onClose
}) => {
    const formatTimeRemaining = () => {
        if (!poll.expiresAt) return null;
        const now = new Date();
        const diff = poll.expiresAt.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days < 0) return 'Expired';
        if (days > 0) return `${days}d remaining`;
        if (hours > 0) return `${hours}h remaining`;
        return 'Ending soon';
    };

    const topOption = poll.options.reduce((max, opt) => opt.votes > max.votes ? opt : max);

    return (
        <Card className="p-6 hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1">
            <div className="flex items-start justify-between mb-3">
                <Badge 
                   variant={poll.status === 'active' ? 'default' : 'outline'}
                   className={poll.status === 'active'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-500'
                    : 'bg-gray-100 text-gray-600'
                   }
                >
                    {poll.status === 'active' ? (
                        <>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                          Active
                        </>
                    ) : (
                        'Closed'
                    )}
                </Badge>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onNavigate('results', poll.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Results
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onNavigate('share', poll.id)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </DropdownMenuItem>
                        {poll.status === 'active' && (
                            <DropdownMenuItem onClick={() => onClose(poll.id)}>
                                Close Poll
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                           onClick={() => onDelete(poll.id)}
                           className="text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <h3 className="font-semibold  text-gray-900 mb-2 line-clamp-2">
                {poll.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {poll.description}
            </p>

            <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{poll.totalVotes} Votes</span>
                    </div>
                    {poll.expiresAt && poll.status === 'active' && (
                        <div className="flex items-center gap-1 text-orange-600">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimeRemaining()}</span>
                        </div>
                    )}
                </div>

                {poll.totalVotes > 0 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Leading:</p>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {topOption.text}
                        </p>
                        <p className="text-xs text-gray-600">
                            {topOption.votes} votes ({((topOption.votes / poll.totalVotes) * 100).toFixed(0)}%)
                        </p>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onNavigate('results', poll.id)}
                >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Results
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onNavigate('results', poll.id)}
                >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                </Button>
            </div>
        </Card>
    );
};