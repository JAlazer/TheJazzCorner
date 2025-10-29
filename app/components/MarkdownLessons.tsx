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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const text = await file.text();
    const parsed = parseMarkdown(text);
    setLessons(parsed);
    setCurrentLesson(0);
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
            Markdown Lesson Viewer
          </h2>
          <p className="text-gray-600 mb-6">
            Upload a markdown file to split it into lessons based on headings
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium opacity-90">{fileName}</h2>
                <p className="text-xs opacity-75">
                  Lesson {currentLesson + 1} of {lessons.length}
                </p>
              </div>
              <label className="inline-flex items-center gap-2 bg-indigo-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-800 transition text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Change File
                <input
                  type="file"
                  accept=".md,.markdown,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              {lessons[currentLesson].title}
            </h1>
            <div 
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: renderMarkdown(lessons[currentLesson].content) 
              }}
            />
          </div>

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
        </div>
      )}
    </div>
  );
}