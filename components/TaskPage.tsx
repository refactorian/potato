
import React, { useState, useEffect, useRef } from 'react';
import { 
    Check, Plus, Trash2, ChevronRight, ChevronDown, 
    CornerDownRight, Palette, Flag, Bold, Italic, Underline as UnderlineIcon,
    Calendar, GripVertical, AlignLeft, X
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmationModal } from './modals/ConfirmationModal';

// --- Types ---

type Priority = 'low' | 'medium' | 'high';

interface TaskItem {
    id: string;
    content: string; // This is the Title (Plain text)
    description?: string; // This is the Description (Rich Text)
    isCompleted: boolean;
    isExpanded: boolean; // Controls visibility of CHILDREN
    isDetailsOpen?: boolean; // Controls visibility of DETAILS PANEL
    color: string;
    priority: Priority;
    dueDate?: string;
    createdAt: number;
    children: TaskItem[];
}

// --- Constants ---

const COLORS = [
    { name: 'Default', value: 'transparent' },
    { name: 'Red', value: '#fee2e2' }, // red-100
    { name: 'Orange', value: '#ffedd5' }, // orange-100
    { name: 'Amber', value: '#fef3c7' }, // amber-100
    { name: 'Green', value: '#dcfce7' }, // green-100
    { name: 'Blue', value: '#dbeafe' }, // blue-100
    { name: 'Indigo', value: '#e0e7ff' }, // indigo-100
    { name: 'Purple', value: '#f3e8ff' }, // purple-100
    { name: 'Pink', value: '#fce7f3' }, // pink-100
];

const DARK_COLORS = [
    { name: 'Default', value: 'transparent' },
    { name: 'Red', value: 'rgba(239, 68, 68, 0.2)' }, 
    { name: 'Orange', value: 'rgba(249, 115, 22, 0.2)' }, 
    { name: 'Amber', value: 'rgba(245, 158, 11, 0.2)' }, 
    { name: 'Green', value: 'rgba(34, 197, 94, 0.2)' }, 
    { name: 'Blue', value: 'rgba(59, 130, 246, 0.2)' }, 
    { name: 'Indigo', value: 'rgba(99, 102, 241, 0.2)' }, 
    { name: 'Purple', value: 'rgba(168, 85, 247, 0.2)' }, 
    { name: 'Pink', value: 'rgba(236, 72, 153, 0.2)' }, 
];

// --- Helper Components ---

const RichTextEditor = ({ 
    initialContent, 
    onUpdate, 
    placeholder,
    className 
}: { 
    initialContent: string, 
    onUpdate: (html: string) => void, 
    placeholder?: string,
    className?: string
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Sync initial content only once or if significantly different to avoid cursor jumping
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== initialContent && !isFocused) {
            editorRef.current.innerHTML = initialContent;
        }
    }, [initialContent, isFocused]);

    const handleInput = () => {
        if (editorRef.current) {
            onUpdate(editorRef.current.innerHTML);
        }
    };

    const execCmd = (e: React.MouseEvent, cmd: string) => {
        e.preventDefault();
        e.stopPropagation();
        document.execCommand(cmd, false, undefined);
        editorRef.current?.focus();
    };

    return (
        <div className={`relative group/editor border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors ${isFocused ? 'ring-2 ring-indigo-500/20 border-indigo-500' : 'bg-gray-50 dark:bg-gray-800'} ${className}`}>
            <div className="flex items-center gap-1 p-1 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-750">
                <button onMouseDown={(e) => execCmd(e, 'bold')} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-300" title="Bold"><Bold size={14} /></button>
                <button onMouseDown={(e) => execCmd(e, 'italic')} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-300" title="Italic"><Italic size={14} /></button>
                <button onMouseDown={(e) => execCmd(e, 'underline')} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-300" title="Underline"><UnderlineIcon size={14} /></button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="outline-none min-h-[80px] p-3 text-sm text-gray-800 dark:text-gray-200 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 cursor-text"
                data-placeholder={placeholder}
            />
        </div>
    );
};

// --- Main Page Component ---

export const TaskPage: React.FC = () => {
    // Load from local storage or default
    const [tasks, setTasks] = useState<TaskItem[]>(() => {
        const saved = localStorage.getItem('potato_tasks');
        if (saved) {
            try {
                // Migration check: Ensure items have description field if missing
                const parsed = JSON.parse(saved);
                const migrate = (list: any[]): TaskItem[] => list.map(item => ({
                    ...item,
                    description: item.description || '',
                    children: item.children ? migrate(item.children) : []
                }));
                return migrate(parsed);
            } catch(e) {
                console.error("Failed to load tasks", e);
            }
        }
        return [
            {
                id: 'root-1',
                content: 'Welcome to your new Tasks',
                description: 'Click this row to expand details and see more options.',
                isCompleted: false,
                isExpanded: true,
                isDetailsOpen: true,
                color: 'transparent',
                priority: 'high',
                createdAt: Date.now(),
                children: [
                    {
                        id: 'child-1',
                        content: 'This is a subtask',
                        description: '',
                        isCompleted: false,
                        isExpanded: false,
                        color: 'transparent',
                        priority: 'medium',
                        createdAt: Date.now(),
                        children: []
                    }
                ]
            }
        ];
    });

    const [newItemText, setNewItemText] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string } | null>(null);
    
    // Drag State
    const [draggedItem, setDraggedItem] = useState<TaskItem | null>(null);
    const [dragOverItem, setDragOverItem] = useState<{ id: string; position: 'top' | 'middle' | 'bottom' } | null>(null);

    useEffect(() => {
        localStorage.setItem('potato_tasks', JSON.stringify(tasks));
    }, [tasks]);

    // --- Logic Helpers (Recursive) ---

    const updateTree = (items: TaskItem[], id: string, updateFn: (item: TaskItem) => TaskItem): TaskItem[] => {
        return items.map(item => {
            if (item.id === id) return updateFn(item);
            if (item.children.length) {
                return { ...item, children: updateTree(item.children, id, updateFn) };
            }
            return item;
        });
    };

    const deleteFromTree = (items: TaskItem[], id: string): TaskItem[] => {
        return items.filter(item => item.id !== id).map(item => {
            if (item.children.length) {
                return { ...item, children: deleteFromTree(item.children, id) };
            }
            return item;
        });
    };

    const addChildToTree = (items: TaskItem[], parentId: string, newChild: TaskItem): TaskItem[] => {
        return items.map(item => {
            if (item.id === parentId) {
                return { ...item, isExpanded: true, isDetailsOpen: true, children: [...item.children, newChild] };
            }
            if (item.children.length) {
                return { ...item, children: addChildToTree(item.children, parentId, newChild) };
            }
            return item;
        });
    };

    const findItem = (items: TaskItem[], id: string): TaskItem | null => {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.children.length) {
                const found = findItem(item.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    // --- Actions ---

    const handleAddRoot = () => {
        if (!newItemText.trim()) return;
        const newTask: TaskItem = {
            id: uuidv4(),
            content: newItemText,
            description: '',
            isCompleted: false,
            isExpanded: false,
            isDetailsOpen: false,
            color: 'transparent',
            priority: 'medium',
            createdAt: Date.now(),
            children: []
        };
        setTasks([newTask, ...tasks]);
        setNewItemText('');
    };

    const handleAddSubTask = (parentId: string) => {
        const newTask: TaskItem = {
            id: uuidv4(),
            content: '',
            description: '',
            isCompleted: false,
            isExpanded: false,
            isDetailsOpen: true, // Open details immediately for editing
            color: 'transparent',
            priority: 'medium',
            createdAt: Date.now(),
            children: []
        };
        setTasks(prev => addChildToTree(prev, parentId, newTask));
    };

    const confirmDelete = () => {
        if (deleteModal) {
            setTasks(prev => deleteFromTree(prev, deleteModal.id));
            setDeleteModal(null);
        }
    };

    const handleUpdate = (id: string, updates: Partial<TaskItem>) => {
        setTasks(prev => updateTree(prev, id, item => ({ ...item, ...updates })));
    };

    const toggleComplete = (id: string, currentStatus: boolean) => {
        handleUpdate(id, { isCompleted: !currentStatus });
    };

    // --- Drag & Drop Logic ---

    const handleDragStart = (e: React.DragEvent, item: TaskItem) => {
        e.stopPropagation();
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!draggedItem || draggedItem.id === targetId) return;

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const y = e.clientY - rect.top;
        const height = rect.height;

        let position: 'top' | 'middle' | 'bottom' = 'middle';
        
        if (y < height * 0.25) position = 'top';
        else if (y > height * 0.75) position = 'bottom';
        else position = 'middle';

        setDragOverItem({ id: targetId, position });
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!draggedItem || !dragOverItem || draggedItem.id === targetId) {
            setDragOverItem(null);
            setDraggedItem(null);
            return;
        }

        // Prevent circular drop
        if (draggedItem.children.length > 0) {
             const checkDescendant = (items: TaskItem[]): boolean => {
                 for(const item of items) {
                     if(item.id === targetId) return true;
                     if(checkDescendant(item.children)) return true;
                 }
                 return false;
             }
             if(checkDescendant(draggedItem.children)) {
                 setDragOverItem(null);
                 setDraggedItem(null);
                 return;
             }
        }

        // 1. Remove dragged item
        let newTree = deleteFromTree(tasks, draggedItem.id);
        const itemToMove = findItem(tasks, draggedItem.id); 
        
        if (!itemToMove) {
             setDragOverItem(null);
             setDraggedItem(null);
             return;
        }

        // 2. Insert into new position
        const insertNode = (items: TaskItem[]): TaskItem[] => {
            return items.reduce((acc: TaskItem[], item) => {
                if (item.id === targetId) {
                    if (dragOverItem.position === 'top') {
                        return [...acc, itemToMove, item];
                    } else if (dragOverItem.position === 'bottom') {
                        return [...acc, item, itemToMove];
                    } else {
                        return [...acc, { ...item, isExpanded: true, children: [...item.children, itemToMove] }];
                    }
                }
                
                if (item.children.length > 0) {
                    return [...acc, { ...item, children: insertNode(item.children) }];
                }
                
                return [...acc, item];
            }, []);
        };

        setTasks(insertNode(newTree));
        setDragOverItem(null);
        setDraggedItem(null);
    };

    // --- Stats ---
    const countTotal = (items: TaskItem[]): number => items.reduce((acc, item) => acc + 1 + countTotal(item.children), 0);
    const countCompleted = (items: TaskItem[]): number => items.reduce((acc, item) => acc + (item.isCompleted ? 1 : 0) + countCompleted(item.children), 0);
    
    const total = countTotal(tasks);
    const completed = countCompleted(tasks);
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-950 overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <div className="max-w-4xl w-full mx-auto flex flex-col h-full relative z-10">
                
                {/* Header */}
                <div className="p-8 pb-4 shrink-0">
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Project Tasks</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your prototype requirements and tasks.</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{progress}%</div>
                            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Completed</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-8">
                        <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Quick Add */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative flex items-center gap-2 bg-white dark:bg-gray-900 p-2 pr-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                            <div className="pl-3 text-gray-400"><Plus size={20} /></div>
                            <input 
                                type="text"
                                className="flex-1 bg-transparent p-2 outline-none text-gray-800 dark:text-white placeholder-gray-400"
                                placeholder="Add a new root task... (Press Enter)"
                                value={newItemText}
                                onChange={(e) => setNewItemText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddRoot()}
                            />
                            <button 
                                onClick={handleAddRoot}
                                disabled={!newItemText.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>

                {/* Task List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-20">
                    {tasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600 mb-4">
                                <Check size={32} />
                            </div>
                            <h3 className="text-gray-900 dark:text-white font-medium mb-1">All caught up!</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Add a task above to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {tasks.map(task => (
                                <TaskItemComponent 
                                    key={task.id} 
                                    item={task} 
                                    level={0}
                                    onUpdate={handleUpdate}
                                    onDelete={(id) => setDeleteModal({ isOpen: true, id })}
                                    onAddSub={handleAddSubTask}
                                    onToggle={toggleComplete}
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    dragOverItem={dragOverItem}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {deleteModal && (
                <ConfirmationModal
                    isOpen={deleteModal.isOpen}
                    title="Delete Task?"
                    message="Are you sure you want to delete this task? All sub-tasks will also be deleted."
                    onClose={() => setDeleteModal(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
};

// --- Recursive Item Component ---

// Define interface for TaskItemComponent props to properly handle React attributes like 'key'
interface TaskItemComponentProps {
    item: TaskItem;
    level: number;
    onUpdate: (id: string, data: Partial<TaskItem>) => void;
    onDelete: (id: string) => void;
    onAddSub: (id: string) => void;
    onToggle: (id: string, status: boolean) => void;
    onDragStart: (e: React.DragEvent, item: TaskItem) => void;
    onDragOver: (e: React.DragEvent, id: string) => void;
    onDrop: (e: React.DragEvent, id: string) => void;
    dragOverItem: { id: string; position: 'top' | 'middle' | 'bottom' } | null;
}

// Convert to React.FC to correctly support JSX features and key prop
const TaskItemComponent: React.FC<TaskItemComponentProps> = ({ 
    item, 
    level, 
    onUpdate, 
    onDelete, 
    onAddSub,
    onToggle,
    onDragStart,
    onDragOver,
    onDrop,
    dragOverItem
}) => {
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    
    // Priority Colors
    const getPriorityColor = (p: Priority) => {
        switch(p) {
            case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
            case 'medium': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
            case 'low': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
        }
    };

    // Calculate background color based on theme
    const getBgStyle = (colorValue: string) => {
        if (colorValue === 'transparent') return {};
        const isDark = document.documentElement.classList.contains('dark');
        
        if (isDark) {
            const darkColor = DARK_COLORS.find(c => c.name === COLORS.find(lc => lc.value === colorValue)?.name)?.value;
            return { backgroundColor: darkColor || colorValue };
        }
        return { backgroundColor: colorValue };
    };

    // Visual indicators for drop zones
    const isDragTarget = dragOverItem?.id === item.id;
    const dropIndicatorStyle = isDragTarget ? {
        borderTop: dragOverItem?.position === 'top' ? '2px solid #6366f1' : undefined,
        borderBottom: dragOverItem?.position === 'bottom' ? '2px solid #6366f1' : undefined,
        background: dragOverItem?.position === 'middle' ? 'rgba(99, 102, 241, 0.1)' : undefined,
        boxShadow: dragOverItem?.position === 'middle' ? 'inset 0 0 0 2px #6366f1' : undefined
    } : {};

    return (
        <div 
            className="animate-in fade-in slide-in-from-bottom-1 duration-300 my-1"
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            onDragOver={(e) => onDragOver(e, item.id)}
            onDrop={(e) => onDrop(e, item.id)}
        >
            <div 
                className={`
                    relative rounded-xl border transition-all duration-200 group/item flex flex-col
                    ${item.isCompleted ? 'opacity-70' : ''}
                    ${item.color === 'transparent' 
                        ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800' 
                        : 'border-transparent shadow-sm'
                    }
                    ${item.isDetailsOpen ? 'ring-2 ring-indigo-500/50 shadow-md z-10' : 'hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700'}
                `}
                style={{ ...getBgStyle(item.color), ...dropIndicatorStyle }}
            >
                {/* Indent Guide for nested items */}
                {level > 0 && (
                    <div className="absolute -left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800" />
                )}
                {level > 0 && (
                    <div className="absolute -left-4 top-6 w-4 h-px bg-gray-200 dark:bg-gray-800" />
                )}

                {/* Drag Handle */}
                <div className="absolute left-1 top-4 cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 opacity-0 group-hover/item:opacity-100 transition-opacity z-20">
                    <GripVertical size={14} />
                </div>

                {/* Main Row: Checkbox, Title, Badges */}
                <div 
                    className="flex items-center gap-3 p-3 cursor-pointer"
                    onClick={() => onUpdate(item.id, { isDetailsOpen: !item.isDetailsOpen })}
                >
                    <div className="pl-3" /> {/* Spacer for drag handle */}

                    {/* Checkbox */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggle(item.id, item.isCompleted); }}
                        className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${
                            item.isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-500 bg-white dark:bg-gray-800'
                        }`}
                    >
                        {item.isCompleted && <Check size={12} strokeWidth={3} />}
                    </button>

                    {/* Simple Title Input */}
                    <div className="flex-1 min-w-0">
                        <input 
                            type="text"
                            value={item.content}
                            onClick={(e) => e.stopPropagation()} // Prevent expansion when editing title
                            onChange={(e) => onUpdate(item.id, { content: e.target.value })}
                            className={`w-full bg-transparent border-none outline-none text-sm font-medium transition-all ${item.isCompleted ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'}`}
                            placeholder="Task title..."
                        />
                    </div>

                    {/* Badges (Collapsed View) */}
                    {!item.isDetailsOpen && (
                        <div className="flex items-center gap-2">
                            {item.dueDate && (
                                <div className="text-[10px] text-gray-500 flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                    <Calendar size={10} /> {new Date(item.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                                </div>
                            )}
                            <div className={`w-2 h-2 rounded-full ${
                                item.priority === 'high' ? 'bg-red-500' : item.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                            }`} />
                        </div>
                    )}

                    {/* Hierarchy Toggle */}
                    {item.children.length > 0 && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onUpdate(item.id, { isExpanded: !item.isExpanded }); }}
                            className={`p-1 text-gray-400 hover:text-indigo-600 transition-colors ${item.isExpanded ? 'rotate-90' : ''}`}
                        >
                            <ChevronRight size={16} />
                        </button>
                    )}
                </div>

                {/* Details Panel (Expanded View) */}
                {item.isDetailsOpen && (
                    <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-1 duration-200 cursor-default" onClick={(e) => e.stopPropagation()}>
                        <div className="h-px w-full bg-gray-100 dark:bg-gray-800 mb-3" />
                        
                        {/* Description Editor */}
                        <div className="mb-4">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Description</label>
                            <RichTextEditor 
                                initialContent={item.description || ''} 
                                onUpdate={(html) => onUpdate(item.id, { description: html })} 
                                placeholder="Add details, notes, or links..."
                            />
                        </div>

                        {/* Functions Toolbar */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {/* Priority Selector */}
                            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                {(['low', 'medium', 'high'] as const).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => onUpdate(item.id, { priority: p })}
                                        className={`px-2 py-1 rounded text-xs capitalize transition-colors ${item.priority === p ? 'bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

                            {/* Date Picker */}
                            <div className="relative">
                                <label className="flex items-center gap-1 px-2 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer text-xs text-gray-600 dark:text-gray-300">
                                    <Calendar size={14} />
                                    <span>{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'Set Date'}</span>
                                    <input 
                                        type="date" 
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        value={item.dueDate || ''}
                                        onChange={(e) => onUpdate(item.id, { dueDate: e.target.value })}
                                    />
                                </label>
                            </div>

                            {/* Color Picker */}
                            <div className="relative">
                                <button 
                                    onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                                    className="flex items-center gap-1 px-2 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-300"
                                >
                                    <Palette size={14} /> Color
                                </button>
                                {isColorPickerOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsColorPickerOpen(false)} />
                                        <div className="absolute left-0 bottom-full mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 grid grid-cols-5 gap-1 w-40 animate-in fade-in zoom-in-95 duration-100">
                                            {COLORS.map((c) => (
                                                <button
                                                    key={c.name}
                                                    onClick={() => { onUpdate(item.id, { color: c.value }); setIsColorPickerOpen(false); }}
                                                    className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform"
                                                    style={{ backgroundColor: c.value === 'transparent' ? '#fff' : c.value }}
                                                    title={c.name}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex-1" />

                            {/* Delete */}
                            <button 
                                onClick={() => onDelete(item.id)}
                                className="flex items-center gap-1 px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>

                        {/* Add Subtask Button within Panel */}
                        <button 
                            onClick={() => onAddSub(item.id)}
                            className="w-full py-2 flex items-center justify-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-800"
                        >
                            <CornerDownRight size={16} /> Add Subtask
                        </button>
                    </div>
                )}
            </div>

            {/* Nested Items */}
            {item.children.length > 0 && item.isExpanded && (
                <div className="pl-8 mt-1 space-y-1 relative">
                    {/* Vertical connector line */}
                    <div className="absolute left-6 top-0 bottom-4 w-px bg-gray-200 dark:bg-gray-800" />
                    
                    {item.children.map(child => (
                        <TaskItemComponent 
                            key={child.id} 
                            item={child} 
                            level={level + 1}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            onAddSub={onAddSub}
                            onToggle={onToggle}
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            dragOverItem={dragOverItem}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
