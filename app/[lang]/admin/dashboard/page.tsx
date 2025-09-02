import { getDictionary } from "../../dictionaries";
import { Locale } from "@/types/locales";
import { Student } from "@/types/student";
import { DashboardClient } from "@/features/admin/components/DashboardClient";

// Dummy data for demonstration
const dummyStudents: Student[] = [
    {
        id: "1",
        name: "John Doe",
        school: "Jabutinsky",
        grade: "5th",
        // status: "Pending",
        submissionDate: "2024-03-15",
        // familyInfo: "Lives with both parents and two siblings. Family recently moved to the area.",
        // academicInfo: "Shows strong interest in mathematics and science. Needs support in language arts.",
    },
    {
        id: "2",
        name: "Jane Smith",
        school: "Levi Eshkol",
        grade: "3rd",
        // status: "Approved",
        submissionDate: "2024-03-14",
        // familyInfo: "Single-parent household with three children. Mother works full-time.",
        // academicInfo: "Excellent student in all subjects. Participates actively in class discussions.",
    },
    // Add more dummy data as needed
];

interface PageProps {
    params: Promise<{ lang: Locale }>;
}

export default async function DashboardPage({ params }: PageProps) {
    const lang = (await params).lang;
    const dict = await getDictionary(lang);

    return <DashboardClient lang={lang} dict={dict} dummyStudents={dummyStudents} />;
}
