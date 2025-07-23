/** @type {import("tailwindcss").Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    important: true, // Dies stellt sicher, dass Tailwind MUI überschreibt
    theme: {
        extend: {},
    },
    plugins: [],
};
