"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export default function GrowthGauge({ value, size = 240, thickness = 8, segments = 36, startAngle = 150, // degrees (0 at 12 o'clock)
endAngle = 390, // degrees (clockwise)
label = "Growth", subtext, className = "", }) {
    const clamped = value || Math.max(0, Math.min(100, value));
    const activeCount = Math.round((clamped / 100) * segments);
    const cx = size / 2;
    const cy = size / 2;
    const radius = Math.min(cx, cy) * 0.78;
    const tickLength = Math.max(12, Math.floor(size * 0.09));
    const innerR = radius - tickLength;
    const step = (endAngle - startAngle) / segments;
    // Convert our "top = 0deg" into standard canvas coords
    const toRadians = (deg) => ((deg - 90) * Math.PI) / 180;
    const ticks = Array.from({ length: segments }, (_, i) => {
        const angle = startAngle + i * step;
        const rad = toRadians(angle);
        const x1 = cx + innerR * Math.cos(rad);
        const y1 = cy + innerR * Math.sin(rad);
        const x2 = cx + radius * Math.cos(rad);
        const y2 = cy + radius * Math.sin(rad);
        const isActive = i < activeCount;
        // Slight opacity ramp to emulate the "sweep" effect
        const progress = segments <= 1 ? 1 : i / (segments - 1);
        // inactive ticks: very faint, active ticks: increasing opacity
        const opacity = isActive ? 0.35 + 0.65 * progress : 0.15;
        return { x1, y1, x2, y2, isActive, opacity };
    });
    return (_jsx(_Fragment, { children: _jsxs("div", { className: ["flex w-full flex-col items-center justify-center", "text-foreground", className].join(" "), role: "img", "aria-label": `Growth gauge at ${clamped}%`, style: { ["--gauge-size"]: `${size}px` }, children: [_jsxs("svg", { viewBox: `0 0 ${size} ${size}`, className: "h-auto w-full max-w-[var(--gauge-size)] overflow-visible", "aria-hidden": "true", preserveAspectRatio: "xMidYMid meet", children: [ticks.map((t, idx) => (_jsx("line", { x1: t.x1, y1: t.y1, x2: t.x2, y2: t.y2, stroke: "currentColor", strokeWidth: thickness, strokeLinecap: "round", className: t.isActive ? "text-primary" : "text-primary", style: { opacity: t.opacity } }, idx))), _jsxs("text", { x: cx, y: cy, textAnchor: "middle", dominantBaseline: "central", fill: "currentColor", className: "font-semibold", fontSize: size * 0.22, children: [clamped, "%"] }), _jsx("text", { x: cx, y: cy + size * 0.16, textAnchor: "middle", className: "fill-muted-foreground", fontSize: size * 0.08, children: label })] }), subtext ? _jsx("div", { className: "mt-6 text-sm text-muted-foreground", children: subtext }) : null] }) }));
}
