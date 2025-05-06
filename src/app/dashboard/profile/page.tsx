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
  const { data: user } = useCurrentUser();
  const updateCurrentUser = useUpdateCurrentUser();
  const { updatePassword, isUpdating } = useUpdatePassword();
  const { deleteAccount, isDeleting } = useDeleteAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      country: "",
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.user_metadata?.first_name || "",
        lastName: user.user_metadata?.last_name || "",
        phone: user.user_metadata?.phone || "",
        country: user.user_metadata?.country || "",
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
    <div className="container mx-auto py-10 space-y-8">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account's profile information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...profileForm.register("firstName")}
                  />
                  {profileForm.formState.errors.firstName && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...profileForm.register("lastName")} />
                  {profileForm.formState.errors.lastName && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user?.email} disabled />
                {!user?.email_confirmed_at && (
                  <p className="text-sm text-muted-foreground">
                    Your email address is unverified.{" "}
                    <Button variant="link" className="p-0 h-auto">
                      Click here to re-send the verification email.
                    </Button>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="flex gap-2">
                  <CountryDropdown
                    defaultValue={profileForm.watch("country")}
                    onChange={(country) =>
                      profileForm.setValue("country", country.alpha2)
                    }
                    className="w-[200px]"
                  />
                  <Input
                    id="phone"
                    {...profileForm.register("phone")}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Update Password */}
      <Card>
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
          <CardDescription>
            Ensure your account is using a long, random password to stay secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...passwordForm.register("currentPassword")}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...passwordForm.register("newPassword")}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" disabled={isPasswordLoading}>
              {isPasswordLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Delete Account</CardTitle>
          <CardDescription>
            Once your account is deleted, all of its resources and data will be
            permanently deleted. Before deleting your account, please download
            any data or information that you wish to retain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
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
                <AlertDialogAction onClick={handleDeleteAccount}>
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
