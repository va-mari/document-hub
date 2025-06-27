// pages/index.tsx

import Head from 'next/head'
import { useState, useRef } from 'react'

type ChecklistItem = {
  id: number
  label: string
  icon?: string
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: File[] }>({})
  const [remarks, setRemarks] = useState<{ [key: number]: string }>({})
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const checklistItems: ChecklistItem[] = [
    { id: 1, label: 'Loan Application', icon: '📝' },
    { id: 2, label: 'CompDetailedReport', icon: '📊' },
    { id: 3, label: 'Tax Summary Report', icon: '📑' },
    { id: 4, label: 'Entity Documents', icon: '🏢' },
    { id: 5, label: 'Title Commitment', icon: '📃' },
    { id: 6, label: 'CPL', icon: '🛡️' },
    { id: 8, label: 'Budget', icon: '💰' },
    { id: 9, label: 'Payoff', icon: '✅' },
    { id: 10, label: 'Purchase Contract', icon: '🛒' },
    { id: 11, label: 'Photos', icon: '📷' },
    { id: 14, label: 'Property Insurance', icon: '🏠' },
    { id: 15, label: 'Loan Closing Math Sheet', icon: '🧮' },
    { id: 16, label: 'Loan Documents', icon: '📁' },
    { id: 17, label: 'Wire Instructions', icon: '💸' },
    { id: 18, label: 'Executed Loan Documents', icon: '✍️' },
    { id: 19, label: 'Final Settlement Statement', icon: '📜' },
    { id: 20, label: 'Loan Servicing Agreement', icon: '🔏' },
    { id: 24, label: 'Recorded DOT', icon: '🗂️' },
    { id: 24, label: 'Recorded Assignment', icon: '📎' },
    { id: 24, label: 'Recorded Loan Mod.', icon: '🔧' }
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
      <main className="flex h-screen bg-gray-50 text-gray-800">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 p-5 overflow-y-auto shadow-sm">
          <h2 className="text-2xl font-bold mb-4">📋 Checklist</h2>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-5 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <ul className="space-y-4 text-sm">
            {filteredItems.map((item, index) => (
              <li key={`${item.id}-${index}`}>
                <div
                  onClick={() => setSelectedItemId(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition ${
                    selectedItemId === item.id
                      ? 'bg-blue-100 text-blue-800 font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.id} - {item.label}</span>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles[item.id]?.length > 0 && (
                  <ul className="ml-8 mt-1 text-xs text-gray-600 space-y-1">
                    {uploadedFiles[item.id].map((file, i) => (
                      <li key={i} className="truncate">• {file.name}</li>
                    ))}
                  </ul>
                )}

                {/* Remarks Input */}
                <div className="ml-8 mt-2">
                  <label htmlFor={`remarks-${item.id}`} className="block text-xs text-gray-500 mb-1">
                    Remarks
                  </label>
                  <input
                    type="text"
                    id={`remarks-${item.id}`}
                    value={remarks[item.id] || ''}
                    onChange={(e) =>
                      setRemarks((prev) => ({ ...prev, [item.id]: e.target.value }))
                    }
                    placeholder="Add notes..."
                    className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-10 flex flex-col">
          <h1 className="text-3xl font-bold mb-6">📁 Document Hub</h1>

          <div
            className="flex-1 flex items-center justify-center"
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={triggerFileInput}
          >
            <div className="w-full max-w-2xl border-4 border-dashed border-gray-300 rounded-xl bg-white p-10 text-center text-gray-500 hover:bg-gray-50 transition cursor-pointer">
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
                  <span className="font-semibold text-gray-800">
                    {selectedItem.id} - {selectedItem.label}
                  </span>
                </p>
              ) : (
                <p>Select a checklist item to begin uploading</p>
              )}
            </div>
          </div>

          {selectedItemId && uploadedFiles[selectedItemId]?.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-2">
                Uploaded files for {selectedItem?.id} - {selectedItem?.label}
              </h2>
              <ul className="bg-white rounded-md shadow divide-y divide-gray-200">
                {uploadedFiles[selectedItemId].map((file, index) => (
                  <li key={index} className="flex items-center justify-between p-3">
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
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
