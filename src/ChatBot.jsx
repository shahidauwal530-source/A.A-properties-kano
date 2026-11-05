import React, { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Sannu! 👋 Barka da zuwa A.A Properties Kano! 🏠\n\nKana neman Gida Haya? Fili? Ko Shago?\n\nDanna daya:\n🏠 Gida - Rubuta 1\n📍 Fili - Rubuta 2\n🏪 Shago - Rubuta 3",
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const getReply = (rawText) => {
    const text = rawText.toLowerCase().trim();
    const website = "https://a-a-properties-kano-1.onrender.com/";
    const whatsapp = "https://wa.me/2349042782681";

    // Greeting
    if (
      text.includes("sannu") ||
      text.includes("hello") ||
      text.includes("hi") ||
      text.includes("salama") ||
      text.includes("salam") ||
      text.includes("good")
    ) {
      return (
        "Sannu! Barka da zuwa A.A Properties Kano! Kana neman Gida? Rubuta 1, Fili? Rubuta 2, Shago? Rubuta 3. A wane yanki kake so?\n\n" +
        "🌐 Website: " +
        website +
        "\n📲 WhatsApp Adam: " +
        whatsapp
      );
    }

    // Gida / Houses
    if (
      text === "1" ||
      text.includes("gida") ||
      text.includes("haya") ||
      text.includes("house") ||
      text.includes("room") ||
      text.includes("flat") ||
      text.includes("bedroom") ||
      text.includes("nassarawa") ||
      text.includes("bompai") ||
      text.includes("sabon gari") ||
      text.includes("rijiyar") ||
      text.includes("tarauni")
    ) {
      return (
        "🏠 *GIDAN HAYA A KANO:*\n\n" +
        "1. Nassarawa GRA: 2 & 3 Bedrooms (₦500,000 - ₦1,200,000 / shekara)\n" +
        "2. Sabon Gari: 1 & 2 Bedrooms (₦300,000 - ₦600,000 / shekara)\n" +
        "3. Bompai: 3 Bedrooms Duplex (₦1,200,000 - ₦1,800,000 / shekara)\n" +
        "4. Rijiyar Zaki: Self-Contain & Flat (₦250,000 - ₦450,000 / shekara)\n" +
        "5. Tarauni: 2 & 4 Bedrooms Duplex (₦400,000 - ₦1,800,000 / shekara)\n\n" +
        "✓ Zaka iya zuwa duba gidan kyauta (FREE Viewing) kafin ka biya!\n" +
        "✓ Hanyar biya: Bank Transfer ko Cash ga Adam.\n\n" +
        "🌐 Duba hotunan gidaje: " +
        website +
        "\n📲 Yi magana da Adam a WhatsApp: " +
        whatsapp
      );
    }

    // Fili / Plots / Land
    if (
      text === "2" ||
      text.includes("fili") ||
      text.includes("plot") ||
      text.includes("land") ||
      text.includes("saya") ||
      text.includes("buy") ||
      text.includes("janguza") ||
      text.includes("zawaciki") ||
      text.includes("hotoro")
    ) {
      return (
        "📍 *FILI NA SAYARWA A KANO:*\n\n" +
        "1. Janguza: 50x100ft mai ingantaccen C of O (₦4,500,000)\n" +
        "2. Rijiyar Zaki: 50x50ft kusa da BUK mai R of O (₦2,800,000)\n" +
        "3. Zawaciki & Hotoro GRA: Full plot 100x100ft daga ₦2,000,000 zuwa ₦7,000,000\n\n" +
        "✓ Dukkan takardu halal ne (C of O / R of O) an tantance su a kotu.\n\n" +
        "🌐 Duba dukkan filaye: " +
        website +
        "\n📲 Tuntubi Adam a WhatsApp: " +
        whatsapp
      );
    }

    // Shago / Commercial Shops
    if (
      text === "3" ||
      text.includes("shago") ||
      text.includes("shop") ||
      text.includes("store") ||
      text.includes("kantin") ||
      text.includes("kwari") ||
      text.includes("plaza")
    ) {
      return (
        "🏪 *SHAGUNA NA HAYA A KANO:*\n\n" +
        "1. Kasuwar Kantin Kwari: Modern plaza shops (daga ₦800,000 zuwa ₦1,500,000 / shekara)\n" +
        "2. Sabon Gari Market: Shaguna daga ₦200,000 zuwa ₦800,000 / shekara\n" +
        "3. Murtala Mohammed Way: Ofisoshin kamfani daga ₦1,200,000 / shekara\n\n" +
        "🌐 Duba shaguna a website: " +
        website +
        "\n📲 Yi magana da Adam kai tsaye: " +
        whatsapp
      );
    }

    // Farashi / Price
    if (
      text.includes("nawa") ||
      text.includes("price") ||
      text.includes("farashi") ||
      text.includes("kudi") ||
      text.includes("cost") ||
      text.includes("budget") ||
      text.includes("500") ||
      text.includes("300") ||
      text.includes("miliyan") ||
      text.includes("million")
    ) {
      return (
        "💰 *TAKAITACCEN FARASHIN KAYANMU:*\n\n" +
        "🏠 Gida Haya: ₦300,000 zuwa ₦1,500,000 / shekara\n" +
        "📍 Fili Saya: Daga ₦2,000,000 zuwa ₦10,000,000+\n" +
        "🏪 Shago Haya: Daga ₦200,000 zuwa ₦1,500,000 / shekara\n\n" +
        "Nawa ne kasafin kudin ka (budget)? Kuma a wace unguwa kake son zama a Kano?\n\n" +
        "🌐 Shiga shafinmu: " +
        website +
        "\n📲 WhatsApp Adam: " +
        whatsapp
      );
    }

    // Contact / WhatsApp
    if (
      text.includes("whatsapp") ||
      text.includes("lamba") ||
      text.includes("waya") ||
      text.includes("phone") ||
      text.includes("call") ||
      text.includes("adam") ||
      text.includes("contact")
    ) {
      return (
        "📲 *TUNTUBI ADAM AUWAL ADAM (CEO):*\n\n" +
        "👤 Sunan Mai Kamfani: Adam Auwal Adam\n" +
        "📞 Lambar Waya: 09042782681\n" +
        "💬 WhatsApp: " +
        whatsapp +
        "\n" +
        "📍 Ofis: Murtala Mohammed Way, Kano, Kano State\n" +
        "🌐 Website: " +
        website
      );
    }

    // Thank you
    if (
      text.includes("na gode") ||
      text.includes("nagode") ||
      text.includes("thank") ||
      text.includes("shukran")
    ) {
      return (
        "Babu matsala! Mun gode da ka ziyarci A.A Properties Kano! 🤝\n\n" +
        "Kullum a shirye muke mu taimaka maka samun gida ko fili na gaskiya a Kano.\n\n" +
        "🌐 Website: " +
        website +
        "\n📲 WhatsApp: " +
        whatsapp
      );
    }

    // Default Fallback
    return (
      "Kana son Gida a ina? Nassarawa? Sabon Gari? Bompai? Ko ka danna daya daga cikin wadannan:\n\n" +
      "🏠 1 - Gida Haya\n" +
      "📍 2 - Fili Saya\n" +
      "🏪 3 - Shago Haya\n" +
      "💰 Farashi - Duba kudin komai\n\n" +
      "🌐 Website: " +
      website +
      "\n📲 WhatsApp Adam: " +
      whatsapp
    );
  };

  const send = (messageText) => {
    const userText = (messageText || input).trim();
    if (!userText) return;

    // Append user message
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setIsTyping(true);

    // 600ms realistic delay
    setTimeout(() => {
      const reply = getReply(userText);
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setIsTyping(false);
    }, 600);
  };

  const quick = (text) => {
    send(text);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: "#16a34a",
            color: "#ffffff",
            border: "none",
            borderRadius: "9999px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 10px 25px -5px rgba(22, 163, 74, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <span>💬 Tambaya? Chat da A.A Bot</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            width: "330px",
            maxWidth: "90vw",
            height: "480px",
            maxHeight: "85vh",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#16a34a",
              color: "#ffffff",
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px" }}>🤖</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", lineHeight: "1.2" }}>
                  A.A Bot - Online
                </div>
                <div style={{ fontSize: "10px", color: "#dcfce7" }}>
                  A.A Properties Kano
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                fontSize: "18px",
                cursor: "pointer",
                padding: "2px 6px",
                lineHeight: "1",
              }}
              title="Rufe"
            >
              ✕
            </button>
          </div>

          {/* Quick Buttons Row */}
          <div
            style={{
              backgroundColor: "#f9fafb",
              borderBottom: "1px solid #e5e7eb",
              padding: "6px 8px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {[
              { label: "🏠 Gida", val: "1" },
              { label: "📍 Fili", val: "2" },
              { label: "🏪 Shago", val: "3" },
              { label: "💰 Farashi", val: "Farashi" },
              { label: "📲 WhatsApp", val: "WhatsApp" },
            ].map((btn, idx) => (
              <button
                key={idx}
                onClick={() => quick(btn.val)}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #d1d5db",
                  borderRadius: "12px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#374151",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#f3f4f6",
              padding: "12px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "9px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    lineHeight: "1.45",
                    whiteSpace: "pre-line",
                    backgroundColor: m.sender === "user" ? "#dcf8c6" : "#ffffff",
                    color: "#1f2937",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                    border: m.sender === "user" ? "1px solid #bbf7d0" : "1px solid #e5e7eb",
                    wordBreak: "break-word",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "6px 12px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    color: "#6b7280",
                    fontStyle: "italic",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  A.A Bot yana rubutawa...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Send Row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 10px",
              backgroundColor: "#ffffff",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Rubuta sakonka anan..."
              style={{
                flex: 1,
                border: "1px solid #d1d5db",
                borderRadius: "20px",
                padding: "8px 14px",
                fontSize: "12px",
                outline: "none",
                color: "#1f2937",
              }}
            />
            <button
              type="submit"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                backgroundColor: "#16a34a",
                color: "#ffffff",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "13px",
                flexShrink: 0,
                boxShadow: "0 2px 4px rgba(22, 163, 74, 0.3)",
              }}
              title="Aika"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
