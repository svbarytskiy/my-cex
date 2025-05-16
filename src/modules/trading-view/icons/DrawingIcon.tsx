export const DrawingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        className={className}
    >
        <path
            fill="currentColor"
            d="M3 2a1 1 0 0 1 1 1v17h17a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"
        />
        <path
            fill="currentColor"
            d="M20.155 6.745a1 1 0 0 1 .1 1.41l-1.16 1.339a2.686 2.686 0 0 1-3.259 3.742l-2.086 2.417a1 1 0 0 1-1.502.014L9.196 12.26l-2.459 2.683a1 1 0 0 1-1.474-1.352l3.205-3.496a1 1 0 0 1 1.482.008l3.029 3.382 1.331-1.544a2.686 2.686 0 0 1 3.293-3.78l1.142-1.316a1 1 0 0 1 1.41-.1Zm-3.766 4.56a.686.686 0 1 0-.26-.22 1.012 1.012 0 0 1 .26.22Z"
        />
    </svg>
);