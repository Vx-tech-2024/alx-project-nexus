import React from 'react';
import { useState } from 'react';
import { Copy, Check, QrCode, Facebook, Twitter, Mail, Link2, MessageCircle, Share2, Download, CheckCircle } from 'lucide-react';
import { Button } from './subcomponents/button';
import { Card } from './subcomponents/card';
import { Input } from './subcomponents/input';
import { Badge } from './subcomponents/badge';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { url } from 'inspector';
import { Page } from '../types/index';
interface SharePollProps {
  pollId: string;
  onNavigate: (page: Page, pollId?: string) => void;
}

export const SharePoll: React.FC<SharePollProps> = ({ pollId, onNavigate }) => {
    const { polls } = useApp();
    const [copied, setCopied] = useState(false);

    const poll = polls.find(p => p.id === pollId);

    if (!poll) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Poll Not Found</div>
    }

    const pollUrl = `${window.location.origin}/poll/${pollId}`;
    const encodedUrl = encodeURIComponent(pollUrl);
    const encodedTitle = encodeURIComponent(poll.title);

    const handleCopyLink= async () => {
        try {
            await navigator.clipboard.writeText(pollUrl);
            setCopied(true);
            toast.success('Link Copied', {
                description: 'Poll link has been copied to clipboard',
                icon: <CheckCircle className="w-4 h-4" />
            });
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            toast.error('Failed to copy', {
                description: 'Please copy the link manually',
            });
        }
    };

    const shareOptions = [
        {
            name: 'Twitter',
            icon: Twitter,
            color: 'bg-blue-400 hover:bg-blue-500',
            url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-blue-600 hover:bg-blue-700',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        },
        {
            name: 'Whatsapp',
            icon: MessageCircle,
            color: 'bg-blue-500 hover:bg-blue-600',
            url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        },       
        {
            name: 'Email',
            icon: Mail,
            color: 'bg-blue-600 hover:bg-blue-700',
            url: `mailto:?subject=${encodedTitle}&body=Vote on this poll: ${encodedUrl}`,
        },
    ];

    const handleShare = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
    };

    const handleDownloadQR = () => {
        //Generating and downloading QR code
        toast.success('QR Code ready', {
            description: 'QR Code download started.',
            icon: <Download className="w-4 h-4" />
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/*HEader */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-3xl mb-6 shadow-xl shadow-blue-500/30">
                       <Share2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                        Share Your Poll
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Get more votes by sharing with your audience
                    </p>
                </div>

                {/*Poll Preview */}
                <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                    <div className="flex items-start gap-2 mb-3">
                        <Badge className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                            Your Poll
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                            Live
                        </Badge>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{poll.title}</h2>
                    <p className="text-gray-700">{poll.description}</p>
                </Card>

                {/**Copy Link */}
                <Card className="p-8 mb-6 shadow-xl border-0">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Link2 className="w-5 h-5" />
                        Poll Link
                    </h3>
                    <div className="flex gap-2">
                        <Input 
                          value={pollUrl}
                          readOnly
                          className="flex-1 font-mono text-sm"
                          onClick={(e) => e.currentTarget.select()}
                        />
                        <Button
                          onClick={handleCopyLink}
                          className={`gap-2 shadow-lg transition-all duration-300 font-semibold ${
                            copied
                              ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30'
                              : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 shadow-blue-500/30'
                          }`}
                        >
                            {copied ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  Copied
                                </>
                            ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  Copy
                                </>
                            )}
                        </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Anyone with this link can vote on the poll
                    </p>
                </Card>

                {/*Social Sharing */}
                <Card className="p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Share2 className="w-5 h-5" />
                        Share on Social Media
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {shareOptions.map((option) => (
                            <Button
                              key={option.name}
                              onClick={() => handleShare(option.url)}
                              className={`flex flex-col items-center gap-2 h-auto py-4 ${option.color} text-white`}
                            >
                                <option.icon className="w-6 h-6" />
                                <span className="text-sm">{option.name}</span>
                            </Button>
                        ))}
                    </div>
                </Card>

                {/**QR Code */}
                <Card className="p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <QrCode className="w-5 h-5"/>
                        QR Code
                    </h3>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="flex-shrink-0">
                            {/**A placeholder QR code */}
                            <div className="w-48 h-48 bg-white border-4 border-gray-300 rounded-xl flex items-center justify-center">
                                <div className="text-center">
                                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">QR Code</p>
                                    <p className="text-xs text-gray-400">Scan to Vote</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h4 className="font-medium text-gray-900 mb-2">
                                Share in Person
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Let people scan this QR Code to quickly access your poll. THis is to help make it easy for presentations, events or when you print out posters.
                            </p>
                            <Button 
                              onClick={handleDownloadQR}
                              variant="outline"
                              className="gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download QR Code
                            </Button>
                        </div>
                    </div>
                </Card>

                {/**To share tips */}
                <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                    <h3 className="font-semibold text-gray-900 mb-3">
                        **Tips to getting more votes
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Share in multiple channels to reach a wide audience</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Add context avout why their vote matters</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Set a deadline to create urgency</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Share the results after the poll closes for people to engage </span>
                        </li>
                    </ul>
                </Card>

                {/**Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button 
                      onClick={() => onNavigate('results', pollId)}
                      variant="outline"
                      className="flex-1 gap-2"
                    >
                        View Live Results
                    </Button>
                    <Button
                      onClick={() => onNavigate('dashboard')}
                      className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-cyan-500"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
};
