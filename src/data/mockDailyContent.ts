import type { DailyContentPack } from "@/types/domain";

export const mockDailyContentPacks: Record<string, DailyContentPack> = {
  "en-beginner": {
    language: "en",
    level: "beginner",
    title: "Small English Win: Morning Routines",
    body:
      "Today’s micro-reading: I usually wake up at 7 a.m., make coffee, and check my messages before work. After that, I commute by bus. Try reading it twice and replacing one detail with your own morning habit.",
    glossary: [
      {
        term: "usually",
        definition: "most of the time",
        example: "I usually study after dinner.",
      },
      {
        term: "commute",
        definition: "to travel regularly to work or school",
        example: "She commutes by subway.",
      },
    ],
    quiz: [
      {
        prompt: "What does commute mean?",
        options: ["To rest", "To travel to work", "To cook", "To exercise"],
        answer: "To travel to work",
        explanation: "Commute is regular travel between home and work or school.",
      },
    ],
  },
  "en-intermediate": {
    language: "en",
    level: "intermediate",
    title: "Daily English Brief: Polite Disagreement",
    body:
      "In collaborative English, disagreement often sounds softer than a direct ‘no.’ Phrases like ‘I see your point, but...’ or ‘From my perspective...’ keep the conversation constructive while still making your position clear.",
    glossary: [
      {
        term: "constructive",
        definition: "helpful and intended to improve a situation",
        example: "She gave constructive feedback on the presentation.",
      },
      {
        term: "perspective",
        definition: "a particular way of thinking about something",
        example: "From my perspective, the simpler version is better.",
      },
    ],
    quiz: [
      {
        prompt: "Which phrase sounds like polite disagreement?",
        options: [
          "You're wrong.",
          "I see your point, but...",
          "No chance.",
          "That makes no sense.",
        ],
        answer: "I see your point, but...",
        explanation: "It recognizes the other idea before sharing a different view.",
      },
    ],
  },
  "ko-beginner": {
    language: "ko",
    level: "beginner",
    title: "오늘의 한국어: 카페에서 주문하기",
    body:
      "오늘의 짧은 읽기: 아메리카노 한 잔 주세요. 따뜻한 걸로 주세요. 포장해 주세요. 이 세 문장만 익혀도 카페에서 훨씬 자연스럽게 주문할 수 있어요.",
    glossary: [
      {
        term: "한 잔",
        definition: "one cup",
        example: "라테 한 잔 주세요.",
      },
      {
        term: "포장",
        definition: "takeout",
        example: "포장해 주세요.",
      },
    ],
    quiz: [
      {
        prompt: "‘포장해 주세요’ means...",
        options: ["Make it spicy", "For here, please", "Takeout, please", "No ice, please"],
        answer: "Takeout, please",
        explanation: "포장 refers to takeaway packaging.",
      },
    ],
  },
  "ko-intermediate": {
    language: "ko",
    level: "intermediate",
    title: "오늘의 한국어: 의견을 부드럽게 말하기",
    body:
      "회의나 토론에서는 직접적인 표현보다 완곡한 표현이 더 자연스럽게 들릴 때가 많아요. ‘제 생각에는...’, ‘말씀하신 부분은 이해하지만...’ 같은 표현은 의견을 말하면서도 관계의 톤을 부드럽게 유지해 줍니다.",
    glossary: [
      {
        term: "완곡한",
        definition: "indirect, softened",
        example: "완곡한 표현을 쓰면 분위기가 부드러워져요.",
      },
      {
        term: "부드럽게",
        definition: "softly, smoothly",
        example: "의견을 부드럽게 전달해 보세요.",
      },
    ],
    quiz: [
      {
        prompt: "Which phrase sounds softer in Korean discussion?",
        options: [
          "그건 틀렸어요.",
          "제 생각에는 조금 다를 수 있어요.",
          "말이 안 돼요.",
          "절대 안 됩니다.",
        ],
        answer: "제 생각에는 조금 다를 수 있어요.",
        explanation: "It softens the opinion and keeps the discussion collaborative.",
      },
    ],
  },
};

