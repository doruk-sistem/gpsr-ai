import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileCheck, MessageSquare, Clock, UserCheck, Database, CheckCircle2 } from "lucide-react";

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-muted py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Our Services
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-xl text-muted-foreground">
                Comprehensive solutions to meet your GPSR compliance needs and ensure smooth access to the EU market
              </p>
            </div>
          </div>
        </section>

        {/* Core Services Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Core Services</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <Shield className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>EU Authorized Representative</CardTitle>
                  <CardDescription>
                    Legal representation within the EU as required by GPSR
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Legal entity based in the EU</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Liaison with market surveillance authorities</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Technical documentation management</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Product label compliance verification</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Representative address for product labels</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <FileCheck className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Document Management</CardTitle>
                  <CardDescription>
                    Secure storage and management of compliance documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Secure digital document storage</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Declaration of Conformity templates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Document completeness verification</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Document expiration tracking</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Quick access during inspections</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <UserCheck className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Digital Authorization</CardTitle>
                  <CardDescription>
                    Paperless mandate signing and authorization management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Legally binding digital signatures</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Customized mandate templates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Multi-product authorization</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Authorization certificates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>Mandate renewal management</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Additional Services Section */}
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Additional Services</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <MessageSquare className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">Compliance Support</h3>
                  <p className="text-muted-foreground mb-4">
                    Expert guidance on GPSR requirements and how they apply to your products.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Email support</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Document review</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Compliance guidance</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <Clock className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">Deadline Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Stay on track with GPSR implementation deadlines and requirements.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Timeline planning</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Reminder notifications</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Expedited processing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <Database className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">Product Registry</h3>
                  <p className="text-muted-foreground mb-4">
                    Centralized platform to manage all your products and their compliance status.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Product database</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Compliance tracking</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Status reporting</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Enterprise Services Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-foreground mb-6">Enterprise Services</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  For businesses with complex needs or large product portfolios, we offer customized enterprise solutions
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-8">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-primary mr-3 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">Dedicated Account Manager</h3>
                      <p className="text-sm text-muted-foreground">Personal support for all your compliance needs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-primary mr-3 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">Priority Support</h3>
                      <p className="text-sm text-muted-foreground">Fast response times for urgent matters</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-primary mr-3 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">Bulk Product Management</h3>
                      <p className="text-sm text-muted-foreground">Efficiently handle large product catalogs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-primary mr-3 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">Custom Integration</h3>
                      <p className="text-sm text-muted-foreground">API access to integrate with your systems</p>
                    </div>
                  </div>
                </div>
                
                <Link href="/contact">
                  <Button size="lg">Contact Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-6">How Our Services Work</h2>
            <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
              A simple, streamlined process to get you compliant with GPSR quickly
            </p>
            
            <div className="relative">
              {/* Connector Line (hidden on mobile) */}
              <div className="hidden md:block absolute left-1/2 top-24 bottom-24 w-0.5 bg-border -translate-x-1/2 z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Step 1 */}
                <div className="md:text-right md:pr-16">
                  <div className="bg-background rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold mb-3">1. Sign Up & Choose a Plan</h3>
                    <p className="text-muted-foreground">
                      Register for an account and select the service plan that matches your needs based on your product types.
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-start">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-md">1</div>
                </div>
                
                {/* Step 2 */}
                <div className="hidden md:flex items-center justify-end">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-md">2</div>
                </div>
                <div className="md:text-left md:pl-16">
                  <div className="bg-background rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold mb-3">2. Add Your Products</h3>
                    <p className="text-muted-foreground">
                      Enter details about your products, including descriptions, categories, and other information required for compliance.
                    </p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="md:text-right md:pr-16">
                  <div className="bg-background rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold mb-3">3. Upload Documents</h3>
                    <p className="text-muted-foreground">
                      Upload technical documentation, test reports, and other required documents for each product.
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-start">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-md">3</div>
                </div>
                
                {/* Step 4 */}
                <div className="hidden md:flex items-center justify-end">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-md">4</div>
                </div>
                <div className="md:text-left md:pl-16">
                  <div className="bg-background rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold mb-3">4. Sign Authorization</h3>
                    <p className="text-muted-foreground">
                      Digitally sign the Authorized Representative mandate to formalize the appointment.
                    </p>
                  </div>
                </div>
                
                {/* Step 5 */}
                <div className="md:text-right md:pr-16">
                  <div className="bg-background rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold mb-3">5. Get Compliant</h3>
                    <p className="text-muted-foreground">
                      Receive your compliance documentation, including confirmation of Authorized Representative appointment and product registration.
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-start">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-md">5</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-primary-foreground sm:text-4xl">
                Ready to secure your EU market access?
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-primary-foreground/80 mx-auto">
                Try our service free for 14 days and get compliant with GPSR before the December 2024 deadline
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth/register">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">Start Free Trial</Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                    View Pricing
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