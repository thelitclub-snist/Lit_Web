
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Pen, Users } from "lucide-react";

export default function Home() {
  const { data: issues } = trpc.litWeekly.list.useQuery();

  const latestIssue = issues?.[0];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 md:py-32 border-b border-border/60">
        <div className="container text-center">
          <span className="uppercase tracking-[0.4em] text-[10px] font-bold text-primary mb-6 block">
            Welcome to the Sanctuary
          </span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8">
            The Art of <br className="hidden md:block" /> Thoughtful Reading
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light italic leading-relaxed">
            "A reader lives a thousand lives before he dies. The man who never reads lives only one."
          </p>
        </div>
      </section>

      {/* Featured Issue Section */}
      {latestIssue && (
        <section className="py-24 border-b border-border/60">
          <div className="container">
            <div className="grid lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-7">
                <span className="uppercase tracking-widest text-[10px] font-bold text-primary mb-4 block">
                  Latest Issue &bull; No. {latestIssue.issueNumber}
                </span>
                <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                  {latestIssue.title}
                </h2>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed font-light">
                  {latestIssue.description}
                </p>
                <Link href={`/lit-weekly/${latestIssue.id}`}>
                  <Button size="lg" className="rounded-none px-10 py-6 text-sm uppercase tracking-widest font-bold">
                    Read the Issue <ArrowRight className="ml-3 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="lg:col-span-5 bg-card p-10 border border-border/60">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-8 border-b border-border pb-4">
                  Inside this Edition
                </h3>
                <ul className="space-y-8">
                  {latestIssue.articles.slice(0, 4).map((article: any) => (
                    <li key={article.id} className="group">
                      <Link href={`/lit-weekly/${latestIssue.id}#article-${article.id}`}>
                        <span className="block text-xs uppercase tracking-widest text-primary font-bold mb-1">
                          {article.category}
                        </span>
                        <span className="text-xl font-bold group-hover:text-primary transition-colors duration-300 block">
                          {article.title}
                        </span>
                        <span className="text-sm text-muted-foreground italic">
                          by {article.author}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {latestIssue.articles.length > 4 && (
                  <Link href={`/lit-weekly/${latestIssue.id}`} className="mt-10 block text-xs uppercase tracking-widest font-bold hover:text-primary transition-colors">
                    + View all articles
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-24">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center border border-border mb-8 group-hover:border-primary transition-colors">
                <Pen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Lit Weekly</h3>
              <p className="text-muted-foreground mb-8 font-light leading-relaxed">
                Our flagship publication featuring student essays, poetry, and critical reviews.
              </p>
              <Link href="/lit-weekly" className="text-xs uppercase tracking-widest font-bold border-b border-primary pb-1 hover:text-primary transition-colors">
                Explore Archive
              </Link>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center border border-border mb-8">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">The Library</h3>
              <p className="text-muted-foreground mb-8 font-light leading-relaxed">
                A curated collection of timeless classics and contemporary masterpieces available for members.
              </p>
              <Link href="/borrow" className="text-xs uppercase tracking-widest font-bold border-b border-primary pb-1 hover:text-primary transition-colors">
                Browse Books
              </Link>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center border border-border mb-8">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground mb-8 font-light leading-relaxed">
                Fostering a community of intellectual curiosity and creative expression since 1924.
              </p>
              <Link href="/about" className="text-xs uppercase tracking-widest font-bold border-b border-primary pb-1 hover:text-primary transition-colors">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
