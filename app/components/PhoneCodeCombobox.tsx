import { useState, useMemo, useCallback } from "react";
import { Combobox, Listbox } from "@shopify/polaris";
import type { CountryOption } from "../lib/data/countries";

interface PhoneCodeComboboxProps {
  label: string;
  countries: CountryOption[];
  value: string;
  onChange: (dial: string) => void;
  disabled?: boolean;
}

export function PhoneCodeCombobox({
  label,
  countries,
  value,
  onChange,
  disabled,
}: PhoneCodeComboboxProps) {
  const dialOptions = useMemo(() => {
    return countries
      .filter((c) => c.dial)
      .map((c) => ({
        key: `${c.code}-${c.dial}`,
        code: c.code,
        dial: c.dial,
        flag: c.flag,
        countryName: c.name,
      }));
  }, [countries]);

  // The currently selected dial code (first match wins — e.g. +1 → US, which
  // sorts ahead of Canada via the priority order in getAllCountries()).
  const selected = useMemo(
    () => dialOptions.find((o) => o.dial === value) ?? null,
    [dialOptions, value],
  );

  // Search query the user types. The field is a live search box while focused
  // and shows the current selection when blurred — so you never have to delete
  // the "🇺🇸 +1" text just to look up another country.
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return dialOptions;
    return dialOptions.filter(
      (o) =>
        o.countryName.toLowerCase().includes(q) ||
        o.dial.replace(/^\+/, "").startsWith(q) ||
        o.code.toLowerCase() === q,
    );
  }, [dialOptions, query]);

  const handleSelect = useCallback(
    (selectedKey: string) => {
      const match = dialOptions.find((o) => o.key === selectedKey);
      if (!match) return;
      onChange(match.dial);
      setQuery("");
      setFocused(false);
    },
    [dialOptions, onChange],
  );

  const selectionLabel = selected
    ? `${selected.dial} ${selected.countryName}`
    : "";

  return (
    <Combobox
      activator={
        <Combobox.TextField
          label={label}
          // While focused the field shows what you type; otherwise it shows the
          // current selection.
          value={focused ? query : selectionLabel}
          onChange={setQuery}
          onFocus={() => {
            setFocused(true);
            setQuery("");
          }}
          onBlur={() => setFocused(false)}
          autoComplete="off"
          placeholder={selectionLabel || "Search country or code"}
          prefix={selected?.flag ?? ""}
          disabled={disabled}
        />
      }
    >
      {filtered.length > 0 ? (
        <Listbox onSelect={handleSelect}>
          {filtered.slice(0, 50).map((o) => (
            <Listbox.Option
              key={o.key}
              value={o.key}
              selected={o.dial === value}
            >
              {o.flag} {o.dial} — {o.countryName}
            </Listbox.Option>
          ))}
          {filtered.length > 50 && (
            <Listbox.Action value="__more__" disabled>
              {`Keep typing to narrow (${filtered.length - 50} more...)`}
            </Listbox.Action>
          )}
        </Listbox>
      ) : (
        <Listbox>
          <Listbox.Option value="__no_match__" disabled>
            No matching country
          </Listbox.Option>
        </Listbox>
      )}
    </Combobox>
  );
}
