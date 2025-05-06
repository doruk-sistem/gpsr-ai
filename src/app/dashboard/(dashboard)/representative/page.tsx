"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { euCountries } from "@/lib/data/eu-countries";
import Link from "next/link";

export default function RepresentativePage() {
  const [showEUForm, setShowEUForm] = useState(false);
  const [showUKForm, setShowUKForm] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [country, setCountry] = useState("");

  const handleClose = () => {
    setShowEUForm(false);
    setShowUKForm(false);
    setLogo(null);
    setCompanyName("");
    setCompanyAddress("");
    setCountry("");
  };

  return (
    <div className="space-y-8">
      {/* Top Section */}
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-bold text-primary mb-2">
            Authorised Representative
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-base">
          If you have an existing Authorised Representative, you can enter their
          details here. Alternatively, you can choose to appoint Euverify as
          your Authorised Representative.
        </CardContent>
      </Card>

      {/* EU & UK Representative Selection */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="h-full px-6 py-4">
          <div className="flex flex-wrap justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="relative">
                <Image
                  src="/images/flags/eu-flag.svg"
                  alt="EU flag"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </span>
              <h4 className="text-lg font-semibold">Authorised Rep in EU</h4>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showEUForm ? "default" : "outline"}
                onClick={() => setShowEUForm(!showEUForm)}
              >
                + Add your EU address
              </Button>
              <p className="font-semibold">or</p>
              <Button variant="outline">
                + Add Euverify&apos;s EU address
              </Button>
            </div>
          </div>
          {showEUForm && (
            <div className="mt-4 p-4 border rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Logo
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogo(e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Name
                </label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Address
                </label>
                <Input
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="Enter company address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Country
                </label>
                <select
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">Select country</option>
                  {euCountries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose} type="button">
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </div>
          )}
        </Card>
        <Card className="h-full px-6 py-4">
          <div className="flex flex-wrap justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="relative">
                <Image
                  src="/images/flags/uk-flag.svg"
                  alt="UK flag"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </span>
              <h4 className="text-lg font-semibold">Authorised Rep in UK</h4>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showUKForm ? "default" : "outline"}
                onClick={() => setShowUKForm(!showUKForm)}
              >
                + Add your EU address
              </Button>
              <p className="font-semibold">or</p>
              <Button variant="outline">
                + Add Euverify&apos;s UK address
              </Button>
            </div>
          </div>
          {showUKForm && (
            <div className="mt-4 p-4 border rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Logo
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogo(e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Name
                </label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Address
                </label>
                <Input
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="Enter company address"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose} type="button">
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Information and Action Cards */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary mb-2">
            Appoint Euverify as Your Authorised Representative
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Designate Euverify as your Authorised Representative to seamlessly
            represent your company in the EU, UK, or both markets. We provide
            dedicated representatives through our Ireland-based entity for EU
            compliance and our England-based entity for UKCA compliance.
            <br />
            <br />
            Acting on your behalf, we liaise with market surveillance
            authorities and enable you to use our address on your product
            labels, ensuring smooth market access and regulatory compliance.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* EU Card */}
            <Card className="bg-muted/50 border-primary/10">
              <CardHeader className="items-start">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Image
                    src="/images/flags/eu-flag.svg"
                    alt="EU flag"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                  EU Authorised Representative
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-1">
                <div className="w-full flex gap-5">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Location
                    </div>
                    <div className="font-semibold mb-1">Ireland</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Price</div>
                    <div className="font-semibold mb-3">Included</div>
                  </div>
                  <Link
                    className="inline-block w-full"
                    href="/dashboard/representative/request"
                  >
                    <Button className="w-full" variant="default">
                      Enable
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            {/* UK Card */}
            <Card className="bg-muted/50 border-primary/10">
              <CardHeader className="items-start">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Image
                    src="/images/flags/uk-flag.svg"
                    alt="UK flag"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                  UK Authorised Representative
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-1">
                <div className="w-full flex gap-5">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Location
                    </div>
                    <div className="font-semibold mb-1">England</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Price</div>
                    <div className="font-semibold mb-3">£200</div>
                  </div>
                  <Link
                    className="inline-block w-full"
                    href="/dashboard/representative/request"
                  >
                    <Button className="w-full" variant="default">
                      Select Service
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
