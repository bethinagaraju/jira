import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';


const customStyles = `
  .react-joyride__tooltip {
    background-color: #2d3748;
    border-radius: 10px;
    padding: 1.2rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #ffffff;
    max-width: 280px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border: 2px solid #60a5fa; /* Blue border */
  }
  .react-joyride__tooltip h3 {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.6rem;
    color: #60a5fa;
  }
  .react-joyride__tooltip .react-joyride__content {
    font-size: 0.95rem;
    line-height: 1.4;
  }
  .react-joyride__tooltip button {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .react-joyride__tooltip button[aria-label="Next"],
  .react-joyride__tooltip button[aria-label="Close"] {
    background-color: #60a5fa;
    border: none;
    color: #1a202c;
    padding: 0.5rem 1.2rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;
  }
  .react-joyride__tooltip button[aria-label="Next"]:hover,
  .react-joyride__tooltip button[aria-label="Close"]:hover {
    background-color: #4a90e2;
  }
  .react-joyride__tooltip button[aria-label="Back"],
  .react-joyride__tooltip button[aria-label="Skip"] {
    background-color: transparent;
    border: none;
    color: #a0aec0;
    padding: 0.5rem 1.2rem;
    font-weight: 500;
    font-size: 0.9rem;
    transition: color 0.2s ease;
  }
  .react-joyride__tooltip button[aria-label="Back"]:hover,
  .react-joyride__tooltip button[aria-label="Skip"]:hover {
    color: #e2e8f0;
  }
`;


if (!document.getElementById('product-tour-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'product-tour-styles';
  styleSheet.type = 'text/css';
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}

const ProductTour = ({ steps, sessionKey = 'productTour' }) => {
  const [runTour, setRunTour] = useState(false);


  useEffect(() => {
    const hasSeenTour = sessionStorage.getItem(sessionKey);
    if (!hasSeenTour) {
      
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [sessionKey]);

  
  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      sessionStorage.setItem(sessionKey, 'seen');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showSkipButton
      callback={handleJoyrideCallback}
      floaterProps={{
        offset: 100, 
      }}
      styles={{
        options: {
          primaryColor: '#60a5fa',
          zIndex: 1000,
          arrowColor: 'transparent', 
        },
        spotlight: {
          borderRadius: '8px',
          padding: '4px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip',
      }}
    />
  );
};

export default ProductTour;