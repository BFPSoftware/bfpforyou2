export const coordinatorEmails = {
    highschool: "sharona@kerenbshemesh.org.il",
    bshemesh: "sharona@kerenbshemesh.org.il",
    leviEshkol: "Galitalex@gmail.com",
    zalmanAran: "Osnatsteyer@yahoo.com",
    benZvi: "Veredfree3@gmail.com",
    hadekel: "mlakmilhem@gmail.com",
} as const;

export const getSchoolCoordinatorEmail = (school: string) => {
    switch (school) {
        case "Ben Zvi":
            return coordinatorEmails.benZvi;
        case "HaDekel":
            return coordinatorEmails.hadekel;
        case "Levi Eshkol":
            return coordinatorEmails.leviEshkol;
        case "Zalman Aran":
            return coordinatorEmails.zalmanAran;
        case "Jabutinsky":
        case "Uziel":
        case "Orot - Boys":
        case "Orot - Girls":
            return coordinatorEmails.bshemesh;
        default:
            return coordinatorEmails.bshemesh;
    }
};
