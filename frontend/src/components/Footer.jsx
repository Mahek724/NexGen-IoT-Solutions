import React from 'react';
import '../assets/css/footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} NexGen IoT Solutions. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
