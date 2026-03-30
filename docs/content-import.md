# Curriculum Import

`supabase/functions/import-curriculum` expects a JSON payload shaped like:

```json
{
  "track": {
    "id": "track-id",
    "nativeLanguage": "ko",
    "targetLanguage": "en",
    "level": "beginner",
    "title": "Track title",
    "subtitle": "Track subtitle",
    "description": "Track description",
    "modules": [
      {
        "id": "module-id",
        "title": "Module title",
        "description": "Module description",
        "orderIndex": 1,
        "lessons": [
          {
            "id": "lesson-id",
            "title": "Lesson title",
            "summary": "Lesson summary",
            "estimatedMinutes": 12,
            "difficulty": "beginner",
            "practicePrompt": "Short practice prompt",
            "objectives": [{ "id": "obj-1", "text": "..." }],
            "cards": []
          }
        ]
      }
    ]
  }
}
```

## Notes

- If `cards` is omitted or empty, the function asks OpenAI for a structured `LessonCardSet`.
- Track/module/lesson IDs should stay stable so imports remain idempotent.
- The included sample file lives at `supabase/seed/sample-curriculum.json`.

