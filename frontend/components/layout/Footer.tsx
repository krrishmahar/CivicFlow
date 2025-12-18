const Footer = () => {
  const footerLinks = {
    Product: ['Features', 'Pricing', 'Integrations', 'Changelog'],
    Resources: ['Documentation', 'API Reference', 'Support', 'Status'],
    Company: ['About', 'Blog', 'Careers', 'Contact'],
    Legal: ['Privacy', 'Terms', 'Security', 'Compliance'],
  };

  return (
    <footer className="py-16 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-sm bg-primary" />
              </div>
              <span className="text-lg font-semibold text-foreground">CivicFlow</span>
            </a>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Connecting citizens and authorities through transparent civic issue resolution.
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} CivicFlow. All rights reserved.
            </p>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
