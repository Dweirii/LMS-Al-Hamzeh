"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Search, Ban, UserCheck, Shield } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import {
  banUserAction,
  unbanUserAction,
  updateUserRoleAction,
} from "../actions";

interface User {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
}

interface UserManagementTableProps {
  users: User[];
}

type FilterType = "all" | "active" | "banned";

export function UserManagementTable({ users }: UserManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [unbanDialogOpen, setUnbanDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banExpires, setBanExpires] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filter === "all" ||
        (filter === "active" && !user.banned) ||
        (filter === "banned" && user.banned);
      
      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, filter]);

  const handleBanUser = async () => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    const { data: result, error } = await tryCatch(
      banUserAction(selectedUser.id, banReason, banExpires)
    );

    if (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } else if (result.status === "success") {
      toast.success(result.message);
      setBanDialogOpen(false);
      setBanReason("");
      setBanExpires(undefined);
      setSelectedUser(null);
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  const handleUnbanUser = async () => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    const { data: result, error } = await tryCatch(
      unbanUserAction(selectedUser.id)
    );

    if (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } else if (result.status === "success") {
      toast.success(result.message);
      setUnbanDialogOpen(false);
      setSelectedUser(null);
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { data: result, error } = await tryCatch(
      updateUserRoleAction(userId, newRole)
    );

    if (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } else if (result.status === "success") {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "user":
        return "secondary";
    }
  };

  const getStatusBadge = (user: User) => {
    if (user.banned) {
      return <Badge variant="destructive">Banned</Badge>;
    }
    return <Badge variant="default" className="bg-green-500">Active</Badge>;
  };

  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy");
  };

  const isBanExpired = (banExpires: Date | null) => {
    if (!banExpires) return false;
    return new Date() > banExpires;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ban Reason</TableHead>
              <TableHead>Ban Expires</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role || "No Role"}
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(user)}</TableCell>
                <TableCell>
                  {user.banned ? (
                    <span className="text-sm text-muted-foreground">
                      {user.banReason || "No reason provided"}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {user.banned && user.banExpires ? (
                    <span className={cn(
                      "text-sm",
                      isBanExpired(user.banExpires) ? "text-green-600" : "text-muted-foreground"
                    )}>
                      {isBanExpired(user.banExpires) ? "Expired" : formatDate(user.banExpires)}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Role Select */}
                    <Select
                      value={user.role || "no-role"}
                      onValueChange={(value) => handleRoleChange(user.id, value === "no-role" ? "" : value)}
                    >
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Ban/Unban Button */}
                    {user.banned ? (
                      <Dialog open={unbanDialogOpen} onOpenChange={setUnbanDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Unban
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Unban User</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to unban {selectedUser?.name}? 
                              This will restore their access to the platform.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setUnbanDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleUnbanUser}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Unbanning..." : "Unban User"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Ban
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Ban User</DialogTitle>
                            <DialogDescription>
                              Ban {selectedUser?.name} from the platform. 
                              You can set an expiration date for temporary bans.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="banReason">Reason *</Label>
                              <Textarea
                                id="banReason"
                                placeholder="Enter the reason for banning this user..."
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Ban Expires (Optional)</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal mt-1",
                                      !banExpires && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {banExpires ? format(banExpires, "PPP") : "No expiration"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={banExpires}
                                    onSelect={setBanExpires}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setBanDialogOpen(false);
                                setBanReason("");
                                setBanExpires(undefined);
                                setSelectedUser(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleBanUser}
                              disabled={isSubmitting || !banReason.trim()}
                            >
                              {isSubmitting ? "Banning..." : "Ban User"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No users found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filter !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "No users have been registered yet."
            }
          </p>
        </div>
      )}
    </div>
  );
}
