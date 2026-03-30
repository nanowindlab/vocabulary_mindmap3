import React from "react";
import { Layers } from "lucide-react";
import { StatusPanel } from "./StatusPanel";

export const MetaLearningBoard = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h2>메타 학습 보드</h2>
        <p style={{ color: "var(--text-secondary)" }}>
          학습 전반의 메타-언어 및 구조적 어휘 (방법, 물음 등)
        </p>
      </div>
      <StatusPanel
        kicker="Placeholder"
        title="메타 학습 카탈로그 준비 중"
        description="방법, 물음, 구조적 어휘 같은 meta-learning surface가 이 영역에 들어옵니다."
        icon={Layers}
        tone="var(--accent-purple)"
      />
    </div>
  );
};
