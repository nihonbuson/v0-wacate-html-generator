"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Plus, Trash2, Upload, FileJson } from "lucide-react"
import { TimeInput } from "@/components/time-input"

interface Session {
  id: string
  startTime: string
  endTime: string
  duration: string
  title: string
  titleLink: string
  speaker: string
  speakerAffiliation: string
  description: string
  references: string[]
  type: "session" | "break" | "meal"
}

interface EventData {
  eventName: string
  organizer: string
  asterSponsorship: "あり" | "なし"
  startDate: string
  startTime: string
  receptionStartTime: string
  endDate: string
  endTime: string
  capacity: string
  minCapacity: string
  feeUnder35: string
  feeOver35: string
  venue: string
  venueAccess: string
  venueUrl: string
  description: string
  registrationStatus: "open" | "closed" | "coming-soon"
  registrationDeadline: string
  registrationUrl: string
  programDetailUrl: string
  day1Sessions: Session[]
  day2Sessions: Session[]
  committeeChair: string
  committeeMembers: string[]
}

export default function EventGenerator() {
  const [eventData, setEventData] = useState<EventData>({
    eventName: "WACATE 2025 夏",
    organizer: "WACATE実行委員会",
    asterSponsorship: "なし",
    startDate: "2025年6月28日（土）",
    startTime: "10:00",
    receptionStartTime: "09:30",
    endDate: "2025年6月29日（日）",
    endTime: "17:30",
    capacity: "48名",
    minCapacity: "24名",
    feeUnder35: "￥27,000",
    feeOver35: "￥30,000",
    venue: "トーセイホテル＆セミナー幕張",
    venueAccess: "JR京葉線 「新習志野駅」より徒歩2分",
    venueUrl: "https://tosei-hotelseminar.co.jp/makuhari/",
    description: "この度「WACATE 2025 夏」の開催が決定いたしました！",
    registrationStatus: "closed",
    registrationDeadline: "6/8まで",
    registrationUrl: "https://wacate.jp/pre-entry/",
    programDetailUrl: "https://wacate.jp/workshops/2025summer/program/",
    day1Sessions: [
      {
        id: "open_ses",
        startTime: "10:00",
        endTime: "10:20",
        duration: "＜20分＞",
        title: "オープニングセッション",
        titleLink: "#open_ses",
        speaker: "山田　太郎",
        speakerAffiliation: "WACATE実行委員会",
        description:
          "WACATE、そして、これから始まる2日間のソフトウェアテストワークショップイベントの全体像についてご紹介させていただきます。",
        references: [],
        type: "session",
      },
    ],
    day2Sessions: [
      {
        id: "morning_ses",
        startTime: "9:00",
        endTime: "9:30",
        duration: "＜30分＞",
        title: "モーニングセッション",
        titleLink: "#morning_ses",
        speaker: "佐藤　花子",
        speakerAffiliation: "WACATE実行委員会",
        description: "（調整中）",
        references: ["（調整中）"],
        type: "session",
      },
    ],
    committeeChair: "田中　一郎",
    committeeMembers: ["鈴木　美咲", "高橋　健太"],
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [customSpeakers, setCustomSpeakers] = useState<{
    day1: { [key: number]: boolean }
    day2: { [key: number]: boolean }
  }>({
    day1: {},
    day2: {},
  })

  const calculateDuration = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) return ""

    const [startHour, startMin] = startTime.split(":").map(Number)
    const [endHour, endMin] = endTime.split(":").map(Number)

    if (isNaN(startHour) || isNaN(startMin) || isNaN(endHour) || isNaN(endMin)) return ""

    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    const durationMinutes = endMinutes - startMinutes

    if (durationMinutes <= 0) return ""

    return `＜${durationMinutes}分＞`
  }

  const updateField = (field: keyof EventData, value: any) => {
    setEventData((prev) => ({ ...prev, [field]: value }))
  }

  const addSession = (day: "day1Sessions" | "day2Sessions") => {
    const newSession: Session = {
      id: "session",
      startTime: "",
      endTime: "",
      duration: "",
      title: "",
      titleLink: "#session",
      speaker: eventData.committeeChair,
      speakerAffiliation: "WACATE実行委員会",
      description: "",
      references: [],
      type: "session",
    }
    setEventData((prev) => ({
      ...prev,
      [day]: [...prev[day], newSession],
    }))
  }

  const updateSession = (day: "day1Sessions" | "day2Sessions", index: number, field: keyof Session, value: any) => {
    setEventData((prev) => {
      const updatedSessions = prev[day].map((session, i) => {
        if (i !== index) return session

        const updatedSession = { ...session, [field]: value }

        if (field === "type" && (value === "break" || value === "meal")) {
          updatedSession.id = ""
          updatedSession.titleLink = ""
        }

        if (field === "startTime" || field === "endTime") {
          updatedSession.duration = calculateDuration(updatedSession.startTime, updatedSession.endTime)
        }

        return updatedSession
      })

      return { ...prev, [day]: updatedSessions }
    })
  }

  const addReference = (day: "day1Sessions" | "day2Sessions", sessionIndex: number) => {
    setEventData((prev) => ({
      ...prev,
      [day]: prev[day].map((session, i) =>
        i === sessionIndex ? { ...session, references: [...session.references, ""] } : session,
      ),
    }))
  }

  const updateReference = (
    day: "day1Sessions" | "day2Sessions",
    sessionIndex: number,
    refIndex: number,
    value: string,
  ) => {
    setEventData((prev) => ({
      ...prev,
      [day]: prev[day].map((session, i) =>
        i === sessionIndex
          ? { ...session, references: session.references.map((ref, j) => (j === refIndex ? value : ref)) }
          : session,
      ),
    }))
  }

  const removeReference = (day: "day1Sessions" | "day2Sessions", sessionIndex: number, refIndex: number) => {
    setEventData((prev) => ({
      ...prev,
      [day]: prev[day].map((session, i) =>
        i === sessionIndex ? { ...session, references: session.references.filter((_, j) => j !== refIndex) } : session,
      ),
    }))
  }

  const removeSession = (day: "day1Sessions" | "day2Sessions", index: number) => {
    setEventData((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }))
  }

  const addCommitteeMember = () => {
    setEventData((prev) => ({
      ...prev,
      committeeMembers: [...prev.committeeMembers, ""],
    }))
  }

  const updateCommitteeMember = (index: number, value: string) => {
    setEventData((prev) => ({
      ...prev,
      committeeMembers: prev.committeeMembers.map((member, i) => (i === index ? value : member)),
    }))
  }

  const removeCommitteeMember = (index: number) => {
    setEventData((prev) => ({
      ...prev,
      committeeMembers: prev.committeeMembers.filter((_, i) => i !== index),
    }))
  }

  const getCommitteeOptions = () => {
    const options = []
    if (eventData.committeeChair) {
      options.push(eventData.committeeChair)
    }
    options.push(...eventData.committeeMembers.filter((m) => m.trim() !== ""))
    return options
  }

  const handleSpeakerSelect = (day: "day1Sessions" | "day2Sessions", index: number, value: string) => {
    if (value === "その他") {
      setCustomSpeakers((prev) => ({
        ...prev,
        [day === "day1Sessions" ? "day1" : "day2"]: {
          ...prev[day === "day1Sessions" ? "day1" : "day2"],
          [index]: true,
        },
      }))
      updateSession(day, index, "speaker", "")
    } else {
      setCustomSpeakers((prev) => ({
        ...prev,
        [day === "day1Sessions" ? "day1" : "day2"]: {
          ...prev[day === "day1Sessions" ? "day1" : "day2"],
          [index]: false,
        },
      }))
      updateSession(day, index, "speaker", value)
    }
  }

  const generateSessionIds = () => {
    const idCounts: { [key: string]: number } = {}
    const allSessions = [...eventData.day1Sessions, ...eventData.day2Sessions]

    return allSessions.map((session) => {
      if (session.type !== "session" || !session.id) {
        return { originalId: session.id, generatedId: "" }
      }

      const baseId = session.id
      idCounts[baseId] = (idCounts[baseId] || 0) + 1
      const generatedId = `${baseId}${idCounts[baseId]}`

      return { originalId: baseId, generatedId }
    })
  }

  const generateHTML = () => {
    const dateTimeString = `${eventData.startDate}${eventData.startTime} （受付開始 ${eventData.receptionStartTime}） ～ ${eventData.endDate} ${eventData.endTime}`

    const registrationSection =
      eventData.registrationStatus === "closed"
        ? `<div align="center"><span style="font-size: 36pt;">参加申し込みを締め切りました。</span></div>`
        : eventData.registrationStatus === "open"
          ? `<div align="center"><a href="${eventData.registrationUrl}"><span style="font-size: 36pt;"><span style="text-decoration: underline;">参加申し込み(${eventData.registrationDeadline})</span></span></a></div>`
          : `<div align="center"><span style="font-size: 36pt;"><span style="text-decoration: underline;">近日参加申し込み開始予定!</span></span></div>`

    const asterSponsorshipHTML =
      eventData.asterSponsorship === "あり"
        ? `<div class="col-sm-2"> </div>
<div class="col-sm-2"><strong>協賛</strong></div>
<div class="col-sm-8"><a href="http://aster.or.jp/" target="_blank">ソフトウェアテスト技術振興協会（ASTER）</a></div>
<hr width="100%" />
`
        : ""

    const sessionIds = generateSessionIds()
    let allSessionIndex = 0

    const day1SessionsHTML = eventData.day1Sessions
      .map((session) => {
        const idInfo = sessionIds[allSessionIndex++]

        if (session.type !== "session") {
          return ""
        }

        const anchorLink = idInfo.generatedId ? `#${idInfo.generatedId}` : ""

        return `
            <tr>
                <td style="width: 20%;">${session.startTime} - ${session.endTime}</td>
                <td style="width: 55%;"><a href="${eventData.programDetailUrl}${anchorLink}">${session.title}</a></td>
                <td style="width: 25%;">${session.speaker}<br /><span style="font-size: small;">${session.speakerAffiliation}</span></td>
            </tr>`
      })
      .filter((html) => html !== "")
      .join("")

    const day2SessionsHTML = eventData.day2Sessions
      .map((session) => {
        const idInfo = sessionIds[allSessionIndex++]

        if (session.type !== "session") {
          return ""
        }

        const anchorLink = idInfo.generatedId ? `#${idInfo.generatedId}` : ""

        return `
            <tr>
                <td style="width: 20%;">${session.startTime} - ${session.endTime}</td>
                <td style="width: 55%;"><a href="${eventData.programDetailUrl}${anchorLink}">${session.title}</a></td>
                <td style="width: 25%;">${session.speaker}<br /><span style="font-size: small;">${session.speakerAffiliation}</span></td>
            </tr>`
      })
      .filter((html) => html !== "")
      .join("")

    const committeeMembersHTML = eventData.committeeMembers
      .map((member) => `${member}（WACATE実行委員会）<br />`)
      .join("")

    return `<div class="col-sm-2"> </div>
<div class="col-sm-2"><strong>主催</strong></div>
<div class="col-sm-8">${eventData.organizer}</div>
<hr width="100%" />
<div class="col-sm-2"> </div>
<div class="col-sm-2"><strong>日時</strong></div>
<div class="col-sm-8">${dateTimeString}</div>
<hr width="100%" />
${asterSponsorshipHTML}<div class="col-sm-2"> </div>
<div class="col-sm-2"><strong>定員</strong></div>
<div class="col-sm-8">${eventData.capacity}（定員となり次第、受付終了となります）<br />※最小催行人数：${eventData.minCapacity}</div>
<hr width="100%" />
<div class="col-sm-2"> </div>
<div class="col-sm-2"><strong>参加費</strong></div>
<div class="col-sm-8">35歳以下　:${eventData.feeUnder35}<br />36歳以上　:${eventData.feeOver35}<br />※会場費、印刷費、宿泊費、食費、その他運営にかかる事務費含む（キャンセル不可）<br />※参加費は当日受付時に会場でお支払いいただきます。（現金のみ）</div>
<hr width="100%" />
<div class="col-sm-2"> </div>
<div class="col-sm-2"><strong>会場</strong></div>
<div class="col-sm-8">${eventData.venue}<br />${eventData.venueAccess}<br /><a href="${eventData.venueUrl}" target="_blank" rel="noopener">${eventData.venueUrl}</a></div>
<hr width="100%" />
<div class="col-sm-2"> </div>
<div class="col-sm-8">${eventData.description}</div>
<hr width="100%" />
<div class="col-sm-2"> </div>
<div class="col-sm-8">
    <hr width="100%" />
    ${registrationSection}
</div>
<hr width="100%" />
<div class="col-sm-2"> </div>
<div class="col-sm-8">
    <p><strong>プログラム</strong>　　※ <a href="${eventData.programDetailUrl}">セッション詳細・全スケジュールはこちらからご確認ください</a></p>
    <p>1日目</p>
    <table style="border-collapse: collapse; width: 100%;" border="1">
        <tbody>${day1SessionsHTML}
        </tbody>
    </table>
    <p>２日目</p>
    <table style="border-collapse: collapse; width: 100%;" border="1">
        <tbody>${day2SessionsHTML}
        </tbody>
    </table>
</div>
<hr width="100%" />
${registrationSection}
<hr width="100%" />
<div class="col-sm-2"> </div>
<div class="col-sm-8">
    <div align="center">
        <p style="text-align: center;"><strong>実行委員長</strong><br />${eventData.committeeChair}（WACATE実行委員会）</p>
        <p style="text-align: center;"><strong>実行委員</strong><br />${committeeMembersHTML}</p>
    </div>
</div>`
  }

  const generateProgramHTML = () => {
    const sessionIds = generateSessionIds()
    let sessionIndex = 0

    const day1HTML = eventData.day1Sessions
      .map((session) => {
        const idInfo = sessionIds[sessionIndex++]
        const timeRange = `${session.startTime} - ${session.endTime}`

        if (session.type === "break" || session.type === "meal") {
          return `<table style="height: 10px; width: 100%; border-collapse: collapse; border-color: #007f00;" border="1">
    <tbody>
        <tr style="height: 23px;">
            <td style="width: 16.459%; height: 10px; background-color: #007f00;"><span style="color: #ffffff;"><strong>${timeRange}</strong></span></td>
            <td style="width: 83.541%; height: 10px; background-color: #007f00;"><strong><span style="color: #ffffff;">${session.title}　${session.duration}</span></strong></td>
        </tr>
        ${session.description ? `<tr style="height: 23px;"><td style="width: 16.459%; height: 10px;">概要</td><td style="width: 83.541%; height: 10px;">${session.description}</td></tr>` : ""}
    </tbody>
</table>`
        }

        const referencesHTML =
          session.references.length > 0
            ? `<tr>
            <td style="width: 16.459%;">参考文献</td>
            <td style="width: 83.541%;">
                <ul>
                    ${session.references.map((ref) => `<li>${ref}</li>`).join("\n                    ")}
                </ul>
            </td>
        </tr>`
            : ""

        const speakerDisplay = session.speakerAffiliation
          ? `${session.speaker}（${session.speakerAffiliation}）`
          : session.speaker

        return `<table style="height: 92px; width: 100%; border-collapse: collapse; border-color: #007f00;" border="1">
    <tbody>
        <tr style="height: 23px;">
            <td id="${idInfo.generatedId}" style="width: 16.459%; height: 23px; background-color: #007f00;"><strong><span style="color: #ffffff;">${timeRange}</span></strong></td>
            <td style="width: 83.541%; height: 23px; background-color: #007f00;"><strong><span style="color: #ffffff;">${session.title}　${session.duration}</span></strong></td>
        </tr>
        <tr style="height: 23px;">
            <td style="width: 16.459%; height: 23px;">タイトル</td>
            <td style="width: 83.541%; height: 23px;">${session.title}</td>
        </tr>
        <tr style="height: 23px;">
            <td style="width: 16.459%; height: 23px;">${session.speaker.includes("モデレータ") ? "モデレータ" : "講演者"}</td>
            <td style="width: 83.541%; height: 23px;">${speakerDisplay}</td>
        </tr>
        <tr style="height: 23px;">
            <td style="width: 16.459%; height: 23px;">概要</td>
            <td style="width: 83.541%; height: 23px;">${session.description}</td>
        </tr>
        ${referencesHTML}
    </tbody>
</table>`
      })
      .join("\n")

    const day2HTML = eventData.day2Sessions
      .map((session) => {
        const idInfo = sessionIds[sessionIndex++]
        const timeRange = `${session.startTime} - ${session.endTime}`

        if (session.type === "break" || session.type === "meal") {
          return `<table style="height: 10px; width: 100%; border-collapse: collapse; border-color: #007f00;" border="1">
    <tbody>
        <tr style="height: 23px;">
            <td style="width: 16.459%; height: 10px; background-color: #007f00;"><span style="color: #ffffff;"><strong>${timeRange}</strong></span></td>
            <td style="width: 83.541%; height: 10px; background-color: #007f00;"><strong><span style="color: #ffffff;">${session.title}　${session.duration}</span></strong></td>
        </tr>
        ${session.description ? `<tr style="height: 23px;"><td style="width: 16.459%; height: 10px;">概要</td><td style="width: 83.541%; height: 10px;">${session.description}</td></tr>` : ""}
    </tbody>
</table>`
        }

        const referencesHTML =
          session.references.length > 0
            ? `<tr>
            <td style="width: 16.459%;">参考文献</td>
            <td style="width: 83.541%;">
                <ul>
                    ${session.references.map((ref) => `<li>${ref}</li>`).join("\n                    ")}
                </ul>
            </td>
        </tr>`
            : ""

        const speakerDisplay = session.speakerAffiliation
          ? `${session.speaker}（${session.speakerAffiliation}）`
          : session.speaker

        return `<table style="height: 92px; width: 100%; border-collapse: collapse; border-color: #007f00;" border="1">
    <tbody>
        <tr style="height: 23px;">
            <td id="${idInfo.generatedId}" style="width: 16.459%; height: 23px; background-color: #007f00;"><strong><span style="color: #ffffff;">${timeRange}</span></strong></td>
            <td style="width: 83.541%; height: 23px; background-color: #007f00;"><strong><span style="color: #ffffff;">${session.title}　${session.duration}</span></strong></td>
        </tr>
        <tr style="height: 23px;">
            <td style="width: 16.459%; height: 23px;">タイトル</td>
            <td style="width: 83.541%; height: 23px;">${session.title}</td>
        </tr>
        <tr style="height: 23px;">
            <td style="width: 16.459%; height: 23px;">${session.speaker.includes("モデレータ") ? "モデレータ" : "講演者"}</td>
            <td style="width: 83.541%; height: 23px;">${speakerDisplay}</td>
        </tr>
        <tr style="height: 23px;">
            <td style="width: 16.459%; height: 23px;">概要</td>
            <td style="width: 83.541%; height: 23px;">${session.description}</td>
        </tr>
        ${referencesHTML}
    </tbody>
</table>`
      })
      .join("\n")

    const day1Date = formatDateForDay(eventData.startDate, 0)
    const day2Date = formatDateForDay(eventData.startDate, 1)

    return `<h2>${eventData.eventName}　プログラム内容</h2>
<p>都合によりプログラムが変更される場合があります。ご了承ください。</p>
<h3>1日目　（${day1Date}）</h3>
${day1HTML}
<h3>2日目　（${day2Date}）</h3>
${day2HTML}`
  }

  const downloadHTML = (type: "main" | "program") => {
    const html = type === "main" ? generateHTML() : generateProgramHTML()
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const suffix = type === "main" ? "" : "program"
    a.download = `${eventData.eventName.replace(/\s+/g, "-")}${suffix}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDateForDay = (startDateStr: string, dayOffset: number): string => {
    // Extract date from format like "2025年6月28日（土）"
    const dateMatch = startDateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
    if (!dateMatch) return startDateStr.split("（")[0]

    const year = Number.parseInt(dateMatch[1])
    const month = Number.parseInt(dateMatch[2]) - 1 // JavaScript months are 0-indexed
    const day = Number.parseInt(dateMatch[3])

    const date = new Date(year, month, day)
    date.setDate(date.getDate() + dayOffset)

    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  const exportJSON = () => {
    const json = JSON.stringify(eventData, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${eventData.eventName.replace(/\s+/g, "-")}-data.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        // Validate that the JSON has the expected structure
        if (json && typeof json === "object" && "eventName" in json) {
          setEventData(json)
        } else {
          alert("無効なJSONファイルです。正しいフォーマットのファイルを選択してください。")
        }
      } catch (error) {
        alert("JSONファイルの読み込みに失敗しました。")
      }
    }
    reader.readAsText(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-balance">イベントHTML生成ツール</h1>
        <p className="text-muted-foreground text-lg">入力項目を埋めてHTMLファイルを生成</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>データ管理</CardTitle>
          <CardDescription>入力データをJSONファイルとして保存・読み込みできます</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 justify-center">
            <Button onClick={exportJSON} variant="outline" className="gap-2 bg-transparent">
              <FileJson className="h-4 w-4" />
              JSONをエクスポート
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              JSONをインポート
            </Button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={importJSON} className="hidden" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">基本情報</TabsTrigger>
          <TabsTrigger value="schedule">スケジュール</TabsTrigger>
          <TabsTrigger value="committee">実行委員</TabsTrigger>
          <TabsTrigger value="preview">プレビュー</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>イベント基本情報</CardTitle>
              <CardDescription>イベントの基本的な情報を入力してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="eventName">イベント名</Label>
                  <Input
                    id="eventName"
                    value={eventData.eventName}
                    onChange={(e) => updateField("eventName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizer">主催</Label>
                  <Input
                    id="organizer"
                    value={eventData.organizer}
                    onChange={(e) => updateField("organizer", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>ASTER協賛</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="asterSponsorship"
                      value="あり"
                      checked={eventData.asterSponsorship === "あり"}
                      onChange={(e) => updateField("asterSponsorship", e.target.value as "あり" | "なし")}
                      className="accent-accent"
                    />
                    <span>あり</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="asterSponsorship"
                      value="なし"
                      checked={eventData.asterSponsorship === "なし"}
                      onChange={(e) => updateField("asterSponsorship", e.target.value as "あり" | "なし")}
                      className="accent-accent"
                    />
                    <span>なし</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4 p-4 border border-border rounded-lg">
                <h3 className="font-semibold">日時</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">開始日</Label>
                    <Input
                      id="startDate"
                      value={eventData.startDate}
                      onChange={(e) => updateField("startDate", e.target.value)}
                      placeholder="2025年6月28日（土）"
                    />
                  </div>
                  <TimeInput
                    id="startTime"
                    label="開始時刻"
                    value={eventData.startTime}
                    onChange={(value) => updateField("startTime", value)}
                  />
                </div>
                <TimeInput
                  id="receptionStartTime"
                  label="受付開始時刻"
                  value={eventData.receptionStartTime}
                  onChange={(value) => updateField("receptionStartTime", value)}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="endDate">終了日</Label>
                    <Input
                      id="endDate"
                      value={eventData.endDate}
                      onChange={(e) => updateField("endDate", e.target.value)}
                      placeholder="2025年6月29日（日）"
                    />
                  </div>
                  <TimeInput
                    id="endTime"
                    label="終了時刻"
                    value={eventData.endTime}
                    onChange={(value) => updateField("endTime", value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="capacity">定員（人数のみ）</Label>
                  <Input
                    id="capacity"
                    value={eventData.capacity}
                    onChange={(e) => updateField("capacity", e.target.value)}
                    placeholder="48名"
                  />
                  <p className="text-sm text-muted-foreground">
                    ※「（定員となり次第、受付終了となります）」は自動的に付与されます
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minCapacity">最小催行人数</Label>
                  <Input
                    id="minCapacity"
                    value={eventData.minCapacity}
                    onChange={(e) => updateField("minCapacity", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="feeUnder35">参加費（35歳以下）</Label>
                  <Input
                    id="feeUnder35"
                    value={eventData.feeUnder35}
                    onChange={(e) => updateField("feeUnder35", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feeOver35">参加費（36歳以上）</Label>
                  <Input
                    id="feeOver35"
                    value={eventData.feeOver35}
                    onChange={(e) => updateField("feeOver35", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue">会場名</Label>
                <Input id="venue" value={eventData.venue} onChange={(e) => updateField("venue", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venueAccess">アクセス</Label>
                <Input
                  id="venueAccess"
                  value={eventData.venueAccess}
                  onChange={(e) => updateField("venueAccess", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venueUrl">会場URL</Label>
                <Input
                  id="venueUrl"
                  type="url"
                  value={eventData.venueUrl}
                  onChange={(e) => updateField("venueUrl", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">イベント説明</Label>
                <Textarea
                  id="description"
                  value={eventData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="programDetailUrl">プログラム詳細URL</Label>
                <Input
                  id="programDetailUrl"
                  type="url"
                  value={eventData.programDetailUrl}
                  onChange={(e) => updateField("programDetailUrl", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>申し込み状況</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="registrationStatus"
                      value="open"
                      checked={eventData.registrationStatus === "open"}
                      onChange={(e) => updateField("registrationStatus", e.target.value)}
                      className="accent-accent"
                    />
                    <span>受付中</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="registrationStatus"
                      value="closed"
                      checked={eventData.registrationStatus === "closed"}
                      onChange={(e) => updateField("registrationStatus", e.target.value)}
                      className="accent-accent"
                    />
                    <span>締切</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="registrationStatus"
                      value="coming-soon"
                      checked={eventData.registrationStatus === "coming-soon"}
                      onChange={(e) => updateField("registrationStatus", e.target.value)}
                      className="accent-accent"
                    />
                    <span>近日開始</span>
                  </label>
                </div>
              </div>

              {eventData.registrationStatus === "open" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="registrationDeadline">申し込み締切</Label>
                    <Input
                      id="registrationDeadline"
                      value={eventData.registrationDeadline}
                      onChange={(e) => updateField("registrationDeadline", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationUrl">申し込みURL</Label>
                    <Input
                      id="registrationUrl"
                      type="url"
                      value={eventData.registrationUrl}
                      onChange={(e) => updateField("registrationUrl", e.target.value)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1日目のスケジュール</CardTitle>
              <CardDescription>1日目のセッション情報を入力してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventData.day1Sessions.map((session, index) => (
                <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">セッション {index + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => removeSession("day1Sessions", index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>セッションタイプ</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`day1-type-${index}`}
                          value="session"
                          checked={session.type === "session"}
                          onChange={(e) => updateSession("day1Sessions", index, "type", e.target.value)}
                          className="accent-accent"
                        />
                        <span>セッション</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`day1-type-${index}`}
                          value="break"
                          checked={session.type === "break"}
                          onChange={(e) => updateSession("day1Sessions", index, "type", e.target.value)}
                          className="accent-accent"
                        />
                        <span>休憩</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`day1-type-${index}`}
                          value="meal"
                          checked={session.type === "meal"}
                          onChange={(e) => updateSession("day1Sessions", index, "type", e.target.value)}
                          className="accent-accent"
                        />
                        <span>食事</span>
                      </label>
                    </div>
                  </div>

                  {session.type === "session" ? (
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>ID（アンカー）</Label>
                        <Select
                          value={session.id}
                          onValueChange={(value) => {
                            updateSession("day1Sessions", index, "id", value)
                            updateSession("day1Sessions", index, "titleLink", `#${value}`)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="IDを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="session">session</SelectItem>
                            <SelectItem value="open_ses">open_ses</SelectItem>
                            <SelectItem value="position_ses">position_ses</SelectItem>
                            <SelectItem value="bpp">bpp</SelectItem>
                            <SelectItem value="morning_ses">morning_ses</SelectItem>
                            <SelectItem value="invited_ses">invited_ses</SelectItem>
                            <SelectItem value="close_ses">close_ses</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <TimeInput
                        label="開始時刻"
                        value={session.startTime}
                        onChange={(value) => updateSession("day1Sessions", index, "startTime", value)}
                      />
                      <TimeInput
                        label="終了時刻"
                        value={session.endTime}
                        onChange={(value) => updateSession("day1Sessions", index, "endTime", value)}
                      />
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      <TimeInput
                        label="開始時刻"
                        value={session.startTime}
                        onChange={(value) => updateSession("day1Sessions", index, "startTime", value)}
                      />
                      <TimeInput
                        label="終了時刻"
                        value={session.endTime}
                        onChange={(value) => updateSession("day1Sessions", index, "endTime", value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>所要時間（自動計算）</Label>
                    <Input
                      value={session.duration}
                      readOnly
                      className="bg-muted"
                      placeholder="開始時刻と終了時刻から自動計算されます"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>セッションタイトル</Label>
                    <Input
                      value={session.title}
                      onChange={(e) => updateSession("day1Sessions", index, "title", e.target.value)}
                    />
                  </div>

                  {session.type === "session" && (
                    <>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>登壇者</Label>
                          <Select
                            value={
                              customSpeakers.day1[index]
                                ? "その他"
                                : getCommitteeOptions().includes(session.speaker)
                                  ? session.speaker
                                  : "その他"
                            }
                            onValueChange={(value) => handleSpeakerSelect("day1Sessions", index, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="登壇者を選択" />
                            </SelectTrigger>
                            <SelectContent>
                              {getCommitteeOptions().map((member) => (
                                <SelectItem key={member} value={member}>
                                  {member}
                                </SelectItem>
                              ))}
                              <SelectItem value="その他">その他</SelectItem>
                            </SelectContent>
                          </Select>
                          {customSpeakers.day1[index] && (
                            <Input
                              value={session.speaker}
                              onChange={(e) => updateSession("day1Sessions", index, "speaker", e.target.value)}
                              placeholder="登壇者名を入力"
                              className="mt-2"
                            />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>所属</Label>
                          <Input
                            value={session.speakerAffiliation}
                            onChange={(e) => updateSession("day1Sessions", index, "speakerAffiliation", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>概要</Label>
                        <Textarea
                          value={session.description}
                          onChange={(e) => updateSession("day1Sessions", index, "description", e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>参考文献</Label>
                        {session.references.map((ref, refIndex) => (
                          <div key={refIndex} className="flex gap-2">
                            <Input
                              value={ref}
                              onChange={(e) => updateReference("day1Sessions", index, refIndex, e.target.value)}
                              placeholder="参考文献のリンクまたはテキスト"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeReference("day1Sessions", index, refIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => addReference("day1Sessions", index)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          参考文献を追加
                        </Button>
                      </div>
                    </>
                  )}

                  {(session.type === "break" || session.type === "meal") && (
                    <div className="space-y-2">
                      <Label>概要（任意）</Label>
                      <Textarea
                        value={session.description}
                        onChange={(e) => updateSession("day1Sessions", index, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              ))}
              <Button onClick={() => addSession("day1Sessions")} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                セッションを追加
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2日目のスケジュール</CardTitle>
              <CardDescription>2日目のセッション情報を入力してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventData.day2Sessions.map((session, index) => (
                <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">セッション {index + 1}</h4>
                    <Button variant="ghost" size="sm" onClick={() => removeSession("day2Sessions", index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>セッションタイプ</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`day2-type-${index}`}
                          value="session"
                          checked={session.type === "session"}
                          onChange={(e) => updateSession("day2Sessions", index, "type", e.target.value)}
                          className="accent-accent"
                        />
                        <span>セッション</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`day2-type-${index}`}
                          value="break"
                          checked={session.type === "break"}
                          onChange={(e) => updateSession("day2Sessions", index, "type", e.target.value)}
                          className="accent-accent"
                        />
                        <span>休憩</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`day2-type-${index}`}
                          value="meal"
                          checked={session.type === "meal"}
                          onChange={(e) => updateSession("day2Sessions", index, "type", e.target.value)}
                          className="accent-accent"
                        />
                        <span>食事</span>
                      </label>
                    </div>
                  </div>

                  {session.type === "session" ? (
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>ID（アンカー）</Label>
                        <Select
                          value={session.id}
                          onValueChange={(value) => {
                            updateSession("day2Sessions", index, "id", value)
                            updateSession("day2Sessions", index, "titleLink", `#${value}`)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="IDを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="session">session</SelectItem>
                            <SelectItem value="open_ses">open_ses</SelectItem>
                            <SelectItem value="position_ses">position_ses</SelectItem>
                            <SelectItem value="bpp">bpp</SelectItem>
                            <SelectItem value="morning_ses">morning_ses</SelectItem>
                            <SelectItem value="invited_ses">invited_ses</SelectItem>
                            <SelectItem value="close_ses">close_ses</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <TimeInput
                        label="開始時刻"
                        value={session.startTime}
                        onChange={(value) => updateSession("day2Sessions", index, "startTime", value)}
                      />
                      <TimeInput
                        label="終了時刻"
                        value={session.endTime}
                        onChange={(value) => updateSession("day2Sessions", index, "endTime", value)}
                      />
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      <TimeInput
                        label="開始時刻"
                        value={session.startTime}
                        onChange={(value) => updateSession("day2Sessions", index, "startTime", value)}
                      />
                      <TimeInput
                        label="終了時刻"
                        value={session.endTime}
                        onChange={(value) => updateSession("day2Sessions", index, "endTime", value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>所要時間（自動計算）</Label>
                    <Input
                      value={session.duration}
                      readOnly
                      className="bg-muted"
                      placeholder="開始時刻と終了時刻から自動計算されます"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>セッションタイトル</Label>
                    <Input
                      value={session.title}
                      onChange={(e) => updateSession("day2Sessions", index, "title", e.target.value)}
                    />
                  </div>

                  {session.type === "session" && (
                    <>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>登壇者</Label>
                          <Select
                            value={
                              customSpeakers.day2[index]
                                ? "その他"
                                : getCommitteeOptions().includes(session.speaker)
                                  ? session.speaker
                                  : "その他"
                            }
                            onValueChange={(value) => handleSpeakerSelect("day2Sessions", index, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="登壇者を選択" />
                            </SelectTrigger>
                            <SelectContent>
                              {getCommitteeOptions().map((member) => (
                                <SelectItem key={member} value={member}>
                                  {member}
                                </SelectItem>
                              ))}
                              <SelectItem value="その他">その他</SelectItem>
                            </SelectContent>
                          </Select>
                          {customSpeakers.day2[index] && (
                            <Input
                              value={session.speaker}
                              onChange={(e) => updateSession("day2Sessions", index, "speaker", e.target.value)}
                              placeholder="登壇者名を入力"
                              className="mt-2"
                            />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>所属</Label>
                          <Input
                            value={session.speakerAffiliation}
                            onChange={(e) => updateSession("day2Sessions", index, "speakerAffiliation", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>概要</Label>
                        <Textarea
                          value={session.description}
                          onChange={(e) => updateSession("day2Sessions", index, "description", e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>参考文献</Label>
                        {session.references.map((ref, refIndex) => (
                          <div key={refIndex} className="flex gap-2">
                            <Input
                              value={ref}
                              onChange={(e) => updateReference("day2Sessions", index, refIndex, e.target.value)}
                              placeholder="参考文献のリンクまたはテキスト"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeReference("day2Sessions", index, refIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => addReference("day2Sessions", index)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          参考文献を追加
                        </Button>
                      </div>
                    </>
                  )}

                  {(session.type === "break" || session.type === "meal") && (
                    <div className="space-y-2">
                      <Label>概要（任意）</Label>
                      <Textarea
                        value={session.description}
                        onChange={(e) => updateSession("day2Sessions", index, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              ))}
              <Button onClick={() => addSession("day2Sessions")} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                セッションを追加
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="committee" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>実行委員会</CardTitle>
              <CardDescription>
                実行委員長と実行委員の氏名を入力してください（所属は自動的に付与されます）
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="committeeChair">実行委員長（氏名のみ）</Label>
                <Input
                  id="committeeChair"
                  value={eventData.committeeChair}
                  onChange={(e) => updateField("committeeChair", e.target.value)}
                  placeholder="田中　一郎"
                />
              </div>

              <div className="space-y-3">
                <Label>実行委員（氏名のみ）</Label>
                {eventData.committeeMembers.map((member, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={member}
                      onChange={(e) => updateCommitteeMember(index, e.target.value)}
                      placeholder="鈴木　美咲"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeCommitteeMember(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={addCommitteeMember} variant="outline" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  実行委員を追加
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>メインページHTML</CardTitle>
              <CardDescription>イベント概要ページのHTMLプレビュー</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg overflow-auto max-h-[400px]">
                <pre className="text-sm font-mono whitespace-pre-wrap break-words">{generateHTML()}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>プログラム詳細HTML</CardTitle>
              <CardDescription>プログラム詳細ページのHTMLプレビュー</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg overflow-auto max-h-[400px]">
                <pre className="text-sm font-mono whitespace-pre-wrap break-words">{generateProgramHTML()}</pre>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button onClick={() => downloadHTML("main")} size="lg" className="gap-2">
              <Download className="h-5 w-5" />
              メインページをダウンロード
            </Button>
            <Button onClick={() => downloadHTML("program")} size="lg" variant="outline" className="gap-2">
              <Download className="h-5 w-5" />
              プログラム詳細をダウンロード
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
