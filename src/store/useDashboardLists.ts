import { create } from "zustand";
import { fetchArchivedLists, fetchLists } from "@/services/lists.service";
import { DashboardListsStore } from "@/interfaces/types";

export const useDashboardLists = create<DashboardListsStore>((set) => ({
  lists: [],
  isLoaded: false,
  loading: false,
  shouldRefreshDashboard: false,
  loadLists: async () => {
    set({ loading: true });
    const data = await fetchLists();
    set({
      lists: data,
      loading: false,
      isLoaded: true,
      shouldRefreshDashboard: false,
    });
  },
  refreshLists: async () => {
    const data = await fetchLists();
    set({ lists: data, shouldRefreshDashboard: false });
  },
  refreshArchive: async () => {
    const data = await fetchArchivedLists();
    set({ lists: data, shouldRefreshDashboard: false });
  },
  markDirty: () => set({ shouldRefreshDashboard: true }),
}));
