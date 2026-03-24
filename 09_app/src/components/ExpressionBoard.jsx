import React from "react";
import { Compass } from "lucide-react";

export const ExpressionBoard = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h2>표현 코어 보드</h2>
        <p style={{ color: "var(--text-secondary)" }}>
          상황, 기분, 빈도 등 동적이고 표현적인 어휘 그룹
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
          <Compass size={16} />
          <span>준비 중: 표현 코어 리스트가 이곳에 표시됩니다.</span>
        </div>
      </div>
    </div>
  );
};
