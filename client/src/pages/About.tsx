import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Lightbulb, Heart } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <Layout>
      <main className="py-24 md:py-32">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="mb-20 text-center">
            <span className="uppercase tracking-[0.4em] text-[10px] font-bold text-primary mb-6 block">
              Our Story
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">About the Literary Club</h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-light italic">
              Celebrating the power of words, stories, and human connection through literature since 1924.
            </p>
          </div>

          <div className="divider"></div>

          {/* Mission Section */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-light">
              <p>
                The Literary Club exists to foster a vibrant community of readers, writers, and thinkers. 
                We believe that literature has the power to transform minds, bridge cultures, and inspire meaningful 
                conversations about the human experience.
              </p>
              <p>
                Our mission is to make quality literature accessible to all students, provide platforms for 
                emerging writers to share their voices, and create spaces where literary passion can flourish.
              </p>
            </div>
          </section>

          {/* Vision Section */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold mb-12">Our Vision</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="magazine-card">
                <div className="flex items-center gap-4 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-xl">Inclusive Access</h3>
                </div>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Making diverse literary works available to all students through our lending library and 
                  curated collections.
                </p>
              </div>
              <div className="magazine-card">
                <div className="flex items-center gap-4 mb-4">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-xl">Creative Expression</h3>
                </div>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Providing platforms for student writers to publish their work and receive meaningful feedback 
                  from the community.
                </p>
              </div>
              <div className="magazine-card">
                <div className="flex items-center gap-4 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-xl">Community Building</h3>
                </div>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Creating a welcoming space where readers and writers can connect, discuss ideas, and support 
                  one another.
                </p>
              </div>
              <div className="magazine-card">
                <div className="flex items-center gap-4 mb-4">
                  <Heart className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-xl">Passion for Reading</h3>
                </div>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Cultivating a genuine love for literature and fostering lifelong reading habits among our members.
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold mb-12">Our Values</h2>
            <div className="space-y-8">
              <div className="editorial-quote">
                <p className="font-bold text-foreground mb-2">Intellectual Curiosity</p>
                <p className="text-lg">We encourage questioning, critical thinking, and the exploration of diverse perspectives through literature.</p>
              </div>
              <div className="editorial-quote">
                <p className="font-bold text-foreground mb-2">Inclusivity & Respect</p>
                <p className="text-lg">We celebrate voices from all backgrounds and create a safe space for respectful literary discourse.</p>
              </div>
              <div className="editorial-quote">
                <p className="font-bold text-foreground mb-2">Excellence & Craft</p>
                <p className="text-lg">We appreciate both established literary classics and emerging voices, valuing quality writing in all forms.</p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-card p-12 border border-border/60">
            <h3 className="text-2xl font-bold mb-6">Join Our Community</h3>
            <p className="text-muted-foreground mb-10 leading-relaxed font-light max-w-xl mx-auto">
              Whether you are an avid reader, an aspiring writer, or simply curious about literature, 
              there is a place for you in the Literary Club.
            </p>
            <div className="flex gap-6 justify-center flex-wrap">
              <Link href="/lit-weekly">
                <Button className="rounded-none px-8 py-6 uppercase tracking-widest font-bold text-xs">Read Lit Weekly</Button>
              </Link>
              <Link href="/borrow">
                <Button variant="outline" className="rounded-none px-8 py-6 uppercase tracking-widest font-bold text-xs">Borrow a Book</Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
