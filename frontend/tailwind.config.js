// tailwind.config.js
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Tajawal', 'sans-serif'], // تعيين Tajawal كخط sans الافتراضي
            },
        },
    },
    plugins: [],
};
