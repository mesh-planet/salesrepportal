import { useState, useMemo, useCallback, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { Combobox, Listbox, TextField } from "@shopify/polaris";
import type { ZoneOption } from "../lib/data/countries";

interface ZoneComboboxProps {
  label: string;
  countryCode: string;
  value: string;
  onChange: (zoneCode: string) => void;
  disabled?: boolean;
}

export function ZoneCombobox({
  label,
  countryCode,
  value,
  onChange,
  disabled,
}: ZoneComboboxProps) {
  const fetcher = useFetcher<{ zones: ZoneOption[] }>();
  const [zones, setZones] = useState<ZoneOption[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!countryCode) {
      setZones([]);
      setHasLoaded(false);
      return;
    }
    setHasLoaded(false);
    fetcher.load(`/api/zones/${countryCode}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setZones(fetcher.data.zones ?? []);
      setHasLoaded(true);
    }
  }, [fetcher.state, fetcher.data]);

  const selected = useMemo(() => zones.find((z) => z.code === value), [zones, value]);

  const [inputValue, setInputValue] = useState(selected?.name ?? value);

  useEffect(() => {
    setInputValue(selected?.name ?? value);
  }, [selected, value]);

  const filtered = useMemo(() => {
    if (!inputValue || inputValue === selected?.name) return zones;
    const lower = inputValue.toLowerCase();
    return zones.filter(
      (z) =>
        z.name.toLowerCase().includes(lower) ||
        z.code.toLowerCase().startsWith(lower)
    );
  }, [zones, inputValue, selected]);

  const handleSelect = useCallback(
    (zoneCode: string) => {
      const match = zones.find((z) => z.code === zoneCode);
      onChange(zoneCode);
      setInputValue(match?.name ?? "");
    },
    [zones, onChange]
  );

  // Free-text fallback when country has no zones in our data
  if (hasLoaded && zones.length === 0) {
    return (
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        autoComplete="address-level1"
        disabled={disabled}
        helpText={countryCode ? "No subdivisions found for this country — enter manually if required." : undefined}
      />
    );
  }

  const isLoading = fetcher.state === "loading";

  return (
    <Combobox
      activator={
        <Combobox.TextField
          label={label}
          value={inputValue}
          onChange={(next) => {
            setInputValue(next);
            if (!next) onChange("");
          }}
          autoComplete="off"
          placeholder={isLoading ? "Loading..." : "Search state/region..."}
          disabled={disabled || !countryCode || isLoading}
        />
      }
    >
      {filtered.length > 0 ? (
        <Listbox onSelect={handleSelect}>
          {filtered.slice(0, 50).map((z) => (
            <Listbox.Option key={z.code} value={z.code} selected={z.code === value}>
              {z.name}
            </Listbox.Option>
          ))}
        </Listbox>
      ) : null}
    </Combobox>
  );
}
