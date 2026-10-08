export default function BilahAtas({
  halaman,
  pengguna,
  jumlahTiket,
  onPindah,
  onKeluar,
}) {
  return (
    <div className="bilah">
      <span className="bilah__merek">Lintas Rasa</span>

      {pengguna && (
        <nav className="bilah__nav" aria-label="Menu utama">
          <button
            type="button"
            className="bilah__tautan"
            aria-current={halaman === "pesan" ? "page" : undefined}
            onClick={() => onPindah("pesan")}
          >
            Pesan Tiket
          </button>
          <button
            type="button"
            className="bilah__tautan"
            aria-current={halaman === "tiket" ? "page" : undefined}
            onClick={() => onPindah("tiket")}
          >
            Tiket Saya ({jumlahTiket})
          </button>
          <button type="button" className="bilah__tautan" onClick={onKeluar}>
            Keluar
          </button>
        </nav>
      )}
    </div>
  );
}