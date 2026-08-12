export interface FormattedUnitOption {
  value: string;
  labelBn: string;
  labelEn: string;
  price: number;
  mrp: number;
  stock: number;
  baseUnitQty: number;
}

export function formatUnitLabel(unitStr: string, isBn: boolean, baseUnitQty = 1): string {
  const u = (unitStr || 'pcs').toLowerCase();
  if (isBn) {
    if (u === 'pcs' || u === 'piece') return 'পিস';
    if (u === 'strip') return 'পাতা';
    if (u === 'box') return baseUnitQty > 1 ? `বক্স (${baseUnitQty} পিস)` : 'বক্স';
    if (u === 'pack') return baseUnitQty > 1 ? `${baseUnitQty}টির প্যাক` : 'প্যাক';
    if (u === 'bottle') return 'বোতল';
    if (u === 'tube') return 'টিউব';
    if (u === 'gm') return 'গ্রাম';
    if (u === 'ml') return 'মিলি';
    return unitStr || 'পিস';
  } else {
    if (u === 'pcs' || u === 'piece') return 'Piece';
    if (u === 'strip') return 'Strip';
    if (u === 'box') return baseUnitQty > 1 ? `Box (${baseUnitQty} pcs)` : 'Box';
    if (u === 'pack') return baseUnitQty > 1 ? `${baseUnitQty}'s Pack` : 'Pack';
    if (u === 'bottle') return 'Bottle';
    if (u === 'tube') return 'Tube';
    if (u === 'gm') return 'Gm';
    if (u === 'ml') return 'Ml';
    return unitStr || 'Piece';
  }
}

export function getProductUnitOptions(product: any): FormattedUnitOption[] {
  const rawOptions = (product as any).packaging || product.unitPrices;
  const totalStock = Number(product.stockCount || product.stockCached || product.stock || 0);
  const basePrice = Number(product.price || 0);
  const baseMrp = Number(product.mrp || product.price || 0);

  if (Array.isArray(rawOptions) && rawOptions.length > 0) {
    return rawOptions.map((u: any) => {
      const baseQty = Number(u.baseUnitQty || u.multiplier || 1);
      const unitVal = u.unit || 'pcs';
      const labelBn = u.unitLabelBn || formatUnitLabel(unitVal, true, baseQty);
      const labelEn = u.unitLabelEn || formatUnitLabel(unitVal, false, baseQty);
      return {
        value: unitVal,
        labelBn,
        labelEn,
        price: Number(u.price || basePrice),
        mrp: Number(u.mrp || u.price || baseMrp),
        stock: u.stock !== undefined ? Number(u.stock) : Math.floor(totalStock / baseQty),
        baseUnitQty: baseQty,
      };
    });
  }

  // Fallback smart packaging generation based on dosage form or unitType
  const dosage = (product.dosageForm || '').toLowerCase();
  const name = (product.name || product.nameEn || '').toLowerCase();
  const isSalineOrPowder = dosage === 'saline' || dosage === 'powder' || name.includes('saline') || name.includes('fruity') || name.includes('smc');

  if (isSalineOrPowder) {
    return [
      {
        value: 'pcs',
        labelBn: 'পিস',
        labelEn: 'Piece',
        price: basePrice,
        mrp: baseMrp,
        stock: totalStock,
        baseUnitQty: 1,
      },
      {
        value: 'pack',
        labelBn: '২৫টির প্যাক',
        labelEn: "25's Pack",
        price: basePrice * 25,
        mrp: baseMrp * 25,
        stock: Math.floor(totalStock / 25),
        baseUnitQty: 25,
      },
    ];
  }

  if (dosage === 'tablet' || dosage === 'capsule' || product.unitType === 'strip') {
    return [
      {
        value: 'pcs',
        labelBn: 'পিস',
        labelEn: 'Piece',
        price: basePrice,
        mrp: baseMrp,
        stock: totalStock,
        baseUnitQty: 1,
      },
      {
        value: 'strip',
        labelBn: 'পাতা',
        labelEn: 'Strip',
        price: basePrice * 10,
        mrp: baseMrp * 10,
        stock: Math.floor(totalStock / 10),
        baseUnitQty: 10,
      },
      {
        value: 'box',
        labelBn: 'বক্স (১০০ পিস)',
        labelEn: 'Box (100 pcs)',
        price: basePrice * 100,
        mrp: baseMrp * 100,
        stock: Math.floor(totalStock / 100),
        baseUnitQty: 100,
      },
    ];
  }

  return [
    {
      value: product.unit || product.unitType || 'pcs',
      labelBn: formatUnitLabel(product.unit || product.unitType || 'pcs', true, 1),
      labelEn: formatUnitLabel(product.unit || product.unitType || 'pcs', false, 1),
      price: basePrice,
      mrp: baseMrp,
      stock: totalStock,
      baseUnitQty: 1,
    },
  ];
}
