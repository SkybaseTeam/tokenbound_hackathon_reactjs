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
        rank: 'S',
      };
    default:
      return 'black';
  }
};

export const deepEqual = (obj1: any, obj2: any) => {
  if (obj1 === obj2) {
    return true;
  }

  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};

export const tbaPowerBg = (power: any) => {
  if (power >= 10 && power <= 50) {
    return '#0538BD';
  } else if (power >= 51 && power <= 100) {
    return '#1BCE51';
  } else if (power >= 101 && power <= 150) {
    return '#EA3F28';
  }
};
