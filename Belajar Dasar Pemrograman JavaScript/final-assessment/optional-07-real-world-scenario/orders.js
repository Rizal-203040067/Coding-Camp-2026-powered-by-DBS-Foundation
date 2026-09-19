// Gunakan fungsi di bawah ini untuk menghasilkan id yang unik
function generateUniqueId() {
  return `_${Math.random().toString(36).slice(2, 9)}`;
}

// TODO: buatlah variabel yang menampung data orders
let orders = [
  {
    id: generateUniqueId(),
    customerName: "Ujang",
    items: [
      { name: "Mie Ayam", price: 15000 },
      { name: "Es Teh Manis", price: 6000 },
    ],
    totalPrice: 21000,
    status: "Menunggu",
  },
];

// TODO: selesaikan fungsi addOrder
function addOrder(customerName, items) {
  const newOrder = {
    id: generateUniqueId(),
    customerName,
    items,
    totalPrice: items.reduce((total, item) => total + item.price, 0),
    status: "Menunggu",
  };
  orders.push(newOrder);
}

// TODO: selesaikan fungsi updateOrderStatus
function updateOrderStatus(orderId, status) {
  const order = orders.find((order) => order.id === orderId);
  if (order) {
    order.status = status;
  }
}

// TODO: selesaikan fungsi calculateTotalRevenue dari order yang berstatus Selesai
function calculateTotalRevenue() {
  return orders
    .filter((order) => order.status === "Selesai")
    .reduce((total, order) => total + order.totalPrice, 0);
}

// TODO: selesaikan fungsi deleteOrder
function deleteOrder(id) {
  const orderIndex = orders.findIndex((order) => order.id === id);
  if (orderIndex !== -1) {
    orders.splice(orderIndex, 1);
  }
}

export {
  orders,
  addOrder,
  updateOrderStatus,
  calculateTotalRevenue,
  deleteOrder,
};
