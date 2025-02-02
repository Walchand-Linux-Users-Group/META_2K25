import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";

export function CustomNumberInput({ value, onChange, min = 1, max = 3 }) {
    const handleIncrement = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    const handleDecrement = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={value <= min}
                className="bg-background/50 border-[#4879e2] hover:bg-[#4879e2]"
            >
                <Minus className="h-4 w-4" />
            </Button>
            <Input
                // type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                min={min}
                max={max}
                className="w-16 text-center bg-background/50 border-[#4879e2]"
            />
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                disabled={value >= max}
                className="bg-background/50 border-[#4879e2] hover:bg-[#4879e2]"
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
}
