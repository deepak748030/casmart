import { Folder, Clock } from "lucide-react";
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
    <section id="blog" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Latest fashion news
        </h2>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <li key={index}>
              <article className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                <figure className="relative aspect-[16/11] overflow-hidden">
                  <a href="#">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </a>
                </figure>

                <div className="p-6">
                  <ul className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <li className="flex items-center gap-1">
                      <Folder className="h-4 w-4" />
                      <a href="#" className="hover:text-primary transition-colors">
                        Fashion
                      </a>
                    </li>
                    <li className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <a href="#" className="hover:text-primary transition-colors">
                        <time dateTime="2021-03-31">{post.date}</time>
                      </a>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-foreground">
                    <a href="#" className="hover:text-primary transition-colors">
                      {post.title}
                    </a>
                  </h3>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
