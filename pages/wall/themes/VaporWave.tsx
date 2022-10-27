/* eslint-disable react/style-prop-object */

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

      <div className="road-off" />
      <div className="overlay" />

      <div className="absolute top-12 glow w-full flex justify-center text-5xl ">
        {topBanner}
      </div>
      <div className="text">

        <div className="chrome shine" data-text="80'S RETRO">
          80
          <span className="spark" />
          'S RETRO
        </div>
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
