"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser, useUpdateCurrentUser } from "@/hooks/use-auth";

interface FormData {
  firstName: string;
  lastName: string;
  company: string;
}

interface FormErrors {
  firstName: string;
  lastName: string;
  company: string;
}

export default function CompleteProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    company: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    firstName: "",
    lastName: "",
    company: "",
  });

  const { data: user } = useCurrentUser();
  const updateCurrentUser = useUpdateCurrentUser();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (!user) {
        throw new Error("User not found");
      }

      await updateCurrentUser.mutateAsync({
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
        package_id: null,
        avatar_url: null,
      });

      toast.success("Profile updated successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-2">
            Please fill in the following information to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="text-sm font-medium leading-none"
            >
              First Name
            </label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? "border-destructive" : ""}
            />
            {errors.firstName && (
              <p className="text-destructive text-xs">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="text-sm font-medium leading-none"
            >
              Last Name
            </label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? "border-destructive" : ""}
            />
            {errors.lastName && (
              <p className="text-destructive text-xs">{errors.lastName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="company"
              className="text-sm font-medium leading-none"
            >
              Company Name
            </label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={errors.company ? "border-destructive" : ""}
            />
            {errors.company && (
              <p className="text-destructive text-xs">{errors.company}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Complete Profile"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
