import { Boom } from '@hapi/boom';
import { QueryIds, XWAPaths } from '../Types/index.js';
import { getUrlFromDirectPath, decryptMessageNode, generateMessageID } from '../Utils/index.js';
import { generateProfilePicture } from '../Utils/messages-media.js';
import { getAllBinaryNodeChildren, getBinaryNodeChild, getBinaryNodeChildren, S_WHATSAPP_NET } from '../WABinary/index.js';
import { makeGroupsSocket } from './groups.js';

const wMexQuery = (variables, queryId, query, generateMessageTag) => {
  return query({
    tag: 'iq',
    attrs: {
      id: generateMessageTag(),
      type: 'get',
      to: S_WHATSAPP_NET,
      xmlns: 'w:mex'
    },
    content: [
      {
        tag: 'query',
        attrs: { query_id: queryId },
        content: Buffer.from(JSON.stringify({ variables }), 'utf-8')
      }
    ]
  });
};

const executeWMexQuery = async (variables, queryId, dataPath, query, generateMessageTag) => {
  const result = await wMexQuery(variables, queryId, query, generateMessageTag);
  const child = getBinaryNodeChild(result, 'result');
  if (child?.content) {
    const data = JSON.parse(child.content.toString());
    if (data.errors && data.errors.length > 0) {
      const errorMessages = data.errors.map((err) => err.message || 'Unknown error').join(', ');
      const firstError = data.errors[0];
      const errorCode = firstError.extensions?.error_code || 400;
      throw new Boom(`GraphQL server error: ${errorMessages}`, {
        statusCode: errorCode,
        data: firstError
      });
    }
    const response = dataPath ? data?.data?.[dataPath] : data?.data;
    if (typeof response !== 'undefined') {
      return response;
    }
  }
  const action = (dataPath || '').startsWith('xwa2_')
    ? dataPath.substring(5).replace(/_/g, ' ')
    : dataPath?.replace(/_/g, ' ');
  throw new Boom(`Failed to ${action}, unexpected response structure.`, {
    statusCode: 400,
    data: result
  });
};

export const makeNewsletterSocket = (config) => {
  const sock = makeGroupsSocket(config);
  const { authState, signalRepository, query, generateMessageTag } = sock;
  const encoder = new TextEncoder();

  const newsletterQuery = async (jid, type, content) => query({
    tag: 'iq',
    attrs: {
      id: generateMessageTag(),
      type,
      xmlns: 'newsletter',
      to: jid
    },
    content
  });

  const newsletterWMexQuery = async (jid, queryId, content) => query({
    tag: 'iq',
    attrs: {
      id: generateMessageTag(),
      type: 'get',
      xmlns: 'w:mex',
      to: S_WHATSAPP_NET
    },
    content: [
      {
        tag: 'query',
        attrs: { query_id: queryId },
        content: encoder.encode(JSON.stringify({
          variables: {
            newsletter_id: jid,
            ...content
          }
        }))
      }
    ]
  });

  const parseFetchedUpdates = async (node, type) => {
    let child;
    if (type === 'messages') {
      child = getBinaryNodeChild(node, 'messages');
    } else {
      const parent = getBinaryNodeChild(node, 'message_updates');
      child = getBinaryNodeChild(parent, 'messages');
    }
    return Promise.all(getAllBinaryNodeChildren(child).map(async (messageNode) => {
      messageNode.attrs.from = child?.attrs?.jid;
      const views = parseInt(getBinaryNodeChild(messageNode, 'views_count')?.attrs?.count || '0');
      const reactionNode = getBinaryNodeChild(messageNode, 'reactions');
      const reactions = getBinaryNodeChildren(reactionNode, 'reaction').map(({ attrs }) => ({
        count: +attrs.count,
        code: attrs.code
      }));
      const data = {
        server_id: messageNode.attrs.server_id,
        views,
        reactions
      };
      if (type === 'messages') {
        const { fullMessage: message, decrypt } = await decryptMessageNode(
          messageNode,
          authState.creds.me.id,
          authState.creds.me.lid || '',
          signalRepository,
          config.logger
        );
        await decrypt();
        data.message = message;
      }
      return data;
    }));
  };

  return {
    ...sock,
    newsletterFetchAllSubscribe: async () => {
      return executeWMexQuery(
        {},
        '6388546374527196',
        'xwa2_newsletter_subscribed',
        query,
        generateMessageTag
      );
    },
    subscribeNewsletterUpdates: async (jid) => {
      const result = await newsletterQuery(jid, 'set', [{ tag: 'live_updates', attrs: {}, content: [] }]);
      return getBinaryNodeChild(result, 'live_updates')?.attrs;
    },
    newsletterReactionMode: async (jid, mode) => {
      await newsletterWMexQuery(jid, QueryIds.JOB_MUTATION || '7341777602580933', {
        updates: {
          settings: {
            reaction_codes: {
              value: mode
            }
          }
        }
      });
    },
    newsletterUpdateDescription: async (jid, description) => {
      await newsletterWMexQuery(jid, QueryIds.JOB_MUTATION || '7341777602580933', {
        updates: {
          description: description || '',
          settings: null
        }
      });
    },
    cekIDSaluran: async (url) => {
      let channelId;
      if (url.includes('whatsapp.com/channel/')) {
        channelId = url.split('whatsapp.com/channel/')[1].split('/')[0];
      } else if (url.includes('wa.me/channel/')) {
        channelId = url.split('wa.me/channel/')[1].split('/')[0];
      } else {
        channelId = url;
      }
      const result = await newsletterWMexQuery(undefined, QueryIds.METADATA, {
        input: {
          key: channelId,
          type: 'INVITE',
          view_role: 'GUEST'
        },
        fetch_viewer_metadata: true,
        fetch_full_image: true,
        fetch_creation_time: true
      });
      const resultNode = getBinaryNodeChild(result, 'result');
      if (!resultNode?.content) {
        throw new Boom('No result content in response', {
          statusCode: 400,
          data: result
        });
      }
      const resultString = resultNode.content.toString();
      const parsedResult = JSON.parse(resultString);
      if (!parsedResult?.data) {
        throw new Boom('No data field in response', {
          statusCode: 400,
          data: parsedResult
        });
      }
      const metadataPath = parsedResult.data[XWAPaths.xwa2_newsletter_metadata || 'xwa2_newsletter'];
      if (!metadataPath) {
        throw new Boom('Newsletter not found or access denied', {
          statusCode: 404,
          data: parsedResult.data
        });
      }
      const metadata = {
        id: metadataPath?.id,
        state: metadataPath?.state?.type,
        creation_time: +metadataPath?.thread_metadata?.creation_time || 0,
        name: metadataPath?.thread_metadata?.name?.text,
        nameTime: +metadataPath?.thread_metadata?.name?.update_time || 0,
        description: metadataPath?.thread_metadata?.description?.text,
        descriptionTime: +metadataPath?.thread_metadata?.description?.update_time || 0,
        invite: metadataPath?.thread_metadata?.invite,
        picture: getUrlFromDirectPath(metadataPath?.thread_metadata?.picture?.direct_path || ''),
        preview: getUrlFromDirectPath(metadataPath?.thread_metadata?.preview?.direct_path || ''),
        reaction_codes: metadataPath?.thread_metadata?.settings?.reaction_codes?.value,
        subscribers: +metadataPath?.thread_metadata?.subscribers_count || 0,
        verification: metadataPath?.thread_metadata?.verification,
        viewer_metadata: metadataPath?.viewer_metadata
      };
      return JSON.stringify(metadata, null, 2);
    },
    newsletterUpdateName: async (jid, name) => {
      await newsletterWMexQuery(jid, QueryIds.JOB_MUTATION || '7341777602580933', {
        updates: { name, settings: null }
      });
    },
    newsletterUpdatePicture: async (jid, content) => {
      const { img } = await generateProfilePicture(content);
      await newsletterWMexQuery(jid, QueryIds.JOB_MUTATION || '7341777602580933', {
        updates: { picture: img.toString('base64'), settings: null }
      });
    },
    newsletterRemovePicture: async (jid) => {
      await newsletterWMexQuery(jid, QueryIds.JOB_MUTATION || '7341777602580933', {
        updates: { picture: '', settings: null }
      });
    },
    newsletterUnfollow: async (jid) => {
      await newsletterWMexQuery(jid, QueryIds.UNFOLLOW);
    },
    newsletterFollow: async (jid) => {
      await newsletterWMexQuery(jid, QueryIds.FOLLOW);
    },
    newsletterMultipleFollow: async (jids) => {
      if (typeof jids !== 'string') {
        throw new Error('Not a valid jid list, example: sock.newsletterMultipleFollow("12036@newsletter 12036@newsletter")');
      }
      const jidArray = jids.split(/\s+/);
      for (const id of jidArray) {
        await newsletterWMexQuery(id, QueryIds.FOLLOW);
        await new Promise((resolve) => setTimeout(resolve, 550));
      }
    },
    newsletterUnmute: async (jid) => {
      await newsletterWMexQuery(jid, QueryIds.UNMUTE);
    },
    newsletterMute: async (jid) => {
      await newsletterWMexQuery(jid, QueryIds.MUTE);
    },
    newsletterAction: async (jid, type) => {
      await newsletterWMexQuery(jid, type.toUpperCase());
    },
    newsletterCreate: async (name, description, reaction_codes = '') => {
      await query({
        tag: 'iq',
        attrs: {
          to: S_WHATSAPP_NET,
          xmlns: 'tos',
          id: generateMessageTag(),
          type: 'set'
        },
        content: [
          {
            tag: 'notice',
            attrs: {
              id: '20601218',
              stage: '5'
            },
            content: []
          }
        ]
      });
      const result = await newsletterWMexQuery(undefined, QueryIds.CREATE, {
        input: {
          name,
          description,
          settings: {
            reaction_codes: {
              value: reaction_codes.toUpperCase()
            }
          }
        }
      });
      return extractNewsletterMetadata(result, true);
    },
    newsletterMetadata: async (type, key, role) => {
      const result = await newsletterWMexQuery(undefined, QueryIds.METADATA, {
        input: {
          key,
          type: type.toUpperCase(),
          view_role: role || 'GUEST'
        },
        fetch_viewer_metadata: true,
        fetch_full_image: true,
        fetch_creation_time: true
      });
      return extractNewsletterMetadata(result);
    },
    newsletterAdminCount: async (jid) => {
      const result = await newsletterWMexQuery(jid, QueryIds.ADMIN_COUNT);
      const buff = getBinaryNodeChild(result, 'result')?.content?.toString();
      return JSON.parse(buff).data[XWAPaths.xwa2_newsletter_admin_count || 'xwa2_newsletter_admin'].admin_count;
    },
    newsletterChangeOwner: async (jid, user) => {
      await newsletterWMexQuery(jid, QueryIds.CHANGE_OWNER, {
        user_id: user
      });
    },
    newsletterDemote: async (jid, user) => {
      await newsletterWMexQuery(jid, QueryIds.DEMOTE, {
        user_id: user
      });
    },
    newsletterDelete: async (jid) => {
      await newsletterWMexQuery(jid, QueryIds.DELETE);
    },
    newsletterReactMessage: async (jid, serverId, code) => {
      await query({
        tag: 'message',
        attrs: {
          to: jid,
          ...(!code ? { edit: '7' } : {}),
          type: 'reaction',
          server_id: serverId,
          id: generateMessageID()
        },
        content: [
          {
            tag: 'reaction',
            attrs: code ? { code } : {}
          }
        ]
      });
    },
    newsletterFetchMessages: async (type, key, count, after) => {
      const result = await newsletterQuery(S_WHATSAPP_NET, 'get', [
        {
          tag: 'messages',
          attrs: {
            type,
            ...(type === 'invite' ? { key } : { jid: key }),
            count: count.toString(),
            after: after?.toString() || '100'
          }
        }
      ]);
      return parseFetchedUpdates(result, 'messages');
    },
    newsletterFetchUpdates: async (jid, count, after, since) => {
      const result = await newsletterQuery(jid, 'get', [
        {
          tag: 'message_updates',
          attrs: {
            count: count.toString(),
            after: after?.toString() || '100',
            since: since?.toString() || '0'
          }
        }
      ]);
      return parseFetchedUpdates(result, 'updates');
    }
  };
};

export const extractNewsletterMetadata = (node, isCreate) => {
  const result = getBinaryNodeChild(node, 'result')?.content?.toString();
  const metadataPath = JSON.parse(result).data[isCreate ? (XWAPaths.xwa2_newsletter_create || 'xwa2_newsletter_create') : (XWAPaths.xwa2_newsletter_metadata || 'xwa2_newsletter')];
  return {
    id: metadataPath?.id,
    state: metadataPath?.state?.type,
    creation_time: +metadataPath?.thread_metadata?.creation_time,
    name: metadataPath?.thread_metadata?.name?.text,
    nameTime: +metadataPath?.thread_metadata?.name?.update_time,
    description: metadataPath?.thread_metadata?.description?.text,
    descriptionTime: +metadataPath?.thread_metadata?.description?.update_time,
    invite: metadataPath?.thread_metadata?.invite,
    picture: getUrlFromDirectPath(metadataPath?.thread_metadata?.picture?.direct_path || ''),
    preview: getUrlFromDirectPath(metadataPath?.thread_metadata?.preview?.direct_path || ''),
    reaction_codes: metadataPath?.thread_metadata?.settings?.reaction_codes?.value,
    subscribers: +metadataPath?.thread_metadata?.subscribers_count,
    verification: metadataPath?.thread_metadata?.verification,
    viewer_metadata: metadataPath?.viewer_metadata
  };
};

