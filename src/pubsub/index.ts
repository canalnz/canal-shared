import {PubSub, Topic} from '@google-cloud/pubsub';

// Singleton time!
let _pubsub: PubSub;

// Probably (?) best to cache it, right?
const topicCache: Map<string, Topic> = new Map();
export function topic(name: string): Topic {
  if (!name) {
    throw new Error('A name must be specified for a topic.');
  }
  if (!_pubsub) {
    throw new Error('Trying to get a topic before initialisation!');
  }
  if (topicCache.has(name)) topicCache.get(name);
  else {
    const t = pubsub.topic(name);
    topicCache.set(name, t);
    return t;
  }
}

export function setup(projectOrOpts: string | any) {
  if (typeof projectOrOpts === 'string') projectOrOpts = {projectId: projectOrOpts};
  _pubsub = new PubSub(projectOrOpts);
}
export const scriptUpdateType = {
  Create: 'CREATE',
  Restart: 'RESTART',
  Remove: 'REMOVE',
};

export const pubsub = {
  setup,
  topic,
  scriptUpdateType
};
