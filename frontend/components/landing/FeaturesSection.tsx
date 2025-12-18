import FeatureCard from './FeatureCard';
import { Camera, BarChart3, Bell, CheckCircle2 } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: 'Report with Evidence',
      description: 'Submit civic issues with photos, location data, and detailed descriptions. Every report is geotagged for accurate tracking.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Authority Dashboard',
      description: 'Municipal authorities get a powerful dashboard to prioritize, assign, and track issue resolution efficiently.',
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: 'Real-time Updates',
      description: 'Stay informed with instant notifications on status changes. Track progress from submission to resolution.',
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: 'Citizen Verification',
      description: 'Issues are only marked resolved after citizen confirmation. True accountability, no silent closures.',
    },
  ];

  return (
    <section id="features" className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 opacity-0 animate-fade-in-up">
            Built for transparency
          </h2>
          <p className="text-lg text-muted-foreground opacity-0 animate-fade-in-up delay-100">
            Every feature designed to ensure issues get resolved, not just reported.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={`${200 + index * 100}ms`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
