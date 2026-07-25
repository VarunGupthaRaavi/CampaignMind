import { useState } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface PromptEditorProps {
  initialText: string
  onRefine: (instructions: string) => void
  isRefining?: boolean
}

export function PromptEditor({ initialText, onRefine, isRefining }: PromptEditorProps) {
  const [instructions, setInstructions] = useState('')

  return (
    <div className="space-y-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-purple-300">
        <Sparkles className="h-4 w-4" /> Gemini Copy Refiner
      </div>

      <div className="rounded-lg bg-background/60 p-3 text-sm text-muted-foreground border border-white/5">
        {initialText}
      </div>

      <div className="space-y-2">
        <label className="text-xs text-white">Refinement Instructions</label>
        <Textarea
          placeholder="e.g. Make it more persuasive, add bullet points, shorten for Twitter..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={2}
        />
      </div>

      <Button
        onClick={() => onRefine(instructions)}
        disabled={isRefining || !instructions.trim()}
        size="sm"
        className="gap-2"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isRefining ? 'animate-spin' : ''}`} />
        Refine with Gemini
      </Button>
    </div>
  )
}
