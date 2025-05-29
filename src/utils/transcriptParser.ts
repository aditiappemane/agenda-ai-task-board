
import type { Task } from '@/pages/Index';

interface ParsedTask {
  description: string;
  assignee: string;
  deadline: string;
  priority: 'P1' | 'P2' | 'P3';
}

export function parseTranscript(transcript: string): Task[] {
  const tasks: Task[] = [];
  
  // Clean and split the transcript into sentences
  const sentences = transcript
    .split(/[.!;]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  sentences.forEach(sentence => {
    const parsedTask = extractTaskFromSentence(sentence);
    if (parsedTask) {
      tasks.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...parsedTask,
        completed: false,
        createdAt: new Date()
      });
    }
  });

  return tasks;
}

function extractTaskFromSentence(sentence: string): ParsedTask | null {
  console.log('Parsing sentence:', sentence);
  
  // Common patterns for task assignment
  const patterns = [
    // "Name you/should take/do/handle X by/until deadline" - capture the action verb
    /(\w+)\s+(?:you\s+)?(?:please\s+)?(take|do|handle|work on|complete|finish|review|prepare|create|build|design|develop|write|update|fix|check|test|implement|research|analyze|contact|call|email|follow[\s-]?up|follow\s+up\s+on)\s+(?:the\s+)?(.+?)\s+(?:by|until|before|due)\s+(.+)/i,
    
    // "Name please do X by deadline" - capture the action verb
    /(\w+)\s+please\s+(take|do|handle|work on|complete|finish|review|prepare|create|build|design|develop|write|update|fix|check|test|implement|research|analyze|contact|call|email|follow[\s-]?up|follow\s+up\s+on)\s+(?:the\s+)?(.+?)\s+(?:by|until|before|due)\s+(.+)/i,
    
    // "Name please do X tonight/today/tomorrow" (time-based deadlines) - capture the action verb
    /(\w+)\s+please\s+(take|do|handle|work on|complete|finish|review|prepare|create|build|design|develop|write|update|fix|check|test|implement|research|analyze|contact|call|email|follow[\s-]?up|follow\s+up\s+on)\s+(?:the\s+)?(.+?)\s+(tonight|today|tomorrow|this\s+week|next\s+week|this\s+morning|this\s+afternoon|this\s+evening)/i,
    
    // "Name, you take X by deadline" - capture the action verb
    /(\w+),?\s+you\s+(take|do|handle|work on|complete|finish|review|prepare|create|build|design|develop|write|update|fix|check|test|implement|research|analyze|contact|call|email|follow[\s-]?up|follow\s+up\s+on)\s+(?:the\s+)?(.+?)\s+(?:by|until|before|due)\s+(.+)/i,
    
    // "Name is responsible for X by deadline"
    /(\w+)\s+(?:is\s+)?(?:responsible\s+for|assigned\s+to|tasked\s+with)\s+(.+?)\s+(?:by|until|before|due)\s+(.+)/i,
    
    // "Name - do X by deadline" (with dash) - capture the action verb
    /(\w+)\s*[-–]\s*(take|do|handle|work on|complete|finish|review|prepare|create|build|design|develop|write|update|fix|check|test|implement|research|analyze|contact|call|email|follow[\s-]?up|follow\s+up\s+on)\s+(?:the\s+)?(.+?)\s+(?:by|until|before|due)\s+(.+)/i,

    // "Name needs to/should X by deadline" - capture the action verb
    /(\w+)\s+(?:needs?\s+to|should|must|has\s+to)\s+(take|do|handle|work on|complete|finish|review|prepare|create|build|design|develop|write|update|fix|check|test|implement|research|analyze|contact|call|email|follow[\s-]?up|follow\s+up\s+on)\s+(?:the\s+)?(.+?)\s+(?:by|until|before|due)\s+(.+)/i,

    // "Name X tonight/today/tomorrow" (simple time-based) - capture the action verb
    /(\w+)\s+(take|do|handle|work on|complete|finish|review|prepare|create|build|design|develop|write|update|fix|check|test|implement|research|analyze|contact|call|email|follow[\s-]?up|follow\s+up\s+on)\s+(?:the\s+)?(.+?)\s+(tonight|today|tomorrow|this\s+week|next\s+week|this\s+morning|this\s+afternoon|this\s+evening)/i
  ];

  for (const pattern of patterns) {
    const match = sentence.match(pattern);
    if (match) {
      let assignee, action, description, deadline;
      
      // Check if this is a pattern that captures the action verb
      if (match.length === 5) {
        [, assignee, action, description, deadline] = match;
        // Combine action with description for better context
        description = `${action} ${description}`;
      } else {
        // Pattern without action capture (like "responsible for")
        [, assignee, description, deadline] = match;
      }
      
      console.log('Match found:', { assignee: assignee.trim(), description: description.trim(), deadline: deadline.trim() });
      
      return {
        assignee: assignee.trim(),
        description: description.trim(),
        deadline: deadline.trim(),
        priority: extractPriority(sentence)
      };
    }
  }

  console.log('No match found for sentence');
  return null;
}

function extractPriority(sentence: string): 'P1' | 'P2' | 'P3' {
  const lowerSentence = sentence.toLowerCase();
  
  // High priority indicators
  if (lowerSentence.includes('urgent') || 
      lowerSentence.includes('asap') || 
      lowerSentence.includes('immediately') ||
      lowerSentence.includes('critical') ||
      lowerSentence.includes('priority 1') ||
      lowerSentence.includes('p1')) {
    return 'P1';
  }
  
  // Medium priority indicators
  if (lowerSentence.includes('important') || 
      lowerSentence.includes('soon') ||
      lowerSentence.includes('priority 2') ||
      lowerSentence.includes('p2')) {
    return 'P2';
  }
  
  // Default to P3 (normal priority)
  return 'P3';
}
