import React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { UserButton } from "@/components/UserButton";

interface NavigationBarProps {}

export const NavigationBar = ({}: NavigationBarProps) => {
  return (
    <div className="w-full bg-slate-50 shadow-md h-[80px] flex items-center justify-around">
      <h1 className="font-bold text-2xl">
        <Link href={"/"}>Watchly</Link>
      </h1>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-slate-50">
              Movies
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="gap-3 p-4 md:w-[150px] lg:w-[300px] lg:grid-cols-[.75fr_1fr]">
                <ListItem
                  href="/dashboard/movies/trending"
                  title="Trending Movies"
                >
                  See what's trending
                </ListItem>
                <ListItem
                  href="/dashboard/movies/latest-upcoming"
                  title="Latest and Upcoming"
                >
                  Go look for new releases and upcoming movies!
                </ListItem>
                <ListItem
                  href="/dashboard/movies/most-rated"
                  title="Most rated"
                >
                  See what others think about movies!
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-slate-50">
              TV Shows
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="gap-3 p-4 md:w-[150px] lg:w-[300px] lg:grid-cols-[.75fr_1fr]">
                <ListItem
                  href="/dashboard/shows/trending"
                  title="Trending TV Shows"
                >
                  See what's trending
                </ListItem>
                <ListItem
                  href="/dashboard/shows/latest-upcoming"
                  title="Latest and Upcoming"
                >
                  Go look for new releases and upcoming TV shows!
                </ListItem>
                <ListItem href="/dashboard/shows/most-rated" title="Most rated">
                  See what others think about TV shows!
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/dashboard/rate" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-slate-800 text-slate-50"
                )}
              >
                Rate
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <UserButton />
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
