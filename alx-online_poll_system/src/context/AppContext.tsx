import React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockPolls, mockUser } from '../data/mockdata';
import { Poll, User, AppState } from '../types';

interface AppContextType extends AppState {
    login: (email:string, password:string) => Promise<void>;
    signup: (name:string, email:string, password:string) => Promise<void>;
    loginAsGuest: () => void;
    logout: () => void;
    createPoll: (poll: Omit<Poll, 'id' | 'creatorId' | 'creatorName' | 'createdAt' | 'totalVotes' | 'votedUsers'>) => Promise<String>;
    updatePoll: (pollId: string, updates: Partial<Poll>) => void;
    deletePoll: (pollId: string) => void;
    vote: (pollId: string, optionId: string) => Promise<void>;
    hasVoted: (pollId: string) => boolean;
    getUserPolls: () => Poll[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider : React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [polls, setPolls] = useState<Poll[]>(mockPolls);
    const [userVotes, setUserVotes] = useState<Map<string, string>>(new Map());

    //Loading from local storage
    useEffect(() => {
        const savedUser = localStorage.getItem('pollUser');
        if (savedUser) {
            setUser (JSON.parse(savedUser));
        }
        const savedVotes = localStorage.getItem('userVotes');
        if (savedVotes) {
            setUserVotes(new Map(JSON.parse(savedVotes)));
        }
    }, []);

    const login = async (email: string, password: string) : Promise<void> => {
        //simulating how api call works
        await new Promise(resolve => setTimeout(resolve, 1000));
        const loggedInUser: User ={
            id: '1',
            name: email.split('@')[0],
            email,
        };
        setUser(loggedInUser);
        localStorage.setItem('pollUser', JSON.stringify(loggedInUser));
    };

    const signup = async (name: string, email: string, password: string) : Promise<void> => {
        //simulating how api call works
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newUser: User ={
            id: Date.now().toString(),
            name,
            email,
        };
        setUser(newUser);
        localStorage.setItem('pollUser', JSON.stringify(newUser));
    };

    const loginAsGuest = () => {
        const guestUser: User = {
            id: `guest-${Date.now()}`,
            name: 'Guest User',
            email: '',
            isGuest: true,
        };
        setUser(guestUser);
        localStorage.setItem('pollUser', JSON.stringify(guestUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pollUser');
    };

    const createPoll = async (poll: Omit<Poll, 'id' | 'creatorId' | 'creatorName' | 'createdAt' | 'totalVotes' | 'votedUsers'>) : Promise<String> => {
        //simulating how api call works
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newPoll: Poll = {
            ...poll,
            id: Date.now().toString(),
            creatorId: user?.id  || 'unknown',
            creatorName: user?.name || 'unknown',
            createdAt: new Date(),
            totalVotes: 0,
            votedUsers: [],
            options: poll.options.map(opt => ({ ...opt, votes: 0})),
        };

        if (poll.duration) {
            newPoll.expiresAt = new Date(Date.now() + poll.duration * 60 * 60 * 1000);
        }

        setPolls(prev => [newPoll, ...prev]);
        return newPoll.id;
    };

    const updatePoll = (pollId: string, updates: Partial<Poll>) => {
        setPolls(prev => prev.map(poll =>
             poll.id === pollId ? { ...poll, ...updates } : poll
            ));
    };

    const deletePoll = (pollId: string) => {
        setPolls(prev => prev.filter(poll => poll.id !== pollId));
    };

    const vote = async (pollId: string, optionId: string) : Promise<void> => {
        if (!user) throw new Error('Must be logged in so as to vote');

        const poll = polls.find(p => p.id === pollId);
        if (!poll) throw new Error('Poll not available to vote for.');

        if (poll.oneVotePerUser && userVotes.has(pollId)) {
            throw new Error('You have already voted on thi poll');
        }

        //simulating how an api works
        await new Promise(resolve => setTimeout(resolve, 500));

        //updating them poll votes
        setPolls (prev => prev.map (p => {
            if (p.id === pollId) {
                return {
                    ...p,
                    options: p.options.map (opt => 
                        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
                    ),
                    totalVotes: p.totalVotes + 1,
                    votedUsers: [...p.votedUsers || [], user.id],
                };
            }
            return p;
        })); 

        //Recording user voting
        const newVotes = new Map(userVotes);
        newVotes.set(pollId, optionId);
        setUserVotes(newVotes);
        localStorage.setItem('userVotes', JSON.stringify(Array.from(newVotes.entries())));
    };

    const hasVoted = (pollId: string) : boolean => {
        return userVotes.has(pollId);
    };

    const getUserPolls = () : Poll[] => {
        if (!user) return [];
        return polls.filter(poll => poll.creatorId === user.id);
    };

    return (
        <AppContext.Provider
         value={{
            user,
            polls,
            userVotes,
            login,
            signup,
            loginAsGuest,
            logout,
            createPoll,
            updatePoll,
            deletePoll,
            vote,
            hasVoted,
            getUserPolls,
         }}
         >
            {children}
         </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};