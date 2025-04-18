import { ListType, ListVisibility } from "@/interfaces/types";

export const mockInput = {
  title: "Groceries",
  type: ListType.TODO,
  visibility: ListVisibility.PRIVATE,
  is_template: false,
  template_id: null,
  owner_id: "user-123",
};

export const mockInput2 = {
  title: "Groceries",
  type: ListType.TODO,
  visibility: ListVisibility.PRIVATE,
  is_template: false,
  template_id: null,
  owner_id: "user-123",
};

export const userId = "user-123";
export const mockLists = [
  {
    owner_id: userId,
    visibility: ListVisibility.PRIVATE,
    is_template: false,
  },
  {
    owner_id: userId,
    visibility: ListVisibility.FLAT,
    is_template: false,
  },
  {
    owner_id: userId,
    visibility: ListVisibility.PRIVATE,
    is_template: true,
  },
];
