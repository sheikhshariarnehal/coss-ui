import React, { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
  filename?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'tsx',
  showLineNumbers = true,
  className = '',
  filename,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className={`relative group rounded-xl border border-border bg-code overflow-hidden text-sm ${className}`}>
      {filename && (
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-4 py-2 text-xs font-mono text-muted-foreground">
          <span>{filename}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      )}

      {!filename && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-lg border border-border/80 bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-accent opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
        >
          {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
        </button>
      )}

      <div className="overflow-x-auto p-4 max-h-[550px] font-mono text-xs sm:text-[13px] leading-relaxed">
        {showLineNumbers ? (
          <table className="border-collapse w-full">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-code-highlight/40 transition-colors">
                  <td className="select-none pr-4 text-right text-muted-foreground/40 font-mono text-xs w-8 align-top">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre font-mono pl-2 text-code-foreground">
                    <code>{line || ' '}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre className={`language-${language} m-0 p-0 bg-transparent`}>
            <code className={`language-${language}`}>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
};
