import {
  describeArc,
  describeCurve,
  polarToCartesian,
  scoreToAngle,
} from "../../utils/fearGreedUtils";

interface FearGreedGaugeProps {
  score: number;
  rating: string;
}

const FearGreedGauge = ({ score }: FearGreedGaugeProps) => {
  const radius = 150;
  const diameter = radius * 2;
  const cx = radius;
  const cy = radius;
  const strokeWidth = 4;

  const sections = [
    { label: "Extreme Fear", color: "#ef4444", min: 0, max: 25 },
    { label: "Fear", color: "#f97316", min: 25, max: 45 },
    { label: "Neutral", color: "#eab308", min: 45, max: 55 },
    { label: "Greed", color: "#a3e635", min: 55, max: 75 },
    { label: "Extreme Greed", color: "#22c55e", min: 75, max: 100 },
  ];

  const needleAngle = scoreToAngle(score);

  return (
    <div className="relative w-full max-w-[400px] mx-auto flex flex-col items-center">
      <svg
        viewBox={`0 0 ${diameter} ${radius}`}
        className="w-full overflow-visible"
      >
        {/* 1. 베이스 섹션 */}
        {sections.map((section, index) => (
          <path
            key={`bg-${index}`}
            d={describeArc(
              cx,
              cy,
              radius,
              scoreToAngle(section.min),
              scoreToAngle(section.max)
            )}
            fill="currentColor"
            className="text-bodyButtonBoxBg stroke-background transition-colors duration-transitionDuration"
            strokeWidth={strokeWidth}
          />
        ))}

        {/* 2. 활성화된 섹션 */}
        {sections.map((section, index) => {
          const isActive = score >= section.min && score <= section.max;
          if (!isActive && !(score >= 100 && index === sections.length - 1))
            return null;
          return (
            <path
              key={`active-${index}`}
              d={describeArc(
                cx,
                cy,
                radius,
                scoreToAngle(section.min),
                scoreToAngle(section.max)
              )}
              fill={section.color}
              className="stroke-bodyText transition-opacity opacity-100 duration-transitionDuration"
              strokeWidth={0}
            />
          );
        })}

        {/* 3. 텍스트 라벨 (textPath) */}
        <defs>
          {sections.map((section, index) => (
            <path
              key={`path-${index}`}
              id={`textPath-${index}`}
              d={describeCurve(
                cx,
                cy,
                radius - 20,
                scoreToAngle(section.min),
                scoreToAngle(section.max)
              )}
            />
          ))}
        </defs>
        {sections.map((section, index) => {
          // 현재 점수가 이 섹션에 속하는지 확인합니다.
          // (score가 100일 때 마지막 섹션이 활성화되도록 예외 처리 포함)
          const isActive =
            (score >= section.min && score < section.max) ||
            (score >= 100 && index === sections.length - 1);

          return (
            <text
              key={`label-${index}`}
              // isActive 값에 따라 동적으로 클래스를 할당합니다.
              className={`text-[8px] xs:text-xs font-bold uppercase tracking-tighter transition-colors duration-transitionDuration ${
                isActive ? "fill-bodyText" : "fill-bodyTextMuted"
              }`}
              dy={-2}
            >
              <textPath
                href={`#textPath-${index}`}
                startOffset="50%"
                textAnchor="middle"
              >
                {section.label}
              </textPath>
            </text>
          );
        })}

        {/* 4. 도넛 마스크 */}
        <path
          d={describeArc(cx, cy, radius * 0.6, 0, 180)}
          className="fill-background transition-colors duration-transitionDuration"
        />

        {/* 5. 눈금 및 점 */}
        {Array.from({ length: 21 }, (_, i) => i * 5).map((tick) => {
          const angle = scoreToAngle(tick);
          const textPos = polarToCartesian(cx, cy, radius - 70, angle);
          const dotPos = polarToCartesian(cx, cy, radius - 70, angle);
          const isMajor = [0, 25, 50, 75, 100].includes(tick);

          return (
            <g key={`tick-${tick}`}>
              {!isMajor && (
                <circle
                  cx={dotPos.x}
                  cy={dotPos.y}
                  r={1}
                  className="fill-slate-400 dark:fill-slate-500"
                />
              )}
              {isMajor && (
                <text
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="text-[10px] font-medium fill-slate-400 dark:fill-slate-500"
                >
                  {tick}
                </text>
              )}
            </g>
          );
        })}

        {/* 6. 바늘 */}
        <g
          className="origin-bottom"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center bottom",
            transform: `rotate(${needleAngle - 90}deg)`,
          }}
        >
          <path
            d={`M ${cx - 4} ${cy - 12} L ${cx} ${cy - radius + 30} L ${
              cx + 4
            } ${cy} Z`}
            fill="currentColor"
            className="text-bodyText"
          />
        </g>

        <defs>
          <filter id="topShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="-4"
              stdDeviation="3"
              floodColor="currentColor"
              floodOpacity="0.25"
            />
          </filter>
        </defs>
        <path
          d={describeArc(cx, cy, radius * 0.3, 0, 180)}
          className="fill-bodyBg text-bodyText"
          filter="url(#topShadow)"
        />
      </svg>

      <div className="absolute bottom-0 translate-y-[10%] flex flex-col items-center">
        <span className="text-5xl font-bold text-bodyText">
          {Math.round(score)}
        </span>
      </div>
    </div>
  );
};

export default FearGreedGauge;
