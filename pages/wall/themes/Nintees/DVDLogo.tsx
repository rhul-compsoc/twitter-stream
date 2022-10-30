import {
  useEffect, useRef, useState,
} from 'react';
import * as React from 'react';

const COLORS = [
  'ff0000',
  'ff4000',
  'ff8000',
  'ffbf00',
  'ffff00',
  'bfff00',
  '80ff00',
  '40ff00',
  '00ff00',
  '00ff40',
  '00ff80',
  '00ffbf',
  '00ffff',
  '00bfff',
  '0080ff',
  '0040ff',
  '0000ff',
  '4000ff',
  '8000ff',
  'bf00ff',
  'ff00ff',
  'ff00bf',
  'ff0080',
  'ff0040',
  'ff0000',
];

const invertHex = (hex: string) => (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase();

const widthDVDLogo = 200;
const heightDVDLogo = 97.45;

interface DVDLogoProps {
	containerRef: React.RefObject<HTMLDivElement>;
  cornerHit: () => void;
}

const DVDLogo = (props: DVDLogoProps) => {
  const { containerRef, cornerHit } = props;
  const svgRef = useRef<SVGSVGElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1); // TODO: fix this
  const [xSpeed, setXSpeed] = useState<number>(5);
  const [ySpeed, setYSpeed] = useState<number>(5);
  const [logoColor, setLogoColor] = useState<string>(COLORS[0]);

  useEffect(() => {
    // ensure the colour is not the same
    let newColour = COLORS[Math.floor(Math.random() * COLORS.length)];
    while (newColour === logoColor) {
      newColour = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    setLogoColor(newColour);
  }, [xSpeed, ySpeed]);

  useEffect(() => {
    if (containerRef?.current) {
      const interval = setTimeout(() => requestAnimationFrame(() => {
        let xAdjusted = false;
        let yAdjusted = false;
        const width = containerRef?.current?.clientWidth || 50;
        const height = containerRef?.current?.clientHeight || 50;
        if (position.x + xSpeed + (widthDVDLogo * scale) >= width) {
          setXSpeed(-Math.abs(xSpeed));
          xAdjusted = true;
        } else if (position.x + xSpeed <= 0) {
          setXSpeed(Math.abs(xSpeed));
          xAdjusted = true;
        }
        if (position.y + ySpeed + (heightDVDLogo * scale) >= height) {
          setYSpeed(-Math.abs(ySpeed));
          yAdjusted = true;
        } else if (position.y + ySpeed <= 0) {
          setYSpeed(Math.abs(ySpeed));
          yAdjusted = true;
        }

        // If we hit a corner, trigger the corner hit function
        if (xAdjusted && yAdjusted) {
          cornerHit();
        }
        setPosition({ x: (position.x + xSpeed), y: (position.y + ySpeed) });
      }), 5);
      return () => clearTimeout(interval);
    }
    return () => {};
  }, [containerRef, position]);

  /*
  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current) {
        console.log('setting position');
        setPosition({ x: 10000, y: 10000 });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []); */

  return (
    <svg className="absolute" ref={svgRef} style={{ top: position.y, left: position.x }}>
      <g>
        <g fill={`#${logoColor}`} style={{ scale, filter: `drop-shadow(3px 3px 1px #${invertHex(logoColor)})` }}>
          <path
            d="M118.895,20.346c0,0-13.743,16.922-13.04,18.001c0.975-1.079-4.934-18.186-4.934-18.186s-1.233-3.597-5.102-15.387H81.81H47.812H22.175l-2.56,11.068h19.299h4.579c12.415,0,19.995,5.132,17.878,14.225c-2.287,9.901-13.123,14.128-24.665,14.128H32.39l5.552-24.208H18.647l-8.192,35.368h27.398c20.612,0,40.166-11.067,43.692-25.288c0.617-2.614,0.53-9.185-1.054-13.053c0-0.093-0.091-0.271-0.178-0.537c-0.087-0.093-0.178-0.722,0.178-0.814c0.172-0.092,0.525,0.271,0.525,0.358c0,0,0.179,0.456,0.351,0.813l17.44,50.315l44.404-51.216l18.761-0.092h4.579c12.424,0,20.09,5.132,17.969,14.225c-2.29,9.901-13.205,14.128-24.75,14.128h-4.405L161,19.987h-19.287l-8.198,35.368h27.398c20.611,0,40.343-11.067,43.604-25.288c3.347-14.225-11.101-25.293-31.89-25.293h-18.143h-22.727C120.923,17.823,118.895,20.346,118.895,20.346L118.895,20.346z"
          />
          <path
            d="M99.424,67.329C47.281,67.329,5,73.449,5,81.012c0,7.558,42.281,13.678,94.424,13.678c52.239,0,94.524-6.12,94.524-13.678C193.949,73.449,151.664,67.329,99.424,67.329z M96.078,85.873c-11.98,0-21.58-2.072-21.58-4.595c0-2.523,9.599-4.59,21.58-4.59c11.888,0,21.498,2.066,21.498,4.59C117.576,83.801,107.966,85.873,96.078,85.873z"
          />
        </g>
      </g>
    </svg>
  );
};

export default DVDLogo;
