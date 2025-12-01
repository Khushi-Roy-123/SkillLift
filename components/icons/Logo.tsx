
import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    width="100%" 
    height="100%" 
    {...props}
  >
    {/* Rising Bars */}
    <path d="M4.5 13.5a.75.75 0 01.75.75v6.75a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-6.75a.75.75 0 01.75-.75h3zM10.5 9a.75.75 0 01.75.75v11.25a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75V9.75A.75.75 0 019.75 9h3zM16.5 5.25a.75.75 0 01.75.75v15a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75V6a.75.75 0 01.75-.75h3z" />
    
    {/* Star on the highest bar */}
    <path d="M18 1.5l.89 1.802 1.99.288-1.44 1.405.34 1.98L18 6l-1.78.975.34-1.98-1.44-1.405 1.99-.288L18 1.5z" />

    {/* Rising Arrow */}
    <path d="M2.22 19.78a.75.75 0 010-1.06l6.22-6.22 4.28 4.28 7.97-7.97a.75.75 0 111.06 1.06l-8.5 8.5-4.28-4.28-5.69 5.69a.75.75 0 01-1.06 0z" />
  </svg>
);

export default Logo;
