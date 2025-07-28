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
        <h1 id={id} className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mt-8 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2 group">
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
        <h2 id={id} className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mt-6 mb-3 group">
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
        <h3 id={id} className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mt-4 mb-2 group">
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
      <p className="mb-6 leading-relaxed text-neutral-700 dark:text-neutral-300">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 pl-6 py-4 my-6 italic text-neutral-800 dark:text-neutral-200">
        {children}
      </blockquote>
    ),
    code: ({ children, className }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-1.5 py-0.5 rounded text-sm font-mono">
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
      <pre className="bg-neutral-900 dark:bg-neutral-950 text-neutral-100 dark:text-neutral-100 p-4 rounded-lg overflow-x-auto my-6 border border-neutral-200 dark:border-neutral-800">
        {children}
      </pre>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 my-4 ml-4 text-neutral-700 dark:text-neutral-300">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 my-4 ml-4 text-neutral-700 dark:text-neutral-300">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-neutral-700 dark:text-neutral-300">
        {children}
      </li>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border border-neutral-200 dark:border-neutral-700 rounded-lg">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3 text-left font-semibold text-neutral-900 dark:text-neutral-50">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-b border-neutral-200 dark:border-neutral-700 px-4 py-3 text-neutral-700 dark:text-neutral-300">
        {children}
      </td>
    ),
    ...components,
  }
}