import React from 'react';
import { useState } from 'react';
import { BarChart3, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { useApp } from './context/AppContext';
import { toast } from './components/sonner';

interface   AuthPageProps{
    mode: 'login' | 'signup';
    onNavigate: (page: string) => void;
}

export const AuthPage: React.FC<AuthPageProps>= ({ mode, onNavigate }) => {
    const { login, signup, loginAsGuest } = useApp();
    const [isLogin, setIsLogin] = useState(mode === 'login');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!isLogin && !formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please type the valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.confirmPassword.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'The Password does not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                toast.success('Welcome back!', {
                    description: 'Successfully logged into your account.',
                    icon: <CheckCircle className="w-4 h-4" />,
                });
            } else {
                await signup(formData.name, formData.email, formData.password);
                toast.success('Account created', {
                    description: 'Your account has been successfully created',
                    icon: <CheckCircle className="w-4 h-4" />,
                });
            }
            onNavigate('home');
        } catch (error: any) {
            toast.error('Authentication failed', {
                description: error.message || 'Please try again',
                icon: <AlertCircle className="w-4 h-4" />,
            });
        } finally {
            setLoading(false);
        }

    };

    const handleGuestLogin = () => {
        loginAsGuest();
        toast.success('Logged in as guest', {
            description: 'You can now vote on polls', 
        });
        onNavigate('home');
    };

    const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-10 shadow-2xl border-0">
        {/* Logo and Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-3xl mb-6 shadow-xl shadow-blue-500/30">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600 text-base">
            {isLogin
              ? 'Sign in to manage your polls and vote'
              : 'Join PollDynamic and start creating polls'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`pl-10 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`pl-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`pl-10 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 font-semibold"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </div>
            ) : (
              <>{isLogin ? 'Sign In' : 'Create Account'}</>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        {/* Guest Login */}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGuestLogin}
        >
          Continue as Guest
        </Button>

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </Card>
    </div>
  );
};
