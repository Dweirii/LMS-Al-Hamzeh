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
import {
  CalendarIcon,
  Search,
  Ban,
  UserCheck,
  Shield,
  ShieldCheck,
  Wrench,
  Headset,
  BookOpen,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/general/StatusBadge";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import {
  banUserAction,
  unbanUserAction,
  updateUserRoleAction,
} from "../actions";
import type { AdminUserType } from "@/app/data/admin/admin-get-users";
import {
  adminTypes,
  adminTypeDetails,
  type AdminType,
} from "@/lib/zodSchemas";

type User = AdminUserType;

const adminTypeIcons: Record<AdminType, LucideIcon> = {
  general: ShieldCheck,
  technical_support: Wrench,
  call_center: Headset,
  content_manager: BookOpen,
  finance: Receipt,
};

const isAdminType = (value: string | null): value is AdminType =>
  value !== null && (adminTypes as readonly string[]).includes(value);

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
  const [adminDialogUser, setAdminDialogUser] = useState<User | null>(null);
  const [selectedAdminType, setSelectedAdminType] = useState<AdminType | null>(
    null
  );

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

  const openAdminDialog = (user: User) => {
    setSelectedAdminType(isAdminType(user.adminType) ? user.adminType : null);
    setAdminDialogUser(user);
  };

  const closeAdminDialog = () => {
    setAdminDialogUser(null);
    setSelectedAdminType(null);
  };

  const handleRoleChange = async (user: User, newRole: string) => {
    // Admins need a type, so choosing Admin opens the type dialog instead of
    // saving straight away.
    if (newRole === "admin") {
      openAdminDialog(user);
      return;
    }

    const { data: result, error } = await tryCatch(
      updateUserRoleAction(user.id, newRole)
    );

    if (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } else if (result.status === "success") {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleConfirmAdmin = async () => {
    if (!adminDialogUser || !selectedAdminType) return;

    setIsSubmitting(true);
    const { data: result, error } = await tryCatch(
      updateUserRoleAction(adminDialogUser.id, "admin", selectedAdminType)
    );

    if (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } else if (result.status === "success") {
      toast.success(result.message);
      closeAdminDialog();
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "user":
        return "secondary";
      case "instructor":
        return "default";
    }
  };

  const getStatusBadge = (user: User) => {
    if (user.banned) {
      return <StatusBadge status="Banned" />;
    }
    return <StatusBadge status="Active" />;
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-[420px] sm:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="Search users"
          />
        </div>
        <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
          <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by status">
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
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
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
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-primary">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </span>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role || "No Role"}
                    </Badge>
                    {user.role === "admin" && (
                      <button
                        type="button"
                        onClick={() => openAdminDialog(user)}
                        title="Change admin type"
                        className={cn(
                          "inline-flex h-6 items-center whitespace-nowrap rounded-full px-2.5 text-xs font-medium transition-colors",
                          isAdminType(user.adminType)
                            ? "bg-brand-soft text-primary hover:bg-brand-soft/70"
                            : "border border-dashed border-input text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {isAdminType(user.adminType)
                          ? adminTypeDetails[user.adminType].label
                          : "Set type"}
                      </button>
                    )}
                  </div>
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
                      isBanExpired(user.banExpires) ? "text-success" : "text-muted-foreground"
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
                      onValueChange={(value) => handleRoleChange(user, value === "no-role" ? "" : value)}
                    >
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="instructor">Instructor</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Ban/Unban Button */}
                    {user.banned ? (
                      <Dialog open={unbanDialogOpen} onOpenChange={setUnbanDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-transparent bg-success-soft text-success hover:bg-success-soft/80 hover:text-success"
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
                            variant="outline"
                            size="sm"
                            className="border-transparent bg-danger-soft text-danger hover:bg-danger-soft/80 hover:text-danger"
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
                              variant="destructive"
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

      {/* Admin type dialog — opened by choosing Admin or clicking the type pill */}
      <Dialog
        open={adminDialogUser !== null}
        onOpenChange={(open) => {
          if (!open) closeAdminDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {adminDialogUser?.role === "admin"
                ? `Change admin type for ${adminDialogUser?.name}`
                : `Make ${adminDialogUser?.name} an admin`}
            </DialogTitle>
            <DialogDescription>
              Every admin type has full access to the admin console. The type
              shows who does what.
            </DialogDescription>
          </DialogHeader>
          <div role="radiogroup" aria-label="Admin type" className="grid gap-2">
            {adminTypes.map((type) => {
              const Icon = adminTypeIcons[type];
              const isSelected = selectedAdminType === type;
              return (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedAdminType(type)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                    isSelected
                      ? "border-primary bg-brand-soft"
                      : "border-input hover:bg-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-[18px] shrink-0",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                    aria-hidden="true"
                  />
                  <span className="grid flex-1">
                    <span className="text-sm font-medium">
                      {adminTypeDetails[type].label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {adminTypeDetails[type].description}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "size-4 shrink-0 rounded-full border",
                      isSelected
                        ? "border-[5px] border-primary"
                        : "border-input"
                    )}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAdminDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAdmin}
              disabled={isSubmitting || !selectedAdminType}
            >
              {isSubmitting
                ? "Saving..."
                : adminDialogUser?.role === "admin"
                  ? "Save type"
                  : "Make admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredUsers.length === 0 && (
        <div className="rounded-xl border border-dashed bg-card/60 py-12 text-center">
          <Shield className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h3 className="font-serif text-lg font-medium">No users found</h3>
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
