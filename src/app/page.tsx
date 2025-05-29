"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Shield, Clock, FileCheck, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ComplianceChecker from "@/components/compliance-checker";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* GPSR Compliance Checker Section */}
        <section className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-muted pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                Instant GPSR Compliance Check
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Reduce compliance risks by 80% - Verify EU & UK product safety
                requirements in seconds
              </p>

              {/* Enhanced Search Bar Component */}
              <ComplianceChecker />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                Why Choose DorukWell?
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
                Our platform offers everything you need to meet GPSR
                requirements
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <Shield className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>EU Representation</CardTitle>
                  <CardDescription>
                    We act as your legal representative within the EU as
                    mandated by GPSR
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Legal entity within the EU</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Product registration with authorities</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Communication with market surveillance</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <FileCheck className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Document Management</CardTitle>
                  <CardDescription>
                    Secure storage and management of all your compliance
                    documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Technical documentation storage</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Declaration of Conformity templates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Document review and guidance</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <Clock className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Deadline Support</CardTitle>
                  <CardDescription>
                    Be ready before the December 13, 2024 GPSR enforcement date
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Deadline tracking and reminders</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Expedited processing when needed</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Step-by-step compliance guidance</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
                Getting compliant with GPSR is simple with our streamlined
                process
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold">Sign Up</h3>
                <p className="mt-2 text-muted-foreground">
                  Create your account and select the package that fits your
                  needs
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold">Upload Documents</h3>
                <p className="mt-2 text-muted-foreground">
                  Provide your product information and upload required documents
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold">Sign Authorization</h3>
                <p className="mt-2 text-muted-foreground">
                  Digitally sign the Authorized Representative mandate
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-xl font-bold mb-4">
                  4
                </div>
                <h3 className="text-xl font-bold">Get Compliant</h3>
                <p className="mt-2 text-muted-foreground">
                  Receive your compliance documents and start selling in the EU
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-primary-foreground sm:text-4xl">
                Ready to comply with GPSR?
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-primary-foreground/80 mx-auto">
                The GPSR deadline is December 13, 2024. Start your compliance
                journey today.
              </p>
              <div className="mt-10">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
