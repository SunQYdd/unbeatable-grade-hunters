"use client"

import { X, Send, Brain, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface AIHelpModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  role: "user" | "assistant"
  content: string
}

const predefinedAnswers: Record<string, string> = {
  准确率:
    "当前AI决策准确率为93.27%，这是基于最近30天的审核数据统计得出的。准确率 = (AI正确判断数 / AI总判断数) × 100%。我们的AI模型会根据新的审核数据持续学习和优化。",
  违规: "常见违规类型包括：1) 广告推广 - 未经许可的商业广告；2) 水贴灌水 - 无意义的重复内容；3) 违规内容 - 违反社区规定的内容。每种违规类型都有相应的处理规则。",
  如何: "AI审核流程：1) 内容提交后自动进入AI分析队列；2) AI模型分析内容特征和语义；3) 输出预测结果和置信度；4) 高置信度内容自动处理，低置信度转人工审核。",
  提高: "提高AI准确率的方法：1) 持续人工审核反馈，优化模型；2) 增加训练数据的多样性；3) 针对新型违规模式进行专项训练；4) 定期评估和更新模型参数。",
}

export function AIHelpModal({ isOpen, onClose }: AIHelpModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "您好！我是AI审核助手，有什么可以帮助您的？您可以询问关于AI准确率、违规类型、审核流程等问题。",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let response =
        "感谢您的提问！关于这个问题，建议您查看帮助文档或联系管理员获取更详细的信息。如果您有其他关于AI审核的问题，我很乐意为您解答。"

      // Check for keywords in the question
      for (const [keyword, answer] of Object.entries(predefinedAnswers)) {
        if (userMessage.includes(keyword)) {
          response = answer
          break
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg mx-4 h-[70vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-blue to-cyan-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">AI 助手</h2>
              <p className="text-xs text-white/80">有问题随时问我</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.role === "user"
                    ? "bg-primary-blue text-white rounded-br-md"
                    : "bg-gray-100 text-gray-900 rounded-bl-md"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex gap-2">
            <Input
              placeholder="输入您的问题..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-gray-100 border-0 rounded-xl"
            />
            <Button
              size="icon"
              className="bg-primary-blue hover:bg-blue-600 rounded-xl"
              onClick={handleSend}
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
