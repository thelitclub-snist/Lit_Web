import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

const TOC = ({ articles }: { articles: any[] }) => (
  <div className="sticky top-12">
    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-8 border-b border-border pb-4">
      In This Issue
    </h3>
    <ul className="space-y-6">
      {articles.map((article) => (
        <li key={article.id}>
          <a
            href={`#article-${article.id}`}
            className="group block"
          >
            <span className="block text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1 group-hover:text-primary transition-colors">
              {article.category}
            </span>
            <span className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">
              {article.title}
            </span>
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const issueId = id ? parseInt(id, 10) : 0;

  const { data: issue, isLoading, error } = trpc.litWeekly.getById.useQuery(
    { id: issueId },
    { enabled: issueId > 0 }
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
        </div>
      </Layout>
    );
  }

  if (error || !issue) {
    return (
      <Layout>
        <div className="container py-32 text-center">
          <h2 className="text-3xl font-bold mb-4">Issue Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The edition you are looking for does not exist in our archive.
          </p>
          <Link href="/lit-weekly">
            <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs font-bold">
              Back to Archive
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="py-24">
        {/* Issue Header */}
        <div className="container mb-24">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/lit-weekly" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground hover:text-primary transition-colors mb-12">
              <ArrowLeft className="w-3 h-3" /> Back to Archive
            </Link>
            <span className="block text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-6">
              Issue No. {issue.issueNumber} &bull; {format(new Date(issue.publishDate), "MMMM d, yyyy")}
            </span>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-10">
              {issue.title}
            </h1>
            {issue.description && (
              <p className="text-xl md:text-2xl text-muted-foreground font-light italic leading-relaxed max-w-3xl mx-auto">
                {issue.description}
              </p>
            )}
          </div>
        </div>

        <div className="container">
          <div className="grid lg:grid-cols-12 gap-16">
            {/* Sidebar TOC */}
            <aside className="hidden lg:block lg:col-span-3">
              {issue.articles.length > 0 && <TOC articles={issue.articles} />}
            </aside>

            {/* Articles List */}
            <div className="lg:col-span-9">
              <div className="space-y-32">
                {issue.articles.length > 0 ? (
                  issue.articles.map((article: any) => (
                    <section key={article.id} id={`article-${article.id}`} className="scroll-mt-12">
                      <div className="max-w-2xl">
                        <header className="mb-12">
                          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-4 block">
                            {article.category}
                          </span>
                          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            {article.title}
                          </h2>
                          <div className="flex items-center gap-4 text-sm italic text-muted-foreground">
                            <span>By {article.author}</span>
                          </div>
                        </header>
                        
                        <div className="prose prose-lg prose-stone max-w-none">
                          {article.content.split('\n\n').map((paragraph: any, idx: any) => (
                            <p 
                              key={idx} 
                              className={`text-lg leading-relaxed mb-8 text-foreground/90 font-light ${idx === 0 ? 'drop-cap' : ''}`}
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                        
                        <footer className="mt-16 pt-8 border-t border-border/40">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/40">
                              End of Article
                            </span>
                          </div>
                        </footer>
                      </div>
                    </section>
                  ))
                ) : (
                  <div className="text-center py-32 border border-dashed border-border">
                    <p className="text-muted-foreground italic">
                      This issue contains no articles yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
}
