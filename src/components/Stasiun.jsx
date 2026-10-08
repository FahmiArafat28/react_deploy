const DASAR = 560;
const TIANG = [150, 450, 750, 1050];
const GEDUNG = [
  [0, 90, 170], [90, 60, 230], [150, 110, 150], [260, 70, 260], [330, 100, 190],
  [430, 80, 140], [510, 90, 240], [600, 60, 180], [660, 120, 160], [780, 70, 250],
  [850, 100, 200], [950, 80, 150], [1030, 90, 230], [1120, 80, 170],
];
const BINTANG = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 137) % 1200,
  y: 20 + ((i * 53) % 240),
  r: i % 3 === 0 ? 1.8 : 1.1,
  d: (i % 7) * 0.6,
}));

export default function Stasiun({ terang }) {
  return (
    <div className={`stasiun${terang ? "" : " stasiun--gelap"}`} aria-hidden="true">
      <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="langit-stasiun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b1513" />
            <stop offset="1" stopColor="#25392f" />
          </linearGradient>
          <radialGradient id="cahaya-stasiun">
            <stop offset="0" stopColor="#ffd98a" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1200" height="700" fill="url(#langit-stasiun)" />

        {BINTANG.map((b, i) => (
          <circle
            key={i}
            className="bintang"
            cx={b.x}
            cy={b.y}
            r={b.r}
            fill="#f3ead2"
            style={{ animationDelay: `${b.d}s` }}
          />
        ))}
        <circle cx="1040" cy="110" r="34" fill="#efe6d0" opacity="0.92" />

        {GEDUNG.map(([x, w, h], i) => {
          const atas = DASAR - h;
          const kolom = Math.floor((w - 16) / 22);
          const baris = Math.floor((h - 30) / 34);
          const jendela = [];
          for (let c = 0; c < kolom; c++) {
            for (let r = 0; r < baris; r++) {
              if ((i * 5 + c * 3 + r * 7) % 5 === 0) {
                jendela.push(
                  <rect
                    key={`${c}-${r}`}
                    className="jendela-kota"
                    x={x + 10 + c * 22}
                    y={atas + 16 + r * 34}
                    width="10"
                    height="14"
                    fill="#f4c76a"
                  />
                );
              }
            }
          }
          return (
            <g key={i}>
              <rect x={x} y={atas} width={w} height={h} fill="#101c19" />
              {jendela}
            </g>
          );
        })}

        <rect y={DASAR} width="1200" height="140" fill="#18231f" />
        <rect y={DASAR} width="1200" height="6" fill="#e8b84a" opacity="0.75" />
        <rect y="640" width="1200" height="60" fill="#0f1714" />
        <rect y="652" width="1200" height="4" fill="#6f6a5a" />
        <rect y="676" width="1200" height="4" fill="#6f6a5a" />

        <rect x="560" y="470" width="8" height="90" fill="#2c3632" />
        <rect x="632" y="470" width="8" height="90" fill="#2c3632" />
        <rect x="520" y="430" width="160" height="50" rx="3" fill="#1e5a49" stroke="#efe6d0" strokeWidth="2" />
        <text x="600" y="463" textAnchor="middle" className="papan-nama">
          LINTAS RASA
        </text>

        {TIANG.map((x) => (
          <g key={x}>
            <rect x={x - 3} y="400" width="6" height={DASAR - 400} fill="#34403b" />
            <path d={`M${x - 22} 400 Q${x} 384 ${x + 22} 400 Z`} fill="#2a3531" />
            <circle className="glow" cx={x} cy="402" r="110" fill="url(#cahaya-stasiun)" />
            <ellipse className="bohlam" cx={x} cy="402" rx="12" ry="5" fill="#ffe6a8" />
          </g>
        ))}
      </svg>
    </div>
  );
}