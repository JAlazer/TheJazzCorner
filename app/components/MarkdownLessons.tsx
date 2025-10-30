'use client';

import React, { useState } from 'react';

interface Lesson {
  level: number;
  title: string;
  content: string;
}

export default function MarkdownLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [fileName, setFileName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const parseMarkdown = (text: string): Lesson[] => {
    const lines = text.split('\n');
    const sections: Lesson[] = [];
    let currentSection: Lesson | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      const hashMatch = line.match(/^(#{1,6})\s+(.+)$/);
      const isUnderlineHeading = i < lines.length - 1 && 
        (lines[i + 1].match(/^=+$/) || lines[i + 1].match(/^-+$/));
      
      if (hashMatch) {
        const level = hashMatch[1].length;
        const title = hashMatch[2].trim();
        
        currentSection = {
          level,
          title,
          content: ''
        };
        sections.push(currentSection);
      } else if (isUnderlineHeading) {
        const level = lines[i + 1][0] === '=' ? 1 : 2;
        const title = line.trim();
        
        currentSection = {
          level,
          title,
          content: ''
        };
        sections.push(currentSection);
        i++;
      } else {
        if (currentSection) {
          currentSection.content += line + '\n';
        } else {
          if (sections.length === 0 && line.trim()) {
            sections.push({
              level: 0,
              title: 'Introduction',
              content: ''
            });
            currentSection = sections[0];
          }
          if (currentSection) {
            currentSection.content += line + '\n';
          }
        }
      }
    }

    return sections.map(section => ({
      ...section,
      content: section.content.trim()
    }));
  };

  const renderMarkdown = (text: string): string => {
    let html = text;

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');
    html = html.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>');
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>');
    
    const lines = html.split('\n');
    const processed: string[] = [];
    let inList = false;
    
    for (let line of lines) {
      if (line.match(/^[\*\-\+]\s/)) {
        if (!inList) {
          processed.push('<ul class="list-disc ml-6 my-2">');
          inList = true;
        }
        processed.push(`<li>${line.replace(/^[\*\-\+]\s/, '')}</li>`);
      } else if (line.match(/^\d+\.\s/)) {
        if (!inList) {
          processed.push('<ol class="list-decimal ml-6 my-2">');
          inList = true;
        }
        processed.push(`<li>${line.replace(/^\d+\.\s/, '')}</li>`);
      } else {
        if (inList) {
          processed.push('</ul>');
          inList = false;
        }
        if (line.trim()) {
          processed.push(`<p class="my-2">${line}</p>`);
        } else {
          processed.push('<br>');
        }
      }
    }
    
    if (inList) {
      processed.push('</ul>');
    }
    
    return processed.join('\n');
  };

  const convertToMarkdown = (): string => {
    return lessons.map(lesson => {
      const heading = '#'.repeat(Math.max(1, lesson.level)) + ' ' + lesson.title;
      return heading + '\n\n' + lesson.content;
    }).join('\n\n');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const text = await file.text();
    const parsed = parseMarkdown(text);
    setLessons(parsed);
    setCurrentLesson(0);
  };

  const handleDownload = () => {
    const markdown = convertToMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'lessons.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const startEditing = () => {
    setEditTitle(lessons[currentLesson].title);
    setEditContent(lessons[currentLesson].content);
    setIsEditing(true);
  };

  const saveEdit = () => {
    const updatedLessons = [...lessons];
    updatedLessons[currentLesson] = {
      ...updatedLessons[currentLesson],
      title: editTitle,
      content: editContent
    };
    setLessons(updatedLessons);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditContent('');
  };

  const addNewLesson = () => {
    const newLesson: Lesson = {
      level: 2,
      title: 'New Lesson',
      content: 'Add your content here...'
    };
    const updatedLessons = [...lessons];
    updatedLessons.splice(currentLesson + 1, 0, newLesson);
    setLessons(updatedLessons);
    setCurrentLesson(currentLesson + 1);
    setEditTitle(newLesson.title);
    setEditContent(newLesson.content);
    setIsEditing(true);
  };

  const deleteLesson = () => {
    if (lessons.length === 1) {
      alert('Cannot delete the last lesson!');
      return;
    }
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    
    const updatedLessons = lessons.filter((_, idx) => idx !== currentLesson);
    setLessons(updatedLessons);
    setCurrentLesson(Math.max(0, currentLesson - 1));
  };

  const nextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      {lessons.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Markdown Lesson Editor
          </h2>
          <p className="text-gray-600 mb-6">
            Upload a markdown file to split it into lessons, edit them, and download the result
          </p>
          <label className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-indigo-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Upload Markdown File
            <input
              type="file"
              accept=".md,.markdown,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-indigo-600 text-white p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-sm font-medium opacity-90">{fileName}</h2>
                <p className="text-xs opacity-75">
                  Lesson {currentLesson + 1} of {lessons.length}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download
                </button>
                <label className="inline-flex items-center gap-2 bg-indigo-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-800 transition text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Change
                  <input
                    type="file"
                    accept=".md,.markdown,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="p-8">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content (Markdown supported)
                  </label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={15}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-6">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {lessons[currentLesson].title}
                  </h1>
                  <div className="flex gap-2">
                    <button
                      onClick={startEditing}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={addNewLesson}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Add new lesson after this one"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                    <button
                      onClick={deleteLesson}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div 
                  className="prose max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdown(lessons[currentLesson].content) 
                  }}
                />
              </>
            )}
          </div>

          {!isEditing && (
            <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50">
              <button
                onClick={prevLesson}
                disabled={currentLesson === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Previous
              </button>

              <div className="flex gap-1">
                {lessons.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentLesson(idx)}
                    className={`w-2 h-2 rounded-full transition ${
                      idx === currentLesson ? 'bg-indigo-600 w-6' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextLesson}
                disabled={currentLesson === lessons.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}