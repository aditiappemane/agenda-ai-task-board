
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Check, Trash2, User, Clock } from 'lucide-react';
import { parseTranscript } from '@/utils/transcriptParser';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskForm } from '@/components/AddTaskForm';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  description: string;
  assignee: string;
  deadline: string;
  priority: 'P1' | 'P2' | 'P3';
  completed: boolean;
  createdAt: Date;
}

const Index = () => {
  const [transcript, setTranscript] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const handleParseTranscript = () => {
    if (!transcript.trim()) {
      toast({
        title: "No transcript provided",
        description: "Please paste a meeting transcript to parse tasks.",
        variant: "destructive"
      });
      return;
    }

    const parsedTasks = parseTranscript(transcript);
    if (parsedTasks.length === 0) {
      toast({
        title: "No tasks found",
        description: "Could not extract any tasks from the transcript. Try a different format.",
        variant: "destructive"
      });
      return;
    }

    setTasks(prev => [...prev, ...parsedTasks]);
    setTranscript('');
    
    toast({
      title: "Tasks extracted successfully!",
      description: `Found ${parsedTasks.length} task(s) from the meeting transcript.`,
    });
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
    setShowAddForm(false);
    
    toast({
      title: "Task added",
      description: "New task has been added to your board.",
    });
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "Task has been removed from your board.",
    });
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            AI Meeting Minutes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your meeting transcripts into actionable tasks with AI-powered parsing
          </p>
        </div>

        {/* Transcript Parser Section */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-purple-600" />
              Meeting Transcript Parser
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your meeting transcript here... Example: 'Aman you take the landing page by 10pm tomorrow. Rajeev you take care of client follow-up by Wednesday. Shreya please review the marketing deck tonight.'"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="min-h-32 resize-none border-2 border-purple-200 focus:border-purple-500 rounded-lg"
            />
            <div className="flex gap-3">
              <Button 
                onClick={handleParseTranscript}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                disabled={!transcript.trim()}
              >
                Parse Tasks
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(true)}
                className="border-purple-300 text-purple-600 hover:bg-purple-50 px-6 py-2 rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Manual Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Task Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <AddTaskForm 
              onSubmit={handleAddTask}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Task Statistics */}
        {tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Tasks</p>
                    <p className="text-3xl font-bold">{tasks.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Active Tasks</p>
                    <p className="text-3xl font-bold">{activeTasks.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Completed</p>
                    <p className="text-3xl font-bold">{completedTasks.length}</p>
                  </div>
                  <Check className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Task Board */}
        <div className="space-y-8">
          {/* Active Tasks */}
          {activeTasks.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Clock className="h-6 w-6 text-blue-600" />
                Active Tasks ({activeTasks.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Check className="h-6 w-6 text-green-600" />
                Completed Tasks ({completedTasks.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {tasks.length === 0 && (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks yet</h3>
                <p className="text-gray-500 mb-6">
                  Parse a meeting transcript or add tasks manually to get started
                </p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Task
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
