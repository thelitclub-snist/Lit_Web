import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BookForm = ({ book, onSave }: { book?: any; onSave: () => void }) => {
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [bookCode, setBookCode] = useState(book?.bookCode || "");

  const utils = trpc.useUtils();

  const createMutation = trpc.books.create.useMutation({
    onSuccess: () => {
      toast.success("Book created successfully!");
      onSave();
      utils.books.list.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed to create book"),
  });

  const updateMutation = trpc.books.update.useMutation({
    onSuccess: () => {
      toast.success("Book updated successfully!");
      onSave();
      utils.books.list.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed to update book"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mutation = book ? updateMutation : createMutation;
    mutation.mutate({ id: book?.id, title, author, bookCode } as any);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <Input placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} required />
      <Input placeholder="Book Code" value={bookCode} onChange={e => setBookCode(e.target.value)} required />
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {book ? "Save Changes" : "Create Book"}
      </Button>
    </form>
  );
};

export const BooksTab = () => {
  const { data: books, isLoading, refetch } = trpc.books.list.useQuery();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any | null>(null);

  const deleteMutation = trpc.books.delete.useMutation({ onSuccess: () => { refetch(); toast.warning("Book Deleted"); } });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Books</CardTitle>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setEditingBook(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Book
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBook ? "Edit Book" : "Add New Book"}</DialogTitle>
            </DialogHeader>
            <BookForm book={editingBook} onSave={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading && <Loader2 className="mx-auto my-8 h-8 w-8 animate-spin text-primary" />}
        <div className="space-y-4">
          {books?.map((book: any) => (
            <div key={book.id} className="flex items-center justify-between p-3 bg-card rounded-md border">
              <div>
                <h4 className="font-semibold">{book.title}</h4>
                <p className="text-sm text-muted-foreground">{book.author} | {book.bookCode}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={book.isAvailable ? "default" : "secondary"}>
                  {book.isAvailable ? "Available" : "Borrowed"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingBook(book);
                    setIsFormOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate({ id: book.id })}>
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
