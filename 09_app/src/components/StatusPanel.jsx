import React from "react";

export const StatusPanel = ({
  kicker = null,
  title,
  description,
  icon: Icon = null,
  tone = "var(--accent-blue)",
  compact = false,
  loading = false,
}) => {
  return (
    <div
      className={`card-glass status-panel-shell${compact ? " compact" : ""}`}
      style={{
        borderLeft: `3px solid ${tone}`,
      }}
    >
      {Icon ? (
        <div
          className={`status-panel-icon${loading ? " is-loading" : ""}`}
          style={{ color: tone, borderColor: `${tone}33`, background: `${tone}14` }}
        >
          <Icon size={compact ? 16 : 18} />
        </div>
      ) : null}
      <div className="status-panel-copy">
        {kicker ? (
          <div className="status-panel-kicker" style={{ color: tone }}>
            {kicker}
          </div>
        ) : null}
        <div className="status-panel-title">{title}</div>
        {description ? <div className="status-panel-description">{description}</div> : null}
      </div>
    </div>
  );
};
