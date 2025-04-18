import { useEffect } from "react";
import { useDashboardLists } from "@/store/useDashboardLists";
import { useAuth } from "@/hooks/useAuth";
import { filterListsByCategory } from "@/services/lists.service";
import ListSection from "./ListSection";
import NewListModal from "./NewListModal";
import LoadingSpinner from "./LoadingSpinner";

export default function ListGrid() {
  const {
    lists,
    loadLists,
    isLoaded,
    loading,
    refreshLists,
    shouldRefreshDashboard,
  } = useDashboardLists();

  const { user } = useAuth();

  useEffect(() => {
    if (!isLoaded || shouldRefreshDashboard) {
      loadLists();
    }
  }, [isLoaded, shouldRefreshDashboard, loadLists]);

  if (loading)
    return (
      <p className="text-muted-foreground">
        <LoadingSpinner />
      </p>
    );

  const { myLists, sharedFlatLists } = filterListsByCategory(
    lists,
    user?.id || ""
  );


  return (
    <>
      <NewListModal onCreate={refreshLists} />

      {!lists.length ? (
        <p className="text-muted-foreground">No lists yet.</p>
      ) : (
        <div className="space-y-8">
          <ListSection title="Private" lists={myLists} />
          <ListSection title="Shared Flat Lists" lists={sharedFlatLists} />
        </div>
      )}
    </>
  );
}
