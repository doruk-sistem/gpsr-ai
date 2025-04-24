import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* 404 Text */}
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="text-4xl font-bold text-primary">Page Not Found</h2>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-lg">
          The page you are looking for could not be found. It might have been
          moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/support">
            <Button className="w-full sm:w-auto">Contact Support</Button>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Need help?</p>
          <p className="mt-2">
            Visit our{" "}
            <Link
              href="/dashboard/support"
              className="text-primary hover:underline"
            >
              support page
            </Link>{" "}
            or send an email to{" "}
            <Link
              href="mailto:support@dorukwell.com"
              className="text-primary hover:underline"
            >
              support@dorukwell.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
