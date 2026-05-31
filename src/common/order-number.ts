export function createOrderNumber() {
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `FM-${suffix}`;
}

export function createConfirmationNumber() {
  const year = new Date().getFullYear();
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `BK-${year}-${suffix}`;
}
