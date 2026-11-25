import { javaTopicsData } from "@/app/topic/java/page";
import { pythonTopicsData } from "@/app/topic/python/page";
import { cTopicsData } from "@/app/topic/c/page";
import { cppTopicsData } from "@/app/topic/cpp/page";
import { sqlTopicsData } from "@/app/topic/sql/page";
import { htmlTopicsData } from "@/app/topic/html/page";
import { cssTopicsData } from "@/app/topic/css/page";
import { javascriptTopicsData } from "@/app/topic/javascript/page";
import { reactTopicsData } from "@/app/topic/react/page";
import { nodeTopicsData } from "@/app/topic/node/page";
import { j2eeTopicsData } from "@/app/topic/j2ee/page";
import { kotlinTopicsData } from "@/app/topic/kotlin/page";
import { djangoTopicsData } from "@/app/topic/django/page";
import { swiftTopicsData } from "@/app/topic/swift/page";
import { rustTopicsData } from "@/app/topic/rust/page";
import { goTopicsData } from "@/app/topic/go/page";
import { rubyTopicsData } from "@/app/topic/ruby/page";
import { mongodbTopicsData } from "@/app/topic/mongodb/page";

export type RelatedTopic = { label: string; path: string };
type TopicSection = { heading: string; topics: RelatedTopic[] };

// ====================== SUBJECT REGISTRY ======================
// Naya subject add karna ho to bas yahan ek line add karo
const SUBJECT_TOPICS: Record<string, TopicSection[]> = {
  java: javaTopicsData,
  python: pythonTopicsData,
  c: cTopicsData,
  cpp: cppTopicsData,
  sql: sqlTopicsData,
  html: htmlTopicsData,
  css: cssTopicsData,
  javascript: javascriptTopicsData,
  react: reactTopicsData,
  node: nodeTopicsData,
  j2ee: j2eeTopicsData,
  kotlin: kotlinTopicsData,
  django: djangoTopicsData,
  swift: swiftTopicsData,
  rust: rustTopicsData,
  go: goTopicsData,
  ruby: rubyTopicsData,
  mongodb: mongodbTopicsData,
};

const flattenTopics = (data: TopicSection[]): RelatedTopic[] =>
  data.flatMap((section) => section.topics);

const stringToSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
};

const mulberry32 = (seed: number) => {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const seededShuffle = <T,>(arr: T[], seed: number): T[] => {
  const array = [...arr];
  const random = mulberry32(seed);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/**
 * Subject-aware, SEO-safe related articles.
 * @param subject - jaise "java", "python", "c" (SUBJECT_CONFIG ki key)
 * @param currentPath - current article ka path (self-link exclude karne ke liye)
 * @param count - kitne related articles chahiye (default 8)
 */
export const getSeededRelatedArticles = (
  subject: string,
  currentPath: string,
  count: number = 10
): RelatedTopic[] => {
  const topicsData = SUBJECT_TOPICS[subject] ?? SUBJECT_TOPICS["java"];
  const pool = flattenTopics(topicsData).filter((t) => t.path !== currentPath);
  const seed = stringToSeed(currentPath || subject);
  return seededShuffle(pool, seed).slice(0, count);
};