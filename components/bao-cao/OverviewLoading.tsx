import { useCountUp } from "@/hooks/useCountUp";

interface OverviewLoadingProps {
    summaryCards: { label: string; color: string; maxNumber?: number }[];
    chartBars?: number[];
    showPieChart?: boolean;
}

export const OverviewLoading: React.FC<OverviewLoadingProps> = ({ summaryCards, chartBars, showPieChart = false }) => {
    return (
        <div className="space-y-6">
            {/* SUMMARY CARDS */}
            <div className={`grid grid-cols-1 md:grid-cols-${summaryCards.length} gap-6`}>
                {summaryCards.map((card, idx) => {
                    const value = card.maxNumber ? useCountUp(card.maxNumber) : 0;
                    return (
                        <div
                            key={idx}
                            className={`relative rounded-2xl p-6 shadow-sm bg-${card.color}-300 transition-all`}
                        >
                            <div className={`flex justify-between mb-2 text-${card.color}-900 text-sm font-semibold`}>
                                <span>{card.label}</span>
                            </div>

                            <div className={`text-4xl font-bold text-${card.color}-900 animate-pulse`}>
                                {card.maxNumber ? value.toLocaleString('vi') : "..."}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* BAR CHART SKELETON */}
            {chartBars && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-6 animate-pulse">
                        {/* Icon placeholder */}
                        <div className="h-6 w-6 bg-gray-200 rounded-md" />
                        {/* Title placeholder */}
                        <div className="h-6 w-48 bg-gray-200 rounded-md" />
                    </div>

                    {/* Chart area - kept your height logic but cleaned up */}
                    <div className="h-100 flex items-end justify-between gap-1 md:gap-3 px-2">
                        {chartBars.map((height, i) => (
                            <div key={i} className="w-full flex flex-col justify-end h-full gap-2 group">
                                <div
                                    className="w-full bg-gray-200 rounded-t-lg animate-pulse"
                                    style={{
                                        height: `${height}%`,
                                        animationDelay: `${i * 100}ms`
                                    }}
                                />
                                {/* X Axis label placeholder */}
                                <div className="h-2 w-full max-w-5 mx-auto bg-gray-100 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* PIE CHART SKELETON */}
            {showPieChart && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-full min-h-100 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-8 animate-pulse">
                        <div className="h-6 w-6 bg-gray-200 rounded-md" />
                        <div className="h-6 w-32 bg-gray-200 rounded-md" />
                    </div>

                    {/* Circle & Legend Container */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-8">
                        {/* The Pie Circle */}
                        <div className="relative flex items-center justify-center">
                            <div
                                className="w-56 h-56 rounded-full animate-pulse"
                                style={{
                                    background: `conic-gradient(
                                                #f3f4f6 0deg 120deg,
                                                #e5e7eb 120deg 240deg,
                                                #d1d5db 240deg 360deg
                                            )`
                                }}
                            />
                            {/* Donut Hole (Optional - for donut pie chart) */}
                            {/* <div className="absolute w-28 h-28 bg-white rounded-full"></div> */}
                        </div>

                        {/* Legend Items */}
                        <div className="w-full px-4 space-y-3 animate-pulse">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                                        <div className="h-3 w-20 bg-gray-200 rounded" />
                                    </div>
                                    <div className="h-3 w-10 bg-gray-100 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};