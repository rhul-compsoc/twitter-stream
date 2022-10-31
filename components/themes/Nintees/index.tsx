import { useEffect, useRef, useState } from 'react';
import { splitText } from '../VaporWave';
import DVDLogo from './DVDLogo';
import css from './Nintees.module.css';

const svgWidth = 800;
const svgHeight = 600;

const Ninteens = ({
    tweet,
    topBanner
}: {
    tweet: string;
    topBanner: string;
}) => {
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
        <div
            className={`h-full w-full ${css.ninteesContainer}`}
            ref={containerRef}>
            <div className="flex h-full w-full flex-col justify-center align-middle">
                <div
                    className={`z-10 m-14 w-full flex-1 text-center text-5xl ${css.blink}`}>
                    {topBanner}
                </div>
                <div
                    className={`z-10 flex h-full align-middle ${
                        spin && 'animate-spin'
                    }`}>
                    <div
                        className={`m-auto h-fit text-center text-5xl ${css.tweetText}`}>
                        {splitText(tweet).map((line, i) => (
                            <div>{line}</div>
                        ))}
                    </div>
                </div>
                <img
                    src="https://i.imgur.com/QkBkUkC.gif"
                    className="z-10 m-auto mb-5 h-32 w-64"
                />
                <DVDLogo containerRef={containerRef} cornerHit={cornerHit} />
            </div>
        </div>
    );
};

export default Ninteens;
