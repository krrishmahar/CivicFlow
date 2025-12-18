import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 opacity-0 animate-fade-in-up">
            A better way to fix
            <br />
            <span className="text-gradient">civic problems</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto opacity-0 animate-fade-in-up delay-100">
            Join cities that have transformed how they handle citizen concerns. 
            Start building trust today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up delay-200">
            <Button variant="hero" size="xl">
              Get Started
              <ArrowRight className="ml-1" />
            </Button>
            <Button variant="hero-outline" size="xl">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
