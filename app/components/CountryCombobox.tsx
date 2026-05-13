import { useState, useMemo, useCallback, useEffect } from "react";
import { Combobox, Listbox, Icon } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import type { CountryOption } from "../lib/data/countries";

interface CountryComboboxProps {
  label: string;
  countries: CountryOption[];
  value: string;
  onChange: (countryCode: string) => void;
  requiredIndicator?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function CountryCombobox({
  label,
  countries,
  value,
  onChange,
  requiredIndicator,
  disabled,
  placeholder = "Search countries...",
}: CountryComboboxProps) {
  const selected = useMemo(
    () => countries.find((c) => c.code === value),
    [countries, value]
  );

  const [inputValue, setInputValue] = useState(selected?.name ?? "");

  useEffect(() => {
    setInputValue(selected?.name ?? "");
  }, [selected]);

  const filteredCountries = useMemo(() => {
    if (!inputValue || inputValue === selected?.name) return countries;
    const lower = inputValue.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.code.toLowerCase().startsWith(lower)
    );
  }, [countries, inputValue, selected]);

  const handleSelect = useCallback(
    (selectedCode: string) => {
      const match = countries.find((c) => c.code === selectedCode);
      onChange(selectedCode);
      setInputValue(match?.name ?? "");
    },
    [countries, onChange]
  );

  const handleInputChange = useCallback(
    (next: string) => {
      setInputValue(next);
      if (!next) onChange("");
    },
    [onChange]
  );

  return (
    <Combobox
      activator={
        <Combobox.TextField
          label={label}
          value={inputValue}
          onChange={handleInputChange}
          autoComplete="off"
          placeholder={placeholder}
          requiredIndicator={requiredIndicator}
          disabled={disabled}
          prefix={<Icon source={SearchIcon} />}
        />
      }
    >
      {filteredCountries.length > 0 ? (
        <Listbox onSelect={handleSelect}>
          {filteredCountries.slice(0, 50).map((c) => (
            <Listbox.Option
              key={c.code}
              value={c.code}
              selected={c.code === value}
            >
              {c.flag} {c.name}
            </Listbox.Option>
          ))}
          {filteredCountries.length > 50 && (
            <Listbox.Action value="__more__" disabled>
              {`Refine search (${filteredCountries.length - 50} more...)`}
            </Listbox.Action>
          )}
        </Listbox>
      ) : null}
    </Combobox>
  );
}
