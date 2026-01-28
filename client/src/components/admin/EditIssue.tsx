import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const ArticleEditor = ({ article, onSave, onCancel, onDelete }: { article: any; onSave: any; onCancel: any; onDelete: any }) => {
  const [title, setTitle] = useState(article.title || "");
  const [author, setAuthor] = useState(article.author || "");
  const [category, setCategory] = useState(article.category || "");
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: article.content || "",
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert max-w-none p-4 border border-input rounded-md min-h-[200px]",
      },
    },
  });

  const handleSave = () => {
    onSave({ ...article, title, author, category, content: editor?.getHTML() });
  };

  return (
    <Card className="mt-4">
        <CardContent className="p-6 space-y-4">
            <Input placeholder="Article Title" value={title} onChange={e => setTitle(e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
              <Input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
            </div>
            <EditorContent editor={editor} />
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                {article.id && <Button variant="destructive" onClick={() => onDelete(article.id)}>Delete</Button>}
                <Button onClick={handleSave}><Save className="h-4 w-4 mr-2"/> Save Article</Button>
            </div>
        </CardContent>
    </Card>
  );
};

export const EditIssue = () => {
  const { id } = useParams<{ id: string }>();
  const issueId = parseInt(id, 10);

  const { data: issue, isLoading, refetch } = trpc.litWeekly.getById.useQuery({ id: issueId });
  const createArticleMutation = trpc.articles.create.useMutation();
  const updateArticleMutation = trpc.articles.update.useMutation();
  const deleteArticleMutation = trpc.articles.delete.useMutation();

  const [editingArticle, setEditingArticle] = useState<any>(null);

  const handleSaveArticle = async (article: any) => {
    const mutation = article.id ? updateArticleMutation : createArticleMutation;
    try {
      await mutation.mutateAsync({ ...article, issueId });
      toast.success(`Article ${article.id ? 'updated' : 'created'} successfully!`);
      setEditingArticle(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to save article");
    }
  };

  const handleDeleteArticle = async (articleId: number) => {
     try {
      await deleteArticleMutation.mutateAsync({ id: articleId });
      toast.warning(`Article deleted successfully!`);
      setEditingArticle(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete article");
    }
  }

  if (isLoading) return <Layout><div className="flex justify-center items-center h-96"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div></Layout>;

  return (
    <Layout>
      <div className="container py-12">
        <div className="flex items-center mb-8">
            <Link href="/admin">
                <Button variant="outline" size="sm" className="mr-4"><ArrowLeft className="h-4 w-4"/></Button>
            </Link>
            <h1 className="text-3xl font-bold">Editing Issue: {issue?.title}</h1>
        </div>
        
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Articles</CardTitle>
                <Button size="sm" onClick={() => setEditingArticle({})}><Plus className="h-4 w-4 mr-2"/>Add Article</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {issue?.articles.map((article: any) => (
                        <div key={article.id} className="flex justify-between items-center p-3 bg-card rounded-md border">
                           <div>
                               <h4 className="font-semibold">{article.title}</h4>
                               <p className="text-sm text-muted-foreground">By {article.author}</p>
                           </div>
                            <Button variant="outline" size="sm" onClick={() => setEditingArticle(article)}>Edit</Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        {editingArticle && 
            <ArticleEditor 
                article={editingArticle} 
                onSave={handleSaveArticle} 
                onCancel={() => setEditingArticle(null)} 
                onDelete={handleDeleteArticle}
            />
        }

      </div>
    </Layout>
  );
};
