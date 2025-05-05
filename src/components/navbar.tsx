"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Menu, X, LogOut, User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useCurrentUser } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutConfirmation } from "./logout-confirmation/logout-confirmation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useCurrentUser();

  // Track scroll position to add background when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About GPSR", href: "/about-gpsr" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm transition-all",
        scrolled ? "border-b border-border shadow-sm" : ""
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">DorukWell</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4 lg:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors",
                    pathname === item.href
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    {user.user_metadata?.first_name
                      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name?.charAt(0) || ""}.`
                      : user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account")}>
                      Account Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsLogoutDialogOpen(true)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Start Free Trial</Button>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsLogoutDialogOpen(true)}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary ml-2"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-background"
          id="mobile-menu"
        >
          <div className="px-2 pb-3 pt-20 space-y-1 h-full overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block pl-3 pr-4 py-3 text-base font-medium border-l-4 rounded-r-md transition-colors",
                  pathname === item.href
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:bg-muted hover:border-border hover:text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-6 pb-3 border-t border-border px-5 space-y-4">
              {user ? (
                <>
                  <Button 
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/dashboard");
                    }}
                    className="w-full" 
                    variant="outline"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsOpen(false);
                      setIsLogoutDialogOpen(true);
                    }}
                    className="w-full"
                    variant="destructive"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block w-full">
                    <Button variant="outline" className="w-full py-5 text-base">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="block w-full">
                    <Button className="w-full py-5 text-base">Start Free Trial</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Shared Logout Confirmation Component */}
      <LogoutConfirmation 
        isOpen={isLogoutDialogOpen} 
        setIsOpen={setIsLogoutDialogOpen} 
      />
    </nav>
  );
}