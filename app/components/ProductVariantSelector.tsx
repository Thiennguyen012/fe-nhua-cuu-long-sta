"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductVariant, ProductVariantGroup } from "../models/product.model";

type Props = {
  groups: ProductVariantGroup[];
  variants: ProductVariant[];
  isContactPrice: boolean;
  onVariantChange?: (variant: ProductVariant | null) => void;
};

const formatMoney = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

export function ProductVariantSelector({ groups, variants, isContactPrice, onVariantChange }: Props) {
  const activeGroups = useMemo(
    () =>
      groups
        .filter((group) => group.options.some((option) => option.is_active))
        .sort((a, b) => a.sort_order - b.sort_order),
    [groups]
  );
  const sellableVariants = useMemo(
    () => variants.filter((variant) => variant.is_active && variant.stock > 0),
    [variants]
  );
  const [selected, setSelected] = useState<Record<number, number>>({});

  const matchingVariants = useMemo(
    () =>
      sellableVariants.filter((variant) =>
        Object.entries(selected).every(([, optionId]) =>
          variant.options.some((option) => option.id === optionId)
        )
      ),
    [selected, sellableVariants]
  );

  const selectedVariant =
    activeGroups.length > 0 &&
    Object.keys(selected).length === activeGroups.length &&
    matchingVariants.length === 1
      ? matchingVariants[0]
      : null;

  useEffect(() => {
    onVariantChange?.(selectedVariant);
  }, [selectedVariant, onVariantChange]);

  const displayedVariants = matchingVariants.length ? matchingVariants : sellableVariants;
  const prices = displayedVariants
    .filter((variant) => !variant.is_contact_price)
    .map((variant) => Number(variant.price))
    .filter(Number.isFinite);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;
  const priceLabel = isContactPrice || selectedVariant?.is_contact_price
    ? "Liên hệ"
    : selectedVariant
    ? formatMoney(Number(selectedVariant.price))
    : minPrice === null
    ? "Liên hệ"
    : minPrice === maxPrice
    ? `Từ ${formatMoney(minPrice)}`
    : `${formatMoney(minPrice)} – ${formatMoney(maxPrice!)}`;

  const isOptionAvailable = (groupId: number, optionId: number) => {
    const tentative = { ...selected, [groupId]: optionId };
    return sellableVariants.some((variant) =>
      Object.entries(tentative).every(([, selectedOptionId]) =>
        variant.options.some((option) => option.id === selectedOptionId)
      )
    );
  };

  const selectOption = (groupId: number, optionId: number) => {
    if (!isOptionAvailable(groupId, optionId)) return;
    setSelected((current) =>
      current[groupId] === optionId
        ? Object.fromEntries(Object.entries(current).filter(([key]) => Number(key) !== groupId))
        : { ...current, [groupId]: optionId }
    );
  };

  if (!activeGroups.length || !variants.length)
    return <p className="mt-6 text-3xl font-normal tracking-[-.02em] text-brand">Liên hệ</p>;

  return (
    <div className="mt-6">
      <div>
        <p className="text-3xl font-normal tracking-[-.02em] text-brand">{priceLabel}</p>
        {selectedVariant ? (
          <p className="mt-1 text-xs text-slate-500">
            SKU: {selectedVariant.sku || "—"} · Còn {selectedVariant.stock} sản phẩm
          </p>
        ) : (
          <p className="mt-1 text-xs text-slate-500">
            {Object.keys(selected).length
              ? `Đã chọn ${Object.keys(selected).length}/${activeGroups.length} thuộc tính`
              : "Chọn phân loại để xem giá chính xác"}
          </p>
        )}
      </div>
      <div className="mt-6 space-y-5">
        {activeGroups.map((group) => (
          <div key={group.id} className="grid gap-3 sm:grid-cols-[108px_1fr]">
            <p className="pt-2 text-sm font-semibold text-slate-600">{group.group_name}</p>
            <div className="flex flex-wrap gap-2">
              {group.options
                .filter((option) => option.is_active)
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((option) => {
                  const available = isOptionAvailable(group.variant_group_id, option.id);
                  const isSelected = selected[group.variant_group_id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={!available}
                      onClick={() => selectOption(group.variant_group_id, option.id)}
                      aria-pressed={isSelected}
                      className={`relative min-w-20 rounded-lg border px-4 py-2 text-sm transition ${
                        isSelected
                          ? "border-brand bg-sky-50 font-bold text-brand ring-1 ring-brand"
                          : available
                          ? "border-slate-200 bg-white text-slate-600 hover:border-brand hover:text-brand"
                          : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through"
                      }`}
                    >
                      {option.option_name}
                      {isSelected && (
                        <span className="absolute bottom-0 right-0 grid size-4 place-items-center rounded-tl-md bg-brand text-[9px] text-white">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      {Object.keys(selected).length === activeGroups.length && !selectedVariant && (
        <p className="mt-4 text-xs font-medium text-red-500">
          Tổ hợp này hiện không khả dụng. Vui lòng chọn phân loại khác.
        </p>
      )}
    </div>
  );
}
