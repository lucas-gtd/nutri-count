import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const scanner = new Html5Qrcode('barcode-reader');
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          scanner.stop().then(() => {
            onScan(decodedText);
          });
        },
        () => {},
      )
      .catch((err) => {
        setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
        console.error(err);
      });

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Scanner un code-barre</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          {error ? (
            <div className="text-red-600 text-sm text-center py-8">{error}</div>
          ) : (
            <div id="barcode-reader" className="w-full" />
          )}
          <p className="text-sm text-gray-500 text-center mt-3">
            Placez le code-barre devant la caméra
          </p>
        </div>
      </div>
    </div>
  );
}
