import { AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import Markdown from "../ui/markdown";

interface ComplianceResultsProps {
  query: string;
  onReset: () => void;
  results: string;
}

export default function ComplianceResults({
  query,
  results,
}: ComplianceResultsProps) {
  const router = useRouter();

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 text-left animate-fade-in">
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold">GPSR Compliance Analysis</h2>
          <p className="text-base text-muted-foreground">
            Results for: <span className="font-bold text-primary">{query}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="p-6 border rounded-lg prose prose-gray max-w-none">
          <Markdown>{results}</Markdown>
        </div>
      </div>

      <div className="bg-muted/20 p-6 rounded-lg border mb-6 space-y-10">
        <h3 className="text-xl font-bold text-center">
          For a comprehensive compliance assessment:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Analysis</h3>
            <p className="text-muted-foreground">
              Get immediate insights into your product&apos;s GPSR compliance
              status with our AI-powered analysis system.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Comprehensive Check</h3>
            <p className="text-muted-foreground">
              Our system checks against all relevant GPSR requirements, EU
              directives, and UK regulations.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Risk Assessment</h3>
            <p className="text-muted-foreground">
              Identify potential compliance gaps and get actionable
              recommendations to address them.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.push("/auth/register")}
            className="flex-grow"
          >
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  );
}
