import { create } from "zustand";

interface UxState {
  loginDialogOpen: boolean;
  setLoginDialogOpen: (open: boolean) => void;
  sidemenuOpen: boolean;
  setSidemenuOpen: (open: boolean) => void;
}

export const useUxStore = create<UxState>((set) => ({
  loginDialogOpen: false,
  setLoginDialogOpen: (open) => set({ loginDialogOpen: open }),
  sidemenuOpen: false,
  setSidemenuOpen: (open) => set({ sidemenuOpen: open }),
}));
