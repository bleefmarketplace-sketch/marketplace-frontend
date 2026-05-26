"use client";

import React, { useEffect, useRef, useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Camera, RefreshCw, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";

interface CameraCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (file: File) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
    isOpen,
    onClose,
    onCapture,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const startCamera = async () => {
        setLoading(true);
        setError(null);
        try {
            // Stop any existing stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play().catch((err) => console.log("Play failed: ", err));
            }
            setLoading(false);
        } catch (err: any) {
            console.error("Camera access failed:", err);
            setError("Could not access camera. Please verify camera permissions in your browser settings.");
            setLoading(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    };

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => {
            stopCamera();
        };
    }, [isOpen]);

    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const context = canvas.getContext("2d");
            if (context) {
                // Set canvas size matching the video resolution
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 480;

                // Draw current video frame onto canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert to Blob and then File
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], `camera_capture_${Date.now()}.jpg`, {
                            type: "image/jpeg",
                        });
                        onCapture(file);
                        stopCamera();
                        onClose();
                    }
                }, "image/jpeg", 0.9);
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Terminal Live Camera capture">
            <div className="space-y-4 font-mono text-xs text-zinc-900 leading-normal">
                {/* Visual Telemetry Guard */}
                <div className="bg-zinc-50 border border-zinc-200 p-3 flex items-center justify-between">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 flex items-center gap-1.5 leading-none">
                        <ShieldCheck size={13} className="text-green-700 animate-pulse" />
                        Live Frame Sensor Capture
                    </span>
                    <button
                        onClick={startCamera}
                        disabled={loading}
                        className="text-zinc-500 hover:text-zinc-900 flex items-center gap-1 uppercase text-[9px] font-bold tracking-wider cursor-pointer disabled:opacity-40"
                    >
                        <RefreshCw size={11} className={loading ? "animate-spin" : ""} /> Retry Sensor
                    </button>
                </div>

                {/* Stream / Frame Window */}
                <div className="relative aspect-video w-full bg-zinc-950 border border-zinc-200 overflow-hidden flex items-center justify-center">
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-zinc-400">
                            <Loader2 className="animate-spin text-green-700 mb-2" size={24} />
                            <span className="text-[9px] uppercase font-bold tracking-widest">Hydrating Optical Feeds...</span>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 p-6 flex flex-col items-center justify-center bg-zinc-955 text-center text-red-700">
                            <AlertTriangle className="mb-2" size={24} />
                            <p className="text-[10px] uppercase font-bold tracking-wider max-w-xs">{error}</p>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        playsInline
                        muted
                        className={`w-full h-full object-cover transform scale-x-[-1] ${loading || error ? "hidden" : "block"}`}
                    />
                </div>

                {/* Canvas Buffer */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Actions Block */}
                <div className="flex gap-3 pt-2 border-t border-zinc-150 justify-end">
                    <Button variant="ghost" className="rounded-none text-[10px]" onClick={onClose}>
                        Abort Capture
                    </Button>
                    <Button
                        onClick={handleCapture}
                        disabled={loading || !!error}
                        className="min-w-36 rounded-none text-[10px] uppercase font-bold tracking-wider"
                    >
                        <Camera size={14} className="mr-1.5" /> Trigger Capture
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
