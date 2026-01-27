import { Layout } from "@/components/Layout";
import { Route } from "wouter";
import { useState } from "react";
import { BooksTab } from "@/components/admin/BooksTab";
import { IssuesTab } from "@/components/admin/IssuesTab";
import { BorrowingTab } from "@/components/admin/BorrowingTab";
import { EditIssue } from "@/components/admin/EditIssue";

type Tab = "issues" | "books" | "borrowing";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("issues");

  return (
    <Layout>
        <Route path="/admin/issue/:id/edit" component={EditIssue} />
        <Route path="/admin">
            <div className="container py-24">
              <div className="mb-16">
                <span className="uppercase tracking-[0.4em] text-[10px] font-bold text-primary mb-6 block">
                  Management
                </span>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Admin Dashboard</h1>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-4 mb-12 border-b border-border/60">
                <button 
                  onClick={() => setActiveTab("issues")} 
                  className={`py-4 uppercase tracking-widest text-[10px] font-bold transition-all duration-300 ${activeTab === "issues" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Issues
                </button>
                <button 
                  onClick={() => setActiveTab("books")} 
                  className={`py-4 uppercase tracking-widest text-[10px] font-bold transition-all duration-300 ${activeTab === "books" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Books
                </button>
                <button 
                  onClick={() => setActiveTab("borrowing")} 
                  className={`py-4 uppercase tracking-widest text-[10px] font-bold transition-all duration-300 ${activeTab === "borrowing" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Borrowing
                </button>
              </div>

              <div className="animate-in fade-in duration-500">
                {activeTab === "issues" && <IssuesTab />}
                {activeTab === "books" && <BooksTab />}
                {activeTab === "borrowing" && <BorrowingTab />}
              </div>
          </div>
        </Route>
    </Layout>
  );
}
