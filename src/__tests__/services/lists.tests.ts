import { createList, filterListsByCategory } from "@/services/lists.service";
import { supabase } from "@/lib/supabaseClient";
import { logger } from "@/lib/logger";
import { ListData, ListType, ListVisibility } from "@/interfaces/types";
import { mockInput, mockInput2, mockLists, userId } from "@/__mocks__/data";

// Mock dependencies
jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
  },
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe("lists.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createList", () => {
    it("should insert a new list and log info if no error", async () => {
      (supabase.from("lists").insert as jest.Mock).mockResolvedValueOnce({
        error: null,
      });

      const { error } = await createList(mockInput);

      expect(supabase.from).toHaveBeenCalledWith("lists");
      expect(supabase.from("lists").insert).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        "List created",
        expect.objectContaining({
          title: "Groceries",
          visibility: "private",
        })
      );
      expect(error).toBeNull();
    });

    it("should log error if Supabase insert fails", async () => {
      const fakeError = { message: "Insert failed" };
      (supabase.from("lists").insert as jest.Mock).mockResolvedValueOnce({
        error: fakeError,
      });

      const { error } = await createList(mockInput2);

      expect(logger.error).toHaveBeenCalledWith(
        "Failed to insert list",
        fakeError
      );
      expect(error).toEqual(fakeError);
    });
  });

  describe("filterListsByCategory", () => {
    it("should categorize lists correctly", () => {
      const { myLists, sharedFlatLists, templateLists } = filterListsByCategory(
        mockLists as ListData[],
        userId
      );

      expect(myLists.length).toBe(1);
      expect(sharedFlatLists.length).toBe(1);
      expect(templateLists.length).toBe(1);
    });
  });
});
