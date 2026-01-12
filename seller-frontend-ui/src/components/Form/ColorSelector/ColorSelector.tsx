import { Controller, type Control } from "react-hook-form";
import { Field, FieldLabel } from "../../ui/field";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { TProductFormData } from "@/pages/CreateProduct/CreateProduct";
import { Button } from "../../ui/button";

const PRESET_COLORS = [
  "#000000",
  "#FFFFFF",
  "#6B7280",
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#84CC16",
  "#22C55E",
  "#10B981",
  "#14B8A6",
  "#06B6D4",
  "#0EA5E9",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#A855F7",
  "#D946EF",
  "#EC4899",
  "#F43F5E",
];

export default function ColorSelector({
  control,
}: {
  control: Control<TProductFormData>;
}) {
  const [customColor, setCustomColor] = useState("#3B82F6");
  const [showCustomColorState, setShowCustomColorState] = useState(false);

  const getContrastColor = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#FFFFFF";
  };

  const isValidHex = (hex: string): boolean => {
    return /^#[0-9A-Fa-f]{6}$/.test(hex);
  };

  return (
    <div className="w-full flex items-center justify-center">
      {/* Color Selector */}
      <Controller
        name="colors"
        control={control}
        render={({ field }) => {
          const colors = field.value ?? [];

          const handleToggle = (hex: string) => {
            if (colors.includes(hex)) {
              field.onChange(colors.filter((c) => c !== hex));
            } else {
              field.onChange([...colors, hex]);
            }
          };

          const handleAddCustom = () => {
            if (isValidHex(customColor) && !colors.includes(customColor)) {
              field.onChange([...colors, customColor]);
            }
          };

          const customColors = colors.filter((c) => !PRESET_COLORS.includes(c));

          return (
            <div className="space-y-6">
              {/* Preset Colors */}
              <div>
                <Field className="mb-3">
                  <FieldLabel htmlFor="colors">Colors</FieldLabel>
                </Field>
                <div className="flex flex-wrap gap-3">
                  {PRESET_COLORS.map((hex) => {
                    const isSelected = colors.includes(hex);

                    return (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => handleToggle(hex)}
                        className={`
                              relative aspect-square rounded-lg transition-all duration-200 size-8
                              ${
                                isSelected
                                  ? "ring-2 ring-primary ring-offset-2 ring-offset-gray-800 scale-105"
                                  : "hover:scale-105 hover:ring-2 hover:ring-gray-600 hover:ring-offset-2 hover:ring-offset-gray-800"
                              }
                            `}
                        style={{ backgroundColor: hex }}
                        title={hex}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className="rounded-full p-0.5"
                              style={{
                                backgroundColor: getContrastColor(hex),
                              }}
                            >
                              <Check
                                className="size-2.5"
                                color={hex}
                                strokeWidth={3}
                              />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setShowCustomColorState(!showCustomColorState)
                    }
                    type="button"
                    className="cursor-pointer p-1 bg-gray-900 rounded-lg transition-all duration-200 size-8
                              hover:scale-105 hover:ring-2 hover:ring-gray-600 hover:ring-offset-2 hover:ring-offset-gray-800
                              "
                  >
                    <Plus className="text-xl" />
                  </button>
                </div>
              </div>

              {showCustomColorState && (
                <div className="transition-all duration-200">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Custom Color
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 flex gap-3 bg-gray-750 rounded-lg p-1 border border-gray-700">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById("colorPicker")?.click()
                          }
                          className="size-8 rounded-lg border-2 border-gray-600 hover:border-primary transition-all shrink-0 shadow-inner cursor-pointer"
                          style={{ backgroundColor: customColor }}
                          title="Pick a color"
                        />
                        <input
                          id="colorPicker"
                          type="color"
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          className="absolute top-0 left-0 opacity-0 pointer-events-none"
                          style={{ width: "32px", height: "32px" }}
                        />
                      </div>

                      <div className="flex-1 flex items-center">
                        <input
                          type="text"
                          value={customColor}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                              setCustomColor(val);
                            }
                          }}
                          onBlur={(e) => {
                            const val = e.target.value;
                            if (!isValidHex(val)) {
                              setCustomColor("#3B82F6");
                            }
                          }}
                          maxLength={7}
                          className="w-full bg-transparent text-white font-mono text-sm focus:outline-none"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    <Button
                      size="lg"
                      type="button"
                      onClick={handleAddCustom}
                      disabled={
                        !isValidHex(customColor) || colors.includes(customColor)
                      }
                      className="p-4 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      <Plus size={18} />
                      Add
                    </Button>
                  </div>
                  {!isValidHex(customColor) && customColor.length > 0 && (
                    <p className="text-xs text-red-400 mt-1">
                      Please enter a valid 6-character hex color (e.g., #FF5733)
                    </p>
                  )}
                </div>
              )}

              {/* Custom Colors List */}
              {customColors.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Added Custom Colors
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {customColors.map((hex) => {
                      const isSelected = colors.includes(hex);
                      return (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => handleToggle(hex)}
                          className={`
                              relative aspect-square rounded-lg transition-all duration-200 size-8
                              ${
                                isSelected
                                  ? "ring-2 ring-primary ring-offset-2 ring-offset-gray-800 scale-105"
                                  : "hover:scale-105 hover:ring-2 hover:ring-gray-600 hover:ring-offset-2 hover:ring-offset-gray-800"
                              }
                            `}
                          style={{ backgroundColor: hex }}
                          title={hex}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div
                                className="rounded-full p-0.5"
                                style={{
                                  backgroundColor: getContrastColor(hex),
                                }}
                              >
                                <Check
                                  className="size-2.5"
                                  color={hex}
                                  strokeWidth={3}
                                />
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
