"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-auth";
import { Loader2, ShieldCheck, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { useAcceptAdminInvitation, useVerifyAdminInvitation } from "@/hooks/admin/use-admin-management";
import { toast } from "sonner";

export default function AdminInvitationPage() {
  const router = useRouter();
  const { token } = useParams();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const [invitationStatus, setInvitationStatus] = useState<'loading' | 'valid' | 'invalid' | 'expired' | 'accepted'>('loading');
  const [invitationDetails, setInvitationDetails] = useState<{
    email: string;
    role: 'admin' | 'superadmin';
    expiresAt: string;
  } | null>(null);

  const verifyInvitation = useVerifyAdminInvitation();
  const acceptInvitation = useAcceptAdminInvitation();

  // Verify invitation token
  useEffect(() => {
    const checkInvitation = async () => {
      if (!token || typeof token !== 'string') {
        setInvitationStatus('invalid');
        return;
      }

      try {
        const result = await verifyInvitation.mutateAsync({ token: token });
        
        if (result.valid) {
          setInvitationStatus('valid');
          setInvitationDetails({
            email: result.email,
            role: result.role,
            expiresAt: result.expiresAt
          });
        } else if (result.expired) {
          setInvitationStatus('expired');
        } else {
          setInvitationStatus('invalid');
        }
      } catch (error) {
        console.error(error);
        setInvitationStatus('invalid');
      }
    };

    if (!isUserLoading) {
      checkInvitation();
    }
  }, [token, isUserLoading, verifyInvitation]);

  // Check if invitation is for current user
  useEffect(() => {
    if (invitationDetails && user && invitationDetails.email !== user.email) {
      toast.error("Invitation error", { 
        description: "This invitation was sent to a different email address"
      });
      setInvitationStatus('invalid');
    }
  }, [invitationDetails, user]);

  const handleAcceptInvitation = async () => {
    if (!token || typeof token !== 'string' || !user) return;

    try {
      const result = await acceptInvitation.mutateAsync({ 
        token: token,
        userId: user.id
      });

      if (result.success) {
        setInvitationStatus('accepted');
        toast.success("Admin access granted", {
          description: `You now have ${invitationDetails?.role} access to the system`
        });
        
        // Redirect to admin dashboard after a delay
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 2000);
      } else {
        toast.error("Failed to accept invitation", {
          description: result.message || "Please try again"
        });
      }
    } catch (error: any) {
      toast.error("Failed to accept invitation", {
        description: error.message || "An unexpected error occurred"
      });
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    router.push(`/auth/login?redirect=/admin/invitation/${token}`);
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {invitationStatus === 'loading' && (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            )}
            {invitationStatus === 'valid' && (
              <ShieldCheck className="h-12 w-12 text-primary" />
            )}
            {invitationStatus === 'expired' && (
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            )}
            {invitationStatus === 'invalid' && (
              <XCircle className="h-12 w-12 text-destructive" />
            )}
            {invitationStatus === 'accepted' && (
              <CheckCircle className="h-12 w-12 text-green-500" />
            )}
          </div>
          <CardTitle className="text-center text-2xl">
            {invitationStatus === 'loading' && "Verifying Invitation"}
            {invitationStatus === 'valid' && "Admin Invitation"}
            {invitationStatus === 'expired' && "Invitation Expired"}
            {invitationStatus === 'invalid' && "Invalid Invitation"}
            {invitationStatus === 'accepted' && "Invitation Accepted"}
          </CardTitle>
          <CardDescription className="text-center">
            {invitationStatus === 'loading' && "Please wait while we verify your invitation..."}
            {invitationStatus === 'valid' && `You've been invited to join as ${invitationDetails?.role}`}
            {invitationStatus === 'expired' && "This invitation has expired and is no longer valid"}
            {invitationStatus === 'invalid' && "This invitation token is invalid or has already been used"}
            {invitationStatus === 'accepted' && "You now have administrator access"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {invitationStatus === 'valid' && (
            <div className="space-y-4">
              <div className="p-3 bg-primary/10 rounded-md">
                <p className="text-sm">
                  <span className="font-medium">Invitation details:</span><br />
                  Email: {invitationDetails?.email}<br />
                  Role: {invitationDetails?.role === 'superadmin' ? 'Superadmin' : 'Admin'}<br />
                  Expires: {new Date(invitationDetails?.expiresAt || '').toLocaleString()}
                </p>
              </div>
              
              <p className="text-sm text-muted-foreground">
                By accepting this invitation, you will be granted administrative access to the system.
                {invitationDetails?.role === 'superadmin' && ' As a superadmin, you will have full access to all features, including the ability to manage other administrators.'}
              </p>
            </div>
          )}
          
          {invitationStatus === 'expired' && (
            <p className="text-muted-foreground text-center">
              Please contact a superadmin to request a new invitation.
            </p>
          )}
          
          {invitationStatus === 'invalid' && (
            <p className="text-muted-foreground text-center">
              This invitation is invalid or has already been used.
              If you believe this is an error, please contact a system administrator.
            </p>
          )}
          
          {invitationStatus === 'accepted' && (
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center gap-2">
          {invitationStatus === 'valid' && (
            <>
              <Button variant="outline" onClick={() => router.push("/")}>
                Decline
              </Button>
              <Button onClick={handleAcceptInvitation} disabled={acceptInvitation.isPending}>
                {acceptInvitation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Accept Invitation"
                )}
              </Button>
            </>
          )}
          
          {(invitationStatus === 'expired' || invitationStatus === 'invalid') && (
            <Button variant="outline" onClick={() => router.push("/")}>
              Return Home
            </Button>
          )}
          
          {invitationStatus === 'accepted' && (
            <Button onClick={() => router.push("/admin/dashboard")}>
              Go to Admin Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}