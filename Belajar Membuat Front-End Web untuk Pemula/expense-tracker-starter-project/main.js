/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 */

/* ---------- State & konstanta ---------- */
const STORAGE_KEY = "TRACKER_APP_TRANSACTIONS";
const RENDER_EVENT = "transaction:updated"; // Custom Event (Advanced)

let transactions = [];
let editingId = null; // null = mode "Tambah", selain itu = mode "Edit"
let searchKeyword = "";

let lastGeneratedId = 0;
function generateId() {
  // +new Date() dijamin unik walau dipanggil dua kali dalam milidetik yang sama
  let id = +new Date();
  if (id <= lastGeneratedId) id = lastGeneratedId + 1;
  lastGeneratedId = id;
  return id;
}

function generateTransactionObject(id, title, amount, date, type) {
  return { id, title, amount, date, type };
}

/* ---------- Helper ---------- */
function formatRupiah(number) {
  return "Rp" + Number(number).toLocaleString("id-ID");
}

function typeLabel(type) {
  return type === "income" ? "Pemasukan" : "Pengeluaran";
}

function findTransaction(transactionId) {
  for (const item of transactions) {
    if (item.id === transactionId) return item;
  }
  return null;
}

/* ========================================================
 * Kriteria 2: Web Storage
 * ======================================================== */
function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }
}

function loadDataFromStorage() {
  if (!isStorageExist()) return;
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(data)) transactions = data;
  } catch (error) {
    transactions = [];
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

/* ========================================================
 * Kriteria 1: Form, validasi, render, dasbor
 * ======================================================== */
function validateInput(title, amount) {
  if (title.trim() === "") {
    alert("Judul transaksi tidak boleh kosong.");
    return false;
  }
  if (isNaN(amount) || amount < 1) {
    alert("Nominal transaksi minimal Rp1.");
    return false;
  }
  return true;
}

function resetFormMode() {
  editingId = null;
  document.getElementById("transactionForm").reset();
  document.getElementById("form-heading").textContent = "Tambah Pencatatan Baru";
  document.querySelector(
    '[data-testid="transactionFormSubmitButton"]',
  ).textContent = "Simpan";
}

function submitTransaction() {
  const title = document.getElementById("transactionFormTitleInput").value;
  const amount = Number(
    document.getElementById("transactionFormAmountInput").value,
  );
  const date = document.getElementById("transactionFormDateInput").value;
  const type = document.getElementById("transactionFormTypeSelect").value;

  // Validasi: data tidak disimpan jika tidak valid
  if (!validateInput(title, amount)) return;

  if (editingId !== null) {
    const target = findTransaction(editingId);
    if (target) {
      target.title = title.trim();
      target.amount = amount;
      target.date = date;
      target.type = type;
    }
  } else {
    transactions.push(
      generateTransactionObject(generateId(), title.trim(), amount, date, type),
    );
  }

  saveData();
  resetFormMode();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeButton(label, testId, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.classList.add("tracker-transaction-item__btn");
  button.setAttribute("data-testid", testId);
  button.addEventListener("click", onClick);
  return button;
}

function makeTransaction(transactionObject) {
  const isIncome = transactionObject.type === "income";

  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "tracker-transaction-item__icon");
  icon.classList.add(isIncome ? "fa-arrow-down" : "fa-arrow-up");
  icon.classList.add(
    isIncome
      ? "tracker-transaction-item__icon--income"
      : "tracker-transaction-item__icon--expense",
  );

  const textTitle = document.createElement("h3");
  textTitle.textContent = transactionObject.title;
  textTitle.classList.add("tracker-transaction-item__title");
  textTitle.setAttribute("data-testid", "transactionItemTitle");

  const textAmount = document.createElement("p");
  textAmount.textContent = "Nominal: " + formatRupiah(transactionObject.amount);
  textAmount.classList.add("tracker-transaction-item__amount");
  textAmount.classList.add(
    isIncome
      ? "tracker-transaction-item__amount--income"
      : "tracker-transaction-item__amount--expense",
  );
  textAmount.setAttribute("data-testid", "transactionItemAmount");

  const textDate = document.createElement("p");
  textDate.textContent = "Tanggal: " + transactionObject.date;
  textDate.classList.add("tracker-transaction-item__date");
  textDate.setAttribute("data-testid", "transactionItemDate");

  const textType = document.createElement("p");
  textType.textContent = "Tipe: " + typeLabel(transactionObject.type);
  textType.classList.add("tracker-transaction-item__type");
  textType.classList.add(
    isIncome
      ? "tracker-transaction-item__type--income"
      : "tracker-transaction-item__type--expense",
  );
  textType.setAttribute("data-testid", "transactionItemType");

  const detail = document.createElement("div");
  detail.classList.add("tracker-transaction-item__detail");
  detail.append(textTitle, textDate, textAmount, textType);

  const editTypeButton = makeButton(
    "Ubah Tipe",
    "transactionItemEditTypeButton",
    () => toggleTransactionType(transactionObject.id),
  );
  const editButton = makeButton("Edit", "transactionItemEditButton", () =>
    startEditTransaction(transactionObject.id),
  );
  const deleteButton = makeButton("Hapus", "transactionItemDeleteButton", () =>
    deleteTransaction(transactionObject.id),
  );

  const actions = document.createElement("div");
  actions.classList.add(
    "tracker-transaction-item__right",
    "tracker-transaction-item__actions",
  );
  actions.append(editTypeButton, editButton, deleteButton);

  const card = document.createElement("div");
  card.classList.add("tracker-transaction-item");
  card.id = `transaction-${transactionObject.id}`;
  card.setAttribute("data-testid", "transactionItem");
  card.append(icon, detail, actions);

  return card;
}

function renderTransactions() {
  const incomeList = document.getElementById("incomeList");
  const expenseList = document.getElementById("expenseList");

  incomeList.innerHTML = "";
  expenseList.innerHTML = "";

  const keyword = searchKeyword.trim().toLowerCase();

  for (const item of transactions) {
    // Pencarian: kosong = tampilkan semua
    if (keyword !== "" && !item.title.toLowerCase().includes(keyword)) continue;

    const element = makeTransaction(item);
    if (item.type === "income") incomeList.append(element);
    else if (item.type === "expense") expenseList.append(element);
  }
}

function updateDashboard() {
  let totalIncome = 0;
  let totalExpense = 0;

  // Dasbor selalu menghitung SEMUA transaksi, bukan hasil pencarian
  for (const item of transactions) {
    if (item.type === "income") totalIncome += item.amount;
    else if (item.type === "expense") totalExpense += item.amount;
  }

  const balance = totalIncome - totalExpense;

  document.querySelector(".tracker-summary__balance-amount").textContent =
    (balance < 0 ? "-" : "") + "Rp " + Math.abs(balance).toLocaleString("id-ID");
  document.querySelector(".tracker-summary__stat-amount--income").textContent =
    "Rp " + totalIncome.toLocaleString("id-ID");
  document.querySelector(".tracker-summary__stat-amount--expense").textContent =
    "Rp " + totalExpense.toLocaleString("id-ID");
}

/* Satu listener Custom Event yang memperbarui seluruh tampilan */
document.addEventListener(RENDER_EVENT, function () {
  renderTransactions();
  updateDashboard();
});

/* ========================================================
 * Aksi: Ubah Tipe, Edit, Hapus
 * ======================================================== */
function toggleTransactionType(transactionId) {
  const target = findTransaction(transactionId);
  if (target === null) return;

  target.type = target.type === "income" ? "expense" : "income";

  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function startEditTransaction(transactionId) {
  const target = findTransaction(transactionId);
  if (target === null) return;

  editingId = target.id;
  document.getElementById("transactionFormTitleInput").value = target.title;
  document.getElementById("transactionFormAmountInput").value = target.amount;
  document.getElementById("transactionFormDateInput").value = target.date;
  document.getElementById("transactionFormTypeSelect").value = target.type;
  document.getElementById("form-heading").textContent = "Ubah Pencatatan";
  document.querySelector(
    '[data-testid="transactionFormSubmitButton"]',
  ).textContent = "Simpan Perubahan";

  document
    .getElementById("transactionForm")
    .scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("transactionFormTitleInput").focus();
}

function deleteTransaction(transactionId) {
  let index = -1;
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].id === transactionId) {
      index = i;
      break;
    }
  }
  if (index === -1) return;

  transactions.splice(index, 1);

  // Jika yang dihapus sedang diedit, kembalikan form ke mode Tambah
  if (editingId === transactionId) resetFormMode();

  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

/* ========================================================
 * Event listener halaman
 * ======================================================== */
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("transactionForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      submitTransaction();
    });

  const searchForm = document.getElementById("searchTransactionForm");
  const searchInput = document.getElementById(
    "searchTransactionFormTitleInput",
  );

  // Cari langsung saat mengetik; dikosongkan = semua transaksi muncul lagi
  searchInput.addEventListener("input", function () {
    searchKeyword = searchInput.value;
    document.dispatchEvent(new Event(RENDER_EVENT));
  });

  // Tombol "Cari" / Enter tidak me-reload halaman
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchKeyword = searchInput.value;
    document.dispatchEvent(new Event(RENDER_EVENT));
  });

  loadDataFromStorage();
});
