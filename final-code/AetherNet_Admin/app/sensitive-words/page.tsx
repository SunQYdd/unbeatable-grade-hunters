"use client"

import { useState, useEffect } from "react"
import {
    ShieldAlert,
    Plus,
    Search,
    Trash2,
    AlertTriangle,
    Loader2
} from "lucide-react"

// 引入我们之前定义的接口和API方法
import { fetchSensitiveWords, addSensitiveWord, deleteSensitiveWord } from "@/lib/api"
import { SensitiveWord } from "@/lib/mock-data"

// 引入 UI 组件 (Shadcn UI)
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { SidebarNav } from "@/components/sidebar-nav"

// 分类显示的配置（颜色和中文名）
const categoryConfig: Record<string, { label: string; color: string }> = {
    event: { label: "涉政/事件", color: "bg-red-100 text-red-700 border-red-200" },
    person: { label: "敏感人物", color: "bg-orange-100 text-orange-700 border-orange-200" },
    abuse: { label: "辱骂/暴恐", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    ad: { label: "广告引流", color: "bg-blue-100 text-blue-700 border-blue-200" },
    porn: { label: "色情涉黄", color: "bg-pink-100 text-pink-700 border-pink-200" },
    other: { label: "其他", color: "bg-gray-100 text-gray-700 border-gray-200" },
}

export default function SensitiveWordsPage() {
    // === 状态管理 ===
    const [words, setWords] = useState<SensitiveWord[]>([]) // 列表数据
    const [loading, setLoading] = useState(true) // 加载状态
    const [searchTerm, setSearchTerm] = useState("") // 搜索词

    // 新增弹窗的状态
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newWord, setNewWord] = useState("")
    const [newCategory, setNewCategory] = useState("other")

    const { toast } = useToast()

    // === 1. 初始化加载数据 (查) ===
    const loadData = async () => {
        setLoading(true)
        try {
            // 调用我们在 lib/api.ts 里写的假接口
            const res = await fetchSensitiveWords(1, 100, searchTerm)
            if (res.code === 200) {
                setWords(res.data.records)
            }
        } catch (error) {
            toast({
                title: "加载失败",
                description: "无法获取敏感词列表",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    // 首次加载或搜索词变化时触发
    useEffect(() => {
        loadData()
    }, [searchTerm])

    // === 2. 处理添加 (增) ===
    const handleAdd = async () => {
        if (!newWord.trim()) {
            toast({ title: "请输入敏感词内容", variant: "destructive" })
            return
        }

        setIsSubmitting(true)
        try {
            const res = await addSensitiveWord(newWord, newCategory)
            if (res.code === 200) {
                toast({ title: "添加成功", description: `已将“${newWord}”加入黑名单` })
                setIsDialogOpen(false) // 关闭弹窗
                setNewWord("")         // 清空输入框
                setNewCategory("other")
                loadData()             // 刷新列表
            }
        } catch (error) {
            toast({ title: "添加失败", variant: "destructive" })
        } finally {
            setIsSubmitting(false)
        }
    }

    // === 3. 处理删除 (删) ===
    const handleDelete = async (id: string, word: string) => {
        if (!confirm(`确定要删除敏感词“${word}”吗？`)) return

        try {
            const res = await deleteSensitiveWord(id)
            if (res.code === 200) {
                toast({ title: "删除成功" })
                loadData() // 刷新列表
            }
        } catch (error) {
            toast({ title: "删除失败", variant: "destructive" })
        }
    }

    // === 界面渲染 ===
    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* 侧边栏 */}
            <SidebarNav />

            {/* 主内容区域 - 留出左边距给 Sidebar */}
            <main className="flex-1 ml-56 p-8">

                {/* 顶部标题栏 */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <ShieldAlert className="h-8 w-8 text-primary-blue" />
                            敏感词管理
                        </h1>
                        <p className="text-gray-500 mt-1">
                            本地黑名单库。命中以下词汇的帖子将直接被拦截，不消耗 AI 额度。
                        </p>
                    </div>

                    {/* “新增”按钮 (带弹窗) */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary-blue hover:bg-blue-700">
                                <Plus className="h-4 w-4 mr-2" />
                                新增敏感词
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>添加新的敏感词</DialogTitle>
                                <DialogDescription>
                                    系统会精确匹配该词汇。请选择合适的分类以便统计。
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>敏感词内容</Label>
                                    <Input
                                        placeholder="例如：代开假条"
                                        value={newWord}
                                        onChange={(e) => setNewWord(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>违规分类</Label>
                                    <Select value={newCategory} onValueChange={setNewCategory}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(categoryConfig).map(([key, conf]) => (
                                                <SelectItem key={key} value={key}>
                                                    {conf.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
                                <Button onClick={handleAdd} disabled={isSubmitting} className="bg-primary-blue">
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    确认添加
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* 搜索与过滤栏 */}
                <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="搜索敏感词..."
                            className="pl-9 bg-gray-50 border-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-gray-500 ml-auto">
                        共找到 {words.length} 个敏感词
                    </div>
                </div>

                {/* 数据表格 */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[300px]">敏感词</TableHead>
                                <TableHead>违规类型</TableHead>
                                <TableHead>添加时间</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                // 加载中状态
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        <div className="flex items-center justify-center gap-2 text-gray-500">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            数据加载中...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : words.length === 0 ? (
                                // 空状态
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                                        暂无数据，请尝试更换搜索词或添加新词。
                                    </TableCell>
                                </TableRow>
                            ) : (
                                // 数据列表
                                words.map((item) => {
                                    const conf = categoryConfig[item.category] || categoryConfig['other']
                                    return (
                                        <TableRow key={item.id} className="hover:bg-gray-50">
                                            <TableCell className="font-medium text-gray-900">
                                                {item.word}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`font-normal ${conf.color}`}>
                                                    {conf.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-500 text-sm">
                                                {item.createdAt}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(item.id, item.word)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    删除
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </main>
        </div>
    )
}