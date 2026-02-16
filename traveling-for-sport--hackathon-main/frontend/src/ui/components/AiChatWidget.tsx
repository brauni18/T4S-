import { useState, useRef, useEffect } from 'react';
import { Star, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

// ── Types ───────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ── Smart local responder (no API key needed for demo) ──────

const KNOWLEDGE: { patterns: RegExp; reply: string }[] = [
  {
    patterns: /world\s*cup.*(venue|stadium|where|cities|host)/i,
    reply:
      '🏟️ The FIFA World Cup 2026 will be hosted across **16 venues** in 3 countries:\n\n**USA** — AT&T Stadium (Dallas), MetLife Stadium (NYC), SoFi Stadium (LA), Hard Rock Stadium (Miami), Lincoln Financial Field (Philadelphia), Lumen Field (Seattle), Levi\'s Stadium (San Francisco), NRG Stadium (Houston), Mercedes-Benz Stadium (Atlanta), Arrowhead Stadium (Kansas City), Gillette Stadium (Boston)\n**Mexico** — Estadio Azteca (Mexico City), Estadio BBVA (Monterrey), Estadio Akron (Guadalajara)\n**Canada** — BMO Field (Toronto), BC Place (Vancouver)',
  },
  {
    patterns: /world\s*cup.*(date|when|schedule|start)/i,
    reply:
      '📅 The **FIFA World Cup 2026** runs from **June 11 to July 19, 2026**. The opening match is at Estadio Azteca in Mexico City. The final will be held at MetLife Stadium in New Jersey.',
  },
  {
    patterns: /world\s*cup.*(ticket|price|buy|cost)/i,
    reply:
      '🎟️ Tickets for the World Cup 2026 are available through FIFA\'s official ticketing portal. Prices range from **$35** (group stage, Category 3) to **$1,100+** (final, Category 1). A FIFA account is required. Resale is only allowed through the official FIFA resale platform.',
  },
  {
    patterns: /dallas|at&t\s*stadium|arlington/i,
    reply:
      '🤠 **Dallas / Arlington, TX** hosts Group A matches and a Semi-Final at AT&T Stadium (cap. 80,000).\n\n✈️ **Getting there:** Fly into DFW or DAL. The stadium is ~20 min from downtown.\n🍔 **Must-try:** Pecan Lodge BBQ, Terry Black\'s, Tex-Mex on McKinney Ave.\n🏨 **Stay:** Downtown Dallas or Arlington for walkability to the stadium.\n🌡️ **June weather:** Hot! ~95°F (35°C). Stay hydrated!',
  },
  {
    patterns: /new\s*york|nyc|metlife|new\s*jersey/i,
    reply:
      '🗽 **New York / New Jersey** hosts Group B matches and the **World Cup Final** at MetLife Stadium (cap. 82,500).\n\n✈️ **Getting there:** JFK, EWR, or LGA. NJ Transit gets you to the stadium.\n🍕 **Must-try:** Joe\'s Pizza, Katz\'s Deli, anything in Little Italy.\n🏨 **Stay:** Midtown Manhattan for transit access, or Hoboken for proximity.\n⚡ **Tip:** Get an unlimited MetroCard for the week!',
  },
  {
    patterns: /los\s*angeles|la|sofi/i,
    reply:
      '🌴 **Los Angeles, CA** hosts Group C matches at SoFi Stadium (cap. 70,000).\n\n✈️ **Getting there:** LAX is the main airport. Uber/Lyft to Inglewood.\n🌮 **Must-try:** Grand Central Market, Leo\'s Tacos, Porto\'s Bakery.\n🏨 **Stay:** Santa Monica for the beach vibes, DTLA for nightlife.\n☀️ **June weather:** Perfect ~80°F (27°C). Bring sunscreen!',
  },
  {
    patterns: /miami|hard\s*rock/i,
    reply:
      '🌊 **Miami, FL** hosts Group D matches at Hard Rock Stadium (cap. 65,000).\n\n✈️ **Getting there:** MIA airport, ~30 min to the stadium in Miami Gardens.\n🍽️ **Must-try:** Versailles Cuban food, Ceviche 105, Joe\'s Stone Crab.\n🏨 **Stay:** South Beach for the scene, Brickell for convenience.\n💃 **Nightlife:** Wynwood and South Beach are unmissable!',
  },
  {
    patterns: /mexico\s*city|azteca|cdmx/i,
    reply:
      '� **Mexico City** hosts the **Opening Match** at the legendary Estadio Azteca (cap. 87,000) — its 3rd World Cup!\n\n✈️ **Getting there:** MEX airport, take the Metro or Uber.\n🌮 **Must-try:** Street tacos in Coyoacán, Pujol (fine dining), churros at El Moro.\n🏨 **Stay:** Roma Norte or Condesa for walkability and atmosphere.\n🎭 **Don\'t miss:** Chapultepec Castle, Frida Kahlo Museum, Lucha Libre at Arena México!',
  },
  {
    patterns: /toronto|bmo\s*field/i,
    reply:
      '🍁 **Toronto, Canada** hosts Group E matches at BMO Field (cap. 30,000).\n\n✈️ **Getting there:** YYZ Pearson Airport, then UP Express to Union Station.\n🍟 **Must-try:** St. Lawrence Market, poutine at Smoke\'s, Kensington Market.\n🏨 **Stay:** Downtown near the CN Tower / Entertainment District.\n🌤️ **June weather:** Pleasant ~75°F (24°C). Perfect football weather!',
  },
  {
    patterns: /(usa|usmnt|us\s*team).*(chance|win|predict|group)/i,
    reply:
      'The **USMNT** is in Group B with Brazil, Serbia, and Morocco. It\'ll be tough — but home advantage is massive. Key players to watch: Christian Pulisic, Gio Reyna, and the young stars coming through MLS.\n\n**Prediction:** They should advance from the group but will need to be at their best against Brazil!',
  },
  {
    patterns: /travel\s*tip|packing|what\s*to\s*bring/i,
    reply:
      '✈️ **Top Travel Tips for World Cup 2026:**\n\n1. 📱 Get the FIFA app for e-tickets and schedules\n2. 💳 Contactless payments work everywhere in the US\n3. 🧴 Sunscreen & water bottle — June is HOT in most host cities\n4. 🚇 Use public transit where possible (NYC, Toronto, Mexico City)\n5. 🏥 Travel insurance is a must for international visitors\n6. 📶 Get a US eSIM for data — T-Mobile/AT&T have good coverage\n7. 🍺 Fan zones will have big screens — great backup if you don\'t have tickets!',
  },
  {
    patterns: /nba|basketball/i,
    reply:
      '🏀 **NBA 2025-26 Season** is heating up! The Celtics are defending champions, but the Thunder, Nuggets, and Knicks are all serious contenders. Playoffs begin in April. Check the Competitions tab for match schedules!',
  },
  {
    patterns: /nfl|super\s*bowl|football.*american/i,
    reply:
      '🏈 **NFL** — Super Bowl LX is the big event. The Chiefs are chasing a three-peat! Check the NFL competition page for schedules, city guides, and travel tips to host cities.',
  },
  {
    patterns: /premier\s*league|epl/i,
    reply:
      '⚽ **Premier League 2025-26** — Man City, Arsenal, and Liverpool are in a three-way title race. Check the Premier League competition page for match schedules, London derby guides, and blog articles!',
  },
  {
    patterns: /hi|hello|hey|what can you|help/i,
    reply:
      'Hey there! 👋 I\'m your **Sports Travel AI assistant**. I can help with:\n\n⚽ **Match info** — schedules, groups, predictions\n🏙️ **City guides** — food, transport, accommodation\n✈️ **Travel tips** — flights, packing, fan zones\n🏟️ **Venues** — stadium info, getting there\n\nJust ask me anything about the World Cup 2026 or other competitions!',
  },
];

function getSmartReply(input: string): string {
  const lower = input.toLowerCase();
  for (const entry of KNOWLEDGE) {
    if (entry.patterns.test(lower)) {
      return entry.reply;
    }
  }
  return `Great question! While I'm a demo assistant for the hackathon, here's what I can help with:\n\n• World Cup 2026 venues, dates, tickets\n• City guides (Dallas, NYC, LA, Miami, Toronto, Mexico City)\n• Travel tips and predictions\n• NBA, NFL, Premier League info\n\nTry asking something like **"Tell me about Dallas"** or **"When does the World Cup start?"** 😊`;
}

// ── Quick suggestion chips ──────────────────────────────────

const SUGGESTIONS = [
  '🏟️ World Cup venues',
  '📅 When does it start?',
  '🗽 NYC guide',
  '✈️ Travel tips',
];

// ── Component ───────────────────────────────────────────────

interface AiChatWidgetProps {
  isDark?: boolean;
}

export function AiChatWidget({ isDark = true }: AiChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hey! 👋 I'm your **Sports Travel AI** assistant. Ask me about World Cup 2026 matches, host cities, travel tips, or any competition!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    // Simulate a brief "thinking" delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

    const reply = getSmartReply(msg);
    setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  // Simple markdown-lite renderer (bold only)
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      {/* ── Floating toggle button ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 ${
          open
            ? isDark
              ? 'bg-white/10 text-white hover:bg-white/20'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-[#22c55e] text-black hover:bg-[#22c55e]/90 shadow-[#22c55e]/30'
        }`}
      >
        {open ? <X size={22} /> : <Star size={22} />}
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-[380px] max-h-[560px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border ${
            isDark
              ? 'bg-[#141414] border-white/10'
              : 'bg-white border-gray-200 shadow-xl'
          }`}
        >
          {/* Header */}
          <div
            className={`px-4 py-3 flex items-center gap-3 border-b ${
              isDark
                ? 'bg-gradient-to-r from-[#22c55e]/10 to-blue-500/10 border-white/10'
                : 'bg-gradient-to-r from-green-50 to-blue-50 border-gray-200'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                isDark ? 'bg-[#22c55e]/20' : 'bg-green-100'
              }`}
            >
              <Sparkles size={18} className={isDark ? 'text-[#22c55e]' : 'text-green-600'} />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Sports Travel AI
              </p>
              <p className={`text-[11px] ${isDark ? 'text-[#22c55e]' : 'text-green-600'}`}>
                Online · Ask me anything
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: 360 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                      isDark ? 'bg-[#22c55e]/20' : 'bg-green-100'
                    }`}
                  >
                    <Bot size={14} className={isDark ? 'text-[#22c55e]' : 'text-green-600'} />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-[#22c55e] text-black rounded-br-sm'
                      : isDark
                        ? 'bg-white/8 text-gray-200 rounded-bl-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {m.role === 'assistant' ? renderContent(m.content) : m.content}
                </div>
                {m.role === 'user' && (
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                      isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                    }`}
                  >
                    <User size={14} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-[#22c55e]/20' : 'bg-green-100'
                  }`}
                >
                  <Bot size={14} className={isDark ? 'text-[#22c55e]' : 'text-green-600'} />
                </div>
                <div
                  className={`px-3 py-2.5 rounded-xl rounded-bl-sm ${
                    isDark ? 'bg-white/8' : 'bg-gray-100'
                  }`}
                >
                  <Loader2
                    size={16}
                    className={`animate-spin ${isDark ? 'text-[#22c55e]' : 'text-green-600'}`}
                  />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions (shown when few messages) */}
          {messages.length <= 2 && !loading && (
            <div className={`px-4 pb-2 flex flex-wrap gap-1.5`}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    isDark
                      ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className={`p-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about matches, cities, travel..."
                className={`flex-1 rounded-xl px-3 py-2 text-sm outline-none border transition-colors ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#22c55e]/50'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-green-400'
                }`}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-[#22c55e] hover:bg-[#22c55e]/80 disabled:opacity-30 text-black flex items-center justify-center transition-colors shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
