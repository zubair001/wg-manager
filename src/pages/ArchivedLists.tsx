import { useEffect, useState } from "react";
import ListCard from "../components/ListCard";
import { fetchArchivedLists } from "@/services/lists.service";
import { ListData } from "@/interfaces/types";

export default function ArchivedLists() {
  const [archived, setArchived] = useState<ListData[]>([]);

  useEffect(() => {
    const loadArchivedLists = async () => {
      try {
        const lists = await fetchArchivedLists();
        setArchived(lists);
      } catch (err) {
        console.error("Error fetching archived lists:", err);
      }
    };

    loadArchivedLists();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Archived Lists</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {archived.map((list) => (
          <ListCard key={list.id} {...list} />
        ))}
      </div>
    </div>
  );
}
