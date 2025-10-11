import { Button } from "@/components/ui/button";

const filters = ["Best Seller", "Hot Collection", "Trendy", "New Arrival"];

interface ProductFilterProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

export const ProductFilter = ({ activeFilter, onFilterChange }: ProductFilterProps) => {
    return (
        <nav aria-label="Product filters" className="mb-8 md:mb-16">
            <ul className="flex md:flex-wrap md:justify-center gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {filters.map((filter) => (
                    <li key={filter} className="flex-shrink-0">
                        <Button
                            variant={activeFilter === filter ? "default" : "outline"}
                            onClick={() => onFilterChange(filter)}
                            size="sm"
                            className={`transition-all duration-300 whitespace-nowrap ${activeFilter === filter
                                ? "shadow-primary md:scale-105"
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
