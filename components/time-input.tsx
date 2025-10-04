"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  id?: string
}

export function TimeInput({ value, onChange, label, id }: TimeInputProps) {
  const [hour, minute] = value.split(":").map((v) => v || "")

  const handleHourChange = (newHour: string) => {
    const hourNum = Number.parseInt(newHour) || 0
    const clampedHour = Math.max(0, Math.min(23, hourNum))
    const formattedHour = String(clampedHour).padStart(2, "0")
    onChange(`${formattedHour}:${minute || "00"}`)
  }

  const handleMinuteChange = (newMinute: string) => {
    const minuteNum = Number.parseInt(newMinute) || 0
    const clampedMinute = Math.max(0, Math.min(59, minuteNum))
    const formattedMinute = String(clampedMinute).padStart(2, "0")
    onChange(`${hour || "00"}:${formattedMinute}`)
  }

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="flex items-center gap-2">
        <Input
          id={id}
          type="number"
          min="0"
          max="23"
          value={hour}
          onChange={(e) => handleHourChange(e.target.value)}
          className="w-20 text-center"
          placeholder="00"
        />
        <span className="text-muted-foreground">:</span>
        <Input
          type="number"
          min="0"
          max="59"
          value={minute}
          onChange={(e) => handleMinuteChange(e.target.value)}
          className="w-20 text-center"
          placeholder="00"
        />
      </div>
    </div>
  )
}
