import React from 'react';
import { ExternalLink } from 'lucide-react';

interface DocumentationBannerProps {
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

const DocumentationBanner: React.FC<DocumentationBannerProps> = ({
  title,
  description,
  linkText,
  linkUrl,
}) => {
  return (
    <div className="rounded-md bg-blue-50 p-4">
      <div className="flex">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-800">{title}</h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>{description}</p>
          </div>
          <div className="mt-3">
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-blue-800 hover:text-blue-600"
            >
              {linkText}
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationBanner;