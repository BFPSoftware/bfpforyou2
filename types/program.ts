export const programs = ["FAC Elementary", "FAC Highschool", "New Immigrant"] as const;
export type Programs = (typeof programs)[number];
// Function to check if a value is included in the programs array
export const isProgramIncluded = (program: string): program is Programs => {
    return programs.includes(program as Programs);
};
