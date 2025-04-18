import { Checkbox } from "@/components/ui/checkbox";
import { Trash } from "lucide-react";

type Props = {
  isTemplate?: boolean;
  text: string;
  checked: boolean;
  onChange: () => void;
  onDelete: () => void;
};

export default function ListItem({
  isTemplate = false,
  text,
  checked,
  onChange,
  onDelete,
}: Props) {

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-md border bg-white shadow-sm">
      <div className="flex items-center gap-3">
        {!isTemplate && (
          <Checkbox checked={checked} onCheckedChange={() => onChange()} />
        )}

        <span
          className={
            checked && !isTemplate ? "line-through text-muted-foreground" : ""
          }
        >
          {text}
        </span>
      </div>
      <button onClick={onDelete} className="text-red-500 hover:text-red-700">
        <Trash size={16} />
      </button>
    </div>
  );
}
