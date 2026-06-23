"use client";

import FormRouteError from "@/components/FormRouteError";

export default function FacelemError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return <FormRouteError error={error} reset={reset} routeName="facelem" />;
}
