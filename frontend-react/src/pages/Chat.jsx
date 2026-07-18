import { useState, useRef, useEffect } from "react";
import { askQuestion } from "../services/api";
import { FiSend, FiCpu, FiUser, FiClock } from "react-icons/fi";

const SUGGESTIONS = [
  "Show me the total expenses for this month",
  "List all invoices from last quarter",
  "What's my biggest vendor by spend?",
  "Summarize recent GST data"
];

function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Welcome to **LedgerAI**. I can help you analyse your financial documents, track expenses, and extract invoice data across your organisation.\n\nTry asking me something like:\n- *\"Show my recent invoices\"*\n- *\"What did I spend last month?\"*\n- *\"Find vendor Amazon invoices\"*",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await askQuestion(input.trim());
      const botMessage = {
        role: "assistant",
        content: response.answer || response.response || "I couldn't find a relevant answer in your documents. Try rephrasing your question.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMsg = {
        role: "assistant",
        content: "I ran into an issue connecting to the knowledge base. Your documents are still indexed — please try again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderContent = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong style='color:#a78bfa'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em style='color:rgba(255,255,255,0.7)'>$1</em>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 180px)",
        maxWidth: "960px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: 700,
          }}
        >
          L
        </div>
        <div>
          <h2
            className="gradient-text"
            style={{
              fontSize: "18px",
              fontWeight: 700,
              margin: 0,
            }}
          >
            LedgerAI Assistant
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "12px",
              marginTop: "2px",
            }}
          >
            {loading ? "Thinking..." : "Connected to your documents"}
          </p>
        </div>
      </div>

      {/* Chat body */}
      <div
        className="glass-card"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Messages area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 20px 8px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: "10px",
                marginBottom: "12px",
                animation: "fadeSlideUp 0.25s ease-out",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  background:
                    msg.role === "user"
                      ? "rgba(99,102,241,0.2)"
                      : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff",
                }}
              >
                {msg.role === "user" ? <FiUser size={14} /> : <FiCpu size={14} />}
              </div>

              {/* Bubble */}
              <div style={{ maxWidth: "72%", minWidth: "80px" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius:
                      msg.role === "user"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                        : "rgba(255,255,255,0.06)",
                    border:
                      msg.role === "user"
                        ? "none"
                        : "1px solid rgba(255,255,255,0.06)",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: "#ffffff",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: msg.role === "assistant"
                      ? renderContent(msg.content)
                      : msg.content,
                  }}
                />

                {/* Timestamp */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    marginTop: "4px",
                    padding: "0 4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.25)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <FiClock size={10} />
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                <FiCpu size={14} />
              </div>
              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: "18px 18px 18px 4px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  gap: "5px",
                }}
              >
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && !loading && (
          <div
            style={{
              padding: "0 20px 12px",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "12px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(99,102,241,0.12)";
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
                  e.currentTarget.style.color = "#a78bfa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          style={{
            padding: "12px 20px 16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              className="input-field"
              type="text"
              placeholder="Ask LedgerAI about your documents..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{ flex: 1, padding: "13px 16px" }}
            />
            <button
              className="btn-primary"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                padding: "13px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: loading || !input.trim() ? 0.5 : 1,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                borderRadius: "14px",
              }}
            >
              <FiSend size={18} />
            </button>
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: "11px",
              color: "rgba(255,255,255,0.2)",
              marginTop: "8px",
            }}
          >
            Responses are generated based on your uploaded financial documents
          </p>
        </div>
      </div>
    </div>
  );
}

export default Chat;