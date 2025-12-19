import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: string;
}

const FeatureCard = ({ icon, title, description, delay = '0ms' }: FeatureCardProps) => {
  return (
    <div
      className="group relative p-6 lg:p-8 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm transition-all duration-500 hover:bg-card/60 hover:border-primary/30 hover:shadow-card-hover hover:-translate-y-1 opacity-0 animate-fade-in-up"
      style={{ animationDelay: delay }}
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 text-primary group-hover:bg-primary/20 transition-colors duration-300">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
