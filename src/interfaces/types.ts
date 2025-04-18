import { listItemSchema } from "@/schemas/listItem.schema";
import { z } from "zod";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

export interface ChildrenProps {
  children: React.ReactNode;
}

export enum ListStatus {
  ACTIVE = "active",
  ARCHIVED = "archived",
  INACTIVE = "inactive",
  DRAFT = "draft",
}

export type ListItemType = {
  id: string;
  text: string;
  checked: boolean;
};
export type FormValues = z.infer<typeof listItemSchema>;
export type ListDetailProps = {
  isTemplateView?: boolean;
};

export enum ListType {
  TODO = "todo",
  GROCERY = "grocery",
}

export enum ListVisibility {
  PRIVATE = "private",
  FLAT = "flat",
  SHARED = "shared",
}

export interface ListData {
  id: string;
  owner_id: string;
  owner_name?: string;
  flat_id?: string | null;
  title: string;
  type: ListType;
  is_template: boolean;
  template_id?: string | null;
  visibility: ListVisibility;
  status: ListStatus;
  created_at: string;
  updated_at: string;
}

export type DashboardListsStore = {
  lists: ListData[];
  isLoaded: boolean;
  loading: boolean;
  loadLists: () => Promise<void>;
  refreshLists: () => Promise<void>;
  refreshArchive: () => Promise<void>;
  markDirty: () => void;
  shouldRefreshDashboard: boolean;
};

// Toast type
export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// Action types
export enum ActionType {
  ADD_TOAST = "ADD_TOAST",
  UPDATE_TOAST = "UPDATE_TOAST",
  DISMISS_TOAST = "DISMISS_TOAST",
  REMOVE_TOAST = "REMOVE_TOAST",
}

export type Action =
  | { type: ActionType.ADD_TOAST; toast: ToasterToast }
  | {
      type: ActionType.UPDATE_TOAST;
      toast: Partial<ToasterToast> & { id: string };
    }
  | { type: ActionType.DISMISS_TOAST; toastId?: string }
  | { type: ActionType.REMOVE_TOAST; toastId?: string };

// State type
export interface State {
  toasts: ToasterToast[];
}

export type CreateListInput = {
  title: string;
  type: ListType;
  visibility: ListVisibility;
  is_template?: boolean;
  template_id?: string | null;
  owner_id: string;
};
