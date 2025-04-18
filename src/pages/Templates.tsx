import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { copyTemplate, fetchTemplates } from "@/services/lists.service";
import { Badge } from "@/components/ui/badge";
import { TEXT } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { CardActionsButton } from "@/components/ui/card-actions-button";
import { logger } from "@/lib/logger";

type Template = {
  id: string;
  title: string;
  type: "todo" | "grocery";
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const templates = await fetchTemplates();
        setTemplates(templates);
      } catch (err) {
        console.error("Error loading templates:", err); 
        toast.error(
          `Failed to load templates: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const handleUseTemplate = async (templateId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      logger.error("User not found");
      toast.error("User not found.");
      return;
    }

    const newListId = await copyTemplate(templateId, userId);
    if (newListId) {
      navigate(`/list/${newListId}`);
    }
  };

  const handleViewDetails = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/template/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 px-4">
      <h1 className="text-2xl font-bold">Your Templates</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading templates...</p>
      ) : templates.length === 0 ? (
        <p className="text-muted-foreground">You have no saved templates.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
            >
              <div className="space-y-1 mb-4">
                <h3 className="text-lg font-semibold line-clamp-1">
                  {template.title}
                </h3>
                <Badge variant="outline">{TEXT.listTypes[template.type]}</Badge>
              </div>

              <div className="flex items-center justify-between mt-auto gap-2">
                <CardActionsButton
                  variant="secondary"
                  onClick={(e) => handleViewDetails(e, template.id)}
                >
                  View Details
                </CardActionsButton>

                <CardActionsButton
                  variant="secondary"
                  onClick={() => handleUseTemplate(template.id)}
                >
                  Use Template
                </CardActionsButton>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
