/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable react/style-prop-object */
import React from 'react';

const getMaxPerLine = (size: number) => Math.floor(3 * Math.sqrt(size));

const splitText = (text: string) => text.split(' ').reduce((acc: string[], c: string, i, arr) => {
  // this is required as we can't just let the system automatically put the text on a new line sadly
  const maxPerLine = getMaxPerLine(arr.join(' ').split('').length);
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
    <div className="background-80s animated-clouds stars parentContainer z-50">
      <div className="sun" />
      <div className="grid" />
      <div className="mountains">
        <div className="mountain one" />
        <div className="mountain two" />
        <div className="mountain three" />
        <div className="mountain four" />
        <div className="mountain five" />
        <div className="mountain six" />
        <div className="mountain seven" />
        <div className="mountain eight" />
        <div className="mountain nine" />
        <div className="mountain ten" />
        <div className="mountain eleven" />
        <div className="mountain twelve" />
      </div>
      <div className="overlay" />

      <div className="absolute top-12 glow w-full flex justify-center text-5xl ">
        {topBanner}
      </div>
      <div className="text">

        {
						splitText(tweet).map((line, i) => (
  <div className="chrome shine" style={{ '--shine-delay': `${i}s`, fontSize: `${((1 / tweet.length) * 150) + 3}em` } as React.CSSProperties} data-text={line} key={i}>
    {line}
    <span className="spark z-50" />
  </div>
						))

				}
        {/* <div className="chrome shine" data-text="DESIGN" style="--shine-delay:1s;">
          DESIGN
          <span className="spark spark-offset" />
        </div> */}
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
    <a href="https://www.mockofun.com/tutorials/add-grid-to-photo/" target="_blank" rel="noreferrer">Grid Drawing Tool</a>

  </div>

);

export default VaporWave;
