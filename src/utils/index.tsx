export const formatWallet = (address: any) => {
  if (!address) return '';
  return `${address?.slice(0, 5)}...${address?.slice(-4)}`;
};

export const handleCopy = async (text: string, setCopied: any) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

export const formatDecimal = (value: number) => {
  if (Number.isInteger(value)) {
    return value.toString();
  } else {
    return parseFloat(value?.toFixed(3)).toString();
  }
};

export const formatToken = (value: BigInt, decimals: number = 18) => {
  const formattedValue = Number(value) / Math.pow(10, decimals);
  return formatDecimal(formattedValue);
};

export const formatStarknet: any = (address: any) => {
  if (!address) return '';
  return (
    address.split('x')[0] +
    'x' +
    '0'.repeat(66 - address.length) +
    address.split('x')[1]
  );
};

export const feltToInt = ({ low, high }: any) => {
  return Number((BigInt(high) << BigInt(64)) + BigInt(low));
};

export const rankMapping: any = (item: any) => {
  switch (item) {
    case 0:
      return {
        bg: '#0538BD',
        rank: 'B',
      };
    case 1:
      return {
        bg: '#1BCE51',
        rank: 'A',
      };
    case 2:
      return {
        bg: '#EA3F28',
        rank: 'A',
      };
    default:
      return 'black';
  }
};
