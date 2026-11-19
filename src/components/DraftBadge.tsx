import { DRAFT_LABEL } from "@/data/config"

export function DraftBadge() {
  return (
    <div className="glass pointer-events-none fixed bottom-4 left-4 z-[60] rounded-full px-3 py-1 text-[11px] font-medium text-sage-800">
      {DRAFT_LABEL}
    </div>
  )
}
