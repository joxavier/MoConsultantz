import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../socials.module.css';
import Link from 'next/link';

interface FeedProps {
  imageData?: ImageData[];
}

interface ImageData {
  sourceNetwork: string;
  id: string;
  relatedProducts: string[];
  timestamp: string;
  authorId: string;
  contentSrc: string;
  thumbnailURL: string;
  review?: string;
  reviewer?: string;
}

const Feed: React.FC<FeedProps> = ({ imageData = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : imageData.length - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex < imageData.length - 1 ? prevIndex + 1 : 0));
  };

  const sortedImageData = [...imageData].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (!sortedImageData || sortedImageData.length === 0) {
    return <p className={styles.feedNotAvailable}>Feed not available</p>;
  }

  return (

      <div className={styles.carouselContainer}>
        <div className={styles.imageGrid}>
          {sortedImageData.slice(currentIndex, currentIndex + 3).map((item, index) => (
            <div key={item.id} className={styles.imageItem}>
              {item.sourceNetwork === 'tik-tok'  ? (
                <Link href={item.contentSrc} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={item.thumbnailURL}//`/api/getImage?url=${encodeURIComponent(item.thumbnailURL)}`}
                    alt={`Image ${index + 1}`}
                    width={108}
                    height={192}
                  />
                </Link>
              ) : (
                <div className={styles.reviewTextBox}>
                  <p>{item.review}</p>
                  <p>{`~${item.reviewer}`}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div>
          <button className={styles.prevButton} onClick={handlePrevClick}>
            ←
          </button>
          <button className={styles.nextButton} onClick={handleNextClick}>
            →
          </button>
        </div>
      </div>

  );
};

export default Feed;
