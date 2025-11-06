"use client";

import Icon from "@/components/Icon";
import useEmblaCarousel from "embla-carousel-react";

function MediaGallery({ images = [], editable = false, onRemove }) {
    const [emblaRef] = useEmblaCarousel({ dragFree: true });

    return (
        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {images.map((img, idx) => (
                        <div className="embla__slide pr-2 max-w-9/12" key={idx}>
                            <div className="relative">
                                <img src={img.url}
                                     alt={img.meta?.title || `media-${idx}`}
                                     className="embla__slide__number object-contain w-full rounded-xl"
                                />
                                {editable && (
                                    <button
                                        aria-label={`remove-${idx}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove?.(idx);
                                        }}
                                        className="absolute top-2 right-2 bg-black/70 backdrop-blur-md hover:bg-white/50 text-white hover:text-black p-2 rounded-full cursor-pointer"
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

export default MediaGallery;
