export type OrderStatus = 'new' | 'in_progress' | 'pending_review' | 'revision' | 'completed' | 'archived';
export type ContentType = 'Blog Post' | 'Web Copy' | 'Social Media' | 'Email Sequence' | 'Case Study' | 'Whitepaper' | 'Product Description';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface OrderItem {
  title: string;
  desc: string;
}

export interface Order {
  id: string;
  author: string;
  avatar: string;
  orderId: string;
  type: ContentType;
  wordCount: string;
  price: string;
  status: OrderStatus;
  priority: Priority;
  items: OrderItem[];
  notes: string;
  dueDate: string;
  createdAt: string;
  deliveredContent?: string;
}

export interface Message {
  id: string;
  orderId: string;
  sender: string;
  senderAvatar: string;
  isOwn: boolean;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  description: string;
}

export const CURRENT_USER = {
  name: 'Pascal Attama',
  email: 'Attamapascalpedro@gmail.com',
  company: 'Acme Corp',
  avatar: 'PA',
  plan: 'Pro',
  timezone: 'America/New_York',
};

export const ORDERS: Order[] = [
  {
    id: '1',
    author: 'Alex Trie',
    avatar: 'AT',
    orderId: '#299283',
    type: 'Blog Post',
    wordCount: '1500 words',
    price: '$125.00',
    status: 'new',
    priority: 'high',
    items: [
      { title: 'SEO Optimization', desc: 'Target keyword: SaaS analytics' },
      { title: 'Custom Graphics', desc: '2 header images' },
    ],
    notes: 'Please use an active voice and keep paragraphs under 3 sentences for better readability.',
    dueDate: '2026-05-05',
    createdAt: '2026-04-28',
  },
  {
    id: '2',
    author: 'Jerome Bell',
    avatar: 'JB',
    orderId: '#299265',
    type: 'Web Copy',
    wordCount: '800 words',
    price: '$85.00',
    status: 'in_progress',
    priority: 'medium',
    items: [{ title: 'Landing Page Copy', desc: 'Hero, Features, Pricing sections' }],
    notes: 'Focus on the benefits of time-saving for engineering managers.',
    dueDate: '2026-05-03',
    createdAt: '2026-04-27',
  },
  {
    id: '3',
    author: 'Annette Black',
    avatar: 'AB',
    orderId: '#299222',
    type: 'Social Media',
    wordCount: '400 words',
    price: '$45.00',
    status: 'pending_review',
    priority: 'low',
    items: [
      { title: 'Twitter Thread', desc: '10 tweets on productivity' },
      { title: 'LinkedIn Post', desc: 'Long-form text post' },
    ],
    notes: 'Keep the tone professional but approachable.',
    dueDate: '2026-05-01',
    createdAt: '2026-04-26',
    deliveredContent: `## Twitter Thread: 10 Productivity Hacks for Modern Teams\n\n1/ Most teams don't have a productivity problem. They have a clarity problem. Here's how to fix it 🧵\n\n2/ Start every week with a 15-minute team alignment. Not a status update — an alignment. There's a difference.\n\n3/ Kill the meeting that could've been an email. Then kill the email that could've been a Slack message...`,
  },
  {
    id: '4',
    author: 'Kristin Watson',
    avatar: 'KW',
    orderId: '#291234',
    type: 'Case Study',
    wordCount: '2000 words',
    price: '$250.00',
    status: 'pending_review',
    priority: 'high',
    items: [{ title: 'Customer Interview', desc: 'Transcribed and formatted' }],
    notes: 'Highlight the ROI metric prominently in the introduction paragraph.',
    dueDate: '2026-05-07',
    createdAt: '2026-04-25',
    deliveredContent: `## How Acme Corp Reduced Churn by 40% in 90 Days\n\n**Client:** TechStartup Inc.\n**Challenge:** High customer churn rates threatening MRR growth\n\n### The Problem\n\nTechStartup Inc. was facing a critical challenge: a 22% monthly churn rate that was outpacing new customer acquisition...`,
  },
  {
    id: '5',
    author: 'Jenny Wilson',
    avatar: 'JW',
    orderId: '#299444',
    type: 'Email Sequence',
    wordCount: '1200 words',
    price: '$150.00',
    status: 'in_progress',
    priority: 'urgent',
    items: [{ title: 'Welcome Series', desc: '5 automated onboarding emails' }],
    notes: 'Include clear CTAs to book a demo at the end of email 3 and 5.',
    dueDate: '2026-05-02',
    createdAt: '2026-04-26',
  },
  {
    id: '6',
    author: 'Darrell Steward',
    avatar: 'DS',
    orderId: '#299102',
    type: 'Whitepaper',
    wordCount: '3500 words',
    price: '$450.00',
    status: 'new',
    priority: 'medium',
    items: [
      { title: 'Industry Report', desc: 'Future of AI in Fintech' },
      { title: 'Data Visualization', desc: '4 custom charts included' },
    ],
    notes: 'Reference the provided PDF for statistical data points.',
    dueDate: '2026-05-15',
    createdAt: '2026-04-29',
  },
  {
    id: '7',
    author: 'Robert Fox',
    avatar: 'RF',
    orderId: '#298901',
    type: 'Blog Post',
    wordCount: '1000 words',
    price: '$95.00',
    status: 'completed',
    priority: 'low',
    items: [{ title: 'Thought Leadership Piece', desc: 'Future of remote work in 2026' }],
    notes: 'Great work on the previous one — same style please.',
    dueDate: '2026-04-20',
    createdAt: '2026-04-15',
    deliveredContent: `## The Future of Remote Work in 2026 and Beyond\n\nThe remote work revolution didn't just change where we work — it fundamentally rewired how we think about productivity, culture, and what it means to belong to a company...`,
  },
  {
    id: '8',
    author: 'Savannah Nguyen',
    avatar: 'SN',
    orderId: '#298745',
    type: 'Product Description',
    wordCount: '500 words',
    price: '$60.00',
    status: 'archived',
    priority: 'low',
    items: [{ title: 'E-commerce Listing', desc: 'Premium coffee grinder' }],
    notes: 'Use sensory language. Emphasize craftsmanship.',
    dueDate: '2026-04-10',
    createdAt: '2026-04-05',
  },
];

export const MESSAGES: Message[] = [
  {
    id: 'm1',
    orderId: '2',
    sender: 'Jerome Bell',
    senderAvatar: 'JB',
    isOwn: false,
    content: "Hi! I've started working on the landing page copy. Quick question — should the hero headline focus on the time-saving angle or the AI-powered features?",
    timestamp: '2026-04-30T14:22:00Z',
    isRead: false,
  },
  {
    id: 'm2',
    orderId: '2',
    sender: 'Pascal Attama',
    senderAvatar: 'PA',
    isOwn: true,
    content: "Great question! Let's lead with the time-saving angle. Our research shows that's the #1 pain point for our target audience of engineering managers.",
    timestamp: '2026-04-30T14:45:00Z',
    isRead: true,
  },
  {
    id: 'm3',
    orderId: '2',
    sender: 'Jerome Bell',
    senderAvatar: 'JB',
    isOwn: false,
    content: "Perfect, that gives me a clear direction. I'll have a first draft to you by tomorrow EOD. I'm also thinking of suggesting a sub-headline that mentions the integration ecosystem — is that something you'd like to see?",
    timestamp: '2026-04-30T15:10:00Z',
    isRead: false,
  },
  {
    id: 'm4',
    orderId: '3',
    sender: 'Annette Black',
    senderAvatar: 'AB',
    isOwn: false,
    content: "I've completed the Twitter thread and LinkedIn post! Please review and let me know if you'd like any adjustments to the tone or specific tweet rewrites.",
    timestamp: '2026-04-29T11:30:00Z',
    isRead: true,
  },
  {
    id: 'm5',
    orderId: '1',
    sender: 'Alex Trie',
    senderAvatar: 'AT',
    isOwn: false,
    content: "Just received your brief! I have a couple of clarifying questions before I start. What's the target reading level, and do you have any competitor articles you'd like me to differentiate from?",
    timestamp: '2026-04-28T09:00:00Z',
    isRead: false,
  },
];

export const INVOICES: Invoice[] = [
  { id: 'inv-001', amount: 960, status: 'paid', date: '2026-04-01', description: 'April content package — 8 orders' },
  { id: 'inv-002', amount: 750, status: 'paid', date: '2026-03-01', description: 'March content package — 6 orders' },
  { id: 'inv-003', amount: 1100, status: 'paid', date: '2026-02-01', description: 'February content package — 9 orders' },
  { id: 'inv-004', amount: 125, status: 'pending', date: '2026-05-01', description: 'May partial billing — Blog Post #299283' },
];

export const MONTHLY_SPEND = [
  { month: 'Nov', amount: 620 },
  { month: 'Dec', amount: 480 },
  { month: 'Jan', amount: 890 },
  { month: 'Feb', amount: 1100 },
  { month: 'Mar', amount: 750 },
  { month: 'Apr', amount: 960 },
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'New',
  in_progress: 'In Progress',
  pending_review: 'Pending Review',
  revision: 'Revision',
  completed: 'Completed',
  archived: 'Archived',
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  new: 'text-violet-700 bg-violet-50 border border-violet-100',
  in_progress: 'text-amber-700 bg-amber-50 border border-amber-100',
  pending_review: 'text-emerald-700 bg-emerald-50 border border-emerald-100',
  revision: 'text-orange-700 bg-orange-50 border border-orange-100',
  completed: 'text-blue-700 bg-blue-50 border border-blue-100',
  archived: 'text-slate-500 bg-slate-100 border border-slate-200',
};

export function getOrderById(id: string): Order | undefined {
  return ORDERS.find((o) => o.id === id);
}

export function getOrderStats() {
  return {
    new: ORDERS.filter((o) => o.status === 'new').length,
    in_progress: ORDERS.filter((o) => o.status === 'in_progress').length,
    pending_review: ORDERS.filter((o) => o.status === 'pending_review').length,
    completed: ORDERS.filter((o) => o.status === 'completed').length,
    archived: ORDERS.filter((o) => o.status === 'archived').length,
    totalSpend: INVOICES.filter((i) => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0),
  };
}
