"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { debounce } from "lodash";

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
  const debouncedSearch = debounce(onSearch, debounceMs);
  
  useEffect(() => {
    debouncedSearch(value);
  }, [value]);
    
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
