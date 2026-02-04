import React from 'react';
import { useEffect, useState } from 'react';
import {  AppProvider } from './context/AppContext';
import { Navigation } from './Navigation';
import { LandingPage } from './components/LandingPage';
import {  AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { CreatePollWizard } from './components/CreatePollWizard';
import { PollVotingPage } from './components/PollVotingPage';
import { ResultsPage } from './components/ResultsPage';
import {  SharePoll } from './components/SharePoll';
import { Toaster } from 'sonner';
import { Page } from './types/index';

interface RouteState {
  page: Page;
  pollId?: string;
}

function App() {
  console.log('app render')
  const [route, setRoute] = useState<RouteState>({ page: 'home'});
  
  const navigate = (page: Page, pollId?: string) => {
    setRoute({ page, pollId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  //For navigating using the keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && route.page !== 'home') {
        navigate('home');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [route.page]);
  

  return (
    <AppProvider>
      <div className="min-h-screen bg-white">
        <Navigation currentPage={route.page} onNavigate={navigate} />

        <main className="pb-20 md:pb-0">
          {route.page === 'home' && <LandingPage onNavigate={navigate} />}
          {route.page === 'login' && <AuthPage mode='login' onNavigate={navigate} />}
          {route.page === 'signup' && <AuthPage mode="signup" onNavigate={navigate} />}
          {route.page === 'create' && <CreatePollWizard onNavigate={navigate} />}
          {route.page === 'vote' && route.pollId && (
            <PollVotingPage pollId={route.pollId} onNavigate={navigate} />
          )}
          {route.page === 'results' && route.pollId && (
            <ResultsPage pollId={route.pollId} onNavigate={navigate} />
          )}
          {route.page === 'dashboard' && <Dashboard onNavigate={navigate} />}
          {route.page === 'share' && route.pollId && (
            <SharePoll pollId={route.pollId} onNavigate={navigate} />
          )}
          
        </main>
        
        <Toaster 
          position="top-right"
          expand={false}
          richColors
          closeButton
        />
        
      </div>
    </AppProvider>
  );
}

export default App;

