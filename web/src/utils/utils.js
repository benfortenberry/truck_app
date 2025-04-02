export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function currencyFormat(num) {
  if (num) {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  } else {
    return "$0.00";
  }
}

export function expenseTypeFormat(id, expenseTypes) {
  let expenseType = expenseTypes.find((item) => item.id === id);
  return expenseType ? expenseType.name : "Unknown";
}
