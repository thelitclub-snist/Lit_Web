import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "wouter";

const IssueForm = ({ issue, onSave }: { issue?: any; onSave: () => void }) => {
  const [title, setTitle] = useState(issue?.title || "");
  const [description, setDescription] = useState(issue?.description || "");
  const [issueNumber, setIssueNumber] = useState(issue?.issueNumber?.toString() || "");
  const [publishDate, setPublishDate] = useState(
    issue ? format(new Date(issue.publishDate), "yyyy-MM-dd") : ""
  );

  const utils = trpc.useUtils();

  const createMutation = trpc.litWeekly.create.useMutation({
    onSuccess: () => {
      toast.success("Issue created successfully!");
      onSave();
      utils.litWeekly.listAll.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed to create issue"),
  });

  const updateMutation = trpc.litWeekly.update.useMutation({
    onSuccess: () => {
      toast.success("Issue updated successfully!");
      onSave();
      utils.litWeekly.listAll.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed to update issue"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mutation = issue ? updateMutation : createMutation;
    mutation.mutate({
      id: issue?.id,
      title,
      description,
      issueNumber: parseInt(issueNumber, 10),
      publishDate: new Date(publishDate),
    } as any);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <Input type="number" placeholder="Issue Number" value={issueNumber} onChange={e => setIssueNumber(e.target.value)} required />
      <Input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} required />
      <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {issue ? "Save Changes" : "Create Issue"}
      </Button>
    </form>
  );
};

export const IssuesTab = () => {
  const { data: issues, isLoading, refetch } = trpc.litWeekly.listAll.useQuery();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<any | null>(null);

  const publishMutation = trpc.litWeekly.publish.useMutation({ onSuccess: () => { refetch(); toast.success("Issue Published"); } });
  const unpublishMutation = trpc.litWeekly.unpublish.useMutation({ onSuccess: () => { refetch(); toast.info("Issue Unpublished"); } });
  const deleteMutation = trpc.litWeekly.delete.useMutation({ onSuccess: () => { refetch(); toast.warning("Issue Deleted"); } });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lit Weekly Issues</CardTitle>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setEditingIssue(null)}>
              <Plus className="mr-2 h-4 w-4" /> Create Issue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingIssue ? "Edit Issue" : "Create New Issue"}</DialogTitle>
            </DialogHeader>
            <IssueForm issue={editingIssue} onSave={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading && <Loader2 className="mx-auto my-8 h-8 w-8 animate-spin text-primary" />}
        <div className="space-y-4">
          {issues?.map((issue: any) => (
            <div key={issue.id} className="flex items-center justify-between p-3 bg-card rounded-md border">
              <div>
                <h4 className="font-semibold">{issue.title}</h4>
                <p className="text-sm text-muted-foreground">
                  Issue #{issue.issueNumber} &bull; {format(new Date(issue.publishDate), "PPP")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={issue.isPublished ? "default" : "secondary"}>
                  {issue.isPublished ? "Published" : "Draft"}
                </Badge>
                 <Link href={`/admin/issue/${issue.id}/edit`}>
                   <Button variant="outline" size="sm"><ExternalLink className="h-4 w-4"/></Button>
                 </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingIssue(issue);
                    setIsFormOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => issue.isPublished ? unpublishMutation.mutate({ id: issue.id }) : publishMutation.mutate({ id: issue.id })}
                >
                  {issue.isPublished ? "Unpublish" : "Publish"}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate({ id: issue.id })}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
