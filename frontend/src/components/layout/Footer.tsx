const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center">
      <div className="container flex h-16 items-center justify-between px-4 w-full">
        <p className="text-sm text-muted-foreground">
          © {currentYear} EasyGenerator. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Terms
          </a>
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
