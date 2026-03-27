import React from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

export default function ProductFilterBar() {
    return (
        <div className="bg-white py-4 px-2 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">

                {/* Left: Search (Black Pill) */}
                <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-md bg-black rounded-full px-6 py-3 shadow-lg">
                    <Search className="h-4 w-4 text-white" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full bg-transparent outline-none text-white placeholder-gray-400 text-sm"
                    />
                </div>

                {/* center: Collection Filter (Black Pill) */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-center bg-black rounded-full px-6 py-3 shadow-lg cursor-pointer hover:bg-gray-900 transition-colors">
                    <SlidersHorizontal className="h-4 w-4 text-white" />
                    <span className="text-white font-medium text-sm">Featured Collection</span>
                </div>

                {/* Right: Price Filter (Black Pill) */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between bg-black rounded-full px-6 py-3 shadow-lg cursor-pointer hover:bg-gray-900 transition-colors">
                    <span className="text-white font-medium text-sm">All Prices</span>
                    <ChevronDown className="h-4 w-4 text-white" />
                </div>

            </div>
        </div>
    );
}
