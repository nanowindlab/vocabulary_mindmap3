import React from "react";
import { Compass } from "lucide-react";
import { StatusPanel } from "./StatusPanel";

export const ExpressionBoard = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h2>표현 코어 보드</h2>
        <p style={{ color: "var(--text-secondary)" }}>
          상황, 기분, 빈도 등 동적이고 표현적인 어휘 그룹
        </p>
      </div>
      <StatusPanel
        kicker="Placeholder"
        title="표현 코어 리스트 준비 중"
        description="상황, 기분, 빈도처럼 동적인 표현 surface가 이 영역에 정리될 예정입니다."
        icon={Compass}
        tone="var(--accent-orange)"
      />
    </div>
  );
};
