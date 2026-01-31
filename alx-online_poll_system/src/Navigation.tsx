import React from 'react';
import { BarChart3, Plus, User, LogOut, Home, LayoutDashboard } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useApp } from './context/AppContext';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
    const { user, logout } = useApp();

    return (
        <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/*Logo and Brand*/}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
                        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">Poll Dynamics</span>
                    </div>

                    {/*Desktop Navigation*/}
                    <div className="hidden md:flex items-center gap-2">
                        <Button 
                          variant={currentPage === 'home' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => onNavigate('home')}
                          className="gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </Button>

                        {user && (
                            <>
                              <Button 
                                variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => onNavigate('dashboard')}
                                className="gap-2"
                               >
                                  <LayoutDashboard className="w-4 h-4" />
                                  Dashboard
                               </Button>
                               <Button 
                                 variant="default"
                                 size="sm"
                                 onClick={() => onNavigate('create')}
                                 className="gap-2 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create Poll
                                </Button>
                            </>
                        )}

                        {user ? (
                            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-300">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                                    <User className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-700">{user.name}</span>
                                </div>
                                <Button 
                                  variant="ghost"
                                  size="sm"
                                  onClick={logout}
                                  className="gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => onNavigate('login')}
                              className="gap-2"
                            >
                                <User className="w-4 h-4" />
                                Login
                            </Button>
                        )}
                    </div>

                    {/*The mobile navigation*/}
                    <div className="md:hidden flex items-center gap-2">
                        {user ? (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => onNavigate('create')}
                                className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-500"
                               >
                                <Plus className="w-4 h-4" />
                               </Button>
                               <Button 
                                 variant="ghost"
                                 size="sm"
                                 onClick={logout}
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </>
                        ) :(
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => onNavigate('login')}
                            >
                                Login
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* The bottom navigation in mobile */}
            {user && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
                    <div className="flex justify-around items-center">
                        <Button
                          variant={currentPage === 'home' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => onNavigate('home')}
                          className="flex-col h-auto py-2 gap-1"
                        >
                            <Home className="w-5 h-5" />
                            <span className="text-xs">Home</span>
                        </Button>
                        <Button
                          variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => onNavigate('dashboard')}
                          className="flex-col h-auto py-2 gap-1"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="text-xs">Dashboard</span>
                        </Button>
                        <Button 
                          variant={currentPage === 'create' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => onNavigate('create')}
                          className="flex-col h-auto py-2 gap-1"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="text-xs">Create</span>
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};