import  { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, Trash2, Eye, Check, 
  AlertCircle, Info, Clock, Lock, Globe 
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card } from '@/app/components/ui/card';
import { Switch } from './components/switch';
import { Badge } from './components/badge';
import { useApp } from './context/AppContext';
import { toast } from './components/sonner';
import { PollOption, PollStatus, PollVisibility } from './types/index';
import React from 'react';
import { title } from 'process';

interface CreatePollWizardProps {
    onNavigate: (page: string, pollId?: string) => void;
}

export const CreatePollWizard: React.FC<CreatePollWizardProps> = ({ onNavigate }) {
    const { createPoll, user } = useApp();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [pollData, setPollData] = useState({
        title: '',
        description: '',
        options: [
            {
                id: '1', text:'', votes: 0
            },
            {id: '2', text: '', votes: 0},
        ],
        visibility: 'public' as PollVisibility,
        oneVotePerUser: true,
        duration: 24,
        status: 'active' as PollStatus
    });

    const [ errors, setErrors ] = useState<Record<string, string>>({}),

    const steps = [
        { number: 1, title: 'Basic info', description: 'Title & Description'},
        { number: 2, title: 'Options', description: 'Add poll Options'},
        { number: 3, title: 'Settings', description: 'Configure Poll' },
        { number: 4, title: 'Preview', description: 'Review & Publish' },
    ];

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!pollData.title.trim()) {
                newErrors.title = 'Poll title is required';
            }
            if (!pollData.description.trim()) {
                newErrors.description = 'Description is required';
            }
        }

        if (step === 2) {
            const filledOptions = pollData.options.filter(opt => opt.text.trim());
            if (filledOptions.length < 2) {
                newErrors.options = 'At least 2 options are required';
            }
            pollData.options.forEach((opt, idx) => {
                if (opt.text.trim() && opt.text.length < 1) {
                    newErrors[`option_${idx}`] = 'Option cannot be empty'
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const addOption = () => {
        setPollData(prev => ({
            ...prev,
            options: [...prev.options, { id: Date.now().toString(), text: '', votes: 0}],
        }));
    };

    const removeOption = (id: string) => {
        if (pollData.options.length > 2) {
            setPollData(prev => ({
                ...prev,
                options: prev.options.filter(opt => opt.id !== id),
            }));
        }
    };

    const updateOption = (id: string, text: string) => {
        setPollData(prev => ({
            ...prev,
            options: prev.options.map(opt => (opt.id === id ? { ...opt, text } : opt)),
        }));
        //clearing an error when the user is typing
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[`option_${pollData.options.findIndex( o => o.id === id)}`];
            delete newErrors.options;
            return newErrors;
        });
    };

    const handlePublish = async () => {
        setLoading(true);
        try {
            //Filtering out the empty options
            const validOptions = pollData.options.filter(opt => opt.text.trim());

            const pollId = await createPoll({
                ...pollData,
                options: validOptions,
            });

            toast.success('Poll Published!', {
                description: 'Your poll is now live and ready to share.',
                icon: <Check className="w-4 h-4" />,
            });

            onNavigate('share', pollId);
        } catch (error: any) {
            toast.error('Failed to pulish poll', {
                description: error.message,
                icon: <AlertCircle className="w-4 h-4" />
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/*The Progress Steps*/}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        {steps.map((step, idx) => (
                            <div key={step.number} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div 
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors ${
                                            currentStep >= step.number 
                                               ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                                               : 'bg-gray-200 text-gray-500'
                                        }`}  
                                >
                                    {currentStep > step.number ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                      step.number
                                    )}
                                </div>
                                <div className="text-center hidden sm:block">
                                    <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'}`}>
                                       {step.title}
                                    </p>
                                    <p className="text-xs text-gray-500">{step.description}</p>
                                </div>
                                {idx < steps.length - 1 && (
                                   <div className={`flex-1 h-1 mx-2 rounded ${currentStep > step.number ? 'bg-gradient-to-r from-blue-600 to-cyan-500' : 'bg-gray-200'}`} />
                                )}
                            </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content*/}
                <Card className="p-8 md:p-10 shadow-2xl border-0">
                    {currentStep === 1 && <Step1 pollData={pollData} setPollData={setPollData} errors={errors} setErrors={setErrors} />}
                    {currentStep === 2 && <Step2 pollData={pollData} updateOption={updateOption} addOption={addOption} removeOption={removeOption} errors={errors} />}
                    {currentStep === 3 && <Step3 pollData={pollData} setPollData={setPollData} />}
                    {currentStep === 4 && <Step4 pollData={pollData} />}

                    {/* The buttons for navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-gray-200">
                        <Button
                           variant="outline"
                           onClick={handlePrevious}
                           disabled={currentStep === 1}
                           className="gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </Button>

                        {currentStep < 4 ? (
                            <Button
                              onClick={handleNext}
                              className="gap-2 bg-gradient-to-r from-blue-600"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button 
                             onClick={handlePublish}
                             disabled={loading}
                             className="gap-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 font-semibold"
                            >
                                {loading ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      Publishing
                                    </>
                                ) : (
                                    <>
                                      <Check className="w-4 h-4" />
                                      Publish Poll
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

//Step1 Information
const Step1: React.FC<any> = ({ pollData, setPollData, errors, setErrors }) => {
    const handleChange = (field: string, value:string) => {
        setPollData((prev: any) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev: any) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                <p className="text-gray-600">Give your poll a clear title and description</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="title">Poll Title</Label>
                <Input 
                  id="title"
                  placeholder="What's your favourite programming language?"
                  value={pollData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.title}
                    </p>
                )}
                <p className="text-sm text-gray-500">Keep it concise and engaging</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Desription *</Label>
                <Textarea 
                  id="description"
                  placeholder="Help us understand developer preferences in 2026 in consideration of AI. Your vote helps shape our community insights."
                  value={pollData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.description}
                    </p>
                )}
                <p className="text-sm text-gray-500">Provide Context to help voters make informed choices</p>
            </div>
        </div>
    );
};

// Step 2: Options
const Step2: React.FC<any> = ({ pollData, updateOption, addOption, removeOption, errors }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Poll Options</h2>
        <p className="text-gray-600">Add at least 2 options for voters to choose from</p>
      </div>

      <div className="space-y-3">
        {pollData.options.map((option: PollOption, idx: number) => (
          <div key={option.id} className="flex gap-2 items-start">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
                  {String.fromCharCode(65 + idx)}
                </div>
                <Input
                  placeholder={`Option ${idx + 1}`}
                  value={option.text}
                  onChange={(e) => updateOption(option.id, e.target.value)}
                  className={errors[`option_${idx}`] ? 'border-red-500' : ''}
                />
                {pollData.options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(option.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {errors[`option_${idx}`] && (
                <p className="text-sm text-red-600 flex items-center gap-1 ml-10">
                  <AlertCircle className="w-3 h-3" />
                  {errors[`option_${idx}`]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {errors.options && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {errors.options}
        </p>
      )}

      <Button
        variant="outline"
        onClick={addOption}
        className="w-full gap-2 border-dashed"
        disabled={pollData.options.length >= 10}
      >
        <Plus className="w-4 h-4" />
        Add Option {pollData.options.length >= 10 && '(Max 10)'}
      </Button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">Tips for great poll options:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>Keep options clear and concise</li>
            <li>Make sure they're mutually exclusive</li>
            <li>Cover all likely responses</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Step 3: Settings
const Step3: React.FC<any> = ({ pollData, setPollData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Poll Settings</h2>
        <p className="text-gray-600">Configure how your poll will work</p>
      </div>

      <div className="space-y-6">
        {/* Visibility */}
        <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              {pollData.visibility === 'public' ? (
                <Globe className="w-5 h-5 text-blue-600" />
              ) : (
                <Lock className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <Label className="text-base font-medium">Poll Visibility</Label>
              <p className="text-sm text-gray-600 mt-1">
                {pollData.visibility === 'public' 
                  ? 'Anyone can find and vote on this poll'
                  : 'Only people with the link can access this poll'}
              </p>
            </div>
          </div>
          <Switch
            checked={pollData.visibility === 'public'}
            onCheckedChange={(checked) =>
              setPollData((prev: any) => ({ ...prev, visibility: checked ? 'public' : 'private' }))
            }
          />
        </div>

        {/* One Vote Per User */}
        <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <Label className="text-base font-medium">One Vote Per User</Label>
              <p className="text-sm text-gray-600 mt-1">
                Prevent users from voting multiple times (recommended)
              </p>
            </div>
          </div>
          <Switch
            checked={pollData.oneVotePerUser}
            onCheckedChange={(checked) =>
              setPollData((prev: any) => ({ ...prev, oneVotePerUser: checked }))
            }
          />
        </div>

        {/* Duration */}
        <div className="p-4 border border-gray-200 rounded-lg space-y-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <Label className="text-base font-medium">Poll Duration</Label>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                How long should this poll remain active?
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[6, 12, 24, 48, 72, 168].map((hours) => (
                  <Button
                    key={hours}
                    variant={pollData.duration === hours ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPollData((prev: any) => ({ ...prev, duration: hours }))}
                    className={pollData.duration === hours ? 'bg-gradient-to-r from-blue-600 to-cyan-500' : ''}
                  >
                    {hours < 24 ? `${hours}h` : `${hours / 24}d`}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 4: Preview
const Step4: React.FC<any> = ({ pollData }) => {
  const filledOptions = pollData.options.filter((opt: PollOption) => opt.text.trim());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview Your Poll</h2>
        <p className="text-gray-600">Review everything before publishing</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
        <div className="flex items-start gap-2 mb-4">
          <Badge className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
            Will be Live
          </Badge>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{pollData.title}</h3>
        <p className="text-gray-700 mb-6">{pollData.description}</p>

        <div className="space-y-3 mb-6">
          {filledOptions.map((option: PollOption, idx: number) => (
            <div
              key={option.id}
              className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-medium">
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="text-gray-900">{option.text}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-blue-200">
          <Badge variant="outline" className="gap-1">
            {pollData.visibility === 'public' ? (
              <><Globe className="w-3 h-3" /> Public</>
            ) : (
              <><Lock className="w-3 h-3" /> Private</>
            )}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            {pollData.duration < 24 ? `${pollData.duration}h` : `${pollData.duration / 24}d`} duration
          </Badge>
          {pollData.oneVotePerUser && (
            <Badge variant="outline" className="gap-1">
              <Check className="w-3 h-3" />
              One vote per user
            </Badge>
          )}
        </div>
      </Card>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-green-900">
          <p className="font-medium mb-1">Ready to publish!</p>
          <p className="text-green-800">
            Your poll will be immediately visible and ready for votes. You can share it via link or QR code.
          </p>
        </div>
      </div>
    </div>
  );
};
