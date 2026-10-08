export default function TrainAnimation({ active }) {
  if (!active) return null;
  return (
    <div className="rel" aria-hidden="true">
      <svg className="kereta" viewBox="0 0 560 72">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${i * 130 + 4},8)`}>
            <rect className="svg-badan" width="122" height="46" rx="4" />
            <rect className="svg-garis" y="32" width="122" height="5" />
            {[0, 1, 2, 3].map((j) => (
              <rect
                key={j}
                className="svg-jendela"
                x={10 + j * 28}
                y="8"
                width="20"
                height="14"
                rx="2"
              />
            ))}
            <circle className="svg-roda" cx="22" cy="50" r="7" />
            <circle className="svg-roda" cx="100" cy="50" r="7" />
          </g>
        ))}
        <g transform="translate(396,2)">
          <rect className="svg-cerobong" x="112" y="4" width="12" height="14" />
          {[0, 1, 2].map((k) => (
            <circle
              key={k}
              className="asap"
              cx="118"
              cy="4"
              r="6"
              style={{ animationDelay: `${k * 0.45}s` }}
            />
          ))}
          <rect className="svg-lokomotif" y="14" width="150" height="40" rx="4" />
          <rect className="svg-lokomotif" x="14" width="44" height="22" rx="3" />
          <rect className="svg-jendela" x="22" y="5" width="28" height="12" rx="2" />
          <rect className="svg-garis" y="38" width="150" height="5" />
          <circle className="svg-lampu" cx="143" cy="27" r="5" />
          <circle className="svg-roda" cx="30" cy="56" r="7" />
          <circle className="svg-roda" cx="75" cy="56" r="7" />
          <circle className="svg-roda" cx="120" cy="56" r="7" />
        </g>
      </svg>
    </div>
  );
}