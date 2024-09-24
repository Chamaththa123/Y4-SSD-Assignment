// securityConfig.js
const helmet = require("helmet");

const securityConfig = () => {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],  // Allow resources only from the same origin
          scriptSrc: ["'self'", "https://trusted-cdn.com"],   // Allow scripts from your domain and trusted CDN
          styleSrc: ["'self'", "https://trusted-cdn.com"],   // Allow styles from your domain and trusted CDN
          imgSrc: ["'self'", "data:"],   // Allow images from your domain and inline images (like base64)
          objectSrc: ["'none'"],   // Disallow plugins like Flash
          upgradeInsecureRequests: [],   // Upgrade HTTP requests to HTTPS
          connectSrc: ["'self'"],   // Only allow connections to your own API server
          frameAncestors: ["'none'"],   // Prevent clickjacking attacks by disallowing the site to be embedded in iframes
          reportUri: "/report-csp-violations",   // Add a report URI for CSP violation
        },
      },

      // Include frameguard explicitly
      frameguard: {
        action: 'deny'
      }
    });
  };

module.exports = securityConfig;
