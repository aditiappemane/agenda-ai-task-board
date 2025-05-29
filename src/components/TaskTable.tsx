
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Trash2, User, Calendar, Clock } from 'lucide-react';
import type { Task } from '@/pages/Index';

interface TaskTableProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onToggleComplete, onDelete }) => {
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
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
          <Clock className="h-6 w-6 text-purple-600" />
          Task Overview Table
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Task</TableHead>
                <TableHead className="font-semibold">Assigned To</TableHead>
                <TableHead className="font-semibold">Due Date/Time</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className={task.completed ? 'opacity-60' : ''}>
                  <TableCell className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{task.assignee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{task.deadline}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getPriorityColor(task.priority)} font-medium`}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.completed ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Completed
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onToggleComplete(task.id)}
                        variant="outline"
                        size="sm"
                        className={`${
                          task.completed
                            ? 'border-orange-300 text-orange-600 hover:bg-orange-50'
                            : 'border-green-300 text-green-600 hover:bg-green-50'
                        }`}
                      >
                        <Check className="h-4 w-4" />
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No tasks to display</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
