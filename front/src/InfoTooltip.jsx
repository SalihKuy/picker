import React, { useState, useRef, useLayoutEffect } from 'react';
import './InfoTooltip.css';

const InfoTooltip = ({ text, style }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [verticalPosition, setVerticalPosition] = useState('top');
  const tooltipRef = useRef(null);
  const iconContainerRef = useRef(null);

  useLayoutEffect(() => {
    if (isVisible && tooltipRef.current && iconContainerRef.current) {
      const iconContainerElement = iconContainerRef.current;
      const tooltipElement = tooltipRef.current;

      tooltipElement.style.transform = '';

      const iconRect = iconContainerElement.getBoundingClientRect();
      const tooltipHeight = tooltipElement.offsetHeight;
      const tooltipGap = 10;
      const viewportPadding = 10;

      let newCalculatedVerticalPosition = 'top';
      const spaceAboveIcon = iconRect.top;
      const spaceBelowIcon = window.innerHeight - iconRect.bottom;

      if (spaceAboveIcon < (tooltipHeight + tooltipGap)) { 
        if (spaceBelowIcon > (tooltipHeight + tooltipGap)) {
          newCalculatedVerticalPosition = 'bottom';
        }
      }

      if (newCalculatedVerticalPosition !== verticalPosition) {
        setVerticalPosition(newCalculatedVerticalPosition);
        return;
      }

      const currentTooltipRect = tooltipElement.getBoundingClientRect();
      let horizontalAdjust = 0;

      if (currentTooltipRect.left < viewportPadding) {
        horizontalAdjust = viewportPadding - currentTooltipRect.left;
      }
      else if (currentTooltipRect.right > window.innerWidth - viewportPadding) {
        horizontalAdjust = (window.innerWidth - viewportPadding) - currentTooltipRect.right;
      }

      if (horizontalAdjust !== 0) {
        tooltipElement.style.transform = `translateX(${horizontalAdjust}px)`;
      }

    } else if (tooltipRef.current) {
      tooltipRef.current.style.transform = '';
    }
  }, [isVisible, text, verticalPosition]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className="info-tooltip-container" ref={iconContainerRef} style={style}>
      <span
        className="info-icon"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        &#9432;
      </span>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`tooltip-text ${verticalPosition === 'bottom' ? 'tooltip-bottom' : ''}`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;