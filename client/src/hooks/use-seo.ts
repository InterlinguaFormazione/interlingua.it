import { useEffect } from "react";

interface SEOOptions {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
}

const BASE_URL = "https://skillcraft-interlingua.it";

export function useSEO({ title, description, canonical, ogTitle, ogDescription }: SEOOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const setMeta = (selector: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (el) {
        el.setAttribute("content", content);
      }
    };

    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', ogTitle || title);
    setMeta('meta[property="og:description"]', ogDescription || description);

    if (canonical) {
      setMeta('meta[property="og:url"]', `${BASE_URL}${canonical}`);
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (link) link.href = `${BASE_URL}${canonical}`;
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, canonical, ogTitle, ogDescription]);
}
