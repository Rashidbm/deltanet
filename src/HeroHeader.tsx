import { Button } from '@/components/ui/button'

export function HeroHeader({ onDemo }: { onDemo: () => void }) {
  return <nav className="landing-nav" aria-label="Main navigation">
    <a className="landing-brand" href="?hero=1" aria-label="DeltaNet home"><img src="/logo-options/split-delta.svg" width="29" height="24" alt="" /><span>DeltaNet</span></a>
    <div className="landing-nav-links"><a href="#product-preview">Product</a><a href="#features">Features</a><a href="#connections">Connections</a><a href="#learning">Shared learning</a><a href="#architecture">Architecture</a></div>
    <Button className="landing-nav-cta" onClick={onDemo}>Watch demo</Button>
  </nav>
}
