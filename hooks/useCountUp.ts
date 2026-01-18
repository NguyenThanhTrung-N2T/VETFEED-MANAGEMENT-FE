import { useEffect, useState } from "react";

export function useCountUp(
    target: number,
    duration = 800,
    start = 0
) {
    const [value, setValue] = useState(start);

    useEffect(() => {
        let startTs: number | null = null;

        const step = (ts: number) => {
            if (!startTs) startTs = ts;
            const progress = Math.min((ts - startTs) / duration, 1);
            setValue(Math.floor(progress * (target - start) + start));
            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }, [target, duration, start]);

    return value;
}
