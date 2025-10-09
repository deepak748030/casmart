import { Button } from "@/components/ui/button";

const filters = ["Best Seller", "Hot Collection", "Trendy", "New Arrival"];

interface ProductFilterProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

export const ProductFilter = ({ activeFilter, onFilterChange }: ProductFilterProps) => {
    return (
        <nav aria-label="Product filters">
            <ul className="flex flex-wrap justify-center gap-3 mb-16">
                {filters.map((filter) => (
                    <li key={filter}>
                        <Button
                            variant={activeFilter === filter ? "default" : "outline"}
                            onClick={() => onFilterChange(filter)}
                            className={`transition-all duration-300 ${activeFilter === filter
                                    ? "shadow-primary scale-105"
                                    : "hover:scale-105 hover:border-primary/50"
                                }`}
                        >
                            {filter}
                        </Button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
