// 1. 수학 유틸리티: 극좌표(각도, 반지름)를 직교좌표(x, y)로 변환
const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

// 2. 부채꼴(Arc) 패스(d) 생성 함수
const describeArc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "L",
    x,
    y,
    "L",
    start.x,
    start.y,
  ].join(" ");
};

// ✅ 3. 텍스트가 따라갈 '곡선 경로' 생성 함수 (선만 그림)
// 부채꼴 닫기(L x y)를 하지 않고 순수하게 호(Arc)만 그립니다.
const describeCurve = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  // 텍스트는 왼쪽(Start)에서 오른쪽(End)으로 읽혀야 하므로 방향 중요
  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  // SVG Arc 명령어: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  // sweep-flag를 1로 설정하여 시계 방향(왼쪽->오른쪽)으로 그립니다.
  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    1,
    end.x,
    end.y,
  ].join(" ");
};

interface FearGreedGaugeProps {
  score: number; // 0 ~ 100
  rating: string;
}

const FearGreedGauge = ({ score }: FearGreedGaugeProps) => {
  // 게이지 크기 설정
  const radius = 150;
  const diameter = radius * 2;
  const cx = radius;
  const cy = radius;
  const strokeWidth = 4; // 섹션 사이 구분선 두께 (조금 더 잘 보이게 키움)

  // 공탐지수 구간 정의
  const sections = [
    { label: "Extreme Fear", color: "#ef4444", min: 0, max: 25 },
    { label: "Fear", color: "#f97316", min: 25, max: 45 },
    { label: "Neutral", color: "#eab308", min: 45, max: 55 },
    { label: "Greed", color: "#a3e635", min: 55, max: 75 },
    { label: "Extreme Greed", color: "#22c55e", min: 75, max: 100 },
  ];

  // 점수 -> 각도 변환
  const scoreToAngle = (value: number) => (value / 100) * 180;

  // 바늘 각도 (0~180도)
  const needleAngle = scoreToAngle(score);

  return (
    <div className="relative w-full max-w-[400px] mx-auto flex flex-col items-center">
      <svg
        viewBox={`0 0 ${diameter} ${radius}`}
        className="w-full overflow-visible"
      >
        {/* 1. 기본 베이스 섹션 (회색) */}
        {sections.map((section, index) => {
          const startAngle = scoreToAngle(section.min);
          const endAngle = scoreToAngle(section.max);

          return (
            <path
              key={`bg-${index}`}
              d={describeArc(cx, cy, radius, startAngle, endAngle)}
              fill="currentColor"
              // ✅ 구분선을 흰색(다크모드에선 어두운색)으로 명시적 지정
              className="text-slate-200 dark:text-slate-700 stroke-white dark:stroke-slate-900"
              strokeWidth={strokeWidth}
            />
          );
        })}

        {/* 2. 활성화된 섹션 (컬러) */}
        {sections.map((section, index) => {
          const isActive = score >= section.min && score <= section.max;
          // 마지막 100점 포함 처리
          if (!isActive && !(score >= 100 && index === sections.length - 1))
            return null;

          const startAngle = scoreToAngle(section.min);
          const endAngle = scoreToAngle(section.max);

          return (
            <path
              key={`active-${index}`}
              d={describeArc(cx, cy, radius, startAngle, endAngle)}
              fill={section.color}
              // ✅ 활성화된 섹션도 구분선 색상 동일하게 적용
              className="stroke-white dark:stroke-slate-900 transition-opacity duration-300 opacity-100"
              strokeWidth={strokeWidth}
            />
          );
        })}

        {/* 3. 섹션 라벨 텍스트 (EXTREME FEAR 등 - 바깥쪽) */}
        <defs>
          {sections.map((section, index) => {
            const startAngle = scoreToAngle(section.min);
            const endAngle = scoreToAngle(section.max);
            // 텍스트를 위한 보이지 않는 경로(Curve) 정의
            return (
              <path
                key={`path-${index}`}
                id={`textPath-${index}`} // ID 부여
                d={describeCurve(cx, cy, radius - 20, startAngle, endAngle)}
              />
            );
          })}
        </defs>

        {sections.map((section, index) => (
          <text
            key={`label-${index}`}
            className="text-[8px] xs:text-xs font-bold fill-slate-400 dark:fill-slate-500 uppercase tracking-tighter"
            dy={-2} // 선에서 살짝 위로 띄우기
          >
            <textPath
              href={`#textPath-${index}`} // 위에서 정의한 path ID 참조
              startOffset="50%" // 경로의 중간 지점
              textAnchor="middle" // 텍스트 중심 정렬
            >
              {section.label}
            </textPath>
          </text>
        ))}

        {/* 3. 도넛 모양 마스크 (하얀 반원) */}
        {/* ✅ 바늘보다 먼저 그려서 바늘이 이 위에 올라오게 함 (레이어 순서 변경) */}
        <path
          d={describeArc(cx, cy, radius * 0.6, 0, 180)}
          className="fill-white dark:fill-slate-900"
        />

        {/* 4. 눈금 및 점 (0~100까지 5단위로 자동 생성) */}
        {Array.from({ length: 21 }, (_, i) => i * 5).map((tick) => {
          const angle = scoreToAngle(tick);

          // 텍스트 위치
          const textPos = polarToCartesian(cx, cy, radius - 70, angle);
          // 숫자를 표시할 주요 눈금인지 확인 (0, 25, 50, 75, 100)
          const isMajor = [0, 25, 50, 75, 100].includes(tick);

          // 점 위치
          const dotPos = polarToCartesian(cx, cy, radius - 70, angle);

          return (
            <g key={`tick-${tick}`}>
              {/* 점 (Major는 반지름 2, 나머지는 1.5로 크기 구분) */}
              {!isMajor && (
                <circle
                  cx={dotPos.x}
                  cy={dotPos.y}
                  r={1}
                  className="fill-slate-400 dark:fill-slate-500"
                />
              )}

              {/* 숫자는 Major 눈금(0, 25, 50...)일 때만 렌더링 */}
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

        {/* 4. 바늘 (Needle) */}
        {/* ✅ 가장 마지막에 그려서 맨 위에 오게 함 */}
        <g
          className="transition-transform duration-1000 ease-out origin-bottom"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center bottom",
            // ✅ [수정] -90도를 해줘야 0점이 왼쪽(9시 방향)을 가리킴
            transform: `rotate(${needleAngle - 90}deg)`,
          }}
        >
          {/* 바늘 몸통 */}
          <path
            d={`M ${cx - 4} ${cy - 12} L ${cx} ${cy - radius + 30} L ${
              cx + 4
            } ${cy} Z`}
            fill="currentColor"
            className="text-slate-800 dark:text-slate-100"
          />
        </g>

        {/* 바늘 중심 원 */}
        <defs>
          <filter id="topShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="-4"
              stdDeviation="3"
              flood-color="rgba(0,0,0,0.1)"
            />
          </filter>
        </defs>
        <path
          d={describeArc(cx, cy, radius * 0.3, 0, 180)}
          className="fill-white dark:fill-slate-900"
          filter="url(#topShadow)"
        />
      </svg>

      <div className="absolute bottom-0 translate-y-[10%] flex flex-col items-center">
        <span className="text-5xl font-bold text-slate-900 dark:text-white transition-all duration-500">
          {Math.round(score)}
        </span>
      </div>
    </div>
  );
};

export default FearGreedGauge;
