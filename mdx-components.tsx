import type { MDXComponents } from 'mdx/types'

// Function to convert text to URL-friendly slug
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Helper function to extract text content from React children
function getTextContent(children: any): string {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(getTextContent).join('');
  }
  if (children?.props?.children) {
    return getTextContent(children.props.children);
  }
  return '';
}

// Helper function to handle smooth scroll with offset for sticky headers
function scrollToHeading(id: string) {
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 120; // Account for sticky header + breadcrumb
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Update URL hash
    window.history.replaceState(null, '', `#${id}`);
  }
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom components for MDX
    h1: ({ children }) => {
      const id = slugify(getTextContent(children));
      return (
        <h1 id={id} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 group">
          <button 
            onClick={() => scrollToHeading(id)}
            className="inline-flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {children}
            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 dark:text-blue-400">#</span>
          </button>
        </h1>
      );
    },
    h2: ({ children }) => {
      const id = slugify(getTextContent(children));
      return (
        <h2 id={id} className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 group">
          <button 
            onClick={() => scrollToHeading(id)}
            className="inline-flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {children}
            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 dark:text-blue-400">#</span>
          </button>
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = slugify(getTextContent(children));
      return (
        <h3 id={id} className="text-lg font-medium text-gray-900 dark:text-white mt-4 mb-2 group">
          <button 
            onClick={() => scrollToHeading(id)}
            className="inline-flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {children}
            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 dark:text-blue-400">#</span>
          </button>
        </h3>
      );
    },
    p: ({ children }) => (
      <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 pl-6 py-4 my-6 italic text-gray-800 dark:text-gray-200">
        {children}
      </blockquote>
    ),
    code: ({ children, className }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
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
      <pre className="bg-gray-900 dark:bg-black text-gray-100 dark:text-gray-100 p-4 rounded-lg overflow-x-auto my-6 border border-gray-200 dark:border-gray-700">
        {children}
      </pre>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 my-4 ml-4 text-gray-700 dark:text-gray-300">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 my-4 ml-4 text-gray-700 dark:text-gray-300">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-gray-700 dark:text-gray-300">
        {children}
      </li>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">
        {children}
      </td>
    ),
    ...components,
  }
}