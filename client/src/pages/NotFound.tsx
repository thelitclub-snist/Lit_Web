import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Layout } from "@/components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <main className="flex-1 flex items-center justify-center py-24 md:py-32">
        <div className="container max-w-2xl text-center">
          <div className="mb-12 flex justify-center">
            <div className="w-24 h-24 flex items-center justify-center border border-border/60">
              <BookOpen className="w-10 h-10 text-primary/40" />
            </div>
          </div>

          <span className="uppercase tracking-[0.4em] text-[10px] font-bold text-primary mb-6 block">
            Error 404
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
            An Unwritten Chapter
          </h1>

          <p className="text-xl text-muted-foreground mb-12 leading-relaxed font-light italic">
            "A reader lives a thousand lives before he dies. But the page you seek is not one of them."
          </p>

          <div className="divider mb-12"></div>

          <p className="text-lg text-muted-foreground mb-12 leading-relaxed font-light">
            It seems you've wandered into a section of the library that hasn't been cataloged yet, 
            or perhaps the volume you seek has been moved to another shelf.
          </p>

          <div className="flex gap-6 justify-center flex-wrap">
            <Link href="/">
              <Button className="rounded-none px-8 py-6 uppercase tracking-widest font-bold text-xs">
                Return Home
              </Button>
            </Link>
            <Link href="/lit-weekly">
              <Button variant="outline" className="rounded-none px-8 py-6 uppercase tracking-widest font-bold text-xs">
                Browse Archive
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
