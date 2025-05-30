import { Building, Mail, UserCheck } from "lucide-react";
import React from "react";

import { UserProfile } from "@/lib/services/user-service";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface UserProfileCardProps {
  user: UserProfile;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
      <div className="flex items-start gap-6">
        <div className="shrink-0">
          <Avatar className="h-16 w-16 ring-2 ring-primary/50">
            <AvatarFallback className="bg-primary text-white text-lg font-semibold">
              {user?.first_name?.[0]?.toUpperCase() || "U"}
              {user?.last_name?.[0]?.toUpperCase() || ""}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {user?.first_name} {user?.last_name}
            </h4>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            >
              <UserCheck className="h-3 w-3 mr-1" />
              Active Customer
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Mail className="h-4 w-4 shrink-0" />
              <a
                href={`mailto:${user?.email}`}
                className="text-primary hover:underline font-medium truncate"
              >
                {user?.email || "No email provided"}
              </a>
            </div>

            {user?.company && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Building className="h-4 w-4 shrink-0" />
                <span className="font-medium truncate">
                  Company: {user.company}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
