import { Folder, Clock, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";

const blogPosts = [
  {
    image: blog1,
    title: "Worthy Cyber Monday Fashion From Casmart",
    date: "31 Mar 2021",
  },
  {
    image: blog2,
    title: "Holiday Home Decoration I've Recently Ordered",
    date: "31 Mar 2021",
  },
  {
    image: blog3,
    title: "Unique Ideas for Fashion You Haven't heard yet",
    date: "31 Mar 2021",
  },
];

export const Blog = () => {
  return (
    <section id="blog" className="py-20 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Latest Fashion News
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay updated with the latest trends and style inspiration
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <li
              key={index}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <article className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-500 group hover-lift border border-border/50">
                <figure className="relative aspect-[16/11] overflow-hidden bg-muted/30">
                  <a href="#" className="block h-full">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                    />
                  </a>

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Read more button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/95 hover:bg-white shadow-strong transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </figure>

                <div className="p-6">
                  <ul className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                    <li className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <Folder className="h-3.5 w-3.5" />
                      <a href="#" className="font-medium">
                        Fashion
                      </a>
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <Clock className="h-3.5 w-3.5" />
                      <time dateTime="2021-03-31">{post.date}</time>
                    </li>
                    <li className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <User className="h-3.5 w-3.5" />
                      <span>Admin</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-foreground leading-snug mb-3 line-clamp-2">
                    <a href="#" className="hover:text-primary transition-colors">
                      {post.title}
                    </a>
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    Discover the latest fashion trends and styling tips to elevate your wardrobe this season.
                  </p>

                  <a
                    href="#"
                    className="inline-flex items-center text-sm font-semibold text-primary hover:gap-2 transition-all duration-300 group/link"
                  >
                    <span>Continue Reading</span>
                    <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
