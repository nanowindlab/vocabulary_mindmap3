import React from "react";
import { Layers } from "lucide-react";

export const MetaLearningBoard = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h2>메타 학습 보드</h2>
        <p style={{ color: "var(--text-secondary)" }}>
          학습 전반의 메타-언어 및 구조적 어휘 (방법, 물음 등)
        </p>
      </div>
      <div className="card-glass" style={{ padding: 20, borderRadius: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "var(--text-secondary)",
          }}
        >
          <Layers size={16} />
          <span>준비 중: 메타 학습 카탈로그가 이곳에 표시됩니다.</span>
        </div>
      </div>
    </div>
  );
};
