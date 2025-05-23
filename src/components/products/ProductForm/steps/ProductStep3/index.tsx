import React, { useState, useEffect } from "react";
import { SquareArrowOutUpRight, Trash, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  useUploadProductTechnicalFile,
  useSetProductTechnicalFileNotRequired,
  useDeleteProductTechnicalFile,
} from "@/hooks/use-product-technical-files";
import {
  useCreateProductNotifiedBody,
  useUpdateProductNotifiedBody,
} from "@/hooks/use-product-notified-bodies";

import { ProductTechnicalFile } from "@/lib/services/product-technical-files-service";

import { useProductForm } from "../../hooks/useProductForm";
import Confirmation from "./Confirmation";

// Teknik dosya tipleri sabiti
const TECHNICAL_FILE_TYPES = [
  { key: "ec_eu_doc", label: "EC/EU DoC" },
  { key: "ukca_doc", label: "UKCA DoC" },
  { key: "risk_assessment", label: "Risk Assessment File" },
  { key: "design_documents", label: "Design Documents" },
  { key: "manufacturing_details", label: "Manufacturing Details" },
  { key: "test_reports", label: "Test Reports and Certificates" },
  {
    key: "packaging_label",
    label: "Packaging Label (CE Label and Other Markings)",
  },
  { key: "user_manual", label: "User Manual" },
  { key: "safety_instructions", label: "Safety Instructions" },
  { key: "manufacturer_agreements", label: "Manufacturer Agreements" },
  {
    key: "general_supporting",
    label: "General Supporting Documentation (Optional)",
  },
];

export default function ProductStep3() {
  const { initialData, setInitialData, onNextStep } = useProductForm();
  const productId = initialData?.id;

  // DoC question state
  const [hasDoc, setHasDoc] = useState<string>("yes");
  // Notified body question state
  const [needsNotifiedBody, setNeedsNotifiedBody] = useState<string>("no");

  // Notified body form state
  const [notifiedBody, setNotifiedBody] = useState({
    id: undefined as string | undefined,
    notified_body_name: "",
    notified_body_address: "",
    notified_body_number: "",
    notified_body_ref_number: "",
    additional_info: "",
  });

  // Technical file hooks
  const uploadFile = useUploadProductTechnicalFile();
  const setNotRequired = useSetProductTechnicalFileNotRequired();
  const deleteFile = useDeleteProductTechnicalFile();

  // Notified body hooks
  const createNotifiedBody = useCreateProductNotifiedBody();
  const updateNotifiedBody = useUpdateProductNotifiedBody();

  // Fill the form with the existing notified body record
  useEffect(() => {
    if (needsNotifiedBody === "yes" && initialData?.selectedNotifiedBody) {
      const nb = initialData.selectedNotifiedBody;
      setNotifiedBody((prev) => {
        if (
          prev.id === nb.id &&
          prev.notified_body_name === (nb.notified_body_name || "") &&
          prev.notified_body_address === (nb.notified_body_address || "") &&
          prev.notified_body_number === (nb.notified_body_number || "") &&
          prev.notified_body_ref_number ===
            (nb.notified_body_ref_number || "") &&
          prev.additional_info === (nb.additional_info || "")
        ) {
          return prev;
        }
        return {
          id: nb.id,
          notified_body_name: nb.notified_body_name || "",
          notified_body_address: nb.notified_body_address || "",
          notified_body_number: nb.notified_body_number || "",
          notified_body_ref_number: nb.notified_body_ref_number || "",
          additional_info: nb.additional_info || "",
        };
      });
    } else if (needsNotifiedBody === "no") {
      setNotifiedBody((prev) => {
        if (
          prev.id === undefined &&
          prev.notified_body_name === "" &&
          prev.notified_body_address === "" &&
          prev.notified_body_number === "" &&
          prev.notified_body_ref_number === "" &&
          prev.additional_info === ""
        ) {
          return prev;
        }
        return {
          id: undefined,
          notified_body_name: "",
          notified_body_address: "",
          notified_body_number: "",
          notified_body_ref_number: "",
          additional_info: "",
        };
      });
    }
  }, [needsNotifiedBody, initialData?.selectedNotifiedBody]);

  // File upload handler
  const handleFileChange = async (
    fileType: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !productId) return;
    try {
      await uploadFile.mutateAsync({ productId, fileType, file });
    } catch (err) {
      toast.error("File upload failed");
    }
  };

  // Not required handler
  const handleNotRequired = async (fileType: string, checked: boolean) => {
    if (!productId) return;

    const fileData = getFileData(fileType);
    try {
      if (checked) {
        await setNotRequired.mutateAsync({ productId, fileType });
      } else if (fileData && fileData.id) {
        // When unchecked, delete the record
        await deleteFile.mutateAsync(fileData.id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    }
  };

  // Delete file handler
  const handleDeleteFile = async (id: string) => {
    try {
      await deleteFile.mutateAsync(id);
      toast.success("File deleted successfully");
    } catch (err) {
      toast.error("File deletion failed");
    }
  };

  // Get file data by file type
  const getFileData = (fileType: string) =>
    initialData?.selectedTechnicalFiles?.find(
      (f: ProductTechnicalFile) => f.file_type === fileType
    );

  // Notified body submit operation
  const handleNotifiedBodySubmit = async () => {
    if (!productId) return;

    try {
      if (needsNotifiedBody === "yes") {
        let notifiedBodyData;

        if (notifiedBody.id) {
          // Update
          notifiedBodyData = await updateNotifiedBody.mutateAsync({
            id: notifiedBody.id,
            notifiedBody: {
              notified_body_name: notifiedBody.notified_body_name,
              notified_body_address: notifiedBody.notified_body_address,
              notified_body_number: notifiedBody.notified_body_number,
              notified_body_ref_number: notifiedBody.notified_body_ref_number,
              additional_info: notifiedBody.additional_info,
            },
          });
        } else {
          // Add
          notifiedBodyData = await createNotifiedBody.mutateAsync({
            productId,
            notifiedBody: {
              notified_body_name: notifiedBody.notified_body_name,
              notified_body_address: notifiedBody.notified_body_address,
              notified_body_number: notifiedBody.notified_body_number,
              notified_body_ref_number: notifiedBody.notified_body_ref_number,
              additional_info: notifiedBody.additional_info,
            },
          });
        }

        setInitialData({
          ...initialData,
          selectedNotifiedBody: notifiedBodyData,
        });
      }
    } catch (err) {
      toast.error("Notified body kaydedilemedi");
      throw err;
    }
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Technical file validation
    const missingFiles = TECHNICAL_FILE_TYPES.filter(({ key }) => {
      // Check EC/EU and UKCA DoC fields based on DoC question
      if ((key === "ec_eu_doc" || key === "ukca_doc") && hasDoc !== "yes")
        return false;
      const fileData = getFileData(key);
      return !fileData?.file_url && !fileData?.not_required;
    });
    if (missingFiles.length > 0) {
      toast.error(
        "Please upload all technical files or check the 'This document is not required for conformity assessment' box."
      );
      return;
    }

    // Notified body validation
    if (needsNotifiedBody === "yes") {
      if (
        !notifiedBody.notified_body_name.trim() ||
        !notifiedBody.notified_body_address.trim() ||
        (!notifiedBody.notified_body_number.trim() &&
          !notifiedBody.notified_body_ref_number.trim())
      ) {
        toast.error(
          "Please fill in the notified body fields (name, address and number or reference number)."
        );
        return;
      }
    }

    try {
      await handleNotifiedBodySubmit();
      toast.success("All data saved");
      onNextStep();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* DoC question */}
      <div className="space-y-2">
        <Label className="text-base font-medium">
          Do you have your own Declaration of Conformity (DoC) for this product?
        </Label>
        <RadioGroup
          value={hasDoc}
          onValueChange={setHasDoc}
          className="flex flex-row gap-8 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="doc-yes" />
            <Label htmlFor="doc-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="doc-no" />
            <Label htmlFor="doc-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Technical file fields */}
      <div className="space-y-6">
        {TECHNICAL_FILE_TYPES.map(({ key, label }) => {
          // Show/hide EC/EU and UKCA DoC fields based on DoC question
          if ((key === "ec_eu_doc" || key === "ukca_doc") && hasDoc !== "yes")
            return null;

          const fileData = getFileData(key);

          return (
            <div key={key} className="border-b pb-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Label className="font-medium">{label}</Label>
                {fileData?.not_required && (
                  <span className="text-xs text-muted-foreground ml-1">
                    (Not Required)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Checkbox
                  id={`not-required-${key}`}
                  checked={!!fileData?.not_required}
                  onCheckedChange={(checked) =>
                    handleNotRequired(key, !!checked)
                  }
                  title={
                    fileData?.file_url
                      ? "If you want to check, delete the file first."
                      : ""
                  }
                  disabled={
                    uploadFile.isPending ||
                    setNotRequired.isPending ||
                    deleteFile.isPending ||
                    !!fileData?.file_url
                  }
                />
                <Label
                  htmlFor={`not-required-${key}`}
                  className="text-sm"
                  title={
                    fileData?.file_url
                      ? "If you want to check, delete the file first."
                      : ""
                  }
                >
                  This document is not required for conformity assessment
                </Label>
              </div>
              <div className="flex items-center gap-4 mt-2">
                {fileData?.file_url ? (
                  <>
                    <a
                      href={fileData.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm flex items-center gap-2 hover:underline"
                    >
                      <SquareArrowOutUpRight className="w-4 h-4" />
                      View File
                    </a>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteFile(fileData.id)}
                      disabled={deleteFile.isPending}
                      title="Delete File"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      type="file"
                      onChange={(e) => handleFileChange(key, e)}
                      accept=".pdf"
                      className="cursor-pointer"
                      disabled={
                        uploadFile.isPending || !!fileData?.not_required
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled
                    >
                      <UploadCloud className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notified body question */}
      <div className="space-y-2">
        <Label className="text-base font-medium">
          Does this product need a notified body
        </Label>
        <RadioGroup
          value={needsNotifiedBody}
          onValueChange={setNeedsNotifiedBody}
          className="flex flex-row gap-8 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="notified-yes" />
            <Label htmlFor="notified-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="notified-no" />
            <Label htmlFor="notified-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Notified body form */}
      {needsNotifiedBody === "yes" && (
        <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
          <div className="space-y-2">
            <Label>Notified Body Name</Label>
            <Input
              value={notifiedBody.notified_body_name}
              onChange={(e) =>
                setNotifiedBody({
                  ...notifiedBody,
                  notified_body_name: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Notified Body Name Address</Label>
            <Textarea
              value={notifiedBody.notified_body_address}
              onChange={(e) =>
                setNotifiedBody({
                  ...notifiedBody,
                  notified_body_address: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>4-Digit Notified Body Number</Label>
              <Input
                value={notifiedBody.notified_body_number}
                onChange={(e) =>
                  setNotifiedBody({
                    ...notifiedBody,
                    notified_body_number: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Ref. Number</Label>
              <Input
                value={notifiedBody.notified_body_ref_number}
                onChange={(e) =>
                  setNotifiedBody({
                    ...notifiedBody,
                    notified_body_ref_number: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Additional Info</Label>
            <Textarea
              value={notifiedBody.additional_info}
              onChange={(e) =>
                setNotifiedBody({
                  ...notifiedBody,
                  additional_info: e.target.value,
                })
              }
            />
          </div>
        </div>
      )}

      {/* Confirmation checkboxes area */}
      <Confirmation />
    </form>
  );
}
