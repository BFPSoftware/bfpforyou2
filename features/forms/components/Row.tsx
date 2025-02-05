import React, { ReactNode } from "react";

const Row = ({ children }: { children: ReactNode }) => {
    return <div className="flex flex-wrap mb-6">{children}</div>;
};

export default Row;
