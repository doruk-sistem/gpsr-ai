import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-muted py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Frequently Asked Questions
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground">
                Find answers to common questions about GPSR compliance and our services
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-16 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8">About GPSR</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is GPSR?</AccordionTrigger>
                  <AccordionContent>
                    The General Product Safety Regulation (GPSR) is an EU regulation that replaces the General Product Safety Directive (GPSD). It aims to ensure that all consumer products sold in the EU market are safe. GPSR introduces stricter requirements for manufacturers, importers, and online sellers, with special focus on product traceability and accountability.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>When does GPSR come into effect?</AccordionTrigger>
                  <AccordionContent>
                    GPSR will be fully enforced starting December 13, 2024. However, companies are encouraged to prepare for compliance well in advance of this deadline.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Who needs to comply with GPSR?</AccordionTrigger>
                  <AccordionContent>
                    GPSR applies to all businesses involved in the supply chain of consumer products sold in the EU market. This includes manufacturers, importers, distributors, and online marketplaces. If you sell products to EU consumers, regardless of where your business is located, you need to comply with GPSR.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>What products are covered by GPSR?</AccordionTrigger>
                  <AccordionContent>
                    GPSR covers almost all consumer products, with some exceptions for products already covered by specific sectoral legislation (e.g., medical devices, pharmaceuticals, food). Generally, if you sell consumer goods like clothing, toys, electronics, household items, or similar products, they are likely covered by GPSR.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>What happens if I don't comply with GPSR?</AccordionTrigger>
                  <AccordionContent>
                    Non-compliance with GPSR can result in severe penalties, including fines of up to 4% of annual turnover in the EU or €10 million (whichever is higher), product recalls, and market access restrictions. In addition, non-compliance can damage your brand reputation and lead to loss of consumer trust.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Authorized Representative</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-6">
                  <AccordionTrigger>What is an EU Authorized Representative?</AccordionTrigger>
                  <AccordionContent>
                    An EU Authorized Representative is a legally designated entity based in the European Union that acts on behalf of non-EU manufacturers or sellers to fulfill certain regulatory obligations. Under GPSR, non-EU economic operators must designate an Authorized Representative in the EU to ensure compliance with the regulation.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7">
                  <AccordionTrigger>Do I need an Authorized Representative?</AccordionTrigger>
                  <AccordionContent>
                    If you are a manufacturer, importer, or seller based outside the EU but selling products to the EU market, you are required to have an Authorized Representative located within the EU. If your business is already established in the EU, you typically don't need an Authorized Representative.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8">
                  <AccordionTrigger>What does an Authorized Representative do?</AccordionTrigger>
                  <AccordionContent>
                    An Authorized Representative's responsibilities include:
                    <ul className="list-disc ml-5 mt-2">
                      <li>Maintaining technical documentation for your products</li>
                      <li>Cooperating with market surveillance authorities</li>
                      <li>Taking action when products are found to be non-compliant</li>
                      <li>Providing a physical address in the EU for your product labeling</li>
                      <li>Acting as a point of contact for EU authorities</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-9">
                  <AccordionTrigger>How do I appoint DorukWell as my Authorized Representative?</AccordionTrigger>
                  <AccordionContent>
                    The process is simple:
                    <ol className="list-decimal ml-5 mt-2">
                      <li>Sign up on our platform and select an appropriate plan</li>
                      <li>Enter your company and product information</li>
                      <li>Upload required documentation</li>
                      <li>Digitally sign the Authorized Representative mandate</li>
                      <li>We'll confirm your appointment and provide documentation</li>
                    </ol>
                    Once appointed, you can use our EU address on your product labels and documentation.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Our Services</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-10">
                  <AccordionTrigger>What services does DorukWell provide?</AccordionTrigger>
                  <AccordionContent>
                    We provide a comprehensive suite of GPSR compliance services, including:
                    <ul className="list-disc ml-5 mt-2">
                      <li>EU Authorized Representative services</li>
                      <li>Technical documentation storage and management</li>
                      <li>Digital authorization signing</li>
                      <li>Compliance support and guidance</li>
                      <li>Product registry and management</li>
                      <li>Deadline tracking and notifications</li>
                    </ul>
                    Our goal is to simplify GPSR compliance for businesses of all sizes.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-11">
                  <AccordionTrigger>How much does it cost to use your services?</AccordionTrigger>
                  <AccordionContent>
                    Our pricing is based on the number of product types you sell in the EU. We offer several plans:
                    <ul className="list-disc ml-5 mt-2">
                      <li>GPSR 1: €349/year for businesses with 1 product type</li>
                      <li>GPSR 6: €699/year for businesses with up to 6 product types</li>
                      <li>GPSR Enterprise: Custom pricing for businesses with 7+ product types</li>
                    </ul>
                    Monthly payment options are also available. Visit our <Link href="/pricing" className="text-primary hover:underline">pricing page</Link> for more details.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-12">
                  <AccordionTrigger>What is a "product type"?</AccordionTrigger>
                  <AccordionContent>
                    A "product type" refers to a group of products that share the same essential characteristics, have identical safety considerations, and can be covered by the same technical documentation. For example, t-shirts in different colors and sizes would be considered one product type, while t-shirts and jeans would be two different product types.
                    <p className="mt-2">
                      For a detailed explanation, please visit our <Link href="/pricing#product-type" className="text-primary hover:underline">product type definition</Link> section.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-13">
                  <AccordionTrigger>How quickly can I get set up?</AccordionTrigger>
                  <AccordionContent>
                    Most clients can complete the setup process within 1-2 business days. The process includes creating an account, providing company and product information, uploading documentation, and signing the authorization. Once we verify your information, your Authorized Representative appointment will be confirmed, and you'll receive all necessary documentation.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-14">
                  <AccordionTrigger>What documents do I need to provide?</AccordionTrigger>
                  <AccordionContent>
                    The required documents typically include:
                    <ul className="list-disc ml-5 mt-2">
                      <li>Technical product documentation</li>
                      <li>Safety test reports (if available)</li>
                      <li>Product labels and packaging</li>
                      <li>User manuals/instructions</li>
                      <li>Company registration documents</li>
                    </ul>
                    Our platform will guide you through the specific documents needed for your products.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Technical & Account Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-15">
                  <AccordionTrigger>How secure is my data on your platform?</AccordionTrigger>
                  <AccordionContent>
                    We take data security extremely seriously. Our platform uses industry-standard encryption for all data transmission and storage. We implement strict access controls, regular security audits, and comply with GDPR and other relevant data protection regulations. Your business and product information is never shared with third parties without your explicit consent.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-16">
                  <AccordionTrigger>Can I cancel my subscription?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can cancel your subscription at any time. For monthly plans, your service will continue until the end of the current billing period. For annual plans, we offer a 30-day money-back guarantee for new subscribers. Please note that if you cancel, we will no longer serve as your Authorized Representative, and you'll need to make alternative arrangements to maintain GPSR compliance.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-17">
                  <AccordionTrigger>What happens if GPSR requirements change?</AccordionTrigger>
                  <AccordionContent>
                    We continuously monitor regulatory changes and updates to GPSR. If requirements change, we'll notify all clients and provide guidance on any additional steps needed for compliance. Our platform is regularly updated to ensure it meets the latest regulatory standards.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-18">
                  <AccordionTrigger>Can I upgrade or downgrade my plan?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can change your plan at any time through your account dashboard. When upgrading, you'll be charged the prorated difference for the remainder of your billing period. When downgrading, the new rate will apply at your next billing cycle.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-19">
                  <AccordionTrigger>How can I get additional help?</AccordionTrigger>
                  <AccordionContent>
                    If you have questions that aren't answered here, you can:
                    <ul className="list-disc ml-5 mt-2">
                      <li>Contact our support team via email or chat</li>
                      <li>Schedule a consultation with our compliance experts</li>
                      <li>Visit our <Link href="/contact" className="text-primary hover:underline">contact page</Link> for more options</li>
                    </ul>
                    Enterprise clients also have access to a dedicated account manager who can provide personalized assistance.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-background rounded-lg shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our team is ready to help with any additional questions about GPSR compliance or our services
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg">Contact Us</Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline">Get Started</Button>
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