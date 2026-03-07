"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export function SearchBar({
  onSearch,
  placeholder = "Search...",
  className,
  debounceMs = 500,
}: SearchBarProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, debounceMs, onSearch]);

  return (
    <div className={className}>
      <InputGroup>
        <InputGroupAddon align="inline-start" className="pointer-events-none">
          <Search className="h-4 w-4" />
        </InputGroupAddon>
        <InputGroupInput
          className="text-sm"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </InputGroup>
    </div>
  );
}
