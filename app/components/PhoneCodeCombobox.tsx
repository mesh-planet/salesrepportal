import { useState, useMemo, useCallback, useEffect } from "react";
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
        dial: c.dial,
        flag: c.flag,
        countryName: c.name,
      }));
  }, [countries]);

  const initialDisplay = useMemo(() => {
    if (!value) return "";
    const first = dialOptions.find((o) => o.dial === value);
    return first ? `${first.flag} ${first.dial}` : value;
  }, [value, dialOptions]);

  const [inputValue, setInputValue] = useState(initialDisplay);

  useEffect(() => {
    setInputValue(initialDisplay);
  }, [initialDisplay]);

  const filtered = useMemo(() => {
    if (!inputValue || inputValue === initialDisplay) return dialOptions;
    const lower = inputValue.toLowerCase().replace(/^\+/, "");
    return dialOptions.filter(
      (o) =>
        o.dial.replace(/^\+/, "").startsWith(lower) ||
        o.countryName.toLowerCase().includes(lower) ||
        o.flag.includes(inputValue)
    );
  }, [dialOptions, inputValue, initialDisplay]);

  const handleSelect = useCallback(
    (selectedKey: string) => {
      const match = dialOptions.find((o) => o.key === selectedKey);
      if (!match) return;
      onChange(match.dial);
      setInputValue(`${match.flag} ${match.dial}`);
    },
    [dialOptions, onChange]
  );

  return (
    <Combobox
      activator={
        <Combobox.TextField
          label={label}
          value={inputValue}
          onChange={setInputValue}
          autoComplete="off"
          placeholder="+1"
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
        </Listbox>
      ) : null}
    </Combobox>
  );
}
