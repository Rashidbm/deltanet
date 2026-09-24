import { assetUrl } from './lib/asset-url'
import { memo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowUp, ArrowUpRight, BookOpen, Check, ChevronRight, CircleDashed, Copy, FileText, GitPullRequest, Inbox, LockKeyhole, Maximize2, MessageSquare, Minimize2, MoreHorizontal, PanelRight, Pause, Play, Plus, LoaderCircle, ArrowRight, RotateCcw, Search, SignalHigh, SquarePen, X } from 'lucide-react'
import { Sidebar, SidebarProvider, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset, useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation'
import { Message, MessageContent } from '@/components/ai-elements/message-layout'
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputTools, PromptInputButton, PromptInputSubmit } from '@/components/ai-elements/prompt-input'
import { AnimatePresence, motion } from 'motion/react'
import { frameAt, scenes, DURATION, type Frame } from './walkthrough'
import { useWalkthrough } from './use-walkthrough'
import { HeroBackdrop } from './HeroBackdrop'
import { HeroHeader } from './HeroHeader'
import { HeroAtmosphere } from './HeroAtmosphere'
import { FeatureShowcase } from './FeatureShowcase'
import { ProductSections } from './ProductSections'
import './App.css'

// All app icons are converted from existing Nucleus SVGs. See SOURCES.md.
const connections = [
  { id: 'google-drive', name: 'Google Drive', detail: 'Runbooks, briefs and shared documents', source: 'Checkout incident runbook', owner: 'Your agent' },
  { id: 'slack', name: 'Slack', detail: 'Team conversations and incident threads', source: '#checkout-incidents · Release investigation', owner: 'Your agent' },
  { id: 'github', name: 'GitHub', detail: 'Repositories, pull requests and reviews', source: 'Release diff · checkout-service', owner: 'Omar’s agent' },
  { id: 'linear', name: 'Linear', detail: 'Issues, projects and agent activity', source: 'ENG-241 · Checkout fails after release', owner: 'Omar’s agent' },
  { id: 'gmail', name: 'Gmail', detail: 'Email conversations and drafts', source: 'Customer incident update · Unsent draft', owner: 'Noura’s agent' },
  { id: 'hubspot', name: 'HubSpot', detail: 'Customer accounts and contact history', source: '23 affected customer accounts', owner: 'Noura’s agent' },
  { id: 'notion', name: 'Notion', detail: 'Company knowledge and project notes', source: '', owner: '' },
]
type DialogKind = 'connections' | 'context' | 'runbook' | 'pull-request' | 'email' | 'references' | 'shared-context' | 'skill' | null
function AppIcon({ name }: { name: string }) { return <img className={`app-icon ${name}`} src={assetUrl(`/apps/${name}.svg`)} alt={connections.find(app => app.id === name)?.name || name} /> }
function Person({ name, tone = '' }: { name: string; tone?: string }) { return <Avatar className={`person ${tone}`}><AvatarFallback>{name[0]}</AvatarFallback></Avatar> }
function IconButton({ label, children, onClick }: { label: string; children: ReactNode; onClick: () => void }) {
  return <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label={label} onClick={onClick}>{children}</Button></TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>
}
function SidebarRestore() {
  const { open, isMobile } = useSidebar()
  return !open || isMobile ? <SidebarTrigger aria-label="Open sidebar" /> : null
}
function ChatTurn({ from, children, animate }: { from: 'user' | 'assistant'; children: ReactNode; animate: boolean }) {
  return <Message from={from} className={animate ? 'chat-turn entering' : 'chat-turn'}><MessageContent className={from === 'user' ? 'user-message' : 'assistant-message'}><div className="message-prose">{children}</div></MessageContent></Message>
}

function LinearIssue({ onClose, onOpen, expanded, onExpand, frame }: { onClose: () => void; onOpen: (kind: DialogKind) => void; expanded: boolean; onExpand: () => void; frame: Frame }) {
  const [copied, setCopied] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<string[]>([])
  const [menu, setMenu] = useState(false)
  return <aside className={`work-panel ${expanded ? 'expanded' : ''}`} aria-label="Linear issue preview">
    <div className="source-bar"><span><AppIcon name="linear" /><strong>Linear</strong><span className="source-divider" /> Issue preview</span><div><IconButton label={expanded ? 'Reduce issue preview' : 'Expand issue preview'} onClick={onExpand}>{expanded ? <Minimize2 /> : <Maximize2 />}</IconButton><IconButton label="Close issue preview" onClick={onClose}><X /></IconButton></div></div>
    <header className="issue-toolbar"><div><span>Engineering</span><ChevronRight size={12} /><span>ENG-241</span></div><div><IconButton label={copied ? 'Issue ID copied' : 'Copy issue ID'} onClick={async () => { try { await navigator.clipboard.writeText('ENG-241'); setCopied(true) } catch { setCopied(false) } }}>{copied ? <Check /> : <Copy />}</IconButton><IconButton label="Issue details" onClick={() => setMenu(!menu)}><MoreHorizontal /></IconButton></div></header>
    {menu && <div className="issue-detail-note">Local example based on Linear’s issue view. <button onClick={() => onOpen('references')}>View the reference <ArrowUpRight size={11} /></button></div>}
    <button className="issue-fix-summary" onClick={() => onOpen('pull-request')}><AppIcon name="github" /><span><strong>Fix checkout total rounding</strong><small>{frame.recovered ? 'PR #482 · Production checkout passed' : frame.approved ? 'PR #482 · Approved · Verifying checkout' : 'PR #482 · Ready for Omar’s review'}</small></span>{frame.recovered ? <Check size={15} /> : <ChevronRight size={14} />}</button>
    <div className="issue-layout">
      <div className="issue-document">
        <h1>Checkout fails after release</h1>
        <p>Some payments fail after the 09:58 release. The tax calculation produces a total the payment provider rejects.</p>
        <h2>To resolve</h2>
        <ul className="issue-checklist"><li>{frame.patchReady ? <Check /> : <span className="empty-checkbox" />} Reproduce the failure</li><li>{frame.patchReady ? <Check /> : <span className="empty-checkbox" />} Add a regression test</li><li>{frame.approved ? <Check /> : <span className="empty-checkbox" />} Review and deploy the fix</li><li>{frame.recovered ? <Check /> : <span className="empty-checkbox" />} Verify checkout in production</li></ul>
        <button className="issue-document-link" onClick={() => onOpen('runbook')}><AppIcon name="google-drive" /> Checkout incident runbook <ArrowUpRight size={11} /></button>
        <div className="issue-activity"><h2>Activity</h2><div className="activity-event"><Person name="Omar" tone="omar" /><p><strong>Omar</strong> delegated to <strong>Omar’s agent</strong><time>10:04 AM</time></p></div>
          {frame.patchReady && <div className="activity-comment"><div className="comment-author"><Person name="Omar" tone="omar" /><strong>Omar’s agent</strong><span className="app-label">Agent</span><time>10:12</time></div><p>Fix ready in <button className="text-link" onClick={() => onOpen('pull-request')}>#482</button>. Regression test added. Waiting for Omar’s review before deployment.</p></div>}
          {frame.recovered && <div className="activity-comment updated"><div className="comment-author"><Person name="Omar" tone="omar" /><strong>Omar’s agent</strong><span className="app-label">Agent</span><time>10:14</time></div><p>Production checkout passed. Verification shared with Noura’s agent for the customer update.</p></div>}
          {comments.map((body, index) => <div className="activity-comment" key={index}><div className="comment-author"><Person name="Rashid" /><strong>Rashid</strong><span className="app-label">Local demo</span></div><p>{body}</p></div>)}
          <form className="issue-comment-composer" onSubmit={event => { event.preventDefault(); if (comment.trim()) { setComments(previous => [...previous, comment.trim()]); setComment('') } }}><textarea aria-label="Local issue comment" placeholder="Leave a comment…" value={comment} onChange={event => setComment(event.target.value)} rows={2} /><div><span>Local demo</span><Button type="submit" variant="secondary" size="sm" disabled={!comment.trim()}>Comment</Button></div></form>
        </div>
      </div>
      <div className="issue-properties">
        <section><h2>Diffs</h2>{frame.patchReady ? <button className="diff-link" onClick={() => onOpen('pull-request')}><GitPullRequest size={14} /><span>Fix checkout total rounding</span></button> : <span className="muted">No linked pull requests</span>}</section>
        <section><h2>Properties</h2><div className="property"><CircleDashed className="status-ring" /><span>{frame.resolved ? 'Done' : 'In Progress'}</span></div><div className="property"><SignalHigh /><span>Urgent</span></div><div className="property"><Person name="Omar" tone="omar" /><span>Omar Alharbi</span></div><div className="property delegate"><span className="delegate-branch" /><span className="delegate-initial">O</span><span>Omar’s agent</span></div></section>
        <section><h2>Labels</h2><span className="issue-label"><span /> Bug</span></section>
        <section><h2>Project</h2><div className="property"><Inbox /><span>Checkout</span></div></section>
      </div>
    </div>
    <footer className="work-footer"><span>Sample issue · not connected to Linear</span><button onClick={() => onOpen('references')}>Reference <ArrowUpRight size={10} /></button></footer>
  </aside>
}

function DetailDialog({ kind, onClose, frame }: { kind: DialogKind; onClose: () => void; frame: Frame }) {
  const [search, setSearch] = useState('')
  const titles: Record<Exclude<DialogKind, null>, string> = { connections: 'Connections', context: 'Sources for this conversation', runbook: 'Checkout incident runbook', 'pull-request': 'Fix checkout total rounding', email: 'Customer incident update', references: 'Built from these references', 'shared-context': 'Shared task context', skill: 'Incident response · Shared skill' }
  return <Dialog open={kind !== null} onOpenChange={open => { if (!open) { onClose(); setSearch('') } }}><DialogContent className={`detail-dialog ${kind === 'connections' ? 'connections-dialog' : ''}`}><DialogHeader><DialogTitle>{kind ? titles[kind] : ''}</DialogTitle><DialogDescription>{kind === 'references' ? 'Observed product patterns and directly reused components.' : kind === 'connections' ? 'Your team’s apps, available to their agents. Sample connections shown.' : 'Fictional demo content. No live account or external action.'}</DialogDescription></DialogHeader>
    {kind === 'connections' && <><div className="connection-search"><Search size={15} /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search apps…" aria-label="Search apps" /></div><div className="connection-list">{connections.filter(app => app.name.toLowerCase().includes(search.toLowerCase())).map(app => <div className="connection-row" key={app.id}><span className="connection-icon"><AppIcon name={app.id} /></span><div><strong>{app.name}</strong><p>{app.detail}</p></div><Badge variant="secondary"><Check size={10} /> Connected</Badge></div>)}{!connections.some(app => app.name.toLowerCase().includes(search.toLowerCase())) && <p className="no-results">No apps match “{search}”.</p>}</div></>}
    {kind === 'context' && <div className="context-list">{connections.filter(app => app.source && frame.scene.apps.includes(app.id)).map(app => <div className="context-row" key={app.id}><AppIcon name={app.id} /><div><strong>{app.id === 'gmail' && frame.sent ? 'Customer incident update · Sent' : app.source}</strong><p>{app.name} <span>·</span> {app.owner}</p></div><FileText size={13} /></div>)}</div>}
    {kind === 'runbook' && <article className="document-preview"><div className="document-meta"><AppIcon name="google-drive" /> Google Drive <span>·</span> Source document</div><h2>Checkout incident response</h2><p className="document-owner">Engineering · Last reviewed Sep 18</p><ol><li>Confirm the failure window and identify the release.</li><li>Have the release owner review the rollback or patch.</li><li>After deployment, complete a production checkout and confirm the result in the incident issue.</li><li>Customer Success reviews and sends the customer update after Engineering confirms recovery.</li></ol><div className="document-footnote"><BookOpen size={14} /><span>A runbook supplies the procedure. It does not confirm live service recovery.</span></div></article>}
    {kind === 'pull-request' && <article className="document-preview"><div className="document-meta"><AppIcon name="github" /> GitHub <span>·</span> Pull request #482</div><div className="pr-status"><Badge variant="outline"><GitPullRequest size={12} /> {frame.approved ? 'Merged' : 'Open'}</Badge><span>{frame.approved ? 'Approved by Omar Alharbi' : 'Review requested from Omar Alharbi'}</span></div><h2>Summary</h2><p>Normalize the checkout total before submitting the payment request. Add regression coverage for carts with fractional-cent tax totals.</p><div className="pr-detail-row"><span>Linked issue</span><strong>ENG-241</strong></div><div className="pr-detail-row"><span>Review</span><strong>{frame.approved ? 'Approved' : 'Requested'}</strong></div><div className="pr-detail-row"><span>Merge</span><strong>{frame.approved ? 'Merged' : 'Not merged'}</strong></div><p className="document-footnote">{frame.recovered ? 'Production checkout passed after deployment.' : 'The fix is ready for review. Recovery will be verified after deployment.'}</p></article>}
    {kind === 'email' && <EmailDocument frame={frame} />}
    {kind === 'shared-context' && <div className="shared-context-list"><p className="sharing-explainer">The task information exchanged with other agents. Each person’s conversation stays private.</p>{frame.sharedContext.map(transfer => <section className="shared-context-record" key={transfer.id}><header><Person name={transfer.sender} tone={transfer.sender.toLowerCase()} /><strong>{transfer.sender}’s agent</strong><ArrowRight size={13} /><Person name={transfer.recipient} tone={transfer.tone} /><strong>{transfer.recipient}’s agent</strong></header><p>{transfer.brief}</p><div className="shared-context-included"><span>Included context</span>{transfer.context}</div><footer><span>{transfer.apps.map(app => <AppIcon key={app} name={app} />)}</span><span>{transfer.received ? <Check size={12} /> : <LoaderCircle size={12} />}{transfer.received ? 'Received' : 'Sending context'}</span></footer></section>)}</div>}
    {kind === 'skill' && <article className="document-preview"><p>The same reusable procedure is available to each agent. The incident brief supplies the facts; this skill supplies the steps.</p><ol><li>Investigate the failure using the release details and runbook.</li><li>Ask the release owner to approve the fix, then verify production checkout and record the result.</li><li>Use the verified result to prepare a customer update. Ask Customer Success to review before sending.</li></ol><a className="skill-source" href={frame.skill.href} target="_blank" rel="noreferrer">View example SKILL.md <ArrowUpRight size={13} /></a><p className="document-footnote">Presentation fixture · workflow execution is simulated.</p></article>}
    {kind === 'references' && <div className="reference-list">{[
      ['Linear Asks · conversation', 'A meaningful clarification, a short answer, then a linked result.', 'https://linear.app/changelog/2026-05-21-project-slack-channels'],
      ['Dock', 'Short follow-ups, named agents, expandable handoffs and linked work.', 'https://trydock.ai/'],
      ['Linear · assignment & delegation', 'One human assignee, indented agent, Diffs and Properties.', 'https://linear.app/docs/assigning-issues'],
      ['Linear · comments & activity', 'Timeline, author/time labels and comment composer.', 'https://linear.app/docs/comment-on-issues'],
      ['Vercel AI Elements', 'Actual conversation, message and auto-resizing composer components.', 'https://elements.ai-sdk.dev/examples/chatbot'],
      ['shadcn/ui', 'Actual sidebar, dialog, tooltip, avatar and disclosure components.', 'https://ui.shadcn.com/docs/components/sidebar'],
    ].map(([name, description, href]) => <a href={href} key={href} target="_blank" rel="noreferrer"><strong>{name}<ArrowUpRight size={13} /></strong><p>{description}</p></a>)}</div>}
  </DialogContent></Dialog>
}

function EmailDocument({ frame }: { frame: Frame }) {
  return <article className="document-preview"><div className="document-meta"><AppIcon name="gmail" /> Gmail <span>·</span> {frame.sent ? 'Sent message' : 'Draft preview'}</div><div className="draft-fields"><div><span>To</span>{frame.recovered ? 'Contacts at 23 affected accounts' : 'Pending review'}</div><div><span>Subject</span>Checkout is back</div></div><p>Hi there,</p>{frame.revised ? <p>Checkout is working again. If your order didn’t go through this morning, please try again.</p> : <p>We’ve fixed a tax calculation issue that prevented some orders from completing this morning. Checkout is working again, and you can retry your order.</p>}<p>Sorry for the interruption. If you still need a hand, just reply to this email.</p><p>Noura<br />Customer Success</p><div className="draft-hold">{frame.sent ? <Check size={13} /> : <Pause size={13} />}{frame.sent ? 'Sent after Noura’s approval' : frame.recovered ? 'Ready for Noura’s review' : 'Waiting for Engineering to verify recovery'}</div></article>
}

function AgentActivity({ frame, reduced, onOpen }: { frame: Frame; reduced: boolean; onOpen: () => void }) {
  const { activity } = frame
  const icon = activity.kind === 'sharing' ? <ArrowRight size={17} /> : activity.kind === 'working' ? <LoaderCircle size={17} /> : activity.kind === 'review' ? <SquarePen size={17} /> : activity.kind === 'ready' ? <MessageSquare size={17} /> : <Check size={17} />
  return <section className="agent-activity" aria-label="Agent activity">
    <header><span>Agent activity</span><button onClick={onOpen} disabled={!frame.sharedContext.length}>Shared context{frame.sharedContext.length > 0 && <span>{frame.sharedContext.length}</span>}<ChevronRight size={12} /></button></header>
    <div className="activity-stage" role="status" aria-live="polite" aria-atomic="true"><AnimatePresence initial={false}>
      <motion.div className={`activity-state ${activity.kind}`} key={activity.at}
        initial={{ opacity: 0, y: reduced ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -5 }}
        transition={{ duration: reduced ? 0 : .2, ease: [.16,1,.3,1] }}>
        <span className="activity-symbol">{icon}</span><div className="activity-copy"><strong>{activity.title}</strong><p>{activity.detail}</p></div><span className="activity-apps">{activity.apps.map(app => <AppIcon key={app} name={app} />)}</span>
      </motion.div>
    </AnimatePresence></div>
  </section>
}

function SharedSkill({ frame, onOpen }: { frame: Frame; onOpen: () => void }) {
  return <button className="shared-skill" onClick={onOpen} aria-label="View Incident response shared skill" data-skill={frame.skill.id}>
    <BookOpen size={15} /><span><strong>{frame.skill.name}</strong><small>Shared skill · {frame.scene.worker === 'rashid' ? 'Team workflow' : frame.skill.steps[frame.skillStep]}</small></span><ChevronRight size={13} />
  </button>
}

function ContextPreview({ frame, onOpen, onClose }: { frame: Frame; onOpen: (kind: DialogKind) => void; onClose: () => void }) {
  return <aside className="work-panel context-panel" aria-label="Shared task context preview">
    <div className="source-bar"><span><FileText size={14} /><strong>{frame.contextVisible ? 'Shared task context' : 'Connected context'}</strong></span><IconButton label="Close context preview" onClick={onClose}><X /></IconButton></div>
    <div className="context-document">
      <div className="context-heading"><span>ENG-241</span><h2>Checkout incident</h2><p>{frame.resolved ? 'Verified recovery. Customers informed.' : 'One brief. Two agents. Shared workflow.'}</p></div>
      <div className="context-sources"><button onClick={() => onOpen('context')}><AppIcon name="slack" /><span>Release investigation<small>#checkout-incidents</small></span><ChevronRight size={13} /></button><button onClick={() => onOpen('runbook')}><AppIcon name="google-drive" /><span>Incident runbook<small>Engineering · Google Drive</small></span><ChevronRight size={13} /></button></div>
      <AnimatePresence>{frame.contextVisible && <motion.div className="context-payload" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>
        <h3>{frame.resolved ? 'The outcome' : 'Shared with their agents'}</h3>
        <div className="context-person"><Person name="Omar" tone="omar" /><div><strong>Omar · Engineering</strong><p>{frame.resolved ? 'Fix deployed. Checkout verified.' : 'Review the fix and verify checkout.'}</p><small>{frame.transferring ? 'Receiving context…' : 'Context received'}</small></div></div>
        <div className="context-person"><Person name="Noura" tone="noura" /><div><strong>Noura · Customer Success</strong><p>{frame.resolved ? 'Update sent to 23 affected accounts.' : 'Prepare the update. Wait for verification.'}</p><small>{frame.transferring ? 'Receiving context…' : 'Context received'}</small></div></div>
        <SharedSkill frame={frame} onOpen={() => onOpen('skill')} />
        <p className="context-scope"><LockKeyhole size={12} />Task context travels. Private chats stay private.</p>
      </motion.div>}</AnimatePresence>
    </div><footer className="work-footer">Illustrative workflow · sample data</footer>
  </aside>
}

function WorkspaceScene({ frame, pause, reduced }: { frame: Frame; pause: () => void; reduced: boolean }) {
  const [panel, setPanel] = useState(window.innerWidth > 1000)
  const [linkedIssue, setLinkedIssue] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [dialog, setDialog] = useState<DialogKind>(null)
  const [typed, setTyped] = useState<string | null>(null)
  const [messages, setMessages] = useState<string[]>([])
  const [fresh, setFresh] = useState(false)
  const { scene } = frame
  const [previousScene, setPreviousScene] = useState(scene.id)
  // Reset local inspection state before rendering a different private workspace.
  if (previousScene !== scene.id) {
    setPreviousScene(scene.id)
    setPanel(window.innerWidth > 1000)
    setExpanded(false); setLinkedIssue(false); setDialog(null); setTyped(null); setMessages([]); setFresh(false)
  }
  const text = typed ?? frame.draft
  const open = (kind: DialogKind) => { pause(); setDialog(kind) }
  const showIssue = () => { pause(); setPanel(true); setLinkedIssue(true); setExpanded(false) }
  return <SidebarProvider style={{ '--sidebar-width': '174px' } as CSSProperties}>
      <Sidebar collapsible="offcanvas">
        <SidebarHeader className="workspace-brand"><span>DeltaNet</span><SidebarTrigger aria-label="Close sidebar" /></SidebarHeader>
        <SidebarContent>
          <SidebarGroup><SidebarMenu><SidebarMenuItem><SidebarMenuButton onClick={() => { pause(); setFresh(true); setTyped(''); setPanel(false) }}><SquarePen /><span>New chat</span></SidebarMenuButton></SidebarMenuItem><SidebarMenuItem><SidebarMenuButton onClick={() => open('context')}><Search /><span>Search context</span></SidebarMenuButton></SidebarMenuItem><SidebarMenuItem><SidebarMenuButton onClick={() => open('connections')}><Plus /><span>Connections</span><span className="nav-count">7</span></SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarGroup>
          <SidebarGroup className="chats-group"><SidebarGroupLabel>Your chats <LockKeyhole size={10} /></SidebarGroupLabel><SidebarMenu><SidebarMenuItem><SidebarMenuButton isActive={!fresh} onClick={() => { setFresh(false); setTyped(null) }}><MessageSquare /><span>{scene.title}</span></SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarGroup>
          <SidebarGroup className="work-group"><SidebarGroupLabel>Linked work</SidebarGroupLabel><SidebarMenu><SidebarMenuItem><SidebarMenuButton onClick={showIssue}><AppIcon name={scene.worker === 'noura' ? 'gmail' : 'linear'} /><span>{scene.worker === 'noura' ? 'Customer update' : 'ENG-241'}</span></SidebarMenuButton></SidebarMenuItem><SidebarMenuItem><SidebarMenuButton onClick={() => open('runbook')}><AppIcon name="google-drive" /><span>Incident runbook</span></SidebarMenuButton></SidebarMenuItem>{frame.patchReady && scene.worker !== 'noura' && <SidebarMenuItem><SidebarMenuButton onClick={() => open('pull-request')}><AppIcon name="github" /><span>Pull request #482</span></SidebarMenuButton></SidebarMenuItem>}</SidebarMenu></SidebarGroup>
        </SidebarContent>
        <SidebarFooter><button className="connection-dock" onClick={() => open('connections')} aria-label="View all 7 connections"><span>{connections.map(app => <AppIcon key={app.id} name={app.id} />)}</span><small>7 connections <ChevronRight size={11} /></small></button><div className="account"><Person name={scene.name} tone={scene.worker} /><span>{scene.fullName}<small>Personal workspace</small></span></div></SidebarFooter>
      </Sidebar>
      <div className="workspace-deck"><AnimatePresence initial={false}>
      <motion.div className="workspace-scene" key={scene.id}
        initial={{ flexGrow: .0001 }} animate={{ flexGrow: 1 }}
        exit={{ flexGrow: .0001, pointerEvents: 'none' }}
        transition={{ duration: reduced ? 0 : .85, ease: [.16,1,.3,1] }}>
        <motion.div className="workspace-surface" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : .5, delay: reduced ? 0 : .15, ease: [.16,1,.3,1] }}>
      <SidebarInset className="workspace-main">
        <header className="topbar"><div className="topbar-title"><SidebarRestore /><span>{fresh ? 'New chat' : scene.title}</span></div><div className="topbar-actions"><span className="private-label"><LockKeyhole size={12} /> Only you</span><IconButton label={panel ? 'Hide work preview' : 'Show work preview'} onClick={() => { pause(); setPanel(!panel); setExpanded(false) }}><PanelRight size={16} /></IconButton></div></header>
        <div className={`workspace-columns ${panel ? 'with-panel' : ''}`}>
          <section className="chat-column" aria-label={`${scene.name}’s private conversation`}>
            {frame.contextVisible && !fresh && <div className={`conversation-context ${scene.worker === 'rashid' ? 'is-rashid' : ''}`}><SharedSkill frame={frame} onOpen={() => open('skill')} /><button className="mobile-context" onClick={() => open('shared-context')}><FileText size={13} />{scene.worker === 'rashid' ? 'Context shared with Omar and Noura' : scene.worker === 'omar' ? 'Release thread + incident runbook received' : 'Verified checkout + incident brief received'}<ChevronRight size={12} /></button></div>}
            <Conversation initial={false} resize={reduced ? 'instant' : 'smooth'}><ConversationContent className="chat-content">
              {fresh ? <div className="empty-chat"><h1>What are we working on?</h1></div> : <>
                {frame.messages.map(turn => <div className="response-group" key={turn.id}><ChatTurn from={turn.from} animate={!reduced && turn.from === 'user'}>{turn.from === 'assistant' ? turn.visibleText.split(' ').map((word, index) => <span className={reduced ? '' : 'stream-word'} key={`${turn.id}-${index}`}>{word}{' '}</span>) : turn.visibleText}</ChatTurn>
                  {turn.complete && ['r2','o1','n1'].includes(turn.id) && <div className="source-chips">{scene.apps.map(id => <button key={id} onClick={() => open(id === 'google-drive' ? 'runbook' : id === 'github' ? 'pull-request' : 'context')}><AppIcon name={id} />{connections.find(app => app.id === id)?.name}</button>)}</div>}
                  {turn.complete && turn.id === 'f1' && <div className="result-links"><button onClick={showIssue}><AppIcon name="linear" />ENG-241<Check size={12} /></button><button onClick={() => open('email')}><AppIcon name="gmail" />Customer update<span className="draft-label">Sent</span></button></div>}
                </div>)}

              </>}
              {messages.map((message, i) => <div className="demo-exchange" key={i}><ChatTurn from="user" animate={false}>{message}</ChatTurn><ChatTurn from="assistant" animate={false}>This is a local preview. Live responses will be available when the agent is connected.</ChatTurn></div>)}
            </ConversationContent><ConversationScrollButton aria-label="Scroll to latest message" /></Conversation>
            <div className="composer-wrap">{!fresh && <AgentActivity frame={frame} reduced={reduced} onOpen={() => open('shared-context')} />}<PromptInput className="composer" onSubmit={message => { if (message.text.trim()) { pause(); setMessages(previous => [...previous, message.text]); setTyped('') } }}><PromptInputTextarea aria-label="Message DeltaNet" placeholder="Ask anything" value={text} onFocus={pause} onChange={event => { pause(); setTyped(event.target.value) }} /><PromptInputFooter><PromptInputTools><PromptInputButton aria-label="Add context" onClick={() => open('context')}><Plus size={19} /></PromptInputButton><span className="composer-mode">Your agent</span></PromptInputTools><PromptInputSubmit disabled={!text.trim()} aria-label="Send message"><ArrowUp size={16} /></PromptInputSubmit></PromptInputFooter></PromptInput><p className="composer-note"><LockKeyhole size={9} /> Private conversation · Shared context stays scoped to the task</p></div>
          </section>
          {panel && (scene.worker === 'rashid' && !linkedIssue ? <ContextPreview frame={frame} onOpen={open} onClose={() => setPanel(false)} /> : scene.worker === 'noura' ? <aside className="work-panel email-panel" aria-label="Customer email preview"><div className="source-bar"><span><AppIcon name="gmail" /><strong>Customer update</strong></span><IconButton label="Close email preview" onClick={() => setPanel(false)}><X /></IconButton></div><div className="email-document"><EmailDocument frame={frame} /></div><footer className="work-footer">Sample message · not connected to Gmail</footer></aside> : <LinearIssue onClose={() => { setPanel(false); setExpanded(false) }} onOpen={open} expanded={expanded} onExpand={() => { pause(); setExpanded(!expanded) }} frame={frame} />)}
        </div>
      </SidebarInset>
      </motion.div></motion.div></AnimatePresence></div>
      <DetailDialog kind={dialog} onClose={() => setDialog(null)} frame={frame} />
    </SidebarProvider>
}

const StableWorkspace = memo(WorkspaceScene, (previous, next) =>
  previous.frame.visualKey === next.frame.visualKey && previous.reduced === next.reduced)

export default function App() {
  const player = useWalkthrough()
  const frame = frameAt(player.time)
  const review = new URLSearchParams(window.location.search).has('review')
  const hero = new URLSearchParams(window.location.search).get('hero') !== '0'
  const plain = new URLSearchParams(window.location.search).get('background') === 'off'
  const demoRef = useRef<HTMLDivElement>(null)
  const [revision, setRevision] = useState(0)
  const replay = () => { setRevision(value => value + 1); player.replay() }
  const watchDemo = () => { replay(); demoRef.current?.scrollIntoView({ behavior: player.reduced ? 'instant' : 'smooth', block: 'start' }) }
  return <TooltipProvider delayDuration={300}><><div className={`presentation-root ${hero ? 'hero-composition' : ''} ${plain ? 'plain-background' : ''}`}>
    {hero && !plain && <HeroBackdrop reduced={player.reduced} />}
    {hero && <HeroHeader onDemo={watchDemo} />}
    <div className={`preview-page dark hero-preview ${review ? 'review-mode' : ''}`}>
    {hero && <header className="hero-intro"><HeroAtmosphere reduced={player.reduced} /><p>Work privately with your AI. Let it coordinate with your team’s agents.<br className="desktop-break" /> Shared context. Shared skills. No copy-pasting between chats.</p></header>}
    <div className="preview-caption"><span>DeltaNet <span className="caption-divider">/</span> Product walkthrough</span><span className="prototype-label">Fictional scenario · prototype</span></div>
    <div id="product-preview" ref={demoRef} className="perspective-bar"><div className="perspective-identity"><Person name={frame.scene.name} tone={frame.scene.worker} /><span><strong>{frame.scene.name}’s view</strong><small>{frame.scene.role}</small></span></div><div className="perspective-chapters" aria-label="Walkthrough chapters">{scenes.map((scene,index) => <button key={scene.id} aria-current={scene.id === frame.scene.id ? 'step' : undefined} onClick={() => player.seek(scene.start)}><span>0{index + 1}</span>{['The request','The fix','The update','Back to Rashid'][index]}</button>)}</div><div className="playback-buttons"><IconButton label={player.playing ? 'Pause walkthrough' : 'Play walkthrough'} onClick={player.toggle}>{player.playing ? <Pause size={14} /> : <Play size={14} />}</IconButton><IconButton label="Replay walkthrough" onClick={replay}><RotateCcw size={14} /></IconButton></div></div>
    <div className="workspace-frame motion-frame"><StableWorkspace key={revision} frame={frame} pause={player.pause} reduced={player.reduced} /></div>
    <div className="timeline-controls"><input aria-label="Walkthrough position" type="range" min="0" max={DURATION} step=".1" value={player.time} onChange={event => player.seek(Number(event.target.value))} /><span>{Math.floor(player.time / 60)}:{String(Math.floor(player.time % 60)).padStart(2,'0')} / 0:{DURATION}</span></div>
  </div></div>{hero && <><FeatureShowcase /><ProductSections /></>}</></TooltipProvider>
}
