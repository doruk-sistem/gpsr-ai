import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Clock, FileCheck, CreditCard, CheckCircle2, ArrowRight, Gift, Search, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* GPSR Compliance Checker Section */}
        <section className="bg-gradient-to-b from-primary/10 via-background to-muted pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                Instant GPSR Compliance Check
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Reduce compliance risks by 80% - Verify EU & UK product safety requirements in seconds
              </p>

              {/* Search Form */}
              <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <form>
                    <div className="flex flex-col md:flex-row p-2 gap-2">
                      <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          className="pl-12 pr-4 py-6 text-lg rounded-lg border-0 bg-muted/30 focus-visible:ring-primary"
                          placeholder="Enter your product details for instant GPSR compliance check"
                        />
                      </div>

                      <div className="flex md:flex-col lg:flex-row gap-2">
                        <div className="relative">
                          <input
                            type="file"
                            id="product-image"
                            className="sr-only"
                            accept="image/*"
                          />
                          <label
                            htmlFor="product-image"
                            className="flex items-center justify-center gap-2 h-12 px-4 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer text-sm font-medium"
                          >
                            <Upload className="h-4 w-4" />
                            <span className="whitespace-nowrap">Upload Image</span>
                          </label>
                        </div>

                        <Link href="/compliance-checker">
                          <Button className="h-12 px-6 w-full">
                            Check Compliance Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </form>

                  {/* Sample Questions */}
                  <div className="p-4 bg-muted/10 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Link href="/compliance-checker?q=Is+my+children's+toy+compliant+with+GPSR+safety+standards" className="text-left text-sm text-muted-foreground hover:text-primary truncate transition-colors px-2 py-1 rounded-md hover:bg-muted/30">
                        <Search className="inline-block h-3 w-3 mr-2 text-primary" />
                        Is my children's toy compliant with GPSR safety standards?
                      </Link>
                      <Link href="/compliance-checker?q=What+documentation+do+I+need+for+EU+market+access" className="text-left text-sm text-muted-foreground hover:text-primary truncate transition-colors px-2 py-1 rounded-md hover:bg-muted/30">
                        <Search className="inline-block h-3 w-3 mr-2 text-primary" />
                        What documentation do I need for EU market access?
                      </Link>
                      <Link href="/compliance-checker?q=Are+my+product+labels+GPSR+compliant" className="text-left text-sm text-muted-foreground hover:text-primary truncate transition-colors px-2 py-1 rounded-md hover:bg-muted/30">
                        <Search className="inline-block h-3 w-3 mr-2 text-primary" />
                        Are my product labels GPSR compliant?
                      </Link>
                      <Link href="/compliance-checker?q=Do+I+need+additional+testing+for+UK+market" className="text-left text-sm text-muted-foreground hover:text-primary truncate transition-colors px-2 py-1 rounded-md hover:bg-muted/30">
                        <Search className="inline-block h-3 w-3 mr-2 text-primary" />
                        Do I need additional testing for UK market?
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted/30 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                <span className="block">Simplify Your</span>
                <span className="block text-primary">GPSR Compliance</span>
              </h2>
              <p className="mt-6 max-w-lg mx-auto text-xl text-muted-foreground sm:max-w-3xl">
                Secure EU market access with our complete Authorized Representative and GPSR compliance services. Stay compliant, stay competitive.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">Start Free Trial</Button>
                </Link>
                <Link href="/about-gpsr">
                  <Button size="lg" variant="outline">Learn More</Button>
                </Link>
              </div>
              <div className="mt-8 text-sm text-muted-foreground">
                Already a customer?{" "}
                <Link href="/auth/login" className="font-medium text-primary hover:underline">
                  Log in
                </Link>
              </div>
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
                Our platform offers everything you need to meet GPSR requirements
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <Shield className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>EU Representation</CardTitle>
                  <CardDescription>
                    We act as your legal representative within the EU as mandated by GPSR
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
                    Secure storage and management of all your compliance documents
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
                Getting compliant with GPSR is simple with our streamlined process
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-xl font-bold mb-4">1</div>
                <h3 className="text-xl font-bold">Sign Up</h3>
                <p className="mt-2 text-muted-foreground">Create your account and select the package that fits your needs</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-xl font-bold mb-4">2</div>
                <h3 className="text-xl font-bold">Upload Documents</h3>
                <p className="mt-2 text-muted-foreground">Provide your product information and upload required documents</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-xl font-bold mb-4">3</div>
                <h3 className="text-xl font-bold">Sign Authorization</h3>
                <p className="mt-2 text-muted-foreground">Digitally sign the Authorized Representative mandate</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-xl font-bold mb-4">4</div>
                <h3 className="text-xl font-bold">Get Compliant</h3>
                <p className="mt-2 text-muted-foreground">Receive your compliance documents and start selling in the EU</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section Preview */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
                Choose the plan that fits your business needs
              </p>
            </div>

            {/* Free Trial Banner */}
            <div className="mt-8 max-w-3xl mx-auto bg-primary/10 border border-primary/20 rounded-xl p-5 flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex items-center text-center md:text-left">
                <Gift className="h-8 w-8 text-primary mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-primary">14-Day Free Trial</h3>
                  <p className="text-muted-foreground">Try free for 14 days, no credit card required</p>
                </div>
              </div>
              <Link href="/auth/register" className="md:ml-auto">
                <Button size="lg" className="font-medium">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <Card className="border shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <CardDescription className="mt-2">For businesses with up to 5 product types</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-3xl font-bold mb-4">£39<span className="text-lg text-muted-foreground ml-1">/month</span></div>
                  <div className="text-sm text-muted-foreground mb-6">or £390 billed annually</div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>EU REP compliance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>GPSR compliance</span>
                    </li>
                  </ul>
                  <Link href="/pricing" className="block w-full mt-6">
                    <Button className="w-full flex items-center justify-center">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/30 shadow-md hover:shadow-lg transition-shadow relative flex flex-col">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-bl-lg rounded-tr-lg">
                  Most Popular
                </div>
                <CardHeader>
                  <CardTitle>Growth</CardTitle>
                  <CardDescription className="mt-2">For businesses with up to 20 product types</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-3xl font-bold mb-4">£49<span className="text-lg text-muted-foreground ml-1">/month</span></div>
                  <div className="text-sm text-muted-foreground mb-6">or £490 billed annually</div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>EU REP compliance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>GPSR compliance</span>
                    </li>
                  </ul>
                  <Link href="/pricing" className="block w-full mt-6">
                    <Button className="w-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardHeader>
                  <CardTitle>Scale</CardTitle>
                  <CardDescription className="mt-2">For businesses with up to 50 product types</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-3xl font-bold mb-4">£59<span className="text-lg text-muted-foreground ml-1">/month</span></div>
                  <div className="text-sm text-muted-foreground mb-6">or £590 billed annually</div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>EU REP compliance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>GPSR compliance</span>
                    </li>
                  </ul>
                  <Link href="/pricing" className="block w-full mt-6">
                    <Button className="w-full flex items-center justify-center" variant="outline">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-6">
                Find more options for larger businesses with our Professional, Business, Enterprise, and Ultimate plans
              </p>
              <Link href="/pricing">
                <Button size="lg">
                  See All Pricing Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
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
                The GPSR deadline is December 13, 2024. Start your compliance journey today.
              </p>
              <div className="mt-10">
                <Link href="/auth/register">
                  <Button size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">Start Free Trial</Button>
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