"use client";
import Link from "next/link";
import { ReactNode } from "react";


interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

const AuthLayout = ({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-grid bg-radial-glow flex-col justify-between p-12">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-subtle-float" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-2xl animate-subtle-float" style={{ animationDelay: "2s" }} />
        
        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center glow-soft">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              CivicFlow
            </span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-md">
          <h1 className="text-4xl font-bold mb-6 animate-fade-in-up">
            <span className="text-gradient">Smart</span>{" "}
            <span className="text-foreground">CivicFlow</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Your voice matters. Report community issues, track resolutions, and help build a better neighborhood together.
          </p>
          
          {/* Features */}
          <div className="mt-12 space-y-4">
            {[
              { icon: "📍", text: "Location-based reporting" },
              { icon: "🔄", text: "Real-time status tracking" },
              { icon: "🤝", text: "Community collaboration" },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-muted-foreground animate-fade-in-up"
                style={{ animationDelay: `${200 + i * 100}ms` }}
              >
                <span className="text-xl">{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-muted-foreground">
          © 2024 CivicFlow. Making cities smarter.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <span className="text-xl font-semibold text-foreground">CivicFlow</span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="glass rounded-2xl p-8 glow-soft">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>

            {children}

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {footerText}{" "}
              <Link
                href={footerLinkTo}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {footerLinkText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;