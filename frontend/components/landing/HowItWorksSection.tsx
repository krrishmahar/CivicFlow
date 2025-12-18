import { FileText, Search, Wrench, ThumbsUp } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      icon: <FileText className="w-6 h-6" />,
      title: 'Report',
      description: 'Citizens submit issues with photos and location',
    },
    {
      number: '02',
      icon: <Search className="w-6 h-6" />,
      title: 'Review',
      description: 'Authorities assess and assign to relevant teams',
    },
    {
      number: '03',
      icon: <Wrench className="w-6 h-6" />,
      title: 'Resolve',
      description: 'Teams fix the issue and update status',
    },
    {
      number: '04',
      icon: <ThumbsUp className="w-6 h-6" />,
      title: 'Verify',
      description: 'Citizens confirm resolution and close the loop',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 lg:py-32 relative bg-card/30">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 opacity-0 animate-fade-in-up">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground opacity-0 animate-fade-in-up delay-100">
            A simple four-step process that ensures every issue reaches resolution.
          </p>
        </div>

        {/* Steps - Horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Desktop connector line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                {/* Step number & icon container */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-2xl bg-card border border-border/50 flex flex-col items-center justify-center transition-all duration-300 hover:border-primary/40 hover:shadow-glow-sm group">
                    <span className="text-xs font-semibold text-primary mb-2">{step.number}</span>
                    <div className="text-muted-foreground group-hover:text-primary transition-colors">
                      {step.icon}
                    </div>
                  </div>
                  
                  {/* Connector dot */}
                  <div className="hidden lg:block absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-border" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground max-w-[200px]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
