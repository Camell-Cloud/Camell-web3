export interface Currency {
  value: string;
  label: string;
  imgSrc: string;
}

export const currencies: Currency[] = [
  {
    value: 'TRON',
    label: 'TRON',
    imgSrc: '/crypto/tron.png',
  },
  {
    value: 'USDT',
    label: 'USDT',
    imgSrc: '/crypto/usdt.png',
  },
  {
    value: 'CAMT',
    label: 'CAMT',
    imgSrc: '/crypto/camt.png',
  },
];
