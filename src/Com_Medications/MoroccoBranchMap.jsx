import React from "react";

// These city centers illustrate the network; they are not verified branch addresses.
const branchCities = [
  { name: "Tanger", latitude: 35.76, longitude: -5.83 },
  { name: "Rabat", latitude: 34.02, longitude: -6.84 },
  { name: "Casablanca", latitude: 33.57, longitude: -7.59 },
  { name: "Fès", latitude: 34.03, longitude: -5.00 },
  { name: "Oujda", latitude: 34.68, longitude: -1.91 },
  { name: "Marrakech", latitude: 31.63, longitude: -8.00 },
  { name: "Agadir", latitude: 30.42, longitude: -9.60 },
  { name: "Ouarzazate", latitude: 30.92, longitude: -6.91 },
];

// Use the local Natural Earth asset's extent and dimensions to place each marker.
function project(latitude, longitude) {
  return [(longitude + 12.1) / 11.4 * 440, (36.6 - latitude) / 8.4 * 380];
}

export default function MoroccoBranchMap() {
  const [destinationX, destinationY] = project(32.8627, -6.57359);

  return (
    <div className="morocco-network">
      {/* Keep numbered city markers distinct from the tracked destination. */}
      <svg className="morocco-network-map" viewBox="0 0 440 380" role="img" aria-label="Map of Morocco with eight illustrative branch cities and the delivery destination Oued Zem">
        <image href="/images_marque/morocco-coverage.svg" width="440" height="380" />
        {branchCities.map(({ name, latitude, longitude }, index) => {
          const [x, y] = project(latitude, longitude);
          return (
            <g key={name} className="morocco-branch-pin" transform={`translate(${x} ${y})`}>
              <circle r="11" />
              <text textAnchor="middle" dominantBaseline="central">{index + 1}</text>
            </g>
          );
        })}
        <path className="morocco-destination-pin" d="M0 -9 9 0 0 9 -9 0Z" transform={`translate(${destinationX} ${destinationY})`} />
      </svg>

      {/* Let city names remain readable in a separate legend on small screens. */}
      <div className="morocco-network-legend">
        <h3>Morocco branch network</h3>
        <p>Illustrative branch locations</p>
        <ol>
          {branchCities.map(({ name }, index) => (
            <li key={name}><span aria-hidden="true">{index + 1}</span>{name}</li>
          ))}
        </ol>
        <p className="morocco-destination-key">Delivery destination: Oued Zem</p>
        <a href="https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-countries-2/">Map data: Natural Earth</a>
      </div>
    </div>
  );
}
