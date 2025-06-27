// pages/index.tsx

import Head from 'next/head'
import { useState, useRef } from 'react'

type ChecklistItem = {
  id: number
  label: string
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: File[] }>({})
  const [remarks, setRemarks] = useState<{ [key: number]: string }>({})
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const checklistItems: ChecklistItem[] = [
  { id: 1, label: 'Loan Application' },
  { id: 2, label: 'CompDetailedReport' },
  { id: 3, label: 'Tax Summary Report' },
  { id: 4, label: 'Entity Documents' },
  { id: 5, label: 'Title Commitment' },
  { id: 6, label: 'Closing Protection Letter' },
  { id: 8, label: 'Budget' },
  { id: 9, label: 'Payoff' },
  { id: 10, label: 'Purchase Contract' },
  { id: 11, label: 'Photos' },
  { id: 14, label: 'Property Insurance' },
  { id: 15, label: 'Loan Closing Math Sheet' },
  { id: 16, label: 'Loan Documents' },
  { id: 17, label: 'Wire Instructions' },
  { id: 18, label: 'Executed Loan Documents' },
  { id: 19, label: 'Final Settlement Statement' },
  { id: 20, label: 'Loan Servicing Agreement' },
  { id: 24, label: 'Recorded DOT' },
  { id: 24, label: 'Recorded Assignment' },
  { id: 24, label: 'Recorded Loan Mod' },
  { id: 99, label: 'Extra Uploads' } // Arbitrary unique ID
]


  const filteredItems = checklistItems.filter((item) =>
    `$<span className="tabular-nums">{item.id}</span>&nbsp;<span className="ml-1">{item.label}</span>
`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!selectedItemId) return
    const files = Array.from(e.dataTransfer.files)
    setUploadedFiles((prev) => ({
      ...prev,
      [selectedItemId]: [...(prev[selectedItemId] || []), ...files]
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedItemId || !e.target.files) return
    const files = Array.from(e.target.files)
    setUploadedFiles((prev) => ({
      ...prev,
      [selectedItemId]: [...(prev[selectedItemId] || []), ...files]
    }))
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const selectedItem = checklistItems.find((item) => item.id === selectedItemId)

  return (
    <>
      <Head>
        <title>Document Hub Uploader</title>
      </Head>
      <main className="min-h-screen bg-gray-50 p-8 font-sans">
        <div className="flex max-w-6xl mx-auto gap-6">
          {/* Left Panel */}
          <aside className="w-[380px] bg-white border rounded-lg shadow-sm p-4">
            <h1 className="text-xl font-semibold mb-4 flex items-center gap-2">
              📁 Document Hub Uploader
            </h1>

            <h2 className="text-sm font-semibold mb-2">✅ Checklist for 1334 N Main St</h2>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search checklist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-3 px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />

            <div className="text-xs font-medium text-gray-400 uppercase border-b pb-1 mb-2 grid grid-cols-3 gap-2">
              <div>#</div>
              <div className="col-span-1">Document Type</div>
              <div className="text-right">Remarks</div>
            </div>

            <ul className="text-sm divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <li key={`${item.label}-${item.id}`} className="py-1.5 grid grid-cols-3 gap-2 items-center">
                  <div className="text-gray-500 text-xs">{item.id}</div>
                  <div
                    onClick={() => setSelectedItemId(item.id)}
                    className={`cursor-pointer select-none px-2 py-1 rounded-md ${
                      selectedItemId === item.id
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.label}
                  </div>
                  <input
                    type="text"
                    placeholder="Add remark"
                    value={remarks[item.id] || ''}
                    onChange={(e) =>
                      setRemarks((prev) => ({ ...prev, [item.id]: e.target.value }))
                    }
                    className="text-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </li>
              ))}
            </ul>
          </aside>

          {/* Upload Area */}
          <section className="flex-1 bg-white border rounded-lg shadow-sm flex items-center justify-center p-8">
            <div
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={triggerFileInput}
              className="border-2 border-dashed border-gray-300 rounded-lg w-full h-64 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition cursor-pointer"
            >
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="text-4xl mb-2">📂</div>
              <p className="text-sm">
                {selectedItem
                  ? `Drop or click to upload for: ${selectedItem.label}`
                  : 'Drag and drop files here'}
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
