import { useEffect, useRef, useState } from 'react';
import { XyzTransitionGroup } from '@animxyz/react';
import { splitText } from '../VaporWave';
import DVDLogo from './DVDLogo';
import css from './Nintees.module.css';

const svgWidth = 800;
const svgHeight = 600;

const Ninteens = ({ tweet, topBanner }: {tweet: string, topBanner: string}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [spin, setSpin] = useState(false);


  // Whenever a corner is hit by the DVD, the tweet will spin!
  useEffect(() => {
    if (spin) {
      const interval = setTimeout(() => setSpin(false), 2000);
      return () => clearTimeout(interval);
    }
    return () => {};
  }, [spin]);

  const cornerHit = () => {
    console.log('I HIT THE CORNER!!1!!!');
    setSpin(true);
  };

  return (
    <div className={`h-full w-full ${css.ninteesContainer}`} ref={containerRef}>
      <div className="flex flex-col w-full h-full justify-center align-middle">
        <div className={`flex-1 text-center w-full text-5xl m-14 z-10 ${css.blink}`}>
          {topBanner}
        </div>
        <div className={`h-full flex align-middle z-10 ${spin && 'animate-spin'}`}>
          <div className={`m-auto text-5xl h-fit ${css.tweetText}`}>
            {
            splitText(tweet).map((line, i) => (
              <div>{line}</div>
            ))
          }
          </div>

        </div>
        <img src="https://i.imgur.com/QkBkUkC.gif" className="w-64 h-32 m-auto mb-5 z-10" />
        <DVDLogo containerRef={containerRef} cornerHit={cornerHit} />
      </div>

    </div>
  );
};

export default Ninteens;
