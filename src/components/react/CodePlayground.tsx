import { useEffect, useRef, useState, useCallback } from 'react';

interface Props {
  initialCode?: string;
  language?: string;
}

export default function CodePlayground({
  initialCode = '// Try running some JavaScript!\nconsole.log("Hello from ContentForge!");\n\nconst sum = (a, b) => a + b;\nconsole.log("2 + 3 =", sum(2, 3));',
  language = 'javascript',
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<any>(null);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const init = async () => {
      const { EditorView, basicSetup } = await import('codemirror');
      const { javascript } = await import('@codemirror/lang-javascript');
      const { oneDark } = await import('@codemirror/theme-one-dark');

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      const extensions = [
        basicSetup,
        javascript(),
        EditorView.lineWrapping,
      ];

      if (isDark) {
        extensions.push(oneDark);
      }

      viewRef.current = new EditorView({
        doc: initialCode,
        extensions,
        parent: editorRef.current!,
      });
    };

    init();

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [initialCode]);

  const runCode = useCallback(() => {
    if (!viewRef.current) return;
    setIsRunning(true);
    setOutput('');

    const code = viewRef.current.state.doc.toString();
    const logs: string[] = [];

    // Create a sandboxed execution environment
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    try {
      const win = iframe.contentWindow!;

      // Override console.log in the iframe
      (win as any).console = {
        log: (...args: any[]) => {
          logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '));
        },
        error: (...args: any[]) => {
          logs.push(`Error: ${args.join(' ')}`);
        },
        warn: (...args: any[]) => {
          logs.push(`Warning: ${args.join(' ')}`);
        },
      };

      // Execute the code
      (win as any).eval(code);
      setOutput(logs.join('\n') || '(no output)');
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    } finally {
      document.body.removeChild(iframe);
      setIsRunning(false);
    }
  }, []);

  const clearOutput = useCallback(() => setOutput(''), []);

  return (
    <div className="my-6 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden not-prose">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {language}
        </span>
        <div className="flex items-center gap-2">
          {output && (
            <button
              onClick={clearOutput}
              className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={runCode}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-md text-xs font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div ref={editorRef} className="min-h-[150px] max-h-[400px] overflow-auto text-sm" />

      {/* Output */}
      {output && (
        <div className="border-t border-slate-200 dark:border-slate-700">
          <div className="px-4 py-1.5 bg-slate-800 text-xs text-slate-400 font-mono uppercase tracking-wider">
            Output
          </div>
          <pre className="p-4 bg-slate-900 text-green-400 font-mono text-sm overflow-x-auto max-h-[200px]">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
