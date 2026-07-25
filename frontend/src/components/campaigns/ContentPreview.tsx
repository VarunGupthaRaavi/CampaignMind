import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface ContentPiece {
  channel: string
  title: string
  body?: string
  primary_text?: string
  caption?: string
  call_to_action?: string
}

interface ContentPreviewProps {
  content: ContentPiece
}

export function ContentPreview({ content }: ContentPreviewProps) {
  const displayText = content.body || content.primary_text || content.caption || ''
  return (
    <Card className="glass-panel rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Badge variant="default">{content.channel}</Badge>
          <CardTitle className="text-base font-bold text-white">{content.title}</CardTitle>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{displayText}</p>
        {content.call_to_action && (
          <div className="pt-2">
            <span className="text-xs font-semibold text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 inline-block">
              CTA: {content.call_to_action}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
