import { Shield, Eye, Scale } from 'lucide-react';

const TrustSection = () => {
  const trustItems = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Transparent Workflows',
      description: 'Every step visible to citizens. No hidden processes, no bureaucratic black boxes.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'No Silent Closures',
      description: 'Issues can only be closed with citizen confirmation. Accountability built into every resolution.',
    },
    {
      icon: <Scale className="w-8 h-8" />,
      title: 'Built for Accountability',
      description: 'Clear ownership, tracked timelines, and measured outcomes for every reported issue.',
    },
  ];

  const stats = [
    { value: '3.2x', label: 'Faster Resolution' },
    { value: '100%', label: 'Issue Tracking' },
    { value: '94%', label: 'Citizen Satisfaction' },
  ];

  return (
    <section id="about" className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Trust pillars */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 opacity-0 animate-fade-in-up">
              Trust through
              <br />
              <span className="text-gradient">transparency</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 opacity-0 animate-fade-in-up delay-100">
              CivicFlow is designed from the ground up to rebuild trust between citizens and authorities.
            </p>

            <div className="space-y-6">
              {trustItems.map((item, index) => (
                <div
                  key={item.title}
                  className="flex gap-5 p-5 rounded-xl bg-card/30 border border-border/30 hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Stats card */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-[60px]" />
            
            <div className="relative p-8 lg:p-12 rounded-3xl bg-card/60 border border-border/50 backdrop-blur-sm opacity-0 animate-fade-in-up delay-300">
              <h3 className="text-xl font-semibold text-foreground mb-8">Impact Metrics</h3>
              
              <div className="space-y-8">
                {stats.map((stat, index) => (
                  <div key={stat.label} className="flex items-center justify-between pb-8 border-b border-border/30 last:border-0 last:pb-0">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span className="text-4xl font-bold text-gradient">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
