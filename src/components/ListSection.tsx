import ListCard from "./ListCard";
import type { ListData } from "@/interfaces/types";

export default function ListSection({
  title,
  lists,
}: {
  title: string;
  lists?: ListData[];
}) {
  if (!Array.isArray(lists) || lists.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists.map((list) => (
          <ListCard key={list.id} {...list} />
        ))}
      </div>
    </div>
  );
}
