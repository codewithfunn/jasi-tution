"use client";
import qs from "query-string";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Input } from "./ui/input";
import { useDebounce } from "@/hooks/use-debounce";

import styles from "./styles.module.scss";
export const SearchInput = () => {
  const [value, setValue] = useState("");
  const debounceValue = useDebounce(value, 500);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debounceValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url)
  }, [currentCategoryId, debounceValue, pathname, router]);

  return (
    <div className={`relative ${styles.__searchInputContainer}`}>
      <SearchIcon
        className={`${styles.__searchIcon} h-4 w-4 absolute top-3 left-3 text-slate-600`}
      />
      <Input
        onChange={(e)=>setValue(e.target.value)}
        value={value}
        className={`w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200 ${styles.__searchInput} `}
        placeholder="Search for the course..."
      />
    </div>
  );
};
