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
    { id: 6, label: 'CPL' },
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
    { id: 24, label: 'Recorded Loan Mod.' }
  ]

  const filteredItems = checklistItems.filter((item) =>
    `${item.id} - ${item.label}`.toLowerCase().includes(searchTerm.toLowerCase())
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
        <title>Document Hub</title>
      </Head>
      <main className="flex h-screen bg-gray-100 font-sans">
        {/* Sidebar */}
        <aside className="w-80 bg-white shadow-md p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">📋 Checklist</h2>
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
          />
          <ul className="space-y-4">
            {filteredItems.map((item, index) => (
              <li key={`${item.id}-${index}`}>
                <div
                  onClick={() => setSelectedItemId(item.id)}
                  className={`cursor-pointer px-3 py-2 rounded hover:bg-gray-200 ${
                    selectedItemId === item.id ? 'bg-blue-100 text-blue-800 font-semibold' : ''
                  }`}
                >
                  {item.id} - {item.label}
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles[item.id]?.length > 0 && (
                  <ul className="ml-4 mt-1 text-sm text-gray-600 space-y-1">
                    {uploadedFiles[item.id].map((file, i) => (
                      <li key={i} className="truncate">• {file.name}</li>
                    ))}
                  </ul>
                )}

                {/* Remarks Input */}
                <div className="ml-4 mt-2">
                  <label htmlFor={`remarks-${item.id}-${index}`} className="block text-xs font-medium text-gray-500 mb-1">
                    Remarks
                  </label>
                  <input
                    type="text"
                    id={`remarks-${item.id}-${index}`}
                    value={remarks[item.id] || ''}
                    onChange={(e) =>
                      setRemarks((prev) => ({ ...prev, [item.id]: e.target.value }))
                    }
                    placeholder="Add notes here..."
                    className="w-full text-sm px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Area */}
        <section className="flex-1 flex flex-col p-6">
          <h1 className="text-3xl font-bold mb-4">📁 Document Hub</h1>

          <div
            className="bg-white border-2 border-dashed border-gray-400 rounded-xl p-12 text-gray-600 text-center transition-all hover:bg-gray-50 cursor-pointer"
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={triggerFileInput}
          >
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedItem ? (
              <p>
                Drop or click to upload files for{' '}
                <span className="font-semibold">
                  {selectedItem.id} - {selectedItem.label}
                </span>
              </p>
            ) : (
              <p>Select an item from the checklist to upload files</p>
            )}
          </div>

          {selectedItemId && uploadedFiles[selectedItemId]?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">
                Uploaded files for {selectedItem?.id} - {selectedItem?.label}
              </h2>
              <ul className="bg-white rounded-md shadow divide-y divide-gray-200">
                {uploadedFiles[selectedItemId].map((file, index) => (
                  <li key={index} className="flex items-center justify-between p-3">
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
    </>
  )
}
