import { useEffect, useRef, useState } from "react";

function Isian({ id, label, error, ...props }) {
  return (
    <div className="kolom">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p className="error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

const namaDariEmail = (email) =>
  email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (h) => h.toUpperCase()) || "Penumpang";

function validasiLogin({ email, sandi }) {
  const e = {};
  if (!email.trim()) e.email = "Email belum diisi.";
  else if (!/^\S+@\S+\.\S+$/.test(email.trim()))
    e.email = "Format email belum benar.";
  if (!sandi) e.sandi = "Kata sandi belum diisi.";
  else if (sandi.length < 6) e.sandi = "Kata sandi minimal 6 karakter.";
  return e;
}

export default function HalamanLogin({ lampu, onLampu, onMasuk }) {
  const [data, setData] = useState({ email: "", sandi: "" });
  const [dicoba, setDicoba] = useState(false);
  const [membuka, setMembuka] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const errors = validasiLogin(data);
  const tampil = dicoba ? errors : {};
  const nama = namaDariEmail(data.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDicoba(true);
    if (Object.keys(errors).length > 0) return;
    setMembuka(true);
    timer.current = setTimeout(() => onMasuk({ nama }), 1800);
  };

  return (
    <section
      className={`login${lampu ? " login--terang" : ""}`}
      aria-label="Halaman masuk"
    >
      <div className="login__cahaya" aria-hidden="true" />

      <div className="lampu">
        <svg className="lampu__badan" viewBox="0 0 120 130" aria-hidden="true">
          <line x1="60" y1="0" x2="60" y2="52" className="lampu__kabel" />
          <path d="M20 112 L40 52 H80 L100 112 Z" className="lampu__kap" />
          <ellipse cx="60" cy="112" rx="40" ry="8" className="lampu__bibir" />
          <ellipse cx="60" cy="114" rx="14" ry="6" className="lampu__bohlam" />
        </svg>
        <button
          type="button"
          className="lampu__tali"
          onClick={() => onLampu(!lampu)}
          aria-pressed={lampu}
          aria-label="Tarik tali lampu"
        >
          <span className="lampu__benang" />
          <span className="lampu__pegangan" />
        </button>
      </div>

      <p className="login__petunjuk" aria-live="polite">
        {lampu
          ? "Lampu menyala. Silakan masuk."
          : "Ruangan gelap. Tarik tali lampu untuk menyalakannya."}
      </p>

      {membuka ? (
        <div className="gerbang login__kartu" role="status">
          <div className="gerbang__tiang" aria-hidden="true">
            <span className="gerbang__palang" />
          </div>
          <p className="gerbang__teks">
            Selamat datang, {nama}. Gerbang dibuka...
          </p>
        </div>
      ) : (
        <form
          className={`formulir login__kartu${lampu ? "" : " login__kartu--gelap"}`}
          onSubmit={handleSubmit}
          noValidate
        >
          <h2 className="formulir__judul">Masuk</h2>
          <p className="formulir__sub">
            Masuk untuk memesan dan melihat tiketmu. Ini versi demo, email dan
            sandi belum diperiksa ke server.
          </p>

          <fieldset className="formulir__isi" disabled={!lampu}>
            <Isian
              id="email"
              label="Email"
              type="email"
              placeholder="nama@contoh.com"
              autoComplete="email"
              value={data.email}
              onChange={(e) => setData((p) => ({ ...p, email: e.target.value }))}
              error={tampil.email}
            />
            <Isian
              id="sandi"
              label="Kata sandi"
              type="password"
              placeholder="Minimal 6 karakter"
              autoComplete="current-password"
              value={data.sandi}
              onChange={(e) => setData((p) => ({ ...p, sandi: e.target.value }))}
              error={tampil.sandi}
            />
            <button className="tombol" type="submit">
              Masuk
            </button>
          </fieldset>
        </form>
      )}
    </section>
  );
}
