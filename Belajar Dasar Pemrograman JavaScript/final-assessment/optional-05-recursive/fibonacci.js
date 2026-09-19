function fibonacci(n) {
  const result = [];

  for (let i = 0; i <= n; i++) {
    if (i === 0) {
      result.push(0);
    } else if (i === 1) {
      result.push(1);
    } else {
      const nextValue = result[i - 1] + result[i - 2];
      result.push(nextValue);
    }
  }
  return result;
}

// Jangan hapus kode di bawah ini!
export default fibonacci;
