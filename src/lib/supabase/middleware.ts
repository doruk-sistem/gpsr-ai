import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Kullanıcı giriş yapmamışsa ve dashboard'a erişmeye çalışıyorsa
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Kullanıcı giriş yapmışsa ve auth sayfalarına erişmeye çalışıyorsa
  if (user && request.nextUrl.pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Kullanıcı giriş yapmışsa ve dashboard sayfasına erişmeye çalışıyorsa
  if (user && request.nextUrl.pathname.startsWith("/dashboard")) {
    // Profil bilgileri eksikse ve complete-profile sayfasında değilse
    if (
      (!user?.user_metadata.first_name ||
        !user?.user_metadata.last_name ||
        !user?.user_metadata.company) &&
      request.nextUrl.pathname !== "/dashboard/complete-profile"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/complete-profile";
      return NextResponse.redirect(url);
    }

    // Profil bilgileri tamamsa ve complete-profile sayfasındaysa
    if (
      user?.user_metadata.first_name &&
      user?.user_metadata.last_name &&
      user?.user_metadata.company &&
      request.nextUrl.pathname === "/dashboard/complete-profile"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // Kullanıcı giriş yapmışsa ve bir ücretli plan seçmemişse
    const privatePaths = [
      "/dashboard/products",
      "/dashboard/manufacturer",
      "/dashboard/representative",
    ];

    if (
      !user?.user_metadata?.package_id &&
      privatePaths.includes(request.nextUrl.pathname)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/billing";
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
