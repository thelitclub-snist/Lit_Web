import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";

export const BorrowingTab = () => {
  const { data: records, isLoading, refetch } = trpc.borrowing.list.useQuery();
  const returnMutation = trpc.borrowing.return.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Book returned successfully!");
    },
    onError: (error) => toast.error(error.message || "Failed to process return"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Borrowing Records</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <Loader2 className="mx-auto my-8 h-8 w-8 animate-spin text-primary" />}
        <div className="space-y-4">
          {records?.map((record: any) => (
            <div key={record.id} className="flex items-center justify-between p-3 bg-card rounded-md border">
              <div>
                <h4 className="font-semibold">{record.book.title}</h4>
                <p className="text-sm text-muted-foreground">
                  Borrowed by {record.studentName} ({record.rollNumber}) on {format(new Date(record.borrowDate), "PPP")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {record.isReturned ? (
                  <Badge variant="default">
                    Returned on {format(new Date(record.returnDate!), "PPP")}
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => returnMutation.mutate({ recordId: record.id })}
                    disabled={returnMutation.isPending}
                  >
                    {returnMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Mark as Returned
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
