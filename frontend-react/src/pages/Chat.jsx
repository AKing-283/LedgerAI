import {
  useState
} from "react";

import Navbar from "../components/Navbar";

import {
  askQuestion
} from "../services/api";

function Chat() {

  const [question,
    setQuestion] =
    useState("");

  const [answer,
    setAnswer] =
    useState("");

  const ask = async () => {

    const token =
      localStorage.getItem(
        "token"
      );

    const result =
      await askQuestion(
        question,
        token
      );

    setAnswer(
      result.answer
    );
  };

  return (
    <div className="page-container">
      <div
        className="glass"
        style={{
          padding: "30px",
          borderRadius: "20px"
        }}
      >
        <h2>
          Chat with Documents
        </h2>

        <textarea
          value={question}
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
          placeholder="Ask about invoices..."
          rows={5}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "15px",
            borderRadius: "12px"
          }}
        />

        <button
          onClick={ask}
          style={{
            marginTop: "15px",
            background:
              "#6366f1",
            color: "white",
            border: "none",
            padding:
              "12px 25px",
            borderRadius:
              "12px"
          }}
        >
          Ask AI
        </button>

        {answer && (
          <div
            className="glass"
            style={{
              marginTop: "25px",
              padding: "20px",
              borderRadius:
                "12px"
            }}
          >
            <h3>Answer</h3>
            <p>{answer}</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default Chat;