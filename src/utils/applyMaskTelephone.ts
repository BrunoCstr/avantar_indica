export function applyMaskTelephone(num: string) {
  const nums = num.replace(/\D/g, '');

  if (nums.length === 11) {
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
  } else {
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
  }

  return num;
}
