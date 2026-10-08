import { rupiah } from "./TicketForm";

const NAMA_KERETA = {
  Ekonomi: "Rasa Nusantara",
  Bisnis: "Rasa Utama",
  Eksekutif: "Rasa Prima",
};

const kode = (nama) =>
  nama.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase().padEnd(3, "-");

const formatTanggal = (iso) =>
  iso
    ? new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const batang = (seed) =>
  Array.from(
    { length: 22 },
    (_, i) => 1 + ((seed.charCodeAt(i % seed.length) * (i + 3)) % 4)
  );

// Lama perjalanan dibuat konsisten untuk pasangan stasiun yang sama (60–255 menit)
const durasiMenit = (asal, tujuan) => {
  const s = [asal, tujuan]
    .map((n) => n.toLowerCase().replace(/[^a-z]/g, ""))
    .sort()
    .join("");
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return 60 + (h % 40) * 5;
};

const hitungTiba = (jam, menit) => {
  const [j, m] = jam.split(":").map(Number);
  const total = j * 60 + m + menit;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return { teks: `${hh}.${mm}`, besok: total >= 24 * 60 };
};

export default function TicketPreview({ form, kelas, total, tiket, status, onReset }) {
  const seed = tiket?.no ?? "KERETA";
  const rutaLengkap = form.asal.trim() && form.tujuan.trim();
  const tiba = rutaLengkap
    ? hitungTiba(form.jam, durasiMenit(form.asal, form.tujuan))
    : null;

  return (
    <section className="sisi-tiket" aria-label="Pratinjau tiket">
      <div className="loket">
        <div className="loket__mulut" aria-hidden="true" />
        <div className="loket__ruang">
          <article className={`tiket tiket--${status}`}>
            <div className="tiket__lubang" aria-hidden="true" />

            <div className="tiket__utama">
              <div className="tiket__kepala">
                <span>Lintas Rasa{status === "mengisi" ? " · Draf" : ""}</span>
                <span
                  className="tiket__kelas"
                  style={{ background: kelas.warna }}
                >
                  {kelas.nama}
                </span>
              </div>

              <div className="tiket__rute">
                <div className="tiket__stasiun">
                  <span className="kode">{kode(form.asal)}</span>
                  <span className="kota">{form.asal.trim() || "Stasiun asal"}</span>
                </div>
                <svg
                  className="tiket__panah"
                  viewBox="0 0 48 12"
                  aria-hidden="true"
                >
                  <path
                    d="M0 6h42M36 1l6 5-6 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <div className="tiket__stasiun tiket__stasiun--kanan">
                  <span className="kode">{kode(form.tujuan)}</span>
                  <span className="kota">
                    {form.tujuan.trim() || "Stasiun tujuan"}
                  </span>
                </div>
              </div>

              <dl className="tiket__data">
                <div>
                  <dt>Penumpang</dt>
                  <dd>{form.nama.trim() || "—"}</dd>
                </div>
                <div>
                  <dt>Kereta</dt>
                  <dd>{NAMA_KERETA[kelas.nama]}</dd>
                </div>
                <div>
                  <dt>Berangkat</dt>
                  <dd>{formatTanggal(form.tanggal)}</dd>
                </div>
                <div>
                  <dt>Jam</dt>
                  <dd>
                    {form.jam.replace(":", ".")} →{" "}
                    {tiba ? `${tiba.teks}${tiba.besok ? " +1" : ""}` : "—"}
                  </dd>
                </div>
                <div>
                  <dt>Jumlah</dt>
                  <dd>{form.penumpang} orang</dd>
                </div>
                <div>
                  <dt>Harga</dt>
                  <dd>{rupiah(total)}</dd>
                </div>
              </dl>
            </div>

            <div className="tiket__potongan">
              <dl>
                <div>
                  <dt>No. tiket</dt>
                  <dd>{tiket?.no ?? "—"}</dd>
                </div>
                <div>
                  <dt>Peron</dt>
                  <dd>{tiket?.peron ?? "—"}</dd>
                </div>
                <div>
                  <dt>Gerbong</dt>
                  <dd>{tiket?.gerbong ?? "—"}</dd>
                </div>
                <div>
                  <dt>Kursi</dt>
                  <dd>{tiket?.kursi ?? "—"}</dd>
                </div>
              </dl>
              <div className="batang" aria-hidden="true">
                {batang(seed).map((w, i) => (
                  <span key={i} style={{ width: `${w}px` }} />
                ))}
              </div>
            </div>

            {status === "selesai" && <div className="cap">Lunas</div>}
          </article>
        </div>
      </div>

      <div className="catatan" role="status">
        {status === "mengisi" && (
          <p>Tiket akan dicetak setelah semua kolom terisi dengan benar.</p>
        )}
        {status === "mencetak" && <p>Tiket sedang dicetak...</p>}
        {status === "selesai" && (
          <>
            <p>Tiket sudah jadi. Selamat jalan, {form.nama.trim()}!</p>
            <button className="tombol tombol--sekunder" onClick={onReset}>
              Pesan Lagi
            </button>
          </>
        )}
      </div>
    </section>
  );
}