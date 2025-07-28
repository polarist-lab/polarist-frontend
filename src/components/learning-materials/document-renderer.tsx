'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { DocumentMaterial, LearningContext } from '@/lib/content-types';
import { BreadcrumbNav } from '@/components/navigation/breadcrumb-nav';
import { Locale } from '@/lib/i18n/config';
import { useRouter } from 'next/navigation';

interface DocumentRendererProps {
  material: DocumentMaterial;
  context: LearningContext;
  locale: Locale;
}

export function DocumentRenderer({ material, context, locale }: DocumentRendererProps) {
  const router = useRouter();

  const handleNext = () => {
    if (context.nextMaterial) {
      router.push(context.nextMaterial.href);
    }
  };

  const handlePrevious = () => {
    if (context.previousMaterial) {
      router.push(context.previousMaterial.href);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Document Header */}
      <div className="px-8 py-8 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {material.title}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {material.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>⏱️ {material.estimatedTime} min read</span>
          <span className="capitalize">📚 {material.difficulty}</span>
          <div className="flex gap-1">
            {material.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex">
        {/* Table of Contents (if available) */}
        {material.content.tableOfContents && material.content.tableOfContents.length > 0 && (
          <div className="hidden lg:block w-64 flex-shrink-0 border-r border-gray-200">
            <div className="sticky top-0 p-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Contents</h3>
              <nav className="space-y-1">
                {material.content.tableOfContents.map((item, index) => (
                  <a
                    key={index}
                    href={`#${item.anchor}`}
                    className={`block text-xs hover:text-blue-600 transition-colors duration-200 cursor-pointer ${
                      item.level === 1 ? 'font-medium text-gray-900 py-1' :
                      item.level === 2 ? 'ml-3 text-gray-600 py-0.5 hover:text-gray-800' :
                      'ml-6 text-gray-500 py-0.5 hover:text-gray-700'
                    }`}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Document Content */}
        <div className="flex-1 px-8 py-8">

              {/* Markdown Content */}
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    // Custom styling for Korean text
                    p: ({ children }) => (
                      <p className="mb-6 leading-relaxed text-gray-700">
                        {children}
                      </p>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                        {children}
                      </h3>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-200 bg-blue-50 pl-6 py-4 my-6 italic text-blue-800">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className;
                      if (isInline) {
                        return (
                          <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code className={className}>
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
                        {children}
                      </pre>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-2 my-4 ml-4">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-2 my-4 ml-4">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-700">
                        {children}
                      </li>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full border border-gray-200 rounded-lg">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="bg-gray-50 border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {material.content.markdown}
                </ReactMarkdown>
              </div>

          {/* Next.js Docs Style Navigation */}
          <div className="flex items-center justify-between mt-16 pt-8 border-t border-gray-200">
            {/* Previous Button */}
            {context.previousMaterial ? (
              <button
                onClick={handlePrevious}
                className="group flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 max-w-sm"
              >
                <svg className="w-5 h-5 text-gray-400 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                    Previous
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {context.previousMaterial.title}
                  </div>
                </div>
              </button>
            ) : (
              <div></div>
            )}

            {/* Next Button */}
            {context.nextMaterial ? (
              <button
                onClick={handleNext}
                className="group flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 max-w-sm"
              >
                <div className="text-right">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                    Next
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {context.nextMaterial.title}
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}