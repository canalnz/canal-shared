import {PubSub, Subscription, Topic} from '@google-cloud/pubsub';
import {hostname} from 'os';

// Defaulting to random is weird, but probably the best option
const HOSTNAME = hostname() || Math.random().toString(36).substr(2);
const ENV = process.env.NODE_ENV || 'development';

// Singleton time!
let _pubsub: PubSub;

// Probably (?) best to cache it, right?
const topicCache: Map<string, Topic> = new Map();
function getTopic(name: string): Topic {
  if (!name) {
    throw new Error('A name must be specified for a topic.');
  }
  if (!_pubsub) {
    throw new Error('Trying to get a topic before initialisation!');
  }
  if (topicCache.has(name)) return topicCache.get(name);
  else {
    const t = _pubsub.topic(name);
    topicCache.set(name, t);
    return t;
  }
}

export async function getSubscription(topicName: string, subName?: string): Promise<Subscription> {
  subName = subName || topicName + '-' + ENV + '-' + HOSTNAME;
  try {
    const sub = _pubsub.subscription(subName);
    await sub.get();
    return sub;
  } catch (e) {
    console.debug('Couldn\'t find existing subscription, creating one:', subName);
    const topic = getTopic(topicName);
    const [sub, ] = await _pubsub.createSubscription(topic, subName, {
      messageRetentionDuration: 10 * 60,
      ackDeadlineSeconds: 10,
      expirationPolicy: {
        ttl: {seconds: 24 * 60 * 60}
      }
    });
    return sub;
  }
}

export function setup(opts?: any) {
  _pubsub = new PubSub(opts);
}
export const scriptUpdateType = {
  Create: 'CREATE',
  Restart: 'RESTART',
  Remove: 'REMOVE',
};

export const pubsub = {
  setup,
  getSubscription,
  topic: getTopic,
  scriptUpdateType
};
