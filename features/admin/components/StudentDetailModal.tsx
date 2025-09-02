"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Student } from "@/types/student";

interface StudentDetailModalProps {
    student: Student | null;
    isOpen: boolean;
    onClose: () => void;
    dict: any;
}

export function StudentDetailModal({ student, isOpen, onClose, dict }: StudentDetailModalProps) {
    if (!student) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{dict.admin.dashboard.details.title}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <h3 className="font-semibold mb-2">{dict.admin.dashboard.details.name}</h3>
                        <p>{student.name}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">{dict.admin.dashboard.details.school}</h3>
                        <p>{student.school}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">{dict.admin.dashboard.details.grade}</h3>
                        <p>{student.grade}</p>
                    </div>
                    {/* <div>
                        <h3 className="font-semibold mb-2">{dict.admin.dashboard.details.status}</h3>
                        <p>{student.status}</p>
                    </div>
                    <div className="col-span-2">
                        <h3 className="font-semibold mb-2">{dict.admin.dashboard.details.familyInfo}</h3>
                        <p>{student.familyInfo}</p>
                    </div>
                    <div className="col-span-2">
                        <h3 className="font-semibold mb-2">{dict.admin.dashboard.details.academicInfo}</h3>
                        <p>{student.academicInfo}</p>
                    </div> */}
                </div>
            </DialogContent>
        </Dialog>
    );
}
