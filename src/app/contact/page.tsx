import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Mail, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-muted py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Contact Us
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground">
                Get in touch with our team for any questions about GPSR compliance or our services
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold mb-6">Send us a message</h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and our team will get back to you as soon as possible.
                </p>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium">
                        First name
                      </label>
                      <Input id="first-name" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium">
                        Last name
                      </label>
                      <Input id="last-name" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium">
                      Company
                    </label>
                    <Input id="company" placeholder="Your Company" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input id="subject" placeholder="How can we help you?" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea id="message" placeholder="Please provide details about your inquiry..." rows={5} />
                  </div>
                  
                  <Button className="w-full" size="lg">
                    Send Message
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    By submitting this form, you agree to our{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              </div>
              
              {/* Contact Info */}
              <div>
                <div className="sticky top-24">
                  <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
                  
                  <div className="space-y-8">
                    <Card className="p-6">
                      <div className="flex items-start">
                        <Mail className="h-6 w-6 text-primary mr-4 mt-1" />
                        <div>
                          <h3 className="font-medium mb-1">Email Us</h3>
                          <p className="text-muted-foreground mb-3">
                            For general inquiries and support
                          </p>
                          <a href="mailto:info@dorukwell.eu" className="text-primary hover:underline">
                            info@dorukwell.eu
                          </a>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-6">
                      <div className="flex items-start">
                        <Phone className="h-6 w-6 text-primary mr-4 mt-1" />
                        <div>
                          <h3 className="font-medium mb-1">Call Us</h3>
                          <p className="text-muted-foreground mb-3">
                            Mon-Fri from 9:00 to 18:00 CET
                          </p>
                          <a href="tel:+351123456789" className="text-primary hover:underline">
                            +351 123 456 789
                          </a>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-6">
                      <div className="flex items-start">
                        <MessageSquare className="h-6 w-6 text-primary mr-4 mt-1" />
                        <div>
                          <h3 className="font-medium mb-1">Live Chat</h3>
                          <p className="text-muted-foreground mb-3">
                            Available for quick questions
                          </p>
                          <Button variant="outline">
                            Start Chat
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="mt-12">
                    <h3 className="text-xl font-bold mb-4">Our Office</h3>
                    <p className="text-muted-foreground mb-4">
                      DorukWell EU Authorized Representative<br />
                      Avenida da Liberdade 110<br />
                      1269-046 Lisbon<br />
                      Portugal
                    </p>
                    
                    <div className="bg-muted rounded-lg h-64 flex items-center justify-center border">
                      <p className="text-muted-foreground">
                        Map will be displayed here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Preview Section */}
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Find quick answers to common questions before reaching out
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-3">What is GPSR?</h3>
                <p className="text-muted-foreground mb-3">
                  The General Product Safety Regulation is an EU regulation ensuring consumer products sold in the EU market are safe.
                </p>
                <Link href="/faq" className="text-primary hover:underline text-sm font-medium">
                  Learn more →
                </Link>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-3">Do I need an Authorized Representative?</h3>
                <p className="text-muted-foreground mb-3">
                  If you're a non-EU manufacturer or seller marketing products in the EU, you need an Authorized Representative.
                </p>
                <Link href="/faq" className="text-primary hover:underline text-sm font-medium">
                  Learn more →
                </Link>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-3">How much does your service cost?</h3>
                <p className="text-muted-foreground mb-3">
                  Our pricing is based on the number of product types you sell, starting from €349/year for one product type.
                </p>
                <Link href="/pricing" className="text-primary hover:underline text-sm font-medium">
                  View pricing →
                </Link>
              </Card>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/faq">
                <Button variant="outline">View All FAQs</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}