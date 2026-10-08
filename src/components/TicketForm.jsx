export const KELAS = [
  { nama: "Ekonomi", harga: 120000, warna: "#2f6b57" },
  { nama: "Bisnis", harga: 250000, warna: "#2c4a6b" },
  { nama: "Eksekutif", harga: 450000, warna: "#8a2f2a" },
];

export const JAM = ["05:30", "08:15", "11:00", "14:30", "17:45", "20:15"];

export const rupiah = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);

export const hariIni = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const SARAN_STASIUN = [
  "Medan",
  "Binjai",
  "Tebing Tinggi",
  "Kisaran",
  "Rantau Prapat",
  "Jakarta Gambir",
  "Bandung",
  "Yogyakarta",
  "Semarang Tawang",
  "Surabaya Gubeng",
];

function Isian({ id, label, error, ...props }) {
  return (
    <div className="kolom">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
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

export default function TicketForm({ form, errors, onChange, onSubmit, disabled }) {
  return (
    <form className="formulir" onSubmit={onSubmit} noValidate>
      <h2 className="formulir__judul">Formulir Pemesanan</h2>
      <p className="formulir__sub">
        Isi data perjalanan. Tiket di sebelah akan terisi sendiri.
      </p>

      <fieldset className="formulir__isi" disabled={disabled}>
        <Isian
          id="nama"
          label="Nama penumpang"
          type="text"
          placeholder="Sesuai kartu identitas"
          autoComplete="name"
          value={form.nama}
          onChange={(e) => onChange("nama", e.target.value)}
          error={errors.nama}
        />

        <div className="baris-dua">
          <Isian
            id="asal"
            label="Stasiun asal"
            type="text"
            placeholder="Contoh: Medan"
            list="saran-stasiun"
            autoComplete="off"
            value={form.asal}
            onChange={(e) => onChange("asal", e.target.value)}
            error={errors.asal}
          />
          <Isian
            id="tujuan"
            label="Stasiun tujuan"
            type="text"
            placeholder="Contoh: Binjai"
            list="saran-stasiun"
            autoComplete="off"
            value={form.tujuan}
            onChange={(e) => onChange("tujuan", e.target.value)}
            error={errors.tujuan}
          />
        </div>
        <datalist id="saran-stasiun">
          {SARAN_STASIUN.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>

        <div className="baris-dua">
          <Isian
            id="tanggal"
            label="Tanggal berangkat"
            type="date"
            min={hariIni()}
            value={form.tanggal}
            onChange={(e) => onChange("tanggal", e.target.value)}
            error={errors.tanggal}
          />
          <div className="kolom">
            <label htmlFor="jam">Jam berangkat</label>
            <select
              id="jam"
              value={form.jam}
              onChange={(e) => onChange("jam", e.target.value)}
            >
              {JAM.map((j) => (
                <option key={j} value={j}>
                  {j.replace(":", ".")} WIB
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="kolom">
          <span className="judul-kolom" id="judul-kelas">
            Kelas
          </span>
          <div className="kelas" role="radiogroup" aria-labelledby="judul-kelas">
            {KELAS.map((k) => (
              <label
                key={k.nama}
                className={`kelas__opsi${
                  form.kelas === k.nama ? " kelas__opsi--aktif" : ""
                }`}
                style={{ "--warna": k.warna }}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="kelas"
                  value={k.nama}
                  checked={form.kelas === k.nama}
                  onChange={() => onChange("kelas", k.nama)}
                />
                <span className="kelas__nama">{k.nama}</span>
                <span className="kelas__harga">{rupiah(k.harga)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="kolom">
          <span className="judul-kolom" id="judul-penumpang">
            Jumlah penumpang
          </span>
          <div className="stepper" role="group" aria-labelledby="judul-penumpang">
            <button
              type="button"
              aria-label="Kurangi penumpang"
              disabled={form.penumpang <= 1}
              onClick={() => onChange("penumpang", form.penumpang - 1)}
            >
              −
            </button>
            <output aria-live="polite">{form.penumpang}</output>
            <button
              type="button"
              aria-label="Tambah penumpang"
              disabled={form.penumpang >= 6}
              onClick={() => onChange("penumpang", form.penumpang + 1)}
            >
              +
            </button>
          </div>
        </div>

        <button className="tombol" type="submit">
          Cetak Tiket
        </button>
      </fieldset>
    </form>
  );
}