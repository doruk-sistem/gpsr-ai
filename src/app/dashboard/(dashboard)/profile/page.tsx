"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
import { Loader2, User, Mail, Phone, Lock, AlertTriangle } from "lucide-react";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import Spinner from "@/components/ui/spinner";

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
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const updateCurrentUser = useUpdateCurrentUser();
  const { updatePassword } = useUpdatePassword();
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

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

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
    <div className="space-y-8">
      {/* Profile Information */}
      <Card>
        <CardContent className="p-8">
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <p className="text-muted-foreground">
                  Update your account&apos;s profile information and email
                  address.
                </p>
              </div>
            </div>

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
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700"
                      >
                        First Name
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="firstName"
                          {...profileForm.register("firstName")}
                          className="pl-12 bg-white h-12 text-lg"
                          placeholder="e.g. John"
                        />
                      </div>
                      {profileForm.formState.errors.firstName && (
                        <p className="text-sm text-destructive mt-1">
                          {profileForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="lastName"
                          {...profileForm.register("lastName")}
                          className="pl-12 bg-white h-12 text-lg"
                          placeholder="e.g. Smith"
                        />
                      </div>
                      {profileForm.formState.errors.lastName && (
                        <p className="text-sm text-destructive mt-1">
                          {profileForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email}
                        disabled
                        className="pl-12 bg-muted/50 h-12 text-lg"
                      />
                    </div>
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
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone
                    </Label>
                    <div className="flex gap-3">
                      <CountryDropdown
                        defaultValue={profileForm.watch("country")}
                        onChange={(country) =>
                          profileForm.setValue("country", country?.name)
                        }
                        className="w-[200px] h-12"
                      />
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="phone"
                          {...profileForm.register("phone")}
                          className="pl-12 bg-white h-12 text-lg"
                          placeholder="e.g. +44 20 7123 4567"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[120px] flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Update Password */}
      <Card>
        <CardContent className="p-8">
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Update Password</h2>
                <p className="text-muted-foreground">
                  Ensure your account is using a long, random password to stay
                  secure.
                </p>
              </div>
            </div>

            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...passwordForm.register("currentPassword")}
                      className="pl-12 bg-white h-12 text-lg"
                      placeholder="Enter your current password"
                    />
                  </div>
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-destructive mt-1">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="newPassword"
                      type="password"
                      {...passwordForm.register("newPassword")}
                      className="pl-12 bg-white h-12 text-lg"
                      placeholder="Enter your new password"
                    />
                  </div>
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive mt-1">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...passwordForm.register("confirmPassword")}
                      className="pl-12 bg-white h-12 text-lg"
                      placeholder="Confirm your new password"
                    />
                  </div>
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
                  className="min-w-[120px] flex items-center gap-2"
                >
                  {isPasswordLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive/50">
        <CardContent className="p-8">
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-destructive/50 pb-6">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-destructive">
                  Delete Account
                </h2>
                <p className="text-muted-foreground">
                  Once your account is deleted, all of its resources and data
                  will be permanently deleted. Before deleting your account,
                  please download any data or information that you wish to
                  retain.
                </p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isDeleting}
                  className="min-w-[120px] flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4" />
                      Delete Account
                    </>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
