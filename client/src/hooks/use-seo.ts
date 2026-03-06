import { useEffect } from "react";

interface SEOOptions {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
}

const BASE_URL = "https://skillcraft-interlingua.it";

function getOrCreateMeta(selector: string, createAttr: string, createValue: string): HTMLMetaElement {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(createAttr, createValue);
    document.head.appendChild(el);
  }
  return el;
}

function getOrCreateLink(rel: string): HTMLLinkElement {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  return el;
}

export function useSEO({ title, description, canonical, ogTitle, ogDescription }: SEOOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const descEl = getOrCreateMeta('meta[name="description"]', "name", "description");
    const prevDesc = descEl.getAttribute("content") || "";
    descEl.setAttribute("content", description);

    const ogTitleEl = getOrCreateMeta('meta[property="og:title"]', "property", "og:title");
    const prevOgTitle = ogTitleEl.getAttribute("content") || "";
    ogTitleEl.setAttribute("content", ogTitle || title);

    const ogDescEl = getOrCreateMeta('meta[property="og:description"]', "property", "og:description");
    const prevOgDesc = ogDescEl.getAttribute("content") || "";
    ogDescEl.setAttribute("content", ogDescription || description);

    let prevCanonical = "";
    let prevOgUrl = "";
    if (canonical) {
      const fullUrl = `${BASE_URL}${canonical}`;
      const canonicalEl = getOrCreateLink("canonical");
      prevCanonical = canonicalEl.href;
      canonicalEl.href = fullUrl;

      const ogUrlEl = getOrCreateMeta('meta[property="og:url"]', "property", "og:url");
      prevOgUrl = ogUrlEl.getAttribute("content") || "";
      ogUrlEl.setAttribute("content", fullUrl);
    }

    return () => {
      document.title = prevTitle;
      descEl.setAttribute("content", prevDesc);
      ogTitleEl.setAttribute("content", prevOgTitle);
      ogDescEl.setAttribute("content", prevOgDesc);
      if (canonical) {
        const canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
        if (canonicalEl) canonicalEl.href = prevCanonical;
        const ogUrlEl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
        if (ogUrlEl) ogUrlEl.setAttribute("content", prevOgUrl);
      }
    };
  }, [title, description, canonical, ogTitle, ogDescription]);
}
