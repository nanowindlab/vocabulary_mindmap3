import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  CheckCircle,
  BrainCircuit,
} from "lucide-react";

const getPrimaryTranslation = (item) => {
  const translations = item?.translation_summary || [];
  if (!translations.length) return null;
  const english = translations.find((t) => t?.language === "영어");
  const first = english || translations[0];
  return {
    language: first.language || null,
    word: first.word || null,
    definition: first.definition || null,
  };
};

export const FlipcardDeck = ({ items, contextLabel, onClose, showEnglish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(new Set());

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, 150);
  };

  // Use Spacebar to flip, arrows to navigate
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === " ") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [items.length]); // missing dependencies fixed

  if (!items || items.length === 0) {
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <div style={headerStyle}>
            <h3>{contextLabel}</h3>
            <button onClick={onClose} style={closeBtnStyle}>
              <X size={18} />
            </button>
          </div>
          <p
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--text-secondary)",
            }}
          >
            합습할 카드가 없습니다.
          </p>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];
  const primaryTranslation = getPrimaryTranslation(currentItem);
  // Determine if there is example data available
  const hasExample =
    currentItem?.examples_bundle && currentItem.examples_bundle.length > 0;
  const exampleText = hasExample
    ? currentItem.examples_bundle[0].text_ko
    : "예문 준비 중...";

  // definitions moved above

  const markKnown = () => {
    setCompleted((prev) => {
      const n = new Set(prev);
      n.add(currentItem.id);
      return n;
    });
    handleNext();
  };

  const progress = ((currentIndex + 1) / items.length) * 100;
  const isKnown = completed.has(currentItem.id);

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            <BrainCircuit size={16} /> <span>{contextLabel}</span> •{" "}
            <span style={{ color: "var(--accent-green)" }}>
              {currentIndex + 1} / {items.length}
            </span>
          </div>
          <button onClick={onClose} style={closeBtnStyle}>
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            height: "4px",
            backgroundColor: "var(--bg-tertiary)",
            width: "100%",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: "var(--accent-green)",
              transition: "width 0.3s",
            }}
          />
        </div>

        <div style={cardContainerStyle}>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              perspective: "1000px",
            }}
          >
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                width: "400px",
                height: "300px",
                position: "relative",
                transition: "transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)",
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                cursor: "pointer",
              }}
            >
              {/* Front Side */}
              <div
                style={{
                  ...cardFaceStyle,
                  borderColor: isKnown
                    ? "var(--accent-green)"
                    : "var(--border-color)",
                  borderStyle: "solid",
                  borderWidth: isKnown ? "2px" : "1px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    color: "var(--text-secondary)",
                  }}
                >
                  <RefreshCcw size={18} />
                </div>
                {isKnown && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      color: "var(--accent-green)",
                    }}
                  >
                    <CheckCircle size={18} />
                  </div>
                )}
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: "bold",
                    color: "var(--text-primary)",
                    marginBottom: 16,
                  }}
                >
                  {currentItem.word}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    opacity: 0.8,
                  }}
                >
                  SpaceToFlip
                </div>
              </div>

              {/* Back Side */}
              <div
                style={{
                  ...cardFaceStyle,
                  transform: "rotateY(180deg)",
                  borderColor: isKnown
                    ? "var(--accent-green)"
                    : "var(--accent-blue)",
                  borderStyle: "solid",
                  borderWidth: isKnown ? "2px" : "1px",
                  backgroundColor: "rgba(47, 129, 247, 0.05)",
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: "600",
                    color: "var(--accent-blue)",
                    marginBottom: 12,
                  }}
                >
                  {currentItem.def_ko}
                </div>
                {showEnglish && (primaryTranslation?.word || currentItem.def_en) && (
                  <div
                    style={{
                      fontSize: 16,
                      color: "white",
                      marginBottom: 24,
                      paddingBottom: 16,
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {primaryTranslation?.language ? `${primaryTranslation.language} · ` : ""}
                    "{primaryTranslation?.word || currentItem.def_en}"
                  </div>
                )}

                <div
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    fontStyle: "italic",
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  {exampleText}
                </div>
              </div>
            </div>
          </div>

          <div style={controlsStyle}>
            <button onClick={handlePrev} style={navBtnStyle}>
              <ChevronLeft size={24} /> 이전
            </button>
            <button
              onClick={markKnown}
              style={{
                ...navBtnStyle,
                backgroundColor: "var(--accent-green-dim)",
                color: "var(--accent-green)",
                borderColor: "var(--accent-green)",
              }}
            >
              알아요
            </button>
            <button onClick={handleNext} style={navBtnStyle}>
              다음 <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(1, 4, 9, 0.85)",
  backdropFilter: "blur(6px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  width: "800px",
  maxWidth: "95vw",
  height: "600px",
  maxHeight: "90vh",
  backgroundColor: "var(--bg-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 16,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
};

const headerStyle = {
  padding: "16px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "var(--bg-secondary)",
};

const closeBtnStyle = {
  all: "unset",
  cursor: "pointer",
  color: "var(--text-secondary)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px",
  borderRadius: "50%",
  transition: "all 0.2s",
};

const cardContainerStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: "40px 24px",
  backgroundColor: "var(--bg-primary)",
};

const cardFaceStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "var(--bg-secondary)",
  borderRadius: 20,
  padding: "32px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
};

const controlsStyle = {
  display: "flex",
  justifyContent: "center",
  gap: 20,
  marginTop: "40px",
};

const navBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "12px 24px",
  borderRadius: 12,
  border: "1px solid var(--border-color)",
  backgroundColor: "var(--bg-secondary)",
  color: "var(--text-primary)",
  fontSize: 16,
  fontWeight: "600",
  cursor: "pointer",
  transition: "background-color 0.2s",
};
