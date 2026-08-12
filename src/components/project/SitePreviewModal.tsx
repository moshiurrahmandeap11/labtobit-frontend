"use client";

import { useEffect, useState } from "react";
import { MacPreviewModal } from "./MacPreviewModal";
import { IPhonePreviewModal } from "./IPhonePreviewModal";

interface SitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSlug: string;
}

export function SitePreviewModal({ isOpen, onClose, initialSlug }: SitePreviewModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen || !isMounted) return null;

  return isMobile ? (
    <IPhonePreviewModal isOpen={isOpen} onClose={onClose} initialSlug={initialSlug} />
  ) : (
    <MacPreviewModal isOpen={isOpen} onClose={onClose} initialSlug={initialSlug} />
  );
}
