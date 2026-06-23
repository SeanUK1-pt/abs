import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

interface Props {
  content: any
  className?: string
}

export function RichText({ content, className }: Props) {
  if (!content) return null
  return (
    <div className={className}>
      <LexicalRichText data={content} />
    </div>
  )
}
