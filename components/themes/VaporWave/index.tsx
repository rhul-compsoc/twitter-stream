/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable react/style-prop-object */
import React from 'react';
import css from './VaporWave.module.css';

export const getMaxPerLine = (size: number) => Math.floor(3 * Math.sqrt(size));

export const splitText = (text: string) => text.split(' ').reduce((acc: string[], c: string, i, arr) => {
  // this is required as we can't just let the system automatically put the text on a new line sadly
  const maxPerLine = getMaxPerLine(arr.join(' ').length);

  while (c.length > maxPerLine) {
    console.log(`c: ${c} - too long, splitting`);
    acc.push(c.slice(0, maxPerLine));
    c = `-${c.slice(maxPerLine)}`;
  }

  c += ' ';
  if (acc.length < 1) {
    return [c];
  }
  if ((acc[acc.length - 1].length + c.length) < maxPerLine) {
    acc[acc.length - 1] += c;
    return acc;
  }

  return [...acc, c];
}, []);

/**
 * This is the vaporwave theme for the wall.
 * inspired by: https://codepen.io/inegoita/pen/BgdXMw
 */
const VaporWave = ({ tweet, topBanner }: {tweet: string, topBanner: string}) => (
  <div>
    <div className={`${css.background80s} ${css.animatedClouds} ${css.stars} ${css.parentContainer} z-50`}>
      <div className={css.sun} />
      <div className={css.grid} />
      <div className={css.mountains}>
        <div className={`${css.mountain} ${css.one}`} />
        <div className={`${css.mountain} ${css.two}`} />
        <div className={`${css.mountain} ${css.three}`} />
        <div className={`${css.mountain} ${css.four}`} />
        <div className={`${css.mountain} ${css.five}`} />
        <div className={`${css.mountain} ${css.six}`} />
        <div className={`${css.mountain} ${css.seven}`} />
        <div className={`${css.mountain} ${css.eight}`} />
        <div className={`${css.mountain} ${css.nine}`} />
        <div className={`${css.mountain} ${css.ten}`} />
        <div className={`${css.mountain} ${css.eleven}`} />
        <div className={`${css.mountain} ${css.twelve}`} />
      </div>
      <div className={css.overlay} />

      <div className={`absolute top-12 w-full flex justify-center text-5xl ${css.glow}`}>
        {topBanner}
      </div>
      <div className={css.text}>
        {
						splitText(tweet).map((line, i) => (
  <div className={`${css.chrome} ${css.shine}`} style={{ '--shine-delay': `${i / 1.5}s`, fontSize: `${((1 / tweet.length) * 150) + 2.5}em` } as React.CSSProperties} data-text={line} key={i}>
    {line}
    {(Math.random() > 0.5) && <span className={`z-50 ${css.spark}`} />}
  </div>
						))

				}
      </div>
    </div>
    <svg width="0" height="0">
      <filter id="filter">
        <feTurbulence type="fractalNoise" baseFrequency=".01" numOctaves="10" id="fractalNoise" />
        <feDisplacementMap id="displacementMap" in="SourceGraphic" scale="120" />
      </filter>
      <animate
        xlinkHref="#displacementMap"
        id="animclouds1"
        begin="0; animclouds2.end"
        attributeName="scale"
        from="50"
        to="180"
        dur="3s"
        fill="freeze"
      />
      <animate
        xlinkHref="#displacementMap"
        id="animclouds2"
        begin="animclouds1.end"
        attributeName="scale"
        from="180"
        to="50"
        dur="3s"
        fill="freeze"
      />
      <animate
        xlinkHref="#fractalNoise"
        id="animclouds3"
        begin="0;animclouds4.end"
        attributeName="baseFrequency"
        from="0.03"
        to="0.01"
        dur="30s"
        fill="freeze"
      />
      <animate
        xlinkHref="#fractalNoise"
        id="animclouds4"
        begin="animclouds3.end"
        attributeName="baseFrequency"
        from="0.01"
        to="0.03"
        dur="30s"
        fill="freeze"
      />
    </svg>
  </div>
);

export default VaporWave;
