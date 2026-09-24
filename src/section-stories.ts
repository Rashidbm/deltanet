export const appNames: Record<string, string> = {
  'google-drive': 'Google Drive', slack: 'Slack', github: 'GitHub', linear: 'Linear', gmail: 'Gmail', hubspot: 'HubSpot', notion: 'Notion',
}

export const connectorStories = [
  {
    id: 'release', label: 'Gather context', question: 'What changed since my last project update?',
    sources: [
      { app: 'google-drive', title: 'Project plan', location: 'Team workspace / Planning', quote: 'The first milestone is ready. The launch date depends on the final review.' },
      { app: 'slack', title: 'The latest team discussion', location: '#project-updates', quote: 'Omar finished the review this morning. We can move ahead with the launch.' },
    ],
    summary: 'The review is complete. Your brief includes the latest decision and its sources.',
    resultApp: 'notion', resultTitle: 'Your project update', resultMeta: 'Latest changes · Decisions · Source links', resultStatus: 'Context gathered',
  },
  {
    id: 'customer', label: 'Share context', question: 'Bring Noura up to speed so she can take the next step.',
    sources: [
      { app: 'google-drive', title: 'Project brief', location: 'Team workspace / Shared documents', quote: 'The proposal is approved. The next step is to prepare the rollout plan.' },
      { app: 'gmail', title: 'Latest decisions', location: 'Project / Latest thread', quote: 'Please keep the first rollout to the pilot team. We will expand after their feedback.' },
    ],
    summary: 'Noura’s agent receives the brief, decisions and open work. Your private chat stays yours.',
    resultApp: 'notion', resultTitle: 'The context for Noura’s next step', resultMeta: 'Project brief · Decisions · Open work', resultStatus: 'Context shared',
  },
  {
    id: 'review', label: 'Take action', question: 'Create the agreed follow-up tasks in Linear.',
    sources: [
      { app: 'notion', title: 'Planning notes', location: 'Team workspace / Meetings', quote: 'Omar will prepare the rollout plan. Noura will collect feedback from the pilot team.' },
      { app: 'slack', title: 'Agreed next steps', location: '#project-updates', quote: 'Let’s have the rollout plan ready for Tuesday and the feedback summary for Friday.' },
    ],
    summary: 'Two tasks created with the right owners, deadlines and source context.',
    resultApp: 'linear', resultTitle: 'Prepare rollout plan · Collect pilot feedback', resultMeta: 'Omar · Tuesday / Noura · Friday', resultStatus: 'Tasks created',
  },
]

export const architectureLayers = [
  { id: 'workspace', title: 'Workspace', sub: 'The place you work', description: 'Your private conversation, the work your agent produces, and the decisions that need you. A familiar place to pick things up.', chips: ['Private chat', 'Documents', 'Human decisions'], example: 'Rashid asks for a release brief. The finished brief comes back here.' },
  { id: 'coordination', title: 'Coordination', sub: 'The team behind the task', description: 'Agents hand off a clear task, the relevant context, and the expected result. Each person stays in their own workspace.', chips: ['Agent handoffs', 'Scoped context', 'Shared skills'], example: 'Rashid’s agent asks Omar’s agent to verify the open release check.' },
  { id: 'harness', title: 'Harness', sub: 'From intention to action', description: 'The loop that plans the work, calls tools, checks the result, and asks for a decision when one is needed.', chips: ['Plan', 'Act', 'Verify'], example: 'The agent reads the release skill, checks the evidence, and prepares the update.' },
  { id: 'runtime', title: 'Runtime', sub: 'A place for work to keep running', description: 'Cloud jobs, files, and saved progress keep a task moving between visits. Scheduled work resumes from its last checkpoint.', chips: ['Cloud compute', 'Persistent files', 'Scheduled runs'], example: 'The release brief runs overnight and is ready when Rashid returns.' },
] as const
export type ArchitectureLayer = typeof architectureLayers[number]['id']
