"use client";

import Icon from "@/src/components/ui/Icon";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { memo } from "react";

function MediaGallery({ images = [], editable = false, onRemove }) {
    const [emblaRef] = useEmblaCarousel({ dragFree: true });

    if (!images?.length) return null;

    return (
        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {images.map((img, idx) => (
                        <div className="embla__slide pr-2 max-w-9/12" key={img.url + idx}>
                            <div className="relative">
                                <Image
                                    src={img.url}
                                    alt={img.meta?.title || `media-${idx}`}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="w-full h-auto object-contain rounded-xl cursor-pointer"
                                    priority={idx === 0}
                                />

                                {editable && (
                                    <button
                                        type="button"
                                        aria-label={`remove-${idx}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onRemove?.(idx);
                                        }}
                                        className="absolute top-2 right-2 bg-black/70 backdrop-blur-md hover:bg-white/50 text-white hover:text-black p-2 rounded-full cursor-pointer z-10 transition-colors"
                                    >
                                        <Icon name="x-mark" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default memo(MediaGallery);
