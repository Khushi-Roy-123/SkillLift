
import React, { useState, useEffect, useRef } from 'react';
import { User, TaskItem } from '../types';
import { CoffeeIcon, SparklesIcon, CheckCircleIcon, TrashIcon, LightbulbIcon, WaterDropIcon, PlayIcon, PauseIcon, ClockIcon, RefreshIcon } from '../components/icons';
import { getMealSuggestion, getLifeHack } from '../services/geminiService';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface LifeBalancePageProps {
    currentUser: User;
    onUpdateUser: (user: User) => void;
}

const HACK_CATEGORIES = [
    "Morning Routine",
    "Productivity Boosters",
    "Work Breaks",
    "Stress Management",
    "Home Organization",
    "Study Habits",
    "Sleep Hygiene",
    "Healthy Eating",
    "Digital Detox"
];

const LifeBalancePage: React.FC<LifeBalancePageProps> = ({ currentUser, onUpdateUser }) => {
    // Task Management State
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskCategory, setNewTaskCategory] = useState<TaskItem['category']>('Personal');
    const [filterCategory, setFilterCategory] = useState<TaskItem['category'] | 'All'>('All');
    
    // Meal Planner State
    const [ingredients, setIngredients] = useState('');
    const [cookingTime, setCookingTime] = useState('30 mins');
    const [mealSuggestion, setMealSuggestion] = useState<string | null>(null);
    const [isMealLoading, setIsMealLoading] = useState(false);

    // Life Hack State
    const [hackCategory, setHackCategory] = useState(HACK_CATEGORIES[0]);
    const [lifeHack, setLifeHack] = useState<string | null>(null);
    const [isHackLoading, setIsHackLoading] = useState(false);

    // Hydration State
    const [hydrationCount, setHydrationCount] = useState(0);

    // Timer State
    const [timerTime, setTimerTime] = useState(25 * 60); // 25 minutes
    const [timerIsActive, setTimerIsActive] = useState(false);
    const [timerMode, setTimerMode] = useState<'Focus' | 'Break'>('Focus');
    const timerRef = useRef<number | null>(null);

    // Zen Breath State
    const [isBreathing, setIsBreathing] = useState(false);

    const tasks = currentUser.tasks || [];

    // --- Initialization Effects ---
    
    useEffect(() => {
        if (filterCategory !== 'All') {
            setNewTaskCategory(filterCategory);
        }
    }, [filterCategory]);

    // Sync Hydration with User Data and check for date reset
    useEffect(() => {
        if (currentUser.hydration) {
            const lastDate = new Date(currentUser.hydration.lastUpdated).toDateString();
            const today = new Date().toDateString();
            
            if (lastDate !== today) {
                // Reset if new day
                setHydrationCount(0);
                onUpdateUser({
                    ...currentUser,
                    hydration: { count: 0, goal: 8, lastUpdated: new Date().toISOString() }
                });
            } else {
                setHydrationCount(currentUser.hydration.count);
            }
        }
    }, []);

    // Timer Logic
    useEffect(() => {
        if (timerIsActive && timerTime > 0) {
            timerRef.current = window.setTimeout(() => {
                setTimerTime((prev) => prev - 1);
            }, 1000);
        } else if (timerTime === 0) {
            setTimerIsActive(false);
            // Play sound or notification here if we wanted
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [timerIsActive, timerTime]);

    // --- Handlers ---

    const handleAddTask = () => {
        if (!newTaskText.trim()) return;
        const newTask: TaskItem = {
            id: `task_${Date.now()}`,
            text: newTaskText,
            category: newTaskCategory,
            completed: false,
        };
        const updatedTasks = [newTask, ...tasks];
        onUpdateUser({ ...currentUser, tasks: updatedTasks });
        setNewTaskText('');
    };

    const toggleTask = (taskId: string) => {
        const updatedTasks = tasks.map(t => 
            t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        onUpdateUser({ ...currentUser, tasks: updatedTasks });
    };

    const deleteTask = (taskId: string) => {
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        onUpdateUser({ ...currentUser, tasks: updatedTasks });
    };

    const handleGetMeal = async () => {
        if (!ingredients.trim()) return;
        setIsMealLoading(true);
        setMealSuggestion(null);
        const suggestion = await getMealSuggestion(ingredients, cookingTime);
        setMealSuggestion(suggestion);
        setIsMealLoading(false);
    };

    const handleGetHack = async () => {
        setIsHackLoading(true);
        setLifeHack(null);
        const hack = await getLifeHack(hackCategory);
        setLifeHack(hack);
        setIsHackLoading(false);
    };

    const updateHydration = (change: number) => {
        const newCount = Math.max(0, hydrationCount + change);
        setHydrationCount(newCount);
        onUpdateUser({
            ...currentUser,
            hydration: {
                count: newCount,
                goal: 8,
                lastUpdated: new Date().toISOString()
            }
        });
    };

    const toggleTimer = () => setTimerIsActive(!timerIsActive);
    const resetTimer = (minutes: number = 25) => {
        setTimerIsActive(false);
        setTimerTime(minutes * 60);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const getCategoryStyles = (category: TaskItem['category']) => {
        switch (category) {
            case 'Work': return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-l-purple-500' };
            case 'Home': return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-l-green-500' };
            default: return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-l-blue-500' };
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filterCategory === 'All') return true;
        return task.category === filterCategory;
    });

    return (
        <div className="animate-fade-in-up space-y-8 max-w-7xl mx-auto pb-10">
            <div className="text-center">
                <CoffeeIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Life Balance Hub</h1>
                <p className="text-gray-600 mt-2">Harmonize your tasks, health, and mind.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {/* COLUMN 1: Task Management (Tall) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full xl:row-span-2">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <CheckCircleIcon className="w-6 h-6 text-blue-500" /> Smart Tasks
                    </h2>
                    
                    <div className="bg-gray-100 p-1 rounded-lg flex mb-4">
                        {(['All', 'Personal', 'Work', 'Home'] as const).map(category => (
                            <button
                                key={category}
                                onClick={() => setFilterCategory(category)}
                                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                                    filterCategory === category 
                                        ? 'bg-white text-blue-700 shadow-sm' 
                                        : 'text-gray-600 hover:bg-gray-200/50'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                         <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newTaskText}
                                onChange={(e) => setNewTaskText(e.target.value)}
                                placeholder="Add a task..."
                                className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                            />
                            <button 
                                onClick={handleAddTask}
                                disabled={!newTaskText.trim()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                            >
                                Add
                            </button>
                         </div>
                         <select 
                            value={newTaskCategory} 
                            onChange={(e) => setNewTaskCategory(e.target.value as TaskItem['category'])}
                            className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-xs w-fit"
                        >
                            <option value="Personal">Personal</option>
                            <option value="Work">Work</option>
                            <option value="Home">Home</option>
                        </select>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[600px] space-y-3 pr-1 custom-scrollbar">
                         {filteredTasks.length === 0 && (
                            <div className="text-center py-10 px-4 border-2 border-dashed border-gray-200 rounded-xl">
                                <p className="text-gray-400 text-sm">
                                    {filterCategory === 'All' 
                                        ? "No tasks yet. Stay organized!" 
                                        : `No ${filterCategory} tasks found.`}
                                </p>
                            </div>
                        )}
                        {filteredTasks.map(task => {
                            const styles = getCategoryStyles(task.category);
                            return (
                                <div key={task.id} className={`group flex items-center justify-between p-3 rounded-lg border border-gray-200 border-l-[4px] ${styles.border} ${task.completed ? 'bg-gray-50 opacity-60' : 'bg-white hover:shadow-sm'} transition-all duration-200`}>
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <button 
                                            onClick={() => toggleTask(task.id)}
                                            className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400 bg-white'}`}
                                        >
                                            {task.completed && <CheckCircleIcon className="w-3.5 h-3.5 text-white" />}
                                        </button>
                                        <span className={`truncate text-sm font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{task.text}</span>
                                    </div>
                                    <button 
                                        onClick={() => deleteTask(task.id)} 
                                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* COLUMN 2: Productivity & Hydration */}
                <div className="flex flex-col gap-6">
                    {/* Focus Timer */}
                    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <ClockIcon className="w-6 h-6 text-indigo-500" /> Focus Zone
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={() => { setTimerMode('Focus'); resetTimer(25); }} className={`text-xs px-2 py-1 rounded ${timerMode === 'Focus' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-500 hover:bg-gray-100'}`}>25m</button>
                                <button onClick={() => { setTimerMode('Break'); resetTimer(5); }} className={`text-xs px-2 py-1 rounded ${timerMode === 'Break' ? 'bg-green-100 text-green-700 font-bold' : 'text-gray-500 hover:bg-gray-100'}`}>5m</button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center py-4 relative z-10">
                            <div className="text-6xl font-mono font-bold text-gray-800 tracking-wider mb-6">
                                {formatTime(timerTime)}
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={toggleTimer}
                                    className={`p-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 ${timerIsActive ? 'bg-amber-100 text-amber-600' : 'bg-indigo-600 text-white'}`}
                                >
                                    {timerIsActive ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8 pl-1" />}
                                </button>
                                <button 
                                    onClick={() => resetTimer(timerMode === 'Focus' ? 25 : 5)}
                                    className="p-4 rounded-full bg-white text-gray-500 shadow-md hover:bg-gray-50 hover:text-gray-800 transition-colors"
                                >
                                    <RefreshIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                         {/* Decorative Circle */}
                         <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl"></div>
                    </div>

                    {/* Hydration Station */}
                    <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm flex flex-col items-center relative overflow-hidden">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 z-10">
                             <WaterDropIcon className="w-5 h-5 text-blue-500" /> Hydration Station
                        </h2>
                        
                        <div className="flex gap-3 mb-6 z-10 flex-wrap justify-center">
                            {[...Array(8)].map((_, i) => (
                                <button 
                                    key={i}
                                    onClick={() => i < hydrationCount ? updateHydration(i - hydrationCount) : updateHydration(1)}
                                    className={`transition-all duration-300 transform hover:scale-110 ${i < hydrationCount ? 'text-blue-500' : 'text-gray-200'}`}
                                >
                                    <WaterDropIcon className={`w-8 h-8 ${i < hydrationCount ? 'fill-current drop-shadow-sm' : ''}`} />
                                </button>
                            ))}
                        </div>
                        
                        <div className="flex items-center gap-4 z-10">
                            <button onClick={() => updateHydration(-1)} className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200">-</button>
                            <span className="font-bold text-2xl text-blue-600">{hydrationCount}/8</span>
                            <button onClick={() => updateHydration(1)} className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200">+</button>
                        </div>
                        
                         {/* Wave Background Effect */}
                         <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-blue-50 to-transparent opacity-50"></div>
                    </div>
                </div>

                {/* COLUMN 3: Tools & Wellness */}
                <div className="flex flex-col gap-6">
                     {/* Zen Breath */}
                     <div className="bg-gradient-to-b from-teal-50 to-white p-6 rounded-2xl border border-teal-100 shadow-sm flex flex-col items-center text-center">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Zen Breath</h2>
                        <p className="text-xs text-gray-500 mb-4">Click to inhale & exhale</p>
                        
                        <button 
                            onClick={() => setIsBreathing(!isBreathing)}
                            className="relative group focus:outline-none"
                        >
                            <div className={`w-32 h-32 rounded-full bg-teal-400/20 flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${isBreathing ? 'scale-125' : 'scale-100'}`}>
                                <div className={`w-24 h-24 rounded-full bg-teal-500/30 flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${isBreathing ? 'scale-110' : 'scale-100'}`}>
                                     <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm text-teal-600 font-bold text-sm z-10">
                                        {isBreathing ? '...' : 'Start'}
                                    </div>
                                </div>
                            </div>
                            {isBreathing && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-32 h-32 rounded-full border border-teal-300 animate-ping opacity-20"></div>
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Meal Genius */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-yellow-500" /> Meal Genius
                        </h2>
                        
                        <div className="space-y-3 mb-4">
                            <input 
                                type="text" 
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                placeholder="Ingredients (e.g., eggs, kale)"
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <select 
                                value={cookingTime}
                                onChange={(e) => setCookingTime(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            >
                                <option value="15 mins">15 mins</option>
                                <option value="30 mins">30 mins</option>
                                <option value="45 mins">45 mins</option>
                                <option value="1 hour+">1 hour+</option>
                            </select>
                            <button 
                                onClick={handleGetMeal}
                                disabled={isMealLoading || !ingredients}
                                className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 text-sm"
                            >
                                {isMealLoading ? 'Thinking...' : 'Get Ideas'}
                            </button>
                        </div>

                        {mealSuggestion && (
                            <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100 text-xs text-gray-700 max-h-40 overflow-y-auto custom-scrollbar">
                                <MarkdownRenderer content={mealSuggestion} />
                            </div>
                        )}
                    </div>

                    {/* Life Hacks */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col flex-grow">
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <LightbulbIcon className="w-5 h-5 text-purple-500" /> Tips
                            </h2>
                            <select 
                                value={hackCategory}
                                onChange={(e) => setHackCategory(e.target.value)}
                                className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 max-w-[150px]"
                            >
                                {HACK_CATEGORIES.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="relative flex-grow bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 p-4 flex items-center justify-center text-center min-h-[120px]">
                            {isHackLoading ? (
                                <SparklesIcon className="w-6 h-6 text-purple-400 animate-spin" />
                            ) : lifeHack ? (
                                <p className="text-gray-800 font-medium text-sm italic">
                                    "{lifeHack.replace(/^"|"$/g, '')}"
                                </p>
                            ) : (
                                <button onClick={handleGetHack} className="text-purple-600 text-sm font-semibold hover:underline">
                                    Get a Life Hack
                                </button>
                            )}
                            {lifeHack && !isHackLoading && (
                                <button onClick={handleGetHack} className="absolute bottom-2 right-2 text-gray-400 hover:text-purple-600">
                                    <RefreshIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LifeBalancePage;
