import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

export default function Confirmation() {
  const [ack1, setAck1] = useState(false);
  const [ack2, setAck2] = useState(false);
  const [ack3, setAck3] = useState(false);
  const [ack4, setAck4] = useState(false);
  const [mainAck, setMainAck] = useState(false);

  const handleMainAckChange = (checked: boolean) => {
    setMainAck(checked);
    setAck1(checked);
    setAck2(checked);
    setAck3(checked);
    setAck4(checked);
  };

  return (
    <>
      <div className="border-t pt-8 mt-8">
        <h2 className="text-lg font-semibold mb-6">
          Please carefully read and acknowledge the following statement by
          checking the box below:
        </h2>
        <div className="space-y-6 mb-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="ack1"
              checked={ack1}
              onCheckedChange={(checked) => setAck1(!!checked)}
            />
            <span className="text-base">
              I hereby confirm that I possess all necessary compliance
              documentation related to the product listed above, including but
              not limited to, test reports, technical files, and comprehensive
              risk assessments. I understand that these documents must adhere to
              current regulatory standards and must be readily available for
              review upon request by any relevant regulatory authority.
            </span>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="ack2"
              checked={ack2}
              onCheckedChange={(checked) => setAck2(!!checked)}
            />
            <span className="text-base">
              Importance of Self-Declaration: Self-declaration of conformity
              requires accurate and truthful representation of your
              product&apos;s compliance with applicable standards. By submitting
              this declaration, you assume full responsibility for its
              compliance and the accuracy of the information provided.
            </span>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="ack3"
              checked={ack3}
              onCheckedChange={(checked) => setAck3(!!checked)}
            />
            <span className="text-base">
              Responsibility for Maintaining Documentation: It is your
              obligation to maintain all compliance documentation for a period
              defined by regulatory requirements or for the life of the product.
              This documentation may be required to demonstrate compliance with
              the applicable standards and regulations during audits or
              inspections.
            </span>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="ack4"
              checked={ack4}
              onCheckedChange={(checked) => setAck4(!!checked)}
            />
            <span className="text-base">
              Potential Checks by Regulatory Agencies: Please be advised that
              your product and its associated compliance documentation may be
              subject to checks by regulatory agencies to ensure ongoing
              compliance with the necessary safety and regulatory standards.
              Non-compliance can result in legal penalties, including fines,
              recalls, or bans on product sales.
            </span>
          </div>
        </div>
        <div className="bg-primary/10 p-4 rounded flex items-center gap-3 mb-2">
          <Checkbox
            id="mainAck"
            checked={mainAck}
            onCheckedChange={(checked) => handleMainAckChange(!!checked)}
          />
          <Label htmlFor="mainAck" className="font-semibold text-lg">
            I acknowledge and confirm the above statements.
          </Label>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          The responsibility for incomplete or missing documentation lies with
          the manufacturer. AR will only submit available files to authorities
          if requested.
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!mainAck}>
          Finish and Submit
        </Button>
      </div>
    </>
  );
}
