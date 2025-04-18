import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TEXT } from "@/lib/constants";
import { CheckCircle } from "lucide-react";
import { getListIdBySharedToken } from "@/services/sharedList.service";
import { fetchListById } from "@/services/lists.service";
import { fetchListItems } from "@/services/listItem.service";

type ListItem = {
  id: string;
  text: string;
  checked: boolean;
};

type SharedListData = {
  id: string;
  title: string;
  type: "todo" | "grocery";
};

export default function SharedList() {
  const { token } = useParams<{ token: string }>();
  const [list, setList] = useState<SharedListData | null>(null);
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSharedList = async () => {
      if (!token) return;

      setLoading(true);

      const listId = await getListIdBySharedToken(token);
      if (!listId) {
        setList(null);
        setItems([]);
        setLoading(false);
        return;
      }

      const [listData, itemsData] = await Promise.all([
        fetchListById(listId),
        fetchListItems(listId),
      ]);

      setList(listData);
      setItems(itemsData || []);
      setLoading(false);
    };

    loadSharedList();
  }, [token]);

  if (loading)
    return <p className="text-muted-foreground">Loading shared list...</p>;

  if (!list)
    return (
      <p className="text-muted-foreground">Invalid or expired shared link.</p>
    );

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{list.title}</h1>
        <Badge variant="secondary">{TEXT.listTypes[list.type]}</Badge>
        <p className="text-sm text-muted-foreground">
          You are viewing a shared list. You can’t edit this.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <Card
            key={item.id}
            className="px-4 py-3 flex justify-between items-center"
          >
            <span
              className={
                item.checked ? "line-through text-muted-foreground" : ""
              }
            >
              {item.text}
            </span>
            {item.checked && <CheckCircle className="w-4 h-4 text-green-500" />}
          </Card>
        ))}
      </div>
    </div>
  );
}
