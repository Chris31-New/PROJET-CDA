export const ProfileProjectBadge = ({
    name,
    className = "",
}: {
    name: string;
    className?: string;
}) => {
    return (
        <div
            className={`rounded-full bg-[#FA8C00]/95 shadow-sm ${className} md:hidden`}
        >
            <h2 className="whitespace-nowrap text-sm font-semibold text-white">
                {name}
            </h2>
        </div>
    );
};