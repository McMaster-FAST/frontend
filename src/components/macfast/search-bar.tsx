"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import { debounce } from "lodash";

interface SearchBarProps {
  value?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export function SearchBar({
  value = "",
  onSearch,
  placeholder = "Search...",
  className,
  debounceMs = 500,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useMemo(
    () => debounce(onSearch, debounceMs),
    [onSearch, debounceMs],
  );

  useEffect(
    () => () => {
      debouncedSearch.cancel();
    },
    [debouncedSearch],
  );

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleClear = useCallback(() => {
    debouncedSearch.cancel();
    setInputValue("");
    onSearch("");
  }, [debouncedSearch, onSearch]);

  return (
    <div className={className}>
      <InputGroup
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("button")) return;
          inputRef.current?.focus();
        }}
      >
        <InputGroupAddon align="inline-start" className="pointer-events-none">
          <Search className="h-4 w-4" />
        </InputGroupAddon>
        <InputGroupInput
          ref={inputRef}
          className="text-sm"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            const nextValue = e.target.value;
            setInputValue(nextValue);
            debouncedSearch(nextValue);
          }}
        />
        {inputValue.length > 0 && (
          <InputGroupAddon align="inline-end" className="ml-auto">
            <InputGroupButton
              size="icon-xs"
              variant="tertiary"
              aria-label="Clear search"
              onClick={handleClear}
            >
              <X className="h-3.5 w-3.5" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    </div>
  );
}
