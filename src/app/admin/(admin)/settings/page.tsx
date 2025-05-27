"use client";

import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminBreadcrumbs } from "@/components/admin/layout/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Bell, Shield, Key, Lock, LogOut } from "lucide-react";
import { useLogout } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: user, isLoading } = useCurrentUser();
  const { mutateAsync: logout } = useLogout();
  const [profileForm, setProfileForm] = useState({
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    email: user?.email || ""
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    loginAlerts: true,
    requestApprovals: true,
    systemUpdates: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Settings", href: "/admin/settings" }
  ];
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Notification settings updated");
    } catch (error) {
      toast.error("Failed to update notification settings");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/auth/login";
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={breadcrumbItems} />
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Profile</CardTitle>
                  <CardDescription>Update your admin account information</CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        disabled
                      />
                      <p className="text-sm text-muted-foreground">Email cannot be changed for admin accounts</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input
                          id="firstName"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                          id="lastName"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : "Save changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Configure how you receive system notifications</CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateNotifications}>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <Label htmlFor="emailAlerts" className="text-base">Email Alerts</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch
                          id="emailAlerts"
                          checked={notificationSettings.emailAlerts}
                          onCheckedChange={(checked) => setNotificationSettings({
                            ...notificationSettings,
                            emailAlerts: checked
                          })}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <Label htmlFor="loginAlerts" className="text-base">Login Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified about new logins to your account</p>
                        </div>
                        <Switch
                          id="loginAlerts"
                          checked={notificationSettings.loginAlerts}
                          onCheckedChange={(checked) => setNotificationSettings({
                            ...notificationSettings,
                            loginAlerts: checked
                          })}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <Label htmlFor="requestApprovals" className="text-base">Request Approvals</Label>
                          <p className="text-sm text-muted-foreground">Notify me when a request needs approval</p>
                        </div>
                        <Switch
                          id="requestApprovals"
                          checked={notificationSettings.requestApprovals}
                          onCheckedChange={(checked) => setNotificationSettings({
                            ...notificationSettings,
                            requestApprovals: checked
                          })}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <Label htmlFor="systemUpdates" className="text-base">System Updates</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications about system updates</p>
                        </div>
                        <Switch
                          id="systemUpdates"
                          checked={notificationSettings.systemUpdates}
                          onCheckedChange={(checked) => setNotificationSettings({
                            ...notificationSettings,
                            systemUpdates: checked
                          })}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : "Save preferences"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <Key className="h-5 w-5 mr-2" />
                      Password
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      Update your password to maintain account security
                    </p>
                    <Button variant="outline">
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <LogOut className="h-5 w-5 mr-2" />
                      Session Management
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      End your current session or log out from all devices
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={handleLogout}>
                        Sign Out
                      </Button>
                      <Button variant="destructive">
                        Sign Out from All Devices
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:w-80 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Account</CardTitle>
              <CardDescription>Your admin profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-24 w-24 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
              
              <div className="text-center">
                <p className="text-xl font-medium">
                  {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                </p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  Administrator
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last login</span>
                  <span>Today, 09:42 AM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Account created</span>
                  <span>June 12, 2023</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IP address</span>
                  <span>192.168.1.1</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent account activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="flex justify-between">
                    <p className="font-medium">Logged in</p>
                    <span className="text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="text-muted-foreground mt-1">From IP 192.168.1.1 using Chrome on Windows</p>
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <p className="font-medium">Changed password</p>
                    <span className="text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="text-muted-foreground mt-1">Password updated successfully</p>
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <p className="font-medium">Approved request</p>
                    <span className="text-muted-foreground">3 days ago</span>
                  </div>
                  <p className="text-muted-foreground mt-1">Approved representative request #1234</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}