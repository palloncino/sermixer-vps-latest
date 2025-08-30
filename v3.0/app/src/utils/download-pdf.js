export const handleDownloadPdf = async (url, filename = "quote.pdf") => {
  try {
    // Fetching the file as a blob
    const response = await fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/pdf'
      }),
      mode: 'cors' // Ensure CORS mode is set if cross-origin requests are involved
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Failed to download PDF:", error);
  }
};
