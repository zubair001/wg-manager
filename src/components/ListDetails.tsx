import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ListItem from "./ListItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, StarOff, Share2, EyeOff } from "lucide-react";
import {
  fetchListItems,
  addListItem,
  toggleItemChecked,
  deleteListItem,
} from "@/services/listItem.service";
import { ListItemType, ListDetailProps, FormValues } from "@/interfaces/types";
import { checkAndArchiveIfAllDone } from "@/services/archive.service";
import { fetchListById, updateListById } from "@/services/lists.service";
import { useForm } from "react-hook-form";
import { listItemSchema } from "@/schemas/listItem.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "sonner";
import ShareModal from "./ShareModal";
import { usePublicShare } from "@/hooks/usePublicShare";

export default function ListDetail({
  isTemplateView = false,
}: ListDetailProps) {
  const { id: listId } = useParams<{ id: string }>();
  const [listTitle, setListTitle] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [items, setItems] = useState<ListItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTemplate, setIsTemplate] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(listItemSchema),
    defaultValues: { text: "" },
  });

  const loadListData = useCallback(async () => {
    if (!listId) return;
    setLoading(true);

    const [list, fetchedItems] = await Promise.all([
      fetchListById(listId),
      fetchListItems(listId),
    ]);

    if (list) {
      setListTitle(list.title);
      setIsTemplate(list.is_template);
    }

    setItems(fetchedItems);
    setLoading(false);
  }, [listId]);

  const { isShared, handleShare } = usePublicShare(listId!, loadListData);

  const handleAdd = async (values: FormValues) => {
    if (!listId) return;
    await addListItem(listId, values.text);
    reset();
    loadListData();
  };

  const handleToggle = useCallback(
    async (item: ListItemType) => {
      await toggleItemChecked(item.id, !item.checked);
      await checkAndArchiveIfAllDone(listId!);
      loadListData();
    },
    [listId, loadListData]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteListItem(id);
      loadListData();
    },
    [loadListData]
  );

  const handleTitleBlur = async () => {
    if (!listId || !listTitle) return;
    await updateListById(listId, { title: listTitle });
    toast.success("Title updated");
    setIsEditingTitle(false);
  };

  const handleVisibilityToggle = (e: React.MouseEvent) => {
    handleShare(e);
  };

  useEffect(() => {
    loadListData();
  }, [loadListData]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="px-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {isTemplateView && (
        <p className="text-sm text-yellow-600 font-medium">Editing Template</p>
      )}

      <div className="flex justify-between items-center gap-2">
        {isEditingTitle ? (
          <Input
            value={listTitle ?? ""}
            onChange={(e) => setListTitle(e.target.value)}
            onBlur={handleTitleBlur}
            autoFocus
          />
        ) : (
          <h1
            className="text-2xl font-bold cursor-pointer"
            onClick={() => setIsEditingTitle(true)}
            title="Click to edit title"
          >
            {listTitle || "Loading..."}
          </h1>
        )}

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            title={isShared ? "Stop Sharing" : "Share List"}
            onClick={handleVisibilityToggle}
          >
            {isShared ? (
              <EyeOff className="w-5 h-5 text-red-500" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
          </Button>

          {listId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                const updated = !isTemplate;
                await updateListById(listId, { is_template: updated });
                toast.success(`Marked as ${updated ? "template" : "List"}`);
                setIsTemplate(updated);
              }}
              title={isTemplate ? "Remove from templates" : "Mark as template"}
            >
              {isTemplate ? (
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
              ) : (
                <StarOff className="w-5 h-5" />
              )}
            </Button>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handleAdd)}
        className="flex items-center gap-2"
      >
        <Input
          placeholder="Add new item"
          {...register("text")}
          className="flex-1"
        />
        <Button type="submit">Add</Button>
      </form>

      {errors.text && (
        <p className="text-sm text-red-500">{errors.text.message}</p>
      )}

      {loading ? (
        <p className="text-muted-foreground">
          <LoadingSpinner />
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <ListItem
              isTemplate={isTemplateView}
              key={item.id}
              {...item}
              onChange={() => handleToggle(item)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}
      <ShareModal
        listId={listId!}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}
