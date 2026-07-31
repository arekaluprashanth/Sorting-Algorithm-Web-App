import React, { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';

interface PseudoCodePanelProps {
  code: string;
}

export const PseudoCodePanel: React.FC<PseudoCodePanelProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Very simple syntax highlighting for pseudo code
  const highlightCode = (line: string) => {
    let html = line;
    // Keywords
    const keywords = ['procedure', 'algorithm', 'function', 'if', 'then', 'else', 'repeat', 'until', 'while', 'for', 'to', 'do', 'end', 'swap', 'return', 'and', 'not', 'var', 'each', 'in'];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    html = html.replace(keywordRegex, '<span class="text-blue-400">$1</span>');
    
    // Numbers
    html = html.replace(/\b(\d+)\b/g, '<span class="text-emerald-400">$1</span>');
    
    // Comments
    html = html.replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="text-neutral-500 italic">$1</span>');

    return html;
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#1e1e1e] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/5">
        <span className="text-xs font-mono text-neutral-400">Pseudo-code</span>
        <button 
          onClick={handleCopy}
          className="text-neutral-400 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed text-neutral-300">
          <code>
            {code.split('\n').map((line, i) => (
              <div key={i} className="flex">
                <span className="w-8 shrink-0 text-neutral-600 select-none text-right mr-4">{i + 1}</span>
                <span dangerouslySetInnerHTML={{ __html: highlightCode(line) }} />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};
