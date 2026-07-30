// middleware for all endpoints

import { clerkMiddleware ,createRouteMatcher} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// the routes that can be acces without token
const  isPublicRoute=createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/home",
  "/"
])

// the api routes that can be acces without token
const isPublicApiRoute=createRouteMatcher([
 "/api/videos"
]) 
export default   clerkMiddleware(async(auth,req)=>
{
   console.log("Middleware:", req.nextUrl.pathname);
   const {userId}=await auth();
   const currentUrl=new URL(req.url);
  const isHomePage=currentUrl.pathname==="/home"

  // if the user is logged in (has token) then he cant access the public routes except the home route
  if(userId&&isPublicRoute(req)&&!isHomePage)
  {
    return  NextResponse.redirect(new URL("/home",req.url));
  }
  if(!userId)
    {
      // if the user in not logged in then he cant access any private route
      if(!isPublicApiRoute(req)&&!isPublicRoute(req))
        {
      return  NextResponse.redirect(new URL("/sign-in",req.url));
    }
  }
  // giving control to next section
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
