"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Shield, HelpCircle, ArrowRight, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResponsiveContainer } from "@/components/responsive-container";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/cn";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState("annual");
  const [selectedTier, setSelectedTier] = useState("tier1");

  const handleBillingCycleChange = (value: string) => {
    setBillingCycle(value);
  };

  // Pricing data for all tiers
  const pricingTiers = [
    {
      id: "tier1",
      name: "Basic Plan",
      productLimit: "Up to 5 product types",
      monthlyPrice: 49,
      annualPrice: 499,
      description:
        "Essential coverage for small sellers with limited product types",
      features: [
        "EU Authorized Representative",
        "Technical documentation storage",
        "GPSR compliance monitoring",
        "Digital authorization signing",
        "Basic support (email only)",
        "Product labels & compliance declarations",
      ],
      storage: "5GB storage",
      supportLevel: "Standard email support (24-48h response)",
      additionalServices: [
        "Online compliance dashboard",
        "Document expiry notifications",
      ],
      popular: false,
    },
    {
      id: "tier2",
      name: "Starter Plan",
      productLimit: "Up to 20 product types",
      monthlyPrice: 99,
      annualPrice: 999,
      description:
        "Expanded coverage for growing businesses with multiple products",
      features: [
        "Everything in Basic Plan",
        "Priority documentation handling",
        "Compliance change notifications",
        "Document version control",
        "Risk assessment template library",
        "Customizable compliance checklist",
      ],
      storage: "20GB storage",
      supportLevel: "Priority email support (12-24h response)",
      additionalServices: [
        "Monthly compliance status reports",
        "Basic GPSR compliance training",
      ],
      popular: true,
    },
    {
      id: "tier3",
      name: "Growth Plan",
      productLimit: "Up to 50 product types",
      monthlyPrice: 199,
      annualPrice: 1990,
      description:
        "Comprehensive solution for established businesses with diverse portfolios",
      features: [
        "Everything in Starter Plan",
        "Advanced document management",
        "Compliance task automation",
        "Multi-user access (3 users)",
        "Enhanced reporting and analytics",
        "Document translation assistance",
      ],
      storage: "50GB storage",
      supportLevel: "Priority email & chat support (8-12h response)",
      additionalServices: [
        "Quarterly compliance review",
        "Document template customization",
      ],
      popular: false,
    },
    {
      id: "tier4",
      name: "Professional Plan",
      productLimit: "Up to 100 product types",
      monthlyPrice: 349,
      annualPrice: 3490,
      description:
        "Advanced solution for larger businesses with complex compliance needs",
      features: [
        "Everything in Growth Plan",
        "Dedicated compliance manager",
        "Multi-user access (5 users)",
        "API access for system integration",
        "Advanced compliance analytics",
        "Custom workflow automation",
      ],
      storage: "100GB storage",
      supportLevel: "Priority support with dedicated agent (4-8h response)",
      additionalServices: [
        "Monthly compliance consultation",
        "Market surveillance monitoring",
        "Competitor compliance insights",
      ],
      popular: false,
    },
    {
      id: "tier5",
      name: "Business Plan",
      productLimit: "Up to 200 product types",
      monthlyPrice: 599,
      annualPrice: 5990,
      description:
        "Enterprise-grade solution for large businesses with extensive product lines",
      features: [
        "Everything in Professional Plan",
        "Multi-user access (10 users)",
        "Advanced API access",
        "Custom compliance reporting",
        "White-labeled compliance portal",
        "Enhanced security features",
      ],
      storage: "250GB storage",
      supportLevel: "Premium support with dedicated team (1-4h response)",
      additionalServices: [
        "Bi-weekly compliance meetings",
        "Regulatory update briefings",
        "Priority incident management",
      ],
      popular: false,
    },
    {
      id: "tier6",
      name: "Enterprise Plan",
      productLimit: "Up to 500 product types",
      monthlyPrice: 999,
      annualPrice: 9990,
      description:
        "Comprehensive enterprise solution for large-scale operations",
      features: [
        "Everything in Business Plan",
        "Multi-user access (25 users)",
        "Enterprise API with dedicated support",
        "Custom integration solutions",
        "Dedicated compliance team",
        "Unlimited compliance consultations",
      ],
      storage: "500GB storage",
      supportLevel: "24/7 dedicated support with prioritized escalation",
      additionalServices: [
        "Weekly compliance strategic meetings",
        "Custom compliance training program",
        "On-demand emergency support",
      ],
      popular: false,
    },
    {
      id: "tier7",
      name: "Ultimate Plan",
      productLimit: "Unlimited product types",
      monthlyPrice: 1499,
      annualPrice: 14990,
      description:
        "All-inclusive solution for global enterprises with unlimited product types",
      features: [
        "Everything in Enterprise Plan",
        "Unlimited users",
        "Unlimited API usage",
        "Custom compliance solutions",
        "Global compliance monitoring",
        "Regulatory advocacy support",
      ],
      storage: "Unlimited storage",
      supportLevel: "Premium 24/7 support with executive escalation path",
      additionalServices: [
        "Customized compliance strategies",
        "Regulatory representation",
        "Complete market access solutions",
      ],
      popular: false,
    },
  ];

  // Features comparison for the comparison table
  const featureComparison = [
    {
      name: "Product Types",
      tiers: [
        "Up to 5",
        "Up to 20",
        "Up to 50",
        "Up to 100",
        "Up to 200",
        "Up to 500",
        "Unlimited",
      ],
    },
    {
      name: "EU Authorized Representative",
      tiers: [true, true, true, true, true, true, true],
    },
    {
      name: "Document Storage",
      tiers: ["5GB", "20GB", "50GB", "100GB", "250GB", "500GB", "Unlimited"],
    },
    {
      name: "User Access",
      tiers: [
        "1 user",
        "2 users",
        "3 users",
        "5 users",
        "10 users",
        "25 users",
        "Unlimited",
      ],
    },
    {
      name: "Response Time",
      tiers: ["24-48h", "12-24h", "8-12h", "4-8h", "1-4h", "Priority", "24/7"],
    },
    {
      name: "Email Support",
      tiers: [true, true, true, true, true, true, true],
    },
    {
      name: "Chat Support",
      tiers: [false, false, true, true, true, true, true],
    },
    {
      name: "Phone Support",
      tiers: [false, false, false, true, true, true, true],
    },
    {
      name: "Dedicated Agent",
      tiers: [false, false, false, true, true, true, true],
    },
    {
      name: "Compliance Dashboard",
      tiers: [true, true, true, true, true, true, true],
    },
    {
      name: "Document Version Control",
      tiers: [false, true, true, true, true, true, true],
    },
    {
      name: "API Access",
      tiers: [false, false, false, true, true, true, true],
    },
    {
      name: "Compliance Analytics",
      tiers: [false, false, true, true, true, true, true],
    },
    {
      name: "White Labeling",
      tiers: [false, false, false, false, true, true, true],
    },
    {
      name: "Custom Integrations",
      tiers: [false, false, false, false, false, true, true],
    },
    {
      name: "Regulatory Updates",
      tiers: [true, true, true, true, true, true, true],
    },
    {
      name: "Compliance Consultations",
      tiers: [
        false,
        false,
        "Quarterly",
        "Monthly",
        "Bi-Weekly",
        "Weekly",
        "Unlimited",
      ],
    },
  ];

  // Function to format the monthly price from annual price correctly
  const formatMonthlyFromAnnual = (annualPrice: number) => {
    return Math.round(annualPrice / 12);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-muted py-16 md:py-20">
          <ResponsiveContainer className="max-w-7xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground">
              Choose the plan that fits your business needs with no hidden fees
            </p>

            <div className="flex items-center justify-center mt-10 space-x-2">
              <span
                className={cn(
                  "text-sm",
                  billingCycle === "monthly"
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                Monthly
              </span>
              <Switch
                checked={billingCycle === "annual"}
                onCheckedChange={(checked) =>
                  handleBillingCycleChange(checked ? "annual" : "monthly")
                }
                className="data-[state=checked]:bg-primary"
              />
              <span
                className={cn(
                  "text-sm",
                  billingCycle === "annual"
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                Annual
                <span className="ml-1.5 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Save 16%
                </span>
              </span>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Pricing Cards Tabs - Mobile View */}
        <section className="py-12 md:hidden bg-background">
          <ResponsiveContainer className="max-w-7xl">
            <Tabs
              defaultValue="tier1"
              value={selectedTier}
              onValueChange={setSelectedTier}
              className="w-full"
            >
              <TabsList className="grid grid-cols-7 h-auto p-1 mb-8">
                {pricingTiers.map((tier) => (
                  <TabsTrigger
                    key={tier.id}
                    value={tier.id}
                    className={cn(
                      "text-xs py-2 px-0.5",
                      tier.popular && "bg-primary/10 text-primary"
                    )}
                  >
                    {tier.name.split(" ")[0]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {pricingTiers.map((tier) => (
                <TabsContent key={tier.id} value={tier.id} className="mt-2">
                  <Card
                    className={cn(
                      "border shadow-sm hover:shadow-md transition-shadow relative flex flex-col",
                      tier.popular && "border-2 border-primary/30 shadow-md"
                    )}
                  >
                    {tier.popular && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-bl-lg rounded-tr-lg">
                        Most Popular
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-2xl">{tier.name}</CardTitle>
                      <CardDescription className="mt-4 text-base">
                        {tier.productLimit}
                      </CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">
                          {billingCycle === "monthly"
                            ? `€${tier.monthlyPrice}`
                            : `€${formatMonthlyFromAnnual(tier.annualPrice)}`}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          /month
                        </span>

                        {billingCycle === "annual" && (
                          <div className="mt-1 text-sm text-muted-foreground">
                            €{tier.annualPrice} billed annually
                          </div>
                        )}
                      </div>
                      <CardDescription className="mt-4">
                        {tier.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Core Features
                          </h4>
                          <ul className="space-y-3">
                            {tier.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Storage</h4>
                          <p className="text-muted-foreground">
                            {tier.storage}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Support Level
                          </h4>
                          <p className="text-muted-foreground">
                            {tier.supportLevel}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Additional Services
                          </h4>
                          <ul className="space-y-3">
                            {tier.additionalServices.map((service, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                                <span>{service}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href="/contact" className="w-full">
                        <Button
                          className={cn(
                            "w-full",
                            tier.popular
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : ""
                          )}
                        >
                          Get a Quote
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </ResponsiveContainer>
        </section>

        {/* Pricing Cards Grid - Desktop View */}
        <section className="py-12 hidden md:block bg-background">
          <ResponsiveContainer className="max-w-8xl">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pricingTiers.slice(0, 4).map((tier) => (
                <Card
                  key={tier.id}
                  className={cn(
                    "border shadow-sm hover:shadow-md transition-shadow relative flex flex-col",
                    tier.popular && "border-2 border-primary/30 shadow-md"
                  )}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-bl-lg rounded-tr-lg">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <CardDescription className="mt-2 text-sm">
                      {tier.productLimit}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">
                        {billingCycle === "monthly"
                          ? `€${tier.monthlyPrice}`
                          : `€${formatMonthlyFromAnnual(tier.annualPrice)}`}
                      </span>
                      <span className="text-muted-foreground ml-1">/month</span>

                      {billingCycle === "annual" && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          €{tier.annualPrice} billed annually
                        </div>
                      )}
                    </div>
                    <CardDescription className="mt-4 text-xs">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-medium mb-2">
                          Core Features
                        </h4>
                        <ul className="space-y-2">
                          {tier.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mr-2 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium mb-1">Storage</h4>
                        <p className="text-sm text-muted-foreground">
                          {tier.storage}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium mb-1">
                          Support Level
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {tier.supportLevel}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium mb-1">
                          Additional Services
                        </h4>
                        <ul className="space-y-2">
                          {tier.additionalServices.map((service, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mr-2 mt-0.5" />
                              <span className="text-sm">{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href="/contact" className="w-full">
                      <Button
                        className={cn(
                          "w-full text-sm py-5",
                          tier.popular
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : ""
                        )}
                      >
                        Get a Quote
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {pricingTiers.slice(4).map((tier) => (
                <Card
                  key={tier.id}
                  className="border shadow-sm hover:shadow-md transition-shadow relative flex flex-col"
                >
                  <CardHeader>
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <CardDescription className="mt-2 text-sm">
                      {tier.productLimit}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">
                        {billingCycle === "monthly"
                          ? `€${tier.monthlyPrice}`
                          : `€${formatMonthlyFromAnnual(tier.annualPrice)}`}
                      </span>
                      <span className="text-muted-foreground ml-1">/month</span>

                      {billingCycle === "annual" && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          €{tier.annualPrice} billed annually
                        </div>
                      )}
                    </div>
                    <CardDescription className="mt-4 text-xs">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-medium mb-2">
                          Core Features
                        </h4>
                        <ul className="space-y-2">
                          {tier.features.slice(0, 4).map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mr-2 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                          <li className="text-sm text-muted-foreground">
                            + {tier.features.length - 4} more features
                          </li>
                        </ul>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <h4 className="text-xs font-medium mb-1">Storage</h4>
                          <p className="text-sm text-muted-foreground">
                            {tier.storage}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-medium mb-1">Support</h4>
                          <p className="text-sm text-muted-foreground">
                            Premium
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href="/contact" className="w-full">
                      <Button className="w-full text-sm py-5">
                        Get a Quote
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ResponsiveContainer>
        </section>

        {/* What is a Product Type Section */}
        <section id="product-type" className="py-16 bg-primary/10">
          <ResponsiveContainer className="max-w-7xl">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <HelpCircle className="h-10 w-10 text-primary mr-3" />
                <h2 className="text-3xl font-bold text-foreground">
                  What is a Product Type?
                </h2>
              </div>

              <div className="bg-background rounded-lg shadow-sm p-8">
                <p className="text-lg text-muted-foreground mb-6">
                  A &quot;product type&quot; in the context of GPSR compliance
                  refers to a group of products that:
                </p>

                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-3 mt-1" />
                    <div>
                      <p className="font-medium">
                        Share the same essential characteristics
                      </p>
                      <p className="text-muted-foreground mt-1">
                        Products that have the same design, structure,
                        components, and functionality
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-3 mt-1" />
                    <div>
                      <p className="font-medium">
                        Have identical safety considerations
                      </p>
                      <p className="text-muted-foreground mt-1">
                        Products that present the same safety risks and require
                        the same safety assessments
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-3 mt-1" />
                    <div>
                      <p className="font-medium">
                        Covered by the same technical documentation
                      </p>
                      <p className="text-muted-foreground mt-1">
                        Products that can be represented by the same technical
                        file and test reports
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="mt-8 border-t border-border pt-6">
                  <h3 className="text-lg font-medium mb-4">Examples:</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted p-4 rounded-md">
                      <p className="font-medium mb-2">Same Product Type</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• T-shirts in different colors and sizes</li>
                        <li>• The same toy car model in different colors</li>
                        <li>
                          • Bath towels of varying dimensions but same material
                        </li>
                      </ul>
                    </div>

                    <div className="bg-muted p-4 rounded-md">
                      <p className="font-medium mb-2">
                        Different Product Types
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• T-shirts vs. Jeans</li>
                        <li>• Toy cars vs. Toy planes</li>
                        <li>• Bath towels vs. Beach towels</li>
                      </ul>
                    </div>
                  </div>

                  <p className="mt-6 text-sm text-muted-foreground">
                    Not sure how many product types you have? Contact us for a
                    free consultation to help determine the right plan for your
                    business.
                  </p>
                </div>
              </div>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Comparison Table Section */}
        <section className="py-16 bg-background">
          <ResponsiveContainer className="max-w-7xl">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Plan Comparison
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-4 px-6 text-left font-medium text-muted-foreground">
                      Features
                    </th>
                    <th className="py-4 px-3 text-center font-medium">Basic</th>
                    <th className="py-4 px-3 text-center font-medium">
                      Starter
                    </th>
                    <th className="py-4 px-3 text-center font-medium">
                      Growth
                    </th>
                    <th className="py-4 px-3 text-center font-medium">Pro</th>
                    <th className="py-4 px-3 text-center font-medium">
                      Business
                    </th>
                    <th className="py-4 px-3 text-center font-medium">
                      Enterprise
                    </th>
                    <th className="py-4 px-3 text-center font-medium">
                      Ultimate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((feature, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-4 px-6 text-muted-foreground font-medium">
                        {feature.name}
                      </td>
                      {feature.tiers.map((value, tierIndex) => (
                        <td key={tierIndex} className="py-4 px-3 text-center">
                          {typeof value === "boolean" ? (
                            value ? (
                              <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span
                              className={
                                tierIndex === 1 && index === 0
                                  ? "font-bold text-primary"
                                  : ""
                              }
                            >
                              {value}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ResponsiveContainer>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-primary/10">
          <ResponsiveContainer className="max-w-7xl">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Pricing FAQ
            </h2>

            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-3">
                  Can I change my plan later?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. When
                  upgrading, you&apos;ll only pay the prorated difference. When
                  downgrading, the new rate will apply at your next billing
                  cycle.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-3">
                  Is there a setup fee?
                </h3>
                <p className="text-muted-foreground">
                  No, there are no setup fees for any of our plans. You only pay
                  the advertised subscription price.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, including Visa, Mastercard,
                  and American Express. Enterprise clients can also pay via bank
                  transfer.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-3">
                  Is there a contract or commitment?
                </h3>
                <p className="text-muted-foreground">
                  Monthly plans can be canceled at any time. Annual plans
                  provide savings but are paid upfront for the year. We offer a
                  30-day money-back guarantee for all new subscriptions.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-3">
                  Do you offer discounts for multiple companies?
                </h3>
                <p className="text-muted-foreground">
                  Yes, we offer special pricing for groups or agencies managing
                  multiple companies. Please contact our sales team to discuss
                  your specific needs.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-3">
                  What happens after the GPSR deadline?
                </h3>
                <p className="text-muted-foreground">
                  Our service continues after the GPSR enforcement date of
                  December 13, 2024. As your Authorized Representative, we
                  maintain ongoing compliance with the regulation.
                </p>
              </div>
            </div>
          </ResponsiveContainer>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <ResponsiveContainer className="max-w-7xl">
            <div className="text-center">
              <Shield className="h-16 w-16 text-primary-foreground mx-auto mb-6" />
              <h2 className="text-3xl font-extrabold text-primary-foreground sm:text-4xl">
                Ready to comply with GPSR?
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-primary-foreground/80 mx-auto">
                Choose a plan that matches your needs and get started today
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Get Started Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </ResponsiveContainer>
        </section>
      </main>

      <Footer />
    </div>
  );
}
