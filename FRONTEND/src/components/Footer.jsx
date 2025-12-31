const Footer = () => {
  return (
    <footer className="mt-auto py-6 px-4 border-t border-dark-border">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} DevTinder. Built for developers, by
          developers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
