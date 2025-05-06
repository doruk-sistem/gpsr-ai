"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { euCountries } from "@/lib/data/eu-countries";

export default function RequestPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyNumber: "",
    vatNumber: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    country: "",
    fullName: "",
    email: "",
    phone: "",
    position: "",
    websiteUrl: "",
    businessRole: "",
    productCategory: "",
    productInformation: "",
    ceMarking: "",
    technicalFile: "",
    requiredTests: "",
    testReports: "",
    testReportsFile: null as File | null,
    confirmAccuracy: false,
    confirmResponsibility: false,
    confirmTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form gönderme işlemi burada yapılacak
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Company Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Company Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Name
              </label>
              <Input
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Number
              </label>
              <Input
                value={formData.companyNumber}
                onChange={(e) =>
                  setFormData({ ...formData, companyNumber: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                VAT Number (If Applicable)
              </label>
              <Input
                value={formData.vatNumber}
                onChange={(e) =>
                  setFormData({ ...formData, vatNumber: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold">Company Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Street Address
                </label>
                <Input
                  value={formData.streetAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      streetAddress: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <Input
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Postal Code
                </label>
                <Input
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Country
                </label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  required
                >
                  <option value="">Select Country</option>
                  {euCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold">Contact Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <Input
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Position/Role
                </label>
                <Input
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Website URL
              </label>
              <Input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) =>
                  setFormData({ ...formData, websiteUrl: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Business Role
              </label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={formData.businessRole}
                onChange={(e) =>
                  setFormData({ ...formData, businessRole: e.target.value })
                }
                required
              >
                <option value="">Select Role</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="importer">Importer</option>
                <option value="distributor">Distributor</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Category
            </label>
            <Input
              value={formData.productCategory}
              onChange={(e) =>
                setFormData({ ...formData, productCategory: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Information
            </label>
            <textarea
              className="w-full border rounded-md px-3 py-2 min-h-[100px]"
              value={formData.productInformation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  productInformation: e.target.value,
                })
              }
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Compliance Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Do you have CE/UKCA marking for your products?
            </label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={formData.ceMarking}
              onChange={(e) =>
                setFormData({ ...formData, ceMarking: e.target.value })
              }
              required
            >
              <option value="">Select Option</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
              <option value="planned">Planned</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Do you have your technical file ready for submission?
            </label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={formData.technicalFile}
              onChange={(e) =>
                setFormData({ ...formData, technicalFile: e.target.value })
              }
              required
            >
              <option value="">Select Option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Have the required tests been conducted?
            </label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={formData.requiredTests}
              onChange={(e) =>
                setFormData({ ...formData, requiredTests: e.target.value })
              }
              required
            >
              <option value="">Select Option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Do you have test reports or notified body certifications?
            </label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={formData.testReports}
              onChange={(e) =>
                setFormData({ ...formData, testReports: e.target.value })
              }
              required
            >
              <option value="">Select Option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="not-applicable">Not Applicable</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Document (Optional)
            </label>
            <Input
              type="file"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  testReportsFile: e.target.files?.[0] || null,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Agreement Terms Section */}
      <Card>
        <CardHeader>
          <CardTitle>Agreement Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="confirmAccuracy"
              checked={formData.confirmAccuracy}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  confirmAccuracy: checked as boolean,
                })
              }
              required
            />
            <label htmlFor="confirmAccuracy" className="text-sm">
              I confirm that all information provided is accurate and complete.
            </label>
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="confirmResponsibility"
              checked={formData.confirmResponsibility}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  confirmResponsibility: checked as boolean,
                })
              }
              required
            />
            <label htmlFor="confirmResponsibility" className="text-sm">
              I understand that Dorukwell does not verify technical files, and
              compliance remains my responsibility as the manufacturer.
            </label>
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="confirmTerms"
              checked={formData.confirmTerms}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, confirmTerms: checked as boolean })
              }
              required
            />
            <label htmlFor="confirmTerms" className="text-sm">
              I agree to Euverify&apos;s Authorised Representative service
              terms.
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Submit Request
        </Button>
      </div>
    </form>
  );
}
