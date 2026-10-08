import { useState } from "react";

const rupiah = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka || 0);

const formatTanggal = (iso) => {
  if (!iso) return "-";
  const [t, b, h] = iso.split("-").map(Number);
  return new Date(t, b - 1, h).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Kode stasiun 3 huruf dari nama stasiun, contoh "Gambir" -> "GAM"
const kode = (nama = "") => {
  const bersih = nama.replace(/[^a-zA-Z]/g, "").toUpperCase();
  return bersih.slice(0, 3) || "---";
};

export default function TiketSaya({ daftar, onPesan, onHapus }) {
  const [konfirmasi, setKonfirmasi] = useState(null);

  const batalkan = (id) => {
    if (konfirmasi === id) {
      onHapus(id);
      setKonfirmasi(null);
    } else {
      setKonfirmasi(id);
    }
  };

  return (
    <section className="tiket-saya" aria-labelledby="judul-tiket-saya">
      <header className="tiket-saya__kepala">
        <p className="eyebrow">Loket 1 · Arsip</p>
        <h1 className="app__judul" id="judul-tiket-saya">
          Tiket Saya
        </h1>
      </header>

      {daftar.length === 0 ? (
        <div className="kosong">
          <p>Belum ada tiket. Pesan perjalanan pertamamu.</p>
          <button className="tombol tombol--sekunder" onClick={onPesan}>
            Pesan Tiket
          </button>
        </div>
      ) : (
        <ul className="daftar-tiket">
          {daftar.map((t) => (
            <li className="mini" key={t.id}>
              <div className="mini__rute">
                <span className="kode">{kode(t.asal)}</span>
                <svg className="tiket__panah" viewBox="0 0 48 12" aria-hidden="true">
                  <path
                    d="M0 6h42M36 1l6 5-6 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span className="kode">{kode(t.tujuan)}</span>
              </div>
              <p className="mini__kota">
                {t.asal} → {t.tujuan}
              </p>

              <dl className="mini__data">
                <div>
                  <dt>Penumpang</dt>
                  <dd>{t.nama}</dd>
                </div>
                <div>
                  <dt>Berangkat</dt>
                  <dd>
                    {formatTanggal(t.tanggal)} · {t.jam.replace(":", ".")}
                  </dd>
                </div>
                <div>
                  <dt>Kelas</dt>
                  <dd>
                    {t.kelas} · {t.penumpang} orang
                  </dd>
                </div>
                <div>
                  <dt>Tempat</dt>
                  <dd>
                    Peron {t.tiket.peron} · Gbg {t.tiket.gerbong} · {t.tiket.kursi}
                  </dd>
                </div>
              </dl>

              <div className="mini__bawah">
                <span className="mini__no">
                  {t.tiket.no} · {rupiah(t.total)}
                </span>
                <button
                  type="button"
                  className="mini__hapus"
                  onClick={() => batalkan(t.id)}
                >
                  {konfirmasi === t.id ? "Yakin batalkan?" : "Batalkan"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
