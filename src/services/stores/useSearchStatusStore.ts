import { create } from 'zustand';

interface SearchStatus {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  setStatus: (status: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
  }) => void;
  message?: string;
  setMessage: (message: string) => void;
}

export const useSearchStatusStore = create<SearchStatus>()((set) => ({
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  setStatus: ({ isLoading, isError, isSuccess }) =>
    set({ isLoading, isError, isSuccess }),
  setMessage: (message: string) => set({ message }),
}));

export default useSearchStatusStore;
