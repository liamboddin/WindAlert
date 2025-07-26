import { NavigateFunction } from "react-router-dom";

let navigateRef: NavigateFunction | null = null;

export const setNavigate = (nav: NavigateFunction) => {
    navigateRef = nav;
};

export const goTo = (to: string, replace = false) => {
    if (navigateRef) {
        navigateRef(to, { replace });
    } else {
        // Fallback, falls navigate noch nicht gesetzt ist
        window.location.href = to;
    }
};