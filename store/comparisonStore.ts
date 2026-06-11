"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CompareCollege {
  id: string;
  name: string;
  logo?: string;
  location: string;
  nirfRanking?: number;
  avgRating: number;
  type: string;
}

interface ComparisonStore {
  colleges: CompareCollege[];
  addCollege: (college: CompareCollege) => boolean;
  removeCollege: (id: string) => void;
  clearAll: () => void;
  hasCollege: (id: string) => boolean;
}

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      colleges: [],
      addCollege: (college) => {
        const state = get();
        if (state.colleges.length >= 3) return false;
        if (state.colleges.some((c) => c.id === college.id)) return false;
        set({ colleges: [...state.colleges, college] });
        return true;
      },
      removeCollege: (id) => {
        set({ colleges: get().colleges.filter((c) => c.id !== id) });
      },
      clearAll: () => set({ colleges: [] }),
      hasCollege: (id) => get().colleges.some((c) => c.id === id),
    }),
    { name: "campus-comparison" }
  )
);
