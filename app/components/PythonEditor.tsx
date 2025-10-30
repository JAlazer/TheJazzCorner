'use client';

import { useEffect, useRef, useState } from 'react';

// Declare CodeMirror type for TypeScript
declare global {
  interface Window {
    CodeMirror: any;
  }
}

type LanguageKey = 'python' | 'java' | 'cpp' | 'kotlin' | 'javascript';

interface LanguageConfig {
  name: string;
  mode: string;
  version: string;
  template: string;
}

const LANGUAGES: Record<LanguageKey, LanguageConfig> = {
  python: {
    name: 'Python',
    mode: 'python',
    version: '3.10.0',
    template: `def greet(name):
    """A simple greeting function"""
    return f"Hello, {name}!"

# Call the function
result = greet("Jazz Corner")
print(result)`
  },
  java: {
    name: 'Java',
    mode: 'text/x-java',
    version: '15.0.2',
    template: `public class Main {
    public static void main(String[] args) {
        String name = "Jazz Corner";
        System.out.println("Hello, " + name + "!");
    }
}`
  },
  cpp: {
    name: 'C++',
    mode: 'text/x-c++src',
    version: '10.2.0',
    template: `#include <iostream>
#include <string>

int main() {
    std::string name = "Jazz Corner";
    std::cout << "Hello, " << name << "!" << std::endl;
    return 0;
}`
  },
  kotlin: {
    name: 'Kotlin',
    mode: 'text/x-kotlin',
    version: '1.8.20',
    template: `fun main() {
    val name = "Jazz Corner"
    println("Hello, $name!")
}`
  },
  javascript: {
    name: 'JavaScript',
    mode: 'javascript',
    version: '18.15.0',
    template: `function greet(name) {
    return \`Hello, \${name}!\`;
}

// Call the function
const result = greet("Jazz Corner");
console.log(result);`
  }
};

export default function PythonEditor() {
  const editorRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey>('python');

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
      const loadScript = (src: string) => {
        return new Promise<void>((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => resolve();
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };

      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/python/python.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/clike/clike.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/javascript/javascript.min.js');
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load CodeMirror:', error);
      }
    };

    loadCodeMirror();
  }, []);

  useEffect(() => {
    if (!isLoaded || !textareaRef.current || editorRef.current) return;

    const CodeMirror = window.CodeMirror;
    
    editorRef.current = CodeMirror.fromTextArea(textareaRef.current, {
      mode: LANGUAGES.python.mode,
      theme: 'monokai',
      lineNumbers: true,
      indentUnit: 4,
      indentWithTabs: false,
      lineWrapping: true,
      autoCloseBrackets: true,
      matchBrackets: true
    });

    editorRef.current.setValue(LANGUAGES.python.template);

    // Cleanup
    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea();
        editorRef.current = null;
      }
    };
  }, [isLoaded]);

  const handleLanguageChange = (language: LanguageKey) => {
    setSelectedLanguage(language);
    setOutput('');
    
    if (editorRef.current) {
      const langConfig = LANGUAGES[language];
      editorRef.current.setOption('mode', langConfig.mode);
      editorRef.current.setValue(langConfig.template);
    }
  };

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
    const langConfig = LANGUAGES[selectedLanguage];
    
    setIsRunning(true);
    setOutput('Running...');

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: selectedLanguage === 'cpp' ? 'c++' : selectedLanguage,
          version: langConfig.version,
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
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Code Editor</h2>
        
        <div className="flex gap-2">
          {(Object.entries(LANGUAGES) as [LanguageKey, LanguageConfig][]).map(([key, lang]) => (
            <button
              key={key}
              onClick={() => handleLanguageChange(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedLanguage === key
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
      
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