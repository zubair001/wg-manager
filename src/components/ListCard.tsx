import { EyeOff, Share2, Trash2, CheckCircle, Tag } from "lucide-react";
import { deleteListById } from "@/services/lists.service";
import { TEXT } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useDashboardLists } from "@/store/useDashboardLists";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import ShareModal from "./ShareModal";
import { ListData, ListStatus } from "@/interfaces/types";
import { usePublicShare } from "@/hooks/usePublicShare";
import { fetchCompletionCount } from "@/services/listItem.service";
import { useAuth } from "@/hooks/useAuth";

export default function ListCard({
  id,
  title,
  type,
  is_template,
  visibility,
  status,
  owner_id,
  owner_name,
}: ListData) {
  const { user } = useAuth();
  const createdBy = user?.id === owner_id ? "me" : owner_name;
  const [shareOpen, setShareOpen] = useState(false);
  const navigate = useNavigate();
  const [itemsCompleted, setItemsCompleted] = useState(0);
  const [itemsTotal, setItemsTotal] = useState(0);

  const { refreshLists, refreshArchive } = useDashboardLists();
  const { isShared, handleShare } = usePublicShare(id, refreshLists);

  useEffect(() => {
    const load = async () => {
      const { completed, total } = await fetchCompletionCount(id);
      setItemsCompleted(completed);
      setItemsTotal(total);
    };

    load();
  }, [id]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteListById(id);
    if (status === ListStatus.ARCHIVED) {
      refreshArchive();
    } else {
      refreshLists();
    }
  };

  return (
    <div
      onClick={() => navigate(`/list/${id}`)}
      className="p-4 bg-white rounded-xl border shadow-sm hover:shadow-md cursor-pointer transition-all space-y-2 relative"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            title={isShared ? "Stop Sharing" : "Share List"}
          >
            {isShared ? (
              <EyeOff className="w-4 h-4 text-red-500" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            title="Delete List"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Tag className="w-4 h-4" />
        <span className="capitalize">{TEXT.listTypes[type]}</span>
      </div>

      <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
        <CheckCircle className="w-4 h-4 text-green-500" />
        <span>
          {itemsCompleted} / {itemsTotal} completed
        </span>
      </div>

      <div className="flex gap-2 mt-2">
        {is_template && <Badge variant="outline">Template</Badge>}
        {isShared && <Badge variant="default">Public</Badge>}
        {visibility === "flat" && (
          <Badge variant="secondary">Shared by {createdBy}</Badge>
        )}
      </div>

      <ShareModal
        listId={id}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}
