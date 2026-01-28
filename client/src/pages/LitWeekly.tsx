import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

export default function LitWeekly() {
  const { data: issues, isLoading, error } = trpc.litWeekly.list.useQuery();

  return (
    <Layout>
      <div className="container py-24">
        <div className="max-w-3xl mb-20">
          <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-primary mb-4 block">
            The Archive
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
            Lit Weekly
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-light">
            A chronological record of our weekly publications. Each edition is a curated collection of student voices, critical essays, and creative explorations.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
          </div>
        ) : error ? (
          <div className="border border-destructive/20 bg-destructive/5 p-12 text-center">
            <h3 className="font-bold text-xl mb-2">Unable to load the archive</h3>
            <p className="text-muted-foreground mb-6">We encountered a technical issue while retrieving the issues.</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="rounded-none uppercase tracking-widest text-xs font-bold">
              Try Again
            </Button>
          </div>
        ) : !issues || issues.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-border">
            <h2 className="text-2xl font-bold mb-4">The archive is currently empty.</h2>
            <p className="text-muted-foreground mb-8">Check back soon for our inaugural issue.</p>
            <Link href="/">
              <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs font-bold">Return Home</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-px bg-border border border-border">
            {issues.map((issue: any) => (
              <Link key={issue.id} href={`/lit-weekly/${issue.id}`}>
                <div className="group block bg-background p-8 md:p-12 hover:bg-card transition-colors duration-300 cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
                          Issue No. {issue.issueNumber}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60">
                          {format(new Date(issue.publishDate), "MMMM d, yyyy")}
                        </span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold group-hover:text-primary transition-colors duration-300 mb-4">
                        {issue.title}
                      </h3>
                      {issue.description && (
                        <p className="text-muted-foreground font-light leading-relaxed max-w-2xl line-clamp-2">
                          {issue.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold group-hover:translate-x-2 transition-transform duration-300">
                      Read <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
