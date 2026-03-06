import { useEffect } from "react";
import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  schemaOnly?: boolean;
}

const BASE_URL = "https://skillcraft-interlingua.it";

export function Breadcrumb({ items, schemaOnly }: BreadcrumbProps) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        ...items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 2,
          name: item.label,
          ...(item.href ? { item: `${BASE_URL}${item.href}` } : {}),
        })),
      ],
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "breadcrumb-schema";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("breadcrumb-schema");
      if (el) el.remove();
    };
  }, [items]);

  if (schemaOnly) return null;

  return (
    <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-24 pb-2" data-testid="breadcrumb-nav">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
        <li>
          <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors" data-testid="breadcrumb-home">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-foreground transition-colors" data-testid={`breadcrumb-link-${i}`}>
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium" data-testid={`breadcrumb-current-${i}`}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
