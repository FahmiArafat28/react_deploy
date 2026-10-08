import { useEffect, useState } from "react";

const HURUF = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LEBAR_PAPAN = 12;

function Flap({ target, delay }) {
  const [tampil, setTampil] = useState(" ");

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setTampil(target);
      return;
    }
    let putaran = 0;
    let interval;
    const mulai = setTimeout(() => {
      interval = setInterval(() => {
        putaran += 1;
        if (putaran > 5) {
          setTampil(target);
          clearInterval(interval);
        } else {
          setTampil(HURUF[Math.floor(Math.random() * HURUF.length)]);
        }
      }, 55);
    }, delay);
    return () => {
      clearTimeout(mulai);
      clearInterval(interval);
    };
  }, [target, delay]);

  return (
    <span className="flap">
      <span className="flap__huruf" key={tampil}>
        {tampil === " " ? "\u00A0" : tampil}
      </span>
    </span>
  );
}

function BarisPapan({ label, teks }) {
  const huruf = teks
    .toUpperCase()
    .slice(0, LEBAR_PAPAN)
    .padEnd(LEBAR_PAPAN, " ")
    .split("");
  return (
    <div className="papan__baris">
      <span className="papan__label">{label}</span>
      <div className="flaps" aria-hidden="true">
        {huruf.map((h, i) => (
          <Flap key={i} target={h} delay={i * 45} />
        ))}
      </div>
    </div>
  );
}

export default function SplitFlapBoard({ asal, tujuan }) {
  return (
    <section
      className="papan"
      aria-label={`Papan rute: dari ${asal || "belum diisi"} ke ${
        tujuan || "belum diisi"
      }`}
    >
      <BarisPapan label="DARI" teks={asal.trim() || "Isi asal"} />
      <BarisPapan label="KE" teks={tujuan.trim() || "Isi tujuan"} />
    </section>
  );
}