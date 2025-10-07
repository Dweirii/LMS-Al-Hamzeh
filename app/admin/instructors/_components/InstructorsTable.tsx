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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit, Trash2, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import {
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from "../actions";
import { InstructorSummary } from "../actions";

interface InstructorsTableProps {
  instructors: InstructorSummary[];
}

type FilterType = "all" | "UJ" | "PETRA";

export function InstructorsTable({ instructors }: InstructorsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "UJ"
  });

  const filteredInstructors = useMemo(() => {
    return instructors.filter((instructor) => {
      const matchesSearch = 
        instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filter === "all" ||
        instructor.university === filter;
      
      return matchesSearch && matchesFilter;
    });
  }, [instructors, searchTerm, filter]);

  const getUniversityBadgeVariant = (university: string) => {
    switch (university) {
      case "UJ":
        return "default";
      case "PETRA":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getUniversityColor = (university: string) => {
    switch (university) {
      case "UJ":
        return "bg-green-100 text-green-800 border-green-200";
      case "PETRA":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy");
  };

  const handleCreateInstructor = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    const { data: result, error } = await tryCatch(
      createInstructor(formData.name, formData.email)
    );

    if (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } else if (result.status === "success") {
      toast.success(result.message);
      setCreateDialogOpen(false);
      setFormData({ name: "", email: "", university: "UJ" });
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  const handleEditInstructor = async () => {
    if (!selectedInstructor || !formData.name.trim() || !formData.email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    const { data: result, error } = await tryCatch(
      updateInstructor(selectedInstructor.id, formData.name, formData.email)
    );

    if (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } else if (result.status === "success") {
      toast.success(result.message);
      setEditDialogOpen(false);
      setSelectedInstructor(null);
      setFormData({ name: "", email: "", university: "UJ" });
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  const handleDeleteInstructor = async () => {
    if (!selectedInstructor) return;

    setIsSubmitting(true);
    const { data: result, error } = await tryCatch(
      deleteInstructor(selectedInstructor.id)
    );

    if (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } else if (result.status === "success") {
      toast.success(result.message);
      setDeleteDialogOpen(false);
      setSelectedInstructor(null);
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  const openEditDialog = (instructor: InstructorSummary) => {
    setSelectedInstructor(instructor);
    setFormData({
      name: instructor.name,
      email: instructor.email,
      university: instructor.university
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (instructor: InstructorSummary) => {
    setSelectedInstructor(instructor);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", university: "UJ" });
    setSelectedInstructor(null);
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search instructors by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by university" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Universities</SelectItem>
              <SelectItem value="UJ">University of Jordan</SelectItem>
              <SelectItem value="PETRA">Petra University</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Instructor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Instructor</DialogTitle>
              <DialogDescription>
                Create a new instructor account. They will be able to manage courses once created.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter instructor name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter instructor email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="university">University</Label>
                <Select
                  value={formData.university}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, university: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UJ">University of Jordan</SelectItem>
                    <SelectItem value="PETRA">Petra University</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCreateDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateInstructor}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Instructor"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Instructors Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Instructor</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInstructors.map((instructor) => (
              <TableRow key={instructor.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{instructor.name}</div>
                      <div className="text-sm text-muted-foreground">{instructor.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={getUniversityBadgeVariant(instructor.university)}
                    className={getUniversityColor(instructor.university)}
                  >
                    {instructor.university === "UJ" ? "University of Jordan" : "Petra University"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{instructor.totalCourses}</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    {instructor.totalCourses === 1 ? "course" : "courses"}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(instructor.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(instructor)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(instructor)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Instructor</DialogTitle>
            <DialogDescription>
              Update instructor information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                placeholder="Enter instructor name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter instructor email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditInstructor}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Instructor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Instructor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedInstructor?.name}? This action cannot be undone.
              {selectedInstructor?.totalCourses && selectedInstructor.totalCourses > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  Warning: This instructor has {selectedInstructor.totalCourses} assigned courses. 
                  Please reassign them first.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedInstructor(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteInstructor}
              disabled={isSubmitting || (selectedInstructor?.totalCourses ? selectedInstructor.totalCourses > 0 : false)}
            >
              {isSubmitting ? "Deleting..." : "Delete Instructor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredInstructors.length === 0 && (
        <div className="text-center py-8">
          <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No instructors found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filter !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "No instructors have been added yet."
            }
          </p>
        </div>
      )}
    </div>
  );
}
