/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Tulis seluruh kode JavaScript kamu di sini.
 */

// TODO [Basic] Buat variabel array untuk menyimpan semua data transaksi, contoh: let transactions = []
// TODO [Basic] Buat fungsi untuk menghasilkan ID unik secara otomatis, contoh: gunakan +new Date()
function generateId() {
  return +new Date();
}

let transactions = [];

/**
 * ========================================================
 * Kriteria 1: Memanipulasi DOM untuk Form dan Daftar Transaksi
 * ========================================================
 */
// TODO [Basic] Ambil elemen kontainer incomeList dan expenseList dari DOM
function addTransaction() {
  const getTitle = document.getElementById("transactionFormTitleInput").value;
  const getAmount = document.getElementById("transactionFormAmountInput").value;
  const getDate = document.getElementById("transactionFormDateInput").value;
  const getype = document.getElementById("transactionFormTypeSelect").value;

  const generateID = generateId();
  const transactionObject = generateTransactionObject(
    generateID,
    getTitle,
    getAmount,
    getDate,
    getype,
  );
  transactions.push(transactionObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

/**
 * TODO [Basic]:
 * Buat fungsi untuk menampilkan (render) semua transaksi ke layar:
 *  - Kosongkan kontainer terlebih dahulu sebelum mengisi ulang
 *  - Gunakan perulangan, buat setiap elemen kartu dengan document.createElement()
 *  - Pastikan setiap elemen memiliki atribut data-testid yang sesuai (lihat panduan di rubrik)
 *  - Masukkan kartu ke kontainer yang tepat: income → incomeList, expense → expenseList
 */
const RENDER_EVENT = "render-transaction";

function generateTransactionObject(id, title, amount, date, type) {
  return {
    id,
    title,
    amount,
    date,
    type,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const incomeList = document.getElementById("incomeList");
  const expenseList = document.getElementById("expenseList");

  if (incomeList) incomeList.innerHTML = "";
  if (expenseList) expenseList.innerHTML = "";

  for (const transactionItem of transactions) {
    const transactionElement = makeTransaction(transactionItem);

    if (transactionItem.type === "income") {
      if (incomeList) incomeList.append(transactionElement);
    } else if (transactionItem.type === "expense") {
      if (expenseList) expenseList.append(transactionElement);
    }
  }
});

function makeTransaction(transactionObject) {
  const transactionIcon = document.createElement("i");
  transactionIcon.classList.add("fa-solid");
  transactionIcon.classList.add("fa-piggy-bank");
  transactionIcon.classList.add("tracker-transaction-item__icon");

  const textTitle = document.createElement("h3");
  textTitle.innerText = transactionObject.title;
  textTitle.classList.add("tracker-transaction-item__title");
  textTitle.setAttribute("data-testid", "transactionItemTitle");

  const textAmount = document.createElement("p");
  textAmount.innerText = "Nominal: Rp " + transactionObject.amount;
  textAmount.classList.add("tracker-transaction-item__amount");
  textAmount.setAttribute("data-testid", "transactionItemAmount");

  const textDate = document.createElement("p");
  textDate.innerText = "Tanggal: " + transactionObject.date;
  textDate.classList.add("tracker-transaction-item__date");
  textDate.setAttribute("data-testid", "transactionItemDate");

  const textType = document.createElement("p");
  textType.innerText = "Tipe: " + transactionObject.type;
  textType.classList.add("tracker-transaction-item__type");
  textType.setAttribute("data-testid", "transactionItemType");

  const transactionDetail = document.createElement("div");
  transactionDetail.classList.add("tracker-transaction-item__detail");
  transactionDetail.append(textTitle, textDate, textAmount, textType);

  const transactionEditType = document.createElement("btn");
  // transactionEditType.innerText = "Ubah Tipe";
  transactionEditType.classList.add("tracker-transaction-item__btn");
  transactionEditType.classList.add("tracker-transaction-item__btn:hover");
  transactionEditType.setAttribute(
    "data-testid",
    "transactionItemEditTypeButton",
  );
  if (transactionObject.type === "income") {
    transactionEditType.innerText = "Ubah Expense";

    transactionEditType.addEventListener("click", function () {
      editTypeToExpense(transactionObject.id);
    });
  } else {
    transactionEditType.innerText = "Ubah Income";

    transactionEditType.addEventListener("click", function () {
      editTypeToIncome(transactionObject.id);
    });
  }

  const transactionDelete = document.createElement("btn");
  transactionDelete.innerText = "Hapus";
  transactionDelete.classList.add("tracker-transaction-item__btn");
  transactionDelete.classList.add("tracker-transaction-item__btn:hover");
  transactionDelete.setAttribute("data-testid", "transactionItemDeleteButton");
  transactionDelete.addEventListener("click", function () {
    deleteTransaction(transactionObject.id);
  });

  const transactionButton = document.createElement("div");
  transactionButton.classList.add("tracker-transaction-item__right");
  transactionButton.classList.add("tracker-transaction-item__actions");
  transactionButton.append(transactionEditType, transactionDelete);

  const transactionListItem = document.createElement("div");
  transactionListItem.classList.add("tracker-transaction-item");
  transactionListItem.append(
    transactionIcon,
    transactionDetail,
    transactionButton,
  );
  transactionListItem.setAttribute("id", `transaction-${transactionObject.id}`);
  transactionListItem.setAttribute("data-testid", "transactionItem");

  return transactionListItem;
}

// TODO [Basic] Tambahkan event listener 'submit' pada form, panggil e.preventDefault() di dalamnya
// TODO [Basic] Di dalam handler submit, ambil nilai input lalu tambahkan sebagai objek transaksi baru ke array
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("transactionForm");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTransaction();
  });
});

/**
 * TODO [Skilled]:
 * Tambahkan validasi input sebelum menyimpan data:
 *  - Tampilkan alert() dan hentikan proses jika judul kosong
 *  - Tampilkan alert() dan hentikan proses jika nominal kurang dari 1
 */

/**
 * TODO [Advanced]:
 * Setiap kali data transaksi berubah, perbarui Panel Dasbor:
 *  - Hitung total pemasukan, total pengeluaran, dan saldo (pemasukan - pengeluaran)
 *  - Tampilkan hasilnya ke elemen yang sesuai di HTML
 */

/**
 * ========================================================
 * Kriteria 2: Mengelola Penyimpanan Data (Web Storage API)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Data transaksi disimpan ke localStorage menggunakan JSON.stringify(), dan dimuat kembali saat halaman dibuka menggunakan JSON.parse().
 *  - Tombol "Hapus" berfungsi: transaksi yang dihapus langsung hilang dari layar dan dari localStorage.
 */

/**
 * TODO [Skilled]:
 * Tombol "Edit" berfungsi: saat ditekan, formulir (#transactionForm) secara otomatis terisi dengan data transaksi yang dipilih.
 *  - Pengguna dapat mengubah data lalu menyimpan perubahan.
 *  - Formulir kembali ke mode "Tambah" setelah pembaruan selesai.
 */

/**
 * TODO [Advanced]:
 * Gunakan Custom Event sebagai penghubung antara perubahan data dan pembaruan tampilan:
 *  - Kirim sinyal dengan document.dispatchEvent(new Event('transaction:updated')) setiap kali data berubah
 *  - Pasang satu listener untuk event tersebut yang memanggil fungsi render dan update dasbor
 */

/**
 * ========================================================
 * Kriteria 3: Fitur Interaktif (Pindah Kategori dan Pencarian)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Tambahkan tombol "Ubah Tipe" pada setiap kartu transaksi:
 *  - Saat diklik, ubah tipe transaksi: 'income' → 'expense' atau 'expense' → 'income'
 *  - Simpan perubahan ke localStorage dan perbarui tampilan
 */
function editTypeToExpense(transactionId) {
  const transactionTarget = findTransaction(transactionId);

  if (transactionTarget == null) return;

  transactionTarget.type = "expense";
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function editTypeToIncome(transactionId) {
  const transactionTarget = findTransaction(transactionId);

  if (transactionTarget == null) return;

  transactionTarget.type = "income";
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTransaction(TransactionId) {
  for (const transactionItem of transactions) {
    if (transactionItem.id === TransactionId) {
      return transactionItem;
    }
  }
  return null;
}

/**
 * TODO [Skilled]:
 * Tambahkan event listener 'input' pada kolom pencarian:
 *  - Filter array transaksi berdasarkan kecocokan kata kunci dengan judul transaksi
 *  - Tampilkan hanya transaksi yang judulnya mengandung kata kunci tersebut
 */

/**
 * TODO [Advanced]:
 * Pastikan fitur pencarian berjalan dengan baik di semua kondisi:
 *  - Saat kolom pencarian dikosongkan, tampilkan kembali seluruh daftar transaksi
 */
