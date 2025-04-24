import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Shield, Clock, FileCheck, CreditCard, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 via-background to-muted py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                <span className="block">Simplify Your</span>
                <span className="block text-primary">GPSR Compliance</span>
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-xl text-muted-foreground sm:max-w-3xl">
                Secure EU market access with our complete Authorized Representative and GPSR compliance services. Stay compliant, stay competitive.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
                </Link>
                <Link href="/about-gpsr">
                  <Button size="lg" variant="outline">Learn More</Button>
                </Link>
              </div>
              <div className="mt-8 text-sm text-muted-foreground">
                Already a customer?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
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

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <Card className="border shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                <CardHeader>
                  <CardTitle>GPSR 1</CardTitle>
                  <CardDescription className="mt-2">For businesses with 1 product type</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>1 product type</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>EU Authorized Representative</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Document storage</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Basic support</span>
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
                  <CardTitle>GPSR 6</CardTitle>
                  <CardDescription className="mt-2">For businesses with up to 6 product types</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Up to 6 product types</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>EU Authorized Representative</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Document storage & management</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Priority support</span>
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
                  <CardTitle>GPSR Enterprise</CardTitle>
                  <CardDescription className="mt-2">For businesses with 7+ product types</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Unlimited product types</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>EU Authorized Representative</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Advanced document management</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Dedicated account manager</span>
                    </li>
                  </ul>
                  <Link href="/contact" className="block w-full mt-6">
                    <Button className="w-full flex items-center justify-center" variant="outline">
                      Contact Sales
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
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
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">Get Started Now</Button>
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