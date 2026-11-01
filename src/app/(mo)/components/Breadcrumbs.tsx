import Link from "next/link";
import type { Crumb } from "@/lib/mocoinSeo";

// Visible breadcrumb trail; pair it with breadcrumbJsonLd for search engines.
export default function Breadcrumbs({ crumbs, className = "", linkClassName = "", currentClassName = "" }: { crumbs: Crumb[]; className?: string; linkClassName?: string; currentClassName?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className={currentClassName}>
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link href={crumb.path} className={linkClassName}>
                    {crumb.name}
                  </Link>
                  <span aria-hidden="true" className="opacity-50">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
