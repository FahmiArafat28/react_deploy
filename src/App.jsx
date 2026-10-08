import { useEffect, useMemo, useState } from "react";
import "./App.css";
import BilahAtas from "./components/BilahAtas";
import HalamanLogin from "./components/HalamanLogin";
import SplitFlapBoard from "./components/SplitFlapBoard";
import Stasiun from "./components/Stasiun";
import TicketForm, { KELAS, hariIni } from "./components/TicketForm";
import TicketPreview from "./components/TicketPreview";
import TiketSaya from "./components/TiketSaya";
import TrainAnimation from "./components/TrainAnimation";

const KUNCI_TIKET = "tiket-lintas-rasa";
const KUNCI_PENGGUNA = "pengguna-lintas-rasa";

const FORM_AWAL = {
  nama: "",
  asal: "",
  tujuan: "",
  tanggal: "",
  jam: "08:15",
  kelas: "Ekonomi",
  penumpang: 1,
};

const bacaStorage = (kunci, cadangan) => {
  try {
    const nilai = JSON.parse(localStorage.getItem(kunci));
    return nilai ?? cadangan;
  } catch {
    return cadangan;
  }
};

const tulisStorage = (kunci, nilai) => {
  try {
    if (nilai === null) localStorage.removeItem(kunci);
    else localStorage.setItem(kunci, JSON.stringify(nilai));
  } catch {
    /* penyimpanan tidak tersedia, abaikan */
  }
};

const buatTiket = () => ({
  no: `KA-${Math.floor(100000 + Math.random() * 900000)}`,
  peron: Math.ceil(Math.random() * 5),
  gerbong: Math.ceil(Math.random() * 8),
  kursi: `${Math.ceil(Math.random() * 20)}${"ABCD"[Math.floor(Math.random() * 4)]}`,
});

function validasi(f) {
  const e = {};
  if (!f.nama.trim()) e.nama = "Nama penumpang belum diisi.";
  if (!f.asal.trim()) e.asal = "Stasiun asal belum diisi.";
  if (!f.tujuan.trim()) e.tujuan = "Stasiun tujuan belum diisi.";
  else if (f.asal.trim().toLowerCase() === f.tujuan.trim().toLowerCase())
    e.tujuan = "Stasiun tujuan harus berbeda dari asal.";
  if (!f.tanggal) e.tanggal = "Pilih tanggal berangkat.";
  else if (f.tanggal < hariIni()) e.tanggal = "Tanggal itu sudah lewat.";
  return e;
}

export default function App() {
  const [pengguna, setPengguna] = useState(() => bacaStorage(KUNCI_PENGGUNA, null));
  const [halaman, setHalaman] = useState(pengguna ? "pesan" : "login"); // login | pesan | tiket
  const [lampu, setLampu] = useState(false);
  const [tersimpan, setTersimpan] = useState(() => {
    const data = bacaStorage(KUNCI_TIKET, []);
    return Array.isArray(data) ? data : [];
  });

  const [form, setForm] = useState(FORM_AWAL);
  const [status, setStatus] = useState("mengisi"); // mengisi | mencetak | selesai
  const [dicoba, setDicoba] = useState(false);
  const [tiket, setTiket] = useState(null);

  const errors = useMemo(() => validasi(form), [form]);
  const kelas = KELAS.find((k) => k.nama === form.kelas) ?? KELAS[0];
  const total = kelas.harga * form.penumpang;

  useEffect(() => {
    tulisStorage(KUNCI_TIKET, tersimpan);
  }, [tersimpan]);

  useEffect(() => {
    tulisStorage(KUNCI_PENGGUNA, pengguna);
  }, [pengguna]);

  useEffect(() => {
    if (status !== "mencetak") return;
    const timer = setTimeout(() => setStatus("selesai"), 2800);
    return () => clearTimeout(timer);
  }, [status]);

  const pindah = (tujuan) => {
    setHalaman(tujuan);
    window.scrollTo(0, 0);
  };

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleReset = () => {
    setForm(FORM_AWAL);
    setStatus("mengisi");
    setDicoba(false);
    setTiket(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDicoba(true);
    if (Object.keys(errors).length > 0) return;

    const baru = buatTiket();
    setTiket(baru);
    setTersimpan((prev) => [
      {
        id: Date.now(),
        nama: form.nama.trim(),
        asal: form.asal.trim(),
        tujuan: form.tujuan.trim(),
        tanggal: form.tanggal,
        jam: form.jam,
        kelas: form.kelas,
        penumpang: form.penumpang,
        total,
        tiket: baru,
      },
      ...prev,
    ]);
    setStatus("mencetak");
  };

  const masuk = (data) => {
    setPengguna(data);
    pindah("pesan");
  };

  const keluar = () => {
    setPengguna(null);
    setLampu(false);
    handleReset();
    pindah("login");
  };

  const hapusTiket = (id) =>
    setTersimpan((prev) => prev.filter((t) => t.id !== id));

  return (
    <>
      <Stasiun terang={halaman !== "login" || lampu} />
      <div className="app">
        <BilahAtas
          halaman={halaman}
          pengguna={pengguna}
          jumlahTiket={tersimpan.length}
          onPindah={pindah}
          onKeluar={keluar}
        />

        {halaman === "login" && (
          <HalamanLogin lampu={lampu} onLampu={setLampu} onMasuk={masuk} />
        )}

        {halaman === "pesan" && (
          <>
            <header className="app__header">
              <p className="eyebrow">Loket 1 · Pemesanan Tiket</p>
              <h1 className="app__judul">Tiket Kereta Api</h1>
              <SplitFlapBoard asal={form.asal} tujuan={form.tujuan} />
            </header>

            <main className="app__main">
              <TicketForm
                form={form}
                errors={dicoba ? errors : {}}
                onChange={handleChange}
                onSubmit={handleSubmit}
                disabled={status !== "mengisi"}
              />
              <TicketPreview
                form={form}
                kelas={kelas}
                total={total}
                tiket={tiket}
                status={status}
                onReset={handleReset}
              />
            </main>
          </>
        )}

        {halaman === "tiket" && (
          <TiketSaya
            daftar={tersimpan}
            onPesan={() => pindah("pesan")}
            onHapus={hapusTiket}
          />
        )}
      </div>
      <TrainAnimation active={status === "mencetak"} />
    </>
  );
}