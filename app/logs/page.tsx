"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileJson, FileText, FolderTree, RefreshCw, X, Download, ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Card } from "@/components/Card"
import { Badge } from "@/components/Badge"
import { cn } from "@/lib/utils"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { JsonViewer } from '@/components/JsonViewer'

// GitHub API types
type GitHubNode = {
  path: string
  mode: string
  type: "blob" | "tree"
  sha: string
  size: number
  url: string
}

export default function LogsPage() {
  const [files, setFiles] = React.useState<GitHubNode[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  const [selectedFile, setSelectedFile] = React.useState<GitHubNode | null>(null)
  const [fileContent, setFileContent] = React.useState<string | null>(null)
  const [parsedJsonData, setParsedJsonData] = React.useState<any>(null)
  const [contentLoading, setContentLoading] = React.useState(false)

  const fetchFiles = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch repo tree recursively
      const res = await fetch("https://api.github.com/repos/hcsn-theory/hcsn-rust/git/trees/main?recursive=1")
      if (!res.ok) {
        throw new Error("Failed to fetch repository data")
      }
      const data = await res.json()
      
      // Filter for files in exports/ and hypotheses/ to avoid clutter
      const relevantFiles = data.tree.filter(
        (node: GitHubNode) => 
          node.type === "blob" && 
          (node.path.startsWith("exports/") || node.path.startsWith("hypotheses/")) &&
          !node.path.includes("legacy_archive/") &&
          (node.path.endsWith(".json") || node.path.endsWith(".csv") || node.path.endsWith(".md") || node.path.endsWith(".txt"))
      ).sort((a: GitHubNode, b: GitHubNode) => b.path.localeCompare(a.path))
      
      setFiles(relevantFiles)
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching files.")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  // Fetch content when a file is selected
  React.useEffect(() => {
    if (!selectedFile) {
      setFileContent(null)
      return
    }

    const fetchContent = async () => {
      setContentLoading(true)
      try {
        const rawUrl = `https://raw.githubusercontent.com/hcsn-theory/hcsn-rust/main/${selectedFile.path}`
        
        // Handle potentially large files by not fully downloading them if they're massive,
        // but for now we just fetch directly
        const res = await fetch(rawUrl)
        if (!res.ok) throw new Error("Failed to fetch file content")
        
        let text = await res.text()
        
        // Prettify JSON if applicable
        setParsedJsonData(null)
        if (selectedFile.path.endsWith('.json')) {
          try {
            const parsed = JSON.parse(text)
            setParsedJsonData(parsed)
            text = JSON.stringify(parsed, null, 2)
          } catch (e) {
            // Ignore if invalid JSON
          }
        }
        
        setFileContent(text)
      } catch (err) {
        setFileContent("Error loading content. It may be too large to load in the browser, or cross-origin headers block it.")
      } finally {
        setContentLoading(false)
      }
    }

    fetchContent()
  }, [selectedFile])

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleDownload = () => {
    if (!selectedFile || !fileContent) return
    const blob = new Blob([fileContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = selectedFile.path.split('/').pop() || 'file'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background p-4 md:p-6 overflow-hidden max-w-[1600px] mx-auto">
      {/* Header Area */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between shrink-0 gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">HCSN Engine Logs</h1>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block"></div>
          <nav className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
            <Link href="/simulation" className="hover:text-foreground transition-colors">Simulation</Link>
          </nav>
        </div>
        <button 
          onClick={fetchFiles}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4"
        >
          <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0 overflow-hidden">
        
        {/* Sidebar - File List */}
        <div className="w-full lg:w-1/3 flex flex-col rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
          <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
            <h2 className="font-semibold flex items-center">
              <FolderTree className="h-5 w-5 mr-2 text-primary" />
              Repository Files
            </h2>
            <Badge variant="outline">{files.length}</Badge>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading && files.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                <RefreshCw className="h-8 w-8 animate-spin mb-4 text-primary/50" />
                Fetching files from GitHub...
              </div>
            ) : error ? (
              <div className="p-4 m-2 text-sm text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
                {error}
              </div>
            ) : files.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No log or json files found in the repository.
              </div>
            ) : (
              files.map((file) => {
                const isSelected = selectedFile?.path === file.path
                const isJson = file.path.endsWith('.json')
                
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={cn(
                      "w-full text-left px-3 py-3 rounded-lg flex items-start space-x-3 transition-all duration-200",
                      isSelected 
                        ? "bg-primary/10 border border-primary/20 shadow-sm" 
                        : "hover:bg-accent/50 border border-transparent"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-md",
                      isJson ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500",
                      isSelected && (isJson ? "bg-amber-500/20" : "bg-blue-500/20")
                    )}>
                      {isJson ? <FileJson className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        isSelected ? "text-foreground" : "text-foreground/80"
                      )}>
                        {file.path.split('/').pop()}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5" title={file.path}>
                        {file.path.split('/').slice(0, -1).join('/') || '/'} • {formatSize(file.size)}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Main Content - File Viewer */}
        <div className="w-full lg:w-2/3 flex flex-col rounded-xl border bg-card overflow-hidden shadow-sm relative">
          <AnimatePresence mode="wait">
            {!selectedFile ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center"
              >
                <div className="w-24 h-24 mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                  <FileText className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">Select a file to view</h3>
                <p className="max-w-sm">
                  Choose a log or JSON file from the side panel to view its contents directly in the browser.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="viewer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex-1 flex flex-col h-full"
              >
                <div className="p-4 border-b flex items-center justify-between bg-muted/10">
                  <div className="flex items-center min-w-0 pr-4">
                    {selectedFile.path.endsWith('.json') ? (
                      <FileJson className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
                    ) : (
                      <FileText className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    )}
                    <h2 className="font-semibold truncate text-sm md:text-base">
                      {selectedFile.path}
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <a 
                      href={`https://github.com/hcsn-theory/hcsn-rust/blob/main/${selectedFile.path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      title="View on GitHub"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button 
                      onClick={handleDownload}
                      disabled={contentLoading || !fileContent}
                      className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setSelectedFile(null)}
                      className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors lg:hidden"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto bg-zinc-950 font-mono text-sm relative dark text-foreground">
                  {contentLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-10">
                      <RefreshCw className="h-8 w-8 animate-spin text-zinc-400" />
                    </div>
                  ) : null}
                  
                  {fileContent ? (
                    selectedFile.path.endsWith('.md') ? (
                      <div className="prose max-w-none prose-sm font-sans p-6">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{fileContent}</ReactMarkdown>
                      </div>
                    ) : selectedFile.path.endsWith('.json') && parsedJsonData ? (
                      <div className="p-4">
                        <JsonViewer data={parsedJsonData} />
                      </div>
                    ) : (
                      <pre className="text-zinc-300 whitespace-pre-wrap break-words p-4">
                        {fileContent}
                      </pre>
                    )
                  ) : (
                    !contentLoading && (
                      <div className="text-zinc-500 flex h-full items-center justify-center">
                        No content available or file is empty.
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
