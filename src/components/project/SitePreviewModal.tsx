"use client";

import { useEffect, useState } from "react";
import { MacPreviewModal } from "./MacPreviewModal";
import { IPhonePreviewModal } from "./IPhonePreviewModal";

import { IPadPreviewModal } from "./IPadPreviewModal";

interface SitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSlug: string;
}

export function SitePreviewModal({ isOpen, onClose, initialSlug }: SitePreviewModalProps) {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width >= 768 && width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen || !isMounted) return null;

  if (deviceType === 'mobile') {
    return <IPhonePreviewModal isOpen={isOpen} onClose={onClose} initialSlug={initialSlug} />;
  }
  
  if (deviceType === 'tablet') {
    return <IPadPreviewModal isOpen={isOpen} onClose={onClose} initialSlug={initialSlug} />;
  }

  return <MacPreviewModal isOpen={isOpen} onClose={onClose} initialSlug={initialSlug} />;
}
