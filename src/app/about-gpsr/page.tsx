import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarClock,
  Check,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Clock,
} from "lucide-react";

export default function AboutGPSR() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-muted py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                About GPSR
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-xl text-muted-foreground">
                Understanding the EU General Product Safety Regulation and its
                impact on your business
              </p>
            </div>
          </div>
        </section>

        {/* What is GPSR Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  What is GPSR?
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  The General Product Safety Regulation (GPSR) is a
                  comprehensive EU regulation that replaces the previous General
                  Product Safety Directive (GPSD). It aims to ensure that all
                  products sold in the EU market are safe for consumers.
                </p>
                <p className="mt-4 text-lg text-muted-foreground">
                  GPSR introduces stricter requirements for economic operators,
                  including manufacturers, importers, and distributors, with a
                  focus on online marketplaces and digital products.
                </p>
                <div className="mt-8 flex items-center space-x-4">
                  <CalendarClock className="h-12 w-12 text-primary" />
                  <div>
                    <h3 className="font-medium">Enforcement Date</h3>
                    <p className="text-muted-foreground">December 13, 2024</p>
                  </div>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4">Key Features of GPSR</h3>
                <ul className="space-y-4">
                  <li className="flex">
                    <Check className="h-6 w-6 text-primary mr-3 shrink-0" />
                    <span>Enhanced protection for EU consumers</span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 text-primary mr-3 shrink-0" />
                    <span>Stronger market surveillance</span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 text-primary mr-3 shrink-0" />
                    <span>Traceability requirements for all products</span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 text-primary mr-3 shrink-0" />
                    <span>Specific rules for online marketplaces</span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 text-primary mr-3 shrink-0" />
                    <span>
                      Mandatory appointment of an EU representative for non-EU
                      manufacturers
                    </span>
                  </li>
                  <li className="flex">
                    <Check className="h-6 w-6 text-primary mr-3 shrink-0" />
                    <span>
                      Standardized product safety assessment methodology
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Who Needs to Comply Section */}
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Who Needs to Comply with GPSR?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Manufacturers</h3>
                  <p className="text-muted-foreground mb-4">
                    Any entity that manufactures a product or has a product
                    designed or manufactured and markets it under their name or
                    trademark.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Must ensure products are safe</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Must provide technical documentation</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Must establish traceability</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Importers</h3>
                  <p className="text-muted-foreground mb-4">
                    Any entity established in the EU that places a product from
                    a third country on the EU market.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Must verify manufacturer compliance</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>
                        Must ensure product documentation is available
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Must ensure products are properly marked</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Online Sellers</h3>
                  <p className="text-muted-foreground mb-4">
                    Anyone selling products online to EU consumers, including
                    marketplace sellers and dropshippers.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Must ensure products meet EU safety standards</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>
                        Must have an EU representative if outside the EU
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Must respond to consumer reports</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Key GPSR Requirements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-muted rounded-lg p-8">
                <div className="flex items-center mb-6">
                  <ShieldCheck className="h-10 w-10 text-primary mr-3" />
                  <h3 className="text-xl font-bold">Product Safety</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <span>
                      Products must be designed and manufactured to be safe
                      throughout their lifecycle
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <span>
                      Products must comply with all applicable EU safety
                      standards
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <span>
                      Risk assessment must be performed and documented
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted rounded-lg p-8">
                <div className="flex items-center mb-6">
                  <FileText className="h-10 w-10 text-primary mr-3" />
                  <h3 className="text-xl font-bold">Documentation</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <span>
                      Technical documentation must be maintained for 10 years
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <span>Declaration of Conformity must be issued</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <span>
                      Clear instructions and safety information must be provided
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted rounded-lg p-8">
                <div className="flex items-center mb-6">
                  <AlertTriangle className="h-10 w-10 text-primary mr-3" />
                  <h3 className="text-xl font-bold">Incident Reporting</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <span>
                      Accidents and safety incidents must be reported to
                      authorities
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <span>
                      Systems must be in place to collect and monitor product
                      safety data
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <span>Product recalls must be managed efficiently</span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted rounded-lg p-8">
                <div className="flex items-center mb-6">
                  <Clock className="h-10 w-10 text-primary mr-3" />
                  <h3 className="text-xl font-bold">EU Representation</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <span>
                      Non-EU manufacturers must designate an EU Authorized
                      Representative
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <span>
                      The representative must maintain technical documentation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-3 mt-0.5 shrink-0" />
                    <span>
                      The representative interacts with market surveillance
                      authorities
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Non-Compliance Risks Section */}
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-6">
              Risks of Non-Compliance
            </h2>
            <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
              Failing to comply with GPSR can result in serious consequences for
              your business
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-destructive/20">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <AlertTriangle className="h-6 w-6 text-destructive mr-2" />
                    Financial Penalties
                  </h3>
                  <p className="text-muted-foreground">
                    Significant fines can be imposed for non-compliance, up to
                    4% of annual turnover in the EU or €10 million, whichever is
                    higher.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-destructive/20">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <AlertTriangle className="h-6 w-6 text-destructive mr-2" />
                    Product Recalls
                  </h3>
                  <p className="text-muted-foreground">
                    Authorities can order the withdrawal or recall of
                    non-compliant products from the EU market, resulting in
                    substantial costs and damage to reputation.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-destructive/20">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <AlertTriangle className="h-6 w-6 text-destructive mr-2" />
                    Market Access Restrictions
                  </h3>
                  <p className="text-muted-foreground">
                    Your products may be banned from the EU market, cutting off
                    access to 450 million consumers and causing significant
                    revenue loss.
                  </p>
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
                Don&apos;t risk non-compliance
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-primary-foreground/80 mx-auto">
                Our Authorized Representative service helps you meet all GPSR
                requirements before the December 2024 deadline.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" variant="secondary">
                    Get Started Now
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Our Services
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
