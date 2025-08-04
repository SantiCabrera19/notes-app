import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '' 
}) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold text-white mb-4 mt-6 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold text-white mb-3 mt-5">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-bold text-white mb-3 mt-4">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-bold text-white mb-2 mt-3">
            {children}
          </h4>
        ),
        h5: ({ children }) => (
          <h5 className="text-base font-bold text-white mb-2 mt-3">
            {children}
          </h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-sm font-bold text-white mb-2 mt-3">
            {children}
          </h6>
        ),
        p: ({ children }) => (
          <p className="text-gray-300 leading-relaxed mb-4">
            {children}
          </p>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-white">
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-200">
            {children}
          </em>
        ),
        code: ({ children, className }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="bg-gray-800 text-blue-300 px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            );
          }
          return (
            <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-x-auto mb-4">
              <code className="text-gray-200 text-sm font-mono">
                {children}
              </code>
            </pre>
          );
        },
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-900/20 rounded-r-lg">
            <p className="text-gray-300 italic">
              {children}
            </p>
          </blockquote>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-1">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-1">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-gray-300 ml-2">
            {children}
          </li>
        ),
        a: ({ href, children }) => (
          <a 
            href={href} 
            className="text-blue-400 hover:text-blue-300 underline transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        img: ({ src, alt }) => (
          <img 
            src={src} 
            alt={alt} 
            className="max-w-full h-auto rounded-lg border border-gray-700 my-4"
          />
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border border-gray-700 rounded-lg">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-800">
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          <tbody className="bg-gray-900">
            {children}
          </tbody>
        ),
        tr: ({ children }) => (
          <tr className="border-b border-gray-700">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left text-white font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-gray-300">
            {children}
          </td>
        ),
        hr: () => (
          <hr className="border-gray-700 my-6" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}; 