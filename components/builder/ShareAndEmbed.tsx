import React, { useMemo } from 'react';
import { Button, Input } from '../ui';
import { CloudArrowDownIcon } from '../icons';
import { type QuizConfig } from '../../types';

interface ShareAndEmbedProps {
  config: QuizConfig;
}

export const ShareAndEmbed: React.FC<ShareAndEmbedProps> = ({ config }) => {
  const { shareUrl, embedCode } = useMemo(() => {
    try {
      const jsonConfig = JSON.stringify(config);
      // Use encodeURIComponent directly instead of btoa for better URL compatibility
      const encodedConfig = encodeURIComponent(jsonConfig);
      const baseUrl = window.location.href.split('#')[0].split('?')[0];
      const url = `${baseUrl}?config=${encodedConfig}`;
      const embed = `<iframe src="${url}" width="100%" height="700" frameborder="0" title="Interactive Funnel"></iframe>`;
      return { shareUrl: url, embedCode: embed };
    } catch (error) {
      console.error("Failed to generate share link", error);
      return { shareUrl: 'Error generating link.', embedCode: 'Error generating embed code.' };
    }
  }, [config]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
  };

  const handleDownloadHtml = () => {
    const fullScreenEmbedCode = `<iframe src="${shareUrl}" title="Interactive Funnel"></iframe>`;
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Funnel</title>
    <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
        iframe { width: 100%; height: 100%; border: none; display: block; }
    </style>
</head>
<body>
    ${fullScreenEmbedCode}
</body>
</html>
    `;
    const blob = new Blob([htmlContent.trim()], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'funnel.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Shareable Link</label>
        <div className="flex">
          <input
            type="text"
            readOnly
            value={shareUrl}
            title="Shareable link for your funnel"
            aria-label="Shareable link for your funnel"
            className="flex-grow bg-gray-50 border border-gray-300 rounded-l-lg py-2 px-3 text-gray-600 text-sm"
          />
          <Button
            variant="secondary"
            onClick={() => copyToClipboard(shareUrl)}
            className="rounded-l-none border-l-0"
          >
            Copy
          </Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Embed Code</label>
        <div className="flex">
          <input
            type="text"
            readOnly
            value={embedCode}
            title="Embed code for your funnel"
            aria-label="Embed code for your funnel"
            className="flex-grow bg-gray-50 border border-gray-300 rounded-l-lg py-2 px-3 text-gray-600 text-sm font-mono"
          />
          <Button
            variant="secondary"
            onClick={() => copyToClipboard(embedCode)}
            className="rounded-l-none border-l-0"
          >
            Copy
          </Button>
        </div>
      </div>

      <Button
        onClick={handleDownloadHtml}
        variant="secondary"
        className="w-full"
      >
        <CloudArrowDownIcon className="w-5 h-5 mr-2" />
        Download HTML
      </Button>
    </div>
  );
};