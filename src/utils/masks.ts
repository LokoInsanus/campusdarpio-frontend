// src/utils/masks.ts

export const maskCPF = (value: string): string => {
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return value;
};

export const maskCNH = (value: string): string => {
  value = value.replace(/\D/g, '');
  if (value.length > 11) {
    value = value.slice(0, 11);
  }
  return value;
};


export const maskPhone = (value: string): string => {
  value = value.replace(/\D/g, '');
  value = value.replace(/^(\d{2})(\d)/, '($1) $2');
  value = value.replace(/(\d{5})(\d)/, '$1-$2');
  return value;
};

export const maskCurrency = (value: string): string => {
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d)(\d{2})$/, '$1,$2');
  value = value.replace(/(?=(\d{3})+(\D))\B/g, '.');
  return `R$ ${value}`;
};