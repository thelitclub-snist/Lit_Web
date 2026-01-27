import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Loader2, CheckCircle, XCircle, Search, Library } from "lucide-react";
import { toast } from "sonner";

const BookStatus = ({ bookCode }: { bookCode: string }) => {
  const { data: book, isLoading, error } = trpc.books.getByCode.useQuery(
    { bookCode },
    { enabled: !!bookCode, retry: false }
  );

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground italic">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Consulting the catalog...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-destructive italic">
        <XCircle className="w-4 h-4" />
        <span>The volume <strong>{bookCode}</strong> is not in our collection.</span>
      </div>
    );
  }

  if (book) {
    return (
      <div className={`flex items-center gap-2 ${book.isAvailable ? 'text-primary' : 'text-muted-foreground'} italic`}>
        {book.isAvailable ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        <span>
          <strong>{book.title}</strong> by {book.author} is <strong>{book.isAvailable ? 'available' : 'currently borrowed'}</strong>.
        </span>
      </div>
    );
  }

  return null;
};


export default function BorrowBook() {
  const [bookCode, setBookCode] = useState("");
  const [searchedCode, setSearchedCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");

  const { data: book } = trpc.books.getByCode.useQuery(
    { bookCode: searchedCode }, 
    { enabled: !!searchedCode, retry: false }
  );

  const borrowMutation = trpc.borrowing.borrow.useMutation({
    onSuccess: () => {
      toast.success("Book borrowed successfully!");
      setStudentName("");
      setRollNumber("");
      setEmail("");
      setSearchedCode(""); // Reset the form
      setBookCode("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to borrow book");
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedCode(bookCode);
  };

  const handleBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedCode || !studentName || !rollNumber || !email) {
      toast.error("Please fill in all fields");
      return;
    }
    borrowMutation.mutate({
      bookCode: searchedCode,
      studentName,
      rollNumber,
      email,
    });
  };

  return (
    <Layout>
      <div className="container py-24 md:py-32">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-20">
            <div className="w-16 h-16 flex items-center justify-center border border-border/60 mx-auto mb-8">
              <Library className="w-6 h-6 text-primary"/>
            </div>
            <span className="uppercase tracking-[0.4em] text-[10px] font-bold text-primary mb-6 block">
              The Library
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
              Borrow a Book
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-light italic">
              Check a book's availability and borrow it from our curated collection.
            </p>
          </div>

          <div className="space-y-16">
            <section className="bg-card p-10 border border-border/60">
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-8 border-b border-border pb-4">
                1. Check Availability
              </h2>
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch gap-4">
                <Input
                  id="bookCodeSearch"
                  type="text"
                  placeholder="Enter book code (e.g., LIT-001)"
                  value={bookCode}
                  onChange={(e) => setBookCode(e.target.value)}
                  className="flex-grow rounded-none border-border/60 bg-background focus-visible:ring-primary"
                />
                <Button type="submit" className="rounded-none px-8 uppercase tracking-widest font-bold text-xs">
                  <Search className="w-4 h-4 mr-2" />
                  Check
                </Button>
              </form>
              <div className="mt-6">
                {searchedCode && <BookStatus bookCode={searchedCode} />}
              </div>
            </section>

            {book && book.isAvailable && (
              <section className="bg-card p-10 border border-border/60 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-8 border-b border-border pb-4">
                  2. Borrowing Details
                </h2>
                <form onSubmit={handleBorrow} className="space-y-8">
                   <div className="bg-background p-6 border border-border/40">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1">You are borrowing:</p>
                      <p className="text-xl font-bold">{book.title}</p>
                      <p className="text-sm text-muted-foreground italic">by {book.author}</p>
                  </div>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="studentName" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Full Name</Label>
                      <Input id="studentName" value={studentName} onChange={e => setStudentName(e.target.value)} required className="rounded-none border-border/60 bg-background focus-visible:ring-primary" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="rollNumber" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Roll Number</Label>
                        <Input id="rollNumber" value={rollNumber} onChange={e => setRollNumber(e.target.value)} required className="rounded-none border-border/60 bg-background focus-visible:ring-primary" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Email Address</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="rounded-none border-border/60 bg-background focus-visible:ring-primary" />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" disabled={borrowMutation.isPending} className="w-full rounded-none py-6 uppercase tracking-widest font-bold text-xs">
                    {borrowMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Borrowing"}
                  </Button>
                </form>
              </section>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
