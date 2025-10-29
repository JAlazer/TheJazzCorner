'use client';

import { useEffect, useRef, useState } from 'react';

export default function PythonEditor() {
  const editorRef = useRef<any | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Load CodeMirror scripts and styles
    const loadCodeMirror = async () => {
      // Load CSS
      const cssLinks = [
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/monokai.min.css'
      ];

      cssLinks.forEach(href => {
        if (!document.querySelector(`link[href="${href}"]`)) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          document.head.appendChild(link);
        }
      });

      // Load JS
            const loadScript = (src: string): Promise<void> => {
              return new Promise<void>((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                  resolve();
                  return;
                }
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => resolve();
                script.onerror = (ev) => reject(ev);
                document.body.appendChild(script);
              });
            };

      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/python/python.min.js');
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load CodeMirror:', error);
      }
    };

    loadCodeMirror();
  }, []);

  useEffect(() => {
    if (!isLoaded || !textareaRef.current || editorRef.current) return;

    const CodeMirror = (window as any).CodeMirror;
    
    editorRef.current = CodeMirror.fromTextArea(textareaRef.current, {
      mode: 'python',
      theme: 'monokai',
      lineNumbers: true,
      indentUnit: 4,
      indentWithTabs: false,
      lineWrapping: true,
      autoCloseBrackets: true,
      matchBrackets: true
    });

    if (editorRef.current) {
      editorRef.current.setValue(`def greet(name):
    """A simple greeting function"""
    return f"Hello, {name}!"

# Call the function
result = greet("Jazz Corner")
print(result)`);
    }

    // Cleanup
    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea();
        editorRef.current = null;
      }
    };
  }, [isLoaded]);

  const getCode = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      // Copy to clipboard
      navigator.clipboard.writeText(code).then(() => {
        alert('Code copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy code');
      });
    }
  };

  const runCode = async () => {
    if (!editorRef.current) return;
    
    const code = editorRef.current.getValue();
    setIsRunning(true);
    setOutput('Running...');

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: 'python',
          version: '3.10.0',
          files: [
            {
              content: code
            }
          ]
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const output = data.run.output || data.run.stdout || data.run.stderr || 'No output';
        setOutput(output);
      } else {
        setOutput(`Error: ${data.message || 'Failed to execute code'}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setOutput(`Error: ${error.message}`);
      } else {
        setOutput(`Error: ${String(error)}`);
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Python Code Editor</h2>
      
      <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
        <textarea ref={textareaRef} />
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={getCode}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Copy Code
        </button>
        <button
          onClick={runCode}
          disabled={isRunning}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>

      {output && (
        <div className="mt-4 p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-sm whitespace-pre-wrap overflow-x-auto">
          <div className="text-gray-400 mb-2 font-bold">Output:</div>
          {output}
        </div>
      )}

      <style jsx global>{`
        .CodeMirror {
          height: 400px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}