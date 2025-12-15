"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

interface Collection {
  id: string;
  label: string;
  slug: string;
  title: string;
  parent_id: string | null;
  order: number | null;
  children?: Collection[];
}

// Build hierarchical tree from flat array
function buildCategoryTree(collections: Collection[]): Collection[] {
  const map = new Map<string, Collection>();
  const roots: Collection[] = [];

  // Initialize map with all collections
  collections.forEach((col) => {
    map.set(col.id, { ...col, children: [] });
  });

  // Build tree structure
  collections.forEach((col) => {
    const node = map.get(col.id)!;
    if (col.parent_id && map.has(col.parent_id)) {
      const parent = map.get(col.parent_id)!;
      parent.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  // Sort by order
  const sortByOrder = (a: Collection, b: Collection) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    return orderB - orderA; // DESC order
  };

  roots.sort(sortByOrder);
  roots.forEach((root) => {
    if (root.children && root.children.length > 0) {
      root.children.sort(sortByOrder);
      // Sort nested children recursively
      root.children.forEach((child) => {
        if (child.children && child.children.length > 0) {
          child.children.sort(sortByOrder);
        }
      });
    }
  });

  return roots;
}

// Component to render subcategories recursively
function SubcategoryList({ categories }: { categories: Collection[] }) {
  return (
    <div className="grid gap-2 p-4 w-[400px]">
      {categories.map((category) => (
        <div key={category.id} className="space-y-1">
          <Link
            href={`/collections/${category.slug}`}
            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-primary focus:bg-accent focus:text-accent-foreground"
          >
            <div className="text-sm font-medium leading-none">
              {category.label}
            </div>
            {category.title && (
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {category.title}
              </p>
            )}
          </Link>
          {category.children && category.children.length > 0 && (
            <div className="ml-4 border-l-2 border-primary-100 pl-4">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/collections/${child.slug}`}
                  className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent/50 hover:text-accent-foreground"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface CategoriesSubNavClientProps {
  categories: Collection[];
}

function CategoriesSubNavClient({ categories }: CategoriesSubNavClientProps) {
  const categoryTree = buildCategoryTree(categories);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const pathname = usePathname();

  const handleMouseEnter = (categoryId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMenu(categoryId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  if (categoryTree.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b border-primary-200 fixed top-[73px] z-40 w-full shadow-sm hidden md:block">
      <div className="max-w-screen-2xl mx-auto px-4 flex justify-center">
        <NavigationMenu value={activeMenu || undefined}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                href="/shop"
                className={`inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium text-primary transition-colors border-b-[3px] ${
                  pathname === "/shop" ? "border-accent" : "border-transparent"
                } hover:border-accent focus:outline-none`}
              >
                Ver todos
              </Link>
            </NavigationMenuItem>
            {categoryTree.map((category) => {
              const isActive = pathname === `/collections/${category.slug}`;
              const isHovered = activeMenu === category.id;
              const showBorder = isActive || isHovered;

              return (
                <NavigationMenuItem
                  key={category.id}
                  value={category.id}
                  onMouseEnter={() => handleMouseEnter(category.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {category.children && category.children.length > 0 ? (
                    <>
                      <Link
                        href={`/collections/${category.slug}`}
                        className={`inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium text-primary transition-colors border-b-[3px] ${
                          showBorder ? "border-accent" : "border-transparent"
                        } hover:border-accent focus:outline-none`}
                      >
                        {category.label}
                      </Link>
                      <NavigationMenuContent
                        onMouseEnter={() => handleMouseEnter(category.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <SubcategoryList categories={category.children} />
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link
                      href={`/collections/${category.slug}`}
                      className={`inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium text-primary transition-colors border-b-[3px] ${
                        showBorder ? "border-accent" : "border-transparent"
                      } hover:border-accent focus:outline-none`}
                    >
                      {category.label}
                    </Link>
                  )}
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}

export default CategoriesSubNavClient;
