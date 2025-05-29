
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Trash2, User, Calendar, Clock } from 'lucide-react';
import type { Task } from '@/pages/Index';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onDelete }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'P2':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'P3':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'P1':
        return 'High Priority';
      case 'P2':
        return 'Medium Priority';
      case 'P3':
        return 'Normal Priority';
      default:
        return priority;
    }
  };

  return (
    <Card className={`border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${
      task.completed 
        ? 'bg-gray-50 opacity-75' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Priority Badge */}
          <div className="flex justify-between items-start">
            <Badge className={`${getPriorityColor(task.priority)} font-medium px-3 py-1`}>
              {getPriorityLabel(task.priority)}
            </Badge>
            {task.completed && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Completed
              </Badge>
            )}
          </div>

          {/* Task Description */}
          <div className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            <h3 className="font-semibold text-lg mb-2 leading-tight">
              {task.description}
            </h3>
          </div>

          {/* Assignee */}
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4" />
            <span className="font-medium">{task.assignee}</span>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{task.deadline}</span>
          </div>

          {/* Created Date */}
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Clock className="h-3 w-3" />
            <span>Created {task.createdAt.toLocaleDateString()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => onToggleComplete(task.id)}
              variant="outline"
              size="sm"
              className={`flex-1 ${
                task.completed
                  ? 'border-orange-300 text-orange-600 hover:bg-orange-50'
                  : 'border-green-300 text-green-600 hover:bg-green-50'
              }`}
            >
              <Check className="h-4 w-4 mr-2" />
              {task.completed ? 'Reopen' : 'Complete'}
            </Button>
            
            <Button
              onClick={() => onDelete(task.id)}
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
