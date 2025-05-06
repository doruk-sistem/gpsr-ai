"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCurrentUser, useUpdateCurrentUser } from "@/hooks/use-auth";
import { useUpdatePassword } from "@/hooks/use-update-password";
import { useDeleteAccount } from "@/hooks/use-delete-account";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
  country: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const updateCurrentUser = useUpdateCurrentUser();
  const { updatePassword, isUpdating } = useUpdatePassword();
  const { deleteAccount, isDeleting } = useDeleteAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.user_metadata?.first_name || "",
      lastName: user?.user_metadata?.last_name || "",
      phone: user?.user_metadata?.phone || "",
      country: user?.user_metadata?.country || "",
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user?.user_metadata) {
      profileForm.reset({
        firstName: user.user_metadata.first_name || "",
        lastName: user.user_metadata.last_name || "",
        phone: user.user_metadata.phone || "",
        country: user.user_metadata.country || "",
      });
    }
  }, [user, profileForm]);

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await updateCurrentUser.mutateAsync({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        country: data.country,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await updatePassword(data.currentPassword, data.newPassword);
      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update password"
      );
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast.success("Account deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete account"
      );
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Profile Information */}
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-muted/50 rounded-t-lg border-b">
          <CardTitle className="text-2xl">Profile Information</CardTitle>
          <CardDescription className="text-base">
            Update your account's profile information and email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {!user ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      {...profileForm.register("firstName")}
                      className="h-11"
                    />
                    {profileForm.formState.errors.firstName && (
                      <p className="text-sm text-destructive mt-1">
                        {profileForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      {...profileForm.register("lastName")}
                      className="h-11"
                    />
                    {profileForm.formState.errors.lastName && (
                      <p className="text-sm text-destructive mt-1">
                        {profileForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email}
                    disabled
                    className="h-11 bg-muted/50"
                  />
                  {!user?.email_confirmed_at && (
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-sm text-muted-foreground">
                        Your email address is unverified.
                      </p>
                      <Button variant="link" className="p-0 h-auto text-sm">
                        Resend verification email
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone
                  </Label>
                  <div className="flex gap-3">
                    <CountryDropdown
                      defaultValue={profileForm.watch("country")}
                      onChange={(country) =>
                        profileForm.setValue("country", country.alpha2)
                      }
                      className="w-[200px] h-11"
                    />
                    <Input
                      id="phone"
                      {...profileForm.register("phone")}
                      className="flex-1 h-11"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Update Password */}
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-muted/50 rounded-t-lg border-b">
          <CardTitle className="text-2xl">Update Password</CardTitle>
          <CardDescription className="text-base">
            Ensure your account is using a long, random password to stay secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="currentPassword"
                  className="text-sm font-medium"
                >
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...passwordForm.register("currentPassword")}
                  className="h-11"
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-destructive mt-1">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...passwordForm.register("newPassword")}
                  className="h-11"
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive mt-1">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                  className="h-11"
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive mt-1">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPasswordLoading}
                className="min-w-[120px]"
              >
                {isPasswordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive/50 shadow-lg">
        <CardHeader className="bg-destructive/5 rounded-t-lg border-b border-destructive/50">
          <CardTitle className="text-2xl text-destructive">
            Delete Account
          </CardTitle>
          <CardDescription className="text-base">
            Once your account is deleted, all of its resources and data will be
            permanently deleted. Before deleting your account, please download
            any data or information that you wish to retain.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isDeleting}
                className="min-w-[120px]"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
