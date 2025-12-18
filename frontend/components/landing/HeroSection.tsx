import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-radial-glow" />
      
      {/* Subtle gradient orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px] animate-subtle-float" />

      <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-border/50 backdrop-blur-sm mb-8 opacity-0 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Trusted by cities worldwide</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight mb-6 opacity-0 animate-fade-in-up delay-100">
            <span className="text-foreground">Report civic issues.</span>
            <br />
            <span className="text-foreground">Track resolution.</span>
            <br />
            <span className="text-gradient">Ensure accountability.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-in-up delay-200">
            A modern platform connecting citizens and authorities through transparent workflows. 
            Every issue tracked, every resolution verified.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up delay-300">
            <Button variant="hero" size="xl">
              Report an Issue
              <ArrowRight className="ml-1" />
            </Button>
            <Button variant="hero-outline" size="xl">
              <Play className="mr-1 w-4 h-4" />
              View Demo
            </Button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 mt-16 pt-16 border-t border-border/30 opacity-0 animate-fade-in-up delay-400">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground">50K+</div>
              <div className="text-sm text-muted-foreground mt-1">Issues Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground">200+</div>
              <div className="text-sm text-muted-foreground mt-1">Cities Active</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground">98%</div>
              <div className="text-sm text-muted-foreground mt-1">Resolution Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
